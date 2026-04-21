import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import CircuitCanvas from '../components/CircuitCanvas';
import ExpressionDisplay from '../components/ExpressionDisplay';
import type { CircuitForm } from '../ModuleD1.types';
import { parseSOP } from '../../../../shared/utils/booleanEngine';

const PHASE_COLOR = '#22C55E';
const VARS = ['A', 'B', 'C'];

interface C1Props { sceneIndex: number; currentScene: number; expressionInput: string; circuitMode: CircuitForm; onExpressionChange: (e: string) => void; onCircuitModeChange: (m: CircuitForm) => void; }

const C1_TwoLevelRealisation: React.FC<C1Props> = ({
  sceneIndex, currentScene, expressionInput, circuitMode, onExpressionChange, onCircuitModeChange,
}) => {
  const isActive = currentScene === sceneIndex;
  const [inputValues, setInputValues] = useState<boolean[]>([false, false, false]);
  const [tracing, setTracing] = useState(false);

  const isSOP = circuitMode === 'AND-OR' || circuitMode === 'NAND-NAND';
  const minterms = parseSOP(expressionInput, VARS);

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="C" name="REALISATION" color={PHASE_COLOR} />

      <div className="flex flex-col flex-1 pt-14 pb-6 px-6 md:px-10 gap-5">
        {/* Mode toggle */}
        <div className="flex items-center gap-4 flex-wrap">
          {(['AND-OR', 'NAND-NAND', 'OR-AND', 'NOR-NOR'] as CircuitForm[]).map(mode => (
            <button
              key={mode}
              onClick={() => onCircuitModeChange(mode)}
              className="px-4 py-1.5 rounded-full text-[11px] font-mono transition-all focus:outline-none focus:ring-2"
              style={{
                background: circuitMode === mode ? PHASE_COLOR : 'transparent',
                border: `1px solid ${circuitMode === mode ? PHASE_COLOR : '#FFFFFF0F'}`,
                color: circuitMode === mode ? '#000' : '#7A7A8C',
              }}
              aria-pressed={circuitMode === mode}
            >
              ▶ {mode}
            </button>
          ))}
        </div>

        {/* Expression input */}
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-mono" style={{ color: '#7A7A8C' }}>F =</span>
          <input
            type="text"
            value={expressionInput}
            onChange={e => onExpressionChange(e.target.value)}
            className="px-4 py-2 rounded-lg text-[14px] font-mono focus:outline-none focus:ring-2 flex-1 max-w-sm transition-all"
            style={{
              background: '#111114', 
              border: `2px solid ${PHASE_COLOR}44`,
              boxShadow: `0 0 10px ${PHASE_COLOR}11`,
              color: '#A0FFA0', 
              fontFamily: 'IBM Plex Mono, monospace',
            }}
            placeholder="e.g. A'B + ABC"
            aria-label="Boolean expression input"
          />
          <span className="text-[10px] font-mono animate-pulse" style={{ color: PHASE_COLOR }}>EDIT ME</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
          {/* Gate breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-2 flex-shrink-0"
            style={{ minWidth: 200 }}
          >
            <div className="text-[10px] font-mono tracking-[0.1em]" style={{ color: PHASE_COLOR }}>GATE MAPPING</div>
            {minterms.map((m, i) => (
              <motion.div
                key={m.index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2 text-[11px] font-mono"
              >
                <span style={{ color: '#7A7A8C' }}>{m.term}</span>
                <span style={{ color: '#7A7A8C' }}>→</span>
                <span style={{ color: PHASE_COLOR }}>{isSOP ? 'AND' : 'OR'} gate [G{i + 1}]</span>
              </motion.div>
            ))}
            {minterms.length > 0 && (
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span style={{ color: '#7A7A8C' }}>All outputs →</span>
                <span style={{ color: PHASE_COLOR }}>{isSOP ? 'OR' : 'AND'} gate [G{minterms.length + 1}]</span>
              </div>
            )}
            <div className="mt-2 text-[10px] font-mono flex gap-3" style={{ color: '#7A7A8C' }}>
              <span>Level 1: <strong style={{ color: PHASE_COLOR }}>{minterms.length}</strong> gates</span>
              <span>Total: <strong style={{ color: PHASE_COLOR }}>{minterms.length + 1}</strong></span>
            </div>
          </motion.div>

          {/* Circuit */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-4 flex-1 min-w-0"
          >
            <div className="rounded-xl overflow-hidden" style={{ background: '#06060A', border: '1px solid #FFFFFF0F', padding: 16 }}>
              <CircuitCanvas
                form={circuitMode}
                minterms={minterms}
                variables={VARS}
                inputValues={tracing ? inputValues : undefined}
                width={380}
                height={Math.max(160, minterms.length * 56)}
              />
            </div>

            {!tracing ? (
              <button
                onClick={() => setTracing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-mono self-start"
                style={{ border: `1px solid ${PHASE_COLOR}44`, color: PHASE_COLOR, background: `${PHASE_COLOR}0D` }}
              >
                ▶ TRACE A PATH
              </button>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                {VARS.map((v, i) => (
                  <button key={v}
                    onClick={() => setInputValues(p => { const n=[...p]; n[i]=!n[i]; return n; })}
                    className="px-3 py-1.5 rounded text-[12px] font-mono transition-all"
                    style={{
                      background: inputValues[i] ? `${PHASE_COLOR}22` : '#1A1A1F',
                      border: `1px solid ${inputValues[i] ? PHASE_COLOR : '#FFFFFF0F'}`,
                      color: inputValues[i] ? PHASE_COLOR : '#7A7A8C',
                    }}
                  >
                    {v}={inputValues[i]?'1':'0'}
                  </button>
                ))}
                <button onClick={() => setTracing(false)} className="text-[10px] font-mono text-[#7A7A8C]">✕</button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="px-6 pb-4 text-center flex flex-col gap-1">
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>SOP expressions map directly to AND-OR. POS expressions to OR-AND.</p>
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>Both are two-level structures — and both can be converted to use only one gate type.</p>
      </div>
    </SceneWrapper>
  );
};

export default C1_TwoLevelRealisation;
