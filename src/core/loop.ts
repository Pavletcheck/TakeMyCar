// ---------------------------------------------------------------------------
// Игровой цикл: фиксированный шаг 60 Гц + интерполяция рендера.
// Пауза замораживает симуляцию и сбрасывает накопитель, чтобы после
// возврата фокуса не было скачка dt. Защита от спирали смерти — maxSteps:
// лишние подшаги отбрасываются, счётчик overrun и долг debt видны в HUD.
// ---------------------------------------------------------------------------

export type FixedUpdateFn = (dt: number) => void;

/**
 * alpha — доля незавершённого фиксированного шага (0..1) для интерполяции,
 * frameDt — реальное время кадра в секундах (с клампом, для камеры и HUD).
 */
export type RenderFn = (alpha: number, frameDt: number) => void;

export interface GameLoopOptions {
  fixedStep?: number;
  maxSteps?: number;
  maxFrameDelta?: number;
}

/** Шаг симуляции по умолчанию — 1/60 с (ADR 0002). */
export const DEFAULT_FIXED_STEP = 1 / 60;
/** Максимум подшагов на кадр (ADR 0002). */
export const DEFAULT_MAX_SUBSTEPS = 5;
/** Максимальная дельта кадра: после сна/вкладки время не догоняем. */
export const DEFAULT_MAX_FRAME_DELTA = 0.25;

export class GameLoop {
  private readonly fixedUpdate: FixedUpdateFn;
  private readonly renderFrame: RenderFn;
  private readonly fixedStep: number;
  private readonly maxSteps: number;
  private readonly maxFrameDelta: number;

  private rafId = 0;
  private running = false;
  private paused = false;
  private lastTime = -1;
  private accumulator = 0;
  private overrunCount = 0;
  private debtSeconds = 0;

  constructor(fixedUpdate: FixedUpdateFn, renderFrame: RenderFn, options: GameLoopOptions = {}) {
    this.fixedUpdate = fixedUpdate;
    this.renderFrame = renderFrame;
    this.fixedStep = options.fixedStep ?? DEFAULT_FIXED_STEP;
    this.maxSteps = options.maxSteps ?? DEFAULT_MAX_SUBSTEPS;
    this.maxFrameDelta = options.maxFrameDelta ?? DEFAULT_MAX_FRAME_DELTA;

    if (!(this.fixedStep > 0)) throw new Error('GameLoop: fixedStep должен быть > 0');
    if (!(this.maxSteps >= 1)) throw new Error('GameLoop: maxSteps должен быть >= 1');
  }

  get isPaused(): boolean {
    return this.paused;
  }

  /** Сколько подшагов отброшено защитой от спирали смерти. */
  get overrun(): number {
    return this.overrunCount;
  }

  /** Накопленный отброшенный долг симуляции, секунды. */
  get debt(): number {
    return this.debtSeconds;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = -1;
    this.accumulator = 0;
    this.overrunCount = 0;
    this.debtSeconds = 0;
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  pause(): void {
    if (this.paused) return;
    this.paused = true;
    this.accumulator = 0;
    this.lastTime = -1;
  }

  resume(): void {
    if (!this.paused) return;
    this.paused = false;
    this.accumulator = 0;
    this.lastTime = -1;
  }

  private readonly tick = (timeMs: number): void => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.tick);

    const now = timeMs / 1000;
    // Первый кадр после старта/резюма — только запоминаем время.
    if (this.lastTime < 0) {
      this.lastTime = now;
      return;
    }

    let frameDt = now - this.lastTime;
    this.lastTime = now;
    if (this.paused) return;
    if (!(frameDt > 0)) frameDt = 0;
    if (frameDt > this.maxFrameDelta) frameDt = this.maxFrameDelta;

    this.accumulator += frameDt;
    let steps = 0;
    while (this.accumulator >= this.fixedStep && steps < this.maxSteps) {
      this.fixedUpdate(this.fixedStep);
      this.accumulator -= this.fixedStep;
      steps += 1;
    }

    if (this.accumulator >= this.fixedStep) {
      // Спираль смерти: лишний долг отбрасываем, но фиксируем в диагностике.
      const dropped = Math.floor(this.accumulator / this.fixedStep);
      this.overrunCount += dropped > 0 ? dropped : 1;
      this.debtSeconds += this.accumulator;
      this.accumulator = 0;
    }

    this.renderFrame(this.accumulator / this.fixedStep, frameDt);
  };
}
