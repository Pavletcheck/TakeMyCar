// ---------------------------------------------------------------------------
// M8. Суточный цикл: фаза 0..1, интерполяция палитры и «ночь» для фар.
//
// Система чистая: все цвета отдаются числами, сцену меняет app. Обновление —
// из фиксированного шага, поэтому на паузе время суток стоит. Палитра
// интерполируется в переиспользуемый объект — без аллокаций в кадре.
// ---------------------------------------------------------------------------

import { AMBIENCE_KEYFRAMES, DAY_NIGHT } from '../config/ambience';
import type { AmbiencePalette } from '../config/ambience';

export interface AmbienceSample {
  phase: number;
  /** Час 0..24 для HUD/радио. */
  hour: number;
  /** Цвет неба и тумана, 0xRRGGBB. */
  sky: number;
  fog: number;
  hemiSky: number;
  hemiGround: number;
  hemiIntensity: number;
  sun: number;
  sunIntensity: number;
  exposure: number;
  /** 0 — день, 1 — ночь. */
  night: number;
}

export class DayNightCycle {
  private phaseValue: number;
  private readonly sample: AmbienceSample = {
    phase: 0,
    hour: 0,
    sky: 0,
    fog: 0,
    hemiSky: 0,
    hemiGround: 0,
    hemiIntensity: 0,
    sun: 0,
    sunIntensity: 0,
    exposure: 0,
    night: 0,
  };

  constructor(phase: number = DAY_NIGHT.startPhase) {
    this.phaseValue = this.normalize(phase);
    this.sampleAt(this.phaseValue);
  }

  get phase(): number {
    return this.phaseValue;
  }

  /** Готовый снимок палитры (общий объект, не мутировать снаружи). */
  get state(): AmbienceSample {
    return this.sample;
  }

  setPhase(phase: number): void {
    this.phaseValue = this.normalize(phase);
    this.sampleAt(this.phaseValue);
  }

  update(dt: number): void {
    this.phaseValue = this.normalize(this.phaseValue + dt / DAY_NIGHT.cycleSeconds);
    this.sampleAt(this.phaseValue);
  }

  /** Ярлык времени для HUD: ключ локализации. */
  labelKey(): string {
    const hour = this.sample.hour;
    if (hour < 5 || hour >= 22) return 'time.night';
    if (hour < 9) return 'time.morning';
    if (hour < 18) return 'time.day';
    return 'time.evening';
  }

  // --- внутреннее ----------------------------------------------------------

  private normalize(value: number): number {
    if (!Number.isFinite(value)) return DAY_NIGHT.startPhase;
    return ((value % 1) + 1) % 1;
  }

  private sampleAt(phase: number): void {
    const frames = AMBIENCE_KEYFRAMES;
    let a: AmbiencePalette = frames[0];
    let b: AmbiencePalette = frames[frames.length - 1];
    for (let i = 0; i < frames.length - 1; i += 1) {
      if (phase >= frames[i].at && phase <= frames[i + 1].at) {
        a = frames[i];
        b = frames[i + 1];
        break;
      }
    }
    const span = b.at - a.at;
    const t = span > 0 ? (phase - a.at) / span : 0;
    const sample = this.sample;
    sample.phase = phase;
    sample.hour = phase * 24;
    sample.sky = mixColor(a.sky, b.sky, t);
    sample.fog = mixColor(a.fog, b.fog, t);
    sample.hemiSky = mixColor(a.hemiSky, b.hemiSky, t);
    sample.hemiGround = mixColor(a.hemiGround, b.hemiGround, t);
    sample.hemiIntensity = mix(a.hemiIntensity, b.hemiIntensity, t);
    sample.sun = mixColor(a.sun, b.sun, t);
    sample.sunIntensity = mix(a.sunIntensity, b.sunIntensity, t);
    sample.exposure = mix(a.exposure, b.exposure, t);
    sample.night = mix(a.night, b.night, t);
  }
}

function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function mixColor(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff;
  const ag = (a >> 8) & 0xff;
  const ab = a & 0xff;
  const br = (b >> 16) & 0xff;
  const bg = (b >> 8) & 0xff;
  const bb = b & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return (r << 16) | (g << 8) | bl;
}
