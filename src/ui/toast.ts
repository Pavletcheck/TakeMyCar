// ---------------------------------------------------------------------------
// M6. Всплывающие сообщения HUD: награды, провалы, сохранение, розыск.
// Очередь ограничена, старые вытесняются: экран не превращается в ленту.
// ---------------------------------------------------------------------------

export type ToastKind = 'info' | 'success' | 'error';

interface ToastItem {
  readonly element: HTMLDivElement;
  remaining: number;
  readonly total: number;
}

export interface Toast {
  show(text: string, kind?: ToastKind, duration?: number): void;
  update(dt: number): void;
  clear(): void;
  dispose(): void;
}

const MAX_VISIBLE = 3;
const DEFAULT_DURATION = 3.2;

export function createToast(container: HTMLElement): Toast {
  const root = document.createElement('div');
  root.className = 'tmc-toasts';
  root.id = 'tmc-toasts';
  container.appendChild(root);
  const items: ToastItem[] = [];

  const remove = (item: ToastItem): void => {
    const index = items.indexOf(item);
    if (index >= 0) items.splice(index, 1);
    item.element.remove();
  };

  return {
    show(text: string, kind: ToastKind = 'info', duration = DEFAULT_DURATION): void {
      while (items.length >= MAX_VISIBLE) {
        const oldest = items[0];
        if (!oldest) break;
        remove(oldest);
      }
      const element = document.createElement('div');
      element.className = `tmc-toast tmc-toast--${kind}`;
      element.textContent = text;
      root.appendChild(element);
      items.push({ element, remaining: duration, total: duration });
    },
    update(dt: number): void {
      for (let i = items.length - 1; i >= 0; i -= 1) {
        const item = items[i];
        item.remaining -= dt;
        if (item.remaining <= 0) {
          remove(item);
          continue;
        }
        // Плавно гасим последние 0.5 с, чтобы сообщение не мигало.
        const fade = Math.min(1, item.remaining / 0.5);
        item.element.style.opacity = String(fade);
      }
    },
    clear(): void {
      for (const item of items.slice()) remove(item);
    },
    dispose(): void {
      root.remove();
      items.length = 0;
    },
  };
}
