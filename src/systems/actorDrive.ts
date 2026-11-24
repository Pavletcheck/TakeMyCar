// ---------------------------------------------------------------------------
// M8. Водитель-актёр: простая езда по дорожному графу для машин событий
// (убегающий преступник). Не физика и не трафик: используется готовая
// VehiclePhysics и driveTowards из systems/traffic, чтобы не плодить модель.
//
// Никаких аллокаций в шаге: состояние актёра — обычный объект, все буферы
// создаются при спавне. Выход за ребро ловится проекцией позиции.
// ---------------------------------------------------------------------------

import { clamp, normalizeAngle } from '../core/math';
import type { RandomSource } from '../core/rng';
import type { VehicleState } from '../entities/vehicle';
import type { RoadGraph } from '../world/types';
import { driveTowards } from './traffic';
import type { VehicleInput, VehiclePhysics } from './vehiclePhysics';

/** Актёр, который сам едет по рёбрам графа. */
export interface RoadActorState {
  readonly vehicle: VehicleState;
  edge: number;
  lane: number;
  /** Проекция на ребро 0..1. */
  t: number;
  /** Целевая скорость, м/с. */
  speed: number;
  stuck: number;
  readonly input: VehicleInput;
}

const LOOK_AHEAD = 12;
const OFF_EDGE = 16;

export class RoadActorDriver {
  private readonly graph: RoadGraph;
  private readonly physics: VehiclePhysics;
  private readonly rng: RandomSource;
  private readonly outgoing: number[][] = [];
  private readonly laneScratch = { x: 0, z: 0 };

  constructor(graph: RoadGraph, physics: VehiclePhysics, rng: RandomSource) {
    this.graph = graph;
    this.physics = physics;
    this.rng = rng;
    for (let i = 0; i < graph.nodes.length; i += 1) this.outgoing.push([]);
    for (let e = 0; e < graph.edges.length; e += 1) this.outgoing[graph.edges[e].from].push(e);
  }

  /** Актёр стартует на ближайшем ребре к машине. */
  create(vehicle: VehicleState, speed: number): RoadActorState {
    let edge = this.graph.nearestEdge(vehicle.transform.x, vehicle.transform.z);
    if (edge < 0) edge = 0;
    const laneCount = this.graph.edges[edge]?.lanes ?? 1;
    return {
      vehicle,
      edge,
      lane: clamp(Math.floor(this.rng() * laneCount), 0, laneCount - 1),
      t: 0.2,
      speed,
      stuck: 0,
      input: { throttle: 0, brake: 0, steer: 0, handbrake: false },
    };
  }

  step(actor: RoadActorState, dt: number): void {
    const vehicle = actor.vehicle;
    if (vehicle.wrecked || vehicle.driver >= 0) return;
    const transform = vehicle.transform;
    let edge = this.graph.edges[actor.edge];
    if (!edge) {
      this.reassign(actor);
      edge = this.graph.edges[actor.edge];
      if (!edge) return;
    }

    const from = this.graph.nodes[edge.from];
    const dirX = (this.graph.nodes[edge.to].x - from.x) / (edge.length || 1);
    const dirZ = (this.graph.nodes[edge.to].z - from.z) / (edge.length || 1);
    const along = (transform.x - from.x) * dirX + (transform.z - from.z) * dirZ;
    const lateral = (transform.x - from.x) * dirZ - (transform.z - from.z) * dirX;
    if (along < -8 || along > edge.length + 8 || Math.abs(lateral) > OFF_EDGE) {
      this.reassign(actor);
      return;
    }

    actor.t = clamp(along / (edge.length || 1), 0, 1);
    if (actor.t >= 0.94) this.nextEdge(actor);

    const lookT = clamp(actor.t + LOOK_AHEAD / (edge.length || 1), 0, 1);
    const target = this.graph.lanePoint(actor.edge, lookT, actor.lane, this.laneScratch);
    const speedBefore = Math.hypot(transform.vx, transform.vz);
    driveTowards(
      actor.input,
      transform.x,
      transform.z,
      transform.heading,
      transform.vx,
      transform.vz,
      target.x,
      target.z,
      actor.speed,
    );
    this.physics.step(vehicle, actor.input, dt);

    const after = Math.hypot(transform.vx, transform.vz);
    if (after < 1.2) actor.stuck += dt;
    else actor.stuck = Math.max(0, actor.stuck - dt * 0.5);
    // Застрял (в стене/пробке) — принудительно берём ближайшее ребро заново.
    if (actor.stuck > 3 && speedBefore < 1.5) {
      this.reassign(actor);
      actor.stuck = 0;
    }
  }

  /** Угол движения актёра (для маркера/фар), радианы. */
  heading(actor: RoadActorState): number {
    return actor.vehicle.transform.heading;
  }

  private reassign(actor: RoadActorState): void {
    const edge = this.graph.nearestEdge(
      actor.vehicle.transform.x,
      actor.vehicle.transform.z,
    );
    if (edge < 0) return;
    actor.edge = edge;
    actor.t = 0;
  }

  private nextEdge(actor: RoadActorState): void {
    const current = this.graph.edges[actor.edge];
    if (!current) return;
    const options = this.outgoing[current.to];
    if (!options || options.length === 0) {
      // Тупик: разворот на обратное ребро.
      const back = this.outgoing[current.from];
      for (let i = 0; i < back.length; i += 1) {
        if (back[i] === actor.edge) continue;
        actor.edge = back[i];
        actor.t = 0;
        return;
      }
      return;
    }
    let choice = -1;
    let bestTurn = Number.POSITIVE_INFINITY;
    for (let i = 0; i < options.length; i += 1) {
      const candidate = this.graph.edges[options[i]];
      if (!candidate || candidate.to === current.from) continue;
      const turn = Math.abs(normalizeAngle(candidate.heading - current.heading));
      if (turn < bestTurn) {
        bestTurn = turn;
        choice = options[i];
      }
    }
    if (choice < 0) choice = options[Math.floor(this.rng() * options.length) % options.length];
    actor.edge = choice;
    actor.t = 0;
    const lanes = this.graph.edges[choice]?.lanes ?? 1;
    actor.lane = clamp(actor.lane, 0, lanes - 1);
  }
}
