import React from 'react';
import { motion } from 'framer-motion';
import { Mountain, Building2 } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S03_HostelVsTapri: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-orange-400">
          <Mountain size={14} /> Chapter 03 · Energy Bands
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Hostel vs Tapri</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          To conduct, an electron must <strong className="text-orange-300">leave the valence
          band</strong> and reach the conduction band. The vertical gap between them is the
          <strong className="text-orange-300"> energy gap E_g</strong>. For silicon, E_g ≈ 1.1 eV.
        </p>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img src="/images/semi/p03.webp" alt="Energy gap - hostel vs tapri" className="w-full block aspect-[16/9] object-cover" />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-orange-200/80">
          Madhur&apos;s Lab · Page 03
        </div>
      </motion.div>

      {/* Custom band diagram */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400 mb-5">
          Energy band diagram · interactive comparison
        </div>
        <svg viewBox="0 0 700 320" className="w-full h-auto">
          <defs>
            <linearGradient id="condBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fdba74" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="valBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Conductor (no gap) */}
          <text x="100" y="20" fill="#94a3b8" fontFamily="monospace" fontSize="11" textAnchor="middle">CONDUCTOR</text>
          <rect x="40" y="40" width="120" height="100" fill="url(#condBand)" />
          <rect x="40" y="140" width="120" height="100" fill="url(#valBand)" />
          <text x="100" y="260" fill="#94a3b8" fontFamily="monospace" fontSize="9" textAnchor="middle">bands overlap · always conducts</text>

          {/* Semiconductor (small gap) */}
          <text x="350" y="20" fill="#fdba74" fontFamily="monospace" fontSize="11" textAnchor="middle" fontWeight="bold">SEMICONDUCTOR</text>
          <rect x="290" y="40" width="120" height="80" fill="url(#condBand)" />
          <rect x="290" y="200" width="120" height="80" fill="url(#valBand)" />
          {/* Gap with hatching */}
          <rect x="290" y="120" width="120" height="80" fill="rgba(0,0,0,0.4)" stroke="#fb923c" strokeWidth="1" strokeDasharray="4 3" />
          <text x="350" y="155" fill="#fdba74" fontFamily="monospace" fontSize="13" textAnchor="middle" fontWeight="bold">E_g</text>
          <text x="350" y="170" fill="#fdba74" fontFamily="monospace" fontSize="9" textAnchor="middle">≈ 1.1 eV</text>
          <text x="350" y="300" fill="#94a3b8" fontFamily="monospace" fontSize="9" textAnchor="middle">small gap · jumpable with heat</text>

          {/* Insulator (huge gap) */}
          <text x="600" y="20" fill="#94a3b8" fontFamily="monospace" fontSize="11" textAnchor="middle">INSULATOR</text>
          <rect x="540" y="40" width="120" height="40" fill="url(#condBand)" opacity="0.4" />
          <rect x="540" y="240" width="120" height="40" fill="url(#valBand)" />
          <rect x="540" y="80" width="120" height="160" fill="rgba(0,0,0,0.3)" stroke="#475569" strokeWidth="1" strokeDasharray="4 3" />
          <text x="600" y="160" fill="#94a3b8" fontFamily="monospace" fontSize="13" textAnchor="middle" fontWeight="bold">E_g</text>
          <text x="600" y="175" fill="#94a3b8" fontFamily="monospace" fontSize="9" textAnchor="middle">≈ 5+ eV</text>
          <text x="600" y="300" fill="#94a3b8" fontFamily="monospace" fontSize="9" textAnchor="middle">too wide · stays insulating</text>

          {/* Band labels left */}
          <text x="20" y="80" fill="#fdba74" fontFamily="monospace" fontSize="10" textAnchor="end">Conduction</text>
          <text x="20" y="92" fill="#fdba74" fontFamily="monospace" fontSize="10" textAnchor="end">Band</text>
          <text x="20" y="240" fill="#38bdf8" fontFamily="monospace" fontSize="10" textAnchor="end">Valence</text>
          <text x="20" y="252" fill="#38bdf8" fontFamily="monospace" fontSize="10" textAnchor="end">Band</text>
        </svg>

        <div className="mt-5 grid sm:grid-cols-3 gap-3">
          {[
            { v: '0 eV',     l: 'Conductors',   d: 'No gap. Bands overlap. Always conducts (metals).' },
            { v: '~1.1 eV',  l: 'Si (semicon)', d: 'Small enough that room-temp heat liberates carriers.' },
            { v: '5+ eV',    l: 'Insulators',   d: 'Too wide to jump. Glass, rubber, diamond.' },
          ].map((c) => (
            <div key={c.l} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className={`font-mono text-2xl font-black text-orange-300`}>{c.v}</div>
              <div className={`text-[10px] font-mono uppercase tracking-widest ${subText} my-1`}>{c.l}</div>
              <p className={`text-xs ${subText}`}>{c.d}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-3xl border ${cardBg} flex items-start gap-3`}
      >
        <Building2 className="text-orange-300 flex-shrink-0 mt-0.5" size={18} />
        <p className={`text-sm ${subText}`}>
          <strong className="text-orange-300">Madhur&apos;s Note:</strong> bina external energy ke,
          koi hostel se tapri nahi jaata. Without an external kick (heat or light), valence
          electrons stay locked to their atom.
        </p>
      </motion.div>
    </div>
  );
};
