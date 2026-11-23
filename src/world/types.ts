// ---------------------------------------------------------------------------
// Типы данных мира: дороги, чанки, здания, пропсы, мини-карта, точки спавна.
// Модуль не знает ни о Three.js, ни о DOM — только числа и идентификаторы.
// Форма коллайдера одна на проект — Collider из core/math (ADR 0003).
// Экспорт согласован с ARCHITECTURE §3.4 (M3-A-26…M3-A-29).
// ---------------------------------------------------------------------------

import type { Collider, Vec2 } from '../core/math';
import type { BlockKind, DistrictId } from '../config/world';

export interface Bounds {
  readonly minX: number;
  readonly minZ: number;
  readonly maxX: number;
  readonly maxZ: number;
}

/** Узел дорожного графа. `lights` — перекрёсток со светофором. */
export interface RoadNode {
  id: number;
  x: number;
  z: number;
  kind: 'cross' | 't' | 'dead';
  lights?: boolean;
  /** Фаза светофора 0..1 (сдвиг цикла), детерминированная от сида. */
  lightPhase?: number;
}

/**
 * Направленное ребро дороги: полосы `0..lanes-1` считаются справа
 * по ходу from → to (правостороннее движение).
 *
 * Геометрия полос отдаётся явно (`laneWidth`, `laneOffsets`, `heading`),
 * чтобы трафик (M5) не считал смещение сам — M3-A-28.
 */
export interface RoadEdge {
  from: number;
  to: number;
  lanes: number;
  /** Ограничение скорости, м/с. */
  speed: number;
  oneWay: boolean;
  /** Магистраль: шире, быстрее, со светофорами. */
  arterial: boolean;
  /** 0 — ребро вдоль X, 1 — вдоль Z. */
  axis: 0 | 1;
  /** Длина ребра, м. */
  length: number;
  /** Ширина полосы, м. */
  laneWidth: number;
  /** Смещение центра полосы вправо от осевой линии, м (индекс = номер полосы). */
  laneOffsets: readonly number[];
  /** Направление движения: `heading = atan2(dirX, dirZ)` в соглашении игры. */
  heading: number;
}

export interface SpawnPoint {
  x: number;
  z: number;
  heading: number;
  /** Тип точки: машины, пешеходы, копы. */
  tag: 'car' | 'ped' | 'cop';
}

export interface RoadGraphStats {
  nodes: number;
  edges: number;
  oneWayEdges: number;
  lights: number;
  /** Все узлы достижимы от центра по направленным рёбрам. */
  connected: boolean;
}

export interface RoadGraphNodeData {
  id: number;
  x: number;
  z: number;
  kind: RoadNode['kind'];
  lights?: boolean;
  lightPhase?: number;
}

export interface RoadGraphEdgeData {
  from: number;
  to: number;
  lanes: number;
  speed: number;
  oneWay: boolean;
  arterial: boolean;
  laneWidth: number;
}

/** Формат JSON-экспорта графа (версия 1) для отладки и реплеев. */
export interface RoadGraphData {
  version: 1;
  seed: number;
  nodes: readonly RoadGraphNodeData[];
  edges: readonly RoadGraphEdgeData[];
}

/**
 * Дорожный граф: узлы, направленные рёбра, светофоры и точки спавна.
 * `lanePoint` — единственный источник геометрии полос для трафика.
 */
export interface RoadGraph {
  readonly seed: number;
  readonly nodes: readonly RoadNode[];
  readonly edges: readonly RoadEdge[];
  /** Точки спавна машин: по центру каждой полосы, несколько вдоль ребра. */
  readonly spawnPoints: readonly SpawnPoint[];
  readonly stats: RoadGraphStats;

  /** Индекс ближайшего узла или -1. */
  nearestNode(x: number, z: number): number;
  /** Индекс ближайшего направленного ребра или -1. */
  nearestEdge(x: number, z: number): number;
  /** Точка на полосе: t ∈ [0,1] от from к to, lane — индекс полосы. */
  lanePoint(edgeIndex: number, t: number, lane: number, out: Vec2): Vec2;
  /** Направление (heading) ребра в соглашении игры. */
  edgeHeading(edgeIndex: number): number;
  /** Проверка связности направленного графа от центра. */
  isConnected(): boolean;
  toJSON(): RoadGraphData;
}

/** Плита квартала (тротуар, газон, асфальт парковки) — визуальные данные. */
export interface PlateInstance {
  x: number;
  z: number;
  w: number;
  d: number;
  color: number;
}

/** Коробка здания с крышей; интерьеров нет. */
export interface BuildingInstance {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color: number;
  roofColor: number;
}

export type PropKind = 'lamp' | 'bin' | 'hydrant' | 'tree' | 'bench' | 'billboard' | 'fence';

/** Экземпляр пропса: рендер строит части по PROP_DEFS[kind].variants[variant]. */
export interface PropInstance {
  kind: PropKind;
  x: number;
  z: number;
  heading: number;
  scale: number;
  variant: number;
  /** Есть ли у пропса статический коллайдер (M3-A-10). */
  collidable: boolean;
}

export interface MinimapRect {
  x: number;
  z: number;
  hx: number;
  hz: number;
}

export interface MinimapRoad {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  width: number;
  arterial: boolean;
}

export interface MinimapBlock {
  x: number;
  z: number;
  /** Половина стороны по X (кварталы не квадратные: набережная, доки). */
  hx: number;
  /** Половина стороны по Z. */
  hz: number;
  district: DistrictId;
  kind: BlockKind;
}

/**
 * Упрощённая геометрия для HUD: без Three, обновляется при стриминге.
 * Формат векторный (отрезки/прямоугольники), растровых кодов тайлов нет.
 */
export interface MinimapTile {
  cx: number;
  cz: number;
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
  roads: readonly MinimapRoad[];
  blocks: readonly MinimapBlock[];
  water: readonly MinimapRect[];
}

export interface MinimapData {
  bounds: Bounds;
  roads: readonly MinimapRoad[];
  blocks: readonly MinimapBlock[];
  water: readonly MinimapRect[];
  parks: readonly MinimapRect[];
}

/**
 * Загруженный чанк мира. `renderRef` — стабильный числовой ключ для render-слоя
 * (Three-объект сюда не попадает). Кроме коллайдеров чанк отдаёт дорожную и
 * тротуарную геометрию и участки воды для проверок RW-01…RW-03 (M3-A-27/29).
 */
export interface Chunk {
  readonly cx: number;
  readonly cz: number;
  readonly colliders: readonly Collider[];
  readonly plates: readonly PlateInstance[];
  readonly buildings: readonly BuildingInstance[];
  readonly props: readonly PropInstance[];
  readonly roads: readonly MinimapRoad[];
  readonly sidewalks: readonly MinimapRect[];
  readonly water: readonly MinimapRect[];
  readonly districts: readonly DistrictId[];
  readonly minimap: MinimapTile;
  readonly renderRef: number;
  /** Время генерации чанка, мс (диагностика бюджета < 8 мс). */
  readonly genMs: number;
}
