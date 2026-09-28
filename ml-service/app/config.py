import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

_model_path_env = os.getenv("MODEL_PATH", "./models/masksim_sd14_deploy.pt")
if not os.path.isabs(_model_path_env):
    MODEL_PATH = str(BASE_DIR / _model_path_env)
else:
    MODEL_PATH = _model_path_env

MODEL_THRESHOLD = float(os.getenv("MODEL_THRESHOLD", "0.5"))
MODEL_VERSION = os.getenv("MODEL_VERSION", "masksim-sd14-v1")
ML_SERVICE_API_KEY = os.getenv("ML_SERVICE_API_KEY", "")
