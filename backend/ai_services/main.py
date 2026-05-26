from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import sys
import base64
from typing import Optional

# Add sub-folders to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "voice"))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "vision"))

app = FastAPI(title="VeriLog AI Multiservice")

# --- Voice Deepfake Detection (AuralShield) ---
try:
    # AuralShield typically has its own app/main.py logic
    # We will import its internal detection logic
    from voice.main import app as voice_app
    @app.post("/ai/voice/predict")
    async def predict_voice(data: dict):
        # This will be refined to call the internal model inference logic
        return {"status": "success", "message": "Voice detection logic linked", "details": "AuralShield engine ready"}
except ImportError as e:
    print(f"Warning: Could not import voice service: {e}")

# --- Vision & OCR (BharatVision) ---
@app.post("/ai/vision/ocr")
async def process_ocr(image: UploadFile = File(...)):
    # BharatVision uses surya-ocr and yolo from the vision folder
    # Implementation will use the run_full_pipeline logic
    return {
        "status": "success",
        "message": "OCR logic linked",
        "engine": "Surya/YOLOv8",
        "result": {
            "components": [],
            "connections": [],
            "compliance": "pending"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "VeriLog AI Multiservice", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
