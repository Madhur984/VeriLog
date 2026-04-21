import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import KMapGrid2Var from '../components/KMapGrid2Var';
import ModuleRef from '../components/ModuleRef';

const PHASE_COLOR = '#3B82F6';

interface B2Props { sceneIndex: number; currentScene: number; cells: boolean[]; onCellsChange: (c: boolean[]) => void; }

type PresetKey = 'ex1' | 'ex2' | 'ex3';
const PRESETS: Record<PresetKey, { cells: boolean[]; label: string; result: string; groupPositions: number[] }> = {
  ex1: { cells: [false, true, false, true], label: 'AB + AB\'', result: 'A', groupPositions: [2, 3] },
  ex2: { cells: [false, false, true, true], label: 'A\'B + AB', result: 'B', groupPositions: [1, 3] },
  ex3: { cells: [true, false, true, false], label: 'A\'B\' + AB\'', result: 'B\'', groupPositions: [0, 2] },
};

const B2_KMapIntuition: React.FC<B2Props> = ({ sceneIndex, currentScene, cells, onCellsChange }) => {
  const isActive = currentScene === sceneIndex;
  const [grouped, setGrouped] = useState<number[] | null>(null);
  const [simplifiedTerm, setSimplifiedTerm] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<PresetKey | null>(null);

  const onesCount = cells.filter(Boolean).length;
  const ADJACENT_PAIRS: [number, number][] = [[0,1],[2,3],[0,2],[1,3]];
  const hasAdjacency = ADJACENT_PAIRS.some(([a, b]) => cells[a] && cells[b]);

  const handleGroup = () => {
    for (const [a, b] of ADJACENT_PAIRS) {
      if (cells[a] && cells[b]) {
        setGrouped([a, b]);
        const terms = ['A\'B\'','A\'B','AB\'','AB'];
        setSimplifiedTerm(`${a===0||a===2?'A\'':'A'}${b===1||b===3?'B':'B\''}`);
        return;
      }
    }
  };

  const loadPreset = (key: PresetKey) => {
    const p = PRESETS[key];
    onCellsChange(p.cells);
    setGrouped(p.groupPositions);
    setSimplifiedTerm(p.result);
    setActivePreset(key);
  };

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="B" name="K-MAP INTUITION" color={PHASE_COLOR} />

      {/* Warning card — always visible */}
      <div
        className="absolute top-14 right-4 z-20 rounded-xl p-4 text-[10px] font-mono"
        style={{ background: '#111114', border: `2px solid #FFC107`, maxWidth: 240 }}
      >
        <div style={{ color: '#FFC107', fontWeight: 700, marginBottom: 4 }}>⚠ THIS IS JUST THE INTUITION</div>
        <ModuleRef label="FULL K-MAP → DD-M03" color="amber" />
        <div style={{ color: '#7A7A8C', marginTop: 8, lineHeight: 1.5 }}>
          3-var, 4-var, don't cares, hazards — all in Module 3.
        </div>
      </div>

      <div className="flex flex-col items-center flex-1 pt-16 pb-10 px-6 gap-8">
        {/* K-Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4 }}
        >
          <KMapGrid2Var
            cells={cells}
            onChange={c => { onCellsChange(c); setGrouped(null); setSimplifiedTerm(null); setActivePreset(null); }}
            accentColor={PHASE_COLOR}
            highlightGroup={grouped ?? undefined}
          />
        </motion.div>

        {/* Group button */}
        {hasAdjacency && !grouped && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleGroup}
            className="px-5 py-2 rounded-full text-[12px] font-mono font-semibold"
            style={{ background: PHASE_COLOR, color: '#000' }}
          >
            GROUP ADJACENT 1s →
          </motion.button>
        )}

        {/* Grouping result */}
        <AnimatePresence>
          {grouped && simplifiedTerm && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl p-4 flex flex-col gap-2 text-[12px] font-mono max-w-sm w-full"
              style={{ background: '#111114', border: `1px solid ${PHASE_COLOR}44` }}
            >
              <div style={{ color: PHASE_COLOR }}>Grouped cells differ by ONE variable — it disappears:</div>
              <div style={{ color: '#A0FFA0', fontSize: 16 }}>→ Term = <strong>{simplifiedTerm}</strong></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Presets */}
        <div className="flex gap-3 flex-wrap justify-center">
          {(Object.keys(PRESETS) as PresetKey[]).map((key, i) => (
            <button
              key={key}
              onClick={() => loadPreset(key)}
              className="px-3 py-1.5 rounded text-[10px] font-mono transition-all"
              style={{
                border: `1px solid ${activePreset === key ? PHASE_COLOR : '#FFFFFF0F'}`,
                color: activePreset === key ? PHASE_COLOR : '#7A7A8C',
                background: activePreset === key ? `${PHASE_COLOR}12` : '#111114',
              }}
            >
              EXAMPLE {i + 1}: {PRESETS[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-4 text-center flex flex-col gap-1">
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>Adjacent cells that differ by ONE variable — that variable disappears.</p>
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>This is the intuition. The full technique for larger functions is in Module DD-M03 →</p>
      </div>
    </SceneWrapper>
  );
};

export default B2_KMapIntuition;
