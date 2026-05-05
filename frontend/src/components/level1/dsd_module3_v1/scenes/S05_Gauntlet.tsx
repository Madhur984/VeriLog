import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Network, ArrowLeft, ArrowRight } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

type Bit = 0 | 1;

export const S05_Gauntlet: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  // Live signal-flow state
  const [a, setA] = useState<Bit>(1);
  const [b, setB] = useState<Bit>(1);
  const [c, setC] = useState<Bit>(0);
  const cn = useMemo(() => (c === 0 ? 1 : 0) as Bit, [c]);
  const ab = useMemo(() => ((a && b) ? 1 : 0) as Bit, [a, b]);
  const acn = useMemo(() => ((a && cn) ? 1 : 0) as Bit, [a, cn]);
  const y = useMemo(() => ((ab || acn) ? 1 : 0) as Bit, [ab, acn]);

  const wireColor = (v: Bit, base: string) => v === 1 ? base : '#475569';
  const wireGlow = (v: Bit) => v === 1 ? 'drop-shadow(0 0 6px currentColor)' : 'none';

  const stages = [
    { idx: '01', label: 'Inputs',       d: 'A · B · C arrive on three wires from the doors.' },
    { idx: '02', label: 'Inverter',     d: 'C is fed through a NOT gate to become C′.' },
    { idx: '03', label: 'AND Path 1',   d: 'A and B are AND-ed → produces A·B.' },
    { idx: '04', label: 'AND Path 2',   d: 'A and C′ are AND-ed → produces A·C′.' },
    { idx: '05', label: 'Final OR',     d: 'Both paths are OR-ed → output Y.' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <Network size={14} /> Chapter 05 · The Gauntlet
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Maze of Logic</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          A maze of logic. To find the master code, Madhur must execute an{' '}
          <strong className="text-amber-300">End-to-Start analysis</strong> — beginning at the
          Vault Output Y and walking <em>backward</em> to the inputs.
        </p>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img
          src="/images/noir/p05.png"
          alt="The Gauntlet — full circuit map"
          className="w-full block aspect-[16/9] object-cover"
        />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-amber-200/70">
          Casebook · Page 05
        </div>
      </motion.div>

      {/* Custom SVG of the same circuit, annotated */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">Annotated schematic</span>
          <div className="flex items-center gap-2 text-[10px] font-mono opacity-60">
            <ArrowLeft size={12} /> Trace direction <ArrowRight size={12} className="text-amber-300" />
          </div>
        </div>
        <svg viewBox="0 0 800 320" className="w-full h-auto">
          {/* Inputs */}
          <g fontFamily="monospace" fontSize="14" fontWeight="bold">
            <text x="20" y="80"  fill="#fbbf24">A</text>
            <text x="20" y="160" fill="#22d3ee">B</text>
            <text x="20" y="240" fill="#a78bfa">C</text>
          </g>

          {/* Wires from inputs */}
          <line x1="35" y1="76"  x2="180" y2="76"  stroke="#fbbf24" strokeWidth="2" />
          <line x1="35" y1="156" x2="180" y2="156" stroke="#22d3ee" strokeWidth="2" />
          <line x1="35" y1="236" x2="120" y2="236" stroke="#a78bfa" strokeWidth="2" />

          {/* NOT gate */}
          <polygon points="120,225 155,236 120,247" fill="none" stroke="#a78bfa" strokeWidth="2" />
          <circle cx="159" cy="236" r="3" fill="none" stroke="#a78bfa" strokeWidth="2" />
          <text x="124" y="270" fill="#a78bfa" fontFamily="monospace" fontSize="11">NOT</text>
          <line x1="163" y1="236" x2="220" y2="236" stroke="#a78bfa" strokeWidth="2" />
          <text x="170" y="225" fill="#a78bfa" fontFamily="monospace" fontSize="11">C′</text>

          {/* AND gate 1 — A·B */}
          <line x1="180" y1="76"  x2="220" y2="100" stroke="#fbbf24" strokeWidth="2" />
          <line x1="180" y1="156" x2="220" y2="124" stroke="#22d3ee" strokeWidth="2" />
          <path d="M 220 90 L 250 90 A 22 22 0 0 1 250 134 L 220 134 Z" fill="none" stroke="#fcd34d" strokeWidth="2" />
          <text x="227" y="115" fill="#fcd34d" fontFamily="monospace" fontSize="11">AND</text>
          <line x1="272" y1="112" x2="380" y2="112" stroke="#fcd34d" strokeWidth="2" />
          <text x="285" y="100" fill="#fcd34d" fontFamily="monospace" fontSize="11" fontWeight="bold">A·B</text>

          {/* Wire A → AND2 */}
          <line x1="180" y1="76"  x2="180" y2="186" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
          <line x1="180" y1="186" x2="220" y2="186" stroke="#fbbf24" strokeWidth="2" />
          <line x1="220" y1="236" x2="220" y2="210" stroke="#a78bfa" strokeWidth="2" />

          {/* AND gate 2 — A·C' */}
          <path d="M 220 176 L 250 176 A 22 22 0 0 1 250 220 L 220 220 Z" fill="none" stroke="#fcd34d" strokeWidth="2" />
          <text x="227" y="201" fill="#fcd34d" fontFamily="monospace" fontSize="11">AND</text>
          <line x1="272" y1="198" x2="380" y2="198" stroke="#fcd34d" strokeWidth="2" />
          <text x="285" y="186" fill="#fcd34d" fontFamily="monospace" fontSize="11" fontWeight="bold">A·C′</text>

          {/* OR gate (final) */}
          <path d="M 380 80 Q 400 155 380 230 Q 440 220 470 155 Q 440 90 380 80 Z" fill="none" stroke="#34d399" strokeWidth="2" />
          <text x="395" y="160" fill="#34d399" fontFamily="monospace" fontSize="13" fontWeight="bold">OR</text>
          <line x1="470" y1="155" x2="570" y2="155" stroke="#34d399" strokeWidth="3" />

          {/* Y output */}
          <rect x="570" y="135" width="80" height="40" rx="6" fill="none" stroke="#34d399" strokeWidth="2" />
          <text x="595" y="161" fill="#34d399" fontFamily="monospace" fontSize="18" fontWeight="bold">Y</text>
          <text x="570" y="195" fill="#94a3b8" fontFamily="monospace" fontSize="10">Vault</text>

          {/* Arrows backward (highlight) */}
          <line x1="700" y1="160" x2="650" y2="160" stroke="#f43f5e" strokeWidth="2" />
          <polygon points="650,154 645,160 650,166" fill="#f43f5e" />
          <text x="665" y="190" fill="#f43f5e" fontFamily="monospace" fontSize="10">START</text>
          <text x="665" y="180" fill="#f43f5e" fontFamily="monospace" fontSize="9">HERE</text>
        </svg>
      </motion.div>

      {/* Live signal-flow lab */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.18 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">Live signal flow · toggle the doors</span>
          <span className={`font-mono text-[11px] ${subText}`}>Y = {y}</span>
        </div>

        <div className="flex gap-3 mb-5 flex-wrap">
          {([
            { k: 'A', v: a, set: setA, color: '#fbbf24' },
            { k: 'B', v: b, set: setB, color: '#22d3ee' },
            { k: 'C', v: c, set: setC, color: '#a78bfa' },
          ] as const).map((g) => (
            <button
              key={g.k}
              onClick={() => g.set(g.v === 1 ? 0 : 1)}
              className="px-5 py-2.5 rounded-xl border-2 font-mono font-black transition-all"
              style={{
                borderColor: g.color,
                color: g.v ? '#000' : g.color,
                backgroundColor: g.v ? g.color : 'transparent',
                boxShadow: g.v ? `0 0 18px ${g.color}55` : 'none',
              }}
            >
              {g.k} = {g.v}
            </button>
          ))}
        </div>

        <svg viewBox="0 0 800 320" className="w-full h-auto">
          {/* Inputs */}
          <text x="20" y="80"  fill="#fbbf24" fontFamily="monospace" fontSize="14" fontWeight="bold">A = {a}</text>
          <text x="20" y="160" fill="#22d3ee" fontFamily="monospace" fontSize="14" fontWeight="bold">B = {b}</text>
          <text x="20" y="240" fill="#a78bfa" fontFamily="monospace" fontSize="14" fontWeight="bold">C = {c}</text>

          {/* A wires - split */}
          <line x1="80" y1="76" x2="180" y2="76" stroke={wireColor(a, '#fbbf24')} strokeWidth="2.5" style={{ color: '#fbbf24', filter: wireGlow(a) }} />
          <line x1="80" y1="76" x2="80" y2="186" stroke={wireColor(a, '#fbbf24')} strokeWidth="2" />
          <line x1="80" y1="186" x2="220" y2="186" stroke={wireColor(a, '#fbbf24')} strokeWidth="2" style={{ color: '#fbbf24', filter: wireGlow(a) }} />

          {/* B wire to AND1 */}
          <line x1="80" y1="156" x2="180" y2="156" stroke={wireColor(b, '#22d3ee')} strokeWidth="2.5" style={{ color: '#22d3ee', filter: wireGlow(b) }} />

          {/* C through NOT */}
          <line x1="80" y1="236" x2="120" y2="236" stroke={wireColor(c, '#a78bfa')} strokeWidth="2.5" style={{ color: '#a78bfa', filter: wireGlow(c) }} />
          <polygon points="120,225 155,236 120,247" fill="none" stroke="#a78bfa" strokeWidth="2" />
          <circle cx="159" cy="236" r="3" fill="none" stroke="#a78bfa" strokeWidth="2" />
          <text x="120" y="265" fill="#a78bfa" fontFamily="monospace" fontSize="10">NOT</text>
          <line x1="163" y1="236" x2="220" y2="236" stroke={wireColor(cn, '#a78bfa')} strokeWidth="2.5" style={{ color: '#a78bfa', filter: wireGlow(cn) }} />
          <text x="170" y="225" fill="#a78bfa" fontFamily="monospace" fontSize="11">C&apos;={cn}</text>
          <line x1="220" y1="236" x2="220" y2="210" stroke={wireColor(cn, '#a78bfa')} strokeWidth="2" />

          {/* AND1 */}
          <line x1="180" y1="76" x2="220" y2="100" stroke={wireColor(a, '#fbbf24')} strokeWidth="2" />
          <line x1="180" y1="156" x2="220" y2="124" stroke={wireColor(b, '#22d3ee')} strokeWidth="2" />
          <path d="M 220 90 L 250 90 A 22 22 0 0 1 250 134 L 220 134 Z" fill="none" stroke="#fcd34d" strokeWidth="2.5" />
          <text x="227" y="115" fill="#fcd34d" fontFamily="monospace" fontSize="11">AND</text>
          <line x1="272" y1="112" x2="380" y2="112" stroke={wireColor(ab, '#fcd34d')} strokeWidth="3" style={{ color: '#fcd34d', filter: wireGlow(ab) }} />
          <text x="290" y="100" fill="#fcd34d" fontFamily="monospace" fontSize="11" fontWeight="bold">A·B={ab}</text>

          {/* AND2 */}
          <path d="M 220 176 L 250 176 A 22 22 0 0 1 250 220 L 220 220 Z" fill="none" stroke="#fcd34d" strokeWidth="2.5" />
          <text x="227" y="201" fill="#fcd34d" fontFamily="monospace" fontSize="11">AND</text>
          <line x1="272" y1="198" x2="380" y2="198" stroke={wireColor(acn, '#fcd34d')} strokeWidth="3" style={{ color: '#fcd34d', filter: wireGlow(acn) }} />
          <text x="290" y="186" fill="#fcd34d" fontFamily="monospace" fontSize="11" fontWeight="bold">A·C&apos;={acn}</text>

          {/* OR */}
          <path d="M 380 80 Q 400 155 380 230 Q 440 220 470 155 Q 440 90 380 80 Z" fill="none" stroke="#34d399" strokeWidth="2.5" />
          <text x="395" y="160" fill="#34d399" fontFamily="monospace" fontSize="13" fontWeight="bold">OR</text>

          {/* Output */}
          <line x1="470" y1="155" x2="570" y2="155" stroke={wireColor(y, '#34d399')} strokeWidth="3.5" style={{ color: '#34d399', filter: wireGlow(y) }} />
          <rect x="570" y="130" width="100" height="50" rx="8"
            fill={y ? '#34d399' : 'none'}
            stroke="#34d399" strokeWidth="2.5"
            style={{ filter: y ? 'drop-shadow(0 0 18px rgba(52,211,153,0.7))' : 'none' }}
          />
          <text x="600" y="163" fill={y ? '#000' : '#34d399'} fontFamily="monospace" fontSize="22" fontWeight="bold">Y={y}</text>
          <text x="570" y="200" fill="#94a3b8" fontFamily="monospace" fontSize="10">Vault</text>
        </svg>

        <p className={`text-xs ${subText} mt-3 text-center`}>
          When a wire is dim, it carries 0; when it glows, it carries 1. Walk every wire from
          inputs to Y and verify the gate rules — that&apos;s a manual simulation.
        </p>
      </motion.div>

      {/* Stage breakdown */}
      <div className="grid md:grid-cols-5 gap-3">
        {stages.map((s, i) => (
          <motion.div
            key={s.idx}
            initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05 * i + 0.2 }}
            className={`p-4 rounded-2xl border ${cardBg}`}
          >
            <div className="font-mono text-[10px] text-amber-400 mb-1">{s.idx}</div>
            <h4 className={`font-black text-sm ${textColor} mb-1`}>{s.label}</h4>
            <p className={`text-xs ${subText} leading-relaxed`}>{s.d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
