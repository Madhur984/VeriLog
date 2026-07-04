/**
 * Recall & Prime (dsd/14) - the interactive review that opens the subtractor
 * track. Mostly the shared kit (cover / flashcards / theory / quiz / recap),
 * plus one bespoke worked binary-subtraction example with borrow annotations.
 */
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ArrowLeft, ArrowDown } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  StepThrough, LiveGate,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const ACC = { good: '#34d399', borrow: '#fb7185', accent: '#38bdf8' };

/* ── bespoke: worked example 1010 − 0011 = 0111 with borrows ── */
const BorrowExample: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const Cell: React.FC<{ children: React.ReactNode; color?: string; dim?: boolean }> = ({ children, color, dim }) => (
    <span className="inline-flex h-9 w-9 items-center justify-center text-xl font-black tabular-nums"
      style={{ color: color ?? t.ink, opacity: dim ? 0.4 : 1 }}>{children}</span>
  );
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mx-auto w-fit font-mono">
        {/* borrow markers */}
        <div className="flex items-center gap-1">
          <span className="w-12" />
          <Cell color={ACC.borrow}>·</Cell><Cell color={ACC.borrow}>¹</Cell><Cell color={ACC.borrow}>·</Cell><Cell color={ACC.borrow}>·</Cell>
        </div>
        <div className="flex items-center gap-1">
          <span className={`w-12 text-right text-sm ${t.faint}`}>10</span>
          <Cell>1</Cell><Cell>0</Cell><Cell>1</Cell><Cell>0</Cell>
        </div>
        <div className="flex items-center gap-1" style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 4 }}>
          <span className={`w-12 text-right text-sm ${t.faint}`}>− 3</span>
          <Cell>0</Cell><Cell>0</Cell><Cell>1</Cell><Cell>1</Cell>
        </div>
        <div className="flex items-center gap-1 pt-1">
          <span className={`w-12 text-right text-sm ${t.faint}`}>= 7</span>
          <Cell color={ACC.good}>0</Cell><Cell color={ACC.good}>1</Cell><Cell color={ACC.good}>1</Cell><Cell color={ACC.good}>1</Cell>
        </div>
      </div>
      <p className={`mt-4 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? 'दूसरे column में 0 − 1 आया: ऊपर वाले column से एक borrow लिया (लाल ¹), फिर 10 − 1 = 1।'
          : 'Column two hits 0 − 1: it borrows one from the column above (red ¹), making 10 − 1 = 1.'}
      </p>
    </Card>
  );
};

/* ── shared: the four rules of binary subtraction (computed, not hardcoded) ── */
const SUB_RULES: { x: number; y: number }[] = [
  { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 },
];

const SubRulesCard: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  // Single-column subtract with no incoming borrow: diff = x XOR y, borrow-out = x' AND y.
  const rows = SUB_RULES.map(({ x, y }) => {
    const diff = x ^ y;
    const bout = (x ^ 1) & y; // borrow only when 0 - 1
    return { x, y, diff, bout };
  });
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'घटाव के नियम · Rules' : 'Rules of binary subtraction'}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {rows.map((r, i) => (
          <div key={i} className={`rounded-2xl border p-3 text-center ${t.soft}`}
            style={r.bout ? { borderColor: `${ACC.borrow}88` } : undefined}>
            <div className={`font-mono text-lg font-black ${t.text}`}>
              {r.x} - {r.y} = {r.bout ? <span style={{ color: ACC.good }}>{r.diff}</span> : r.diff}
            </div>
            {r.bout ? (
              <div className="mt-1 font-mono text-[11px] font-black" style={{ color: ACC.borrow }}>
                {lang === 'hi' ? '+ borrow ले' : '+ borrow'}
              </div>
            ) : (
              <div className={`mt-1 font-mono text-[11px] ${t.faint}`}>
                {lang === 'hi' ? 'सीधा' : 'clean'}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className={`mt-4 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? 'सिर्फ़ 0 - 1 कठिन है: यहाँ बाईं ओर से 1 borrow लेकर 10 - 1 = 1 बनता है।'
          : 'Only 0 - 1 is hard: here you borrow a 1 from the left, making 10 - 1 = 1.'}
      </p>
    </Card>
  );
};

/* ── bespoke: interactive column-by-column 4-bit subtraction, all math in code ── */
type SubStep = {
  col: number;          // 0 = MSB ... 3 = LSB (left to right index into the displayed array)
  x: number; y: number; bin: number;
  effX: number;         // x after subtracting the incoming borrow
  diff: number; bout: number;
};

// Subtract two 4-bit arrays (index 0 = MSB) right-to-left, recording every column.
function subtract4(xb: number[], yb: number[]) {
  const n = xb.length;
  const diff = new Array(n).fill(0);
  const steps: SubStep[] = [];
  let bin = 0;
  for (let c = n - 1; c >= 0; c--) {
    const x = xb[c], y = yb[c];
    const effX = x - bin;                 // value left in this column after paying the prior borrow
    const raw = effX - y;                  // can be -1, 0 or 1
    const d = raw < 0 ? raw + 2 : raw;     // borrow makes it 10 - ...
    const bout = raw < 0 ? 1 : 0;
    diff[c] = d;
    steps.push({ col: c, x, y, bin, effX, diff: d, bout });
    bin = bout;
  }
  return { diff, steps, finalBorrow: bin };
}

const toBits = (s: string) => s.split('').map((ch) => (ch === '1' ? 1 : 0));
const bitsToNum = (b: number[]) => b.reduce((acc, v) => acc * 2 + v, 0);

const PRESETS: { x: string; y: string }[] = [
  { x: '1010', y: '0011' },
  { x: '1101', y: '0110' },
  { x: '1000', y: '0001' },
  { x: '1111', y: '1010' },
];

const SubWalkthrough: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [pi, setPi] = useState(0);
  const preset = PRESETS[pi];
  const xb = toBits(preset.x);
  const yb = toBits(preset.y);
  const { diff, steps, finalBorrow } = useMemo(() => subtract4(xb, yb), [pi]); // eslint-disable-line react-hooks/exhaustive-deps
  const xNum = bitsToNum(xb), yNum = bitsToNum(yb), dNum = bitsToNum(diff);

  // A small bit-stack figure that highlights one column and shows the live borrow row.
  const Figure: React.FC<{ active: number; step?: SubStep }> = ({ active, step }) => {
    const cell = (v: React.ReactNode, on: boolean, color?: string, dim?: boolean) => (
      <span
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-xl font-black tabular-nums transition-colors"
        style={{
          color: color ?? t.ink,
          opacity: dim ? 0.3 : 1,
          background: on ? `${accent}22` : 'transparent',
          outline: on ? `2px solid ${accent}` : '2px solid transparent',
        }}
      >
        {v}
      </span>
    );
    return (
      <div className="mx-auto w-fit font-mono">
        {/* borrow row: the borrow this column SENDS to its left (one column over) */}
        <div className="flex items-center gap-1">
          <span className="w-12" />
          {xb.map((_, c) => {
            // borrow shown above column (c-1) is the borrow-out of column c
            const src = steps.find((s) => s.col === c + 1 && s.bout === 1);
            const reveal = step && c + 1 >= step.col; // only reveal borrows up to the current step
            return (
              <span key={c} className="inline-flex h-6 w-10 items-center justify-center text-sm font-black"
                style={{ color: ACC.borrow }}>
                {src && reveal ? '1' : ''}
              </span>
            );
          })}
        </div>
        {/* minuend */}
        <div className="flex items-center gap-1">
          <span className={`w-12 text-right text-sm ${t.faint}`}>{xNum}</span>
          {xb.map((v, c) => cell(v, c === active))}
        </div>
        {/* subtrahend */}
        <div className="flex items-center gap-1" style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 4 }}>
          <span className={`w-12 text-right text-sm ${t.faint}`}>- {yNum}</span>
          {yb.map((v, c) => cell(v, c === active))}
        </div>
        {/* difference, filled in only up to and including the current column */}
        <div className="flex items-center gap-1 pt-1">
          <span className={`w-12 text-right text-sm ${t.faint}`}>= {dNum}</span>
          {diff.map((v, c) => {
            const done = step ? c >= step.col : true;
            return <React.Fragment key={c}>{cell(done ? v : '?', c === active, done ? ACC.good : undefined, !done)}</React.Fragment>;
          })}
        </div>
      </div>
    );
  };

  // Build StepThrough steps: an intro, one per column (right to left), then a result.
  const colSteps = steps.map((s) => {
    const place = ['8', '4', '2', '1'][s.col];
    const borrowedIn = s.bin === 1;
    const caption = lang === 'hi'
      ? `${place} वाले column में ${s.x} - ${s.y}${borrowedIn ? ` (पहले borrow के बाद ${s.effX})` : ''} = ${s.diff}${s.bout ? `, बाईं ओर 1 borrow भेजा` : ''}.`
      : `Place ${place}: ${s.x} - ${s.y}${borrowedIn ? ` (after paying the prior borrow, top is ${s.effX})` : ''} = ${s.diff}${s.bout ? `, and a borrow of 1 goes left` : ''}.`;
    return {
      label: lang === 'hi' ? `Column ${place}` : `Column ${place}`,
      body: (
        <div className="space-y-4">
          <Figure active={s.col} step={s} />
          <div className={`rounded-2xl border p-4 ${t.soft}`}
            style={s.bout ? { borderColor: `${ACC.borrow}66` } : { borderColor: `${ACC.good}55` }}>
            <div className="flex items-center justify-center gap-2 font-mono text-sm font-black"
              style={{ color: s.bout ? ACC.borrow : ACC.good }}>
              {s.bout ? <ArrowLeft size={16} /> : null}
              {s.x}{borrowedIn ? `-${s.bin}` : ''} - {s.y} = {s.diff}{s.bout ? ', borrow 1' : ''}
            </div>
            <p className={`mt-2 text-center text-[13px] ${t.sub}`}>{caption}</p>
          </div>
        </div>
      ),
    };
  });

  const introStep = {
    label: lang === 'hi' ? 'सेट-अप' : 'Set up',
    body: (
      <div className="space-y-4">
        <Figure active={-1} />
        <p className={`text-center text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? `${xNum} (${preset.x}) में से ${yNum} (${preset.y}) घटाना है। सबसे दाएँ column (place 1) से शुरू करके बाईं ओर बढ़ेंगे।`
            : `Subtract ${yNum} (${preset.y}) from ${xNum} (${preset.x}). Start at the rightmost column (place 1) and work left.`}
        </p>
      </div>
    ),
  };

  const resultStep = {
    label: lang === 'hi' ? 'नतीजा' : 'Result',
    body: (
      <div className="space-y-4">
        <Figure active={-1} step={{ col: -1, x: 0, y: 0, bin: 0, effX: 0, diff: 0, bout: 0 }} />
        <div className={`rounded-2xl border p-4 text-center ${t.soft}`} style={{ borderColor: `${ACC.good}66` }}>
          <div className="font-mono text-xl font-black" style={{ color: ACC.good }}>
            {preset.x} - {preset.y} = {diff.join('')}
          </div>
          <p className={`mt-2 text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? `दशमलव में: ${xNum} - ${yNum} = ${dNum}. ${finalBorrow ? 'अंत में borrow बचा - मतलब नतीजा ऋणात्मक है (यही two\'s complement का काम है)।' : 'कोई बचा हुआ borrow नहीं - साफ़ घटाव।'}`
              : `In decimal: ${xNum} - ${yNum} = ${dNum}. ${finalBorrow ? 'A borrow is left over - the result went negative (which is exactly where two\'s complement steps in).' : 'No leftover borrow - a clean subtraction.'}`}
          </p>
        </div>
      </div>
    ),
  };

  const allSteps = [introStep, ...colSteps, resultStep];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'इंटरैक्टिव · column-दर-column' : 'Interactive · column by column'}
        </div>
      </div>

      {/* preset picker */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'उदाहरण:' : 'Try:'}</span>
        {PRESETS.map((p, i) => (
          <button
            key={i}
            onClick={() => setPi(i)}
            className="rounded-full border px-3 py-1.5 font-mono text-[12px] font-black transition-colors"
            style={
              i === pi
                ? { background: accent, color: '#000', borderColor: accent }
                : { color: isDarkMode ? '#94a3b8' : '#475569', borderColor: isDarkMode ? '#ffffff22' : '#cbd5e1' }
            }
          >
            {p.x}-{p.y}
          </button>
        ))}
      </div>

      {/* remount StepThrough whenever the preset changes so it restarts at step 1 */}
      <StepThrough key={pi} steps={allSteps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* ── bespoke: carry (addition) vs borrow (subtraction) RIPPLING across columns ── */

// One animated ripple row: four columns, an arrow lights up between every pair as
// the carry/borrow walks left. cols[] holds the per-column bit shown in each cell.
const RippleRow: React.FC<{
  isDarkMode: boolean; color: string; cols: number[]; reverse?: boolean;
}> = ({ isDarkMode, color, cols }) => {
  const t = tone(isDarkMode);
  const n = cols.length;
  return (
    <div className="flex items-end justify-center font-mono">
      {cols.map((bit, c) => (
        <React.Fragment key={c}>
          <div className="flex flex-col items-center">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg font-black tabular-nums"
              style={{ color: t.ink, background: `${color}1a`, outline: `1.5px solid ${color}55` }}
            >
              {bit}
            </span>
            <span className={`mt-1 font-mono text-[9px] ${t.faint}`}>{['8', '4', '2', '1'][c]}</span>
          </div>
          {/* arrow between this column and the one to its left (carry/borrow ripples LEFT) */}
          {c < n - 1 && (
            <motion.div
              className="mb-5 px-0.5"
              initial={{ opacity: 0.25 }}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ repeat: Infinity, duration: 1.6, delay: (n - 2 - c) * 0.45 }}
            >
              <ArrowLeft size={18} style={{ color }} />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const CarryVsBorrow: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);

  // CARRY example: 0111 + 0001 = 1000 (a carry ripples all the way left).
  const addX = [0, 1, 1, 1], addY = [0, 0, 0, 1];
  const addSum: number[] = new Array(4).fill(0);
  const addCarry: number[] = new Array(4).fill(0); // carry OUT of each column
  {
    let cin = 0;
    for (let c = 3; c >= 0; c--) {
      const s = addX[c] + addY[c] + cin;
      addSum[c] = s & 1;
      cin = s >> 1;
      addCarry[c] = cin;
    }
  }

  // BORROW example: 1000 - 0001 = 0111 (a borrow ripples all the way left).
  const { diff: subDiff, steps: subSteps } = subtract4([1, 0, 0, 0], [0, 0, 0, 1]);
  const subBorrow: number[] = new Array(4).fill(0);
  subSteps.forEach((s) => { subBorrow[s.col] = s.bout; });

  const panel = (
    title: string, op: React.ReactNode, color: string,
    topLabel: string, topBits: number[], botLabel: string, botBits: number[],
    resLabel: string, resBits: number[], chainBits: number[], note: string,
  ) => (
    <div className={`flex-1 rounded-3xl border p-5 ${t.soft}`} style={{ borderColor: `${color}55` }}>
      <div className="flex items-center justify-center gap-2 font-mono text-[12px] font-black uppercase tracking-widest" style={{ color }}>{op}{title}</div>

      {/* the live ripple of the carry/borrow chain across all 4 columns */}
      <div className="mt-4">
        <div className={`mb-1 text-center font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>
          {lang === 'hi' ? 'ripple (बाईं ओर)' : 'ripple (leftward)'}
        </div>
        <RippleRow isDarkMode={isDarkMode} color={color} cols={chainBits} />
      </div>

      {/* the stacked sum / difference */}
      <div className="mx-auto mt-4 w-fit font-mono">
        <div className="flex items-center gap-1">
          <span className={`w-8 text-right text-xs ${t.faint}`}>{topLabel}</span>
          {topBits.map((b, i) => <span key={i} className={`inline-flex h-7 w-7 items-center justify-center text-base font-black ${t.text}`}>{b}</span>)}
        </div>
        <div className="flex items-center gap-1" style={{ borderBottom: `2px solid ${color}`, paddingBottom: 3 }}>
          <span className={`w-8 text-right text-xs ${t.faint}`}>{botLabel}</span>
          {botBits.map((b, i) => <span key={i} className={`inline-flex h-7 w-7 items-center justify-center text-base font-black ${t.text}`}>{b}</span>)}
        </div>
        <div className="flex items-center gap-1 pt-1">
          <span className={`w-8 text-right text-xs ${t.faint}`}>{resLabel}</span>
          {resBits.map((b, i) => <span key={i} className="inline-flex h-7 w-7 items-center justify-center text-base font-black" style={{ color }}>{b}</span>)}
        </div>
      </div>

      <p className={`mt-3 text-center text-[12px] ${t.sub}`}>{note}</p>
    </div>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="flex flex-col gap-4 sm:flex-row">
        {panel(
          lang === 'hi' ? 'CARRY (जोड़)' : 'CARRY (add)',
          <Plus size={14} />, ACC.good,
          '', addX, '+', addY, '=', addSum, addCarry,
          lang === 'hi'
            ? `1 + 1 दो column को भरकर carry बाईं ओर भेजता है: ${addX.join('')} + ${addY.join('')} = ${addSum.join('')}.`
            : `1 + 1 overflows a column and pushes a carry left: ${addX.join('')} + ${addY.join('')} = ${addSum.join('')}.`,
        )}
        {panel(
          lang === 'hi' ? 'BORROW (घटाव)' : 'BORROW (subtract)',
          <Minus size={14} />, ACC.borrow,
          '', [1, 0, 0, 0], '-', [0, 0, 0, 1], '=', subDiff, subBorrow,
          lang === 'hi'
            ? `0 - 1 घटा नहीं पाता, इसलिए borrow बाईं ओर खिंचता है: 1000 - 0001 = ${subDiff.join('')}.`
            : `0 - 1 cannot subtract, so a borrow pulls left: 1000 - 0001 = ${subDiff.join('')}.`,
        )}
      </div>

      {/* direction legend: both ripple left */}
      <div className="mt-5 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <motion.div animate={{ x: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.3 }}>
            <ArrowLeft size={16} style={{ color: ACC.good }} />
          </motion.div>
          <span className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'carry ऊपर/बाएँ' : 'carry up + left'}</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.div animate={{ x: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.3, delay: 0.3 }}>
            <ArrowDown size={16} style={{ color: ACC.borrow }} />
          </motion.div>
          <span className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'borrow नीचे/बाएँ' : 'borrow down + left'}</span>
        </div>
      </div>

      <p className={`mt-4 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? 'दोनों बाईं ओर ripple करते हैं - carry जोड़ में, borrow घटाव में। एक ही दिशा, उल्टा काम।'
          : 'Both ripple LEFT - carry in addition, borrow in subtraction. Same direction, opposite job.'}
      </p>
    </Card>
  );
};

/* ── bespoke: live gate mirror - the adder gates vs the subtractor gates ──
   Toggle x and y and watch all four logic gates compute. Every value (sum,
   diff, carry, borrow) is derived in code, never hardcoded, so the on-screen
   numbers always agree with the equations in the prose. This is the visual the
   "only the second gate changes" claim was missing. */
const GateMirror: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [x, setX] = useState(0);
  const [y, setY] = useState(1);

  // everything computed, nothing hardcoded
  const main = x ^ y;          // Sum (adder) and Difference (subtractor) - the SHARED bit
  const carry = x & y;         // half adder helper: a AND b
  const borrow = (x ^ 1) & y;  // half subtractor helper: (NOT x) AND y

  const Bit: React.FC<{ label: string; val: number; setVal: (v: number) => void; color: string }> =
    ({ label, val, setVal, color }) => (
      <button
        onClick={() => setVal(val ^ 1)}
        className="flex items-center gap-2 rounded-2xl border px-4 py-2 font-mono text-sm font-black transition-colors"
        style={{ borderColor: `${color}66`, color: t.ink as string, background: `${color}12` }}
      >
        <span className={t.faint}>{label}</span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-lg font-black tabular-nums"
          style={{ background: val ? color : 'transparent', color: val ? '#000' : color, outline: `1.5px solid ${color}88` }}>
          {val}
        </span>
      </button>
    );

  const Pane: React.FC<{ title: string; color: string; children: React.ReactNode; foot: string }> =
    ({ title, color, children, foot }) => (
      <div className={`flex-1 rounded-3xl border p-5 ${t.soft}`} style={{ borderColor: `${color}55` }}>
        <div className="mb-3 text-center font-mono text-[11px] font-black uppercase tracking-widest" style={{ color }}>{title}</div>
        <div className="space-y-4">{children}</div>
        <p className={`mt-3 text-center font-mono text-[12px] ${t.sub}`}>{foot}</p>
      </div>
    );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
          {lang === 'hi' ? 'इंटरैक्टिव · वही XOR, अलग helper gate' : 'Interactive · same XOR, different helper gate'}
        </div>
      </div>

      {/* input toggles, shared by both circuits */}
      <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
        <span className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'inputs बदलिए:' : 'flip the inputs:'}</span>
        <Bit label="x" val={x} setVal={setX} color="#38bdf8" />
        <Bit label="y" val={y} setVal={setY} color="#fb7185" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* ADDER side: Sum = x XOR y, Carry = x AND y */}
        <Pane
          title={lang === 'hi' ? 'HALF ADDER (जोड़)' : 'HALF ADDER (add)'}
          color={ACC.good}
          foot={`Sum = ${main} , Carry = ${carry}`}
        >
          <LiveGate type="XOR" a={x} b={y} isDarkMode={isDarkMode} accent={accent}
            labelA="x" labelB="y" labelOut={lang === 'hi' ? 'Sum' : 'Sum'} colorOut={ACC.good} />
          <LiveGate type="AND" a={x} b={y} isDarkMode={isDarkMode} accent={accent}
            labelA="x" labelB="y" labelOut={lang === 'hi' ? 'Carry' : 'Carry'} colorOut={ACC.good} />
        </Pane>

        {/* SUBTRACTOR side: Diff = x XOR y, Borrow = (NOT x) AND y */}
        <Pane
          title={lang === 'hi' ? 'HALF SUBTRACTOR (घटाव)' : 'HALF SUBTRACTOR (subtract)'}
          color={ACC.borrow}
          foot={`Diff = ${main} , Borrow = ${borrow}`}
        >
          <LiveGate type="XOR" a={x} b={y} isDarkMode={isDarkMode} accent={accent}
            labelA="x" labelB="y" labelOut={lang === 'hi' ? 'Diff' : 'Diff'} colorOut={ACC.borrow} />
          {/* borrow takes NOT-x: show the inverter feeding the AND, so (NOT x) AND y is explicit */}
          <LiveGate type="AND" a={x ^ 1} b={y} isDarkMode={isDarkMode} accent={accent}
            labelA="NOT x" labelB="y" labelOut={lang === 'hi' ? 'Borrow' : 'Borrow'} colorOut={ACC.borrow} />
        </Pane>
      </div>

      <p className={`mt-4 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? `इस समय x=${x}, y=${y}: Sum और Diff दोनों ${main} हैं (वही XOR). सिर्फ़ helper बदलता है - Carry=${carry} बनाम Borrow=${borrow}. x पर एक inverter ही पूरा फ़र्क़ है।`
          : `Right now x=${x}, y=${y}: Sum and Diff are both ${main} (the very same XOR). Only the helper differs - Carry=${carry} vs Borrow=${borrow}. One inverter on x is the whole difference.`}
      </p>
    </Card>
  );
};

const partAt = (i: number): string =>
  i <= 1 ? 'PART I · WARM UP'
    : i <= 3 ? 'PART II · THE BASICS'
      : 'PART III · PROVE IT';

function componentFor(scene: SubScene): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="Recall & Prime" />;
    case 'flashcards':
      return (p) => (
        <SceneShell>
          <section className="space-y-3"><Eyebrow accent={p.accent}>{scene.label}</Eyebrow>
            {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${tone(p.isDarkMode).text}`}>{scene.subtitle}</h2>}</section>
          <SubFlashCards isDarkMode={p.isDarkMode} accent={p.accent} cards={CONTENT.flashcards} />
        </SceneShell>
      );
    case 'quiz':
      return (p) => <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="RECALL" tag="Recall · Prime" title={scene.label} intro={scene.subtitle ?? ''} />;
    case 'recap':
      return (p) => <RecapScene {...p} scene={scene} />;
    default:
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {scene.id === 'S02_Binary' && (
            <>
              <BorrowExample isDarkMode={p.isDarkMode} accent={p.accent} />
              <SubRulesCard isDarkMode={p.isDarkMode} accent={p.accent} />
              <TryItYourself />
              <SubWalkthrough isDarkMode={p.isDarkMode} accent={p.accent} />
            </>
          )}
          {scene.id === 'S03_BorrowVsCarry' && (
            <>
              <TryItYourself />
              <GateMirror isDarkMode={p.isDarkMode} accent={p.accent} />
              <CarryVsBorrow isDarkMode={p.isDarkMode} />
            </>
          )}
        </TheoryScene>
      );
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
