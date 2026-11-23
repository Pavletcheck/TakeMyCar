// ---------------------------------------------------------------------------
// Дорожный граф авторской карты: дороги-полилинии разбиваются на отрезки,
// узлы ставятся на концах и в пересечениях, полосы считаются из ширины.
// Направленные рёбра, светофоры, точки спавна машин, JSON-экспорт/импорт.
//
// Геометрия полос отдаётся явно (`laneWidth`, `laneOffsets`, `lanePoint`),
// чтобы трафик не изобретал своё смещение. Никакой случайности: layout карты
// фиксирован, поэтому граф всегда одинаков.
// ---------------------------------------------------------------------------

import type { Vec2 } from '../core/math';
import { clamp } from '../core/math';
import { segmentIntersection } from './mapGeometry';
import type { CityMap } from './mapTypes';
import type {
  RoadEdge,
  RoadGraph,
  RoadGraphData,
  RoadGraphEdgeData,
  RoadGraphNodeData,
  RoadGraphStats,
  RoadNode,
  SpawnPoint,
} from './types';

const GRAPH_VERSION = 1 as const;
/** Шаги вдоль ребра, где ставятся точки спавна машин. */
const SPAWN_T = [0.25, 0.55, 0.8] as const;
/** Допуск слияния узлов: 5 см, иначе пересечения дают двойные узлы. */
const NODE_SNAP = 0.05;
const SPLIT_EPS = 1e-4;
const MIN_SEGMENT = 0.05;

interface SourceSegment {
  road: number;
  /** Индекс отрезка внутри дороги. */
  index: number;
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  length: number;
}

interface Split {
  t: number;
  x: number;
  z: number;
}

interface Pair {
  a: number;
  b: number;
  axis: 0 | 1;
  lanes: number;
  speed: number;
  arterial: boolean;
  oneWay: boolean;
  forward: number;
  reverse: number;
}

function lanePointAt(
  nodes: readonly RoadNode[],
  edge: RoadEdge,
  t: number,
  lane: number,
  out: Vec2,
): Vec2 {
  const a = nodes[edge.from];
  const b = nodes[edge.to];
  const clampedT = clamp(t, 0, 1);
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const laneIndex = clamp(Math.floor(lane), 0, edge.lanes - 1);
  const offset = edge.laneOffsets[laneIndex] ?? 0;
  // Правая сторона направления движения: right = (dirZ, -dirX).
  const inv = edge.length > 1e-6 ? 1 / edge.length : 0;
  const rightX = dz * inv;
  const rightZ = -dx * inv;
  out.x = a.x + dx * clampedT + rightX * offset;
  out.z = a.z + dz * clampedT + rightZ * offset;
  return out;
}

interface Reach {
  flags: Uint8Array;
  count: number;
}

function collectReach(nodeCount: number, edges: readonly RoadEdge[], start: number): Reach {
  const adjacency: number[][] = new Array(nodeCount);
  for (let i = 0; i < nodeCount; i += 1) adjacency[i] = [];
  for (let i = 0; i < edges.length; i += 1) adjacency[edges[i].from].push(edges[i].to);

  const flags = new Uint8Array(nodeCount);
  const queue: number[] = [start];
  flags[start] = 1;
  let count = 1;
  for (let head = 0; head < queue.length; head += 1) {
    const node = queue[head];
    const next = adjacency[node];
    for (let i = 0; i < next.length; i += 1) {
      const to = next[i];
      if (flags[to]) continue;
      flags[to] = 1;
      count += 1;
      queue.push(to);
    }
  }
  return { flags, count };
}

function findCenterNode(nodes: readonly RoadNode[]): number {
  let best = 0;
  let bestDist = Number.POSITIVE_INFINITY;
  for (let i = 0; i < nodes.length; i += 1) {
    const d = nodes[i].x * nodes[i].x + nodes[i].z * nodes[i].z;
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

function createGraph(seed: number, nodes: RoadNode[], edges: RoadEdge[]): RoadGraph {
  let oneWayEdges = 0;
  let lights = 0;
  for (let i = 0; i < edges.length; i += 1) if (edges[i].oneWay) oneWayEdges += 1;
  for (let i = 0; i < nodes.length; i += 1) if (nodes[i].lights) lights += 1;

  const center = findCenterNode(nodes);
  const reach = collectReach(nodes.length, edges, center);
  const stats: RoadGraphStats = {
    nodes: nodes.length,
    edges: edges.length,
    oneWayEdges,
    lights,
    connected: reach.count === nodes.length,
  };

  const spawnPoints: SpawnPoint[] = [];
  const scratch: Vec2 = { x: 0, z: 0 };
  for (let e = 0; e < edges.length; e += 1) {
    const edge = edges[e];
    for (let s = 0; s < SPAWN_T.length; s += 1) {
      for (let lane = 0; lane < edge.lanes; lane += 1) {
        lanePointAt(nodes, edge, SPAWN_T[s], lane, scratch);
        spawnPoints.push({ x: scratch.x, z: scratch.z, heading: edge.heading, tag: 'car' });
      }
    }
  }

  const nearestNode = (x: number, z: number): number => {
    let best = -1;
    let bestDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < nodes.length; i += 1) {
      const dx = nodes[i].x - x;
      const dz = nodes[i].z - z;
      const d = dx * dx + dz * dz;
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  };

  const nearestEdge = (x: number, z: number): number => {
    let best = -1;
    let bestDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < edges.length; i += 1) {
      const edge = edges[i];
      const a = nodes[edge.from];
      const b = nodes[edge.to];
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const lengthSq = dx * dx + dz * dz;
      const t = lengthSq > 1e-9 ? clamp(((x - a.x) * dx + (z - a.z) * dz) / lengthSq, 0, 1) : 0;
      const px = a.x + dx * t - x;
      const pz = a.z + dz * t - z;
      const d = px * px + pz * pz;
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  };

  const graph: RoadGraph = {
    seed,
    nodes,
    edges,
    spawnPoints,
    stats,
    nearestNode,
    nearestEdge,
    lanePoint: (edgeIndex, t, lane, out) => {
      const edge = edges[edgeIndex];
      if (!edge) {
        out.x = 0;
        out.z = 0;
        return out;
      }
      return lanePointAt(nodes, edge, t, lane, out);
    },
    edgeHeading: (edgeIndex) => edges[edgeIndex]?.heading ?? 0,
    isConnected: () => stats.connected,
    toJSON: () => graphToData(seed, nodes, edges),
  };
  return graph;
}

function graphToData(seed: number, nodes: readonly RoadNode[], edges: readonly RoadEdge[]): RoadGraphData {
  const nodeData: RoadGraphNodeData[] = [];
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    nodeData.push({
      id: node.id,
      x: node.x,
      z: node.z,
      kind: node.kind,
      lights: node.lights,
      lightPhase: node.lightPhase,
    });
  }
  const edgeData: RoadGraphEdgeData[] = [];
  for (let i = 0; i < edges.length; i += 1) {
    const edge = edges[i];
    edgeData.push({
      from: edge.from,
      to: edge.to,
      lanes: edge.lanes,
      speed: edge.speed,
      oneWay: edge.oneWay,
      arterial: edge.arterial,
      laneWidth: edge.laneWidth,
    });
  }
  return { version: GRAPH_VERSION, seed, nodes: nodeData, edges: edgeData };
}

/** Отрезки всех дорог карты: по ним считаются пересечения и раскладка. */
function collectSegments(map: CityMap): SourceSegment[] {
  const segments: SourceSegment[] = [];
  for (let r = 0; r < map.roads.length; r += 1) {
    const points = map.roads[r].points;
    for (let i = 0; i + 1 < points.length; i += 1) {
      const [x1, z1] = points[i];
      const [x2, z2] = points[i + 1];
      const length = Math.hypot(x2 - x1, z2 - z1);
      if (length < MIN_SEGMENT) {
        throw new Error(`RoadGraph: у дороги "${map.roads[r].id}" нулевой отрезок #${i}`);
      }
      segments.push({ road: r, index: i, x1, z1, x2, z2, length });
    }
  }
  return segments;
}

/**
 * Строит дорожный граф из дорог карты: пересечения дробят отрезки,
 * общие точки сливаются в один узел, полосы берутся из ширины дороги.
 */
export function buildRoadGraphFromMap(map: CityMap): RoadGraph {
  const segments = collectSegments(map);
  const splits: Split[][] = segments.map((segment) => [
    { t: 0, x: segment.x1, z: segment.z1 },
    { t: 1, x: segment.x2, z: segment.z2 },
  ]);

  // Пересечения: добавляем точку раскола в оба отрезка.
  for (let i = 0; i < segments.length; i += 1) {
    const a = segments[i];
    for (let j = i + 1; j < segments.length; j += 1) {
      const b = segments[j];
      if (a.road === b.road && Math.abs(a.index - b.index) <= 1) continue;
      const hit = segmentIntersection(a.x1, a.z1, a.x2, a.z2, b.x1, b.z1, b.x2, b.z2);
      if (!hit) continue;
      splits[i].push({ t: hit.t, x: hit.x, z: hit.z });
      splits[j].push({ t: hit.u, x: hit.x, z: hit.z });
    }
  }

  const nodes: RoadNode[] = [];
  const nodeByKey = new Map<string, number>();
  const nodeIndex = (x: number, z: number): number => {
    const key = `${Math.round(x / NODE_SNAP)}:${Math.round(z / NODE_SNAP)}`;
    const existing = nodeByKey.get(key);
    if (existing !== undefined) return existing;
    const id = nodes.length;
    nodes.push({ id, x, z, kind: 'cross' });
    nodeByKey.set(key, id);
    return id;
  };

  const edges: RoadEdge[] = [];
  const pairs: Pair[] = [];

  for (let s = 0; s < segments.length; s += 1) {
    const road = map.roads[segments[s].road];
    const points = splits[s];
    points.sort((lhs, rhs) => lhs.t - rhs.t);
    const unique: Split[] = [];
    for (let i = 0; i < points.length; i += 1) {
      const last = unique[unique.length - 1];
      if (last && Math.abs(points[i].t - last.t) < SPLIT_EPS) continue;
      unique.push(points[i]);
    }

    const laneWidth = road.width / (road.lanes * 2);
    const laneOffsets: number[] = new Array(road.lanes);
    for (let i = 0; i < road.lanes; i += 1) laneOffsets[i] = laneWidth * (i + 0.5);

    for (let i = 0; i + 1 < unique.length; i += 1) {
      const p0 = unique[i];
      const p1 = unique[i + 1];
      const from = nodeIndex(p0.x, p0.z);
      const to = nodeIndex(p1.x, p1.z);
      if (from === to) continue;
      const dx = p1.x - p0.x;
      const dz = p1.z - p0.z;
      const length = Math.hypot(dx, dz);
      if (length < MIN_SEGMENT) continue;
      const heading = Math.atan2(dx, dz);
      const axis: 0 | 1 = Math.abs(dx) >= Math.abs(dz) ? 0 : 1;
      const forward = edges.length;
      edges.push({
        from,
        to,
        lanes: road.lanes,
        speed: road.speed,
        oneWay: road.oneWay,
        arterial: road.arterial,
        axis,
        length,
        laneWidth,
        laneOffsets,
        heading,
      });
      let reverse = -1;
      if (!road.oneWay) {
        reverse = edges.length;
        edges.push({
          from: to,
          to: from,
          lanes: road.lanes,
          speed: road.speed,
          oneWay: false,
          arterial: road.arterial,
          axis,
          length,
          laneWidth,
          laneOffsets,
          heading: Math.atan2(-dx, -dz),
        });
      }
      pairs.push({
        a: from,
        b: to,
        axis,
        lanes: road.lanes,
        speed: road.speed,
        arterial: road.arterial,
        oneWay: road.oneWay,
        forward,
        reverse,
      });
    }
  }

  // Степень узлов и светофоры: на перекрёстке с магистралью.
  const neighbours: Set<number>[] = new Array(nodes.length);
  const arterialEdges = new Int32Array(nodes.length);
  for (let i = 0; i < nodes.length; i += 1) neighbours[i] = new Set<number>();
  for (let i = 0; i < edges.length; i += 1) {
    const edge = edges[i];
    neighbours[edge.from].add(edge.to);
    neighbours[edge.to].add(edge.from);
    if (edge.arterial) {
      arterialEdges[edge.from] += 1;
      arterialEdges[edge.to] += 1;
    }
  }
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    const degree = neighbours[i].size;
    node.kind = degree <= 1 ? 'dead' : degree === 3 ? 't' : 'cross';
    const lights = degree >= 3 && arterialEdges[i] >= 2;
    node.lights = lights;
    node.lightPhase = lights
      ? ((Math.abs(Math.round(node.x)) * 7 + Math.abs(Math.round(node.z)) * 13) % 1000) / 1000
      : undefined;
  }

  // Односторонние улицы не должны рвать направленную связность: если после
  // раскладки часть узлов недостижима, пара становится двусторонней.
  const center = findCenterNode(nodes);
  let reach = collectReach(nodes.length, edges, center);
  if (reach.count !== nodes.length) {
    for (let i = 0; i < pairs.length; i += 1) {
      const pair = pairs[i];
      if (!pair.oneWay) continue;
      const edge = edges[pair.forward];
      edge.oneWay = false;
      edges.push({
        from: edge.to,
        to: edge.from,
        lanes: edge.lanes,
        speed: edge.speed,
        oneWay: false,
        arterial: edge.arterial,
        axis: edge.axis,
        length: edge.length,
        laneWidth: edge.laneWidth,
        laneOffsets: edge.laneOffsets,
        heading: Math.atan2(
          nodes[edge.from].x - nodes[edge.to].x,
          nodes[edge.from].z - nodes[edge.to].z,
        ),
      });
      pair.oneWay = false;
      pair.reverse = edges.length - 1;
    }
    reach = collectReach(nodes.length, edges, center);
    if (reach.count !== nodes.length) {
      throw new Error('RoadGraph: карта дала несвязный граф — проверьте дороги');
    }
  }

  return createGraph(map.seed, nodes, edges);
}

/** Сериализация графа в JSON-строку (отладка, реплеи, фикстуры). */
export function serializeRoadGraph(graph: RoadGraph): string {
  return JSON.stringify(graph.toJSON());
}

/** Загрузка графа из JSON-строки или уже разобранного объекта. */
export function deserializeRoadGraph(source: string | RoadGraphData): RoadGraph {
  let data: RoadGraphData;
  if (typeof source === 'string') {
    data = JSON.parse(source) as RoadGraphData;
  } else {
    data = source;
  }
  if (!data || data.version !== GRAPH_VERSION) {
    throw new Error(`RoadGraph: неподдерживаемая версия данных (${String(data?.version)})`);
  }
  if (!Array.isArray(data.nodes) || data.nodes.length === 0) {
    throw new Error('RoadGraph: пустой список узлов');
  }
  if (!Array.isArray(data.edges) || data.edges.length === 0) {
    throw new Error('RoadGraph: пустой список рёбер');
  }

  const nodes: RoadNode[] = data.nodes.map((node, index) => {
    if (node.id !== index) throw new Error(`RoadGraph: id узла ${node.id} не совпадает с индексом ${index}`);
    return {
      id: node.id,
      x: node.x,
      z: node.z,
      kind: node.kind,
      lights: node.lights,
      lightPhase: node.lightPhase,
    };
  });

  const edges: RoadEdge[] = data.edges.map((edge, index) => {
    if (
      !Number.isInteger(edge.from) ||
      !Number.isInteger(edge.to) ||
      edge.from < 0 ||
      edge.to < 0 ||
      edge.from >= nodes.length ||
      edge.to >= nodes.length
    ) {
      throw new Error(`RoadGraph: ребро ${index} ссылается на несуществующий узел`);
    }
    const lanes = Math.max(1, Math.floor(edge.lanes));
    const laneWidth = edge.laneWidth > 0 ? edge.laneWidth : 3.4;
    const laneOffsets: number[] = new Array(lanes);
    for (let i = 0; i < lanes; i += 1) laneOffsets[i] = laneWidth * (i + 0.5);
    const a = nodes[edge.from];
    const b = nodes[edge.to];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const length = Math.hypot(dx, dz);
    return {
      from: edge.from,
      to: edge.to,
      lanes,
      speed: edge.speed,
      oneWay: Boolean(edge.oneWay),
      arterial: Boolean(edge.arterial),
      axis: Math.abs(dx) >= Math.abs(dz) ? 0 : 1,
      length,
      laneWidth,
      laneOffsets,
      heading: length > 1e-6 ? Math.atan2(dx, dz) : 0,
    };
  });

  return createGraph(data.seed, nodes, edges);
}
