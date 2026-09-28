import torch
import numpy as np
from PIL import Image
import base64
import io

_cached_mask = None
_cached_ref = None

def tensor_to_base64(tensor, is_rgb=False, normalize=True):
    arr = tensor.astype(np.float32)
    if normalize:
        min_val = np.percentile(arr, 1)
        max_val = np.percentile(arr, 99)
        if max_val > min_val:
            arr = np.clip((arr - min_val) / (max_val - min_val), 0, 1)
        else:
            arr = np.zeros_like(arr)
            
    arr = (arr * 255).astype(np.uint8)
    
    if is_rgb and arr.shape[0] == 3:
        arr = np.transpose(arr, (1, 2, 0))
        img = Image.fromarray(arr, "RGB")
    else:
        if len(arr.shape) == 3:
            arr = arr.mean(axis=0).astype(np.uint8)
        img = Image.fromarray(arr, "L")
        
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{b64}"

def get_cached_model_artifacts(masksim):
    global _cached_mask, _cached_ref
    if _cached_mask is None or _cached_ref is None:
        with torch.no_grad():
            mask = torch.sigmoid(masksim.mask_raw).cpu().numpy()
            ref = (masksim.ref - masksim.ref.mean(dim=(-2,-1), keepdim=True)).cpu().numpy()
            _cached_mask = tensor_to_base64(mask, is_rgb=True)
            _cached_ref = tensor_to_base64(ref, is_rgb=True)
    return _cached_mask, _cached_ref

def generate_explainability_artifacts(crop_np, residual_cpu, spectrum_cpu, masksim):
    crop_b64 = tensor_to_base64(np.transpose(crop_np, (2, 0, 1)), is_rgb=True, normalize=False)
    residual_b64 = tensor_to_base64(residual_cpu.numpy(), is_rgb=True)
    
    spec_np = spectrum_cpu.numpy()
    spec_combined = tensor_to_base64(spec_np, is_rgb=True)
    spec_y = tensor_to_base64(spec_np[0], is_rgb=False)
    spec_cb = tensor_to_base64(spec_np[1], is_rgb=False)
    spec_cr = tensor_to_base64(spec_np[2], is_rgb=False)
    
    mask_b64, ref_b64 = get_cached_model_artifacts(masksim)
    
    with torch.no_grad():
        mask = torch.sigmoid(masksim.mask_raw).cpu()
        masked_spec = (spectrum_cpu * mask).numpy()
    
    masked_spec_b64 = tensor_to_base64(masked_spec, is_rgb=True)
    
    return {
        "cropImage": crop_b64,
        "residualImage": residual_b64,
        "spectrumCombined": spec_combined,
        "spectrumY": spec_y,
        "spectrumCb": spec_cb,
        "spectrumCr": spec_cr,
        "maskCombined": mask_b64,
        "maskedSpectrum": masked_spec_b64,
        "referenceSpectrum": ref_b64
    }

def generate_frequency_profile(spectrum_cpu):
    c, h, w = spectrum_cpu.shape
    y, x = np.indices((h, w))
    center = (h // 2, w // 2)
    
    r = np.sqrt((x - center[1])**2 + (y - center[0])**2)
    r = np.round(r).astype(int)
    
    spec_np = spectrum_cpu.numpy()
    combined_mag = spec_np.mean(axis=0)
    
    max_r = int(np.max(r))
    freq_bins = np.arange(max_r + 1)
    
    counts = np.bincount(r.ravel(), minlength=max_r+1)
    counts[counts == 0] = 1
    
    profile_combined = np.bincount(r.ravel(), weights=combined_mag.ravel(), minlength=max_r+1) / counts
    profile_y = np.bincount(r.ravel(), weights=spec_np[0].ravel(), minlength=max_r+1) / counts
    profile_cb = np.bincount(r.ravel(), weights=spec_np[1].ravel(), minlength=max_r+1) / counts
    profile_cr = np.bincount(r.ravel(), weights=spec_np[2].ravel(), minlength=max_r+1) / counts
    
    return {
        "frequency": freq_bins.tolist(),
        "combined": profile_combined.tolist(),
        "y": profile_y.tolist(),
        "cb": profile_cb.tolist(),
        "cr": profile_cr.tolist()
    }
