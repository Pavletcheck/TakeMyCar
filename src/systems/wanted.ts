// ---------------------------------------------------------------------------
// M5. Полиция и уровень розыска.
//
// Heat 0–5 живёт в очках: преступления добавляют, время и укрытие снимают.
// Уровень = сколько порогов пройдено (config/life.ts). Копы появляются
// ТОЛЬКО за кадром — на узлах дорожного графа вне радиуса видимости игрока,
// и уезжают, когда розыск падает.
//
// Машины копов — обычные VehicleState: системы сами шагают их физикой
// (bootstrap пропускает всё, что owns()), поэтому погоня использует ту же
// аркадную модель, что и игрок. Движение — сначала по графу до ближайшего
// узла к цели, затем прямой перехват, PIT и таран.
//
// Пешие копы живут в NpcPool (kind 'cop'): преследуют, стреляют через
// CombatSystem, при остановке игрока пешком — арест. Крови нет: только
// падение и «звёзды».
// ---------------------------------------------------------------------------

import type { Collider } from '../core/math';
import { clamp, normalizeAngle } from '../core/math';
import type { EntityId, EntityRegistry } from '../core/registry';
import type { SpatialHash } from '../core/spatialHash';
import { mulberry32 } from '../core/rng';
import type { RandomSource } from '../core/rng';
import { PEDS, WANTED, WEAPONS } from '../config/life';
import type { CrimeKind } from '../config/life';
import { createNpc, NpcPool } from '../entities/npc';
import type { NpcState } from '../entities/npc';
import { createVehicle, destroyVehicle, damageVehicle } from '../entities/vehicle';
import type { VehicleFleet, VehicleState } from '../entities/vehicle';
import type { RoadGraph } from '../world/types';
import type { CombatSystem } from './combat';
import { rayRect } from './combat';
import { driveTowards } from './traffic';
import type { VehicleInput, VehiclePhysics } from './vehiclePhysics';

/** Снимок игрока на тик: системам не нужен PlayerController. */
export interface PlayerSnapshot {
  readonly x: number;
  readonly z: number;
  readonly vx: number;
  readonly vz: number;
  readonly heading: number;
  readonly onFoot: boolean;
  readonly vehicle: VehicleState | null;
}

export type CopMode = 'chase' | 'block';

/** Машина копа: состояние погони поверх VehicleState. */
interface CopCar {
  readonly vehicle: VehicleState;
  mode: CopMode;
  edge: number;
  t: number;
  /** Таймер жизни: чтобы копы не пропадали сразу при смене уровня. */
  life: number;
  pitTimer: number;
  stuck: number;
  /** Кулдаун стрельбы из машины по пешему игроку. */
  fireTimer: number;
  readonly input: VehicleInput;
}

export interface WantedStats {
  /** Очки heat (0..100). */
  heat: number;
  level: number;
  /** Машин копов в мире. */
  cars: number;
  /** Пеших копов. */
  foot: number;
  health: number;
  /** Коп видит игрока в этом тике. */
  seen: number;
  /** Секунд без видимости (для укрытия). */
  unseen: number;
  crimes: number;
  spawned: number;
  despawned: number;
  arrests: number;
  /** Сколько выстрелов сделали копы и сколько попало по игроку. */
  copShots: number;
  copHits: number;
  /** Дистанция до ближайшей машины/пешего копа, м (диагностика). */
  nearestCar: number;
  nearestFoot: number;
  updateMs: number;
  maxUpdateMs: number;
}

export interface WantedOptions {
  readonly registry: EntityRegistry;
  readonly fleet: VehicleFleet;
  readonly hash: SpatialHash<Collider>;
  readonly graph: RoadGraph;
  readonly physics: VehiclePhysics;
  readonly combat: CombatSystem;
  /** Пул пеших копов (отдельно от пешеходов). */
  readonly npcPool: NpcPool;
  readonly playerId: EntityId;
  readonly seed?: number;
}

export class WantedSystem {
  readonly stats: WantedStats = {
    heat: 0,
    level: 0,
    cars: 0,
    foot: 0,
    health: WANTED.playerHealth,
    seen: 0,
    unseen: 0,
    crimes: 0,
    spawned: 0,
    despawned: 0,
    arrests: 0,
    copShots: 0,
    copHits: 0,
    nearestCar: 0,
    nearestFoot: 0,
    updateMs: 0,
    maxUpdateMs: 0,
  };

  /** Игрока арестовали/он выведен из строя: app делает респавн. */
  onPlayerCaught: ((reason: 'arrest' | 'down', x: number, z: number) => void) | null = null;
  /** Смена уровня розыска — для HUD и звука. */
  onLevelChanged: ((level: number, reason: 'crime' | 'evade' | 'reset') => void) | null = null;

  private readonly registry: EntityRegistry;
  private readonly fleet: VehicleFleet;
  private readonly hash: SpatialHash<Collider>;
  private readonly graph: RoadGraph;
  private readonly physics: VehiclePhysics;
  private readonly combat: CombatSystem;
  private readonly pool: NpcPool;
  private readonly rng: RandomSource;
  private readonly candidates: Collider[] = [];
  private readonly laneScratch = { x: 0, z: 0 };
  private readonly cops: CopCar[] = [];
  private readonly copIndex = new Map<EntityId, number>();

  private heatPoints = 0;
  private levelValue = 0;
  private crimeTimer = 0;
  private unseenTimer = 0;
  private seenNow = false;
  private spawnTimer = 0;
  private footTimer = 0;
  private healthValue = WANTED.playerHealth;
  private damageTimer = 0;
  private caught = false;
  private sirenX = 0;
  private sirenZ = 0;
  private sirenActive = false;
  private lastPlayerX = 0;
  private lastPlayerZ = 0;
  private tick = 0;

  constructor(options: WantedOptions) {
    this.registry = options.registry;
    this.fleet = options.fleet;
    this.hash = options.hash;
    this.graph = options.graph;
    this.physics = options.physics;
    this.combat = options.combat;
    this.pool = options.npcPool;
    this.rng = mulberry32(options.seed ?? 0x9a71c3);
  }

  get heat(): number {
    return this.heatPoints;
  }

  get level(): number {
    return this.levelValue;
  }

  get health(): number {
    return this.healthValue;
  }

  /** Координата ближайшей машины с сиреной (для пешеходов и HUD). */
  get sirenNear(): boolean {
    return this.sirenActive;
  }

  get sirenPositionX(): number {
    return this.sirenX;
  }

  get sirenPositionZ(): number {
    return this.sirenZ;
  }

  /** Машины копов шагает эта система: bootstrap их не трогает. */
  owns(id: EntityId): boolean {
    const index = this.copIndex.get(id);
    if (index === undefined) return false;
    // Игрок угнал полицейскую машину — дальше её ведёт ввод игрока.
    return this.cops[index].vehicle.driver < 0;
  }

  /** Машину забрал игрок: система больше не ведёт её (машина остаётся). */
  releaseVehicle(id: EntityId): void {
    const index = this.copIndex.get(id);
    if (index === undefined) return;
    this.copIndex.delete(id);
    this.cops.splice(index, 1);
    for (let i = index; i < this.cops.length; i += 1) this.copIndex.set(this.cops[i].vehicle.id, i);
  }

  get(id: EntityId): NpcState | null {
    return this.pool.get(id) ?? null;
  }

  /** Преступление: очки heat и сброс таймера остывания. */
  addCrime(kind: CrimeKind, _x: number, _z: number): void {
    const points = WANTED.crimes[kind];
    if (!(points > 0)) return;
    this.heatPoints = Math.min(100, this.heatPoints + points);
    this.crimeTimer = 0;
    this.unseenTimer = 0;
    this.stats.crimes += 1;
    this.refreshLevel('crime');
  }

  /** Отладка/сюжет: принудительно выставить уровень 0..5. */
  setLevel(level: number): void {
    const target = clamp(Math.round(level), 0, 5);
    if (target === 0) {
      this.heatPoints = 0;
    } else {
      const threshold = WANTED.thresholds[target - 1];
      this.heatPoints = Math.max(this.heatPoints, threshold + 1);
      if (this.levelValue > target) this.heatPoints = threshold + 1;
    }
    this.crimeTimer = 0;
    this.unseenTimer = 0;
    this.refreshLevel('crime');
  }

  /** Полный сброс после ареста/респавна. */
  reset(): void {
    this.heatPoints = 0;
    this.levelValue = 0;
    this.crimeTimer = 0;
    this.unseenTimer = 0;
    this.healthValue = WANTED.playerHealth;
    this.damageTimer = 0;
    this.caught = false;
    this.stats.level = 0;
    this.stats.heat = 0;
    this.stats.health = this.healthValue;
  }

  /** Шаг розыска: остывание, спавн, погоня, пешие копы, арест, здоровье. */
  update(dt: number, player: PlayerSnapshot): void {
    const started = performance.now();
    this.tick += 1;
    this.lastPlayerX = player.x;
    this.lastPlayerZ = player.z;
    this.crimeTimer += dt;
    this.damageTimer += dt;

    this.seenNow = this.isPlayerSeen(player.x, player.z);
    this.stats.seen = this.seenNow ? 1 : 0;
    if (this.seenNow) {
      this.unseenTimer = 0;
    } else {
      this.unseenTimer += dt;
    }
    this.stats.unseen = this.unseenTimer;

    // --- остывание ----------------------------------------------------------
    if (this.crimeTimer > WANTED.crimePause && !this.seenNow) {
      const cover = this.unseenTimer > WANTED.coverDelay;
      const rate = cover ? WANTED.coverRate : WANTED.coolRate;
      if (this.heatPoints > 0) {
        this.heatPoints = Math.max(0, this.heatPoints - rate * dt);
        this.refreshLevel(cover ? 'reset' : 'evade');
      }
    }

    // --- здоровье игрока ----------------------------------------------------
    if (this.damageTimer > WANTED.healthRegenDelay && this.healthValue < WANTED.playerHealth) {
      this.healthValue = Math.min(WANTED.playerHealth, this.healthValue + WANTED.healthRegen * dt);
      this.stats.health = this.healthValue;
    }

    this.updateCops(dt, player);
    this.updateFootCops(dt, player);
    this.updateArrest(player);

    this.stats.heat = this.heatPoints;
    this.stats.level = this.levelValue;
    this.stats.cars = this.cops.length;
    this.stats.foot = this.countFootCops();
    this.stats.health = this.healthValue;

    const elapsed = performance.now() - started;
    this.stats.updateMs = elapsed;
    if (elapsed > this.stats.maxUpdateMs) this.stats.maxUpdateMs = elapsed;
  }

  /** Спавн копа рядом (отладка/сюжет). Возвращает число машин копов. */
  spawnCop(x?: number, z?: number): number {
    const point = this.pickSpawnPoint(
      x ?? this.lastPlayerX,
      z ?? this.lastPlayerZ,
      0,
      30,
      90,
      'chase',
    );
    if (!point) return this.cops.length;
    this.spawnCopCar(point.x, point.z, point.heading, 'chase');
    this.stats.cars = this.cops.length;
    return this.cops.length;
  }

  /** Очистить полицию (респавн сцены). */
  clear(): void {
    for (let i = this.cops.length - 1; i >= 0; i -= 1) this.removeCopAt(i, true);
    for (let i = this.pool.list.length - 1; i >= 0; i -= 1) {
      const npc = this.pool.list[i];
      this.pool.remove(npc.id);
      this.registry.destroy(npc.id);
    }
    this.copIndex.clear();
  }

  // --- уровень -------------------------------------------------------------

  private refreshLevel(reason: 'crime' | 'evade' | 'reset'): void {
    let level = 0;
    for (let i = 0; i < WANTED.thresholds.length; i += 1) {
      if (this.heatPoints >= WANTED.thresholds[i]) level = i + 1;
    }
    if (level === this.levelValue) return;
    this.levelValue = level;
    if (this.onLevelChanged) this.onLevelChanged(level, reason);
  }

  private isPlayerSeen(x: number, z: number): boolean {
    const radiusSq = WANTED.seenRadius * WANTED.seenRadius;
    let nearest = 0;
    let seen = false;
    for (let i = 0; i < this.cops.length; i += 1) {
      const transform = this.cops[i].vehicle.transform;
      const dx = transform.x - x;
      const dz = transform.z - z;
      const distSq = dx * dx + dz * dz;
      if (nearest === 0 || distSq < nearest) nearest = distSq;
      if (distSq < radiusSq) seen = true;
    }
    const list = this.pool.list;
    for (let i = 0; i < list.length; i += 1) {
      const dx = list[i].transform.x - x;
      const dz = list[i].transform.z - z;
      const distSq = dx * dx + dz * dz;
      if (nearest === 0 || distSq < nearest) nearest = distSq;
      if (distSq < radiusSq) seen = true;
    }
    this.stats.nearestCar = nearest > 0 ? Math.sqrt(nearest) : 0;
    this.stats.nearestFoot = this.stats.nearestCar;
    return seen;
  }

  /** Стена/здание между копом и игроком обрывает видимость (укрытие работает). */
  private hasLineOfSight(x1: number, z1: number, x2: number, z2: number): boolean {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const distance = Math.hypot(dx, dz);
    if (distance < 1e-3) return true;
    const nx = dx / distance;
    const nz = dz / distance;
    this.hash.queryCircle((x1 + x2) / 2, (z1 + z2) / 2, distance / 2 + 1, this.candidates);
    for (let i = 0; i < this.candidates.length; i += 1) {
      const collider = this.candidates[i];
      if (collider.id < 0) continue; // машины/NPC не считаем укрытием
      const hit = rayRect(x1, z1, nx, nz, collider, distance);
      if (hit >= 0 && hit < distance - 0.5) return false;
    }
    return true;
  }

  // --- машины копов ---------------------------------------------------------

  private updateCops(dt: number, player: PlayerSnapshot): void {
    const desiredCars = this.levelValue > 0 ? WANTED.carsPerLevel[this.levelValue] : 0;
    const cap = Math.min(WANTED.maxCops, desiredCars);

    // Укомплектование: не чаще spawnInterval, только за кадром.
    this.spawnTimer += dt;
    if (this.spawnTimer >= WANTED.spawnInterval) {
      this.spawnTimer = 0;
      if (this.cops.length < cap) {
        this.spawnWave(player, cap);
      } else if (this.cops.length > cap) {
        this.releaseExtra(player);
      }
    }

    let sirenBest = -1;
    let sirenDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < this.cops.length; i += 1) {
      const cop = this.cops[i];
      cop.life += dt;
      if (cop.vehicle.driver >= 0) continue;
      const transform = cop.vehicle.transform;

      const distance = Math.hypot(transform.x - player.x, transform.z - player.z);
      if (distance > WANTED.despawnDistance) {
        this.removeCopAt(i, true);
        i -= 1;
        continue;
      }
      if (this.levelValue === 0 && cop.life > 2) {
        this.removeCopAt(i, true);
        i -= 1;
        continue;
      }
      if (distance < sirenDistance) {
        sirenDistance = distance;
        sirenBest = i;
      }

      // Подтягивание погони: если коп отстал и его не видно, он появляется
      // на дороге в 30–45 м от игрока. Это аркадный rubber-band, а не телепорт
      // на глазах: дистанция больше половины экрана.
      if (distance > 65 && cop.life > 2) {
        const point = this.pickSpawnPoint(player.x, player.z, player.heading, 28, 45, 'chase');
        if (point) {
          transform.x = point.x;
          transform.z = point.z;
          transform.heading = point.heading;
          transform.prevX = point.x;
          transform.prevZ = point.z;
          transform.prevHeading = point.heading;
          transform.vx = 0;
          transform.vz = 0;
          const near = this.graph.nearestEdge(point.x, point.z);
          cop.edge = near < 0 ? cop.edge : near;
          cop.life = 0;
          cop.fireTimer = 0.6;
        }
      }

      this.driveCop(cop, dt, player, distance);
      this.checkCopImpact(cop, player);

      // Стрельба из машины: только по видимой цели и в радиусе.
      if (
        distance < WANTED.copFireRange &&
        this.hasLineOfSight(transform.x, transform.z, player.x, player.z)
      ) {
        cop.fireTimer -= dt;
        if (cop.fireTimer <= 0) {
          cop.fireTimer = WANTED.copFireInterval * (0.8 + this.rng() * 0.6);
          const heading = transform.heading;
          const muzzleX = transform.x + Math.sin(heading) * 2.2;
          const muzzleZ = transform.z + Math.cos(heading) * 2.2;
          this.combat.fireAt(
            muzzleX,
            muzzleZ,
            player.x,
            player.z,
            WANTED.copWeapon,
            WANTED.copAccuracy * 0.85,
            WANTED.copDamageScale,
            { x: player.x, z: player.z, radius: 0.5 },
            cop.vehicle.id,
          );
          this.stats.copShots += 1;
          // Трассер для визуала; урон — по вероятности, чтобы углы и трафик
          // не «съедали» все пули и погоня не была беззубой.
          const hitChance = WANTED.copAccuracy * clamp(1 - distance / 120, 0.25, 1);
          if (this.rng() < hitChance) {
            this.stats.copHits += 1;
            const damage = WEAPONS[WANTED.copWeapon].damage;
            if (player.vehicle) damageVehicle(player.vehicle, damage);
            else this.applyPlayerDamage(damage);
          }
        }
      } else if (cop.fireTimer < 0.5) {
        cop.fireTimer = 0.5;
      }
    }

    if (sirenBest >= 0 && sirenDistance < 130 && this.levelValue > 0) {
      this.sirenActive = true;
      this.sirenX = this.cops[sirenBest].vehicle.transform.x;
      this.sirenZ = this.cops[sirenBest].vehicle.transform.z;
    } else {
      this.sirenActive = false;
    }
  }

  /** Одна волна: погоня, блокпост (3+) или перехват (4+). */
  private spawnWave(player: PlayerSnapshot, cap: number): void {
    const need = cap - this.cops.length;
    if (need <= 0) return;
    const level = this.levelValue;

    if (level >= WANTED.roadblockLevel && this.countMode('block') === 0) {
      // Блокпост: две машины поперёк дороги впереди по ходу игрока.
      const point = this.pickSpawnPoint(
        player.x,
        player.z,
        player.heading,
        WANTED.carSpawnMinDistance,
        WANTED.carSpawnMaxDistance,
        'block',
      );
      if (point) {
        const offsetX = Math.cos(point.heading) * 1.9;
        const offsetZ = -Math.sin(point.heading) * 1.9;
        this.spawnCopCar(point.x + offsetX, point.z + offsetZ, point.heading, 'block');
        if (this.cops.length < cap) {
          this.spawnCopCar(point.x - offsetX, point.z - offsetZ, point.heading, 'block');
        }
        return;
      }
    }

    const from = level >= WANTED.interceptLevel ? 'intercept' : 'chase';
    const point = this.pickSpawnPoint(
      player.x,
      player.z,
      player.heading,
      WANTED.carSpawnMinDistance,
      WANTED.carSpawnMaxDistance,
      from,
    );
    if (!point) return;
    this.spawnCopCar(point.x, point.z, point.heading, 'chase');
  }

  private countMode(mode: CopMode): number {
    let count = 0;
    for (let i = 0; i < this.cops.length; i += 1) if (this.cops[i].mode === mode) count += 1;
    return count;
  }

  private releaseExtra(player: PlayerSnapshot): void {
    const limit = Math.min(WANTED.maxCops, WANTED.carsPerLevel[this.levelValue] ?? 0);
    while (this.cops.length > limit) {
      let worst = -1;
      let worstDistance = -1;
      for (let i = 0; i < this.cops.length; i += 1) {
        if (this.cops[i].life < 2) continue;
        const transform = this.cops[i].vehicle.transform;
        const distance = Math.hypot(transform.x - player.x, transform.z - player.z);
        if (distance > worstDistance) {
          worstDistance = distance;
          worst = i;
        }
      }
      if (worst < 0) break;
      this.removeCopAt(worst, true);
    }
  }

  /**
   * Точка спавна у узла графа: только вне кадра и только свободная.
   * `mode` задаёт, ставим ли машину поперёк дороги и куда смотреть.
   */
  private pickSpawnPoint(
    x: number,
    z: number,
    heading: number,
    minDistance: number,
    maxDistance: number,
    mode: 'chase' | 'block' | 'intercept',
  ): { x: number; z: number; heading: number } | null {
    const nodes = this.graph.nodes;
    const sin = Math.sin(heading);
    const cos = Math.cos(heading);
    let best = -1;
    let bestScore = -Infinity;
    for (let attempt = 0; attempt < 26; attempt += 1) {
      const index = Math.floor(this.rng() * nodes.length) % nodes.length;
      const node = nodes[index];
      const dx = node.x - x;
      const dz = node.z - z;
      const distance = Math.hypot(dx, dz);
      if (distance < minDistance || distance > maxDistance) continue;
      // Перехват и блокпост — впереди по ходу игрока, погоня — где угодно.
      const forward = dx * sin + dz * cos;
      const score = mode === 'chase' ? -Math.abs(distance - (minDistance + maxDistance) * 0.5) : forward;
      if (score > bestScore) {
        bestScore = score;
        best = index;
      }
    }
    if (best < 0) return null;
    const node = nodes[best];
    // Смещение от узла: машина не должна стоять в центре перекрёстка.
    const spawnHeading = mode === 'block' ? heading + Math.PI / 2 : Math.atan2(x - node.x, z - node.z);
    const offset = mode === 'block' ? 0 : 6;
    const px = node.x + Math.sin(spawnHeading) * offset;
    const pz = node.z + Math.cos(spawnHeading) * offset;
    if (this.isBlocked(px, pz, 2.6)) return null;
    return { x: px, z: pz, heading: spawnHeading };
  }

  private isBlocked(x: number, z: number, radius: number): boolean {
    this.hash.queryCircle(x, z, radius + 0.2, this.candidates);
    for (let i = 0; i < this.candidates.length; i += 1) {
      const other = this.candidates[i];
      if (other.id < 0) continue;
      const dx = other.x - x;
      const dz = other.z - z;
      if (Math.abs(dx) < other.hx + radius && Math.abs(dz) < other.hz + radius) return true;
    }
    return false;
  }

  private spawnCopCar(x: number, z: number, heading: number, mode: CopMode): void {
    const vehicle = createVehicle(this.fleet, this.registry, {
      type: 'police',
      x,
      z,
      heading,
      colorIndex: 0,
    });
    const edge = this.graph.nearestEdge(x, z);
    const cop: CopCar = {
      vehicle,
      mode,
      edge: edge < 0 ? 0 : edge,
      t: 0,
      life: 0,
      pitTimer: 0,
      stuck: 0,
      fireTimer: 0.8 + this.rng() * 0.8,
      input: { throttle: 0, brake: 0, steer: 0, handbrake: false },
    };
    this.copIndex.set(vehicle.id, this.cops.length);
    this.cops.push(cop);
    this.stats.spawned += 1;
  }

  private driveCop(
    cop: CopCar,
    dt: number,
    player: PlayerSnapshot,
    distance: number,
  ): void {
    const vehicle = cop.vehicle;
    const transform = vehicle.transform;
    const dx = player.x - transform.x;
    const dz = player.z - transform.z;

    // Блокпост стоит, пока игрок далеко; ближе 25 м — бросается в погоню.
    if (cop.mode === 'block') {
      if (distance > 26) {
        cop.input.throttle = 0;
        cop.input.brake = 1;
        cop.input.steer = 0;
        cop.input.handbrake = false;
        this.physics.step(vehicle, cop.input, dt);
        return;
      }
      cop.mode = 'chase';
    }

    const edges = this.graph.edges;
    let edge = edges[cop.edge];
    if (!edge) {
      const near = this.graph.nearestEdge(transform.x, transform.z);
      cop.edge = near < 0 ? 0 : near;
      edge = edges[cop.edge];
      if (!edge) return;
    }
    const fromNode = this.graph.nodes[edge.from];
    const inv = edge.length > 1e-6 ? 1 / edge.length : 0;
    const dirX = (this.graph.nodes[edge.to].x - fromNode.x) * inv;
    const dirZ = (this.graph.nodes[edge.to].z - fromNode.z) * inv;
    const along = (transform.x - fromNode.x) * dirX + (transform.z - fromNode.z) * dirZ;
    cop.t = clamp(along * inv, 0, 1);

    // Дошли до узла — выбираем ребро, ведущее к игроку.
    if (along > edge.length - 4) {
      this.chooseEdgeTowards(cop, player);
      edge = edges[cop.edge] ?? edge;
    }

    const headingToPlayer = Math.atan2(dx, dz);
    const angleError = Math.abs(normalizeAngle(headingToPlayer - transform.heading));
    const direct = distance < 30 && (angleError < 0.75 || distance < 12);

    let targetX: number;
    let targetZ: number;
    let targetSpeed: number;

    if (direct) {
      const playerVehicle = player.vehicle;
      const pit =
        playerVehicle !== null &&
        this.levelValue >= WANTED.aggressiveLevel &&
        distance < WANTED.pitRange &&
        distance > 2.5;

      if (pit) {
        // PIT: целимся в заднюю четверть машины игрока со своей стороны.
        const pv = playerVehicle.transform;
        const psin = Math.sin(pv.heading);
        const pcos = Math.cos(pv.heading);
        const relX = transform.x - pv.x;
        const relZ = transform.z - pv.z;
        const side = relX * pcos - relZ * psin >= 0 ? 1 : -1;
        const rear = playerVehicle.config.length * 0.5 + 0.8;
        targetX = pv.x - psin * rear + pcos * side * 1.4;
        targetZ = pv.z - pcos * rear - psin * side * 1.4;
        targetSpeed = vehicle.config.maxSpeed;
        cop.pitTimer += dt;
      } else {
        // Таран: идём прямо в игрока (или в его машину).
        targetX = player.x;
        targetZ = player.z;
        targetSpeed = distance < WANTED.ramRange ? vehicle.config.maxSpeed : vehicle.config.maxSpeed * 0.9;
      }
    } else {
      const lookT = clamp(cop.t + 16 * inv, 0, 1);
      const point = this.graph.lanePoint(cop.edge, lookT, 0, this.laneScratch);
      targetX = point.x;
      targetZ = point.z;
      targetSpeed = Math.min(edge.speed * 1.08, vehicle.config.maxSpeed);
      // Скорость гасим заранее, чтобы вписаться в поворот.
      if (angleError > 0.9) targetSpeed *= 0.55;
    }

    driveTowards(
      cop.input,
      transform.x,
      transform.z,
      transform.heading,
      transform.vx,
      transform.vz,
      targetX,
      targetZ,
      targetSpeed * (this.levelValue >= WANTED.aggressiveLevel ? WANTED.chaseSpeedFactor : 1),
    );

    // Застряли на месте — небольшой газ вперёд и назад, чтобы выехать.
    const speed = Math.hypot(transform.vx, transform.vz);
    if (speed < 0.5) cop.stuck += dt;
    else cop.stuck = 0;
    if (cop.stuck > 2.5) {
      cop.input.throttle = 0;
      cop.input.brake = 1;
      if (cop.stuck > 3.5) {
        cop.stuck = 0;
        cop.edge = this.graph.nearestEdge(transform.x, transform.z);
      }
    }

    this.physics.step(vehicle, cop.input, dt);
  }

  /** Жадный выбор ребра на узле: минимум расстояния «to» до игрока. */
  private chooseEdgeTowards(cop: CopCar, player: PlayerSnapshot): void {
    const edges = this.graph.edges;
    const current = edges[cop.edge];
    if (!current) return;
    const node = this.graph.nodes[current.to];
    let best = -1;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < edges.length; i += 1) {
      const candidate = edges[i];
      if (candidate.from !== node.id) continue;
      if (candidate.to === current.from && edges.length > 1) continue;
      const target = this.graph.nodes[candidate.to];
      const dx = target.x - player.x;
      const dz = target.z - player.z;
      const distance = dx * dx + dz * dz;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    }
    if (best >= 0) {
      cop.edge = best;
      cop.t = 0;
    } else {
      // Тупик: разворачиваемся.
      for (let i = 0; i < edges.length; i += 1) {
        if (edges[i].from === current.to) {
          cop.edge = i;
          cop.t = 0;
          return;
        }
      }
    }
  }

  /** Удар копом/копов по машине игрока поднимает розыск и наносит урон. */
  private checkCopImpact(cop: CopCar, player: PlayerSnapshot): void {
    const playerVehicle = player.vehicle;
    if (!playerVehicle) return;
    if (cop.vehicle.lastImpact < 3) return;
    const dx = cop.vehicle.transform.x - player.x;
    const dz = cop.vehicle.transform.z - player.z;
    const distanceSq = dx * dx + dz * dz;
    if (distanceSq > 25) return;
    // Только если это игрок въехал в копа, а не коп протаранил игрока:
    // иначе погоня сама накручивает heat до максимума.
    const distance = Math.sqrt(distanceSq) || 1;
    const pvx = playerVehicle.transform.vx;
    const pvz = playerVehicle.transform.vz;
    const approach = (pvx * dx + pvz * dz) / distance;
    if (approach < 6) return;
    this.addCrime('ramCop', player.x, player.z);
    damageVehicle(playerVehicle, 4);
    cop.vehicle.lastImpact = 0;
  }

  // --- пешие копы -----------------------------------------------------------

  private countFootCops(): number {
    let count = 0;
    const list = this.pool.list;
    for (let i = 0; i < list.length; i += 1) if (list[i].kind === 'cop') count += 1;
    return count;
  }

  private updateFootCops(dt: number, player: PlayerSnapshot): void {
    const desired = this.levelValue > 0 ? WANTED.footPerLevel[this.levelValue] : 0;
    this.footTimer += dt;

    if (this.footTimer >= 1 && this.countFootCops() < desired) {
      this.footTimer = 0;
      this.spawnFootCop(player);
    }

    // Идём с конца: удаление текущего элемента не ломает индексы.
    for (let i = this.pool.list.length - 1; i >= 0; i -= 1) {
      if (i >= this.pool.list.length) continue;
      const cop = this.pool.list[i];
      if (cop.kind !== 'cop') continue;
      if (!this.stepFootCop(cop, dt, player)) {
        this.pool.remove(cop.id);
        this.registry.destroy(cop.id);
        this.stats.despawned += 1;
      }
    }
  }

  /** Шаг пешего копа. false — коп уходит из мира. */
  private stepFootCop(cop: NpcState, dt: number, player: PlayerSnapshot): boolean {
    const transform = cop.transform;
    transform.prevX = transform.x;
    transform.prevZ = transform.z;
    transform.prevHeading = transform.heading;

    if (cop.state === 'down') {
      cop.downTimer -= dt;
      if (cop.downTimer <= 0) {
        cop.hp = 1;
        cop.state = 'chase';
        cop.downTimer = 0;
      }
      return true;
    }

    const dx = player.x - transform.x;
    const dz = player.z - transform.z;
    const distance = Math.hypot(dx, dz);
    cop.lifeTimer += dt;

    // Пеший коп не должен отставать на другом конце карты: подтягиваем
    // на 26–36 м, когда игрок его не видит.
    if (distance > 60 && cop.lifeTimer > 2 && this.levelValue > 0) {
      const angle = this.rng() * Math.PI * 2;
      const ring = 26 + this.rng() * 10;
      const nx = player.x + Math.sin(angle) * ring;
      const nz = player.z + Math.cos(angle) * ring;
      if (!this.isBlocked(nx, nz, 0.6)) {
        transform.x = nx;
        transform.z = nz;
        transform.prevX = nx;
        transform.prevZ = nz;
        transform.heading = Math.atan2(player.x - nx, player.z - nz);
        transform.prevHeading = transform.heading;
        cop.lifeTimer = 0;
      }
    }

    // Коп потерял игрока и розыск упал — уходит.
    if (this.levelValue === 0 || (distance > 120 && cop.lifeTimer > WANTED.footLifetime)) {
      return false;
    }

    cop.attackTimer -= dt;
    const aiming = distance < WANTED.copFireRange;
    cop.aiming = aiming;
    cop.state = aiming ? 'aim' : 'chase';

    // Движение: к игроку, но не вплотную (иначе он стоит в кузове).
    let speed = 0;
    if (!aiming || distance > 16) {
      speed = PEDS.copSpeed;
    }
    if (speed > 0) {
      const desired = Math.atan2(dx, dz);
      const turn = normalizeAngle(desired - transform.heading);
      transform.heading += clamp(turn, -PEDS.turnRate * dt, PEDS.turnRate * dt);
      const stepX = Math.sin(transform.heading) * speed * dt;
      const stepZ = Math.cos(transform.heading) * speed * dt;
      transform.x += stepX;
      transform.z += stepZ;
      // Стены: мягко выталкиваем, коп не проходит сквозь дом.
      this.hash.queryCircle(transform.x, transform.z, 0.6, this.candidates);
      for (let i = 0; i < this.candidates.length; i += 1) {
        const other = this.candidates[i];
        if (other.id < 0) continue;
        if (
          Math.abs(transform.x - other.x) > other.hx + 0.5 ||
          Math.abs(transform.z - other.z) > other.hz + 0.5
        ) {
          continue;
        }
        const pushX = transform.x - other.x;
        const pushZ = transform.z - other.z;
        const length = Math.hypot(pushX, pushZ) || 1;
        transform.x += (pushX / length) * 0.6;
        transform.z += (pushZ / length) * 0.6;
      }
      cop.phase += speed * dt * 1.5;
      if (cop.phase > 1) cop.phase -= Math.floor(cop.phase);
    }

    // Стрельба: только при видимой цели и с интервалом из конфига.
    if (aiming && cop.attackTimer <= 0) {
      cop.attackTimer = WANTED.copFireInterval;
      this.combat.fireAt(
        transform.x,
        transform.z,
        player.x,
        player.z,
        WANTED.copWeapon,
        WANTED.copAccuracy,
        WANTED.copDamageScale,
        { x: player.x, z: player.z, radius: 0.5 },
      );
      this.stats.copShots += 1;
      const hitChance = WANTED.copAccuracy * clamp(1 - distance / 120, 0.25, 1);
      if (this.rng() < hitChance) {
        this.stats.copHits += 1;
        const damage = WEAPONS[WANTED.copWeapon].damage;
        // В машине попадание идёт в кузов: игрока выручает броня, а не HP.
        if (player.vehicle) damageVehicle(player.vehicle, damage);
        else this.applyPlayerDamage(damage);
      }
    }
    return true;
  }

  /** Пеший коп появляется на тротуаре рядом, но за спиной/в стороне. */
  private spawnFootCop(player: PlayerSnapshot): boolean {
    const node = this.graph.nodes[Math.floor(this.rng() * this.graph.nodes.length) % this.graph.nodes.length];
    const angle = this.rng() * Math.PI * 2;
    const distance = WANTED.footSpawnMinDistance + this.rng() * (WANTED.footSpawnMaxDistance - WANTED.footSpawnMinDistance);
    const baseX = player.x + Math.sin(angle) * distance;
    const baseZ = player.z + Math.cos(angle) * distance;
    // Привязываем к ближайшему узлу, чтобы коп не стоял в здании.
    const nodeX = node.x + (baseX - node.x) * 0.15;
    const nodeZ = node.z + (baseZ - node.z) * 0.15;
    const x = baseX * 0.7 + nodeX * 0.3;
    const z = baseZ * 0.7 + nodeZ * 0.3;
    if (this.isBlocked(x, z, 0.6)) return false;
    const state = createNpc(this.pool, this.registry, {
      kind: 'cop',
      x,
      z,
      heading: Math.atan2(player.x - x, player.z - z),
      variant: 0,
    });
    if (!state) return false;
    state.state = 'chase';
    state.baseSpeed = PEDS.copSpeed;
    state.hp = 2;
    state.attackTimer = 0.6 + this.rng() * 0.8;
    this.stats.spawned += 1;
    return true;
  }

  // --- арест и урон ---------------------------------------------------------

  private updateArrest(player: PlayerSnapshot): void {
    if (!player.onFoot || this.levelValue === 0 || this.caught) return;
    const speed = Math.hypot(player.vx, player.vz);
    if (speed > WANTED.arrestSpeed) return;
    const list = this.pool.list;
    const radiusSq = WANTED.arrestRadius * WANTED.arrestRadius;
    for (let i = 0; i < list.length; i += 1) {
      const cop = list[i];
      if (cop.kind !== 'cop' || cop.state === 'down') continue;
      const dx = cop.transform.x - player.x;
      const dz = cop.transform.z - player.z;
      if (dx * dx + dz * dz > radiusSq) continue;
      this.arrest('arrest', player.x, player.z);
      return;
    }
  }

  private arrest(reason: 'arrest' | 'down', x: number, z: number): void {
    if (this.caught) return;
    this.caught = true;
    this.stats.arrests += 1;
    if (this.onPlayerCaught) this.onPlayerCaught(reason, x, z);
  }

  private applyPlayerDamage(amount: number): void {
    if (this.caught || amount <= 0) return;
    this.healthValue = Math.max(0, this.healthValue - amount);
    this.damageTimer = 0;
    this.stats.health = this.healthValue;
    if (this.healthValue <= 0) {
      this.arrest('down', this.lastPlayerX, this.lastPlayerZ);
    }
  }

  private removeCopAt(index: number, destroy: boolean): void {
    const cop = this.cops[index];
    this.copIndex.delete(cop.vehicle.id);
    if (destroy) destroyVehicle(this.fleet, this.registry, cop.vehicle);
    this.cops.splice(index, 1);
    for (let i = index; i < this.cops.length; i += 1) this.copIndex.set(this.cops[i].vehicle.id, i);
    this.stats.despawned += 1;
  }

  /** Сколько тиков прошло: диагностика для смоук-теста. */
  get ticks(): number {
    return this.tick;
  }
}
