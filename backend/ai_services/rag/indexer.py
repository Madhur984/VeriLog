#!/usr/bin/env python3
"""
End-to-end repository indexer for the modular RAG engine.

Chains the modular pipeline stages for a GitHub repository:

    github_loader.load_github_repo  -> clone (or open) + load Documents
    text_splitter.chunk_documents   -> RecursiveCharacterTextSplitter
    embeddings.embed_documents      -> Gemini embeddings (GOOGLE_API_KEY)
    vectorstore.index_code_documents -> persist into the 'code' collection

The routes indexer lives in ``rag/vectorstore.index_routes``; this module
adds the multi-stage code path exposed by ``POST /ai/rag/index-repo``.

Usage:
    from rag.indexer import index_github_repository

    summary = index_github_repository("https://github.com/Madhur984/VeriLog")
    print(summary["added"])  # number of new chunks persisted
"""

import logging
import sys
from pathlib import Path
from typing import Any, Dict

# Allow standalone execution by putting the ai_services package root on
# sys.path, mirroring github_loader.py / text_splitter.py.
if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

try:
    from ..config.rag_config import (
        GITHUB_DEFAULT_BRANCH,
        GITHUB_DEFAULT_REPO_URL,
        VECTORSTORE_PERSIST_DIR,
    )
    from ..embeddings import embed_documents
    from ..github_loader import load_github_repo
    from ..text_splitter import chunk_documents
    from ..vectorstore import index_code_documents
except ImportError:  # standalone execution with ai_services/ on sys.path
    from config.rag_config import (
        GITHUB_DEFAULT_BRANCH,
        GITHUB_DEFAULT_REPO_URL,
        VECTORSTORE_PERSIST_DIR,
    )
    from rag.embeddings import embed_documents
    from rag.github_loader import load_github_repo
    from rag.text_splitter import chunk_documents
    from rag.vectorstore import index_code_documents

logger = logging.getLogger(__name__)


def index_github_repository(
    clone_url: str = GITHUB_DEFAULT_REPO_URL,
    branch: str = GITHUB_DEFAULT_BRANCH,
    persist_directory: str = VECTORSTORE_PERSIST_DIR,
) -> Dict[str, Any]:
    """
    Load, chunk, embed and index a GitHub repository into the 'code' collection.

    Args:
        clone_url: Git clone URL. Defaults to ``GITHUB_DEFAULT_REPO_URL``.
        branch: Branch to check out. Defaults to ``GITHUB_DEFAULT_BRANCH``.
        persist_directory: ChromaDB persistence directory. Defaults to
            ``VECTORSTORE_PERSIST_DIR``.

    Returns:
        Summary dict with ``documents`` (files loaded), ``chunks`` (chunks
        produced), ``added`` (new chunks persisted) and ``collection``.

    Raises:
        RuntimeError: if any pipeline stage fails (clone, embed, write).
    """
    logger.info("Indexing repository '%s' (branch: %s)...", clone_url, branch)

    # 1. Load
    documents = load_github_repo(clone_url, branch=branch)
    logger.info("Loaded %d document(s) from %s", len(documents), clone_url)

    # 2. Chunk
    chunks = chunk_documents(documents)
    logger.info("Produced %d chunk(s)", len(chunks))

    # 3. Embed
    embedded = embed_documents(chunks)

    # 4. Persist (dedupe via content-derived IDs)
    added = index_code_documents(embedded, persist_directory=persist_directory)

    summary = {
        "documents": len(documents),
        "chunks": len(chunks),
        "added": added,
        "collection": "code",
        "clone_url": clone_url,
        "branch": branch,
    }
    logger.info(
        "Indexing complete: %d chunk(s) persisted into 'code' (dedupe skipped %d)",
        added,
        len(chunks) - added,
    )
    return summary
