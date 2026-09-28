from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile, Request
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from .config import MODEL_THRESHOLD, MODEL_VERSION
from .inference import load_checkpoint, predict_image
import app.inference as inf

@asynccontextmanager
async def lifespan(app: FastAPI):
    loaded = load_checkpoint()
    if loaded:
        print("MaskSim model loaded successfully.")
    else:
        print("Failed to load MaskSim model.")
    yield

app = FastAPI(
    title="MaskSim ML Service",
    version="0.1.0",
    lifespan=lifespan
)

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    msg = str(exc)
    code = "INVALID_IMAGE"
    if ":" in msg:
        code, text = msg.split(":", 1)
        code = code.strip()
        msg = text.strip()
    return JSONResponse(
        status_code=400,
        content={
            "error": {
                "code": code,
                "message": msg
            }
        }
    )

@app.exception_handler(RuntimeError)
async def runtime_error_handler(request: Request, exc: RuntimeError):
    msg = str(exc)
    code = "INTERNAL_ERROR"
    if ":" in msg:
        code, text = msg.split(":", 1)
        code = code.strip()
        msg = text.strip()
    return JSONResponse(
        status_code=503,
        content={
            "error": {
                "code": code,
                "message": msg
            }
        }
    )

@app.get("/v1/health")
def health():
    return {
        "status": "ok" if inf.model_loaded else "starting_or_not_connected",
        "model_loaded": inf.model_loaded,
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
        "model_loaded": inf.model_loaded,
    }

@app.post("/v1/predict")
async def predict(
    image: UploadFile = File(...),
    includeExplainability: bool = Form(True),
    x_request_id: str | None = Header(default=None),
):
    image_bytes = await image.read()
    response = predict_image(image_bytes, includeExplainability)
    return response
