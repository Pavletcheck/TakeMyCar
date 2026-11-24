// ---------------------------------------------------------------------------
// M8. Коллекции: 40 пакетов, 12 трамплинов и 8 уникальных машин.
//
// Пакеты не случайны: раскладка считается детерминированно из фиксированного
// списка кварталов авторской карты (каждый N-й квартал, угол тротуара).
// Трамплины и якоря уникальных машин заданы координатами — их можно
// проверить глазами и в тестах. Все награды — числа здесь (AGENTS §5).
// ---------------------------------------------------------------------------

import type { VehicleTypeId } from './vehicles';

/** Минимальный прямоугольник квартала, нужный раскладке пакетов. */
export interface CollectibleBlock {
  readonly x: number;
  readonly z: number;
  readonly hx: number;
  readonly hz: number;
  readonly kind: string;
}

export interface WorldPoint {
  readonly x: number;
  readonly z: number;
}

export interface RampDef extends WorldPoint {
  readonly heading: number;
}

export interface UniqueCarAnchor extends WorldPoint {
  readonly type: VehicleTypeId;
  readonly colorIndex: number;
  readonly nameKey: string;
}

export const COLLECTIBLE_RULES = {
  /** Сколько пакетов на карте (COL-01). */
  packageCount: 40,
  /** Радиус подбора пакета, м. */
  packageRadius: 1.9,
  /** Награда за пакет, кредиты. */
  packageReward: 75,
  /** Сколько трамплинов (6–12 по брифу; здесь 12). */
  rampCount: 12,
  /** Радиус рампа, м. */
  rampRadius: 5.5,
  /** Минимальная скорость входа на трамплин, м/с. */
  rampMinSpeed: 13,
  /** Минимальная длина «полёта» (дистанция без потери скорости), м. */
  rampMinDistance: 16,
  /** Максимальная длительность полёта, с. */
  rampMaxTime: 3.5,
  /** Скорость, ниже которой полёт считается завершённым, м/с. */
  rampEndSpeed: 9,
  /** Награда за трамплин. */
  rampReward: 150,
  /** Кулдаун повторного зачёта трамплина, с. */
  rampCooldown: 12,
  /** Награда за доставку уникальной машины в гараж. */
  carReward: 600,
  /** Радиус гаража для сдачи машины, м (совпадает с ECONOMY.garageRadius). */
  garageRadius: 40,
  /** Как часто проверять подбор, с (не каждый тик — PERF-05). */
  checkInterval: 0.1,
} as const;

export interface Milestone {
  readonly count: number;
  readonly reward: number;
}

/** Награды за 10/20/30/40 пакетов. */
export const PACKAGE_MILESTONES: readonly Milestone[] = [
  { count: 10, reward: 250 },
  { count: 20, reward: 450 },
  { count: 30, reward: 700 },
  { count: 40, reward: 1500 },
];

/** Награды за 6/12 трамплинов (ACH: «10 трамплинов» — промежуточная). */
export const RAMP_MILESTONES: readonly Milestone[] = [
  { count: 6, reward: 450 },
  { count: 12, reward: 1100 },
];

/** Награда за все 8 уникальных машин. */
export const CAR_MILESTONE: Milestone = { count: 8, reward: 2500 };

/**
 * Раскладка 40 пакетов по тротуарам. Детерминированно: берём каждый
 * (usable.length / 40)-й квартал и ставим пакет в угол плиты с отступом
 * внутрь (полоса тротуара). Никакого RNG — точки одинаковы при каждом запуске.
 */
export function buildPackageLayout(blocks: readonly CollectibleBlock[]): WorldPoint[] {
  const usable: CollectibleBlock[] = [];
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    if (block.kind === 'promenade') continue;
    if (block.hx < 16 || block.hz < 16) continue;
    usable.push(block);
  }
  const out: WorldPoint[] = [];
  if (usable.length === 0) return out;

  const target = COLLECTIBLE_RULES.packageCount;
  const step = usable.length / target;
  const inset = 3.4;
  const signs: readonly (readonly [number, number])[] = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ];
  for (let i = 0; i < target; i += 1) {
    const block = usable[Math.min(usable.length - 1, Math.floor(i * step))];
    const sign = signs[i % signs.length];
    out.push({
      x: Number((block.x + sign[0] * (block.hx - inset)).toFixed(1)),
      z: Number((block.z + sign[1] * (block.hz - inset)).toFixed(1)),
    });
  }
  return out;
}

/**
 * 12 трамплинов на прямых участках улиц. Координаты — осевые линии дорог,
 * heading — направление движения (заезд «по ходу»).
 */
export const RAMPS: readonly RampDef[] = [
  { x: 0, z: 250, heading: 0 },
  { x: 0, z: -250, heading: Math.PI },
  { x: 0, z: 420, heading: 0 },
  { x: 0, z: -420, heading: Math.PI },
  { x: 250, z: 0, heading: Math.PI / 2 },
  { x: -250, z: 0, heading: -Math.PI / 2 },
  { x: 150, z: 200, heading: Math.PI / 2 },
  { x: -150, z: -200, heading: -Math.PI / 2 },
  { x: 250, z: -200, heading: Math.PI / 2 },
  { x: -250, z: 200, heading: -Math.PI / 2 },
  { x: 450, z: 0, heading: Math.PI / 2 },
  { x: -400, z: 250, heading: 0 },
];

/**
 * Якоря уникальных машин: у ориентиров карты. Точное место ставит bootstrap
 * через свободную точку дороги рядом — так машина не окажется в стене.
 */
export const UNIQUE_CAR_ANCHORS: readonly UniqueCarAnchor[] = [
  { x: -50, z: 120, type: 'sedan', colorIndex: 0, nameKey: 'collectible.car.1' },
  { x: -350, z: 320, type: 'sports', colorIndex: 1, nameKey: 'collectible.car.2' },
  { x: 560, z: 0, type: 'van', colorIndex: 2, nameKey: 'collectible.car.3' },
  { x: -200, z: 400, type: 'truck', colorIndex: 1, nameKey: 'collectible.car.4' },
  { x: 250, z: 0, type: 'sports', colorIndex: 3, nameKey: 'collectible.car.5' },
  { x: 50, z: -300, type: 'sedan', colorIndex: 2, nameKey: 'collectible.car.6' },
  { x: -250, z: -100, type: 'van', colorIndex: 1, nameKey: 'collectible.car.7' },
  { x: 300, z: 150, type: 'truck', colorIndex: 2, nameKey: 'collectible.car.8' },
];
