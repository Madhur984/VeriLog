import logging
from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from .rag_pipeline import (
    run_rag_chain,
    stream_rag_chain_tokens,
)
from .indexer import index_github_repository
from .vectorstore import index_routes as modular_index_routes

logger = logging.getLogger("rag_router")
logging.basicConfig(level=logging.INFO)

router = APIRouter(tags=["VoltMonkey RAG Services"])

class ChatRequest(BaseModel):
    prompt: Optional[str] = None
    messages: Optional[List[Dict[str, Any]]] = None
    pageContext: Optional[str] = ""
    current_path: Optional[str] = ""
    mode: Optional[str] = "chat"
    missionId: Optional[str] = None
    circuitState: Optional[Dict[str, Any]] = None
    stream: Optional[bool] = True

class IndexRepoRequest(BaseModel):
    repo_url: str
    branch: Optional[str] = "main"

class IndexRoutesRequest(BaseModel):
    routes_file: Optional[str] = None

def extract_user_query(req: ChatRequest) -> str:
    if req.prompt:
        return req.prompt.strip()
    if req.messages and len(req.messages) > 0:
        for m in reversed(req.messages):
            if m.get("role") == "user" and m.get("content"):
                return str(m.get("content")).strip()
    if req.mode == "summary":
        return f"Summarise the current page: {req.pageContext}"
    return "Hello VoltMonkey!"

async def handle_assistant_request(req: ChatRequest, is_stream: bool = True):
    query = extract_user_query(req)
    logger.info(f"[VoltMonkey RAG] Request query: '{query}' | mode: '{req.mode}' | current_path: '{req.current_path}' | stream: {is_stream}")

    try:
        if is_stream:
            return StreamingResponse(
                stream_rag_chain_tokens(
                    query=query,
                    chat_history=req.messages or [],
                    page_context=req.pageContext or "",
                    current_path=req.current_path or "",
                    mode=req.mode or "chat"
                ),
                media_type="text/event-stream; charset=utf-8",
                headers={
                    "Cache-Control": "no-cache",
                    "X-VoltMonkey-Engine": "Bit-Bot-RAG-v1"
                }
            )
        else:
            payload = run_rag_chain(
                query=query,
                chat_history=req.messages or [],
                page_context=req.pageContext or "",
                current_path=req.current_path or ""
            )
            return JSONResponse(content=payload)


    except Exception as exc:
        logger.error(f"[VoltMonkey RAG Error] {exc}", exc_info=True)
        error_payload = {
            "error": "VoltMonkey RAG engine encountered an issue.",
            "detail": str(exc),
            "reply": "Hey, my RAG engine is warming up ⚡ — try asking your question again!",
            "text": "Hey, my RAG engine is warming up ⚡ — try asking your question again!",
            "message": "Hey, my RAG engine is warming up ⚡ — try asking your question again!"
        }
        return JSONResponse(status_code=500, content=error_payload)

# Primary backend endpoints matching all frontend calling patterns
@router.post("/functions/v1/assistant")
@router.options("/functions/v1/assistant")
async def assistant_fn_endpoint(req: ChatRequest, raw_req: Request):
    if raw_req.method == "OPTIONS":
        return JSONResponse({"status": "ok"})
    accept = raw_req.headers.get("accept", "")
    wants_stream = "text/event-stream" in accept or req.stream is not False
    return await handle_assistant_request(req, is_stream=wants_stream)

@router.post("/v1/assistant")
async def assistant_v1_endpoint(req: ChatRequest, raw_req: Request):
    accept = raw_req.headers.get("accept", "")
    wants_stream = "text/event-stream" in accept or req.stream is not False
    return await handle_assistant_request(req, is_stream=wants_stream)

@router.post("/assistant")
async def assistant_base_endpoint(req: ChatRequest, raw_req: Request):
    accept = raw_req.headers.get("accept", "")
    wants_stream = "text/event-stream" in accept or req.stream is not False
    return await handle_assistant_request(req, is_stream=wants_stream)

@router.post("/api/chat")
async def api_chat_endpoint(req: ChatRequest, raw_req: Request):
    accept = raw_req.headers.get("accept", "")
    wants_stream = "text/event-stream" in accept or req.stream is not False
    return await handle_assistant_request(req, is_stream=wants_stream)

@router.post("/ai/rag/chat")
async def rag_chat_endpoint(req: ChatRequest, raw_req: Request):
    accept = raw_req.headers.get("accept", "")
    wants_stream = "text/event-stream" in accept or req.stream is not False
    return await handle_assistant_request(req, is_stream=wants_stream)


@router.post("/ai/rag/index-repo")
async def index_repo_endpoint(req: IndexRepoRequest, background_tasks: BackgroundTasks):
    """
    Index a GitHub repository through the modular pipeline
    (load -> chunk -> Gemini embed -> 'code' collection).
    """
    logger.info(f"[VoltMonkey RAG] Triggered repo indexing for {req.repo_url}")
    background_tasks.add_task(index_github_repository, req.repo_url, req.branch)
    return {
        "status": "accepted",
        "message": f"Repository indexing started for {req.repo_url} (branch: {req.branch})."
    }

@router.post("/ai/rag/index-routes")
async def index_routes_endpoint(req: IndexRoutesRequest, background_tasks: BackgroundTasks):
    """
    Sync routes.json into the modular 'routes' collection (Gemini embeddings,
    keyword-aware sync: adds new, replaces changed, removes stale).
    """
    logger.info("[VoltMonkey RAG] Triggered route indexing")
    background_tasks.add_task(modular_index_routes, req.routes_file)
    return {
        "status": "accepted",
        "message": "Route indexing started."
    }
