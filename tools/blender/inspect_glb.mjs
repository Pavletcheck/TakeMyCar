/**
 * Инспектор GLB TakeMyCar: tris, габариты, пивот, материалы, узлы.
 *
 * Читает только JSON-чанк контейнера (без зависимостей и без Blender):
 *   node tools/blender/inspect_glb.mjs assets/models/car_sedan_lod0.glb
 *   node tools/blender/inspect_glb.mjs --all assets/models
 *
 * Проверяет соглашения M7: 1 unit = 1 м, пивот по центру X/Z, низ на y = 0,
 * материал один, текстуры не используются, у машин нос смотрит в +Z.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** Эталонные габариты машин из src/config/vehicles.ts (length, width, height). */
const CAR_SIZES = {
  sedan: [4.4, 1.9, 1.35],
  sports: [4.3, 1.95, 1.12],
  van: [5.2, 2.1, 2.1],
  truck: [7.0, 2.4, 2.6],
  police: [4.6, 1.95, 1.42],
};

function readGlb(path) {
  const buffer = readFileSync(path);
  if (buffer.readUInt32LE(0) !== 0x46546c67) throw new Error(`${path}: не GLB`);
  const jsonLength = buffer.readUInt32LE(12);
  return JSON.parse(buffer.subarray(20, 20 + jsonLength).toString('utf8'));
}

// --- минимальная матричная математика (column-major, как в glTF) ------------

function identity() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

function multiply(a, b) {
  const out = new Array(16).fill(0);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      let sum = 0;
      for (let k = 0; k < 4; k += 1) sum += a[k * 4 + row] * b[column * 4 + k];
      out[column * 4 + row] = sum;
    }
  }
  return out;
}

function nodeMatrix(node) {
  if (node.matrix) return node.matrix;
  const [tx, ty, tz] = node.translation ?? [0, 0, 0];
  const [qx, qy, qz, qw] = node.rotation ?? [0, 0, 0, 1];
  const [sx, sy, sz] = node.scale ?? [1, 1, 1];
  const x2 = qx + qx;
  const y2 = qy + qy;
  const z2 = qz + qz;
  const xx = qx * x2;
  const xy = qx * y2;
  const xz = qx * z2;
  const yy = qy * y2;
  const yz = qy * z2;
  const zz = qz * z2;
  const wx = qw * x2;
  const wy = qw * y2;
  const wz = qw * z2;
  return [
    (1 - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0,
    (xy - wz) * sy, (1 - (xx + zz)) * sy, (yz + wx) * sy, 0,
    (xz + wy) * sz, (yz - wx) * sz, (1 - (xx + yy)) * sz, 0,
    tx, ty, tz, 1,
  ];
}

function transformPoint(matrix, x, y, z) {
  return [
    matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12],
    matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13],
    matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14],
  ];
}

/** Обойти граф узлов и вернуть список пар «узел → мировая матрица». */
function walkNodes(gltf) {
  const result = [];
  const nodes = gltf.nodes ?? [];
  const visit = (index, parent) => {
    const node = nodes[index];
    if (!node) return;
    const world = multiply(parent, nodeMatrix(node));
    result.push({ node, world });
    for (const child of node.children ?? []) visit(child, world);
  };
  const scene = gltf.scenes?.[gltf.scene ?? 0];
  for (const root of scene?.nodes ?? nodes.map((_, index) => index).filter((index) => !nodes.some((node) => (node.children ?? []).includes(index)))) {
    visit(root, identity());
  }
  return result;
}

function inspect(path) {
  const gltf = readGlb(path);
  let tris = 0;
  const mins = [Infinity, Infinity, Infinity];
  const maxs = [-Infinity, -Infinity, -Infinity];

  for (const entry of walkNodes(gltf)) {
    const meshIndex = entry.node.mesh;
    if (meshIndex === undefined) continue;
    for (const primitive of gltf.meshes[meshIndex].primitives) {
      const accessor = gltf.accessors[primitive.indices ?? primitive.attributes.POSITION];
      tris += (primitive.mode === undefined || primitive.mode === 4 ? accessor.count : 0) / 3;
      const position = gltf.accessors[primitive.attributes.POSITION];
      // bbox примитива в локальных осях → 8 углов → мировые оси (консервативно).
      for (let corner = 0; corner < 8; corner += 1) {
        const local = [
          corner & 1 ? position.max[0] : position.min[0],
          corner & 2 ? position.max[1] : position.min[1],
          corner & 4 ? position.max[2] : position.min[2],
        ];
        const world = transformPoint(entry.world, local[0], local[1], local[2]);
        for (let axis = 0; axis < 3; axis += 1) {
          mins[axis] = Math.min(mins[axis], world[axis]);
          maxs[axis] = Math.max(maxs[axis], world[axis]);
        }
      }
    }
  }

  const size = maxs.map((value, axis) => value - mins[axis]);
  const center = maxs.map((value, axis) => (value + mins[axis]) / 2);
  const nodes = gltf.nodes ?? [];
  const name = path.split(/[\\/]/).pop();
  const warnings = [];

  if ((gltf.materials ?? []).length > 2) warnings.push(`материалов ${gltf.materials.length} > 2`);
  if ((gltf.images ?? []).length > 0) warnings.push('в GLB есть текстуры');
  if ((gltf.skins ?? []).length > 0) warnings.push('скиннинг не используется в игре');

  const round = (value) => Math.round(value * 1000) / 1000;
  const info = {
    file: name,
    tris,
    nodes: nodes.map((node) => node.name ?? '(без имени)'),
    size: size.map(round),
    center: center.map(round),
    min: mins.map(round),
    max: maxs.map(round),
    materials: (gltf.materials ?? []).map((material) => material.name ?? '(без имени)'),
    warnings,
  };

  const carMatch = /^car_(sedan|sports|van|truck|police)_lod([01])\.glb$/.exec(name);
  if (carMatch) {
    const [length, width, height] = CAR_SIZES[carMatch[1]];
    const expected = { x: width, y: height, z: length };
    const tolerance = 0.05;
    for (const axis of ['x', 'y', 'z']) {
      const actual = size[['x', 'y', 'z'].indexOf(axis)];
      const target = expected[axis];
      if (Math.abs(actual - target) / target > tolerance) {
        warnings.push(`габарит ${axis}: ${round(actual)} ≠ ${target} (±5 %)`);
      }
    }
    if (Math.abs(center[0]) > 0.05 || Math.abs(center[2]) > 0.05) {
      warnings.push(`пивот X/Z не в центре: ${round(center[0])}; ${round(center[2])}`);
    }
    if (Math.abs(mins[1]) > 0.03) warnings.push(`низ модели на y=${round(mins[1])}, ожидается 0`);
    if (size[0] > size[2]) warnings.push('длина не по Z: forward должен быть +Z');
  }

  const pedMatch = /^ped_(base|cop)_lod\d\.glb$/.exec(name);
  if (pedMatch) {
    if (Math.abs(center[0]) > 0.05 || Math.abs(center[2]) > 0.05) {
      warnings.push(`пивот X/Z не в центре: ${round(center[0])}; ${round(center[2])}`);
    }
    if (Math.abs(mins[1]) > 0.03) warnings.push(`ступни не на y=0: ${round(mins[1])}`);
    if (size[1] < 1.5 || size[1] > 2.0) warnings.push(`рост ${round(size[1])} м вне 1.5–2.0`);
  }

  const propMatch = /^prop_/.exec(name);
  if (propMatch && Math.abs(mins[1]) > 0.03) {
    warnings.push(`низ пропса на y=${round(mins[1])}, ожидается 0 (pivot по основанию)`);
  }

  return info;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('usage: node tools/blender/inspect_glb.mjs [--all] <file|dir>');
  process.exit(1);
}

const all = args[0] === '--all';
const target = all ? args[1] : args[0];
const files = statSync(target).isDirectory()
  ? readdirSync(target)
      .filter((entry) => entry.toLowerCase().endsWith('.glb'))
      .map((entry) => join(target, entry))
  : [target];

let totalTris = 0;
let totalBytes = 0;
for (const file of files) {
  const info = inspect(file);
  totalTris += info.tris;
  totalBytes += statSync(file).size;
  const status = info.warnings.length === 0 ? 'OK' : `WARN: ${info.warnings.join('; ')}`;
  console.log(
    `${info.file.padEnd(26)} tris ${String(info.tris).padStart(5)}  ` +
      `size ${info.size.join('×')}  center ${info.center.slice(0, 3).join('; ')}  ${status}`,
  );
  if (all) console.log(`   nodes: ${info.nodes.join(', ')}`);
}
console.log(`---\nфайлов: ${files.length}, tris: ${totalTris}, вес: ${(totalBytes / 1024).toFixed(1)} KB`);
