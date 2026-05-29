/**
 * S00_F_UniversalConverter.tsx
 * All-in-one number base converter:
 *   - Live Dec ↔ Bin ↔ Oct ↔ Hex (type in any box, all update)
 *   - Step-by-step working for whichever input changed
 *   - Visual bit groups (nibble view for Hex, triplet view for Oct)
 *   - Master reference table 0-255
 */
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { isActive: boolean; isDarkMode: boolean; }

// ── helpers ──────────────────────────────────────────────────────
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

// Decimal → binary string (padded to 8 bits minimum, or more)
const decToBin = (n: number): string => {
  if (n === 0) return '00000000';
  return n.toString(2).padStart(Math.ceil(n.toString(2).length / 8) * 8, '0');
};
const decToOct = (n: number): string => n.toString(8).toUpperCase();
const decToHex = (n: number): string => n.toString(16).toUpperCase();

// Safe parsers
const parseBin = (s: string): number | null => {
  const clean = s.replace(/\s/g, '');
  if (!/^[01]+$/.test(clean)) return null;
  return parseInt(clean, 2);
};
const parseOct = (s: string): number | null => {
  const clean = s.replace(/\s/g, '');
  if (!/^[0-7]+$/.test(clean)) return null;
  return parseInt(clean, 8);
};
const parseHex = (s: string): number | null => {
  const clean = s.replace(/\s/g, '').toUpperCase();
  if (!/^[0-9A-F]+$/.test(clean)) return null;
  return parseInt(clean, 16);
};

// Remainder division steps for any base
interface DivStep { dividend: number; quotient: number; remainder: number; }
const remainderSteps = (n: number, base: number): DivStep[] => {
  const steps: DivStep[] = [];
  let cur = n;
  while (cur > 0) {
    steps.push({ dividend: cur, quotient: Math.floor(cur / base), remainder: cur % base });
    cur = Math.floor(cur / base);
  }
  return steps;
};

// Format remainder digit for hex
const rmDigit = (r: number, base: number) =>
  base === 16 ? r.toString(16).toUpperCase() : String(r);

// ── colours ──────────────────────────────────────────────────────
const ACCENT = {
  dec: { hex: '#F59E0B', tw: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  bin: { hex: '#0EA5E9', tw: 'text-sky-400',   bg: 'bg-sky-500/10',   border: 'border-sky-500/30'  },
  oct: { hex: '#10B981', tw: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  hex0: { hex: '#A855F7', tw: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
};

type Base = 'dec' | 'bin' | 'oct' | 'hex';

// ── InputBox ─────────────────────────────────────────────────────
interface BoxProps {
  label: string; sub: string;
  value: string; onChange: (v: string) => void;
  color: string; bg: string; border: string;
  valid: boolean; isDarkMode: boolean;
  readOnly?: boolean;
}
const InputBox: React.FC<BoxProps> = ({ label, sub, value, onChange, color, bg, border, valid, isDarkMode, readOnly }) => {
  return (
    <div className={`p-6 rounded-3xl border ${isDarkMode ? 'border-white/10 bg-white/5' : 'bg-white border-gray-200 shadow-xl'} flex flex-col gap-3`}>
      <div className="flex items-baseline gap-3">
        <span className={`font-mono text-[10px] tracking-[0.25em] uppercase ${color}`}>{label}</span>
        <span className={`font-mono text-[9px] opacity-40 ${isDarkMode ? 'text-white' : 'text-gray-500'}`}>{sub}</span>
      </div>
      <input
        readOnly={readOnly}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full font-mono text-2xl font-black rounded-2xl border-2 px-4 py-3 outline-none transition-all
          ${valid
            ? `${border} ${color} ${bg}`
            : 'border-rose-500/40 text-rose-400 bg-rose-500/10'
          }
          ${readOnly ? 'cursor-default' : 'cursor-text'}
          ${isDarkMode ? 'bg-opacity-100' : 'bg-white'}
        `}
        style={{ letterSpacing: '0.1em' }}
        spellCheck={false}
        autoComplete="off"
      />
      {!valid && (
        <div className="text-rose-400 text-[10px] font-mono">⚠ Invalid character for this base</div>
      )}
    </div>
  );
};

// ── Step-by-step working for remainder method ─────────────────────
const RemainderWorking: React.FC<{
  n: number; base: number; baseLabel: string; accentHex: string; isDarkMode: boolean;
}> = ({ n, base, baseLabel, accentHex, isDarkMode }) => {
  if (n === 0) return null;
  const steps = remainderSteps(n, base);
  const result = steps.map(s => rmDigit(s.remainder, base)).reverse().join('');
  return (
    <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-md'}`}>
      <div
        className="font-mono text-[10px] uppercase tracking-widest mb-4"
        style={{ color: accentHex }}
      >
        Step-by-step: {n}₁₀ → {baseLabel} (Remainder / Successive Division)
      </div>
      <div className="space-y-1.5 mb-4">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`flex items-center justify-between px-4 py-2 rounded-xl font-mono text-xs
              ${isDarkMode ? 'bg-black/30' : 'bg-gray-50 border border-gray-100'}`}
          >
            <span className={isDarkMode ? 'text-white/60' : 'text-gray-600'}>
              {s.dividend} ÷ {base} = <span className={isDarkMode ? 'text-white/90' : 'text-gray-900'} style={{ fontWeight: 700 }}>{s.quotient}</span>
            </span>
            <span
              className="font-black text-sm px-3 py-0.5 rounded-lg"
              style={{
                color: accentHex,
                background: `${accentHex}18`,
                border: `1px solid ${accentHex}44`,
              }}
            >
              rem {rmDigit(s.remainder, base)}
              <span className="ml-2 opacity-40 font-normal text-[9px]">
                {i === 0 ? '← LSB' : i === steps.length - 1 ? '← MSB' : ''}
              </span>
            </span>
          </motion.div>
        ))}
      </div>
      <div className={`p-4 rounded-2xl text-center ${isDarkMode ? 'bg-black/40' : 'bg-gray-50 border border-gray-100'}`}>
        <div className="font-mono text-[10px] opacity-40 mb-1 uppercase tracking-widest">
          Read remainders bottom → top (MSB first)
        </div>
        <div className="font-mono text-2xl font-black" style={{ color: accentHex }}>
          ({result}){base === 2 ? '₂' : base === 8 ? '₈' : '₁₆'}
        </div>
      </div>
    </div>
  );
};

// ── Weight (expansion) working for any → decimal ─────────────────
const WeightWorking: React.FC<{
  digits: string; base: number; baseLabel: string; n: number; accentHex: string; isDarkMode: boolean;
}> = ({ digits, base, baseLabel, n, accentHex, isDarkMode }) => {
  const chars = digits.replace(/\s/g, '').split('');
  const len = chars.length;
  const products = chars.map((c, i) => ({
    char: c,
    pow: len - 1 - i,
    decDigit: parseInt(c, base),
    product: parseInt(c, base) * Math.pow(base, len - 1 - i),
  }));
  return (
    <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-md'}`}>
      <div
        className="font-mono text-[10px] uppercase tracking-widest mb-4"
        style={{ color: accentHex }}
      >
        Step-by-step: ({digits}){baseLabel} → Decimal (Weight / Positional Method)
      </div>
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-xs mb-4">
          <thead>
            <tr className={isDarkMode ? 'text-white/30' : 'text-gray-400'}>
              <th className="px-3 py-2 text-left">Digit</th>
              <th className="px-3 py-2">Position</th>
              <th className="px-3 py-2">Weight ({base}^n)</th>
              <th className="px-3 py-2">Digit × Weight</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i} className={`border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                <td className="px-3 py-2 font-black text-lg" style={{ color: accentHex }}>{p.char}</td>
                <td className="px-3 py-2 text-center opacity-60">{p.pow}</td>
                <td className="px-3 py-2 text-center opacity-60">{Math.pow(base, p.pow)}</td>
                <td className="px-3 py-2 text-center font-black">
                  <span style={{ color: p.product > 0 ? accentHex : undefined, opacity: p.product === 0 ? 0.3 : 1 }}>
                    {p.decDigit} × {Math.pow(base, p.pow)} = {p.product}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`p-4 rounded-2xl text-center ${isDarkMode ? 'bg-black/40' : 'bg-gray-50 border border-gray-100'}`}>
        <div className="font-mono text-[10px] opacity-40 mb-1 uppercase tracking-widest">
          Sum = {products.map(p => p.product).join(' + ')} =
        </div>
        <div className="font-mono text-2xl font-black text-amber-400">{n}₁₀</div>
      </div>
    </div>
  );
};

// ── Bit-group visual (bin split into nibbles) ─────────────────────
const BitGroups: React.FC<{ binStr: string; dec: number; isDarkMode: boolean }> = ({ binStr, dec, isDarkMode }) => {
  // nibbles for hex
  const padded = binStr.padStart(Math.ceil(binStr.length / 4) * 4, '0');
  const nibbles = padded.match(/.{4}/g) || [];
  // triplets for octal
  const octalPad = binStr.padStart(Math.ceil(binStr.length / 3) * 3, '0');
  const triplets = octalPad.match(/.{3}/g) || [];

  return (
    <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl'}`}>
      <div className="mb-4">
        <div className={`font-mono text-[10px] uppercase tracking-widest mb-2 ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
          Visual grouping - same number, different lenses
        </div>
        <p className={`text-xs opacity-70 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Because 16 is exactly 2<sup>4</sup>, a single Hex digit perfectly represents 4 Binary bits! Similarly, because 8 is exactly 2<sup>3</sup>, a single Octal digit perfectly represents 3 Binary bits.
        </p>
      </div>
      {/* Nibbles for hex */}
      <div className="mb-5">
        <div className="font-mono text-[9px] text-violet-400 tracking-widest uppercase mb-2">
          Hex view - 4 bits per nibble
        </div>
        <div className="flex gap-3 flex-wrap">
          {nibbles.map((nib, i) => {
            const hexChar = parseInt(nib, 2).toString(16).toUpperCase();
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="flex gap-1">
                  {nib.split('').map((bit, j) => (
                    <div
                      key={j}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center font-mono font-black text-sm"
                      style={{
                        borderColor: bit === '1' ? 'rgba(168,85,247,0.5)' : (isDarkMode ? '#2D3139' : '#E5E7EB'),
                        background: bit === '1' ? 'rgba(168,85,247,0.12)' : 'transparent',
                        color: bit === '1' ? '#A855F7' : (isDarkMode ? '#475569' : '#CBD5E1'),
                      }}
                    >{bit}</div>
                  ))}
                </div>
                <div className="text-violet-400 font-black font-mono text-lg leading-none">{hexChar}</div>
                <div className="text-[9px] opacity-40 font-mono">{parseInt(nib, 2)}</div>
              </div>
            );
          })}
          <div className={`ml-2 pl-4 border-l flex items-center ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <div>
              <div className="font-mono text-[9px] opacity-40 mb-1">= Hex</div>
              <div className="font-mono text-xl font-black text-violet-400">
                {nibbles.map(n => parseInt(n, 2).toString(16).toUpperCase()).join('')}₁₆
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Triplets for octal */}
      <div>
        <div className="font-mono text-[9px] text-emerald-400 tracking-widest uppercase mb-2">
          Octal view - 3 bits per group
        </div>
        <div className="flex gap-3 flex-wrap">
          {triplets.map((tri, i) => {
            const octChar = parseInt(tri, 2).toString(8);
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="flex gap-1">
                  {tri.split('').map((bit, j) => (
                    <div
                      key={j}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center font-mono font-black text-sm"
                      style={{
                        borderColor: bit === '1' ? 'rgba(16,185,129,0.5)' : (isDarkMode ? '#2D3139' : '#E5E7EB'),
                        background: bit === '1' ? 'rgba(16,185,129,0.12)' : 'transparent',
                        color: bit === '1' ? '#10B981' : (isDarkMode ? '#475569' : '#CBD5E1'),
                      }}
                    >{bit}</div>
                  ))}
                </div>
                <div className="text-emerald-400 font-black font-mono text-lg leading-none">{octChar}</div>
              </div>
            );
          })}
          <div className={`ml-2 pl-4 border-l flex items-center ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <div>
              <div className="font-mono text-[9px] opacity-40 mb-1">= Octal</div>
              <div className="font-mono text-xl font-black text-emerald-400">
                {triplets.map(t => parseInt(t, 2).toString(8)).join('')}₈
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Reference Table 0-31 ─────────────────────────────────────────
const RefTable: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div className={`rounded-3xl border overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl'}`}>
    <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
      <div className={`font-mono text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>
        Master Reference Table - Decimal 0 to 31
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full font-mono text-[11px]">
        <thead className={isDarkMode ? 'bg-white/5' : 'bg-gray-50'}>
          <tr>
            {['Dec', 'Binary', 'Octal', 'Hex'].map(h => (
              <th key={h} className={`px-4 py-3 text-left font-black text-[9px] uppercase tracking-widest opacity-50 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 32 }, (_, i) => i).map(n => (
            <tr key={n} className={`border-t ${isDarkMode ? 'border-white/5 hover:bg-white/3' : 'border-gray-100 hover:bg-gray-50'}`}>
              <td className={`px-4 py-2 font-black text-amber-400`}>{n}</td>
              <td className={`px-4 py-2 text-sky-400`}>{n.toString(2).padStart(5, '0')}</td>
              <td className={`px-4 py-2 text-emerald-400`}>{n.toString(8)}</td>
              <td className={`px-4 py-2 text-violet-400 uppercase`}>{n.toString(16)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ── Main Export ───────────────────────────────────────────────────
export const S00_F_UniversalConverter: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [dec, setDec] = useState('25');
  const [bin, setBin] = useState('');
  const [oct, setOct] = useState('');
  const [hex, setHex] = useState('');
  const [decValid, setDecValid] = useState(true);
  const [binValid, setBinValid] = useState(true);
  const [octValid, setOctValid] = useState(true);
  const [hexValid, setHexValid] = useState(true);
  const [currentDec, setCurrentDec] = useState(25);
  const [showTable, setShowTable] = useState(false);

  const resolveFrom = useCallback((base: Base, val: string) => {
    const clean = val.trim().toUpperCase();
    let n: number | null = null;
    switch (base) {
      case 'dec': n = /^\d+$/.test(clean) ? parseInt(clean, 10) : null; break;
      case 'bin': n = parseBin(clean); break;
      case 'oct': n = parseOct(clean); break;
      case 'hex': n = parseHex(clean); break;
    }
    return n !== null ? clamp(n, 0, 16777215) : null;
  }, []);

  const handleChange = useCallback((base: Base, raw: string) => {
    const n = resolveFrom(base, raw);
    const valid = n !== null || raw.trim() === '';
    if (base === 'dec') { setDec(raw); setDecValid(valid); }
    if (base === 'bin') { setBin(raw); setBinValid(valid); }
    if (base === 'oct') { setOct(raw); setOctValid(valid); }
    if (base === 'hex') { setHex(raw.toUpperCase()); setHexValid(valid); }

    if (n !== null) {
      setCurrentDec(n);
      if (base !== 'dec') setDec(String(n));
      if (base !== 'bin') setBin(decToBin(n));
      if (base !== 'oct') setOct(decToOct(n));
      if (base !== 'hex') setHex(decToHex(n));
      setDecValid(true); setBinValid(true); setOctValid(true); setHexValid(true);
    }
  }, [resolveFrom]);

  // Init display
  const init = () => {
    setBin(decToBin(25)); setOct(decToOct(25)); setHex(decToHex(25));
  };
  if (bin === '') init();

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-12">
      {/* Header */}
      <section className="text-center space-y-4">
        <motion.span
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          className={`font-mono text-[10px] tracking-[0.4em] uppercase ${isDarkMode ? 'text-sky-400' : 'text-sky-600'} block mb-4`}
        >
          Number Systems - Live Converter
        </motion.span>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Universal Converter</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
          Type in <strong>any box</strong> - all others update instantly. See full step-by-step
          working for <strong>both</strong> the remainder method and weight method.
        </p>
      </section>

      {/* 4 Input Boxes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <InputBox label="Decimal" sub="Base 10 - digits 0-9" value={dec}
          onChange={v => handleChange('dec', v)} valid={decValid}
          color={ACCENT.dec.tw} bg={ACCENT.dec.bg} border={ACCENT.dec.border}
          isDarkMode={isDarkMode}
        />
        <InputBox label="Binary" sub="Base 2 - digits 0, 1" value={bin}
          onChange={v => handleChange('bin', v)} valid={binValid}
          color={ACCENT.bin.tw} bg={ACCENT.bin.bg} border={ACCENT.bin.border}
          isDarkMode={isDarkMode}
        />
        <InputBox label="Octal" sub="Base 8 - digits 0-7" value={oct}
          onChange={v => handleChange('oct', v)} valid={octValid}
          color={ACCENT.oct.tw} bg={ACCENT.oct.bg} border={ACCENT.oct.border}
          isDarkMode={isDarkMode}
        />
        <InputBox label="Hexadecimal" sub="Base 16 - 0-9, A-F" value={hex}
          onChange={v => handleChange('hex', v)} valid={hexValid}
          color={ACCENT.hex0.tw} bg={ACCENT.hex0.bg} border={ACCENT.hex0.border}
          isDarkMode={isDarkMode}
        />
      </motion.div>

      {/* Summary bar */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        className={`p-5 rounded-2xl border flex flex-wrap gap-8 justify-center text-center ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}
      >
        {[
          { label: 'Decimal', val: currentDec, color: '#F59E0B' },
          { label: 'Binary', val: decToBin(currentDec), color: '#0EA5E9' },
          { label: 'Octal', val: decToOct(currentDec), color: '#10B981' },
          { label: 'Hex', val: decToHex(currentDec), color: '#A855F7' },
        ].map(({ label, val, color }) => (
          <div key={label}>
            <div className="font-mono text-[9px] opacity-40 uppercase tracking-widest mb-1">{label}</div>
            <div className="font-mono text-xl font-black" style={{ color }}>{String(val)}</div>
          </div>
        ))}
      </motion.div>

      {/* Bit-group visual */}
      <BitGroups binStr={decToBin(currentDec)} dec={currentDec} isDarkMode={isDarkMode} />

      {/* Step-by-step working - FROM DECIMAL */}
      <div className="space-y-6">
        <div className={`font-mono text-[10px] uppercase tracking-widest opacity-50 ${textColor}`}>
          Method A - Remainder (Successive Division): Decimal → Other Bases
        </div>
        <div className={`text-sm opacity-80 leading-relaxed max-w-4xl ${textColor}`}>
          <p className="mb-2"><strong>How it works:</strong> To convert from Decimal (Base 10) to any target base (like 2, 8, or 16), you repeatedly divide the number by the target base.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The <strong>remainder</strong> of each division gives you the digits of the new base.</li>
            <li>The very first remainder you calculate goes at the far right (Least Significant Digit).</li>
            <li>The very last remainder goes at the far left (Most Significant Digit).</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RemainderWorking n={currentDec} base={2} baseLabel="Binary" accentHex="#0EA5E9" isDarkMode={isDarkMode} />
          <RemainderWorking n={currentDec} base={8} baseLabel="Octal" accentHex="#10B981" isDarkMode={isDarkMode} />
          <RemainderWorking n={currentDec} base={16} baseLabel="Hex" accentHex="#A855F7" isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Step-by-step working - TO DECIMAL */}
      <div className="space-y-6">
        <div className={`font-mono text-[10px] uppercase tracking-widest opacity-50 ${textColor}`}>
          Method B - Weight (Positional): Other Bases → Decimal
        </div>
        <div className={`text-sm opacity-80 leading-relaxed max-w-4xl flex flex-col gap-2 ${textColor}`}>
          <p><strong>How it works:</strong> To convert a number back to Decimal, you use "place values" or weights.</p>
          <p>Every position in a number has a weight based on its base. Starting from the right at position 0, the weight is <code>Base<sup>0</sup></code>, then <code>Base<sup>1</sup></code>, <code>Base<sup>2</sup></code>, etc.</p>
          <p>Multiply each digit by its positional weight, and sum all the products to get your final Decimal value.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WeightWorking
            digits={decToBin(currentDec)} base={2} baseLabel="₂"
            n={currentDec} accentHex="#0EA5E9" isDarkMode={isDarkMode}
          />
          <WeightWorking
            digits={decToOct(currentDec)} base={8} baseLabel="₈"
            n={currentDec} accentHex="#10B981" isDarkMode={isDarkMode}
          />
          <WeightWorking
            digits={decToHex(currentDec)} base={16} baseLabel="₁₆"
            n={currentDec} accentHex="#A855F7" isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Quick cross-conversion rules */}
      <div className={`p-8 rounded-[2rem] border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
        <h3 className={`font-mono text-xs uppercase tracking-widest mb-8 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>
          Shortcut Rules - Direct Conversions Without Going Through Decimal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Binary → Hex',
              rule: 'Group binary digits in sets of 4 from right → convert each group.',
              example: '1 0 1 1  1 1 0 0\n'
                     + '    B  =  11₁₀      C  =  12₁₀\n'
                     + '→ (BC)₁₆',
              color: '#A855F7',
            },
            {
              title: 'Hex → Binary',
              rule: 'Expand each hex digit into exactly 4 binary bits.',
              example: '(2BC)₁₆\n'
                     + '2 → 0010,  B(11) → 1011,  C(12) → 1100\n'
                     + '→ (001010111100)₂',
              color: '#A855F7',
            },
            {
              title: 'Binary → Octal',
              rule: 'Group binary digits in sets of 3 from right → convert each group.',
              example: '1 0 1  1 1 0  0 1 1\n'
                     + '  5       6       3\n'
                     + '→ (563)₈',
              color: '#10B981',
            },
            {
              title: 'Octal → Binary',
              rule: 'Expand each octal digit into exactly 3 binary bits.',
              example: '(567)₈\n'
                     + '5 → 101,  6 → 110,  7 → 111\n'
                     + '→ (101110111)₂',
              color: '#10B981',
            },
          ].map((rule, i) => (
            <div
              key={i}
              className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-black/30 border-white/5' : 'bg-white border-gray-100'}`}
            >
              <div className="font-mono text-sm font-black mb-2" style={{ color: rule.color }}>{rule.title}</div>
              <p className={`text-sm opacity-70 mb-4 leading-relaxed ${textColor}`}>{rule.rule}</p>
              <pre
                className={`font-mono text-xs leading-relaxed p-4 rounded-xl ${isDarkMode ? 'bg-black/40' : 'bg-gray-50 border border-gray-100'}`}
                style={{ color: rule.color }}
              >{rule.example}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* Reference table toggle */}
      <div>
        <button
          onClick={() => setShowTable(t => !t)}
          className={`w-full p-5 rounded-3xl border font-mono text-sm font-black uppercase tracking-widest text-left flex justify-between items-center transition-all
            ${isDarkMode ? 'bg-white/5 border-white/10 text-white/60 hover:border-sky-500 hover:text-sky-400' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-sky-400 hover:text-sky-600'}`}
        >
          <span>📊 Master Reference Table (0-31)</span>
          <span>{showTable ? '▲ Hide' : '▼ Show'}</span>
        </button>
        <AnimatePresence>
          {showTable && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <RefTable isDarkMode={isDarkMode} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default S00_F_UniversalConverter;
