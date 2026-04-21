import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import TruthTableBuilder from '../components/TruthTableBuilder';
import type { TruthTableRow, Minterm } from '../ModuleD1.types';
import { getMinterms, mintermToProductTerm, sigmaMNotation } from '../../../../shared/utils/booleanEngine';

const PHASE_COLOR = '#A855F7';
const VARS = ['A', 'B', 'C'];

interface A2Props {
  sceneIndex: number;
  currentScene: number;
  tableRows: TruthTableRow[];
  selectedMinterms: Set<number>;
  onToggleMinterm: (index: number) => void;
}

// Circular progress arc SVG
const CircularProgress: React.FC<{ value: number; total: number; color: string }> = ({ value, total, color }) => {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? value / total : 0;
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" role="img" aria-label={`${value} of ${total} minterms extracted`}>
      <circle cx={32} cy={32} r={r} stroke="#1A1A1F" strokeWidth={6} fill="none" />
      <motion.circle
        cx={32} cy={32} r={r}
        stroke={color}
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        animate={{ strokeDashoffset: circ * (1 - pct) }}
        transition={{ duration: 0.4 }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '32px 32px' }}
      />
      <text x={32} y={37} textAnchor="middle" fontSize={13} fill={color} fontFamily="IBM Plex Mono">
        {value}/{total}
      </text>
    </svg>
  );
};

const A2_Minterms: React.FC<A2Props> = ({
  sceneIndex, currentScene, tableRows, selectedMinterms, onToggleMinterm,
}) => {
  const isActive = currentScene === sceneIndex;
  const [activeRow, setActiveRow] = useState<number | null>(null);

  const allMinterms = getMinterms(tableRows, VARS);
  const totalMinterms = allMinterms.length;

  const selectedList = allMinterms.filter(m => selectedMinterms.has(m.index));
  const allSelected = selectedMinterms.size === totalMinterms;

  const handleRowClick = useCallback((rowIndex: number) => {
    const row = tableRows[rowIndex];
    if (row.output !== true) return;
    setActiveRow(rowIndex);
    onToggleMinterm(rowIndex);
  }, [tableRows, onToggleMinterm]);

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="A" name="MINTERMS" color={PHASE_COLOR} />

      {/* Circular progress top-right */}
      <div className="absolute top-6 right-6 z-20 flex flex-col items-center gap-1">
        <CircularProgress value={selectedMinterms.size} total={totalMinterms} color={PHASE_COLOR} />
        <span className="text-[9px] font-mono" style={{ color: '#7A7A8C', letterSpacing: '0.08em' }}>EXTRACTED</span>
      </div>

      {/* Rule legend bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 px-6 py-2 flex items-center gap-4 text-[11px] font-mono border-t"
        style={{ background: '#0A0A0B', borderColor: '#FFFFFF0F' }}
        role="note"
        aria-label="Minterm extraction rule"
      >
        <span style={{ color: '#FFC107', letterSpacing: '0.1em' }}>MINTERM RULE:</span>
        <span style={{ color: '#00FF88' }}>Input = 1 → UNCOMPLEMENTED (A)</span>
        <span style={{ color: '#7A7A8C' }}>│</span>
        <span style={{ color: '#FFD580' }}>Input = 0 → A′ (complement)</span>
      </div>

      {/* Main 3-col layout */}
      <div className="flex flex-col md:flex-row flex-1 gap-4 pt-14 pb-12 px-6 md:px-8 overflow-hidden">
        {/* LEFT: Compact truth table (25%) */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-2"
          style={{ minWidth: 200, flex: '0 0 auto' }}
        >
          <div className="text-[10px] font-mono tracking-[0.1em] mb-1" style={{ color: PHASE_COLOR }}>CLICK F=1 ROWS TO EXTRACT</div>
          <div
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: '#FFFFFF0F' }}
            role="table"
            aria-label="Click a row where F=1 to extract its minterm"
          >
            {/* Header */}
            <div className="grid grid-cols-5 bg-[#1A1A1F] border-b border-white/5" role="row">
              {['#','A','B','C','F'].map(h => (
                <div key={h} className="py-1.5 text-center text-[10px] font-mono" style={{ color: '#7A7A8C' }} role="columnheader">{h}</div>
              ))}
            </div>
            {tableRows.map(row => {
              const isOne = row.output === true;
              const isSelected = isOne && selectedMinterms.has(row.index);
              return (
                <motion.div
                  key={row.index}
                  role="row"
                  onClick={() => isOne && handleRowClick(row.index)}
                  whileHover={isOne ? { x: 2 } : {}}
                  className="grid grid-cols-5 border-b border-white/[0.04] transition-all"
                  style={{
                    cursor: isOne ? 'pointer' : 'not-allowed',
                    opacity: isOne ? 1 : 0.35,
                    background: isSelected ? `${PHASE_COLOR}18` : activeRow === row.index ? `${PHASE_COLOR}10` : 'transparent',
                    borderLeft: `3px solid ${isSelected ? PHASE_COLOR : 'transparent'}`,
                    minHeight: 36,
                  }}
                  aria-selected={isSelected}
                >
                  <div className="flex items-center justify-center text-[10px] font-mono" style={{ color: '#7A7A8C' }} role="cell">{row.index}</div>
                  {row.inputs.map((bit, bi) => (
                    <div key={bi} className="flex items-center justify-center text-[11px] font-mono font-semibold" style={{ color: bit ? '#E8E8F0' : '#7A7A8C' }} role="cell">{bit ? '1' : '0'}</div>
                  ))}
                  <div className="flex items-center justify-center text-[11px] font-mono font-semibold" style={{ color: row.output === true ? '#00FF88' : '#FF3366' }} role="cell">
                    {row.output === true ? '1' : '0'}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CENTER: Extraction workspace (35%) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col gap-3 flex-1 min-w-0"
        >
          <div className="text-[10px] font-mono tracking-[0.1em]" style={{ color: PHASE_COLOR }}>EXTRACTING MINTERMS</div>

          <AnimatePresence>
            {activeRow !== null && tableRows[activeRow]?.output === true && (() => {
              const row = tableRows[activeRow];
              const m = allMinterms.find(m => m.index === activeRow);
              if (!m) return null;
              return (
                <motion.div
                  key={activeRow}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-xl p-4 flex flex-col gap-3"
                  style={{ background: '#111114', border: `1px solid ${PHASE_COLOR}33` }}
                >
                  <div className="text-[11px] font-mono" style={{ color: '#7A7A8C' }}>
                    Row {row.index} → binary {row.inputs.map(b => b ? '1' : '0').join('')}
                  </div>

                  {/* Variable expansion */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {VARS.map((v, vi) => {
                      const isComplement = m.complements[vi];
                      return (
                        <motion.div
                          key={v}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: vi * 0.15 }}
                          className="flex flex-col items-center gap-1"
                        >
                          <div
                            className="px-3 py-1.5 rounded text-[12px] font-mono"
                            style={{
                              background: '#1A1A1F',
                              border: `1px solid ${PHASE_COLOR}44`,
                              color: '#E8E8F0',
                            }}
                          >
                            {v}={row.inputs[vi] ? '1' : '0'}
                          </div>
                          <div style={{ color: '#7A7A8C', fontSize: 10 }}>↓</div>
                          <div
                            className="text-[14px] font-mono font-bold"
                            style={{ color: isComplement ? '#FFD580' : '#00FF88' }}
                          >
                            {isComplement ? <>{v}<sup style={{ fontSize: '0.7em' }}>′</sup></> : v}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Assembled term */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2 px-3 py-2 rounded"
                    style={{ background: `${PHASE_COLOR}12`, border: `1px solid ${PHASE_COLOR}44` }}
                  >
                    <span className="text-[14px] font-mono" style={{ color: '#A0FFA0' }}>
                      {mintermToProductTerm(m)}
                    </span>
                    <span className="text-[10px] font-mono ml-2" style={{ color: '#7A7A8C' }}>
                      m{m.index}
                    </span>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </motion.div>

        {/* RIGHT: Expression builder (40%) */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col gap-3 flex-shrink-0"
          style={{ minWidth: 220 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono tracking-[0.1em]" style={{ color: PHASE_COLOR }}>SOP BUILDER</span>
            {selectedMinterms.size > 0 && (
              <button
                onClick={() => {
                  allMinterms.forEach(m => {
                    if (selectedMinterms.has(m.index)) onToggleMinterm(m.index);
                  });
                }}
                className="text-[9px] font-mono text-[#7A7A8C] hover:text-[#FF3366] transition-colors"
              >
                CLEAR ALL
              </button>
            )}
          </div>

          <div
            className="min-h-[80px] rounded-lg p-3 font-mono text-[13px] flex flex-col gap-1"
            style={{ background: '#06060A', border: '1px solid #00D4FF44' }}
            aria-live="polite"
          >
            <span style={{ color: '#7A7A8C' }}>F =</span>
            {selectedList.length === 0 && (
              <span style={{ color: '#3A3A4A' }} className="text-[11px]">← Click rows to add terms</span>
            )}
            {selectedList.map((m, i) => (
              <motion.span
                key={m.index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[13px]"
                style={{ color: '#A0FFA0' }}
              >
                {i > 0 && <span style={{ color: PHASE_COLOR }}> + </span>}
                {mintermToProductTerm(m)}
                <sub style={{ fontSize: '0.65em', opacity: 0.6 }}>m{m.index}</sub>
              </motion.span>
            ))}
          </div>

          {/* Sigma notation */}
          {allSelected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg p-3 flex flex-col gap-2"
              style={{ background: `${PHASE_COLOR}12`, border: `1px solid ${PHASE_COLOR}44` }}
            >
              <div className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>Σm NOTATION</div>
              <div className="text-[15px] font-mono" style={{ color: PHASE_COLOR }}>
                F = {sigmaMNotation(selectedList)}
              </div>
              <div
                className="flex items-center gap-2 text-[11px] font-mono mt-1"
                style={{ color: '#00FF88' }}
              >
                ✓ CANONICAL SOP COMPLETE
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Microcopy */}
      <div className="px-6 pb-12 text-center flex flex-col gap-1">
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>
          A minterm covers exactly ONE input combination — where all variables appear.
        </p>
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>
          Where input=1, use the variable directly. Where input=0, use its complement.
        </p>
      </div>
    </SceneWrapper>
  );
};

export default A2_Minterms;
