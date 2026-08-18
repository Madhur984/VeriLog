#!/usr/bin/env python3
"""
Document chunking module built on LangChain's RecursiveCharacterTextSplitter.

Splits loaded ``Document`` objects into overlapping chunks sized for the
embedding model, preserving each source document's metadata on every chunk
(the library copies ``doc.metadata`` onto each chunk; ``add_start_index``
additionally records the character offset of the chunk within its source).

Configuration lives in ``config/rag_config.py``:
    * ``CHUNK_SIZE``          — target chunk size in characters (default 1000).
    * ``CHUNK_OVERLAP``       — characters shared between adjacent chunks.
    * ``CHUNK_ADD_START_INDEX`` — record ``start_index`` per chunk.

Usage:
    from rag.text_splitter import chunk_documents

    chunks = chunk_documents(docs)                      # config defaults
    chunks = chunk_documents(docs, chunk_size=500, chunk_overlap=50)

    # Documents shorter than chunk_size pass through as single chunks;
    # metadata (file_path, source_type, ...) is preserved on each chunk.
"""

import logging
import sys
from pathlib import Path
from typing import List, Optional, Sequence

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Allow standalone execution by putting the ai_services package root on
# sys.path, mirroring github_loader.py / index_repo.py.
if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

try:
    from ..config.rag_config import (
        CHUNK_ADD_START_INDEX,
        CHUNK_OVERLAP,
        CHUNK_SIZE,
    )
except ImportError:  # standalone execution with ai_services/ on sys.path
    from config.rag_config import (
        CHUNK_ADD_START_INDEX,
        CHUNK_OVERLAP,
        CHUNK_SIZE,
    )

logger = logging.getLogger(__name__)


def chunk_documents(
    documents: Sequence[Document],
    chunk_size: int = CHUNK_SIZE,
    chunk_overlap: int = CHUNK_OVERLAP,
    add_start_index: bool = CHUNK_ADD_START_INDEX,
    separators: Optional[Sequence[str]] = None,
) -> List[Document]:
    """
    Split a sequence of documents into overlapping, embeddable chunks.

    Args:
        documents: Source documents (e.g. from ``rag.github_loader``).
        chunk_size: Target chunk length in characters. Defaults to
            ``CHUNK_SIZE`` from ``config/rag_config.py``.
        chunk_overlap: Characters shared between consecutive chunks so no
            context is lost at boundaries. Defaults to ``CHUNK_OVERLAP``.
        add_start_index: Record each chunk's character offset within its
            source document as ``start_index`` metadata. Defaults to
            ``CHUNK_ADD_START_INDEX``.
        separators: Ordered list of separators to split on, tried longest
            first (defaults to RecursiveCharacterTextSplitter's standard
            ``["\\n\\n", "\\n", " ", ""]``). Useful for code-heavy content.

    Returns:
        List of chunked ``Document`` objects. Each chunk carries a copy of
        its source document's metadata, plus ``start_index`` when enabled.
        Documents shorter than ``chunk_size`` pass through as one chunk.

    Raises:
        ValueError: if ``chunk_overlap`` >= ``chunk_size`` (LangChain raises
            this inside the splitter).
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        add_start_index=add_start_index,
        separators=list(separators) if separators else None,
    )

    chunks = text_splitter.split_documents(list(documents))
    logger.info(
        "Split %d document(s) into %d chunk(s) (chunk_size=%d, chunk_overlap=%d)",
        len(documents),
        len(chunks),
        chunk_size,
        chunk_overlap,
    )
    return chunks
