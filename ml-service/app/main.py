from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile
from .config import MODEL_THRESHOLD, MODEL_VERSION

app = FastAPI(
    title="MaskSim ML Service",
    version="0.1.0",
)

# The real checkpoint integration will set this after successful startup.
MODEL_LOADED = False


@app.get("/v1/health")
def health():
    return {
        "status": "ok" if MODEL_LOADED else "starting_or_not_connected",
        "model_loaded": MODEL_LOADED,
        "detector": "stable-diffusion-1-4",
        "model_version": MODEL_VERSION,
    }


@app.get("/v1/model-info")
def model_info():
    return {
        "detector": "stable-diffusion-1-4",
        "name": "MaskSim SD1.4",
        "version": MODEL_VERSION,
        "input_size": 512,
        "threshold": MODEL_THRESHOLD,
        "model_loaded": MODEL_LOADED,
    }


@app.post("/v1/predict")
async def predict(
    image: UploadFile = File(...),
    includeExplainability: bool = Form(True),
    x_request_id: str | None = Header(default=None),
):
    # Intentionally not faking model inference here.
    # During web development, Express uses ML_MODE=mock.
    raise HTTPException(
        status_code=503,
        detail={
            "code": "MODEL_NOT_CONNECTED",
            "message": "The real MaskSim checkpoint has not been connected to the ML service yet.",
            "requestId": x_request_id,
        },
    )
