// ---------------------------------------------------------------------------
// M6. Миссии: данные, а не код. Координаты привязаны к проезжей части
// авторской карты (assets/maps/city.json: roads, missions[], landmarks[]):
// центры кварталов и ориентиры находятся внутри застройки, поэтому точки
// заказов стоят на осях улиц — туда реально доехать (BUG-M6-003).
//
// Типы: deliver (забери и довези), steal (угон конкретного класса),
// timed (несколько контрольных точек за время).
// Строки — только ключи локализации (assets/i18n/*.json).
// ---------------------------------------------------------------------------

import type { VehicleTypeId } from './vehicles';

export type MissionType = 'deliver' | 'steal' | 'timed';

/** Причины провала, они же ключи сообщений HUD. */
export type MissionFailReason = 'timeout' | 'wrecked' | 'abandoned';

export interface MissionDef {
  readonly id: string;
  readonly type: MissionType;
  readonly titleKey: string;
  readonly descKey: string;
  /** Точка, куда надо приехать, чтобы взять заказ, [x, z]. */
  readonly start: readonly [number, number];
  /** Точка сдачи / финиша, [x, z]. */
  readonly target: readonly [number, number];
  /** Для timed: последовательность контрольных точек, последняя — финиш. */
  readonly checkpoints?: readonly (readonly [number, number])[];
  /** Подписи контрольных точек (ключи i18n), по одной на точку. */
  readonly checkpointKeys?: readonly string[];
  /** Радиус зоны старта, м. */
  readonly startRadius: number;
  /** Радиус зоны финиша, м. */
  readonly targetRadius: number;
  /** Лимит времени, с. Без лимита — undefined. */
  readonly timeLimit?: number;
  /** Базовая награда, кредиты. */
  readonly reward: number;
  /** Сколько звёзд розыска добавляет провал (0..5). */
  readonly heatOnFail: number;
  /** Требуемый класс машины (угон/доставка). */
  readonly vehicleClass?: VehicleTypeId;
  /** Миссия открывается после выполнения указанной. */
  readonly unlockAfter?: string;
  /** Кулдаун перед повторным взятием, с. */
  readonly cooldown: number;
  /** Ключ локализации места старта (для текста цели). */
  readonly startPlaceKey: string;
  /** Ключ локализации места финиша. */
  readonly targetPlaceKey: string;
}

/**
 * Пять заказов вокруг ориентиров Port Alba. Порядок в массиве — порядок
 * в пейджере; прогрессия задана unlockAfter, а не индексом.
 *
 * Координаты (оси улиц из city.json):
 *   arterial_ns  — x = 0;
 *   street_zp100 — z = 100 у гаража;
 *   street_zp400 — z = 400 у стадиона;
 *   bridge       — z = 0, x = 360…596 (доки);
 *   arterial_ew  — z = 0.
 */
export const MISSIONS: readonly MissionDef[] = [
  {
    id: 'first_run',
    type: 'deliver',
    titleKey: 'mission.first_run.title',
    descKey: 'mission.first_run.desc',
    start: [-50, 100], // street_zp100, у квартала гаража
    target: [0, -150], // arterial_ns у торгового центра
    startRadius: 12,
    targetRadius: 24,
    timeLimit: 150,
    reward: 300,
    heatOnFail: 1,
    cooldown: 45,
    startPlaceKey: 'place.garage',
    targetPlaceKey: 'place.mall',
  },
  {
    id: 'sports_job',
    type: 'steal',
    titleKey: 'mission.sports_job.title',
    descKey: 'mission.sports_job.desc',
    start: [-400, 350], // street_xm400, восточнее стадиона
    target: [0, 150], // arterial_ns у гаража
    startRadius: 18,
    targetRadius: 24,
    timeLimit: 200,
    reward: 600,
    heatOnFail: 2,
    vehicleClass: 'sports',
    cooldown: 90,
    startPlaceKey: 'place.stadium',
    targetPlaceKey: 'place.garage',
  },
  {
    id: 'docks_run',
    type: 'deliver',
    titleKey: 'mission.docks_run.title',
    descKey: 'mission.docks_run.desc',
    start: [0, -150], // arterial_ns у торгового центра
    target: [570, 0], // мост у доков, единственная дорога на восточный берег
    startRadius: 22,
    targetRadius: 24,
    timeLimit: 160,
    reward: 450,
    heatOnFail: 2,
    unlockAfter: 'first_run',
    cooldown: 75,
    startPlaceKey: 'place.mall',
    targetPlaceKey: 'place.docks',
  },
  {
    id: 'van_job',
    type: 'steal',
    titleKey: 'mission.van_job.title',
    descKey: 'mission.van_job.desc',
    start: [570, 0], // мост у доков
    target: [0, 150], // arterial_ns у гаража
    startRadius: 18,
    targetRadius: 24,
    timeLimit: 180,
    reward: 520,
    heatOnFail: 2,
    vehicleClass: 'van',
    unlockAfter: 'docks_run',
    cooldown: 90,
    startPlaceKey: 'place.docks',
    targetPlaceKey: 'place.garage',
  },
  {
    id: 'city_loop',
    type: 'timed',
    titleKey: 'mission.city_loop.title',
    descKey: 'mission.city_loop.desc',
    start: [-400, 350], // street_xm400 у стадиона
    target: [-400, 350],
    checkpoints: [
      [0, -150], // arterial_ns у торгового центра
      [-300, 250], // street_xm300 у больницы
      [-400, 350], // street_xm400 у стадиона (финиш)
    ],
    checkpointKeys: ['place.mall', 'place.hospital', 'place.stadium'],
    startRadius: 20,
    targetRadius: 22,
    timeLimit: 110,
    reward: 750,
    heatOnFail: 1,
    unlockAfter: 'sports_job',
    cooldown: 120,
    startPlaceKey: 'place.stadium',
    targetPlaceKey: 'place.stadium',
  },
];

/** Общие правила пейджера и маркеров. */
export const MISSION_RULES = {
  /** Радиус, в котором маркер миссии виден на мини-карте всегда, м. */
  markerRadius: 26,
  /** Сколько секунд показывать сообщение «доступен заказ», с. */
  offerToastDelay: 2.5,
  /** Минимальный интервал между сообщениями о новых заказах, с. */
  offerToastCooldown: 20,
} as const;

/** Поиск миссии по id (для отладочного API и сохранений). */
export function findMission(id: string): MissionDef | undefined {
  for (let i = 0; i < MISSIONS.length; i += 1) {
    if (MISSIONS[i].id === id) return MISSIONS[i];
  }
  return undefined;
}
