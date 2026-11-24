// ---------------------------------------------------------------------------
// M8 «Интерес». Случайные события города: данные, а не код.
//
// Семь сцен вокруг игрока: ограбление, погоня, перестрелка, авария,
// инкассаторский фургон, уличная гонка, полицейский блокпост. У каждой —
// цель, таймер, награда, розыск и вес по районам (центр / промзона /
// набережная). Режиссёр событий (systems/eventDirector) читает конфиг и
// сам ничего не балансирует (AGENTS §5).
//
// Все строки — ключи локализации (assets/i18n/*.json).
// ---------------------------------------------------------------------------

import type { DistrictId } from './world';

/** Что должен сделать игрок на сцене. */
export type EventObjective =
  /** Дойти/доехать до зоны. */
  | 'reach'
  /** Удержаться в зоне holdTime секунд. */
  | 'stay'
  /** Уничтожить машину-цель (погоня). */
  | 'wreck'
  /** Протаранить цель на скорости (фургон). */
  | 'ram'
  /** Проехать зону на скорости (блокпост). */
  | 'escape';

/** Какие актёры появляются на сцене. */
export type EventActorKind = 'none' | 'suspect' | 'van' | 'wreckPair' | 'police' | 'race';

export interface EventDef {
  readonly id: string;
  readonly titleKey: string;
  readonly descKey: string;
  /** Строка радио-новости о начале сцены. */
  readonly newsKey: string;
  readonly objective: EventObjective;
  /** Где ставить сцену: на проезжей части или на тротуаре. */
  readonly placement: 'road' | 'sidewalk';
  readonly markerRadius: number;
  /** Сколько секунд сцена ждёт игрока. */
  readonly duration: number;
  /** Для objective stay: сколько секунд стоять в зоне. */
  readonly holdTime: number;
  /** Нужна ли машина (уличная гонка). */
  readonly requireVehicle: boolean;
  readonly reward: number;
  readonly heatOnResolve: number;
  readonly heatOnFail: number;
  readonly actor: EventActorKind;
  /** Цвет маркера (0xRRGGBB). */
  readonly color: number;
  /** Вес появления по районам; 0 — район не подходит. */
  readonly weight: Readonly<Record<DistrictId, number>>;
}

/**
 * Баланс режиссёра. Событие не начинается сразу после загрузки, между
 * сценами пауза, одновременно живёт не больше maxActive.
 */
export const EVENT_RULES = {
  /** Одновременно активных сцен. */
  maxActive: 2,
  /** Шанс второй сцены, когда одна уже идёт (0..1). */
  secondChance: 0.25,
  /** Пауза после старта игры, с. */
  firstDelay: 30,
  /** Кулдаун между сценами, с. */
  cooldownMin: 55,
  cooldownMax: 105,
  /** Сцена спавнится рядом, но не под ногами, м. */
  spawnMinDistance: 60,
  spawnMaxDistance: 200,
  /** Дальше этого сцена считается брошенной, м. */
  despawnDistance: 280,
  /** Скорость «прорыва» блокпоста, м/с. */
  escapeSpeed: 8,
  /** Скорость тарана фургона, м/с. */
  ramSpeed: 5.5,
  /** Минимальный радиус проверки цели, м. */
  reachPad: 1.5,
  /** Сколько секунд сцена висит в HUD после завершения, с. */
  fadeTime: 1.5,
} as const;

export const EVENT_DEFS: readonly EventDef[] = [
  {
    id: 'robbery',
    titleKey: 'event.robbery.title',
    descKey: 'event.robbery.desc',
    newsKey: 'event.news.robbery',
    objective: 'stay',
    placement: 'sidewalk',
    markerRadius: 16,
    duration: 80,
    holdTime: 3,
    requireVehicle: false,
    reward: 260,
    heatOnResolve: 0,
    heatOnFail: 0,
    actor: 'none',
    color: 0xffa94d,
    weight: { center: 3, industrial: 1, waterfront: 1 },
  },
  {
    id: 'chase',
    titleKey: 'event.chase.title',
    descKey: 'event.chase.desc',
    newsKey: 'event.news.chase',
    objective: 'wreck',
    placement: 'road',
    markerRadius: 14,
    duration: 95,
    holdTime: 0,
    requireVehicle: true,
    reward: 460,
    heatOnResolve: 0,
    heatOnFail: 1,
    actor: 'suspect',
    color: 0xff6b6b,
    weight: { center: 2, industrial: 2, waterfront: 2 },
  },
  {
    id: 'shootout',
    titleKey: 'event.shootout.title',
    descKey: 'event.shootout.desc',
    newsKey: 'event.news.shootout',
    objective: 'stay',
    placement: 'sidewalk',
    markerRadius: 15,
    duration: 70,
    holdTime: 2.5,
    requireVehicle: false,
    reward: 380,
    heatOnResolve: 1,
    heatOnFail: 0,
    actor: 'none',
    color: 0xda77f2,
    weight: { center: 1, industrial: 3, waterfront: 1 },
  },
  {
    id: 'accident',
    titleKey: 'event.accident.title',
    descKey: 'event.accident.desc',
    newsKey: 'event.news.accident',
    objective: 'stay',
    placement: 'road',
    markerRadius: 14,
    duration: 65,
    holdTime: 2,
    requireVehicle: false,
    reward: 220,
    heatOnResolve: 0,
    heatOnFail: 0,
    actor: 'wreckPair',
    color: 0x74c0fc,
    weight: { center: 2, industrial: 2, waterfront: 2 },
  },
  {
    id: 'armored_van',
    titleKey: 'event.armored_van.title',
    descKey: 'event.armored_van.desc',
    newsKey: 'event.news.armored_van',
    objective: 'ram',
    placement: 'road',
    markerRadius: 15,
    duration: 90,
    holdTime: 0,
    requireVehicle: true,
    reward: 620,
    heatOnResolve: 2,
    heatOnFail: 0,
    actor: 'van',
    color: 0xffd43b,
    weight: { center: 1, industrial: 2, waterfront: 2 },
  },
  {
    id: 'street_race',
    titleKey: 'event.street_race.title',
    descKey: 'event.street_race.desc',
    newsKey: 'event.news.street_race',
    objective: 'reach',
    placement: 'road',
    markerRadius: 20,
    duration: 65,
    holdTime: 0,
    requireVehicle: true,
    reward: 320,
    heatOnResolve: 1,
    heatOnFail: 0,
    actor: 'race',
    color: 0x51cf66,
    weight: { center: 2, industrial: 0, waterfront: 2 },
  },
  {
    id: 'checkpoint',
    titleKey: 'event.checkpoint.title',
    descKey: 'event.checkpoint.desc',
    newsKey: 'event.news.checkpoint',
    objective: 'escape',
    placement: 'road',
    markerRadius: 18,
    duration: 75,
    holdTime: 0,
    requireVehicle: true,
    reward: 360,
    heatOnResolve: 2,
    heatOnFail: 1,
    actor: 'police',
    color: 0xff8787,
    weight: { center: 2, industrial: 2, waterfront: 1 },
  },
];

/** Событие по id для отладочного API и радио. */
export function findEventDef(id: string): EventDef | undefined {
  for (let i = 0; i < EVENT_DEFS.length; i += 1) {
    if (EVENT_DEFS[i].id === id) return EVENT_DEFS[i];
  }
  return undefined;
}

/** Внешний id всех типов — для подсказок и тестов. */
export const EVENT_IDS: readonly string[] = EVENT_DEFS.map((def) => def.id);
