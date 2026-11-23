# 08 — Текстуры и Stable Diffusion (textures)

## Миссия
Обеспечить город текстурами и декоративными элементами в едином стиле.
Зона — `assets/textures/**`, `tools/sd/**`.

## Что генерируем, а что нет
Генерируем:
- Бесшовные текстуры: асфальт, бетон, кирпич, плитка, трава, металл, крыши.
- Билборды, постеры, граффити, вывески (без читаемого текста и брендов).
- Скайбокс/фон, если нужно.

НЕ генерируем:
- Машины, персонажей, здания — это геометрия в Blender (`art3d`).
- UI-иконки — SVG/вектор.
- Что-либо с реальными логотипами, лицами знаменитостей, текстом.

## Окружение
- ComfyUI: `D:\Programs\WebUI\Data\Packages\ComfyUI`
- Запуск headless:
  `D:\Programs\WebUI\Data\Packages\ComfyUI\venv\Scripts\python.exe main.py --listen 127.0.0.1 --port 8188`
  (рабочая папка — ComfyUI).
- API: `http://127.0.0.1:8188` (`POST /prompt`, `GET /history/{id}`, `GET /view`).
- Чекпойнты: `animagine-xl-3.1`, `DreamShaper8_pruned`, `v1-5-pruned-emaonly`.
- Для текстур по умолчанию — DreamShaper8 (SD1.5, 512×512), SDXL — только если нужен
  крупный билборд.
- Выход: `D:\Programs\WebUI\Data\Images` (симлинк из `ComfyUI/output`).

## Пайплайн
1. Запустить ComfyUI, дождаться `/system_stats`.
2. Прогнать workflow (JSON) через API, батч 4–8, seed фиксирован в задаче.
3. Отобрать 1–2 варианта, обрезать/привести к 256 или 512, степень двойки.
4. Постобработка: desaturate до палитры, лёгкий шум, проверка бесшовности (offset 50% +
   замазать шов), сохранить PNG/WebP в `assets/textures/<категория>/`.
5. Записать промпт, модель, seed, cfg, steps в `assets/textures/MANIFEST.md`.
6. **Гигиена**: удалить `ComfyUI/temp/*`, удалить из `Data/Images` все `tmc_*` и отвергнутые
   варианты, затем остановить ComfyUI (`Stop-Process` по PID).

## Правила промптов
- Стиль: `stylized low-poly game texture, flat colors, clean, seamless tileable, top-down,
  no text, no logo, no watermark`.
- Негатив: `text, letters, logo, watermark, photorealistic, noisy, seams, border`.
- Никаких упоминаний GTA и реальных марок.
- Один и тот же стиль-суффикс во всей серии, чтобы текстуры сочетались.

## Критерий приёмки
- 10+ текстур, бесшовные, палитра совпадает с концептом.
- В сцене не видно швов и «мыла».
- `MANIFEST.md` позволяет воспроизвести любую текстуру.
- После работы не осталось процессов и мусора в `temp`/`Images`.

## Не делать
- Не генерировать 3D-модели и персонажей.
- Не оставлять ComfyUI запущенным.
- Не удалять чужие файлы в `Data/Images` — только свои `tmc_*`.
