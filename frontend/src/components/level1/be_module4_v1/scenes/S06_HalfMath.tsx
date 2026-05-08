import React from 'react';
import { motion } from 'framer-motion';
import { Sigma, TrendingUp, Waves } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const buildHalfFilled = (w: number, h: number, cycles = 2, amp = 0.85) => {
  const pts: string[] = [`M 0 ${h / 2}`];
  for (let i = 0; i <= 200; i++) {
    const x = (i / 200) * w;
    const t = (i / 200) * cycles * 2 * Math.PI;
    const s = Math.sin(t);
    const y = s > 0 ? (h / 2 - s * (h / 2) * amp) : (h / 2);
    pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  pts.push(`L ${w} ${h / 2} Z`);
  return pts.join(' ');
};

export const S06_HalfMath: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <Sigma size={14} /> Step 5 · Half-Wave Math · Vdc &amp; Ripple
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>How much DC do we actually get?</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          To find the average DC voltage, integrate the area under the pulse over a full period.
          Half the period contributes zero (the wasted half), so the average is much smaller than
          the peak.
        </p>
      </section>

      {/* Topic banner */}
      <div className="rounded-2xl border-2 border-amber-400/40 bg-amber-500/10 p-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 border border-amber-400/55">
          Topic
        </span>
        <span className={`font-mono text-sm font-black ${textColor}`}>
          Half-wave figures of merit · V_dc, V_rms, ripple factor (r)
        </span>
        <span className="ml-auto font-mono text-[11px] text-amber-200">
          V_dc = V_m / π ≈ 0.318 V_m
        </span>
      </div>

      {/* INTEGRATION VISUAL */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-4">
          Step-by-step · Vdc derivation
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 items-center">
          {/* Filled area visual */}
          <svg viewBox="0 0 400 220" className="w-full h-auto">
            <line x1="20" y1="120" x2="380" y2="120" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
            <line x1="40" y1="30" x2="40" y2="200" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
            <text x="6" y="38"  fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>Vm</text>
            <text x="370" y="135" fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>θ</text>
            <text x="180" y="135" fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>π</text>
            <text x="320" y="135" fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>2π</text>
            <line x1="180" y1="115" x2="180" y2="125" stroke={isDarkMode ? '#94a3b8' : '#64748b'} strokeWidth="1" />
            <line x1="320" y1="115" x2="320" y2="125" stroke={isDarkMode ? '#94a3b8' : '#64748b'} strokeWidth="1" />

            <g transform="translate(40, 30)">
              <motion.path
                d={buildHalfFilled(340, 180)}
                fill="#fbbf24" fillOpacity="0.4"
                initial={{ pathLength: 0 }}
                animate={isActive ? { pathLength: 1, fillOpacity: 0.4 } : {}}
                transition={{ duration: 1.5 }}
                stroke="#fbbf24" strokeWidth="2"
              />
              {/* Dotted continuation hint of the missing negative half */}
              {Array.from({ length: 40 }).map((_, i) => {
                const t = (i / 40) * Math.PI;
                const x = 170 + (t / Math.PI) * 170;
                const y = 90 + Math.sin(t) * 90 * 0.85;
                return <circle key={i} cx={x} cy={y} r="1.5" fill="#94a3b8" opacity="0.6" />;
              })}
              <text x="220" y="160" fontSize="10" fontFamily="monospace" fill="#94a3b8" opacity="0.7">missing half</text>
            </g>
          </svg>

          {/* Equations stacked */}
          <div className="space-y-3">
            {[
              { n: '1', t: 'Definition', eq: 'V_dc = (1 / 2π) · ∫_0^{2π} v(θ) dθ' },
              { n: '2', t: 'Only positive half contributes', eq: 'V_dc = (1 / 2π) · ∫_0^{π} V_m sin θ dθ' },
              { n: '3', t: 'Integrate sin θ', eq: 'V_dc = V_m / π' },
              { n: '4', t: 'Numeric', eq: 'V_dc ≈ 0.318 · V_m' },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: 12 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="rounded-2xl p-4 border-2"
                style={{ borderColor: '#fbbf2455', background: '#fbbf2410' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 grid place-items-center rounded-md font-mono font-black text-[10px] bg-amber-400 text-black">{s.n}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300">{s.t}</span>
                </div>
                <div className={`font-mono text-sm font-black ${textColor}`}>{s.eq}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.7, type: 'spring' }}
          className="mt-5 rounded-2xl p-5 border-2 border-rose-400 bg-rose-500/10 text-center"
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-1">The verdict</div>
          <p className={`text-lg ${textColor} font-black`}>
            The DC output is merely <span className="text-rose-300">31.8%</span> of the peak voltage.
          </p>
          <p className={`text-xs ${subText} mt-1`}>Very low efficiency — most of the input is lost.</p>
        </motion.div>
      </motion.div>

      {/* RIPPLE FACTOR */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-2">
          <Waves size={12} /> The Ripple Factor (r)
        </div>
        <h3 className={`text-xl font-black ${textColor} mb-4`}>How splashy is the DC line?</h3>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
          {/* Theory + formula */}
          <div className="space-y-4">
            <p className={`text-sm ${subText}`}>
              The ripple factor is the ratio of the splashy AC component left on top of the DC line
              to the smooth DC value itself. Lower is better.
            </p>
            <div className="rounded-2xl p-5 border-2 border-amber-400/40 bg-amber-500/10 text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Definition</div>
              <div className={`font-mono text-2xl font-black ${textColor}`}>
                r = V<sub>r(rms)</sub> / V<sub>dc</sub> × 100%
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4 border-2 border-rose-400 bg-rose-500/10 text-center">
                <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-1">Half-wave</div>
                <div className={`text-3xl font-black ${textColor}`}>1.21</div>
                <div className="text-xs font-mono text-rose-300 mt-1">121% · ripple &gt; DC!</div>
              </div>
              <div className="rounded-xl p-4 border-2 border-emerald-400/40 bg-emerald-500/10 text-center">
                <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-1">Target (full-wave + filter)</div>
                <div className={`text-3xl font-black ${textColor}`}>&lt; 0.05</div>
                <div className="text-xs font-mono text-emerald-300 mt-1">smooth DC</div>
              </div>
            </div>
          </div>

          {/* Splashy waveform visual */}
          <div className={`rounded-2xl p-4 border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Output · pulses bigger than the line</div>
            <svg viewBox="0 0 400 200" className="w-full h-auto">
              {/* DC line at low level */}
              <line x1="20" y1="140" x2="380" y2="140" stroke="#22c55e" strokeWidth="2" strokeDasharray="6 3" />
              <text x="320" y="135" fontSize="10" fontFamily="monospace" fill="#22c55e">V_dc</text>
              {/* Big half-wave humps */}
              {Array.from({ length: 4 }).map((_, i) => {
                const ox = 30 + i * 90;
                return (
                  <path
                    key={i}
                    d={`M ${ox} 140 Q ${ox + 22} 30 ${ox + 45} 140`}
                    stroke="#fbbf24" strokeWidth="2.5" fill="#fbbf24" fillOpacity="0.25"
                  />
                );
              })}
              {/* Caption */}
              <text x="200" y="180" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#fbbf24" fontWeight="bold">
                ripple amplitude &gt; DC level → unusable
              </text>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* What's wrong */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 }}
        className={`p-6 rounded-2xl border-2 border-rose-400/40 bg-rose-500/10`}
      >
        <div className="flex items-start gap-3">
          <TrendingUp className="text-rose-300 mt-0.5" size={18} />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-1">Why this is unusable</div>
            <p className={`text-sm ${textColor}`}>
              Ripple of 121% means the AC slosh on top of the DC line is <em>larger</em> than the
              underlying DC itself. No microchip can run on this. We need full-wave rectification +
              a capacitor filter — coming up next.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
