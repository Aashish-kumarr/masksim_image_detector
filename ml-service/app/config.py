import os
from dotenv import load_dotenv

load_dotenv()

MODEL_PATH = os.getenv("MODEL_PATH", "./models/masksim_sd14_deploy.pt")
MODEL_THRESHOLD = float(os.getenv("MODEL_THRESHOLD", "0.5"))
MODEL_VERSION = os.getenv("MODEL_VERSION", "masksim-sd14-v1")
ML_SERVICE_API_KEY = os.getenv("ML_SERVICE_API_KEY", "")
