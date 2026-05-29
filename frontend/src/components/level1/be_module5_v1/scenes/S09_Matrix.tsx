import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid3x3, Shield, Sun as SunIcon, Aperture, Trophy, LucideIcon, Baby } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

type Row = {
  id: 'zener' | 'led' | 'photo';
  Icon: LucideIcon;
  name: string;
  bias: 'Reverse Bias' | 'Forward Bias';
  energy: string;
  mechanism: string;
  use: string;
  accent: string;
};

const ROWS: Row[] = [
  {
    id: 'zener', Icon: Shield, name: 'Zener Diode', bias: 'Reverse Bias',
    energy: 'Electrical → Voltage Limit',
    mechanism: 'Zener / Avalanche Breakdown',
    use: 'Voltage regulators · over-voltage protection · reference rails',
    accent: '#ef4444',
  },
  {
    id: 'led', Icon: SunIcon, name: 'Light-Emitting Diode (LED)', bias: 'Forward Bias',
    energy: 'Electrical → Optical',
    mechanism: 'Electroluminescence',
    use: 'Indicators · displays · backlights · optical signalling',
    accent: '#fbbf24',
  },
  {
    id: 'photo', Icon: Aperture, name: 'Photodiode', bias: 'Reverse Bias',
    energy: 'Optical → Electrical',
    mechanism: 'Minority Carrier Photogeneration',
    use: 'Cameras · light sensors · fiber optic receivers · solar cells',
    accent: '#a78bfa',
  },
];

export const S09_Matrix: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [open, setOpen] = useState<Row['id'] | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-2">
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-fuchsia-300">
          <Grid3x3 size={14} /> Closing · Diagnostic Matrix
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor} tracking-tight`}>
          Three VIPs. <span className="text-fuchsia-300">One table.</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Click any row to expand the specialist&apos;s working-region card. Bias direction,
          energy conversion, and defining mechanism - all in one glance.
        </p>
      </motion.section>

      {/* Like you're 5 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 border-2"
        style={{ borderColor: '#facc1555', background: 'linear-gradient(135deg, rgba(250,204,21,0.10), rgba(232,121,249,0.06))' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Baby size={16} className="text-yellow-300" />
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-yellow-300 font-black">Like you&apos;re 5</div>
        </div>
        <p className={`text-sm ${subText} leading-relaxed`}>
          This is the <strong>team photo</strong>. Three superhero toys side by side. Each row
          shows one toy and three facts about it: which way it likes to face (bias), what magic it
          does (energy), and the trick behind the magic (mechanism). Tap a row to read what it&apos;s
          used for in real life.
        </p>
      </motion.div>

      {/* Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`rounded-3xl border ${cardBg} overflow-hidden`}
      >
        <div className="grid grid-cols-12 text-[10px] font-mono uppercase tracking-[0.2em] text-fuchsia-300 px-6 py-4 border-b" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
          <div className="col-span-3">Diode Type</div>
          <div className="col-span-2">Operating State</div>
          <div className="col-span-3">Energy Conversion</div>
          <div className="col-span-4">Defining Mechanism</div>
        </div>

        {ROWS.map((r, i) => {
          const isOpen = open === r.id;
          return (
            <div key={r.id}>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.07 }}
                onClick={() => setOpen(isOpen ? null : r.id)}
                className="w-full grid grid-cols-12 items-center px-6 py-5 border-b text-left transition-all hover:bg-white/[0.03]"
                style={{
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                  background: isOpen ? `${r.accent}11` : 'transparent',
                }}
              >
                <div className="col-span-3 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg grid place-items-center"
                    style={{ background: `${r.accent}22`, color: r.accent }}
                  >
                    <r.Icon size={18} />
                  </div>
                  <div className={`font-black text-base ${textColor}`} style={{ color: isOpen ? r.accent : undefined }}>{r.name}</div>
                </div>
                <div className="col-span-2 font-mono text-sm" style={{ color: r.accent }}>{r.bias}</div>
                <div className={`col-span-3 font-mono text-sm ${textColor}`}>{r.energy}</div>
                <div className={`col-span-4 font-mono text-sm ${textColor}`}>{r.mechanism}</div>
              </motion.button>

              <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden"
                style={{ background: `${r.accent}08` }}
              >
                <div className="px-6 py-5">
                  <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: r.accent }}>Where you&apos;ll find it</div>
                  <div className={`text-sm ${textColor}`}>{r.use}</div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* Summary callouts */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className={`p-6 rounded-2xl border ${cardBg} relative overflow-hidden`}
        >
          <Trophy size={20} className="text-fuchsia-300 mb-3" />
          <div className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-300 mb-1">Two regions</div>
          <div className={`text-sm ${textColor} leading-relaxed`}>Zener and Photodiode live in <strong>reverse bias</strong>. LED lives in <strong>forward bias</strong>. The bias direction picks the role.</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.78 }}
          className={`p-6 rounded-2xl border ${cardBg} relative overflow-hidden`}
        >
          <Trophy size={20} className="text-amber-300 mb-3" />
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-1">Three energy paths</div>
          <div className={`text-sm ${textColor} leading-relaxed`}>One holds <strong>voltage</strong>, one emits <strong>photons</strong>, one absorbs <strong>photons</strong>. Same crystal, different exploits.</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.86 }}
          className={`p-6 rounded-2xl border ${cardBg} relative overflow-hidden`}
        >
          <Trophy size={20} className="text-violet-300 mb-3" />
          <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-1">Three mechanisms</div>
          <div className={`text-sm ${textColor} leading-relaxed`}>Breakdown · Recombination · Photogeneration. Three doors into the same band structure.</div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 1.0 }}
        className={`p-8 rounded-3xl border ${cardBg} text-center space-y-2`}
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(251,191,36,0.06) 50%, rgba(168,85,247,0.08) 100%)'
            : 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(251,191,36,0.05) 50%, rgba(168,85,247,0.06) 100%)',
        }}
      >
        <div className={`text-2xl md:text-3xl font-black ${textColor}`}>
          The Neon Diode Gala wraps up. <span className="text-fuchsia-300">Module 05 complete.</span>
        </div>
        <p className={`text-sm ${subText}`}>Press ← anytime to revisit a VIP.</p>
      </motion.div>
    </div>
  );
};
