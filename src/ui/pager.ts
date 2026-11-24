// ---------------------------------------------------------------------------
// M6. Телефон-пейджер: список заказов со статусами, наградой и временем.
// Компонент только показывает данные и сообщает о выборе; миссии и деньги
// живут в systems/missions и systems/economy.
// ---------------------------------------------------------------------------

import type { UiConfig } from '../config/ui';
import type { I18n } from './i18n';

export type PagerEntryStatus = 'available' | 'locked' | 'cooldown';

export interface PagerEntry {
  readonly id: string;
  /** Номер для клавиш 1..5. */
  readonly index: number;
  readonly title: string;
  readonly desc: string;
  readonly typeLabel: string;
  readonly reward: string;
  readonly time: string | null;
  readonly status: PagerEntryStatus;
  readonly statusNote: string | null;
}

export interface Pager {
  readonly isOpen: boolean;
  open(entries: readonly PagerEntry[], onAccept: (id: string) => void): void;
  refresh(entries: readonly PagerEntry[]): void;
  close(): void;
  dispose(): void;
}

export interface PagerOptions {
  /** Закрытие крестиком: app снимает паузу и флаг пейджера. */
  readonly onClose?: () => void;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function createPager(
  container: HTMLElement,
  i18n: I18n,
  _config: UiConfig,
  options: PagerOptions = {},
): Pager {
  const root = el('div', 'tmc-overlay tmc-pager');
  root.id = 'tmc-pager';
  root.hidden = true;

  const panel = el('div', 'tmc-panel tmc-pager__panel');
  const head = el('div', 'tmc-pager__head');
  const title = el('span', 'tmc-pager__title', i18n.t('mission.pager.title'));
  const closeButton = el('button', 'tmc-icon-button tmc-pager__close', '\u00d7');
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', i18n.t('common.close'));
  head.append(title, closeButton);

  const list = el('div', 'tmc-pager__list');
  const hint = el('div', 'tmc-pager__hint', i18n.t('mission.pager.hint'));
  panel.append(head, list, hint);
  root.appendChild(panel);
  container.appendChild(root);

  let openValue = false;
  let onAcceptValue: ((id: string) => void) | null = null;
  let entriesValue: readonly PagerEntry[] = [];

  const render = (): void => {
    list.textContent = '';
    if (entriesValue.length === 0) {
      list.appendChild(el('div', 'tmc-pager__empty', i18n.t('mission.pager.empty')));
      return;
    }
    for (const entry of entriesValue) {
      const card = el('button', 'tmc-job');
      card.type = 'button';
      card.dataset.missionId = entry.id;
      card.classList.toggle('tmc-job--locked', entry.status !== 'available');
      card.disabled = entry.status !== 'available';

      const top = el('div', 'tmc-job__top');
      top.append(
        el('span', 'tmc-job__index', String(entry.index)),
        el('span', 'tmc-job__type', entry.typeLabel),
        el('span', 'tmc-job__reward', entry.reward),
      );

      const jobTitle = el('div', 'tmc-job__title', entry.title);
      const desc = el('div', 'tmc-job__desc', entry.desc);
      const meta = el('div', 'tmc-job__meta');
      if (entry.time) meta.appendChild(el('span', 'tmc-job__time', entry.time));
      if (entry.statusNote) meta.appendChild(el('span', 'tmc-job__note', entry.statusNote));

      card.append(top, jobTitle, desc, meta);
      card.addEventListener('click', () => {
        if (entry.status !== 'available' || !onAcceptValue) return;
        onAcceptValue(entry.id);
      });
      list.appendChild(card);
    }
  };

  closeButton.addEventListener('click', () => {
    openValue = false;
    root.hidden = true;
    if (options.onClose) options.onClose();
  });

  return {
    get isOpen() {
      return openValue;
    },
    open(entries: readonly PagerEntry[], onAccept: (id: string) => void): void {
      entriesValue = entries;
      onAcceptValue = onAccept;
      openValue = true;
      title.textContent = i18n.t('mission.pager.title');
      hint.textContent = i18n.t('mission.pager.hint');
      render();
      root.hidden = false;
    },
    refresh(entries: readonly PagerEntry[]): void {
      entriesValue = entries;
      title.textContent = i18n.t('mission.pager.title');
      hint.textContent = i18n.t('mission.pager.hint');
      if (openValue) render();
    },
    close(): void {
      openValue = false;
      root.hidden = true;
    },
    dispose(): void {
      root.remove();
    },
  };
}
