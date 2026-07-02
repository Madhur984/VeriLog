import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Table } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

interface Op { state: string; voltage: string; depletion: string; analogy: string; current: string; color: string; }

const OPERATIONS: Op[] = [
  { state: 'No Bias',      voltage: 'V_D = 0',     depletion: 'Equilibrium',  analogy: 'Platform Gap',  current: 'I_D = 0 mA',           color: '#94a3b8' },
  { state: 'Reverse-Bias', voltage: 'V_D < 0',     depletion: 'Widened',      analogy: 'Locked Doors',  current: 'I_S (μA range)',       color: '#a78bfa' },
  { state: 'Forward-Bias', voltage: 'V_D > 0',     depletion: 'Narrowed',     analogy: 'Doors Open',    current: 'Exponential Rise',     color: '#34d399' },
  { state: 'Breakdown',    voltage: 'V_D = V_BV',  depletion: 'Collapsed',    analogy: 'Stampede',      current: 'Infinite (Avalanche)', color: '#f43f5e' },
];

export const S08_TurnstileMatrix: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-emerald-400">
          <Activity size={14} /> Chapter 08 · The Diode
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Ultimate Commuter Turnstile</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          One symbol summarises the whole journey. The triangle points in the direction of
          permitted current (forward bias). The bar is the closed door (reverse bias). A diode is
          <strong className="text-emerald-300"> a one-way street</strong> for current.
        </p>
      </section>

      {/* V-I region map */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400 mb-5">
          The full V-I journey · 4 regions on one curve
        </div>
        <svg viewBox="0 0 700 280" className="w-full h-auto">
          <line x1="50" y1="180" x2="650" y2="180" stroke="#475569" strokeWidth="1" />
          <line x1="350" y1="20" x2="350" y2="260" stroke="#475569" strokeWidth="1" />
          <text x="650" y="200" fill="#94a3b8" fontFamily="monospace" fontSize="11" textAnchor="end">V_D</text>
          <text x="360" y="30" fill="#94a3b8" fontFamily="monospace" fontSize="11">I_D</text>

          <rect x="50" y="180" width="80" height="80" fill="#f43f5e10" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" />
          <text x="90" y="225" fill="#f43f5e" fontFamily="monospace" fontSize="10" textAnchor="middle" fontWeight="bold">BREAKDOWN</text>
          <text x="90" y="240" fill="#f43f5e" fontFamily="monospace" fontSize="9" textAnchor="middle">V_D = V_BV</text>

          <rect x="130" y="160" width="220" height="40" fill="#a78bfa10" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3 3" />
          <text x="240" y="155" fill="#a78bfa" fontFamily="monospace" fontSize="10" textAnchor="middle" fontWeight="bold">REVERSE BIAS · I_S</text>

          <circle cx="350" cy="180" r="6" fill="#fcd34d" />
          <text x="362" y="175" fill="#fcd34d" fontFamily="monospace" fontSize="9">no bias</text>

          <rect x="350" y="160" width="100" height="40" fill="#fbbf2410" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 3" />
          <text x="400" y="155" fill="#fbbf24" fontFamily="monospace" fontSize="10" textAnchor="middle" fontWeight="bold">below knee</text>

          <rect x="450" y="40" width="200" height="140" fill="#34d39910" stroke="#34d399" strokeWidth="1" strokeDasharray="3 3" />
          <text x="550" y="60" fill="#34d399" fontFamily="monospace" fontSize="11" textAnchor="middle" fontWeight="bold">FORWARD ACTIVE</text>
          <text x="550" y="76" fill="#34d399" fontFamily="monospace" fontSize="9" textAnchor="middle">I rises exponentially</text>

          <path
            d="M 60 180 L 130 178 L 350 178 L 430 175 L 460 165 L 480 130 L 510 80 L 540 50 L 600 35"
            fill="none" stroke="#22d3ee" strokeWidth="3"
          />
          <path d="M 60 180 L 65 200 L 70 240 L 75 260" fill="none" stroke="#f43f5e" strokeWidth="3" />

          <line x1="475" y1="175" x2="475" y2="185" stroke="#fcd34d" strokeWidth="2" />
          <text x="475" y="200" fill="#fcd34d" fontFamily="monospace" fontSize="10" textAnchor="middle">0.7 V</text>

          <line x1="65" y1="175" x2="65" y2="185" stroke="#f43f5e" strokeWidth="2" />
          <text x="65" y="200" fill="#f43f5e" fontFamily="monospace" fontSize="10" textAnchor="middle">V_BV</text>
        </svg>
        <p className={`text-xs ${subText} mt-3 text-center`}>
          A diode lives in four distinct regions. The matrix below summarises what happens in
          each - and the analogy that makes it stick.
        </p>
      </motion.div>

      {/* Operations matrix */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <Table size={14} className="text-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">Operations matrix</span>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr_1.2fr] gap-px bg-emerald-500/20 min-w-[700px]">
            {['State', 'Voltage (V_D)', 'Depletion Width', 'Train Analogy', 'Current (I_D)'].map((h) => (
              <div key={h} className="p-3 bg-black/60 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                {h}
              </div>
            ))}
            {OPERATIONS.map((o) => (
              <React.Fragment key={o.state}>
                <div className={`p-4 ${isDarkMode ? 'bg-black/40' : 'bg-slate-100'} font-mono text-sm font-bold`} style={{ color: o.color }}>
                  {o.state}
                </div>
                <div className={`p-4 ${isDarkMode ? 'bg-black/40' : 'bg-white'} font-mono text-xs ${textColor}`}>
                  {o.voltage}
                </div>
                <div className={`p-4 ${isDarkMode ? 'bg-black/40' : 'bg-white'} font-mono text-xs ${textColor}`}>
                  {o.depletion}
                </div>
                <div className={`p-4 ${isDarkMode ? 'bg-black/40' : 'bg-white'} font-mono text-xs ${textColor}`}>
                  {o.analogy}
                </div>
                <div className={`p-4 ${isDarkMode ? 'bg-black/40' : 'bg-white'} font-mono text-xs font-bold`} style={{ color: o.color }}>
                  {o.current}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Diode symbol annotated */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.35 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400 mb-5">The diode symbol · annotated</div>
        <svg viewBox="0 0 600 200" className="w-full h-auto max-w-3xl mx-auto">
          <line x1="40" y1="100" x2="200" y2="100" stroke="#fb923c" strokeWidth="3" />
          <text x="40" y="90" fill="#fb923c" fontFamily="monospace" fontSize="13" fontWeight="bold">Anode (+)</text>
          <text x="40" y="125" fill="#94a3b8" fontFamily="monospace" fontSize="11">P-side</text>

          <polygon points="200,70 280,100 200,130" fill="none" stroke="#34d399" strokeWidth="3" />
          <text x="240" y="170" fill="#34d399" fontFamily="monospace" fontSize="11" textAnchor="middle">permitted flow →</text>

          <line x1="290" y1="70" x2="290" y2="130" stroke="#f43f5e" strokeWidth="4" />

          <line x1="290" y1="100" x2="450" y2="100" stroke="#38bdf8" strokeWidth="3" />
          <text x="380" y="90" fill="#38bdf8" fontFamily="monospace" fontSize="13" fontWeight="bold">Cathode (−)</text>
          <text x="380" y="125" fill="#94a3b8" fontFamily="monospace" fontSize="11">N-side</text>

          <line x1="120" y1="50" x2="200" y2="50" stroke="#34d399" strokeWidth="2" markerEnd="url(#fwdArr)" />
          <defs>
            <marker id="fwdArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
            </marker>
            <marker id="revArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
          </defs>
          <text x="160" y="42" fill="#34d399" fontFamily="monospace" fontSize="10" textAnchor="middle" fontWeight="bold">FORWARD</text>

          <line x1="380" y1="50" x2="290" y2="50" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#revArr)" />
          <text x="335" y="42" fill="#f43f5e" fontFamily="monospace" fontSize="10" textAnchor="middle" fontWeight="bold">BLOCKED</text>
        </svg>
        <p className={`text-xs ${subText} text-center mt-4`}>
          Triangle = permitted direction. Bar = closed door for the opposite direction. Like a
          mechanical turnstile, but enforcing a strict one-way street for current.
        </p>
      </motion.div>

      {/* Headline PDF - the iconic turnstile illustration */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.45 }}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img loading="lazy" decoding="async" src="/images/commuter/p12.webp" alt="The ultimate commuter turnstile" className="w-full block aspect-[16/9] object-cover" />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-emerald-200/80">
          Commuter Circuit · The Diode Symbol
        </div>
      </motion.div>

      {/* Closing recap */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.55 }}
        className={`p-8 rounded-3xl border ${cardBg} text-center space-y-4`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">Level cleared</div>
        <h3 className={`text-2xl font-black ${textColor}`}>You can now read any P-N junction in any context.</h3>
        <p className={`text-sm ${subText} max-w-2xl mx-auto`}>
          Depletion region → forward/reverse/breakdown V-I → the diode symbol. Every diode in
          every textbook collapses into the four regions above. Onward to the transistor - same
          machinery, more terminals.
        </p>
      </motion.div>
    </div>
  );
};
