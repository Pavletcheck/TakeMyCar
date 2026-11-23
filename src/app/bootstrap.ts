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
import { SpatialHash } from '../core/spatialHash';
import { TUNING } from '../config/tuning';
import { createDebugStats, DebugOverlay } from './debug';

// ---------------------------------------------------------------------------
// M1/M2. Bootstrap: рендерер, сцена, город 5×5, машина и игровой цикл.
// Three.js живёт только в этом файле; core-модули о сцене не знают.
// M2: реестр сущностей, решатель с итерациями и стресс-режим 300+50.
// ---------------------------------------------------------------------------

const BLOCK_STEP = 32; // расстояние между центрами кварталов
const BLOCK_HALF = 11; // половина плиты квартала
const GRID = 2; // кварталы от -2 до 2
const BOUND = GRID * BLOCK_STEP + BLOCK_HALF;
const CITY_SEED = 20261123;
const STRESS_SEED = 0x5157e55;

const CAR_RADIUS = 1.8;
const CAR_SPAWN_X = 16;
const CAR_SPAWN_Z = 2;

const CAR_TUNING = {
  accel: 22,
  brake: 34,
  maxSpeed: 30,
  maxReverse: 9,
  steerRate: 2.6,
  grip: 6.5,
  handbrakeGrip: 0.8,
} as const;

const VIEW_HEIGHT = 62;
const CAMERA_HEIGHT = 72;
const CAMERA_BACK_OFFSET = 40;
const CAMERA_DAMP = 6;
const CAMERA_LOOK_AHEAD = 0.3;
const CAMERA_MAX_LOOK_AHEAD = 5;

// Стресс-режим: низкие кубы на дорогах, один InstancedMesh на все тела.
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

interface Building {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color: number;
}

/** Движущийся коллайдер стресс-режима: кинематика по синусу/кругу. */
interface MoverSpec {
  id: EntityId;
  /** Индекс инстанса в InstancedMesh. */
  handle: number;
  /** 0 — движение вдоль X, 1 — вдоль Z. */
  axis: 0 | 1;
  /** Фиксированная координата поперёк движения (дорога). */
  lane: number;
  center: number;
  amplitude: number;
  omega: number;
  phase: number;
}

export function bootstrap(): void {
  const container = document.getElementById('game');
  if (!container) throw new Error('Не найден контейнер #game');

  const events = new EventBus<GameEvents>();
  const input = new InputMap();
  attachKeyboard(input, window);
  const inputState = createInputState();
  const debug = new DebugOverlay(document.getElementById('stats'));
  const frameStats = createDebugStats();
  const stressEnabled = new URLSearchParams(window.location.search).get('stress') === '1';

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
  scene.fog = new THREE.Fog(0x10141a, 140, 300);

  const hemi = new THREE.HemisphereLight(0xcfe0ff, 0x3a2f24, 1.75);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff0d4, 2.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -45;
  sun.shadow.camera.right = 45;
  sun.shadow.camera.top = 45;
  sun.shadow.camera.bottom = -45;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 220;
  sun.shadow.bias = -0.0006;
  scene.add(sun);
  scene.add(sun.target);

  // --- коллизии и сущности --------------------------------------------------
  const colliderHash = new SpatialHash<Collider>(TUNING.spatialCellSize);
  const registry = new EntityRegistry(colliderHash);
  const collisionCandidates: Collider[] = [];
  const contact: Contact = { nx: 0, nz: 0, depth: 0 };
  let nextColliderId = 1;

  function addStaticCollider(x: number, z: number, hx: number, hz: number): void {
    colliderHash.insert({ id: nextColliderId, x, z, hx, hz, angle: 0 });
    nextColliderId += 1;
  }

  // --- город ---------------------------------------------------------------
  const rng = createRng(CITY_SEED);
  const dummy = new THREE.Object3D();

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(520, 520),
    new THREE.MeshLambertMaterial({ color: 0x2c323a }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const plateGeo = new THREE.BoxGeometry(1, 1, 1);
  const plateMat = new THREE.MeshLambertMaterial({ color: 0x4a525d });
  const plateMesh = new THREE.InstancedMesh(plateGeo, plateMat, (GRID * 2 + 1) ** 2);
  plateMesh.receiveShadow = true;
  scene.add(plateMesh);

  const palette = [0x8b93a1, 0x9c8f80, 0x7d8e9f, 0xa39887, 0x6f7b88];
  const buildings: Building[] = [];
  let plateIndex = 0;

  for (let ix = -GRID; ix <= GRID; ix += 1) {
    for (let iz = -GRID; iz <= GRID; iz += 1) {
      const cx = ix * BLOCK_STEP;
      const cz = iz * BLOCK_STEP;
      dummy.position.set(cx, 0.25, cz);
      dummy.scale.set(BLOCK_HALF * 2, 0.5, BLOCK_HALF * 2);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      plateMesh.setMatrixAt(plateIndex, dummy.matrix);
      plateIndex += 1;

      if (ix === 0 && iz === 0) continue; // центральная площадь

      const w = 8 + rng.next() * 4;
      const d = 8 + rng.next() * 4;
      const h = 6 + rng.next() * 18;
      const bx = cx + (rng.next() * 2 - 1) * (BLOCK_HALF - w / 2 - 1);
      const bz = cz + (rng.next() * 2 - 1) * (BLOCK_HALF - d / 2 - 1);
      const color = palette[Math.floor(rng.next() * palette.length)];
      buildings.push({ x: bx, z: bz, w, d, h, color });
      addStaticCollider(bx, bz, w / 2, d / 2);
    }
  }
  plateMesh.count = plateIndex;
  plateMesh.instanceMatrix.needsUpdate = true;

  const buildingMesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
    buildings.length,
  );
  buildingMesh.castShadow = true;
  buildingMesh.receiveShadow = true;
  const tint = new THREE.Color();

  for (let i = 0; i < buildings.length; i += 1) {
    const building = buildings[i];
    dummy.position.set(building.x, building.h / 2 + 0.5, building.z);
    dummy.scale.set(building.w, building.h, building.d);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    buildingMesh.setMatrixAt(i, dummy.matrix);
    buildingMesh.setColorAt(i, tint.setHex(building.color));
  }
  buildingMesh.instanceMatrix.needsUpdate = true;
  if (buildingMesh.instanceColor) buildingMesh.instanceColor.needsUpdate = true;
  scene.add(buildingMesh);

  // Разметка: пунктир по центрам дорог.
  const dashes: Array<{ x: number; z: number; rot: number }> = [];
  for (let ix = -GRID; ix <= GRID; ix += 1) {
    const x = ix * BLOCK_STEP + BLOCK_STEP / 2;
    if (Math.abs(x) > BOUND) continue;
    for (let z = -BOUND + 4; z < BOUND; z += 6) dashes.push({ x, z, rot: 0 });
  }
  for (let iz = -GRID; iz <= GRID; iz += 1) {
    const z = iz * BLOCK_STEP + BLOCK_STEP / 2;
    if (Math.abs(z) > BOUND) continue;
    for (let x = -BOUND + 4; x < BOUND; x += 6) dashes.push({ x, z, rot: Math.PI / 2 });
  }
  const dashMesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.28, 0.03, 2.4),
    new THREE.MeshBasicMaterial({ color: 0xcfd8e3 }),
    dashes.length,
  );
  for (let i = 0; i < dashes.length; i += 1) {
    const dash = dashes[i];
    dummy.position.set(dash.x, 0.03, dash.z);
    dummy.scale.set(1, 1, 1);
    dummy.rotation.set(0, dash.rot, 0);
    dummy.updateMatrix();
    dashMesh.setMatrixAt(i, dummy.matrix);
  }
  dashMesh.instanceMatrix.needsUpdate = true;
  scene.add(dashMesh);

  // --- игрок ----------------------------------------------------------------
  const player = registry.create('player');
  const car = player.transform;
  car.x = CAR_SPAWN_X;
  car.z = CAR_SPAWN_Z;
  car.prevX = CAR_SPAWN_X;
  car.prevZ = CAR_SPAWN_Z;

  // --- стресс-режим ?stress=1 ----------------------------------------------
  let stressMesh: THREE.InstancedMesh | null = null;
  const movers: MoverSpec[] = [];
  let stressTime = 0;

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
      const x = stressRng.range(-BOUND, BOUND);
      const z = stressRng.range(-BOUND, BOUND);
      // Не застраиваем точку спавна машины.
      if (Math.abs(x - CAR_SPAWN_X) < 6 && Math.abs(z - CAR_SPAWN_Z) < 6) continue;
      const hx = stressRng.range(STRESS_STATIC_HALF_MIN, STRESS_STATIC_HALF_MAX);
      const hz = stressRng.range(STRESS_STATIC_HALF_MIN, STRESS_STATIC_HALF_MAX);
      addStaticCollider(x, z, hx, hz);

      dummy.position.set(x, STRESS_STATIC_HEIGHT / 2, z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(hx * 2, STRESS_STATIC_HEIGHT, hz * 2);
      dummy.updateMatrix();
      mesh.setMatrixAt(placed, dummy.matrix);
      mesh.setColorAt(placed, color.setHex(STRESS_STATIC_COLOR));
      placed += 1;
    }

    const half = Math.floor(movingCount / 2);
    for (let i = 0; i < movingCount; i += 1) {
      const axis: 0 | 1 = i < half ? 0 : 1;
      const laneSign = i % 2 === 0 ? 1 : -1;
      const centerSign = Math.floor(i / 2) % 2 === 0 ? 1 : -1;
      const handle = placed + i;
      const phase = i * 2.399963229728653; // золотое сечение — без скоплений
      const omega = 0.5 + (i % 5) * 0.08;
      const entity = registry.create('prop');
      const transform = entity.transform;
      transform.x = axis === 0 ? centerSign * MOVER_CENTER + Math.sin(phase) * MOVER_AMPLITUDE : laneSign * MOVER_LANE + Math.cos(phase) * MOVER_WEAVE;
      transform.z = axis === 0 ? laneSign * MOVER_LANE + Math.cos(phase) * MOVER_WEAVE : centerSign * MOVER_CENTER + Math.sin(phase) * MOVER_AMPLITUDE;
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
    dummy.position.set(x, MOVER_HEIGHT / 2, z);
    dummy.rotation.set(0, heading, 0);
    dummy.scale.set(MOVER_HALF * 2, MOVER_HEIGHT, MOVER_HALF * 2);
    dummy.updateMatrix();
    mesh.setMatrixAt(handle, dummy.matrix);
  }

  // --- машина --------------------------------------------------------------
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
  scene.add(carGroup);

  // --- камера --------------------------------------------------------------
  const followCamera = new FollowCamera({
    viewHeight: VIEW_HEIGHT,
    height: CAMERA_HEIGHT,
    backOffset: CAMERA_BACK_OFFSET,
    damp: CAMERA_DAMP,
    lookAhead: CAMERA_LOOK_AHEAD,
    maxLookAhead: CAMERA_MAX_LOOK_AHEAD,
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
    camera.position.set(followCamera.position.x, followCamera.position.y, followCamera.position.z);
    camera.lookAt(followCamera.target.x, followCamera.target.y, followCamera.target.z);
  }

  // --- физика машины -------------------------------------------------------
  let speedKmh = 0;
  const carBody: CircleBody = { x: car.x, z: car.z, vx: 0, vz: 0, radius: CAR_RADIUS };
  const solveResult: SolveResult = { hit: false, contacts: 0, impact: 0, substeps: 0 };
  const moverBody: Rect = { x: 0, z: 0, hx: MOVER_HALF, hz: MOVER_HALF, angle: 0 };

  function resetCar(): void {
    car.x = CAR_SPAWN_X;
    car.z = CAR_SPAWN_Z;
    car.heading = 0;
    car.vx = 0;
    car.vz = 0;
    car.prevX = car.x;
    car.prevZ = car.z;
    car.prevHeading = 0;
    speedKmh = 0;
    followCamera.snapTo(car.x, car.z);
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

    forward -= forward * 0.55 * dt; // сопротивление
    forward -= Math.sign(forward) * Math.min(Math.abs(forward), 2.2 * dt); // качение
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

    car.x = clamp(carBody.x, -BOUND, BOUND);
    car.z = clamp(carBody.z, -BOUND, BOUND);
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

  // --- фикс. шаг ------------------------------------------------------------
  let logicMsSum = 0;
  let logicSamples = 0;

  function step(dt: number): void {
    const started = performance.now();
    updateCar(dt);
    updateStressMovers(dt);
    registry.flush();
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

    followCamera.update(frameDt, x, z, car.vx, car.vz);
    applyCamera();

    sun.position.set(x + 35, 80, z + 25);
    sun.target.position.set(x, 0, z);
    sun.target.updateMatrixWorld();

    renderer.render(scene, camera);

    const info = renderer.info.render;
    frameStats.drawCalls = info.calls;
    frameStats.triangles = info.triangles;
    frameStats.speedKmh = speedKmh;
    frameStats.colliders = colliderHash.size;
    frameStats.movingColliders = registry.dynamicColliders;
    frameStats.entities = registry.total;
    frameStats.overrun = loop.overrun;
    frameStats.debtMs = loop.debt * 1000;
    frameStats.logicMs = logicSamples > 0 ? logicMsSum / logicSamples : 0;
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
