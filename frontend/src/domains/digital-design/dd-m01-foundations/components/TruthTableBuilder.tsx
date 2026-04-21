import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import type { TruthTableRow } from '../ModuleD1.types';

interface TruthTableBuilderProps {
  variables: string[];
  rows: TruthTableRow[];
  locked?: boolean;
  onRowsChange: (rows: TruthTableRow[]) => void;
  highlightMinterms?: boolean;
  highlightMaxterms?: boolean;
  activeRowIndex?: number;
  accentColor?: string;
  compact?: boolean;
}

const cellVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.04, duration: 0.25 },
  }),
};

const TruthTableBuilder: React.FC<TruthTableBuilderProps> = ({
  variables,
  rows,
  locked = false,
  onRowsChange,
  highlightMinterms = false,
  highlightMaxterms = false,
  activeRowIndex,
  accentColor = '#A855F7',
  compact = false,
}) => {
  const cycleOutput = useCallback((index: number) => {
    if (locked) return;
    const next = [...rows];
    const cur = next[index].output;
    if (cur === null) next[index] = { ...next[index], output: true };
    else if (cur === true) next[index] = { ...next[index], output: false };
    else next[index] = { ...next[index], output: null };
    onRowsChange(next);
  }, [locked, rows, onRowsChange]);

  const randomize = useCallback(() => {
    if (locked) return;
    const next = rows.map(r => ({
      ...r,
      output: Math.random() > 0.5,
    }));
    onRowsChange(next);
  }, [locked, rows, onRowsChange]);

  const ones = rows.filter(r => r.output === true).length;
  const zeros = rows.filter(r => r.output === false).length;
  const unspecified = rows.filter(r => r.output === null).length;

  const cellH = compact ? 36 : 48;

  return (
    <div className="flex flex-col gap-2">
      {/* Controls */}
      {!locked && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono tracking-[0.12em] text-[#7A7A8C] uppercase">
            Truth Table
          </span>
          <button
            onClick={randomize}
            className="text-[10px] font-mono text-[#7A7A8C] hover:text-[#E8E8F0] transition-colors px-2 py-1 border border-white/5 rounded hover:border-white/20"
          >
            ⟳ RANDOMIZE
          </button>
        </div>
      )}

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden border"
        style={{ borderColor: locked ? accentColor + '66' : '#FFFFFF0F' }}
        role="table"
        aria-label="Truth table"
      >
        {/* Header */}
        <div
          className="grid border-b border-white/5"
          style={{ gridTemplateColumns: `repeat(${variables.length + 2}, 1fr)` }}
          role="row"
        >
          <div className="px-2 py-2 text-center text-[11px] font-mono text-[#7A7A8C] bg-[#1A1A1F]" role="columnheader">
            idx
          </div>
          {variables.map(v => (
            <div key={v} className="px-2 py-2 text-center text-[11px] font-mono text-[#7A7A8C] bg-[#1A1A1F]" role="columnheader">
              {v}
            </div>
          ))}
          <div className="px-2 py-2 text-center text-[11px] font-mono bg-[#1A1A1F]" style={{ color: accentColor }} role="columnheader">
            F
          </div>
        </div>

        {/* Rows */}
        {rows.map((row, i) => {
          const isMinterm = row.output === true;
          const isMaxterm = row.output === false;
          const isActive = activeRowIndex === i;

          const rowBg = isActive
            ? `rgba(${parseInt(accentColor.slice(1,3),16)},${parseInt(accentColor.slice(3,5),16)},${parseInt(accentColor.slice(5,7),16)},0.15)`
            : highlightMinterms && isMinterm
              ? 'rgba(0,255,136,0.06)'
              : highlightMaxterms && isMaxterm
                ? 'rgba(255,51,102,0.06)'
                : 'transparent';

          const borderLeft = isActive
            ? `3px solid ${accentColor}`
            : highlightMinterms && isMinterm
              ? '3px solid #00FF88'
              : highlightMaxterms && isMaxterm
                ? '3px solid #FF3366'
                : '3px solid transparent';

          return (
            <motion.div
              key={row.index}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cellVariants}
              className="grid border-b border-white/[0.04] transition-all duration-100"
              style={{
                gridTemplateColumns: `repeat(${variables.length + 2}, 1fr)`,
                background: rowBg,
                borderLeft,
                minHeight: cellH,
              }}
              role="row"
            >
              {/* Index */}
              <div className="flex items-center justify-center text-[11px] font-mono text-[#7A7A8C]" role="cell">
                {row.index}
              </div>

              {/* Input bits */}
              {row.inputs.map((bit, bi) => (
                <div
                  key={bi}
                  className="flex items-center justify-center text-[13px] font-mono font-semibold"
                  style={{ color: bit ? '#E8E8F0' : '#7A7A8C' }}
                  role="cell"
                >
                  {bit ? '1' : '0'}
                </div>
              ))}

              {/* Output toggle */}
              <div className="flex items-center justify-center" role="cell">
                {locked ? (
                  <span
                    className="text-[14px] font-mono font-semibold"
                    style={{
                      color: row.output === true
                        ? '#00FF88'
                        : row.output === false
                          ? '#FF3366'
                          : '#7A7A8C',
                    }}
                  >
                    {row.output === true ? '1' : row.output === false ? '0' : '·'}
                  </span>
                ) : (
                  <button
                    onClick={() => cycleOutput(i)}
                    className="w-8 h-8 rounded flex items-center justify-center text-[14px] font-mono font-semibold transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
                    style={{
                      color: row.output === true
                        ? '#00FF88'
                        : row.output === false
                          ? '#FF3366'
                          : '#7A7A8C',
                      background: row.output === true
                        ? 'rgba(0,255,136,0.1)'
                        : row.output === false
                          ? 'rgba(255,51,102,0.1)'
                          : 'transparent',
                    }}
                    aria-label={`Row ${row.index} output: ${row.output === true ? '1' : row.output === false ? '0' : 'unspecified'}. Click to cycle.`}
                  >
                    {row.output === true ? '1' : row.output === false ? '0' : '·'}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Live counter */}
      <div className="flex items-center gap-4 text-[11px] font-mono mt-1">
        <span style={{ color: '#00FF88' }}>■ ONES: {ones}</span>
        <span style={{ color: '#FF3366' }}>■ ZEROS: {zeros}</span>
        <span style={{ color: '#7A7A8C' }}>■ UNSPECIFIED: {unspecified}</span>
      </div>
    </div>
  );
};

export default TruthTableBuilder;
