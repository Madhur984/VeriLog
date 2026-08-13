import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Battery, Droplets, ArrowDown } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// Filtered output (sawtooth ripple)
const buildFilteredOutput = (w: number, h: number, ripple = 0.18) => {
  const pts: string[] = [];
  // Capacitor charges quickly to peak, discharges slowly between pulses
  for (let i = 0; i <= 200; i++) {
    const x = (i / 200) * w;
    const localPhase = ((i / 200) * 4) % 1; // 4 ripples
    let y;
    if (localPhase < 0.15) {
      // sharp rise to peak
      y = (h / 2) - (h / 2) * 0.85 * (1 - ripple * (1 - localPhase / 0.15));
    } else {
      // slow exponential decay
      const t = (localPhase - 0.15) / 0.85;
      y = (h / 2) - (h / 2) * 0.85 * (1 - ripple * t);
    }
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(' ');
};

const buildFullWave = (w: number, h: number, amp = 0.85) => {
  const pts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = (i / 200) * w;
    const t = (i / 200) * 4 * Math.PI;
    const s = Math.abs(Math.sin(t));
    const y = (h / 2) - s * (h / 2) * amp;
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(' ');
};

export const S08_Filter: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  // Charge / discharge animation phase (0 = full charge, 1 = full discharge)
  const [chargeLevel, setChargeLevel] = useState(0.95);
  useEffect(() => {
    if (!isActive) return;
    const t = setInterval(() => {
      setChargeLevel((prev) => {
        // Cycle: charge 1 → 0.95 → 0.78 → back to 0.95 etc
        const next = prev > 0.93 ? 0.78 : prev < 0.85 ? prev + 0.04 : prev + 0.06;
        return Math.min(0.95, Math.max(0.78, next));
      });
    }, 200);
    return () => clearInterval(t);
  }, [isActive]);

  const isCharging = chargeLevel > 0.85;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <Droplets size={14} /> Step 7 · Capacitor Filter
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Smooth the pulses to a near-flat line.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Even after full-wave rectification the output drops to zero 100 times per second. We
          need to store excess pressure when the wave is high and release it when the wave is low.
          That storage element is the capacitor - our overhead water tank.
        </p>
      </section>

      {/* Topic banner */}
      <div className="rounded-2xl border-2 border-amber-400/40 bg-amber-500/10 p-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 border border-amber-400/55">
          Topic
        </span>
        <span className={`font-mono text-sm font-black ${textColor}`}>
          Shunt capacitor filter · C in parallel with the load · acts as a low-pass filter
        </span>
        <span className="ml-auto font-mono text-[11px] text-amber-200">
          Bigger C → lower ripple
        </span>
      </div>

      {/* PROBLEM · pulsing flow */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-5 md:p-8 rounded-3xl border-2 border-rose-400/40 bg-rose-500/10`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-2">The bottleneck</div>
        <h3 className={`text-xl font-black ${textColor} mb-3`}>Pulsing flow · pressure drops to zero 100×/sec</h3>
        <p className={`text-sm ${subText}`}>
          A microchip running on this signal would reset every time the voltage dips to zero. We
          need a way to <strong className="text-rose-300">store</strong> excess pressure when the
          wave is high and <strong className="text-rose-300">release</strong> it when the wave is
          low. That fills in the gaps.
        </p>
      </motion.div>

      {/* CAPACITOR FILTER VISUAL · animated tank */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-5 md:p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
            The capacitor · charge & discharge cycle
          </div>
          <div className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest font-black border ${
            isCharging
              ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/50'
              : 'bg-amber-400/20 text-amber-300 border-amber-400/50'
          }`}>
            {isCharging ? 'T1 · Charging · pump filling tank' : 'T2 · Discharging · tank feeding load'}
          </div>
        </div>

        <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:overflow-x-visible md:px-0">
        <svg viewBox="0 0 800 320" className="w-full h-auto min-w-[600px]">
          {/* Rectifier on left */}
          <rect x="40" y="120" width="120" height="100" rx="10" fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke="#a78bfa" strokeWidth="2.5" />
          <text x="68" y="150" fontSize="11" fontFamily="monospace" fill="#a78bfa" fontWeight="bold">Rectifier</text>
          <text x="68" y="170" fontSize="9" fontFamily="monospace" fill="#a78bfa">(4 diodes)</text>
          {/* Pulsing input on top of rectifier */}
          <g transform="translate(60, 76)">
            <path d={buildFullWave(80, 36, 0.85)} stroke="#a78bfa" strokeWidth="2" fill="none" />
          </g>

          {/* Wire to capacitor */}
          <line x1="160" y1="170" x2="270" y2="170" stroke={isCharging ? '#22c55e' : '#fbbf24'} strokeWidth="3"
                style={{ filter: `drop-shadow(0 0 4px ${isCharging ? 'rgba(34,197,94,0.7)' : 'rgba(251,191,36,0.7)'})` }} />

          {/* Direction arrow */}
          <motion.polygon
            points="240,164 240,176 256,170"
            fill={isCharging ? '#22c55e' : '#fbbf24'}
            animate={{ x: isCharging ? [0, 14, 0] : [0, -14, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />

          {/* Capacitor (drawn as a tank) */}
          <g transform="translate(280, 110)">
            <rect x="0" y="0" width="100" height="120" rx="6" fill="none" stroke="#fbbf24" strokeWidth="3" />
            {/* Water level inside */}
            <motion.rect
              x="3"
              animate={{ y: 120 - chargeLevel * 114, height: chargeLevel * 114 }}
              transition={{ duration: 0.4 }}
              width="94"
              fill="#fbbf24"
              fillOpacity="0.4"
            />
            {/* Water surface ripple */}
            <motion.path
              d={`M 3 ${120 - chargeLevel * 114} Q 25 ${120 - chargeLevel * 114 - 4} 50 ${120 - chargeLevel * 114} T 97 ${120 - chargeLevel * 114}`}
              stroke="#fbbf24" strokeWidth="2" fill="none"
              animate={{ x: [-2, 2, -2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <text x="32" y="-6" fontSize="11" fontFamily="monospace" fill="#fbbf24" fontWeight="bold">Tank · C</text>
          </g>

          {/* Wire to load */}
          <line x1="380" y1="170" x2="500" y2="170" stroke={!isCharging ? '#22c55e' : '#fbbf24'} strokeWidth="3"
                style={{ filter: `drop-shadow(0 0 4px ${!isCharging ? 'rgba(34,197,94,0.7)' : 'rgba(251,191,36,0.7)'})` }} />

          {/* Load */}
          <line x1="500" y1="170" x2="500" y2="120" stroke="#22c55e" strokeWidth="3" />
          <path d="M 500 120 L 515 110 L 545 130 L 575 110 L 605 130 L 615 120"
                stroke="#22c55e" strokeWidth="2.5" fill="none" />
          <text x="540" y="100" fontSize="11" fontFamily="monospace" fill="#22c55e">R_L</text>
          <line x1="615" y1="120" x2="615" y2="170" stroke="#22c55e" strokeWidth="3" />
          <line x1="615" y1="170" x2="700" y2="170" stroke="#22c55e" strokeWidth="3" />
          <text x="640" y="160" fontSize="11" fontFamily="monospace" fill="#22c55e" fontWeight="bold">V_o (smooth DC)</text>
          {/* Output level indicator */}
          <motion.rect
            x="715" y={172 - chargeLevel * 30} width="20" height={chargeLevel * 30}
            animate={{ height: chargeLevel * 30, y: 172 - chargeLevel * 30 }}
            transition={{ duration: 0.4 }}
            fill="#22c55e" fillOpacity="0.6"
          />
          <rect x="715" y="142" width="20" height="30" fill="none" stroke="#22c55e" strokeWidth="1.5" />

          {/* Bottom return wire */}
          <line x1="700" y1="220" x2="40" y2="220" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1.5" opacity="0.5" />

          {/* Phase labels */}
          <text x="200" y="280" fontSize="11" fontFamily="monospace" fill={isCharging ? '#22c55e' : '#94a3b8'} fontWeight="bold">
            Phase 1 (T1): pump fills tank
          </text>
          <text x="500" y="280" fontSize="11" fontFamily="monospace" fill={!isCharging ? '#22c55e' : '#94a3b8'} fontWeight="bold">
            Phase 2 (T2): tank feeds load
          </text>
        </svg>
        </div>

        <div className="mt-5 grid md:grid-cols-2 gap-3">
          <div className={`p-4 rounded-xl border-2 ${isCharging ? 'border-emerald-400 bg-emerald-500/15' : isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-1">T1 · Charging</div>
            <p className={`text-xs ${subText}`}>
              Rectifier output is rising. Capacitor charges <strong>quickly</strong> through the
              low diode resistance, almost reaching peak Vm.
            </p>
          </div>
          <div className={`p-4 rounded-xl border-2 ${!isCharging ? 'border-amber-400 bg-amber-500/15' : isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-1">T2 · Discharging</div>
            <p className={`text-xs ${subText}`}>
              Rectifier output drops. Capacitor <strong>slowly</strong> drains through the load
              R_L, holding the voltage up until the next pulse arrives.
            </p>
          </div>
        </div>
      </motion.div>

      {/* WAVEFORM COMPARISON */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-5 md:p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-4">
          Before vs After · the filtered output
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-2">Before filter (full-wave only)</div>
            <svg viewBox="0 0 400 200" className="w-full h-auto">
              <line x1="20" y1="160" x2="380" y2="160" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="180" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
              <g transform="translate(40, 20)">
                <path d={buildFullWave(340, 140)} stroke="#a78bfa" strokeWidth="2.5" fill="none" />
                <path d={`${buildFullWave(340, 140)} L 340 70 L 0 70 Z`} fill="#a78bfa" opacity="0.15" />
                <line x1="0" y1="40" x2="340" y2="40" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" />
                <text x="280" y="34" fontSize="10" fontFamily="monospace" fill="#fbbf24">V_dc</text>
              </g>
              <text x="200" y="195" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#a78bfa" fontWeight="bold">
                ripple = 48%
              </text>
            </svg>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">After capacitor filter</div>
            <svg viewBox="0 0 400 200" className="w-full h-auto">
              <line x1="20" y1="160" x2="380" y2="160" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="180" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
              <g transform="translate(40, 20)">
                {/* Faint full-wave under */}
                <path d={buildFullWave(340, 140)} stroke="#475569" strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="3 3" />
                {/* Sawtooth filtered */}
                <path d={buildFilteredOutput(340, 140, 0.15)} stroke="#22c55e" strokeWidth="3" fill="none"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(34,197,94,0.5))' }} />
                <text x="240" y="20" fontSize="10" fontFamily="monospace" fill="#22c55e">near-flat DC</text>
                {/* Ripple amplitude marker */}
                <line x1="320" y1="30" x2="320" y2="50" stroke="#fbbf24" strokeWidth="1.5" />
                <text x="328" y="42" fontSize="9" fontFamily="monospace" fill="#fbbf24">V_r(p-p)</text>
              </g>
              <text x="200" y="195" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#22c55e" fontWeight="bold">
                ripple ≪ 5% with proper C
              </text>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* MATH OF FILTER */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-5 md:p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <Battery className="text-amber-400" size={20} />
          <h3 className={`text-xl font-black ${textColor}`}>Filtering · the math</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-5 border-2 border-amber-400/40 bg-amber-500/10">
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">DC voltage with filter</div>
            <div className={`font-mono text-xl font-black ${textColor}`}>V_dc = V_m − (4.17 · I_dc / C)</div>
            <p className={`text-xs ${subText} mt-2`}>Bigger C ⇒ bigger tank ⇒ closer to Vm.</p>
          </div>
          <div className="rounded-2xl p-5 border-2 border-amber-400/40 bg-amber-500/10">
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Ripple factor</div>
            <div className={`font-mono text-xl font-black ${textColor}`}>r = (2.4 · I_dc) / (C · V_dc) × 100%</div>
            <p className={`text-xs ${subText} mt-2`}>Drop r by enlarging C or reducing load current.</p>
          </div>
        </div>
        <div className={`mt-4 p-4 rounded-xl border-2 border-emerald-400/40 bg-emerald-500/10 flex items-start gap-3`}>
          <ArrowDown className="text-emerald-300 mt-0.5 shrink-0" size={16} />
          <p className={`text-sm ${textColor}`}>
            <strong className="text-emerald-300">Insight:</strong> a larger capacitor (bigger tank)
            or a smaller load current (slower drain) reduces the ripple. That is the entire
            engineering trade-off for power supply design.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
