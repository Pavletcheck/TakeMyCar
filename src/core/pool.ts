// ---------------------------------------------------------------------------
// Пул объектов с переиспользованием слотов.
// Объект хранит собственный индекс (Pooled), поэтому release — O(1),
// без поиска по массиву и без аллокаций в установившемся режиме.
// ---------------------------------------------------------------------------

/** Минимум, который нужен пулу от объекта: стабильный индекс слота. */
export interface Pooled {
  readonly index: number;
}

export class ObjectPool<T extends Pooled> {
  private readonly items: T[] = [];
  private readonly free: number[] = [];
  private readonly factory: (index: number) => T;

  constructor(factory: (index: number) => T) {
    this.factory = factory;
  }

  /** Сколько всего объектов создано (максимум одновременных слотов). */
  get size(): number {
    return this.items.length;
  }

  /** Сколько слотов свободно прямо сейчас. */
  get freeCount(): number {
    return this.free.length;
  }

  /** Объект по индексу слота. Все индексы < size всегда существуют. */
  at(index: number): T {
    return this.items[index];
  }

  /**
   * Свободный слот или новый объект. После прогрева (capacity = пик живых
   * объектов) новых объектов не создаёт.
   */
  acquire(): T {
    const reused = this.free.pop();
    if (reused !== undefined) return this.items[reused];
    const item = this.factory(this.items.length);
    this.items.push(item);
    return item;
  }

  /** Вернуть слот в пул. Повторный release того же индекса — ошибка вызывающего. */
  release(item: T): void {
    this.free.push(item.index);
  }

  /** Освободить все слоты, сохранив созданные объекты для повторного использования. */
  reset(): void {
    this.free.length = 0;
    for (let i = 0; i < this.items.length; i += 1) this.free.push(i);
  }
}
