// ---------------------------------------------------------------------------
// Сборка layout из авторской карты: границы, кварталы, дорожный граф, вода,
// мини-карта, раскладка пропсов по чанкам и точки старта.
//
// Планировка целиком определяется assets/maps/city.json: здесь нет ни RNG,
// ни хэшей, поэтому layoutHash одинаков при каждом запуске.
// ---------------------------------------------------------------------------

import type { Collider } from '../core/math';
import type { WorldConfig } from '../config/world';
import { chunkCoordOf, chunkKey } from './coords';
import type { BlockSpec, CityMap, PrefabSpec } from './mapTypes';
import { buildMinimap } from './minimap';
import {
  clearBlockContent,
  createBlockContent,
  createProp,
  createPropCollider,
  expandPrefab,
  plateColorOf,
} from './prefab';
import { buildRoadGraphFromMap } from './roadGraph';
import type { Bounds, MinimapData, MinimapRect, PropInstance, RoadGraph, SpawnPoint } from './types';

/** Полный layout мира: всё, что нужно стримингу, спавну и мини-карте. */
export interface CityLayout {
  readonly config: WorldConfig;
  readonly map: CityMap;
  readonly seed: number;
  readonly bounds: Bounds;
  readonly chunkSize: number;
  readonly blocks: readonly BlockSpec[];
  readonly prefabs: ReadonlyMap<string, PrefabSpec>;
  readonly roadGraph: RoadGraph;
  readonly minimap: MinimapData;
  readonly water: readonly MinimapRect[];
  /** Индексы кварталов по ключу чанка (центр квартала внутри чанка). */
  readonly chunkBlocks: ReadonlyMap<number, readonly number[]>;
  /** Пропсы вне кварталов (набережная, мост, доки) по чанкам. */
  readonly chunkProps: ReadonlyMap<number, readonly PropInstance[]>;
  /** Коллайдеры этих пропсов; id выдаёт стриминг при загрузке чанка. */
  readonly chunkPropColliders: ReadonlyMap<number, readonly Collider[]>;
  readonly defaultSpawn: SpawnPoint;
  /** Явные точки спавна из данных карты (машины, пешеходы, копы). */
  readonly extraSpawns: readonly SpawnPoint[];
}

function bucketOf<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  let list = map.get(key);
  if (!list) {
    list = [];
    map.set(key, list);
  }
  list.push(value);
}

/** Строит layout по карте. Ничего не генерирует: только раскладывает данные. */
export function buildCityLayout(map: CityMap, config: WorldConfig): CityLayout {
  if (map.chunkSize !== config.chunkSize) {
    throw new Error(
      `CityLayout: chunkSize карты (${map.chunkSize}) не совпадает с конфигом (${config.chunkSize})`,
    );
  }

  const half = map.size / 2;
  const bounds: Bounds = { minX: -half, minZ: -half, maxX: half, maxZ: half };
  const chunkSize = map.chunkSize;

  const prefabs = new Map<string, PrefabSpec>();
  for (let i = 0; i < map.prefabs.length; i += 1) prefabs.set(map.prefabs[i].id, map.prefabs[i]);

  const blocks = map.blocks;
  const roadGraph = buildRoadGraphFromMap(map);
  const water: MinimapRect[] = map.water.map((rect) => ({
    x: rect.x,
    z: rect.z,
    hx: rect.hx,
    hz: rect.hz,
  }));

  const minimap = buildMinimap(
    bounds,
    blocks.map((block) => ({
      x: block.rect.x,
      z: block.rect.z,
      hx: block.rect.hx,
      hz: block.rect.hz,
      district: block.district,
      kind: block.kind,
    })),
    roadGraph,
    water,
  );

  const chunkBlocks = new Map<number, number[]>();
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    const key = chunkKey(
      chunkCoordOf(block.rect.x, chunkSize),
      chunkCoordOf(block.rect.z, chunkSize),
    );
    bucketOf(chunkBlocks, key, i);
  }

  const chunkProps = new Map<number, PropInstance[]>();
  const chunkPropColliders = new Map<number, Collider[]>();
  for (let i = 0; i < map.props.length; i += 1) {
    const spec = map.props[i];
    const key = chunkKey(chunkCoordOf(spec.x, chunkSize), chunkCoordOf(spec.z, chunkSize));
    bucketOf(chunkProps, key, createProp(spec));
    const collider = createPropCollider(spec);
    if (collider) bucketOf(chunkPropColliders, key, collider);
  }

  const player = map.spawns.player;
  const defaultSpawn: SpawnPoint = { x: player.x, z: player.z, heading: player.heading, tag: 'car' };

  const extraSpawns: SpawnPoint[] = [];
  for (let i = 0; i < map.spawns.cars.length; i += 1) {
    const spawn = map.spawns.cars[i];
    extraSpawns.push({ x: spawn.x, z: spawn.z, heading: spawn.heading, tag: 'car' });
  }
  for (let i = 0; i < map.spawns.peds.length; i += 1) {
    const spawn = map.spawns.peds[i];
    extraSpawns.push({ x: spawn.x, z: spawn.z, heading: spawn.heading, tag: 'ped' });
  }
  for (let i = 0; i < map.spawns.cops.length; i += 1) {
    const spawn = map.spawns.cops[i];
    extraSpawns.push({ x: spawn.x, z: spawn.z, heading: spawn.heading, tag: 'cop' });
  }

  return {
    config,
    map,
    seed: map.seed,
    bounds,
    chunkSize,
    blocks,
    prefabs,
    roadGraph,
    minimap,
    water,
    chunkBlocks,
    chunkProps,
    chunkPropColliders,
    defaultSpawn,
    extraSpawns,
  };
}

// ---------------------------------------------------------------------------
// Хэш планировки
// ---------------------------------------------------------------------------

const HASH_QUANT = 1000;

function quant(value: number): number {
  return Math.round(value * HASH_QUANT);
}

/**
 * FNV-1a по отсортированным квантованным записям.
 * Карта фиксирована, поэтому одинаковый набор данных обязан дать один и тот же
 * hash, а любая правка city.json — другой.
 */
export function computeLayoutHash(layout: CityLayout): number {
  const records: string[] = [`m|${layout.map.id}|${quant(layout.map.size)}`];
  const content = createBlockContent();

  const blocks = layout.blocks.slice().sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    const prefab = layout.prefabs.get(block.prefab);
    if (!prefab) throw new Error(`CityLayout: у квартала "${block.id}" нет префаба "${block.prefab}"`);
    records.push(
      `b|${block.id}|${quant(block.rect.x)}|${quant(block.rect.z)}|${quant(block.rect.hx)}|` +
        `${quant(block.rect.hz)}|${block.district}|${block.kind}|${block.prefab}`,
    );
    clearBlockContent(content);
    expandPrefab(prefab, block, prefab.plate ?? plateColorOf(block.kind, layout.config), content);
    for (let p = 0; p < content.plates.length; p += 1) {
      const plate = content.plates[p];
      records.push(`p|${quant(plate.x)}|${quant(plate.z)}|${quant(plate.w)}|${quant(plate.d)}|${plate.color}`);
    }
    for (let b = 0; b < content.buildings.length; b += 1) {
      const building = content.buildings[b];
      records.push(
        `s|${quant(building.x)}|${quant(building.z)}|${quant(building.w)}|${quant(building.d)}|` +
          `${quant(building.h)}|${building.color}|${building.roofColor}`,
      );
    }
    for (let p = 0; p < content.props.length; p += 1) {
      const prop = content.props[p];
      records.push(
        `r|${prop.kind}|${quant(prop.x)}|${quant(prop.z)}|${quant(prop.heading)}|` +
          `${quant(prop.scale)}|${prop.variant}`,
      );
    }
  }

  for (let i = 0; i < layout.roadGraph.nodes.length; i += 1) {
    const node = layout.roadGraph.nodes[i];
    records.push(
      `n|${node.id}|${quant(node.x)}|${quant(node.z)}|${node.kind}|${node.lights ? 1 : 0}|` +
        `${node.lightPhase === undefined ? '' : quant(node.lightPhase)}`,
    );
  }
  for (let i = 0; i < layout.roadGraph.edges.length; i += 1) {
    const edge = layout.roadGraph.edges[i];
    records.push(
      `e|${edge.from}|${edge.to}|${edge.lanes}|${quant(edge.speed)}|${edge.oneWay ? 1 : 0}|` +
        `${edge.arterial ? 1 : 0}`,
    );
  }
  for (let i = 0; i < layout.water.length; i += 1) {
    const rect = layout.water[i];
    records.push(`w|${quant(rect.x)}|${quant(rect.z)}|${quant(rect.hx)}|${quant(rect.hz)}`);
  }

  records.sort();
  let hash = 0x811c9dc5;
  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    for (let c = 0; c < record.length; c += 1) {
      hash ^= record.charCodeAt(c);
      hash = Math.imul(hash, 0x01000193);
    }
  }
  return hash >>> 0;
}

/** Счётчики для отчёта и `?debug=1`. */
export interface LayoutInfo {
  blocks: number;
  roads: number;
  landmarks: number;
  nodes: number;
  edges: number;
  lights: number;
  buildings: number;
  props: number;
}

/** Числа карты: считаются один раз при первом запросе диагностики. */
export function describeLayout(layout: CityLayout): LayoutInfo {
  const content = createBlockContent();
  let buildings = 0;
  for (let i = 0; i < layout.blocks.length; i += 1) {
    const block = layout.blocks[i];
    const prefab = layout.prefabs.get(block.prefab);
    if (!prefab) continue;
    clearBlockContent(content);
    expandPrefab(prefab, block, 0, content);
    buildings += content.buildings.length;
  }
  let props = layout.map.props.length;
  for (let i = 0; i < layout.blocks.length; i += 1) {
    const prefab = layout.prefabs.get(layout.blocks[i].prefab);
    if (prefab) props += prefab.props.length;
  }
  return {
    blocks: layout.blocks.length,
    roads: layout.map.roads.length,
    landmarks: layout.map.landmarks.length,
    nodes: layout.roadGraph.nodes.length,
    edges: layout.roadGraph.edges.length,
    lights: layout.roadGraph.stats.lights,
    buildings,
    props,
  };
}
