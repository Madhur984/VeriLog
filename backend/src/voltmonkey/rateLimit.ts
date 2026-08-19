// Light per-IP rate limit (best-effort; in-process memory, resets on restart).

const RL_MAX = 25;
const RL_WINDOW = 60_000;
const hits = new Map<string, number[]>();

export function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RL_WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RL_MAX;
}
