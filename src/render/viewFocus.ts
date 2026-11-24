// ---------------------------------------------------------------------------
// M7. Точка интереса камеры для дистанционного LOD.
//
// Камера ортографическая и следит за активной целью игрока, поэтому «центр
// кадра» — это позиция игрока (в машине или пешком). Её пишет `playerView`
// (вызывается каждый кадр), читают `vehicleView` и `npcView` для выбора LOD.
//
// Модуль намеренно без Three и без состояния кадра: три числа и две функции.
// ---------------------------------------------------------------------------

const focus = { x: 0, z: 0 };

/** Обновить центр интереса (вызывает playerView.sync). */
export function setViewFocus(x: number, z: number): void {
  focus.x = x;
  focus.z = z;
}

/** Текущий центр интереса (только чтение: объект переиспользуется). */
export function getViewFocus(): Readonly<{ x: number; z: number }> {
  return focus;
}

/** Квадрат расстояния от точки до центра интереса, м². */
export function focusDistanceSq(x: number, z: number): number {
  const dx = x - focus.x;
  const dz = z - focus.z;
  return dx * dx + dz * dz;
}
