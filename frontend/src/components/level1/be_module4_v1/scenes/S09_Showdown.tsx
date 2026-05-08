import React from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, ArrowRight, Activity, Battery } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const ROWS = [
  { param: 'No. of Diodes',     half: '1',           center: '2',                    bridge: '4' },
  { param: 'V_dc (Average)',    half: '0.318 Vm',    center: '0.636 Vm',             bridge: '0.636 Vm' },
  { param: 'Output frequency',  half: '50 Hz (×1)',  center: '100 Hz (×2)',          bridge: '100 Hz (×2)' },
  { param: 'Ripple Factor (r)', half: '1.21 (121%)', center: '0.48 (48%)',           bridge: '0.48 (48%)' },
  { param: 'Peak Inverse Volts', half: 'Vm',         center: '2 Vm',                 bridge: 'Vm' },
  { param: 'Transformer',       half: 'Simple',      center: 'Centre-tapped (bulky)', bridge: 'Simple' },
  { param: 'With C-filter (r)',  half: '~10%',        center: '~5%',                  bridge: '~5% or less' },
];

const PIPELINE = [
  { tag: 'AC',     title: 'AC Mains',          desc: '230 V · 50 Hz · sine',                accent: '#0ea5e9', sym: '~' },
  { tag: 'Step 1', title: 'Rectifier',         desc: '4 diodes · always forward',            accent: '#a78bfa', sym: '▶|' },
  { tag: 'Step 2', title: 'Capacitor Filter',  desc: 'C in parallel · smooths the pulses',   accent: '#fbbf24', sym: '═' },
  { tag: 'DC',     title: 'Smooth DC',         desc: 'Constant V_dc · ready for IC',         accent: '#22c55e', sym: '═' },
];

export const S09_Showdown: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-rose-300">
          <Award size={14} /> Closing · Rectifier + Filter Recap
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Module 04 · the full picture.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          You have seen every piece of a basic linear power supply. This page is the at-a-glance
          summary: a side-by-side comparison of the three rectifier topologies, then the complete
          AC-to-DC pipeline, then the takeaways. Bookmark this page for revision.
        </p>
      </section>

      {/* Topic banner */}
      <div className="rounded-2xl border-2 border-rose-400/40 bg-rose-500/10 p-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded bg-rose-400/20 text-rose-200 border border-rose-400/55">
          Topic
        </span>
        <span className={`font-mono text-sm font-black ${textColor}`}>
          Power-supply chain · AC source → rectifier → capacitor filter → DC output
        </span>
        <span className="ml-auto font-mono text-[11px] text-rose-200">
          Industry standard: bridge rectifier + shunt capacitor
        </span>
      </div>

      {/* SHOWDOWN TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg} overflow-x-auto`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-4 flex items-center gap-2">
          <Activity size={12} /> Three rectifier topologies · side-by-side
        </div>
        <table className="w-full font-mono text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: 'rgba(244,63,94,0.3)' }}>
              <th className={`text-left p-3 text-[10px] uppercase tracking-widest ${subText}`}>Parameter</th>
              <th className="p-3 text-[10px] uppercase tracking-widest text-rose-300">Half-Wave</th>
              <th className="p-3 text-[10px] uppercase tracking-widest text-amber-300">Centre-Tapped</th>
              <th className="p-3 text-[10px] uppercase tracking-widest text-emerald-300">Bridge ★</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <motion.tr
                key={r.param}
                initial={{ opacity: 0, x: -10 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="border-b"
                style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
              >
                <td className={`p-3 text-[11px] uppercase tracking-widest ${subText}`}>{r.param}</td>
                <td className={`p-3 text-center ${textColor}`}>{r.half}</td>
                <td className={`p-3 text-center ${textColor}`}>{r.center}</td>
                <td className={`p-3 text-center font-black text-emerald-300 bg-emerald-500/10`}>{r.bridge}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-5 p-4 rounded-xl border-2 border-emerald-400 bg-emerald-500/10"
        >
          <div className="flex items-start gap-3">
            <Trophy className="text-emerald-300 mt-0.5 shrink-0" size={20} />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-1">Industry winner</div>
              <p className={`text-sm ${textColor}`}>
                The <strong>bridge rectifier</strong> wins on every count: low ripple, high V_dc,
                small PIV (no 2× back-pressure), and no need for a bulky centre-tapped transformer.
                Pair it with a <strong>shunt capacitor filter</strong> and ripple drops below 5% —
                that is the standard linear power supply found in every textbook and a thousand
                consumer products.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* FULL PIPELINE · 4 stages */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-5 flex items-center gap-2">
          <Battery size={12} /> The full power-supply pipeline · 4 stages
        </div>
        <div className="grid lg:grid-cols-[repeat(4,1fr_auto)_1fr] gap-3 items-stretch">
          {PIPELINE.map((s, i) => (
            <React.Fragment key={s.title}>
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.92 }} animate={isActive ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.5 + 0.1 * i, type: 'spring', stiffness: 200 }}
                className="rounded-2xl p-5 border-2 flex flex-col gap-2 relative overflow-hidden text-center"
                style={{ borderColor: `${s.accent}55`, background: `${s.accent}11` }}
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: s.accent }}>
                  {s.tag}
                </div>
                <div className="text-3xl font-black mb-1" style={{ color: s.accent }}>{s.sym}</div>
                <h3 className={`text-base font-black ${textColor}`}>{s.title}</h3>
                <p className={`text-[11px] font-mono ${subText}`}>{s.desc}</p>
              </motion.div>
              {i < PIPELINE.length - 1 && (
                <div className="hidden lg:flex items-center justify-center px-1">
                  <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}>
                    <ArrowRight className="opacity-40" size={18} />
                  </motion.div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* TAKEAWAYS */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <h3 className={`text-xl font-black ${textColor} mb-4`}>What you walk away with</h3>
        <ul className={`space-y-2 text-sm ${subText}`}>
          <li className="flex gap-2">
            <span className="text-emerald-300 font-mono">▸</span>
            <span><strong className="text-emerald-200">Diode</strong> = one-way valve. Real silicon needs ~0.7 V to open.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-300 font-mono">▸</span>
            <span><strong className="text-emerald-200">Half-wave rectifier</strong> wastes 50% of input. V_dc = 0.318 V_m, ripple 121%. Unusable alone.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-300 font-mono">▸</span>
            <span><strong className="text-emerald-200">Bridge rectifier</strong> captures both halves. V_dc = 0.636 V_m, ripple 48%. The industry standard.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-300 font-mono">▸</span>
            <span><strong className="text-emerald-200">Capacitor filter</strong> sits in parallel with the load. Drops ripple below 5%. Bigger C → smoother output.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-300 font-mono">▸</span>
            <span>The whole signal chain in 1 line: <span className="font-mono text-cyan-300">AC mains</span> → <span className="font-mono text-violet-300">rectifier</span> → <span className="font-mono text-amber-300">filter</span> → <span className="font-mono text-emerald-300">DC out</span>.</span>
          </li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText}`}
      >
        Module 04 · Rectifiers &amp; Filters · complete
      </motion.div>
    </div>
  );
};
