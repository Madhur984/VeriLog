import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Sparkles, ArrowLeftRight } from 'lucide-react';
import type { SceneProps } from '../types';
import { TextbookEquation } from '../../../ui/TextbookEquation';

export const S03_DeMorgan: React.FC<SceneProps> = ({ isActive, isDarkMode, mode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const accent = mode === 'nand' ? '#22d3ee' : '#fb923c';

  // Both laws shown - but the one most relevant to the current mode is highlighted
  const primaryMath = mode === 'nand'
    ? "\\overline{A \\cdot B} = \\overline{A} + \\overline{B}"
    : "\\overline{A + B} = \\overline{A} \\cdot \\overline{B}";
  const secondaryMath = mode === 'nand'
    ? "\\overline{A + B} = \\overline{A} \\cdot \\overline{B}"
    : "\\overline{A \\cdot B} = \\overline{A} + \\overline{B}";

  const intro = mode === 'nand'
    ? 'Inverting the output of an AND is mathematically identical to inverting the inputs of an OR. This is the bridge that lets us build OR (and everything else) using only NAND.'
    : 'Inverting the output of an OR is mathematically identical to inverting the inputs of an AND. This is the bridge that lets us build AND (and everything else) using only NOR.';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: accent }}>
          <GitBranch size={14} /> Step 2 · The Secret Weapon
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>De Morgan's Bridge.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>{intro}</p>
      </section>

      {/* The two laws - primary one shown bigger */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest mb-5 flex items-center gap-2"
             style={{ color: accent }}>
          <Sparkles size={12} /> Two laws · symmetry between AND and OR
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Primary law - relevant to current mode */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl p-6 border-2 text-center"
            style={{ borderColor: accent, background: `${accent}15`, boxShadow: `0 0 30px ${accent}33` }}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: accent }}>
              Most useful for {mode.toUpperCase()}
            </div>
            <div className="py-2">
              <TextbookEquation math={primaryMath} block={false} />
            </div>
            <div className={`text-xs mt-3 ${subText}`}>
              {mode === 'nand'
                ? 'Once you see this, OR is just NAND with inverted inputs.'
                : 'Once you see this, AND is just NOR with inverted inputs.'}
            </div>
          </motion.div>

          {/* Secondary law */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl p-6 border-2 text-center"
            style={{ borderColor: `${accent}55`, background: `${accent}08` }}
          >
            <div className={`font-mono text-[10px] uppercase tracking-widest mb-3 ${subText}`}>
              Dual law (also true)
            </div>
            <div className="py-2">
              <TextbookEquation math={secondaryMath} block={false} />
            </div>
            <div className={`text-xs mt-3 ${subText}`}>
              The same idea, swapping AND ↔ OR. Both laws are siblings.
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bridge visual - bubble migration */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest mb-5 flex items-center gap-2"
             style={{ color: accent }}>
          <ArrowLeftRight size={12} /> Visual: bubbles migrate from output to inputs
        </div>

        <svg viewBox="0 0 800 200" className="w-full h-auto">
          {/* LEFT: NAND symbol (or NOR symbol) */}
          <g>
            <line x1="20" y1="60" x2="80" y2="60" stroke={accent} strokeWidth="2.5" />
            <line x1="20" y1="120" x2="80" y2="120" stroke={accent} strokeWidth="2.5" />
            <text x="6" y="64" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={accent}>A</text>
            <text x="6" y="124" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={accent}>B</text>
            {mode === 'nand' ? (
              <path d="M 80 40 L 120 40 A 50 50 0 0 1 120 140 L 80 140 Z" fill="none" stroke={accent} strokeWidth="2.5" />
            ) : (
              <path d="M 80 35 Q 105 90 80 145 Q 165 132 200 90 Q 165 48 80 35 Z" fill="none" stroke={accent} strokeWidth="2.5" />
            )}
            <circle cx={mode === 'nand' ? 178 : 207} cy="90" r="5" fill="none" stroke={accent} strokeWidth="2.5" />
            <line x1={mode === 'nand' ? 183 : 212} y1="90" x2="280" y2="90" stroke={accent} strokeWidth="2.5" />
            <text x="232" y="76" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={accent}>
              ({mode === 'nand' ? 'A·B' : 'A+B'})′
            </text>
          </g>

          {/* MIGRATION arrow */}
          <motion.g
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <line x1="300" y1="90" x2="380" y2="90" stroke={accent} strokeWidth="2" strokeDasharray="6 4" />
            <polygon points="380,82 395,90 380,98" fill={accent} />
            <text x="305" y="80" fontSize="10" fontFamily="monospace" fill={accent}>De Morgan</text>
          </motion.g>

          {/* RIGHT: equivalent gate (OR with inverted inputs / AND with inverted inputs) */}
          <g>
            {/* Inverted inputs (bubbles) */}
            <line x1="430" y1="60" x2="480" y2="60" stroke={accent} strokeWidth="2.5" />
            <line x1="430" y1="120" x2="480" y2="120" stroke={accent} strokeWidth="2.5" />
            <text x="416" y="64" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={accent}>A</text>
            <text x="416" y="124" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={accent}>B</text>
            <circle cx="486" cy="60" r="5" fill="none" stroke={accent} strokeWidth="2.5" />
            <circle cx="486" cy="120" r="5" fill="none" stroke={accent} strokeWidth="2.5" />
            {/* The opposite shape (OR for nand-mode, AND for nor-mode) */}
            {mode === 'nand' ? (
              // OR shape
              <path d="M 491 35 Q 516 90 491 145 Q 576 132 611 90 Q 576 48 491 35 Z" fill="none" stroke={accent} strokeWidth="2.5" />
            ) : (
              // AND shape
              <path d="M 491 40 L 531 40 A 50 50 0 0 1 531 140 L 491 140 Z" fill="none" stroke={accent} strokeWidth="2.5" />
            )}
            <line x1={mode === 'nand' ? 615 : 583} y1="90" x2="700" y2="90" stroke={accent} strokeWidth="2.5" />
            <text x="615" y="76" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={accent}>
              {mode === 'nand' ? 'A′ + B′' : 'A′ · B′'}
            </text>
          </g>

          {/* Legend at the bottom */}
          <text x="400" y="190" textAnchor="middle" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#475569'}>
            Same logic · two equivalent shapes
          </text>
        </svg>
      </motion.div>

      {/* Why this matters */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        className="py-2"
      >
        <h3 className={`text-lg font-black ${textColor} mb-2`}>Why this is the secret weapon</h3>
        <p className={`text-sm ${subText}`}>
          {mode === 'nand'
            ? 'Building an OR from NAND gates would be impossible without this law. The trick: invert each input first (using tied-NAND inverters), then run them through one more NAND. The output is exactly A + B.'
            : 'Building an AND from NOR gates would be impossible without this law. The trick: invert each input first (using tied-NOR inverters), then run them through one more NOR. The output is exactly A · B.'}
        </p>
      </motion.div>
    </div>
  );
};
