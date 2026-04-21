import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';

const PHASE_COLOR = '#3B82F6';

interface B3Props { sceneIndex: number; currentScene: number; }

const KMAP_SIZES = [
  { n: 2, cells: 4, cols: 2, rows: 2, label: '2-var (4 cells)' },
  { n: 3, cells: 8, cols: 4, rows: 2, label: '3-var (8 cells)' },
  { n: 4, cells: 16, cols: 4, rows: 4, label: '4-var (16 cells)' },
  { n: 5, cells: 32, cols: 8, rows: 4, label: '5-var (32 cells)' },
  { n: 6, cells: 64, cols: 8, rows: 8, label: '6-var (64 cells)' },
];

const LIMIT_CARDS = [
  { title: 'NOT SCALABLE', border: PHASE_COLOR, icon: '📏', body: 'n>6 variables is humanly impossible to visualize.', extra: 'Human vs Computer for n=12: human ⚠, computer ✓' },
  { title: 'ERROR PRONE', border: '#FFC107', icon: '⚠', body: 'Grouping mistakes are common and hard to detect.', extra: 'Manual grouping fails on complex functions.' },
  { title: 'NO HAZARD DETECTION', border: '#FF3366', icon: '⚡', body: "K-maps don't automatically flag static glitches.", extra: 'Hazard-free design → Module DD-M03' },
  { title: 'INCOMPLETE OPTIMALITY', border: '#A855F7', icon: '≠', body: 'K-maps mislead for prime implicant chart cases.', extra: 'QM Algorithm → covered in DD-M03' },
];

const RANGES = [
  { label: '1–4', answer: 'K-map is perfect.' },
  { label: '5–6', answer: 'K-map works but is hard. QM algorithm is better.' },
  { label: '7–12', answer: 'Forget K-maps. Use Quine-McCluskey or Espresso.' },
  { label: '13+', answer: 'EDA tools only. No human technique is practical.' },
];

const B3_KMapLimits: React.FC<B3Props> = ({ sceneIndex, currentScene }) => {
  const isActive = currentScene === sceneIndex;
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [selectedRange, setSelectedRange] = useState<number | null>(null);

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="B" name="K-MAP LIMITS" color={PHASE_COLOR} />

      <div className="flex flex-col flex-1 pt-14 pb-6 px-6 gap-6 overflow-y-auto">
        {/* K-map size progression */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-end gap-3 overflow-x-auto pb-2"
        >
          {KMAP_SIZES.map((km, i) => (
            <motion.div
              key={km.n}
              initial={{ opacity: 0, y: 16 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.18 }}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              {/* Mini K-map grid */}
              <div
                className="relative rounded border overflow-hidden"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${km.cols}, ${Math.max(4, 28 - i * 4)}px)`,
                  gap: 1,
                  borderColor: i === 4 ? '#FF3366' : `${PHASE_COLOR}66`,
                  background: '#06060A',
                }}
              >
                {Array.from({ length: km.cells }, (_, ci) => (
                  <div
                    key={ci}
                    style={{
                      width: Math.max(4, 28 - i * 4),
                      height: Math.max(4, 28 - i * 4),
                      background: Math.random() > 0.5 ? `${PHASE_COLOR}33` : '#111114',
                    }}
                  />
                ))}
                {i === 4 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute inset-0 flex items-center justify-center text-[11px] font-mono font-bold"
                    style={{ background: 'rgba(255,51,102,0.7)', color: '#fff' }}
                  >
                    TOO COMPLEX
                  </motion.div>
                )}
              </div>
              <div className="text-[9px] font-mono text-center" style={{ color: i === 4 ? '#FF3366' : '#7A7A8C' }}>
                {km.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Limitations grid */}
        <div className="grid grid-cols-2 gap-3">
          {LIMIT_CARDS.map((card, ci) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={isActive ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + ci * 0.12 }}
              className="rounded-xl overflow-hidden cursor-pointer"
              style={{ border: `1px solid ${card.border}44`, background: '#111114' }}
              onClick={() => setExpandedCard(prev => prev === ci ? null : ci)}
            >
              <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderLeft: `4px solid ${card.border}` }}>
                <span style={{ fontSize: 16 }}>{card.icon}</span>
                <span className="text-[11px] font-mono font-bold" style={{ color: card.border }}>{card.title}</span>
              </div>
              <AnimatePresence>
                {expandedCard === ci && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3 pb-3 text-[11px] leading-relaxed"
                    style={{ color: '#E8E8F0', overflow: 'hidden' }}
                  >
                    <div className="pt-1">{card.body}</div>
                    <div className="mt-1" style={{ color: '#7A7A8C' }}>{card.extra}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* "Where does your problem fall?" */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.5 }}
          className="rounded-xl p-4 flex flex-col gap-3"
          style={{ background: '#111114', border: `1px solid ${PHASE_COLOR}33` }}
        >
          <div className="text-[11px] font-mono" style={{ color: PHASE_COLOR }}>HOW MANY VARIABLES IS YOUR FUNCTION?</div>
          <div className="flex gap-2 flex-wrap">
            {RANGES.map((r, ri) => (
              <button
                key={r.label}
                onClick={() => setSelectedRange(ri)}
                className="px-3 py-1.5 rounded text-[11px] font-mono transition-all"
                style={{
                  border: `1px solid ${selectedRange === ri ? PHASE_COLOR : '#FFFFFF0F'}`,
                  color: selectedRange === ri ? PHASE_COLOR : '#7A7A8C',
                  background: selectedRange === ri ? `${PHASE_COLOR}15` : '#1A1A1F',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
          <AnimatePresence>
            {selectedRange !== null && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[12px] font-mono"
                style={{ color: '#A0FFA0' }}
              >
                → {RANGES[selectedRange].answer}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="px-6 pb-4 text-center flex flex-col gap-1">
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>K-maps are powerful for 4–5 variables. Beyond that, algorithms take over.</p>
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>Knowing the limits of a tool is as important as knowing how to use it.</p>
      </div>
    </SceneWrapper>
  );
};

export default B3_KMapLimits;
