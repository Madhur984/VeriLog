import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KMapGrid2VarProps {
  cells: boolean[];          // 4 cells indices: 0:A'B', 1:A'B, 2:AB', 3:AB (Standard index order)
  onChange: (cells: boolean[]) => void;
  accentColor?: string;
  readOnly?: boolean;
  highlightGroup?: number[]; // indices of cells in a group
  selection?: Set<number>;   // current manual selection
  onSelectionChange?: (sel: Set<number>) => void;
}

// Map visualization positions (0-3) to data indices (0-3)
// Visual grid:
//       A=0  A=1
// B=0   0    2
// B=1   1    3
const VISUAL_TO_DATA = [0, 2, 1, 3];
const DATA_TO_VISUAL = [0, 2, 1, 3]; // symmetric for 2x2
const CELL_LABELS = ['00', '10', '01', '11']; // AB values for each visual position

const KMapGrid2Var: React.FC<KMapGrid2VarProps> = ({
  cells,
  onChange,
  accentColor = '#3B82F6',
  readOnly = false,
  highlightGroup,
  selection,
  onSelectionChange,
}) => {
  const handleClick = useCallback((pos: number) => {
    if (readOnly) return;
    const dataIdx = VISUAL_TO_DATA[pos];

    if (onSelectionChange && selection) {
      // Selection Mode
      const next = new Set(selection);
      if (next.has(dataIdx)) next.delete(dataIdx);
      else next.add(dataIdx);
      onSelectionChange(next);
    } else {
      // Toggle Mode
      const next = [...cells];
      next[dataIdx] = !next[dataIdx];
      onChange(next);
    }
  }, [cells, onChange, readOnly, selection, onSelectionChange]);

  const groupedSet = new Set(highlightGroup ?? []);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Axis labels */}
      <div className="flex pl-8">
        <div className="w-[80px] text-center text-[10px] font-mono font-black italic uppercase tracking-widest text-white/20">A=0</div>
        <div className="w-[80px] text-center text-[10px] font-mono font-black italic uppercase tracking-widest text-white/20">A=1</div>
      </div>

      <div className="flex items-center gap-2">
        {/* Row labels */}
        <div className="flex flex-col gap-0 pr-2">
          <div className="h-[80px] flex items-center justify-center text-[10px] font-mono font-black italic uppercase tracking-widest text-white/20 -rotate-90">B=0</div>
          <div className="h-[80px] flex items-center justify-center text-[10px] font-mono font-black italic uppercase tracking-widest text-white/20 -rotate-90">B=1</div>
        </div>

        {/* 2×2 Grid */}
        <div className="relative grid grid-cols-2 gap-2 bg-white/[0.02] p-2 rounded-3xl border border-white/5">
          {[0, 1, 2, 3].map(pos => {
            const dataIdx = VISUAL_TO_DATA[pos];
            const val = cells[dataIdx];
            const inGroup = groupedSet.has(dataIdx);
            const isSelected = selection?.has(dataIdx);

            return (
              <motion.button
                key={pos}
                onClick={() => handleClick(pos)}
                whileHover={!readOnly ? { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' } : undefined}
                whileTap={!readOnly ? { scale: 0.98 } : undefined}
                className={`relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${isSelected ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'border-transparent'}`}
                style={{
                  background: val 
                    ? `rgba(${parseInt(accentColor.slice(1,3),16)},${parseInt(accentColor.slice(3,5),16)},${parseInt(accentColor.slice(5,7),16)},0.2)`
                    : 'rgba(255,255,255,0.02)',
                }}
              >
                {/* Active Group Highlight */}
                {inGroup && (
                  <motion.div
                    layoutId="group-box"
                    className="absolute inset-0 rounded-2xl border-2 border-white/40 bg-white/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}

                <span
                  className={`text-2xl font-mono font-black italic transition-colors ${val ? 'text-white' : 'text-white/10'}`}
                >
                  {val ? '1' : '0'}
                </span>

                <span className="absolute bottom-2 right-2 text-[8px] font-mono font-black text-white/10 tracking-widest">
                  {CELL_LABELS[pos]}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KMapGrid2Var;
