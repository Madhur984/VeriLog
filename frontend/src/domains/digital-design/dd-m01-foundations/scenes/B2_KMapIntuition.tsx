import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import KMapGrid2Var from '../components/KMapGrid2Var';

const PHASE_COLOR = '#3B82F6';

interface B2Props { sceneIndex: number; currentScene: number; cells: boolean[]; onCellsChange: (c: boolean[]) => void; }

type PresetKey = 'ex1' | 'ex2' | 'ex3';
const PRESETS: Record<PresetKey, { cells: boolean[]; label: string; result: string; groupPositions: number[] }> = {
  ex1: { cells: [false, true, false, true], label: 'AB + AB\'', result: 'A', groupPositions: [1, 3] },
  ex2: { cells: [false, false, true, true], label: "A'B + AB", result: 'B', groupPositions: [2, 3] },
  ex3: { cells: [true, false, true, false], label: "A'B' + AB'", result: "B'", groupPositions: [0, 2] },
};

const B2_KMapIntuition: React.FC<B2Props> = ({ sceneIndex, currentScene, cells, onCellsChange }) => {
  const isActive = currentScene === sceneIndex;
  const [selection, setSelection] = useState<Set<number>>(new Set());
  const [manualGroups, setManualGroups] = useState<number[][]>([]);
  const [activePreset, setActivePreset] = useState<PresetKey | null>(null);

  const loadPreset = (key: PresetKey) => {
    const p = PRESETS[key];
    onCellsChange(p.cells);
    setManualGroups([p.groupPositions]);
    setActivePreset(key);
    setSelection(new Set());
  };

  const isAdjacent = (group: number[]) => {
    if (group.length === 1) return true;
    if (group.length === 2) {
      const [a, b] = group;
      // Adjacencies in 2x2: 0-1, 2-3, 0-2, 1-3
      const adj = [[0,1],[1,0],[2,3],[3,2],[0,2],[2,0],[1,3],[3,1]];
      return adj.some(([m, n]) => m === a && n === b);
    }
    if (group.length === 4) return true;
    return false;
  };

  const handleGroup = () => {
    const selectedIndices = Array.from(selection);
    if (selectedIndices.length === 0) return;
    
    // Check if all selected cells are '1'
    const allOnes = selectedIndices.every(idx => cells[idx]);
    if (!allOnes) return;

    if (isAdjacent(selectedIndices)) {
      setManualGroups([...manualGroups, selectedIndices]);
      setSelection(new Set());
    }
  };

  const clearGroups = () => {
    setManualGroups([]);
    setSelection(new Set());
    setActivePreset(null);
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center">
            {/* Controls */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                className="lg:col-span-4 flex flex-col gap-6"
            >
                <div className="flex flex-col gap-2">
                    <div className="text-[10px] font-mono font-black italic text-blue-500/60 uppercase tracking-widest mb-2">Preset_Scenarios</div>
                    {(Object.keys(PRESETS) as PresetKey[]).map((key, i) => (
                        <button
                            key={key}
                            onClick={() => loadPreset(key)}
                            className={`p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${activePreset === key ? 'bg-blue-500 border-blue-500 text-black' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'}`}
                        >
                            <span className="text-[10px] font-mono font-black italic uppercase tracking-widest">MAP_0{i+1}</span>
                            <span className="text-xs font-mono font-black italic uppercase">{PRESETS[key].label}</span>
                        </button>
                    ))}
                </div>

                <div className="p-6 rounded-[32px] bg-white/[0.03] border border-white/10 flex flex-col gap-4">
                    <div className="text-[10px] font-mono font-black italic text-white/20 uppercase tracking-widest leading-none">Manual_Grouping_Tool</div>
                    
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleGroup}
                            disabled={selection.size === 0}
                            className={`w-full py-4 rounded-xl text-xs font-black italic tracking-[0.2em] transition-all ${selection.size > 0 ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-white/5 text-white/10'}`}
                        >
                            {selection.size > 0 ? `GROUP_${selection.size}_CELLS` : 'SELECT_CELLS'}
                        </button>
                        <button
                            onClick={clearGroups}
                            className="w-full py-3 rounded-xl text-[10px] font-mono font-black italic text-white/20 hover:text-rose-500 transition-colors uppercase tracking-widest"
                        >
                            Reset_Topology
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* K-MAP */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                className="lg:col-span-8 space-y-6"
            >
                <div className="bg-black/40 backdrop-blur-md rounded-[56px] border-2 border-blue-500/10 p-20 shadow-2xl relative flex items-center justify-center min-h-[500px]">
                    <div className="absolute top-10 left-12 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-mono font-black italic text-blue-500/60 uppercase tracking-widest">Spatial_Processor // ACTIVE</span>
                    </div>

                    <div className="scale-[1.8] md:scale-[2.2]">
                        <KMapGrid2Var
                            cells={cells}
                            onChange={onCellsChange}
                            accentColor={PHASE_COLOR}
                            highlightGroup={manualGroups.flat()}
                            selection={selection}
                            onSelectionChange={setSelection}
                        />
                    </div>

                    {/* Validation HUD */}
                    <div className="absolute bottom-10 right-12 text-right">
                        <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-1 italic">Extracted_Groups</div>
                        <div className="flex flex-col gap-1">
                            <AnimatePresence>
                                {manualGroups.map((g, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="text-xs font-mono font-black italic text-cyan-400 uppercase"
                                    >
                                        Group_{idx+1}: {g.length} cells
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Industrial Insight & Video Resource */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 flex flex-col gap-4">
                        <div className="text-[10px] font-mono font-black italic text-blue-500 uppercase tracking-widest">Why K-Maps?</div>
                        <p className="text-[11px] font-mono font-medium text-white/60 leading-relaxed italic">
                            Algebra relies on "cut-and-try" procedures—there are no strict rules to guarantee an optimal result. K-Maps leverage <span className="text-white">Visual Pattern Recognition</span>, transforming complex algebra into an intuitive puzzle.
                        </p>
                    </div>

                    <a 
                        href="https://www.youtube.com/watch?v=p8S-y2M2g60"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-8 rounded-[32px] bg-blue-500/10 border border-blue-500/30 flex items-center gap-6 hover:bg-blue-500/20 transition-all cursor-pointer"
                    >
                        <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-black group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-black italic text-blue-400 uppercase tracking-widest mb-1">Video_Lecture</span>
                            <span className="text-xs font-bold text-white uppercase italic tracking-tighter group-hover:text-cyan-400">Mastering 4-Var K-Maps // Neso Academy</span>
                        </div>
                    </a>
                </div>
            </motion.div>

        </div>
      </div>
    </SceneWrapper>
  );
};

export default B2_KMapIntuition;
