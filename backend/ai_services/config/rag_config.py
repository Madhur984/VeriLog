"""
Central configuration for the modular RAG engine.

Settings consumed by `rag/github_loader.py`, `rag/text_splitter.py`,
`rag/embeddings.py` and `rag/vectorstore.py`; pipeline-wide settings
(embedding model, chunk sizes, collection names, persist paths) migrate
here from `rag/rag_pipeline.py` as the modularization proceeds.
"""

from pathlib import Path

# Base directory of the AI services package (backend/ai_services).
BASE_DIR = Path(__file__).resolve().parent.parent


# ---------------------------------------------------------------------------
# GitHub Repository Loader
# ---------------------------------------------------------------------------

# Default repository the GitHub Loader indexes when no URL is supplied.
GITHUB_DEFAULT_REPO_URL = "https://github.com/Madhur984/VeriLog"

# Default branch checked out by the GitHub Loader.
GITHUB_DEFAULT_BRANCH = "main"

# Directory / file names skipped by the GitHub Loader at any nesting level.
# Covers VCS metadata, vendored dependencies, build artifacts, and caches.
GITHUB_IGNORE_DIRS = [
    # VCS metadata
    ".git",
    ".github",
    ".hg",
    ".svn",
    # Python
    "__pycache__",
    ".venv",
    "venv",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    # Node / JS build output & dependencies
    "node_modules",
    "bower_components",
    ".next",
    ".nuxt",
    ".output",
    # Generic build artifacts & caches
    "build",
    "dist",
    "out",
    "target",
    "coverage",
    ".cache",
    # Editors / tooling
    ".idea",
    ".vscode",
]

# File extensions the GitHub Loader indexes. Defaults to the same source
# set the RAG pipeline indexes; binary assets (videos, images, archives)
# are implicitly excluded since they are not listed here.
GITHUB_FILE_EXTENSIONS = [
    ".py",
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".md",
    ".json",
    ".html",
    ".css",
]


# ---------------------------------------------------------------------------
# Text Splitting
# ---------------------------------------------------------------------------

# Target size of each chunk (characters) produced by the text splitter.
CHUNK_SIZE = 1000

# Number of characters shared between consecutive chunks so context
# straddling a boundary is not lost.
CHUNK_OVERLAP = 200

# Record each chunk's character offset within its source file as
# ``start_index`` in the chunk metadata.
CHUNK_ADD_START_INDEX = True


# ---------------------------------------------------------------------------
# Embeddings (Google Gemini)
# ---------------------------------------------------------------------------

# Gemini embedding model used to vectorize chunks. The API key is read from
# the GOOGLE_API_KEY environment variable (never hardcoded).
EMBEDDING_MODEL = "gemini-embedding-2"


# ---------------------------------------------------------------------------
# ChromaDB Vector Store
# ---------------------------------------------------------------------------

# Persistence directory for the ChromaDB vector database (gitignored).
VECTORSTORE_PERSIST_DIR = str(BASE_DIR / "vectorstore" / "chromadb")

# Collection names. 'code' holds GitHub repository source chunks; 'routes'
# holds website navigation entries loaded from rag/routes.json.
COLLECTION_CODE = "code"
COLLECTION_ROUTES = "routes"

# Batch size for duplicate checks against an existing collection.
VECTORSTORE_DEDUPE_BATCH_SIZE = 1000


# ---------------------------------------------------------------------------
# Retrieval (MMR)
# ---------------------------------------------------------------------------

# Number of documents returned per collection by the MMR retriever.
RETRIEVER_K = 5

# Size of the similarity candidate pool MMR re-ranks for diversity.
RETRIEVER_FETCH_K = 20
