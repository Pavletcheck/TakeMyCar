// ---------------------------------------------------------------------------
// Ввод: карта действий вместо сырых клавиш.
// Логика (InputMap/InputState) не зависит от DOM; единственный DOM-адаптер —
// attachKeyboard, который переводит KeyboardEvent в действия.
// ---------------------------------------------------------------------------

export type ActionName =
  | 'throttle'
  | 'brake'
  | 'steerLeft'
  | 'steerRight'
  | 'handbrake'
  | 'reset';

/**
 * Состояние ввода на один фиксированный шаг.
 * steer: +1 — влево, -1 — вправо, 0 — прямо.
 */
export interface InputState {
  throttle: number;
  brake: number;
  steer: number;
  handbrake: boolean;
  /** Одноразовое действие: true только на шаге, где клавишу нажали. */
  reset: boolean;
}

export function createInputState(): InputState {
  return { throttle: 0, brake: 0, steer: 0, handbrake: false, reset: false };
}

const KEY_BINDINGS: Readonly<Record<string, ActionName>> = {
  KeyW: 'throttle',
  ArrowUp: 'throttle',
  KeyS: 'brake',
  ArrowDown: 'brake',
  KeyA: 'steerLeft',
  ArrowLeft: 'steerLeft',
  KeyD: 'steerRight',
  ArrowRight: 'steerRight',
  Space: 'handbrake',
  KeyR: 'reset',
};

const PREVENT_DEFAULT_CODES = new Set<string>(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

/** Карта действий: хранит нажатия и одноразовые события. Никакого DOM. */
export class InputMap {
  private readonly down = new Set<ActionName>();
  private readonly pressed = new Set<ActionName>();

  press(action: ActionName): void {
    if (!this.down.has(action)) this.pressed.add(action);
    this.down.add(action);
  }

  release(action: ActionName): void {
    this.down.delete(action);
  }

  /** Сбрасывает всё (потеря фокуса, пауза). */
  clear(): void {
    this.down.clear();
    this.pressed.clear();
  }

  isDown(action: ActionName): boolean {
    return this.down.has(action);
  }

  /** Забирает одноразовое нажатие: true сбрасывается после чтения. */
  consume(action: ActionName): boolean {
    if (!this.pressed.has(action)) return false;
    this.pressed.delete(action);
    return true;
  }

  /** Заполняет переиспользуемый InputState текущим состоянием. */
  read(out: InputState): InputState {
    out.throttle = this.down.has('throttle') ? 1 : 0;
    out.brake = this.down.has('brake') ? 1 : 0;
    out.steer = (this.down.has('steerLeft') ? 1 : 0) - (this.down.has('steerRight') ? 1 : 0);
    out.handbrake = this.down.has('handbrake');
    out.reset = this.consume('reset');
    return out;
  }
}

/** Подключает клавиатуру к карте действий; возвращает функцию отписки. */
export function attachKeyboard(input: InputMap, target: Window): () => void {
  const onKeyDown = (event: KeyboardEvent): void => {
    const action = KEY_BINDINGS[event.code];
    if (!action) return;
    if (PREVENT_DEFAULT_CODES.has(event.code)) event.preventDefault();
    input.press(action);
  };

  const onKeyUp = (event: KeyboardEvent): void => {
    const action = KEY_BINDINGS[event.code];
    if (action) input.release(action);
  };

  const onBlur = (): void => input.clear();

  target.addEventListener('keydown', onKeyDown);
  target.addEventListener('keyup', onKeyUp);
  target.addEventListener('blur', onBlur);

  return () => {
    target.removeEventListener('keydown', onKeyDown);
    target.removeEventListener('keyup', onKeyUp);
    target.removeEventListener('blur', onBlur);
  };
}
