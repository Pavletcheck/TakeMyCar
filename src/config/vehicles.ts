// ---------------------------------------------------------------------------
// M4. Транспорт: 5 типов машин и константы аркадной модели.
// Числа баланса живут только здесь, физика их читает (AGENTS §5).
//
// Ощущения седана намеренно повторяют прежний CAR_TUNING из bootstrap:
//   accel 22, brake 34, maxSpeed 30, maxReverse 9, steerRate 2.6,
//   grip 6.5, handbrakeGrip 0.8.
// Так M4 выносит машину в систему, не меняя управление без причины.
// ---------------------------------------------------------------------------

export type VehicleTypeId = 'sedan' | 'sports' | 'van' | 'truck' | 'police';

export interface VehicleConfig {
  /** Идентификатор типа — ключ конфига и данных. */
  readonly id: VehicleTypeId;
  /** Отображаемое имя (M6 вынесет в словари ru/en/tr). */
  readonly label: string;
  /** Масса, кг: влияет на получаемый урон и импульс соседям. */
  readonly mass: number;
  /** Ускорение газа, м/с². */
  readonly accel: number;
  /** Максимальная скорость вперёд, м/с. */
  readonly maxSpeed: number;
  /** Максимальная скорость задним ходом, м/с. */
  readonly maxReverse: number;
  /** Скорость поворота на полном сцеплении, рад/с. */
  readonly steerRate: number;
  /** Боковое трение: 1/с, чем больше — тем жёстче держит дорогу. */
  readonly grip: number;
  /** Боковое трение с ручником: низкое значение = занос. */
  readonly handbrakeGrip: number;
  /** Тормозное замедление, м/с². */
  readonly brake: number;
  /** Запас прочности, единиц. */
  readonly hp: number;
  /** Число мест (для посадки пассажиров в M5+). */
  readonly seats: number;
  /** Длина кузова вдоль локальной оси Z, м. */
  readonly length: number;
  /** Ширина кузова вдоль локальной оси X, м. */
  readonly width: number;
  /** Высота кузова, м (визуал и точка дыма). */
  readonly height: number;
  /** Палитра кузова; первый цвет — цвет по умолчанию. */
  readonly colors: readonly number[];
}

/**
 * Радиус коллайдера машины. Формула от габаритов: для седана 4.4×1.9
 * даёт 1.798 ≈ прежний CAR_RADIUS = 1.8, поэтому столкновения не «поехали».
 */
export function vehicleColliderRadius(config: VehicleConfig): number {
  return Math.hypot(config.width, config.length) * 0.375;
}

/**
 * Проверка maxSpeed (BUG-M4-002). В модели установившаяся скорость
 *   v∞ = (accel − rollingResistance) / drag = (accel − 2.2) / 0.55.
 * Все типы должны иметь v∞ > maxSpeed, иначе кламп недостижим:
 *   sedan   (22.0 − 2.2)/0.55 = 36.0 > 30
 *   sports  (30.0 − 2.2)/0.55 = 50.5 > 38
 *   van     (17.0 − 2.2)/0.55 = 26.9 > 24
 *   truck   (13.5 − 2.2)/0.55 = 20.5 > 19
 *   police  (26.0 − 2.2)/0.55 = 43.3 > 34
 * Время выхода на maxSpeed: t = −ln(1 − maxSpeed/v∞)/drag, от 2.5 до 4.7 с.
 */
export const VEHICLES: Readonly<Record<VehicleTypeId, VehicleConfig>> = {
  // Спокойный, предсказуемый, прощает ошибки. Эталон ощущений.
  sedan: {
    id: 'sedan',
    label: 'Седан',
    mass: 1200,
    accel: 22,
    maxSpeed: 30,
    maxReverse: 9,
    steerRate: 2.6,
    grip: 6.5,
    handbrakeGrip: 0.8,
    brake: 34,
    hp: 100,
    seats: 4,
    length: 4.4,
    width: 1.9,
    height: 1.35,
    colors: [0xff5c5c, 0x4dabf7, 0xe6edf3, 0x51cf66, 0xffd43b, 0x845ef7],
  },

  // Нервный: быстрее разгон, острее руль, хуже держит занос.
  sports: {
    id: 'sports',
    label: 'Спорткар',
    mass: 1000,
    accel: 30,
    maxSpeed: 38,
    maxReverse: 10,
    steerRate: 3.1,
    grip: 7.2,
    handbrakeGrip: 0.55,
    brake: 38,
    hp: 90,
    seats: 2,
    length: 4.3,
    width: 1.95,
    height: 1.12,
    colors: [0xff3b30, 0xffd60a, 0x30d158, 0x0a84ff, 0xf5f5f7],
  },

  // Валкий: высокая масса, раннее ограничение скорости, вязкий руль.
  van: {
    id: 'van',
    label: 'Фургон',
    mass: 1800,
    accel: 17,
    maxSpeed: 24,
    maxReverse: 8,
    steerRate: 2.05,
    grip: 5.6,
    handbrakeGrip: 0.9,
    brake: 28,
    hp: 130,
    seats: 6,
    length: 5.2,
    width: 2.1,
    height: 2.1,
    colors: [0xadb5bd, 0x74c0fc, 0xffa94d, 0xced4da],
  },

  // Тяжёлый: медленный, но живучий и сносит всё.
  // accel 13.5 — не «характер», а требование модели: установившаяся скорость
  // (accel − rollingResistance) / drag = (13.5 − 2.2) / 0.55 ≈ 20.5 м/с,
  // поэтому грузовик реально выходит на maxSpeed 19 (BUG-M4-002).
  truck: {
    id: 'truck',
    label: 'Грузовик',
    mass: 3200,
    accel: 13.5,
    maxSpeed: 19,
    maxReverse: 7,
    steerRate: 1.6,
    grip: 4.8,
    handbrakeGrip: 1.0,
    brake: 22,
    hp: 190,
    seats: 2,
    length: 7,
    width: 2.4,
    height: 2.6,
    colors: [0x8b93a1, 0xd9480f, 0x495057, 0xf08c00],
  },

  // Полицейская: между седаном и спортом, усиленный кузов.
  police: {
    id: 'police',
    label: 'Полицейская машина',
    mass: 1350,
    accel: 26,
    maxSpeed: 34,
    maxReverse: 9,
    steerRate: 2.8,
    grip: 7,
    handbrakeGrip: 0.7,
    brake: 36,
    hp: 120,
    seats: 4,
    length: 4.6,
    width: 1.95,
    height: 1.42,
    colors: [0xe6edf3, 0x1b263b],
  },
};

export const VEHICLE_TYPES: readonly VehicleTypeId[] = ['sedan', 'sports', 'van', 'truck', 'police'];

export const DEFAULT_VEHICLE_TYPE: VehicleTypeId = 'sedan';

/** Проверка строки из отладки/данных на известный тип. */
export function isVehicleType(value: string): value is VehicleTypeId {
  return value === 'sedan' || value === 'sports' || value === 'van' || value === 'truck' || value === 'police';
}

/**
 * Общая аркадная модель. Значения подобраны под прежнее поведение из
 * bootstrap (drag 0.55, rolling 2.2, reverse 0.65, steerRef 6) — не менять
 * без отдельного решения по ощущениям.
 */
export const VEHICLE_HANDLING = {
  /** Аэродинамическое сопротивление, 1/с. */
  drag: 0.55,
  /** Сопротивление качению, м/с². */
  rollingResistance: 2.2,
  /** Доля ускорения задним ходом от accel. */
  reverseAccel: 0.65,
  /** Скорость, на которой руль выходит на полную эффективность, м/с. */
  steerSpeedRef: 6,
  /** Минимальная нормальная скорость удара для урона, м/с. */
  impactMinSpeed: 2.5,
  /** Урон на каждый м/с сверх порога. */
  impactDamagePerSpeed: 4.5,
  /** Доля урона, передаваемая второй машине в контакте. */
  impactTransfer: 0.55,
  /** Доля скорости удара, уходящая в толчок соседней машины. */
  impactPush: 0.35,
  /** Порог дыма: hp / maxHp. */
  smokeRatio: 0.3,
  /** Отступ от границ мира для корпуса, м (сверх радиуса). */
  boundsMargin: 1.5,
  /** Ниже этой скорости машина без ввода считается стоящей. */
  parkedSpeed: 0.02,
  /** Эталонная масса для масштаба урона. */
  referenceMass: 1200,
  /** Пределы масштаба урона по массе. */
  damageScaleMin: 0.55,
  damageScaleMax: 1.6,
} as const;
