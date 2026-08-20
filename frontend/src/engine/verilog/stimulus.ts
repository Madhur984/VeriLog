/**
 * Deterministic stimulus generation for the Verilog judge.
 *
 * Grading is differential — the student's design and the reference solution are
 * driven with the SAME vectors and their outputs compared — so the only thing a
 * problem must supply is a description of how wide its ports are and roughly how
 * to exercise them. Everything here is seeded, so a given problem always
 * produces the same test suite: a student who fails on vector 37 sees the same
 * vector 37 on the next run, and the waveform they inspect is the one they were
 * graded on.
 *
 * Strategy, in order of preference:
 *   - Exhaustive when the whole input space is small (<= EXHAUSTIVE_BITS bits).
 *   - Otherwise: directed rows first (authored corner cases), then a corner-value
 *     sweep (0, 1, max, max-1, 0x55/0xAA patterns, walking ones), then seeded
 *     random fill. Corner values matter far more than volume for hardware bugs —
 *     overflow, all-zeros, all-ones and single-bit cases are where designs break.
 */

export interface StimPort {
  name: string;
  width: number;
}

export interface StimulusSpec {
  /** Force a mode; by default it is chosen from the total input width. */
  mode?: 'exhaustive' | 'vectors' | 'sequential';
  /** Sequential: number of clock cycles to run. */
  cycles?: number;
  /** Combinational: number of vectors when not exhaustive. */
  vectors?: number;
  /** Seed for the deterministic PRNG. */
  seed?: number;
  /** Authored rows applied first, verbatim. Missing ports default to 0. */
  directed?: Record<string, number | bigint>[];
  /** Sequential: hold the reset asserted for this many leading cycles. */
  resetCycles?: number;
  /**
   * Ports the student's design may legitimately disagree on for some inputs
   * (e.g. a "don't care" output). Compared only where `careWhen` allows.
   */
  dontCareOutputs?: string[];
}

/** One driven vector: port name -> value (already masked to the port width). */
export type Vector = Record<string, bigint>;

/** Total input space we are willing to enumerate exhaustively (2^14 = 16384). */
const EXHAUSTIVE_BITS = 14;
const DEFAULT_VECTORS = 256;
const DEFAULT_CYCLES = 32;

const maskOf = (w: number): bigint => (1n << BigInt(Math.max(0, w))) - 1n;

/** mulberry32 — small, fast, and stable across engines so runs are reproducible. */
function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A random value of the given width, built 30 bits at a time. */
function randValue(rng: () => number, width: number): bigint {
  let v = 0n;
  for (let got = 0; got < width; got += 30) {
    v = (v << 30n) | BigInt(Math.floor(rng() * 0x40000000));
  }
  return v & maskOf(width);
}

/**
 * Interesting values for a port of the given width — the places hardware breaks.
 * Deduplicated and ordered cheapest-to-most-exotic.
 */
export function cornerValues(width: number): bigint[] {
  const m = maskOf(width);
  const out: bigint[] = [0n, 1n, m];
  if (width > 1) {
    out.push(m - 1n);                       // one below all-ones
    out.push(1n << BigInt(width - 1));      // MSB only (sign bit / overflow edge)
    out.push((1n << BigInt(width - 1)) - 1n); // largest positive when signed
  }
  if (width >= 8) {
    // alternating patterns catch bit-order and byte-lane mistakes
    let a = 0n;
    for (let i = 0; i < width; i += 2) a |= 1n << BigInt(i);
    out.push(a & m, (~a) & m);
  }
  // walking ones (bounded so wide ports don't explode the suite)
  for (let i = 0; i < Math.min(width, 8); i++) out.push(1n << BigInt(i));
  return [...new Set(out.map((v) => (v & m).toString()))].map((s) => BigInt(s));
}

const totalBits = (ports: StimPort[]): number => ports.reduce((n, p) => n + p.width, 0);

/** Whether the input space is small enough to enumerate completely. */
export function canBeExhaustive(ports: StimPort[]): boolean {
  return totalBits(ports) <= EXHAUSTIVE_BITS;
}

function normalizeDirected(rows: Record<string, number | bigint>[] | undefined, ports: StimPort[]): Vector[] {
  if (!rows?.length) return [];
  return rows.map((row) => {
    const v: Vector = {};
    for (const p of ports) {
      const raw = row[p.name];
      v[p.name] = (raw == null ? 0n : BigInt(raw)) & maskOf(p.width);
    }
    return v;
  });
}

const keyOf = (v: Vector, ports: StimPort[]): string => ports.map((p) => v[p.name].toString(16)).join(',');

/**
 * Build the combinational test suite for a set of input ports.
 * Exhaustive when small; otherwise directed + corner sweep + seeded random.
 */
export function buildVectors(ports: StimPort[], spec: StimulusSpec = {}): Vector[] {
  if (!ports.length) return [{}];
  const mode = spec.mode ?? (canBeExhaustive(ports) ? 'exhaustive' : 'vectors');

  if (mode === 'exhaustive' && canBeExhaustive(ports)) {
    const bits = totalBits(ports);
    const out: Vector[] = [];
    for (let m = 0; m < (1 << bits); m++) {
      const v: Vector = {};
      let shift = 0;
      // last port occupies the low bits, so counting sweeps it fastest
      for (let i = ports.length - 1; i >= 0; i--) {
        const p = ports[i];
        v[p.name] = BigInt((m >> shift) & Number(maskOf(p.width)));
        shift += p.width;
      }
      out.push(v);
    }
    return out;
  }

  const rng = makeRng(spec.seed ?? 0x5eed);
  const seen = new Set<string>();
  const out: Vector[] = [];
  const push = (v: Vector) => {
    const k = keyOf(v, ports);
    if (seen.has(k)) return;
    seen.add(k);
    out.push(v);
  };

  for (const v of normalizeDirected(spec.directed, ports)) push(v);

  // Corner sweep: every port's corner values, with the others held at a corner too.
  const corners = ports.map((p) => cornerValues(p.width));
  const rounds = Math.max(...corners.map((c) => c.length));
  for (let r = 0; r < rounds; r++) {
    // same index across all ports (0/0, 1/1, max/max …) then rotated pairings
    for (const rot of [0, 1, 2]) {
      const v: Vector = {};
      ports.forEach((p, i) => { v[p.name] = corners[i][(r + rot * i) % corners[i].length]; });
      push(v);
    }
  }

  const target = spec.vectors ?? DEFAULT_VECTORS;
  let guard = 0;
  while (out.length < target && guard++ < target * 20) {
    const v: Vector = {};
    for (const p of ports) v[p.name] = randValue(rng, p.width);
    push(v);
  }
  return out;
}

export interface SeqStimulusOptions extends StimulusSpec {
  /** Reset port held asserted for the leading cycles, if the problem has one. */
  reset?: { name: string; activeLow: boolean };
}

/**
 * Build a per-cycle stimulus program for a clocked design.
 *
 * The reset is asserted for the leading cycles and deasserted afterwards so the
 * design starts from a defined state; the rest of the run mixes authored rows,
 * corner values and seeded random data. Control-ish ports (1 bit) are biased
 * toward staying asserted for a few cycles at a time rather than toggling every
 * cycle, which is what actually exercises counters, shift registers and FSMs.
 */
export function buildSeqVectors(ports: StimPort[], spec: SeqStimulusOptions = {}): Vector[] {
  const cycles = spec.cycles ?? DEFAULT_CYCLES;
  const rng = makeRng(spec.seed ?? 0xc10c);
  const resetCycles = spec.resetCycles ?? (spec.reset ? 2 : 0);
  const directed = normalizeDirected(spec.directed, ports);

  const rows: Vector[] = [];
  // `hold` keeps each 1-bit control steady for a run of cycles instead of
  // dithering, so enables/loads stay asserted long enough to be observable.
  const hold: Record<string, { value: bigint; left: number }> = {};

  for (let c = 0; c < cycles; c++) {
    if (c < directed.length) {
      rows.push({ ...directed[c] });
      continue;
    }
    const v: Vector = {};
    for (const p of ports) {
      if (spec.reset && p.name === spec.reset.name) {
        const asserted = c < resetCycles;
        const on = spec.reset.activeLow ? 0n : 1n;
        const off = spec.reset.activeLow ? 1n : 0n;
        v[p.name] = asserted ? on : off;
        continue;
      }
      if (p.width === 1) {
        const h = hold[p.name];
        if (!h || h.left <= 0) {
          hold[p.name] = { value: rng() < 0.6 ? 1n : 0n, left: 1 + Math.floor(rng() * 3) };
        }
        hold[p.name].left--;
        v[p.name] = hold[p.name].value;
      } else {
        // mix corner values into wide ports rather than pure noise
        const cv = cornerValues(p.width);
        v[p.name] = rng() < 0.35 ? cv[Math.floor(rng() * cv.length)] : randValue(rng, p.width);
      }
    }
    rows.push(v);
  }

  // Guarantee the reset is exercised again mid-run (recovery is a common bug).
  if (spec.reset && cycles > 8) {
    const at = Math.floor(cycles * 0.6);
    rows[at] = { ...rows[at], [spec.reset.name]: spec.reset.activeLow ? 0n : 1n };
  }
  return rows;
}
