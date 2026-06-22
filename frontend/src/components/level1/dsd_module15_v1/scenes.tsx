/**
 * How Computers Subtract (dsd/15) - "The Calculator Illusion".
 * The big idea before the dedicated subtractors: a CPU reuses its adder. It
 * subtracts by adding the two's complement (invert + 1), flipped by a mode bit
 * M through a bank of XOR "shape-shifter" gates. Three bespoke interactives let
 * the student feel each move; the rest comes from the shared kit.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DoorOpen, FlipHorizontal2, ToggleLeft, ToggleRight, Plus, Minus, ArrowRight } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene, LiveGate, StepThrough,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import { CONTENT } from './content';

const ACC = { I: '#38bdf8', II: '#f59e0b', III: '#fb7185', good: '#34d399' };

const toVal = (bits: number[]) => bits.reduce((a, b) => a * 2 + b, 0);

const BitRow: React.FC<{ label: string; bits: number[]; color: string; onToggle?: (i: number) => void; isDarkMode: boolean }>
  = ({ label, bits, color, onToggle, isDarkMode }) => {
  const t = tone(isDarkMode);
  return (
    <div className="flex items-center gap-3">
      <span className={`w-24 font-mono text-[12px] ${t.faint}`}>{label}</span>
      <div className="flex gap-1.5">
        {bits.map((b, i) => (
          <button
            key={i}
            disabled={!onToggle}
            onClick={() => onToggle?.(i)}
            className={`h-9 w-9 overflow-hidden rounded-lg font-mono text-base font-black tabular-nums transition-all ${onToggle ? 'active:scale-90' : 'cursor-default'}`}
            style={{
              background: b ? color : 'transparent',
              color: b ? '#000' : color,
              border: `1.5px solid ${color}${b ? '' : '66'}`,
            }}
          >
            <motion.span key={b} initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ duration: 0.25 }} className="block">
              {b}
            </motion.span>
          </button>
        ))}
      </div>
      <span className={`ml-1 font-mono text-[12px] ${t.faint}`}>= {toVal(bits)}</span>
    </div>
  );
};

/* ── two's complement: invert + 1 ── */
const TwosComplementDemo: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [bits, setBits] = useState([0, 1, 0, 1]);
  const inv = bits.map((b) => b ^ 1);
  const plus1 = ((toVal(inv) + 1) & 15);
  const p1bits = [3, 2, 1, 0].map((i) => (plus1 >> i) & 1);
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="space-y-3">
        <BitRow isDarkMode={isDarkMode} label={lang === 'hi' ? 'B (toggle)' : 'B (toggle)'} bits={bits} color={ACC.I}
          onToggle={(i) => setBits((b) => b.map((v, j) => (j === i ? v ^ 1 : v)))} />
        <BitRow isDarkMode={isDarkMode} label={lang === 'hi' ? 'Step 1: ~B' : 'Step 1: invert'} bits={inv} color={ACC.II} />
        <BitRow isDarkMode={isDarkMode} label={lang === 'hi' ? 'Step 2: ~B + 1' : 'Step 2: + 1'} bits={p1bits} color={ACC.good} />
      </div>
      <p className={`mt-4 text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>~B + 1 ही −B का two's complement है। यही जोड़ने पर घटाना हो जाता है।</>
          : <>~B + 1 is the two's complement, i.e. −B. Adding that is how the machine subtracts.</>}
      </p>
    </Card>
  );
};

/* ── step-through: walk A - B for a concrete 4-bit pair (default 5 - 3) ── */
const toBits4 = (n: number) => [3, 2, 1, 0].map((i) => (n >> i) & 1);

const SubtractStepThrough: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [A, setA] = useState([0, 1, 0, 1]); // 5
  const [B, setB] = useState([0, 0, 1, 1]); // 3

  // Everything below is computed in code, never hardcoded.
  const Aval = toVal(A), Bval = toVal(B);
  const inv = B.map((b) => b ^ 1);                 // ~B (one's complement)
  const negVal = (toVal(inv) + 1) & 15;            // ~B + 1 in 4 bits = -B (mod 16)
  const negBits = toBits4(negVal);                 // two's-complement of B
  const rawSum = Aval + negVal;                    // A + (-B) including the 5th carry bit
  const carryOut = (rawSum >> 4) & 1;              // the final carry to discard
  const resVal = rawSum & 15;                      // low 4 bits = the answer (mod 16)
  const resBits = toBits4(resVal);
  const trueDiff = Aval - Bval;                    // signed result for the caption

  const big = (s: string, c: string) => <span className="font-mono text-base font-black" style={{ color: c }}>{s}</span>;

  const steps = [
    {
      label: lang === 'hi' ? 'A और B के bits' : 'Show A and B bits',
      body: (
        <div className="space-y-3">
          <BitRow isDarkMode={isDarkMode} label="A" bits={A} color={ACC.I} />
          <BitRow isDarkMode={isDarkMode} label="B" bits={B} color={ACC.II} />
          <p className={`mt-2 text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>हमें <b>{big(`${Aval} - ${Bval}`, accent)}</b> निकालना है - पर adder सिर्फ़ जोड़ सकता है। तो हम B का negative बनाएँगे।</>
              : <>We want <b>{big(`${Aval} - ${Bval}`, accent)}</b> - but the adder can only add. So we will build the negative of B.</>}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'B को invert करो (~B)' : 'Invert B (~B)',
      body: (
        <div className="space-y-3">
          <BitRow isDarkMode={isDarkMode} label="B" bits={B} color={ACC.II} />
          <BitRow isDarkMode={isDarkMode} label={lang === 'hi' ? '~B (हर bit flip)' : '~B (flip each bit)'} bits={inv} color={ACC.III} />
          <p className={`mt-2 text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>हर 1 बना 0, हर 0 बना 1। यही <b>one's complement</b> है। अभी यह -B नहीं है।</>
              : <>Every 1 became 0, every 0 became 1. This is the <b>one's complement</b>. It is not -B yet.</>}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? '1 जोड़ो -> यही -B' : 'Add 1 -> this is -B',
      body: (
        <div className="space-y-3">
          <BitRow isDarkMode={isDarkMode} label="~B" bits={inv} color={ACC.III} />
          <BitRow isDarkMode={isDarkMode} label={lang === 'hi' ? '~B + 1 = -B' : '~B + 1 = -B'} bits={negBits} color={ACC.good} />
          <p className={`mt-2 text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>~B में 1 जोड़ते ही मिलता है <b>two's complement</b> = {big(negBits.join(''), ACC.good)}, यानी binary में -{Bval}।</>
              : <>Adding 1 to ~B gives the <b>two's complement</b> = {big(negBits.join(''), ACC.good)}, which is -{Bval} in binary.</>}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'A में -B जोड़ो' : 'Add -B to A',
      body: (
        <div className="space-y-3">
          <BitRow isDarkMode={isDarkMode} label="A" bits={A} color={ACC.I} />
          <BitRow isDarkMode={isDarkMode} label={lang === 'hi' ? '-B' : '-B'} bits={negBits} color={ACC.good} />
          <div className="my-1 h-px w-full" style={{ background: `${accent}33` }} />
          <div className="flex items-center gap-3">
            <span className={`w-24 font-mono text-[12px] ${t.faint}`}>{lang === 'hi' ? 'carry-out' : 'carry-out'}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black"
              style={{ border: `1.5px solid ${ACC.III}`, color: ACC.III, background: carryOut ? `${ACC.III}22` : 'transparent' }}>{carryOut}</span>
            <BitRow isDarkMode={isDarkMode} label="" bits={resBits} color={ACC.I} />
          </div>
          <p className={`mt-2 text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? <>साधारण adder ने {big(`${Aval} + ${negVal}`, accent)} = 5-bit {big(((carryOut << 4) | resVal).toString(2).padStart(5, '0'), accent)} निकाला।</>
              : <>The ordinary adder produced {big(`${Aval} + ${negVal}`, accent)} = the 5-bit value {big(((carryOut << 4) | resVal).toString(2).padStart(5, '0'), accent)}.</>}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'carry छोड़ो, जवाब पढ़ो' : 'Discard carry, read result',
      body: (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-base font-black line-through opacity-50"
              style={{ border: `1.5px solid ${ACC.III}66`, color: ACC.III }}>{carryOut}</span>
            <span className={`font-mono text-[12px] ${t.faint}`}>{lang === 'hi' ? '<- carry-out फेंक दो' : '<- throw the carry-out away'}</span>
          </div>
          <BitRow isDarkMode={isDarkMode} label={lang === 'hi' ? 'जवाब' : 'Result'} bits={resBits} color={ACC.good} />
          <p className={`mt-2 text-center text-xl font-black ${t.text}`}>
            {Aval} - {Bval} = <span style={{ color: ACC.good }}>{trueDiff}</span>
          </p>
          <p className={`text-center text-[12px] ${t.faint}`}>
            {trueDiff < 0
              ? (lang === 'hi'
                ? `carry-out 0 = नतीजा negative; bits ${resBits.join('')} उसका two's-complement रूप हैं।`
                : `carry-out 0 means the result is negative; bits ${resBits.join('')} are its two's-complement form.`)
              : (lang === 'hi'
                ? `low 4 bits ${resBits.join('')} = ${resVal}; कहीं subtraction हुआ ही नहीं, सिर्फ़ addition।`
                : `low 4 bits ${resBits.join('')} = ${resVal}; we never subtracted, only added.`)}
          </p>
        </div>
      ),
    },
  ];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-5 space-y-3">
        <BitRow isDarkMode={isDarkMode} label={lang === 'hi' ? 'A चुनें' : 'Pick A'} bits={A} color={ACC.I}
          onToggle={(i) => setA((b) => b.map((v, j) => (j === i ? v ^ 1 : v)))} />
        <BitRow isDarkMode={isDarkMode} label={lang === 'hi' ? 'B चुनें' : 'Pick B'} bits={B} color={ACC.II}
          onToggle={(i) => setB((b) => b.map((v, j) => (j === i ? v ^ 1 : v)))} />
        <p className={`text-[12px] ${t.faint}`}>
          {lang === 'hi'
            ? 'ऊपर के bits दबाकर A और B चुनें, फिर नीचे step-by-step A - B चलाएँ।'
            : 'Tap the bits above to choose A and B, then walk A - B step by step below.'}
        </p>
      </div>
      <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* ── the mode bit M ── */
const ModeBitDemo: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [m, setM] = useState(0);
  return (
    <Card isDarkMode={isDarkMode} className="text-center">
      <button onClick={() => setM((v) => v ^ 1)}
        className="mx-auto flex items-center gap-4 rounded-3xl border px-8 py-5 transition-all active:scale-95"
        style={{ borderColor: m ? ACC.III : ACC.I, background: `${m ? ACC.III : ACC.I}14` }}>
        <span className="font-mono text-[12px] uppercase tracking-widest" style={{ color: m ? ACC.III : ACC.I }}>Mode bit M</span>
        <span className="text-5xl font-black tabular-nums" style={{ color: m ? ACC.III : ACC.I }}>{m}</span>
      </button>
      <div className="mt-5 text-2xl font-black" style={{ color: m ? ACC.III : ACC.I }}>
        {m ? (lang === 'hi' ? 'SUBTRACT मोड' : 'SUBTRACT mode') : (lang === 'hi' ? 'ADD मोड' : 'ADD mode')}
      </div>
      <p className={`mt-2 text-[13px] ${t.sub}`}>
        {m
          ? (lang === 'hi' ? 'M = 1: carry-in भी 1 हो जाता है (वही "+1"), और B पलट जाता है।' : 'M = 1: the carry-in also becomes 1 (that is the "+1"), and B gets inverted.')
          : (lang === 'hi' ? 'M = 0: circuit सीधा A + B जोड़ता है।' : 'M = 0: the circuit just adds A + B.')}
      </p>
    </Card>
  );
};

/* ── the mode bit M as a physical toggle switch (with carry-in pin + XOR bank) ── */
const ModeSwitchIllustration: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [m, setM] = useState(0);
  const c = m ? ACC.III : ACC.I;
  const muted = isDarkMode ? '#64748b' : '#94a3b8'; // real hex for dimmed labels (t.faint is a Tailwind class, not a colour)
  const Bbits = [1, 0, 1, 1]; // a fixed sample B so the bank visibly reacts to M
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="text-center">
        <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>
          {lang === 'hi' ? 'भौतिक toggle switch' : 'Physical toggle switch'}
        </span>
      </div>

      {/* the switch itself */}
      <button onClick={() => setM((v) => v ^ 1)}
        className="mx-auto mt-4 flex w-full max-w-md items-center justify-center gap-4 rounded-3xl border-2 px-6 py-5 transition-all active:scale-95"
        style={{ borderColor: c, background: `${c}10` }}>
        <span className="flex flex-col items-center gap-1">
          <Plus size={20} style={{ color: m ? muted : ACC.I }} />
          <span className="font-mono text-[10px] font-black" style={{ color: m ? muted : ACC.I }}>ADD</span>
        </span>
        <motion.div animate={{ rotate: m ? 0 : 0 }}>
          {m ? <ToggleRight size={56} style={{ color: ACC.III }} /> : <ToggleLeft size={56} style={{ color: ACC.I }} />}
        </motion.div>
        <span className="flex flex-col items-center gap-1">
          <Minus size={20} style={{ color: m ? ACC.III : muted }} />
          <span className="font-mono text-[10px] font-black" style={{ color: m ? ACC.III : muted }}>SUB</span>
        </span>
      </button>
      <div className="mt-3 text-center text-2xl font-black" style={{ color: c }}>
        M = {m} · {m ? (lang === 'hi' ? 'SUBTRACT' : 'SUBTRACT') : (lang === 'hi' ? 'ADD' : 'ADD')}
      </div>

      {/* the one M wire fans out to two destinations */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* carry-in pin */}
        <div className="rounded-2xl border p-4" style={{ borderColor: `${c}55`, background: `${c}0d` }}>
          <div className="flex items-center justify-between">
            <span className={`font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>{lang === 'hi' ? 'carry-in पिन' : 'carry-in pin'}</span>
            <ArrowRight size={14} style={{ color: c }} />
          </div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-4xl font-black tabular-nums" style={{ color: c }}>{m}</span>
            <span className={`mb-1 text-[12px] ${t.sub}`}>{m ? (lang === 'hi' ? '= वही "+1"' : '= the "+1"') : (lang === 'hi' ? '= कोई "+1" नहीं' : '= no "+1"')}</span>
          </div>
        </div>

        {/* XOR bank reacting */}
        <div className="rounded-2xl border p-4" style={{ borderColor: `${c}55`, background: `${c}0d` }}>
          <div className="flex items-center justify-between">
            <span className={`font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>{lang === 'hi' ? 'XOR bank (B पर)' : 'XOR bank (on B)'}</span>
            <span className="font-mono text-[10px] font-black" style={{ color: c }}>{m ? (lang === 'hi' ? 'आईना' : 'MIRROR') : (lang === 'hi' ? 'खुला' : 'OPEN')}</span>
          </div>
          <div className="mt-3 flex justify-center gap-2">
            {Bbits.map((b, i) => {
              const o = b ^ m;
              return (
                <div key={i} className="flex flex-col items-center">
                  <span className={`font-mono text-[10px] ${t.faint}`}>{b}</span>
                  <motion.div key={`${i}-${m}`} initial={{ scaleX: -1, opacity: 0.4 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.3 }}
                    className="my-1 flex h-7 w-7 items-center justify-center rounded-md font-mono text-[11px] font-black"
                    style={{ background: o ? c : 'transparent', color: o ? '#000' : c, border: `1.5px solid ${c}` }}>
                    {o}
                  </motion.div>
                  {m ? <FlipHorizontal2 size={11} style={{ color: ACC.III }} /> : <DoorOpen size={11} style={{ color: ACC.I }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className={`mt-4 text-center text-[13px] ${t.sub}`}>
        {m
          ? (lang === 'hi' ? <>switch नीचे (M=1): carry-in 1 हो गया और XOR bank ने B को <b style={{ color: ACC.III }}>invert</b> कर दिया - subtraction तैयार।</> : <>switch flipped (M=1): carry-in became 1 and the XOR bank <b style={{ color: ACC.III }}>inverted</b> B - subtraction is set up.</>)
          : (lang === 'hi' ? <>switch ऊपर (M=0): carry-in 0 और XOR bank ने B को <b style={{ color: ACC.I }}>वैसा ही</b> गुज़रने दिया - plain addition।</> : <>switch up (M=0): carry-in 0 and the XOR bank let B <b style={{ color: ACC.I }}>pass through</b> - plain addition.</>)}
      </p>
    </Card>
  );
};

/* ── unified matrix: one circuit, two operations, side by side ── */
const UnifiedMatrix: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [m, setM] = useState(0);

  const rows = [
    {
      label: lang === 'hi' ? 'Mode bit M' : 'Mode bit M',
      add: '0', sub: '1',
    },
    {
      label: lang === 'hi' ? 'B पर XOR gates' : 'XOR gates on B',
      add: lang === 'hi' ? 'pass (खुला दरवाज़ा)' : 'pass (open door)',
      sub: lang === 'hi' ? 'invert (आईना)' : 'invert (mirror)',
    },
    {
      label: lang === 'hi' ? 'carry-in (Cin)' : 'carry-in (Cin)',
      add: '0', sub: lang === 'hi' ? '1  (वही +1)' : '1  (the +1)',
    },
    {
      label: lang === 'hi' ? 'adder को क्या मिलता है' : 'adder receives',
      add: 'A + B', sub: 'A + (NOT B) + 1',
    },
    {
      label: lang === 'hi' ? 'final output' : 'final output',
      add: 'A + B', sub: 'A - B',
    },
  ];

  const Col: React.FC<{ active: boolean; head: string; color: string; target: number; pick: (r: typeof rows[number]) => string }>
    = ({ active, head, color, target, pick }) => (
    <button onClick={() => setM(target)}
      className="flex-1 rounded-2xl border-2 p-3 text-left transition-all"
      style={{ borderColor: active ? color : `${color}33`, background: active ? `${color}1a` : 'transparent', opacity: active ? 1 : 0.5 }}>
      <div className="mb-3 flex items-center gap-2">
        {color === ACC.I ? <Plus size={16} style={{ color }} /> : <Minus size={16} style={{ color }} />}
        <span className="font-mono text-[12px] font-black uppercase tracking-widest" style={{ color }}>{head}</span>
      </div>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-col">
            <span className={`font-mono text-[9px] uppercase tracking-wide ${t.faint}`}>{r.label}</span>
            <motion.span key={`${i}-${active}`} animate={{ opacity: active ? 1 : 0.55 }}
              className={`font-mono text-[14px] font-black ${active ? t.text : t.faint}`}>{pick(r)}</motion.span>
          </div>
        ))}
      </div>
    </button>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>
          {lang === 'hi' ? 'एक circuit, दो operations' : 'One circuit, two operations'}
        </span>
        <button onClick={() => setM((v) => v ^ 1)} className="rounded-lg px-4 py-1.5 font-mono text-sm font-black text-black active:scale-95"
          style={{ background: m ? ACC.III : ACC.I }}>
          M = {m} · {m ? (lang === 'hi' ? 'SUBTRACT' : 'SUBTRACT') : (lang === 'hi' ? 'ADD' : 'ADD')}
        </button>
      </div>
      <div className="flex gap-3">
        <Col active={!m} head={lang === 'hi' ? 'जोड़ना' : 'ADD'} color={ACC.I} target={0} pick={(r) => r.add} />
        <Col active={!!m} head={lang === 'hi' ? 'घटाना' : 'SUBTRACT'} color={ACC.III} target={1} pick={(r) => r.sub} />
      </div>
      <p className={`mt-4 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? 'M toggle करें: एक ही column live होता है - लेकिन hardware एक ही है, सिर्फ़ M बदलता है।'
          : 'Toggle M: only one column lights up - yet the hardware is identical, only M changes.'}
      </p>
    </Card>
  );
};

/* ── capstone: the adder/subtractor unit ── */
const AdderSubtractorDemo: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [A, setA] = useState([0, 1, 0, 1]); // 5
  const [B, setB] = useState([0, 0, 1, 1]); // 3
  const [m, setM] = useState(1);

  const Bx = B.map((b) => b ^ m);            // XOR shape-shifter
  let carry = m;                              // carry-in = M (the +1)
  const res = [0, 0, 0, 0];
  for (let i = 3; i >= 0; i--) { const s = A[i] + Bx[i] + carry; res[i] = s & 1; carry = s >> 1; }
  const Aval = toVal(A), Bval = toVal(B);
  const dec = m ? Aval - Bval : Aval + Bval;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="space-y-3">
        <BitRow isDarkMode={isDarkMode} label="A" bits={A} color={ACC.I} onToggle={(i) => setA((b) => b.map((v, j) => (j === i ? v ^ 1 : v)))} />
        <BitRow isDarkMode={isDarkMode} label="B" bits={B} color={ACC.I} onToggle={(i) => setB((b) => b.map((v, j) => (j === i ? v ^ 1 : v)))} />
        <div className="flex items-center gap-3 py-1">
          <span className={`w-24 font-mono text-[12px] ${t.faint}`}>Mode M</span>
          <button onClick={() => setM((v) => v ^ 1)} className="rounded-lg px-4 py-1.5 font-mono text-sm font-black active:scale-95"
            style={{ background: m ? ACC.III : ACC.I, color: '#000' }}>
            M = {m} · {m ? 'SUBTRACT' : 'ADD'}
          </button>
        </div>
        <BitRow isDarkMode={isDarkMode} label={m ? 'B XOR M (flipped)' : 'B XOR M (same)'} bits={Bx} color={m ? ACC.III : ACC.II} />
        <div className="my-2 h-px w-full" style={{ background: `${accent}33` }} />
        <BitRow isDarkMode={isDarkMode} label="Result" bits={res} color={ACC.good} />
      </div>
      <p className={`mt-4 text-center text-xl font-black ${t.text}`}>
        {Aval} {m ? '−' : '+'} {Bval} = <span style={{ color: ACC.good }}>{dec}</span>
      </p>
      {m && dec < 0 && (
        <p className="mt-1 text-center text-[12px]" style={{ color: ACC.III }}>
          {lang === 'hi'
            ? `Result bits ${res.join('')} = ${dec} का two's complement रूप हैं; carry-out 0 = borrow (negative).`
            : `Result bits ${res.join('')} are the two's-complement form of ${dec}; carry-out 0 signals a borrow (negative).`}
        </p>
      )}
      <p className={`mt-1 text-center text-[12px] ${t.faint}`}>
        {lang === 'hi'
          ? 'एक ही hardware - सिर्फ M बदलिए, adder subtractor बन जाता है।'
          : 'One piece of hardware - flip M and the adder becomes a subtractor.'}
      </p>
    </Card>
  );
};

/* ── bespoke: the grand deception (the calculator that can't subtract) ── */
const DeceptionViz: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [reveal, setReveal] = useState(false);
  return (
    <Card isDarkMode={isDarkMode} className="text-center">
      <div className="mx-auto mb-5 w-44 rounded-2xl border-2 p-3" style={{ borderColor: accent }}>
        <div className="mb-3 rounded-lg px-3 py-3 text-right font-mono text-lg font-black"
          style={{ background: isDarkMode ? '#0a0e1a' : '#0f172a', color: ACC.good }}>
          <AnimatePresence mode="wait">
            <motion.span key={reveal ? 'r' : 'f'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="block">
              {reveal ? 'A + (-B)' : 'A - B'}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-md" style={{ background: `${accent}22` }} />
          ))}
          <motion.div animate={{ background: reveal ? accent : `${accent}22` }}
            className="flex aspect-square items-center justify-center rounded-md font-black"
            style={{ color: reveal ? '#000' : accent }}>-</motion.div>
        </div>
      </div>
      <button onClick={() => setReveal((r) => !r)} className="rounded-xl px-5 py-2 font-black text-black active:scale-95" style={{ background: accent }}>
        {reveal ? (lang === 'hi' ? 'फिर से छुपाओ' : 'Hide the trick') : (lang === 'hi' ? 'राज़ खोलो' : 'Reveal the trick')}
      </button>
      <p className={`mt-4 text-[14px] ${t.sub}`}>
        {reveal
          ? (lang === 'hi' ? 'असल में calculator घटाता ही नहीं - वह B का negative बनाकर जोड़ देता है। Subtraction एक illusion है।' : 'The calculator never truly subtracts - it builds the negative of B and adds it. Subtraction is an illusion.')
          : (lang === 'hi' ? 'आप "minus" दबाते हैं... पर अंदर असल में क्या होता है? राज़ खोलिए।' : 'You press "minus"... but what really happens inside? Reveal the trick.')}
      </p>
    </Card>
  );
};

/* ── bespoke: the XOR shape-shifter as an open door vs a mirror ── */
const ShapeShifterDoor: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [m, setM] = useState(0);
  const [b, setB] = useState(1);
  const out = b ^ m;
  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-5 flex justify-center gap-3">
        <button onClick={() => setM((v) => v ^ 1)} className={`flex flex-col items-center gap-1 rounded-2xl border px-5 py-3 active:scale-95 ${t.card}`}>
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: m ? ACC.III : ACC.I }}>Mode M</span>
          <span className="text-2xl font-black" style={{ color: m ? ACC.III : ACC.I }}>{m}</span>
        </button>
        <button onClick={() => setB((v) => v ^ 1)} className={`flex flex-col items-center gap-1 rounded-2xl border px-5 py-3 active:scale-95 ${t.card}`}>
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: ACC.II }}>bit b</span>
          <span className="text-2xl font-black" style={{ color: ACC.II }}>{b}</span>
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="font-mono text-sm font-black" style={{ color: ACC.II }}>b={b}</span>
        <motion.div key={m} initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-1 rounded-2xl border-2 px-5 py-3" style={{ borderColor: m ? ACC.III : ACC.I }}>
          {m ? <FlipHorizontal2 size={26} style={{ color: ACC.III }} /> : <DoorOpen size={26} style={{ color: ACC.I }} />}
          <span className="font-mono text-[10px] font-black uppercase" style={{ color: m ? ACC.III : ACC.I }}>{m ? (lang === 'hi' ? 'MIRROR' : 'MIRROR') : (lang === 'hi' ? 'OPEN DOOR' : 'OPEN DOOR')}</span>
        </motion.div>
        <LiveGate type="XOR" a={b} b={m} isDarkMode={isDarkMode} accent={accent} colorA={ACC.II} colorB={m ? ACC.III : ACC.I} colorOut={ACC.good} labelOut="b XOR M" />
        <span className="font-mono text-sm font-black" style={{ color: ACC.good }}>out={out}</span>
      </div>
      <p className={`mt-4 text-center text-[14px] ${t.sub}`}>
        {m
          ? (lang === 'hi' ? <><b style={{ color: ACC.III }}>MIRROR (M=1)</b>: हर bit पलट जाता है - यही subtraction की तैयारी है।</> : <><b style={{ color: ACC.III }}>MIRROR (M=1)</b>: every bit flips - this is the setup for subtraction.</>)
          : (lang === 'hi' ? <><b style={{ color: ACC.I }}>OPEN DOOR (M=0)</b>: bit बिना बदले गुज़र जाता है - सीधा addition।</> : <><b style={{ color: ACC.I }}>OPEN DOOR (M=0)</b>: the bit passes through unchanged - plain addition.</>)}
      </p>
    </Card>
  );
};

const bespokeFor = (scene: SubScene): React.ReactNode | null => {
  const key = `${scene.id} ${scene.label}`.toLowerCase();
  if (/deception/.test(key)) return 'deception';
  if (/complement|two/.test(key)) return 'twos';
  if (/mode|switch/.test(key)) return 'mode';
  if (/xor|shape|shift/.test(key)) return 'addsub';
  return null;
};

const partAt = (i: number): string =>
  i <= 2 ? 'PART I · THE ILLUSION'
    : i <= 5 ? 'PART II · THE TRICK'
      : 'PART III · LOCK IT IN';

function componentFor(scene: SubScene): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="How Computers Subtract" />;
    case 'video':
      return (p) => <VideoScene {...p} scene={scene} src="/videos/how-computers-subtract.mp4" />;
    case 'flashcards':
      return (p) => (
        <SceneShell>
          <section className="space-y-3"><Eyebrow accent={p.accent}>{scene.label}</Eyebrow>
            {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${tone(p.isDarkMode).text}`}>{scene.subtitle}</h2>}</section>
          <SubFlashCards isDarkMode={p.isDarkMode} accent={p.accent} cards={CONTENT.flashcards} />
        </SceneShell>
      );
    case 'quiz':
      return (p) => <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="THE ILLUSION" tag="Practice · How Computers Subtract" title={scene.label} intro={scene.subtitle ?? ''} />;
    case 'recap':
      return (p) => <RecapScene {...p} scene={scene} />;
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'deception' && <DeceptionViz isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'twos' && (
            <div className="space-y-4">
              <TwosComplementDemo isDarkMode={p.isDarkMode} accent={p.accent} />
              <SubtractStepThrough isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'mode' && (
            <div className="space-y-4">
              <ModeSwitchIllustration isDarkMode={p.isDarkMode} accent={p.accent} />
              <ModeBitDemo isDarkMode={p.isDarkMode} accent={p.accent} />
              <UnifiedMatrix isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'addsub' && (
            <div className="space-y-4">
              <ShapeShifterDoor isDarkMode={p.isDarkMode} accent={p.accent} />
              <AdderSubtractorDemo isDarkMode={p.isDarkMode} accent={p.accent} />
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
