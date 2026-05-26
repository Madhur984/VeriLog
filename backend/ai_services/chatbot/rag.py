"""RAG orchestrator — query in, streamed answer + citations out.

Augments local vector-store retrieval with web sources (Wikipedia + DuckDuckGo)
so the bot knows things outside the curated KB.
"""

from __future__ import annotations

import asyncio
import logging
from typing import AsyncIterator

from .config import RAG_TOP_K, RAG_SIM_THRESHOLD, RAG_MAX_CONTEXT_CHARS
from .embeddings import embed_one
from .llm import chat_stream, OllamaUnavailable
from .prompts import RAG_SYSTEM, build_user_prompt
from .reranker import rerank
from .schemas import Citation
from .vectorstore import search
from .web_search import search_web

log = logging.getLogger(__name__)


def _trim_context(chunks: list[dict], max_chars: int = RAG_MAX_CONTEXT_CHARS) -> list[dict]:
    """Greedy: keep chunks until budget exhausted (highest similarity first)."""
    out, used = [], 0
    for c in chunks:
        if used + len(c["content"]) > max_chars and out:
            break
        out.append(c)
        used += len(c["content"])
    return out


def _to_citations(chunks: list[dict]) -> list[Citation]:
    out = []
    for c in chunks:
        snippet = c["content"][:280].replace("\n", " ").strip()
        if len(c["content"]) > 280:
            snippet += "…"
        out.append(
            Citation(
                title=c["title"],
                source=c["source"],
                source_path=c["source_path"],
                similarity=float(c["similarity"]),
                snippet=snippet,
            )
        )
    return out


async def answer_stream(
    question: str,
    *,
    history: list[dict] | None = None,
    top_k: int = RAG_TOP_K,
) -> AsyncIterator[dict]:
    """Yield events: {'type': 'citations'|'delta'|'done'|'error', ...}"""
    history = history or []

    # 1. Retrieve local + web in PARALLEL.
    try:
        q_vec = embed_one(question)
    except Exception as e:
        log.exception("embedding failed")
        yield {"type": "error", "error": f"Embedding failed: {e}"}
        return

    async def _local() -> list[dict]:
        # Over-fetch so the reranker has a useful candidate pool.
        return await asyncio.to_thread(
            search,
            q_vec,
            top_k=max(top_k * 4, 16),
            similarity_threshold=RAG_SIM_THRESHOLD,
        )

    try:
        local_candidates, web_chunks = await asyncio.gather(
            _local(),
            search_web(question),
            return_exceptions=False,
        )
    except Exception as e:
        log.exception("retrieval failed")
        yield {"type": "error", "error": f"Retrieval failed: {e}"}
        return

    # Rerank only local candidates (web chunks are coarse summaries; keep them).
    reranked_local = rerank(question, local_candidates, top_n=top_k)
    # Merge: web chunks first (high authority for definitions), then top local.
    merged = (web_chunks or []) + reranked_local
    chunks = _trim_context(merged)
    citations = _to_citations(chunks)
    yield {"type": "citations", "citations": [c.model_dump() for c in citations]}

    # 2. Generate.
    user_prompt = build_user_prompt(question, chunks)
    messages = [*history, {"role": "user", "content": user_prompt}]

    try:
        async for delta in chat_stream(messages, system=RAG_SYSTEM, temperature=0.3):
            yield {"type": "delta", "delta": delta}
    except OllamaUnavailable as e:
        yield {"type": "error", "error": str(e)}
        return
    except Exception as e:
        log.exception("generation failed")
        yield {"type": "error", "error": f"Generation failed: {e}"}
        return

    yield {"type": "done"}
