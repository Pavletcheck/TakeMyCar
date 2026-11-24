// ---------------------------------------------------------------------------
// M7. Визуал пешеходов и копов: low-poly модель по частям, инстансинг.
//
// Зачем по частям: скиннинг на 200 NPC — это 200 draw calls, поэтому частая
// геометрия (торс/голова/руки/ноги) рисуется отдельными InstancedMesh, а шаг,
// покачивание и падение считаются матрицами в коде. Пивоты рук и ног пришли
// из Blender (узел GLB), поэтому «сустав» крутится вокруг плеча/бедра.
//
// LOD: дальше NPC_LOD_DISTANCE рисуется упрощённый силуэт (far_body/far_head,
// 36 tris вместо 532) — бюджет tris не зависит от населения.
// Fallback на цилиндр+сферу M5, если GLB не загрузился или `?models=0`.
// ---------------------------------------------------------------------------

import * as THREE from 'three';
import type { NpcState } from '../entities/npc';
import {
  PED_MODEL_URLS,
  createFlatMaterial,
  createPartInstances,
  loadModelParts,
  modelsDisabled,
  releaseModels,
  retainModels,
} from './modelLibrary';
import type { ModelParts } from './modelLibrary';
import { focusDistanceSq } from './viewFocus';

const MAX_NPCS = 240;
const BODY_Y = 0.55;
const HEAD_Y = 1.18;
const DOWN_BODY_Y = 0.22;
const DOWN_HEAD_Y = 0.3;
const DOWN_ROOT_Y = 0.14;
/** Дальше этого расстояния NPC рисуется упрощённым силуэтом. */
const NPC_LOD_DISTANCE = 32;
const NPC_LOD_DISTANCE_SQ = NPC_LOD_DISTANCE * NPC_LOD_DISTANCE;
/** Амплитуда шага, рад. */
const LEG_SWING = 0.62;
const ARM_SWING = 0.45;
const STEP_RATE = 5.2;

/** Палитра одежды пешеходов (7 вариантов). */
const PED_COLORS = [0x4dabf7, 0xffd43b, 0x51cf66, 0xff8787, 0xb197fc, 0xf783ac, 0xced4da];
const PED_PANTS = [0x2c3e50, 0x343a40, 0x3b3f46, 0x4a4238, 0x2b3a4a];
const SKIN_COLORS = [0xf2c9a0, 0xe0ac82, 0xc68642, 0x8d5524, 0xffdbac];
const COP_COLOR = 0x2b4a8b;
const COP_HEAD = 0xf2c9a0;
const PED_HEAD = 0xf2c9a0;
/** Части модели, которые рисуются в LOD0 и LOD1. */
const LOD0_PARTS = ['torso', 'head', 'arm_l', 'arm_r', 'leg_l', 'leg_r'] as const;
const LOD1_PARTS = ['far_body', 'far_head'] as const;

export interface NpcViewStats {
  peds: number;
  cops: number;
  down: number;
  /** Сколько NPC нарисовано моделями (остальные — примитивами). */
  models: number;
  /** Сколько NPC на упрощённом силуэте. */
  lod1: number;
}

export interface NpcView {
  /** Синхронизировать инстансы с пулами NPC. dt нужен для покачивания. */
  sync(
    peds: readonly NpcState[],
    cops: readonly NpcState[],
    alpha: number,
    dt: number,
  ): void;
  readonly stats: NpcViewStats;
  dispose(): void;
}

function normalizeAngle(angle: number): number {
  let result = angle % (Math.PI * 2);
  if (result > Math.PI) result -= Math.PI * 2;
  else if (result < -Math.PI) result += Math.PI * 2;
  return result;
}

interface PartBatch {
  readonly mesh: THREE.InstancedMesh;
  readonly matrix: THREE.Matrix4;
  count: number;
}

interface CharRig {
  readonly parts: Map<string, PartBatch>;
  /** true — цвета из instanceColor (база), false — запечены в GLB (коп). */
  readonly tinted: boolean;
}

export function createNpcView(scene: THREE.Scene): NpcView {
  const root = new THREE.Group();
  root.name = 'npcs';
  scene.add(root);

  const modelGroup = new THREE.Group();
  modelGroup.name = 'npc-models';
  root.add(modelGroup);

  // --- fallback-примитивы (M5) ---------------------------------------------
  const bodyGeometry = new THREE.CylinderGeometry(0.26, 0.32, 0.9, 6);
  const headGeometry = new THREE.SphereGeometry(0.21, 8, 6);
  const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

  const bodyMesh = new THREE.InstancedMesh(bodyGeometry, bodyMaterial, MAX_NPCS);
  const headMesh = new THREE.InstancedMesh(headGeometry, headMaterial, MAX_NPCS);
  bodyMesh.castShadow = true;
  headMesh.castShadow = false;
  for (const mesh of [bodyMesh, headMesh]) {
    mesh.frustumCulled = false;
    root.add(mesh);
  }

  // --- модель персонажа ----------------------------------------------------
  const modelMaterial = createFlatMaterial();
  const rigs: { base: CharRig | null; cop: CharRig | null } = { base: null, cop: null };
  let disposed = false;
  retainModels();

  const createRig = (parts: ModelParts, tinted: boolean): CharRig | null => {
    const batches = new Map<string, PartBatch>();
    for (const name of [...LOD0_PARTS, ...LOD1_PARTS]) {
      const part = parts.get(name);
      if (!part) continue;
      const mesh = createPartInstances(part, modelMaterial, MAX_NPCS);
      mesh.castShadow = name === 'torso' || name === 'far_body';
      modelGroup.add(mesh);
      batches.set(name, { mesh, matrix: part.matrix, count: 0 });
    }
    if (!batches.has('torso') || !batches.has('far_body')) return null;
    return { parts: batches, tinted };
  };

  const loadCharacters = async (): Promise<void> => {
    try {
      const base = await loadModelParts(PED_MODEL_URLS.base);
      if (disposed) return;
      rigs.base = createRig(base, true);
    } catch {
      // Fallback на примитивы: предупреждение уже выдал modelLibrary.
    }
    try {
      const cop = await loadModelParts(PED_MODEL_URLS.cop);
      if (disposed) return;
      rigs.cop = createRig(cop, false);
    } catch {
      // Копы останутся на примитивах, пешеходы — на модели (FAL-04).
    }
  };

  if (!modelsDisabled()) void loadCharacters();

  const dummy = new THREE.Object3D();
  const partMatrix = new THREE.Matrix4();
  const swingMatrix = new THREE.Matrix4();
  const color = new THREE.Color();
  const stats: NpcViewStats = { peds: 0, cops: 0, down: 0, models: 0, lod1: 0 };
  /** Фаза покачивания на NPC: без покачивания толпа выглядит «замороженной». */
  const bob = new WeakMap<NpcState, number>();

  const pushPart = (batch: PartBatch, matrix: THREE.Matrix4, tint?: number): void => {
    const index = batch.count;
    if (index >= MAX_NPCS) return;
    batch.mesh.setMatrixAt(index, matrix);
    if (tint !== undefined) batch.mesh.setColorAt(index, color.setHex(tint));
    batch.count = index + 1;
  };

  /** Модель NPC: корень (позиция/поворот/наклон) × пивот части × шаг. */
  const writeModel = (
    rig: CharRig,
    npc: NpcState,
    x: number,
    z: number,
    heading: number,
    lean: number,
    swing: number,
    down: boolean,
    far: boolean,
  ): void => {
    dummy.position.set(x, down ? DOWN_ROOT_Y : 0, z);
    // YXZ: сначала рыскание по heading, затем наклон вокруг локальной оси X.
    dummy.rotation.set(down ? Math.PI / 2 : lean, heading, 0, 'YXZ');
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();

    const variant = npc.variant % PED_COLORS.length;
    const jacket = npc.kind === 'cop' ? COP_COLOR : PED_COLORS[variant];
    const pants = PED_PANTS[variant % PED_PANTS.length];
    const skin = SKIN_COLORS[variant % SKIN_COLORS.length];

    const names = far ? LOD1_PARTS : LOD0_PARTS;
    const legAngle = down ? 0 : Math.sin(swing) * LEG_SWING;
    const armAngle = down ? 0 : Math.sin(swing) * ARM_SWING;
    for (const name of names) {
      const batch = rig.parts.get(name);
      if (!batch) continue;
      let angle = 0;
      if (name === 'leg_l') angle = legAngle;
      else if (name === 'leg_r') angle = -legAngle;
      else if (name === 'arm_l') angle = -armAngle;
      else if (name === 'arm_r') angle = armAngle;
      partMatrix.multiplyMatrices(dummy.matrix, batch.matrix);
      if (angle !== 0) {
        swingMatrix.makeRotationX(angle);
        partMatrix.multiply(swingMatrix);
      }
      let tint: number | undefined;
      if (rig.tinted) {
        if (name === 'head' || name === 'far_head') tint = skin;
        else if (name === 'leg_l' || name === 'leg_r') tint = pants;
        else tint = jacket;
      }
      pushPart(batch, partMatrix, tint);
    }
  };

  /** Примитивы M5: цилиндр-тело и сфера-голова. */
  const writeFallback = (
    npc: NpcState,
    x: number,
    z: number,
    heading: number,
    lean: number,
    index: number,
    down: boolean,
  ): void => {
    if (down) {
      dummy.position.set(x, DOWN_BODY_Y, z);
      dummy.rotation.set(Math.PI / 2, heading, 0);
      dummy.scale.set(1, 1, 1);
    } else {
      dummy.position.set(x, BODY_Y, z);
      dummy.rotation.set(lean, heading, 0);
      dummy.scale.set(1, 1, 1);
    }
    dummy.updateMatrix();
    bodyMesh.setMatrixAt(index, dummy.matrix);
    color.setHex(npc.kind === 'cop' ? COP_COLOR : PED_COLORS[npc.variant % PED_COLORS.length]);
    bodyMesh.setColorAt(index, color);

    if (down) {
      dummy.position.set(x, DOWN_HEAD_Y, z);
      dummy.rotation.set(Math.PI / 2, heading, 0);
    } else {
      dummy.position.set(x, HEAD_Y - Math.abs(lean) * 0.3, z);
      dummy.rotation.set(0, heading, 0);
    }
    dummy.updateMatrix();
    headMesh.setMatrixAt(index, dummy.matrix);
    color.setHex(npc.kind === 'cop' ? COP_HEAD : PED_HEAD);
    headMesh.setColorAt(index, color);
  };

  const sync = (
    peds: readonly NpcState[],
    cops: readonly NpcState[],
    alpha: number,
    dt: number,
  ): void => {
    for (const rig of [rigs.base, rigs.cop]) {
      if (!rig) continue;
      for (const batch of rig.parts.values()) batch.count = 0;
    }

    let count = 0;
    let down = 0;
    let modelCount = 0;
    let lod1Count = 0;
    let fallbackCount = 0;

    const writeOne = (npc: NpcState): void => {
      const transform = npc.transform;
      const x = transform.prevX + (transform.x - transform.prevX) * alpha;
      const z = transform.prevZ + (transform.z - transform.prevZ) * alpha;
      const heading =
        transform.prevHeading + normalizeAngle(transform.heading - transform.prevHeading) * alpha;
      const isDown = npc.state === 'down';
      const moving = npc.speed > 0.1 && !isDown;
      let swing = bob.get(npc) ?? 0;
      if (moving) swing += npc.speed * STEP_RATE * dt;
      bob.set(npc, swing);
      const lean = isDown ? 0 : Math.sin(swing) * 0.06;

      const rig = npc.kind === 'cop' ? rigs.cop : rigs.base;
      if (rig) {
        const far = focusDistanceSq(x, z) > NPC_LOD_DISTANCE_SQ;
        writeModel(rig, npc, x, z, heading, lean, swing, isDown, far);
        modelCount += 1;
        if (far) lod1Count += 1;
      } else {
        writeFallback(npc, x, z, heading, lean, fallbackCount, isDown);
        fallbackCount += 1;
      }
      if (isDown) down += 1;
    };

    let pedCount = 0;
    for (let i = 0; i < peds.length && count < MAX_NPCS; i += 1) {
      writeOne(peds[i]);
      pedCount += 1;
      count += 1;
    }
    for (let i = 0; i < cops.length && count < MAX_NPCS; i += 1) {
      writeOne(cops[i]);
      count += 1;
    }

    bodyMesh.count = fallbackCount;
    headMesh.count = fallbackCount;
    if (fallbackCount > 0) {
      bodyMesh.instanceMatrix.needsUpdate = true;
      headMesh.instanceMatrix.needsUpdate = true;
      if (bodyMesh.instanceColor) bodyMesh.instanceColor.needsUpdate = true;
      if (headMesh.instanceColor) headMesh.instanceColor.needsUpdate = true;
    }

    for (const rig of [rigs.base, rigs.cop]) {
      if (!rig) continue;
      for (const batch of rig.parts.values()) {
        batch.mesh.count = batch.count;
        if (batch.count > 0) {
          batch.mesh.instanceMatrix.needsUpdate = true;
          if (batch.mesh.instanceColor) batch.mesh.instanceColor.needsUpdate = true;
        }
      }
    }

    stats.peds = pedCount;
    stats.cops = count - pedCount;
    stats.down = down;
    stats.models = modelCount;
    stats.lod1 = lod1Count;
  };

  return {
    sync,
    stats,
    dispose(): void {
      disposed = true;
      scene.remove(root);
      for (const rig of [rigs.base, rigs.cop]) {
        if (!rig) continue;
        for (const batch of rig.parts.values()) {
          modelGroup.remove(batch.mesh);
          batch.mesh.dispose();
        }
      }
      rigs.base = null;
      rigs.cop = null;
      modelMaterial.dispose();
      releaseModels();
      bodyGeometry.dispose();
      headGeometry.dispose();
      bodyMaterial.dispose();
      headMaterial.dispose();
      bodyMesh.dispose();
      headMesh.dispose();
    },
  };
}
