// Supabase Edge Function: `assistant`
// ---------------------------------------------------------------------------
// VoltMonkey's brain. Proxies chat to an LLM so the provider key NEVER reaches
// the browser (it lives as a Supabase secret) and STREAMS tokens back.
//
// MULTI-PROVIDER: prefers Groq (has a real free tier) when GROQ_API_KEY is set,
// and falls back to Hugging Face when HF_API_KEY is set. Both are OpenAI-
// compatible, so the browser streaming client is unchanged. We walk a FALLBACK
// CHAIN across every configured provider × model — the first 2xx wins; any
// 4xx/5xx (e.g. HF 402 "credits depleted") skips to the next.
//
// Why: HF's free Inference-Providers credits drain quickly and then every model
// returns 402. Groq's free tier keeps the bot alive at no cost. Set the
// GROQ_API_KEY secret (free key from https://console.groq.com/keys) and the bot
// switches to Groq automatically.
//
// Diagnostics: GET .../assistant?diag=1 pings every configured provider+model
// with a 1-token request and returns each one's HTTP status + a short error
// snippet (never the key), so an operator can see exactly what's failing.
//
// Secrets: GROQ_API_KEY and/or HF_API_KEY (at least one required).
// Optional: GROQ_MODELS, HF_MODELS (comma-separated overrides). verify_jwt=false.
// CORS restricted to BitForBytes origins + a light per-IP rate limit.
// ---------------------------------------------------------------------------

const GROQ_KEY = Deno.env.get('GROQ_API_KEY') ?? '';
const HF_KEY = Deno.env.get('HF_API_KEY') ?? '';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const HF_URL = 'https://router.huggingface.co/v1/chat/completions';

const splitCsv = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

const GROQ_MODELS = splitCsv(Deno.env.get('GROQ_MODELS') ?? 'llama-3.3-70b-versatile,llama-3.1-8b-instant');
const HF_MODELS = splitCsv(Deno.env.get('HF_MODELS') ??
  'meta-llama/Llama-3.3-70B-Instruct:novita,meta-llama/Llama-3.1-8B-Instruct:novita,meta-llama/Llama-3.3-70B-Instruct,Qwen/Qwen2.5-7B-Instruct');

interface Attempt { provider: string; url: string; key: string; model: string }

// Build the ordered list of (provider, model) attempts from whatever keys exist.
function attempts(): Attempt[] {
  const out: Attempt[] = [];
  if (GROQ_KEY) for (const model of GROQ_MODELS) out.push({ provider: 'groq', url: GROQ_URL, key: GROQ_KEY, model });
  if (HF_KEY) for (const model of HF_MODELS) out.push({ provider: 'hf', url: HF_URL, key: HF_KEY, model });
  return out;
}

const ALLOWED_ORIGINS = new Set([
  'https://bitforbytes.in',
  'https://www.bitforbytes.in',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4173',
]);
function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://bitforbytes.in';
  return {
    'Access-Control-Allow-Origin': allow,
    Vary: 'Origin',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
}

// Light per-IP rate limit (best-effort; per-isolate memory).
const RL_MAX = 25;
const RL_WINDOW = 60_000;
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RL_WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RL_MAX;
}

const SYSTEM = `You are **VoltMonkey** ⚡, the AI study buddy for **BitForBytes** — an interactive platform where students (mostly ECE / engineering students in India) learn to design real chips from zero.

WHAT BITFORBYTES TEACHES (use this to answer "what is this / what next"):
• Foundation modules — signals (analog vs digital), number systems (binary/hex, 2's complement), logic gates, Boolean algebra, K-maps, working toward building a CPU.
• Basic Electronics — diodes, rectifiers, Zener, LEDs, and transistors (BJT, MOSFET, JFET): real-world analogies first, then the math.
• Digital System Design (DSD) — half/full adders, ripple-carry, carry-lookahead, parallel-prefix & serial adders; subtractors; complements & BCD; combinational blocks (MUX, DEMUX, decoders, encoders, code converters, Shannon's expansion).
• Verilog / Hardware-LeetCode — write Verilog and run it against test cases in the judge.
• Tools — Logic Workbench (drag & wire gates), K-Map Lab, Signal/Logic Studio, and a Career Roadmap for VLSI paths.
Every lesson goes: intuitive ANALOGY → build it yourself → plain-language recap.

HOW YOU TEACH:
• Warm, encouraging, a little playful — a great TA, never a dry textbook.
• Use the simplest language that's still correct; lead with a concrete analogy or example.
• Be concise by default (2–5 sentences). Give full step-by-step derivations, truth tables, or Verilog ONLY when the student asks to go deeper.
• When it genuinely helps, show a tiny Verilog/Boolean snippet in a code block.
• When natural, end with a small nudge to try something on the current page.

RULES:
• Stay within electronics, digital/VLSI design, Verilog, math-for-EE, and using BitForBytes. If a question is clearly off-topic, answer in one friendly line and steer back to learning.
• Ground every answer in the PAGE CONTEXT — be specific about what the student is looking at right now.
• Never invent site features or pages you weren't told about; if unsure where something is, say so and point them to the Workstation (portal).
• Never output harmful, unsafe, or dishonest content.`;

interface ChatMsg { role: string; content: string }

// Ping one attempt with a tiny non-streaming request; report status + snippet.
async function probe(a: Attempt): Promise<{ provider: string; model: string; ok: boolean; status: number; snippet: string }> {
  try {
    const r = await fetch(a.url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${a.key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: a.model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1, stream: false }),
    });
    const body = await r.text().catch(() => '');
    return { provider: a.provider, model: a.model, ok: r.ok, status: r.status, snippet: body.slice(0, 200) };
  } catch (e) {
    return { provider: a.provider, model: a.model, ok: false, status: 0, snippet: String(e).slice(0, 200) };
  }
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('Origin');
  const CORS = corsHeaders(origin);
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  // ── Diagnostics: GET ?diag=1 — probe every attempt, no secret leaked ────────
  if (req.method === 'GET') {
    const url = new URL(req.url);
    if (url.searchParams.get('diag') !== '1') {
      return json({ ok: true, hint: 'POST to chat; GET ?diag=1 for a health check.' });
    }
    const list = attempts();
    const results = await Promise.all(list.map(probe));
    return json({
      providers: { groq: !!GROQ_KEY, hf: !!HF_KEY },
      working: results.filter((r) => r.ok).map((r) => `${r.provider}:${r.model}`),
      results,
    });
  }

  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  try {
    const list = attempts();
    if (!list.length) throw new Error('No LLM key configured — set the GROQ_API_KEY (or HF_API_KEY) secret on the function.');

    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
    if (rateLimited(ip)) return json({ error: "Whoa, slow down a sec ⚡ — you've asked a lot very fast. Try again in a minute." }, 429);

    const { messages = [], pageContext = '', mode = 'chat' } = await req.json();

    const sys = mode === 'summary'
      ? `${SYSTEM}\n\nTASK: The student just opened this page. In 2–3 warm sentences, tell them what this page is for and one concrete thing they can do here. No greeting preamble like "Sure!".`
      : SYSTEM;

    const chat: ChatMsg[] = [
      { role: 'system', content: `${sys}\n\nPAGE CONTEXT:\n${pageContext || '(unknown page)'}` },
      ...(Array.isArray(messages) ? messages : []).slice(-12).map((m: ChatMsg) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m?.content ?? '').slice(0, 4000),
      })),
    ];

    const maxTokens = mode === 'summary' ? 200 : 512;

    // Walk the fallback chain across every configured provider+model.
    let last = { status: 0, detail: '', where: '' };
    for (const a of list) {
      const where = `${a.provider}:${a.model}`;
      let resp: Response;
      try {
        resp = await fetch(a.url, {
          method: 'POST',
          headers: { Authorization: `Bearer ${a.key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: a.model, messages: chat, max_tokens: maxTokens, temperature: 0.45, stream: true }),
        });
      } catch (netErr) {
        last = { status: 0, detail: String(netErr), where };
        console.error(`[assistant] network error on ${where}: ${String(netErr).slice(0, 200)}`);
        continue;
      }

      if (resp.ok && resp.body) {
        return new Response(resp.body, {
          headers: { ...CORS, 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache', 'X-VoltMonkey-Model': where },
        });
      }
      last = { status: resp.status, detail: (await resp.text().catch(() => '')).slice(0, 300), where };
      console.error(`[assistant] ${resp.status} on ${where}: ${last.detail}`);
      // 4xx / 5xx → try the next attempt in the chain.
    }

    console.error(`[assistant] all providers failed. last=${last.status} on ${last.where}: ${last.detail}`);
    return json({ error: `All models unavailable (last: ${last.status} on ${last.where})`, detail: last.detail }, 502);
  } catch (e) {
    console.error(`[assistant] fatal: ${String((e as Error)?.message ?? e)}`);
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
