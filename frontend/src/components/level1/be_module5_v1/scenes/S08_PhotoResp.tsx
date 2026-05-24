import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Zap, Baby } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const FC_LEVELS = [
  { fc: 0,    label: 'Dark', color: '#475569' },
  { fc: 1000, label: '1000 fc', color: '#22c55e' },
  { fc: 2000, label: '2000 fc', color: '#10b981' },
  { fc: 3000, label: '3000 fc', color: '#14b8a6' },
  { fc: 4000, label: '4000 fc', color: '#06b6d4' },
  { fc: 5000, label: '5000 fc', color: '#22d3ee' },
];

export const S08_PhotoResp: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [selected, setSelected] = useState<number>(2000);
  const [vLambda, setVLambda] = useState(20); // probe reverse voltage

  const W = 520, H = 280;
  // X axis: V_λ from 0 (left) to -50 (right). We'll map -V_λ → +x
  const vMax = 50;
  const iMax = 900; // μA
  const xToPx = (v: number) => (v / vMax) * W;
  const yToPx = (i: number) => (i / iMax) * H;

  const curves = useMemo(() => {
    return FC_LEVELS.map((lvl) => {
      const sat = lvl.fc / 5000 * 800 + (lvl.fc === 0 ? 0 : 20);
      const pts: string[] = [];
      // Smooth saturation curve: I = sat * (1 - exp(-V/tau))
      for (let v = 0; v <= vMax; v += 0.5) {
        const i = sat * (1 - Math.exp(-v / 3));
        pts.push(`${pts.length ? 'L' : 'M'} ${xToPx(v).toFixed(1)} ${yToPx(i).toFixed(1)}`);
      }
      return { ...lvl, d: pts.join(' '), sat };
    });
  }, []);

  const activeCurve = curves.find((c) => c.fc === selected) ?? curves[0];
  const probedI = activeCurve.sat * (1 - Math.exp(-vLambda / 3));

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-2">
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-300">
          <LineChart size={14} /> Photo · 2 · I-V vs Illumination
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor} tracking-tight`}>
          More light. <span className="text-emerald-300">More current.</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Reverse current increases almost linearly with incident luminous flux. Each line below
          is a different illumination level (in foot-candles). The shape is the same — it just
          scales upward.
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
          Imagine <strong>six piggy banks</strong>, each one in a different room: a dark room, a
          slightly-bright room, a sunny room, a beach-on-noon room… Each line on the chart is one
          piggy bank. The line tells you <em>how many coins per second</em> fall out at different
          settings of the &ldquo;reverse-bias knob.&rdquo; The brighter the room, the higher its
          line sits.
        </p>
        <p className={`mt-2 text-sm ${subText}`}>
          The yellow dot is your <em>finger</em> on the chart. Move the bottom slider to slide it
          left and right. The number it shows is how many coins per second that piggy bank gives
          you right now.
        </p>
      </motion.div>

      {/* Curves */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.15 }}
        className={`rounded-3xl border ${cardBg} p-10`}
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">I_λ (μA) vs −V_λ (V)</div>
          <div className="flex gap-1 flex-wrap">
            {FC_LEVELS.map((l) => (
              <button
                key={l.fc}
                onClick={() => setSelected(l.fc)}
                className="px-3 h-8 rounded-md font-mono text-[10px] uppercase tracking-widest font-black border transition-all"
                style={{
                  borderColor: selected === l.fc ? l.color : 'rgba(255,255,255,0.10)',
                  background: selected === l.fc ? `${l.color}22` : 'transparent',
                  color: selected === l.fc ? l.color : (isDarkMode ? '#64748b' : '#94a3b8'),
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <svg viewBox={`-50 -20 ${W + 80} ${H + 60}`} className="w-full h-auto">
          {/* axes */}
          <line x1="0" y1="0" x2="0" y2={H} stroke={isDarkMode ? '#475569' : '#94a3b8'} strokeWidth="1.5" />
          <line x1="0" y1="0" x2={W} y2="0" stroke={isDarkMode ? '#475569' : '#94a3b8'} strokeWidth="1.5" />

          {/* x ticks (V_λ = 0, -10, -20, …) */}
          {[0, 10, 20, 30, 40, 50].map((v) => (
            <g key={v}>
              <line x1={xToPx(v)} y1="0" x2={xToPx(v)} y2={H} stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} strokeWidth="1" />
              <text x={xToPx(v)} y={-6} textAnchor="middle" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>−{v}</text>
            </g>
          ))}
          <text x={W / 2} y={-22} textAnchor="middle" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#cbd5e1' : '#475569'}>V_λ (volts)</text>

          {/* y ticks */}
          {[0, 200, 400, 600, 800].map((i) => (
            <g key={i}>
              <line x1="-4" y1={yToPx(i)} x2="0" y2={yToPx(i)} stroke={isDarkMode ? '#475569' : '#94a3b8'} strokeWidth="1" />
              <text x="-8" y={yToPx(i) + 4} textAnchor="end" fontSize="10" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>−{i}</text>
            </g>
          ))}
          <text x="-44" y={H / 2} fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#cbd5e1' : '#475569'} transform={`rotate(-90, -44, ${H / 2})`}>I_λ (μA)</text>

          {/* All curves */}
          {curves.map((c) => (
            <path
              key={c.fc}
              d={c.d}
              stroke={c.color}
              strokeWidth={c.fc === selected ? 3 : 1.5}
              fill="none"
              opacity={c.fc === selected ? 1 : 0.45}
              style={c.fc === selected ? { filter: `drop-shadow(0 0 6px ${c.color})` } : undefined}
            />
          ))}

          {/* Probe marker */}
          <line x1={xToPx(vLambda)} y1="0" x2={xToPx(vLambda)} y2={H} stroke="#facc15" strokeWidth="1" strokeDasharray="4 3" />
          <circle cx={xToPx(vLambda)} cy={yToPx(probedI)} r="5" fill="#facc15" stroke="#0a0e1a" strokeWidth="2" />
          <text x={xToPx(vLambda) + 8} y={yToPx(probedI) - 6} fontSize="11" fontFamily="monospace" fill="#facc15" fontWeight="bold">
            ({-vLambda} V, −{probedI.toFixed(0)} μA)
          </text>

          {/* Curve label */}
          {curves.map((c) => (
            c.fc > 0 && (
              <text key={c.fc} x={W + 6} y={yToPx(c.sat) + 4} fontSize="9" fontFamily="monospace" fill={c.color}>{c.label}</text>
            )
          ))}
          <text x={W + 6} y={yToPx(20) + 14} fontSize="9" fontFamily="monospace" fill="#475569">Dark</text>
        </svg>
      </motion.div>

      {/* Probe slider + summary */}
      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35 }}
          className={`rounded-3xl border ${cardBg} p-6 space-y-4`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-yellow-300">Probe the curve</div>
          <div className={`rounded-2xl p-5 border ${cardBg}`}>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-yellow-300 mb-2">
              <span>Reverse bias −V_λ</span>
              <span>−{vLambda} V</span>
            </div>
            <input
              type="range" min={0} max={50} step={1}
              value={vLambda}
              onChange={(e) => setVLambda(parseInt(e.target.value))}
              className="w-full accent-yellow-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg p-3 border border-emerald-400/30 bg-emerald-400/5 text-center">
              <div className="font-mono text-[9px] uppercase tracking-widest opacity-60">Selected level</div>
              <div className="font-mono font-black text-lg" style={{ color: activeCurve.color }}>{activeCurve.label}</div>
            </div>
            <div className="rounded-lg p-3 border border-yellow-300/30 bg-yellow-300/5 text-center">
              <div className="font-mono text-[9px] uppercase tracking-widest opacity-60">I_λ at probe</div>
              <div className="font-mono font-black text-lg text-yellow-300">−{probedI.toFixed(0)} μA</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45 }}
          className={`rounded-3xl border ${cardBg} p-6 space-y-4`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 flex items-center gap-2">
            <Zap size={12} /> Properties
          </div>
          <ul className={`text-sm ${subText} space-y-2`}>
            <li>▸ <strong className="text-emerald-300">Luminous flux correlation:</strong> reverse current increases almost linearly with incident flux.</li>
            <li>▸ <strong className="text-emerald-300">Saturation:</strong> beyond a few volts the curve flattens — extra bias doesn&apos;t add carriers.</li>
            <li>▸ <strong className="text-emerald-300">Temporal response:</strong> exceptionally low rise/fall times (nanosecond range) — ideal for high-speed switching and optical comms.</li>
          </ul>
        </motion.div>
      </div>

      {/* Plain English */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.55 }}
        className={`rounded-3xl border ${cardBg} p-6 space-y-3`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">Plain English</div>
        <p className={`text-sm ${subText}`}>
          Each curve shows what reverse current you get at a given reverse voltage, for one
          fixed illumination level. The shape is identical — only the height changes with
          brightness. That linearity is what makes the photodiode a <em>measuring instrument</em>:
          double the light gives roughly double the current, so you can convert a current reading
          directly back into a brightness value.
        </p>
        <div className={`rounded-xl p-3 border ${cardBg} text-xs font-mono ${textColor}`}>
          Responsivity R (A/W) = I_λ / P_optical
          &nbsp; &nbsp; — a typical Si photodiode gives ~0.5 A per watt of red light.
        </div>
      </motion.div>

      {/* Two real-world examples */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className={`rounded-2xl border ${cardBg} p-5`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">Why nanoseconds matter</div>
          <div className={`text-sm ${subText}`}>
            10 Gb/s fiber-optic links push a new photon pulse every 100 ps. The receiver photodiode
            must keep up — only the ns-scale rise time makes that possible. Slower sensors (like
            phototransistors) can&apos;t.
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65 }}
          className={`rounded-2xl border ${cardBg} p-5`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">Why the curves saturate</div>
          <div className={`text-sm ${subText}`}>
            Once the depletion region is fully &ldquo;swept clean&rdquo; of carriers, extra reverse
            bias can&apos;t pull more current — the only knob left is generating more carriers,
            which means more light.
          </div>
        </motion.div>
      </div>
    </div>
  );
};
