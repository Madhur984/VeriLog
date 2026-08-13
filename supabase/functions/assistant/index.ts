// Supabase Edge Function: `assistant`
// ---------------------------------------------------------------------------
// VoltMonkey's brain. Proxies chat to an LLM so the provider key NEVER reaches
// the browser (keys live as Supabase secrets) and STREAMS tokens back.
//
// MULTI-PROVIDER: works with whichever free/paid LLM key you can get. Every
// provider below is OpenAI-compatible, so the browser streaming client is
// unchanged. The function walks a FALLBACK CHAIN across every provider you've
// given a key for (× its models) — the first 2xx wins; any 4xx/5xx (e.g. HF 402
// "credits depleted", or a daily-limit 429) skips to the next. Stack 2-3 free
// keys and the bot is effectively always up.
//
// Set ONE OR MORE of these secrets (only providers with a key are tried):
//   GROQ_API_KEY        console.groq.com/keys        (free, fast)
//   GEMINI_API_KEY      aistudio.google.com/apikey   (free, uses a Google acct)
//   OPENROUTER_API_KEY  openrouter.ai/keys           (free :free models, 1 key)
//   CEREBRAS_API_KEY    cloud.cerebras.ai            (free, 1M tokens/day)
//   MISTRAL_API_KEY     console.mistral.ai           (free, 1B tokens/month)
//   HF_API_KEY          huggingface.co               (tiny free credit; drains)
// Optional per-provider model overrides: <PROVIDER>_MODELS (comma-separated).
//
// Diagnostics: GET .../assistant?diag=1 pings every configured provider+model
// with a 1-token request and returns each one's HTTP status + a short error
// snippet (never the key), so you can see exactly what's working.
//
// verify_jwt = false. CORS restricted to BitForBytes origins + per-IP rate limit.
// ---------------------------------------------------------------------------

const splitCsv = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

// Provider registry. Order = fallback preference (only keyed ones are used).
// `extra` is merged into the request body for that provider only.
//
// GEMINI + `reasoning_effort: 'none'` — REQUIRED, do not drop it. The current
// Gemini flash models are THINKING models, and through this OpenAI-compat
// endpoint their chain-of-thought is streamed inside `delta.content` — so the
// learner literally watched VoltMonkey mutter "Check Constraints: One sentence?
// Yes..." instead of getting an answer. 'none' sets the thinking budget to 0
// and makes it answer directly. (Removed gemini-2.5-flash / gemini-2.0-flash:
// both now 404 with "model is no longer available".)
const PROVIDERS: { name: string; url: string; keyEnv: string; modelsEnv: string; defaults: string; extra?: Record<string, unknown> }[] = [
  { name: 'groq',       url: 'https://api.groq.com/openai/v1/chat/completions',                    keyEnv: 'GROQ_API_KEY',       modelsEnv: 'GROQ_MODELS',       defaults: 'llama-3.3-70b-versatile,llama-3.1-8b-instant' },
  { name: 'cerebras',   url: 'https://api.cerebras.ai/v1/chat/completions',                        keyEnv: 'CEREBRAS_API_KEY',   modelsEnv: 'CEREBRAS_MODELS',   defaults: 'llama-3.3-70b,llama3.1-8b' },
  { name: 'gemini',     url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', keyEnv: 'GEMINI_API_KEY', modelsEnv: 'GEMINI_MODELS',   defaults: 'gemini-flash-latest,gemini-flash-lite-latest', extra: { reasoning_effort: 'none' } },
  { name: 'openrouter', url: 'https://openrouter.ai/api/v1/chat/completions',                      keyEnv: 'OPENROUTER_API_KEY', modelsEnv: 'OPENROUTER_MODELS', defaults: 'meta-llama/llama-3.3-70b-instruct:free,mistralai/mistral-7b-instruct:free' },
  { name: 'mistral',    url: 'https://api.mistral.ai/v1/chat/completions',                         keyEnv: 'MISTRAL_API_KEY',    modelsEnv: 'MISTRAL_MODELS',    defaults: 'mistral-small-latest,open-mistral-nemo' },
  { name: 'hf',         url: 'https://router.huggingface.co/v1/chat/completions',                  keyEnv: 'HF_API_KEY',         modelsEnv: 'HF_MODELS',         defaults: 'meta-llama/Llama-3.3-70B-Instruct:novita,meta-llama/Llama-3.1-8B-Instruct:novita,Qwen/Qwen2.5-7B-Instruct' },
];

interface Attempt { provider: string; url: string; key: string; model: string; extra?: Record<string, unknown> }

// Build the ordered list of (provider, model) attempts from whatever keys exist.
function attempts(): Attempt[] {
  const out: Attempt[] = [];
  for (const p of PROVIDERS) {
    const key = Deno.env.get(p.keyEnv) ?? '';
    if (!key) continue;
    for (const model of splitCsv(Deno.env.get(p.modelsEnv) ?? p.defaults)) {
      out.push({ provider: p.name, url: p.url, key, model, extra: p.extra });
    }
  }
  return out;
}

function configured(): Record<string, boolean> {
  const o: Record<string, boolean> = {};
  for (const p of PROVIDERS) o[p.name] = !!Deno.env.get(p.keyEnv);
  return o;
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
      body: JSON.stringify({ model: a.model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1, stream: false, ...(a.extra ?? {}) }),
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
    const results = await Promise.all(attempts().map(probe));
    return json({
      providers: configured(),
      working: results.filter((r) => r.ok).map((r) => `${r.provider}:${r.model}`),
      results,
    });
  }

  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  try {
    const list = attempts();
    if (!list.length) throw new Error('No LLM key configured — set one of GROQ_API_KEY / GEMINI_API_KEY / OPENROUTER_API_KEY / CEREBRAS_API_KEY / MISTRAL_API_KEY / HF_API_KEY as a function secret.');

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
          body: JSON.stringify({ model: a.model, messages: chat, max_tokens: maxTokens, temperature: 0.45, stream: true, ...(a.extra ?? {}) }),
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
