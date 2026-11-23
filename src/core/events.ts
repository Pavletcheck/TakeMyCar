// ---------------------------------------------------------------------------
// Типизированная шина событий. Без DOM и Three.js.
// TEvents — карта «имя события → тип полезной нагрузки».
// ---------------------------------------------------------------------------

type EventHandler<T> = (payload: T) => void;

export class EventBus<TEvents extends Record<string, unknown>> {
  private readonly handlers = new Map<keyof TEvents, Set<EventHandler<never>>>();

  /** Подписка; возвращает функцию отписки. */
  on<K extends keyof TEvents>(type: K, handler: EventHandler<TEvents[K]>): () => void {
    let bucket = this.handlers.get(type);
    if (!bucket) {
      bucket = new Set<EventHandler<never>>();
      this.handlers.set(type, bucket);
    }
    bucket.add(handler as unknown as EventHandler<never>);
    return () => this.off(type, handler);
  }

  off<K extends keyof TEvents>(type: K, handler: EventHandler<TEvents[K]>): void {
    this.handlers.get(type)?.delete(handler as unknown as EventHandler<never>);
  }

  emit<K extends keyof TEvents>(type: K, payload: TEvents[K]): void {
    const bucket = this.handlers.get(type);
    if (!bucket) return;
    for (const handler of bucket) {
      // Упавший подписчик не должен останавливать рассылку остальным.
      try {
        (handler as unknown as EventHandler<TEvents[K]>)(payload);
      } catch (error) {
        console.error(`EventBus: обработчик события "${String(type)}" завершился ошибкой`, error);
      }
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}
