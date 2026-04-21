import React from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import GateSymbol from '../components/GateSymbol';

const PHASE_COLOR = '#22C55E';

interface C2Props { sceneIndex: number; currentScene: number; }

const DERIVATIONS = [
  {
    title: 'NAND → NOT',
    proof: 'NAND(A,A) = (A·A)\' = A\'',
    gateLeft: <svg width={100} height={48} viewBox="0 0 100 48"><GateSymbol type="NAND" x={0} y={4} scale={0.8} inputs={2} inputStates={[true,true]} strokeColor={PHASE_COLOR} /></svg>,
    gateRight: <svg width={80} height={48} viewBox="0 0 80 48"><GateSymbol type="NOT" x={0} y={4} scale={0.8} strokeColor={PHASE_COLOR} /></svg>,
    transistors: null,
  },
  {
    title: 'NAND → AND',
    proof: 'NOT(NAND(A,B)) = ((A·B)\')\'= A·B',
    gateLeft: <svg width={160} height={48} viewBox="0 0 160 48">
      <GateSymbol type="NAND" x={0} y={4} scale={0.8} strokeColor={PHASE_COLOR} />
      <GateSymbol type="NAND" x={80} y={4} scale={0.8} inputs={1} strokeColor={PHASE_COLOR} />
    </svg>,
    gateRight: <svg width={80} height={48} viewBox="0 0 80 48"><GateSymbol type="AND" x={0} y={4} scale={0.8} strokeColor={PHASE_COLOR} /></svg>,
    transistors: null,
  },
  {
    title: 'NAND → OR',
    proof: "NAND(A',B') = (A'·B')' = A''+B'' = A+B",
    gateLeft: <svg width={200} height={56} viewBox="0 0 200 56">
      <GateSymbol type="NOT" x={0} y={8} scale={0.7} strokeColor={PHASE_COLOR} />
      <GateSymbol type="NOT" x={0} y={32} scale={0.7} strokeColor={PHASE_COLOR} />
      <GateSymbol type="NAND" x={80} y={8} scale={0.8} strokeColor={PHASE_COLOR} />
    </svg>,
    gateRight: <svg width={80} height={48} viewBox="0 0 80 48"><GateSymbol type="OR" x={0} y={4} scale={0.8} strokeColor={PHASE_COLOR} /></svg>,
    transistors: null,
  },
];

const TRANSISTOR_COUNTS = [
  { gate: 'AND', count: 6 },
  { gate: 'NAND', count: 4 },
  { gate: 'OR', count: 6 },
  { gate: 'NOR', count: 4 },
];

const C2_NANDUniversality: React.FC<C2Props> = ({ sceneIndex, currentScene }) => {
  const isActive = currentScene === sceneIndex;
  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="C" name="NAND UNIVERSALITY" color={PHASE_COLOR} />

      <div className="flex flex-col flex-1 pt-14 pb-6 px-6 md:px-10 gap-6 overflow-y-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          className="text-center"
        >
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 22, color: PHASE_COLOR, fontWeight: 800 }}>
            ONE GATE. EVERY FUNCTION.
          </div>
          <div className="text-[13px] font-mono mt-1" style={{ color: '#7A7A8C' }}>
            NAND is sufficient for all of digital logic.
          </div>
        </motion.div>

        {/* Derivations */}
        <div className="flex flex-col gap-4">
          {DERIVATIONS.map((d, i) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, x: -16 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 0.4 }}
              className="flex items-center gap-6 rounded-xl p-4 flex-wrap"
              style={{ background: '#111114', border: `1px solid ${PHASE_COLOR}33` }}
            >
              <div className="flex flex-col gap-1 flex-shrink-0" style={{ minWidth: 100 }}>
                <div className="text-[11px] font-mono font-bold" style={{ color: PHASE_COLOR }}>{d.title}</div>
                <div className="text-[10px] font-mono leading-relaxed" style={{ color: '#7A7A8C' }}>{d.proof}</div>
              </div>
              <div className="flex items-center gap-3">
                {d.gateLeft}
                <span style={{ color: '#7A7A8C', fontSize: 18 }}>≡</span>
                {d.gateRight}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transistor count comparison */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="rounded-xl p-5"
          style={{ background: '#111114', border: '1px solid #FF5F1F44' }}
          role="region"
          aria-label="Transistor count comparison"
        >
          <div className="text-[11px] font-mono font-bold mb-3" style={{ color: '#FF5F1F' }}>WHY THE INDUSTRY CHOSE NAND</div>
          <div className="flex gap-4 items-end flex-wrap">
            {TRANSISTOR_COUNTS.map(tc => (
              <div key={tc.gate} className="flex flex-col items-center gap-1">
                <div className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>{tc.gate}</div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={isActive ? { height: tc.count * 8 } : { height: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="w-10 rounded"
                  style={{
                    background: tc.count === 4 ? PHASE_COLOR : '#3A3A4A',
                  }}
                />
                <div className="text-[11px] font-mono font-bold" style={{ color: tc.count === 4 ? PHASE_COLOR : '#7A7A8C' }}>
                  {tc.count}
                </div>
                {tc.count === 4 && (
                  <div className="text-[8px] font-mono" style={{ color: PHASE_COLOR }}>FEWER</div>
                )}
              </div>
            ))}
          </div>
          <div className="text-[10px] font-mono mt-3" style={{ color: '#7A7A8C' }}>
            Fewer transistors = smaller die area = lower cost = lower power.
          </div>
        </motion.div>
      </div>

      <div className="px-6 pb-4 text-center flex flex-col gap-1">
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>NAND and NOR are each sufficient to implement any Boolean function.</p>
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>This is why real chip families use mostly NAND or mostly NOR — one gate to fabricate.</p>
      </div>
    </SceneWrapper>
  );
};

export default C2_NANDUniversality;
