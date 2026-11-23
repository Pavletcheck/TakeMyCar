# TakeMyCar — архитектура

Статус: **черновик M1**, версия 1 (2026-11-23). Владелец документа — `architect`.
Изменения контрактов — только через этот файл + ADR, затем задача владельцу зоны.

Документ фиксирует: карту модулей, поток данных за кадр, контракты, правила
зависимостей, владение файлами и миграцию текущего `src/main.ts`.
Связанные документы: `docs/CONCEPT.md`, `docs/ROADMAP.md`, `docs/adr/0001-stack.md`,
`docs/adr/0002-fixed-step.md`, `docs/adr/0003-collider-shape.md`.

---

## 1. Карта модулей

```
src/
  main.ts            — единственная точка входа: создать app, стартовать цикл
  app/               — композиционный корень (склейка, не логика)
    bootstrap.ts     — порядок инициализации: DOM → render → config → world → loop
    lifecycle.ts     — пауза/резюм по blur/visibilitychange/платформе (набор причин)
    debug.ts         — отладочный оверлей: fps, frame ms, draw calls, tris, коллайдеры
    platform/        — PlatformAdapter: web / yandex / vk
    save.ts          — сериализация профиля (M6, владелец ui)
  core/              — фундамент без DOM и без Three
    loop.ts          — fixedUpdate 60 Гц + render(alpha), паузы, защита от спирали
    input.ts         — устройства → действия (ActionMap), snapshot на тик
    math.ts          — vec2, clamp, lerp, angle, Rect/Collider/Contact, circleRect, rectRect (SAT)
    spatialHash.ts   — сетка 8 м: вставка/запрос/снятие устаревших
    rng.ts           — mulberry32 + range/pick/weighted
    registry.ts      — лёгкий реестр сущностей, generational id, запросы
    pool.ts          — переиспользуемые объекты (не аллоцировать в кадре)
    events.ts        — типизированная шина, без DOM и без Three в payload
    camera.ts        — расчёт состояния камеры в числах (без сцены Three)
  world/             — данные города, без Three
    generator.ts     — seeded-генерация кварталов/дорог/пропсов
    chunks.ts        — нарезка 128 м, стриминг вокруг игрока
    roadGraph.ts     — узлы/рёбра/полосы/светофоры/точки спавна
    props.ts         — пропсы и их коллайдеры
    spawn.ts         — валидация точек спавна «не в стене»
    minimap.ts       — тайлы для HUD
    world.ts         — сборка всего выше в объект World (контракт §3.4)
  entities/          — состояние игровых объектов (данные, не рендер)
    player.ts
    vehicle.ts       — состояние машины + ссылка на спек из конфига
    npc.ts           — пешеход/коп, общий набор состояний
    projectile.ts
  systems/           — логика поверх registry/world, без Three и без DOM
    vehiclePhysics.ts
    traffic.ts
    peds.ts
    wanted.ts
    combat.ts
    missions.ts
    economy.ts
  render/            — единственное место, знающее Three
    scene.ts         — WebGLRenderer, Scene, свет, viewport/resize
    materials.ts     — общие материалы/атласы
    instancing.ts    — хелперы InstancedMesh + пулы матриц
    lod.ts           — выбор LOD по экранному размеру
    assets.ts        — GLTFLoader, кэш и прогресс
    cityView.ts      — Chunk → меши (владелец world)
    vehicleView.ts   — машины, дым, следы (владелец vehicle)
    npcView.ts       — пешеходы/копы (владелец life)
    effectsView.ts   — искры, взрывы, трассеры (владелец life/vehicle)
  ui/                — DOM/HUD, не знает про Three и про физику
    hud.ts, minimap.ts, menu.ts, mobile.ts, i18n.ts, toast.ts
  config/            — типизированные данные, ноль логики
    index.ts         — сборка GameConfig (контракт §3.6)
    tuning.json, input.json, world.json, vehicles.json, life.json,
    missions.json, economy.json, ui.json, audio.json
```

Правило чтения карты: **данные текут вверх** (`config` → `core` → `world`/`entities` →
`systems` → `render`/`ui`), **события текут вниз** (`systems` → `events` → `ui`).
`app` — единственный, кто знает обо всех сразу.

---

## 2. Поток данных за кадр

```
DOM/геймпад/тач ──► core/input (сырые события → ActionMap)
                          │  InputSnapshot (value/isDown/wasPressed/wasReleased)
                          ▼
        ┌────────────────────────────────────────────────┐
        │ core/loop.fixedUpdate(1/60) × N (N ≤ 5)        │
        │                                                │
        │  1 world.update(focus)      — стриминг (не каждый тик)
        │  2 vehiclePhysics           — игрок и машины
        │  3 traffic / peds           — ИИ, часть тиков для дальних
        │  4 wanted / combat          — розыск, снаряды, попадания
        │  5 missions / economy       — условия, таймеры, награды
        │  6 registry.flush           — удаление/освобождение в пулы
        └───────────────────────┬────────────────────────┘
                                │  пишут transform.cur, transform.prev
                                ▼
                    core/registry + world (чистые данные)
                                │
             ┌──────────────────┴───────────────────┐
             │  render.sync(alpha)                  │
             │  lerp(prev, cur, alpha) → Three      │
             │  camera.apply(cameraState, alpha)    │
             └──────────────────┬───────────────────┘
                                ▼
                        renderer.render()
                                │
        events (core/events) ───┴──► ui (DOM), audio, platform (save/ad)
```

Ключевые инварианты потока:

1. **Кадр рендера не меняет игровое состояние.** `render.sync` только читает.
   Исключение — визуальные эффекты (`effectsView`), которые не влияют на логику.
2. **UI не вызывает системы напрямую.** Он отправляет интент событием
   (`ui:pauseRequested`, `mission:accept`), его обрабатывает `app`/система.
3. **Один и тот же тик видит один и тот же `InputSnapshot`.** Фронты клавиш
   сбрасываются между тиками, а не между кадрами.
4. **Логика не читает `performance.now()`.** Время приходит только из `GameLoop`.
5. **Ничего не аллоцируется в фиксированном шаге** (кроме пулов и `pool.acquire`).

---

## 3. Контракты

Ниже — публичный API модулей. Владелец зоны реализует ровно эти сигнатуры;
расширение — через новую версию документа. Все типы экспортируются из модуля-файла,
указанного в заголовке блока, импортировать «через `index.ts` пакета» запрещено,
чтобы не появилось циклов.

### 3.1 GameLoop — `src/core/loop.ts`

```ts
export type Unsubscribe = () => void;

/** Шаг симуляции. Меняется только через ADR 0002. */
export const FIXED_STEP = 1 / 60;
/** Максимум подшагов на кадр — защита от «спирали смерти». */
export const MAX_SUBSTEPS = 5;
/** Максимальная дельта кадра: после сна/фоновой вкладки время не догоняем. */
export const MAX_FRAME_DELTA = 0.25;

export type PauseReason = 'blur' | 'hidden' | 'menu' | 'platform' | 'ad' | 'debug';

export interface GameLoopOptions {
  readonly fixedStep?: number;
  readonly maxSubsteps?: number;
  readonly maxFrameDelta?: number;
}

export interface GameLoop {
  start(): void;
  stop(): void;
  /** Идемпотентно: повторный pause с той же причиной не считается. */
  pause(reason: PauseReason): void;
  /** Снимает только переданную причину; игра идёт, когда причин не осталось. */
  resume(reason: PauseReason): void;
  readonly isPaused: boolean;
  readonly pausedBy: ReadonlySet<PauseReason>;
  /** Номер последнего выполненного тика, с 0. */
  readonly tick: number;
  /** Накопленное игровое время в секундах — единственный источник времени. */
  readonly time: number;
  onFixedUpdate(cb: (dt: number, tick: number) => void): Unsubscribe;
  /** alpha ∈ [0,1) — доля незавершённого шага, для интерполяции. */
  onRender(cb: (alpha: number, frameDelta: number) => void): Unsubscribe;
}

export function createGameLoop(options?: GameLoopOptions): GameLoop;
```

Пояснения:

- Пауза — **набор причин**, а не булев флаг: `blur` + `ad` одновременно не должны
  размораживать игру при первом же `resume`.
- При паузе накопленный `accumulator` **обнуляется**, время не «догоняется».
- На каждом кадре максимум `MAX_SUBSTEPS` шагов; переполнение фиксируется в
  `app/debug.ts` счётчиком `overrun`, а не молча.
- Камера может обновляться в `onRender` (плавно), но её *цель* берётся из
  интерполированного состояния.

### 3.2 InputMap — `src/core/input.ts`

```ts
export type ActionId =
  | 'throttle' | 'brake' | 'steerLeft' | 'steerRight' | 'handbrake'
  | 'interact' | 'fire' | 'aim'
  | 'cameraLeft' | 'cameraRight' | 'zoomIn' | 'zoomOut'
  | 'pause' | 'debugToggle';

export interface ActionBinding {
  keyboard?: readonly string[];  // event.code
  mouse?: readonly number[];     // 0|1|2
  gamepad?: readonly number[];   // индексы кнопок
  touch?: readonly string[];     // id зон мобильного контрола
}

export interface PointerState {
  /** Экранные координаты в CSS-пикселях. */
  readonly x: number;
  readonly y: number;
  /** Дельта за кадр, сбрасывается в endFrame(). */
  readonly dx: number;
  readonly dy: number;
  readonly wheel: number;
  readonly buttons: number;      // битовая маска
}

export interface InputSnapshot {
  /** Аналоговое значение действия, -1..1 (стик, триггер). */
  value(action: ActionId): number;
  isDown(action: ActionId): boolean;
  /** Фронт нажатия: true только в одном фикс. шаге. */
  wasPressed(action: ActionId): boolean;
  /** Фронт отпускания: true только в одном фикс. шаге. */
  wasReleased(action: ActionId): boolean;
  readonly pointer: PointerState;
  /** Модификаторы для отладочных действий. */
  isModifierDown(mod: 'shift' | 'ctrl' | 'alt'): boolean;
}

export interface InputDevice extends InputSnapshot {
  attach(target: EventTarget): void;
  detach(): void;
  /** Опрос геймпада/тача, один раз на кадр, до фикс. шагов. */
  update(): void;
  /** Сброс фронтов, вызывается GameLoop перед каждым фикс. шагом. */
  beginTick(): void;
  /** Сброс накопленных дельт мыши/колеса, после всех шагов кадра. */
  endFrame(): void;
  /** Сброс всего при паузе/потере фокуса — иначе клавиши «залипают». */
  clear(): void;
}

export function createInput(
  bindings: Readonly<Record<ActionId, ActionBinding>>,
): InputDevice;
```

Пояснения:

- Логика видит **только действия**, никогда `KeyW`/`Space`. Привязки — в
  `config/input.json`, а не в коде физики.
- `wasPressed` живёт один фикс. шаг. Если за кадр прошло 3 шага, фронт достаётся
  первому; последующие шаги видят накопленное `isDown`.
- Тач-зоны регистрируются как действия (`touch: ['ui.stick.left']`) — `ui`
  сообщает их геометрию через `input.attach`/событие, но не пишет в физику.
- `preventDefault` (Space, стрелки) — забота `input`, а не обработчиков в `app`.

### 3.3 EntityRegistry — `src/core/registry.ts`

```ts
/** Упакованный id: index | generation << 20. Проверка живости — O(1). */
export type EntityId = number;

export type EntityKind =
  | 'player' | 'vehicle' | 'ped' | 'cop' | 'projectile' | 'marker' | 'prop';

export interface Transform2D {
  x: number;
  z: number;
  heading: number;
  vx: number;
  vz: number;
  /** Состояние на прошлом тике — только для интерполяции рендера. */
  prevX: number;
  prevZ: number;
  prevHeading: number;
}

export interface Entity {
  readonly id: EntityId;
  readonly kind: EntityKind;
  readonly transform: Transform2D;
  /** Индекс пула/массива компонента; -1, если компонента нет. */
  data: number;
}

export interface EntityRegistry {
  create(kind: EntityKind): Entity;
  destroy(id: EntityId): void;
  isAlive(id: EntityId): boolean;
  get(id: EntityId): Entity | undefined;

  /** Взять из пула (или создать) и вернуть в игру. */
  acquire(kind: EntityKind): Entity;
  /** Вернуть в пул; вызывается на flush, а не посреди шага. */
  release(id: EntityId): void;

  /** Переиспользуемый out-массив: без аллокаций в кадре. */
  query(kind: EntityKind, out: Entity[]): Entity[];
  each(kind: EntityKind, fn: (e: Entity) => void): void;
  count(kind: EntityKind): number;

  /** Удаления и возвраты в пул, накопленные за шаг. */
  flush(): void;
  clear(): void;
}

export function createRegistry(): EntityRegistry;
```

Пояснения:

- **Не ECS-фреймворк.** Сущность = запись с `Transform2D` + номер в типизированном
  массиве компонентов (`vehicleStates[i]`, `pedStates[i]`). Реестр не хранит `any`.
- `destroy` во время итерации безопасен: сущность помечается мёртвой, память
  освобождается в `flush()` в конце шага.
- Generational id защищает от «стрельбы по удалённой машине»: старый id
  становится невалидным сам.
- `Transform2D.prev*` обновляется системой перед интегрированием — это контракт
  между логикой и рендером (см. ADR 0002).

### 3.4 World — `src/world/world.ts`

```ts
import type { Collider, Rect } from '../core/math';

export interface Bounds {
  readonly minX: number;
  readonly minZ: number;
  readonly maxX: number;
  readonly maxZ: number;
}

/**
 * Форма коллайдера одна на весь проект — `Collider` из `core/math.ts`
 * (`Rect` + `id`): `angle = 0` → AABB, `angle ≠ 0` → OBB.
 * Круг — это не статический коллайдер, а сторона запроса:
 * `circleRect(cx, cz, r, rect, contact)` из `core/math.ts`.
 * См. ADR 0003.
 */

export interface RoadNode {
  id: number;
  x: number;
  z: number;
  kind: 'cross' | 't' | 'dead';
  lights?: boolean;
}
export interface RoadEdge {
  from: number;
  to: number;
  lanes: number;
  speed: number;
  oneWay: boolean;
}

export interface SpawnPoint {
  x: number;
  z: number;
  heading: number;
  /** Тип точки: машины, пешеходы, копы. */
  tag: 'car' | 'ped' | 'cop';
}

export interface Chunk {
  readonly cx: number;
  readonly cz: number;
  readonly colliders: readonly Collider[];
  readonly props: readonly PropInstance[];
  readonly minimap: MinimapTile;
  /** Числовой дескриптор для render; 0 — чанк ещё не отрисован. */
  readonly renderRef: number;
}

export interface World {
  readonly seed: number;
  readonly bounds: Bounds;
  readonly chunkSize: number;                 // 128 м
  readonly roadGraph: RoadGraph;

  /** Стриминг вокруг точки; вызывается из фикс. шага, не чаще раза в 0.25 с. */
  update(focusX: number, focusZ: number): void;

  getChunk(cx: number, cz: number): Chunk | undefined;
  readonly activeChunks: readonly Chunk[];

  /** Коллайдеры в прямоугольнике (spatial hash: ячейка 8 м). */
  queryColliders(area: Rect, out: Collider[]): Collider[];

  /** Валидированные точки спавна рядом с позицией. */
  querySpawnPoints(x: number, z: number, radius: number, tag: SpawnPoint['tag'], out: SpawnPoint[]): SpawnPoint[];

  /** Готовые тайлы для мини-карты (обновляются при стриминге). */
  readonly minimapTiles: readonly MinimapTile[];
}

export function createWorld(seed: number, config: WorldConfig): World;
```

Пояснения:

- `World` не импортирует Three. `renderRef` — число, а не объект сцены: связь
  «данные ↔ меш» держит `render/cityView.ts`.
- Форма коллайдера определена **только** в `core/math.ts`. Локальные типы вида
  `type Rect = { x, z, hx, hz }` в других модулях запрещены — именно так в
  прототипе появилось расхождение «данные города ≠ коллизии» (ревью R-09).
- `querySpawnPoints` отдаёт только точки «не в стене» — проверка внутри `world`,
  а не у каждого спавнера своя.

### 3.5 PlatformAdapter — `src/app/platform/types.ts`

```ts
export type Locale = 'ru' | 'en' | 'tr';
export type PlatformId = 'web' | 'yandex' | 'vk';

export interface SaveData {
  readonly version: number;
  readonly profile: unknown;
}

export interface PlatformAdapter {
  readonly id: PlatformId;

  /** Ленивая загрузка SDK. Для web — no-op. */
  init(): Promise<void>;
  /** Сообщить платформе, что игра готова (Yandex LoadingAPI.ready). */
  ready(): void;

  /** Начало/конец геймплея (Yandex GameplayAPI). */
  gameplayStart(): void;
  gameplayStop(): void;

  /** 0..1 — прогресс загрузки ассетов для полосы загрузки. */
  reportProgress(loaded: number, total: number): void;

  /** Полноэкранная реклама между миссиями. */
  showFullscreenAd(): Promise<'shown' | 'skipped' | 'unavailable'>;
  /** Rewarded: true — награда выдана. */
  showRewardedAd(): Promise<boolean>;

  save(data: SaveData): Promise<void>;
  load(): Promise<SaveData | null>;

  getLocale(): Locale;
  haptic(type: 'light' | 'medium' | 'heavy'): void;

  /** Платформа просит паузу/резюм — app транслирует в GameLoop.pause('platform'). */
  onPause(cb: () => void): Unsubscribe;
  onResume(cb: () => void): Unsubscribe;
}

export function createPlatform(): PlatformAdapter; // выбор по hostname/флагу
```

Пояснения:

- `init()` вызывается **до** первого кадра; `ready()` — после загрузки ассетов,
  но **до** `gameplayStart()`. Порядок фиксирован в `app/bootstrap.ts`.
- Адаптер — единственное место, где живут SDK-вызовы и `window.YaGames`/`VKBridge`.
  Больше никто в проекте не обращается к платформенным API.
- `getLocale()` — начальный язык; смена языка пользователем идёт через `ui:i18n`,
  адаптер не переопределяет выбор.

### 3.6 Config — `src/config/index.ts`

```ts
export interface TuningConfig {
  readonly fixedStep: number;        // 1/60
  readonly maxSubsteps: number;      // 5
  readonly maxFrameDelta: number;    // 0.25
  readonly spatialCellSize: number;  // 8
  readonly collisionIterations: number; // 2–4
  readonly restitution: number;      // 0.2
}

export interface WorldConfig {
  readonly seed: number;
  readonly chunkSize: number;        // 128
  readonly sizeMeters: number;       // 1200
  readonly blockStep: number;
  readonly blockHalf: number;
  readonly propsDensity: number;
}

export interface VehicleSpec {
  readonly mass: number;
  readonly accel: number;
  readonly maxSpeed: number;
  readonly steer: number;
  readonly grip: number;
  readonly brake: number;
  readonly drift: number;
  readonly hp: number;
  readonly seats: number;
}

export interface GameConfig {
  readonly tuning: TuningConfig;
  readonly world: WorldConfig;
  readonly vehicles: Readonly<Record<string, VehicleSpec>>;
  readonly life: LifeConfig;
  readonly missions: readonly MissionDef[];
  readonly economy: EconomyConfig;
  readonly ui: UiConfig;
  readonly audio: AudioConfig;
}

/** В dev — валидация схемы и значений; в prod — ре-экспорт JSON без лишнего кода. */
export function loadConfig(): GameConfig;
/** Относительный путь для тестов/реплеев: внешние данные не подмешиваются. */
export function loadConfigFrom(json: Partial<GameConfig>): GameConfig;
```

Пояснения:

- Числа баланса живут **только** в `src/config/*.json`; в коде допустимы
  `0`, `1`, `-1`, `0.5` и `Math.PI`, остальное — из конфига.
- Конфиг неизменяем (`readonly`) после загрузки. Тюнинг в рантайме — только через
  явный `applyOverrides` в `app/debug.ts` (тоже помечается на HUD).
- Валидация в dev обязательна: `NaN`, `maxSpeed <= 0`, дубли `id` миссий — ошибка
  старта, а не тихий баг в игре.
- Схема конфига — часть контракта: расширение поля = правка этого документа.

### 3.7 EventBus — `src/core/events.ts`

```ts
/** Карта событий. Домены расширяют её через declaration merging в своём файле. */
export interface GameEventMap {
  'loop:paused': { reason: PauseReason };
  'loop:resumed': { reason: PauseReason };
  'vehicle:entered': { vehicleId: EntityId; playerId: EntityId };
  'vehicle:exited': { vehicleId: EntityId; x: number; z: number };
  'vehicle:crashed': { vehicleId: EntityId; impact: number; x: number; z: number };
  'wanted:changed': { level: 0 | 1 | 2 | 3 | 4 | 5; reason: 'crime' | 'evade' | 'reset' };
  'money:changed': { total: number; delta: number };
  'mission:offered': { missionId: string };
  'mission:started': { missionId: string };
  'mission:completed': { missionId: string; reward: number };
  'mission:failed': { missionId: string; reason: 'timeout' | 'wrecked' | 'abandoned' };
  'ui:pauseRequested': { paused: boolean };
  'ui:toast': { key: string; params?: Readonly<Record<string, string | number>> };
  'save:requested': { reason: 'auto' | 'manual' };
  'save:completed': { ok: boolean };
}

export interface EventBus<E extends Record<string, unknown>> {
  on<K extends keyof E>(type: K, handler: (payload: E[K]) => void): Unsubscribe;
  once<K extends keyof E>(type: K, handler: (payload: E[K]) => void): Unsubscribe;
  emit<K extends keyof E>(type: K, payload: E[K]): void;
  /** Снять все подписки — при выходе в меню/перезапуске сцены. */
  clear(): void;
  /** Сколько подписчиков: утечка = растущее число между миссиями. */
  listenerCount(type: keyof E): number;
}

export function createEventBus<E extends Record<string, unknown>>(): EventBus<E>;
```

Правила шины (важно для ревью):

1. Синхронная доставка, в порядке подписки. Никаких `setTimeout`/микротасков.
2. Payload — **только примитивы и id**. Никаких Three-объектов, DOM-узлов,
   ссылок на `Entity` (иначе рендер и логика срастаются).
3. `on` во время `emit` безопасен: добавления применяются после рассылки,
   `off` помечает подписку мёртвой немедленно.
4. Ошибка в обработчике не ломает рассылку: `try/catch`, в dev — `console.error`
   с типом события, в prod — счётчик в `debug`.
5. `clear()` обязателен при пересоздании сцены — иначе утечка HUD-подписок.

Реализация может быть классом (`new EventBus<GameEventMap>()`), а не фабрикой:
TypeScript проверяет по структуре, главное — наличие `on/once/emit/clear/listenerCount`.
Если класс пока не умеет `once`/`listenerCount`, это допустимо до M6 (когда появятся
одноразовые подписки UI и диагностика утечек для `qa`), но `on` и `emit` менять нельзя.

---

## 4. Правила зависимостей

Разрешённые импорты (строка может импортировать столбец):

| from \ to | config | core | world | entities | systems | render | ui | app |
|---|---|---|---|---|---|---|---|---|
| config   | — | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| core     | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| world    | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| entities | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| systems  | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| render   | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| ui       | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |
| app      | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

`ui → app` разрешён только как type-only импорт (см. запрет 6 ниже); на схеме это
не отражено, чтобы не путать с рантайм-зависимостью.

Жёсткие запреты:

1. **`core` не знает `render`, DOM и Three.** `core/camera.ts` отдаёт
   `{ x, z, zoom, rotation, shake }`, применяет это `render`. Никаких `document`,
   `window`, `performance` внутри `core` (кроме `scheduler`, инжектируемого из `app`).
   Единственное исключение — `core/input.ts`: он принимает `EventTarget` через
   `attach()` и сам подписывается на события; DOM-узлы наружу не отдаёт.
2. **`systems` не импортируют `three`.** Проверка: `grep -r "from 'three'" src/systems`.
3. **`world` не импортирует `three`.** Город — данные; меши строит `render/cityView.ts`.
4. **`ui` общается только через `EventBus` и снимки состояния**, которые ему отдаёт
   `app` (деньги, звёзды, спидометр). UI не вызывает `systems.*` и не пишет в `registry`.
5. **`entities` — только данные**, без поведения. Методы, меняющиеся состояние, живут
   в `systems`.
6. **`app` — единственный, кто знает про платформу, DOM-контейнер и порядок init.**
   Исключение: `ui` может делать **type-only** импорт (`import type { PlatformAdapter,
   SaveData } from '../app/platform/types'`) — это стирается при сборке и не создаёт
   рантайм-зависимости. Любой value-импорт из `app` в `ui` запрещён.
7. **Никаких циклов.** Если `systems/traffic` нужен тип из `systems/wanted` —
   тип переносится в `entities` или в `core`.
8. **`render/**` делится на две части:** инфраструктура (`scene.ts`, `materials.ts`,
   `instancing.ts`, `lod.ts`, `assets.ts` — владелец `art3d`; `scene.ts` до M7
   временно у `core`) и доменные вью (`cityView`, `vehicleView`, `npcView`,
   `effectsView` — владелец профильного домена). Вью читают состояние, но не пишут.

Автоматическая проверка (задача `core` + `qa`, M2): скрипт
`tools/build/check-imports.mjs` в `npm run typecheck`, который падает, если:

- в `src/core/**`, `src/world/**`, `src/systems/**`, `src/entities/**` встречается
  `from 'three'`;
- в `src/core/**` встречается `document`/`window` (кроме `input.ts`, где события
  DOM приходят через `attach(target)`);
- в `src/ui/**` встречается `from 'three'` или импорт `systems/*`.

---

## 5. Владение файлами

Один файл — один владелец. Правка чужого файла — только через задачу прорабу.

| Агент | Пути (владеет) | Отдаёт наружу | Не трогает |
|---|---|---|---|
| **architect** | `docs/ARCHITECTURE.md`, `docs/adr/**`, `docs/reviews/**` | контракты, ADR, ревью | весь `src/**`, конфиги |
| **core** | `src/main.ts`, `src/core/**`, `src/app/bootstrap.ts`, `src/app/lifecycle.ts`, `src/app/debug.ts`, `src/render/scene.ts` (до M7), `src/style.css` (базовые стили), `src/config/tuning.json`, `src/config/input.json` | `GameLoop`, `InputDevice`, `EntityRegistry`, `EventBus`, `SpatialHash`, `core/camera`, `Collider` | `src/render/materials|instancing|lod`, `src/ui/**`, `src/world/**` |
| **world** | `src/world/**`, `src/render/cityView.ts`, `src/config/world.json`, `assets/maps/**` | `World`, `Chunk`, `RoadGraph`, `SpawnPoint`, `MinimapTile` | физика, ИИ, HUD, материалы |
| **vehicle** | `src/entities/vehicle.ts`, `src/systems/vehiclePhysics.ts`, `src/render/vehicleView.ts`, `src/config/vehicles.json` | `VehicleState`, `setInput`, `getSpeed`, `getLane`, хуки `engine:onRpm`/`skid:onSlip`/`crash:onImpact` | трафик-ИИ, миссии, модели |
| **life** | `src/entities/npc.ts`, `src/entities/projectile.ts`, `src/systems/traffic.ts`, `src/systems/peds.ts`, `src/systems/wanted.ts`, `src/systems/combat.ts`, `src/render/npcView.ts`, `src/render/effectsView.ts`, `src/config/life.json` | `TrafficSystem`, `PedsSystem`, `WantedSystem`, `CombatSystem`, события `wanted:*`, `vehicle:crashed` | физика машин, HUD, экономика |
| **ui** | `src/ui/**`, `src/systems/missions.ts`, `src/systems/economy.ts`, `src/app/save.ts`, `src/config/missions.json`, `src/config/economy.json`, `src/config/ui.json`, `assets/i18n/**` | `MissionSystem`, `EconomySystem`, `SaveService`, ключи локализации | физика, ИИ, `core/**` |
| **art3d** | `src/render/materials.ts`, `src/render/instancing.ts`, `src/render/lod.ts`, `src/render/assets.ts`, `assets/models/**`, `assets/materials/**`, `tools/blender/**` | GLB-ассеты, общие материалы, хелперы инстансинга, LOD | логика, `World`, HUD |
| **textures** | `assets/textures/**`, `tools/sd/**` | текстуры + `MANIFEST.md` | код, геометрия |
| **platform** | `src/app/platform/**`, `index.html`, `vite.config.ts`, `public/**` | `PlatformAdapter` и реализации, порядок SDK | геймплей, `core/loop` |
| **qa** | `tools/qa/**`, `e2e/**`, `tools/perf/**` | смоук-тесты, профили, баг-репорты | любые правки `src/**` |
| **release** | `docs/releases/**`, `docs/ci/**`, `.github/workflows/**`, `package.json` (version), git-теги | релиз-ноты, деплой, тег `m<N>` | код игры |

Спорные зоны (зафиксировано явно, чтобы не было дублей):

- `src/main.ts` — **только core**. Это композиция: импорт `app/bootstrap` + `start()`.
  Никто больше не добавляет туда логику.
- `src/style.css` — `ui` с M6 (HUD/меню); до этого базовые стили правит `core`.
- `src/render/scene.ts` — `core` до M7, затем передаётся `art3d` (освещение, тени,
  постобработка). Передача фиксируется в `docs/releases/M7.md`.
- `src/app/debug.ts` — `core`; `qa` может расширять счётчики только через задачу.
- `index.html` — `platform` (SDK-скрипты, метатеги, инлайн-заглушки). `core`
  согласует id контейнеров (`#game`, `#loading`, `#stats`).

---

## 6. Миграция текущего `src/main.ts`

Сейчас `main.ts` (404 строки) содержит весь прототип M0.5. Раскладка по владельцам:

| Строки | Что | Куда | Владелец |
|---|---|---|---|
| 1–7 | шапка, импорт Three и CSS | `src/main.ts` (2–3 строки), CSS — `src/style.css` | core |
| 9–13 | `STEP`, `BLOCK_STEP`, `BLOCK_HALF`, `GRID`, `BOUND` | `config/tuning.json` (`fixedStep`), `config/world.json` (`blockStep`, `blockHalf`, `gridRadius`) | core + world |
| 15 | `type Rect` | `core/math.ts` → `Collider` (`aabb`) | core |
| 17 | `clamp` | `core/math.ts` | core |
| 19–30 | `mulberry32`, `rand` | `core/rng.ts`; сид мира — `world` (`createWorld(seed)`) | core |
| 33–34 | `getElementById('game')` + throw | `app/bootstrap.ts` (проверка контейнера один раз) | core |
| 36–43 | `WebGLRenderer`, pixelRatio, size | `render/scene.ts` → `createRenderer(canvas, config)` | core (временно) |
| 45–47 | `Scene`, background, fog | `render/scene.ts`; цвета — `config/world.json` / `ui.json` (палитра) | core → art3d |
| 49–60 | ортокамера, `VIEW_HEIGHT`, позиция | `render/scene.ts` + `core/camera.ts` (параметры: zoom, tilt, height) | core |
| 62–76 | hemisphere + directional, shadow box | `render/scene.ts` → `createLights()` | core → art3d |
| 79 | `colliders: Rect[]` | `World.queryColliders` + `core/spatialHash.ts` | world + core |
| 81–87 | пол | `render/cityView.ts` (ground mesh) + `world` (плоскость) | world |
| 89–93 | плиты кварталов (`InstancedMesh`) | `world/generator.ts` (данные) + `render/cityView.ts` | world |
| 95–124 | генерация зданий + `colliders.push` | `world/generator.ts`; коллайдеры — из чанка | world |
| 126–143 | меши зданий | `render/cityView.ts` (инстансинг, `setColorAt`) | world |
| 145–168 | разметка, `dashPositions` | `world/generator.ts` (описания) + `render/cityView.ts` (один инстанс-меш) | world |
| 171–200 | группа машины, кузов, кабина, колёса | `assets/models/car_sedan_lod0.glb` + `render/vehicleView.ts` | art3d + vehicle |
| 202 | `car = {x,z,heading,vx,vz}` | `entities/vehicle.ts` → `VehicleState`, живёт в `registry` | vehicle |
| 205–213 | `tuning` | `config/vehicles.json` (`sedan`) | vehicle |
| 216–233 | `keys`, обработчики, `resetCar` | `core/input.ts` (ActionMap), `interact`-действие вместо `KeyR` в обработчике | core |
| 236–258 | `resolveCircleRect` | `core/math.ts` → `circleRect` + `Contact` (без аллокаций) | core |
| 260 | `speedKmh` | `vehicle.getSpeed()` через событие/снимок | vehicle |
| 262–318 | `updateCar` | `systems/vehiclePhysics.ts` + подшаг `fixedUpdate(dt)` | vehicle |
| 321–331 | `updateCamera`, слежение за солнцем | `core/camera.ts` (цель, упреждение, тряска) + `render/scene.ts` (sun follow) | core |
| 334–336 | `statsEl`, `loadingEl`, скрытие загрузки | `app/debug.ts`, `platform.ready()`/`ui` после загрузки | core + platform |
| 338–353 | `lastTime`, `accumulator`, `paused`, blur/focus/visibility | `core/loop.ts` + `app/lifecycle.ts` (набор причин паузы) | core |
| 355–369 | `updateStats`, fps | `app/debug.ts` (обновление 2 Гц, без обновления DOM каждый кадр) | core |
| 371–393 | `setAnimationLoop`, фикс. шаг, рендер | `core/loop.ts` + `app/bootstrap.ts` | core |
| 395–404 | `resize` | `render/scene.ts` → `viewport.handleResize()` (ResizeObserver + DPR) | core |

Итог: после миграции `src/main.ts` — 15–25 строк:

```ts
import './style.css';
import { bootstrap } from './app/bootstrap';
import { loadConfig } from './config';

await bootstrap(loadConfig());
```

Текущий прототип остаётся играбельным на каждом шаге: сначала выносится `loop` +
`input` (поведение не меняется), затем `math/collision`, затем город и машина.

---

## 7. Бюджеты кадра (M1–M2)

| Фаза | Бюджет | Как измеряем |
|---|---|---|
| `input.update` + `beginTick` | 0.2 мс | `performance.now()` вокруг, только в debug |
| один фикс. шаг логики | 4 мс | сумма по системам, `debug` |
| `world.update` (стриминг) | 8 мс на чанк, не каждый тик | таймер чанка |
| `render.sync` | 2 мс | debug |
| `renderer.render` | остаток до 16.6 мс | `renderer.info` |
| draw calls | < 150 | `renderer.info.render.calls` |
| треугольники | < 200 000 | `renderer.info.render.triangles` |

Отладочный оверлей показывает: fps, frame ms, overrun (пропущенные подшаги),
draw calls, tris, число сущностей по видам, число коллайдеров в запросе.

---

## 8. Детерминизм

- Один `seed` в `WorldConfig`; генератор не использует `Math.random`.
- Потоки RNG разделены по доменам (`world`, `traffic`, `missions`), чтобы генерация
  города не сдвигалась от изменения частоты спавна машин.
- Фиксированный шаг + упорядоченные системы = повторяемая последовательность
  состояний при одинаковом вводе (полезно для багрепортов и реплеев в M9).
- Порядок итерации сущностей — по возрастанию `EntityId`, не по порядку `Map`.
- Время в системах — только из аргумента `dt` и `loop.time`.

---

## 9. Открытые вопросы (нужно решение прораба)

1. **Реконсиляция сохранений (M6).** Нужна ли миграция `save.version` 1→2 при
   изменении формата профиля и сколько версий держим? Предложение: держим одну
   предыдущую, миграция — чистая функция в `app/save.ts`.
2. **Общий spatial hash для чанков и сущностей.** Один глобальный или по чанку?
   Предложение: глобальный для динамики (8 м), чанковый — для статики.
3. **Проверка импортов в CI.** Нужен ли жёсткий запрет на `three` в `systems`
   уже в M2 (скрипт) или достаточно ревью до M3?
4. **Аудио-хуки.** `audio` не выделен в отдельного агента; хуки `engine:onRpm`
   идут через `EventBus` — согласовать с прорабом на M4.

---

## Связанные ADR

- `docs/adr/0001-stack.md` — TypeScript + Vite + Three.js, ортокамера, своя физика.
- `docs/adr/0002-fixed-step.md` — фиксированный шаг 60 Гц и интерполяция.
- `docs/adr/0003-collider-shape.md` — одна форма коллайдера (`Rect` + `id`), круг в запросе.
- `docs/reviews/M1-main-review.md` — ревью прототипа `src/main.ts`.
