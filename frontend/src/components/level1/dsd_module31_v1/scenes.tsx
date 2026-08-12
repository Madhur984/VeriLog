/**
 * Flip-Flop Timing & Race-Around - dsd/31, "The Clock's Deadlines"
 * (Sequential Logic track). Generic scenes come from the shared _subtractor kit;
 * ClockWave / Toggle / ClockButton / StateTable / ffNext come from the shared
 * _sequential/blocks library. The setup/hold capture-window hero, the timing-
 * anatomy waveform, the draggable setup/hold violation demo, the live Tc / f_max
 * calculator, the generated race-around oscillation, the two-phase master-slave
 * SVG, the prevention-methods table and the relay-race baton analogy are bespoke.
 * EVERY displayed value (captured bit, violation verdict, Tc, f_max, toggle count,
 * final Q, master/slave outputs) is COMPUTED in code, never hardcoded.
 */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Timer, Check, X, Zap } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import {
  ClockWave, Toggle, ClockButton, StateTable, ffNext,
} from '../_sequential/blocks';
import { CustomVideoPlayer } from '../../ui/CustomVideoPlayer';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const ACC = { in: '#38bdf8', in2: '#fb7185', good: '#34d399', warn: '#f59e0b' };
const SRC_EN: string | undefined = '/videos/dsd31-timing.mp4';
const SRC_RACE: string | undefined = '/videos/dsd31-race-around.mp4';

/* ───────── bespoke cover hero: the setup/hold capture window (live) ─────────
   A rising clock edge with a shaded setup window before it and a hold window
   after it. The data settles before the window, stays steady across the aperture,
   and the flip-flop captures it at the edge - Q updates each tick (computed). */
const CaptureWindow: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTick((v) => v + 1), 1700);
    return () => clearInterval(id);
  }, [playing]);
  const D = tick % 2;            // data bit alternates each capture cycle
  const Q = D;                   // captured cleanly at the edge (computed)

  // geometry (px)
  const E = 184;                 // clock edge x
  const su = 46, h = 26, pcq = 34;
  const yHi = 30, yLo = 66;
  const dY = D ? yHi : yLo;      // data level through the aperture
  const qY = Q ? yHi : yLo;      // output level after t_pcq

  return (
    <button
      type="button"
      onClick={() => (playing ? setPlaying(false) : setTick((v) => v + 1))}
      onDoubleClick={() => setPlaying(true)}
      title="tap to pause / step · double-tap to play"
      className={`relative mx-auto block w-full max-w-2xl overflow-hidden rounded-3xl border p-6 text-left ${t.card}`}
    >
      <div className="mb-2 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        <Timer size={14} /> {lang === 'hi' ? 'setup / hold capture window' : 'setup / hold capture window'}
      </div>
      <svg viewBox="0 0 340 130" className="mx-auto w-full">
        {/* setup window (before edge) + hold window (after edge) */}
        <rect x={E - su} y="8" width={su} height="86" fill={`${ACC.in}1e`} stroke={`${ACC.in}88`} strokeWidth="1.2" strokeDasharray="4 3" />
        <rect x={E} y="8" width={h} height="86" fill={`${ACC.in2}1e`} stroke={`${ACC.in2}88`} strokeWidth="1.2" strokeDasharray="4 3" />
        <text x={E - su / 2} y="104" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill={ACC.in}>t_su</text>
        <text x={E + h / 2} y="104" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill={ACC.in2}>t_h</text>

        {/* CLK track: low then rising edge at E then high */}
        <text x="6" y="24" fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>CLK</text>
        <path d={`M28,40 H${E} V16 H320`} fill="none" stroke={accent} strokeWidth="2.6" strokeLinejoin="round" transform="translate(0,-2)" />
        <line x1={E} y1="6" x2={E} y2="118" stroke={ACC.good} strokeWidth="1.6" strokeDasharray="3 2" />

        {/* DATA track: settles to D before the setup window, steady through aperture */}
        <text x="6" y="52" fontFamily="monospace" fontSize="9" fontWeight="800" fill={ACC.in}>D</text>
        <motion.path key={`d${tick}`} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}
          d={`M28,${D ? yLo : yHi} H${E - su - 22} V${dY} H320`} fill="none" stroke={ACC.in} strokeWidth="2.6" strokeLinejoin="round" />

        {/* Q track: holds, then changes t_pcq after the edge to the captured value */}
        <text x="6" y="82" fontFamily="monospace" fontSize="9" fontWeight="800" fill={ACC.good}>Q</text>
        <motion.path key={`q${tick}`} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }}
          d={`M28,${Q ? yLo : yHi} H${E + pcq} V${qY} H320`} fill="none" stroke={ACC.good} strokeWidth="2.6" strokeLinejoin="round" />
        <line x1={E} y1="90" x2={E + pcq} y2="90" stroke={ACC.good} strokeWidth="1" />
        <text x={E + pcq / 2} y="88" textAnchor="middle" fontFamily="monospace" fontSize="7" fontWeight="800" fill={ACC.good}>t_pcq</text>

        {/* capture flash at the edge */}
        <motion.circle key={`f${tick}`} cx={E} cy="16" r="5" fill={ACC.good}
          initial={{ scale: 0.4, opacity: 1 }} animate={{ scale: [0.4, 2.4], opacity: [1, 0] }} transition={{ duration: 0.9 }} />
      </svg>

      <div className="mt-2 flex items-center justify-center gap-3">
        <span className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'edge पर पकड़ा' : 'captured at the edge'}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-lg font-black"
          style={{ background: Q ? ACC.good : box, color: Q ? '#000' : ACC.good, border: `2px solid ${ACC.good}` }}>{Q}</span>
      </div>
      <div className={`mt-2 text-center font-mono text-[10px] uppercase tracking-[0.3em] ${t.faint}`}>
        {playing ? (lang === 'hi' ? 'live · tap to pause' : 'live · tap to pause') : (lang === 'hi' ? 'paused · tap to step' : 'paused · tap to step')}
      </div>
    </button>
  );
};

/* ───────── bespoke: timing anatomy waveform (S02) ─────────
   ClockWave decoration + a bespoke annotated single-edge diagram, plus a table
   of the three numbers. Geometry is computed from the numeric window widths. */
const TimingAnatomy: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const E = 190, su = 52, h = 28, pcq = 40;
  const yC = 26, dHi = 66, dLo = 92, qHi = 112, qLo = 138;

  const rows: (string | number)[][] = [
    ['t_su', lang === 'hi' ? 'setup time' : 'setup time', lang === 'hi' ? 'edge से पहले data स्थिर' : 'data stable BEFORE the edge'],
    ['t_h', lang === 'hi' ? 'hold time' : 'hold time', lang === 'hi' ? 'edge के बाद data स्थिर' : 'data stable AFTER the edge'],
    ['t_pcq', lang === 'hi' ? 'clock-to-Q' : 'clock-to-Q', lang === 'hi' ? 'edge के बाद Q valid बनता है' : 'Q becomes valid AFTER the edge'],
  ];

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'clock — कई cycles' : 'the clock — several cycles'}
        </div>
        <ClockWave isDarkMode={isDarkMode} accent={accent} cycles={4} edge="rising" />
      </Card>

      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'एक edge के आसपास तीन संख्याएँ' : 'three numbers around one edge'}
        </div>
        <svg viewBox="0 0 340 160" className="mx-auto w-full max-w-xl">
          {/* setup + hold shaded windows spanning data + output rows */}
          <rect x={E - su} y="14" width={su} height="132" fill={`${ACC.in}18`} stroke={`${ACC.in}77`} strokeWidth="1.1" strokeDasharray="4 3" />
          <rect x={E} y="14" width={h} height="132" fill={`${ACC.in2}18`} stroke={`${ACC.in2}77`} strokeWidth="1.1" strokeDasharray="4 3" />
          <text x={E - su / 2} y="10" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill={ACC.in}>t_su</text>
          <text x={E + h / 2} y="10" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill={ACC.in2}>t_h</text>

          {/* CLK */}
          <text x="4" y={yC + 4} fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>CLK</text>
          <path d={`M30,${yC + 14} H${E} V${yC - 6} H330`} fill="none" stroke={accent} strokeWidth="2.4" strokeLinejoin="round" />
          <line x1={E} y1="14" x2={E} y2="146" stroke={ACC.good} strokeWidth="1.5" strokeDasharray="3 2" />
          <path d={`M${E - 5},${yC} L${E},${yC - 8} L${E + 5},${yC}`} fill="none" stroke={ACC.good} strokeWidth="1.8" />

          {/* DATA: settled before the setup window, steady through the aperture */}
          <text x="4" y={dHi + 4} fontFamily="monospace" fontSize="9" fontWeight="800" fill={ACC.in}>D</text>
          <path d={`M30,${dLo} H${E - su - 24} V${dHi} H330`} fill="none" stroke={ACC.in} strokeWidth="2.4" strokeLinejoin="round" />

          {/* Q: changes t_pcq after the edge */}
          <text x="4" y={qHi + 4} fontFamily="monospace" fontSize="9" fontWeight="800" fill={ACC.good}>Q</text>
          <path d={`M30,${qLo} H${E + pcq} V${qHi} H330`} fill="none" stroke={ACC.good} strokeWidth="2.4" strokeLinejoin="round" />
          <line x1={E} y1={qHi - 8} x2={E + pcq} y2={qHi - 8} stroke={ACC.good} strokeWidth="1" />
          <path d={`M${E + pcq - 5},${qHi - 11} L${E + pcq},${qHi - 8} L${E + pcq - 5},${qHi - 5}`} fill="none" stroke={ACC.good} strokeWidth="1.4" />
          <text x={E + pcq / 2} y={qHi - 12} textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill={ACC.good}>t_pcq</text>

          <line x1="30" y1="150" x2="330" y2="150" stroke={dim} strokeWidth="0.5" />
        </svg>
        <p className={`mt-2 text-center font-mono text-[12px] ${t.sub}`}>
          {lang === 'hi'
            ? 'data को नीले setup और गुलाबी hold window भर स्थिर रहना है; Q, edge के t_pcq बाद बदलता है।'
            : 'the data must stay steady across the blue setup and pink hold windows; Q changes t_pcq after the edge.'}
        </p>
      </Card>

      <StateTable isDarkMode={isDarkMode} accent={accent}
        headers={[lang === 'hi' ? 'चिह्न' : 'symbol', lang === 'hi' ? 'अर्थ' : 'meaning', lang === 'hi' ? 'नियम' : 'rule']}
        rows={rows}
        note={lang === 'hi' ? 'तीनों datasheet पर छपी होती हैं; आम मान sub-ns से कुछ ns।' : 'all three are printed on the datasheet; typical values sub-ns to a few ns.'} />
    </div>
  );
};

/* ───────── bespoke: setup/hold violation demo (S03) ─────────
   Drag the data transition across the timeline. If it lands inside the aperture
   [edge - t_su, edge + t_h] the verdict is metastable; before it, Q captures the
   new value; after it, Q holds the old value. All computed from the slider. */
const SetupHoldDemo: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const dim = isDarkMode ? '#334155' : '#cbd5e1';

  const EDGE = 50;              // edge position on a 0..100 scale
  const SU = 14, HD = 9;        // setup / hold widths (scale units)
  const [p, setP] = useState(24); // data-transition position (0..100)

  const inSetup = p > EDGE - SU && p < EDGE;
  const inHold = p >= EDGE && p < EDGE + HD;
  const violation = inSetup || inHold;
  // data rises 0 -> 1 at position p. Clean-new if it settled before the window,
  // clean-old if it changes after the window, metastable if inside it.
  const verdict: 'new' | 'old' | 'meta' = violation ? 'meta' : p <= EDGE - SU ? 'new' : 'old';
  const Qval = verdict === 'new' ? 1 : verdict === 'old' ? 0 : -1;

  // px mapping
  const X0 = 24, X1 = 316, W = X1 - X0;
  const sx = (v: number) => X0 + (v / 100) * W;
  const yHi = 34, yLo = 74;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'setup/hold violation · data edge सरकाइए' : 'setup/hold violation · slide the data edge'}
      </div>
      <svg viewBox="0 0 340 110" className="mx-auto w-full max-w-xl">
        {/* aperture windows */}
        <rect x={sx(EDGE - SU)} y="12" width={sx(EDGE) - sx(EDGE - SU)} height="72" fill={`${ACC.in}1c`} stroke={`${ACC.in}77`} strokeWidth="1" strokeDasharray="4 3" />
        <rect x={sx(EDGE)} y="12" width={sx(EDGE + HD) - sx(EDGE)} height="72" fill={`${ACC.in2}1c`} stroke={`${ACC.in2}77`} strokeWidth="1" strokeDasharray="4 3" />
        <text x={(sx(EDGE - SU) + sx(EDGE)) / 2} y="96" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill={ACC.in}>t_su</text>
        <text x={(sx(EDGE) + sx(EDGE + HD)) / 2} y="96" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill={ACC.in2}>t_h</text>

        {/* clock edge marker */}
        <line x1={sx(EDGE)} y1="8" x2={sx(EDGE)} y2="86" stroke={ACC.good} strokeWidth="1.6" strokeDasharray="3 2" />
        <text x={sx(EDGE)} y="107" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill={ACC.good}>{lang === 'hi' ? 'CLK edge' : 'CLK edge'}</text>

        {/* data waveform: 0 until p, then 1 (rising transition at p) */}
        <path d={`M${X0},${yLo} H${sx(p)} V${yHi} H${X1}`} fill="none"
          stroke={violation ? ACC.in2 : ACC.in} strokeWidth="2.6" strokeLinejoin="round" />
        {/* the moving transition handle */}
        <motion.circle cx={sx(p)} cy={(yHi + yLo) / 2} r="6" fill={violation ? ACC.in2 : ACC.in}
          animate={violation ? { scale: [1, 1.25, 1] } : { scale: 1 }} transition={{ repeat: violation ? Infinity : 0, duration: 0.5 }} />
        <text x={sx(p)} y="10" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={t.faint as string}>D↑</text>
      </svg>

      <input type="range" min={0} max={100} value={p} onChange={(e) => setP(Number(e.target.value))}
        className="mt-2 w-full" style={{ accentColor: accent }} aria-label="data transition position" />

      <div className="mt-4 flex items-center justify-center gap-3">
        <span className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'output Q' : 'output Q'}</span>
        <motion.span key={`${verdict}`} initial={{ scale: 0.8, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }}
          className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-xl font-black"
          style={verdict === 'meta'
            ? { color: ACC.in2, border: `2px solid ${ACC.in2}` }
            : { background: Qval ? ACC.good : box, color: Qval ? '#000' : ACC.good, border: `2px solid ${ACC.good}` }}>
          {verdict === 'meta'
            ? <motion.span animate={{ x: [-1.5, 1.5, -1.5], y: [1, -1, 1] }} transition={{ repeat: Infinity, duration: 0.22 }}>?</motion.span>
            : Qval}
        </motion.span>
      </div>

      <p className={`mt-3 flex items-center justify-center gap-2 text-center font-mono text-[13px] ${t.sub}`}>
        {verdict === 'meta'
          ? <><X size={15} style={{ color: ACC.in2 }} />
            <span style={{ color: ACC.in2 }}>{lang === 'hi'
              ? `${inSetup ? 'SETUP' : 'HOLD'} violation → metastable: Q अपरिभाषित`
              : `${inSetup ? 'SETUP' : 'HOLD'} violation → metastable: Q is undefined`}</span></>
          : <><Check size={15} style={{ color: ACC.good }} />
            <span>{verdict === 'new'
              ? (lang === 'hi' ? <>data window से पहले settle हुआ → साफ़ capture, Q = <b style={{ color: ACC.good }}>1</b></> : <>data settled before the window → clean capture, Q = <b style={{ color: ACC.good }}>1</b></>)
              : (lang === 'hi' ? <>data window के बाद बदला → पुराना मान पकड़ा, Q = <b style={{ color: ACC.good }}>0</b></> : <>data changed after the window → old value held, Q = <b style={{ color: ACC.good }}>0</b></>)}</span></>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: Tc / f_max calculator (S04) ─────────
   Steppers for t_pcq, t_pd, t_su (ns). Tc = sum, f_max = 1000 / Tc (MHz). The
   period bar splits into the three contributions in proportion. All computed. */
const Stepper: React.FC<{ label: string; sub: string; v: number; set: (n: number) => void; color: string; min?: number; max?: number; isDarkMode: boolean }>
  = ({ label, sub, v, set, color, min = 1, max = 20, isDarkMode }) => {
  const t = tone(isDarkMode);
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-[11px] font-black" style={{ color }}>{label}</span>
      <div className="flex items-center gap-1.5">
        <button onClick={() => set(Math.max(min, v - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-lg font-black active:scale-90"
          style={{ color, border: `2px solid ${color}66` }}>−</button>
        <span className="flex h-9 w-12 items-center justify-center rounded-lg font-mono text-base font-black tabular-nums"
          style={{ background: `${color}1a`, color, border: `2px solid ${color}` }}>{v}</span>
        <button onClick={() => set(Math.min(max, v + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-lg font-black active:scale-90"
          style={{ color, border: `2px solid ${color}66` }}>+</button>
      </div>
      <span className={`font-mono text-[9px] ${t.faint}`}>{sub}</span>
    </div>
  );
};

const FmaxCalculator: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [tpcq, setTpcq] = useState(2);
  const [tpd, setTpd] = useState(5);
  const [tsu, setTsu] = useState(1);
  const Tc = tpcq + tpd + tsu;                 // ns (computed)
  const fmax = Math.round((1000 / Tc) * 10) / 10; // MHz (computed)

  const segs = [
    { lbl: 't_pcq', v: tpcq, c: ACC.in },
    { lbl: 't_pd', v: tpd, c: ACC.warn },
    { lbl: 't_su', v: tsu, c: ACC.in2 },
  ];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'f_max calculator · संख्याएँ नज़ कीजिए' : 'f_max calculator · nudge the numbers'}
      </div>
      <div className="mb-5 flex flex-wrap items-start justify-center gap-5">
        <Stepper label="t_pcq" sub={lang === 'hi' ? 'clock→Q (ns)' : 'clock→Q (ns)'} v={tpcq} set={setTpcq} color={ACC.in} isDarkMode={isDarkMode} />
        <Stepper label="t_pd" sub={lang === 'hi' ? 'logic path (ns)' : 'logic path (ns)'} v={tpd} set={setTpd} color={ACC.warn} isDarkMode={isDarkMode} />
        <Stepper label="t_su" sub={lang === 'hi' ? 'setup (ns)' : 'setup (ns)'} v={tsu} set={setTsu} color={ACC.in2} isDarkMode={isDarkMode} />
      </div>

      {/* the period bar, split into the three contributions */}
      <div className="mb-2 flex items-center gap-2 font-mono text-[10px]">
        <span className={t.faint}>{lang === 'hi' ? 'clock period Tc' : 'clock period Tc'}</span>
      </div>
      <div className="flex h-9 w-full overflow-hidden rounded-xl border" style={{ borderColor: `${accent}44` }}>
        {segs.map((s) => (
          <motion.div key={s.lbl} className="flex items-center justify-center font-mono text-[10px] font-black text-black"
            initial={false} animate={{ width: `${(s.v / Tc) * 100}%` }} transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            style={{ background: s.c }}>
            {(s.v / Tc) > 0.14 ? `${s.lbl} ${s.v}` : s.v}
          </motion.div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className={`rounded-2xl border p-4 text-center ${t.soft}`}>
          <div className={`font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>Tc = t_pcq + t_pd + t_su</div>
          <div className="mt-1 font-mono text-3xl font-black tabular-nums" style={{ color: accent }}>{Tc} <span className="text-lg">ns</span></div>
          <div className={`mt-1 font-mono text-[11px] ${t.faint}`}>{tpcq} + {tpd} + {tsu}</div>
        </div>
        <div className="rounded-2xl border p-4 text-center" style={{ borderColor: `${ACC.good}55`, background: `${ACC.good}0d` }}>
          <div className={`font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>f_max = 1 / Tc</div>
          <div className="mt-1 font-mono text-3xl font-black tabular-nums" style={{ color: ACC.good }}>{fmax} <span className="text-lg">MHz</span></div>
          <div className={`mt-1 font-mono text-[11px] ${t.faint}`}>1000 / {Tc} ns</div>
        </div>
      </div>
      <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? <>logic path (t_pd) घटाइए और Tc गिरता है → f_max <b style={{ color: ACC.good }}>चढ़ता</b> है। hold time यहाँ नहीं आता।</>
          : <>shrink the logic path (t_pd) and Tc falls → f_max <b style={{ color: ACC.good }}>rises</b>. Hold time does not enter this formula.</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: race-around oscillation (S05) ─────────
   Level JK, J=K=1, clock held high for width T. Each loop trip costs a gate delay
   tp, so the output toggles floor(T/tp) times inside one pulse. The oscillation is
   GENERATED from tp and T; the final Q = (toggle count) mod 2. */
const RaceAround: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const [tp, setTp] = useState(1);   // gate delay, in tenths of a ns (slider 5..40 -> 0.5..4.0)
  const [T, setT] = useState(8);     // clock-high width (ns)

  const tpNs = tp / 2;               // 0.5 ns steps
  const toggles = tpNs > 0 ? Math.floor(T / tpNs) : 0;   // computed count
  const finalQ = toggles % 2;                            // computed final value
  const chaotic = toggles >= 2;

  // geometry
  const X0 = 30, Xend = 322, yHi = 26, yLo = 62;
  const hiStart = 96, hiEnd = 270;   // pixel span of the clock-high pulse
  const drawN = Math.min(toggles, 44);
  // build the Q oscillation path across the high window
  let qd = `M${X0},${yLo} H${hiStart}`;
  for (let i = 0; i < drawN; i++) {
    const xb = hiStart + ((hiEnd - hiStart) * (i + 1)) / Math.max(drawN, 1);
    const y = i % 2 === 0 ? yHi : yLo;   // toggle i drives Q high on even index
    qd += ` V${y} H${xb}`;
  }
  qd += ` V${finalQ ? yHi : yLo} H${Xend}`;

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'race-around · J=K=1, clock high पकड़ा' : 'race-around · J=K=1, clock held high'}
        </div>
        <svg viewBox="0 0 340 90" className="mx-auto w-full max-w-xl">
          {/* clock: high pulse of width T */}
          <text x="4" y={yHi + 4} fontFamily="monospace" fontSize="9" fontWeight="800" fill={accent}>CLK</text>
          <path d={`M${X0},${yLo} H${hiStart} V${yHi} H${hiEnd} V${yLo} H${Xend}`} fill="none" stroke={accent} strokeWidth="2.2" strokeLinejoin="round" />
          <rect x={hiStart} y="10" width={hiEnd - hiStart} height="70" fill={`${accent}10`} />
          <text x={(hiStart + hiEnd) / 2} y="8" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill={accent}>T = {T} ns</text>
          {/* Q: generated oscillation */}
          <g transform="translate(0,26)">
            <text x="4" y={yHi + 4} fontFamily="monospace" fontSize="9" fontWeight="800" fill={chaotic ? ACC.in2 : ACC.good}>Q</text>
            <path d={qd} fill="none" stroke={chaotic ? ACC.in2 : ACC.good} strokeWidth="2.2" strokeLinejoin="round" />
          </g>
          <line x1={hiEnd} y1="6" x2={hiEnd} y2="84" stroke={dim} strokeWidth="1" strokeDasharray="3 2" />
        </svg>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <div className={`mb-1 flex items-center justify-between font-mono text-[11px] ${t.faint}`}>
              <span>{lang === 'hi' ? 'gate delay tp' : 'gate delay tp'}</span><span style={{ color: ACC.in }}>{tpNs.toFixed(1)} ns</span>
            </div>
            <input type="range" min={1} max={12} value={tp} onChange={(e) => setTp(Number(e.target.value))} className="w-full" style={{ accentColor: ACC.in }} aria-label="gate delay" />
          </div>
          <div>
            <div className={`mb-1 flex items-center justify-between font-mono text-[11px] ${t.faint}`}>
              <span>{lang === 'hi' ? 'clock-high width T' : 'clock-high width T'}</span><span style={{ color: accent }}>{T} ns</span>
            </div>
            <input type="range" min={2} max={16} value={T} onChange={(e) => setT(Number(e.target.value))} className="w-full" style={{ accentColor: accent }} aria-label="pulse width" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[13px]">
          <span className={t.sub}>toggles = floor(T / tp) = floor({T} / {tpNs.toFixed(1)}) = <b style={{ color: chaotic ? ACC.in2 : ACC.good }}>{toggles}</b></span>
          <span className={t.sub}>{lang === 'hi' ? 'अंतिम' : 'final'} Q = {toggles} mod 2 = <b style={{ color: chaotic ? ACC.in2 : ACC.good }}>{finalQ}</b></span>
        </div>
        <p className={`mt-2 text-center font-mono text-[12.5px] ${t.sub}`}>
          {chaotic
            ? (lang === 'hi'
              ? <>tp {'<<'} T → Q एक ही pulse में {toggles} बार पलटता है; असली hardware में अंतिम मान <b style={{ color: ACC.in2 }}>अनिश्चित</b> होता है।</>
              : <>tp {'<<'} T → Q toggles {toggles} times in one pulse; in real hardware the final value is <b style={{ color: ACC.in2 }}>unpredictable</b>.</>)
            : (lang === 'hi'
              ? <>tp, T के क़रीब → एक ही toggle समाता है, तो व्यवहार एक edge जैसा साफ़ है (यही fix की दिशा है)।</>
              : <>tp near T → only one toggle fits, so it behaves cleanly like a single edge (the direction of the fix).</>)}
        </p>
      </Card>

      {/* the race-around clip */}
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'race-around · वीडियो' : 'race-around · clip'}
        </div>
        {SRC_RACE
          ? <CustomVideoPlayer key={SRC_RACE} src={SRC_RACE} accent={accent} className="rounded-2xl border-0" />
          : <p className={`text-center text-sm ${t.faint}`}>{lang === 'hi' ? 'वीडियो जल्द' : 'clip coming soon'}</p>}
      </Card>
    </div>
  );
};

/* ───────── bespoke: master-slave JK (live, computed) + prevention table (S06) ─────────
   Two JK latches on opposite clock phases with the slave output fed back to the
   master inputs. Master captures the JK next-state when clk=1; slave copies the
   master out when clk=0. With J=K=1 the output toggles at most once per full
   clock cycle - no oscillation. Next states come from ffNext('JK', ...). */
const MasterSlaveJK: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const box = isDarkMode ? '#0a0e1a' : '#ffffff';
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const [J, setJ] = useState(1);
  const [K, setK] = useState(1);
  const [clk, setClk] = useState(0);
  const [mq, setMq] = useState(0);   // master latch output
  const [sq, setSq] = useState(0);   // slave latch output = the visible Q

  // master open while clk=1: it computes the JK next-state from the fed-back slave Q.
  useEffect(() => {
    if (clk === 1) {
      const nx = ffNext('JK', sq, J, K);
      setMq(nx === -1 ? sq : nx);
    }
  }, [clk, J, K, sq]);
  // slave open while clk=0: it passes the master's captured value out to Q.
  useEffect(() => {
    if (clk === 0) setSq(mq);
  }, [clk, mq]);

  const masterOpen = clk === 1;

  const Latch: React.FC<{ label: string; open: boolean; q: number }> = ({ label, open, q }) => (
    <g>
      <rect width="64" height="60" rx="8" x="0" y="0" fill={open ? `${accent}1f` : box} stroke={open ? accent : dim} strokeWidth="2.4" />
      <text x="32" y="24" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="800" fill={open ? accent : (t.faint as string)}>{label}</text>
      <text x="32" y="38" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={dim}>{open ? (lang === 'hi' ? 'open' : 'open') : (lang === 'hi' ? 'lock' : 'lock')}</text>
      <text x="32" y="53" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="900" fill={q ? accent : dim}>Q={q}</text>
    </g>
  );

  const preventionRows: (string | number)[][] = [
    [lang === 'hi' ? 'FF delay बढ़ाना' : 'Increase FF delay',
      lang === 'hi' ? 'मुमकिन, भद्दा' : 'possible, clumsy',
      lang === 'hi' ? 'धीमा' : 'slower',
      lang === 'hi' ? 'ख़राब' : 'poor'],
    [lang === 'hi' ? 'clock pulse छोटा करना' : 'Shrink clock pulse',
      lang === 'hi' ? 'कठिन' : 'hard to build',
      lang === 'hi' ? 'ठीक' : 'ok',
      lang === 'hi' ? 'ख़राब' : 'poor'],
    [lang === 'hi' ? 'Master-slave / edge' : 'Master-slave / edge',
      lang === 'hi' ? 'हाँ' : 'yes',
      lang === 'hi' ? 'कोई दंड नहीं' : 'no penalty',
      lang === 'hi' ? '100% fix' : '100% fix'],
  ];

  return (
    <div className="space-y-5">
      <Card isDarkMode={isDarkMode}>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'master-slave JK · उलटी phase, J=K=1' : 'master-slave JK · opposite phases, J=K=1'}
        </div>
        <svg viewBox="0 0 330 128" className="mx-auto w-full max-w-xl">
          {/* J,K in */}
          <line x1="6" y1="24" x2="44" y2="24" stroke={J ? ACC.in : dim} strokeWidth="2.6" />
          <text x="4" y="18" fontFamily="monospace" fontSize="10" fontWeight="800" fill={J ? ACC.in : dim}>J={J}</text>
          <line x1="6" y1="44" x2="44" y2="44" stroke={K ? ACC.in2 : dim} strokeWidth="2.6" />
          <text x="4" y="58" fontFamily="monospace" fontSize="10" fontWeight="800" fill={K ? ACC.in2 : dim}>K={K}</text>

          <g transform="translate(44,6)"><Latch label={lang === 'hi' ? 'MASTER' : 'MASTER'} open={masterOpen} q={mq} /></g>
          {/* master -> slave */}
          <line x1="108" y1="36" x2="158" y2="36" stroke={mq ? accent : dim} strokeWidth="3" />
          <g transform="translate(158,6)"><Latch label={lang === 'hi' ? 'SLAVE' : 'SLAVE'} open={!masterOpen} q={sq} /></g>
          {/* Q out */}
          <line x1="222" y1="36" x2="262" y2="36" stroke={sq ? ACC.good : dim} strokeWidth="3" />
          <text x="266" y="40" fontFamily="monospace" fontSize="12" fontWeight="900" fill={sq ? ACC.good : dim}>Q={sq}</text>

          {/* feedback Q -> inputs (dashed) */}
          <path d={`M262,36 V104 H24 V52`} fill="none" stroke={`${ACC.good}88`} strokeWidth="1.4" strokeDasharray="4 3" />
          <text x="130" y="116" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={t.faint as string}>{lang === 'hi' ? 'feedback Q → inputs' : 'feedback Q → inputs'}</text>

          {/* clock (plain to master, bubble to slave) */}
          <line x1="76" y1="82" x2="76" y2="66" stroke={clk ? accent : dim} strokeWidth="2.2" />
          <line x1="190" y1="82" x2="190" y2="66" stroke={clk ? dim : accent} strokeWidth="2.2" />
          <circle cx="190" cy="86" r="4.5" fill={box} stroke={clk ? dim : accent} strokeWidth="2" />
          <text x="76" y="98" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={t.faint as string}>CLK</text>
          <text x="190" y="98" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={t.faint as string}>CLK'</text>
        </svg>

        <div className="mt-2 flex items-center justify-center gap-4">
          <Toggle label="J" v={J} onClick={() => setJ(J ^ 1)} color={ACC.in} />
          <Toggle label="K" v={K} onClick={() => setK(K ^ 1)} color={ACC.in2} />
          <Toggle label="CLK" v={clk} onClick={() => setClk(clk ^ 1)} color={accent} />
        </div>
        <p className={`mt-3 text-center font-mono text-[12.5px] ${t.sub}`}>
          {masterOpen
            ? (lang === 'hi'
              ? <>CLK=1: master खुला — JK(Q={sq}) से next {ffNext('JK', sq, J, K)} पकड़ता है; slave locked</>
              : <>CLK=1: master open — captures JK next {ffNext('JK', sq, J, K)} from Q={sq}; slave locked</>)
            : (lang === 'hi'
              ? <>CLK=0: master locked; slave खुला → Q=<b style={{ color: ACC.good }}>{sq}</b> बाहर</>
              : <>CLK=0: master locked; slave open → Q=<b style={{ color: ACC.good }}>{sq}</b> out</>)}
        </p>
        <p className={`mt-1 text-center font-mono text-[11px] ${t.faint}`}>
          {lang === 'hi' ? 'J=K=1 पर भी Q हर पूरे cycle में सिर्फ़ एक बार पलटता है — कोई race नहीं (phase isolation)।' : 'even with J=K=1, Q flips just once per full cycle — no race (phase isolation).'}
        </p>
      </Card>

      <div>
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'तीन रोकथाम तरीक़े' : 'three prevention methods'}
        </div>
        <StateTable isDarkMode={isDarkMode} accent={accent}
          headers={[lang === 'hi' ? 'तरीक़ा' : 'method', lang === 'hi' ? 'व्यवहार्य?' : 'feasible?', lang === 'hi' ? 'speed' : 'speed', lang === 'hi' ? 'reliability' : 'reliability']}
          rows={preventionRows} highlight={2}
          note={lang === 'hi' ? 'सिर्फ़ master-slave बिना speed दंड के 100% भरोसेमंद इलाज है।' : 'only master-slave is a 100% reliable fix with no speed penalty.'} />
      </div>
    </div>
  );
};

/* ───────── bespoke: relay-race baton analogy (S07, live) ─────────
   The handoff (clock edge) succeeds only if the baton (data) is held steady
   through the exchange zone (setup + hold). Wobble in the zone = a dropped baton
   = metastability. Success is computed from the 'steady' toggle. */
const BatonRelay: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  const [steady, setSteady] = useState(true);
  const [passes, setPasses] = useState(0);
  const [result, setResult] = useState<'pass' | 'drop' | null>(null);
  const attempt = () => {
    if (steady) { setResult('pass'); setPasses((c) => c + 1); }
    else setResult('drop');
  };

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'relay baton pass · exchange zone = setup + hold' : 'relay baton pass · exchange zone = setup + hold'}
      </div>
      <svg viewBox="0 0 340 120" className="mx-auto w-full max-w-xl">
        {/* track + exchange zone (the aperture) */}
        <line x1="20" y1="90" x2="320" y2="90" stroke={dim} strokeWidth="2" />
        <rect x="130" y="30" width="80" height="66" fill={`${accent}14`} stroke={`${accent}77`} strokeWidth="1.2" strokeDasharray="4 3" />
        <text x="170" y="24" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill={accent}>
          {lang === 'hi' ? 'exchange zone' : 'exchange zone'}
        </text>
        {/* handoff instant (edge) */}
        <line x1="170" y1="26" x2="170" y2="98" stroke={ACC.good} strokeWidth="1.4" strokeDasharray="3 2" />
        <text x="170" y="110" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill={ACC.good}>{lang === 'hi' ? 'handoff = edge' : 'handoff = edge'}</text>
        {/* incoming runner */}
        <circle cx="120" cy="74" r="12" fill={box(isDarkMode)} stroke={ACC.in} strokeWidth="2.4" />
        <text x="120" y="78" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="800" fill={ACC.in}>in</text>
        {/* outgoing runner */}
        <circle cx="220" cy="74" r="12" fill={box(isDarkMode)} stroke={ACC.good} strokeWidth="2.4" />
        <text x="220" y="78" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="800" fill={ACC.good}>out</text>
        {/* the baton */}
        <motion.rect width="26" height="7" rx="3.5"
          fill={steady ? accent : ACC.in2} stroke={steady ? accent : ACC.in2} strokeWidth="1.5"
          initial={false}
          animate={result === 'pass'
            ? { x: [140, 194], y: [64, 64], rotate: 0 }
            : result === 'drop'
              ? { x: [156, 150, 162], y: [64, 82, 96], rotate: [0, 40, 90] }
              : steady ? { x: 157, y: 64, rotate: 0 } : { x: [150, 164, 150], y: 64, rotate: [-8, 8, -8] }}
          transition={result ? { duration: 0.8 } : { repeat: steady ? 0 : Infinity, duration: 0.4 }} />
      </svg>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        <Toggle label={lang === 'hi' ? 'baton' : 'baton'} v={steady ? 1 : 0} onClick={() => { setSteady((s) => !s); setResult(null); }} color={accent}
          sub={steady ? (lang === 'hi' ? 'steady' : 'steady') : (lang === 'hi' ? 'wobble' : 'wobble')} />
        <ClockButton accent={accent} onTick={attempt} canAuto={false} />
        <div className="flex flex-col items-center gap-1">
          <span className={`font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? 'साफ़ pass' : 'clean passes'}</span>
          <span className="font-mono text-2xl font-black tabular-nums" style={{ color: ACC.good }}>{passes}</span>
        </div>
      </div>

      <p className={`mt-3 flex items-center justify-center gap-2 text-center font-mono text-[13px] ${t.sub}`}>
        {result === 'pass'
          ? <><Check size={15} style={{ color: ACC.good }} /><span>{lang === 'hi' ? 'baton exchange zone भर स्थिर → साफ़ handoff (जैसे साफ़ capture)' : 'baton steady through the zone → clean handoff (like a clean capture)'}</span></>
          : result === 'drop'
            ? <><X size={15} style={{ color: ACC.in2 }} /><span style={{ color: ACC.in2 }}>{lang === 'hi' ? 'zone में हिला → baton गिरा = metastability' : 'wobbled in the zone → baton dropped = metastability'}</span></>
            : <span>{lang === 'hi' ? 'baton को steady या wobble कीजिए, फिर handoff आज़माइए।' : 'set the baton steady or wobble, then attempt the handoff.'}</span>}
      </p>
    </Card>
  );
};

// small helper so the analogy SVG can theme its runner fills
function box(isDarkMode: boolean): string { return isDarkMode ? '#0a0e1a' : '#ffffff'; }

/* ───────── part assignment ───────── */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE DEADLINES'
    : i <= 4 ? 'PART II · TIMING & SPEED'
      : i < n - 3 ? 'PART III · RACE-AROUND & THE FIX'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  switch (scene.id) {
    case 'S02_Facts': return 'facts';
    case 'S03_SetupHold': return 'setuphold';
    case 'S04_Fmax': return 'fmax';
    case 'S05_RaceAround': return 'race';
    case 'S06_MasterSlave': return 'master';
    case 'S07_Analogy': return 'analogy';
    case 'S08_Build': return 'build';
    default: return null;
  }
};

function componentFor(scene: SubScene, _i: number, _n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle}
        kicker="Timing & Race-Around · The Clock's Deadlines"
        hero={<CaptureWindow isDarkMode={p.isDarkMode} accent={p.accent} />} />;
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
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="Timing" tag="Practice · Timing & Race-Around" title={scene.label} intro={scene.subtitle ?? ''} />
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
              <TimingAnatomy isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'setuphold' && (
            <div className="space-y-6">
              <TryItYourself />
              <SetupHoldDemo isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'fmax' && (
            <div className="space-y-6">
              <TryItYourself />
              <FmaxCalculator isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'race' && (
            <div className="space-y-6">
              <TryItYourself />
              <RaceAround isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'master' && (
            <div className="space-y-6">
              <TryItYourself />
              <MasterSlaveJK isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'analogy' && (
            <div className="space-y-6">
              <TryItYourself />
              <BatonRelay isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="master-slave-jk"
              titleEN="Build the master-slave JK for real"
              titleHI="असली में master-slave JK बनाइए"
              bodyEN="Open the live workbench and wire two JK latches on opposite clock phases with the slave output fed back to the master inputs. Set J=K=1 and prove the race-around is gone - Q advances by exactly one toggle per full clock."
              bodyHI="live workbench खोलिए और उलटी clock phases पर दो JK latches wire कीजिए, slave output को master inputs पर वापस feed करते हुए। J=K=1 रखिए और साबित कीजिए कि race-around ख़त्म है - Q हर पूरे clock में ठीक एक toggle आगे बढ़ता है।" />
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
