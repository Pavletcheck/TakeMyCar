"""Пропсы улиц TakeMyCar: 7 видов по 2–3 варианта, экспорт в assets/models.

Запуск:
    blender.exe --background --factory-startup --python tools/blender/build_props.py

Соглашения:
- 1 unit = 1 m, пивот — по основанию (y = 0), +Z — «лицо» (вывеска, спинка);
- один объект `prop` на файл: все цвета запечены в COLOR_0, материал один;
- габариты и высоты повторяют `src/world/props.ts`, чтобы не поехали
  коллайдеры (`tree`, `billboard`, `fence`) и посадка на плиту квартала;
- LOD пропсам не нужен: они статичны, дешёвые (≤120 tris) и живут по чанкам.
"""

from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import lib_lowpoly as lp
from lib_lowpoly import Part, rgb, shade

METAL = rgb(0x394049)
METAL_DARK = rgb(0x2b3138)
LAMP_GLOW = rgb(0xffd27a)
LAMP_GLOW_WARM = rgb(0xffe2a8)
WOOD = rgb(0x8a6a44)
WOOD_DARK = rgb(0x6d5236)
LEAF = rgb(0x3f7a3a)
LEAF_DARK = rgb(0x35652f)
LEAF_LIGHT = rgb(0x4a8a44)
TRUNK = rgb(0x5b4432)
BARK = rgb(0x4e3a2a)
BIN_GREEN = rgb(0x2f6b4f)
BIN_BLUE = rgb(0x44566b)
HYDRANT_RED = rgb(0xc0442f)
HYDRANT_YELLOW = rgb(0xd6a63a)
CONCRETE = rgb(0x6f7b88)
SIGN_RED = rgb(0xd0503f)
SIGN_BLUE = rgb(0x3f6fd0)
SIGN_GREEN = rgb(0x3fa46a)
FENCE_GRAY = rgb(0x6b7268)
FENCE_WOOD = rgb(0x7a6d58)


# --- фонарь -----------------------------------------------------------------


def build_lamp(variant: int) -> Part:
    part = Part()
    tall = variant == 0
    height = 6.0 if tall else 4.8
    glow = LAMP_GLOW if tall else LAMP_GLOW_WARM
    part.cyl_y((0.0, 0.09, 0.0), 0.19, 0.18, METAL_DARK, segments=8, top_color=METAL)
    part.cyl_y((0.0, height / 2, 0.0), 0.11, height, METAL, segments=8)
    part.cyl_y((0.0, height - 0.16, 0.0), 0.14, 0.32, METAL_DARK, segments=8)
    # Кронштейн и плафон: смещены в +X, как в текущих примитивах.
    arm_y = height - 0.34
    part.box((0.22, arm_y, 0.0), (0.44, 0.10, 0.12), METAL)
    part.box((0.44, arm_y - 0.06, 0.0), (0.52, 0.16, 0.30), METAL_DARK)
    part.box((0.44, arm_y - 0.15, 0.0), (0.44, 0.05, 0.24), glow, top_color=glow)
    return part


# --- урна -------------------------------------------------------------------


def build_bin(variant: int) -> Part:
    part = Part()
    if variant == 0:
        color = BIN_GREEN
        part.cyl_y((0.0, 0.42, 0.0), 0.27, 0.84, color, segments=8)
        part.cyl_y((0.0, 0.88, 0.0), 0.29, 0.10, shade(color, 0.8), segments=8)
        part.box((0.0, 0.62, 0.27), (0.24, 0.16, 0.03), shade(color, 0.55))
    else:
        color = BIN_BLUE
        part.chamfer_box((0.0, 0.40, 0.0), (0.52, 0.80, 0.50), color, chamfer=0.05)
        part.chamfer_box((0.0, 0.83, 0.0), (0.56, 0.08, 0.54), shade(color, 0.8), chamfer=0.03)
        part.box((0.0, 0.58, 0.26), (0.22, 0.14, 0.03), shade(color, 0.5))
    return part


# --- гидрант ----------------------------------------------------------------


def build_hydrant(variant: int) -> Part:
    part = Part()
    color = HYDRANT_RED if variant == 0 else HYDRANT_YELLOW
    part.cyl_y((0.0, 0.05, 0.0), 0.26, 0.10, shade(color, 0.7), segments=8)
    part.cyl_y((0.0, 0.34, 0.0), 0.20, 0.60, color, segments=8)
    part.cyl_y((0.0, 0.68, 0.0), 0.22, 0.08, shade(color, 0.8), segments=8)
    part.cyl_y((0.0, 0.76, 0.0), 0.10, 0.10, METAL_DARK, segments=6)
    part.box((0.0, 0.52, 0.26), (0.14, 0.16, 0.14), shade(color, 0.85))
    part.box((-0.26, 0.52, 0.0), (0.14, 0.16, 0.14), shade(color, 0.85))
    part.box((0.26, 0.52, 0.0), (0.14, 0.16, 0.14), shade(color, 0.85))
    return part


# --- дерево -----------------------------------------------------------------


def build_tree(variant: int) -> Part:
    part = Part()
    trunk_h = 2.4 if variant < 2 else 3.0
    trunk_color, leaf, leaf_top = (
        (TRUNK, LEAF, shade(LEAF, 1.1)) if variant == 0
        else (BARK, LEAF_DARK, shade(LEAF_DARK, 1.15)) if variant == 1
        else (TRUNK, LEAF_LIGHT, shade(LEAF_LIGHT, 1.1))
    )
    part.cyl_y((0.0, trunk_h / 2, 0.0), 0.22, trunk_h, trunk_color, segments=8, top_color=shade(trunk_color, 0.85))
    # Крона из двух ярусов: читается сверху как «ёлка», а не как шар.
    if variant == 2:
        part.cone_y((0.0, trunk_h + 1.30, 0.0), 1.60, 2.10, leaf, segments=8, bottom_color=shade(leaf, 0.7))
        part.cone_y((0.0, trunk_h + 2.90, 0.0), 1.20, 1.90, leaf_top, segments=8, bottom_color=shade(leaf_top, 0.75))
    else:
        part.cone_y((0.0, trunk_h + 1.20, 0.0), 1.80, 2.20, leaf, segments=8, bottom_color=shade(leaf, 0.7))
        part.cone_y((0.0, trunk_h + 2.55, 0.0), 1.35, 1.80, leaf_top, segments=8, bottom_color=shade(leaf_top, 0.75))
    return part


# --- скамейка ---------------------------------------------------------------


def build_bench(variant: int) -> Part:
    part = Part()
    seat = WOOD if variant == 0 else rgb(0x5c6b74)
    back = WOOD_DARK if variant == 0 else rgb(0x4c5a63)
    legs = METAL_DARK
    for sign in (-1.0, 1.0):
        part.box((sign * 0.76, 0.20, 0.0), (0.10, 0.40, 0.46), legs)
        part.box((sign * 0.76, 0.62, 0.22), (0.10, 0.44, 0.10), legs)
    for i, z in enumerate((-0.16, 0.0, 0.16)):
        part.box((0.0, 0.44, z), (1.90, 0.06, 0.14), shade(seat, 1.0 - i * 0.04))
    for i, y in enumerate((0.62, 0.78)):
        part.box((0.0, y, 0.24), (1.90, 0.14, 0.05), shade(back, 1.0 - i * 0.06))
    return part


# --- билборд ----------------------------------------------------------------


def build_billboard(variant: int) -> Part:
    part = Part()
    panel = (SIGN_RED, SIGN_BLUE, SIGN_GREEN)[variant % 3]
    for sign in (-1.0, 1.0):
        part.chamfer_box((sign * 1.60, 1.30, 0.0), (0.20, 2.60, 0.20), METAL, chamfer=0.03)
        part.box((sign * 1.60, 0.06, 0.0), (0.40, 0.12, 0.40), METAL_DARK)
    part.chamfer_box((0.0, 3.20, 0.0), (4.40, 2.40, 0.18), panel, chamfer=0.05)
    part.box((0.0, 3.20, 0.10), (4.10, 2.10, 0.02), shade(panel, 0.72))
    part.box((0.0, 1.10, 0.0), (3.20, 0.10, 0.10), METAL_DARK)
    return part


# --- забор ------------------------------------------------------------------


def build_fence(variant: int) -> Part:
    part = Part()
    color = FENCE_GRAY if variant == 0 else FENCE_WOOD
    part.box((0.0, 0.08, 0.0), (0.20, 0.16, 2.95), shade(color, 0.8))
    for y in (0.55, 1.25):
        part.box((0.0, y, 0.0), (0.10, 0.12, 2.95), shade(color, 1.0))
    posts = (-1.44, -0.48, 0.48, 1.44)
    for z in posts:
        part.box((0.0, 0.82, z), (0.14, 1.64, 0.12), shade(color, 0.9))
    # Штакетник: только по краям, чтобы не раздувать tris.
    for z in (-0.96, 0.0, 0.96):
        part.box((0.0, 0.86, z), (0.05, 1.40, 0.06), shade(color, 0.95))
    return part


BUILDERS = {
    'lamp': (build_lamp, 2),
    'bin': (build_bin, 2),
    'hydrant': (build_hydrant, 2),
    'tree': (build_tree, 3),
    'bench': (build_bench, 2),
    'billboard': (build_billboard, 3),
    'fence': (build_fence, 2),
}

MAX_TRIS = 400


def main() -> None:
    lp.reset_scene()
    material = lp.flat_material()
    rows = []
    for kind, (builder, variants) in BUILDERS.items():
        for variant in range(variants):
            part = builder(variant)
            objects = [lp.build_object('prop', part, material)]
            suffix = chr(ord('a') + variant)
            path = lp.model_path(f'prop_{kind}_{suffix}.glb')
            tris = lp.export_glb(path, objects)
            size_kb = os.path.getsize(path) / 1024.0
            print(f'PROP {kind}_{suffix}: {tris} tris, {size_kb:.1f} KB')
            rows.append((f'{kind}_{suffix}', tris))
            lp.remove_objects(objects)

    print('---')
    ok = True
    for name, tris in rows:
        status = 'OK' if tris <= MAX_TRIS else 'TRI_BUDGET'
        if tris > MAX_TRIS:
            ok = False
        print(f'PROP_SUMMARY {name}: {tris} tris {status}')
    print(f'PROP_TOTAL files={len(rows)} tris={sum(tris for _, tris in rows)}')
    if not ok:
        raise SystemExit('Бюджеты пропсов нарушены')


if __name__ == '__main__':
    main()
