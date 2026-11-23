// ---------------------------------------------------------------------------
// Лёгкий реестр сущностей: слоты с generational id, компоненты-флаги и пулы.
// Не ECS-фреймворк: сущность = Transform2D + набор компонентов (Collider,
// RenderRef). Динамические коллайдеры живут в общем SpatialHash: insert при
// attach, update при движении, remove при уничтожении. В горячем пути
// (query/each/updateCollider) ничего не аллоцируется.
// ---------------------------------------------------------------------------

import type { Collider } from './math';
import { ObjectPool } from './pool';
import type { Pooled } from './pool';
import type { SpatialHash } from './spatialHash';

/** Упакованный id: index | generation << 20. Проверка живости — O(1). */
export type EntityId = number;

export type EntityKind = 'player' | 'vehicle' | 'ped' | 'cop' | 'projectile' | 'marker' | 'prop';

export interface Transform2D {
  x: number;
  z: number;
  heading: number;
  vx: number;
  vz: number;
  /** Состояние на прошлом тике — только для интерполяции рендера. */
  prevX: number;
  prevZ: number;
  prevHeading: number;
}

/** Числовой дескриптор для рендер-слоя: без ссылок на Three/DOM. */
export interface RenderRef {
  /** Индекс инстанса/меша в рендер-слое. */
  handle: number;
  /** Вариант внешнего вида из конфига. */
  variant: number;
  /** Виден ли объект (стриминг/LOD может скрывать, не уничтожая сущность). */
  visible: boolean;
}

export interface Entity {
  readonly id: EntityId;
  readonly kind: EntityKind;
  readonly transform: Transform2D;
  /** Индекс пула/массива компонента; -1, если компонента нет. */
  data: number;
}

export const ComponentTransform = 1;
export const ComponentCollider = 2;
export const ComponentRenderRef = 4;

const ID_BITS = 20;
const ID_STRIDE = 1 << ID_BITS;
const GENERATION_MASK = 0xfff;

type MutableEntity = { -readonly [K in keyof Entity]: Entity[K] };

interface EntitySlot extends Pooled {
  readonly index: number;
  readonly entity: MutableEntity;
  readonly transform: Transform2D;
  readonly collider: Collider;
  readonly renderRef: RenderRef;
  generation: number;
  kind: EntityKind;
  alive: boolean;
  mask: number;
}

function createSlot(index: number): EntitySlot {
  const transform: Transform2D = {
    x: 0,
    z: 0,
    heading: 0,
    vx: 0,
    vz: 0,
    prevX: 0,
    prevZ: 0,
    prevHeading: 0,
  };
  const collider: Collider = { id: 0, x: 0, z: 0, hx: 0, hz: 0, angle: 0 };
  const renderRef: RenderRef = { handle: 0, variant: 0, visible: false };
  const entity: MutableEntity = { id: 0, kind: 'prop', transform, data: index };
  return {
    index,
    entity,
    transform,
    collider,
    renderRef,
    generation: 0,
    kind: 'prop',
    alive: false,
    mask: 0,
  };
}

export class EntityRegistry {
  private readonly pool: ObjectPool<EntitySlot>;
  private readonly hash: SpatialHash<Collider>;
  /** Индексы слотов, освобождаемых в flush (не id: слот переиспользуется). */
  private readonly pendingSlots: number[] = [];
  private readonly kindCounts: Record<EntityKind, number> = {
    player: 0,
    vehicle: 0,
    ped: 0,
    cop: 0,
    projectile: 0,
    marker: 0,
    prop: 0,
  };

  private aliveTotal = 0;
  private dynamicColliderTotal = 0;

  constructor(hash: SpatialHash<Collider>) {
    this.hash = hash;
    this.pool = new ObjectPool<EntitySlot>(createSlot);
  }

  /** Создать сущность (берёт слот из пула). */
  create(kind: EntityKind): Entity {
    const slot = this.pool.acquire();
    slot.generation &= GENERATION_MASK;
    slot.kind = kind;
    slot.alive = true;
    slot.mask = ComponentTransform;
    slot.renderRef.visible = false;

    const transform = slot.transform;
    transform.x = 0;
    transform.z = 0;
    transform.heading = 0;
    transform.vx = 0;
    transform.vz = 0;
    transform.prevX = 0;
    transform.prevZ = 0;
    transform.prevHeading = 0;

    const entity = slot.entity;
    entity.id = slot.index + slot.generation * ID_STRIDE;
    entity.kind = kind;
    entity.data = slot.index;

    this.aliveTotal += 1;
    this.kindCounts[kind] += 1;
    return entity;
  }

  /** Синоним create из контракта §3.3. */
  acquire(kind: EntityKind): Entity {
    return this.create(kind);
  }

  /**
   * Пометить мёртвой. Слот освобождается в flush(), поэтому уничтожение
   * безопасно посреди итерации query/each.
   */
  destroy(id: EntityId): void {
    const slot = this.resolve(id);
    if (!slot) return;
    slot.alive = false;
    this.aliveTotal -= 1;
    this.kindCounts[slot.kind] -= 1;
    this.pendingSlots.push(slot.index);
  }

  /** Синоним destroy: фактический возврат в пул происходит в flush(). */
  release(id: EntityId): void {
    this.destroy(id);
  }

  isAlive(id: EntityId): boolean {
    return this.resolve(id) !== null;
  }

  get(id: EntityId): Entity | undefined {
    const slot = this.resolve(id);
    return slot ? slot.entity : undefined;
  }

  /** Заполняет out (без аллокаций) всеми живыми сущностями вида. */
  query(kind: EntityKind, out: Entity[]): Entity[] {
    out.length = 0;
    const size = this.pool.size;
    for (let i = 0; i < size; i += 1) {
      const slot = this.pool.at(i);
      if (slot.alive && slot.kind === kind) out.push(slot.entity);
    }
    return out;
  }

  /** Сущности, у которых есть все биты mask (ComponentTransform и т.д.). */
  queryMask(mask: number, out: Entity[]): Entity[] {
    out.length = 0;
    const size = this.pool.size;
    for (let i = 0; i < size; i += 1) {
      const slot = this.pool.at(i);
      if (slot.alive && (slot.mask & mask) === mask) out.push(slot.entity);
    }
    return out;
  }

  each(kind: EntityKind, fn: (entity: Entity) => void): void {
    const size = this.pool.size;
    for (let i = 0; i < size; i += 1) {
      const slot = this.pool.at(i);
      if (slot.alive && slot.kind === kind) fn(slot.entity);
    }
  }

  count(kind: EntityKind): number {
    return this.kindCounts[kind];
  }

  /** Всего живых сущностей (для отладочного оверлея). */
  get total(): number {
    return this.aliveTotal;
  }

  /** Мощность пула слотов: не растёт в установившемся режиме. */
  get capacity(): number {
    return this.pool.size;
  }

  get freeSlots(): number {
    return this.pool.freeCount;
  }

  /** Сколько динамических коллайдеров сейчас в SpatialHash. */
  get dynamicColliders(): number {
    return this.dynamicColliderTotal;
  }

  hasComponent(id: EntityId, component: number): boolean {
    const slot = this.resolve(id);
    return slot !== null && (slot.mask & component) !== 0;
  }

  getCollider(id: EntityId): Collider | null {
    const slot = this.resolve(id);
    if (!slot || (slot.mask & ComponentCollider) === 0) return null;
    return slot.collider;
  }

  /**
   * Подключить прямоугольный коллайдер к сущности и вставить его в SpatialHash.
   * `angle` по умолчанию берётся из transform.heading.
   */
  attachCollider(id: EntityId, hx: number, hz: number, angle?: number): Collider | null {
    const slot = this.resolve(id);
    if (!slot) return null;
    const collider = slot.collider;
    collider.hx = hx;
    collider.hz = hz;
    collider.angle = angle ?? slot.transform.heading;
    this.syncCollider(slot);

    if ((slot.mask & ComponentCollider) === 0) {
      // Динамические коллайдеры получают отрицательный id, чтобы не
      // пересекаться со статическими (у них положительные id из world).
      collider.id = -id - 1;
      slot.mask |= ComponentCollider;
      this.dynamicColliderTotal += 1;
      this.hash.insert(collider);
    } else {
      this.hash.update(collider);
    }
    return collider;
  }

  /** Пересчитать ячейки после движения: transform → collider → hash. */
  updateCollider(id: EntityId): boolean {
    const slot = this.resolve(id);
    if (!slot || (slot.mask & ComponentCollider) === 0) return false;
    this.syncCollider(slot);
    this.hash.update(slot.collider);
    return true;
  }

  detachCollider(id: EntityId): void {
    const slot = this.resolve(id);
    if (!slot || (slot.mask & ComponentCollider) === 0) return;
    this.removeCollider(slot);
  }

  attachRenderRef(id: EntityId, handle: number, variant = 0): RenderRef | null {
    const slot = this.resolve(id);
    if (!slot) return null;
    slot.mask |= ComponentRenderRef;
    slot.renderRef.handle = handle;
    slot.renderRef.variant = variant;
    slot.renderRef.visible = true;
    return slot.renderRef;
  }

  getRenderRef(id: EntityId): RenderRef | null {
    const slot = this.resolve(id);
    if (!slot || (slot.mask & ComponentRenderRef) === 0) return null;
    return slot.renderRef;
  }

  detachRenderRef(id: EntityId): void {
    const slot = this.resolve(id);
    if (!slot) return;
    slot.mask &= ~ComponentRenderRef;
    slot.renderRef.visible = false;
  }

  /** Освободить слоты, помеченные destroy. Вызывается в конце фикс. шага. */
  flush(): void {
    for (let i = 0; i < this.pendingSlots.length; i += 1) {
      const slot = this.pool.at(this.pendingSlots[i]);
      if ((slot.mask & ComponentCollider) !== 0) this.removeCollider(slot);
      slot.mask = 0;
      slot.alive = false;
      slot.renderRef.visible = false;
      slot.generation = (slot.generation + 1) & GENERATION_MASK;
      this.pool.release(slot);
    }
    this.pendingSlots.length = 0;
  }

  /** Полный сброс (перезапуск сцены): коллайдеры снимаются, id инвалидируются. */
  clear(): void {
    const size = this.pool.size;
    for (let i = 0; i < size; i += 1) {
      const slot = this.pool.at(i);
      if ((slot.mask & ComponentCollider) !== 0) this.removeCollider(slot);
      slot.mask = 0;
      slot.alive = false;
      slot.renderRef.visible = false;
      slot.generation = (slot.generation + 1) & GENERATION_MASK;
    }
    this.pendingSlots.length = 0;
    this.aliveTotal = 0;
    this.dynamicColliderTotal = 0;
    for (const kind of Object.keys(this.kindCounts) as EntityKind[]) this.kindCounts[kind] = 0;
    this.pool.reset();
  }

  private resolve(id: EntityId): EntitySlot | null {
    if (!Number.isInteger(id) || id < 0) return null;
    const index = id % ID_STRIDE;
    if (index >= this.pool.size) return null;
    const slot = this.pool.at(index);
    if (!slot.alive || slot.entity.id !== id) return null;
    return slot;
  }

  private syncCollider(slot: EntitySlot): void {
    const collider = slot.collider;
    collider.x = slot.transform.x;
    collider.z = slot.transform.z;
    collider.angle = slot.transform.heading;
  }

  private removeCollider(slot: EntitySlot): void {
    this.hash.remove(slot.collider);
    this.dynamicColliderTotal -= 1;
    slot.mask &= ~ComponentCollider;
    slot.collider.id = 0;
  }
}
