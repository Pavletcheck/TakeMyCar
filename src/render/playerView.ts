// ---------------------------------------------------------------------------
// M7. Игрок пешком: low-poly модель (та же база, что у пешеходов, но со своей
// палитрой), шаг — вращением узлов рук и ног вокруг пивотов из Blender.
//
// Игрок один, поэтому это обычные Mesh в Group, а не InstancedMesh: 6 draw
// calls и живые части. В машине группа скрыта. `?models=0` и ошибка загрузки
// оставляют примитивы M4 (цилиндр, сфера, «нос»-указатель).
//
// Дополнительно playerView публикует центр интереса камеры (`viewFocus`):
// камера следит за игроком, значит его позиция — центр кадра для выбора LOD.
// ---------------------------------------------------------------------------

import * as THREE from 'three';
import {
  PED_MODEL_URLS,
  createFlatMaterial,
  loadModelParts,
  modelsDisabled,
  releaseModels,
  retainModels,
} from './modelLibrary';
import { setViewFocus } from './viewFocus';

/** Части модели игрока и их цвет (куртка/кожа/брюки). */
const PLAYER_PARTS = ['torso', 'head', 'arm_l', 'arm_r', 'leg_l', 'leg_r'] as const;
const JACKET = 0x4dabf7;
const SKIN = 0xf2c9a0;
const PANTS = 0x26303c;
const LEG_SWING = 0.62;
const ARM_SWING = 0.45;
const STEP_RATE = 6.2;

export interface PlayerView {
  sync(x: number, z: number, heading: number, visible: boolean): void;
  dispose(): void;
}

export function createPlayerView(scene: THREE.Scene): PlayerView {
  const group = new THREE.Group();
  group.name = 'player';
  scene.add(group);

  // --- примитивы-заглушки (M4) ---------------------------------------------
  const primitives = new THREE.Group();
  group.add(primitives);
  const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4dabf7 });
  const headMaterial = new THREE.MeshLambertMaterial({ color: 0xf2c9a0 });
  const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.36, 1, 8);
  const headGeometry = new THREE.SphereGeometry(0.25, 10, 8);
  const noseGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.18);

  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.55;
  body.castShadow = true;
  primitives.add(body);

  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 1.2;
  head.castShadow = true;
  primitives.add(head);

  const nose = new THREE.Mesh(noseGeometry, headMaterial);
  nose.position.set(0, 1.2, 0.24);
  primitives.add(nose);

  // --- модель ---------------------------------------------------------------
  const modelGroup = new THREE.Group();
  modelGroup.name = 'player-model';
  modelGroup.visible = false;
  group.add(modelGroup);

  const materials = {
    jacket: createFlatMaterial(),
    skin: createFlatMaterial(),
    pants: createFlatMaterial(),
  };
  materials.jacket.color.setHex(JACKET);
  materials.skin.color.setHex(SKIN);
  materials.pants.color.setHex(PANTS);

  const limbCache = new Map<string, THREE.Mesh>();
  let disposed = false;
  retainModels();

  const loadModel = async (): Promise<void> => {
    try {
      const parts = await loadModelParts(PED_MODEL_URLS.base);
      if (disposed) return;
      for (const name of PLAYER_PARTS) {
        const part = parts.get(name);
        if (!part) continue;
        const material =
          name === 'head' ? materials.skin : name === 'torso' ? materials.jacket : name === 'arm_l' || name === 'arm_r' ? materials.jacket : materials.pants;
        const mesh = new THREE.Mesh(part.geometry, material);
        part.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
        mesh.castShadow = name === 'torso';
        modelGroup.add(mesh);
        limbCache.set(name, mesh);
      }
      if (limbCache.size === 0) return;
      primitives.visible = false;
      modelGroup.visible = true;
    } catch {
      // Остаёмся на примитивах: предупреждение выдал modelLibrary.
    }
  };

  if (!modelsDisabled()) void loadModel();

  let phase = 0;
  let lastX = 0;
  let lastZ = 0;
  let hasLast = false;

  return {
    sync(x: number, z: number, heading: number, visible: boolean): void {
      setViewFocus(x, z);
      group.visible = visible;
      group.position.set(x, 0, z);
      group.rotation.y = heading;

      // Шаг по пройденному пути: скорость не передаётся в контракте вида.
      if (hasLast) {
        phase += Math.hypot(x - lastX, z - lastZ) * STEP_RATE;
      }
      lastX = x;
      lastZ = z;
      hasLast = true;

      if (!modelGroup.visible) return;
      const legAngle = Math.sin(phase) * LEG_SWING;
      const armAngle = Math.sin(phase) * ARM_SWING;
      const leftLeg = limbCache.get('leg_l');
      const rightLeg = limbCache.get('leg_r');
      const leftArm = limbCache.get('arm_l');
      const rightArm = limbCache.get('arm_r');
      if (leftLeg) leftLeg.rotation.x = legAngle;
      if (rightLeg) rightLeg.rotation.x = -legAngle;
      if (leftArm) leftArm.rotation.x = -armAngle;
      if (rightArm) rightArm.rotation.x = armAngle;
    },
    dispose(): void {
      disposed = true;
      scene.remove(group);
      bodyGeometry.dispose();
      headGeometry.dispose();
      noseGeometry.dispose();
      bodyMaterial.dispose();
      headMaterial.dispose();
      for (const mesh of limbCache.values()) mesh.clear();
      limbCache.clear();
      materials.jacket.dispose();
      materials.skin.dispose();
      materials.pants.dispose();
      releaseModels();
    },
  };
}
