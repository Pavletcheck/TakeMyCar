// ---------------------------------------------------------------------------
// M8. Коллекции: пакеты на тротуарах, трамплины, уникальные машины.
//
// Проверки подбора идут не каждый тик, а раз в COLLECTIBLE_RULES.checkInterval
// (PERF-05). «Полёт» с трамплина — чисто триггерный: вертикальной физики в игре
// нет (R-12), поэтому считаем дистанцию и время на скорости, а подъём рисует
// render/lifePropsView. Награды и тексты — колбэки app; система не знает DOM.
// ---------------------------------------------------------------------------

import {
  CAR_MILESTONE,
  COLLECTIBLE_RULES,
  PACKAGE_MILESTONES,
  RAMP_MILESTONES,
} from '../config/collectibles';
import type { RampDef, WorldPoint } from '../config/collectibles';

export type CollectKind = 'package' | 'ramp' | 'car';

/** Одно начисление: пакет/трамплин/машина либо рубеж (10/20/30/40). */
export interface CollectEvent {
  readonly kind: CollectKind;
  /** Индекс предмета или число рубежа для milestone. */
  readonly index: number;
  readonly found: number;
  readonly total: number;
  readonly reward: number;
  readonly milestone: boolean;
  /** Ключ названия уникальной машины (иначе null). */
  readonly nameKey: string | null;
}

export interface CollectPlayer {
  readonly x: number;
  readonly z: number;
  readonly speed: number;
  readonly inVehicle: boolean;
  readonly vehicleId: number;
}

/** Слот уникальной машины: заполняется, когда app её заспавнил. */
export interface UniqueCarSlot {
  readonly index: number;
  readonly nameKey: string;
  vehicleId: number;
  x: number;
  z: number;
}

export interface CollectiblesSaveState {
  readonly packages: number[];
  readonly ramps: number[];
  readonly uniqueCars: number[];
}

export interface CollectiblesOptions {
  readonly packages: readonly WorldPoint[];
  readonly ramps: readonly RampDef[];
  /** Ключи названий уникальных машин по порядку якорей. */
  readonly carNames: readonly string[];
  readonly garage: WorldPoint;
  readonly garageRadius?: number;
  onCollect?: (event: CollectEvent) => void;
}

export class CollectiblesSystem {
  private readonly packages: readonly WorldPoint[];
  private readonly ramps: readonly RampDef[];
  private readonly carNames: readonly string[];
  private readonly garage: WorldPoint;
  private readonly garageRadius: number;
  private readonly onCollectHook: CollectiblesOptions['onCollect'] | null;

  private readonly packageTaken: Uint8Array;
  private readonly rampTaken: Uint8Array;
  private readonly rampCooldown: Float32Array;
  private readonly carSlots: UniqueCarSlot[] = [];
  private readonly carTaken: Uint8Array;
  private readonly lootScratch: number[] = [];

  private packageCount = 0;
  private rampCount = 0;
  private carCount = 0;
  private checkTimer = 0;

  private flightIndex = -1;
  private flightTime = 0;
  private flightDistance = 0;
  private flightX = 0;
  private flightZ = 0;

  constructor(options: CollectiblesOptions) {
    this.packages = options.packages;
    this.ramps = options.ramps;
    this.carNames = options.carNames;
    this.garage = options.garage;
    this.garageRadius = options.garageRadius ?? COLLECTIBLE_RULES.garageRadius;
    this.onCollectHook = options.onCollect ?? null;
    this.packageTaken = new Uint8Array(options.packages.length);
    this.rampTaken = new Uint8Array(options.ramps.length);
    this.rampCooldown = new Float32Array(options.ramps.length);
    this.carTaken = new Uint8Array(options.carNames.length);
    for (let i = 0; i < options.carNames.length; i += 1) {
      this.carSlots.push({
        index: i,
        nameKey: options.carNames[i],
        vehicleId: -1,
        x: 0,
        z: 0,
      });
    }
  }

  get packagesFound(): number {
    return this.packageCount;
  }

  get rampsFound(): number {
    return this.rampCount;
  }

  get carsFound(): number {
    return this.carCount;
  }

  get packagesTotal(): number {
    return this.packages.length;
  }

  get rampsTotal(): number {
    return this.ramps.length;
  }

  get carsTotal(): number {
    return this.carNames.length;
  }

  get activeFlight(): boolean {
    return this.flightIndex >= 0;
  }

  /** 0..1 — прогресс текущего полёта (для эффекта камеры). */
  get flightProgress(): number {
    if (this.flightIndex < 0) return 0;
    return Math.min(1, this.flightDistance / COLLECTIBLE_RULES.rampMinDistance);
  }

  get packagePoints(): readonly WorldPoint[] {
    return this.packages;
  }

  get rampPoints(): readonly RampDef[] {
    return this.ramps;
  }

  get uniqueCars(): readonly UniqueCarSlot[] {
    return this.carSlots;
  }

  get loot(): readonly number[] {
    return this.lootScratch;
  }

  /** Маски для вида коллекций (0/1 по индексу). */
  get packageMask(): Uint8Array {
    return this.packageTaken;
  }

  get rampMask(): Uint8Array {
    return this.rampTaken;
  }

  isPackageCollected(index: number): boolean {
    return this.packageTaken[index] === 1;
  }

  isRampJumped(index: number): boolean {
    return this.rampTaken[index] === 1;
  }

  isCarDelivered(index: number): boolean {
    return this.carTaken[index] === 1;
  }

  /** App заспавнил уникальную машину — запоминаем её id и место. */
  registerCar(index: number, vehicleId: number, x: number, z: number): void {
    const slot = this.carSlots[index];
    if (!slot) return;
    slot.vehicleId = vehicleId;
    slot.x = x;
    slot.z = z;
  }

  update(dt: number, player: CollectPlayer): void {
    if (this.flightIndex >= 0) this.stepFlight(dt, player);

    this.checkTimer -= dt;
    if (this.checkTimer > 0) return;
    this.checkTimer = COLLECTIBLE_RULES.checkInterval;

    const packageRadius = COLLECTIBLE_RULES.packageRadius;
    const packageRadiusSq = packageRadius * packageRadius;
    for (let i = 0; i < this.packages.length; i += 1) {
      if (this.packageTaken[i] === 1) continue;
      const point = this.packages[i];
      const dx = point.x - player.x;
      const dz = point.z - player.z;
      if (dx * dx + dz * dz > packageRadiusSq) continue;
      this.takePackage(i);
    }

    if (this.flightIndex < 0 && player.inVehicle) this.tryRamp(player);

    if (player.inVehicle && player.vehicleId >= 0) {
      const dx = player.x - this.garage.x;
      const dz = player.z - this.garage.z;
      if (dx * dx + dz * dz <= this.garageRadius * this.garageRadius) {
        for (let i = 0; i < this.carSlots.length; i += 1) {
          if (this.carTaken[i] === 1) continue;
          if (this.carSlots[i].vehicleId !== player.vehicleId) continue;
          this.deliverCar(i);
          break;
        }
      }
    }

    // Кулдауны трамплинов тикают на медленном шаге проверки — этого достаточно.
    for (let i = 0; i < this.rampCooldown.length; i += 1) {
      if (this.rampCooldown[i] > 0) this.rampCooldown[i] = Math.max(0, this.rampCooldown[i] - COLLECTIBLE_RULES.checkInterval);
    }
  }

  /**
   * Ближайшие не подобранные предметы (пары x,z) в радиусе — для мини-карты.
   * Пишет в переиспользуемый массив, возвращает число пар.
   */
  nearestLoot(x: number, z: number, radius: number, limit: number): number {
    const out = this.lootScratch;
    out.length = 0;
    const radiusSq = radius * radius;
    let count = 0;
    for (let i = 0; i < this.packages.length && count < limit; i += 1) {
      if (this.packageTaken[i] === 1) continue;
      const point = this.packages[i];
      const dx = point.x - x;
      const dz = point.z - z;
      if (dx * dx + dz * dz > radiusSq) continue;
      out.push(point.x, point.z, 0);
      count += 1;
    }
    for (let i = 0; i < this.carSlots.length && count < limit; i += 1) {
      if (this.carTaken[i] === 1) continue;
      const slot = this.carSlots[i];
      if (slot.vehicleId < 0) continue;
      const dx = slot.x - x;
      const dz = slot.z - z;
      if (dx * dx + dz * dz > radiusSq) continue;
      out.push(slot.x, slot.z, 1);
      count += 1;
    }
    return count;
  }

  save(): CollectiblesSaveState {
    const packages: number[] = [];
    for (let i = 0; i < this.packageTaken.length; i += 1) if (this.packageTaken[i] === 1) packages.push(i);
    const ramps: number[] = [];
    for (let i = 0; i < this.rampTaken.length; i += 1) if (this.rampTaken[i] === 1) ramps.push(i);
    const uniqueCars: number[] = [];
    for (let i = 0; i < this.carTaken.length; i += 1) if (this.carTaken[i] === 1) uniqueCars.push(i);
    return { packages, ramps, uniqueCars };
  }

  restore(state: CollectiblesSaveState): void {
    this.packageTaken.fill(0);
    this.rampTaken.fill(0);
    this.carTaken.fill(0);
    this.packageCount = 0;
    this.rampCount = 0;
    this.carCount = 0;
    this.flightIndex = -1;
    const mark = (array: Uint8Array, values: readonly number[]): number => {
      let found = 0;
      for (let i = 0; i < values.length; i += 1) {
        const index = values[i];
        if (!Number.isInteger(index) || index < 0 || index >= array.length) continue;
        if (array[index] === 1) continue;
        array[index] = 1;
        found += 1;
      }
      return found;
    };
    this.packageCount = mark(this.packageTaken, state.packages);
    this.rampCount = mark(this.rampTaken, state.ramps);
    this.carCount = mark(this.carTaken, state.uniqueCars);
    for (let i = 0; i < this.carSlots.length; i += 1) {
      if (this.carTaken[i] === 1) {
        this.carSlots[i].vehicleId = -1;
        this.carSlots[i].x = 0;
        this.carSlots[i].z = 0;
      }
    }
  }

  reset(): void {
    this.packageTaken.fill(0);
    this.rampTaken.fill(0);
    this.carTaken.fill(0);
    this.rampCooldown.fill(0);
    this.packageCount = 0;
    this.rampCount = 0;
    this.carCount = 0;
    this.flightIndex = -1;
    for (let i = 0; i < this.carSlots.length; i += 1) {
      this.carSlots[i].vehicleId = -1;
      this.carSlots[i].x = 0;
      this.carSlots[i].z = 0;
    }
  }

  // --- внутреннее ----------------------------------------------------------

  private takePackage(index: number): void {
    if (this.packageTaken[index] === 1) return;
    this.packageTaken[index] = 1;
    this.packageCount += 1;
    this.emit('package', index, this.packageCount, this.packages.length, COLLECTIBLE_RULES.packageReward, false, null);
    this.emitMilestone('package', this.packageCount, this.packages.length, PACKAGE_MILESTONES);
  }

  private deliverCar(index: number): void {
    if (this.carTaken[index] === 1) return;
    this.carTaken[index] = 1;
    this.carCount += 1;
    this.emit('car', index, this.carCount, this.carSlots.length, COLLECTIBLE_RULES.carReward, false, this.carSlots[index].nameKey);
    this.emitMilestone('car', this.carCount, this.carSlots.length, [CAR_MILESTONE]);
  }

  private tryRamp(player: CollectPlayer): void {
    const radiusSq = COLLECTIBLE_RULES.rampRadius * COLLECTIBLE_RULES.rampRadius;
    for (let i = 0; i < this.ramps.length; i += 1) {
      if (this.rampTaken[i] === 1) continue;
      if (this.rampCooldown[i] > 0) continue;
      const ramp = this.ramps[i];
      const dx = ramp.x - player.x;
      const dz = ramp.z - player.z;
      if (dx * dx + dz * dz > radiusSq) continue;
      if (player.speed < COLLECTIBLE_RULES.rampMinSpeed) continue;
      this.flightIndex = i;
      this.flightTime = 0;
      this.flightDistance = 0;
      this.flightX = player.x;
      this.flightZ = player.z;
      this.rampCooldown[i] = COLLECTIBLE_RULES.rampCooldown;
      return;
    }
  }

  private stepFlight(dt: number, player: CollectPlayer): void {
    this.flightTime += dt;
    const dx = player.x - this.flightX;
    const dz = player.z - this.flightZ;
    this.flightDistance += Math.hypot(dx, dz);
    this.flightX = player.x;
    this.flightZ = player.z;

    const done =
      !player.inVehicle ||
      this.flightTime >= COLLECTIBLE_RULES.rampMaxTime ||
      player.speed < COLLECTIBLE_RULES.rampEndSpeed;
    if (!done) return;

    const index = this.flightIndex;
    this.flightIndex = -1;
    if (this.flightDistance < COLLECTIBLE_RULES.rampMinDistance) return;
    if (this.rampTaken[index] === 1) return;
    this.rampTaken[index] = 1;
    this.rampCount += 1;
    this.emit('ramp', index, this.rampCount, this.ramps.length, COLLECTIBLE_RULES.rampReward, false, null);
    this.emitMilestone('ramp', this.rampCount, this.ramps.length, RAMP_MILESTONES);
  }

  private emitMilestone(kind: CollectKind, found: number, total: number, list: readonly { count: number; reward: number }[]): void {
    for (let i = 0; i < list.length; i += 1) {
      if (list[i].count !== found) continue;
      this.emit(kind, found, found, total, list[i].reward, true, null);
      return;
    }
  }

  private emit(
    kind: CollectKind,
    index: number,
    found: number,
    total: number,
    reward: number,
    milestone: boolean,
    nameKey: string | null,
  ): void {
    if (!this.onCollectHook) return;
    this.onCollectHook({ kind, index, found, total, reward, milestone, nameKey });
  }
}
