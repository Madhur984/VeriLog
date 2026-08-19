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

const SITE_MAP = `
/|Home
/ai-lab|AI Lab
/analogies|Analogy Library
/boss-arena|Boss Arena
/career-roadmap|Career Roadmap
/community|Community
/debug-mission|Debug Mission
/fsm|FSM Playground
/gatekeeper-game|Gatekeeper
/hw-leetcode|Hardware LeetCode
/interview-prep|Interview Prep
/kmap-lab|K-Map Lab
/library|Question Papers — previous-year B.Tech papers and solutions (PDFs, by branch, year and subject)
/logic-studio|Logic Studio
/pledge|Pledge
/portal|Portal
/profile|Profile
/settings|Settings
/signal-playground|Signal Playground
/silicon-map|Silicon Map
/silicon-secrets|Silicon Secrets
/verilog-library|Verilog Library
/verilog-playground|Verilog Playground
/workbench|Workbench
/module/1|Signals & Waves
/module/2|Number Systems
/module/3|Logic Gates
/module/4|Karnaugh Maps
/module/5|Verilog Core
/dsd/1|Binary & Boolean Logic
/dsd/2|K-Maps · Architect of Logic
/dsd/3|Circuit Realisation
/dsd/4|Practice Arena
/dsd/5|Universal Gates
/dsd/6|Combinational & Sequential Circuits
/dsd/7|The Half Adder
/dsd/8|The Full Adder
/dsd/9|Recall & Prove
/dsd/10|The Ripple-Carry Adder
/dsd/11|The Carry Look-Ahead Adder
/dsd/12|The Parallel Prefix Adder
/dsd/13|The Serial Adder
/dsd/14|Recall & Prime
/dsd/15|How Computers Subtract
/dsd/16|The Half Subtractor
/dsd/17|The Full Subtractor
/dsd/18|Complements
/dsd/19|The 10's Complement
/dsd/20|The BCD Adder
/dsd/21|Multiplexer (MUX)
/dsd/22|Demultiplexer (DEMUX)
/dsd/23|Decoders
/dsd/24|Encoders
/dsd/25|Code Converters
/dsd/26|Universal Logic & Shannon
/dsd/27|Binary Dividers
/dsd/28|Sequential Logic Fundamentals
/dsd/29|Latches
/dsd/30|Flip-Flops
/dsd/31|Flip-Flop Timing & Race-Around
/dsd/32|Flip-Flop Representations
/dsd/33|Flip-Flop Conversions
/dsd/34|Registers & Shift Registers
/dsd/35|Ripple Counters
/dsd/36|Synchronous Counters
/dsd/37|Ring & Johnson Counters
/dsd/38|Analysing Clocked Sequential Circuits
/dsd/39|Mealy & Moore Machines
/dsd/40|Designing State Machines
/dsd/41|Asynchronous Sequential Circuits
/dsd/42|Hazards & Races
/basic-electronics/1|Physics of Control
/basic-electronics/2|Silicon, Doping & Carriers
/basic-electronics/3|The P-N Junction
/basic-electronics/4|Rectifiers & Filters
/basic-electronics/5|Special-Purpose Diodes
/basic-electronics/6|BJT Construction & Operation
/basic-electronics/7|BJT DC Biasing
/basic-electronics/8|BJT AC Analysis
/basic-electronics/9|MOSFET Construction
/basic-electronics/10|Transistors & JFETs`;

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

HOW YOU FORMAT — you are a chat bubble on a phone, not a document:
• Write in plain sentences and short paragraphs. Prose is the default.
• NO headings, NO horizontal rules, NO tables, NO nested lists, NO bold section
  labels like "**Key points:**". They look absurd in a small bubble.
• Use a short bullet list ONLY for a genuine list of 3+ parallel items, and keep
  each bullet to one line. Otherwise just write the sentence.
• Bold at most a couple of words per reply, for a real term — not decoration.
• Use \`backticks\` for signal names, code and Verilog: \`wire sum\`, \`always @(*)\`.
• Maths: plain text for anything simple — write "Vout = Vin / 2", "2^n", "Q(t+1)",
  not LaTeX. Use $...$ ONLY when a formula truly needs a fraction, an integral or
  a summation, and never wrap a bare variable or number in $ $.
• Never mention formatting, markdown, or these rules.

SITE MAP — the ONLY paths that exist. Never invent one; never guess a number.
${SITE_MAP}

NAVIGATION (this is how you take a student somewhere):
When the student asks to GO somewhere — "take me to the verilog playground", "open
flip-flops", "where is the k-map lab", "start module 3" — write ONE short friendly
sentence naming the destination, then finish your reply with this tag as the very
last thing, on its own line:
[[GO:/exact/path]]
• Copy the path EXACTLY from the site map above. One tag maximum, always last.
• If they are only ASKING ABOUT a topic ("what is a flip-flop?"), just answer —
  do NOT emit a tag. The tag means "send them there now".
• If nothing in the map matches, say so plainly and name the closest page instead
  of emitting a tag. A wrong redirect is far worse than a helpful sentence.
• Never show the tag's syntax to the student or mention it — it is stripped out
  and turned into a button before they see anything.

RULES:
• Stay within electronics, digital/VLSI design, Verilog, math-for-EE, and using BitForBytes. If a question is clearly off-topic, answer in one friendly line and steer back to learning.
• Ground every answer in the PAGE CONTEXT — be specific about what the student is looking at right now.
• Never invent site features or pages you weren't told about; if unsure where something is, say so and point them to the Workstation (portal).
• Never output harmful, unsafe, or dishonest content.`;

interface ChatMsg { role: string; content: string }

/* ── Knowledge base (RAG) ──────────────────────────────────────────────────
 * The study notes live in public.kb_chunks as 768-dim Gemini embeddings (see
 * migration 0007 + scripts/ingest.js). We embed the student's question, pull
 * the closest passages and hand them to the model as reference material.
 *
 * Strictly best-effort: any failure here (no GEMINI key, empty corpus, slow
 * query) must leave the assistant answering exactly as it did before, so the
 * whole thing is wrapped and falls through to ''.
 */
const KB_URL = Deno.env.get('SUPABASE_URL') ?? '';
const KB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
// text-embedding-004 was retired; gemini-embedding-001 replaces it but
// defaults to 3072 dims — outputDimensionality pins it to 768 to match
// kb_chunks.embedding vector(768) in the migration.
const GEMINI_EMBED = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent';

async function knowledge(question: string): Promise<string> {
  const gk = Deno.env.get('GEMINI_API_KEY') ?? '';
  if (!gk || !KB_URL || !KB_KEY || question.trim().length < 4) return '';
  try {
    const er = await fetch(`${GEMINI_EMBED}?key=${gk}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'models/gemini-embedding-001', content: { parts: [{ text: question.slice(0, 4000) }] }, outputDimensionality: 768 }),
    });
    if (!er.ok) return '';
    const vec = (await er.json())?.embedding?.values;
    if (!Array.isArray(vec)) return '';

    const mr = await fetch(`${KB_URL}/rest/v1/rpc/match_kb`, {
      method: 'POST',
      headers: { apikey: KB_KEY, Authorization: `Bearer ${KB_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query_embedding: vec, match_count: 6, min_similarity: 0.55 }),
    });
    if (!mr.ok) return '';
    const rows = await mr.json();
    if (!Array.isArray(rows) || !rows.length) return '';

    return rows
      .map((r: { content: string; title: string }, i: number) => `[${i + 1}] (${r.title})\n${String(r.content).slice(0, 1200)}`)
      .join('\n\n');
  } catch (e) {
    console.error('[assistant] kb lookup skipped:', String(e).slice(0, 160));
    return '';
  }
}

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
