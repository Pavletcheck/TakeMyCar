// ---------------------------------------------------------------------------
// Формат авторской карты города (M3.5). Это ДАННЫЕ, а не генератор:
// планировка целиком лежит в assets/maps/city.json, код только читает её,
// валидирует и превращает в World.
//
// Координаты — метры в плоскости XZ, начало в центре карты, +X — восток,
// +Z — юг. `heading` — угол в соглашении игры: atan2(dirX, dirZ).
//
// Префабы застройки нормированы: x/z — доли половин квартала, w/d — доли
// полной стороны плиты, h — метры. Поэтому один префаб масштабируется под
// квартал любого размера без случайных решений.
// ---------------------------------------------------------------------------

import type { BlockKind, DistrictId } from '../config/world';
import type { PropKind } from './types';

export type MapVersion = 1;

/** Класс дороги: задаёт ширину, скорость, светофоры и вид на мини-карте. */
export type RoadClass = 'ring' | 'arterial' | 'street' | 'boulevard' | 'bridge';

/** Прямоугольник в плоскости XZ: центр и половины сторон. */
export interface MapRect {
  readonly x: number;
  readonly z: number;
  readonly hx: number;
  readonly hz: number;
}

/** Район города. `id` совпадает с DistrictId из config/world. */
export interface District {
  readonly id: DistrictId;
  readonly name: string;
  readonly bounds: MapRect;
}

/**
 * Дорога карты: осевая линия из ≥2 точек. Узлы графа ставятся на концах
 * отрезков и в пересечениях, полосы считаются из `width`.
 */
export interface RoadSegment {
  readonly id: string;
  readonly kind: RoadClass;
  readonly points: readonly (readonly [number, number])[];
  /** Ширина проезжей части, м. */
  readonly width: number;
  /** Ограничение скорости, м/с. */
  readonly speed: number;
  /** Магистраль: светофоры на перекрёстках, приоритет у трафика. */
  readonly arterial: boolean;
  /** true — движение только по направлению точек полилинии. */
  readonly oneWay: boolean;
  /** Полос в одном направлении; вычисляется из width при загрузке. */
  readonly lanes: number;
}

/** Здание внутри префаба: нормированные габариты, абсолютная высота. */
export interface BuildingSpec {
  readonly x: number;
  readonly z: number;
  readonly w: number;
  readonly d: number;
  readonly h: number;
  readonly color: number;
  readonly roofColor: number;
}

/** Пропс: в префабе координаты нормированы, в CityMap.props — мировые. */
export interface PropSpec {
  readonly kind: PropKind;
  readonly x: number;
  readonly z: number;
  readonly heading: number;
  readonly variant: number;
  readonly scale: number;
}

/** Префаб застройки квартала: фиксированный набор коробок и пропсов. */
export interface PrefabSpec {
  readonly id: string;
  /** Цвет плиты квартала; если нет — берётся из типа квартала. */
  readonly plate?: number;
  readonly buildings: readonly BuildingSpec[];
  readonly props: readonly PropSpec[];
}

/** Квартал: явный прямоугольник, тип и закреплённый префаб застройки. */
export interface BlockSpec {
  readonly id: string;
  readonly rect: MapRect;
  readonly district: DistrictId;
  readonly kind: BlockKind;
  readonly prefab: string;
}

export type LandmarkKind = 'garage' | 'police' | 'hospital' | 'stadium' | 'mall' | 'docks' | 'bridge';

/** Ориентир города: смысловая точка на карте (иконки рисует UI). */
export interface Landmark {
  readonly id: string;
  readonly kind: LandmarkKind;
  readonly name: string;
  readonly x: number;
  readonly z: number;
  readonly radius: number;
}

export type MissionKind = 'pickup' | 'delivery' | 'race';

/** Якорь миссии: место, к которому привязывается контент из ui/life. */
export interface MissionAnchor {
  readonly id: string;
  readonly kind: MissionKind;
  readonly name: string;
  readonly x: number;
  readonly z: number;
  readonly radius: number;
}

/** Точка спавна в данных карты. */
export interface MapSpawn {
  readonly x: number;
  readonly z: number;
  readonly heading: number;
}

export interface MapSpawns {
  /** Старт игрока: обязан лежать на проезжей части. */
  readonly player: MapSpawn;
  readonly cars: readonly MapSpawn[];
  readonly peds: readonly MapSpawn[];
  readonly cops: readonly MapSpawn[];
}

/** Загруженная и проверенная карта города. */
export interface CityMap {
  readonly version: MapVersion;
  readonly id: string;
  readonly name: string;
  /** Константа карты для логов и реплеев; на планировку не влияет. */
  readonly seed: number;
  /** Сторона карты, м. */
  readonly size: number;
  /** Сторона чанка стриминга, м. */
  readonly chunkSize: number;
  /** Номинальная ширина полосы, м — из неё выводятся полосы дорог. */
  readonly laneWidth: number;
  readonly districts: readonly District[];
  readonly water: readonly MapRect[];
  readonly roads: readonly RoadSegment[];
  readonly prefabs: readonly PrefabSpec[];
  readonly blocks: readonly BlockSpec[];
  readonly landmarks: readonly Landmark[];
  readonly missions: readonly MissionAnchor[];
  readonly spawns: MapSpawns;
  /** Пропсы вне кварталов: набережная, мост, бульвар, доки. */
  readonly props: readonly PropSpec[];
}
