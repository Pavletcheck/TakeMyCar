// ---------------------------------------------------------------------------
// M8. Режиссёр событий: случайные сцены города вокруг игрока.
//
// Семь типов (config/events.ts): ограбление, погоня, перестрелка, авария,
// инкассаторский фургон, уличная гонка, блокпост. Режиссёр сам не рисует и
// не трогает HUD: наружу отдаёт снимок для HUD/мини-карты и колбэки награды,
// розыска и радио. Все таймеры живут в фиксированном шаге (шаг цикла), поэтому
// на паузе сцены замирают.
//
// Одновременно активно не больше EVENT_RULES.maxActive сцен. Машины сцены —
// обычные VehicleState; при завершении освобождаются, угнанную игроком
// не удаляем (R-10/R-11).
// ---------------------------------------------------------------------------

import type { EntityId, EntityRegistry } from '../core/registry';
import { mulberry32 } from '../core/rng';
import type { RandomSource } from '../core/rng';
import { EVENT_DEFS, EVENT_RULES } from '../config/events';
import type { EventDef } from '../config/events';
import type { DistrictId } from '../config/world';
import { createVehicle, damageVehicle, destroyVehicle } from '../entities/vehicle';
import type { VehicleFleet, VehicleState } from '../entities/vehicle';
import type { RoadGraph } from '../world/types';
import { RoadActorDriver } from './actorDrive';
import type { RoadActorState } from './actorDrive';
import type { VehiclePhysics } from './vehiclePhysics';

/** Точка, где может начаться сцена. Готовит app/bootstrap из карты. */
export interface EventSpawnPoint {
  readonly x: number;
  readonly z: number;
  readonly heading: number;
  /** 'road' — проезжая часть, 'sidewalk' — тротуар у квартала. */
  readonly kind: 'road' | 'sidewalk';
  readonly district: DistrictId;
}

/** Снимок игрока для сцен. */
export interface EventPlayer {
  readonly x: number;
  readonly z: number;
  /** Модуль скорости, м/с. */
  readonly speed: number;
  readonly inVehicle: boolean;
  readonly vehicleId: number;
}

export interface EventSnapshot {
  readonly id: string;
  readonly titleKey: string;
  readonly x: number;
  readonly z: number;
  readonly remaining: number;
  readonly duration: number;
  readonly reward: number;
}

/** Маркер сцены: 3D-кольцо и точка на мини-карте. */
export interface EventMarker {
  readonly x: number;
  readonly z: number;
  readonly radius: number;
  readonly color: number;
}

/** Снимок для HUD. */
export interface EventHudState {
  readonly id: string;
  readonly titleKey: string;
  readonly descKey: string;
  readonly remaining: number;
  readonly distance: number;
  /** Сколько ещё сцен активно (HUD показывает пометку «+1»). */
  readonly more: number;
  /** Прогресс удержания зоны 0..1. */
  readonly hold: number;
}

export type EventNewsKind = 'start' | 'resolved' | 'failed' | 'escaped';

export interface EventDirectorOptions {
  readonly fleet: VehicleFleet;
  readonly registry: EntityRegistry;
  readonly physics: VehiclePhysics;
  readonly graph: RoadGraph;
  readonly spawnPoints: readonly EventSpawnPoint[];
  readonly playerId: EntityId;
  readonly seed?: number;
  onStart?: (def: EventDef, x: number, z: number) => void;
  onEnd?: (def: EventDef, resolved: boolean) => void;
  onReward?: (def: EventDef, amount: number) => void;
  /** Поднять розыск до уровня (app ограничивает сверху — EVT-06). */
  onHeat?: (level: number) => void;
  onNews?: (kind: EventNewsKind, def: EventDef) => void;
}

interface ActiveEvent {
  readonly def: EventDef;
  readonly x: number;
  readonly z: number;
  readonly heading: number;
  timeLeft: number;
  hold: number;
  actor: VehicleState | null;
  readonly extras: VehicleState[];
  driver: RoadActorState | null;
  distance: number;
}

export class EventDirector {
  readonly stats = { spawned: 0, resolved: 0, failed: 0, cancelled: 0 };

  private readonly fleet: VehicleFleet;
  private readonly registry: EntityRegistry;
  private readonly spawnPoints: readonly EventSpawnPoint[];
  private readonly playerId: EntityId;
  private readonly rng: RandomSource;
  private readonly driver: RoadActorDriver;
  private readonly active: ActiveEvent[] = [];
  private readonly snapshots: EventSnapshot[] = [];
  private readonly onStartHook: EventDirectorOptions['onStart'] | null;
  private readonly onEndHook: EventDirectorOptions['onEnd'] | null;
  private readonly onRewardHook: EventDirectorOptions['onReward'] | null;
  private readonly onHeatHook: EventDirectorOptions['onHeat'] | null;
  private readonly onNewsHook: EventDirectorOptions['onNews'] | null;

  private nextTimer: number = EVENT_RULES.firstDelay;
  private playerX = 0;
  private playerZ = 0;
  private playerSpeed = 0;
  private playerInVehicle = false;
  private playerVehicleId: number = -1;

  constructor(options: EventDirectorOptions) {
    this.fleet = options.fleet;
    this.registry = options.registry;
    this.spawnPoints = options.spawnPoints;
    this.playerId = options.playerId;
    this.rng = mulberry32(options.seed ?? 0xe7e17);
    this.driver = new RoadActorDriver(options.graph, options.physics, this.rng);
    this.onStartHook = options.onStart ?? null;
    this.onEndHook = options.onEnd ?? null;
    this.onRewardHook = options.onReward ?? null;
    this.onHeatHook = options.onHeat ?? null;
    this.onNewsHook = options.onNews ?? null;
  }

  get activeCount(): number {
    return this.active.length;
  }

  /** Машины сцены шагает режиссёр: bootstrap их не трогает. */
  owns(id: EntityId): boolean {
    for (let i = 0; i < this.active.length; i += 1) {
      const ev = this.active[i];
      if (ev.actor && ev.actor.id === id) return true;
      for (let k = 0; k < ev.extras.length; k += 1) {
        if (ev.extras[k].id === id) return true;
      }
    }
    return false;
  }

  /** Все активные сцены. */
  events(): readonly EventSnapshot[] {
    this.snapshots.length = 0;
    for (let i = 0; i < this.active.length; i += 1) {
      const ev = this.active[i];
      this.snapshots.push({
        id: ev.def.id,
        titleKey: ev.def.titleKey,
        x: Number(ev.x.toFixed(1)),
        z: Number(ev.z.toFixed(1)),
        remaining: Number(ev.timeLeft.toFixed(1)),
        duration: ev.def.duration,
        reward: ev.def.reward,
      });
    }
    return this.snapshots;
  }

  /** Примарная сцена для HUD (стабильно — самая старая). */
  hud(): EventHudState | null {
    const ev = this.active[0];
    if (!ev) return null;
    const dx = ev.x - this.playerX;
    const dz = ev.z - this.playerZ;
    const holdTotal = ev.def.objective === 'stay' ? Math.max(0.001, ev.def.holdTime) : 1;
    return {
      id: ev.def.id,
      titleKey: ev.def.titleKey,
      descKey: ev.def.descKey,
      remaining: ev.timeLeft,
      distance: Math.hypot(dx, dz),
      more: this.active.length - 1,
      hold: Math.min(1, ev.hold / holdTotal),
    };
  }

  marker(): EventMarker | null {
    const ev = this.active[0];
    if (!ev) return null;
    return { x: ev.x, z: ev.z, radius: ev.def.markerRadius, color: ev.def.color };
  }

  /** Принудительный старт сцены (отладка/смоук). */
  forceEvent(id: string, x?: number, z?: number): number {
    let def: EventDef | null = null;
    for (let i = 0; i < EVENT_DEFS.length; i += 1) {
      if (EVENT_DEFS[i].id === id) {
        def = EVENT_DEFS[i];
        break;
      }
    }
    if (!def) return 0;
    while (this.active.length >= EVENT_RULES.maxActive) {
      // Освобождаем место без штрафа: сцена не провалена, а отменена.
      this.cancelAt(0);
    }
    if (x !== undefined && z !== undefined && Number.isFinite(x) && Number.isFinite(z)) {
      this.spawnAt(def, x, z, 0);
      return 1;
    }
    return this.spawnRandom(def) ? 1 : 0;
  }

  /** Отменить активные сцены без награды и розыска. */
  cancelEvent(): number {
    const count = this.active.length;
    while (this.active.length > 0) this.cancelAt(0);
    this.stats.cancelled += count;
    this.nextTimer = Math.min(this.nextTimer, EVENT_RULES.cooldownMin);
    return count;
  }

  /** Полный сброс (загрузка профиля/новая игра). */
  reset(): void {
    this.cancelEvent();
    this.active.length = 0;
    this.nextTimer = EVENT_RULES.firstDelay;
  }

  /** Шаг режиссёра. Вызывается из фиксированного шага. */
  update(dt: number, player: EventPlayer): void {
    this.playerX = player.x;
    this.playerZ = player.z;
    this.playerSpeed = player.speed;
    this.playerInVehicle = player.inVehicle;
    this.playerVehicleId = player.vehicleId;

    if (this.active.length < EVENT_RULES.maxActive) {
      this.nextTimer -= dt;
      if (this.nextTimer <= 0) {
        this.nextTimer = this.randomCooldown();
        this.spawnRandom(null);
      }
    }

    for (let i = this.active.length - 1; i >= 0; i -= 1) {
      const ev = this.active[i];
      if (!this.stepEvent(ev, dt)) {
        this.active.splice(i, 1);
      }
    }
  }

  /** Внешнее событие: машина сцены уничтожена (зовёт bootstrap). */
  notifyWreck(id: EntityId): void {
    for (let i = this.active.length - 1; i >= 0; i -= 1) {
      const ev = this.active[i];
      if (!ev.actor || ev.actor.id !== id) continue;
      if (ev.def.objective !== 'wreck' && ev.def.objective !== 'ram') continue;
      this.finish(ev, true);
      this.active.splice(i, 1);
      return;
    }
  }

  // --- внутреннее ----------------------------------------------------------

  private stepEvent(ev: ActiveEvent, dt: number): boolean {
    const def = ev.def;
    ev.timeLeft -= dt;
    const dx = ev.actor && def.objective === 'wreck' ? ev.actor.transform.x - this.playerX : ev.x - this.playerX;
    const dz = ev.actor && def.objective === 'wreck' ? ev.actor.transform.z - this.playerZ : ev.z - this.playerZ;
    ev.distance = Math.hypot(dx, dz);

    if (ev.driver && ev.actor && ev.actor.driver < 0) this.driver.step(ev.driver, dt);

    if (ev.timeLeft <= 0) {
      this.finish(ev, false);
      return false;
    }

    // Преступник удрал далеко — сцена провалена, но не мгновенно.
    if (def.actor === 'suspect' && ev.actor && ev.distance > EVENT_RULES.despawnDistance) {
      this.finish(ev, false);
      return false;
    }

    switch (def.objective) {
      case 'reach': {
        const okVehicle = !def.requireVehicle || this.playerInVehicle;
        if (okVehicle && this.distanceTo(ev.x, ev.z) <= def.markerRadius + EVENT_RULES.reachPad) {
          this.finish(ev, true);
          return false;
        }
        return true;
      }
      case 'stay': {
        const inside = this.distanceTo(ev.x, ev.z) <= def.markerRadius;
        if (inside) ev.hold += dt;
        else ev.hold = Math.max(0, ev.hold - dt * 2);
        if (ev.hold >= def.holdTime) {
          this.finish(ev, true);
          return false;
        }
        return true;
      }
      case 'wreck': {
        const actor = ev.actor;
        if (!actor) {
          this.finish(ev, false);
          return false;
        }
        if (actor.wrecked || actor.driver === this.playerId || this.playerVehicleId === actor.id) {
          this.finish(ev, true);
          return false;
        }
        return true;
      }
      case 'ram': {
        const actor = ev.actor;
        if (!actor) {
          this.finish(ev, false);
          return false;
        }
        if (actor.wrecked || actor.driver === this.playerId || this.playerVehicleId === actor.id) {
          this.finish(ev, true);
          return false;
        }
        const near = this.distanceTo(actor.transform.x, actor.transform.z) <= def.markerRadius;
        if (near && this.playerInVehicle && this.playerSpeed >= EVENT_RULES.ramSpeed) {
          this.finish(ev, true);
          return false;
        }
        return true;
      }
      case 'escape': {
        if (
          this.playerInVehicle &&
          this.playerSpeed >= EVENT_RULES.escapeSpeed &&
          this.distanceTo(ev.x, ev.z) <= def.markerRadius
        ) {
          this.finish(ev, true);
          return false;
        }
        return true;
      }
      default:
        return true;
    }
  }

  private distanceTo(x: number, z: number): number {
    const dx = x - this.playerX;
    const dz = z - this.playerZ;
    return Math.hypot(dx, dz);
  }

  private spawnRandom(preferred: EventDef | null): boolean {
    if (this.active.length >= EVENT_RULES.maxActive) return false;
    const district = this.districtAtPlayer();

    let def = preferred;
    if (!def) {
      let total = 0;
      for (let i = 0; i < EVENT_DEFS.length; i += 1) {
        const candidate = EVENT_DEFS[i];
        if (this.isActive(candidate.id)) continue;
        total += candidate.weight[district];
      }
      if (total <= 0) {
        // Район без подходящих сцен: берём любую, кроме уже идущих.
        for (let i = 0; i < EVENT_DEFS.length; i += 1) {
          if (!this.isActive(EVENT_DEFS[i].id)) {
            def = EVENT_DEFS[i];
            break;
          }
        }
      } else {
        let roll = this.rng() * total;
        for (let i = 0; i < EVENT_DEFS.length; i += 1) {
          const candidate = EVENT_DEFS[i];
          if (this.isActive(candidate.id)) continue;
          const weight = candidate.weight[district];
          if (weight <= 0) continue;
          roll -= weight;
          if (roll <= 0) {
            def = candidate;
            break;
          }
        }
      }
      if (!def) def = EVENT_DEFS[0];
    }

    const point = this.pickPoint(def.placement);
    if (!point) return false;
    this.spawnAt(def, point.x, point.z, point.heading);
    return true;
  }

  private pickPoint(kind: 'road' | 'sidewalk'): EventSpawnPoint | null {
    const total = this.spawnPoints.length;
    if (total === 0) return null;
    const minSq = EVENT_RULES.spawnMinDistance * EVENT_RULES.spawnMinDistance;
    const maxSq = EVENT_RULES.spawnMaxDistance * EVENT_RULES.spawnMaxDistance;
    for (let attempt = 0; attempt < 28; attempt += 1) {
      const point = this.spawnPoints[Math.floor(this.rng() * total) % total];
      if (point.kind !== kind) continue;
      const dx = point.x - this.playerX;
      const dz = point.z - this.playerZ;
      const distSq = dx * dx + dz * dz;
      if (distSq < minSq || distSq > maxSq) continue;
      // Не ставим сцену поверх уже идущей.
      let busy = false;
      for (let i = 0; i < this.active.length; i += 1) {
        const ev = this.active[i];
        const ex = ev.x - point.x;
        const ez = ev.z - point.z;
        if (ex * ex + ez * ez < 40 * 40) {
          busy = true;
          break;
        }
      }
      if (busy) continue;
      return point;
    }
    return null;
  }

  private spawnAt(def: EventDef, x: number, z: number, heading: number): void {
    const ev: ActiveEvent = {
      def,
      x,
      z,
      heading,
      timeLeft: def.duration,
      hold: 0,
      actor: null,
      extras: [],
      driver: null,
      distance: this.distanceTo(x, z),
    };

    switch (def.actor) {
      case 'suspect': {
        const car = this.createActor('sports', x, z, heading, 1);
        if (car) {
          ev.actor = car;
          ev.driver = this.driver.create(car, 15);
        }
        break;
      }
      case 'van': {
        const car = this.createActor('truck', x, z, heading, 3);
        if (car) ev.actor = car;
        break;
      }
      case 'wreckPair': {
        const a = this.createActor('sedan', x + Math.cos(heading) * 2.4, z - Math.sin(heading) * 2.4, heading, 0);
        const b = this.createActor('van', x - Math.cos(heading) * 2.4, z + Math.sin(heading) * 2.4, heading + Math.PI, 2);
        if (a) {
          damageVehicle(a, a.maxHp + 10);
          ev.extras.push(a);
        }
        if (b) {
          damageVehicle(b, b.maxHp + 10);
          ev.extras.push(b);
        }
        break;
      }
      case 'police': {
        const a = this.createActor('police', x + Math.cos(heading) * 3.4, z - Math.sin(heading) * 3.4, heading + Math.PI / 2, 0);
        const b = this.createActor('police', x - Math.cos(heading) * 3.4, z + Math.sin(heading) * 3.4, heading - Math.PI / 2, 0);
        if (a) ev.extras.push(a);
        if (b) ev.extras.push(b);
        break;
      }
      case 'race': {
        const a = this.createActor('sports', x + Math.cos(heading) * 2.8, z - Math.sin(heading) * 2.8, heading, 0);
        const b = this.createActor('sports', x - Math.cos(heading) * 2.8, z + Math.sin(heading) * 2.8, heading, 2);
        if (a) ev.extras.push(a);
        if (b) ev.extras.push(b);
        break;
      }
      default:
        break;
    }

    this.active.push(ev);
    this.stats.spawned += 1;
    if (this.onStartHook) this.onStartHook(def, x, z);
    if (this.onNewsHook) this.onNewsHook('start', def);
  }

  private createActor(
    type: 'sedan' | 'sports' | 'van' | 'truck' | 'police',
    x: number,
    z: number,
    heading: number,
    colorIndex: number,
  ): VehicleState | null {
    // Точка сцены уже проверена на дороге; лёгкий сдвиг на полосу безопасен.
    if (!Number.isFinite(x) || !Number.isFinite(z)) return null;
    return createVehicle(this.fleet, this.registry, { type, x, z, heading, colorIndex });
  }

  private finish(ev: ActiveEvent, resolved: boolean): void {
    const def = ev.def;
    this.cleanup(ev);
    if (resolved) {
      this.stats.resolved += 1;
      if (this.onRewardHook) this.onRewardHook(def, def.reward);
      if (def.heatOnResolve > 0 && this.onHeatHook) this.onHeatHook(def.heatOnResolve);
    } else {
      this.stats.failed += 1;
      if (def.heatOnFail > 0 && this.onHeatHook) this.onHeatHook(def.heatOnFail);
    }
    if (this.onEndHook) this.onEndHook(def, resolved);
    if (this.onNewsHook) this.onNewsHook(resolved ? 'resolved' : 'failed', def);
    this.nextTimer = this.randomCooldown();
  }

  /** Отмена без последствий (лимит, загрузка, смоук). */
  private cancelAt(index: number): void {
    const ev = this.active[index];
    if (!ev) return;
    this.cleanup(ev);
    this.active.splice(index, 1);
  }

  /** Освободить машины сцены; угнанные игроком не удаляем (R-10). */
  private cleanup(ev: ActiveEvent): void {
    if (ev.actor && ev.actor.driver < 0) destroyVehicle(this.fleet, this.registry, ev.actor);
    for (let i = 0; i < ev.extras.length; i += 1) {
      const car = ev.extras[i];
      if (car.driver < 0) destroyVehicle(this.fleet, this.registry, car);
    }
    ev.extras.length = 0;
    ev.actor = null;
    ev.driver = null;
  }

  private isActive(id: string): boolean {
    for (let i = 0; i < this.active.length; i += 1) {
      if (this.active[i].def.id === id) return true;
    }
    return false;
  }

  private districtAtPlayer(): DistrictId {
    let best: DistrictId = 'center';
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < this.spawnPoints.length; i += 1) {
      const point = this.spawnPoints[i];
      const dx = point.x - this.playerX;
      const dz = point.z - this.playerZ;
      const dist = dx * dx + dz * dz;
      if (dist < bestDistance) {
        bestDistance = dist;
        best = point.district;
      }
    }
    return best;
  }

  private randomCooldown(): number {
    return (
      EVENT_RULES.cooldownMin +
      this.rng() * (EVENT_RULES.cooldownMax - EVENT_RULES.cooldownMin)
    );
  }
}
