"""Модульный кит зданий TakeMyCar: стена, угол, крыша, парапет, вывеска.

Запуск:
    blender.exe --background --factory-startup --python tools/blender/build_buildings.py

Соглашения:
- 1 unit = 1 m, пивот — по центру плиты основания (y = 0), фасад смотрит в +Z;
- модули кратны 4 м по ширине и 4 м по высоте (сетка квартала 80 м, шаг 4 м);
- один объект `bld` на файл: цвета (фасад, окна, парапет) запечены в COLOR_0;
- кит готов к сборке в `world`: `world` решает, какие модули ставить, `render`
  только рисует. В M7 визуал зданий ещё на коробках — кит поставляется как
  задел и документирован в assets/models/README.md.
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

MAX_TRIS = 400


def main() -> None:
    lp.reset_scene()
    material = lp.flat_material()
    rows = []
    for name, builder in MODULES.items():
        objects = [lp.build_object('bld', builder(), material)]
        path = lp.model_path(f'{name}.glb')
        tris = lp.export_glb(path, objects)
        size_kb = os.path.getsize(path) / 1024.0
        print(f'BLD {name}: {tris} tris, {size_kb:.1f} KB')
        rows.append((name, tris))
        lp.remove_objects(objects)

    print('---')
    ok = True
    for name, tris in rows:
        status = 'OK' if tris <= MAX_TRIS else 'TRI_BUDGET'
        if tris > MAX_TRIS:
            ok = False
        print(f'BLD_SUMMARY {name}: {tris} tris {status}')
    if not ok:
        raise SystemExit('Бюджеты кит-баша нарушены')


if __name__ == '__main__':
    main()
