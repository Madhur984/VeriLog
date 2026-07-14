// Supabase Edge Function: `assistant`
// ---------------------------------------------------------------------------
// VoltMonkey's brain. Proxies chat to Hugging Face so the HF key NEVER reaches the
// browser (it lives as the `HF_API_KEY` secret) and STREAMS tokens back.
//
// 402 fix: HF's auto provider randomly lands on paid providers → 402 once the
// free credit is drained. So we PIN a known-good provider (Novita) and walk a
// FALLBACK CHAIN — the first model that returns a 2xx wins; 402/4xx/5xx skip to
// the next. Override with the `HF_MODELS` secret (comma-separated).
//
// Secrets: HF_API_KEY (required), HF_MODELS (optional). verify_jwt = false.
// CORS restricted to BitForBytes origins + a light per-IP rate limit.
// ---------------------------------------------------------------------------

const HF_API_KEY = Deno.env.get('HF_API_KEY') ?? '';
const HF_URL = 'https://router.huggingface.co/v1/chat/completions';

// Ordered best → most-reliable fallback. All verified 200 on the free tier.
const MODELS = (Deno.env.get('HF_MODELS') ??
  [
    'meta-llama/Llama-3.3-70B-Instruct:novita', // smart + pinned → deterministic
    'meta-llama/Llama-3.1-8B-Instruct:novita',  // lighter, same provider
    'meta-llama/Llama-3.3-70B-Instruct',        // auto provider
    'Qwen/Qwen2.5-7B-Instruct',                 // auto provider
    'meta-llama/Llama-3.1-8B-Instruct',         // auto provider (last resort)
  ].join(',')
).split(',').map((s) => s.trim()).filter(Boolean);

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // Walk the fallback chain: first model that streams (2xx) wins.
    let last = { status: 0, detail: '', model: '' };
    for (const model of MODELS) {
      let hf: Response;
      try {
        hf = await fetch(HF_URL, {
          method: 'POST',
          headers: { Authorization: `Bearer ${HF_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, messages: chat, max_tokens: maxTokens, temperature: 0.45, stream: true }),
        });
      } catch (netErr) {
        last = { status: 0, detail: String(netErr), model };
        continue;
      }

      if (hf.ok && hf.body) {
        return new Response(hf.body, {
          headers: { ...CORS, 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache', 'X-VoltMonkey-Model': model },
        });
      }
      last = { status: hf.status, detail: (await hf.text().catch(() => '')).slice(0, 300), model };
      // 402 / 4xx / 5xx → try the next model in the chain.
    }

    return json({ error: `All models unavailable (last: HF ${last.status} on ${last.model})`, detail: last.detail }, 502);
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
