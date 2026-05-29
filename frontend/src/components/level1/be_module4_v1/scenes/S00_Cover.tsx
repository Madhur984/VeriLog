import React from 'react';
import { motion } from 'framer-motion';
import { Waves, Activity, Battery, Zap, ArrowRight, Cpu } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const STAGES = [
  {
    Icon: Waves,
    title: '1 · AC Mains',
    sub: '230 V · 50 Hz · sine wave that swings + and −',
    detail: 'Wall socket. Reverses direction 100×/sec.',
    accent: '#0ea5e9',
  },
  {
    Icon: Activity,
    title: '2 · Rectifier',
    sub: '1 or 4 diodes · forces unidirectional flow',
    detail: 'Half-wave (1 diode, sloppy) or bridge (4 diodes, efficient).',
    accent: '#22d3ee',
  },
  {
    Icon: Battery,
    title: '3 · Filter',
    sub: 'Capacitor across the load · smooths the pulses',
    detail: 'Charges on peaks, discharges in valleys. Output near-flat DC.',
    accent: '#fbbf24',
  },
  {
    Icon: Zap,
    title: '4 · DC Output',
    sub: 'Constant voltage that feeds your circuit',
    detail: 'Vdc with small ripple · ready for any IC.',
    accent: '#22c55e',
  },
];

const TOPICS = [
  { name: 'Diode',                 page: 'diode',     accent: '#0891b2' },
  { name: 'Half-Wave Rectifier',    page: 'halfwave', accent: '#fb923c' },
  { name: 'Vdc · Ripple Math',      page: 'halfmath', accent: '#fbbf24' },
  { name: 'Bridge Rectifier',       page: 'fullwave', accent: '#a78bfa' },
  { name: 'Capacitor Filter',       page: 'filter',   accent: '#22c55e' },
  { name: 'Comparison · Recap',     page: 'showdown', accent: '#10b981' },
];

export const S00_Cover: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  // Build sine-then-rectified-then-filtered path for the hero animation
  const sinePts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const x = (i / 60) * 200;
    const y = 60 - Math.sin((i / 60) * 4 * Math.PI) * 38;
    sinePts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const fwPts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const x = (i / 60) * 180;
    const y = 60 - Math.abs(Math.sin((i / 60) * 4 * Math.PI)) * 38;
    fwPts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <motion.section
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-5"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <Waves size={14} /> Module 04 · Rectifiers &amp; Filters
        </div>
        <h1 className={`text-5xl md:text-7xl font-black ${textColor} tracking-tight leading-[0.95]`}>
          Rectifiers<br />
          <span className="text-cyan-400">&amp; Filters.</span>
        </h1>
        <p className={`text-xl ${subText} max-w-3xl`}>
          The journey from a violent AC sine wave at the wall socket to the smooth DC line that powers
          every chip in your phone. Two pieces of hardware do all the work - a <strong className="text-cyan-300">rectifier</strong> made of
          diodes, and a <strong className="text-amber-300">filter</strong> made of a capacitor. Master both and you can build any
          power supply.
        </p>
      </motion.section>

      {/* HERO · the full pipeline visualised */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.15 }}
        className={`rounded-3xl border ${cardBg} p-8 relative overflow-hidden`}
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(14,165,233,0.10), rgba(34,197,94,0.06) 60%)'
            : 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(34,197,94,0.05) 60%)',
        }}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300 mb-4">
          The pipeline · 4 visible signals
        </div>
        <svg viewBox="0 0 880 220" className="w-full h-auto">
          {/* Stage 1 · AC sine */}
          <text x="20" y="32" fontSize="11" fontFamily="monospace" fill="#0ea5e9" fontWeight="bold">AC mains · sine wave</text>
          <line x1="20" y1="60" x2="220" y2="60" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" strokeDasharray="3 3" />
          <motion.path d={sinePts.join(' ')} stroke="#0ea5e9" strokeWidth="3" fill="none"
            transform="translate(20, 0)"
            style={{ filter: 'drop-shadow(0 0 6px rgba(14,165,233,0.5))' }}
            animate={{ x: [-4, 4, -4] }}
            transition={{ duration: 1, repeat: Infinity }}
          />

          {/* Arrow + label · diodes */}
          <line x1="240" y1="60" x2="270" y2="60" stroke="#22d3ee" strokeWidth="2" />
          <polygon points="265,55 275,60 265,65" fill="#22d3ee" />
          <text x="240" y="92" fontSize="10" fontFamily="monospace" fill="#22d3ee" fontWeight="bold">Rectifier</text>
          <text x="240" y="106" fontSize="9" fontFamily="monospace" fill="#22d3ee">(diodes)</text>

          {/* Stage 2 · Full-wave rectified */}
          <text x="290" y="32" fontSize="11" fontFamily="monospace" fill="#a78bfa" fontWeight="bold">Pulsing DC · still bumpy</text>
          <line x1="290" y1="60" x2="490" y2="60" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" strokeDasharray="3 3" />
          <path d={fwPts.join(' ')} stroke="#a78bfa" strokeWidth="3" fill="none"
            transform="translate(290, 0)"
            style={{ filter: 'drop-shadow(0 0 6px rgba(167,139,250,0.5))' }}
          />
          <path d={`${fwPts.join(' ')} L 180 60 L 0 60 Z`} fill="#a78bfa" opacity="0.18" transform="translate(290, 0)" />

          {/* Arrow + label · capacitor */}
          <line x1="500" y1="60" x2="540" y2="60" stroke="#fbbf24" strokeWidth="2" />
          <polygon points="535,55 545,60 535,65" fill="#fbbf24" />
          <text x="500" y="92" fontSize="10" fontFamily="monospace" fill="#fbbf24" fontWeight="bold">Filter</text>
          <text x="500" y="106" fontSize="9" fontFamily="monospace" fill="#fbbf24">(capacitor)</text>

          {/* Stage 3 · Smooth DC */}
          <text x="560" y="32" fontSize="11" fontFamily="monospace" fill="#22c55e" fontWeight="bold">Smooth DC · with tiny ripple</text>
          <line x1="560" y1="60" x2="760" y2="60" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" strokeDasharray="3 3" />
          <motion.line
            x1="560" y1="32" x2="760" y2="32"
            stroke="#22c55e" strokeWidth="3"
            style={{ filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.6))' }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          {/* tiny sawtooth ripple */}
          <path d="M 560 32 L 580 30 L 580 32 L 600 30 L 600 32 L 620 30 L 620 32 L 640 30 L 640 32 L 660 30 L 660 32 L 680 30 L 680 32 L 700 30 L 700 32 L 720 30 L 720 32 L 740 30 L 740 32 L 760 30 L 760 32"
                stroke="#22c55e" strokeWidth="1" fill="none" opacity="0.45" />

          {/* Arrow into chip */}
          <line x1="780" y1="32" x2="810" y2="32" stroke="#22c55e" strokeWidth="2" />
          <polygon points="805,27 815,32 805,37" fill="#22c55e" />

          {/* Tiny chip icon */}
          <g transform="translate(820, 14)">
            <rect x="0" y="0" width="40" height="36" rx="4" fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke="#22c55e" strokeWidth="1.5" />
            <line x1="-4" y1="10" x2="0" y2="10" stroke="#22c55e" strokeWidth="1.5" />
            <line x1="-4" y1="20" x2="0" y2="20" stroke="#22c55e" strokeWidth="1.5" />
            <line x1="40" y1="10" x2="44" y2="10" stroke="#22c55e" strokeWidth="1.5" />
            <line x1="40" y1="20" x2="44" y2="20" stroke="#22c55e" strokeWidth="1.5" />
            <text x="20" y="22" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#22c55e" fontWeight="bold">IC</text>
          </g>
          <text x="816" y="68" fontSize="9" fontFamily="monospace" fill="#22c55e">load</text>

          {/* Equation footer */}
          <text x="440" y="190" textAnchor="middle" fontSize="14" fontFamily="monospace" fontWeight="bold"
                fill={isDarkMode ? '#fff' : '#0f172a'}>
            AC waveform &nbsp;→&nbsp; Rectifier &nbsp;→&nbsp; Filter &nbsp;→&nbsp; Smooth DC
          </text>
          <text x="440" y="208" textAnchor="middle" fontSize="11" fontFamily="monospace"
                fill={isDarkMode ? '#94a3b8' : '#64748b'}>
            Two stages. Two components. The whole module in one diagram.
          </text>
        </svg>
      </motion.div>

      {/* STAGES preview · 4 cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400 mb-5">
          The journey · 4 stages of the signal
        </div>
        <div className="grid lg:grid-cols-[repeat(4,1fr_auto)_1fr] gap-3 items-stretch">
          {STAGES.map((s, i) => (
            <React.Fragment key={s.title}>
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.92 }} animate={isActive ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.4 + 0.1 * i, type: 'spring', stiffness: 200 }}
                className="rounded-2xl p-5 border-2 flex flex-col gap-2 relative overflow-hidden"
                style={{ borderColor: `${s.accent}55`, background: `${s.accent}11` }}
              >
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 100%, ${s.accent}22, transparent 70%)` }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                />
                <div className="flex items-center justify-between relative z-10">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: s.accent }}>
                    Stage {i + 1}
                  </span>
                  <s.Icon size={18} style={{ color: s.accent }} />
                </div>
                <h3 className={`text-base font-black ${textColor} relative z-10`}>{s.title}</h3>
                <p className={`text-[11px] font-mono ${subText} relative z-10`}>{s.sub}</p>
                <p className={`text-[10px] ${subText} mt-1 relative z-10 leading-snug`}>{s.detail}</p>
              </motion.div>
              {i < STAGES.length - 1 && (
                <div className="hidden lg:flex items-center justify-center px-1">
                  <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}>
                    <ArrowRight className="opacity-40" size={18} />
                  </motion.div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* TOPIC INDEX */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300 mb-5">
          <Cpu size={12} /> Topic index · 6 concepts you will master
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOPICS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 8 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55 + i * 0.05 }}
              className="rounded-2xl p-4 border-2 flex items-center gap-3"
              style={{ borderColor: `${t.accent}55`, background: `${t.accent}10` }}
            >
              <div
                className="w-8 h-8 rounded-md grid place-items-center font-mono font-black text-xs"
                style={{ background: `${t.accent}30`, color: t.accent }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-bold ${textColor}`}>{t.name}</div>
                <div className="text-[9px] font-mono uppercase tracking-widest opacity-60" style={{ color: t.accent }}>
                  /{t.page}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.9 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText}`}
      >
        Press → to start with the bilingual video lecture
      </motion.div>
    </div>
  );
};
