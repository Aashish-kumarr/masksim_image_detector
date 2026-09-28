import torch
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
path = BASE_DIR / "models" / "masksim_sd14_best.pt"

checkpoint = torch.load(
    path,
    map_location="cpu",
    weights_only=False
)

print("TYPE:")
print(type(checkpoint))

if isinstance(checkpoint, dict):
    print("\nTOP LEVEL KEYS:")
    for key in checkpoint.keys():
        print("-", key)

    for key, value in checkpoint.items():
        print(
            key,
            type(value),
            getattr(value, "shape", "")
        )
else:
    print(checkpoint)