import React from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import CircuitCanvas from '../components/CircuitCanvas';
import type { TruthTableRow } from '../ModuleD1.types';
import { getMaxterms } from '../../../../shared/utils/booleanEngine';

const NOR_COLOR = '#FF5F1F';
const VARS = ['A', 'B', 'C'];

interface D2Props { sceneIndex: number; currentScene: number; tableRows: TruthTableRow[]; }

const D2_LowPath: React.FC<D2Props> = ({ sceneIndex, currentScene, tableRows }) => {
  const isActive = currentScene === sceneIndex;
  const maxterms = getMaxterms(tableRows, VARS);

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={NOR_COLOR}>
      <PhaseLabel phase="D" name="LOW PATH — POS" color={NOR_COLOR} />

      <div className="absolute top-14 right-4 z-20 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold"
        style={{ background: `${NOR_COLOR}20`, border: `2px solid ${NOR_COLOR}`, color: NOR_COLOR }}>
        F = 0 WHEN… MAXTERMS FIRE
      </div>

      <div className="flex flex-col flex-1 pt-14 pb-6 px-6 md:px-10 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} className="text-center">
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 18, color: NOR_COLOR, fontWeight: 800 }}>
            THE LOW PATH
          </div>
          <div className="text-[12px] font-mono mt-1" style={{ color: '#7A7A8C' }}>
            Focus on maxterms → encode when F should be 0 → OR-AND → NOR-NOR
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
          {/* Maxterm list */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-3 flex-shrink-0"
            style={{ minWidth: 180 }}
          >
            <div className="text-[10px] font-mono tracking-[0.1em]" style={{ color: NOR_COLOR }}>BLOCKING CONDITIONS (F=0)</div>
            {maxterms.map((M, i) => (
              <motion.div
                key={M.index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2 px-3 py-2 rounded"
                style={{ background: 'rgba(255,95,31,0.08)', border: '1px solid rgba(255,95,31,0.25)' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: NOR_COLOR }} />
                <span className="text-[11px] font-mono" style={{ color: '#E8E8F0' }}>{M.term}</span>
                <span className="text-[10px] font-mono ml-auto" style={{ color: NOR_COLOR }}>M{M.index}</span>
              </motion.div>
            ))}

            <div className="mt-2 rounded-lg px-3 py-3 text-[10px] font-mono leading-relaxed" style={{ background: '#111114', border: '1px solid #FFFFFF0F', color: '#7A7A8C' }}>
              <div className="mb-1" style={{ color: NOR_COLOR }}>LOW PATH FLOW</div>
              <div>Table → identify F=0 rows</div>
              <div>→ Extract maxterms</div>
              <div>→ ANDed together = POS</div>
              <div>→ Map to OR-AND gates</div>
              <div>→ Double negation → NOR</div>
            </div>
          </motion.div>

          {/* Circuit */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-4 flex-1 min-w-0"
          >
            <div className="text-[10px] font-mono tracking-[0.1em]" style={{ color: NOR_COLOR }}>OR-AND → NOR-NOR</div>
            <div className="rounded-xl overflow-hidden" style={{ background: '#06060A', border: 'rgba(255,95,31,0.15) 1px solid', padding: 16 }}>
              <CircuitCanvas
                form="NOR-NOR"
                maxterms={maxterms}
                variables={VARS}
                width={380}
                height={Math.max(180, maxterms.length * 56)}
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              {[
                { label: 'GATE TYPE', value: 'NOR', sub: 'universal' },
                { label: 'LEVELS', value: '2', sub: 'min delay' },
                { label: 'GATE COUNT', value: String(maxterms.length + 1), sub: 'optimal for POS' },
              ].map(info => (
                <div key={info.label} className="flex flex-col gap-0.5 px-3 py-2 rounded" style={{ background: '#111114', border: '1px solid #FFFFFF0F' }}>
                  <div className="text-[9px] font-mono" style={{ color: '#7A7A8C' }}>{info.label}</div>
                  <div className="text-[14px] font-mono font-bold" style={{ color: NOR_COLOR }}>{info.value}</div>
                  <div className="text-[9px] font-mono" style={{ color: '#7A7A8C' }}>{info.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 pb-4 text-center flex flex-col gap-1">
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>Low Path = care about when F=0. Maxterms. POS. OR-AND. NOR-NOR.</p>
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>This path wins when 0s are fewer than 1s in your truth table.</p>
      </div>
    </SceneWrapper>
  );
};

export default D2_LowPath;
