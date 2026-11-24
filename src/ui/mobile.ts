// ---------------------------------------------------------------------------
// M6. Мобильное управление: виртуальный стик, газ/тормоз, ручник, действие
// и огонь. Включается только на тач-устройствах (или по настройке/`?touch=1`).
//
// Компонент не трогает InputMap ядра: он отдаёт значения в переданный
// InputState (apply) и одноразовые фронты через consume*. Приём тот же, что
// у клавиатуры, поэтому физика не знает, чем играет игрок.
// ---------------------------------------------------------------------------

import type { InputState } from '../core/input';
import type { TouchMode, UiConfig } from '../config/ui';
import type { I18n } from './i18n';

export interface MobileCallbacks {
  readonly onPause: () => void;
  readonly onMission: () => void;
  readonly onSound?: () => void;
}

export interface MobileControls {
  readonly isActive: boolean;
  readonly fireHeld: boolean;
  setMode(mode: TouchMode): void;
  apply(state: InputState): void;
  consumeInteract(): boolean;
  consumeFirePressed(): boolean;
  consumePause(): boolean;
  consumeMission(): boolean;
  refreshLabels(): void;
  /** Сбросить все нажатия (пауза, потеря фокуса): ничего не «залипает». */
  releaseAll(): void;
  update(dt: number): void;
  dispose(): void;
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('touch') === '1') return true;
    if (params.get('touch') === '0') return false;
  } catch {
    // Нет доступа к URL — проверяем только устройство.
  }
  // BUG-M6-011: тачскрин на десктопе — не повод показывать мобильные
  // контролы. Нужен основной указатель coarse (телефон/планшет) и тач.
  const hasTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
  if (!hasTouch) return false;
  try {
    return window.matchMedia('(pointer: coarse)').matches;
  } catch {
    return false;
  }
}

export function createMobileControls(
  container: HTMLElement,
  i18n: I18n,
  config: UiConfig,
  callbacks: MobileCallbacks,
): MobileControls {
  const root = document.createElement('div');
  root.className = 'tmc-mobile';
  root.id = 'tmc-mobile';
  root.hidden = true;

  // --- стик ----------------------------------------------------------------
  const stick = document.createElement('div');
  stick.className = 'tmc-stick';
  const stickThumb = document.createElement('div');
  stickThumb.className = 'tmc-stick__thumb';
  stick.appendChild(stickThumb);

  // --- кнопки --------------------------------------------------------------
  const cluster = document.createElement('div');
  cluster.className = 'tmc-touch-cluster';

  const makeButton = (
    className: string,
    glyph: string,
    labelKey: string,
  ): { readonly node: HTMLButtonElement; readonly label: HTMLSpanElement } => {
    const node = document.createElement('button');
    node.type = 'button';
    node.className = `tmc-touch-button ${className}`;
    node.textContent = glyph;
    const label = document.createElement('span');
    label.className = 'tmc-touch-button__label';
    label.textContent = i18n.t(labelKey);
    node.appendChild(label);
    node.setAttribute('aria-label', i18n.t(labelKey));
    cluster.appendChild(node);
    return { node, label };
  };

  const gas = makeButton('tmc-touch-button--gas', '\u25b2', 'mobile.gas');
  const brake = makeButton('tmc-touch-button--brake', '\u25bc', 'mobile.brake');
  const handbrake = makeButton('tmc-touch-button--handbrake', 'P', 'mobile.handbrake');
  const action = makeButton('tmc-touch-button--action', 'E', 'mobile.action');
  const fire = makeButton('tmc-touch-button--fire', '\u25cf', 'mobile.fire');

  const topBar = document.createElement('div');
  topBar.className = 'tmc-mobile__top';
  const pauseButton = document.createElement('button');
  pauseButton.type = 'button';
  pauseButton.className = 'tmc-touch-mini';
  pauseButton.textContent = 'II';
  pauseButton.setAttribute('aria-label', i18n.t('mobile.pause'));
  const missionButton = document.createElement('button');
  missionButton.type = 'button';
  missionButton.className = 'tmc-touch-mini';
  missionButton.textContent = '\u2709';
  missionButton.setAttribute('aria-label', i18n.t('mobile.mission'));
  topBar.append(pauseButton, missionButton);

  root.append(topBar, stick, cluster);
  container.appendChild(root);

  // --- состояние -----------------------------------------------------------
  let mode: TouchMode = config.settings.touch;
  let active = false;
  let stickPointer = -1;
  let stickX = 0;
  let stickY = 0;
  let shownX = 0;
  let shownY = 0;
  let gasDown = false;
  let brakeDown = false;
  let handbrakeDown = false;
  let fireHeldValue = false;
  let firePressedValue = false;
  let interactPressedValue = false;
  let pausePressedValue = false;
  let missionPressedValue = false;

  const deadzone = config.layout.stickDeadzone;

  const applyMode = (): void => {
    const visible = mode === 'on' || (mode === 'auto' && isTouchDevice());
    active = visible;
    root.hidden = !visible;
  };

  const updateStickFromEvent = (event: PointerEvent): void => {
    const rect = stick.getBoundingClientRect();
    const radius = rect.width / 2;
    const dx = (event.clientX - (rect.left + radius)) / radius;
    const dy = (event.clientY - (rect.top + radius)) / radius;
    const length = Math.hypot(dx, dy);
    if (length > 1) {
      stickX = dx / length;
      stickY = dy / length;
    } else {
      stickX = dx;
      stickY = dy;
    }
  };

  const onStickDown = (event: PointerEvent): void => {
    if (stickPointer !== -1) return;
    stickPointer = event.pointerId;
    stick.setPointerCapture(event.pointerId);
    updateStickFromEvent(event);
    event.preventDefault();
  };
  const onStickMove = (event: PointerEvent): void => {
    if (event.pointerId !== stickPointer) return;
    updateStickFromEvent(event);
    event.preventDefault();
  };
  const onStickUp = (event: PointerEvent): void => {
    if (event.pointerId !== stickPointer) return;
    stickPointer = -1;
    stickX = 0;
    stickY = 0;
  };

  stick.addEventListener('pointerdown', onStickDown);
  stick.addEventListener('pointermove', onStickMove);
  stick.addEventListener('pointerup', onStickUp);
  stick.addEventListener('pointercancel', onStickUp);

  /** Кнопка-удержание: флаг ставится на down и снимается на up/cancel. */
  const holdButton = (
    node: HTMLButtonElement,
    onDown: () => void,
    onUp: () => void,
  ): void => {
    let pointer = -1;
    node.addEventListener('pointerdown', (event) => {
      pointer = event.pointerId;
      node.setPointerCapture(event.pointerId);
      node.classList.add('tmc-touch-button--down');
      callbacks.onSound?.();
      onDown();
      event.preventDefault();
      event.stopPropagation();
    });
    const release = (event: PointerEvent): void => {
      if (event.pointerId !== pointer) return;
      pointer = -1;
      node.classList.remove('tmc-touch-button--down');
      onUp();
    };
    node.addEventListener('pointerup', release);
    node.addEventListener('pointercancel', release);
    node.addEventListener('pointerleave', (event) => {
      if (event.pointerId === pointer) release(event);
    });
  };

  holdButton(
    gas.node,
    () => {
      gasDown = true;
    },
    () => {
      gasDown = false;
    },
  );
  holdButton(
    brake.node,
    () => {
      brakeDown = true;
    },
    () => {
      brakeDown = false;
    },
  );
  holdButton(
    handbrake.node,
    () => {
      handbrakeDown = true;
    },
    () => {
      handbrakeDown = false;
    },
  );
  holdButton(
    action.node,
    () => {
      interactPressedValue = true;
    },
    () => undefined,
  );
  holdButton(
    fire.node,
    () => {
      fireHeldValue = true;
      firePressedValue = true;
    },
    () => {
      fireHeldValue = false;
    },
  );

  pauseButton.addEventListener('click', () => {
    pausePressedValue = true;
  });
  missionButton.addEventListener('click', () => {
    missionPressedValue = true;
  });

  applyMode();

  return {
    get isActive() {
      return active;
    },
    get fireHeld() {
      return active && fireHeldValue;
    },
    setMode(next: TouchMode): void {
      mode = next;
      applyMode();
    },
    apply(state: InputState): void {
      if (!active) return;
      const sx = Math.abs(stickX) > deadzone ? stickX : 0;
      const sy = Math.abs(stickY) > deadzone ? stickY : 0;
      // Стик вправо — поворот вправо: в InputState +1 = влево.
      if (sx !== 0) state.steer = clamp(state.steer - sx, -1, 1);
      // Стик вверх — газ/движение вперёд, вниз — тормоз/назад.
      if (sy < 0) state.throttle = Math.max(state.throttle, -sy);
      else if (sy > 0) state.brake = Math.max(state.brake, sy);
      if (gasDown) state.throttle = 1;
      if (brakeDown) state.brake = 1;
      if (handbrakeDown) state.handbrake = true;
    },
    consumeInteract(): boolean {
      const value = interactPressedValue;
      interactPressedValue = false;
      return value;
    },
    consumeFirePressed(): boolean {
      const value = firePressedValue;
      firePressedValue = false;
      return value;
    },
    consumePause(): boolean {
      const value = pausePressedValue;
      pausePressedValue = false;
      return value;
    },
    consumeMission(): boolean {
      const value = missionPressedValue;
      missionPressedValue = false;
      return value;
    },
    refreshLabels(): void {
      gas.label.textContent = i18n.t('mobile.gas');
      brake.label.textContent = i18n.t('mobile.brake');
      handbrake.label.textContent = i18n.t('mobile.handbrake');
      action.label.textContent = i18n.t('mobile.action');
      fire.label.textContent = i18n.t('mobile.fire');
      gas.node.setAttribute('aria-label', i18n.t('mobile.gas'));
      brake.node.setAttribute('aria-label', i18n.t('mobile.brake'));
      handbrake.node.setAttribute('aria-label', i18n.t('mobile.handbrake'));
      action.node.setAttribute('aria-label', i18n.t('mobile.action'));
      fire.node.setAttribute('aria-label', i18n.t('mobile.fire'));
      pauseButton.setAttribute('aria-label', i18n.t('mobile.pause'));
      missionButton.setAttribute('aria-label', i18n.t('mobile.mission'));
    },
    releaseAll(): void {
      stickPointer = -1;
      stickX = 0;
      stickY = 0;
      shownX = 0;
      shownY = 0;
      gasDown = false;
      brakeDown = false;
      handbrakeDown = false;
      fireHeldValue = false;
      firePressedValue = false;
      interactPressedValue = false;
      stickThumb.style.transform = 'translate(0px, 0px)';
    },
    update(dt: number): void {
      // Плавный возврат стика в центр после отпускания.
      const k = 1 - Math.exp(-18 * dt);
      shownX += (stickX - shownX) * k;
      shownY += (stickY - shownY) * k;
      if (Math.abs(shownX) < 0.001) shownX = 0;
      if (Math.abs(shownY) < 0.001) shownY = 0;
      const radius = stick.clientWidth / 2;
      const max = Math.max(0, radius - stickThumb.clientWidth / 2);
      stickThumb.style.transform = `translate(${(shownX * max).toFixed(1)}px, ${(shownY * max).toFixed(1)}px)`;
    },
    dispose(): void {
      root.remove();
    },
  };
}
