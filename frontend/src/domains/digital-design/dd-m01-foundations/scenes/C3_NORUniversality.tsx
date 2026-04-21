import React from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import GateSymbol from '../components/GateSymbol';

const PHASE_COLOR = '#22C55E';

interface C3Props { sceneIndex: number; currentScene: number; }

const NOR_DERIVATIONS = [
  { title: 'NOR → NOT', proof: 'NOR(A,A) = (A+A)\' = A\'', steps: ['Tie both inputs to A', '(A+A)\' = A\''] },
  { title: 'NOR → OR',  proof: 'NOT(NOR(A,B)) = (A+B)\'\' = A+B', steps: ['NOR(A,B) = (A+B)\'', 'Add NOT: ((A+B)\')\'= A+B'] },
  { title: 'NOR → AND', proof: "NOR(A',B') = (A'+B')' = A·B", steps: ["Invert A and B with NOR(X,X)", "NOR(A',B') applies De Morgan"] },
];

const C3_NORUniversality: React.FC<C3Props> = ({ sceneIndex, currentScene }) => {
  const isActive = currentScene === sceneIndex;
  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="C" name="NOR UNIVERSALITY" color={PHASE_COLOR} />

      <div className="flex flex-col flex-1 pt-14 pb-6 px-6 md:px-10 gap-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          className="text-center"
        >
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 20, color: PHASE_COLOR, fontWeight: 800 }}>
            NOR IS EQUALLY UNIVERSAL
          </div>
        </motion.div>

        {NOR_DERIVATIONS.map((d, i) => (
          <motion.div
            key={d.title}
            initial={{ opacity: 0, x: -16 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.2, duration: 0.4 }}
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{ background: '#111114', border: `1px solid ${PHASE_COLOR}33` }}
          >
            <div className="text-[11px] font-mono font-bold" style={{ color: PHASE_COLOR }}>{d.title}</div>
            <div className="flex items-center gap-3">
              <svg width={90} height={44} viewBox="0 0 90 44">
                <GateSymbol type="NOR" x={0} y={2} scale={0.75} strokeColor={PHASE_COLOR} />
              </svg>
              <span style={{ color: '#7A7A8C', fontSize: 18 }}>≡</span>
              <div className="text-[11px] font-mono leading-relaxed" style={{ color: '#A0FFA0' }}>
                {d.proof}
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              {d.steps.map((s, si) => (
                <div key={si} className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>
                  {si + 1}. {s}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* When NOR preferred */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="rounded-xl p-5"
          style={{ background: '#111114', border: '1px solid #3B82F633' }}
        >
          <div className="text-[11px] font-mono font-bold mb-3" style={{ color: '#3B82F6' }}>WHEN NOR IS PREFERRED</div>
          <div className="flex flex-col gap-2 text-[11px] font-mono" style={{ color: '#7A7A8C', lineHeight: 1.6 }}>
            <div>• CMOS pull-up networks prefer NOR topology (PMOS series)</div>
            <div>• Some ECL (Emitter-Coupled Logic) families use NOR natively</div>
            <div>• <span style={{ color: '#22C55E' }}>TTL: NAND wins.</span> <span style={{ color: '#3B82F6' }}>Some CMOS styles: NOR wins.</span></div>
            <div>• Always check your technology library before assuming NAND.</div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 pb-4 text-center flex flex-col gap-1">
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>NOR is equally universal — every NAND derivation has a NOR equivalent.</p>
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>In some technologies, NOR is the cheaper gate. Know your fab process.</p>
      </div>
    </SceneWrapper>
  );
};

export default C3_NORUniversality;
