# MaskSim / DeepFakeDSP

Web application for frequency-domain AI-image forensic analysis.

## Architecture

```text
React frontend
    ↓
Node.js / Express API
    ↓
ML adapter
    ├── Mock adapter (current web-development mode)
    └── FastAPI adapter (when the trained model is connected)
            ↓
        PyTorch DnCNN + MaskSim
```

The frontend never loads the model directly.  
The Node backend never reimplements PyTorch inference.  
FastAPI remains focused on model execution and explainability.

## Current status

This starter already contains:

- all planned React routes/pages
- a minimal black placeholder UI
- image upload flow
- Express versioned API
- Multer validation
- request IDs
- Helmet / CORS / rate limiting
- mock ML adapter
- FastAPI service skeleton
- stable public API contract
- Antigravity context documentation
- Stitch handoff location

The UI is intentionally **not final**. The final visual system must come from Stitch and be stored in `docs/design/DESIGN.md`.

## Project structure

```text
deepfakedsp/
├── frontend/
├── backend/
├── ml-service/
├── docs/
│   ├── context/
│   └── design/
├── scripts/
├── README.md
└── .gitignore
```

## Local development

### 1. Backend

```powershell
cd backend
copy .env.example .env
npm install
npm run dev
```

Default:
`http://localhost:5000`

### 2. Frontend

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Default:
`http://localhost:5173`

### 3. ML service — later

The web application currently uses:

```env
ML_MODE=mock
```

When the trained checkpoint and Python inference code are ready:

```powershell
cd ml-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

Then set the backend:

```env
ML_MODE=fastapi
ML_SERVICE_URL=http://127.0.0.1:8000
```

No React API changes should be required.

## Windows target folder

Extract/copy the contents of this starter into:

```text
C:\Users\adars\OneDrive\Desktop\coding1st\deepfakedsp
```

## Next project step

1. Open `docs/context/` in Antigravity as project context.
2. Create the final UX in Stitch.
3. Save/export the approved design system into `docs/design/DESIGN.md`.
4. Ask Antigravity to implement that exact design without changing architecture.
