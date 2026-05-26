"""FastAPI routes exposed under /ai/chat."""

from __future__ import annotations

import asyncio
import json
import logging

from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse, StreamingResponse, JSONResponse

from .config import VIDEO_OUTPUT_DIR
from .ingest import ingest_all_async
from .jobs import create_job, get_job
from .llm import healthcheck as llm_health
from .persistence import create_session, load_session, persistence_enabled, save_message, touch_session
from .rag import answer_stream
from .schemas import ChatQuery, IngestSummary, VideoJob, VideoRequest
from .storyboard import generate_storyboard
from .video import new_job_id, reelvideomaker_available, render_video
from .vectorstore import count_all, mode as vectorstore_mode

log = logging.getLogger(__name__)

router = APIRouter(prefix="/ai/chat", tags=["chat"])


# --- Health & status -------------------------------------------------------

@router.get("/health")
async def health():
    llm = await llm_health()
    rvm_ok, rvm_msg = reelvideomaker_available()
    try:
        doc_count = count_all()
        store_ok = True
        store_err = None
    except Exception as e:
        doc_count, store_ok, store_err = 0, False, str(e)
    return {
        "llm": llm,
        "vector_store": {
            "ok": store_ok,
            "documents": doc_count,
            "mode": vectorstore_mode(),
            "error": store_err,
        },
        "video_renderer": {"available": rvm_ok, "message": rvm_msg or "ok"},
    }


# --- Ingestion -------------------------------------------------------------

@router.post("/ingest", response_model=IngestSummary)
async def ingest():
    summary = await ingest_all_async()
    return summary


# --- Chat (SSE stream) -----------------------------------------------------

@router.post("/query")
async def query(req: ChatQuery):
    # If persistence is on and no session_id supplied, mint one.
    session_id = req.session_id
    if persistence_enabled() and not session_id:
        session_id = create_session(title=req.message[:80])

    if session_id:
        save_message(session_id, "user", req.message)

    async def event_source():
        # Emit the session id up front so the client can persist it.
        if session_id:
            yield f"data: {json.dumps({'type': 'session', 'session_id': session_id})}\n\n"

        collected: list[str] = []
        citations: list[dict] = []
        try:
            async for evt in answer_stream(
                req.message, history=req.history, top_k=req.top_k
            ):
                if evt["type"] == "delta":
                    collected.append(evt.get("delta", ""))
                elif evt["type"] == "citations":
                    citations = evt.get("citations", [])
                yield f"data: {json.dumps(evt)}\n\n"
        except asyncio.CancelledError:
            log.info("client disconnected mid-stream")
            raise
        finally:
            if session_id and collected:
                save_message(
                    session_id,
                    "assistant",
                    "".join(collected),
                    citations=citations,
                )
                touch_session(session_id)

    return StreamingResponse(
        event_source(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


@router.get("/sessions/{session_id}")
async def get_session(session_id: str):
    if not persistence_enabled():
        return JSONResponse(
            {"error": "persistence_disabled",
             "detail": "Set SUPABASE_SERVICE_ROLE_KEY to enable server-side chat history."},
            status_code=503,
        )
    return load_session(session_id)


# --- Video render ----------------------------------------------------------

async def _video_pipeline(job_id: str, req: VideoRequest):
    try:
        from .jobs import update_job

        update_job(job_id, status="rendering_storyboard", progress=0.05,
                   message="Generating storyboard with local LLM…")
        storyboard = await generate_storyboard(
            req.topic,
            answer_hint=req.answer,
        )
        await render_video(job_id, storyboard, voice=req.voice)
    except Exception as e:
        log.exception("video pipeline crashed")
        from .jobs import update_job
        update_job(job_id, status="error", error=str(e))


@router.post("/video", response_model=VideoJob)
async def video(req: VideoRequest, background: BackgroundTasks):
    rvm_ok, rvm_msg = reelvideomaker_available()
    if not rvm_ok:
        raise HTTPException(status_code=503, detail=rvm_msg)
    job_id = new_job_id()
    job = create_job(job_id)
    background.add_task(_video_pipeline, job_id, req)
    return job


@router.get("/video/job/{job_id}", response_model=VideoJob)
async def video_status(job_id: str):
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    return job


@router.get("/video/{filename}")
async def video_file(filename: str):
    # Strict path containment — no traversal.
    safe = (VIDEO_OUTPUT_DIR / filename).resolve()
    if not str(safe).startswith(str(VIDEO_OUTPUT_DIR.resolve())):
        raise HTTPException(status_code=400, detail="bad path")
    if not safe.exists():
        raise HTTPException(status_code=404, detail="not found")
    return FileResponse(safe, media_type="video/mp4")
