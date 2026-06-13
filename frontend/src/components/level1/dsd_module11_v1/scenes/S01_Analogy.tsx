import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Utensils, Flame, ArrowRightCircle, Clock } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const ORANGE = '#fb923c';
const EMERALD = '#34d399';
const SKY = '#38bdf8';
const ROSE = '#fb7185';

export const S01_Analogy: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const order = ['Burger', 'Fries', 'Drink', 'Dessert'];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: ORANGE }}>
          <ChefHat size={14} /> The Master Chef
        </div>
        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>
          A waiter takes one order at a time. <span style={{ color: ORANGE }}>A chef reads the whole ticket.</span>
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${subText}`}>
          Picture a four-course meal. The ripple-carry adder is a painfully literal waiter: order
          the burger, wait for it, then order the fries, wait, then the drink, wait... The carry
          look-ahead adder is a master chef who reads the entire order ticket at once and starts
          every dish at the same moment.
        </p>
      </motion.section>

      {/* waiter vs chef */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} className={`p-6 rounded-3xl border ${cardBg}`}>
          <div className="flex items-center gap-2 mb-3">
            <Utensils size={18} style={{ color: ROSE }} />
            <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: ROSE }}>The sequential waiter · ripple carry</div>
          </div>
          <div className="space-y-2">
            {order.map((dish, i) => (
              <div key={dish} className="flex items-center gap-2" style={{ marginLeft: i * 16 }}>
                <span className={`font-mono text-sm ${textColor}`}>Order {dish}</span>
                <span className="font-mono text-[11px]" style={{ color: ROSE }}>… wait</span>
              </div>
            ))}
          </div>
          <p className={`mt-4 text-sm ${subText}`}>
            Total time = the sum of every prep time, one after another. Each dish waits on the one
            before it - exactly how a ripple carry waits on the previous bit's carry.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} className={`p-6 rounded-3xl border ${cardBg}`}>
          <div className="flex items-center gap-2 mb-3">
            <ChefHat size={18} style={{ color: ORANGE }} />
            <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: ORANGE }}>The master chef · carry look-ahead</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {order.map((dish) => (
              <div key={dish} className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: `${ORANGE}55`, background: `${ORANGE}10` }}>
                <Flame size={13} style={{ color: ORANGE }} />
                <span className={`font-mono text-sm ${textColor}`}>{dish}</span>
              </div>
            ))}
          </div>
          <p className={`mt-4 text-sm ${subText}`}>
            All four dishes started at once, the instant the chef sees the ticket. Total time = the
            single longest dish, not the sum. That is parallel carry computation.
          </p>
        </motion.div>
      </div>

      {/* two ways to move an order forward */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="text-center mb-6">
          <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: ORANGE }}>Two ways to move an order forward</div>
          <h3 className={`text-2xl font-black ${textColor}`}>How the chef thinks about each column</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${EMERALD}26`, border: `1px solid ${EMERALD}55` }}>
              <Flame size={20} style={{ color: EMERALD }} />
            </div>
            <h4 className={`mt-4 text-lg font-extrabold ${textColor}`}>Generate (G)</h4>
            <p className={`mt-1.5 text-sm leading-relaxed ${subText}`}>
              Create a brand-new carry from scratch, from the current ingredients alone. A column
              generates a carry only when <strong style={{ color: EMERALD }}>both</strong> bits are 1.
            </p>
            <div className="mt-3 font-mono text-sm" style={{ color: EMERALD }}>G = A · B</div>
          </div>
          <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${SKY}26`, border: `1px solid ${SKY}55` }}>
              <ArrowRightCircle size={20} style={{ color: SKY }} />
            </div>
            <h4 className={`mt-4 text-lg font-extrabold ${textColor}`}>Propagate (P)</h4>
            <p className={`mt-1.5 text-sm leading-relaxed ${subText}`}>
              Pass an existing carry from the previous stage straight down the line. A column
              propagates when <strong style={{ color: SKY }}>exactly one</strong> bit is 1.
            </p>
            <div className="mt-3 font-mono text-sm" style={{ color: SKY }}>P = A ⊕ B</div>
          </div>
        </div>
        <p className={`mt-5 text-center text-sm max-w-2xl mx-auto ${subText}`}>
          Knowing G and P for every column, the chef can answer "will a carry reach here?" for all
          columns at once - without ever waiting for a carry to arrive. That is the whole secret.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className="p-6 md:p-8 rounded-3xl border-2 text-center"
                  style={{ borderColor: `${ORANGE}66`, background: isDarkMode ? 'rgba(251,146,60,0.06)' : 'rgba(251,146,60,0.05)' }}>
        <Clock size={26} className="mx-auto mb-2" style={{ color: ORANGE }} />
        <p className={`text-lg md:text-xl font-bold leading-relaxed max-w-3xl mx-auto ${textColor}`}>
          The waiter's total time grows with every dish added. The chef's does not - it stays nearly
          flat, because the dishes never queue. Trade a bigger kitchen for a faster meal, and you
          have the carry look-ahead adder.
        </p>
      </motion.div>
    </div>
  );
};

export default S01_Analogy;
