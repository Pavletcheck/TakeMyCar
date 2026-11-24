"""Персонажи TakeMyCar: базовый пешеход/игрок и коп, по частям для анимации.

Запуск:
    blender.exe --background --factory-startup --python tools/blender/build_characters.py

Соглашения:
- 1 unit = 1 m, начало координат — между ступнями (y = 0), лицо смотрит в +Z;
- части — отдельные узлы GLB с пивотом в суставе: `torso`, `head`,
  `arm_l`, `arm_r`, `leg_l`, `leg_r`; код крутит их вокруг X для шага и падения;
- `far_body` / `far_head` — упрощённый силуэт для LOD1 (дальние NPC, ≤40 %);
- скиннинг не используется: 200 NPC рисуются InstancedMesh по частям.

`ped_base_lod0.glb` красится инстансом (вершинные цвета — белые множители),
`ped_cop_lod0.glb` запечён в форме (тёмно-синяя форма, фуражка).
"""

from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import lib_lowpoly as lp
from lib_lowpoly import Part, rgb, shade, WHITE

# Пропорции (метры). Рост 1.8: ступни 0 → бёдра 0.86 → плечи 1.40 → темя 1.80.
HIP_Y = 0.86
SHOULDER_Y = 1.40
HEAD_Y = 1.46
ARM_X = 0.255
LEG_X = 0.105

# Множители для окрашиваемой базы: инстанс-цвет умножается на них.
SKIN = shade(WHITE, 1.0)
SKIN_DARK = shade(WHITE, 0.82)
HAIR = shade(WHITE, 0.26)
SHOE = shade(WHITE, 0.3)
JACKET_DARK = shade(WHITE, 0.82)
BELT = shade(WHITE, 0.42)

# Запечённая палитра копа.
COP_SKIN = rgb(0xf0c4a0)
COP_UNIFORM = rgb(0x2b4a8b)
COP_UNIFORM_DARK = rgb(0x213a6d)
COP_BOOT = rgb(0x1b2028)
COP_CAP = rgb(0x1d3168)
COP_BADGE = rgb(0xe2c15a)


def build_torso(palette: dict) -> Part:
    """Корпус относительно пивота на бёдрах (y = HIP_Y)."""
    part = Part()
    uniform = palette['uniform']
    part.chamfer_box((0.0, 0.06, 0.0), (0.34, 0.16, 0.22), palette['hip'], chamfer=0.05)
    part.chamfer_box((0.0, 0.34, 0.0), (0.44, 0.42, 0.26), uniform, chamfer=0.07)
    part.chamfer_box((0.0, 0.54, 0.0), (0.52, 0.14, 0.24), shade(uniform, 0.94), chamfer=0.05)
    part.box((0.0, 0.60, 0.0), (0.20, 0.06, 0.18), palette['collar'])
    part.box((0.0, 0.12, 0.0), (0.36, 0.05, 0.24), palette['belt'])
    if palette.get('vest'):
        # Бронежилет копа: чуть шире груди, с планкой.
        part.chamfer_box((0.0, 0.36, 0.02), (0.48, 0.34, 0.28), palette['vest'], chamfer=0.05)
        part.box((0.0, 0.36, 0.16), (0.06, 0.30, 0.02), COP_BADGE)
    return part


def build_head(palette: dict) -> Part:
    """Голова относительно пивота на шее (y = HEAD_Y)."""
    part = Part()
    skin = palette['skin']
    part.box((0.0, 0.02, 0.0), (0.12, 0.12, 0.12), shade(skin, 0.9))
    part.sphere((0.0, 0.16, 0.005), (0.145, 0.16, 0.15), skin, segments=8, rings=4)
    if palette.get('cap'):
        part.chamfer_box((0.0, 0.28, 0.0), (0.28, 0.10, 0.28), palette['cap'], chamfer=0.04)
        part.box((0.0, 0.245, 0.17), (0.26, 0.03, 0.12), shade(palette['cap'], 0.7))
    else:
        part.chamfer_box((0.0, 0.27, -0.01), (0.27, 0.09, 0.27), palette['hair'], chamfer=0.04)
    part.box((0.0, 0.13, 0.145), (0.07, 0.07, 0.04), shade(skin, 0.92))
    return part


def build_arm(palette: dict) -> Part:
    """Рука относительно плечевого сустава: свисает вниз по −Y."""
    part = Part()
    part.chamfer_box((0.0, -0.24, 0.0), (0.115, 0.50, 0.13), palette['sleeve'], chamfer=0.035)
    part.box((0.0, -0.54, 0.01), (0.10, 0.12, 0.11), palette['hand'])
    return part


def build_leg(palette: dict) -> Part:
    """Нога относительно бедренного сустава."""
    part = Part()
    part.chamfer_box((0.0, -0.40, 0.0), (0.16, 0.76, 0.17), palette['pants'], chamfer=0.04)
    part.box((0.0, -0.82, 0.03), (0.16, 0.09, 0.26), palette['shoe'])
    return part


def build_far(palette: dict) -> tuple[Part, Part]:
    """Упрощённый силуэт для LOD1: 36 tris на фигуру."""
    body = Part()
    body.box((0.0, 0.62, 0.0), (0.46, 1.24, 0.28), palette['uniform'], top_scale=0.8)
    head = Part()
    head.sphere((0.0, 0.16, 0.0), (0.15, 0.16, 0.15), palette['skin'], segments=6, rings=3)
    return body, head


BASE_PALETTE = {
    'uniform': WHITE,
    'hip': shade(WHITE, 0.9),
    'collar': JACKET_DARK,
    'belt': BELT,
    'skin': SKIN,
    'hair': HAIR,
    'sleeve': WHITE,
    'hand': SKIN_DARK,
    'pants': shade(WHITE, 0.88),
    'shoe': SHOE,
}

COP_PALETTE = {
    'uniform': COP_UNIFORM,
    'hip': COP_UNIFORM_DARK,
    'collar': COP_UNIFORM_DARK,
    'belt': COP_BOOT,
    'skin': COP_SKIN,
    'cap': COP_CAP,
    'sleeve': COP_UNIFORM,
    'hand': COP_SKIN,
    'pants': COP_UNIFORM_DARK,
    'shoe': COP_BOOT,
    'vest': COP_UNIFORM_DARK,
}

BUDGET_MIN = 400
BUDGET_MAX = 900
LOD1_RATIO = 0.40


def build_character(prefix: str, palette: dict) -> int:
    material = lp.flat_material()
    objects = []

    def add(name: str, part: Part, location) -> None:
        objects.append(lp.build_object(name, part, material, location))

    add('torso', build_torso(palette), (0.0, HIP_Y, 0.0))
    add('head', build_head(palette), (0.0, HEAD_Y, 0.0))
    add('arm_l', build_arm(palette), (-ARM_X, SHOULDER_Y, 0.0))
    add('arm_r', build_arm(palette), (ARM_X, SHOULDER_Y, 0.0))
    add('leg_l', build_leg(palette), (-LEG_X, HIP_Y, 0.0))
    add('leg_r', build_leg(palette), (LEG_X, HIP_Y, 0.0))
    far_body, far_head = build_far(palette)
    add('far_body', far_body, (0.0, 0.0, 0.0))
    add('far_head', far_head, (0.0, 1.50, 0.0))

    total = sum(lp.tri_count([obj]) for obj in objects)
    far = lp.tri_count([objects[6], objects[7]])
    path = lp.model_path(f'{prefix}_lod0.glb')
    lp.export_glb(path, objects)
    size_kb = os.path.getsize(path) / 1024.0
    print(f'CHAR {prefix}: {total} tris (far {far}), {size_kb:.1f} KB, узлы: {[o.name for o in objects]}')
    lp.remove_objects(objects)
    return total, far


def main() -> None:
    lp.reset_scene()
    rows = []
    for prefix, palette in (('ped_base', BASE_PALETTE), ('ped_cop', COP_PALETTE)):
        total, far = build_character(prefix, palette)
        rows.append((prefix, total, far))

    print('---')
    ok = True
    for prefix, total, far in rows:
        ratio = far / total
        status = 'OK'
        if total < BUDGET_MIN or total > BUDGET_MAX:
            status = 'TRI_OUT_OF_RANGE'
            ok = False
        if ratio > LOD1_RATIO:
            status = 'LOD1_TOO_HEAVY'
            ok = False
        print(f'CHAR_SUMMARY {prefix}: lod0={total} lod1={far} ratio={ratio:.2f} {status}')
    if not ok:
        raise SystemExit('Бюджеты персонажей нарушены')


if __name__ == '__main__':
    main()
