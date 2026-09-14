# 06 — UX and Information Architecture

## 1. Product UX principle

MaskSim should feel like a clean image-analysis product, not a sci-fi forensic dashboard.

Design goals:
- black/dark
- simple
- credible
- image-first
- technical without clutter
- human-designed
- real outputs only

Avoid:
- fake forensic metrics
- neon
- excessive all-caps
- too many tiny boxes
- decorative charts
- complex terminal styling
- generic AI gradient branding

## 2. Home

Purpose:
- explain product quickly
- establish scope
- drive Analyze action

Sections:
1. navbar
2. hero
3. actual product/forensic visual
4. simplified pipeline
5. current detector scope
6. restrained performance summary
7. limitations/disclaimer
8. footer/references

Primary CTA:
- Analyze an image

## 3. Analyze

### Empty state
Show:
- upload
- JPEG/PNG
- >=512×512
- <=10 MB
- detector name
- current model input
- privacy note if images are not retained

### Selected state
Show:
- original preview
- filename
- dimensions
- file size
- original/model-input switch or crop visualization
- Analyze
- Replace
- Remove

### Loading
Prefer one calm loading state.

If real progress becomes available, use actual pipeline stages.

Do not simulate exact progress.

## 4. Analysis result

Recommended 3-zone desktop layout:

```text
Left          Center                Right
Image         Forensic viewer       Result summary
/crop         + tabs                + actions
```

### Result summary
Show:
- prediction
- detector score
- threshold
- cosine similarity
- detector/version
- analyzed size
- inference time

### Forensic tabs
- Overview
- Residual
- Spectrum
- Mask
- Reference
- Details

Optional later:
- Masked Spectrum
- Compare

## 5. How It Works

Interactive but simple pipeline:

```text
Image
→ Crop
→ YCbCr
→ DnCNN
→ Residual
→ FFT
→ Mask
→ Reference
→ Similarity
→ Score
```

For each stage show:
- purpose
- input
- output
- trainable?
- short explanation

## 6. Model

Model-card/spec-sheet approach.

Content:
- model name/version
- input size
- color space
- threshold
- SD1.4 focus
- DnCNN architecture
- MaskSim architecture
- parameter counts
- inference flow
- deployment behavior

## 7. Dataset

Content:
- RAISE-1k real dataset
- Synthbuster SD1.4 synthetic dataset
- matched IDs/pairs
- train/validation/test counts
- class balance
- optional permitted examples
- optional offline dataset frequency statistics

Do not invent sample imagery if licensing is unclear.

## 8. Performance

Content:
- AUC
- accuracy
- precision
- recall
- F1
- confusion matrix
- ROC curve
- training curves if complete checkpoint history is available
- scope note

Avoid presenting metric cards like a SaaS sales dashboard.

## 9. History

Content:
- filename
- result
- score
- model version
- dimensions
- date
- open analysis

Filters later:
- prediction
- date
- model version

No image thumbnail if images are not actually retained.

## 10. Limitations

Must clearly communicate:
- current detector optimized for SD1.4
- unknown generalization to other generators
- sensitivity may change after resizing/recompression/screenshots/strong edits
- false positives and false negatives exist
- result is analytical evidence, not absolute proof

## 11. About

Content:
- problem
- motivation
- why frequency domain
- why DnCNN residual
- MaskSim concept
- web architecture
- research references
- team
- future work

## 12. Responsive strategy

Desktop first: 1440×900.

Tablet:
- collapse 3-zone analysis to 2 zones
- result summary may move above forensic tabs

Mobile:
- image first
- result second
- forensic tabs scroll horizontally
- details stack
- no tiny multi-column dashboards
