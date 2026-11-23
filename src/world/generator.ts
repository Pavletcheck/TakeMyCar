// ---------------------------------------------------------------------------
// Процедурная генерация города: сетка кварталов, районы, здания-коробки,
// пропсы, вода и данные мини-карты. Детерминизм:
//   • решения по кварталу — от hash2(seed, ix, iz), а не от общего RNG-потока;
//   • содержимое квартала — от createRng(hash2(seed, ix, iz)), поэтому порядок
//     генерации чанков не влияет на планировку (ARCHITECTURE §8, M3-A-01);
//   • layoutHash — FNV-1a по отсортированным квантованным записям (M3-A-02).
// Генерация не знает о Three и DOM: отдаёт числа и Collider из core/math.
// ---------------------------------------------------------------------------

import type { Collider } from '../core/math';
import { clamp } from '../core/math';
import { createRng } from '../core/rng';
import type { Rng } from '../core/rng';
import type { DistrictId, WorldConfig } from '../config/world';
import { chunkCoordOf, chunkKey } from './coords';
import { hash01, hash2 } from './hash';
import { buildMinimap } from './minimap';
import { PROP_DEFS, propCollider } from './props';
import { buildRoadGraph } from './roadGraph';
import type {
  Bounds,
  BuildingInstance,
  MinimapData,
  MinimapRect,
  PlateInstance,
  PropInstance,
  PropKind,
  RoadGraph,
  SpawnPoint,
} from './types';

/** Квартал города: район, тип застройки и детерминированный сид содержимого. */
export interface BlockSpec {
  readonly index: number;
  readonly ix: number;
  readonly iz: number;
  readonly centerX: number;
  readonly centerZ: number;
  readonly half: number;
  readonly district: DistrictId;
  readonly kind: 'build' | 'park' | 'parking' | 'promenade';
  readonly seed: number;
  /** 0 — окраина, 1 — центр: влияет на высоту застройки. */
  readonly centrality: number;
}

/** Полный layout мира: кварталы, дорожный граф, вода, мини-карта. */
export interface CityLayout {
  readonly config: WorldConfig;
  readonly seed: number;
  readonly bounds: Bounds;
  readonly chunkSize: number;
  readonly blocksPerAxis: number;
  readonly blocks: readonly BlockSpec[];
  readonly roadGraph: RoadGraph;
  readonly minimap: MinimapData;
  readonly water: readonly MinimapRect[];
  /** X, с которого начинается вода набережной. */
  readonly waterStartX: number;
  /** Индексы кварталов по ключу чанка (центр квартала внутри чанка). */
  readonly chunkBlocks: ReadonlyMap<number, readonly number[]>;
  readonly defaultSpawn: SpawnPoint;
}

/** Содержимое одного квартала; коллайдеры получают id в chunks.ts. */
export interface BlockContent {
  plates: PlateInstance[];
  buildings: BuildingInstance[];
  props: PropInstance[];
  colliders: Collider[];
}

interface MutableBlock {
  ix: number;
  iz: number;
  centerX: number;
  centerZ: number;
  centrality: number;
  district: DistrictId;
  kind: BlockSpec['kind'];
}

export function createBlockContent(): BlockContent {
  return { plates: [], buildings: [], props: [], colliders: [] };
}

export function clearBlockContent(out: BlockContent): void {
  out.plates.length = 0;
  out.buildings.length = 0;
  out.props.length = 0;
  out.colliders.length = 0;
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export function createCityLayout(config: WorldConfig): CityLayout {
  const seed = config.seed;
  const halfSize = config.sizeMeters / 2;
  const bounds: Bounds = { minX: -halfSize, minZ: -halfSize, maxX: halfSize, maxZ: halfSize };
  const blocksPerAxis = Math.round(config.sizeMeters / config.blockStep);
  if (blocksPerAxis < 3) throw new Error('CityLayout: слишком мало кварталов');
  if (Math.abs(blocksPerAxis * config.blockStep - config.sizeMeters) > 0.5) {
    throw new Error('CityLayout: sizeMeters должен делиться на blockStep');
  }

  const waterfrontIndex = blocksPerAxis - 1;
  const mutable: MutableBlock[] = [];

  for (let ix = 0; ix < blocksPerAxis; ix += 1) {
    for (let iz = 0; iz < blocksPerAxis; iz += 1) {
      const centerX = (ix - (blocksPerAxis - 1) / 2) * config.blockStep;
      const centerZ = (iz - (blocksPerAxis - 1) / 2) * config.blockStep;
      const centrality = clamp(1 - Math.hypot(centerX, centerZ) / (config.sizeMeters * 0.62), 0, 1);
      mutable.push({
        ix,
        iz,
        centerX,
        centerZ,
        centrality,
        district: ix === waterfrontIndex ? 'waterfront' : 'center',
        kind: 'build',
      });
    }
  }

  // Промзона — доля weight среди кварталов, не занятых набережной.
  // Квантование по score даёт компактную зону на юго-западе (M3-A-01).
  const candidates = mutable.filter((block) => block.district === 'center');
  const scored = candidates.map((block) => ({
    block,
    score:
      -(block.centerZ / halfSize) * 0.85 -
      (block.centerX / halfSize) * 0.45 +
      (hash01(seed, block.ix * 7 + 11, block.iz * 13 + 5) - 0.5) * 0.5,
  }));
  scored.sort((a, b) => b.score - a.score);
  const industrialCount = Math.round(config.districts.industrial.weight * candidates.length);
  for (let i = 0; i < industrialCount; i += 1) scored[i].block.district = 'industrial';

  // Тип квартала: парки/парковки — по хэшу от сида и координат.
  for (let i = 0; i < mutable.length; i += 1) {
    const block = mutable[i];
    if (block.district === 'waterfront') {
      block.kind = 'promenade';
      continue;
    }
    const roll = hash2(seed, block.ix * 5 + 3, block.iz * 3 + 7) % 100;
    if (block.district === 'industrial') {
      block.kind = roll < 20 ? 'parking' : 'build';
    } else {
      block.kind = roll < 8 ? 'park' : roll < 16 ? 'parking' : 'build';
    }
  }

  ensureKind(mutable, 'park', 'center');
  ensureKind(mutable, 'parking', 'industrial');

  const blocks: BlockSpec[] = mutable.map((block, index) => ({
    index,
    ix: block.ix,
    iz: block.iz,
    centerX: block.centerX,
    centerZ: block.centerZ,
    half: config.blockHalf,
    district: block.district,
    kind: block.kind,
    seed: hash2(seed, block.ix * 2 + 1, block.iz * 2 + 3),
    centrality: block.centrality,
  }));

  const chunkBlocks = new Map<number, number[]>();
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    const cx = chunkCoordOf(block.centerX, config.chunkSize);
    const cz = chunkCoordOf(block.centerZ, config.chunkSize);
    const key = chunkKey(cx, cz);
    let list = chunkBlocks.get(key);
    if (!list) {
      list = [];
      chunkBlocks.set(key, list);
    }
    list.push(i);
  }

  const roadGraph = buildRoadGraph(seed, config);

  // Вода занимает восточную полосу за променадом; застройки там нет.
  const waterfrontCenter = (waterfrontIndex - (blocksPerAxis - 1) / 2) * config.blockStep;
  const waterStartX = waterfrontCenter - config.blockHalf + config.waterfrontPromenadeWidth;
  const water: MinimapRect[] = [
    {
      x: (waterStartX + bounds.maxX) / 2,
      z: 0,
      hx: (bounds.maxX - waterStartX) / 2,
      hz: halfSize,
    },
  ];

  const minimap = buildMinimap(bounds, blocks, roadGraph, water, config.roadWidth);

  // Стартовая точка — ближайшая к центру валидная полоса из графа,
  // а не константа в bootstrap (M3-A-05).
  let defaultSpawn = roadGraph.spawnPoints[0];
  if (!defaultSpawn) throw new Error('CityLayout: граф не дал точек спавна');
  let bestDist = Number.POSITIVE_INFINITY;
  for (let i = 0; i < roadGraph.spawnPoints.length; i += 1) {
    const point = roadGraph.spawnPoints[i];
    const dist = point.x * point.x + point.z * point.z;
    if (dist < bestDist) {
      bestDist = dist;
      defaultSpawn = point;
    }
  }

  return {
    config,
    seed,
    bounds,
    chunkSize: config.chunkSize,
    blocksPerAxis,
    blocks,
    roadGraph,
    minimap,
    water,
    waterStartX,
    chunkBlocks,
    defaultSpawn,
  };
}

/** Гарантирует хотя бы один парк/парковку: переводит ближайший к центру квартал. */
function ensureKind(
  blocks: MutableBlock[],
  kind: 'park' | 'parking',
  district: DistrictId,
): void {
  if (blocks.some((block) => block.kind === kind)) return;
  let best = -1;
  let bestDist = Number.POSITIVE_INFINITY;
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    if (block.district !== district || block.kind !== 'build') continue;
    const dist = block.centerX * block.centerX + block.centerZ * block.centerZ;
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  if (best >= 0) blocks[best].kind = kind;
}

// ---------------------------------------------------------------------------
// Содержимое квартала
// ---------------------------------------------------------------------------

export function generateBlock(layout: CityLayout, block: BlockSpec, out: BlockContent): BlockContent {
  const config = layout.config;
  const rng = createRng(block.seed);
  const curbColor = config.colors;

  if (block.kind === 'promenade') {
    generatePromenade(layout, block, rng, out);
    return out;
  }

  const plateColor =
    block.kind === 'park'
      ? curbColor.park
      : block.kind === 'parking'
        ? curbColor.parking
        : curbColor.sidewalk;

  out.plates.push({
    x: block.centerX,
    z: block.centerZ,
    w: block.half * 2,
    d: block.half * 2,
    color: plateColor,
  });

  if (block.kind === 'build') {
    if (block.district === 'industrial') generateIndustrial(layout, block, rng, out);
    else generateDowntown(layout, block, rng, out);
    generateSidewalkProps(layout, block, rng, out);
  } else if (block.kind === 'park') {
    generatePark(layout, block, rng, out);
  } else {
    generateParking(layout, block, rng, out);
  }

  return out;
}

function pushBuilding(
  out: BlockContent,
  x: number,
  z: number,
  w: number,
  d: number,
  h: number,
  color: number,
  roofColor: number,
): void {
  out.buildings.push({ x, z, w, d, h, color, roofColor });
  out.colliders.push({ id: 0, x, z, hx: w / 2, hz: d / 2, angle: 0 });
}

function pushProp(
  out: BlockContent,
  kind: PropKind,
  x: number,
  z: number,
  heading: number,
  rng: Rng,
): void {
  const def = PROP_DEFS[kind];
  const variantIndex = rng.int(0, def.variants.length - 1);
  const variant = def.variants[variantIndex];
  const scale = variant.scaleMin + (variant.scaleMax - variant.scaleMin) * rng.next();
  const collider = propCollider(kind);
  out.props.push({ kind, x, z, heading, scale, variant: variantIndex, collidable: collider !== undefined });
  if (collider) {
    out.colliders.push({ id: 0, x, z, hx: collider.hx, hz: collider.hz, angle: heading });
  }
}

function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[rng.int(0, items.length - 1)];
}

/** Центр: коробки-высотки, плотная сетка лотов, высота падает к окраине. */
function generateDowntown(layout: CityLayout, block: BlockSpec, rng: Rng, out: BlockContent): void {
  const config = layout.config;
  const district = config.districts.center;
  const interior = block.half - config.sidewalkWidth;
  const usable = interior - 1.4;
  const downtown = block.centrality > 0.45;
  const cols = downtown ? 2 : hash2(block.seed, 1, 2) % 2 === 0 ? 2 : 3;
  const rows = downtown ? 2 : hash2(block.seed, 3, 4) % 2 === 0 ? 2 : 3;
  const cellW = (usable * 2) / cols;
  const cellD = (usable * 2) / rows;
  const heightScale = 0.3 + 0.7 * Math.pow(block.centrality, 1.25);

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (rng.chance(downtown ? 0.18 : 0.12)) continue;
      // Зазор между коробками оставляет читаемые переулки при виде сверху.
      const w = Math.max(4, cellW * rng.range(0.58, 0.8));
      const d = Math.max(4, cellD * rng.range(0.58, 0.8));
      const maxX = usable - w / 2;
      const maxZ = usable - d / 2;
      const rawX = block.centerX - usable + cellW * (c + 0.5) + rng.range(-0.7, 0.7);
      const rawZ = block.centerZ - usable + cellD * (r + 0.5) + rng.range(-0.7, 0.7);
      const x = block.centerX + clamp(rawX - block.centerX, -maxX, maxX);
      const z = block.centerZ + clamp(rawZ - block.centerZ, -maxZ, maxZ);
      const h =
        district.heightMin +
        (district.heightMax - district.heightMin) * Math.pow(rng.next(), 1.8) * heightScale;
      pushBuilding(
        out,
        x,
        z,
        w,
        d,
        Math.max(4, h),
        pick(rng, district.buildingColors),
        pick(rng, district.roofColors),
      );
    }
  }
}

/** Промзона: длинные низкие склады и забор по одной стороне квартала. */
function generateIndustrial(layout: CityLayout, block: BlockSpec, rng: Rng, out: BlockContent): void {
  const config = layout.config;
  const district = config.districts.industrial;
  const interior = block.half - config.sidewalkWidth;
  const usable = interior - 1.4;
  const count = 1 + (rng.chance(0.45) ? 1 : 0);
  const cellD = (usable * 2) / count;

  for (let i = 0; i < count; i += 1) {
    const w = usable * 2 * rng.range(0.62, 0.92);
    const d = Math.max(8, cellD - 3 - rng.range(0, 2));
    const maxZ = usable - d / 2;
    const rawZ = block.centerZ - usable + cellD * (i + 0.5) + rng.range(-0.5, 0.5);
    const z = block.centerZ + clamp(rawZ - block.centerZ, -maxZ, maxZ);
    const maxX = usable - w / 2;
    const x = block.centerX + clamp(rng.range(-1.5, 1.5), -maxX, maxX);
    const h = rng.range(district.heightMin, district.heightMax);
    pushBuilding(out, x, z, w, d, h, pick(rng, district.buildingColors), pick(rng, district.roofColors));
  }

  // Забор вдоль северной стороны двора: 2.95 м на секцию, без выхода на дорогу.
  const fenceZ = block.centerZ + block.half - 2.4;
  for (let x = block.centerX - block.half + 5; x <= block.centerX + block.half - 5; x += 3.05) {
    pushProp(out, 'fence', x, fenceZ, Math.PI / 2, rng);
  }
  if (rng.chance(0.7)) {
    const side = rng.int(0, 3);
    const east = side === 2 || side === 3;
    const px = east ? block.centerX + (side === 2 ? -1 : 1) * (block.half - 1) : block.centerX + rng.range(-10, 10);
    const pz = east ? block.centerZ + rng.range(-10, 10) : block.centerZ + (side === 0 ? -1 : 1) * (block.half - 1);
    pushProp(out, 'billboard', px, pz, east ? (side === 2 ? -Math.PI / 2 : Math.PI / 2) : side === 0 ? Math.PI : 0, rng);
  }
}

/** Тротуарные пропсы жилых/центральных кварталов. */
function generateSidewalkProps(layout: CityLayout, block: BlockSpec, rng: Rng, out: BlockContent): void {
  const config = layout.config;
  const ring = block.half - 1.4;
  const step = 24 / clamp(config.propsDensity, 0.3, 3);
  const density = clamp(config.propsDensity, 0, 3);

  for (let side = 0; side < 4; side += 1) {
    const horizontal = side < 2;
    const outwardX = horizontal ? 0 : side === 2 ? -1 : 1;
    const outwardZ = horizontal ? (side === 0 ? -1 : 1) : 0;
    const heading = Math.atan2(outwardX, outwardZ);

    for (let t = -ring + 7; t <= ring - 7; t += step) {
      const x = horizontal ? block.centerX + t : block.centerX + outwardX * ring;
      const z = horizontal ? block.centerZ + outwardZ * ring : block.centerZ + t;
      pushProp(out, 'lamp', x, z, heading, rng);

      if (rng.chance(0.22 * density)) {
        pushProp(out, 'tree', x - outwardX * 1.6, z - outwardZ * 1.6, rng.range(0, Math.PI * 2), rng);
      }
      if (rng.chance(0.06 * density)) {
        pushProp(out, 'bin', x + outwardX * -0.4 + (horizontal ? 0.9 : 0), z + outwardZ * -0.4, heading, rng);
      }
    }
  }

  // Гидранты — по одному на пару кварталов, у перекрёстка.
  if (rng.chance(0.5)) {
    const corner = rng.int(0, 3);
    const cx = block.centerX + (corner % 2 === 0 ? -ring + 1.5 : ring - 1.5);
    const cz = block.centerZ + (corner < 2 ? -ring + 1.5 : ring - 1.5);
    pushProp(out, 'hydrant', cx, cz, rng.range(0, Math.PI * 2), rng);
  }

  if (block.district === 'industrial' && rng.chance(0.5)) {
    pushProp(out, 'billboard', block.centerX + rng.range(-12, 12), block.centerZ + block.half - 1.2, 0, rng);
  }
}

/** Парк: газон, сетка деревьев, скамейки, фонари. */
function generatePark(layout: CityLayout, block: BlockSpec, rng: Rng, out: BlockContent): void {
  const config = layout.config;
  const reach = block.half - 7;
  const grid = 4;
  const skip = clamp(1 - config.propsDensity, 0, 0.9) + 0.2;

  for (let r = 0; r < grid; r += 1) {
    for (let c = 0; c < grid; c += 1) {
      if (rng.chance(skip)) continue;
      const x = block.centerX + ((c + 0.5) / grid * 2 - 1) * reach + rng.range(-2.5, 2.5);
      const z = block.centerZ + ((r + 0.5) / grid * 2 - 1) * reach + rng.range(-2.5, 2.5);
      pushProp(out, 'tree', x, z, rng.range(0, Math.PI * 2), rng);
    }
  }

  for (let i = 0; i < 4; i += 1) {
    const angle = (Math.PI / 2) * i + Math.PI / 4;
    pushProp(
      out,
      'bench',
      block.centerX + Math.cos(angle) * (reach - 6),
      block.centerZ + Math.sin(angle) * (reach - 6),
      angle + Math.PI / 2,
      rng,
    );
  }

  const lampRing = block.half - 1.4;
  for (let i = 0; i < 4; i += 1) {
    const sx = i % 2 === 0 ? -1 : 1;
    const sz = i < 2 ? -1 : 1;
    pushProp(out, 'lamp', block.centerX + sx * lampRing, block.centerZ + sz * lampRing, Math.atan2(sx, sz), rng);
  }
}

/** Парковка: асфальт, фонари по углам, пара деревьев-островков. */
function generateParking(layout: CityLayout, block: BlockSpec, rng: Rng, out: BlockContent): void {
  const lampRing = block.half - 1.4;
  for (let i = 0; i < 4; i += 1) {
    const sx = i % 2 === 0 ? -1 : 1;
    const sz = i < 2 ? -1 : 1;
    pushProp(out, 'lamp', block.centerX + sx * lampRing, block.centerZ + sz * lampRing, Math.atan2(sx, sz), rng);
  }

  const trees = Math.round(2 * clamp(layout.config.propsDensity, 0.3, 2));
  for (let i = 0; i < trees; i += 1) {
    pushProp(
      out,
      'tree',
      block.centerX + rng.range(-block.half * 0.4, block.half * 0.4),
      block.centerZ + rng.range(-block.half * 0.4, block.half * 0.4),
      rng.range(0, Math.PI * 2),
      rng,
    );
  }
}

/** Набережная: променад-парк, деревья, скамейки и ограда у воды. */
function generatePromenade(layout: CityLayout, block: BlockSpec, rng: Rng, out: BlockContent): void {
  const config = layout.config;
  const left = block.centerX - block.half;
  const plateWidth = layout.waterStartX - left;
  out.plates.push({
    x: left + plateWidth / 2,
    z: block.centerZ,
    w: plateWidth,
    d: block.half * 2,
    color: config.colors.park,
  });

  const density = clamp(config.propsDensity, 0.3, 3);
  const rowStep = 15 / density;
  for (let z = block.centerZ - block.half + 8; z <= block.centerZ + block.half - 8; z += rowStep) {
    pushProp(out, 'tree', left + 13, z, rng.range(0, Math.PI * 2), rng);
    pushProp(out, 'tree', left + 27, z + 4, rng.range(0, Math.PI * 2), rng);
  }

  const benchStep = 24 / density;
  for (let z = block.centerZ - block.half + 12; z <= block.centerZ + block.half - 12; z += benchStep) {
    pushProp(out, 'bench', left + plateWidth - 12, z, Math.PI / 2, rng);
  }

  const lampStep = 22 / density;
  for (let z = block.centerZ - block.half + 6; z <= block.centerZ + block.half - 6; z += lampStep) {
    pushProp(out, 'lamp', left + 3, z, -Math.PI / 2, rng);
  }

  // Ограда по кромке воды: сплошной ряд секций, коллайдер у каждой.
  const edgeX = layout.waterStartX - 0.6;
  for (let z = block.centerZ - block.half + 1.5; z < block.centerZ + block.half - 1.2; z += 3.02) {
    pushProp(out, 'fence', edgeX, z, 0, rng);
  }

  if (rng.chance(0.35)) {
    pushProp(out, 'billboard', left + plateWidth - 8, block.centerZ - block.half + 6, Math.PI, rng);
  }
}

// ---------------------------------------------------------------------------
// Hash планировки
// ---------------------------------------------------------------------------

const HASH_QUANT = 1000;

function quant(value: number): number {
  return Math.round(value * HASH_QUANT);
}

/**
 * FNV-1a по отсортированным квантованным записям (M3-A-02).
 * Один и тот же seed обязан дать один и тот же hash; смена seed — другой.
 */
export function computeLayoutHash(layout: CityLayout): number {
  const records: string[] = [];
  const content = createBlockContent();

  for (let i = 0; i < layout.blocks.length; i += 1) {
    const block = layout.blocks[i];
    clearBlockContent(content);
    generateBlock(layout, block, content);
    records.push(`b|${block.ix}|${block.iz}|${block.district}|${block.kind}|${block.seed}`);
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
    for (let c = 0; c < content.colliders.length; c += 1) {
      const collider = content.colliders[c];
      records.push(
        `c|${quant(collider.x)}|${quant(collider.z)}|${quant(collider.hx)}|${quant(collider.hz)}|` +
          `${quant(collider.angle ?? 0)}`,
      );
    }
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
