"""Генерация бесшовных текстур TakeMyCar через API ComfyUI.

Пайплайн:
  1. ставит в очередь N кандидатов на каждую текстуру (SD1.5, DreamShaper8);
  2. забирает результат через /history + /view во временную папку;
  3. выбирает лучший кандидат по показателю детализации;
  4. делает тайл бесшовным: сдвиг на 50% + гармоническое заполнение крестовины шва;
  5. лёгкая подгонка палитры и зерно, сохранение PNG + WebP в assets/textures/<категория>/;
  6. пишет отчёт по швам и строки для MANIFEST.md.

Запуск (из корня проекта, интерпретатор — venv ComfyUI):
  python tools/sd/generate_textures.py --spec tools/sd/textures_m7.json \
      --out assets/textures --api http://127.0.0.1:8188 --report tmp/seams.json
"""

from __future__ import annotations

import argparse
import io
import json
import random
import time
import urllib.parse
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

MANIFEST_ROWS: list[dict] = []


# ---------------------------------------------------------------- ComfyUI API


def api_post(api: str, path: str, payload: dict) -> dict:
    data = json.dumps(payload).encode("utf-8")
    last_err: Exception | None = None
    for _ in range(10):
        try:
            req = urllib.request.Request(
                f"{api}{path}", data=data, headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=60) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except OSError as err:  # сервер мог перезапускаться
            last_err = err
            time.sleep(5.0)
    raise RuntimeError(f"ComfyUI API недоступен: {last_err}")


def api_get(api: str, path: str, params: dict | None = None) -> bytes:
    url = f"{api}{path}"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    last_err: Exception | None = None
    for _ in range(10):
        try:
            with urllib.request.urlopen(url, timeout=120) as resp:
                return resp.read()
        except OSError as err:
            last_err = err
            time.sleep(5.0)
    raise RuntimeError(f"ComfyUI API недоступен: {last_err}")


def build_workflow(spec: dict, item: dict, seed: int) -> dict:
    prompt = f"{item['subject']}, {spec['suffix']}"
    negative = item.get("negative", spec["negative"])
    wf = {
        "1": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {"ckpt_name": spec["model"]},
        },
        "2": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": prompt, "clip": ["1", 1]},
        },
        "3": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": negative, "clip": ["1", 1]},
        },
        "4": {
            "class_type": "EmptyLatentImage",
            "inputs": {"width": 512, "height": 512, "batch_size": 1},
        },
        "5": {
            "class_type": "KSampler",
            "inputs": {
                "seed": seed,
                "steps": spec["steps"],
                "cfg": spec["cfg"],
                "sampler_name": spec["sampler"],
                "scheduler": spec["scheduler"],
                "denoise": 1.0,
                "model": ["1", 0],
                "positive": ["2", 0],
                "negative": ["3", 0],
                "latent_image": ["4", 0],
            },
        },
        "6": {
            "class_type": "VAEDecode",
            "inputs": {"samples": ["5", 0], "vae": ["1", 2]},
        },
        "7": {
            "class_type": "SaveImage",
            "inputs": {
                "images": ["6", 0],
                "filename_prefix": f"tmc_{item['name']}_s{seed}",
            },
        },
    }
    return wf


def run_prompt(api: str, workflow: dict) -> dict:
    res = api_post(api, "/prompt", {"prompt": workflow, "client_id": "tmc-textures"})
    prompt_id = res["prompt_id"]
    deadline = time.time() + 600
    while time.time() < deadline:
        hist = json.loads(api_get(api, f"/history/{prompt_id}").decode("utf-8"))
        if prompt_id in hist:
            entry = hist[prompt_id]
            status = entry.get("status", {})
            if status.get("status_str") == "error":
                raise RuntimeError(f"ComfyUI error: {status}")
            images = entry.get("outputs", {}).get("7", {}).get("images", [])
            if images:
                return images[0]
        time.sleep(1.0)
    raise TimeoutError(f"ComfyUI не отдал результат за 600 c (prompt {prompt_id})")


def run_prompt_retry(api: str, workflow: dict, attempts: int = 3) -> dict:
    """Повтор при временных сбоях ComfyUI (нехватка RAM, падение decode)."""
    last: Exception | None = None
    for i in range(attempts):
        try:
            return run_prompt(api, workflow)
        except (RuntimeError, TimeoutError) as err:
            last = err
            print(f"    сбой ({err.__class__.__name__}), попытка {i + 1}/{attempts}", flush=True)
            time.sleep(5.0)
    raise RuntimeError(f"ComfyUI не смог выполнить промпт: {last}")


def fetch_image(api: str, meta: dict) -> Image.Image:
    raw = api_get(
        api,
        "/view",
        {
            "filename": meta["filename"],
            "subfolder": meta.get("subfolder", ""),
            "type": meta.get("type", "output"),
        },
    )
    return Image.open(io.BytesIO(raw)).convert("RGB")


# ------------------------------------------------------------ постобработка


def detail_score(img: Image.Image) -> float:
    """Средний модуль градиента — грубая мера насыщенности деталями."""
    g = np.asarray(img.convert("L").resize((128, 128), Image.BICUBIC), dtype=np.float32)
    gx = np.abs(np.diff(g, axis=1)).mean()
    gy = np.abs(np.diff(g, axis=0)).mean()
    return float(gx + gy)


def seam_metric(arr: np.ndarray) -> float:
    """Средняя разница соседних пикселей на краях тайла (по кругу), 0..255."""
    d = np.abs(arr[0].astype(np.float32) - arr[-1].astype(np.float32)).mean()
    d += np.abs(arr[:, 0].astype(np.float32) - arr[:, -1].astype(np.float32)).mean()
    return float(d / 2.0)


def make_seamless(img: Image.Image) -> tuple[Image.Image, float, float]:
    """Делает тайл бесшовным поворотом (circular shift) на самую гладкую линию разреза.

    Идея: у повторяющейся картинки единственный «шов» — место стыка краёв.
    Вместо замазывания выбираем по вертикали и горизонтали ту соседнюю пару
    строк/столбцов, где перепад минимален, и сдвигом переносим именно её на стык.
    Контент не размывается и не зеркалится — только смещается.

    Возвращает (тайл, перепад на стыке до, перепад после).
    """
    arr = np.asarray(img, dtype=np.float32)
    before = seam_metric(arr)

    # dy[i] — средний перепад между строкой i-1 и i (по кругу)
    dy = np.abs(arr - np.roll(arr, 1, 0)).mean(axis=(1, 2))
    dx = np.abs(arr - np.roll(arr, 1, 1)).mean(axis=(0, 2))
    oy = int(np.argmin(dy))
    ox = int(np.argmin(dx))

    shifted = np.roll(arr, (-oy, -ox), axis=(0, 1))
    tile = Image.fromarray(np.clip(shifted, 0, 255).astype(np.uint8), "RGB")
    after = seam_metric(np.asarray(tile, dtype=np.float32))
    return tile, before, after


def grade(
    img: Image.Image,
    warm: float,
    saturation: float,
    grain: float,
    seed: int,
    palette: int | None = None,
    smooth: bool = False,
) -> Image.Image:
    """Лёгкая подгонка палитры под концепт: тепло/холод, насыщенность, зерно, квантование."""
    if smooth:
        img = img.filter(ImageFilter.MedianFilter(3))
    arr = np.asarray(img, dtype=np.float32) / 255.0
    lum = arr @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    arr = lum[..., None] + (arr - lum[..., None]) * saturation
    # тёплый/холодный сдвиг: warm > 0 — к охре, warm < 0 — к холодному серому
    shift = np.array([1.0 + 0.05 * warm, 1.0, 1.0 - 0.06 * warm], dtype=np.float32)
    arr = arr * shift
    rng = np.random.default_rng(seed)
    if grain > 0.0:
        arr = arr + rng.normal(0.0, grain, arr.shape[:2])[..., None]
    out = Image.fromarray((np.clip(arr, 0.0, 1.0) * 255.0).astype(np.uint8), "RGB")
    if palette:
        # квантование палитры — основной приём «плоских цветов» low-poly
        out = out.quantize(colors=palette, method=Image.MEDIANCUT, dither=Image.NONE)
        out = out.convert("RGB")
    return out


# ------------------------------------------------------------------- основное


def process_item(
    spec: dict, item: dict, api: str, out_root: Path, tmp: Path, reuse_raw: bool = False
) -> dict:
    best: tuple[float, Image.Image, dict, int] | None = None
    for i in range(spec["candidates"]):
        seed = item["seed"] + i
        cached = tmp / f"{item['name']}_s{seed}.png"
        if reuse_raw and cached.exists():
            img = Image.open(cached).convert("RGB")
            score = detail_score(img)
            print(f"  {item['name']} seed={seed} (raw из кэша) detail={score:.2f}", flush=True)
            if best is None or score > best[0]:
                best = (score, img, {"filename": cached.name}, seed)
            continue
        wf = build_workflow(spec, item, seed)
        meta = run_prompt_retry(api, wf)
        img = fetch_image(api, meta)
        (tmp / f"{item['name']}_s{seed}.png").write_bytes(
            api_get(
                api,
                "/view",
                {
                    "filename": meta["filename"],
                    "subfolder": meta.get("subfolder", ""),
                    "type": meta.get("type", "output"),
                },
            )
        )
        score = detail_score(img)
        print(f"  {item['name']} seed={seed} detail={score:.2f}", flush=True)
        if best is None or score > best[0]:
            best = (score, img, meta, seed)

    assert best is not None
    _, raw, _, best_seed = best

    tile, seam_before, seam_after = make_seamless(raw)

    size = int(item["size"])
    tile = tile.resize((size, size), Image.LANCZOS)

    warm = 0.9 if item["category"] in ("ground", "roofs") else 0.25
    grade_cfg = item.get("grade", {})
    tile = grade(
        tile,
        warm=grade_cfg.get("warm", warm),
        saturation=grade_cfg.get("saturation", 1.06),
        grain=grade_cfg.get("grain", 0.006),
        seed=item["seed"],
        palette=grade_cfg.get("palette", 14),
        smooth=grade_cfg.get("smooth", item["category"] in ("ground", "roofs")),
    )
    # после ресайза/грейда шов мог «поехать» — финальная проверка и правка метрикой
    seam_final = seam_metric(np.asarray(tile, dtype=np.float32))

    out_dir = out_root / item["category"]
    out_dir.mkdir(parents=True, exist_ok=True)
    png_path = out_dir / f"{item['name']}.png"
    webp_path = out_dir / f"{item['name']}.webp"
    tile.save(png_path, "PNG", optimize=True)
    tile.save(webp_path, "WEBP", quality=90, method=6)

    row = {
        "name": item["name"],
        "category": item["category"],
        "size": size,
        "model": spec["model"],
        "prompt": f"{item['subject']}, {spec['suffix']}",
        "negative": item.get("negative", spec["negative"]),
        "seed": best_seed,
        "cfg": spec["cfg"],
        "steps": spec["steps"],
        "sampler": f"{spec['sampler']}/{spec['scheduler']}",
        "seam_before": round(seam_before, 2),
        "seam_after": round(seam_after, 2),
        "seam_final": round(seam_final, 2),
        "png": str(png_path.relative_to(out_root.parent.parent)).replace("\\", "/"),
        "webp": str(webp_path.relative_to(out_root.parent.parent)).replace("\\", "/"),
        "detail": round(best[0], 2),
    }
    return row


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--spec", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--api", default="http://127.0.0.1:8188")
    ap.add_argument("--tmp", default="tmp/sd_raw")
    ap.add_argument("--report", default="tmp/sd_seams.json")
    ap.add_argument("--only", default="", help="через запятую: имена текстур")
    ap.add_argument(
        "--skip-existing", action="store_true", help="не перегенерировать уже готовые PNG"
    )
    ap.add_argument(
        "--reuse-raw",
        action="store_true",
        help="брать сырые кадры из --tmp вместо нового запроса к ComfyUI",
    )
    args = ap.parse_args()

    spec = json.loads(Path(args.spec).read_text(encoding="utf-8"))
    out_root = Path(args.out)
    tmp = Path(args.tmp)
    tmp.mkdir(parents=True, exist_ok=True)

    only = {s.strip() for s in args.only.split(",") if s.strip()}
    rows = []
    for item in spec["items"]:
        if only and item["name"] not in only:
            continue
        if args.skip_existing and (out_root / item["category"] / f"{item['name']}.png").exists():
            print(f"[{item['name']}] уже есть, пропуск", flush=True)
            continue
        print(f"[{item['name']}] {item['size']}px", flush=True)
        rows.append(
            process_item(spec, item, args.api, out_root, tmp, reuse_raw=args.reuse_raw)
        )

    report = Path(args.report)
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nготово: {len(rows)} текстур, отчёт {report}")


if __name__ == "__main__":
    main()
