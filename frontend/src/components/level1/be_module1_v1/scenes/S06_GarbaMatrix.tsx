import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Snowflake, Flame } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// Crystal lattice diagram: a 3x3 grid of Si atoms with bonds
const Lattice: React.FC<{ frozen: boolean }> = ({ frozen }) => {
  const atoms = [
    [0, 0], [1, 0], [2, 0],
    [0, 1], [1, 1], [2, 1],
    [0, 2], [1, 2], [2, 2],
  ];
  const cell = 110;
  return (
    <svg viewBox={`-30 -30 ${cell * 3 + 60} ${cell * 3 + 60}`} className="w-full">
      {/* Bonds (horizontal) */}
      {atoms.map(([x, y]) => (
        x < 2 && (
          <g key={`bh-${x}-${y}`}>
            <line
              x1={x * cell + 28} y1={y * cell + cell / 2 - 3}
              x2={(x + 1) * cell - 28} y2={y * cell + cell / 2 - 3}
              stroke="#ec4899" strokeWidth="2.5"
            />
            <line
              x1={x * cell + 28} y1={y * cell + cell / 2 + 3}
              x2={(x + 1) * cell - 28} y2={y * cell + cell / 2 + 3}
              stroke="#ec4899" strokeWidth="2.5"
            />
            {/* shared electrons */}
            {!frozen && (
              <motion.circle
                cx={(x + 0.5) * cell} cy={y * cell + cell / 2}
                r="4" fill="#fde68a"
                animate={{
                  cx: [x * cell + 28, (x + 1) * cell - 28, x * cell + 28],
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: (x + y) * 0.2, ease: 'linear' }}
              />
            )}
          </g>
        )
      ))}
      {/* Bonds (vertical) */}
      {atoms.map(([x, y]) => (
        y < 2 && (
          <g key={`bv-${x}-${y}`}>
            <line
              x1={x * cell + cell / 2 - 3} y1={y * cell + 28}
              x2={x * cell + cell / 2 - 3} y2={(y + 1) * cell - 28}
              stroke="#ec4899" strokeWidth="2.5"
            />
            <line
              x1={x * cell + cell / 2 + 3} y1={y * cell + 28}
              x2={x * cell + cell / 2 + 3} y2={(y + 1) * cell - 28}
              stroke="#ec4899" strokeWidth="2.5"
            />
            {!frozen && (
              <motion.circle
                cx={x * cell + cell / 2} cy={(y + 0.5) * cell}
                r="4" fill="#fde68a"
                animate={{
                  cy: [y * cell + 28, (y + 1) * cell - 28, y * cell + 28],
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: (x + y) * 0.25, ease: 'linear' }}
              />
            )}
          </g>
        )
      ))}
      {/* Atoms */}
      {atoms.map(([x, y]) => (
        <g key={`a-${x}-${y}`}>
          <circle
            cx={x * cell + cell / 2} cy={y * cell + cell / 2}
            r="26"
            fill="#0f172a"
            stroke="#ec4899"
            strokeWidth="2.5"
            style={{ filter: frozen ? 'none' : 'drop-shadow(0 0 10px rgba(236,72,153,0.3))' }}
          />
          <text
            x={x * cell + cell / 2} y={y * cell + cell / 2 + 4}
            textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="14"
            fill="#ec4899"
          >Si</text>
        </g>
      ))}
      {/* Snow / freeze overlay when frozen */}
      {frozen && Array.from({ length: 12 }).map((_, i) => {
        const x = (i * 47) % (cell * 3);
        const y = (i * 31) % (cell * 3);
        return (
          <g key={`s-${i}`} transform={`translate(${x},${y})`} opacity="0.65">
            <line x1="-4" y1="0" x2="4" y2="0" stroke="#bae6fd" strokeWidth="1.5" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#bae6fd" strokeWidth="1.5" />
            <line x1="-3" y1="-3" x2="3" y2="3" stroke="#bae6fd" strokeWidth="1.5" />
            <line x1="3" y1="-3" x2="-3" y2="3" stroke="#bae6fd" strokeWidth="1.5" />
          </g>
        );
      })}
    </svg>
  );
};

export const S06_GarbaMatrix: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [frozen, setFrozen] = useState(false);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-pink-400">
          <Music size={14} /> Chapter 06 · Covalent Bonding
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Garba Matrix</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          In a pure (intrinsic) Silicon crystal, every atom forms bonds with <strong>four neighbours</strong>,
          sharing one electron each - a perfectly synchronised dance. Picture it as a Garba: each dancer
          holds two hands, each pair is one shared electron pair, and the entire floor moves as one.
        </p>
      </section>

      {/* Toggle: room temp vs absolute zero */}
      <div className={`p-4 rounded-2xl border ${cardBg} flex items-center justify-between flex-wrap gap-4`}>
        <div className="flex items-center gap-3">
          {frozen ? <Snowflake size={16} className="text-sky-400" /> : <Flame size={16} className="text-pink-400" />}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: frozen ? '#0ea5e9' : '#ec4899' }}>
              Temperature
            </div>
            <div className={`text-sm font-bold ${textColor}`}>
              {frozen ? 'Absolute zero · 0 K · the music stops' : 'Room temperature · the dance is on'}
            </div>
          </div>
        </div>
        <div className={`relative inline-flex p-1 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
          {(['warm', 'cold'] as const).map((k) => {
            const active = (k === 'warm') !== frozen;
            return (
              <button
                key={k}
                onClick={() => setFrozen(k === 'cold')}
                className={`relative z-10 px-5 py-2 rounded-xl font-bold text-sm transition-colors ${
                  active ? 'text-black' : isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="garba-pill"
                    className={`absolute inset-0 rounded-xl ${k === 'warm' ? 'bg-pink-400' : 'bg-sky-400'}`}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{k === 'warm' ? 'Room Temp' : 'Absolute Zero'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lattice */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl" />
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <Lattice frozen={frozen} />
          </div>
          <div className="space-y-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-pink-400 mb-2">The Crystal Lattice</div>
              <p className={`text-sm leading-relaxed ${textColor}`}>
                {frozen ? (
                  <>At absolute zero there is no music. Every dancer is locked in place. The lattice is
                  rigid, no electrons are free to move, and pure Silicon behaves as a{' '}
                  <strong className="text-sky-300">perfect insulator</strong>. Resistance approaches infinity.</>
                ) : (
                  <>At room temperature the dance is alive. Yellow dots are the shared electrons hopping
                  between paired atoms - the bonds. Each Silicon shares one electron with each of its four
                  neighbours, completing an effective octet through partnership.</>
                )}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-[9px] uppercase tracking-widest text-pink-400 mb-1">Bonds per atom</div>
                <div className={`text-xl font-black ${textColor}`}>4</div>
              </div>
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-[9px] uppercase tracking-widest text-pink-400 mb-1">Effective valence</div>
                <div className={`text-xl font-black ${textColor}`}>8e⁻</div>
              </div>
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-[9px] uppercase tracking-widest text-pink-400 mb-1">Lattice type</div>
                <div className={`text-base font-black ${textColor}`}>Diamond cubic</div>
              </div>
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-[9px] uppercase tracking-widest text-pink-400 mb-1">Pure (intrinsic) Si at 0K</div>
                <div className="text-base font-black text-sky-300">insulator</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Closing line */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-3xl border ${cardBg} text-center`}
      >
        <p className={`text-base leading-relaxed ${textColor}`}>
          The Garba is the foundation of every silicon device on Earth. Now flip the toggle back to{' '}
          <strong className="text-pink-300">Room Temp</strong> and watch the next chapter - when the dhol
          drops, dancers break loose and the magic begins.
        </p>
      </motion.div>
    </div>
  );
};
