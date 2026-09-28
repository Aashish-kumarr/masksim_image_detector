import torch
from pathlib import Path

def save_checkpoint(path, epoch, generator, dncnn, masksim, optimizer, scheduler, metrics, histories, config, is_best=False):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    
    state = {
        "epoch": epoch,
        "generator": generator,
        "dncnn_state_dict": dncnn.state_dict(),
        "masksim_state_dict": masksim.state_dict(),
        "optimizer_state_dict": optimizer.state_dict(),
        "scheduler_state_dict": scheduler.state_dict(),
        
        "train_loss": metrics.get("train_loss"),
        "val_loss": metrics.get("val_loss"),
        "val_auc": metrics.get("val_auc"),
        "val_accuracy": metrics.get("val_accuracy"),
        "val_precision": metrics.get("val_precision"),
        "val_recall": metrics.get("val_recall"),
        "val_f1": metrics.get("val_f1"),
        
        "train_history": histories.get("train_loss_history", []),
        "val_loss_history": histories.get("val_loss_history", []),
        "val_auc_history": histories.get("val_auc_history", []),
        
        "physical_batch_size": config.get("batch_size"),
        "accumulation_steps": config.get("accumulation_steps"),
        "effective_batch_size": config.get("batch_size") * config.get("accumulation_steps", 1),
        
        "learning_rates": {"dncnn": config.get("dncnn_lr"), "masksim": config.get("masksim_lr")},
        "seed": config.get("seed"),
        "config": config,
        "split_file": config.get("split_file"),
        
        "best_val_loss": histories.get("best_val_loss"),
        "best_epoch": histories.get("best_epoch")
    }
    
    torch.save(state, path)
    
    if is_best:
        best_path = Path(path).with_name("best.pt")
        torch.save(state, best_path)

def load_checkpoint(path, dncnn, masksim, optimizer=None, scheduler=None, device="cpu"):
    ckpt = torch.load(path, map_location=device)
    dncnn.load_state_dict(ckpt["dncnn_state_dict"])
    masksim.load_state_dict(ckpt["masksim_state_dict"])
    
    if optimizer and "optimizer_state_dict" in ckpt:
        optimizer.load_state_dict(ckpt["optimizer_state_dict"])
    if scheduler and "scheduler_state_dict" in ckpt:
        scheduler.load_state_dict(ckpt["scheduler_state_dict"])
        
    return ckpt
