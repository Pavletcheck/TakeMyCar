// ---------------------------------------------------------------------------
// M6/M8. Телефон-пейджер: заказы и подработки на вкладках.
//
// Компонент только показывает данные и сообщает о выборе; миссии, работы и
// деньги живут в systems. Вкладки появились в M8, чтобы Digit* выбирал
// элемент активной вкладки, а не 12 позиций подряд (R-16).
// ---------------------------------------------------------------------------

import type { UiConfig } from '../config/ui';
import type { I18n } from './i18n';

export type PagerEntryStatus = 'available' | 'locked' | 'cooldown';

export interface PagerEntry {
  readonly id: string;
  /** Номер для клавиш 1..9. */
  readonly index: number;
  readonly title: string;
  readonly desc: string;
  readonly typeLabel: string;
  readonly reward: string;
  readonly time: string | null;
  readonly status: PagerEntryStatus;
  readonly statusNote: string | null;
}

export interface PagerTab {
  readonly id: string;
  readonly label: string;
  readonly entries: readonly PagerEntry[];
}

export interface Pager {
  readonly isOpen: boolean;
  readonly activeTab: string;
  open(tabs: readonly PagerTab[], onAccept: (id: string) => void, activeTab?: string): void;
  refresh(tabs: readonly PagerTab[], activeTab?: string): void;
  setActiveTab(id: string): void;
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

  const tabsBar = el('div', 'tmc-pager__tabs');
  const list = el('div', 'tmc-pager__list');
  const hint = el('div', 'tmc-pager__hint', i18n.t('mission.pager.hint'));
  panel.append(head, tabsBar, list, hint);
  root.appendChild(panel);
  container.appendChild(root);

  let openValue = false;
  let onAcceptValue: ((id: string) => void) | null = null;
  let tabsValue: readonly PagerTab[] = [];
  let activeTabValue = '';

  const activeEntries = (): readonly PagerEntry[] => {
    for (let i = 0; i < tabsValue.length; i += 1) {
      if (tabsValue[i].id === activeTabValue) return tabsValue[i].entries;
    }
    return tabsValue.length > 0 ? tabsValue[0].entries : [];
  };

  const renderTabs = (): void => {
    tabsBar.textContent = '';
    tabsBar.hidden = tabsValue.length <= 1;
    for (let i = 0; i < tabsValue.length; i += 1) {
      const tab = tabsValue[i];
      const node = el('button', 'tmc-pager__tab', tab.label);
      node.type = 'button';
      node.classList.toggle('tmc-pager__tab--active', tab.id === activeTabValue);
      node.addEventListener('click', () => {
        activeTabValue = tab.id;
        render();
      });
      tabsBar.appendChild(node);
    }
  };

  const render = (): void => {
    renderTabs();
    list.textContent = '';
    const entries = activeEntries();
    if (entries.length === 0) {
      list.appendChild(el('div', 'tmc-pager__empty', i18n.t('mission.pager.empty')));
      return;
    }
    for (const entry of entries) {
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

  const setActiveTab = (id: string): void => {
    for (let i = 0; i < tabsValue.length; i += 1) {
      if (tabsValue[i].id === id) {
        activeTabValue = id;
        if (openValue) render();
        return;
      }
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
    get activeTab() {
      return activeTabValue;
    },
    open(tabs: readonly PagerTab[], onAccept: (id: string) => void, activeTab?: string): void {
      tabsValue = tabs;
      onAcceptValue = onAccept;
      openValue = true;
      activeTabValue = activeTab ?? (tabs.length > 0 ? tabs[0].id : '');
      title.textContent = i18n.t('mission.pager.title');
      hint.textContent = i18n.t('mission.pager.hint');
      render();
      root.hidden = false;
    },
    refresh(tabs: readonly PagerTab[], activeTab?: string): void {
      tabsValue = tabs;
      if (activeTab !== undefined) activeTabValue = activeTab;
      if (openValue) {
        title.textContent = i18n.t('mission.pager.title');
        hint.textContent = i18n.t('mission.pager.hint');
        render();
      }
    },
    setActiveTab,
    close(): void {
      openValue = false;
      root.hidden = true;
    },
    dispose(): void {
      root.remove();
    },
  };
}
