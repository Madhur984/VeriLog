import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KMapGrid2VarProps {
  cells: boolean[];          // 4 cells: AB=00,10,01,11 (Gray code order)
  onChange: (cells: boolean[]) => void;
  accentColor?: string;
  readOnly?: boolean;
  highlightGroup?: number[]; // indices of cells in a group
}

// Gray-coded cell positions: AB=00(0), AB=10(2), AB=01(1), AB=11(3)
const CELL_ORDER = [0, 2, 1, 3]; // index in the flat cells[] array for each K-map position
const CELL_LABELS = ['00', '10', '01', '11']; // AB values for each position

const KMapGrid2Var: React.FC<KMapGrid2VarProps> = ({
  cells,
  onChange,
  accentColor = '#3B82F6',
  readOnly = false,
  highlightGroup,
}) => {
  const toggle = useCallback((pos: number) => {
    if (readOnly) return;
    const dataIdx = CELL_ORDER[pos];
    const next = [...cells];
    // Cycle: false → true → false (always boolean, no unspecified)
    next[dataIdx] = !next[dataIdx];
    onChange(next);
  }, [cells, onChange, readOnly]);

  const groupedSet = new Set(highlightGroup ?? []);

  // Adjacent groups detection (all 4 positions in linear indices: 0,1,2,3)
  const onesPositions = CELL_ORDER.map((ci, pos) => cells[ci] ? pos : -1).filter(p => p >= 0);

  // Check if two positions are adjacent in 2-var K-map
  // Position map: 0(top-left), 1(top-right), 2(bottom-left), 3(bottom-right)
  // Adjacencies: 0↔1, 2↔3, 0↔2, 1↔3, 0↔3 (wrap), 1↔2 (wrap)
  const ADJACENT: [number, number][] = [[0,1],[2,3],[0,2],[1,3]];

  const hasAdjacency = ADJACENT.some(([a, b]) =>
    onesPositions.includes(a) && onesPositions.includes(b)
  );

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Axis labels */}
      <div className="flex">
        <div className="w-10" />
        <div className="flex" style={{ gap: 0 }}>
          <div className="w-[70px] text-center text-[10px] font-mono" style={{ color: accentColor }}>A=0</div>
          <div className="w-[70px] text-center text-[10px] font-mono" style={{ color: accentColor }}>A=1</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Row labels */}
        <div className="flex flex-col" style={{ gap: 0 }}>
          <div className="flex items-center justify-center text-[10px] font-mono" style={{ height: 70, width: 32, color: accentColor }}>B=0</div>
          <div className="flex items-center justify-center text-[10px] font-mono" style={{ height: 70, width: 32, color: accentColor }}>B=1</div>
        </div>

        {/* 2×2 Grid */}
        <div
          className="relative grid grid-cols-2"
          style={{
            border: `2px solid ${accentColor}`,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {[0, 1, 2, 3].map(pos => {
            const dataIdx = CELL_ORDER[pos];
            const val = cells[dataIdx];
            const inGroup = groupedSet.has(dataIdx);

            return (
              <motion.button
                key={pos}
                onClick={() => toggle(pos)}
                whileHover={!readOnly ? { scale: 1.04 } : undefined}
                whileTap={!readOnly ? { scale: 0.97 } : undefined}
                className="relative flex items-center justify-center focus:outline-none focus:ring-2"
                style={{
                  width: 70,
                  height: 70,
                  background: val
                    ? `rgba(${parseInt(accentColor.slice(1,3),16)},${parseInt(accentColor.slice(3,5),16)},${parseInt(accentColor.slice(5,7),16)},0.22)`
                    : '#111114',
                  border: `1px solid #FFFFFF0F`,
                  cursor: readOnly ? 'default' : 'pointer',
                  focusRingColor: accentColor,
                }}
                aria-label={`K-map cell AB=${CELL_LABELS[pos]}: ${val ? '1' : '0'}. ${!readOnly ? 'Click to toggle.' : ''}`}
                aria-pressed={val}
              >
                {/* Group highlight */}
                {inGroup && (
                  <motion.div
                    className="absolute inset-1 rounded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      border: `2px dashed #00D4FF`,
                      background: 'rgba(0,212,255,0.08)',
                    }}
                  />
                )}

                <span
                  className="text-xl font-mono font-bold relative z-10"
                  style={{ color: val ? accentColor : '#3A3A4A' }}
                >
                  {val ? '1' : '0'}
                </span>

                {/* Position label */}
                <span
                  className="absolute bottom-1 right-1 text-[8px] font-mono"
                  style={{ color: '#7A7A8C' }}
                >
                  {CELL_LABELS[pos]}
                </span>
              </motion.button>
            );
          })}

          {/* Group overlay */}
          <AnimatePresence>
            {highlightGroup && highlightGroup.length >= 2 && (
              <motion.div
                key="group-overlay"
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <svg width="100%" height="100%" className="absolute inset-0">
                  <rect
                    x="4" y="4"
                    width={highlightGroup.length === 4 ? '132' : '66'}
                    height={highlightGroup.length === 4 ? '132' : '66'}
                    rx="10" ry="10"
                    stroke="#00D4FF"
                    strokeWidth="2.5"
                    strokeDasharray="6,4"
                    fill="rgba(0,212,255,0.08)"
                    className="animate-pulse"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hint: show GROUP button when adjacency is detected */}
      {hasAdjacency && !readOnly && !highlightGroup && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-mono px-3 py-1 rounded-full border"
          style={{ borderColor: '#00D4FF66', color: '#00D4FF' }}
        >
          ↑ Adjacent 1s detected — adjacent cells can be grouped
        </motion.div>
      )}
    </div>
  );
};

export default KMapGrid2Var;
