import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ChevronRight } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive: boolean; isDarkMode: boolean; }

type CompType = '1s' | '2s' | '9s' | '10s';

const COMP_INFO: Record<CompType, { label: string; formula: string; color: string; desc: string }> = {
  '1s': {
    label: "1's Complement",
    formula: 'Flip all bits: 0→1, 1→0',
    color: '#0EA5E9',
    desc: "Flip every bit. Two representations of zero (00…0 and 11…1).",
  },
  '2s': {
    label: "2's Complement",
    formula: "1's Complement + 1",
    color: '#10B981',
    desc: "Most-used in modern CPUs. One zero. Subtraction becomes addition.",
  },
  '9s': {
    label: "9's Complement",
    formula: '(10ⁿ − 1) − N',
    color: '#F59E0B',
    desc: "For decimal: replace each digit d with (9 − d).",
  },
  '10s': {
    label: "10's Complement",
    formula: "9's Complement + 1",
    color: '#F97316',
    desc: "Used in BCD subtraction. Add to subtract without a subtractor.",
  },
};

// ─── Binary complement helpers ────────────────────────────────
const ones = (bits: number[]) => bits.map(b => 1 - b);
const twos = (bits: number[]) => {
  const o = ones(bits);
  let carry = 1;
  for (let i = o.length - 1; i >= 0; i--) {
    const s = o[i] + carry;
    o[i] = s % 2;
    carry = Math.floor(s / 2);
  }
  return o;
};

// ─── Decimal complement helpers ───────────────────────────────
const nines = (n: number, digits: number) => Math.pow(10, digits) - 1 - n;
const tens = (n: number, digits: number) => Math.pow(10, digits) - n;

const BitCell: React.FC<{ val: number; color: string; isDarkMode: boolean; onClick?: () => void }> = ({ val, color, isDarkMode, onClick }) => (
  <motion.button
    onClick={onClick}
    animate={{
      backgroundColor: val ? `${color}20` : (isDarkMode ? '#0D0F16' : '#F8FAFC'),
      borderColor: val ? color : (isDarkMode ? '#2D3139' : '#E2E8F0'),
      color: val ? color : (isDarkMode ? '#375069' : '#CBD5E1'),
      boxShadow: val ? `0 0 14px ${color}44` : 'none',
    }}
    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
    style={{
      width: 48, height: 56, border: '2px solid', borderRadius: 10,
      fontFamily: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace', fontSize: 22, fontWeight: 900,
      cursor: onClick ? 'pointer' : 'default', outline: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
  >
    {val}
  </motion.button>
);

const BitRow: React.FC<{ label: string; bits: number[]; color: string; isDarkMode: boolean; onToggle?: (i: number) => void }> = ({
  label, bits, color, isDarkMode, onToggle,
}) => (
  <div className="flex items-center gap-4">
    <span className="font-mono text-xs w-28 text-right opacity-60" style={{ color }}>{label}</span>
    <div className="flex gap-2">
      {bits.map((b, i) => (
        <BitCell key={i} val={b} color={color} isDarkMode={isDarkMode} onClick={onToggle ? () => onToggle(i) : undefined} />
      ))}
    </div>
  </div>
);

// ─── Shortcut visual for 2's complement ────────────────────────
const TwosShortcut: React.FC<{ bits: number[]; isDarkMode: boolean }> = ({ bits, isDarkMode }) => {
  // Find rightmost 1
  const firstOneIdx = bits.lastIndexOf(1);
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  return (
    <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-white border border-gray-100'} font-mono text-sm`}>
      <div className={`text-xs uppercase tracking-widest opacity-50 mb-4 ${textColor}`}>Shortcut: Find rightmost 1 → keep it & all bits to its right → flip rest</div>
      <div className="flex gap-2 flex-wrap">
        {bits.map((b, i) => {
          const isKept = i >= firstOneIdx;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-10 h-10 rounded-lg border-2 flex items-center justify-center font-black text-lg"
                style={{
                  borderColor: isKept ? '#10B981' : '#F97316',
                  color: isKept ? '#10B981' : '#F97316',
                  background: isKept ? 'rgba(16,185,129,0.08)' : 'rgba(249,115,22,0.08)',
                }}
              >
                {i < firstOneIdx ? 1 - b : b}
              </div>
              <span className="text-[9px] opacity-40">{isKept ? 'keep' : 'flip'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const S11_Complements: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [type, setType] = useState<CompType>('2s');
  const [bits, setBits] = useState([1, 1, 0, 1, 0, 0]); // 52
  const [decNum, setDecNum] = useState(85);

  const info = COMP_INFO[type];
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl';

  const ones_result = ones(bits);
  const twos_result = twos(bits);
  const digits = String(decNum).length;

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-12">
      {/* Header */}
      <section className="text-center space-y-4">
        <motion.span
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          className={`font-mono text-[10px] tracking-[0.4em] uppercase block mb-4 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}
        >
          Complements - Chapter 3.2
        </motion.span>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Complements</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
          The secret weapon of digital arithmetic - turn subtraction into addition.
        </p>
      </section>

      {/* Type Selector */}
      <TryItYourself />
      <div className="flex flex-wrap gap-3 justify-center">
        {(Object.keys(COMP_INFO) as CompType[]).map(t => (
          <motion.button
            key={t}
            onClick={() => setType(t)}
            animate={{
              background: type === t ? `${COMP_INFO[t].color}22` : 'transparent',
              borderColor: type === t ? COMP_INFO[t].color : (isDarkMode ? '#2D3139' : '#E2E8F0'),
              color: type === t ? COMP_INFO[t].color : (isDarkMode ? '#64748B' : '#9CA3AF'),
            }}
            className="px-5 py-2.5 rounded-full border-2 font-mono text-xs font-black uppercase tracking-widest cursor-pointer"
          >
            {COMP_INFO[t].label}
          </motion.button>
        ))}
      </div>

      {/* Binary Complements (1s and 2s) */}
      <AnimatePresence mode="wait">
        {(type === '1s' || type === '2s') && (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Info Card */}
            <div className={`p-8 rounded-3xl border ${cardBg}`}>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ background: info.color, boxShadow: `0 0 10px ${info.color}` }} />
                <div>
                  <h3 className={`font-black text-xl mb-2 ${textColor}`}>{info.label}</h3>
                  <p className={`text-sm opacity-60 leading-relaxed ${textColor}`}>{info.desc}</p>
                  <div className={`mt-3 font-mono text-xs px-3 py-1.5 rounded-lg inline-block`} style={{ background: `${info.color}18`, color: info.color }}>
                    {info.formula}
                  </div>
                </div>
              </div>

              {/* Bit Interactive */}
              <div className="space-y-5">
                <div className="text-xs font-mono opacity-40 uppercase tracking-widest mb-2">Click input bits to toggle:</div>
                <BitRow label="Input N:" bits={bits} color={isDarkMode ? '#64748B' : '#94A3B8'} isDarkMode={isDarkMode} onToggle={(i) => setBits(p => p.map((v, idx) => idx === i ? 1 - v : v))} />
                {type === '1s' && <BitRow label="1's comp:" bits={ones_result} color={info.color} isDarkMode={isDarkMode} />}
                {type === '2s' && (
                  <>
                    <BitRow label="1's comp:" bits={ones_result} color="#0EA5E9" isDarkMode={isDarkMode} />
                    <BitRow label="+1 → 2's:" bits={twos_result} color={info.color} isDarkMode={isDarkMode} />
                  </>
                )}
              </div>
            </div>

            {/* Shortcut for 2's */}
            {type === '2s' && <TwosShortcut bits={bits} isDarkMode={isDarkMode} />}

            {/* Subtraction Demo */}
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
              <h4 className={`font-black text-sm uppercase tracking-widest mb-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                {type === '2s' ? "Why it matters: Subtraction = Addition" : "Why it matters: Used to build 2's Complement"}
              </h4>
              {type === '2s' ? (
                <div className={`font-mono text-sm leading-loose ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  <div>To compute A − B:</div>
                  <div className="mt-2">1. Find <span className="text-emerald-400">2's complement of B</span></div>
                  <div>2. Add it to A</div>
                  <div>3. Discard the carry-out</div>
                  <div className={`mt-4 p-4 rounded-xl border border-emerald-500/20 ${isDarkMode ? 'bg-black/20' : 'bg-white/70'}`}>
                    <div className="opacity-50 mb-2">Example: 5 − 3 in 4-bit</div>
                    <div>5 = <span className="text-sky-400">0101</span>, 3 = <span className="text-sky-400">0011</span></div>
                    <div>2's comp of 3 = <span className="text-emerald-400">1101</span></div>
                    <div>0101 + 1101 = 1<span className="text-emerald-400">0010</span></div>
                    <div>Discard carry → <span className="text-emerald-400 font-black">0010</span> = 2 ✓</div>
                  </div>
                </div>
              ) : (
                <div className={`font-mono text-sm leading-loose ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  <div>1's Complement is the first step to 2's Complement.</div>
                  <div className="mt-2 opacity-60">Weakness: Two representations of zero (0000 and 1111)</div>
                  <div>Solution: Add 1 → get 2's complement with unique zero.</div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Decimal Complements (9s and 10s) */}
        {(type === '9s' || type === '10s') && (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className={`p-8 rounded-3xl border ${cardBg}`}>
              <div className="flex items-start gap-4 mb-8">
                <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ background: info.color, boxShadow: `0 0 10px ${info.color}` }} />
                <div>
                  <h3 className={`font-black text-xl mb-2 ${textColor}`}>{info.label}</h3>
                  <p className={`text-sm opacity-60 leading-relaxed ${textColor}`}>{info.desc}</p>
                </div>
              </div>

              {/* Decimal Input */}
              <div className="space-y-4">
                <label className={`text-xs font-mono uppercase tracking-widest opacity-50 ${textColor}`}>Input Decimal Number:</label>
                <input
                  type="number"
                  value={decNum}
                  onChange={e => setDecNum(Math.max(0, Math.min(9999, Number(e.target.value))))}
                  className={`w-full max-w-xs text-center text-3xl font-black font-mono border-2 rounded-2xl p-4 outline-none transition-colors ${
                    isDarkMode ? 'bg-black/40 text-white border-white/20 focus:border-sky-500' : 'bg-gray-50 text-gray-900 border-gray-200 focus:border-sky-500'
                  }`}
                />
              </div>

              <div className="mt-8 grid gap-4">
                <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-gray-50 border border-gray-100'}`}>
                  <div className={`text-xs opacity-40 uppercase tracking-widest mb-3 ${textColor}`}>
                    {type === '9s' ? `(10^${digits} − 1) − N = (${new Array(digits).fill(9).join('')}) − ${decNum}` : `10^${digits} − N = ${Math.pow(10, digits)} − ${decNum}`}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-mono text-xs opacity-40 ${textColor}`}>Result:</span>
                    <motion.div
                      key={type + decNum}
                      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="font-mono text-4xl font-black"
                      style={{ color: info.color, textShadow: `0 0 20px ${info.color}66` }}
                    >
                      {type === '9s' ? nines(decNum, digits) : tens(decNum, digits)}
                    </motion.div>
                  </div>
                </div>

                {type === '10s' && (
                  <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                    <div className={`text-xs mb-3 font-mono ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                      Verify: {decNum} + {tens(decNum, digits)} = {decNum + tens(decNum, digits)} (= 10^{digits} - discard leading 1)
                    </div>
                    <div className={`text-xs opacity-60 ${textColor}`}>
                      9's complement of {decNum} = {nines(decNum, digits)}, then +1 = {nines(decNum, digits) + 1}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Digit-by-digit 9s viz */}
            {type === '9s' && (
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
                <h4 className={`font-mono text-xs uppercase tracking-widest mb-6 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>Digit-by-Digit Visualization</h4>
                <div className="flex gap-8 justify-center flex-wrap">
                  {String(decNum).split('').map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                      <div className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-black font-mono ${isDarkMode ? 'border-white/20 text-white' : 'border-gray-300 text-gray-700'}`}>{d}</div>
                      <ChevronRight size={16} className="opacity-40 rotate-90" />
                      <div className="w-14 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-black font-mono" style={{ borderColor: info.color, color: info.color, background: `${info.color}15` }}>
                        {9 - Number(d)}
                      </div>
                      <span className="text-xs opacity-40 font-mono">9−{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Table */}
      <div className={`rounded-3xl border overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl'}`}>
        <div className={`p-6 border-b flex items-center gap-3 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <RefreshCw size={16} className="text-sky-500" />
          <h4 className={`font-mono text-xs uppercase tracking-widest ${textColor}`}>4-Bit Signed Number Table</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className={isDarkMode ? 'bg-white/5' : 'bg-gray-50'}>
                {['Decimal', 'Sign-Mag', "1's Comp", "2's Comp"].map(h => (
                  <th key={h} className={`px-6 py-3 text-left font-black uppercase tracking-widest opacity-50 ${textColor}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['+7', '0111', '0111', '0111'],
                ['+0', '0000', '0000', '0000'],
                ['−0', '1000', '1111', '-'],
                ['−1', '1001', '1110', '1111'],
                ['−3', '1011', '1100', '1101'],
                ['−7', '1111', '1000', '1001'],
                ['−8', '-', '-', '1000'],
              ].map((row, i) => (
                <tr key={i} className={`border-t ${isDarkMode ? 'border-white/5 hover:bg-white/3' : 'border-gray-100 hover:bg-gray-50'}`}>
                  {row.map((cell, j) => (
                    <td key={j} className={`px-6 py-3 ${j === 0 ? (cell.startsWith('-') ? 'text-rose-400' : (isDarkMode ? 'text-sky-400' : 'text-sky-600')) : (cell === '-' ? 'opacity-20' : (isDarkMode ? 'text-white/70' : 'text-gray-700'))} font-black`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
