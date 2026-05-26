"""Tiny eval harness for the RAG pipeline.

Two metrics:
 1. Retrieval recall@k    — did the gold passage appear in top-k for the query?
 2. Substring grounding   — does the answer contain the gold keyword/phrase?

Curated test set lives below as GOLDSET. Add more cases over time — anything
the bot regresses on belongs here.

Usage:
    cd backend/ai_services
    python -m chatbot.eval                       # uses defaults
    python -m chatbot.eval --top-k 6 --json out.json
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
from dataclasses import dataclass, field
from typing import Any

from .embeddings import embed_one
from .rag import answer_stream
from .reranker import rerank
from .vectorstore import search


@dataclass
class EvalCase:
    """One question plus loose ground-truth signals.

    `must_contain_any` — answer should mention at least one of these strings
        (case-insensitive). Use to catch egregious wrong answers without an LLM judge.
    `should_retrieve_path_contains` — at least one retrieved chunk's source_path
        contains this substring. Use to verify retrieval is finding the right material.
    """

    question: str
    must_contain_any: list[str] = field(default_factory=list)
    should_retrieve_path_contains: list[str] = field(default_factory=list)


# Hand-curated. Expand freely.
GOLDSET: list[EvalCase] = [
    EvalCase(
        question="What is the characteristic equation of a JK flip-flop?",
        must_contain_any=["JQ'", "J Q'", "JQ' + K'Q", "J Q' + K' Q"],
        should_retrieve_path_contains=["sequential", "knowledge_base"],
    ),
    EvalCase(
        question="State DeMorgan's laws.",
        must_contain_any=["(A+B)' = A'B'", "(AB)' = A'+B'", "DeMorgan"],
        should_retrieve_path_contains=["combinational", "boolean", "knowledge_base"],
    ),
    EvalCase(
        question="What is the ripple factor of a full-wave bridge rectifier?",
        must_contain_any=["0.48", "0.482"],
        should_retrieve_path_contains=["diodes", "rectifier", "knowledge_base"],
    ),
    EvalCase(
        question="Give the small-signal transconductance of a BJT.",
        must_contain_any=["I_C / V_T", "I_C/V_T", "Ic/Vt", "g_m = I"],
        should_retrieve_path_contains=["transistors", "knowledge_base"],
    ),
    EvalCase(
        question="State the Nyquist sampling theorem.",
        must_contain_any=["2 f_m", "2f_m", "twice the maximum"],
        should_retrieve_path_contains=["signals", "knowledge_base"],
    ),
    EvalCase(
        question="What is the difference between blocking and non-blocking assignments in Verilog?",
        must_contain_any=["non-blocking", "<=", "scheduled"],
        should_retrieve_path_contains=["verilog", "hdl", "knowledge_base"],
    ),
    EvalCase(
        question="Inverting amplifier gain formula.",
        must_contain_any=["-R_f / R", "-Rf/Rin", "-R_f/R_{in}", "Rf"],
        should_retrieve_path_contains=["opamp", "knowledge_base"],
    ),
    EvalCase(
        question="Explain pipeline hazards in a 5-stage RISC pipeline.",
        must_contain_any=["structural", "data", "control", "RAW"],
        should_retrieve_path_contains=["computer_org", "knowledge_base"],
    ),
    EvalCase(
        question="How do you minimize a Boolean function using a 4-variable K-map?",
        must_contain_any=["prime implicant", "essential", "group", "K-map"],
        should_retrieve_path_contains=["combinational", "knowledge_base"],
    ),
    EvalCase(
        question="What is the formula for the oscillation frequency of a Wien-bridge oscillator?",
        must_contain_any=["1/(2", "1 / (2", "RC", "2 pi RC", "2π RC"],
        should_retrieve_path_contains=["opamp", "oscillator", "knowledge_base"],
    ),
]


async def _retrieve(question: str, top_k: int) -> list[dict[str, Any]]:
    vec = embed_one(question)
    candidates = search(vec, top_k=max(top_k * 4, 16), similarity_threshold=0.0)
    return rerank(question, candidates, top_n=top_k)


def _retrieval_hit(retrieved: list[dict[str, Any]], wants: list[str]) -> bool:
    if not wants:
        return True
    paths = [(r.get("source_path") or "").lower() for r in retrieved]
    return any(any(w.lower() in p for p in paths) for w in wants)


def _content_hit(answer: str, candidates: list[str]) -> bool:
    if not candidates:
        return True
    low = answer.lower()
    return any(c.lower() in low for c in candidates)


async def _full_answer(question: str) -> tuple[str, list[dict[str, Any]]]:
    text_parts = []
    citations: list[dict[str, Any]] = []
    async for evt in answer_stream(question, top_k=6):
        if evt["type"] == "citations":
            citations = evt["citations"]
        elif evt["type"] == "delta":
            text_parts.append(evt["delta"])
        elif evt["type"] == "error":
            text_parts.append(f"[error] {evt['error']}")
            break
    return "".join(text_parts), citations


async def run_eval(top_k: int = 6) -> dict[str, Any]:
    rows: list[dict[str, Any]] = []
    n_ret_ok = 0
    n_ans_ok = 0

    for case in GOLDSET:
        retrieved = await _retrieve(case.question, top_k)
        ret_ok = _retrieval_hit(retrieved, case.should_retrieve_path_contains)
        answer, _ = await _full_answer(case.question)
        ans_ok = _content_hit(answer, case.must_contain_any)
        if ret_ok:
            n_ret_ok += 1
        if ans_ok:
            n_ans_ok += 1
        rows.append({
            "question": case.question,
            "retrieval_ok": ret_ok,
            "retrieval_top_paths": [r.get("source_path") for r in retrieved[:3]],
            "answer_ok": ans_ok,
            "answer_preview": answer[:200],
        })

    total = len(GOLDSET) or 1
    summary = {
        "total_cases": len(GOLDSET),
        "retrieval_hit_rate": round(n_ret_ok / total, 3),
        "answer_grounding_rate": round(n_ans_ok / total, 3),
        "cases": rows,
    }
    return summary


def _main() -> None:
    p = argparse.ArgumentParser(description="Run RAG eval over GOLDSET.")
    p.add_argument("--top-k", type=int, default=6)
    p.add_argument("--json", help="Write full result JSON to this file")
    args = p.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
    summary = asyncio.run(run_eval(top_k=args.top_k))

    print(f"\n== RAG eval ==")
    print(f"  retrieval hit rate : {summary['retrieval_hit_rate']:.0%}")
    print(f"  answer grounding   : {summary['answer_grounding_rate']:.0%}")
    print(f"  cases              : {summary['total_cases']}")
    fails_r = [c for c in summary["cases"] if not c["retrieval_ok"]]
    fails_a = [c for c in summary["cases"] if not c["answer_ok"]]
    if fails_r:
        print(f"\nRetrieval misses ({len(fails_r)}):")
        for c in fails_r:
            print(f"  ✗ {c['question']} (got: {c['retrieval_top_paths']})")
    if fails_a:
        print(f"\nAnswer misses ({len(fails_a)}):")
        for c in fails_a:
            print(f"  ✗ {c['question']}\n     {c['answer_preview']!r}")

    if args.json:
        with open(args.json, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2)
        print(f"\nFull report → {args.json}")


if __name__ == "__main__":
    _main()
