import torch
import numpy as np
from PIL import Image, ImageOps
import time
import io
from .model import DnCNN, MaskSim, rgb_to_ycbcr, log_mag_spectrum
from .config import MODEL_PATH, MODEL_THRESHOLD, MODEL_VERSION
from .explainability import generate_explainability_artifacts, generate_frequency_profile

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
dncnn = None
masksim = None
model_loaded = False

def load_checkpoint():
    global dncnn, masksim, model_loaded
    try:
        dncnn = DnCNN()
        masksim = MaskSim(h=512, w=512, c=3)
        
        try:
            checkpoint = torch.load(MODEL_PATH, map_location="cpu", weights_only=True)
        except TypeError:
            checkpoint = torch.load(MODEL_PATH, map_location="cpu")
            
        dncnn.load_state_dict(checkpoint["dncnn_state_dict"])
        masksim.load_state_dict(checkpoint["masksim_state_dict"])
        
        dncnn.to(device).eval()
        masksim.to(device).eval()
        
        with torch.inference_mode():
            dummy = torch.zeros(1, 3, 512, 512, device=device)
            _ = masksim(log_mag_spectrum(dncnn.residual(dummy)))
            
        model_loaded = True
        return True
    except Exception as e:
        print(f"Failed to load checkpoint: {e}")
        return False

def predict_image(image_bytes: bytes, include_explainability: bool = False):
    if not model_loaded:
        raise RuntimeError("MODEL_NOT_CONNECTED: Model not loaded")
        
    start_time = time.time()
    
    try:
        img = Image.open(io.BytesIO(image_bytes))
        orig_w, orig_h = img.size
    except Exception as e:
        raise ValueError("INVALID_IMAGE: Invalid or corrupted image.")
        
    if orig_w < 512 or orig_h < 512:
        raise ValueError("IMAGE_TOO_SMALL: Image must be at least 512x512 pixels.")
        
    img = ImageOps.exif_transpose(img)
    img = img.convert("RGB")
    
    w, h = img.size
    left = (w - 512) // 2
    top = (h - 512) // 2
    crop = img.crop((left, top, left + 512, top + 512))
    
    crop_np = np.array(crop).astype(np.float32) / 255.0
    crop_tensor = torch.from_numpy(crop_np).permute(2, 0, 1).unsqueeze(0).to(device)
    
    with torch.inference_mode():
        ycbcr = rgb_to_ycbcr(crop_tensor)
        residual = dncnn.residual(ycbcr)
        spectrum = log_mag_spectrum(residual)
        
        similarity = masksim.similarity(spectrum).item()
        score = masksim(spectrum).item()
        
    prediction = "AI_GENERATED" if score >= MODEL_THRESHOLD else "REAL"
    inference_ms = int((time.time() - start_time) * 1000)
    
    response = {
        "prediction": prediction,
        "score": score,
        "threshold": MODEL_THRESHOLD,
        "detector": {
            "id": "stable-diffusion-1-4",
            "name": "MaskSim SD1.4",
            "version": MODEL_VERSION
        },
        "input": {
            "originalWidth": orig_w,
            "originalHeight": orig_h,
            "analyzedWidth": 512,
            "analyzedHeight": 512
        },
        "analysis": {
            "cosineSimilarity": similarity,
            "inferenceMs": inference_ms
        }
    }
    
    if include_explainability:
        artifacts = generate_explainability_artifacts(
            crop_np, 
            residual.squeeze(0).cpu(), 
            spectrum.squeeze(0).cpu(), 
            masksim
        )
        profile = generate_frequency_profile(spectrum.squeeze(0).cpu())
        
        response["explainability"] = {
            "available": True,
            **artifacts
        }
        response["frequencyExplorer"] = {
            "available": True,
            "images": {
                "combined": artifacts["spectrumCombined"],
                "y": artifacts["spectrumY"],
                "cb": artifacts["spectrumCb"],
                "cr": artifacts["spectrumCr"]
            },
            "metadata": {
                "width": 512,
                "height": 512,
                "representation": "log-magnitude",
                "transform": "2D FFT",
                "shift": "centered",
                "source": "DnCNN residual"
            },
            "pointData": {
                "available": True,
                "profile": profile
            }
        }
    else:
        response["explainability"] = {"available": False}
        response["frequencyExplorer"] = {"available": False}
        
    return {"data": response}
