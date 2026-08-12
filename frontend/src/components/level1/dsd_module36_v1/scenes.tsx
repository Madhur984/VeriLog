/**
 * Synchronous Counters - dsd/36, "One Clock, Every Flip-Flop" (Sequential Logic
 * track). The live 3-bit synchronous counter comes from the shared
 * _sequential/blocks library (CounterViz mode="sync", which flips every bit in
 * lockstep - no per-stage stagger). The one-clock-bus schematic with its AND-gate
 * next-state logic, the ripple-vs-sync contrast (a computed delay/f_max
 * calculator plus two aligned/staggered TimingDiagrams built from the same
 * transition), the four-step design StepThrough that derives T0=1, T1=Q0,
 * T2=Q0.Q1 from a fully generated 8-row count table, the up/down toggle-equation
 * flip, the MOD-N truncation panel, the one-hot decode grid (with a second
 * embedded video), and the marching-band/dominoes analogy are bespoke. EVERY
 * displayed value (count sequence, excitation column, delay figure, terminal
 * detector, decode minterm) is COMPUTED in code, never hardcoded.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  StepThrough, LiveGate, WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import {
  CounterViz, StateTable, ClockButton, TimingDiagram, Toggle, type WaveSignal,
} from '../_sequential/blocks';
import { TryItYourself } from '../../ui/TryItYourself';
import { CustomVideoPlayer } from '../../ui/CustomVideoPlayer';
import { CONTENT } from './content';

const ACC = { blue: '#38bdf8', good: '#34d399', warn: '#f59e0b', bad: '#fb7185' };
const SRC_EN: string | undefined = '/videos/dsd36-sync-counters.mp4';
const SRC_HI: string | undefined = undefined;
const SRC_DECODE = '/videos/dsd36-decoding.mp4';

const toBin = (n: number, bits = 3) => ((n % (1 << bits)) + (1 << bits)) % (1 << bits);
const binStr = (n: number, bits = 3) => toBin(n, bits).toString(2).padStart(bits, '0');
const bitAt = (n: number, i: number) => (n >> i) & 1;

/* ───────── shared inline +/- stepper ───────── */
const Stepper: React.FC<{
  label: string; value: number; min: number; max: number; step?: number;
  unit?: string; accent: string; isDarkMode: boolean; onChange: (n: number) => void;
}> = ({ label, value, min, max, step = 1, unit, accent, isDarkMode, onChange }) => {
  const t = tone(isDarkMode);
  const btn = (delta: number, sym: string) => (
    <button onClick={() => onChange(Math.max(min, Math.min(max, value + delta)))}
      className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-lg font-black active:scale-90"
      style={{ border: `2px solid ${accent}`, color: accent }}>{sym}</button>
  );
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`font-mono text-[11px] font-bold ${t.faint}`}>{label}</span>
      <div className="flex items-center gap-2">
        {btn(-step, '−')}
        <span className="min-w-[3ch] text-center font-mono text-xl font-black tabular-nums" style={{ color: accent }}>
          {value}{unit ? <span className="ml-0.5 text-[11px]">{unit}</span> : null}
        </span>
        {btn(step, '+')}
      </div>
    </div>
  );
};

/* ───────── S02 · one shared clock bus, three T flip-flops, AND-gate next-state ─────────
   q = [Q0,Q1,Q2] (LSB first). T1 = Q0, T2 = Q0.Q1, T0 tied high - all computed
   from the live count and drawn on the wires. */
const SyncBusSVG: React.FC<{ isDarkMode: boolean; accent: string; q: number[] }>
  = ({ isDarkMode, accent, q }) => {
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const faint = isDarkMode ? '#94a3b8' : '#64748b';
  const [q0, q1] = q;
  const t2 = q0 & q1;
  const xs = [24, 164, 304];
  const W = 70, TOP = 70, H = 76, QY = TOP + H / 2, CLKY = 188;
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 400 210" className="mx-auto w-full" style={{ maxWidth: 560 }}>
        {/* shared clock bus - one line, reaches all three at once */}
        <line x1="8" y1={CLKY} x2="368" y2={CLKY} stroke={accent} strokeWidth="3" />
        <text x="8" y={CLKY + 18} fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>
          CLK · one bus, all three at once
        </text>
        {xs.map((x, i) => (
          <g key={`clk${i}`}>
            <line x1={x + W / 2} y1={CLKY} x2={x + W / 2} y2={TOP + H} stroke={accent} strokeWidth="2.2" />
            <path d={`M${x + W / 2 - 6},${TOP + H - 8} L${x + W / 2},${TOP + H - 2} L${x + W / 2 + 6},${TOP + H - 8}`} fill="none" stroke={faint} strokeWidth="1.4" />
          </g>
        ))}
        {/* T0 tied to constant 1 */}
        <rect x={xs[0] + W / 2 - 11} y="10" width="22" height="18" rx="4" fill="none" stroke={accent} strokeWidth="2" />
        <text x={xs[0] + W / 2} y="23" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="800" fill={accent}>1</text>
        <line x1={xs[0] + W / 2} y1="28" x2={xs[0] + W / 2} y2={TOP} stroke={accent} strokeWidth="2.2" />
        <text x={xs[0] + W / 2} y="8" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={faint}>T0=1</text>
        {/* Q0 -> T1 direct wire */}
        <line x1={xs[0] + W} y1={QY} x2={xs[0] + W + 16} y2={QY} stroke={q0 ? accent : dim} strokeWidth="2.4" />
        <line x1={xs[0] + W + 16} y1={QY} x2={xs[0] + W + 16} y2="24" stroke={q0 ? accent : dim} strokeWidth="2" />
        <line x1={xs[0] + W + 16} y1="24" x2={xs[1] + W / 2} y2="24" stroke={q0 ? accent : dim} strokeWidth="2" />
        <line x1={xs[1] + W / 2} y1="24" x2={xs[1] + W / 2} y2={TOP} stroke={q0 ? accent : dim} strokeWidth="2.2" />
        <text x={xs[1] + W / 2} y="14" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={faint}>T1=Q0</text>
        {/* AND gate -> T2 = Q0.Q1 */}
        <path d={`M${xs[2] + W / 2 - 20},6 L${xs[2] + W / 2 - 4},6 A15,15 0 0 1 ${xs[2] + W / 2 - 4},36 L${xs[2] + W / 2 - 20},36 Z`}
          fill={box} stroke={accent} strokeWidth="2" />
        <text x={xs[2] + W / 2 - 13} y="24" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fontWeight="800" fill={accent}>AND</text>
        <line x1={xs[2] + W / 2 - 4} y1="21" x2={xs[2] + W / 2} y2="21" stroke={t2 ? accent : dim} strokeWidth="2.2" />
        <line x1={xs[2] + W / 2} y1="21" x2={xs[2] + W / 2} y2={TOP} stroke={t2 ? accent : dim} strokeWidth="2.2" />
        <text x={xs[2] + W / 2} y="52" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={faint}>T2=Q0·Q1</text>
        <text x={xs[2] + W / 2 - 40} y="14" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={q0 ? accent : faint}>Q0</text>
        <text x={xs[2] + W / 2 - 40} y="32" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={q1 ? accent : faint}>Q1</text>
        <line x1={xs[2] + W / 2 - 40} y1="10" x2={xs[2] + W / 2 - 20} y2="12" stroke={q0 ? accent : dim} strokeWidth="1.8" />
        <line x1={xs[2] + W / 2 - 40} y1="28" x2={xs[2] + W / 2 - 20} y2="30" stroke={q1 ? accent : dim} strokeWidth="1.8" />

        {xs.map((x, i) => {
          const val = q[i];
          return (
            <g key={i}>
              <rect x={x} y={TOP} width={W} height={H} rx="10" fill={box} stroke={accent} strokeWidth="2.4" />
              <text x={x + W / 2} y={TOP + H / 2 - 6} textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="800" fill={accent}>FF{i}</text>
              <text x={x + W / 2} y={TOP + H / 2 + 12} textAnchor="middle" fontFamily="monospace" fontSize="8" fill={faint}>T · Q(t+1)=T⊕Q</text>
              <line x1={x + W} y1={QY} x2={x + W + 16} y2={QY} stroke={val ? accent : dim} strokeWidth="3" />
              <text x={x + W - 4} y={QY - 8} textAnchor="end" fontFamily="monospace" fontSize="10" fontWeight="800" fill={val ? accent : faint}>Q{i}={val}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const SyncSchematic: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [count, setCount] = useState(0);
  const q0 = bitAt(count, 0), q1 = bitAt(count, 1), q2 = bitAt(count, 2);
  const t1 = q0, t2 = q0 & q1;
  const tick = () => setCount((c) => (c + 1) % 8);

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'एक clock bus · सब साथ' : 'one clock bus · all together'}
        </span>
        <span className={`font-mono text-[11px] ${t.faint}`}>Q2Q1Q0 = {binStr(count)} = {count}</span>
      </div>
      <SyncBusSVG isDarkMode={isDarkMode} accent={accent} q={[q0, q1, q2]} />
      <div className="mt-4"><ClockButton accent={accent} onTick={tick} /></div>
      <p className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
        {lang === 'hi'
          ? <>अगले edge पर: T0=1 (हमेशा toggle) · T1=Q0=<b style={{ color: accent }}>{t1}</b> ({t1 ? 'toggle' : 'hold'}) · T2=Q0·Q1=<b style={{ color: accent }}>{t2}</b> ({t2 ? 'toggle' : 'hold'}) — तीनों उसी एक edge पर।</>
          : <>on the next edge: T0=1 (always toggles) · T1=Q0=<b style={{ color: accent }}>{t1}</b> ({t1 ? 'toggles' : 'holds'}) · T2=Q0·Q1=<b style={{ color: accent }}>{t2}</b> ({t2 ? 'toggles' : 'holds'}) — all on that one edge.</>}
      </p>
    </Card>
  );
};

/* ───────── S03 · ripple vs synchronous, computed both ways ─────────
   Top: a delay / f_max calculator (N, t_pd, t_gate all steppable). Bottom: pick
   a transition and watch the same bits settle aligned (sync) vs staggered into
   a staircase (ripple) - the stagger and glitch count are derived from the
   carry-propagation rule, not hardcoded. */
const ContrastPanel: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [N, setN] = useState(4);
  const [tpd, setTpd] = useState(10);
  const [tgate, setTgate] = useState(4);
  const rippleDelay = N * tpd;
  const syncDelay = tpd + tgate;
  const rippleFmax = 1000 / rippleDelay;
  const syncFmax = 1000 / syncDelay;

  const [start, setStart] = useState(3);
  const next = (start + 1) % 8;
  const delay: number[] = [-1, -1, -1];
  {
    let carry = true;
    for (let i = 0; i < 3 && carry; i++) {
      const before = bitAt(start, i), after = bitAt(next, i);
      if (before !== after) delay[i] = i;
      carry = before === 1 && after === 0;
    }
  }
  const totalSteps = 7, edgeStep = 2;
  const colorFor = (i: number) => (i === 0 ? ACC.blue : i === 1 ? ACC.good : ACC.warn);
  const order = [2, 1, 0];
  const syncSignals: WaveSignal[] = order.map((i) => ({
    name: `Q${i}`, color: colorFor(i),
    values: Array.from({ length: totalSteps }, (_, s) => (s < edgeStep ? bitAt(start, i) : bitAt(next, i))),
  }));
  const rippleSignals: WaveSignal[] = order.map((i) => ({
    name: `Q${i}`, color: colorFor(i),
    values: Array.from({ length: totalSteps }, (_, s) => {
      const d = delay[i];
      const changeAt = d === -1 ? edgeStep : edgeStep + d;
      return s < changeAt ? bitAt(start, i) : bitAt(next, i);
    }),
  }));
  const glitchCount = delay.filter((d) => d > 0).length;

  const rows: (string | number)[][] = [
    [lang === 'hi' ? 'Clock distribution' : 'Clock distribution',
      lang === 'hi' ? 'FF0 अकेला; हर stage अगले को clock करता' : 'FF0 only; each stage clocks the next',
      lang === 'hi' ? 'सब को एक साथ एक clock' : 'one clock to all, at once'],
    [lang === 'hi' ? 'Delay (worst case)' : 'Delay (worst case)',
      `${rippleDelay} ns  (N·t_pd = ${N}×${tpd})`, `${syncDelay} ns  (t_pcq+t_gate = ${tpd}+${tgate})`],
    [lang === 'hi' ? 'Top speed f_max' : 'Top speed f_max',
      `${rippleFmax.toFixed(rippleFmax < 10 ? 2 : 1)} MHz`, `${syncFmax.toFixed(syncFmax < 10 ? 2 : 1)} MHz`],
    [lang === 'hi' ? 'Glitches (इस transition में)' : 'Glitches (this transition)',
      `${glitchCount} transient state${glitchCount === 1 ? '' : 's'}`, lang === 'hi' ? '0 — कभी नहीं' : '0 — never'],
  ];

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 flex flex-wrap items-center justify-center gap-6">
          <Stepper label="N (stages)" value={N} min={2} max={8} accent={accent} isDarkMode={isDarkMode} onChange={setN} />
          <Stepper label="t_pd(FF)" value={tpd} min={2} max={20} unit="ns" accent={accent} isDarkMode={isDarkMode} onChange={setTpd} />
          <Stepper label="t_gate" value={tgate} min={1} max={10} unit="ns" accent={accent} isDarkMode={isDarkMode} onChange={setTgate} />
        </div>
        <StateTable isDarkMode={isDarkMode} accent={accent}
          headers={['', 'Ripple', 'Synchronous']} rows={rows}
          note={lang === 'hi' ? 'delay और f_max हर बार आपके N, t_pd, t_gate से गिने जाते हैं।' : 'delay and f_max are recomputed live from your N, t_pd, and t_gate.'} />
      </Card>

      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 flex items-center justify-center gap-3">
          <Stepper label={lang === 'hi' ? 'transition: start (0…6)' : 'transition: start (0…6)'} value={start} min={0} max={6} accent={accent} isDarkMode={isDarkMode} onChange={setStart} />
        </div>
        <p className={`mb-2 text-center font-mono text-[12px] ${t.faint}`}>{binStr(start)} → {binStr(next)}</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-1 text-center font-mono text-[11px] font-black" style={{ color: ACC.good }}>
              {lang === 'hi' ? 'synchronous · सब एक edge पर' : 'synchronous · all on one edge'}
            </div>
            <TimingDiagram isDarkMode={isDarkMode} accent={accent} signals={syncSignals} showClock />
          </div>
          <div>
            <div className="mb-1 text-center font-mono text-[11px] font-black" style={{ color: ACC.warn }}>
              {lang === 'hi' ? 'ripple · सीढ़ी में फैला' : 'ripple · staggered into a staircase'}
            </div>
            <TimingDiagram isDarkMode={isDarkMode} accent={accent} signals={rippleSignals} showClock />
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ───────── S04 · the four-step design procedure, everything derived ───────── */
const DesignStepThrough: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [q0, setQ0] = useState(1);
  const [q1, setQ1] = useState(1);

  const rows = Array.from({ length: 8 }, (_, n) => {
    const nx = (n + 1) % 8;
    return {
      n, next: nx,
      T2: bitAt(n, 2) ^ bitAt(nx, 2),
      T1: bitAt(n, 1) ^ bitAt(nx, 1),
      T0: bitAt(n, 0) ^ bitAt(nx, 0),
      Q0: bitAt(n, 0), Q1: bitAt(n, 1),
    };
  });
  const t0AlwaysOne = rows.every((r) => r.T0 === 1);
  const t1MatchesQ0 = rows.every((r) => r.T1 === r.Q0);
  const t2MatchesQ0Q1 = rows.every((r) => r.T2 === (r.Q0 & r.Q1));

  const countTableRows: (string | number)[][] = rows.map((r) => [r.n, binStr(r.n), binStr(r.next)]);
  const exciteRows: (string | number)[][] = rows.map((r) => [r.n, binStr(r.n), binStr(r.next), r.T2, r.T1, r.T0]);
  const checkRows: (string | number)[][] = rows.map((r) => [
    r.n, r.T0, r.Q0, r.T1, r.T1 === r.Q0 ? '✓' : '✗', r.Q0 & r.Q1, r.T2, r.T2 === (r.Q0 & r.Q1) ? '✓' : '✗',
  ]);
  const t2gate = q0 & q1;

  const steps = [
    {
      label: lang === 'hi' ? 'कदम 1 · count table' : 'Step 1 · the count table',
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] ${t.sub}`}>
            {lang === 'hi' ? 'हर मौजूदा count के आगे वह count जो अगले clock पर बनना है — पूरा 8-row cycle, code में iterate किया।' : 'Every present count next to what it must become on the next clock - the full 8-row cycle, iterated in code.'}
          </p>
          <StateTable isDarkMode={isDarkMode} accent={accent} headers={['n', 'present Q2Q1Q0', 'next Q2Q1Q0']} rows={countTableRows} />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'कदम 2 · excitation (T = present ⊕ next)' : 'Step 2 · excitation (T = present ⊕ next)',
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] ${t.sub}`}>
            {lang === 'hi' ? 'हर bit के लिए T = present XOR next — गिना, हर row में।' : 'For every bit, T = present XOR next - computed, row by row.'}
          </p>
          <StateTable isDarkMode={isDarkMode} accent={accent} headers={['n', 'present', 'next', 'T2', 'T1', 'T0']} rows={exciteRows} />
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'कदम 3 · columns verify कीजिए' : 'Step 3 · verify the columns',
      body: (
        <div className="space-y-3">
          <StateTable isDarkMode={isDarkMode} accent={accent}
            headers={['n', 'T0', 'Q0', 'T1', 'T1=Q0?', 'Q0·Q1', 'T2', 'T2=Q0·Q1?']} rows={checkRows} />
          <p className={`text-center font-mono text-[13px] ${t.sub}`}>
            {t0AlwaysOne && t1MatchesQ0 && t2MatchesQ0Q1
              ? (lang === 'hi'
                ? <>सारे 8 rows पर: <b style={{ color: ACC.good }}>T0=1, T1=Q0, T2=Q0·Q1</b> — हर बार सही।</>
                : <>across all 8 rows: <b style={{ color: ACC.good }}>T0=1, T1=Q0, T2=Q0·Q1</b> - verified every time.</>)
              : (lang === 'hi' ? 'गिनती में गड़बड़' : 'derivation mismatch')}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'कदम 4 · gates से साकार' : 'Step 4 · realise with gates',
      body: (
        <div className="space-y-4">
          <p className={`text-[14px] ${t.sub}`}>
            {lang === 'hi' ? 'T0 constant 1 से बँधा, T1 सीधे Q0 से, T2 एक AND gate का output — Q0, Q1 ख़ुद toggle कीजिए।' : 'T0 is tied to 1, T1 wires straight from Q0, T2 is one AND gate - toggle Q0, Q1 yourself.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Toggle label="Q0" v={q0} onClick={() => setQ0(q0 ^ 1)} color={ACC.blue} />
            <Toggle label="Q1" v={q1} onClick={() => setQ1(q1 ^ 1)} color={ACC.good} />
            <LiveGate type="AND" a={q0} b={q1} isDarkMode={isDarkMode} accent={accent} labelA="Q0" labelB="Q1" labelOut="T2" />
          </div>
          <p className={`text-center font-mono text-[13px] ${t.sub}`}>
            T0 = <b style={{ color: accent }}>1</b> (tied) · T1 = Q0 = <b style={{ color: accent }}>{q0}</b> · T2 = Q0·Q1 = <b style={{ color: accent }}>{t2gate}</b>
          </p>
        </div>
      ),
    },
  ];

  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

/* ───────── S05 · up vs down, the toggle rule mirrored (Q vs Q') ───────── */
const UpDownDerived: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [dir, setDir] = useState<'up' | 'down'>('up');
  const seq = Array.from({ length: 8 }, (_, i) => binStr(dir === 'up' ? i : 7 - i));
  const eqs = dir === 'up' ? { t0: '1', t1: 'Q0', t2: 'Q0·Q1' } : { t0: '1', t1: "Q0'", t2: "Q0'·Q1'" };

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 flex items-center justify-center gap-2">
          {(['up', 'down'] as const).map((d) => (
            <button key={d} onClick={() => setDir(d)}
              className="rounded-lg border px-4 py-2 font-mono text-[13px] font-black uppercase active:scale-95"
              style={dir === d ? { background: accent, color: '#000', borderColor: accent } : { borderColor: `${accent}55`, color: accent }}>
              {d}
            </button>
          ))}
        </div>
        <p className={`text-center font-mono text-[15px] ${t.sub}`}>
          T0 = <b style={{ color: accent }}>{eqs.t0}</b> · T1 = <b style={{ color: accent }}>{eqs.t1}</b> · T2 = <b style={{ color: accent }}>{eqs.t2}</b>
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          {seq.map((s, i) => (
            <React.Fragment key={i}>
              <span className="rounded-lg px-2.5 py-1.5 font-mono text-[13px] font-black" style={{ border: `2px solid ${accent}`, color: accent }}>{s}</span>
              {i < seq.length - 1 && <ArrowRight size={13} className="opacity-40" />}
            </React.Fragment>
          ))}
          <span className="ml-1 font-mono text-[12px]" style={{ color: ACC.good }}>{'->'} wrap</span>
        </div>
        <p className={`mt-2 text-center font-mono text-[11px] ${t.faint}`}>
          {dir === 'up' ? (lang === 'hi' ? 'toggle जब नीचे का हर bit 1 हो' : 'toggle when every lower bit is 1') : (lang === 'hi' ? 'toggle जब नीचे का हर bit 0 हो' : 'toggle when every lower bit is 0')} ({lang === 'hi' ? 'code में iterate किया' : 'iterated in code'})
        </p>
      </Card>
      <CounterViz key={dir} isDarkMode={isDarkMode} accent={accent} bits={3} mode="sync" dir={dir} />
    </div>
  );
};

/* ───────── S06 · MOD-N truncation, everything computed from N ───────── */
const ModNPanel: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [N, setN] = useState(6);
  const ffCount = Math.max(1, Math.ceil(Math.log2(N)));
  const terminal = N - 1;
  const literalList: string[] = [];
  for (let i = ffCount - 1; i >= 0; i--) {
    if (((terminal >> i) & 1) === 1) literalList.push(`Q${i}`);
  }
  const detectExpr = literalList.length ? literalList.join('·') : '1';
  const seq = Array.from({ length: N }, (_, i) => i.toString(2).padStart(ffCount, '0'));
  const skippedCount = (1 << ffCount) - N;
  const skipped = Array.from({ length: skippedCount }, (_, k) => (N + k).toString(2).padStart(ffCount, '0'));

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 flex items-center justify-center">
          <Stepper label="N" value={N} min={3} max={8} accent={accent} isDarkMode={isDarkMode} onChange={setN} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className={`rounded-2xl border p-3 text-center ${t.soft}`}>
            <div className={`font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>flip-flops = ⌈log₂N⌉</div>
            <div className="mt-1 font-mono text-2xl font-black" style={{ color: accent }}>{ffCount}</div>
          </div>
          <div className={`rounded-2xl border p-3 text-center ${t.soft}`}>
            <div className={`font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>terminal count N−1</div>
            <div className="mt-1 font-mono text-2xl font-black" style={{ color: accent }}>{terminal} = {terminal.toString(2).padStart(ffCount, '0')}</div>
          </div>
          <div className="rounded-2xl border p-3 text-center" style={{ borderColor: `${ACC.good}55`, background: `${ACC.good}0d` }}>
            <div className={`font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>clear detector</div>
            <div className="mt-1 font-mono text-2xl font-black" style={{ color: ACC.good }}>{detectExpr}</div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          {seq.map((s, i) => (
            <React.Fragment key={i}>
              <span className="rounded-lg px-2.5 py-1.5 font-mono text-[13px] font-black" style={{ border: `2px solid ${accent}`, color: accent }}>{s}</span>
              {i < seq.length - 1 && <ArrowRight size={13} className="opacity-40" />}
            </React.Fragment>
          ))}
          <span className="ml-1 font-mono text-[12px]" style={{ color: ACC.good }}>{'->'} 0</span>
        </div>
        {skipped.length > 0 && (
          <p className={`mt-2 text-center font-mono text-[11px] ${t.faint}`}>
            {lang === 'hi'
              ? <>{ffCount} bits {(1 << ffCount) - 1} तक जा सकते — पर <b style={{ color: ACC.warn }}>{skipped.join(', ')}</b> छोड़े गए</>
              : <>{ffCount} bits could reach {(1 << ffCount) - 1} - states <b style={{ color: ACC.warn }}>{skipped.join(', ')}</b> are skipped</>}
          </p>
        )}
      </Card>
      <CounterViz key={N} isDarkMode={isDarkMode} accent={accent} bits={ffCount} mod={N} mode="sync" dir="up" />
    </div>
  );
};

/* ───────── S07 · one-hot decode, stepped + verified, plus the 2nd film ───────── */
const DecodeGrid: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [count, setCount] = useState(0);
  const tick = () => setCount((c) => (c + 1) % 8);
  const q2 = bitAt(count, 2), q1 = bitAt(count, 1), q0 = bitAt(count, 0);
  const minterm = [q2 ? 'Q2' : "Q2'", q1 ? 'Q1' : "Q1'", q0 ? 'Q0' : "Q0'"].join('·');

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
            {lang === 'hi' ? 'one-hot decode · step किया' : 'one-hot decode · stepped'}
          </span>
          <span className={`font-mono text-[11px] ${t.faint}`}>Q2Q1Q0 = {binStr(count)} = {count}</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: 8 }, (_, k) => k).map((k) => {
            const on = k === count;
            return (
              <div key={k} className="flex flex-col items-center gap-1">
                <span className={`font-mono text-[9px] ${t.faint}`}>D{k}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-lg font-black"
                  style={{ background: on ? ACC.good : 'transparent', color: on ? '#000' : ACC.good, border: `2px solid ${ACC.good}${on ? '' : '55'}` }}>
                  {on ? 1 : 0}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4"><ClockButton accent={accent} onTick={tick} /></div>
        <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
          D{count} = <b style={{ color: ACC.good }}>{minterm}</b> {lang === 'hi' ? '— सिर्फ़ यही line high' : '- exactly this line is high'}
        </p>
      </Card>

      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'दूसरी फ़िल्म · decoding' : 'second short film · decoding'}
        </div>
        <CustomVideoPlayer src={SRC_DECODE} accent={accent} className="rounded-2xl" />
      </Card>
    </div>
  );
};

/* ───────── S08 · marching band (sync) vs dominoes (ripple), fact-anchored ───────── */
const BandVsDominoes: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const [mode, setMode] = useState<'band' | 'domino'>('band');
  const [n, setN] = useState(5);
  const [beat, setBeat] = useState(0);
  const gap = 46, baseY = 92, x0 = 40;
  const width = x0 + n * gap + 20;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
        {(['band', 'domino'] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className="rounded-lg border px-4 py-2 font-mono text-[12px] font-black uppercase active:scale-95"
            style={mode === m ? { background: accent, color: '#000', borderColor: accent } : { borderColor: `${accent}55`, color: accent }}>
            {m === 'band' ? 'marching band' : 'dominoes'}
          </button>
        ))}
        <Stepper label="N" value={n} min={3} max={7} accent={accent} isDarkMode={isDarkMode} onChange={(v) => { setN(v); setBeat(0); }} />
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} 120`} className="mx-auto w-full" style={{ maxWidth: Math.max(width, 300) }}>
          <line x1="10" y1={baseY} x2={width - 10} y2={baseY} stroke={dim} strokeWidth="1.5" />
          {Array.from({ length: n }, (_, i) => {
            const cx = x0 + i * gap;
            return mode === 'band' ? (
              <motion.g key={`band-${n}-${i}`} animate={{ y: beat % 2 ? -10 : 0 }} transition={{ duration: 0.28, ease: 'easeOut' }}>
                <circle cx={cx} cy={baseY - 34} r="10" fill={accent} />
                <rect x={cx - 6} y={baseY - 24} width="12" height="26" rx="3" fill={accent} opacity={0.85} />
                <text x={cx} y={baseY + 12} textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>FF{i}</text>
              </motion.g>
            ) : (
              <motion.g key={`dom-${n}-${i}`} style={{ transformOrigin: `${cx}px ${baseY}px` }}
                animate={{ rotate: beat % 2 ? 74 : 0 }} transition={{ duration: 0.32, delay: beat % 2 ? i * 0.3 : 0, ease: 'easeIn' }}>
                <rect x={cx - 6} y={baseY - 50} width="12" height="50" rx="2" fill={accent} opacity={0.9} stroke={accent} strokeWidth="1.5" />
                <text x={cx} y={baseY + 12} textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>FF{i}</text>
              </motion.g>
            );
          })}
        </svg>
      </div>
      <div className="mt-2 flex items-center justify-center gap-3">
        <button onClick={() => setBeat((b) => b + 1)}
          className="rounded-2xl px-5 py-2.5 font-black text-black active:scale-95"
          style={{ background: accent, boxShadow: `0 8px 24px ${accent}33` }}>
          {mode === 'band' ? (lang === 'hi' ? 'drumbeat ▶' : 'drumbeat ▶') : (lang === 'hi' ? 'धक्का दें ▶' : 'push ▶')}
        </button>
        <button onClick={() => setBeat(0)}
          className="rounded-2xl border-2 px-4 py-2.5 font-mono text-[12px] font-black uppercase active:scale-95"
          style={{ borderColor: `${accent}55`, color: accent }}>
          {lang === 'hi' ? 'रीसेट' : 'reset'}
        </button>
      </div>
      <p className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
        {mode === 'band'
          ? (lang === 'hi'
            ? <>एक drumbeat, सारे <b style={{ color: accent }}>{n}</b> musicians एक साथ क़दम रखते — कोई देरी नहीं, ठीक जैसे एक clock हर flip-flop तक एक साथ पहुँचता।</>
            : <>one drumbeat, all <b style={{ color: accent }}>{n}</b> musicians step together - zero lag, exactly like one clock reaching every flip-flop at once.</>)
          : (lang === 'hi'
            ? <>पहले को धक्का — बाक़ी <b style={{ color: accent }}>{n - 1}</b> अपनी बारी गिरते, हर एक अगले के बाद — वही ripple delay है।</>
            : <>push only the first - the other <b style={{ color: accent }}>{n - 1}</b> fall in turn, each after the last - that's the ripple delay.</>)}
      </p>
    </Card>
  );
};

/* ───────── part assignment ───────── */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE IDEA'
    : i <= Math.floor(n * 0.55) ? 'PART II · HOW IT COUNTS'
      : i < n - 3 ? 'PART III · BUILD & FEEL IT'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  switch (scene.id) {
    case 'S02_Facts': return 'facts';
    case 'S03_RippleVsSync': return 'contrast';
    case 'S04_Design': return 'design';
    case 'S05_UpDown': return 'updown';
    case 'S06_ModN': return 'modn';
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
        kicker="Synchronous Counters · One Clock, Every Flip-Flop"
        hero={<CounterViz isDarkMode={p.isDarkMode} accent={p.accent} bits={3} mode="sync" dir="up" />} />;
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
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="SYNC" tag="Practice · Synchronous Counters" title={scene.label} intro={scene.subtitle ?? ''} />
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
              <SyncSchematic isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'contrast' && (
            <div className="space-y-6">
              <TryItYourself />
              <ContrastPanel isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'design' && (
            <div className="space-y-6">
              <TryItYourself />
              <DesignStepThrough isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'updown' && (
            <div className="space-y-6">
              <TryItYourself />
              <UpDownDerived isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'modn' && (
            <div className="space-y-6">
              <TryItYourself />
              <ModNPanel isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'decoding' && (
            <div className="space-y-6">
              <TryItYourself />
              <DecodeGrid isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'analogy' && (
            <div className="space-y-6">
              <TryItYourself />
              <BandVsDominoes isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="sync-counter"
              titleEN="Build a synchronous counter for real"
              titleHI="असली में एक synchronous counter बनाइए"
              bodyEN="Open the live workbench, place three T flip-flops on one common clock, wire T1 straight from Q0 and T2 from a single AND gate fed by Q0 and Q1. Tick the clock and prove 000→111 lands on a single edge every time - then swap the AND feeds to Q0', Q1' to count down, or add a terminal-count clear for a MOD-6."
              bodyHI="live workbench खोलिए, तीन T flip-flops एक common clock पर रखिए, T1 सीधे Q0 से और T2 एक अकेले AND gate से जोड़िए जिसे Q0 और Q1 खिलाते हैं। clock tick कीजिए और साबित कीजिए कि 000→111 हर बार एक ही edge पर उतरता है - फिर AND feeds को Q0', Q1' पर बदलकर down गिनिए, या एक terminal-count clear जोड़कर MOD-6 बनाइए।" />
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
