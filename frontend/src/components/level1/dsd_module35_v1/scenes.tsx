/**
 * Asynchronous (Ripple) Counters - dsd/35, "The Domino Chain" (Sequential Logic
 * track). The live 3-bit ripple counter, the timing diagram and state table come
 * from the shared _sequential/blocks library (CounterViz / TimingDiagram /
 * StateTable, which iterate every value). The cascaded-JK schematic with the
 * rippling trigger highlight, the up/down configuration matrix rebuilt from the
 * edge-matching rule, the 3-bit build with its generated count sequence, the
 * ripple-delay calculator with a staggered stair-step waveform, the decoding-
 * glitch tracer, the dual-mode 2:1-MUX steering visual and the falling-dominoes
 * analogy are bespoke. EVERY displayed value (count sequence, matrix cell,
 * transient glitch path, total delay, f_max, steer output) is COMPUTED in code,
 * never hardcoded.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeftRight, ArrowRight } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import { WorkbenchCTA } from '../_subtractor/kit';
import {
  CounterViz, StateTable, ClockButton,
} from '../_sequential/blocks';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const ACC = { blue: '#38bdf8', good: '#34d399', warn: '#f59e0b', bad: '#fb7185' };
const SRC_EN: string | undefined = '/videos/dsd35-async-counters.mp4';
const SRC_HI: string | undefined = undefined;

const toBin = (n: number, bits = 3) => ((n % (1 << bits)) + (1 << bits)) % (1 << bits);
const binStr = (n: number, bits = 3) => toBin(n, bits).toString(2).padStart(bits, '0');

/* ───────── shared inline +/- stepper ───────── */
const Stepper: React.FC<{
  label: string; value: number; min: number; max: number; step?: number;
  unit?: string; accent: string; isDarkMode: boolean; onChange: (n: number) => void;
}> = ({ label, value, min, max, step = 1, unit, accent, isDarkMode, onChange }) => {
  const t = tone(isDarkMode);
  const btn = (delta: number, sym: string) => (
    <button onClick={() => onChange(Math.max(min, Math.min(max, value + delta)))}
      className="flex h-10 w-10 items-center justify-center rounded-lg font-mono text-lg font-black active:scale-90 sm:h-9 sm:w-9"
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

/* ───────── shared schematic: the cascaded-JK ripple chain (3 stages) ─────────
   q[i] = live output of stage i (LSB first); fired[i] = the clock line into
   stage i just caused a toggle (the rippling trigger). All presentational. */
const FFChainSVG: React.FC<{ isDarkMode: boolean; accent: string; q: number[]; fired: boolean[]; feedComp?: boolean }>
  = ({ isDarkMode, accent, q, fired, feedComp = false }) => {
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const faint = isDarkMode ? '#94a3b8' : '#64748b';
  const n = q.length;
  const bx = (i: number) => 18 + i * 132;
  const W = 66, TOP = 52, H = 74, CLKY = 112, QY = 74;
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 386 172" className="mx-auto w-full" style={{ maxWidth: 560 }}>
        {/* external clock into FF0 */}
        <line x1="2" y1={CLKY} x2={bx(0)} y2={CLKY} stroke={fired[0] ? accent : dim} strokeWidth={fired[0] ? 3 : 2} />
        <text x="2" y={CLKY - 6} fontFamily="monospace" fontSize="10" fontWeight="800" fill={fired[0] ? accent : faint}>CLK</text>
        {q.map((val, i) => {
          const x = bx(i);
          return (
            <g key={i}>
              {/* J=K=1 tie-high note */}
              <text x={x + W / 2} y={TOP - 8} textAnchor="middle" fontFamily="monospace" fontSize="8.5" fontWeight="700" fill={faint}>J=K=1</text>
              {/* body */}
              <rect x={x} y={TOP} width={W} height={H} rx="9" fill={box} stroke={accent} strokeWidth="2.4" />
              <text x={x + W / 2} y={TOP + 30} textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="800" fill={accent}>FF{i}</text>
              <text x={x + W / 2} y={TOP + 46} textAnchor="middle" fontFamily="monospace" fontSize="9" fill={faint}>JK · T</text>
              {/* clock input triangle (edge-triggered) */}
              <line x1={x - (i === 0 ? 0 : 0)} y1={CLKY} x2={x} y2={CLKY} stroke={dim} strokeWidth="2" />
              <path d={`M${x},${CLKY - 6} L${x + 9},${CLKY} L${x},${CLKY + 6} Z`} fill="none" stroke={faint} strokeWidth="1.6" />
              {/* Q output */}
              <line x1={x + W} y1={QY} x2={x + W + 20} y2={QY} stroke={val ? accent : dim} strokeWidth="3" />
              <text x={x + W - 3} y={QY - 8} textAnchor="end" fontFamily="monospace" fontSize="10" fontWeight="800" fill={val ? accent : faint}>Q{i}={val}</text>
              {/* chain wire Q_i -> clock of FF_{i+1} */}
              {i < n - 1 && (() => {
                const sx = x + W + 20, branch = bx(i) + W + 33, tx = bx(i + 1);
                const on = fired[i + 1];
                return (
                  <g>
                    <line x1={sx} y1={QY} x2={branch} y2={QY} stroke={val ? accent : dim} strokeWidth="2.4" />
                    <line x1={branch} y1={QY} x2={branch} y2={CLKY} stroke={on ? accent : dim} strokeWidth={on ? 3 : 2} />
                    <line x1={branch} y1={CLKY} x2={tx} y2={CLKY} stroke={on ? accent : dim} strokeWidth={on ? 3 : 2} />
                    <text x={branch + 3} y={CLKY - 5} fontFamily="monospace" fontSize="8.5" fill={faint}>{feedComp ? `Q${i}'` : `Q${i}`}</text>
                  </g>
                );
              })()}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* ───────── S02 · the cascaded JK chain, live, with the rippling trigger ─────────
   A negative-edge 3-bit up ripple counter. Each tick increments the count; the
   clock lines that actually caused a toggle light up (the ripple). Every value
   computed. */
const CascadedJK: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [count, setCount] = useState(0);
  const [fired, setFired] = useState<boolean[]>([false, false, false]);
  const q = [count & 1, (count >> 1) & 1, (count >> 2) & 1];

  const tick = () => {
    const nc = (count + 1) % 8;
    // a stage's clock carries the triggering edge exactly when that stage
    // toggles, i.e. its output bit changes from count -> nc (the ripple).
    const f = [0, 1, 2].map((i) => ((count >> i) & 1) !== ((nc >> i) & 1));
    setFired(f);
    setCount(nc);
  };

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'cascaded JK · ripple चलता है' : 'cascaded JK · watch it ripple'}
        </span>
        <span className={`font-mono text-[11px] ${t.faint}`}>Q2Q1Q0 = {binStr(count)} = {count}</span>
      </div>
      <FFChainSVG isDarkMode={isDarkMode} accent={accent} q={q} fired={fired} />
      <div className="mt-4"><ClockButton accent={accent} onTick={tick} /></div>
      <p className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
        {fired.filter(Boolean).length > 1
          ? (lang === 'hi'
            ? <>trigger ने <b style={{ color: accent }}>{fired.filter(Boolean).length}</b> stages को ripple किया — FF0 पहले, फिर हर गिरता Q अगले को clock करता है।</>
            : <>the trigger rippled through <b style={{ color: accent }}>{fired.filter(Boolean).length}</b> stages — FF0 first, then each falling Q clocks the next.</>)
          : (lang === 'hi'
            ? 'सिर्फ़ FF0 पलटा — Q0 चढ़ा (गिरा नहीं), तो ऊपर कोई stage trigger नहीं हुआ।'
            : 'only FF0 toggled — Q0 rose (did not fall), so no higher stage was triggered.')}
      </p>
    </Card>
  );
};

/* ───────── S03 · the up/down configuration matrix, rebuilt from the rule ─────────
   Each cell is COMPUTED by matching the flip-flop's active edge to the edge the
   next stage needs. Plus the up & down 3-bit sequences, generated by iterating. */
const UpDownMatrix: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [trig, setTrig] = useState<'NGT' | 'PGT'>('NGT');
  const [dir, setDir] = useState<'up' | 'down'>('up');

  // required transition of the lower Q that marks a completed cycle
  const requiredEdge = (d: 'up' | 'down') => (d === 'up' ? 'fall' : 'rise');
  // the edge the flip-flop actually fires on
  const activeEdge = (g: 'NGT' | 'PGT') => (g === 'NGT' ? 'fall' : 'rise');
  // feed Q if the flip-flop's edge already lands where we need it, else invert with Q'
  const feed = (g: 'NGT' | 'PGT', d: 'up' | 'down') => (activeEdge(g) === requiredEdge(d) ? 'Q' : "Q'");

  const matrix: (string | number)[][] = (['NGT', 'PGT'] as const).map((g) => [
    g === 'NGT' ? 'NGT (neg-edge)' : 'PGT (pos-edge)', feed(g, 'up'), feed(g, 'down'),
  ]);

  const seq = Array.from({ length: 8 }, (_, i) => binStr(dir === 'up' ? i : 7 - i));

  const Pick: React.FC<{ opts: [string, string]; val: string; set: (v: any) => void }> = ({ opts, val, set }) => (
    <div className="flex gap-1.5">
      {opts.map((o) => (
        <button key={o} onClick={() => set(o)}
          className="rounded-lg border px-3 py-1.5 font-mono text-[12px] font-black active:scale-95"
          style={val === o ? { background: accent, color: '#000', borderColor: accent } : { borderColor: `${accent}55`, color: accent }}>
          {o}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'master matrix · edge-matching से गिना' : 'master matrix · computed by edge-matching'}
        </div>
        <StateTable isDarkMode={isDarkMode} accent={accent}
          headers={[lang === 'hi' ? 'trigger' : 'trigger', lang === 'hi' ? 'up counter' : 'up counter', lang === 'hi' ? 'down counter' : 'down counter']}
          rows={matrix} highlight={trig === 'NGT' ? 0 : 1}
          note={lang === 'hi' ? "cell = वह feed जिसका edge उस पल पड़े जब अगले stage को toggle करना है (वरना Q' उलट देता है)।" : "cell = the feed whose edge lands when the next stage must toggle (else Q' inverts it)."} />
      </Card>

      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 flex flex-wrap items-center justify-center gap-3">
          <Pick opts={['NGT', 'PGT']} val={trig} set={setTrig} />
          <Pick opts={['up', 'down']} val={dir} set={setDir} />
        </div>
        <p className={`text-center font-mono text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>{dir} counter: अगला stage तब toggle करे जब Q <b style={{ color: accent }}>{requiredEdge(dir) === 'fall' ? '1→0 (गिरे)' : '0→1 (चढ़े)'}</b>. {trig} <b>{activeEdge(trig) === 'fall' ? 'falling' : 'rising'}</b> edge पर fire करता है {'->'} feed <b style={{ color: ACC.good }}>{feed(trig, dir)}</b>.</>
            : <>{dir} counter: the next stage must toggle when Q <b style={{ color: accent }}>{requiredEdge(dir) === 'fall' ? 'falls 1→0' : 'rises 0→1'}</b>. {trig} fires on the <b>{activeEdge(trig)}</b> edge {'->'} feed <b style={{ color: ACC.good }}>{feed(trig, dir)}</b>.</>}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          {seq.map((s, i) => (
            <React.Fragment key={i}>
              <span className="rounded-lg px-2.5 py-1.5 font-mono text-[13px] font-black"
                style={{ border: `2px solid ${accent}`, color: accent }}>{s}</span>
              {i < seq.length - 1 && <ArrowRight size={13} className="opacity-40" />}
            </React.Fragment>
          ))}
          <span className="ml-1 font-mono text-[12px]" style={{ color: ACC.good }}>{'->'} {lang === 'hi' ? 'wrap' : 'wrap'}</span>
        </div>
        <p className={`mt-2 text-center font-mono text-[11px] ${t.faint}`}>
          {dir === 'up' ? '3-bit up · 000 → 111' : '3-bit down · 111 → 000'} ({lang === 'hi' ? 'code में iterate किया' : 'iterated in code'})
        </p>
      </Card>
    </div>
  );
};

/* ───────── S04 · build the 3-bit ripple up counter + generated sequence ───────── */
const Build3Bit: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [count, setCount] = useState(0);
  const [fired, setFired] = useState<boolean[]>([false, false, false]);
  const q = [count & 1, (count >> 1) & 1, (count >> 2) & 1];

  const tick = () => {
    const nc = (count + 1) % 8;
    const f = [0, 1, 2].map((i) => ((count >> i) & 1) !== ((nc >> i) & 1));
    setFired(f); setCount(nc);
  };

  const rows: (string | number)[][] = Array.from({ length: 8 }, (_, i) => [i, (i >> 2) & 1, (i >> 1) & 1, i & 1, i]);

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? '3-bit ripple up counter · FF0←CLK, Q0→CLK1, Q1→CLK2' : '3-bit ripple up counter · FF0←CLK, Q0→CLK1, Q1→CLK2'}
        </div>
        <FFChainSVG isDarkMode={isDarkMode} accent={accent} q={q} fired={fired} />
        <div className="mt-4"><ClockButton accent={accent} onTick={tick} /></div>
        <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
          Q2Q1Q0 = <b style={{ color: accent }}>{binStr(count)}</b> = {count}
          {'  '}·{'  '}
          {lang === 'hi' ? 'Q0 हर clock, Q1 हर 2, Q2 हर 4 पलटता' : 'Q0 flips every clock, Q1 every 2, Q2 every 4'}
        </p>
      </Card>
      <StateTable isDarkMode={isDarkMode} accent={accent}
        headers={['CLK #', 'Q2', 'Q1', 'Q0', lang === 'hi' ? 'मान' : 'value']}
        rows={rows} highlight={count}
        note={lang === 'hi' ? 'पूरा MOD-8 क्रम code में iterate किया; current count highlighted।' : 'The full MOD-8 sequence iterated in code; the current count is highlighted.'} />
    </div>
  );
};

/* ───────── S05 · ripple delay + f_max calculator with a staggered waveform ─────────
   t_pd(total) = N × t_pd(FF); f_max = 1/(N·t_pd). Both computed live. The
   waveform shows the worst-case all-ones -> all-zeros rollover, each edge skewed
   by one t_pd. */
const RippleDelayCalc: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const faint = isDarkMode ? '#94a3b8' : '#64748b';
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const [N, setN] = useState(4);
  const [tpd, setTpd] = useState(10);
  const total = N * tpd;                 // ns
  const fmax = 1000 / total;             // MHz (1 / total ns)

  // staggered stair-step: all stages start high, each Q_i falls at (i+1)*pd
  const pd = Math.max(9, Math.min(30, Math.round(tpd * 1.4)));
  const x0 = 44, edgeX = 66, hi = 8, lo = 22, rowH = 30, top = 8;
  const settleX = edgeX + N * pd;
  const width = settleX + 74;
  const height = top + (N + 1) * rowH + 10;
  const rowPath = (fallX: number, r: number) => {
    const yTop = top + r * rowH + hi, yBot = top + r * rowH + lo;
    return `M${x0},${yTop} H${fallX} V${yBot} H${width - 6}`;
  };

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'ripple delay & top speed · calculator' : 'ripple delay & top speed · calculator'}
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-6">
        <Stepper label={lang === 'hi' ? 'N (stages)' : 'N (stages)'} value={N} min={2} max={8} accent={accent} isDarkMode={isDarkMode} onChange={setN} />
        <Stepper label="t_pd(FF)" value={tpd} min={2} max={20} step={1} unit="ns" accent={accent} isDarkMode={isDarkMode} onChange={setTpd} />
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full" style={{ maxWidth: Math.max(width, 340) }}>
          {/* CLK falling edge */}
          <text x="2" y={top + hi + 8} fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>CLK</text>
          <path d={`M${x0},${top + hi} H${edgeX} V${top + lo} H${width - 6}`} fill="none" stroke={accent} strokeWidth="2.2" />
          {/* each stage falls one t_pd later */}
          {Array.from({ length: N }, (_, i) => {
            const fallX = edgeX + (i + 1) * pd;
            return (
              <g key={i}>
                <text x="2" y={top + (i + 1) * rowH + lo} fontFamily="monospace" fontSize="9" fontWeight="800" fill={faint}>Q{i}</text>
                <path d={rowPath(fallX, i + 1)} fill="none" stroke={ACC.good} strokeWidth="2.2" />
              </g>
            );
          })}
          {/* settle marker */}
          <line x1={settleX} y1={top} x2={settleX} y2={height - 6} stroke={ACC.warn} strokeWidth="1.6" strokeDasharray="3 3" />
          <text x={settleX + 4} y={top + 12} fontFamily="monospace" fontSize="9" fontWeight="800" fill={ACC.warn}>N·t_pd</text>
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className={`rounded-2xl border p-3 text-center ${t.soft}`}>
          <div className={`font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>t_pd(total) = N × t_pd(FF)</div>
          <div className="mt-1 font-mono text-2xl font-black" style={{ color: accent }}>{total} ns</div>
          <div className={`font-mono text-[11px] ${t.faint}`}>{N} × {tpd} ns</div>
        </div>
        <div className={`rounded-2xl border p-3 text-center`} style={{ borderColor: `${ACC.good}55`, background: `${ACC.good}0d` }}>
          <div className={`font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>f_max ≤ 1 / t_pd(total)</div>
          <div className="mt-1 font-mono text-2xl font-black" style={{ color: ACC.good }}>{fmax.toFixed(fmax < 10 ? 2 : 1)} MHz</div>
          <div className={`font-mono text-[11px] ${t.faint}`}>1 / {total} ns</div>
        </div>
      </div>
      <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? <>N बढ़ाइए और top speed गिरती है — delays chain के साथ जुड़ते हैं, इसलिए चौड़ा counter धीमा।</>
          : <>raise N and the top speed drops — the delays add along the chain, so a wider counter is slower.</>}
      </p>
    </Card>
  );
};

/* ───────── S06 · the decoding glitch tracer (computed transient path) ─────────
   For a chosen start value, simulate the ripple stage by stage and expose every
   transient state; the middle ones are the illegal glitch values. */
const GlitchTracer: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [start, setStart] = useState(3);
  const bits = 3;

  // simulate: external edge toggles FF0; a stage toggles only if the one below
  // it just fell 1->0. Record every intermediate word.
  const path: number[] = (() => {
    const b = Array.from({ length: bits }, (_, i) => (start >> i) & 1);
    const val = () => b.reduce((a, x, i) => a | (x << i), 0);
    const seq = [val()];
    let carry = true;
    for (let i = 0; i < bits && carry; i++) {
      const prev = b[i]; b[i] ^= 1;
      seq.push(val());
      carry = prev === 1 && b[i] === 0;
    }
    return seq;
  })();
  const glitches = Math.max(0, path.length - 2);

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'decoding glitch · transition चुनिए' : 'decoding glitch · pick a transition'}
      </div>
      <div className="mb-4 flex items-center justify-center">
        <Stepper label={lang === 'hi' ? 'start (0…6)' : 'start (0…6)'} value={start} min={0} max={6} accent={accent} isDarkMode={isDarkMode} onChange={setStart} />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {path.map((v, i) => {
          const isGlitch = i > 0 && i < path.length - 1;
          const isFinal = i === path.length - 1;
          const col = isGlitch ? ACC.warn : isFinal ? ACC.good : accent;
          return (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-1">
                <span className="rounded-lg px-2.5 py-1.5 font-mono text-[14px] font-black"
                  style={{ border: `2px solid ${col}`, color: '#000', background: isGlitch ? ACC.warn : isFinal ? ACC.good : accent }}>
                  {binStr(v)}
                </span>
                <span className="font-mono text-[10px] font-bold" style={{ color: col }}>
                  {isGlitch ? (lang === 'hi' ? 'glitch' : 'glitch') : isFinal ? (lang === 'hi' ? 'final' : 'final') : (lang === 'hi' ? 'start' : 'start')} · {v}
                </span>
              </div>
              {i < path.length - 1 && <ArrowRight size={15} className="opacity-40" />}
            </React.Fragment>
          );
        })}
      </div>

      <p className={`mt-4 flex items-center justify-center gap-2 text-center font-mono text-[12.5px] ${t.sub}`}>
        {glitches > 0
          ? <>
              <AlertTriangle size={15} style={{ color: ACC.warn }} />
              {lang === 'hi'
                ? <>{start} {'->'} {(start + 1) % 8} में <b style={{ color: ACC.warn }}>{glitches}</b> transient glitch state — ripple के बीच decode किया तो ग़लत मान पढ़ेगा।</>
                : <>{start} {'->'} {(start + 1) % 8} passes through <b style={{ color: ACC.warn }}>{glitches}</b> transient glitch state{glitches > 1 ? 's' : ''} — decode mid-ripple and you read the wrong value.</>}
            </>
          : (lang === 'hi'
            ? <>{start} {'->'} {(start + 1) % 8}: सिर्फ़ FF0 पलटा, कोई glitch नहीं — even {'->'} odd transitions साफ़ हैं।</>
            : <>{start} {'->'} {(start + 1) % 8}: only FF0 toggled, no glitch — even {'->'} odd transitions are clean.</>)}
      </p>
    </Card>
  );
};

/* ───────── S07 · dual-mode steering (2:1 MUX), computed ─────────
   Clock_next = M'·Q + M·Q'. M=0 -> Q (up), M=1 -> Q' (down). The two product
   terms and the output are computed; a running counter reverses with M. */
const DualModeSteer: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const faint = isDarkMode ? '#94a3b8' : '#64748b';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const [M, setM] = useState(0);
  const [Q, setQ] = useState(1);
  const Qb = Q ^ 1;
  const t0 = (M ^ 1) & Q;     // M'·Q
  const t1 = M & Qb;          // M·Q'
  const steer = t0 | t1;      // = M ? Q' : Q

  const Tog: React.FC<{ label: string; v: number; set: () => void; color: string }> = ({ label, v, set, color }) => (
    <button onClick={set} className="flex flex-col items-center gap-1 active:scale-90">
      <span className="font-mono text-[11px] font-bold" style={{ color }}>{label}</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black"
        style={{ background: v ? color : 'transparent', color: v ? '#000' : color, border: `2px solid ${color}${v ? '' : '66'}` }}>{v}</span>
    </button>
  );

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? "steering · Clock_next = M'·Q + M·Q'" : "steering · Clock_next = M'·Q + M·Q'"}
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
          {/* 2:1 MUX drawing */}
          <svg viewBox="0 0 180 120" className="w-full max-w-[260px]">
            {/* data inputs */}
            <line x1="6" y1="34" x2="60" y2="34" stroke={Q ? accent : dim} strokeWidth={M === 0 ? 3 : 2} />
            <text x="4" y="28" fontFamily="monospace" fontSize="11" fontWeight="800" fill={Q ? accent : faint}>Q={Q}</text>
            <line x1="6" y1="86" x2="60" y2="86" stroke={Qb ? accent : dim} strokeWidth={M === 1 ? 3 : 2} />
            <text x="4" y="102" fontFamily="monospace" fontSize="11" fontWeight="800" fill={Qb ? accent : faint}>Q'={Qb}</text>
            {/* mux trapezoid */}
            <polygon points="60,20 92,40 92,80 60,100" fill={box} stroke={accent} strokeWidth="2.4" />
            <text x="72" y="56" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={accent}>2:1</text>
            <text x="72" y="68" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={faint}>MUX</text>
            {/* highlight the selected data line inside */}
            <line x1="60" y1={M === 0 ? 34 : 86} x2="92" y2="60" stroke={steer ? ACC.good : dim} strokeWidth="2.2" strokeDasharray="3 2" />
            {/* select */}
            <line x1="76" y1="100" x2="76" y2="116" stroke={M ? ACC.warn : dim} strokeWidth="2.2" />
            <text x="80" y="114" fontFamily="monospace" fontSize="10" fontWeight="800" fill={ACC.warn}>M={M}</text>
            {/* output */}
            <line x1="92" y1="60" x2="150" y2="60" stroke={steer ? ACC.good : dim} strokeWidth="3" />
            <text x="152" y="56" fontFamily="monospace" fontSize="10" fontWeight="800" fill={steer ? ACC.good : faint}>Clk={steer}</text>
          </svg>
          <div className="flex items-center gap-4">
            <Tog label="M" v={M} set={() => setM(M ^ 1)} color={ACC.warn} />
            <Tog label="Q" v={Q} set={() => setQ(Q ^ 1)} color={accent} />
          </div>
        </div>
        <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
          M'·Q = {t0}{'  '}+{'  '}M·Q' = {t1}{'  '}={'  '}
          <b style={{ color: ACC.good }}>{steer}</b>
          {'   '}({M === 0
            ? (lang === 'hi' ? "M=0 → Q pass → up" : 'M=0 → passes Q → up')
            : (lang === 'hi' ? "M=1 → Q' pass → down" : "M=1 → passes Q' → down")})
        </p>
      </Card>

      <div>
        <div className="mb-2 flex items-center justify-center gap-2 font-mono text-[11px]" style={{ color: accent }}>
          <ArrowLeftRight size={14} /> {M === 0 ? (lang === 'hi' ? 'mode: UP' : 'mode: UP') : (lang === 'hi' ? 'mode: DOWN' : 'mode: DOWN')}
        </div>
        <CounterViz key={M} isDarkMode={isDarkMode} accent={accent} bits={3} mode="ripple" dir={M === 0 ? 'up' : 'down'} />
      </div>
    </div>
  );
};

/* ───────── S08 · the falling dominoes analogy (staggered fall) ───────── */
const Dominoes: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const [n, setN] = useState(4);
  const [pushed, setPushed] = useState(false);
  const gap = 46, baseY = 92, dw = 12, dh = 56, x0 = 40;
  const width = x0 + n * gap + 20;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'dominoes · पहले को धक्का दीजिए' : 'dominoes · push the first one'}
      </div>
      <div className="mb-3 flex items-center justify-center">
        <Stepper label={lang === 'hi' ? 'N stages' : 'N stages'} value={n} min={2} max={6} accent={accent} isDarkMode={isDarkMode}
          onChange={(v) => { setN(v); setPushed(false); }} />
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} 120`} className="mx-auto w-full" style={{ maxWidth: Math.max(width, 300) }}>
          <line x1="10" y1={baseY} x2={width - 10} y2={baseY} stroke={dim} strokeWidth="1.5" />
          {Array.from({ length: n }, (_, i) => {
            const cx = x0 + i * gap;
            return (
              <motion.g key={`${n}-${i}`} style={{ transformOrigin: `${cx}px ${baseY}px` }}
                animate={{ rotate: pushed ? 74 : 0 }}
                transition={{ duration: 0.35, delay: pushed ? i * 0.32 : 0, ease: 'easeIn' }}>
                <rect x={cx - dw / 2} y={baseY - dh} width={dw} height={dh} rx="2"
                  fill={accent} opacity={0.9} stroke={accent} strokeWidth="1.5" />
                <text x={cx} y={baseY + 12} textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>Q{i}</text>
              </motion.g>
            );
          })}
        </svg>
      </div>
      <div className="mt-2 flex items-center justify-center gap-3">
        <button onClick={() => setPushed(true)}
          className="rounded-2xl px-5 py-2.5 font-black text-black active:scale-95"
          style={{ background: accent, boxShadow: `0 8px 24px ${accent}33` }}>
          {lang === 'hi' ? 'धक्का दें ▶' : 'push ▶'}
        </button>
        <button onClick={() => setPushed(false)}
          className="rounded-2xl border-2 px-4 py-2.5 font-mono text-[12px] font-black uppercase active:scale-95"
          style={{ borderColor: `${accent}55`, color: accent }}>
          {lang === 'hi' ? 'खड़ा करें' : 'reset'}
        </button>
      </div>
      <p className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
        {lang === 'hi'
          ? <>हर domino अगले को एक तय delay बाद गिराता है, तो आख़िरी <b style={{ color: accent }}>N × t_pd</b> बाद गिरता है — बीच में पकड़ी snapshot ही glitch है।</>
          : <>each domino topples the next after a fixed delay, so the last falls after <b style={{ color: accent }}>N × t_pd</b> — a snapshot caught mid-fall is the glitch.</>}
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
    case 'S03_UpDown': return 'updown';
    case 'S04_Build3bit': return 'build3';
    case 'S05_RippleDelay': return 'delay';
    case 'S06_Glitch': return 'glitch';
    case 'S07_DualMode': return 'dual';
    case 'S08_Analogy': return 'analogy';
    case 'S09_Build': return 'build';
    default: return null;
  }
};

function componentFor(scene: SubScene, _i: number, _n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle}
        kicker="Ripple Counters · The Domino Chain"
        hero={<CounterViz isDarkMode={p.isDarkMode} accent={p.accent} bits={3} mode="ripple" dir="up" />} />;
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
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="RIPPLE" tag="Practice · Ripple Counters" title={scene.label} intro={scene.subtitle ?? ''} />
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
              <CascadedJK isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'updown' && (
            <div className="space-y-6">
              <TryItYourself />
              <UpDownMatrix isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build3' && (
            <div className="space-y-6">
              <TryItYourself />
              <Build3Bit isDarkMode={p.isDarkMode} accent={p.accent} />
              <CounterViz isDarkMode={p.isDarkMode} accent={p.accent} bits={3} mode="ripple" dir="up" />
            </div>
          )}
          {which === 'delay' && (
            <div className="space-y-6">
              <TryItYourself />
              <RippleDelayCalc isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'glitch' && (
            <div className="space-y-6">
              <TryItYourself />
              <GlitchTracer isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'dual' && (
            <div className="space-y-6">
              <TryItYourself />
              <DualModeSteer isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'analogy' && (
            <div className="space-y-6">
              <TryItYourself />
              <Dominoes isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="ripple-counter"
              titleEN="Build a ripple counter for real"
              titleHI="असली में एक ripple counter बनाइए"
              bodyEN="Open the live workbench and chain three JK flip-flops in toggle mode (J=K=1): the clock into FF0, Q0 into FF1's clock, Q1 into FF2's clock. Then tick the clock and prove the 000→111 count - and reverse a feed to Q' to count down."
              bodyHI="live workbench खोलिए और तीन JK flip-flops को toggle mode (J=K=1) में chain कीजिए: clock FF0 में, Q0 FF1 के clock में, Q1 FF2 के clock में। फिर clock tick कीजिए और 000→111 count साबित कीजिए - और एक feed को Q' पर उलटकर down गिनिए।" />
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
