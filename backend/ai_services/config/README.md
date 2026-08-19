# RAG Configuration (`config/`)

Central configuration for the modular RAG engine.

Intended to hold:
- Environment-driven settings (embedding model, chunk sizes, collection names, persist paths).
- Pipeline constants that the `rag/` modules import instead of hardcoding.
- Optional per-deployment overrides (dev / staging / prod).

All runtime settings (embedding model, chunk sizes, collection names, persist
paths) now live here in `config/rag_config.py`; the `rag/` modules import them
instead of hardcoding. Embeddings use the Google Gemini model
(`EMBEDDING_MODEL`) with the API key read from the `GOOGLE_API_KEY`
environment variable — no HuggingFace embeddings are used anywhere in the
pipeline.
