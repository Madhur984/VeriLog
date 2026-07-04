/**
 * Decoders (dsd/23) - "The One-Hot Selector".
 * Generic scenes come from the shared _subtractor kit; the classroom roll-call
 * animation, the live 2-to-4 gate-level build (LiveGate per output), the
 * active-high vs active-low truth tables, the decoder+OR XOR builder and the
 * three guided proofs are bespoke. Every one-hot line, minterm and gate output
 * is COMPUTED in code from the live address bits - nothing is hardcoded.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import {
  SceneShell, Eyebrow, Card, TruthTable, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  StepThrough, LiveGate, WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import { DecoderViz, BitToggle } from '../_combo/blocks';
import { TryItYourself } from '../../ui/TryItYourself';
import { CONTENT } from './content';

const SRC_EN: string | undefined = '/videos/dsd23-decoders.mp4';
const SRC_HI: string | undefined = undefined;
void SRC_HI; // single EN cut for this module; HI reserved for future

const ACC = { sel: '#34d399', addr: '#f59e0b', dim: '#64748b' };

/* the i-th 2-input minterm as ASCII (A1 MSB, A0 LSB) */
const minterm2 = (i: number) =>
  `A1${(i >> 1) & 1 ? '' : "'"}.A0${i & 1 ? '' : "'"}`;

/* ───────── bespoke: the classroom roll-call ─────────
   The teacher calls a 2-bit code; four seated students Y0..Y3 listen, and the
   single student whose ID (minterm) matches the code stands up. All selection
   computed: the standing student index == the code value. */
const RollCall: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [addr, setAddr] = useState<number[]>([1, 0]); // A1, A0
  const code = addr[0] * 2 + addr[1];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex items-center justify-center gap-2">
        <Users size={18} style={{ color: accent }} />
        <span className={`font-mono text-[12px] uppercase tracking-widest ${t.faint}`}>
          {lang === 'hi' ? 'roll-call · teacher एक code बुलाता है' : 'roll-call · the teacher calls one code'}
        </span>
      </div>

      {/* teacher board: the called code */}
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-2xl border px-6 py-3 text-center"
          style={{ borderColor: `${ACC.addr}66`, background: `${ACC.addr}12` }}>
          <div className={`font-mono text-[10px] uppercase tracking-widest ${t.faint}`}>
            {lang === 'hi' ? 'teacher बुलाता है' : 'teacher calls'}
          </div>
          <div className="mt-1 flex items-center justify-center gap-3">
            <BitToggle value={addr[0]} onClick={() => setAddr((a) => [a[0] ^ 1, a[1]])} color={ACC.addr} label="A1" size={40} />
            <BitToggle value={addr[1]} onClick={() => setAddr((a) => [a[0], a[1] ^ 1])} color={ACC.addr} label="A0" size={40} />
            <span className="font-mono text-2xl font-black" style={{ color: ACC.addr }}>= {code}</span>
          </div>
        </div>
      </div>

      {/* the four students */}
      <div className="mt-6 grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => {
          const stands = i === code;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{ y: stands ? -10 : 0, scale: stands ? 1.08 : 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                className="flex h-20 w-full flex-col items-center justify-end rounded-2xl border pb-2"
                style={{
                  borderColor: stands ? accent : `${ACC.dim}55`,
                  background: stands ? `${accent}1a` : 'transparent',
                }}
              >
                {/* a tiny stick-student: head + body, stands taller when selected */}
                <motion.div animate={{ height: stands ? 34 : 18 }} className="flex flex-col items-center justify-end">
                  <span className="h-3 w-3 rounded-full" style={{ background: stands ? accent : ACC.dim }} />
                  <span className="mt-0.5 w-1.5 rounded-full" style={{ background: stands ? accent : ACC.dim, height: stands ? 18 : 8 }} />
                </motion.div>
              </motion.div>
              <span className="font-mono text-[11px] font-black" style={{ color: stands ? accent : (t.faint as string) }}>Y{i}</span>
              <span className="font-mono text-[8px]" style={{ color: stands ? accent : (t.faint as string) }}>{minterm2(i)}</span>
              <BitToggle value={stands ? 1 : 0} color={stands ? accent : ACC.dim} size={24} />
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.p key={code} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className={`mt-5 text-center font-mono text-[13px] ${t.sub}`}>
          {lang === 'hi'
            ? <>teacher ने <b style={{ color: ACC.addr }}>{code}</b> बुलाया {'->'} सिर्फ़ student <b style={{ color: accent }}>Y{code}</b> खड़ा होता है (ID {minterm2(code)} = 1), बाक़ी बैठे।</>
            : <>teacher calls <b style={{ color: ACC.addr }}>{code}</b> {'->'} only student <b style={{ color: accent }}>Y{code}</b> stands (its ID {minterm2(code)} = 1), the rest stay seated.</>}
        </motion.p>
      </AnimatePresence>
    </Card>
  );
};

/* ───────── bespoke: live 2-to-4 gate-level build ─────────
   Two NOT gates make the complements; four AND gates each compute one output
   live from the chosen address. Exactly one fires - shown with LiveGate. */
const GateBuild: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [a1, setA1] = useState(1);
  const [a0, setA0] = useState(0);
  const nA1 = a1 ^ 1;
  const nA0 = a0 ^ 1;
  // each output is an AND of the two chosen literals
  const Y = [nA1 & nA0, nA1 & a0, a1 & nA0, a1 & a0]; // Y0..Y3
  const code = a1 * 2 + a0;
  // the two literals feeding each AND gate
  const litA: number[] = [nA1, nA1, a1, a1];
  const litB: number[] = [nA0, a0, nA0, a0];
  const labA = ["A1'", "A1'", 'A1', 'A1'];
  const labB = ["A0'", 'A0', "A0'", 'A0'];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className={`font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>
          {lang === 'hi' ? '2-to-4 · 4 AND + 2 NOT' : '2-to-4 · 4 AND + 2 NOT'}
        </span>
      </div>

      {/* address inputs + their complements (the two NOT gates) */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="flex items-center gap-3">
          <BitToggle value={a1} onClick={() => setA1((v) => v ^ 1)} color={ACC.addr} label="A1" size={40} />
          <BitToggle value={a0} onClick={() => setA0((v) => v ^ 1)} color={ACC.addr} label="A0" size={40} />
          <span className="font-mono text-lg font-black" style={{ color: ACC.addr }}>= {code}</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center gap-1">
            <span className={`font-mono text-[10px] ${t.faint}`}>NOT {'->'} A1'</span>
            <LiveGate type="NOT" a={a1} isDarkMode={isDarkMode} accent={accent} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className={`font-mono text-[10px] ${t.faint}`}>NOT {'->'} A0'</span>
            <LiveGate type="NOT" a={a0} isDarkMode={isDarkMode} accent={accent} />
          </div>
        </div>
      </div>

      <div className="my-4 h-px w-full" style={{ background: `${accent}22` }} />

      {/* the four AND gates - exactly one fires */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => {
          const on = Y[i] === 1;
          return (
            <div key={i} className="flex items-center gap-3 rounded-2xl border p-3"
              style={{ borderColor: on ? accent : `${ACC.dim}44`, background: on ? `${accent}10` : 'transparent' }}>
              <div className="flex flex-col items-center">
                <span className="font-mono text-[11px] font-black" style={{ color: on ? accent : (t.faint as string) }}>Y{i}</span>
                <span className="font-mono text-[9px]" style={{ color: on ? accent : (t.faint as string) }}>{minterm2(i)}</span>
              </div>
              <div className="flex-1">
                <LiveGate type="AND" a={litA[i]} b={litB[i]} isDarkMode={isDarkMode} accent={accent}
                  labelA={labA[i]} labelB={labB[i]} labelOut={`Y${i}`} />
              </div>
            </div>
          );
        })}
      </div>

      <p className={`mt-4 text-center font-mono text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>code {code} पर सिर्फ़ <b style={{ color: accent }}>Y{code}</b> का AND fire करता है - one-hot wiring से निकलता है।</>
          : <>at code {code} only <b style={{ color: accent }}>Y{code}</b>'s AND fires - the one-hot property emerges from the wiring.</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: active-high vs active-low side by side ───────── */
const PolarityTables: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [code, setCode] = useState(2);
  const rows = [0, 1, 2, 3];
  const A1 = (code >> 1) & 1, A0 = code & 1;

  const high = rows.map((r) => ({
    cells: [(r >> 1) & 1, r & 1, ...rows.map((o) => (o === code ? 1 : 0))],
    highlight: r === code,
  }));
  const low = rows.map((r) => ({
    cells: [(r >> 1) & 1, r & 1, ...rows.map((o) => (o === code ? 0 : 1))],
    highlight: r === code,
  }));

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
        <span className={`font-mono text-[11px] ${t.faint}`}>{lang === 'hi' ? 'code चुनिए' : 'pick a code'}</span>
        {rows.map((r) => (
          <button key={r} onClick={() => setCode(r)}
            className="rounded-lg border px-3 py-1.5 font-mono text-[12px] font-black"
            style={code === r
              ? { background: ACC.addr, color: '#000', borderColor: ACC.addr }
              : { borderColor: `${ACC.addr}44`, color: ACC.addr, background: 'transparent' }}>
            {(r >> 1) & 1}{r & 1}
          </button>
        ))}
        <span className="font-mono text-[12px]" style={{ color: ACC.addr }}>A1A0 = {A1}{A0}</span>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="text-center font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>
            {lang === 'hi' ? 'active-high · एक 1' : 'active-high · one 1'}
          </div>
          <TruthTable isDarkMode={isDarkMode} accent={accent}
            headers={['A1', 'A0', 'Y0', 'Y1', 'Y2', 'Y3']} rows={high}
            note={lang === 'hi' ? 'चुना output 1, बाक़ी 0 (minterm)।' : 'selected output 1, the rest 0 (minterm).'} />
        </div>
        <div className="space-y-2">
          <div className="text-center font-mono text-[11px] uppercase tracking-widest" style={{ color: '#fb7185' }}>
            {lang === 'hi' ? 'active-low · एक 0' : 'active-low · one 0'}
          </div>
          <TruthTable isDarkMode={isDarkMode} accent="#fb7185"
            headers={['A1', 'A0', 'Y0', 'Y1', 'Y2', 'Y3']} rows={low}
            note={lang === 'hi' ? 'चुना output 0, बाक़ी 1 (maxterm, NAND-built)।' : 'selected output 0, the rest 1 (maxterm, NAND-built).'} />
        </div>
      </div>
      <p className={`mt-4 text-center font-mono text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>दोनों एक ही line चुनते हैं (Y{code}) - सिर्फ़ polarity उलटी।</>
          : <>both select the same line (Y{code}) - only the polarity flips.</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: decoder + OR = XOR builder ─────────
   A 2-to-4 decoder feeds an OR over Y1,Y2; live LiveGate XOR confirms the match. */
const FunctionBuilder: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [a, setA] = useState(0); // A (MSB)
  const [b, setB] = useState(1); // B (LSB)
  const code = a * 2 + b;
  const Y = [(a ^ 1) & (b ^ 1), (a ^ 1) & b, a & (b ^ 1), a & b]; // Y0..Y3
  const F = Y[1] | Y[2];       // OR of minterms 1 and 2
  const xorCheck = a ^ b;

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 text-center font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>
        {lang === 'hi' ? 'F = Y1 + Y2 = A XOR B' : 'F = Y1 + Y2 = A XOR B'}
      </div>
      <div className="flex items-center justify-center gap-4">
        <BitToggle value={a} onClick={() => setA((v) => v ^ 1)} color={ACC.addr} label="A" size={40} />
        <BitToggle value={b} onClick={() => setB((v) => v ^ 1)} color={ACC.addr} label="B" size={40} />
        <span className="font-mono text-lg font-black" style={{ color: ACC.addr }}>= {code}</span>
      </div>

      {/* the four decoder lines, with Y1,Y2 tapped into the OR */}
      <div className="mt-5 grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((i) => {
          const tapped = i === 1 || i === 2;
          const on = Y[i] === 1;
          return (
            <div key={i} className="flex flex-col items-center gap-1 rounded-xl border p-2"
              style={{
                borderColor: on ? accent : `${ACC.dim}44`,
                background: tapped ? `${accent}0d` : 'transparent',
                opacity: tapped ? 1 : 0.55,
              }}>
              <span className="font-mono text-[10px]" style={{ color: on ? accent : (t.faint as string) }}>Y{i}</span>
              <BitToggle value={Y[i]} color={on ? accent : ACC.dim} size={26} />
              <span className="font-mono text-[8px]" style={{ color: tapped ? accent : (t.faint as string) }}>
                {tapped ? (lang === 'hi' ? 'OR में' : 'to OR') : (lang === 'hi' ? 'अनदेखा' : 'unused')}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <span className={`font-mono text-[10px] ${t.faint}`}>OR(Y1, Y2)</span>
          <LiveGate type="OR" a={Y[1]} b={Y[2]} isDarkMode={isDarkMode} accent={accent} labelA="Y1" labelB="Y2" labelOut="F" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className={`font-mono text-[10px] ${t.faint}`}>{lang === 'hi' ? 'जाँच · A XOR B' : 'check · A XOR B'}</span>
          <LiveGate type="XOR" a={a} b={b} isDarkMode={isDarkMode} accent={accent} labelA="A" labelB="B" labelOut="A^B" />
        </div>
      </div>

      <p className={`mt-4 text-center font-mono text-[14px] font-black`}
        style={{ color: F === xorCheck ? ACC.sel : '#fb7185' }}>
        F = {F} , A XOR B = {xorCheck} {F === xorCheck ? '✓' : '✗'}
      </p>
    </Card>
  );
};

/* ───────── bespoke: the three guided proofs (StepThrough) ─────────
   Every output, completeness sum and on-set is computed in code. */
const Derivations: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);

  const Eq: React.FC<{ children: React.ReactNode; on?: boolean }> = ({ children, on }) => (
    <div className="rounded-lg border px-3 py-2 font-mono text-[13px]"
      style={{ borderColor: on ? `${ACC.sel}66` : `${accent}22`, background: on ? `${ACC.sel}12` : 'transparent', color: on ? ACC.sel : (t.text as string) }}>
      {children}
    </div>
  );

  // proof 1: completeness check D0+D1+D2+D3 over all four codes (computed)
  const allOne = [0, 1, 2, 3].every((c) => {
    const a1 = (c >> 1) & 1, a0 = c & 1, nA1 = a1 ^ 1, nA0 = a0 ^ 1;
    const D = [nA1 & nA0, nA1 & a0, a1 & nA0, a1 & a0];
    return D.filter((x) => x === 1).length === 1;
  });

  // proof 3: full-adder SUM = on-set {1,2,4,7} over 3 inputs (computed)
  const sumOnset = Array.from({ length: 8 }, (_, i) => {
    const x = (i >> 2) & 1, y = (i >> 1) & 1, z = i & 1;
    return { i, on: (x ^ y ^ z) === 1 };
  });
  const sumList = sumOnset.filter((r) => r.on).map((r) => r.i).join(', ');

  const steps = [
    {
      label: lang === 'hi' ? '1 · चार minterm outputs' : '1 · four minterm outputs',
      body: (
        <div className="space-y-2.5">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? 'माँग: हर Di ठीक एक combination के लिए HIGH हो। उस शर्त को literals के product के रूप में लिखिए (A MSB, B LSB):'
              : 'Demand each Di be HIGH for exactly one combination. Write that condition as a product of literals (A is MSB, B is LSB):'}
          </p>
          <Eq>D0 HIGH only for A=0,B=0 {'->'} D0 = A'.B' = m0</Eq>
          <Eq>D1 HIGH only for A=0,B=1 {'->'} D1 = A'.B = m1</Eq>
          <Eq>D2 HIGH only for A=1,B=0 {'->'} D2 = A.B' = m2</Eq>
          <Eq>D3 HIGH only for A=1,B=1 {'->'} D3 = A.B = m3</Eq>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? '2 · completeness' : '2 · completeness',
      body: (
        <div className="space-y-2.5">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? 'चारों को OR कीजिए और सरल कीजिए - साबित कीजिए कि हर input के लिए ठीक एक HIGH है:'
              : 'OR all four and simplify - prove exactly one is HIGH for every input:'}
          </p>
          <Eq>D0+D1+D2+D3 = A'B' + A'B + AB' + AB</Eq>
          <Eq>= A'(B'+B) + A(B'+B) = A' + A = 1</Eq>
          <Eq on={allOne}>
            {lang === 'hi' ? 'code में जाँचा:' : 'checked in code:'} {allOne
              ? (lang === 'hi' ? 'हर एक 4 codes में ठीक एक output HIGH ✓' : 'exactly one output HIGH in all 4 codes ✓')
              : '✗'}
          </Eq>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? '3 · enable Di = E.mi' : '3 · enable Di = E.mi',
      body: (
        <div className="space-y-2.5">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? 'एक line E चाहिए जो 0 पर सब चुप करे, 1 पर decode करे। E को हर output में AND कीजिए:'
              : 'Want a line E that silences at 0 and decodes at 1. AND E into every output:'}
          </p>
          <Eq>Di = E . minterm_i</Eq>
          <Eq>E=0 {'->'} Di = 0 . mi = 0 {lang === 'hi' ? '(सब चुप)' : '(all silent)'}</Eq>
          <Eq>E=1 {'->'} Di = 1 . mi = mi {lang === 'hi' ? '(सामान्य decode)' : '(normal decode)'}</Eq>
          <Eq>{lang === 'hi' ? 'cascade: 3-to-8 = दो 2-to-4, एक E=A2 prime, दूसरा E=A2' : 'cascade: 3-to-8 = two 2-to-4, one E=A2 prime, other E=A2'}</Eq>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? '4 · decoder + OR theorem' : '4 · decoder + OR theorem',
      body: (
        <div className="space-y-2.5">
          <p className={`text-[13px] ${t.sub}`}>
            {lang === 'hi'
              ? 'कोई भी F अपने on-set minterms का योग है; decoder हर minterm एक wire पर देता है, तो:'
              : 'Any F is the sum of its on-set minterms; the decoder supplies each minterm on a wire, so:'}
          </p>
          <Eq>F = sum over i in on-set of mi = OR of selected Di</Eq>
          <Eq on>
            {lang === 'hi' ? 'उदाहरण full-adder SUM, on-set =' : 'example full-adder SUM, on-set ='} {`{${sumList}}`}
          </Eq>
          <Eq>SUM = OR(D1,D2,D4,D7) = X'Y'Z + X'YZ' + XY'Z' + XYZ</Eq>
          <p className={`text-[12px] ${t.faint}`}>
            {lang === 'hi'
              ? 'वही 3-to-8 decoder एक दूसरे OR gate से CARRY = OR(D3,D5,D6,D7) भी देता है।'
              : 'The same 3-to-8 decoder also gives CARRY = OR(D3,D5,D6,D7) from a second OR gate.'}
          </p>
        </div>
      ),
    },
  ];

  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

/* ───────── sources list (recap) ───────── */
const SOURCES: { label: string; url: string }[] = [
  { label: 'GeeksforGeeks - Binary Decoder in Digital Logic', url: 'https://www.geeksforgeeks.org/binary-decoder-in-digital-logic/' },
  { label: 'GeeksforGeeks - Multiplexers in Digital Logic', url: 'https://www.geeksforgeeks.org/digital-logic/multiplexers-in-digital-logic/' },
  { label: 'Electronics Tutorials - Binary Decoder', url: 'https://www.electronics-tutorials.ws/combination/comb_5.html' },
  { label: 'ElectronicsHub - Binary Decoder', url: 'https://www.electronicshub.org/binary-decoder/' },
  { label: 'Elprocus - Binary to Gray Code Converter', url: 'https://www.elprocus.com/code-converter-binary-to-gray-code-and-gray-code-to-binary-conversion/' },
];

const SourcesPanel: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <Card isDarkMode={isDarkMode}>
      <div className={`mb-3 font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>
        {lang === 'hi' ? 'स्रोत · sources' : 'Sources'}
      </div>
      <ul className="space-y-2">
        {SOURCES.map((s) => (
          <li key={s.url} className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: accent }} />
            <a href={s.url} target="_blank" rel="noreferrer"
              className={`text-[14px] underline decoration-dotted underline-offset-2 ${t.sub} hover:opacity-80`}>
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
};

/* ───────── part assignment ───────── */
const partAt = (i: number, n: number): string =>
  i <= 2 ? 'PART I · THE IDEA'
    : i <= Math.floor(n * 0.55) ? 'PART II · THE LOGIC'
      : i < n - 2 ? 'PART III · BUILD IT'
        : 'PART IV · LOCK IT IN';

const bespokeFor = (scene: SubScene): string | null => {
  const key = `${scene.id} ${scene.label}`.toLowerCase();
  if (/nintwopown|n in/.test(key)) return 'decoder2';
  if (/minterm/.test(key)) return 'rollcall';
  if (/hardware/.test(key)) return 'gates';
  if (/enable/.test(key)) return 'decoder3';
  if (/demux|demultiplex/.test(key)) return 'demux';
  if (/activelow|active-low|active/.test(key)) return 'polarity';
  if (/buildanyfunction|any function/.test(key)) return 'function';
  if (/derivation|proof/.test(key)) return 'proofs';
  if (/build the decoder|s10_build/.test(key)) return 'build';
  return null;
};

function componentFor(scene: SubScene, i: number, n: number): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="Decoder · The One-Hot Selector" hero={<DecoderViz isDarkMode={p.isDarkMode} accent={p.accent} bits={2} />} />;
    case 'video':
      return (p) => <VideoScene {...p} scene={scene} src={SRC_EN} />;
    case 'flashcards':
      return (p) => (
        <SceneShell>
          <section className="space-y-3">
            <Eyebrow accent={p.accent}>{scene.label}</Eyebrow>
            {scene.subtitle && <h2 className={`text-3xl md:text-4xl font-black ${tone(p.isDarkMode).text}`}>{scene.subtitle}</h2>}
          </section>
          <TryItYourself />
          <SubFlashCards isDarkMode={p.isDarkMode} accent={p.accent} cards={CONTENT.flashcards} />
        </SceneShell>
      );
    case 'quiz':
      return (p) => (
        <div>
          <TryItYourself />
          <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="DECODER" tag="Practice · Decoders" title={scene.label} intro={scene.subtitle ?? ''} />
        </div>
      );
    case 'recap':
      return (p) => <RecapScene {...p} scene={scene}><SourcesPanel isDarkMode={p.isDarkMode} accent={p.accent} /></RecapScene>;
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'decoder2' && (<><TryItYourself /><DecoderViz isDarkMode={p.isDarkMode} accent={p.accent} bits={2} /></>)}
          {which === 'rollcall' && (
            <div className="space-y-6">
              <TryItYourself />
              <RollCall isDarkMode={p.isDarkMode} accent={p.accent} />
              <DecoderViz isDarkMode={p.isDarkMode} accent={p.accent} bits={2} />
            </div>
          )}
          {which === 'gates' && (<><TryItYourself /><GateBuild isDarkMode={p.isDarkMode} accent={p.accent} /></>)}
          {which === 'decoder3' && (<><TryItYourself /><DecoderViz isDarkMode={p.isDarkMode} accent={p.accent} bits={3} /></>)}
          {which === 'demux' && (<><TryItYourself /><DecoderViz isDarkMode={p.isDarkMode} accent={p.accent} bits={2} /></>)}
          {which === 'polarity' && (<><TryItYourself /><PolarityTables isDarkMode={p.isDarkMode} accent={p.accent} /></>)}
          {which === 'function' && (<><TryItYourself /><FunctionBuilder isDarkMode={p.isDarkMode} accent={p.accent} /></>)}
          {which === 'proofs' && (<><TryItYourself label="Step through the proof" /><Derivations isDarkMode={p.isDarkMode} accent={p.accent} /></>)}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="decoder-2to4"
              titleEN="Build the 2-to-4 decoder for real"
              titleHI="असली में 2-to-4 decoder बनाइए"
              bodyEN="Open the live CircuitVerse workbench and wire two NOT gates and four AND gates into a 2-to-4 decoder, then prove every truth-table row yourself - exactly one output HIGH per code."
              bodyHI="live CircuitVerse workbench खोलिए और दो NOT gates तथा चार AND gates को एक 2-to-4 decoder में wire कीजिए, फिर हर truth-table row ख़ुद साबित कीजिए - हर code पर ठीक एक output HIGH।" />
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
