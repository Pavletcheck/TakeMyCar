// ---------------------------------------------------------------------------
// Сборка мира: авторская карта (assets/maps/city.json) + дорожный граф +
// стриминг чанков + общий SpatialHash + точки спавна + мини-карта.
//
// World — единственный источник положительных id статических коллайдеров
// (allocStaticId), динамика живёт на отрицательных id в registry.
// Модуль не импортирует Three.js и не трогает DOM.
// ---------------------------------------------------------------------------

import type { Collider, Contact, Rect } from '../core/math';
import { circleRect } from '../core/math';
import { SpatialHash } from '../core/spatialHash';
import { TUNING } from '../config/tuning';
import type { WorldConfig } from '../config/world';
import { ChunkStreamer } from './chunks';
import { buildCityLayout, computeLayoutHash, describeLayout } from './cityLayout';
import type { CityLayout, LayoutInfo } from './cityLayout';
import type { CityMap } from './mapTypes';
import { buildSpawnPoints } from './spawn';
import type { Bounds, Chunk, MinimapData, MinimapTile, RoadGraph, SpawnPoint } from './types';

/** Диагностика мира для HUD: бюджеты генерации и наполнение broadphase. */
export interface WorldStats {
  chunksLoaded: number;
  chunksPending: number;
  /** Время последнего сгенерированного чанка, мс. */
  genLastMs: number;
  /** Максимум времени генерации чанка за сеанс, мс — не среднее. */
  genMaxMs: number;
  /** Сколько чанков сгенерировано всего. */
  genCount: number;
  genTotalMs: number;
  /** Время последнего world.update, мс. */
  updateMs: number;
  colliders: number;
  spawnPoints: number;
  revision: number;
}

export interface WorldOptions {
  /** Общий хэш (если app уже создал свой). Иначе мир создаёт собственный. */
  readonly hash?: SpatialHash<Collider>;
  /** Часы для замера генерации; в рантайме — performance.now. */
  readonly now?: () => number;
}

export interface World {
  /** Идентификатор карты (`?map=city`). */
  readonly mapId: string;
  /** Данные карты, из которых собран мир. */
  readonly map: CityMap;
  /** Константа карты: на планировку не влияет, нужна логам и реплеям. */
  readonly seed: number;
  readonly bounds: Bounds;
  readonly chunkSize: number;
  readonly config: WorldConfig;
  readonly roadGraph: RoadGraph;
  /** Глобальная упрощённая геометрия для HUD. */
  readonly minimap: MinimapData;
  /** Тайлы мини-карты активных чанков (обновляются при стриминге). */
  readonly minimapTiles: readonly MinimapTile[];
  readonly activeChunks: readonly Chunk[];
  /** Общий SpatialHash статики; физика читает только его. */
  readonly colliders: SpatialHash<Collider>;
  readonly defaultSpawn: SpawnPoint;
  readonly revision: number;
  /** FNV-1a хэш планировки (считается лениво, для ?debug=1). */
  readonly layoutHash: number;
  /** Счётчики карты: дороги, кварталы, ориентиры, здания, пропсы. */
  readonly info: LayoutInfo;
  readonly stats: WorldStats;

  /** Стриминг; вызывается из фикс. шага не чаще 4 раз в секунду. */
  update(focusX: number, focusZ: number): void;
  /** Немедленная активация окружения (старт/телепорт), возвращает время, мс. */
  prefetch(focusX: number, focusZ: number): number;
  getChunk(cx: number, cz: number): Chunk | undefined;

  queryColliders(area: Rect, out: Collider[]): Collider[];
  querySpawnPoints(
    x: number,
    z: number,
    radius: number,
    tag: SpawnPoint['tag'],
    out: SpawnPoint[],
  ): SpawnPoint[];

  computeLayoutHash(): number;
  /** Единый аллокатор положительных id статических коллайдеров. */
  allocStaticId(): number;
  /** Выгрузить все чанки и снять их коллайдеры (перезапуск сцены/тест). */
  unloadAll(): void;
}

const SPAWN_CLEAR_RADIUS = 0.6;

/**
 * Непроходимая вода: полоса коллайдеров вдоль берега.
 * Мост (kind === 'bridge') вырезает разрыв по Z, чтобы через реку можно было проехать.
 * Мосты в карте горизонтальные, поэтому разрыв считается по Z.
 */
function addWaterBlockers(
  map: CityMap,
  hash: SpatialHash<Collider>,
  streamer: { allocStaticId(): number },
): void {
  const bridges = map.roads.filter((road) => road.kind === 'bridge');
  for (const water of map.water) {
    let bands: { lo: number; hi: number }[] = [{ lo: water.z - water.hz, hi: water.z + water.hz }];
    for (const bridge of bridges) {
      const bridgeZ = bridge.points[0][1];
      const half = bridge.width / 2 + 1;
      const next: { lo: number; hi: number }[] = [];
      for (const band of bands) {
        if (bridgeZ + half <= band.lo || bridgeZ - half >= band.hi) {
          next.push(band);
          continue;
        }
        if (band.lo < bridgeZ - half) next.push({ lo: band.lo, hi: bridgeZ - half });
        if (band.hi > bridgeZ + half) next.push({ lo: bridgeZ + half, hi: band.hi });
      }
      bands = next;
    }
    for (const band of bands) {
      const hz = (band.hi - band.lo) / 2;
      if (hz < 0.5) continue;
      hash.insert({
        id: streamer.allocStaticId(),
        x: water.x,
        z: (band.lo + band.hi) / 2,
        hx: water.hx,
        hz,
        angle: 0,
      });
    }
  }
}

function defaultNow(): number {
  return typeof performance === 'undefined' ? Date.now() : performance.now();
}

/**
 * Собирает мир из авторской карты. Планировка фиксирована данными:
 * одинаковый city.json даёт одинаковый layoutHash при каждом запуске.
 */
export function buildWorldFromMap(
  map: CityMap,
  config: WorldConfig,
  options: WorldOptions = {},
): World {
  const layout: CityLayout = buildCityLayout(map, config);
  const hash = options.hash ?? new SpatialHash<Collider>(TUNING.spatialCellSize);
  const now = options.now ?? defaultNow;
  const streamer = new ChunkStreamer(layout, hash, now);
  const spawnPoints = buildSpawnPoints(layout);

  // Вода непроходима: постоянные коллайдеры береговой линии.
  // Мост оставляет разрыв, чтобы через реку можно было проехать.
  addWaterBlockers(map, hash, streamer);

  const minimapTiles: MinimapTile[] = [];
  let tilesRevision = -1;
  let layoutHashCache = 0;
  let layoutHashReady = false;
  let infoCache: LayoutInfo | null = null;

  const stats: WorldStats = {
    chunksLoaded: 0,
    chunksPending: 0,
    genLastMs: 0,
    genMaxMs: 0,
    genCount: 0,
    genTotalMs: 0,
    updateMs: 0,
    colliders: 0,
    spawnPoints: spawnPoints.length,
    revision: 0,
  };

  const queryScratch: Collider[] = [];
  const contact: Contact = { nx: 0, nz: 0, depth: 0 };

  const refreshTiles = (): void => {
    if (streamer.revision === tilesRevision) return;
    tilesRevision = streamer.revision;
    minimapTiles.length = 0;
    const active = streamer.activeChunks;
    for (let i = 0; i < active.length; i += 1) minimapTiles.push(active[i].minimap);
  };

  const refreshStats = (): void => {
    stats.chunksLoaded = streamer.loaded;
    stats.chunksPending = streamer.pending;
    stats.genLastMs = streamer.genLastMs;
    stats.genMaxMs = streamer.genMaxMs;
    stats.genCount = streamer.genCount;
    stats.genTotalMs = streamer.genTotalMs;
    stats.updateMs = streamer.lastUpdateMs;
    stats.colliders = hash.size;
    stats.revision = streamer.revision;
  };

  const isClear = (x: number, z: number): boolean => {
    hash.queryCircle(x, z, SPAWN_CLEAR_RADIUS + TUNING.collisionSkin, queryScratch);
    for (let i = 0; i < queryScratch.length; i += 1) {
      if (circleRect(x, z, SPAWN_CLEAR_RADIUS, queryScratch[i], contact)) return false;
    }
    return true;
  };

  const computeHash = (): number => {
    if (!layoutHashReady) {
      layoutHashCache = computeLayoutHash(layout);
      layoutHashReady = true;
    }
    return layoutHashCache;
  };

  const world: World = {
    mapId: map.id,
    map,
    seed: map.seed,
    bounds: layout.bounds,
    chunkSize: layout.chunkSize,
    config,
    roadGraph: layout.roadGraph,
    minimap: layout.minimap,
    defaultSpawn: layout.defaultSpawn,
    colliders: hash,

    get minimapTiles() {
      refreshTiles();
      return minimapTiles;
    },
    get activeChunks() {
      return streamer.activeChunks;
    },
    get revision() {
      return streamer.revision;
    },
    get layoutHash() {
      return computeHash();
    },
    get info() {
      if (!infoCache) infoCache = describeLayout(layout);
      return infoCache;
    },
    get stats() {
      refreshStats();
      return stats;
    },

    update(focusX, focusZ) {
      streamer.update(focusX, focusZ);
      refreshTiles();
    },

    prefetch(focusX, focusZ) {
      const ms = streamer.prefetch(focusX, focusZ);
      refreshTiles();
      return ms;
    },

    getChunk(cx, cz) {
      return streamer.getChunk(cx, cz);
    },

    queryColliders(area, out) {
      return hash.queryRect(area.x, area.z, area.hx, area.hz, out);
    },

    querySpawnPoints(x, z, radius, tag, out) {
      out.length = 0;
      const radiusSq = radius * radius;
      for (let i = 0; i < spawnPoints.length; i += 1) {
        const point = spawnPoints[i];
        if (point.tag !== tag) continue;
        const dx = point.x - x;
        const dz = point.z - z;
        if (dx * dx + dz * dz > radiusSq) continue;
        if (!isClear(point.x, point.z)) continue;
        out.push(point);
      }
      return out;
    },

    computeLayoutHash() {
      return computeHash();
    },

    allocStaticId() {
      return streamer.allocStaticId();
    },

    unloadAll() {
      streamer.unloadAll();
      refreshTiles();
    },
  };

  return world;
}
