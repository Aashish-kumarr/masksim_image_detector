# 01 — System Architecture

## 1. Production architecture

```text
┌─────────────────────────────────────┐
│ React frontend                      │
│ - upload                            │
│ - preview                           │
│ - results                           │
│ - forensic views                    │
│ - history                           │
└─────────────────┬───────────────────┘
                  │ HTTPS
                  │ POST /api/v1/detections
                  ▼
┌─────────────────────────────────────┐
│ Node.js + Express                   │
│ - auth                              │
│ - upload validation                 │
│ - rate limiting                     │
│ - request IDs                       │
│ - MongoDB persistence               │
│ - ML transport abstraction          │
└─────────────────┬───────────────────┘
                  │ private/internal HTTP
                  │ POST /v1/predict
                  ▼
┌─────────────────────────────────────┐
│ FastAPI ML service                  │
│ - decode                            │
│ - deterministic preprocessing       │
│ - PyTorch inference                 │
│ - explainability                    │
└─────────────────┬───────────────────┘
                  ▼
┌─────────────────────────────────────┐
│ DnCNN + MaskSim checkpoint          │
└─────────────────────────────────────┘
```

## 2. Layer responsibilities

### React owns
- page rendering
- file selection
- preview URL
- basic client validation
- request state
- result rendering
- forensic navigation
- accessible error states

React must not own:
- model weights
- PyTorch
- FFT inference logic
- classification thresholds as hidden business logic
- database writes

### Express owns
- public API
- authentication/authorization
- upload limits
- MIME allowlist
- request ID
- rate limiting
- ML-service calls
- public response normalization
- history persistence
- logging

Express must not:
- reimplement MaskSim
- load PyTorch checkpoints

### FastAPI owns
- actual image decode validation
- EXIF transpose
- RGB conversion
- 512×512 validation/crop
- tensor conversion
- RGB→YCbCr
- DnCNN inference
- FFT
- MaskSim inference
- explainability tensors/artifacts
- model health

FastAPI must not:
- manage user accounts
- validate browser JWTs when private behind Express
- write normal application history to MongoDB

## 3. Local development topology

```text
React       http://localhost:5173
Express     http://localhost:5000
FastAPI     http://localhost:8000
MongoDB     mongodb://localhost:27017
```

## 4. Public versus internal interfaces

Public:
```text
Browser → Express
```

Internal:
```text
Express → FastAPI
```

FastAPI should preferably not be directly exposed to the public internet.

## 5. Mock-first architecture

Before FastAPI integration:

```text
Express ml.service.js
  ↓
MockMlAdapter
  ↓
realistic deterministic JSON
```

After model integration:

```text
Express ml.service.js
  ↓
FastApiMlAdapter
  ↓
/v1/predict
```

Both adapters must return the same normalized internal structure.

## 6. Persistence

Recommended default:

- store analysis metadata
- do not store raw uploaded image bytes
- preserve model version with every saved result

If image retention is later required, use object storage and store only a URL/reference in MongoDB.

## 7. Future multi-generator path

Current model is SD1.4-focused.

Future architecture may share:

```text
Image
→ YCbCr
→ shared DnCNN
→ shared FFT spectrum
→ generator-specific MaskSim heads
```

Do not build the current frontend in a way that assumes there can only ever be one detector, but do not display nonexistent detector scores in V1.
