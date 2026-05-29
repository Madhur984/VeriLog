import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Eye, KeyRound, Siren, Lock, Unlock, Zap } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }
type Bit = 0 | 1;

const INPUTS = [
  { sym: 'A' as const, Icon: Eye,      role: 'Biometric Retinal Scan',     detail: 'On-site iris reader confirms identity.', accent: '#0ea5e9' },
  { sym: 'B' as const, Icon: KeyRound, role: 'Physical Supervisor Keycard', detail: 'A trusted second party tapped their card.', accent: '#22d3ee' },
  { sym: 'C' as const, Icon: Siren,    role: 'Emergency Manual Override',   detail: 'Hardwired break-glass switch for crisis.', accent: '#f59e0b' },
];

export const S02_Vault: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [bits, setBits] = useState<Record<'A' | 'B' | 'C', Bit>>({ A: 0, B: 0, C: 0 });
  const f: Bit = (bits.A === 1 || (bits.B === 1 && bits.C === 1)) ? 1 : 0;
  const toggle = (k: 'A' | 'B' | 'C') => setBits((p) => ({ ...p, [k]: p[k] === 1 ? 0 : 1 }));

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-orange-400">
          <ShieldCheck size={14} /> Step 1 · The Brief
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Securing the Server Vault.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The vault cannot rely on software - software can be bypassed. We need a{' '}
          <strong className="text-orange-300">hardwired, fail-safe combinational circuit</strong>{' '}
          that takes three input signals and decides whether to unlock. Three inputs, one output.
        </p>
      </section>

      {/* Interactive vault visual */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
        style={{
          background: f === 1
            ? (isDarkMode
                ? 'radial-gradient(circle at 70% 30%, rgba(34,197,94,0.18), transparent 60%)'
                : 'radial-gradient(circle at 70% 30%, rgba(34,197,94,0.10), transparent 60%)')
            : (isDarkMode
                ? 'radial-gradient(circle at 30% 70%, rgba(244,63,94,0.10), transparent 60%)'
                : 'radial-gradient(circle at 30% 70%, rgba(244,63,94,0.06), transparent 60%)'),
          transition: 'background 0.6s ease',
        }}
      >
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
          {/* LEFT - clickable input cards */}
          <div className="space-y-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400 flex items-center gap-2">
              <Zap size={12} /> Try it · click any sensor
            </div>
            {INPUTS.map((s, i) => {
              const v = bits[s.sym];
              return (
                <motion.button
                  key={s.sym}
                  onClick={() => toggle(s.sym)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isActive ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left p-4 rounded-2xl border-2 flex items-center gap-4 transition-all relative overflow-hidden"
                  style={{
                    borderColor: v ? s.accent : `${s.accent}33`,
                    background: v ? `${s.accent}22` : `${s.accent}08`,
                    boxShadow: v ? `0 0 30px ${s.accent}33` : 'none',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl grid place-items-center font-mono font-black flex-shrink-0 transition-all"
                    style={{
                      background: v ? s.accent : `${s.accent}22`,
                      color: v ? '#000' : s.accent,
                    }}
                  >
                    {s.sym}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold ${textColor}`}>{s.role}</div>
                    <div className={`text-[11px] font-mono ${subText} truncate`}>{s.detail}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <s.Icon size={20} style={{ color: v ? s.accent : `${s.accent}99` }} />
                    <motion.div
                      animate={{ scale: v ? 1.15 : 1 }}
                      className="w-12 text-center font-mono font-black text-2xl"
                      style={{ color: s.accent }}
                    >
                      {v}
                    </motion.div>
                  </div>
                  {v === 1 && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.2, 0.6, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ background: `linear-gradient(90deg, transparent, ${s.accent}15, transparent)` }}
                    />
                  )}
                </motion.button>
              );
            })}

            <motion.div
              initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="rounded-2xl p-4 border border-orange-400/30 bg-orange-500/5"
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-2">The unlock rule</div>
              <p className={`text-sm ${textColor}`}>
                Vault unlocks if <strong className="text-sky-300">A alone</strong>, OR if{' '}
                <strong className="text-cyan-300">B</strong> AND{' '}
                <strong className="text-amber-300">C</strong> together.
              </p>
            </motion.div>
          </div>

          {/* RIGHT - animated vault */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <svg viewBox="0 0 280 320" className="w-72 h-auto">
              {/* Vault body */}
              <rect x="20" y="40" width="240" height="240" rx="14"
                    fill={isDarkMode ? '#1e293b' : '#cbd5e1'} stroke={isDarkMode ? '#475569' : '#64748b'} strokeWidth="3" />
              {/* Inner ring */}
              <circle cx="140" cy="160" r="92" fill="none" stroke={isDarkMode ? '#334155' : '#94a3b8'} strokeWidth="2" />
              <circle cx="140" cy="160" r="72" fill={isDarkMode ? '#0f172a' : '#e2e8f0'} stroke={isDarkMode ? '#334155' : '#94a3b8'} strokeWidth="2" />

              {/* Status text inside ring */}
              <AnimatePresence mode="wait">
                {f === 1 ? (
                  <motion.g
                    key="unlock"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                  >
                    <text x="140" y="150" textAnchor="middle" fontSize="32" fontFamily="monospace" fontWeight="bold" fill="#22c55e">F=1</text>
                    <text x="140" y="180" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#22c55e">UNLOCKED</text>
                  </motion.g>
                ) : (
                  <motion.g
                    key="lock"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                  >
                    <text x="140" y="150" textAnchor="middle" fontSize="32" fontFamily="monospace" fontWeight="bold" fill="#ef4444">F=0</text>
                    <text x="140" y="180" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#ef4444">SEALED</text>
                  </motion.g>
                )}
              </AnimatePresence>

              {/* Rotating dial spokes */}
              <motion.g
                animate={{ rotate: f === 1 ? 90 : 0 }}
                transition={{ type: 'spring', stiffness: 80 }}
                style={{ originX: '140px', originY: '160px' }}
              >
                {[0, 1, 2, 3].map((i) => {
                  const angle = (i * 90 * Math.PI) / 180;
                  const x = 140 + 60 * Math.cos(angle);
                  const y = 160 + 60 * Math.sin(angle);
                  return (
                    <line key={i}
                          x1={140 + 75 * Math.cos(angle)}
                          y1={160 + 75 * Math.sin(angle)}
                          x2={x}
                          y2={y}
                          stroke={f ? '#22c55e' : (isDarkMode ? '#475569' : '#64748b')}
                          strokeWidth="3"
                          strokeLinecap="round" />
                  );
                })}
              </motion.g>

              {/* Lock icon at top */}
              <motion.g
                animate={{ y: f === 1 ? -2 : 0 }}
                transition={{ type: 'spring' }}
              >
                <circle cx="140" cy="60" r="14" fill={f ? '#22c55e' : '#ef4444'} stroke={isDarkMode ? '#fff' : '#0f172a'} strokeWidth="2"
                        style={{ filter: f ? 'drop-shadow(0 0 12px rgba(34,197,94,0.7))' : 'drop-shadow(0 0 8px rgba(239,68,68,0.5))' }} />
              </motion.g>

              {/* LED indicators for inputs A B C - light up when input is 1 */}
              {[
                { x: 50,  y: 290, k: 'A' as const, color: '#0ea5e9' },
                { x: 140, y: 290, k: 'B' as const, color: '#22d3ee' },
                { x: 230, y: 290, k: 'C' as const, color: '#f59e0b' },
              ].map((led) => {
                const lit = bits[led.k] === 1;
                return (
                  <g key={led.k}>
                    <motion.circle
                      cx={led.x} cy={led.y} r={lit ? 8 : 6}
                      animate={{
                        fill: lit ? led.color : (isDarkMode ? '#1e293b' : '#cbd5e1'),
                        filter: lit ? `drop-shadow(0 0 10px ${led.color})` : 'none',
                      }}
                      stroke={led.color} strokeWidth="2"
                    />
                    <text x={led.x} y={led.y + 4} textAnchor="middle" fontSize="9" fontFamily="monospace"
                          fontWeight="bold" fill={lit ? '#000' : led.color}>{led.k}</text>
                  </g>
                );
              })}
            </svg>

            {/* Status pill */}
            <motion.div
              animate={{
                background: f === 1
                  ? (isDarkMode ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.15)')
                  : (isDarkMode ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)'),
                borderColor: f === 1 ? '#22c55e' : '#ef4444',
              }}
              className="mt-4 px-4 py-2 rounded-2xl border-2 flex items-center justify-center gap-2 font-mono text-sm font-black"
              style={{ color: f === 1 ? '#22c55e' : '#ef4444' }}
            >
              {f === 1 ? <Unlock size={16} /> : <Lock size={16} />}
              {f === 1 ? 'VAULT UNLOCKED' : 'VAULT SEALED'}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* The unlock rule explanation */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-8 rounded-3xl border ${cardBg} space-y-4`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400">In one sentence</div>
        <h3 className={`text-2xl font-black ${textColor}`}>
          The vault unlocks if <span className="text-sky-300">A</span> is engaged alone,{' '}
          <em>or</em> if <span className="text-cyan-300">B</span> and{' '}
          <span className="text-amber-300">C</span> are engaged together.
        </h3>
        <p className={`text-sm ${subText}`}>
          That single English sentence is our entire specification. The next four steps turn it
          into a truth table, into algebra, into a K-Map, and finally into copper traces and gates.
        </p>
      </motion.div>
    </div>
  );
};
