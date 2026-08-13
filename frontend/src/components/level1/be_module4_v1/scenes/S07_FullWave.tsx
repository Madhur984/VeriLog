import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitMerge, TrendingDown, ArrowRight } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const buildSine = (w: number, h: number, cycles = 2, amp = 0.85, signed = true) => {
  const pts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = (i / 200) * w;
    const t = (i / 200) * cycles * 2 * Math.PI;
    const s = signed ? Math.sin(t) : Math.abs(Math.sin(t));
    const y = h / 2 - s * (h / 2) * amp;
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(' ');
};

export const S07_FullWave: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const dim       = isDarkMode ? '#475569' : '#94a3b8';

  // Phase animation · 0..1, half cycle = positive, half = negative
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    const t = setInterval(() => setPhase((p) => (p + 0.012) % 1), 30);
    return () => clearInterval(t);
  }, [isActive]);

  const isPositive = phase < 0.5;
  const onColor = '#fbbf24';
  const cyan = '#0ea5e9';
  const green = '#22c55e';

  // D1 + D2 conduct on positive half, D3 + D4 on negative
  const D1on = isPositive;
  const D2on = isPositive;
  const D3on = !isPositive;
  const D4on = !isPositive;

  const dColor = (on: boolean) => on ? onColor : dim;
  const dGlow  = (on: boolean) => on ? 'drop-shadow(0 0 4px rgba(251,191,36,0.7))' : 'none';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          <GitMerge size={14} /> Step 6 · Bridge Rectifier · 4 Diodes
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Capture both halves of the wave.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Half-wave throws away half the cycle. The fix: arrange four diodes in a bridge so that
          whichever way the input swings, current always exits through the load in the same
          direction. The output frequency doubles, the average DC doubles, and the ripple drops
          to less than half.
        </p>
      </section>

      {/* Topic banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="rounded-2xl border-2 border-violet-400/40 bg-violet-500/10 p-4 flex flex-wrap items-center gap-3"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded bg-violet-400/20 text-violet-200 border border-violet-400/55">
          Topic
        </span>
        <span className={`font-mono text-sm font-black ${textColor}`}>
          Bridge (full-wave) rectifier · 4 diodes in a diamond · centre-tap not required
        </span>
        <span className="ml-auto font-mono text-[11px] text-violet-200">
          Output frequency = 2 × input frequency
        </span>
      </motion.div>

      {/* BRIDGE CIRCUIT - clean, animated current path */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-5 md:p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400">
            The bridge · live current routing · diamond layout
          </div>
          <div className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest font-black border ${
            isPositive
              ? 'bg-amber-400/20 text-amber-200 border-amber-400/50'
              : 'bg-cyan-400/20 text-cyan-200 border-cyan-400/50'
          }`}>
            {isPositive ? 'Positive half · D1 + D2 conduct' : 'Negative half · D3 + D4 conduct'}
          </div>
        </div>

        <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:overflow-x-visible md:px-0">
        <svg viewBox="0 0 760 380" className="w-full h-auto min-w-[580px]">
          {/* ── AC source (left) ── */}
          <circle cx="60" cy="190" r="36" fill="none" stroke={cyan} strokeWidth="2.5" />
          <text x="44" y="185" fontSize="11" fontFamily="monospace" fill={cyan} fontWeight="bold">~ AC</text>
          <text x="32" y="232" fontSize="10" fontFamily="monospace" fill={cyan}>v_in</text>

          {/* AC + terminal → top bridge node A */}
          <line x1="60" y1="154" x2="60" y2="80"  stroke={cyan} strokeWidth="2.5" />
          <line x1="60" y1="80"  x2="300" y2="80" stroke={cyan} strokeWidth="2.5" />
          {/* AC − terminal → bottom bridge node C */}
          <line x1="60" y1="226" x2="60" y2="300"  stroke={cyan} strokeWidth="2.5" />
          <line x1="60" y1="300" x2="300" y2="300" stroke={cyan} strokeWidth="2.5" />

          {/* Bridge node labels */}
          <text x="305" y="76"  fontSize="11" fontFamily="monospace" fill={cyan} fontWeight="bold">A (AC+)</text>
          <text x="305" y="316" fontSize="11" fontFamily="monospace" fill={cyan} fontWeight="bold">C (AC−)</text>

          {/* The four bridge diodes (diamond):
                A (300, 80)  - top
                P (480,190) - right (load +)
                C (300,300) - bottom
                N (180,190) - left (load −)
              D1: A→P  | D2: N→C  | D3: C→P  | D4: N→A   */}

          {/* D1 - top right · A→P */}
          <line x1="300" y1="80"  x2="370" y2="135" stroke={dColor(D1on)} strokeWidth="2.5" style={{ filter: dGlow(D1on) }} />
          <polygon points="370,123 370,147 395,135"
                   fill={D1on ? onColor : 'none'} fillOpacity="0.5"
                   stroke={dColor(D1on)} strokeWidth="2.5"
                   style={{ filter: dGlow(D1on) }} />
          <line x1="395" y1="123" x2="395" y2="147" stroke={dColor(D1on)} strokeWidth="2.5" />
          <line x1="395" y1="135" x2="480" y2="190" stroke={dColor(D1on)} strokeWidth="2.5" style={{ filter: dGlow(D1on) }} />
          <text x="338" y="106" fontSize="11" fontFamily="monospace" fill={dColor(D1on)} fontWeight="bold">D1</text>

          {/* D4 - top left · N→A · arrow points UP from N to A so cathode is up */}
          <line x1="180" y1="190" x2="205" y2="135" stroke={dColor(D4on)} strokeWidth="2.5" style={{ filter: dGlow(D4on) }} />
          <polygon points="218,147 195,147 207,123"
                   fill={D4on ? onColor : 'none'} fillOpacity="0.5"
                   stroke={dColor(D4on)} strokeWidth="2.5"
                   style={{ filter: dGlow(D4on) }} />
          <line x1="195" y1="123" x2="219" y2="123" stroke={dColor(D4on)} strokeWidth="2.5" />
          <line x1="207" y1="123" x2="300" y2="80" stroke={dColor(D4on)} strokeWidth="2.5" style={{ filter: dGlow(D4on) }} />
          <text x="232" y="106" fontSize="11" fontFamily="monospace" fill={dColor(D4on)} fontWeight="bold">D4</text>

          {/* D2 - bottom left · N→C · arrow points DOWN to C */}
          <line x1="180" y1="190" x2="205" y2="245" stroke={dColor(D2on)} strokeWidth="2.5" style={{ filter: dGlow(D2on) }} />
          <polygon points="195,233 218,233 207,257"
                   fill={D2on ? onColor : 'none'} fillOpacity="0.5"
                   stroke={dColor(D2on)} strokeWidth="2.5"
                   style={{ filter: dGlow(D2on) }} />
          <line x1="195" y1="257" x2="219" y2="257" stroke={dColor(D2on)} strokeWidth="2.5" />
          <line x1="207" y1="257" x2="300" y2="300" stroke={dColor(D2on)} strokeWidth="2.5" style={{ filter: dGlow(D2on) }} />
          <text x="232" y="280" fontSize="11" fontFamily="monospace" fill={dColor(D2on)} fontWeight="bold">D2</text>

          {/* D3 - bottom right · C→P · arrow points UP to P */}
          <line x1="300" y1="300" x2="370" y2="245" stroke={dColor(D3on)} strokeWidth="2.5" style={{ filter: dGlow(D3on) }} />
          <polygon points="395,257 370,257 383,233"
                   fill={D3on ? onColor : 'none'} fillOpacity="0.5"
                   stroke={dColor(D3on)} strokeWidth="2.5"
                   style={{ filter: dGlow(D3on) }} />
          <line x1="370" y1="233" x2="395" y2="233" stroke={dColor(D3on)} strokeWidth="2.5" />
          <line x1="383" y1="233" x2="480" y2="190" stroke={dColor(D3on)} strokeWidth="2.5" style={{ filter: dGlow(D3on) }} />
          <text x="338" y="280" fontSize="11" fontFamily="monospace" fill={dColor(D3on)} fontWeight="bold">D3</text>

          {/* Output node labels */}
          <text x="148" y="180" fontSize="11" fontFamily="monospace" fill={green} fontWeight="bold">N (−)</text>
          <text x="488" y="180" fontSize="11" fontFamily="monospace" fill={green} fontWeight="bold">P (+)</text>

          {/* Load resistor (top return path through resistor) */}
          <line x1="480" y1="190" x2="600" y2="190" stroke={onColor} strokeWidth="2.5"
                style={{ filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.6))' }} />
          <line x1="600" y1="190" x2="600" y2="100" stroke={onColor} strokeWidth="2.5" />
          <path d="M 600 100 L 615 90 L 645 110 L 670 90 L 700 110 L 715 100"
                stroke={onColor} strokeWidth="2.5" fill="none" />
          <text x="640" y="78" fontSize="11" fontFamily="monospace" fill={onColor}>R_L (load)</text>
          <line x1="715" y1="100" x2="715" y2="190" stroke={onColor} strokeWidth="2.5" />
          <line x1="715" y1="190" x2="180" y2="190" stroke={onColor} strokeWidth="2" opacity="0.5" />

          {/* Output indicator label */}
          <text x="640" y="130" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={green}>V_out (DC)</text>
          <polygon points="700,184 715,190 700,196" fill={onColor} />

          {/* Animated current dot · always rotates clockwise around the active path */}
          <motion.circle
            r="5" fill="#fff"
            animate={{
              cx: D1on ? [300, 380, 480, 600, 715, 480, 230, 300] : [300, 230, 180, 480, 600, 715, 380, 300],
              cy: D1on ? [80, 135, 190, 100, 190, 190, 245, 300]   : [300, 245, 190, 190, 100, 190, 135, 80],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
        </div>

        {/* Phase explainer · two states */}
        <div className="mt-5 grid md:grid-cols-2 gap-3">
          {[
            {
              phase: 'Positive half · A is +, C is −',
              diodes: 'D1 (A→P) and D2 (N→C) conduct',
              flow: 'AC+  →  D1  →  P  →  R_L  →  N  →  D2  →  AC−',
              active: D1on,
              color: '#fbbf24',
            },
            {
              phase: 'Negative half · A is −, C is +',
              diodes: 'D3 (C→P) and D4 (N→A) conduct',
              flow: 'AC+(=C)  →  D3  →  P  →  R_L  →  N  →  D4  →  AC−(=A)',
              active: D3on,
              color: '#22d3ee',
            },
          ].map((p, i) => (
            <div key={i}
                 className={`rounded-xl p-4 border-2 transition-all ${
                   p.active
                     ? 'shadow-[0_0_20px_rgba(251,191,36,0.25)]'
                     : isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
                 }`}
                 style={p.active ? { borderColor: p.color, background: `${p.color}1a` } : {}}>
              <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: p.color }}>
                {p.phase}
              </div>
              <div className={`text-sm font-black ${textColor}`}>{p.diodes}</div>
              <div className={`font-mono text-[11px] mt-2 ${subText}`}>{p.flow}</div>
              <div className={`text-[10px] font-mono mt-2 ${subText} italic`}>
                Note: regardless of which pair conducts, current always leaves the bridge through P
                and returns through N - that's the trick.
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* INPUT vs OUTPUT WAVEFORMS */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-5 md:p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400 mb-4">
          Waveforms · input AC vs output (rectified)
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 mb-2">
              Input · v_in (AC)
            </div>
            <svg viewBox="0 0 400 200" className="w-full h-auto">
              <line x1="20" y1="100" x2="380" y2="100" stroke={dim} strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="180" stroke={dim} strokeWidth="1" />
              <text x="6" y="30"  fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>+Vm</text>
              <text x="6" y="180" fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>−Vm</text>
              <g transform="translate(40, 20)">
                <path d={buildSine(340, 160, 2, 0.85, true)} stroke={cyan} strokeWidth="2.5" fill="none"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(14,165,233,0.5))' }} />
                <text x="60" y="-2" fontSize="9" fontFamily="monospace" fill={cyan}>positive half</text>
                <text x="240" y="174" fontSize="9" fontFamily="monospace" fill={cyan}>negative half</text>
              </g>
            </svg>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">
              Output · v_out (full-wave rectified)
            </div>
            <svg viewBox="0 0 400 200" className="w-full h-auto">
              <line x1="20" y1="160" x2="380" y2="160" stroke={dim} strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="180" stroke={dim} strokeWidth="1" />
              <text x="6" y="38" fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>Vm</text>
              <g transform="translate(40, 20)">
                <path d={buildSine(340, 140, 2, 0.85, false)} stroke={green} strokeWidth="2.5" fill="none"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(34,197,94,0.6))' }} />
                <path d={`${buildSine(340, 140, 2, 0.85, false)} L 340 70 L 0 70 Z`} fill={green} opacity="0.18" />
                <line x1="0" y1="44" x2="340" y2="44" stroke={onColor} strokeWidth="1.8" strokeDasharray="6 3" />
                <text x="240" y="38" fontSize="10" fontFamily="monospace" fill={onColor}>V_dc = 0.636 Vm</text>
                <text x="60" y="-2" fontSize="9" fontFamily="monospace" fill={green}>both halves now positive</text>
              </g>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* MATH PAYOFF */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-5 md:p-8 rounded-3xl border-2 border-emerald-400/40 bg-emerald-500/10`}
      >
        <div className="flex items-center gap-3 mb-3">
          <TrendingDown className="text-emerald-300" size={20} />
          <h3 className={`text-xl font-black ${textColor}`}>The mathematical payoff</h3>
        </div>
        <p className={`text-sm ${subText} mb-4`}>
          By capturing both halves of the cycle, the average DC <strong>doubles</strong> and the
          ripple <strong>more than halves</strong>:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-5 border-2 border-emerald-400 bg-emerald-500/15">
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">DC voltage (average)</div>
            <div className={`font-mono text-2xl font-black ${textColor}`}>V_dc = 2V_m / π ≈ 0.636 V_m</div>
            <div className={`text-xs ${subText} mt-2`}>Exactly 2× the half-wave value (which was 0.318 Vm).</div>
          </div>
          <div className="rounded-2xl p-5 border-2 border-emerald-400 bg-emerald-500/15">
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">Ripple factor</div>
            <div className={`font-mono text-2xl font-black ${textColor}`}>r = 0.48 (48%)</div>
            <div className={`text-xs ${subText} mt-2`}>Down from 121% (half-wave) - but still pulsing. We need the filter.</div>
          </div>
        </div>

        {/* Comparison vs half-wave */}
        <div className="mt-5 grid sm:grid-cols-3 gap-3">
          {[
            { l: 'Diodes used',    half: '1',         full: '4 (bridge)',  delta: '+3' },
            { l: 'Output freq',    half: '50 Hz',      full: '100 Hz',      delta: '×2' },
            { l: 'Energy used',    half: '50%',        full: '~100%',       delta: '×2'  },
          ].map((c) => (
            <div key={c.l} className={`p-3 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="font-mono text-[9px] uppercase tracking-widest text-emerald-300">{c.l}</div>
              <div className={`text-xs font-mono mt-1 flex items-center gap-2 ${textColor}`}>
                <span className="opacity-50">{c.half}</span>
                <ArrowRight size={12} className="opacity-50" />
                <span className="font-black">{c.full}</span>
                <span className="ml-auto text-[10px] text-emerald-300 font-black">{c.delta}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-4 p-3 rounded-xl border border-violet-400/40 bg-violet-500/10 text-sm ${textColor}`}>
          <strong className="text-violet-300">Next:</strong> the output is twice as good but still pulses
          to zero 100×/sec. A capacitor filter (next page) parks excess charge on the peaks and
          releases it during the dips - turning these humps into a near-flat line.
        </div>
      </motion.div>
    </div>
  );
};
