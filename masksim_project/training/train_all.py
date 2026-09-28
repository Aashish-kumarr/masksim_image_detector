import os
import sys
import json
import time
import argparse
import subprocess
import torch
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG_DIR = ROOT / "training" / "configs"
LOG_DIR = ROOT / "logs"

DEFAULT_QUEUE = [
    "sd13", "sd2", "sdxl", "dalle2", 
    "dalle3", "midjourney_v5", "firefly", "glide"
]

STATUS_JSON_PATH = LOG_DIR / "training_all_status.json"
STATUS_MD_PATH = LOG_DIR / "TRAINING_ALL_STATUS.md"

def format_metric(value, decimals=4):
    if value is None:
        return "N/A"
    try:
        return f"{float(value):.{decimals}f}"
    except (TypeError, ValueError):
        return "N/A"

def load_status():
    if STATUS_JSON_PATH.exists():
        try:
            with open(STATUS_JSON_PATH, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return {}

def save_status(status_dict):
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    with open(STATUS_JSON_PATH, "w") as f:
        json.dump(status_dict, f, indent=4)
        
    md = [
        "| Generator | Training | Epoch | Best Epoch | Val AUC | Test | Status |",
        "|-----------|----------|-------|------------|---------|------|--------|"
    ]
    for gen_id, s in status_dict.items():
        ep = f"{s.get('last_completed_epoch', 0)}/{s.get('total_epochs', 10)}"
        best_ep = s.get("best_epoch", "-")
        val_auc = format_metric(s.get('best_val_auc'))
        test = "evaluated" if s.get("test_evaluated") else "pending"
        status = s.get("status", "WAITING")
        md.append(f"| {gen_id} | {ep} | {best_ep} | {val_auc} | {test} | {status} |")
        
    with open(STATUS_MD_PATH, "w") as f:
        f.write("\n".join(md) + "\n")

def get_checkpoint_summary(cfg, gen_id):
    latest_pt = ROOT / cfg["checkpoint_dir"] / "latest.pt"
    best_pt = ROOT / cfg["checkpoint_dir"] / "best.pt"
    history_csv = LOG_DIR / gen_id / "history.csv"
    
    if not latest_pt.exists():
        return None
        
    try:
        ckpt_latest = torch.load(latest_pt, map_location="cpu")
    except Exception:
        return "CORRUPT"
        
    # Start with latest.pt basics
    epoch = ckpt_latest.get("epoch", 0)
    best_epoch = ckpt_latest.get("best_epoch")
    best_val_loss = ckpt_latest.get("best_val_loss")
    val_auc = ckpt_latest.get("val_auc")
    
    # Preferred order for val_auc (and others if missing):
    # 1. best.pt
    if best_pt.exists():
        try:
            ckpt_best = torch.load(best_pt, map_location="cpu")
            if best_epoch is None: best_epoch = ckpt_best.get("epoch")
            if best_val_loss is None: best_val_loss = ckpt_best.get("best_val_loss")
            if ckpt_best.get("val_auc") is not None:
                val_auc = ckpt_best.get("val_auc")
            elif ckpt_best.get("best_val_auc") is not None:
                val_auc = ckpt_best.get("best_val_auc")
        except Exception:
            pass

    # 3. history.csv (if best_epoch is known and val_auc is still None)
    if val_auc is None and best_epoch is not None and history_csv.exists():
        try:
            with open(history_csv, "r") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if str(row.get("epoch", "")) == str(best_epoch):
                        auc_str = row.get("val_auc") or row.get("val_AUC")
                        if auc_str:
                            try:
                                val_auc = float(auc_str)
                            except ValueError:
                                pass
                        break
        except Exception:
            pass
            
    # 4. status JSON
    if val_auc is None:
        try:
            status = load_status()
            if gen_id in status and status[gen_id].get("best_val_auc") is not None:
                val_auc = status[gen_id].get("best_val_auc")
        except Exception:
            pass

    return {
        "epoch": epoch,
        "best_epoch": best_epoch,
        "best_val_loss": best_val_loss,
        "best_val_auc": val_auc
    }

def estimate_avg_epoch_time():
    total_time = 0.0
    total_epochs = 0
    for gen in DEFAULT_QUEUE:
        cfg_path = CONFIG_DIR / f"{gen}.json"
        if not cfg_path.exists(): continue
        try:
            with open(cfg_path) as f:
                cfg = json.load(f)
            csv_file = LOG_DIR / cfg["generator_id"] / "history.csv"
            if csv_file.exists():
                with open(csv_file, "r") as f:
                    lines = f.readlines()[1:] 
                    for line in lines:
                        parts = line.strip().split(",")
                        if len(parts) >= 11:
                            try:
                                dur = float(parts[10]) 
                                total_time += dur
                                total_epochs += 1
                            except ValueError:
                                pass
        except Exception:
            pass
    if total_epochs > 0:
        return total_time / total_epochs
    return 0.0

def print_model_complete(gen_id, best_epoch, val_loss, val_auc, test_metrics, train_time, ckpt_path):
    print("\n" + "="*60)
    print("MODEL COMPLETE")
    print("="*60)
    print(f"Generator:\n{gen_id}\n")
    
    print(f"Best epoch:\n{best_epoch if best_epoch is not None else 'N/A'}\n")
    print(f"Best validation loss:\n{format_metric(val_loss)}\n")
    print(f"Best validation AUC:\n{format_metric(val_auc)}\n")
    
    if not test_metrics:
        print("Test evaluation:\nPENDING\n")
    else:
        print(f"Test loss:\n{format_metric(test_metrics.get('loss', test_metrics.get('test_loss')))}\n")
        print(f"Test AUC:\n{format_metric(test_metrics.get('auc', test_metrics.get('test_auc')))}\n")
        print(f"Accuracy:\n{format_metric(test_metrics.get('accuracy'))}\n")
        print(f"Precision:\n{format_metric(test_metrics.get('precision'))}\n")
        print(f"Recall:\n{format_metric(test_metrics.get('recall'))}\n")
        print(f"F1:\n{format_metric(test_metrics.get('f1'))}\n")
        
        cm = test_metrics.get("confusion_matrix", "N/A")
        print(f"Confusion matrix:\n{cm}\n")
    
    print(f"Training time:\n{format_metric(train_time, decimals=1)}s\n")
    print(f"Best checkpoint:\n{ckpt_path}\n")
    print(f"Test metrics:\noutputs/{gen_id}/test_metrics.json")
    print("="*60 + "\n")

def run_train_all(args):
    print("Initializing train_all orchestration...")
    queue = args.models if args.models else DEFAULT_QUEUE
    
    if args.start_from:
        if args.start_from in queue:
            queue = queue[queue.index(args.start_from):]
        else:
            print(f"Error: {args.start_from} not found in queue.")
            sys.exit(1)
            
    # Check configs
    configs = {}
    for gen in queue:
        path = CONFIG_DIR / f"{gen}.json"
        if not path.exists():
            print(f"FATAL: Config not found: {path}")
            sys.exit(1)
        with open(path) as f:
            configs[gen] = json.load(f)
            
    status = load_status()
    session_start = time.time()
    
    if args.status:
        print("\nQueue Status:")
        for gen in queue:
            c = configs[gen]
            gen_id = c["generator_id"]
            state = get_checkpoint_summary(c, gen_id)
            if state == "CORRUPT":
                print(f"{gen:<15} CORRUPT")
            elif state:
                ep = state["epoch"]
                tot = c.get("epochs", 10)
                if ep >= tot:
                    print(f"{gen:<15} COMPLETE ({ep}/{tot})")
                else:
                    print(f"{gen:<15} PARTIAL ({ep}/{tot})")
            else:
                print(f"{gen:<15} READY")
        sys.exit(0)
        
    for idx, gen in enumerate(queue):
        cfg = configs[gen]
        gen_id = cfg["generator_id"]
        latest_pt = ROOT / cfg["checkpoint_dir"] / "latest.pt"
        best_pt = ROOT / cfg["checkpoint_dir"] / "best.pt"
        test_json = ROOT / cfg["output_dir"] / "test_metrics.json"
        max_epochs = cfg.get("epochs", 10)
        
        state = get_checkpoint_summary(cfg, gen_id)
        if state == "CORRUPT":
            print(f"\nTRAINING QUEUE STOPPED\nFailed generator: {gen_id}\nReason: latest.pt is corrupt.\nResume command after correction:\npython -m training.train_all")
            sys.exit(1)
            
        cur_epoch = state["epoch"] if state else 0
        
        if gen_id not in status:
            status[gen_id] = {"status": "pending", "total_epochs": max_epochs, "test_evaluated": False}
        
        # 1. Train
        if cur_epoch < max_epochs:
            status[gen_id]["status"] = "training" if cur_epoch == 0 else "resuming"
            status[gen_id]["last_completed_epoch"] = cur_epoch
            save_status(status)
            
            # Inject session info
            avg_sec = estimate_avg_epoch_time()
            cfg["_session_info"] = {
                "model_idx": idx + 1,
                "total_models": len(queue),
                "session_start": session_start,
                "avg_epoch_sec": avg_sec
            }
            temp_config_path = CONFIG_DIR / f"_temp_{gen}.json"
            with open(temp_config_path, "w") as f:
                json.dump(cfg, f)
                
            cmd = [sys.executable, "-m", "training.train", "--config", str(temp_config_path)]
            if cur_epoch > 0:
                cmd.extend(["--resume", str(latest_pt)])
                
            print(f"\nStarting training for {gen_id}...")
            try:
                res = subprocess.run(cmd)
                temp_config_path.unlink(missing_ok=True)
                if res.returncode != 0:
                    status[gen_id]["status"] = "failed"
                    save_status(status)
                    print(f"\nTRAINING QUEUE STOPPED\nFailed generator: {gen_id}\nReason: Subprocess returned {res.returncode}.\nResume command after correction:\npython -m training.train_all")
                    sys.exit(1)
            except KeyboardInterrupt:
                temp_config_path.unlink(missing_ok=True)
                print(f"\nTRAINING INTERRUPTED SAFELY\nCurrent generator: {gen_id}\nLast completed epoch: unknown (check latest.pt)\nResume all training with:\npython -m training.train_all")
                sys.exit(0)
            
            # Re-read state after training
            state = get_checkpoint_summary(cfg, gen_id)
            if not state or state["epoch"] < max_epochs:
                print(f"\nTRAINING QUEUE STOPPED\nFailed generator: {gen_id}\nReason: Training ended but target epoch not reached.\nResume command after correction:\npython -m training.train_all")
                sys.exit(1)
                
        # 2. Evaluate
        status[gen_id]["status"] = "complete"
        status[gen_id]["last_completed_epoch"] = max_epochs
        if state:
            status[gen_id]["best_epoch"] = state.get("best_epoch")
            status[gen_id]["best_val_loss"] = state.get("best_val_loss")
            status[gen_id]["best_val_auc"] = state.get("best_val_auc")
        save_status(status)
        
        if not test_json.exists() and not args.skip_evaluation:
            print(f"\nEvaluating {gen_id} on test split...")
            cmd = [sys.executable, "-m", "training.evaluate", "--config", str(CONFIG_DIR / f"{gen}.json"), "--checkpoint", str(best_pt), "--split", "test"]
            try:
                res = subprocess.run(cmd)
                if res.returncode != 0:
                    print(f"\nTRAINING QUEUE STOPPED\nFailed generator: {gen_id}\nReason: Evaluation failed.\nResume command after correction:\npython -m training.train_all")
                    sys.exit(1)
            except KeyboardInterrupt:
                print(f"\nTRAINING INTERRUPTED SAFELY\nCurrent generator: {gen_id} (Evaluation phase)\nResume all training with:\npython -m training.train_all")
                sys.exit(0)
                
        status[gen_id]["test_evaluated"] = test_json.exists()
        save_status(status)
        
        # 3. Summary
        test_data = {}
        if test_json.exists():
            try:
                with open(test_json) as f:
                    test_data = json.load(f)
            except:
                pass
                
        print_model_complete(
            gen_id=gen_id, 
            best_epoch=status[gen_id].get("best_epoch"),
            val_loss=status[gen_id].get("best_val_loss"),
            val_auc=status[gen_id].get("best_val_auc"),
            test_metrics=test_data,
            train_time=None, 
            ckpt_path=best_pt
        )
        
        if idx < len(queue) - 1:
            print(f"NEXT MODEL:\n{configs[queue[idx+1]]['generator_id']}\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Orchestrate training across multiple generators.")
    parser.add_argument("--status", action="store_true", help="Show status only")
    parser.add_argument("--models", nargs="+", help="Train only specified models")
    parser.add_argument("--start-from", type=str, help="Start queue from this model onward")
    parser.add_argument("--skip-evaluation", action="store_true", help="Skip test evaluation")
    args = parser.parse_args()
    
    run_train_all(args)
