# 08 — Antigravity Implementation Playbook

## 1. Purpose

This file tells the coding agent how to execute the project without replanning the architecture on every task.

Read these first:
- `README.md`
- `00_PROJECT_MASTER_PLAN.md`
- `01_SYSTEM_ARCHITECTURE.md`
- `05_API_CONTRACTS.md`
- final Stitch `DESIGN.md`

Then read layer-specific specs before changing that layer.

## 2. Working rule

Do not make architectural changes silently.

If a requested implementation conflicts with this context pack:
1. identify the conflict
2. propose the minimum change
3. update the relevant context file if approved
4. implement

## 3. Recommended implementation order

### Step 1 — repository scaffold
Create:
```text
frontend/
backend/
ml-service/
docs/
```

Copy this context pack into:
```text
docs/context/
```

### Step 2 — frontend design system
Implement:
- tokens from Stitch
- typography
- spacing
- buttons
- tabs
- panels
- input/dropzone
- loading/error primitives
- app shell/nav/footer

No backend dependence yet.

### Step 3 — routes and static pages
Create all page routes and shells.

### Step 4 — Express baseline
Implement:
- environment config
- error middleware
- request IDs
- CORS
- Helmet
- route versioning
- health route

### Step 5 — detection API mock path
Implement:
- Multer memory storage
- validation
- rate limit
- `ml.service.js`
- `MockMlAdapter`
- `/api/v1/detections`

### Step 6 — connect React
Implement:
- `detectionApi.js`
- upload flow
- result flow
- errors
- forensic fixture data

At this point the entire web product should be demonstrable without PyTorch.

### Step 7 — project content APIs
Implement model/dataset/performance metadata endpoints.

### Step 8 — persistence
Implement Detection schema and history APIs if database is part of current milestone.

### Step 9 — FastAPI only when model checkpoint is ready
Implement:
- model classes
- config
- startup load
- health
- model-info
- predict
- explainability

### Step 10 — switch ML adapter
Set:
```env
ML_MODE=fastapi
```

No React contract changes.

### Step 11 — regression verification
Compare FastAPI and reference implementation.

### Step 12 — hardening
Tests, security, logging, deployment.

## 4. Connector/MCP usage rules

When using MCP/connectors:
- use repository tools for repository operations
- use browser tools for visual verification
- use Stitch/design connector only as the design source
- do not overwrite approved design decisions with generated alternatives
- save generated plans/spec changes into `docs/` when they become project decisions

## 5. Coding quality expectations

- no duplicated API-call logic
- no model logic in React
- no model logic in Node
- no auth/business logic in FastAPI
- no hard-coded production URLs
- no secrets in source
- consistent error contract
- consistent request IDs
- functions/modules with one clear responsibility
- tests for edge cases before declaring a milestone complete

## 6. Definition of done for each task

A task is done only when:
- implementation is complete
- affected tests pass
- relevant UI state is verified
- no contract was changed accidentally
- docs are updated if the behavior changed

## 7. Antigravity prompt pattern

Use prompts like:

```text
Read docs/context/README.md,
docs/context/01_SYSTEM_ARCHITECTURE.md,
docs/context/04_FRONTEND_SPEC.md,
docs/context/05_API_CONTRACTS.md,
and the final DESIGN.md.

Implement only <specific milestone>.
Do not replan the architecture.
Do not invent API fields.
Use mock data only where explicitly allowed.
Run relevant tests and report changed files.
```
