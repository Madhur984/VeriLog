import { motion } from 'framer-motion';

/**
 * Glossy, NON-interactive snapshot of the platform (DSD Module 01 - Boolean
 * logic: truth table → minterm solver). Now "alive": a scanning highlight,
 * breathing status LED, flowing waveform, easing progress, typing cursor, plus
 * two layered glass cards (K-map + gate schematic) behind it for 3D depth.
 */

// Static demo state: A=1, B=0, C=1 → F = 1 (the A·B'·C minterm)
const A = 1, B = 0, C = 1;
const TT = [
  [0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 1], [0, 1, 1, 0],
  [1, 0, 0, 0], [1, 0, 1, 1], [1, 1, 0, 0], [1, 1, 1, 1],
];

const GlassCard: React.FC<{ className: string; title: string; titleColor: string; delay: number; dir: number; children: React.ReactNode }> = ({
  className, title, titleColor, delay, dir, children,
}) => (
  <motion.div
    className={`hidden sm:block absolute ${className} rounded-xl overflow-hidden`}
    style={{
      background: 'rgba(10,17,32,0.85)',
      border: '1px solid rgba(34,211,238,0.14)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,211,238,0.05)',
      backdropFilter: 'blur(4px)',
      zIndex: -1,
    }}
    animate={{ y: [0, dir * 14, 0], opacity: [0.55, 0.72, 0.55] }}
    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay }}
  >
    <div className="p-4">
      <div className="text-[8px] font-mono uppercase tracking-wider mb-2" style={{ color: titleColor }}>{title}</div>
      {children}
    </div>
  </motion.div>
);

export const ProductMockup = () => {
  return (
    <div className="relative w-full" style={{ perspective: 1400 }}>
      {/* glow behind the window */}
      <div
        className="absolute -inset-6 rounded-[2rem] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 80% at 60% 40%, rgba(34,211,238,0.18), transparent 70%)', filter: 'blur(20px)' }}
      />

      {/* Secondary layered card - K-map (upper-left, behind) */}
      <GlassCard className="-top-9 -left-10 w-44" title="Karnaugh map" titleColor="#22D3EE" delay={0.2} dir={-1}>
        <div className="grid grid-cols-4 gap-1">
          {[0, 1, 0, 0, 0, 0, 1, 1].map((v, i) => (
            <div key={i} className="aspect-square rounded flex items-center justify-center text-[9px] font-mono"
              style={{ background: v ? 'rgba(34,211,238,0.2)' : 'rgba(255,255,255,0.05)', color: v ? '#22D3EE' : '#475569' }}>
              {v}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Secondary layered card - gate schematic (lower-right, behind) */}
      <GlassCard className="-bottom-10 -right-9 w-40" title="Logic gates" titleColor="#8B5CF6" delay={0.8} dir={1}>
        <svg viewBox="0 0 90 46" className="w-full" style={{ opacity: 0.9 }}>
          <path d="M10 10 h12 a11 11 0 0 1 0 22 h-12 z" fill="none" stroke="#8B5CF6" strokeWidth="1.4" />
          <line x1="33" y1="21" x2="50" y2="21" stroke="#475569" strokeWidth="1" />
          <path d="M52 10 q12 0 18 11 q-6 11 -18 11 q5 -11 0 -22 z" fill="none" stroke="#22D3EE" strokeWidth="1.4" />
          <circle cx="74" cy="21" r="2" fill="#22D3EE" />
          <line x1="4" y1="15" x2="10" y2="15" stroke="#475569" strokeWidth="1" />
          <line x1="4" y1="27" x2="10" y2="27" stroke="#475569" strokeWidth="1" />
        </svg>
      </GlassCard>

      {/* Main window */}
      <motion.div
        initial={{ opacity: 0, y: 24, rotateY: -10 }}
        animate={{ opacity: 1, y: [0, -10, 0], rotateY: -7 }}
        transition={{
          opacity: { duration: 0.8, delay: 0.2 },
          rotateY: { duration: 0.8, delay: 0.2 },
          y: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 },
        }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: '#0A1120',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 40px 90px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,211,238,0.06)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* top sheen */}
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />

        {/* chrome */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#0D1422', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex gap-1.5">
            {['#EF4444', '#F59E0B', '#10B981'].map((c) => (
              <div key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c, opacity: 0.8 }} />
            ))}
          </div>
          {/* breathing status LED */}
          <motion.div
            className="h-2 w-2 rounded-full shrink-0"
            style={{ background: '#22D3EE' }}
            animate={{ boxShadow: ['0 0 0 rgba(34,211,238,0)', '0 0 9px rgba(34,211,238,0.8)', '0 0 0 rgba(34,211,238,0)'], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="flex-1 max-w-[200px] mx-auto rounded-md px-3 py-1 text-[10px] font-mono text-center truncate" style={{ background: '#070C16', color: '#64748B', border: '1px solid rgba(255,255,255,0.05)' }}>
            bitforbytes.in/dsd/1
          </div>
        </div>

        {/* body */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: '#22D3EE' }}>DSD · Module 01</div>
              <div className="text-sm font-bold text-white mt-0.5">Truth table → Logic</div>
            </div>
            <span className="text-[9px] font-mono px-2 py-1 rounded-md" style={{ background: 'rgba(34,211,238,0.10)', color: '#22D3EE' }}>Scene 04 / 19</span>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* inputs + flowing waveform */}
            <div className="col-span-5 space-y-2.5">
              <div className="text-[8px] font-mono uppercase tracking-wider" style={{ color: '#475569' }}>Inputs</div>
              {[['A', A], ['B', B], ['C', C]].map(([name, v]) => {
                const on = v === 1;
                return (
                  <div key={name as string} className="flex items-center justify-between px-3 py-2 rounded-lg font-mono"
                    style={{ background: on ? 'rgba(34,211,238,0.06)' : '#0D1422', border: `1px solid ${on ? 'rgba(34,211,238,0.3)' : 'rgba(255,255,255,0.07)'}` }}>
                    <span className="text-[11px] font-bold" style={{ color: on ? '#22D3EE' : '#94A3B8' }}>PIN {name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-bold" style={{ background: on ? 'rgba(34,211,238,0.12)' : 'rgba(148,163,184,0.08)', color: on ? '#22D3EE' : '#64748B' }}>
                      {on ? 'High' : 'Low'}
                    </span>
                  </div>
                );
              })}
              <svg viewBox="0 0 120 28" className="w-full mt-1">
                <defs>
                  <linearGradient id="wave-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.35" />
                    <stop offset="50%" stopColor="#22D3EE" stopOpacity="1" />
                    <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.35" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M0 22 H16 V6 H36 V22 H56 V6 H76 V22 H96 V6 H116 V22 H120"
                  fill="none" stroke="url(#wave-grad)" strokeWidth="2" strokeLinejoin="round" strokeDasharray="8 4"
                  animate={{ strokeDashoffset: [0, -12] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                />
              </svg>
            </div>

            {/* truth table with scanning highlight */}
            <div className="col-span-7">
              <div className="rounded-lg p-3" style={{ background: '#0D1422', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex justify-between text-[8px] font-mono uppercase tracking-wider pb-1.5 mb-1" style={{ color: '#475569', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="flex gap-3"><span>A</span><span>B</span><span>C</span></span>
                  <span>F</span>
                </div>
                <div className="relative space-y-0.5 font-mono text-[10px]">
                  {/* scan bar */}
                  <motion.div
                    className="absolute left-0.5 right-0.5 rounded pointer-events-none"
                    style={{ height: 20, background: 'linear-gradient(180deg, rgba(34,211,238,0.28) 0%, transparent 100%)' }}
                    animate={{ y: [0, 150], opacity: [0, 0.7, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.7 }}
                  />
                  {TT.map((row, i) => {
                    const active = row[0] === A && row[1] === B && row[2] === C;
                    const minterm = row[3] === 1;
                    if (active) {
                      return (
                        <motion.div key={i} className="flex justify-between py-0.5 px-2 rounded relative z-10"
                          style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)' }}
                          animate={{ boxShadow: ['0 0 0 rgba(34,211,238,0)', '0 0 12px rgba(34,211,238,0.45)', '0 0 0 rgba(34,211,238,0)'] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
                          <span className="flex gap-3" style={{ color: '#22D3EE' }}><span>{row[0]}</span><span>{row[1]}</span><span>{row[2]}</span></span>
                          <span style={{ color: '#22D3EE', fontWeight: 700 }}>{row[3]}</span>
                        </motion.div>
                      );
                    }
                    return (
                      <div key={i} className="flex justify-between py-0.5 px-2 rounded relative z-10">
                        <span className="flex gap-3" style={{ color: '#94A3B8' }}><span>{row[0]}</span><span>{row[1]}</span><span>{row[2]}</span></span>
                        <span style={{ color: minterm ? 'rgba(34,211,238,0.55)' : '#475569', fontWeight: minterm ? 700 : 400 }}>{row[3]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* solver with typing cursor */}
          <div className="mt-4 rounded-lg px-3 py-2.5" style={{ background: 'rgba(13,20,34,0.7)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-[8px] font-mono uppercase tracking-wider mb-1.5" style={{ color: '#475569' }}>Solver · minterm SOP</div>
            <div className="font-mono text-[11px] flex flex-wrap items-center gap-1">
              <span className="text-white font-bold">F =</span>
              <span style={{ color: '#22D3EE' }}>A·B&apos;·C</span>
              <span style={{ color: '#475569' }}>+</span>
              <span style={{ color: '#475569' }}>A&apos;·B·C&apos;</span>
              <span style={{ color: '#475569' }}>+</span>
              <span style={{ color: '#475569' }}>A·B·C</span>
              <span className="text-white font-bold mx-1">=</span>
              <span className="text-[12px] font-bold px-2 py-0.5 rounded inline-flex items-center" style={{ background: 'rgba(34,211,238,0.12)', color: '#22D3EE' }}>
                1
                <motion.span className="ml-0.5" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}>▌</motion.span>
              </span>
            </div>
          </div>

          {/* easing progress */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg,#0891B2,#22D3EE)', width: '100%', originX: 0 }}
                animate={{ scaleX: [0.42, 0.82, 0.42] }}
                transition={{ duration: 3.4, times: [0, 0.75, 1], repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.5 }}
              />
            </div>
            <span className="text-[9px] font-mono shrink-0" style={{ color: '#64748B' }}>Next: K-Map →</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
