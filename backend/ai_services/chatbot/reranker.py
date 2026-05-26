"""Cross-encoder reranker.

Bi-encoder retrieval (the embedding search) is fast but coarse — it scores
query and document independently. A cross-encoder scores them JOINTLY and is
much more accurate, at the cost of one inference per pair.

Standard pipeline: retrieve top-K (large, e.g. 24) with the bi-encoder, then
rerank to top-N (small, e.g. 6) with the cross-encoder.

Model: cross-encoder/ms-marco-MiniLM-L-6-v2 (~80 MB, ~1ms/pair on CPU).
"""

from __future__ import annotations

import logging
import os
from functools import lru_cache
from typing import Any

log = logging.getLogger(__name__)

RERANKER_MODEL = os.getenv("RERANKER_MODEL", "cross-encoder/ms-marco-MiniLM-L-6-v2")
RERANKER_ENABLED = os.getenv("RERANKER_ENABLED", "1") not in ("0", "false", "False", "")


@lru_cache(maxsize=1)
def _model():
    if not RERANKER_ENABLED:
        return None
    try:
        from sentence_transformers import CrossEncoder

        log.info("Loading reranker %s …", RERANKER_MODEL)
        return CrossEncoder(RERANKER_MODEL)
    except Exception as e:
        log.warning("Reranker unavailable (%s) — falling back to bi-encoder scores.", e)
        return None


def rerank(
    query: str,
    chunks: list[dict[str, Any]],
    top_n: int,
) -> list[dict[str, Any]]:
    """Return top_n chunks ordered by cross-encoder score (descending).

    Each chunk keeps its original fields; a new 'rerank_score' is added
    and the chunk's 'similarity' is overwritten with the normalized rerank
    score (so downstream UI shows a sensible relevance number).
    """
    if not chunks:
        return []
    m = _model()
    if m is None:
        return chunks[:top_n]

    pairs = [(query, c["content"]) for c in chunks]
    try:
        scores = m.predict(pairs, show_progress_bar=False)
    except Exception as e:
        log.warning("rerank failed: %s — using bi-encoder order", e)
        return chunks[:top_n]

    scored = [
        {**c, "rerank_score": float(s)} for c, s in zip(chunks, scores)
    ]
    scored.sort(key=lambda c: c["rerank_score"], reverse=True)
    top = scored[:top_n]

    # Normalize rerank score to [0,1] across the returned set so UI bars make sense.
    if top:
        mx = max(c["rerank_score"] for c in top)
        mn = min(c["rerank_score"] for c in top)
        span = (mx - mn) or 1.0
        for c in top:
            c["similarity"] = (c["rerank_score"] - mn) / span
    return top
