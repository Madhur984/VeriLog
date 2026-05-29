import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Volume2 } from 'lucide-react';
import type { SceneProps } from '../types';
import { CustomVideoPlayer } from '../../../ui/CustomVideoPlayer';

export const S01_Video: React.FC<SceneProps> = ({ isActive, isDarkMode, mode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const accent = mode === 'nand' ? '#22d3ee' : '#fb923c';

  const videoSrc = mode === 'nand' ? '/videos/NAND_Universality.mp4' : '/videos/NOR_Universality.mp4';

  const beats = mode === 'nand'
    ? [
        { t: 'NAND atom',     line: 'Y = (A·B)′ · the AND output, then inverted.' },
        { t: 'NOT in 1 NAND', line: 'Tie inputs together: (A·A)′ = A′.' },
        { t: 'AND in 2',      line: 'Take NAND, then invert it again with a second tied-NAND.' },
        { t: 'OR in 3',       line: 'Invert each input first; combine via De Morgan.' },
        { t: 'XOR in 4',      line: 'The classic cross-weave. 4-gate symmetry.' },
      ]
    : [
        { t: 'NOR atom',      line: 'Y = (A+B)′ · the OR output, then inverted.' },
        { t: 'NOT in 1 NOR',  line: 'Tie inputs together: (A+A)′ = A′.' },
        { t: 'OR in 2',       line: 'Take NOR, then invert it again with a tied-NOR.' },
        { t: 'AND in 3',      line: 'Invert each input first; combine via De Morgan.' },
        { t: 'XNOR in 4',     line: 'Equality detector · symmetric 4-gate construction.' },
      ];

  const title = mode === 'nand' ? 'NAND Universality' : 'NOR Universality';

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: accent }}>
          <PlayCircle size={14} /> Lecture · {title}
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Watch the construction once.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Every level explained end-to-end — atom → NOT → AND/OR → the dual → XOR/XNOR. Once you
          have the shape of the journey, the chapters that follow drill into each step.
        </p>
      </section>

      <motion.div
        key={videoSrc}
        initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg} shadow-2xl`}
      >
        <CustomVideoPlayer src={videoSrc} accent={accent} />
        <div
          className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur border font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 pointer-events-none"
          style={{ borderColor: `${accent}55`, color: accent }}
        >
          <Volume2 size={12} /> {title}
        </div>
      </motion.div>

      {/* Beats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <FileText size={14} style={{ color: accent }} />
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
            What you will see
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {beats.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={`p-4 rounded-2xl border flex gap-3 ${
                isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="font-mono text-[10px] tabular-nums mt-1" style={{ color: accent }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1">
                <div className={`text-sm font-black ${textColor}`}>{p.t}</div>
                <p className={`text-[12px] ${subText} mt-0.5 leading-relaxed`}>{p.line}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
