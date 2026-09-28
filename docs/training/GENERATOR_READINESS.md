# Generator Dataset Readiness

All fake images come from the Synthbuster dataset. Real images are from the RAISE-1K dataset (1024×1024 PNG, center-cropped from 8.1 MP RAW).

## Dataset Summary

| Generator | Fake Images | Real (RAISE) | Paired | Status |
|---|---|---|---|---|
| stable-diffusion-1-4 | 1000 | 987 | 987 | [OK] READY |
| stable-diffusion-1-3 | 1000 | 987 | 987 | [OK] READY |
| stable-diffusion-2 | 1000 | 987 | 987 | [OK] READY |
| stable-diffusion-xl | 1000 | 987 | 987 | [OK] READY |
| dalle2 | 1003 | 987 | 987 | [OK] READY |
| dalle3 | 1000 | 987 | 987 | [OK] READY |
| midjourney-v5 | 1000 | 987 | 987 | [OK] READY |
| firefly | 1000 | 987 | 987 | [OK] READY |
| glide | 1000 | 987 | 987 | [OK] READY |

**All 9 generators are fully ready for training.**

## Split Configuration (from `data/splits.json`)

| Split | Real | Fake |
|---|---|---|
| train | 691 | 691 |
| val | 148 | 148 |
| test | 148 | 148 |

> **Note:** Splits use paired IDs (same RAISE source image matched to the same Synthbuster generator image by filename stem). This means all 9 generators see the same real image IDs, which ensures consistent and fair comparison.

## Data Paths

```
masksim_project/
  data/
    raise_processed/          # 987 real PNG images (1024×1024)
    synthbuster/synthbuster/
      stable-diffusion-1-4/   # 1000 fake PNGs
      stable-diffusion-1-3/   # 1000 fake PNGs
      stable-diffusion-2/     # 1000 fake PNGs
      stable-diffusion-xl/    # 1000 fake PNGs
      dalle2/                 # 1003 fake PNGs
      dalle3/                 # 1000 fake PNGs
      midjourney-v5/          # 1000 fake PNGs
      firefly/                # 1000 fake PNGs
      glide/                  # 1000 fake PNGs
    splits.json               # Shared split file (paired by source ID)
```

## SD1.4 Verified Checkpoint Metrics

The existing `checkpoints/masksim_sd14_best.pt` was trained on SD1.4 for 10 epochs:

| Metric | Value |
|---|---|
| Epoch | 10 |
| Val AUC | **0.9754** |
| Val Loss | 0.3782 |
| Batch (physical / accum / effective) | 4 / 2 / 8 |

This checkpoint loads cleanly into the migrated `training/models.py` (verified via `verify_legacy_checkpoint.py`).
