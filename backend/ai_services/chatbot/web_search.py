"""Web augmentation for RAG — Wikipedia REST + DuckDuckGo HTML scrape.

No API keys required. Both sources are fetched asynchronously in parallel with
the local vector search. Results are cached in-memory for the process lifetime
so repeated queries don't repeatedly hit the network.

If both sources are slow or fail, RAG falls back to local-only retrieval.
"""

from __future__ import annotations

import asyncio
import logging
import os
import re
from typing import Any
from urllib.parse import quote_plus

import httpx
from bs4 import BeautifulSoup

log = logging.getLogger(__name__)

WEB_SEARCH_ENABLED = os.getenv("WEB_SEARCH_ENABLED", "1") in ("1", "true", "True")
WEB_SEARCH_TIMEOUT_S = float(os.getenv("WEB_SEARCH_TIMEOUT_S", "6.0"))
WEB_SEARCH_MAX_RESULTS = int(os.getenv("WEB_SEARCH_MAX_RESULTS", "3"))
WEB_SEARCH_MAX_CHARS = int(os.getenv("WEB_SEARCH_MAX_CHARS", "1200"))

# Module-level cache: { query → list[chunk] }
_cache: dict[str, list[dict[str, Any]]] = {}
_cache_lock = asyncio.Lock()

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36 VeriQuestTutor/1.0"
)


# --- Wikipedia ------------------------------------------------------------

async def _wikipedia_search(client: httpx.AsyncClient, query: str) -> list[dict[str, Any]]:
    """Search + fetch summary of the top match via the public REST API."""
    try:
        s = await client.get(
            "https://en.wikipedia.org/w/rest.php/v1/search/title",
            params={"q": query, "limit": 1},
            headers={"User-Agent": USER_AGENT},
        )
        s.raise_for_status()
        hits = (s.json() or {}).get("pages") or []
        if not hits:
            return []
        page = hits[0]
        key = page.get("key") or page.get("title", "").replace(" ", "_")
        if not key:
            return []

        r = await client.get(
            f"https://en.wikipedia.org/api/rest_v1/page/summary/{quote_plus(key)}",
            headers={"User-Agent": USER_AGENT},
        )
        r.raise_for_status()
        data = r.json()
        extract = (data.get("extract") or "").strip()
        if not extract:
            return []
        title = data.get("title") or key
        url = ((data.get("content_urls") or {}).get("desktop") or {}).get("page") or \
              f"https://en.wikipedia.org/wiki/{quote_plus(key)}"
        return [{
            "id": -1,
            "source": "wikipedia",
            "source_path": url,
            "title": f"Wikipedia: {title}",
            "chunk_index": 0,
            "content": extract[:WEB_SEARCH_MAX_CHARS],
            "similarity": 0.85,   # high-confidence canonical source
            "metadata": {"url": url, "origin": "web"},
        }]
    except Exception as e:
        log.info("wikipedia search failed for %r: %s", query, e)
        return []


# --- DuckDuckGo HTML scrape -----------------------------------------------

_DDG_RESULT_SEL = "a.result__snippet"
_DDG_TITLE_SEL = "a.result__a"
_DDG_URL_SEL = "a.result__url"


async def _ddg_search(client: httpx.AsyncClient, query: str) -> list[dict[str, Any]]:
    """Scrape DDG HTML endpoint — no API key, no JS rendering required."""
    try:
        r = await client.post(
            "https://html.duckduckgo.com/html/",
            data={"q": query},
            headers={"User-Agent": USER_AGENT, "Referer": "https://duckduckgo.com/"},
        )
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "lxml")

        out: list[dict[str, Any]] = []
        seen_urls: set[str] = set()
        for snip, title in zip(
            soup.select(_DDG_RESULT_SEL),
            soup.select(_DDG_TITLE_SEL),
        ):
            text = snip.get_text(" ", strip=True)
            if len(text) < 60:
                continue
            href = title.get("href") or ""
            # DDG wraps with a redirector; pull the underlying URL if present.
            m = re.search(r"[?&]uddg=([^&]+)", href)
            if m:
                from urllib.parse import unquote
                href = unquote(m.group(1))
            if not href or href in seen_urls:
                continue
            seen_urls.add(href)
            label = title.get_text(" ", strip=True) or href
            out.append({
                "id": -1,
                "source": "duckduckgo",
                "source_path": href,
                "title": f"DDG: {label[:80]}",
                "chunk_index": 0,
                "content": text[:WEB_SEARCH_MAX_CHARS],
                "similarity": 0.6,
                "metadata": {"url": href, "origin": "web"},
            })
            if len(out) >= WEB_SEARCH_MAX_RESULTS:
                break
        return out
    except Exception as e:
        log.info("ddg search failed for %r: %s", query, e)
        return []


# --- Public entrypoint ----------------------------------------------------

async def search_web(query: str) -> list[dict[str, Any]]:
    """Return a list of chunks (same shape as local store rows). Cached."""
    if not WEB_SEARCH_ENABLED:
        return []

    key = query.strip().lower()
    if not key:
        return []

    async with _cache_lock:
        if key in _cache:
            return _cache[key]

    async with httpx.AsyncClient(
        timeout=WEB_SEARCH_TIMEOUT_S,
        follow_redirects=True,
        http2=False,
    ) as client:
        results = await asyncio.gather(
            _wikipedia_search(client, query),
            _ddg_search(client, query),
            return_exceptions=True,
        )

    chunks: list[dict[str, Any]] = []
    for r in results:
        if isinstance(r, list):
            chunks.extend(r)
    # Wikipedia first (it scored higher), then DDG.
    chunks.sort(key=lambda c: c.get("similarity", 0), reverse=True)

    async with _cache_lock:
        _cache[key] = chunks
    return chunks
