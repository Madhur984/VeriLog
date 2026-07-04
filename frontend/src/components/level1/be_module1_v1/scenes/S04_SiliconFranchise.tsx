import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Shield, Star, Users } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive: boolean; isDarkMode: boolean; }

type Role = 'owners' | 'staff' | 'riders';

interface RoleInfo {
  key: Role;
  title: string;
  count: string;
  Icon: React.FC<any>;
  color: string;
  desc: string;
  details: string[];
}

const ROLES: RoleInfo[] = [
  {
    key: 'owners',
    title: 'The Owners (Nucleus)',
    count: '14 protons',
    Icon: Briefcase,
    color: '#fcd34d',
    desc: 'Fixed in the centre. Heavy, immovable, and dictate the franchise identity.',
    details: [
      '14 positively charged protons',
      '14 neutral neutrons (typical Si-28 isotope)',
      'Anchors the entire atom - every electron orbits because of them',
    ],
  },
  {
    key: 'staff',
    title: 'The Support Staff (Inner Shells)',
    count: '10 electrons',
    Icon: Shield,
    color: '#22d3ee',
    desc: 'Tightly bound electrons. They keep the internal operations running but never interact with other teams.',
    details: [
      '2 in shell K (closest to nucleus)',
      '8 in shell L',
      'Total binding energy is huge - these electrons cannot be displaced under normal conditions',
    ],
  },
  {
    key: 'riders',
    title: 'The Boundary Riders (Valence Shell)',
    count: '4 electrons',
    Icon: Star,
    color: '#f97316',
    desc: 'The 4 outer electrons. The star players on the boundary. They interact with the outside world and make the game happen.',
    details: [
      '4 electrons in shell M',
      'Lowest binding energy of the entire atom',
      'Every chemical bond, every current, every electronic effect happens here',
    ],
  },
];

export const S04_SiliconFranchise: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [selected, setSelected] = useState<Role>('riders');
  const role = ROLES.find((r) => r.key === selected)!;

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-teal-400">
          <Users size={14} /> Chapter 04 · The Franchise
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Silicon Franchise</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Picture a Silicon atom as a sports franchise. Three groups of people run the show. Click any
          role below to see who they are and what they do.
        </p>
      </section>

      <TryItYourself label="Click any role or shell" />

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
        {/* Interactive atom diagram */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          className={`p-8 rounded-3xl border ${cardBg}`}
        >
          <svg viewBox="0 0 360 360" className="w-full">
            <defs>
              <radialGradient id="franchise-glow" cx="0.5" cy="0.5" r="0.6">
                <stop offset="0%" stopColor="rgba(252,211,77,0.18)" />
                <stop offset="100%" stopColor="rgba(252,211,77,0)" />
              </radialGradient>
            </defs>
            <circle cx="180" cy="180" r="170" fill="url(#franchise-glow)" />

            {/* Valence shell (riders) */}
            <circle
              cx="180" cy="180" r="135"
              fill="none"
              stroke={selected === 'riders' ? '#f97316' : '#f97316'}
              strokeWidth={selected === 'riders' ? 2.5 : 1.5}
              opacity={selected === 'riders' ? 1 : 0.55}
              onClick={() => setSelected('riders')}
              style={{ cursor: 'pointer' }}
            />
            {[0, 90, 180, 270].map((deg, i) => {
              const a = (deg * Math.PI) / 180;
              const x = 180 + Math.cos(a) * 135;
              const y = 180 + Math.sin(a) * 135;
              return (
                <motion.circle
                  key={i}
                  cx={x} cy={y}
                  r={selected === 'riders' ? 9 : 6}
                  fill="#f97316"
                  onClick={() => setSelected('riders')}
                  style={{ cursor: 'pointer' }}
                  animate={selected === 'riders' ? {
                    filter: ['drop-shadow(0 0 0px #f97316)', 'drop-shadow(0 0 12px #f97316)', 'drop-shadow(0 0 0px #f97316)']
                  } : {}}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
              );
            })}
            {/* Inner shell L (8) */}
            <circle
              cx="180" cy="180" r="95"
              fill="none"
              stroke="#22d3ee"
              strokeWidth={selected === 'staff' ? 2.5 : 1.5}
              opacity={selected === 'staff' ? 1 : 0.45}
              onClick={() => setSelected('staff')}
              style={{ cursor: 'pointer' }}
            />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI * 2) / 8;
              const x = 180 + Math.cos(a) * 95;
              const y = 180 + Math.sin(a) * 95;
              return (
                <circle
                  key={`L-${i}`}
                  cx={x} cy={y}
                  r={selected === 'staff' ? 7 : 5}
                  fill="#22d3ee"
                  onClick={() => setSelected('staff')}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}
            {/* Inner shell K (2) */}
            <circle
              cx="180" cy="180" r="58"
              fill="none"
              stroke="#22d3ee"
              strokeWidth={selected === 'staff' ? 2.5 : 1.5}
              opacity={selected === 'staff' ? 0.85 : 0.4}
              onClick={() => setSelected('staff')}
              style={{ cursor: 'pointer' }}
            />
            {[0, 180].map((deg, i) => {
              const a = (deg * Math.PI) / 180;
              const x = 180 + Math.cos(a) * 58;
              const y = 180 + Math.sin(a) * 58;
              return (
                <circle
                  key={`K-${i}`}
                  cx={x} cy={y}
                  r={selected === 'staff' ? 7 : 5}
                  fill="#22d3ee"
                  onClick={() => setSelected('staff')}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}
            {/* Nucleus (owners) */}
            <circle
              cx="180" cy="180" r="32"
              fill="#0f172a"
              stroke={selected === 'owners' ? '#fcd34d' : '#fcd34d'}
              strokeWidth={selected === 'owners' ? 3 : 2}
              onClick={() => setSelected('owners')}
              style={{ cursor: 'pointer', filter: selected === 'owners' ? 'drop-shadow(0 0 16px #fcd34d)' : undefined }}
            />
            {/* Protons inside nucleus */}
            {Array.from({ length: 14 }).map((_, i) => {
              const a = (i * Math.PI * 2) / 14;
              const x = 180 + Math.cos(a) * 18;
              const y = 180 + Math.sin(a) * 18;
              return <circle key={i} cx={x} cy={y} r="2.6" fill="#fcd34d" />;
            })}
            <text x="180" y="186" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="12" fill="#fcd34d" pointerEvents="none">Si</text>

            {/* Labels around */}
            <text x="180" y="20" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#f97316">VALENCE · 4e⁻</text>
            <text x="180" y="345" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#22d3ee">INNER SHELLS · 10e⁻</text>
          </svg>
        </motion.div>

        {/* Role detail panel */}
        <div className="space-y-3">
          {ROLES.map((r) => {
            const active = selected === r.key;
            return (
              <button
                key={r.key}
                onClick={() => setSelected(r.key)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                  active ? '' : 'hover:translate-x-1'
                }`}
                style={{
                  borderColor: active ? r.color : isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  background: active ? `${r.color}1f` : isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${r.color}22`, border: `1px solid ${r.color}66`, color: r.color }}>
                  <r.Icon size={18} />
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-black ${active ? '' : textColor}`} style={{ color: active ? r.color : undefined }}>
                    {r.title}
                  </div>
                  <div className={`font-mono text-[11px] ${subText}`}>{r.count}</div>
                </div>
              </button>
            );
          })}

          <AnimatePresence mode="wait">
            <motion.div
              key={role.key}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className={`p-5 rounded-2xl border-2`}
              style={{ borderColor: `${role.color}55`, background: `${role.color}10` }}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: role.color }}>What they do</div>
              <p className={`text-sm leading-relaxed mb-3 ${textColor}`}>{role.desc}</p>
              <ul className="space-y-1.5">
                {role.details.map((d) => (
                  <li key={d} className={`text-[12px] flex items-start gap-2 ${subText}`}>
                    <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: role.color }} />
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
