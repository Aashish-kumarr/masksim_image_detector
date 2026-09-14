# MaskSim ML Service

This folder is intentionally a **service skeleton** until the trained/deployment checkpoint is connected.

Target internal routes:

```text
GET  /v1/health
GET  /v1/model-info
POST /v1/predict
```

Do not make this service responsible for:
- browser auth
- user accounts
- MongoDB application history
- React state
- public rate limiting

The exact model pipeline is documented in:

```text
../docs/context/02_MODEL_INTEGRATION_SPEC.md
```

Before switching Express from `ML_MODE=mock` to `ML_MODE=fastapi`, complete the real inference implementation and run the reference/Jupyter regression test.
