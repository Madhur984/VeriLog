"""Index project content into Supabase pgvector.

Run from the repo root:
    cd backend/ai_services
    python -m chatbot.ingest

Or via the HTTP route POST /ai/chat/ingest (returns IngestSummary).

This walks INGEST_GLOBS in config, reads each file (with handlers per type),
chunks the text, embeds, and upserts. Idempotent — re-running updates rows
keyed by (source_path, chunk_index).
"""

from __future__ import annotations

import asyncio
import logging
import re
import time
from pathlib import Path
from typing import Iterable

from .config import INGEST_GLOBS, PROJECT_ROOT
from .chunker import chunk_text
from .embeddings import embed_many
from .schemas import IngestSummary
from .vectorstore import upsert_chunks

log = logging.getLogger(__name__)


# --- File readers ----------------------------------------------------------

def _read_markdown(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def _read_pdf(path: Path) -> str:
    try:
        from pypdf import PdfReader
    except ImportError as e:
        raise RuntimeError("pypdf not installed. pip install pypdf") from e
    reader = PdfReader(str(path))
    pages = []
    for i, page in enumerate(reader.pages):
        try:
            text = page.extract_text() or ""
        except Exception:
            text = ""
        if text.strip():
            pages.append(f"## Page {i + 1}\n\n{text}")
    return "\n\n".join(pages)


_LESSON_FIELDS = ("title", "heading", "subtitle", "narration", "explanation",
                  "description", "body", "summary", "lesson", "text", "content",
                  "caption", "label")


def _read_lesson_ts(path: Path) -> str:
    """Pull human-readable strings out of TypeScript lesson files.

    The DSD/BE lesson modules export const arrays of scene objects with prose
    fields. We extract those strings rather than ship raw TS source through
    the embedder.
    """
    src = path.read_text(encoding="utf-8", errors="ignore")
    chunks: list[str] = []

    # Match `field: "...."` or `field: \`....\`` for the field names above.
    for field in _LESSON_FIELDS:
        pattern = rf'\b{field}\s*:\s*(?P<quote>[`"\'])((?:\\.|(?!(?P=quote)).)*?)(?P=quote)'
        for m in re.finditer(pattern, src, flags=re.DOTALL):
            text = m.group(2)
            # Unescape common sequences.
            text = (
                text.replace("\\n", "\n")
                .replace("\\t", "  ")
                .replace('\\"', '"')
                .replace("\\'", "'")
                .replace("\\`", "`")
            )
            text = text.strip()
            if len(text) >= 30:  # skip 1-word labels
                chunks.append(text)

    return "\n\n".join(chunks)


def _title_for(path: Path) -> str:
    rel = path.relative_to(PROJECT_ROOT)
    return str(rel).replace("\\", "/")


def _source_kind(path: Path) -> str:
    suf = path.suffix.lower()
    if suf == ".pdf":
        return "pdf"
    if suf == ".md":
        return "markdown"
    if suf in (".ts", ".tsx"):
        return "scene"
    return "other"


def _read_any(path: Path) -> str:
    suf = path.suffix.lower()
    if suf == ".pdf":
        return _read_pdf(path)
    if suf == ".md":
        return _read_markdown(path)
    if suf in (".ts", ".tsx"):
        return _read_lesson_ts(path)
    return path.read_text(encoding="utf-8", errors="ignore")


# --- Pipeline --------------------------------------------------------------

def _iter_targets(globs: Iterable[str]) -> list[Path]:
    seen: set[Path] = set()
    out: list[Path] = []
    for g in globs:
        for p in PROJECT_ROOT.glob(g):
            if p.is_file() and p not in seen:
                seen.add(p)
                out.append(p)
    return out


def ingest_all(globs: Iterable[str] | None = None) -> IngestSummary:
    started = time.time()
    targets = _iter_targets(globs or INGEST_GLOBS)
    log.info("Ingest targets: %d files", len(targets))

    by_source: dict[str, int] = {}
    skipped: list[str] = []
    total_chunks = 0

    for path in targets:
        rel = _title_for(path)
        kind = _source_kind(path)
        try:
            text = _read_any(path)
        except Exception as e:
            log.warning("read failed: %s — %s", rel, e)
            skipped.append(f"{rel} ({e})")
            continue

        if not text or len(text.strip()) < 100:
            skipped.append(f"{rel} (empty/too small)")
            continue

        chunks = chunk_text(text)
        if not chunks:
            skipped.append(f"{rel} (no chunks)")
            continue

        embeddings = embed_many([c["content"] for c in chunks])

        rows = [
            {
                "source": kind,
                "source_path": rel,
                "title": rel,
                "chunk_index": i,
                "content": c["content"],
                "token_count": c["token_count"],
                "embedding": embeddings[i],
                "metadata": {"chars": len(c["content"])},
            }
            for i, c in enumerate(chunks)
        ]

        written = upsert_chunks(rows)
        by_source[kind] = by_source.get(kind, 0) + written
        total_chunks += written
        log.info("ingested %s — %d chunks", rel, written)

    summary = IngestSummary(
        total_files=len(targets) - len(skipped),
        total_chunks=total_chunks,
        by_source=by_source,
        skipped=skipped,
        duration_seconds=round(time.time() - started, 2),
    )
    log.info("Ingest done: %s", summary.model_dump())
    return summary


async def ingest_all_async() -> IngestSummary:
    return await asyncio.to_thread(ingest_all)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
    summary = ingest_all()
    print(summary.model_dump_json(indent=2))
