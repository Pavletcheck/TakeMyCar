// ---------------------------------------------------------------------------
// Префабы застройки → содержимое квартала (плита, коробки зданий, пропсы,
// коллайдеры). Никакой случайности: набор зданий и пропсов задан в карте,
// координаты префаба нормированы и масштабируются под размер квартала.
// Коллайдеры получают id в chunks.ts через единый аллокатор мира.
// ---------------------------------------------------------------------------

import type { Collider } from '../core/math';
import type { BlockKind, WorldConfig } from '../config/world';
import type { BlockSpec, PrefabSpec, PropSpec } from './mapTypes';
import { propCollider } from './props';
import type { BuildingInstance, PlateInstance, PropInstance } from './types';

/** Содержимое одного квартала или префаба до присвоения id коллайдерам. */
export interface BlockContent {
  plates: PlateInstance[];
  buildings: BuildingInstance[];
  props: PropInstance[];
  colliders: Collider[];
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

/** Цвет плиты квартала по его типу, если префаб не задал свой. */
export function plateColorOf(kind: BlockKind, config: WorldConfig): number {
  if (kind === 'park' || kind === 'promenade') return config.colors.park;
  if (kind === 'parking') return config.colors.parking;
  return config.colors.sidewalk;
}

/** Мировой пропс из спецификации (абсолютные координаты). */
export function createProp(spec: PropSpec): PropInstance {
  return {
    kind: spec.kind,
    x: spec.x,
    z: spec.z,
    heading: spec.heading,
    scale: spec.scale,
    variant: spec.variant,
    collidable: propCollider(spec.kind) !== undefined,
  };
}

/** Коллайдер пропса или undefined, если пропс проходим. */
export function createPropCollider(spec: PropSpec): Collider | undefined {
  const body = propCollider(spec.kind);
  if (!body) return undefined;
  return { id: 0, x: spec.x, z: spec.z, hx: body.hx, hz: body.hz, angle: spec.heading };
}

/**
 * Раскрывает префаб в мировые прямоугольники квартала `block`.
 * Плита занимает весь квартал, коробки — по нормированным координатам префаба.
 */
export function expandPrefab(
  prefab: PrefabSpec,
  block: BlockSpec,
  plateColor: number,
  out: BlockContent,
): BlockContent {
  const rect = block.rect;

  out.plates.push({
    x: rect.x,
    z: rect.z,
    w: rect.hx * 2,
    d: rect.hz * 2,
    color: plateColor,
  });

  for (let i = 0; i < prefab.buildings.length; i += 1) {
    const spec = prefab.buildings[i];
    const w = spec.w * rect.hx * 2;
    const d = spec.d * rect.hz * 2;
    const x = rect.x + spec.x * rect.hx;
    const z = rect.z + spec.z * rect.hz;
    out.buildings.push({
      x,
      z,
      w,
      d,
      h: spec.h,
      color: spec.color,
      roofColor: spec.roofColor,
    });
    out.colliders.push({ id: 0, x, z, hx: w / 2, hz: d / 2, angle: 0 });
  }

  for (let i = 0; i < prefab.props.length; i += 1) {
    const spec = prefab.props[i];
    const x = rect.x + spec.x * rect.hx;
    const z = rect.z + spec.z * rect.hz;
    out.props.push({
      kind: spec.kind,
      x,
      z,
      heading: spec.heading,
      scale: spec.scale,
      variant: spec.variant,
      collidable: propCollider(spec.kind) !== undefined,
    });
    const body = propCollider(spec.kind);
    if (body) {
      out.colliders.push({
        id: 0,
        x,
        z,
        hx: body.hx,
        hz: body.hz,
        angle: spec.heading,
      });
    }
  }

  return out;
}
