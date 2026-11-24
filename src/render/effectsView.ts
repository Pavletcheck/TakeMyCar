// ---------------------------------------------------------------------------
// M5. Эффекты выстрелов: трассер, искры, вспышка.
//
// Никаких файлов и постобработки: три InstancedMesh и кольцевые пулы.
// Контент 12+: вспышка дула, короткий трассер, искры/пыль на попадании.
// Крови нет — попадание по NPC даёт нейтральную пыль.
//
// Модуль только читает вызовы систем (combat.onShot/onImpact) и ничего
// не знает про игровую логику.
// ---------------------------------------------------------------------------

import * as THREE from 'three';
import type { HitKind } from '../systems/combat';

const MAX_TRACERS = 48;
const MAX_SPARKS = 160;
const TRACER_Y = 1.0;
const TRACER_WIDTH = 0.09;

const TRACER_COLOR = 0xffe08a;
const SPARK_KINDS: readonly HitKind[] = ['none', 'world', 'vehicle', 'npc'];
const SPARK_COLORS: Readonly<Record<HitKind, number>> = {
  none: 0x9aa4b2,
  world: 0xd9c48a,
  vehicle: 0xffc078,
  npc: 0xd8dee9,
};

export interface EffectsViewStats {
  tracers: number;
  sparks: number;
}

export interface EffectsView {
  /** Трассер от дула до точки попадания. */
  tracer(x1: number, z1: number, x2: number, z2: number, hit: HitKind): void;
  /** Искры/пыль на попадании. */
  impact(x: number, z: number, hit: HitKind): void;
  /** Кадр: движение частиц и сборка инстансов. */
  sync(dt: number): void;
  readonly stats: EffectsViewStats;
  dispose(): void;
}

export function createEffectsView(scene: THREE.Scene): EffectsView {
  const root = new THREE.Group();
  root.name = 'effects';
  scene.add(root);

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const tracerMaterial = new THREE.MeshBasicMaterial({
    color: TRACER_COLOR,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  const sparkMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, depthWrite: false });

  const tracerMesh = new THREE.InstancedMesh(boxGeometry, tracerMaterial, MAX_TRACERS);
  const sparkMesh = new THREE.InstancedMesh(boxGeometry, sparkMaterial, MAX_SPARKS);
  for (const mesh of [tracerMesh, sparkMesh]) {
    mesh.frustumCulled = false;
    root.add(mesh);
  }

  // --- трассеры: кольцевой буфер ------------------------------------------
  const tracerX = new Float32Array(MAX_TRACERS);
  const tracerZ = new Float32Array(MAX_TRACERS);
  const tracerAngle = new Float32Array(MAX_TRACERS);
  const tracerLength = new Float32Array(MAX_TRACERS);
  const tracerLife = new Float32Array(MAX_TRACERS);
  const tracerMaxLife = new Float32Array(MAX_TRACERS);
  let tracerHead = 0;
  let tracerAlive = 0;

  // --- искры: кольцевой буфер ---------------------------------------------
  const sparkX = new Float32Array(MAX_SPARKS);
  const sparkY = new Float32Array(MAX_SPARKS);
  const sparkZ = new Float32Array(MAX_SPARKS);
  const sparkVx = new Float32Array(MAX_SPARKS);
  const sparkVy = new Float32Array(MAX_SPARKS);
  const sparkVz = new Float32Array(MAX_SPARKS);
  const sparkLife = new Float32Array(MAX_SPARKS);
  const sparkMaxLife = new Float32Array(MAX_SPARKS);
  const sparkSize = new Float32Array(MAX_SPARKS);
  const sparkKind = new Uint8Array(MAX_SPARKS);
  let sparkHead = 0;

  let seed = 0x2f6bff;
  const random = (): number => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  const stats: EffectsViewStats = { tracers: 0, sparks: 0 };

  const tracer = (x1: number, z1: number, x2: number, z2: number, hit: HitKind): void => {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const length = Math.hypot(dx, dz);
    if (length < 0.05) return;
    const index = tracerHead;
    tracerHead = (tracerHead + 1) % MAX_TRACERS;
    tracerX[index] = (x1 + x2) * 0.5;
    tracerZ[index] = (z1 + z2) * 0.5;
    tracerAngle[index] = Math.atan2(dx, dz);
    tracerLength[index] = length;
    tracerLife[index] = 0.06;
    tracerMaxLife[index] = 0.06;
    if (tracerAlive < MAX_TRACERS) tracerAlive += 1;
    if (hit !== 'none') {
      spark(x2, z2, hit, 3);
    }
    // Вспышка дула: короткая искра у ствола.
    spark(x1, z1, 'none', 1);
  };

  const spark = (x: number, z: number, hit: HitKind, count: number): void => {
    for (let i = 0; i < count; i += 1) {
      const index = sparkHead;
      sparkHead = (sparkHead + 1) % MAX_SPARKS;
      sparkX[index] = x;
      sparkY[index] = TRACER_Y - 0.2;
      sparkZ[index] = z;
      sparkVx[index] = (random() - 0.5) * 3.2;
      sparkVy[index] = 1 + random() * 2.4;
      sparkVz[index] = (random() - 0.5) * 3.2;
      sparkLife[index] = 0.18 + random() * 0.16;
      sparkMaxLife[index] = sparkLife[index];
      sparkSize[index] = hit === 'none' ? 0.1 : 0.07 + random() * 0.08;
      sparkKind[index] = SPARK_KINDS.indexOf(hit);
    }
  };

  const impact = (x: number, z: number, hit: HitKind): void => {
    spark(x, z, hit, hit === 'vehicle' ? 4 : 3);
  };

  const sync = (dt: number): void => {
    // --- трассеры ----------------------------------------------------------
    let tracerCount = 0;
    for (let i = 0; i < MAX_TRACERS; i += 1) {
      let life = tracerLife[i];
      if (life <= 0) continue;
      life -= dt;
      if (life <= 0) {
        tracerLife[i] = 0;
        tracerAlive = Math.max(0, tracerAlive - 1);
        continue;
      }
      tracerLife[i] = life;
      dummy.position.set(tracerX[i], TRACER_Y, tracerZ[i]);
      dummy.rotation.set(0, tracerAngle[i], 0);
      dummy.scale.set(TRACER_WIDTH, TRACER_WIDTH, tracerLength[i]);
      dummy.updateMatrix();
      tracerMesh.setMatrixAt(tracerCount, dummy.matrix);
      tracerCount += 1;
    }
    tracerMesh.count = tracerCount;
    tracerMesh.instanceMatrix.needsUpdate = true;

    // --- искры -------------------------------------------------------------
    let sparkCount = 0;
    for (let i = 0; i < MAX_SPARKS; i += 1) {
      let life = sparkLife[i];
      if (life <= 0) continue;
      life -= dt;
      if (life <= 0) {
        sparkLife[i] = 0;
        continue;
      }
      sparkLife[i] = life;
      sparkVy[i] -= 9.8 * dt;
      sparkX[i] += sparkVx[i] * dt;
      sparkY[i] += sparkVy[i] * dt;
      sparkZ[i] += sparkVz[i] * dt;
      if (sparkY[i] < 0.05) {
        sparkY[i] = 0.05;
        sparkVy[i] = 0;
      }
      const scale = sparkSize[i] * (0.6 + (life / sparkMaxLife[i]) * 1.2);
      dummy.position.set(sparkX[i], sparkY[i], sparkZ[i]);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      sparkMesh.setMatrixAt(sparkCount, dummy.matrix);
      color.setHex(SPARK_COLORS[SPARK_KINDS[sparkKind[i]]]);
      sparkMesh.setColorAt(sparkCount, color);
      sparkCount += 1;
    }
    sparkMesh.count = sparkCount;
    sparkMesh.instanceMatrix.needsUpdate = true;
    if (sparkMesh.instanceColor) sparkMesh.instanceColor.needsUpdate = true;

    stats.tracers = tracerCount;
    stats.sparks = sparkCount;
  };

  return {
    tracer,
    impact,
    sync,
    stats,
    dispose(): void {
      scene.remove(root);
      boxGeometry.dispose();
      tracerMaterial.dispose();
      sparkMaterial.dispose();
    },
  };
}
