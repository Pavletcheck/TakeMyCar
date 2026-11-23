// ---------------------------------------------------------------------------
// Точки спавна машин/пешеходов/копов. Все точки строятся из layout и графа,
// поэтому «не в стене» проверяется один раз при генерации, а мировой API
// querySpawnPoints дополнительно валидирует по SpatialHash перед выдачей.
// ---------------------------------------------------------------------------

import type { CityLayout } from './generator';
import type { SpawnPoint } from './types';

const PED_SIDE_OFFSETS = [-14, 0, 14] as const;

export function buildSpawnPoints(layout: CityLayout): SpawnPoint[] {
  const points: SpawnPoint[] = [];

  // Машины — центры полос из дорожного графа.
  for (let i = 0; i < layout.roadGraph.spawnPoints.length; i += 1) {
    const point = layout.roadGraph.spawnPoints[i];
    points.push(point);
  }

  // Пешеходы — тротуары по периметру квартала и променад набережной.
  for (let i = 0; i < layout.blocks.length; i += 1) {
    const block = layout.blocks[i];
    if (block.kind === 'promenade') {
      const left = block.centerX - block.half;
      for (let k = 0; k < 5; k += 1) {
        const z = block.centerZ - block.half + 12 + k * 14;
        points.push({ x: left + 9, z, heading: block.centerZ > z ? 0 : Math.PI, tag: 'ped' });
        points.push({ x: left + 34, z: z + 6, heading: Math.PI / 2, tag: 'ped' });
      }
      continue;
    }

    const ring = block.half - 1.6;
    for (let side = 0; side < 4; side += 1) {
      for (let s = 0; s < PED_SIDE_OFFSETS.length; s += 1) {
        const offset = PED_SIDE_OFFSETS[s];
        let x = block.centerX;
        let z = block.centerZ;
        let heading = 0;
        if (side === 0) {
          x += offset;
          z -= ring;
          heading = Math.PI / 2;
        } else if (side === 1) {
          x += offset;
          z += ring;
          heading = -Math.PI / 2;
        } else if (side === 2) {
          x -= ring;
          z += offset;
          heading = 0;
        } else {
          x += ring;
          z += offset;
          heading = Math.PI;
        }
        points.push({ x, z, heading, tag: 'ped' });
      }
    }
  }

  // Копы — перекрёстки со светофорами, ближе к тротуару.
  for (let i = 0; i < layout.roadGraph.nodes.length; i += 1) {
    const node = layout.roadGraph.nodes[i];
    if (!node.lights) continue;
    const offset = layout.config.roadWidth / 2 + 2.5;
    points.push({ x: node.x + offset, z: node.z + offset, heading: Math.PI, tag: 'cop' });
  }

  return points;
}
