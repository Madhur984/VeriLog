// Multi-provider LLM fallback chain for VoltMonkey. Every provider below is
// OpenAI-compatible, so the streaming client (frontend/src/lib/assistant.ts)
// never has to know which one answered. `attempts()` walks every configured
// provider (x its models) in order; the caller tries each until one succeeds.
//
// Set ONE OR MORE of these as backend/.env vars (only providers with a key
// are tried):
//   GROQ_API_KEY        console.groq.com/keys        (free, fast)
//   GEMINI_API_KEY      aistudio.google.com/apikey   (free, uses a Google acct)
//   OPENROUTER_API_KEY  openrouter.ai/keys           (free :free models, 1 key)
//   CEREBRAS_API_KEY    cloud.cerebras.ai            (free, 1M tokens/day)
//   MISTRAL_API_KEY     console.mistral.ai           (free, 1B tokens/month)
//   HF_API_KEY          huggingface.co               (tiny free credit; drains)
// Optional per-provider model overrides: <PROVIDER>_MODELS (comma-separated).

const splitCsv = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

export interface Provider {
  name: string;
  url: string;
  keyEnv: string;
  modelsEnv: string;
  defaults: string;
  extra?: Record<string, unknown>;
}

// Order = fallback preference (only keyed ones are used).
//
// GEMINI + `reasoning_effort: 'none'` — REQUIRED, do not drop it. The current
// Gemini flash models are THINKING models, and through this OpenAI-compat
// endpoint their chain-of-thought is streamed inside `delta.content` — so the
// learner literally watched VoltMonkey mutter "Check Constraints: One sentence?
// Yes..." instead of getting an answer. 'none' sets the thinking budget to 0
// and makes it answer directly.
export const PROVIDERS: Provider[] = [
  { name: 'groq', url: 'https://api.groq.com/openai/v1/chat/completions', keyEnv: 'GROQ_API_KEY', modelsEnv: 'GROQ_MODELS', defaults: 'llama-3.3-70b-versatile,llama-3.1-8b-instant' },
  { name: 'cerebras', url: 'https://api.cerebras.ai/v1/chat/completions', keyEnv: 'CEREBRAS_API_KEY', modelsEnv: 'CEREBRAS_MODELS', defaults: 'llama-3.3-70b,llama3.1-8b' },
  // gemini-flash-lite-latest (and gemini-3.5-flash-lite) reject the
  // reasoning_effort param outright with 400 INVALID_ARGUMENT -- verified
  // live against the API, not assumed. Every "lite" Gemini variant is
  // incompatible with it, so only non-lite thinking models belong in this
  // list until the extra-param plumbing is per-model instead of per-provider.
  { name: 'gemini', url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', keyEnv: 'GEMINI_API_KEY', modelsEnv: 'GEMINI_MODELS', defaults: 'gemini-2.5-flash,gemini-flash-latest', extra: { reasoning_effort: 'none' } },
  { name: 'openrouter', url: 'https://openrouter.ai/api/v1/chat/completions', keyEnv: 'OPENROUTER_API_KEY', modelsEnv: 'OPENROUTER_MODELS', defaults: 'meta-llama/llama-3.3-70b-instruct:free,mistralai/mistral-7b-instruct:free' },
  { name: 'mistral', url: 'https://api.mistral.ai/v1/chat/completions', keyEnv: 'MISTRAL_API_KEY', modelsEnv: 'MISTRAL_MODELS', defaults: 'mistral-small-latest,open-mistral-nemo' },
  { name: 'hf', url: 'https://router.huggingface.co/v1/chat/completions', keyEnv: 'HF_API_KEY', modelsEnv: 'HF_MODELS', defaults: 'meta-llama/Llama-3.3-70B-Instruct:novita,meta-llama/Llama-3.1-8B-Instruct:novita,Qwen/Qwen2.5-7B-Instruct' },
];

export interface Attempt {
  provider: string;
  url: string;
  key: string;
  model: string;
  extra?: Record<string, unknown>;
}

/** Build the ordered list of (provider, model) attempts from whatever keys exist. */
export function attempts(): Attempt[] {
  const out: Attempt[] = [];
  for (const p of PROVIDERS) {
    const key = process.env[p.keyEnv] ?? '';
    if (!key) continue;
    for (const model of splitCsv(process.env[p.modelsEnv] ?? p.defaults)) {
      out.push({ provider: p.name, url: p.url, key, model, extra: p.extra });
    }
  }
  return out;
}

export function configured(): Record<string, boolean> {
  const o: Record<string, boolean> = {};
  for (const p of PROVIDERS) o[p.name] = !!process.env[p.keyEnv];
  return o;
}
