// ---------------------------------------------------------------------------
// Математика плоскости XZ: векторы, интерполяция, пересечения.
// Модуль не знает ни о Three.js, ни о DOM — только числа.
// Горячие функции не аллоцируют: результат пишется в out/contact.
// ---------------------------------------------------------------------------

const TAU = Math.PI * 2;

/** Точка или вектор в плоскости XZ (Y логикой не используется). */
export interface Vec2 {
  x: number;
  z: number;
}

/**
 * Прямоугольник с центром в (x, z) и половинами сторон (hx, hz).
 * `angle` — поворот вокруг центра в радианах, 0 — стороны параллельны осям мира.
 */
export interface Rect {
  x: number;
  z: number;
  hx: number;
  hz: number;
  angle?: number;
}

/** Статический или динамический коллайдер: прямоугольник с идентификатором. */
export interface Collider extends Rect {
  id: number;
}

/** Результат пересечения окружности с прямоугольником (нормаль + глубина). */
export interface Contact {
  /** Нормаль от прямоугольника к окружности (единичная). */
  nx: number;
  nz: number;
  /** Глубина проникновения, метры. */
  depth: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Приводит угол к диапазону [-π, π]. */
export function normalizeAngle(angle: number): number {
  let result = angle % TAU;
  if (result > Math.PI) result -= TAU;
  else if (result < -Math.PI) result += TAU;
  return result;
}

/** Интерполяция углов по кратчайшей дуге. */
export function lerpAngle(a: number, b: number, t: number): number {
  return a + normalizeAngle(b - a) * t;
}

export function createVec2(x = 0, z = 0): Vec2 {
  return { x, z };
}

export function setVec2(out: Vec2, x: number, z: number): Vec2 {
  out.x = x;
  out.z = z;
  return out;
}

export function copyVec2(out: Vec2, source: Vec2): Vec2 {
  out.x = source.x;
  out.z = source.z;
  return out;
}

export function addVec2(out: Vec2, a: Vec2, b: Vec2): Vec2 {
  out.x = a.x + b.x;
  out.z = a.z + b.z;
  return out;
}

export function subVec2(out: Vec2, a: Vec2, b: Vec2): Vec2 {
  out.x = a.x - b.x;
  out.z = a.z - b.z;
  return out;
}

export function scaleVec2(out: Vec2, v: Vec2, scalar: number): Vec2 {
  out.x = v.x * scalar;
  out.z = v.z * scalar;
  return out;
}

export function dotVec2(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.z * b.z;
}

export function lengthVec2(v: Vec2): number {
  return Math.sqrt(v.x * v.x + v.z * v.z);
}

export function lengthSqVec2(v: Vec2): number {
  return v.x * v.x + v.z * v.z;
}

/** Нормализует вектор; нулевой остаётся нулевым. */
export function normalizeVec2(out: Vec2, v: Vec2): Vec2 {
  const length = Math.sqrt(v.x * v.x + v.z * v.z);
  if (length < 1e-8) {
    out.x = 0;
    out.z = 0;
    return out;
  }
  const inv = 1 / length;
  out.x = v.x * inv;
  out.z = v.z * inv;
  return out;
}

/** Поворот вектора вокруг начала координат против часовой стрелки. */
export function rotateVec2(out: Vec2, v: Vec2, angle: number): Vec2 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const x = v.x * cos - v.z * sin;
  const z = v.x * sin + v.z * cos;
  out.x = x;
  out.z = z;
  return out;
}

/**
 * Пересечение окружности (cx, cz, radius) с прямоугольником (возможно повёрнутым).
 * При попадании заполняет contact и возвращает true. Ничего не аллоцирует.
 */
export function circleRect(cx: number, cz: number, radius: number, rect: Rect, contact: Contact): boolean {
  const angle = rect.angle ?? 0;
  const cos = angle === 0 ? 1 : Math.cos(angle);
  const sin = angle === 0 ? 0 : Math.sin(angle);

  let dx = cx - rect.x;
  let dz = cz - rect.z;
  if (angle !== 0) {
    // В локальные координаты прямоугольника (обратный поворот).
    const localX = dx * cos + dz * sin;
    const localZ = -dx * sin + dz * cos;
    dx = localX;
    dz = localZ;
  }

  const closestX = clamp(dx, -rect.hx, rect.hx);
  const closestZ = clamp(dz, -rect.hz, rect.hz);
  const ox = dx - closestX;
  const oz = dz - closestZ;
  const distSq = ox * ox + oz * oz;

  if (distSq > radius * radius) return false;

  if (distSq > 1e-12) {
    const dist = Math.sqrt(distSq);
    const inv = 1 / dist;
    contact.nx = ox * inv;
    contact.nz = oz * inv;
    contact.depth = radius - dist;
  } else {
    // Центр внутри прямоугольника: выталкиваем по минимальному проникновению.
    const penX = rect.hx + radius - Math.abs(dx);
    const penZ = rect.hz + radius - Math.abs(dz);
    if (penX < penZ) {
      contact.nx = Math.sign(dx) || 1;
      contact.nz = 0;
      contact.depth = penX;
    } else {
      contact.nx = 0;
      contact.nz = Math.sign(dz) || 1;
      contact.depth = penZ;
    }
  }

  if (angle !== 0) {
    const nx = contact.nx * cos - contact.nz * sin;
    const nz = contact.nx * sin + contact.nz * cos;
    contact.nx = nx;
    contact.nz = nz;
  }

  return true;
}

/**
 * Пересечение двух прямоугольников через SAT (4 оси: по две с каждого).
 * Работает и для повёрнутых прямоугольников, ничего не аллоцирует.
 */
export function rectRect(a: Rect, b: Rect): boolean {
  const aAngle = a.angle ?? 0;
  const bAngle = b.angle ?? 0;
  const ac = Math.cos(aAngle);
  const as = Math.sin(aAngle);
  const bc = Math.cos(bAngle);
  const bs = Math.sin(bAngle);
  const dx = b.x - a.x;
  const dz = b.z - a.z;

  for (let axis = 0; axis < 4; axis += 1) {
    let ux: number;
    let uz: number;
    if (axis === 0) {
      ux = ac;
      uz = as;
    } else if (axis === 1) {
      ux = -as;
      uz = ac;
    } else if (axis === 2) {
      ux = bc;
      uz = bs;
    } else {
      ux = -bs;
      uz = bc;
    }

    const distance = Math.abs(dx * ux + dz * uz);
    const radiusA = a.hx * Math.abs(ac * ux + as * uz) + a.hz * Math.abs(-as * ux + ac * uz);
    const radiusB = b.hx * Math.abs(bc * ux + bs * uz) + b.hz * Math.abs(-bs * ux + bc * uz);

    if (distance > radiusA + radiusB) return false;
  }

  return true;
}
