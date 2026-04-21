import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import CircuitCanvas from '../components/CircuitCanvas';
import ModuleRef from '../components/ModuleRef';
import type { TruthTableRow } from '../ModuleD1.types';
import { getMinterms, getMaxterms, maxtermToSumTerm, piMNotation } from '../../../../shared/utils/booleanEngine';

const PHASE_COLOR = '#A855F7';
const VARS = ['A', 'B', 'C'];

interface A5Props {
  sceneIndex: number;
  currentScene: number;
  tableRows: TruthTableRow[];
}

const A5_CanonicalPOS: React.FC<A5Props> = ({ sceneIndex, currentScene, tableRows }) => {
  const isActive = currentScene === sceneIndex;
  const [inputValues, setInputValues] = useState<boolean[]>([false, false, false]);
  const [tracing, setTracing] = useState(false);

  const minterms = getMinterms(tableRows, VARS);
  const maxterms = getMaxterms(tableRows, VARS);

  const posExpression = maxterms.length > 0
    ? maxterms.map(M => maxtermToSumTerm(M)).join('·')
    : '1';

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="A" name="CANONICAL POS" color={PHASE_COLOR} />

      <div className="flex flex-col md:flex-row flex-1 gap-6 pt-16 pb-6 px-6 md:px-10 overflow-hidden">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 flex-shrink-0"
          style={{ minWidth: 260 }}
        >
          <div style={{ color: '#FF3366', fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em' }}>
            CANONICAL POS
          </div>

          <div
            className="px-4 py-3 rounded-lg font-mono text-[13px] leading-relaxed"
            style={{ background: '#06060A', border: '1px solid rgba(255,51,102,0.25)', color: '#A0FFA0' }}
          >
            F = {posExpression}
          </div>

          {maxterms.length > 0 && (
            <div
              className="px-4 py-3 rounded-lg text-[13px] font-mono"
              style={{ background: '#06060A', border: '1px solid #FFFFFF0F', color: '#FF3366' }}
            >
              F = {piMNotation(maxterms)}
            </div>
          )}

          <ModuleRef label="K-MAP MINIMISATION → MODULE DD-M03" color="amber" />

          {/* Maxterm pills */}
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>MAXTERMS</div>
            <div className="flex flex-wrap gap-2">
              {maxterms.map(M => (
                <span key={M.index} className="px-2 py-1 rounded text-[10px] font-mono" style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.3)', color: '#FF3366' }}>
                  {maxtermToSumTerm(M)}<sub style={{ fontSize: '0.65em', opacity: 0.6 }}>M{M.index}</sub>
                </span>
              ))}
            </div>
          </div>

          {/* Duality reveal */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{ background: '#111114', border: '1px solid #C084FC44' }}
          >
            <div style={{ color: '#C084FC', fontFamily: 'IBM Plex Mono', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em' }}>
              THE DUALITY PRINCIPLE
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="px-2 py-1 rounded text-[10px]" style={{ background: 'rgba(0,255,136,0.1)', color: '#00FF88' }}>
                Minterms: {minterms.map(m=>m.index).join(',')||'—'}
              </span>
              <motion.span animate={{ scale: [1,1.2,1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ color: '#C084FC' }}>↔</motion.span>
              <span className="px-2 py-1 rounded text-[10px]" style={{ background: 'rgba(255,51,102,0.1)', color: '#FF3366' }}>
                Maxterms: {maxterms.map(m=>m.index).join(',')||'—'}
              </span>
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: '#7A7A8C' }}>
              Σm({minterms.map(m=>m.index).join(',')}) ≡ ΠM(all others)<br/>
              The minterms you included in SOP are the maxterms EXCLUDED in POS.
            </p>
          </motion.div>
        </motion.div>

        {/* RIGHT: OR-AND circuit */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col gap-4 flex-1 min-w-0"
        >
          <div style={{ color: '#FF3366', fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em' }}>
            OR-AND CIRCUIT
          </div>
          <div className="rounded-xl overflow-hidden" style={{ background: '#06060A', border: '1px solid rgba(255,51,102,0.15)', padding: 16 }}>
            <CircuitCanvas
              form="OR-AND"
              maxterms={maxterms}
              variables={VARS}
              inputValues={tracing ? inputValues : undefined}
              width={380}
              height={Math.max(180, maxterms.length * 56)}
            />
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span style={{ color: '#7A7A8C' }}>Level 1: {maxterms.length} OR gates</span>
            <span style={{ color: '#7A7A8C' }}>│ Level 2: 1 AND gate</span>
            <span style={{ color: '#FF3366', fontWeight: 700 }}>Total: {maxterms.length + 1}</span>
          </div>

          {!tracing ? (
            <button
              onClick={() => setTracing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-mono self-start"
              style={{ border: '1px solid rgba(255,51,102,0.3)', color: '#FF3366', background: 'rgba(255,51,102,0.06)' }}
            >
              ▶ TRACE SIGNAL
            </button>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              {VARS.map((v, i) => (
                <button
                  key={v}
                  onClick={() => setInputValues(p => { const n=[...p]; n[i]=!n[i]; return n; })}
                  className="px-3 py-1.5 rounded text-[12px] font-mono transition-all"
                  style={{
                    background: inputValues[i] ? 'rgba(255,51,102,0.15)' : '#1A1A1F',
                    border: `1px solid ${inputValues[i] ? '#FF336644' : '#FFFFFF0F'}`,
                    color: inputValues[i] ? '#FF3366' : '#7A7A8C',
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

      <div className="px-6 pb-4 text-center flex flex-col gap-1">
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>Every maxterm becomes one OR gate. All OR outputs feed one AND gate.</p>
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>The minterms you included in SOP are the maxterms you EXCLUDE in POS.</p>
      </div>
    </SceneWrapper>
  );
};

export default A5_CanonicalPOS;
