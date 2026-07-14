import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Table, Sigma, Grid3x3, Cpu, ArrowRight, PlayCircle } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const PIPELINE = [
  { Icon: Table,    title: 'Define Rules',   sub: 'Truth table',    accent: '#fb923c' },
  { Icon: Sigma,    title: 'Extract Math',   sub: 'Canonical SOP',  accent: '#fbbf24' },
  { Icon: Grid3x3,  title: 'Optimise',       sub: 'Karnaugh Map',   accent: '#a78bfa' },
  { Icon: Cpu,      title: 'Build Hardware', sub: 'Wire the gates', accent: '#fb7185' },
];

// Animated wire pulse that travels along an SVG line
const WirePulse: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string; delay: number }> = ({ x1, y1, x2, y2, color, delay }) => (
  <motion.circle
    initial={{ cx: x1, cy: y1, opacity: 0 }}
    animate={{ cx: x2, cy: y2, opacity: [0, 1, 1, 0] }}
    transition={{ duration: 1.6, delay, repeat: Infinity, repeatDelay: 0.4, ease: 'easeInOut' }}
    r={4}
    fill={color}
    style={{ filter: `drop-shadow(0 0 6px ${color})` }}
  />
);

export const S00_Cover: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  // cycle through input combinations to animate F = A + BC live
  const [demo, setDemo] = useState({ a: 0, b: 1, c: 1 });
  useEffect(() => {
    if (!isActive) return;
    const seq = [
      { a: 0, b: 0, c: 0 },
      { a: 0, b: 0, c: 1 },
      { a: 0, b: 1, c: 1 },
      { a: 1, b: 0, c: 0 },
      { a: 1, b: 1, c: 1 },
    ];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % seq.length;
      setDemo(seq[i]);
    }, 1500);
    return () => clearInterval(t);
  }, [isActive]);

  const bc = (demo.b === 1 && demo.c === 1) ? 1 : 0;
  const f  = (demo.a === 1 || bc === 1) ? 1 : 0;

  const wireC = (v: number) => v === 1 ? '#fbbf24' : '#3b4659';
  const glow  = (v: number) => v === 1 ? 'drop-shadow(0 0 6px rgba(251,191,36,0.85))' : 'none';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <motion.section
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-6"
      >
        <h1 className={`text-5xl md:text-7xl font-black ${textColor} tracking-tight leading-[0.95]`}>
          From Truth<br />
          <span className="text-sky-400">to Hardware.</span>
        </h1>
        <p className={`text-xl ${subText} max-w-3xl`}>
          One Boolean specification. Four stages. A working schematic at the end. We will design
          a Server Vault unlock circuit from scratch - no shortcuts, every choice visible.
        </p>
      </motion.section>

      {/* HERO · live animated F = A + BC schematic with cycling inputs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.15 }}
        className={`rounded-3xl border ${cardBg} p-8 relative overflow-hidden`}
        style={{
          background: isDarkMode
            ? 'radial-gradient(circle at 30% 20%, rgba(14,165,233,0.10), rgba(167,139,250,0.06) 60%, transparent 100%)'
            : 'radial-gradient(circle at 30% 20%, rgba(14,165,233,0.08), rgba(167,139,250,0.05) 60%, transparent 100%)',
        }}
      >
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest border flex items-center gap-2 ${
          isDarkMode ? 'bg-black/30 border-sky-400/30 text-sky-300' : 'bg-sky-50 border-sky-300 text-sky-700'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" /> Live demo · cycling inputs
        </div>

        <svg viewBox="0 0 760 250" className="w-full h-auto">
          {/* Equation overlay */}
          <text x="290" y="32" fontSize="22" fontFamily="monospace" fontWeight="bold"
                fill={isDarkMode ? '#fff' : '#0f172a'}>F = A + B·C</text>

          {/* Input labels */}
          <g fontFamily="monospace" fontSize="14" fontWeight="bold">
            <text x="10"  y="80"  fill="#fb923c">A = {demo.a}</text>
            <text x="10"  y="160" fill="#22d3ee">B = {demo.b}</text>
            <text x="10"  y="200" fill="#f59e0b">C = {demo.c}</text>
          </g>

          {/* A line */}
          <line x1="60" y1="76" x2="500" y2="100" stroke={wireC(demo.a)} strokeWidth="2.5" style={{ filter: glow(demo.a) }} />
          {demo.a === 1 && <WirePulse x1={60} y1={76} x2={500} y2={100} color="#fbbf24" delay={0} />}

          {/* B and C lines into AND */}
          <line x1="60" y1="156" x2="240" y2="170" stroke={wireC(demo.b)} strokeWidth="2.5" style={{ filter: glow(demo.b) }} />
          {demo.b === 1 && <WirePulse x1={60} y1={156} x2={240} y2={170} color="#fbbf24" delay={0.1} />}
          <line x1="60" y1="196" x2="240" y2="210" stroke={wireC(demo.c)} strokeWidth="2.5" style={{ filter: glow(demo.c) }} />
          {demo.c === 1 && <WirePulse x1={60} y1={196} x2={240} y2={210} color="#fbbf24" delay={0.2} />}

          {/* AND gate */}
          <path d="M 240 160 L 280 160 A 25 25 0 0 1 280 220 L 240 220 Z"
                fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke="#fcd34d" strokeWidth="2.5" />
          <text x="247" y="195" fontSize="11" fontFamily="monospace" fill="#fcd34d">AND</text>

          {/* AND output */}
          <line x1="305" y1="190" x2="500" y2="170" stroke={wireC(bc)} strokeWidth="2.5" style={{ filter: glow(bc) }} />
          {bc === 1 && <WirePulse x1={305} y1={190} x2={500} y2={170} color="#fbbf24" delay={0.5} />}
          <text x="320" y="160" fontSize="11" fontFamily="monospace" fontWeight="bold" fill="#a78bfa">B·C = {bc}</text>

          {/* OR gate */}
          <path d="M 500 80 Q 525 135 500 200 Q 580 188 615 135 Q 580 92 500 80 Z"
                fill={isDarkMode ? '#0a0e1a' : '#fff'} stroke="#22c55e" strokeWidth="2.5" />
          <text x="525" y="142" fontSize="13" fontFamily="monospace" fontWeight="bold" fill="#22c55e">OR</text>

          {/* Output */}
          <line x1="615" y1="135" x2="730" y2="135" stroke={wireC(f)} strokeWidth="3.5" style={{ filter: glow(f) }} />
          {f === 1 && <WirePulse x1={615} y1={135} x2={730} y2={135} color="#fbbf24" delay={0.9} />}
          <motion.rect
            x="660" y="115" width="60" height="42" rx="6"
            initial={false}
            animate={{
              fill: f === 1 ? '#22c55e' : (isDarkMode ? '#0a0e1a' : '#fff'),
              filter: f === 1 ? 'drop-shadow(0 0 18px rgba(34,197,94,0.85))' : 'none',
            }}
            stroke="#22c55e" strokeWidth="2.5"
          />
          <text x="670" y="142" fontSize="20" fontFamily="monospace" fontWeight="bold"
                fill={f === 1 ? '#000' : '#22c55e'}>F={f}</text>
        </svg>
        <div className={`text-center mt-3 text-xs font-mono uppercase tracking-[0.3em] ${subText}`}>
          The destination · what we will build by Step 5
        </div>
      </motion.div>

      {/* Pipeline strip - animated */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400 mb-5 flex items-center gap-2">
          <PlayCircle size={12} /> The four-stage pipeline · in order, every time
        </div>
        <div className="grid lg:grid-cols-[repeat(4,1fr_auto)_1fr] gap-3 items-stretch">
          {PIPELINE.map((s, i) => (
            <React.Fragment key={s.title}>
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.92 }} animate={isActive ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.4 + 0.1 * i, type: 'spring', stiffness: 200 }}
                className="rounded-2xl p-5 border-2 flex flex-col gap-2 relative overflow-hidden group"
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
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.4 }}
                  >
                    <s.Icon size={18} style={{ color: s.accent }} />
                  </motion.div>
                </div>
                <h3 className={`text-base font-black ${textColor} relative z-10`}>{s.title}</h3>
                <p className={`text-xs font-mono ${subText} relative z-10`}>{s.sub}</p>
              </motion.div>
              {i < PIPELINE.length - 1 && (
                <div className="hidden lg:flex items-center justify-center px-1">
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <ArrowRight className="opacity-40" size={18} />
                  </motion.div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.9 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText} flex items-center justify-center gap-2`}
      >
        Press <kbd className={`px-2 py-1 rounded border ${isDarkMode ? 'border-white/20 bg-white/5' : 'border-slate-300 bg-slate-100'} font-mono`}>→</kbd> to start with the video
      </motion.div>
    </div>
  );
};
