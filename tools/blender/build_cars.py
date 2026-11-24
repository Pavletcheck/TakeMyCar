"""Машины TakeMyCar: 5 типов, LOD0 + LOD1, экспорт в assets/models/cars.

Запуск:
    blender.exe --background --factory-startup --python tools/blender/build_cars.py

Соглашения:
- 1 unit = 1 m, начало координат — центр машины на земле (y = 0);
- +Z — вперёд (нос), +X — вправо, +Y — вверх;
- два объекта на файл: `paint` (белый, красится инстансом) и `trim`
  (стёкла, шины, фары, бамперы — запечённые цвета);
- бюджеты: LOD0 800–1500 tris, LOD1 ≤ 40 % LOD0.

Числа габаритов синхронизированы с src/config/vehicles.ts.
"""

from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import lib_lowpoly as lp
from lib_lowpoly import Part, rgb, shade, WHITE

# --- палитра ---------------------------------------------------------------

TIRE = rgb(0x1b1f26)
RIM = rgb(0x9aa3ad)
GLASS = rgb(0x2f5568)
GLASS_DARK = rgb(0x24404f)
LIGHT_FRONT = rgb(0xffe9b0)
LIGHT_REAR = rgb(0xd94240)
DARK = rgb(0x252b33)
CHROME = rgb(0xaeb6bf)
PLATE = rgb(0xe8ecef)
INDICATOR = rgb(0xffa63d)


def solid(part: Part, center, size, color, bevel=0.09, **kwargs) -> None:
    """Коробка с фаской (LOD0) или обычная (LOD1: bevel = 0)."""
    if bevel > 0.0:
        part.chamfer_box(center, size, color, chamfer=bevel, **kwargs)
    else:
        kwargs.pop('top_color', None)
        kwargs.pop('side_color', None)
        kwargs.pop('bottom_color', None)
        part.box(center, size, color, **kwargs)


def wheels(part: Part, axles, half_width: float, radius: float, width: float, color, segments: int) -> None:
    """Колёса: axles — список Z осей; по два колеса на ось."""
    x = half_width - width * 0.42
    for z in axles:
        for sign in (-1.0, 1.0):
            part.cyl_x((sign * x, radius, z), radius, width, color, segments=segments, cap_color=RIM)


def lamp(part: Part, center, size, color) -> None:
    part.box(center, size, color)


def plate(part: Part, z: float, y: float, size) -> None:
    part.box((0.0, y, z), size, PLATE)


# --- седан -----------------------------------------------------------------


def build_sedan(detail: int) -> tuple[Part, Part]:
    paint, trim = Part(), Part()
    bevel = 0.075 if detail == 0 else 0.0
    fine = detail == 0
    segments = 10 if detail == 0 else 6
    axles = (1.34, -1.34)
    radius = 0.33
    half_width = 0.95

    # Кузов: нижняя часть с плавным переходом к капоту и багажнику.
    paint.prism_x(
        [(-2.12, 0.32), (2.10, 0.32), (2.16, 0.56), (2.08, 0.74), (-2.06, 0.76), (-2.14, 0.56)],
        -0.90,
        0.90,
        WHITE,
        cap_color=shade(WHITE, 0.84),
    )
    # Капот и багажник.
    solid(paint, (0.0, 0.80, 1.52), (1.66, 0.13, 1.20), WHITE, bevel)
    solid(paint, (0.0, 0.80, -1.66), (1.66, 0.13, 0.90), WHITE, bevel)
    # Крылья над колёсами: широкие «плечи» силуэта.
    for sign in (-1.0, 1.0):
        for z in (1.34, -1.34):
            solid(paint, (sign * 0.90, 0.62, z), (0.16, 0.30, 0.92), WHITE, bevel)
    # Кабина со скошенным лобовым и задним стеклом.
    paint.prism_x(
        [(-1.62, 0.76), (1.04, 0.76), (0.58, 1.22), (-0.46, 1.27), (-1.44, 1.18)],
        -0.79,
        0.79,
        WHITE,
        cap_color=shade(WHITE, 0.86),
    )
    # Крыша.
    solid(paint, (0.0, 1.28, -0.44), (1.44, 0.07, 1.10), WHITE, bevel, top_color=shade(WHITE, 1.0))
    # Стойки и пороги.
    for sign in (-1.0, 1.0):
        solid(paint, (sign * 0.90, 0.40, 0.0), (0.10, 0.12, 3.30), shade(WHITE, 0.92), bevel * 0.6)

    # Стёкла (запечённые, не тонируются).
    trim.slab([(-0.72, 1.20, 0.60), (0.72, 1.20, 0.60), (0.72, 0.80, 1.02), (-0.72, 0.80, 1.02)], 0.03, GLASS)
    trim.slab([(-0.72, 1.19, -1.40), (0.72, 1.19, -1.40), (0.72, 0.80, -1.58), (-0.72, 0.80, -1.58)], 0.03, GLASS)
    for sign in (-1.0, 1.0):
        trim.slab(
            [
                (sign * 0.795, 0.80, 0.90),
                (sign * 0.795, 0.80, -1.36),
                (sign * 0.795, 1.16, -1.30),
                (sign * 0.795, 1.16, 0.76),
            ],
            0.03,
            GLASS_DARK,
        )

    # Бамперы, решётка, фары, фонари, номер.
    solid(trim, (0.0, 0.50, 2.20), (1.86, 0.30, 0.18), DARK, bevel * 0.6)
    solid(trim, (0.0, 0.50, -2.20), (1.86, 0.30, 0.18), DARK, bevel * 0.6)
    for sign in (-1.0, 1.0):
        lamp(trim, (sign * 0.64, 0.68, 2.20), (0.44, 0.15, 0.07), LIGHT_FRONT)
        lamp(trim, (sign * 0.66, 0.70, -2.22), (0.40, 0.15, 0.07), LIGHT_REAR)

    # Мелкие детали — только LOD0 (на дистанции их не видно).
    if fine:
        lamp(trim, (0.0, 0.62, 2.16), (0.86, 0.14, 0.06), DARK)
        plate(trim, 2.28, 0.46, (0.48, 0.14, 0.03))
        plate(trim, -2.28, 0.46, (0.48, 0.14, 0.03))
        for sign in (-1.0, 1.0):
            solid(trim, (sign * 0.84, 0.98, 0.76), (0.20, 0.10, 0.10), DARK, bevel * 0.3)
            lamp(trim, (sign * 0.56, 1.19, 0.42), (0.34, 0.03, 0.05), DARK)
            lamp(trim, (sign * 0.80, 0.84, -0.30), (0.05, 0.05, 0.22), CHROME)
        lamp(trim, (0.0, 0.86, 0.60), (0.62, 0.03, 0.09), DARK)
        trim.cyl_y((0.0, 1.31, -1.05), 0.02, 0.07, DARK, segments=6)
        trim.box((-0.62, 0.34, -2.18), (0.10, 0.10, 0.16), CHROME)

    # Колёса и тормозные диски.
    wheels(trim, axles, half_width, radius, 0.24, TIRE, segments)

    return paint, trim


# --- спорткар --------------------------------------------------------------


def build_sports(detail: int) -> tuple[Part, Part]:
    paint, trim = Part(), Part()
    bevel = 0.08 if detail == 0 else 0.0
    fine = detail == 0
    segments = 12 if detail == 0 else 6
    radius = 0.34
    half_width = 0.975
    axles = (1.32, -1.30)

    # Клиновидный корпус: низкий нос, высокая корма.
    paint.prism_x(
        [(-2.10, 0.30), (2.02, 0.28), (2.14, 0.42), (1.60, 0.62), (-1.98, 0.70), (-2.12, 0.46)],
        -0.92,
        0.92,
        WHITE,
        cap_color=shade(WHITE, 0.82),
    )
    solid(paint, (0.0, 0.70, 1.10), (1.74, 0.12, 1.02), WHITE, bevel)
    solid(paint, (0.0, 0.74, -1.66), (1.74, 0.14, 0.76), WHITE, bevel)
    for sign in (-1.0, 1.0):
        for z in (1.32, -1.30):
            solid(paint, (sign * 0.92, 0.58, z), (0.18, 0.34, 0.96), WHITE, bevel)
        solid(paint, (sign * 0.94, 0.38, 0.0), (0.10, 0.14, 2.60), shade(WHITE, 0.9), bevel * 0.5)
    # Кабина-купол: узкая, сильно наклонённое лобовое.
    paint.prism_x(
        [(-1.36, 0.74), (0.86, 0.74), (0.34, 1.10), (-0.30, 1.14), (-1.18, 1.02)],
        -0.72,
        0.72,
        WHITE,
        cap_color=shade(WHITE, 0.84),
    )
    solid(paint, (0.0, 1.13, -0.30), (1.32, 0.06, 0.86), WHITE, bevel, top_color=WHITE)

    # Спойлер на корме.
    for sign in (-1.0, 1.0):
        solid(paint, (sign * 0.62, 0.86, -1.94), (0.10, 0.20, 0.16), shade(WHITE, 0.9), bevel * 0.4)
    solid(paint, (0.0, 1.00, -1.98), (1.72, 0.06, 0.36), shade(WHITE, 0.96), bevel * 0.6)

    # Стёкла.
    trim.slab([(-0.66, 1.08, 0.36), (0.66, 1.08, 0.36), (0.68, 0.76, 0.86), (-0.68, 0.76, 0.86)], 0.03, GLASS)
    trim.slab([(-0.62, 1.06, -1.26), (0.62, 1.06, -1.26), (0.64, 0.76, -1.44), (-0.64, 0.76, -1.44)], 0.03, GLASS_DARK)
    for sign in (-1.0, 1.0):
        trim.slab(
            [
                (sign * 0.725, 0.76, 0.80),
                (sign * 0.725, 0.76, -1.20),
                (sign * 0.725, 1.04, -1.10),
                (sign * 0.725, 1.04, 0.44),
            ],
            0.03,
            GLASS_DARK,
        )

    # Низкий передний сплиттер, воздухозаборники, фары.
    for sign in (-1.0, 1.0):
        lamp(trim, (sign * 0.62, 0.52, 2.10), (0.50, 0.09, 0.10), LIGHT_FRONT)
        lamp(trim, (sign * 0.66, 0.62, -2.14), (0.46, 0.10, 0.08), LIGHT_REAR)
    if fine:
        solid(trim, (0.0, 0.32, 2.12), (1.82, 0.14, 0.16), DARK, bevel * 0.4)
        solid(trim, (0.0, 0.46, 2.14), (1.30, 0.16, 0.07), DARK)
        solid(trim, (0.0, 0.46, -2.14), (1.84, 0.20, 0.16), DARK, bevel * 0.4)
        plate(trim, 2.21, 0.38, (0.44, 0.12, 0.03))
        for sign in (-1.0, 1.0):
            solid(trim, (sign * 0.86, 0.86, 0.62), (0.20, 0.08, 0.09), DARK, bevel * 0.3)

    wheels(trim, axles, half_width, radius, 0.28, TIRE, segments)
    return paint, trim


# --- фургон ----------------------------------------------------------------


def build_van(detail: int) -> tuple[Part, Part]:
    paint, trim = Part(), Part()
    bevel = 0.09 if detail == 0 else 0.0
    fine = detail == 0
    segments = 10 if detail == 0 else 6
    radius = 0.37
    half_width = 1.05
    axles = (1.66, -1.52)

    # Высокий кузов-коробка с почти вертикальной передней стенкой.
    paint.prism_x(
        [(-2.58, 0.34), (2.28, 0.34), (2.56, 0.62), (2.52, 1.92), (-2.54, 1.98), (-2.60, 0.58)],
        -1.00,
        1.00,
        WHITE,
        cap_color=shade(WHITE, 0.86),
    )
    # Капот и «морда» фургона.
    solid(paint, (0.0, 0.92, 1.94), (1.92, 0.24, 0.62), WHITE, bevel)
    # Кабина: лобовое стекло под небольшим наклоном.
    paint.prism_x(
        [(1.52, 1.00), (2.46, 1.00), (2.40, 1.80), (1.46, 1.86)],
        -0.94,
        0.94,
        shade(WHITE, 0.94),
        cap_color=shade(WHITE, 0.88),
    )
    # Крыша с рёбрами жёсткости.
    solid(paint, (0.0, 2.00, -0.60), (1.96, 0.10, 3.84), WHITE, bevel, top_color=WHITE)
    if fine:
        for z in (-1.60, -0.30, 1.00):
            solid(paint, (0.0, 2.06, z), (1.84, 0.04, 0.10), shade(WHITE, 0.93), 0.0)
        # Расширители арок: фургон «стоит» на колёсах, а не парит над ними.
        for sign in (-1.0, 1.0):
            for z in axles:
                solid(paint, (sign * 1.00, 0.66, z), (0.14, 0.34, 1.06), shade(WHITE, 0.9), bevel * 0.6)

    # Боковые панели и линия раздвижной двери.
    for sign in (-1.0, 1.0):
        solid(paint, (sign * 1.00, 1.16, -0.30), (0.06, 1.30, 4.10), shade(WHITE, 0.93), bevel * 0.5)
        if fine:
            lamp(trim, (sign * 1.02, 1.24, 0.34), (0.03, 0.05, 0.90), DARK)
            lamp(trim, (sign * 1.02, 1.88, 0.34), (0.03, 0.03, 0.90), DARK)
            # Зеркала фургона — крупные, на кронштейнах.
            solid(trim, (sign * 1.04, 1.60, 1.62), (0.10, 0.20, 0.10), DARK, bevel * 0.3)
            lamp(trim, (sign * 1.08, 1.62, 1.62), (0.03, 0.26, 0.14), DARK)

    # Лобовое и боковые стёкла кабины, задние двери.
    trim.slab([(0.94, 1.80, 2.44), (-0.94, 1.80, 2.44), (-0.94, 1.12, 2.50), (0.94, 1.12, 2.50)], 0.04, GLASS)
    for sign in (-1.0, 1.0):
        trim.slab(
            [
                (sign * 0.995, 1.14, 1.54),
                (sign * 0.995, 1.14, 2.34),
                (sign * 0.995, 1.74, 2.30),
                (sign * 0.995, 1.74, 1.58),
            ],
            0.03,
            GLASS_DARK,
        )
        lamp(trim, (sign * 0.60, 0.86, 2.62), (0.34, 0.20, 0.06), LIGHT_FRONT)
        lamp(trim, (sign * 0.86, 1.30, -2.62), (0.18, 0.44, 0.06), LIGHT_REAR)

    # Бампер, решётка, номер, задний борт.
    solid(trim, (0.0, 0.58, 2.60), (2.02, 0.30, 0.16), DARK, bevel * 0.5)
    solid(trim, (0.0, 0.58, -2.62), (2.02, 0.30, 0.14), DARK, bevel * 0.5)
    if fine:
        lamp(trim, (0.0, 0.80, 2.62), (1.10, 0.16, 0.06), DARK)
        plate(trim, 2.69, 0.52, (0.48, 0.14, 0.03))
        for sign in (-1.0, 1.0):
            lamp(trim, (sign * 0.40, 1.32, -2.635), (0.05, 1.10, 0.02), DARK)

    wheels(trim, axles, half_width, radius, 0.28, TIRE, segments)
    return paint, trim


# --- грузовик --------------------------------------------------------------


def build_truck(detail: int) -> tuple[Part, Part]:
    paint, trim = Part(), Part()
    bevel = 0.10 if detail == 0 else 0.0
    fine = detail == 0
    segments = 12 if detail == 0 else 6
    radius = 0.46
    half_width = 1.20

    # Рама и кабина.
    paint.prism_x(
        [(-3.46, 0.60), (3.30, 0.60), (3.44, 0.86), (3.30, 1.06), (-3.40, 1.06), (-3.50, 0.84)],
        -0.98,
        0.98,
        shade(WHITE, 0.9),
        cap_color=shade(WHITE, 0.78),
    )
    solid(paint, (0.0, 1.60, 2.62), (2.10, 1.28, 1.50), WHITE, bevel)
    solid(paint, (0.0, 2.33, 2.58), (2.00, 0.12, 1.32), WHITE, bevel, top_color=WHITE)
    # «Спальник» и крыша кабины.
    solid(paint, (0.0, 2.24, 1.86), (1.98, 0.46, 0.34), shade(WHITE, 0.94), bevel * 0.6)
    # Кузов-контейнер с рёбрами.
    solid(paint, (0.0, 1.72, -1.02), (2.30, 1.86, 4.70), WHITE, bevel, top_color=shade(WHITE, 0.98))
    if fine:
        for z in (-3.10, -2.20, -1.30, -0.40, 0.50, 1.30):
            for sign in (-1.0, 1.0):
                solid(paint, (sign * 1.15, 1.72, z), (0.06, 1.80, 0.14), shade(WHITE, 0.9), 0.0)
        solid(paint, (0.0, 1.72, -3.38), (2.24, 1.82, 0.10), shade(WHITE, 0.86), bevel * 0.5)

    # Стёкла кабины, зеркала, лестница, бак, выхлоп.
    trim.slab([(0.94, 2.18, 3.30), (-0.94, 2.18, 3.30), (-0.94, 1.52, 3.36), (0.94, 1.52, 3.36)], 0.04, GLASS)
    for sign in (-1.0, 1.0):
        trim.slab(
            [
                (sign * 1.055, 1.54, 2.20),
                (sign * 1.055, 1.54, 3.24),
                (sign * 1.055, 2.12, 3.20),
                (sign * 1.055, 2.12, 2.24),
            ],
            0.03,
            GLASS_DARK,
        )
        if fine:
            solid(trim, (sign * 1.19, 2.02, 2.94), (0.08, 0.52, 0.10), DARK, bevel * 0.3)
        lamp(trim, (sign * 0.86, 1.02, 3.44), (0.36, 0.22, 0.07), LIGHT_FRONT)
        lamp(trim, (sign * 0.95, 0.98, -3.42), (0.26, 0.30, 0.07), LIGHT_REAR)
    # Бампер, решётка, номер, ступеньки, топливный бак, выхлопная труба.
    solid(trim, (0.0, 0.82, 3.46), (2.28, 0.44, 0.18), DARK, bevel * 0.5)
    if fine:
        solid(trim, (0.0, 1.22, 3.48), (1.70, 0.44, 0.08), DARK)
        plate(trim, 3.56, 0.82, (0.52, 0.16, 0.03))
        for sign in (-1.0, 1.0):
            solid(trim, (sign * 1.12, 0.42, 2.10), (0.16, 0.10, 0.42), DARK, 0.0)
        trim.cyl_y((1.02, 0.86, -0.10), 0.22, 1.00, CHROME, segments=8)
        trim.cyl_y((-1.06, 2.02, 2.10), 0.07, 0.86, DARK, segments=8)

    # Шесть колёс: передняя ось и две задние.
    x = half_width - 0.22
    for z in (2.42, -2.10, -3.06):
        for sign in (-1.0, 1.0):
            trim.cyl_x((sign * x, radius, z), radius, 0.34, TIRE, segments=segments, cap_color=RIM)
    return paint, trim


# --- полиция ---------------------------------------------------------------


def build_police(detail: int) -> tuple[Part, Part]:
    paint, trim = Part(), Part()
    bevel = 0.075 if detail == 0 else 0.0
    fine = detail == 0
    segments = 10 if detail == 0 else 6
    radius = 0.34
    half_width = 0.975
    axles = (1.36, -1.32)

    paint.prism_x(
        [(-2.20, 0.32), (2.18, 0.32), (2.26, 0.58), (2.16, 0.78), (-2.14, 0.80), (-2.22, 0.58)],
        -0.92,
        0.92,
        WHITE,
        cap_color=shade(WHITE, 0.84),
    )
    solid(paint, (0.0, 0.84, 1.56), (1.70, 0.14, 1.24), WHITE, bevel)
    solid(paint, (0.0, 0.84, -1.72), (1.70, 0.14, 0.90), WHITE, bevel)
    for sign in (-1.0, 1.0):
        for z in (1.36, -1.32):
            solid(paint, (sign * 0.92, 0.66, z), (0.16, 0.30, 0.94), WHITE, bevel)
        solid(paint, (sign * 0.92, 0.42, 0.0), (0.10, 0.12, 3.34), shade(WHITE, 0.92), bevel * 0.6)
    paint.prism_x(
        [(-1.68, 0.80), (1.10, 0.80), (0.64, 1.28), (-0.50, 1.33), (-1.50, 1.24)],
        -0.80,
        0.80,
        WHITE,
        cap_color=shade(WHITE, 0.86),
    )
    solid(paint, (0.0, 1.34, -0.48), (1.46, 0.07, 1.12), WHITE, bevel, top_color=WHITE)

    # Стёкла.
    trim.slab([(-0.73, 1.26, 0.66), (0.73, 1.26, 0.66), (0.73, 0.84, 1.08), (-0.73, 0.84, 1.08)], 0.03, GLASS)
    trim.slab([(-0.73, 1.25, -1.46), (0.73, 1.25, -1.46), (0.73, 0.84, -1.64), (-0.73, 0.84, -1.64)], 0.03, GLASS)
    for sign in (-1.0, 1.0):
        trim.slab(
            [
                (sign * 0.805, 0.84, 0.96),
                (sign * 0.805, 0.84, -1.42),
                (sign * 0.805, 1.22, -1.36),
                (sign * 0.805, 1.22, 0.82),
            ],
            0.03,
            GLASS_DARK,
        )
        # Ливрея: тёмная полоса по борту и надпись-плашка.
        if fine:
            lamp(trim, (sign * 0.905, 0.66, -0.10), (0.02, 0.26, 2.10), DARK)
            lamp(trim, (sign * 0.905, 0.98, -0.24), (0.02, 0.16, 0.90), LIGHT_FRONT)

    # Бамперы, отбойник, фары, номер.
    solid(trim, (0.0, 0.50, 2.24), (1.90, 0.30, 0.18), DARK, bevel * 0.6)
    solid(trim, (0.0, 0.50, -2.28), (1.90, 0.30, 0.18), DARK, bevel * 0.6)
    if fine:
        solid(trim, (0.0, 0.66, 2.38), (1.30, 0.30, 0.10), CHROME, bevel * 0.4)
    for sign in (-1.0, 1.0):
        lamp(trim, (sign * 0.64, 0.72, 2.28), (0.44, 0.15, 0.07), LIGHT_FRONT)
        lamp(trim, (sign * 0.66, 0.72, -2.30), (0.40, 0.15, 0.07), LIGHT_REAR)
        if fine:
            solid(trim, (sign * 0.85, 1.02, 0.80), (0.20, 0.10, 0.10), DARK, bevel * 0.3)
    if fine:
        plate(trim, 2.36, 0.46, (0.48, 0.14, 0.03))

    # Мигалка: база и два плафона (синий/красный запечены).
    solid(trim, (0.0, 1.375, -0.30), (1.10, 0.06, 0.26), DARK, 0.0)
    trim.box((-0.28, 1.42, -0.30), (0.46, 0.09, 0.24), rgb(0x2f6bff))
    trim.box((0.28, 1.42, -0.30), (0.46, 0.09, 0.24), rgb(0xff3b30))

    wheels(trim, axles, half_width, radius, 0.26, TIRE, segments)
    return paint, trim


BUILDERS = {
    'sedan': build_sedan,
    'sports': build_sports,
    'van': build_van,
    'truck': build_truck,
    'police': build_police,
}

BUDGET_MIN = 800
BUDGET_MAX = 1500
LOD1_RATIO = 0.40


def main() -> None:
    lp.reset_scene()
    material = lp.flat_material()
    rows = []
    for name, builder in BUILDERS.items():
        counts = {}
        for detail, lod in ((0, 'lod0'), (1, 'lod1')):
            paint, trim = builder(detail)
            objects = [
                lp.build_object('paint', paint, material),
                lp.build_object('trim', trim, material),
            ]
            path = lp.model_path(f'car_{name}_{lod}.glb')
            tris = lp.export_glb(path, objects)
            counts[lod] = tris
            size_kb = os.path.getsize(path) / 1024.0
            print(f'CAR {name} {lod}: {tris} tris, {size_kb:.1f} KB')
            lp.remove_objects(objects)
        ratio = counts['lod1'] / counts['lod0'] if counts['lod0'] else 1.0
        rows.append((name, counts['lod0'], counts['lod1'], ratio))

    print('---')
    ok = True
    for name, lod0, lod1, ratio in rows:
        status = 'OK'
        if lod0 < BUDGET_MIN or lod0 > BUDGET_MAX:
            status = 'TRI_OUT_OF_RANGE'
            ok = False
        if ratio > LOD1_RATIO:
            status = 'LOD1_TOO_HEAVY'
            ok = False
        print(f'CAR_SUMMARY {name}: lod0={lod0} lod1={lod1} ratio={ratio:.2f} {status}')
    if not ok:
        raise SystemExit('Бюджеты машин нарушены')


if __name__ == '__main__':
    main()
