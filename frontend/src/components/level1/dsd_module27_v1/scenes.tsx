/**
 * Binary Dividers (dsd/27) - "The Chocolate Sharing Grid".
 * Generic scenes come from the shared _subtractor kit; the chocolate round
 * counter, the controlled-subtractor cell (full subtractor + restore MUX shown
 * with live gates and a truth table), the cascading array grid, the restoring
 * long-division StepThrough derivation, the array sizer and the kit's
 * ArrayDividerViz are bespoke. Every boolean / arithmetic result is COMPUTED in
 * code here, never trusted to prose.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ArrowRight, RotateCw, Check, X } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene, StepThrough,
  LiveGate, TruthTable, WorkbenchCTA, type SubScene,
} from '../_subtractor/kit';
import { ArrayDividerViz, BitToggle } from '../_combo/blocks';
import { TryItYourself } from '../../ui/TryItYourself';
import type { SubPage } from '../_subtractor/SubEngine';
import { CONTENT } from './content';

const SRC_EN: string | undefined = '/videos/dsd27-dividers.mp4';
const SRC_HI: string | undefined = undefined;

const ACC = { I: '#38bdf8', II: '#f59e0b', III: '#fb7185', good: '#34d399' };
const bin = (n: number, w: number) => (n < 0 ? '-' : '') + Math.abs(n).toString(2).padStart(w, '0');

/* ───────── bespoke: chocolate round counter (S00/S02 analogy) ─────────
   20 chocolates shared among 4. Each click runs one round: if the pile can
   afford one more full share (>= divisor) deal it and write q=1, else write q=0.
   All values computed; the quotient builds bit by bit and the leftover = remainder. */
const ChocolateRounds: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const TOTAL = 20, SHARE = 4;
  const [round, setRound] = useState(0);   // 0..5 rounds done

  // compute the full schedule of rounds in code
  const sched: { pile: number; fit: boolean; q: number; after: number }[] = [];
  let pile = TOTAL;
  for (let r = 0; r < 6; r++) {
    const fit = pile >= SHARE;
    const after = fit ? pile - SHARE : pile;
    sched.push({ pile, fit, q: fit ? 1 : 0, after });
    pile = after;
  }
  const done = sched.slice(0, round);
  const remaining = round === 0 ? TOTAL : sched[round - 1].after;
  const quotient = done.reduce((a, s) => a * 2 + s.q, 0);
  const remainder = remaining;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 flex items-center justify-center gap-2">
        <Cookie size={18} style={{ color: accent }} />
        <span className={`font-mono text-[11px] uppercase tracking-[0.3em] ${t.faint}`}>
          {lang === 'hi' ? '20 chocolates, 4 बच्चे' : '20 chocolates, 4 children'}
        </span>
      </div>

      {/* the pile */}
      <div className="mx-auto flex max-w-md flex-wrap justify-center gap-1.5">
        {Array.from({ length: TOTAL }, (_, i) => {
          const gone = i >= remaining;
          return (
            <motion.span key={i} animate={{ opacity: gone ? 0.18 : 1, scale: gone ? 0.85 : 1 }}
              className="text-xl" title={gone ? 'dealt' : 'in pile'}>
              {gone ? '·' : '🍫'}
            </motion.span>
          );
        })}
      </div>

      <p className={`mt-3 text-center font-mono text-[13px] ${t.sub}`}>
        {lang === 'hi' ? 'pile में बचे' : 'left in pile'}: <b style={{ color: accent }}>{remaining}</b>
        {round > 0 && <> · quotient {lang === 'hi' ? 'बनता' : 'so far'} = <b style={{ color: ACC.good }}>{bin(quotient, round)}</b> ({quotient})</>}
      </p>

      {/* round log */}
      <div className="mt-4 space-y-1.5">
        {done.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-1.5 font-mono text-[12px] ${t.soft}`}>
            <span className={t.faint as string}>{lang === 'hi' ? `round ${i + 1}` : `round ${i + 1}`} · pile {s.pile}</span>
            <span>
              {s.fit
                ? <b style={{ color: ACC.good }}>{lang === 'hi' ? `4 बाँटे, q=1` : `deal 4, q=1`}</b>
                : <b style={{ color: t.faint as string }}>{lang === 'hi' ? `4 नहीं बचे, q=0` : `< 4 left, q=0`}</b>}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <button onClick={() => setRound((r) => Math.min(6, r + 1))} disabled={round >= 6}
          className="rounded-xl px-4 py-2 font-mono text-[12px] font-black text-black active:scale-95 disabled:opacity-30"
          style={{ background: accent }}>
          {lang === 'hi' ? 'अगला round' : 'next round'}
        </button>
        <button onClick={() => setRound(0)}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 font-mono text-[12px] ${t.soft} ${t.faint}`}>
          <RotateCw size={12} /> {lang === 'hi' ? 'reset' : 'reset'}
        </button>
      </div>

      {round >= 6 && (
        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className={`mt-4 text-center text-[15px] font-black ${t.text}`}>
          20 / 4 = <span style={{ color: ACC.good }}>{quotient}</span> {lang === 'hi' ? 'शेष' : 'remainder'} <span style={{ color: ACC.II }}>{remainder}</span>
          <span className={`ml-2 font-mono text-[12px] ${t.faint}`}>(101 · {lang === 'hi' ? 'हर सफल round एक 1 है' : 'each successful round is a 1'})</span>
        </motion.p>
      )}
    </Card>
  );
};

/* ───────── bespoke: the controlled-subtractor cell (S04) ─────────
   A single cell with toggleable x, y, bin. The full subtractor computes D and
   bout in code; the borrow-out drives a 2-to-1 MUX whose live path is highlighted
   (borrow 0 -> pass D, borrow 1 -> restore x). CellOut and q are computed. */
const CellRouter: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [x, setX] = useState(1);
  const [y, setY] = useState(1);
  const [bin0, setBin0] = useState(0);

  // full subtractor (computed)
  const D = x ^ y ^ bin0;
  const bout = ((x ^ 1) & y) | ((x ^ 1) & bin0) | (y & bin0);
  // restore MUX: select = bout, I0 = D, I1 = x
  const cellOut = bout ? x : D;
  const q = bout ^ 1;
  const path0 = bout === 0;

  const Wire: React.FC<{ label: string; on: number; color: string; active?: boolean }> = ({ label, on, color, active }) => (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[11px]" style={{ color: active ? color : (t.faint as string) }}>{label}</span>
      <BitToggle value={on} color={active ? color : '#64748b'} size={28} />
    </div>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'controlled subtractor cell · toggle inputs' : 'controlled subtractor cell · toggle inputs'}
      </div>

      <div className="flex items-center justify-center gap-3">
        <BitToggle value={x} onClick={() => setX((v) => v ^ 1)} color={ACC.I} label="x" sub={lang === 'hi' ? 'minuend' : 'minuend'} size={38} />
        <BitToggle value={y} onClick={() => setY((v) => v ^ 1)} color={ACC.III} label="y" sub={lang === 'hi' ? 'divisor' : 'divisor'} size={38} />
        <BitToggle value={bin0} onClick={() => setBin0((v) => v ^ 1)} color={ACC.II} label="bin" sub="borrow-in" size={38} />
      </div>

      {/* full subtractor outputs */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <span className={`font-mono text-[10px] ${t.faint}`}>D = x ^ y ^ bin</span>
          <LiveGate type="XOR" a={x ^ y} b={bin0} isDarkMode={isDarkMode} accent={accent} labelA="x^y" labelB="bin" labelOut="D" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className={`font-mono text-[10px] ${t.faint}`}>bout (sign)</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg font-mono text-lg font-black"
            style={{ background: bout ? ACC.III : 'transparent', color: bout ? '#000' : ACC.III, border: `2px solid ${ACC.III}` }}>{bout}</span>
        </div>
      </div>

      {/* the restore MUX, live path */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="flex flex-col gap-2">
          <div className="rounded-lg px-2 py-1" style={{ background: path0 ? `${ACC.good}1a` : 'transparent', border: path0 ? `1px solid ${ACC.good}` : '1px solid transparent' }}>
            <Wire label="I0 = D" on={D} color={ACC.good} active={path0} />
          </div>
          <div className="rounded-lg px-2 py-1" style={{ background: !path0 ? `${ACC.II}1a` : 'transparent', border: !path0 ? `1px solid ${ACC.II}` : '1px solid transparent' }}>
            <Wire label="I1 = x" on={x} color={ACC.II} active={!path0} />
          </div>
        </div>
        <svg viewBox="0 0 70 90" className="w-[60px]">
          <polygon points="8,8 48,26 48,64 8,82" fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke={accent} strokeWidth="2" />
          <text x="26" y="44" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={t.faint as string}>2:1</text>
          <text x="26" y="78" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={accent}>S=bout</text>
          <motion.line key={cellOut} x1="48" y1="45" x2="68" y2="45" stroke={cellOut ? accent : '#64748b'} strokeWidth="3"
            animate={{ opacity: cellOut ? [0.5, 1, 0.5] : 1 }} transition={{ repeat: cellOut ? Infinity : 0, duration: 1.2 }} />
        </svg>
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[11px]" style={{ color: accent }}>CellOut</span>
          <BitToggle value={cellOut} color={accent} size={44} />
        </div>
      </div>

      <p className={`mt-4 text-center font-mono text-[13px] ${t.sub}`}>
        {path0
          ? <>bout=0 {'->'} {lang === 'hi' ? 'fit हुआ, difference रखो' : 'it fit, keep the difference'} <b style={{ color: ACC.good }}>D={D}</b>, q=1</>
          : <>bout=1 {'->'} {lang === 'hi' ? 'underflow, minuend restore करो' : 'underflow, restore the minuend'} <b style={{ color: ACC.II }}>x={x}</b>, q=0</>}
        {' · '}q = bout' = <b style={{ color: q ? ACC.good : (t.faint as string) }}>{q}</b>
      </p>
    </Card>
  );
};

/* ───────── bespoke: full-subtractor truth table (S05) ─────────
   All 8 rows computed; D = x^y^bin, bout = x'.y + x'.bin + y.bin. */
const FullSubTable: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const rows = Array.from({ length: 8 }, (_, i) => {
    const x = (i >> 2) & 1, y = (i >> 1) & 1, b = i & 1;
    const D = x ^ y ^ b;
    const bout = ((x ^ 1) & y) | ((x ^ 1) & b) | (y & b);
    return { cells: [x, y, b, D, bout], highlight: bout === 1 };
  });
  return (
    <TruthTable isDarkMode={isDarkMode} accent={accent}
      headers={['x', 'y', 'bin', 'D', 'bout']}
      rows={rows}
      note={lang === 'hi'
        ? 'D = x ^ y ^ bin (parity) · bout = x\'.y + x\'.bin + y.bin (inverter minuend x पर) · हाइलाइट rows वे हैं जहाँ borrow निकला।'
        : 'D = x ^ y ^ bin (parity) · bout = x\'.y + x\'.bin + y.bin (inverter on the minuend x) · highlighted rows are where a borrow is generated.'} />
  );
};

/* ───────── bespoke: cascading array grid (S07) ─────────
   Builds the restoring array for a chosen dividend/divisor and animates the
   per-row trial subtraction. Every row sign / quotient bit / remainder computed. */
const ArrayGrid: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [dividend, setDividend] = useState(11); // 4-bit
  const [divisor, setDivisor] = useState(3);    // <=4 bit, >0
  const W = 4;

  // restoring division, MSB first; capture each row's pile, trial, fit, q
  const rows: { idx: number; pile: number; trial: number; fit: boolean; q: number; kept: number }[] = [];
  let rem = 0;
  for (let i = W - 1; i >= 0; i--) {
    const pileBefore = (rem << 1) | ((dividend >> i) & 1);
    const trial = pileBefore - divisor;
    const fit = trial >= 0;
    const kept = fit ? trial : pileBefore;
    rem = kept;
    rows.push({ idx: W - 1 - i, pile: pileBefore, trial, fit, q: fit ? 1 : 0, kept });
  }
  const quotient = rows.reduce((a, r) => (a << 1) | r.q, 0);
  const remainder = rem;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'cascading array · हर row एक quotient bit' : 'cascading array · one quotient bit per row'}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-[13px]">
        <label className="flex items-center gap-2">{lang === 'hi' ? 'dividend' : 'dividend'}
          <input type="range" min={0} max={15} value={dividend} onChange={(e) => setDividend(+e.target.value)} style={{ accentColor: ACC.I }} />
          <b style={{ color: ACC.I }}>{dividend} ({bin(dividend, 4)})</b>
        </label>
        <label className="flex items-center gap-2">{lang === 'hi' ? 'divisor' : 'divisor'}
          <input type="range" min={1} max={15} value={divisor} onChange={(e) => setDivisor(+e.target.value)} style={{ accentColor: ACC.III }} />
          <b style={{ color: ACC.III }}>{divisor} ({bin(divisor, 4)})</b>
        </label>
      </div>

      {/* one strip per row */}
      <div className="mt-4 space-y-2">
        {rows.map((r) => (
          <motion.div key={r.idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: r.idx * 0.06 }}
            className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 ${t.soft}`}
            style={{ borderColor: r.fit ? `${ACC.good}55` : `${ACC.II}55` }}>
            <span className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? `row ${r.idx}` : `row ${r.idx}`}</span>
            <span className="font-mono text-[12px]">
              pile {r.pile} - {divisor} = {r.fit
                ? <b style={{ color: ACC.good }}>{r.trial} {'>='} 0</b>
                : <b style={{ color: ACC.II }}>{r.trial} {'<'} 0</b>}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[12px]">
              {r.fit ? <Check size={13} style={{ color: ACC.good }} /> : <X size={13} style={{ color: ACC.II }} />}
              <span className={t.faint as string}>borrow={r.fit ? 0 : 1}</span>
              <ArrowRight size={12} className={t.faint as string} />
              <span className="font-black" style={{ color: r.fit ? ACC.good : (t.faint as string) }}>q={r.q}</span>
            </span>
            <span className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'नीचे' : 'down'} {r.kept}</span>
          </motion.div>
        ))}
      </div>

      <p className={`mt-4 text-center font-mono text-[15px] font-black ${t.text}`}>
        Q = <span style={{ color: ACC.good }}>{bin(quotient, 4)}</span> ({quotient}) · R = <span style={{ color: ACC.II }}>{bin(remainder, 4)}</span> ({remainder})
        <span className={`ml-2 block text-[12px] font-normal ${t.faint}`}>
          {lang === 'hi' ? 'जाँच' : 'check'}: {divisor} . {quotient} + {remainder} = {divisor * quotient + remainder} = {dividend}
        </span>
      </p>
    </Card>
  );
};

/* ───────── bespoke: array sizer (S09) ─────────
   Slider for n; reports widths, rows, ~n^2 cells, worst-case ripple delay. */
const ArraySizer: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [n, setN] = useState(4);
  const cells = n * n;
  const delay = 2 * n; // borrow across n + remainder down n, in cell-delays (order of magnitude)

  const Stat: React.FC<{ label: string; value: React.ReactNode; color?: string }> = ({ label, value, color }) => (
    <div className={`rounded-2xl border p-4 text-center ${t.soft}`}>
      <div className={`font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>{label}</div>
      <div className="mt-1 text-2xl font-black" style={{ color: color ?? (t.ink as string) }}>{value}</div>
    </div>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex items-center gap-3">
        <span className={`font-mono text-[12px] ${t.faint}`}>n (divisor width)</span>
        <input type="range" min={2} max={8} value={n} onChange={(e) => setN(+e.target.value)} className="flex-1" style={{ accentColor: accent }} />
        <span className="w-8 text-right font-mono text-xl font-black" style={{ color: accent }}>{n}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label={lang === 'hi' ? 'dividend' : 'dividend'} value={`${2 * n} bit`} color={ACC.I} />
        <Stat label={lang === 'hi' ? 'quotient / remainder' : 'quotient / remainder'} value={`${n} bit`} color={ACC.good} />
        <Stat label="rows" value={n} color={accent} />
        <Stat label={lang === 'hi' ? 'cells (~n^2)' : 'cells (~n^2)'} value={cells} color={ACC.III} />
        <Stat label={lang === 'hi' ? 'cells/row' : 'cells/row'} value={n} />
        <Stat label={lang === 'hi' ? 'worst-case delay (~2n)' : 'worst-case delay (~2n)'} value={`~${delay}`} color={ACC.II} />
      </div>
      <p className={`mt-4 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>n दुगुना करने पर cells लगभग चौगुने ({cells}) - बड़ा area, गहरा ripple path।</>
          : <>Double n and the cells roughly quadruple (now {cells}) - more area and a deeper ripple path.</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: master derivation StepThrough (S07 / proofs) ─────────
   The spec's master derivation: restoring long division -> combinational array. */
const DerivationSteps: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const body = (en: React.ReactNode, hi: React.ReactNode) => (
    <p className={`text-[14px] leading-relaxed ${t.sub}`}>{lang === 'hi' ? hi : en}</p>
  );
  const steps = [
    {
      label: lang === 'hi' ? 'लक्ष्य' : 'The goal',
      body: body(
        <>Divide a 2n-bit dividend D by an n-bit divisor M into an n-bit quotient Q and an n-bit remainder R, with D = Q*M + R and 0 &lt;= R &lt; M.</>,
        <>एक 2n-bit dividend D को एक n-bit divisor M से एक n-bit quotient Q और एक n-bit remainder R में बाँटिए, D = Q*M + R और 0 &lt;= R &lt; M के साथ।</>),
    },
    {
      label: lang === 'hi' ? 'sequential algorithm' : 'Sequential restoring',
      body: body(
        <>Per iteration: shift the partial remainder left (bring in the next dividend bit), trial-subtract M, inspect the sign. If the result is non-negative the divisor fit (q=1); if negative, set q=0 and restore by adding M back.</>,
        <>हर iteration: partial remainder बाएँ shift कीजिए (अगला dividend bit लाइए), M trial-subtract कीजिए, sign देखिए। non-negative हो तो divisor fit (q=1); negative हो तो q=0 कीजिए और M वापस जोड़कर restore कीजिए।</>),
    },
    {
      label: lang === 'hi' ? 'time से space' : 'Time to space',
      body: body(
        <>The shift-left of the remainder is purely positional. Instead of shifting bits in time, WIRE each row to the divisor aligned one position right of the row above - "shift remainder left" becomes "shift divisor right per row".</>,
        <>remainder का shift-left पूरी तरह positional है। bits को समय में shift करने के बजाय, हर row को divisor से ऊपर वाली row के एक position दाईं ओर align करके WIRE कीजिए - "remainder बाएँ shift" बन जाता है "divisor हर row दाएँ shift"।</>),
    },
    {
      label: lang === 'hi' ? 'row sign = quotient bit' : 'Row sign = quotient bit',
      body: body(
        <>Stack n rows, one per quotient bit. Within a row the borrow ripples LSB to MSB; the final borrow Bout is the sign of the trial difference. Sequentially q=1 when the sign is non-negative, so in the array q_i = NOT(Bout_i).</>,
        <>n rows जमाइए, हर quotient bit के लिए एक। एक row में borrow LSB से MSB तक ripple होता है; final borrow Bout trial difference का sign है। sequentially sign non-negative होने पर q=1, तो array में q_i = NOT(Bout_i)।</>),
    },
    {
      label: lang === 'hi' ? 'restore = वही signal' : 'Restore = same signal',
      body: body(
        <>The restore decision uses the SAME Bout: if Bout=1 keep the original minuend (restore), if Bout=0 keep the difference. So Bout drives a 2:1 MUX per cell - no add-back hardware needed. The cell = full subtractor + 2:1 MUX.</>,
        <>restore फ़ैसला वही Bout वापरता है: Bout=1 हो तो मूल minuend रखो (restore), Bout=0 हो तो difference रखो। तो Bout हर cell में एक 2:1 MUX चलाता है - कोई add-back hardware नहीं चाहिए। cell = full subtractor + 2:1 MUX।</>),
    },
    {
      label: lang === 'hi' ? 'गिनती' : 'Counting',
      body: body(
        <>n rows x n cells = about n^2 controlled-subtractor cells form the parallelogram. The n inverted row signs are the quotient; the bottom row's selected outputs are the n-bit remainder. The array IS the unrolled restoring algorithm.</>,
        <>n rows x n cells = लगभग n^2 controlled-subtractor cells parallelogram बनाते हैं। n उल्टे row signs quotient हैं; नीचे वाली row के चुने outputs n-bit remainder हैं। array ही unrolled restoring algorithm है।</>),
    },
  ];
  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

/* ───────── part assignment ───────── */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE IDEA'
    : i <= Math.floor(n * 0.55) ? 'PART II · THE LOGIC'
      : i < n - 2 ? 'PART III · BUILD IT'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  const key = `${scene.id} ${scene.label}`.toLowerCase();
  if (/identity|computes/.test(key)) return 'chocolate';
  if (/unitcell|controlled/.test(key)) return 'cell';
  if (/fullsub/.test(key)) return 'fullsub';
  if (/mux|restore switch/.test(key)) return 'mux';
  if (/array|cascading/.test(key)) return 'array';
  if (/readout|read-out/.test(key)) return 'readout';
  if (/sizing/.test(key)) return 'sizing';
  if (/build/.test(key)) return 'build';
  return null;
};

function componentFor(scene: SubScene, i: number, n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="Dividers · Long Division in Hardware" hero={<ChocolateRounds isDarkMode={p.isDarkMode} accent={p.accent} />} />;
    case 'video':
      return (p) => <VideoScene {...p} scene={scene} src={SRC_EN ?? SRC_HI} />;
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
      return (p) => <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="DIVIDERS" tag="Practice · Binary Dividers" title={scene.label} intro={scene.subtitle ?? ''} />;
    case 'recap':
      return (p) => <RecapScene {...p} scene={scene} />;
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'chocolate' && (
            <div className="relative">
              <TryItYourself corner />
              <ChocolateRounds isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'cell' && (
            <div className="relative">
              <TryItYourself corner />
              <CellRouter isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'fullsub' && <FullSubTable isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'mux' && (
            <div className="space-y-6">
              <Card isDarkMode={p.isDarkMode}>
                <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: p.accent }}>Y = S'.I0 + S.I1</div>
                <div className="flex flex-wrap items-center justify-center gap-6">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`font-mono text-[10px] ${tone(p.isDarkMode).faint}`}>S' . I0 path</span>
                    <LiveGate type="AND" a={1} b={1} isDarkMode={p.isDarkMode} accent={p.accent} labelA="S'" labelB="I0" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className={`font-mono text-[10px] ${tone(p.isDarkMode).faint}`}>S . I1 path</span>
                    <LiveGate type="AND" a={0} b={1} isDarkMode={p.isDarkMode} accent={p.accent} labelA="S" labelB="I1" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className={`font-mono text-[10px] ${tone(p.isDarkMode).faint}`}>OR {'->'} Y</span>
                    <LiveGate type="OR" a={1} b={0} isDarkMode={p.isDarkMode} accent={p.accent} labelA="S'.I0" labelB="S.I1" labelOut="Y" />
                  </div>
                </div>
              </Card>
              <div className="relative">
                <TryItYourself corner />
                <CellRouter isDarkMode={p.isDarkMode} accent={p.accent} />
              </div>
            </div>
          )}
          {which === 'array' && (
            <div className="space-y-6">
              <div className="relative">
                <TryItYourself corner />
                <ArrayGrid isDarkMode={p.isDarkMode} accent={p.accent} />
              </div>
              <DerivationSteps isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'readout' && (
            <div className="relative">
              <TryItYourself corner />
              <ArrayDividerViz isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'sizing' && (
            <div className="relative">
              <TryItYourself corner />
              <ArraySizer isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <WorkbenchCTA
              isDarkMode={p.isDarkMode} accent={p.accent}
              tutorial="array-divider-cell"
              titleEN="Build the Binary Dividers for real"
              titleHI="असली में Binary Dividers बनाइए"
              bodyEN="Open the live workbench and wire one controlled-subtractor cell - full subtractor plus the restoring 2-to-1 MUX - then tile it into the array, one chocolate round per row."
              bodyHI="live workbench खोलिए और एक controlled-subtractor cell wire कीजिए - full subtractor जमा restoring 2-to-1 MUX - फिर इसे array में tile कीजिए, हर row एक chocolate round।"
            />
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
