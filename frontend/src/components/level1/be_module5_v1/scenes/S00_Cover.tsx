import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Sun as SunIcon, Aperture, ArrowRight, Cpu, Baby } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const VIPS = [
  {
    Icon: Shield,
    title: 'Zener Diode',
    role: 'The Voltage Bodyguard',
    desc: 'Operates in reverse breakdown. Holds output voltage rock-solid even when the load drinks unevenly.',
    bias: 'REVERSE BIAS',
    accent: '#ef4444',
  },
  {
    Icon: SunIcon,
    title: 'Light-Emitting Diode',
    role: 'The Diwali Sparkler',
    desc: 'Forward-biased. Electrons and holes recombine across the band gap and emit a photon — colour set by the material.',
    bias: 'FORWARD BIAS',
    accent: '#fbbf24',
  },
  {
    Icon: Aperture,
    title: 'Photodiode',
    role: 'The Paparazzi Camera',
    desc: 'Reverse-biased detector. Incoming photons knock loose minority carriers and a tiny reverse current flows.',
    bias: 'REVERSE BIAS',
    accent: '#a78bfa',
  },
];

const TOPICS = [
  { name: 'Baseline vs Specialists',  page: 'baseline',  accent: '#22d3ee' },
  { name: 'Zener V-I & Breakdown',    page: 'zener-vi',  accent: '#ef4444' },
  { name: 'Voltage Regulator',        page: 'zener-reg', accent: '#f87171' },
  { name: 'Electroluminescence',      page: 'led-el',    accent: '#fbbf24' },
  { name: 'Spectrum & Material',      page: 'led-spec',  accent: '#fb923c' },
  { name: 'Reverse-Bias Photodiode',  page: 'photo-ckt', accent: '#a78bfa' },
  { name: 'I-V vs Illumination',      page: 'photo-resp',accent: '#22c55e' },
  { name: 'Diagnostic Matrix',        page: 'matrix',    accent: '#e879f9' },
];

export const S00_Cover: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <motion.section
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-5"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-yellow-300">
          <Sparkles size={14} /> Module 05 · The Neon Diode Gala
        </div>
        <h1 className={`text-5xl md:text-7xl font-black ${textColor} tracking-tight leading-[0.95]`}>
          Special-purpose<br />
          <span className="text-yellow-300">diodes.</span>
        </h1>
        <p className={`text-xl ${subText} max-w-3xl`}>
          The normal P-N diode is a one-way valve — boring. But push that valve to its limits and
          you unlock three <strong className="text-yellow-300">VIP behaviours</strong> the industry
          can&apos;t live without:
          <strong className="text-rose-300"> voltage regulation</strong>,
          <strong className="text-amber-300"> light emission</strong>, and
          <strong className="text-violet-300"> light detection</strong>.
        </p>

        {/* Like you're 5 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.18 }}
          className="rounded-3xl p-6 border-2 relative overflow-hidden"
          style={{ borderColor: '#facc1555', background: 'linear-gradient(135deg, rgba(250,204,21,0.10), rgba(251,113,133,0.08))' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full grid place-items-center" style={{ background: '#facc1530' }}>
              <Baby size={18} className="text-yellow-300" />
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-yellow-300 font-black">Like you&apos;re 5</div>
          </div>
          <p className={`text-base ${subText} leading-relaxed`}>
            Imagine three little superhero toys from the same family. <strong className="text-rose-300">Zener</strong> is
            a tiny <em>bouncer</em> who keeps electricity from getting too &ldquo;tall.&rdquo;{' '}
            <strong className="text-amber-300">LED</strong> is a tiny <em>light bulb pet</em> — feed it electricity and it
            glows. <strong className="text-violet-300">Photodiode</strong> is a tiny <em>eye</em> that can &ldquo;feel&rdquo; how
            bright the room is. Same toy family. Three different jobs.
          </p>
        </motion.div>

        {/* Plain English + Prereq */}
        <div className="grid md:grid-cols-2 gap-3 pt-2">
          <div className={`rounded-2xl p-4 border-2 border-yellow-300/30 bg-yellow-300/5 ${subText}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-yellow-300 mb-1">In one sentence</div>
            <div className="text-sm">
              Take a regular diode, push it past its safe zone, and you can either hold a fixed voltage,
              emit light, or measure light — three different superpowers, same silicon family.
            </div>
          </div>
          <div className={`rounded-2xl p-4 border-2 border-cyan-300/30 bg-cyan-300/5 ${subText}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 mb-1">Before you start</div>
            <div className="text-sm">
              You should be comfortable with the normal P-N junction (<span className="font-mono">be/3</span>) —
              forward/reverse bias, depletion zone, V-I curve. If not, that&apos;s a 10-minute prereq.
            </div>
          </div>
        </div>
      </motion.section>

      {/* HERO · three VIPs in one frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.15 }}
        className={`rounded-3xl border ${cardBg} p-10 relative overflow-hidden`}
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(239,68,68,0.10), rgba(251,191,36,0.08) 45%, rgba(168,85,247,0.10) 85%)'
            : 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(251,191,36,0.06) 45%, rgba(168,85,247,0.08) 85%)',
        }}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-300 mb-6">
          Tonight&apos;s guest list · three roles, one circuit element
        </div>

        {/* Big SVG showing the three diode symbols on a shared rail */}
        <svg viewBox="0 0 800 220" className="w-full h-auto">
          <defs>
            <linearGradient id="rail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <radialGradient id="ledGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="rgba(251,191,36,0.7)" />
              <stop offset="100%" stopColor="rgba(251,191,36,0)" />
            </radialGradient>
          </defs>

          {/* Stage 1: Zener — triangle + Z-shaped cathode bar */}
          <g transform="translate(80, 110)">
            {/* Anode lead */}
            <line x1="-26" y1="0" x2="0" y2="0" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            {/* Triangle (arrow) */}
            <polygon points="0,-20 30,0 0,20" fill="rgba(239,68,68,0.22)" stroke="#ef4444" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Z-shaped cathode: top tick goes LEFT (back toward anode), bottom tick goes RIGHT */}
            <path d="M 22 -22 L 30 -22 L 30 22 L 38 22" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Cathode lead */}
            <line x1="30" y1="0" x2="56" y2="0" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />

            <text x="15" y="-40" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="#ef4444" fontWeight="bold">ZENER</text>
            <text x="15" y="50" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#ef4444">Reverse bias</text>
            <text x="15" y="63" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#ef4444">V_Z constant</text>
          </g>

          {/* Stage 2: LED */}
          <g transform="translate(400, 110)">
            <motion.circle cx="15" cy="0" r="40" fill="url(#ledGlow)"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity }} />
            <polygon points="0,-20 30,0 0,20" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" strokeWidth="2.5" />
            <line x1="30" y1="-22" x2="30" y2="22" stroke="#fbbf24" strokeWidth="3" />
            {/* photon arrows */}
            <g stroke="#fbbf24" strokeWidth="2" fill="none">
              <path d="M -8 -30 L -20 -42" />
              <path d="M -22 -42 L -19 -42 L -20 -39 Z" fill="#fbbf24" />
              <path d="M 20 -28 L 28 -44" />
              <path d="M 27 -45 L 30 -42 L 30 -45 Z" fill="#fbbf24" />
              <path d="M -2 30 L -14 44" />
              <path d="M -16 44 L -13 43 L -13 46 Z" fill="#fbbf24" />
            </g>
            <text x="15" y="-58" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="#fbbf24" fontWeight="bold">LED</text>
            <text x="15" y="50" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fbbf24">Forward bias</text>
            <text x="15" y="63" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fbbf24">Photon emit</text>
          </g>

          {/* Stage 3: Photodiode */}
          <g transform="translate(680, 110)">
            {/* incoming light arrows */}
            <g stroke="#a78bfa" strokeWidth="2" fill="none">
              <path d="M -16 -42 L -8 -28" />
              <path d="M -9 -30 L -6 -28 L -7 -31 Z" fill="#a78bfa" />
              <path d="M 4 -46 L 12 -28" />
              <path d="M 11 -30 L 14 -28 L 13 -31 Z" fill="#a78bfa" />
              <path d="M 24 -42 L 22 -26" />
              <path d="M 21 -28 L 23 -25 L 25 -28 Z" fill="#a78bfa" />
            </g>
            <polygon points="0,-20 30,0 0,20" fill="rgba(168,85,247,0.18)" stroke="#a78bfa" strokeWidth="2.5" />
            <line x1="30" y1="-22" x2="30" y2="22" stroke="#a78bfa" strokeWidth="3" />
            <text x="15" y="-58" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="#a78bfa" fontWeight="bold">PHOTODIODE</text>
            <text x="15" y="50" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#a78bfa">Reverse bias</text>
            <text x="15" y="63" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#a78bfa">Light → I</text>
          </g>

          {/* Connecting rail */}
          <line x1="40" y1="180" x2="760" y2="180" stroke="url(#rail)" strokeWidth="2" opacity="0.6" />
          <text x="400" y="208" textAnchor="middle" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>
            One semiconductor architecture · three elite roles
          </text>
        </svg>
      </motion.div>

      {/* VIP cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-300 mb-5">
          Tonight&apos;s VIPs · meet the cast
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {VIPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={isActive ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.4 + 0.1 * i, type: 'spring', stiffness: 200 }}
              className="rounded-2xl p-6 border-2 relative overflow-hidden"
              style={{ borderColor: `${s.accent}55`, background: `${s.accent}10` }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 100%, ${s.accent}22, transparent 70%)` }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <s.Icon size={22} style={{ color: s.accent }} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: s.accent }}>
                    {s.bias}
                  </span>
                </div>
                <div>
                  <h3 className={`text-lg font-black ${textColor}`}>{s.title}</h3>
                  <div className="font-mono text-[10px] uppercase tracking-widest opacity-70" style={{ color: s.accent }}>{s.role}</div>
                </div>
                <p className={`text-sm ${subText} leading-relaxed`}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* TOPIC INDEX */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300 mb-5">
          <Cpu size={12} /> Topic index · 8 concepts you will master
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TOPICS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 8 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.65 + i * 0.04 }}
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
        Press → to start with the bilingual video lecture <ArrowRight size={12} className="inline" />
      </motion.div>
    </div>
  );
};
