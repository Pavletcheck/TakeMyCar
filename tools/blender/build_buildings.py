"""Здания TakeMyCar: модульный кит (задел для `world`) и готовые дома-блоки.
 
Запуск:
    blender.exe --background --factory-startup --python tools/blender/build_buildings.py

M7.1 — готовые здания под замену коробок в cityView:
- `bld_block_small` (канон 30 × 28 × 8), `bld_block_mid` (30 × 30 × 16),
  `bld_block_tall` (34 × 34 × 28), `bld_tower` (44 × 36 × 44) — LOD0 390–600 tris;
- канон снят с медиан карты (дома в `city.json` — 22–60 м в плане), поэтому
  инстанс масштабируется почти 1:1 и окна/крыша не растягиваются;
- `*_lod1` — силуэт 72 tris (коробка с уступом + крыша цветом + парапет),
  пивот и габарит те же;
- вершинные цвета — МНОЖИТЕЛИ: цвет фасада приходит из `instanceColor`
  (палитра района), окна/крыша/парапет запечены относительными тонами;
- крыша, парапет, ленты окон, простенки, надстройки, вывеска — в модели.
 
Кит (`bld_wall_a` и др.) остаётся: `world` пока собирает дома готовыми блоками.
 
Соглашения общие: 1 unit = 1 m, пивот по центру основания (y = 0), +Z — фасад.
"""

from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import lib_lowpoly as lp
from lib_lowpoly import Part, rgb, shade

FACADE = rgb(0x9aa4b2)
FACADE_DARK = rgb(0x7d8e9f)
FACADE_WARM = rgb(0xa39887)
WINDOW = rgb(0x24404f)
WINDOW_LIT = rgb(0x3d6d80)
CONCRETE = rgb(0x6f7080)
ROOF = rgb(0x5d6570)
PARAPET = rgb(0x7a7f8a)
NEON = rgb(0xff5c9a)
NEON_COLD = rgb(0x4dd0e1)
SIGN_BOARD = rgb(0x232a33)


def build_wall() -> Part:
    """Фасадная панель 8 × 4 × 0.4 м с двумя лентами окон и цоколем."""
    part = Part()
    part.chamfer_box((0.0, 2.0, 0.0), (8.0, 4.0, 0.40), FACADE, chamfer=0.06)
    part.box((0.0, 0.25, 0.21), (8.0, 0.50, 0.04), shade(FACADE, 0.82))
    for y in (1.55, 3.05):
        part.box((0.0, y, 0.21), (7.2, 0.90, 0.05), WINDOW)
        part.box((0.0, y + 0.02, 0.235), (7.0, 0.62, 0.02), WINDOW_LIT)
        for x in (-2.4, -0.8, 0.8, 2.4):
            part.box((x, y, 0.245), (0.10, 0.90, 0.03), shade(FACADE, 0.7))
    # Венчающий карниз.
    part.box((0.0, 3.92, 0.0), (8.2, 0.18, 0.50), shade(FACADE, 0.88))
    return part


def build_corner() -> Part:
    """Угловой модуль: две панели 4 × 4 м под 90°, скошенный угол."""
    part = Part()
    part.chamfer_box((0.0, 2.0, 0.0), (4.0, 4.0, 0.40), FACADE_WARM, chamfer=0.06)
    part.chamfer_box((0.0, 2.0, 2.0), (4.0, 4.0, 0.40), FACADE_WARM, chamfer=0.06)
    part.box((0.0, 0.25, 0.21), (4.0, 0.50, 0.04), shade(FACADE_WARM, 0.82))
    part.box((0.0, 0.25, 2.21), (4.0, 0.50, 0.04), shade(FACADE_WARM, 0.82))
    for y in (1.55, 3.05):
        part.box((-1.0, y, 0.21), (1.6, 0.90, 0.05), WINDOW)
        part.box((1.0, y, 2.21), (1.6, 0.90, 0.05), WINDOW)
        part.box((0.0, y, 4.21), (3.2, 0.90, 0.05), WINDOW)
    part.box((0.0, 3.92, 0.0), (4.2, 0.18, 0.50), shade(FACADE_WARM, 0.88))
    part.box((0.0, 3.92, 2.0), (4.2, 0.18, 0.50), shade(FACADE_WARM, 0.88))
    return part


def build_roof() -> Part:
    """Крыша 8 × 8 м: плита, парапет по периметру, вентиляция."""
    part = Part()
    part.chamfer_box((0.0, 0.15, 0.0), (8.0, 0.30, 8.0), ROOF, chamfer=0.08)
    for sign in (-1.0, 1.0):
        part.box((0.0, 0.45, sign * 3.85), (8.0, 0.40, 0.30), PARAPET)
        part.box((sign * 3.85, 0.45, 0.0), (0.30, 0.40, 8.0), PARAPET)
    part.box((0.0, 0.70, 3.85), (8.2, 0.10, 0.42), shade(PARAPET, 0.8))
    part.box((0.0, 0.70, -3.85), (8.2, 0.10, 0.42), shade(PARAPET, 0.8))
    part.chamfer_box((1.6, 0.75, -1.4), (1.6, 0.90, 1.6), CONCRETE, chamfer=0.05)
    part.cyl_y((-2.2, 0.68, 1.6), 0.35, 0.76, CONCRETE, segments=8)
    return part


def build_parapet() -> Part:
    """Полоса парапета 4 × 0.8 м для крыш произвольной длины."""
    part = Part()
    part.box((0.0, 0.35, 0.0), (4.0, 0.70, 0.32), PARAPET)
    part.box((0.0, 0.74, 0.0), (4.2, 0.08, 0.42), shade(PARAPET, 0.82))
    part.box((0.0, 0.05, 0.0), (4.0, 0.10, 0.38), shade(PARAPET, 0.7))
    return part


def build_sign() -> Part:
    """Вывеска 3 × 1 м на кронштейнах: корпус, неоновая рамка, буквы-планки."""
    part = Part()
    part.chamfer_box((0.0, 2.50, 0.55), (3.0, 1.0, 0.26), SIGN_BOARD, chamfer=0.04)
    part.box((0.0, 2.92, 0.69), (2.86, 0.07, 0.03), NEON)
    part.box((0.0, 2.08, 0.69), (2.86, 0.07, 0.03), NEON_COLD)
    part.box((-1.46, 2.50, 0.69), (0.07, 0.90, 0.03), NEON_COLD)
    part.box((1.46, 2.50, 0.69), (0.07, 0.90, 0.03), NEON_COLD)
    for i, x in enumerate((-1.0, -0.4, 0.2, 0.8)):
        part.box((x, 2.50, 0.70), (0.30, 0.34, 0.02), NEON if i % 2 == 0 else NEON_COLD)
    for sign in (-1.0, 1.0):
        part.box((sign * 1.1, 2.92, 0.24), (0.08, 0.08, 0.62), shade(SIGN_BOARD, 1.4))
    return part


MODULES = {
    'bld_wall_a': build_wall,
    'bld_corner_a': build_corner,
    'bld_roof_a': build_roof,
    'bld_parapet_a': build_parapet,
    'bld_sign_a': build_sign,
}

# --- готовые дома (M7.1) ----------------------------------------------------
#
# Цвета ниже — множители: фасад белый (его красит instanceColor из палитры
# района), окна тёмные, крыша/парапет — приглушённый серый.
#
# Канонический габарит подобран по медианам карты (`assets/maps/city.json`):
# город строит дома 22–60 м в плане, поэтому модели 10–16 м растягивались
# инстансом в 2.5–3 раза и крышные детали «разъезжались». Теперь масштаб
# инстанса близок к 1: окна, парапет и надстройки держат реальный размер.

WHITE_FACADE = (1.0, 1.0, 1.0, 1.0)
WINDOW_DARK = shade(WHITE_FACADE, 0.24)
WINDOW_LIT = shade(WHITE_FACADE, 0.42)
ROOF_MUL = shade(WHITE_FACADE, 0.46)
PARAPET_MUL = shade(WHITE_FACADE, 0.88)
PARAPET_CAP = shade(WHITE_FACADE, 0.98)
PIER_MUL = shade(WHITE_FACADE, 0.92)
PLINTH_MUL = shade(WHITE_FACADE, 0.7)
UNIT_DARK = shade(WHITE_FACADE, 0.56)
UNIT_LIGHT = shade(WHITE_FACADE, 0.8)
PIPE_MUL = shade(WHITE_FACADE, 0.64)
DOOR_MUL = shade(WHITE_FACADE, 0.2)
CANOPY_MUL = shade(WHITE_FACADE, 0.92)
SIGN_ACCENT = rgb(0xff6a4a)
SIGN_COLD = rgb(0x5ec8db)

# Высота парапета и доля высоты, отданная крыше (надстройки не выходят за H).
PARAPET_H = 0.55
ROOF_SHARE = 0.2


def band_ring(part: Part, half_w: float, half_d: float, y: float, height: float, thickness: float, color) -> None:
    """Лента окна по периметру: 4 тонкие коробки, чуть выступают из фасада."""
    part.box((0.0, y, half_d), (half_w * 2, height, thickness), color)
    part.box((0.0, y, -half_d), (half_w * 2, height, thickness), color)
    part.box((half_w, y, 0.0), (thickness, height, half_d * 2), color)
    part.box((-half_w, y, 0.0), (thickness, height, half_d * 2), color)


def pier_ring(part: Part, half_w: float, half_d: float, y0: float, y1: float, color) -> None:
    """Вертикальные простенки на фасадах ±Z: дробят ленты окон на секции.

    Только южный/северный фасад (их видно с ортокамеры) — 6 коробок, 72 tris.
    """
    height = y1 - y0
    y = (y0 + y1) / 2
    for x in (-half_w * 0.6, 0.0, half_w * 0.6):
        part.box((x, y, half_d), (0.5, height, 0.32), color)
        part.box((x, y, -half_d), (0.5, height, 0.32), color)


def parapet_ring(part: Part, half_w: float, half_d: float, y: float, height: float, thickness: float, color) -> None:
    """Парапет по краю крыши внутри габарита дома; верхняя грань светлее."""
    part.box((0.0, y, half_d - thickness / 2), (half_w * 2, height, thickness), color, top_color=PARAPET_CAP)
    part.box((0.0, y, -(half_d - thickness / 2)), (half_w * 2, height, thickness), color, top_color=PARAPET_CAP)
    part.box((half_w - thickness / 2, y, 0.0), (thickness, height, (half_d - thickness) * 2), color, top_color=PARAPET_CAP)
    part.box((-(half_w - thickness / 2), y, 0.0), (thickness, height, (half_d - thickness) * 2), color, top_color=PARAPET_CAP)


def roof_clutter(part: Part, half_w: float, half_d: float, floor_y: float, top_y: float, tall: bool) -> None:
    """Крыша: выход на кровлю, кондиционеры, вентиляция, люк, бак.

    Всё в пределах габарита (top_y = H модели), чтобы инстанс не «вырастал».
    """
    stair_h = top_y - floor_y
    # Выход на кровлю — у дальнего от входа угла.
    part.box(
        (-half_w * 0.5, floor_y + stair_h / 2, -half_d * 0.45),
        (half_w * 0.42, stair_h, half_d * 0.38),
        UNIT_LIGHT,
        top_color=ROOF_MUL,
    )
    # Кондиционеры/вентиляция: две-три штуки, разного размера.
    part.box((half_w * 0.45, floor_y + 0.4, -half_d * 0.35), (half_w * 0.34, 0.8, half_d * 0.24), UNIT_DARK, top_color=UNIT_LIGHT)
    part.box((half_w * 0.2, floor_y + 0.3, half_d * 0.5), (half_w * 0.26, 0.6, half_d * 0.2), UNIT_DARK, top_color=UNIT_LIGHT)
    # Люк и вентстояк.
    part.box((-half_w * 0.62, floor_y + 0.18, half_d * 0.5), (1.8, 0.36, 1.8), UNIT_DARK, top_color=UNIT_LIGHT)
    part.cyl_y((half_w * 0.62, floor_y + 0.6, half_d * 0.42), 0.6, 1.2, PIPE_MUL, segments=6)
    if tall:
        # Водяной бак на ножках — читается сверху как круг.
        part.cyl_y((-half_w * 0.1, floor_y + 1.3, -half_d * 0.1), 1.5, 2.0, UNIT_LIGHT, segments=8)


def block_lod1(width: float, depth: float, height: float, tier: float, tier_scale: float) -> Part:
    """Силуэт LOD1: коробка с уступом, крыша цветом сверху и парапет (72 tris)."""
    part = Part()
    split = height * tier
    part.box((0.0, split / 2, 0.0), (width, split, depth), WHITE_FACADE, top_color=ROOF_MUL)
    upper = height - split
    part.box(
        (0.0, split + upper / 2, 0.0),
        (width * tier_scale, upper, depth * tier_scale),
        WHITE_FACADE,
        top_color=ROOF_MUL,
    )
    parapet_ring(part, width * tier_scale / 2, depth * tier_scale / 2, height - PARAPET_H / 2, PARAPET_H, 0.4, PARAPET_MUL)
    return part


def build_block_small(detail: int) -> Part:
    """Магазин/офис: 30 × 28 × 8, две ленты окон, вывеска, козырёк, крыша."""
    width, depth, height = 30.0, 28.0, 8.0
    if detail == 1:
        return block_lod1(width, depth, height, 0.62, 0.9)
    half_w, half_d = width / 2, depth / 2
    roof_y = height * (1.0 - ROOF_SHARE)
    part = Part()
    part.box((0.0, 0.35, 0.0), (width, 0.7, depth), PLINTH_MUL, top_color=PLINTH_MUL)
    part.chamfer_box(
        (0.0, (0.7 + roof_y) / 2, 0.0),
        (width - 0.4, roof_y - 0.7, depth - 0.4),
        WHITE_FACADE,
        chamfer=0.14,
        top_color=ROOF_MUL,
    )
    band_ring(part, half_w - 0.2, half_d - 0.2, 3.1, 1.2, 0.18, WINDOW_DARK)
    band_ring(part, half_w - 0.2, half_d - 0.2, 5.6, 1.2, 0.18, WINDOW_LIT)
    pier_ring(part, half_w - 0.2, half_d - 0.2, 0.9, roof_y, PIER_MUL)
    parapet_ring(part, half_w, half_d, roof_y + PARAPET_H / 2, PARAPET_H, 0.45, PARAPET_MUL)
    roof_clutter(part, half_w, half_d, roof_y, height, False)
    # Вход, козырёк и вывеска — фасад +Z.
    part.box((0.0, 1.5, half_d - 0.1), (2.6, 3.0, 0.2), DOOR_MUL)
    part.box((0.0, 3.3, half_d - 0.8), (6.0, 0.24, 1.6), CANOPY_MUL)
    part.box((5.0, 4.2, half_d - 0.09), (7.0, 1.3, 0.18), SIGN_ACCENT)
    part.box((-7.5, 4.2, half_d - 0.08), (4.0, 1.0, 0.16), SIGN_COLD)
    return part


def build_block_mid(detail: int) -> Part:
    """Офис: 30 × 30 × 16, уступ, три ленты окон, вывеска над входом."""
    width, depth, height = 30.0, 30.0, 16.0
    if detail == 1:
        return block_lod1(width, depth, height, 0.7, 0.86)
    half_w, half_d = width / 2, depth / 2
    roof_y = height * (1.0 - ROOF_SHARE)
    split = roof_y * 0.72
    upper_scale = 0.88
    part = Part()
    part.box((0.0, 0.35, 0.0), (width, 0.7, depth), PLINTH_MUL, top_color=PLINTH_MUL)
    part.chamfer_box((0.0, (0.7 + split) / 2, 0.0), (width - 0.4, split - 0.7, depth - 0.4), WHITE_FACADE, chamfer=0.14, top_color=ROOF_MUL)
    part.chamfer_box(
        (0.0, (split + roof_y) / 2, 0.0),
        (width * upper_scale, roof_y - split, depth * upper_scale),
        shade(WHITE_FACADE, 0.97),
        chamfer=0.12,
        top_color=ROOF_MUL,
    )
    band_ring(part, half_w - 0.2, half_d - 0.2, 3.2, 1.3, 0.18, WINDOW_DARK)
    band_ring(part, half_w - 0.2, half_d - 0.2, 6.8, 1.3, 0.18, WINDOW_LIT)
    band_ring(part, half_w - 0.2, half_d - 0.2, 10.0, 1.3, 0.18, WINDOW_DARK)
    band_ring(part, half_w * upper_scale - 0.2, half_d * upper_scale - 0.2, 12.6, 1.1, 0.18, WINDOW_LIT)
    pier_ring(part, half_w - 0.2, half_d - 0.2, 0.9, split, PIER_MUL)
    parapet_ring(part, half_w * upper_scale, half_d * upper_scale, roof_y + PARAPET_H / 2, PARAPET_H, 0.45, PARAPET_MUL)
    roof_clutter(part, half_w * upper_scale, half_d * upper_scale, roof_y, height, False)
    part.box((0.0, 1.7, half_d - 0.1), (3.0, 3.4, 0.2), DOOR_MUL)
    part.box((0.0, 3.7, half_d - 0.9), (7.0, 0.26, 1.8), CANOPY_MUL)
    part.box((6.0, 5.2, half_d - 0.09), (6.0, 1.4, 0.18), SIGN_ACCENT)
    return part


def build_block_tall(detail: int) -> Part:
    """Высотка: 34 × 34 × 28, три объёма, пять лент окон, крыша с баком."""
    width, depth, height = 34.0, 34.0, 28.0
    if detail == 1:
        return block_lod1(width, depth, height, 0.66, 0.82)
    half_w, half_d = width / 2, depth / 2
    roof_y = height * (1.0 - ROOF_SHARE)
    s1, s2 = 0.92, 0.78
    y1 = roof_y * 0.62
    y2 = roof_y * 0.86
    part = Part()
    part.box((0.0, 0.4, 0.0), (width, 0.8, depth), PLINTH_MUL, top_color=PLINTH_MUL)
    part.chamfer_box((0.0, (0.8 + y1) / 2, 0.0), (width - 0.4, y1 - 0.8, depth - 0.4), WHITE_FACADE, chamfer=0.16, top_color=ROOF_MUL)
    part.chamfer_box((0.0, (y1 + y2) / 2, 0.0), (width * s1, y2 - y1, depth * s1), shade(WHITE_FACADE, 0.97), chamfer=0.14, top_color=ROOF_MUL)
    part.chamfer_box(
        (0.0, (y2 + roof_y) / 2, 0.0),
        (width * s2, roof_y - y2, depth * s2),
        shade(WHITE_FACADE, 0.93),
        chamfer=0.12,
        top_color=ROOF_MUL,
    )
    band_ring(part, half_w - 0.2, half_d - 0.2, 3.6, 1.4, 0.18, WINDOW_DARK)
    band_ring(part, half_w - 0.2, half_d - 0.2, 7.8, 1.4, 0.18, WINDOW_LIT)
    band_ring(part, half_w - 0.2, half_d - 0.2, 12.0, 1.4, 0.18, WINDOW_DARK)
    band_ring(part, half_w * s1 - 0.2, half_d * s1 - 0.2, 16.2, 1.3, 0.18, WINDOW_LIT)
    pier_ring(part, half_w - 0.2, half_d - 0.2, 1.0, y1, PIER_MUL)
    parapet_ring(part, half_w * s2, half_d * s2, roof_y + PARAPET_H / 2, PARAPET_H, 0.45, PARAPET_MUL)
    roof_clutter(part, half_w * s2, half_d * s2, roof_y, height, True)
    part.box((0.0, 2.0, half_d - 0.11), (3.4, 4.0, 0.22), DOOR_MUL)
    part.box((0.0, 4.3, half_d - 1.0), (8.0, 0.28, 2.0), CANOPY_MUL)
    return part


def build_tower(detail: int) -> Part:
    """Доминанта центра: 44 × 36 × 44, четыре объёма, башня с баком и антенной."""
    width, depth, height = 44.0, 36.0, 44.0
    if detail == 1:
        return block_lod1(width, depth, height, 0.6, 0.8)
    half_w, half_d = width / 2, depth / 2
    roof_y = height * (1.0 - ROOF_SHARE)
    s1, s2, s3 = 0.86, 0.68, 0.5
    y1 = roof_y * 0.55
    y2 = roof_y * 0.78
    y3 = roof_y * 0.92
    part = Part()
    part.box((0.0, 0.45, 0.0), (width, 0.9, depth), PLINTH_MUL, top_color=PLINTH_MUL)
    part.chamfer_box((0.0, (0.9 + y1) / 2, 0.0), (width - 0.4, y1 - 0.9, depth - 0.4), WHITE_FACADE, chamfer=0.18, top_color=ROOF_MUL)
    part.chamfer_box((0.0, (y1 + y2) / 2, 0.0), (width * s1, y2 - y1, depth * s1), shade(WHITE_FACADE, 0.97), chamfer=0.16, top_color=ROOF_MUL)
    part.box((0.0, (y2 + y3) / 2, 0.0), (width * s2, y3 - y2, depth * s2), shade(WHITE_FACADE, 0.94), top_color=ROOF_MUL)
    part.box(
        (0.0, (y3 + roof_y) / 2, 0.0),
        (width * s3, roof_y - y3, depth * s3),
        shade(WHITE_FACADE, 0.9),
        top_color=ROOF_MUL,
    )
    band_ring(part, half_w - 0.2, half_d - 0.2, 4.6, 1.5, 0.2, WINDOW_DARK)
    band_ring(part, half_w - 0.2, half_d - 0.2, 10.0, 1.5, 0.2, WINDOW_LIT)
    band_ring(part, half_w - 0.2, half_d - 0.2, 15.4, 1.5, 0.2, WINDOW_DARK)
    band_ring(part, half_w * s1 - 0.2, half_d * s1 - 0.2, 20.8, 1.4, 0.2, WINDOW_LIT)
    pier_ring(part, half_w - 0.2, half_d - 0.2, 1.2, y1, PIER_MUL)
    parapet_ring(part, half_w * s3, half_d * s3, roof_y + PARAPET_H / 2, PARAPET_H, 0.45, PARAPET_MUL)
    roof_clutter(part, half_w * s3, half_d * s3, roof_y, height, True)
    part.box((0.0, 2.4, half_d - 0.12), (4.0, 4.8, 0.24), DOOR_MUL)
    part.box((0.0, 5.2, half_d - 1.1), (9.0, 0.3, 2.2), CANOPY_MUL)
    part.box((7.0, 7.0, half_d - 0.1), (8.0, 1.6, 0.2), SIGN_ACCENT)
    return part


BLOCKS = {
    'bld_block_small': build_block_small,
    'bld_block_mid': build_block_mid,
    'bld_block_tall': build_block_tall,
    'bld_tower': build_tower,
}

MAX_TRIS = 400
BLOCK_MIN = 200
BLOCK_MAX = 600
BLOCK_LOD1_MAX = 80
BLOCK_LOD1_RATIO = 0.40


def build_module_kit(material, rows) -> None:
    for name, builder in MODULES.items():
        objects = [lp.build_object('bld', builder(), material)]
        path = lp.model_path(f'{name}.glb')
        tris = lp.export_glb(path, objects)
        size_kb = os.path.getsize(path) / 1024.0
        print(f'BLD {name}: {tris} tris, {size_kb:.1f} KB')
        rows.append((name, tris))
        lp.remove_objects(objects)


def build_blocks(material) -> list[tuple[str, int, int]]:
    """Готовые дома: LOD0 + LOD1. Возвращает (имя, tris0, tris1)."""
    results = []
    for name, builder in BLOCKS.items():
        counts = {}
        for detail, lod in ((0, 'lod0'), (1, 'lod1')):
            objects = [lp.build_object('bld', builder(detail), material)]
            path = lp.model_path(f'{name}_{lod}.glb')
            tris = lp.export_glb(path, objects)
            counts[lod] = tris
            size_kb = os.path.getsize(path) / 1024.0
            print(f'BLD {name} {lod}: {tris} tris, {size_kb:.1f} KB')
            lp.remove_objects(objects)
        results.append((name, counts['lod0'], counts['lod1']))
    return results


def main() -> None:
    lp.reset_scene()
    material = lp.flat_material()
    rows: list[tuple[str, int]] = []
    build_module_kit(material, rows)
    blocks = build_blocks(material)

    print('---')
    ok = True
    for name, tris in rows:
        status = 'OK' if tris <= MAX_TRIS else 'TRI_BUDGET'
        if tris > MAX_TRIS:
            ok = False
        print(f'BLD_SUMMARY {name}: {tris} tris {status}')
    for name, lod0, lod1 in blocks:
        ratio = lod1 / lod0 if lod0 else 1.0
        status = 'OK'
        if lod0 < BLOCK_MIN or lod0 > BLOCK_MAX:
            status = 'TRI_OUT_OF_RANGE'
            ok = False
        if lod1 > BLOCK_LOD1_MAX:
            status = 'LOD1_TOO_HEAVY'
            ok = False
        if ratio > BLOCK_LOD1_RATIO:
            status = 'LOD1_RATIO'
            ok = False
        print(f'BLOCK_SUMMARY {name}: lod0={lod0} lod1={lod1} ratio={ratio:.2f} {status}')
    if not ok:
        raise SystemExit('Бюджеты зданий нарушены')


if __name__ == '__main__':
    main()
