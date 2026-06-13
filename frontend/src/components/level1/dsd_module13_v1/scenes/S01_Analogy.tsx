import React from 'react';
import { motion } from 'framer-motion';
import { Route, Car, Ticket, Clipboard, Cpu, Layers, ArrowRight } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const SKY = '#38bdf8';
const EMERALD = '#34d399';
const AMBER = '#f59e0b';
const VIOLET = '#a78bfa';

/** A tiny toll-plaza illustration: `lanes` booths side by side with cars queued. */
const TollPlaza: React.FC<{ lanes: number; color: string; ink: string; boxFill: string }> = ({ lanes, color, ink, boxFill }) => {
  const W = 260, slot = W / lanes;
  return (
    <svg viewBox={`0 0 ${W} 120`} className="w-full h-auto">
      {/* road */}
      <rect x={0} y={70} width={W} height={50} fill={ink} opacity="0.06" />
      {/* booths */}
      {Array.from({ length: lanes }).map((_, i) => {
        const cx = slot * i + slot / 2;
        return (
          <g key={i}>
            <rect x={cx - 10} y={36} width={20} height={20} rx={3} fill={boxFill} stroke={color} strokeWidth="1.6" />
            <rect x={cx - 14} y={30} width={28} height={6} rx={2} fill={color} opacity="0.7" />
            {/* a car under each open booth */}
            <rect x={cx - 9} y={84} width={18} height={11} rx={3} fill={color} opacity="0.9" />
          </g>
        );
      })}
    </svg>
  );
};

const MAP: Array<{ Icon: React.FC<any>; highway: string; hardware: string; note: string; color: string }> = [
  { Icon: Car,       highway: 'A car in the queue',        hardware: 'A binary bit',        note: 'Each car waiting in line is one bit of an operand.', color: SKY },
  { Icon: Layers,    highway: 'The queue of cars',         hardware: 'A shift register',    note: 'Two queues (Register A and Register B) hold the two numbers, lowest bit at the front.', color: SKY },
  { Icon: Cpu,       highway: 'The toll booth',            hardware: 'One full adder',      note: 'Every car passes through the same single booth - the one reused full adder.', color: VIOLET },
  { Icon: Ticket,    highway: 'The ticket it prints',      hardware: 'The carry bit',       note: 'The booth hands each car a ticket carrying vital info for the next car: the carry-out.', color: AMBER },
  { Icon: Clipboard, highway: "The booth's clipboard",     hardware: 'A D flip-flop',       note: 'The booth clips the last ticket to a clipboard so it can give it to the next car: carry memory.', color: AMBER },
  { Icon: Route,     highway: 'One car per green light',   hardware: 'One clock cycle',     note: 'Each tick of the clock lets exactly one pair of bits through the booth.', color: EMERALD },
];

export const S01_Analogy: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const ink       = isDarkMode ? '#e2e8f0' : '#0f172a';
  const boxFill   = isDarkMode ? '#0a0e1a' : '#ffffff';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* header */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: SKY }}>
          <Route size={14} /> The Bright Highway of Logic
        </div>
        <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${textColor}`}>
          A toll plaza, and <span style={{ color: SKY }}>two ways</span> to build it.
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${subText}`}>
          Adding binary numbers is a queue of cars reaching a toll plaza. You can build a giant
          plaza with a booth for every lane, or one small booth that every car passes through in
          turn. Same cars, same total toll collected. The only thing that changes is how much
          concrete you pour and how long the line takes.
        </p>
      </motion.section>

      {/* parallel vs serial */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
                    className={`p-6 rounded-3xl border ${cardBg}`}>
          <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: AMBER }}>The parallel adder</div>
          <h3 className={`text-xl font-extrabold mb-3 ${textColor}`}>Eight lanes, all open</h3>
          <div className={`rounded-2xl border p-3 mb-4 ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <TollPlaza lanes={8} color={AMBER} ink={ink} boxFill={boxFill} />
          </div>
          <ul className={`space-y-2 text-sm ${subText}`}>
            <li>• Like eight toll booths open at once, every car pays in the same instant.</li>
            <li>• One full adder <em>per bit</em>: the whole sum lands in a single clock cycle.</li>
            <li>• <strong style={{ color: AMBER }}>Blazing fast, but it eats space and hardware.</strong></li>
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
                    className={`p-6 rounded-3xl border ${cardBg}`}>
          <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: SKY }}>The serial adder</div>
          <h3 className={`text-xl font-extrabold mb-3 ${textColor}`}>A single lane</h3>
          <div className={`rounded-2xl border p-3 mb-4 ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <TollPlaza lanes={1} color={SKY} ink={ink} boxFill={boxFill} />
          </div>
          <ul className={`space-y-2 text-sm ${subText}`}>
            <li>• Like one booth: cars pass through one by one, in a patient line.</li>
            <li>• A single full adder, reused every clock cycle, bit after bit.</li>
            <li>• <strong style={{ color: SKY }}>Slower, but tiny - minimal space and hardware.</strong></li>
          </ul>
        </motion.div>
      </div>

      {/* the mapping */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="text-center mb-6">
          <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: SKY }}>Mapping the metaphor</div>
          <h3 className={`text-2xl font-black ${textColor}`}>Every part of the plaza is a real component</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MAP.map(({ Icon, highway, hardware, note, color }) => (
            <div key={hardware} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}26`, border: `1px solid ${color}55` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div className="min-w-0">
                  <div className={`text-[13px] font-bold truncate ${textColor}`}>{highway}</div>
                  <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest" style={{ color }}>
                    <ArrowRight size={10} /> {hardware}
                  </div>
                </div>
              </div>
              <p className={`mt-2 text-[12px] leading-relaxed ${subText}`}>{note}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* the clipboard close */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-6 md:p-8 rounded-3xl border-2 text-center`}
                  style={{ borderColor: `${AMBER}66`, background: isDarkMode ? 'rgba(245,158,11,0.06)' : 'rgba(245,158,11,0.05)' }}>
        <Clipboard size={28} className="mx-auto mb-2" style={{ color: AMBER }} />
        <p className={`text-lg md:text-xl font-bold leading-relaxed max-w-3xl mx-auto ${textColor}`}>
          The one trick that makes it work: the booth must remember the last ticket it printed.
          It clips that carry bit to a <span style={{ color: AMBER }}>clipboard</span> - a D
          flip-flop - and hands it to the next car that arrives. Without that memory, a serial
          adder is just a full adder that forgets. With it, a single booth can add numbers of any
          length.
        </p>
      </motion.div>
    </div>
  );
};

export default S01_Analogy;
