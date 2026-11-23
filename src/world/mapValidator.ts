// ---------------------------------------------------------------------------
// Проверка авторской карты: размеры, дороги и их пересечения, связность графа,
// кварталы и префабы, здания не на дорогах/в воде, отсутствие наложений,
// свободные точки спавна. Валидация запускается при загрузке карты, поэтому
// битая карта не доходит до сборки мира.
// ---------------------------------------------------------------------------

import type { Contact, Rect } from '../core/math';
import { circleRect, rectRectContact } from '../core/math';
import type { CityMap, MapRect, PrefabSpec } from './mapTypes';
import {
  distanceToSegment,
  segmentIntersection,
  segmentRect,
  segmentsOverlap,
  toRect,
} from './mapGeometry';
import { clearBlockContent, createBlockContent, createPropCollider, expandPrefab } from './prefab';
import { buildRoadGraphFromMap } from './roadGraph';
import type { BlockContent } from './prefab';

/** Минимальное перекрытие, которое считается ошибкой, м. */
const OVERLAP_EPS = 0.05;
/** Радиус проверки «точка спавна свободна», м. */
const SPAWN_CLEAR_RADIUS = 0.6;
/** Допуск «точки на дороге», м. */
const ROAD_EPS = 0.05;

function fail(message: string): never {
  throw new Error(`CityMap: ${message}`);
}

function insideBounds(x: number, z: number, half: number, where: string): void {
  if (Math.abs(x) > half + 0.01 || Math.abs(z) > half + 0.01) {
    fail(`${where} (${x}; ${z}) за границей карты ±${half}`);
  }
}

function checkRect(rect: MapRect, half: number, where: string): void {
  if (!(rect.hx > 0) || !(rect.hz > 0)) fail(`${where}: стороны должны быть положительными`);
  insideBounds(rect.x, rect.z, half, where);
  insideBounds(rect.x - rect.hx, rect.z - rect.hz, half, `${where} (угол)`);
  insideBounds(rect.x + rect.hx, rect.z + rect.hz, half, `${where} (угол)`);
}

function overlaps(a: Rect, b: Rect, contact: Contact): boolean {
  return rectRectContact(a, b, contact) && contact.depth > OVERLAP_EPS;
}

interface Corridor {
  readonly rect: Rect;
  readonly roadId: string;
}

function collectCorridors(map: CityMap): Corridor[] {
  const corridors: Corridor[] = [];
  for (let r = 0; r < map.roads.length; r += 1) {
    const road = map.roads[r];
    for (let i = 0; i + 1 < road.points.length; i += 1) {
      const [x1, z1] = road.points[i];
      const [x2, z2] = road.points[i + 1];
      corridors.push({ rect: segmentRect(x1, z1, x2, z2, road.width / 2), roadId: road.id });
    }
  }
  return corridors;
}

function indexPrefabs(map: CityMap): Map<string, PrefabSpec> {
  const prefabs = new Map<string, PrefabSpec>();
  for (let i = 0; i < map.prefabs.length; i += 1) {
    const prefab = map.prefabs[i];
    if (prefabs.has(prefab.id)) fail(`префаб "${prefab.id}" описан дважды`);
    prefabs.set(prefab.id, prefab);
  }
  return prefabs;
}

function validateBasics(map: CityMap): void {
  if (!(map.size >= 400) || !(map.size <= 4000)) fail(`size=${map.size}: ожидалось 400…4000 м`);
  if (!(map.chunkSize >= 32) || !(map.chunkSize <= 512)) fail(`chunkSize=${map.chunkSize}: вне 32…512`);
  if (!(map.laneWidth >= 2) || !(map.laneWidth <= 5)) fail(`laneWidth=${map.laneWidth}: вне 2…5`);
  if (!Number.isInteger(map.size)) fail('size должен быть целым числом метров');
  if (!Number.isInteger(map.chunkSize)) fail('chunkSize должен быть целым числом метров');

  const ids = new Set<string>();
  for (let i = 0; i < map.districts.length; i += 1) {
    const district = map.districts[i];
    if (ids.has(district.id)) fail(`район "${district.id}" описан дважды`);
    ids.add(district.id);
  }
  const required = ['center', 'industrial', 'waterfront'] as const;
  for (let i = 0; i < required.length; i += 1) {
    if (!ids.has(required[i])) fail(`в карте нет района "${required[i]}"`);
  }
}

function validateRoads(map: CityMap): void {
  const half = map.size / 2;
  const seen = new Set<string>();
  for (let r = 0; r < map.roads.length; r += 1) {
    const road = map.roads[r];
    if (seen.has(road.id)) fail(`дорога "${road.id}" описана дважды`);
    seen.add(road.id);
    if (road.points.length < 2) fail(`дорога "${road.id}": нужно минимум 2 точки`);
    if (!(road.width >= 6) || !(road.width <= 40)) fail(`дорога "${road.id}": width вне 6…40 м`);
    if (!(road.speed > 0)) fail(`дорога "${road.id}": speed должен быть > 0`);
    for (let i = 0; i + 1 < road.points.length; i += 1) {
      const [x1, z1] = road.points[i];
      const [x2, z2] = road.points[i + 1];
      insideBounds(x1, z1, half, `дорога "${road.id}" точка ${i}`);
      insideBounds(x2, z2, half, `дорога "${road.id}" точка ${i + 1}`);
      if (Math.hypot(x2 - x1, z2 - z1) < 1) fail(`дорога "${road.id}": отрезок #${i} короче 1 м`);
    }
  }

  // Наложение дорог друг на друга: две дороги не могут идти по одной линии.
  for (let a = 0; a < map.roads.length; a += 1) {
    const roadA = map.roads[a];
    for (let b = a + 1; b < map.roads.length; b += 1) {
      const roadB = map.roads[b];
      for (let i = 0; i + 1 < roadA.points.length; i += 1) {
        const [ax, az] = roadA.points[i];
        const [bx, bz] = roadA.points[i + 1];
        for (let j = 0; j + 1 < roadB.points.length; j += 1) {
          const [cx, cz] = roadB.points[j];
          const [dx, dz] = roadB.points[j + 1];
          if (segmentsOverlap(ax, az, bx, bz, cx, cz, dx, dz)) {
            fail(`дороги "${roadA.id}" и "${roadB.id}" наложены друг на друга`);
          }
        }
      }
    }
  }

  // Вода: дороги могут пересекать её только как мост.
  const contact: Contact = { nx: 0, nz: 0, depth: 0 };
  for (let r = 0; r < map.roads.length; r += 1) {
    const road = map.roads[r];
    for (let i = 0; i + 1 < road.points.length; i += 1) {
      const [x1, z1] = road.points[i];
      const [x2, z2] = road.points[i + 1];
      const rect = segmentRect(x1, z1, x2, z2, road.width / 2);
      for (let w = 0; w < map.water.length; w += 1) {
        if (overlaps(rect, toRect(map.water[w]), contact) && road.kind !== 'bridge') {
          fail(`дорога "${road.id}" проходит по воде — разрешён только kind="bridge"`);
        }
      }
    }
  }

  // У каждого пересечения дорог обязан быть узел графа, граф — быть связным.
  const graph = buildRoadGraphFromMap(map);
  if (!graph.stats.connected) {
    fail(`дорожный граф несвязен (${graph.stats.nodes} узлов): проверьте тупики и односторонние улицы`);
  }
  for (let a = 0; a < map.roads.length; a += 1) {
    const roadA = map.roads[a];
    for (let b = a + 1; b < map.roads.length; b += 1) {
      const roadB = map.roads[b];
      for (let i = 0; i + 1 < roadA.points.length; i += 1) {
        const [ax, az] = roadA.points[i];
        const [bx, bz] = roadA.points[i + 1];
        for (let j = 0; j + 1 < roadB.points.length; j += 1) {
          const [cx, cz] = roadB.points[j];
          const [dx, dz] = roadB.points[j + 1];
          const hit = segmentIntersection(ax, az, bx, bz, cx, cz, dx, dz);
          if (!hit) continue;
          const node = graph.nodes[graph.nearestNode(hit.x, hit.z)];
          if (!node || Math.hypot(node.x - hit.x, node.z - hit.z) > 0.2) {
            fail(
              `пересечение "${roadA.id}" и "${roadB.id}" в (${hit.x.toFixed(1)}; ` +
                `${hit.z.toFixed(1)}) не стало узлом графа`,
            );
          }
        }
      }
    }
  }

}

function validateBlocks(
  map: CityMap,
  corridors: readonly Corridor[],
  prefabs: ReadonlyMap<string, PrefabSpec>,
): void {
  const half = map.size / 2;
  const contact: Contact = { nx: 0, nz: 0, depth: 0 };
  const seenIds = new Set<string>();
  const buildingRects: { rect: Rect; id: string }[] = [];
  const content: BlockContent = createBlockContent();
  for (let i = 0; i < map.blocks.length; i += 1) {
    const block = map.blocks[i];
    if (seenIds.has(block.id)) fail(`квартал "${block.id}" описан дважды`);
    seenIds.add(block.id);
    checkRect(block.rect, half, `квартал "${block.id}"`);
    const prefab = prefabs.get(block.prefab);
    if (!prefab) fail(`квартал "${block.id}": нет префаба "${block.prefab}"`);

    // Кварталы не накладываются друг на друга, не заходят в воду и на дороги.
    for (let j = i + 1; j < map.blocks.length; j += 1) {
      if (overlaps(toRect(block.rect), toRect(map.blocks[j].rect), contact)) {
        fail(`кварталы "${block.id}" и "${map.blocks[j].id}" пересекаются`);
      }
    }
    for (let w = 0; w < map.water.length; w += 1) {
      if (overlaps(toRect(block.rect), toRect(map.water[w]), contact)) {
        fail(`квартал "${block.id}" заходит в воду`);
      }
    }
    for (let c = 0; c < corridors.length; c += 1) {
      if (overlaps(toRect(block.rect), corridors[c].rect, contact)) {
        fail(`плита квартала "${block.id}" перекрывает дорогу "${corridors[c].roadId}"`);
      }
    }

    clearBlockContent(content);
    expandPrefab(prefab, block, 0, content);

    for (let b = 0; b < content.buildings.length; b += 1) {
      const building = content.buildings[b];
      const where = `квартал "${block.id}", здание #${b}`;
      const rect: Rect = {
        x: building.x,
        z: building.z,
        hx: building.w / 2,
        hz: building.d / 2,
        angle: 0,
      };
      if (
        Math.abs(building.x - block.rect.x) + building.w / 2 > block.rect.hx + 0.01 ||
        Math.abs(building.z - block.rect.z) + building.d / 2 > block.rect.hz + 0.01
      ) {
        fail(`${where} выходит за плиту квартала`);
      }
      insideBounds(building.x, building.z, half, where);
      for (let c = 0; c < corridors.length; c += 1) {
        if (overlaps(rect, corridors[c].rect, contact)) {
          fail(`${where} стоит на дороге "${corridors[c].roadId}"`);
        }
      }
      for (let w = 0; w < map.water.length; w += 1) {
        if (overlaps(rect, toRect(map.water[w]), contact)) fail(`${where} стоит в воде`);
      }
      for (let k = 0; k < buildingRects.length; k += 1) {
        if (overlaps(rect, buildingRects[k].rect, contact)) {
          fail(`${where} пересекается с ${buildingRects[k].id}`);
        }
      }
      buildingRects.push({ rect, id: where });
    }

    // Коллайдеры пропсов не должны вылезать на проезжую часть.
    for (let c = 0; c < content.colliders.length; c += 1) {
      const body = content.colliders[c];
      const rect: Rect = { x: body.x, z: body.z, hx: body.hx, hz: body.hz, angle: body.angle ?? 0 };
      for (let k = 0; k < corridors.length; k += 1) {
        if (overlaps(rect, corridors[k].rect, contact)) {
          fail(`объект квартала "${block.id}" стоит на дороге "${corridors[k].roadId}"`);
        }
      }
    }
  }
}

function validateGlobalProps(map: CityMap, corridors: readonly Corridor[], colliders: Rect[]): void {
  const half = map.size / 2;
  const contact: Contact = { nx: 0, nz: 0, depth: 0 };
  for (let i = 0; i < map.props.length; i += 1) {
    const prop = map.props[i];
    const where = `пропс "${prop.kind}" #${i}`;
    insideBounds(prop.x, prop.z, half, where);
    const body = createPropCollider(prop);
    if (!body) continue;
    const rect: Rect = { x: body.x, z: body.z, hx: body.hx, hz: body.hz, angle: body.angle ?? 0 };
    colliders.push(rect);
    for (let c = 0; c < corridors.length; c += 1) {
      if (overlaps(rect, corridors[c].rect, contact)) {
        fail(`${where} стоит на дороге "${corridors[c].roadId}"`);
      }
    }
  }
}

function onRoad(map: CityMap, x: number, z: number): boolean {
  for (let r = 0; r < map.roads.length; r += 1) {
    const road = map.roads[r];
    for (let i = 0; i + 1 < road.points.length; i += 1) {
      const [x1, z1] = road.points[i];
      const [x2, z2] = road.points[i + 1];
      if (distanceToSegment(x, z, x1, z1, x2, z2) <= road.width / 2 + ROAD_EPS) return true;
    }
  }
  return false;
}

function validateSpawns(map: CityMap, colliders: readonly Rect[]): void {
  const half = map.size / 2;
  const contact: Contact = { nx: 0, nz: 0, depth: 0 };

  const player = map.spawns.player;
  insideBounds(player.x, player.z, half, 'старт игрока');
  if (!onRoad(map, player.x, player.z)) fail('старт игрока не на проезжей части');

  const all: { x: number; z: number; tag: string; index: number }[] = [];
  for (let i = 0; i < map.spawns.cars.length; i += 1) {
    const spawn = map.spawns.cars[i];
    all.push({ x: spawn.x, z: spawn.z, tag: 'машина', index: i });
  }
  for (let i = 0; i < map.spawns.peds.length; i += 1) {
    const spawn = map.spawns.peds[i];
    all.push({ x: spawn.x, z: spawn.z, tag: 'пешеход', index: i });
  }
  for (let i = 0; i < map.spawns.cops.length; i += 1) {
    const spawn = map.spawns.cops[i];
    all.push({ x: spawn.x, z: spawn.z, tag: 'коп', index: i });
  }

  for (let i = 0; i < all.length; i += 1) {
    const spawn = all[i];
    const where = `спавн ${spawn.tag} #${spawn.index}`;
    insideBounds(spawn.x, spawn.z, half, where);
    if (spawn.tag === 'машина' && !onRoad(map, spawn.x, spawn.z)) {
      fail(`${where} (${spawn.x}; ${spawn.z}) не на проезжей части`);
    }
    for (let c = 0; c < colliders.length; c += 1) {
      if (circleRect(spawn.x, spawn.z, SPAWN_CLEAR_RADIUS, colliders[c], contact)) {
        fail(`${where} (${spawn.x}; ${spawn.z}) стоит в препятствии`);
      }
    }
  }

  for (let i = 0; i < map.landmarks.length; i += 1) {
    const landmark = map.landmarks[i];
    insideBounds(landmark.x, landmark.z, half, `ориентир "${landmark.id}"`);
    if (!(landmark.radius > 0)) fail(`ориентир "${landmark.id}": radius должен быть > 0`);
  }
  for (let i = 0; i < map.missions.length; i += 1) {
    const mission = map.missions[i];
    insideBounds(mission.x, mission.z, half, `миссия "${mission.id}"`);
    if (!(mission.radius > 0)) fail(`миссия "${mission.id}": radius должен быть > 0`);
  }
}

/** Полная проверка карты. Бросает Error с понятной причиной. */
export function validateCityMap(map: CityMap): void {
  validateBasics(map);
  const half = map.size / 2;

  for (let i = 0; i < map.water.length; i += 1) {
    checkRect(map.water[i], half, `вода #${i}`);
  }

  const corridors = collectCorridors(map);
  const prefabs = indexPrefabs(map);
  validateBlocks(map, corridors, prefabs);

  const colliders: Rect[] = [];
  validateGlobalProps(map, corridors, colliders);

  // Здания кварталов тоже участвуют в проверке свободных спавнов.
  const content = createBlockContent();
  for (let i = 0; i < map.blocks.length; i += 1) {
    const block = map.blocks[i];
    const prefab = prefabs.get(block.prefab);
    if (!prefab) continue;
    clearBlockContent(content);
    expandPrefab(prefab, block, 0, content);
    for (let c = 0; c < content.colliders.length; c += 1) {
      const body = content.colliders[c];
      colliders.push({ x: body.x, z: body.z, hx: body.hx, hz: body.hz, angle: body.angle ?? 0 });
    }
  }

  validateRoads(map);
  validateSpawns(map, colliders);
}
