# 09 — Testing and Acceptance

## 1. Testing strategy

Test each layer independently before full integration.

Order:
1. frontend with mock fixtures
2. Express with mock ML adapter
3. FastAPI direct
4. Express → FastAPI
5. React → Express → FastAPI
6. persistence
7. deployment

## 2. FastAPI tests

Must cover:
- valid PNG
- valid JPEG
- image exactly 512×512
- image larger than 512×512
- image below 512 in width
- image below 512 in height
- RGBA PNG
- grayscale image
- corrupted image
- text file renamed to `.png`
- unsupported MIME
- missing file
- model load failure

## 3. Backend tests

Must cover:
- no file
- wrong field name
- unsupported MIME
- oversized upload
- rate limit
- FastAPI offline
- FastAPI timeout
- invalid FastAPI payload
- successful mock result
- successful real result
- unauthenticated protected history
- ownership checks
- database failure behavior

## 4. Frontend tests

Must cover:
- click upload
- drag/drop
- remove
- replace
- preview cleanup
- unsupported format
- file too large
- small-image handling if dimensions checked client-side
- duplicate Analyze click
- loading
- REAL result
- AI_GENERATED result
- server validation error
- service unavailable
- forensic tabs
- mobile stacking
- keyboard navigation

## 5. Most important model regression

Same known image:
```text
reference/Jupyter → score X
FastAPI           → score X (numerically equivalent)
```

If mismatch:
- stop integration
- compare preprocessing and intermediate tensors

## 6. V1 acceptance checklist

```text
[ ] All final pages exist.
[ ] Design matches approved Stitch design system.
[ ] JPEG/PNG upload works.
[ ] Frontend validation works.
[ ] Express upload validation works.
[ ] FastAPI decodes actual image.
[ ] EXIF orientation is corrected.
[ ] Small images are rejected.
[ ] Center crop is deterministic.
[ ] RGB→YCbCr matches reference.
[ ] DnCNN checkpoint loads.
[ ] MaskSim checkpoint loads.
[ ] FFT pipeline matches reference.
[ ] Known image matches reference score.
[ ] Models use eval mode.
[ ] Inference uses inference_mode/no_grad.
[ ] Training-only loss is not used for prediction.
[ ] Detector name/version are returned.
[ ] Score and similarity are distinct in UI.
[ ] Scope disclaimer is visible.
[ ] Residual visualization works.
[ ] Spectrum views work.
[ ] Mask view works.
[ ] Reference view works.
[ ] Explainability does not alter prediction.
[ ] Performance labels are correct.
[ ] Confusion matrix is correct.
[ ] FastAPI downtime is handled.
[ ] Rate limit is enabled.
[ ] Secrets are environment-based.
[ ] Request IDs are traceable.
[ ] User-image retention behavior is explicit.
[ ] Saved history records model version.
```
