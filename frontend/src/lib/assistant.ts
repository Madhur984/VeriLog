// VoltMonkey's client — talks to the `assistant` Supabase Edge Function, which proxies
// Hugging Face server-side (the HF key never touches the browser) and STREAMS
// tokens back as Server-Sent Events. See supabase/functions/assistant/index.ts.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase';

const FN_URL = `${SUPABASE_URL}/functions/v1/assistant`;
const TIMEOUT_MS = 45_000;

export interface AssistantMsg {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * VoltMonkey signals "send the student to this page" by ending its reply with
 * `[[GO:/path]]` (see the SITE MAP / NAVIGATION block in the Edge Function's
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
    const res = await fetch(FN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
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
