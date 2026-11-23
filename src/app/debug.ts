// ---------------------------------------------------------------------------
// Отладочный оверлей: fps, время кадра, draw calls, треугольники.
// Текст обновляется раз в 0.5 с, чтобы не дёргать DOM каждый кадр.
// ---------------------------------------------------------------------------

const REFRESH_INTERVAL = 0.5;

export class DebugOverlay {
  private readonly element: HTMLElement | null;
  private frames = 0;
  private elapsed = 0;
  private frameMsSum = 0;

  constructor(element: HTMLElement | null) {
    this.element = element;
  }

  /**
   * Вызывается раз в кадр. frameDt — секунды, остальные значения — из рендера.
   */
  update(frameDt: number, drawCalls: number, triangles: number, speedKmh: number, colliders: number): void {
    this.frames += 1;
    this.elapsed += frameDt;
    this.frameMsSum += frameDt * 1000;

    if (this.elapsed < REFRESH_INTERVAL || !this.element) return;

    const fps = this.frames / this.elapsed;
    const frameMs = this.frameMsSum / this.frames;

    this.element.textContent =
      `fps ${Math.round(fps)}   frame ${frameMs.toFixed(1)} ms   speed ${Math.round(speedKmh)} km/h\n` +
      `draw calls ${drawCalls}   tris ${(triangles / 1000).toFixed(1)}k   colliders ${colliders}`;

    this.frames = 0;
    this.elapsed = 0;
    this.frameMsSum = 0;
  }
}
