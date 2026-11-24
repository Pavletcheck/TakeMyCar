// ---------------------------------------------------------------------------
// M6. Меню: стартовый экран, пауза, настройки и гараж.
//
// Меню не знает про системы: состояние (деньги, цены, настройки) приходит
// через getState(), действия уходят колбэками в app/bootstrap.
// Перерисовка — по открытию/смене вкладки/языка, а не каждый кадр.
// ---------------------------------------------------------------------------

import type { UiConfig, UiQuality, TouchMode } from '../config/ui';
import type { I18n, Lang } from './i18n';

export type MenuScreen = 'none' | 'start' | 'pause';
export type PauseTab = 'main' | 'settings' | 'shop' | 'progress';
export type SoundKind = 'click' | 'success' | 'error';

export interface MenuUpgradeView {
  readonly id: string;
  readonly name: string;
  readonly desc: string;
  readonly level: number;
  readonly maxLevel: number;
  /** null — куплен максимум. */
  readonly cost: number | null;
  readonly canBuy: boolean;
}

export interface MenuShopView {
  readonly moneyText: string;
  readonly hasVehicle: boolean;
  readonly repairCost: number;
  readonly canRepair: boolean;
  readonly repairNote: string;
  readonly paintCost: number;
  readonly canPaint: boolean;
  readonly ammoCost: number;
  readonly canAmmo: boolean;
  readonly ammoNote: string;
  readonly atGarage: boolean;
  readonly garageNote: string;
  readonly upgrades: readonly MenuUpgradeView[];
}

export interface MenuStatsView {
  readonly missions: number;
  readonly failed: number;
  readonly earned: string;
  readonly playTime: string;
}

export interface MenuAchievementView {
  readonly id: string;
  readonly title: string;
  readonly desc: string;
  readonly glyph: string;
  readonly unlocked: boolean;
  readonly progress: number;
  readonly target: number;
  readonly reward: string;
}

export interface MenuUniqueCarView {
  readonly name: string;
  readonly delivered: boolean;
}

export interface MenuJobProgressView {
  readonly name: string;
  readonly count: number;
}

/** Экран прогресса: достижения, коллекции и статистика. */
export interface MenuProgressView {
  readonly achievements: readonly MenuAchievementView[];
  readonly found: number;
  readonly total: number;
  readonly packages: { readonly found: number; readonly total: number };
  readonly ramps: { readonly found: number; readonly total: number };
  readonly cars: { readonly found: number; readonly total: number };
  readonly uniqueCars: readonly MenuUniqueCarView[];
  readonly jobs: readonly MenuJobProgressView[];
  readonly rows: readonly string[];
  readonly radio: string;
  readonly time: string;
}

export interface MenuSettingsView {
  readonly lang: Lang;
  readonly volume: number;
  readonly muted: boolean;
  readonly quality: UiQuality;
  readonly touch: TouchMode;
  readonly hints: boolean;
}

export interface MenuState {
  readonly hasSave: boolean;
  readonly settings: MenuSettingsView;
  readonly stats: MenuStatsView;
  readonly shop: MenuShopView;
  readonly progress: MenuProgressView;
}

export interface MenuCallbacks {
  readonly getState: () => MenuState;
  readonly onStart: () => void;
  readonly onResume: () => void;
  readonly onSave: () => void;
  readonly onLoad: () => void;
  readonly onReset: () => void;
  readonly onLang: (lang: Lang) => void;
  readonly onVolume: (volume: number) => void;
  readonly onMute: (muted: boolean) => void;
  readonly onQuality: (quality: UiQuality) => void;
  readonly onTouch: (mode: TouchMode) => void;
  readonly onHints: (enabled: boolean) => void;
  readonly onRepair: () => void;
  readonly onPaint: () => void;
  readonly onAmmo: () => void;
  readonly onUpgrade: (id: string) => void;
  readonly onClose: () => void;
  readonly onSound: (kind: SoundKind) => void;
}

export interface Menu {
  readonly isOpen: boolean;
  readonly screen: MenuScreen;
  openStart(): void;
  openPause(): void;
  close(): void;
  refresh(): void;
  setMessage(text: string, kind?: 'info' | 'success' | 'error'): void;
  dispose(): void;
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

function button(label: string, className: string, onClick: () => void): HTMLButtonElement {
  const node = el('button', className, label);
  node.type = 'button';
  node.addEventListener('click', onClick);
  return node;
}

export function createMenu(container: HTMLElement, i18n: I18n, config: UiConfig, callbacks: MenuCallbacks): Menu {
  const root = el('div', 'tmc-overlay tmc-menu');
  root.id = 'tmc-menu';
  root.hidden = true;

  const panel = el('div', 'tmc-panel tmc-menu__panel');
  const header = el('div', 'tmc-menu__header');
  const headerText = el('div', 'tmc-menu__header-text');
  const title = el('h1', 'tmc-menu__title', i18n.t('app.title'));
  const subtitle = el('div', 'tmc-menu__subtitle', i18n.t('app.subtitle'));
  headerText.append(title, subtitle);
  const closeButton = button('\u00d7', 'tmc-icon-button tmc-menu__close', () => callbacks.onClose());
  closeButton.setAttribute('aria-label', i18n.t('common.close'));
  header.append(headerText, closeButton);

  const tabs = el('div', 'tmc-menu__tabs');
  const body = el('div', 'tmc-menu__body');
  const message = el('div', 'tmc-menu__message');
  const footer = el('div', 'tmc-menu__footer');

  panel.append(header, tabs, body, message, footer);
  root.appendChild(panel);
  container.appendChild(root);

  let screen: MenuScreen = 'none';
  let tab: PauseTab = 'main';
  let resetArmed = false;
  let messageText = '';
  let messageKind: 'info' | 'success' | 'error' = 'info';

  const setMessageInternal = (text: string, kind: 'info' | 'success' | 'error'): void => {
    messageText = text;
    messageKind = kind;
  };

  const act = (fn: () => void): void => {
    callbacks.onSound('click');
    fn();
    render();
  };

  // --- переключатели -------------------------------------------------------

  const segmented = <T extends string>(
    options: readonly { readonly value: T; readonly label: string }[],
    current: T,
    onSelect: (value: T) => void,
  ): HTMLElement => {
    const wrap = el('div', 'tmc-segment');
    for (const option of options) {
      const node = button(option.label, 'tmc-segment__item', () => {
        if (option.value === current) return;
        act(() => onSelect(option.value));
      });
      node.classList.toggle('tmc-segment__item--active', option.value === current);
      wrap.appendChild(node);
    }
    return wrap;
  };

  const settingRow = (labelText: string, control: HTMLElement): HTMLElement => {
    const row = el('div', 'tmc-setting');
    row.append(el('span', 'tmc-setting__label', labelText), control);
    return row;
  };

  const toggleButton = (active: boolean, onLabel: string, offLabel: string, onToggle: (next: boolean) => void): HTMLButtonElement => {
    const node = button(active ? onLabel : offLabel, 'tmc-toggle', () => act(() => onToggle(!active)));
    node.classList.toggle('tmc-toggle--active', active);
    node.setAttribute('aria-pressed', active ? 'true' : 'false');
    return node;
  };

  // --- экраны --------------------------------------------------------------

  const renderStart = (state: MenuState): void => {
    body.textContent = '';
    const intro = el('p', 'tmc-menu__lead', i18n.t('app.controls'));
    const mobileHint = el('p', 'tmc-menu__lead tmc-menu__lead--dim', i18n.t('app.controlsMobile'));
    const play = button(i18n.t('app.play'), 'tmc-button tmc-button--primary tmc-button--wide', () => {
      callbacks.onSound('success');
      resetArmed = false;
      callbacks.onStart();
    });
    play.id = 'tmc-start';
    const language = segmented<Lang>(
      i18n.langs.map((lang) => ({ value: lang, label: lang.toUpperCase() })),
      state.settings.lang,
      (lang) => callbacks.onLang(lang),
    );
    const languageRow = settingRow(i18n.t('settings.language'), language);
    body.append(intro, mobileHint, play, languageRow);

    if (state.hasSave) {
      const load = button(i18n.t('menu.load'), 'tmc-button tmc-button--ghost', () => act(() => callbacks.onLoad()));
      load.id = 'tmc-load-start';
      body.appendChild(load);
    }
  };

  const renderMain = (state: MenuState): void => {
    body.textContent = '';
    const resume = button(i18n.t('menu.resume'), 'tmc-button tmc-button--primary tmc-button--wide', () => {
      callbacks.onSound('click');
      callbacks.onResume();
    });
    resume.id = 'tmc-resume';
    body.appendChild(resume);

    const actions = el('div', 'tmc-menu__row');
    const save = button(i18n.t('menu.save'), 'tmc-button', () => act(() => callbacks.onSave()));
    save.id = 'tmc-save';
    const load = button(i18n.t('menu.load'), 'tmc-button', () => act(() => callbacks.onLoad()));
    load.disabled = !state.hasSave;
    actions.append(save, load);
    body.appendChild(actions);

    const stats = el('div', 'tmc-stats');
    stats.append(
      el('div', 'tmc-stats__row', i18n.t('menu.stats.missions', { value: state.stats.missions })),
      el('div', 'tmc-stats__row', i18n.t('menu.stats.failed', { value: state.stats.failed })),
      el('div', 'tmc-stats__row', i18n.t('menu.stats.earned', { value: state.stats.earned })),
      el('div', 'tmc-stats__row', i18n.t('menu.stats.playTime', { value: state.stats.playTime })),
    );
    body.appendChild(stats);

    const reset = button(
      resetArmed ? i18n.t('common.yes') : i18n.t('menu.reset'),
      resetArmed ? 'tmc-button tmc-button--danger' : 'tmc-button tmc-button--ghost',
      () => {
        if (!resetArmed) {
          resetArmed = true;
          setMessageInternal(i18n.t('menu.resetConfirm'), 'info');
          callbacks.onSound('click');
          render();
          return;
        }
        resetArmed = false;
        act(() => callbacks.onReset());
        setMessageInternal(i18n.t('menu.resetDone'), 'success');
        render();
      },
    );
    reset.id = 'tmc-reset';
    body.appendChild(reset);
    body.appendChild(el('div', 'tmc-menu__hint', i18n.t('menu.quitHint')));
  };

  const renderSettings = (state: MenuState): void => {
    body.textContent = '';
    const settings = state.settings;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.step = '5';
    slider.value = String(Math.round(settings.volume * 100));
    slider.className = 'tmc-slider';
    slider.id = 'tmc-volume';
    slider.addEventListener('input', () => {
      callbacks.onVolume(Number(slider.value) / 100);
    });
    slider.addEventListener('change', () => callbacks.onSound('click'));
    body.appendChild(settingRow(i18n.t('settings.volume'), slider));

    body.appendChild(
      settingRow(
        i18n.t('settings.mute'),
        toggleButton(settings.muted, i18n.t('settings.on'), i18n.t('settings.off'), (next) => callbacks.onMute(next)),
      ),
    );

    body.appendChild(
      settingRow(
        i18n.t('settings.quality'),
        segmented<UiQuality>(
          (['low', 'medium', 'high'] as const).map((quality) => ({
            value: quality,
            label: i18n.t(config.quality[quality].labelKey),
          })),
          settings.quality,
          (quality) => callbacks.onQuality(quality),
        ),
      ),
    );

    body.appendChild(
      settingRow(
        i18n.t('settings.language'),
        segmented<Lang>(
          i18n.langs.map((lang) => ({ value: lang, label: lang.toUpperCase() })),
          settings.lang,
          (lang) => callbacks.onLang(lang),
        ),
      ),
    );

    body.appendChild(
      settingRow(
        i18n.t('settings.touch'),
        segmented<TouchMode>(
          (['auto', 'on', 'off'] as const).map((mode) => ({
            value: mode,
            label: i18n.t(`touch.${mode}`),
          })),
          settings.touch,
          (mode) => callbacks.onTouch(mode),
        ),
      ),
    );

    body.appendChild(
      settingRow(
        i18n.t('settings.hints'),
        toggleButton(settings.hints, i18n.t('settings.on'), i18n.t('settings.off'), (next) => callbacks.onHints(next)),
      ),
    );

    body.appendChild(
      button(i18n.t('common.back'), 'tmc-button tmc-button--ghost', () => act(() => {
        tab = 'main';
      })),
    );
  };

  const renderShop = (state: MenuState): void => {
    body.textContent = '';
    const shop = state.shop;

    const wallet = el('div', 'tmc-shop__wallet');
    wallet.append(el('span', 'tmc-shop__label', i18n.t('hud.currency')), el('span', 'tmc-shop__money', shop.moneyText));
    body.appendChild(wallet);

    const status = el('div', shop.atGarage ? 'tmc-shop__status' : 'tmc-shop__status tmc-shop__status--far', shop.garageNote);
    status.id = 'tmc-garage-status';
    body.appendChild(status);

    const repairRow = el('div', 'tmc-shop__item');
    const repairButton = button(
      `${i18n.t('shop.repair')} · ${i18n.t('hud.currency')}${shop.repairCost}`,
      'tmc-button',
      () => act(() => callbacks.onRepair()),
    );
    repairButton.disabled = !shop.canRepair;
    repairRow.append(repairButton, el('span', 'tmc-shop__note', shop.repairNote));
    body.appendChild(repairRow);

    const paintRow = el('div', 'tmc-shop__item');
    const paintButton = button(
      `${i18n.t('shop.paint')} · ${i18n.t('hud.currency')}${shop.paintCost}`,
      'tmc-button',
      () => act(() => callbacks.onPaint()),
    );
    paintButton.disabled = !shop.canPaint;
    paintRow.append(paintButton, el('span', 'tmc-shop__note', i18n.t('shop.paintHint')));
    body.appendChild(paintRow);

    const ammoRow = el('div', 'tmc-shop__item');
    const ammoButton = button(
      `${i18n.t('shop.ammo')} · ${i18n.t('hud.currency')}${shop.ammoCost}`,
      'tmc-button',
      () => act(() => callbacks.onAmmo()),
    );
    ammoButton.disabled = !shop.canAmmo;
    ammoRow.append(ammoButton, el('span', 'tmc-shop__note', shop.ammoNote));
    body.appendChild(ammoRow);

    for (const upgrade of shop.upgrades) {
      const card = el('div', 'tmc-upgrade');
      const head = el('div', 'tmc-upgrade__head');
      head.append(
        el('span', 'tmc-upgrade__name', upgrade.name),
        el(
          'span',
          'tmc-upgrade__level',
          i18n.t('shop.level', { level: upgrade.level, max: upgrade.maxLevel }),
        ),
      );
      const desc = el('div', 'tmc-upgrade__desc', upgrade.desc);
      const buy = button(
        upgrade.cost === null
          ? i18n.t('shop.max')
          : `${i18n.t('shop.buy')} · ${i18n.t('hud.currency')}${upgrade.cost}`,
        'tmc-button tmc-upgrade__buy',
        () => act(() => callbacks.onUpgrade(upgrade.id)),
      );
      buy.disabled = !upgrade.canBuy;
      card.append(head, desc, buy);
      body.appendChild(card);
    }

    body.appendChild(
      button(i18n.t('common.back'), 'tmc-button tmc-button--ghost', () => act(() => {
        tab = 'main';
      })),
    );
  };

  const renderProgress = (state: MenuState): void => {
    body.textContent = '';
    const progress = state.progress;

    const head = el('div', 'tmc-progress__head');
    const counter = el(
      'div',
      'tmc-progress__counter',
      i18n.t('achievement.counter', { found: progress.found, total: progress.total }),
    );
    const meta = el('div', 'tmc-progress__meta', `${progress.time} · ${progress.radio}`);
    head.append(counter, meta);
    body.appendChild(head);

    const rows = el('div', 'tmc-stats tmc-progress__rows');
    for (const row of progress.rows) rows.appendChild(el('div', 'tmc-stats__row', row));
    body.appendChild(rows);

    body.appendChild(el('div', 'tmc-progress__section', i18n.t('progress.achievements')));
    const grid = el('div', 'tmc-ach-grid');
    for (const achievement of progress.achievements) {
      const card = el('div', achievement.unlocked ? 'tmc-ach tmc-ach--on' : 'tmc-ach');
      const cardHead = el('div', 'tmc-ach__head');
      cardHead.append(
        el('span', 'tmc-ach__glyph', achievement.unlocked ? achievement.glyph : '·'),
        el('span', 'tmc-ach__title', achievement.title),
        el('span', 'tmc-ach__reward', achievement.reward),
      );
      const desc = el('div', 'tmc-ach__desc', achievement.desc);
      const bar = el('div', 'tmc-ach__bar');
      const fill = el('div', 'tmc-ach__fill');
      const ratio = achievement.target > 0 ? Math.min(1, achievement.progress / achievement.target) : 0;
      fill.style.width = `${(ratio * 100).toFixed(0)}%`;
      bar.appendChild(fill);
      card.append(cardHead, desc, bar);
      grid.appendChild(card);
    }
    body.appendChild(grid);

    body.appendChild(el('div', 'tmc-progress__section', i18n.t('progress.collectibles')));
    const collect = el('div', 'tmc-progress__collect');
    collect.append(
      el('div', 'tmc-progress__pill', i18n.t('progress.packages', progress.packages)),
      el('div', 'tmc-progress__pill', i18n.t('progress.ramps', progress.ramps)),
      el('div', 'tmc-progress__pill', i18n.t('progress.cars', progress.cars)),
    );
    body.appendChild(collect);

    body.appendChild(el('div', 'tmc-progress__section', i18n.t('progress.unique')));
    const cars = el('div', 'tmc-progress__list');
    for (const car of progress.uniqueCars) {
      const row = el('div', car.delivered ? 'tmc-progress__item tmc-progress__item--on' : 'tmc-progress__item');
      row.append(el('span', 'tmc-progress__item-name', car.name), el('span', 'tmc-progress__item-value', car.delivered ? '\u2713' : '\u2014'));
      cars.appendChild(row);
    }
    body.appendChild(cars);

    body.appendChild(el('div', 'tmc-progress__section', i18n.t('progress.jobs')));
    const jobList = el('div', 'tmc-progress__list');
    for (const job of progress.jobs) {
      const row = el('div', 'tmc-progress__item');
      row.append(el('span', 'tmc-progress__item-name', job.name), el('span', 'tmc-progress__item-value', String(job.count)));
      jobList.appendChild(row);
    }
    body.appendChild(jobList);

    body.appendChild(
      button(i18n.t('common.back'), 'tmc-button tmc-button--ghost', () => act(() => {
        tab = 'main';
      })),
    );
  };

  const renderTabs = (): void => {
    tabs.textContent = '';
    if (screen !== 'pause') {
      tabs.hidden = true;
      return;
    }
    tabs.hidden = false;
    const items: readonly { readonly id: PauseTab; readonly label: string }[] = [
      { id: 'main', label: i18n.t('menu.main') },
      { id: 'shop', label: i18n.t('menu.shop') },
      { id: 'progress', label: i18n.t('menu.progress') },
      { id: 'settings', label: i18n.t('menu.settings') },
    ];
    for (const item of items) {
      const node = button(item.label, 'tmc-tab', () => act(() => {
        tab = item.id;
        resetArmed = false;
        setMessageInternal('', 'info');
      }));
      node.classList.toggle('tmc-tab--active', tab === item.id);
      tabs.appendChild(node);
    }
  };

  const render = (): void => {
    if (screen === 'none') {
      root.hidden = true;
      return;
    }
    const state = callbacks.getState();
    root.hidden = false;
    root.dataset.screen = screen;
    title.textContent = screen === 'start' ? i18n.t('app.title') : i18n.t('menu.pause.title');
    subtitle.textContent = screen === 'start' ? i18n.t('app.subtitle') : '';
    subtitle.hidden = screen !== 'start';
    closeButton.hidden = screen === 'start';
    renderTabs();
    if (screen === 'start') renderStart(state);
    else if (tab === 'settings') renderSettings(state);
    else if (tab === 'shop') renderShop(state);
    else if (tab === 'progress') renderProgress(state);
    else renderMain(state);

    message.textContent = messageText;
    message.className = `tmc-menu__message tmc-menu__message--${messageKind}`;
    message.hidden = messageText.length === 0;

    footer.textContent = screen === 'pause' ? i18n.t('menu.footer') : '';
    footer.hidden = screen !== 'pause';
  };

  return {
    get isOpen() {
      return screen !== 'none';
    },
    get screen() {
      return screen;
    },
    openStart(): void {
      screen = 'start';
      tab = 'main';
      resetArmed = false;
      setMessageInternal('', 'info');
      render();
    },
    openPause(): void {
      screen = 'pause';
      tab = 'main';
      resetArmed = false;
      setMessageInternal('', 'info');
      render();
    },
    close(): void {
      screen = 'none';
      root.hidden = true;
    },
    refresh(): void {
      if (screen !== 'none') render();
    },
    setMessage(text: string, kind: 'info' | 'success' | 'error' = 'info'): void {
      setMessageInternal(text, kind);
      if (screen !== 'none') render();
    },
    dispose(): void {
      root.remove();
    },
  };
}
