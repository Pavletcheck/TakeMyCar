// ---------------------------------------------------------------------------
// Three-слой города: InstancedMesh по чанкам, общие геометрии и материалы.
// World остаётся чистым данным; здесь только визуализация.
//
// M7.1: здания и пропсы живут не по чанкам, а общими инстанс-сетами:
//   - постройки — 4 бакета по высоте × LOD0/LOD1 (ближе 90 м к камере — LOD0);
//   - пропсы — «вид:вариант» (≤16 мешей), пивот по основанию;
//   - плиты кварталов и крыши коробок — по чанкам (≤2 instanced-меша).
// При `?models=0` или ошибке загрузки GLB остаются прежние коробки/примитивы.
// Общие геометрии моделей не освобождаются при выгрузке чанка (BUG-M7-008).
// ---------------------------------------------------------------------------

import * as THREE from 'three';
import asphaltUrl from '../../assets/textures/ground/asphalt.webp?url';
import type { WorldConfig } from '../config/world';
import { propVariant } from '../world/props';
import type { BuildingInstance, Chunk, PlateInstance, PropInstance } from '../world/types';
import type { World } from '../world/world';
import {
  BUILDING_MODEL_URLS,
  PROP_MODEL_URLS,
  createFlatMaterial,
  createPartInstances,
  loadModelParts,
  modelsDisabled,
  releaseModels,
  retainModels,
} from './modelLibrary';
import type { ModelPart } from './modelLibrary';
import { getViewFocus } from './viewFocus';

/** Высота плоскости воды: выше земли, ниже плит кварталов. */
const WATER_Y = 0.1;
/** Высота разметки: выше земли, ниже бордюра. */
const MARKING_Y = 0.05;
const DASH_LENGTH = 4.2;
const DASH_STEP = 9;
const DASH_MARGIN = 12;
const ROOF_HEIGHT = 0.36;
const ROOF_OVERHANG = 0.7;

/**
 * Бакеты зданий: выбор модели по высоте, канонические габариты (w, h, d) —
 * модель масштабируется под w/d/h из мира, пивот по центру основания.
 * Канон снят с медиан карты (дома 22–60 м в плане), поэтому масштаб ≈ 1
 * и окна/крышные детали не растягиваются (см. tools/blender/build_buildings.py).
 */
const BUILDING_BUCKETS = [
  { key: 'small', maxHeight: 12, size: [30, 8, 28] },
  { key: 'mid', maxHeight: 26, size: [30, 16, 30] },
  { key: 'tall', maxHeight: 40, size: [34, 28, 34] },
  { key: 'tower', maxHeight: Number.POSITIVE_INFINITY, size: [44, 44, 36] },
] as const;

/** Ближе этого расстояния до камеры дом рисуется LOD0, дальше — LOD1. */
const BUILDING_LOD_DISTANCE = 90;
const BUILDING_LOD_DISTANCE_SQ = BUILDING_LOD_DISTANCE * BUILDING_LOD_DISTANCE;
/** Дальше этого расстояния дом не рисуется: за кадром ортокамеры и в тумане. */
const BUILDING_DRAW_DISTANCE = 160;
const BUILDING_DRAW_DISTANCE_SQ = BUILDING_DRAW_DISTANCE * BUILDING_DRAW_DISTANCE;
/** Пропсы дальше этого расстояния не рисуются (орто-вид ~110 м + запас). */
const PROP_DRAW_DISTANCE = 150;
const PROP_DRAW_DISTANCE_SQ = PROP_DRAW_DISTANCE * PROP_DRAW_DISTANCE;
/** Пересборка LOD зданий и пропсов при смещении камеры на это расстояние, м. */
const BUILDING_LOD_STEP = 10;

function buildingBucket(height: number): (typeof BUILDING_BUCKETS)[number] {
  for (const bucket of BUILDING_BUCKETS) {
    if (height < bucket.maxHeight) return bucket;
  }
  return BUILDING_BUCKETS[BUILDING_BUCKETS.length - 1];
}

type Bucket = 'box' | 'cylinder' | 'cone';

interface BucketCounts {
  box: number;
  cylinder: number;
  cone: number;
}

interface ChunkRender {
  readonly key: number;
  readonly group: THREE.Group;
  readonly meshes: THREE.InstancedMesh[];
  readonly instances: number;
}

export interface CityViewStats {
  chunks: number;
  meshes: number;
  instances: number;
  /** Пропсы нарисованы GLB-моделями (иначе — примитивами). */
  propModels: boolean;
  /** Сколько разных ключей «вид:вариант» в инстанс-сете пропсов. */
  propMeshes: number;
  /** Здания нарисованы GLB-моделями (иначе — коробками). */
  buildingModels: boolean;
  /** Сколько инстанс-мешей зданий (бакеты × LOD). */
  buildingMeshes: number;
  /** Сколько домов на LOD1. */
  buildingsLod1: number;
}

export interface CityView {
  readonly root: THREE.Group;
  /** Синхронизировать сцену с активными чанками (только при смене revision). */
  sync(world: World): void;
  dispose(): void;
  readonly stats: CityViewStats;
}

export function createCityView(scene: THREE.Scene, config: WorldConfig): CityView {
  const root = new THREE.Group();
  root.name = 'city';
  scene.add(root);

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
  const coneGeometry = new THREE.ConeGeometry(0.5, 1, 6);
  const cityMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  // M7.2: асфальт из ComfyUI; тайлится по всей плоскости города.
  const asphaltTexture = new THREE.TextureLoader().load(asphaltUrl);
  asphaltTexture.wrapS = THREE.RepeatWrapping;
  asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(72, 72);
  asphaltTexture.colorSpace = THREE.SRGBColorSpace;
  asphaltTexture.anisotropy = 4;
  const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x8a9096, map: asphaltTexture });
  const waterMaterial = new THREE.MeshLambertMaterial({ color: config.colors.water });
  const markingMaterial = new THREE.MeshBasicMaterial({ color: config.colors.marking });
  const dashGeometry = new THREE.BoxGeometry(0.28, 0.04, DASH_LENGTH);

  // --- пропсы: один инстанс-сет на «вид:вариант» вне чанков (M7) -----------
  // Так 16 GLB дают 16 draw calls на весь активный город, а не 7 × чанки.
  const propGroup = new THREE.Group();
  propGroup.name = 'props';
  root.add(propGroup);
  const flatMaterial = createFlatMaterial();
  const propModels = new Map<string, ModelPart>();
  const propMeshes = new Map<string, THREE.InstancedMesh>();
  let propsReady = false;
  let propsActive = false;

  // --- здания: 4 бакета по высоте × LOD0/LOD1, тоже вне чанков (M7.1) ------
  const bldGroup = new THREE.Group();
  bldGroup.name = 'buildings';
  root.add(bldGroup);
  const bldModels = new Map<string, { lod0: ModelPart; lod1: ModelPart }>();
  /** Меши бакета: две ёмкости (LOD0/LOD1) на весь активный город. */
  const bldMeshes = new Map<string, { lod0: THREE.InstancedMesh; lod1: THREE.InstancedMesh }>();
  let bldReady = false;
  let bldActive = false;
  let bldLodOriginX = Number.NaN;
  let bldLodOriginZ = Number.NaN;
  let disposed = false;
  retainModels();

  const loadPropModels = async (): Promise<void> => {
    const entries = Object.entries(PROP_MODEL_URLS);
    try {
      const loaded = await Promise.all(entries.map(async ([key, url]) => {
        const parts = await loadModelParts(url);
        const part = parts.get('prop');
        if (!part) throw new Error(`${url}: нет узла prop`);
        return [key, part] as const;
      }));
      if (disposed) return;
      for (const [key, part] of loaded) propModels.set(key, part);
      propsReady = true;
    } catch {
      // Любой сбой — весь слой пропсов остаётся на примитивах (консистентно).
      propModels.clear();
      propsReady = false;
    }
  };

  const loadBuildingModels = async (): Promise<void> => {
    try {
      const loaded = await Promise.all(
        Object.entries(BUILDING_MODEL_URLS).map(async ([key, urls]) => {
          const [lod0Parts, lod1Parts] = await Promise.all([
            loadModelParts(urls.lod0),
            loadModelParts(urls.lod1),
          ]);
          const lod0 = lod0Parts.get('bld');
          const lod1 = lod1Parts.get('bld');
          if (!lod0 || !lod1) throw new Error(`${urls.lod0}: нет узла bld`);
          return [key, { lod0, lod1 }] as const;
        }),
      );
      if (disposed) return;
      for (const [key, model] of loaded) bldModels.set(key, model);
      bldReady = true;
    } catch {
      // Частичный набор бакетов не годится: дома остаются коробками.
      bldModels.clear();
      bldReady = false;
    }
  };

  if (!modelsDisabled()) {
    void loadPropModels();
    void loadBuildingModels();
  }

  const dummy = new THREE.Object3D();
  const tint = new THREE.Color();
  const renders = new Map<number, ChunkRender>();
  const seen = new Set<number>();
  const stats: CityViewStats = {
    chunks: 0,
    meshes: 0,
    instances: 0,
    propModels: false,
    propMeshes: 0,
    buildingModels: false,
    buildingMeshes: 0,
    buildingsLod1: 0,
  };

  let staticBuilt = false;
  let lastRevision = -1;
  let groundMesh: THREE.Mesh | null = null;
  const waterMeshes: THREE.Mesh[] = [];
  let markingMesh: THREE.InstancedMesh | null = null;

  const addBoxInstance = (
    mesh: THREE.InstancedMesh,
    index: number,
    x: number,
    y: number,
    z: number,
    heading: number,
    sx: number,
    sy: number,
    sz: number,
    color: number,
  ): void => {
    dummy.position.set(x, y, z);
    dummy.rotation.set(0, heading, 0);
    dummy.scale.set(sx, sy, sz);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
    mesh.setColorAt(index, tint.setHex(color));
  };

  const countBucket = (counts: BucketCounts, geometry: Bucket): void => {
    counts[geometry] += 1;
  };

  const buildStatic = (world: World): void => {
    staticBuilt = true;
    const bounds = world.bounds;
    const width = bounds.maxX - bounds.minX;
    const depth = bounds.maxZ - bounds.minZ;

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set((bounds.minX + bounds.maxX) / 2, 0, (bounds.minZ + bounds.maxZ) / 2);
    ground.receiveShadow = true;
    ground.name = 'ground';
    root.add(ground);
    groundMesh = ground;

    const water = world.minimap.water;
    for (let i = 0; i < water.length; i += 1) {
      const rect = water[i];
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(rect.hx * 2, rect.hz * 2),
        waterMaterial,
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(rect.x, WATER_Y, rect.z);
      mesh.name = `water-${i}`;
      root.add(mesh);
      waterMeshes.push(mesh);
    }

    // Разметка: пунктир по осевой каждого ребра, с пропуском перекрёстков.
    const roads = world.minimap.roads;
    let dashCount = 0;
    for (let i = 0; i < roads.length; i += 1) {
      const road = roads[i];
      const length = Math.hypot(road.x2 - road.x1, road.z2 - road.z1);
      if (length <= DASH_MARGIN * 2) continue;
      dashCount += Math.ceil((length - DASH_MARGIN * 2) / DASH_STEP);
    }

    if (dashCount > 0) {
      const mesh = new THREE.InstancedMesh(dashGeometry, markingMaterial, dashCount);
      mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      let index = 0;
      for (let i = 0; i < roads.length; i += 1) {
        const road = roads[i];
        const dx = road.x2 - road.x1;
        const dz = road.z2 - road.z1;
        const length = Math.hypot(dx, dz);
        if (length <= DASH_MARGIN * 2) continue;
        const ux = dx / length;
        const uz = dz / length;
        const heading = Math.atan2(dx, dz);
        for (let d = DASH_MARGIN; d < length - DASH_MARGIN; d += DASH_STEP) {
          dummy.position.set(road.x1 + ux * d, MARKING_Y, road.z1 + uz * d);
          dummy.rotation.set(0, heading, 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          mesh.setMatrixAt(index, dummy.matrix);
          index += 1;
        }
      }
      mesh.count = index;
      mesh.instanceMatrix.needsUpdate = true;
      mesh.frustumCulled = false;
      mesh.name = 'markings';
      root.add(mesh);
      markingMesh = mesh;
    }
  };

  const buildChunk = (chunk: Chunk): ChunkRender => {
    const counts: BucketCounts = { box: 0, cylinder: 0, cone: 0 };
    const plates = chunk.plates;
    const buildings = chunk.buildings;
    const props = chunk.props;

    // Дома на GLB рисуются общим слоем (бакеты × LOD), иначе — коробки с крышей.
    counts.box += plates.length + (bldReady ? 0 : buildings.length * 2);
    if (!propsReady) {
      for (let i = 0; i < props.length; i += 1) {
        const variant = propVariant(props[i].kind, props[i].variant);
        for (let p = 0; p < variant.parts.length; p += 1) countBucket(counts, variant.parts[p].geometry);
      }
    }

    const group = new THREE.Group();
    group.name = `chunk-${chunk.cx}-${chunk.cz}`;
    group.matrixAutoUpdate = false;
    const meshes: THREE.InstancedMesh[] = [];
    const cursors: BucketCounts = { box: 0, cylinder: 0, cone: 0 };

    const createMesh = (bucket: Bucket, geometry: THREE.BufferGeometry): THREE.InstancedMesh | null => {
      const count = counts[bucket];
      if (count <= 0) return null;
      const mesh = new THREE.InstancedMesh(geometry, cityMaterial, count);
      mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.name = `${bucket}-${chunk.cx}-${chunk.cz}`;
      group.add(mesh);
      meshes.push(mesh);
      return mesh;
    };

    const boxMesh = createMesh('box', boxGeometry);
    const cylinderMesh = createMesh('cylinder', cylinderGeometry);
    const coneMesh = createMesh('cone', coneGeometry);

    const addPlate = (plate: PlateInstance): void => {
      if (!boxMesh) return;
      addBoxInstance(
        boxMesh,
        cursors.box,
        plate.x,
        config.curbHeight / 2,
        plate.z,
        0,
        plate.w,
        config.curbHeight,
        plate.d,
        plate.color,
      );
      cursors.box += 1;
    };

    const addBuilding = (building: BuildingInstance): void => {
      if (!boxMesh) return;
      addBoxInstance(
        boxMesh,
        cursors.box,
        building.x,
        config.curbHeight + building.h / 2,
        building.z,
        0,
        building.w,
        building.h,
        building.d,
        building.color,
      );
      cursors.box += 1;
      addBoxInstance(
        boxMesh,
        cursors.box,
        building.x,
        config.curbHeight + building.h + ROOF_HEIGHT / 2,
        building.z,
        0,
        building.w + ROOF_OVERHANG,
        ROOF_HEIGHT,
        building.d + ROOF_OVERHANG,
        building.roofColor,
      );
      cursors.box += 1;
    };

    const addProp = (prop: PropInstance): void => {
      const variant = propVariant(prop.kind, prop.variant);
      const cos = Math.cos(prop.heading);
      const sin = Math.sin(prop.heading);
      for (let i = 0; i < variant.parts.length; i += 1) {
        const part = variant.parts[i];
        const mesh =
          part.geometry === 'box' ? boxMesh : part.geometry === 'cylinder' ? cylinderMesh : coneMesh;
        if (!mesh) continue;
        const localX = part.x * prop.scale;
        const localZ = part.z * prop.scale;
        // Поворот вокруг Y в соглашении Three: x' = x·cos + z·sin; z' = -x·sin + z·cos.
        const x = prop.x + localX * cos + localZ * sin;
        const z = prop.z - localX * sin + localZ * cos;
        const y = config.curbHeight + part.y * prop.scale;
        addBoxInstance(
          mesh,
          cursors[part.geometry],
          x,
          y,
          z,
          prop.heading,
          part.sx * prop.scale,
          part.sy * prop.scale,
          part.sz * prop.scale,
          part.color,
        );
        cursors[part.geometry] += 1;
      }
    };

    for (let i = 0; i < plates.length; i += 1) addPlate(plates[i]);
    if (!bldReady) {
      for (let i = 0; i < buildings.length; i += 1) addBuilding(buildings[i]);
    }
    // Пропсы на GLB живут в общем слое вне чанков; примитивы — запасной путь.
    if (!propsReady) {
      for (let i = 0; i < props.length; i += 1) addProp(props[i]);
    }

    for (let i = 0; i < meshes.length; i += 1) {
      const mesh = meshes[i];
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.computeBoundingSphere();
    }

    root.add(group);
    return { key: chunk.renderRef, group, meshes, instances: counts.box + counts.cylinder + counts.cone };
  };

  const removeChunk = (render: ChunkRender): void => {
    root.remove(render.group);
    // InstancedMesh.dispose() освобождает только буферы инстансов:
    // общие геометрии (box/cylinder/cone) остаются жить до teardown (BUG-M7-008).
    for (let i = 0; i < render.meshes.length; i += 1) render.meshes[i].dispose();
  };

  /** Освободить инстансы пропсов, не трогая общие GLB-геометрии. */
  const clearProps = (): void => {
    for (const mesh of propMeshes.values()) {
      propGroup.remove(mesh);
      mesh.dispose();
    }
    propMeshes.clear();
  };

  /** Собрать слой пропсов из активных чанков: один InstancedMesh на ключ. */
  const rebuildProps = (world: World): void => {
    clearProps();
    const active = world.activeChunks;
    const groups = new Map<string, PropInstance[]>();
    for (let i = 0; i < active.length; i += 1) {
      const props = active[i].props;
      for (let p = 0; p < props.length; p += 1) {
        const prop = props[p];
        const key = `${prop.kind}:${prop.variant}`;
        const list = groups.get(key);
        if (list) list.push(prop);
        else groups.set(key, [prop]);
      }
    }

    for (const [key, list] of groups) {
      const part = propModels.get(key);
      if (!part) continue;
      const mesh = createPartInstances(part, flatMaterial, list.length);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      // Дальность отсекается вручную (см. writeProps), culling по чанкам не нужен.
      mesh.frustumCulled = false;
      propGroup.add(mesh);
      propMeshes.set(key, mesh);
    }
  };

  /**
   * Записать инстансы пропсов в радиусе PROP_DRAW_DISTANCE от камеры.
   * Ёмкости мешей постоянны до смены чанков, поэтому пересборка дешёвая.
   */
  const writeProps = (world: World, focusX: number, focusZ: number): void => {
    for (const mesh of propMeshes.values()) mesh.count = 0;
    const active = world.activeChunks;
    for (let i = 0; i < active.length; i += 1) {
      const props = active[i].props;
      for (let p = 0; p < props.length; p += 1) {
        const prop = props[p];
        const dx = prop.x - focusX;
        const dz = prop.z - focusZ;
        if (dx * dx + dz * dz > PROP_DRAW_DISTANCE_SQ) continue;
        const mesh = propMeshes.get(`${prop.kind}:${prop.variant}`);
        if (!mesh) continue;
        const index = mesh.count;
        if (index >= mesh.instanceMatrix.count) continue;
        dummy.position.set(prop.x, config.curbHeight, prop.z);
        dummy.rotation.set(0, prop.heading, 0);
        dummy.scale.setScalar(prop.scale);
        dummy.updateMatrix();
        // Пивот пропса — по основанию, поэтому матрица узла — почти identity.
        mesh.setMatrixAt(index, dummy.matrix);
        mesh.count = index + 1;
      }
    }
    for (const mesh of propMeshes.values()) {
      if (mesh.count > 0) mesh.instanceMatrix.needsUpdate = true;
    }
  };

  // --- здания: бакеты по высоте и дистанционный LOD -------------------------

  /** Освободить инстансы зданий, не трогая общие GLB-геометрии. */
  const clearBuildings = (): void => {
    for (const pair of bldMeshes.values()) {
      bldGroup.remove(pair.lod0, pair.lod1);
      pair.lod0.dispose();
      pair.lod1.dispose();
    }
    bldMeshes.clear();
  };

  /**
   * Пересоздать ёмкости под активные чанки: по одной паре (LOD0/LOD1) на бакет.
   * Вызывается только при смене набора чанков, не каждый кадр.
   */
  const allocateBuildingMeshes = (world: World): void => {
    clearBuildings();
    const active = world.activeChunks;
    const counts = new Map<string, number>();
    for (let i = 0; i < active.length; i += 1) {
      const buildings = active[i].buildings;
      for (let b = 0; b < buildings.length; b += 1) {
        const key = buildingBucket(buildings[b].h).key;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    for (const [key, count] of counts) {
      const model = bldModels.get(key);
      if (!model) continue;
      const lod0 = createPartInstances(model.lod0, flatMaterial, count);
      const lod1 = createPartInstances(model.lod1, flatMaterial, count);
      lod0.castShadow = true;
      lod1.castShadow = false;
      lod0.receiveShadow = true;
      lod1.receiveShadow = true;
      bldGroup.add(lod0, lod1);
      bldMeshes.set(key, { lod0, lod1 });
    }
  };

  /**
   * Разложить дома по LOD0/LOD1 относительно камеры и записать матрицы.
   * Габарит модели масштабируется под w/d/h из мира, поворот — 0 (как у мира).
   */
  const writeBuildingInstances = (world: World, focusX: number, focusZ: number): void => {
    for (const pair of bldMeshes.values()) {
      pair.lod0.count = 0;
      pair.lod1.count = 0;
    }
    bldLodOriginX = focusX;
    bldLodOriginZ = focusZ;
    let lod1Count = 0;

    const active = world.activeChunks;
    for (let i = 0; i < active.length; i += 1) {
      const buildings = active[i].buildings;
      for (let b = 0; b < buildings.length; b += 1) {
        const building = buildings[b];
        const bucket = buildingBucket(building.h);
        const pair = bldMeshes.get(bucket.key);
        if (!pair) continue;
        const dx = building.x - focusX;
        const dz = building.z - focusZ;
        const distanceSq = dx * dx + dz * dz;
        // За пределами кадра/в тумане дома не рисуем вовсе.
        if (distanceSq > BUILDING_DRAW_DISTANCE_SQ) continue;
        const far = distanceSq > BUILDING_LOD_DISTANCE_SQ;
        const mesh = far ? pair.lod1 : pair.lod0;
        const index = mesh.count;
        if (index >= mesh.instanceMatrix.count) continue;
        dummy.position.set(building.x, config.curbHeight, building.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(
          building.w / bucket.size[0],
          building.h / bucket.size[1],
          building.d / bucket.size[2],
        );
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
        mesh.setColorAt(index, tint.setHex(building.color));
        mesh.count = index + 1;
        if (far) lod1Count += 1;
      }
    }

    for (const pair of bldMeshes.values()) {
      for (const mesh of [pair.lod0, pair.lod1]) {
        if (mesh.count > 0) {
          mesh.instanceMatrix.needsUpdate = true;
          if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        }
        // Дома статичны: culling по bounding sphere инстансов работает всегда.
        mesh.frustumCulled = true;
        mesh.computeBoundingSphere();
      }
    }
    stats.buildingsLod1 = lod1Count;
  };

  /** Пора ли пересчитать дальность/LOD: камера ушла дальше шага гистерезиса. */
  const layersStale = (focusX: number, focusZ: number): boolean => {
    if (!propsActive && !bldActive) return false;
    if (!Number.isFinite(bldLodOriginX)) return true;
    return Math.hypot(focusX - bldLodOriginX, focusZ - bldLodOriginZ) > BUILDING_LOD_STEP;
  };

  const view: CityView = {
    root,
    stats,
    sync(world) {
      if (!staticBuilt) buildStatic(world);

      // Модели пришли позже чанков: один раз пересобрать слои и коробки.
      if (propsReady !== propsActive || bldReady !== bldActive) {
        propsActive = propsReady;
        bldActive = bldReady;
        for (const render of renders.values()) removeChunk(render);
        renders.clear();
        clearProps();
        clearBuildings();
        bldLodOriginX = Number.NaN;
        lastRevision = -1;
      }

      const focus = getViewFocus();
      const revisionChanged = world.revision !== lastRevision;

      if (!revisionChanged && !layersStale(focus.x, focus.z)) return;

      if (revisionChanged) {
        lastRevision = world.revision;

        seen.clear();
        const active = world.activeChunks;
        for (let i = 0; i < active.length; i += 1) {
          const chunk = active[i];
          const key = chunk.renderRef;
          seen.add(key);
          if (!renders.has(key)) renders.set(key, buildChunk(chunk));
        }

        for (const entry of renders) {
          if (seen.has(entry[0])) continue;
          removeChunk(entry[1]);
          renders.delete(entry[0]);
        }

        if (propsActive) {
          rebuildProps(world);
          writeProps(world, focus.x, focus.z);
        } else {
          clearProps();
        }

        if (bldActive) {
          allocateBuildingMeshes(world);
          writeBuildingInstances(world, focus.x, focus.z);
        } else {
          clearBuildings();
        }
      } else if (bldActive || propsActive) {
        // Камера уехала: пересчёт дальности/LOD без пересборки чанков.
        if (propsActive) writeProps(world, focus.x, focus.z);
        if (bldActive) writeBuildingInstances(world, focus.x, focus.z);
      }

      let meshCount = 0;
      let instanceCount = 0;
      for (const render of renders.values()) {
        meshCount += render.meshes.length;
        instanceCount += render.instances;
      }
      let bldMeshCount = 0;
      for (const pair of bldMeshes.values()) {
        if (pair.lod0.count > 0) bldMeshCount += 1;
        if (pair.lod1.count > 0) bldMeshCount += 1;
      }
      stats.chunks = renders.size;
      stats.meshes = meshCount + propMeshes.size + bldMeshCount;
      stats.instances = instanceCount;
      stats.propModels = propsActive;
      stats.propMeshes = propMeshes.size;
      stats.buildingModels = bldActive;
      stats.buildingMeshes = bldMeshCount;
    },

    dispose() {
      disposed = true;
      clearProps();
      clearBuildings();
      for (const render of renders.values()) removeChunk(render);
      renders.clear();
      if (groundMesh) {
        root.remove(groundMesh);
        groundMesh.geometry.dispose();
        groundMesh = null;
      }
      for (let i = 0; i < waterMeshes.length; i += 1) {
        const mesh = waterMeshes[i];
        root.remove(mesh);
        mesh.geometry.dispose();
      }
      waterMeshes.length = 0;
      if (markingMesh) {
        root.remove(markingMesh);
        markingMesh.dispose();
        markingMesh = null;
      }
      scene.remove(root);
      boxGeometry.dispose();
      cylinderGeometry.dispose();
      coneGeometry.dispose();
      dashGeometry.dispose();
      cityMaterial.dispose();
      asphaltTexture.dispose();
      groundMaterial.dispose();
      waterMaterial.dispose();
      markingMaterial.dispose();
      flatMaterial.dispose();
      // Геометрии GLB общие для всех view: освобождаются по счётчику ссылок.
      releaseModels();
      stats.chunks = 0;
      stats.meshes = 0;
      stats.instances = 0;
      stats.propModels = false;
      stats.propMeshes = 0;
      stats.buildingModels = false;
      stats.buildingMeshes = 0;
      stats.buildingsLod1 = 0;
    },
  };

  return view;
}
