import React from 'react';
import { motion } from 'framer-motion';
import { Atom, Users, Lock } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S02_GoodBoyHostel: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-orange-400">
          <Atom size={14} /> Chapter 02 · Pure Silicon
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Good Boy Hostel</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Intrinsic silicon. 14 electrons per atom - but only the outer 4 (the valence shell)
          matter for chemistry. Each atom shares its 4 valence electrons with 4 neighbours,
          forming covalent bonds. <strong className="text-orange-300">Net current = 0.</strong>{' '}
          <em>Ekdum pure, no milawat.</em>
        </p>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img loading="lazy" decoding="async"
          src="/images/semi/p02.webp"
          alt="Pure silicon - the good boy hostel"
          className="w-full block aspect-[16/9] object-cover"
        />
        <div className="hidden sm:block absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-orange-200/80">
          Madhur&apos;s Lab · Page 02
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { Icon: Atom,  title: 'The Physics',     d: 'Si is tetravalent - 4 valence electrons. Each pairs with a neighbour to form a stable covalent bond.', accent: 'text-orange-300', bg: 'bg-orange-500/10', border: 'border-orange-400/40' },
          { Icon: Users, title: 'The Translation', d: 'A strict 4-seater hostel room. Every electron has its assigned bed; nobody wanders in the corridor.', accent: 'text-amber-300',  bg: 'bg-amber-500/10',  border: 'border-amber-400/40' },
          { Icon: Lock,  title: 'The Problem',     d: 'No movement = no current. At absolute zero, intrinsic Si is a perfect insulator.',                       accent: 'text-rose-300',   bg: 'bg-rose-500/10',   border: 'border-rose-400/40' },
        ].map((c) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
            className={`p-5 rounded-2xl border ${c.border} ${c.bg}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <c.Icon size={16} className={c.accent} />
              <span className={`font-mono text-[10px] uppercase tracking-widest ${c.accent}`}>{c.title}</span>
            </div>
            <p className={`text-sm ${subText} leading-relaxed`}>{c.d}</p>
          </motion.div>
        ))}
      </div>

      {/* Numbers strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400 mb-5">Silicon by the numbers</div>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { v: '14', l: 'Total electrons' },
            { v: '4',  l: 'Valence electrons' },
            { v: '4',  l: 'Covalent bonds / atom' },
            { v: '0',  l: 'Net current at 0K' },
          ].map((s) => (
            <div key={s.l} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className={`text-3xl font-black font-mono text-orange-300`}>{s.v}</div>
              <div className={`text-[11px] font-mono mt-1 opacity-70 ${textColor}`}>{s.l}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
