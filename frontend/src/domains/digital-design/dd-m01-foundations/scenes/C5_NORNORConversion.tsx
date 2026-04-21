import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import GateSymbol from '../components/GateSymbol';

const PHASE_COLOR = '#22C55E';

interface C5Props { sceneIndex: number; currentScene: number; step: 0|1|2|3; onStepChange: (s: 0|1|2|3) => void; }

const STEP_LABELS = ['START: OR-AND CIRCUIT', 'APPLY DOUBLE NEGATION', 'RESULT: NOR-NOR CIRCUIT'];
const STEP_MICROCOPY = [
  'The canonical OR-AND circuit for F = (A+B)·(A\'+B\')',
  'Insert bubbles at OR outputs and AND inputs.',
  'OR-AND becomes NOR-NOR. Same gate cost — one gate type.',
];

const C5_NORNORConversion: React.FC<C5Props> = ({ sceneIndex, currentScene, step, onStepChange }) => {
  const isActive = currentScene === sceneIndex;
  const NOR_COLOR = '#3B82F6';

  const advance = () => onStepChange(Math.min(step + 1, 2) as 0|1|2|3);

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={NOR_COLOR}>
      <PhaseLabel phase="C" name="NOR-NOR CONVERSION" color={NOR_COLOR} />

      <div className="flex flex-col flex-1 pt-14 pb-6 px-6 md:px-10 gap-6 items-center">
        {/* Step indicator */}
        <div className="flex items-center gap-3 mt-2">
          {[0,1,2].map(s => (
            <div key={s} className="flex items-center gap-2 cursor-pointer" onClick={() => onStepChange(s as 0|1|2|3)}>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold transition-all"
                style={{
                  background: step === s ? NOR_COLOR : step > s ? `${NOR_COLOR}44` : '#1A1A1F',
                  border: `2px solid ${step >= s ? NOR_COLOR : '#FFFFFF0F'}`,
                  color: step === s ? '#000' : step > s ? NOR_COLOR : '#7A7A8C',
                }}
              >
                {step > s ? '✓' : s + 1}
              </div>
              {s < 2 && <div className="w-8 h-px" style={{ background: step > s ? NOR_COLOR : '#1A1A1F' }} />}
            </div>
          ))}
        </div>

        <div className="text-[12px] font-mono font-bold" style={{ color: NOR_COLOR }}>
          STEP {step + 1}: {STEP_LABELS[step]}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="rounded-xl p-6 w-full max-w-lg"
          style={{ background: '#06060A', border: `1px solid ${NOR_COLOR}33` }}
        >
          {step === 0 && (
            <svg width={360} height={120} viewBox="0 0 360 120" role="img" aria-label="OR-AND circuit">
              <GateSymbol type="OR"  x={80} y={10} scale={0.85} strokeColor={NOR_COLOR} label="G1" />
              <GateSymbol type="OR"  x={80} y={65} scale={0.85} strokeColor={NOR_COLOR} label="G2" />
              <GateSymbol type="AND" x={220} y={38} scale={0.85} strokeColor={NOR_COLOR} label="G3" />
              <line x1={137} y1={31} x2={220} y2={55} stroke="#3A3A4A" strokeWidth={1.5} />
              <line x1={137} y1={86} x2={220} y2={71} stroke="#3A3A4A" strokeWidth={1.5} />
              <text x={4} y={27} fontSize={9} fill="#7A7A8C" fontFamily="IBM Plex Mono">A</text>
              <text x={4} y={42} fontSize={9} fill="#7A7A8C" fontFamily="IBM Plex Mono">B</text>
              <text x={4} y={72} fontSize={9} fill="#7A7A8C" fontFamily="IBM Plex Mono">A′</text>
              <text x={4} y={87} fontSize={9} fill="#7A7A8C" fontFamily="IBM Plex Mono">B′</text>
            </svg>
          )}
          {step === 1 && (
            <div className="flex flex-col gap-3 text-[11px] font-mono">
              <div style={{ color: NOR_COLOR }}>Apply De Morgan to OR-AND:</div>
              {["Add bubble at G1 output", "Add bubble at G2 output", "Both bubbles cancel AND inputs"].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.25 }} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: NOR_COLOR }} />
                  <span style={{ color: '#E8E8F0' }}>{s}</span>
                </motion.div>
              ))}
              <div className="text-[12px] font-mono mt-2" style={{ color: NOR_COLOR }}>
                F = NOR( NOR(A,B), NOR(A′,B′) )
              </div>
              <div className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>
                (A+B)′′ = A+B — double negation cancels.
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <svg width={360} height={120} viewBox="0 0 360 120" role="img" aria-label="NOR-NOR circuit">
                <GateSymbol type="NOR" x={80} y={10} scale={0.85} strokeColor={NOR_COLOR} label="G1" active />
                <GateSymbol type="NOR" x={80} y={65} scale={0.85} strokeColor={NOR_COLOR} label="G2" active />
                <GateSymbol type="NOR" x={220} y={38} scale={0.85} strokeColor={NOR_COLOR} label="G3" active />
                <line x1={137} y1={31} x2={220} y2={55} stroke={NOR_COLOR} strokeWidth={1.5} />
                <line x1={137} y1={86} x2={220} y2={71} stroke={NOR_COLOR} strokeWidth={1.5} />
              </svg>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
                className="flex items-center gap-3 px-4 py-2 rounded"
                style={{ background: `${NOR_COLOR}15`, border: `1px solid ${NOR_COLOR}44` }}
              >
                <span style={{ color: NOR_COLOR, fontSize: 18, fontWeight: 700 }}>3</span>
                <span className="text-[11px] font-mono" style={{ color: NOR_COLOR }}>NOR GATES — same cost!</span>
              </motion.div>
            </div>
          )}
        </motion.div>

        <div className="text-center text-[12px] font-mono max-w-md" style={{ color: '#7A7A8C' }}>
          {STEP_MICROCOPY[step]}
        </div>

        <div className="flex items-center gap-4">
          {step < 2 && (
            <button onClick={advance} className="px-5 py-2 rounded-lg text-[12px] font-mono font-semibold" style={{ background: NOR_COLOR, color: '#000' }}>
              NEXT STEP →
            </button>
          )}
          <button onClick={() => onStepChange(0)} className="px-4 py-2 rounded-lg text-[12px] font-mono border" style={{ borderColor: '#FFFFFF0F', color: '#7A7A8C' }}>
            RESET
          </button>
        </div>

        {/* Comparison card */}
        <div className="rounded-lg px-4 py-3 text-[10px] font-mono" style={{ background: '#111114', border: '1px solid #FFFFFF0F' }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div style={{ color: PHASE_COLOR, fontWeight: 700, marginBottom: 2 }}>SOP → NAND-NAND</div>
              <div style={{ color: '#7A7A8C' }}>Apply DeMorgan to AND gates</div>
            </div>
            <div>
              <div style={{ color: NOR_COLOR, fontWeight: 700, marginBottom: 2 }}>POS → NOR-NOR</div>
              <div style={{ color: '#7A7A8C' }}>Apply DeMorgan to OR gates</div>
            </div>
          </div>
        </div>
      </div>
    </SceneWrapper>
  );
};

export default C5_NORNORConversion;
