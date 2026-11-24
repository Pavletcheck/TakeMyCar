// ---------------------------------------------------------------------------
// M7. Загрузка low-poly GLB: один GLTFLoader, кэш по URL, общий flat-материал.
//
// Правила (по итогам QA M7):
// - URL берутся `?url`-импортами Vite: базовый путь (`/TakeMyCar/` на Pages)
//   подставляет сборщик, абсолютных '/assets/...' в коде нет;
// - материал загрузчика (PBR с metalness = 1) не используется: в рантайме
//   один `MeshLambertMaterial` с vertexColors и flatShading, без envMap;
// - геометрии живут до teardown: кэш с подсчётом пользователей, освобождение
//   только когда все view-модули сделали `releaseModels()`;
// - ошибка загрузки — одно предупреждение на ассет, дальше работает fallback
//   на примитивы (игра не падает);
// - `?models=0` отключает GLB целиком (проверка fallback в QA).
// ---------------------------------------------------------------------------

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { VehicleTypeId } from '../config/vehicles';

// Машины: 5 типов × 2 уровня детализации.
import carSedanLod0 from '../../assets/models/car_sedan_lod0.glb?url';
import carSedanLod1 from '../../assets/models/car_sedan_lod1.glb?url';
import carSportsLod0 from '../../assets/models/car_sports_lod0.glb?url';
import carSportsLod1 from '../../assets/models/car_sports_lod1.glb?url';
import carVanLod0 from '../../assets/models/car_van_lod0.glb?url';
import carVanLod1 from '../../assets/models/car_van_lod1.glb?url';
import carTruckLod0 from '../../assets/models/car_truck_lod0.glb?url';
import carTruckLod1 from '../../assets/models/car_truck_lod1.glb?url';
import carPoliceLod0 from '../../assets/models/car_police_lod0.glb?url';
import carPoliceLod1 from '../../assets/models/car_police_lod1.glb?url';
// Персонажи: окрашиваемая база (игрок и пешеходы) и запечённый коп.
import pedBaseUrl from '../../assets/models/ped_base_lod0.glb?url';
import pedCopUrl from '../../assets/models/ped_cop_lod0.glb?url';
// Пропсы: 7 видов, 2–3 варианта.
import propLampA from '../../assets/models/prop_lamp_a.glb?url';
import propLampB from '../../assets/models/prop_lamp_b.glb?url';
import propBinA from '../../assets/models/prop_bin_a.glb?url';
import propBinB from '../../assets/models/prop_bin_b.glb?url';
import propHydrantA from '../../assets/models/prop_hydrant_a.glb?url';
import propHydrantB from '../../assets/models/prop_hydrant_b.glb?url';
import propTreeA from '../../assets/models/prop_tree_a.glb?url';
import propTreeB from '../../assets/models/prop_tree_b.glb?url';
import propTreeC from '../../assets/models/prop_tree_c.glb?url';
import propBenchA from '../../assets/models/prop_bench_a.glb?url';
import propBenchB from '../../assets/models/prop_bench_b.glb?url';
import propBillboardA from '../../assets/models/prop_billboard_a.glb?url';
import propBillboardB from '../../assets/models/prop_billboard_b.glb?url';
import propBillboardC from '../../assets/models/prop_billboard_c.glb?url';
import propFenceA from '../../assets/models/prop_fence_a.glb?url';
import propFenceB from '../../assets/models/prop_fence_b.glb?url';

/** Одна часть модели: геометрия в осях узла и матрица узла (пивот). */
export interface ModelPart {
  readonly name: string;
  readonly geometry: THREE.BufferGeometry;
  readonly matrix: THREE.Matrix4;
}

export type ModelParts = ReadonlyMap<string, ModelPart>;

export const CAR_MODEL_URLS: Readonly<Record<VehicleTypeId, { lod0: string; lod1: string }>> = {
  sedan: { lod0: carSedanLod0, lod1: carSedanLod1 },
  sports: { lod0: carSportsLod0, lod1: carSportsLod1 },
  van: { lod0: carVanLod0, lod1: carVanLod1 },
  truck: { lod0: carTruckLod0, lod1: carTruckLod1 },
  police: { lod0: carPoliceLod0, lod1: carPoliceLod1 },
};

export const PED_MODEL_URLS = { base: pedBaseUrl, cop: pedCopUrl } as const;

/** Ключ пропса: `<kind>:<variant>`; вариантов ровно столько, сколько в props.ts. */
export const PROP_MODEL_URLS: Readonly<Record<string, string>> = {
  'lamp:0': propLampA,
  'lamp:1': propLampB,
  'bin:0': propBinA,
  'bin:1': propBinB,
  'hydrant:0': propHydrantA,
  'hydrant:1': propHydrantB,
  'tree:0': propTreeA,
  'tree:1': propTreeB,
  'tree:2': propTreeC,
  'bench:0': propBenchA,
  'bench:1': propBenchB,
  'billboard:0': propBillboardA,
  'billboard:1': propBillboardB,
  'billboard:2': propBillboardC,
  'fence:0': propFenceA,
  'fence:1': propFenceB,
};

interface CacheEntry {
  readonly promise: Promise<ModelParts>;
  parts: ModelParts | null;
  failed: boolean;
}

const loader = new GLTFLoader();
const cache = new Map<string, CacheEntry>();
let users = 0;

/** `?models=0` — принудительный fallback на примитивы (QA FAL/GAP-2). */
export function modelsDisabled(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('models') === '0';
}

/** Общий материал всех low-poly моделей: плоские вершинные цвета, без PBR. */
export function createFlatMaterial(): THREE.MeshLambertMaterial {
  return new THREE.MeshLambertMaterial({
    color: 0xffffff,
    vertexColors: true,
    flatShading: true,
  });
}

async function parseModel(url: string): Promise<ModelParts> {
  const gltf = await loader.loadAsync(url);
  const root = gltf.scene;
  root.updateMatrixWorld(true);

  const inverseRoot = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const parts = new Map<string, ModelPart>();
  const materials = new Set<THREE.Material>();
  const relative = new THREE.Matrix4();

  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;
    relative.multiplyMatrices(inverseRoot, mesh.matrixWorld);
    parts.set(mesh.name, {
      name: mesh.name,
      geometry: mesh.geometry,
      matrix: relative.clone(),
    });
    const material = mesh.material;
    if (Array.isArray(material)) for (const item of material) materials.add(item);
    else materials.add(material);
  });

  // Материалы glTF (PBR) не нужны: рисуем своим flat-материалом.
  for (const material of materials) material.dispose();

  if (parts.size === 0) throw new Error(`${url}: в GLB нет мешей`);
  return parts;
}

/** Загрузить (или взять из кэша) части модели. Ошибка не бросается дальше. */
export function loadModelParts(url: string): Promise<ModelParts> {
  const existing = cache.get(url);
  if (existing) return existing.promise;

  const promise = parseModel(url).catch((error: unknown) => {
    // Одно предупреждение на ассет, не на кадр; вызывающий остаётся на примитивах.
    console.warn('[models] не загружен', url, error);
    throw error;
  });
  const entry: CacheEntry = { promise, parts: null, failed: false };
  cache.set(url, entry);
  promise.then(
    (parts) => {
      entry.parts = parts;
    },
    () => {
      entry.failed = true;
    },
  );
  return promise;
}

/** Зарегистрировать пользователя кэша (view-модуль создан). */
export function retainModels(): void {
  users += 1;
}

/** Отпустить кэш; при последнем пользователе геометрии освобождаются. */
export function releaseModels(): void {
  if (users > 0) users -= 1;
  if (users > 0) return;
  for (const entry of cache.values()) {
    if (!entry.parts) continue;
    for (const part of entry.parts.values()) part.geometry.dispose();
  }
  cache.clear();
}

/** Собрать InstancedMesh нужной ёмкости для части модели. */
export function createPartInstances(
  part: ModelPart,
  material: THREE.Material,
  capacity: number,
): THREE.InstancedMesh {
  const mesh = new THREE.InstancedMesh(part.geometry, material, Math.max(1, capacity));
  mesh.count = 0;
  mesh.frustumCulled = false;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  return mesh;
}
