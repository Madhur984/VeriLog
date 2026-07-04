import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Sparkles, ToggleLeft, ToggleRight } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive: boolean; isDarkMode: boolean; }

const GRID = [
  [0, 1, 3, 2],
  [4, 5, 7, 6],
  [12, 13, 15, 14],
  [8, 9, 11, 10],
];

// PDF case study: F = Σm(5,7) + Σd(13,15)
// If we treat 13 & 15 as 1, we get a 2×2 wing {5,7,13,15} → C·D
// If we treat them as 0, we only get {5,7} → A'B·C·D (smaller wing)
const ONES = new Set([5, 7]);
const DONTCARE = new Set([13, 15]);

export const S11_DontCare: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [absorb, setAbsorb] = useState(true);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const wingMembers = absorb ? new Set([5, 7, 13, 15]) : new Set([5, 7]);
  const wingTerm = absorb ? 'C · D' : "A' · B · C · D";
  const wingSize = absorb ? 4 : 2;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          <Wrench size={14} /> Chapter 11 · Advanced Tactic
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Don&apos;t Care Loophole</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Some inputs are impossible or simply don&apos;t matter. K-Maps mark these as <span className="font-mono text-violet-300">X</span>.
          To Madhur, an <strong>X</strong> is a <em>room under maintenance</em> - he can <strong>upgrade it for free</strong> if
          doing so doubles the size of a wing. Otherwise he treats it as a 0 and ignores it.
        </p>
        <div className={`inline-block p-4 rounded-2xl border ${cardBg} font-mono text-base`}>
          F = Σm(5, 7) + Σd(13, 15)
        </div>
      </section>

      {/* Toggle + visualization */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative p-6 rounded-3xl border ${cardBg}`}
      >
        <TryItYourself corner />
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400">Madhur&apos;s decision</div>
            <div className={`text-base font-bold mt-1 ${textColor}`}>
              Treat the X rooms as {absorb ? <span className="text-violet-300">1 (absorb into wing)</span> : <span className="text-slate-400">0 (ignore)</span>}
            </div>
          </div>
          <button
            onClick={() => setAbsorb((a) => !a)}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border-2 transition-all ${
              absorb
                ? 'border-violet-400 bg-violet-500/15 text-violet-200'
                : isDarkMode ? 'border-white/10 hover:border-violet-400 text-slate-300' : 'border-slate-200 hover:border-violet-400 text-slate-600'
            }`}
          >
            {absorb ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
            <span className="font-mono text-sm font-bold">Absorb X</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
          {/* The grid */}
          <div>
            <div className="grid grid-cols-[80px_repeat(4,minmax(0,1fr))] gap-1.5 items-end mb-1">
              <div className="text-right">
                <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300/80">A,B ↓</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300/80">C,D →</div>
              </div>
              {['00', '01', '11', '10'].map((cd, c) => (
                <div key={c} className="text-center font-mono text-sm text-violet-300/90">{cd}</div>
              ))}
            </div>
            <div className="space-y-1.5">
              {['00', '01', '11', '10'].map((ab, r) => (
                <div key={r} className="grid grid-cols-[80px_repeat(4,minmax(0,1fr))] gap-1.5 items-stretch">
                  <div className="flex items-center justify-end font-mono text-sm text-violet-300/90">{ab}</div>
                  {GRID[r].map((m, c) => {
                    const isOne = ONES.has(m);
                    const isDC = DONTCARE.has(m);
                    const inWing = wingMembers.has(m);
                    let label = `${m}`;
                    if (isOne) label = '1';
                    if (isDC) label = absorb && inWing ? '1' : 'X';
                    return (
                      <div
                        key={c}
                        className="aspect-square rounded-lg flex flex-col items-center justify-center font-mono font-black border-2 transition-all relative"
                        style={{
                          background: inWing
                            ? 'rgba(167,139,250,0.22)'
                            : isOne || isDC
                            ? 'rgba(167,139,250,0.08)'
                            : isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                          borderColor: inWing
                            ? '#a78bfa'
                            : isDC
                            ? 'rgba(167,139,250,0.4)'
                            : isOne
                            ? 'rgba(252,211,77,0.4)'
                            : isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          boxShadow: inWing ? '0 0 18px rgba(167,139,250,0.4)' : undefined,
                          borderStyle: isDC && !inWing ? 'dashed' : 'solid',
                        }}
                      >
                        <span className={`text-2xl ${
                          inWing ? 'text-violet-200'
                          : isOne ? 'text-amber-300'
                          : isDC ? 'text-violet-400'
                          : isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {label}
                        </span>
                        <span className="text-[9px] opacity-50">{m.toString(2).padStart(4, '0')}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Result panel */}
          <div className="space-y-4">
            <div className={`p-5 rounded-2xl border ${absorb ? 'border-violet-400/40 bg-violet-500/10' : isDarkMode ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-slate-50'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400 mb-1">Wing size</div>
              <div className={`text-3xl font-black mb-3 ${textColor}`}>{wingSize} cell{wingSize > 1 ? 's' : ''}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400 mb-1">Resulting term</div>
              <div className={`font-mono text-2xl font-black ${absorb ? 'text-violet-300' : 'text-slate-400'}`}>{wingTerm}</div>
            </div>
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-2">Why it matters</div>
              <p className={`text-[12px] leading-relaxed ${subText}`}>
                {absorb
                  ? 'Absorbing 13 and 15 turns a tiny pair-wing into a 2×2 wing. We just deleted A and B from the term - fewer literals = fewer gates = a smaller circuit.'
                  : 'Ignoring 13 and 15 leaves a 2-cell wing that pins down all four variables. The implementation is unnecessarily large.'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rule of thumb */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-violet-400" />
          <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400">Madhur&apos;s rule of thumb</div>
        </div>
        <p className={`text-base leading-relaxed ${textColor}`}>
          For every X you encounter: ask <em>“does treating this as 1 grow my wing to the next power of two?”</em>
          If yes - absorb it. If no - leave it as 0. Never circle an X just to circle it; X must <strong>earn</strong> its place
          in the wing.
        </p>
      </motion.div>
    </div>
  );
};
