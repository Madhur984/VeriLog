import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// Tap visuals: water gushing freely (conductor), tap with valve (semi), locked castle door (insulator)
const ConductorArt: React.FC = () => (
  <svg viewBox="0 0 240 160" className="w-full h-32">
    <defs>
      <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
    </defs>
    {/* tap */}
    <rect x="100" y="30" width="40" height="40" rx="4" fill="#475569" />
    <rect x="118" y="20" width="6" height="12" fill="#94a3b8" />
    {/* water gushing — multiple streams */}
    {[80, 100, 120, 140, 160].map((x, i) => (
      <path
        key={i}
        d={`M ${x} 70 Q ${x - 6 + i * 3} 100 ${x - 12 + i * 5} 150`}
        stroke="url(#water)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />
    ))}
    {/* puddle */}
    <ellipse cx="120" cy="150" rx="100" ry="6" fill="#0891b2" opacity="0.4" />
    {/* sparkles */}
    {[40, 200].map((x, i) => (
      <g key={i}>
        <line x1={x} y1="30" x2={x + 6} y2="36" stroke="#67e8f9" strokeWidth="2" />
        <line x1={x} y1="36" x2={x + 6} y2="30" stroke="#67e8f9" strokeWidth="2" />
      </g>
    ))}
  </svg>
);

const SemiArt: React.FC = () => (
  <svg viewBox="0 0 240 160" className="w-full h-32">
    {/* arch / gateway */}
    <path d="M 50 140 L 50 70 Q 120 20 190 70 L 190 140 Z" fill="#fb923c" opacity="0.18" stroke="#fb923c" strokeWidth="2" />
    {/* valve / wheel */}
    <circle cx="120" cy="80" r="22" fill="#1e293b" stroke="#fcd34d" strokeWidth="2.5" />
    {[0, 60, 120, 180, 240, 300].map((deg, i) => {
      const a = (deg * Math.PI) / 180;
      return (
        <line
          key={i}
          x1={120 + Math.cos(a) * 6}
          y1={80 + Math.sin(a) * 6}
          x2={120 + Math.cos(a) * 22}
          y2={80 + Math.sin(a) * 22}
          stroke="#fcd34d"
          strokeWidth="2.5"
        />
      );
    })}
    <circle cx="120" cy="80" r="5" fill="#fcd34d" />
    {/* pipe */}
    <rect x="60" y="100" width="120" height="14" rx="2" fill="#475569" />
    {/* labels OPEN/CLOSED arrows */}
    <text x="60" y="135" fontFamily="monospace" fontSize="9" fontWeight="900" fill="#22d3ee">OPEN</text>
    <text x="155" y="135" fontFamily="monospace" fontSize="9" fontWeight="900" fill="#f43f5e">CLOSED</text>
    {/* arrow flow on left */}
    <path d="M 30 107 L 55 107 L 50 102 M 55 107 L 50 112" stroke="#22d3ee" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M 210 107 L 185 107" stroke="#f43f5e" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3 3" />
  </svg>
);

const InsulatorArt: React.FC = () => (
  <svg viewBox="0 0 240 160" className="w-full h-32">
    {/* castle wall */}
    <rect x="40" y="60" width="160" height="90" fill="#a21caf" opacity="0.18" stroke="#a21caf" strokeWidth="2" />
    {/* battlements */}
    {[40, 70, 100, 130, 160, 190].map((x, i) => (
      <rect key={i} x={x} y={50} width="20" height="14" fill="#a21caf" opacity="0.5" />
    ))}
    {/* brick pattern */}
    {Array.from({ length: 4 }).map((_, r) =>
      Array.from({ length: 8 }).map((_, c) => (
        <rect
          key={`${r}-${c}`}
          x={42 + c * 20 + (r % 2) * 10}
          y={66 + r * 14}
          width="18"
          height="12"
          fill="none"
          stroke="#fb923c"
          strokeWidth="0.8"
          opacity="0.6"
        />
      ))
    )}
    {/* door */}
    <path d="M 100 150 L 100 110 Q 120 95 140 110 L 140 150 Z" fill="#1e293b" stroke="#fcd34d" strokeWidth="2" />
    {/* lock */}
    <rect x="115" y="125" width="10" height="14" rx="2" fill="#fcd34d" />
    <circle cx="120" cy="123" r="4" fill="none" stroke="#fcd34d" strokeWidth="2" />
    {/* X over the door */}
    <line x1="105" y1="115" x2="135" y2="148" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="135" y1="115" x2="105" y2="148" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

interface Card {
  Art: React.FC;
  title: string;
  tag: string;
  desc: string;
  facts: string[];
  color: string;
}

const CARDS: Card[] = [
  {
    Art: ConductorArt,
    title: 'CONDUCTORS',
    tag: 'The Free',
    desc: 'Charge moves on its own. Apply any voltage and current pours through.',
    facts: ['Sea of free electrons', 'Examples: Cu, Ag, Al', 'Cannot be stopped'],
    color: '#22d3ee',
  },
  {
    Art: SemiArt,
    title: 'SEMICONDUCTORS',
    tag: 'The Controllable',
    desc: 'A valve we can open or close. Conductivity sits exactly between conductors and insulators — and we dictate when they play.',
    facts: ['Si, Ge, GaAs', 'Negative temperature coefficient', 'Heart of every chip'],
    color: '#fb923c',
  },
  {
    Art: InsulatorArt,
    title: 'INSULATORS',
    tag: 'The Locked',
    desc: 'A locked castle. Charge cannot enter or leave under normal conditions.',
    facts: ['Bound electrons', 'Examples: glass, rubber, mica', 'Cannot be opened'],
    color: '#a21caf',
  },
];

export const S02_QuestForControl: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-sky-400">
          <Compass size={14} /> Chapter 02 · The Quest
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Quest for Control</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Every electronic device on Earth comes down to one quest — the quest for{' '}
          <strong>control</strong> over electric current. Three families of materials offer three
          different answers.
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-6">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.1 }}
            className={`p-6 rounded-3xl border-2 relative overflow-hidden ${cardBg}`}
            style={{ borderColor: `${c.color}40` }}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl" style={{ background: `${c.color}1f` }} />
            <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: c.color }}>{c.tag}</div>
            <h3 className={`text-2xl font-black mb-4 ${textColor}`}>{c.title}</h3>
            <div className="rounded-2xl p-2 mb-4 border" style={{ background: isDarkMode ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.6)', borderColor: `${c.color}33` }}>
              <c.Art />
            </div>
            <p className={`text-sm leading-relaxed mb-4 ${subText}`}>{c.desc}</p>
            <ul className="space-y-1.5">
              {c.facts.map((f) => (
                <li key={f} className={`text-[12px] flex items-start gap-2 ${subText}`}>
                  <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Key takeaway */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-6 rounded-3xl border ${cardBg} text-center`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-orange-400 mb-2">The thesis</div>
        <p className={`text-base leading-relaxed ${textColor}`}>
          Conductors are too generous. Insulators are too strict. The sweet spot — and the entire reason
          modern electronics exists — is the <strong className="text-orange-300">semiconductor</strong>: a
          material we can flip between conducting and not conducting on demand.
        </p>
      </motion.div>
    </div>
  );
};
