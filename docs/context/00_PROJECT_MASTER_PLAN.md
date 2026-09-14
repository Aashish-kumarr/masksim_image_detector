# 00 — Project Master Plan

## 1. Product

**Name:** MaskSim  
**Positioning:** Frequency-domain AI image forensic analysis tool.

The product should not behave like a generic AI detector that only returns `REAL` or `AI`.

The strongest product feature is explainability through the actual detector pipeline:

```text
Uploaded image
→ analyzed 512×512 crop
→ DnCNN residual
→ FFT / shifted log-magnitude spectrum
→ learned frequency mask
→ learned reference spectrum
→ cosine similarity
→ detector score
→ REAL / AI_GENERATED
```

## 2. V1 product goals

V1 must provide:

- complete public website
- upload and analyze workflow
- deterministic image validation UX
- result summary
- forensic-analysis views
- model information
- dataset information
- evaluation/performance information
- limitations
- history architecture
- stable Node API
- mock ML adapter before real model integration
- real FastAPI integration later
- error handling
- request IDs
- security basics
- responsive behavior

## 3. Main pages

Final site map:

```text
/
├── Home
├── /analyze
├── /analysis/:id
├── /how-it-works
├── /model
├── /dataset
├── /performance
├── /history
├── /limitations
└── /about
```

Primary navigation should stay compact:

```text
MaskSim | Analyze | How It Works | Model | Performance | About
```

Secondary pages such as Dataset, Limitations, Architecture and History may live in a Research menu, account menu, footer, or contextual links.

## 4. Build phases

### Phase 0 — Freeze contracts and context
Create and use the documents in this pack.

Deliverables:
- architecture frozen
- route naming frozen
- response contracts frozen
- frontend page map frozen
- design brief frozen before coding

### Phase 1 — Stitch UX exploration
Use Stitch only for UI/UX exploration.

Required output:
- multiple black, simple, human-designed concepts
- no implementation assumptions hidden in visuals
- final chosen direction
- final design tokens / DESIGN.md
- desktop-first key screens
- responsive behavior notes

Do not start broad frontend implementation until the main Analyze and Result experiences are approved.

### Phase 2 — Frontend shell
Implement:
- application routing
- navigation
- page shells
- reusable layout primitives
- design tokens
- mock content
- accessible loading/error/empty states

### Phase 3 — Node API with mock ML
Implement:
- Express
- versioned routes
- upload middleware
- validation
- request ID
- rate limiting
- standard error contract
- `ml.service.js`
- mock ML adapter
- optional MongoDB persistence

At this phase, React should already work end-to-end using realistic mock results.

### Phase 4 — Complete product pages
Implement:
- Home
- Analyze
- Result/Forensics
- How It Works
- Model
- Dataset
- Performance
- History
- Limitations
- About

### Phase 5 — FastAPI ML service
After the trained/deployment checkpoint is ready:
- rebuild model classes
- load checkpoint once
- deterministic preprocessing
- `/v1/health`
- `/v1/model-info`
- `/v1/predict`
- explainability artifacts
- internal API key

### Phase 6 — Replace mock with real ML adapter
Node continues serving the same public API.

Only `ml.service.js` / adapter configuration changes.

### Phase 7 — Regression verification
Most important requirement:

> The same known image analyzed in the existing Jupyter/reference implementation and FastAPI must produce the same or numerically equivalent score.

If not, debug:
- crop
- EXIF orientation
- RGB conversion
- RGB→YCbCr
- scaling
- DnCNN residual
- FFT norm
- FFT shift
- epsilon
- checkpoint state
- BatchNorm eval mode

### Phase 8 — Hardening
Add:
- security headers
- strict CORS
- ownership checks
- history pagination
- logging
- timeout handling
- health checks
- privacy behavior
- deployment configuration

### Phase 9 — Docker and deployment
Only after local integration is stable.

## 5. V1 non-goals

Do not build these before V1 is stable:

- universal AI-generator claims
- per-generator attribution beyond current detector scope
- multi-generator UI with fake data
- arbitrary model resizing/upscaling
- chatbot assistant
- fake analysis progress percentages
- fabricated forensic metrics
- permanent image retention by default
- complex real-time job queues unless traffic requires them

## 6. Definition of success

The web application is successful when:

1. A user can upload a valid image.
2. Browser and server validations are consistent.
3. Express is the only public ML-facing API.
4. FastAPI can be swapped in without changing React contracts.
5. A result clearly separates detector score, threshold and similarity.
6. Forensic visualizations use tensors from the same inference pass.
7. Model scope and limitations are visible.
8. Known reference images reproduce reference inference scores.
