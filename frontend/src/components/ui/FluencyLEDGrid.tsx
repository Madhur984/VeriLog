import React from 'react';
import { motion } from 'framer-motion';

interface FluencyLEDGridProps {
  fluency?: number; // 0–100
}

// LED color palette cycling through a vibrant spectrum
const LED_COLORS = [
  '#22d3ee', '#a78bfa', '#34d399', '#fbbf24',
  '#fb7185', '#c4b5fd', '#6ee7b7', '#f472b6',
  '#60a5fa', '#4ade80', '#facc15', '#38bdf8',
];

const ROWS = 6;
const COLS = 20;
const TOTAL = ROWS * COLS;

export const FluencyLEDGrid: React.FC<FluencyLEDGridProps> = ({ fluency = 62 }) => {
  const litCount = Math.round((fluency / 100) * TOTAL);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="relative flex flex-col items-center"
      style={{ marginBottom: 32 }}
    >
      {/* Panel bezel */}
      <div
        className="relative p-4 rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, #0f1829 0%, #080c15 100%)',
          border: '1px solid rgba(34,211,238,0.12)',
          boxShadow:
            '0 0 0 1px rgba(34,211,238,0.05), 0 12px 40px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.03)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-[8px] font-black tracking-[0.4em] uppercase" style={{ color: '#22d3ee60' }}>
            ◈ VERILOG FLUENCY
          </div>
          <div
            className="text-[11px] font-black font-mono tabular-nums"
            style={{ color: '#22d3ee', textShadow: '0 0 12px #22d3ee80' }}
          >
            {fluency}%
          </div>
        </div>

        {/* LED grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gap: 3,
          }}
        >
          {Array.from({ length: TOTAL }).map((_, i) => {
            const isLit = i < litCount;
            const color = LED_COLORS[i % LED_COLORS.length];
            return (
              <motion.div
                key={i}
                className="rounded-sm"
                style={{
                  width: 9,
                  height: 9,
                  background: isLit ? color : '#0d1526',
                  boxShadow: isLit ? `0 0 5px ${color}99, 0 0 2px ${color}` : 'none',
                  border: `1px solid ${isLit ? `${color}40` : 'rgba(255,255,255,0.04)'}`,
                }}
                animate={
                  isLit
                    ? { opacity: [0.7, 1, 0.85, 1, 0.7] }
                    : { opacity: 0.18 }
                }
                transition={
                  isLit
                    ? {
                        duration: 2.5 + (i % 5) * 0.3,
                        repeat: Infinity,
                        delay: (i % 13) * 0.08,
                      }
                    : {}
                }
              />
            );
          })}
        </div>

        {/* Bottom label bar */}
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="text-[7px] font-bold tracking-[0.3em] uppercase" style={{ color: '#334155' }}>
            0%
          </div>
          <div
            className="text-[7px] font-black tracking-[0.3em] uppercase"
            style={{ color: '#22d3ee50' }}
          >
            DIGITAL LOGIC MASTERY INDEX
          </div>
          <div className="text-[7px] font-bold tracking-[0.3em] uppercase" style={{ color: '#334155' }}>
            100%
          </div>
        </div>

        {/* Corner LED status indicators */}
        {(['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'] as const).map(
          (pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos} w-1.5 h-1.5 rounded-full`}
              style={{
                background: LED_COLORS[i * 3],
                boxShadow: `0 0 5px ${LED_COLORS[i * 3]}`,
              }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4 + i * 0.3, repeat: Infinity }}
            />
          )
        )}
      </div>

      {/* Receding perspective shadow */}
      <div
        style={{
          width: '90%',
          height: 6,
          background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.15) 0%, transparent 70%)',
          marginTop: -2,
          filter: 'blur(4px)',
        }}
      />
    </motion.div>
  );
};
