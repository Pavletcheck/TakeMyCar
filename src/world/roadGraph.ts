// ---------------------------------------------------------------------------
// Дорожный граф: сетка магистралей и улиц, направленные рёбра, полосы,
// светофоры, точки спавна машин, проверка связности и JSON-экспорт.
//
// Ребро направленное: полосы 0..lanes-1 считаются справа по ходу from → to,
// lanePoint() — единственный источник геометрии полос (M3-A-28), чтобы
// трафик M5 не изобретал своё смещение.
// ---------------------------------------------------------------------------

import type { Vec2 } from '../core/math';
import { clamp } from '../core/math';
import type { WorldConfig } from '../config/world';
import { hash2 } from './hash';
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

interface RoadPair {
  a: number;
  b: number;
  axis: 0 | 1;
  lanes: number;
  speed: number;
  arterial: boolean;
  oneWay: boolean;
  /** Индекс прямого ребра a → b. */
  forward: number;
  /** Индекс обратного ребра b → a или -1. */
  reverse: number;
}

function buildNodes(config: WorldConfig, seed: number): RoadNode[] {
  const blocks = Math.round(config.sizeMeters / config.blockStep);
  const lineCount = blocks - 1;
  if (lineCount < 2) throw new Error('RoadGraph: слишком мало линий сетки');
  const nodes: RoadNode[] = [];
  for (let ix = 0; ix < lineCount; ix += 1) {
    const x = (ix - (lineCount - 1) / 2) * config.blockStep;
    for (let iz = 0; iz < lineCount; iz += 1) {
      const z = (iz - (lineCount - 1) / 2) * config.blockStep;
      // Светофор — пересечение двух магистралей (индексы линий кратны 3).
      const lights = ix % 3 === 0 && iz % 3 === 0;
      nodes.push({
        id: ix * lineCount + iz,
        x,
        z,
        kind: 'cross',
        lights,
        lightPhase: lights ? (hash2(seed, ix, iz) % 1000) / 1000 : undefined,
      });
    }
  }
  return nodes;
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

/**
 * Строит граф по конфигу мира. Детерминирован от seed:
 * магистрали — каждая третья линия, односторонние улицы — по хэшу,
 * связность после генерации чинится добавлением обратных рёбер.
 */
export function buildRoadGraph(seed: number, config: WorldConfig): RoadGraph {
  const nodes = buildNodes(config, seed);
  const blocks = Math.round(config.sizeMeters / config.blockStep);
  const lineCount = blocks - 1;
  const edges: RoadEdge[] = [];
  const pairs: RoadPair[] = [];

  const pushEdge = (
    from: number,
    to: number,
    lanes: number,
    speed: number,
    oneWay: boolean,
    arterial: boolean,
    axis: 0 | 1,
  ): number => {
    const a = nodes[from];
    const b = nodes[to];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const length = Math.hypot(dx, dz);
    const laneWidth = config.laneWidth;
    const laneOffsets: number[] = new Array(lanes);
    for (let i = 0; i < lanes; i += 1) laneOffsets[i] = laneWidth * (i + 0.5);
    edges.push({
      from,
      to,
      lanes,
      speed,
      oneWay,
      arterial,
      axis,
      length,
      laneWidth,
      laneOffsets,
      heading: length > 1e-6 ? Math.atan2(dx, dz) : 0,
    });
    return edges.length - 1;
  };

  const connect = (a: number, b: number, axis: 0 | 1, lineIndex: number): void => {
    const arterial = lineIndex % 3 === 0;
    const lanes = arterial ? 2 : 1;
    const speed = arterial ? 16 : 11;
    const oneWay =
      !arterial && (axis === 0 ? hash2(seed, lineIndex, 0x51) : hash2(seed, lineIndex, 0x7a)) % 100 < 14;
    const forward = pushEdge(a, b, lanes, speed, oneWay, arterial, axis);
    const reverse = oneWay ? -1 : pushEdge(b, a, lanes, speed, false, arterial, axis);
    pairs.push({ a, b, axis, lanes, speed, arterial, oneWay, forward, reverse });
  };

  for (let ix = 0; ix < lineCount; ix += 1) {
    for (let iz = 0; iz < lineCount; iz += 1) {
      const node = ix * lineCount + iz;
      // Ребро вдоль X: класс дороги задаёт линия Z (iz).
      if (ix + 1 < lineCount) connect(node, node + lineCount, 0, iz);
      // Ребро вдоль Z: класс дороги задаёт линия X (ix).
      if (iz + 1 < lineCount) connect(node, node + 1, 1, ix);
    }
  }

  // --- связность: добавляем обратные рёбра, пока все узлы не достижимы ------
  const center = findCenterNode(nodes);
  for (let pass = 0; pass < 6; pass += 1) {
    const reach = collectReach(nodes.length, edges, center);
    if (reach.count === nodes.length) break;
    let changed = false;
    for (let i = 0; i < pairs.length; i += 1) {
      const pair = pairs[i];
      if (!pair.oneWay || pair.reverse >= 0) continue;
      const aReach = reach.flags[pair.a] === 1;
      const bReach = reach.flags[pair.b] === 1;
      if (aReach === bReach) continue;
      // Обратное ребро нужно со стороны достижимого узла к недостижимому.
      if (bReach) {
        pair.reverse = pushEdge(pair.b, pair.a, pair.lanes, pair.speed, false, pair.arterial, pair.axis);
      } else {
        pair.reverse = pushEdge(pair.a, pair.b, pair.lanes, pair.speed, false, pair.arterial, pair.axis);
      }
      edges[pair.forward].oneWay = false;
      pair.oneWay = false;
      changed = true;
    }
    if (!changed) break;
  }

  // Страховка: если после починки граф всё ещё не связен — снимаем oneWay
  // со всех оставшихся односторонних пар (сетка тогда связна по построению).
  const finalReach = collectReach(nodes.length, edges, center);
  if (finalReach.count !== nodes.length) {
    for (let i = 0; i < pairs.length; i += 1) {
      const pair = pairs[i];
      if (!pair.oneWay || pair.reverse >= 0) continue;
      pair.reverse = pushEdge(pair.b, pair.a, pair.lanes, pair.speed, false, pair.arterial, pair.axis);
      edges[pair.forward].oneWay = false;
      pair.oneWay = false;
    }
  }

  return createGraph(seed, nodes, edges);
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
