# 04 — React Frontend Specification

## 1. Frontend role

React owns the product experience.

It must:
- select/drop image
- create/revoke preview URL
- basic file validation
- show exact validation rules
- submit FormData to Express
- render loading/error/success
- render result
- render forensic artifacts
- render static research/product pages
- render history

It must not contain model logic.

## 2. Recommended source layout

```text
frontend/src/
├── components/
│   ├── common/
│   ├── detector/
│   ├── forensic/
│   └── charts/
├── pages/
│   ├── HomePage.jsx
│   ├── AnalyzePage.jsx
│   ├── AnalysisPage.jsx
│   ├── HowItWorksPage.jsx
│   ├── ModelPage.jsx
│   ├── DatasetPage.jsx
│   ├── PerformancePage.jsx
│   ├── HistoryPage.jsx
│   ├── LimitationsPage.jsx
│   └── AboutPage.jsx
├── services/
│   ├── apiClient.js
│   ├── detectionApi.js
│   └── projectApi.js
├── hooks/
│   ├── useDetection.js
│   └── useImagePreview.js
├── utils/
│   ├── validateImage.js
│   ├── formatBytes.js
│   └── formatScore.js
├── constants/
│   └── routes.js
├── App.jsx
└── main.jsx
```

## 3. Routes

```text
/                    Home
/analyze             Upload/analyze
/analysis/:id        Result/forensics
/how-it-works        Pipeline explanation
/model               Model card/spec
/dataset             Data provenance/splits
/performance         Metrics/ROC/confusion matrix
/history             User analysis history
/limitations         Scope/known limitations
/about               Research/project/team
```

If a result is not persisted yet, `/analysis/:id` may use local navigation state for development, but final persisted history should use stable IDs.

## 4. Analyze page state

Required state:
```text
selectedFile
previewUrl
validationError
loading
result
requestError
includeExplainability
```

Suggested state machine:
```text
EMPTY
→ FILE_SELECTED
→ VALIDATING
→ READY
→ ANALYZING
→ SUCCESS
or ERROR
```

## 5. Client validation

Before request:
- file selected
- JPEG/PNG MIME
- <= max configured size

Image dimensions may be checked client-side for UX, but server validation remains authoritative.

## 6. Upload request

Use browser `FormData`.

Do not manually set multipart `Content-Type`; browser must create the boundary.

## 7. Result vocabulary

Show:
- prediction
- detector score
- threshold
- cosine similarity
- detector name/version
- original/analyzed dimensions
- inference time
- request ID

Avoid:
- "100% definitely AI"
- universal probability claims

## 8. Forensic tabs

Recommended:
```text
Overview
Residual
Spectrum
Mask
Reference
Details
```

Optional later:
```text
Masked Spectrum
Compare
```

### Spectrum
Subtabs:
```text
Combined
Y
Cb
Cr
```

### Mask
Subtabs:
```text
Combined
Y
Cb
Cr
```

## 9. Accessibility

Required:
- keyboard-accessible dropzone
- visible focus states
- proper labels
- alt text
- status not communicated by color alone
- sufficient contrast
- reduced-motion friendly behavior

## 10. Loading UX

Do not show fake percentages.

Acceptable status text:
- Preparing image
- Extracting residual structure
- Computing frequency spectrum
- Comparing learned fingerprint
- Finalizing analysis

If backend does not stream actual stage progress, these should not pretend to reflect real-time backend stages. Prefer a neutral single loading state unless actual progress is implemented.

## 11. Data fetching

Keep API code outside components.

Recommended:
- central `apiClient`
- `detectionApi`
- `projectApi`

React Query is optional, not mandatory.

## 12. History UX

History should prioritize metadata:
- filename
- result
- score
- model version
- date
- open result

Do not imply uploaded images are stored if they are not.

## 13. Frontend environment

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 14. Design implementation rule

The final Stitch/`DESIGN.md` output becomes the visual source of truth.

Do not let Antigravity invent a second visual system after design approval.
