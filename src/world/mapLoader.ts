// ---------------------------------------------------------------------------
// Загрузчик авторской карты: JSON из assets/maps → проверенный CityMap.
// Структура данных проверяется здесь, содержимое (дороги, здания, спавны) —
// в mapValidator. Ошибки формата бросаются сразу: битая карта не доходит
// до сборки мира.
// ---------------------------------------------------------------------------

import rawCity from '../../assets/maps/city.json';
import type { BlockKind, DistrictId } from '../config/world';
import { PROP_DEFS } from './props';
import type {
  BuildingSpec,
  CityMap,
  District,
  Landmark,
  LandmarkKind,
  MapRect,
  MapSpawn,
  MapSpawns,
  MissionAnchor,
  MissionKind,
  PrefabSpec,
  PropSpec,
  RoadClass,
  RoadSegment,
} from './mapTypes';
import type { PropKind } from './types';
import { validateCityMap } from './mapValidator';

/** Доступные карты по идентификатору (`?map=city`). */
const MAP_SOURCES: Readonly<Record<string, unknown>> = {
  city: rawCity,
};

export const DEFAULT_MAP_ID = 'city';

const DISTRICT_IDS: readonly DistrictId[] = ['center', 'industrial', 'waterfront'];
const BLOCK_KINDS: readonly BlockKind[] = ['build', 'park', 'parking', 'promenade'];
const ROAD_CLASSES: readonly RoadClass[] = ['ring', 'arterial', 'street', 'boulevard', 'bridge'];
const LANDMARK_KINDS: readonly LandmarkKind[] = [
  'garage',
  'police',
  'hospital',
  'stadium',
  'mall',
  'docks',
  'bridge',
];
const MISSION_KINDS: readonly MissionKind[] = ['pickup', 'delivery', 'race'];

type Raw = Record<string, unknown>;

function fail(where: string, message: string): never {
  throw new Error(`CityMap: ${where}: ${message}`);
}

function asRecord(value: unknown, where: string): Raw {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    fail(where, 'ожидался объект');
  }
  return value as Raw;
}

function asArray(value: unknown, where: string): unknown[] {
  if (!Array.isArray(value)) fail(where, 'ожидался массив');
  return value;
}

function asString(value: unknown, where: string): string {
  if (typeof value !== 'string' || value.length === 0) fail(where, 'ожидалась непустая строка');
  return value;
}

function asNumber(value: unknown, where: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) fail(where, 'ожидалось число');
  return value;
}

function optNumber(value: unknown, where: string, fallback: number): number {
  if (value === undefined) return fallback;
  return asNumber(value, where);
}

function optBoolean(value: unknown, where: string, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  if (typeof value !== 'boolean') fail(where, 'ожидалось true/false');
  return value;
}

/** Цвет в JSON — hex-строка "#rrggbb" или число 0xrrggbb. */
function asColor(value: unknown, where: string): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value >>> 0;
  if (typeof value === 'string') {
    const text = value.trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(text)) fail(where, `неверный цвет "${value}"`);
    return Number.parseInt(text.slice(1), 16) >>> 0;
  }
  return fail(where, 'ожидался цвет "#rrggbb"');
}

function asEnum<T extends string>(value: unknown, allowed: readonly T[], where: string): T {
  const text = asString(value, where);
  for (let i = 0; i < allowed.length; i += 1) {
    if (allowed[i] === text) return allowed[i];
  }
  return fail(where, `неизвестное значение "${text}" (допустимо: ${allowed.join(', ')})`);
}

function parseRect(value: unknown, where: string): MapRect {
  const raw = asRecord(value, where);
  return {
    x: asNumber(raw.x, `${where}.x`),
    z: asNumber(raw.z, `${where}.z`),
    hx: asNumber(raw.hx, `${where}.hx`),
    hz: asNumber(raw.hz, `${where}.hz`),
  };
}

function parseDistrict(value: unknown, where: string): District {
  const raw = asRecord(value, where);
  return {
    id: asEnum(raw.id, DISTRICT_IDS, `${where}.id`),
    name: asString(raw.name, `${where}.name`),
    bounds: parseRect(raw.bounds, `${where}.bounds`),
  };
}

function parseRoad(value: unknown, where: string, laneWidth: number): RoadSegment {
  const raw = asRecord(value, where);
  const points = asArray(raw.points, `${where}.points`).map((point, index) => {
    const pair = asArray(point, `${where}.points[${index}]`);
    if (pair.length !== 2) fail(`${where}.points[${index}]`, 'ожидалась пара [x, z]');
    return [
      asNumber(pair[0], `${where}.points[${index}][0]`),
      asNumber(pair[1], `${where}.points[${index}][1]`),
    ] as const;
  });
  const width = asNumber(raw.width, `${where}.width`);
  const lanes = Math.min(3, Math.max(1, Math.round(width / (2 * laneWidth))));
  return {
    id: asString(raw.id, `${where}.id`),
    kind: asEnum(raw.kind, ROAD_CLASSES, `${where}.kind`),
    points,
    width,
    speed: asNumber(raw.speed, `${where}.speed`),
    arterial: optBoolean(raw.arterial, `${where}.arterial`, false),
    oneWay: optBoolean(raw.oneWay, `${where}.oneWay`, false),
    lanes,
  };
}

function parseProp(value: unknown, where: string): PropSpec {
  const raw = asRecord(value, where);
  const kindText = asString(raw.kind, `${where}.kind`);
  if (!(kindText in PROP_DEFS)) fail(`${where}.kind`, `неизвестный пропс "${kindText}"`);
  const kind = kindText as PropKind;
  const variants = PROP_DEFS[kind].variants.length;
  const variant = Math.trunc(optNumber(raw.variant, `${where}.variant`, 0));
  if (variant < 0 || variant >= variants) fail(`${where}.variant`, `у "${kind}" ${variants} вариантов`);
  return {
    kind,
    x: asNumber(raw.x, `${where}.x`),
    z: asNumber(raw.z, `${where}.z`),
    heading: optNumber(raw.heading, `${where}.heading`, 0),
    variant,
    scale: optNumber(raw.scale, `${where}.scale`, 1),
  };
}

function parsePrefab(value: unknown, where: string): PrefabSpec {
  const raw = asRecord(value, where);
  const buildings = asArray(raw.buildings ?? [], `${where}.buildings`).map((item, index) => {
    const b = asRecord(item, `${where}.buildings[${index}]`);
    const at = `${where}.buildings[${index}]`;
    const building: BuildingSpec = {
      x: asNumber(b.x, `${at}.x`),
      z: asNumber(b.z, `${at}.z`),
      w: asNumber(b.w, `${at}.w`),
      d: asNumber(b.d, `${at}.d`),
      h: asNumber(b.h, `${at}.h`),
      color: asColor(b.color, `${at}.color`),
      roofColor: asColor(b.roof, `${at}.roof`),
    };
    return building;
  });
  const props = asArray(raw.props ?? [], `${where}.props`).map((item, index) =>
    parseProp(item, `${where}.props[${index}]`),
  );
  return {
    id: asString(raw.id, `${where}.id`),
    plate: raw.plate === undefined ? undefined : asColor(raw.plate, `${where}.plate`),
    buildings,
    props,
  };
}

function parseLandmark(value: unknown, where: string): Landmark {
  const raw = asRecord(value, where);
  return {
    id: asString(raw.id, `${where}.id`),
    kind: asEnum(raw.kind, LANDMARK_KINDS, `${where}.kind`),
    name: asString(raw.name, `${where}.name`),
    x: asNumber(raw.x, `${where}.x`),
    z: asNumber(raw.z, `${where}.z`),
    radius: asNumber(raw.radius, `${where}.radius`),
  };
}

function parseMission(value: unknown, where: string): MissionAnchor {
  const raw = asRecord(value, where);
  return {
    id: asString(raw.id, `${where}.id`),
    kind: asEnum(raw.kind, MISSION_KINDS, `${where}.kind`),
    name: asString(raw.name, `${where}.name`),
    x: asNumber(raw.x, `${where}.x`),
    z: asNumber(raw.z, `${where}.z`),
    radius: asNumber(raw.radius, `${where}.radius`),
  };
}

function parseSpawn(value: unknown, where: string): MapSpawn {
  const raw = asRecord(value, where);
  return {
    x: asNumber(raw.x, `${where}.x`),
    z: asNumber(raw.z, `${where}.z`),
    heading: optNumber(raw.heading, `${where}.heading`, 0),
  };
}

function parseSpawnList(value: unknown, where: string): MapSpawn[] {
  if (value === undefined) return [];
  return asArray(value, where).map((item, index) => parseSpawn(item, `${where}[${index}]`));
}

function parseSpawns(value: unknown, where: string): MapSpawns {
  const raw = asRecord(value, where);
  return {
    player: parseSpawn(raw.player, `${where}.player`),
    cars: parseSpawnList(raw.cars, `${where}.cars`),
    peds: parseSpawnList(raw.peds, `${where}.peds`),
    cops: parseSpawnList(raw.cops, `${where}.cops`),
  };
}

/** Разбирает объект карты из JSON. Не бросает на «почти верных» данных молча. */
export function parseCityMap(source: unknown, where = 'map'): CityMap {
  const raw = asRecord(source, where);
  const version = asNumber(raw.version, `${where}.version`);
  if (version !== 1) fail(`${where}.version`, `неподдерживаемая версия ${version}`);
  const laneWidth = asNumber(raw.laneWidth, `${where}.laneWidth`);
  const prefabs = asArray(raw.prefabs, `${where}.prefabs`).map((item, index) =>
    parsePrefab(item, `${where}.prefabs[${index}]`),
  );
  const blocks = asArray(raw.blocks, `${where}.blocks`).map((item, index) => {
    const block = asRecord(item, `${where}.blocks[${index}]`);
    const at = `${where}.blocks[${index}]`;
    return {
      id: asString(block.id, `${at}.id`),
      rect: parseRect(block.rect, `${at}.rect`),
      district: asEnum(block.district, DISTRICT_IDS, `${at}.district`),
      kind: asEnum(block.kind, BLOCK_KINDS, `${at}.kind`),
      prefab: asString(block.prefab, `${at}.prefab`),
    };
  });

  return {
    version: 1,
    id: asString(raw.id, `${where}.id`),
    name: asString(raw.name, `${where}.name`),
    seed: asNumber(raw.seed, `${where}.seed`) >>> 0,
    size: asNumber(raw.size, `${where}.size`),
    chunkSize: asNumber(raw.chunkSize, `${where}.chunkSize`),
    laneWidth,
    districts: asArray(raw.districts, `${where}.districts`).map((item, index) =>
      parseDistrict(item, `${where}.districts[${index}]`),
    ),
    water: asArray(raw.water ?? [], `${where}.water`).map((item, index) =>
      parseRect(item, `${where}.water[${index}]`),
    ),
    roads: asArray(raw.roads, `${where}.roads`).map((item, index) =>
      parseRoad(item, `${where}.roads[${index}]`, laneWidth),
    ),
    prefabs,
    blocks,
    landmarks: asArray(raw.landmarks ?? [], `${where}.landmarks`).map((item, index) =>
      parseLandmark(item, `${where}.landmarks[${index}]`),
    ),
    missions: asArray(raw.missions ?? [], `${where}.missions`).map((item, index) =>
      parseMission(item, `${where}.missions[${index}]`),
    ),
    spawns: parseSpawns(raw.spawns, `${where}.spawns`),
    props: asArray(raw.props ?? [], `${where}.props`).map((item, index) =>
      parseProp(item, `${where}.props[${index}]`),
    ),
  };
}

/**
 * Загружает карту по идентификатору (`city`), проверяет её целиком и
 * возвращает готовые данные. Бросает Error с причиной, если карта битая.
 */
export function loadCityMap(id = DEFAULT_MAP_ID): CityMap {
  const source = MAP_SOURCES[id];
  if (!source) {
    throw new Error(
      `CityMap: неизвестная карта "${id}" (доступно: ${Object.keys(MAP_SOURCES).join(', ')})`,
    );
  }
  const map = parseCityMap(source, id);
  validateCityMap(map);
  return map;
}
