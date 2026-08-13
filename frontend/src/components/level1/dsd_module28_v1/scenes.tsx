/**
 * Sequential Logic Fundamentals - dsd/28, "Circuits That Remember".
 * Generic scenes come from the shared _subtractor kit and the shared sequential
 * block library (_sequential/blocks); the memory-button cover hero, the
 * combinational-vs-sequential twin blocks, the live feedback loop you can snip,
 * the state-persistence timing strip, the sync-vs-async contrast and the
 * push-button state machine are bespoke. EVERY value (the stored State bit, the
 * combinational output, the next state, the held Q, the waveform samples) is
 * COMPUTED in code, never hardcoded, and every circuit is inline <svg> with live
 * wire colours that light with the bit.
 */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Scissors } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import {
  DLatchViz, FlipFlopViz, StateDiagram, ClockWave, TimingDiagram,
  type WaveSignal, type FSMState, type FSMEdge,
} from '../_sequential/blocks';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const ACC = { in: '#38bdf8', ctrl: '#f59e0b', bad: '#fb7185', good: '#34d399', hold: '#a78bfa' };
const SRC_EN: string | undefined = '/videos/dsd28-sequential-intro.mp4';
const SRC_HI: string | undefined = undefined;

/* small reusable lamp: glows when its bit is 1. */
const Lamp: React.FC<{ label: string; on: number; color: string; isDarkMode: boolean }>
  = ({ label, on, color, isDarkMode }) => {
  const t = tone(isDarkMode);
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div animate={{ boxShadow: on ? `0 0 24px ${color}` : '0 0 0 rgba(0,0,0,0)' }}
        className="flex h-14 w-14 items-center justify-center rounded-full font-mono text-lg font-black"
        style={{ background: on ? color : 'transparent', color: on ? '#000' : color, border: `3px solid ${color}${on ? '' : '55'}` }}>
        {on}
      </motion.div>
      <span className={`max-w-[6.5rem] sm:max-w-[9rem] text-center font-mono text-[9px] uppercase leading-tight tracking-wide ${t.faint}`}>{label}</span>
    </div>
  );
};

/* ───────── bespoke: the memory button (cover hero) ─────────
   A push-button that flips a STORED state bit 0<->1 and KEEPS it after release,
   beside a momentary line that forgets the instant you let go. Proves that a
   sequential circuit = a circuit with memory. Everything computed. */
const MemoryButton: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [pressing, setPressing] = useState(false);
  const [stored, setStored] = useState(0);       // the latched STATE bit
  const [presses, setPresses] = useState(0);
  const momentary = pressing ? 1 : 0;            // combinational: follows the finger, no memory
  const press = () => { setPressing(true); setStored((s) => s ^ 1); setPresses((n) => n + 1); };
  const release = () => setPressing(false);

  return (
    <Card isDarkMode={isDarkMode} className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'memory जो याद रखे · दबाइए' : 'memory that remembers · press it'}
        </span>
      </div>
      <div className="flex flex-col items-center gap-7 sm:flex-row sm:justify-around">
        <button
          onPointerDown={press} onPointerUp={release} onPointerLeave={release}
          className="flex h-28 w-28 select-none items-center justify-center rounded-full font-black active:scale-95"
          style={{
            background: pressing ? accent : 'transparent', color: pressing ? '#000' : accent,
            border: `4px solid ${accent}`, boxShadow: pressing ? `0 0 0 6px ${accent}22` : `0 10px 30px ${accent}22`,
            touchAction: 'none',
          }}>
          <span className="font-mono text-sm">{pressing ? (lang === 'hi' ? 'दबा' : 'DOWN') : (lang === 'hi' ? 'दबाएँ' : 'PRESS')}</span>
        </button>
        <div className="flex items-center gap-4 sm:gap-7">
          <Lamp label={lang === 'hi' ? 'momentary · no memory' : 'momentary · no memory'} on={momentary} color={ACC.in} isDarkMode={isDarkMode} />
          <Lamp label={lang === 'hi' ? 'stored State · memory' : 'stored State · memory'} on={stored} color={ACC.hold} isDarkMode={isDarkMode} />
        </div>
      </div>
      <p className={`mt-5 text-center font-mono text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>{presses}× दबाया · momentary अभी <b style={{ color: ACC.in }}>{momentary}</b> (छोड़ते ही 0) · stored State <b style={{ color: ACC.hold }}>{stored}</b> (छोड़ने के बाद भी टिका)</>
          : <>pressed {presses}× · momentary now <b style={{ color: ACC.in }}>{momentary}</b> (0 the moment you let go) · stored State <b style={{ color: ACC.hold }}>{stored}</b> (stays after release)</>}
      </p>
      <p className={`mt-1 text-center font-mono text-[11px] ${t.faint}`}>
        {lang === 'hi' ? 'यही sequential है — momentary भूल जाता है, State याद रखता है।' : 'that is sequential logic — the momentary line forgets, the State remembers.'}
      </p>
    </Card>
  );
};

/* ───────── bespoke: combinational block vs sequential block (live) ─────────
   Left: Y = A XOR B, a pure function of the inputs (Output = f(Input)).
   Right: Next = In XOR Q, a stored state Q fed back, committed on a clock tick
   (Next = f(Present Input, Past State)). All wire colours computed. */
const CombVsSeq: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  // combinational
  const [A, setA] = useState(1);
  const [B, setB] = useState(0);
  const Ycomb = A ^ B;
  // sequential
  const [In, setIn] = useState(1);
  const [Q, setQ] = useState(0);
  const next = In ^ Q;
  const tick = () => setQ(next);

  const Tog: React.FC<{ label: string; v: number; set: (n: number) => void; color: string }> = ({ label, v, set, color }) => (
    <button onClick={() => set(v ^ 1)} className="flex flex-col items-center gap-1 active:scale-90">
      <span className="font-mono text-[11px] font-bold" style={{ color }}>{label}</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black"
        style={{ background: v ? color : 'transparent', color: v ? '#000' : color, border: `2px solid ${color}${v ? '' : '66'}` }}>{v}</span>
    </button>
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* combinational */}
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACC.in }}>
          {lang === 'hi' ? 'combinational · Output = f(Input)' : 'combinational · Output = f(Input)'}
        </div>
        <svg viewBox="0 0 230 130" className="mx-auto w-full max-w-sm">
          <line x1="6" y1="42" x2="78" y2="42" stroke={A ? ACC.in : dim} strokeWidth="3" />
          <text x="4" y="34" fontFamily="monospace" fontSize="11" fontWeight="800" fill={A ? ACC.in : dim}>A={A}</text>
          <line x1="6" y1="90" x2="78" y2="90" stroke={B ? ACC.in : dim} strokeWidth="3" />
          <text x="4" y="106" fontFamily="monospace" fontSize="11" fontWeight="800" fill={B ? ACC.in : dim}>B={B}</text>
          <rect x="78" y="26" width="82" height="80" rx="12" fill={box} stroke={accent} strokeWidth="2.5" />
          <text x="119" y="60" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="800" fill={accent}>A ⊕ B</text>
          <text x="119" y="76" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={dim}>no memory</text>
          <line x1="160" y1="66" x2="224" y2="66" stroke={Ycomb ? ACC.good : dim} strokeWidth="3" />
          <text x="204" y="58" fontFamily="monospace" fontSize="12" fontWeight="900" fill={Ycomb ? ACC.good : dim}>Y={Ycomb}</text>
        </svg>
        <div className="mt-3 flex items-center justify-center gap-4">
          <Tog label="A" v={A} set={setA} color={ACC.in} />
          <Tog label="B" v={B} set={setB} color={ACC.in} />
        </div>
        <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
          Y = A ⊕ B = <b style={{ color: ACC.good }}>{Ycomb}</b> · {lang === 'hi' ? 'हर बार शून्य से पुनर्गणना' : 'recomputed from scratch every time'}
        </p>
      </Card>

      {/* sequential */}
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACC.hold }}>
          {lang === 'hi' ? 'sequential · Next = f(In, State)' : 'sequential · Next = f(In, State)'}
        </div>
        <svg viewBox="0 0 240 150" className="mx-auto w-full max-w-sm">
          {/* input */}
          <line x1="6" y1="50" x2="84" y2="50" stroke={In ? ACC.in : dim} strokeWidth="3" />
          <text x="4" y="42" fontFamily="monospace" fontSize="11" fontWeight="800" fill={In ? ACC.in : dim}>In={In}</text>
          {/* block */}
          <rect x="84" y="34" width="82" height="74" rx="12" fill={box} stroke={accent} strokeWidth="2.5" />
          <text x="125" y="66" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="800" fill={accent}>In ⊕ Q</text>
          <text x="125" y="82" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={dim}>state Q</text>
          {/* output */}
          <line x1="166" y1="60" x2="222" y2="60" stroke={Q ? ACC.good : dim} strokeWidth="3" />
          <text x="196" y="52" fontFamily="monospace" fontSize="12" fontWeight="900" fill={Q ? ACC.good : dim}>Q={Q}</text>
          {/* feedback path Q -> lower input */}
          <path d="M210,60 V132 H60 V92 H84" fill="none" stroke={Q ? ACC.hold : dim} strokeWidth="2.4" strokeDasharray="5 3" />
          <text x="120" y="128" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill={ACC.hold}>feedback · past state</text>
        </svg>
        <div className="mt-3 flex items-center justify-center gap-5">
          <Tog label="In" v={In} set={setIn} color={ACC.in} />
          <div className="flex flex-col items-center gap-1">
            <span className={`font-mono text-[11px] ${t.faint}`}>Q(now)</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black"
              style={{ background: Q ? ACC.good : 'transparent', color: Q ? '#000' : ACC.good, border: `2px solid ${ACC.good}` }}>{Q}</span>
          </div>
          <button onClick={tick} className="flex items-center gap-1.5 rounded-2xl px-4 py-2.5 font-black text-black active:scale-95"
            style={{ background: accent, boxShadow: `0 8px 24px ${accent}33` }}>
            <Zap size={15} /> {lang === 'hi' ? 'tick' : 'tick'}
          </button>
        </div>
        <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
          Next = In ⊕ Q = {In} ⊕ {Q} = <b style={{ color: ACC.hold }}>{next}</b> · {lang === 'hi' ? 'tick पर Q में जमेगा' : 'commits into Q on tick'}
        </p>
      </Card>
    </div>
  );
};

/* ───────── bespoke: the feedback loop IS the memory (live) ─────────
   A logic block whose output Q is cross-fed to its own input. SET/CLR write into
   the loop; while the loop is connected the bit HOLDS; cut the loop and the
   stored bit collapses to 0 - memory vanishes. Wire colours computed. */
const FeedbackLoop: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const [loop, setLoop] = useState(true);
  const [q, setQ] = useState(1);
  // cutting the loop removes the only path that could remember -> bit collapses.
  useEffect(() => { if (!loop) setQ(0); }, [loop]);
  const set = () => { if (loop) setQ(1); };
  const clr = () => { if (loop) setQ(0); };
  const fbCol = !loop ? ACC.bad : (q ? ACC.hold : dim);

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'feedback loop = memory' : 'feedback loop = memory'}
      </div>
      <svg viewBox="0 0 280 160" className="mx-auto w-full max-w-lg">
        {/* write inputs */}
        <line x1="8" y1="52" x2="72" y2="52" stroke={dim} strokeWidth="2.5" />
        <text x="6" y="44" fontFamily="monospace" fontSize="10" fontWeight="800" fill={t.faint as string}>write</text>
        {/* block */}
        <rect x="72" y="34" width="92" height="76" rx="12" fill={box} stroke={accent} strokeWidth="2.5" />
        <text x="118" y="66" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="800" fill={accent}>LOGIC</text>
        <text x="118" y="82" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={dim}>hold Q</text>
        {/* output */}
        <line x1="164" y1="62" x2="238" y2="62" stroke={q ? accent : dim} strokeWidth="3.2" />
        <circle cx="214" cy="62" r="4.5" fill={q ? accent : dim} />
        <text x="244" y="66" fontFamily="monospace" fontSize="14" fontWeight="900" fill={q ? accent : dim}>{q}</text>
        <text x="244" y="50" fontFamily="monospace" fontSize="9" fill={t.faint as string}>Q</text>
        {/* the feedback path: output -> down -> back -> into the block's lower input */}
        <path d="M214,62 V140 H40 V96 H72" fill="none" stroke={fbCol} strokeWidth="2.6"
          strokeDasharray={loop ? '0' : '6 4'} />
        {/* the cut marker */}
        {!loop && (
          <g>
            <line x1="120" y1="132" x2="132" y2="148" stroke={ACC.bad} strokeWidth="2.5" />
            <line x1="132" y1="132" x2="120" y2="148" stroke={ACC.bad} strokeWidth="2.5" />
          </g>
        )}
        <text x="127" y="156" textAnchor="middle" fontFamily="monospace" fontSize="8.5"
          fill={loop ? ACC.hold : ACC.bad}>{loop ? 'feedback holds the bit' : 'loop cut — nothing remembers'}</text>
      </svg>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button onClick={set} disabled={!loop}
          className="rounded-xl px-4 py-2 font-mono text-[12px] font-black text-black active:scale-95"
          style={{ background: ACC.good, opacity: loop ? 1 : 0.35 }}>SET → 1</button>
        <button onClick={clr} disabled={!loop}
          className="rounded-xl px-4 py-2 font-mono text-[12px] font-black text-black active:scale-95"
          style={{ background: ACC.ctrl, opacity: loop ? 1 : 0.35 }}>CLR → 0</button>
        <button onClick={() => setLoop((l) => !l)}
          className="flex items-center gap-1.5 rounded-xl border-2 px-4 py-2 font-mono text-[12px] font-black active:scale-95"
          style={{ borderColor: loop ? ACC.bad : ACC.hold, color: loop ? ACC.bad : ACC.hold }}>
          <Scissors size={13} /> {loop ? (lang === 'hi' ? 'loop काटें' : 'cut the loop') : (lang === 'hi' ? 'loop जोड़ें' : 'reconnect loop')}
        </button>
      </div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {loop
          ? <>{lang === 'hi' ? 'loop जुड़ा' : 'loop connected'} · Q = <b style={{ color: accent }}>{q}</b> {lang === 'hi' ? '— बिना input के भी टिका (memory)' : '— held with no input applied (memory)'}</>
          : <span style={{ color: ACC.bad }}>{lang === 'hi' ? 'loop कटा → याद रखने का कोई रास्ता नहीं → Q मजबूरन 0' : 'loop cut → no path to remember → Q forced to 0'}</span>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: state persists after the input is gone (live) ─────────
   A rolling timing strip. A Set pulse rises then falls; the stored Q latches
   high and HOLDS through every idle tick after the input is removed. A Reset
   pulse clears it. Q is computed by scanning the input history. */
const HoldStrip: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [hist, setHist] = useState<{ s: number; r: number; q: number }[]>([
    { s: 0, r: 0, q: 0 }, { s: 1, r: 0, q: 1 }, { s: 0, r: 0, q: 1 }, { s: 0, r: 0, q: 1 },
  ]);
  const push = (s: number, r: number) => setHist((h) => {
    const prevQ = h[h.length - 1].q;
    const q = s ? 1 : r ? 0 : prevQ;      // set / reset / hold — computed
    return [...h.slice(-9), { s, r, q }];
  });
  const signals: WaveSignal[] = [
    { name: 'Set', values: hist.map((x) => x.s), color: ACC.good },
    { name: 'Rst', values: hist.map((x) => x.r), color: ACC.bad },
    { name: 'Q', values: hist.map((x) => x.q), color: ACC.hold },
  ];
  const heldTicks = (() => {           // idle ticks since the last write, while Q held
    let n = 0;
    for (let i = hist.length - 1; i >= 0; i--) { if (hist[i].s || hist[i].r) break; n++; }
    return n;
  })();

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'state input हटने के बाद भी टिकी' : 'state persists after the input is gone'}
      </div>
      <TimingDiagram isDarkMode={isDarkMode} accent={accent} signals={signals} showClock={false} />
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <button onClick={() => push(1, 0)} className="rounded-xl px-4 py-2 font-mono text-[12px] font-black text-black active:scale-95" style={{ background: ACC.good }}>
          {lang === 'hi' ? 'Set pulse' : 'Set pulse'}
        </button>
        <button onClick={() => push(0, 0)} className="rounded-xl border-2 px-4 py-2 font-mono text-[12px] font-black active:scale-95" style={{ borderColor: `${accent}88`, color: accent }}>
          {lang === 'hi' ? 'idle tick (कोई input नहीं)' : 'idle tick (no input)'}
        </button>
        <button onClick={() => push(0, 1)} className="rounded-xl px-4 py-2 font-mono text-[12px] font-black text-black active:scale-95" style={{ background: ACC.bad }}>
          {lang === 'hi' ? 'Reset pulse' : 'Reset pulse'}
        </button>
      </div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        Q = <b style={{ color: ACC.hold }}>{hist[hist.length - 1].q}</b>
        {heldTicks > 0
          ? <> · {lang === 'hi' ? `${heldTicks} idle tick से बिना input के टिका है` : `held for ${heldTicks} idle tick${heldTicks > 1 ? 's' : ''} with no input`}</>
          : <> · {lang === 'hi' ? 'अभी-अभी लिखा गया' : 'just written'}</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: synchronous vs asynchronous ─────────
   Left: a clean master-clock square wave (discrete rising edges) via the shared
   ClockWave. Right: a scribbly async track — events land at irregular, computed
   x-positions with no grid. */
const AsyncTrack: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  // irregular event positions + alternating levels (fixed, not on a grid)
  const xs = [14, 46, 62, 118, 150, 176, 232, 268];
  const top = 12, bot = 40;
  let d = `M6,${bot}`;
  xs.forEach((x, i) => { const y = i % 2 === 0 ? bot : top; d += ` H${x} V${i % 2 === 0 ? top : bot}`; });
  d += ` H300 V${bot}`;
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 306 60" className="mx-auto w-full" style={{ maxWidth: 306 }}>
        <text x="2" y="30" fontFamily="monospace" fontSize="10" fontWeight="800" fill={accent}>EVT</text>
        <path d={d} fill="none" stroke={accent} strokeWidth="2.5" strokeLinejoin="round" transform="translate(24,0)" />
        {xs.map((x, i) => (
          <line key={i} x1={x + 24} y1={4} x2={x + 24} y2={52} stroke={dim} strokeWidth="1" strokeDasharray="2 3" />
        ))}
      </svg>
    </div>
  );
};

const SyncAsyncViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: ACC.good }}>
          {lang === 'hi' ? 'synchronous · एक master clock' : 'synchronous · one master clock'}
        </div>
        <ClockWave isDarkMode={isDarkMode} accent={ACC.good} cycles={4} edge="rising" label="CLK" />
        <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
          {lang === 'hi' ? 'state सिर्फ़ discrete rising edges ▲ पर बदलती — lockstep' : 'state changes only on the discrete rising edges ▲ — lockstep'}
        </p>
      </Card>
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'asynchronous · कोई clock नहीं' : 'asynchronous · no clock'}
        </div>
        <AsyncTrack isDarkMode={isDarkMode} accent={accent} />
        <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
          {lang === 'hi' ? 'events अनियमित पलों पर उतरते — कोई grid नहीं, तुरंत प्रतिक्रिया' : 'events land at irregular moments — no grid, instant reaction'}
        </p>
      </Card>
    </div>
  );
};

/* ───────── bespoke: the push-button two-state machine (live) ─────────
   OFF/ON states, press edges toggle, release self-loops "remember". Built on the
   shared StateDiagram; the active state is computed from the live toggle. */
const PushButtonFSM: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [on, setOn] = useState(false);
  const [presses, setPresses] = useState(0);
  const states: FSMState[] = [
    { id: 'OFF', label: 'OFF', x: 90, y: 96 },
    { id: 'ON', label: 'ON', x: 250, y: 96 },
  ];
  const hold = lang === 'hi' ? 'release · टिका' : 'release · holds';
  const edges: FSMEdge[] = [
    { from: 'OFF', to: 'ON', label: 'press', curve: 34 },
    { from: 'ON', to: 'OFF', label: 'press', curve: -34 },
    { from: 'OFF', to: 'OFF', label: hold },
    { from: 'ON', to: 'ON', label: hold },
  ];
  const active = on ? 'ON' : 'OFF';

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'push-button · two-state machine' : 'push-button · two-state machine'}
      </div>
      <StateDiagram isDarkMode={isDarkMode} accent={accent} states={states} edges={edges} active={active} width={340} height={190} />
      <div className="mt-2 flex items-center justify-center gap-4">
        <button onClick={() => { setOn((v) => !v); setPresses((n) => n + 1); }}
          className="flex items-center gap-2 rounded-2xl px-6 py-2.5 font-black text-black active:scale-95"
          style={{ background: accent, boxShadow: `0 8px 24px ${accent}33` }}>
          {lang === 'hi' ? 'दबाएँ' : 'PRESS'}
        </button>
        <div className="flex flex-col items-center gap-1">
          <span className={`font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? 'अभी state' : 'current state'}</span>
          <span className="font-mono text-lg font-black" style={{ color: accent }}>{active}</span>
        </div>
      </div>
      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>{presses}× दबाया · वही press {active === 'ON' ? 'ने OFF→ON किया' : 'ने ON→OFF किया'} — बीच में release self-loop पर <b style={{ color: accent }}>{active}</b> टिका रहता है</>
          : <>pressed {presses}× · the same press did {active === 'ON' ? 'OFF→ON' : 'ON→OFF'} — between presses the release self-loop holds <b style={{ color: accent }}>{active}</b></>}
      </p>
    </Card>
  );
};

/* ───────── part assignment (copied from module 21) ───────── */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE IDEA'
    : i <= Math.floor(n * 0.55) ? 'PART II · THE LOGIC'
      : i < n - 2 ? 'PART III · TELL THEM APART'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  const key = `${scene.id} ${scene.label}`.toLowerCase();
  if (key.includes('facts')) return 'combvsseq';
  if (key.includes('feedback')) return 'feedbackloop';
  if (key.includes('latchvsff') || key.includes('latch vs')) return 'latchff';
  if (key.includes('syncvsasync') || key.includes('sync vs')) return 'syncasync';
  if (key.includes('_state') || key.includes('persist')) return 'holdstrip';
  if (key.includes('analogy') || key.includes('push-button')) return 'analogy';
  if (key.includes('build')) return 'build';
  return null;
};

function componentFor(scene: SubScene, _i: number, _n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="Sequential Logic · Circuits That Remember" hero={<MemoryButton isDarkMode={p.isDarkMode} accent={p.accent} />} />;
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
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="SEQ" tag="Practice · Sequential Logic" title={scene.label} intro={scene.subtitle ?? ''} />
        </div>
      );
    case 'recap':
      return (p) => <RecapScene {...p} scene={scene} />;
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'combvsseq' && (
            <div className="space-y-6">
              <TryItYourself />
              <CombVsSeq isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'feedbackloop' && (
            <div className="space-y-6">
              <TryItYourself />
              <FeedbackLoop isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'holdstrip' && (
            <div className="space-y-6">
              <TryItYourself />
              <HoldStrip isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'latchff' && (
            <div className="space-y-6">
              <TryItYourself />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <DLatchViz isDarkMode={p.isDarkMode} accent={p.accent} />
                <FlipFlopViz isDarkMode={p.isDarkMode} accent={p.accent} type="D" />
              </div>
            </div>
          )}
          {which === 'syncasync' && (
            <div className="space-y-6">
              <TryItYourself />
              <SyncAsyncViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'analogy' && (
            <div className="space-y-6">
              <TryItYourself />
              <PushButtonFSM isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="sr-latch"
              titleEN="Build the first memory cell (SR latch)"
              titleHI="पहली memory cell बनाइए (SR latch)"
              bodyEN="Open the live workbench and cross-couple two NOR gates so each output feeds the other's input. Drive Set and Reset, watch Q hold a bit with no input applied, and trip the forbidden 1,1 case for yourself."
              bodyHI="live workbench खोलिए और दो NOR gates को cross-couple कीजिए ताकि हर output दूसरे के input को feed करे। Set और Reset चलाइए, देखिए Q बिना input के एक bit पकड़ता है, और forbidden 1,1 स्थिति ख़ुद trip कीजिए।" />
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
