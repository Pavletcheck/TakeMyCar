# Текстуры M7

Модель: `DreamShaper8 (SD1.5)`, 256/512 px, степень двойки, бесшовные, low-poly flat.
Промпты, негативы и параметры — в спеке `tools/sd/textures_m7.json`.

| Имя | Категория | Размер | Seed | Seam | PNG | WebP |
|---|---|---|---|---|---|---|
| asphalt | ground | 512 | 940111 | 8.3 | `ground/asphalt.png` | `ground/asphalt.webp` |
| sidewalk | ground | 512 | 950411 | 2.6 | `ground/sidewalk.png` | `ground/sidewalk.webp` |
| grass | ground | 512 | 950131 | 1.8 | `ground/grass.png` | `ground/grass.webp` |
| dirt | ground | 512 | 950201 | 4.4 | `ground/dirt.png` | `ground/dirt.webp` |
| brick | walls | 256 | 900111 | 1.7 | `walls/brick.png` | `walls/brick.webp` |
| plaster | walls | 256 | 950502 | 2.0 | `walls/plaster.png` | `walls/plaster.webp` |
| concrete | walls | 256 | 950501 | 1.7 | `walls/concrete.png` | `walls/concrete.webp` |
| tile | walls | 256 | 920702 | 1.6 | `walls/tile.png` | `walls/tile.webp` |
| window_strip | walls | 256 | 940511 | 1.6 | `walls/window_strip.png` | `walls/window_strip.webp` |
| metal | details | 256 | 940701 | 1.9 | `details/metal.png` | `details/metal.webp` |
| wood | details | 256 | 910006 | 1.7 | `details/wood.png` | `details/wood.webp` |
| roof | roofs | 512 | 950312 | 1.6 | `roofs/roof.png` | `roofs/roof.webp` |
| roof_metal | roofs | 256 | 940401 | 1.5 | `roofs/roof_metal.png` | `roofs/roof_metal.webp` |
| graffiti_panel | decals | 512 | 921202 | 0.9 | `decals/graffiti_panel.png` | `decals/graffiti_panel.webp` |
| poster | decals | 512 | 921301 | 1.1 | `decals/poster.png` | `decals/poster.webp` |

## Воспроизведение

```powershell
& "D:\Programs\WebUI\Data\Packages\ComfyUI\venv\Scripts\python.exe" `
  tools/sd/generate_textures.py --spec tools/sd/textures_m7.json --out assets/textures
```

`Seam` — метрика шва (меньше = лучше), считается по разнице краёв после `make_seamless`.

## Гигиена
После генерации удалить `ComfyUI/temp/*`, свои `tmc_*` в `ComfyUI/output`,
остановить ComfyUI по PID. Не удалять чужие изображения и модели.
