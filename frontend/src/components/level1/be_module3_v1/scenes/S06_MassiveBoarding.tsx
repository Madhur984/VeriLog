import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Train, Zap, Activity } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const shockley = (vd: number) => {
  const Is = 1e-12;
  const Vt = 0.026;
  return Is * (Math.exp(vd / Vt) - 1);
};

export const S06_MassiveBoarding: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [vd, setVd] = useState(0.6);
  const id = useMemo(() => shockley(vd), [vd]);
  const idDisplay = id < 1e-6
    ? `${(id * 1e9).toFixed(2)} nA`
    : id < 1e-3
      ? `${(id * 1e6).toFixed(2)} μA`
      : `${(id * 1e3).toFixed(2)} mA`;

  const points = useMemo(() => {
    const arr: [number, number][] = [];
    for (let v = -1.5; v <= 1.0; v += 0.02) {
      arr.push([v, shockley(v)]);
    }
    return arr;
  }, []);
  const xMap = (v: number) => 50 + ((v + 1.5) / 2.5) * 540;
  const yMax = 0.05;
  const yMap = (i: number) => {
    if (i <= 0) return 180;
    return 180 - Math.min(170, (i / yMax) * 170);
  };
  const path = points.map(([v, i], idx) => `${idx === 0 ? 'M' : 'L'} ${xMap(v)} ${yMap(i)}`).join(' ');

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          <Train size={14} /> Chapter 06 · Forward Bias
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Massive Boarding</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Now flip the battery: positive to P-side, negative to N-side (V_D &gt; 0). Majority
          carriers are <em>pushed</em> toward the junction. The depletion region narrows. Once
          V_D crosses the knee voltage (~<strong className="text-violet-300">0.7 V for silicon</strong>),
          current rises exponentially.
        </p>
      </section>

      {/* Single PDF */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img src="/images/commuter/p07.webp" alt="Forward bias — massive boarding" className="w-full block aspect-[16/9] object-cover" />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-violet-200/80">
          Commuter Circuit · Forward Bias
        </div>
      </motion.div>

      {/* Shockley equation card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400 mb-5">
          Shockley&apos;s diode equation · what each symbol means
        </div>
        <div className="rounded-2xl p-6 border-2 border-violet-400 bg-violet-500/10 text-center mb-5">
          <div className={`font-mono text-3xl md:text-4xl font-black ${textColor}`}>
            I<sub className="text-sm">D</sub> = I<sub className="text-sm">S</sub> ( e<sup className="text-sm">V<sub className="text-[8px]">D</sub> / nV<sub className="text-[8px]">T</sub></sup> − 1 )
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { sym: 'I_D',  name: 'Diode current',           detail: 'What we actually measure flowing through.' },
            { sym: 'I_S',  name: 'Reverse saturation',      detail: '~10⁻¹² A for small Si diodes; very temperature-dependent.' },
            { sym: 'V_D',  name: 'Applied voltage',         detail: 'The bias you put across the diode (positive = forward).' },
            { sym: 'V_T',  name: 'Thermal voltage',         detail: 'kT/q ≈ 26 mV at room temperature (300 K).' },
            { sym: 'n',    name: 'Ideality factor',         detail: 'Between 1 (ideal) and 2 (real). Ge ≈ 1, Si ≈ 1–2.' },
            { sym: 'e^x',  name: 'Exponential',             detail: 'The reason the curve is non-linear above the knee.' },
            { sym: '−1',   name: 'The "−1" term',           detail: 'Forces I_D = 0 at V_D = 0. Significant only below ~0.1 V.' },
            { sym: '0.7V', name: 'Knee voltage',            detail: 'Where exp grows fast enough to overwhelm I_S — the diode turns "on".' },
          ].map((c) => (
            <div key={c.sym} className={`p-3 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="font-mono text-xl font-black text-violet-300 mb-1">{c.sym}</div>
              <div className={`font-mono text-[10px] uppercase tracking-widest ${subText} mb-1`}>{c.name}</div>
              <p className={`text-[11px] ${subText} leading-relaxed`}>{c.detail}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Live curve */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400">Live diode V-I curve · drag the slider</span>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-violet-300" />
            <span className="font-mono text-xs text-violet-300">I_D = I_S(e^(V_D/nV_T) − 1)</span>
          </div>
        </div>

        <svg viewBox="0 0 640 220" className="w-full h-auto">
          <line x1="50" y1="180" x2="600" y2="180" stroke="#475569" strokeWidth="1" />
          <line x1={xMap(0)} y1="20" x2={xMap(0)} y2="200" stroke="#475569" strokeWidth="1" />
          <text x="600" y="200" fill="#94a3b8" fontFamily="monospace" fontSize="11" textAnchor="end">V_D (V)</text>
          <text x={xMap(0) + 10} y="30" fill="#94a3b8" fontFamily="monospace" fontSize="11">I_D</text>
          <line x1={xMap(0.7)} y1="175" x2={xMap(0.7)} y2="185" stroke="#fcd34d" strokeWidth="2" />
          <text x={xMap(0.7)} y="200" fill="#fcd34d" fontFamily="monospace" fontSize="10" textAnchor="middle">0.7V</text>
          <path d={path} fill="none" stroke="#a78bfa" strokeWidth="2.5" />
          <circle cx={xMap(vd)} cy={yMap(id)} r="6" fill="#fcd34d" stroke="#fb923c" strokeWidth="2" />
          <text x="100" y="60" fill="#fb923c" fontFamily="monospace" fontSize="10" fontWeight="bold">REVERSE</text>
          <text x="100" y="74" fill="#94a3b8" fontFamily="monospace" fontSize="9">I ≈ -I_S (tiny leak)</text>
          <text x="500" y="60" fill="#a78bfa" fontFamily="monospace" fontSize="10" fontWeight="bold">FORWARD</text>
          <text x="500" y="74" fill="#94a3b8" fontFamily="monospace" fontSize="9">I rises exponentially</text>
        </svg>

        <div className="mt-5">
          <input
            type="range" min={-1.5} max={1.0} step={0.01} value={vd}
            onChange={(e) => setVd(parseFloat(e.target.value))}
            className="w-full accent-violet-400"
          />
          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-1">V_D</div>
              <div className={`font-mono text-2xl font-black ${textColor}`}>{vd.toFixed(2)} V</div>
            </div>
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-1">I_D</div>
              <div className={`font-mono text-2xl font-black text-violet-300`}>{idDisplay}</div>
            </div>
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-1">Region</div>
              <div className={`font-mono text-base font-black ${textColor}`}>
                {vd < 0 ? 'Reverse' : vd < 0.5 ? 'Below knee' : vd < 0.7 ? 'Knee' : 'Forward (active)'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        className={`p-6 rounded-3xl border ${cardBg} flex items-start gap-3`}
      >
        <Activity className="text-violet-300 flex-shrink-0 mt-0.5" size={20} />
        <p className={`text-sm ${subText}`}>
          <strong className="text-violet-300">Key insight:</strong> current does NOT rise linearly.
          Once the barrier voltage (e.g. 0.7 V for silicon) is overcome, the floodgates open and
          I_D rises <em>exponentially</em>. This non-linear behaviour is why diodes are so useful
          for rectification.
        </p>
      </motion.div>
    </div>
  );
};
