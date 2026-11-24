// ---------------------------------------------------------------------------
// M8. Вид коллекций: пакеты, трамплины и маяки уникальных машин.
//
// Всё — примитивы и InstancedMesh: без новых GLB и текстур. Пакеты крутятся
// и исчезают после подбора, трамплины стоят статикой, у машин — вертикальный
// луч, чтобы их было видно с камеры сверху. Вертикальной физики нет: «полёт»
// с трамплина — триггер systems/collectibles (R-12).
// ---------------------------------------------------------------------------

import * as THREE from 'three';
import type { RampDef, WorldPoint } from '../config/collectibles';

export interface CarBeaconSource {
  readonly x: number;
  readonly z: number;
  readonly vehicleId: number;
}

export interface LifePropsView {
  /** Кадр: время для анимации, ночь 0..1, маски подобранного, машины. */
  sync(
    time: number,
    night: number,
    packageTaken: Uint8Array,
    rampTaken: Uint8Array,
    cars: readonly CarBeaconSource[],
  ): void;
  dispose(): void;
}

const PACKAGE_COLOR = 0xffd43b;
const PACKAGE_SIZE = 0.52;
const RAMP_COLOR = 0xffa94d;
const RAMP_WIDTH = 4.2;
const RAMP_LENGTH = 7;
const RAMP_HEIGHT = 1.15;
const BEAM_COLOR = 0x63e6be;

export function createLifePropsView(
  scene: THREE.Scene,
  packages: readonly WorldPoint[],
  ramps: readonly RampDef[],
): LifePropsView {
  const root = new THREE.Group();
  root.name = 'life-props';
  scene.add(root);

  const dummy = new THREE.Object3D();

  // --- пакеты -------------------------------------------------------------
  const packageGeometry = new THREE.BoxGeometry(PACKAGE_SIZE, PACKAGE_SIZE, PACKAGE_SIZE);
  const packageMaterial = new THREE.MeshBasicMaterial({ color: PACKAGE_COLOR });
  const packageMesh = new THREE.InstancedMesh(packageGeometry, packageMaterial, Math.max(1, packages.length));
  packageMesh.frustumCulled = false;
  packageMesh.renderOrder = 3;
  root.add(packageMesh);

  // --- трамплины ----------------------------------------------------------
  const rampGeometry = new THREE.BoxGeometry(RAMP_WIDTH, 0.3, RAMP_LENGTH);
  const rampMaterial = new THREE.MeshLambertMaterial({ color: RAMP_COLOR });
  const rampMesh = new THREE.InstancedMesh(rampGeometry, rampMaterial, Math.max(1, ramps.length));
  rampMesh.frustumCulled = false;
  rampMesh.receiveShadow = true;
  root.add(rampMesh);

  const rampGlowGeometry = new THREE.BoxGeometry(RAMP_WIDTH * 0.82, 0.08, 0.5);
  const rampGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffe08a,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  const rampGlowMesh = new THREE.InstancedMesh(rampGlowGeometry, rampGlowMaterial, Math.max(1, ramps.length));
  rampGlowMesh.frustumCulled = false;
  root.add(rampGlowMesh);

  for (let i = 0; i < ramps.length; i += 1) {
    const ramp = ramps[i];
    dummy.position.set(ramp.x, RAMP_HEIGHT * 0.5, ramp.z);
    dummy.rotation.set(-0.16, ramp.heading, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    rampMesh.setMatrixAt(i, dummy.matrix);

    // Светящаяся кромка на дальнем (высоком) краю рампы.
    const sin = Math.sin(ramp.heading);
    const cos = Math.cos(ramp.heading);
    dummy.position.set(ramp.x + sin * (RAMP_LENGTH * 0.5 - 0.4), RAMP_HEIGHT, ramp.z + cos * (RAMP_LENGTH * 0.5 - 0.4));
    dummy.rotation.set(0, ramp.heading, 0);
    dummy.updateMatrix();
    rampGlowMesh.setMatrixAt(i, dummy.matrix);
  }
  rampMesh.instanceMatrix.needsUpdate = true;
  rampGlowMesh.instanceMatrix.needsUpdate = true;

  // --- маяки уникальных машин --------------------------------------------
  const beamGeometry = new THREE.CylinderGeometry(0.55, 0.9, 6, 8, 1, true);
  const beamMaterial = new THREE.MeshBasicMaterial({
    color: BEAM_COLOR,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const beamMesh = new THREE.InstancedMesh(beamGeometry, beamMaterial, 8);
  beamMesh.frustumCulled = false;
  root.add(beamMesh);

  const ringGeometry = new THREE.RingGeometry(1.4, 1.9, 20);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: BEAM_COLOR,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const ringMesh = new THREE.InstancedMesh(ringGeometry, ringMaterial, 8);
  ringMesh.frustumCulled = false;
  root.add(ringMesh);

  return {
    sync(time: number, night: number, packageTaken: Uint8Array, _rampTaken: Uint8Array, cars: readonly CarBeaconSource[]): void {
      // Пакеты: вращение + масштаб 0 для подобранных.
      for (let i = 0; i < packages.length; i += 1) {
        const point = packages[i];
        const taken = packageTaken[i] === 1;
        dummy.position.set(point.x, 0.7 + Math.sin(time * 2 + i) * 0.08, point.z);
        dummy.rotation.set(0, time * 1.6 + i * 0.7, 0);
        const scale = taken ? 0 : 1;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        packageMesh.setMatrixAt(i, dummy.matrix);
      }
      packageMesh.instanceMatrix.needsUpdate = true;
      packageMesh.count = packages.length;

      // Трамплины светятся сильнее ночью.
      rampGlowMaterial.opacity = 0.5 + night * 0.45 + Math.sin(time * 3) * 0.06;
      rampMaterial.color.setHex(RAMP_COLOR);
      rampMaterial.emissive?.setHex(night > 0.5 ? 0x3a2408 : 0x000000);

      // Маяки машин: есть машина и она не сдана.
      let count = 0;
      for (let i = 0; i < cars.length && count < 8; i += 1) {
        const car = cars[i];
        if (car.vehicleId < 0) continue;
        const lift = Math.sin(time * 2 + i) * 0.15;
        dummy.position.set(car.x, 3.4 + lift, car.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        beamMesh.setMatrixAt(count, dummy.matrix);

        dummy.position.set(car.x, 0.16, car.z);
        dummy.rotation.set(-Math.PI / 2, 0, 0);
        const pulse = 1 + Math.sin(time * 3 + i) * 0.12;
        dummy.scale.set(pulse, pulse, pulse);
        dummy.updateMatrix();
        ringMesh.setMatrixAt(count, dummy.matrix);
        count += 1;
      }
      beamMesh.count = count;
      ringMesh.count = count;
      beamMesh.instanceMatrix.needsUpdate = true;
      ringMesh.instanceMatrix.needsUpdate = true;
      beamMaterial.opacity = 0.16 + night * 0.24;
      ringMaterial.opacity = 0.45 + Math.sin(time * 3) * 0.12;
    },
    dispose(): void {
      scene.remove(root);
      packageGeometry.dispose();
      packageMaterial.dispose();
      rampGeometry.dispose();
      rampMaterial.dispose();
      rampGlowGeometry.dispose();
      rampGlowMaterial.dispose();
      beamGeometry.dispose();
      beamMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
    },
  };
}
