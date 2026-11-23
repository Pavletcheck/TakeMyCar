// ---------------------------------------------------------------------------
// Игровой цикл: фиксированный шаг 60 Гц + интерполяция рендера.
// Пауза замораживает симуляцию и сбрасывает накопитель, чтобы после
// возврата фокуса не было скачка dt. Защита от спирали смерти — maxSteps.
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

  constructor(fixedUpdate: FixedUpdateFn, renderFrame: RenderFn, options: GameLoopOptions = {}) {
    this.fixedUpdate = fixedUpdate;
    this.renderFrame = renderFrame;
    this.fixedStep = options.fixedStep ?? 1 / 60;
    this.maxSteps = options.maxSteps ?? 8;
    this.maxFrameDelta = options.maxFrameDelta ?? 0.1;

    if (!(this.fixedStep > 0)) throw new Error('GameLoop: fixedStep должен быть > 0');
    if (!(this.maxSteps >= 1)) throw new Error('GameLoop: maxSteps должен быть >= 1');
  }

  get isPaused(): boolean {
    return this.paused;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = -1;
    this.accumulator = 0;
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

    if (steps === this.maxSteps) {
      // Спираль смерти: не догоняем бесконечно, лишний долг отбрасываем.
      this.accumulator = 0;
    }

    this.renderFrame(this.accumulator / this.fixedStep, frameDt);
  };
}
