// ---------------------------------------------------------------------------
// M4. Машина как сущность: состояние, флот, коллайдер, повреждения.
//
// Машина — запись VehicleState поверх компонентов EntityRegistry:
// transform и collider берутся из реестра, поэтому физика ядра
// (moveCircle + SpatialHash) видит её без отдельного пути.
//
// VehicleFleet — плотный массив + Map(id → индекс) для горячего цикла:
// итерация по индексу не создаёт итераторов и не аллоцирует.
// ---------------------------------------------------------------------------

import type { Collider } from '../core/math';
import { clamp } from '../core/math';
import type { EntityId, EntityRegistry, Transform2D } from '../core/registry';
import {
  DEFAULT_VEHICLE_TYPE,
  VEHICLE_HANDLING,
  VEHICLES,
  isVehicleType,
  vehicleColliderRadius,
} from '../config/vehicles';
import type { VehicleConfig, VehicleTypeId } from '../config/vehicles';

/** Состояние одной машины. Ссылки на transform/collider не копируются. */
export interface VehicleState {
  readonly id: EntityId;
  readonly type: VehicleTypeId;
  readonly config: VehicleConfig;
  readonly transform: Transform2D;
  readonly collider: Collider | null;
  /** Индекс инстанса в рендер-слое (не id реестра). */
  handle: number;
  /** Прочность: hp / maxHp. */
  hp: number;
  readonly maxHp: number;
  /** Кто за рулём: id игрока или -1. */
  driver: EntityId | -1;
  /** Уничтожена: газ/руль игнорируются, дым идёт постоянно. */
  wrecked: boolean;
  /** Переход в wrecked на этом шаге — рендер/звук забирают флаг. */
  justWrecked: boolean;
  /** Продольная скорость в осях машины, м/с. */
  forward: number;
  /** Поперечная скорость (снос), м/с. */
  lateral: number;
  /** Визуальное положение руля −1…1. */
  steer: number;
  /** Модуль бокового скольжения для следов и звука, м/с. */
  slip: number;
  /** Нормализованные обороты двигателя 0…1 (хук звука). */
  rpm: number;
  /** Нормальная скорость последнего удара, м/с (HUD/камера). */
  lastImpact: number;
  /** Непрочитанный импульс удара для тряски камеры, м/с. */
  impactPulse: number;
  /** Порог дыма пройден. */
  smoking: boolean;
  /** Цвет кузова из палитры типа. */
  readonly color: number;
  readonly colorIndex: number;
}

/** Плотный список машин: swap-remove не нужен (машины удаляются редко). */
export class VehicleFleet {
  /** Горячий массив; итерируется по индексу без итераторов. */
  readonly list: VehicleState[] = [];
  private readonly indexById = new Map<EntityId, number>();
  private nextHandle = 0;

  get size(): number {
    return this.list.length;
  }

  /** Стабильный номер инстанса для рендера. */
  allocHandle(): number {
    const handle = this.nextHandle;
    this.nextHandle += 1;
    return handle;
  }

  add(state: VehicleState): void {
    this.indexById.set(state.id, this.list.length);
    this.list.push(state);
  }

  get(id: EntityId): VehicleState | undefined {
    const index = this.indexById.get(id);
    return index === undefined ? undefined : this.list[index];
  }

  /** Удаление сохраняет порядок списка (важно для таймеров дыма/следов). */
  remove(id: EntityId): VehicleState | null {
    const index = this.indexById.get(id);
    if (index === undefined) return null;
    const state = this.list[index];
    this.list.splice(index, 1);
    this.indexById.delete(id);
    for (let i = index; i < this.list.length; i += 1) this.indexById.set(this.list[i].id, i);
    return state;
  }

  clear(): void {
    this.list.length = 0;
    this.indexById.clear();
    this.nextHandle = 0;
  }
}

export interface CreateVehicleOptions {
  type?: VehicleTypeId;
  x: number;
  z: number;
  heading: number;
  /** Индекс цвета в палитре типа; по умолчанию 0. */
  colorIndex?: number;
}

/**
 * Создать машину: слот реестра, коллайдер в SpatialHash, renderRef.
 * Возвращает состояние, положенное во флот.
 */
export function createVehicle(
  fleet: VehicleFleet,
  registry: EntityRegistry,
  options: CreateVehicleOptions,
): VehicleState {
  const type = options.type ?? DEFAULT_VEHICLE_TYPE;
  const config = VEHICLES[type];
  const entity = registry.create('vehicle');
  const transform = entity.transform;

  transform.x = options.x;
  transform.z = options.z;
  transform.heading = options.heading;
  transform.vx = 0;
  transform.vz = 0;
  transform.prevX = options.x;
  transform.prevZ = options.z;
  transform.prevHeading = options.heading;

  const colorIndex =
    options.colorIndex === undefined
      ? 0
      : ((options.colorIndex % config.colors.length) + config.colors.length) % config.colors.length;
  const handle = fleet.allocHandle();

  const collider = registry.attachCollider(
    entity.id,
    config.width / 2,
    config.length / 2,
    options.heading,
  );
  registry.attachRenderRef(entity.id, handle, colorIndex);

  const state: VehicleState = {
    id: entity.id,
    type,
    config,
    transform,
    collider,
    handle,
    hp: config.hp,
    maxHp: config.hp,
    driver: -1,
    wrecked: false,
    justWrecked: false,
    forward: 0,
    lateral: 0,
    steer: 0,
    slip: 0,
    rpm: 0,
    lastImpact: 0,
    impactPulse: 0,
    smoking: false,
    color: config.colors[colorIndex],
    colorIndex,
  };

  fleet.add(state);
  return state;
}

/** Пометить машину мёртвой; коллайдер снимется в registry.flush(). */
export function destroyVehicle(fleet: VehicleFleet, registry: EntityRegistry, state: VehicleState): void {
  fleet.remove(state.id);
  registry.destroy(state.id);
}

/** Радиус коллайдера конкретной машины (формула общая для физики и вида). */
export function vehicleRadius(state: VehicleState): number {
  return vehicleColliderRadius(state.config);
}

/**
 * Перенести машину и обнулить скорость (респавн, телепорт, выход из ямы).
 * Коллайдер сразу переезжает в хэше, чтобы не было «фантома» на старом месте.
 */
export function repositionVehicle(
  registry: EntityRegistry,
  state: VehicleState,
  x: number,
  z: number,
  heading: number,
): void {
  const transform = state.transform;
  transform.x = x;
  transform.z = z;
  transform.heading = heading;
  transform.vx = 0;
  transform.vz = 0;
  transform.prevX = x;
  transform.prevZ = z;
  transform.prevHeading = heading;
  state.forward = 0;
  state.lateral = 0;
  state.slip = 0;
  state.steer = 0;
  registry.updateCollider(state.id);
}

/**
 * Урон от удара. Возвращает true, если машина только что перешла в wrecked
 * (для звука взрыва и вспышки — без крови и расчленёнки).
 */
export function damageVehicle(state: VehicleState, amount: number): boolean {
  if (amount <= 0 || state.wrecked) return false;
  state.hp = Math.max(0, state.hp - amount);
  state.smoking = state.hp / state.maxHp < VEHICLE_HANDLING.smokeRatio;
  if (state.hp > 0) return false;
  state.wrecked = true;
  state.justWrecked = true;
  state.rpm = 0;
  return true;
}

/** Ремонт через API (гараж в M6, отладка, R). */
export function repairVehicle(state: VehicleState, amount = Number.POSITIVE_INFINITY): void {
  if (!(amount > 0)) return;
  state.hp = Math.min(state.maxHp, state.hp + amount);
  if (state.hp > 0) {
    state.wrecked = false;
    state.justWrecked = false;
  }
  state.smoking = state.hp / state.maxHp < VEHICLE_HANDLING.smokeRatio;
}

/** Полный ремонт — отдельная функция, чтобы не путать с частичным. */
export function repairVehicleFull(state: VehicleState): void {
  state.hp = state.maxHp;
  state.wrecked = false;
  state.justWrecked = false;
  state.smoking = false;
  state.lastImpact = 0;
  state.impactPulse = 0;
}

/** Масштаб получаемого урона по массе: тяжёлые терпят лучше. */
export function vehicleDamageScale(state: VehicleState): number {
  return clamp(
    VEHICLE_HANDLING.referenceMass / state.config.mass,
    VEHICLE_HANDLING.damageScaleMin,
    VEHICLE_HANDLING.damageScaleMax,
  );
}

/** Можно ли сесть за руль: живая, без водителя. */
export function isVehicleEnterable(state: VehicleState): boolean {
  return !state.wrecked && state.driver === -1;
}

/**
 * Точное расстояние от точки до корпуса (OBB) в плоскости XZ.
 * Внутри прямоугольника — 0. Нужно для радиуса посадки 3 м.
 */
export function distanceToVehicle(state: VehicleState, x: number, z: number): number {
  const transform = state.transform;
  const dx = x - transform.x;
  const dz = z - transform.z;
  const cos = Math.cos(transform.heading);
  const sin = Math.sin(transform.heading);
  // Обратный поворот rotation.y — как в core/math.circleRect.
  const localX = dx * cos - dz * sin;
  const localZ = dx * sin + dz * cos;
  const overX = Math.abs(localX) - state.config.width / 2;
  const overZ = Math.abs(localZ) - state.config.length / 2;
  if (overX <= 0 && overZ <= 0) return 0;
  const qx = Math.max(overX, 0);
  const qz = Math.max(overZ, 0);
  return Math.hypot(qx, qz);
}

/** Ближайшая машина, в которую можно сесть, в радиусе от корпуса. */
export function findNearestEnterable(
  fleet: VehicleFleet,
  x: number,
  z: number,
  radius: number,
): VehicleState | null {
  let best: VehicleState | null = null;
  let bestDistance = radius;
  for (let i = 0; i < fleet.list.length; i += 1) {
    const state = fleet.list[i];
    if (!isVehicleEnterable(state)) continue;
    const distance = distanceToVehicle(state, x, z);
    if (distance <= bestDistance) {
      bestDistance = distance;
      best = state;
    }
  }
  return best;
}

// Проверка валидности типа для отладочного API (не тащит any в bootstrap).
export function resolveVehicleType(value: string): VehicleTypeId {
  return isVehicleType(value) ? value : DEFAULT_VEHICLE_TYPE;
}
