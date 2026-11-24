// ---------------------------------------------------------------------------
// M8. Подработки: такси, Vigilante, курьер, уличная гонка, Rampage.
//
// Свой стейт, отдельный от MissionSystem (R-02): заказ и подработка могут
// идти параллельно. Все таймеры — в фиксированном шаге.
//
// Система не рисует и не платит сама: награда/розыск/тосты — колбэки app.
// Машины работ — обычные VehicleState; соперников гонки шагает эта система
// (bootstrap их пропускает через owns), машину такси/полиции — обычная физика.
// ---------------------------------------------------------------------------

import type { EntityId, EntityRegistry } from '../core/registry';
import { mulberry32 } from '../core/rng';
import type { RandomSource } from '../core/rng';
import { JOBS, JOB_RULES, findJobDef } from '../config/jobs';
import type { JobDef } from '../config/jobs';
import type { VehicleTypeId } from '../config/vehicles';
import { destroyVehicle, repositionVehicle } from '../entities/vehicle';
import type { VehicleFleet, VehicleState } from '../entities/vehicle';
import { driveTowards } from './traffic';
import type { VehicleInput, VehiclePhysics } from './vehiclePhysics';

export type JobPhase = 'toVehicle' | 'toStart' | 'target';

export type JobFailReason = 'timeout' | 'wrecked' | 'abandoned' | 'rival';

/** Снимок игрока, нужный подработкам. */
export interface JobPlayer {
  readonly x: number;
  readonly z: number;
  readonly speed: number;
  readonly inVehicle: boolean;
  readonly vehicleId: number;
  readonly vehicleType: VehicleTypeId | null;
}

/** Как показать цель в HUD. */
export type JobObjectiveMode = 'vehicle' | 'start' | 'stop' | 'checkpoint' | 'rampage';

export interface JobHudState {
  readonly id: string;
  readonly titleKey: string;
  readonly descKey: string;
  readonly mode: JobObjectiveMode;
  readonly placeKey: string;
  /** Номер цели 1..total (0 — ещё не на маршруте). */
  readonly index: number;
  readonly total: number;
  readonly remaining: number;
  /** Курьер: время на текущую точку (null — нет). */
  readonly legRemaining: number | null;
  readonly distance: number;
  readonly wrecks: number;
  readonly wreckTarget: number;
  /** Игрок не в машине, а работа требует машину. */
  readonly needVehicle: boolean;
  readonly urgent: boolean;
}

export interface JobMarker {
  readonly x: number;
  readonly z: number;
  readonly radius: number;
  readonly color: number;
}

export interface JobStatusEntry {
  readonly def: JobDef;
  /** Секунд до снятия кулдауна (0 — доступна). */
  readonly cooldown: number;
}

export interface JobsSaveState {
  readonly completed: number;
  readonly counts: Record<string, number>;
  readonly kinds: string[];
  readonly cooldowns: Record<string, number>;
}

/** Запрос на спавн машины подработки: app решает, где и как её поставить. */
export interface JobSpawnRequest {
  readonly def: JobDef;
  readonly type: VehicleTypeId;
  readonly colorIndex: number;
  readonly x: number;
  readonly z: number;
  readonly heading: number;
}

export interface JobsOptions {
  readonly fleet: VehicleFleet;
  readonly registry: EntityRegistry;
  readonly physics: VehiclePhysics;
  readonly playerId: EntityId;
  readonly seed?: number;
  /** Свободная точка рядом с игроком (bootstrap проверяет коллайдеры). */
  findSpot?: (minDistance: number, maxDistance: number, radius: number) => { x: number; z: number; heading: number } | null;
  /** Спавн машины в явной точке; null — не удалось. */
  onSpawnVehicle?: (request: JobSpawnRequest) => VehicleState | null;
  onStart?: (def: JobDef) => void;
  onComplete?: (def: JobDef, reward: number, tip: number) => void;
  onFail?: (def: JobDef, reason: JobFailReason) => void;
  onStage?: (def: JobDef, index: number, total: number) => void;
  onWreck?: (def: JobDef, done: number, total: number) => void;
  onNews?: (kind: 'start' | 'complete' | 'fail', def: JobDef) => void;
}

interface Rival {
  readonly vehicle: VehicleState;
  index: number;
  stuck: number;
  readonly input: VehicleInput;
}

interface ActiveJob {
  readonly def: JobDef;
  phase: JobPhase;
  elapsed: number;
  timeLeft: number;
  legLeft: number;
  stopIndex: number;
  hold: number;
  wrecks: number;
  distance: number;
  jobVehicle: VehicleState | null;
  readonly rivals: Rival[];
}

const RIVAL_TYPES: readonly VehicleTypeId[] = ['sports', 'sports'];

export class JobsSystem {
  readonly stats = { completed: 0, failed: 0 };

  private readonly fleet: VehicleFleet;
  private readonly registry: EntityRegistry;
  private readonly physics: VehiclePhysics;
  private readonly rng: RandomSource;
  private readonly cooldowns = new Map<string, number>();
  private readonly counts = new Map<string, number>();
  private readonly kinds = new Set<string>();
  private readonly onSpawnVehicleHook: JobsOptions['onSpawnVehicle'] | null;
  private readonly findSpotHook: JobsOptions['findSpot'] | null;
  private readonly onStartHook: JobsOptions['onStart'] | null;
  private readonly onCompleteHook: JobsOptions['onComplete'] | null;
  private readonly onFailHook: JobsOptions['onFail'] | null;
  private readonly onStageHook: JobsOptions['onStage'] | null;
  private readonly onWreckHook: JobsOptions['onWreck'] | null;
  private readonly onNewsHook: JobsOptions['onNews'] | null;

  private active: ActiveJob | null = null;
  private playerX = 0;
  private playerZ = 0;
  private playerInVehicle = false;
  private playerVehicleId = -1;

  constructor(options: JobsOptions) {
    this.fleet = options.fleet;
    this.registry = options.registry;
    this.physics = options.physics;
    this.rng = mulberry32(options.seed ?? 0x1a8f);
    this.findSpotHook = options.findSpot ?? null;
    this.onSpawnVehicleHook = options.onSpawnVehicle ?? null;
    this.onStartHook = options.onStart ?? null;
    this.onCompleteHook = options.onComplete ?? null;
    this.onFailHook = options.onFail ?? null;
    this.onStageHook = options.onStage ?? null;
    this.onWreckHook = options.onWreck ?? null;
    this.onNewsHook = options.onNews ?? null;
  }

  get activeId(): string | null {
    return this.active ? this.active.def.id : null;
  }

  get activeDef(): JobDef | null {
    return this.active ? this.active.def : null;
  }

  /** Соперников гонки шагает эта система. */
  owns(id: EntityId): boolean {
    const active = this.active;
    if (!active) return false;
    for (let i = 0; i < active.rivals.length; i += 1) {
      if (active.rivals[i].vehicle.id === id) return true;
    }
    return false;
  }

  cooldownLeft(id: string): number {
    return this.cooldowns.get(id) ?? 0;
  }

  completedCount(id?: string): number {
    if (id !== undefined) return this.counts.get(id) ?? 0;
    let sum = 0;
    for (const value of this.counts.values()) sum += value;
    return sum;
  }

  /** Сколько разных типов подработок пройдено (для достижений). */
  get kindsCompleted(): number {
    return this.kinds.size;
  }

  statuses(): JobStatusEntry[] {
    const out: JobStatusEntry[] = [];
    for (let i = 0; i < JOBS.length; i += 1) {
      out.push({ def: JOBS[i], cooldown: this.cooldowns.get(JOBS[i].id) ?? 0 });
    }
    return out;
  }

  isAvailable(id: string): boolean {
    return (this.cooldowns.get(id) ?? 0) <= 0;
  }

  /** Взять подработку. false — занято/кулдаун/не удалось найти место. */
  start(id: string): boolean {
    if (this.active) return false;
    const def = findJobDef(id);
    if (!def) return false;
    if ((this.cooldowns.get(def.id) ?? 0) > 0) return false;

    let phase: JobPhase = def.vehicleType ? 'toVehicle' : def.stops.length > 0 ? 'toStart' : 'target';
    let jobVehicle: VehicleState | null = null;

    if (def.vehicleType) {
      const spot = this.findSpotHook ? this.findSpotHook(JOB_RULES.spawnMinDistance, JOB_RULES.spawnMaxDistance, 3.2) : null;
      if (!spot) return false;
      jobVehicle = this.spawn({ def, type: def.vehicleType, colorIndex: def.vehicleColor, x: spot.x, z: spot.z, heading: spot.heading });
      if (!jobVehicle) return false;
      phase = 'toVehicle';
    }

    const active: ActiveJob = {
      def,
      phase,
      elapsed: 0,
      timeLeft: def.duration,
      legLeft: def.legTime > 0 ? def.legTime : 0,
      stopIndex: 0,
      hold: 0,
      wrecks: 0,
      distance: 0,
      jobVehicle,
      rivals: [],
    };

    if (def.id === 'race') this.spawnRivals(active);
    this.active = active;
    if (this.onStartHook) this.onStartHook(def);
    if (this.onNewsHook) this.onNewsHook('start', def);
    return true;
  }

  /** Отказаться от подработки (без награды). */
  abandon(): boolean {
    if (!this.active) return false;
    this.fail('abandoned');
    return true;
  }

  /** Шаг подработки: таймеры, этапы, успех/провал. */
  update(dt: number, player: JobPlayer): void {
    this.tickCooldowns(dt);
    const active = this.active;
    if (!active) return;

    this.playerX = player.x;
    this.playerZ = player.z;
    this.playerInVehicle = player.inVehicle;
    this.playerVehicleId = player.vehicleId;

    const def = active.def;
    active.elapsed += dt;
    active.timeLeft -= dt;

    if (active.timeLeft <= 0) {
      this.fail('timeout');
      return;
    }

    // Машина подработки уничтожена — работа провалена.
    if (active.jobVehicle && active.jobVehicle.wrecked) {
      if (player.vehicleId === active.jobVehicle.id) {
        this.fail('wrecked');
        return;
      }
      if (active.jobVehicle.driver < 0) {
        this.fail('wrecked');
        return;
      }
    }

    // Такси/полиция: игрок вышел из выданной машины — цель снова «сядь в машину».
    if (active.jobVehicle) {
      const inside = player.vehicleId === active.jobVehicle.id;
      if (inside && active.phase === 'toVehicle') {
        active.phase = 'target';
        if (this.onStageHook) this.onStageHook(def, 0, def.stops.length);
      } else if (!inside) {
        active.phase = 'toVehicle';
      }
    }

    if (def.legTime > 0 && active.phase === 'target') {
      active.legLeft -= dt;
      if (active.legLeft <= 0) {
        this.fail('timeout');
        return;
      }
    }

    if (def.id === 'rampage') {
      active.distance = 0;
      if (active.wrecks >= def.wrecks) this.succeed();
      return;
    }

    if (def.id === 'race') this.stepRivals(active, dt);

    const stop = def.stops[Math.min(active.stopIndex, def.stops.length - 1)];
    if (!stop) {
      this.fail('abandoned');
      return;
    }
    const dx = stop.x - player.x;
    const dz = stop.z - player.z;
    active.distance = Math.hypot(dx, dz);

    if (active.phase === 'toVehicle') return;

    const inZone = active.distance <= def.targetRadius;
    if (def.id === 'taxi' || def.id === 'vigilante') {
      if (inZone && player.vehicleId === active.jobVehicle?.id) {
        active.hold += dt;
        if (active.hold >= JOB_RULES.holdTime) this.advance(active, stop.x, stop.z);
      } else {
        active.hold = Math.max(0, active.hold - dt * 2);
      }
      return;
    }

    if (def.id === 'courier') {
      if (inZone && player.inVehicle) this.advance(active, stop.x, stop.z);
      return;
    }

    if (def.id === 'race') {
      if (inZone && player.inVehicle) this.advance(active, stop.x, stop.z);
    }
  }

  /** Разбитая машина: зачёт Rampage, если рядом с игроком. */
  notifyWreck(x: number, z: number): void {
    const active = this.active;
    if (!active || active.def.id !== 'rampage') return;
    const dx = x - this.playerX;
    const dz = z - this.playerZ;
    if (dx * dx + dz * dz > JOB_RULES.rampageRadius * JOB_RULES.rampageRadius) return;
    active.wrecks += 1;
    if (this.onWreckHook) this.onWreckHook(active.def, active.wrecks, active.def.wrecks);
    if (active.wrecks >= active.def.wrecks) this.succeed();
  }

  hud(): JobHudState | null {
    const active = this.active;
    if (!active) return null;
    const def = active.def;
    const isRace = def.id === 'race';
    const total = isRace ? Math.max(0, def.stops.length - 1) : def.stops.length;
    let mode: JobObjectiveMode;
    let placeKey = '';
    let index = 0;

    if (def.id === 'rampage') {
      mode = 'rampage';
    } else if (active.phase === 'toVehicle') {
      mode = 'vehicle';
      index = 0;
    } else if (active.phase === 'toStart') {
      mode = 'start';
      placeKey = def.stops[0] ? def.stops[0].placeKey : '';
    } else {
      mode = isRace ? 'checkpoint' : 'stop';
      const stop = def.stops[Math.min(active.stopIndex, def.stops.length - 1)];
      placeKey = stop ? stop.placeKey : '';
      index = isRace ? Math.min(active.stopIndex, total) : active.stopIndex + 1;
    }

    return {
      id: def.id,
      titleKey: def.titleKey,
      descKey: def.descKey,
      mode,
      placeKey,
      index,
      total,
      remaining: active.timeLeft,
      legRemaining: def.legTime > 0 && active.phase === 'target' ? Math.max(0, active.legLeft) : null,
      distance: active.distance,
      wrecks: active.wrecks,
      wreckTarget: def.wrecks,
      needVehicle: def.needVehicle && !this.playerInVehicle && mode !== 'vehicle',
      urgent: active.timeLeft <= 15 || (def.legTime > 0 && active.legLeft <= 10),
    };
  }

  marker(): JobMarker | null {
    const active = this.active;
    if (!active) return null;
    const def = active.def;
    if (def.id === 'rampage') return null;
    if (active.phase === 'toVehicle') {
      const car = active.jobVehicle;
      if (!car) return null;
      return {
        x: car.transform.x,
        z: car.transform.z,
        radius: 8,
        color: def.color,
      };
    }
    const stop = def.stops[Math.min(active.stopIndex, def.stops.length - 1)];
    if (!stop) return null;
    return {
      x: stop.x,
      z: stop.z,
      radius: def.id === 'race' ? JOB_RULES.startRadius : def.targetRadius,
      color: def.color,
    };
  }

  save(): JobsSaveState {
    const counts: Record<string, number> = {};
    for (const [id, value] of this.counts) if (value > 0) counts[id] = value;
    const cooldowns: Record<string, number> = {};
    for (const [id, value] of this.cooldowns) if (value > 0) cooldowns[id] = Math.round(value);
    return {
      completed: this.completedCount(),
      counts,
      kinds: Array.from(this.kinds),
      cooldowns,
    };
  }

  restore(state: JobsSaveState): void {
    this.counts.clear();
    this.kinds.clear();
    this.cooldowns.clear();
    for (const id of Object.keys(state.counts)) {
      const value = state.counts[id];
      if (value > 0) this.counts.set(id, Math.round(value));
    }
    for (const id of state.kinds) if (findJobDef(id)) this.kinds.add(id);
    for (const id of Object.keys(state.cooldowns)) {
      const seconds = state.cooldowns[id];
      if (seconds > 0) this.cooldowns.set(id, seconds);
    }
    this.cleanupActive();
    this.active = null;
  }

  reset(): void {
    this.counts.clear();
    this.kinds.clear();
    this.cooldowns.clear();
    this.cleanupActive();
    this.active = null;
    this.stats.completed = 0;
    this.stats.failed = 0;
  }

  // --- внутреннее ----------------------------------------------------------

  private tickCooldowns(dt: number): void {
    if (this.cooldowns.size === 0) return;
    for (const [id, seconds] of this.cooldowns) {
      const next = seconds - dt;
      if (next <= 0) this.cooldowns.delete(id);
      else this.cooldowns.set(id, next);
    }
  }

  private spawn(request: JobSpawnRequest): VehicleState | null {
    if (!this.onSpawnVehicleHook) return null;
    return this.onSpawnVehicleHook(request);
  }

  private spawnRivals(active: ActiveJob): void {
    const def = active.def;
    const start = def.stops[0];
    const next = def.stops[1] ?? def.stops[0];
    if (!start) return;
    const heading = Math.atan2(next.x - start.x, next.z - start.z);
    const cos = Math.cos(heading);
    const sin = Math.sin(heading);
    for (let i = 0; i < def.rivals; i += 1) {
      const side = (i === 0 ? 1 : -1) * 2.8;
      const x = start.x + cos * side;
      const z = start.z - sin * side;
      const vehicle = this.spawn({
        def,
        type: RIVAL_TYPES[i % RIVAL_TYPES.length],
        colorIndex: i + 2 + Math.floor(this.rng() * 2),
        x,
        z,
        heading,
      });
      if (!vehicle) continue;
      active.rivals.push({
        vehicle,
        index: 1,
        stuck: 0,
        input: { throttle: 0, brake: 0, steer: 0, handbrake: false },
      });
    }
  }

  private stepRivals(active: ActiveJob, dt: number): void {
    // До пересечения стартовой линии соперники стоят на месте.
    if (active.phase !== 'target') return;
    const def = active.def;
    for (let i = 0; i < active.rivals.length; i += 1) {
      const rival = active.rivals[i];
      if (rival.vehicle.wrecked || rival.vehicle.driver >= 0) continue;
      const target = def.stops[rival.index];
      if (!target) {
        rival.index = def.stops.length;
        continue;
      }
      const transform = rival.vehicle.transform;
      const dx = target.x - transform.x;
      const dz = target.z - transform.z;
      const distance = Math.hypot(dx, dz);
      if (distance <= JOB_RULES.rivalRadius) {
        rival.index += 1;
        rival.stuck = 0;
        if (rival.index >= def.stops.length) {
          this.fail('rival');
          return;
        }
        continue;
      }

      const speed = Math.hypot(transform.vx, transform.vz);
      if (speed < 1.2) rival.stuck += dt;
      else rival.stuck = Math.max(0, rival.stuck - dt);
      if (rival.stuck > JOB_RULES.rivalStuckTime) {
        // Соперник застрял: переносим к цели, чтобы гонка не вставала (R-07).
        const heading = Math.atan2(dx, dz);
        repositionVehicle(this.registry, rival.vehicle, target.x - Math.sin(heading) * 10, target.z - Math.cos(heading) * 10, heading);
        rival.stuck = 0;
        continue;
      }

      driveTowards(
        rival.input,
        transform.x,
        transform.z,
        transform.heading,
        transform.vx,
        transform.vz,
        target.x,
        target.z,
        JOB_RULES.rivalSpeed,
      );
      this.physics.step(rival.vehicle, rival.input, dt);
    }
  }

  /** Дошли до точки: следующая или финиш. */
  private advance(active: ActiveJob, _x: number, _z: number): void {
    const def = active.def;
    // На старте гонки первая точка — линия старта, а не чекпоинт.
    if (active.phase === 'toStart') {
      active.phase = 'target';
      active.stopIndex = 1;
      active.hold = 0;
      if (this.onStageHook) this.onStageHook(def, 0, Math.max(0, def.stops.length - 1));
      return;
    }
    active.stopIndex += 1;
    active.hold = 0;
    if (def.legTime > 0) active.legLeft = def.legTime;
    if (active.stopIndex >= def.stops.length) {
      this.succeed();
      return;
    }
    if (this.onStageHook) {
      this.onStageHook(
        def,
        active.stopIndex,
        def.id === 'race' ? Math.max(0, def.stops.length - 1) : def.stops.length,
      );
    }
  }

  private succeed(): void {
    const active = this.active;
    if (!active) return;
    const def = active.def;
    let tip = 0;
    if (def.tipWindow > 0 && active.timeLeft >= def.tipWindow) tip = def.tipBonus;
    const reward = def.reward + tip;
    this.finishActive();
    this.counts.set(def.id, (this.counts.get(def.id) ?? 0) + 1);
    this.kinds.add(def.id);
    this.stats.completed += 1;
    this.cooldowns.set(def.id, def.cooldown);
    if (this.onCompleteHook) this.onCompleteHook(def, reward, tip);
    if (this.onNewsHook) this.onNewsHook('complete', def);
  }

  private fail(reason: JobFailReason): void {
    const active = this.active;
    if (!active) return;
    const def = active.def;
    this.finishActive();
    this.stats.failed += 1;
    this.cooldowns.set(def.id, Math.min(30, def.cooldown));
    if (this.onFailHook) this.onFailHook(def, reason);
    if (this.onNewsHook) this.onNewsHook('fail', def);
  }

  /** Завершение: освободить машины, кроме тех, что забрал игрок (R-10). */
  private finishActive(): void {
    this.cleanupActive();
    this.active = null;
  }

  private cleanupActive(): void {
    const active = this.active;
    if (!active) return;
    const car = active.jobVehicle;
    if (car && car.driver < 0 && car.id !== this.playerVehicleId) {
      destroyVehicle(this.fleet, this.registry, car);
    }
    for (let i = 0; i < active.rivals.length; i += 1) {
      const rival = active.rivals[i].vehicle;
      if (rival.driver >= 0) continue;
      destroyVehicle(this.fleet, this.registry, rival);
    }
    active.rivals.length = 0;
    active.jobVehicle = null;
  }
}
