from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import sys
import logging

# Add sub-folders to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "voice"))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "vision"))

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s %(message)s")
log = logging.getLogger("ai_services")

app = FastAPI(title="VeriLog AI Multiservice")

# Permissive CORS for local dev — frontend on :5173, express on :3000.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# --- Voice Deepfake Detection (AuralShield) ---
# Best-effort: don't let an optional service break the whole API.
try:
    from voice.main import app as voice_app  # noqa: F401

    @app.post("/ai/voice/predict")
    async def predict_voice(data: dict):
        return {"status": "success", "message": "Voice detection logic linked",
                "details": "AuralShield engine ready"}
    log.info("[voice] mounted")
except Exception as e:
    log.warning("[voice] not mounted: %s", e)


# --- Vision & OCR (BharatVision) ---
# Lazy registration so a missing UploadFile dep or missing model doesn't crash startup.
try:
    from fastapi import UploadFile, File

    @app.post("/ai/vision/ocr")
    async def process_ocr(image: UploadFile = File(...)):
        return {
            "status": "success",
            "message": "OCR logic linked",
            "engine": "Surya/YOLOv8",
            "result": {"components": [], "connections": [], "compliance": "pending"},
        }
    log.info("[vision] mounted")
except Exception as e:
    log.warning("[vision] not mounted: %s", e)


# --- VeriQuest Tutor (RAG chatbot + video) ---
try:
    from chatbot import router as chatbot_router
    app.include_router(chatbot_router)
    log.info("[chatbot] mounted at /ai/chat")

    # Eager-load the LLM at startup so the first user chat doesn't pay the
    # ~30-90s load cost. Runs in a background thread; server stays responsive.
    from chatbot.config import HF_EAGER_LOAD

    if HF_EAGER_LOAD:
        import threading

        def _warm_llm():
            try:
                from chatbot.llm import _load_model_and_tokenizer
                _load_model_and_tokenizer()
                log.info("[chatbot] LLM warm-loaded")
            except Exception as warm_err:
                log.warning("[chatbot] LLM warm-load failed (will retry on first call): %s",
                            warm_err)

        threading.Thread(target=_warm_llm, daemon=True, name="warm-llm").start()
except Exception as e:
    log.error("[chatbot] FAILED TO MOUNT: %s", e, exc_info=True)


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "VeriLog AI Multiservice", "version": "1.1.0"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
