import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import CircuitCanvas from '../components/CircuitCanvas';
import ExpressionDisplay from '../components/ExpressionDisplay';
import ModuleRef from '../components/ModuleRef';
import type { TruthTableRow } from '../ModuleD1.types';
import { getMinterms, mintermToProductTerm, sigmaMNotation } from '../../../../shared/utils/booleanEngine';

const PHASE_COLOR = '#A855F7';
const VARS = ['A', 'B', 'C'];

interface A4Props {
  sceneIndex: number;
  currentScene: number;
  tableRows: TruthTableRow[];
}

const A4_CanonicalSOP: React.FC<A4Props> = ({ sceneIndex, currentScene, tableRows }) => {
  const isActive = currentScene === sceneIndex;
  const [inputValues, setInputValues] = useState<boolean[]>([false, false, false]);
  const [tracing, setTracing] = useState(false);
  const [highlightTerm, setHighlightTerm] = useState<number | null>(null);

  const minterms = getMinterms(tableRows, VARS);
  const expression = minterms.length > 0
    ? minterms.map(m => mintermToProductTerm(m)).join(' + ')
    : '0';

  const toggleBit = (i: number) => {
    setInputValues(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="A" name="CANONICAL SOP" color={PHASE_COLOR} />

      <div className="flex flex-col md:flex-row flex-1 gap-6 pt-16 pb-6 px-6 md:px-10 overflow-hidden">
        {/* LEFT: Expression */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 flex-shrink-0"
          style={{ minWidth: 260 }}
        >
          <div style={{ color: PHASE_COLOR, fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em' }}>
            CANONICAL SOP
          </div>

          <ExpressionDisplay
            expression={`F = ${expression}`}
            accentColor={PHASE_COLOR}
            size="md"
            highlightTermIndex={highlightTerm ?? undefined}
          />

          {/* Sigma notation */}
          {minterms.length > 0 && (
            <div
              className="px-4 py-3 rounded-lg text-[13px] font-mono"
              style={{ background: '#06060A', border: '1px solid #00D4FF22', color: PHASE_COLOR }}
            >
              F = {sigmaMNotation(minterms)}
            </div>
          )}

          {/* ModuleRef for minimisation */}
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>Optional step:</div>
            <ModuleRef label="K-MAP MINIMISATION → MODULE DD-M03" color="amber" />
          </div>

          {/* Minterm pills */}
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-mono tracking-[0.08em]" style={{ color: '#7A7A8C' }}>MINTERMS (hover to highlight gate)</div>
            <div className="flex flex-wrap gap-2">
              {minterms.map((m, i) => (
                <motion.span
                  key={m.index}
                  onHoverStart={() => setHighlightTerm(i)}
                  onHoverEnd={() => setHighlightTerm(null)}
                  className="px-2 py-1 rounded text-[11px] font-mono cursor-default"
                  style={{
                    background: `${PHASE_COLOR}1A`,
                    border: `1px solid ${PHASE_COLOR}44`,
                    color: PHASE_COLOR,
                  }}
                >
                  {mintermToProductTerm(m)}<sub style={{ fontSize: '0.65em', opacity: 0.6 }}>m{m.index}</sub>
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Circuit */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col gap-4 flex-1 min-w-0"
        >
          <div style={{ color: PHASE_COLOR, fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em' }}>
            AND-OR CIRCUIT
          </div>

          <div className="rounded-xl overflow-hidden" style={{ background: '#06060A', border: '1px solid #FFFFFF0F', padding: 16 }}>
            <CircuitCanvas
              form="AND-OR"
              minterms={minterms}
              variables={VARS}
              inputValues={tracing ? inputValues : undefined}
              width={380}
              height={Math.max(180, minterms.length * 56)}
            />
          </div>

          {/* Gate count */}
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span style={{ color: '#7A7A8C' }}>Level 1:</span>
            <span style={{ color: '#E8E8F0' }}>{minterms.length} AND gates</span>
            <span style={{ color: '#7A7A8C' }}>│</span>
            <span style={{ color: '#7A7A8C' }}>Level 2:</span>
            <span style={{ color: '#E8E8F0' }}>1 OR gate</span>
            <span style={{ color: '#7A7A8C' }}>│</span>
            <span style={{ color: PHASE_COLOR, fontWeight: 700 }}>Total: {minterms.length + 1}</span>
          </div>

          {/* Signal trace */}
          {!tracing ? (
            <button
              onClick={() => setTracing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-mono self-start transition-all hover:scale-102 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
              style={{ border: '1px solid #00D4FF44', color: '#00D4FF', background: 'rgba(0,212,255,0.06)' }}
            >
              ▶ TRACE SIGNAL
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                {VARS.map((v, i) => (
                  <button
                    key={v}
                    onClick={() => toggleBit(i)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded text-[12px] font-mono transition-all"
                    style={{
                      background: inputValues[i] ? 'rgba(0,212,255,0.15)' : '#1A1A1F',
                      border: `1px solid ${inputValues[i] ? '#00D4FF66' : '#FFFFFF0F'}`,
                      color: inputValues[i] ? '#00D4FF' : '#7A7A8C',
                    }}
                    aria-pressed={inputValues[i]}
                  >
                    {v} = {inputValues[i] ? '1' : '0'}
                  </button>
                ))}
                <button onClick={() => setTracing(false)} className="text-[10px] font-mono text-[#7A7A8C] hover:text-[#FF3366] ml-2">✕</button>
              </div>
              <div className="text-[11px] font-mono" style={{ color: '#7A7A8C' }}>
                For {VARS.join('')}={inputValues.map(b => b?'1':'0').join('')}:
                <span style={{ color: '#00D4FF' }}>
                  {' '}F = {minterms.some(m => m.complements.every((c,i)=>(c ? !inputValues[i] : inputValues[i]))) ? '1' : '0'}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Microcopy */}
      <div className="px-6 pb-4 text-center flex flex-col gap-1">
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>Every minterm becomes one AND gate. All AND outputs feed one OR gate.</p>
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>This is the canonical AND-OR structure — a complete circuit for every possible SOP.</p>
      </div>
    </SceneWrapper>
  );
};

export default A4_CanonicalSOP;
