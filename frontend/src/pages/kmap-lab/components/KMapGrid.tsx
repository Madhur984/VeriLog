
import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { getGrayCode, getKMapDimensions, getMintermIndex } from '../lib/utils/kmapUtils';
import { simplify } from '../lib/solver/mintermSimplifier';

export const KMapGrid: React.FC = () => {
  const { numVars, cellValues, setCellValue, minterms, dontCares, solType } = useStore();
  const { rows, cols } = getKMapDimensions(numVars);
  
  const rowGray = getGrayCode(Math.log2(rows));
  const colGray = getGrayCode(Math.log2(cols));

  const handleCellClick = (r: number, c: number) => {
    const index = getMintermIndex(r, c, numVars);
    const current = cellValues[index] || 0;
    const next = current === 0 ? 1 : current === 1 ? 'X' : 0;
    setCellValue(index, next);
  };

  const { groups } = simplify(minterms, dontCares, numVars, solType);

  // Constants for sizing
  const CELL_SIZE = 70;
  const GAP = 8;
  const PADDING = 8;

  const gridWidth = cols * CELL_SIZE + (cols - 1) * GAP + 2 * PADDING;
  const gridHeight = rows * CELL_SIZE + (rows - 1) * GAP + 2 * PADDING;

  const groupElements = useMemo(() => {
    const colors = ['#f97316', '#a78bfa', '#22c55e', '#06b6d4', '#ec4899', '#f59e0b'];
    
    return groups.flatMap((group, idx) => {
      const color = colors[idx % colors.length];
      const items: {r: number, c: number}[] = [];
      const rowsUsed = new Set<number>();
      const colsUsed = new Set<number>();

      for(let r=0; r<rows; r++) {
        for(let c=0; c<cols; c++) {
          if(group.minterms.includes(getMintermIndex(r, c, numVars))) {
            items.push({r, c});
            rowsUsed.add(r);
            colsUsed.add(c);
          }
        }
      }

      const getSegments = (indices: number[], total: number) => {
        if (indices.length === 0) return [];
        const sorted = [...new Set(indices)].sort((a,b) => a-b);
        if (sorted.length === total) return [{start: 0, len: total}];
        
        const blocks: {start: number, len: number}[] = [];
        let start = sorted[0];
        for (let i = 1; i <= sorted.length; i++) {
          if (i === sorted.length || sorted[i] !== sorted[i-1] + 1) {
            blocks.push({start, len: sorted[i-1] - start + 1});
            if (i < sorted.length) start = sorted[i];
          }
        }
        return blocks;
      };

      const rowSegments = getSegments(Array.from(rowsUsed), rows);
      const colSegments = getSegments(Array.from(colsUsed), cols);

      // We need to be careful: K-map groups are always rectangular in Gray code space.
      // If we have multiple row segments AND multiple col segments, it might be 4 corner pieces.
      const rects: React.ReactNode[] = [];
      rowSegments.forEach((rs, rIdx) => {
        colSegments.forEach((cs, cIdx) => {
          // Check if this particular sub-rectangle is actually part of the group
          // (Necessary because some groups might only wrap in one dimension)
          const midR = rs.start;
          const midC = cs.start;
          if (group.minterms.includes(getMintermIndex(midR, midC, numVars))) {
            const x = cs.start * (CELL_SIZE + GAP) + PADDING - 2;
            const y = rs.start * (CELL_SIZE + GAP) + PADDING - 2;
            const width = cs.len * CELL_SIZE + (cs.len - 1) * GAP + 4;
            const height = rs.len * CELL_SIZE + (rs.len - 1) * GAP + 4;

            rects.push(
              <rect
                key={`${idx}-${rIdx}-${cIdx}`}
                x={x}
                y={y}
                width={width}
                height={height}
                fill="none"
                stroke={color}
                strokeWidth="3"
                rx="14"
                ry="14"
                className="transition-all duration-500"
                style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
              />
            );
          }
        });
      });

      return rects;
    });
  }, [groups, rows, cols, numVars]);

  return (
    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700 w-full overflow-x-auto">
      {/* Extra horizontal padding on mobile to give room for row labels */}
      <div className="relative mb-6 lg:mb-12 ml-10 lg:ml-0">
        {/* Labels: Columns */}
        <div className="absolute -top-8 left-0 right-0 flex justify-around px-8">
            {colGray.map(g => <span key={g} className="text-xs font-mono font-bold text-gray-500">{g}</span>)}
        </div>
        {/* Labels: Rows */}
        <div className="absolute top-0 bottom-0 -left-10 flex flex-col justify-around py-8">
            {rowGray.map(g => <span key={g} className="text-xs font-mono font-bold text-gray-500">{g}</span>)}
        </div>

        <div className="relative" style={{ width: gridWidth, height: gridHeight }}>
          <div className="grid gap-2 border border-white/5 p-2 bg-black/50 rounded-xl relative z-0"
               style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: rows * cols }).map((_, i) => {
              const r = Math.floor(i / cols);
              const c = i % cols;
              const index = getMintermIndex(r, c, numVars);
              const val = cellValues[index] || 0;
              return (
                <button
                  key={index}
                  onClick={() => handleCellClick(r, c)}
                  className={`
                    w-[70px] h-[70px] flex items-center justify-center text-2xl font-extrabold rounded-lg transition-all duration-200 relative group/cell
                    bg-[#111111] border-white/[0.08] border hover:bg-[#1a1a1a] hover:scale-[1.05]
                    ${val === 1 ? 'text-[#f97316]' : val === 'X' ? 'text-[#fbbf24]' : 'text-[#525252]'}
                  `}
                >
                  <span className="absolute top-1.5 right-1.5 text-[10px] font-mono opacity-20 group-hover/cell:opacity-60 transition-opacity text-gray-600">
                    {index}
                  </span>
                  {val === 'X' ? '×' : val}
                </button>
              );
            })}
          </div>

          <svg className="absolute inset-0 pointer-events-none z-10" width={gridWidth} height={gridHeight}>
            {groupElements}
          </svg>
        </div>
      </div>
    </div>
  );
};
