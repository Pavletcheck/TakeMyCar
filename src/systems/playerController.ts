// ---------------------------------------------------------------------------
// M4. Игрок пешком и посадка в машину.
//
// Пешком — 8-направленное движение по WASD/стрелкам с коллизиями через
// moveCircle. Вход (E) — ближайшая живая машина в радиусе 3 м от корпуса.
// Выход — телепорт на свободное место у борта: перебираем левый/правый борт,
// корму и углы, проверяя SpatialHash, поэтому игрок не появляется в стене.
//
// Камера и HUD живут выше (app/bootstrap): контроллер только меняет режим.
// ---------------------------------------------------------------------------

import { moveCircle, resetSolveResult } from '../core/collision';
import type { CircleBody, SolveResult } from '../core/collision';
import type { InputState } from '../core/input';
import { circleRect, clamp } from '../core/math';
import type { Collider, Contact } from '../core/math';
import type { EntityId, Transform2D } from '../core/registry';
import type { SpatialHash } from '../core/spatialHash';
import type { TuningConfig } from '../config/tuning';
import { EXIT_DIRECTIONS, PLAYER } from '../config/player';
import { findNearestEnterable } from '../entities/vehicle';
import type { VehicleFleet, VehicleState } from '../entities/vehicle';
import type { WorldBounds } from './vehiclePhysics';

export type PlayerMode = 'foot' | 'driving';

export class PlayerController {
  readonly playerId: EntityId;
  readonly transform: Transform2D;
  mode: PlayerMode = 'foot';
  /** Машина, в которой сидит игрок (null — пешком). */
  vehicle: VehicleState | null = null;
  /** Ближайшая машина для подсказки HUD (обновляется на пешем шаге). */
  nearest: VehicleState | null = null;

  private readonly fleet: VehicleFleet;
  private readonly hash: SpatialHash<Collider>;
  private readonly tuning: TuningConfig;
  private readonly bounds: WorldBounds | null;

  private readonly body: CircleBody = { x: 0, z: 0, vx: 0, vz: 0, radius: PLAYER.radius };
  private readonly solve: SolveResult = { hit: false, contacts: 0, impact: 0, substeps: 0 };
  private readonly contact: Contact = { nx: 0, nz: 0, depth: 0 };
  private readonly candidates: Collider[] = [];

  constructor(
    fleet: VehicleFleet,
    hash: SpatialHash<Collider>,
    tuning: TuningConfig,
    bounds: WorldBounds | null,
    playerId: EntityId,
    transform: Transform2D,
  ) {
    this.fleet = fleet;
    this.hash = hash;
    this.tuning = tuning;
    this.bounds = bounds;
    this.playerId = playerId;
    this.transform = transform;
  }

  /** Старт за рулём (игрок появляется в машине, как в M3). */
  startInVehicle(vehicle: VehicleState): void {
    this.mode = 'driving';
    this.vehicle = vehicle;
    this.nearest = null;
    vehicle.driver = this.playerId;
    this.syncInsideVehicle();
  }

  /** Пеший фиксированный шаг: 8 направлений, разгон, коллизии. */
  stepFoot(dt: number, input: InputState): void {
    if (this.mode !== 'foot') return;
    const transform = this.transform;
    transform.prevX = transform.x;
    transform.prevZ = transform.z;
    transform.prevHeading = transform.heading;

    // A/влево — минус X, W/вверх — минус Z (камера смотрит с +Z).
    const moveX = -input.steer;
    const moveZ = -(input.throttle - input.brake);
    const length = Math.hypot(moveX, moveZ);

    let targetVx = 0;
    let targetVz = 0;
    if (length > 1e-4) {
      const scale = PLAYER.moveSpeed / length;
      targetVx = moveX * scale;
      targetVz = moveZ * scale;
    }

    const k = 1 - Math.exp(-PLAYER.accel * dt);
    transform.vx += (targetVx - transform.vx) * k;
    transform.vz += (targetVz - transform.vz) * k;
    if (Math.abs(transform.vx) < 0.01) transform.vx = 0;
    if (Math.abs(transform.vz) < 0.01) transform.vz = 0;

    if (length > 1e-4) transform.heading = Math.atan2(targetVx, targetVz);

    const body = this.body;
    body.x = transform.x;
    body.z = transform.z;
    body.vx = transform.vx;
    body.vz = transform.vz;
    body.radius = PLAYER.radius;

    resetSolveResult(this.solve);
    moveCircle(body, dt, this.hash, this.candidates, this.contact, this.tuning, this.solve);

    if (this.bounds) {
      const margin = PLAYER.radius + PLAYER.boundsMargin;
      body.x = clamp(body.x, this.bounds.minX + margin, this.bounds.maxX - margin);
      body.z = clamp(body.z, this.bounds.minZ + margin, this.bounds.maxZ - margin);
    }

    transform.x = body.x;
    transform.z = body.z;
    transform.vx = body.vx;
    transform.vz = body.vz;

    this.nearest = findNearestEnterable(this.fleet, transform.x, transform.z, PLAYER.enterRadius);
  }

  /** Синхронизировать позицию игрока с машиной, пока он за рулём. */
  syncInsideVehicle(): void {
    const vehicle = this.vehicle;
    if (this.mode !== 'driving' || !vehicle) return;
    const source = vehicle.transform;
    const transform = this.transform;
    transform.x = source.x;
    transform.z = source.z;
    transform.heading = source.heading;
    transform.vx = source.vx;
    transform.vz = source.vz;
    transform.prevX = source.prevX;
    transform.prevZ = source.prevZ;
    transform.prevHeading = source.prevHeading;
  }

  /** Посадить игрока в ближайшую подходящую машину. */
  enterNearest(): boolean {
    if (this.mode !== 'foot') return false;
    const target = findNearestEnterable(
      this.fleet,
      this.transform.x,
      this.transform.z,
      PLAYER.enterRadius,
    );
    if (!target) return false;

    this.mode = 'driving';
    this.vehicle = target;
    this.nearest = null;
    target.driver = this.playerId;
    target.forward = 0;
    target.lateral = 0;
    this.transform.vx = 0;
    this.transform.vz = 0;
    this.syncInsideVehicle();
    return true;
  }

  /** Выйти на свободное место у борта. false — места нет, остаёмся внутри. */
  exitVehicle(): boolean {
    const vehicle = this.vehicle;
    if (this.mode !== 'driving' || !vehicle) return false;

    const source = vehicle.transform;
    const cos = Math.cos(source.heading);
    const sin = Math.sin(source.heading);
    const halfWidth = vehicle.config.width / 2;
    const halfLength = vehicle.config.length / 2;

    for (let i = 0; i < EXIT_DIRECTIONS.length; i += 1) {
      const dir = EXIT_DIRECTIONS[i];
      // Локальные оси: X — вправо, Z — вперёд.
      const localX = dir[0] * (halfWidth + PLAYER.exitGap);
      const localZ = dir[1] * (halfLength + PLAYER.exitGap);
      const x = source.x + cos * localX + sin * localZ;
      const z = source.z - sin * localX + cos * localZ;
      if (!this.isFootSpotFree(x, z)) continue;

      const transform = this.transform;
      transform.x = x;
      transform.z = z;
      transform.heading = source.heading;
      // Инерцию отдаём частично: выпрыгнуть на ходу можно, но не «телепортом».
      transform.vx = source.vx * 0.4;
      transform.vz = source.vz * 0.4;
      transform.prevX = x;
      transform.prevZ = z;
      transform.prevHeading = transform.heading;

      vehicle.driver = -1;
      vehicle.steer = 0;
      this.vehicle = null;
      this.mode = 'foot';
      this.nearest = findNearestEnterable(this.fleet, x, z, PLAYER.enterRadius);
      return true;
    }

    return false;
  }

  /** E: сесть/выйти. Возвращает true, если режим сменился. */
  toggleVehicle(): boolean {
    return this.mode === 'driving' ? this.exitVehicle() : this.enterNearest();
  }

  /** Телепорт пешком (R на дорогу, отладочный API). */
  teleport(x: number, z: number): void {
    const transform = this.transform;
    transform.x = x;
    transform.z = z;
    transform.vx = 0;
    transform.vz = 0;
    transform.prevX = x;
    transform.prevZ = z;
    transform.prevHeading = transform.heading;
    this.nearest = findNearestEnterable(this.fleet, x, z, PLAYER.enterRadius);
  }

  /** Свободно ли место под капсулу игрока: границы мира + SpatialHash. */
  private isFootSpotFree(x: number, z: number): boolean {
    if (this.bounds) {
      const margin = PLAYER.radius + PLAYER.boundsMargin;
      if (
        x < this.bounds.minX + margin ||
        x > this.bounds.maxX - margin ||
        z < this.bounds.minZ + margin ||
        z > this.bounds.maxZ - margin
      ) {
        return false;
      }
    }

    this.hash.queryCircle(x, z, PLAYER.radius + this.tuning.collisionSkin, this.candidates);
    for (let i = 0; i < this.candidates.length; i += 1) {
      if (circleRect(x, z, PLAYER.radius, this.candidates[i], this.contact)) return false;
    }
    return true;
  }
}
