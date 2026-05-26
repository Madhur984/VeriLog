"""Synthetic Q/A dataset generator.

For each ingested chunk, ask the local LLM to produce 1-3 Q/A pairs grounded
strictly in that chunk. Output is JSONL — one record per line — ready to
ingest into HuggingFace `datasets`, axolotl, unsloth, or torchtune for LoRA
fine-tuning later.

Usage:
    cd backend/ai_services
    python -m chatbot.dataset --out training_data/electronics_qa.jsonl
    python -m chatbot.dataset --out ... --limit 200       # sample for speed
    python -m chatbot.dataset --out ... --source markdown # one source kind only

Each record looks like:
    {
      "messages": [
        {"role": "system",    "content": "..."},
        {"role": "user",      "content": "Q ..."},
        {"role": "assistant", "content": "A ..."}
      ],
      "source_path": "...",
      "chunk_index": 0
    }
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import random
import re
from pathlib import Path
from typing import Any

from .config import SUPABASE_URL, SUPABASE_ANON_KEY
from .llm import chat_complete, OllamaUnavailable
from .prompts import RAG_SYSTEM, DATASET_SYSTEM
from .vectorstore import _read_client

log = logging.getLogger(__name__)


# The DATASET_SYSTEM prompt now lives in chatbot.prompts so it stays in sync
# with the ELI5 tutor style we serve at inference. Re-exported here for any
# external script that imports it from this module.
__all__ = ["DATASET_SYSTEM", "generate"]


def _build_dataset_prompt(passage: str, source: str) -> str:
    return (
        f"Source: {source}\n\n"
        f"Passage:\n```\n{passage}\n```\n\n"
        "Produce the JSON now."
    )


def _strip_fences(s: str) -> str:
    s = s.strip()
    s = re.sub(r"^```(?:json)?\s*", "", s)
    s = re.sub(r"\s*```$", "", s)
    return s.strip()


async def _pairs_for_chunk(chunk: dict[str, Any]) -> list[dict[str, str]]:
    prompt = _build_dataset_prompt(chunk["content"], chunk["title"])
    try:
        raw = await chat_complete(
            [{"role": "user", "content": prompt}],
            system=DATASET_SYSTEM,
            temperature=0.5,
            json_only=True,
        )
    except OllamaUnavailable as e:
        raise RuntimeError(str(e)) from e
    except Exception as e:
        log.warning("LLM call failed for %s#%s: %s", chunk["title"], chunk["chunk_index"], e)
        return []

    text = _strip_fences(raw)
    try:
        obj = json.loads(text)
    except json.JSONDecodeError:
        return []
    pairs = obj.get("pairs") or []
    out = []
    for p in pairs:
        q = (p.get("q") or "").strip()
        a = (p.get("a") or "").strip()
        if len(q) >= 8 and len(a) >= 30:
            out.append({"q": q, "a": a})
    return out


async def generate(
    out_path: Path,
    *,
    limit: int | None = None,
    source_filter: str | None = None,
    shuffle: bool = True,
) -> dict[str, Any]:
    client = _read_client()
    # Stream all rows in pages (Supabase REST caps at 1000 per request).
    rows: list[dict[str, Any]] = []
    page = 0
    page_size = 500
    while True:
        q = (
            client.table("chat_documents")
            .select("id, source, source_path, title, chunk_index, content, token_count")
            .order("id")
            .range(page * page_size, page * page_size + page_size - 1)
        )
        if source_filter:
            q = q.eq("source", source_filter)
        resp = q.execute()
        batch = resp.data or []
        if not batch:
            break
        rows.extend(batch)
        if len(batch) < page_size:
            break
        page += 1

    if shuffle:
        random.shuffle(rows)
    if limit:
        rows = rows[:limit]

    log.info("Generating Q/A for %d chunks → %s", len(rows), out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    n_pairs = 0
    n_chunks_with_pairs = 0
    with out_path.open("w", encoding="utf-8") as f:
        for i, chunk in enumerate(rows, 1):
            pairs = await _pairs_for_chunk(chunk)
            if not pairs:
                continue
            n_chunks_with_pairs += 1
            for p in pairs:
                record = {
                    "messages": [
                        {"role": "system", "content": RAG_SYSTEM},
                        {"role": "user", "content": p["q"]},
                        {"role": "assistant", "content": p["a"]},
                    ],
                    "source_path": chunk["source_path"],
                    "chunk_index": chunk["chunk_index"],
                }
                f.write(json.dumps(record, ensure_ascii=False) + "\n")
                n_pairs += 1
            if i % 10 == 0:
                log.info("[%d/%d] %d pairs so far", i, len(rows), n_pairs)

    return {
        "out": str(out_path),
        "chunks_seen": len(rows),
        "chunks_with_pairs": n_chunks_with_pairs,
        "total_pairs": n_pairs,
    }


def _main() -> None:
    p = argparse.ArgumentParser(description="Generate synthetic Q/A from ingested chunks.")
    p.add_argument("--out", required=True, type=Path, help="Output JSONL path")
    p.add_argument("--limit", type=int, help="Only process the first N (shuffled) chunks")
    p.add_argument("--source", choices=["markdown", "pdf", "scene", "manual"],
                   help="Filter to this source kind only")
    p.add_argument("--no-shuffle", action="store_true")
    args = p.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
    summary = asyncio.run(
        generate(
            args.out,
            limit=args.limit,
            source_filter=args.source,
            shuffle=not args.no_shuffle,
        )
    )
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    _main()
