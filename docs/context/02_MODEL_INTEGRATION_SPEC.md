# 02 — Model Integration Specification

## 1. Current detector scope

Current trained detector:
- target synthetic family: Stable Diffusion 1.4
- real images: RAISE-1k
- synthetic images: Synthbuster / stable-diffusion-1-4
- input: fixed 512×512
- current decision threshold: 0.5

Held-out SD1.4-focused test metrics from the supplied specification:
- AUC: 0.9825146092
- Accuracy: 0.9189189189
- Precision: 0.9025974026
- Recall: 0.9391891892
- F1: 0.9205298013

Confusion matrix:
```text
                 Predicted Real   Predicted Fake
Actual Real           133             15
Actual Fake             9            139
```

These metrics must never be presented as universal performance across all AI generators.

## 2. Required inference pipeline

```text
raw image bytes
↓
Pillow decode
↓
ImageOps.exif_transpose
↓
RGB conversion
↓
validate width >= 512 and height >= 512
↓
deterministic center crop 512×512
↓
float32 / 255
↓
Tensor [1,3,512,512]
↓
RGB → YCbCr
↓
fine-tuned DnCNN residual
↓
FFT2(norm="ortho")
↓
fftshift
↓
log(abs(F) + 1e-8)
↓
MaskSim
    1×1 convolution
    sigmoid(mask_raw)
    masking
    BatchNorm
    centered learned reference
    channel-wise cosine similarity
    average channel similarity
↓
sigmoid(exp(a) * similarity + b)
↓
score
↓
threshold
↓
REAL or AI_GENERATED
```

## 3. Critical inference rule

Training used a special anti-bias loss rule involving absolute cosine similarity for real samples.

**Do not use training loss behavior at inference time.**

Production inference uses ordinary MaskSim forward/similarity behavior.

## 4. Input policy

V1 accepted formats:
- JPEG
- PNG

Recommended upload maximum:
- 10 MB

Minimum decoded dimensions:
- 512×512

V1 behavior for smaller images:
- reject
- do not silently upscale

Reason:
The detector learns fixed frequency locations; interpolation changes the frequency spectrum.

## 5. DnCNN facts from source spec

Architecture:
- 20 convolution layers
- 3 input channels
- 64 hidden channels
- 3 output channels
- 3×3 kernel
- padding 1
- ReLU
- 668,227 parameters

Use:
```python
residual = dncnn.residual(ycbcr)
```

Do not use the visually denoised image as the MaskSim frequency input.

## 6. MaskSim facts

Important tensors:
```text
mask_raw: [3,512,512]
reference: [3,512,512]
```

Actual mask:
```python
mask = torch.sigmoid(mask_raw)
```

Output score is the result of learned logistic transform:
```python
probability = torch.sigmoid(torch.exp(a) * similarity + b)
```

## 7. Score wording

Safe UI wording:
- detector score
- AI-generation score
- synthetic fingerprint match
- detector confidence (with clear scope note)

Avoid:
- guaranteed probability of AI origin
- exact generator proof

A high SD1.4 detector score means strong similarity to the learned synthetic fingerprint, not proof that SD1.4 was the exact generator.

## 8. FastAPI startup

At process startup:
1. select device
2. construct DnCNN
3. construct MaskSim
4. load checkpoint
5. load state dicts
6. move to device
7. call `eval()`
8. optionally warm up
9. mark service ready

Never reload model per request.

## 9. Device

```python
torch.device("cuda" if torch.cuda.is_available() else "cpu")
```

Inference:
```python
with torch.inference_mode():
    ...
```

## 10. Explainability outputs

When requested, reuse the same inference tensors to produce display artifacts:
- exact crop
- residual image
- spectrum combined
- Y spectrum
- Cb spectrum
- Cr spectrum
- learned mask
- masked feature/spectrum view
- learned reference spectrum

Display normalization is visualization-only.

It must not feed back into the model.

## 11. Model-level cached artifacts

Cache:
- learned mask visualization
- learned reference visualization

They are model-level, not request-specific.

## 12. Regression gate

Before production integration, verify one or more known images against the reference/Jupyter implementation.

Expected:
- same prediction
- same or numerically equivalent detector score

Do not proceed if scores diverge materially.
