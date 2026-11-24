// ---------------------------------------------------------------------------
// M6. Мини-карта на Canvas 2D: вода, кварталы, дороги, игрок, копы и маркер
// заказа. Геометрия приходит снимком из world.minimap — ui не импортирует
// world/** (правило зависимостей ARCHITECTURE §4), только структурные типы.
//
// Карта север-вверх, игрок в центре, масштаб — из config/ui.ts.
// Перерисовка вызывается с частотой HUD (10 Гц), не каждый кадр.
// ---------------------------------------------------------------------------

import type { UiConfig } from '../config/ui';
import type { I18n } from './i18n';

export interface MinimapRect {
  readonly x: number;
  readonly z: number;
  readonly hx: number;
  readonly hz: number;
}

export interface MinimapRoad {
  readonly x1: number;
  readonly z1: number;
  readonly x2: number;
  readonly z2: number;
  readonly width: number;
  readonly arterial: boolean;
}

export interface MinimapBlock {
  readonly x: number;
  readonly z: number;
  readonly hx: number;
  readonly hz: number;
  readonly kind: string;
}

export interface MinimapBounds {
  readonly minX: number;
  readonly minZ: number;
  readonly maxX: number;
  readonly maxZ: number;
}

/** Структурно совпадает с world.minimap (MinimapData). */
export interface MinimapSource {
  readonly bounds: MinimapBounds;
  readonly roads: readonly MinimapRoad[];
  readonly blocks: readonly MinimapBlock[];
  readonly water: readonly MinimapRect[];
}

export type MinimapMarkerKind = 'start' | 'target' | 'checkpoint' | 'garage';

export interface MinimapMarker {
  readonly x: number;
  readonly z: number;
  readonly kind: MinimapMarkerKind;
}

export interface MinimapFrame {
  readonly playerX: number;
  readonly playerZ: number;
  readonly playerHeading: number;
  readonly cops: readonly { readonly x: number; readonly z: number }[];
  readonly markers: readonly MinimapMarker[];
}

export interface Minimap {
  readonly canvas: HTMLCanvasElement;
  update(frame: MinimapFrame): void;
  resize(): void;
  dispose(): void;
}

const PARK_KINDS = new Set(['park', 'promenade']);
const EDGE_MARGIN = 12;

function roundedRectPath(ctx: CanvasRenderingContext2D, size: number, radius: number): void {
  const r = Math.min(radius, size / 2);
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
}

export function createMinimap(host: HTMLElement, source: MinimapSource, config: UiConfig, _i18n: I18n): Minimap {
  const canvas = document.createElement('canvas');
  canvas.className = 'tmc-minimap';
  canvas.id = 'tmc-minimap';
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const colors = config.colors;
  const range = config.layout.minimapRange;
  let cssSize = 0;
  let dpr = 1;

  const resize = (): void => {
    const size = Math.max(64, Math.round(host.clientWidth || config.layout.minimapSize));
    cssSize = size;
    dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
  };

  const draw = (frame: MinimapFrame): void => {
    if (!ctx) return;
    if (host.clientWidth && Math.round(host.clientWidth) !== cssSize) resize();
    if (cssSize === 0) resize();

    const size = cssSize;
    const half = size / 2;
    const scale = size / range;
    const px = frame.playerX;
    const pz = frame.playerZ;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    // Фон и маска по скруглённому прямоугольнику.
    ctx.save();
    roundedRectPath(ctx, size, 10);
    ctx.clip();

    ctx.fillStyle = colors.mapBackground;
    ctx.fillRect(0, 0, size, size);

    const toX = (wx: number): number => half + (wx - px) * scale;
    const toY = (wz: number): number => half + (wz - pz) * scale;
    const pad = 8;

    // Вода.
    ctx.fillStyle = colors.mapWater;
    for (let i = 0; i < source.water.length; i += 1) {
      const water = source.water[i];
      const x = toX(water.x - water.hx);
      const y = toY(water.z - water.hz);
      const w = water.hx * 2 * scale;
      const h = water.hz * 2 * scale;
      if (x > size + pad || y > size + pad || x + w < -pad || y + h < -pad) continue;
      ctx.fillRect(x, y, w, h);
    }

    // Кварталы: парки и променад — зелёные, застройка — тёмная плита.
    for (let i = 0; i < source.blocks.length; i += 1) {
      const block = source.blocks[i];
      const x = toX(block.x - block.hx);
      const y = toY(block.z - block.hz);
      const w = block.hx * 2 * scale;
      const h = block.hz * 2 * scale;
      if (x > size + pad || y > size + pad || x + w < -pad || y + h < -pad) continue;
      ctx.fillStyle = PARK_KINDS.has(block.kind) ? colors.mapPark : colors.mapBlock;
      ctx.fillRect(x, y, w, h);
    }

    // Дороги: обычные, затем магистрали поверх.
    const drawRoads = (arterial: boolean): void => {
      ctx.strokeStyle = arterial ? colors.mapRoadArterial : colors.mapRoad;
      ctx.lineCap = 'butt';
      for (let i = 0; i < source.roads.length; i += 1) {
        const road = source.roads[i];
        if (road.arterial !== arterial) continue;
        const x1 = toX(road.x1);
        const y1 = toY(road.z1);
        const x2 = toX(road.x2);
        const y2 = toY(road.z2);
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        if (maxX < -pad || minX > size + pad || maxY < -pad || minY > size + pad) continue;
        ctx.lineWidth = Math.max(1.2, road.width * scale * 0.8);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    };
    drawRoads(false);
    drawRoads(true);

    // Копы.
    ctx.fillStyle = colors.mapCop;
    for (let i = 0; i < frame.cops.length; i += 1) {
      const cop = frame.cops[i];
      const x = toX(cop.x);
      const y = toY(cop.z);
      if (x < -pad || y < -pad || x > size + pad || y > size + pad) continue;
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Маркеры заказа: ромб в кадре, стрелка у края, если цель далеко.
    const pulse = 0.65 + Math.sin(performance.now() / 220) * 0.35;
    for (let i = 0; i < frame.markers.length; i += 1) {
      const marker = frame.markers[i];
      let dx = (marker.x - px) * scale;
      let dy = (marker.z - pz) * scale;
      const limit = half - EDGE_MARGIN;
      const outside = Math.abs(dx) > limit || Math.abs(dy) > limit;
      const color = marker.kind === 'garage' ? colors.accent : colors.mission;
      if (outside) {
        const factor = limit / Math.max(Math.abs(dx), Math.abs(dy));
        dx *= factor;
        dy *= factor;
        const angle = Math.atan2(dy, dx);
        ctx.save();
        ctx.translate(half + dx, half + dy);
        ctx.rotate(angle);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(7, 0);
        ctx.lineTo(-4, -5);
        ctx.lineTo(-4, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else {
        ctx.save();
        ctx.translate(half + dx, half + dy);
        ctx.rotate(Math.PI / 4);
        ctx.globalAlpha = pulse;
        ctx.fillStyle = color;
        ctx.fillRect(-4, -4, 8, 8);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    // Игрок: треугольник по направлению движения (heading 0 → вниз экрана).
    const fx = Math.sin(frame.playerHeading);
    const fy = Math.cos(frame.playerHeading);
    const nx = -fy;
    const ny = fx;
    ctx.fillStyle = colors.mapPlayer;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(half + fx * 8, half + fy * 8);
    ctx.lineTo(half - fx * 5 + nx * 5, half - fy * 5 + ny * 5);
    ctx.lineTo(half - fx * 5 - nx * 5, half - fy * 5 - ny * 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Север: карта не вращается, поэтому метка статична.
    ctx.fillStyle = 'rgba(230, 237, 243, 0.7)';
    ctx.font = `bold ${Math.max(9, Math.round(size * 0.07))}px "Segoe UI", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('N', half, 3);
    ctx.restore();

    ctx.strokeStyle = colors.mapBorder;
    ctx.lineWidth = 1;
    roundedRectPath(ctx, size, 10);
    ctx.stroke();
  };

  resize();
  window.addEventListener('resize', resize);

  return {
    canvas,
    update(frame: MinimapFrame): void {
      draw(frame);
    },
    resize,
    dispose(): void {
      window.removeEventListener('resize', resize);
      canvas.remove();
    },
  };
}
