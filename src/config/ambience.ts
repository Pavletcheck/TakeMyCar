// ---------------------------------------------------------------------------
// M8. Атмосфера: суточный цикл и радио.
//
// 6-минутные сутки: фаза 0..1, ключевые кадры палитры (небо, туман, свет,
// экспозиция) и коэффициент «ночи» для фар/неона. Никаких новых мешей и
// пересоздания сцены: app применяет цвета к существующим hemi/sun/fog
// (R-19). Радио — три синтезированные станции без внешних файлов.
// ---------------------------------------------------------------------------

export interface AmbiencePalette {
  /** Позиция в сутках 0..1. */
  readonly at: number;
  readonly sky: number;
  readonly fog: number;
  readonly hemiSky: number;
  readonly hemiGround: number;
  readonly hemiIntensity: number;
  readonly sun: number;
  readonly sunIntensity: number;
  readonly exposure: number;
  /** 0 — день, 1 — глубокая ночь (фары, неон). */
  readonly night: number;
}

export const DAY_NIGHT = {
  /** Полные сутки, с (бриф: 6 минут). */
  cycleSeconds: 360,
  /** Старт игры — позднее утро. */
  startPhase: 0.3,
  /** Минимальный шаг пересчёта палитры, с (цвета не дёргаем каждый кадр). */
  applyInterval: 0.25,
} as const;

/** Ключевые кадры суток. Конец = началу (0 = 1), чтобы интерполяция не рвалась. */
export const AMBIENCE_KEYFRAMES: readonly AmbiencePalette[] = [
  {
    at: 0,
    sky: 0x0a0e16,
    fog: 0x0a0e16,
    hemiSky: 0x2a3a55,
    hemiGround: 0x14100c,
    hemiIntensity: 0.55,
    sun: 0x7f9bd1,
    sunIntensity: 0.35,
    exposure: 0.85,
    night: 1,
  },
  {
    at: 0.16,
    sky: 0x2a2f45,
    fog: 0x2a2f45,
    hemiSky: 0x8fa6c8,
    hemiGround: 0x3a2f24,
    hemiIntensity: 1,
    sun: 0xffb36b,
    sunIntensity: 1.4,
    exposure: 1,
    night: 0.4,
  },
  {
    at: 0.28,
    sky: 0x10141a,
    fog: 0x10141a,
    hemiSky: 0xcfe0ff,
    hemiGround: 0x3a2f24,
    hemiIntensity: 1.75,
    sun: 0xfff0d4,
    sunIntensity: 2.5,
    exposure: 1.1,
    night: 0,
  },
  {
    at: 0.62,
    sky: 0x10141a,
    fog: 0x10141a,
    hemiSky: 0xcfe0ff,
    hemiGround: 0x3a2f24,
    hemiIntensity: 1.75,
    sun: 0xfff0d4,
    sunIntensity: 2.5,
    exposure: 1.1,
    night: 0,
  },
  {
    at: 0.74,
    sky: 0x241a24,
    fog: 0x241a24,
    hemiSky: 0xffb38a,
    hemiGround: 0x2a1f1a,
    hemiIntensity: 1.2,
    sun: 0xff8a5c,
    sunIntensity: 1.7,
    exposure: 1,
    night: 0.45,
  },
  {
    at: 0.84,
    sky: 0x0c1018,
    fog: 0x0c1018,
    hemiSky: 0x33456b,
    hemiGround: 0x16120e,
    hemiIntensity: 0.7,
    sun: 0x8ea7d8,
    sunIntensity: 0.5,
    exposure: 0.9,
    night: 0.9,
  },
  {
    at: 0.95,
    sky: 0x0a0e16,
    fog: 0x0a0e16,
    hemiSky: 0x2a3a55,
    hemiGround: 0x14100c,
    hemiIntensity: 0.55,
    sun: 0x7f9bd1,
    sunIntensity: 0.35,
    exposure: 0.85,
    night: 1,
  },
  {
    at: 1,
    sky: 0x0a0e16,
    fog: 0x0a0e16,
    hemiSky: 0x2a3a55,
    hemiGround: 0x14100c,
    hemiIntensity: 0.55,
    sun: 0x7f9bd1,
    sunIntensity: 0.35,
    exposure: 0.85,
    night: 1,
  },
];

export interface RadioStationDef {
  readonly id: string;
  readonly nameKey: string;
  readonly wave: OscillatorType;
  /** Ударов в минуту (8-е ноты — шаг планировщика). */
  readonly tempo: number;
  /** Базовая нота, Гц. */
  readonly baseNote: number;
  /** Полутоновые смещения мелодии (8 шагов). */
  readonly scale: readonly number[];
  /** Полутоновые смещения баса (4 шага). */
  readonly bass: readonly number[];
  /** Громкость станции 0..1. */
  readonly gain: number;
}

export const RADIO = {
  /** Стартовая станция (0..2), -1 — выключено. */
  defaultStation: 0,
  /** Общая громкость радио относительно громкости игры. */
  volume: 0.32,
  /** Сколько секунд не повторять новость, с. */
  newsCooldown: 14,
} as const;

export const RADIO_STATIONS: readonly RadioStationDef[] = [
  {
    id: 'wave',
    nameKey: 'radio.station.wave',
    wave: 'triangle',
    tempo: 104,
    baseNote: 220,
    scale: [0, 4, 7, 12, 7, 4, 0, -5],
    bass: [0, -5, -3, -7],
    gain: 0.05,
  },
  {
    id: 'neon',
    nameKey: 'radio.station.neon',
    wave: 'square',
    tempo: 126,
    baseNote: 262,
    scale: [0, 3, 7, 10, 12, 10, 7, 3],
    bass: [0, -2, -4, -2],
    gain: 0.034,
  },
  {
    id: 'harbor',
    nameKey: 'radio.station.harbor',
    wave: 'sine',
    tempo: 84,
    baseNote: 196,
    scale: [0, 5, 7, 12, 7, 5, 0, -3],
    bass: [0, -7, -5, -3],
    gain: 0.06,
  },
];

/** Частота ноты по полутонам от базовой. */
export function noteFrequency(base: number, semitones: number): number {
  return base * Math.pow(2, semitones / 12);
}
