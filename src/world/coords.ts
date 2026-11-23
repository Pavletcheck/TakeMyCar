// ---------------------------------------------------------------------------
// Координаты чанков: единые ключи и преобразования для стриминга и генератора.
// Ключ — неотрицательное целое; вне диапазона ±63 чанков ключ ломается,
// для мира 1.2 км это заведомо достаточно.
// ---------------------------------------------------------------------------

const KEY_OFFSET = 64;
const KEY_STRIDE = 128;

/** Ключ чанка по его координатам. */
export function chunkKey(cx: number, cz: number): number {
  return (cx + KEY_OFFSET) * KEY_STRIDE + (cz + KEY_OFFSET);
}

export function chunkXOf(key: number): number {
  return Math.floor(key / KEY_STRIDE) - KEY_OFFSET;
}

export function chunkZOf(key: number): number {
  return (key % KEY_STRIDE) - KEY_OFFSET;
}

/** Координата чанка, содержащего мировую точку. */
export function chunkCoordOf(value: number, chunkSize: number): number {
  return Math.floor(value / chunkSize);
}
