// ---------------------------------------------------------------------------
// M6. Система миссий: данные из config/missions.ts, три типа заказов,
// телефон-пейджер, таймеры, успех/провал, кулдаун и прогрессия.
//
// Система не знает ни про DOM, ни про Three, ни про деньги: наружу отдаёт
// снимок состояния для HUD и колбэки onStart/onComplete/onFail/onOffer.
// app/bootstrap связывает их с экономикой, розыском, звуком и маркером.
// ---------------------------------------------------------------------------

import type { MissionDef, MissionFailReason, MissionType } from '../config/missions';
import { MISSION_RULES } from '../config/missions';
import type { VehicleTypeId } from '../config/vehicles';

export type MissionPhase = 'toStart' | 'toTarget' | 'checkpoint';

/** Снимок игрока, нужный миссиям. Заполняет bootstrap из PlayerController. */
export interface MissionPlayer {
  readonly x: number;
  readonly z: number;
  readonly inVehicle: boolean;
  readonly vehicleType: VehicleTypeId | null;
  readonly vehicleWrecked: boolean;
  readonly vehicleId: number;
}

/** Состояние заказа в пейджере. */
export interface MissionStatusEntry {
  readonly def: MissionDef;
  readonly status: 'available' | 'locked' | 'cooldown';
  /** Секунд до снятия кулдауна (0 — доступен). */
  readonly cooldown: number;
  /** id миссии, которая открывает эту (для текста «закрыт»). */
  readonly lockedBy: string | null;
}

/** Всё, что нужно HUD для панели активного заказа. */
export interface MissionHudState {
  readonly id: string;
  readonly type: MissionType;
  readonly titleKey: string;
  readonly phase: MissionPhase;
  /** Ключ текста цели: mission.objective.*. */
  readonly objectiveKey: string;
  /** Ключ места (place.*). */
  readonly placeKey: string;
  readonly vehicleClass: VehicleTypeId | null;
  readonly elapsed: number;
  readonly remaining: number | null;
  readonly distance: number;
  readonly checkpointIndex: number;
  readonly checkpointTotal: number;
  /** Игрок у цели, но не в машине — текст «доставь на машине». */
  readonly needVehicle: boolean;
}

/** Маркер цели для мини-карты и 3D-кольца. */
export interface MissionMarker {
  readonly x: number;
  readonly z: number;
  readonly radius: number;
  readonly kind: MissionPhase;
}

export interface MissionSaveState {
  readonly completed: readonly string[];
  readonly cooldowns: Readonly<Record<string, number>>;
}

export interface MissionSystemOptions {
  readonly missions: readonly MissionDef[];
  readonly completed?: readonly string[];
  readonly cooldowns?: Readonly<Record<string, number>>;
  /** Старт: bootstrap может заспавнить машину нужного класса и вернуть её id. */
  readonly onStart?: (def: MissionDef) => number | null;
  /** Успех: базовая награда, множитель применяет app через экономику. */
  readonly onComplete?: (def: MissionDef, baseReward: number) => void;
  readonly onFail?: (def: MissionDef, reason: MissionFailReason) => void;
  /** Смена этапа (взял груз, доехал до точки) — обновить маркер и звук. */
  readonly onStage?: (def: MissionDef, phase: MissionPhase) => void;
  /** Появился новый доступный заказ (телефон-пейджер). */
  readonly onOffer?: (def: MissionDef) => void;
}

interface ActiveMission {
  readonly def: MissionDef;
  phase: MissionPhase;
  elapsed: number;
  /** Индекс контрольной точки (для timed). */
  checkpoint: number;
  /** id машины, выданной под миссию (-1 — нет). */
  missionVehicleId: number;
  distance: number;
  needVehicle: boolean;
}

function distance(x1: number, z1: number, x2: number, z2: number): number {
  return Math.hypot(x2 - x1, z2 - z1);
}

export class MissionSystem {
  private readonly missions: readonly MissionDef[];
  private readonly completed = new Set<string>();
  private readonly cooldowns = new Map<string, number>();
  private readonly available = new Set<string>();
  private readonly onStartHook: ((def: MissionDef) => number | null) | null;
  private readonly onCompleteHook: ((def: MissionDef, baseReward: number) => void) | null;
  private readonly onFailHook: ((def: MissionDef, reason: MissionFailReason) => void) | null;
  private readonly onStageHook: ((def: MissionDef, phase: MissionPhase) => void) | null;
  private readonly onOfferHook: ((def: MissionDef) => void) | null;

  private activeMission: ActiveMission | null = null;
  private pagerOpenValue = false;
  private offersInitialized = false;
  private offerTimer = 0;
  private completedCount = 0;
  private failedCount = 0;

  constructor(options: MissionSystemOptions) {
    this.missions = options.missions;
    this.onStartHook = options.onStart ?? null;
    this.onCompleteHook = options.onComplete ?? null;
    this.onFailHook = options.onFail ?? null;
    this.onStageHook = options.onStage ?? null;
    this.onOfferHook = options.onOffer ?? null;
    if (options.completed) {
      for (const id of options.completed) this.completed.add(id);
    }
    if (options.cooldowns) {
      for (const id of Object.keys(options.cooldowns)) {
        const seconds = options.cooldowns[id];
        if (seconds > 0) this.cooldowns.set(id, seconds);
      }
    }
  }

  get pagerOpen(): boolean {
    return this.pagerOpenValue;
  }

  get activeId(): string | null {
    return this.activeMission ? this.activeMission.def.id : null;
  }

  get activeDef(): MissionDef | null {
    return this.activeMission ? this.activeMission.def : null;
  }

  get stats(): { completed: number; failed: number } {
    return { completed: this.completedCount, failed: this.failedCount };
  }

  isCompleted(id: string): boolean {
    return this.completed.has(id);
  }

  cooldownLeft(id: string): number {
    return this.cooldowns.get(id) ?? 0;
  }

  /** id миссии-предусловия, если текущая ещё закрыта. */
  private lockOf(def: MissionDef): MissionDef | null {
    if (!def.unlockAfter) return null;
    if (this.completed.has(def.unlockAfter)) return null;
    for (let i = 0; i < this.missions.length; i += 1) {
      if (this.missions[i].id === def.unlockAfter) return this.missions[i];
    }
    return null;
  }

  private isAvailable(def: MissionDef): boolean {
    if (this.lockOf(def)) return false;
    return (this.cooldowns.get(def.id) ?? 0) <= 0;
  }

  /** Список для телефона-пейджера: все миссии со статусом. */
  statuses(): MissionStatusEntry[] {
    const out: MissionStatusEntry[] = [];
    for (let i = 0; i < this.missions.length; i += 1) {
      const def = this.missions[i];
      const lock = this.lockOf(def);
      const cooldown = this.cooldowns.get(def.id) ?? 0;
      const status: MissionStatusEntry['status'] = lock
        ? 'locked'
        : cooldown > 0
          ? 'cooldown'
          : 'available';
      out.push({ def, status, cooldown, lockedBy: lock ? lock.id : null });
    }
    return out;
  }

  openPager(): void {
    this.pagerOpenValue = true;
  }

  closePager(): void {
    this.pagerOpenValue = false;
  }

  togglePager(): boolean {
    this.pagerOpenValue = !this.pagerOpenValue;
    return this.pagerOpenValue;
  }

  /** Взять заказ. false — занят, закрыт, на кулдауне или уже в работе. */
  start(id: string): boolean {
    if (this.activeMission) return false;
    let def: MissionDef | null = null;
    for (let i = 0; i < this.missions.length; i += 1) {
      if (this.missions[i].id === id) {
        def = this.missions[i];
        break;
      }
    }
    if (!def || !this.isAvailable(def)) return false;
    // Заказ «на время» без контрольных точек нечего проходить: не выдаём.
    if (def.type === 'timed' && (!def.checkpoints || def.checkpoints.length === 0)) return false;

    const vehicleId = this.onStartHook ? this.onStartHook(def) : null;
    const phase: MissionPhase = def.type === 'timed' ? 'checkpoint' : 'toStart';
    this.activeMission = {
      def,
      phase,
      elapsed: 0,
      checkpoint: 0,
      missionVehicleId: vehicleId ?? -1,
      distance: 0,
      needVehicle: false,
    };
    this.pagerOpenValue = false;
    if (this.onStageHook) this.onStageHook(def, phase);
    return true;
  }

  /** Отказаться от заказа: считается провалом без штрафа времени. */
  abandon(): boolean {
    if (!this.activeMission) return false;
    this.fail('abandoned');
    return true;
  }

  /** Шаг миссий: таймеры, этапы, провал. Вызывается из фиксированного шага. */
  update(dt: number, player: MissionPlayer): void {
    this.tickCooldowns(dt);
    this.refreshOffers(dt);

    const active = this.activeMission;
    if (!active) return;

    const def = active.def;
    active.elapsed += dt;

    if (def.timeLimit !== undefined && active.elapsed >= def.timeLimit) {
      active.distance = distance(player.x, player.z, def.target[0], def.target[1]);
      this.fail('timeout');
      return;
    }

    // Уничтоженная машина под заказом — провал, а не «доезжай как-нибудь».
    if (
      def.type === 'steal' &&
      player.inVehicle &&
      player.vehicleWrecked &&
      (active.missionVehicleId < 0 || player.vehicleId === active.missionVehicleId)
    ) {
      this.fail('wrecked');
      return;
    }

    if (active.phase === 'toStart') {
      const toStart = distance(player.x, player.z, def.start[0], def.start[1]);
      active.distance = toStart;
      if (toStart <= def.startRadius) {
        active.phase = 'toTarget';
        active.distance = distance(player.x, player.z, def.target[0], def.target[1]);
        if (this.onStageHook) this.onStageHook(def, active.phase);
      }
      return;
    }

    if (active.phase === 'checkpoint') {
      const checkpoints = def.checkpoints ?? [];
      if (checkpoints.length === 0) {
        // Конфиг без точек: успех не выдаём, заказ просто снимается.
        this.fail('abandoned');
        return;
      }
      const index = Math.min(active.checkpoint, checkpoints.length - 1);
      const point = checkpoints[index];
      const toPoint = distance(player.x, player.z, point[0], point[1]);
      active.distance = toPoint;
      if (toPoint <= def.targetRadius) {
        active.checkpoint = index + 1;
        if (active.checkpoint >= checkpoints.length) {
          this.succeed();
          return;
        }
        if (this.onStageHook) this.onStageHook(def, active.phase);
        const next = checkpoints[active.checkpoint];
        active.distance = distance(player.x, player.z, next[0], next[1]);
      }
      return;
    }

    // toTarget
    const toTarget = distance(player.x, player.z, def.target[0], def.target[1]);
    active.distance = toTarget;
    const atTarget = toTarget <= def.targetRadius;
    const classOk =
      def.vehicleClass === undefined ||
      (player.inVehicle && player.vehicleType === def.vehicleClass);
    const deliveryOk = def.type !== 'deliver' || player.inVehicle;
    active.needVehicle = atTarget && (!classOk || !deliveryOk);
    if (atTarget && classOk && deliveryOk) {
      this.succeed();
    }
  }

  /** Снимок для HUD: активный заказ либо null. */
  hud(): MissionHudState | null {
    const active = this.activeMission;
    if (!active) return null;
    const def = active.def;
    const isTimed = active.phase === 'checkpoint';
    const checkpoints = def.checkpoints ?? [];
    const placeKey = isTimed
      ? (def.checkpointKeys?.[Math.min(active.checkpoint, checkpoints.length - 1)] ??
        def.targetPlaceKey)
      : active.phase === 'toStart'
        ? def.startPlaceKey
        : def.targetPlaceKey;
    let objectiveKey: string;
    if (isTimed) objectiveKey = 'mission.objective.checkpoint';
    else if (def.type === 'steal') {
      objectiveKey =
        active.phase === 'toStart' ? 'mission.objective.stealStart' : 'mission.objective.stealTarget';
    } else {
      objectiveKey =
        active.phase === 'toStart'
          ? 'mission.objective.deliverStart'
          : 'mission.objective.deliverTarget';
    }
    return {
      id: def.id,
      type: def.type,
      titleKey: def.titleKey,
      phase: active.phase,
      objectiveKey,
      placeKey,
      vehicleClass: def.vehicleClass ?? null,
      elapsed: active.elapsed,
      remaining: def.timeLimit !== undefined ? Math.max(0, def.timeLimit - active.elapsed) : null,
      distance: active.distance,
      checkpointIndex: isTimed ? Math.min(active.checkpoint + 1, checkpoints.length) : 0,
      checkpointTotal: isTimed ? checkpoints.length : 0,
      needVehicle: active.needVehicle,
    };
  }

  /** Куда вести маркер: точка старта, текущая контрольная или финиш. */
  marker(): MissionMarker | null {
    const active = this.activeMission;
    if (!active) return null;
    const def = active.def;
    if (active.phase === 'toStart') {
      return { x: def.start[0], z: def.start[1], radius: def.startRadius, kind: active.phase };
    }
    if (active.phase === 'checkpoint') {
      const checkpoints = def.checkpoints ?? [];
      const index = Math.min(active.checkpoint, checkpoints.length - 1);
      const point = checkpoints[index] ?? def.target;
      return { x: point[0], z: point[1], radius: def.targetRadius, kind: active.phase };
    }
    return { x: def.target[0], z: def.target[1], radius: def.targetRadius, kind: active.phase };
  }

  /** Сохранение: прогресс и оставшиеся кулдауны. */
  save(): MissionSaveState {
    const cooldowns: Record<string, number> = {};
    for (const [id, seconds] of this.cooldowns) {
      if (seconds > 0) cooldowns[id] = Math.round(seconds);
    }
    return { completed: Array.from(this.completed), cooldowns };
  }

  restore(state: MissionSaveState): void {
    this.completed.clear();
    this.cooldowns.clear();
    for (const id of state.completed) this.completed.add(id);
    for (const id of Object.keys(state.cooldowns)) {
      const seconds = state.cooldowns[id];
      if (seconds > 0) this.cooldowns.set(id, seconds);
    }
    this.activeMission = null;
    this.available.clear();
    this.offersInitialized = false;
  }

  /** Полный сброс прогресса (кнопка «Сбросить прогресс»). */
  reset(): void {
    this.completed.clear();
    this.cooldowns.clear();
    this.available.clear();
    this.activeMission = null;
    this.pagerOpenValue = false;
    this.offersInitialized = false;
    this.completedCount = 0;
    this.failedCount = 0;
  }

  // --- внутреннее ----------------------------------------------------------

  private tickCooldowns(dt: number): void {
    if (this.cooldowns.size === 0) return;
    for (const [id, seconds] of this.cooldowns) {
      const next = seconds - dt;
      if (next <= 0) this.cooldowns.delete(id);
      else this.cooldowns.set(id, next);
    }
  }

  /** Сообщение о новом доступном заказе — не чаще ONCE в cooldown. */
  private refreshOffers(dt: number): void {
    if (this.offerTimer > 0) this.offerTimer -= dt;
    for (let i = 0; i < this.missions.length; i += 1) {
      const def = this.missions[i];
      const avail = this.isAvailable(def);
      if (avail && !this.available.has(def.id)) {
        this.available.add(def.id);
        if (this.offersInitialized && this.offerTimer <= 0 && this.onOfferHook) {
          this.offerTimer = MISSION_RULES.offerToastCooldown;
          this.onOfferHook(def);
        }
      } else if (!avail) {
        this.available.delete(def.id);
      }
    }
    if (!this.offersInitialized) this.offersInitialized = true;
  }

  private succeed(): void {
    const active = this.activeMission;
    if (!active) return;
    const def = active.def;
    this.activeMission = null;
    this.cooldowns.set(def.id, def.cooldown);
    this.available.delete(def.id);
    this.completed.add(def.id);
    this.completedCount += 1;
    if (this.onCompleteHook) this.onCompleteHook(def, def.reward);
  }

  private fail(reason: MissionFailReason): void {
    const active = this.activeMission;
    if (!active) return;
    const def = active.def;
    this.activeMission = null;
    this.cooldowns.set(def.id, def.cooldown);
    this.available.delete(def.id);
    this.failedCount += 1;
    if (this.onFailHook) this.onFailHook(def, reason);
  }
}
