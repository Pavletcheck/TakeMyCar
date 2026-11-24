# 3D-ассеты

Все модели — GLB из Blender 5.3, собраны скриптами `tools/blender/*.py`.
Формат: 1 unit = 1 m, pivot в центре (пропсы по основанию), forward +Z.

## Состав
- `cars/` — sedan, sports, van, truck, police (`*_lod0.glb`, `*_lod1.glb`).
- `characters/` — `ped_base_lod0`, `ped_cop_lod0` + части (`torso`, `head`, `arm_*`, `leg_*`).
- `props/` — фонари, урны, гидранты, деревья, скамейки, билборды, заборы.
- `buildings/` — готовые дома: `bld_block_small/mid/tall`, `bld_tower` (392–584 tris, LOD1 72)
  + модульный кит (стена, угол, крыша, парапет, вывеска).

## Загрузка в игре
`src/render/modelLibrary.ts` кэширует GLB, пути строятся от `import.meta.env.BASE_URL`
(работает на GitHub Pages `/TakeMyCar/`).
- `?models=0` — отключить GLB и проверить fallback на примитивы.
- LOD1 включается по дистанции: машины >58 м, персонажи >45 м.

## Пересборка
См. `tools/blender/README.md`. После изменений проверяйте:
`node tools/blender/inspect_glb.mjs`.

## Бюджеты
draw calls < 150, tris < 200k. В сцене с полным населением LOD1 обязателен.
