#!/usr/bin/env python3
"""
ChromaDB vector store module for the modular RAG engine.

Manages two persistent collections:
    * ``code``   — source-code chunks loaded from a GitHub repository.
    * ``routes`` — website navigation entries loaded from ``rag/routes.json``.

Documents are persisted to ``vectorstore/chromadb/`` (configurable via
``VECTORSTORE_PERSIST_DIR`` in ``config/rag_config.py``).

Duplicate prevention:
    Every document gets a deterministic ID derived from its collection, source
    and content (SHA-256). Re-indexing identical content finds the ID already
    present and skips it, so running an indexer twice is a no-op. IDs are also
    deduplicated within a single batch.

Embeddings:
    Vectors come from the Gemini module (``rag.embeddings``). Documents that
    already carry ``metadata["embedding"]`` (e.g. output of ``embed_documents``)
    are stored without re-embedding; anything else is embedded on ingest via
    the shared embedding function. Retrieval (ChromaDB / similarity search)
    is intentionally kept minimal here — just a thin ``search()`` helper.

Usage:
    from rag.vectorstore import index_code_documents, index_routes, search

    added = index_code_documents(chunks)     # -> int (new docs stored)
    added = index_routes()                   # -> int
    hits  = search("routes", "K-Map Lab", k=3)
"""

import hashlib
import json
import logging
import sys
from pathlib import Path
from typing import Dict, List, Optional, Sequence

import chromadb
from chromadb.config import Settings as ChromaSettings
from langchain_chroma import Chroma
from langchain_core.documents import Document

# Workaround for a broken chromadb 0.6.x + posthog >= 7 combination:
# chromadb calls ``posthog.capture(user_id, event, props)`` with 3 positional
# args, but posthog 7.x changed the signature to ``capture(event, **kwargs)``,
# so every telemetry call raises and spams stderr. Telemetry is not needed
# locally; disable it by no-op'ing capture.
try:
    import chromadb.telemetry.product.posthog as _chroma_posthog

    _chroma_posthog.posthog.disabled = True
    _chroma_posthog.posthog.capture = lambda *args, **kwargs: None  # type: ignore[assignment]
except Exception:  # pragma: no cover - defensive; chromadb internals vary
    pass

# Allow standalone execution by putting the ai_services package root on
# sys.path, mirroring github_loader.py / text_splitter.py.
if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

try:
    from ..config.rag_config import (
        COLLECTION_CODE,
        COLLECTION_ROUTES,
        VECTORSTORE_DEDUPE_BATCH_SIZE,
        VECTORSTORE_PERSIST_DIR,
    )
except ImportError:  # standalone execution with ai_services/ on sys.path
    from config.rag_config import (
        COLLECTION_CODE,
        COLLECTION_ROUTES,
        VECTORSTORE_DEDUPE_BATCH_SIZE,
        VECTORSTORE_PERSIST_DIR,
    )

try:
    from ..embeddings import get_embeddings
except ImportError:  # relative import unsupported (rag is the top-level package)
    from rag.embeddings import get_embeddings

logger = logging.getLogger(__name__)

# One PersistentClient per persist directory, shared by all collections so
# langchain-chroma and the duplicate checks talk to the same database.
_clients: Dict[str, chromadb.PersistentClient] = {}


def _get_client(persist_directory: str = VECTORSTORE_PERSIST_DIR) -> chromadb.PersistentClient:
    """Return a shared ChromaDB PersistentClient for ``persist_directory``."""
    path = str(persist_directory)
    if path not in _clients:
        Path(path).mkdir(parents=True, exist_ok=True)
        logger.info("Opening ChromaDB client at %s", path)
        # Keep telemetry off (the posthog workaround above handles the noise;
        # this avoids sending telemetry from the app at all).
        _clients[path] = chromadb.PersistentClient(
            path=path,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
    return _clients[path]


def get_collection(
    collection_name: str,
    persist_directory: str = VECTORSTORE_PERSIST_DIR,
) -> Chroma:
    """
    Get (or create) a LangChain Chroma wrapper for ``collection_name``.

    The collection is backed by the shared PersistentClient and uses the
    Gemini embeddings (``rag.embeddings.get_embeddings``) for any documents
    that are added or queried without pre-computed vectors.

    Args:
        collection_name: Collection to open, e.g. ``COLLECTION_CODE``.
        persist_directory: ChromaDB persistence directory. Defaults to
            ``VECTORSTORE_PERSIST_DIR``.

    Returns:
        A ``langchain_chroma.Chroma`` wrapper bound to the collection.
    """
    client = _get_client(persist_directory)
    return Chroma(
        client=client,
        collection_name=collection_name,
        embedding_function=get_embeddings(),
    )


def _document_id(collection_name: str, doc: Document) -> str:
    """
    Deterministic content-derived ID for duplicate prevention.

    Combines the collection name, a source identifier from metadata
    (``file_path`` for code chunks, ``name`` for routes) and the page content
    so identical content maps to the same ID.
    """
    meta = doc.metadata
    source = meta.get("file_path") or meta.get("source") or meta.get("name") or ""
    start = meta.get("start_index", "")
    payload = f"{collection_name}|{source}|{start}|{doc.page_content}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:32]


def _identity_id(collection_name: str, doc: Document) -> str:
    """
    Content-independent ID keyed on a document's stable identity.

    Used for collections whose entries may legitimately change (e.g. routes
    when keywords are edited): the ID follows the identity (``name``/``path``)
    so an update replaces the old entry instead of duplicating it.
    """
    meta = doc.metadata
    source = meta.get("file_path") or meta.get("source") or meta.get("name") or ""
    payload = f"{collection_name}|{source}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:32]


def add_documents(
    documents: Sequence[Document],
    collection_name: str,
    persist_directory: str = VECTORSTORE_PERSIST_DIR,
    ids: Optional[Sequence[str]] = None,
) -> int:
    """
    Add documents to ``collection_name``, skipping any already present.

    Duplicates are detected by deterministic content-derived IDs (see
    ``_document_id``), both against existing collection contents and within
    the incoming batch. Pass ``ids`` to override ID computation (used by
    ``index_routes`` to replace changed entries under a stable identity).

    Args:
        documents: Documents to persist (chunked/embedded or raw).
        collection_name: Target collection, e.g. ``COLLECTION_CODE``.
        persist_directory: ChromaDB persistence directory. Defaults to
            ``VECTORSTORE_PERSIST_DIR``.
        ids: Optional explicit document IDs, one per document. When given,
            they replace the content-derived IDs (no length-mismatch check
            needed: each document must have exactly one ID).

    Returns:
        Number of documents actually added (0 when everything was a duplicate).

    Raises:
        RuntimeError: if the ChromaDB write fails.
    """
    docs = list(documents)
    if not docs:
        logger.warning("add_documents called with no documents; nothing to add")
        return 0
    if ids is not None and len(ids) != len(docs):
        raise ValueError(
            f"{len(ids)} explicit IDs given for {len(docs)} documents; must match."
        )

    client = _get_client(persist_directory)
    raw_collection = client.get_or_create_collection(collection_name)

    # Deterministic IDs; dedupe within this batch as well.
    id_to_doc: Dict[str, Document] = {}
    for idx, doc in enumerate(docs):
        doc_id = ids[idx] if ids is not None else _document_id(collection_name, doc)
        id_to_doc.setdefault(doc_id, doc)

    # Find which IDs already exist in the collection (batched).
    existing_ids = set()
    ids = list(id_to_doc.keys())
    for i in range(0, len(ids), VECTORSTORE_DEDUPE_BATCH_SIZE):
        batch_ids = ids[i : i + VECTORSTORE_DEDUPE_BATCH_SIZE]
        existing_ids.update(raw_collection.get(ids=batch_ids)["ids"])

    new_ids = [doc_id for doc_id in ids if doc_id not in existing_ids]
    if not new_ids:
        logger.info(
            "All %d document(s) already present in '%s'; nothing to add",
            len(id_to_doc),
            collection_name,
        )
        return 0

    new_docs = [id_to_doc[doc_id] for doc_id in new_ids]
    # Reuse pre-computed embeddings when every document has one (avoids a
    # second Gemini round-trip); otherwise let Chroma embed via the client.
    embeddings = [doc.metadata.get("embedding") for doc in new_docs]
    embeddings = embeddings if all(e is not None for e in embeddings) else None

    # ChromaDB metadata accepts only scalars, so strip the embedding vector
    # out of the persisted metadata (the vector is stored separately via the
    # ``embeddings`` argument). The caller's documents are left untouched.
    persisted_docs = [
        Document(
            page_content=doc.page_content,
            metadata={k: v for k, v in doc.metadata.items() if k != "embedding"},
        )
        for doc in new_docs
    ]

    try:
        store = get_collection(collection_name, persist_directory)
        store.add_documents(persisted_docs, ids=new_ids, embeddings=embeddings)
    except Exception as exc:  # noqa: BLE001 - surface any persistence failure
        logger.exception(
            "Failed to add %d document(s) to collection '%s'",
            len(new_docs),
            collection_name,
        )
        raise RuntimeError(
            f"ChromaDB write to '{collection_name}' failed for "
            f"{len(new_docs)} document(s) at {persist_directory}."
        ) from exc

    logger.info(
        "Added %d new document(s) to '%s' (%d already present)",
        len(new_ids),
        collection_name,
        len(id_to_doc) - len(new_ids),
    )
    return len(new_ids)


def load_route_documents(routes_file_path: Optional[str] = None) -> List[Document]:
    """
    Load website navigation entries from ``routes.json`` as Documents.

    Mirrors ``rag_pipeline.load_route_documents`` so this module stays
    self-contained. Each route becomes one Document whose content bundles
    name, path, description and keywords (routes are small; no chunking).
    """
    if routes_file_path is None:
        routes_file_path = str(Path(__file__).resolve().parent / "routes.json")

    routes_path = Path(routes_file_path)
    if not routes_path.exists():
        raise FileNotFoundError(f"Routes file not found at {routes_file_path}")

    routes_data = json.loads(routes_path.read_text(encoding="utf-8"))
    documents = []
    for route in routes_data:
        name = route.get("name", "")
        path = route.get("path", "")
        desc = route.get("description", "")
        raw_keywords = route.get("keywords", [])
        keywords_str = (
            ", ".join(raw_keywords) if isinstance(raw_keywords, list) else str(raw_keywords)
        )
        content = (
            f"Page Name: {name}\n"
            f"Route Path: {path}\n"
            f"Description: {desc}\n"
            f"Keywords: {keywords_str}"
        )
        metadata = {
            "source_type": "route",
            "name": name,
            "path": path,
            "description": desc,
            "keywords": keywords_str,
        }
        documents.append(Document(page_content=content, metadata=metadata))
    return documents


def index_routes(
    routes_file_path: Optional[str] = None,
    persist_directory: str = VECTORSTORE_PERSIST_DIR,
) -> int:
    """
    Sync website navigation entries from ``routes.json`` into the ``routes``
    collection, so the collection mirrors the file exactly.

    Routes are identified by a stable, content-independent ID (``name`` +
    ``path`` via ``_identity_id``), which makes re-indexing idempotent while
    still picking up edits:

    * unchanged routes are skipped (no duplicates),
    * routes whose keywords/description changed are replaced in place,
    * routes removed from ``routes.json`` are deleted from the collection.

    Args:
        routes_file_path: Path to ``routes.json`` (defaults to the one in
            ``rag/``).
        persist_directory: ChromaDB persistence directory.

    Returns:
        Number of routes newly added or replaced (0 on a no-op re-run).
    """
    docs = load_route_documents(routes_file_path)
    logger.info("Syncing %d route(s) into '%s'", len(docs), COLLECTION_ROUTES)

    client = _get_client(persist_directory)
    raw_collection = client.get_or_create_collection(COLLECTION_ROUTES)

    # Existing entries keyed by stable identity ID (name + path).
    existing = raw_collection.get(include=["documents"])
    existing_by_id = dict(zip(existing.get("ids", []), existing.get("documents", [])))

    new_entries = []  # (stable_id, doc) to add or re-add
    unchanged = 0
    unchanged_ids = []
    for doc in docs:
        route_id = _identity_id(COLLECTION_ROUTES, doc)
        if route_id in existing_by_id:
            if existing_by_id[route_id] == doc.page_content:
                unchanged += 1
                unchanged_ids.append(route_id)
                continue  # identical; nothing to do
            # Changed (keywords/description edited): replace below.
        new_entries.append((route_id, doc))

    new_ids = [route_id for route_id, _ in new_entries]
    new_id_set = set(new_ids)
    # Stale = present in the collection but neither unchanged nor re-added.
    # Unchanged routes must NOT be treated as stale (they were skipped).
    removed = [
        route_id
        for route_id in existing_by_id
        if route_id not in new_id_set and route_id not in unchanged_ids
    ]
    replaced = [route_id for route_id, _ in new_entries if route_id in existing_by_id]

    if removed:
        logger.info(
            "Deleting %d stale route(s) no longer present in routes.json",
            len(removed),
        )
        raw_collection.delete(ids=removed)
    if replaced:
        logger.info("Replacing %d changed route(s)", len(replaced))
        raw_collection.delete(ids=replaced)

    if not new_entries:
        logger.info("All %d route(s) unchanged; nothing to do", unchanged)
        return 0

    added = add_documents(
        [doc for _, doc in new_entries],
        COLLECTION_ROUTES,
        persist_directory,
        ids=new_ids,
    )
    logger.info(
        "routes sync complete: %d added/replaced, %d unchanged, %d removed",
        added,
        unchanged,
        len(removed),
    )
    return added


def index_code_documents(
    documents: Sequence[Document],
    persist_directory: str = VECTORSTORE_PERSIST_DIR,
) -> int:
    """
    Index GitHub repository chunks into the ``code`` collection.

    Args:
        documents: Chunked (and optionally embedded) code documents.
        persist_directory: ChromaDB persistence directory.

    Returns:
        Number of chunks newly added (skips duplicates on re-runs).
    """
    docs = list(documents)
    logger.info("Indexing %d code chunk(s) into '%s'", len(docs), COLLECTION_CODE)
    return add_documents(docs, COLLECTION_CODE, persist_directory)


def search(
    collection_name: str,
    query: str,
    k: int = 5,
    persist_directory: str = VECTORSTORE_PERSIST_DIR,
    embedding: Optional[List[float]] = None,
) -> List[Document]:
    """
    Minimal retrieval helper: top-``k`` documents similar to ``query``.

    Args:
        collection_name: Collection to search, e.g. ``COLLECTION_CODE``.
        query: Natural-language query. Embedded with the same Gemini model
            used at ingest, unless ``embedding`` is given.
        k: Number of results to return.
        persist_directory: ChromaDB persistence directory.
        embedding: Precomputed query embedding. When given, skips the
            embedding API call entirely and searches by this vector instead
            (e.g. reusing one embedding across several collection searches
            for the same query, instead of re-embedding per collection).

    Returns:
        Up to ``k`` matching ``Document`` objects, most similar first.
    """
    store = get_collection(collection_name, persist_directory)
    if embedding is not None:
        return store.similarity_search_by_vector(embedding, k=k)
    return store.similarity_search(query, k=k)
