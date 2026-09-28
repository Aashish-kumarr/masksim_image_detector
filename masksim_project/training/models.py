import torch
import torch.nn as nn

class DnCNN(nn.Module):
    def __init__(self):
        super().__init__()
        layers = []
        layers.append(nn.Conv2d(3, 64, kernel_size=3, padding=1, bias=True))
        layers.append(nn.ReLU(inplace=True))

        for _ in range(18):
            layers.append(nn.Conv2d(64, 64, kernel_size=3, padding=1, bias=True))
            layers.append(nn.ReLU(inplace=True))

        layers.append(nn.Conv2d(64, 3, kernel_size=3, padding=1, bias=True))
        self.model = nn.Sequential(*layers)

    def residual(self, x):
        return self.model(x)

    def forward(self, x):
        return x - self.model(x)

class MaskSim(nn.Module):
    def __init__(self, h=512, w=512, c=3):
        super().__init__()
        self.conv = nn.Conv2d(c, c, kernel_size=1)
        self.mask_raw = nn.Parameter(torch.zeros(c, h, w))
        self.ref = nn.Parameter(torch.randn(c, h, w) * 0.01)
        self.bn = nn.BatchNorm2d(c)
        self.a = nn.Parameter(torch.zeros(1))
        self.b = nn.Parameter(torch.zeros(1))

    def similarity(self, spec):
        mask = torch.sigmoid(self.mask_raw)
        fm = self.bn(self.conv(spec) * mask)
        
        ref_centered = self.ref - self.ref.mean(dim=(-2, -1), keepdim=True)
        ref_centered = ref_centered.unsqueeze(0)
        
        num = (fm * ref_centered).flatten(2).sum(-1)
        den = (fm.flatten(2).norm(dim=-1) * ref_centered.flatten(2).norm(dim=-1) + 1e-8)
        cosine = num / den
        
        return cosine.mean(dim=1)

    def forward(self, spec):
        sim = self.similarity(spec)
        return torch.sigmoid(torch.exp(self.a) * sim + self.b)
