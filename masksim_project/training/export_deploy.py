import argparse
import torch
from pathlib import Path
from training.checkpointing import load_checkpoint
from training.models import DnCNN, MaskSim
import json

def export_deploy(best_ckpt_path, deploy_ckpt_path):
    print(f"Loading best checkpoint from {best_ckpt_path}")
    
    dncnn = DnCNN()
    masksim = MaskSim()
    ckpt = load_checkpoint(best_ckpt_path, dncnn, masksim, device="cpu")
    
    config = ckpt.get("config", {})
    
    deploy_state = {
        "dncnn_state_dict": dncnn.state_dict(),
        "masksim_state_dict": masksim.state_dict(),
        "metadata": {
            "generator": ckpt.get("generator", "unknown"),
            "version": f"masksim-{ckpt.get('generator', 'unknown')}-v1",
            "input_size": config.get("input_size", 512),
            "threshold": config.get("threshold", 0.5),
            "test_metrics": ckpt.get("test_metrics", {})
        }
    }
    
    Path(deploy_ckpt_path).parent.mkdir(parents=True, exist_ok=True)
    torch.save(deploy_state, deploy_ckpt_path)
    print(f"Deployment checkpoint saved to {deploy_ckpt_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--best_ckpt", required=True, help="Path to best.pt")
    parser.add_argument("--deploy_ckpt", required=True, help="Path to save deploy.pt")
    args = parser.parse_args()
    
    export_deploy(args.best_ckpt, args.deploy_ckpt)
