// ---------------------------------------------------------------------------
// M5. Трафик по дорожному графу.
//
// Машина трафика — обычный VehicleState: физику считает VehiclePhysics,
// коллайдер живёт в SpatialHash, рендер не отличается от машины игрока.
// Система владеет только ИИ: полоса, скорость, светофор, приоритет, объезд.
//
// Геометрия полос берётся из графа (`lanePoint`, `laneOffsets`, `heading`):
// своего смещения трафик не изобретает (M3-A-28). `t` на ребре не
// интегрируется, а проецируется из фактической позиции машины — после удара
// или заноса агент сам «догоняет» свою полосу, без телепортов.
//
// Бюджет: ближние машины считают ИИ каждый тик, дальние — раз в farStride
// тиков с накоплением dt. Спавн/деспавн — не чаще spawnInterval.
// В горячем пути нет аллокаций: все буферы созданы в конструкторе.
// ---------------------------------------------------------------------------

import type { Collider, Contact } from '../core/math';
import { circleRect, clamp, normalizeAngle } from '../core/math';
import type { EntityId, EntityRegistry } from '../core/registry';
import type { SpatialHash } from '../core/spatialHash';
import { mulberry32 } from '../core/rng';
import type { RandomSource } from '../core/rng';
import { TRAFFIC } from '../config/life';
import type { MotorTrafficType } from '../config/life';
import type { VehicleTypeId } from '../config/vehicles';
import { createVehicle, destroyVehicle } from '../entities/vehicle';
import type { VehicleFleet, VehicleState } from '../entities/vehicle';
import type { RoadGraph } from '../world/types';
import type { VehiclePhysics } from './vehiclePhysics';
import type { VehicleInput } from './vehiclePhysics';

/** Точка спавна трафика: полоса ребра в конкретном t (как world.spawns.cars). */
export interface TrafficSpawnPoint {
  readonly x: number;
  readonly z: number;
  readonly heading: number;
  readonly edge: number;
  readonly t: number;
  readonly lane: number;
}

/** Агент трафика: состояние ИИ поверх машины. */
export interface TrafficAgent {
  readonly vehicle: VehicleState;
  edge: number;
  lane: number;
  /** Проекция позиции на ребро, 0..1. */
  t: number;
  /** Боковое смещение для объезда, м (затухает к нулю). */
  offset: number;
  /** Целевая скорость на этом тике, м/с. */
  targetSpeed: number;
  /** Индивидуальный множитель скорости (0.85..1.0). */
  cruise: number;
  /** Номер тика для stride дальних машин. */
  phase: number;
  /** Накопленный dt для шага физики (дальние копят). */
  pendingDt: number;
  honkTimer: number;
  stuck: number;
  yieldTimer: number;
  /** Машина впереди ближе gapStop. */
  blocked: boolean;
  /** Таймер после уничтожения: машина-памятник освобождает полосу. */
  wreckTimer: number;
  /** Переиспользуемый ввод для физики. */
  readonly input: VehicleInput;
}

export interface TrafficStats {
  /** Машин под управлением трафика. */
  vehicles: number;
  /** Сколько из них ближних (полный тик). */
  near: number;
  /** Сколько машин стоят на месте (пробка/светофор). */
  stopped: number;
  /** Средняя скорость по агентам, м/с. */
  avgSpeed: number;
  spawned: number;
  despawned: number;
  /** Время последнего update, мс. */
  updateMs: number;
  /** Вершина времени update за сеанс, мс. */
  maxUpdateMs: number;
}

export interface TrafficUpdateContext {
  /** Уровень розыска: с 2 копы едут с сиреной, трафик уступает. */
  wantedLevel: number;
  /** Позиция ближайшей машины с сиреной (-1e9 — нет). */
  sirenX: number;
  sirenZ: number;
}

export interface TrafficOptions {
  readonly registry: EntityRegistry;
  readonly fleet: VehicleFleet;
  readonly hash: SpatialHash<Collider>;
  readonly graph: RoadGraph;
  readonly physics: VehiclePhysics;
  readonly bounds: { minX: number; minZ: number; maxX: number; maxZ: number } | null;
  /** Сид домена трафика: отдельный поток RNG (ARCHITECTURE §8). */
  readonly seed?: number;
  /** Колбэк гудка: система пешеходов переводит его в тревогу. */
  onHonk?: (x: number, z: number) => void;
}

/** Управление машиной к точке с целевой скоростью. Без аллокаций. */
export function driveTowards(
  input: VehicleInput,
  x: number,
  z: number,
  heading: number,
  vx: number,
  vz: number,
  targetX: number,
  targetZ: number,
  targetSpeed: number,
): void {
  const sin = Math.sin(heading);
  const cos = Math.cos(heading);
  const dx = targetX - x;
  const dz = targetZ - z;
  const distance = Math.hypot(dx, dz);
  const forward = vx * sin + vz * cos;

  input.handbrake = false;

  // Стоять: тормоз в пол, руль можно не крутить.
  if (targetSpeed <= 0.05 || distance < 0.6) {
    input.throttle = 0;
    input.brake = 1;
    input.steer = 0;
    return;
  }

  const desired = Math.atan2(dx, dz);
  const error = normalizeAngle(desired - heading);
  input.steer = clamp(error * 2.2, -1, 1);

  // Крутой поворот на скорости: сначала гасим, потом поворачиваем.
  let limit = targetSpeed;
  if (Math.abs(error) > 0.7 && forward > 5) limit = Math.min(limit, 4.5);

  if (forward < limit - 0.4) {
    input.throttle = clamp((limit - forward) * 0.55, 0.3, 1);
    input.brake = 0;
  } else if (forward > limit + 0.8) {
    input.throttle = 0;
    input.brake = clamp((forward - limit) / 5, 0.25, 1);
  } else {
    input.throttle = 0.25;
    input.brake = 0;
  }
}

export class TrafficSystem {
  readonly stats: TrafficStats = {
    vehicles: 0,
    near: 0,
    stopped: 0,
    avgSpeed: 0,
    spawned: 0,
    despawned: 0,
    updateMs: 0,
    maxUpdateMs: 0,
  };

  private readonly registry: EntityRegistry;
  private readonly fleet: VehicleFleet;
  private readonly hash: SpatialHash<Collider>;
  private readonly graph: RoadGraph;
  private readonly physics: VehiclePhysics;
  private readonly bounds: TrafficOptions['bounds'];
  private readonly rng: RandomSource;
  private readonly spawnPoints: TrafficSpawnPoint[] = [];
  /** Исходящие рёбра по узлам: ускоряет выбор следующего ребра. */
  private readonly outgoing: number[][] = [];
  private readonly agents: TrafficAgent[] = [];
  private readonly indexById = new Map<EntityId, number>();

  private readonly candidates: Collider[] = [];
  private readonly contact: Contact = { nx: 0, nz: 0, depth: 0 };
  private readonly laneScratch = { x: 0, z: 0 };
  private spawnTimer = 0;
  private tick = 0;

  /** Гудок наружу: пешеходы реагируют на сигнал (05_LIFE_AI). */
  onHonk: ((x: number, z: number) => void) | null = null;

  constructor(options: TrafficOptions) {
    this.registry = options.registry;
    this.fleet = options.fleet;
    this.hash = options.hash;
    this.graph = options.graph;
    this.physics = options.physics;
    this.bounds = options.bounds;
    this.rng = mulberry32(options.seed ?? 0x7a11f1c);
    this.onHonk = options.onHonk ?? null;
    this.buildSpawnPoints();
    this.buildOutgoing();
  }

  get count(): number {
    return this.agents.length;
  }

  /** Машины этого агента уже шагает трафик: bootstrap их не трогает. */
  owns(id: EntityId): boolean {
    return this.indexById.has(id);
  }

  get(id: EntityId): VehicleState | null {
    const index = this.indexById.get(id);
    return index === undefined ? null : this.agents[index].vehicle;
  }

  /** Машину забрал игрок: агент больше не управляет ею, машина остаётся. */
  forget(id: EntityId): void {
    const index = this.indexById.get(id);
    if (index === undefined) return;
    this.removeAgentAt(index);
  }

  /** Наполнить город машинами вокруг точки (старт, телепорт, отладка). */
  prefill(count: number, focusX: number, focusZ: number): void {
    const minDistance = TRAFFIC.spawnMinDistance * 0.55;
    let created = 0;
    for (let attempt = 0; attempt < count * 12 && created < count; attempt += 1) {
      if (this.agents.length >= TRAFFIC.maxVehicles) break;
      const point = this.pickSpawnPoint(focusX, focusZ, minDistance, TRAFFIC.spawnMaxDistance);
      if (!point) continue;
      if (this.spawnAt(point, focusX, focusZ, minDistance)) created += 1;
    }
  }

  /**
   * Шаг трафика: ИИ + физика агентов. Вызывается до шага физики bootstrap,
   * потому что агенты шагают себя сами (см. owns()).
   */
  update(dt: number, time: number, focusX: number, focusZ: number, context: TrafficUpdateContext): void {
    const started = performance.now();
    this.tick += 1;
    this.spawnTimer += dt;

    let near = 0;
    let stopped = 0;
    let speedSum = 0;

    for (let i = 0; i < this.agents.length; i += 1) {
      const agent = this.agents[i];
      const vehicle = agent.vehicle;

      // Игрок угнал машину трафика — агент уходит, машина живёт дальше.
      if (vehicle.driver >= 0) {
        this.removeAgentAt(i);
        i -= 1;
        continue;
      }

      const transform = vehicle.transform;
      const dx = transform.x - focusX;
      const dz = transform.z - focusZ;
      const distance = Math.hypot(dx, dz);

      if (distance > TRAFFIC.despawnDistance) {
        this.despawnAgentAt(i, false);
        i -= 1;
        continue;
      }

      const isNear = distance < TRAFFIC.nearDistance;
      if (isNear) near += 1;

      const wrecked = vehicle.wrecked;
      if (wrecked) {
        agent.wreckTimer += dt;
        if (agent.wreckTimer > 8 && distance > 45) {
          this.despawnAgentAt(i, true);
          i -= 1;
          continue;
        }
      }

      // Дальние машины думают реже: dt копится и применяется одним шагом.
      agent.pendingDt += dt;
      const strideTick = isNear || (this.tick + agent.phase) % TRAFFIC.farStride === 0;
      if (!strideTick) continue;

      const stepDt = agent.pendingDt;
      agent.pendingDt = 0;
      if (stepDt <= 0) continue;

      if (wrecked) {
        agent.input.throttle = 0;
        agent.input.brake = 1;
        agent.input.steer = 0;
        agent.input.handbrake = false;
      } else {
        this.think(agent, time, context, dt);
      }

      const speedBefore = Math.hypot(transform.vx, transform.vz);
      speedSum += speedBefore;
      if (speedBefore < 0.6) stopped += 1;

      this.physics.step(vehicle, agent.input, stepDt);
      if (this.followUp(agent, dt, distance)) {
        i -= 1;
      }
    }

    this.stats.vehicles = this.agents.length;
    this.stats.near = near;
    this.stats.stopped = stopped;
    this.stats.avgSpeed = this.agents.length > 0 ? speedSum / this.agents.length : 0;

    if (this.spawnTimer >= TRAFFIC.spawnInterval) {
      this.spawnTimer = 0;
      this.topUp(focusX, focusZ, time);
    }

    const elapsed = performance.now() - started;
    this.stats.updateMs = elapsed;
    if (elapsed > this.stats.maxUpdateMs) this.stats.maxUpdateMs = elapsed;
  }

  /** Очистить всех агентов (перезапуск сцены, отладка). */
  clear(): void {
    for (let i = this.agents.length - 1; i >= 0; i -= 1) this.despawnAgentAt(i, true);
    this.indexById.clear();
  }

  // --- ИИ ------------------------------------------------------------------

  private think(
    agent: TrafficAgent,
    time: number,
    context: TrafficUpdateContext,
    dt: number,
  ): void {
    const vehicle = agent.vehicle;
    const transform = vehicle.transform;
    const edges = this.graph.edges;
    let edge = edges[agent.edge];
    if (!edge) {
      this.reassignEdge(agent);
      edge = edges[agent.edge];
      if (!edge) {
        agent.targetSpeed = 0;
        driveTowards(agent.input, transform.x, transform.z, transform.heading, 0, 0, transform.x, transform.z, 0);
        return;
      }
    }

    const from = this.graph.nodes[edge.from];
    const dirX = (this.graph.nodes[edge.to].x - from.x) / (edge.length || 1);
    const dirZ = (this.graph.nodes[edge.to].z - from.z) / (edge.length || 1);
    const along = (transform.x - from.x) * dirX + (transform.z - from.z) * dirZ;
    const lateral = (transform.x - from.x) * dirZ - (transform.z - from.z) * dirX;

    // Сбились с ребра (удар, занос, объезд) — берём ближайшее ребро заново.
    if (along < -6 || along > edge.length + 6 || Math.abs(lateral) > TRAFFIC.offLaneLimit) {
      this.reassignEdge(agent);
      return;
    }

    agent.t = clamp(along / (edge.length || 1), 0, 1);
    if (agent.t >= 0.985) {
      this.chooseNextEdge(agent);
      edge = edges[agent.edge] ?? edge;
    }

    const laneCount = edge.lanes;
    if (agent.lane >= laneCount) agent.lane = laneCount - 1;

    // --- цель по полосе -----------------------------------------------------
    const lookT = clamp(agent.t + TRAFFIC.laneLookAhead / (edge.length || 1), 0, 1);
    const lanePoint = this.graph.lanePoint(agent.edge, lookT, agent.lane, this.laneScratch);
    const targetX = lanePoint.x + dirZ * agent.offset;
    const targetZ = lanePoint.z - dirX * agent.offset;

    // --- скорость -----------------------------------------------------------
    let targetSpeed = Math.min(edge.speed * TRAFFIC.speedScale, vehicle.config.maxSpeed * 0.85) * agent.cruise;

    // Светофор и приоритет на перекрёстке.
    const stopDistance = (1 - agent.t) * edge.length;
    if (stopDistance < TRAFFIC.lightZone && !this.lightAllows(agent.edge, time) && agent.t < TRAFFIC.lightStopT) {
      targetSpeed = Math.min(targetSpeed, Math.max(0, (stopDistance - 2.5) * 0.8));
    } else if (agent.t > TRAFFIC.lightStopT - 0.02 && stopDistance < 8 && !this.lightAllows(agent.edge, time)) {
      targetSpeed = 0;
    }
    if (targetSpeed > 0.2 && !this.intersectionClear(agent)) {
      targetSpeed = Math.min(targetSpeed, 2);
    }

    // --- машина впереди ------------------------------------------------------
    const gap = this.scanAhead(agent, edge.length);
    agent.blocked = gap < TRAFFIC.gapSlow;
    if (gap < TRAFFIC.gapSlow) {
      const ratio = clamp((gap - TRAFFIC.gapStop) / (TRAFFIC.gapSlow - TRAFFIC.gapStop), 0, 1);
      targetSpeed = Math.min(targetSpeed, targetSpeed * ratio);
    }
    if (gap < TRAFFIC.gapStop) {
      targetSpeed = 0;
      agent.stuck += dt;
      agent.honkTimer -= dt;
      if (agent.stuck > 1.2 && agent.honkTimer <= 0) {
        agent.honkTimer = TRAFFIC.honkInterval;
        if (this.onHonk) this.onHonk(transform.x, transform.z);
      }
    } else {
      agent.stuck = Math.max(0, agent.stuck - dt * 0.5);
    }

    // --- объезд препятствия --------------------------------------------------
    if (agent.stuck > 2.4 && targetSpeed < 0.5) {
      // Стоим слишком долго: смещаемся в сторону для объезда.
      agent.offset = agent.offset === 0 ? (this.rng() < 0.5 ? -1 : 1) * TRAFFIC.yieldOffset : agent.offset;
    }
    if (agent.offset !== 0) {
      agent.offset *= Math.exp(-0.4 * dt);
      if (Math.abs(agent.offset) < 0.05) agent.offset = 0;
    }

    // --- реакция на сирену ---------------------------------------------------
    if (context.wantedLevel >= 2) {
      const sdx = transform.x - context.sirenX;
      const sdz = transform.z - context.sirenZ;
      if (sdx * sdx + sdz * sdz < TRAFFIC.sirenRadius * TRAFFIC.sirenRadius) {
        agent.yieldTimer = 2.5;
      }
    }
    if (agent.yieldTimer > 0) {
      agent.yieldTimer -= dt;
      targetSpeed = Math.min(targetSpeed, Math.max(1.2, targetSpeed * TRAFFIC.sirenSpeedFactor));
    }

    agent.targetSpeed = targetSpeed;

    if (agent.t > 0.9 && stopDistance < 2 && targetSpeed < 0.3) {
      // Упёрлись в конец ребра: стоять до смены фазы светофора.
      agent.input.throttle = 0;
      agent.input.brake = 1;
      agent.input.steer = 0;
      agent.input.handbrake = false;
      return;
    }

    driveTowards(
      agent.input,
      transform.x,
      transform.z,
      transform.heading,
      transform.vx,
      transform.vz,
      targetX,
      targetZ,
      targetSpeed,
    );
  }

  /** После физики: не уехали ли за край мира и не застряли ли навсегда. */
  private followUp(agent: TrafficAgent, dt: number, distanceToFocus: number): boolean {
    const transform = agent.vehicle.transform;
    if (this.bounds) {
      const margin = 2;
      transform.x = clamp(transform.x, this.bounds.minX + margin, this.bounds.maxX - margin);
      transform.z = clamp(transform.z, this.bounds.minZ + margin, this.bounds.maxZ - margin);
    }
    if (agent.stuck > 12 && distanceToFocus > 70) {
      // Машина застряла навсегда и не видна игроку — просто убираем.
      const index = this.indexById.get(agent.vehicle.id);
      if (index !== undefined) this.despawnAgentAt(index, true);
      return true;
    }
    if (agent.stuck > 6) agent.offset *= Math.exp(-0.1 * dt);
    return false;
  }

  /** Одобряет ли светофор въезд на перекрёсток для ребра. */
  private lightAllows(edgeIndex: number, time: number): boolean {
    const edge = this.graph.edges[edgeIndex];
    if (!edge) return true;
    const node = this.graph.nodes[edge.to];
    if (!node || !node.lights) return true;
    const phase = (((time / TRAFFIC.lightCycle) % 1) + (node.lightPhase ?? 0)) % 1;
    const green = TRAFFIC.lightGreenShare;
    const yellow = green + TRAFFIC.lightYellowShare;
    if (phase < green) return edge.axis === 0;
    if (phase < yellow) return false;
    const second = phase - yellow;
    if (second < green) return edge.axis === 1;
    return false;
  }

  /**
   * Приоритет на перекрёстке без светофора: если узел занят машиной с другого
   * ребра с меньшим номером агента — ждём. Даёт «пробку», но без клинча.
   */
  private intersectionClear(agent: TrafficAgent): boolean {
    const edge = this.graph.edges[agent.edge];
    if (!edge) return true;
    if (agent.t < 0.72) return true;
    const node = this.graph.nodes[edge.to];
    if (!node || node.lights) return true;
    const selfIndex = this.indexById.get(agent.vehicle.id) ?? 0;
    for (let i = 0; i < this.agents.length; i += 1) {
      if (i >= selfIndex) break;
      const other = this.agents[i];
      if (other.edge === agent.edge) continue;
      const otherEdge = this.graph.edges[other.edge];
      if (!otherEdge) continue;
      if (otherEdge.to !== node.id && otherEdge.from !== node.id) continue;
      const transform = other.vehicle.transform;
      const dx = transform.x - node.x;
      const dz = transform.z - node.z;
      if (dx * dx + dz * dz > TRAFFIC.intersectionRadius * TRAFFIC.intersectionRadius) continue;
      return false;
    }
    return true;
  }

  /** Свободный путь впереди: минимум по коллайдерам в полосе. */
  private scanAhead(agent: TrafficAgent, edgeLength: number): number {
    const vehicle = agent.vehicle;
    const transform = vehicle.transform;
    const sin = Math.sin(transform.heading);
    const cos = Math.cos(transform.heading);
    const limit = Math.min(TRAFFIC.scanAhead, Math.max(6, edgeLength * 0.5));
    const halfWidth = vehicle.config.width * 0.5 + TRAFFIC.gapSkin;
    const midX = transform.x + sin * limit * 0.5;
    const midZ = transform.z + cos * limit * 0.5;
    const hx = Math.abs(sin) * limit * 0.5 + halfWidth;
    const hz = Math.abs(cos) * limit * 0.5 + halfWidth;
    this.hash.queryRect(midX, midZ, hx, hz, this.candidates);

    let gap = limit;
    const selfId = -vehicle.id - 1;
    for (let i = 0; i < this.candidates.length; i += 1) {
      const other = this.candidates[i];
      if (other.id === selfId) continue;
      const dx = other.x - transform.x;
      const dz = other.z - transform.z;
      const forward = dx * sin + dz * cos;
      if (forward <= 0.4 || forward > gap + 2) continue;
      const side = dx * cos - dz * sin;
      const radius = Math.max(other.hx, other.hz) * 0.9;
      if (Math.abs(side) > halfWidth + radius) continue;
      const clear = forward - radius - vehicle.config.length * 0.5;
      if (clear < gap) gap = clear;
    }
    if (gap < 0) gap = 0;
    return gap;
  }

  private reassignEdge(agent: TrafficAgent): void {
    const edgeIndex = this.graph.nearestEdge(agent.vehicle.transform.x, agent.vehicle.transform.z);
    if (edgeIndex < 0) return;
    const edge = this.graph.edges[edgeIndex];
    agent.edge = edgeIndex;
    agent.t = 0;
    agent.lane = clamp(Math.floor(this.rng() * edge.lanes), 0, edge.lanes - 1);
    agent.offset = 0;
  }

  private chooseNextEdge(agent: TrafficAgent): void {
    const current = this.graph.edges[agent.edge];
    if (!current) return;
    const node = current.to;
    const options = this.outgoing[node];
    if (!options || options.length === 0) {
      // Тупик: разворачиваемся на обратное ребро.
      for (let i = 0; i < this.outgoing[current.from].length; i += 1) {
        const candidate = this.outgoing[current.from][i];
        if (candidate !== agent.edge) {
          agent.edge = candidate;
          agent.t = 0;
          agent.lane = 0;
          return;
        }
      }
      return;
    }

    let choice = -1;
    // Приоритет прямому продолжению: так трафик выглядит осмысленно.
    for (let i = 0; i < options.length; i += 1) {
      const candidate = this.graph.edges[options[i]];
      if (!candidate) continue;
      if (candidate.to === current.from) continue;
      if (Math.abs(normalizeAngle(candidate.heading - current.heading)) < 0.35 && this.rng() < 0.7) {
        choice = options[i];
        break;
      }
    }
    if (choice < 0) {
      for (let attempt = 0; attempt < options.length; attempt += 1) {
        const index = options[Math.floor(this.rng() * options.length) % options.length];
        const candidate = this.graph.edges[index];
        if (!candidate) continue;
        if (candidate.to === current.from && options.length > 1) continue;
        choice = index;
        break;
      }
    }
    if (choice < 0) return;
    const edge = this.graph.edges[choice];
    agent.edge = choice;
    agent.t = 0;
    agent.lane = clamp(Math.floor(this.rng() * edge.lanes), 0, edge.lanes - 1);
    agent.offset = 0;
  }

  // --- спавн и деспавн ------------------------------------------------------

  private buildSpawnPoints(): void {
    const scratch = { x: 0, z: 0 };
    const edges = this.graph.edges;
    for (let e = 0; e < edges.length; e += 1) {
      const edge = edges[e];
      for (let s = 0; s < 3; s += 1) {
        const t = 0.25 + s * 0.27;
        for (let lane = 0; lane < edge.lanes; lane += 1) {
          this.graph.lanePoint(e, t, lane, scratch);
          this.spawnPoints.push({
            x: scratch.x,
            z: scratch.z,
            heading: edge.heading,
            edge: e,
            t,
            lane,
          });
        }
      }
    }
  }

  private buildOutgoing(): void {
    const nodes = this.graph.nodes.length;
    for (let i = 0; i < nodes; i += 1) this.outgoing.push([]);
    for (let e = 0; e < this.graph.edges.length; e += 1) {
      this.outgoing[this.graph.edges[e].from].push(e);
    }
  }

  private topUp(focusX: number, focusZ: number, time: number): void {
    if (this.agents.length >= TRAFFIC.maxVehicles) return;
    // Первые секунды после старта — безопасная зона: спавн только далеко.
    const safe = time < TRAFFIC.safeTime;
    const minDistance = safe ? TRAFFIC.spawnMinDistance * 1.2 : TRAFFIC.spawnMinDistance;
    let created = 0;
    for (let attempt = 0; attempt < 24 && created < TRAFFIC.carsPerSpawn; attempt += 1) {
      if (this.agents.length >= TRAFFIC.maxVehicles) break;
      const point = this.pickSpawnPoint(focusX, focusZ, minDistance, TRAFFIC.spawnMaxDistance);
      if (!point) continue;
      if (this.spawnAt(point, focusX, focusZ, minDistance)) created += 1;
    }
  }

  private pickSpawnPoint(
    focusX: number,
    focusZ: number,
    minDistance: number,
    maxDistance: number,
  ): TrafficSpawnPoint | null {
    const total = this.spawnPoints.length;
    if (total === 0) return null;
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const point = this.spawnPoints[Math.floor(this.rng() * total) % total];
      const dx = point.x - focusX;
      const dz = point.z - focusZ;
      const distance = Math.hypot(dx, dz);
      if (distance < minDistance || distance > maxDistance) continue;
      return point;
    }
    return null;
  }

  private spawnAt(
    point: TrafficSpawnPoint,
    focusX: number,
    focusZ: number,
    minDistance: number,
  ): boolean {
    const dx = point.x - focusX;
    const dz = point.z - focusZ;
    if (dx * dx + dz * dz < minDistance * minDistance) return false;

    // Место должно быть свободно: статика, машины игрока, копы.
    const clearance = 3.2;
    this.hash.queryCircle(point.x, point.z, clearance, this.candidates);
    for (let i = 0; i < this.candidates.length; i += 1) {
      if (circleRect(point.x, point.z, clearance, this.candidates[i], this.contact)) return false;
    }

    const typeIndex = Math.floor(this.rng() * TRAFFIC.typeWeights.length) % TRAFFIC.typeWeights.length;
    const type: VehicleTypeId = TRAFFIC.typeWeights[typeIndex] as MotorTrafficType;
    const vehicle = createVehicle(this.fleet, this.registry, {
      type,
      x: point.x,
      z: point.z,
      heading: point.heading,
      colorIndex: Math.floor(this.rng() * 6),
    });

    const agent: TrafficAgent = {
      vehicle,
      edge: point.edge,
      lane: point.lane,
      t: point.t,
      offset: 0,
      targetSpeed: 0,
      cruise: 0.88 + this.rng() * 0.12,
      phase: this.tick % TRAFFIC.farStride,
      pendingDt: 0,
      honkTimer: 0,
      stuck: 0,
      yieldTimer: 0,
      blocked: false,
      wreckTimer: 0,
      input: { throttle: 0, brake: 0, steer: 0, handbrake: false },
    };
    this.indexById.set(vehicle.id, this.agents.length);
    this.agents.push(agent);
    this.stats.spawned += 1;
    return true;
  }

  private removeAgentAt(index: number): void {
    const agent = this.agents[index];
    this.indexById.delete(agent.vehicle.id);
    this.agents.splice(index, 1);
    for (let i = index; i < this.agents.length; i += 1) {
      this.indexById.set(this.agents[i].vehicle.id, i);
    }
  }

  private despawnAgentAt(index: number, destroy: boolean): void {
    const agent = this.agents[index];
    if (destroy) destroyVehicle(this.fleet, this.registry, agent.vehicle);
    this.removeAgentAt(index);
    this.stats.despawned += 1;
  }
}
