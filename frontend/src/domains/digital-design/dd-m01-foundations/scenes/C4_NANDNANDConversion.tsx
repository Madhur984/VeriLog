import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import GateSymbol from '../components/GateSymbol';

const PHASE_COLOR = '#22C55E';

interface C4Props { sceneIndex: number; currentScene: number; step: 0|1|2|3; onStepChange: (s: 0|1|2|3) => void; }

const STEP_LABELS = ['START: AND-OR CIRCUIT', 'APPLY DOUBLE NEGATION', 'RESULT: NAND-NAND CIRCUIT'];
const STEP_MICROCOPY = [
  'The canonical AND-OR circuit for F = A\'B + AB\'',
  'Insert double negations at AND outputs and OR inputs — they cancel.',
  'AND-OR becomes NAND-NAND with exactly the same gate count.',
];

const C4_NANDNANDConversion: React.FC<C4Props> = ({ sceneIndex, currentScene, step, onStepChange }) => {
  const isActive = currentScene === sceneIndex;
  const [auto, setAuto] = useState(false);

  const advance = useCallback(() => {
    onStepChange(Math.min(step + 1, 2) as 0|1|2|3);
  }, [step, onStepChange]);

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="C" name="NAND-NAND CONVERSION" color={PHASE_COLOR} />

      <div className="flex flex-col flex-1 pt-14 pb-6 px-6 md:px-10 gap-6 items-center">
        {/* Step indicator */}
        <div className="flex items-center gap-3 mt-2">
          {[0,1,2].map(s => (
            <div
              key={s}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onStepChange(s as 0|1|2|3)}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold transition-all"
                style={{
                  background: step === s ? PHASE_COLOR : step > s ? `${PHASE_COLOR}44` : '#1A1A1F',
                  border: `2px solid ${step >= s ? PHASE_COLOR : '#FFFFFF0F'}`,
                  color: step === s ? '#000' : step > s ? PHASE_COLOR : '#7A7A8C',
                }}
              >
                {step > s ? '✓' : s + 1}
              </div>
              {s < 2 && <div className="w-8 h-px" style={{ background: step > s ? PHASE_COLOR : '#1A1A1F' }} />}
            </div>
          ))}
        </div>

        <div className="text-[12px] font-mono font-bold" style={{ color: PHASE_COLOR }}>
          STEP {step + 1}: {STEP_LABELS[step]}
        </div>

        {/* Circuit visualization */}
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="rounded-xl p-6 w-full max-w-lg"
          style={{ background: '#06060A', border: `1px solid ${PHASE_COLOR}33` }}
        >
          {step === 0 && (
            <svg width={360} height={120} viewBox="0 0 360 120" role="img" aria-label="AND-OR circuit for A'B + AB'">
              <GateSymbol type="AND" x={80} y={10} scale={0.85} strokeColor={PHASE_COLOR} label="G1" />
              <GateSymbol type="AND" x={80} y={65} scale={0.85} strokeColor={PHASE_COLOR} label="G2" />
              <GateSymbol type="OR"  x={220} y={38} scale={0.85} strokeColor={PHASE_COLOR} label="G3" />
              {/* wires */}
              <line x1={137} y1={31} x2={220} y2={55} stroke="#3A3A4A" strokeWidth={1.5} />
              <line x1={137} y1={86} x2={220} y2={71} stroke="#3A3A4A" strokeWidth={1.5} />
              {/* input labels */}
              <text x={4} y={27} fontSize={9} fill="#7A7A8C" fontFamily="IBM Plex Mono">A′</text>
              <text x={4} y={42} fontSize={9} fill="#7A7A8C" fontFamily="IBM Plex Mono">B</text>
              <text x={4} y={72} fontSize={9} fill="#7A7A8C" fontFamily="IBM Plex Mono">A</text>
              <text x={4} y={87} fontSize={9} fill="#7A7A8C" fontFamily="IBM Plex Mono">B′</text>
              <text x={300} y={60} fontSize={10} fill="#7A7A8C" fontFamily="IBM Plex Mono">F</text>
            </svg>
          )}
          {step === 1 && (
            <div className="flex flex-col gap-3 text-[11px] font-mono">
              <div style={{ color: PHASE_COLOR }}>Insert double negations:</div>
              {['Bubble at G1 output → ¬', 'Bubble at G2 output → ¬', 'Bubbles at G3 inputs → ¬ cancel'].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.25 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: PHASE_COLOR }} />
                  <span style={{ color: '#E8E8F0' }}>{s}</span>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="px-3 py-2 rounded mt-2"
                style={{ background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.2)', color: '#FF3366' }}
              >
                ¬¬X = X (double negation law) — they cancel!
              </motion.div>
              <div className="text-[12px] font-mono mt-1" style={{ color: PHASE_COLOR }}>
                F = NAND( NAND(A′,B), NAND(A,B′) )
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <svg width={360} height={120} viewBox="0 0 360 120" role="img" aria-label="NAND-NAND circuit">
                <GateSymbol type="NAND" x={80} y={10} scale={0.85} strokeColor={PHASE_COLOR} label="G1" active />
                <GateSymbol type="NAND" x={80} y={65} scale={0.85} strokeColor={PHASE_COLOR} label="G2" active />
                <GateSymbol type="NAND" x={220} y={38} scale={0.85} strokeColor={PHASE_COLOR} label="G3" active />
                <line x1={137} y1={31} x2={220} y2={55} stroke={PHASE_COLOR} strokeWidth={1.5} />
                <line x1={137} y1={86} x2={220} y2={71} stroke={PHASE_COLOR} strokeWidth={1.5} />
                <text x={4} y={27} fontSize={9} fill="#7A7A8C" fontFamily="IBM Plex Mono">A′</text>
                <text x={4} y={42} fontSize={9} fill="#7A7A8C" fontFamily="IBM Plex Mono">B</text>
                <text x={4} y={72} fontSize={9} fill="#7A7A8C" fontFamily="IBM Plex Mono">A</text>
                <text x={4} y={87} fontSize={9} fill="#7A7A8C" fontFamily="IBM Plex Mono">B′</text>
                <text x={300} y={60} fontSize={10} fill={PHASE_COLOR} fontFamily="IBM Plex Mono">F</text>
              </svg>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
                className="flex items-center gap-3 px-4 py-2 rounded"
                style={{ background: `${PHASE_COLOR}15`, border: `1px solid ${PHASE_COLOR}44` }}
              >
                <span style={{ color: PHASE_COLOR, fontSize: 18, fontWeight: 700 }}>3</span>
                <span className="text-[11px] font-mono" style={{ color: PHASE_COLOR }}>NAND GATES — same count as AND-OR!</span>
              </motion.div>
              <div className="text-[11px] font-mono" style={{ color: '#7A7A8C' }}>
                The double negation trick costs ZERO extra gates.
              </div>
            </div>
          )}
        </motion.div>

        {/* Microcopy */}
        <div className="text-center text-[12px] font-mono max-w-md" style={{ color: '#7A7A8C' }}>
          {STEP_MICROCOPY[step]}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {step < 2 && (
            <button
              onClick={advance}
              className="px-5 py-2 rounded-lg text-[12px] font-mono font-semibold"
              style={{ background: PHASE_COLOR, color: '#000' }}
            >
              NEXT STEP →
            </button>
          )}
          <button
            onClick={() => onStepChange(0)}
            className="px-4 py-2 rounded-lg text-[12px] font-mono border"
            style={{ borderColor: '#FFFFFF0F', color: '#7A7A8C' }}
          >
            RESET
          </button>
        </div>

        {/* De Morgan card */}
        <div
          className="rounded-lg px-4 py-3 text-[10px] font-mono"
          style={{ background: '#111114', border: '1px solid #FFFFFF0F' }}
        >
          <div style={{ color: PHASE_COLOR, fontWeight: 700, marginBottom: 4 }}>De Morgan's Theorem</div>
          <div style={{ color: '#A0FFA0' }}>(A·B)′ = A′ + B′</div>
          <div style={{ color: '#A0FFA0' }}>(A+B)′ = A′·B′</div>
          <div style={{ color: '#7A7A8C', marginTop: 4 }}>AND with bubble on output = NAND</div>
          <div style={{ color: '#7A7A8C' }}>OR with bubbles on inputs = NAND (by De Morgan)</div>
        </div>
      </div>
    </SceneWrapper>
  );
};

export default C4_NANDNANDConversion;
