# AGENTS.md — MaskSim Implementation Rules

## Mission

Build the MaskSim web product exactly from the approved architecture, API contracts and Stitch design system.

## Mandatory context

Before implementation, read:

```text
docs/context/README.md
docs/context/00_PROJECT_MASTER_PLAN.md
docs/context/01_SYSTEM_ARCHITECTURE.md
docs/context/05_API_CONTRACTS.md
```

Then read the layer spec relevant to the task.

For UI work, also read the final Stitch `DESIGN.md`.

## Non-negotiable architecture

```text
React → Express → FastAPI → PyTorch MaskSim
```

Never:
- React → FastAPI directly
- load `.pt` model in React
- implement PyTorch inference in Node
- put auth/MongoDB business logic in FastAPI

## Current development mode

The website may be built before the real model service.

Use:
```text
ml.service.js
→ MockMlAdapter
```

Then replace with:
```text
ml.service.js
→ FastApiMlAdapter
```

Public React/Express contracts must not change during the swap.

## Model rules

- fixed deterministic 512×512 center crop
- reject smaller images in V1
- no random augmentation at inference
- EXIF transpose before crop
- RGB conversion
- RGB→YCbCr
- use DnCNN residual
- FFT2 with `norm="ortho"`
- fftshift exactly once
- log magnitude with epsilon
- MaskSim inference forward path
- do not use training-only anti-bias loss behavior
- model in eval mode
- inference_mode/no_grad
- threshold from configuration

## Product wording

Do not claim universal certainty.

Use:
- detector score
- synthetic fingerprint match
- current detector optimized for Stable Diffusion 1.4

Keep:
- cosine similarity
- final detector score
as distinct values.

## Design rules

Do not invent a new design system.

Follow approved Stitch assets and DESIGN.md.

Visual direction:
- black
- simple
- human-designed
- minimal technical product
- not cyberpunk
- not glowing AI dashboard
- no fake metrics

## API rule

Do not invent API fields.

If a needed field is missing:
1. identify requirement
2. propose contract change
3. update docs after approval
4. implement

## Documentation rule

When behavior or architecture changes, update the corresponding file in `docs/context/`.

## Completion rule

Do not claim completion until:
- code implemented
- relevant tests run
- UI state verified where applicable
- contracts unchanged or intentionally updated
- errors handled
