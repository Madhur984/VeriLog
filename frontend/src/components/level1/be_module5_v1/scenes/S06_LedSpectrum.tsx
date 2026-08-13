import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Palette, Baby } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

type Material = {
  name: string;
  peak: number;   // nm
  color: string;
  eg: number;     // eV
  vf: number;     // forward voltage (V)
};

const MATERIALS: Material[] = [
  { name: 'GaN',   peak: 470, color: '#3b82f6', eg: 2.64, vf: 5.0 },
  { name: 'GaP',   peak: 565, color: '#22c55e', eg: 2.20, vf: 2.2 },
  { name: 'GaAsP', peak: 650, color: '#dc2626', eg: 1.91, vf: 1.8 },
];

// Build a Gaussian intensity curve centered at peak
function gauss(x: number, mu: number, sigma: number) {
  return Math.exp(-Math.pow(x - mu, 2) / (2 * sigma * sigma));
}

export const S06_LedSpectrum: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [active, setActive] = useState<string[]>(MATERIALS.map((m) => m.name));

  const W = 560;
  const H = 220;
  const xMin = 440;
  const xMax = 760;
  const xToPx = (nm: number) => ((nm - xMin) / (xMax - xMin)) * W;
  const yToPx = (i: number) => H - i * H;

  const paths = useMemo(() => MATERIALS.map((m) => {
    const sigma = 28;
    const pts: string[] = [];
    for (let nm = xMin; nm <= xMax; nm += 2) {
      const i = gauss(nm, m.peak, sigma);
      pts.push(`${pts.length ? 'L' : 'M'} ${xToPx(nm).toFixed(1)} ${yToPx(i).toFixed(1)}`);
    }
    return { ...m, d: pts.join(' ') };
  }), []);

  const toggle = (name: string) => {
    setActive((cur) => cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-2">
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-orange-300">
          <Palette size={14} /> LED · 2 · Spectrum &amp; Material
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor} tracking-tight`}>
          The colour is in the <span className="text-orange-300">crystal.</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Same diode geometry. Different compound semiconductor. <span className="font-mono text-blue-300">GaN</span>{' '}
          gives blue, <span className="font-mono text-green-300">GaP</span> green,{' '}
          <span className="font-mono text-red-300">GaAsP</span> red. Toggle materials below to
          isolate or compare their emission spectra.
        </p>
      </motion.section>

      {/* Like you're 5 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 border-2"
        style={{ borderColor: '#facc1555', background: 'linear-gradient(135deg, rgba(250,204,21,0.10), rgba(34,197,94,0.06))' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Baby size={16} className="text-yellow-300" />
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-yellow-300 font-black">Like you&apos;re 5</div>
        </div>
        <p className={`text-sm ${subText} leading-relaxed`}>
          Think back to the bunk-bed. The <em>recipe</em> you use to build the bed decides how tall
          it is. <strong className="text-blue-300">GaN</strong> builds tall beds → blue flashes.{' '}
          <strong className="text-green-300">GaP</strong> builds medium beds → green flashes.{' '}
          <strong className="text-red-300">GaAsP</strong> builds short beds → red flashes. Tap the
          buttons to show or hide each recipe&apos;s &ldquo;flash hill&rdquo; on the chart.
        </p>
      </motion.div>

      {/* Spectrum chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.15 }}
        className={`rounded-3xl border ${cardBg} p-5 md:p-10`}
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300">Relative emission · T_A = 25 °C</div>
          <div className="flex gap-2 flex-wrap">
            {MATERIALS.map((m) => {
              const on = active.includes(m.name);
              return (
                <button
                  key={m.name}
                  onClick={() => toggle(m.name)}
                  className="px-3 h-10 sm:h-9 rounded-lg font-mono text-xs uppercase tracking-widest font-black border-2 transition-all"
                  style={{
                    borderColor: on ? m.color : 'rgba(255,255,255,0.10)',
                    background: on ? `${m.color}22` : 'transparent',
                    color: on ? m.color : (isDarkMode ? '#64748b' : '#94a3b8'),
                  }}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:overflow-x-visible md:px-0">
        <svg viewBox={`-30 -10 ${W + 40} ${H + 60}`} className="w-full h-auto min-w-[460px]">
          {/* Axes */}
          <line x1="0" y1={H} x2={W} y2={H} stroke={isDarkMode ? '#475569' : '#94a3b8'} strokeWidth="1.5" />
          <line x1="0" y1="0" x2="0" y2={H} stroke={isDarkMode ? '#475569' : '#94a3b8'} strokeWidth="1.5" />

          {/* Grid + x labels */}
          {[450, 500, 550, 600, 650, 700, 750].map((nm) => (
            <g key={nm}>
              <line x1={xToPx(nm)} y1="0" x2={xToPx(nm)} y2={H} stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} strokeWidth="1" />
              <text x={xToPx(nm)} y={H + 16} textAnchor="middle" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>{nm}</text>
            </g>
          ))}
          <text x={W / 2} y={H + 38} textAnchor="middle" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#cbd5e1' : '#475569'}>Wavelength - nm</text>
          {/* Y labels */}
          {[0, 0.5, 1.0].map((i) => (
            <g key={i}>
              <line x1="-4" y1={yToPx(i)} x2="0" y2={yToPx(i)} stroke={isDarkMode ? '#475569' : '#94a3b8'} strokeWidth="1" />
              <text x="-8" y={yToPx(i) + 4} textAnchor="end" fontSize="10" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>{i.toFixed(1)}</text>
            </g>
          ))}
          <text x="-22" y="-4" fontSize="10" fontFamily="monospace" fill={isDarkMode ? '#cbd5e1' : '#475569'}>Relative Intensity</text>

          {/* Curves */}
          {paths.map((p) => {
            const on = active.includes(p.name);
            if (!on) return null;
            return (
              <g key={p.name}>
                <motion.path
                  d={p.d}
                  stroke={p.color}
                  strokeWidth="3"
                  fill="none"
                  style={{ filter: `drop-shadow(0 0 6px ${p.color})` }}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                />
                <path d={`${p.d} L ${xToPx(xMax)} ${H} L ${xToPx(xMin)} ${H} Z`} fill={p.color} opacity="0.12" />
                <text x={xToPx(p.peak)} y={yToPx(1) - 6} textAnchor="middle" fontSize="11" fontFamily="monospace" fill={p.color} fontWeight="bold">
                  {p.name} (~{p.peak} nm)
                </text>
              </g>
            );
          })}
        </svg>
        </div>
      </motion.div>

      {/* Material cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {MATERIALS.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 12 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35 + i * 0.08 }}
            className="rounded-2xl border-2 p-6 relative overflow-hidden"
            style={{ borderColor: `${m.color}55`, background: `${m.color}10` }}
          >
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${m.color}88, transparent 70%)` }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
            />
            <div className="relative z-10 space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: m.color }}>{m.name}</div>
              <div className={`text-2xl font-black ${textColor}`}>~{m.peak} nm</div>
              <div className={`text-sm ${subText}`}>
                Band gap <span className="font-mono" style={{ color: m.color }}>E_g = {m.eg} eV</span>
                <br />Typical forward drop <span className="font-mono" style={{ color: m.color }}>V_F ≈ {m.vf} V</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.55 }}
        className={`rounded-3xl border ${cardBg} p-6 text-sm ${subText}`}
      >
        <strong className="text-orange-300">Material Dependency:</strong> compound semiconductors
        determine the luminous efficacy and the specific wavelength of the emission. Pure silicon
        cannot emit visible light - its band gap is too small. We need direct-gap compounds.
      </motion.div>

      {/* Plain English + a "design choice" callout */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className={`rounded-2xl border ${cardBg} p-5`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-2">Plain English</div>
          <div className={`text-sm ${subText}`}>
            The LED chooses its colour by picking a different cookie cutter for the crystal. You
            cannot make a silicon LED - silicon&apos;s gap is too narrow and the geometry of its
            band structure doesn&apos;t favour photon emission. So engineers use III-V compounds
            like GaN, GaP, GaAsP.
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65 }}
          className={`rounded-2xl border ${cardBg} p-5`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Why this changed history</div>
          <div className={`text-sm ${subText}`}>
            The blue LED wasn&apos;t available until the 1990s (Nakamura, Akasaki, Amano - 2014
            Nobel Prize). Once we had blue, white LEDs became possible - and modern LED lighting
            replaced incandescent bulbs.
          </div>
        </motion.div>
      </div>
    </div>
  );
};
