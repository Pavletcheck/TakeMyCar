// ---------------------------------------------------------------------------
// Геометрия карты в плоскости XZ: прямоугольник отрезка дороги, расстояния.
// Всё считается аналитически (без Three и DOM) и не аллоцирует в горячем пути.
//
// Соглашение поворота — как у Collider/Rect из core/math: `angle` — rotation.y,
// локальная ось Z смотрит вдоль направления отрезка, локальная X — поперёк.
// ---------------------------------------------------------------------------

import type { Rect } from '../core/math';
import type { MapRect } from './mapTypes';

/** Прямоугольник коридора отрезка: hx — половина ширины, hz — половина длины. */
export function segmentRect(x1: number, z1: number, x2: number, z2: number, halfWidth: number): Rect {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const length = Math.hypot(dx, dz);
  return {
    x: (x1 + x2) / 2,
    z: (z1 + z2) / 2,
    hx: halfWidth,
    hz: length / 2,
    angle: length > 1e-9 ? Math.atan2(dx, dz) : 0,
  };
}

/** Расстояние от точки до отрезка (0 — точка на отрезке). */
export function distanceToSegment(
  x: number,
  z: number,
  x1: number,
  z1: number,
  x2: number,
  z2: number,
): number {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const lengthSq = dx * dx + dz * dz;
  if (lengthSq < 1e-12) return Math.hypot(x - x1, z - z1);
  let t = ((x - x1) * dx + (z - z1) * dz) / lengthSq;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return Math.hypot(x - (x1 + dx * t), z - (z1 + dz * t));
}

/** Точка внутри прямоугольника (без поворота). */
export function pointInRect(x: number, z: number, rect: MapRect): boolean {
  return Math.abs(x - rect.x) <= rect.hx && Math.abs(z - rect.z) <= rect.hz;
}

/** Прямоугольник MapRect → Rect из core/math (angle = 0). */
export function toRect(rect: MapRect): Rect {
  return { x: rect.x, z: rect.z, hx: rect.hx, hz: rect.hz, angle: 0 };
}

/** Пересечение двух отрезков: параметры t/u и точка; null — не пересекаются. */
export interface SegmentHit {
  readonly t: number;
  readonly u: number;
  readonly x: number;
  readonly z: number;
}

export function segmentIntersection(
  ax: number,
  az: number,
  bx: number,
  bz: number,
  cx: number,
  cz: number,
  dx: number,
  dz: number,
): SegmentHit | null {
  const rx = bx - ax;
  const rz = bz - az;
  const sx = dx - cx;
  const sz = dz - cz;
  const denom = rx * sz - rz * sx;
  if (Math.abs(denom) < 1e-9) return null; // параллельны или коллинеарны
  const qpx = cx - ax;
  const qpz = cz - az;
  const t = (qpx * sz - qpz * sx) / denom;
  const u = (qpx * rz - qpz * rx) / denom;
  if (t < -1e-4 || t > 1 + 1e-4) return null;
  if (u < -1e-4 || u > 1 + 1e-4) return null;
  const ct = t < 0 ? 0 : t > 1 ? 1 : t;
  return { t: ct, u: u < 0 ? 0 : u > 1 ? 1 : u, x: ax + rx * ct, z: az + rz * ct };
}

/** Коллинеарные отрезки перекрываются (наложение дорог друг на друга). */
export function segmentsOverlap(
  ax: number,
  az: number,
  bx: number,
  bz: number,
  cx: number,
  cz: number,
  dx: number,
  dz: number,
): boolean {
  const rx = bx - ax;
  const rz = bz - az;
  const sx = dx - cx;
  const sz = dz - cz;
  const lenR = Math.hypot(rx, rz);
  const lenS = Math.hypot(sx, sz);
  if (lenR < 1e-9 || lenS < 1e-9) return false;
  // Коллинеарность: направления параллельны и точка C лежит на прямой AB.
  if (Math.abs(rx * sz - rz * sx) > 1e-6 * lenR * lenS) return false;
  if (Math.abs((cx - ax) * rz - (cz - az) * rx) / lenR > 0.05) return false;
  const ux = rx / lenR;
  const uz = rz / lenR;
  const t0 = 0;
  const t1 = lenR;
  const c0 = (cx - ax) * ux + (cz - az) * uz;
  const c1 = (dx - ax) * ux + (dz - az) * uz;
  const lo = Math.min(c0, c1);
  const hi = Math.max(c0, c1);
  return Math.min(t1, hi) - Math.max(t0, lo) > 0.5;
}
