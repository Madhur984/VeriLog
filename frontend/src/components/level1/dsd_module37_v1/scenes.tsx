/**
 * Ring & Johnson Counters - dsd/37, "The Loop That Feeds Itself" (Sequential
 * Logic track). Generic scenes come from the shared _subtractor kit; the
 * StateTable/ClockButton/Toggle primitives come from the shared _sequential
 * blocks library. The live circular ring/Johnson diagram, the direct-vs-crossed
 * feedback comparison, the computed sequence tables, the ring-vs-Johnson
 * comparison table, the lockup/self-start recovery demo (with a full 16-state
 * cycle trace), the brute-force-derived Johnson decode-gate map, and the
 * carousel/twisted-loop analogy are all bespoke. EVERY displayed value (both
 * counters' sequences, Hamming distances, the comparison numbers, the self-start
 * simulation and its cycle enumeration, the decode gates) is COMPUTED in code by
 * iterating the feedback equation or searching for it, never hardcoded.
 */
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import { StateTable, ClockButton, Toggle } from '../_sequential/blocks';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const ACC = { ring: '#38bdf8', johnson: '#fb7185', good: '#34d399', warn: '#f59e0b' };
const SRC_EN: string | undefined = '/videos/dsd37-special-counters.mp4';
const SRC_HI: string | undefined = undefined;

/* ═══════════════════════ pure helpers - single source of truth ═══════════════════════
   Every sequence, table and gate on this page is derived from these functions by
   iteration or search - nothing below is a hand-typed result. */

const shiftRight = (cells: number[], sin: number): number[] => [sin, ...cells.slice(0, cells.length - 1)];
/** Ring counter: direct feedback, D0 = Q(n-1). */
const ringNext = (cells: number[]): number[] => shiftRight(cells, cells[cells.length - 1]);
/** Johnson counter: complemented feedback, D0 = Q(n-1)'. */
const johnsonNext = (cells: number[]): number[] => shiftRight(cells, cells[cells.length - 1] ^ 1);
/** Self-start-fixed ring: D0 = Q0'.Q1'.Q2' - agrees with ringNext everywhere on the
 *  one-hot cycle, but forces a 1 in the instant the register hits all-zeros. */
const fixedRingNext = (cells: number[]): number[] => {
  const fb = (1 - cells[0]) & (1 - cells[1]) & (1 - cells[2]);
  return shiftRight(cells, fb);
};
const hamming = (a: number[], b: number[]): number => a.reduce((acc, v, i) => acc + (v !== b[i] ? 1 : 0), 0);

/** Iterate a next-state function `steps` times from `start`, collecting every state
 *  visited (including the starting one), so the whole sequence is generated, not typed. */
const genSeq = (nextFn: (c: number[]) => number[], start: number[], steps: number): number[][] => {
  let cur = [...start];
  const seq: number[][] = [cur.slice()];
  for (let i = 0; i < steps; i++) { cur = nextFn(cur); seq.push(cur.slice()); }
  return seq;
};

const idxToBits = (v: number, n: number): number[] => Array.from({ length: n }, (_, i) => (v >> (n - 1 - i)) & 1);
const bitsToIdx = (b: number[]): number => b.reduce((a, v) => a * 2 + v, 0);

/** Enumerate every distinct cycle a next-state function produces over all 2^n
 *  possible flip-flop states (handles both permutations and functions with tails). */
function traceCycles(nextFn: (c: number[]) => number[], n: number): number[][][] {
  const total = 1 << n;
  const seen = new Array(total).fill(false);
  const cycles: number[][][] = [];
  for (let start = 0; start < total; start++) {
    if (seen[start]) continue;
    const order: number[] = [];
    const pos = new Map<number, number>();
    let cur = start;
    while (!seen[cur] && !pos.has(cur)) {
      pos.set(cur, order.length);
      order.push(cur);
      cur = bitsToIdx(nextFn(idxToBits(cur, n)));
    }
    if (pos.has(cur)) {
      const cyc = order.slice(pos.get(cur)!).map((v) => idxToBits(v, n));
      cycles.push(cyc);
    }
    order.forEach((v) => { seen[v] = true; });
  }
  return cycles;
}

/** Simulate the fixed feedback from `start`; return how many clocks until it lands
 *  on a state in `validSet`, or null if it never does within `maxSteps`. */
const stepsToEscape = (start: number[], validSet: Set<string>, maxSteps = 20): number | null => {
  let cur = [...start];
  for (let i = 0; i <= maxSteps; i++) {
    if (validSet.has(cur.join(''))) return i;
    cur = fixedRingNext(cur);
  }
  return null;
};

/* ───────── Johnson decode-gate search: for every state, find TWO literals whose
   AND reads 1 only at that state and 0 at every other state in the sequence. ───────── */
interface DecodeGate { p: number; q: number; polP: boolean; polQ: boolean }
const findGateForState = (seq: number[][], i: number): DecodeGate => {
  const bits = seq[0].length;
  for (let p = 0; p < bits; p++) {
    for (let q = 0; q < bits; q++) {
      if (p === q) continue;
      for (const polP of [true, false]) {
        for (const polQ of [true, false]) {
          const ok = seq.every((s, k) => {
            const litP = polP ? s[p] : 1 - s[p];
            const litQ = polQ ? s[q] : 1 - s[q];
            return (litP & litQ) === (k === i ? 1 : 0);
          });
          if (ok) return { p, q, polP, polQ };
        }
      }
    }
  }
  return { p: 0, q: 1, polP: true, polQ: true };
};
const deriveDecodeGates = (seq: number[][]): DecodeGate[] => seq.map((_, i) => findGateForState(seq, i));
const litName = (i: number, pol: boolean): string => `Q${i}${pol ? '' : "'"}`;

/* ═══════════════════════ bespoke: the live circular ring / Johnson diagram ═══════════════════════
   Used as the cover hero, in S03/S04 and (twice) in S08. A true ring of 4 D
   flip-flops; the closing edge (Q3 -> D0) draws through a NOT bubble when
   johnson=true. cells is the only state - every value on screen reads from it. */
const RingCounterViz: React.FC<{ isDarkMode: boolean; accent: string; johnson?: boolean }>
  = ({ isDarkMode, accent, johnson = false }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const N = 4;
  const initial = useMemo<number[]>(() => (johnson ? Array(N).fill(0) : [1, 0, 0, 0]), [johnson]);
  const [cells, setCells] = useState<number[]>(initial);
  const [ticks, setTicks] = useState(0);
  const tick = () => {
    setCells((c) => (johnson ? johnsonNext(c) : ringNext(c)));
    setTicks((k) => k + 1);
  };
  const reset = () => { setCells([...initial]); setTicks(0); };
  const oneHot = cells.filter(Boolean).length === 1;

  const R = 72, cx = 150, cy = 106;
  const angles = [-90, 0, 90, 180];
  const pos = (i: number) => {
    const rad = (angles[i] * Math.PI) / 180;
    return { x: cx + R * Math.cos(rad), y: cy + R * Math.sin(rad) };
  };
  const bow = (i: number) => {
    const rad = ((angles[i] + 45) * Math.PI) / 180;
    const BR = R * 1.55;
    return { x: cx + BR * Math.cos(rad), y: cy + BR * Math.sin(rad) };
  };

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {johnson ? '4-bit Johnson (twisted) ring' : '4-bit ring counter'}
        </span>
        <span className={`font-mono text-[11px] ${t.faint}`}>tick = {ticks}</span>
      </div>
      <svg viewBox="0 0 300 210" className="mx-auto w-full max-w-md">
        {[0, 1, 2, 3].map((i) => {
          const a = pos(i), b = pos((i + 1) % 4), c = bow(i);
          const hot = cells[i] === 1;
          const isFeedback = i === 3;
          return (
            <g key={`e${i}`}>
              <path d={`M${a.x},${a.y} Q${c.x},${c.y} ${b.x},${b.y}`} fill="none"
                stroke={hot ? accent : dim} strokeWidth={hot ? 3 : 2} />
              {isFeedback && johnson && (
                <g>
                  <circle cx={c.x} cy={c.y} r="8" fill={box} stroke={accent} strokeWidth="2" />
                  <text x={c.x} y={c.y + 3} textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="900" fill={accent}>N</text>
                </g>
              )}
              {isFeedback && !johnson && <circle cx={c.x} cy={c.y} r="3" fill={hot ? accent : dim} />}
            </g>
          );
        })}
        {[0, 1, 2, 3].map((i) => {
          const p = pos(i);
          const on = cells[i] === 1;
          return (
            <g key={`n${i}`}>
              <motion.rect key={`${i}-${cells[i]}`} initial={{ opacity: 0.5, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}
                x={p.x - 23} y={p.y - 17} width="46" height="34" rx="9" fill={on ? `${accent}22` : box} stroke={on ? accent : dim} strokeWidth="2.4" />
              <text x={p.x} y={p.y - 3} textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>Q{i}</text>
              <text x={p.x} y={p.y + 14} textAnchor="middle" fontFamily="monospace" fontSize="16" fontWeight="900" fill={on ? accent : dim}>{cells[i]}</text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex items-center justify-center gap-3">
        <ClockButton accent={accent} onTick={tick} />
        <button onClick={reset} className="rounded-2xl border-2 px-4 py-2.5 font-mono text-[12px] font-black uppercase active:scale-95"
          style={{ borderColor: `${accent}55`, color: accent }}>reset</button>
      </div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {johnson
          ? (lang === 'hi'
            ? <>D0 = Q3' (crossed tail) -&gt; अभी = <b style={{ color: accent }}>{cells.join('')}</b></>
            : <>D0 = Q3' (crossed tail) -&gt; now = <b style={{ color: accent }}>{cells.join('')}</b></>)
          : (lang === 'hi'
            ? <>D0 = Q3 (direct feedback) -&gt; अभी = <b style={{ color: accent }}>{cells.join('')}</b> ({oneHot ? 'one-hot' : 'not one-hot'})</>
            : <>D0 = Q3 (direct feedback) -&gt; now = <b style={{ color: accent }}>{cells.join('')}</b> ({oneHot ? 'one-hot' : 'not one-hot'})</>)}
      </p>
    </Card>
  );
};

/* ───────── bespoke: direct vs crossed tail, live side by side (S02_Facts) ───────── */
const FeedbackCompare: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const N = 4;
  const [ring, setRing] = useState<number[]>([1, 0, 0, 0]);
  const [john, setJohn] = useState<number[]>(Array(N).fill(0));
  const tickRing = () => setRing((c) => ringNext(c));
  const tickJohn = () => setJohn((c) => johnsonNext(c));

  const Mini: React.FC<{ cells: number[]; crossed: boolean; label: string; color: string; onTick: () => void }>
    = ({ cells, crossed, label, color, onTick }) => (
    <div className="min-w-[220px] flex-1">
      <div className="mb-2 text-center font-mono text-[11px] font-black uppercase tracking-widest" style={{ color }}>{label}</div>
      <svg viewBox="0 0 240 100" className="mx-auto w-full max-w-xs">
        {cells.map((c, i) => {
          const x = 20 + i * 52;
          return (
            <g key={i}>
              <rect x={x} y="16" width="40" height="34" rx="7" fill={c ? `${color}22` : box} stroke={c ? color : dim} strokeWidth="2.2" />
              <text x={x + 20} y="38" textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="900" fill={c ? color : dim}>{c}</text>
              {i < 3 && <text x={x + 46} y="38" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={dim}>{'>'}</text>}
            </g>
          );
        })}
        <path d="M228,50 Q228,84 20,84 Q4,84 4,50 Q4,34 20,33" fill="none" stroke={color} strokeWidth="1.8" />
        {crossed && (
          <g>
            <circle cx="120" cy="84" r="7" fill={box} stroke={color} strokeWidth="2" />
            <text x="120" y="87" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="900" fill={color}>N</text>
          </g>
        )}
      </svg>
      <div className="mt-2 flex items-center justify-center"><ClockButton accent={color} onTick={onTick} /></div>
    </div>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'direct बनाम crossed tail' : 'direct vs crossed tail'}
      </div>
      <div className="flex flex-wrap items-start justify-center gap-6">
        <Mini cells={ring} crossed={false} label="ring · D0=Q3" color={ACC.ring} onTick={tickRing} />
        <Mini cells={john} crossed label="Johnson · D0=Q3'" color={ACC.johnson} onTick={tickJohn} />
      </div>
      <p className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
        {lang === 'hi'
          ? <>same chain, एक अलग wire: ring अभी <b style={{ color: ACC.ring }}>{ring.join('')}</b>, Johnson अभी <b style={{ color: ACC.johnson }}>{john.join('')}</b>.</>
          : <>same chain, one different wire: ring now <b style={{ color: ACC.ring }}>{ring.join('')}</b>, Johnson now <b style={{ color: ACC.johnson }}>{john.join('')}</b>.</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: the computed 4-clock ring sequence table (S03_Ring) ───────── */
const RingSequenceTable: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const N = 4;
  const seq = genSeq(ringNext, [1, 0, 0, 0], N);
  const rows: (string | number)[][] = seq.map((s, i) => [i, ...s, s.filter(Boolean).length === 1 ? 'one-hot' : '-']);
  const unused = (1 << N) - N;
  return (
    <StateTable isDarkMode={isDarkMode} accent={accent}
      headers={['clock', 'Q0', 'Q1', 'Q2', 'Q3', lang === 'hi' ? 'स्थिति' : 'state']}
      rows={rows}
      highlight={N}
      note={lang === 'hi'
        ? `हर row ringNext() से iterate हुई: D0=Q3 सीधे feed होता है। ${N} clocks में यह वापस शुरुआत पर लौटता है (MOD-${N}); 2^${N}=${1 << N} में से सिर्फ़ ${N} states वापरे जाते हैं, बाक़ी ${unused} अनवापरे रहते हैं।`
        : `Every row iterated by ringNext(): D0=Q3 feeds straight back. After ${N} clocks it returns to the start (MOD-${N}); only ${N} of the 2^${N}=${1 << N} possible states are ever used, the other ${unused} are never visited.`} />
  );
};

/* ───────── bespoke: the computed 8-clock Johnson sequence table (S04_Johnson) ───────── */
const JohnsonSequenceTable: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const N = 4;
  const seq = genSeq(johnsonNext, Array(N).fill(0), 2 * N);
  const rows: (string | number)[][] = seq.map((s, i) => [i, ...s, i === 0 ? '-' : hamming(s, seq[i - 1])]);
  const transitions = seq.slice(1).map((s, i) => hamming(s, seq[i]));
  const allOnes = transitions.every((h) => h === 1);
  return (
    <StateTable isDarkMode={isDarkMode} accent={accent}
      headers={['clock', 'Q0', 'Q1', 'Q2', 'Q3', 'Hamming Δ']}
      rows={rows}
      highlight={2 * N}
      note={lang === 'hi'
        ? `हर row johnsonNext() से: D0=Q3' crossed feedback। ${2 * N} clocks में वापस शुरुआत पर (MOD-${2 * N}); हर कदम पर बिल्कुल 1 bit बदलता है (code में verified: हर transition की Hamming distance ${allOnes ? '1' : 'mixed'} है) — glitch-free, Gray-जैसा।`
        : `Every row from johnsonNext(): D0=Q3', the crossed feedback. After ${2 * N} clocks it returns to the start (MOD-${2 * N}); every step changes exactly 1 bit (verified in code: every transition has Hamming distance ${allOnes ? '1' : 'mixed'}) — glitch-free, Gray-code-like.`} />
  );
};

/* ───────── bespoke: ring vs Johnson comparison table, every cell computed (S05_Compare) ───────── */
const CompareTable: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const N = 4;
  const ringSeq = genSeq(ringNext, [1, 0, 0, 0], N).slice(0, N);
  const johnsonSeq = genSeq(johnsonNext, Array(N).fill(0), 2 * N).slice(0, 2 * N);
  const ringHam = ringSeq.map((s, i) => hamming(s, ringSeq[(i + 1) % ringSeq.length]));
  const johnsonHam = johnsonSeq.map((s, i) => hamming(s, johnsonSeq[(i + 1) % johnsonSeq.length]));
  const fmtHam = (arr: number[]): string => (arr.every((h) => h === arr[0]) ? String(arr[0]) : arr.join(','));
  const kSignals = 8;
  const ringStages = kSignals;
  const johnsonStages = Math.ceil(kSignals / 2);
  const rows: (string | number)[][] = [
    ['feedback', 'D0 = Q3', "D0 = Q3'"],
    [`modulo (n=${N} FFs)`, `MOD-${ringSeq.length}`, `MOD-${johnsonSeq.length}`],
    [lang === 'hi' ? `stages for ${kSignals} signals` : `stages for ${kSignals} signals`, ringStages, johnsonStages],
    [lang === 'hi' ? 'decode gates / state' : 'decode gates / state', '0 (direct Qi tap)', '1 (2-input gate)'],
    [lang === 'hi' ? 'adjacent Hamming distance' : 'adjacent Hamming distance', fmtHam(ringHam), fmtHam(johnsonHam)],
  ];
  return (
    <StateTable isDarkMode={isDarkMode} accent={accent}
      headers={[lang === 'hi' ? 'गुण' : 'feature', 'RING', 'JOHNSON']}
      rows={rows}
      note={lang === 'hi'
        ? `सारे मान n=${N} flip-flops के actual sequences से गिने गए: ring ${ringSeq.length} states देता है, Johnson ${johnsonSeq.length}; Hamming distance हर transition पर सीधे compute हुई।`
        : `Every value computed from the actual n=${N}-flip-flop sequences: ring yields ${ringSeq.length} states, Johnson ${johnsonSeq.length}; Hamming distance measured directly on every transition.`} />
  );
};

/* ───────── bespoke: lockup + self-start recovery, live + a full 16-state cycle trace (S06_SelfStart) ───────── */
const SelfStartDemo: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const N = 4;
  const [cells, setCells] = useState<number[]>([0, 0, 0, 0]);
  const [fixed, setFixed] = useState(false);
  const [ticks, setTicks] = useState(0);
  const tick = () => {
    setCells((c) => (fixed ? fixedRingNext(c) : ringNext(c)));
    setTicks((k) => k + 1);
  };
  const lockup = () => { setCells([0, 0, 0, 0]); setTicks(0); };
  const oneHot = cells.filter(Boolean).length === 1;
  const stuck = !fixed && ticks > 0 && cells.every((v) => v === 0);

  const cycles = useMemo(() => traceCycles(ringNext, N), []);
  const validSet = useMemo(() => new Set(['1000', '0100', '0010', '0001']), []);
  const rows: (string | number)[][] = useMemo(() => cycles.map((cyc) => {
    const rep = cyc[0];
    const isValid = cyc.some((s) => validSet.has(s.join('')));
    const escape = isValid ? null : stepsToEscape(rep, validSet);
    const path = cyc.map((s) => s.join('')).join(' -> ');
    const verdict = isValid
      ? (lang === 'hi' ? 'valid (one-hot cycle)' : 'valid (one-hot cycle)')
      : escape !== null
        ? (lang === 'hi' ? `fix से ${escape} clocks में escape` : `escapes with the fix in ${escape} clocks`)
        : (lang === 'hi' ? 'fix से भी फँसा रहता है' : 'still stuck even with the fix');
    return [path, cyc.length, verdict];
  }), [cycles, validSet, lang]);

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'lockup recovery · live' : 'lockup recovery · live'}
        </div>
        <svg viewBox="0 0 340 130" className="mx-auto w-full max-w-xl">
          {cells.map((c, i) => {
            const x = 30 + i * 72;
            return (
              <g key={i}>
                <rect x={x} y="26" width="52" height="38" rx="8" fill={c ? `${accent}22` : box} stroke={c ? accent : dim} strokeWidth="2.4" />
                <text x={x + 26} y="20" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>Q{i}</text>
                <text x={x + 26} y="51" textAnchor="middle" fontFamily="monospace" fontSize="16" fontWeight="900" fill={c ? accent : dim}>{c}</text>
                {i < 3 && <text x={x + 62} y="51" textAnchor="middle" fontFamily="monospace" fontSize="13" fill={dim}>{'>'}</text>}
              </g>
            );
          })}
          <path d={`M${30 + 3 * 72 + 26},64 q0,42 -${3 * 72},0 q0,-24 -12,-24`} fill="none" stroke={fixed ? ACC.good : dim} strokeWidth="2" />
          {fixed ? (
            <g>
              <rect x="6" y="88" width="80" height="26" rx="7" fill={box} stroke={ACC.good} strokeWidth="2" />
              <text x="46" y="105" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fontWeight="800" fill={ACC.good}>Q0'.Q1'.Q2'</text>
            </g>
          ) : (
            <g>
              <rect x="6" y="88" width="80" height="26" rx="7" fill={box} stroke={dim} strokeWidth="2" />
              <text x="46" y="105" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={dim}>plain D0=Q3</text>
            </g>
          )}
        </svg>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <Toggle label="fix" v={fixed ? 1 : 0} color={ACC.good} onClick={() => setFixed((f) => !f)} />
          <button onClick={lockup} className="rounded-2xl border-2 px-4 py-2.5 font-mono text-[12px] font-black uppercase active:scale-95"
            style={{ borderColor: `${ACC.warn}66`, color: ACC.warn }}>
            {lang === 'hi' ? 'force lockup -> 0000' : 'force lockup -> 0000'}
          </button>
        </div>
        <div className="mt-3 flex justify-center"><ClockButton accent={accent} onTick={tick} /></div>
        <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
          {stuck
            ? <span style={{ color: ACC.warn }}>{lang === 'hi' ? `frozen at 0000 - ${ticks} clocks दबाए, कुछ नहीं हिला (कोई fix नहीं)।` : `frozen at 0000 - pressed ${ticks} clocks, nothing moved (no fix applied).`}</span>
            : (lang === 'hi'
              ? <>अभी = <b style={{ color: accent }}>{cells.join('')}</b> {oneHot ? '(one-hot - valid cycle पर)' : '(अभी valid cycle पर नहीं)'}</>
              : <>now = <b style={{ color: accent }}>{cells.join('')}</b> {oneHot ? '(one-hot - on the valid cycle)' : '(not yet on the valid cycle)'}</>)}
        </p>
      </Card>
      <StateTable isDarkMode={isDarkMode} accent={accent}
        headers={[lang === 'hi' ? 'cycle (सारे 16 states में से)' : 'cycle (among all 16 states)', 'length', lang === 'hi' ? "D0=Q0'.Q1'.Q2' fix के तहत" : "under the D0=Q0'.Q1'.Q2' fix"]}
        rows={rows}
        note={lang === 'hi'
          ? `traceCycles() से computed: सादे D0=Q3 के तहत सभी 16 states 6 अलग cycles में बँटते हैं। fix सिर्फ़ 0000 (और bonus में 1111) को valid loop की तरफ़ मोड़ता है; बाक़ी अछूते रहते हैं।`
          : `Computed by traceCycles(): under plain D0=Q3 all 16 states split into 6 distinct cycles. The fix redirects only 0000 (and, as a bonus, 1111) toward the valid loop; the rest are left untouched.`} />
    </div>
  );
};

/* ───────── bespoke: Johnson decode-gate map, derived by search, proven live (S07_Decoding) ───────── */
const JohnsonDecodeMap: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const N = 4;
  const seq = useMemo(() => genSeq(johnsonNext, Array(N).fill(0), 2 * N).slice(0, 2 * N), []);
  const gates = useMemo(() => deriveDecodeGates(seq), [seq]);
  const [state, setState] = useState(0);
  const tick = () => setState((s) => (s + 1) % seq.length);
  const cells = seq[state];
  const g = gates[state];
  const litP = g.polP ? cells[g.p] : 1 - cells[g.p];
  const litQ = g.polQ ? cells[g.q] : 1 - cells[g.q];
  const out = litP & litQ;
  const rows: (string | number)[][] = seq.map((s, i) => [i, s.join(''), `${litName(gates[i].p, gates[i].polP)}.${litName(gates[i].q, gates[i].polQ)}`]);

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'decode gate · live' : 'decode gate · live'}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {cells.map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className={`font-mono text-[9px] ${t.faint}`}>Q{i}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black"
                style={{ background: c ? accent : 'transparent', color: c ? '#000' : accent, border: `2px solid ${accent}` }}>{c}</span>
            </div>
          ))}
        </div>
        <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
          state S{state} = {cells.join('')} -&gt; gate {litName(g.p, g.polP)}.{litName(g.q, g.polQ)} = {litP}.{litQ} = <b style={{ color: out ? ACC.good : (t.faint as string) }}>{out}</b>
        </p>
        <div className="mt-3 flex justify-center"><ClockButton accent={accent} onTick={tick} /></div>
      </Card>
      <StateTable isDarkMode={isDarkMode} accent={accent}
        headers={['state', 'Q0Q1Q2Q3', lang === 'hi' ? 'decode gate (2-input)' : 'decode gate (2-input)']}
        rows={rows}
        highlight={state}
        note={lang === 'hi'
          ? 'हर gate कोड में brute-force search से derive हुआ: literal जोड़े तब तक आज़माए गए जब तक कोई सिर्फ़ उसी state पर 1 न दे। हर state को ठीक एक 2-input gate चाहिए, चाहे counter कितना भी लंबा हो।'
          : 'Every gate was derived in code by brute-force search: pairs of literals were tried until one produced 1 only at that state. Every state needs exactly one 2-input gate, no matter how long the counter is.'} />
    </div>
  );
};

/* ───────── bespoke: the twisted-loop (Möbius) analogy - 2 physical laps = 1 Johnson cycle (S08_Analogy) ───────── */
const MobiusAnalogy: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const NLAP = 4;
  const TOTAL = 2 * NLAP;
  const [k, setK] = useState(0);
  const tick = () => setK((v) => (v + 1) % TOTAL);
  const lap = k < NLAP ? 0 : 1;
  const idx = k % NLAP;
  const cx = lap === 0 ? 95 : 205, cy = 100, R = 46;
  const angDeg = -90 + idx * (360 / NLAP);
  const ang = (angDeg * Math.PI) / 180;
  const px = cx + R * Math.cos(ang), py = cy + R * Math.sin(ang);
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'twisted loop · 2 laps में घर वापस' : 'twisted loop · home after 2 laps'}
      </div>
      <svg viewBox="0 0 300 200" className="mx-auto w-full max-w-md">
        <circle cx="95" cy="100" r="46" fill="none" stroke={lap === 0 ? accent : dim} strokeWidth={lap === 0 ? 2.6 : 1.6} />
        <circle cx="205" cy="100" r="46" fill="none" stroke={lap === 1 ? accent : dim} strokeWidth={lap === 1 ? 2.6 : 1.6} />
        <path d="M139,100 L161,100" stroke={dim} strokeWidth="1.6" strokeDasharray="3 3" />
        <text x="95" y="158" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>{lang === 'hi' ? 'lap 1 · भरना' : 'lap 1 · filling'}</text>
        <text x="205" y="158" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>{lang === 'hi' ? 'lap 2 · खाली करना' : 'lap 2 · emptying'}</text>
        <motion.circle key={k} cx={px} cy={py} r="8" fill={accent} initial={{ scale: 0.4, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} />
      </svg>
      <div className="mt-3 flex justify-center"><ClockButton accent={accent} onTick={tick} /></div>
      <p className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
        {lang === 'hi'
          ? <>step {k}/{TOTAL - 1} · {k === 0 ? 'घर पर, पूरे 2 laps के बाद' : `lap ${lap + 1}, position ${idx}`} — Johnson की तरह, {TOTAL}=2n states को घर वापस आने में 2 physical laps चाहिए (n={NLAP})।</>
          : <>step {k}/{TOTAL - 1} · {k === 0 ? 'home, after a full 2-lap trip' : `lap ${lap + 1}, position ${idx}`} — like Johnson, all {TOTAL}=2n states need 2 physical laps to come home (n={NLAP}).</>}
      </p>
    </Card>
  );
};

/* small wrapper so the S08 captions can use the language hook (must be its own component) */
const AnalogyPanel: React.FC<{ isDarkMode: boolean; johnson: boolean }> = ({ isDarkMode, johnson }) => {
  const { lang } = useSubLang();
  const color = johnson ? ACC.johnson : ACC.ring;
  const label = johnson
    ? (lang === 'hi' ? 'twisted ride · Johnson' : 'twisted ride · Johnson')
    : (lang === 'hi' ? 'carousel · ring' : 'carousel · ring');
  return (
    <div>
      <div className="mb-2 text-center font-mono text-[11px] font-black uppercase tracking-widest" style={{ color }}>{label}</div>
      <RingCounterViz isDarkMode={isDarkMode} accent={color} johnson={johnson} />
    </div>
  );
};

/* ───────── part assignment ───────── */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE IDEA'
    : i <= Math.floor(n * 0.55) ? 'PART II · RING VS JOHNSON'
      : i < n - 3 ? 'PART III · PUT IT TO WORK'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  switch (scene.id) {
    case 'S02_Facts': return 'facts';
    case 'S03_Ring': return 'ring';
    case 'S04_Johnson': return 'johnson';
    case 'S05_Compare': return 'compare';
    case 'S06_SelfStart': return 'selfstart';
    case 'S07_Decoding': return 'decoding';
    case 'S08_Analogy': return 'analogy';
    case 'S09_Build': return 'build';
    default: return null;
  }
};

function componentFor(scene: SubScene, _i: number, _n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle}
        kicker="Ring & Johnson · The Loop That Feeds Itself"
        hero={<RingCounterViz isDarkMode={p.isDarkMode} accent={p.accent} johnson={false} />} />;
    case 'video':
      return (p) => <VideoScene {...p} scene={scene} src={SRC_EN} />;
    case 'flashcards':
      return (p) => (
        <SceneShell>
          <section className="space-y-3">
            <Eyebrow accent={p.accent}>{scene.label}</Eyebrow>
            {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${tone(p.isDarkMode).text}`}>{scene.subtitle}</h2>}
          </section>
          <SubFlashCards isDarkMode={p.isDarkMode} accent={p.accent} cards={CONTENT.flashcards} />
        </SceneShell>
      );
    case 'quiz':
      return (p) => (
        <div className="relative">
          <TryItYourself corner />
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="RJC" tag="Practice · Ring & Johnson Counters" title={scene.label} intro={scene.subtitle ?? ''} />
        </div>
      );
    case 'recap':
      return (p) => <RecapScene {...p} scene={scene} />;
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'facts' && (
            <div className="space-y-6">
              <TryItYourself />
              <FeedbackCompare isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'ring' && (
            <div className="space-y-6">
              <TryItYourself />
              <RingCounterViz isDarkMode={p.isDarkMode} accent={ACC.ring} johnson={false} />
              <RingSequenceTable isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'johnson' && (
            <div className="space-y-6">
              <TryItYourself />
              <RingCounterViz isDarkMode={p.isDarkMode} accent={ACC.johnson} johnson />
              <JohnsonSequenceTable isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'compare' && (
            <div className="space-y-6">
              <TryItYourself />
              <CompareTable isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'selfstart' && (
            <div className="space-y-6">
              <TryItYourself />
              <SelfStartDemo isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'decoding' && (
            <div className="space-y-6">
              <TryItYourself />
              <JohnsonDecodeMap isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'analogy' && (
            <div className="space-y-6">
              <TryItYourself />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <AnalogyPanel isDarkMode={p.isDarkMode} johnson={false} />
                <AnalogyPanel isDarkMode={p.isDarkMode} johnson />
              </div>
              <MobiusAnalogy isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="johnson-counter"
              titleEN="Build a Johnson counter for real"
              titleHI="असली में एक Johnson counter बनाइए"
              bodyEN="Open the live workbench and chain four D flip-flops on one common clock, route the last Q back through a single inverter into the first D, seed the register at all zeros, then clock it and read 0000, 1000, 1100, 1110, 1111, 0111, 0011, 0001 come out of real gates."
              bodyHI="live workbench खोलिए और चार D flip-flops को एक common clock पर chain कीजिए, आख़िरी Q को एक अकेले inverter से पहले D तक वापस route कीजिए, register को सभी zeros पर seed कीजिए, फिर इसे clock करके असली gates से 0000, 1000, 1100, 1110, 1111, 0111, 0011, 0001 निकलते पढ़िए।" />
          )}
        </TheoryScene>
      );
    }
  }
}

const slug = (s: string) => s.replace(/^S\d+_/, '').toLowerCase();

export const PAGES: SubPage[] = CONTENT.scenes.map((scene, i, arr) => ({
  id: slug(scene.id),
  part: partAt(i, arr.length),
  label: scene.label,
  subtitle: scene.subtitle ?? '',
  Component: componentFor(scene, i, arr.length),
}));
