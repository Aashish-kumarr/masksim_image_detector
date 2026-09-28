"""
pretrain_checks.py -- Runs all pre-training validation checks for SD1.3.
Exits with code 0 if all checks pass, code 1 if any fail.
"""
import sys
import json
import torch
import numpy as np
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from training.dataset import MaskSimDataset
from training.models import DnCNN, MaskSim
from training.transforms import rgb_to_ycbcr, log_mag_spectrum
from torch.utils.data import DataLoader

CONFIG_PATH = Path("training/configs/sd13.json")
ROOT = Path(__file__).resolve().parent

PASS = "[PASS]"
FAIL = "[FAIL]"
WARN = "[WARN]"

failures = []

def check(label, condition, detail=""):
    tag = PASS if condition else FAIL
    msg = f"  {tag}  {label}"
    if detail:
        msg += f"\n         {detail}"
    print(msg)
    if not condition:
        failures.append(label)
    return condition

print("=" * 65)
print("  SD1.3 Pre-Training Checks")
print("=" * 65)

# 1. Load config
with open(CONFIG_PATH) as f:
    cfg = json.load(f)

# 2. CUDA
check("CUDA available", torch.cuda.is_available())
if torch.cuda.is_available():
    gpu_name = torch.cuda.get_device_name(0)
    vram_gb  = torch.cuda.get_device_properties(0).total_memory / 1e9
    print(f"         GPU  : {gpu_name}")
    print(f"         VRAM : {vram_gb:.1f} GB")
else:
    failures.append("CUDA required")
    print("FATAL: CUDA not available. Stopping.")
    sys.exit(1)

# 3. Pretrained DnCNN path
dncnn_path = ROOT / cfg["pretrained_dncnn"]
check("pretrained DnCNN exists", dncnn_path.exists(), str(dncnn_path))

# 4. Dataset paths
real_dir  = ROOT / cfg["real_dir"]
fake_dir  = ROOT / cfg["fake_dir"]
split_file = ROOT / cfg["split_file"]
check("real_dir exists",  real_dir.exists(),  str(real_dir))
check("fake_dir exists",  fake_dir.exists(),  str(fake_dir))
check("split_file exists", split_file.exists(), str(split_file))

# 5. Split counts
with open(split_file) as f:
    splits = json.load(f)

for split_name in ["train", "val", "test"]:
    n_real = len(splits[split_name]["real"])
    n_fake = len(splits[split_name]["fake"])
    balanced = (n_real == n_fake)
    check(
        f"split '{split_name}' class balance",
        balanced,
        f"real={n_real}  fake={n_fake}  balanced={balanced}"
    )

# 6. Load pretrained DnCNN strictly
device = torch.device("cuda")
dncnn = DnCNN().to(device)
try:
    state = torch.load(dncnn_path, map_location=device)
    missing, unexpected = dncnn.load_state_dict(state, strict=True)
    check(
        "DnCNN strict load",
        not missing and not unexpected,
        f"missing={missing}  unexpected={unexpected}"
    )
except Exception as e:
    check("DnCNN strict load", False, str(e))

# 7. Build train dataset, check one batch
train_ds = MaskSimDataset(split_file=str(split_file), split="train")
loader   = DataLoader(train_ds, batch_size=4, shuffle=False, num_workers=0)
imgs, labels = next(iter(loader))

check("batch shape [B,3,512,512]", tuple(imgs.shape) == (4, 3, 512, 512),
      str(tuple(imgs.shape)))
check("dtype float32",  imgs.dtype == torch.float32, str(imgs.dtype))
check("range [0,1]",    imgs.min() >= 0.0 and imgs.max() <= 1.0,
      f"min={imgs.min():.4f}  max={imgs.max():.4f}")
check("labels only 0/1",
      set(labels.numpy().tolist()).issubset({0.0, 1.0}),
      str(set(labels.numpy().tolist())))
check("no NaN in batch",  not torch.isnan(imgs).any())
check("no Inf in batch",  not torch.isinf(imgs).any())

# 8. Lightweight forward smoke test
masksim = MaskSim().to(device)
dncnn.eval(); masksim.eval()
imgs_gpu = imgs.to(device)
with torch.no_grad():
    ycbcr    = rgb_to_ycbcr(imgs_gpu)
    residual = dncnn.residual(ycbcr)
    spectrum = log_mag_spectrum(residual)
    probs    = masksim(spectrum)

check("forward smoke: no NaN",   not torch.isnan(probs).any())
check("forward smoke: no Inf",   not torch.isinf(probs).any())
check("forward smoke: prob [0,1]",
      probs.min() >= 0.0 and probs.max() <= 1.0,
      f"min={probs.min():.4f}  max={probs.max():.4f}")

peak_mb = torch.cuda.max_memory_allocated(device) / 1e6
print(f"\n  Peak VRAM so far : {peak_mb:.0f} MB  ({peak_mb/1024:.2f} GB)")
torch.cuda.reset_peak_memory_stats(device)

print()
print("=" * 65)
if failures:
    print(f"  {len(failures)} check(s) FAILED:")
    for f_ in failures:
        print(f"    - {f_}")
    print("=" * 65)
    sys.exit(1)
else:
    print("  All pre-train checks PASSED. Safe to start training.")
    print("=" * 65)
    sys.exit(0)
