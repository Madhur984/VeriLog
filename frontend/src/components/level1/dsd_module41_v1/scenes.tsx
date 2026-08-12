/**
 * Asynchronous Sequential Circuits - dsd/41, "No Clock, Just Feedback".
 * Generic scenes come from the shared _subtractor kit; the feedback-loop
 * stability viz, the fundamental-mode illegal-change simulator, the
 * pulse-width lab, the primitive flow table, the critical/non-critical race
 * lab, the race-free assignment lab and the no-referee conversation analogy
 * are bespoke. EVERY value (Y vs y, settle verdicts, pulse-width verdict,
 * race outcomes, race-free checks) is COMPUTED in code by iterating the
 * excitation equations - never hardcoded.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Clock, AlertTriangle, CheckCircle2, XCircle, PlayCircle } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import {
  SRLatchViz, TimingDiagram, StateTable, Toggle,
  type WaveSignal,
} from '../_sequential/blocks';
import { TryItYourself } from '../../ui/TryItYourself';
import { CustomVideoPlayer } from '../../ui/CustomVideoPlayer';
import { CONTENT } from './content';

const SRC_EN: string | undefined = '/videos/dsd41-async-intro.mp4';
const SRC_DESIGN = '/videos/dsd41-async-design.mp4';

/* ═══════════ computed excitation engines (single source of truth) ═══════════ */

/** S02: a one-secondary feedback loop. Y = x + x'.y (set-dominant hold). */
const asyncExcite = (x: number, y: number): number => x | ((x ^ 1) & y);

/** S03: a two-input, one-secondary feedback function used to drive the
 *  fundamental-mode simulator's excitation table. */
const fmExcite = (w0: number, w1: number, y: number): number => (w0 & w1) | (y & (w0 | w1));

/** S06/S07: a generic asynchronous "settle" simulator. Each variable's next
 *  value is computed from its excitation equation; at every micro-step, any
 *  variable whose excitation differs from its present value is "unstable".
 *  If more than one is unstable at once that step is a race (raceWidths[i] >
 *  1); the supplied `order` breaks the tie by choosing which unstable
 *  variable actually moves. Iterates to a fixed point (or gives up after
 *  maxSteps), exactly like the cross-coupled iteration used elsewhere on
 *  this track. */
type StateVars = Record<string, number>;
type Eqns = Record<string, (s: StateVars) => number>;
interface SettleResult { trace: StateVars[]; raceWidths: number[]; maxRaceWidth: number; stable: boolean; }

function settleTrace(eqns: Eqns, initial: StateVars, order: string[], maxSteps = 8): SettleResult {
  const allVars = Object.keys(eqns);
  let s: StateVars = { ...initial };
  const trace: StateVars[] = [{ ...s }];
  const raceWidths: number[] = [];
  let stable = false;
  for (let step = 0; step < maxSteps; step++) {
    const next: StateVars = {};
    allVars.forEach((v) => { next[v] = eqns[v](s); });
    const unstable = allVars.filter((v) => next[v] !== s[v]);
    raceWidths.push(unstable.length);
    if (unstable.length === 0) { stable = true; break; }
    const pick = order.find((v) => unstable.includes(v)) ?? unstable[0];
    s = { ...s, [pick]: next[pick] };
    trace.push({ ...s });
  }
  const maxRaceWidth = raceWidths.length ? Math.max(...raceWidths) : 0;
  return { trace, raceWidths, maxRaceWidth, stable };
}

/** The S06 baseline: a cross-coupled "arbiter" pair - each variable's
 *  excitation depends on the OTHER variable's present value, the classic
 *  source of a critical race. Reused as the comparison baseline in S07. */
const arbiterEqns: Eqns = {
  w: (s) => s.w,
  y1: (s) => s.w & (s.y2 ^ 1),
  y2: (s) => s.w & (s.y1 ^ 1),
};
/** A non-critical counter-example: both variables track the input
 *  independently, so no order can ever disagree with another. */
const independentEqns: Eqns = {
  w: (s) => s.w,
  y1: (s) => s.w,
  y2: (s) => s.w,
};

const traceToWaves = (trace: StateVars[], vars: { name: string; color: string }[]): WaveSignal[] =>
  vars.map((v) => ({ name: v.name, values: trace.map((s) => s[v.name] ?? 0), color: v.color }));

/* ═══════════ bespoke: the "no clock" cover hero (S00) ═══════════
   X drives Y directly - no delay, no gating, no CLK pin anywhere - so Q
   flips the instant X is toggled, contrasted with a crossed-out clock. */
const NoClockHero: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const [x, setX] = useState(0);
  const [flash, setFlash] = useState(0);
  const toggle = () => { setX((v) => v ^ 1); setFlash((f) => f + 1); };

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'कोई clock नहीं · feedback loop instant react करता है' : 'no clock · the feedback loop reacts instantly'}
      </div>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-10">
        <svg viewBox="0 0 220 140" className="w-full max-w-[260px]">
          <line x1="6" y1="70" x2="70" y2="70" stroke={x ? accent : dim} strokeWidth="3" />
          <text x="2" y="62" fontFamily="monospace" fontSize="11" fontWeight="800" fill={x ? accent : dim}>X={x}</text>
          <rect x="70" y="40" width="80" height="60" rx="10" fill={box} stroke={accent} strokeWidth="2.5" />
          <text x="110" y="72" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>logic</text>
          <text x="110" y="86" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={dim}>no CLK in</text>
          <motion.line key={flash} x1="150" y1="70" x2="210" y2="70" stroke={accent} strokeWidth="3.5"
            initial={{ opacity: 0.15 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} />
          <circle cx="150" cy="70" r="5" fill={accent} />
          <text x="184" y="58" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="900" fill={accent}>Q={x}</text>
          <path d="M210,80 q10,42 -100,42 q-42,0 -42,-22" fill="none" stroke={dim} strokeWidth="1.6" strokeDasharray="4 3" />
        </svg>
        <div className="flex flex-col items-center gap-3">
          <button onClick={toggle}
            className="flex items-center gap-2 rounded-2xl px-5 py-2.5 font-black text-black active:scale-95"
            style={{ background: accent }}>
            <RefreshCw size={15} /> {lang === 'hi' ? 'X toggle कीजिए' : 'toggle X'}
          </button>
          <div className="relative flex h-11 w-11 items-center justify-center">
            <Clock size={26} style={{ color: isDarkMode ? '#475569' : '#94a3b8' }} />
            <span className="absolute rounded-full" style={{ top: '50%', left: '50%', width: '34px', height: '3px', background: '#fb7185', transform: 'translate(-50%,-50%) rotate(45deg)' }} />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#fb7185' }}>
            {lang === 'hi' ? 'कोई CLK pin नहीं' : 'no CLK pin'}
          </span>
        </div>
      </div>
      <p className={`mt-4 text-center font-mono text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>X बदलते ही Q तुरंत बदलता है - किसी edge का इंतज़ार नहीं।</>
          : <>the instant X changes, Q changes too - no edge to wait for.</>}
      </p>
    </Card>
  );
};

/* ═══════════ bespoke: the feedback-loop stability viz (S02) ═══════════
   Y = x + x'.y computed live; y only moves when the "gate delay elapses"
   button is pressed, so Y and y visibly disagree (SETTLING) until they do. */
const FeedbackLoopViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const Y = asyncExcite(x, y);
  const stable = Y === y;
  const propagate = () => setY(Y);

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? "feedback loop · Y = x + x'.y" : "feedback loop · Y = x + x'.y"}
      </div>
      <svg viewBox="0 0 300 150" className="mx-auto w-full max-w-lg">
        <line x1="10" y1="60" x2="90" y2="60" stroke={x ? accent : dim} strokeWidth="3" />
        <text x="2" y="52" fontFamily="monospace" fontSize="11" fontWeight="800" fill={x ? accent : dim}>x={x}</text>
        <rect x="90" y="30" width="90" height="70" rx="10" fill={box} stroke={accent} strokeWidth="2.5" />
        <text x="135" y="58" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>combinational</text>
        <text x="135" y="74" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={dim}>logic block</text>
        <line x1="90" y1="90" x2="60" y2="90" stroke={y ? accent : dim} strokeWidth="2.5" strokeDasharray="4 3" />
        <line x1="60" y1="90" x2="60" y2="120" stroke={y ? accent : dim} strokeWidth="2.5" strokeDasharray="4 3" />
        <text x="10" y="124" fontFamily="monospace" fontSize="10" fontWeight="800" fill={y ? accent : dim}>y={y}</text>
        <line x1="180" y1="60" x2="250" y2="60" stroke={Y ? accent : dim} strokeWidth="3" />
        <text x="252" y="56" fontFamily="monospace" fontSize="12" fontWeight="900" fill={Y ? accent : dim}>Y={Y}</text>
        <rect x="212" y="94" width="40" height="22" rx="5" fill={box} stroke={isDarkMode ? '#94a3b8' : '#475569'} strokeWidth="1.6" />
        <text x="232" y="109" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={isDarkMode ? '#94a3b8' : '#475569'}>delay</text>
        <path d="M232,94 L232,60" fill="none" stroke={dim} strokeWidth="1.6" strokeDasharray="3 3" />
        <path d="M60,120 Q232,142 232,116" fill="none" stroke={dim} strokeWidth="1.6" strokeDasharray="3 3" />
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
        <Toggle label="x" v={x} onClick={() => setX(x ^ 1)} color={accent} />
        <button onClick={propagate} disabled={stable}
          className="rounded-2xl border-2 px-5 py-2.5 font-mono text-[12px] font-black uppercase active:scale-95"
          style={{ borderColor: stable ? `${accent}33` : '#f59e0b', color: stable ? (t.faint as unknown as string) : '#f59e0b', opacity: stable ? 0.5 : 1 }}>
          {lang === 'hi' ? 'delay गुज़रने दें (y:=Y)' : 'let the delay elapse (y:=Y)'}
        </button>
        <span className="rounded-full px-3 py-1 font-mono text-[11px] font-black"
          style={{ background: stable ? '#34d39922' : '#f59e0b22', color: stable ? '#34d399' : '#f59e0b' }}>
          {stable ? 'STABLE (Y=y)' : "SETTLING (Y≠y)"}
        </span>
      </div>
      <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? <>Y हर render पर code में x और y से गिना गया - कभी hardcode नहीं।</>
          : <>Y is computed in code from x and y on every render - never hardcoded.</>}
      </p>
    </Card>
  );
};

/* ═══════════ bespoke: fundamental-mode input-change simulator (S03) ═══════════
   Select at most one of w0/w1 then Apply; two selected at once is flagged
   illegal, and Apply is refused while the circuit hasn't settled (Y≠y). */
const FundamentalModeViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const [w, setW] = useState<[number, number]>([0, 0]);
  const [y, setY] = useState(0);
  const [pending, setPending] = useState<number[]>([]);
  const [flag, setFlag] = useState<'multi' | 'unsettled' | null>(null);
  const Y = fmExcite(w[0], w[1], y);
  const stable = Y === y;

  const togglePending = (i: number) => {
    setFlag(null);
    setPending((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  };
  const apply = () => {
    if (pending.length === 0) return;
    if (pending.length > 1) { setFlag('multi'); return; }
    if (!stable) { setFlag('unsettled'); return; }
    const idx = pending[0];
    setW((prev) => { const nw: [number, number] = [...prev]; nw[idx] = nw[idx] ^ 1; return nw; });
    setPending([]);
    setFlag(null);
  };
  const settle = () => { setY(Y); setFlag(null); };

  const rows = [0, 1, 2, 3, 4, 5, 6, 7].map((n) => {
    const w0 = (n >> 2) & 1, w1 = (n >> 1) & 1, yy = n & 1;
    return [w0, w1, yy, fmExcite(w0, w1, yy)] as (string | number)[];
  });
  const curRowIdx = w[0] * 4 + w[1] * 2 + y;

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'input-change simulator · एक बार में एक चुनिए' : 'input-change simulator · pick one at a time'}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[0, 1].map((i) => (
            <button key={i} onClick={() => togglePending(i)}
              className="flex flex-col items-center gap-1.5 rounded-2xl border-2 px-4 py-2.5 active:scale-95"
              style={{ borderColor: pending.includes(i) ? accent : `${accent}33`, background: pending.includes(i) ? `${accent}18` : 'transparent' }}>
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>w{i}</span>
              <span className="font-mono text-xl font-black" style={{ color: w[i] ? accent : dim }}>{w[i]}</span>
              <span className={`font-mono text-[9px] ${t.faint}`}>
                {pending.includes(i) ? (lang === 'hi' ? 'flip के लिए चुना' : 'selected to flip') : (lang === 'hi' ? 'tap कीजिए' : 'tap to select')}
              </span>
            </button>
          ))}
          <button onClick={apply} className="rounded-2xl px-5 py-3 font-black text-black active:scale-95" style={{ background: accent }}>
            Apply
          </button>
          <button onClick={settle} disabled={stable}
            className="rounded-2xl border-2 px-5 py-3 font-mono text-[12px] font-black uppercase active:scale-95"
            style={{ borderColor: stable ? `${accent}33` : '#f59e0b', color: stable ? (t.faint as unknown as string) : '#f59e0b', opacity: stable ? 0.5 : 1 }}>
            {lang === 'hi' ? 'Settle (y:=Y)' : 'Settle (y:=Y)'}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 font-mono text-[13px]">
          <span className={t.sub}>y = <b style={{ color: accent }}>{y}</b></span>
          <span className={t.sub}>Y = <b style={{ color: stable ? '#34d399' : '#f59e0b' }}>{Y}</b></span>
          <span className="font-black" style={{ color: stable ? '#34d399' : '#f59e0b' }}>{stable ? 'STABLE' : 'SETTLING'}</span>
        </div>

        {flag === 'multi' && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center justify-center gap-2 text-center font-mono text-[12px] font-bold" style={{ color: '#fb7185' }}>
            <AlertTriangle size={14} />
            {lang === 'hi' ? 'दो inputs एक साथ चुने गए - fundamental mode में illegal, कुछ नहीं बदला' : 'two inputs selected at once - illegal in fundamental mode, nothing changed'}
          </motion.p>
        )}
        {flag === 'unsettled' && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center justify-center gap-2 text-center font-mono text-[12px] font-bold" style={{ color: '#f59e0b' }}>
            <AlertTriangle size={14} />
            {lang === 'hi' ? "circuit अभी settle नहीं हुआ (Y≠y) - अगला input बदलने से पहले settle कीजिए" : "circuit hasn't settled yet (Y≠y) - settle before changing another input"}
          </motion.p>
        )}
      </Card>
      <StateTable isDarkMode={isDarkMode} accent={accent}
        headers={['w0', 'w1', 'y', 'Y']} rows={rows} highlight={curRowIdx}
        note={lang === 'hi' ? 'हर row code में fmExcite(w0,w1,y) से गिना गया' : 'every row computed in code from fmExcite(w0, w1, y)'} />
    </div>
  );
};

/* ═══════════ bespoke: the pulse-width lab (S04) ═══════════
   Three sliders (t_pd_FF, t_w, t_feedback_delay); the verdict is computed
   live from the two inequalities, never a lookup table. */
const PulseWidthLab: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [tpdFF, setTpdFF] = useState(15);
  const [tw, setTw] = useState(30);
  const [tfb, setTfb] = useState(55);
  const verdict: 'short' | 'safe' | 'oscillate' = tw <= tpdFF ? 'short' : tw >= tfb ? 'oscillate' : 'safe';
  const windowExists = tpdFF < tfb;
  const maxScale = Math.max(tpdFF, tw, tfb, 10);
  const pct = (v: number) => Math.round((v / maxScale) * 100);

  const verdictMeta = {
    short: { labelEN: 'too short - the flip-flop never sees it', labelHI: 'बहुत छोटा - flip-flop उसे कभी देखता ही नहीं', color: '#fb7185' },
    safe: { labelEN: 'safe - captured cleanly, exactly once', labelHI: 'सुरक्षित - साफ़-साफ़, ठीक एक बार capture', color: '#34d399' },
    oscillate: { labelEN: 'too long - retriggers into oscillation', labelHI: 'बहुत लंबा - oscillation में फिर trigger', color: '#f59e0b' },
  } as const;

  const Row: React.FC<{ label: string; v: number; set: (n: number) => void; max: number; color: string }> = ({ label, v, set, max, color }) => (
    <div className="flex items-center gap-3">
      <span className="w-28 flex-shrink-0 font-mono text-[11px] font-bold" style={{ color }}>{label}</span>
      <input type="range" min={2} max={max} value={v} onChange={(e) => set(Number(e.target.value))}
        className="w-full" style={{ accentColor: color }} />
      <span className="w-14 flex-shrink-0 text-right font-mono text-[12px] font-black" style={{ color }}>{v}ms</span>
    </div>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'pulse-width lab · sliders खींचिए' : 'pulse-width lab · drag the sliders'}
      </div>
      <div className="space-y-3">
        <Row label="t_pd_FF" v={tpdFF} set={setTpdFF} max={90} color="#38bdf8" />
        <Row label="t_w" v={tw} set={setTw} max={90} color={accent} />
        <Row label="t_feedback_delay" v={tfb} set={setTfb} max={90} color="#f59e0b" />
      </div>

      <div className="mt-5 space-y-2">
        {[{ l: 't_pd_FF', v: tpdFF, c: '#38bdf8' }, { l: 't_w', v: tw, c: accent }, { l: 't_feedback_delay', v: tfb, c: '#f59e0b' }].map((b) => (
          <div key={b.l} className="flex items-center gap-2">
            <span className={`w-28 flex-shrink-0 font-mono text-[10px] ${t.faint}`}>{b.l}</span>
            <div className={`h-3 flex-1 overflow-hidden rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
              <div className="h-full rounded-full" style={{ width: `${pct(b.v)}%`, background: b.c }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border p-3 text-center" style={{ borderColor: `${verdictMeta[verdict].color}55`, background: `${verdictMeta[verdict].color}14` }}>
        <span className="font-mono text-[13px] font-black" style={{ color: verdictMeta[verdict].color }}>
          {lang === 'hi' ? verdictMeta[verdict].labelHI : verdictMeta[verdict].labelEN}
        </span>
      </div>
      {!windowExists && (
        <p className="mt-2 text-center font-mono text-[11px]" style={{ color: '#fb7185' }}>
          {lang === 'hi'
            ? 't_pd_FF, t_feedback_delay से छोटा नहीं है - इन delays के लिए कोई pulse width कभी सुरक्षित नहीं'
            : 't_pd_FF is not less than t_feedback_delay - no pulse width is ever safe for these delays'}
        </p>
      )}
      <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? <>verdict हर बार t_w को t_pd_FF और t_feedback_delay से compare करके गिना गया।</>
          : <>the verdict is computed every time by comparing t_w against t_pd_FF and t_feedback_delay.</>}
      </p>
    </Card>
  );
};

/* ═══════════ bespoke: the primitive flow table (S05) ═══════════
   The FACTS_C worked example (states A-F, DN=00/01/10, output z). Stable
   cells are computed (cell === row.id), not hardcoded parentheses. */
interface FlowRow { id: string; cells: (string | null)[]; z: number }
const FLOW_ROWS: FlowRow[] = [
  { id: 'A', cells: ['A', 'B', 'C'], z: 0 },
  { id: 'B', cells: ['D', 'B', null], z: 0 },
  { id: 'C', cells: ['A', null, 'C'], z: 1 },
  { id: 'D', cells: ['D', 'E', 'F'], z: 0 },
  { id: 'E', cells: ['A', 'E', null], z: 1 },
  { id: 'F', cells: ['A', null, 'F'], z: 1 },
];
const DN_COLS = ['00', '01', '10'];

const FlowTableViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [hi, setHi] = useState<string | null>(null);
  const border = isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)';

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'primitive flow table · row पर click कीजिए' : 'primitive flow table · click a row'}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center font-mono">
          <thead>
            <tr>
              <th className="px-3 py-2.5 text-[13px] font-black" style={{ color: accent, borderBottom: `2px solid ${accent}55` }}>PS</th>
              {DN_COLS.map((c) => (
                <th key={c} className="px-3 py-2.5 text-[13px] font-black" style={{ color: accent, borderBottom: `2px solid ${accent}55` }}>DN={c}</th>
              ))}
              <th className="px-3 py-2.5 text-[13px] font-black" style={{ color: accent, borderBottom: `2px solid ${accent}55` }}>z</th>
            </tr>
          </thead>
          <tbody>
            {FLOW_ROWS.map((row) => {
              const active = row.id === hi;
              return (
                <tr key={row.id} onClick={() => setHi(row.id === hi ? null : row.id)}
                  className="cursor-pointer" style={active ? { background: `${accent}18` } : undefined}>
                  <td className="px-3 py-2 text-[14px] font-black" style={{ color: accent, borderTop: border }}>{row.id}</td>
                  {row.cells.map((c, ci) => {
                    const stable = c !== null && c === row.id;
                    const label = c === null ? '–' : stable ? `(${c})` : c;
                    return (
                      <td key={ci} className="px-3 py-2 text-[14px] font-bold"
                        style={{
                          color: c === null ? (t.faint as unknown as string) : stable ? accent : (t.text as unknown as string),
                          background: stable ? `${accent}22` : undefined,
                          borderTop: border,
                        }}>{label}</td>
                    );
                  })}
                  <td className="px-3 py-2 text-[14px] font-bold" style={{ color: t.text as unknown as string, borderTop: border }}>{row.z}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={`px-1 pt-3 text-[12px] ${t.faint}`}>
        {lang === 'hi'
          ? '( ) में लिपटी entry = stable/circled (row की अपनी state के बराबर) · – = इस row से पहुँच से बाहर'
          : "entries in ( ) = stable/circled (equal to the row's own state) · – = unreachable from this row"}
      </div>
      {hi && (() => {
        const row = FLOW_ROWS.find((r) => r.id === hi);
        if (!row) return null;
        const stableCol = row.cells.findIndex((c) => c === row.id);
        return (
          <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>Row {row.id}: DN={DN_COLS[stableCol]} पर stable (circled), क्योंकि वहाँ next state = {row.id} = current state · z={row.z}</>
              : <>Row {row.id}: stable (circled) at DN={DN_COLS[stableCol]}, because the next state there = {row.id} = the current state · z={row.z}</>}
          </p>
        );
      })()}
    </Card>
  );
};

/** The second embedded video, right on the flow-table scene, per the spec. */
const DesignVideoEmbed: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        <PlayCircle size={13} /> {lang === 'hi' ? 'flow table से design तक · video' : 'flow table to design · video'}
      </div>
      <div className={`overflow-hidden rounded-3xl border ${t.card}`}>
        <CustomVideoPlayer src={SRC_DESIGN} accent={accent} className="rounded-3xl border-0" />
      </div>
    </div>
  );
};

/* ═══════════ bespoke: critical vs non-critical race lab (S06) ═══════════
   The arbiter pair Y1=w.y2', Y2=w.y1' (critical) vs the independent pair
   Y1=w, Y2=w (non-critical). Both orders are computed via settleTrace and
   compared - the CRITICAL/NON-CRITICAL verdict is that comparison. */
const RaceLab: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [scenario, setScenario] = useState<'critical' | 'noncritical'>('critical');
  const [winner, setWinner] = useState<'y1' | 'y2'>('y1');
  const eqns = scenario === 'critical' ? arbiterEqns : independentEqns;
  const initial: StateVars = { w: 1, y1: 0, y2: 0 };
  const orderA = winner === 'y1' ? ['y1', 'y2'] : ['y2', 'y1'];
  const orderB = winner === 'y1' ? ['y2', 'y1'] : ['y1', 'y2'];
  const resA = settleTrace(eqns, initial, orderA);
  const resB = settleTrace(eqns, initial, orderB);
  const finalA = resA.trace[resA.trace.length - 1];
  const finalB = resB.trace[resB.trace.length - 1];
  const disagree = finalA.y1 !== finalB.y1 || finalA.y2 !== finalB.y2;

  const waves = traceToWaves(resA.trace, [
    { name: 'w', color: '#94a3b8' },
    { name: 'y1', color: '#38bdf8' },
    { name: 'y2', color: '#fb7185' },
  ]);

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        {(['critical', 'noncritical'] as const).map((s) => (
          <button key={s} onClick={() => setScenario(s)}
            className="rounded-lg border px-3 py-1.5 font-mono text-[12px] font-black transition-colors"
            style={scenario === s ? { background: accent, color: '#000', borderColor: accent } : { borderColor: `${accent}44`, color: accent }}>
            {s === 'critical' ? "Arbiter (Y1=w.y2', Y2=w.y1')" : 'Independent (Y1=w, Y2=w)'}
          </button>
        ))}
      </div>
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'winner चुनिए' : 'pick the winner'}</span>
        {(['y1', 'y2'] as const).map((wv) => (
          <button key={wv} onClick={() => setWinner(wv)}
            className="rounded-lg border px-3 py-1.5 font-mono text-[12px] font-black transition-colors"
            style={winner === wv ? { background: accent, color: '#000', borderColor: accent } : { borderColor: `${accent}44`, color: accent }}>
            {wv} {lang === 'hi' ? 'पहले' : 'first'}
          </button>
        ))}
      </div>

      <TimingDiagram isDarkMode={isDarkMode} accent={accent} signals={waves} showClock={false} />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className={`rounded-2xl border p-3 text-center ${t.soft}`}>
          <div className={`font-mono text-[10px] ${t.faint}`}>{winner} {lang === 'hi' ? 'पहले · settles to' : 'first · settles to'}</div>
          <div className="mt-1 font-mono text-lg font-black" style={{ color: accent }}>y1={finalA.y1} y2={finalA.y2}</div>
        </div>
        <div className={`rounded-2xl border p-3 text-center ${t.soft}`}>
          <div className={`font-mono text-[10px] ${t.faint}`}>{winner === 'y1' ? 'y2' : 'y1'} {lang === 'hi' ? 'पहले (दूसरा क्रम) · settles to' : 'first (the other order) · settles to'}</div>
          <div className="mt-1 font-mono text-lg font-black" style={{ color: disagree ? '#fb7185' : accent }}>y1={finalB.y1} y2={finalB.y2}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border p-3 text-center"
        style={{ borderColor: disagree ? '#fb718555' : '#34d39955', background: disagree ? '#fb718514' : '#34d39914' }}>
        {disagree ? <AlertTriangle size={16} style={{ color: '#fb7185' }} /> : <CheckCircle2 size={16} style={{ color: '#34d399' }} />}
        <span className="font-mono text-[13px] font-black" style={{ color: disagree ? '#fb7185' : '#34d399' }}>
          {disagree
            ? (lang === 'hi' ? 'CRITICAL RACE - दोनों क्रम असहमत' : 'CRITICAL RACE - the two orders disagree')
            : (lang === 'hi' ? 'NON-CRITICAL - दोनों क्रम एक ही state पर मिलते हैं' : 'NON-CRITICAL - both orders land on the same state')}
        </span>
      </div>
      <p className={`mt-2 text-center font-mono text-[11px] ${t.faint}`}>
        {lang === 'hi'
          ? <>दोनों trace settleTrace(eqns, ...) से code में computed, हार्डकोड नहीं।</>
          : <>both traces are computed in code by settleTrace(eqns, ...), never hardcoded.</>}
      </p>
    </Card>
  );
};

/* ═══════════ bespoke: race-free assignment lab (S07) ═══════════
   Three strategies redesign the S06 arbiter pair; each is run through the
   same settleTrace engine and its maxRaceWidth is computed and compared
   against the racy baseline (always 2). */
type Strategy = 'gray' | 'bridge' | 'onehot';

function strategyConfig(strategy: Strategy): { eqns: Eqns; initial: StateVars; order: string[]; vars: { name: string; color: string }[] } {
  if (strategy === 'gray') {
    return {
      eqns: { w: (s) => s.w, y1: (s) => s.w, y2: (s) => s.y1 },
      initial: { w: 1, y1: 0, y2: 0 },
      order: ['y1', 'y2'],
      vars: [{ name: 'w', color: '#94a3b8' }, { name: 'y1', color: '#38bdf8' }, { name: 'y2', color: '#fb7185' }],
    };
  }
  if (strategy === 'bridge') {
    return {
      eqns: { w: (s) => s.w, y3: (s) => s.w, y1: (s) => s.y3, y2: (s) => s.y1 },
      initial: { w: 1, y3: 0, y1: 0, y2: 0 },
      order: ['y3', 'y1', 'y2'],
      vars: [{ name: 'w', color: '#94a3b8' }, { name: 'y3', color: '#f59e0b' }, { name: 'y1', color: '#38bdf8' }, { name: 'y2', color: '#fb7185' }],
    };
  }
  return {
    eqns: { w: (s) => s.w, h0: (s) => s.h0 & (s.h1 ^ 1), h1: (s) => s.w & (s.h0 | s.h1) },
    initial: { w: 1, h0: 1, h1: 0 },
    order: ['h1', 'h0'],
    vars: [{ name: 'w', color: '#94a3b8' }, { name: 'h0', color: '#38bdf8' }, { name: 'h1', color: '#fb7185' }],
  };
}

const STRAT_META: Record<Strategy, { labelEN: string; labelHI: string; descEN: string; descHI: string }> = {
  gray: {
    labelEN: 'Gray coding', labelHI: 'Gray coding',
    descEN: "y2's equation follows y1's own value instead of racing it - only one variable is ever unstable at a time.",
    descHI: 'y2 का equation y1 के मान का पीछा करता है, उससे race करने के बजाय - एक बार में सिर्फ़ एक variable ही unstable होता है।',
  },
  bridge: {
    labelEN: 'Transition-bridge variable', labelHI: 'Transition-bridge variable',
    descEN: 'An extra variable y3 sequences the jump: w fires y3, y3 fires y1, y1 fires y2 - one safe single-bit hop at a time.',
    descHI: 'एक अतिरिक्त variable y3 जंप को sequence करता है: w, y3 को चलाता है, y3, y1 को, y1, y2 को - एक बार में एक सुरक्षित single-bit hop।',
  },
  onehot: {
    labelEN: 'One-hot coding', labelHI: 'One-hot coding',
    descEN: 'h0 and h1 are dedicated to the two states; h1 latches on from h0, then h0 releases - a controlled hand-off, never a shared race.',
    descHI: 'h0 और h1 दो states के लिए समर्पित हैं; h1, h0 से latch होकर on होता है, फिर h0 छूटता है - एक नियंत्रित hand-off, कभी साझा race नहीं।',
  },
};

const RaceFreeLab: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [strategy, setStrategy] = useState<Strategy>('gray');
  const cfg = strategyConfig(strategy);
  const res = settleTrace(cfg.eqns, cfg.initial, cfg.order);
  const baseline = settleTrace(arbiterEqns, { w: 1, y1: 0, y2: 0 }, ['y1', 'y2']);
  const waves = traceToWaves(res.trace, cfg.vars);
  const raceFree = res.maxRaceWidth <= 1;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        {(['gray', 'bridge', 'onehot'] as const).map((s) => (
          <button key={s} onClick={() => setStrategy(s)}
            className="rounded-lg border px-3 py-1.5 font-mono text-[12px] font-black transition-colors"
            style={strategy === s ? { background: accent, color: '#000', borderColor: accent } : { borderColor: `${accent}44`, color: accent }}>
            {lang === 'hi' ? STRAT_META[s].labelHI : STRAT_META[s].labelEN}
          </button>
        ))}
      </div>
      <p className={`mb-4 text-center text-[13px] ${t.sub}`}>{lang === 'hi' ? STRAT_META[strategy].descHI : STRAT_META[strategy].descEN}</p>

      <TimingDiagram isDarkMode={isDarkMode} accent={accent} signals={waves} showClock={false} />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border p-3 text-center" style={{ borderColor: '#fb718555', background: '#fb718514' }}>
          <div className={`font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? 'S06 baseline (racy arbiter)' : 'S06 baseline (racy arbiter)'}</div>
          <div className="mt-1 font-mono text-2xl font-black" style={{ color: '#fb7185' }}>{baseline.maxRaceWidth}</div>
          <div className={`font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? 'max simultaneous-unstable' : 'max simultaneous-unstable'}</div>
        </div>
        <div className="rounded-2xl border p-3 text-center" style={{ borderColor: raceFree ? '#34d39955' : '#fb718555', background: raceFree ? '#34d39914' : '#fb718514' }}>
          <div className={`font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? STRAT_META[strategy].labelHI : STRAT_META[strategy].labelEN}</div>
          <div className="mt-1 font-mono text-2xl font-black" style={{ color: raceFree ? '#34d399' : '#fb7185' }}>{res.maxRaceWidth}</div>
          <div className={`font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? 'max simultaneous-unstable' : 'max simultaneous-unstable'}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border p-3 text-center"
        style={{ borderColor: raceFree ? '#34d39955' : '#fb718555', background: raceFree ? '#34d39914' : '#fb718514' }}>
        {raceFree ? <CheckCircle2 size={16} style={{ color: '#34d399' }} /> : <XCircle size={16} style={{ color: '#fb7185' }} />}
        <span className="font-mono text-[13px] font-black" style={{ color: raceFree ? '#34d399' : '#fb7185' }}>
          {raceFree
            ? (lang === 'hi' ? 'RACE-FREE - कभी दो variables एक साथ unstable नहीं' : 'RACE-FREE - never two variables unstable at once')
            : (lang === 'hi' ? 'अब भी racy' : 'still racy')}
        </span>
      </div>
    </Card>
  );
};

/* ═══════════ bespoke: the no-referee conversation analogy (S08) ═══════════
   One speaker at a time -> deterministic; both at once -> a computed
   coin-flip tally, mirroring the race labs above. */
const ConversationViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [mode, setMode] = useState<'polite' | 'chaos'>('polite');
  const [speaker, setSpeaker] = useState<'A' | 'B'>('A');
  const [heard, setHeard] = useState<'A' | 'B' | null>(null);
  const [tally, setTally] = useState<{ a: number; b: number }>({ a: 0, b: 0 });

  const speak = () => {
    if (mode === 'polite') { setHeard(speaker); return; }
    const winner: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';
    setHeard(winner);
    setTally((c) => ({ a: c.a + (winner === 'A' ? 1 : 0), b: c.b + (winner === 'B' ? 1 : 0) }));
  };
  const total = tally.a + tally.b;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        {(['polite', 'chaos'] as const).map((m) => (
          <button key={m} onClick={() => { setMode(m); setHeard(null); }}
            className="rounded-lg border px-3 py-1.5 font-mono text-[12px] font-black transition-colors"
            style={mode === m ? { background: accent, color: '#000', borderColor: accent } : { borderColor: `${accent}44`, color: accent }}>
            {m === 'polite' ? (lang === 'hi' ? 'एक बार में एक (fundamental mode)' : 'one at a time (fundamental mode)') : (lang === 'hi' ? 'दोनों एक साथ (race)' : 'both at once (race)')}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-8">
        {(['A', 'B'] as const).map((p) => {
          const isSpeaking = mode === 'polite' ? speaker === p : true;
          return (
            <div key={p} className="flex flex-col items-center gap-1.5">
              <button onClick={() => mode === 'polite' && setSpeaker(p)} disabled={mode !== 'polite'}
                className="flex h-14 w-14 items-center justify-center rounded-full font-mono text-xl font-black"
                style={{
                  background: isSpeaking ? `${accent}22` : 'transparent',
                  border: `2.5px solid ${isSpeaking ? accent : `${accent}55`}`,
                  color: accent,
                }}>{p}</button>
              <span className={`font-mono text-[10px] ${t.faint}`}>
                {isSpeaking ? (lang === 'hi' ? 'बोल रहा' : 'speaking') : (lang === 'hi' ? 'चुप' : 'quiet')}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center">
        <button onClick={speak} className="rounded-2xl px-6 py-3 font-black text-black active:scale-95" style={{ background: accent }}>
          {lang === 'hi' ? 'बोलिए' : 'speak'}
        </button>
      </div>

      {heard && (
        <motion.p key={`${mode}-${heard}-${total}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
          {lang === 'hi' ? <>सुना गया: <b style={{ color: accent }}>{heard}</b></> : <>heard: <b style={{ color: accent }}>{heard}</b></>}
        </motion.p>
      )}
      {mode === 'chaos' && total > 0 && (
        <p className={`mt-1 text-center font-mono text-[12px] ${t.faint}`}>
          {lang === 'hi' ? 'नतीजे' : 'outcomes'}: A → <b style={{ color: accent }}>{tally.a}</b>{'  '}·{'  '}B → <b style={{ color: accent }}>{tally.b}</b>{'  '}
          ({total} {lang === 'hi' ? 'बार' : 'tries'}) — {lang === 'hi' ? 'कोई भरोसेमंद pattern नहीं' : 'no reliable pattern'}
        </p>
      )}
      <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
        {mode === 'polite'
          ? (lang === 'hi' ? 'एक वक्ता → हर बार वही, साफ़ संदेश (deterministic)।' : 'one speaker → the same, clear message every time (deterministic).')
          : (lang === 'hi' ? 'दोनों साथ → gate-delay जैसा coin-flip तय करता है किसे सुना जाए।' : 'both together → a gate-delay-like coin flip decides who gets heard.')}
      </p>
    </Card>
  );
};

/* ═══════════ part assignment ═══════════ */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · NO CLOCK AT ALL'
    : i <= 5 ? 'PART II · TIMING DISCIPLINE'
      : i <= 8 && i < n - 4 ? 'PART III · RACES & FIXES'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  const key = `${scene.id} ${scene.label}`.toLowerCase();
  if (key.includes('facts')) return 'facts';
  if (key.includes('fundamentalmode')) return 'fundamental';
  if (key.includes('pulsemode')) return 'pulse';
  if (key.includes('flowtable')) return 'flowtable';
  if (key.includes('racefree')) return 'racefree';
  if (key.includes('races')) return 'races';
  if (key.includes('analogy')) return 'analogy';
  if (key.includes('build')) return 'build';
  return null;
};

function componentFor(scene: SubScene, _i: number, _n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => (
        <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle}
          kicker="Asynchronous Sequential Circuits · No Clock, Just Feedback"
          hero={<NoClockHero isDarkMode={p.isDarkMode} accent={p.accent} />} />
      );
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
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="ASYNC" tag="Practice · Async Sequential" title={scene.label} intro={scene.subtitle ?? ''} />
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
              <FeedbackLoopViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'fundamental' && (
            <div className="space-y-6">
              <TryItYourself />
              <FundamentalModeViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'pulse' && (
            <div className="space-y-6">
              <TryItYourself />
              <PulseWidthLab isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'flowtable' && (
            <div className="space-y-6">
              <TryItYourself />
              <FlowTableViz isDarkMode={p.isDarkMode} accent={p.accent} />
              <DesignVideoEmbed isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'races' && (
            <div className="space-y-6">
              <TryItYourself />
              <RaceLab isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'racefree' && (
            <div className="space-y-6">
              <TryItYourself />
              <RaceFreeLab isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'analogy' && (
            <div className="space-y-6">
              <TryItYourself />
              <ConversationViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <div className="space-y-6">
              <SRLatchViz isDarkMode={p.isDarkMode} accent={p.accent} gate="NOR" />
              <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="async-sr-latch"
                titleEN="Build the unclocked SR latch for real"
                titleHI="बिना clock वाला SR latch असली में बनाइए"
                bodyEN="Open the live workbench, wire two cross-coupled NOR gates, and drive them yourself in fundamental mode - change one input, let it settle, then the other - before provoking the exact failure this module studied."
                bodyHI="live workbench खोलिए, दो cross-coupled NOR gates wire कीजिए, और उन्हें ख़ुद fundamental mode में चलाइए - एक input बदलिए, उसे settle होने दीजिए, फिर दूसरा - इससे पहले कि आप ठीक वही विफलता भड़काएँ जो इस module ने पढ़ी।" />
            </div>
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
