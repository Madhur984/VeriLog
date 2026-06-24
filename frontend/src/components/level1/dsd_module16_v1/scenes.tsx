/**
 * Half Subtractor (dsd/16) - "Binary Parking Logic" with Adarsh the traffic cop.
 * Rebuilt so EVERY page carries an analogy-driven visual (no transcript outside
 * the video page): the variable map, Adarsh's 4-scenario logbook, the live XOR
 * difference gate, the borrow path (NOT then AND), the gate-level blueprint and
 * the animated parking lot. All logic is COMPUTED: D = x XOR y, B = (NOT x) AND y.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Square, ArrowRight, Check, X as XIcon, Zap } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, TruthTable, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene, LiveGate,
  StepThrough,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import { WorkbenchCTA } from '../_subtractor/kit';
import { CONTENT } from './content';

const ACCENTS = { I: '#38bdf8', II: '#f59e0b', III: '#fb7185', good: '#34d399' };

/* the four parking mornings, in logbook order - shared by the grid + builders */
const SCENARIOS = [
  { x: 0, y: 0, en: 'Quiet Day', hi: 'शांत दिन' },
  { x: 1, y: 0, en: 'Empty Spot', hi: 'खाली जगह' },
  { x: 1, y: 1, en: 'Perfect Match', hi: 'सही मेल' },
  { x: 0, y: 1, en: 'The Catch', hi: 'अड़चन' },
] as const;

/* a small isometric-ish parking bay that reacts to x (space) and y (car) */
const MiniLot: React.FC<{ x: number; y: number; size?: number }> = ({ x, y, size = 64 }) => {
  const parked = x === 1 && y === 1;
  const overflow = x === 0 && y === 1;
  const carColor = parked ? ACCENTS.good : overflow ? ACCENTS.III : ACCENTS.III;
  return (
    <div className="relative flex items-center justify-center overflow-hidden rounded-xl border-2 border-dashed"
      style={{ width: size, height: size, borderColor: x ? ACCENTS.I : '#64748b', opacity: x || y ? 1 : 0.5 }}>
      {x === 1 && y === 0 && <Square size={size * 0.4} style={{ color: ACCENTS.I }} className="opacity-50" />}
      {y === 1 && (
        <motion.div initial={{ x: -size, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120 }}>
          <Car size={size * 0.5} style={{ color: carColor }} />
        </motion.div>
      )}
    </div>
  );
};

/* ── bespoke: the variable map (setup) ── */
const VariableMap: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const cell = (sym: string, role: string, desc: string, color: string, icon: React.ReactNode) => (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 ${t.soft}`} style={{ borderColor: `${color}44` }}>
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `${color}1a`, color }}>{icon}</div>
      <div>
        <div className="font-mono text-sm font-black" style={{ color }}>{sym} = {role}</div>
        <div className={`mt-0.5 text-[12px] ${t.sub}`}>{desc}</div>
      </div>
    </div>
  );
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-3">
          <div className={`text-center font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>{lang === 'hi' ? 'Inputs' : 'Inputs'}</div>
          {cell('x', 'Minuend', lang === 'hi' ? 'Adarsh के पास खाली parking जगहें (0 या 1)।' : "Empty parking spaces in Adarsh's lot (0 or 1).", ACCENTS.I, <Square size={18} />)}
          {cell('y', 'Subtrahend', lang === 'hi' ? 'आने वाली गाड़ियाँ जिन्हें जगह चाहिए।' : 'Arriving cars looking for a spot.', ACCENTS.III, <Car size={18} />)}
        </div>
        <div className="space-y-3">
          <div className={`text-center font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>{lang === 'hi' ? 'Outputs' : 'Outputs'}</div>
          {cell('D', 'Difference', lang === 'hi' ? 'ज़मीन पर नतीजा: parked गाड़ी या खाली जगह।' : 'The result on the ground: a car parked or a space left.', ACCENTS.good, <Car size={18} />)}
          {cell('B', 'Borrow', lang === 'hi' ? 'Overflow: अगले lot से उधार ली गई जगह।' : 'Overflow: a space borrowed from the next lot.', ACCENTS.II, <ArrowRight size={18} />)}
        </div>
      </div>
    </Card>
  );
};

/* ── bespoke: Adarsh's 4-scenario logbook ── */
const ScenarioGrid: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {SCENARIOS.map((s) => {
        const D = s.x ^ s.y, B = (~s.x & 1) & s.y;
        const catch_ = B === 1;
        return (
          <motion.div key={s.en} whileHover={{ y: -3 }}
            className={`rounded-2xl border p-4 ${t.soft}`} style={{ borderColor: catch_ ? `${ACCENTS.III}66` : undefined, background: catch_ ? `${ACCENTS.III}10` : undefined }}>
            <div className="flex justify-center"><MiniLot x={s.x} y={s.y} size={56} /></div>
            {catch_ && <div className="mt-2 flex justify-center"><motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}><ArrowRight size={18} style={{ color: ACCENTS.III }} /></motion.div></div>}
            <div className={`mt-2 text-center text-[13px] font-black ${t.text}`}>{lang === 'hi' ? s.hi : s.en}</div>
            <div className={`mt-0.5 text-center font-mono text-[11px] ${t.faint}`}>x={s.x} y={s.y}</div>
            <div className="mt-2 flex justify-center gap-3 font-mono text-[12px]">
              <span style={{ color: ACCENTS.good }}>D={D}</span>
              <span style={{ color: catch_ ? ACCENTS.III : t.faint }}>B={B}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

/* ── bespoke: interactive XOR difference (mini-activity) ── */
const DifferenceViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [x, setX] = useState(1);
  const [y, setY] = useState(0);
  const D = x ^ y;
  const match = x === y;
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
        <div className="flex gap-3">
          {[['x · spaces', x, setX, ACCENTS.I], ['y · cars', y, setY, ACCENTS.III]].map(([l, v, set, c]) => (
            <button key={l as string} onClick={() => (set as (n: number) => void)((v as number) ^ 1)}
              className={`flex flex-col items-center gap-1 rounded-2xl border px-5 py-3 active:scale-95 ${t.card}`}>
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: c as string }}>{l as string}</span>
              <span className="text-3xl font-black tabular-nums" style={{ color: (v as number) ? (c as string) : t.faint }}>{v as number}</span>
            </button>
          ))}
        </div>
        <LiveGate type="XOR" a={x} b={y} isDarkMode={isDarkMode} accent={accent} colorA={ACCENTS.I} colorB={ACCENTS.III} colorOut={ACCENTS.good} labelOut="D" />
      </div>
      <p className={`mt-4 text-center text-[14px] ${t.sub}`}>
        {match
          ? (lang === 'hi' ? <>spaces और cars का <b>मेल</b> है -&gt; D = 0, कुछ नहीं बचा।</> : <>spaces and cars <b>match</b> -&gt; D = 0, nothing left over.</>)
          : (lang === 'hi' ? <>spaces और cars <b>अलग</b> हैं -&gt; D = 1. XOR यही पूछता है।</> : <>spaces and cars <b>differ</b> -&gt; D = 1. That is all XOR asks.</>)}
      </p>
    </Card>
  );
};

/* ── bespoke: interactive borrow path NOT -> AND (mini-activity) ── */
const BorrowViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [x, setX] = useState(0);
  const [y, setY] = useState(1);
  const nx = x ^ 1;
  const B = nx & y;
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-3">
          {[['x · spaces', x, setX, ACCENTS.I], ['y · cars', y, setY, ACCENTS.III]].map(([l, v, set, c]) => (
            <button key={l as string} onClick={() => (set as (n: number) => void)((v as number) ^ 1)}
              className={`flex flex-col items-center gap-1 rounded-2xl border px-5 py-3 active:scale-95 ${t.card}`}>
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: c as string }}>{l as string}</span>
              <span className="text-3xl font-black tabular-nums" style={{ color: (v as number) ? (c as string) : t.faint }}>{v as number}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <LiveGate type="NOT" a={x} isDarkMode={isDarkMode} accent={ACCENTS.I} colorA={ACCENTS.I} colorOut={ACCENTS.II} labelOut="x'" />
          <LiveGate type="AND" a={nx} b={y} isDarkMode={isDarkMode} accent={accent} colorA={ACCENTS.II} colorB={ACCENTS.III} colorOut={ACCENTS.III} labelOut="B" />
        </div>
      </div>
      <p className={`mt-4 text-center text-[14px] ${t.sub}`}>
        {B
          ? (lang === 'hi' ? <><b style={{ color: ACCENTS.III }}>Borrow!</b> 0 जगह पर गाड़ी आई - अगले lot से उधार।</> : <><b style={{ color: ACCENTS.III }}>Borrow!</b> a car arrived with no space - borrowed from the next lot.</>)
          : (lang === 'hi' ? <>Borrow तभी जलता है जब x=0 AND y=1. अभी नहीं।</> : <>Borrow only fires when x=0 AND y=1. Not now.</>)}
      </p>
    </Card>
  );
};

/* ── bespoke: truth table (computed) ── */
const HalfTruth: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const rows = [0, 1].flatMap((x) => [0, 1].map((y) => {
    const D = x ^ y;
    const B = (~x & 1) & y;
    return { cells: [x, y, D, B], highlight: x === 0 && y === 1 };
  }));
  return (
    <TruthTable isDarkMode={isDarkMode} accent={accent}
      headers={['x (spaces)', 'y (cars)', 'D = x⊕y', 'B = x′y']}
      rows={rows}
      note="The only borrow is the highlighted row: 0 spaces, 1 car arriving -> a car must borrow a slot from the next lot." />
  );
};

/* ── bespoke: StepThrough that BUILDS the truth table row by row ── */
const TruthBuilder: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);

  // running table: reveal one computed row per step
  const TableSoFar: React.FC<{ upto: number }> = ({ upto }) => {
    const rows = SCENARIOS.slice(0, upto + 1).map((s) => {
      const D = s.x ^ s.y;
      const B = (~s.x & 1) & s.y;
      return { cells: [s.x, s.y, D, B], highlight: s.x === 0 && s.y === 1 };
    });
    return (
      <TruthTable isDarkMode={isDarkMode} accent={accent}
        headers={['x (spaces)', 'y (cars)', 'D = x⊕y', "B = x′y"]} rows={rows} />
    );
  };

  const steps = SCENARIOS.map((s, i) => {
    const D = s.x ^ s.y;
    const B = (~s.x & 1) & s.y;
    const borrow = B === 1;
    const why = (() => {
      if (s.x === 0 && s.y === 0) return lang === 'hi'
        ? 'न जगह न गाड़ी: कुछ नहीं हुआ, इसलिए D=0, B=0।'
        : 'No space, no car: nothing happens, so D=0, B=0.';
      if (s.x === 1 && s.y === 0) return lang === 'hi'
        ? 'जगह है पर गाड़ी नहीं: एक जगह बच जाती है, D=1, कोई borrow नहीं।'
        : 'A space but no car: one space is left over, D=1, no borrow.';
      if (s.x === 1 && s.y === 1) return lang === 'hi'
        ? 'जगह और गाड़ी का मेल: गाड़ी park हो जाती है, सब बराबर, D=0, B=0।'
        : 'Space and car match: the car parks, all even, D=0, B=0.';
      return lang === 'hi'
        ? 'शून्य जगह पर गाड़ी आ गई: अगले lot से borrow! D=1, B=1।'
        : 'A car with zero spaces: borrow from the next lot! D=1, B=1.';
    })();
    return {
      label: lang === 'hi' ? s.hi : s.en,
      body: (
        <div className="space-y-5">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div className="flex flex-col items-center gap-1">
              <MiniLot x={s.x} y={s.y} size={84} />
              <span className={`font-mono text-[11px] ${t.faint}`}>x={s.x} y={s.y}</span>
            </div>
            <ArrowRight size={20} className={t.faint} />
            {/* the row being filled in */}
            <div className={`flex items-center gap-3 rounded-2xl border px-5 py-3 ${t.soft}`}
              style={{ borderColor: borrow ? `${ACCENTS.III}66` : `${accent}44` }}>
              <div className="flex flex-col items-center">
                <motion.span key={`d${i}`} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-black" style={{ color: ACCENTS.II }}>{D}</motion.span>
                <span className={`text-[10px] uppercase tracking-widest ${t.faint}`}>D</span>
              </div>
              <div className="flex flex-col items-center">
                <motion.span key={`b${i}`} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-black" style={{ color: borrow ? ACCENTS.III : t.faint }}>{B}</motion.span>
                <span className={`text-[10px] uppercase tracking-widest ${t.faint}`}>B</span>
              </div>
            </div>
          </div>
          <p className={`text-center text-[14px] ${t.sub}`}>{why}</p>
          <TableSoFar upto={i} />
        </div>
      ),
    };
  });

  return (
    <div className="space-y-3">
      <p className={`text-center text-[13px] ${t.faint}`}>
        {lang === 'hi'
          ? 'Adarsh की चारों सुबहें एक-एक करके table की row में बदलिए - हर D, B code में गिना गया है।'
          : "Turn each of Adarsh's four mornings into a table row, one at a time - every D, B is computed in code."}
      </p>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </div>
  );
};

/* ── bespoke: guided "derive the equations" walkthrough ── */
const DeriveEquations: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);

  // the full computed table once - reused as the evidence for each claim
  const TABLE = SCENARIOS.map((s) => ({ x: s.x, y: s.y, D: s.x ^ s.y, B: (~s.x & 1) & s.y }));

  // small evidence table that can spotlight cells of one output column
  const Evidence: React.FC<{ col: 'D' | 'B'; predicate: (r: typeof TABLE[number]) => boolean }>
    = ({ col, predicate }) => (
    <div className={`overflow-hidden rounded-2xl border ${t.card}`}>
      <table className="w-full border-collapse text-center font-mono text-[14px]">
        <thead>
          <tr>
            {['x', 'y', 'D', 'B'].map((h) => (
              <th key={h} className="px-4 py-2 text-[12px] font-black"
                style={{ color: h === col ? accent : (t.faint as string), borderBottom: `2px solid ${accent}33` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE.map((r, ri) => {
            const lit = predicate(r);
            return (
              <tr key={ri}>
                {(['x', 'y', 'D', 'B'] as const).map((k) => {
                  const isCol = k === col;
                  return (
                    <td key={k} className={`px-4 py-2 ${isCol ? 'font-black' : 'font-bold'}`}
                      style={{
                        color: isCol && lit ? '#000' : (isCol ? (t.text as string) : (t.faint as string)),
                        background: isCol && lit ? accent : undefined,
                        borderTop: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                      }}>
                      {r[k]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // confirm a claimed equation against the computed column, every row
  const Verify: React.FC<{ col: 'D' | 'B'; formula: (r: typeof TABLE[number]) => number; label: string }>
    = ({ col, formula, label }) => {
    const allMatch = TABLE.every((r) => formula(r) === r[col]);
    return (
      <div className={`mt-3 flex items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 ${t.soft}`}
        style={{ borderColor: allMatch ? `${ACCENTS.good}66` : `${ACCENTS.III}66` }}>
        {allMatch
          ? <Check size={16} style={{ color: ACCENTS.good }} />
          : <XIcon size={16} style={{ color: ACCENTS.III }} />}
        <span className={`font-mono text-[12px] ${t.text}`}>
          {label} {allMatch
            ? (lang === 'hi' ? 'हर row पर सही' : 'matches every row')
            : (lang === 'hi' ? 'किसी row पर ग़लत' : 'fails a row')}
        </span>
      </div>
    );
  };

  const steps = [
    {
      label: lang === 'hi' ? 'D column पढ़िए' : 'Read the D column',
      body: (
        <div className="space-y-3">
          <p className={`text-center text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? 'D ठीक उन्हीं rows पर 1 है जहाँ x और y अलग (MISMATCH) हैं - लिट cells देखिए।'
              : 'D is 1 exactly on the rows where x and y DIFFER - look at the lit cells.'}
          </p>
          <Evidence col="D" predicate={(r) => r.D === 1} />
          <p className={`text-center text-[13px] ${t.faint}`}>
            {lang === 'hi' ? '"अलग हैं?" का detector = XOR.' : 'The "are they different?" detector = XOR.'}
          </p>
        </div>
      ),
    },
    {
      label: 'D = x ⊕ y',
      body: (
        <div className="space-y-3">
          <p className={`text-center text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? 'दावा: D = x XOR y। हर row पर x⊕y को गिनी हुई D से मिलाते हैं.'
              : 'Claim: D = x XOR y. Compare x⊕y against the computed D on every row.'}
          </p>
          <Verify col="D" formula={(r) => r.x ^ r.y} label="x ⊕ y" />
          <div className="flex justify-center pt-1">
            <LiveGate type="XOR" a={1} b={0} isDarkMode={isDarkMode} accent={accent}
              colorA={ACCENTS.I} colorB={ACCENTS.III} colorOut={ACCENTS.good} labelOut="D" />
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'B column पढ़िए' : 'Read the B column',
      body: (
        <div className="space-y-3">
          <p className={`text-center text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? 'B सिर्फ़ एक row पर 1 है: x=0 और y=1 (The Catch)।'
              : 'B is 1 on a single row only: x=0 and y=1 (The Catch).'}
          </p>
          <Evidence col="B" predicate={(r) => r.B === 1} />
          <p className={`text-center text-[13px] ${t.faint}`}>
            {lang === 'hi' ? 'x=0 का मतलब x′=1, और y=1. इन्हें AND कीजिए.' : "x=0 means x′=1, and y=1. AND them together."}
          </p>
        </div>
      ),
    },
    {
      label: "B = x′y",
      body: (
        <div className="space-y-3">
          <p className={`text-center text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? "दावा: B = (NOT x) AND y = x′y। हर row पर मिलान करते हैं."
              : "Claim: B = (NOT x) AND y = x′y. Verify on every row."}
          </p>
          <Verify col="B" formula={(r) => (r.x ^ 1) & r.y} label="x′ · y" />
          {/* show the common wrong guess failing, computed */}
          <Verify col="B" formula={(r) => r.x & (r.y ^ 1)} label="x · y′ (trap)" />
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <LiveGate type="NOT" a={0} isDarkMode={isDarkMode} accent={ACCENTS.I}
              colorA={ACCENTS.I} colorOut={ACCENTS.II} labelOut="x′" />
            <LiveGate type="AND" a={1} b={1} isDarkMode={isDarkMode} accent={accent}
              colorA={ACCENTS.II} colorB={ACCENTS.III} colorOut={ACCENTS.III} labelOut="B" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <p className={`text-center text-[13px] ${t.faint}`}>
        {lang === 'hi'
          ? 'पूरी table से दोनों equations ख़ुद निकालिए - हर दावा code में जाँचा गया है।'
          : 'Derive both equations straight from the completed table - every claim is checked in code.'}
      </p>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </div>
  );
};

/* ── bespoke: gate-level blueprint, now INTERACTIVE (live wires) ── */
const HalfSubCircuit: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [x, setX] = useState(1);
  const [y, setY] = useState(0);
  const nx = x ^ 1;            // x'
  const D = x ^ y;            // XOR output
  const B = nx & y;           // AND output
  const dim = isDarkMode ? '#334155' : '#cbd5e1';
  // a wire is "hot" when it carries a 1; colour it, else dim grey
  const wire = (on: number, c: string) => (on ? c : dim);

  // a live wire with a travelling-pulse animation when hot
  const Wire: React.FC<{ x1: number; y1: number; x2: number; y2: number; on: number; color: string }>
    = ({ x1, y1, x2, y2, on, color }) => (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={wire(on, color)} strokeWidth={on ? 3.5 : 2}
      animate={{ opacity: on ? [0.55, 1, 0.55] : 1 }}
      transition={{ repeat: on ? Infinity : 0, duration: 1.4 }} />
  );

  const Toggle: React.FC<{ label: string; val: number; on: () => void; color: string; icon: React.ReactNode }>
    = ({ label, val, on, color, icon }) => (
    <button onClick={on} className={`flex items-center gap-3 rounded-2xl border px-5 py-3 active:scale-95 ${t.card}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg"
        style={{ background: `${color}1a`, color }}>{icon}</span>
      <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color }}>{label}</span>
      <span className="text-3xl font-black tabular-nums" style={{ color: val ? color : t.faint }}>{val}</span>
    </button>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
        <Toggle label={lang === 'hi' ? 'जगहें (x)' : 'spaces (x)'} val={x} color={ACCENTS.I}
          on={() => setX((v) => v ^ 1)} icon={<Square size={15} />} />
        <Toggle label={lang === 'hi' ? 'गाड़ियाँ (y)' : 'cars (y)'} val={y} color={ACCENTS.III}
          on={() => setY((v) => v ^ 1)} icon={<Car size={15} />} />
        <div className={`flex items-center gap-2 rounded-2xl border px-4 py-2 ${t.soft}`}>
          <Zap size={14} style={{ color: accent }} />
          <span className="font-mono text-[12px]" style={{ color: ACCENTS.II }}>D={D}</span>
          <span className="font-mono text-[12px]" style={{ color: B ? ACCENTS.III : (t.faint as string) }}>B={B}</span>
        </div>
      </div>

      <svg viewBox="0 0 520 260" className="mx-auto h-auto w-full max-w-2xl">
        {/* input pin values */}
        <text x="12" y="64" fontFamily="monospace" fontSize="16" fontWeight="800" fill={wire(x, ACCENTS.I)}>x={x}</text>
        <text x="12" y="184" fontFamily="monospace" fontSize="16" fontWeight="800" fill={wire(y, ACCENTS.III)}>y={y}</text>

        {/* x rail into XOR (top input) */}
        <Wire x1={60} y1={60} x2={200} y2={60} on={x} color={ACCENTS.I} />
        {/* x tap down to the inverter branch */}
        <Wire x1={60} y1={60} x2={60} y2={150} on={x} color={ACCENTS.I} />
        <Wire x1={60} y1={150} x2={120} y2={150} on={x} color={ACCENTS.I} />
        {/* y rail: split to XOR (lower input) and to AND */}
        <Wire x1={28} y1={180} x2={120} y2={180} on={y} color={ACCENTS.III} />
        <Wire x1={90} y1={180} x2={90} y2={96} on={y} color={ACCENTS.III} />
        <Wire x1={90} y1={96} x2={200} y2={96} on={y} color={ACCENTS.III} />

        {/* XOR gate */}
        <rect x="200" y="40" width="90" height="76" rx="12" fill={t.box}
          stroke={D ? ACCENTS.II : accent} strokeWidth={D ? 3 : 2} />
        <text x="245" y="84" fontFamily="monospace" fontSize="15" fill={ACCENTS.II} textAnchor="middle">XOR</text>

        {/* inverter bubble producing x' */}
        <circle cx="130" cy="150" r="8" fill={t.box} stroke={nx ? ACCENTS.II : accent} strokeWidth={nx ? 3 : 2} />
        <text x="130" y="136" fontFamily="monospace" fontSize="11" fontWeight="800"
          fill={wire(nx, ACCENTS.II)} textAnchor="middle">x′={nx}</text>
        {/* x' into AND, and y into AND */}
        <Wire x1={138} y1={150} x2={200} y2={166} on={nx} color={ACCENTS.II} />
        <Wire x1={120} y1={180} x2={200} y2={198} on={y} color={ACCENTS.III} />

        {/* AND gate */}
        <rect x="200" y="150" width="90" height="64" rx="12" fill={t.box}
          stroke={B ? ACCENTS.III : accent} strokeWidth={B ? 3 : 2} />
        <text x="245" y="187" fontFamily="monospace" fontSize="15" fill={ACCENTS.III} textAnchor="middle">AND</text>

        {/* outputs */}
        <Wire x1={290} y1={78} x2={470} y2={78} on={D} color={ACCENTS.II} />
        <Wire x1={290} y1={182} x2={470} y2={182} on={B} color={ACCENTS.III} />
        <text x="478" y="84" fontFamily="monospace" fontSize="15" fontWeight="800" fill={wire(D, ACCENTS.II)}>D={D}</text>
        <text x="478" y="188" fontFamily="monospace" fontSize="15" fontWeight="800" fill={wire(B, ACCENTS.III)}>B={B}</text>
      </svg>

      <p className={`mt-4 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>x और y toggle कीजिए - <span style={{ color: ACCENTS.I }}>x</span>, <span style={{ color: ACCENTS.III }}>y</span>, <span style={{ color: ACCENTS.II }}>x′ / XOR</span> और <span style={{ color: ACCENTS.III }}>AND</span> के wires live जलते हैं। तीन gates, दो wires।</>
          : <>Toggle x and y - the <span style={{ color: ACCENTS.I }}>x</span>, <span style={{ color: ACCENTS.III }}>y</span>, <span style={{ color: ACCENTS.II }}>x′ / XOR</span> and <span style={{ color: ACCENTS.III }}>AND</span> wires light up live. Three gates, two wires.</>}
      </p>
    </Card>
  );
};

/* ── bespoke: interactive parking lot (full activity) ── */
const HalfSubActivity: React.FC<{ isDarkMode: boolean; accent: string; scene: SubScene }> = ({ isDarkMode, accent, scene }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [x, setX] = useState(1);
  const [y, setY] = useState(1);
  const D = x ^ y;
  const B = (~x & 1) & y;

  const Toggle: React.FC<{ label: string; val: number; on: () => void; icon: React.ReactNode }> = ({ label, val, on, icon }) => (
    <button onClick={on} className={`flex flex-col items-center gap-2 rounded-3xl border p-6 transition-all active:scale-95 ${t.card}`}>
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>{icon}{label}</div>
      <div className="text-5xl font-black tabular-nums" style={{ color: val ? accent : undefined }}>{val}</div>
      <span className={`text-[11px] ${t.faint}`}>{lang === 'hi' ? 'बदलने के लिए tap करें' : 'tap to flip'}</span>
    </button>
  );

  return (
    <SceneShell>
      <section className="space-y-3">
        <Eyebrow accent={accent}>{scene.label}</Eyebrow>
        {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${t.text}`}>{scene.subtitle}</h2>}
      </section>

      <div className="grid grid-cols-2 gap-4 sm:max-w-md sm:mx-auto">
        <Toggle label={lang === 'hi' ? 'खाली जगह (x)' : 'spaces (x)'} val={x} on={() => setX((v) => v ^ 1)} icon={<Square size={13} />} />
        <Toggle label={lang === 'hi' ? 'गाड़ियाँ (y)' : 'cars (y)'} val={y} on={() => setY((v) => v ^ 1)} icon={<Car size={13} />} />
      </div>

      <Card isDarkMode={isDarkMode} className="text-center">
        <div className="mx-auto flex max-w-md items-center justify-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <MiniLot x={x} y={y} size={96} />
            <span className={`text-[11px] ${t.faint}`}>{lang === 'hi' ? 'Adarsh की lot' : "Adarsh's lot"}</span>
          </div>
          <motion.div animate={B ? { x: [0, 6, 0], opacity: 1 } : { opacity: 0.25 }} transition={{ repeat: B ? Infinity : 0, duration: 1.2 }}>
            <ArrowRight size={22} style={{ color: B ? ACCENTS.III : undefined }} />
          </motion.div>
          <div className="flex flex-col items-center gap-1">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-2"
              style={{ borderColor: B ? ACCENTS.III : (isDarkMode ? '#334155' : '#cbd5e1') }}>
              <AnimatePresence>
                {B === 1 && (
                  <motion.div key="borrow" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }} transition={{ type: 'spring', stiffness: 90 }}>
                    <Car size={34} style={{ color: ACCENTS.III }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span className={`text-[11px] ${t.faint}`}>{lang === 'hi' ? 'अगली lot' : 'next lot'}</span>
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-8">
          <div className="flex flex-col items-center">
            <motion.div key={`d${D}`} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-4xl font-black" style={{ color: ACCENTS.II }}>{D}</motion.div>
            <span className={`text-[11px] ${t.faint}`}>Difference</span>
          </div>
          <div className="flex flex-col items-center">
            <motion.div key={`b${B}`} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-4xl font-black" style={{ color: ACCENTS.III }}>{B}</motion.div>
            <span className={`text-[11px] ${t.faint}`}>Borrow</span>
          </div>
        </div>
        <p className={`mt-5 text-[14px] ${t.sub}`}>
          {B
            ? (lang === 'hi' ? '0 जगह पर गाड़ी आई - Borrow जल गया, गाड़ी अगले lot से जगह लेगी।' : 'A car arrived with 0 free spaces - Borrow lit up; the car takes a slot from the next lot.')
            : D
              ? (lang === 'hi' ? 'Difference = 1: जगह और गाड़ी का मेल नहीं हुआ।' : 'Difference = 1: spaces and cars did not match.')
              : (lang === 'hi' ? 'सब संतुलित - कोई बचत नहीं, कोई borrow नहीं।' : 'Perfectly settled - nothing left over, nothing borrowed.')}
        </p>
      </Card>
    </SceneShell>
  );
};

/* ── bespoke: the "amnesia" worked example (recap) ──
   A concrete 2-bit subtraction (10 - 01 = 2 - 1) done column by column. The
   rightmost column borrows; the next column MUST consume that borrow-in, which
   a plain half subtractor has no wire for. Every bit is computed in code. */
const AmnesiaDemo: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);

  // X = 10 (decimal 2), Y = 01 (decimal 1). Columns indexed 0 = LSB (rightmost).
  const X = [1, 0]; // [bit1 (MSB), bit0 (LSB)]
  const Y = [0, 1];

  // column 0 (LSB): plain half subtractor, x=0,y=1 -> D=1, borrow-out=1
  const x0 = X[1], y0 = Y[1];
  const d0 = x0 ^ y0;             // 1
  const bout0 = (x0 ^ 1) & y0;    // 1  (the borrow this column generates)

  // column 1 (MSB): x=1,y=0, but a borrow of 1 arrives from column 0.
  // Half subtractor result IGNORING the incoming borrow:
  const dHalf = X[0] ^ Y[0];                 // 1  (wrong for the real subtraction)
  // What a FULL subtractor would do, consuming borrow-in = bout0:
  const bin1 = bout0;                        // 1
  const dFull = X[0] ^ Y[0] ^ bin1;          // 0  (correct)

  const result2 = `${dFull}${d0}`;           // "01" = decimal 1, the correct 2 - 1

  const Chip: React.FC<{ v: number | string; label: string; color?: string }> = ({ v, label, color }) => (
    <div className="flex flex-col items-center">
      <span className="font-mono text-3xl font-black tabular-nums" style={{ color: color ?? (t.text as string) }}>{v}</span>
      <span className={`mt-0.5 text-[10px] uppercase tracking-widest ${t.faint}`}>{label}</span>
    </div>
  );

  const steps = [
    {
      label: lang === 'hi' ? 'सवाल: 10 - 01' : 'Problem: 10 - 01',
      body: (
        <div className="space-y-4">
          <p className={`text-center text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? 'दो 2-bit संख्याएँ घटाइए: X = 10 (दशमलव 2) में से Y = 01 (दशमलव 1)। जवाब 1 होना चाहिए। हर column को एक अलग lot की तरह सोचिए।'
              : 'Subtract two 2-bit numbers: X = 10 (decimal 2) minus Y = 01 (decimal 1). The answer must be 1. Treat each column as its own lot.'}
          </p>
          <div className="flex justify-center gap-8">
            <Chip v={`${X[0]}${X[1]}`} label="X = 2" color={ACCENTS.I} />
            <Chip v={`${Y[0]}${Y[1]}`} label="Y = 1" color={ACCENTS.III} />
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'दायाँ column' : 'Right column',
      body: (
        <div className="space-y-4">
          <p className={`text-center text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? `सबसे दायाँ column: x=${x0}, y=${y0}. यह ठीक The Catch है - 0 जगह पर गाड़ी। D=${d0}, और यह column एक borrow पैदा करता है (borrow-out=${bout0}).`
              : `Rightmost column: x=${x0}, y=${y0}. This is exactly The Catch - 0 spaces, a car. D=${d0}, and this column generates a borrow (borrow-out=${bout0}).`}
          </p>
          <div className="flex justify-center gap-6">
            <Chip v={d0} label="D (bit 0)" color={ACCENTS.II} />
            <Chip v={bout0} label="borrow-out" color={ACCENTS.III} />
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'बायाँ column - दिक़्क़त' : 'Left column - the snag',
      body: (
        <div className="space-y-4">
          <p className={`text-center text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? `बायाँ column: x=${X[0]}, y=${Y[0]}. पर दाएँ column से borrow-in=${bin1} यहाँ आ रहा है! आधा subtractor इसे पढ़ ही नहीं सकता - वह सिर्फ़ x XOR y = ${dHalf} गिनेगा, जो ग़लत है।`
              : `Left column: x=${X[0]}, y=${Y[0]}. But a borrow-in=${bin1} is arriving here from the right column! The half subtractor has no wire for it - it would only compute x XOR y = ${dHalf}, which is wrong.`}
          </p>
          <div className={`mx-auto flex max-w-sm items-center justify-center gap-3 rounded-2xl border px-4 py-3 ${t.soft}`}
            style={{ borderColor: `${ACCENTS.III}66` }}>
            <XIcon size={18} style={{ color: ACCENTS.III }} />
            <span className={`text-[13px] ${t.text}`}>
              {lang === 'hi' ? `half subtractor कहता है D=${dHalf} (अमान्य borrow-in भूल गया)` : `half subtractor says D=${dHalf} (the borrow-in was forgotten)`}
            </span>
          </div>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'इलाज: borrow-in' : 'The fix: borrow-in',
      body: (
        <div className="space-y-4">
          <p className={`text-center text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? `अगर column borrow-in स्वीकार करे, तो D = x XOR y XOR borrow-in = ${X[0]} XOR ${Y[0]} XOR ${bin1} = ${dFull}. अब जवाब ${result2} (दशमलव ${parseInt(result2, 2)}) सही है!`
              : `If the column accepts the borrow-in, then D = x XOR y XOR borrow-in = ${X[0]} XOR ${Y[0]} XOR ${bin1} = ${dFull}. Now the answer ${result2} (decimal ${parseInt(result2, 2)}) is correct!`}
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className={`flex items-center gap-2 rounded-2xl border px-4 py-3 ${t.soft}`} style={{ borderColor: `${ACCENTS.good}66` }}>
              <Check size={18} style={{ color: ACCENTS.good }} />
              <span className="font-mono text-2xl font-black" style={{ color: ACCENTS.good }}>{result2}</span>
              <span className={`text-[12px] ${t.faint}`}>= {parseInt(result2, 2)}</span>
            </div>
          </div>
          <p className={`text-center text-[12px] ${t.faint}`}>
            {lang === 'hi'
              ? 'यही तीसरा input (borrow-in) full subtractor जोड़ता है - अगले module में।'
              : 'That third input (borrow-in) is exactly what the full subtractor adds - in the next module.'}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <p className={`text-center text-[13px] ${t.faint}`}>
        {lang === 'hi'
          ? 'देखिए amnesia असल में कैसे चोट करती है - एक 2-bit subtraction column-दर-column, हर bit code में गिना गया।'
          : 'See the amnesia actually bite - a 2-bit subtraction worked column by column, every bit computed in code.'}
      </p>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </div>
  );
};

/* ── part assignment ── */
const partAt = (i: number): string =>
  i <= 3 ? 'PART I · THE PARKING LOT'
    : i <= 7 ? 'PART II · THE TWO WIRES'
      : 'PART III · PROVE IT';

const bespokeFor = (scene: SubScene): string | null => {
  const k = scene.id.toLowerCase();
  if (k.includes('setup')) return 'vars';
  if (k.includes('logbook')) return 'scenarios';
  if (k.includes('difference')) return 'diff';
  if (k.includes('borrow')) return 'borrow';
  return null;
};

function componentFor(scene: SubScene): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="Half Subtractor" />;
    case 'video':
      return (p) => <VideoScene {...p} scene={scene} src="/videos/the-half-subtractor.mp4" />;
    case 'truth':
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          <TruthBuilder isDarkMode={p.isDarkMode} accent={p.accent} />
          <HalfTruth isDarkMode={p.isDarkMode} accent={p.accent} />
          <DeriveEquations isDarkMode={p.isDarkMode} accent={p.accent} />
        </TheoryScene>
      );
    case 'circuit':
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          <HalfSubCircuit isDarkMode={p.isDarkMode} accent={p.accent} />
          <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="half-subtractor"
            titleEN="Build the half subtractor for real" titleHI="असली में half subtractor बनाइए" />
        </TheoryScene>
      );
    case 'activity':
      return (p) => <HalfSubActivity {...p} scene={scene} />;
    case 'flashcards':
      return (p) => (
        <SceneShell>
          <section className="space-y-3"><Eyebrow accent={p.accent}>{scene.label}</Eyebrow>
            {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${tone(p.isDarkMode).text}`}>{scene.subtitle}</h2>}</section>
          <SubFlashCards isDarkMode={p.isDarkMode} accent={p.accent} cards={CONTENT.flashcards} />
        </SceneShell>
      );
    case 'quiz':
      return (p) => <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="HALF SUB" tag="Practice · Half Subtractor" title={scene.label} intro={scene.subtitle ?? ''} />;
    case 'recap':
      return (p) => (
        <RecapScene {...p} scene={scene}>
          <AmnesiaDemo isDarkMode={p.isDarkMode} accent={p.accent} />
        </RecapScene>
      );
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'vars' && <VariableMap isDarkMode={p.isDarkMode} />}
          {which === 'scenarios' && <ScenarioGrid isDarkMode={p.isDarkMode} />}
          {which === 'diff' && <DifferenceViz isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'borrow' && <BorrowViz isDarkMode={p.isDarkMode} accent={p.accent} />}
        </TheoryScene>
      );
    }
  }
}

const slug = (s: string) => s.replace(/^S\d+_/, '').toLowerCase();

export const PAGES: SubPage[] = CONTENT.scenes.map((scene, i) => ({
  id: slug(scene.id),
  part: partAt(i),
  label: scene.label,
  subtitle: scene.subtitle ?? '',
  Component: componentFor(scene),
}));
