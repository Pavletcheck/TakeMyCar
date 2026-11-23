// ---------------------------------------------------------------------------
// Решатель коллизий в плоскости XZ.
// Узкая фаза — circleRect / rectRectContact из core/math (SAT, OBB/AABB).
// Широкая — SpatialHash; запросы пишут в переданные массивы и Contact,
// поэтому в горячем пути (фикс. шаг) аллокаций нет.
//
// Антитуннелирование: перемещение дробится на подшаги не длиннее
// tuning.maxSweepStep; для машины 30 м/с это 0.5 м на тик → 2 подшага.
// Разрешение контактов — 2–4 итерации, restitution из tuning (ADR 0003).
// ---------------------------------------------------------------------------

import type { Collider, Contact, Rect } from './math';
import { circleRect, rectRectContact } from './math';
import type { SpatialHash } from './spatialHash';
import type { TuningConfig } from '../config/tuning';

/** Тело-окружность: машина, пешеход, снаряд. */
export interface CircleBody {
  x: number;
  z: number;
  vx: number;
  vz: number;
  radius: number;
}

/** Результат шага решателя (переиспользуется вызывающим). */
export interface SolveResult {
  /** Был ли контакт за шаг. */
  hit: boolean;
  /** Сколько контактов обработано (с учётом итераций). */
  contacts: number;
  /** Максимальная нормальная скорость удара, м/с. */
  impact: number;
  /** Сколько подшагов потребовалось (антитуннелирование). */
  substeps: number;
}

/** Предохранитель: больше 8 подшагов на тик не нужно (≈192 м/с). */
const MAX_SWEEP_SUBSTEPS = 8;

export function resetSolveResult(out: SolveResult): void {
  out.hit = false;
  out.contacts = 0;
  out.impact = 0;
  out.substeps = 0;
}

/**
 * Переместить тело на v * dt с разрешением контактов.
 * Позиция и скорость пишутся обратно в body; результат — в out.
 */
export function moveCircle(
  body: CircleBody,
  dt: number,
  hash: SpatialHash<Collider>,
  candidates: Collider[],
  contact: Contact,
  tuning: TuningConfig,
  out: SolveResult,
): SolveResult {
  resetSolveResult(out);

  const speed = Math.sqrt(body.vx * body.vx + body.vz * body.vz);
  const distance = speed * dt;
  let substeps = 1;
  if (distance > tuning.maxSweepStep) substeps = Math.ceil(distance / tuning.maxSweepStep);
  if (substeps > MAX_SWEEP_SUBSTEPS) substeps = MAX_SWEEP_SUBSTEPS;
  out.substeps = substeps;

  const stepDt = dt / substeps;
  const iterations = Math.max(1, tuning.collisionIterations);
  const queryRadius = body.radius + tuning.collisionSkin;

  for (let s = 0; s < substeps; s += 1) {
    body.x += body.vx * stepDt;
    body.z += body.vz * stepDt;

    let deepest = 0;
    let normalX = 0;
    let normalZ = 0;

    for (let iteration = 0; iteration < iterations; iteration += 1) {
      hash.queryCircle(body.x, body.z, queryRadius, candidates);
      let resolved = false;

      for (let i = 0; i < candidates.length; i += 1) {
        if (!circleRect(body.x, body.z, body.radius, candidates[i], contact)) continue;
        // Выталкиваем по нормали: corners разрешаются за несколько итераций.
        body.x += contact.nx * contact.depth;
        body.z += contact.nz * contact.depth;
        resolved = true;
        out.contacts += 1;
        if (contact.depth > deepest) {
          deepest = contact.depth;
          normalX = contact.nx;
          normalZ = contact.nz;
        }
      }

      if (!resolved) break;
    }

    if (deepest > 0) {
      out.hit = true;
      const normalSpeed = body.vx * normalX + body.vz * normalZ;
      if (normalSpeed < 0) {
        const impact = -normalSpeed;
        if (impact > out.impact) out.impact = impact;
        // Нормальная составляющая отражается с restitution, касательная
        // теряет долю на трение — так углы не «продавливают» тело.
        const tangentX = body.vx - normalSpeed * normalX;
        const tangentZ = body.vz - normalSpeed * normalZ;
        const bounce = impact * tuning.restitution;
        const keep = 1 - tuning.collisionFriction;
        body.vx = tangentX * keep + bounce * normalX;
        body.vz = tangentZ * keep + bounce * normalZ;
      }
    }
  }

  return out;
}

/**
 * Разрешить пересечения прямоугольного тела (OBB/AABB) с коллайдерами хэша.
 * Используется кинематическими телами стресс-режима; тело сдвигается по
 * нормали, скорость не меняется. `staticOnly` пропускает динамические
 * коллайдеры (у них отрицательный id) — кинематика не толкает кинематику.
 */
export function resolveRectBody(
  body: Rect,
  hash: SpatialHash<Collider>,
  candidates: Collider[],
  contact: Contact,
  tuning: TuningConfig,
  staticOnly = true,
): boolean {
  const iterations = Math.max(1, tuning.collisionIterations);
  const angle = body.angle ?? 0;
  const cos = Math.abs(Math.cos(angle));
  const sin = Math.abs(Math.sin(angle));
  const extentX = body.hx * cos + body.hz * sin + tuning.collisionSkin;
  const extentZ = body.hx * sin + body.hz * cos + tuning.collisionSkin;
  let hit = false;

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    hash.queryRect(body.x, body.z, extentX, extentZ, candidates);
    let resolved = false;

    for (let i = 0; i < candidates.length; i += 1) {
      const other = candidates[i];
      if (other === body) continue;
      if (staticOnly && other.id < 0) continue;
      if (!rectRectContact(body, other, contact)) continue;
      body.x += contact.nx * contact.depth;
      body.z += contact.nz * contact.depth;
      resolved = true;
      hit = true;
    }

    if (!resolved) break;
  }

  return hit;
}
