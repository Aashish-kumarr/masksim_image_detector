# MaskSim Web Application — Antigravity Context Pack

This folder is the implementation reference for the MaskSim web application.

## Purpose

The project is a web interface around a MaskSim-based AI-image forensic detector. The current detector is specialized for Stable Diffusion 1.4 fingerprints.

The implementation must preserve separation of concerns:

```text
React frontend
    ↓
Node.js / Express API
    ↓
FastAPI ML service
    ↓
PyTorch DnCNN + MaskSim
```

The frontend never loads model weights.  
The Node backend never reimplements PyTorch inference.  
The FastAPI service does not own user authentication or MongoDB business logic.

## Recommended reading order

1. `00_PROJECT_MASTER_PLAN.md`
2. `01_SYSTEM_ARCHITECTURE.md`
3. `02_MODEL_INTEGRATION_SPEC.md`
4. `03_BACKEND_SPEC.md`
5. `04_FRONTEND_SPEC.md`
6. `05_API_CONTRACTS.md`
7. `06_UX_INFORMATION_ARCHITECTURE.md`
8. `07_STITCH_DESIGN_BRIEF.md`
9. `08_ANTIGRAVITY_IMPLEMENTATION_PLAYBOOK.md`
10. `09_TESTING_ACCEPTANCE.md`
11. `10_SECURITY_PRIVACY_DEPLOYMENT.md`
12. `AGENTS.md`

## Source of truth

These documents are derived from the supplied project specification:
`MaskSim_Complete_Web_Application_Design.md`.

Where this context pack adds implementation sequencing or product-organization recommendations, they are marked as **Project decision** or **Recommended** rather than model facts.

## Current build strategy

Do not wait for the final model service before building the web application.

Use a backend abstraction:

```text
frontend
  ↓
Express `/api/v1/detections`
  ↓
ml.service.js
  ├── mock adapter during web development
  └── FastAPI adapter when model service is ready
```

The public frontend contract should stay stable when the real ML service replaces the mock.
