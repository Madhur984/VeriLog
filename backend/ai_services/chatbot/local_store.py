"""Local-disk vector store. Pure NumPy — no FAISS/Chroma dep needed.

Persists chunks as a single .npz (embeddings) + .jsonl (metadata) in
backend/ai_services/chatbot/local_store_data/. Fast cosine search up to
~50k chunks on a laptop. Activated automatically when Supabase is unreachable
or CHATBOT_USE_LOCAL_STORE=1.
"""

from __future__ import annotations

import json
import logging
import threading
from pathlib import Path
from typing import Any, Iterable

import numpy as np

from .config import AI_SERVICES_DIR

log = logging.getLogger(__name__)

DATA_DIR = Path(__file__).resolve().parent / "local_store_data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
META_PATH = DATA_DIR / "chunks.jsonl"
EMB_PATH = DATA_DIR / "embeddings.npy"
INDEX_PATH = DATA_DIR / "index.json"   # source_path → list of row indices

_lock = threading.Lock()
_state: dict[str, Any] | None = None


def _empty_state() -> dict[str, Any]:
    return {
        "embeddings": np.zeros((0, 384), dtype=np.float32),
        "rows": [],          # list[dict] mirroring DB columns
        "by_path": {},       # source_path → list[int] row indices
    }


def _load() -> dict[str, Any]:
    global _state
    if _state is not None:
        return _state
    state = _empty_state()
    if EMB_PATH.exists() and META_PATH.exists():
        try:
            embs = np.load(EMB_PATH)
            rows = [json.loads(line) for line in META_PATH.read_text(encoding="utf-8").splitlines() if line]
            if embs.shape[0] == len(rows):
                state["embeddings"] = embs.astype(np.float32, copy=False)
                state["rows"] = rows
                state["by_path"] = {}
                for i, r in enumerate(rows):
                    state["by_path"].setdefault(r["source_path"], []).append(i)
                log.info("local_store: loaded %d rows", len(rows))
            else:
                log.warning("local_store: row count mismatch — starting fresh")
        except Exception as e:
            log.warning("local_store: load failed (%s) — starting fresh", e)
    _state = state
    return state


def _save(state: dict[str, Any]) -> None:
    np.save(EMB_PATH, state["embeddings"])
    with META_PATH.open("w", encoding="utf-8") as f:
        for r in state["rows"]:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    # Rebuild reverse index from rows so it stays in sync.
    idx: dict[str, list[int]] = {}
    for i, r in enumerate(state["rows"]):
        idx.setdefault(r["source_path"], []).append(i)
    state["by_path"] = idx
    INDEX_PATH.write_text(json.dumps({"row_count": len(state["rows"])}, indent=2), encoding="utf-8")


def upsert_chunks(rows: Iterable[dict[str, Any]]) -> int:
    rows = list(rows)
    if not rows:
        return 0
    with _lock:
        state = _load()
        # Remove existing rows for any (source_path, chunk_index) being replaced.
        new_keys = {(r["source_path"], r["chunk_index"]) for r in rows}
        keep = [
            (i, r) for i, r in enumerate(state["rows"])
            if (r["source_path"], r["chunk_index"]) not in new_keys
        ]
        kept_indices = [i for i, _ in keep]
        kept_rows = [r for _, r in keep]
        kept_embs = state["embeddings"][kept_indices] if kept_indices else np.zeros((0, 384), dtype=np.float32)

        new_embs = np.asarray([r["embedding"] for r in rows], dtype=np.float32)
        merged_rows = kept_rows + [
            {k: v for k, v in r.items() if k != "embedding"} for r in rows
        ]
        merged_embs = np.vstack([kept_embs, new_embs]) if kept_embs.size else new_embs

        state["embeddings"] = merged_embs
        state["rows"] = merged_rows
        _save(state)
        return len(rows)


def clear_source(source_path: str) -> int:
    with _lock:
        state = _load()
        before = len(state["rows"])
        keep = [
            (i, r) for i, r in enumerate(state["rows"])
            if r["source_path"] != source_path
        ]
        if len(keep) == before:
            return 0
        kept_indices = [i for i, _ in keep]
        state["embeddings"] = state["embeddings"][kept_indices] if kept_indices else np.zeros((0, 384), dtype=np.float32)
        state["rows"] = [r for _, r in keep]
        _save(state)
        return before - len(state["rows"])


def count_all() -> int:
    state = _load()
    return len(state["rows"])


def search(
    query_embedding: list[float],
    *,
    top_k: int = 6,
    similarity_threshold: float = 0.0,
) -> list[dict[str, Any]]:
    state = _load()
    if not state["rows"]:
        return []
    q = np.asarray(query_embedding, dtype=np.float32)
    # Embeddings are already L2-normalized by sentence-transformers.
    sims = state["embeddings"] @ q
    # Top-k via argpartition for speed on large stores.
    k = min(top_k, sims.shape[0])
    if k <= 0:
        return []
    idx = np.argpartition(-sims, k - 1)[:k]
    idx = idx[np.argsort(-sims[idx])]

    out: list[dict[str, Any]] = []
    for i in idx:
        s = float(sims[i])
        if s < similarity_threshold:
            continue
        row = state["rows"][int(i)]
        out.append({
            "id": int(i),
            "source": row.get("source", ""),
            "source_path": row.get("source_path", ""),
            "title": row.get("title", ""),
            "chunk_index": row.get("chunk_index", 0),
            "content": row.get("content", ""),
            "similarity": s,
            "metadata": row.get("metadata", {}),
        })
    return out
