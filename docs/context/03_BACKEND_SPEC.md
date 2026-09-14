# 03 — Node.js / Express Backend Specification

## 1. Backend role

Express is the single public application API.

It is responsible for:
- auth
- authorization
- multipart handling
- file size/MIME validation
- rate limiting
- request IDs
- calling FastAPI
- normalizing responses
- saving history metadata
- project metadata APIs
- structured errors

## 2. Recommended source layout

```text
backend/src/
├── config/
│   ├── env.js
│   └── database.js
├── controllers/
│   ├── detection.controller.js
│   └── project.controller.js
├── routes/
│   ├── detection.routes.js
│   ├── project.routes.js
│   └── health.routes.js
├── services/
│   ├── ml.service.js
│   ├── detection.service.js
│   └── ml/
│       ├── mock.adapter.js
│       └── fastapi.adapter.js
├── middleware/
│   ├── upload.middleware.js
│   ├── auth.middleware.js
│   ├── requestId.middleware.js
│   ├── rateLimit.middleware.js
│   └── error.middleware.js
├── models/
│   └── Detection.js
├── validators/
│   └── detection.validator.js
├── constants/
│   └── projectMetadata.js
├── utils/
│   ├── logger.js
│   └── ApiError.js
├── app.js
└── server.js
```

## 3. Public routes

```text
POST   /api/v1/detections
GET    /api/v1/detections
GET    /api/v1/detections/:id
DELETE /api/v1/detections/:id      optional

GET    /api/v1/project/model
GET    /api/v1/project/dataset
GET    /api/v1/project/performance
GET    /api/v1/project/training-history
GET    /api/v1/project/architecture

GET    /api/v1/health
```

## 4. Upload handling

Use Multer memory storage for V1.

Validate:
- file present
- MIME type `image/jpeg` or `image/png`
- upload <= configured maximum

FastAPI must still decode the image; Express MIME validation alone is not sufficient.

## 5. `ml.service.js`

This is the only backend module controllers use for ML calls.

Responsibilities:
- select adapter from configuration
- build internal request
- forward request ID
- apply timeout
- attach internal API key for real FastAPI adapter
- validate internal response shape
- normalize transport failures

### Modes

```env
ML_MODE=mock
```

or

```env
ML_MODE=fastapi
ML_SERVICE_URL=http://127.0.0.1:8000
```

## 6. Mock adapter

The mock adapter exists to unblock frontend/backend work.

It must return realistic but explicitly development-only results matching the real internal schema.

Recommended:
- deterministic result based on fixture ID or explicit development switch
- fixtures for REAL
- fixtures for AI_GENERATED
- fixture for small-image error
- fixture for timeout/unavailable
- fixture with explainability placeholders

Never ship fabricated metrics as if they are model outputs.

## 7. Detection controller flow

```text
request
↓
request ID
↓
auth if required
↓
Multer
↓
basic file validation
↓
parse includeExplainability
↓
ml.service.predict()
↓
normalize public result
↓
optionally save metadata
↓
respond
```

## 8. Persistence

Recommended Detection record:

```javascript
{
  userId,
  requestId,
  prediction,
  score,
  threshold,

  detector: {
    id,
    name,
    version
  },

  input: {
    originalFileName,
    mimeType,
    sizeBytes,
    originalWidth,
    originalHeight,
    analyzedWidth,
    analyzedHeight
  },

  analysis: {
    cosineSimilarity,
    inferenceMs
  },

  createdAt
}
```

Do not store raw image buffers by default.

## 9. Logging

Log:
- request ID
- user ID if available
- route
- status code
- ML latency
- total latency
- error category

Never log:
- raw file bytes
- secrets
- internal API key

## 10. Timeout and service failure

Recommended initial internal timeout:
- 30 seconds

Public errors:
- `ML_SERVICE_UNAVAILABLE`
- `INFERENCE_TIMEOUT`
- `INFERENCE_FAILED`

Do not expose Python stack traces.

## 11. Project metadata

Static project/model/performance content should be served by Express or bundled as versioned application data.

Do not query FastAPI repeatedly for static website copy.

## 12. Backend environment example

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/masksim
ML_MODE=mock
ML_SERVICE_URL=http://127.0.0.1:8000
ML_SERVICE_API_KEY=change_me
MAX_UPLOAD_MB=10
FRONTEND_ORIGIN=http://localhost:5173
JWT_SECRET=change_me
```
