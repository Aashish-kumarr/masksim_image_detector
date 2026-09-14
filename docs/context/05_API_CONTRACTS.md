# 05 — API Contracts

## 1. Public detection endpoint

```http
POST /api/v1/detections
Content-Type: multipart/form-data
```

Fields:
```text
image                 required file
includeExplainability optional boolean-like string
```

## 2. Public success response

```json
{
  "success": true,
  "data": {
    "id": "optional-db-id",
    "prediction": "AI_GENERATED",
    "score": 0.9472,
    "confidencePercent": 94.72,
    "threshold": 0.5,
    "detector": {
      "id": "stable-diffusion-1-4",
      "name": "MaskSim SD1.4",
      "version": "masksim-sd14-v1"
    },
    "input": {
      "originalWidth": 1920,
      "originalHeight": 1080,
      "analyzedWidth": 512,
      "analyzedHeight": 512,
      "mimeType": "image/png",
      "sizeBytes": 2418231
    },
    "analysis": {
      "cosineSimilarity": 0.642,
      "inferenceMs": 180
    },
    "explainability": {
      "available": true,
      "cropImage": "data:image/png;base64,...",
      "residualImage": "data:image/png;base64,...",
      "spectrumCombined": "data:image/png;base64,...",
      "spectrumY": "data:image/png;base64,...",
      "spectrumCb": "data:image/png;base64,...",
      "spectrumCr": "data:image/png;base64,...",
      "maskCombined": "data:image/png;base64,...",
      "maskedSpectrum": "data:image/png;base64,...",
      "referenceSpectrum": "data:image/png;base64,..."
    },
    "frequencyExplorer": {
      "available": true,
      "images": {
        "combined": "data:image/png;base64,...",
        "y": "data:image/png;base64,...",
        "cb": "data:image/png;base64,...",
        "cr": "data:image/png;base64,..."
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
        "available": false
      }
    }
  },
  "meta": {
    "requestId": "..."
  }
}
```

Notes:
- `confidencePercent` is presentation convenience; do not describe it as universal calibrated probability.
- For production scale, explainability artifacts may move from inline base64 to signed/dedicated URLs.

## 3. Standard public error

```json
{
  "success": false,
  "error": {
    "code": "IMAGE_TOO_SMALL",
    "message": "Image must be at least 512x512 pixels."
  },
  "meta": {
    "requestId": "..."
  }
}
```

Supported public codes:
```text
NO_FILE
UNSUPPORTED_FORMAT
FILE_TOO_LARGE
INVALID_IMAGE
IMAGE_TOO_SMALL
UNAUTHORIZED
FORBIDDEN
RATE_LIMITED
ML_SERVICE_UNAVAILABLE
INFERENCE_TIMEOUT
INFERENCE_FAILED
INTERNAL_ERROR
```

## 4. History

```http
GET /api/v1/detections
```

Recommended query options:
```text
page
limit
prediction
sort
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "prediction": "AI_GENERATED",
      "score": 0.9472,
      "detector": {
        "name": "MaskSim SD1.4",
        "version": "masksim-sd14-v1"
      },
      "input": {
        "originalFileName": "photo.png",
        "originalWidth": 1920,
        "originalHeight": 1080
      },
      "createdAt": "..."
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

## 5. Detection detail

```http
GET /api/v1/detections/:id
```

Must enforce ownership when user-specific.

## 6. Project model endpoint

```http
GET /api/v1/project/model
```

Example:
```json
{
  "success": true,
  "data": {
    "name": "MaskSim SD1.4",
    "version": "masksim-sd14-v1",
    "inputSize": 512,
    "colorSpace": "YCbCr",
    "dncnnLayers": 20,
    "dncnnParameters": 668227,
    "maskSimParameters": 1572884,
    "totalOptimizedParameters": 2241111,
    "threshold": 0.5,
    "generatorFocus": "Stable Diffusion 1.4"
  }
}
```

## 7. Project performance endpoint

```http
GET /api/v1/project/performance
```

```json
{
  "success": true,
  "data": {
    "scope": "Held-out Stable Diffusion 1.4-focused test split",
    "auc": 0.9825146092,
    "accuracy": 0.9189189189,
    "precision": 0.9025974026,
    "recall": 0.9391891892,
    "f1": 0.9205298013,
    "confusionMatrix": [[133, 15], [9, 139]]
  }
}
```

## 8. Internal FastAPI endpoints

```text
GET  /v1/health
GET  /v1/model-info
POST /v1/predict
```

Internal `/v1/predict` should return enough information for Express to construct the public contract.

## 9. Request ID

Express generates or accepts a safe request ID and forwards it to FastAPI using:
```http
X-Request-ID
```

FastAPI includes it in logs and may echo it internally.
