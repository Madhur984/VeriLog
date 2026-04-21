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
  accentColor = '#06B6D4',
  compact = false,
}) => {
  const playClick = useCallback((freq: number = 800) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1, audioCtx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // Audio context might be blocked
    }
  }, []);

  const cycleOutput = useCallback((index: number) => {
    if (locked) return;
    const next = [...rows];
    const cur = next[index].output;
    
    let nextVal: boolean | null = null;
    if (cur === null) nextVal = true;
    else if (cur === true) nextVal = false;
    else nextVal = null;
    
    playClick(nextVal === null ? 1200 : nextVal === true ? 800 : 600);
    next[index] = { ...next[index], output: nextVal };
    onRowsChange(next);
  }, [locked, rows, onRowsChange, playClick]);

  const randomize = useCallback(() => {
    if (locked) return;
    const next = rows.map(r => ({
      ...r,
      output: Math.random() > 0.5,
    }));
    onRowsChange(next);
    playClick(2000);
  }, [locked, rows, onRowsChange, playClick]);

  const ones = rows.filter(r => r.output === true).length;
  const zeros = rows.filter(r => r.output === false).length;
  const unspecified = rows.filter(r => r.output === null).length;

  const cellH = compact ? 36 : 48;

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Controls */}
      {!locked && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono tracking-[0.12em] text-[#7A7A8C] uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Truth Table Live Stream
          </span>
          <button
            onClick={randomize}
            className="text-[10px] font-mono text-[#7A7A8C] hover:text-cyan-400 transition-colors px-2 py-1 border border-white/5 rounded hover:border-cyan-400/20 bg-white/[0.02]"
          >
            ⟳ RANDOMIZE_NOISE
          </button>
        </div>
      )}

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden border-2 transition-colors duration-500"
        style={{ 
          borderColor: locked ? accentColor + '44' : '#FFFFFF1A',
          background: 'rgba(10,10,15,0.8)',
          boxShadow: locked ? `0 0 40px ${accentColor}11` : 'none'
        }}
        role="table"
        aria-label="Truth table"
      >
        {/* Header */}
        <div
          className="grid border-b border-white/10"
          style={{ gridTemplateColumns: `0.8fr repeat(${variables.length}, 1fr) 1.25fr` }}
          role="row"
        >
          <div className="px-2 py-4 text-center text-[10px] font-mono text-[#7A7A8C] bg-white/[0.03] uppercase tracking-widest border-r border-white/5" role="columnheader">
            idx
          </div>
          {variables.map((v, idx) => (
            <div 
              key={v} 
              className={`px-2 py-4 text-center text-xs font-mono text-[#7A7A8C] bg-white/[0.03] uppercase border-r border-white/5 ${idx === variables.length - 1 ? '' : ''}`} 
              role="columnheader"
            >
              {v}
            </div>
          ))}
          <div className="px-2 py-4 text-center text-xs font-mono font-black border-l-2 border-white/10" style={{ color: accentColor, background: `${accentColor}11` }} role="columnheader">
            F(out)
          </div>
        </div>

        {/* Rows */}
        <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
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
              ? `4px solid ${accentColor}`
              : highlightMinterms && isMinterm
                ? '4px solid #00FF88'
                : highlightMaxterms && isMaxterm
                  ? '4px solid #FF3366'
                  : '4px solid transparent';

            return (
              <motion.div
                key={row.index}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cellVariants}
                className={`grid border-b border-white/[0.04] transition-all duration-100 items-center ${isActive ? 'z-10' : 'z-0'}`}
                style={{
                  gridTemplateColumns: `0.8fr repeat(${variables.length}, 1fr) 1.25fr`,
                  background: rowBg,
                  borderLeft,
                  minHeight: cellH,
                }}
                role="row"
              >
                {/* Index */}
                <div className="flex items-center justify-center text-[10px] font-mono text-[#7A7A8C] border-r border-white/5 h-full" role="cell">
                  {row.index}
                </div>

                {/* Input bits */}
                {row.inputs.map((bit, bi) => (
                  <div
                    key={bi}
                    className="flex items-center justify-center text-sm font-mono font-semibold h-full border-r border-white/5"
                    style={{ color: bit ? '#FFF' : '#FFFFFF44' }}
                    role="cell"
                  >
                    {bit ? '1' : '0'}
                  </div>
                ))}

                {/* Output toggle */}
                <div className="flex items-center justify-center h-full bg-black/20" role="cell">
                  {locked ? (
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-base font-mono font-black italic"
                      style={{
                        color: row.output === true
                          ? '#00FF88'
                          : row.output === false
                            ? '#FF3366'
                            : '#7A7A8C',
                      }}
                    >
                      {row.output === true ? '1' : row.output === false ? '0' : '·'}
                    </motion.span>
                  ) : (
                    <button
                      onClick={() => cycleOutput(i)}
                      className="w-full h-full flex items-center justify-center text-base font-mono font-black italic transition-all duration-150 hover:bg-white/[0.05] focus:outline-none"
                      style={{
                        color: row.output === true
                          ? '#00FF88'
                          : row.output === false
                            ? '#FF3366'
                            : '#7A7A8C',
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
      </div>

      {/* Live counter */}
      <div className="flex items-center justify-between mt-2 px-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
            <span className="text-[10px] font-mono text-[#7A7A8C] uppercase">Ones: <span className="text-white">{ones}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF3366]" />
            <span className="text-[10px] font-mono text-[#7A7A8C] uppercase">Zeros: <span className="text-white">{zeros}</span></span>
          </div>
        </div>
        {unspecified > 0 && (
          <div className="text-[10px] font-mono text-amber-500 uppercase flex items-center gap-2 animate-pulse">
            <span className="w-1 h-1 rounded-full bg-amber-500" />
            {unspecified} Unspecified
          </div>
        )}
      </div>
    </div>
  );
};

export default TruthTableBuilder;

