# MaskSim Training Guide

This guide describes how to train a MaskSim deepfake detector for any generator
using the VS Code / Python script workflow.

---

## Prerequisites

- Python 3.11
- PyTorch 2.x + CUDA (RTX 5060 recommended, 8 GB VRAM)
- Install dependencies:

```bash
pip install torch torchvision scikit-learn tqdm pillow
```

---

## Environment

All commands must be run from inside `masksim_project/`:

```
cd masksim_project
python -m training.train ...
```

---

## 1. Inspect Dataset

Before training, confirm all generators have data:

```bash
python -m training.inspect_dataset --split_file data/splits.json
```

---

## 2. Run a Smoke Test

Always run a smoke test first to confirm the pipeline works end-to-end with no NaN, no OOM:

```bash
python -m training.train --config training/configs/sd14.json --smoke_test
```

Expected output:
```
Using device: cuda
  GPU: NVIDIA GeForce RTX 5060 Laptop GPU
  VRAM: 8.5 GB
Loading pretrained DnCNN from pretrained/dncnn_color_blind.pth
  Epoch 1/10 | generator: stable-diffusion-1-4
  ...
Smoke test complete -- 1 batch forward+backward OK, no NaN/OOM.
```

---

## 3. Train a Generator

```bash
python -m training.train --config training/configs/<generator>.json
```

Available configs:

| Config file | Generator |
|---|---|
| `sd14.json` | Stable Diffusion 1.4 |
| `sd13.json` | Stable Diffusion 1.3 |
| `sd2.json` | Stable Diffusion 2 |
| `sdxl.json` | Stable Diffusion XL |
| `dalle2.json` | DALL-E 2 |
| `dalle3.json` | DALL-E 3 |
| `midjourney_v5.json` | Midjourney v5 |
| `firefly.json` | Adobe Firefly |
| `glide.json` | GLIDE |

---

## 4. Resume Training

```bash
python -m training.train \
  --config training/configs/sd14.json \
  --resume checkpoints/stable-diffusion-1-4/latest.pt
```

---

## 5. Evaluate on Test Set

```bash
python -m training.evaluate \
  --config training/configs/sd14.json \
  --checkpoint checkpoints/stable-diffusion-1-4/best.pt \
  --split test
```

Results saved to `outputs/stable-diffusion-1-4/test_metrics.json`.

---

## 6. Export for Deployment

Convert a training checkpoint to a deployment-ready format for FastAPI:

```bash
python -m training.export_deploy \
  --best_ckpt checkpoints/stable-diffusion-1-4/best.pt \
  --deploy_ckpt ml-service/models/masksim_sd14_deploy.pt
```

---

## Hyperparameters

| Parameter | Value | Notes |
|---|---|---|
| Physical batch size | 4 | Fits 8 GB VRAM |
| Gradient accumulation | 2 | Effective batch = 8 |
| DnCNN LR | 1e-4 | Adam |
| MaskSim LR | 1e-3 | Adam |
| Scheduler | ExponentialLR gamma=0.99 | Per epoch |
| JPEG quality (train) | 65-100 | Random, both classes |
| JPEG quality (val/test) | None | No augmentation |
| Crop (train) | Random 512×512 | When image > 512 |
| Crop (val/test) | Center 512×512 | Deterministic |
| Input normalization | [0, 1] | No ImageNet mean/std |

---

## Architecture Details

### DnCNN (Denoiser)
- Input: RGB image [B, 3, H, W]
- 20 convolutional layers (layer 1: 3→64 + ReLU, layers 2-19: 64→64 + ReLU, layer 20: 64→3)
- `residual(x)` returns the noise estimate
- `forward(x)` returns the denoised image (x - noise)

### Feature Extraction Pipeline
```
RGB → rgb_to_ycbcr() → DnCNN.residual() → log_mag_spectrum()
  [BT.601]             [noise estimate]    [FFT, norm="ortho", fftshift]
```

### MaskSim (Classifier)
- `Conv2d(c, c, kernel_size=1)` learnable 1×1 conv
- Learnable spatial mask `mask_raw` → sigmoid → multiply
- BatchNorm2d
- Learnable reference template `ref`
- Cosine similarity between feature map and ref
- Output: `sigmoid(exp(a) * sim + b)` — scalar probability per image

### Training Loss
- **Fake (label=1)**: normal cosine similarity (encourages positive alignment)
- **Real (label=0)**: absolute cosine similarity (encourages zero-centered noise)
- Formula: `sim_adj = sim * label + |sim| * (1 - label)`
- `probability = sigmoid(exp(a) * sim_adj + b).clamp(1e-6, 1-1e-6)`
- Loss: `BCE(probability, label)`

> **Important**: The abs-cosine trick is ONLY used during training.
> Validation, test, and inference use `masksim.forward()` = standard cosine.

---

## 8. Training All Remaining Models (Orchestrator)

A sequential orchestrator is provided to train multiple generator models automatically:

```bash
python -m training.train_all
```

**Default Behavior:**
1. Trains 8 models in this exact order: `sd13`, `sd2`, `sdxl`, `dalle2`, `dalle3`, `midjourney_v5`, `firefly`, `glide`.
2. Automatically detects partial training (`latest.pt`) and resumes from the exact epoch.
3. Automatically skips completed models.
4. After 10 epochs are reached, automatically runs the test evaluation on `best.pt`.
5. Gracefully handles `Ctrl+C` interruption, allowing exact resumption.

**Check Queue Status:**
```bash
python -m training.train_all --status
```

**Advanced CLI options:**
```bash
python -m training.train_all --models sd2 sdxl     # Train specific models only
python -m training.train_all --start-from sdxl     # Skip models before SDXL
python -m training.train_all --skip-evaluation     # Skip test split evaluation
```

> **Important:** Windows may pause background execution if the computer goes to sleep. Configure power settings to keep the PC awake if running a long queue overnight.

---

## Logs and Checkpoints

After training:
```
masksim_project/
  checkpoints/<generator>/
    latest.pt         # Last epoch (for resuming)
    best.pt           # Best val loss epoch
  logs/<generator>/
    history.json      # Full training history
    history.csv       # Per-epoch metrics table
  outputs/<generator>/
    test_metrics.json # Test set evaluation
    test_predictions.json
```

---

## Pretrained DnCNN Rule

Every new generator model **must** start from `pretrained/dncnn_color_blind.pth`.
Do NOT initialize from a previously fine-tuned DnCNN (e.g., from SD1.4).
Each generator gets its own independent DnCNN adaptation.
