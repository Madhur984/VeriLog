import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S05_HalfWave: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  // Animate phase to scrub a marker across waveforms
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    const t = setInterval(() => setPhase((p) => (p + 0.025) % 1), 30);
    return () => clearInterval(t);
  }, [isActive]);

  const isForward = phase < 0.5;

  // Build sine and half-wave paths
  const buildSine = (w: number, h: number, cycles = 2, amp = 0.85) => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = (i / 200) * w;
      const t = (i / 200) * cycles * 2 * Math.PI;
      const y = h / 2 - Math.sin(t) * (h / 2) * amp;
      pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  };
  const buildHalfWave = (w: number, h: number, cycles = 2, amp = 0.85) => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = (i / 200) * w;
      const t = (i / 200) * cycles * 2 * Math.PI;
      const s = Math.sin(t);
      const y = s > 0 ? (h / 2 - s * (h / 2) * amp) : (h / 2);
      pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <Activity size={14} /> Step 4 · Half-Wave Rectifier
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>One diode, one direction, half the energy.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Drop a single diode in series with the load. The forward half of the wave passes
          through. The negative half hits a closed valve and is wasted. Result: half of every
          cycle is thrown away.
        </p>
      </section>

      {/* Topic banner */}
      <div className="rounded-2xl border-2 border-cyan-400/40 bg-cyan-500/10 p-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-200 border border-cyan-400/55">
          Topic
        </span>
        <span className={`font-mono text-sm font-black ${textColor}`}>
          Half-wave rectification · 1 diode in series with the load
        </span>
        <span className="ml-auto font-mono text-[11px] text-cyan-200">
          Output frequency = input frequency (50 Hz in, 50 Hz out)
        </span>
      </div>

      {/* Circuit diagram */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-4">
          Circuit · 1 diode · 1 resistor (load)
        </div>
        <svg viewBox="0 0 760 240" className="w-full h-auto">
          {/* AC source on the left (circle with sine inside) */}
          <circle cx="80" cy="120" r="40" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />
          <text x="65" y="98" fontSize="11" fontFamily="monospace" fill="#0ea5e9" fontWeight="bold">~</text>
          <path d={`M 60 120 Q 70 ${110 - (isForward ? 8 : -8)} 80 120 T 100 120`} stroke="#0ea5e9" strokeWidth="2" fill="none" />
          <text x="35" y="180" fontSize="11" fontFamily="monospace" fill="#0ea5e9" fontWeight="bold">v_i = Vm sin(ωt)</text>

          {/* Top wire */}
          <line x1="120" y1="120" x2="200" y2="120" stroke={isForward ? '#fbbf24' : '#475569'} strokeWidth="3"
                style={{ filter: isForward ? 'drop-shadow(0 0 4px rgba(251,191,36,0.7))' : 'none' }} />

          {/* Diode */}
          <polygon points="200,108 200,132 230,120"
                   fill={isForward ? '#fbbf24' : 'none'} fillOpacity="0.5"
                   stroke={isForward ? '#fbbf24' : '#22d3ee'} strokeWidth="2.5" />
          <line x1="230" y1="108" x2="230" y2="132" stroke={isForward ? '#fbbf24' : '#22d3ee'} strokeWidth="2.5" />
          <text x="195" y="98" fontSize="10" fontFamily="monospace" fill="#22d3ee">D</text>

          {/* Wire to load */}
          <line x1="230" y1="120" x2="380" y2="120" stroke={isForward ? '#fbbf24' : '#475569'} strokeWidth="3"
                style={{ filter: isForward ? 'drop-shadow(0 0 4px rgba(251,191,36,0.7))' : 'none' }} />
          <line x1="380" y1="120" x2="380" y2="80" stroke={isForward ? '#fbbf24' : '#475569'} strokeWidth="3" />

          {/* Load resistor (zigzag) */}
          <path d="M 380 80 L 390 70 L 410 90 L 430 70 L 450 90 L 470 70 L 480 80"
                stroke={isForward ? '#fbbf24' : '#475569'} strokeWidth="2.5" fill="none" />
          <text x="425" y="60" fontSize="10" fontFamily="monospace" fill="#22d3ee">R_L</text>

          {/* Down to bottom wire */}
          <line x1="480" y1="80" x2="480" y2="120" stroke={isForward ? '#fbbf24' : '#475569'} strokeWidth="3" />

          {/* V_o measurement (across resistor) */}
          <line x1="380" y1="60" x2="480" y2="60" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="415" y="50" fontSize="11" fontFamily="monospace" fill="#22c55e" fontWeight="bold">V_o</text>

          {/* Bottom return wire */}
          <line x1="480" y1="120" x2="80" y2="120" stroke={isDarkMode ? '#1e293b' : '#94a3b8'} strokeWidth="2" opacity="0.5" />
          <line x1="80" y1="120" x2="80" y2="160" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="2" />

          {/* Status badge */}
          <rect x="540" y="70" width="200" height="60" rx="10"
                fill={isForward ? 'rgba(251,191,36,0.2)' : 'rgba(244,63,94,0.15)'}
                stroke={isForward ? '#fbbf24' : '#f43f5e'} strokeWidth="2" />
          <text x="640" y="92" textAnchor="middle" fontSize="11" fontFamily="monospace"
                fill={isForward ? '#fbbf24' : '#f43f5e'} fontWeight="bold">
            {isForward ? 'POSITIVE half · valve OPEN' : 'NEGATIVE half · valve SHUT'}
          </text>
          <text x="640" y="112" textAnchor="middle" fontSize="11" fontFamily="monospace"
                fill={isForward ? '#22c55e' : '#f43f5e'} fontWeight="bold">
            {isForward ? 'current → load' : 'no flow · 50% wasted'}
          </text>
        </svg>
      </motion.div>

      {/* Side-by-side waveforms */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-4">
          Input v_i  →  Output v_o · live scrubber
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {/* Input waveform */}
          <div>
            <div className={`font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-2`}>Input · v_i (AC)</div>
            <svg viewBox="0 0 400 200" className="w-full h-auto">
              <line x1="20" y1="100" x2="380" y2="100" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="180" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
              <text x="6" y="30"  fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>+Vm</text>
              <text x="6" y="180" fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>−Vm</text>
              <text x="370" y="115" fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>t</text>
              <g transform="translate(40, 20)">
                <path d={buildSine(340, 160)} stroke="#f43f5e" strokeWidth="2.5" fill="none"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(244,63,94,0.5))' }} />
                {/* Phase marker */}
                <motion.circle cx={phase * 340} cy={80 - Math.sin(phase * 4 * Math.PI) * 80 * 0.85} r="6" fill="#fff" />
              </g>
            </svg>
          </div>

          {/* Output waveform */}
          <div>
            <div className={`font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2`}>Output · v_o (rectified)</div>
            <svg viewBox="0 0 400 200" className="w-full h-auto">
              <line x1="20" y1="100" x2="380" y2="100" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="180" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
              <text x="6" y="30"  fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>+Vm</text>
              <text x="370" y="115" fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>t</text>
              <g transform="translate(40, 20)">
                {/* Half-wave path */}
                <path d={buildHalfWave(340, 160)} stroke="#22c55e" strokeWidth="2.5" fill="none"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(34,197,94,0.5))' }} />
                {/* Filled positive humps to emphasize "kept" energy */}
                <path d={`${buildHalfWave(340, 160)} L 340 80 L 0 80 Z`}
                      fill="#22c55e" opacity="0.15" stroke="none" />
                {/* Phase marker on the half-wave */}
                <motion.circle
                  cx={phase * 340}
                  cy={isForward ? 80 - Math.sin(phase * 4 * Math.PI) * 80 * 0.85 : 80}
                  r="6"
                  fill="#fff"
                />
                {/* "WASTED" label on negative parts */}
                <text x="170" y="140" fontSize="11" fontFamily="monospace" fill="#f43f5e" fontWeight="bold">
                  wasted half
                </text>
              </g>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Result panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border-2 border-rose-400/40 bg-rose-500/10`}
      >
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="text-rose-300" size={20} />
          <h3 className={`text-xl font-black ${textColor}`}>The result · 50% energy thrown away</h3>
        </div>
        <p className={`text-sm ${subText} mb-3`}>
          Exactly half of every input cycle hits the closed valve and is wasted as heat or simply
          dissipated. We have unidirectional flow — but the efficiency is poor and the output is
          full of holes.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { l: 'Input direction', v: 'Bidirectional' },
            { l: 'Output direction', v: 'Forward only' },
            { l: 'Energy used', v: '50% wasted' },
          ].map((c) => (
            <div key={c.l} className={`p-3 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="font-mono text-[9px] uppercase tracking-widest text-rose-300">{c.l}</div>
              <div className={`text-base font-mono font-black ${textColor} mt-1`}>{c.v}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
