"""Centralized config — every knob read from env so we don't hardcode keys."""

from __future__ import annotations

import os
from pathlib import Path

# --- Paths -----------------------------------------------------------------

CHATBOT_DIR = Path(__file__).resolve().parent
AI_SERVICES_DIR = CHATBOT_DIR.parent
BACKEND_DIR = AI_SERVICES_DIR.parent
PROJECT_ROOT = BACKEND_DIR.parent

# Where rendered videos land + where the React app can fetch them from.
VIDEO_OUTPUT_DIR = Path(os.getenv("CHATBOT_VIDEO_DIR", AI_SERVICES_DIR / "chatbot_videos"))
VIDEO_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Where the user cloned ReelVideoMaker. Set this in .env.
REELVIDEOMAKER_PATH = Path(os.getenv("REELVIDEOMAKER_PATH", PROJECT_ROOT.parent / "ReelVideoMaker"))

# Default content sources to ingest (relative to project root). Glob patterns.
INGEST_GLOBS = [
    "Digital_Electronics_Basics.pdf",
    "mds/**/*.md",
    "docs/**/*.md",
    "README.md",
    "backend/ai_services/chatbot/knowledge_base/**/*.md",
    "frontend/src/components/level1/**/lessons/**/*.ts",
    "frontend/src/components/level1/**/lessons/**/*.tsx",
    "frontend/src/data/**/*.ts",
]

# --- Supabase --------------------------------------------------------------

SUPABASE_URL = os.getenv(
    "SUPABASE_URL",
    "https://uhtfagdxxvasbtagovwk.supabase.co",
)
# Service role required for inserts. Anon key is fine for reads via RPC.
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_ANON_KEY = os.getenv(
    "SUPABASE_ANON_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVodGZhZ2R4eHZhc2J0YWdvdndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzE5NDQsImV4cCI6MjA4NjY0Nzk0NH0.yfdtJG1aNziJaoteQwXzrQ-V_cnFC-IopGbs0Lt3nn0",
)

# --- LLM (local via HuggingFace transformers) ------------------------------
# In-process inference. Model auto-downloads on first run.

HF_MODEL_ID = os.getenv("HF_MODEL_ID", "Qwen/Qwen2.5-1.5B-Instruct")
HF_MODEL_DTYPE = os.getenv("HF_MODEL_DTYPE", "auto")          # auto|fp16|bf16|fp32
HF_DEVICE_PREFERENCE = os.getenv("HF_DEVICE_PREFERENCE", "auto")  # auto|cuda|cpu
# Lower default than before — 256 tokens ≈ 180 words, enough for a tutoring answer.
# Override with HF_MAX_NEW_TOKENS env var if you want longer replies.
HF_MAX_NEW_TOKENS = int(os.getenv("HF_MAX_NEW_TOKENS", "256"))
# Greedy decoding (do_sample=False) is faster on CPU and more deterministic for
# factual Q&A. Set HF_DO_SAMPLE=1 to re-enable sampling.
HF_DO_SAMPLE = os.getenv("HF_DO_SAMPLE", "0") in ("1", "true", "True")
# Warm the model at server startup so the first chat doesn't pay the load cost.
HF_EAGER_LOAD = os.getenv("HF_EAGER_LOAD", "1") in ("1", "true", "True")

# Where train_lora.py writes the adapter. llm.py auto-loads it on top of the base model if present.
LORA_ADAPTER_DIR = Path(os.getenv("LORA_ADAPTER_DIR", CHATBOT_DIR / "lora_adapter"))

# Backwards-compat shim — storyboard.py used to read OLLAMA_STORYBOARD_MODEL.
OLLAMA_STORYBOARD_MODEL = HF_MODEL_ID  # ignored at runtime; kept so imports don't break

# --- Embeddings ------------------------------------------------------------

EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
EMBEDDING_DIM = 384  # must match SQL column dimension

# --- Chunking --------------------------------------------------------------

CHUNK_SIZE_TOKENS = int(os.getenv("CHUNK_SIZE_TOKENS", "400"))
CHUNK_OVERLAP_TOKENS = int(os.getenv("CHUNK_OVERLAP_TOKENS", "60"))

# --- RAG -------------------------------------------------------------------

# Lower top_k = smaller prompt = faster first-token latency on CPU.
# Reranker still over-fetches internally; this caps the chunks INCLUDED in
# the LLM context, not what's searched.
RAG_TOP_K = int(os.getenv("RAG_TOP_K", "3"))
RAG_SIM_THRESHOLD = float(os.getenv("RAG_SIM_THRESHOLD", "0.15"))
RAG_MAX_CONTEXT_CHARS = int(os.getenv("RAG_MAX_CONTEXT_CHARS", "3000"))
