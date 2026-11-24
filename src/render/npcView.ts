// ---------------------------------------------------------------------------
// M5. Визуал пешеходов и копов пешком.
//
// Два InstancedMesh на всех NPC: тело-цилиндр и голова. Цвет одежды — через
// instanceColor (вариант из конфига), копы получают синюю форму. Падение —
// наклон тела на 90° и посадка к земле, без ragdoll и крови.
//
// Рендер только читает состояние: никакой логики и записи в registry.
// ---------------------------------------------------------------------------

import * as THREE from 'three';
import type { NpcState } from '../entities/npc';

const MAX_NPCS = 240;
const BODY_Y = 0.55;
const HEAD_Y = 1.18;
const DOWN_BODY_Y = 0.22;
const DOWN_HEAD_Y = 0.3;

/** Палитра одежды пешеходов (7 вариантов). */
const PED_COLORS = [0x4dabf7, 0xffd43b, 0x51cf66, 0xff8787, 0xb197fc, 0xf783ac, 0xced4da];
const COP_COLOR = 0x2b4a8b;
const COP_HEAD = 0xf2c9a0;
const PED_HEAD = 0xf2c9a0;

export interface NpcViewStats {
  peds: number;
  cops: number;
  down: number;
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

export function createNpcView(scene: THREE.Scene): NpcView {
  const root = new THREE.Group();
  root.name = 'npcs';
  scene.add(root);

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

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  const stats: NpcViewStats = { peds: 0, cops: 0, down: 0 };
  /** Фаза покачивания на NPC: без покачивания толпа выглядит «замороженной». */
  const bob = new WeakMap<NpcState, number>();

  const writeOne = (npc: NpcState, index: number, alpha: number): void => {
    const transform = npc.transform;
    const x = transform.prevX + (transform.x - transform.prevX) * alpha;
    const z = transform.prevZ + (transform.z - transform.prevZ) * alpha;
    const heading =
      transform.prevHeading + normalizeAngle(transform.heading - transform.prevHeading) * alpha;
    const down = npc.state === 'down';
    const moving = npc.speed > 0.1 && !down;
    let swing = bob.get(npc) ?? 0;
    swing += moving ? npc.speed * 0.09 : 0;
    bob.set(npc, swing);
    const lean = Math.sin(swing) * 0.06;

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
    void dt;
    let count = 0;
    let down = 0;
    for (let i = 0; i < peds.length && count < MAX_NPCS; i += 1) {
      const npc = peds[i];
      writeOne(npc, count, alpha);
      if (npc.state === 'down') down += 1;
      count += 1;
    }
    const pedCount = count;
    for (let i = 0; i < cops.length && count < MAX_NPCS; i += 1) {
      const npc = cops[i];
      writeOne(npc, count, alpha);
      if (npc.state === 'down') down += 1;
      count += 1;
    }

    bodyMesh.count = count;
    headMesh.count = count;
    bodyMesh.instanceMatrix.needsUpdate = true;
    headMesh.instanceMatrix.needsUpdate = true;
    if (bodyMesh.instanceColor) bodyMesh.instanceColor.needsUpdate = true;
    if (headMesh.instanceColor) headMesh.instanceColor.needsUpdate = true;

    stats.peds = pedCount;
    stats.cops = count - pedCount;
    stats.down = down;
  };

  return {
    sync,
    stats,
    dispose(): void {
      scene.remove(root);
      bodyGeometry.dispose();
      headGeometry.dispose();
      bodyMaterial.dispose();
      headMaterial.dispose();
    },
  };
}
