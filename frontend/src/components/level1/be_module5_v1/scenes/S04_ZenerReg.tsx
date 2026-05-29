import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Battery, Gauge, Baby } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S04_ZenerReg: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  // Fixed Zener voltage for this scene
  const VZ = 5.6;
  // User controls
  const [vsource, setVsource] = useState(10);  // source voltage
  const [rs, setRs] = useState(220);           // series resistor (Ω)
  const [rl, setRl] = useState(1000);          // load resistor (Ω)

  const computed = useMemo(() => {
    // If V_source < V_Z, Zener doesn't conduct - output = source · divider (just R_L)
    if (vsource < VZ) {
      const vOut = vsource * (rl / (rl + rs));
      return { vOut, iL: vOut / rl * 1000, iZ: 0, regulated: false };
    }
    // Else Zener clamps V_OUT at V_Z
    const vOut = VZ;
    const iL = (vOut / rl) * 1000;             // mA
    const iSeries = ((vsource - vOut) / rs) * 1000; // mA
    const iZ = Math.max(0, iSeries - iL);      // mA
    return { vOut, iL, iZ, regulated: true };
  }, [vsource, rs, rl]);

  const { vOut, iL, iZ, regulated } = computed;

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-2">
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-rose-300">
          <Battery size={14} /> Zener · 2 · Voltage Regulator
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor} tracking-tight`}>
          The bodyguard at work. <span className="text-rose-300">V_Z stays locked.</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Source voltage spikes? The Zener swallows the extra current as
          <span className="font-mono text-rose-300"> ΔI_Z</span> while the load voltage stays
          pinned to <span className="font-mono text-rose-300">V_Z = {VZ} V</span>. Drag the source
          slider and verify.
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
          Picture a <strong>bucket with a small hole on the side</strong>. You pour water from the
          top. The water rises… until it reaches the hole. After that, no matter how fast you pour,
          the water level stays at the hole - extra water just spills out the side.
        </p>
        <ul className={`mt-3 text-sm ${subText} space-y-1 pl-5 list-disc`}>
          <li><span className="font-mono text-amber-300">V_in</span> = how fast you pour.</li>
          <li><span className="font-mono text-amber-300">R_S</span> = a kink in the hose so it doesn&apos;t pour too fast.</li>
          <li>The <span className="text-rose-300 font-mono">Zener</span> = the side hole. Its height = <span className="font-mono text-rose-300">V_Z</span>.</li>
          <li><span className="font-mono text-emerald-300">R_L</span> = your toy that drinks the water (the load).</li>
        </ul>
        <p className={`mt-3 text-sm ${subText}`}>
          Move the sliders. The output stays flat as long as you&apos;re pouring fast enough to
          reach the side hole.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.15 }}
        className={`rounded-3xl border ${cardBg} p-10 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center`}
      >
        {/* Circuit diagram */}
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-3">Regulator circuit</div>
          <svg viewBox="0 0 480 280" className="w-full h-auto">
            {/* Shield-shaped background */}
            <motion.path
              d="M 30 30 L 30 200 Q 30 260 240 280 Q 450 260 450 200 L 450 30 Z"
              fill="rgba(239,68,68,0.06)"
              stroke="rgba(239,68,68,0.2)"
              strokeWidth="1"
              strokeDasharray="3 3"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Source */}
            <g transform="translate(60, 130)">
              <circle cx="0" cy="0" r="22" fill="none" stroke={isDarkMode ? '#cbd5e1' : '#475569'} strokeWidth="2" />
              <text x="0" y="-2" textAnchor="middle" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#cbd5e1' : '#475569'} fontWeight="bold">V_in</text>
              <text x="0" y="12" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#22c55e">{vsource.toFixed(1)}V</text>
              <text x="0" y="38" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>Source voltage</text>
            </g>

            {/* Top wire */}
            <line x1="82" y1="130" x2="82" y2="70" stroke="#22c55e" strokeWidth="2" />
            <line x1="82" y1="70" x2="200" y2="70" stroke="#22c55e" strokeWidth="2" />
            {/* current arrow */}
            <motion.polygon points="120,66 130,70 120,74" fill="#22c55e"
              animate={{ x: [0, 18, 36] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              opacity={vsource > 0 ? 0.8 : 0.2}
            />

            {/* Series resistor R_S */}
            <g transform="translate(200, 60)">
              <rect x="0" y="0" width="60" height="20" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" strokeWidth="2" />
              <text x="30" y="14" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#fbbf24" fontWeight="bold">R_S</text>
              <text x="30" y="-6" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fbbf24">{rs}Ω</text>
            </g>

            <line x1="260" y1="70" x2="340" y2="70" stroke="#22c55e" strokeWidth="2" />
            {/* Node */}
            <circle cx="340" cy="70" r="3" fill="#22c55e" />

            {/* Zener branch - vertical Zener, cathode at top (connects to +V), anode at bottom (ground) */}
            <line x1="340" y1="70" x2="340" y2="118" stroke={regulated ? '#ef4444' : '#475569'} strokeWidth="2" />
            <g transform="translate(340, 140)">
              {(() => {
                const c = regulated ? '#ef4444' : '#475569';
                const fill = regulated ? 'rgba(239,68,68,0.22)' : 'rgba(100,116,139,0.10)';
                return (
                  <>
                    {/* Triangle pointing UP - apex (cathode) at top, base (anode) at bottom */}
                    <polygon points="-13,12 13,12 0,-10" fill={fill} stroke={c} strokeWidth="2" strokeLinejoin="round" />
                    {/* Z-shaped cathode bar: horizontal stroke at y=-12 with bent ends - left bends DOWN, right bends UP */}
                    <path d="M -16 -6 L -16 -12 L 16 -12 L 16 -18"
                          stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <text x="-22" y="4" fontSize="10" fontFamily="monospace" fill="#ef4444" fontWeight="bold">Z</text>
                  </>
                );
              })()}
            </g>
            <line x1="340" y1="160" x2="340" y2="220" stroke={regulated ? '#ef4444' : '#475569'} strokeWidth="2" />
            <text x="296" y="180" fontSize="10" fontFamily="monospace" fill="#ef4444">ΔI_Z={iZ.toFixed(1)}mA</text>

            {/* Load branch R_L */}
            <line x1="340" y1="70" x2="400" y2="70" stroke="#22c55e" strokeWidth="2" />
            <line x1="400" y1="70" x2="400" y2="120" stroke="#22c55e" strokeWidth="2" />
            <g transform="translate(385, 120)">
              <rect x="0" y="0" width="30" height="40" fill="rgba(34,197,94,0.18)" stroke="#22c55e" strokeWidth="2" />
              <text x="15" y="24" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#22c55e" fontWeight="bold">R_L</text>
            </g>
            <text x="368" y="178" fontSize="10" fontFamily="monospace" fill="#22c55e">{rl}Ω</text>

            <line x1="400" y1="160" x2="400" y2="220" stroke="#22c55e" strokeWidth="2" />

            {/* Voltmeter across load */}
            <g transform="translate(440, 130)">
              <circle cx="0" cy="0" r="18" fill="none" stroke="#22c55e" strokeWidth="2" />
              <text x="0" y="4" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#22c55e" fontWeight="bold">V</text>
            </g>
            <line x1="440" y1="112" x2="400" y2="80" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="440" y1="148" x2="400" y2="200" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 3" />
            <text x="430" y="180" fontSize="11" fontFamily="monospace" fill="#22c55e" fontWeight="bold">V_Z</text>

            {/* Bottom rail */}
            <line x1="82" y1="152" x2="82" y2="220" stroke="#22c55e" strokeWidth="2" />
            <line x1="82" y1="220" x2="400" y2="220" stroke="#22c55e" strokeWidth="2" />

            {/* Output label */}
            <text x="240" y="248" textAnchor="middle" fontSize="13" fontFamily="monospace" fill={regulated ? '#22c55e' : '#fb7185'} fontWeight="bold">
              {regulated ? `Regulated: V_OUT = ${vOut.toFixed(2)} V` : `Below V_Z: V_OUT = ${vOut.toFixed(2)} V (no regulation)`}
            </text>
          </svg>
        </div>

        {/* Controls + meters */}
        <div className="space-y-4">
          <div className={`rounded-2xl p-5 border ${cardBg}`}>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-2">
              <span>Source voltage V_in</span>
              <span>{vsource.toFixed(1)} V</span>
            </div>
            <input
              type="range" min={1} max={20} step={0.1}
              value={vsource}
              onChange={(e) => setVsource(parseFloat(e.target.value))}
              className="w-full accent-rose-400"
            />
          </div>

          <div className={`rounded-2xl p-5 border ${cardBg}`}>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-yellow-300 mb-2">
              <span>Series resistor R_S</span>
              <span>{rs} Ω</span>
            </div>
            <input
              type="range" min={47} max={1000} step={1}
              value={rs}
              onChange={(e) => setRs(parseInt(e.target.value))}
              className="w-full accent-yellow-300"
            />
          </div>

          <div className={`rounded-2xl p-5 border ${cardBg}`}>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">
              <span>Load resistor R_L</span>
              <span>{rl} Ω</span>
            </div>
            <input
              type="range" min={200} max={5000} step={10}
              value={rl}
              onChange={(e) => setRl(parseInt(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>

          {/* Live meters */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'V_OUT', val: `${vOut.toFixed(2)} V`, color: regulated ? '#22c55e' : '#fb7185' },
              { label: 'I_L',   val: `${iL.toFixed(1)} mA`,  color: '#22c55e' },
              { label: 'ΔI_Z',  val: `${iZ.toFixed(1)} mA`,  color: '#ef4444' },
            ].map((m) => (
              <div key={m.label} className={`rounded-lg p-3 border ${cardBg} text-center`}>
                <div className="font-mono text-[9px] uppercase tracking-widest opacity-60">{m.label}</div>
                <div className="font-mono font-black text-lg" style={{ color: m.color }}>{m.val}</div>
              </div>
            ))}
          </div>

          <div
            className={`rounded-xl p-3 border-2 font-mono text-xs flex items-center gap-2`}
            style={{
              borderColor: regulated ? '#22c55e55' : '#fb718555',
              background: regulated ? 'rgba(34,197,94,0.10)' : 'rgba(251,113,133,0.10)',
              color: regulated ? '#22c55e' : '#fb7185',
            }}
          >
            <Gauge size={14} />
            {regulated ? 'V_in ≥ V_Z - bodyguard active' : 'V_in < V_Z - Zener idle, load unprotected'}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className={`rounded-3xl border ${cardBg} p-6 text-sm ${subText}`}
      >
        <strong className="text-rose-300">Kirchhoff check:</strong> total series current splits at
        the node. Load takes <span className="font-mono">I_L = V_Z / R_L</span>; Zener absorbs
        whatever&apos;s left. If V_in rises, total current rises, Zener absorbs more - load
        voltage doesn&apos;t budge.
      </motion.div>

      {/* Step-by-step math walkthrough */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.55 }}
        className={`rounded-3xl border ${cardBg} p-6 space-y-3`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300">Math walkthrough · current state</div>
        <ol className={`text-sm ${subText} space-y-2 list-decimal pl-5`}>
          <li>V across R_S is <span className="font-mono">V_in − V_Z = {(vsource - VZ).toFixed(2)} V</span>.</li>
          <li>Series current <span className="font-mono">I_S = (V_in − V_Z) / R_S = {Math.max(0, ((vsource - VZ) / rs) * 1000).toFixed(2)} mA</span>.</li>
          <li>Load draws <span className="font-mono">I_L = V_Z / R_L = {iL.toFixed(2)} mA</span>.</li>
          <li>Zener absorbs the difference: <span className="font-mono">I_Z = I_S − I_L = {iZ.toFixed(2)} mA</span>.</li>
          <li>Power dissipated in Zener: <span className="font-mono">P_Z = V_Z · I_Z = {(VZ * iZ / 1000).toFixed(3)} W</span> - must stay below the diode&apos;s rated power.</li>
        </ol>
      </motion.div>

      {/* Plain English + design pitfall */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className={`rounded-2xl border ${cardBg} p-5`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-2">Plain English</div>
          <div className={`text-sm ${subText}`}>
            R_S limits the worst-case current. The Zener then acts as a tiny &ldquo;drain&rdquo; that
            sucks up extra current whenever it wants to push V_OUT above V_Z. The load just sees a
            constant V_Z.
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65 }}
          className={`rounded-2xl border ${cardBg} p-5`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Common pitfall</div>
          <div className={`text-sm ${subText}`}>
            If <span className="font-mono">V_in &lt; V_Z</span>, the Zener does nothing - your load
            voltage drops with the source. Try pulling the V_in slider below {VZ} V and watch the
            output collapse.
          </div>
        </motion.div>
      </div>
    </div>
  );
};
