import * as THREE from 'three';
import { FollowCamera } from '../core/camera';
import { EventBus } from '../core/events';
import { attachKeyboard, createInputState, InputMap } from '../core/input';
import { GameLoop } from '../core/loop';
import { circleRect, clamp, lerp, lerpAngle } from '../core/math';
import type { Collider, Contact } from '../core/math';
import { createRng } from '../core/rng';
import { SpatialHash } from '../core/spatialHash';
import { DebugOverlay } from './debug';

// ---------------------------------------------------------------------------
// M1. Bootstrap: рендерер, сцена, город 5×5, машина и игровой цикл.
// Three.js живёт только в этом файле; core-модули о сцене не знают.
// ---------------------------------------------------------------------------

const FIXED_STEP = 1 / 60;
const MAX_STEPS = 8;
const MAX_FRAME_DELTA = 0.1;

const BLOCK_STEP = 32; // расстояние между центрами кварталов
const BLOCK_HALF = 11; // половина плиты квартала
const GRID = 2; // кварталы от -2 до 2
const BOUND = GRID * BLOCK_STEP + BLOCK_HALF;
const CITY_SEED = 20261123;
const STRESS_COLLIDERS = 300;
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

interface CarState {
  x: number;
  z: number;
  heading: number;
  vx: number;
  vz: number;
  prevX: number;
  prevZ: number;
  prevHeading: number;
}

export function bootstrap(): void {
  const container = document.getElementById('game');
  if (!container) throw new Error('Не найден контейнер #game');

  const events = new EventBus<GameEvents>();
  const input = new InputMap();
  attachKeyboard(input, window);
  const inputState = createInputState();
  const debug = new DebugOverlay(document.getElementById('stats'));

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

  // --- город ---------------------------------------------------------------
  const rng = createRng(CITY_SEED);
  const colliderHash = new SpatialHash<Collider>(8);
  const collisionCandidates: Collider[] = [];
  const contact: Contact = { nx: 0, nz: 0, depth: 0 };
  let nextColliderId = 1;

  function addStaticCollider(x: number, z: number, hx: number, hz: number): void {
    colliderHash.insert({ id: nextColliderId, x, z, hx, hz, angle: 0 });
    nextColliderId += 1;
  }

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
  const dummy = new THREE.Object3D();
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

  // Отладочный режим: невидимые статические коллайдеры для проверки бюджета.
  if (new URLSearchParams(window.location.search).get('stress') === '1') {
    spawnStressColliders();
  }

  function spawnStressColliders(): void {
    const stressRng = createRng(STRESS_SEED);
    let placed = 0;
    let attempts = 0;
    while (placed < STRESS_COLLIDERS && attempts < STRESS_COLLIDERS * 10) {
      attempts += 1;
      const x = stressRng.range(-BOUND, BOUND);
      const z = stressRng.range(-BOUND, BOUND);
      // Не застраиваем точку спавна машины.
      if (Math.abs(x - CAR_SPAWN_X) < 6 && Math.abs(z - CAR_SPAWN_Z) < 6) continue;
      addStaticCollider(x, z, stressRng.range(0.4, 1.2), stressRng.range(0.4, 1.2));
      placed += 1;
    }
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
  scene.add(carGroup);

  const car: CarState = {
    x: CAR_SPAWN_X,
    z: CAR_SPAWN_Z,
    heading: 0,
    vx: 0,
    vz: 0,
    prevX: CAR_SPAWN_X,
    prevZ: CAR_SPAWN_Z,
    prevHeading: 0,
  };
  carGroup.position.set(car.x, 0, car.z);

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

  function resetCar(): void {
    car.x = CAR_SPAWN_X;
    car.z = CAR_SPAWN_Z;
    car.heading = 0;
    car.vx = 0;
    car.vz = 0;
    car.prevX = car.x;
    car.prevZ = car.z;
    car.prevHeading = 0;
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

    const nextX = car.x + car.vx * dt;
    const nextZ = car.z + car.vz * dt;

    // Широкая фаза: только коллайдеры рядом с машиной, без перебора всех.
    const moveX = nextX - car.x;
    const moveZ = nextZ - car.z;
    const queryRadius = CAR_RADIUS + Math.sqrt(moveX * moveX + moveZ * moveZ) + 0.25;
    colliderHash.queryCircle(nextX, nextZ, queryRadius, collisionCandidates);

    let resolvedX = nextX;
    let resolvedZ = nextZ;
    let hit = false;
    for (let i = 0; i < collisionCandidates.length; i += 1) {
      if (circleRect(resolvedX, resolvedZ, CAR_RADIUS, collisionCandidates[i], contact)) {
        resolvedX += contact.nx * contact.depth;
        resolvedZ += contact.nz * contact.depth;
        hit = true;
      }
    }

    car.x = clamp(resolvedX, -BOUND, BOUND);
    car.z = clamp(resolvedZ, -BOUND, BOUND);
    if (hit) {
      car.vx *= 0.25;
      car.vz *= 0.25;
    }

    speedKmh = Math.abs(forward) * 3.6;
  }

  // --- рендер кадра --------------------------------------------------------
  function renderFrame(alpha: number, frameDt: number): void {
    const x = lerp(car.prevX, car.x, alpha);
    const z = lerp(car.prevZ, car.z, alpha);
    const heading = lerpAngle(car.prevHeading, car.heading, alpha);

    carGroup.position.set(x, 0, z);
    carGroup.rotation.y = heading;

    followCamera.update(frameDt, x, z, car.vx, car.vz);
    applyCamera();

    sun.position.set(x + 35, 80, z + 25);
    sun.target.position.set(x, 0, z);
    sun.target.updateMatrixWorld();

    renderer.render(scene, camera);

    const info = renderer.info.render;
    debug.update(frameDt, info.calls, info.triangles, speedKmh, colliderHash.size);
  }

  // --- цикл, пауза, resize -------------------------------------------------
  const loop = new GameLoop(updateCar, renderFrame, {
    fixedStep: FIXED_STEP,
    maxSteps: MAX_STEPS,
    maxFrameDelta: MAX_FRAME_DELTA,
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
