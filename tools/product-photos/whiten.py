"""
Put every product photo on a clean white, square background.

    py -3.12 -m venv .venv-photos
    .venv-photos\\Scripts\\python -m pip install "rembg[cpu]" pillow
    .venv-photos\\Scripts\\python tools/product-photos/whiten.py            # all new/changed photos
    .venv-photos\\Scripts\\python tools/product-photos/whiten.py --force    # redo everything

How it works
  * Photos live in public/images/products/{band}/{band}_{category}.{ext}.
  * The first time a photo is seen, the untouched original is copied to
    resources/product-photos/originals/{band}/ (not public, not deployed).
  * The public file is then regenerated from that original: background removed
    (rembg, runs locally, free), composited on white, padded to a square,
    resized to at most 1200 px. Same file name, so the seeder keeps working.
  * To undo for one photo, copy its original back over the public file.
  * .avif photos are saved as .jpg (the seeder accepts any of these extensions).
  * A replaced photo (new file dropped in with the same name) is detected by
    comparing against the last processed output, and becomes the new original.

Needs Python 3.12 or older (rembg's dependencies don't support 3.15 yet).
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
PUBLIC_DIR = ROOT / "public" / "images" / "products"
ORIGINALS_DIR = ROOT / "resources" / "product-photos" / "originals"
STATE_FILE = ORIGINALS_DIR / ".processed.json"  # output hash per photo, to spot replaced files

EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}
CONVERT_TO_JPG = {".avif"}
MAX_SIZE = 1200
MARGIN = 0.08  # white space around the product, as a fraction of the square


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def process(src: Path, dest: Path, session) -> None:
    from rembg import remove

    image = ImageOps.exif_transpose(Image.open(src)).convert("RGBA")
    cutout = remove(image, session=session, post_process_mask=True)

    # Trim to the product itself, then centre it on a white square with a margin.
    bbox = cutout.getbbox() or (0, 0, *cutout.size)
    cutout = cutout.crop(bbox)
    side = int(max(cutout.size) / (1 - 2 * MARGIN))
    canvas = Image.new("RGBA", (side, side), (255, 255, 255, 255))
    canvas.alpha_composite(cutout, ((side - cutout.width) // 2, (side - cutout.height) // 2))

    result = canvas.convert("RGB")
    if side > MAX_SIZE:
        result = result.resize((MAX_SIZE, MAX_SIZE), Image.LANCZOS)

    if dest.suffix.lower() == ".png":
        result.save(dest, optimize=True)
    elif dest.suffix.lower() == ".webp":
        result.save(dest, quality=88)
    else:
        result.save(dest, quality=88, optimize=True, progressive=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--force", action="store_true", help="reprocess every photo from its original")
    parser.add_argument("--model", default="birefnet-general", help="rembg model (default: birefnet-general; first run downloads ~1 GB)")
    parser.add_argument("--only", nargs="+", metavar="BAND/FILE", help="limit to these photos, e.g. wknd/wknd_shirt.jpg (implies --force)")
    args = parser.parse_args()
    if args.only:
        args.force = True

    state: dict[str, str] = json.loads(STATE_FILE.read_text()) if STATE_FILE.exists() else {}
    photos = sorted(p for p in PUBLIC_DIR.glob("*/*") if p.suffix.lower() in EXTENSIONS)
    session = None

    for photo in photos:
        # AVIF isn't supported by every browser/editor, so its processed copy is saved as JPG.
        output = photo.with_suffix(".jpg") if photo.suffix.lower() in CONVERT_TO_JPG else photo
        key = output.relative_to(PUBLIC_DIR).as_posix()
        if args.only and key not in args.only and photo.relative_to(PUBLIC_DIR).as_posix() not in args.only:
            continue

        if state.get(key) != sha(photo):
            # New photo, or one replaced since we last processed it: it becomes the original.
            band_originals = ORIGINALS_DIR / photo.parent.name
            band_originals.mkdir(parents=True, exist_ok=True)
            for stale in band_originals.glob(f"{photo.stem}.*"):
                stale.unlink()
            shutil.copy2(photo, band_originals / photo.name)
        elif not args.force:
            print(f"skip   {key} (already processed)")
            continue

        original = next((ORIGINALS_DIR / photo.parent.name).glob(f"{photo.stem}.*"), None)
        if original is None:
            print(f"miss   {key} (no original found; drop the photo in again)")
            continue

        if session is None:
            from rembg import new_session

            print(f"loading model {args.model} (first run downloads it)...", flush=True)
            session = new_session(args.model)

        process(original, output, session)
        if output != photo:
            photo.unlink()
        state[key] = sha(output)
        print(f"done   {key}", flush=True)

    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
