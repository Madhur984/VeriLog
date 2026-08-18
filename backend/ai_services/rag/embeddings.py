#!/usr/bin/env python3
"""
Embedding module built on LangChain's GoogleGenerativeAIEmbeddings (Gemini).

Accepts chunked ``Document`` objects, generates an embedding vector for each
chunk via the Google Gemini Embedding API, and returns the same documents
with the vector attached as ``metadata["embedding"]``.

The Gemini API key is read from the ``GOOGLE_API_KEY`` environment variable
and is never hardcoded.

Configuration lives in ``config/rag_config.py``:
    * ``EMBEDDING_MODEL`` — Gemini embedding model (default "gemini-embedding-2").

Usage:
    from rag.embeddings import embed_documents

    embedded = embed_documents(chunks)            # config default model
    embedded = embed_documents(chunks, model="gemini-embedding-001")

Note: ChromaDB storage and retrieval are intentionally out of scope here;
this module only produces vectors.
"""

import logging
import os
import sys
from pathlib import Path
from typing import List, Optional, Sequence

from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Allow standalone execution by putting the ai_services package root on
# sys.path, mirroring github_loader.py / text_splitter.py.
if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

try:
    from ..config.rag_config import EMBEDDING_MODEL
except ImportError:  # standalone execution with ai_services/ on sys.path
    from config.rag_config import EMBEDDING_MODEL

logger = logging.getLogger(__name__)

# Environment variable holding the Gemini API key.
API_KEY_ENV_VAR = "GOOGLE_API_KEY"

_embeddings_cache = None


def get_embeddings(model: str = EMBEDDING_MODEL) -> GoogleGenerativeAIEmbeddings:
    """
    Lazily create (and cache) the Gemini embeddings client for ``model``.

    Args:
        model: Gemini embedding model name. Defaults to ``EMBEDDING_MODEL``
            from ``config/rag_config.py``.

    Returns:
        A configured ``GoogleGenerativeAIEmbeddings`` instance.

    Raises:
        ValueError: if ``GOOGLE_API_KEY`` is not set in the environment.
    """
    global _embeddings_cache

    api_key = os.getenv(API_KEY_ENV_VAR)
    if not api_key:
        raise ValueError(
            f"Missing {API_KEY_ENV_VAR} environment variable. Set it to your "
            "Google AI Studio API key before generating embeddings."
        )

    if _embeddings_cache is None:
        logger.info("Initializing Gemini embeddings client (model: %s)", model)
        _embeddings_cache = GoogleGenerativeAIEmbeddings(
            model=model,
            google_api_key=api_key,
        )
    return _embeddings_cache


def embed_documents(
    documents: Sequence[Document],
    model: str = EMBEDDING_MODEL,
) -> List[Document]:
    """
    Embed a sequence of chunked documents with Gemini and attach the vectors.

    Each returned document is the input document with its embedding vector
    stored as ``metadata["embedding"]`` (a ``List[float]``); all other
    metadata is preserved.

    Args:
        documents: Chunked documents (e.g. from ``rag.text_splitter``).
        model: Gemini embedding model name. Defaults to ``EMBEDDING_MODEL``.

    Returns:
        The same documents, each carrying ``metadata["embedding"]``.

    Raises:
        ValueError: if ``GOOGLE_API_KEY`` is unset or ``documents`` is empty.
        RuntimeError: if the Gemini API call fails (wraps the underlying error
            with logging and context).
    """
    docs = list(documents)
    if not docs:
        logger.warning("embed_documents called with no documents; returning []")
        return []

    texts = [doc.page_content for doc in docs]
    embeddings_client = get_embeddings(model=model)

    try:
        logger.info(
            "Generating %d embedding(s) with model '%s'...", len(texts), model
        )
        vectors = embeddings_client.embed_documents(texts)
    except Exception as exc:  # noqa: BLE001 - surface any API/transport failure
        logger.exception(
            "Failed to embed %d document(s) with model '%s'", len(texts), model
        )
        raise RuntimeError(
            f"Gemini embedding failed for {len(texts)} document(s) "
            f"using model '{model}'. Check that {API_KEY_ENV_VAR} is valid "
            "and has access to this model."
        ) from exc

    if len(vectors) != len(docs):
        logger.error(
            "Embedding API returned %d vectors for %d documents",
            len(vectors),
            len(docs),
        )
        raise RuntimeError(
            f"Gemini returned {len(vectors)} vectors for {len(docs)} documents; "
            "counts must match."
        )

    for doc, vector in zip(docs, vectors):
        doc.metadata["embedding"] = vector

    logger.info("Successfully embedded %d document(s)", len(docs))
    return docs
