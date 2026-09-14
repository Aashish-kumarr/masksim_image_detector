# 10 — Security, Privacy and Deployment

## 1. Minimum security

Express:
- Helmet
- CORS allowlist
- upload size limit
- MIME allowlist
- rate limit on detection
- request ID
- auth for protected routes
- ownership checks
- structured errors

FastAPI:
- actual image decode validation
- no arbitrary path input
- internal API key in production/private network
- safe exceptions
- startup fails if checkpoint cannot load

## 2. Secrets

Never commit:
- JWT_SECRET
- database passwords
- ML_SERVICE_API_KEY
- storage keys
- production credentials

Use:
- `.env`
- `.env.example`

## 3. Image privacy

Uploads may contain personal information.

Recommended V1 policy:
- process image in memory
- discard bytes after inference
- persist metadata only

Document:
- whether images are retained
- retention duration
- who can access retained images

If retention is added:
- explicit product need
- object storage
- access control
- deletion behavior

## 4. FastAPI exposure

Preferred:
```text
Internet
  ↓
reverse proxy / frontend / Node
  ↓
private FastAPI
```

Do not expose FastAPI publicly unless operational architecture requires it.

## 5. Internal authentication

Node may send:
```http
X-Internal-API-Key: <secret>
```

FastAPI verifies it.

## 6. Concurrency

Initial GPU-safe approach:
- one ML process/worker
- controlled request concurrency
- inference batch size 1

Do not start many Uvicorn workers on one GPU because every worker may load another model copy.

## 7. Health

FastAPI:
```text
GET /v1/health
```

Healthy only if model successfully loaded.

Express:
```text
GET /api/v1/health
```

Deployment infrastructure should perform health checks; do not call FastAPI health on every user inference request.

## 8. Docker

Dockerize only after local integration works.

Target:
```text
docker-compose
├── frontend
├── backend
├── ml-service
└── mongodb
```

Inside Compose:
```text
backend → http://ml-service:8000
```

If GPU-hosted:
- configure NVIDIA driver/runtime correctly
- verify CUDA from inside container

## 9. Example environment files

Backend:
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

ML:
```env
MODEL_PATH=./models/masksim_sd14_deploy.pt
MODEL_THRESHOLD=0.5
MODEL_VERSION=masksim-sd14-v1
ML_SERVICE_API_KEY=change_me
```

Frontend:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 10. Production observability

Track:
- request count
- error rate
- request latency
- ML inference latency
- ML service availability
- GPU memory/utilization where available
- rate-limit events

Do not log image bytes.
