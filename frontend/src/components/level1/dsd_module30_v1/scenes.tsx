/**
 * Flip-Flops - dsd/30, "The Clock-Ticked Memory Cell" (Sequential Logic track).
 * Generic scenes come from the shared _subtractor kit; the four live flip-flops
 * and their characteristic tables come from the shared _sequential/blocks
 * library (FlipFlopViz + CharTable, which compute every next state from the
 * characteristic equation). The edge-vs-level timing comparison, the edge-polarity
 * demo, the two-phase master-slave, the JK->D / JK->T conversion proofs, the
 * application map with a live divide-by-two, and the turnstile analogy are
 * bespoke. EVERY displayed value (next state, sampled data, latch output, divided
 * clock, conversion equivalence) is COMPUTED in code, never hardcoded.
 */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ToggleLeft, Check, X, Users, ArrowRight } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  LiveGate, WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import {
  FlipFlopViz, CharTable, ClockWave, TimingDiagram, Toggle, ClockButton, StateTable,
  ffNext, FF_META, type FFType, type WaveSignal,
} from '../_sequential/blocks';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const ACC = { in: '#38bdf8', in2: '#fb7185', good: '#34d399', warn: '#f59e0b' };
const SRC_EN: string | undefined = '/videos/dsd30-flipflops.mp4';
const SRC_HI: string | undefined = undefined;

/* ───────── bespoke: transparent window vs a single edge (illustrative SVG) ───────── */
const WindowVsEdge: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'transparent window बनाम एक edge' : 'transparent window vs one edge'}
      </div>
      <svg viewBox="0 0 320 120" className="mx-auto w-full max-w-xl">
        {/* shaded high window (latch is transparent here) */}
        <rect x="90" y="20" width="70" height="50" fill={`${ACC.in2}22`} stroke={`${ACC.in2}77`} strokeWidth="1.4" strokeDasharray="4 3" />
        <text x="125" y="14" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={ACC.in2}>
          {lang === 'hi' ? 'latch खुला (window)' : 'latch open (window)'}
        </text>
        {/* clock waveform: low, high, low, high */}
        <path d="M20,70 H90 V20 H160 V70 H230 V20 H300" fill="none" stroke={accent} strokeWidth="2.6" strokeLinejoin="round" />
        <text x="4" y="48" fontFamily="monospace" fontSize="10" fontWeight="800" fill={accent}>CLK</text>
        {/* the single sampling edge the flip-flop uses */}
        <line x1="90" y1="8" x2="90" y2="86" stroke={ACC.good} strokeWidth="2" strokeDasharray="3 2" />
        <path d="M84,26 L90,16 L96,26" fill="none" stroke={ACC.good} strokeWidth="2" />
        <text x="90" y="100" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={ACC.good}>
          {lang === 'hi' ? 'FF यहीं sample करता है' : 'FF samples only here'}
        </text>
        {/* baseline marks */}
        <line x1="20" y1="70" x2="300" y2="70" stroke={dim} strokeWidth="0.6" />
      </svg>
      <p className={`mt-2 text-center font-mono text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? 'latch पूरे गुलाबी window में input की नक़ल करता है; flip-flop सिर्फ़ हरे edge पर पकड़ता है।'
          : 'the latch copies its input across the whole pink window; the flip-flop captures only at the green edge.'}
      </p>
    </Card>
  );
};

/* ───────── bespoke: rising / falling edge markers (uses shared ClockWave) ───────── */
const EdgeMarkers: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {([['rising', lang === 'hi' ? 'positive edge (0->1)' : 'positive edge (0->1)'],
         ['falling', lang === 'hi' ? 'negative edge (1->0)' : 'negative edge (1->0)']] as const).map(([edge, cap]) => (
        <Card key={edge} isDarkMode={isDarkMode}>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>{cap}</div>
          <ClockWave isDarkMode={isDarkMode} accent={accent} cycles={3} edge={edge} />
          <p className={`mt-1 text-center font-mono text-[11px] ${t.faint}`}>
            {edge === 'rising'
              ? (lang === 'hi' ? 'FF ऊपर जाते transition पर fire करता है' : 'FF fires on the upward transition')
              : (lang === 'hi' ? 'FF नीचे जाते transition पर fire करता है (clock पर bubble)' : 'FF fires on the downward transition (bubble on clock)')}
          </p>
        </Card>
      ))}
    </div>
  );
};

/* ───────── bespoke: edge vs level, computed timing comparison ─────────
   Same D + clock into a level latch (transparent through the high window) and an
   edge flip-flop (samples only at the rising edge). A togglable glitch inside one
   window makes the difference visible. Every sample is computed by iterating. */
const EdgeVsLevel: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [glitch, setGlitch] = useState(true);
  const N = 12;
  const clk = Array.from({ length: N }, (_, i) => (i >> 1) & 1);           // period-4: 2 low, 2 high
  const baseD = [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1];
  const d = baseD.map((v, i) => (glitch && i === 7 ? v ^ 1 : v));          // spike inside the {6,7} window

  const latch: number[] = []; let lq = 0;
  for (let i = 0; i < N; i++) { if (clk[i]) lq = d[i]; latch.push(lq); }   // transparent while clk high

  const ff: number[] = []; let fq = 0;
  for (let i = 0; i < N; i++) { if (i > 0 && clk[i] === 1 && clk[i - 1] === 0) fq = d[i]; ff.push(fq); } // sample at rising edge

  const diverge = latch.filter((v, i) => v !== ff[i]).length;

  const signals: WaveSignal[] = [
    { name: 'CLK', values: clk, color: accent },
    { name: 'D', values: d, color: ACC.in },
    { name: 'Q·latch', values: latch, color: ACC.in2 },
    { name: 'Q·FF', values: ff, color: ACC.good },
  ];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'latch बनाम flip-flop · same D + clock' : 'latch vs flip-flop · same D + clock'}
        </span>
        <button onClick={() => setGlitch((g) => !g)}
          className="rounded-lg border px-3 py-1.5 font-mono text-[12px] font-black active:scale-95"
          style={glitch ? { background: ACC.in2, color: '#000', borderColor: ACC.in2 } : { borderColor: `${ACC.in2}66`, color: ACC.in2 }}>
          {glitch ? (lang === 'hi' ? 'glitch चालू' : 'glitch on') : (lang === 'hi' ? 'glitch बंद' : 'glitch off')}
        </button>
      </div>
      <TimingDiagram isDarkMode={isDarkMode} accent={accent} signals={signals} showClock={false} />
      <p className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
        {diverge > 0
          ? (lang === 'hi'
            ? <>latch और flip-flop <b style={{ color: ACC.in2 }}>{diverge}</b> samples पर अलग हैं: latch ने window के अंदर glitch का पीछा किया (और उसे जमा भी लिया); flip-flop edge पर sample करके साफ़ रहा।</>
            : <>the latch and flip-flop differ at <b style={{ color: ACC.in2 }}>{diverge}</b> samples: the latch followed the glitch inside the window (and even froze it); the flip-flop, sampling only at the edge, stayed clean.</>)
          : (lang === 'hi'
            ? 'हर window में data स्थिर है, तो दोनों सहमत हैं — ख़तरा तभी दिखता है जब data window के अंदर हिले।'
            : 'with data steady through every window, both agree — the danger appears only when data moves inside the window.')}
      </p>
    </Card>
  );
};

/* ───────── bespoke: positive vs negative edge, live fire demo ─────────
   Toggle the clock; whichever polarity matches the transition "fires". */
const EdgePolarity: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const [clk, setClk] = useState(0);
  const [fired, setFired] = useState<'pos' | 'neg' | null>(null);
  const toggle = () => {
    const nc = clk ^ 1;
    setFired(clk === 0 && nc === 1 ? 'pos' : clk === 1 && nc === 0 ? 'neg' : null);
    setClk(nc);
  };

  const FF: React.FC<{ x: number; neg: boolean; on: boolean; label: string }> = ({ x, neg, on, label }) => (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 110 90" className="w-[96px] sm:w-[130px]">
        <rect x="34" y="14" width="52" height="62" rx="8" fill={on ? `${ACC.good}22` : box} stroke={on ? ACC.good : accent} strokeWidth="2.5" />
        <text x="60" y="40" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="800" fill={on ? ACC.good : accent}>FF</text>
        <text x="60" y="54" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={dim}>{label}</text>
        {/* clock input with edge triangle (+ bubble if negative) */}
        <line x1={neg ? 22 : 6} y1="66" x2="34" y2="66" stroke={dim} strokeWidth="2.4" />
        <path d="M34,60 L44,66 L34,72 Z" fill="none" stroke={on ? ACC.good : (isDarkMode ? '#94a3b8' : '#475569')} strokeWidth="1.8" />
        {neg && <circle cx="18" cy="66" r="4.5" fill={box} stroke={isDarkMode ? '#94a3b8' : '#475569'} strokeWidth="1.8" />}
        {/* output */}
        <line x1="86" y1="34" x2="106" y2="34" stroke={on ? ACC.good : dim} strokeWidth="3" />
      </svg>
      <span className="font-mono text-[11px] font-black" style={{ color: on ? ACC.good : t.faint as string }}>
        {on ? (lang === 'hi' ? '▲ captured' : '▲ captured') : (lang === 'hi' ? 'idle' : 'idle')}
      </span>
    </div>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'edge polarity · clock toggle कीजिए' : 'edge polarity · toggle the clock'}
      </div>
      <div className="flex items-center justify-around gap-3">
        <FF x={clk} neg={false} on={fired === 'pos'} label={lang === 'hi' ? 'positive' : 'positive'} />
        <div className="flex flex-col items-center gap-2">
          <span className={`font-mono text-[11px] ${t.faint}`}>CLK</span>
          <button onClick={toggle}
            className="flex h-12 w-12 items-center justify-center rounded-xl font-mono text-xl font-black active:scale-90"
            style={{ background: clk ? accent : 'transparent', color: clk ? '#000' : accent, border: `2.5px solid ${accent}` }}>{clk}</button>
          <span className={`font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? '0<->1 दबाइए' : 'tap 0<->1'}</span>
        </div>
        <FF x={clk} neg on={fired === 'neg'} label={lang === 'hi' ? 'negative' : 'negative'} />
      </div>
      <p className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
        {fired === 'pos'
          ? (lang === 'hi' ? <>0{'->'}1 rising edge {'->'} <b style={{ color: ACC.good }}>positive-edge FF captured</b></> : <>0{'->'}1 rising edge {'->'} <b style={{ color: ACC.good }}>positive-edge FF captured</b></>)
          : fired === 'neg'
            ? (lang === 'hi' ? <>1{'->'}0 falling edge {'->'} <b style={{ color: ACC.good }}>negative-edge FF captured</b> (bubble)</> : <>1{'->'}0 falling edge {'->'} <b style={{ color: ACC.good }}>negative-edge FF captured</b> (bubble)</>)
            : (lang === 'hi' ? 'clock toggle कीजिए — सिर्फ़ मेल खाती polarity fire करती है' : 'toggle the clock — only the matching polarity fires')}
      </p>
    </Card>
  );
};

/* ───────── bespoke: master-slave (two latches, opposite phases, live) ─────────
   master transparent when CLK=1, slave transparent when CLK=0; the output moves
   on the falling edge — the pair emulates one clean edge. Computed via effects. */
const MasterSlave: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const [d, setD] = useState(1);
  const [clk, setClk] = useState(0);
  const [mq, setMq] = useState(0);
  const [sq, setSq] = useState(0);
  useEffect(() => { if (clk === 1) setMq(d); }, [clk, d]);   // master open while clk high
  useEffect(() => { if (clk === 0) setSq(mq); }, [clk, mq]); // slave open while clk low
  const masterOpen = clk === 1;

  const Latch: React.FC<{ label: string; open: boolean; q: number; x: number }> = ({ label, open, q, x }) => (
    <g>
      <rect width="62" height="58" rx="8" x="0" y="0" fill={open ? `${accent}1f` : box} stroke={open ? accent : dim} strokeWidth="2.4" />
      <text x="31" y="26" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="800" fill={open ? accent : (t.faint as string)}>{label}</text>
      <text x="31" y="40" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={dim}>{open ? (lang === 'hi' ? 'open' : 'open') : (lang === 'hi' ? 'lock' : 'lock')}</text>
      <text x="31" y="53" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="900" fill={q ? accent : dim}>Q={q}</text>
    </g>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'master-slave · दो latch, उलटी phase' : 'master-slave · two latches, opposite phases'}
      </div>
      <svg viewBox="0 0 320 110" className="mx-auto w-full max-w-xl">
        {/* D in */}
        <line x1="6" y1="34" x2="40" y2="34" stroke={d ? ACC.in : dim} strokeWidth="3" />
        <text x="4" y="26" fontFamily="monospace" fontSize="11" fontWeight="800" fill={d ? ACC.in : dim}>D={d}</text>
        <g transform="translate(40,6)"><Latch label={lang === 'hi' ? 'master' : 'MASTER'} open={masterOpen} q={mq} x={d} /></g>
        {/* master -> slave */}
        <line x1="102" y1="34" x2="150" y2="34" stroke={mq ? accent : dim} strokeWidth="3" />
        <g transform="translate(150,6)"><Latch label={lang === 'hi' ? 'slave' : 'SLAVE'} open={!masterOpen} q={sq} x={mq} /></g>
        {/* Q out */}
        <line x1="212" y1="34" x2="250" y2="34" stroke={sq ? ACC.good : dim} strokeWidth="3" />
        <text x="256" y="38" fontFamily="monospace" fontSize="12" fontWeight="900" fill={sq ? ACC.good : dim}>Q={sq}</text>
        {/* clock to master (plain), clock' to slave (bubble) */}
        <line x1="71" y1="78" x2="71" y2="64" stroke={clk ? accent : dim} strokeWidth="2.2" />
        <line x1="181" y1="78" x2="181" y2="64" stroke={clk ? dim : accent} strokeWidth="2.2" />
        <circle cx="181" cy="82" r="4.5" fill={box} stroke={clk ? dim : accent} strokeWidth="2" />
        <line x1="30" y1="90" x2="260" y2="90" stroke={clk ? accent : dim} strokeWidth="2.2" />
        <text x="4" y="94" fontFamily="monospace" fontSize="10" fontWeight="800" fill={clk ? accent : dim}>CLK={clk}</text>
        <text x="71" y="106" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={t.faint as string}>CLK</text>
        <text x="181" y="106" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={t.faint as string}>CLK'</text>
      </svg>
      <div className="mt-2 flex items-center justify-center gap-4">
        <Toggle label="D" v={d} onClick={() => setD(d ^ 1)} color={ACC.in} />
        <Toggle label="CLK" v={clk} onClick={() => setClk(clk ^ 1)} color={accent} />
      </div>
      <p className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
        {masterOpen
          ? (lang === 'hi'
            ? <>CLK=1: master खुला (D={d} पकड़ता है), slave locked {'->'} output Q={sq} जमा</>
            : <>CLK=1: master open (grabs D={d}), slave locked {'->'} output Q={sq} held</>)
          : (lang === 'hi'
            ? <>CLK=0: master locked, slave खुला {'->'} पकड़ा मान बाहर, Q=<b style={{ color: ACC.good }}>{sq}</b></>
            : <>CLK=0: master locked, slave open {'->'} the captured value passes out, Q=<b style={{ color: ACC.good }}>{sq}</b></>)}
      </p>
      <p className={`mt-1 text-center font-mono text-[11px] ${t.faint}`}>
        {lang === 'hi' ? 'दोनों कभी एक साथ खुले नहीं (phase isolation) — इसलिए कोई race नहीं।' : 'the two are never open together (phase isolation) — so no race.'}
      </p>
    </Card>
  );
};

/* ───────── bespoke: JK -> D / JK -> T conversion proof (computed) ─────────
   Wire J,K from the target input and check that the JK next state equals the
   target flip-flop's next state for both present states. */
const JKConversion: React.FC<{ isDarkMode: boolean; accent: string; target: 'D' | 'T' }> = ({ isDarkMode, accent, target }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const [x, setX] = useState(1);                     // the D or T input
  const J = x;
  const K = target === 'D' ? (x ^ 1) : x;            // D: K=D' ; T: K=T
  const rows: (string | number)[][] = [0, 1].map((q) => {
    const jk = ffNext('JK', q, J, K);
    const tgt = ffNext(target, q, x);
    return [q, J, K, jk, tgt, jk === tgt ? '=' : '≠'];
  });
  const allMatch = rows.every((r) => r[5] === '=');
  const mapText = target === 'D'
    ? (lang === 'hi' ? 'J = D, K = D\'' : 'J = D, K = D\'')
    : (lang === 'hi' ? 'J = K = T' : 'J = K = T');

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {`JK -> ${target} · ${mapText}`}
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
        {/* wiring: X feeds J directly; K = X' (D) via inverter, or K = X (T) */}
        <svg viewBox="0 0 170 96" className="w-full max-w-[240px]">
          <line x1="4" y1="48" x2="30" y2="48" stroke={x ? ACC.in : dim} strokeWidth="3" />
          <text x="2" y="40" fontFamily="monospace" fontSize="11" fontWeight="800" fill={x ? ACC.in : dim}>{target}={x}</text>
          {/* J wire (straight up) */}
          <line x1="30" y1="48" x2="30" y2="26" stroke={J ? ACC.in : dim} strokeWidth="2.4" />
          <line x1="30" y1="26" x2="96" y2="26" stroke={J ? ACC.in : dim} strokeWidth="2.4" />
          <text x="60" y="20" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>J={J}</text>
          {/* K wire */}
          {target === 'D' ? (
            <>
              <line x1="30" y1="48" x2="42" y2="48" stroke={x ? ACC.in : dim} strokeWidth="2.4" />
              <path d="M42,40 L42,56 L58,48 Z" fill={box} stroke={accent} strokeWidth="2" />
              <circle cx="61" cy="48" r="3.5" fill={box} stroke={accent} strokeWidth="2" />
              <text x="50" y="66" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={dim}>NOT</text>
              <line x1="65" y1="48" x2="80" y2="48" stroke={K ? ACC.in : dim} strokeWidth="2.4" />
              <line x1="80" y1="48" x2="80" y2="66" stroke={K ? ACC.in : dim} strokeWidth="2.4" />
              <line x1="80" y1="66" x2="96" y2="66" stroke={K ? ACC.in : dim} strokeWidth="2.4" />
            </>
          ) : (
            <>
              <line x1="30" y1="48" x2="30" y2="66" stroke={K ? ACC.in : dim} strokeWidth="2.4" />
              <line x1="30" y1="66" x2="96" y2="66" stroke={K ? ACC.in : dim} strokeWidth="2.4" />
            </>
          )}
          <text x="72" y="80" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={t.faint as string}>K={K}</text>
          {/* JK box */}
          <rect x="96" y="14" width="46" height="66" rx="7" fill={box} stroke={accent} strokeWidth="2.4" />
          <text x="119" y="50" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="800" fill={accent}>JK</text>
          <line x1="142" y1="34" x2="166" y2="34" stroke={accent} strokeWidth="3" />
          <text x="150" y="28" fontFamily="monospace" fontSize="9" fill={t.faint as string}>Q+</text>
        </svg>
        <div className="flex items-center gap-4">
          <Toggle label={target} v={x} onClick={() => setX(x ^ 1)} color={ACC.in} />
          {target === 'D' && (
            <div className="flex flex-col items-center gap-1">
              <span className={`font-mono text-[10px] ${t.faint}`}>K = D'</span>
              <LiveGate type="NOT" a={x} isDarkMode={isDarkMode} accent={accent} labelA="D" labelOut="K" />
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <StateTable isDarkMode={isDarkMode} accent={accent}
          headers={['Q(t)', 'J', 'K', 'JK Q+', `${target} Q+`, '?']}
          rows={rows}
          note={target === 'D'
            ? "J·Q' + K'·Q = D·Q' + D·Q = D  ->  a D flip-flop"
            : "J·Q' + K'·Q = T·Q' + T'·Q = T ⊕ Q  ->  a T flip-flop"} />
      </div>
      <p className={`mt-3 flex items-center justify-center gap-2 text-center font-mono text-[13px] ${t.sub}`}>
        {allMatch ? <Check size={15} style={{ color: ACC.good }} /> : <X size={15} style={{ color: ACC.in2 }} />}
        {lang === 'hi'
          ? <>दोनों present states पर JK का next state {target} के बराबर — <b style={{ color: ACC.good }}>conversion सिद्ध</b></>
          : <>for both present states the JK next state equals the {target}'s — <b style={{ color: ACC.good }}>conversion proven</b></>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: application map + live divide-by-two ───────── */
const AppMap: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const APPS: { type: FFType; en: string; hi: string }[] = [
    { type: 'D', en: 'Registers, shift registers & static RAM (data storage)', hi: 'Registers, shift registers और static RAM (data storage)' },
    { type: 'T', en: 'Binary counters & frequency dividers', hi: 'Binary counters और frequency dividers' },
    { type: 'JK', en: 'Control logic & finite-state machines', hi: 'Control logic और finite-state machines' },
    { type: 'SR', en: 'Switch debounce / simple set-reset control', hi: 'Switch debounce / सादा set-reset control' },
  ];
  const [sel, setSel] = useState<FFType>('T');

  // live divide-by-two: a T=1 stage toggles once per rising edge -> half frequency
  const N = 12;
  const clk = Array.from({ length: N }, (_, i) => i % 2);
  const q: number[] = []; let cur = 0;
  for (let i = 0; i < N; i++) { if (i > 0 && clk[i] === 1 && clk[i - 1] === 0) cur = ffNext('T', cur, 1); q.push(cur); }

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'हर type का घर · type चुनिए' : 'each type and its home · pick a type'}
        </div>
        <div className="space-y-2">
          {APPS.map((a) => {
            const on = a.type === sel;
            return (
              <button key={a.type} onClick={() => setSel(a.type)}
                className="flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors active:scale-[0.99]"
                style={on ? { borderColor: accent, background: `${accent}12` } : { borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                <span className="flex h-9 w-11 flex-shrink-0 items-center justify-center rounded-lg font-mono text-[13px] font-black"
                  style={{ background: on ? accent : 'transparent', color: on ? '#000' : accent, border: `2px solid ${accent}${on ? '' : '55'}` }}>{a.type}</span>
                <span className={`hidden font-mono text-[11px] sm:inline ${t.faint}`}>{FF_META[a.type].eq}</span>
                <ArrowRight size={14} className="flex-shrink-0 opacity-40" />
                <span className={`flex-1 text-[13px] font-bold ${on ? t.text : t.sub}`}>{lang === 'hi' ? a.hi : a.en}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card isDarkMode={isDarkMode}>
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'live: T=1 stage clock को ÷2 करता है' : 'live: a T=1 stage divides the clock by 2'}
        </div>
        <TimingDiagram isDarkMode={isDarkMode} accent={accent}
          signals={[{ name: 'Q ÷2', values: q, color: ACC.good }]} showClock />
        <p className={`mt-2 text-center font-mono text-[12px] ${t.sub}`}>
          {lang === 'hi'
            ? 'Q हर rising edge पर पलटता है, तो यह input की आधी frequency पर चलता है — यही binary counter का बीज है।'
            : 'Q flips on every rising edge, so it runs at exactly half the input frequency — the seed of every binary counter.'}
        </p>
      </Card>
    </div>
  );
};

/* ───────── bespoke: the turnstile analogy (live, edge = one advance per tick) ───────── */
const Turnstile: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const [count, setCount] = useState(0);
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'turnstile · हर tick पर एक advance' : 'turnstile · one advance per tick'}
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
        <svg viewBox="0 0 120 120" className="w-[150px]">
          <circle cx="60" cy="60" r="46" fill="none" stroke={dim} strokeWidth="2" strokeDasharray="3 4" />
          <motion.g animate={{ rotate: count * 90 }} transition={{ type: 'spring', stiffness: 120, damping: 12 }}
            style={{ transformOrigin: '60px 60px' }}>
            {[0, 90, 180, 270].map((deg) => (
              <line key={deg} x1="60" y1="60"
                x2={60 + 44 * Math.cos((deg * Math.PI) / 180)}
                y2={60 + 44 * Math.sin((deg * Math.PI) / 180)}
                stroke={accent} strokeWidth="5" strokeLinecap="round" />
            ))}
          </motion.g>
          <circle cx="60" cy="60" r="9" fill={accent} />
          <Users x={51} y={4} size={16} color={accent} />
        </svg>
        <div className="flex flex-col items-center gap-1">
          <span className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'लोग गुज़रे' : 'people through'}</span>
          <span className="font-mono text-4xl font-black tabular-nums" style={{ color: accent }}>{count}</span>
        </div>
      </div>
      <div className="mt-4"><ClockButton accent={accent} onTick={() => setCount((c) => c + 1)} /></div>
      <p className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
        {lang === 'hi'
          ? <>हर CLK ▲ एक धक्का = ठीक एक व्यक्ति पार ({count})। एक खुला दरवाज़ा (level latch) भीड़ बहा देता — turnstile edge हर tick एक ही देता है।</>
          : <>each CLK ▲ is one push = exactly one person through ({count}). A propped-open door (a level latch) would let a crowd stream by — the turnstile edge admits just one per tick.</>}
      </p>
    </Card>
  );
};

/* ───────── part assignment ───────── */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE IDEA'
    : i <= Math.floor(n * 0.55) ? 'PART II · THE FLIP-FLOPS'
      : i < n - 3 ? 'PART III · PUT IT TO WORK'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  switch (scene.id) {
    case 'S02_Facts': return 'facts';
    case 'S03_Edge': return 'edge';
    case 'S04_SR': return 'sr';
    case 'S05_JK': return 'jk';
    case 'S06_D': return 'd';
    case 'S07_T': return 't';
    case 'S08_Apps': return 'apps';
    case 'S09_Analogy': return 'analogy';
    case 'S10_Build': return 'build';
    default: return null;
  }
};

function componentFor(scene: SubScene, _i: number, _n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle}
        kicker="Flip-Flops · Edge-Triggered Memory"
        hero={<FlipFlopViz isDarkMode={p.isDarkMode} accent={p.accent} type="JK" />} />;
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
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="FF" tag="Practice · Flip-Flops" title={scene.label} intro={scene.subtitle ?? ''} />
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
              <WindowVsEdge isDarkMode={p.isDarkMode} accent={p.accent} />
              <EdgeMarkers isDarkMode={p.isDarkMode} accent={p.accent} />
              <EdgeVsLevel isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'edge' && (
            <div className="space-y-6">
              <TryItYourself />
              <EdgePolarity isDarkMode={p.isDarkMode} accent={p.accent} />
              <MasterSlave isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'sr' && (
            <div className="space-y-6">
              <TryItYourself />
              <FlipFlopViz isDarkMode={p.isDarkMode} accent={p.accent} type="SR" />
              <CharTable isDarkMode={p.isDarkMode} accent={p.accent} type="SR" />
            </div>
          )}
          {which === 'jk' && (
            <div className="space-y-6">
              <TryItYourself />
              <FlipFlopViz isDarkMode={p.isDarkMode} accent={p.accent} type="JK" />
              <CharTable isDarkMode={p.isDarkMode} accent={p.accent} type="JK" />
            </div>
          )}
          {which === 'd' && (
            <div className="space-y-6">
              <TryItYourself />
              <FlipFlopViz isDarkMode={p.isDarkMode} accent={p.accent} type="D" />
              <CharTable isDarkMode={p.isDarkMode} accent={p.accent} type="D" />
              <JKConversion isDarkMode={p.isDarkMode} accent={p.accent} target="D" />
            </div>
          )}
          {which === 't' && (
            <div className="space-y-6">
              <TryItYourself />
              <FlipFlopViz isDarkMode={p.isDarkMode} accent={p.accent} type="T" />
              <CharTable isDarkMode={p.isDarkMode} accent={p.accent} type="T" />
              <JKConversion isDarkMode={p.isDarkMode} accent={p.accent} target="T" />
            </div>
          )}
          {which === 'apps' && (
            <div className="space-y-6">
              <TryItYourself />
              <AppMap isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'analogy' && (
            <div className="space-y-6">
              <TryItYourself />
              <Turnstile isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="jk-flipflop"
              titleEN="Build a JK flip-flop for real"
              titleHI="असली में एक JK flip-flop बनाइए"
              bodyEN="Open the live workbench and wire an edge-triggered JK from its equation Q(t+1)=J·Q'+K'·Q, then prove hold, set, reset and the toggle (J=K=1 flips Q every tick)."
              bodyHI="live workbench खोलिए और इसके equation Q(t+1)=J·Q'+K'·Q से एक edge-triggered JK wire कीजिए, फिर hold, set, reset और toggle साबित कीजिए (J=K=1 हर tick पर Q पलटता है)।" />
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
