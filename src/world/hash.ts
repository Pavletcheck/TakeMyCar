// ---------------------------------------------------------------------------
// Целочисленные хэши для детерминированной генерации.
// Не RNG-поток: значение зависит только от аргументов, поэтому порядок
// обхода кварталов/рёбер не влияет на результат (ARCHITECTURE §8).
// ---------------------------------------------------------------------------

/** 32-битный хэш пары целых (квартал, вариант решения и т.п.). */
export function hash2(seed: number, a: number, b: number): number {
  let h = (seed | 0) ^ Math.imul(a | 0, 0x9e3779b1) ^ Math.imul(b | 0, 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 16), 0x7feb352d);
  h = Math.imul(h ^ (h >>> 15), 0x846ca68b);
  return (h ^ (h >>> 16)) >>> 0;
}

/** 32-битный хэш тройки целых. */
export function hash3(seed: number, a: number, b: number, c: number): number {
  let h = hash2(seed, a, b) ^ Math.imul(c | 0, 0xc2b2ae35);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  return (h ^ (h >>> 16)) >>> 0;
}

/** Дробное значение [0,1) из хэша. */
export function hash01(seed: number, a: number, b: number): number {
  return hash2(seed, a, b) / 4294967296;
}
