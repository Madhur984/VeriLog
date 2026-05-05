import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DoorOpen, Hash, ToggleLeft } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

type Bit = 0 | 1;

export const S03_IntrusionVariables: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [doors, setDoors] = useState<{ A: Bit; B: Bit; C: Bit }>({ A: 1, B: 0, C: 0 });
  const decimal = (doors.A << 2) | (doors.B << 1) | doors.C;

  const toggle = (k: 'A' | 'B' | 'C') => setDoors((d) => ({ ...d, [k]: d[k] === 1 ? 0 : 1 }));

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <DoorOpen size={14} /> Chapter 03 · The Intrusion Variables
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Three Doors</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The security system monitors three independent entry doors —{' '}
          <strong className="text-cyan-300">A · B · C</strong>. Each door is a binary sensor.
          Together they define every possible scenario the vault must respond to.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 items-stretch">
        {/* PDF page reference */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
        >
          <img
            src="/images/noir/p03.png"
            alt="The three doors A, B, C"
            className="w-full block aspect-[16/9] object-cover"
          />
          <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-cyan-200/70">
            Casebook · Page 03
          </div>
        </motion.div>

        {/* Two state legend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-8 rounded-3xl border ${cardBg} space-y-5`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Hash size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-1">Two States Only</div>
              <h3 className={`text-xl font-black ${textColor}`}>Boolean Encoding</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-5 border border-amber-400/40 bg-amber-500/10">
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-1">State 1</div>
              <p className={`text-sm font-bold ${textColor}`}>Intruder Present</p>
              <p className={`text-xs mt-2 ${subText}`}>High voltage · TRUE · the door is triggered.</p>
            </div>
            <div className="rounded-2xl p-5 border border-cyan-400/40 bg-cyan-500/10">
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 mb-1">State 0</div>
              <p className={`text-sm font-bold ${textColor}`}>Corridor Empty</p>
              <p className={`text-xs mt-2 ${subText}`}>Low voltage · FALSE · the door is silent.</p>
            </div>
          </div>

          <div className="rounded-2xl p-5 border border-cyan-400/20 bg-cyan-500/5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 mb-2">Why three?</div>
            <p className={`text-xs leading-relaxed ${subText}`}>
              n = 3 inputs ⇒ <strong className="text-cyan-300">2³ = 8</strong> possible
              scenarios. Every row of the eventual truth table is one such scenario, and the
              vault must have a precise answer for each.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Interactive toggle */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <ToggleLeft size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400">
            Live patrol · click each door
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {(['A', 'B', 'C'] as const).map((d) => {
            const v = doors[d];
            const on = v === 1;
            return (
              <button
                key={d}
                onClick={() => toggle(d)}
                className={`relative h-40 rounded-2xl border-2 overflow-hidden transition-all ${
                  on ? 'border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.35)]' : 'border-cyan-400/40'
                } ${isDarkMode ? 'bg-black/40' : 'bg-white'}`}
              >
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className={`font-mono text-[10px] uppercase tracking-widest ${on ? 'text-amber-300' : 'text-cyan-300'}`}>
                      Door {d}
                    </div>
                    <div className={`text-7xl font-black mt-2 ${on ? 'text-amber-300' : 'text-cyan-300/60'}`}>
                      {v}
                    </div>
                    <div className={`text-[10px] font-mono mt-1 ${subText}`}>
                      {on ? 'Intruder' : 'Empty'}
                    </div>
                  </div>
                </div>
                {on && (
                  <motion.div
                    layoutId={`pulse-${d}`}
                    className="absolute inset-0 bg-gradient-to-tr from-amber-400/10 via-transparent to-amber-400/20"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-3 items-center">
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-1">Binary</div>
            <div className={`text-xl font-black font-mono ${textColor}`}>
              ({doors.A}, {doors.B}, {doors.C})
            </div>
          </div>
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-1">Decimal · Row</div>
            <div className={`text-xl font-black font-mono ${textColor}`}>m{decimal}</div>
          </div>
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-1">Term</div>
            <div className={`text-xl font-black font-mono ${textColor}`}>
              {(doors.A ? 'A' : 'A′')}{(doors.B ? 'B' : 'B′')}{(doors.C ? 'C' : 'C′')}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
