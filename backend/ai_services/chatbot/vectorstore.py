"""Vector store adapter.

Routes calls to Supabase pgvector when reachable, or to a local NumPy-based
store otherwise. The selection is made once on import and can be forced via
the CHATBOT_USE_LOCAL_STORE=1 env var.

Local-mode rationale: lets the chatbot work fully offline / when Supabase is
unreachable or paused, which is essential for student laptops.
"""

from __future__ import annotations

import logging
import os
import socket
from functools import lru_cache
from typing import Any, Iterable
from urllib.parse import urlparse

from .config import (
    RAG_SIM_THRESHOLD,
    RAG_TOP_K,
    SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_KEY,
    SUPABASE_URL,
)
from . import local_store

log = logging.getLogger(__name__)


def _supabase_reachable() -> bool:
    """Cheap DNS check — avoids importing supabase if the host can't resolve."""
    try:
        host = urlparse(SUPABASE_URL).hostname
        if not host:
            return False
        socket.gethostbyname(host)
        return True
    except Exception as e:
        log.info("Supabase unreachable (%s) — using local vector store.", e)
        return False


_FORCE_LOCAL = os.getenv("CHATBOT_USE_LOCAL_STORE", "").lower() in ("1", "true", "yes")
USE_LOCAL = _FORCE_LOCAL or not _supabase_reachable()

if USE_LOCAL:
    log.info("Vector store mode: LOCAL (NumPy on disk)")
else:
    log.info("Vector store mode: SUPABASE (%s)", SUPABASE_URL)


# --- Supabase clients (only constructed when needed) -----------------------

@lru_cache(maxsize=1)
def _read_client():
    from supabase import create_client
    return create_client(SUPABASE_URL, SUPABASE_ANON_KEY)


@lru_cache(maxsize=1)
def _write_client():
    if not SUPABASE_SERVICE_KEY:
        raise RuntimeError(
            "SUPABASE_SERVICE_ROLE_KEY not set. Either set it, or run with "
            "CHATBOT_USE_LOCAL_STORE=1 to use the local on-disk store."
        )
    from supabase import create_client
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


# --- Public API ------------------------------------------------------------

def search(
    query_embedding: list[float],
    *,
    top_k: int = RAG_TOP_K,
    similarity_threshold: float = RAG_SIM_THRESHOLD,
) -> list[dict[str, Any]]:
    if USE_LOCAL:
        return local_store.search(
            query_embedding,
            top_k=top_k,
            similarity_threshold=similarity_threshold,
        )
    client = _read_client()
    resp = client.rpc(
        "match_chat_documents",
        {
            "query_embedding": query_embedding,
            "match_count": top_k,
            "similarity_threshold": similarity_threshold,
        },
    ).execute()
    return list(resp.data or [])


def upsert_chunks(rows: Iterable[dict[str, Any]]) -> int:
    rows = list(rows)
    if not rows:
        return 0
    if USE_LOCAL:
        return local_store.upsert_chunks(rows)
    client = _write_client()
    resp = (
        client.table("chat_documents")
        .upsert(rows, on_conflict="source_path,chunk_index")
        .execute()
    )
    return len(resp.data or rows)


def clear_source(source_path: str) -> int:
    if USE_LOCAL:
        return local_store.clear_source(source_path)
    client = _write_client()
    resp = client.table("chat_documents").delete().eq("source_path", source_path).execute()
    return len(resp.data or [])


def count_all() -> int:
    if USE_LOCAL:
        return local_store.count_all()
    client = _read_client()
    resp = client.table("chat_documents").select("id", count="exact").limit(1).execute()
    return resp.count or 0


def mode() -> str:
    return "local" if USE_LOCAL else "supabase"
