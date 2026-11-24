import * as THREE from 'three';
import { createGameAudio } from '../audio/audio';
import { createRadio } from '../audio/radio';
import { FollowCamera } from '../core/camera';
import { resolveRectBody } from '../core/collision';
import { attachKeyboard, createInputState, InputMap } from '../core/input';
import { GameLoop } from '../core/loop';
import { clamp, circleRect, lerp, lerpAngle } from '../core/math';
import type { Collider, Contact } from '../core/math';
import { EntityRegistry } from '../core/registry';
import type { EntityId } from '../core/registry';
import { createRng } from '../core/rng';
import { SpatialHash } from '../core/spatialHash';
import { createCityView } from '../render/cityView';
import { createEffectsView } from '../render/effectsView';
import { createLifePropsView } from '../render/lifePropsView';
import { createNightView } from '../render/nightView';
import { createNpcView } from '../render/npcView';
import { createPlayerView } from '../render/playerView';
import { createVehicleView } from '../render/vehicleView';
import { TUNING } from '../config/tuning';
import { WORLD } from '../config/world';
import type { DistrictId } from '../config/world';
import { VEHICLE_TYPES, isVehicleType, vehicleColliderRadius } from '../config/vehicles';
import { PLAYER } from '../config/player';
import { WANTED, WEAPON_ORDER } from '../config/life';
import type { VehicleTypeId } from '../config/vehicles';
import { ECONOMY } from '../config/economy';
import type { UpgradeId } from '../config/economy';
import { MISSIONS, findMission } from '../config/missions';
import type { MissionDef } from '../config/missions';
import { DAY_NIGHT, RADIO_STATIONS } from '../config/ambience';
import { buildPackageLayout, RAMPS, UNIQUE_CAR_ANCHORS } from '../config/collectibles';
import type { CollectibleBlock } from '../config/collectibles';
import { JOBS, findJobDef } from '../config/jobs';
import { UI } from '../config/ui';
import type { LangCode, TouchMode, UiQuality } from '../config/ui';
import {
  VehicleFleet,
  createVehicle,
  damageVehicle,
  destroyVehicle,
  repositionVehicle,
  repairVehicleFull,
} from '../entities/vehicle';
import type { VehicleState } from '../entities/vehicle';
import { NpcPool } from '../entities/npc';
import { IDLE_VEHICLE_INPUT, VehiclePhysics } from '../systems/vehiclePhysics';
import { PlayerController } from '../systems/playerController';
import { TrafficSystem } from '../systems/traffic';
import { PedsSystem } from '../systems/peds';
import { CombatSystem } from '../systems/combat';
import { WantedSystem } from '../systems/wanted';
import { EconomySystem } from '../systems/economy';
import { MissionSystem } from '../systems/missions';
import type { MissionHudState } from '../systems/missions';
import { EventDirector } from '../systems/eventDirector';
import type { EventSpawnPoint } from '../systems/eventDirector';
import { JobsSystem } from '../systems/jobs';
import type { JobHudState, JobSpawnRequest } from '../systems/jobs';
import { CollectiblesSystem } from '../systems/collectibles';
import type { CollectEvent } from '../systems/collectibles';
import { AchievementSystem } from '../systems/achievements';
import { DayNightCycle } from '../systems/dayNight';
import { createSaveService, SAVE_VERSION } from './save';
import type { SaveProfile, SaveSettings } from './save';
import { createHud } from '../ui/hud';
import type { HudActivity, HudMission } from '../ui/hud';
import { createI18n, detectLang } from '../ui/i18n';
import { createMenu } from '../ui/menu';
import type { MenuState, SoundKind } from '../ui/menu';
import { createMinimap } from '../ui/minimap';
import type { MinimapMarker } from '../ui/minimap';
import { createMobileControls } from '../ui/mobile';
import { createPager } from '../ui/pager';
import type { PagerEntry, PagerTab } from '../ui/pager';
import { applyTheme } from '../ui/theme';
import { createToast } from '../ui/toast';
import { DEFAULT_MAP_ID, loadCityMap } from '../world/mapLoader';
import { serializeRoadGraph } from '../world/roadGraph';
import type { SpawnPoint } from '../world/types';
import { buildWorldFromMap } from '../world/world';
import { createDebugStats, DebugOverlay } from './debug';

// ---------------------------------------------------------------------------
// M4. Композиционный корень: мир, флот машин, игрок (за рулём и пешком),
// камера, цикл, HUD и отладка. Three.js живёт только здесь и в render/**.
//
// Машина больше не «car = player.transform»: у каждой машины свой
// VehicleState в EntityRegistry, игрок — отдельная сущность. Активная цель
// камеры — машина под управлением или пешеход.
// ---------------------------------------------------------------------------

const STREAM_INTERVAL = 0.25;

const VIEW_HEIGHT = 110;
const CAMERA_HEIGHT = 130;
const CAMERA_BACK_OFFSET = 62;
const CAMERA_DAMP = 6;
const CAMERA_LOOK_AHEAD = 0.3;
const CAMERA_MAX_LOOK_AHEAD = 5;

/** Сколько городских машин ставим на точках world.spawns.cars (5–8 по брифу). */
const CITY_CAR_COUNT = 6;
/** Не ставим городскую машину слишком близко к старту игрока, м. */
const CITY_CAR_MIN_PLAYER_DISTANCE = 25;
/** Радиус свободного места под городскую машину: габарит грузовика + запас, м. */
const CITY_CAR_CLEAR_RADIUS = 3;
/** Городские типы: полицейская ставится отдельно у участка. */
const CITY_CAR_TYPES: readonly VehicleTypeId[] = ['sports', 'van', 'truck', 'sedan', 'sports', 'van'];
/** Период обновления текстового HUD, с. */
const HUD_INTERVAL = 0.1;
/** Лимит машин во флоте: 60 трафика + 8 копов + городские + игрок. */
const FLEET_VISUAL_LIMIT = 128;
/** Сколько трафика и пешеходов ставим сразу на старте (безопасная зона). */
const TRAFFIC_PREFILL = 14;
const PEDS_PREFILL = 44;
/** Радиус сигнала: пешеходы реагируют на гудок. */
const HORN_RADIUS = 20;
/** Полный газ для отладочного замера разгона. */
const FULL_THROTTLE = Object.freeze({ throttle: 1, brake: 0, steer: 0, handbrake: false });
/** Тряска камеры при ударе: длительность и амплитуда. */
const SHAKE_DURATION = 0.3;
const SHAKE_MAX = 1;
const SHAKE_SCALE = 0.55;

// Стресс-режим ?stress=1: 300 статических + 50 движущихся тел вокруг спавна.
const STRESS_SEED = 0x5157e55;
const STRESS_RADIUS = 150;
const STRESS_STATIC_HALF_MIN = 0.4;
const STRESS_STATIC_HALF_MAX = 1.2;
const STRESS_STATIC_HEIGHT = 0.7;
const STRESS_STATIC_COLOR = 0x8b93a1;
const MOVER_HALF = 0.7;
const MOVER_HEIGHT = 1.4;
const MOVER_WEAVE = 1.5;
const MOVER_LANE = 16;
const MOVER_CENTER = 38;
const MOVER_AMPLITUDE = 24;
const MOVER_COLOR = 0xffa94d;

/** Движущийся коллайдер стресс-режима: кинематика по синусу. */
interface MoverSpec {
  id: EntityId;
  handle: number;
  axis: 0 | 1;
  lane: number;
  center: number;
  amplitude: number;
  omega: number;
  phase: number;
  /** Якорь спавна: тела создавались относительно машины, а не мирового нуля. */
  anchorX: number;
  anchorZ: number;
}

/** 3D-маркер миссии: кольцо зоны + луч, чтобы цель была видна в городе. */
interface MissionMarkerView {
  set(x: number, z: number, radius: number, color: number): void;
  hide(): void;
  update(dt: number): void;
  dispose(): void;
}

function createMissionMarkerView(scene: THREE.Scene): MissionMarkerView {
  const group = new THREE.Group();
  group.visible = false;

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xffa94d,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.94, 1, 48), ringMaterial);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.14;
  ring.renderOrder = 2;

  const beamMaterial = new THREE.MeshBasicMaterial({
    color: 0xffa94d,
    transparent: true,
    opacity: 0.14,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 7, 20, 1, true), beamMaterial);
  beam.position.y = 3.5;
  beam.renderOrder = 2;

  group.add(ring, beam);
  scene.add(group);

  let time = 0;

  return {
    set(x: number, z: number, radius: number, color: number): void {
      group.position.set(x, 0, z);
      ring.scale.set(radius, radius, radius);
      const beamScale = Math.max(0.7, radius * 0.06);
      beam.scale.set(beamScale, 1, beamScale);
      ringMaterial.color.setHex(color);
      beamMaterial.color.setHex(color);
      group.visible = true;
    },
    hide(): void {
      group.visible = false;
    },
    update(dt: number): void {
      if (!group.visible) return;
      time += dt;
      ringMaterial.opacity = 0.55 + Math.sin(time * 3.2) * 0.25;
      beamMaterial.opacity = 0.1 + Math.sin(time * 2.1) * 0.05;
      group.position.y = Math.sin(time * 2) * 0.05;
    },
    dispose(): void {
      scene.remove(group);
      ring.geometry.dispose();
      ringMaterial.dispose();
      beam.geometry.dispose();
      beamMaterial.dispose();
    },
  };
}

/** Отладочный API под ?debug=1: карта, бюджеты, машины и физика. */
interface TmcDebugApi {
  readonly mapId: string;
  readonly seed: number;
  readonly layoutHash: number;
  exportRoadGraph(): string;
  stats(): Record<string, number | string>;
  /** Телепорт активной цели (машины или игрока). */
  teleport(x: number, z: number): void;
  carState(): Record<string, number | string>;
  vehicleStats(): Record<string, number | string>;
  /** Заспавнить машину; без координат — на дороге рядом с игроком. */
  spawnVehicle(type?: string, x?: number, z?: number, heading?: number): number;
  /** Нанести урон активной машине; вернуть 1, если она уничтожена. */
  damageActive(amount: number): number;
  repairActive(): void;
  enterVehicle(): number;
  exitVehicle(): number;
  /** Бенчмарк чистой физики: count машин × ticks шагов, мс. */
  physicsBench(count?: number, ticks?: number): Record<string, number>;
  /** Замер разгона до maxSpeed на пустом хэше для всех 5 типов (BUG-M4-002). */
  speedProbe(): Record<string, number | string>;
  /** Состояние стресс-режима: якорь и максимальное удаление тел от него. */
  stressState(): Record<string, number>;
  /** M5: розыск, копы, здоровье игрока. */
  wanted(): Record<string, number | string>;
  /** M5: выставить уровень розыска 0..5 (отладка и смоук). */
  setWanted(level: number): number;
  /** M5: счётчики трафика и бюджета его апдейта. */
  trafficStats(): Record<string, number>;
  /** M5: счётчики пешеходов по состояниям. */
  pedStats(): Record<string, number>;
  /** M5: спавн копа рядом (без координат — у игрока). */
  spawnCop(x?: number, z?: number): number;
  /** M5: оружие, патроны, перезарядка, отдача. */
  combatState(): Record<string, number | string>;
  /** M6: активный заказ, прогресс, маркер, кулдауны. */
  missions(): Record<string, number | string>;
  /** M6: все заказы со статусами для смоука/пейджера. */
  missionList(): Record<string, number | string>[];
  /** M6: взять заказ по id; 1 — взяли. */
  startMission(id: string): number;
  /** M6: деньги, апгрейды, накопленный доход. */
  money(): number;
  /** M6: начислить деньги (отладка/смоук). */
  addMoney(amount: number): number;
  /** M6: язык ru/en/tr без перезагрузки. */
  setLang(lang: string): string;
  /** M6: сохранить профиль; 1 — успешно. */
  saveGame(): number;
  /** M6: загрузить профиль; 1 — успешно. */
  loadGame(): number;
  /** M6: купить апгрейд (без проверки гаража). */
  buyUpgrade(id: string): number;
  /** M6: ремонт и покраска активной машины (без проверки гаража). */
  repairVehicle(): number;
  paintVehicle(): number;
  /** M6: купить патроны (без проверки гаража). */
  buyAmmo(): number;
  /** M6: цены и доступность услуг гаража. */
  shop(): Record<string, number | string>;
  /** M6: снимок интерфейса: HUD, меню, пейджер, мобилка, мини-карта. */
  uiState(): Record<string, number | string>;
  /** M8: активные события города. */
  events(): Record<string, number | string>[];
  /** M8: принудительный старт события по id (опционально с координатами). */
  forceEvent(id: string, x?: number, z?: number): number;
  /** M8: отменить все события. */
  cancelEvent(): number;
  /** M8: снимок подработки. */
  jobs(): Record<string, number | string>;
  /** M8: список подработок со статусами. */
  jobList(): Record<string, number | string>[];
  /** M8: взять подработку по id; 1 — взяли. */
  startJob(id: string): number;
  /** M8: коллекции (пакеты/трамплины/машины) и ближайший пакет. */
  collectibles(): Record<string, number | string>;
  /** M8: псевдоним collections() из QA-плана. */
  collections(): Record<string, number | string>;
  /** M8: достижения и статистика. */
  achievements(): Record<string, number | string>[];
  /** M8: радио (станция, новости). */
  radio(): Record<string, number | string>;
  /** M8: суточный цикл. */
  dayNight(): Record<string, number | string>;
  /** M8: сводка интереса (для C-10). */
  interest(): Record<string, number | string>;
}

declare global {
  interface Window {
    __tmc?: TmcDebugApi;
  }
}

export function bootstrap(): void {
  const container = document.getElementById('game');
  if (!container) throw new Error('Не найден контейнер #game');

  const params = new URLSearchParams(window.location.search);
  const debugWorld = params.get('debug') === '1';
  const showStats = debugWorld || params.get('stats') === '1';
  const stressEnabled = params.get('stress') === '1';
  // Планировка авторская и фиксированная: ?seed больше не меняет карту.
  // ?map=city выбирает файл карты из assets/maps.
  const map = loadCityMap(params.get('map') ?? DEFAULT_MAP_ID);
  const seed = map.seed;

  // --- M6: сохранение, язык, тема, слой интерфейса --------------------------
  const saveService = createSaveService();
  const savedProfile = saveService.load();
  const uiSettings: SaveSettings = {
    ...UI.settings,
    ...(savedProfile ? savedProfile.settings : {}),
  };
  const i18n = createI18n(savedProfile ? uiSettings.lang : detectLang(navigator.language));
  uiSettings.lang = i18n.lang;
  applyTheme(UI);

  const input = new InputMap();
  attachKeyboard(input, window);
  const inputState = createInputState();
  const statsElement = document.getElementById('stats');
  if (statsElement && !showStats) statsElement.hidden = true;
  const debug = new DebugOverlay(statsElement);
  const uiRoot = document.getElementById('hud') ?? document.body;
  const hud = createHud(uiRoot, i18n);
  const toast = createToast(uiRoot);
  const pager = createPager(uiRoot, i18n, UI, {
    onClose: () => closePagerPanel(),
  });
  const frameStats = createDebugStats();
  frameStats.seed = seed;
  frameStats.mapId = map.id;
  frameStats.showWorld = debugWorld;
  frameStats.stressActive = stressEnabled;

  const statsState = {
    missionsCompleted: savedProfile ? savedProfile.stats.missionsCompleted : 0,
    missionsFailed: savedProfile ? savedProfile.stats.missionsFailed : 0,
    playSeconds: savedProfile ? savedProfile.stats.playSeconds : 0,
  };

  const menu = createMenu(uiRoot, i18n, UI, {
    getState: () => buildMenuState(),
    onStart: () => startPlaying(),
    onResume: () => closePauseMenu(),
    onSave: () => {
      saveGame(false);
    },
    onLoad: () => {
      loadGame();
    },
    onReset: () => {
      resetProgress();
    },
    onLang: (lang) => setLanguage(lang),
    onVolume: (volume) => setVolume(volume),
    onMute: (muted) => setMuted(muted),
    onQuality: (quality) => setQuality(quality),
    onTouch: (mode) => setTouchMode(mode),
    onHints: (enabled) => setHints(enabled),
    onRepair: () => shopRepair(),
    onPaint: () => shopPaint(),
    onAmmo: () => shopAmmo(),
    onUpgrade: (id) => shopUpgrade(id),
    onClose: () => closePauseMenu(),
    onSound: (kind) => playSound(kind),
  });

  const mobile = createMobileControls(uiRoot, i18n, UI, {
    onPause: () => togglePauseMenu(),
    onMission: () => togglePager(),
    onSound: () => audio.ui('click'),
  });
  mobile.setMode(uiSettings.touch);
  hud.setVisible(true);

  // --- рендерер и сцена -----------------------------------------------------
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x10141a);

  const hemi = new THREE.HemisphereLight(0xcfe0ff, 0x3a2f24, 1.75);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff0d4, 2.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -65;
  sun.shadow.camera.right = 65;
  sun.shadow.camera.top = 65;
  sun.shadow.camera.bottom = -65;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 260;
  sun.shadow.bias = -0.0006;
  scene.add(sun);
  scene.add(sun.target);

  // --- мир ------------------------------------------------------------------
  // Мир собирается из авторской карты (assets/maps/city.json), а не из сида.
  const world = buildWorldFromMap(map, WORLD);
  // Мини-карта получает снимок геометрии мира: ui не импортирует world/**.
  const minimap = createMinimap(hud.minimapHost, world.minimap, UI, i18n);
  const colliderHash = world.colliders;
  const registry = new EntityRegistry(colliderHash);
  const collisionCandidates: Collider[] = [];
  const contact: Contact = { nx: 0, nz: 0, depth: 0 };
  const freeCandidates: Collider[] = [];
  const freeContact: Contact = { nx: 0, nz: 0, depth: 0 };

  const worldWidth = world.bounds.maxX - world.bounds.minX;
  const worldDepth = world.bounds.maxZ - world.bounds.minZ;
  const worldRadius = Math.hypot(worldWidth, worldDepth) / 2;
  // Туман и дальняя плоскость привязаны к bounds мира, а не к старой константе.
  const fogFar = clamp(worldRadius * 0.33, 220, 300);
  scene.fog = new THREE.Fog(0x10141a, fogFar * 0.5, fogFar);
  const cameraFar = Math.max(700, worldRadius * 1.8);

  const spawn = world.defaultSpawn;

  // --- игрок и флот машин ---------------------------------------------------
  const player = registry.create('player');
  const playerTransform = player.transform;
  playerTransform.x = spawn.x;
  playerTransform.z = spawn.z;
  playerTransform.heading = spawn.heading;
  playerTransform.prevX = spawn.x;
  playerTransform.prevZ = spawn.z;
  playerTransform.prevHeading = spawn.heading;

  const fleet = new VehicleFleet();
  // Стартовая машина — седан в точке игрока: ощущения M3 сохранены.
  const startVehicle = createVehicle(fleet, registry, {
    type: 'sedan',
    x: spawn.x,
    z: spawn.z,
    heading: spawn.heading,
    colorIndex: 0,
  });

  function placementFree(x: number, z: number, radius: number): boolean {
    colliderHash.queryCircle(x, z, radius + TUNING.collisionSkin, freeCandidates);
    for (let i = 0; i < freeCandidates.length; i += 1) {
      if (circleRect(x, z, radius, freeCandidates[i], freeContact)) return false;
    }
    return true;
  }

  /** То же, но без динамических коллайдеров: проверка «не в здании/воде». */
  function placementFreeStatic(x: number, z: number, radius: number): boolean {
    colliderHash.queryCircle(x, z, radius + TUNING.collisionSkin, freeCandidates);
    for (let i = 0; i < freeCandidates.length; i += 1) {
      if (freeCandidates[i].id < 0) continue;
      if (circleRect(x, z, radius, freeCandidates[i], freeContact)) return false;
    }
    return true;
  }

  /** Свободное место с явным исключением своего коллайдера (BUG-M4-005). */
  function placementFreeExcept(
    x: number,
    z: number,
    radius: number,
    ignoreColliderId: number,
  ): boolean {
    colliderHash.queryCircle(x, z, radius + TUNING.collisionSkin, freeCandidates);
    for (let i = 0; i < freeCandidates.length; i += 1) {
      const candidate = freeCandidates[i];
      if (candidate.id === ignoreColliderId) continue;
      if (circleRect(x, z, radius, candidate, freeContact)) return false;
    }
    return true;
  }

  /**
   * Городские машины на точках world.spawns.cars: разные типы, полицейская —
   * на точке, ближайшей к ориентиру police. Точки проверяются по SpatialHash,
   * чтобы не ставить машину в здание или на уже занятое место.
   */
  function spawnCityVehicles(): void {
    const carSpawns = world.map.spawns.cars;
    if (carSpawns.length === 0) return;

    let policeLandmarkX = Number.NaN;
    let policeLandmarkZ = Number.NaN;
    for (let i = 0; i < world.map.landmarks.length; i += 1) {
      const landmark = world.map.landmarks[i];
      if (landmark.kind === 'police') {
        policeLandmarkX = landmark.x;
        policeLandmarkZ = landmark.z;
        break;
      }
    }

    let policeIndex = -1;
    if (Number.isFinite(policeLandmarkX)) {
      let bestDistance = Number.POSITIVE_INFINITY;
      for (let i = 0; i < carSpawns.length; i += 1) {
        const dx = carSpawns[i].x - policeLandmarkX;
        const dz = carSpawns[i].z - policeLandmarkZ;
        const distance = dx * dx + dz * dz;
        if (distance < bestDistance) {
          bestDistance = distance;
          policeIndex = i;
        }
      }
    }

    const valid: number[] = [];
    for (let i = 0; i < carSpawns.length; i += 1) {
      const point = carSpawns[i];
      const dx = point.x - spawn.x;
      const dz = point.z - spawn.z;
      if (dx * dx + dz * dz < CITY_CAR_MIN_PLAYER_DISTANCE * CITY_CAR_MIN_PLAYER_DISTANCE) continue;
      if (!placementFree(point.x, point.z, CITY_CAR_CLEAR_RADIUS)) continue;
      valid.push(i);
    }

    // Добираем до 5 машин даже если часть точек занята/близка к старту.
    for (let i = 0; i < carSpawns.length && valid.length < 5; i += 1) {
      if (valid.includes(i)) continue;
      const point = carSpawns[i];
      const dx = point.x - spawn.x;
      const dz = point.z - spawn.z;
      if (dx * dx + dz * dz < CITY_CAR_MIN_PLAYER_DISTANCE * CITY_CAR_MIN_PLAYER_DISTANCE) continue;
      valid.push(i);
    }

    const chosen = valid.slice(0, CITY_CAR_COUNT);
    // Полицейская обязательно рядом с участком: если её точку не выбрали,
    // меняем последнюю выбранную на неё.
    if (policeIndex >= 0 && !chosen.includes(policeIndex)) {
      if (valid.includes(policeIndex)) {
        if (chosen.length > 0) chosen[chosen.length - 1] = policeIndex;
        else chosen.push(policeIndex);
      }
    }

    for (let i = 0; i < chosen.length; i += 1) {
      const mapIndex = chosen[i];
      const point = carSpawns[mapIndex];
      const type = mapIndex === policeIndex ? 'police' : CITY_CAR_TYPES[i % CITY_CAR_TYPES.length];
      createVehicle(fleet, registry, {
        type,
        x: point.x,
        z: point.z,
        heading: point.heading,
        colorIndex: (i + 1) % 4,
      });
    }
  }

  spawnCityVehicles();

  // --- M8: точки сцен ------------------------------------------------------
  // Событие ставится на проезжей части (полоса графа) или на тротуаре
  // (углы плит кварталов). Район нужен для веса сцен по районам.
  const eventSpawnPoints: EventSpawnPoint[] = [];
  {
    const districts = world.map.districts;
    const districtAt = (x: number, z: number): DistrictId => {
      for (let i = 0; i < districts.length; i += 1) {
        const area = districts[i].bounds;
        if (
          x >= area.x - area.hx &&
          x <= area.x + area.hx &&
          z >= area.z - area.hz &&
          z <= area.z + area.hz
        ) {
          return districts[i].id;
        }
      }
      return 'center';
    };
    const carPoints = world.roadGraph.spawnPoints;
    for (let i = 0; i < carPoints.length; i += 1) {
      const point = carPoints[i];
      if (point.tag !== 'car') continue;
      eventSpawnPoints.push({
        x: point.x,
        z: point.z,
        heading: point.heading,
        kind: 'road',
        district: districtAt(point.x, point.z),
      });
    }
    const blocks = world.map.blocks;
    for (let i = 0; i < blocks.length; i += 1) {
      const rect = blocks[i].rect;
      const dx = Math.max(1.5, rect.hx - 2.6);
      const dz = Math.max(1.5, rect.hz - 2.6);
      const corners: readonly (readonly [number, number])[] = [
        [rect.x - dx, rect.z - dz],
        [rect.x + dx, rect.z - dz],
        [rect.x + dx, rect.z + dz],
        [rect.x - dx, rect.z + dz],
      ];
      for (let k = 0; k < corners.length; k += 1) {
        eventSpawnPoints.push({
          x: corners[k][0],
          z: corners[k][1],
          heading: 0,
          kind: 'sidewalk',
          district: districtAt(corners[k][0], corners[k][1]),
        });
      }
    }
  }

  // --- стресс-режим ?stress=1 ----------------------------------------------
  const movers: MoverSpec[] = [];
  let stressTime = 0;
  const stressDummy = new THREE.Object3D();
  let stressMeshRef: THREE.InstancedMesh | null = null;
  const startX = startVehicle.transform.x;
  const startZ = startVehicle.transform.z;

  if (stressEnabled) createStressScene();

  function createStressScene(): void {
    const staticCount = TUNING.stressStaticColliders;
    const movingCount = TUNING.stressMovingColliders;
    const mesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshLambertMaterial({ color: 0xffffff }),
      staticCount + movingCount,
    );
    mesh.receiveShadow = true;
    stressMeshRef = mesh;
    const color = new THREE.Color();
    const stressRng = createRng(STRESS_SEED);

    let placed = 0;
    let attempts = 0;
    while (placed < staticCount && attempts < staticCount * 10) {
      attempts += 1;
      const x = startX + stressRng.range(-STRESS_RADIUS, STRESS_RADIUS);
      const z = startZ + stressRng.range(-STRESS_RADIUS, STRESS_RADIUS);
      // Не застраиваем точку спавна машины.
      if (Math.abs(x - startX) < 6 && Math.abs(z - startZ) < 6) continue;
      const hx = stressRng.range(STRESS_STATIC_HALF_MIN, STRESS_STATIC_HALF_MAX);
      const hz = stressRng.range(STRESS_STATIC_HALF_MIN, STRESS_STATIC_HALF_MAX);
      // Единый аллокатор мира: локальных счётчиков id в bootstrap нет (M3-A-06).
      colliderHash.insert({ id: world.allocStaticId(), x, z, hx, hz, angle: 0 });

      stressDummy.position.set(x, STRESS_STATIC_HEIGHT / 2, z);
      stressDummy.rotation.set(0, 0, 0);
      stressDummy.scale.set(hx * 2, STRESS_STATIC_HEIGHT, hz * 2);
      stressDummy.updateMatrix();
      mesh.setMatrixAt(placed, stressDummy.matrix);
      mesh.setColorAt(placed, color.setHex(STRESS_STATIC_COLOR));
      placed += 1;
    }

    const half = Math.floor(movingCount / 2);
    for (let i = 0; i < movingCount; i += 1) {
      const axis: 0 | 1 = i < half ? 0 : 1;
      const laneSign = i % 2 === 0 ? 1 : -1;
      const centerSign = Math.floor(i / 2) % 2 === 0 ? 1 : -1;
      const handle = placed + i;
      const phase = i * 2.399963229728653;
      const omega = 0.5 + (i % 5) * 0.08;
      const entity = registry.create('prop');
      const transform = entity.transform;
      transform.x =
        startX +
        (axis === 0
          ? centerSign * MOVER_CENTER + Math.sin(phase) * MOVER_AMPLITUDE
          : laneSign * MOVER_LANE + Math.cos(phase) * MOVER_WEAVE);
      transform.z =
        startZ +
        (axis === 0
          ? laneSign * MOVER_LANE + Math.cos(phase) * MOVER_WEAVE
          : centerSign * MOVER_CENTER + Math.sin(phase) * MOVER_AMPLITUDE);
      transform.prevX = transform.x;
      transform.prevZ = transform.z;
      registry.attachCollider(entity.id, MOVER_HALF, MOVER_HALF, 0);
      registry.attachRenderRef(entity.id, handle);

      const spec: MoverSpec = {
        id: entity.id,
        handle,
        axis,
        lane: laneSign * MOVER_LANE,
        center: centerSign * MOVER_CENTER,
        amplitude: MOVER_AMPLITUDE,
        omega,
        phase,
        anchorX: startX,
        anchorZ: startZ,
      };
      movers.push(spec);
      writeMoverMatrix(mesh, spec.handle, transform.x, transform.z, 0);
      mesh.setColorAt(handle, color.setHex(MOVER_COLOR));
    }

    mesh.count = placed + movingCount;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    scene.add(mesh);
  }

  function writeMoverMatrix(
    mesh: THREE.InstancedMesh,
    handle: number,
    x: number,
    z: number,
    heading: number,
  ): void {
    stressDummy.position.set(x, MOVER_HEIGHT / 2, z);
    stressDummy.rotation.set(0, heading, 0);
    stressDummy.scale.set(MOVER_HALF * 2, MOVER_HEIGHT, MOVER_HALF * 2);
    stressDummy.updateMatrix();
    mesh.setMatrixAt(handle, stressDummy.matrix);
  }

  // --- город (меши по чанкам) ----------------------------------------------
  const cityView = createCityView(scene, world.config);
  const vehicleView = createVehicleView(scene, { maxVehicles: FLEET_VISUAL_LIMIT });
  const playerView = createPlayerView(scene);

  // --- камера --------------------------------------------------------------
  const followCamera = new FollowCamera({
    viewHeight: VIEW_HEIGHT,
    height: CAMERA_HEIGHT,
    backOffset: CAMERA_BACK_OFFSET,
    damp: CAMERA_DAMP,
    lookAhead: CAMERA_LOOK_AHEAD,
    maxLookAhead: CAMERA_MAX_LOOK_AHEAD,
    far: cameraFar,
  });
  followCamera.resize(window.innerWidth, window.innerHeight);

  const camera = new THREE.OrthographicCamera(
    followCamera.frustum.left,
    followCamera.frustum.right,
    followCamera.frustum.top,
    followCamera.frustum.bottom,
    followCamera.frustum.near,
    followCamera.frustum.far,
  );
  followCamera.snapTo(spawn.x, spawn.z);

  let shakeTime = 0;
  let shakePower = 0;
  let shakePhase = 0;

  function applyCamera(): void {
    const bounds = world.bounds;
    // Камера не выезжает за пределы мира (?seed и любой размер из конфига).
    followCamera.position.x = clamp(followCamera.position.x, bounds.minX, bounds.maxX);
    followCamera.position.z = clamp(followCamera.position.z, bounds.minZ, bounds.maxZ);
    followCamera.target.x = clamp(followCamera.target.x, bounds.minX, bounds.maxX);
    followCamera.target.z = clamp(followCamera.target.z, bounds.minZ, bounds.maxZ);

    let offsetX = 0;
    let offsetZ = 0;
    if (shakeTime > 0) {
      offsetX = Math.sin(shakePhase * 1.7) * shakePower * SHAKE_SCALE;
      offsetZ = Math.cos(shakePhase * 1.3) * shakePower * SHAKE_SCALE;
    }
    camera.position.set(
      followCamera.position.x + offsetX,
      followCamera.position.y,
      followCamera.position.z + offsetZ,
    );
    camera.lookAt(
      followCamera.target.x + offsetX * 0.4,
      followCamera.target.y,
      followCamera.target.z + offsetZ * 0.4,
    );
  }

  applyCamera();

  // --- физика машин и игрок -------------------------------------------------
  const audio = createGameAudio();
  audio.setVolume(uiSettings.volume);
  audio.setMuted(uiSettings.muted);
  const physics = new VehiclePhysics(registry, fleet, colliderHash, TUNING, world.bounds, audio);
  const playerController = new PlayerController(
    fleet,
    colliderHash,
    TUNING,
    world.bounds,
    player.id,
    playerTransform,
  );
  playerController.startInVehicle(startVehicle);

  // --- жизнь города (M5): трафик, пешеходы, полиция, оружие ----------------
  // Порядок создания: физика уже есть, машины копов и трафика используют её.
  const effectsView = createEffectsView(scene);
  const npcView = createNpcView(scene);
  /** Отдельный пул для пеших копов: пешеходов не вытесняют. */
  const copPool = new NpcPool(WANTED.maxCops + 8);
  const blockRects = world.map.blocks.map((block) => block.rect);

  const traffic = new TrafficSystem({
    registry,
    fleet,
    hash: colliderHash,
    graph: world.roadGraph,
    physics,
    bounds: world.bounds,
    seed: world.seed ^ 0x7a11,
  });
  const peds = new PedsSystem({
    registry,
    fleet,
    hash: colliderHash,
    blocks: blockRects,
    water: world.map.water,
    bounds: world.bounds,
    playerId: player.id,
    seed: world.seed ^ 0x51ed,
  });
  const combat = new CombatSystem({
    hash: colliderHash,
    fleet,
    pools: [peds.pool, copPool],
    playerId: player.id,
    seed: world.seed ^ 0xc0ff,
  });
  const wanted = new WantedSystem({
    registry,
    fleet,
    hash: colliderHash,
    graph: world.roadGraph,
    physics,
    combat,
    npcPool: copPool,
    playerId: player.id,
    seed: world.seed ^ 0x9a71,
  });

  // Связка систем: преступления, паника, эффекты. Системы не знают друг о друге.
  peds.onCrime = (kind, x, z) => wanted.addCrime(kind, x, z);
  combat.onCrime = (kind, x, z) => wanted.addCrime(kind, x, z);
  combat.onGunshot = (x, z) => peds.gunshot(x, z);
  combat.onShot = (x1, z1, x2, z2, hit) => effectsView.tracer(x1, z1, x2, z2, hit);
  combat.onImpact = (x, z, hit) => effectsView.impact(x, z, hit);
  traffic.onHonk = (x, z) => peds.alertAt(x, z, 16, 'alert');
  wanted.onLevelChanged = (level) => {
    maxWantedStars = Math.max(maxWantedStars, level);
    if (level > 0) {
      toast.show(i18n.t('toast.starsUp', { level }), 'error', 2.4);
      playSound('error');
      radio.news(i18n.t('radio.news.crime', { level }));
    } else {
      toast.show(i18n.t('toast.starsClear'), 'success', 2.4);
    }
  };
  wanted.onPlayerCaught = (reason) => {
    // Арест или «выведен из строя»: игрок в безопасную точку, розыск сброшен.
    const point = pickRespawn(spawn.x, spawn.z, 3.5);
    const vehicle = playerController.vehicle;
    if (playerController.mode === 'driving' && vehicle) {
      repositionVehicle(registry, vehicle, point.x, point.z, point.heading);
      repairVehicleFull(vehicle);
      playerController.syncInsideVehicle();
    } else {
      playerController.teleport(point.x, point.z);
    }
    followCamera.snapTo(point.x, point.z);
    world.prefetch(point.x, point.z);
    shakeTime = 0;
    wanted.reset();
    toast.show(
      i18n.t(reason === 'arrest' ? 'toast.arrest' : 'toast.down'),
      'error',
      3,
    );
    playSound('error');
  };

  // --- M6: экономика и миссии ----------------------------------------------
  const economy = new EconomySystem({
    config: ECONOMY,
    onChanged: (change) => {
      if (change.delta > 0) playSound('success');
    },
    onPaintReset: () => {
      wanted.reset();
    },
    onRefill: () => {
      // Деньги уже списаны в economy.buyAmmo (BUG-M6-007).
      combat.refill();
    },
    onAmmoNeeded: () => {
      const spec = combat.weaponSpec;
      return combat.magAmmo < spec.mag || combat.reserveAmmo < spec.reserve;
    },
  });
  let missionCar: VehicleState | null = null;

  const missions = new MissionSystem({
    missions: MISSIONS,
    completed: savedProfile ? savedProfile.missions.completed : undefined,
    cooldowns: savedProfile ? savedProfile.missions.cooldowns : undefined,
    onStart: (def) => {
      audio.mission('start');
      return spawnMissionCar(def)?.id ?? null;
    },
    onStage: () => {
      audio.mission('pickup');
      toast.show(i18n.t('mission.stageChanged'), 'info', 1.6);
    },
    onComplete: (def, baseReward) => {
      const reward = Math.round(baseReward * economy.rewardMultiplier);
      economy.add(reward, 'mission');
      statsState.missionsCompleted += 1;
      toast.show(
        i18n.t('mission.completed', {
          title: i18n.t(def.titleKey),
          reward: `${i18n.t('hud.currency')}${i18n.formatNumber(reward)}`,
        }),
        'success',
        4,
      );
      audio.mission('complete');
      radio.news(i18n.t('radio.news.mission', { title: i18n.t(def.titleKey) }));
      releaseMissionCar();
      saveGame(true);
    },
    onFail: (def, reason) => {
      const heat = Math.max(0, def.heatOnFail - economy.heatRelief);
      if (heat > 0) wanted.setLevel(Math.max(wanted.level, heat));
      statsState.missionsFailed += 1;
      toast.show(i18n.t(`mission.failed.${reason}`), 'error', 4);
      audio.mission('fail');
      releaseMissionCar();
    },
    onOffer: () => {
      toast.show(i18n.t('mission.newOffer'), 'info');
      playSound('success');
    },
  });

  /** Машина под заказ «угон»: ставится на проезжую часть у точки старта. */
  function spawnMissionCar(def: MissionDef): VehicleState | null {
    if (!def.vehicleClass) return null;
    let x = def.start[0];
    let z = def.start[1];
    let heading = 0;
    if (!placementFree(x, z, 3)) {
      const point = pickRespawn(x, z, 3);
      x = point.x;
      z = point.z;
      heading = point.heading;
    }
    missionCar = createVehicle(fleet, registry, {
      type: def.vehicleClass,
      x,
      z,
      heading,
      colorIndex: 1,
    });
    return missionCar;
  }

  /** Машина заказа не должна копиться в мире: убираем, если игрок не за рулём. */
  function releaseMissionCar(): void {
    if (missionCar && missionCar.driver < 0) destroyVehicle(fleet, registry, missionCar);
    missionCar = null;
  }

  // --- M8: интерес — события, подработки, коллекции, достижения, атмосфера --
  const dayNight = new DayNightCycle(
    savedProfile ? savedProfile.progress.dayPhase : DAY_NIGHT.startPhase,
  );
  const radio = createRadio({
    onNews: (text) => {
      toast.show(text, 'info', 3.2);
    },
  });
  radio.setVolume(uiSettings.volume);
  radio.setMuted(uiSettings.muted);
  if (savedProfile) radio.setStation(savedProfile.progress.radioStation);

  const nightView = createNightView(scene, FLEET_VISUAL_LIMIT);

  const collectibleBlocks: CollectibleBlock[] = world.map.blocks.map((block) => ({
    x: block.rect.x,
    z: block.rect.z,
    hx: block.rect.hx,
    hz: block.rect.hz,
    kind: block.kind,
  }));
  const packagePoints = buildPackageLayout(collectibleBlocks);
  const lifePropsView = createLifePropsView(scene, packagePoints, RAMPS);

  let maxWantedStars = 0;
  let totalWrecks = 0;

  const achievements = new AchievementSystem({
    unlocked: savedProfile ? savedProfile.progress.achievements.unlocked : undefined,
    stats: savedProfile ? savedProfile.progress.achievements.stats : undefined,
    onUnlock: (def, reward) => {
      economy.add(reward, 'achievement');
      toast.show(
        i18n.t('achievement.unlocked', {
          title: i18n.t(def.titleKey),
          reward: `${i18n.t('hud.currency')}${i18n.formatNumber(reward)}`,
        }),
        'success',
        3.6,
      );
      audio.ui('success');
    },
  });
  maxWantedStars = achievements.stats.maxStars;

  const collectibles = new CollectiblesSystem({
    packages: packagePoints,
    ramps: RAMPS,
    carNames: UNIQUE_CAR_ANCHORS.map((anchor) => anchor.nameKey),
    garage: { x: ECONOMY.garage[0], z: ECONOMY.garage[1] },
    garageRadius: ECONOMY.garageRadius,
    onCollect: (event: CollectEvent) => {
      economy.add(event.reward, 'collect');
      const rewardText = `${i18n.t('hud.currency')}${i18n.formatNumber(event.reward)}`;
      let text = '';
      if (event.kind === 'package') {
        text = i18n.t(
          event.milestone ? 'collectible.package.milestone' : 'collectible.package',
          { found: event.found, total: event.total, reward: rewardText },
        );
      } else if (event.kind === 'ramp') {
        text = i18n.t(
          event.milestone ? 'collectible.ramp.milestone' : 'collectible.ramp',
          { found: event.found, total: event.total, reward: rewardText },
        );
      } else {
        const name = event.nameKey ? i18n.t(event.nameKey) : '';
        text = i18n.t(
          event.milestone ? 'collectible.car.milestone' : 'collectible.car',
          { name, found: event.found, total: event.total, reward: rewardText },
        );
        const slot = collectibles.uniqueCars[event.index];
        if (slot) slot.vehicleId = -1;
      }
      toast.show(text, 'success', 2.6);
      audio.ui('success');
    },
  });
  if (savedProfile) collectibles.restore(savedProfile.progress.collectibles);

  const events = new EventDirector({
    fleet,
    registry,
    physics,
    graph: world.roadGraph,
    spawnPoints: eventSpawnPoints,
    playerId: player.id,
    seed: world.seed ^ 0xefec7,
    onStart: (def, x, z) => {
      maxWantedStars = Math.max(maxWantedStars, wanted.level);
      toast.show(
        i18n.t('event.started', { title: i18n.t(def.titleKey) }),
        'info',
        2.8,
      );
      radio.news(i18n.t(def.newsKey));
      audio.ui('click');
      if (def.id === 'robbery' || def.id === 'shootout') peds.alertAt(x, z, 18, 'flee');
    },
    onEnd: (def, resolved) => {
      if (resolved) {
        toast.show(
          i18n.t('event.resolved', {
            title: i18n.t(def.titleKey),
            reward: `${i18n.t('hud.currency')}${i18n.formatNumber(def.reward)}`,
          }),
          'success',
          3.4,
        );
      } else {
        toast.show(
          i18n.t('event.failed', { title: i18n.t(def.titleKey) }),
          'error',
          3,
        );
      }
      radio.news(
        i18n.t(resolved ? 'event.news.resolved' : 'event.news.failed', {
          title: i18n.t(def.titleKey),
        }),
      );
    },
    onReward: (_def, amount) => {
      economy.add(amount, 'event');
    },
    onHeat: (level) => {
      // EVT-06: сцена сама не поднимает розыск выше 3.
      wanted.setLevel(Math.max(wanted.level, Math.min(3, level)));
    },
  });

  const jobSpotScratch: SpawnPoint[] = [];
  /**
   * Свободная точка дороги рядом с игроком для машины подработки.
   * Проверка коллайдеров — placementFree (R-13).
   */
  function findJobSpot(
    minDistance: number,
    maxDistance: number,
    radius: number,
  ): { x: number; z: number; heading: number } | null {
    const position = playerWorldPosition();
    world.querySpawnPoints(position.x, position.z, maxDistance + 10, 'car', jobSpotScratch);
    let best: SpawnPoint | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < jobSpotScratch.length; i += 1) {
      const point = jobSpotScratch[i];
      const dx = point.x - position.x;
      const dz = point.z - position.z;
      const distance = Math.hypot(dx, dz);
      if (distance < minDistance || distance > maxDistance) continue;
      if (!placementFree(point.x, point.z, radius)) continue;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = point;
      }
    }
    return best ? { x: best.x, z: best.z, heading: best.heading } : null;
  }

  const jobs = new JobsSystem({
    fleet,
    registry,
    physics,
    playerId: player.id,
    seed: world.seed ^ 0x1a8f,
    findSpot: (minDistance, maxDistance, radius) => findJobSpot(minDistance, maxDistance, radius),
    onSpawnVehicle: (request: JobSpawnRequest) =>
      createVehicle(fleet, registry, {
        type: request.type,
        x: request.x,
        z: request.z,
        heading: request.heading,
        colorIndex: request.colorIndex,
      }),
    onStart: (def) => {
      toast.show(i18n.t(def.titleKey), 'info', 2.4);
      audio.mission('start');
      radio.news(i18n.t('job.news.start', { title: i18n.t(def.titleKey) }));
    },
    onStage: () => {
      audio.mission('pickup');
      toast.show(i18n.t('mission.stageChanged'), 'info', 1.6);
    },
    onComplete: (def, reward, tip) => {
      economy.add(reward, 'job');
      const money = `${i18n.t('hud.currency')}${i18n.formatNumber(reward)}`;
      let text = i18n.t('job.completed', { title: i18n.t(def.titleKey), reward: money });
      if (tip > 0) {
        text += ` · ${i18n.t('job.tip', {
          tip: `${i18n.t('hud.currency')}${i18n.formatNumber(tip)}`,
        })}`;
      }
      toast.show(text, 'success', 3.6);
      audio.mission('complete');
      syncAchievements();
    },
    onFail: (def, reason) => {
      if (def.heatOnFail > 0) {
        wanted.setLevel(Math.max(wanted.level, Math.min(3, def.heatOnFail)));
      }
      toast.show(i18n.t(`job.failed.${reason}`), 'error', 3.2);
      audio.mission('fail');
      syncAchievements();
    },
    onWreck: (_def, done, total) => {
      if (done % 2 !== 0 && done < total) return;
      toast.show(i18n.t('job.objective.rampage', { done, total }), 'info', 1.4);
      audio.ui('click');
    },
    onNews: (kind, def) => {
      radio.news(
        i18n.t(`job.news.${kind}`, { title: i18n.t(def.titleKey) }),
      );
    },
  });
  if (savedProfile) jobs.restore(savedProfile.progress.jobs);

  /** Синхронизация статистики достижений — раз в HUD-тик, не в кадре. */
  function syncAchievements(): void {
    achievements.setStat('packages', collectibles.packagesFound);
    achievements.setStat('ramps', collectibles.rampsFound);
    achievements.setStat('uniqueCars', collectibles.carsFound);
    achievements.setStat('jobs', jobs.stats.completed);
    achievements.setStat('jobKinds', jobs.kindsCompleted);
    achievements.setStat('events', events.stats.resolved);
    achievements.setStat('maxStars', maxWantedStars);
    achievements.setStat('missions', statsState.missionsCompleted);
    achievements.setStat('earned', economy.earned);
    achievements.setStat('wrecks', totalWrecks);
    achievements.setStat('raceWins', jobs.completedCount('race'));
    achievements.sync();
  }

  /** Уникальные машины: спавн рядом с якорем на свободной точке дороги. */
  const uniqueCarScratch: SpawnPoint[] = [];
  function spawnUniqueCars(): void {
    for (let i = 0; i < UNIQUE_CAR_ANCHORS.length; i += 1) {
      if (collectibles.isCarDelivered(i)) continue;
      const anchor = UNIQUE_CAR_ANCHORS[i];
      world.querySpawnPoints(anchor.x, anchor.z, 160, 'car', uniqueCarScratch);
      let best: SpawnPoint | null = null;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (let k = 0; k < uniqueCarScratch.length; k += 1) {
        const point = uniqueCarScratch[k];
        if (!placementFree(point.x, point.z, 3.2)) continue;
        const distance = Math.hypot(point.x - anchor.x, point.z - anchor.z);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = point;
        }
      }
      let x = anchor.x;
      let z = anchor.z;
      let heading = 0;
      if (best) {
        x = best.x;
        z = best.z;
        heading = best.heading;
      } else if (!placementFree(anchor.x, anchor.z, 3.2)) {
        continue;
      }
      const vehicle = createVehicle(fleet, registry, {
        type: anchor.type,
        x,
        z,
        heading,
        colorIndex: anchor.colorIndex,
      });
      collectibles.registerCar(i, vehicle.id, x, z);
    }
  }

  /** Снять машины коллекции с карты (загрузка/сброс) и заспавнить заново. */
  function clearUniqueCars(): void {
    for (let i = 0; i < collectibles.uniqueCars.length; i += 1) {
      const slot = collectibles.uniqueCars[i];
      if (slot.vehicleId < 0) continue;
      const vehicle = fleet.get(slot.vehicleId);
      if (vehicle && vehicle.driver < 0) destroyVehicle(fleet, registry, vehicle);
      slot.vehicleId = -1;
    }
  }

  function respawnUniqueCars(): void {
    clearUniqueCars();
    spawnUniqueCars();
  }

  // Стартовое население: только за пределами безопасной зоны.
  traffic.prefill(TRAFFIC_PREFILL, spawn.x, spawn.z);
  peds.prefill(PEDS_PREFILL, spawn.x, spawn.z);
  spawnUniqueCars();

  /** Переиспользуемый снимок игрока: без аллокаций в фиксированном шаге. */
  const playerSnapshot = {
    x: spawn.x,
    z: spawn.z,
    vx: 0,
    vz: 0,
    heading: spawn.heading,
    onFoot: false,
    vehicle: startVehicle as VehicleState | null,
  };
  /** Контекст трафика: уровень розыска и ближайшая сирена. */
  const trafficContext = { wantedLevel: 0, sirenX: 0, sirenZ: 0 };
  /** Переиспользуемый снимок для системы миссий (без аллокаций в шаге). */
  const missionPlayer = {
    x: spawn.x,
    z: spawn.z,
    inVehicle: false,
    vehicleType: null as VehicleTypeId | null,
    vehicleWrecked: false,
    vehicleId: -1,
  };
  /** Снимок игрока для событий, подработок и коллекций. */
  const lifePlayer = {
    x: spawn.x,
    z: spawn.z,
    speed: 0,
    inVehicle: false,
    vehicleId: -1,
    vehicleType: null as VehicleTypeId | null,
  };
  let gameTime = 0;
  /** Уничтоженные машины за шаг: уведомления после обхода флота (M8). */
  const wreckIds: EntityId[] = [];
  const wreckXs: number[] = [];
  const wreckZs: number[] = [];
  let fireHeld = false;
  let firePressed = false;
  let stealTimer = 0;
  let reloadRequested = false;
  let hornRequested = false;
  let weaponRequest = -1;
  const pointer = { x: 0, y: 0 };
  const raycaster = new THREE.Raycaster();
  const aimPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const aimPoint = new THREE.Vector3();
  const aimNdc = new THREE.Vector2();

  /** Прицел по мыши: экран → точка на земле через ортокамеру. */
  function aimAtGround(): boolean {
    aimNdc.set(pointer.x, pointer.y);
    raycaster.setFromCamera(aimNdc, camera);
    return raycaster.ray.intersectPlane(aimPlane, aimPoint) !== null;
  }

  /** Выстрел игрока: из машины — от капота, пешком — от игрока. */
  function firePlayerWeapon(): void {
    const vehicle = playerController.mode === 'driving' ? playerController.vehicle : null;
    let originX = vehicle ? vehicle.transform.x : playerTransform.x;
    let originZ = vehicle ? vehicle.transform.z : playerTransform.z;
    if (vehicle) {
      // Дуло на капоте: не стреляем в собственный кузов.
      originX += Math.sin(vehicle.transform.heading) * (vehicle.config.length * 0.5 + 0.4);
      originZ += Math.cos(vehicle.transform.heading) * (vehicle.config.length * 0.5 + 0.4);
    }
    if (!aimAtGround()) return;
    let dirX = aimPoint.x - originX;
    let dirZ = aimPoint.z - originZ;
    const length = Math.hypot(dirX, dirZ);
    if (length < 0.4) return;
    dirX /= length;
    dirZ /= length;
    const fired = combat.tryFire(originX, originZ, dirX, dirZ, vehicle ? vehicle.id : -1);
    if (fired) audio.shot(combat.weapon);
  }

  // --- ввод M5: огонь ЛКМ, оружие 1/2/3, перезарядка F, сигнал H ------------
  function updatePointer(event: MouseEvent): void {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  const onMouseDown = (event: MouseEvent): void => {
    if (event.button !== 0) return;
    // Клик по HUD/меню не должен стрелять: огонь только по игровому полотну.
    if (!(event.target instanceof HTMLCanvasElement)) return;
    if (uiPaused()) return;
    updatePointer(event);
    fireHeld = true;
    firePressed = true;
  };
  const onMouseUp = (event: MouseEvent): void => {
    if (event.button === 0) fireHeld = false;
  };
  const onMouseMove = (event: MouseEvent): void => updatePointer(event);

  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('contextmenu', (event) => event.preventDefault());

  const spawnQuery: SpawnPoint[] = [];
  /** Запас к габариту при проверке свободного места под респавн, м. */
  const RESPAWN_MARGIN = 0.35;

  /**
   * Респавн: точка дорожного графа, свободная под габарит активной цели.
   * querySpawnPoints проверяет только 0.6 м (BUG-M4-004), поэтому здесь
   * дополнительно фильтруем по радиусу машины/игрока через SpatialHash.
   */
  function pickRespawn(x: number, z: number, radius: number): SpawnPoint {
    const minSeparation = (radius * 2 + 3) * (radius * 2 + 3);
    world.querySpawnPoints(x, z, 450, 'car', spawnQuery);
    let best: SpawnPoint | null = null;
    let fallback: SpawnPoint | null = null;
    let bestDist = Number.POSITIVE_INFINITY;
    let fallbackDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < spawnQuery.length; i += 1) {
      const point = spawnQuery[i];
      if (!placementFree(point.x, point.z, radius + RESPAWN_MARGIN)) continue;
      const dx = point.x - x;
      const dz = point.z - z;
      const dist = dx * dx + dz * dz;
      if (dist < fallbackDist) {
        fallbackDist = dist;
        fallback = point;
      }
      if (dist < minSeparation) continue; // не телепортируем на текущее место
      if (dist < bestDist) {
        bestDist = dist;
        best = point;
      }
    }
    if (best) return best;
    if (fallback) return fallback;

    // Страховка, если querySpawnPoints всё отсёк: сырые точки дорожного графа.
    const raw = world.roadGraph.spawnPoints;
    let rawBest: SpawnPoint | null = null;
    let rawBestDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < raw.length; i += 1) {
      const point = raw[i];
      if (!placementFree(point.x, point.z, radius + RESPAWN_MARGIN)) continue;
      const dx = point.x - x;
      const dz = point.z - z;
      const dist = dx * dx + dz * dz;
      if (dist < rawBestDist) {
        rawBestDist = dist;
        rawBest = point;
      }
    }
    return rawBest ?? world.defaultSpawn;
  }

  /** R: активную цель — на дорогу. Машину заодно ремонтируем и тушим. */
  function resetActiveTarget(): void {
    const vehicle = playerController.vehicle;
    if (playerController.mode === 'driving' && vehicle) {
      const point = pickRespawn(
        vehicle.transform.x,
        vehicle.transform.z,
        vehicleColliderRadius(vehicle.config),
      );
      repositionVehicle(registry, vehicle, point.x, point.z, point.heading);
      repairVehicleFull(vehicle);
      playerController.syncInsideVehicle();
      followCamera.snapTo(point.x, point.z);
      world.prefetch(point.x, point.z);
      shakeTime = 0;
      return;
    }
    const point = pickRespawn(playerTransform.x, playerTransform.z, PLAYER.radius + 0.75);
    playerController.teleport(point.x, point.z);
    followCamera.snapTo(point.x, point.z);
    world.prefetch(point.x, point.z);
    shakeTime = 0;
  }

  /** E: сесть/выйти. Камера и стриминг переезжают на новую цель. */
  function toggleVehicle(): boolean {
    const changed = playerController.toggleVehicle();
    if (!changed) return false;
    const vehicle = playerController.vehicle;
    const target = vehicle ? vehicle.transform : playerTransform;
    followCamera.snapTo(target.x, target.z);
    world.prefetch(target.x, target.z);
    shakeTime = 0;
    return true;
  }

  // E/H/F/1..3 не входят в общий InputMap ядра: добавляем одноразовые
  // действия здесь, чтобы не менять контракт core/input в M4/M5.
  // M6: Esc — пауза, M — пейджер, цифры в пейджере — выбор заказа.
  let interactRequested = false;
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat) return;
    if (missions.pagerOpen) {
      if (event.code === 'Escape' || event.code === 'KeyM') {
        event.preventDefault();
        closePagerPanel();
        return;
      }
      if (event.code.startsWith('Digit')) {
        const index = Number(event.code.slice(5));
        if (index >= 1 && index <= 9) {
          event.preventDefault();
          if (pager.activeTab === 'jobs') startJobByIndex(index);
          else startMissionByIndex(index);
        }
        return;
      }
    }
    if (event.code === 'Escape') {
      event.preventDefault();
      togglePauseMenu();
      return;
    }
    if (event.code === 'KeyM') {
      event.preventDefault();
      togglePager();
      return;
    }
    // R-05: пока интерфейс на паузе, игровые действия не принимаем.
    if (uiPaused()) return;
    if (event.code === 'KeyB') {
      event.preventDefault();
      cycleRadio();
      return;
    }
    if (event.code === 'KeyE') {
      interactRequested = true;
    } else if (event.code === 'KeyH') {
      hornRequested = true;
    } else if (event.code === 'KeyF') {
      reloadRequested = true;
    } else if (event.code === 'Digit1') {
      weaponRequest = 0;
    } else if (event.code === 'Digit2') {
      weaponRequest = 1;
    } else if (event.code === 'Digit3') {
      weaponRequest = 2;
    }
  };
  window.addEventListener('keydown', onKeyDown);

  // Первый жест разблокирует WebAudio (политика автозапуска браузеров).
  const unlockAudio = (): void => {
    audio.resume();
    radio.resume();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);

  // --- стресс-режим: движение кинематических тел ----------------------------
  function updateStressMovers(dt: number): void {
    if (movers.length === 0) return;
    stressTime += dt;

    for (let i = 0; i < movers.length; i += 1) {
      const spec = movers[i];
      const entity = registry.get(spec.id);
      if (!entity) continue;
      const transform = entity.transform;
      transform.prevX = transform.x;
      transform.prevZ = transform.z;
      transform.prevHeading = transform.heading;

      const phase = stressTime * spec.omega + spec.phase;
      const sinPhase = Math.sin(phase);
      const cosPhase = Math.cos(phase);

      if (spec.axis === 0) {
        transform.x = spec.anchorX + spec.center + sinPhase * spec.amplitude;
        transform.z = spec.anchorZ + spec.lane + cosPhase * MOVER_WEAVE;
        transform.vx = cosPhase * spec.amplitude * spec.omega;
        transform.vz = -sinPhase * MOVER_WEAVE * spec.omega;
      } else {
        transform.z = spec.anchorZ + spec.center + sinPhase * spec.amplitude;
        transform.x = spec.anchorX + spec.lane + cosPhase * MOVER_WEAVE;
        transform.vz = cosPhase * spec.amplitude * spec.omega;
        transform.vx = -sinPhase * MOVER_WEAVE * spec.omega;
      }
      transform.heading = Math.atan2(transform.vx, transform.vz);

      // Кинематику стресс-режима двигаем и разрешаем через API ядра.
      const rect = {
        x: transform.x,
        z: transform.z,
        hx: MOVER_HALF,
        hz: MOVER_HALF,
        angle: transform.heading,
      };
      if (resolveRectBody(rect, colliderHash, collisionCandidates, contact, TUNING, true)) {
        transform.x = rect.x;
        transform.z = rect.z;
      }
      registry.updateCollider(spec.id);
    }
  }

  function syncStressMovers(alpha: number): void {
    const mesh = stressMeshRef;
    if (!mesh) return;
    for (let i = 0; i < movers.length; i += 1) {
      const spec = movers[i];
      const entity = registry.get(spec.id);
      if (!entity) continue;
      const transform = entity.transform;
      writeMoverMatrix(
        mesh,
        spec.handle,
        lerp(transform.prevX, transform.x, alpha),
        lerp(transform.prevZ, transform.z, alpha),
        lerpAngle(transform.prevHeading, transform.heading, alpha),
      );
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  // --- префетч окружения до первого кадра ----------------------------------
  const prefetchMs = world.prefetch(spawn.x, spawn.z);
  cityView.sync(world);

  // --- M6: пауза, интерфейс, магазин, сохранение ---------------------------
  const missionMarkerView = createMissionMarkerView(scene);
  const activityMarkerView = createMissionMarkerView(scene);
  let ambienceTimer = 0;
  let pauseBlur = false;
  let pauseMenu = false;
  let pausePager = false;
  let pauseStart = true;
  let autosaveTimer = 0;

  /** Позиция активной цели: машина под управлением или пешеход. */
  function playerWorldPosition(): { x: number; z: number } {
    const vehicle = playerController.mode === 'driving' ? playerController.vehicle : null;
    if (vehicle) return { x: vehicle.transform.x, z: vehicle.transform.z };
    return { x: playerTransform.x, z: playerTransform.z };
  }

  /**
   * Цвета суток применяются к уже существующим hemi/sun/fog/background
   * (R-19): сцена не пересоздаётся, тени и качество не трогаем.
   */
  function applyAmbience(): void {
    const sample = dayNight.state;
    if (scene.background instanceof THREE.Color) scene.background.setHex(sample.sky);
    if (scene.fog instanceof THREE.Fog) scene.fog.color.setHex(sample.fog);
    hemi.color.setHex(sample.hemiSky);
    hemi.groundColor.setHex(sample.hemiGround);
    hemi.intensity = sample.hemiIntensity;
    sun.color.setHex(sample.sun);
    sun.intensity = sample.sunIntensity;
    renderer.toneMappingExposure = sample.exposure;
  }

  function garageDistance(): number {
    const position = playerWorldPosition();
    return Math.hypot(position.x - ECONOMY.garage[0], position.z - ECONOMY.garage[1]);
  }

  function atGarage(): boolean {
    return garageDistance() <= ECONOMY.garageRadius;
  }

  function activeVehicleOrNull(): VehicleState | null {
    return playerController.mode === 'driving' ? playerController.vehicle : null;
  }

  function playSound(kind: SoundKind): void {
    audio.ui(kind);
  }

  /**
   * Пауза — набор причин: blur, меню, пейджер и стартовый экран.
   * Снимается только снятием последней причины (как в контракте GameLoop).
   */
  function uiPaused(): boolean {
    return pauseBlur || pauseMenu || pausePager || pauseStart;
  }

  function clearActionInput(): void {
    fireHeld = false;
    firePressed = false;
    interactRequested = false;
    hornRequested = false;
    reloadRequested = false;
    weaponRequest = -1;
  }

  /** B — переключение радио: 0 → 1 → 2 → выкл (Digit* занят пейджером). */
  function cycleRadio(): void {
    radio.resume();
    const index = radio.next();
    audio.ui('click');
    const stationKey = index < 0 ? 'radio.station.off' : RADIO_STATIONS[index].nameKey;
    toast.show(
      i18n.t('radio.stationChanged', { station: i18n.t(stationKey) }),
      'info',
      2,
    );
  }

  function applyPauseState(): void {
    const paused = pauseBlur || pauseMenu || pausePager || pauseStart;
    if (paused) {
      clearActionInput();
      loop.pause();
      input.clear();
      mobile.releaseAll();
    } else {
      loop.resume();
    }
  }

  function startPlaying(): void {
    pauseStart = false;
    menu.close();
    audio.resume();
    applyPauseState();
  }

  function openPauseMenu(): void {
    if (pauseStart) return;
    if (missions.pagerOpen) closePagerPanel();
    pauseMenu = true;
    menu.openPause();
    applyPauseState();
  }

  function closePauseMenu(): void {
    if (!pauseMenu) return;
    pauseMenu = false;
    menu.close();
    applyPauseState();
  }

  function togglePauseMenu(): void {
    if (pauseStart) return;
    if (pauseMenu) closePauseMenu();
    else openPauseMenu();
  }

  function refreshPager(): void {
    if (!missions.pagerOpen) {
      pager.close();
      return;
    }
    const tabs = buildPagerTabs();
    const activeTab = pager.activeTab === 'jobs' ? 'jobs' : 'missions';
    const onAccept = (id: string): void => {
      if (findJobDef(id)) startJobById(id);
      else startMissionById(id);
    };
    if (pager.isOpen) pager.refresh(tabs, activeTab);
    else pager.open(tabs, onAccept, activeTab);
  }

  function openPagerPanel(): void {
    if (pauseStart || pauseMenu) return;
    missions.openPager();
    pausePager = true;
    refreshPager();
    applyPauseState();
    playSound('click');
  }

  function closePagerPanel(): void {
    if (!pausePager) return;
    missions.closePager();
    pager.close();
    pausePager = false;
    applyPauseState();
  }

  function togglePager(): void {
    if (pauseStart || pauseMenu) return;
    if (missions.pagerOpen) closePagerPanel();
    else openPagerPanel();
  }

  function startMissionById(id: string): void {
    if (missions.pagerOpen) closePagerPanel();
    if (!missions.start(id)) {
      playSound('error');
      toast.show(i18n.t('mission.pager.empty'), 'error', 2.2);
      return;
    }
    const def = findMission(id);
    playSound('success');
    if (def) toast.show(i18n.t(def.titleKey), 'info', 1.8);
  }

  function startMissionByIndex(index: number): void {
    const statuses = missions.statuses();
    const entry = statuses[index - 1];
    if (entry && entry.status === 'available') startMissionById(entry.def.id);
  }

  function startJobById(id: string): void {
    if (missions.pagerOpen) closePagerPanel();
    if (!jobs.start(id)) {
      playSound('error');
      toast.show(i18n.t('mission.pager.empty'), 'error', 2.2);
      return;
    }
    const def = findJobDef(id);
    if (def) toast.show(i18n.t(def.titleKey), 'info', 1.8);
    playSound('success');
  }

  function startJobByIndex(index: number): void {
    const statuses = jobs.statuses();
    const entry = statuses[index - 1];
    if (entry && entry.cooldown <= 0) startJobById(entry.def.id);
  }

  /** Пейджер: заказы и подработки на двух вкладках (R-02/R-16). */
  function buildPagerTabs(): PagerTab[] {
    const statuses = missions.statuses();
    const missionEntries: PagerEntry[] = [];
    for (let i = 0; i < statuses.length; i += 1) {
      const entry = statuses[i];
      const def = entry.def;
      let statusNote: string | null = null;
      if (entry.status === 'locked' && entry.lockedBy) {
        const lockDef = findMission(entry.lockedBy);
        statusNote = i18n.t('mission.pager.locked', {
          mission: lockDef ? i18n.t(lockDef.titleKey) : entry.lockedBy,
        });
      } else if (entry.status === 'cooldown') {
        statusNote = i18n.t('mission.pager.cooldown', { time: i18n.formatTime(entry.cooldown) });
      }
      missionEntries.push({
        id: def.id,
        index: i + 1,
        title: i18n.t(def.titleKey),
        desc: i18n.t(def.descKey),
        typeLabel: i18n.t(`mission.pager.type.${def.type}`),
        reward: `${i18n.t('hud.currency')}${i18n.formatNumber(def.reward)}`,
        time:
          def.timeLimit !== undefined
            ? i18n.t('mission.pager.time', { time: i18n.formatTime(def.timeLimit) })
            : null,
        status: entry.status,
        statusNote,
      });
    }

    const jobStatuses = jobs.statuses();
    const jobEntries: PagerEntry[] = [];
    for (let i = 0; i < jobStatuses.length; i += 1) {
      const entry = jobStatuses[i];
      const def = entry.def;
      const busy = jobs.activeId !== null;
      const blocked = entry.cooldown > 0 || busy;
      jobEntries.push({
        id: def.id,
        index: i + 1,
        title: i18n.t(def.titleKey),
        desc: i18n.t(def.descKey),
        typeLabel: i18n.t('job.pager.type'),
        reward: `${i18n.t('hud.currency')}${i18n.formatNumber(def.reward)}`,
        time: i18n.t('mission.pager.time', { time: i18n.formatTime(def.duration) }),
        status: blocked ? 'cooldown' : 'available',
        statusNote:
          entry.cooldown > 0
            ? i18n.t('mission.pager.cooldown', { time: i18n.formatTime(entry.cooldown) })
            : busy
              ? i18n.t('mission.active')
              : null,
      });
    }

    return [
      { id: 'missions', label: i18n.t('mission.pager.title'), entries: missionEntries },
      { id: 'jobs', label: i18n.t('job.pager.tab'), entries: jobEntries },
    ];
  }

  function setLanguage(lang: LangCode): void {
    uiSettings.lang = lang;
    i18n.setLang(lang);
  }

  function setVolume(volume: number): void {
    uiSettings.volume = clamp(volume, 0, 1);
    audio.setVolume(uiSettings.volume);
    radio.setVolume(uiSettings.volume);
  }

  function setMuted(muted: boolean): void {
    uiSettings.muted = muted;
    audio.setMuted(muted);
    radio.setMuted(muted);
  }

  function setQuality(quality: UiQuality): void {
    uiSettings.quality = quality;
    applyQuality();
  }

  function setTouchMode(mode: TouchMode): void {
    uiSettings.touch = mode;
    mobile.setMode(mode);
  }

  function setHints(enabled: boolean): void {
    uiSettings.hints = enabled;
  }

  function applyQuality(): void {
    const preset = UI.quality[uiSettings.quality];
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, preset.pixelRatio));
    renderer.shadowMap.enabled = preset.shadows;
    sun.castShadow = preset.shadows;
    resize();
  }

  // --- магазин --------------------------------------------------------------

  function shopRepair(): void {
    if (!atGarage()) {
      menu.setMessage(
        i18n.t('shop.needGarage', { distance: Math.round(garageDistance()) }),
        'error',
      );
      playSound('error');
      return;
    }
    const vehicle = activeVehicleOrNull();
    const result = economy.repair(vehicle);
    if (result.ok) {
      menu.setMessage(i18n.t('shop.repaired'), 'success');
      playSound('success');
      return;
    }
    const text =
      result.reason === 'money'
        ? i18n.t('shop.notEnough')
        : result.reason === 'none'
          ? i18n.t('shop.noVehicle')
          : i18n.t('shop.fullHp');
    menu.setMessage(text, 'error');
    playSound('error');
  }

  function shopPaint(): void {
    if (!atGarage()) {
      menu.setMessage(
        i18n.t('shop.needGarage', { distance: Math.round(garageDistance()) }),
        'error',
      );
      playSound('error');
      return;
    }
    const result = economy.paint();
    if (result.ok) {
      menu.setMessage(i18n.t('shop.painted'), 'success');
      playSound('success');
      return;
    }
    menu.setMessage(result.reason === 'money' ? i18n.t('shop.notEnough') : i18n.t('shop.noVehicle'), 'error');
    playSound('error');
  }

  function shopAmmo(): void {
    if (!atGarage()) {
      menu.setMessage(
        i18n.t('shop.needGarage', { distance: Math.round(garageDistance()) }),
        'error',
      );
      playSound('error');
      return;
    }
    const result = economy.buyAmmo();
    if (result.ok) {
      menu.setMessage(i18n.t('shop.bought', { name: i18n.t('shop.ammo') }), 'success');
      playSound('success');
      return;
    }
    menu.setMessage(
      result.reason === 'money'
        ? i18n.t('shop.notEnough')
        : result.reason === 'free'
          ? i18n.t('shop.ammoFull')
          : i18n.t('shop.ammoFull'),
      'error',
    );
    playSound('error');
  }

  function shopUpgrade(id: string): void {
    if (!atGarage()) {
      menu.setMessage(
        i18n.t('shop.needGarage', { distance: Math.round(garageDistance()) }),
        'error',
      );
      playSound('error');
      return;
    }
    if (!isUpgradeId(id)) return;
    const result = economy.buyUpgrade(id);
    if (result.ok) {
      menu.setMessage(
        i18n.t('shop.bought', { name: i18n.t(economy.upgradeDef(id).labelKey) }),
        'success',
      );
      playSound('success');
      return;
    }
    menu.setMessage(result.reason === 'money' ? i18n.t('shop.notEnough') : i18n.t('shop.max'), 'error');
    playSound('error');
  }

  function isUpgradeId(value: string): value is UpgradeId {
    return value === 'contacts' || value === 'garage' || value === 'insurance';
  }

  function buildMenuState(): MenuState {
    const vehicle = activeVehicleOrNull();
    const atG = atGarage();
    const distance = Math.round(garageDistance());
    const money = economy.money;

    const repairCost = economy.repairCost(vehicle);
    const canRepair = atG && repairCost > 0 && money >= repairCost;
    const repairNote =
      vehicle === null
        ? i18n.t('shop.noVehicle')
        : repairCost <= 0
          ? i18n.t('shop.fullHp')
          : atG
            ? ''
            : i18n.t('shop.needGarage', { distance });

    const paintCost = economy.paintCost;
    const canPaint = atG && money >= paintCost;

    const ammoNeeded = (() => {
      const spec = combat.weaponSpec;
      return combat.magAmmo < spec.mag || combat.reserveAmmo < spec.reserve;
    })();
    const canAmmo = atG && ammoNeeded && money >= economy.ammoCost;
    const ammoNote = ammoNeeded ? '' : i18n.t('shop.ammoFull');

    const upgrades = ECONOMY.upgrades.map((def) => {
      const level = economy.level(def.id);
      const cost = economy.upgradeCost(def.id);
      return {
        id: def.id,
        name: i18n.t(def.labelKey),
        desc: i18n.t(def.descKey),
        level,
        maxLevel: def.maxLevel,
        cost,
        canBuy: atG && cost !== null && money >= cost,
      };
    });

    return {
      hasSave: saveService.hasSave,
      settings: {
        lang: i18n.lang,
        volume: uiSettings.volume,
        muted: uiSettings.muted,
        quality: uiSettings.quality,
        touch: uiSettings.touch,
        hints: uiSettings.hints,
      },
      stats: {
        missions: statsState.missionsCompleted,
        failed: statsState.missionsFailed,
        earned: `${i18n.t('hud.currency')}${i18n.formatNumber(economy.earned)}`,
        playTime: i18n.formatTime(statsState.playSeconds),
      },
      shop: {
        moneyText: i18n.formatNumber(money),
        hasVehicle: vehicle !== null,
        repairCost,
        canRepair,
        repairNote,
        paintCost,
        canPaint,
        ammoCost: economy.ammoCost,
        canAmmo,
        ammoNote,
        atGarage: atG,
        garageNote: atG
          ? i18n.t('shop.atGarage')
          : i18n.t('shop.needGarage', { distance }),
        upgrades,
      },
      progress: {
        achievements: achievements.list().map((entry) => ({
          id: entry.id,
          title: i18n.t(entry.titleKey),
          desc: i18n.t(entry.descKey),
          glyph: entry.glyph,
          unlocked: entry.unlocked,
          progress: entry.progress,
          target: entry.target,
          reward: `${i18n.t('hud.currency')}${i18n.formatNumber(entry.reward)}`,
        })),
        found: achievements.found,
        total: achievements.total,
        packages: { found: collectibles.packagesFound, total: collectibles.packagesTotal },
        ramps: { found: collectibles.rampsFound, total: collectibles.rampsTotal },
        cars: { found: collectibles.carsFound, total: collectibles.carsTotal },
        uniqueCars: collectibles.uniqueCars.map((slot) => ({
          name: i18n.t(slot.nameKey),
          delivered: collectibles.isCarDelivered(slot.index),
        })),
        jobs: JOBS.map((def) => ({
          name: i18n.t(def.titleKey),
          count: jobs.completedCount(def.id),
        })),
        rows: [
          i18n.t('menu.stats.missions', { value: statsState.missionsCompleted }),
          i18n.t('menu.stats.failed', { value: statsState.missionsFailed }),
          i18n.t('menu.stats.earned', {
            value: `${i18n.t('hud.currency')}${i18n.formatNumber(economy.earned)}`,
          }),
          i18n.t('menu.stats.playTime', { value: i18n.formatTime(statsState.playSeconds) }),
          i18n.t('progress.time', { time: i18n.t(dayNight.labelKey()) }),
        ],
        radio: i18n.t(radio.stationKey),
        time: i18n.t(dayNight.labelKey()),
      },
    };
  }

  // --- сохранение -----------------------------------------------------------

  function collectProfile(): SaveProfile {
    const missionProgress = missions.save();
    return {
      version: SAVE_VERSION,
      money: economy.money,
      upgrades: { ...economy.upgrades },
      missions: {
        completed: [...missionProgress.completed],
        cooldowns: { ...missionProgress.cooldowns },
      },
      progress: {
        collectibles: collectibles.save(),
        achievements: achievements.save(),
        jobs: jobs.save(),
        dayPhase: dayNight.phase,
        radioStation: radio.stationIndex,
      },
      settings: { ...uiSettings },
      stats: { ...statsState },
      savedAt: Date.now(),
    };
  }

  function saveGame(auto: boolean): boolean {
    const ok = saveService.save(collectProfile());
    if (!ok) {
      if (!auto) {
        toast.show(i18n.t('menu.noSave'), 'error', 2.4);
        menu.setMessage(i18n.t('menu.noSave'), 'error');
      }
      return false;
    }
    if (auto) {
      toast.show(i18n.t('toast.autoSave'), 'info', 1.6);
    } else {
      toast.show(i18n.t('menu.saved'), 'success', 2.2);
      menu.setMessage(i18n.t('menu.saved'), 'success');
    }
    return true;
  }

  function applyProfile(profile: SaveProfile): void {
    economy.restore({ money: profile.money, upgrades: profile.upgrades });
    missions.restore({
      completed: profile.missions.completed,
      cooldowns: profile.missions.cooldowns,
    });
    statsState.missionsCompleted = profile.stats.missionsCompleted;
    statsState.missionsFailed = profile.stats.missionsFailed;
    statsState.playSeconds = profile.stats.playSeconds;
    releaseMissionCar();

    // M8: прогресс коллекций, достижений и подработок.
    jobs.restore(profile.progress.jobs);
    collectibles.restore(profile.progress.collectibles);
    achievements.restore(profile.progress.achievements);
    events.reset();
    dayNight.setPhase(profile.progress.dayPhase);
    radio.setStation(profile.progress.radioStation);
    maxWantedStars = achievements.stats.maxStars;
    totalWrecks = achievements.stats.wrecks;
    respawnUniqueCars();

    uiSettings.lang = profile.settings.lang;
    uiSettings.volume = profile.settings.volume;
    uiSettings.muted = profile.settings.muted;
    uiSettings.quality = profile.settings.quality;
    uiSettings.touch = profile.settings.touch;
    uiSettings.hints = profile.settings.hints;

    i18n.setLang(uiSettings.lang);
    audio.setVolume(uiSettings.volume);
    audio.setMuted(uiSettings.muted);
    radio.setVolume(uiSettings.volume);
    radio.setMuted(uiSettings.muted);
    mobile.setMode(uiSettings.touch);
    applyQuality();
    menu.refresh();
    updateHud();
  }

  function loadGame(): boolean {
    const profile = saveService.load();
    if (!profile) {
      toast.show(i18n.t('menu.noSave'), 'error', 2.4);
      menu.setMessage(i18n.t('menu.noSave'), 'error');
      return false;
    }
    applyProfile(profile);
    toast.show(i18n.t('menu.loaded'), 'success', 2.2);
    return true;
  }

  function resetProgress(): void {
    economy.reset();
    missions.reset();
    jobs.reset();
    events.reset();
    clearUniqueCars();
    collectibles.reset();
    achievements.reset();
    maxWantedStars = 0;
    totalWrecks = 0;
    dayNight.setPhase(DAY_NIGHT.startPhase);
    radio.setStation(0);
    spawnUniqueCars();
    releaseMissionCar();
    statsState.missionsCompleted = 0;
    statsState.missionsFailed = 0;
    statsState.playSeconds = 0;
    saveService.clear();
    pager.close();
    toast.show(i18n.t('menu.resetDone'), 'success', 2.4);
    updateHud();
  }

  // Смена языка перерисовывает все подписи без перезагрузки страницы.
  i18n.onChange(() => {
    hud.refreshLabels();
    mobile.refreshLabels();
    menu.refresh();
    if (missions.pagerOpen) refreshPager();
  });

  // --- отладочный API -------------------------------------------------------
  // window.__tmc доступен всегда: на нём висят смоук-тесты qa (M5).
  // Тяжёлая диагностика мира (layoutHash, info) считается только под ?debug=1.
  {
    const activeVehicle = (): VehicleState | null => playerController.vehicle ?? fleet.list[0] ?? null;

    /** Снимок коллекций + ближайшие цели для смоука. */
    const collectiblesState = (): Record<string, number | string> => {
      const position = playerWorldPosition();
      let nearestPackageX = 0;
      let nearestPackageZ = 0;
      let bestPackage = Number.POSITIVE_INFINITY;
      for (let i = 0; i < collectibles.packagePoints.length; i += 1) {
        if (collectibles.isPackageCollected(i)) continue;
        const point = collectibles.packagePoints[i];
        const dx = point.x - position.x;
        const dz = point.z - position.z;
        const distance = dx * dx + dz * dz;
        if (distance < bestPackage) {
          bestPackage = distance;
          nearestPackageX = point.x;
          nearestPackageZ = point.z;
        }
      }
      let nearestRampX = 0;
      let nearestRampZ = 0;
      let bestRamp = Number.POSITIVE_INFINITY;
      for (let i = 0; i < collectibles.rampPoints.length; i += 1) {
        if (collectibles.isRampJumped(i)) continue;
        const ramp = collectibles.rampPoints[i];
        const dx = ramp.x - position.x;
        const dz = ramp.z - position.z;
        const distance = dx * dx + dz * dz;
        if (distance < bestRamp) {
          bestRamp = distance;
          nearestRampX = ramp.x;
          nearestRampZ = ramp.z;
        }
      }
      return {
        packages: collectibles.packagesFound,
        packageTotal: collectibles.packagesTotal,
        ramps: collectibles.rampsFound,
        rampTotal: collectibles.rampsTotal,
        cars: collectibles.carsFound,
        carTotal: collectibles.carsTotal,
        nearestPackageX: Number(nearestPackageX.toFixed(1)),
        nearestPackageZ: Number(nearestPackageZ.toFixed(1)),
        nearestRampX: Number(nearestRampX.toFixed(1)),
        nearestRampZ: Number(nearestRampZ.toFixed(1)),
        flight: collectibles.activeFlight ? 1 : 0,
      };
    };

    window.__tmc = {
      mapId: world.mapId,
      seed,
      get layoutHash() {
        return world.layoutHash;
      },
      exportRoadGraph: () => serializeRoadGraph(world.roadGraph),
      stats: () => {
        const stats = world.stats;
        const info = world.info;
        return {
          mapId: world.mapId,
          seed,
          layoutHash: world.layoutHash,
          roads: info.roads,
          blocks: info.blocks,
          landmarks: info.landmarks,
          nodes: info.nodes,
          edges: info.edges,
          lights: info.lights,
          buildings: info.buildings,
          props: info.props,
          chunks: world.activeChunks.length,
          colliders: stats.colliders,
          genMaxMs: stats.genMaxMs,
          genLastMs: stats.genLastMs,
          genCount: stats.genCount,
          updateMs: stats.updateMs,
          spawnPoints: stats.spawnPoints,
          drawCalls: renderer.info.render.calls,
          triangles: renderer.info.render.triangles,
          prefetchMs,
          vehicles: fleet.size,
          mode: playerController.mode,
          onFoot: playerController.mode === 'foot' ? 1 : 0,
          hp: playerController.vehicle ? Number(playerController.vehicle.hp.toFixed(1)) : 0,
          type: playerController.vehicle ? playerController.vehicle.type : '',
          physMaxMs: Number(frameStats.physMaxMs.toFixed(3)),
          logicSteps,
          inputReads,
        };
      },
      teleport: (x, z) => {
        const margin = 3;
        const targetX = clamp(x, world.bounds.minX + margin, world.bounds.maxX - margin);
        const targetZ = clamp(z, world.bounds.minZ + margin, world.bounds.maxZ - margin);
        const vehicle = playerController.vehicle;
        if (playerController.mode === 'driving' && vehicle) {
          repositionVehicle(registry, vehicle, targetX, targetZ, vehicle.transform.heading);
        } else {
          playerController.teleport(targetX, targetZ);
        }
        followCamera.snapTo(targetX, targetZ);
        world.prefetch(targetX, targetZ);
        shakeTime = 0;
      },
      carState: (): Record<string, number | string> => {
        const vehicle = activeVehicle();
        const onFoot = playerController.mode === 'foot';
        const playerSpeed = Math.hypot(playerTransform.vx, playerTransform.vz) * 3.6;
        if (!vehicle) {
          return {
            vehicles: fleet.size,
            mode: playerController.mode,
            onFoot: onFoot ? 1 : 0,
            hp: 0,
            type: '',
            x: Number(playerTransform.x.toFixed(2)),
            z: Number(playerTransform.z.toFixed(2)),
            speedKmh: Number(playerSpeed.toFixed(1)),
            playerX: Number(playerTransform.x.toFixed(2)),
            playerZ: Number(playerTransform.z.toFixed(2)),
            playerSpeedKmh: Number(playerSpeed.toFixed(1)),
            physMaxMs: Number(frameStats.physMaxMs.toFixed(3)),
          };
        }
        const transform = vehicle.transform;
        const carSpeed = Math.hypot(transform.vx, transform.vz) * 3.6;
        const radius = vehicleColliderRadius(vehicle.config);
        const clear = onFoot
          ? placementFree(playerTransform.x, playerTransform.z, PLAYER.radius)
          : placementFreeExcept(transform.x, transform.z, radius, -vehicle.id - 1);
        return {
          id: vehicle.id,
          type: vehicle.type,
          name: vehicle.config.label,
          // x/z/speed — активная цель: машина под управлением или пешеход.
          x: Number((onFoot ? playerTransform.x : transform.x).toFixed(2)),
          z: Number((onFoot ? playerTransform.z : transform.z).toFixed(2)),
          heading: Number((onFoot ? playerTransform.heading : transform.heading).toFixed(3)),
          speedKmh: Number((onFoot ? playerSpeed : carSpeed).toFixed(1)),
          carX: Number(transform.x.toFixed(2)),
          carZ: Number(transform.z.toFixed(2)),
          carSpeedKmh: Number(carSpeed.toFixed(1)),
          playerX: Number(playerTransform.x.toFixed(2)),
          playerZ: Number(playerTransform.z.toFixed(2)),
          playerSpeedKmh: Number(playerSpeed.toFixed(1)),
          forward: Number(vehicle.forward.toFixed(2)),
          lateral: Number(vehicle.lateral.toFixed(2)),
          slip: Number(vehicle.slip.toFixed(2)),
          hp: Number(vehicle.hp.toFixed(1)),
          maxHp: vehicle.maxHp,
          hpPct: Number(((vehicle.hp / vehicle.maxHp) * 100).toFixed(1)),
          wrecked: vehicle.wrecked ? 1 : 0,
          driver: vehicle.driver,
          mode: playerController.mode,
          onFoot: onFoot ? 1 : 0,
          vehicles: fleet.size,
          physMaxMs: Number(frameStats.physMaxMs.toFixed(3)),
          staticClear: placementFreeStatic(transform.x, transform.z, radius) ? 1 : 0,
          spawnClear: clear ? 1 : 0,
        };
      },
      vehicleStats: () => {
        const counts: Record<VehicleTypeId, number> = {
          sedan: 0,
          sports: 0,
          van: 0,
          truck: 0,
          police: 0,
        };
        for (let i = 0; i < fleet.list.length; i += 1) counts[fleet.list[i].type] += 1;
        const vehicle = playerController.vehicle;
        return {
          total: fleet.size,
          sedan: counts.sedan,
          sports: counts.sports,
          van: counts.van,
          truck: counts.truck,
          police: counts.police,
          mode: playerController.mode,
          onFoot: playerController.mode === 'foot' ? 1 : 0,
          target: vehicle ? vehicle.config.label : 'Пешеход',
          targetType: vehicle ? vehicle.type : '',
          hp: vehicle ? Number(vehicle.hp.toFixed(1)) : 0,
          physMaxMs: Number(frameStats.physMaxMs.toFixed(3)),
        };
      },
      spawnVehicle: (type, x, z, heading) => {
        const vehicleType = type !== undefined && isVehicleType(type) ? type : 'sedan';
        let px: number;
        let pz: number;
        let ph: number;
        if (x !== undefined && z !== undefined && Number.isFinite(x) && Number.isFinite(z)) {
          px = x;
          pz = z;
          ph = heading ?? 0;
        } else {
          const point = pickRespawn(playerTransform.x, playerTransform.z, CITY_CAR_CLEAR_RADIUS);
          px = point.x;
          pz = point.z;
          ph = point.heading;
        }
        if (!placementFree(px, pz, CITY_CAR_CLEAR_RADIUS)) return -1;
        createVehicle(fleet, registry, { type: vehicleType, x: px, z: pz, heading: ph });
        return fleet.size;
      },
      damageActive: (amount) => {
        const vehicle = activeVehicle();
        if (!vehicle) return 0;
        return damageVehicle(vehicle, amount) ? 1 : 0;
      },
      repairActive: () => {
        const vehicle = activeVehicle();
        if (!vehicle) return;
        repairVehicleFull(vehicle);
      },
      enterVehicle: () => (playerController.enterNearest() ? 1 : 0),
      exitVehicle: () => (playerController.exitVehicle() ? 1 : 0),
      speedProbe: () => {
        const result: Record<string, number | string> = {};
        const seconds = 20;
        const steps = Math.ceil(seconds / TUNING.fixedStep);
        for (let t = 0; t < VEHICLE_TYPES.length; t += 1) {
          const type = VEHICLE_TYPES[t];
          // Пустой хэш: замер только продольной модели, без стен и трафика.
          const probeHash = new SpatialHash<Collider>(TUNING.spatialCellSize);
          const probeRegistry = new EntityRegistry(probeHash);
          const probeFleet = new VehicleFleet();
          const probePhysics = new VehiclePhysics(probeRegistry, probeFleet, probeHash, TUNING, null);
          const car = createVehicle(probeFleet, probeRegistry, { type, x: 0, z: 0, heading: 0 });
          let maxReached = 0;
          let timeToMax = -1;
          for (let i = 0; i < steps; i += 1) {
            probePhysics.step(car, FULL_THROTTLE, TUNING.fixedStep);
            const speed = Math.hypot(car.transform.vx, car.transform.vz);
            if (speed > maxReached) maxReached = speed;
            if (timeToMax < 0 && speed >= car.config.maxSpeed - 0.05) {
              timeToMax = (i + 1) * TUNING.fixedStep;
            }
          }
          result[type] = Number(maxReached.toFixed(2));
          result[`${type}Max`] = car.config.maxSpeed;
          result[`${type}Reached`] = timeToMax >= 0 ? 1 : 0;
          result[`${type}Time`] = Number(timeToMax.toFixed(2));
        }
        return result;
      },
      stressState: () => {
        let maxDistance = 0;
        for (let i = 0; i < movers.length; i += 1) {
          const spec = movers[i];
          const entity = registry.get(spec.id);
          if (!entity) continue;
          const distance = Math.hypot(
            entity.transform.x - spec.anchorX,
            entity.transform.z - spec.anchorZ,
          );
          if (distance > maxDistance) maxDistance = distance;
        }
        return {
          active: stressEnabled ? 1 : 0,
          movers: movers.length,
          anchorX: Number(startX.toFixed(2)),
          anchorZ: Number(startZ.toFixed(2)),
          maxDistance: Number(maxDistance.toFixed(2)),
        };
      },
      physicsBench: (count = 60, ticks = 120) => {
        const points: SpawnPoint[] = [];
        world.querySpawnPoints(0, 0, 5000, 'car', points);
        const created: VehicleState[] = [];
        // Габарит самой крупной машины + запас: не ставим 60 машин в кластер
        // из точек, проверенных лишь по 0.6 м (BUG-M4-004).
        const benchRadius = 3;
        for (let i = 0; i < points.length && created.length < count; i += 1) {
          const point = points[i];
          if (!placementFree(point.x, point.z, benchRadius)) continue;
          const vehicle = createVehicle(fleet, registry, {
            type: VEHICLE_TYPES[created.length % VEHICLE_TYPES.length],
            x: point.x,
            z: point.z,
            heading: point.heading,
          });
          const sin = Math.sin(point.heading);
          const cos = Math.cos(point.heading);
          vehicle.transform.vx = sin * 12;
          vehicle.transform.vz = cos * 12;
          created.push(vehicle);
        }
        const total = created.length;

        // Прогрев: первые шаги включают ветки контактов.
        for (let tick = 0; tick < 5; tick += 1) {
          for (let i = 0; i < created.length; i += 1) {
            physics.step(created[i], IDLE_VEHICLE_INPUT, TUNING.fixedStep);
          }
        }

        // Прогрев: первые шаги включают ветки контактов.
        for (let tick = 0; tick < 5; tick += 1) {
          for (let i = 0; i < created.length; i += 1) {
            physics.step(created[i], IDLE_VEHICLE_INPUT, TUNING.fixedStep);
          }
        }

        let totalMs = 0;
        let maxMs = 0;
        const samples: number[] = [];
        for (let tick = 0; tick < ticks; tick += 1) {
          const started = performance.now();
          for (let i = 0; i < created.length; i += 1) {
            physics.step(created[i], IDLE_VEHICLE_INPUT, TUNING.fixedStep);
          }
          const elapsed = performance.now() - started;
          totalMs += elapsed;
          samples.push(elapsed);
          if (elapsed > maxMs) maxMs = elapsed;
        }

        for (let i = 0; i < created.length; i += 1) {
          destroyVehicle(fleet, registry, created[i]);
        }
        registry.flush();

        const avgMs = ticks > 0 ? totalMs / ticks : 0;
        samples.sort((a, b) => a - b);
        const percentile = (q: number): number => {
          if (samples.length === 0) return 0;
          const index = Math.min(samples.length - 1, Math.floor(q * samples.length));
          return samples[index];
        };
        return {
          vehicles: total,
          ticks,
          avgMs: Number(avgMs.toFixed(3)),
          maxMs: Number(maxMs.toFixed(3)),
          p50Ms: Number(percentile(0.5).toFixed(3)),
          p95Ms: Number(percentile(0.95).toFixed(3)),
          p99Ms: Number(percentile(0.99).toFixed(3)),
          perCarMs: Number((total > 0 ? avgMs / total : 0).toFixed(4)),
        };
      },
      // --- M5: жизнь города -------------------------------------------------
      wanted: () => {
        const stats = wanted.stats;
        return {
          level: stats.level,
          heat: Number(stats.heat.toFixed(1)),
          cars: stats.cars,
          foot: stats.foot,
          health: Number(stats.health.toFixed(1)),
          seen: stats.seen,
          unseen: Number(stats.unseen.toFixed(1)),
          arrests: stats.arrests,
          spawned: stats.spawned,
          despawned: stats.despawned,
          copShots: stats.copShots,
          copHits: stats.copHits,
          nearestCar: Number(stats.nearestCar.toFixed(1)),
          nearestFoot: Number(stats.nearestFoot.toFixed(1)),
          updateMs: Number(stats.updateMs.toFixed(3)),
          maxUpdateMs: Number(stats.maxUpdateMs.toFixed(3)),
        };
      },
      setWanted: (level) => {
        wanted.setLevel(level);
        return wanted.level;
      },
      trafficStats: () => {
        const stats = traffic.stats;
        return {
          vehicles: stats.vehicles,
          near: stats.near,
          stopped: stats.stopped,
          avgSpeed: Number(stats.avgSpeed.toFixed(2)),
          spawned: stats.spawned,
          despawned: stats.despawned,
          updateMs: Number(stats.updateMs.toFixed(3)),
          maxUpdateMs: Number(stats.maxUpdateMs.toFixed(3)),
        };
      },
      pedStats: () => {
        const stats = peds.stats;
        return {
          total: stats.total,
          near: stats.near,
          idle: stats.idle,
          walk: stats.walking,
          alert: stats.alert,
          flee: stats.fleeing,
          panic: stats.panic,
          down: stats.down,
          knocked: stats.knocked,
          spawned: stats.spawned,
          despawned: stats.despawned,
          updateMs: Number(stats.updateMs.toFixed(3)),
          maxUpdateMs: Number(stats.maxUpdateMs.toFixed(3)),
        };
      },
      spawnCop: (x, z) => wanted.spawnCop(x, z),
      combatState: () => {
        return {
          weapon: combat.weapon,
          label: combat.weaponSpec.label,
          mag: combat.magAmmo,
          reserve: combat.reserveAmmo,
          reloading: combat.isReloading ? 1 : 0,
          recoil: Number(combat.recoil.toFixed(2)),
          wanted: wanted.level,
          health: Number(wanted.health.toFixed(1)),
        };
      },
      // --- M6: миссии, деньги, язык, сохранение, интерфейс -------------------
      missions: () => {
        const hudState = missions.hud();
        const marker = missions.marker();
        const progress = missions.save();
        return {
          active: missions.activeId ?? '',
          phase: hudState ? hudState.phase : '',
          distance: hudState ? Number(hudState.distance.toFixed(1)) : -1,
          remaining: hudState && hudState.remaining !== null ? Number(hudState.remaining.toFixed(1)) : -1,
          completed: progress.completed.length,
          failed: missions.stats.failed,
          markerX: marker ? Number(marker.x.toFixed(1)) : 0,
          markerZ: marker ? Number(marker.z.toFixed(1)) : 0,
          markerRadius: marker ? marker.radius : 0,
          cooldowns: Object.keys(progress.cooldowns).length,
        };
      },
      missionList: () => {
        const list: Record<string, number | string>[] = [];
        const statuses = missions.statuses();
        for (let i = 0; i < statuses.length; i += 1) {
          const entry = statuses[i];
          list.push({
            id: entry.def.id,
            index: i + 1,
            status: entry.status,
            cooldown: Number(entry.cooldown.toFixed(1)),
            reward: entry.def.reward,
            type: entry.def.type,
          });
        }
        return list;
      },
      startMission: (id) => (missions.start(id) ? 1 : 0),
      money: () => economy.money,
      addMoney: (amount) => {
        economy.add(amount, 'debug');
        return economy.money;
      },
      setLang: (lang) => {
        if (lang === 'ru' || lang === 'en' || lang === 'tr') setLanguage(lang);
        return i18n.lang;
      },
      saveGame: () => (saveGame(false) ? 1 : 0),
      loadGame: () => (loadGame() ? 1 : 0),
      buyUpgrade: (id) => {
        if (!isUpgradeId(id)) return 0;
        return economy.buyUpgrade(id).ok ? 1 : 0;
      },
      repairVehicle: () => (economy.repair(activeVehicleOrNull()).ok ? 1 : 0),
      paintVehicle: () => (economy.paint().ok ? 1 : 0),
      buyAmmo: () => (economy.buyAmmo().ok ? 1 : 0),
      shop: () => ({
        atGarage: atGarage() ? 1 : 0,
        distance: Number(garageDistance().toFixed(1)),
        repairCost: economy.repairCost(activeVehicleOrNull()),
        paintCost: economy.paintCost,
        ammoCost: economy.ammoCost,
        ammoNeeded:
          combat.magAmmo < combat.weaponSpec.mag || combat.reserveAmmo < combat.weaponSpec.reserve ? 1 : 0,
        contacts: economy.level('contacts'),
        garage: economy.level('garage'),
        insurance: economy.level('insurance'),
        rewardMultiplier: Number(economy.rewardMultiplier.toFixed(2)),
        serviceDiscount: Number(economy.serviceDiscount.toFixed(2)),
      }),
      uiState: () => {
        const hudState = missions.hud();
        return {
          money: economy.money,
          lang: i18n.lang,
          startScreen: menu.screen === 'start' ? 1 : 0,
          pauseOpen: menu.screen === 'pause' ? 1 : 0,
          pagerOpen: missions.pagerOpen ? 1 : 0,
          mobile: mobile.isActive ? 1 : 0,
          minimapWidth: minimap.canvas.width,
          minimapHeight: minimap.canvas.height,
          hudVisible: document.getElementById('tmc-hud') !== null ? 1 : 0,
          missionPanel: hudState ? 1 : 0,
          paused: loop.isPaused ? 1 : 0,
          stars: wanted.level,
          health: Number(wanted.health.toFixed(1)),
          speedKmh: Number(frameStats.speedKmh.toFixed(1)),
          statsVisible: statsElement && !statsElement.hidden ? 1 : 0,
        };
      },
      events: () =>
        events.events().map((event) => ({
          id: event.id,
          x: Math.round(event.x),
          z: Math.round(event.z),
          remaining: Number(event.remaining.toFixed(1)),
          reward: event.reward,
        })),
      forceEvent: (id, x, z) => events.forceEvent(id, x, z),
      cancelEvent: () => events.cancelEvent(),
      jobs: () => {
        const state = jobs.hud();
        return {
          active: jobs.activeId ?? '',
          completed: jobs.kindsCompleted,
          remaining: state ? Number(state.remaining.toFixed(1)) : -1,
          mode: state ? state.mode : '',
        };
      },
      jobList: () =>
        jobs.statuses().map((status) => ({
          id: status.def.id,
          cooldown: Number(status.cooldown.toFixed(1)),
        })),
      startJob: (id) => (jobs.start(id) ? 1 : 0),
      collectibles: () => collectiblesState(),
      collections: () => collectiblesState(),
      achievements: () =>
        achievements.list().map((item) => ({
          id: item.id,
          unlocked: item.unlocked ? 1 : 0,
          progress: item.progress,
          target: item.target,
        })),
      radio: () => ({
        station: radio.stationIndex,
        available: radio.available ? 1 : 0,
        news: radio.newsCount,
      }),
      dayNight: () => {
        const sample = dayNight.state;
        return {
          phase: Number(sample.phase.toFixed(3)),
          hour: Number(sample.hour.toFixed(2)),
          night: Number(sample.night.toFixed(2)),
        };
      },
      interest: () => ({
        events: events.activeCount,
        jobsCompleted: jobs.kindsCompleted,
        packages: collectibles.packagesFound,
        ramps: collectibles.rampsFound,
        cars: collectibles.carsFound,
        achievements: achievements.found,
        station: radio.stationIndex,
      }),
    };
  }

  // Диагностика мира в оверлее — только под ?debug=1 (дорогой layoutHash).
  if (debugWorld) {
    frameStats.layoutHash = world.layoutHash;
    frameStats.mapId = world.mapId;
    const info = world.info;
    frameStats.roads = info.roads;
    frameStats.blocks = info.blocks;
    frameStats.landmarks = info.landmarks;
  }

  /**
   * Отладочный урон идёт через публичный API сущности, чтобы дым и wrecked
   * обновились штатно.
   */
  // --- HUD ------------------------------------------------------------------
  let hudTimer = 0;

  /** Текст цели заказа: место и класс машины подставляются переводами. */
  function missionObjectiveText(state: MissionHudState): string {
    if (state.needVehicle) return i18n.t('mission.objective.needVehicle');
    const place = i18n.t(state.placeKey);
    if (state.objectiveKey === 'mission.objective.checkpoint') {
      return i18n.t(state.objectiveKey, {
        index: state.checkpointIndex,
        total: state.checkpointTotal,
        place,
      });
    }
    if (state.vehicleClass) {
      return i18n.t(state.objectiveKey, {
        place,
        class: i18n.t(`vehicle.${state.vehicleClass}`),
      });
    }
    return i18n.t(state.objectiveKey, { place });
  }

  function hudMission(): HudMission | null {
    const state = missions.hud();
    if (!state) return null;
    return {
      title: i18n.t(state.titleKey),
      objective: missionObjectiveText(state),
      timer: state.remaining !== null ? i18n.formatTime(state.remaining) : null,
      distance: i18n.t('mission.distance', { meters: Math.round(state.distance) }),
      urgent: state.remaining !== null && state.remaining <= 15,
    };
  }

  /** Текст цели подработки по режиму HUD. */
  function jobObjectiveText(state: JobHudState): string {
    switch (state.mode) {
      case 'vehicle':
        return i18n.t('job.objective.toVehicle');
      case 'start':
        return i18n.t('job.objective.toStart', { place: i18n.t(state.placeKey) });
      case 'stop':
        return i18n.t('job.objective.stop', {
          index: state.index,
          total: state.total,
          place: i18n.t(state.placeKey),
        });
      case 'checkpoint':
        return i18n.t('job.objective.checkpoint', {
          index: state.index,
          total: state.total,
          place: i18n.t(state.placeKey),
        });
      default:
        return i18n.t('job.objective.rampage', {
          done: state.wrecks,
          total: state.wreckTarget,
        });
    }
  }

  /** Строка события/подработки для HUD (одна панель — R-03). */
  function hudActivity(): HudActivity | null {
    const job = jobs.hud();
    if (job) {
      const objective = job.needVehicle
        ? `${jobObjectiveText(job)} · ${i18n.t('job.objective.needVehicle')}`
        : jobObjectiveText(job);
      return {
        kind: 'job',
        tag: i18n.t('job.hud.tag'),
        title: i18n.t(job.titleKey),
        objective,
        timer: i18n.formatTime(job.legRemaining ?? job.remaining),
        distance:
          job.distance > 0
            ? i18n.t('mission.distance', { meters: Math.round(job.distance) })
            : null,
        progress:
          job.mode === 'stop' || job.mode === 'checkpoint'
            ? i18n.t('job.progress', { index: job.index, total: job.total })
            : null,
        urgent: job.urgent,
      };
    }
    const event = events.hud();
    if (event) {
      return {
        kind: 'event',
        tag: i18n.t('event.tag'),
        title: i18n.t(event.titleKey),
        objective: i18n.t(event.descKey),
        timer: i18n.formatTime(event.remaining),
        distance: i18n.t('mission.distance', { meters: Math.round(event.distance) }),
        progress:
          event.more > 0
            ? i18n.t('event.more', { count: event.more })
            : event.hold > 0
              ? `${Math.round(event.hold * 100)}%`
              : null,
        urgent: event.remaining <= 12,
      };
    }
    return null;
  }

  /** Счётчики коллекций и достижений одной строкой. */
  function counterText(): string {
    const collect = i18n.t('collectible.hud', {
      packages: collectibles.packagesFound,
      packageTotal: collectibles.packagesTotal,
      cars: collectibles.carsFound,
      carTotal: collectibles.carsTotal,
      ramps: collectibles.rampsFound,
      rampTotal: collectibles.rampsTotal,
    });
    const ach = i18n.t('achievement.counter', {
      found: achievements.found,
      total: achievements.total,
    });
    return `${collect} · ${ach}`;
  }

  function buildPrompt(driving: boolean): string {
    const missionHint = i18n.t('hud.prompt.mission');
    if (driving) {
      return `${i18n.t('hud.prompt.exit')} · ${i18n.t('hud.prompt.fire')} · ${missionHint}`;
    }
    const nearest = playerController.nearest;
    const near = nearest
      ? i18n.t('hud.prompt.nearCar', { car: i18n.t(`vehicle.${nearest.type}`) })
      : '';
    return `${i18n.t('hud.prompt.drive')}${near} · ${i18n.t('hud.prompt.foot')} · ${i18n.t('hud.prompt.fire')} · ${missionHint}`;
  }

  function updateHud(): void {
    const driving = playerController.mode === 'driving';
    const vehicle = driving ? playerController.vehicle : null;
    const speed = vehicle
      ? Math.hypot(vehicle.transform.vx, vehicle.transform.vz) * 3.6
      : Math.hypot(playerTransform.vx, playerTransform.vz) * 3.6;

    // Достижения сверяются на HUD-тике, а не в каждом шаге физики.
    syncAchievements();

    hud.update({
      money: economy.money,
      health: wanted.health,
      maxHealth: WANTED.playerHealth,
      stars: wanted.level,
      speedKmh: speed,
      weapon: {
        labelKey: `weapon.${combat.weapon}`,
        mag: combat.magAmmo,
        reserve: combat.reserveAmmo,
        reloading: combat.isReloading,
      },
      mission: hudMission(),
      activity: hudActivity(),
      counter: counterText(),
      prompt: uiSettings.hints ? buildPrompt(driving) : null,
    });

    // Мини-карта: игрок, копы, маркер заказа и гараж (точка услуг).
    const position = playerWorldPosition();
    const cops: { x: number; z: number }[] = [];
    for (let i = 0; i < fleet.list.length; i += 1) {
      const car = fleet.list[i];
      if (car.type === 'police') cops.push({ x: car.transform.x, z: car.transform.z });
    }
    const markers: MinimapMarker[] = [];
    const marker = missions.marker();
    if (marker) {
      markers.push({
        x: marker.x,
        z: marker.z,
        kind:
          marker.kind === 'toStart'
            ? 'start'
            : marker.kind === 'checkpoint'
              ? 'checkpoint'
              : 'target',
      });
    }
    markers.push({ x: ECONOMY.garage[0], z: ECONOMY.garage[1], kind: 'garage' });
    const jobMarker = jobs.marker();
    if (jobMarker) {
      markers.push({ x: jobMarker.x, z: jobMarker.z, kind: 'job' });
    } else {
      const eventMarker = events.marker();
      if (eventMarker) markers.push({ x: eventMarker.x, z: eventMarker.z, kind: 'event' });
    }
    collectibles.nearestLoot(position.x, position.z, UI.layout.minimapRange, 24);
    minimap.update({
      playerX: position.x,
      playerZ: position.z,
      playerHeading: vehicle ? vehicle.transform.heading : playerTransform.heading,
      cops,
      markers,
      loot: collectibles.loot,
    });
  }

  // --- фикс. шаг ------------------------------------------------------------
  let logicMsSum = 0;
  let logicSamples = 0;
  let logicMsMax = 0;
  let physMsMax = 0;
  let logicSteps = 0;
  let inputReads = 0;
  let streamTimer = 0;

  function activeTargetTransform(): { x: number; z: number; vx: number; vz: number } {
    const vehicle = playerController.vehicle;
    if (playerController.mode === 'driving' && vehicle) return vehicle.transform;
    return playerTransform;
  }

  function step(dt: number): void {
    const started = performance.now();
    // BUG-M4-006: ввод читается ровно один раз за фиксированный шаг.
    // Все системы получают уже готовый inputState, повторных read() нет.
    input.read(inputState);
    // Мобильные контролы домешиваются в тот же снимок: физика не различает
    // источник ввода. Фронты тача забираем здесь же.
    mobile.apply(inputState);
    if (mobile.consumeInteract()) interactRequested = true;
    if (mobile.consumeFirePressed()) firePressed = true;
    inputReads += 1;
    logicSteps += 1;
    gameTime += dt;
    statsState.playSeconds += dt;
    if (stealTimer > 0) stealTimer = Math.max(0, stealTimer - dt);
    if (inputState.reset) resetActiveTarget();

    if (interactRequested) {
      interactRequested = false;
      const changed = toggleVehicle();
      // Угон трафика/полицейской машины: система перестаёт ею управлять,
      // дальше машину ведёт ввод игрока (иначе двойная физика).
      const stolen = playerController.vehicle;
      if (changed && stolen) {
        const wasManaged = traffic.owns(stolen.id) || wanted.owns(stolen.id);
        traffic.forget(stolen.id);
        wanted.releaseVehicle(stolen.id);
        if (wasManaged && stealTimer <= 0) {
          economy.add(ECONOMY.stealReward, 'steal');
          stealTimer = ECONOMY.stealCooldown;
          toast.show(
            i18n.t('toast.steal', {
              reward: `${i18n.t('hud.currency')}${i18n.formatNumber(ECONOMY.stealReward)}`,
            }),
            'success',
            2,
          );
        }
      }
    }

    if (playerController.mode === 'driving') playerController.syncInsideVehicle();
    else playerController.stepFoot(dt, inputState);

    const driven = playerController.mode === 'driving' ? playerController.vehicle : null;

    // --- снимок игрока для систем жизни --------------------------------------
    playerSnapshot.x = driven ? driven.transform.x : playerTransform.x;
    playerSnapshot.z = driven ? driven.transform.z : playerTransform.z;
    playerSnapshot.vx = driven ? driven.transform.vx : playerTransform.vx;
    playerSnapshot.vz = driven ? driven.transform.vz : playerTransform.vz;
    playerSnapshot.heading = driven ? driven.transform.heading : playerTransform.heading;
    playerSnapshot.onFoot = playerController.mode === 'foot';
    playerSnapshot.vehicle = driven;

    trafficContext.wantedLevel = wanted.level;
    trafficContext.sirenX = wanted.sirenPositionX;
    trafficContext.sirenZ = wanted.sirenPositionZ;

    // --- ИИ до физики: агенты шагают себя сами (owns) ------------------------
    traffic.update(dt, gameTime, playerSnapshot.x, playerSnapshot.z, trafficContext);
    wanted.update(dt, playerSnapshot);
    combat.update(dt);

    if (weaponRequest >= 0) {
      combat.selectWeapon(WEAPON_ORDER[weaponRequest]);
      weaponRequest = -1;
    }
    if (reloadRequested) {
      reloadRequested = false;
      combat.reload();
    }
    if (hornRequested) {
      hornRequested = false;
      peds.alertAt(playerSnapshot.x, playerSnapshot.z, HORN_RADIUS, 'alert');
      audio.horn();
    }
    if ((fireHeld || mobile.fireHeld) && (firePressed || combat.weaponSpec.auto)) firePlayerWeapon();
    firePressed = false;

    // --- физика: игрок и припаркованные; ИИ-машины уже шагнули себя ----------
    const physicsStarted = performance.now();
    for (let i = 0; i < fleet.list.length; i += 1) {
      const vehicle = fleet.list[i];
      if (vehicle === driven) {
        physics.step(vehicle, inputState, dt);
        continue;
      }
      if (traffic.owns(vehicle.id) || wanted.owns(vehicle.id)) continue;
      // Машины событий и соперников гонки шагают свои системы (M8).
      if (events.owns(vehicle.id) || jobs.owns(vehicle.id)) continue;
      physics.step(vehicle, IDLE_VEHICLE_INPUT, dt);
    }
    const physicsMs = performance.now() - physicsStarted;
    if (physicsMs > physMsMax) physMsMax = physicsMs;
    updateStressMovers(dt);

    // --- пешеходы: после физики, чтобы видеть итоговые позиции машин ---------
    peds.update(
      dt,
      gameTime,
      playerSnapshot.x,
      playerSnapshot.z,
      wanted.sirenPositionX,
      wanted.sirenPositionZ,
      wanted.level,
      wanted.sirenNear,
    );

    // --- миссии: этапы, таймеры, награда/провал ------------------------------
    missionPlayer.x = driven ? driven.transform.x : playerTransform.x;
    missionPlayer.z = driven ? driven.transform.z : playerTransform.z;
    missionPlayer.inVehicle = driven !== null;
    missionPlayer.vehicleType = driven ? driven.type : null;
    missionPlayer.vehicleWrecked = driven ? driven.wrecked : false;
    missionPlayer.vehicleId = driven ? driven.id : -1;
    missions.update(dt, missionPlayer);

    // --- M8: события, подработки, коллекции, сутки --------------------------
    lifePlayer.x = missionPlayer.x;
    lifePlayer.z = missionPlayer.z;
    lifePlayer.inVehicle = missionPlayer.inVehicle;
    lifePlayer.vehicleId = missionPlayer.vehicleId;
    lifePlayer.vehicleType = missionPlayer.vehicleType;
    lifePlayer.speed = Math.hypot(
      driven ? driven.transform.vx : playerTransform.vx,
      driven ? driven.transform.vz : playerTransform.vz,
    );
    events.update(dt, lifePlayer);
    jobs.update(dt, lifePlayer);
    collectibles.update(dt, lifePlayer);
    dayNight.update(dt);
    radio.update(dt);

    // Отдача оружия и импульс машины → тряска камеры; взрывы без крови.
    if (combat.recoil > 0.01) {
      shakePower = Math.max(shakePower, clamp(combat.recoil, 0.15, SHAKE_MAX) * 0.5);
      shakeTime = Math.max(shakeTime, SHAKE_DURATION * 0.5);
    }
    if (driven && driven.impactPulse > 0) {
      shakePower = clamp(driven.impactPulse / 18, 0.2, SHAKE_MAX);
      shakeTime = SHAKE_DURATION;
      driven.impactPulse = 0;
    }
    for (let i = 0; i < fleet.list.length; i += 1) {
      const vehicle = fleet.list[i];
      if (!vehicle.justWrecked) continue;
      vehicle.justWrecked = false;
      vehicleView.burst(vehicle.transform.x, vehicle.transform.z, 1);
      wreckIds.push(vehicle.id);
      wreckXs.push(vehicle.transform.x);
      wreckZs.push(vehicle.transform.z);
      if (vehicle === driven) {
        shakePower = SHAKE_MAX;
        shakeTime = SHAKE_DURATION;
      }
    }
    // Уведомления о разбитых машинах — после обхода флота: сцены и работы
    // могут освободить машину, и splice внутри цикла испортил бы индексы.
    for (let i = 0; i < wreckIds.length; i += 1) {
      totalWrecks += 1;
      events.notifyWreck(wreckIds[i]);
      jobs.notifyWreck(wreckXs[i], wreckZs[i]);
    }
    wreckIds.length = 0;
    wreckXs.length = 0;
    wreckZs.length = 0;

    registry.flush();

    streamTimer += dt;
    if (streamTimer >= STREAM_INTERVAL) {
      streamTimer = 0;
      const target = activeTargetTransform();
      world.update(target.x, target.z);
    }

    const stepMs = performance.now() - started;
    logicMsSum += stepMs;
    logicSamples += 1;
    if (stepMs > logicMsMax) logicMsMax = stepMs;
  }

  // --- рендер кадра --------------------------------------------------------
  function renderFrame(alpha: number, frameDt: number): void {
    // Интерполяция для рендера: активная цель (машина или пешеход).
    const target =
      playerController.mode === 'driving' && playerController.vehicle
        ? playerController.vehicle.transform
        : playerTransform;
    const renderX = lerp(target.prevX, target.x, alpha);
    const renderZ = lerp(target.prevZ, target.z, alpha);

    vehicleView.sync(fleet.list, alpha, frameDt);
    npcView.sync(peds.pool.list, copPool.list, alpha, frameDt);
    effectsView.sync(frameDt);
    const footX = lerp(playerTransform.prevX, playerTransform.x, alpha);
    const footZ = lerp(playerTransform.prevZ, playerTransform.z, alpha);
    const footHeading = lerpAngle(playerTransform.prevHeading, playerTransform.heading, alpha);
    playerView.sync(footX, footZ, footHeading, playerController.mode === 'foot');

    syncStressMovers(alpha);
    cityView.sync(world);

    // M8: сутки, фары и коллекции — без пересоздания сцены.
    ambienceTimer -= frameDt;
    if (ambienceTimer <= 0) {
      ambienceTimer = DAY_NIGHT.applyInterval;
      applyAmbience();
    }
    const night = dayNight.state.night;
    nightView.sync(fleet.list, alpha, night, gameTime);
    lifePropsView.sync(
      gameTime,
      night,
      collectibles.packageMask,
      collectibles.rampMask,
      collectibles.uniqueCars,
    );

    if (shakeTime > 0) {
      shakeTime = Math.max(0, shakeTime - frameDt);
      shakePhase += frameDt * 46;
      if (shakeTime === 0) shakePower = 0;
    }

    followCamera.update(frameDt, renderX, renderZ, target.vx, target.vz);
    applyCamera();

    // Маркер: один 3D-маркер, приоритет миссия > подработка > событие (R-04).
    const missionMarker = missions.marker();
    const jobMarker = jobs.marker();
    const eventMarker = events.marker();
    const activityMarker = jobMarker ?? eventMarker;
    if (missionMarker) {
      missionMarkerView.set(
        missionMarker.x,
        missionMarker.z,
        missionMarker.radius,
        missionMarker.kind === 'toStart' ? 0x4dabf7 : 0xffa94d,
      );
      activityMarkerView.hide();
    } else if (activityMarker) {
      missionMarkerView.hide();
      activityMarkerView.set(
        activityMarker.x,
        activityMarker.z,
        activityMarker.radius,
        activityMarker.color,
      );
    } else {
      missionMarkerView.hide();
      activityMarkerView.hide();
    }
    missionMarkerView.update(frameDt);
    activityMarkerView.update(frameDt);

    // Сирена и визг шин идут от состояния, а не от событий: нет сирены — тишина.
    const sirenDistance = wanted.sirenNear
      ? Math.hypot(wanted.sirenPositionX - renderX, wanted.sirenPositionZ - renderZ)
      : 0;
    audio.siren(wanted.sirenNear && wanted.level > 0, sirenDistance);
    audio.update(frameDt);

    sun.position.set(renderX + 55, 105, renderZ + 40);
    sun.target.position.set(renderX, 0, renderZ);
    sun.target.updateMatrixWorld();

    renderer.render(scene, camera);

    const info = renderer.info.render;
    const worldStats = world.stats;
    const vehicle = playerController.vehicle;
    const speed = vehicle
      ? Math.hypot(vehicle.transform.vx, vehicle.transform.vz) * 3.6
      : Math.hypot(playerTransform.vx, playerTransform.vz) * 3.6;    frameStats.drawCalls = info.calls;
    frameStats.triangles = info.triangles;
    frameStats.speedKmh = speed;
    frameStats.colliders = colliderHash.size;
    frameStats.movingColliders = registry.dynamicColliders;
    frameStats.entities = registry.total;
    frameStats.overrun = loop.overrun;
    frameStats.debtMs = loop.debt * 1000;
    frameStats.logicMs = logicSamples > 0 ? logicMsSum / logicSamples : 0;
    frameStats.logicMaxMs = logicMsMax;
    frameStats.physMaxMs = physMsMax;
    frameStats.chunks = world.activeChunks.length;
    frameStats.chunkGenMaxMs = worldStats.genMaxMs;
    frameStats.chunkGenLastMs = worldStats.genLastMs;
    frameStats.worldUpdateMs = worldStats.updateMs;
    frameStats.vehicles = fleet.size;
    frameStats.playerMode = playerController.mode === 'driving' ? 'car' : 'onFoot';
    frameStats.targetLabel = vehicle
      ? `${vehicle.config.label} [${vehicle.type}] #${vehicle.handle}`
      : 'Пешеход';
    frameStats.vehicleHp = vehicle ? (vehicle.hp / vehicle.maxHp) * 100 : 100;
    logicMsSum = 0;
    logicSamples = 0;
    logicMsMax = 0;
    physMsMax = 0;

    hudTimer -= frameDt;
    if (hudTimer <= 0) {
      hudTimer = HUD_INTERVAL;
      updateHud();
    }

    // Мобильный стик сглаживается в кадре рендера, а не в фикс. шаге.
    mobile.update(frameDt);
    toast.update(frameDt);

    // Автосохранение: раз в ECONOMY.autosaveInterval секунд, только в игре.
    if (ECONOMY.autosaveInterval > 0 && !loop.isPaused) {
      autosaveTimer += frameDt;
      if (autosaveTimer >= ECONOMY.autosaveInterval) {
        autosaveTimer = 0;
        saveGame(true);
      }
    }

    debug.update(frameDt, frameStats);
  }

  // --- цикл, пауза, resize -------------------------------------------------
  const loop = new GameLoop(step, renderFrame, {
    fixedStep: TUNING.fixedStep,
    maxSteps: TUNING.maxSubsteps,
    maxFrameDelta: TUNING.maxFrameDelta,
  });

  // Пауза — набор причин: фокус, меню, пейджер, стартовый экран.
  window.addEventListener('blur', () => {
    pauseBlur = true;
    applyPauseState();
  });
  window.addEventListener('focus', () => {
    if (document.hidden) return;
    pauseBlur = false;
    applyPauseState();
  });
  document.addEventListener('visibilitychange', () => {
    pauseBlur = document.hidden;
    applyPauseState();
  });

  function resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const preset = UI.quality[uiSettings.quality];
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, preset.pixelRatio));
    renderer.shadowMap.enabled = preset.shadows;
    sun.castShadow = preset.shadows;
    renderer.setSize(width, height);
    followCamera.resize(width, height);

    const frustum = followCamera.frustum;
    camera.left = frustum.left;
    camera.right = frustum.right;
    camera.top = frustum.top;
    camera.bottom = frustum.bottom;
    camera.updateProjectionMatrix();
    minimap.resize();
  }

  window.addEventListener('resize', resize);

  const loadingElement = document.getElementById('loading');
  if (loadingElement) loadingElement.classList.add('hidden');

  // Стартовый экран: игра стоит на паузе, пока игрок не нажмёт «Играть».
  menu.openStart();
  pauseStart = true;
  applyPauseState();
  updateHud();
  // Один кадр под стартовым экраном: город уже виден, а не чёрный фон.
  renderFrame(0, 1 / 60);
  loop.start();
  if (document.hidden) {
    pauseBlur = true;
    applyPauseState();
  }
}
