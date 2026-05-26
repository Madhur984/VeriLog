"""Pydantic models exchanged across HTTP."""

from __future__ import annotations

from typing import Any, Literal, Optional
from pydantic import BaseModel, Field


class Citation(BaseModel):
    title: str
    source: str
    source_path: str
    similarity: float
    snippet: str


class ChatQuery(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None
    history: list[dict[str, str]] = Field(
        default_factory=list,
        description="Prior turns as [{role, content}, ...] — caller may keep their own history",
    )
    top_k: int = 6
    want_video: bool = False


class ChatAnswerChunk(BaseModel):
    """Streamed unit. Either a token delta or a final payload with citations."""

    type: Literal["delta", "done", "error", "citations"]
    delta: Optional[str] = None
    citations: Optional[list[Citation]] = None
    error: Optional[str] = None


class VideoRequest(BaseModel):
    topic: str = Field(..., min_length=2, max_length=300)
    question: Optional[str] = None
    answer: Optional[str] = None
    voice: str = "alloy"
    session_id: Optional[str] = None


class VideoJob(BaseModel):
    job_id: str
    status: Literal["queued", "rendering_storyboard", "rendering_slides",
                    "rendering_audio", "composing", "done", "error"]
    progress: float = 0.0
    message: str = ""
    video_url: Optional[str] = None
    storyboard: Optional[dict[str, Any]] = None
    error: Optional[str] = None


class IngestSummary(BaseModel):
    total_files: int
    total_chunks: int
    by_source: dict[str, int]
    skipped: list[str] = Field(default_factory=list)
    duration_seconds: float = 0.0
