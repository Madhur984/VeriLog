/**
 * Complements (dsd/18) - "The Mirror Trick".
 * Generic scenes come from the shared kit; the mirror machine, the two-family
 * comparison, the sign fork and the full complement-subtractor calculator are
 * bespoke. Every number is COMPUTED in code (diminished-radix mirror, the add,
 * the end-around carry and the re-complement), never trusted to prose.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlipHorizontal2, CornerLeftDown, ArrowRight, RotateCw,
  CheckCircle2, MinusCircle, Flag, GitBranch,
} from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang, StepThrough,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const ACC = { I: '#38bdf8', II: '#f59e0b', III: '#fb7185', good: '#34d399' };

/* ───────── number helpers (all logic lives here) ───────── */
type Base = 'dec' | 'bin';
const RADIX: Record<Base, number> = { dec: 10, bin: 2 };
const WIDTH: Record<Base, number> = { dec: 5, bin: 7 };
const pow = (b: number, e: number) => Math.round(b ** e);
const toDigits = (val: number, radix: number, width: number) =>
  Array.from({ length: width }, (_, i) => Math.floor(val / pow(radix, width - 1 - i)) % radix);
const fromDigits = (digits: number[], radix: number) => digits.reduce((a, d) => a * radix + d, 0);
const mirrorDigits = (digits: number[], radix: number) => digits.map((d) => radix - 1 - d);

/* a row of monospace digit cells */
const DigitRow: React.FC<{ label: string; digits: (number | string)[]; color: string; isDarkMode: boolean; lead?: string }>
  = ({ label, digits, color, isDarkMode, lead }) => {
  const t = tone(isDarkMode);
  return (
    <div className="flex items-center gap-3">
      <span className={`w-40 flex-shrink-0 font-mono text-[12px] ${t.faint}`}>{label}</span>
      <div className="flex gap-1.5">
        {lead !== undefined && (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black tabular-nums"
            style={{ background: `${ACC.good}22`, color: ACC.good, border: `1.5px solid ${ACC.good}` }}>{lead}</span>
        )}
        {digits.map((d, i) => (
          <span key={i} className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black tabular-nums"
            style={{ color, border: `1.5px solid ${color}55` }}>{d}</span>
        ))}
      </div>
    </div>
  );
};

/* ───────── bespoke: the mirror machine (S04) ───────── */
const MirrorMachine: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [base, setBase] = useState<Base>('dec');
  const [val, setVal] = useState(3250);
  const radix = RADIX[base], width = WIDTH[base];
  const max = pow(radix, width) - 1;
  const v = Math.max(0, Math.min(max, val));
  const digits = toDigits(v, radix, width);
  const mir = mirrorDigits(digits, radix);

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <FlipHorizontal2 size={18} style={{ color: accent }} />
        <div className={`flex items-center gap-1 rounded-full border p-1 ${t.soft}`}>
          {(['dec', 'bin'] as Base[]).map((b) => (
            <button key={b} onClick={() => { setBase(b); setVal(b === 'dec' ? 3250 : 61); }}
              className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide transition-colors"
              style={base === b ? { background: accent, color: '#000' } : { color: t.ink }}>
              {b === 'dec' ? "DEC · 9's" : "BIN · 1's"}
            </button>
          ))}
        </div>
        <input type="number" value={v} min={0} max={max}
          onChange={(e) => setVal(parseInt(e.target.value || '0', 10))}
          className={`w-32 rounded-xl border px-3 py-2 font-mono text-sm ${t.soft} ${t.text}`} />
        <span className={`font-mono text-[12px] ${t.faint}`}>0 - {max}</span>
      </div>

      {/* animated reflection: number on top, mirror axis, flipped mirror below */}
      <div className="mx-auto max-w-md">
        <div className="flex justify-center gap-1.5">
          {digits.map((d, i) => (
            <span key={i} className="flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-black tabular-nums"
              style={{ color: ACC.I, border: `1.5px solid ${ACC.I}55` }}>{d}</span>
          ))}
        </div>
        <div className="relative my-2 flex items-center justify-center">
          <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
          <span className="absolute rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest"
            style={{ background: `${accent}1a`, color: accent }}>{base === 'dec' ? 'mirror at 9' : 'flip'}</span>
        </div>
        <div className="flex justify-center gap-1.5">
          {mir.map((d, i) => (
            <motion.span key={`${base}-${v}-${i}`} initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className="flex h-11 w-11 items-center justify-center rounded-lg font-mono text-lg font-black tabular-nums"
              style={{ background: accent, color: '#000' }}>{d}</motion.span>
          ))}
        </div>
      </div>

      <p className={`mt-5 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>हर digit अकेले mirror होता है, और digit जमा उसका mirror हमेशा {radix - 1} बनता है। mirror का मान = <b style={{ color: accent }}>{fromDigits(mir, radix)}</b>.</>
          : <>Each digit mirrors on its own, and digit + mirror always makes {radix - 1}. Value of the mirror = <b style={{ color: accent }}>{fromDigits(mir, radix)}</b>.</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: animated mirror reflection illustration (S04) ───────── */
// A number reflecting across a vertical mirror axis into its diminished-radix
// complement. Each digit and its reflection are paired and the "d + mirror =
// base-1" identity is shown live. Auto-cycles through a few sample numbers but
// also lets the student drive it with a base toggle.
const MirrorReflection: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [base, setBase] = useState<Base>('dec');
  const samples: Record<Base, number[]> = { dec: [3250, 2701, 5408, 90909], bin: [61, 42, 90, 105] };
  const [idx, setIdx] = useState(0);
  const radix = RADIX[base], width = WIDTH[base];
  const list = samples[base];
  const v = list[idx % list.length];
  const digits = toDigits(v, radix, width);
  const mir = mirrorDigits(digits, radix);
  const ceil = radix - 1; // the value every pair must sum to

  const cell = (d: number, color: string, bg?: string) => (
    <span className="flex h-12 w-10 items-center justify-center rounded-lg font-mono text-xl font-black tabular-nums"
      style={bg ? { background: bg, color: '#000' } : { color, border: `1.5px solid ${color}55` }}>{d}</span>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <FlipHorizontal2 size={18} style={{ color: accent }} />
        <span className={`font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>
          {lang === 'hi' ? 'आईने में संख्या' : 'A number in the mirror'}
        </span>
        <div className={`flex items-center gap-1 rounded-full border p-1 ${t.soft}`}>
          {(['dec', 'bin'] as Base[]).map((b) => (
            <button key={b} onClick={() => { setBase(b); setIdx(0); }}
              className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide transition-colors"
              style={base === b ? { background: accent, color: '#000' } : { color: t.ink }}>
              {b === 'dec' ? "DEC · 9's" : "BIN · 1's"}
            </button>
          ))}
        </div>
        <button onClick={() => setIdx((i) => i + 1)}
          className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-wide ${t.soft} ${t.sub} hover:opacity-80`}>
          <RotateCw size={12} /> {lang === 'hi' ? 'अगली संख्या' : 'next number'}
        </button>
      </div>

      {/* the reflection: original on the left of a vertical mirror, complement on the right */}
      <div className="relative mx-auto max-w-2xl overflow-x-auto">
        <div className="flex items-stretch justify-center gap-4 py-2">
          {/* original */}
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: ACC.I }}>
              {lang === 'hi' ? 'असली' : 'original'}
            </span>
            <div className="flex gap-1.5">
              {digits.map((d, i) => (
                <motion.div key={`o-${base}-${v}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}>
                  {cell(d, ACC.I)}
                </motion.div>
              ))}
            </div>
          </div>

          {/* the mirror pane */}
          <div className="relative flex flex-col items-center justify-center px-1">
            <div className="absolute inset-y-0 w-[3px] rounded-full"
              style={{ background: `linear-gradient(180deg, transparent, ${accent}, transparent)`, boxShadow: `0 0 14px ${accent}` }} />
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }}
              className="rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest"
              style={{ background: `${accent}1a`, color: accent, border: `1px solid ${accent}55` }}>
              {base === 'dec' ? 'mirror · 9' : 'mirror · 1'}
            </motion.div>
          </div>

          {/* reflection (complement), flipped in from the axis */}
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
              {lang === 'hi' ? 'परछाईं · complement' : 'reflection · complement'}
            </span>
            <div className="flex gap-1.5">
              {mir.map((d, i) => (
                <motion.div key={`m-${base}-${v}-${i}`} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }} style={{ transformOrigin: 'left center' }}>
                  {cell(d, accent, accent)}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* per-digit identity: d + mirror = base-1 */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {digits.map((d, i) => (
            <span key={`id-${i}`} className={`rounded-lg border px-2 py-1 font-mono text-[11px] tabular-nums ${t.soft} ${t.sub}`}>
              {d} + {mir[i]} = <b style={{ color: d + mir[i] === ceil ? ACC.good : ACC.III }}>{d + mir[i]}</b>
            </span>
          ))}
        </div>
      </div>

      <p className={`mt-5 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>हर digit अपनी परछाईं में बदलता है। हर जोड़ी मिलकर {ceil} बनती है, इसलिए <b style={{ color: ACC.I }}>{digits.join('')}</b> का mirror <b style={{ color: accent }}>{mir.join('')}</b> है।</>
          : <>Each digit becomes its reflection. Every pair sums to {ceil}, so the mirror of <b style={{ color: ACC.I }}>{digits.join('')}</b> is <b style={{ color: accent }}>{mir.join('')}</b>.</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: two families (S03) ───────── */
const FamiliesPanel: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const fam = (title: string, items: string[], badge: string, color: string, dim?: boolean) => (
    <div className={`flex-1 rounded-3xl border p-5 ${t.soft}`} style={{ borderColor: `${color}55`, opacity: dim ? 0.85 : 1 }}>
      <div className="font-mono text-[11px] uppercase tracking-widest" style={{ color }}>{title}</div>
      <ul className="mt-3 space-y-1.5">
        {items.map((it, i) => <li key={i} className={`font-mono text-sm font-bold ${t.text}`}>{it}</li>)}
      </ul>
      <div className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-black" style={{ background: `${color}1a`, color }}>{badge}</div>
    </div>
  );
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="flex flex-col gap-4 sm:flex-row">
        {fam(lang === 'hi' ? 'RADIX (Base)' : 'RADIX (Base)', ["10's complement", "2's complement"], lang === 'hi' ? 'carry DISCARD' : 'DISCARD carry', '#64748b', true)}
        {fam(lang === 'hi' ? 'DIMINISHED (Base - 1)' : 'DIMINISHED (Base - 1)', ["9's complement", "1's complement"], lang === 'hi' ? 'END-AROUND carry' : 'END-AROUND carry', ACC.I)}
      </div>
      <p className={`mt-4 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi' ? 'यह module दाईं ओर वाले (diminished) परिवार के बारे में है।' : 'This module is about the right-hand (diminished) family.'}
      </p>
    </Card>
  );
};

/* ───────── bespoke: three-step recipe strip (S05) ───────── */
const RecipeStrip: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const steps = lang === 'hi'
    ? [['1', 'Complement', 'subtrahend को mirror कीजिए'], ['2', 'Add', 'minuend में जोड़िए'], ['3', 'End-Around Carry', 'ऊपरी carry को नीचे मोड़िए']]
    : [['1', 'Complement', 'mirror the subtrahend'], ['2', 'Add', 'add to the minuend'], ['3', 'End-Around Carry', 'fold the top carry to the bottom']];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {steps.map(([n, h, s]) => (
        <div key={n} className={`rounded-3xl border p-5 ${t.card}`}>
          <div className="text-4xl font-black" style={{ color: `${accent}55` }}>{n}</div>
          <div className={`mt-1 text-lg font-black ${t.text}`}>{h}</div>
          <div className={`mt-1 text-[13px] ${t.sub}`}>{s}</div>
        </div>
      ))}
    </div>
  );
};

/* ───────── recipe engine: compute every digit for a worked example ───────── */
// One place that does the diminished-radix subtraction end to end so the
// StepThrough never hardcodes a digit. Returns each intermediate row.
interface Worked {
  radix: number; width: number; modulus: number;
  a: number; b: number;
  aD: number[]; bD: number[]; mir: number[]; mirVal: number;
  rawSum: number; sumLow: number[]; carry: 0 | 1;
  finalVal: number; finalDigits: number[]; sign: 1 | -1; check: number;
}
const work = (base: Base, A: number, B: number): Worked => {
  const radix = RADIX[base], width = WIDTH[base];
  const modulus = pow(radix, width);
  const max = modulus - 1;
  const a = Math.max(0, Math.min(max, A));
  const b = Math.max(0, Math.min(max, B));
  const aD = toDigits(a, radix, width);
  const bD = toDigits(b, radix, width);
  const mir = mirrorDigits(bD, radix);
  const mirVal = fromDigits(mir, radix);
  const rawSum = a + mirVal;
  const carry: 0 | 1 = rawSum >= modulus ? 1 : 0;
  const sumLow = toDigits(rawSum % modulus, radix, width);
  const finalVal = carry ? (rawSum - modulus) + 1 : (modulus - 1) - rawSum;
  const sign: 1 | -1 = carry ? 1 : -1;
  const finalDigits = toDigits(finalVal, radix, width);
  return { radix, width, modulus, a, b, aD, bD, mir, mirVal, rawSum, sumLow, carry, finalVal, finalDigits, sign, check: a - b };
};

/* ───────── bespoke: full guided recipe walkthrough (S05) ───────── */
// A StepThrough that walks the FULL recipe on a concrete positive example
// (72532 - 03250 -> +69282) and a concrete negative one (03250 - 72532 ->
// -69282). Every digit is computed by work(); nothing is hardcoded.
const RecipeWalkthrough: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const cases: { A: number; B: number }[] = [
    { A: 72532, B: 3250 }, // positive -> +69282
    { A: 3250, B: 72532 }, // negative -> -69282
  ];
  const [c, setC] = useState(0);
  const w = work('dec', cases[c].A, cases[c].B);

  const chip = (d: number | string, color: string, bg?: string, key?: React.Key) => (
    <span key={key} className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black tabular-nums"
      style={bg ? { background: bg, color: '#000' } : { color, border: `1.5px solid ${color}55` }}>{d}</span>
  );
  const row = (label: string, digits: (number | string)[], color: string, bg?: string, lead?: string) => (
    <div className="flex items-center gap-3">
      <span className={`w-44 flex-shrink-0 font-mono text-[12px] ${t.faint}`}>{label}</span>
      <div className="flex gap-1.5">
        {lead !== undefined && chip(lead, ACC.good, `${ACC.good}33`, 'lead')}
        {digits.map((d, i) => chip(d, color, bg, i))}
      </div>
    </div>
  );

  const steps = [
    {
      label: lang === 'hi' ? 'Step 1: B को mirror करो' : 'Step 1: mirror B',
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? <>subtrahend <b style={{ color: ACC.II }}>{w.b.toString().padStart(w.width, '0')}</b> का 9's complement लीजिए: हर digit d को 9 - d से बदलिए।</>
              : <>Take the 9's complement of the subtrahend <b style={{ color: ACC.II }}>{w.b.toString().padStart(w.width, '0')}</b>: replace each digit d with 9 - d.</>}
          </p>
          {row(lang === 'hi' ? 'B (subtrahend)' : 'B (subtrahend)', w.bD, ACC.II)}
          {row(lang === 'hi' ? "9's complement" : "9's complement", w.mir, accent, accent)}
          <p className={`font-mono text-[12px] ${t.faint}`}>
            mirror({w.b.toString().padStart(w.width, '0')}) = {w.mir.join('')} = {w.mirVal}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Step 2: A में जोड़ो' : 'Step 2: add to A',
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? <>mirror को minuend <b style={{ color: ACC.I }}>{w.a.toString().padStart(w.width, '0')}</b> में साधारण addition से जोड़िए।</>
              : <>Add the mirror to the minuend <b style={{ color: ACC.I }}>{w.a.toString().padStart(w.width, '0')}</b> with ordinary addition.</>}
          </p>
          {row(lang === 'hi' ? 'A (minuend)' : 'A (minuend)', w.aD, ACC.I)}
          {row(lang === 'hi' ? "+ 9's complement" : "+ 9's complement", w.mir, accent)}
          <div className="my-1 h-px w-full" style={{ background: `${accent}33` }} />
          {row(lang === 'hi' ? 'sum' : 'sum', w.sumLow, t.ink as string, undefined, w.carry ? '1' : undefined)}
          <p className={`font-mono text-[12px] ${t.faint}`}>
            {w.a} + {w.mirVal} = {w.rawSum}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Step 3: ऊपरी carry देखो' : 'Step 3: inspect the top carry',
      body: (
        <div className="space-y-3">
          <p className={`text-[14px] ${t.sub}`}>
            {lang === 'hi'
              ? <>sum <b className="font-mono">{w.rawSum}</b> को देखिए। क्या यह {w.width} digit से बड़ा है (यानी ऊपर से carry निकला)?</>
              : <>Look at the sum <b className="font-mono">{w.rawSum}</b>. Did it spill past {w.width} digits (a carry out of the top)?</>}
          </p>
          <div className={`flex items-center gap-3 rounded-2xl border p-4 ${t.soft}`}
            style={{ borderColor: `${(w.carry ? ACC.good : ACC.III)}55` }}>
            {w.carry
              ? <CheckCircle2 size={20} style={{ color: ACC.good }} />
              : <MinusCircle size={20} style={{ color: ACC.III }} />}
            <p className={`text-[14px] ${t.sub}`}>
              {w.carry
                ? (lang === 'hi'
                  ? <><b style={{ color: ACC.good }}>carry = 1</b>. minuend बड़ी थी -&gt; जवाब धनात्मक। end-around carry करेंगे।</>
                  : <><b style={{ color: ACC.good }}>carry = 1</b>. The minuend was larger -&gt; answer is positive. We will do the end-around carry.</>)
                : (lang === 'hi'
                  ? <><b style={{ color: ACC.III }}>carry = 0</b>. subtrahend बड़ी थी -&gt; जवाब ऋणात्मक। sum का फिर से complement लेंगे।</>
                  : <><b style={{ color: ACC.III }}>carry = 0</b>. The subtrahend was larger -&gt; answer is negative. We will re-complement the sum.</>)}
            </p>
          </div>
        </div>
      ),
    },
    {
      label: w.carry
        ? (lang === 'hi' ? 'Step 4: end-around carry' : 'Step 4: end-around carry')
        : (lang === 'hi' ? 'Step 4: फिर से complement' : 'Step 4: re-complement'),
      body: (
        <div className="space-y-3">
          {w.carry ? (
            <>
              <p className={`text-[14px] ${t.sub}`}>
                {lang === 'hi'
                  ? <>ऊपरी 1 हटाइए और नीचे 1 जोड़िए: ({w.rawSum} - {w.modulus}) + 1.</>
                  : <>Drop the leading 1 and add 1 at the bottom: ({w.rawSum} - {w.modulus}) + 1.</>}
              </p>
              <div className="flex items-center gap-3">
                <CornerLeftDown size={20} style={{ color: ACC.good }} />
                {row(lang === 'hi' ? 'end-around' : 'end-around', w.finalDigits, ACC.good, `${ACC.good}22`)}
              </div>
              <p className={`font-mono text-[12px] ${t.faint}`}>
                {w.rawSum} - {w.modulus} + 1 = {w.finalVal}
              </p>
            </>
          ) : (
            <>
              <p className={`text-[14px] ${t.sub}`}>
                {lang === 'hi'
                  ? <>sum <b className="font-mono">{w.sumLow.join('')}</b> अब भी mirror रूप में है। इसका फिर से 9's complement लीजिए।</>
                  : <>The sum <b className="font-mono">{w.sumLow.join('')}</b> is still in mirror form. Take its 9's complement once more.</>}
              </p>
              {row('sum', w.sumLow, t.ink as string)}
              {row(lang === 'hi' ? 'complement फिर' : 'complement again', w.finalDigits, ACC.III, `${ACC.III}22`)}
              <p className={`font-mono text-[12px] ${t.faint}`}>
                mirror({w.sumLow.join('')}) = {w.finalDigits.join('')}, {lang === 'hi' ? 'minus लगाइए' : 'attach a minus'}
              </p>
            </>
          )}
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Step 5: sign + जवाब' : 'Step 5: sign + answer',
      body: (
        <div className="space-y-3">
          <div className={`flex items-center gap-3 rounded-2xl border p-4 ${t.soft}`}
            style={{ borderColor: `${(w.sign > 0 ? ACC.good : ACC.III)}55` }}>
            <Flag size={20} style={{ color: w.sign > 0 ? ACC.good : ACC.III }} />
            <p className={`text-[14px] ${t.sub}`}>
              {lang === 'hi'
                ? <>carry {w.carry} -&gt; sign {w.sign > 0 ? '+' : '-'}.</>
                : <>carry {w.carry} -&gt; sign {w.sign > 0 ? '+' : '-'}.</>}
            </p>
          </div>
          <p className={`text-center text-2xl font-black ${t.text}`}>
            {w.a} - {w.b} = <span style={{ color: w.sign > 0 ? ACC.good : ACC.III }}>{w.sign < 0 ? '-' : ''}{w.finalDigits.join('')}</span>
            <span className={`ml-2 align-middle font-mono text-base ${t.faint}`}>= {w.check}</span>
          </p>
        </div>
      ),
    },
  ];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className={`font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>
          {lang === 'hi' ? 'पूरी विधि कदम-दर-कदम' : 'the full recipe, step by step'}
        </span>
        <div className={`ml-auto flex items-center gap-1 rounded-full border p-1 ${t.soft}`}>
          {cases.map((cc, i) => (
            <button key={i} onClick={() => setC(i)}
              className="rounded-full px-3 py-1 font-mono text-[11px] font-black tabular-nums transition-colors"
              style={c === i ? { background: accent, color: '#000' } : { color: t.ink }}>
              {cc.A.toString().padStart(5, '0')} - {cc.B.toString().padStart(5, '0')}
            </button>
          ))}
        </div>
      </div>
      <StepThrough key={c} steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* ───────── bespoke: the sign fork (S06) ───────── */
const SignFork: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const branch = (carry: string, sign: string, action: string, color: string) => (
    <div className={`flex-1 rounded-3xl border p-5 ${t.soft}`} style={{ borderColor: `${color}55` }}>
      <div className="font-mono text-sm font-black" style={{ color }}>carry = {carry}</div>
      <div className={`mt-2 text-xl font-black ${t.text}`}>{sign}</div>
      <div className={`mt-1 text-[13px] ${t.sub}`}>{action}</div>
    </div>
  );
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="flex flex-col gap-4 sm:flex-row">
        {branch('1', lang === 'hi' ? 'धनात्मक (+)' : 'POSITIVE (+)', lang === 'hi' ? 'end-around carry कीजिए; वही जवाब है।' : 'do the end-around carry; that is the answer.', ACC.good)}
        {branch('0', lang === 'hi' ? 'ऋणात्मक (-)' : 'NEGATIVE (-)', lang === 'hi' ? 'sum का फिर से complement लीजिए, minus लगाइए।' : 'complement the sum again, attach a minus sign.', ACC.III)}
      </div>
    </Card>
  );
};

/* ───────── bespoke: carry decision-tree (S06) ───────── */
// A clear step-by-step decision tree from the sum's top carry. The student
// toggles the carry bit and the live path (positive / negative) lights up,
// running a small worked example down the chosen branch (all digits computed).
const CarryDecisionTree: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  // carry=1 -> use 72532-03250 (positive); carry=0 -> use 03250-72532 (negative)
  const [carry, setCarry] = useState<0 | 1>(1);
  const w = carry ? work('dec', 72532, 3250) : work('dec', 3250, 72532);
  const posActive = carry === 1;

  const branchCard = (active: boolean, color: string, head: React.ReactNode, body: React.ReactNode) => (
    <motion.div animate={{ opacity: active ? 1 : 0.4, scale: active ? 1 : 0.98 }} transition={{ duration: 0.3 }}
      className={`flex-1 rounded-3xl border p-5 ${t.soft}`}
      style={{ borderColor: active ? color : `${color}33`, boxShadow: active ? `0 0 0 1.5px ${color}55` : 'none' }}>
      {head}
      <div className={`mt-3 space-y-2 text-[13px] ${t.sub}`}>{body}</div>
    </motion.div>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <GitBranch size={18} style={{ color: accent }} />
        <span className={`font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>
          {lang === 'hi' ? 'ऊपरी carry का निर्णय-वृक्ष' : 'top-carry decision tree'}
        </span>
        <div className={`ml-auto flex items-center gap-1 rounded-full border p-1 ${t.soft}`}>
          {([1, 0] as (0 | 1)[]).map((bit) => (
            <button key={bit} onClick={() => setCarry(bit)}
              className="rounded-full px-3 py-1 font-mono text-[11px] font-black tabular-nums transition-colors"
              style={carry === bit ? { background: accent, color: '#000' } : { color: t.ink }}>
              carry = {bit}
            </button>
          ))}
        </div>
      </div>

      {/* the root question */}
      <div className="mx-auto mb-4 max-w-sm text-center">
        <div className={`inline-block rounded-2xl border px-5 py-3 ${t.card}`} style={{ borderColor: `${accent}55` }}>
          <span className={`text-[14px] font-black ${t.text}`}>
            {lang === 'hi' ? 'sum के ऊपर से carry निकला?' : 'Did a carry leave the top of the sum?'}
          </span>
        </div>
      </div>

      {/* branching connectors */}
      <div className="mx-auto mb-1 flex max-w-md items-center justify-between px-10">
        <motion.span animate={{ color: posActive ? ACC.good : t.faint }} className="font-mono text-[11px] font-black">
          {lang === 'hi' ? 'हाँ (1)' : 'YES (1)'}
        </motion.span>
        <motion.span animate={{ color: !posActive ? ACC.III : t.faint }} className="font-mono text-[11px] font-black">
          {lang === 'hi' ? 'नहीं (0)' : 'NO (0)'}
        </motion.span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        {branchCard(posActive, ACC.good,
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} style={{ color: ACC.good }} />
            <span className="text-lg font-black" style={{ color: ACC.good }}>{lang === 'hi' ? 'धनात्मक (+)' : 'POSITIVE (+)'}</span>
          </div>,
          <>
            <div className="flex items-start gap-2"><ArrowRight size={14} className="mt-1 flex-shrink-0" style={{ color: ACC.good }} />
              <span>{lang === 'hi' ? 'minuend बड़ी थी।' : 'The minuend was larger.'}</span></div>
            <div className="flex items-start gap-2"><ArrowRight size={14} className="mt-1 flex-shrink-0" style={{ color: ACC.good }} />
              <span>{lang === 'hi' ? 'END-AROUND CARRY: ऊपरी 1 हटाइए, नीचे 1 जोड़िए।' : 'END-AROUND CARRY: drop the top 1, add 1 at the bottom.'}</span></div>
            <div className="flex items-start gap-2"><ArrowRight size={14} className="mt-1 flex-shrink-0" style={{ color: ACC.good }} />
              <span>{lang === 'hi' ? 'यही आख़िरी जवाब है।' : 'That number IS the answer.'}</span></div>
          </>)}

        {branchCard(!posActive, ACC.III,
          <div className="flex items-center gap-2">
            <MinusCircle size={18} style={{ color: ACC.III }} />
            <span className="text-lg font-black" style={{ color: ACC.III }}>{lang === 'hi' ? 'ऋणात्मक (-)' : 'NEGATIVE (-)'}</span>
          </div>,
          <>
            <div className="flex items-start gap-2"><ArrowRight size={14} className="mt-1 flex-shrink-0" style={{ color: ACC.III }} />
              <span>{lang === 'hi' ? 'subtrahend बड़ी थी।' : 'The subtrahend was larger.'}</span></div>
            <div className="flex items-start gap-2"><ArrowRight size={14} className="mt-1 flex-shrink-0" style={{ color: ACC.III }} />
              <span>{lang === 'hi' ? 'sum अब भी mirror रूप में है: फिर से complement लीजिए.' : 'The sum is still in mirror form: complement it again.'}</span></div>
            <div className="flex items-start gap-2"><ArrowRight size={14} className="mt-1 flex-shrink-0" style={{ color: ACC.III }} />
              <span>{lang === 'hi' ? 'minus चिह्न लगाइए।' : 'Attach a minus sign.'}</span></div>
          </>)}
      </div>

      {/* live worked example down the chosen branch */}
      <AnimatePresence mode="wait">
        <motion.div key={carry} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className={`mt-5 rounded-2xl border p-4 ${t.soft}`} style={{ borderColor: `${(posActive ? ACC.good : ACC.III)}44` }}>
          <div className={`mb-2 font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>
            {lang === 'hi' ? 'इसी रास्ते पर एक उदाहरण' : 'example down this path'}
          </div>
          <p className={`font-mono text-[13px] ${t.sub}`}>
            {w.a.toString().padStart(5, '0')} + {lang === 'hi' ? 'mirror' : 'mirror'}({w.b.toString().padStart(5, '0')}) = {w.a} + {w.mirVal} = {w.rawSum},
            {' '}carry = <b style={{ color: posActive ? ACC.good : ACC.III }}>{w.carry}</b>
          </p>
          <p className={`mt-1 text-center text-xl font-black ${t.text}`}>
            {w.a} - {w.b} = <span style={{ color: w.sign > 0 ? ACC.good : ACC.III }}>{w.sign < 0 ? '-' : ''}{w.finalDigits.join('')}</span>
            <span className={`ml-2 align-middle font-mono text-sm ${t.faint}`}>= {w.check}</span>
          </p>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};

/* ───────── bespoke: full complement subtractor (S07 activity) ───────── */
const ComplementSubtractor: React.FC<{ isDarkMode: boolean; accent: string; scene: SubScene }> = ({ isDarkMode, accent, scene }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [base, setBase] = useState<Base>('dec');
  const [A, setA] = useState(72532);
  const [B, setB] = useState(3250);

  const radix = RADIX[base], width = WIDTH[base];
  const modulus = pow(radix, width);
  const max = modulus - 1;
  const a = Math.max(0, Math.min(max, A));
  const b = Math.max(0, Math.min(max, B));

  const Bd = toDigits(b, radix, width);
  const mir = mirrorDigits(Bd, radix);
  const mirVal = fromDigits(mir, radix);
  const rawSum = a + mirVal;
  const carry = rawSum >= modulus ? 1 : 0;
  const sumLow = toDigits(rawSum % modulus, radix, width);
  const finalVal = carry ? (rawSum - modulus) + 1 : (modulus - 1) - rawSum;
  const sign = carry ? 1 : -1;
  const finalDigits = toDigits(finalVal, radix, width);
  const check = a - b; // ground truth

  const preset = (na: number, nb: number) => { setA(na); setB(nb); };

  const NumIn: React.FC<{ label: string; val: number; set: (n: number) => void; color: string }> = ({ label, val, set, color }) => (
    <label className="flex flex-col gap-1">
      <span className={`font-mono text-[11px] uppercase tracking-widest`} style={{ color }}>{label}</span>
      <input type="number" value={val} min={0} max={max}
        onChange={(e) => set(parseInt(e.target.value || '0', 10))}
        className={`w-32 rounded-xl border px-3 py-2 font-mono text-sm ${t.soft} ${t.text}`} />
    </label>
  );

  return (
    <SceneShell>
      <section className="space-y-3">
        <Eyebrow accent={accent}>{scene.label}</Eyebrow>
        {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${t.text}`}>{scene.subtitle}</h2>}
      </section>

      <Card isDarkMode={isDarkMode}>
        <div className="mb-5 flex flex-wrap items-end gap-4">
          <div className={`flex items-center gap-1 rounded-full border p-1 ${t.soft}`}>
            {(['dec', 'bin'] as Base[]).map((bb) => (
              <button key={bb} onClick={() => { setBase(bb); bb === 'dec' ? preset(72532, 3250) : preset(84, 61); }}
                className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide transition-colors"
                style={base === bb ? { background: accent, color: '#000' } : { color: t.ink }}>
                {bb === 'dec' ? "DEC · 9's" : "BIN · 1's"}
              </button>
            ))}
          </div>
          <NumIn label="A · minuend" val={a} set={setA} color={ACC.I} />
          <NumIn label="B · subtrahend" val={b} set={setB} color={ACC.II} />
        </div>

        <div className="flex flex-wrap gap-2">
          {(base === 'dec'
            ? [['72532 - 03250', 72532, 3250], ['03250 - 72532', 3250, 72532]]
            : [['84 - 61', 84, 61], ['67 - 84', 67, 84]]
          ).map(([lbl, na, nb]) => (
            <button key={lbl as string} onClick={() => preset(na as number, nb as number)}
              className={`rounded-lg border px-3 py-1.5 font-mono text-[12px] ${t.soft} ${t.sub} hover:opacity-80`}>{lbl}</button>
          ))}
        </div>

        <div className="mt-6 space-y-3 overflow-x-auto">
          <DigitRow isDarkMode={isDarkMode} label="B" digits={Bd} color={ACC.II} />
          <DigitRow isDarkMode={isDarkMode} label={base === 'dec' ? "Step 1: 9's comp" : "Step 1: 1's comp"} digits={mir} color={accent} />
          <DigitRow isDarkMode={isDarkMode} label="A" digits={toDigits(a, radix, width)} color={ACC.I} />
          <div className="my-1 h-px w-full" style={{ background: `${accent}33` }} />
          <DigitRow isDarkMode={isDarkMode} label="Step 2: A + comp" digits={sumLow} color={t.ink as string} lead={carry ? '1' : undefined} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={carry ? 'pos' : 'neg'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className={`mt-5 flex items-center gap-3 rounded-2xl border p-4 ${t.soft}`} style={{ borderColor: `${(carry ? ACC.good : ACC.III)}55` }}>
            {carry ? (
              <>
                <motion.span animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
                  <CornerLeftDown size={20} style={{ color: ACC.good }} />
                </motion.span>
                <p className={`text-[14px] ${t.sub}`}>
                  {lang === 'hi'
                    ? <><b style={{ color: ACC.good }}>carry = 1</b> -&gt; धनात्मक। End-around carry: ऊपरी 1 हटाइए, नीचे 1 जोड़िए।</>
                    : <><b style={{ color: ACC.good }}>carry = 1</b> -&gt; positive. End-around carry: drop the top 1, add 1 at the bottom.</>}
                </p>
              </>
            ) : (
              <>
                <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}
                  className="text-2xl font-black" style={{ color: ACC.III }}>-</motion.span>
                <p className={`text-[14px] ${t.sub}`}>
                  {lang === 'hi'
                    ? <><b style={{ color: ACC.III }}>carry = 0</b> -&gt; ऋणात्मक। sum का फिर से complement लीजिए, minus लगाइए।</>
                    : <><b style={{ color: ACC.III }}>carry = 0</b> -&gt; negative. Complement the sum again, attach a minus sign.</>}
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <p className={`mt-5 text-center text-2xl font-black ${t.text}`}>
          {a} - {b} = <span style={{ color: carry ? ACC.good : ACC.III }}>{sign < 0 ? '-' : ''}{finalDigits.join('')}</span>
          <span className={`ml-2 align-middle font-mono text-base ${t.faint}`}>= {check}</span>
        </p>
      </Card>
    </SceneShell>
  );
};

/* ───────── bespoke: borrow ripple vs mirror+add (S02) ───────── */
// Why borrowing is expensive, shown not just told. For a chosen decimal
// subtraction the left panel replays the schoolbook borrow column by column and
// counts how many borrows actually fire (the "ripple"); the right panel shows
// the same problem solved as mirror + add with zero borrows. Every digit, every
// borrow and the final answer are COMPUTED here, nothing is hardcoded.
interface BorrowStep { col: number; top: number; bot: number; borrowIn: 0 | 1; effTop: number; borrowOut: 0 | 1; diff: number; }
const traceBorrow = (a: number, b: number, width: number) => {
  const aD = toDigits(a, 10, width);
  const bD = toDigits(b, 10, width);
  const steps: BorrowStep[] = [];
  let borrow: 0 | 1 = 0;
  // walk right-to-left (least significant first), like longhand subtraction
  for (let i = width - 1; i >= 0; i--) {
    const top = aD[i], bot = bD[i];
    const borrowIn: 0 | 1 = borrow;
    const effTop: number = top - borrowIn;
    const needBorrow: 0 | 1 = effTop < bot ? 1 : 0;
    const diff = needBorrow ? effTop + 10 - bot : effTop - bot;
    steps.push({ col: i, top, bot, borrowIn, effTop, borrowOut: needBorrow, diff });
    borrow = needBorrow;
  }
  const borrowCount = steps.filter((s) => s.borrowOut === 1).length;
  const resultDigits = steps.slice().reverse().map((s) => s.diff); // back to MSB-first
  return { aD, bD, steps, borrowCount, resultDigits };
};

const BorrowVsMirror: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const width = 5;
  const presets: { a: number; b: number }[] = [
    { a: 80000, b: 1 },     // every column borrows - worst case ripple
    { a: 72532, b: 3250 },
    { a: 50402, b: 9999 },
  ];
  const [p, setP] = useState(0);
  const a = presets[p].a, b = presets[p].b;
  const tr = traceBorrow(a, b, width);
  const w = work('dec', a, b); // mirror + add path, all digits computed

  const cell = (d: number | string, color: string, bg?: string, faded?: boolean, key?: React.Key) => (
    <span key={key} className="flex h-8 w-8 items-center justify-center rounded-md font-mono text-sm font-black tabular-nums"
      style={bg ? { background: bg, color: '#000' } : { color, opacity: faded ? 0.4 : 1, border: `1.5px solid ${color}55` }}>{d}</span>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className={`font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>
          {lang === 'hi' ? 'borrow ripple बनाम mirror + add' : 'borrow ripple vs mirror + add'}
        </span>
        <div className={`ml-auto flex items-center gap-1 rounded-full border p-1 ${t.soft}`}>
          {presets.map((pp, i) => (
            <button key={i} onClick={() => setP(i)}
              className="rounded-full px-3 py-1 font-mono text-[11px] font-black tabular-nums transition-colors"
              style={p === i ? { background: accent, color: '#000' } : { color: t.ink }}>
              {pp.a} - {pp.b}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* LEFT: schoolbook borrow, column by column */}
        <div className={`rounded-2xl border p-4 ${t.soft}`} style={{ borderColor: `${ACC.III}44` }}>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg font-black" style={{ color: ACC.III }}>{lang === 'hi' ? 'पुराना तरीक़ा: borrow' : 'The old way: borrow'}</span>
          </div>
          {/* digit grid MSB-first */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`w-16 flex-shrink-0 font-mono text-[10px] ${t.faint}`}>A</span>
              <div className="flex gap-1">{tr.aD.map((d, i) => cell(d, ACC.I, undefined, false, i))}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-16 flex-shrink-0 font-mono text-[10px] ${t.faint}`}>- B</span>
              <div className="flex gap-1">{tr.bD.map((d, i) => cell(d, ACC.II, undefined, false, i))}</div>
            </div>
            <div className="my-1 h-px w-full" style={{ background: `${ACC.III}33` }} />
            <div className="flex items-center gap-2">
              <span className={`w-16 flex-shrink-0 font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? 'जवाब' : 'result'}</span>
              <div className="flex gap-1">{tr.resultDigits.map((d, i) => cell(d, ACC.III, `${ACC.III}22`, false, i))}</div>
            </div>
          </div>
          {/* per-column borrow trace */}
          <div className="mt-4 space-y-1.5">
            {tr.steps.map((s, k) => (
              <motion.div key={`${p}-${k}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: k * 0.12 }}
                className={`flex items-center gap-2 rounded-lg border px-2 py-1 font-mono text-[11px] ${t.card}`}
                style={{ borderColor: s.borrowOut ? `${ACC.III}66` : `${t.ink}22` }}>
                <span className={t.faint}>{lang === 'hi' ? 'col' : 'col'} {width - s.col}:</span>
                <span style={{ color: ACC.I }}>{s.top}</span>
                {s.borrowIn ? <span style={{ color: ACC.III }}>-1</span> : null}
                <span className={t.faint}>-</span>
                <span style={{ color: ACC.II }}>{s.bot}</span>
                <ArrowRight size={11} className={t.faint} />
                <span className="font-black" style={{ color: ACC.III }}>{s.diff}</span>
                {s.borrowOut
                  ? <span className="ml-auto rounded px-1.5 py-0.5 text-[10px] font-black" style={{ background: `${ACC.III}1a`, color: ACC.III }}>{lang === 'hi' ? 'borrow!' : 'borrow!'}</span>
                  : <span className={`ml-auto text-[10px] ${t.faint}`}>{lang === 'hi' ? 'ठीक' : 'ok'}</span>}
              </motion.div>
            ))}
          </div>
          <p className="mt-3 text-center text-[13px] font-black" style={{ color: ACC.III }}>
            {lang === 'hi'
              ? <>{width} columns में से <b>{tr.borrowCount}</b> ने borrow किया - यही महँगी ripple है।</>
              : <><b>{tr.borrowCount}</b> of {width} columns had to borrow - that is the costly ripple.</>}
          </p>
        </div>

        {/* RIGHT: mirror + add, zero borrows */}
        <div className={`rounded-2xl border p-4 ${t.soft}`} style={{ borderColor: `${ACC.good}44` }}>
          <div className="mb-3 flex items-center gap-2">
            <FlipHorizontal2 size={18} style={{ color: ACC.good }} />
            <span className="text-lg font-black" style={{ color: ACC.good }}>{lang === 'hi' ? 'नया तरीक़ा: mirror + add' : 'The new way: mirror + add'}</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`w-24 flex-shrink-0 font-mono text-[10px] ${t.faint}`}>A</span>
              <div className="flex gap-1">{w.aD.map((d, i) => cell(d, ACC.I, undefined, false, i))}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-24 flex-shrink-0 font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? "+ mirror(B)" : '+ mirror(B)'}</span>
              <div className="flex gap-1">{w.mir.map((d, i) => cell(d, ACC.good, `${ACC.good}22`, false, i))}</div>
            </div>
            <div className="my-1 h-px w-full" style={{ background: `${ACC.good}33` }} />
            <div className="flex items-center gap-2">
              <span className={`w-24 flex-shrink-0 font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? 'sum' : 'sum'}</span>
              <div className="flex gap-1">
                {w.carry ? cell('1', ACC.good, `${ACC.good}33`, false, 'lead') : null}
                {w.sumLow.map((d, i) => cell(d, t.ink as string, undefined, false, i))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2">
            <CornerLeftDown size={16} className="mt-0.5 flex-shrink-0" style={{ color: ACC.good }} />
            <p className={`text-[12px] ${t.sub}`}>
              {lang === 'hi'
                ? <>mirror({w.b.toString().padStart(5, '0')}) = {w.mirVal}; {w.a} + {w.mirVal} = {w.rawSum}. end-around carry -&gt; <b style={{ color: ACC.good }}>{w.finalDigits.join('')}</b>.</>
                : <>mirror({w.b.toString().padStart(5, '0')}) = {w.mirVal}; {w.a} + {w.mirVal} = {w.rawSum}. End-around carry -&gt; <b style={{ color: ACC.good }}>{w.finalDigits.join('')}</b>.</>}
            </p>
          </div>
          <p className="mt-3 text-center text-[13px] font-black" style={{ color: ACC.good }}>
            {lang === 'hi'
              ? <><b>0</b> borrows - बस एक mirror और एक add।</>
              : <><b>0</b> borrows - just one mirror and one add.</>}
          </p>
        </div>
      </div>

      <p className={`mt-4 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>दोनों रास्ते एक ही जवाब <b style={{ color: accent }}>{a - b}</b> देते हैं, पर borrow वाला रास्ता हर column को पिछले से बाँधता है, जबकि mirror वाला नहीं।</>
          : <>Both paths reach the same answer <b style={{ color: accent }}>{a - b}</b>, but the borrow path chains every column to the one before it, while the mirror path does not.</>}
      </p>
    </Card>
  );
};

/* ───────── part assignment ───────── */
const partAt = (i: number): string =>
  i <= 2 ? 'PART I · THE PROBLEM'
    : i <= 6 ? 'PART II · THE MIRROR'
      : 'PART III · PROVE IT';

const bespokeFor = (scene: SubScene): React.ReactNode => {
  const key = scene.id.toLowerCase();
  if (key.includes('whyborrow')) return 'whyborrow';
  if (key.includes('twofamilies')) return 'families';
  if (key.includes('themirror')) return 'mirror';
  if (key.includes('threesteps')) return 'recipe';
  if (key.includes('readcarry')) return 'fork';
  return null;
};

function componentFor(scene: SubScene): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="Complements" />;
    case 'video':
      return (p) => <VideoScene {...p} scene={scene} src="/videos/complements-explained.mp4" />;
    case 'activity':
      return (p) => (
        <div className="relative">
          <TryItYourself corner />
          <ComplementSubtractor {...p} scene={scene} />
        </div>
      );
    case 'flashcards':
      return (p) => (
        <SceneShell>
          <section className="space-y-3"><Eyebrow accent={p.accent}>{scene.label}</Eyebrow>
            {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${tone(p.isDarkMode).text}`}>{scene.subtitle}</h2>}</section>
          <TryItYourself />
          <SubFlashCards isDarkMode={p.isDarkMode} accent={p.accent} cards={CONTENT.flashcards} />
        </SceneShell>
      );
    case 'quiz':
      return (p) => (
        <div className="relative">
          <TryItYourself corner />
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="COMPLEMENTS" tag="Practice · Complements" title={scene.label} intro={scene.subtitle ?? ''} />
        </div>
      );
    case 'recap':
      return (p) => <RecapScene {...p} scene={scene} />;
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'whyborrow' && (
            <>
              <TryItYourself />
              <BorrowVsMirror isDarkMode={p.isDarkMode} accent={p.accent} />
            </>
          )}
          {which === 'families' && <FamiliesPanel isDarkMode={p.isDarkMode} />}
          {which === 'mirror' && (
            <>
              <TryItYourself />
              <MirrorReflection isDarkMode={p.isDarkMode} accent={p.accent} />
              <MirrorMachine isDarkMode={p.isDarkMode} accent={p.accent} />
            </>
          )}
          {which === 'recipe' && (
            <>
              <RecipeStrip isDarkMode={p.isDarkMode} accent={p.accent} />
              <TryItYourself />
              <RecipeWalkthrough isDarkMode={p.isDarkMode} accent={p.accent} />
            </>
          )}
          {which === 'fork' && (
            <>
              <SignFork isDarkMode={p.isDarkMode} />
              <TryItYourself />
              <CarryDecisionTree isDarkMode={p.isDarkMode} accent={p.accent} />
            </>
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
