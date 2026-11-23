// ---------------------------------------------------------------------------
// Пропсы улиц: фонари, урны, гидранты, деревья, скамейки, билборды, заборы.
// Описание чисто числовое: части примитивов (коробка/цилиндр/конус) и цвета.
// Render-слой (cityView) собирает из этого InstancedMesh по чанкам.
// Коллайдер есть только у крупных пропсов: дерево, билборд, забор.
// ---------------------------------------------------------------------------

import type { PropKind } from './types';

export type PropGeometry = 'box' | 'cylinder' | 'cone';

export interface PropPart {
  readonly geometry: PropGeometry;
  /** Смещение относительно основания пропса (y = 0 — верх плиты). */
  readonly x: number;
  readonly y: number;
  readonly z: number;
  /** Размер: для box — стороны, для cylinder/cone — диаметр и высота. */
  readonly sx: number;
  readonly sy: number;
  readonly sz: number;
  readonly color: number;
}

export interface PropVariant {
  readonly parts: readonly PropPart[];
  readonly scaleMin: number;
  readonly scaleMax: number;
}

export interface PropColliderSpec {
  readonly hx: number;
  readonly hz: number;
}

export interface PropDef {
  readonly variants: readonly PropVariant[];
  /** Коллайдер в локальных осях пропса (поворачивается вместе с heading). */
  readonly collider?: PropColliderSpec;
}

function part(
  geometry: PropGeometry,
  x: number,
  y: number,
  z: number,
  sx: number,
  sy: number,
  sz: number,
  color: number,
): PropPart {
  return { geometry, x, y, z, sx, sy, sz, color };
}

function variant(parts: readonly PropPart[], scaleMin = 0.95, scaleMax = 1.05): PropVariant {
  return { parts, scaleMin, scaleMax };
}

export const PROP_DEFS: Readonly<Record<PropKind, PropDef>> = {
  lamp: {
    variants: [
      variant([
        part('cylinder', 0, 3, 0, 0.22, 6, 0.22, 0x394049),
        part('box', 0.42, 6.05, 0, 0.9, 0.16, 0.3, 0xffd27a),
      ]),
      variant([
        part('cylinder', 0, 2.4, 0, 0.18, 4.8, 0.18, 0x3d4a44),
        part('box', 0.35, 4.85, 0, 0.8, 0.15, 0.28, 0xffe2a8),
      ]),
    ],
  },
  bin: {
    variants: [
      variant([part('box', 0, 0.45, 0, 0.55, 0.9, 0.55, 0x2f6b4f)]),
      variant([part('box', 0, 0.4, 0, 0.5, 0.8, 0.5, 0x44566b)]),
    ],
  },
  hydrant: {
    variants: [
      variant([part('cylinder', 0, 0.35, 0, 0.5, 0.7, 0.5, 0xc0442f)], 0.9, 1.1),
      variant([part('cylinder', 0, 0.3, 0, 0.44, 0.6, 0.44, 0xd6a63a)], 0.9, 1.1),
    ],
  },
  tree: {
    variants: [
      variant(
        [
          part('cylinder', 0, 1.2, 0, 0.44, 2.4, 0.44, 0x5b4432),
          part('cone', 0, 3.9, 0, 3.6, 3.4, 3.6, 0x3f7a3a),
        ],
        0.9,
        1.15,
      ),
      variant(
        [
          part('cylinder', 0, 1.2, 0, 0.44, 2.4, 0.44, 0x4e3a2a),
          part('cone', 0, 3.8, 0, 3.4, 3.2, 3.4, 0x35652f),
        ],
        0.9,
        1.15,
      ),
      variant(
        [
          part('cylinder', 0, 1.5, 0, 0.4, 3, 0.4, 0x5b4432),
          part('cone', 0, 4.4, 0, 3.2, 4, 3.2, 0x4a8a44),
        ],
        0.9,
        1.15,
      ),
    ],
    collider: { hx: 0.45, hz: 0.45 },
  },
  bench: {
    variants: [
      variant([
        part('box', 0, 0.44, 0, 1.9, 0.12, 0.55, 0x8a6a44),
        part('box', 0, 0.78, 0.24, 1.9, 0.45, 0.1, 0x7a5c3a),
      ]),
      variant([
        part('box', 0, 0.44, 0, 1.9, 0.12, 0.55, 0x5c6b74),
        part('box', 0, 0.78, 0.24, 1.9, 0.45, 0.1, 0x4c5a63),
      ]),
    ],
  },
  billboard: {
    variants: [
      variant([
        part('box', -1.6, 1.3, 0, 0.2, 2.6, 0.2, 0x4a4f57),
        part('box', 1.6, 1.3, 0, 0.2, 2.6, 0.2, 0x4a4f57),
        part('box', 0, 3.2, 0, 4.4, 2.4, 0.18, 0xd0503f),
      ]),
      variant([
        part('box', -1.6, 1.3, 0, 0.2, 2.6, 0.2, 0x4a4f57),
        part('box', 1.6, 1.3, 0, 0.2, 2.6, 0.2, 0x4a4f57),
        part('box', 0, 3.2, 0, 4.4, 2.4, 0.18, 0x3f6fd0),
      ]),
      variant([
        part('box', -1.6, 1.3, 0, 0.2, 2.6, 0.2, 0x4a4f57),
        part('box', 1.6, 1.3, 0, 0.2, 2.6, 0.2, 0x4a4f57),
        part('box', 0, 3.2, 0, 4.4, 2.4, 0.18, 0x3fa46a),
      ]),
    ],
    collider: { hx: 2.2, hz: 0.35 },
  },
  fence: {
    variants: [
      variant([part('box', 0, 0.8, 0, 0.12, 1.6, 2.95, 0x6b7268)], 1, 1),
      variant([part('box', 0, 0.8, 0, 0.12, 1.6, 2.95, 0x7a6d58)], 1, 1),
    ],
    collider: { hx: 0.1, hz: 1.47 },
  },
};

/** Спецификация варианта пропса с защитой от выхода индекса за границы. */
export function propVariant(kind: PropKind, variant: number): PropVariant {
  const def = PROP_DEFS[kind];
  const index = variant >= 0 && variant < def.variants.length ? variant : 0;
  return def.variants[index];
}

/** Коллайдер пропса (undefined — пропс проходим). */
export function propCollider(kind: PropKind): PropColliderSpec | undefined {
  return PROP_DEFS[kind].collider;
}
