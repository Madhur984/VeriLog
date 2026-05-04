import React from 'react';
import { motion } from 'framer-motion';
import { Castle, Cable, Cpu, ScrollText } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

interface Blueprint {
  type: string;
  Icon: React.FC<any>;
  tag: string;
  egRange: string;
  conduction: string;
  valence: string;
  examples: string[];
  color: string;
  text: string;
}

const BLUEPRINTS: Blueprint[] = [
  {
    type: 'INSULATOR',
    Icon: Castle,
    tag: 'No traffic',
    egRange: 'Eg > 5 eV',
    conduction: 'Empty',
    valence: 'Full',
    examples: ['Diamond · 5.5 eV', 'Glass', 'Mica'],
    color: '#a21caf',
    text: 'The expressway is miles above the gully. The gap is so wide that thermal energy alone cannot ionise an electron. Traffic is impossible.',
  },
  {
    type: 'SEMICONDUCTOR',
    Icon: Cpu,
    tag: 'Controlled traffic',
    egRange: 'Eg ≈ 0.5 – 3 eV',
    conduction: 'Lightly populated at 300 K',
    valence: 'Mostly full',
    examples: ['Si · 1.1 eV', 'Ge · 0.67 eV', 'GaAs · 1.43 eV'],
    color: '#fb923c',
    text: 'A small but real gap. At room temperature a tiny fraction of electrons cross naturally. We can dial conductivity up or down with heat, light or doping.',
  },
  {
    type: 'CONDUCTOR',
    Icon: Cable,
    tag: 'Uncontrolled traffic',
    egRange: 'Eg ≈ 0 (overlap)',
    conduction: 'Already populated',
    valence: 'Already overlapping',
    examples: ['Cu', 'Ag', 'Al'],
    color: '#22d3ee',
    text: 'The gully merges directly into the expressway. The bands overlap so electrons are always free. Apply any field and current flows immediately.',
  },
];

const BandDiagram: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  const isInsulator = type === 'INSULATOR';
  const isConductor = type === 'CONDUCTOR';
  // Insulator: huge gap. Semi: modest gap. Conductor: overlap.

  const cbY = isInsulator ? 30 : isConductor ? 95 : 65;
  const vbY = isConductor ? 85 : 130;
  const cbH = 22;
  const vbH = 22;

  return (
    <svg viewBox="0 0 200 180" className="w-full h-44">
      <defs>
        <linearGradient id={`cb-${type}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </linearGradient>
        <linearGradient id={`vb-${type}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>
      </defs>
      {/* CB */}
      <rect x="20" y={cbY} width="160" height={cbH} rx="3" fill={`url(#cb-${type})`} opacity="0.95" />
      <text x="100" y={cbY + 15} textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="900" fill="#fff">
        Conduction Band
      </text>
      {/* VB */}
      <rect x="20" y={vbY} width="160" height={vbH} rx="3" fill={`url(#vb-${type})`} opacity="0.95" />
      <text x="100" y={vbY + 15} textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="900" fill="#fff">
        Valence Band
      </text>
      {/* Eg arrow (only when distinct) */}
      {!isConductor && (
        <g>
          <line x1="100" y1={cbY + cbH} x2="100" y2={vbY} stroke={color} strokeWidth="2" />
          <polygon points={`97,${cbY + cbH + 4} 103,${cbY + cbH + 4} 100,${cbY + cbH}`} fill={color} />
          <polygon points={`97,${vbY - 4} 103,${vbY - 4} 100,${vbY}`} fill={color} />
          <text x="106" y={(cbY + cbH + vbY) / 2 + 4} fontFamily="monospace" fontSize="10" fontWeight="900" fill={color}>
            Eg
          </text>
        </g>
      )}
      {/* Some electrons in CB for semi/conductor, none for insulator */}
      {!isInsulator && [40, 70, 100, 130, 160].map((x, i) => (
        <circle key={i} cx={x} cy={cbY + cbH / 2} r="3" fill="#fde68a" />
      ))}
      {/* Many electrons in VB always */}
      {[35, 55, 75, 95, 115, 135, 155, 175].map((x, i) => (
        <circle key={i} cx={x} cy={vbY + vbH / 2} r="3" fill="#fbcfe8" opacity="0.85" />
      ))}
    </svg>
  );
};

export const S11_MasterBlueprint: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-indigo-400">
          <ScrollText size={14} /> Chapter 11 · The Comparison
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Master Blueprint</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          One picture. Three personalities. Place the energy bands side by side and the entire taxonomy
          of electrical materials becomes obvious.
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-6">
        {BLUEPRINTS.map((b, i) => (
          <motion.div
            key={b.type}
            initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 + i * 0.12 }}
            whileHover={{ y: -6 }}
            className={`p-6 rounded-3xl border-2 ${cardBg} relative overflow-hidden`}
            style={{ borderColor: `${b.color}55` }}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl" style={{ background: `${b.color}1f` }} />
            <div className="flex items-start justify-between mb-4 relative">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: b.color }}>{b.tag}</div>
                <h3 className={`text-xl font-black ${textColor}`}>{b.type}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${b.color}22`, border: `1px solid ${b.color}66`, color: b.color }}>
                <b.Icon size={18} />
              </div>
            </div>
            <div className="rounded-2xl p-2 mb-4 border" style={{ background: 'rgba(0,0,0,0.3)', borderColor: `${b.color}33` }}>
              <BandDiagram type={b.type} color={b.color} />
            </div>
            <p className={`text-[13px] leading-relaxed mb-4 ${subText}`}>{b.text}</p>
            <div className="space-y-2">
              <div className={`flex justify-between items-center px-2 py-1.5 rounded-lg`} style={{ background: 'rgba(0,0,0,0.2)' }}>
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Eg range</span>
                <span className="font-mono text-[12px] font-black" style={{ color: b.color }}>{b.egRange}</span>
              </div>
              <div className={`flex justify-between items-center px-2 py-1.5 rounded-lg`} style={{ background: 'rgba(0,0,0,0.2)' }}>
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Conduction band</span>
                <span className="font-mono text-[11px] font-black text-cyan-300">{b.conduction}</span>
              </div>
              <div className={`flex justify-between items-center px-2 py-1.5 rounded-lg`} style={{ background: 'rgba(0,0,0,0.2)' }}>
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Valence band</span>
                <span className="font-mono text-[11px] font-black text-fuchsia-300">{b.valence}</span>
              </div>
              <div className="pt-2 border-t" style={{ borderColor: `${b.color}33` }}>
                <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-1">Examples</div>
                <div className="flex flex-wrap gap-1">
                  {b.examples.map((e) => (
                    <span key={e} className="px-2 py-0.5 rounded font-mono text-[11px]" style={{ background: `${b.color}1f`, color: b.color, border: `1px solid ${b.color}55` }}>
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Closing strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-8 rounded-3xl border ${cardBg} text-center`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-orange-400 mb-3">The intrinsic story ends here</div>
        <p className={`text-base leading-relaxed ${textColor}`}>
          You now know how to read any energy-band diagram in the world. Insulators are locked, conductors
          are uncontrolled, semiconductors are the perfect jump.{' '}
          <strong className="text-orange-300">Pure Silicon at 1.1 eV is just the blank canvas</strong> — in the
          next module we add impurities and start painting.
        </p>
      </motion.div>
    </div>
  );
};
