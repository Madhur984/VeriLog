"""Local embedding model wrapper. No API calls."""

from __future__ import annotations

import logging
from functools import lru_cache
from typing import Iterable

import numpy as np

from .config import EMBEDDING_MODEL, EMBEDDING_DIM

log = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def _model():
    """Lazily load sentence-transformers. Cached for process lifetime."""
    from sentence_transformers import SentenceTransformer  # heavy import, defer

    log.info("Loading embedding model %s …", EMBEDDING_MODEL)
    m = SentenceTransformer(EMBEDDING_MODEL)
    dim = m.get_sentence_embedding_dimension()
    if dim != EMBEDDING_DIM:
        raise RuntimeError(
            f"Embedding model dim mismatch: model={dim} expected={EMBEDDING_DIM}. "
            "Re-run the SQL migration with the correct vector(N) size."
        )
    return m


def embed_one(text: str) -> list[float]:
    vec = _model().encode(text, normalize_embeddings=True, show_progress_bar=False)
    return np.asarray(vec, dtype=np.float32).tolist()


def embed_many(texts: Iterable[str], batch_size: int = 32) -> list[list[float]]:
    texts = list(texts)
    if not texts:
        return []
    arr = _model().encode(
        texts,
        normalize_embeddings=True,
        show_progress_bar=False,
        batch_size=batch_size,
    )
    return [np.asarray(v, dtype=np.float32).tolist() for v in arr]
