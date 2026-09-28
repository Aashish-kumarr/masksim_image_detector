"""
inspect_dataset.py — Inventory the masksim_project/data directory.

Usage:
    python inspect_dataset.py
    python inspect_dataset.py --split_file data/splits.json
"""
import argparse
import json
import os
from pathlib import Path
from collections import defaultdict


DATA_DIR = Path(__file__).resolve().parent.parent / "data"

GENERATOR_DIRS = {
    "stable-diffusion-1-4": DATA_DIR / "synthbuster" / "synthbuster" / "stable-diffusion-1-4",
    "stable-diffusion-1-3": DATA_DIR / "synthbuster" / "synthbuster" / "stable-diffusion-1-3",
    "stable-diffusion-2":   DATA_DIR / "synthbuster" / "synthbuster" / "stable-diffusion-2",
    "stable-diffusion-xl":  DATA_DIR / "synthbuster" / "synthbuster" / "stable-diffusion-xl",
    "dalle2":               DATA_DIR / "synthbuster" / "synthbuster" / "dalle2",
    "dalle3":               DATA_DIR / "synthbuster" / "synthbuster" / "dalle3",
    "midjourney-v5":        DATA_DIR / "synthbuster" / "synthbuster" / "midjourney-v5",
    "firefly":              DATA_DIR / "synthbuster" / "synthbuster" / "firefly",
    "glide":                DATA_DIR / "synthbuster" / "synthbuster" / "glide",
}

REAL_DIR = DATA_DIR / "raise_processed"

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff"}


def count_images(directory: Path) -> int:
    if not directory.exists():
        return 0
    return sum(1 for f in directory.iterdir() if f.suffix.lower() in IMAGE_EXTS)


def get_ids(directory: Path) -> set:
    if not directory.exists():
        return set()
    return {f.stem for f in directory.iterdir() if f.suffix.lower() in IMAGE_EXTS}


def inspect_dataset(split_file=None):
    real_count = count_images(REAL_DIR)
    real_ids   = get_ids(REAL_DIR)

    print("=" * 65)
    print("  MaskSim Dataset Inventory")
    print("=" * 65)
    print(f"\n  Real images (RAISE-1K processed): {real_count:>5}")
    print(f"  Real dir: {REAL_DIR}")

    print("\n  Generator (Fake) Image Counts:")
    print(f"  {'Generator':<30} {'Images':>6}  {'Paired w/ Real':>14}  {'Status'}")
    print(f"  {'-'*30}  {'-'*6}  {'-'*14}  {'-'*10}")

    for gen_id, gen_dir in GENERATOR_DIRS.items():
        count   = count_images(gen_dir)
        fake_ids = get_ids(gen_dir)
        paired  = len(real_ids & fake_ids)
        status  = "[OK] READY" if count >= 900 else ("[~] PARTIAL" if count > 0 else "[X] MISSING")
        print(f"  {gen_id:<30} {count:>6}  {paired:>14}  {status}")

    if split_file:
        sf = Path(split_file)
        if sf.exists():
            with open(sf) as f:
                splits = json.load(f)
            print(f"\n  Splits from: {sf}")
            for split_name, split_data in splits.items():
                n_real = len(split_data.get("real", []))
                n_fake = len(split_data.get("fake", []))
                print(f"    {split_name:<8} real={n_real}  fake={n_fake}")
        else:
            print(f"\n  Split file not found: {sf}")

    print()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--split_file", default=None, help="Optional splits.json path")
    args = parser.parse_args()
    inspect_dataset(args.split_file)
