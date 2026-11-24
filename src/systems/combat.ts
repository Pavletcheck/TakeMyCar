// ---------------------------------------------------------------------------
// M5. Стилизованное оружие: хитскан, трассер, магазин и перезарядка.
//
// Никакой баллистики и снарядов: выстрел — луч с разбросом, попадание
// ищется по коллайдерам SpatialHash (машины/мир) и по капсулам NPC.
// Луч не проходит сквозь стену: ближайшее попадание останавливает пулю.
//
// Контент 12+: только искры, дым и падение. Крови, отлетающих частей и
// стонов нет. Урон машинам идёт через damageVehicle, NPC — через damageNpc.
//
// Система ничего не знает про Three и DOM: эффекты отдаются колбэками
// (onShot/onImpact), их рисует render/effectsView.
// ---------------------------------------------------------------------------

import type { Collider } from '../core/math';
import { clamp, normalizeAngle } from '../core/math';
import type { EntityId } from '../core/registry';
import type { SpatialHash } from '../core/spatialHash';
import { mulberry32 } from '../core/rng';
import type { RandomSource } from '../core/rng';
import { isWeaponId, WEAPON_ORDER, WEAPONS } from '../config/life';
import type { CrimeKind, WeaponId } from '../config/life';
import { damageNpc, NpcPool } from '../entities/npc';
import type { NpcState } from '../entities/npc';
import { damageVehicle } from '../entities/vehicle';
import type { VehicleFleet } from '../entities/vehicle';

/** Что остановило пулю. */
export type HitKind = 'none' | 'vehicle' | 'npc' | 'world';

export interface ShotOutcome {
  hit: HitKind;
  /** Точка попадания (или конец луча), мировые координаты. */
  x: number;
  z: number;
  distance: number;
  /** Попала ли пуля в переданную цель (игрок для копов). */
  targetHit: boolean;
}

export interface ShotTarget {
  readonly x: number;
  readonly z: number;
  readonly radius: number;
}

export interface CombatOptions {
  readonly hash: SpatialHash<Collider>;
  readonly fleet: VehicleFleet;
  /** Пулы NPC: пешеходы и пешие копы — обе цели доступны выстрелу. */
  readonly pools: readonly NpcPool[];
  /** Игрок: его выстрелы поднимают розыск, чужие — нет. */
  readonly playerId: EntityId;
  readonly seed?: number;
}

export interface WeaponAmmo {
  mag: number;
  reserve: number;
}

const WEAPON_COUNT = WEAPON_ORDER.length;

/**
 * Пересечение луча с повёрнутым прямоугольником (slab в локальных осях).
 * Возвращает расстояние до входа или -1. Без аллокаций.
 */
export function rayRect(
  ox: number,
  oz: number,
  dx: number,
  dz: number,
  rect: { x: number; z: number; hx: number; hz: number; angle?: number },
  maxDistance: number,
): number {
  const angle = rect.angle ?? 0;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const relX = ox - rect.x;
  const relZ = oz - rect.z;
  // В локальные оси прямоугольника (та же конвенция, что в circleRect).
  const lox = relX * cos - relZ * sin;
  const loz = relX * sin + relZ * cos;
  const ldx = dx * cos - dz * sin;
  const ldz = dx * sin + dz * cos;

  let tMin = 0;
  let tMax = maxDistance;

  if (Math.abs(ldx) < 1e-8) {
    if (Math.abs(lox) > rect.hx) return -1;
  } else {
    const inv = 1 / ldx;
    let t1 = (-rect.hx - lox) * inv;
    let t2 = (rect.hx - lox) * inv;
    if (t1 > t2) {
      const swap = t1;
      t1 = t2;
      t2 = swap;
    }
    if (t1 > tMin) tMin = t1;
    if (t2 < tMax) tMax = t2;
    if (tMin > tMax) return -1;
  }

  if (Math.abs(ldz) < 1e-8) {
    if (Math.abs(loz) > rect.hz) return -1;
  } else {
    const inv = 1 / ldz;
    let t1 = (-rect.hz - loz) * inv;
    let t2 = (rect.hz - loz) * inv;
    if (t1 > t2) {
      const swap = t1;
      t1 = t2;
      t2 = swap;
    }
    if (t1 > tMin) tMin = t1;
    if (t2 < tMax) tMax = t2;
    if (tMin > tMax) return -1;
  }

  return tMin;
}

/** Пересечение луча с капсулой-кругом в плоскости. -1 — мимо. */
export function rayCircle(
  ox: number,
  oz: number,
  dx: number,
  dz: number,
  cx: number,
  cz: number,
  radius: number,
  maxDistance: number,
): number {
  const relX = cx - ox;
  const relZ = cz - oz;
  const projection = relX * dx + relZ * dz;
  if (projection < 0 || projection > maxDistance) return -1;
  const perpendicular = Math.abs(relX * dz - relZ * dx);
  if (perpendicular > radius) return -1;
  const offset = Math.sqrt(Math.max(0, radius * radius - perpendicular * perpendicular));
  return Math.max(0, projection - offset);
}

export class CombatSystem {
  weapon: WeaponId = 'pistol';
  /** Доля отдачи для тряски камеры, забирается bootstrap каждый тик. */
  recoil = 0;

  private readonly hash: SpatialHash<Collider>;
  private readonly fleet: VehicleFleet;
  private readonly pools: readonly NpcPool[];
  private readonly playerId: EntityId;
  private readonly rng: RandomSource;
  private readonly candidates: Collider[] = [];

  private readonly mags = new Int32Array(WEAPON_COUNT);
  private readonly reserves = new Int32Array(WEAPON_COUNT);
  private cooldown = 0;
  private reloadTimer = 0;
  private reloading = false;
  /** Дополнительный разброс после серии выстрелов, радианы. */
  private heat = 0;

  /**
   * Эффекты и последствия — колбэки, чтобы systems не знали про render/HUD.
   * onShot: трассер от дула до точки; onImpact: искры/пыль.
   */
  onShot: ((x1: number, z1: number, x2: number, z2: number, hit: HitKind) => void) | null = null;
  onImpact: ((x: number, z: number, hit: HitKind) => void) | null = null;
  /** Игрок совершил преступление: выстрел/попадание. */
  onCrime: ((kind: CrimeKind, x: number, z: number) => void) | null = null;
  /** Выстрел услышали пешеходы (паника/тревога). */
  onGunshot: ((x: number, z: number) => void) | null = null;

  constructor(options: CombatOptions) {
    this.hash = options.hash;
    this.fleet = options.fleet;
    this.pools = options.pools;
    this.playerId = options.playerId;
    this.rng = mulberry32(options.seed ?? 0xc0ffee);
    for (let i = 0; i < WEAPON_COUNT; i += 1) {
      const spec = WEAPONS[WEAPON_ORDER[i]];
      this.mags[i] = spec.mag;
      this.reserves[i] = spec.reserve;
    }
  }

  get weaponSpec() {
    return WEAPONS[this.weapon];
  }

  get magAmmo(): number {
    return this.mags[this.weaponIndex(this.weapon)];
  }

  get reserveAmmo(): number {
    return this.reserves[this.weaponIndex(this.weapon)];
  }

  get isReloading(): boolean {
    return this.reloading;
  }

  /** Сменить оружие; перезарядка прерывается (как в аркадах). */
  selectWeapon(id: WeaponId | string): boolean {
    if (!isWeaponId(id) || id === this.weapon) return false;
    this.weapon = id;
    this.reloading = false;
    this.reloadTimer = 0;
    this.cooldown = 0;
    return true;
  }

  /** Начать перезарядку. Возвращает false, если нечего/незачем. */
  reload(): boolean {
    const index = this.weaponIndex(this.weapon);
    const spec = WEAPONS[this.weapon];
    if (this.reloading || this.mags[index] >= spec.mag || this.reserves[index] <= 0) return false;
    this.reloading = true;
    this.reloadTimer = spec.reload;
    return true;
  }

  update(dt: number): void {
    if (this.cooldown > 0) this.cooldown = Math.max(0, this.cooldown - dt);
    if (this.recoil > 0) this.recoil = Math.max(0, this.recoil - dt * 3);
    if (this.heat > 0) this.heat = Math.max(0, this.heat - dt * 0.12);
    if (!this.reloading) return;
    this.reloadTimer -= dt;
    if (this.reloadTimer > 0) return;
    this.reloading = false;
    const index = this.weaponIndex(this.weapon);
    const spec = WEAPONS[this.weapon];
    const need = spec.mag - this.mags[index];
    const take = Math.min(need, this.reserves[index]);
    this.mags[index] += take;
    this.reserves[index] -= take;
  }

  /** Пополнить боезапас (отладка, награда миссии в M6). */
  refill(): void {
    for (let i = 0; i < WEAPON_COUNT; i += 1) {
      const spec = WEAPONS[WEAPON_ORDER[i]];
      this.mags[i] = spec.mag;
      this.reserves[i] = spec.reserve;
    }
  }

  /**
   * Выстрел игрока из точки (x, z) в направлении (dirX, dirZ) — единичный
   * вектор. `ignoreEntityId` — своя машина, чтобы не стрелять в собственный
   * кузов. Возвращает true, если выстрел состоялся.
   */
  tryFire(x: number, z: number, dirX: number, dirZ: number, ignoreEntityId = -1): boolean {
    const index = this.weaponIndex(this.weapon);
    const spec = WEAPONS[this.weapon];
    if (this.reloading || this.cooldown > 0) return false;
    if (this.mags[index] <= 0) {
      this.reload();
      return false;
    }

    this.mags[index] -= 1;
    this.cooldown = 1 / spec.rate;
    this.heat = Math.min(0.12, this.heat + spec.spread * 0.5);
    this.recoil = Math.min(1, this.recoil + spec.recoil);

    const baseAngle = Math.atan2(dirX, dirZ);
    const spread = spec.spread + this.heat;
    for (let pellet = 0; pellet < spec.pellets; pellet += 1) {
      const angle = baseAngle + (this.rng() * 2 - 1) * spread;
      const result = this.shoot(
        x,
        z,
        Math.sin(angle),
        Math.cos(angle),
        spec.range,
        spec.damage,
        true,
        null,
        ignoreEntityId,
      );
      if (this.onShot) this.onShot(x, z, result.x, result.z, result.hit);
    }

    // Один выстрел = одно преступление, независимо от числа дробин.
    if (this.onCrime) this.onCrime('shot', x, z);
    if (this.onGunshot) this.onGunshot(x, z);
    return true;
  }

  /**
   * Выстрел копа или NPC по цели. Точность 0..1 управляет разбросом.
   * `target` — капсула игрока: попадание по ней возвращается в outcome.
   */
  fireAt(
    x: number,
    z: number,
    targetX: number,
    targetZ: number,
    weaponId: WeaponId,
    accuracy: number,
    damageScale: number,
    target: ShotTarget | null,
    ignoreEntityId = -1,
  ): ShotOutcome {
    const spec = WEAPONS[weaponId];
    const baseAngle = Math.atan2(targetX - x, targetZ - z);
    // Чем ниже точность, тем шире вилка: промах уходит в сторону.
    const miss = (1 - clamp(accuracy, 0, 1)) * 0.22;
    const angle = baseAngle + (this.rng() * 2 - 1) * miss;
    const outcome = this.shoot(
      x,
      z,
      Math.sin(angle),
      Math.cos(angle),
      spec.range,
      spec.damage * damageScale,
      false,
      target,
      ignoreEntityId,
    );
    if (this.onShot) this.onShot(x, z, outcome.x, outcome.z, outcome.hit);
    return outcome;
  }

  /** Хитскан без побочных эффектов (отладка/тесты). */
  probe(x: number, z: number, dirX: number, dirZ: number, range: number, damage: number): ShotOutcome {
    return this.shoot(x, z, dirX, dirZ, range, damage, false, null);
  }

  // --- внутреннее ----------------------------------------------------------

  private weaponIndex(id: WeaponId): number {
    for (let i = 0; i < WEAPON_COUNT; i += 1) if (WEAPON_ORDER[i] === id) return i;
    return 0;
  }

  /**
   * Один луч: ближайшее попадание среди мира/машин и NPC. Стена останавливает
   * пулю, но не даёт урона. `byPlayer` — урон от игрока поднимает розыск.
   */
  private shoot(
    x: number,
    z: number,
    dirX: number,
    dirZ: number,
    range: number,
    damage: number,
    byPlayer: boolean,
    target: ShotTarget | null,
    ignoreEntityId = -1,
  ): ShotOutcome {
    const outcome: ShotOutcome = { hit: 'none', x: x + dirX * range, z: z + dirZ * range, distance: range, targetHit: false };

    // Широкая фаза: прямоугольник, накрывающий луч.
    const midX = x + dirX * range * 0.5;
    const midZ = z + dirZ * range * 0.5;
    const hx = Math.abs(dirX) * range * 0.5 + 0.5;
    const hz = Math.abs(dirZ) * range * 0.5 + 0.5;
    this.hash.queryRect(midX, midZ, hx, hz, this.candidates);

    let bestDistance = range;
    let bestCollider: Collider | null = null;
    for (let i = 0; i < this.candidates.length; i += 1) {
      const collider = this.candidates[i];
      // Свой кузов не должен ловить выстрел из-под себя.
      if (ignoreEntityId >= 0 && collider.id === -ignoreEntityId - 1) continue;
      const distance = rayRect(x, z, dirX, dirZ, collider, bestDistance);
      if (distance < 0 || distance >= bestDistance) continue;
      bestDistance = distance;
      bestCollider = collider;
    }

    // NPC не вставляются в хэш: проверяем капсулы пулов.
    let bestNpc: NpcState | null = null;
    for (let p = 0; p < this.pools.length; p += 1) {
      const list = this.pools[p].list;
      for (let i = 0; i < list.length; i += 1) {
        const npc = list[i];
        if (npc.state === 'down') continue;
        const distance = rayCircle(
          x,
          z,
          dirX,
          dirZ,
          npc.transform.x,
          npc.transform.z,
          0.45,
          bestDistance,
        );
        if (distance < 0 || distance >= bestDistance) continue;
        bestDistance = distance;
        bestNpc = npc;
        bestCollider = null;
      }
    }

    if (bestNpc) {
      outcome.hit = 'npc';
      outcome.distance = bestDistance;
      outcome.x = x + dirX * bestDistance;
      outcome.z = z + dirZ * bestDistance;
      const downed = damageNpc(bestNpc, damage);
      if (byPlayer && this.onCrime) {
        const kind: CrimeKind = bestNpc.kind === 'cop' ? 'copShot' : downed ? 'pedDown' : 'pedHit';
        this.onCrime(kind, bestNpc.transform.x, bestNpc.transform.z);
      }
      if (this.onImpact) this.onImpact(outcome.x, outcome.z, 'npc');
    } else if (bestCollider) {
      outcome.distance = bestDistance;
      outcome.x = x + dirX * bestDistance;
      outcome.z = z + dirZ * bestDistance;
      if (bestCollider.id < 0) {
        const entityId = -bestCollider.id - 1;
        const vehicle = this.fleet.get(entityId);
        outcome.hit = vehicle ? 'vehicle' : 'world';
        if (vehicle) {
          damageVehicle(vehicle, damage);
          if (byPlayer && this.onCrime) this.onCrime('vehicleShot', outcome.x, outcome.z);
        }
      } else {
        outcome.hit = 'world';
      }
      if (this.onImpact) this.onImpact(outcome.x, outcome.z, outcome.hit);
    }

    // Цель-игрок: попадание, если луч проходит через её капсулу раньше стены.
    if (target) {
      const distance = rayCircle(x, z, dirX, dirZ, target.x, target.z, target.radius, range);
      if (distance >= 0 && distance <= bestDistance + 0.05) {
        outcome.targetHit = true;
        outcome.distance = Math.min(outcome.distance, distance);
      }
    }

    return outcome;
  }

  /** Попадание в игрока от копов не поднимает розыск — только урон. */
  get shooterId(): EntityId {
    return this.playerId;
  }
}

/** Разброс отдачи для UI/камеры: угол в радианах по текущему нагреву. */
export function currentSpread(weapon: WeaponId, heat: number): number {
  return normalizeAngle(WEAPONS[weapon].spread + heat);
}
