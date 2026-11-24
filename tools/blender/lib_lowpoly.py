"""Общие хелперы для low-poly ассетов TakeMyCar (Blender 5.3, headless).

Правила ассетов (см. `assets/models/README.md`):
- 1 unit = 1 m, начало координат — на земле по центру модели;
- игровые оси: +X вправо, +Y вверх, +Z вперёд (нос машины/лицо персонажа);
- внутри Blender координаты преобразуются как (x, -z, y), чтобы после экспорта
  с `export_yup=True` получить обратно игровые оси;
- цвет — плоский, запекается в вершинный COLOR_0 (линейное пространство),
  материал один на файл; в рантайме Three использует общий flat-материал;
- геометрия — только закрытые тела (box/prism/cylinder/sphere), чтобы
  `recalc_face_normals` давал наружные нормали.

Скрипты детерминированы: ни случайных чисел, ни правок из UI.
"""

from __future__ import annotations

import math
import os

import bmesh
import bpy
from mathutils import Vector

# --- пути ------------------------------------------------------------------

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
MODELS_ROOT = os.path.join(PROJECT_ROOT, 'assets', 'models')


def model_path(*parts: str) -> str:
    """Абсолютный путь внутри assets/models; создаёт папку при необходимости."""
    path = os.path.join(MODELS_ROOT, *parts)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return path


# --- цвет ------------------------------------------------------------------


def srgb_to_linear(channel: float) -> float:
    """sRGB (0..1) → линейное значение для COLOR_0."""
    if channel <= 0.04045:
        return channel / 12.92
    return ((channel + 0.055) / 1.055) ** 2.4


def rgb(value: int) -> tuple[float, float, float, float]:
    """0xRRGGBB → линейный RGBA для вершинного цвета."""
    r = ((value >> 16) & 0xFF) / 255.0
    g = ((value >> 8) & 0xFF) / 255.0
    b = (value & 0xFF) / 255.0
    return (srgb_to_linear(r), srgb_to_linear(g), srgb_to_linear(b), 1.0)


WHITE = (1.0, 1.0, 1.0, 1.0)


def shade(color: tuple[float, float, float, float], factor: float) -> tuple[float, float, float, float]:
    """Затемнить/высветлить цвет: запечённый AO и верхние грани."""
    return (color[0] * factor, color[1] * factor, color[2] * factor, 1.0)


def mix(a: tuple[float, float, float, float], b: tuple[float, float, float, float], t: float):
    """Линейная смесь двух цветов (t=0 → a)."""
    return (
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
        1.0,
    )


def game_to_blender(x: float, y: float, z: float) -> tuple[float, float, float]:
    """Игровые оси (X вправо, Y вверх, Z вперёд) → оси Blender."""
    return (x, -z, y)


# --- геометрия -------------------------------------------------------------


class Part:
    """Набор треугольных/четырёхугольных граней одного объекта.

    Вершины хранятся в игровых координатах (X вправо, Y вверх, Z вперёд),
    цвет — на грань (плоская заливка). Все примитивы замкнутые.
    """

    def __init__(self) -> None:
        self.verts: list[tuple[float, float, float]] = []
        self.faces: list[tuple[int, ...]] = []
        self.colors: list[tuple[float, float, float, float]] = []

    # -- низкий уровень -----------------------------------------------------

    def add(self, verts, faces, color) -> None:
        base = len(self.verts)
        self.verts.extend(verts)
        for face in faces:
            self.faces.append(tuple(base + index for index in face))
            self.colors.append(color)

    def is_empty(self) -> bool:
        return not self.faces

    # -- примитивы ----------------------------------------------------------

    def box(
        self,
        center: tuple[float, float, float],
        size: tuple[float, float, float],
        color,
        top_scale: float = 1.0,
        bottom_scale: float = 1.0,
        front_shift: float = 0.0,
        top_color=None,
        bottom_color=None,
    ) -> None:
        """Прямоугольная коробка; top_scale сужает верх (X и Z) — трапеция.

        front_shift сдвигает верхнюю грань по Z: капот/лобовое стекло «завалено».
        """
        cx, cy, cz = center
        hx, hy, hz = size[0] / 2.0, size[1] / 2.0, size[2] / 2.0
        corners = [
            (-1, -1, -1), (1, -1, -1), (1, 1, -1), (-1, 1, -1),
            (-1, -1, 1), (1, -1, 1), (1, 1, 1), (-1, 1, 1),
        ]
        verts = []
        for sx, sy, sz in corners:
            scale = top_scale if sy > 0 else bottom_scale
            z_shift = front_shift if sy > 0 else 0.0
            verts.append((cx + sx * hx * scale, cy + sy * hy, cz + sz * hz * scale + z_shift))
        faces = [
            (0, 3, 2, 1),  # -Z
            (4, 5, 6, 7),  # +Z
            (0, 4, 7, 3),  # -X
            (1, 2, 6, 5),  # +X
            (0, 1, 5, 4),  # -Y
            (3, 7, 6, 2),  # +Y
        ]
        base = len(self.verts)
        self.verts.extend(verts)
        side = color
        for index, face in enumerate(faces):
            self.faces.append(tuple(base + i for i in face))
            if index == 5 and top_color is not None:
                self.colors.append(top_color)
            elif index == 4 and bottom_color is not None:
                self.colors.append(bottom_color)
            else:
                self.colors.append(side)

    def chamfer_box(
        self,
        center: tuple[float, float, float],
        size: tuple[float, float, float],
        color,
        chamfer: float = 0.08,
        top_scale: float = 1.0,
        top_color=None,
        side_color=None,
        bottom_color=None,
    ) -> None:
        """Коробка со снятой фаской по всем рёбрам: 24 вершины, 44 треугольника.

        Основной строительный блок кузовов: фаска даёт «мягкий» low-poly силуэт
        без сглаживания и лишних полигонов.
        """
        cx, cy, cz = center
        hx, hy, hz = size[0] / 2.0, size[1] / 2.0, size[2] / 2.0
        b = min(chamfer, hx * 0.6, hy * 0.6, hz * 0.6)

        def corner_scale(sy: int) -> float:
            return top_scale if sy > 0 else 1.0

        verts: list[tuple[float, float, float]] = []
        # Индекс вершины: axis * 8 + номер угла (биты: 1=X+, 2=Y+, 4=Z+).
        for axis in range(3):
            for corner in range(8):
                sx = 1 if corner & 1 else -1
                sy = 1 if corner & 2 else -1
                sz = 1 if corner & 4 else -1
                sc = corner_scale(sy)
                px = cx + sx * (hx if axis == 0 else hx - b) * sc
                py = cy + sy * (hy if axis == 1 else hy - b)
                pz = cz + sz * (hz if axis == 2 else hz - b) * sc
                verts.append((px, py, pz))

        def idx(axis: int, sx: int, sy: int, sz: int) -> int:
            corner = (1 if sx > 0 else 0) | (2 if sy > 0 else 0) | (4 if sz > 0 else 0)
            return axis * 8 + corner

        faces: list[tuple[int, ...]] = []
        colors: list[tuple[float, float, float, float]] = []
        top = top_color if top_color is not None else color
        side = side_color if side_color is not None else color
        bottom = bottom_color if bottom_color is not None else side

        # 6 основных граней (четыре вершины «своей» оси).
        faces.append((idx(0, 1, 1, -1), idx(0, 1, -1, -1), idx(0, 1, -1, 1), idx(0, 1, 1, 1)))
        faces.append((idx(0, -1, 1, -1), idx(0, -1, 1, 1), idx(0, -1, -1, 1), idx(0, -1, -1, -1)))
        faces.append((idx(1, 1, 1, -1), idx(1, 1, 1, 1), idx(1, -1, 1, 1), idx(1, -1, 1, -1)))
        faces.append((idx(1, 1, -1, -1), idx(1, -1, -1, -1), idx(1, -1, -1, 1), idx(1, 1, -1, 1)))
        faces.append((idx(2, 1, 1, 1), idx(2, 1, -1, 1), idx(2, -1, -1, 1), idx(2, -1, 1, 1)))
        faces.append((idx(2, 1, 1, -1), idx(2, -1, 1, -1), idx(2, -1, -1, -1), idx(2, 1, -1, -1)))
        colors.extend([side, side, top, bottom, side, side])

        # 12 рёберных фасок: фиксируем две оси из трёх.
        for sx in (1, -1):
            for sy in (1, -1):
                faces.append((idx(0, sx, sy, 1), idx(1, sx, sy, 1), idx(1, sx, sy, -1), idx(0, sx, sy, -1)))
                colors.append(side)
        for sx in (1, -1):
            for sz in (1, -1):
                faces.append((idx(0, sx, 1, sz), idx(2, sx, 1, sz), idx(2, sx, -1, sz), idx(0, sx, -1, sz)))
                colors.append(side)
        for sy in (1, -1):
            for sz in (1, -1):
                faces.append((idx(1, 1, sy, sz), idx(2, 1, sy, sz), idx(2, -1, sy, sz), idx(1, -1, sy, sz)))
                colors.append(side)

        # 8 угловых треугольников.
        for sx in (1, -1):
            for sy in (1, -1):
                for sz in (1, -1):
                    faces.append((idx(0, sx, sy, sz), idx(1, sx, sy, sz), idx(2, sx, sy, sz)))
                    colors.append(side)

        base = len(self.verts)
        self.verts.extend(verts)
        for face in faces:
            self.faces.append(tuple(base + i for i in face))
        self.colors.extend(colors)

    def prism_x(
        self,
        profile: list[tuple[float, float]],
        x0: float,
        x1: float,
        color,
        side_color=None,
        cap_color=None,
    ) -> None:
        """Профиль в плоскости (Z, Y), выдавленный по X: корпус, стёкла, кабина.

        n точек профиля дают 2n рёберных треугольников и 2·(n−2) в крышках.
        """
        n = len(profile)
        if n < 3:
            raise ValueError('prism_x: нужно минимум 3 точки профиля')
        verts: list[tuple[float, float, float]] = []
        for x in (x0, x1):
            for (z, y) in profile:
                verts.append((x, y, z))
        faces: list[tuple[int, ...]] = []
        colors: list[tuple[float, float, float, float]] = []
        for i in range(1, n - 1):
            faces.append((0, i, i + 1))
            colors.append(cap_color if cap_color is not None else color)
            faces.append((n, n + i + 1, n + i))
            colors.append(cap_color if cap_color is not None else color)
        for i in range(n):
            j = (i + 1) % n
            faces.append((i, n + i, n + j, j))
            colors.append(side_color if side_color is not None else color)
        base = len(self.verts)
        self.verts.extend(verts)
        for face in faces:
            self.faces.append(tuple(base + i for i in face))
        self.colors.extend(colors)

    def slab(
        self,
        points: list[tuple[float, float, float]],
        thickness: float,
        color,
    ) -> None:
        """Плоская панель по 4 точкам (игровые координаты) толщиной thickness.

        Точки задаются по часовой стрелке при взгляде снаружи; панель получает
        толщину по нормали, поэтому остаётся замкнутой (нормали считает Blender).
        """
        if len(points) != 4:
            raise ValueError('slab: нужны 4 точки')
        a, b, c, d = (Vector(p) for p in points)
        normal = (b - a).cross(d - a)
        if normal.length < 1e-6:
            normal = (c - a).cross(b - a)
        normal.normalize()
        offset = normal * (thickness / 2.0)
        front = [p + offset for p in (a, b, c, d)]
        back = [p - offset for p in (a, b, c, d)]
        verts = [(v.x, v.y, v.z) for v in front + back]
        faces = [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
        self.add(verts, faces, color)

    def cyl_x(
        self,
        center: tuple[float, float, float],
        radius: float,
        length: float,
        color,
        segments: int = 10,
        cap_color=None,
    ) -> None:
        """Цилиндр вдоль X (колесо): боковины + крышки другого цвета."""
        cx, cy, cz = center
        half = length / 2.0
        ring: list[tuple[float, float]] = []
        for i in range(segments):
            angle = math.tau * i / segments
            ring.append((math.sin(angle), math.cos(angle)))
        verts: list[tuple[float, float, float]] = []
        for x in (-half, half):
            for (sz, sy) in ring:
                verts.append((cx + x, cy + sy * radius, cz + sz * radius))
        # центры крышек
        verts.append((cx - half, cy, cz))
        verts.append((cx + half, cy, cz))
        faces: list[tuple[int, ...]] = []
        colors: list[tuple[float, float, float, float]] = []
        for i in range(segments):
            j = (i + 1) % segments
            faces.append((i, j, segments + j, segments + i))
            colors.append(color)
        center_left = segments * 2
        center_right = segments * 2 + 1
        cap = cap_color if cap_color is not None else color
        for i in range(segments):
            j = (i + 1) % segments
            faces.append((center_left, j, i))
            colors.append(cap)
            faces.append((center_right, segments + i, segments + j))
            colors.append(cap)
        base = len(self.verts)
        self.verts.extend(verts)
        for face in faces:
            self.faces.append(tuple(base + i for i in face))
        self.colors.extend(colors)

    def cyl_y(
        self,
        center: tuple[float, float, float],
        radius: float,
        height: float,
        color,
        segments: int = 8,
        cap_color=None,
        top_color=None,
    ) -> None:
        """Вертикальный цилиндр (столбы, урны, стволы)."""
        cx, cy, cz = center
        half = height / 2.0
        ring = []
        for i in range(segments):
            angle = math.tau * i / segments
            ring.append((math.sin(angle), math.cos(angle)))
        verts: list[tuple[float, float, float]] = []
        for y in (-half, half):
            for (sx, sz) in ring:
                verts.append((cx + sx * radius, cy + y, cz + sz * radius))
        verts.append((cx, cy - half, cz))
        verts.append((cx, cy + half, cz))
        faces: list[tuple[int, ...]] = []
        colors: list[tuple[float, float, float, float]] = []
        for i in range(segments):
            j = (i + 1) % segments
            faces.append((i, segments + i, segments + j, j))
            colors.append(color)
        bottom_center = segments * 2
        top_center = segments * 2 + 1
        for i in range(segments):
            j = (i + 1) % segments
            faces.append((bottom_center, i, j))
            colors.append(cap_color if cap_color is not None else color)
            faces.append((top_center, segments + j, segments + i))
            colors.append(top_color if top_color is not None else color)
        base = len(self.verts)
        self.verts.extend(verts)
        for face in faces:
            self.faces.append(tuple(base + i for i in face))
        self.colors.extend(colors)

    def cone_y(
        self,
        center: tuple[float, float, float],
        radius: float,
        height: float,
        color,
        segments: int = 8,
        bottom_color=None,
        skew: tuple[float, float] = (0.0, 0.0),
    ) -> None:
        """Вертикальный конус (кроны деревьев): основание снизу, вершина сверху.

        skew сдвигает вершину по (x, z) — «наклонённая» крона.
        """
        cx, cy, cz = center
        half = height / 2.0
        verts: list[tuple[float, float, float]] = []
        for i in range(segments):
            angle = math.tau * i / segments
            verts.append((cx + math.sin(angle) * radius, cy - half, cz + math.cos(angle) * radius))
        apex = len(verts)
        verts.append((cx + skew[0], cy + half, cz + skew[1]))
        verts.append((cx, cy - half, cz))
        faces: list[tuple[int, ...]] = []
        colors: list[tuple[float, float, float, float]] = []
        for i in range(segments):
            j = (i + 1) % segments
            faces.append((i, j, apex))
            colors.append(color)
        bottom_center = apex + 1
        for i in range(segments):
            j = (i + 1) % segments
            faces.append((bottom_center, j, i))
            colors.append(bottom_color if bottom_color is not None else color)
        base = len(self.verts)
        self.verts.extend(verts)
        for face in faces:
            self.faces.append(tuple(base + i for i in face))
        self.colors.extend(colors)

    def sphere(
        self,
        center: tuple[float, float, float],
        radius: tuple[float, float, float],
        color,
        segments: int = 8,
        rings: int = 4,
        bottom_color=None,
    ) -> None:
        """Низкополигональная сфера: seg·(2 + 2·(rings−2)) треугольников."""
        cx, cy, cz = center
        rx, ry, rz = radius
        verts: list[tuple[float, float, float]] = [(cx, cy + ry, cz), (cx, cy - ry, cz)]
        for r in range(1, rings):
            phi = math.pi * r / rings
            for i in range(segments):
                theta = math.tau * i / segments
                verts.append(
                    (
                        cx + math.sin(phi) * math.sin(theta) * rx,
                        cy + math.cos(phi) * ry,
                        cz + math.sin(phi) * math.cos(theta) * rz,
                    )
                )
        faces: list[tuple[int, ...]] = []
        colors: list[tuple[float, float, float, float]] = []

        def ring_index(r: int, i: int) -> int:
            return 2 + (r - 1) * segments + (i % segments)

        for i in range(segments):
            faces.append((0, ring_index(1, i + 1), ring_index(1, i)))
            colors.append(color)
        for r in range(1, rings - 1):
            for i in range(segments):
                faces.append((ring_index(r, i), ring_index(r, i + 1), ring_index(r + 1, i + 1), ring_index(r + 1, i)))
                colors.append(color)
        for i in range(segments):
            faces.append((1, ring_index(rings - 1, i), ring_index(rings - 1, i + 1)))
            colors.append(bottom_color if bottom_color is not None else color)
        base = len(self.verts)
        self.verts.extend(verts)
        for face in faces:
            self.faces.append(tuple(base + i for i in face))
        self.colors.extend(colors)


# --- сцена и объекты -------------------------------------------------------


def reset_scene() -> None:
    """Очистить сцену до пустой: скрипт запускается в factory-startup."""
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    for mesh in list(bpy.data.meshes):
        bpy.data.meshes.remove(mesh)
    for material in list(bpy.data.materials):
        bpy.data.materials.remove(material)
    scene = bpy.context.scene
    scene.unit_settings.system = 'METRIC'
    scene.unit_settings.scale_length = 1.0
    scene.render.engine = 'BLENDER_EEVEE' if 'BLENDER_EEVEE' in {
        item.identifier for item in scene.render.bl_rna.properties['engine'].enum_items
    } else scene.render.engine


def flat_material(name: str = 'tmc_flat') -> bpy.types.Material:
    """Единый материал-заглушка: цвет берётся из COLOR_0."""
    material = bpy.data.materials.get(name)
    if material is not None:
        return material
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    for node in list(nodes):
        nodes.remove(node)
    output = nodes.new('ShaderNodeOutputMaterial')
    diffuse = nodes.new('ShaderNodeBsdfDiffuse')
    diffuse.inputs['Color'].default_value = (1.0, 1.0, 1.0, 1.0)
    diffuse.inputs['Roughness'].default_value = 1.0
    material.node_tree.links.new(diffuse.outputs['BSDF'], output.inputs['Surface'])
    return material


def build_object(
    name: str,
    part: Part,
    material: bpy.types.Material,
    location: tuple[float, float, float] = (0.0, 0.0, 0.0),
) -> bpy.types.Object:
    """Создать объект из Part; цвет — в COLOR_0, грани плоские."""
    if part.is_empty():
        raise ValueError(f'{name}: пустая геометрия')
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(
        [game_to_blender(x, y, z) for (x, y, z) in part.verts],
        [],
        [list(face) for face in part.faces],
    )
    mesh.validate(verbose=False)
    mesh.update(calc_edges=True)

    # Наружные нормали: все примитивы замкнутые, поэтому recalc даёт верный знак.
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    mesh.update()

    if len(mesh.polygons) != len(part.colors):
        raise ValueError(f'{name}: граней {len(mesh.polygons)} ≠ цветов {len(part.colors)}')

    layer = mesh.color_attributes.new(name='Col', type='FLOAT_COLOR', domain='CORNER')
    for polygon, color in zip(mesh.polygons, part.colors):
        polygon.use_smooth = False
        for loop_index in polygon.loop_indices:
            layer.data[loop_index].color = color
    mesh.color_attributes.active_color_index = 0
    mesh.color_attributes.render_color_index = 0

    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = game_to_blender(*location)
    obj.rotation_mode = 'XYZ'
    mesh.materials.append(material)
    return obj


def tri_count(objects) -> int:
    """Треугольников в объектах (после триангуляции)."""
    total = 0
    for obj in objects:
        mesh = obj.data
        mesh.calc_loop_triangles()
        total += len(mesh.loop_triangles)
    return total


def select_only(objects) -> None:
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects:
        obj.select_set(True)
    if objects:
        bpy.context.view_layer.objects.active = objects[0]


def export_glb(path: str, objects) -> int:
    """Экспорт выбранных объектов в GLB. Возвращает число треугольников."""
    select_only(objects)
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_vertex_color='ACTIVE',
        export_all_vertex_colors=False,
        export_materials='EXPORT',
        export_texcoords=False,
        export_normals=True,
        export_tangents=False,
        export_cameras=False,
        export_lights=False,
        export_animations=False,
        export_skins=False,
        export_morph=False,
        export_extras=False,
        export_image_format='NONE',
        export_optimize_animation_size=False,
        will_save_settings=False,
    )
    return tri_count(objects)


def save_blend(path: str) -> None:
    """Сохранить .blend для ручного разбора (в .gitignore)."""
    bpy.ops.wm.save_as_mainfile(filepath=path, check_existing=False)


def remove_objects(objects) -> None:
    for obj in objects:
        mesh = obj.data
        bpy.data.objects.remove(obj, do_unlink=True)
        if mesh.users == 0:
            bpy.data.meshes.remove(mesh)
