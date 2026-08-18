// VoltMonkey's brain, as an Express router. Proxies chat to an LLM so the
// provider key NEVER reaches the browser (keys live in backend/.env) and
// STREAMS tokens back. This replaces the retired Supabase Edge Function
// (supabase/functions/assistant/index.ts) as the chatbot's serving backend —
// same behavior, same fallback chain, same RAG step, ported to Node/Express.
//
// Mounted at /api/voltmonkey in app.ts:
//   GET  /api/voltmonkey/diag  — probes every configured provider+model
//   POST /api/voltmonkey/chat  — streams a chat completion (SSE passthrough)

import { Router, Request, Response as ExpressResponse } from 'express';
import { attempts, configured, type Attempt } from './providers';
import { SYSTEM } from './siteMap';
import { knowledge } from './knowledge';
import { rateLimited } from './rateLimit';

const router = Router();

interface ChatMsg {
  role: string;
  content: string;
}

// Drain an OpenAI-compatible SSE stream into the concatenated answer text.
async function collectStreamText(body: ReadableStream<Uint8Array>): Promise<string> {
  const reader = body.getReader();
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
        full += evt?.choices?.[0]?.delta?.content ?? '';
      } catch {
        /* ignore keep-alive / partial JSON */
      }
    }
  }
  return full;
}

// Strip Markdown (bold/italic/headers/code fences/links) and LaTeX ($...$,
// \times, \cdot, \rightarrow) so raw formatting symbols never reach the
// student — VoltMonkey's replies are meant to read as plain, spoken text.
function cleanMarkdownAndLatex(text: string): string {
  if (!text) return text;
  let cleaned = text;
  cleaned = cleaned.replace(/\\rightarrow|\\to|\\implies/g, '→');
  cleaned = cleaned.replace(/\\times/g, 'x');
  cleaned = cleaned.replace(/\\cdot/g, '.');
  cleaned = cleaned.replace(/\$([^$]+)\$/g, '$1');
  cleaned = cleaned.replace(/\$/g, '');
  cleaned = cleaned.replace(/\*{1,3}/g, '');
  cleaned = cleaned.replace(/#{1,6}\s*/g, '');
  // Fenced code blocks: drop ```lang / ``` markers but keep the code content.
  cleaned = cleaned.replace(/```[a-zA-Z]*\n?/g, '');
  cleaned = cleaned.replace(/```/g, '');
  // Inline code: keep the content, drop the backticks.
  cleaned = cleaned.replace(/`([^`]*)`/g, '$1');
  cleaned = cleaned.replace(/`/g, '');
  cleaned = cleaned.replace(/~~.*?~~/g, '');
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, '');
  cleaned = cleaned.replace(/[ \t]+/g, ' ').trim();
  return cleaned;
}

// Guarantee the reply ends on a real sentence boundary instead of trailing
// off mid-word/mid-clause when generation gets cut at the token budget.
function ensureCompleteSentence(text: string): string {
  if (!text) return text;
  const trimmed = text.trim();
  const validEndings = ['.', '!', '?', '⚡', '🐵', '}', ']', ')', '"', "'"];
  if (validEndings.some((e) => trimmed.endsWith(e))) return trimmed;
  const lastPunct = Math.max(trimmed.lastIndexOf('.'), trimmed.lastIndexOf('!'), trimmed.lastIndexOf('?'));
  if (lastPunct > 0 && trimmed.length - lastPunct < 120) {
    return trimmed.slice(0, lastPunct + 1);
  }
  return `${trimmed}.`;
}

// Ping one attempt with a tiny non-streaming request; report status + snippet.
async function probe(a: Attempt) {
  try {
    const r = await fetch(a.url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${a.key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: a.model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1, stream: false, ...(a.extra ?? {}) }),
    });
    const body = await r.text().catch(() => '');
    return { provider: a.provider, model: a.model, ok: r.ok, status: r.status, snippet: body.slice(0, 200) };
  } catch (e) {
    return { provider: a.provider, model: a.model, ok: false, status: 0, snippet: String(e).slice(0, 200) };
  }
}

router.get('/', (_req: Request, res: ExpressResponse) => {
  res.json({ ok: true, hint: 'POST /api/voltmonkey/chat to chat; GET /api/voltmonkey/diag for a health check.' });
});

// Diagnostics: probe every configured provider+model, no secret leaked.
router.get('/diag', async (_req: Request, res: ExpressResponse) => {
  const results = await Promise.all(attempts().map(probe));
  res.json({
    providers: configured(),
    working: results.filter((r) => r.ok).map((r) => `${r.provider}:${r.model}`),
    results,
  });
});

router.post('/chat', async (req: Request, res: ExpressResponse) => {
  try {
    const list = attempts();
    if (!list.length) {
      res.status(500).json({
        error: 'No LLM key configured — set one of GROQ_API_KEY / GEMINI_API_KEY / OPENROUTER_API_KEY / CEREBRAS_API_KEY / MISTRAL_API_KEY / HF_API_KEY in backend/.env.',
      });
      return;
    }

    const forwarded = (req.headers['x-forwarded-for'] as string | undefined) ?? '';
    const ip = forwarded.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    if (rateLimited(ip)) {
      res.status(429).json({ error: "Whoa, slow down a sec ⚡ — you've asked a lot very fast. Try again in a minute." });
      return;
    }

    const { messages = [], pageContext = '', mode = 'chat' } = req.body ?? {};

    const sys = mode === 'summary'
      ? `${SYSTEM}\n\nTASK: The student just opened this page. In 2–3 warm sentences, tell them what this page is for and one concrete thing they can do here. No greeting preamble like "Sure!".`
      : SYSTEM;

    // Retrieve supporting passages for the student's latest question.
    const lastUser = [...(Array.isArray(messages) ? messages : [])].reverse()
      .find((m: ChatMsg) => m?.role !== 'assistant')?.content ?? '';
    const kb = mode === 'summary' ? '' : await knowledge(String(lastUser));
    const kbBlock = kb
      ? `\n\nREFERENCE MATERIAL from the course notes — prefer these facts over your own memory when they are relevant, and weave them in naturally WITHOUT mentioning notes, sources or excerpt numbers. If they do not answer the question, ignore them and answer normally.\n${kb}`
      : '';

    const chat: ChatMsg[] = [
      { role: 'system', content: `${sys}\n\nPAGE CONTEXT:\n${pageContext || '(unknown page)'}${kbBlock}` },
      ...(Array.isArray(messages) ? messages : []).slice(-12).map((m: ChatMsg) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m?.content ?? '').slice(0, 4000),
      })),
    ];

    const maxTokens = mode === 'summary' ? 200 : 1024;

    // Walk the fallback chain across every configured provider+model.
    let last = { status: 0, detail: '', where: '' };
    for (const a of list) {
      const where = `${a.provider}:${a.model}`;
      let resp: globalThis.Response;
      try {
        resp = (await fetch(a.url, {
          method: 'POST',
          headers: { Authorization: `Bearer ${a.key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: a.model, messages: chat, max_tokens: maxTokens, temperature: 0.35, stream: true, ...(a.extra ?? {}) }),
        }));
      } catch (netErr) {
        last = { status: 0, detail: String(netErr), where };
        console.error(`[voltmonkey] network error on ${where}: ${String(netErr).slice(0, 200)}`);
        continue;
      }

      if (resp.ok && resp.body) {
        // Drain the provider's stream fully, clean it (strip Markdown/LaTeX,
        // guarantee a complete final sentence), then re-emit as SSE chunks —
        // same wire format as before, so the frontend needs no changes, but
        // the client only ever sees clean, complete text.
        const raw = await collectStreamText(resp.body);
        const cleaned = ensureCompleteSentence(cleanMarkdownAndLatex(raw));

        res.status(200);
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('X-VoltMonkey-Model', where);
        res.flushHeaders();

        const words = cleaned.split(' ');
        for (let i = 0; i < words.length; i++) {
          const chunk = i === words.length - 1 ? words[i] : `${words[i]} `;
          res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: chunk } }] })}\n\n`);
        }
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      }
      last = { status: resp.status, detail: (await resp.text().catch(() => '')).slice(0, 300), where };
      console.error(`[voltmonkey] ${resp.status} on ${where}: ${last.detail}`);
      // 4xx / 5xx -> try the next attempt in the chain.
    }

    console.error(`[voltmonkey] all providers failed. last=${last.status} on ${last.where}: ${last.detail}`);
    // `error` is what the chat UI actually displays to the student (see
    // frontend/src/lib/assistant.ts) -- keep it friendly and never leak a raw
    // upstream status code there. The technical detail still goes to server
    // logs above and rides along in `detail` for debugging/diagnostics.
    res.status(502).json({
      error: "VoltMonkey's brain is taking a quick break ⚡ — try asking again in a moment!",
      detail: `last: ${last.status} on ${last.where} — ${last.detail}`,
    });
  } catch (e) {
    console.error(`[voltmonkey] fatal: ${String((e as Error)?.message ?? e)}`);
    res.status(500).json({ error: String((e as Error)?.message ?? e) });
  }
});

export default router;
