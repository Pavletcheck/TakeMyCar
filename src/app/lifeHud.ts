// ---------------------------------------------------------------------------
// M5. Временный HUD жизни города: звёзды розыска, оружие, патроны, HP.
//
// Это МОСТ в app до M6, когда HUD переедет в ui/** (по архитектуре ui знает
// только EventBus и снимки состояния). index.html и style.css не трогаем:
// элементы создаются здесь и стилизуются инлайном.
//
// Обновление — по таймеру HUD (10 Гц), не каждый кадр: DOM не дёргаем зря.
// ---------------------------------------------------------------------------

export interface LifeHudState {
  /** Уровень розыска 0..5. */
  stars: number;
  /** Здоровье игрока 0..100. */
  health: number;
  /** Название оружия из конфига. */
  weapon: string;
  mag: number;
  reserve: number;
  reloading: boolean;
  /** Игрок за рулём — подсказка меняется. */
  driving: boolean;
}

export interface LifeHud {
  update(state: LifeHudState, dt: number): void;
  /** Короткое сообщение по центру: арест, розыск снят. */
  notify(text: string): void;
  dispose(): void;
}

const STAR_FILLED = '\u2605';
const STAR_EMPTY = '\u2606';
const NOTICE_TIME = 2.4;

export function createLifeHud(container: HTMLElement | null): LifeHud {
  if (!container) {
    return { update: () => undefined, notify: () => undefined, dispose: () => undefined };
  }

  const root = document.createElement('div');
  root.id = 'life-hud';
  root.style.position = 'absolute';
  root.style.right = '12px';
  root.style.top = '12px';
  root.style.display = 'flex';
  root.style.flexDirection = 'column';
  root.style.alignItems = 'flex-end';
  root.style.gap = '4px';
  root.style.fontSize = '13px';
  root.style.fontVariantNumeric = 'tabular-nums';
  root.style.color = '#e6edf3';

  const makeLine = (): HTMLDivElement => {
    const line = document.createElement('div');
    line.style.padding = '4px 10px';
    line.style.borderRadius = '8px';
    line.style.background = 'rgba(13, 17, 23, 0.72)';
    line.style.border = '1px solid rgba(255, 255, 255, 0.12)';
    line.style.whiteSpace = 'nowrap';
    root.appendChild(line);
    return line;
  };

  const starsLine = makeLine();
  const healthLine = makeLine();
  const weaponLine = makeLine();
  const noticeLine = document.createElement('div');
  noticeLine.style.color = '#ffd43b';
  noticeLine.style.fontSize = '15px';
  noticeLine.style.padding = '2px 6px';
  root.appendChild(noticeLine);

  container.appendChild(root);

  let noticeTimer = 0;
  let lastStars = -1;
  let lastHealth = -1;
  let lastWeapon = '';

  const update = (state: LifeHudState, dt: number): void => {
    const stars = Math.max(0, Math.min(5, Math.round(state.stars)));
    if (stars !== lastStars) {
      lastStars = stars;
      let text = '';
      for (let i = 0; i < 5; i += 1) text += i < stars ? STAR_FILLED : STAR_EMPTY;
      starsLine.textContent = text;
      starsLine.style.color = stars > 0 ? '#ffd43b' : 'rgba(230, 237, 243, 0.35)';
      starsLine.style.display = stars > 0 ? 'block' : 'none';
    }

    const health = Math.round(state.health);
    if (health !== lastHealth) {
      lastHealth = health;
      healthLine.textContent = `HP ${health}`;
      healthLine.style.color = health < 30 ? '#ff6b6b' : '#e6edf3';
    }

    const ammoText = state.reloading
      ? 'перезарядка'
      : `${state.mag} / ${state.reserve}`;
    const weaponText = `${state.weapon} · ${ammoText}`;
    if (weaponText !== lastWeapon) {
      lastWeapon = weaponText;
      weaponLine.textContent = weaponText;
      weaponLine.style.color = state.mag === 0 && !state.reloading ? '#ff8787' : '#9da7b3';
    }

    if (noticeTimer > 0) {
      noticeTimer -= dt;
      if (noticeTimer <= 0) noticeLine.textContent = '';
    }
  };

  return {
    update,
    notify(text: string): void {
      noticeLine.textContent = text;
      noticeTimer = NOTICE_TIME;
    },
    dispose(): void {
      container.removeChild(root);
    },
  };
}
