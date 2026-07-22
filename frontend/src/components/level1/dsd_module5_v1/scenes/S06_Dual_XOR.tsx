import React from 'react';
import { motion } from 'framer-motion';
import { Boxes, Sparkles } from 'lucide-react';
import type { SceneProps } from '../types';

const Box: React.FC<{ title: string; count: number; modeLabel: string; eq: string; note: string; accent: string; textColor: string; subText: string }>
  = ({ title, count, modeLabel, eq, note, accent, textColor, subText }) => (
    <div className="p-5 rounded-2xl border-2" style={{ borderColor: `${accent}55`, background: `${accent}10` }}>
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-mono text-sm font-black" style={{ color: accent }}>{title}</span>
        <span className="font-mono text-xs" style={{ color: accent }}>{count} {modeLabel}</span>
      </div>
      <div className={`font-mono text-base font-black ${textColor} mb-2`}>{eq}</div>
      <p className={`text-xs ${subText}`}>{note}</p>
    </div>
  );

export const S06_Dual_XOR: React.FC<SceneProps> = ({ isActive, isDarkMode, mode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const accent = mode === 'nand' ? '#22d3ee' : '#fb923c';

  // Per mode: the dual gate, XOR, XNOR
  const builds = mode === 'nand'
    ? [
        { title: 'NOR · Level 3', count: 4, eq: 'Y = (A + B)′', note: 'Build OR (3 NANDs), then push it through a tied-NAND inverter. Total: 4 NANDs.' },
        { title: 'XOR · Level 4', count: 4, eq: 'Y = A·B′ + A′·B', note: 'The "cross-weave" - a clean 4-NAND symmetry. No separate NOT gates needed for the inputs.' },
        { title: 'XNOR · Level 4', count: 5, eq: 'Y = (A ⊕ B)′', note: 'XOR followed by one more tied-NAND inverter. Outputs 1 only when A and B are equal.' },
      ]
    : [
        { title: 'NAND · Level 4', count: 4, eq: 'Y = (A · B)′', note: 'Build AND (3 NORs), then push it through a tied-NOR inverter. Total: 4 NORs.' },
        { title: 'XNOR · Level 5', count: 4, eq: 'Y = (A ⊕ B)′', note: 'Equality detector. Outputs 1 when A and B are the same. Symmetric 4-NOR construction.' },
        { title: 'XOR · Level 6', count: 5, eq: 'Y = A ⊕ B', note: 'Take XNOR and run it through one more tied-NOR inverter. 1 only when inputs differ.' },
      ];

  // ── Reusable atom (NAND or NOR) drawing helper ──
  // cx, cy = center of the gate body, output bubble at cx + OUT_OFFSET, output point at cx + OUT_OFFSET + 4
  const fill = isDarkMode ? '#0a0e1a' : '#fff';
  const halfH = 18;
  const drawAtom = (cx: number, cy: number, label?: string) => {
    if (mode === 'nand') {
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
          {label && <text x={cx - 17} y={cy + 4} fontSize="9" fontFamily="monospace" fill={accent}>{label}</text>}
        </g>
      );
    }
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
        {label && <text x={cx - 17} y={cy + 4} fontSize="9" fontFamily="monospace" fill={accent}>{label}</text>}
      </g>
    );
  };
  const atomOutX = (cx: number) => mode === 'nand' ? cx + halfH + 10 : cx + 32;
  const atomInLeftX = (cx: number) => cx - 22;

  // Both modes use the SAME 4-gate topology · gate type swaps:
  //   N1 = atom(A, B)         · gives the dual (NOR or NAND of A,B)
  //   N2 = atom(A, N1)
  //   N3 = atom(N1, B)
  //   N4 = atom(N2, N3)        · final output
  // For NAND-mode N4 = A ⊕ B (XOR)
  // For NOR-mode  N4 = (A ⊕ B)' (XNOR)
  const drawTopology = () => (
    <svg viewBox="0 0 620 280" className="w-full h-auto">
      {/* Input labels */}
      <text x="6"  y="56"  fontSize="13" fontFamily="monospace" fontWeight="bold" fill={accent}>A</text>
      <text x="6"  y="226" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={accent}>B</text>

      {/* Input rails */}
      <line x1="40" y1="52" x2="100" y2="52" stroke={accent} strokeWidth="2" />
      <line x1="40" y1="222" x2="100" y2="222" stroke={accent} strokeWidth="2" />

      {/* A splits down into N1's top input, N2's top input */}
      <circle cx="100" cy="52" r="3" fill={accent} />
      <line x1="100" y1="52" x2="100" y2="118" stroke={accent} strokeWidth="2" />
      <line x1="100" y1="118" x2={atomInLeftX(220)} y2="118" stroke={accent} strokeWidth="2" />  {/* to N1 top */}
      <line x1="100" y1="52" x2={atomInLeftX(360)} y2="52" stroke={accent} strokeWidth="2" />   {/* to N2 top */}

      {/* B splits up into N1's bottom input, N3's bottom input */}
      <circle cx="100" cy="222" r="3" fill={accent} />
      <line x1="100" y1="222" x2="100" y2="156" stroke={accent} strokeWidth="2" />
      <line x1="100" y1="156" x2={atomInLeftX(220)} y2="156" stroke={accent} strokeWidth="2" />  {/* to N1 bottom */}
      <line x1="100" y1="222" x2={atomInLeftX(360)} y2="222" stroke={accent} strokeWidth="2" />  {/* to N3 bottom */}

      {/* N1 - atom(A, B) */}
      {drawAtom(220, 137, 'N1')}

      {/* N1 output → split, drives N2 bottom input AND N3 top input */}
      <line x1={atomOutX(220)} y1="137" x2="300" y2="137" stroke={accent} strokeWidth="2" />
      <circle cx="300" cy="137" r="3" fill={accent} />
      <line x1="300" y1="137" x2="300" y2="68" stroke={accent} strokeWidth="2" />   {/* up to N2 bottom */}
      <line x1="300" y1="137" x2="300" y2="206" stroke={accent} strokeWidth="2" />  {/* down to N3 top */}
      <line x1="300" y1="68"  x2={atomInLeftX(360)} y2="68" stroke={accent} strokeWidth="2" />
      <line x1="300" y1="206" x2={atomInLeftX(360)} y2="206" stroke={accent} strokeWidth="2" />
      <text x="240" y="128" fontSize="9" fontFamily="monospace" fill={accent} opacity="0.75">
        (A {mode === 'nand' ? '·' : '+'} B)′
      </text>

      {/* N2 - atom(A, N1) */}
      {drawAtom(360, 60, 'N2')}
      {/* N3 - atom(N1, B) */}
      {drawAtom(360, 214, 'N3')}

      {/* N2 → N4 top, N3 → N4 bottom */}
      <line x1={atomOutX(360)} y1="60"  x2="500" y2="60"  stroke={accent} strokeWidth="2" />
      <line x1={atomOutX(360)} y1="214" x2="500" y2="214" stroke={accent} strokeWidth="2" />
      <line x1="500" y1="60"  x2="500" y2="125" stroke={accent} strokeWidth="2" />
      <line x1="500" y1="125" x2={atomInLeftX(540)} y2="125" stroke={accent} strokeWidth="2" />
      <line x1="500" y1="214" x2="500" y2="149" stroke={accent} strokeWidth="2" />
      <line x1="500" y1="149" x2={atomInLeftX(540)} y2="149" stroke={accent} strokeWidth="2" />

      {/* N4 - final atom */}
      {drawAtom(540, 137, 'N4')}

      {/* Output */}
      <line x1={atomOutX(540)} y1="137" x2="610" y2="137" stroke={accent} strokeWidth="3" />
      <text x="588" y="130" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={accent}>Y</text>

      {/* Bottom legend */}
      <text x="310" y="265" textAnchor="middle" fontSize="10" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#475569'}>
        4 × {mode === 'nand' ? 'NAND' : 'NOR'} · {mode === 'nand' ? 'Y = A ⊕ B (XOR)' : 'Y = (A ⊕ B)′ (XNOR)'}
      </text>
    </svg>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: accent }}>
          <Boxes size={14} /> Levels 3 - 4 · The dual gate, XOR & XNOR
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          {mode === 'nand' ? 'NOR + XOR + XNOR.' : 'NAND + XNOR + XOR.'}
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          {mode === 'nand'
            ? 'Once we own AND and OR, the rest is bookkeeping. NOR = OR + NOT (4 NANDs). XOR has its own neat cross-weave shape. XNOR is XOR + one final inverter.'
            : 'Once we own AND and OR, the rest is bookkeeping. NAND = AND + NOT (4 NORs). XNOR is the natural symmetric construction. XOR is XNOR + one final inverter.'}
        </p>
      </section>

      {/* Three build summary boxes */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="grid md:grid-cols-3 gap-3"
      >
        {builds.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 14 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <Box
              title={b.title}
              count={b.count}
              modeLabel={mode === 'nand' ? 'NANDs' : 'NORs'}
              eq={b.eq}
              note={b.note}
              accent={accent}
              textColor={textColor}
              subText={subText}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Featured circuit · iconic shape */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2"
             style={{ color: accent }}>
          <Sparkles size={12} />
          {mode === 'nand'
            ? 'The XOR cross-weave · 4 NAND gates in a symmetric figure-8'
            : 'The XNOR symmetric pattern · 4 NORs · equality detector'}
        </div>

        {drawTopology()}

        <div className={`mt-4 p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
          {mode === 'nand' ? (
            <p className={`text-sm ${subText}`}>
              <strong style={{ color: accent }}>Why it's beautiful:</strong> the central NAND output (A·B)′
              feeds back into both A and B, naturally producing inverted forms when needed. No separate NOT
              gates required for the inputs - the structure is its own inverter.
            </p>
          ) : (
            <p className={`text-sm ${subText}`}>
              <strong style={{ color: accent }}>Why it's beautiful:</strong> the first NOR creates (A+B)′,
              which then loops back into both A and B branches. The whole structure is mirror-symmetric and
              outputs 1 ONLY when A and B share the exact same value.
            </p>
          )}
        </div>
      </motion.div>

      {/* THEORY · why the 4-gate topology works */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: accent }}>
          Theory · stage by stage
        </div>
        <h3 className={`text-2xl font-black ${textColor} mb-4`}>
          {mode === 'nand'
            ? 'How the cross-weave produces A ⊕ B.'
            : 'How the symmetric pattern produces (A ⊕ B)′.'}
        </h3>

        <div className="grid md:grid-cols-2 gap-3 mb-6">
          {(mode === 'nand'
            ? [
                { n: 'N1', t: 'Atom 1',  eq: '(A · B)′',                 note: 'The shared "anti-AND" wire used by everyone downstream.' },
                { n: 'N2', t: 'Atom 2',  eq: '(A · (A·B)′)′ = A′ + AB',  note: 'Outputs 1 when A=0 OR when both A and B are 1.' },
                { n: 'N3', t: 'Atom 3',  eq: '(B · (A·B)′)′ = B′ + AB',  note: 'Outputs 1 when B=0 OR when both A and B are 1.' },
                { n: 'N4', t: 'Final',   eq: '(N2 · N3)′ = A ⊕ B',       note: 'Combines the two arms - outputs 1 only when A ≠ B.' },
              ]
            : [
                { n: 'N1', t: 'Atom 1',  eq: '(A + B)′',                 note: 'The shared "anti-OR" wire used by everyone downstream.' },
                { n: 'N2', t: 'Atom 2',  eq: '(A + (A+B)′)′',            note: 'Outputs 1 only when A=0 AND (A+B)=1, i.e. A=0 ∧ B=1.' },
                { n: 'N3', t: 'Atom 3',  eq: '((A+B)′ + B)′',            note: 'Outputs 1 only when B=0 AND (A+B)=1, i.e. A=1 ∧ B=0.' },
                { n: 'N4', t: 'Final',   eq: '(N2 + N3)′ = (A ⊕ B)′',    note: 'Combines the two arms - outputs 1 only when A = B.' },
              ]
          ).map((s) => (
            <motion.div
              key={s.n}
              whileHover={{ y: -2 }}
              className="p-4 rounded-2xl border-2"
              style={{ borderColor: `${accent}55`, background: `${accent}10` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md font-mono font-black text-[10px]"
                      style={{ background: accent, color: '#000' }}>{s.n}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>{s.t}</span>
              </div>
              <div className={`font-mono text-sm font-black ${textColor} mb-1 break-words`}>{s.eq}</div>
              <p className={`text-[11px] ${subText}`}>{s.note}</p>
            </motion.div>
          ))}
        </div>

        {/* Per-row outcome - full trace through all 4 gates */}
        <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: accent }}>
          Trace · every input combination through every atom
        </div>
        <div className="overflow-x-auto">
          <table className="font-mono text-sm w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: `${accent}33` }}>
                {['A', 'B', 'N1', 'N2', 'N3'].map((h) => (
                  <th key={h} className={`py-2 px-2 text-center text-[10px] uppercase tracking-widest`} style={{ color: accent }}>{h}</th>
                ))}
                <th className={`py-2 px-2 text-center text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                  Y · {mode === 'nand' ? 'A ⊕ B' : '(A ⊕ B)′'}
                </th>
              </tr>
            </thead>
            <tbody>
              {[[0,0],[0,1],[1,0],[1,1]].map(([ra, rb]) => {
                const n1 = mode === 'nand' ? ((ra && rb) ? 0 : 1) : ((ra || rb) ? 0 : 1);
                const n2 = mode === 'nand' ? ((ra && n1) ? 0 : 1) : ((ra || n1) ? 0 : 1);
                const n3 = mode === 'nand' ? ((rb && n1) ? 0 : 1) : ((rb || n1) ? 0 : 1);
                const n4 = mode === 'nand' ? ((n2 && n3) ? 0 : 1) : ((n2 || n3) ? 0 : 1);
                const matchExpected = mode === 'nand'
                  ? n4 === ((ra ^ rb))
                  : n4 === (ra === rb ? 1 : 0);
                return (
                  <tr key={`${ra}-${rb}`} className="border-b"
                      style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                    <td className={`py-2 px-2 text-center ${ra ? textColor : 'opacity-50'}`}>{ra}</td>
                    <td className={`py-2 px-2 text-center ${rb ? textColor : 'opacity-50'}`}>{rb}</td>
                    <td className={`py-2 px-2 text-center ${n1 ? textColor : 'opacity-50'}`}>{n1}</td>
                    <td className={`py-2 px-2 text-center ${n2 ? textColor : 'opacity-50'}`}>{n2}</td>
                    <td className={`py-2 px-2 text-center ${n3 ? textColor : 'opacity-50'}`}>{n3}</td>
                    <td className={`py-2 px-2 text-center font-black ${n4 ? (isDarkMode ? 'text-emerald-300' : 'text-emerald-600') : 'opacity-50'}`}>
                      {n4} {matchExpected ? '' : '⚠'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={`mt-4 p-4 rounded-xl border-2 ${isDarkMode ? 'bg-black/30' : 'bg-slate-50'}`}
             style={{ borderColor: `${accent}55` }}>
          <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: accent }}>
            Reading the output column
          </div>
          <p className={`text-sm ${subText}`}>
            {mode === 'nand'
              ? 'Y is 1 ONLY when A and B differ - that is the definition of XOR. The 4 NANDs cooperate to filter every "agreement" row down to 0 and let "disagreement" rows pass through as 1.'
              : 'Y is 1 ONLY when A and B match - that is the definition of XNOR (equality). The 4 NORs cooperate to filter every "disagreement" row down to 0 and let "agreement" rows pass through as 1.'}
          </p>
        </div>
      </motion.div>

      {/* The +1 inverter step - extending to the dual XOR/XNOR */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.55 }}
        className="py-2"
      >
        <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: accent }}>
          The +1 step
        </div>
        <p className={`text-sm ${subText}`}>
          {mode === 'nand'
            ? 'The XNOR (5 NANDs) is just the XOR (4 NANDs) followed by ONE more tied-NAND inverter. That single bubble flips the equality test from "A differs from B" to "A equals B".'
            : 'The XOR (5 NORs) is just the XNOR (4 NORs) followed by ONE more tied-NOR inverter. That single bubble flips the equality test from "A equals B" to "A differs from B".'}
        </p>
      </motion.div>

      {/* Build summary at the bottom for quick recall */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.65 }}
        className={`p-6 rounded-2xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: accent }}>
          Quick recap · gate counts
        </div>
        <div className="grid grid-cols-3 gap-3">
          {builds.map((b) => (
            <div key={b.title} className="text-center p-3 rounded-xl"
                 style={{ background: `${accent}10`, border: `1px solid ${accent}55` }}>
              <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: accent }}>
                {b.title.split('·')[0].trim()}
              </div>
              <div className={`text-2xl font-black ${textColor}`}>{b.count}</div>
              <div className={`text-[10px] font-mono ${subText}`}>
                {mode === 'nand' ? 'NANDs' : 'NORs'}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
