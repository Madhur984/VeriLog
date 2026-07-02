import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Camera } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

interface Row { feature: string; n: string; p: string; }

const ROWS: Row[] = [
  { feature: 'Impurity added',   n: 'Pentavalent (Group V)',          p: 'Trivalent (Group III)' },
  { feature: 'Examples',         n: 'P, As, Sb',                      p: 'B, Ga, In' },
  { feature: 'Squad size',       n: '5 friends (1 extra)',            p: '3 friends (1 missing)' },
  { feature: 'Terminology',      n: 'Donor atom',                      p: 'Acceptor atom' },
  { feature: 'Majority carrier', n: 'Electron (negative)',             p: 'Hole (positive)' },
  { feature: 'Minority carrier', n: 'Hole',                            p: 'Electron' },
  { feature: 'Net charge',       n: 'Neutral',                         p: 'Neutral' },
  { feature: 'Symbol colour',    n: 'Orange (this module)',            p: 'Magenta (this module)' },
];

export const S09_CheatSheet: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          <ClipboardList size={14} /> Chapter 09 · Cheat Sheet
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Screenshot This for the Mid-Term</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The definitive extrinsic-semiconductor cheat sheet. One row per question your professor
          will ask. Photograph it now or let your eyes burn it in.
        </p>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img loading="lazy" decoding="async" src="/images/semi/p11.webp" alt="N vs P cheat sheet" className="w-full block aspect-[16/9] object-cover" />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-violet-200/80">
          Madhur&apos;s Lab · Page 11
        </div>
      </motion.div>

      {/* Live, interactive table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`rounded-3xl border ${cardBg} overflow-hidden`}
      >
        <div className="grid grid-cols-[1.2fr_1.5fr_1.5fr] gap-px bg-violet-500/20">
          <div className="p-4 bg-black/60 font-mono text-[10px] uppercase tracking-widest text-violet-300">
            Feature
          </div>
          <div className="p-4 bg-black/60 font-mono text-[10px] uppercase tracking-widest text-orange-300">
            N-Type
          </div>
          <div className="p-4 bg-black/60 font-mono text-[10px] uppercase tracking-widest text-fuchsia-300">
            P-Type
          </div>

          {ROWS.map((r, i) => (
            <React.Fragment key={r.feature}>
              <div className={`p-4 ${isDarkMode ? 'bg-black/40' : 'bg-slate-100'} font-mono text-xs ${textColor}`}>
                {r.feature}
              </div>
              <div className={`p-4 ${i % 2 ? 'bg-orange-500/5' : 'bg-orange-500/10'} font-mono text-xs ${textColor}`}>
                {r.n}
              </div>
              <div className={`p-4 ${i % 2 ? 'bg-fuchsia-500/5' : 'bg-fuchsia-500/10'} font-mono text-xs ${textColor}`}>
                {r.p}
              </div>
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        className={`p-6 rounded-3xl border ${cardBg} flex items-center gap-3`}
      >
        <Camera className="text-violet-300 flex-shrink-0" size={18} />
        <p className={`text-sm ${subText}`}>
          Pro tip: take a screenshot of <strong>both</strong> the casebook page and this live
          table. The casebook has the colours; the table is keyboard-searchable.
        </p>
      </motion.div>
    </div>
  );
};
