#!/usr/bin/env python3
"""
MMR (Maximum Marginal Relevance) retriever over the ChromaDB collections.

Runs Chroma's native ``max_marginal_relevance_search`` against both the
``code`` and ``routes`` collections and merges the results, so a single call
returns diverse, relevant context drawn from the GitHub repository chunks
and the website navigation index alike.

MMR re-ranks the top ``fetch_k`` similarity candidates to balance relevance
against redundancy: each returned document is relevant to the query, but
similar documents are not all returned together. ``k`` documents are taken
per collection (so the combined result may hold up to ``2 * k`` documents).

Configuration lives in ``config/rag_config.py``:
    * ``RETRIEVER_K``       — documents per collection (default 5).
    * ``RETRIEVER_FETCH_K`` — MMR candidate pool size per collection.

Usage:
    from rag.retriever import retrieve

    docs = retrieve("kmaps boolean simplification")
    for doc in docs:
        print(doc.metadata.get("collection"), doc.metadata.get("path") or doc.metadata.get("file_path"))

    docs = retrieve("half adder verilog", collections=("code",))
"""

import logging
import sys
from pathlib import Path
from typing import Optional, Sequence

from langchain_core.documents import Document

# Allow standalone execution by putting the ai_services package root on
# sys.path, mirroring github_loader.py / text_splitter.py.
if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

try:
    from ..config.rag_config import (
        COLLECTION_CODE,
        COLLECTION_ROUTES,
        RETRIEVER_FETCH_K,
        RETRIEVER_K,
        VECTORSTORE_PERSIST_DIR,
    )
except ImportError:  # standalone execution with ai_services/ on sys.path
    from config.rag_config import (
        COLLECTION_CODE,
        COLLECTION_ROUTES,
        RETRIEVER_FETCH_K,
        RETRIEVER_K,
        VECTORSTORE_PERSIST_DIR,
    )

try:
    from ..vectorstore import get_collection
except ImportError:  # relative import unsupported (rag is the top-level package)
    from rag.vectorstore import get_collection

logger = logging.getLogger(__name__)

# Default set of collections searched by retrieve().
DEFAULT_COLLECTIONS = (COLLECTION_CODE, COLLECTION_ROUTES)


def retrieve(
    query: str,
    k: int = RETRIEVER_K,
    fetch_k: int = RETRIEVER_FETCH_K,
    lambda_mult: float = 0.5,
    collections: Sequence[str] = DEFAULT_COLLECTIONS,
    persist_directory: str = VECTORSTORE_PERSIST_DIR,
) -> list[Document]:
    """
    Retrieve diverse, relevant documents from the ``code`` and ``routes``
    collections using Maximum Marginal Relevance.

    Each collection is searched with MMR (``fetch_k`` candidates re-ranked
    down to ``k`` documents) and the results are merged into a single list.
    Every returned document carries its source collection in
    ``metadata["collection"]``, so callers can tell code chunks from routes.

    Args:
        query: Natural-language query, embedded with the same Gemini model
            used at ingest.
        k: Documents to take per collection (defaults to ``RETRIEVER_K``).
        fetch_k: Similarity candidate pool per collection before MMR
            re-ranking (defaults to ``RETRIEVER_FETCH_K``).
        lambda_mult: MMR diversity/balance parameter in [0, 1]; 1 = pure
            relevance, 0 = pure diversity (default 0.5).
        collections: Collections to search (defaults to both ``code`` and
            ``routes``).
        persist_directory: ChromaDB persistence directory. Defaults to
            ``VECTORSTORE_PERSIST_DIR``.

    Returns:
        Merged list of documents (up to ``k * len(collections)``), most
        relevant first, each tagged with ``metadata["collection"]``.
        Empty collections are skipped; an entirely empty result is [].
    """
    if not query or not query.strip():
        logger.warning("retrieve called with an empty query; returning []")
        return []

    if fetch_k < k:
        logger.debug("fetch_k (%d) < k (%d); clamping fetch_k to k", fetch_k, k)
        fetch_k = k

    results: list[Document] = []
    seen: set[tuple[str, str]] = set()

    for collection_name in collections:
        try:
            store = get_collection(collection_name, persist_directory)
            docs = store.max_marginal_relevance_search(
                query,
                k=k,
                fetch_k=fetch_k,
                lambda_mult=lambda_mult,
            )
        except Exception as exc:  # noqa: BLE001 - keep other collections searchable
            logger.warning(
                "MMR search on '%s' failed (skipping): %s", collection_name, exc
            )
            continue

        for doc in docs:
            # Tag the source collection; keep a dedupe key so identical docs
            # surfaced by the same collection are not repeated.
            doc.metadata["collection"] = collection_name
            source = (
                doc.metadata.get("file_path")
                or doc.metadata.get("name")
                or doc.page_content[:64]
            )
            key = (collection_name, source)
            if key in seen:
                continue
            seen.add(key)
            results.append(doc)

        logger.info(
            "MMR(%s): %d result(s) from '%s' (fetch_k=%d)",
            query[:40],
            len(docs),
            collection_name,
            fetch_k,
        )

    logger.info(
        "MMR retrieve returned %d document(s) across %d collection(s)",
        len(results),
        len(collections),
    )
    return results
