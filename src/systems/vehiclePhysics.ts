// ---------------------------------------------------------------------------
// M4. Аркадная физика машин.
//
// Модель без коробки передач: газ/тормоз/руль/ручник/задний ход.
// Продольная и поперечная скорости считаются в осях машины, боковое трение
// гасит снос (ручник — почти не гасит, отсюда дрифт). Руль эффективен
// пропорционально скорости: на месте машина не крутится.
//
// Столкновения — через API ядра: moveCircle + SpatialHash (ADR 0003),
// с антитуннелированием по maxSweepStep. Свой коллайдер на время шага
// вынимается из хэша, иначе машина билась бы сама о себя.
//
// Горячий путь не аллоцирует: body/solve/contact/массивы переиспользуются.
// ---------------------------------------------------------------------------

import { moveCircle, resetSolveResult } from '../core/collision';
import type { CircleBody, SolveResult } from '../core/collision';
import { circleRect, clamp } from '../core/math';
import type { Collider, Contact } from '../core/math';
import type { EntityId, EntityRegistry } from '../core/registry';
import type { SpatialHash } from '../core/spatialHash';
import type { TuningConfig } from '../config/tuning';
import { VEHICLE_HANDLING, vehicleColliderRadius } from '../config/vehicles';
import { damageVehicle, vehicleDamageScale } from '../entities/vehicle';
import type { VehicleFleet, VehicleState } from '../entities/vehicle';

/** Управление машиной на один фиксированный шаг. */
export interface VehicleInput {
  throttle: number;
  brake: number;
  steer: number;
  handbrake: boolean;
}

/** Пустой ввод для припаркованных машин и ИИ (M5). */
export const IDLE_VEHICLE_INPUT: VehicleInput = Object.freeze({
  throttle: 0,
  brake: 0,
  steer: 0,
  handbrake: false,
});

/** Границы мира: только числа, без зависимости от world/**. */
export interface WorldBounds {
  readonly minX: number;
  readonly minZ: number;
  readonly maxX: number;
  readonly maxZ: number;
}

/** Хуки звука: реализация может быть no-op, WebAudio или платформенной. */
export interface VehicleAudioHooks {
  engineRpm(vehicleId: EntityId, rpm: number): void;
  skid(vehicleId: EntityId, slip: number): void;
  impact(vehicleId: EntityId, power: number): void;
  explosion(vehicleId: EntityId): void;
}

export const NOOP_VEHICLE_AUDIO: VehicleAudioHooks = {
  engineRpm: () => undefined,
  skid: () => undefined,
  impact: () => undefined,
  explosion: () => undefined,
};

export class VehiclePhysics {
  private readonly registry: EntityRegistry;
  private readonly fleet: VehicleFleet;
  private readonly hash: SpatialHash<Collider>;
  private readonly tuning: TuningConfig;
  private readonly audio: VehicleAudioHooks;
  private readonly bounds: WorldBounds | null;

  private readonly body: CircleBody = { x: 0, z: 0, vx: 0, vz: 0, radius: 1.8 };
  private readonly solve: SolveResult = { hit: false, contacts: 0, impact: 0, substeps: 0 };
  private readonly contact: Contact = { nx: 0, nz: 0, depth: 0 };
  private readonly candidates: Collider[] = [];
  private readonly neighbors: Collider[] = [];

  constructor(
    registry: EntityRegistry,
    fleet: VehicleFleet,
    hash: SpatialHash<Collider>,
    tuning: TuningConfig,
    bounds: WorldBounds | null = null,
    audio: VehicleAudioHooks = NOOP_VEHICLE_AUDIO,
  ) {
    this.registry = registry;
    this.fleet = fleet;
    this.hash = hash;
    this.tuning = tuning;
    this.bounds = bounds;
    this.audio = audio;
  }

  /**
   * Один фиксированный шаг машины. `isDriven` — за рулём игрок/ИИ:
   * только для неё дёргаем звук двигателя, чтобы не плодить 60 источников.
   */
  step(state: VehicleState, input: VehicleInput, dt: number): void {
    const transform = state.transform;
    transform.prevX = transform.x;
    transform.prevZ = transform.z;
    transform.prevHeading = transform.heading;

    const config = state.config;
    const wrecked = state.wrecked;
    // У уничтоженной машины управление не работает, но инерция гасится.
    const throttle = wrecked ? 0 : clamp(input.throttle, 0, 1);
    const brake = wrecked ? 0 : clamp(input.brake, 0, 1);
    const steer = wrecked ? 0 : clamp(input.steer, -1, 1);
    const handbrake = wrecked ? false : input.handbrake;

    const speedSq = transform.vx * transform.vx + transform.vz * transform.vz;
    // Стоящая машина без ввода не гоняет решатель: 60 припаркованных машин
    // почти бесплатны. Коллайдер уже в хэше и обновится при толчке.
    if (speedSq < VEHICLE_HANDLING.parkedSpeed * VEHICLE_HANDLING.parkedSpeed && throttle === 0 && brake === 0) {
      state.forward = 0;
      state.lateral = 0;
      state.slip = 0;
      state.steer = steer;
      state.rpm = 0;
      if (state.driver >= 0) this.audio.engineRpm(state.id, 0);
      return;
    }

    const sin = Math.sin(transform.heading);
    const cos = Math.cos(transform.heading);

    let forward = transform.vx * sin + transform.vz * cos;
    let lateral = transform.vx * cos - transform.vz * sin;

    if (throttle > 0) forward += config.accel * throttle * dt;
    if (brake > 0) {
      if (forward > 0.5) forward -= config.brake * brake * dt;
      else forward -= config.accel * VEHICLE_HANDLING.reverseAccel * brake * dt;
    }

    forward -= forward * VEHICLE_HANDLING.drag * dt;
    forward -= Math.sign(forward) * Math.min(Math.abs(forward), VEHICLE_HANDLING.rollingResistance * dt);
    forward = clamp(forward, -config.maxReverse, config.maxSpeed);

    // Руль: на месте не крутится, на скорости выходит на полную.
    const steerFactor = Math.min(1, Math.abs(forward) / VEHICLE_HANDLING.steerSpeedRef);
    const steerSign = forward < 0 ? -1 : 1;
    transform.heading += steer * config.steerRate * dt * steerFactor * steerSign;

    // Боковое трение: ручник почти отключает сцепление → занос.
    lateral *= Math.exp(-(handbrake ? config.handbrakeGrip : config.grip) * dt);

    // Уничтоженная машина не катится вечно: повышенное сопротивление.
    if (wrecked) {
      forward *= Math.exp(-2.5 * dt);
      lateral *= Math.exp(-2.5 * dt);
    }

    transform.vx = sin * forward + cos * lateral;
    transform.vz = cos * forward - sin * lateral;

    const radius = vehicleColliderRadius(config);
    const body = this.body;
    body.x = transform.x;
    body.z = transform.z;
    body.vx = transform.vx;
    body.vz = transform.vz;
    body.radius = radius;

    // Свой коллайдер убираем на время шага, иначе moveCircle вернёт контакт
    // с самим собой (BUG-M4-005). registry продолжает считать компонент
    // подключённым, а updateCollider ниже вернёт его в хэш.
    const collider = state.collider;
    if (collider) this.hash.remove(collider);

    resetSolveResult(this.solve);
    moveCircle(body, dt, this.hash, this.candidates, this.contact, this.tuning, this.solve);

    // Кламп по границам мира — страховка от вылета, как в M3.
    if (this.bounds) {
      const margin = radius + VEHICLE_HANDLING.boundsMargin;
      body.x = clamp(body.x, this.bounds.minX + margin, this.bounds.maxX - margin);
      body.z = clamp(body.z, this.bounds.minZ + margin, this.bounds.maxZ - margin);
    }

    transform.x = body.x;
    transform.z = body.z;
    transform.vx = body.vx;
    transform.vz = body.vz;

    const impact = this.solve.hit ? this.solve.impact : 0;
    if (impact > VEHICLE_HANDLING.impactMinSpeed) {
      const damage = (impact - VEHICLE_HANDLING.impactMinSpeed) * VEHICLE_HANDLING.impactDamagePerSpeed;
      const wreckedNow = damageVehicle(state, damage * vehicleDamageScale(state));
      state.lastImpact = impact;
      if (impact > state.impactPulse) state.impactPulse = impact;
      this.audio.impact(state.id, impact);
      if (wreckedNow) this.audio.explosion(state.id);
      this.pushNeighbors(state, impact);
    }

    if (collider) this.registry.updateCollider(state.id);

    state.forward = forward;
    state.lateral = lateral;
    state.slip = Math.abs(lateral);
    state.steer = steer;

    const rpm = wrecked
      ? 0
      : clamp(0.1 + (Math.abs(forward) / config.maxSpeed) * 0.75 + throttle * 0.15, 0, 1);
    state.rpm = rpm;
    state.smoking = state.hp / state.maxHp < VEHICLE_HANDLING.smokeRatio;

    if (state.driver >= 0) {
      this.audio.engineRpm(state.id, rpm);
      const slipping = state.slip > 0.6 || (handbrake && Math.abs(forward) > 3);
      if (slipping) this.audio.skid(state.id, clamp(state.slip / 6, 0, 1));
    }
  }

  /**
   * Толчок и урон соседней машине: контакт движущейся машины с её коллайдером.
   * Работает только по динамическим коллайдерам (id < 0 в registry).
   */
  private pushNeighbors(state: VehicleState, impact: number): void {
    const body = this.body;
    const selfColliderId = -state.id - 1;
    this.hash.queryCircle(body.x, body.z, body.radius + 0.35, this.neighbors);
    for (let i = 0; i < this.neighbors.length; i += 1) {
      const other = this.neighbors[i];
      if (other.id >= 0) continue;
      // Явное исключение собственного коллайдера (BUG-M4-005): даже если он
      // окажется в хэше из-за порядка шагов, машина не толкнёт сама себя.
      if (other.id === selfColliderId) continue;
      if (!circleRect(body.x, body.z, body.radius + 0.15, other, this.contact)) continue;

      const otherId = -other.id - 1;
      if (otherId === state.id) continue;
      const target = this.fleet.get(otherId);
      if (!target) continue;

      const massRatio = state.config.mass / (state.config.mass + target.config.mass);
      const push = impact * VEHICLE_HANDLING.impactPush * massRatio;
      target.transform.vx -= this.contact.nx * push;
      target.transform.vz -= this.contact.nz * push;

      const transfer =
        (impact - VEHICLE_HANDLING.impactMinSpeed) *
        VEHICLE_HANDLING.impactDamagePerSpeed *
        VEHICLE_HANDLING.impactTransfer;
      if (transfer > 0) damageVehicle(target, transfer * vehicleDamageScale(target));
    }
  }
}
