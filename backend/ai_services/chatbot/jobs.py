"""Lightweight in-memory job tracker.

Fine for single-process FastAPI. If you scale horizontally, swap this for
Redis or a Postgres jobs table.
"""

from __future__ import annotations

import time
from threading import Lock
from typing import Any

from .schemas import VideoJob

_jobs: dict[str, VideoJob] = {}
_lock = Lock()
_TTL_SECONDS = 60 * 60 * 2  # 2 hours


def create_job(job_id: str) -> VideoJob:
    with _lock:
        job = VideoJob(job_id=job_id, status="queued", progress=0.0, message="Queued.")
        _jobs[job_id] = job
        _gc()
        return job


def update_job(job_id: str, **fields: Any) -> VideoJob | None:
    with _lock:
        job = _jobs.get(job_id)
        if not job:
            return None
        data = job.model_dump()
        data.update(fields)
        # touch progress floor for visual feedback even if not provided
        if "progress" not in fields and fields.get("status") == "done":
            data["progress"] = 1.0
        _jobs[job_id] = VideoJob(**data)
        return _jobs[job_id]


def get_job(job_id: str) -> VideoJob | None:
    with _lock:
        return _jobs.get(job_id)


def _gc() -> None:
    now = time.time()
    stale = [k for k, v in _jobs.items() if getattr(v, "_ts", now) < now - _TTL_SECONDS]
    for k in stale:
        _jobs.pop(k, None)
