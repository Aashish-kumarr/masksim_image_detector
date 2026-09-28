import argparse
import json
import torch
import torch.nn.functional as F
from pathlib import Path
from torch.utils.data import DataLoader
from tqdm import tqdm

from training.dataset import MaskSimDataset
from training.models import DnCNN, MaskSim
from training.transforms import rgb_to_ycbcr, log_mag_spectrum
from training.metrics import compute_metrics
from training.checkpointing import load_checkpoint

def evaluate(config_path, checkpoint_path, split="test"):
    with open(config_path, "r") as f:
        config = json.load(f)
        
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    dataset = MaskSimDataset(
        split_file=config["split_file"],
        split=split,
        jpeg_min=config.get("jpeg_quality_min", 65),
        jpeg_max=config.get("jpeg_quality_max", 100)
    )
    
    loader = DataLoader(
        dataset, 
        batch_size=config.get("batch_size", 4), 
        shuffle=False, 
        num_workers=config.get("num_workers", 0)
    )
    
    dncnn = DnCNN().to(device)
    masksim = MaskSim().to(device)
    
    print(f"Loading checkpoint {checkpoint_path}")
    ckpt = load_checkpoint(checkpoint_path, dncnn, masksim, device=device)
    
    dncnn.eval()
    masksim.eval()
    
    all_labels = []
    all_probs = []
    total_loss = 0.0
    
    print(f"Evaluating {split} split...")
    with torch.inference_mode():
        for imgs, labels in tqdm(loader):
            imgs = imgs.to(device)
            labels = labels.to(device)
            
            ycbcr = rgb_to_ycbcr(imgs)
            residual = dncnn.residual(ycbcr)
            spectrum = log_mag_spectrum(residual)
            
            # NO training-only abs-cosine trick for eval
            probs = masksim(spectrum)
            
            loss = F.binary_cross_entropy(probs, labels)
            total_loss += loss.item() * imgs.size(0)
            
            all_labels.extend(labels.cpu().numpy().tolist())
            all_probs.extend(probs.cpu().numpy().tolist())
            
    avg_loss = total_loss / len(dataset)
    metrics = compute_metrics(all_labels, all_probs, threshold=config.get("threshold", 0.5))
    metrics["loss"] = avg_loss
    
    out_dir = Path("outputs") / config["generator_id"]
    out_dir.mkdir(parents=True, exist_ok=True)
    
    out_metrics = out_dir / f"{split}_metrics.json"
    with open(out_metrics, "w") as f:
        json.dump(metrics, f, indent=4)
        
    out_preds = out_dir / f"{split}_predictions.json"
    with open(out_preds, "w") as f:
        json.dump({"labels": all_labels, "probabilities": all_probs}, f)
        
    print(f"Metrics saved to {out_metrics}")
    print(json.dumps(metrics, indent=2))
    
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True, help="Path to config json")
    parser.add_argument("--checkpoint", required=True, help="Path to best.pt")
    parser.add_argument("--split", default="test", help="Split to evaluate")
    args = parser.parse_args()
    
    evaluate(args.config, args.checkpoint, args.split)
