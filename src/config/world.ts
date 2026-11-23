// ---------------------------------------------------------------------------
// Параметры мира M3: сетка кварталов, дороги, районы, чанки, пропсы.
// Только данные — генератор читает их, но не меняет (AGENTS §5).
// Мир 1200×1200 м делится на 12×12 кварталов по 100 м: плита квартала 80 м,
// проезжая часть между кварталами 20 м (≥ 8 м по брифу).
// ---------------------------------------------------------------------------

export type DistrictId = 'center' | 'industrial' | 'waterfront';

/** Тип квартала: застройка, парк, парковка, набережная-променад. */
export type BlockKind = 'build' | 'park' | 'parking' | 'promenade';

export interface DistrictTuning {
  /** Целевая доля кварталов района (0..1). Для waterfront — подсказка, край закреплён. */
  readonly weight: number;
  /** Минимальная высота коробки, м (без крыши). */
  readonly heightMin: number;
  /** Максимальная высота коробки, м. */
  readonly heightMax: number;
  /** Палитра фасадов. */
  readonly buildingColors: readonly number[];
  /** Палитра крыш/парапетов. */
  readonly roofColors: readonly number[];
}

export interface WorldPalette {
  /** Асфальт (дороги — это фон). */
  readonly ground: number;
  /** Плита тротуара квартала. */
  readonly sidewalk: number;
  /** Газон парка/променада. */
  readonly park: number;
  /** Асфальт парковки. */
  readonly parking: number;
  /** Вода залива. */
  readonly water: number;
  /** Дорожная разметка. */
  readonly marking: number;
}

export interface WorldConfig {
  /** Сид по умолчанию; `?seed=N` переопределяет его на старте. */
  readonly seed: number;
  /** Сторона района, м. */
  readonly sizeMeters: number;
  /** Сторона чанка стриминга, м (бриф M3: 128). */
  readonly chunkSize: number;
  /** Шаг между центрами кварталов, м. */
  readonly blockStep: number;
  /** Половина плиты квартала, м (тротуар включён). */
  readonly blockHalf: number;
  /** Ширина тротуарной полосы вдоль квартала, м. */
  readonly sidewalkWidth: number;
  /** Ширина проезжей части между кварталами, м (blockStep − 2·blockHalf). */
  readonly roadWidth: number;
  /** Ширина полосы движения, м. */
  readonly laneWidth: number;
  /** Высота плиты квартала (бордюр), м. */
  readonly curbHeight: number;
  /** Ширина променада в кварталах набережной, м. */
  readonly waterfrontPromenadeWidth: number;
  /** Ширина воды в полосе набережной, м. */
  readonly waterfrontWaterWidth: number;
  /** Радиус стриминга в чанках вокруг игрока. */
  readonly streamRadius: number;
  /** Гистерезис выгрузки, чанков: дальше radius + hysteresis чанк снимается. */
  readonly streamHysteresis: number;
  /** Сколько чанков генерировать за один world.update (кроме prefetch). */
  readonly maxChunksPerUpdate: number;
  /** Множитель плотности пропсов (1 — базовая). */
  readonly propsDensity: number;
  /** Палитра мира. */
  readonly colors: WorldPalette;
  /** Параметры районов. */
  readonly districts: Readonly<Record<DistrictId, DistrictTuning>>;
}

export const WORLD: WorldConfig = {
  seed: 20261123,
  sizeMeters: 1200,
  chunkSize: 128,
  blockStep: 100,
  blockHalf: 40,
  sidewalkWidth: 3,
  roadWidth: 20,
  laneWidth: 3.4,
  curbHeight: 0.18,
  waterfrontPromenadeWidth: 50,
  waterfrontWaterWidth: 40,
  streamRadius: 2,
  streamHysteresis: 0,
  maxChunksPerUpdate: 4,
  propsDensity: 1,

  colors: {
    ground: 0x2f353d,
    sidewalk: 0x4a525d,
    park: 0x3a573b,
    parking: 0x3b424b,
    water: 0x1b4a5a,
    marking: 0xd9e0e8,
  },

  districts: {
    center: {
      weight: 0.7,
      heightMin: 7,
      heightMax: 48,
      buildingColors: [0x8b93a1, 0x9c8f80, 0x7d8e9f, 0xa39887, 0x6f7b88, 0x9aa4b2],
      roofColors: [0x5d6570, 0x6b6155, 0x545e6b, 0x6e6559],
    },
    industrial: {
      weight: 0.2,
      heightMin: 5,
      heightMax: 11,
      buildingColors: [0x7d7365, 0x8a7f6d, 0x6e6a62, 0x85796a],
      roofColors: [0x53504a, 0x5c564d, 0x4b4842],
    },
    waterfront: {
      weight: 0.1,
      heightMin: 6,
      heightMax: 12,
      buildingColors: [0x9aa3ab, 0x8f9a96, 0xa8a08f],
      roofColors: [0x626a72, 0x6b726d],
    },
  },
};
