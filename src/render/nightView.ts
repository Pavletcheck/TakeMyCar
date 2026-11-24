// ---------------------------------------------------------------------------
// M8. Ночной вид: фары машин и неон ориентиров.
//
// Отдельный InstancedMesh и аддитивный материал — сцена и vehicleView не
// пересоздаются (R-19). Всё включается коэффициентом night из systems/dayNight:
// днём mesh скрыт и не тратит draw calls.
// ---------------------------------------------------------------------------

import * as THREE from 'three';
import { lerp, lerpAngle } from '../core/math';
import type { VehicleState } from '../entities/vehicle';

export interface NightView {
  sync(vehicles: readonly VehicleState[], alpha: number, night: number, time: number): void;
  dispose(): void;
}

const NEON_SITES: readonly { x: number; z: number; color: number }[] = [
  { x: -50, z: 150, color: 0x4dabf7 },
  { x: 50, z: -150, color: 0xda77f2 },
  { x: 570, z: 82, color: 0x63e6be },
  { x: -350, z: 350, color: 0xffa94d },
];

export function createNightView(scene: THREE.Scene, maxVehicles: number): NightView {
  const root = new THREE.Group();
  root.name = 'night';
  scene.add(root);

  const capacity = Math.max(1, maxVehicles) * 2;
  const dummy = new THREE.Object3D();

  // --- фары ---------------------------------------------------------------
  const lightGeometry = new THREE.BoxGeometry(0.5, 0.08, 2.4);
  const lightMaterial = new THREE.MeshBasicMaterial({
    color: 0xffe3a3,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const lightMesh = new THREE.InstancedMesh(lightGeometry, lightMaterial, capacity);
  lightMesh.frustumCulled = false;
  lightMesh.renderOrder = 4;
  root.add(lightMesh);

  // --- неон ориентиров ----------------------------------------------------
  const neonGeometry = new THREE.CylinderGeometry(1.1, 1.6, 10, 8, 1, true);
  const neonMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const neonMesh = new THREE.InstancedMesh(neonGeometry, neonMaterial, NEON_SITES.length);
  neonMesh.frustumCulled = false;
  root.add(neonMesh);

  const ringGeometry = new THREE.RingGeometry(2.2, 2.9, 24);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const ringMesh = new THREE.InstancedMesh(ringGeometry, ringMaterial, NEON_SITES.length);
  ringMesh.frustumCulled = false;
  root.add(ringMesh);

  const color = new THREE.Color();
  for (let i = 0; i < NEON_SITES.length; i += 1) {
    const site = NEON_SITES[i];
    dummy.position.set(site.x, 5, site.z);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    neonMesh.setMatrixAt(i, dummy.matrix);
    neonMesh.setColorAt(i, color.setHex(site.color));

    dummy.position.set(site.x, 0.2, site.z);
    dummy.rotation.set(-Math.PI / 2, 0, 0);
    dummy.updateMatrix();
    ringMesh.setMatrixAt(i, dummy.matrix);
    ringMesh.setColorAt(i, color.setHex(site.color));
  }
  neonMesh.instanceMatrix.needsUpdate = true;
  ringMesh.instanceMatrix.needsUpdate = true;
  if (neonMesh.instanceColor) neonMesh.instanceColor.needsUpdate = true;
  if (ringMesh.instanceColor) ringMesh.instanceColor.needsUpdate = true;

  return {
    sync(vehicles: readonly VehicleState[], alpha: number, night: number, time: number): void {
      if (night <= 0.04) {
        root.visible = false;
        return;
      }
      root.visible = true;
      lightMaterial.opacity = night * 0.5;
      neonMaterial.opacity = 0.05 + night * 0.22 + Math.sin(time * 1.6) * 0.02 * night;
      ringMaterial.opacity = 0.1 + night * 0.4;

      let count = 0;
      for (let i = 0; i < vehicles.length && count + 1 < capacity; i += 1) {
        const vehicle = vehicles[i];
        if (vehicle.wrecked) continue;
        const transform = vehicle.transform;
        const x = lerp(transform.prevX, transform.x, alpha);
        const z = lerp(transform.prevZ, transform.z, alpha);
        const heading = lerpAngle(transform.prevHeading, transform.heading, alpha);
        const sin = Math.sin(heading);
        const cos = Math.cos(heading);
        const rightX = cos;
        const rightZ = -sin;
        const front = vehicle.config.length * 0.5 + 1.15;
        const side = vehicle.config.width * 0.32;
        const baseX = x + sin * front;
        const baseZ = z + cos * front;

        dummy.rotation.set(0, heading, 0);
        dummy.scale.set(1, 1, 1);

        dummy.position.set(baseX + rightX * side, 0.6, baseZ + rightZ * side);
        dummy.updateMatrix();
        lightMesh.setMatrixAt(count, dummy.matrix);
        count += 1;

        dummy.position.set(baseX - rightX * side, 0.6, baseZ - rightZ * side);
        dummy.updateMatrix();
        lightMesh.setMatrixAt(count, dummy.matrix);
        count += 1;
      }
      lightMesh.count = count;
      lightMesh.instanceMatrix.needsUpdate = true;
    },
    dispose(): void {
      scene.remove(root);
      lightGeometry.dispose();
      lightMaterial.dispose();
      neonGeometry.dispose();
      neonMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
    },
  };
}
