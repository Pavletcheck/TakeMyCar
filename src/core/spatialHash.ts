// ---------------------------------------------------------------------------
// Пространственный хэш (сетка 8 м) для широкой фазы коллизий.
// Вставка/обновление/удаление и запросы не аллоцируют: массивы ячеек
// переиспользуются, дубликаты в запросе отсекаются меткой (stamp).
// ---------------------------------------------------------------------------

/** Минимум, который нужен хэшу от объекта. */
export interface SpatialItem {
  id: number;
  x: number;
  z: number;
  hx: number;
  hz: number;
}

interface HashRecord<T extends SpatialItem> {
  item: T;
  minCellX: number;
  maxCellX: number;
  minCellZ: number;
  maxCellZ: number;
  stamp: number;
}

const KEY_OFFSET = 32768;
const KEY_STRIDE = 65536;

export class SpatialHash<T extends SpatialItem> {
  private readonly cellSizeInv: number;
  private readonly cells = new Map<number, HashRecord<T>[]>();
  private readonly records = new Map<number, HashRecord<T>>();
  private stamp = 0;

  constructor(cellSize = 8) {
    if (!(cellSize > 0)) throw new Error('SpatialHash: cellSize должен быть > 0');
    this.cellSizeInv = 1 / cellSize;
  }

  insert(item: T): void {
    if (this.records.has(item.id)) {
      this.update(item);
      return;
    }
    const record: HashRecord<T> = {
      item,
      minCellX: 0,
      maxCellX: 0,
      minCellZ: 0,
      maxCellZ: 0,
      stamp: 0,
    };
    this.records.set(item.id, record);
    this.addToCells(record);
  }

  /** Пересчитывает ячейки после изменения позиции/размеров. */
  update(item: T): void {
    const record = this.records.get(item.id);
    if (!record) {
      this.insert(item);
      return;
    }
    this.removeFromCells(record);
    record.item = item;
    this.addToCells(record);
  }

  remove(item: T): void {
    const record = this.records.get(item.id);
    if (!record) return;
    this.removeFromCells(record);
    this.records.delete(item.id);
  }

  /** Полная очистка с сохранением массивов ячеек под повторное использование. */
  clear(): void {
    for (const bucket of this.cells.values()) bucket.length = 0;
    this.cells.clear();
    this.records.clear();
    this.stamp = 0;
  }

  /** Количество объектов в хэше (для отладочного оверлея). */
  get size(): number {
    return this.records.size;
  }

  /** Заполняет out всеми объектами, чьи ячейки пересекают круг. */
  queryCircle(x: number, z: number, radius: number, out: T[]): T[] {
    const minCellX = Math.floor((x - radius) * this.cellSizeInv);
    const maxCellX = Math.floor((x + radius) * this.cellSizeInv);
    const minCellZ = Math.floor((z - radius) * this.cellSizeInv);
    const maxCellZ = Math.floor((z + radius) * this.cellSizeInv);
    return this.collect(minCellX, maxCellX, minCellZ, maxCellZ, out);
  }

  /** Заполняет out всеми объектами, чьи ячейки пересекают прямоугольник. */
  queryRect(x: number, z: number, hx: number, hz: number, out: T[]): T[] {
    const minCellX = Math.floor((x - hx) * this.cellSizeInv);
    const maxCellX = Math.floor((x + hx) * this.cellSizeInv);
    const minCellZ = Math.floor((z - hz) * this.cellSizeInv);
    const maxCellZ = Math.floor((z + hz) * this.cellSizeInv);
    return this.collect(minCellX, maxCellX, minCellZ, maxCellZ, out);
  }

  private collect(minCellX: number, maxCellX: number, minCellZ: number, maxCellZ: number, out: T[]): T[] {
    out.length = 0;
    const currentStamp = this.stamp + 1;
    this.stamp = currentStamp;

    for (let cellX = minCellX; cellX <= maxCellX; cellX += 1) {
      for (let cellZ = minCellZ; cellZ <= maxCellZ; cellZ += 1) {
        const bucket = this.cells.get(cellKey(cellX, cellZ));
        if (!bucket) continue;
        for (let i = 0; i < bucket.length; i += 1) {
          const record = bucket[i];
          if (record.stamp === currentStamp) continue;
          record.stamp = currentStamp;
          out.push(record.item);
        }
      }
    }

    return out;
  }

  private addToCells(record: HashRecord<T>): void {
    const item = record.item;
    const minCellX = Math.floor((item.x - item.hx) * this.cellSizeInv);
    const maxCellX = Math.floor((item.x + item.hx) * this.cellSizeInv);
    const minCellZ = Math.floor((item.z - item.hz) * this.cellSizeInv);
    const maxCellZ = Math.floor((item.z + item.hz) * this.cellSizeInv);

    record.minCellX = minCellX;
    record.maxCellX = maxCellX;
    record.minCellZ = minCellZ;
    record.maxCellZ = maxCellZ;

    for (let cellX = minCellX; cellX <= maxCellX; cellX += 1) {
      for (let cellZ = minCellZ; cellZ <= maxCellZ; cellZ += 1) {
        const key = cellKey(cellX, cellZ);
        let bucket = this.cells.get(key);
        if (!bucket) {
          bucket = [];
          this.cells.set(key, bucket);
        }
        bucket.push(record);
      }
    }
  }

  private removeFromCells(record: HashRecord<T>): void {
    for (let cellX = record.minCellX; cellX <= record.maxCellX; cellX += 1) {
      for (let cellZ = record.minCellZ; cellZ <= record.maxCellZ; cellZ += 1) {
        const key = cellKey(cellX, cellZ);
        const bucket = this.cells.get(key);
        if (!bucket) continue;
        const index = bucket.indexOf(record);
        if (index >= 0) {
          bucket[index] = bucket[bucket.length - 1];
          bucket.pop();
        }
        if (bucket.length === 0) this.cells.delete(key);
      }
    }
  }
}

/** Уникальный ключ ячейки без коллизий в пределах ±32768 ячеек (~262 км). */
function cellKey(cellX: number, cellZ: number): number {
  return (cellX + KEY_OFFSET) * KEY_STRIDE + (cellZ + KEY_OFFSET);
}
