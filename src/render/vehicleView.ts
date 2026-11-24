// ---------------------------------------------------------------------------
// M7. Визуал машин: low-poly GLB по типу + LOD1 по дистанции, fallback на
// примитивы M4 (если GLB не загрузился или включён `?models=0`).
//
// Модель = два узла GLB: `paint` (белый, красится инстансом через instanceColor)
// и `trim` (шины, стёкла, фары — запечённые цвета). На тип — 2 LOD, ёмкость
// каждого InstancedMesh = maxVehicles, поэтому draw calls не зависят от трафика.
//
// Дым и следы шин остались прежними: кольцевые пулы, без аллокаций в кадре.
// Флаг `?models=1` не нужен: модели включаются сами, когда готовы.
// ---------------------------------------------------------------------------

import * as THREE from 'three';
import type { VehicleState } from '../entities/vehicle';
import { VEHICLE_TYPES } from '../config/vehicles';
import type { VehicleTypeId } from '../config/vehicles';
import {
  CAR_MODEL_URLS,
  createFlatMaterial,
  createPartInstances,
  loadModelParts,
  modelsDisabled,
  releaseModels,
  retainModels,
} from './modelLibrary';
import type { ModelParts } from './modelLibrary';
import { focusDistanceSq } from './viewFocus';

const DEFAULT_MAX_VEHICLES = 96;
const DEFAULT_MAX_SMOKE = 512;
const DEFAULT_MAX_SKID = 600;

const CABIN_COLOR = 0x1a2230;
const SKID_Y = 0.07;
/** Дальше этого расстояния от игрока машина рисуется LOD1 (≤40 % tris). */
const CAR_LOD_DISTANCE = 42;
const CAR_LOD_DISTANCE_SQ = CAR_LOD_DISTANCE * CAR_LOD_DISTANCE;

export interface VehicleView {
  /** Синхронизировать инстансы с флотом. dt — реальное время кадра. */
  sync(vehicles: readonly VehicleState[], alpha: number, dt: number): void;
  /** Вспышка/облако при взрыве (без крови). */
  burst(x: number, z: number, power: number): void;
  readonly stats: VehicleViewStats;
  dispose(): void;
}

export interface VehicleViewStats {
  vehicles: number;
  smoke: number;
  skid: number;
  drawCalls: number;
  /** Сколько машин нарисовано моделями (остальные — примитивами). */
  models: number;
  /** Сколько машин на LOD1. */
  lod1: number;
}

export interface VehicleViewOptions {
  maxVehicles?: number;
  maxSmoke?: number;
  maxSkid?: number;
}

/** Один уровень детализации машины: два InstancedMesh и их пивоты. */
interface CarBatch {
  readonly paint: THREE.InstancedMesh | null;
  readonly trim: THREE.InstancedMesh | null;
  readonly paintMatrix: THREE.Matrix4;
  readonly trimMatrix: THREE.Matrix4;
  count: number;
}

interface CarRig {
  readonly lod0: CarBatch;
  readonly lod1: CarBatch;
}

export function createVehicleView(scene: THREE.Scene, options: VehicleViewOptions = {}): VehicleView {
  const maxVehicles = options.maxVehicles ?? DEFAULT_MAX_VEHICLES;
  const maxSmoke = options.maxSmoke ?? DEFAULT_MAX_SMOKE;
  const maxSkid = options.maxSkid ?? DEFAULT_MAX_SKID;

  const root = new THREE.Group();
  root.name = 'vehicles';
  scene.add(root);

  const modelGroup = new THREE.Group();
  modelGroup.name = 'vehicle-models';
  root.add(modelGroup);

  // --- примитивы-заглушки (M4) ---------------------------------------------
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 10);
  wheelGeometry.rotateZ(Math.PI / 2);

  const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const cabinMaterial = new THREE.MeshLambertMaterial({ color: CABIN_COLOR });
  const cargoMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const accentMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x11151b });

  const bodyMesh = new THREE.InstancedMesh(boxGeometry, bodyMaterial, maxVehicles);
  const cabinMesh = new THREE.InstancedMesh(boxGeometry, cabinMaterial, maxVehicles);
  const cargoMesh = new THREE.InstancedMesh(boxGeometry, cargoMaterial, maxVehicles);
  const accentMesh = new THREE.InstancedMesh(boxGeometry, accentMaterial, maxVehicles);
  const wheelMesh = new THREE.InstancedMesh(wheelGeometry, wheelMaterial, maxVehicles * 4);

  bodyMesh.castShadow = true;
  cabinMesh.castShadow = true;
  cargoMesh.castShadow = true;
  accentMesh.castShadow = false;
  wheelMesh.castShadow = true;
  for (const mesh of [bodyMesh, cabinMesh, cargoMesh, accentMesh, wheelMesh]) {
    mesh.frustumCulled = false;
    root.add(mesh);
  }

  // --- GLB: одна геометрия на тип, LOD0/LOD1 ---------------------------------
  const modelMaterial = createFlatMaterial();
  const rigs = new Map<VehicleTypeId, CarRig>();
  let disposed = false;

  retainModels();

  const createBatch = (parts: ModelParts, castShadow: boolean): CarBatch | null => {
    const paint = parts.get('paint');
    const trim = parts.get('trim');
    if (!paint || !trim) return null;
    const paintMesh = createPartInstances(paint, modelMaterial, maxVehicles);
    const trimMesh = createPartInstances(trim, modelMaterial, maxVehicles);
    paintMesh.castShadow = castShadow;
    trimMesh.castShadow = castShadow;
    modelGroup.add(paintMesh, trimMesh);
    return {
      paint: paintMesh,
      trim: trimMesh,
      paintMatrix: paint.matrix,
      trimMatrix: trim.matrix,
      count: 0,
    };
  };

  const loadCarModels = async (): Promise<void> => {
    for (const type of VEHICLE_TYPES) {
      try {
        const urls = CAR_MODEL_URLS[type];
        const [lod0Parts, lod1Parts] = await Promise.all([
          loadModelParts(urls.lod0),
          loadModelParts(urls.lod1),
        ]);
        if (disposed) return;
        const lod0 = createBatch(lod0Parts, true);
        const lod1 = createBatch(lod1Parts, false);
        if (!lod0 || !lod1) {
          console.warn('[models] у машины нет узлов paint/trim:', type);
          continue;
        }
        rigs.set(type, { lod0, lod1 });
      } catch {
        // Fallback на примитивы: предупреждение уже выдал modelLibrary.
      }
    }
  };

  if (!modelsDisabled()) void loadCarModels();

  // --- дым: кольцевой пул, матрицы собираются только для живых частиц -------
  const smokeMesh = new THREE.InstancedMesh(
    boxGeometry,
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    }),
    maxSmoke,
  );
  smokeMesh.frustumCulled = false;
  root.add(smokeMesh);

  const smokeX = new Float32Array(maxSmoke);
  const smokeY = new Float32Array(maxSmoke);
  const smokeZ = new Float32Array(maxSmoke);
  const smokeVx = new Float32Array(maxSmoke);
  const smokeVy = new Float32Array(maxSmoke);
  const smokeVz = new Float32Array(maxSmoke);
  const smokeLife = new Float32Array(maxSmoke);
  const smokeMaxLife = new Float32Array(maxSmoke);
  const smokeSize = new Float32Array(maxSmoke);
  const smokeRed = new Float32Array(maxSmoke);
  const smokeGreen = new Float32Array(maxSmoke);
  const smokeBlue = new Float32Array(maxSmoke);
  let smokeHead = 0;

  // --- следы шин: кольцевой буфер готовых матриц ---------------------------
  const skidMesh = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({
      color: 0x0b0e12,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    }),
    maxSkid,
  );
  skidMesh.frustumCulled = false;
  root.add(skidMesh);
  let skidHead = 0;
  let skidAlive = 0;
  let skidDirty = false;

  const dummy = new THREE.Object3D();
  const partMatrix = new THREE.Matrix4();
  const color = new THREE.Color();
  const smokeTimer = new Float32Array(maxVehicles);
  const skidTimer = new Float32Array(maxVehicles);

  let rngState = 0x9e3779b9;
  const random = (): number => {
    rngState = (rngState * 1664525 + 1013904223) >>> 0;
    return rngState / 4294967296;
  };

  // --- дым ----------------------------------------------------------------
  const emitSmoke = (
    x: number,
    y: number,
    z: number,
    life: number,
    size: number,
    red: number,
    green: number,
    blue: number,
  ): void => {
    const index = smokeHead;
    smokeHead = (smokeHead + 1) % maxSmoke;
    smokeX[index] = x + (random() - 0.5) * 0.6;
    smokeY[index] = y;
    smokeZ[index] = z + (random() - 0.5) * 0.6;
    smokeVx[index] = (random() - 0.5) * 0.8;
    smokeVy[index] = 1.1 + random() * 1.2;
    smokeVz[index] = (random() - 0.5) * 0.8;
    smokeLife[index] = life;
    smokeMaxLife[index] = life;
    smokeSize[index] = size;
    smokeRed[index] = red;
    smokeGreen[index] = green;
    smokeBlue[index] = blue;
  };

  const burst = (x: number, z: number, power: number): void => {
    const count = 10 + Math.round(power * 10);
    for (let i = 0; i < count; i += 1) {
      const warm = i % 3 === 0;
      emitSmoke(
        x,
        0.8,
        z,
        0.9 + random() * 0.7,
        0.7 + random() * 0.5,
        warm ? 0.95 : 0.32,
        warm ? 0.5 : 0.34,
        warm ? 0.24 : 0.36,
      );
    }
  };

  // --- следы шин -----------------------------------------------------------
  const dropSkid = (x: number, z: number, heading: number): void => {
    dummy.position.set(x, SKID_Y, z);
    dummy.rotation.set(0, heading, 0);
    dummy.scale.set(0.3, 1, 1.05);
    dummy.updateMatrix();
    skidMesh.setMatrixAt(skidHead, dummy.matrix);
    skidHead = (skidHead + 1) % maxSkid;
    if (skidAlive < maxSkid) skidAlive += 1;
    skidDirty = true;
  };

  // --- синхронизация машин -------------------------------------------------
  const stats: VehicleViewStats = {
    vehicles: 0,
    smoke: 0,
    skid: 0,
    drawCalls: 0,
    models: 0,
    lod1: 0,
  };

  const sync = (vehicles: readonly VehicleState[], alpha: number, dt: number): void => {
    let bodyCount = 0;
    let cabinCount = 0;
    let cargoCount = 0;
    let accentCount = 0;
    let wheelCount = 0;
    let modelCount = 0;
    let lod1Count = 0;

    for (const rig of rigs.values()) {
      rig.lod0.count = 0;
      rig.lod1.count = 0;
    }

    for (let i = 0; i < vehicles.length; i += 1) {
      const state = vehicles[i];
      const transform = state.transform;
      const config = state.config;
      const x = transform.prevX + (transform.x - transform.prevX) * alpha;
      const z = transform.prevZ + (transform.z - transform.prevZ) * alpha;
      const heading =
        transform.prevHeading + normalizeAngle(transform.heading - transform.prevHeading) * alpha;

      const width = config.width;
      const length = config.length;
      const height = config.height;

      // --- GLB: пивот в центре, origin на земле; LOD по дистанции ----------
      const rig = rigs.get(state.type);
      if (rig) {
        const far = focusDistanceSq(x, z) > CAR_LOD_DISTANCE_SQ;
        const batch = far ? rig.lod1 : rig.lod0;
        const index = batch.count;
        if (index < maxVehicles) {
          dummy.position.set(x, 0, z);
          dummy.rotation.set(0, heading, 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          if (batch.paint) {
            partMatrix.multiplyMatrices(dummy.matrix, batch.paintMatrix);
            batch.paint.setMatrixAt(index, partMatrix);
            batch.paint.setColorAt(index, color.setHex(state.color));
          }
          if (batch.trim) {
            partMatrix.multiplyMatrices(dummy.matrix, batch.trimMatrix);
            batch.trim.setMatrixAt(index, partMatrix);
          }
          batch.count = index + 1;
          modelCount += 1;
          if (far) lod1Count += 1;
        }
        // Модель есть — примитивы для этой машины не нужны.
      } else {
        // --- fallback: примитивы M4 ----------------------------------------
        let bodyHeight = 0.62;
        let bodyY = 0.5;
        let cabinHeight = 0.52;
        let cabinWidth = width * 0.86;
        let cabinLength = length * 0.44;
        let cabinY = 1.05;
        let cabinZ = -0.1;
        let cargo = false;
        let cargoHeight = 0;
        let cargoLength = 0;
        let cargoY = 0;

        if (state.type === 'sports') {
          bodyHeight = 0.5;
          bodyY = 0.45;
          cabinHeight = 0.4;
          cabinWidth = width * 0.8;
          cabinLength = length * 0.38;
          cabinY = 0.88;
          cabinZ = -0.15;
        } else if (state.type === 'van') {
          bodyHeight = 1.15;
          bodyY = 0.78;
          cabinHeight = 0.5;
          cabinWidth = width * 0.94;
          cabinLength = length * 0.26;
          cabinY = 1.57;
          cabinZ = length * 0.24;
        } else if (state.type === 'truck') {
          bodyHeight = 0.72;
          bodyY = 0.58;
          cabinHeight = 0.95;
          cabinWidth = width * 0.92;
          cabinLength = length * 0.2;
          cabinY = 1.42;
          cabinZ = length * 0.36;
          cargo = true;
          cargoHeight = 1.55;
          cargoLength = length * 0.66;
          cargoY = 1.6;
        } else if (state.type === 'police') {
          bodyHeight = 0.64;
          bodyY = 0.52;
          cabinHeight = 0.5;
          cabinY = 1.06;
        }

        dummy.position.set(x, bodyY, z);
        dummy.rotation.set(0, heading, 0);
        dummy.scale.set(width, bodyHeight, length);
        dummy.updateMatrix();
        bodyMesh.setMatrixAt(bodyCount, dummy.matrix);
        bodyMesh.setColorAt(bodyCount, color.setHex(state.color));
        bodyCount += 1;

        dummy.position.set(
          x + Math.sin(heading) * cabinZ,
          cabinY,
          z + Math.cos(heading) * cabinZ,
        );
        dummy.rotation.set(0, heading, 0);
        dummy.scale.set(cabinWidth, cabinHeight, cabinLength);
        dummy.updateMatrix();
        cabinMesh.setMatrixAt(cabinCount, dummy.matrix);
        cabinCount += 1;

        if (cargo) {
          dummy.position.set(
            x - Math.sin(heading) * length * 0.16,
            cargoY,
            z - Math.cos(heading) * length * 0.16,
          );
          dummy.rotation.set(0, heading, 0);
          dummy.scale.set(width * 0.98, cargoHeight, cargoLength);
          dummy.updateMatrix();
          cargoMesh.setMatrixAt(cargoCount, dummy.matrix);
          color.setHex(state.color).multiplyScalar(0.82);
          cargoMesh.setColorAt(cargoCount, color);
          cargoCount += 1;
        }

        if (state.type === 'police') {
          dummy.position.set(x, cabinY + cabinHeight / 2 + 0.12, z);
          dummy.rotation.set(0, heading, 0);
          dummy.scale.set(width * 0.5, 0.16, 0.34);
          dummy.updateMatrix();
          accentMesh.setMatrixAt(accentCount, dummy.matrix);
          color.setHex(state.handle % 2 === 0 ? 0x2f6bff : 0xff3b30);
          accentMesh.setColorAt(accentCount, color);
          accentCount += 1;
        }

        const wheelRadius = Math.min(0.52, Math.max(0.3, height * 0.3));
        const wheelX = width / 2 - 0.02;
        const wheelZ = length / 2 - Math.min(1.05, length * 0.22);
        for (let wheel = 0; wheel < 4; wheel += 1) {
          const side = wheel < 2 ? 1 : -1;
          const front = wheel % 2 === 0 ? 1 : -1;
          const localX = side * wheelX;
          const localZ = front * wheelZ;
          dummy.position.set(
            x + Math.cos(heading) * localX + Math.sin(heading) * localZ,
            wheelRadius,
            z - Math.sin(heading) * localX + Math.cos(heading) * localZ,
          );
          dummy.rotation.set(0, heading, 0);
          dummy.scale.set(0.3, wheelRadius * 2, wheelRadius * 2);
          dummy.updateMatrix();
          wheelMesh.setMatrixAt(wheelCount, dummy.matrix);
          wheelCount += 1;
        }
      }

      // Дым при hp < 30 % и у уничтоженных.
      const ratio = state.hp / state.maxHp;
      if (ratio < 0.3) {
        let timer = smokeTimer[i];
        timer -= dt;
        if (timer <= 0) {
          timer = state.wrecked ? 0.045 : 0.07 + ratio * 0.4;
          const smokeHeight = state.wrecked ? 1.1 : height * 0.75;
          const shade = state.wrecked ? 0.22 : 0.34;
          emitSmoke(x, smokeHeight, z, 1.1 + random() * 0.6, 0.5 + (0.3 - ratio), shade, shade + 0.02, shade + 0.05);
        }
        smokeTimer[i] = timer;
      } else {
        smokeTimer[i] = 0;
      }

      // Следы: ручник на ходу или заметный снос.
      const speed = Math.hypot(transform.vx, transform.vz);
      const sliding = state.slip > 0.8 || (speed > 3 && state.steer !== 0 && state.slip > 1.2);
      if (sliding && speed > 2.5) {
        let timer = skidTimer[i] - dt;
        if (timer <= 0) {
          timer = 0.045;
          const rear = -length * 0.32;
          const half = width / 2 - 0.16;
          dropSkid(
            x + Math.cos(heading) * half + Math.sin(heading) * rear,
            z - Math.sin(heading) * half + Math.cos(heading) * rear,
            heading,
          );
          dropSkid(
            x - Math.cos(heading) * half + Math.sin(heading) * rear,
            z + Math.sin(heading) * half + Math.cos(heading) * rear,
            heading,
          );
        }
        skidTimer[i] = timer;
      } else {
        skidTimer[i] = 0;
      }
    }

    // --- запись счётчиков инстансов ----------------------------------------
    let draws = 0;
    bodyMesh.count = bodyCount;
    cabinMesh.count = cabinCount;
    cargoMesh.count = cargoCount;
    accentMesh.count = accentCount;
    wheelMesh.count = wheelCount;
    if (bodyCount > 0) {
      bodyMesh.instanceMatrix.needsUpdate = true;
      if (bodyMesh.instanceColor) bodyMesh.instanceColor.needsUpdate = true;
      draws += 1;
    }
    if (cabinCount > 0) {
      cabinMesh.instanceMatrix.needsUpdate = true;
      draws += 1;
    }
    if (cargoCount > 0) {
      cargoMesh.instanceMatrix.needsUpdate = true;
      if (cargoMesh.instanceColor) cargoMesh.instanceColor.needsUpdate = true;
      draws += 1;
    }
    if (accentCount > 0) {
      accentMesh.instanceMatrix.needsUpdate = true;
      if (accentMesh.instanceColor) accentMesh.instanceColor.needsUpdate = true;
      draws += 1;
    }
    if (wheelCount > 0) {
      wheelMesh.instanceMatrix.needsUpdate = true;
      draws += 1;
    }

    for (const rig of rigs.values()) {
      for (const batch of [rig.lod0, rig.lod1]) {
        if (batch.paint) {
          batch.paint.count = batch.count;
          if (batch.count > 0) {
            batch.paint.instanceMatrix.needsUpdate = true;
            if (batch.paint.instanceColor) batch.paint.instanceColor.needsUpdate = true;
            draws += 1;
          }
        }
        if (batch.trim) {
          batch.trim.count = batch.count;
          if (batch.count > 0) {
            batch.trim.instanceMatrix.needsUpdate = true;
            draws += 1;
          }
        }
      }
    }

    // --- обновление и сборка дыма -----------------------------------------
    let smokeCount = 0;
    for (let i = 0; i < maxSmoke; i += 1) {
      let life = smokeLife[i];
      if (life <= 0) continue;
      life -= dt;
      if (life <= 0) {
        smokeLife[i] = 0;
        continue;
      }
      smokeLife[i] = life;
      smokeX[i] += smokeVx[i] * dt;
      smokeY[i] += smokeVy[i] * dt;
      smokeZ[i] += smokeVz[i] * dt;
      smokeVy[i] += 0.8 * dt;

      const t = 1 - life / smokeMaxLife[i];
      const scale = smokeSize[i] * (1 + t * 2.4);
      dummy.position.set(smokeX[i], smokeY[i], smokeZ[i]);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      smokeMesh.setMatrixAt(smokeCount, dummy.matrix);
      color.setRGB(smokeRed[i], smokeGreen[i], smokeBlue[i]);
      smokeMesh.setColorAt(smokeCount, color);
      smokeCount += 1;
    }
    smokeMesh.count = smokeCount;
    if (smokeCount > 0) {
      smokeMesh.instanceMatrix.needsUpdate = true;
      if (smokeMesh.instanceColor) smokeMesh.instanceColor.needsUpdate = true;
      draws += 1;
    }
    stats.smoke = smokeCount;

    skidMesh.count = skidAlive;
    if (skidDirty) {
      skidMesh.instanceMatrix.needsUpdate = true;
      skidDirty = false;
    }
    if (skidAlive > 0) draws += 1;
    stats.skid = skidAlive;
    stats.vehicles = vehicles.length;
    stats.models = modelCount;
    stats.lod1 = lod1Count;
    stats.drawCalls = draws;
  };

  return {
    sync,
    burst,
    stats,
    dispose(): void {
      disposed = true;
      scene.remove(root);
      for (const rig of rigs.values()) {
        for (const batch of [rig.lod0, rig.lod1]) {
          if (batch.paint) {
            modelGroup.remove(batch.paint);
            batch.paint.dispose();
          }
          if (batch.trim) {
            modelGroup.remove(batch.trim);
            batch.trim.dispose();
          }
        }
      }
      rigs.clear();
      modelMaterial.dispose();
      // Геометрии GLB общие для всех view: освобождаются по счётчику ссылок.
      releaseModels();
      boxGeometry.dispose();
      wheelGeometry.dispose();
      bodyMaterial.dispose();
      cabinMaterial.dispose();
      cargoMaterial.dispose();
      accentMaterial.dispose();
      wheelMaterial.dispose();
      smokeMesh.dispose();
      (smokeMesh.material as THREE.Material).dispose();
      skidMesh.dispose();
      (skidMesh.material as THREE.Material).dispose();
    },
  };
}

/** Кратчайшая дуга между углами (локальная копия, чтобы не тянуть core). */
function normalizeAngle(angle: number): number {
  let result = angle % (Math.PI * 2);
  if (result > Math.PI) result -= Math.PI * 2;
  else if (result < -Math.PI) result += Math.PI * 2;
  return result;
}
