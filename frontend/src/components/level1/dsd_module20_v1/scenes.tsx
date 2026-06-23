/**
 * The BCD Adder (dsd/20) - "The Odometer Hack".
 * Generic scenes come from the shared kit; the animated odometer wheel, the 0-19
 * gap line, the interactive overflow detector (C = K + Z8.Z4 + Z8.Z2), the state
 * matrix, the two-adder schematic and the full BCD-adder demo are bespoke. All
 * boolean/arithmetic results are COMPUTED in code, never trusted to prose.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, Plus, ArrowDown, ArrowUp, Check, RotateCw } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, TruthTable, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  StepThrough, LiveGate,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import { BcdAdderCircuit } from '../_subtractor/circuit';
import { CONTENT } from './content';

const ACC = { I: '#38bdf8', II: '#f59e0b', III: '#fb7185', good: '#34d399' };
const bin4 = (n: number) => n.toString(2).padStart(4, '0');

/* ───────── bespoke: a single rolling odometer dial ─────────
   A vertical strip of digits 0..9 that physically scrolls so the chosen
   value sits in the read window. value 10..15 overshoots into a red
   "phantom" zone past 9; we render those as X with the raw 4-bit code. */
const RollingDial: React.FC<{
  value: number; isDarkMode: boolean; carry?: number; label?: string;
}> = ({ value, isDarkMode, carry = 0, label }) => {
  const t = tone(isDarkMode);
  const bad = value >= 10;
  const CELL = 44;           // px height of one digit cell
  // strip runs 0..15 so phantom forbidden positions 10..15 can be shown.
  const offset = -(value * CELL) + CELL; // centre the active value in the 3-cell window
  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && <span className={`font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>{label}</span>}
      <div className="flex items-stretch gap-1.5">
        {/* carry wheel to the left */}
        <div className="flex flex-col items-center justify-center">
          <span className={`font-mono text-[9px] ${t.faint}`}>carry</span>
          <motion.div animate={{ scale: carry ? [1, 1.25, 1] : 1 }} transition={{ duration: 0.5 }}
            className="flex h-10 w-9 items-center justify-center rounded-lg border font-mono text-lg font-black"
            style={{ borderColor: carry ? `${ACC.II}` : `${t.faint}44`, color: carry ? ACC.II : t.faint, background: carry ? `${ACC.II}22` : 'transparent' }}>
            {carry}
          </motion.div>
        </div>
        {/* the rolling ones-wheel */}
        <div className="relative overflow-hidden rounded-xl border"
          style={{ height: CELL * 3, width: 64, borderColor: bad ? ACC.III : ACC.good }}>
          {/* read window highlight */}
          <div className="pointer-events-none absolute inset-x-0 z-10" style={{ top: CELL, height: CELL, borderTop: `2px solid ${bad ? ACC.III : ACC.good}`, borderBottom: `2px solid ${bad ? ACC.III : ACC.good}`, background: `${bad ? ACC.III : ACC.good}14` }} />
          <motion.div animate={{ y: offset }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
            {Array.from({ length: 16 }, (_, i) => {
              const ibad = i >= 10;
              return (
                <div key={i} className="flex flex-col items-center justify-center" style={{ height: CELL }}>
                  <span className="font-mono text-xl font-black" style={{ color: ibad ? ACC.III : (isDarkMode ? '#e2e8f0' : '#0f172a') }}>{i < 10 ? i : 'X'}</span>
                  <span className="font-mono text-[8px]" style={{ color: ibad ? ACC.III : t.faint }}>{bin4(i)}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ───────── bespoke: animated odometer wheel (S02) ─────────
   Now an actual rolling odometer: +1 ticks the dial up; once past 9 it lands
   on a red forbidden phantom, and +6 rolls it back to 0 and pops a carry,
   exactly like a real car odometer wheel. All positions still clickable. */
const OdometerWheel: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [pos, setPos] = useState(8);
  const [rolled, setRolled] = useState(false);   // true after a +6 roll-over
  const forbidden = pos >= 10;
  // +6 hack: 4-bit value + 6, the carry-out is bit-4, the visible digit is low 4 bits.
  const rawAfter6 = pos + 6;
  const carry = rolled ? (rawAfter6 >> 4) & 1 : 0;
  const displayValue = rolled ? rawAfter6 & 15 : pos;

  const tick = () => { setRolled(false); setPos((p) => (p + 1) % 16); };
  const hack6 = () => { setRolled(true); };       // show the +6 roll-over
  const reset = () => { setRolled(false); setPos(8); };

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex items-center justify-center gap-2">
        <Gauge size={18} style={{ color: accent }} />
        <span className={`font-mono text-[12px] uppercase tracking-widest ${t.faint}`}>{lang === 'hi' ? 'rolling 4-bit wheel' : 'rolling 4-bit wheel'}</span>
      </div>

      {/* the live rolling odometer dial */}
      <div className="flex justify-center">
        <RollingDial value={displayValue} carry={carry} isDarkMode={isDarkMode}
          label={lang === 'hi' ? 'ones-wheel' : 'ones-wheel'} />
      </div>

      <AnimatePresence mode="wait">
        <motion.p key={`${displayValue}-${carry}-${rolled}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="mt-4 text-center text-[13px]" style={{ color: (rolled ? false : forbidden) ? ACC.III : t.sub }}>
          {rolled
            ? (lang === 'hi'
                ? <>+6 ({bin4(pos)} + 0110 = {rawAfter6.toString(2).padStart(5, '0')}) wheel को <b style={{ color: ACC.good }}>{displayValue}</b> पर roll करता है और एक carry <b style={{ color: ACC.II }}>{carry}</b> निकालता है - बिलकुल असली odometer।</>
                : <>+6 ({bin4(pos)} + 0110 = {rawAfter6.toString(2).padStart(5, '0')}) rolls the wheel to <b style={{ color: ACC.good }}>{displayValue}</b> and pops a carry <b style={{ color: ACC.II }}>{carry}</b> - just like a real odometer.</>)
            : forbidden
              ? (lang === 'hi' ? <>position <b style={{ color: ACC.III }}>{bin4(pos)}</b> FORBIDDEN है - वैध decimal digit नहीं। नीचे +6 दबाइए और साफ़ roll-over देखिए।</> : <>Position <b style={{ color: ACC.III }}>{bin4(pos)}</b> is FORBIDDEN - not a valid decimal digit. Hit +6 below to see the clean roll-over.</>)
              : (lang === 'hi' ? <>वैध digit <b style={{ color: ACC.good }}>{pos}</b>. wheel को 9 के पार धकेलिए और forbidden क्षेत्र देखिए।</> : <>Valid digit <b style={{ color: ACC.good }}>{pos}</b>. Push the wheel past 9 to see the forbidden zone.</>)}
        </motion.p>
      </AnimatePresence>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button onClick={tick} className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 font-mono text-[12px] ${t.soft} ${t.sub} hover:opacity-80`}>
          <ArrowUp size={13} /> {lang === 'hi' ? 'tick +1' : 'tick +1'}
        </button>
        <button onClick={hack6} disabled={!forbidden}
          className="rounded-xl px-4 py-2 font-mono text-[12px] font-black text-black hover:opacity-90 disabled:opacity-30" style={{ background: accent }}>
          {lang === 'hi' ? '+6 odometer hack' : '+6 odometer hack'}
        </button>
        <button onClick={reset} className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 font-mono text-[12px] ${t.soft} ${t.faint} hover:opacity-80`}>
          <RotateCw size={12} /> {lang === 'hi' ? 'reset' : 'reset'}
        </button>
      </div>

      {/* the full 0..15 reference strip (still clickable) */}
      <div className="mt-6 flex flex-wrap justify-center gap-1.5">
        {Array.from({ length: 16 }, (_, i) => {
          const bad = i >= 10;
          const isActive = i === (rolled ? displayValue : pos);
          return (
            <motion.button key={i} onClick={() => { setRolled(false); setPos(i); }} animate={{ scale: isActive ? 1.12 : 1 }}
              className="flex h-12 w-12 flex-col items-center justify-center rounded-xl border font-mono transition-colors"
              style={{
                borderColor: isActive ? (bad ? ACC.III : ACC.good) : `${bad ? ACC.III : ACC.good}44`,
                background: isActive ? (bad ? `${ACC.III}22` : `${ACC.good}22`) : 'transparent',
              }}>
              <span className="text-sm font-black" style={{ color: bad ? ACC.III : ACC.good }}>{i < 10 ? i : 'X'}</span>
              <span className="text-[8px]" style={{ color: bad ? ACC.III : ACC.good }}>{bin4(i)}</span>
            </motion.button>
          );
        })}
      </div>
    </Card>
  );
};

/* ───────── bespoke: the 0-19 gap line (S03) ───────── */
const GapLine: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const seg = (label: string, range: string, color: string, grow: number) => (
    <div className="flex flex-col items-center gap-1" style={{ flexGrow: grow, flexBasis: 0 }}>
      <div className="h-3 w-full rounded-full" style={{ background: color }} />
      <span className="font-mono text-[11px] font-black" style={{ color }}>{range}</span>
      <span className={`text-[10px] ${t.faint}`}>{label}</span>
    </div>
  );
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="flex items-stretch gap-1.5">
        {seg(lang === 'hi' ? 'वैध' : 'valid', '0 - 9', ACC.good, 10)}
        {seg(lang === 'hi' ? 'forbidden six' : 'forbidden six', '10 - 15', ACC.II, 6)}
        {seg(lang === 'hi' ? 'overflow (K=1)' : 'overflow (K=1)', '16 - 19', ACC.III, 4)}
      </div>
      <p className={`mt-4 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>अधिकतम = 9 + 9 + 1 = <b style={{ color: ACC.III }}>19</b>. 10 से 19 तक सब कुछ +6 माँगता है।</>
          : <>Maximum = 9 + 9 + 1 = <b style={{ color: ACC.III }}>19</b>. Everything from 10 to 19 needs +6.</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: interactive overflow detector (S04) ───────── */
const DetectFormula: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [sum, setSum] = useState(12);
  const K = sum >= 16 ? 1 : 0;
  const Z = sum - 16 * K;
  const Z8 = (Z >> 3) & 1, Z4 = (Z >> 2) & 1, Z2 = (Z >> 1) & 1, Z1 = Z & 1;
  const t1 = K, t2 = Z8 & Z4, t3 = Z8 & Z2;
  const C = t1 | t2 | t3;

  const Bit: React.FC<{ name: string; on: number }> = ({ name, on }) => (
    <div className="flex flex-col items-center gap-1">
      <span className={`font-mono text-[10px] ${t.faint}`}>{name}</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black"
        style={{ background: on ? accent : 'transparent', color: on ? '#000' : accent, border: `1.5px solid ${accent}55` }}>{on}</span>
    </div>
  );
  const Term: React.FC<{ label: string; on: number }> = ({ label, on }) => (
    <motion.span animate={{ opacity: on ? 1 : 0.35, scale: on ? 1 : 0.96 }}
      className="rounded-lg px-3 py-1.5 font-mono text-[13px] font-black"
      style={{ background: on ? `${ACC.good}22` : `${t.faint}11`, color: on ? ACC.good : t.faint, border: `1px solid ${on ? ACC.good : 'transparent'}` }}>
      {label} = {on}
    </motion.span>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex items-center gap-3">
        <span className={`font-mono text-[12px] ${t.faint}`}>raw sum</span>
        <input type="range" min={0} max={19} value={sum} onChange={(e) => setSum(parseInt(e.target.value, 10))}
          className="flex-1 accent-current" style={{ color: accent }} />
        <span className="w-10 text-right font-mono text-xl font-black" style={{ color: accent }}>{sum}</span>
      </div>

      <div className="flex items-end justify-center gap-3">
        <Bit name="K" on={K} />
        <span className={t.faint}>|</span>
        <Bit name="Z8" on={Z8} /><Bit name="Z4" on={Z4} /><Bit name="Z2" on={Z2} /><Bit name="Z1" on={Z1} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 font-mono">
        <span className={`text-[13px] ${t.text}`}>C =</span>
        <Term label="K" on={t1} />
        <span className={t.faint}>+</span>
        <Term label="Z8.Z4" on={t2} />
        <span className={t.faint}>+</span>
        <Term label="Z8.Z2" on={t3} />
      </div>

      <motion.div key={C} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="mt-5 text-center text-xl font-black" style={{ color: C ? ACC.good : t.faint }}>
        C = {C} -&gt; {C ? (lang === 'hi' ? 'ADD 6 (0110)' : 'ADD 6 (0110)') : (lang === 'hi' ? 'ADD 0 (कोई सुधार नहीं)' : 'ADD 0 (no fix)')}
      </motion.div>
    </Card>
  );
};

/* ───────── shared bit-row helper (used by the step-throughs) ───────── */
const BitRow: React.FC<{
  bits: number[]; labels?: string[]; accent: string; isDarkMode: boolean; litColor?: string; size?: number;
}> = ({ bits, labels, accent, isDarkMode, litColor, size = 36 }) => {
  const t = tone(isDarkMode);
  return (
    <div className="flex items-end justify-center gap-2">
      {bits.map((b, i) => {
        const on = b === 1;
        const col = litColor ?? accent;
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            {labels && <span className={`font-mono text-[10px] ${t.faint}`}>{labels[i]}</span>}
            <span className="flex items-center justify-center rounded-lg font-mono font-black"
              style={{ width: size, height: size, fontSize: size * 0.4, background: on ? col : 'transparent', color: on ? '#000' : col, border: `1.5px solid ${col}55` }}>{b}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ───────── bespoke: three-phase pipeline walkthrough (StepThrough, S07) ─────────
   Runs a chosen preset through Phase 1 (binary add), Phase 2 (detect C), Phase 3
   (add 0110/0000). Every bit, carry, term and decimal is COMPUTED here. Two
   presets: 5+7 (the K=0, forbidden-six case) and 9+9+1 (the K=1, worst case). */
const PhaseWalkthrough: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const PRESETS = [
    { id: '5+7', A: 5, B: 7, Cin: 0 },
    { id: '9+9+1', A: 9, B: 9, Cin: 1 },
  ];
  const [pi, setPi] = useState(0);
  const { A, B, Cin } = PRESETS[pi];

  // ── all logic computed ──
  const binSum = A + B + Cin;                       // 0..19
  const K = binSum >= 16 ? 1 : 0;                   // adder-1 carry-out
  const Z = binSum - 16 * K;                        // low 4 bits of phase-1 sum
  const Zb = [(Z >> 3) & 1, (Z >> 2) & 1, (Z >> 1) & 1, Z & 1];
  const Z8 = Zb[0], Z4 = Zb[1], Z2 = Zb[2];
  const t2 = Z8 & Z4, t3 = Z8 & Z2;
  const C = K | t2 | t3;
  const add6 = C ? 6 : 0;
  const adder2sum = Z + add6;                        // adder-2 raw output (4-bit + its own carry)
  const S = adder2sum & 15;                          // final BCD digit nibble
  const adder2bits = adder2sum.toString(2).padStart(5, '0'); // honest 5-bit adder-2 output
  // The BCD column carry-out is C itself: it is high whenever adder-1 overflowed
  // (K) or the sum was a forbidden code, which is exactly when a decimal carry is
  // due. For K=1 the adder-2 sum stays < 16, so its own bit-4 is 0 - the carry to
  // the next column comes from C, not from adder-2's overflow.
  const carryOut = C;
  const decimal = carryOut * 10 + S;

  const mono = (v: string, col?: string) => <span className="font-mono font-black" style={{ color: col ?? (t.ink as string) }}>{v}</span>;

  const phase1 = (
    <div className="space-y-4">
      <p className={`text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>Adder 1, A, B और carry-in को सादा binary की तरह जोड़ता है (BCD अभी भूल जाइए)।</>
          : <>Adder 1 adds A, B and the carry-in as plain binary (forget BCD for now).</>}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 text-lg">
        {mono(String(A), ACC.I)} <span className={t.faint}>+</span> {mono(String(B), ACC.I)}
        <span className={t.faint}>+</span> {mono(String(Cin), ACC.II)} <span className={t.faint}>=</span> {mono(String(binSum), accent)}
      </div>
      <BitRow bits={[K, ...Zb]} labels={['K', 'Z8', 'Z4', 'Z2', 'Z1']} accent={accent} isDarkMode={isDarkMode} />
      <p className={`text-center font-mono text-[12px] ${t.faint}`}>
        K = {mono(String(K), ACC.II)} {' '} Z8 Z4 Z2 Z1 = {mono(bin4(Z), t.ink as string)} {' '}
        ({lang === 'hi' ? 'मान' : 'value'} {Z})
      </p>
    </div>
  );

  const phase2 = (
    <div className="space-y-4">
      <p className={`text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>तीन gates पूछते हैं: क्या sum 9 के पार गया? C = K + Z8.Z4 + Z8.Z2.</>
          : <>Three gates ask: did the sum pass 9? C = K + Z8.Z4 + Z8.Z2.</>}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col items-center gap-2">
          <span className={`font-mono text-[10px] ${t.faint}`}>Z8 . Z4</span>
          <LiveGate type="AND" a={Z8} b={Z4} isDarkMode={isDarkMode} accent={accent} labelA="Z8" labelB="Z4" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className={`font-mono text-[10px] ${t.faint}`}>Z8 . Z2</span>
          <LiveGate type="AND" a={Z8} b={Z2} isDarkMode={isDarkMode} accent={accent} labelA="Z8" labelB="Z2" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className={`font-mono text-[10px] ${t.faint}`}>OR with K</span>
          <LiveGate type="OR" a={K} b={t2 | t3} isDarkMode={isDarkMode} accent={accent} labelA="K" labelB="ANDs" labelOut="C" />
        </div>
      </div>
      <div className="text-center font-mono text-[14px]" style={{ color: C ? ACC.good : t.faint }}>
        C = {K} + {t2} + {t3} = <b>{C}</b> {C ? '-> ADD 6' : '-> ADD 0'}
      </div>
    </div>
  );

  const phase3 = (
    <div className="space-y-4">
      <p className={`text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>Adder 2, phase-1 sum में {C ? '0110 (6)' : '0000 (0)'} जोड़ता है।</>
          : <>Adder 2 adds {C ? '0110 (6)' : '0000 (0)'} to the phase-1 sum.</>}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-lg">
        {mono(bin4(Z))}
        <Plus size={14} style={{ color: accent }} />
        <span style={{ color: C ? ACC.good : t.faint }}>{C ? '0110' : '0000'}</span>
        <span className={t.faint}>=</span>
        {mono(adder2bits, ACC.good)}
      </div>
      <div className="flex flex-col items-center gap-2">
        <BitRow bits={[S >> 3 & 1, S >> 2 & 1, S >> 1 & 1, S & 1]} labels={['S8', 'S4', 'S2', 'S1']} accent={ACC.good} isDarkMode={isDarkMode} litColor={ACC.good} />
      </div>
      <p className={`text-center text-[12px] ${t.faint}`}>
        {lang === 'hi'
          ? <>column का carry-out = C = <b style={{ color: ACC.II }}>{carryOut}</b> (adder-1 के overflow K या forbidden code से, adder-2 के bit-4 से नहीं)।</>
          : <>The column carry-out = C = <b style={{ color: ACC.II }}>{carryOut}</b> (from K or the forbidden code, not from adder-2's bit-4).</>}
      </p>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className={`rounded-2xl border p-4 text-center ${t.soft}`} style={{ borderColor: `${ACC.good}55` }}>
        <div className={`font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>{lang === 'hi' ? 'अंतिम BCD' : 'final BCD'}</div>
        <div className="mt-1 text-2xl font-black">
          <span className="font-mono" style={{ color: ACC.good }}>{bin4(carryOut)} {bin4(S)}</span>
          <span className={`ml-3 align-middle font-mono text-lg ${t.faint}`}>= {decimal}</span>
        </div>
      </motion.div>
    </div>
  );

  const steps = [
    { label: lang === 'hi' ? 'चरण 1 - binary जोड़' : 'Phase 1 - binary add', body: phase1 },
    { label: lang === 'hi' ? 'चरण 2 - overflow पहचान' : 'Phase 2 - detect overflow', body: phase2 },
    { label: lang === 'hi' ? 'चरण 3 - +6 सुधार' : 'Phase 3 - apply +6', body: phase3 },
  ];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        <span className={`font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>{lang === 'hi' ? 'preset चुनिए' : 'pick a preset'}</span>
        {PRESETS.map((p, k) => (
          <button key={p.id} onClick={() => setPi(k)}
            className="rounded-lg border px-3 py-1.5 font-mono text-[12px] font-black transition-colors"
            style={pi === k
              ? { background: accent, color: '#000', borderColor: accent }
              : { borderColor: `${accent}44`, color: accent, background: 'transparent' }}>
            {p.id}
          </button>
        ))}
        <span className={`ml-1 font-mono text-[11px] ${t.faint}`}>
          {pi === 1 ? (lang === 'hi' ? '(worst case, K=1)' : '(worst case, K=1)') : (lang === 'hi' ? '(forbidden six, K=0)' : '(forbidden six, K=0)')}
        </span>
      </div>
      {/* key on preset so the StepThrough resets to step 1 when preset changes */}
      <StepThrough key={pi} steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* section wrapper so the guided walkthrough gets its own titled block below the demo */
const PhaseSection: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <SceneShell>
      <section className="space-y-3">
        <Eyebrow accent={accent}>{lang === 'hi' ? 'तीन चरण - guided' : 'three phases - guided'}</Eyebrow>
        <h2 className={`text-2xl md:text-3xl font-black ${t.text}`}>
          {lang === 'hi' ? 'पूरी pipeline step-by-step चलाइए' : 'Run the whole pipeline step by step'}
        </h2>
        <p className={`max-w-2xl text-[14px] ${t.sub}`}>
          {lang === 'hi'
            ? '5+7 और 9+9+1 दोनों presets को तीन चरणों से चलाइए: binary जोड़, overflow पहचान, और +6 सुधार - हर bit code में गिना गया।'
            : 'Walk both presets, 5+7 and 9+9+1, through the three phases: binary add, detect overflow, and the +6 fix - every bit computed in code.'}
        </p>
      </section>
      <PhaseWalkthrough isDarkMode={isDarkMode} accent={accent} />
    </SceneShell>
  );
};

/* small header above the detect step-through */
const DetectReasoningHeader: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <div className="space-y-1.5 px-1">
      <Eyebrow accent={accent}>{lang === 'hi' ? 'क्यों यह formula ठीक 10..19 ढकता है' : 'why this formula covers exactly 10..19'}</Eyebrow>
      <p className={`text-[14px] ${t.sub}`}>
        {lang === 'hi'
          ? 'हर term कौन-कौन से मान जलाता है, step-by-step देखिए - K, फिर Z8.Z4, फिर Z8.Z2, फिर OR का मिलान।'
          : 'See which values each term lights, step by step - K, then Z8.Z4, then Z8.Z2, then the OR union.'}
      </p>
    </div>
  );
};

/* ───────── bespoke: why C covers exactly 10..19 (StepThrough, S04/S05) ─────────
   A guided proof. Each step lights up the values one term covers, building up to
   the full union 10..19, and shows 0..9 staying dark. Coverage is COMPUTED. */
const DetectReasoning: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);

  // for each raw sum 0..19 compute K, Z bits and each term's contribution.
  const rows = Array.from({ length: 20 }, (_, s) => {
    const K = s >= 16 ? 1 : 0;
    const Z = s - 16 * K;
    const Z8 = (Z >> 3) & 1, Z4 = (Z >> 2) & 1, Z2 = (Z >> 1) & 1;
    return { s, K, t2: Z8 & Z4, t3: Z8 & Z2, C: K | (Z8 & Z4) | (Z8 & Z2) };
  });

  const Strip: React.FC<{ pick: (r: typeof rows[number]) => boolean; color: string }> = ({ pick, color }) => (
    <div className="flex flex-wrap justify-center gap-1">
      {rows.map((r) => {
        const on = pick(r);
        return (
          <div key={r.s} className="flex h-8 w-8 items-center justify-center rounded-md font-mono text-[11px] font-black"
            style={{ background: on ? color : 'transparent', color: on ? '#000' : t.faint as string, border: `1px solid ${on ? color : (isDarkMode ? '#1e293b' : '#e2e8f0')}` }}>
            {r.s}
          </div>
        );
      })}
    </div>
  );

  const caption = (en: React.ReactNode, hi: React.ReactNode) => (
    <p className={`text-center text-[13px] ${t.sub}`}>{lang === 'hi' ? hi : en}</p>
  );

  const list = (rng: (r: typeof rows[number]) => boolean) => rows.filter(rng).map((r) => r.s).join(', ');

  const steps = [
    {
      label: lang === 'hi' ? 'लक्ष्य' : 'The target',
      body: (
        <div className="space-y-3">
          {caption(
            <>We want C = 1 for exactly the sums <b style={{ color: ACC.good }}>10 to 19</b>, and C = 0 for 0 to 9.</>,
            <>हम चाहते हैं C = 1 ठीक sums <b style={{ color: ACC.good }}>10 से 19</b> के लिए, और C = 0 for 0 से 9.</>)}
          <Strip pick={(r) => r.s >= 10} color={ACC.good} />
          <p className={`text-center font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'लक्ष्य set' : 'target set'}: {list((r) => r.s >= 10)}</p>
        </div>
      ),
    },
    {
      label: 'K',
      body: (
        <div className="space-y-3">
          {caption(
            <>The <b style={{ color: ACC.II }}>K</b> term (adder-1 carry-out) fires only when the binary sum reached 16, so it covers <b>16-19</b>.</>,
            <><b style={{ color: ACC.II }}>K</b> term (adder-1 का carry-out) तभी जलता है जब binary sum 16 तक पहुँचे, तो यह <b>16-19</b> ढकता है।</>)}
          <Strip pick={(r) => r.K === 1} color={ACC.II} />
          <p className={`text-center font-mono text-[11px] ${t.faint}`}>K=1: {list((r) => r.K === 1)}</p>
        </div>
      ),
    },
    {
      label: 'Z8 . Z4',
      body: (
        <div className="space-y-3">
          {caption(
            <>Within 10-15, <b style={{ color: ACC.III }}>Z8.Z4</b> is 1 when both the 8s and 4s bits are set: that is <b>12, 13, 14, 15</b> (8+4=12).</>,
            <>10-15 में, <b style={{ color: ACC.III }}>Z8.Z4</b> तब 1 है जब 8s और 4s दोनों bits set हों: यानी <b>12, 13, 14, 15</b> (8+4=12)।</>)}
          <Strip pick={(r) => r.t2 === 1} color={ACC.III} />
          <p className={`text-center font-mono text-[11px] ${t.faint}`}>Z8.Z4=1: {list((r) => r.t2 === 1)}</p>
        </div>
      ),
    },
    {
      label: 'Z8 . Z2',
      body: (
        <div className="space-y-3">
          {caption(
            <><b style={{ color: accent }}>Z8.Z2</b> is 1 when the 8s and 2s bits are set: that catches <b>10, 11, 14, 15</b> (8+2=10).</>,
            <><b style={{ color: accent }}>Z8.Z2</b> तब 1 है जब 8s और 2s bits set हों: यह पकड़ता है <b>10, 11, 14, 15</b> (8+2=10)।</>)}
          <Strip pick={(r) => r.t3 === 1} color={accent} />
          <p className={`text-center font-mono text-[11px] ${t.faint}`}>Z8.Z2=1: {list((r) => r.t3 === 1)}</p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'मिलान (OR)' : 'Union (OR)',
      body: (
        <div className="space-y-3">
          {caption(
            <>OR all three: K covers 16-19, Z8.Z4 adds 12-15, Z8.Z2 fills 10, 11. The gap (10, 11) is exactly why we need the second AND - and the union is perfectly <b style={{ color: ACC.good }}>10-19</b>, never 0-9.</>,
            <>तीनों को OR कीजिए: K देता है 16-19, Z8.Z4 जोड़ता है 12-15, Z8.Z2 भरता है 10, 11. यही gap (10, 11) दूसरे AND की ज़रूरत है - और union बिलकुल <b style={{ color: ACC.good }}>10-19</b> है, कभी 0-9 नहीं।</>)}
          <Strip pick={(r) => r.C === 1} color={ACC.good} />
          <p className={`text-center font-mono text-[11px] ${t.faint}`}>C=1: {list((r) => r.C === 1)}</p>
          <div className={`mx-auto max-w-md rounded-xl border p-3 text-center text-[12px] ${t.soft}`} style={{ borderColor: `${ACC.good}44` }}>
            <Check size={14} className="mr-1 inline" style={{ color: ACC.good }} />
            {lang === 'hi'
              ? <>पुष्टि: C=1 का set ठीक {`{10..19}`} है, और 0-9 में कोई भी C=1 नहीं।</>
              : <>Verified: the C=1 set is exactly {`{10..19}`}, with no C=1 anywhere in 0-9.</>}
          </div>
        </div>
      ),
    },
  ];

  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

/* ───────── bespoke: BCD state matrix (S05 truth) - now with a computed, exhaustive 0..19 map ───────── */
const BcdStateMatrix: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  // exhaustive computed verification of every raw sum 0..19
  const detail = Array.from({ length: 20 }, (_, s) => {
    const K = s >= 16 ? 1 : 0;
    const Z = s - 16 * K;
    const Z8 = (Z >> 3) & 1, Z4 = (Z >> 2) & 1, Z2 = (Z >> 1) & 1;
    const C = K | (Z8 & Z4) | (Z8 & Z2);
    const digit = (Z + (C ? 6 : 0)) & 15;     // corrected BCD digit nibble
    const carry = C;                          // column carry-out is C (K=1 case keeps adder-2 < 16)
    return { s, K, C, bcd: `${carry} ${bin4(digit)}`, dec: carry * 10 + digit };
  });

  return (
    <div className="space-y-5">
      <TruthTable isDarkMode={isDarkMode} accent={accent}
        headers={['Sum range', 'K', 'C', 'Action']}
        rows={[
          { cells: ['0 - 9', 0, 0, 'ADD 0'] },
          { cells: ['10 - 15', 0, 1, 'ADD 6'], highlight: true },
          { cells: ['16 - 19', 1, 1, 'ADD 6'], highlight: true },
        ]}
        note={lang === 'hi'
          ? 'C = 1 ठीक उन्हीं rows में जिन्हें सुधार चाहिए, और सुधार हमेशा वही स्थिरांक: 6 जोड़ो (0110).'
          : 'C = 1 in exactly the rows that need fixing, and the fix is always the same constant: add 6 (0110).'} />

      <Card isDarkMode={isDarkMode}>
        <div className={`mb-3 font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>
          {lang === 'hi' ? 'हर कच्चा sum 0..19, code में सत्यापित' : 'every raw sum 0..19, verified in code'}
        </div>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 md:grid-cols-5">
          {detail.map((d) => (
            <div key={d.s} className="rounded-lg border p-2 text-center font-mono"
              style={{ borderColor: d.C ? `${ACC.good}44` : (isDarkMode ? '#1e293b' : '#e2e8f0'), background: d.C ? `${ACC.good}10` : 'transparent' }}>
              <div className="text-[13px] font-black" style={{ color: d.C ? ACC.good : (t.ink as string) }}>{d.s}</div>
              <div className={`text-[9px] ${t.faint}`}>K{d.K} C{d.C}</div>
              <div className="text-[10px] font-bold" style={{ color: d.C ? ACC.good : (t.faint as string) }}>{d.bcd}</div>
            </div>
          ))}
        </div>
        <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
          {lang === 'hi'
            ? <>हरे cells वे हैं जहाँ C=1 (+6 लगा)। ध्यान दीजिए हर BCD digit अब 0-9 में है और carry सही है।</>
            : <>Green cells are where C=1 (+6 applied). Notice every resulting BCD digit is now 0-9 and the carry is correct.</>}
        </p>
      </Card>
    </div>
  );
};

/* The two-adder schematic now lives in _subtractor/circuit.tsx as the clean,
   interactive BcdAdderCircuit (a sum slider lights K, Z, the detection gates,
   the C signal and the +6 correction path). */

/* ───────── bespoke: full BCD adder demo (S07 activity) ───────── */
const BcdAdderDemo: React.FC<{ isDarkMode: boolean; accent: string; scene: SubScene }> = ({ isDarkMode, accent, scene }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [A, setA] = useState(5);
  const [B, setB] = useState(7);
  const [Cin, setCin] = useState(0);

  const binSum = A + B + Cin;
  const K = binSum >= 16 ? 1 : 0;
  const Z = binSum - 16 * K;
  const Z8 = (Z >> 3) & 1, Z4 = (Z >> 2) & 1, Z2 = (Z >> 1) & 1;
  const C = K | (Z8 & Z4) | (Z8 & Z2);
  const add6 = C ? 6 : 0;
  const S = (Z + add6) & 15;
  const carryOut = C;
  const decimal = carryOut * 10 + S;

  const Stepper: React.FC<{ label: string; val: number; set: (n: number) => void; max: number; color: string }> = ({ label, val, set, max, color }) => (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color }}>{label}</span>
      <div className="flex items-center gap-2">
        <button onClick={() => set(Math.max(0, val - 1))} className={`h-8 w-8 rounded-lg border font-black ${t.soft} ${t.sub}`}>-</button>
        <span className="w-8 text-center text-2xl font-black tabular-nums" style={{ color }}>{val}</span>
        <button onClick={() => set(Math.min(max, val + 1))} className={`h-8 w-8 rounded-lg border font-black ${t.soft} ${t.sub}`}>+</button>
      </div>
    </div>
  );

  return (
    <SceneShell>
      <section className="space-y-3">
        <Eyebrow accent={accent}>{scene.label}</Eyebrow>
        {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${t.text}`}>{scene.subtitle}</h2>}
      </section>

      <Card isDarkMode={isDarkMode}>
        <div className="flex flex-wrap items-end justify-center gap-6">
          <Stepper label="A" val={A} set={setA} max={9} color={ACC.I} />
          <span className="pb-2 text-2xl font-black" style={{ color: t.faint }}>+</span>
          <Stepper label="B" val={B} set={setB} max={9} color={ACC.I} />
          <span className="pb-2 text-2xl font-black" style={{ color: t.faint }}>+</span>
          <Stepper label="carry-in" val={Cin} set={setCin} max={1} color={ACC.II} />
          <div className="flex flex-wrap gap-2 pb-1">
            {[['5+7', 5, 7, 0], ['8+5', 8, 5, 0], ['9+9+1', 9, 9, 1]].map(([l, na, nb, nc]) => (
              <button key={l as string} onClick={() => { setA(na as number); setB(nb as number); setCin(nc as number); }}
                className={`rounded-lg border px-3 py-1.5 font-mono text-[12px] ${t.soft} ${t.sub} hover:opacity-80`}>{l}</button>
            ))}
          </div>
        </div>

        {/* phase 1: raw sum */}
        <div className={`mt-6 rounded-2xl border p-4 ${t.soft}`}>
          <div className={`font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>{lang === 'hi' ? 'चरण 1 · कच्चा sum (Adder 1)' : 'Phase 1 · raw sum (Adder 1)'}</div>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <span className="font-mono text-lg font-black" style={{ color: accent }}>{A} + {B} + {Cin} = {binSum}</span>
            <span className={`font-mono text-sm ${t.sub}`}>K = <b style={{ color: ACC.II }}>{K}</b></span>
            <span className={`font-mono text-sm ${t.sub}`}>Z8 Z4 Z2 Z1 = <b style={{ color: t.ink }}>{bin4(Z)}</b></span>
          </div>
        </div>

        {/* phase 2: detect */}
        <div className="my-2 flex justify-center"><ArrowDown size={18} style={{ color: t.faint }} /></div>
        <motion.div key={`det-${C}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`rounded-2xl border p-4 ${t.soft}`} style={{ borderColor: `${C ? ACC.good : t.faint}44` }}>
          <div className={`font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>{lang === 'hi' ? 'चरण 2 · पहचान' : 'Phase 2 · detect'}</div>
          <div className="mt-2 font-mono text-sm" style={{ color: C ? ACC.good : t.faint }}>
            C = K + Z8.Z4 + Z8.Z2 = {K} + {Z8 & Z4} + {Z8 & Z2} = <b>{C}</b>
            {C ? (lang === 'hi' ? '  -> ADD 6' : '  -> ADD 6') : (lang === 'hi' ? '  -> ADD 0' : '  -> ADD 0')}
          </div>
        </motion.div>

        {/* phase 3: correct */}
        <div className="my-2 flex justify-center"><ArrowDown size={18} style={{ color: t.faint }} /></div>
        <div className={`rounded-2xl border p-4 ${t.soft}`}>
          <div className={`font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>{lang === 'hi' ? 'चरण 3 · सुधार (Adder 2)' : 'Phase 3 · correct (Adder 2)'}</div>
          <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-sm">
            <span className={t.sub}>{bin4(Z)}</span>
            <Plus size={13} style={{ color: accent }} />
            <span style={{ color: C ? ACC.good : t.faint }}>{C ? '0110' : '0000'}</span>
            <span className={t.faint}>=</span>
            <span className="text-lg font-black" style={{ color: ACC.good }}>{carryOut} {bin4(S)}</span>
          </div>
        </div>

        <motion.p key={decimal} initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className={`mt-5 text-center text-2xl font-black ${t.text}`}>
          BCD = <span className="font-mono" style={{ color: ACC.good }}>{bin4(carryOut)} {bin4(S)}</span>
          <span className={`ml-3 align-middle font-mono text-lg ${t.faint}`}>= {decimal}</span>
        </motion.p>
      </Card>
    </SceneShell>
  );
};

/* ───────── part assignment ───────── */
const partAt = (i: number): string =>
  i <= 3 ? 'PART I · THE FORBIDDEN SIX'
    : i <= 6 ? 'PART II · THE +6 FIX'
      : 'PART III · BUILD IT';

const bespokeFor = (scene: SubScene): React.ReactNode => {
  const key = scene.id.toLowerCase();
  if (key.includes('forbidden')) return 'odometer';
  if (key.includes('gap')) return 'gap';
  if (key.includes('detect')) return 'detect';
  return null;
};

function componentFor(scene: SubScene): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="BCD Adder" />;
    case 'video':
      return (p) => <VideoScene {...p} scene={scene} src="/videos/bcd-adder-odometer.mp4" />;
    case 'truth':
      return (p) => <TheoryScene {...p} scene={scene}><BcdStateMatrix isDarkMode={p.isDarkMode} accent={p.accent} /></TheoryScene>;
    case 'circuit':
      return (p) => <TheoryScene {...p} scene={scene}><BcdAdderCircuit isDarkMode={p.isDarkMode} accent={p.accent} /></TheoryScene>;
    case 'activity':
      return (p) => (
        <>
          <BcdAdderDemo {...p} scene={scene} />
          <PhaseSection isDarkMode={p.isDarkMode} accent={p.accent} />
        </>
      );
    case 'flashcards':
      return (p) => (
        <SceneShell>
          <section className="space-y-3"><Eyebrow accent={p.accent}>{scene.label}</Eyebrow>
            {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${tone(p.isDarkMode).text}`}>{scene.subtitle}</h2>}</section>
          <SubFlashCards isDarkMode={p.isDarkMode} accent={p.accent} cards={CONTENT.flashcards} />
        </SceneShell>
      );
    case 'quiz':
      return (p) => <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="BCD ADDER" tag="Practice · BCD Adder" title={scene.label} intro={scene.subtitle ?? ''} />;
    case 'recap':
      return (p) => <RecapScene {...p} scene={scene} />;
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'odometer' && <OdometerWheel isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'gap' && <GapLine isDarkMode={p.isDarkMode} />}
          {which === 'detect' && (
            <div className="space-y-6">
              <DetectFormula isDarkMode={p.isDarkMode} accent={p.accent} />
              <DetectReasoningHeader isDarkMode={p.isDarkMode} accent={p.accent} />
              <DetectReasoning isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
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
