import React from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import CircuitCanvas from '../components/CircuitCanvas';
import type { TruthTableRow } from '../ModuleD1.types';
import { getMinterms } from '../../../../shared/utils/booleanEngine';

const PHASE_COLOR = '#FFC107';
const VARS = ['A', 'B', 'C'];

interface D1Props { sceneIndex: number; currentScene: number; tableRows: TruthTableRow[]; }

const D1_HighPath: React.FC<D1Props> = ({ sceneIndex, currentScene, tableRows }) => {
  const isActive = currentScene === sceneIndex;
  const minterms = getMinterms(tableRows, VARS);

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="D" name="HIGH PATH — SOP" color={PHASE_COLOR} />

      {/* Path label badge */}
      <div className="absolute top-14 right-4 z-20 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold"
        style={{ background: `${PHASE_COLOR}20`, border: `2px solid ${PHASE_COLOR}`, color: PHASE_COLOR }}>
        F = 1 WHEN… MINTERMS FIRE
      </div>

      <div className="flex flex-col flex-1 pt-14 pb-6 px-6 md:px-10 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          className="text-center"
        >
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 18, color: PHASE_COLOR, fontWeight: 800 }}>
            THE HIGH PATH
          </div>
          <div className="text-[12px] font-mono mt-1" style={{ color: '#7A7A8C' }}>
            Focus on minterms → encode when F should be 1 → AND-OR → NAND-NAND
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
          {/* Minterm list */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-3 flex-shrink-0"
            style={{ minWidth: 180 }}
          >
            <div className="text-[10px] font-mono tracking-[0.1em]" style={{ color: PHASE_COLOR }}>FIRING CONDITIONS</div>
            {minterms.map((m, i) => (
              <motion.div
                key={m.index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2 px-3 py-2 rounded"
                style={{ background: `${PHASE_COLOR}10`, border: `1px solid ${PHASE_COLOR}33` }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: PHASE_COLOR }} />
                <span className="text-[11px] font-mono" style={{ color: '#E8E8F0' }}>{m.term}</span>
                <span className="text-[10px] font-mono ml-auto" style={{ color: PHASE_COLOR }}>m{m.index}</span>
              </motion.div>
            ))}

            {/* Path summary */}
            <div
              className="mt-2 rounded-lg px-3 py-3 text-[10px] font-mono leading-relaxed"
              style={{ background: '#111114', border: '1px solid #FFFFFF0F', color: '#7A7A8C' }}
            >
              <div className="mb-1" style={{ color: PHASE_COLOR }}>HIGH PATH FLOW</div>
              <div>Table → identify F=1 rows</div>
              <div>→ Extract minterms</div>
              <div>→ ORed together = SOP</div>
              <div>→ Map to AND-OR gates</div>
              <div>→ Double negation → NAND</div>
            </div>
          </motion.div>

          {/* Circuit */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-4 flex-1 min-w-0"
          >
            <div className="text-[10px] font-mono tracking-[0.1em]" style={{ color: PHASE_COLOR }}>AND-OR → NAND-NAND</div>
            <div className="rounded-xl overflow-hidden" style={{ background: '#06060A', border: `1px solid ${PHASE_COLOR}22`, padding: 16 }}>
              <CircuitCanvas
                form="NAND-NAND"
                minterms={minterms}
                variables={VARS}
                width={380}
                height={Math.max(180, minterms.length * 56)}
              />
            </div>

            {/* Performance info */}
            <div className="flex gap-3 flex-wrap">
              {[
                { label: 'GATE TYPE', value: 'NAND', sub: 'universal' },
                { label: 'LEVELS', value: '2', sub: 'min delay' },
                { label: 'GATE COUNT', value: String(minterms.length + 1), sub: 'optimal for SOP' },
              ].map(info => (
                <div key={info.label} className="flex flex-col gap-0.5 px-3 py-2 rounded" style={{ background: '#111114', border: '1px solid #FFFFFF0F' }}>
                  <div className="text-[9px] font-mono" style={{ color: '#7A7A8C' }}>{info.label}</div>
                  <div className="text-[14px] font-mono font-bold" style={{ color: PHASE_COLOR }}>{info.value}</div>
                  <div className="text-[9px] font-mono" style={{ color: '#7A7A8C' }}>{info.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 pb-4 text-center flex flex-col gap-1">
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>High Path = care about when F=1. Minterms. SOP. AND-OR. NAND-NAND.</p>
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>This path has lower gate count when 1s are fewer than 0s in your truth table.</p>
      </div>
    </SceneWrapper>
  );
};

export default D1_HighPath;
