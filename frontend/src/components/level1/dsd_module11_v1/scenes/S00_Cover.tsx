import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, ArrowRight, Zap, Cpu } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ORANGE = '#fb923c';
const EMERALD = '#34d399';
const VIOLET = '#a78bfa';
const SKY = '#38bdf8';

const FACTS: Array<[string, string]> = [
  ['2', 'signals per bit: Generate (G) and Propagate (P)'],
  ['‖', 'every carry computed in parallel, not rippled'],
  ['~3·ΔG', 'delay for a block - almost flat, regardless of width'],
  ['G,P', 'G = A·B, P = A⊕B - the whole trick in two terms'],
];

const JOURNEY = ['The chef', 'G & P', 'Predict carries', 'Speed vs cost', 'Prove it'];

export const S00_Cover: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: ORANGE }}>
          <ChefHat size={14} /> DSD Module 11 · The Carry Look-Ahead Adder
        </div>
        <h1 className={`text-4xl md:text-6xl font-black tracking-tight ${textColor}`}>
          Don't wait for the carry. <span style={{ color: ORANGE }}>Predict it.</span>
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${subText}`}>
          The ripple-carry adder is slow because every stage waits for the carry from the stage
          below. The carry look-ahead adder refuses to wait. It looks at all the input bits at once
          and works out, in parallel, exactly which columns will produce a carry and which will pass
          one along - so every carry is ready almost instantly, no matter how many bits there are.
        </p>
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FACTS.map(([n, label]) => (
          <div key={label} className={`p-5 rounded-2xl border text-center ${cardBg}`}>
            <div className="font-mono text-2xl md:text-3xl font-black" style={{ color: ORANGE }}>{n}</div>
            <div className={`text-xs mt-1 ${subText}`}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* the idea at a glance */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: ORANGE }}>The two questions for every bit</div>
            <div className="space-y-3">
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-sm font-black" style={{ color: EMERALD }}>Generate · G = A·B</div>
                <p className={`mt-1 text-[13px] ${subText}`}>Will this column make a carry on its own? Yes, only when both bits are 1.</p>
              </div>
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-sm font-black" style={{ color: SKY }}>Propagate · P = A⊕B</div>
                <p className={`mt-1 text-[13px] ${subText}`}>Will this column pass a carry through? Yes, when exactly one bit is 1.</p>
              </div>
            </div>
          </div>
          <div className={`p-5 rounded-2xl border font-mono text-sm ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`text-[10px] uppercase tracking-widest mb-3 ${subText}`}>Every carry, straight from the inputs</div>
            <div className="space-y-2">
              <div style={{ color: textHex(isDarkMode) }}>C1 = <span style={{ color: EMERALD }}>G0</span> + <span style={{ color: SKY }}>P0</span>·C0</div>
              <div style={{ color: textHex(isDarkMode) }}>C2 = <span style={{ color: EMERALD }}>G1</span> + <span style={{ color: SKY }}>P1</span>·<span style={{ color: EMERALD }}>G0</span> + <span style={{ color: SKY }}>P1·P0</span>·C0</div>
              <div style={{ color: textHex(isDarkMode) }}>C3 = <span style={{ color: EMERALD }}>G2</span> + <span style={{ color: SKY }}>P2</span>·<span style={{ color: EMERALD }}>G1</span> + … + <span style={{ color: SKY }}>P2·P1·P0</span>·C0</div>
            </div>
            <p className={`mt-3 text-[11px] ${subText}`}>No carry depends on another carry - only on G's, P's and C0. So they all resolve at the same time.</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="grid md:grid-cols-2 gap-4">
        {[
          { Icon: Zap, color: EMERALD, title: 'Its strength: speed', body: 'Carries no longer ripple. A look-ahead block resolves all its carries in a fixed handful of gate delays, so the adder is fast even when it is wide.' },
          { Icon: Cpu, color: ORANGE, title: 'Its price: hardware', body: 'Those parallel carry equations grow quickly. More inputs mean bigger AND-OR gates and more wiring - a faster kitchen needs a much larger one.' },
        ].map(({ Icon, color, title, body }) => (
          <div key={title} className={`p-6 rounded-3xl border ${cardBg}`}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${color}26`, border: `1px solid ${color}55` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <h3 className={`mt-4 text-lg font-extrabold ${textColor}`}>{title}</h3>
            <p className={`mt-1.5 text-sm leading-relaxed ${subText}`}>{body}</p>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-4 text-center" style={{ color: ORANGE }}>The route through this module</div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {JOURNEY.map((step, i) => (
            <React.Fragment key={step}>
              <span className="px-4 py-2 rounded-full border-2 font-mono text-[11px] font-black"
                    style={{ borderColor: i === JOURNEY.length - 1 ? `${VIOLET}88` : `${ORANGE}44`, color: i === JOURNEY.length - 1 ? VIOLET : ORANGE, background: i === JOURNEY.length - 1 ? `${VIOLET}10` : `${ORANGE}08` }}>
                {step}
              </span>
              {i < JOURNEY.length - 1 && <ArrowRight size={13} className="opacity-40" />}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-4 text-xs text-center font-mono" style={{ color: EMERALD }}>
          The direct answer to Module 10's ripple delay. Same full-adder columns - smarter carries.
        </p>
      </motion.div>
    </div>
  );
};

function textHex(dark: boolean) { return dark ? '#e2e8f0' : '#0f172a'; }

export default S00_Cover;
