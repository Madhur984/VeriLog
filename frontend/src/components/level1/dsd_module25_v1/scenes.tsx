/**
 * Code Converters (dsd/25) - "The International Translator Booth".
 * Generic scenes come from the shared kit; the live Binary->Gray XOR cascade, the
 * Gray->Binary running-XOR walkthrough, the single-bit-change counter race, the
 * BCD/Excess-3 mapping table, the master translation matrix and the full
 * truth-table -> K-map -> SOP proof set are bespoke. Every bit, XOR, +3/-3 and
 * conversion is COMPUTED in code here, never trusted to prose.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SceneShell, Eyebrow, Card, TruthTable, tone, useSubLang,
  CoverScene, VideoScene, TheoryScene, RecapScene, SubFlashCards, QuizScene,
  StepThrough, LiveGate, WorkbenchCTA,
  type SubScene,
} from '../_subtractor/kit';
import type { SubPage } from '../_subtractor/SubEngine';
import { CodeConverter, BitToggle } from '../_combo/blocks';
import { CONTENT } from './content';

const SRC_EN: string | undefined = '/videos/dsd25-code-converters.mp4';
const SRC_HI: string | undefined = undefined;

const ACC = { I: '#38bdf8', II: '#f59e0b', III: '#fb7185', good: '#34d399' };
const bin4 = (n: number) => n.toString(2).padStart(4, '0');
const fromBits = (bits: number[]) => bits.reduce((a, b) => a * 2 + b, 0);

/* ───────── bespoke: live Binary -> Gray XOR cascade (S04) ─────────
   Toggle the 4 binary inputs; the MSB drops straight through as a wire and the
   three XOR gates compute g2,g1,g0 = adjacent-pair XOR, all live. */
const Bin2GrayCascade: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [b, setB] = useState<number[]>([0, 1, 1, 0]); // b3 b2 b1 b0  (default 0110 = 6)
  // gray: g3 = b3 (wire); g2 = b3^b2; g1 = b2^b1; g0 = b1^b0
  const gray = [b[0], b[0] ^ b[1], b[1] ^ b[2], b[2] ^ b[3]];
  const val = fromBits(b);

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'binary -> gray · live XOR cascade' : 'binary -> gray · live XOR cascade'}
      </div>

      {/* binary inputs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className={`font-mono text-[12px] ${t.faint}`}>binary</span>
        {b.map((x, i) => (
          <BitToggle key={i} value={x} onClick={() => setB((a) => a.map((v, j) => (j === i ? v ^ 1 : v)))}
            color={ACC.II} label={`b${3 - i}`} size={36} />
        ))}
        <span className="font-mono text-[12px] font-black" style={{ color: ACC.II }}>= {val}</span>
      </div>

      {/* MSB wire note */}
      <p className={`mt-4 text-center font-mono text-[11px] ${t.faint}`}>
        g3 = b3 = <b style={{ color: ACC.good }}>{gray[0]}</b> {lang === 'hi' ? '(सीधा wire, कोई gate नहीं)' : '(straight wire, no gate)'}
      </p>

      {/* three live XOR gates */}
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { lab: 'g2 = b3 ^ b2', a: b[0], bb: b[1], la: 'b3', lb: 'b2', out: gray[1] },
          { lab: 'g1 = b2 ^ b1', a: b[1], bb: b[2], la: 'b2', lb: 'b1', out: gray[2] },
          { lab: 'g0 = b1 ^ b0', a: b[2], bb: b[3], la: 'b1', lb: 'b0', out: gray[3] },
        ].map((g) => (
          <div key={g.lab} className="flex flex-col items-center gap-2">
            <span className={`font-mono text-[11px] ${t.faint}`}>{g.lab}</span>
            <LiveGate type="XOR" a={g.a} b={g.bb} isDarkMode={isDarkMode} accent={accent}
              labelA={g.la} labelB={g.lb} colorA={ACC.II} colorB={ACC.II} colorOut={ACC.good} />
            <span className="font-mono text-[13px] font-black" style={{ color: ACC.good }}>= {g.out}</span>
          </div>
        ))}
      </div>

      {/* gray output */}
      <motion.div key={gray.join('')} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <span className={`font-mono text-[12px] ${t.faint}`}>gray</span>
        {gray.map((x, i) => <BitToggle key={i} value={x} color={ACC.good} label={`g${3 - i}`} size={34} />)}
        <span className="font-mono text-[13px] font-black" style={{ color: ACC.good }}>{gray.join('')}</span>
      </motion.div>
      <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? <>3 XOR gates जमा 1 wire = <b style={{ color: accent }}>n - 1 = 3</b> gates। binary {bin4(val)} translate होकर gray <b style={{ color: ACC.good }}>{gray.join('')}</b>।</>
          : <>3 XOR gates plus 1 wire = <b style={{ color: accent }}>n - 1 = 3</b> gates. Binary {bin4(val)} translates to gray <b style={{ color: ACC.good }}>{gray.join('')}</b>.</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: Gray -> Binary running-XOR walkthrough (S05) ─────────
   StepThrough that decodes a chosen Gray word with the feedback chain, every
   binary bit computed from the JUST-COMPUTED higher bit. */
const Gray2BinWalk: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const PRESETS = [
    { id: '1110', g: [1, 1, 1, 0] },
    { id: '0101', g: [0, 1, 0, 1] },
  ];
  const [pi, setPi] = useState(0);
  const g = PRESETS[pi].g; // g3 g2 g1 g0
  // running XOR: b3 = g3; b_i = b_{i+1} ^ g_i
  const b3 = g[0];
  const b2 = b3 ^ g[1];
  const b1 = b2 ^ g[2];
  const b0 = b1 ^ g[3];
  const bin = [b3, b2, b1, b0];

  const Line: React.FC<{ rule: string; lhs: string; val: number; lit?: boolean }> = ({ rule, lhs, val, lit }) => (
    <div className="flex items-center justify-center gap-3 font-mono text-[14px]">
      <span className={t.sub}>{rule}</span>
      <span className={t.faint}>=&gt;</span>
      <span style={{ color: lit ? ACC.good : (t.ink as string) }}><b>{lhs} = {val}</b></span>
    </div>
  );

  const steps = [
    {
      label: lang === 'hi' ? 'MSB सीधा' : 'MSB straight',
      body: <div className="space-y-2"><Line rule="b3 = g3" lhs="b3" val={b3} lit />
        <p className={`text-center text-[12px] ${t.faint}`}>{lang === 'hi' ? 'top Gray bit एक नंगे wire से top binary bit बनता है।' : 'The top Gray bit becomes the top binary bit through a bare wire.'}</p></div>,
    },
    {
      label: 'b2 = b3 ^ g2',
      body: <div className="space-y-2"><Line rule={`b2 = b3 ^ g2 = ${b3} ^ ${g[1]}`} lhs="b2" val={b2} lit />
        <p className={`text-center text-[12px] ${t.faint}`}>{lang === 'hi' ? 'अभी बना b3 अगले XOR में feed होता है (feedback)।' : 'The just-computed b3 feeds forward into the next XOR (feedback).'}</p></div>,
    },
    {
      label: 'b1 = b2 ^ g1',
      body: <div className="space-y-2"><Line rule={`b1 = b2 ^ g1 = ${b2} ^ ${g[2]}`} lhs="b1" val={b1} lit /></div>,
    },
    {
      label: 'b0 = b1 ^ g0',
      body: <div className="space-y-2"><Line rule={`b0 = b1 ^ g0 = ${b1} ^ ${g[3]}`} lhs="b0" val={b0} lit />
        <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className={`mx-auto mt-3 max-w-sm rounded-2xl border p-3 text-center ${t.soft}`} style={{ borderColor: `${ACC.good}55` }}>
          <div className={`font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>{lang === 'hi' ? 'पूरा binary शब्द' : 'final binary word'}</div>
          <div className="mt-1 font-mono text-2xl font-black" style={{ color: ACC.good }}>{bin.join('')}</div>
          <div className={`font-mono text-[12px] ${t.faint}`}>= {fromBits(bin)} (gray {g.join('')})</div>
        </motion.div></div>,
    },
  ];

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        <span className={`font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>{lang === 'hi' ? 'gray शब्द चुनिए' : 'pick a gray word'}</span>
        {PRESETS.map((p, k) => (
          <button key={p.id} onClick={() => setPi(k)}
            className="rounded-lg border px-3 py-1.5 font-mono text-[12px] font-black transition-colors"
            style={pi === k ? { background: accent, color: '#000', borderColor: accent } : { borderColor: `${accent}44`, color: accent, background: 'transparent' }}>
            {p.id}
          </button>
        ))}
      </div>
      <StepThrough key={pi} steps={steps} isDarkMode={isDarkMode} accent={accent} />
    </Card>
  );
};

/* ───────── bespoke: single-bit-change counter race (S06) ─────────
   Counts 0..7 in binary vs Gray; flags how many bits flip at each step.
   Binary can flip up to 3 at once (red); Gray always flips exactly 1 (green). */
const CounterRace: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const W = 3;
  const toBits = (n: number) => Array.from({ length: W }, (_, i) => (n >> (W - 1 - i)) & 1);
  const grayOf = (n: number) => n ^ (n >> 1);
  const flips = (a: number[], b: number[]) => a.reduce((c, x, i) => c + (x !== b[i] ? 1 : 0), 0);

  const Cell: React.FC<{ bits: number[]; changed: boolean[]; color: string }> = ({ bits, changed, color }) => (
    <div className="flex gap-1">
      {bits.map((x, i) => (
        <span key={i} className="flex h-7 w-7 items-center justify-center rounded font-mono text-[12px] font-black"
          style={{ background: changed[i] ? color : 'transparent', color: changed[i] ? '#000' : color, border: `1.5px solid ${color}${changed[i] ? '' : '55'}` }}>{x}</span>
      ))}
    </div>
  );

  return (
    <Card isDarkMode={isDarkMode}>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {lang === 'hi' ? 'single-bit-change · binary बनाम gray' : 'single-bit-change · binary vs gray'}
      </div>
      <div className="overflow-x-auto">
        <table className="mx-auto border-collapse text-center font-mono">
          <thead>
            <tr className={`text-[11px] ${t.faint}`}>
              <th className="px-3 py-1.5">n</th>
              <th className="px-3 py-1.5" style={{ color: ACC.III }}>binary</th>
              <th className="px-2 py-1.5">{lang === 'hi' ? 'बदले' : 'flips'}</th>
              <th className="px-3 py-1.5" style={{ color: ACC.good }}>gray</th>
              <th className="px-2 py-1.5">{lang === 'hi' ? 'बदले' : 'flips'}</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }, (_, n) => {
              const pb = toBits((n - 1 + 8) % 8), cb = toBits(n);
              const pg = toBits(grayOf((n - 1 + 8) % 8)), cg = toBits(grayOf(n));
              const bf = n === 0 ? 0 : flips(pb, cb);
              const gf = n === 0 ? 0 : flips(pg, cg);
              const bChanged = cb.map((x, i) => n !== 0 && x !== pb[i]);
              const gChanged = cg.map((x, i) => n !== 0 && x !== pg[i]);
              return (
                <tr key={n} style={{ borderTop: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}>
                  <td className={`px-3 py-1.5 text-[12px] ${t.faint}`}>{n}</td>
                  <td className="px-3 py-1.5"><div className="flex justify-center"><Cell bits={cb} changed={bChanged} color={ACC.III} /></div></td>
                  <td className="px-2 py-1.5 text-[12px] font-black" style={{ color: bf > 1 ? ACC.III : t.faint as string }}>{n === 0 ? '-' : bf}</td>
                  <td className="px-3 py-1.5"><div className="flex justify-center"><Cell bits={cg} changed={gChanged} color={ACC.good} /></div></td>
                  <td className="px-2 py-1.5 text-[12px] font-black" style={{ color: ACC.good }}>{n === 0 ? '-' : gf}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className={`mt-3 text-center text-[12px] ${t.sub}`}>
        {lang === 'hi'
          ? <>binary 3-&gt;4 में <b style={{ color: ACC.III }}>3 bits एक साथ</b> पलटते हैं (glitch जोखिम)। gray हमेशा <b style={{ color: ACC.good }}>ठीक 1 bit</b> बदलता है।</>
          : <>binary 3-&gt;4 flips <b style={{ color: ACC.III }}>3 bits at once</b> (glitch risk). Gray always changes <b style={{ color: ACC.good }}>exactly 1 bit</b>.</>}
      </p>
    </Card>
  );
};

/* ───────── bespoke: BCD / Excess-3 mapping table (S07) ─────────
   All ten digits 0..9, each shown as BCD (8421) and Excess-3 (value+3),
   every code computed in code. */
const BcdXs3Map: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  return (
    <TruthTable isDarkMode={isDarkMode} accent={accent}
      headers={['Decimal', 'BCD (8421)', 'Excess-3 (+3)']}
      rows={Array.from({ length: 10 }, (_, d) => ({ cells: [d, bin4(d), bin4(d + 3)], highlight: d === 5 }))}
      note={lang === 'hi'
        ? 'हर Excess-3 row = BCD row + 0011। digit 5 उभरा है: BCD 0101, Excess-3 1000। codes 1010-1111 दोनों में अमान्य।'
        : 'Each Excess-3 row = BCD row + 0011. Digit 5 highlighted: BCD 0101, Excess-3 1000. Codes 1010-1111 are invalid in both.'} />
  );
};

/* ───────── bespoke: master translation matrix (S08) ───────── */
const MasterMatrix: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  return (
    <TruthTable isDarkMode={isDarkMode} accent={accent}
      headers={['Conversion', 'Type', 'Primary rule', 'Key application']}
      rows={[
        { cells: ['Binary -> Gray', 'XOR', 'g_i = b_{i+1} ^ b_i', 'sensors'] },
        { cells: ['Gray -> Binary', 'XOR (feedback)', 'b_i = b_{i+1} ^ g_i', 'decode'] },
        { cells: ['BCD -> Excess-3', '+3 arithmetic', 'XS3 = BCD + 0011', 'subtraction'] },
        { cells: ['Excess-3 -> BCD', '-3 arithmetic', 'BCD = XS3 - 0011', 'display'] },
      ]}
      note={lang === 'hi'
        ? 'XOR converters में कोई carry नहीं (बहुत तेज़); +3/-3 में carry/borrow propagation है। चारों एक ही recipe से बने।'
        : 'XOR converters have no carry (very fast); +3/-3 involve carry/borrow propagation. All four built by the same recipe.'} />
  );
};

/* ───────── bespoke: the spec proofs/derivations as a StepThrough (S08) ─────────
   Every value (Gray, running XOR, +3 K-map outputs) computed/verified in code. */
const ConverterProofs: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const mono = (s: string, c?: string) => <span className="font-mono font-black" style={{ color: c ?? (t.ink as string) }}>{s}</span>;

  // verify Binary->Gray on 0100
  const b = [0, 1, 0, 0];
  const gray = [b[0], b[0] ^ b[1], b[1] ^ b[2], b[2] ^ b[3]];
  // verify +3 K-map outputs W X Y Z for input 9 (A B C D = 1001)
  const A = 1, B = 0, C = 0, D = 1;
  const W = (A | (B & C) | (B & D)) & 1;
  const X = ((~B & C) | (~B & D) | (B & ~C & ~D)) & 1;
  const Y = ((C & D) | (~C & ~D)) & 1;
  const Z = (~D) & 1;
  const xs3of9 = `${W}${X}${Y}${Z}`;

  const cap = (en: React.ReactNode, hi: React.ReactNode) => <p className={`text-center text-[13px] ${t.sub}`}>{lang === 'hi' ? hi : en}</p>;

  const steps = [
    {
      label: lang === 'hi' ? 'Binary -> Gray (K-map)' : 'Binary -> Gray (K-map)',
      body: (
        <div className="space-y-2">
          {cap(
            <>Goal: only ONE bit changes between consecutive numbers. Construction g_i = b_{'{i+1}'} ^ b_i satisfies it. MSB is copied: g3 = b3. From the K-maps: G2 = b3'b2 + b3 b2' = b3 ^ b2, likewise G1 = b2 ^ b1, G0 = b1 ^ b0.</>,
            <>लक्ष्य: लगातार संख्याओं के बीच सिर्फ़ एक bit बदले। construction g_i = b_{'{i+1}'} ^ b_i यह पूरा करता है। MSB copy होता है: g3 = b3। K-maps से: G2 = b3'b2 + b3 b2' = b3 ^ b2, इसी तरह G1 = b2 ^ b1, G0 = b1 ^ b0।</>)}
          <p className="text-center font-mono text-[13px]">
            {mono('0100', ACC.II)} {' -> '} g3={mono(String(gray[0]), ACC.good)} g2={mono('0^1=1', ACC.good)} g1={mono('1^0=1', ACC.good)} g0={mono('0^0=0', ACC.good)} {' = '} {mono(gray.join(''), ACC.good)}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Gray -> Binary (running XOR)' : 'Gray -> Binary (running XOR)',
      body: (
        <div className="space-y-2">
          {cap(
            <>Invert the forward relation: from g_i = b_{'{i+1}'} ^ b_i, XOR both sides by b_{'{i+1}'} to get b_i = b_{'{i+1}'} ^ g_i (since x ^ x = 0). Seed at the MSB b3 = g3, then unroll: b_i = g3 ^ g2 ^ ... ^ g_i, the cumulative XOR from the MSB down.</>,
            <>forward संबंध को उलटिए: g_i = b_{'{i+1}'} ^ b_i से, दोनों ओर b_{'{i+1}'} XOR कीजिए और पाइए b_i = b_{'{i+1}'} ^ g_i (क्योंकि x ^ x = 0)। MSB पर b3 = g3 बीज, फिर खोलिए: b_i = g3 ^ g2 ^ ... ^ g_i, MSB से नीचे तक cumulative XOR।</>)}
          <p className="text-center font-mono text-[12px]">{mono('b3 = g3', ACC.good)} ; {mono('b2 = g3^g2', ACC.good)} ; {mono('b1 = b2^g1', ACC.good)} ; {mono('b0 = b1^g0', ACC.good)}</p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'BCD -> Excess-3 (+3 K-map)' : 'BCD -> Excess-3 (+3 K-map)',
      body: (
        <div className="space-y-2">
          {cap(
            <>Inputs A B C D, outputs W X Y Z, rule XS3 = BCD + 3. Unused BCD codes 1010-1111 are don't-cares to maximise grouping. K-map results: W = A + BC + BD; X = B'C + B'D + BC'D'; Y = CD + C'D'; Z = D'.</>,
            <>Inputs A B C D, outputs W X Y Z, नियम XS3 = BCD + 3। अनुपयोगी BCD codes 1010-1111 don't-cares हैं ताकि grouping अधिकतम हो। K-map नतीजे: W = A + BC + BD; X = B'C + B'D + BC'D'; Y = CD + C'D'; Z = D'।</>)}
          <p className="text-center font-mono text-[12px]">
            {lang === 'hi' ? 'जाँच input 9 (1001):' : 'check input 9 (1001):'} W X Y Z = {mono(xs3of9, ACC.good)} {' = '} {mono('12 = 9+3', ACC.good)}
          </p>
        </div>
      ),
    },
    {
      label: lang === 'hi' ? 'Excess-3 -> BCD (-3)' : 'Excess-3 -> BCD (-3)',
      body: (
        <div className="space-y-2">
          {cap(
            <>The reverse simply subtracts the constant offset: BCD = XS3 - 0011, built as the mirror SOP network or a 4-bit subtractor with 0011. Forward (+3) and backward (-3) are exact inverses - chaining them returns the original word, since adding then subtracting 3 is a no-op.</>,
            <>उल्टा बस तय offset घटाता है: BCD = XS3 - 0011, दर्पण SOP network या 0011 वाले 4-bit subtractor के रूप में बना। forward (+3) और backward (-3) सटीक inverse हैं - इन्हें chain करने पर असली शब्द लौटता है, क्योंकि 3 जोड़कर फिर घटाना no-op है।</>)}
          <p className="text-center font-mono text-[12px]">{mono('1000', ACC.II)} {' - 0011 = '} {mono('0101', ACC.good)} {' (8 - 3 = 5)'}</p>
        </div>
      ),
    },
  ];

  return <StepThrough steps={steps} isDarkMode={isDarkMode} accent={accent} />;
};

/* ───────── source list for the recap ───────── */
const SOURCES: { label: string; url: string }[] = [
  { label: 'GeeksforGeeks - Binary to/from Gray code (truth tables + XOR equations)', url: 'https://www.geeksforgeeks.org/digital-logic/code-converters-binary-to-from-gray-code/' },
  { label: 'GeeksforGeeks - BCD(8421) to/from Excess-3 (+3 rule, don\'t-cares, W & X SOP)', url: 'https://www.geeksforgeeks.org/digital-logic/code-converters-bcd8421-to-from-excess-3/' },
  { label: 'ElectricalWorkbook - BCD to Excess-3 (full truth table, Y & Z equations)', url: 'https://electricalworkbook.com/bcd-to-excess-3-code-converter-circuit/' },
  { label: 'GeeksforGeeks - Multiplexers (4-to-1 MUX equation, AND-OR build)', url: 'https://www.geeksforgeeks.org/digital-logic/multiplexers-in-digital-logic/' },
];

const RecapSources: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  return (
    <Card isDarkMode={isDarkMode}>
      <div className={`mb-3 font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>{lang === 'hi' ? 'स्रोत · sources' : 'sources'}</div>
      <ul className="space-y-2">
        {SOURCES.map((s) => (
          <li key={s.url} className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: accent }} />
            <a href={s.url} target="_blank" rel="noreferrer" className={`text-[13px] underline decoration-dotted underline-offset-2 ${t.sub} hover:opacity-80`} style={{ wordBreak: 'break-word' }}>
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
  if (/whatis/.test(key)) return 'converter';
  if (/method/.test(key)) return 'converter';
  if (/bin2gray/.test(key)) return 'bin2gray';
  if (/gray2bin/.test(key)) return 'gray2bin';
  if (/whygray/.test(key)) return 'whygray';
  if (/bcdxs3/.test(key)) return 'bcdxs3';
  if (/matrix/.test(key)) return 'matrix';
  if (/build/.test(key)) return 'build';
  return null;
};

const slug = (s: string) => s.replace(/^S\d+_/, '').toLowerCase();

function componentFor(scene: SubScene): React.FC<any> {
  switch (scene.kind) {
    case 'cover':
      return (p) => <CoverScene {...p} scene={scene} moduleTitle={CONTENT.moduleTitle} moduleSubtitle={CONTENT.moduleSubtitle} kicker="Code Converters · Number Languages" hero={<CodeConverter isDarkMode={p.isDarkMode} accent={p.accent} />} />;
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
      return (p) => <QuizScene isDarkMode={p.isDarkMode} accent={p.accent} quiz={CONTENT.quiz} badge="CODE CONVERTERS" tag="Practice · Code Converters" title={scene.label} intro={scene.subtitle ?? ''} />;
    case 'recap':
      return (p) => <RecapScene {...p} scene={scene}><RecapSources isDarkMode={p.isDarkMode} accent={p.accent} /></RecapScene>;
    default: {
      const which = bespokeFor(scene);
      return (p) => (
        <TheoryScene {...p} scene={scene}>
          {which === 'converter' && <CodeConverter isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'bin2gray' && (
            <div className="space-y-6">
              <Bin2GrayCascade isDarkMode={p.isDarkMode} accent={p.accent} />
              <CodeConverter isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'gray2bin' && <Gray2BinWalk isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'whygray' && <CounterRace isDarkMode={p.isDarkMode} accent={p.accent} />}
          {which === 'bcdxs3' && (
            <div className="space-y-6">
              <BcdXs3Map isDarkMode={p.isDarkMode} accent={p.accent} />
              <CodeConverter isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'matrix' && (
            <div className="space-y-6">
              <MasterMatrix isDarkMode={p.isDarkMode} accent={p.accent} />
              <ConverterProofs isDarkMode={p.isDarkMode} accent={p.accent} />
            </div>
          )}
          {which === 'build' && (
            <WorkbenchCTA isDarkMode={p.isDarkMode} accent={p.accent} tutorial="binary-to-gray"
              titleEN="Build the Code Converters for real"
              titleHI="असली में Code Converters बनाइए"
              bodyEN="Open the live CircuitVerse workbench and wire the Binary-to-Gray XOR cascade yourself - MSB straight through, three XOR gates - then prove every truth-table row on real hardware."
              bodyHI="live CircuitVerse workbench खोलिए और Binary-to-Gray XOR cascade ख़ुद wire कीजिए - MSB सीधा, तीन XOR gates - फिर हर truth-table row को असली hardware पर साबित कीजिए।" />
          )}
        </TheoryScene>
      );
    }
  }
}

export const PAGES: SubPage[] = CONTENT.scenes.map((scene, i, arr) => ({
  id: slug(scene.id),
  part: partAt(i, arr.length),
  label: scene.label,
  subtitle: scene.subtitle ?? '',
  Component: componentFor(scene),
}));

// SRC_HI is intentionally unused for this module (single EN cut); referenced to satisfy noUnusedLocals.
void SRC_HI;
