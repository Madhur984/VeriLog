/**
 * Registers & Shift Registers - dsd/34, "The Word-Wide Memory Row"
 * (Sequential Logic track).
 * Generic scenes come from the shared _subtractor kit; the live shift register +
 * timing/state tables come from the shared _sequential/blocks library. The n-bit
 * register bank, the Load "drawbridge" buffer, the 1011 shift walkthrough, the
 * four-mode selector + synthesis matrix, the serial-vs-parallel loader, the
 * recirculating (non-destructive) loop, the universal shift register and the
 * bucket-brigade analogy are bespoke. EVERY displayed value (loaded word, shifted
 * word, cycle/wire counts, the synthesis matrix, the recirculating return, the
 * universal next-word) is COMPUTED in code from the actual bit array, never
 * hardcoded.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import {
  ShiftRegisterViz, TimingDiagram, StateTable, Toggle, ClockButton,
  type WaveSignal,
} from '../_sequential/blocks';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const ACC = { in: '#38bdf8', in2: '#fb7185', good: '#34d399', warn: '#f59e0b' };
const SRC_EN: string | undefined = '/videos/dsd34-registers.mp4';
const SRC_HI: string | undefined = undefined;

/* small pure helpers - the single source of truth for every shift op */
const shiftRight = (cells: number[], sin: number): number[] => [sin, ...cells.slice(0, cells.length - 1)];
const shiftLeft = (cells: number[], sin: number): number[] => [...cells.slice(1), sin];
const wordDec = (cells: number[]): number => cells.reduce((a, b, i) => a + b * (1 << (cells.length - 1 - i)), 0);

/* ───────── bespoke: the n-bit register bank (S02_Facts) ─────────
   Four D flip-flops on ONE common clock. Toggle each data input, pulse the shared
   clock, and all four load together into the stored word (computed). */
const RegisterBank: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const N = 4;
  const [dIn, setDIn] = useState<number[]>([1, 0, 1, 1]);
  const [q, setQ] = useState<number[]>([0, 0, 0, 0]);
  const [flash, setFlash] = useState(0);
  const load = () => { setQ([...dIn]); setFlash((f) => f + 1); };
  const dirty = q.some((v, i) => v !== dIn[i]);

  const x0 = 22, cw = 64, gap = 18;
  const cellX = (i: number) => x0 + i * (cw + gap);

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? `${N}-bit register · एक common clock` : `${N}-bit register · one common clock`}
      </div>
      <svg viewBox="0 0 340 172" className="mx-auto w-full max-w-2xl">
        {[0, 1, 2, 3].map((i) => {
          const cx = cellX(i) + cw / 2;
          const on = q[i] === 1;
          return (
            <g key={i}>
              {/* D input pin */}
              <line x1={cx} y1="24" x2={cx} y2="48" stroke={dIn[i] ? ACC.in : dim} strokeWidth="2.6" />
              <text x={cx} y="18" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="800" fill={dIn[i] ? ACC.in : dim}>D{i}={dIn[i]}</text>
              {/* FF body */}
              <motion.rect key={`${i}-${q[i]}-${flash}`} initial={{ opacity: 0.55 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}
                x={cellX(i)} y="48" width={cw} height="56" rx="9"
                fill={on ? `${accent}22` : box} stroke={on ? accent : dim} strokeWidth="2.4" />
              <text x={cx} y="72" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={t.faint as string}>FF{i}</text>
              <text x={cx} y="94" textAnchor="middle" fontFamily="monospace" fontSize="18" fontWeight="900" fill={on ? accent : dim}>{q[i]}</text>
              {/* Q label */}
              <text x={cellX(i) + cw - 4} y="60" textAnchor="end" fontFamily="monospace" fontSize="8" fill={t.faint as string}>Q{i}</text>
              {/* clock stub down to the common line */}
              <line x1={cx} y1="104" x2={cx} y2="134" stroke={dim} strokeWidth="2" />
              {/* edge triangle */}
              <path d={`M${cellX(i) + 4},98 L${cellX(i) + 12},104 L${cellX(i) + 4},110`} fill="none" stroke={isDarkMode ? '#94a3b8' : '#475569'} strokeWidth="1.5" />
            </g>
          );
        })}
        {/* the ONE common clock line under all cells */}
        <line x1="12" y1="134" x2="332" y2="134" stroke={accent} strokeWidth="2.6" />
        <text x="12" y="152" fontFamily="monospace" fontSize="10" fontWeight="800" fill={accent}>CLK</text>
        <text x="120" y="152" fontFamily="monospace" fontSize="9" fill={t.faint as string}>{lang === 'hi' ? '· सब FF एक ही edge पर पकड़ते हैं' : '· all FFs capture on the same edge'}</text>
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <span className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'data inputs' : 'data inputs'}</span>
        {dIn.map((v, i) => (
          <Toggle key={i} label={`D${i}`} v={v} color={ACC.in} onClick={() => setDIn((a) => a.map((x, j) => (j === i ? x ^ 1 : x)))} />
        ))}
      </div>
      <div className="mt-4"><ClockButton accent={accent} onTick={load} /></div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>stored word Q0..Q3 = <b style={{ color: accent }}>{q.join(' ')}</b> = {wordDec(q)} (decimal). {dirty ? <span style={{ color: ACC.warn }}>inputs बदले हैं — CLK ▲ दबाइए तो पूरा word एक साथ load होगा।</span> : <span style={{ color: ACC.good }}>word inputs से मेल खाता है।</span>}</>
          : <>stored word Q0..Q3 = <b style={{ color: accent }}>{q.join(' ')}</b> = {wordDec(q)} (decimal). {dirty ? <span style={{ color: ACC.warn }}>inputs changed — press CLK ▲ and the whole word loads at once.</span> : <span style={{ color: ACC.good }}>the word matches the inputs.</span>}</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: the buffer register + Load drawbridge (S03_Buffer) ─────────
   Load=1 lowers the bridge so the clock reaches the cells (accept new data);
   Load=0 raises it so the clock is gated (hold). tick applies only when Load=1. */
const BufferRegister: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const N = 4;
  const [dIn, setDIn] = useState<number[]>([1, 0, 1, 1]);
  const [q, setQ] = useState<number[]>([0, 1, 1, 0]);
  const [ld, setLd] = useState(1);
  const [tries, setTries] = useState(0);
  const tick = () => { setTries((n) => n + 1); if (ld) setQ([...dIn]); /* Load=0 → hold */ };

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'buffer register · Load drawbridge' : 'buffer register · the Load drawbridge'}
      </div>

      {/* stored word */}
      <div className="flex items-center justify-center gap-2">
        {q.map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className={`font-mono text-[9px] ${t.faint}`}>Q{i}</span>
            <motion.div key={`${i}-${c}`} initial={{ scale: 0.7, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }}
              className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-lg font-black"
              style={{ background: c ? accent : 'transparent', color: c ? '#000' : accent, border: `2px solid ${accent}${c ? '' : '55'}` }}>{c}</motion.div>
          </div>
        ))}
      </div>

      {/* the clock path with an animated drawbridge */}
      <svg viewBox="0 0 300 78" className="mx-auto mt-4 w-full max-w-md">
        {/* CLK source + wire to pivot */}
        <text x="4" y="44" fontFamily="monospace" fontSize="10" fontWeight="800" fill={accent}>CLK</text>
        <circle cx="40" cy="52" r="4" fill={accent} />
        <line x1="40" y1="52" x2="88" y2="52" stroke={accent} strokeWidth="2.6" />
        {/* the drawbridge (pivots up when Load=0) */}
        <motion.g style={{ transformOrigin: '88px 52px' }} animate={{ rotate: ld ? 0 : -64 }} transition={{ type: 'spring', stiffness: 140, damping: 14 }}>
          <line x1="88" y1="52" x2="150" y2="52" stroke={ld ? ACC.good : ACC.in2} strokeWidth="4" strokeLinecap="round" />
        </motion.g>
        {/* continuing (gated) wire up into the register */}
        <line x1="150" y1="52" x2="210" y2="52" stroke={ld ? ACC.good : dim} strokeWidth="2.6" strokeDasharray={ld ? '0' : '4 4'} />
        <line x1="210" y1="52" x2="210" y2="30" stroke={ld ? ACC.good : dim} strokeWidth="2.6" strokeDasharray={ld ? '0' : '4 4'} />
        {/* register block */}
        <rect x="196" y="8" width="90" height="22" rx="6" fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke={accent} strokeWidth="2" />
        <text x="241" y="23" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="800" fill={accent}>REGISTER</text>
        <text x="88" y="70" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={ld ? ACC.good : ACC.in2}>
          {ld ? (lang === 'hi' ? 'bridge नीचे · clock पहुँचता है' : 'bridge down · clock passes') : (lang === 'hi' ? 'bridge ऊपर · clock gated' : 'bridge up · clock gated')}
        </text>
      </svg>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {dIn.map((v, i) => (
          <Toggle key={i} label={`D${i}`} v={v} color={ACC.in} onClick={() => setDIn((a) => a.map((x, j) => (j === i ? x ^ 1 : x)))} />
        ))}
        <Toggle label="Load" v={ld} color={ACC.good} onClick={() => setLd(ld ^ 1)} />
      </div>
      <div className="mt-4"><ClockButton accent={accent} onTick={tick} /></div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {ld
          ? (lang === 'hi'
            ? <>Load=1 → अगली CLK ▲ पर register नया data <b style={{ color: ACC.good }}>{dIn.join(' ')}</b> स्वीकार करेगा।</>
            : <>Load=1 → on the next CLK ▲ the register accepts the new data <b style={{ color: ACC.good }}>{dIn.join(' ')}</b>.</>)
          : (lang === 'hi'
            ? <span style={{ color: ACC.in2 }}>Load=0 → clock gated; CLK ▲ दबाने पर word <b>{q.join(' ')}</b> पर जमा रहता है (आपने {tries} बार दबाया)।</span>
            : <span style={{ color: ACC.in2 }}>Load=0 → clock gated; pressing CLK ▲ leaves the word frozen at <b>{q.join(' ')}</b> (you pressed {tries}x).</span>)}
      </p>
    </Card>
  );
};

/* ───────── bespoke: the 1011 shift walkthrough (S04_Shift) ─────────
   Feed the stream 1,0,1,1 into an empty 4-bit right-shift register and show the
   register contents after each edge - every row iterated by shiftRight(). */
const ShiftWalkthrough: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const N = 4;
  const seq = [1, 0, 1, 1];
  let reg = Array(N).fill(0);
  const rows: (string | number)[][] = [];
  rows.push([lang === 'hi' ? 'शुरू' : 'start', '—', ...reg]);
  seq.forEach((b, k) => { reg = shiftRight(reg, b); rows.push([k + 1, b, ...reg]); });
  const final = reg.join('');
  return (
    <StateTable isDarkMode={isDarkMode} accent={accent}
      headers={[lang === 'hi' ? 'clock' : 'clock', lang === 'hi' ? 'serial-in' : 'serial-in', 'Q0', 'Q1', 'Q2', 'Q3']}
      rows={rows}
      highlight={rows.length - 1}
      note={lang === 'hi'
        ? `हर row shiftRight() से iterate हुई: नया bit Q0 पर घुसता है, बाक़ी दाएँ सरकते हैं। 1,0,1,1 feed करने के बाद Q0..Q3 = ${final} — पहला bit Q3 तक पहुँच गया।`
        : `Every row iterated by shiftRight(): the new bit enters Q0, the rest slide right. After feeding 1,0,1,1 the register reads Q0..Q3 = ${final} — the first bit has reached Q3.`} />
  );
};

/* ───────── bespoke: four-mode selector + synthesis matrix (S05_Modes) ─────────
   Cycle/wire counts computed from the two independent choices; the matrix is
   reproduced exactly from the source of truth. */
interface ModeDef { id: string; inSerial: boolean; outSerial: boolean; pinsEN: string; pinsHI: string; useEN: string; useHI: string }
const MODES: ModeDef[] = [
  { id: 'PIPO', inSerial: false, outSerial: false, pinsEN: 'lowest eff / highest pins', pinsHI: 'सबसे कम efficiency / सबसे ज़्यादा pins', useEN: 'fast memory buffer', useHI: 'fast memory buffer' },
  { id: 'SIPO', inSerial: true, outSerial: false, pinsEN: 'moderate', pinsHI: 'moderate', useEN: 'serial→parallel converter', useHI: 'serial→parallel converter' },
  { id: 'PISO', inSerial: false, outSerial: true, pinsEN: 'moderate', pinsHI: 'moderate', useEN: 'parallel→serial (UART tx), needs Shift/Load', useHI: 'parallel→serial (UART tx), Shift/Load चाहिए' },
  { id: 'SISO', inSerial: true, outSerial: true, pinsEN: 'fewest pins', pinsHI: 'सबसे कम pins', useEN: 'delay line / pipeline', useHI: 'delay line / pipeline' },
];

const ModeMatrix: React.FC<{ isDarkMode: boolean; accent: string; n: number }> = ({ isDarkMode, accent, n }) => {
  const { lang } = useSubLang();
  const rows: (string | number)[][] = MODES.map((m) => [
    m.id,
    m.inSerial ? n : 1,        // write cycles: serial = n, parallel = 1
    m.outSerial ? n : 1,       // read cycles
    lang === 'hi' ? m.pinsHI : m.pinsEN,
    lang === 'hi' ? m.useHI : m.useEN,
  ]);
  return (
    <StateTable isDarkMode={isDarkMode} accent={accent}
      headers={['Arch', lang === 'hi' ? 'Write (cyc)' : 'Write (cyc)', lang === 'hi' ? 'Read (cyc)' : 'Read (cyc)', 'Pins', lang === 'hi' ? 'Use' : 'Use']}
      rows={rows}
      note={lang === 'hi'
        ? `cycle counts n = ${n} के लिए compute हुए: serial side = n, parallel side = 1. mode के पहले अक्षर से write, दूसरे से read।`
        : `Cycle counts computed for n = ${n}: a serial side costs n, a parallel side costs 1. Read the mode's first letter for write, its second for read.`} />
  );
};

const ModeSelector: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const N = 4;
  const [mi, setMi] = useState(0);
  const m = MODES[mi];
  const writeCyc = m.inSerial ? N : 1;
  const readCyc = m.outSerial ? N : 1;

  const side = (serial: boolean, xLine: number, label: string) => {
    const cnt = serial ? 1 : N;
    const ys = serial ? [42] : [18, 34, 50, 66];
    return (
      <g>
        {ys.map((y, k) => (
          <line key={k} x1={xLine} y1={y} x2={xLine + 26} y2={y} stroke={accent} strokeWidth="2.6" />
        ))}
        <text x={xLine + 13} y="84" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill={t.faint as string}>{label} ({cnt}w)</text>
      </g>
    );
  };

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'mode चुनिए · data flow देखिए' : 'pick a mode · see the data flow'}
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        {MODES.map((mm, k) => (
          <button key={mm.id} onClick={() => setMi(k)}
            className="rounded-lg border px-3 py-1.5 font-mono text-[12px] font-black transition-colors"
            style={mi === k ? { background: accent, color: '#000', borderColor: accent } : { borderColor: `${accent}44`, color: accent }}>
            {mm.id}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 320 96" className="mx-auto w-full max-w-md">
        {/* input side */}
        {side(m.inSerial, 20, m.inSerial ? (lang === 'hi' ? 'serial in' : 'serial in') : (lang === 'hi' ? 'parallel in' : 'parallel in'))}
        {/* register block */}
        <rect x="120" y="18" width="80" height="52" rx="10" fill={box} stroke={accent} strokeWidth="2.5" />
        <text x="160" y="42" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="800" fill={accent}>{m.id}</text>
        <text x="160" y="56" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={dim}>{N}-bit</text>
        {/* output side */}
        {side(m.outSerial, 274, m.outSerial ? (lang === 'hi' ? 'serial out' : 'serial out') : (lang === 'hi' ? 'parallel out' : 'parallel out'))}
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-3 text-center font-mono text-[12px]">
        <div className={`rounded-2xl border p-3 ${t.soft}`}>
          <div className={`text-[10px] ${t.faint}`}>{lang === 'hi' ? 'write (अंदर करना)' : 'write (get it in)'}</div>
          <div className="mt-1 text-lg font-black" style={{ color: m.inSerial ? ACC.in2 : ACC.good }}>{writeCyc} {writeCyc === 1 ? 'cycle' : 'cycles'}</div>
          <div className={`text-[10px] ${t.faint}`}>{m.inSerial ? (lang === 'hi' ? '1 wire, serial' : '1 wire, serial') : (lang === 'hi' ? `${N} wires, parallel` : `${N} wires, parallel`)}</div>
        </div>
        <div className={`rounded-2xl border p-3 ${t.soft}`}>
          <div className={`text-[10px] ${t.faint}`}>{lang === 'hi' ? 'read (बाहर करना)' : 'read (get it out)'}</div>
          <div className="mt-1 text-lg font-black" style={{ color: m.outSerial ? ACC.in2 : ACC.good }}>{readCyc} {readCyc === 1 ? 'cycle' : 'cycles'}</div>
          <div className={`text-[10px] ${t.faint}`}>{m.outSerial ? (lang === 'hi' ? '1 wire, serial' : '1 wire, serial') : (lang === 'hi' ? `${N} wires, parallel` : `${N} wires, parallel`)}</div>
        </div>
      </div>
      <p className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
        {lang === 'hi'
          ? <><b style={{ color: accent }}>{m.id}</b> → {m.useHI}.</>
          : <><b style={{ color: accent }}>{m.id}</b> → {m.useEN}.</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: serial vs parallel loader (S06_SerialParallel) ─────────
   Load the same word two ways; a shared tick fills the serial register one bit
   per tick (n ticks) and the parallel register all at once (1 tick). Counts and
   the conserved wire-cycle product computed. */
const SerialVsParallel: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const N = 4;
  const word = [1, 0, 1, 1];
  const [tick, setTick] = useState(0);
  const serialLoaded = Math.min(tick, N);          // serial fills 1 bit per tick
  const parallelLoaded = tick >= 1 ? N : 0;         // parallel fills all on tick 1

  const Cells: React.FC<{ filled: number }> = ({ filled }) => (
    <div className="flex items-center justify-center gap-1.5">
      {word.map((b, i) => {
        const shown = i < filled;
        return (
          <div key={i} className="flex h-10 w-10 items-center justify-center rounded-xl font-mono text-base font-black"
            style={{ background: shown && b ? accent : 'transparent', color: shown ? (b ? '#000' : accent) : (t.faint as string), border: `2px solid ${shown ? accent : `${accent}44`}` }}>
            {shown ? b : '·'}
          </div>
        );
      })}
    </div>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? `word ${word.join('')} · दो तरह load` : `load word ${word.join('')} · two ways`}
        </span>
        <span className={`font-mono text-[12px] ${t.faint}`}>tick = {tick}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className={`rounded-2xl border p-4 ${t.soft}`}>
          <div className="mb-2 text-center font-mono text-[11px] font-black" style={{ color: ACC.in2 }}>{lang === 'hi' ? 'SERIAL · 1 wire' : 'SERIAL · 1 wire'}</div>
          <Cells filled={serialLoaded} />
          <p className={`mt-2 text-center font-mono text-[11px] ${t.faint}`}>
            {serialLoaded < N ? (lang === 'hi' ? `${serialLoaded}/${N} bits · अभी ${N - serialLoaded} और ticks` : `${serialLoaded}/${N} bits · ${N - serialLoaded} more ticks`) : (lang === 'hi' ? `पूरा — ${N} ticks लगे` : `done — took ${N} ticks`)}
          </p>
        </div>
        <div className={`rounded-2xl border p-4 ${t.soft}`}>
          <div className="mb-2 text-center font-mono text-[11px] font-black" style={{ color: ACC.good }}>{lang === 'hi' ? `PARALLEL · ${N} wires` : `PARALLEL · ${N} wires`}</div>
          <Cells filled={parallelLoaded} />
          <p className={`mt-2 text-center font-mono text-[11px] ${t.faint}`}>
            {parallelLoaded < N ? (lang === 'hi' ? 'tick दबाइए → 1 ही tick में पूरा' : 'press tick → done in 1 tick') : (lang === 'hi' ? '1 tick में पूरा' : 'done in 1 tick')}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <ClockButton accent={accent} onTick={() => setTick((k) => k + 1)} />
        <button onClick={() => setTick(0)} className="rounded-2xl border-2 px-4 py-2.5 font-mono text-[12px] font-black uppercase active:scale-95"
          style={{ borderColor: `${accent}55`, color: accent }}>{lang === 'hi' ? 'reset' : 'reset'}</button>
      </div>
      <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? <>serial = 1 wire × {N} cycles; parallel = {N} wires × 1 cycle. गुणनफल दोनों में <b style={{ color: accent }}>{N}</b> wire-cycles — यही time-बनाम-space trade-off।</>
          : <>serial = 1 wire × {N} cycles; parallel = {N} wires × 1 cycle. The product is <b style={{ color: accent }}>{N}</b> wire-cycles either way — the time-versus-space trade-off.</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: recirculating (non-destructive) read (S07_Recirculate) ─────────
   A MUX on the serial input selects external data (destructive) or the fed-back
   serial-out (recirculate). Everything computed by shiftRight(). */
const Recirculate: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const N = 4;
  const ORIG = [1, 0, 1, 1];
  const [cells, setCells] = useState<number[]>([...ORIG]);
  const [recirc, setRecirc] = useState(true);
  const [extIn, setExtIn] = useState(0);
  const serialOut = cells[N - 1];
  const inBit = recirc ? serialOut : extIn;
  const tick = () => setCells((c) => shiftRight(c, recirc ? c[N - 1] : extIn));
  const matches = cells.every((v, i) => v === ORIG[i]);

  // computed proof: N clocks of recirculate from ORIG returns to ORIG
  let r = [...ORIG];
  for (let i = 0; i < N; i++) r = shiftRight(r, r[N - 1]);
  const returns = r.every((v, i) => v === ORIG[i]);

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'recirculate · MUX serial-out → serial-in' : 'recirculate · MUX feeds serial-out → serial-in'}
      </div>

      <svg viewBox="0 0 320 118" className="mx-auto w-full max-w-lg">
        {/* MUX */}
        <polygon points="20,34 44,44 44,74 20,84" fill={box} stroke={accent} strokeWidth="2.2" />
        <text x="32" y="62" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={accent}>MUX</text>
        {/* external in (top MUX input) */}
        <line x1="2" y1="40" x2="20" y2="40" stroke={recirc ? dim : ACC.in} strokeWidth="2.4" />
        <text x="2" y="34" fontFamily="monospace" fontSize="8" fill={recirc ? dim : ACC.in}>ext={extIn}</text>
        {/* feedback in (bottom MUX input) */}
        <line x1="2" y1="78" x2="20" y2="78" stroke={recirc ? ACC.good : dim} strokeWidth="2.4" />
        <text x="2" y="92" fontFamily="monospace" fontSize="8" fill={recirc ? ACC.good : dim}>fb={serialOut}</text>
        {/* MUX out → register serial in */}
        <line x1="44" y1="59" x2="70" y2="59" stroke={inBit ? accent : dim} strokeWidth="2.8" />
        {/* register cells */}
        {cells.map((c, i) => (
          <g key={i}>
            <rect x={70 + i * 42} y="44" width="34" height="30" rx="6" fill={c ? `${accent}22` : box} stroke={c ? accent : dim} strokeWidth="2" />
            <text x={70 + i * 42 + 17} y="64" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="900" fill={c ? accent : dim}>{c}</text>
            <text x={70 + i * 42 + 17} y="40" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={t.faint as string}>Q{i}</text>
          </g>
        ))}
        {/* serial out */}
        <line x1={70 + N * 42 - 8} y1="59" x2={70 + N * 42 + 14} y2="59" stroke={serialOut ? accent : dim} strokeWidth="2.8" />
        <text x={70 + N * 42 + 4} y="40" fontFamily="monospace" fontSize="8" fill={serialOut ? accent : dim}>out={serialOut}</text>
        {/* feedback path back to MUX bottom input */}
        <path d={`M${70 + N * 42 + 14},59 q10,0 10,24 q0,20 -20,20 L2,103 L2,80`}
          fill="none" stroke={recirc ? ACC.good : dim} strokeWidth="1.8" strokeDasharray={recirc ? '0' : '4 3'} />
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <Toggle label={lang === 'hi' ? 'recirc' : 'recirc'} v={recirc ? 1 : 0} color={ACC.good} onClick={() => setRecirc((v) => !v)} />
        {!recirc && <Toggle label="ext-in" v={extIn} color={ACC.in} onClick={() => setExtIn(extIn ^ 1)} />}
        <button onClick={() => setCells([...ORIG])} className="rounded-2xl border-2 px-4 py-2.5 font-mono text-[12px] font-black uppercase active:scale-95"
          style={{ borderColor: `${accent}55`, color: accent }}>{lang === 'hi' ? `reset → ${ORIG.join('')}` : `reset → ${ORIG.join('')}`}</button>
      </div>
      <div className="mt-4"><ClockButton accent={accent} onTick={tick} /></div>
      <p className={`mt-3 flex items-center justify-center gap-2 text-center font-mono text-[12.5px] ${t.sub}`}>
        {matches ? <Check size={15} style={{ color: ACC.good }} /> : <X size={15} style={{ color: ACC.in2 }} />}
        {recirc
          ? (lang === 'hi'
            ? <>Recirculate=1 → serial-out वापस serial-in में; word घूमता है, खोता नहीं. अभी = <b style={{ color: accent }}>{cells.join('')}</b>{matches ? ' (मूल पर वापस)' : ''}</>
            : <>Recirculate=1 → serial-out loops back to serial-in; the word rotates, never lost. Now = <b style={{ color: accent }}>{cells.join('')}</b>{matches ? ' (back to the original)' : ''}</>)
          : (lang === 'hi'
            ? <span style={{ color: ACC.in2 }}>Recirculate=0 → ext-in shift होता है; असली word बाहर निकलकर खो रहा है. अभी = {cells.join('')}</span>
            : <span style={{ color: ACC.in2 }}>Recirculate=0 → external data shifts in; the stored word shifts out and is lost. Now = {cells.join('')}</span>)}
      </p>
      <p className={`mt-1 text-center font-mono text-[11px] ${t.faint}`}>
        {lang === 'hi'
          ? <>computed: recirculate में {N} clocks {ORIG.join('')} पर से चलकर वापस {r.join('')} → {returns ? 'non-destructive ✓' : '✗'}</>
          : <>computed: {N} clocks of recirculate from {ORIG.join('')} return to {r.join('')} → {returns ? 'non-destructive ✓' : '✗'}</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: universal shift register (S08_Universal) ─────────
   S1 S0 select {hold, shift-right, shift-left, parallel-load}. The next word is
   computed from the live bit array by the selected op. */
const UNI_MODES = [
  { s1: 0, s0: 0, en: 'HOLD', hi: 'HOLD' },
  { s1: 0, s0: 1, en: 'SHIFT RIGHT', hi: 'SHIFT RIGHT' },
  { s1: 1, s0: 0, en: 'SHIFT LEFT', hi: 'SHIFT LEFT' },
  { s1: 1, s0: 1, en: 'PARALLEL LOAD', hi: 'PARALLEL LOAD' },
];
const UniversalShiftRegister: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const N = 4;
  const [cells, setCells] = useState<number[]>([1, 0, 1, 1]);
  const [mi, setMi] = useState(0);
  const [sir, setSir] = useState(1);          // shift-right serial-in (enters Q0)
  const [sil, setSil] = useState(1);          // shift-left serial-in (enters Q3)
  const [pdata, setPdata] = useState<number[]>([1, 1, 0, 0]);
  const mode = UNI_MODES[mi];

  const nextWord = (c: number[]): number[] => {
    if (mi === 0) return [...c];                    // hold
    if (mi === 1) return shiftRight(c, sir);        // shift right (enter at Q0)
    if (mi === 2) return shiftLeft(c, sil);         // shift left (enter at Q3)
    return [...pdata];                              // parallel load
  };
  const preview = nextWord(cells);
  const tick = () => setCells((c) => nextWord(c));

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'universal shift register · S1 S0 mode' : 'universal shift register · S1 S0 mode'}
      </div>

      {/* mode selector */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {UNI_MODES.map((mm, k) => (
          <button key={k} onClick={() => setMi(k)}
            className="rounded-xl border px-2 py-2 font-mono text-[11px] font-black transition-colors"
            style={mi === k ? { background: accent, color: '#000', borderColor: accent } : { borderColor: `${accent}44`, color: accent }}>
            <span className="block text-[13px]">{mm.s1}{mm.s0}</span>
            {lang === 'hi' ? mm.hi : mm.en}
          </button>
        ))}
      </div>

      {/* live word */}
      <div className="flex items-center justify-center gap-2">
        {cells.map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className={`font-mono text-[9px] ${t.faint}`}>Q{i}</span>
            <motion.div key={`${i}-${c}`} initial={{ scale: 0.7, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }}
              className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-lg font-black"
              style={{ background: c ? accent : 'transparent', color: c ? '#000' : accent, border: `2px solid ${accent}${c ? '' : '55'}` }}>{c}</motion.div>
          </div>
        ))}
      </div>

      {/* inputs relevant to the mode */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {mi === 1 && <Toggle label={lang === 'hi' ? 'SI-right' : 'SI-right'} v={sir} color={ACC.in} onClick={() => setSir(sir ^ 1)} />}
        {mi === 2 && <Toggle label={lang === 'hi' ? 'SI-left' : 'SI-left'} v={sil} color={ACC.in} onClick={() => setSil(sil ^ 1)} />}
        {mi === 3 && (
          <>
            <span className={`font-mono text-[11px] ${t.faint}`}>parallel data</span>
            {pdata.map((v, i) => (
              <Toggle key={i} label={`P${i}`} v={v} color={ACC.warn} onClick={() => setPdata((a) => a.map((x, j) => (j === i ? x ^ 1 : x)))} />
            ))}
          </>
        )}
        {mi === 0 && <span className={`font-mono text-[12px] ${t.faint}`}>{lang === 'hi' ? 'HOLD — कोई input नहीं; word स्थिर' : 'HOLD — no input; the word stays put'}</span>}
      </div>
      <div className="mt-4"><ClockButton accent={accent} onTick={tick} /></div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>S1S0 = <b style={{ color: accent }}>{mode.s1}{mode.s0}</b> ({mode.hi}) → अगली CLK ▲ पर {cells.join('')} <b style={{ color: accent }}>→ {preview.join('')}</b></>
          : <>S1S0 = <b style={{ color: accent }}>{mode.s1}{mode.s0}</b> ({mode.en}) → on the next CLK ▲, {cells.join('')} <b style={{ color: accent }}>→ {preview.join('')}</b></>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: the bucket brigade analogy (S09_Analogy) ─────────
   Each person = one D flip-flop; one whistle = one clock edge; every bucket passes
   one position (a shift). Computed by shiftRight() from the well bit. */
const BucketBrigade: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const N = 4;
  const [buckets, setBuckets] = useState<number[]>([0, 0, 0, 0]);
  const [well, setWell] = useState(1);
  const tick = () => setBuckets((b) => shiftRight(b, well));
  const px = (i: number) => 58 + i * 62;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'bucket brigade · हर हाथ = एक D flip-flop' : 'bucket brigade · each hand = one D flip-flop'}
      </div>
      <svg viewBox="0 0 340 130" className="mx-auto w-full max-w-2xl">
        {/* well (source) */}
        <rect x="8" y="60" width="30" height="40" rx="4" fill="none" stroke={ACC.in} strokeWidth="2" />
        <text x="23" y="114" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={ACC.in}>well={well}</text>
        {/* fire (sink) */}
        <text x="322" y="112" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={ACC.in2}>fire</text>
        {buckets.map((c, i) => (
          <g key={i}>
            {/* person: head + body */}
            <circle cx={px(i)} cy="46" r="9" fill="none" stroke={t.faint as string} strokeWidth="1.8" />
            <line x1={px(i)} y1="55" x2={px(i)} y2="82" stroke={t.faint as string} strokeWidth="1.8" />
            {/* the bucket (bit) */}
            <motion.rect key={`${i}-${c}`} initial={{ y: -6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}
              x={px(i) - 12} y="86" width="24" height="20" rx="3"
              fill={c ? accent : 'none'} stroke={c ? accent : dim} strokeWidth="2" />
            <text x={px(i)} y="100" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="900" fill={c ? '#000' : dim}>{c}</text>
            <text x={px(i)} y="26" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={t.faint as string}>FF{i}</text>
            {/* pass arrow to the next */}
            {i < N - 1 && <text x={px(i) + 31} y="98" textAnchor="middle" fontFamily="monospace" fontSize="13" fill={dim}>→</text>}
          </g>
        ))}
      </svg>
      <div className="mt-2 flex items-center justify-center gap-3">
        <Toggle label={lang === 'hi' ? 'well bit' : 'well bit'} v={well} color={ACC.in} onClick={() => setWell(well ^ 1)} />
      </div>
      <div className="mt-4"><ClockButton accent={accent} onTick={tick} /></div>
      <p className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
        {lang === 'hi'
          ? <>एक सीटी (CLK ▲) = हर बाल्टी एक जगह आगे। नई बाल्टी well से घुसती है, आख़िरी आग पर गिरती है. line = <b style={{ color: accent }}>{buckets.join(' ')}</b> — ठीक एक shift register।</>
          : <>one whistle (CLK ▲) = every bucket passes one place. A new bucket enters from the well, the last tips onto the fire. line = <b style={{ color: accent }}>{buckets.join(' ')}</b> — exactly a shift register.</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: a small timing view of one bit marching (reused in S04) ───────── */
const MarchTiming: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const N = 4;
  const seq = [1, 0, 1, 1, 0, 0, 0, 0];   // feed 1011 then zeros
  // build Q0..Q3 waveforms by iterating shiftRight edge by edge
  let reg = Array(N).fill(0);
  const qs: number[][] = Array.from({ length: N }, () => []);
  const sin: number[] = [];
  seq.forEach((b) => { reg = shiftRight(reg, b); sin.push(b); for (let i = 0; i < N; i++) qs[i].push(reg[i]); });
  const signals: WaveSignal[] = [
    { name: 'SIN', values: sin, color: ACC.in },
    ...qs.map((v, i) => ({ name: `Q${i}`, values: v, color: i === N - 1 ? ACC.good : ACC.warn })),
  ];
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'timing · 1011 chain से गुज़रता' : 'timing · 1011 marching through the chain'}
      </div>
      <TimingDiagram isDarkMode={isDarkMode} accent={accent} signals={signals} showClock />
      <p className={`mt-2 text-center font-mono text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? 'हर edge पर serial-in Q0 में जाता है, फिर हर bit एक stage दाईं ओर; Q3 सबसे देर से बदलता है — बिल्कुल एक delay line।'
          : 'each edge the serial-in enters Q0, then every bit slides one stage right; Q3 changes last — precisely a delay line.'}
      </p>
    </Card>
  );
};

/* ───────── part assignment ───────── */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE ROW'
    : i <= Math.floor(n * 0.55) ? 'PART II · THE MECHANICS'
      : i < n - 3 ? 'PART III · PUT IT TO WORK'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  switch (scene.id) {
    case 'S02_Facts': return 'facts';
    case 'S03_Buffer': return 'buffer';
    case 'S04_Shift': return 'shift';
    case 'S05_Modes': return 'modes';
    case 'S06_SerialParallel': return 'serialparallel';
    case 'S07_Recirculate': return 'recirculate';
    case 'S08_Universal': return 'universal';
    case 'S09_Analogy': return 'analogy';
    case 'S10_Build': return 'build';
    default: return null;
  }
};

function componentFor(scene: SubScene, _i: number, _n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle}
        kicker="Registers · The Word-Wide Memory Row"
        hero={<ShiftRegisterViz isDarkMode={p.isDarkMode} accent={p.accent} stages={4} />} />;
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
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="REG" tag="Practice · Registers" title={scene.label} intro={scene.subtitle ?? ''} />
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
              <RegisterBank isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'buffer' && (
            <div className="space-y-6">
              <TryItYourself />
              <BufferRegister isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'shift' && (
            <div className="space-y-6">
              <TryItYourself />
              <ShiftRegisterViz isDarkMode={p.isDarkMode} accent={p.accent} stages={4} />
              <ShiftWalkthrough isDarkMode={p.isDarkMode} accent={p.accent} />
              <MarchTiming isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'modes' && (
            <div className="space-y-6">
              <TryItYourself />
              <ModeSelector isDarkMode={p.isDarkMode} accent={p.accent} />
              <ModeMatrix isDarkMode={p.isDarkMode} accent={p.accent} n={4} />
            </div>
          )}
          {which === 'serialparallel' && (
            <div className="space-y-6">
              <TryItYourself />
              <SerialVsParallel isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'recirculate' && (
            <div className="space-y-6">
              <TryItYourself />
              <Recirculate isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'universal' && (
            <div className="space-y-6">
              <TryItYourself />
              <UniversalShiftRegister isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'analogy' && (
            <div className="space-y-6">
              <TryItYourself />
              <BucketBrigade isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="shift-register"
              titleEN="Build a shift register for real"
              titleHI="असली में एक shift register बनाइए"
              bodyEN="Open the live workbench and wire four D flip-flops into a chain on one common clock - each Q into the next D, the first D as serial-in, the last Q as serial-out - then shift 1011 through and read every stage."
              bodyHI="live workbench खोलिए और चार D flip-flops को एक common clock पर एक chain में wire कीजिए - हर Q अगले D में, पहला D serial-in, आख़िरी Q serial-out - फिर 1011 shift कीजिए और हर stage पढ़िए।" />
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
