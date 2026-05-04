import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, ChevronRight, Layers3 } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const GRID = [
  [0, 1, 3, 2],
  [4, 5, 7, 6],
  [12, 13, 15, 14],
  [8, 9, 11, 10],
];

const PREMIUM = new Set([0, 1, 2, 6, 8, 10, 13, 14]);

interface Op {
  id: string;
  title: string;
  rooms: number[];
  result: string;
  resultParts: Array<{ literal: string; reason: string }>;
  story: string;
}

const OPS: Op[] = [
  {
    id: 'corner',
    title: 'Operation 1 · The Corner Suite',
    rooms: [0, 2, 8, 10],
    result: "B'D'",
    resultParts: [
      { literal: "B'", reason: 'B = 0 in all four corner rooms' },
      { literal: "D'", reason: 'D = 0 in all four corner rooms' },
    ],
    story:
      'Remember the torus! The four extreme corners cluster as a perfect 2×2 wing through the wrap-around corridors. A and C fluctuate across them; B and D stay 0.',
  },
  {
    id: 'vertical',
    title: 'Operation 2 · The Vertical Corridor',
    rooms: [2, 6, 14, 10],
    result: "CD'",
    resultParts: [
      { literal: 'C',  reason: 'C = 1 in all four rooms' },
      { literal: "D'", reason: 'D = 0 in all four rooms' },
    ],
    story:
      'Rooms 6 and 14 form a pair of 2 — but Madhur thinks bigger. Using the top/bottom wrap-around they connect with rooms 2 and 10 to form a massive group of 4.',
  },
  {
    id: 'pair',
    title: 'Operation 3 · The Standard Pair',
    rooms: [0, 1],
    result: "A'B'C'",
    resultParts: [
      { literal: "A'", reason: 'A = 0' },
      { literal: "B'", reason: 'B = 0' },
      { literal: "C'", reason: 'C = 0' },
    ],
    story:
      'Room 1 is still unassigned. It shares a wall with Room 0. Even though Room 0 is already in the Corner Suite, a room can belong to multiple wings if it helps the system.',
  },
  {
    id: 'lone',
    title: 'Operation 4 · The Lone VIP',
    rooms: [13],
    result: "ABC'D",
    resultParts: [
      { literal: 'A',  reason: 'A = 1' },
      { literal: 'B',  reason: 'B = 1' },
      { literal: "C'", reason: 'C = 0' },
      { literal: 'D',  reason: 'D = 1' },
    ],
    story:
      'Room 13 is isolated. No premium neighbours up, down, left or right. It cannot be grouped — it gets its own dedicated single-room HVAC unit (a wing of size 2⁰ = 1).',
  },
];

export const S09_Operations: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [opIdx, setOpIdx] = useState(0);
  const op = OPS[opIdx];
  const opRoomSet = new Set(op.rooms);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <Building2 size={14} /> Chapter 09 · The Operations
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Four Operations</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Madhur walks the manifest one wing at a time. Each operation collapses several rooms into a short
          product term by spotting which variables stay constant across the wing.
        </p>
      </section>

      {/* Operation switcher */}
      <div className="flex flex-wrap gap-2">
        {OPS.map((o, i) => (
          <button
            key={o.id}
            onClick={() => setOpIdx(i)}
            className={`px-4 py-2 rounded-xl text-[11px] font-mono font-bold transition-all ${
              opIdx === i
                ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-500/30'
                : isDarkMode ? 'bg-white/5 border border-white/10 hover:border-cyan-400' : 'bg-slate-50 border border-slate-200 hover:border-cyan-400'
            }`}
          >
            {o.title}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
        {/* Visual grid with wing highlighted */}
        <motion.div
          key={op.id}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="grid grid-cols-[80px_repeat(4,minmax(0,1fr))] gap-1.5 items-end mb-1">
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300/80">A,B ↓</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300/80">C,D →</div>
            </div>
            {['00', '01', '11', '10'].map((cd, c) => (
              <div key={c} className="text-center font-mono text-sm text-cyan-300/90">{cd}</div>
            ))}
          </div>
          <div className="space-y-1.5">
            {['00', '01', '11', '10'].map((ab, r) => (
              <div key={r} className="grid grid-cols-[80px_repeat(4,minmax(0,1fr))] gap-1.5 items-stretch">
                <div className="flex items-center justify-end font-mono text-sm text-cyan-300/90">{ab}</div>
                {GRID[r].map((m, c) => {
                  const isPremium = PREMIUM.has(m);
                  const inWing = opRoomSet.has(m);
                  return (
                    <div
                      key={c}
                      className="aspect-square rounded-lg flex flex-col items-center justify-center font-mono font-black border-2 transition-all relative"
                      style={{
                        background: inWing
                          ? 'rgba(34,211,238,0.20)'
                          : isPremium
                          ? 'rgba(252,211,77,0.10)'
                          : isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                        borderColor: inWing
                          ? '#22d3ee'
                          : isPremium
                          ? 'rgba(252,211,77,0.4)'
                          : isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        boxShadow: inWing ? '0 0 22px rgba(34,211,238,0.4)' : undefined,
                      }}
                    >
                      <span className={`text-2xl ${inWing ? 'text-cyan-300' : isPremium ? 'text-amber-300' : isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {isPremium ? '1' : m}
                      </span>
                      <span className="text-[9px] opacity-50">{m.toString(2).padStart(4, '0')}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <p className={`text-[11px] mt-4 ${subText}`}>{op.story}</p>
        </motion.div>

        {/* Result derivation */}
        <motion.div
          key={op.id + '-r'}
          initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-3">{op.title.split(' · ')[0]}</div>
          <h3 className={`text-2xl font-black mb-4 ${textColor}`}>{op.title.split(' · ').slice(1).join(' · ')}</h3>
          <div className="space-y-2 mb-5">
            <div className={`text-[11px] uppercase tracking-widest font-mono ${subText}`}>Rooms in wing</div>
            <div className="flex gap-2 flex-wrap">
              {op.rooms.map((m) => (
                <span key={m} className="px-3 py-1 rounded-md bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 font-mono text-sm font-bold">
                  m{m}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2 mb-5">
            <div className={`text-[11px] uppercase tracking-widest font-mono ${subText}`}>Constant variables</div>
            <ul className="space-y-2">
              {op.resultParts.map((p, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/40 text-amber-300 font-mono text-sm font-bold">
                    {p.literal}
                  </span>
                  <ChevronRight size={12} className="opacity-30" />
                  <span className={`text-[12px] ${subText}`}>{p.reason}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-cyan-400/30' : 'bg-cyan-50 border-cyan-300'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-1">Resulting wing term</div>
            <div className="font-mono text-2xl font-black text-cyan-300">{op.result}</div>
          </div>
        </motion.div>
      </div>

      {/* Operation tracker */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Layers3 size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">All four wings · running tally</span>
        </div>
        <div className="grid md:grid-cols-4 gap-3">
          {OPS.map((o, i) => (
            <div
              key={o.id}
              className={`p-3 rounded-2xl border transition-all ${
                opIdx === i ? 'border-cyan-400/50 bg-cyan-500/10' : isDarkMode ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 mb-1">Op {i + 1}</div>
              <div className={`text-xs font-bold ${textColor} mb-1`}>{o.title.split(' · ')[1]}</div>
              <div className="font-mono text-amber-300 text-lg font-black">{o.result}</div>
            </div>
          ))}
        </div>
        <div className={`mt-5 p-4 rounded-2xl border font-mono text-base text-amber-300 ${isDarkMode ? 'bg-black/30 border-amber-400/30' : 'bg-amber-50 border-amber-300'}`}>
          Y = B′D′ + CD′ + A′B′C′ + ABC′D
        </div>
      </motion.div>
    </div>
  );
};
