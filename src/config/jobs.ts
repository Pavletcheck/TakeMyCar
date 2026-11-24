// ---------------------------------------------------------------------------
// M8. Подработки: данные пяти работ (такси, Vigilante, курьер, гонка,
// Rampage). Общий цикл — старт, цель, таймер, успех/провал, награда,
// кулдаун — живёт в systems/jobs; здесь только числа и точки маршрутов.
//
// Координаты остановок привязаны к осям улиц авторской карты (x/z кратны
// 100 или лежат на кольце), чтобы цель реально достигалась на машине.
// Все подписи — ключи локализации.
// ---------------------------------------------------------------------------

import type { VehicleTypeId } from './vehicles';

export type JobId = 'taxi' | 'vigilante' | 'courier' | 'race' | 'rampage';

/** Точка маршрута подработки. */
export interface JobStop {
  readonly x: number;
  readonly z: number;
  /** Ключ локализации места (place.*). */
  readonly placeKey: string;
}

export interface JobDef {
  readonly id: JobId;
  readonly titleKey: string;
  readonly descKey: string;
  /** Награда за успех, кредиты. */
  readonly reward: number;
  /** Общий лимит времени, с. */
  readonly duration: number;
  /** Кулдаун после завершения, с. */
  readonly cooldown: number;
  /** Сколько звёзд даёт провал (0 — не даёт). */
  readonly heatOnFail: number;
  /** Цвет маркера. */
  readonly color: number;
  /** Машина, которую выдаёт работа (такси/полиция); null — своя. */
  readonly vehicleType: VehicleTypeId | null;
  /** Индекс цвета из палитры типа. */
  readonly vehicleColor: number;
  /** Нужна ли машина (курьер/гонка). */
  readonly needVehicle: boolean;
  readonly targetRadius: number;
  readonly stops: readonly JobStop[];
  /** Rampage: сколько машин разбить. */
  readonly wrecks: number;
  /** Курьер: лимит на одну точку, с (0 — только общий таймер). */
  readonly legTime: number;
  /** Такси: окно чаевых, с, и сумма. */
  readonly tipWindow: number;
  readonly tipBonus: number;
  /** Гонка: число соперников. */
  readonly rivals: number;
}

/** Общие правила подработок (таймеры — только в фиксированном шаге). */
export const JOB_RULES = {
  /** Одновременно активна одна подработка. */
  maxActive: 1,
  /** Машину/старт ищем рядом с игроком, м. */
  spawnMinDistance: 18,
  spawnMaxDistance: 70,
  /** Радиус зоны старта гонки/курьера, м. */
  startRadius: 20,
  /** Удержание зоны (такси/задержание), с. */
  holdTime: 1.5,
  /** Кто первый на финише — тот и выиграл: радиус чекпоинта соперника, м. */
  rivalRadius: 14,
  /** Скорость соперников, м/с. */
  rivalSpeed: 15,
  /** Через сколько секунд соперник «читерски» переставляется к цели, с. */
  rivalStuckTime: 4,
  /** Rampage: радиус зачёта разбитой машины, м. */
  rampageRadius: 30,
  /** Сколько тостов о разбитых машинах максимум (не спамим — R-15). */
  wreckToastEvery: 2,
} as const;

export const JOBS: readonly JobDef[] = [
  {
    id: 'taxi',
    titleKey: 'job.taxi.title',
    descKey: 'job.taxi.desc',
    reward: 500,
    duration: 190,
    cooldown: 60,
    heatOnFail: 0,
    color: 0xffd43b,
    vehicleType: 'sedan',
    vehicleColor: 4,
    needVehicle: true,
    targetRadius: 12,
    stops: [
      { x: -50, z: 100, placeKey: 'place.garage' },
      { x: -250, z: 250, placeKey: 'place.hospital' },
      { x: 50, z: -150, placeKey: 'place.mall' },
    ],
    wrecks: 0,
    legTime: 0,
    tipWindow: 50,
    tipBonus: 200,
    rivals: 0,
  },
  {
    id: 'vigilante',
    titleKey: 'job.vigilante.title',
    descKey: 'job.vigilante.desc',
    reward: 700,
    duration: 180,
    cooldown: 90,
    heatOnFail: 0,
    color: 0x4dabf7,
    vehicleType: 'police',
    vehicleColor: 0,
    needVehicle: true,
    targetRadius: 12,
    stops: [
      { x: -400, z: 350, placeKey: 'place.stadium' },
      { x: 0, z: -150, placeKey: 'place.mall' },
      { x: 570, z: 0, placeKey: 'place.docks' },
    ],
    wrecks: 0,
    legTime: 0,
    tipWindow: 0,
    tipBonus: 0,
    rivals: 0,
  },
  {
    id: 'courier',
    titleKey: 'job.courier.title',
    descKey: 'job.courier.desc',
    reward: 620,
    duration: 180,
    cooldown: 75,
    heatOnFail: 0,
    color: 0x51cf66,
    vehicleType: null,
    vehicleColor: 0,
    needVehicle: true,
    targetRadius: 11,
    stops: [
      { x: 0, z: -150, placeKey: 'place.mall' },
      { x: -250, z: 250, placeKey: 'place.hospital' },
      { x: 570, z: 0, placeKey: 'place.docks' },
    ],
    wrecks: 0,
    legTime: 55,
    tipWindow: 0,
    tipBonus: 0,
    rivals: 0,
  },
  {
    id: 'race',
    titleKey: 'job.race.title',
    descKey: 'job.race.desc',
    reward: 900,
    duration: 160,
    cooldown: 100,
    heatOnFail: 1,
    color: 0xda77f2,
    vehicleType: null,
    vehicleColor: 0,
    needVehicle: true,
    targetRadius: 16,
    stops: [
      { x: -400, z: -400, placeKey: 'place.ring1' },
      { x: 300, z: -400, placeKey: 'place.ring2' },
      { x: 300, z: 300, placeKey: 'place.ring3' },
      { x: -400, z: 300, placeKey: 'place.ring4' },
    ],
    wrecks: 0,
    legTime: 0,
    tipWindow: 0,
    tipBonus: 0,
    rivals: 2,
  },
  {
    id: 'rampage',
    titleKey: 'job.rampage.title',
    descKey: 'job.rampage.desc',
    reward: 800,
    duration: 130,
    cooldown: 120,
    heatOnFail: 2,
    color: 0xff6b6b,
    vehicleType: null,
    vehicleColor: 0,
    needVehicle: false,
    targetRadius: 14,
    stops: [],
    wrecks: 6,
    legTime: 0,
    tipWindow: 0,
    tipBonus: 0,
    rivals: 0,
  },
];

export function findJobDef(id: string): JobDef | undefined {
  for (let i = 0; i < JOBS.length; i += 1) {
    if (JOBS[i].id === id) return JOBS[i];
  }
  return undefined;
}

export const JOB_IDS: readonly string[] = JOBS.map((def) => def.id);
