import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import TruthTableBuilder from '../components/TruthTableBuilder';
import type { TruthTableRow } from '../ModuleD1.types';
import IntelligenceBrief from '../components/IntelligenceBrief';

const PHASE_COLOR = '#A855F7';

interface A1Props {
  sceneIndex: number;
  currentScene: number;
  tableRows: TruthTableRow[];
  tableLocked: boolean;
  onRowsChange: (rows: TruthTableRow[]) => void;
  onLock: () => void;
}

// Parity challenge check: F=1 at rows 1,2,4,7
function isParityFunction(rows: TruthTableRow[]): boolean {
  const onRows = new Set([1, 2, 4, 7]);
  return rows.every(r => {
    if (r.output === null) return false;
    return r.output === onRows.has(r.index);
  });
}

// Binary tree SVG for the 2^n explainer
const BinaryTree: React.FC = () => (
  <svg width={220} height={160} viewBox="0 0 220 160" role="img" aria-label="Binary tree showing 2^n combinations">
    <title>Binary tree: 2^n input combinations</title>
    {/* n=1 root */}
    <circle cx={110} cy={16} r={10} fill="#1A1A1F" stroke="#A855F7" strokeWidth={1.5} />
    <text x={110} y={20} textAnchor="middle" fontSize={8} fill="#A855F7" fontFamily="IBM Plex Mono">n=1</text>
    {/* n=1 leaves */}
    <line x1={110} y1={26} x2={65} y2={55} stroke="#A855F7" strokeWidth={1} strokeDasharray="4,2" />
    <line x1={110} y1={26} x2={155} y2={55} stroke="#A855F7" strokeWidth={1} strokeDasharray="4,2" />
    <circle cx={65} cy={62} r={10} fill="#1A1A1F" stroke="#A855F7" strokeWidth={1.5} />
    <text x={65} y={66} textAnchor="middle" fontSize={8} fill="#E8E8F0" fontFamily="IBM Plex Mono">0</text>
    <circle cx={155} cy={62} r={10} fill="#1A1A1F" stroke="#A855F7" strokeWidth={1.5} />
    <text x={155} y={66} textAnchor="middle" fontSize={8} fill="#E8E8F0" fontFamily="IBM Plex Mono">1</text>
    {/* n=2 */}
    <line x1={65} y1={72} x2={38} y2={102} stroke="#A855F788" strokeWidth={1} />
    <line x1={65} y1={72} x2={92} y2={102} stroke="#A855F788" strokeWidth={1} />
    <line x1={155} y1={72} x2={128} y2={102} stroke="#A855F788" strokeWidth={1} />
    <line x1={155} y1={72} x2={182} y2={102} stroke="#A855F788" strokeWidth={1} />
    {[38,92,128,182].map((cx, i) => (
      <g key={cx}>
        <circle cx={cx} cy={108} r={8} fill="#1A1A1F" stroke="#A855F766" strokeWidth={1.5} />
        <text x={cx} y={112} textAnchor="middle" fontSize={7} fill="#C084FC" fontFamily="IBM Plex Mono">
          {['00','01','10','11'][i]}
        </text>
      </g>
    ))}
    {/* n=3 hint */}
    <text x={110} y={148} textAnchor="middle" fontSize={9} fill="#7A7A8C" fontFamily="IBM Plex Mono">
      n=3 → 8 leaves…
    </text>
  </svg>
);

const A1_TruthTableContract: React.FC<A1Props> = ({
  sceneIndex, currentScene, tableRows, tableLocked, onRowsChange, onLock,
}) => {
  const isActive = currentScene === sceneIndex;
  const allFilled = tableRows.every(r => r.output !== null);
  const isParityBonus = allFilled && isParityFunction(tableRows);

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="A" name="CANONICAL FORMS" color={PHASE_COLOR} />

      <div className="flex flex-col md:flex-row items-start justify-center flex-1 gap-8 pt-16 pb-6 px-6 md:px-10">
        {/* LEFT: 2^n tree */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 flex-shrink-0"
          style={{ minWidth: 220 }}
        >
          <div style={{ color: PHASE_COLOR, fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em' }}>
            2ⁿ INPUT COMBINATIONS
          </div>
          <BinaryTree />
          <div className="flex flex-col gap-4">
            <IntelligenceBrief 
               type="theory"
               title="2ⁿ Complexity"
               description="Every input variable doubles the number of rows. 3 variables = 8 rows. 4 variables = 16 rows."
               details="This exponential growth is why we need K-Maps and Logic Minimization—to handle high-complexity systems without bloated circuitry."
            />
          </div>

          {/* Parity bonus */}
          {isParityBonus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 py-2 rounded-lg text-[11px] font-mono"
              style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid #00FF8844', color: '#00FF88' }}
            >
              +BONUS: You just built a parity circuit.
              Used in every communication system.
            </motion.div>
          )}
        </motion.div>

        {/* RIGHT: Interactive truth table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col gap-4 flex-1 min-w-0 max-w-sm"
        >
          <div className="flex items-center gap-3">
            <span style={{ color: PHASE_COLOR, fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em' }}>
              3-VARIABLE TRUTH TABLE
            </span>
            {tableLocked && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-[10px] font-mono px-2 py-0.5 rounded"
                style={{ background: `${PHASE_COLOR}22`, border: `1px solid ${PHASE_COLOR}66`, color: PHASE_COLOR }}
              >
                LOCKED
              </motion.span>
            )}
          </div>

          {/* Challenge hint */}
          {!tableLocked && (
            <div
              className="px-3 py-2 rounded-lg text-[11px] font-mono"
              style={{ background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.2)', color: '#FFC107' }}
            >
              CHALLENGE: Make F=1 when COUNT of 1s in A,B,C is ODD.
            </div>
          )}

          <TruthTableBuilder
            variables={['A', 'B', 'C']}
            rows={tableRows}
            locked={tableLocked}
            onRowsChange={onRowsChange}
            accentColor={PHASE_COLOR}
          />

          {/* Lock button */}
          {allFilled && !tableLocked && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLock}
              className="px-5 py-2.5 rounded-full text-[13px] font-mono font-semibold self-start focus:outline-none focus:ring-2"
              style={{
                background: PHASE_COLOR,
                color: '#000',
                letterSpacing: '0.06em',
                focusRingColor: PHASE_COLOR,
              }}
            >
              LOCK TABLE ■
            </motion.button>
          )}

          {/* Locked info card */}
          {tableLocked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 rounded-lg text-[12px] font-mono"
              style={{
                background: `${PHASE_COLOR}12`,
                border: `1px solid ${PHASE_COLOR}44`,
                color: '#E8E8F0',
                lineHeight: 1.6,
              }}
            >
              Your truth table is now the SPECIFICATION.
              Every circuit that correctly implements it is equivalent.
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Intelligence Briefing - Phase Bottom */}
      <div className="w-full max-w-5xl px-10 pb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <IntelligenceBrief 
            type="industry"
            title="Design Verification"
            description="In professional silicon design, the Truth Table is the source of truth for formal verification."
            details="Engineers use 'Equivalence Checkers' to prove that their final high-performance Verilog code matches this exact logical contract."
          />
          <IntelligenceBrief 
            type="hardware"
            title="ROM Implementation"
            description="A Truth Table can be directly burned into a ROM chip as a memory address lookup."
            details="Address bits A, B, C become the input pins, and the stored data at that address is the output F."
          />
      </div>
    </SceneWrapper>
  );
};

export default A1_TruthTableContract;
