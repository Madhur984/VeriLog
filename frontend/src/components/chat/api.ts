// Thin client for the VeriQuest Tutor AI service (FastAPI on :8000).
//
// One source of truth for the base URL. Override at build time with
//   VITE_AI_SERVICE_URL=http://my-host:8000 npm run build

// import.meta.env is injected by Vite; the project lacks a vite-env.d.ts so cast.
const ENV = ((import.meta as unknown) as { env?: Record<string, string | undefined> }).env ?? {};
// Frontend hits a single backend origin (Express on :3000). Express reverse-proxies
// /ai/* to the FastAPI inference service so we never expose multiple ports.
export const AI_BASE_URL = ENV.VITE_AI_SERVICE_URL ?? 'http://localhost:3000';

export interface ChatCitation {
    title: string;
    source: string;
    source_path: string;
    similarity: number;
    snippet: string;
}

export type ChatEvent =
    | { type: 'session'; session_id: string }
    | { type: 'citations'; citations: ChatCitation[] }
    | { type: 'delta'; delta: string }
    | { type: 'done' }
    | { type: 'error'; error: string };

export interface VideoJob {
    job_id: string;
    status:
        | 'queued'
        | 'rendering_storyboard'
        | 'rendering_slides'
        | 'rendering_audio'
        | 'composing'
        | 'done'
        | 'error';
    progress: number;
    message: string;
    video_url?: string | null;
    error?: string | null;
}

export interface ChatHealth {
    llm: { ok: boolean; host: string; models?: string[]; default_model?: string; model_pulled?: boolean; error?: string };
    vector_store: { ok: boolean; documents: number; error?: string | null };
    video_renderer: { available: boolean; message: string };
}

export async function fetchHealth(): Promise<ChatHealth> {
    const r = await fetch(`${AI_BASE_URL}/ai/chat/health`);
    if (!r.ok) throw new Error(`health ${r.status}`);
    return r.json();
}

/**
 * Stream answer events via SSE. Yields one ChatEvent per server-sent message.
 * Cancel by calling controller.abort().
 */
export async function* streamChat(
    message: string,
    history: { role: 'user' | 'assistant'; content: string }[],
    signal: AbortSignal,
    sessionId?: string | null,
): AsyncGenerator<ChatEvent> {
    const r = await fetch(`${AI_BASE_URL}/ai/chat/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({ message, history, session_id: sessionId ?? null }),
        signal,
    });

    if (!r.ok || !r.body) {
        const text = await r.text().catch(() => '');
        throw new Error(`chat ${r.status}: ${text}`);
    }

    const reader = r.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        // SSE frames are separated by \n\n.
        let idx;
        while ((idx = buf.indexOf('\n\n')) >= 0) {
            const frame = buf.slice(0, idx).trim();
            buf = buf.slice(idx + 2);
            if (!frame.startsWith('data:')) continue;
            const payload = frame.slice(5).trim();
            if (!payload) continue;
            try {
                yield JSON.parse(payload) as ChatEvent;
            } catch {
                // ignore malformed frame
            }
        }
    }
}

export async function startVideoJob(payload: {
    topic: string;
    question?: string;
    answer?: string;
    voice?: string;
}): Promise<VideoJob> {
    const r = await fetch(`${AI_BASE_URL}/ai/chat/video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voice: 'alloy', ...payload }),
    });
    if (!r.ok) {
        const text = await r.text().catch(() => '');
        throw new Error(text || `video ${r.status}`);
    }
    return r.json();
}

export async function fetchVideoJob(jobId: string): Promise<VideoJob> {
    const r = await fetch(`${AI_BASE_URL}/ai/chat/video/job/${jobId}`);
    if (!r.ok) throw new Error(`job ${r.status}`);
    return r.json();
}

export function videoFileUrl(urlPath: string): string {
    // Server returns "/ai/chat/video/<id>.mp4" — prefix the base.
    if (urlPath.startsWith('http')) return urlPath;
    return `${AI_BASE_URL}${urlPath}`;
}
