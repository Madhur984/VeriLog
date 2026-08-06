"""
rag_pipeline.py — Extended Modular RAG Pipeline with Dual Indexing & Unified Retrieval

Supports:
1. GitHub Repository Code Indexing (GitLoader -> TextSplitter -> ChromaDB ['codebase'])
2. Site Route Indexing (routes.json -> Keyword Extractor -> ChromaDB ['routes'])
3. Unified Hybrid Search (Simultaneous retrieval across routes and codebase)
"""

import os
import json
import re
from typing import List, Dict, Any, Optional
from pathlib import Path

# LangChain & Chroma imports
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_community.document_loaders import GitLoader
import chromadb
from chromadb.config import Settings

# ---------------------------------------------------------------------------
# Configuration & Constants
# ---------------------------------------------------------------------------
DEFAULT_EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
CHROMA_PERSIST_DIR = "./chroma_db"
CODE_COLLECTION = "codebase"
ROUTES_COLLECTION = "routes"

# Helper for automatic keyword extraction from route names & paths
def extract_route_keywords(name: str, path: str, category: str) -> List[str]:
    """Generates a rich set of keywords for improved semantic & lexical matching."""
    raw_tokens = re.findall(r'[a-zA-Z0-9]+', f"{name} {path} {category}".lower())
    stop_words = {"page", "pages", "category", "and", "or", "the", "for", "in", "a", "an", "gated", "public"}
    
    keywords = set()
    for token in raw_tokens:
        if token not in stop_words and len(token) > 1:
            keywords.add(token)
            
    # Domain synonyms mapping
    synonyms = {
        "verilog": ["hdl", "rtl", "judge", "playground", "code", "simulator"],
        "dsd": ["digital", "system", "design", "logic", "adder", "subtractor", "gate", "kmap"],
        "workbench": ["circuit", "schematic", "canvas", "wire", "simulation"],
        "kmap": ["karnaugh", "boolean", "minimization", "simplification"],
        "login": ["auth", "signin", "signup", "account", "user"],
        "profile": ["settings", "user", "account", "dashboard"],
        "career": ["jobs", "vlsi", "roadmap", "industry", "silicon"],
    }
    
    for kw in list(keywords):
        if kw in synonyms:
            keywords.update(synonyms[kw])
            
    return sorted(list(keywords))


# ---------------------------------------------------------------------------
# 1. Route Indexer Component
# ---------------------------------------------------------------------------
class RouteIndexer:
    """Loads routes.json, constructs documents with keywords & metadata, and indexes into Chroma."""

    def __init__(self, vectorstore: Chroma):
        self.vectorstore = vectorstore

    def load_and_index(self, json_path: str = "routes.json") -> int:
        path = Path(json_path)
        if not path.exists():
            raise FileNotFoundError(f"Route file '{json_path}' not found.")

        with open(path, "r", encoding="utf-8") as f:
            routes_data = json.load(f)

        documents = []
        for item in routes_data:
            name = item.get("name", "")
            route_path = item.get("path", "")
            category = item.get("category", "")
            description = item.get("description", "")
            chapter_path = item.get("chapter_path", "")

            keywords = extract_route_keywords(name, route_path, category)
            keywords_str = ", ".join(keywords)

            # Document page_content structured for embedding search
            content = (
                f"Route Name: {name}\n"
                f"URL Path: {route_path}\n"
                f"Category: {category}\n"
                f"Description: {description}\n"
                f"Keywords: {keywords_str}"
            )
            if chapter_path:
                content += f"\nSub-route Chapter Path: {chapter_path}"

            metadata = {
                "name": name,
                "path": route_path,
                "category": category,
                "description": description,
                "keywords": keywords_str,
                "chapter_path": chapter_path or "",
                "type": "route"
            }

            documents.append(Document(page_content=content, metadata=metadata))

        print(f"📦 Indexing {len(documents)} routes into Chroma collection '{ROUTES_COLLECTION}'...")
        self.vectorstore.add_documents(documents)
        print(f"✅ Route indexing complete.")
        return len(documents)


# ---------------------------------------------------------------------------
# 2. GitHub Code Indexer Component
# ---------------------------------------------------------------------------
class CodeIndexer:
    """Clones a GitHub repository using GitLoader, splits code, and indexes into Chroma."""

    def __init__(self, vectorstore: Chroma):
        self.vectorstore = vectorstore

    def index_github_repo(
        self,
        repo_url: str,
        repo_path: str = "./tmp_repo",
        branch: str = "main",
        file_extensions: List[str] = [".py", ".ts", ".tsx", ".js", ".v", ".sv", ".md"]
    ) -> int:
        print(f"🔄 Cloning & Loading repository from '{repo_url}'...")
        
        # Filter files by extensions
        def file_filter(file_path: str) -> bool:
            return any(file_path.endswith(ext) for ext in file_extensions)

        loader = GitLoader(
            clone_url=repo_url,
            repo_path=repo_path,
            branch=branch,
            file_filter=file_filter
        )
        
        raw_docs = loader.load()
        print(f"📄 Loaded {len(raw_docs)} source files.")

        # Chunk code keeping syntax integrity
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
        split_docs = splitter.split_documents(raw_docs)
        
        for doc in split_docs:
            doc.metadata["type"] = "code"

        print(f"📦 Indexing {len(split_docs)} code chunks into Chroma collection '{CODE_COLLECTION}'...")
        self.vectorstore.add_documents(split_docs)
        print(f"✅ Codebase indexing complete.")
        return len(split_docs)


# ---------------------------------------------------------------------------
# 3. Unified RAG Orchestrator & Retriever
# ---------------------------------------------------------------------------
class UnifiedRAGPipeline:
    """
    Modular RAG pipeline managing separate Chroma collections ('codebase' and 'routes')
    and providing unified search capabilities.
    """

    def __init__(self, persist_dir: str = CHROMA_PERSIST_DIR):
        self.persist_dir = persist_dir
        self.embeddings = HuggingFaceEmbeddings(model_name=DEFAULT_EMBEDDING_MODEL)

        # Single shared persistent client instance to prevent sqlite lock issues
        self.chroma_client = chromadb.PersistentClient(
            path=self.persist_dir,
            settings=Settings(anonymized_telemetry=False)
        )

        # Initialize vector store collections
        self.routes_store = Chroma(
            client=self.chroma_client,
            collection_name=ROUTES_COLLECTION,
            embedding_function=self.embeddings
        )
        self.code_store = Chroma(
            client=self.chroma_client,
            collection_name=CODE_COLLECTION,
            embedding_function=self.embeddings
        )

        self.route_indexer = RouteIndexer(self.routes_store)
        self.code_indexer = CodeIndexer(self.code_store)

    def index_routes(self, json_path: str = "routes.json") -> int:
        """Indexes site routes independently."""
        return self.route_indexer.load_and_index(json_path)

    def index_codebase(self, repo_url: str, branch: str = "main") -> int:
        """Indexes GitHub codebase independently."""
        return self.code_indexer.index_github_repo(repo_url=repo_url, branch=branch)

    def search_routes(self, query: str, k: int = 4) -> List[Dict[str, Any]]:
        """Searches specifically within the route map collection."""
        results = self.routes_store.similarity_search_with_score(query, k=k)
        formatted = []
        for doc, score in results:
            formatted.append({
                "source": "routes",
                "score": float(score),
                "name": doc.metadata.get("name"),
                "path": doc.metadata.get("path"),
                "category": doc.metadata.get("category"),
                "description": doc.metadata.get("description"),
                "keywords": doc.metadata.get("keywords"),
                "content": doc.page_content
            })
        return formatted

    def search_code(self, query: str, k: int = 4) -> List[Dict[str, Any]]:
        """Searches specifically within the codebase collection."""
        results = self.code_store.similarity_search_with_score(query, k=k)
        formatted = []
        for doc, score in results:
            formatted.append({
                "source": "code",
                "score": float(score),
                "file_path": doc.metadata.get("source"),
                "content": doc.page_content
            })
        return formatted

    def unified_search(self, query: str, k_code: int = 3, k_routes: int = 3) -> Dict[str, Any]:
        """
        Unified Search: Performs simultaneous search across both Route and Code collections
        and returns combined, structured findings.
        """
        route_results = self.search_routes(query, k=k_routes)
        code_results = self.search_code(query, k=k_code)

        return {
            "query": query,
            "routes_found": route_results,
            "code_found": code_results,
            "total_matches": len(route_results) + len(code_results)
        }


# ---------------------------------------------------------------------------
# Pipeline Execution & Demonstration
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("🚀 Initializing Extended Modular RAG Pipeline...")
    
    # Remove stale chroma db if locks exist
    import shutil
    if os.path.exists("./chroma_db_temp"):
        shutil.rmtree("./chroma_db_temp")

    pipeline = UnifiedRAGPipeline(persist_dir="./chroma_db_temp")

    # 1. Index routes.json into 'routes' collection
    if os.path.exists("routes.json"):
        pipeline.index_routes("routes.json")

    # 2. Perform Unified Search Query Demo
    sample_queries = [
        "Where can I test and auto-grade Verilog HDL code?",
        "How do I sign in or reset my account password?",
        "Digital system design adders and multiplexer modules"
    ]

    print("\n" + "="*70)
    print("🔍 DEMONSTRATING UNIFIED RETRIEVAL")
    print("="*70)

    for q in sample_queries:
        print(f"\n❓ Query: '{q}'")
        res = pipeline.unified_search(q, k_routes=2, k_code=1)
        
        print("  📍 Route Matches:")
        for r in res["routes_found"]:
            print(f"     - [{r['category']}] {r['name']} -> {r['path']}")
            
        if res["code_found"]:
            print("  💻 Code Matches:")
            for c in res["code_found"]:
                print(f"     - File: {c['file_path']}")
