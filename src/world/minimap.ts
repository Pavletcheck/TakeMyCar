// ---------------------------------------------------------------------------
// Данные мини-карты для HUD: дороги, кварталы, парки и вода.
// Формат векторный (отрезки и прямоугольники), без Three и без DOM.
// Глобальные данные строятся один раз, тайлы — при активации чанка.
// ---------------------------------------------------------------------------

import type { BlockKind, DistrictId } from '../config/world';
import type {
  Bounds,
  MinimapBlock,
  MinimapData,
  MinimapRect,
  MinimapRoad,
  MinimapTile,
  RoadGraph,
} from './types';

/** Минимум, который нужен мини-карте от квартала. */
export interface MinimapBlockSource {
  readonly centerX: number;
  readonly centerZ: number;
  readonly half: number;
  readonly district: DistrictId;
  readonly kind: BlockKind;
}

/** Глобальная упрощённая геометрия мира. */
export function buildMinimap(
  bounds: Bounds,
  blocks: readonly MinimapBlockSource[],
  graph: RoadGraph,
  water: readonly MinimapRect[],
  roadWidth: number,
): MinimapData {
  const seen = new Set<number>();
  const roads: MinimapRoad[] = [];
  const nodeCount = graph.nodes.length;

  // Рёбра направленные: для карты оставляем одно на пару узлов.
  for (let i = 0; i < graph.edges.length; i += 1) {
    const edge = graph.edges[i];
    const lo = Math.min(edge.from, edge.to);
    const hi = Math.max(edge.from, edge.to);
    const key = lo * nodeCount + hi;
    if (seen.has(key)) continue;
    seen.add(key);
    const a = graph.nodes[edge.from];
    const b = graph.nodes[edge.to];
    roads.push({
      x1: a.x,
      z1: a.z,
      x2: b.x,
      z2: b.z,
      width: roadWidth,
      arterial: edge.arterial,
    });
  }

  const minimapBlocks: MinimapBlock[] = [];
  const parks: MinimapRect[] = [];
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    minimapBlocks.push({
      x: block.centerX,
      z: block.centerZ,
      half: block.half,
      district: block.district,
      kind: block.kind,
    });
    if (block.kind === 'park' || block.kind === 'promenade') {
      parks.push({ x: block.centerX, z: block.centerZ, hx: block.half, hz: block.half });
    }
  }

  return { bounds, roads, blocks: minimapBlocks, water, parks };
}

/** Тайл мини-карты для чанка: только геометрия, пересекающая его прямоугольник. */
export function buildMinimapTile(cx: number, cz: number, chunkSize: number, minimap: MinimapData): MinimapTile {
  const minX = cx * chunkSize;
  const minZ = cz * chunkSize;
  const maxX = minX + chunkSize;
  const maxZ = minZ + chunkSize;

  const roads: MinimapRoad[] = [];
  for (let i = 0; i < minimap.roads.length; i += 1) {
    const road = minimap.roads[i];
    const half = road.width / 2;
    const segMinX = Math.min(road.x1, road.x2) - half;
    const segMaxX = Math.max(road.x1, road.x2) + half;
    const segMinZ = Math.min(road.z1, road.z2) - half;
    const segMaxZ = Math.max(road.z1, road.z2) + half;
    if (segMaxX < minX || segMinX > maxX || segMaxZ < minZ || segMinZ > maxZ) continue;
    roads.push(road);
  }

  const blocks: MinimapBlock[] = [];
  for (let i = 0; i < minimap.blocks.length; i += 1) {
    const block = minimap.blocks[i];
    if (block.x < minX || block.x >= maxX || block.z < minZ || block.z >= maxZ) continue;
    blocks.push(block);
  }

  const water: MinimapRect[] = [];
  for (let i = 0; i < minimap.water.length; i += 1) {
    const rect = minimap.water[i];
    if (
      rect.x + rect.hx < minX ||
      rect.x - rect.hx > maxX ||
      rect.z + rect.hz < minZ ||
      rect.z - rect.hz > maxZ
    ) {
      continue;
    }
    water.push(rect);
  }

  return { cx, cz, minX, minZ, maxX, maxZ, roads, blocks, water };
}
