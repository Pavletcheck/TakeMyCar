// ---------------------------------------------------------------------------
// Тюнинг ядра: шаг симуляции, лимиты цикла, коллизии, стресс-режим.
// Числа баланса и бюджета живут здесь, а не в логике (AGENTS §5).
// ---------------------------------------------------------------------------

export interface TuningConfig {
  /** Шаг симуляции, секунды (ADR 0002). */
  readonly fixedStep: number;
  /** Максимум подшагов на кадр — защита от спирали смерти. */
  readonly maxSubsteps: number;
  /** Максимальная дельта кадра: после сна/фоновой вкладки не догоняем. */
  readonly maxFrameDelta: number;
  /** Ячейка spatial hash, метры. */
  readonly spatialCellSize: number;

  /** Итерации разрешения контактов, 2–4 (ADR 0003). */
  readonly collisionIterations: number;
  /** Упругость отскока при ударе (ADR 0003). */
  readonly restitution: number;
  /** Доля касательной скорости, теряемая за контакт. */
  readonly collisionFriction: number;
  /** Максимальный путь тела за один подшаг, метры (антитуннелирование). */
  readonly maxSweepStep: number;
  /** Дополнительный радиус запроса широкой фазы, метры. */
  readonly collisionSkin: number;

  /** Стресс-режим ?stress=1: количество статических коллайдеров. */
  readonly stressStaticColliders: number;
  /** Стресс-режим ?stress=1: количество движущихся коллайдеров. */
  readonly stressMovingColliders: number;
}

export const TUNING: TuningConfig = {
  fixedStep: 1 / 60,
  maxSubsteps: 5,
  maxFrameDelta: 0.25,
  spatialCellSize: 8,

  collisionIterations: 3,
  restitution: 0.2,
  collisionFriction: 0.12,
  maxSweepStep: 0.4,
  collisionSkin: 0.02,

  stressStaticColliders: 300,
  stressMovingColliders: 50,
};
