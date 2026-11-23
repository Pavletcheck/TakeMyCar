// ---------------------------------------------------------------------------
// Точки спавна машин/пешеходов/копов. Машины — центры полос дорожного графа,
// пешеходы — тротуары застроенных кварталов, копы — перекрёстки со светофором.
// Явные точки из данных карты добавляются как есть; мировой API
// querySpawnPoints дополнительно валидирует их по SpatialHash перед выдачей.
// ---------------------------------------------------------------------------

import type { CityLayout } from './cityLayout';
import type { SpawnPoint } from './types';

/** Смещения пешеходов вдоль стороны квартала, м. */
const PED_SIDE_OFFSETS = [-14, 0, 14] as const;

export function buildSpawnPoints(layout: CityLayout): SpawnPoint[] {
  const points: SpawnPoint[] = [];

  // Машины — центры полос из дорожного графа.
  for (let i = 0; i < layout.roadGraph.spawnPoints.length; i += 1) {
    points.push(layout.roadGraph.spawnPoints[i]);
  }

  // Явные точки карты: стартовые машины, пешеходы у ориентиров, копы.
  for (let i = 0; i < layout.extraSpawns.length; i += 1) points.push(layout.extraSpawns[i]);

  // Пешеходы — тротуары по периметру застроенных кварталов.
  for (let i = 0; i < layout.blocks.length; i += 1) {
    const block = layout.blocks[i];
    if (block.kind === 'park') continue;
    const ringX = block.rect.hx - 1.6;
    const ringZ = block.rect.hz - 1.6;
    if (ringX < 3 || ringZ < 3) continue;
    for (let side = 0; side < 4; side += 1) {
      for (let s = 0; s < PED_SIDE_OFFSETS.length; s += 1) {
        const offset = PED_SIDE_OFFSETS[s];
        let x = block.rect.x;
        let z = block.rect.z;
        let heading = 0;
        if (side === 0) {
          x += Math.min(Math.abs(offset), ringX) * Math.sign(offset || 1);
          z -= ringZ;
          heading = Math.PI / 2;
        } else if (side === 1) {
          x += Math.min(Math.abs(offset), ringX) * Math.sign(offset || 1);
          z += ringZ;
          heading = -Math.PI / 2;
        } else if (side === 2) {
          x -= ringX;
          z += Math.min(Math.abs(offset), ringZ) * Math.sign(offset || 1);
          heading = 0;
        } else {
          x += ringX;
          z += Math.min(Math.abs(offset), ringZ) * Math.sign(offset || 1);
          heading = Math.PI;
        }
        points.push({ x, z, heading, tag: 'ped' });
      }
    }
  }

  // Копы — перекрёстки со светофором, ближе к тротуару.
  for (let i = 0; i < layout.roadGraph.nodes.length; i += 1) {
    const node = layout.roadGraph.nodes[i];
    if (!node.lights) continue;
    points.push({ x: node.x + 11, z: node.z + 11, heading: Math.PI, tag: 'cop' });
  }

  return points;
}
