import React from 'react';
import { motion } from 'framer-motion';
import { Triangle, Zap } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S04_Diode: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <Triangle size={14} /> Step 3 · The Diode · Building Block of Every Rectifier
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Diode · one-way valve.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          A diode is a semiconductor that lets current flow in one direction only. In plumbing
          terms, it is a flapper valve — water can push it open one way, but reverse pressure
          jams it shut. This is the single component every rectifier is built from.
        </p>
      </section>

      {/* Topic banner */}
      <div className="rounded-2xl border-2 border-cyan-400/40 bg-cyan-500/10 p-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-200 border border-cyan-400/55">
          Topic
        </span>
        <span className={`font-mono text-sm font-black ${textColor}`}>
          PN-junction diode · ideal model vs practical (silicon) model with 0.7 V knee
        </span>
        <span className="ml-auto font-mono text-[11px] text-cyan-200">
          Forward biased → conducts · Reverse biased → blocks
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* IDEAL DIODE */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`rounded-3xl border ${cardBg} overflow-hidden`}
        >
          <div className="p-5 border-b" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-1">
              Ideal Diode
            </div>
            <h3 className={`text-xl font-black ${textColor}`}>Opens instantly · zero resistance</h3>
          </div>
          <div className="p-5 space-y-4">
            {/* Symbol */}
            <svg viewBox="0 0 280 80" className="w-full h-auto">
              <line x1="20" y1="40" x2="100" y2="40" stroke="#22c55e" strokeWidth="3" />
              <polygon points="100,22 100,58 140,40" fill="#22c55e" fillOpacity="0.5" stroke="#22c55e" strokeWidth="3" />
              <line x1="140" y1="22" x2="140" y2="58" stroke="#22c55e" strokeWidth="3" />
              <line x1="140" y1="40" x2="260" y2="40" stroke="#22c55e" strokeWidth="3" />
              <text x="20" y="20" fontSize="11" fontFamily="monospace" fill="#22c55e" fontWeight="bold">Anode</text>
              <text x="220" y="20" fontSize="11" fontFamily="monospace" fill="#22c55e" fontWeight="bold">Cathode</text>
              <polygon points="244,35 252,40 244,45" fill="#22c55e" />
            </svg>

            {/* I-V curve */}
            <div className={`rounded-xl p-3 border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">I-V Characteristic</div>
              <svg viewBox="0 0 280 140" className="w-full h-auto">
                <line x1="20" y1="100" x2="270" y2="100" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
                <line x1="140" y1="20" x2="140" y2="130" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
                <text x="6" y="30"  fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>I</text>
                <text x="262" y="115" fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>V</text>
                {/* Reverse: flat zero */}
                <line x1="20" y1="100" x2="140" y2="100" stroke="#22c55e" strokeWidth="3" />
                {/* Forward: vertical jump at V=0 */}
                <line x1="140" y1="100" x2="140" y2="30" stroke="#22c55e" strokeWidth="3" />
                <text x="180" y="50" fontSize="10" fontFamily="monospace" fill="#22c55e">r_ac = 0 Ω</text>
              </svg>
            </div>
            <p className={`text-xs ${subText}`}>
              In the ideal model, the moment voltage goes positive, current flows freely.
              No turn-on penalty.
            </p>
          </div>
        </motion.div>

        {/* PRACTICAL DIODE */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`rounded-3xl border ${cardBg} overflow-hidden`}
        >
          <div className="p-5 border-b" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-1">
              Practical (Silicon) Diode
            </div>
            <h3 className={`text-xl font-black ${textColor}`}>Needs 0.7 V to open the valve</h3>
          </div>
          <div className="p-5 space-y-4">
            {/* Symbol with V_K label */}
            <svg viewBox="0 0 280 80" className="w-full h-auto">
              <line x1="20" y1="40" x2="100" y2="40" stroke="#fbbf24" strokeWidth="3" />
              <polygon points="100,22 100,58 140,40" fill="#fbbf24" fillOpacity="0.5" stroke="#fbbf24" strokeWidth="3" />
              <line x1="140" y1="22" x2="140" y2="58" stroke="#fbbf24" strokeWidth="3" />
              <line x1="140" y1="40" x2="260" y2="40" stroke="#fbbf24" strokeWidth="3" />
              {/* V_K hash marks like a small battery */}
              <line x1="80" y1="32" x2="80" y2="48" stroke="#fb7185" strokeWidth="2" />
              <line x1="86" y1="36" x2="86" y2="44" stroke="#fb7185" strokeWidth="2" />
              <text x="68" y="20" fontSize="11" fontFamily="monospace" fill="#fb7185" fontWeight="bold">V_K = 0.7 V</text>
            </svg>

            {/* I-V curve with knee */}
            <div className={`rounded-xl p-3 border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">I-V Characteristic · with knee</div>
              <svg viewBox="0 0 280 140" className="w-full h-auto">
                <line x1="20" y1="100" x2="270" y2="100" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
                <line x1="140" y1="20" x2="140" y2="130" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
                <text x="6" y="30"  fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>I</text>
                <text x="262" y="115" fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>V</text>
                <line x1="20" y1="100" x2="170" y2="100" stroke="#fbbf24" strokeWidth="3" />
                <line x1="170" y1="100" x2="180" y2="80" stroke="#fbbf24" strokeWidth="3" />
                <line x1="180" y1="80" x2="240" y2="30" stroke="#fbbf24" strokeWidth="3" />
                <line x1="170" y1="100" x2="170" y2="115" stroke="#fb7185" strokeWidth="1.5" strokeDasharray="3 2" />
                <text x="160" y="128" fontSize="10" fontFamily="monospace" fill="#fb7185">V_K = 0.7</text>
                <text x="200" y="60" fontSize="10" fontFamily="monospace" fill="#fbbf24">r_ac ≈ 0 Ω</text>
              </svg>
            </div>
            <p className={`text-xs ${subText}`}>
              A real silicon diode needs about <strong className="text-amber-300">0.7 V</strong> of
              forward pressure before any current flows. Your input signal must exceed 0.7 V.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Park analogy */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-3 flex items-center gap-2">
          <Zap size={12} /> Park analogy · the flapper valve
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-5 border-2 border-emerald-400/40 bg-emerald-500/10">
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">Ideal</div>
            <p className={`text-sm ${textColor}`}>
              A perfectly oiled valve — opens with the slightest forward push. Closes instantly on
              reverse. <strong className="text-emerald-300">No friction, no delay.</strong>
            </p>
          </div>
          <div className="rounded-2xl p-5 border-2 border-amber-400/40 bg-amber-500/10">
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Practical (silicon)</div>
            <p className={`text-sm ${textColor}`}>
              A heavy, spring-loaded valve. You need to push with at least{' '}
              <strong className="text-amber-300">0.7 V of pressure</strong> to crack it open. Below
              that, no flow.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
