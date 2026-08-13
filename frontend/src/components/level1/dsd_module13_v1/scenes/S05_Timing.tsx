import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Scale, Cpu, Watch, Radio, Gauge, AlertTriangle } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const SKY = '#38bdf8';
const EMERALD = '#34d399';
const AMBER = '#f59e0b';
const VIOLET = '#a78bfa';

const COMPARISON: Array<{ attr: string; parallel: string; serial: string }> = [
  { attr: 'Analogy',          parallel: 'Eight lanes open',    serial: 'A single lane' },
  { attr: 'Full adders',      parallel: 'One per bit (N)',     serial: 'Just one, reused' },
  { attr: 'Carry handling',   parallel: 'Wired stage to stage', serial: 'Stored in a flip-flop' },
  { attr: 'Hardware size',    parallel: 'Massive',             serial: 'Compact' },
  { attr: 'Time for N bits',  parallel: 'One clock cycle',     serial: 'N clock cycles' },
  { attr: 'Wins when',        parallel: 'Speed is everything', serial: 'Space and power are tight' },
];

const LIMITS: Array<{ Icon: React.FC<any>; title: string; body: string }> = [
  { Icon: Gauge, title: 'Resource utilization', body: 'An N-bit add costs N clock cycles, so in a fast system the serial adder spends most of its time being the bottleneck. A poor fit anywhere raw arithmetic speed is the goal.' },
  { Icon: AlertTriangle, title: 'Control complexity', body: 'The adder itself is trivially small, but something must sequence the shifting, count the cycles and clear the carry at the start. That control logic makes the real design fiddlier than a plain parallel adder.' },
];

const APPS: Array<{ Icon: React.FC<any>; label: string; note: string }> = [
  { Icon: Cpu,   label: 'Tiny microcontrollers', note: 'where every gate of silicon area counts' },
  { Icon: Radio, label: 'Low-power IoT sensors',  note: 'sip-power devices that rarely need speed' },
  { Icon: Watch, label: 'Wearables & smartwatches', note: 'battery life beats microseconds' },
];

export const S05_Timing: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* header */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <Scale size={14} /> Chapter 06 · Time vs Space
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The bargain, in numbers</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The serial adder is not better or worse than the parallel one - it sits at the opposite
          end of the same trade. Here is exactly what you give and what you get, where it breaks
          down, and who chooses the single lane on purpose.
        </p>
      </motion.section>

      {/* N bits = N cycles */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-5">
          <Clock size={16} style={{ color: SKY }} />
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: SKY }}>The factor of time</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Tick 1', 'Tick 2', 'Tick 3', 'Tick N'].map((t, i) => (
            <div key={t} className={`p-4 rounded-2xl border text-center ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: SKY }}>{t}</div>
              <div className={`mt-1 text-2xl font-black ${textColor}`}>{i < 3 ? `bit ${i + 1}` : 'last bit'}</div>
              <div className={`mt-1 text-[11px] ${subText}`}>{i < 3 ? 'one pair added' : 'plus a final carry'}</div>
            </div>
          ))}
        </div>
        <p className={`mt-4 text-center text-sm ${subText}`}>
          Processing N cars takes N green lights. An <strong style={{ color: SKY }}>N-bit addition
          takes N clock cycles</strong> - the time grows with the size of the numbers, because the
          single booth can only serve one pair of bits per tick.
        </p>
      </motion.div>

      {/* comparison table */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`rounded-3xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <div className="min-w-[520px] md:min-w-0">
            <div className="grid grid-cols-3 text-center font-mono text-[11px] md:text-sm font-black uppercase tracking-widest">
              <div className={`p-4 ${subText}`}>Attribute</div>
              <div className="p-4 text-black" style={{ background: AMBER }}>Parallel</div>
              <div className="p-4 text-black" style={{ background: SKY }}>Serial</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={row.attr} className={`grid grid-cols-3 text-center text-[13px] md:text-sm border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'} ${
                i % 2 === 1 ? (isDarkMode ? 'bg-white/[0.03]' : 'bg-slate-50/60') : ''
              }`}>
                <div className={`p-4 font-bold ${textColor}`}>{row.attr}</div>
                <div className={`p-4 ${subText}`}>{row.parallel}</div>
                <div className={`p-4 font-medium`} style={{ color: SKY }}>{row.serial}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* limitations */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <h3 className={`text-xl font-black ${textColor}`}>The cost of the single lane</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {LIMITS.map(({ Icon, title, body }) => (
            <motion.div key={title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-3xl border ${cardBg}`}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${AMBER}26`, border: `1px solid ${AMBER}55` }}>
                <Icon size={20} style={{ color: AMBER }} />
              </div>
              <h4 className={`mt-4 text-[15px] font-extrabold ${textColor}`}>{title}</h4>
              <p className={`mt-1.5 text-[13px] leading-relaxed ${subText}`}>{body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* applications */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Cpu size={16} style={{ color: EMERALD }} />
          <h3 className={`text-xl font-black ${textColor}`}>Where the single lane wins</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {APPS.map(({ Icon, label, note }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-3xl border text-center ${cardBg}`}>
              <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center" style={{ background: `${EMERALD}26`, border: `1px solid ${EMERALD}55` }}>
                <Icon size={22} style={{ color: EMERALD }} />
              </div>
              <h4 className={`mt-3 text-[15px] font-extrabold ${textColor}`}>{label}</h4>
              <p className={`mt-1 text-[12px] ${subText}`}>{note}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* trade-off close */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className="p-6 md:p-10 rounded-3xl border-2 text-center"
                  style={{ borderColor: `${VIOLET}66`, background: isDarkMode ? 'rgba(167,139,250,0.06)' : 'rgba(167,139,250,0.05)' }}>
        <Scale size={28} className="mx-auto mb-3" style={{ color: VIOLET }} />
        <h3 className={`text-2xl md:text-3xl font-black ${textColor}`}>
          Would you sacrifice <span style={{ color: SKY }}>time</span> or <span style={{ color: AMBER }}>space</span>?
        </h3>
        <p className={`mt-3 text-base max-w-2xl mx-auto ${subText}`}>
          There is no universally right answer - only the right answer for your constraints. The
          serial adder is the elegant proof that, in digital design, you can almost always buy one
          resource with the other.
        </p>
      </motion.div>
    </div>
  );
};

export default S05_Timing;
