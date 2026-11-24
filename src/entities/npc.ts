// ---------------------------------------------------------------------------
// M5. Пешеход и коп пешком — данные и пул.
//
// NPC живёт в EntityRegistry (kind 'ped' | 'cop') для generational id и flush,
// но коллайдер в SpatialHash НЕ вставляется: пешехода нельзя «запереть» на
// дороге, машины взаимодействуют с ним через PedsSystem (сбивание, реакция).
// Это сознательное решение M5: физика машины не должна упираться в толпу.
//
// Маршрут хранится в Float32Array фиксированной длины — пул переиспользует
// состояние, поэтому в кадре нет ни аллокаций, ни роста массивов.
// ---------------------------------------------------------------------------

import type { Contact } from '../core/math';
import { circleRect } from '../core/math';
import type { EntityId, EntityRegistry, Transform2D } from '../core/registry';
import { PEDS } from '../config/life';
import type { PedStateName } from '../config/life';
import type { VehicleFleet } from './vehicle';

export type NpcKind = 'ped' | 'cop';

/** Состояние пешехода или копа пешком. */
export interface NpcState {
  id: EntityId;
  /** 'ped' | 'cop' — задаётся при создании: пул переиспользует состояние. */
  kind: NpcKind;
  /** Ссылка на transform сущности; перепривязывается при выходе из пула. */
  transform: Transform2D;
  state: PedStateName;
  /** Вариант внешности (цвет одежды из палитры). */
  variant: number;
  /** Фаза шага 0..1 для покачивания в рендере. */
  phase: number;
  /** Текущая скорость, м/с. */
  speed: number;
  /** Индивидуальная скорость ходьбы, м/с. */
  baseSpeed: number;
  /** Таймер текущего состояния, с. */
  timer: number;
  /** Сколько ещё лежать после удара, с. */
  downTimer: number;
  /** Маршрут: пары (x, z), длина routeCapacity * 2. */
  readonly route: Float32Array;
  routeCount: number;
  routeIndex: number;
  /** Квартал, по периметру которого идёт маршрут (-1 — нет). */
  blockIndex: number;
  /** Точка угрозы: откуда бежим/куда смотрим. */
  threatX: number;
  threatZ: number;
  /** Стилизованная прочность: 0 — сбит/лежит. */
  hp: number;
  /** Коп: id машины, из которой он вышел (-1 — пешком изначально). */
  copCarId: EntityId | -1;
  /** Коп: таймер между выстрелами, с. */
  attackTimer: number;
  /** Коп: цель в зоне поражения. */
  aiming: boolean;
  /** Коп: время жизни вне зоны видимости, с. */
  lifeTimer: number;
}

/** Плотный пул NPC: итерация по индексу без итераторов и аллокаций. */
export class NpcPool {
  readonly list: NpcState[] = [];
  private readonly indexById = new Map<EntityId, number>();
  /** Свободные состояния для повторного использования. */
  private readonly free: NpcState[] = [];
  private readonly capacity: number;

  constructor(capacity: number = PEDS.maxPeds + 8) {
    this.capacity = capacity;
  }

  get size(): number {
    return this.list.length;
  }

  get freeCount(): number {
    return this.free.length;
  }

  /** Взять состояние из пула (создаёт новое только до лимита). */
  acquire(): NpcState | null {
    const reused = this.free.pop();
    if (reused) return reused;
    if (this.list.length + this.free.length >= this.capacity) return null;
    const route = new Float32Array(PEDS.routeCapacity * 2);
    const state: NpcState = {
      id: 0,
      kind: 'ped',
      transform: {
        x: 0,
        z: 0,
        heading: 0,
        vx: 0,
        vz: 0,
        prevX: 0,
        prevZ: 0,
        prevHeading: 0,
      },
      state: 'walk',
      variant: 0,
      phase: 0,
      speed: 0,
      baseSpeed: PEDS.walkSpeed,
      timer: 0,
      downTimer: 0,
      route,
      routeCount: 0,
      routeIndex: 0,
      blockIndex: -1,
      threatX: 0,
      threatZ: 0,
      hp: 1,
      copCarId: -1,
      attackTimer: 0,
      aiming: false,
      lifeTimer: 0,
    };
    return state;
  }

  add(state: NpcState): void {
    this.indexById.set(state.id, this.list.length);
    this.list.push(state);
  }

  get(id: EntityId): NpcState | undefined {
    const index = this.indexById.get(id);
    return index === undefined ? undefined : this.list[index];
  }

  /** Удаление с сохранением порядка и возвратом состояния в пул. */
  remove(id: EntityId): NpcState | null {
    const index = this.indexById.get(id);
    if (index === undefined) return null;
    const state = this.list[index];
    this.list.splice(index, 1);
    this.indexById.delete(id);
    for (let i = index; i < this.list.length; i += 1) this.indexById.set(this.list[i].id, i);
    state.routeCount = 0;
    state.routeIndex = 0;
    this.free.push(state);
    return state;
  }

  clear(): void {
    this.list.length = 0;
    this.indexById.clear();
  }
}

export interface CreateNpcOptions {
  readonly kind: NpcKind;
  readonly x: number;
  readonly z: number;
  readonly heading: number;
  readonly variant?: number;
}

/**
 * Создать NPC: слот реестра + состояние из пула.
 * Коллайдер не подключается — см. комментарий в шапке модуля.
 */
export function createNpc(
  pool: NpcPool,
  registry: EntityRegistry,
  options: CreateNpcOptions,
): NpcState | null {
  const state = pool.acquire();
  if (!state) return null;
  const entity = registry.create(options.kind);
  const transform = entity.transform;
  transform.x = options.x;
  transform.z = options.z;
  transform.heading = options.heading;
  transform.vx = 0;
  transform.vz = 0;
  transform.prevX = options.x;
  transform.prevZ = options.z;
  transform.prevHeading = options.heading;

  state.id = entity.id;
  state.kind = options.kind;
  state.transform = transform;
  state.state = 'walk';
  state.variant = options.variant ?? 0;
  state.phase = 0;
  state.speed = 0;
  state.baseSpeed = PEDS.walkSpeed + (PEDS.walkSpeedSpread * ((state.variant % 5) - 2)) / 2;
  state.timer = 0;
  state.downTimer = 0;
  state.routeCount = 0;
  state.routeIndex = 0;
  state.blockIndex = -1;
  state.threatX = options.x;
  state.threatZ = options.z;
  state.hp = 1;
  state.copCarId = -1;
  state.attackTimer = 0;
  state.aiming = false;
  state.lifeTimer = 0;
  pool.add(state);
  return state;
}

/** Убрать NPC из мира: реестр освободит слот в flush, состояние — в пул. */
export function destroyNpc(pool: NpcPool, registry: EntityRegistry, state: NpcState): void {
  pool.remove(state.id);
  registry.destroy(state.id);
}

/**
 * Урон NPC. Возвращает true, если пешеход только что сбит (для паники вокруг
 * и стилизованного эффекта). Крови и расчленёнки нет: только падение.
 */
export function damageNpc(state: NpcState, amount: number): boolean {
  if (state.state === 'down' || amount <= 0) return false;
  state.hp -= amount;
  if (state.hp > 0) return false;
  state.hp = 0;
  state.state = 'down';
  state.speed = 0;
  state.downTimer = PEDS.downTime;
  state.timer = 0;
  state.phase = 0;
  return true;
}

/** Поднять NPC после падения: он не умирает, а убегает (рейтинг 12+). */
export function reviveNpc(state: NpcState): void {
  state.hp = 1;
  state.downTimer = 0;
  state.state = 'panic';
  state.timer = PEDS.panicTime;
}

/**
 * Сбивание машиной: ближайшая живая машина, чей коллайдер накрывает точку.
 * Возвращает индекс во флоте или -1; контакт пишется в `contact`.
 */
export function findVehicleThreat(
  x: number,
  z: number,
  radius: number,
  fleet: VehicleFleet,
  contact: Contact,
): number {
  let best = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let i = 0; i < fleet.list.length; i += 1) {
    const vehicle = fleet.list[i];
    const collider = vehicle.collider;
    if (!collider || vehicle.wrecked) continue;
    if (!circleRect(x, z, radius, collider, contact)) continue;
    const distance = Math.hypot(collider.x - x, collider.z - z);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  }
  return best;
}
