// ---------------------------------------------------------------------------
// M5. Жизнь города: трафик, пешеходы, розыск, оружие.
//
// Все числа баланса и бюджета живут здесь, системы их только читают (AGENTS §5).
// Блоки намеренно разделены по домену: TRAFFIC / PEDS / WANTED / WEAPONS /
// COMBAT, чтобы правка трафика не сдвигала погоню и наоборот.
//
// Ориентиры бюджета (05_LIFE_AI): 200 пешеходов + 60 машин + 8 копов < 4 мс.
// Дальние сущности обновляются реже — шаги (stride) тоже данные.
// ---------------------------------------------------------------------------

/** Оружие игрока и копов: только три типа, все стилизованные. */
export type WeaponId = 'pistol' | 'smg' | 'shotgun';

export interface WeaponSpec {
  readonly id: WeaponId;
  readonly label: string;
  /** Урон за одну пулю (дробовик умножает на pellets). */
  readonly damage: number;
  /** Скорострельность, выстрелов в секунду. */
  readonly rate: number;
  /** Полуугол разброса, радианы. */
  readonly spread: number;
  /** Сколько лучей уходит за выстрел (дробовик — 6). */
  readonly pellets: number;
  /** Дальность хитскана, м. */
  readonly range: number;
  /** Ёмкость магазина. */
  readonly mag: number;
  /** Запас патронов «в кармане» (пополняется в M6, сейчас — стартовый). */
  readonly reserve: number;
  /** Время перезарядки, с. */
  readonly reload: number;
  /** true — огонь удержанием (ПП), false — по нажатию. */
  readonly auto: boolean;
  /** Импульс отдачи для тряски камеры и разброса следующего выстрела. */
  readonly recoil: number;
  /** Трассер: толщина и время жизни, секунды (визуал без крови). */
  readonly tracerLife: number;
}

export const WEAPONS: Readonly<Record<WeaponId, WeaponSpec>> = {
  // Стартовый пистолет: точный, медленный, конечный боезапас не нужен.
  pistol: {
    id: 'pistol',
    label: 'Пистолет',
    damage: 14,
    rate: 3.5,
    spread: 0.02,
    pellets: 1,
    range: 48,
    mag: 12,
    reserve: 96,
    reload: 1.3,
    auto: false,
    recoil: 0.25,
    tracerLife: 0.06,
  },
  // ПП: быстрый, но разброс и урон хуже — для городских перестрелок.
  smg: {
    id: 'smg',
    label: 'ПП',
    damage: 9,
    rate: 9,
    spread: 0.05,
    pellets: 1,
    range: 40,
    mag: 30,
    reserve: 180,
    reload: 1.9,
    auto: true,
    recoil: 0.14,
    tracerLife: 0.05,
  },
  // Дробовик: шесть лучей на выстрел, короткая дистанция.
  shotgun: {
    id: 'shotgun',
    label: 'Дробовик',
    damage: 9,
    rate: 1.1,
    spread: 0.14,
    pellets: 6,
    range: 24,
    mag: 6,
    reserve: 48,
    reload: 2.3,
    auto: false,
    recoil: 0.6,
    tracerLife: 0.07,
  },
};

export const WEAPON_ORDER: readonly WeaponId[] = ['pistol', 'smg', 'shotgun'];

/** Проверка строки из отладки/сохранения на известное оружие. */
export function isWeaponId(value: string): value is WeaponId {
  return value === 'pistol' || value === 'smg' || value === 'shotgun';
}

export interface TrafficConfig {
  /** Лимит машин в городе (бриф: 60). */
  readonly maxVehicles: number;
  /** Не чаще одной волны спавна за этот интервал, с. */
  readonly spawnInterval: number;
  /** Сколько машин добавляет одна волна. */
  readonly carsPerSpawn: number;
  /** Минимальное расстояние спавна от игрока (за кадром), м. */
  readonly spawnMinDistance: number;
  /** Максимальное расстояние спавна, м. */
  readonly spawnMaxDistance: number;
  /** Дальше этого расстояния машина уходит из города, м. */
  readonly despawnDistance: number;
  /** Ближние машины считают ИИ каждый тик, м. */
  readonly nearDistance: number;
  /** Шаг ИИ для дальних машин (в тиках). */
  readonly farStride: number;
  /** Радиус безопасной зоны вокруг старта, м. */
  readonly safeRadius: number;
  /** Сколько секунд после старта зона считается безопасной, с. */
  readonly safeTime: number;
  /** Дальность упреждения по полосе, м. */
  readonly laneLookAhead: number;
  /** Множитель ограничения скорости дороги (аркадный запас). */
  readonly speedScale: number;
  /** Дистанция сканирования впереди, м. */
  readonly scanAhead: number;
  /** Габаритный запас при оценке «машина впереди», м. */
  readonly gapSkin: number;
  /** Зазор, на котором машина полностью останавливается, м. */
  readonly gapStop: number;
  /** Скорость снижается линейно с этого зазора, м. */
  readonly gapSlow: number;
  /** Зона торможения перед светофором, м. */
  readonly lightZone: number;
  /** Доля t ребра, где машина ждёт светофор. */
  readonly lightStopT: number;
  /** Полный цикл светофора, с. */
  readonly lightCycle: number;
  /** Доля цикла «зелёный по оси X». */
  readonly lightGreenShare: number;
  /** Доля цикла «жёлтый» после каждого зелёного. */
  readonly lightYellowShare: number;
  /** Радиус перекрёстка для проверки приоритета, м. */
  readonly intersectionRadius: number;
  /** Боковое смещение объезда препятствия, м. */
  readonly yieldOffset: number;
  /** Радиус реакции на сирену, м. */
  readonly sirenRadius: number;
  /** Доля скорости при объезде полиции. */
  readonly sirenSpeedFactor: number;
  /** Минимальный интервал гудка, с. */
  readonly honkInterval: number;
  /** Смещение от полосы, после которого машина ищет новое ребро, м. */
  readonly offLaneLimit: number;
  /** Цвета трафика берутся из палитры типа; индекс перемешивается сидом. */
  readonly typeWeights: readonly MotorTrafficType[];
}

/** Типы городского транспорта (без полиции — она у `wanted`). */
export type MotorTrafficType = 'sedan' | 'sports' | 'van' | 'truck';

export const TRAFFIC: TrafficConfig = {
  maxVehicles: 60,
  spawnInterval: 0.5,
  carsPerSpawn: 2,
  spawnMinDistance: 110,
  spawnMaxDistance: 220,
  despawnDistance: 240,
  nearDistance: 120,
  farStride: 2,
  safeRadius: 55,
  safeTime: 5,
  laneLookAhead: 9,
  speedScale: 0.82,
  scanAhead: 16,
  gapSkin: 1.6,
  gapStop: 4.2,
  gapSlow: 12,
  lightZone: 20,
  lightStopT: 0.9,
  lightCycle: 16,
  lightGreenShare: 0.42,
  lightYellowShare: 0.07,
  intersectionRadius: 12,
  yieldOffset: 1.7,
  sirenRadius: 45,
  sirenSpeedFactor: 0.35,
  honkInterval: 4,
  offLaneLimit: 14,
  typeWeights: ['sedan', 'sedan', 'sports', 'van', 'truck'],
};

export type PedStateName =
  | 'idle'
  | 'walk'
  | 'alert'
  | 'flee'
  | 'panic'
  | 'down'
  /** Коп пешком догоняет игрока. */
  | 'chase'
  /** Коп пешком целится/стреляет. */
  | 'aim';

export interface PedConfig {
  readonly maxPeds: number;
  readonly spawnInterval: number;
  readonly pedsPerSpawn: number;
  readonly spawnMinDistance: number;
  readonly spawnMaxDistance: number;
  readonly despawnDistance: number;
  /** Если ближних меньше nearTarget — добираем на близкой дистанции, м. */
  readonly closeSpawnDistance: number;
  /** Сколько пешеходов хотим держать рядом с игроком. */
  readonly nearTarget: number;
  /** Радиус «рядом с игроком» для nearTarget, м. */
  readonly nearRadius: number;
  /** Ближние пешеходы считают полный тик, м. */
  readonly nearDistance: number;
  /** Шаг тика для дальних пешеходов (в тиках). */
  readonly farStride: number;
  readonly safeRadius: number;
  readonly safeTime: number;
  /** Радиус капсулы пешехода (только для проверок, в хэш не вставляется). */
  readonly radius: number;
  readonly walkSpeed: number;
  readonly walkSpeedSpread: number;
  readonly fleeSpeed: number;
  readonly panicSpeed: number;
  /** Скорость бега пешего копа, м/с. */
  readonly copSpeed: number;
  /** Скорость поворота, рад/с. */
  readonly turnRate: number;
  /** Порог достижения точки маршрута, м. */
  readonly arriveDistance: number;
  /** Доля маршрутов, начинающихся с idle-стоянки. */
  readonly idleChance: number;
  readonly idleMin: number;
  readonly idleMax: number;
  readonly alertTime: number;
  readonly fleeTime: number;
  readonly panicTime: number;
  /** Сколько пешеход лежит после удара машиной, с. */
  readonly downTime: number;
  /** Вероятность перейти дорогу на углу квартала. */
  readonly crossingChance: number;
  /** Отступ тротуара внутрь квартала, м. */
  readonly sidewalkInset: number;
  /** Радиус, в котором машина считается угрозой, м. */
  readonly carThreatRadius: number;
  /** Скорость машины, при которой она сбивает пешехода, м/с. */
  readonly carHitSpeed: number;
  /** Скорострельность реакции на выстрел: радиус паники, м. */
  readonly gunshotPanicRadius: number;
  /** Радиус тревоги от выстрела (alert вместо паники), м. */
  readonly gunshotAlertRadius: number;
  /** Радиус реакции на сирену, м. */
  readonly sirenAlertRadius: number;
  /** Максимум точек маршрута в одном цикле. */
  readonly routeCapacity: number;
}

export const PEDS: PedConfig = {
  maxPeds: 200,
  spawnInterval: 0.4,
  pedsPerSpawn: 3,
  spawnMinDistance: 70,
  spawnMaxDistance: 170,
  despawnDistance: 210,
  closeSpawnDistance: 30,
  nearTarget: 10,
  nearRadius: 45,
  nearDistance: 80,
  farStride: 4,
  safeRadius: 30,
  safeTime: 5,
  radius: 0.35,
  walkSpeed: 1.35,
  walkSpeedSpread: 0.3,
  fleeSpeed: 4.4,
  panicSpeed: 5.2,
  copSpeed: 5.2,
  turnRate: 7,
  arriveDistance: 0.8,
  idleChance: 0.16,
  idleMin: 1.2,
  idleMax: 3.6,
  alertTime: 1.5,
  fleeTime: 5.5,
  panicTime: 4.5,
  downTime: 3.4,
  crossingChance: 0.35,
  sidewalkInset: 1.6,
  carThreatRadius: 7,
  carHitSpeed: 5,
  gunshotPanicRadius: 28,
  gunshotAlertRadius: 55,
  sirenAlertRadius: 40,
  routeCapacity: 8,
};

/** Преступления, повышающие розыск. Числа — очки heat. */
export type CrimeKind =
  | 'shot'
  | 'pedHit'
  | 'pedDown'
  | 'copShot'
  | 'copCarHit'
  | 'vehicleShot'
  | 'ramCop';

export interface WantedConfig {
  readonly maxCops: number;
  /** Порог очков для уровней 1..5; уровень = число пройденных порогов. */
  readonly thresholds: readonly number[];
  readonly crimes: Readonly<Record<CrimeKind, number>>;
  /** Сколько секунд после преступления heat не остывает, с. */
  readonly crimePause: number;
  /** Скорость остывания, очки/с (копы не видят игрока). */
  readonly coolRate: number;
  /** Через сколько секунд без видимости игрок считается в укрытии, с. */
  readonly coverDelay: number;
  /** Скорость сброса в укрытии, очки/с. */
  readonly coverRate: number;
  /** Радиус «коп видит игрока», м. */
  readonly seenRadius: number;
  /** Интервал попыток спавна копов, с. */
  readonly spawnInterval: number;
  readonly carSpawnMinDistance: number;
  readonly carSpawnMaxDistance: number;
  readonly footSpawnMinDistance: number;
  readonly footSpawnMaxDistance: number;
  readonly despawnDistance: number;
  /** Уровень, с которого копы таранят и делают PIT. */
  readonly aggressiveLevel: number;
  /** Уровень, с которого ставится блокпост. */
  readonly roadblockLevel: number;
  /** Уровень, с которого перехват идёт наперерез. */
  readonly interceptLevel: number;
  /** Дистанция PIT, м. */
  readonly pitRange: number;
  /** Угол «сзади-сбоку» для PIT, радианы. */
  readonly pitAngle: number;
  /** Дистанция тарана, м. */
  readonly ramRange: number;
  /** Радиус ареста пешего игрока, м. */
  readonly arrestRadius: number;
  /** Максимальная скорость игрока для ареста, м/с. */
  readonly arrestSpeed: number;
  /** Запас скорости копов относительно игрока. */
  readonly chaseSpeedFactor: number;
  /** Сколько копов едет за игроком на каждом уровне (кроме блокпоста). */
  readonly carsPerLevel: readonly number[];
  /** Сколько пеших копов на уровне (0 — никто не выходит). */
  readonly footPerLevel: readonly number[];
  /** Оружие копов и их точность (0..1, доля попаданий при прицеливании). */
  readonly copWeapon: WeaponId;
  readonly copAccuracy: number;
  readonly copFireRange: number;
  readonly copFireInterval: number;
  readonly copDamageScale: number;
  readonly playerHealth: number;
  /** Регенерация здоровья игрока, очки/с, после паузы без урона. */
  readonly healthRegen: number;
  readonly healthRegenDelay: number;
  /** Сколько секунд пеший коп живёт вне зоны видимости, прежде чем уехать. */
  readonly footLifetime: number;
}

export const WANTED: WantedConfig = {
  maxCops: 8,
  thresholds: [7, 18, 34, 56, 82],
  crimes: {
    shot: 6,
    pedHit: 5,
    pedDown: 12,
    copShot: 16,
    copCarHit: 10,
    vehicleShot: 2,
    ramCop: 10,
  },
  crimePause: 7,
  coolRate: 1.4,
  coverDelay: 9,
  coverRate: 14,
  seenRadius: 140,
  spawnInterval: 2.5,
  carSpawnMinDistance: 35,
  carSpawnMaxDistance: 55,
  footSpawnMinDistance: 35,
  footSpawnMaxDistance: 70,
  despawnDistance: 220,
  aggressiveLevel: 2,
  roadblockLevel: 3,
  interceptLevel: 4,
  pitRange: 9,
  pitAngle: 0.9,
  ramRange: 5,
  arrestRadius: 3.2,
  arrestSpeed: 1.8,
  chaseSpeedFactor: 1.02,
  carsPerLevel: [0, 1, 2, 3, 4, 5],
  footPerLevel: [0, 0, 1, 2, 3, 3],
  copWeapon: 'pistol',
  copAccuracy: 0.9,
  copFireRange: 32,
  copFireInterval: 1.5,
  copDamageScale: 1,
  playerHealth: 100,
  healthRegen: 1.2,
  healthRegenDelay: 8,
  footLifetime: 45,
};

/** Готовый блок конфига жизни: одна точка входа для систем и отладки. */
export const LIFE = {
  traffic: TRAFFIC,
  peds: PEDS,
  wanted: WANTED,
  weapons: WEAPONS,
} as const;
