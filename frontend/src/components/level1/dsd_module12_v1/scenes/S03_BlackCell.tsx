import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitMerge } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const INDIGO = '#818cf8';
const EMERALD = '#34d399';
const SKY = '#38bdf8';

export const S03_BlackCell: React.FC<Props> = ({ isDarkMode }) => {
  const [gu, setGu] = useState(0); // upper generate
  const [pu, setPu] = useState(1); // upper propagate
  const [gl, setGl] = useState(1); // lower generate
  const [pl, setPl] = useState(1); // lower propagate

  const gOut = gu | (pu & gl);
  const pOut = pu & pl;

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const Tog: React.FC<{ v: number; set: () => void; label: string; color: string }> = ({ v, set, label, color }) => (
    <div className="flex flex-col items-center gap-1">
      <button onClick={set} className="w-12 h-12 rounded-xl font-mono text-xl font-black border-2 transition-all active:scale-90"
        style={{ borderColor: v ? color : `${color}55`, background: v ? `${color}26` : 'transparent', color: v ? color : `${color}99` }}>{v}</button>
      <span className="font-mono text-[10px]" style={{ color }}>{label}</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <GitMerge size={14} /> Chapter 04 · The Black Cell
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>One little cell merges two blocks</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The whole prefix tree is built from a single repeated cell. It takes the Generate/Propagate
          summary of an upper block and a lower block and outputs one combined summary for the whole
          span. Toggle the four inputs and watch the merge.
        </p>
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* inputs / outputs */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: INDIGO }}>The two blocks coming in</div>
            <div className="flex flex-wrap gap-6">
              <div>
                <div className="font-mono text-[10px] uppercase mb-2" style={{ color: subHex(isDarkMode) }}>Upper block (more significant)</div>
                <div className="flex gap-3">
                  <Tog v={gu} set={() => setGu(gu ^ 1)} label="G upper" color={EMERALD} />
                  <Tog v={pu} set={() => setPu(pu ^ 1)} label="P upper" color={SKY} />
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase mb-2" style={{ color: subHex(isDarkMode) }}>Lower block (less significant)</div>
                <div className="flex gap-3">
                  <Tog v={gl} set={() => setGl(gl ^ 1)} label="G lower" color={EMERALD} />
                  <Tog v={pl} set={() => setPl(pl ^ 1)} label="P lower" color={SKY} />
                </div>
              </div>
            </div>

            <div className="mt-6 font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: INDIGO }}>The combined span coming out</div>
            <div className="flex gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-mono text-xl font-black border-2" style={{ borderColor: gOut ? EMERALD : `${EMERALD}55`, background: gOut ? `${EMERALD}26` : 'transparent', color: gOut ? EMERALD : `${EMERALD}99` }}>{gOut}</div>
                <span className="font-mono text-[10px]" style={{ color: EMERALD }}>G out</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-mono text-xl font-black border-2" style={{ borderColor: pOut ? SKY : `${SKY}55`, background: pOut ? `${SKY}26` : 'transparent', color: pOut ? SKY : `${SKY}99` }}>{pOut}</div>
                <span className="font-mono text-[10px]" style={{ color: SKY }}>P out</span>
              </div>
            </div>

            <div className={`mt-6 space-y-2 font-mono text-[13px] ${textColor}`}>
              <div><span style={{ color: EMERALD }}>G_out</span> = G_upper + P_upper · G_lower = {gu} + {pu}·{gl} = <strong style={{ color: EMERALD }}>{gOut}</strong></div>
              <div><span style={{ color: SKY }}>P_out</span> = P_upper · P_lower = {pu}·{pl} = <strong style={{ color: SKY }}>{pOut}</strong></div>
            </div>
          </div>

          {/* the cell diagram */}
          <div className={`rounded-2xl border p-5 ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-center font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: INDIGO }}>The cell, in words</div>
            <div className="space-y-3 text-[13px]">
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                <div className="font-mono font-black mb-1" style={{ color: EMERALD }}>Does the whole span generate a carry?</div>
                <p className={subText}>Yes if the upper block makes one on its own (<span className="font-mono">G_upper</span>), OR if the upper block passes along a carry the lower block made (<span className="font-mono">P_upper · G_lower</span>).</p>
              </div>
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                <div className="font-mono font-black mb-1" style={{ color: SKY }}>Does the whole span propagate a carry?</div>
                <p className={subText}>Only if <span className="font-mono">both</span> blocks propagate, so a carry entering the bottom can travel all the way through (<span className="font-mono">P_upper · P_lower</span>).</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl border-2 text-center"
                  style={{ borderColor: `${INDIGO}66`, background: isDarkMode ? 'rgba(129,140,248,0.06)' : 'rgba(129,140,248,0.05)' }}>
        <p className={`text-base md:text-lg font-bold leading-relaxed max-w-3xl mx-auto ${textColor}`}>
          This merge is <span style={{ color: INDIGO }}>associative</span>: it does not matter how you
          group the blocks, the answer is the same. That is the mathematical permission slip to build a
          tree - merge any way you like, in parallel, and the carries still come out right.
        </p>
      </motion.div>
    </div>
  );
};

function subHex(dark: boolean) { return dark ? '#94a3b8' : '#64748b'; }

export default S03_BlackCell;
