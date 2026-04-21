import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import type { TruthTableRow, Maxterm } from '../ModuleD1.types';
import { getMaxterms, maxtermToSumTerm, piMNotation } from '../../../../shared/utils/booleanEngine';

const PHASE_COLOR = '#A855F7';
const VARS = ['A', 'B', 'C'];

interface A3Props {
  sceneIndex: number;
  currentScene: number;
  tableRows: TruthTableRow[];
  selectedMaxterms: Set<number>;
  onToggleMaxterm: (index: number) => void;
}

// Inline quiz state
type QuizAnswer = 'B' | "B'" | null;

const A3_Maxterms: React.FC<A3Props> = ({
  sceneIndex, currentScene, tableRows, selectedMaxterms, onToggleMaxterm,
}) => {
  const isActive = currentScene === sceneIndex;
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<QuizAnswer>(null);
  const [quizShown, setQuizShown] = useState(false);

  const allMaxterms = getMaxterms(tableRows, VARS);
  const totalMaxterms = allMaxterms.length;
  const selectedList = allMaxterms.filter(m => selectedMaxterms.has(m.index));
  const allSelected = selectedMaxterms.size === totalMaxterms;

  const handleRowClick = useCallback((rowIndex: number) => {
    const row = tableRows[rowIndex];
    if (row.output !== false) return;
    setActiveRow(rowIndex);
    onToggleMaxterm(rowIndex);
    // Show quiz after 2 maxterms
    if (selectedMaxterms.size === 1) setQuizShown(true);
  }, [tableRows, onToggleMaxterm, selectedMaxterms.size]);

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="A" name="MAXTERMS" color={PHASE_COLOR} />

      {/* Rule legend bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 px-6 py-2 flex items-center gap-4 text-[11px] font-mono border-t"
        style={{ background: '#0A0A0B', borderColor: '#FFFFFF0F' }}
        role="note"
      >
        <span style={{ color: '#FFC107', letterSpacing: '0.1em' }}>⚠ MAXTERM RULE (REVERSED):</span>
        <span style={{ color: '#FFD580' }}>Input = 1 → A′ (COMPLEMENT)</span>
        <span style={{ color: '#7A7A8C' }}>│</span>
        <span style={{ color: '#00FF88' }}>Input = 0 → A (uncomplemented)</span>
      </div>

      {/* Rule swap comparison card (persistent) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={isActive ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="absolute top-14 right-4 z-20 rounded-xl p-4 text-[10px] font-mono"
        style={{
          background: '#111114',
          border: '4px solid #FFC107',
          maxWidth: 260,
        }}
        role="note"
        aria-label="Minterm vs Maxterm rule comparison"
      >
        <div className="flex items-center gap-2 mb-2">
          <span style={{ color: '#FFC107' }}>⚠</span>
          <span style={{ color: '#FFC107', letterSpacing: '0.08em' }}>RULE COMPARISON</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <div style={{ color: PHASE_COLOR, fontWeight: 700 }}>MINTERM</div>
            <div style={{ color: '#00FF88' }}>Input=1 → A (uncomp.)</div>
            <div style={{ color: '#FFD580' }}>Input=0 → A′ (comp.)</div>
          </div>
          <div className="flex flex-col gap-1">
            <div style={{ color: '#FF3366', fontWeight: 700 }}>MAXTERM</div>
            <div style={{ color: '#FFD580' }}>Input=1 → A′ (comp.)</div>
            <div style={{ color: '#00FF88' }}>Input=0 → A (uncomp.)</div>
          </div>
        </div>
        <div style={{ color: '#7A7A8C', marginTop: 8, lineHeight: 1.5 }}>
          These rules are exact OPPOSITES. Mix them up → always wrong.
        </div>
        <div className="flex items-center justify-center mt-1">
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: 1 }}
            style={{ color: '#FFC107', fontSize: 16 }}
          >
            ↔
          </motion.span>
        </div>
      </motion.div>

      {/* Inline quiz after 2 maxterms */}
      <AnimatePresence>
        {quizShown && quizAnswer === null && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-14 left-4 z-20 rounded-xl p-4"
            style={{
              background: '#111114',
              border: '1px solid #FFC10766',
              maxWidth: 260,
            }}
            role="dialog"
            aria-label="Quick check quiz"
          >
            <div className="text-[10px] font-mono mb-2" style={{ color: '#FFC107' }}>QUICK CHECK</div>
            <p className="text-[11px] mb-3" style={{ color: '#E8E8F0', lineHeight: 1.5 }}>
              For M₅ (input = 101), what is the B term?
            </p>
            <div className="flex gap-2">
              {(["B'", 'B'] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => setQuizAnswer(opt as QuizAnswer)}
                  className="px-3 py-1 text-[12px] font-mono rounded transition-all"
                  style={{
                    border: '1px solid #FFC10744',
                    color: '#FFC107',
                    background: '#1A1A1F',
                  }}
                  aria-label={`Answer: ${opt}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        {quizAnswer !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-14 left-4 z-20 rounded-xl px-4 py-3 text-[11px] font-mono"
            style={{
              background: quizAnswer === 'B' ? 'rgba(0,255,136,0.1)' : 'rgba(255,51,102,0.1)',
              border: `1px solid ${quizAnswer === 'B' ? '#00FF8844' : '#FF336644'}`,
              color: quizAnswer === 'B' ? '#00FF88' : '#FF3366',
              maxWidth: 240,
            }}
          >
            {quizAnswer === 'B'
              ? '✓ Correct! B=0 in row 5 → uncomplemented = B'
              : 'Remember — in maxterms, input=1 means COMPLEMENT.'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div className="flex flex-col md:flex-row flex-1 gap-4 pt-14 pb-12 px-6 md:px-8 overflow-hidden">
        {/* LEFT: Table */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-2 flex-shrink-0"
          style={{ minWidth: 200 }}
        >
          <div className="text-[10px] font-mono tracking-[0.1em] mb-1" style={{ color: '#FF3366' }}>CLICK F=0 ROWS</div>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#FFFFFF0F' }} role="table">
            <div className="grid grid-cols-5 bg-[#1A1A1F] border-b border-white/5" role="row">
              {['#','A','B','C','F'].map(h => (
                <div key={h} className="py-1.5 text-center text-[10px] font-mono" style={{ color: '#7A7A8C' }} role="columnheader">{h}</div>
              ))}
            </div>
            {tableRows.map(row => {
              const isZero = row.output === false;
              const isSelected = isZero && selectedMaxterms.has(row.index);
              return (
                <motion.div
                  key={row.index}
                  role="row"
                  onClick={() => isZero && handleRowClick(row.index)}
                  whileHover={isZero ? { x: 2 } : {}}
                  className="grid grid-cols-5 border-b border-white/[0.04] transition-all"
                  style={{
                    cursor: isZero ? 'pointer' : 'not-allowed',
                    opacity: isZero ? 1 : 0.3,
                    background: isSelected ? 'rgba(255,51,102,0.08)' : 'transparent',
                    borderLeft: isSelected ? '3px solid #FF3366' : '3px solid transparent',
                    minHeight: 36,
                  }}
                  aria-selected={isSelected}
                >
                  <div className="flex items-center justify-center text-[10px] font-mono" style={{ color: '#7A7A8C' }} role="cell">{row.index}</div>
                  {row.inputs.map((bit, bi) => (
                    <div key={bi} className="flex items-center justify-center text-[11px] font-mono" style={{ color: bit ? '#E8E8F0' : '#7A7A8C' }} role="cell">{bit ? '1' : '0'}</div>
                  ))}
                  <div className="flex items-center justify-center text-[11px] font-mono" style={{ color: '#FF3366' }} role="cell">
                    {row.output !== null ? (row.output ? '1' : '0') : '·'}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CENTER: Extraction */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col gap-3 flex-1 min-w-0"
        >
          <div className="text-[10px] font-mono tracking-[0.1em]" style={{ color: '#FF3366' }}>EXTRACTING MAXTERMS</div>
          <AnimatePresence>
            {activeRow !== null && tableRows[activeRow]?.output === false && (() => {
              const row = tableRows[activeRow];
              const M = allMaxterms.find(m => m.index === activeRow);
              if (!M) return null;
              return (
                <motion.div
                  key={activeRow}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl p-4 flex flex-col gap-3"
                  style={{ background: '#111114', border: '1px solid rgba(255,51,102,0.25)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono" style={{ color: '#7A7A8C' }}>Row {row.index} → {row.inputs.map(b => b?'1':'0').join('')}</span>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.3 }}
                      className="text-[10px] font-mono px-2 py-0.5 rounded"
                      style={{ background: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.4)', color: '#FFC107' }}
                    >
                      ⚠ REVERSED
                    </motion.span>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    {VARS.map((v, vi) => {
                      const isComplement = M.complements[vi]; // true = input was 1 → use complement
                      return (
                        <motion.div
                          key={v}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: vi * 0.15 }}
                          className="flex flex-col items-center gap-1"
                        >
                          <div className="px-3 py-1.5 rounded text-[12px] font-mono" style={{ background: '#1A1A1F', border: '1px solid rgba(255,51,102,0.3)', color: '#E8E8F0' }}>
                            {v}={row.inputs[vi] ? '1' : '0'}
                          </div>
                          <div style={{ color: '#7A7A8C', fontSize: 10 }}>↓</div>
                          <div className="text-[14px] font-mono font-bold" style={{ color: isComplement ? '#FFD580' : '#00FF88' }}>
                            {isComplement ? <>{v}<sup style={{ fontSize: '0.7em' }}>′</sup></> : v}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2 px-3 py-2 rounded"
                    style={{ background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.25)' }}
                  >
                    <span className="text-[14px] font-mono" style={{ color: '#A0FFA0' }}>{maxtermToSumTerm(M)}</span>
                    <span className="text-[10px] font-mono ml-2" style={{ color: '#7A7A8C' }}>M{M.index}</span>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </motion.div>

        {/* RIGHT: POS builder */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col gap-3 flex-shrink-0"
          style={{ minWidth: 220 }}
        >
          <div className="text-[10px] font-mono tracking-[0.1em]" style={{ color: '#FF3366' }}>POS BUILDER</div>
          <div
            className="min-h-[80px] rounded-lg p-3 font-mono text-[13px] flex flex-col gap-1"
            style={{ background: '#06060A', border: '1px solid rgba(255,51,102,0.25)' }}
            aria-live="polite"
          >
            <span style={{ color: '#7A7A8C' }}>F =</span>
            {selectedList.length === 0 && <span className="text-[11px]" style={{ color: '#3A3A4A' }}>← Click rows to add terms</span>}
            {selectedList.map((M, i) => (
              <motion.span
                key={M.index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[12px]"
                style={{ color: '#A0FFA0' }}
              >
                {i > 0 && <span style={{ color: '#FF3366' }}>·</span>}
                {maxtermToSumTerm(M)}
              </motion.span>
            ))}
          </div>

          {allSelected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg p-3"
              style={{ background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.25)' }}
            >
              <div className="text-[10px] font-mono mb-1" style={{ color: '#7A7A8C' }}>ΠM NOTATION</div>
              <div className="text-[14px] font-mono" style={{ color: '#FF3366' }}>F = {piMNotation(selectedList)}</div>
              <div className="text-[11px] font-mono mt-1" style={{ color: '#00FF88' }}>✓ CANONICAL POS COMPLETE</div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Microcopy */}
      <div className="px-6 pb-12 text-center flex flex-col gap-1">
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>
          A maxterm covers exactly ONE combination — where the output is 0.
        </p>
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>
          The complement rule is REVERSED compared to minterms — bit=1 means complement here.
        </p>
      </div>
    </SceneWrapper>
  );
};

export default A3_Maxterms;
