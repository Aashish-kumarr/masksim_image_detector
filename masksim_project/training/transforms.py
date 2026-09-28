import torch

def rgb_to_ycbcr(x):
    r = x[:, 0:1]
    g = x[:, 1:2]
    b = x[:, 2:3]

    y = (0.299 * r + 0.587 * g + 0.114 * b)
    cb = (-0.168736 * r - 0.331264 * g + 0.5 * b + 0.5)
    cr = (0.5 * r - 0.418688 * g - 0.081312 * b + 0.5)

    return torch.cat([y, cb, cr], dim=1)

def log_mag_spectrum(residual):
    F = torch.fft.fft2(residual, norm="ortho")
    F = torch.fft.fftshift(F, dim=(-2, -1))
    return torch.log(F.abs() + 1e-8)
