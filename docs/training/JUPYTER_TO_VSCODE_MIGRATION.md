# Jupyter Notebook to VS Code Migration

Maps every logical section of `dsp_01.ipynb` to the corresponding Python script.

## Cell-to-Script Mapping

| Notebook Section | Migrated To | Notes |
|---|---|---|
| Dataset exploration (dir listing, image counts) | `training/inspect_dataset.py` | Run with `python -m training.inspect_dataset` |
| COCO download + split creation | *(archive)* | Replaced by RAISE-1K + paired Synthbuster splits |
| RAISE-1K download + processing | *(archive / one-time script)* | Data already in `data/raise_processed/` |
| `splits.json` creation | *(archive)* | `data/splits.json` already exists |
| `MaskSimDataset` class | `training/dataset.py` | Full crop/JPEG/tensor pipeline |
| `rgb_to_ycbcr()` | `training/transforms.py` | Exact BT.601 matrix |
| `log_mag_spectrum()` | `training/transforms.py` | `fft2(norm="ortho")` + fftshift |
| `DnCNN` class | `training/models.py` | Exactly 20 conv layers |
| `MaskSim` class | `training/models.py` | `Conv2d(c,c,1)`, mask, ref, bn, a, b |
| Training loss (abs-cosine trick) | `training/losses.py` | `masksim_training_loss()` |
| Optimizer + scheduler creation | `training/train.py` | Adam, ExponentialLR gamma=0.99 |
| Training loop | `training/train.py` | tqdm, gradient accumulation, logging |
| Checkpoint save/load | `training/checkpointing.py` | `save_checkpoint()`, `load_checkpoint()` |
| Validation loop | `training/train.py` + `training/evaluate.py` | Std cosine (no abs trick) |
| Metrics (AUC, accuracy, etc.) | `training/metrics.py` | `compute_metrics()` via scikit-learn |
| History logging | `training/train.py` | CSV + JSON per generator |

## Key Implementation Differences from Notebook

### 1. Path Handling
- **Notebook**: Hardcoded absolute Windows paths (`C:\Users\ak021\masksim_project\...`)
- **Scripts**: All paths resolved relative to `__file__` via `pathlib.Path`

### 2. Dataset
- **Notebook**: Used COCO val2017 as real class
- **Scripts**: Uses RAISE-1K (processed) as real class — higher quality, same-source pairing

### 3. Data Splits
- **Notebook**: Random COCO + SD1.4 split; no source-ID linkage
- **Scripts**: Paired by RAISE stem == Synthbuster stem; shared `splits.json` across all generators

### 4. Training Loss
- **Notebook**: `masksim_training_loss(model, spectrum, labels)` function separate from model
- **Scripts**: Same design — `masksim.similarity()` is exposed; `masksim_training_loss()` is in `losses.py`

### 5. Checkpoint Format
- **Notebook**: `{epoch, dncnn_state_dict, masksim_state_dict, optimizer_state_dict, scheduler_state_dict, train_loss, val_loss, val_auc, train_history, val_loss_history, val_auc_history, physical_batch_size, accumulation_steps, effective_batch_size}`
- **Scripts**: Superset of notebook format — adds `generator_id`, `val_accuracy`, `val_f1`, `val_precision`, `val_recall`, `best_val_loss`, `best_epoch`, `config`

The legacy `masksim_sd14_best.pt` loads cleanly into the migrated `DnCNN` and `MaskSim` classes.
