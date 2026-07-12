// DUMMY's client — talks to the `assistant` Supabase Edge Function, which proxies
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
 * Ask DUMMY, streaming. `onDelta` fires for each token chunk as it arrives;
 * the promise resolves with the full text. `mode: 'summary'` produces a short
 * page overview; `mode: 'chat'` answers with the conversation + pageContext.
 */
export async function askAssistant(opts: {
  messages: AssistantMsg[];
  pageContext: string;
  mode?: 'chat' | 'summary';
  onDelta?: (chunk: string) => void;
}): Promise<string> {
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
      if (reply) opts.onDelta?.(reply);
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
            opts.onDelta?.(delta);
          }
        } catch {
          /* ignore keep-alive / partial JSON */
        }
      }
    }

    return full.trim();
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      throw new Error('That took too long — my brain is warming up. Try again in a moment ⚡');
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
