// ---------------------------------------------------------------------------
// Ортокамера сверху: следование с демпфированием и упреждением.
// Модуль не импортирует Three.js и не знает о сцене: отдаёт позицию, цель
// взгляда и параметры фрустума, а рендер-слой переносит их в THREE.Camera.
// ---------------------------------------------------------------------------

import { clamp } from './math';

export interface FollowCameraOptions {
  /** Высота видимой области в метрах. */
  viewHeight?: number;
  /** Высота камеры над землёй. */
  height?: number;
  /** Смещение камеры назад по Z, чтобы вид был под небольшим наклоном. */
  backOffset?: number;
  /** Жёсткость демпфирования (1/с). */
  damp?: number;
  /** Время упреждения по скорости, секунды. */
  lookAhead?: number;
  /** Максимальное упреждение, метры. */
  maxLookAhead?: number;
  near?: number;
  far?: number;
}

export interface CameraFrustum {
  left: number;
  right: number;
  top: number;
  bottom: number;
  near: number;
  far: number;
}

export class FollowCamera {
  readonly position = { x: 0, y: 0, z: 0 };
  readonly target = { x: 0, y: 0, z: 0 };
  readonly frustum: CameraFrustum;

  private readonly viewHeight: number;
  private readonly height: number;
  private readonly backOffset: number;
  private readonly damp: number;
  private readonly lookAheadTime: number;
  private readonly maxLookAhead: number;

  constructor(options: FollowCameraOptions = {}) {
    this.viewHeight = options.viewHeight ?? 62;
    this.height = options.height ?? 72;
    this.backOffset = options.backOffset ?? 40;
    this.damp = options.damp ?? 6;
    this.lookAheadTime = options.lookAhead ?? 0.3;
    this.maxLookAhead = options.maxLookAhead ?? 5;

    this.frustum = {
      left: 0,
      right: 0,
      top: this.viewHeight / 2,
      bottom: -this.viewHeight / 2,
      near: options.near ?? 0.1,
      far: options.far ?? 500,
    };
    this.resize(1, 1);
  }

  /** Пересчитывает горизонтальный фрустум под текущее соотношение сторон. */
  resize(width: number, height: number): void {
    const aspect = width / Math.max(1, height);
    this.frustum.left = (-this.viewHeight * aspect) / 2;
    this.frustum.right = (this.viewHeight * aspect) / 2;
    this.frustum.top = this.viewHeight / 2;
    this.frustum.bottom = -this.viewHeight / 2;
  }

  /** Мгновенно ставит камеру на цель (старт, телепорт). */
  snapTo(x: number, z: number): void {
    this.position.x = x;
    this.position.y = this.height;
    this.position.z = z + this.backOffset;
    this.target.x = x;
    this.target.y = 0;
    this.target.z = z;
  }

  /**
   * Демпфированное следование. dt — реальное время кадра,
   * vx/vz — скорость цели для упреждения.
   */
  update(dt: number, x: number, z: number, vx: number, vz: number): void {
    const focusX = x + clamp(vx * this.lookAheadTime, -this.maxLookAhead, this.maxLookAhead);
    const focusZ = z + clamp(vz * this.lookAheadTime, -this.maxLookAhead, this.maxLookAhead);

    const k = 1 - Math.exp(-this.damp * dt);
    this.position.x += (focusX - this.position.x) * k;
    this.position.z += (focusZ + this.backOffset - this.position.z) * k;
    this.position.y = this.height;

    this.target.x = focusX;
    this.target.y = 0;
    this.target.z = focusZ;
  }
}
