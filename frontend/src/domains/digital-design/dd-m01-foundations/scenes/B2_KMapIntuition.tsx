import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import KMapGrid2Var from '../components/KMapGrid2Var';

const PHASE_COLOR = '#3B82F6';

interface B2Props { sceneIndex: number; currentScene: number; cells: boolean[]; onCellsChange: (c: boolean[]) => void; }

type PresetKey = 'ex1' | 'ex2' | 'ex3';
const PRESETS: Record<PresetKey, { cells: boolean[]; label: string; result: string; groupPositions: number[] }> = {
  ex1: { cells: [false, true, false, true], label: 'AB + AB\'', result: 'A', groupPositions: [1, 3] }, // Indices check
  ex2: { cells: [false, false, true, true], label: 'A\'B + AB', result: 'B', groupPositions: [2, 3] },
  ex3: { cells: [true, false, true, false], label: 'A\'B\' + AB\'', result: 'B\'', groupPositions: [0, 2] },
};

const B2_KMapIntuition: React.FC<B2Props> = ({ sceneIndex, currentScene, cells, onCellsChange }) => {
  const isActive = currentScene === sceneIndex;
  const [grouped, setGrouped] = useState<number[] | null>(null);
  const [simplifiedTerm, setSimplifiedTerm] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<PresetKey | null>(null);

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

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl mx-auto px-6 py-20 gap-16">
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={isActive ? { opacity: 1, y: 0 } : {}}
           className="text-center flex flex-col gap-4"
        >
          <h2 className="text-4xl font-mono font-black italic text-white uppercase tracking-tighter">
            Geometric <span className="text-blue-500">Adjacency</span>.
          </h2>
          <p className="text-sm font-mono font-black italic text-white/40 uppercase tracking-widest max-w-xl mx-auto">
            Instead of algebra, we use patterns. Adjacent cells in a K-Map differ by only one variable—allowing the eye to find the redundancy instantly.
          </p>
        </motion.div>

        {/* Focused Laboratory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
            {/* Controls */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                className="flex flex-col gap-8"
            >
                <div className="flex flex-col gap-3">
                    {(Object.keys(PRESETS) as PresetKey[]).map((key, i) => (
                        <button
                            key={key}
                            onClick={() => loadPreset(key)}
                            className={`p-6 rounded-2xl border-2 transition-all flex justify-between items-center ${activePreset === key ? 'bg-blue-500 border-blue-500 text-black' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'}`}
                        >
                            <span className="text-[10px] font-mono font-black italic uppercase tracking-widest">EXAMPLE_0{i+1}</span>
                            <span className="text-sm font-mono font-black italic uppercase">{PRESETS[key].label}</span>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {simplifiedTerm && (
                        <motion.div
                            key={simplifiedTerm}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 rounded-[32px] bg-blue-500/10 border-2 border-blue-500/20 text-center relative overflow-hidden"
                        >
                            <div className="text-[10px] font-mono font-black italic text-blue-500/60 uppercase tracking-widest mb-2">REDUCED_RESULT</div>
                            <div className="text-5xl font-mono font-black italic text-white tracking-widest">{simplifiedTerm}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* K-MAP */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                className="bg-[#06060A] rounded-[48px] border-2 border-blue-500/20 p-16 shadow-2xl relative flex items-center justify-center min-h-[400px]"
            >
                <div className="absolute top-8 left-10 text-[10px] font-mono font-black italic text-blue-500/40 uppercase tracking-widest">VISUAL_EXTRACTION</div>
                <div className="scale-150">
                    <KMapGrid2Var
                        cells={cells}
                        onChange={onCellsChange}
                        accentColor={PHASE_COLOR}
                        highlightGroup={grouped ?? undefined}
                    />
                </div>
            </motion.div>
        </div>
      </div>
    </SceneWrapper>
  );
};

export default B2_KMapIntuition;
