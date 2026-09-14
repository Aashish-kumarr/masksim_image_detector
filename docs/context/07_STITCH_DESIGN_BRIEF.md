# 07 — Stitch Design Brief

## 1. Objective

Create the final UX/UI design system before Antigravity implementation.

The site is a black/dark technical image-forensics product, but it must not look like a generated sci-fi dashboard.

## 2. Visual character

Keywords:
- black
- clean
- minimal
- serious
- image-first
- product-tool
- editorial restraint
- technical but calm
- credible

Not:
- cyberpunk
- hacker UI
- Web3
- chatbot
- glowing AI dashboard
- purple gradient SaaS
- terminal-heavy
- card-heavy

## 3. Preferred visual structure

### Color
- background: near-black
- surface: very dark gray
- text: soft white
- secondary: neutral gray
- border: subtle dark gray
- one restrained accent only

### Typography
Preferred:
- Geist / Inter for UI
- IBM Plex Mono / JetBrains Mono for numeric technical values only

Avoid:
- futuristic fonts
- all-monospace UI
- excessive all-caps

### Corners
- 4–8px
- some panels can be nearly square

### Borders
- 1px subtle structural borders
- whitespace is preferred over nested boxes

### Shadows
- almost none

## 4. Required key screens

Stitch must fully design:
1. Home
2. Analyze empty
3. Analyze selected image
4. Analyze loading
5. Analysis result
6. Forensic Residual
7. Forensic Spectrum
8. Forensic Mask
9. Forensic Reference
10. Details
11. How It Works
12. Model
13. Dataset
14. Performance
15. History
16. Limitations
17. About

## 5. Analyze screen rule

Do not fragment into many tiny panels.

Preferred desktop composition:
- left: uploaded image/model crop
- center: large forensic visualization
- right: result summary/actions

## 6. Real data only

Do not invent unsupported metrics such as:
- "radial coherence"
- "empirical p-value"
- "quantization anomaly"
unless backend/model explicitly provides them.

Use only values in API contracts or clearly marked placeholders.

## 7. Result wording

Prefer:
- Synthetic signal detected
- Detector score
- Threshold
- Cosine similarity
- Synthetic fingerprint match

Avoid:
- "94.72% definitely AI"
- exact-generator certainty

## 8. Deliverables expected from Stitch

Before Antigravity coding:
- selected visual direction
- desktop screens
- mobile adaptations
- component patterns
- typography scale
- spacing scale
- colors
- borders/radii
- button states
- input/dropzone states
- tabs
- data tables
- charts
- loading/error/empty states
- final `DESIGN.md`

## 9. Implementation handoff rule

Once the design is selected:
- freeze design tokens
- freeze component patterns
- export/reference selected Stitch assets
- Antigravity must implement the selected design rather than regenerate it
