// Supabase Edge Function: `assistant`
// ---------------------------------------------------------------------------
// Byte's brain. Proxies chat to Hugging Face so the HF key NEVER reaches the
// browser (it lives as the `HF_API_KEY` function secret). STREAMS tokens back
// (Server-Sent Events, OpenAI-compatible) so replies appear as they generate.
//
// Secrets: HF_API_KEY (required), HF_MODEL (optional). verify_jwt = false.
// CORS is restricted to the BitForBytes origins below. A light in-memory
// per-IP rate limit deters casual abuse of the HF quota (resets per isolate).
// ---------------------------------------------------------------------------

const HF_API_KEY = Deno.env.get('HF_API_KEY') ?? '';
const HF_MODEL = Deno.env.get('HF_MODEL') ?? 'meta-llama/Llama-3.1-8B-Instruct';
const HF_URL = 'https://router.huggingface.co/v1/chat/completions';

// ── CORS: only these origins may call from a browser ──
const ALLOWED_ORIGINS = new Set([
  'https://bitforbytes.in',
  'https://www.bitforbytes.in',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4173',
]);
function corsHeaders(origin: string | null): Record<string, string> {
  // Echo the caller's origin only if it's allow-listed; otherwise fall back to
  // the production origin so a disallowed browser origin is blocked. (curl and
  // other non-browser callers send no Origin and are unaffected.)
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://bitforbytes.in';
  return {
    'Access-Control-Allow-Origin': allow,
    Vary: 'Origin',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

// ── Light per-IP rate limit (best-effort; per-isolate memory) ──
const RL_MAX = 25; // requests
const RL_WINDOW = 60_000; // per 60s
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RL_WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RL_MAX;
}

const SYSTEM = `You are Byte ⚡ — the friendly AI study buddy for BitForBytes, an interactive platform where students learn to design real chips (digital logic, Verilog, VLSI, basic electronics, signals).
Voice: warm, encouraging, concise, a little playful. Explain like a great teaching assistant — simple language, concrete analogies, step-by-step only when it helps.
Rules:
- Answer things related to electronics, digital/VLSI design, Verilog, the BitForBytes curriculum, or how to use the site. If a question is clearly unrelated, gently steer back to learning.
- Keep replies short (2–5 sentences) unless the student explicitly asks for depth.
- Ground answers in the PAGE CONTEXT so you're helpful about what the student is currently looking at.
- Never invent site features that aren't described. If unsure, say so and suggest where to look.`;

interface ChatMsg { role: string; content: string }

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('Origin');
  const CORS = corsHeaders(origin);
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  try {
    if (!HF_API_KEY) throw new Error('HF_API_KEY secret is not configured on the function.');

    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
    if (rateLimited(ip)) return json({ error: "Whoa, slow down a sec ⚡ — you've asked a lot very fast. Try again in a minute." }, 429);

    const { messages = [], pageContext = '', mode = 'chat' } = await req.json();

    const sys = mode === 'summary'
      ? `${SYSTEM}\n\nTASK: The student just opened this page. In 2–3 warm sentences, tell them what this page is for and one thing they can do here. No greeting preamble like "Sure!".`
      : SYSTEM;

    const chat: ChatMsg[] = [
      { role: 'system', content: `${sys}\n\nPAGE CONTEXT:\n${pageContext || '(unknown page)'}` },
      ...(Array.isArray(messages) ? messages : []).slice(-12).map((m: ChatMsg) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m?.content ?? '').slice(0, 4000),
      })),
    ];

    const hf = await fetch(HF_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${HF_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: chat,
        max_tokens: mode === 'summary' ? 220 : 512,
        temperature: 0.4,
        stream: true,
      }),
    });

    if (!hf.ok || !hf.body) {
      const detail = (await hf.text().catch(() => '')).slice(0, 400);
      return json({ error: `Hugging Face ${hf.status}`, detail }, 502);
    }

    // Pass the OpenAI-style SSE stream straight through to the browser.
    return new Response(hf.body, {
      headers: { ...CORS, 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache' },
    });
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
