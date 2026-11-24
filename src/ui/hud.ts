// ---------------------------------------------------------------------------
// M6. HUD: деньги, здоровье, звёзды розыска, скорость, оружие/патроны,
// панель активного заказа с таймером и подсказка управления.
//
// HUD не читает системы напрямую: app раз в 0.1 с собирает снимок состояния
// и передаёт его в update(). DOM трогаем только при изменении значений.
// ---------------------------------------------------------------------------

import type { I18n } from './i18n';
export interface HudWeapon {
  /** Ключ локализации оружия (weapon.*). */
  readonly labelKey: string;
  readonly mag: number;
  readonly reserve: number;
  readonly reloading: boolean;
}

export interface HudMission {
  readonly title: string;
  readonly objective: string;
  /** Уже отформатированное время «1:20» либо null, если лимита нет. */
  readonly timer: string | null;
  readonly distance: string;
  /** Осталось меньше 15 секунд — панель краснеет. */
  readonly urgent: boolean;
}

export interface HudState {
  readonly money: number;
  readonly health: number;
  readonly maxHealth: number;
  readonly stars: number;
  readonly speedKmh: number;
  readonly weapon: HudWeapon;
  readonly mission: HudMission | null;
  readonly prompt: string | null;
}

export interface Hud {
  readonly root: HTMLElement;
  /** Контейнер под мини-карту: HUD владеет раскладкой правого верхнего угла. */
  readonly minimapHost: HTMLElement;
  update(state: HudState): void;
  setVisible(visible: boolean): void;
  refreshLabels(): void;
  dispose(): void;
}

const STAR_FILLED = '\u2605';
const STAR_EMPTY = '\u2606';
const STAR_SLOTS = 5;

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

export function createHud(container: HTMLElement, i18n: I18n): Hud {
  const root = el('div', 'tmc-hud');
  root.id = 'tmc-hud';

  // --- левый верх: деньги, здоровье, звёзды ---------------------------------
  const left = el('div', 'tmc-hud__left');
  const moneyPanel = el('div', 'tmc-panel tmc-money');
  moneyPanel.id = 'tmc-money';
  const moneySign = el('span', 'tmc-money__sign', i18n.t('hud.currency'));
  const moneyValue = el('span', 'tmc-money__value', '0');
  moneyPanel.append(moneySign, moneyValue);

  const healthPanel = el('div', 'tmc-panel tmc-health');
  healthPanel.id = 'tmc-health';
  const healthLabel = el('span', 'tmc-health__label', i18n.t('hud.health'));
  const healthBar = el('div', 'tmc-health__bar');
  const healthFill = el('div', 'tmc-health__fill');
  healthBar.appendChild(healthFill);
  const healthValue = el('span', 'tmc-health__value', '100');
  healthPanel.append(healthLabel, healthBar, healthValue);

  const stars = el('div', 'tmc-stars');
  stars.id = 'tmc-stars';
  for (let i = 0; i < STAR_SLOTS; i += 1) stars.appendChild(el('span', 'tmc-stars__slot', STAR_EMPTY));
  left.append(moneyPanel, healthPanel, stars);

  // --- правый верх: мини-карта и спидометр ----------------------------------
  const right = el('div', 'tmc-hud__right');
  const minimapHost = el('div', 'tmc-minimap-host');
  const speedPanel = el('div', 'tmc-panel tmc-speed');
  speedPanel.id = 'tmc-speed';
  const speedValue = el('span', 'tmc-speed__value', '0');
  const speedUnit = el('span', 'tmc-speed__unit', i18n.t('hud.speedUnit'));
  speedPanel.append(speedValue, speedUnit);
  right.append(minimapHost, speedPanel);

  // --- панель заказа --------------------------------------------------------
  const missionPanel = el('div', 'tmc-panel tmc-mission');
  missionPanel.id = 'tmc-mission';
  missionPanel.hidden = true;
  const missionHead = el('div', 'tmc-mission__head');
  const missionTag = el('span', 'tmc-mission__tag', i18n.t('hud.job'));
  const missionTitle = el('span', 'tmc-mission__title', '');
  missionHead.append(missionTag, missionTitle);
  const missionObjective = el('div', 'tmc-mission__objective', '');
  const missionFoot = el('div', 'tmc-mission__foot');
  const missionTimer = el('span', 'tmc-mission__timer', '');
  const missionDistance = el('span', 'tmc-mission__distance', '');
  missionFoot.append(missionTimer, missionDistance);
  missionPanel.append(missionHead, missionObjective, missionFoot);

  // --- оружие и подсказка ---------------------------------------------------
  const weaponPanel = el('div', 'tmc-panel tmc-weapon');
  weaponPanel.id = 'tmc-weapon';
  const weaponName = el('span', 'tmc-weapon__name', '');
  const weaponAmmo = el('span', 'tmc-weapon__ammo', '');
  weaponPanel.append(weaponName, weaponAmmo);

  const prompt = el('div', 'tmc-panel tmc-prompt');
  prompt.id = 'tmc-prompt';
  prompt.hidden = true;

  root.append(left, right, missionPanel, weaponPanel, prompt);
  container.appendChild(root);

  let lastMoney = Number.NaN;
  let lastHealth = Number.NaN;
  let lastStars = -1;
  let lastSpeed = Number.NaN;
  let lastWeapon = '';
  let lastReload = false;
  let lastMissionTitle = '';
  let lastObjective = '';
  let lastTimer = '';
  let lastDistance = '';
  let lastUrgent = false;
  let lastPrompt = '';
  let lastWeaponLabel = '';

  const paintStars = (level: number): void => {
    const clamped = Math.max(0, Math.min(STAR_SLOTS, Math.round(level)));
    for (let i = 0; i < STAR_SLOTS; i += 1) {
      const slot = stars.children[i] as HTMLElement;
      slot.textContent = i < clamped ? STAR_FILLED : STAR_EMPTY;
      slot.classList.toggle('tmc-stars__slot--on', i < clamped);
    }
    stars.hidden = clamped === 0;
  };

  return {
    root,
    minimapHost,
    update(state: HudState): void {
      const money = Math.round(state.money);
      if (money !== lastMoney) {
        lastMoney = money;
        moneyValue.textContent = i18n.formatNumber(money);
      }

      const health = Math.round(state.health);
      if (health !== lastHealth) {
        lastHealth = health;
        const pct = Math.max(0, Math.min(1, state.health / Math.max(1, state.maxHealth)));
        healthValue.textContent = String(health);
        healthFill.style.width = `${(pct * 100).toFixed(1)}%`;
        healthFill.classList.toggle('tmc-health__fill--low', pct < 0.3);
        healthPanel.classList.toggle('tmc-health--low', pct < 0.3);
      }

      if (state.stars !== lastStars) {
        lastStars = state.stars;
        paintStars(state.stars);
      }

      const speed = Math.round(state.speedKmh);
      if (speed !== lastSpeed) {
        lastSpeed = speed;
        speedValue.textContent = i18n.formatNumber(speed);
      }

      const label = i18n.t(state.weapon.labelKey);
      if (label !== lastWeaponLabel) {
        lastWeaponLabel = label;
        weaponName.textContent = label;
      }
      const reloading = state.weapon.reloading;
      const weaponText = reloading
        ? i18n.t('hud.reload')
        : `${state.weapon.mag} / ${state.weapon.reserve}`;
      if (weaponText !== lastWeapon || reloading !== lastReload) {
        lastWeapon = weaponText;
        lastReload = reloading;
        weaponAmmo.textContent = weaponText;
        weaponAmmo.classList.toggle('tmc-weapon__ammo--empty', !reloading && state.weapon.mag === 0);
      }

      const mission = state.mission;
      missionPanel.hidden = mission === null;
      if (mission) {
        if (mission.title !== lastMissionTitle) {
          lastMissionTitle = mission.title;
          missionTitle.textContent = mission.title;
        }
        if (mission.objective !== lastObjective) {
          lastObjective = mission.objective;
          missionObjective.textContent = mission.objective;
        }
        const timerText = mission.timer ?? '';
        if (timerText !== lastTimer) {
          lastTimer = timerText;
          missionTimer.textContent = timerText;
          missionTimer.hidden = timerText.length === 0;
        }
        if (mission.distance !== lastDistance) {
          lastDistance = mission.distance;
          missionDistance.textContent = mission.distance;
        }
        if (mission.urgent !== lastUrgent) {
          lastUrgent = mission.urgent;
          missionTimer.classList.toggle('tmc-mission__timer--urgent', mission.urgent);
        }
      }

      const promptText = state.prompt ?? '';
      if (promptText !== lastPrompt) {
        lastPrompt = promptText;
        prompt.textContent = promptText;
        prompt.hidden = promptText.length === 0;
      }
    },
    setVisible(visible: boolean): void {
      root.hidden = !visible;
    },
    refreshLabels(): void {
      moneySign.textContent = i18n.t('hud.currency');
      healthLabel.textContent = i18n.t('hud.health');
      speedUnit.textContent = i18n.t('hud.speedUnit');
      missionTag.textContent = i18n.t('hud.job');
      lastMoney = Number.NaN;
      lastHealth = Number.NaN;
      lastStars = -1;
      lastSpeed = Number.NaN;
      lastWeaponLabel = '';
      lastWeapon = '';
      lastObjective = '';
      lastTimer = '';
      lastDistance = '';
      lastPrompt = '';
    },
    dispose(): void {
      root.remove();
    },
  };
}

