"""Render an MP4 tutorial via ReelVideoMaker's tutorial_gen CLI.

We bypass the Anthropic step by writing our own storyboard JSON to disk and
invoking `python cli.py --storyboard <path>`. ReelVideoMaker still needs:
  - playwright + chromium  (one-time `playwright install chromium`)
  - ffmpeg on PATH or via imageio-ffmpeg
  - kokoro (default local TTS)

If REELVIDEOMAKER_PATH/tutorial_gen/cli.py is missing, the job ends with a
clear error rather than silently failing.
"""

from __future__ import annotations

import asyncio
import json
import logging
import shutil
import subprocess
import sys
import uuid
from pathlib import Path
from typing import Any

from .config import REELVIDEOMAKER_PATH, VIDEO_OUTPUT_DIR
from .jobs import update_job

log = logging.getLogger(__name__)


def _cli_path() -> Path:
    return REELVIDEOMAKER_PATH / "tutorial_gen" / "cli.py"


def reelvideomaker_available() -> tuple[bool, str]:
    cli = _cli_path()
    if not cli.exists():
        return False, (
            f"ReelVideoMaker CLI not found at {cli}. "
            f"Clone https://github.com/AryanLuharuwala/ReelVideoMaker to "
            f"{REELVIDEOMAKER_PATH} (or set REELVIDEOMAKER_PATH env var), "
            f"then run: pip install -r tutorial_gen/requirements.txt && playwright install chromium"
        )
    return True, ""


async def render_video(
    job_id: str,
    storyboard: dict[str, Any],
    *,
    voice: str = "alloy",
    fps: int = 30,
) -> str | None:
    """Run the render. Updates job state as it progresses. Returns mp4 URL path."""
    ok, why = reelvideomaker_available()
    if not ok:
        update_job(job_id, status="error", error=why)
        return None

    out_dir = VIDEO_OUTPUT_DIR / job_id
    out_dir.mkdir(parents=True, exist_ok=True)
    storyboard_path = out_dir / "storyboard.json"
    storyboard_path.write_text(json.dumps(storyboard, indent=2), encoding="utf-8")
    update_job(
        job_id,
        status="rendering_slides",
        progress=0.2,
        message="Rendering slides via Playwright…",
        storyboard=storyboard,
    )

    cli = _cli_path()
    cmd = [
        sys.executable,
        str(cli),
        "--storyboard",
        str(storyboard_path),
        "--out",
        str(out_dir),
        "--voice",
        voice,
        "--fps",
        str(fps),
    ]

    log.info("render cmd: %s", " ".join(cmd))

    proc = await asyncio.create_subprocess_exec(
        *cmd,
        cwd=str(REELVIDEOMAKER_PATH / "tutorial_gen"),
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.STDOUT,
    )

    # Stream stdout into job log — also flips status based on phase keywords.
    log_buf: list[str] = []
    assert proc.stdout is not None
    async for raw in proc.stdout:
        line = raw.decode("utf-8", errors="ignore").rstrip()
        if not line:
            continue
        log_buf.append(line)
        low = line.lower()
        if "slides" in low and ("render" in low or "screenshot" in low):
            update_job(job_id, status="rendering_slides", progress=0.45, message=line[:160])
        elif "audio" in low or "tts" in low or "kokoro" in low:
            update_job(job_id, status="rendering_audio", progress=0.7, message=line[:160])
        elif "ffmpeg" in low or "compose" in low or "concat" in low:
            update_job(job_id, status="composing", progress=0.9, message=line[:160])

    rc = await proc.wait()
    if rc != 0:
        tail = "\n".join(log_buf[-30:])
        update_job(job_id, status="error", error=f"render exited {rc}\n{tail}")
        return None

    # tutorial_gen writes tutorial.mp4 in --out.
    mp4 = out_dir / "tutorial.mp4"
    if not mp4.exists():
        # Some pipeline versions name it differently — find any mp4.
        candidates = list(out_dir.glob("*.mp4"))
        if candidates:
            mp4 = candidates[0]
        else:
            update_job(job_id, status="error", error="Render finished but no MP4 was produced.")
            return None

    # Move/copy the file under a stable URL path served by FastAPI.
    final = VIDEO_OUTPUT_DIR / f"{job_id}.mp4"
    shutil.copyfile(mp4, final)
    url_path = f"/ai/chat/video/{job_id}.mp4"
    update_job(
        job_id,
        status="done",
        progress=1.0,
        message="Video ready.",
        video_url=url_path,
    )
    return url_path


def new_job_id() -> str:
    return uuid.uuid4().hex[:12]
