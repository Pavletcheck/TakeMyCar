// ---------------------------------------------------------------------------
// Three-слой города: InstancedMesh по чанкам, общие геометрии и материалы.
// World остаётся чистым данным; здесь только визуализация.
//
// Бюджет draw calls (M3-A-18): на чанк не больше 3 инстанс-мешей —
//   1) box      — плиты кварталов, коробки зданий, крыши, «коробочные» пропсы;
//   2) cylinder — столбы, гидранты, стволы;
//   3) cone     — кроны деревьев.
// Frustum culling — по bounding sphere каждого чанка (Three делает это сам).
// ---------------------------------------------------------------------------

import * as THREE from 'three';
import type { WorldConfig } from '../config/world';
import { propVariant } from '../world/props';
import type { BuildingInstance, Chunk, PlateInstance, PropInstance } from '../world/types';
import type { World } from '../world/world';

/** Высота плоскости воды: выше земли, ниже плит кварталов. */
const WATER_Y = 0.1;
/** Высота разметки: выше земли, ниже бордюра. */
const MARKING_Y = 0.05;
const DASH_LENGTH = 4.2;
const DASH_STEP = 9;
const DASH_MARGIN = 12;
const ROOF_HEIGHT = 0.36;
const ROOF_OVERHANG = 0.7;

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
  const groundMaterial = new THREE.MeshLambertMaterial({ color: config.colors.ground });
  const waterMaterial = new THREE.MeshLambertMaterial({ color: config.colors.water });
  const markingMaterial = new THREE.MeshBasicMaterial({ color: config.colors.marking });
  const dashGeometry = new THREE.BoxGeometry(0.28, 0.04, DASH_LENGTH);

  const dummy = new THREE.Object3D();
  const tint = new THREE.Color();
  const renders = new Map<number, ChunkRender>();
  const seen = new Set<number>();
  const stats: CityViewStats = { chunks: 0, meshes: 0, instances: 0 };

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

    counts.box += plates.length + buildings.length * 2;
    for (let i = 0; i < props.length; i += 1) {
      const variant = propVariant(props[i].kind, props[i].variant);
      for (let p = 0; p < variant.parts.length; p += 1) countBucket(counts, variant.parts[p].geometry);
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
    for (let i = 0; i < buildings.length; i += 1) addBuilding(buildings[i]);
    for (let i = 0; i < props.length; i += 1) addProp(props[i]);

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
    for (let i = 0; i < render.meshes.length; i += 1) render.meshes[i].dispose();
  };

  const view: CityView = {
    root,
    stats,

    sync(world) {
      if (!staticBuilt) buildStatic(world);
      if (world.revision === lastRevision) return;
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

      let meshCount = 0;
      let instanceCount = 0;
      for (const render of renders.values()) {
        meshCount += render.meshes.length;
        instanceCount += render.instances;
      }
      stats.chunks = renders.size;
      stats.meshes = meshCount;
      stats.instances = instanceCount;
    },

    dispose() {
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
      groundMaterial.dispose();
      waterMaterial.dispose();
      markingMaterial.dispose();
      stats.chunks = 0;
      stats.meshes = 0;
      stats.instances = 0;
    },
  };

  return view;
}
