"""Token-aware text chunking.

We avoid a heavyweight tokenizer dependency — approximate 1 token ≈ 4 chars
(true for English ~within ±15%). That's plenty accurate for retrieval chunking.
"""

from __future__ import annotations

import re
from typing import Iterable

from .config import CHUNK_SIZE_TOKENS, CHUNK_OVERLAP_TOKENS

_APPROX_CHARS_PER_TOKEN = 4


def _approx_token_count(text: str) -> int:
    return max(1, len(text) // _APPROX_CHARS_PER_TOKEN)


def _split_paragraphs(text: str) -> list[str]:
    parts = re.split(r"\n\s*\n", text)
    return [p.strip() for p in parts if p.strip()]


def chunk_text(
    text: str,
    *,
    size_tokens: int = CHUNK_SIZE_TOKENS,
    overlap_tokens: int = CHUNK_OVERLAP_TOKENS,
) -> list[dict]:
    """Return [{content, token_count}] split on paragraph boundaries with overlap."""
    size_chars = size_tokens * _APPROX_CHARS_PER_TOKEN
    overlap_chars = overlap_tokens * _APPROX_CHARS_PER_TOKEN

    paragraphs = _split_paragraphs(text)
    if not paragraphs:
        return []

    chunks: list[dict] = []
    buf = ""
    for p in paragraphs:
        if len(buf) + len(p) + 2 <= size_chars or not buf:
            buf = f"{buf}\n\n{p}".strip() if buf else p
            continue
        chunks.append({"content": buf, "token_count": _approx_token_count(buf)})
        tail = buf[-overlap_chars:] if overlap_chars else ""
        buf = f"{tail}\n\n{p}".strip()

    if buf:
        chunks.append({"content": buf, "token_count": _approx_token_count(buf)})

    # Split any remaining oversized chunk on character boundary as a safety net.
    final: list[dict] = []
    for c in chunks:
        if len(c["content"]) <= size_chars * 1.5:
            final.append(c)
            continue
        s = c["content"]
        for i in range(0, len(s), size_chars - overlap_chars):
            piece = s[i : i + size_chars]
            if piece.strip():
                final.append({"content": piece, "token_count": _approx_token_count(piece)})
    return final
