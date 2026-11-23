import * as THREE from 'three';
import { FollowCamera } from '../core/camera';
import { moveCircle, resolveRectBody } from '../core/collision';
import type { CircleBody, SolveResult } from '../core/collision';
import { EventBus } from '../core/events';
import { attachKeyboard, createInputState, InputMap } from '../core/input';
import { GameLoop } from '../core/loop';
import { clamp, lerp, lerpAngle } from '../core/math';
import type { Collider, Contact, Rect } from '../core/math';
import { EntityRegistry } from '../core/registry';
import type { EntityId } from '../core/registry';
import { createRng } from '../core/rng';
import { createCityView } from '../render/cityView';
import { TUNING } from '../config/tuning';
import { WORLD } from '../config/world';
import { serializeRoadGraph } from '../world/roadGraph';
import type { SpawnPoint } from '../world/types';
import { createWorld } from '../world/world';
import { createDebugStats, DebugOverlay } from './debug';

// ---------------------------------------------------------------------------
// M3. Композиционный корень: рендер/сцена, мир (createWorld + cityView),
// машина, камера, цикл и отладка. Three.js живёт только здесь и в render/**.
// Город больше не строится инлайном: данные — src/world/**, меши — cityView.
// ---------------------------------------------------------------------------

const STREAM_INTERVAL = 0.25;

const CAR_RADIUS = 1.8;

const CAR_TUNING = {
  accel: 22,
  brake: 34,
  maxSpeed: 30,
  maxReverse: 9,
  steerRate: 2.6,
  grip: 6.5,
  handbrakeGrip: 0.8,
} as const;

const VIEW_HEIGHT = 110;
const CAMERA_HEIGHT = 130;
const CAMERA_BACK_OFFSET = 62;
const CAMERA_DAMP = 6;
const CAMERA_LOOK_AHEAD = 0.3;
const CAMERA_MAX_LOOK_AHEAD = 5;

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
}

/** Отладочный API под ?debug=1: детерминизм и бюджеты проверяются числом. */
interface TmcDebugApi {
  readonly seed: number;
  readonly layoutHash: number;
  exportRoadGraph(): string;
  stats(): Record<string, number>;
  /** Телепорт машины для проверки районов (набережная, промзона). */
  teleport(x: number, z: number): void;
  carState(): Record<string, number>;
}

declare global {
  interface Window {
    __tmc?: TmcDebugApi;
  }
}

function parseSeed(raw: string | null, fallback: number): number {
  if (raw === null || raw === '') return fallback;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) ? value >>> 0 : fallback;
}

export function bootstrap(): void {
  const container = document.getElementById('game');
  if (!container) throw new Error('Не найден контейнер #game');

  const params = new URLSearchParams(window.location.search);
  const debugWorld = params.get('debug') === '1';
  const stressEnabled = params.get('stress') === '1';
  const seed = parseSeed(params.get('seed'), WORLD.seed);

  const events = new EventBus<GameEvents>();
  const input = new InputMap();
  attachKeyboard(input, window);
  const inputState = createInputState();
  const debug = new DebugOverlay(document.getElementById('stats'));
  const frameStats = createDebugStats();
  frameStats.seed = seed;
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
  // ?seed=N переопределяет сид всего мира: кварталы, граф, пропсы, вода.
  const world = createWorld(seed, WORLD);
  const colliderHash = world.colliders;
  const registry = new EntityRegistry(colliderHash);
  const collisionCandidates: Collider[] = [];
  const contact: Contact = { nx: 0, nz: 0, depth: 0 };

  const worldWidth = world.bounds.maxX - world.bounds.minX;
  const worldDepth = world.bounds.maxZ - world.bounds.minZ;
  const worldRadius = Math.hypot(worldWidth, worldDepth) / 2;
  // Туман и дальняя плоскость привязаны к bounds мира, а не к старой константе.
  const fogFar = clamp(worldRadius * 0.33, 220, 300);
  scene.fog = new THREE.Fog(0x10141a, fogFar * 0.5, fogFar);
  const cameraFar = Math.max(700, worldRadius * 1.8);

  // --- машина ---------------------------------------------------------------
  const player = registry.create('player');
  const car = player.transform;
  const spawn = world.defaultSpawn;
  car.x = spawn.x;
  car.z = spawn.z;
  car.heading = spawn.heading;
  car.prevX = spawn.x;
  car.prevZ = spawn.z;
  car.prevHeading = spawn.heading;

  const carGroup = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.7, 4.4),
    new THREE.MeshLambertMaterial({ color: 0xff5c5c }),
  );
  body.position.y = 0.65;
  body.castShadow = true;
  carGroup.add(body);

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 0.6, 2.1),
    new THREE.MeshLambertMaterial({ color: 0x1a2230 }),
  );
  cabin.position.set(0, 1.25, -0.15);
  cabin.castShadow = true;
  carGroup.add(cabin);

  const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.36, 12);
  const wheelMat = new THREE.MeshLambertMaterial({ color: 0x11151b });
  const wheelOffsets = [
    [-1.05, 1.45],
    [1.05, 1.45],
    [-1.05, -1.45],
    [1.05, -1.45],
  ] as const;
  for (const [wx, wz] of wheelOffsets) {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(wx, 0.42, wz);
    wheel.castShadow = true;
    carGroup.add(wheel);
  }
  carGroup.position.set(car.x, 0, car.z);
  carGroup.rotation.y = car.heading;
  scene.add(carGroup);

  // --- стресс-режим ?stress=1 ----------------------------------------------
  let stressMesh: THREE.InstancedMesh | null = null;
  const movers: MoverSpec[] = [];
  let stressTime = 0;
  const stressDummy = new THREE.Object3D();

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
    stressMesh = mesh;
    const color = new THREE.Color();
    const stressRng = createRng(STRESS_SEED);

    let placed = 0;
    let attempts = 0;
    while (placed < staticCount && attempts < staticCount * 10) {
      attempts += 1;
      const x = car.x + stressRng.range(-STRESS_RADIUS, STRESS_RADIUS);
      const z = car.z + stressRng.range(-STRESS_RADIUS, STRESS_RADIUS);
      // Не застраиваем точку спавна машины.
      if (Math.abs(x - car.x) < 6 && Math.abs(z - car.z) < 6) continue;
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
        car.x +
        (axis === 0
          ? centerSign * MOVER_CENTER + Math.sin(phase) * MOVER_AMPLITUDE
          : laneSign * MOVER_LANE + Math.cos(phase) * MOVER_WEAVE);
      transform.z =
        car.z +
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
  followCamera.snapTo(car.x, car.z);
  applyCamera();

  function applyCamera(): void {
    const bounds = world.bounds;
    // Камера не выезжает за пределы мира (?seed и любой размер из конфига).
    followCamera.position.x = clamp(followCamera.position.x, bounds.minX, bounds.maxX);
    followCamera.position.z = clamp(followCamera.position.z, bounds.minZ, bounds.maxZ);
    followCamera.target.x = clamp(followCamera.target.x, bounds.minX, bounds.maxX);
    followCamera.target.z = clamp(followCamera.target.z, bounds.minZ, bounds.maxZ);
    camera.position.set(followCamera.position.x, followCamera.position.y, followCamera.position.z);
    camera.lookAt(followCamera.target.x, followCamera.target.y, followCamera.target.z);
  }

  // --- физика машины -------------------------------------------------------
  let speedKmh = 0;
  const carBody: CircleBody = { x: car.x, z: car.z, vx: 0, vz: 0, radius: CAR_RADIUS };
  const solveResult: SolveResult = { hit: false, contacts: 0, impact: 0, substeps: 0 };
  const moverBody: Rect = { x: 0, z: 0, hx: MOVER_HALF, hz: MOVER_HALF, angle: 0 };
  const spawnQuery: SpawnPoint[] = [];

  /** Респавн берётся из querySpawnPoints, а не из константы (M3-A-05). */
  function pickRespawn(): SpawnPoint {
    world.querySpawnPoints(car.x, car.z, 450, 'car', spawnQuery);
    let best: SpawnPoint | null = null;
    let fallback: SpawnPoint | null = null;
    let bestDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < spawnQuery.length; i += 1) {
      const point = spawnQuery[i];
      if (!fallback) fallback = point;
      const dx = point.x - car.x;
      const dz = point.z - car.z;
      const dist = dx * dx + dz * dz;
      if (dist < 100) continue; // не телепортируем на текущее место
      if (dist < bestDist) {
        bestDist = dist;
        best = point;
      }
    }
    return best ?? fallback ?? world.defaultSpawn;
  }

  function resetCar(): void {
    const point = pickRespawn();
    car.x = point.x;
    car.z = point.z;
    car.heading = point.heading;
    car.vx = 0;
    car.vz = 0;
    car.prevX = point.x;
    car.prevZ = point.z;
    car.prevHeading = point.heading;
    speedKmh = 0;
    followCamera.snapTo(car.x, car.z);
    world.prefetch(car.x, car.z);
  }

  function updateCar(dt: number): void {
    car.prevX = car.x;
    car.prevZ = car.z;
    car.prevHeading = car.heading;

    input.read(inputState);
    if (inputState.reset) resetCar();

    const throttle = inputState.throttle > 0.5 ? 1 : 0;
    const braking = inputState.brake > 0.5 ? 1 : 0;
    const steerInput = inputState.steer;
    const handbrake = inputState.handbrake;

    const sin = Math.sin(car.heading);
    const cos = Math.cos(car.heading);

    let forward = car.vx * sin + car.vz * cos;
    let lateral = car.vx * cos - car.vz * sin;

    if (throttle > 0) forward += CAR_TUNING.accel * dt;
    if (braking > 0) {
      if (forward > 0.5) forward -= CAR_TUNING.brake * dt;
      else forward -= CAR_TUNING.accel * 0.65 * dt;
    }

    forward -= forward * 0.55 * dt;
    forward -= Math.sign(forward) * Math.min(Math.abs(forward), 2.2 * dt);
    forward = clamp(forward, -CAR_TUNING.maxReverse, CAR_TUNING.maxSpeed);

    const steerFactor = Math.min(1, Math.abs(forward) / 6);
    car.heading += steerInput * CAR_TUNING.steerRate * dt * steerFactor * (forward < 0 ? -1 : 1);

    lateral *= Math.exp(-(handbrake ? CAR_TUNING.handbrakeGrip : CAR_TUNING.grip) * dt);

    car.vx = sin * forward + cos * lateral;
    car.vz = cos * forward - sin * lateral;

    carBody.x = car.x;
    carBody.z = car.z;
    carBody.vx = car.vx;
    carBody.vz = car.vz;
    moveCircle(carBody, dt, colliderHash, collisionCandidates, contact, TUNING, solveResult);

    // Кламп по world.bounds, а не по старой константе 75 (M3-A-14).
    const margin = CAR_RADIUS + 1.5;
    car.x = clamp(carBody.x, world.bounds.minX + margin, world.bounds.maxX - margin);
    car.z = clamp(carBody.z, world.bounds.minZ + margin, world.bounds.maxZ - margin);
    car.vx = carBody.vx;
    car.vz = carBody.vz;

    speedKmh = Math.hypot(car.vx, car.vz) * 3.6;
  }

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
        transform.x = spec.center + sinPhase * spec.amplitude;
        transform.z = spec.lane + cosPhase * MOVER_WEAVE;
        transform.vx = cosPhase * spec.amplitude * spec.omega;
        transform.vz = -sinPhase * MOVER_WEAVE * spec.omega;
      } else {
        transform.z = spec.center + sinPhase * spec.amplitude;
        transform.x = spec.lane + cosPhase * MOVER_WEAVE;
        transform.vz = cosPhase * spec.amplitude * spec.omega;
        transform.vx = -sinPhase * MOVER_WEAVE * spec.omega;
      }
      transform.heading = Math.atan2(transform.vx, transform.vz);

      moverBody.x = transform.x;
      moverBody.z = transform.z;
      moverBody.angle = transform.heading;
      if (resolveRectBody(moverBody, colliderHash, collisionCandidates, contact, TUNING, true)) {
        transform.x = moverBody.x;
        transform.z = moverBody.z;
      }
      registry.updateCollider(spec.id);
    }
  }

  function syncStressMovers(alpha: number): void {
    if (!stressMesh) return;
    const mesh = stressMesh;
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
  const prefetchMs = world.prefetch(car.x, car.z);
  cityView.sync(world);

  if (debugWorld) {
    // layoutHash считается один раз и доступен и в HUD, и в window.__tmc.
    const layoutHash = world.layoutHash;
    frameStats.layoutHash = layoutHash;
    window.__tmc = {
      seed,
      layoutHash,
      exportRoadGraph: () => serializeRoadGraph(world.roadGraph),
      stats: () => {
        const stats = world.stats;
        return {
          seed,
          layoutHash,
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
        };
      },
      teleport: (x, z) => {
        const margin = CAR_RADIUS + 1.5;
        car.x = clamp(x, world.bounds.minX + margin, world.bounds.maxX - margin);
        car.z = clamp(z, world.bounds.minZ + margin, world.bounds.maxZ - margin);
        car.vx = 0;
        car.vz = 0;
        car.prevX = car.x;
        car.prevZ = car.z;
        followCamera.snapTo(car.x, car.z);
        world.prefetch(car.x, car.z);
      },
      carState: () => ({
        x: Number(car.x.toFixed(2)),
        z: Number(car.z.toFixed(2)),
        heading: Number(car.heading.toFixed(3)),
        speedKmh: Number(speedKmh.toFixed(1)),
      }),
    };
  }

  // --- фикс. шаг ------------------------------------------------------------
  let logicMsSum = 0;
  let logicSamples = 0;
  let streamTimer = 0;

  function step(dt: number): void {
    const started = performance.now();
    updateCar(dt);
    updateStressMovers(dt);
    registry.flush();

    streamTimer += dt;
    if (streamTimer >= STREAM_INTERVAL) {
      streamTimer = 0;
      world.update(car.x, car.z);
    }

    logicMsSum += performance.now() - started;
    logicSamples += 1;
  }

  // --- рендер кадра --------------------------------------------------------
  function renderFrame(alpha: number, frameDt: number): void {
    const x = lerp(car.prevX, car.x, alpha);
    const z = lerp(car.prevZ, car.z, alpha);
    const heading = lerpAngle(car.prevHeading, car.heading, alpha);

    carGroup.position.set(x, 0, z);
    carGroup.rotation.y = heading;

    syncStressMovers(alpha);
    cityView.sync(world);

    followCamera.update(frameDt, x, z, car.vx, car.vz);
    applyCamera();

    sun.position.set(x + 55, 105, z + 40);
    sun.target.position.set(x, 0, z);
    sun.target.updateMatrixWorld();

    renderer.render(scene, camera);

    const info = renderer.info.render;
    const worldStats = world.stats;
    frameStats.drawCalls = info.calls;
    frameStats.triangles = info.triangles;
    frameStats.speedKmh = speedKmh;
    frameStats.colliders = colliderHash.size;
    frameStats.movingColliders = registry.dynamicColliders;
    frameStats.entities = registry.total;
    frameStats.overrun = loop.overrun;
    frameStats.debtMs = loop.debt * 1000;
    frameStats.logicMs = logicSamples > 0 ? logicMsSum / logicSamples : 0;
    frameStats.chunks = world.activeChunks.length;
    frameStats.chunkGenMaxMs = worldStats.genMaxMs;
    frameStats.chunkGenLastMs = worldStats.genLastMs;
    frameStats.worldUpdateMs = worldStats.updateMs;
    logicMsSum = 0;
    logicSamples = 0;

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

  loop.start();
  if (document.hidden) setPaused(true);
}
