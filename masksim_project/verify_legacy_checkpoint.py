"""
verify_legacy_checkpoint.py -- Loads masksim_sd14_best.pt into the migrated models.py
and confirms weights are shape-compatible.

Usage:
    python verify_legacy_checkpoint.py
"""
import sys
import torch
from pathlib import Path

# Make training package importable
sys.path.insert(0, str(Path(__file__).resolve().parent))
from training.models import DnCNN, MaskSim
from training.transforms import rgb_to_ycbcr, log_mag_spectrum

CKPT = Path(__file__).resolve().parent / "checkpoints" / "masksim_sd14_best.pt"


def verify():
    print(f"Loading: {CKPT}")
    ckpt = torch.load(CKPT, map_location="cpu")

    print(f"\n  Keys     : {list(ckpt.keys())}")
    print(f"  Epoch    : {ckpt.get('epoch')}")
    print(f"  Val AUC  : {ckpt.get('val_auc')}")
    print(f"  Val Loss : {ckpt.get('val_loss')}")
    print(f"  Batch    : physical={ckpt.get('physical_batch_size')}  "
          f"accum={ckpt.get('accumulation_steps')}  "
          f"effective={ckpt.get('effective_batch_size')}")

    # --- DnCNN ---
    dncnn = DnCNN()
    missing, unexpected = dncnn.load_state_dict(ckpt["dncnn_state_dict"], strict=True)
    assert not missing and not unexpected, (
        f"DnCNN mismatch: missing={missing} unexpected={unexpected}"
    )
    print("\n  [OK] DnCNN weights loaded cleanly")

    # --- MaskSim ---
    # Infer spatial dims from the mask_raw parameter
    mask_shape = ckpt["masksim_state_dict"]["mask_raw"].shape   # (C, H, W)
    h, w = mask_shape[1], mask_shape[2]
    masksim = MaskSim(h=h, w=w)
    missing, unexpected = masksim.load_state_dict(ckpt["masksim_state_dict"], strict=True)
    assert not missing and not unexpected, (
        f"MaskSim mismatch: missing={missing} unexpected={unexpected}"
    )
    print(f"  [OK] MaskSim weights loaded cleanly  (spatial={h}x{w})")

    # --- Numerical sanity check ---
    print("\n  Running sanity forward pass ...")
    dncnn.eval()
    masksim.eval()
    dummy = torch.rand(1, 3, h, w)
    with torch.no_grad():
        ycbcr   = rgb_to_ycbcr(dummy)
        res     = dncnn.residual(ycbcr)
        spec    = log_mag_spectrum(res)
        prob    = masksim(spec)

    assert not torch.isnan(prob).any(), "NaN in output!"
    assert not torch.isinf(prob).any(), "Inf in output!"
    assert 0.0 <= prob.item() <= 1.0,   f"Probability out of range: {prob.item()}"
    print(f"  [OK] Forward pass OK  -->  probability = {prob.item():.4f}")
    print("\n  Legacy checkpoint fully verified. [PASS]")


if __name__ == "__main__":
    verify()
