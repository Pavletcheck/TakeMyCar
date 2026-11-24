import * as THREE from 'three';
import { FollowCamera } from '../core/camera';
import { resolveRectBody } from '../core/collision';
import { EventBus } from '../core/events';
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
import { createNpcView } from '../render/npcView';
import { createPlayerView } from '../render/playerView';
import { createVehicleView } from '../render/vehicleView';
import { TUNING } from '../config/tuning';
import { WORLD } from '../config/world';
import { VEHICLE_TYPES, isVehicleType, vehicleColliderRadius } from '../config/vehicles';
import { PLAYER } from '../config/player';
import { WANTED, WEAPON_ORDER } from '../config/life';
import type { VehicleTypeId } from '../config/vehicles';
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
import { createVehicleAudio } from '../systems/vehicleAudio';
import { PlayerController } from '../systems/playerController';
import { TrafficSystem } from '../systems/traffic';
import { PedsSystem } from '../systems/peds';
import { CombatSystem } from '../systems/combat';
import { WantedSystem } from '../systems/wanted';
import { DEFAULT_MAP_ID, loadCityMap } from '../world/mapLoader';
import { serializeRoadGraph } from '../world/roadGraph';
import type { SpawnPoint } from '../world/types';
import { buildWorldFromMap } from '../world/world';
import { createDebugStats, DebugOverlay } from './debug';
import { createLifeHud } from './lifeHud';

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

interface GameEvents extends Record<string, unknown> {
  pause: { paused: boolean };
}

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
  const stressEnabled = params.get('stress') === '1';
  // Планировка авторская и фиксированная: ?seed больше не меняет карту.
  // ?map=city выбирает файл карты из assets/maps.
  const map = loadCityMap(params.get('map') ?? DEFAULT_MAP_ID);
  const seed = map.seed;

  const events = new EventBus<GameEvents>();
  const input = new InputMap();
  attachKeyboard(input, window);
  const inputState = createInputState();
  const debug = new DebugOverlay(document.getElementById('stats'));
  const hintElement = document.getElementById('hint');
  const lifeHud = createLifeHud(document.getElementById('hud'));
  const frameStats = createDebugStats();
  frameStats.seed = seed;
  frameStats.mapId = map.id;
  frameStats.showWorld = debugWorld;
  frameStats.stressActive = stressEnabled;

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
  const audio = createVehicleAudio();
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
    lifeHud.notify(level > 0 ? `Розыск ${level}` : 'Розыск снят');
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
    lifeHud.notify(reason === 'arrest' ? 'Арест! Розыск снят' : 'Выведен из строя');
  };

  // Стартовое население: только за пределами безопасной зоны.
  traffic.prefill(TRAFFIC_PREFILL, spawn.x, spawn.z);
  peds.prefill(PEDS_PREFILL, spawn.x, spawn.z);

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
  let gameTime = 0;
  let fireHeld = false;
  let firePressed = false;
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
    combat.tryFire(originX, originZ, dirX, dirZ, vehicle ? vehicle.id : -1);
  }

  // --- ввод M5: огонь ЛКМ, оружие 1/2/3, перезарядка F, сигнал H ------------
  function updatePointer(event: MouseEvent): void {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  const onMouseDown = (event: MouseEvent): void => {
    if (event.button !== 0) return;
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
  let interactRequested = false;
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat) return;
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

  // --- отладочный API -------------------------------------------------------
  // window.__tmc доступен всегда: на нём висят смоук-тесты qa (M5).
  // Тяжёлая диагностика мира (layoutHash, info) считается только под ?debug=1.
  {
    const activeVehicle = (): VehicleState | null => playerController.vehicle ?? fleet.list[0] ?? null;

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
  let lastHint = '';

  function updateHud(): void {
    lifeHud.update(
      {
        stars: wanted.level,
        health: wanted.health,
        weapon: combat.weaponSpec.label,
        mag: combat.magAmmo,
        reserve: combat.reserveAmmo,
        reloading: combat.isReloading,
        driving: playerController.mode === 'driving',
      },
      HUD_INTERVAL,
    );
    if (!hintElement) return;
    const vehicle = playerController.mode === 'driving' ? playerController.vehicle : null;
    const fightHint = 'ЛКМ — огонь · 1/2/3 — оружие · F — перезарядка · H — сигнал';
    let text: string;
    if (vehicle) {
      const speed = Math.round(Math.hypot(vehicle.transform.vx, vehicle.transform.vz) * 3.6);
      const hp = Math.round((vehicle.hp / vehicle.maxHp) * 100);
      const state = vehicle.wrecked ? ' · уничтожена' : '';
      text = `${vehicle.config.label} · ${vehicle.type} · HP ${hp}%${state} · ${speed} км/ч · E — выйти · R — на дорогу · ${fightHint}`;
    } else {
      const nearest = playerController.nearest;
      const carHint = nearest ? ` · рядом: ${nearest.config.label}` : '';
      text = `Пешком · E — сесть в машину${carHint} · WASD — идти · ${fightHint}`;
    }
    if (text !== lastHint) {
      hintElement.textContent = text;
      lastHint = text;
    }
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
    inputReads += 1;
    logicSteps += 1;
    gameTime += dt;
    if (inputState.reset) resetActiveTarget();

    if (interactRequested) {
      interactRequested = false;
      toggleVehicle();
      // Угон трафика/полицейской машины: система перестаёт ею управлять,
      // дальше машину ведёт ввод игрока (иначе двойная физика).
      const stolen = playerController.vehicle;
      if (stolen) {
        traffic.forget(stolen.id);
        wanted.releaseVehicle(stolen.id);
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
    }
    if (fireHeld && (firePressed || combat.weaponSpec.auto)) firePlayerWeapon();
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
      if (vehicle === driven) {
        shakePower = SHAKE_MAX;
        shakeTime = SHAKE_DURATION;
      }
    }

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

    if (shakeTime > 0) {
      shakeTime = Math.max(0, shakeTime - frameDt);
      shakePhase += frameDt * 46;
      if (shakeTime === 0) shakePower = 0;
    }

    followCamera.update(frameDt, renderX, renderZ, target.vx, target.vz);
    applyCamera();

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

    debug.update(frameDt, frameStats);
  }

  // --- цикл, пауза, resize -------------------------------------------------
  const loop = new GameLoop(step, renderFrame, {
    fixedStep: TUNING.fixedStep,
    maxSteps: TUNING.maxSubsteps,
    maxFrameDelta: TUNING.maxFrameDelta,
  });

  events.on('pause', (event) => {
    if (event.paused) {
      loop.pause();
      input.clear();
    } else {
      loop.resume();
    }
  });

  function setPaused(paused: boolean): void {
    events.emit('pause', { paused });
  }

  window.addEventListener('blur', () => setPaused(true));
  window.addEventListener('focus', () => {
    if (!document.hidden) setPaused(false);
  });
  document.addEventListener('visibilitychange', () => setPaused(document.hidden));

  function resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    followCamera.resize(width, height);

    const frustum = followCamera.frustum;
    camera.left = frustum.left;
    camera.right = frustum.right;
    camera.top = frustum.top;
    camera.bottom = frustum.bottom;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);

  const loadingElement = document.getElementById('loading');
  if (loadingElement) loadingElement.classList.add('hidden');

  updateHud();
  loop.start();
  if (document.hidden) setPaused(true);
}
