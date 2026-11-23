// ---------------------------------------------------------------------------
// Детерминированный генератор случайных чисел (mulberry32) и хелперы.
// Один seed — одна последовательность: это база детерминизма города и трафика.
// ---------------------------------------------------------------------------

export type RandomSource = () => number;

/** Классический mulberry32: быстрый, компактный, пригоден для генерации города. */
export function mulberry32(seed: number): RandomSource {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Rng {
  /** Число в диапазоне [0, 1). */
  next(): number;
  /** Дробное число в диапазоне [min, max). */
  range(min: number, max: number): number;
  /** Целое число в диапазоне [min, max] включительно. */
  int(min: number, max: number): number;
  /** Случайный элемент массива (для пустого массива — ошибка). */
  pick<T>(items: readonly T[]): T;
  /** true с вероятностью probability. */
  chance(probability: number): boolean;
}

export function createRng(seed: number): Rng {
  const next = mulberry32(seed);
  return {
    next,
    range: (min, max) => min + next() * (max - min),
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: <T>(items: readonly T[]): T => {
      if (items.length === 0) throw new Error('createRng.pick: пустой массив');
      return items[Math.floor(next() * items.length)] as T;
    },
    chance: (probability) => next() < probability,
  };
}
