import os
import json
import random
import io
import torch
import numpy as np
from PIL import Image
from torch.utils.data import Dataset

class MaskSimDataset(Dataset):
    def __init__(self, split_file, split="train", jpeg_min=65, jpeg_max=100):
        with open(split_file, "r") as f:
            splits = json.load(f)

        self.train = (split == "train")
        self.jpeg_min = jpeg_min
        self.jpeg_max = jpeg_max
        self.items = []

        for path in splits[split]["real"]:
            self.items.append((path, 0.0))

        for path in splits[split]["fake"]:
            self.items.append((path, 1.0))

        if self.train:
            random.shuffle(self.items)

    def __len__(self):
        return len(self.items)

    def __getitem__(self, idx):
        path, label = self.items[idx]
        img = Image.open(path).convert("RGB")

        w, h = img.size
        if w > 512 or h > 512:
            if self.train:
                left = random.randint(0, w - 512)
                top  = random.randint(0, h - 512)
            else:
                left = (w - 512) // 2
                top  = (h - 512) // 2
            img = img.crop((left, top, left + 512, top + 512))

        if self.train:
            quality = random.randint(self.jpeg_min, self.jpeg_max)
            buffer = io.BytesIO()
            img.save(buffer, format="JPEG", quality=quality)
            buffer.seek(0)
            img = Image.open(buffer).convert("RGB")

        img_np = np.asarray(img, dtype=np.float32) / 255.0
        img_tensor = torch.from_numpy(img_np).permute(2, 0, 1)
        label_tensor = torch.tensor(label, dtype=torch.float32)

        return img_tensor, label_tensor
