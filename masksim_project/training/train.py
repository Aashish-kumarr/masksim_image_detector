import argparse
import json
import time
import csv
import torch
import torch.nn.functional as F
from pathlib import Path
from tqdm import tqdm
from torch.utils.data import DataLoader
from torch.optim.lr_scheduler import ExponentialLR

from training.dataset import MaskSimDataset
from training.models import DnCNN, MaskSim
from training.transforms import rgb_to_ycbcr, log_mag_spectrum
from training.losses import masksim_training_loss
from training.metrics import compute_metrics
from training.checkpointing import load_checkpoint, save_checkpoint


def train(config_path, resume_path=None, smoke_test=False):
    with open(config_path, "r") as f:
        config = json.load(f)

    torch.manual_seed(config.get("seed", 42))
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    if device.type == "cuda":
        print(f"  GPU: {torch.cuda.get_device_name(0)}")
        print(f"  VRAM: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")

    # ---- Datasets ----
    train_dataset = MaskSimDataset(
        split_file=config["split_file"], split="train",
        jpeg_min=config.get("jpeg_quality_min", 65),
        jpeg_max=config.get("jpeg_quality_max", 100),
    )
    val_dataset = MaskSimDataset(
        split_file=config["split_file"], split="val",
        jpeg_min=config.get("jpeg_quality_min", 65),
        jpeg_max=config.get("jpeg_quality_max", 100),
    )

    train_loader = DataLoader(
        train_dataset, batch_size=config.get("batch_size", 4),
        shuffle=True, num_workers=config.get("num_workers", 0),
        pin_memory=(device.type == "cuda"),
    )
    val_loader = DataLoader(
        val_dataset, batch_size=config.get("batch_size", 4),
        shuffle=False, num_workers=config.get("num_workers", 0),
        pin_memory=(device.type == "cuda"),
    )

    # ---- Models ----
    dncnn = DnCNN().to(device)
    masksim = MaskSim().to(device)

    # ---- Optimizer ----
    optimizer = torch.optim.Adam([
        {"params": dncnn.parameters(),   "lr": config.get("dncnn_lr", 1e-4)},
        {"params": masksim.parameters(), "lr": config.get("masksim_lr", 1e-3)},
    ])
    scheduler = ExponentialLR(optimizer, gamma=config.get("scheduler_gamma", 0.99))

    # ---- State ----
    start_epoch = 1
    best_val_loss = float("inf")
    best_epoch = 0
    histories = {
        "train_loss_history": [],
        "val_loss_history": [],
        "val_auc_history": [],
        "best_val_loss": float("inf"),
        "best_epoch": 0,
    }

    if resume_path:
        print(f"Resuming from {resume_path}")
        ckpt = load_checkpoint(resume_path, dncnn, masksim, optimizer, scheduler, device=device)
        start_epoch  = ckpt.get("epoch", 0) + 1
        best_val_loss = ckpt.get("best_val_loss", float("inf"))
        best_epoch    = ckpt.get("best_epoch", 0)
        histories["train_loss_history"] = ckpt.get("train_history", [])
        histories["val_loss_history"]   = ckpt.get("val_loss_history", [])
        histories["val_auc_history"]    = ckpt.get("val_auc_history", [])
        histories["best_val_loss"]      = best_val_loss
        histories["best_epoch"]         = best_epoch
    elif config.get("pretrained_dncnn"):
        print(f"Loading pretrained DnCNN from {config['pretrained_dncnn']}")
        dncnn.load_state_dict(torch.load(config["pretrained_dncnn"], map_location=device))

    epochs             = config.get("epochs", 10)
    accumulation_steps = config.get("accumulation_steps", 2)
    generator_id       = config.get("generator_id", "unknown")

    # ---- Dirs ----
    log_dir  = Path("logs")  / generator_id
    ckpt_dir = Path("checkpoints") / generator_id
    log_dir.mkdir(parents=True, exist_ok=True)
    ckpt_dir.mkdir(parents=True, exist_ok=True)

    history_json = log_dir / "history.json"
    history_csv  = log_dir / "history.csv"
    if not history_csv.exists():
        with open(history_csv, "w", newline="") as f:
            csv.writer(f).writerow([
                "epoch", "train_loss", "val_loss", "val_auc", "val_accuracy",
                "precision", "recall", "f1",
                "dncnn_lr", "masksim_lr", "duration_s", "peak_vram_gb",
            ])

    # ---- Training loop ----
    for epoch in range(start_epoch, epochs + 1):
        print(f"\n{'='*60}")
        print(f"  Epoch {epoch}/{epochs}  |  generator: {generator_id}")
        
        # --- Multi-model session info injection ---
        session_info = config.get("_session_info", {})
        if session_info:
            model_idx = session_info.get("model_idx", 1)
            total_models = session_info.get("total_models", 1)
            session_start = session_info.get("session_start", time.time())
            avg_epoch_sec = session_info.get("avg_epoch_sec", 0)
            
            elapsed = time.time() - session_start
            print(f"  Model {model_idx} / {total_models}")
            print(f"  Overall session elapsed: {elapsed / 60:.1f} min")
            
            if avg_epoch_sec > 0:
                # Remaining in this model + remaining full models
                rem_epochs_this = (epochs - epoch + 1)
                rem_models = total_models - model_idx
                rem_total_epochs = rem_epochs_this + (rem_models * epochs)
                eta_sec = rem_total_epochs * avg_epoch_sec
                print(f"  Estimated remaining time for all models: {eta_sec / 3600:.1f} hours")
            else:
                print("  Overall ETA: estimating...")
        print(f"{'='*60}")
        start_time = time.time()

        dncnn.train()
        masksim.train()
        optimizer.zero_grad()

        total_train_loss = 0.0
        pbar = tqdm(train_loader, desc=f"Train E{epoch}", ncols=90)
        for i, (imgs, labels) in enumerate(pbar):
            imgs   = imgs.to(device)
            labels = labels.to(device)

            ycbcr    = rgb_to_ycbcr(imgs)
            residual = dncnn.residual(ycbcr)
            spectrum = log_mag_spectrum(residual)

            loss = masksim_training_loss(masksim, spectrum, labels) / accumulation_steps
            loss.backward()

            if (i + 1) % accumulation_steps == 0 or (i + 1) == len(train_loader):
                optimizer.step()
                optimizer.zero_grad()

            total_train_loss += loss.item() * accumulation_steps * imgs.size(0)
            pbar.set_postfix({"loss": f"{loss.item() * accumulation_steps:.4f}"})

            if smoke_test:
                # Flush any remaining gradients so scheduler warning doesn't fire
                optimizer.step()
                optimizer.zero_grad()
                break

        # ← scheduler.step() AFTER optimizer.step() to avoid PyTorch warning
        scheduler.step()

        n_train = imgs.size(0) if smoke_test else len(train_dataset)
        avg_train_loss = total_train_loss / n_train

        # ---- Validation ----
        dncnn.eval()
        masksim.eval()

        all_labels  = []
        all_probs   = []
        total_val_loss = 0.0

        with torch.inference_mode():
            for imgs, labels in tqdm(val_loader, desc=f"Val   E{epoch}", ncols=90):
                imgs   = imgs.to(device)
                labels = labels.to(device)

                ycbcr    = rgb_to_ycbcr(imgs)
                residual = dncnn.residual(ycbcr)
                spectrum = log_mag_spectrum(residual)

                # Standard cosine (no abs trick) for validation
                probs  = masksim(spectrum)
                v_loss = F.binary_cross_entropy(probs, labels)

                total_val_loss += v_loss.item() * imgs.size(0)
                all_labels.extend(labels.cpu().numpy().tolist())
                all_probs.extend(probs.cpu().numpy().tolist())

                if smoke_test:
                    break

        n_val = imgs.size(0) if smoke_test else len(val_dataset)
        avg_val_loss = total_val_loss / n_val
        metrics = compute_metrics(all_labels, all_probs, threshold=config.get("threshold", 0.5))
        metrics["train_loss"] = avg_train_loss
        metrics["val_loss"]   = avg_val_loss

        # ---- History ----
        histories["train_loss_history"].append(avg_train_loss)
        histories["val_loss_history"].append(avg_val_loss)
        histories["val_auc_history"].append(metrics["auc"])

        duration  = time.time() - start_time
        peak_vram = torch.cuda.max_memory_allocated(device) / 1e9 if device.type == "cuda" else 0.0
        dncnn_lr   = optimizer.param_groups[0]["lr"]
        masksim_lr = optimizer.param_groups[1]["lr"]

        print(f"\n  Train Loss : {avg_train_loss:.4f}")
        print(f"  Val   Loss : {avg_val_loss:.4f}  |  Val AUC : {metrics['auc']:.4f}")
        print(f"  Accuracy   : {metrics['accuracy']:.4f}  |  Prec : {metrics['precision']:.4f}  |  Rec : {metrics['recall']:.4f}  |  F1 : {metrics['f1']:.4f}")
        print(f"  LR DnCNN   : {dncnn_lr:.2e}  |  LR MaskSim : {masksim_lr:.2e}")
        print(f"  Time       : {duration:.1f}s  |  Peak VRAM : {peak_vram:.2f} GB")

        with open(history_csv, "a", newline="") as f:
            csv.writer(f).writerow([
                epoch, avg_train_loss, avg_val_loss, metrics["auc"], metrics["accuracy"],
                metrics["precision"], metrics["recall"], metrics["f1"],
                dncnn_lr, masksim_lr, round(duration, 1), round(peak_vram, 3),
            ])
        with open(history_json, "w") as f:
            json.dump(histories, f, indent=4)

        # ---- Checkpoint ----
        is_best = avg_val_loss < best_val_loss
        if is_best:
            best_val_loss = avg_val_loss
            best_epoch    = epoch
            histories["best_val_loss"] = best_val_loss
            histories["best_epoch"]    = best_epoch

        save_checkpoint(
            ckpt_dir / "latest.pt",
            epoch, generator_id, dncnn, masksim, optimizer, scheduler,
            metrics, histories, config, is_best=is_best,
        )

        if is_best:
            print(f"  [BEST] New best -- saved best.pt  (val_loss {best_val_loss:.4f})")

        if smoke_test:
            print("\nSmoke test complete -- 1 batch forward+backward OK, no NaN/OOM.")
            break

    print(f"\nTraining finished.  Best epoch: {best_epoch}  |  Best val loss: {best_val_loss:.4f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train MaskSim generator detector")
    parser.add_argument("--config",     required=True, help="Path to JSON config")
    parser.add_argument("--resume",     default=None,  help="Path to latest.pt or best.pt")
    parser.add_argument("--smoke_test", action="store_true", help="Run 1-batch smoke test")
    args = parser.parse_args()

    train(args.config, args.resume, args.smoke_test)
