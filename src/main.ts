import * as THREE from 'three';
import './style.css';

// ---------------------------------------------------------------------------
// TakeMyCar — pre-alpha каркас (M0.5)
// Серый город, одна машина, аркадная физика. Заменяется системами из M1–M4.
// ---------------------------------------------------------------------------

const STEP = 1 / 60;
const BLOCK_STEP = 32; // расстояние между центрами кварталов
const BLOCK_HALF = 11; // половина плиты квартала
const GRID = 2; // кварталы от -2 до 2
const BOUND = GRID * BLOCK_STEP + BLOCK_HALF;

type Rect = { x: number; z: number; hx: number; hz: number };

const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20261123);

// --- сцена -----------------------------------------------------------------
const container = document.getElementById('game');
if (!container) throw new Error('Не найден контейнер #game');

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x10141a);
scene.fog = new THREE.Fog(0x10141a, 140, 300);

const VIEW_HEIGHT = 62;
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(
  (-VIEW_HEIGHT * aspect) / 2,
  (VIEW_HEIGHT * aspect) / 2,
  VIEW_HEIGHT / 2,
  -VIEW_HEIGHT / 2,
  0.1,
  500,
);
camera.position.set(0, 72, 40);
camera.lookAt(0, 0, 0);

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

// --- город -----------------------------------------------------------------
const colliders: Rect[] = [];

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(520, 520),
  new THREE.MeshLambertMaterial({ color: 0x2c323a }),
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const plateGeo = new THREE.BoxGeometry(1, 1, 1);
const plateMat = new THREE.MeshLambertMaterial({ color: 0x4a525d });
const plateMesh = new THREE.InstancedMesh(plateGeo, plateMat, 25);
plateMesh.receiveShadow = true;
scene.add(plateMesh);

type Building = { x: number; z: number; w: number; d: number; h: number; color: number };
const buildings: Building[] = [];

let plateIndex = 0;
const dummy = new THREE.Object3D();

for (let ix = -GRID; ix <= GRID; ix += 1) {
  for (let iz = -GRID; iz <= GRID; iz += 1) {
    const cx = ix * BLOCK_STEP;
    const cz = iz * BLOCK_STEP;
    dummy.position.set(cx, 0.25, cz);
    dummy.scale.set(BLOCK_HALF * 2, 0.5, BLOCK_HALF * 2);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    plateMesh.setMatrixAt(plateIndex++, dummy.matrix);

    if (ix === 0 && iz === 0) continue; // центральная площадь

    const w = 8 + rand() * 4;
    const d = 8 + rand() * 4;
    const h = 6 + rand() * 18;
    const bx = cx + (rand() * 2 - 1) * (BLOCK_HALF - w / 2 - 1);
    const bz = cz + (rand() * 2 - 1) * (BLOCK_HALF - d / 2 - 1);
    const palette = [0x8b93a1, 0x9c8f80, 0x7d8e9f, 0xa39887, 0x6f7b88];
    buildings.push({ x: bx, z: bz, w, d, h, color: palette[Math.floor(rand() * palette.length)] ?? 0x8b93a1 });
    colliders.push({ x: bx, z: bz, hx: w / 2, hz: d / 2 });
  }
}
plateMesh.count = plateIndex;
plateMesh.instanceMatrix.needsUpdate = true;

const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
const buildingMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
const buildingMesh = new THREE.InstancedMesh(buildingGeo, buildingMat, buildings.length);
buildingMesh.castShadow = true;
buildingMesh.receiveShadow = true;
const tint = new THREE.Color();

buildings.forEach((b, i) => {
  dummy.position.set(b.x, b.h / 2 + 0.5, b.z);
  dummy.scale.set(b.w, b.h, b.d);
  dummy.rotation.set(0, 0, 0);
  dummy.updateMatrix();
  buildingMesh.setMatrixAt(i, dummy.matrix);
  buildingMesh.setColorAt(i, tint.setHex(b.color));
});
buildingMesh.instanceMatrix.needsUpdate = true;
if (buildingMesh.instanceColor) buildingMesh.instanceColor.needsUpdate = true;
scene.add(buildingMesh);

// Разметка: пунктир по центрам дорог.
const dashPositions: Array<{ x: number; z: number; rot: number }> = [];
for (let ix = -GRID; ix <= GRID; ix += 1) {
  const x = ix * BLOCK_STEP + BLOCK_STEP / 2;
  if (Math.abs(x) > BOUND) continue;
  for (let z = -BOUND + 4; z < BOUND; z += 6) dashPositions.push({ x, z, rot: 0 });
}
for (let iz = -GRID; iz <= GRID; iz += 1) {
  const z = iz * BLOCK_STEP + BLOCK_STEP / 2;
  if (Math.abs(z) > BOUND) continue;
  for (let x = -BOUND + 4; x < BOUND; x += 6) dashPositions.push({ x, z, rot: Math.PI / 2 });
}
const dashGeo = new THREE.BoxGeometry(0.28, 0.03, 2.4);
const dashMat = new THREE.MeshBasicMaterial({ color: 0xcfd8e3 });
const dashMesh = new THREE.InstancedMesh(dashGeo, dashMat, dashPositions.length);
dashPositions.forEach((p, i) => {
  dummy.position.set(p.x, 0.03, p.z);
  dummy.scale.set(1, 1, 1);
  dummy.rotation.set(0, p.rot, 0);
  dummy.updateMatrix();
  dashMesh.setMatrixAt(i, dummy.matrix);
});
dashMesh.instanceMatrix.needsUpdate = true;
scene.add(dashMesh);

// --- машина ----------------------------------------------------------------
const carGroup = new THREE.Group();
const bodyMat = new THREE.MeshLambertMaterial({ color: 0xff5c5c });
const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.7, 4.4), bodyMat);
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
for (const [wx, wz] of [
  [-1.05, 1.45],
  [1.05, 1.45],
  [-1.05, -1.45],
  [1.05, -1.45],
] as const) {
  const wheel = new THREE.Mesh(wheelGeo, wheelMat);
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(wx, 0.42, wz);
  wheel.castShadow = true;
  carGroup.add(wheel);
}
scene.add(carGroup);

const car = { x: 16, z: 2, heading: 0, vx: 0, vz: 0 };
carGroup.position.set(car.x, 0, car.z);

const tuning = {
  accel: 22,
  brake: 34,
  maxSpeed: 30,
  maxReverse: 9,
  steerRate: 2.6,
  grip: 6.5,
  handbrakeGrip: 0.8,
};

// --- ввод ------------------------------------------------------------------
const keys = new Set<string>();
window.addEventListener('keydown', (event) => {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
    event.preventDefault();
  }
  if (event.code === 'KeyR') resetCar();
  keys.add(event.code);
});
window.addEventListener('keyup', (event) => keys.delete(event.code));
window.addEventListener('blur', () => keys.clear());

function resetCar(): void {
  car.x = 16;
  car.z = 2;
  car.heading = 0;
  car.vx = 0;
  car.vz = 0;
}

// --- физика ----------------------------------------------------------------
function resolveCircleRect(px: number, pz: number, radius: number, rect: Rect): { x: number; z: number } | null {
  const dx = px - rect.x;
  const dz = pz - rect.z;
  const cx = clamp(dx, -rect.hx, rect.hx);
  const cz = clamp(dz, -rect.hz, rect.hz);
  const ox = dx - cx;
  const oz = dz - cz;
  const dist2 = ox * ox + oz * oz;

  if (dist2 > radius * radius) return null;

  if (dist2 > 1e-6) {
    const dist = Math.sqrt(dist2);
    const push = radius - dist;
    return { x: px + (ox / dist) * push, z: pz + (oz / dist) * push };
  }

  // Центр внутри прямоугольника: выталкиваем по минимальному проникновению.
  const penX = rect.hx + radius - Math.abs(dx);
  const penZ = rect.hz + radius - Math.abs(dz);
  if (penX < penZ) return { x: rect.x + Math.sign(dx || 1) * (rect.hx + radius), z: pz };
  return { x: px, z: rect.z + Math.sign(dz || 1) * (rect.hz + radius) };
}

let speedKmh = 0;

function updateCar(dt: number): void {
  const throttle = keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0;
  const braking = keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0;
  const steerInput =
    (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0) - (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0);
  const handbrake = keys.has('Space');

  const sin = Math.sin(car.heading);
  const cos = Math.cos(car.heading);

  let forward = car.vx * sin + car.vz * cos;
  let lateral = car.vx * cos - car.vz * sin;

  if (throttle) forward += tuning.accel * dt;
  if (braking) {
    if (forward > 0.5) forward -= tuning.brake * dt;
    else forward -= tuning.accel * 0.65 * dt;
  }

  forward -= forward * 0.55 * dt; // сопротивление
  forward -= Math.sign(forward) * Math.min(Math.abs(forward), 2.2 * dt); // качение
  forward = clamp(forward, -tuning.maxReverse, tuning.maxSpeed);

  const steerFactor = Math.min(1, Math.abs(forward) / 6);
  car.heading += steerInput * tuning.steerRate * dt * steerFactor * (forward < 0 ? -1 : 1);

  lateral *= Math.exp(-(handbrake ? tuning.handbrakeGrip : tuning.grip) * dt);

  car.vx = sin * forward + cos * lateral;
  car.vz = cos * forward - sin * lateral;

  const nextX = car.x + car.vx * dt;
  const nextZ = car.z + car.vz * dt;

  let resolvedX = nextX;
  let resolvedZ = nextZ;
  let hit = false;
  for (const rect of colliders) {
    const resolved = resolveCircleRect(resolvedX, resolvedZ, 1.8, rect);
    if (resolved) {
      resolvedX = resolved.x;
      resolvedZ = resolved.z;
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
  carGroup.position.set(car.x, 0, car.z);
  carGroup.rotation.y = car.heading;
}

// --- камера и свет ---------------------------------------------------------
function updateCamera(dt: number): void {
  const damp = 1 - Math.exp(-6 * dt);
  camera.position.x += (car.x - camera.position.x) * damp;
  camera.position.z += (car.z + 40 - camera.position.z) * damp;
  camera.position.y = 72;
  camera.lookAt(car.x, 0, car.z);

  sun.position.set(car.x + 35, 80, car.z + 25);
  sun.target.position.set(car.x, 0, car.z);
  sun.target.updateMatrixWorld();
}

// --- цикл ------------------------------------------------------------------
const statsEl = document.getElementById('stats');
const loadingEl = document.getElementById('loading');
if (loadingEl) loadingEl.classList.add('hidden');

let lastTime = 0;
let accumulator = 0;
let paused = false;
let frames = 0;
let fpsTimer = 0;
let fps = 0;

document.addEventListener('visibilitychange', () => {
  paused = document.hidden;
});
window.addEventListener('blur', () => {
  paused = true;
});
window.addEventListener('focus', () => {
  paused = false;
});

function updateStats(dt: number): void {
  frames += 1;
  fpsTimer += dt;
  if (fpsTimer >= 0.5) {
    fps = Math.round(frames / fpsTimer);
    frames = 0;
    fpsTimer = 0;
    if (statsEl) {
      const info = renderer.info.render;
      statsEl.textContent =
        `fps ${fps}   speed ${speedKmh.toFixed(0)} km/h\n` +
        `draw calls ${info.calls}   tris ${(info.triangles / 1000).toFixed(1)}k`;
    }
  }
}

renderer.setAnimationLoop((time: number) => {
  if (paused) {
    lastTime = time;
    return;
  }

  const dt = lastTime === 0 ? 0 : Math.min((time - lastTime) / 1000, 0.1);
  lastTime = time;

  if (dt > 0) {
    accumulator += dt;
    let steps = 0;
    while (accumulator >= STEP && steps < 8) {
      updateCar(STEP);
      accumulator -= STEP;
      steps += 1;
    }
    updateCamera(dt);
    updateStats(dt);
  }

  renderer.render(scene, camera);
});

window.addEventListener('resize', () => {
  const nextAspect = window.innerWidth / window.innerHeight;
  camera.left = (-VIEW_HEIGHT * nextAspect) / 2;
  camera.right = (VIEW_HEIGHT * nextAspect) / 2;
  camera.top = VIEW_HEIGHT / 2;
  camera.bottom = -VIEW_HEIGHT / 2;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
});
