import React from 'react';
import { motion } from 'framer-motion';
import { BookCheck, Award } from 'lucide-react';
import type { SceneProps } from '../types';

export const S07_Blueprint: React.FC<SceneProps> = ({ isActive, isDarkMode, mode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const accent = mode === 'nand' ? '#22d3ee' : '#fb923c';

  // Master matrix - every gate, count, equation
  const rows = mode === 'nand'
    ? [
        { gate: 'NOT',  eq: 'A′',           count: 1, prop: 1, note: 'Tied-input NAND' },
        { gate: 'AND',  eq: 'A · B',        count: 2, prop: 2, note: 'NAND + tied-NAND inverter' },
        { gate: 'OR',   eq: 'A + B',        count: 3, prop: 2, note: 'Invert inputs, then NAND (De Morgan)' },
        { gate: 'NOR',  eq: '(A + B)′',     count: 4, prop: 3, note: 'OR (3) + tied-NAND inverter' },
        { gate: 'XOR',  eq: 'A ⊕ B',        count: 4, prop: 3, note: 'Cross-weave · 4-NAND symmetric' },
        { gate: 'XNOR', eq: '(A ⊕ B)′',     count: 5, prop: 4, note: 'XOR + tied-NAND inverter' },
      ]
    : [
        { gate: 'NOT',  eq: 'A′',           count: 1, prop: 1, note: 'Tied-input NOR' },
        { gate: 'OR',   eq: 'A + B',        count: 2, prop: 2, note: 'NOR + tied-NOR inverter' },
        { gate: 'AND',  eq: 'A · B',        count: 3, prop: 2, note: 'Invert inputs, then NOR (De Morgan)' },
        { gate: 'NAND', eq: '(A · B)′',     count: 4, prop: 3, note: 'AND (3) + tied-NOR inverter' },
        { gate: 'XNOR', eq: '(A ⊕ B)′',     count: 4, prop: 3, note: 'Symmetric 4-NOR pattern' },
        { gate: 'XOR',  eq: 'A ⊕ B',        count: 5, prop: 4, note: 'XNOR + tied-NOR inverter' },
      ];

  const totalGates = rows.reduce((s, r) => s + r.count, 0);
  const modeLabel = mode === 'nand' ? 'NANDs' : 'NORs';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: accent }}>
          <BookCheck size={14} /> Closing · Master Blueprint
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          {mode === 'nand' ? 'NAND universality · proven.' : 'NOR universality · proven.'}
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Every Boolean operation on 2 variables - and by extension, every Boolean function of any
          arity - can be physically realised using one repeated cell. Below is the complete
          construction matrix.
        </p>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg} overflow-x-auto`}
      >
        <table className="w-full font-mono text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: `${accent}33` }}>
              <th className={`text-left px-3 py-3 font-mono text-[10px] uppercase tracking-widest`} style={{ color: accent }}>Gate</th>
              <th className={`text-left px-3 py-3 font-mono text-[10px] uppercase tracking-widest`} style={{ color: accent }}>Equation</th>
              <th className={`text-center px-3 py-3 font-mono text-[10px] uppercase tracking-widest`} style={{ color: accent }}>{modeLabel}</th>
              <th className={`text-center px-3 py-3 font-mono text-[10px] uppercase tracking-widest`} style={{ color: accent }}>Delay</th>
              <th className={`text-left px-3 py-3 font-mono text-[10px] uppercase tracking-widest`} style={{ color: accent }}>Construction</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <motion.tr
                key={r.gate}
                initial={{ opacity: 0, x: -10 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="border-b"
                style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
              >
                <td className={`px-3 py-3 font-black ${textColor}`}>{r.gate}</td>
                <td className={`px-3 py-3 ${textColor}`}>{r.eq}</td>
                <td className="px-3 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full font-black"
                        style={{ background: accent, color: '#000' }}>
                    {r.count}
                  </span>
                </td>
                <td className={`px-3 py-3 text-center ${subText}`}>{r.prop} t<sub>pd</sub></td>
                <td className={`px-3 py-3 text-xs ${subText}`}>{r.note}</td>
              </motion.tr>
            ))}
            <tr className="border-t-2" style={{ borderColor: accent }}>
              <td colSpan={2} className={`px-3 py-3 font-mono text-[10px] uppercase tracking-widest font-black`} style={{ color: accent }}>
                Total · all 6 gates
              </td>
              <td className="px-3 py-3 text-center">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full font-black text-lg"
                      style={{ background: accent, color: '#000', boxShadow: `0 0 18px ${accent}77` }}>
                  {totalGates}
                </span>
              </td>
              <td className="px-3 py-3" colSpan={2}>
                <span className={`text-xs ${subText}`}>One cell, repeated {totalGates} times, gives you all of digital logic.</span>
              </td>
            </tr>
          </tbody>
        </table>
      </motion.div>

      {/* Q.E.D. card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-8 rounded-3xl border-2 text-center`}
        style={{ borderColor: accent, background: `${accent}10`, boxShadow: `0 0 50px ${accent}22` }}
      >
        <Award className="mx-auto mb-3" size={28} style={{ color: accent }} />
        <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: accent }}>
          Q.E.D.
        </div>
        <p className={`text-base ${textColor} max-w-2xl mx-auto`}>
          Every Boolean operation can be physically realised using a single manufacturing
          blueprint. <strong style={{ color: accent }}>{mode.toUpperCase()}</strong> is universal.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.7 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText}`}
      >
        Module 05 complete · switch the toggle to see the {mode === 'nand' ? 'NOR' : 'NAND'} version of every page
      </motion.div>
    </div>
  );
};
