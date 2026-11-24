// ---------------------------------------------------------------------------
// M5. Пешеходы: маршруты по тротуарам, состояния и реакции.
//
// Маршрут — периметр квартала с отступом внутрь (тротуар) и редкие переходы
// на соседний квартал через дорогу. Точки маршрута лежат в Float32Array
// состояния NPC, поэтому цикл маршрута не аллоцирует.
//
// Состояния: idle → walk → alert → flee → panic, плюс down (сбит/упал).
// Реакции: сигнал машины, выстрел, приближение быстро едущей машины,
// погоня с сиреной, удар машиной. Крови и ragdoll нет — только падение.
//
// Бюджет: ближние пешеходы считают полный тик, дальние — раз в farStride
// тиков. Пешеход не вставляется в SpatialHash, поэтому трафик не упирается
// в толпу; столкновение машины с пешеходом считает эта система.
// ---------------------------------------------------------------------------

import type { Collider, Contact } from '../core/math';
import { circleRect, clamp, normalizeAngle } from '../core/math';
import type { EntityId, EntityRegistry } from '../core/registry';
import type { SpatialHash } from '../core/spatialHash';
import { mulberry32 } from '../core/rng';
import type { RandomSource } from '../core/rng';
import { PEDS } from '../config/life';
import type { CrimeKind } from '../config/life';
import { createNpc, damageNpc, destroyNpc, NpcPool, reviveNpc } from '../entities/npc';
import type { NpcState } from '../entities/npc';
import type { VehicleFleet } from '../entities/vehicle';

/** Прямоугольник квартала: только числа, без зависимости от world/**. */
export interface BlockRect {
  readonly x: number;
  readonly z: number;
  readonly hx: number;
  readonly hz: number;
}

export interface PedSpawn {
  readonly x: number;
  readonly z: number;
  readonly heading: number;
  readonly block: number;
}

export interface PedStats {
  total: number;
  near: number;
  /** Пешеходов в радиусе nearRadius — для добивания ближних. */
  nearClose: number;
  /** Расстояние до ближайшего пешехода, м (диагностика смоука). */
  nearest: number;
  idle: number;
  walking: number;
  alert: number;
  fleeing: number;
  panic: number;
  down: number;
  spawned: number;
  despawned: number;
  /** Сколько пешеходов сбито машинами за сеанс. */
  knocked: number;
  updateMs: number;
  maxUpdateMs: number;
}

export interface PedsOptions {
  readonly registry: EntityRegistry;
  readonly fleet: VehicleFleet;
  readonly hash: SpatialHash<Collider>;
  readonly blocks: readonly BlockRect[];
  readonly water?: readonly BlockRect[];
  readonly bounds: { minX: number; minZ: number; maxX: number; maxZ: number } | null;
  /** Игрок: только его удары поднимают розыск (чужой трафик не считается). */
  readonly playerId: EntityId;
  readonly seed?: number;
  /** Преступление игрока: удар/наезд на пешехода. */
  onCrime?: (kind: CrimeKind, x: number, z: number) => void;
}

/** Тип тревоги, которую пешеход получает извне. */
export type AlertMode = 'alert' | 'flee' | 'panic';

const BLOCK_EDGE = 3;

export class PedsSystem {
  readonly pool = new NpcPool(PEDS.maxPeds);
  readonly stats: PedStats = {
    total: 0,
    near: 0,
    nearClose: 0,
    nearest: 0,
    idle: 0,
    walking: 0,
    alert: 0,
    fleeing: 0,
    panic: 0,
    down: 0,
    spawned: 0,
    despawned: 0,
    knocked: 0,
    updateMs: 0,
    maxUpdateMs: 0,
  };

  private readonly registry: EntityRegistry;
  private readonly fleet: VehicleFleet;
  private readonly hash: SpatialHash<Collider>;
  private readonly blocks: readonly BlockRect[];
  private readonly usable: boolean[] = [];
  private readonly spawns: PedSpawn[] = [];
  private readonly bounds: PedsOptions['bounds'];
  private readonly playerId: EntityId;
  private readonly rng: RandomSource;
  private readonly candidates: Collider[] = [];
  private readonly contact: Contact = { nx: 0, nz: 0, depth: 0 };
  private spawnTimer = 0;
  private tick = 0;
  private sirenTimer = 0;

  onCrime: ((kind: CrimeKind, x: number, z: number) => void) | null;

  constructor(options: PedsOptions) {
    this.registry = options.registry;
    this.fleet = options.fleet;
    this.hash = options.hash;
    this.blocks = options.blocks;
    this.bounds = options.bounds;
    this.playerId = options.playerId;
    this.rng = mulberry32(options.seed ?? 0x51ed0f);
    this.onCrime = options.onCrime ?? null;
    this.markUsable(options.water ?? []);
    this.buildSpawns();
  }

  get count(): number {
    return this.pool.size;
  }

  get(id: EntityId): NpcState | undefined {
    return this.pool.get(id);
  }

  /** Наполнить район пешеходами (старт сцены). */
  prefill(count: number, focusX: number, focusZ: number): void {
    let created = 0;
    for (let attempt = 0; attempt < count * 8 && created < count; attempt += 1) {
      const spawn = this.pickSpawn(focusX, focusZ, PEDS.spawnMinDistance * 0.7, PEDS.spawnMaxDistance);
      if (!spawn) continue;
      if (this.spawnAt(spawn)) created += 1;
    }
  }

  /**
   * Шаг пешеходов. Вызывается после физики машин: пешеход видит уже
   * итоговые позиции и скорости.
   */
  update(
    dt: number,
    time: number,
    focusX: number,
    focusZ: number,
    threatX: number,
    threatZ: number,
    wantedLevel: number,
    sirenActive: boolean,
  ): void {
    const started = performance.now();
    this.tick += 1;

    let near = 0;
    let nearClose = 0;
    let nearest = Number.POSITIVE_INFINITY;
    let idle = 0;
    let walking = 0;
    let alert = 0;
    let fleeing = 0;
    let panic = 0;
    let down = 0;

    for (let i = 0; i < this.pool.list.length; i += 1) {
      const state = this.pool.list[i];
      const transform = state.transform;
      const dx = transform.x - focusX;
      const dz = transform.z - focusZ;
      const distance = Math.hypot(dx, dz);

      if (distance > PEDS.despawnDistance) {
        this.despawnAt(i);
        i -= 1;
        continue;
      }

      switch (state.state) {
        case 'idle':
          idle += 1;
          break;
        case 'walk':
          walking += 1;
          break;
        case 'alert':
          alert += 1;
          break;
        case 'flee':
          fleeing += 1;
          break;
        case 'panic':
          panic += 1;
          break;
        default:
          down += 1;
          break;
      }

      const isNear = distance < PEDS.nearDistance;
      if (isNear) near += 1;
      if (distance < PEDS.nearRadius) nearClose += 1;
      if (distance < nearest) nearest = distance;
      // Дальние считают тик реже: шаг dt умножается, чтобы скорость не падала.
      const stride = isNear ? 1 : PEDS.farStride;
      if (stride > 1 && (this.tick + state.variant) % stride !== 0) continue;

      this.step(state, dt * stride, isNear, wantedLevel, threatX, threatZ);
    }

    this.stats.total = this.pool.size;
    this.stats.near = near;
    this.stats.nearClose = nearClose;
    this.stats.nearest = this.pool.size > 0 ? nearest : 0;
    this.stats.idle = idle;
    this.stats.walking = walking;
    this.stats.alert = alert;
    this.stats.fleeing = fleeing;
    this.stats.panic = panic;
    this.stats.down = down;

    this.spawnTimer += dt;
    if (this.spawnTimer >= PEDS.spawnInterval) {
      this.spawnTimer = 0;
      this.topUp(focusX, focusZ, time);
    }

    // Сирена поднимает тревогу у ближних: не чаще раза в 0.5 с.
    this.sirenTimer -= dt;
    if (sirenActive && wantedLevel >= 1 && this.sirenTimer <= 0) {
      this.sirenTimer = 0.5;
      const mode: AlertMode = wantedLevel >= 3 ? 'panic' : 'flee';
      this.alertAt(threatX, threatZ, PEDS.sirenAlertRadius, mode);
    }

    const elapsed = performance.now() - started;
    this.stats.updateMs = elapsed;
    if (elapsed > this.stats.maxUpdateMs) this.stats.maxUpdateMs = elapsed;
  }

  /** Тревога в радиусе: сигнал машины, выстрел, сирена, драка. */
  alertAt(x: number, z: number, radius: number, mode: AlertMode): number {
    let affected = 0;
    const radiusSq = radius * radius;
    for (let i = 0; i < this.pool.list.length; i += 1) {
      const state = this.pool.list[i];
      if (state.state === 'down') continue;
      const dx = state.transform.x - x;
      const dz = state.transform.z - z;
      if (dx * dx + dz * dz > radiusSq) continue;
      this.applyThreat(state, x, z, mode);
      affected += 1;
    }
    return affected;
  }

  /** Выстрел: ближние паникуют, дальние настораживаются. */
  gunshot(x: number, z: number): number {
    const panicked = this.alertAt(x, z, PEDS.gunshotPanicRadius, 'panic');
    const alerted = this.alertAt(x, z, PEDS.gunshotAlertRadius, 'flee');
    return panicked + alerted;
  }

  /** Очистить всех пешеходов (перезапуск сцены, отладка). */
  clear(): void {
    for (let i = this.pool.list.length - 1; i >= 0; i -= 1) this.despawnAt(i);
  }

  // --- внутреннее ----------------------------------------------------------

  private applyThreat(state: NpcState, x: number, z: number, mode: AlertMode): void {
    if (state.state === 'down') return;
    state.threatX = x;
    state.threatZ = z;
    const dx = state.transform.x - x;
    const dz = state.transform.z - z;
    const inv = 1 / Math.max(0.001, Math.hypot(dx, dz));
    if (mode === 'panic') {
      state.state = 'panic';
      state.timer = PEDS.panicTime;
      state.speed = PEDS.panicSpeed;
      // Бежим в сторону от угрозы, с небольшим разбросом.
      this.setRouteSingle(state, state.transform.x + dx * inv * 14, state.transform.z + dz * inv * 14);
    } else if (mode === 'flee') {
      if (state.state === 'panic') return;
      state.state = 'flee';
      state.timer = PEDS.fleeTime;
      state.speed = PEDS.fleeSpeed;
      this.setRouteSingle(state, state.transform.x + dx * inv * 16, state.transform.z + dz * inv * 16);
    } else if (state.state === 'walk' || state.state === 'idle') {
      state.state = 'alert';
      state.timer = PEDS.alertTime;
      state.speed = 0;
    }
  }

  private step(
    state: NpcState,
    dt: number,
    isNear: boolean,
    wantedLevel: number,
    threatX: number,
    threatZ: number,
  ): void {
    const transform = state.transform;
    transform.prevX = transform.x;
    transform.prevZ = transform.z;
    transform.prevHeading = transform.heading;

    if (state.state === 'down') {
      state.downTimer -= dt;
      if (state.downTimer <= 0) reviveNpc(state);
      return;
    }

    state.timer -= dt;

    // Реакция на машины: только для ближних (дальние упрощены).
    if (isNear && this.checkVehicles(state)) return;

    const dx = transform.x - threatX;
    const dz = transform.z - threatZ;
    // Игрок рядом на машине/с оружием — настороженность даже без выстрела.
    if (isNear && wantedLevel >= 2 && dx * dx + dz * dz < PEDS.sirenAlertRadius * PEDS.sirenAlertRadius) {
      if (state.state === 'walk' || state.state === 'idle') this.applyThreat(state, threatX, threatZ, 'flee');
    }

    switch (state.state) {
      case 'idle':
        state.speed = 0;
        if (state.timer <= 0) {
          state.state = 'walk';
          this.buildRoute(state);
        }
        return;

      case 'alert': {
        // Стоим и смотрим на угрозу; затем либо бежим, либо успокаиваемся.
        state.speed = 0;
        const desired = Math.atan2(state.threatX - transform.x, state.threatZ - transform.z);
        transform.heading += normalizeAngle(desired - transform.heading) * Math.min(1, 6 * dt);
        if (state.timer <= 0) {
          const distanceSq =
            (transform.x - state.threatX) * (transform.x - state.threatX) +
            (transform.z - state.threatZ) * (transform.z - state.threatZ);
          if (distanceSq < 30 * 30) {
            state.state = 'flee';
            state.timer = PEDS.fleeTime;
            state.speed = PEDS.fleeSpeed;
            this.setRouteSingle(
              state,
              transform.x + (transform.x - state.threatX),
              transform.z + (transform.z - state.threatZ),
            );
          } else {
            state.state = 'walk';
            this.buildRoute(state);
          }
        }
        return;
      }

      case 'flee':
      case 'panic': {
        const panic = state.state === 'panic';
        state.speed = panic ? PEDS.panicSpeed : PEDS.fleeSpeed;
        if (state.timer <= 0) {
          state.state = 'walk';
          this.buildRoute(state);
          return;
        }
        // Паника иногда заканчивается падением — стилизованно, без ragdoll.
        if (panic && this.rng() < 0.003 * dt * 60) {
          state.state = 'down';
          state.downTimer = PEDS.panicTime * 0.4;
          state.speed = 0;
          return;
        }
        break;
      }

      default:
        state.speed = state.baseSpeed;
        break;
    }

    // --- движение по маршруту ------------------------------------------------
    if (state.routeIndex >= state.routeCount) {
      if (state.state === 'walk') {
        this.buildRoute(state);
        if (state.routeIndex >= state.routeCount) return;
      } else {
        state.state = 'walk';
        state.speed = state.baseSpeed;
        this.buildRoute(state);
        if (state.routeIndex >= state.routeCount) return;
      }
    }

    const targetX = state.route[state.routeIndex * 2];
    const targetZ = state.route[state.routeIndex * 2 + 1];
    const tdx = targetX - transform.x;
    const tdz = targetZ - transform.z;
    const distance = Math.hypot(tdx, tdz);
    if (distance < PEDS.arriveDistance) {
      state.routeIndex += 1;
      return;
    }

    const desired = Math.atan2(tdx, tdz);
    const turn = normalizeAngle(desired - transform.heading);
    transform.heading += clamp(turn, -PEDS.turnRate * dt, PEDS.turnRate * dt);

    const speed = state.speed;
    if (speed <= 0) return;
    const moveX = Math.sin(transform.heading) * speed * dt;
    const moveZ = Math.cos(transform.heading) * speed * dt;
    transform.x += moveX;
    transform.z += moveZ;
    transform.vx = moveX / dt;
    transform.vz = moveZ / dt;

    // Клином в стену не идём: выталкиваем только по статике.
    if (isNear) this.resolveStatics(state);
    if (this.bounds) {
      const margin = 1;
      transform.x = clamp(transform.x, this.bounds.minX + margin, this.bounds.maxX - margin);
      transform.z = clamp(transform.z, this.bounds.minZ + margin, this.bounds.maxZ - margin);
    }

    state.phase += speed * dt * 1.6;
    if (state.phase > 1) state.phase -= Math.floor(state.phase);
  }

  /** Машины рядом: удар, испуг, объезд. true — пешеход сбит и лежит. */
  private checkVehicles(state: NpcState): boolean {
    const transform = state.transform;
    const radius = PEDS.carThreatRadius;
    this.hash.queryCircle(transform.x, transform.z, radius, this.candidates);
    for (let i = 0; i < this.candidates.length; i += 1) {
      const collider = this.candidates[i];
      if (collider.id >= 0) continue;
      const vehicleId = -collider.id - 1;
      const vehicle = this.fleet.get(vehicleId);
      if (!vehicle) continue;
      const speed = Math.hypot(vehicle.transform.vx, vehicle.transform.vz);
      if (speed < 1.2) continue;
      if (!circleRect(transform.x, transform.z, PEDS.radius + 0.5, collider, this.contact)) continue;

      // Машина едет на пешехода: сбиваем, если скорость выше порога.
      if (speed >= PEDS.carHitSpeed) {
        state.threatX = vehicle.transform.x;
        state.threatZ = vehicle.transform.z;
        if (state.state !== 'down') {
          damageNpc(state, 1);
          this.stats.knocked += 1;
          this.alertAt(transform.x, transform.z, 12, 'panic');
          // Розыск растёт только за удар игрока.
          if (vehicle.driver === this.playerId && this.onCrime) {
            this.onCrime('pedHit', transform.x, transform.z);
            this.onCrime('pedDown', transform.x, transform.z);
          }
          // Отбрасываем тело в сторону удара, чтобы не стоял в машине.
          transform.x += Math.sin(vehicle.transform.heading) * 0.9;
          transform.z += Math.cos(vehicle.transform.heading) * 0.9;
        }
        return true;
      }

      if (state.state === 'walk' || state.state === 'idle') {
        this.applyThreat(state, vehicle.transform.x, vehicle.transform.z, 'alert');
      }
      continue;
    }
    return false;
  }

  private resolveStatics(state: NpcState): void {
    const transform = state.transform;
    this.hash.queryCircle(transform.x, transform.z, PEDS.radius + 0.05, this.candidates);
    for (let i = 0; i < this.candidates.length; i += 1) {
      const other = this.candidates[i];
      if (other.id < 0) continue;
      if (!circleRect(transform.x, transform.z, PEDS.radius, other, this.contact)) continue;
      transform.x += this.contact.nx * this.contact.depth;
      transform.z += this.contact.nz * this.contact.depth;
    }
  }

  // --- маршруты ------------------------------------------------------------

  /** Построить маршрут от текущей позиции по периметру квартала. */
  private buildRoute(state: NpcState): void {
    const block = state.blockIndex >= 0 ? state.blockIndex : this.nearestUsableBlock(state.transform.x, state.transform.z);
    state.routeCount = 0;
    state.routeIndex = 0;
    if (block < 0) {
      this.setRouteSingle(state, state.transform.x + 6, state.transform.z + 6);
      return;
    }
    state.blockIndex = block;
    const rect = this.blocks[block];
    const rx = Math.max(BLOCK_EDGE, rect.hx - PEDS.sidewalkInset);
    const rz = Math.max(BLOCK_EDGE, rect.hz - PEDS.sidewalkInset);

    // Углы квартала (по часовой стрелке от -X,-Z).
    const cornerX = [rect.x - rx, rect.x + rx, rect.x + rx, rect.x - rx];
    const cornerZ = [rect.z - rz, rect.z - rz, rect.z + rz, rect.z + rz];

    let corner = 0;
    let best = Number.POSITIVE_INFINITY;
    for (let i = 0; i < 4; i += 1) {
      const dx = cornerX[i] - state.transform.x;
      const dz = cornerZ[i] - state.transform.z;
      const distance = dx * dx + dz * dz;
      if (distance < best) {
        best = distance;
        corner = i;
      }
    }

    const direction = this.rng() < 0.5 ? 1 : -1;
    const steps = 2 + Math.floor(this.rng() * 2);
    let current = corner;
    for (let i = 0; i < steps; i += 1) {
      current = (current + direction + 4) % 4;
      this.pushRoute(state, cornerX[current], cornerZ[current]);
    }

    // Переход через дорогу на соседний квартал: с шансом и если он есть.
    if (this.rng() < PEDS.crossingChance && state.routeCount + 2 <= PEDS.routeCapacity) {
      const neighbour = this.findNeighbour(block, direction > 0 ? current : corner);
      if (neighbour >= 0) {
        const targetX = state.route[(state.routeCount - 1) * 2];
        const targetZ = state.route[(state.routeCount - 1) * 2 + 1];
        const nrect = this.blocks[neighbour];
        const nrx = Math.max(BLOCK_EDGE, nrect.hx - PEDS.sidewalkInset);
        const nrz = Math.max(BLOCK_EDGE, nrect.hz - PEDS.sidewalkInset);
        const nx = [nrect.x - nrx, nrect.x + nrx, nrect.x + nrx, nrect.x - nrx];
        const nz = [nrect.z - nrz, nrect.z - nrz, nrect.z + nrz, nrect.z + nrz];
        let nextCorner = 0;
        let nextBest = Number.POSITIVE_INFINITY;
        for (let i = 0; i < 4; i += 1) {
          const dx = nx[i] - targetX;
          const dz = nz[i] - targetZ;
          const distance = dx * dx + dz * dz;
          if (distance < nextBest) {
            nextBest = distance;
            nextCorner = i;
          }
        }
        this.pushRoute(state, nx[nextCorner], nz[nextCorner]);
        const after = (nextCorner + direction + 4) % 4;
        this.pushRoute(state, nx[after], nz[after]);
        // Дальше пешеход живёт на новом квартале.
        state.blockIndex = neighbour;
      }
    }
  }

  private pushRoute(state: NpcState, x: number, z: number): void {
    if (state.routeCount >= PEDS.routeCapacity) return;
    state.route[state.routeCount * 2] = x;
    state.route[state.routeCount * 2 + 1] = z;
    state.routeCount += 1;
  }

  private setRouteSingle(state: NpcState, x: number, z: number): void {
    state.routeCount = 0;
    state.routeIndex = 0;
    this.pushRoute(state, x, z);
  }

  /**
   * Соседний квартал через дорогу. Ищем прямоугольник, выровненный по одной
   * оси и отстоящий на ширину улицы (3..30 м): переход не должен вести в стену.
   */
  private findNeighbour(block: number, preferredCorner: number): number {
    const rect = this.blocks[block];
    const wantZ = preferredCorner < 2;
    let best = -1;
    let bestGap = Number.POSITIVE_INFINITY;
    for (let i = 0; i < this.blocks.length; i += 1) {
      if (i === block || !this.usable[i]) continue;
      const other = this.blocks[i];
      if (wantZ) {
        if (Math.abs(other.x - rect.x) > Math.max(rect.hx, other.hx) * 0.7) continue;
        const gap = Math.abs(other.z - rect.z) - (rect.hz + other.hz);
        if (gap > BLOCK_EDGE && gap < 30 && gap < bestGap) {
          bestGap = gap;
          best = i;
        }
      } else {
        if (Math.abs(other.z - rect.z) > Math.max(rect.hz, other.hz) * 0.7) continue;
        const gap = Math.abs(other.x - rect.x) - (rect.hx + other.hx);
        if (gap > BLOCK_EDGE && gap < 30 && gap < bestGap) {
          bestGap = gap;
          best = i;
        }
      }
    }
    return best;
  }

  private nearestUsableBlock(x: number, z: number): number {
    let best = -1;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < this.blocks.length; i += 1) {
      if (!this.usable[i]) continue;
      const rect = this.blocks[i];
      const dx = Math.max(Math.abs(x - rect.x) - rect.hx, 0);
      const dz = Math.max(Math.abs(z - rect.z) - rect.hz, 0);
      const distance = dx * dx + dz * dz;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    }
    return best;
  }

  // --- спавн ---------------------------------------------------------------

  /** Кварталы у воды и слишком маленькие не годятся для тротуара. */
  private markUsable(water: readonly BlockRect[]): void {
    for (let i = 0; i < this.blocks.length; i += 1) {
      const rect = this.blocks[i];
      let ok = rect.hx > 6 && rect.hz > 6;
      if (ok) {
        for (let w = 0; w < water.length; w += 1) {
          const area = water[w];
          if (
            Math.abs(rect.x - area.x) < rect.hx + area.hx + 2 &&
            Math.abs(rect.z - area.z) < rect.hz + area.hz + 2
          ) {
            ok = false;
            break;
          }
        }
      }
      this.usable.push(ok);
    }
  }

  /** Точки на тротуарах: 3 на каждую сторону квартала. */
  private buildSpawns(): void {
    for (let i = 0; i < this.blocks.length; i += 1) {
      if (!this.usable[i]) continue;
      const rect = this.blocks[i];
      const rx = Math.max(BLOCK_EDGE, rect.hx - PEDS.sidewalkInset);
      const rz = Math.max(BLOCK_EDGE, rect.hz - PEDS.sidewalkInset);
      for (let side = 0; side < 4; side += 1) {
        for (let s = 0; s < 3; s += 1) {
          const offset = (s - 1) * 0.55;
          let x: number;
          let z: number;
          let heading: number;
          if (side === 0) {
            x = rect.x + offset * rx;
            z = rect.z - rz;
            heading = Math.PI / 2;
          } else if (side === 1) {
            x = rect.x + offset * rx;
            z = rect.z + rz;
            heading = -Math.PI / 2;
          } else if (side === 2) {
            x = rect.x - rx;
            z = rect.z + offset * rz;
            heading = 0;
          } else {
            x = rect.x + rx;
            z = rect.z + offset * rz;
            heading = Math.PI;
          }
          this.spawns.push({ x, z, heading, block: i });
        }
      }
    }
  }

  private pickSpawn(
    focusX: number,
    focusZ: number,
    minDistance: number,
    maxDistance: number,
  ): PedSpawn | null {
    const total = this.spawns.length;
    if (total === 0) return null;
    for (let attempt = 0; attempt < 14; attempt += 1) {
      const spawn = this.spawns[Math.floor(this.rng() * total) % total];
      const dx = spawn.x - focusX;
      const dz = spawn.z - focusZ;
      const distance = Math.hypot(dx, dz);
      if (distance < minDistance || distance > maxDistance) continue;
      return spawn;
    }
    return null;
  }

  private spawnAt(spawn: PedSpawn): boolean {
    if (this.pool.size >= PEDS.maxPeds) return false;
    // Не ставим пешехода в стену/машину: 0.5 м свободного места достаточно.
    this.hash.queryCircle(spawn.x, spawn.z, 0.6, this.candidates);
    for (let i = 0; i < this.candidates.length; i += 1) {
      if (circleRect(spawn.x, spawn.z, 0.5, this.candidates[i], this.contact)) return false;
    }

    const state = createNpc(this.pool, this.registry, {
      kind: 'ped',
      x: spawn.x,
      z: spawn.z,
      heading: spawn.heading,
      variant: Math.floor(this.rng() * 7),
    });
    if (!state) return false;
    state.blockIndex = spawn.block;
    state.state = this.rng() < PEDS.idleChance ? 'idle' : 'walk';
    state.timer = state.state === 'idle' ? PEDS.idleMin + this.rng() * (PEDS.idleMax - PEDS.idleMin) : 0;
    this.buildRoute(state);
    this.stats.spawned += 1;
    return true;
  }

  private topUp(focusX: number, focusZ: number, time: number): void {
    if (this.pool.size >= PEDS.maxPeds) return;
    const safe = time < PEDS.safeTime;
    // Ближних мало — добираем рядом, иначе город вокруг игрока пустой.
    const nearFill = !safe && this.stats.nearClose < PEDS.nearTarget;
    const minDistance = safe
      ? PEDS.spawnMinDistance * 1.3
      : nearFill
        ? PEDS.closeSpawnDistance
        : PEDS.spawnMinDistance;
    const maxDistance = PEDS.spawnMaxDistance;
    let created = 0;
    for (let attempt = 0; attempt < 18 && created < PEDS.pedsPerSpawn; attempt += 1) {
      if (this.pool.size >= PEDS.maxPeds) break;
      const spawn = this.pickSpawn(focusX, focusZ, minDistance, maxDistance);
      if (!spawn) continue;
      if (this.spawnAt(spawn)) created += 1;
    }
  }

  private despawnAt(index: number): void {
    const state = this.pool.list[index];
    destroyNpc(this.pool, this.registry, state);
    this.stats.despawned += 1;
  }
}
