import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const EMERALD = '#34d399';
const VIOLET = '#a78bfa';
const SKY = '#38bdf8';

const N = 4;

export const S03_Build: React.FC<Props> = ({ isDarkMode }) => {
  const [A, setA] = useState<number[]>([1, 1, 0, 1]); // index 0 = bit0 (LSB)
  const [B, setB] = useState<number[]>([0, 1, 1, 0]);
  const [cin, setCin] = useState(0);

  // compute the ripple chain
  const carries: number[] = [cin];
  const sums: number[] = [];
  for (let i = 0; i < N; i++) {
    const a = A[i], b = B[i], c = carries[i];
    sums[i] = a ^ b ^ c;
    carries[i + 1] = (a & b) | (b & c) | (a & c);
  }
  const cout = carries[N];
  const aVal = A.reduce((v, bit, i) => v + (bit << i), 0);
  const bVal = B.reduce((v, bit, i) => v + (bit << i), 0);
  const sumVal = sums.reduce((v, bit, i) => v + (bit << i), 0) + (cout << N);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const Bit: React.FC<{ value: number; color: string; onClick?: () => void; small?: boolean }> = ({ value, color, onClick, small }) => (
    <button onClick={onClick} disabled={!onClick}
      className={`${small ? 'w-9 h-9 text-base' : 'w-11 h-11 text-lg'} rounded-lg font-mono font-black border-2 transition-all ${onClick ? 'active:scale-90 cursor-pointer' : 'cursor-default'}`}
      style={{ borderColor: value ? color : `${color}55`, background: value ? `${color}26` : 'transparent', color: value ? color : `${color}99` }}>
      {value}
    </button>
  );

  // render bit3..bit0 left to right
  const order = [3, 2, 1, 0];

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      {/* header */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <LinkIcon size={14} /> Chapter 04 · Building the Relay Team
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Four runners, wired carry to carry</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          A 4-bit ripple-carry adder is four full adders in a row. Toggle the input bits and the
          carry-in, and watch every stage update. The amber wire between stages is the carry being
          handed forward - light it up and you can see the baton move.
        </p>
      </motion.section>

      {/* operands */}
      <div><TryItYourself label="Toggle the bits" /></div>
      <div className={`p-5 rounded-3xl border flex flex-wrap items-center gap-x-8 gap-y-4 ${cardBg}`}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-black w-8" style={{ color: SKY }}>A</span>
          <div className="flex gap-1.5">{order.map(i => <Bit key={i} value={A[i]} color={SKY} small onClick={() => setA(A.map((v, j) => j === i ? v ^ 1 : v))} />)}</div>
          <span className={`font-mono text-sm ${subText}`}>= {aVal}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-black w-8" style={{ color: SKY }}>B</span>
          <div className="flex gap-1.5">{order.map(i => <Bit key={i} value={B[i]} color={SKY} small onClick={() => setB(B.map((v, j) => j === i ? v ^ 1 : v))} />)}</div>
          <span className={`font-mono text-sm ${subText}`}>= {bVal}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-black" style={{ color: AMBER }}>Cin</span>
          <Bit value={cin} color={AMBER} small onClick={() => setCin(cin ^ 1)} />
        </div>
        <div className={`font-mono text-sm ml-auto ${textColor}`}>
          {aVal} + {bVal}{cin ? ' + 1' : ''} = <strong style={{ color: EMERALD }}>{sumVal}</strong>
        </div>
      </div>

      {/* the chain of stages */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-6 md:p-8 rounded-3xl border overflow-x-auto ${cardBg}`}>
        <div className="flex items-stretch justify-center gap-2 min-w-[640px]">
          {/* Cout on the far left */}
          <div className="flex flex-col items-center justify-center">
            <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: AMBER }}>Cout</div>
            <Bit value={cout} color={AMBER} />
            <div className="mt-1 text-[9px] font-mono opacity-50">top bit</div>
          </div>

          {order.map((i, k) => (
            <React.Fragment key={i}>
              {/* carry wire into this stage from the right (between stages) */}
              <div className="flex items-center">
                <div className="w-6 h-1 rounded" style={{ background: carries[i] ? AMBER : (isDarkMode ? '#334155' : '#cbd5e1') }} />
              </div>
              {/* the full-adder stage */}
              <div className="rounded-2xl border-2 p-3 text-center" style={{ borderColor: VIOLET, background: `${VIOLET}0e`, minWidth: 96 }}>
                <div className="flex justify-center gap-1 mb-2">
                  <Bit value={A[i]} color={SKY} small />
                  <Bit value={B[i]} color={SKY} small />
                </div>
                <div className="font-mono text-[10px] font-black" style={{ color: VIOLET }}>FA{i}</div>
                <div className="font-mono text-[8px] mb-2 opacity-50">bit {i}</div>
                <div className="font-mono text-[9px]" style={{ color: AMBER }}>Cin={carries[i]}</div>
                <div className="mt-2 flex flex-col items-center">
                  <div className="font-mono text-[9px] uppercase" style={{ color: EMERALD }}>Sum</div>
                  <Bit value={sums[i]} color={EMERALD} small />
                </div>
              </div>
              {/* on the last stage (k===N-1, bit0) show Cin entering from the right */}
              {k === order.length - 1 && (
                <div className="flex flex-col items-center justify-center ml-1">
                  <div className="w-6 h-1 rounded" style={{ background: cin ? AMBER : (isDarkMode ? '#334155' : '#cbd5e1') }} />
                  <div className="font-mono text-[9px] mt-1" style={{ color: AMBER }}>Cin</div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* result row */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className={`font-mono text-[10px] uppercase tracking-widest ${subText}`}>Result</span>
          <Bit value={cout} color={EMERALD} small />
          {order.map(i => <Bit key={i} value={sums[i]} color={EMERALD} small />)}
          <span className={`font-mono text-sm ml-2 ${textColor}`}>= {sumVal}</span>
        </div>
      </motion.div>

      {/* the key facts */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-4">
        {[
          { color: AMBER, title: 'The carry chain', body: 'Each FA\'s carry-out is the next FA\'s carry-in. Flip a low bit and watch the amber wire light up and travel left.' },
          { color: VIOLET, title: 'Identical stages', body: 'Every box is the same full adder from Module 08. Build one, copy it N times, wire the carries - that is the whole design.' },
          { color: EMERALD, title: 'N+1 output bits', body: 'N sum bits plus the final carry-out. Two 4-bit numbers can total up to 30, which needs 5 bits - the top one is Cout.' },
        ].map(({ color, title, body }) => (
          <div key={title} className={`p-5 rounded-3xl border ${cardBg}`}>
            <div className="w-2.5 h-2.5 rounded-full mb-3" style={{ background: color }} />
            <h3 className={`text-[15px] font-extrabold ${textColor}`}>{title}</h3>
            <p className={`mt-1.5 text-[13px] leading-relaxed ${subText}`}>{body}</p>
          </div>
        ))}
      </motion.div>

      <p className={`text-center text-xs font-mono ${subText}`}>
        This view shows WHAT the adder computes, instantly. The next chapter adds the missing
        dimension - TIME - and shows that the carry does not actually arrive everywhere at once.
      </p>
    </div>
  );
};

export default S03_Build;
