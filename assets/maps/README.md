# assets/maps — данные мира для отладки

Здесь лежат **экспортированные данные**, а не рантайм-ассеты. Игра ничего
не загружает из этой папки: по правилам проекта в рантайме нет внешних
запросов, а граф строится процедурно из `src/world/roadGraph.ts`.

## `road-graph.json`

Экспорт дорожного графа M3 для сида по умолчанию `20261123`
(формат `RoadGraphData`, `version: 1`):

- `nodes` — 121 узел сетки (11×11), у части узлов `lights: true` и фаза;
- `edges` — направленные рёбра с `lanes`, `speed` (м/с), `oneWay`,
  `arterial` и `laneWidth`;
- длины, `axis`, `laneOffsets` и `heading` на загрузке пересчитываются
  из координат (`deserializeRoadGraph`).

Актуальные числа для этого сида: **121 узел, 420 направленных рёбер,
20 односторонних, 16 перекрёстков со светофором, граф связен**.

## Как перегенерировать

1. Открыть игру с отладочным флагом: `?debug=1`.
2. В консоли браузера вызвать `window.__tmc.exportRoadGraph()`.
3. Сохранить полученную строку в `assets/maps/road-graph.json`.

Тот же JSON можно получить в headless-проверке через
`serializeRoadGraph(createWorld(seed, WORLD).roadGraph)`.

## Как загрузить обратно

```ts
import { deserializeRoadGraph } from '../world/roadGraph';

const graph = deserializeRoadGraph(jsonString);
graph.nearestNode(x, z);          // индекс ближайшего узла
graph.lanePoint(edge, t, lane, out); // центр полосы, t ∈ [0,1]
graph.edgeHeading(edge);          // направление движения
graph.isConnected();              // связность направленного графа
```

Файл нужен QA и трафику (M5) как эталон формата: дороги, полосы и
ограничения скорости не должны расходиться между миром и ИИ.
