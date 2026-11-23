// ---------------------------------------------------------------------------
// M4. Маркер игрока пешком: простые примитивы (модель будет в M7).
// Две draw call'а: тело и голова. В машине маркер скрыт.
// ---------------------------------------------------------------------------

import * as THREE from 'three';

export interface PlayerView {
  sync(x: number, z: number, heading: number, visible: boolean): void;
  dispose(): void;
}

export function createPlayerView(scene: THREE.Scene): PlayerView {
  const group = new THREE.Group();
  group.name = 'player';

  const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4dabf7 });
  const headMaterial = new THREE.MeshLambertMaterial({ color: 0xf2c9a0 });
  const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.36, 1, 8);
  const headGeometry = new THREE.SphereGeometry(0.25, 10, 8);

  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.55;
  body.castShadow = true;
  group.add(body);

  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 1.2;
  head.castShadow = true;
  group.add(head);

  // Нос — маркер направления, чтобы пешеход не выглядел симметричным.
  const noseGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.18);
  const nose = new THREE.Mesh(noseGeometry, headMaterial);
  nose.position.set(0, 1.2, 0.24);
  group.add(nose);

  scene.add(group);

  return {
    sync(x: number, z: number, heading: number, visible: boolean): void {
      group.visible = visible;
      group.position.set(x, 0, z);
      group.rotation.y = heading;
    },
    dispose(): void {
      scene.remove(group);
      bodyGeometry.dispose();
      headGeometry.dispose();
      noseGeometry.dispose();
      bodyMaterial.dispose();
      headMaterial.dispose();
    },
  };
}
