// ---------------------------------------------------------------------------
// Отладочный оверлей: fps, время кадра, время логики, draw calls, tris,
// коллайдеры, сущности, overrun и накопленный долг симуляции.
// Под ?debug=1 добавляется строка мира: чанки, максимум генерации чанка,
// время world.update, сид и layoutHash (M3-A-02, M3-A-16).
// Текст обновляется раз в 0.5 с, чтобы не дёргать DOM каждый кадр.
// ---------------------------------------------------------------------------

const REFRESH_INTERVAL = 0.5;

export interface DebugFrameStats {
  drawCalls: number;
  triangles: number;
  speedKmh: number;
  /** Всего коллайдеров в SpatialHash (статика + динамика). */
  colliders: number;
  /** Динамических коллайдеров в хэше (сущности с компонентом Collider). */
  movingColliders: number;
  /** Живых сущностей в реестре. */
  entities: number;
  /** Отброшено подшагов защитой от спирали смерти. */
  overrun: number;
  /** Накопленный отброшенный долг, мс. */
  debtMs: number;
  /** Время последнего фикс. шага логики, мс. */
  logicMs: number;
  /** Активных чанков мира. */
  chunks: number;
  /** Максимум генерации чанка за сеанс, мс (не среднее). */
  chunkGenMaxMs: number;
  /** Время последней генерации чанка, мс. */
  chunkGenLastMs: number;
  /** Время последнего world.update, мс. */
  worldUpdateMs: number;
  /** Сид мира текущего запуска. */
  seed: number;
  /** FNV-1a хэш планировки (0 — не считался). */
  layoutHash: number;
  /** Показывать строку мира (?debug=1). */
  showWorld: boolean;
  /** Активен ли стресс-режим (?stress=1). */
  stressActive: boolean;
}

export function createDebugStats(): DebugFrameStats {
  return {
    drawCalls: 0,
    triangles: 0,
    speedKmh: 0,
    colliders: 0,
    movingColliders: 0,
    entities: 0,
    overrun: 0,
    debtMs: 0,
    logicMs: 0,
    chunks: 0,
    chunkGenMaxMs: 0,
    chunkGenLastMs: 0,
    worldUpdateMs: 0,
    seed: 0,
    layoutHash: 0,
    showWorld: false,
    stressActive: false,
  };
}

export class DebugOverlay {
  private readonly element: HTMLElement | null;
  private frames = 0;
  private elapsed = 0;
  private frameMsSum = 0;
  private logicMsSum = 0;

  constructor(element: HTMLElement | null) {
    this.element = element;
  }

  /**
   * Вызывается раз в кадр. frameDt — секунды, stats — заполненный вызывающим
   * переиспользуемый объект (последний кадр окна обновления).
   */
  update(frameDt: number, stats: DebugFrameStats): void {
    this.frames += 1;
    this.elapsed += frameDt;
    this.frameMsSum += frameDt * 1000;
    this.logicMsSum += stats.logicMs;

    if (this.elapsed < REFRESH_INTERVAL || !this.element) return;

    const fps = this.frames / this.elapsed;
    const frameMs = this.frameMsSum / this.frames;
    const logicMs = this.logicMsSum / this.frames;

    let text =
      `fps ${Math.round(fps)}   frame ${frameMs.toFixed(1)} ms   logic ${logicMs.toFixed(2)} ms   speed ${Math.round(stats.speedKmh)} km/h\n` +
      `draw calls ${stats.drawCalls}   tris ${(stats.triangles / 1000).toFixed(1)}k   ` +
      `colliders ${stats.colliders} (dyn ${stats.movingColliders})   entities ${stats.entities}\n` +
      `overrun ${stats.overrun} steps   debt ${stats.debtMs.toFixed(0)} ms`;

    if (stats.showWorld) {
      const hash = stats.layoutHash >>> 0;
      text +=
        `\nchunks ${stats.chunks}   gen max ${stats.chunkGenMaxMs.toFixed(1)} ms` +
        `   last ${stats.chunkGenLastMs.toFixed(1)} ms   world ${stats.worldUpdateMs.toFixed(2)} ms` +
        `\nseed ${stats.seed}   layout ${hash.toString(16).padStart(8, '0')}`;
    }
    if (stats.stressActive) text += '   stress on';

    this.element.textContent = text;

    this.frames = 0;
    this.elapsed = 0;
    this.frameMsSum = 0;
    this.logicMsSum = 0;
  }
}
