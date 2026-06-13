import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Cpu, Zap, AlertTriangle } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ORANGE = '#fb923c';
const EMERALD = '#34d399';
const VIOLET = '#a78bfa';
const ROSE = '#fb7185';

const COMPARISON: Array<{ attr: string; rca: string; cla: string }> = [
  { attr: 'Method',          rca: 'Sequential processing',     cla: 'Parallel generation' },
  { attr: 'Carry logic',     rca: 'Waits for the previous bit', cla: 'Anticipates via Generate & Propagate' },
  { attr: 'Delay (16-bit)',  rca: '~32 gate delays',           cla: '~11 gate delays' },
  { attr: 'Delay growth',    rca: 'Linear with N',             cla: 'Nearly constant (per block)' },
  { attr: 'Hardware',        rca: 'Simple and small',          cla: 'Complex and large' },
  { attr: 'Wins when',       rca: 'Area and power are tight',  cla: 'Speed matters most' },
];

export const S05_Compare: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <Scale size={14} /> Chapter 06 · Speed vs Cost
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>A faster kitchen, but a much bigger one</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The look-ahead adder buys speed with silicon. Here is the scoreboard against ripple carry,
          the reason the trade is worth it, and the wall it eventually hits.
        </p>
      </motion.section>

      {/* the headline numbers */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { v: '~11', unit: 'gate delays', sub: 'a 16-bit look-ahead add', color: EMERALD },
          { v: '~32', unit: 'gate delays', sub: 'the same add, rippled', color: ROSE },
          { v: '≈ 3×', unit: 'faster', sub: 'and the gap widens with width', color: ORANGE },
        ].map(({ v, unit, sub, color }) => (
          <motion.div key={sub} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-3xl border text-center ${cardBg}`}>
            <div className="font-mono text-4xl font-black" style={{ color }}>{v}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color }}>{unit}</div>
            <div className={`mt-2 text-[12px] ${subText}`}>{sub}</div>
          </motion.div>
        ))}
      </div>

      {/* comparison table */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`rounded-3xl border overflow-hidden ${cardBg}`}>
        <div className="grid grid-cols-3 text-center font-mono text-[11px] md:text-sm font-black uppercase tracking-widest">
          <div className={`p-4 ${subText}`}>Attribute</div>
          <div className="p-4 text-black" style={{ background: ROSE }}>Ripple (Waiter)</div>
          <div className="p-4 text-black" style={{ background: EMERALD }}>Look-Ahead (Chef)</div>
        </div>
        {COMPARISON.map((row, i) => (
          <div key={row.attr} className={`grid grid-cols-3 text-center text-[13px] md:text-sm border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'} ${i % 2 === 1 ? (isDarkMode ? 'bg-white/[0.03]' : 'bg-slate-50/60') : ''}`}>
            <div className={`p-4 font-bold ${textColor}`}>{row.attr}</div>
            <div className={`p-4 ${subText}`}>{row.rca}</div>
            <div className="p-4 font-medium" style={{ color: EMERALD }}>{row.cla}</div>
          </div>
        ))}
      </motion.div>

      {/* the cost */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className={`p-6 rounded-3xl border ${cardBg}`}>
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${EMERALD}26`, border: `1px solid ${EMERALD}55` }}><Zap size={20} style={{ color: EMERALD }} /></div>
          <h3 className={`mt-4 text-lg font-extrabold ${textColor}`}>What you gain</h3>
          <p className={`mt-1.5 text-sm leading-relaxed ${subText}`}>Minimal, near-constant delay. The carries stop queuing, so the adder stays fast even as it gets wider - the whole point of building it.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className={`p-6 rounded-3xl border ${cardBg}`}>
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${ORANGE}26`, border: `1px solid ${ORANGE}55` }}><Cpu size={20} style={{ color: ORANGE }} /></div>
          <h3 className={`mt-4 text-lg font-extrabold ${textColor}`}>What you pay</h3>
          <p className={`mt-1.5 text-sm leading-relaxed ${subText}`}>Increased hardware complexity. As the carry equations expand, the gates need more and more inputs and wiring, consuming significantly more area and power on the silicon.</p>
        </motion.div>
      </div>

      {/* the wall → parallel prefix */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className="p-6 md:p-8 rounded-3xl border-2"
                  style={{ borderColor: `${VIOLET}66`, background: isDarkMode ? 'rgba(167,139,250,0.06)' : 'rgba(167,139,250,0.05)' }}>
        <div className="flex items-center gap-2 mb-3 justify-center"><Scale size={18} style={{ color: VIOLET }} /><span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: VIOLET }}>The wall it hits</span></div>
        <p className={`text-base md:text-lg font-bold leading-relaxed max-w-3xl mx-auto text-center ${textColor}`}>
          A single flat look-ahead block is wonderful at 4 bits. At 64 bits the carry equations
          become monstrous - gates with dozens of inputs, impossible to build. The fix is to stack
          look-ahead in <span style={{ color: VIOLET }}>multi-level blocks</span>, which is exactly
          the parallel prefix adder, coming next.
        </p>
        <div className="mt-3 flex items-center gap-2 justify-center font-mono text-[11px]" style={{ color: ORANGE }}>
          <AlertTriangle size={12} /> the next module keeps this speed without the gate explosion
        </div>
      </motion.div>
    </div>
  );
};

export default S05_Compare;
