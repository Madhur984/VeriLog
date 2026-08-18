# Knowledge Base (`knowledge/`)

Raw source documents for the RAG engine.

Intended to hold:
- Course PDFs, markdown notes, and study material that gets chunked and embedded.
- Curated FAQ / concept documents for the site-routes and code-repository collections.
- Any future knowledge packs (Verilog, Digital Electronics, career-roadmap content).

Indexing is performed by the scripts in `rag/` (`index_routes.py`, `index_repo.py`);
drop source files here, then run the corresponding indexer to embed them into the
vector store under `vectorstore/chromadb/`.
