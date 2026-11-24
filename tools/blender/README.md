# Blender-пайплайн (low-poly)

Все ассеты собираются headless-скриптами. Ручные правки в Blender не нужны.

## Blender
`C:\Program Files (x86)\Steam\steamapps\common\Blender\blender.exe` (5.3)

## Сборка
Из корня репозитория:

```powershell
# машины (LOD0 + LOD1)
& "C:\Program Files (x86)\Steam\steamapps\common\Blender\blender.exe" --background --python tools/blender/build_cars.py

# персонажи
& "...\blender.exe" --background --python tools/blender/build_characters.py

# пропсы
& "...\blender.exe" --background --python tools/blender/build_props.py

# здания (кит)
& "...\blender.exe" --background --python tools/blender/build_buildings.py

# проверка GLB: треугольники, габариты, пивот
node tools/blender/inspect_glb.mjs
```

Скрипты детерминированы, используют `lib_lowpoly.py` и пишут GLB в `assets/models/`.
`.blend` не сохраняются.

## Соглашения
- 1 unit = 1 m, pivot в центре (пропсы — по основанию), forward +Z.
- Материал один, цвет в `COLOR_0` (vertex color), flat shading, без текстур.
- Машины: 800–1500 tris, LOD1 ≤40 %.
- Персонажи: 400–900 tris, части с пивотами в суставах (без скиннинга).
- Пропсы: 64–200 tris, пивот по основанию.
- Здания: модули 36–220 tris.

## Бюджеты
| Группа | Tris LOD0 | LOD1 |
|---|---|---|
| Машины | 960–1084 | 284–396 |
| Пешеход | 532 | 36 (far) |
| Коп | 600 | 36 (far) |
| Пропсы | 64–180 | — |
| Здания | 36–212 | — |
