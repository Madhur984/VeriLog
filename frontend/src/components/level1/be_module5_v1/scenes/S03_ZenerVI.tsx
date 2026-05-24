import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Baby } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

/**
 * Build the V-I curve of a Zener diode.
 *  Forward bias  (V > 0)   :  exponential conduction above ~0.7 V
 *  Reverse small (-Vz < V) :  near-zero leakage
 *  Breakdown    (V <= -Vz) :  vertical wall — V locked at -Vz
 */
function buildCurve(vz: number, width = 360, height = 220) {
  const xMin = -8, xMax = 1.5;       // volts
  const yMin = -1.0, yMax = 0.6;     // amps (display, not real)
  const xToPx = (v: number) => ((v - xMin) / (xMax - xMin)) * width;
  const yToPx = (i: number) => height - ((i - yMin) / (yMax - yMin)) * height;
  const pts: string[] = [];
  for (let v = xMin; v <= xMax; v += 0.05) {
    let i: number;
    if (v >= 0.6) i = Math.min(0.5, 0.001 * Math.exp((v - 0.6) * 6));
    else if (v >= -vz) i = -0.0005 * (1 - Math.exp(-Math.abs(v))); // tiny leakage
    else i = -0.9; // breakdown wall (clamped)
    pts.push(`${pts.length ? 'L' : 'M'} ${xToPx(v).toFixed(1)} ${yToPx(i).toFixed(1)}`);
  }
  // Vertical wall at v = -vz from i = -0.0005 to -0.9
  const wallX = xToPx(-vz);
  pts.push(`M ${wallX.toFixed(1)} ${yToPx(-0.0005).toFixed(1)} L ${wallX.toFixed(1)} ${yToPx(-0.9).toFixed(1)}`);
  return { pts, xToPx, yToPx, width, height };
}

export const S03_ZenerVI: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [vz, setVz] = useState(5.6); // user-adjustable Zener voltage
  const breakdownType = vz < 5 ? 'Zener' : 'Avalanche';
  const breakdownColor = breakdownType === 'Zener' ? '#ef4444' : '#a78bfa';

  const curve = useMemo(() => buildCurve(vz), [vz]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-2">
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-rose-400">
          <Shield size={14} /> Zener · 1 · The Voltage Bodyguard
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor} tracking-tight`}>
          The Zener V-I curve. <span className="text-rose-300">Breakdown weaponised.</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The normal diode reverse-bias region just leaks. The Zener slams shut at a precise
          breakdown voltage <span className="font-mono text-rose-300">V_Z</span> and never lets
          it drift. Drag the slider to choose <span className="font-mono text-rose-300">V_Z</span>{' '}
          and watch the curve&apos;s vertical wall move.
        </p>
      </motion.section>

      {/* Like you're 5 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 border-2"
        style={{ borderColor: '#facc1555', background: 'linear-gradient(135deg, rgba(250,204,21,0.10), rgba(239,68,68,0.06))' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Baby size={16} className="text-yellow-300" />
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-yellow-300 font-black">Like you&apos;re 5</div>
        </div>
        <p className={`text-sm ${subText} leading-relaxed`}>
          The Zener is a <strong>strict bouncer</strong> at a kids party. Every Zener has its own
          favorite height — say 5 feet. You can push ten kids, twenty kids, a hundred kids into
          the line — the line will <em>never</em> grow taller than 5 feet, because the bouncer
          just lets the extra kids through the back door. The slider lets you pick the bouncer&apos;s
          favorite height. Watch the red &ldquo;wall&rdquo; on the chart move.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.15 }}
        className={`rounded-3xl border ${cardBg} p-10 grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center`}
      >
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-3">V-I characteristic</div>
          <svg viewBox="-50 -20 460 270" className="w-full h-auto">
            {/* Axes */}
            <line x1="-40" y1={curve.yToPx(0)} x2={curve.width + 10} y2={curve.yToPx(0)} stroke={isDarkMode ? '#475569' : '#94a3b8'} strokeWidth="1.5" />
            <line x1={curve.xToPx(0)} y1="-10" x2={curve.xToPx(0)} y2={curve.height + 10} stroke={isDarkMode ? '#475569' : '#94a3b8'} strokeWidth="1.5" />
            <polygon points={`${curve.width + 6},${curve.yToPx(0) - 4} ${curve.width + 14},${curve.yToPx(0)} ${curve.width + 6},${curve.yToPx(0) + 4}`} fill={isDarkMode ? '#475569' : '#94a3b8'} />
            <polygon points={`${curve.xToPx(0) - 4},-6 ${curve.xToPx(0)},-14 ${curve.xToPx(0) + 4},-6`} fill={isDarkMode ? '#475569' : '#94a3b8'} />
            <text x={curve.width + 16} y={curve.yToPx(0) + 4} fontSize="13" fontFamily="monospace" fill={isDarkMode ? '#cbd5e1' : '#475569'}>V_D</text>
            <text x={curve.xToPx(0) - 8} y="-18" fontSize="13" fontFamily="monospace" fill={isDarkMode ? '#cbd5e1' : '#475569'}>I_D</text>

            {/* Background shield silhouette */}
            <motion.path
              d="M 80 60 L 80 130 Q 80 200 200 230 Q 320 200 320 130 L 320 60 Z"
              fill={`${breakdownColor}11`}
              stroke={`${breakdownColor}33`}
              strokeWidth="1"
              animate={{ opacity: [0.4, 0.75, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Curve */}
            <motion.path
              key={vz}
              d={curve.pts.join(' ')}
              stroke={breakdownColor}
              strokeWidth="3"
              fill="none"
              style={{ filter: `drop-shadow(0 0 8px ${breakdownColor})` }}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7 }}
            />

            {/* V_Z marker */}
            <line x1={curve.xToPx(-vz)} y1={curve.yToPx(0)} x2={curve.xToPx(-vz)} y2={curve.yToPx(-0.85)}
                  stroke={breakdownColor} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.55" />
            <text x={curve.xToPx(-vz) - 6} y={curve.yToPx(0) + 18} fontSize="12" fontFamily="monospace" fill={breakdownColor} fontWeight="bold">V_Z = {vz.toFixed(1)} V</text>
            <text x={curve.xToPx(-vz) - 60} y={curve.yToPx(-0.85) + 14} fontSize="11" fontFamily="monospace" fill={breakdownColor}>I_ZM</text>
          </svg>
        </div>

        <div className="space-y-5">
          <div className={`rounded-2xl p-5 border ${cardBg}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-3">
              V_Z slider · {vz.toFixed(1)} V
            </div>
            <input
              type="range"
              min={2}
              max={15}
              step={0.1}
              value={vz}
              onChange={(e) => setVz(parseFloat(e.target.value))}
              className="w-full accent-rose-400"
            />
            <div className="flex justify-between text-[10px] font-mono mt-1 opacity-50">
              <span>2 V</span>
              <span>5 V</span>
              <span>15 V</span>
            </div>
            <div className="mt-3 text-[11px] font-mono uppercase tracking-widest" style={{ color: breakdownColor }}>
              Active mechanism: {breakdownType} breakdown
            </div>
          </div>

          <div className={`rounded-2xl p-5 border ${cardBg} space-y-3 text-sm ${subText}`}>
            <div className="flex items-center gap-2 text-rose-300 font-mono text-[10px] uppercase tracking-widest">
              <Zap size={12} /> Zener breakdown
            </div>
            <p>Strong electric field in the depletion region disrupts atomic bonds and pulls carriers free. Dominates when V_BV &lt; 5 V.</p>
          </div>

          <div className={`rounded-2xl p-5 border ${cardBg} space-y-3 text-sm ${subText}`}>
            <div className="flex items-center gap-2 text-violet-300 font-mono text-[10px] uppercase tracking-widest">
              <Zap size={12} /> Avalanche breakdown
            </div>
            <p>High-velocity minority carriers collide with lattice atoms and knock loose new carriers — chain reaction. Dominates above 5 V.</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`rounded-3xl border ${cardBg} p-6 text-sm ${subText}`}
      >
        <strong className="text-rose-300">Why this matters:</strong> the vertical wall in reverse
        breakdown means current can change by orders of magnitude while voltage stays at V_Z.
        That is the entire foundation of voltage regulation — coming up next.
      </motion.div>

      {/* Plain English + Where you'll meet this */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className={`rounded-2xl border ${cardBg} p-5`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-2">Plain English</div>
          <div className={`text-sm ${subText}`}>
            Normal diodes in reverse bias just leak. The Zener is engineered to{' '}
            <em>fail gracefully at a specific voltage</em>. Above that voltage it acts like a wall —
            voltage refuses to climb further, no matter how much current you push.
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55 }}
          className={`rounded-2xl border ${cardBg} p-5`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Where you&apos;ll meet this</div>
          <div className={`text-sm ${subText}`}>
            5 V reference rails on Arduino boards · ESD protection diodes on USB lines ·
            cheap voltage references in cheap power supplies · op-amp clamping circuits.
          </div>
        </motion.div>
      </div>

      {/* Key formulas */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className={`rounded-3xl border ${cardBg} p-6 space-y-3`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300">Cheat-sheet · key terms</div>
        <div className={`grid md:grid-cols-3 gap-3 text-sm ${textColor}`}>
          <div><span className="font-mono text-rose-300">V_Z</span> — nominal Zener voltage, set by doping during manufacture.</div>
          <div><span className="font-mono text-rose-300">I_ZM</span> — maximum reverse current before the diode burns out from heat.</div>
          <div><span className="font-mono text-rose-300">P_D = V_Z · I_Z</span> — power dissipated; pick a diode whose rating exceeds worst-case P_D.</div>
        </div>
      </motion.div>
    </div>
  );
};
