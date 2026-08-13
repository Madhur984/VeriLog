/**
 * Clean, INTERACTIVE logic-circuit schematics for the subtractor track.
 *
 * Every wire is fully connected (no dangling pins), carries a live 0/1 value,
 * and lights up when high. Toggle the inputs and watch the signals propagate.
 * Used by dsd/16 (half subtractor), dsd/17 (full subtractor) and dsd/20 (BCD
 * adder). All logic is computed in code.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, tone, useSubLang } from './kit';
import { TryItYourself } from '../../ui/TryItYourself';

const ON = '#34d399';                                   // a wire carrying 1
const off = (dark: boolean) => (dark ? '#3f4a5e' : '#cbd5e1'); // a wire carrying 0
const faintTxt = (dark: boolean) => (dark ? '#94a3b8' : '#64748b');

/* a poly-line wire whose colour + glow follow its bit value */
const Wire: React.FC<{ pts: [number, number][]; v: number; dark: boolean; w?: number }> = ({ pts, v, dark, w = 3 }) => (
  <motion.polyline
    points={pts.map((p) => p.join(',')).join(' ')}
    fill="none" stroke={v ? ON : off(dark)} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round"
    animate={{ opacity: v ? [0.55, 1, 0.55] : 1 }} transition={{ repeat: v ? Infinity : 0, duration: 1.5 }}
  />
);
const Dot: React.FC<{ x: number; y: number; v: number; dark: boolean }> = ({ x, y, v, dark }) => (
  <circle cx={x} cy={y} r="4.5" fill={v ? ON : off(dark)} />
);
/* a 0/1 chip floating beside a wire, with an optional label above it */
const Chip: React.FC<{ x: number; y: number; v: number; dark: boolean; label?: string }> = ({ x, y, v, dark, label }) => (
  <g>
    {label && <text x={x} y={y - 13} fontFamily="monospace" fontSize="10.5" fill={faintTxt(dark)} textAnchor="middle">{label}</text>}
    <circle cx={x} cy={y - 4} r="9" fill={dark ? '#0a0e1a' : '#ffffff'} stroke={v ? ON : off(dark)} strokeWidth="2" />
    <text x={x} y={y} fontFamily="monospace" fontSize="12" fontWeight="800" fill={v ? ON : off(dark)} textAnchor="middle">{v}</text>
  </g>
);
const GateBox: React.FC<{ x: number; y: number; w: number; h: number; title: string; sub?: string; accent: string; dark: boolean }>
  = ({ x, y, w, h, title, sub, accent, dark }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="12" fill={dark ? '#0a0e1a' : '#ffffff'} stroke={accent} strokeWidth="2.5" />
    <text x={x + w / 2} y={y + h / 2 + (sub ? -3 : 5)} fontFamily="monospace" fontSize="12.5" fontWeight="800" fill={accent} textAnchor="middle">{title}</text>
    {sub && <text x={x + w / 2} y={y + h / 2 + 13} fontFamily="monospace" fontSize="9.5" fill={faintTxt(dark)} textAnchor="middle">{sub}</text>}
  </g>
);

const InToggle: React.FC<{ label: string; v: number; on: () => void; color: string; dark: boolean }> = ({ label, v, on, color, dark }) => {
  const t = tone(dark);
  return (
    <button onClick={on} className={`flex flex-col items-center gap-1 rounded-2xl border px-5 py-3 active:scale-95 ${t.card}`}>
      <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color }}>{label}</span>
      <span className="text-3xl font-black tabular-nums" style={{ color: v ? color : t.faint }}>{v}</span>
    </button>
  );
};

/* ════════════════════ HALF SUBTRACTOR (dsd/16) ════════════════════ */
export const HalfSubtractorCircuit: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [x, setX] = useState(0);
  const [y, setY] = useState(1);
  const nx = x ^ 1;
  const D = x ^ y;
  const B = nx & y;
  const XOR = '#f59e0b', NOTC = '#38bdf8', ANDC = '#fb7185';

  return (
    <Card isDarkMode={isDarkMode}>
      <TryItYourself />
      <div className="mb-4 flex flex-wrap justify-center gap-3">
        <InToggle label={lang === 'hi' ? 'x · जगह' : 'x · spaces'} v={x} on={() => setX((v) => v ^ 1)} color={NOTC} dark={isDarkMode} />
        <InToggle label={lang === 'hi' ? 'y · गाड़ी' : 'y · cars'} v={y} on={() => setY((v) => v ^ 1)} color={ANDC} dark={isDarkMode} />
      </div>
      {/* on a phone the schematic scrolls sideways in its own lane rather than
          shrinking the pin labels into illegibility */}
      <div className="-mx-2 overflow-x-auto px-2 sm:mx-0 sm:px-0">
      <svg viewBox="0 0 520 250" className="mx-auto h-auto w-full min-w-[420px] max-w-2xl lg:min-w-0">
        {/* x: to XOR top, branch down to NOT */}
        <Wire pts={[[40, 60], [230, 60]]} v={x} dark={isDarkMode} />
        <Wire pts={[[95, 60], [95, 165], [155, 165]]} v={x} dark={isDarkMode} />
        <Dot x={95} y={60} v={x} dark={isDarkMode} />
        {/* y: to XOR bottom, branch down to AND bottom */}
        <Wire pts={[[40, 100], [230, 100]]} v={y} dark={isDarkMode} />
        <Wire pts={[[125, 100], [125, 205], [250, 205]]} v={y} dark={isDarkMode} />
        <Dot x={125} y={100} v={y} dark={isDarkMode} />
        {/* NOT -> x' -> AND top */}
        <Wire pts={[[200, 165], [250, 165]]} v={nx} dark={isDarkMode} />
        {/* gates */}
        <GateBox x={230} y={40} w={95} h={80} title="XOR" accent={XOR} dark={isDarkMode} />
        {/* NOT as triangle + bubble */}
        <path d="M155,148 L155,182 L188,165 Z" fill={isDarkMode ? '#0a0e1a' : '#ffffff'} stroke={NOTC} strokeWidth="2.5" />
        <circle cx={193} cy={165} r="5" fill={isDarkMode ? '#0a0e1a' : '#ffffff'} stroke={NOTC} strokeWidth="2.5" />
        <text x={171} y={140} fontFamily="monospace" fontSize="10" fill={NOTC} textAnchor="middle">NOT</text>
        <GateBox x={250} y={150} w={95} h={70} title="AND" accent={ANDC} dark={isDarkMode} />
        {/* outputs */}
        <Wire pts={[[325, 80], [470, 80]]} v={D} dark={isDarkMode} />
        <Wire pts={[[345, 185], [470, 185]]} v={B} dark={isDarkMode} />
        {/* labels + chips */}
        <text x={24} y={64} fontFamily="monospace" fontSize="14" fontWeight="700" fill={NOTC}>x</text>
        <text x={24} y={104} fontFamily="monospace" fontSize="14" fontWeight="700" fill={ANDC}>y</text>
        <Chip x={70} y={64} v={x} dark={isDarkMode} />
        <Chip x={70} y={104} v={y} dark={isDarkMode} />
        <Chip x={224} y={160} v={nx} dark={isDarkMode} label="x'" />
        <Chip x={420} y={76} v={D} dark={isDarkMode} label="D = x XOR y" />
        <Chip x={420} y={181} v={B} dark={isDarkMode} label="B = x'y" />
        <text x={484} y={84} fontFamily="monospace" fontSize="14" fontWeight="700" fill={XOR}>D</text>
        <text x={484} y={189} fontFamily="monospace" fontSize="14" fontWeight="700" fill={ANDC}>B</text>
      </svg>
      </div>
      <p className={`mt-3 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>Difference एक <b style={{ color: XOR }}>XOR</b> है; Borrow के लिए x को <b style={{ color: NOTC }}>NOT</b> करके y से <b style={{ color: ANDC }}>AND</b> करते हैं। तीन gates।</>
          : <>Difference is one <b style={{ color: XOR }}>XOR</b>; Borrow inverts x with a <b style={{ color: NOTC }}>NOT</b> then <b style={{ color: ANDC }}>AND</b>s it with y. Three gates.</>}
      </p>
    </Card>
  );
};

/* ════════════════════ FULL SUBTRACTOR (dsd/17) ════════════════════ */
export const FullSubtractorCircuit: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [x, setX] = useState(0);
  const [y, setY] = useState(1);
  const [z, setZ] = useState(1);
  const d1 = x ^ y;          // half-sub 1 difference
  const b1 = (x ^ 1) & y;    // half-sub 1 borrow
  const D = d1 ^ z;          // half-sub 2 difference = x^y^z
  const b2 = (d1 ^ 1) & z;   // half-sub 2 borrow
  const Bout = b1 | b2;      // OR
  const HS = '#f59e0b', HS2 = '#38bdf8', ORC = '#fb7185', coins = '#34d399';

  return (
    <Card isDarkMode={isDarkMode}>
      <TryItYourself />
      <div className="mb-4 flex flex-wrap justify-center gap-3">
        <InToggle label="x · wallet" v={x} on={() => setX((v) => v ^ 1)} color={coins} dark={isDarkMode} />
        <InToggle label="y · bill" v={y} on={() => setY((v) => v ^ 1)} color={HS} dark={isDarkMode} />
        <InToggle label="z · debt (Bin)" v={z} on={() => setZ((v) => v ^ 1)} color={HS2} dark={isDarkMode} />
      </div>
      <div className="-mx-2 overflow-x-auto px-2 sm:mx-0 sm:px-0">
      <svg viewBox="0 0 700 320" className="mx-auto h-auto w-full min-w-[560px] max-w-3xl lg:min-w-0">
        {/* inputs into HS1 */}
        <Wire pts={[[44, 70], [150, 70]]} v={x} dark={isDarkMode} />
        <Wire pts={[[44, 110], [150, 110]]} v={y} dark={isDarkMode} />
        {/* z routed up into HS2 second input */}
        <Wire pts={[[44, 262], [370, 262], [370, 110], [420, 110]]} v={z} dark={isDarkMode} />
        {/* HS1 diff -> HS2 first input */}
        <Wire pts={[[280, 70], [420, 70]]} v={d1} dark={isDarkMode} />
        {/* HS1 borrow -> OR input 1 (routed low) */}
        <Wire pts={[[280, 110], [280, 300], [565, 300], [565, 222], [585, 222]]} v={b1} dark={isDarkMode} />
        {/* HS2 borrow -> OR input 2 */}
        <Wire pts={[[550, 110], [555, 110], [555, 258], [585, 258]]} v={b2} dark={isDarkMode} />
        {/* HS2 diff -> D */}
        <Wire pts={[[550, 70], [665, 70]]} v={D} dark={isDarkMode} />
        {/* OR -> Bout */}
        <Wire pts={[[665, 240], [690, 240]]} v={Bout} dark={isDarkMode} />
        {/* boxes */}
        <GateBox x={150} y={45} w={130} h={90} title="HALF SUB 1" sub="x - y" accent={HS} dark={isDarkMode} />
        <GateBox x={420} y={45} w={130} h={90} title="HALF SUB 2" sub="(x XOR y) - z" accent={HS2} dark={isDarkMode} />
        <GateBox x={585} y={200} w={80} h={80} title="OR" accent={ORC} dark={isDarkMode} />
        {/* input labels + chips */}
        <text x={26} y={74} fontFamily="monospace" fontSize="14" fontWeight="700" fill={coins}>x</text>
        <text x={26} y={114} fontFamily="monospace" fontSize="14" fontWeight="700" fill={HS}>y</text>
        <text x={26} y={266} fontFamily="monospace" fontSize="14" fontWeight="700" fill={HS2}>z</text>
        <Chip x={100} y={74} v={x} dark={isDarkMode} />
        <Chip x={100} y={114} v={y} dark={isDarkMode} />
        <Chip x={120} y={266} v={z} dark={isDarkMode} />
        <Chip x={350} y={70} v={d1} dark={isDarkMode} label="x XOR y" />
        <Chip x={430} y={300} v={b1} dark={isDarkMode} label="borrow 1" />
        <Chip x={520} y={175} v={b2} dark={isDarkMode} label="borrow 2" />
        <Chip x={625} y={66} v={D} dark={isDarkMode} label="D" />
        <Chip x={682} y={236} v={Bout} dark={isDarkMode} label="Bout" />
        <text x={672} y={74} fontFamily="monospace" fontSize="14" fontWeight="700" fill={coins}>D</text>
        <text x={672} y={244} fontFamily="monospace" fontSize="13" fontWeight="700" fill={ORC}>Bout</text>
      </svg>
      </div>
      <p className={`mt-3 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>दो half subtractors जुड़े हैं: पहला x - y करता है, दूसरा उसमें से debt z घटाता है; दोनों borrows को एक <b style={{ color: ORC }}>OR</b> मिलाकर Bout देता है। D = x XOR y XOR z = <b style={{ color: coins }}>{D}</b>, Bout = <b style={{ color: ORC }}>{Bout}</b>।</>
          : <>Two half subtractors in series: the first does x - y, the second subtracts the debt z; an <b style={{ color: ORC }}>OR</b> merges both borrows into Bout. D = x XOR y XOR z = <b style={{ color: coins }}>{D}</b>, Bout = <b style={{ color: ORC }}>{Bout}</b>.</>}
      </p>
    </Card>
  );
};

/* ════════════════════ BCD ADDER (dsd/20) ════════════════════ */
export const BcdAdderCircuit: React.FC<{ isDarkMode: boolean; accent: string }> = ({ isDarkMode, accent }) => {
  const { lang } = useSubLang();
  const t = tone(isDarkMode);
  const [sum, setSum] = useState(12);                 // raw binary sum 0..19
  const K = sum >= 16 ? 1 : 0;
  const Z = sum - 16 * K;                              // 4-bit preliminary sum
  const Z8 = (Z >> 3) & 1, Z4 = (Z >> 2) & 1, Z2 = (Z >> 1) & 1, Z1 = Z & 1;
  const a1 = Z8 & Z4, a2 = Z8 & Z2;
  const C = K | a1 | a2;
  const S = (Z + (C ? 6 : 0)) & 15;
  const bits = (n: number) => n.toString(2).padStart(4, '0');
  const A1 = '#f59e0b', A2 = '#38bdf8', ORC = '#a78bfa', good = '#34d399';

  return (
    <Card isDarkMode={isDarkMode}>
      <TryItYourself />
      <div className="mb-4 flex items-center gap-3">
        <span className={`font-mono text-[12px] ${t.faint}`}>{lang === 'hi' ? 'कच्चा sum' : 'raw sum A+B+Cin'}</span>
        <input type="range" min={0} max={19} value={sum} onChange={(e) => setSum(parseInt(e.target.value, 10))} className="min-w-0 flex-1" style={{ accentColor: accent }} />
        <span className="w-9 text-right font-mono text-xl font-black" style={{ color: accent }}>{sum}</span>
      </div>
      <div className="-mx-2 overflow-x-auto px-2 sm:mx-0 sm:px-0">
      <svg viewBox="0 0 700 300" className="mx-auto h-auto w-full min-w-[560px] max-w-3xl lg:min-w-0">
        {/* ADDER 1 -> K and Z bus */}
        <GateBox x={40} y={40} w={150} h={80} title="4-BIT ADDER 1" sub="A + B + Cin" accent={A1} dark={isDarkMode} />
        {/* K up to OR */}
        <Wire pts={[[190, 60], [430, 60], [430, 95], [470, 95]]} v={K} dark={isDarkMode} />
        {/* Z bus down then to AND gates and ADDER 2 */}
        <Wire pts={[[115, 120], [115, 175], [300, 175]]} v={Z ? 1 : 0} dark={isDarkMode} />
        {/* taps to AND1 (Z8.Z4) and AND2 (Z8.Z2) */}
        <Wire pts={[[250, 175], [250, 120], [300, 120]]} v={Z8} dark={isDarkMode} />
        <Dot x={250} y={175} v={Z ? 1 : 0} dark={isDarkMode} />
        <Wire pts={[[300, 130], [430, 130], [430, 110], [470, 110]]} v={a1} dark={isDarkMode} />
        <Wire pts={[[300, 165], [415, 165], [415, 125], [470, 125]]} v={a2} dark={isDarkMode} />
        {/* AND boxes */}
        <GateBox x={300} y={108} w={70} h={40} title="AND" sub="Z8.Z4" accent={A2} dark={isDarkMode} />
        <GateBox x={300} y={150} w={70} h={40} title="AND" sub="Z8.Z2" accent={A2} dark={isDarkMode} />
        {/* OR -> C */}
        <GateBox x={470} y={80} w={80} h={60} title="OR" accent={ORC} dark={isDarkMode} />
        <Wire pts={[[550, 110], [600, 110], [600, 200], [360, 200], [360, 222]]} v={C} dark={isDarkMode} />
        {/* Z into ADDER 2 */}
        <Wire pts={[[300, 175], [300, 235], [200, 235]]} v={Z ? 1 : 0} dark={isDarkMode} />
        <GateBox x={200} y={222} w={230} h={56} title="4-BIT ADDER 2" sub="+ 0110 if C, else + 0000" accent={A1} dark={isDarkMode} />
        {/* outputs */}
        <Wire pts={[[430, 250], [560, 250]]} v={S ? 1 : 0} dark={isDarkMode} />
        {/* labels / live chips */}
        <Chip x={250} y={56} v={K} dark={isDarkMode} label="K (carry)" />
        <text x={150} y={150} fontFamily="monospace" fontSize="12" fontWeight="800" fill={Z ? good : off(isDarkMode)} textAnchor="middle">Z = {bits(Z)}</text>
        <Chip x={388} y={124} v={a1} dark={isDarkMode} />
        <Chip x={388} y={159} v={a2} dark={isDarkMode} />
        <Chip x={576} y={114} v={C} dark={isDarkMode} label="C" />
        <text x={300} y={210} fontFamily="monospace" fontSize="11" fill={faintTxt(isDarkMode)} textAnchor="middle">{C ? '+ 0110' : '+ 0000'}</text>
        <text x={585} y={255} fontFamily="monospace" fontSize="13" fontWeight="800" fill={good}>{C}{' '}{bits(S)}</text>
        <text x={585} y={272} fontFamily="monospace" fontSize="10" fill={faintTxt(isDarkMode)}>carry S8 S4 S2 S1</text>
      </svg>
      </div>
      <p className={`mt-3 text-center text-[13px] ${t.sub}`}>
        {lang === 'hi'
          ? <>ADDER 1 कच्चा sum बनाता है; तीन gates <b style={{ color: ORC }}>C = K + Z8.Z4 + Z8.Z2</b> निकालते हैं; C = {C} होने पर ADDER 2, 6 (0110) जोड़ देता है। नतीजा BCD = <b style={{ color: good }}>{C} {bits(S)}</b> = {C * 10 + S}।</>
          : <>ADDER 1 forms the raw sum; three gates compute <b style={{ color: ORC }}>C = K + Z8.Z4 + Z8.Z2</b>; when C = {C}, ADDER 2 adds 6 (0110). Result BCD = <b style={{ color: good }}>{C} {bits(S)}</b> = {C * 10 + S}.</>}
      </p>
    </Card>
  );
};
