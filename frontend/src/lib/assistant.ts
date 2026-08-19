// VoltMonkey's client — proxies the LLM server-side (provider keys never touch
// the browser) and STREAMS tokens back as Server-Sent Events.
//
// TWO backends serve the same contract:
//   • supabase/functions/assistant — deployed, and what production uses.
//   • backend/src/voltmonkey/router.ts — the richer Express port, which also
//     carries the RAG step, but only runs where a Node process does.
//
// bitforbytes.in is static shared hosting: there is no Node process there, so a
// relative /api/* URL just falls through the SPA rewrite and returns index.html,
// which the bot reads as a failure and answers with the canned fallback. The
// Edge Function is therefore the default. Point VITE_VOLTMONKEY_URL at the
// Express router (e.g. /api/voltmonkey/chat behind the vite dev proxy) to use
// that one instead — locally, or once a Node host actually fronts /api.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase';

const EDGE_URL = `${SUPABASE_URL}/functions/v1/assistant`;
const FN_URL = import.meta.env.VITE_VOLTMONKEY_URL || EDGE_URL;
const TIMEOUT_MS = 45_000;

export interface AssistantMsg {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * VoltMonkey signals "send the student to this page" by ending its reply with
 * `[[GO:/path]]` (see the SITE MAP / NAVIGATION block in the backend's
 * system prompt). The tag is machine-only and must never reach the screen.
 *
 * Stripping it is fiddly because the tag can be split across SSE chunks — a
 * naive `replace` on each delta would leak "[[GO:" while the rest is still in
 * flight. So we hold back any trailing text that could still grow into a tag
 * and only release it once we know it can't.
 */
function makeTagFilter() {
  const TAG = /\[\[GO:([^\]]*)\]\]/g;
  let buf = '';
  let target: string | null = null;

  const harvest = () => {
    buf = buf.replace(TAG, (_m, p) => {
      const path = String(p).trim();
      if (path.startsWith('/')) target = path;
      return '';
    });
  };

  return {
    /** Feed a raw chunk; returns only the text that is safe to display now. */
    push(chunk: string): string {
      buf += chunk;
      harvest();
      // Hold back a trailing partial tag ("[", "[[", "[[GO:/dsd" …).
      const open = buf.lastIndexOf('[');
      if (open !== -1 && !buf.slice(open).includes(']]')) {
        const safe = buf.slice(0, open);
        buf = buf.slice(open);
        return safe;
      }
      const safe = buf;
      buf = '';
      return safe;
    },
    /** Release whatever is left once the stream ends. */
    flush(): string {
      harvest();
      const rest = buf;
      buf = '';
      return rest;
    },
    get target() {
      return target;
    },
  };
}

/**
 * Ask VoltMonkey, streaming. `onDelta` fires for each token chunk as it arrives;
 * the promise resolves with the full text. `mode: 'summary'` produces a short
 * page overview; `mode: 'chat'` answers with the conversation + pageContext.
 */
export async function askAssistant(opts: {
  messages: AssistantMsg[];
  pageContext: string;
  mode?: 'chat' | 'summary';
  onDelta?: (chunk: string) => void;
  /** Fires once if the reply carried a `[[GO:/path]]` navigation directive. */
  onNavigate?: (path: string) => void;
}): Promise<string> {
  const tags = makeTagFilter();
  const emit = (chunk: string) => {
    const safe = tags.push(chunk);
    if (safe) opts.onDelta?.(safe);
  };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  try {
    // Supabase gates functions on BOTH headers — apikey alone streams back
    // empty. The Express router ignores them, so sending them is harmless there.
    // Typed as Record<string, string> rather than spread from a ternary: the two
    // branches widen to a union that is not assignable to HeadersInit.
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (FN_URL === EDGE_URL) {
      headers.apikey = SUPABASE_ANON_KEY;
      headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`;
    }

    const res = await fetch(FN_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ messages: opts.messages, pageContext: opts.pageContext, mode: opts.mode ?? 'chat' }),
      signal: ctrl.signal,
    });

    const contentType = res.headers.get('content-type') || '';

    // Error responses come back as JSON.
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || data?.detail || `Assistant unavailable (${res.status})`);
    }

    // Non-streaming fallback (shouldn't normally happen).
    if (!contentType.includes('text/event-stream') || !res.body) {
      const data = await res.json().catch(() => ({}));
      const reply = String(data?.reply ?? '').trim();
      if (reply) {
        emit(reply);
        const tail = tags.flush();
        if (tail) opts.onDelta?.(tail);
        if (tags.target) opts.onNavigate?.(tags.target);
      }
      return reply;
    }

    // Parse the OpenAI-compatible SSE stream.
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let full = '';

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() ?? ''; // keep the last (possibly partial) line

      for (const raw of lines) {
        const line = raw.trim();
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;
        try {
          const evt = JSON.parse(payload);
          const delta: string = evt?.choices?.[0]?.delta?.content ?? '';
          if (delta) {
            full += delta;
            emit(delta);
          }
        } catch {
          /* ignore keep-alive / partial JSON */
        }
      }
    }

    // Release any held-back tail, then act on a navigation directive.
    const tail = tags.flush();
    if (tail) opts.onDelta?.(tail);
    if (tags.target) opts.onNavigate?.(tags.target);

    // `full` is the RAW text (tag included) — strip it so callers that use the
    // resolved value never render the directive.
    return full.replace(/\[\[GO:[^\]]*\]\]/g, '').trim();
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      throw new Error('That took too long — my brain is warming up. Try again in a moment ⚡');
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
