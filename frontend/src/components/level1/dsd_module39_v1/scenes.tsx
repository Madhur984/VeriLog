/**
 * Mealy & Moore Machines - dsd/39, "Two Philosophies Of Output" (Sequential Logic track).
 * Generic scenes come from the shared _subtractor kit; the twin live state
 * diagrams, the block-diagram wiring comparison, the timing/glitch demo, the
 * 1011 sequence-detector lab, the encoding table and the vending-machine
 * analogy are bespoke. The single source of truth is a real KMP-style automaton
 * built in code from the pattern [1,0,1,1] (prefixFunction + buildDelta below) -
 * every Mealy/Moore transition, output, match count and encoded state name is
 * DERIVED from that automaton as the user feeds bits, never hand-typed per input.
 */
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import {
  StateDiagram, StateTable, TimingDiagram, ClockButton, Toggle,
  type FSMState, type FSMEdge, type WaveSignal,
} from '../_sequential/blocks';
import { TryItYourself } from '../../ui/TryItYourself';
import { CustomVideoPlayer } from '../../ui/CustomVideoPlayer';
import { CONTENT } from './content';

const MEALY = '#fb7185';
const MOORE = '#38bdf8';
const ACC = { good: '#34d399', warn: '#f59e0b' };
const SRC_EN: string | undefined = '/videos/dsd39-fsm.mp4';
const SRC_HI: string | undefined = undefined;
const SRC_ENCODING = '/videos/dsd39-encoding.mp4';

/* ═══════════════════════ the FSM logic - single source of truth ═══════════════════════
   A real KMP-style automaton for the pattern "1011", built at module load time from
   the pattern alone (prefix function -> delta table). Nothing below is a hand-typed
   per-bit answer: every transition and output is a function evaluated on demand. */

const PATTERN: number[] = [1, 0, 1, 1];
const M = PATTERN.length; // 4 -> full-match state index
const LETTERS = ['a', 'b', 'c', 'd', 'e'];

function prefixFunction(pat: number[]): number[] {
  const m = pat.length;
  const pi: number[] = new Array(m).fill(0);
  let k = 0;
  for (let i = 1; i < m; i++) {
    while (k > 0 && pat[i] !== pat[k]) k = pi[k - 1];
    if (pat[i] === pat[k]) k++;
    pi[i] = k;
  }
  return pi;
}

function buildDelta(pat: number[]): number[][] {
  const m = pat.length;
  const pi = prefixFunction(pat);
  const delta: number[][] = Array.from({ length: m + 1 }, () => [0, 0]);
  for (let state = 0; state <= m; state++) {
    for (const bit of [0, 1]) {
      if (state < m && bit === pat[state]) delta[state][bit] = state + 1;
      else if (state === 0) delta[state][bit] = 0;
      else delta[state][bit] = delta[pi[state - 1]][bit];
    }
  }
  return delta;
}

const PI = prefixFunction(PATTERN);
const DELTA = buildDelta(PATTERN);

/** Moore: M+1 states (0..M); output lives inside the state. */
const mooreNext = (s: number, x: number): number => DELTA[s][x];
const mooreOut = (s: number): number => (s === M ? 1 : 0);

/** Mealy: M states (0..M-1); output rides the arc that would reach the full-match state. */
const mealyNext = (s: number, x: number): number => (DELTA[s][x] === M ? PI[M - 1] : DELTA[s][x]);
const mealyOut = (s: number, x: number): number => (DELTA[s][x] === M ? 1 : 0);

/* ───────── generic row-layout diagram builder (computed from DELTA, not hand-drawn) ───────── */

interface FsmDiagram { states: FSMState[]; edges: FSMEdge[]; width: number; height: number }

function rowStates(n: number, labelFn: (i: number) => string, width: number, y: number): FSMState[] {
  const margin = 42;
  const step = n > 1 ? (width - margin * 2) / (n - 1) : 0;
  return Array.from({ length: n }, (_, i) => ({ id: LETTERS[i], label: labelFn(i), x: margin + i * step, y }));
}

function curveFor(from: number, to: number): number {
  const step = to - from;
  if (step === 0) return 0;
  return step > 0 ? 24 : -(30 + (Math.abs(step) - 1) * 18);
}

function mealyDiagram(width = 300): FsmDiagram {
  const y = 78, height = 200;
  const states = rowStates(M, (i) => LETTERS[i], width, y);
  const edges: FSMEdge[] = [];
  for (let s = 0; s < M; s++) {
    for (const bit of [0, 1]) {
      const ns = mealyNext(s, bit);
      const out = mealyOut(s, bit);
      edges.push({ from: LETTERS[s], to: LETTERS[ns], label: `${bit}/${out}`, curve: curveFor(s, ns) });
    }
  }
  return { states, edges, width, height };
}

function mooreDiagram(width = 340): FsmDiagram {
  const y = 78, height = 200;
  const n = M + 1;
  const states = rowStates(n, (i) => `${LETTERS[i]}/${mooreOut(i)}`, width, y);
  const edges: FSMEdge[] = [];
  for (let s = 0; s < n; s++) {
    for (const bit of [0, 1]) {
      const ns = mooreNext(s, bit);
      edges.push({ from: LETTERS[s], to: LETTERS[ns], label: `${bit}`, curve: curveFor(s, ns) });
    }
  }
  return { states, edges, width, height };
}

/* ───────── shared simulate: walk the automaton over a bit stream, step by step ───────── */

interface StepRow { i: number; bit: number; mFrom: number; mTo: number; mOut: number; rFrom: number; rTo: number; rOut: number }

function simulate(bits: number[], upto: number): { mealyState: number; mooreState: number; trace: StepRow[] } {
  let sM = 0, sR = 0;
  const trace: StepRow[] = [];
  for (let i = 0; i < upto; i++) {
    const bit = bits[i];
    const mFrom = sM, rFrom = sR;
    const mOut = mealyOut(sM, bit);
    const mTo = mealyNext(sM, bit);
    const rTo = mooreNext(sR, bit);
    const rOut = mooreOut(rTo);
    trace.push({ i, bit, mFrom, mTo, mOut, rFrom, rTo, rOut });
    sM = mTo; sR = rTo;
  }
  return { mealyState: sM, mooreState: sR, trace };
}

/* ═══════════════════════ bespoke: cover hero - twin live machines ═══════════════════════ */

const TwinLive: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [x, setX] = useState(1);
  const [sM, setSM] = useState(0);
  const [sR, setSR] = useState(0);
  const [hist, setHist] = useState<number[]>([]);
  const liveMealyOut = mealyOut(sM, x);   // reacts to X immediately, no feed needed
  const liveMooreOut = mooreOut(sR);      // only changes once the state itself has moved
  const mealyD = useMemo(() => mealyDiagram(260), []);
  const mooreD = useMemo(() => mooreDiagram(300), []);

  const feed = () => {
    setSM((s) => mealyNext(s, x));
    setSR((s) => mooreNext(s, x));
    setHist((h) => [...h.slice(-11), x]);
  };
  const reset = () => { setSM(0); setSR(0); setHist([]); };

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'एक साझा bit stream, दो मशीनें' : 'one shared bit stream, two machines'}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="font-mono text-[11px] font-black uppercase tracking-widest" style={{ color: MEALY }}>Mealy</span>
            <span className="font-mono text-[12px] font-black" style={{ color: liveMealyOut ? ACC.good : MEALY }}>Y = {liveMealyOut}</span>
          </div>
          <StateDiagram isDarkMode={isDarkMode} accent={MEALY} width={mealyD.width} height={mealyD.height}
            states={mealyD.states} edges={mealyD.edges} active={LETTERS[sM]} />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="font-mono text-[11px] font-black uppercase tracking-widest" style={{ color: MOORE }}>Moore</span>
            <span className="font-mono text-[12px] font-black" style={{ color: liveMooreOut ? ACC.good : MOORE }}>Y = {liveMooreOut}</span>
          </div>
          <StateDiagram isDarkMode={isDarkMode} accent={MOORE} width={mooreD.width} height={mooreD.height}
            states={mooreD.states} edges={mooreD.edges} active={LETTERS[sR]} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
        <Toggle label="X" v={x} onClick={() => setX((v) => v ^ 1)} color={accent} />
        <ClockButton accent={accent} onTick={feed} />
        <button onClick={reset}
          className="rounded-xl border px-3 py-1.5 font-mono text-[11px] font-black uppercase tracking-wide"
          style={{ borderColor: `${accent}55`, color: accent }}>
          {lang === 'hi' ? 'reset' : 'reset'}
        </button>
      </div>
      <p className={`mt-2 text-center font-mono text-[11px] ${t.faint}`}>
        {lang === 'hi' ? `अब तक feed: ${hist.join(' ') || '—'}` : `stream fed so far: ${hist.join(' ') || '—'}`}
      </p>
      <p className={`mt-3 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>X toggle कीजिए - <b style={{ color: MEALY }}>Mealy Y</b> तुरंत react करता है (CLK दबाने से पहले भी); <b style={{ color: MOORE }}>Moore Y</b> तभी बदलता है जब आप CLK दबाते हैं।</>
          : <>toggle X - <b style={{ color: MEALY }}>Mealy Y</b> reacts instantly (even before you press CLK); <b style={{ color: MOORE }}>Moore Y</b> only moves once you press CLK.</>}
      </p>
    </Card>
  );
};

/* ═══════════════════════ bespoke S02: block-diagram wiring comparison ═══════════════════════ */

const BlockDiagramCompare: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const [q, setQ] = useState(0);
  const [x, setX] = useState(1);
  const yMoore = q;
  const yMealy = q ^ x;
  const tick = () => setQ((cur) => cur ^ x);

  const Diagram: React.FC<{ mealy: boolean; color: string; y: number }> = ({ mealy, color, y }) => (
    <svg viewBox="0 0 220 250" className="mx-auto w-full max-w-[240px]">
      {/* X input */}
      <circle cx="110" cy="12" r="4" fill={x ? '#f59e0b' : dim} />
      <text x="118" y="16" fontFamily="monospace" fontSize="10" fontWeight="800" fill={x ? '#f59e0b' : dim}>X={x}</text>
      <line x1="110" y1="16" x2="110" y2="30" stroke={x ? '#f59e0b' : dim} strokeWidth="2.4" />
      {/* next-state logic */}
      <rect x="55" y="30" width="110" height="36" rx="8" fill={box} stroke={color} strokeWidth="2.2" />
      <text x="110" y="52" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={color}>
        {lang === 'hi' ? 'next-state logic' : 'next-state logic'}
      </text>
      <line x1="110" y1="66" x2="110" y2="86" stroke={color} strokeWidth="2.6" />
      {/* register */}
      <rect x="70" y="86" width="80" height="36" rx="8" fill={box} stroke={color} strokeWidth="2.6" />
      <text x="110" y="108" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="800" fill={color}>Q = {q}</text>
      {/* feedback register -> next-state logic */}
      <path d="M70,104 H24 V48 H55" fill="none" stroke={dim} strokeWidth="1.6" strokeDasharray="4 3" />
      {/* register -> output logic */}
      <line x1="110" y1="122" x2="110" y2="142" stroke={color} strokeWidth="2.6" />
      {/* mealy-only: X straight into output logic */}
      {mealy && <path d="M118,16 H196 V158 H165" fill="none" stroke="#f59e0b" strokeWidth="2.4" />}
      {!mealy && (
        <>
          <path d="M118,16 H196 V158 H165" fill="none" stroke={dim} strokeWidth="1.4" strokeDasharray="3 3" opacity={0.5} />
          <text x="196" y="130" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={dim} transform="rotate(90 196 130)">
            {lang === 'hi' ? 'X नहीं जुड़ा' : 'no X here'}
          </text>
        </>
      )}
      {/* output logic */}
      <rect x="55" y="142" width="110" height="36" rx="8" fill={box} stroke={color} strokeWidth="2.2" />
      <text x="110" y="164" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={color}>
        {lang === 'hi' ? 'output logic' : 'output logic'}
      </text>
      {/* -> Y */}
      <line x1="110" y1="178" x2="110" y2="198" stroke={y ? ACC.good : dim} strokeWidth="2.8" />
      <circle cx="110" cy="204" r="12" fill={y ? ACC.good : 'transparent'} stroke={y ? ACC.good : dim} strokeWidth="2.2" />
      <text x="110" y="230" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="900" fill={y ? ACC.good : dim}>Y={y}</text>
      <text x="110" y={y} textAnchor="middle" />
    </svg>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex items-center justify-center gap-4">
        <Toggle label="X" v={x} onClick={() => setX((v) => v ^ 1)} color="#f59e0b" />
        <ClockButton accent={accent} onTick={tick} canAuto={false} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-center font-mono text-[11px] font-black uppercase tracking-widest" style={{ color: MEALY }}>
            Mealy · Y = Q ⊕ X
          </div>
          <Diagram mealy color={MEALY} y={78} />
        </div>
        <div>
          <div className="mb-1 text-center font-mono text-[11px] font-black uppercase tracking-widest" style={{ color: MOORE }}>
            Moore · Y = Q
          </div>
          <Diagram mealy={false} color={MOORE} y={78} />
        </div>
      </div>
      <p className={`mt-3 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>दोनों diagrams same register और next-state logic रखते हैं। सिर्फ़ <b style={{ color: MEALY }}>Mealy</b> में X सीधे output logic तक जाती अतिरिक्त wire है - <b style={{ color: MOORE }}>Moore</b> में वह wire सिरे से मौजूद नहीं।</>
          : <>both diagrams share the exact same register and next-state logic. Only <b style={{ color: MEALY }}>Mealy</b> has that extra wire from X straight into the output logic - <b style={{ color: MOORE }}>Moore</b> has no such wire at all.</>}
      </p>
    </Card>
  );
};

/* ═══════════════════════ bespoke S03: timing comparison + glitch demo ═══════════════════════ */

const DEFAULT_STREAM: number[] = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1];

const TimingCompare: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const full = useMemo(() => simulate(DEFAULT_STREAM, DEFAULT_STREAM.length), []);
  const signals: WaveSignal[] = [
    { name: 'X', values: DEFAULT_STREAM, color: '#f59e0b' },
    { name: 'Y·Mealy', values: full.trace.map((r) => r.mOut), color: MEALY },
    { name: 'Y·Moore', values: full.trace.map((r) => r.rOut), color: MOORE },
  ];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'एक ही stream, दोनों outputs · computed' : 'one stream, both outputs · computed'}
      </div>
      <TimingDiagram isDarkMode={isDarkMode} accent={accent} signals={signals} />
      <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? 'दोनों trace हर column पर मेल खाते हैं - बस Moore हमेशा एक clock देर से जवाब देता है, क्योंकि इसका output ख़ुद state है, और state अगली edge तक नहीं बदलता।'
          : 'both traces agree at every column - Moore simply answers one clock later, because its output IS the state, and the state cannot move before the next edge.'}
      </p>
    </Card>
  );
};

const GlitchDemo: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [q, setQ] = useState(0);
  const [x, setX] = useState(0);
  const yMealy = q ^ x;   // combinational: reacts to X immediately
  const yMoore = q;       // registered: only reacts once Q itself moves
  const tick = () => setQ((cur) => cur ^ x);

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'glitch जाँच · toy circuit Y_mealy = Q⊕X, Y_moore = Q' : 'glitch check · toy circuit Y_mealy = Q⊕X, Y_moore = Q'}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-5">
        <Toggle label={lang === 'hi' ? 'X (तेज़ी से toggle कीजिए)' : 'X (toggle it fast)'} v={x} onClick={() => setX((v) => v ^ 1)} color="#f59e0b" />
        <div className="flex flex-col items-center gap-1">
          <span className={`font-mono text-[11px] ${t.faint}`}>Q</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black"
            style={{ background: q ? accent : 'transparent', color: q ? '#000' : accent, border: `2px solid ${accent}` }}>{q}</span>
        </div>
        <ClockButton accent={accent} onTick={tick} canAuto={false} />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[11px] font-black" style={{ color: MEALY }}>Y_mealy = Q⊕X</span>
          <motion.span key={`m-${yMealy}`} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
            className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-xl font-black"
            style={{ background: yMealy ? MEALY : 'transparent', color: yMealy ? '#000' : MEALY, border: `2px solid ${MEALY}` }}>{yMealy}</motion.span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[11px] font-black" style={{ color: MOORE }}>Y_moore = Q</span>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-xl font-black"
            style={{ background: yMoore ? MOORE : 'transparent', color: yMoore ? '#000' : MOORE, border: `2px solid ${MOORE}` }}>{yMoore}</span>
        </div>
      </div>
      <p className={`mt-3 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>X को बार-बार toggle कीजिए - <b style={{ color: MEALY }}>Y_mealy</b> हर बार तुरंत उछलता है (कोई CLK दबाया नहीं!); <b style={{ color: MOORE }}>Y_moore</b> तब तक नहीं हिलता जब तक आप CLK नहीं दबाते।</>
          : <>toggle X repeatedly - <b style={{ color: MEALY }}>Y_mealy</b> jumps every single time, with no CLK press at all; <b style={{ color: MOORE }}>Y_moore</b> refuses to move until you actually press CLK.</>}
      </p>
    </Card>
  );
};

/* ═══════════════════════ bespoke S04: the 1011 sequence-detector lab ═══════════════════════ */

const SequenceDetectorLab: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [pos, setPos] = useState(0);
  const sim = useMemo(() => simulate(DEFAULT_STREAM, pos), [pos]);
  const mealyD = useMemo(() => mealyDiagram(), []);
  const mooreD = useMemo(() => mooreDiagram(), []);
  const last = sim.trace[sim.trace.length - 1];
  const liveMealyY = last ? last.mOut : 0;
  const liveMooreY = mooreOut(sim.mooreState);
  const mealyMatches = sim.trace.filter((r) => r.mOut === 1).length;
  const mooreMatches = sim.trace.filter((r) => r.rOut === 1).length;

  const mealyRows: (string | number)[][] = Array.from({ length: M }, (_, s) => [
    LETTERS[s],
    `${LETTERS[mealyNext(s, 0)]} / ${mealyOut(s, 0)}`,
    `${LETTERS[mealyNext(s, 1)]} / ${mealyOut(s, 1)}`,
  ]);
  const mooreRows: (string | number)[][] = Array.from({ length: M + 1 }, (_, s) => [
    `${LETTERS[s]} / ${mooreOut(s)}`,
    LETTERS[mooreNext(s, 0)],
    LETTERS[mooreNext(s, 1)],
  ]);

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
            {lang === 'hi' ? 'stream · किसी bit पर click करके वहाँ तक feed कीजिए' : 'stream · click a bit to feed through it'}
          </span>
          <button onClick={() => setPos(0)}
            className="rounded-lg border px-2.5 py-1 font-mono text-[10px] font-black uppercase"
            style={{ borderColor: `${accent}55`, color: accent }}>
            {lang === 'hi' ? 'reset' : 'reset'}
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {DEFAULT_STREAM.map((b, i) => {
            const fed = i < pos;
            const isMatchStep = fed && (sim.trace[i]?.mOut === 1 || sim.trace[i]?.rOut === 1);
            return (
              <button key={i} onClick={() => setPos(i + 1)}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg font-mono text-sm font-black active:scale-90"
                style={{
                  background: fed ? accent : 'transparent',
                  color: fed ? '#000' : accent,
                  border: `2px solid ${accent}${fed ? '' : '55'}`,
                  outline: i === pos - 1 ? `2px solid ${accent}` : 'none',
                  outlineOffset: 2,
                }}>
                {b}
                {isMatchStep && <span className="absolute -top-1.5 -right-1.5 h-2.5 w-2.5 rounded-full" style={{ background: ACC.good }} />}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => setPos((p) => Math.max(0, p - 1))} disabled={pos === 0}
            className="rounded-xl border px-3 py-1.5 font-mono text-[11px] font-black disabled:opacity-30"
            style={{ borderColor: `${accent}55`, color: accent }}>
            {lang === 'hi' ? '◀ पीछे' : '◀ back'}
          </button>
          <button onClick={() => setPos((p) => Math.min(DEFAULT_STREAM.length, p + 1))} disabled={pos === DEFAULT_STREAM.length}
            className="rounded-xl px-4 py-1.5 font-mono text-[11px] font-black text-black disabled:opacity-40"
            style={{ background: accent }}>
            {lang === 'hi' ? 'अगला bit feed ▶' : 'feed next bit ▶'}
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card isDarkMode={isDarkMode}>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[11px] font-black uppercase tracking-widest" style={{ color: MEALY }}>Mealy · 4 states</span>
            <span className="font-mono text-[13px] font-black" style={{ color: liveMealyY ? ACC.good : MEALY }}>Y = {liveMealyY}</span>
          </div>
          <StateDiagram isDarkMode={isDarkMode} accent={MEALY} width={mealyD.width} height={mealyD.height}
            states={mealyD.states} edges={mealyD.edges} active={LETTERS[sim.mealyState]} />
          <p className={`mt-2 text-center font-mono text-[12px] ${t.faint}`}>
            {lang === 'hi' ? `${mealyMatches} match मिले` : `${mealyMatches} match(es) found`}
          </p>
        </Card>
        <Card isDarkMode={isDarkMode}>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[11px] font-black uppercase tracking-widest" style={{ color: MOORE }}>Moore · 5 states</span>
            <span className="font-mono text-[13px] font-black" style={{ color: liveMooreY ? ACC.good : MOORE }}>Y = {liveMooreY}</span>
          </div>
          <StateDiagram isDarkMode={isDarkMode} accent={MOORE} width={mooreD.width} height={mooreD.height}
            states={mooreD.states} edges={mooreD.edges} active={LETTERS[sim.mooreState]} />
          <p className={`mt-2 text-center font-mono text-[12px] ${t.faint}`}>
            {lang === 'hi' ? `${mooreMatches} match मिले` : `${mooreMatches} match(es) found`}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <StateTable isDarkMode={isDarkMode} accent={MEALY} headers={['state', 'on 0 (next/Y)', 'on 1 (next/Y)']} rows={mealyRows}
          note={lang === 'hi' ? 'हर cell code में mealyNext/mealyOut से निकाला गया।' : 'every cell computed from mealyNext / mealyOut in code.'} />
        <StateTable isDarkMode={isDarkMode} accent={MOORE} headers={['state / Y', 'on 0 → next', 'on 1 → next']} rows={mooreRows}
          note={lang === 'hi' ? 'output state के अंदर लिखा है, arc पर नहीं।' : 'output lives inside the state, never on the arc.'} />
      </div>
    </div>
  );
};

/* ═══════════════════════ bespoke S05: state encoding ═══════════════════════ */

function toBinaryStr(n: number, bits: number): string { return n.toString(2).padStart(bits, '0'); }
function toGrayStr(n: number, bits: number): string { return (n ^ (n >> 1)).toString(2).padStart(bits, '0'); }
function toOneHotStr(n: number, count: number): string { return Array.from({ length: count }, (_, i) => (i === n ? '1' : '0')).join(''); }
function bitsFor(count: number): number { return Math.max(1, Math.ceil(Math.log2(count))); }

const EncodingLab: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const [which, setWhich] = useState<'mealy' | 'moore'>('mealy');
  const count = which === 'mealy' ? M : M + 1;
  const bBits = bitsFor(count);
  const rows: (string | number)[][] = Array.from({ length: count }, (_, i) => [
    LETTERS[i],
    toBinaryStr(i, bBits),
    toGrayStr(i, bBits),
    toOneHotStr(i, count),
  ]);
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        {(['mealy', 'moore'] as const).map((w) => (
          <button key={w} onClick={() => setWhich(w)}
            className="rounded-lg border px-3.5 py-1.5 font-mono text-[12px] font-black uppercase tracking-wide transition-colors"
            style={which === w ? { background: accent, color: '#000', borderColor: accent } : { borderColor: `${accent}44`, color: accent }}>
            {w === 'mealy' ? `Mealy (${M} states)` : `Moore (${M + 1} states)`}
          </button>
        ))}
      </div>
      <StateTable isDarkMode={isDarkMode} accent={accent}
        headers={['state', `binary (${bBits}b)`, `gray (${bBits}b)`, `one-hot (${count}b)`]}
        rows={rows}
        note={lang === 'hi'
          ? `${count} states -> binary/gray को ceil(log2 ${count}) = ${bBits} flip-flops चाहिए; one-hot को ${count} flip-flops चाहिए।`
          : `${count} states -> binary/gray need ceil(log2 ${count}) = ${bBits} flip-flops; one-hot needs ${count} flip-flops.`}
      />
    </Card>
  );
};

const EncodingVideo: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
        {lang === 'hi' ? 'bonus वीडियो · encoding walkthrough' : 'bonus video · encoding walkthrough'}
      </div>
      <div className="overflow-hidden rounded-2xl">
        <CustomVideoPlayer src={SRC_ENCODING} accent={accent} className="rounded-2xl border-0" />
      </div>
    </Card>
  );
};

/* ═══════════════════════ bespoke S06: two vending machines ═══════════════════════ */

const VendingCompare: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [xIn, setXIn] = useState(0);        // inserting a coin right now?
  const [sMealy, setSMealy] = useState(0);  // 0 or 1 coins banked
  const [sMoore, setSMoore] = useState(0);  // 0, 1, or 2 coins banked (2 = dispensing)

  const dispenseMealy = sMealy === 1 && xIn === 1 ? 1 : 0;  // combinational: reacts live
  const dispenseMoore = sMoore === 2 ? 1 : 0;               // registered: only state matters

  const confirm = () => {
    setSMealy((prev) => (prev === 1 && xIn === 1 ? 0 : xIn === 1 ? 1 : prev));
    setSMoore((prev) => {
      if (prev === 2) return 0;
      if (prev === 1) return xIn === 1 ? 2 : 1;
      return xIn === 1 ? 1 : 0;
    });
  };

  const Machine: React.FC<{ label: string; color: string; state: number; dispense: number; maxState: number }>
    = ({ label, color, state, dispense, maxState }) => (
    <div className="flex-1 rounded-2xl border p-4 text-center" style={{ borderColor: `${color}55` }}>
      <div className="font-mono text-[11px] font-black uppercase tracking-wide" style={{ color }}>{label}</div>
      <div className={`mt-2 font-mono text-[12px] ${t.faint}`}>{lang === 'hi' ? 'coins जमा' : 'coins banked'}: {state}/{maxState}</div>
      <motion.div key={`${label}-${dispense}`} initial={{ scale: dispense ? 1.25 : 1 }} animate={{ scale: 1 }}
        className="mx-auto mt-3 flex h-14 w-14 items-center justify-center rounded-2xl font-mono text-[10px] font-black uppercase"
        style={{ background: dispense ? ACC.good : 'transparent', color: dispense ? '#000' : color, border: `2px solid ${dispense ? ACC.good : color}` }}>
        {dispense ? (lang === 'hi' ? 'dispense!' : 'dispense!') : (lang === 'hi' ? 'wait' : 'wait')}
      </motion.div>
    </div>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'दो coin machines, एक साझा coin stream' : 'two coin machines, one shared coin stream'}
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Machine label="Mealy" color={MEALY} state={sMealy} dispense={dispenseMealy} maxState={1} />
        <Machine label="Moore" color={MOORE} state={sMoore} dispense={dispenseMoore} maxState={2} />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
        <Toggle label={lang === 'hi' ? 'coin अभी डाल रहे' : 'inserting a coin now'} v={xIn} onClick={() => setXIn((v) => v ^ 1)} color="#f59e0b" />
        <button onClick={confirm}
          className="rounded-xl px-5 py-2.5 font-mono text-[12px] font-black text-black active:scale-95"
          style={{ background: accent }}>
          {lang === 'hi' ? 'confirm / अगला click ▶' : 'confirm / next click ▶'}
        </button>
      </div>
      <p className={`mt-3 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>coin toggle कीजिए (confirm दबाने से पहले भी) - <b style={{ color: MEALY }}>Mealy</b> तुरंत react करता है; <b style={{ color: MOORE }}>Moore</b> का हाल confirm दबाने के बाद ही पढ़िए।</>
          : <>toggle the coin (even before confirming) - <b style={{ color: MEALY }}>Mealy</b> reacts on the spot; only read <b style={{ color: MOORE }}>Moore</b>'s light after you've pressed confirm.</>}
      </p>
    </Card>
  );
};

/* ───────── part assignment ───────── */
const partAt = (i: number): string =>
  i <= 2 ? 'PART I · THE IDEA'
    : i <= 4 ? 'PART II · COMPARE & DETECT'
      : i <= 7 ? 'PART III · ENCODE & BUILD'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  switch (scene.id) {
    case 'S02_Facts': return 'facts';
    case 'S03_Compare': return 'compare';
    case 'S04_SequenceDetector': return 'detector';
    case 'S05_Encoding': return 'encoding';
    case 'S06_Analogy': return 'analogy';
    case 'S07_Build': return 'build';
    default: return null;
  }
};

function componentFor(scene: SubScene, _i: number, _n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle}
        kicker="Mealy & Moore · Two Philosophies Of Output"
        hero={<TwinLive isDarkMode={p.isDarkMode} accent={p.accent} />} />;
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
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="FSM" tag="Practice · Mealy & Moore" title={scene.label} intro={scene.subtitle ?? ''} />
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
              <BlockDiagramCompare isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'compare' && (
            <div className="space-y-6">
              <TryItYourself />
              <TimingCompare isDarkMode={p.isDarkMode} accent={p.accent} />
              <GlitchDemo isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'detector' && (
            <div className="space-y-6">
              <TryItYourself />
              <SequenceDetectorLab isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'encoding' && (
            <div className="space-y-6">
              <TryItYourself />
              <EncodingLab isDarkMode={p.isDarkMode} accent={p.accent} />
              <EncodingVideo isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'analogy' && (
            <div className="space-y-6">
              <TryItYourself />
              <VendingCompare isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="sequence-detector"
              titleEN="Build the 1011 Mealy detector for real"
              titleHI="असली में 1011 Mealy detector बनाइए"
              bodyEN="Open the live workbench and wire the 4-state Mealy machine from two flip-flops, the next-state logic and the output AND/OR gates that read the state AND the input together - then feed in your own bit stream and prove the output pulses land exactly where 1011 completes."
              bodyHI="live workbench खोलिए और दो flip-flops, next-state logic, तथा state और input दोनों पढ़ने वाले output AND/OR gates से 4-state Mealy machine बनाइए - फिर अपनी bit stream feed कीजिए और साबित कीजिए कि output pulse ठीक वहीं आता है जहाँ 1011 पूरा होता है।" />
          )}
        </TheoryScene>
      );
    }
  }
}

const slug = (s: string) => s.replace(/^S\d+_/, '').toLowerCase();

export const PAGES: SubPage[] = CONTENT.scenes.map((scene, i, arr) => ({
  id: slug(scene.id),
  part: partAt(i),
  label: scene.label,
  subtitle: scene.subtitle ?? '',
  Component: componentFor(scene, i, arr.length),
}));
