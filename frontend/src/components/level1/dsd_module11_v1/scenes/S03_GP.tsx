import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, ArrowRightCircle } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ORANGE = '#fb923c';
const EMERALD = '#34d399';
const SKY = '#38bdf8';

export const S03_GP: React.FC<Props> = ({ isDarkMode }) => {
  const [A, setA] = useState<number[]>([1, 0, 1, 1]); // index 0 = bit 0
  const [B, setB] = useState<number[]>([0, 1, 1, 0]);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const Bit: React.FC<{ value: number; color: string; onClick?: () => void }> = ({ value, color, onClick }) => (
    <button onClick={onClick} disabled={!onClick}
      className={`w-10 h-10 rounded-lg font-mono text-base font-black border-2 transition-all ${onClick ? 'active:scale-90 cursor-pointer' : 'cursor-default'}`}
      style={{ borderColor: value ? color : `${color}55`, background: value ? `${color}26` : 'transparent', color: value ? color : `${color}99` }}>
      {value}
    </button>
  );

  const order = [3, 2, 1, 0];

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <Flame size={14} /> Chapter 04 · Generate & Propagate
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Two recipes the chef reads off each column</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Before computing a single carry, look at each column on its own and ask two questions.
          Does it make a carry by itself? That is Generate. Will it pass a carry through? That is
          Propagate. Toggle the bits and watch G and P update for every column at once.
        </p>
      </motion.section>

      {/* the two recipes */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className={`p-5 rounded-3xl border ${cardBg}`}>
          <div className="flex items-center gap-2"><Flame size={16} style={{ color: EMERALD }} /><span className="font-mono text-[11px] uppercase tracking-widest font-black" style={{ color: EMERALD }}>Generate · G = A · B</span></div>
          <p className={`mt-2 text-sm ${subText}`}>Output 1 only when <strong style={{ color: EMERALD }}>both</strong> bits are 1 - the column makes a carry on its own, no matter what comes in. It is an AND gate.</p>
        </div>
        <div className={`p-5 rounded-3xl border ${cardBg}`}>
          <div className="flex items-center gap-2"><ArrowRightCircle size={16} style={{ color: SKY }} /><span className="font-mono text-[11px] uppercase tracking-widest font-black" style={{ color: SKY }}>Propagate · P = A ⊕ B</span></div>
          <p className={`mt-2 text-sm ${subText}`}>Output 1 when <strong style={{ color: SKY }}>exactly one</strong> bit is 1 - the column will pass an incoming carry straight through. It is an XOR gate.</p>
        </div>
      </div>

      {/* interactive table */}
      <TryItYourself />
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`p-6 md:p-8 rounded-3xl border overflow-x-auto ${cardBg}`}>
        <table className="w-full min-w-[520px] text-center font-mono">
          <thead>
            <tr className={`text-[11px] uppercase tracking-widest ${subText}`}>
              <th className="py-2 text-left">Column</th>
              {order.map(i => <th key={i} className="py-2">bit {i}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 text-left text-xs" style={{ color: SKY }}>A (tap)</td>
              {order.map(i => <td key={i} className="py-2"><Bit value={A[i]} color={SKY} onClick={() => setA(A.map((v, j) => j === i ? v ^ 1 : v))} /></td>)}
            </tr>
            <tr>
              <td className="py-2 text-left text-xs" style={{ color: SKY }}>B (tap)</td>
              {order.map(i => <td key={i} className="py-2"><Bit value={B[i]} color={SKY} onClick={() => setB(B.map((v, j) => j === i ? v ^ 1 : v))} /></td>)}
            </tr>
            <tr className={`border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
              <td className="py-2 text-left text-xs" style={{ color: EMERALD }}>G = A·B</td>
              {order.map(i => <td key={i} className="py-2"><Bit value={A[i] & B[i]} color={EMERALD} /></td>)}
            </tr>
            <tr>
              <td className="py-2 text-left text-xs" style={{ color: SKY }}>P = A⊕B</td>
              {order.map(i => <td key={i} className="py-2"><Bit value={A[i] ^ B[i]} color={SKY} /></td>)}
            </tr>
          </tbody>
        </table>
        <p className={`mt-4 text-center text-xs font-mono ${subText}`}>
          A column can generate (G=1) or propagate (P=1), but never both at once - if both bits are 1, the XOR is 0.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl border-2 text-center"
                  style={{ borderColor: `${ORANGE}66`, background: isDarkMode ? 'rgba(251,146,60,0.06)' : 'rgba(251,146,60,0.05)' }}>
        <p className={`text-base md:text-lg font-bold leading-relaxed max-w-3xl mx-auto ${textColor}`}>
          These G and P bits come straight from the inputs in a single gate delay - no carry needed.
          That is what makes the next step possible: with every column's G and P in hand, the chef can
          write down <span style={{ color: ORANGE }}>every carry at once</span>.
        </p>
      </motion.div>
    </div>
  );
};

export default S03_GP;
