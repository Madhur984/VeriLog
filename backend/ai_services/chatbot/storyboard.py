"""LLM-driven storyboard generation, with deterministic validator + repair pass.

Produces JSON matching tutorial_gen's schema, using ONLY the local Ollama model.
Skips ReelVideoMaker's built-in Claude step entirely.
"""

from __future__ import annotations

import json
import logging
import re
from typing import Any

from .config import OLLAMA_STORYBOARD_MODEL
from .embeddings import embed_one
from .llm import chat_complete, OllamaUnavailable
from .prompts import STORYBOARD_SYSTEM, build_storyboard_user
from .vectorstore import search

log = logging.getLogger(__name__)


_VALID_TYPES = {"title", "bullets", "code", "math", "diagram", "image"}


def _strip_fences(s: str) -> str:
    s = s.strip()
    s = re.sub(r"^```(?:json)?\s*", "", s)
    s = re.sub(r"\s*```$", "", s)
    return s.strip()


def _try_parse(text: str) -> dict[str, Any] | None:
    text = _strip_fences(text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # Salvage: take the largest {...} substring.
    m = re.search(r"\{.*\}", text, flags=re.DOTALL)
    if not m:
        return None
    try:
        return json.loads(m.group(0))
    except json.JSONDecodeError:
        return None


def _validate(sb: dict[str, Any]) -> tuple[bool, str]:
    if not isinstance(sb, dict):
        return False, "root is not an object"
    if "title" not in sb or not isinstance(sb["title"], str):
        return False, "missing or invalid 'title'"
    slides = sb.get("slides")
    if not isinstance(slides, list) or not slides:
        return False, "missing or empty 'slides'"
    if not (3 <= len(slides) <= 12):
        return False, f"slide count {len(slides)} outside [3,12]"

    for i, s in enumerate(slides):
        if not isinstance(s, dict):
            return False, f"slide {i} is not an object"
        t = s.get("type")
        if t not in _VALID_TYPES:
            return False, f"slide {i} has invalid type {t!r}"
        if not isinstance(s.get("narration", ""), str) or len(s.get("narration", "")) < 10:
            return False, f"slide {i} missing/short narration"
        if t == "bullets" and (not isinstance(s.get("bullets"), list) or not s["bullets"]):
            return False, f"slide {i} (bullets) needs non-empty 'bullets' array"
        if t == "code" and not s.get("code"):
            return False, f"slide {i} (code) needs 'code'"
        if t == "math" and not s.get("math"):
            return False, f"slide {i} (math) needs 'math'"
        if t == "diagram" and not s.get("mermaid"):
            return False, f"slide {i} (diagram) needs 'mermaid'"

    if slides[0].get("type") != "title":
        return False, "first slide must be type 'title'"
    return True, ""


def _fallback_storyboard(topic: str, grounding: str | None = None) -> dict[str, Any]:
    """If the LLM keeps producing invalid JSON, ship a templated 6-slide deck
    so the pipeline still produces a video."""
    intro = (
        grounding[:400].replace("\n", " ").strip()
        if grounding
        else f"This short tutorial introduces {topic} for B.Tech electronics students."
    )
    return {
        "title": topic,
        "slides": [
            {
                "type": "title",
                "title": topic,
                "subtitle": "B.Tech Electronics — quick tutorial",
                "narration": intro[:280],
            },
            {
                "type": "bullets",
                "title": "What you will learn",
                "bullets": [
                    f"Core idea behind {topic}",
                    "Why it matters in digital systems",
                    "A worked example",
                    "Common student mistakes",
                ],
                "narration": (
                    f"In the next few minutes we cover the core idea of {topic}, "
                    "where it shows up in real digital systems, a worked example, "
                    "and the mistakes students most often make."
                ),
            },
            {
                "type": "bullets",
                "title": "Core idea",
                "bullets": [
                    "Definition in one line",
                    "Inputs and outputs",
                    "Behavior in steady state",
                    "Behavior on transition",
                ],
                "narration": (
                    f"At its core, {topic} can be described by its inputs, its outputs, "
                    "and how its outputs respond when the inputs change. Keep that mental "
                    "model in mind."
                ),
            },
            {
                "type": "math",
                "title": "Governing relation",
                "math": "Y = f(X_1, X_2, \\dots, X_n)",
                "narration": (
                    "We can write the relationship as Y equals f of the inputs. "
                    "The exact form of f is what makes one component different from another."
                ),
            },
            {
                "type": "diagram",
                "title": "Where it sits",
                "mermaid": (
                    "flowchart LR\n"
                    "  In[Inputs] --> Block[" + topic.replace('"', "") + "]\n"
                    "  Block --> Out[Output]\n"
                    "  Clk[Clock?] -. optional .-> Block"
                ),
                "narration": (
                    "Here is where this component sits in a typical datapath. "
                    "Inputs feed in, the block transforms them, and the output drives the next stage."
                ),
            },
            {
                "type": "title",
                "title": "Next step",
                "subtitle": "Try it in the VeriQuest sandbox",
                "narration": (
                    "Open the VeriQuest sandbox, drop this component on the workbench, "
                    "and probe its behavior. Hands-on always beats passive watching."
                ),
            },
        ],
    }


def _grounding_for(topic: str, max_chars: int = 1800) -> str:
    """Pull a few RAG chunks so the storyboard cites project material when possible."""
    try:
        vec = embed_one(topic)
        rows = search(vec, top_k=4, similarity_threshold=0.15)
    except Exception:
        return ""
    chunks = []
    used = 0
    for r in rows:
        c = r["content"]
        if used + len(c) > max_chars and chunks:
            break
        chunks.append(c)
        used += len(c)
    return "\n\n---\n\n".join(chunks)


async def generate_storyboard(
    topic: str,
    *,
    answer_hint: str | None = None,
    max_attempts: int = 2,
) -> dict[str, Any]:
    grounding = _grounding_for(topic)
    if answer_hint:
        grounding = (answer_hint + "\n\n" + grounding) if grounding else answer_hint

    user = build_storyboard_user(topic, grounding=grounding or None)
    last_err = ""

    for attempt in range(max_attempts):
        try:
            raw = await chat_complete(
                [{"role": "user", "content": user}],
                model=OLLAMA_STORYBOARD_MODEL,
                system=STORYBOARD_SYSTEM,
                temperature=0.4,
                json_only=True,
            )
        except OllamaUnavailable:
            log.warning("Ollama unavailable — using template fallback")
            return _fallback_storyboard(topic, grounding)
        except Exception as e:
            last_err = str(e)
            log.warning("storyboard generation attempt %d failed: %s", attempt + 1, e)
            continue

        sb = _try_parse(raw)
        if not sb:
            last_err = "JSON parse failed"
            user = (
                user
                + "\n\nYour previous output was not valid JSON. Output ONLY the JSON object now."
            )
            continue

        ok, why = _validate(sb)
        if ok:
            return sb

        last_err = why
        log.info("storyboard validation failed: %s — retrying", why)
        user = (
            user
            + f"\n\nValidation error: {why}. Fix it and output the corrected JSON object only."
        )

    log.warning("Storyboard generation gave up (%s). Using template fallback.", last_err)
    return _fallback_storyboard(topic, grounding)
