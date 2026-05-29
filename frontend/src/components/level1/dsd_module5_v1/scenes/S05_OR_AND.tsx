import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, MousePointerClick } from 'lucide-react';
import type { SceneProps } from '../types';
type Bit = 0 | 1;

export const S05_OR_AND: React.FC<SceneProps> = ({ isActive, isDarkMode, mode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const accent = mode === 'nand' ? '#22d3ee' : '#fb923c';

  const [a, setA] = useState<Bit>(1);
  const [b, setB] = useState<Bit>(0);

  // Compute the two derived gates depending on mode
  const easyOut: Bit = mode === 'nand'
    ? ((a && b) ? 1 : 0) // AND
    : ((a || b) ? 1 : 0); // OR
  const hardOut: Bit = mode === 'nand'
    ? ((a || b) ? 1 : 0) // OR
    : ((a && b) ? 1 : 0); // AND

  const wireC = (v: Bit) => v === 1 ? accent : (isDarkMode ? '#475569' : '#cbd5e1');
  const glow  = (v: Bit) => v === 1 ? `drop-shadow(0 0 5px ${accent})` : 'none';
  const fill = isDarkMode ? '#0a0e1a' : '#fff';

  // Names of the two derived gates
  const easyName = mode === 'nand' ? 'AND' : 'OR';
  const hardName = mode === 'nand' ? 'OR' : 'AND';
  const easyCount = 2;
  const hardCount = 3;

  // ── EASY gate (double inversion) - NAND→AND or NOR→OR ──
  const stage1: Bit = mode === 'nand'
    ? (((a && b) ? 1 : 0) === 1 ? 0 : 1) // NAND output
    : (((a || b) ? 1 : 0) === 1 ? 0 : 1); // NOR output

  // ── HARD gate (De Morgan inversion of inputs first) - NAND→OR or NOR→AND ──
  const an: Bit = (a === 0 ? 1 : 0);
  const bn: Bit = (b === 0 ? 1 : 0);

  // Atom (NAND or NOR) gate body - centered at (cx, cy)
  const ATOM_H = 36;

  const drawAtom = (cx: number, cy: number, label?: string) => {
    const halfH = ATOM_H / 2;
    if (mode === 'nand') {
      // D-shape: flat left edge, semicircle right
      return (
        <g>
          <path
            d={`M ${cx - 22} ${cy - halfH}
                L ${cx + 0} ${cy - halfH}
                A ${halfH} ${halfH} 0 0 1 ${cx + 0} ${cy + halfH}
                L ${cx - 22} ${cy + halfH} Z`}
            fill={fill} stroke={accent} strokeWidth="2"
          />
          <circle cx={cx + halfH + 6} cy={cy} r="4" fill={fill} stroke={accent} strokeWidth="2" />
          {label && <text x={cx - 16} y={cy + 4} fontSize="9" fontFamily="monospace" fill={accent}>{label}</text>}
        </g>
      );
    }
    // NOR: curved back, pointed front
    return (
      <g>
        <path
          d={`M ${cx - 22} ${cy - halfH}
              Q ${cx - 14} ${cy} ${cx - 22} ${cy + halfH}
              Q ${cx + 8} ${cy + 13} ${cx + 22} ${cy}
              Q ${cx + 8} ${cy - 13} ${cx - 22} ${cy - halfH} Z`}
          fill={fill} stroke={accent} strokeWidth="2"
        />
        <circle cx={cx + 28} cy={cy} r="4" fill={fill} stroke={accent} strokeWidth="2" />
        {label && <text x={cx - 16} y={cy + 4} fontSize="9" fontFamily="monospace" fill={accent}>{label}</text>}
      </g>
    );
  };
  const atomOutX = (cx: number) => mode === 'nand' ? cx + 28 : cx + 32;
  const atomInLeftX = (cx: number) => cx - 22;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: accent }}>
          <Layers size={14} /> Level 2 · Build {easyName} & {hardName}
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          {easyName} in {easyCount}, {hardName} in {hardCount}.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          {mode === 'nand'
            ? 'AND is just NAND followed by another (tied-input) NAND inverter - double-inversion cancels and you get the original AND back. OR is trickier: by De Morgan, invert each input first, then NAND them.'
            : 'OR is just NOR followed by another (tied-input) NOR inverter - double-inversion cancels. AND is trickier: by De Morgan, invert each input first, then NOR them.'}
        </p>
      </section>

      {/* Live input pads */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className={`flex items-center gap-2 text-xs font-mono ${subText} mb-3`}>
          <MousePointerClick size={12} /> Master inputs · drive both circuits below
        </div>
        <div className="flex gap-3 flex-wrap">
          {([{ k: 'A', v: a, set: setA }, { k: 'B', v: b, set: setB }] as const).map((p) => (
            <button
              key={p.k}
              onClick={() => p.set(p.v === 1 ? 0 : 1)}
              className="px-5 py-3 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5 min-w-[120px]"
              style={{
                borderColor: accent,
                color: p.v ? '#000' : accent,
                backgroundColor: p.v ? accent : 'transparent',
                boxShadow: p.v ? `0 0 25px ${accent}55` : 'none',
              }}
            >
              <span className="text-[10px] uppercase tracking-widest opacity-80">Input</span>
              <span className="text-xl">{p.k} = {p.v}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* EASY gate - 2 atoms (atom + tied-atom inverter) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: accent }}>
          {easyName} = {mode === 'nand' ? '(A · B)' : '(A + B)'} · built with {easyCount} {mode.toUpperCase()}s · double inversion
        </div>
        <svg viewBox="0 0 720 220" className="w-full h-auto">
          {/* Coordinates plan - flat horizontal flow:
                rails 30 → 90, gate1 cx=170, midwire 220→340, gate2 cx=400, output 460→700 */}
          {/* Input labels & rails */}
          <text x="6"  y="76"  fontSize="13" fontFamily="monospace" fontWeight="bold" fill={accent}>A = {a}</text>
          <text x="6"  y="156" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={accent}>B = {b}</text>
          <line x1="40" y1="72"  x2="148" y2="100" stroke={wireC(a)} strokeWidth="2.5" style={{ filter: glow(a) }} />
          <line x1="40" y1="152" x2="148" y2="124" stroke={wireC(b)} strokeWidth="2.5" style={{ filter: glow(b) }} />

          {/* Atom 1 - full {NAND or NOR} of (A, B) */}
          {drawAtom(170, 112, mode === 'nand' ? 'NAND' : 'NOR')}

          {/* Wire from atom 1 → split into atom 2's both inputs (tied) */}
          <line x1={atomOutX(170)} y1="112" x2="280" y2="112" stroke={wireC(stage1)} strokeWidth="2.5" style={{ filter: glow(stage1) }} />
          <text x="232" y="104" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={accent}>
            {stage1}
          </text>
          {/* Y-junction split */}
          <circle cx="280" cy="112" r="3" fill={accent} />
          <line x1="280" y1="112" x2="280" y2="100" stroke={wireC(stage1)} strokeWidth="2" style={{ filter: glow(stage1) }} />
          <line x1="280" y1="112" x2="280" y2="124" stroke={wireC(stage1)} strokeWidth="2" style={{ filter: glow(stage1) }} />
          <line x1="280" y1="100" x2={atomInLeftX(400)} y2="100" stroke={wireC(stage1)} strokeWidth="2" style={{ filter: glow(stage1) }} />
          <line x1="280" y1="124" x2={atomInLeftX(400)} y2="124" stroke={wireC(stage1)} strokeWidth="2" style={{ filter: glow(stage1) }} />
          <text x="290" y="148" fontSize="9" fontFamily="monospace" fill={accent} opacity="0.7">tied</text>

          {/* Atom 2 - tied-input inverter */}
          {drawAtom(400, 112, 'INV')}

          {/* Output */}
          <line x1={atomOutX(400)} y1="112" x2="660" y2="112" stroke={wireC(easyOut)} strokeWidth="3" style={{ filter: glow(easyOut) }} />
          <rect x="630" y="92" width="56" height="42" rx="6" fill={easyOut ? accent : 'none'} stroke={accent} strokeWidth="2.5"
                style={{ filter: easyOut ? `drop-shadow(0 0 12px ${accent})` : 'none' }} />
          <text x="638" y="118" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={easyOut ? '#000' : accent}>Y={easyOut}</text>

          {/* Stage labels at top */}
          <text x="170" y="50" textAnchor="middle" fontSize="10" fontFamily="monospace" fill={accent} opacity="0.7">Stage 1</text>
          <text x="400" y="50" textAnchor="middle" fontSize="10" fontFamily="monospace" fill={accent} opacity="0.7">Stage 2 · invert</text>
        </svg>
      </motion.div>

      {/* HARD gate - 3 atoms · 2 input inverters + 1 final atom */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: accent }}>
          {hardName} = {mode === 'nand' ? '(A + B)' : '(A · B)'} · built with {hardCount} {mode.toUpperCase()}s · De Morgan synthesis
        </div>
        <svg viewBox="0 0 720 280" className="w-full h-auto">
          {/* Layout:
                A rail → tied INV @ cx=130 (cy=60) → A' wire → final atom @ cx=420
                B rail → tied INV @ cx=130 (cy=210) → B' wire → final atom @ cx=420
                Final atom output → Y */}

          {/* Input labels */}
          <text x="6"  y="64"  fontSize="13" fontFamily="monospace" fontWeight="bold" fill={accent}>A = {a}</text>
          <text x="6"  y="214" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={accent}>B = {b}</text>

          {/* A → tied inverter */}
          <line x1="40" y1="60" x2="100" y2="60" stroke={wireC(a)} strokeWidth="2.5" style={{ filter: glow(a) }} />
          <circle cx="100" cy="60" r="3" fill={accent} />
          <line x1="100" y1="60" x2="100" y2="48" stroke={wireC(a)} strokeWidth="2" style={{ filter: glow(a) }} />
          <line x1="100" y1="60" x2="100" y2="72" stroke={wireC(a)} strokeWidth="2" style={{ filter: glow(a) }} />
          <line x1="100" y1="48" x2={atomInLeftX(130)} y2="48" stroke={wireC(a)} strokeWidth="2" style={{ filter: glow(a) }} />
          <line x1="100" y1="72" x2={atomInLeftX(130)} y2="72" stroke={wireC(a)} strokeWidth="2" style={{ filter: glow(a) }} />
          {drawAtom(130, 60, 'INV')}
          <text x="105" y="40" fontSize="9" fontFamily="monospace" fill={accent} opacity="0.7">tied</text>
          <line x1={atomOutX(130)} y1="60" x2="320" y2="60" stroke={wireC(an)} strokeWidth="2.5" style={{ filter: glow(an) }} />
          <text x="240" y="52" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={accent}>A′ = {an}</text>

          {/* B → tied inverter */}
          <line x1="40" y1="210" x2="100" y2="210" stroke={wireC(b)} strokeWidth="2.5" style={{ filter: glow(b) }} />
          <circle cx="100" cy="210" r="3" fill={accent} />
          <line x1="100" y1="210" x2="100" y2="198" stroke={wireC(b)} strokeWidth="2" style={{ filter: glow(b) }} />
          <line x1="100" y1="210" x2="100" y2="222" stroke={wireC(b)} strokeWidth="2" style={{ filter: glow(b) }} />
          <line x1="100" y1="198" x2={atomInLeftX(130)} y2="198" stroke={wireC(b)} strokeWidth="2" style={{ filter: glow(b) }} />
          <line x1="100" y1="222" x2={atomInLeftX(130)} y2="222" stroke={wireC(b)} strokeWidth="2" style={{ filter: glow(b) }} />
          {drawAtom(130, 210, 'INV')}
          <text x="105" y="246" fontSize="9" fontFamily="monospace" fill={accent} opacity="0.7">tied</text>
          <line x1={atomOutX(130)} y1="210" x2="320" y2="210" stroke={wireC(bn)} strokeWidth="2.5" style={{ filter: glow(bn) }} />
          <text x="240" y="230" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={accent}>B′ = {bn}</text>

          {/* Wire A' and B' down/up to final atom */}
          <line x1="320" y1="60" x2="320" y2="123" stroke={wireC(an)} strokeWidth="2" style={{ filter: glow(an) }} />
          <line x1="320" y1="210" x2="320" y2="147" stroke={wireC(bn)} strokeWidth="2" style={{ filter: glow(bn) }} />
          <line x1="320" y1="123" x2={atomInLeftX(380)} y2="123" stroke={wireC(an)} strokeWidth="2" style={{ filter: glow(an) }} />
          <line x1="320" y1="147" x2={atomInLeftX(380)} y2="147" stroke={wireC(bn)} strokeWidth="2" style={{ filter: glow(bn) }} />

          {/* Final atom · combines A′ and B′ */}
          {drawAtom(380, 135, mode === 'nand' ? 'NAND' : 'NOR')}

          {/* Output */}
          <line x1={atomOutX(380)} y1="135" x2="660" y2="135" stroke={wireC(hardOut)} strokeWidth="3" style={{ filter: glow(hardOut) }} />
          <rect x="630" y="115" width="56" height="42" rx="6" fill={hardOut ? accent : 'none'} stroke={accent} strokeWidth="2.5"
                style={{ filter: hardOut ? `drop-shadow(0 0 12px ${accent})` : 'none' }} />
          <text x="638" y="141" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={hardOut ? '#000' : accent}>Y={hardOut}</text>

          {/* Stage labels at top */}
          <text x="130" y="20" textAnchor="middle" fontSize="10" fontFamily="monospace" fill={accent} opacity="0.7">Stage 1 · invert each input</text>
          <text x="380" y="20" textAnchor="middle" fontSize="10" fontFamily="monospace" fill={accent} opacity="0.7">Stage 2 · combine</text>
        </svg>

        <div className={`mt-4 p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
          <p className={`text-sm ${subText}`}>
            <strong style={{ color: accent }}>Key takeaway:</strong>{' '}
            {mode === 'nand'
              ? 'Invert the inputs BEFORE NANDing. By De Morgan, (A′ · B′)′ = A + B. 3 NAND gates: 2 inverters + 1 final NAND.'
              : 'Invert the inputs BEFORE NORing. By De Morgan, (A′ + B′)′ = A · B. 3 NOR gates: 2 inverters + 1 final NOR.'}
          </p>
        </div>
      </motion.div>

      {/* THEORY · why double-inversion works */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: accent }}>
          Theory · why this works
        </div>
        <h3 className={`text-2xl font-black ${textColor} mb-4`}>Double-inversion cancels.</h3>

        {/* Symbolic derivation as 3 steps */}
        <div className="grid md:grid-cols-3 gap-3 mb-5">
          {(mode === 'nand'
            ? [
                { n: '1', t: 'Start',           eq: 'Y = (A · B)′',      note: 'NAND of A, B.' },
                { n: '2', t: 'Pass through INV', eq: 'Y = ((A · B)′)′',  note: 'Tied-NAND inverts again.' },
                { n: '3', t: 'Cancel double ′', eq: 'Y = A · B',         note: 'Two negations cancel out.' },
              ]
            : [
                { n: '1', t: 'Start',           eq: 'Y = (A + B)′',      note: 'NOR of A, B.' },
                { n: '2', t: 'Pass through INV', eq: 'Y = ((A + B)′)′',  note: 'Tied-NOR inverts again.' },
                { n: '3', t: 'Cancel double ′', eq: 'Y = A + B',         note: 'Two negations cancel out.' },
              ]
          ).map((s) => (
            <motion.div
              key={s.n}
              whileHover={{ y: -2 }}
              className="p-4 rounded-2xl border-2"
              style={{ borderColor: `${accent}55`, background: `${accent}10` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 grid place-items-center rounded-md font-mono font-black text-xs"
                      style={{ background: accent, color: '#000' }}>{s.n}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>{s.t}</span>
              </div>
              <div className={`font-mono text-sm font-black ${textColor} mb-1`}>{s.eq}</div>
              <p className={`text-[11px] ${subText}`}>{s.note}</p>
            </motion.div>
          ))}
        </div>

        {/* Per-row outcome table - proves correctness for all 4 input combos */}
        <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: accent }}>
          Outcome for every input combination
        </div>
        <div className="overflow-x-auto">
          <table className="font-mono text-sm w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: `${accent}33` }}>
                <th className={`py-2 px-2 text-center text-[10px] uppercase tracking-widest`} style={{ color: accent }}>A</th>
                <th className={`py-2 px-2 text-center text-[10px] uppercase tracking-widest`} style={{ color: accent }}>B</th>
                <th className={`py-2 px-2 text-center text-[10px] uppercase tracking-widest`} style={{ color: accent }}>
                  Stage 1 · {mode === 'nand' ? '(A·B)′' : '(A+B)′'}
                </th>
                <th className={`py-2 px-2 text-center text-[10px] uppercase tracking-widest`} style={{ color: accent }}>
                  Stage 2 · invert
                </th>
                <th className={`py-2 px-2 text-center text-[10px] uppercase tracking-widest text-emerald-300`}>
                  Y · {easyName}
                </th>
              </tr>
            </thead>
            <tbody>
              {[[0,0],[0,1],[1,0],[1,1]].map(([ra, rb]) => {
                const s1 = mode === 'nand' ? ((ra && rb) ? 0 : 1) : ((ra || rb) ? 0 : 1);
                const out = (s1 === 1 ? 0 : 1);
                const isCurrent = ra === a && rb === b;
                return (
                  <motion.tr
                    key={`${ra}-${rb}`}
                    animate={{ background: isCurrent ? `${accent}22` : 'transparent' }}
                    className="border-b"
                    style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
                  >
                    <td className={`py-2 px-2 text-center ${ra ? textColor : 'opacity-50'}`}>{ra}</td>
                    <td className={`py-2 px-2 text-center ${rb ? textColor : 'opacity-50'}`}>{rb}</td>
                    <td className={`py-2 px-2 text-center ${s1 ? textColor : 'opacity-50'}`}>{s1}</td>
                    <td className={`py-2 px-2 text-center opacity-60`}>{s1 === 1 ? 0 : 1}</td>
                    <td className={`py-2 px-2 text-center font-black ${out ? 'text-emerald-300' : 'opacity-50'}`}>{out}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className={`text-xs ${subText} mt-3`}>
          The Y column matches a normal {easyName} gate exactly - proof that double-inverting works.
        </p>
      </motion.div>

      {/* THEORY · why De Morgan synthesis works */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: accent }}>
          Theory · De Morgan synthesis
        </div>
        <h3 className={`text-2xl font-black ${textColor} mb-4`}>
          Invert each input, then combine.
        </h3>

        <div className="grid md:grid-cols-4 gap-2 mb-5">
          {(mode === 'nand'
            ? [
                { n: '1', t: 'Invert A',     eq: 'A′',                 note: 'Tied-NAND on A.' },
                { n: '2', t: 'Invert B',     eq: 'B′',                 note: 'Tied-NAND on B.' },
                { n: '3', t: 'NAND them',    eq: 'Y = (A′ · B′)′',     note: 'Final NAND combines them.' },
                { n: '4', t: 'De Morgan',    eq: 'Y = A + B',          note: '(A′·B′)′ = A + B.' },
              ]
            : [
                { n: '1', t: 'Invert A',     eq: 'A′',                 note: 'Tied-NOR on A.' },
                { n: '2', t: 'Invert B',     eq: 'B′',                 note: 'Tied-NOR on B.' },
                { n: '3', t: 'NOR them',     eq: 'Y = (A′ + B′)′',     note: 'Final NOR combines them.' },
                { n: '4', t: 'De Morgan',    eq: 'Y = A · B',          note: '(A′+B′)′ = A · B.' },
              ]
          ).map((s) => (
            <motion.div
              key={s.n}
              whileHover={{ y: -2 }}
              className="p-3 rounded-2xl border-2"
              style={{ borderColor: `${accent}55`, background: `${accent}10` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 grid place-items-center rounded-md font-mono font-black text-[10px]"
                      style={{ background: accent, color: '#000' }}>{s.n}</span>
                <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: accent }}>{s.t}</span>
              </div>
              <div className={`font-mono text-xs font-black ${textColor} mb-1`}>{s.eq}</div>
              <p className={`text-[10px] ${subText}`}>{s.note}</p>
            </motion.div>
          ))}
        </div>

        {/* Per-row trace */}
        <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: accent }}>
          Outcome for every input combination
        </div>
        <div className="overflow-x-auto">
          <table className="font-mono text-sm w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: `${accent}33` }}>
                <th className={`py-2 px-2 text-center text-[10px] uppercase tracking-widest`} style={{ color: accent }}>A</th>
                <th className={`py-2 px-2 text-center text-[10px] uppercase tracking-widest`} style={{ color: accent }}>B</th>
                <th className={`py-2 px-2 text-center text-[10px] uppercase tracking-widest`} style={{ color: accent }}>A′</th>
                <th className={`py-2 px-2 text-center text-[10px] uppercase tracking-widest`} style={{ color: accent }}>B′</th>
                <th className={`py-2 px-2 text-center text-[10px] uppercase tracking-widest`} style={{ color: accent }}>
                  Final · {mode === 'nand' ? '(A′·B′)′' : '(A′+B′)′'}
                </th>
                <th className={`py-2 px-2 text-center text-[10px] uppercase tracking-widest text-emerald-300`}>
                  Y · {hardName}
                </th>
              </tr>
            </thead>
            <tbody>
              {[[0,0],[0,1],[1,0],[1,1]].map(([ra, rb]) => {
                const ran = ra === 0 ? 1 : 0;
                const rbn = rb === 0 ? 1 : 0;
                const out = mode === 'nand'
                  ? ((ran && rbn) ? 0 : 1) // (A'·B')' = NAND(A',B')
                  : ((ran || rbn) ? 0 : 1); // (A'+B')' = NOR(A',B')
                const isCurrent = ra === a && rb === b;
                return (
                  <motion.tr
                    key={`${ra}-${rb}`}
                    animate={{ background: isCurrent ? `${accent}22` : 'transparent' }}
                    className="border-b"
                    style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
                  >
                    <td className={`py-2 px-2 text-center ${ra ? textColor : 'opacity-50'}`}>{ra}</td>
                    <td className={`py-2 px-2 text-center ${rb ? textColor : 'opacity-50'}`}>{rb}</td>
                    <td className={`py-2 px-2 text-center ${ran ? textColor : 'opacity-50'}`}>{ran}</td>
                    <td className={`py-2 px-2 text-center ${rbn ? textColor : 'opacity-50'}`}>{rbn}</td>
                    <td className={`py-2 px-2 text-center ${out ? textColor : 'opacity-50'}`}>{out}</td>
                    <td className={`py-2 px-2 text-center font-black ${out ? 'text-emerald-300' : 'opacity-50'}`}>{out}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={`mt-4 p-4 rounded-xl border-2 ${isDarkMode ? 'bg-black/30' : 'bg-slate-50'}`}
             style={{ borderColor: `${accent}55` }}>
          <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: accent }}>De Morgan in plain words</div>
          <p className={`text-sm ${subText}`}>
            {mode === 'nand'
              ? '"NAND of inverted inputs" gives you OR. Inverting on the way IN is the same as not-inverting on the way OUT - that\'s De Morgan\'s law in action.'
              : '"NOR of inverted inputs" gives you AND. Inverting on the way IN is the same as not-inverting on the way OUT - that\'s De Morgan\'s law in action.'}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
