import torch
import torch.nn as nn

def rgb_to_ycbcr(x):
    r = x[:, 0:1]
    g = x[:, 1:2]
    b = x[:, 2:3]

    y = 0.299*r + 0.587*g + 0.114*b

    cb = (
        -0.168736*r
        -0.331264*g
        +0.5*b
        +0.5
    )

    cr = (
        0.5*r
        -0.418688*g
        -0.081312*b
        +0.5
    )

    return torch.cat([y, cb, cr], dim=1)

class DnCNN(nn.Module):
    def __init__(self):
        super().__init__()

        layers = []

        layers += [
            nn.Conv2d(3, 64, 3, padding=1, bias=True),
            nn.ReLU(inplace=True)
        ]

        for _ in range(18):
            layers += [
                nn.Conv2d(64, 64, 3, padding=1, bias=True),
                nn.ReLU(inplace=True)
            ]

        layers += [
            nn.Conv2d(64, 3, 3, padding=1, bias=True)
        ]

        self.model = nn.Sequential(*layers)

    def residual(self, x):
        return self.model(x)

    def forward(self, x):
        return x - self.model(x)

def log_mag_spectrum(residual):
    F = torch.fft.fft2(residual, norm="ortho")
    F = torch.fft.fftshift(F, dim=(-2, -1))
    return torch.log(F.abs() + 1e-8)

class MaskSim(nn.Module):
    def __init__(self, h=512, w=512, c=3):
        super().__init__()

        self.conv = nn.Conv2d(c, c, 1)
        self.mask_raw = nn.Parameter(torch.zeros(c, h, w))
        self.ref = nn.Parameter(torch.randn(c, h, w) * 0.01)
        self.bn = nn.BatchNorm2d(c)
        self.a = nn.Parameter(torch.zeros(1))
        self.b = nn.Parameter(torch.zeros(1))

    def similarity(self, spec):
        mask = torch.sigmoid(self.mask_raw)
        fm = self.bn(self.conv(spec) * mask)
        ref = (self.ref - self.ref.mean(dim=(-2,-1), keepdim=True))
        ref = ref.unsqueeze(0)
        num = ((fm * ref).flatten(2).sum(-1))
        den = (fm.flatten(2).norm(dim=-1) * ref.flatten(2).norm(dim=-1) + 1e-8)
        cosine = num / den
        return cosine.mean(dim=1)

    def forward(self, spec):
        sim = self.similarity(spec)
        return torch.sigmoid(torch.exp(self.a) * sim + self.b)
