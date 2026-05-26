"""Chat session + message persistence to Supabase.

Requires SUPABASE_SERVICE_ROLE_KEY (writes go through the service-role client).
If the key is missing, persistence becomes a no-op and the chat keeps working
out of localStorage on the client.
"""

from __future__ import annotations

import logging
from typing import Any

from .config import SUPABASE_SERVICE_KEY
from .vectorstore import _read_client, _write_client

log = logging.getLogger(__name__)


def persistence_enabled() -> bool:
    return bool(SUPABASE_SERVICE_KEY)


def create_session(user_id: str | None = None, title: str | None = None) -> str | None:
    if not persistence_enabled():
        return None
    try:
        row = {"user_id": user_id, "title": title}
        resp = _write_client().table("chat_sessions").insert(row).execute()
        return (resp.data or [{}])[0].get("id")
    except Exception as e:
        log.warning("create_session failed: %s", e)
        return None


def touch_session(session_id: str) -> None:
    if not persistence_enabled():
        return
    try:
        from datetime import datetime, timezone
        _write_client().table("chat_sessions").update(
            {"last_active": datetime.now(timezone.utc).isoformat()}
        ).eq("id", session_id).execute()
    except Exception as e:
        log.debug("touch_session failed: %s", e)


def save_message(
    session_id: str,
    role: str,
    content: str,
    *,
    citations: list[dict[str, Any]] | None = None,
    video_url: str | None = None,
    video_job: str | None = None,
) -> int | None:
    if not persistence_enabled():
        return None
    try:
        row = {
            "session_id": session_id,
            "role": role,
            "content": content,
            "citations": citations or [],
            "video_url": video_url,
            "video_job": video_job,
        }
        resp = _write_client().table("chat_messages").insert(row).execute()
        return (resp.data or [{}])[0].get("id")
    except Exception as e:
        log.warning("save_message failed: %s", e)
        return None


def load_session(session_id: str, limit: int = 200) -> dict[str, Any]:
    client = _read_client()
    try:
        sess = (
            client.table("chat_sessions")
            .select("*")
            .eq("id", session_id)
            .single()
            .execute()
        )
    except Exception:
        return {"session": None, "messages": []}

    msgs = (
        client.table("chat_messages")
        .select("role, content, citations, video_url, video_job, created_at")
        .eq("session_id", session_id)
        .order("created_at")
        .limit(limit)
        .execute()
    )
    return {"session": sess.data, "messages": msgs.data or []}
