// ---------------------------------------------------------------------------
// Стриминг чанков 128 м: генерация вокруг игрока, выгрузка далёких.
// Коллайдеры чанка живут в общем SpatialHash; при выгрузке снимаются ровно
// свои объекты (remove по тому же Collider), поэтому size возвращается к
// исходному значению после круга по миру.
// id статических коллайдеров выдаёт единый аллокатор мира, начиная с 1;
// динамические id отрицательные (registry) — пересечения нет.
//
// Содержимое чанка берётся из данных карты: кварталы раскрываются префабами,
// пропсы вне кварталов (набережная, мост) уже разложены по чанкам в layout.
// ---------------------------------------------------------------------------

import type { Collider } from '../core/math';
import type { SpatialHash } from '../core/spatialHash';
import type { DistrictId } from '../config/world';
import { chunkCoordOf, chunkKey, chunkXOf, chunkZOf } from './coords';
import type { CityLayout } from './cityLayout';
import { buildMinimapTile } from './minimap';
import { clearBlockContent, createBlockContent, expandPrefab, plateColorOf } from './prefab';
import type {
  BuildingInstance,
  Chunk,
  MinimapRect,
  PlateInstance,
  PropInstance,
} from './types';

/** Сколько времени заняла активация чанков (диагностика HUD). */
export interface ChunkStreamerStats {
  loaded: number;
  pending: number;
  genLastMs: number;
  genMaxMs: number;
  genCount: number;
  genTotalMs: number;
  updateMs: number;
  revision: number;
}

/** Сгенерировать чанк: содержимое кварталов, пропсы, id коллайдеров, мини-карта. */
export function generateChunk(
  layout: CityLayout,
  cx: number,
  cz: number,
  allocId: () => number,
  now: () => number,
): Chunk {
  const started = now();
  const key = chunkKey(cx, cz);
  const blockIndices = layout.chunkBlocks.get(key);
  const content = createBlockContent();
  const plates: PlateInstance[] = [];
  const buildings: BuildingInstance[] = [];
  const props: PropInstance[] = [];
  const colliders: Collider[] = [];

  if (blockIndices) {
    for (let i = 0; i < blockIndices.length; i += 1) {
      const block = layout.blocks[blockIndices[i]];
      const prefab = layout.prefabs.get(block.prefab);
      if (!prefab) continue;
      clearBlockContent(content);
      expandPrefab(prefab, block, prefab.plate ?? plateColorOf(block.kind, layout.config), content);
      for (let p = 0; p < content.plates.length; p += 1) plates.push(content.plates[p]);
      for (let b = 0; b < content.buildings.length; b += 1) buildings.push(content.buildings[b]);
      for (let p = 0; p < content.props.length; p += 1) props.push(content.props[p]);
      for (let c = 0; c < content.colliders.length; c += 1) colliders.push(content.colliders[c]);
    }
  }

  // Пропсы вне кварталов: готовые экземпляры из layout, коллайдеры — шаблоны.
  const extraProps = layout.chunkProps.get(key);
  if (extraProps) {
    for (let i = 0; i < extraProps.length; i += 1) props.push(extraProps[i]);
  }
  const extraColliders = layout.chunkPropColliders.get(key);
  if (extraColliders) {
    for (let i = 0; i < extraColliders.length; i += 1) colliders.push(extraColliders[i]);
  }

  for (let i = 0; i < colliders.length; i += 1) colliders[i].id = allocId();

  const minimap = buildMinimapTile(cx, cz, layout.chunkSize, layout.minimap);
  const sidewalks: MinimapRect[] = [];
  for (let i = 0; i < plates.length; i += 1) {
    const plate = plates[i];
    sidewalks.push({ x: plate.x, z: plate.z, hx: plate.w / 2, hz: plate.d / 2 });
  }
  const districts: DistrictId[] = [];
  for (let i = 0; i < minimap.blocks.length; i += 1) {
    const district = minimap.blocks[i].district;
    if (!districts.includes(district)) districts.push(district);
  }

  const genMs = now() - started;
  return {
    cx,
    cz,
    colliders,
    plates,
    buildings,
    props,
    roads: minimap.roads,
    sidewalks,
    water: minimap.water,
    districts,
    minimap,
    renderRef: key + 1,
    genMs,
  };
}

/**
 * Менеджер стриминга: очередь чанков по расстоянию, бюджет на update,
 * выгрузка за пределами radius + hysteresis. Данные не знают о Three.
 */
export class ChunkStreamer {
  private readonly layout: CityLayout;
  private readonly hash: SpatialHash<Collider>;
  private readonly now: () => number;
  private readonly radius: number;
  private readonly hysteresis: number;
  private readonly maxPerUpdate: number;
  private readonly minCx: number;
  private readonly maxCx: number;
  private readonly minCz: number;
  private readonly maxCz: number;

  private readonly chunks = new Map<number, Chunk>();
  private readonly active: Chunk[] = [];
  private readonly queue: number[] = [];
  private readonly removeBuffer: number[] = [];

  private focusCx = Number.NaN;
  private focusCz = Number.NaN;
  private nextId = 1;
  private rev = 0;

  private genLast = 0;
  private genMax = 0;
  private generatedCount = 0;
  private generatedTotal = 0;
  private updateMs = 0;

  constructor(layout: CityLayout, hash: SpatialHash<Collider>, now: () => number) {
    this.layout = layout;
    this.hash = hash;
    this.now = now;
    this.radius = Math.max(0, Math.floor(layout.config.streamRadius));
    this.hysteresis = Math.max(0, Math.floor(layout.config.streamHysteresis));
    this.maxPerUpdate = Math.max(1, Math.floor(layout.config.maxChunksPerUpdate));

    const chunkSize = layout.chunkSize;
    this.minCx = Math.floor(layout.bounds.minX / chunkSize);
    this.maxCx = Math.ceil(layout.bounds.maxX / chunkSize) - 1;
    this.minCz = Math.floor(layout.bounds.minZ / chunkSize);
    this.maxCz = Math.ceil(layout.bounds.maxZ / chunkSize) - 1;
  }

  get activeChunks(): readonly Chunk[] {
    return this.active;
  }

  get revision(): number {
    return this.rev;
  }

  get loaded(): number {
    return this.chunks.size;
  }

  get pending(): number {
    return this.queue.length;
  }

  get genLastMs(): number {
    return this.genLast;
  }

  get genMaxMs(): number {
    return this.genMax;
  }

  get genCount(): number {
    return this.generatedCount;
  }

  get genTotalMs(): number {
    return this.generatedTotal;
  }

  get lastUpdateMs(): number {
    return this.updateMs;
  }

  /** Единый аллокатор статических коллайдеров мира (положительные id). */
  allocStaticId(): number {
    const id = this.nextId;
    this.nextId += 1;
    return id;
  }

  getChunk(cx: number, cz: number): Chunk | undefined {
    return this.chunks.get(chunkKey(cx, cz));
  }

  /** Стриминг вокруг точки; генерирует не больше maxChunksPerUpdate за вызов. */
  update(focusX: number, focusZ: number): void {
    const started = this.now();
    const cx = this.clampX(chunkCoordOf(focusX, this.layout.chunkSize));
    const cz = this.clampZ(chunkCoordOf(focusZ, this.layout.chunkSize));
    let changed = false;

    if (cx !== this.focusCx || cz !== this.focusCz) {
      this.focusCx = cx;
      this.focusCz = cz;
      this.rebuildQueue(cx, cz);
      changed = this.unloadFar(cx, cz) || changed;
    }

    let generated = 0;
    while (this.queue.length > 0 && generated < this.maxPerUpdate) {
      const key = this.queue.shift();
      if (key === undefined) break;
      if (this.chunks.has(key)) continue;
      this.createChunk(key);
      generated += 1;
      changed = true;
    }

    if (changed) this.refreshActive();
    this.updateMs = this.now() - started;
  }

  /** Немедленно активировать всё вокруг точки (старт игры, телепорт). */
  prefetch(focusX: number, focusZ: number): number {
    const started = this.now();
    const cx = this.clampX(chunkCoordOf(focusX, this.layout.chunkSize));
    const cz = this.clampZ(chunkCoordOf(focusZ, this.layout.chunkSize));
    this.focusCx = cx;
    this.focusCz = cz;
    this.rebuildQueue(cx, cz);
    this.unloadFar(cx, cz);

    let changed = false;
    while (this.queue.length > 0) {
      const key = this.queue.shift();
      if (key === undefined) break;
      if (this.chunks.has(key)) continue;
      this.createChunk(key);
      changed = true;
    }
    if (changed) this.refreshActive();
    this.updateMs = this.now() - started;
    return this.updateMs;
  }

  /** Выгрузить все чанки (teardown, повторный тест). */
  unloadAll(): void {
    for (const chunk of this.chunks.values()) {
      for (let i = 0; i < chunk.colliders.length; i += 1) this.hash.remove(chunk.colliders[i]);
    }
    this.chunks.clear();
    this.queue.length = 0;
    this.active.length = 0;
    this.rev += 1;
  }

  private createChunk(key: number): void {
    const started = this.now();
    const cx = chunkXOf(key);
    const cz = chunkZOf(key);
    const chunk = generateChunk(this.layout, cx, cz, () => this.allocStaticId(), this.now);
    for (let i = 0; i < chunk.colliders.length; i += 1) this.hash.insert(chunk.colliders[i]);
    this.chunks.set(key, chunk);

    // Бюджет «активация чанка» включает и вставку статики в SpatialHash.
    const activationMs = this.now() - started;
    this.genLast = activationMs;
    if (activationMs > this.genMax) this.genMax = activationMs;
    this.generatedCount += 1;
    this.generatedTotal += activationMs;
  }

  private rebuildQueue(cx: number, cz: number): void {
    this.queue.length = 0;
    const radius = this.radius;
    for (let dz = -radius; dz <= radius; dz += 1) {
      const qz = cz + dz;
      if (qz < this.minCz || qz > this.maxCz) continue;
      for (let dx = -radius; dx <= radius; dx += 1) {
        const qx = cx + dx;
        if (qx < this.minCx || qx > this.maxCx) continue;
        const key = chunkKey(qx, qz);
        if (!this.chunks.has(key)) this.queue.push(key);
      }
    }
    const focusX = cx;
    const focusZ = cz;
    this.queue.sort((a, b) => {
      const ax = chunkXOf(a) - focusX;
      const az = chunkZOf(a) - focusZ;
      const bx = chunkXOf(b) - focusX;
      const bz = chunkZOf(b) - focusZ;
      return ax * ax + az * az - (bx * bx + bz * bz);
    });
  }

  private unloadFar(cx: number, cz: number): boolean {
    const limit = this.radius + this.hysteresis;
    this.removeBuffer.length = 0;
    for (const entry of this.chunks) {
      const chunk = entry[1];
      const dx = Math.abs(chunk.cx - cx);
      const dz = Math.abs(chunk.cz - cz);
      if (Math.max(dx, dz) > limit) this.removeBuffer.push(entry[0]);
    }
    if (this.removeBuffer.length === 0) return false;

    for (let i = 0; i < this.removeBuffer.length; i += 1) {
      const key = this.removeBuffer[i];
      const chunk = this.chunks.get(key);
      if (!chunk) continue;
      for (let c = 0; c < chunk.colliders.length; c += 1) this.hash.remove(chunk.colliders[c]);
      this.chunks.delete(key);
    }
    return true;
  }

  private refreshActive(): void {
    this.active.length = 0;
    for (const chunk of this.chunks.values()) this.active.push(chunk);
    this.rev += 1;
  }

  private clampX(cx: number): number {
    return Math.min(this.maxCx, Math.max(this.minCx, cx));
  }

  private clampZ(cz: number): number {
    return Math.min(this.maxCz, Math.max(this.minCz, cz));
  }
}
