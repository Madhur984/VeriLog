import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';

const PHASE_COLOR = '#FFC107';

interface D4Props { sceneIndex: number; currentScene: number; slider: number; winner: 'SOP' | 'POS' | 'EQUAL'; onSliderChange: (v: number) => void; }

const D4_DecisionEngine: React.FC<D4Props> = ({ sceneIndex, currentScene, slider, winner, onSliderChange }) => {
  const isActive = currentScene === sceneIndex;
  const zeros = 8 - slider;
  const ones = slider;

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="D" name="DECISION ENGINE" color={PHASE_COLOR} />

      <div className="flex flex-col flex-1 items-center justify-center pt-14 pb-6 px-6 gap-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          className="text-center"
        >
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 20, color: PHASE_COLOR, fontWeight: 800 }}>
            COUNT 1s vs 0s. CHOOSE YOUR PATH.
          </div>
        </motion.div>

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <div className="flex justify-between text-[11px] font-mono">
            <span style={{ color: '#FF5F1F' }}>← More 0s (POS wins)</span>
            <span style={{ color: '#FFC107' }}>More 1s (SOP wins) →</span>
          </div>
          <input
            type="range"
            min={0}
            max={8}
            value={slider}
            onChange={e => onSliderChange(Number(e.target.value))}
            className="w-full h-2 rounded cursor-pointer"
            style={{ accentColor: PHASE_COLOR }}
            aria-label="Adjust number of ones in truth table (0-8)"
          />
          <div className="flex justify-between text-[10px] font-mono">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} style={{ color: slider === i ? PHASE_COLOR : '#7A7A8C' }}>{i}</span>
            ))}
          </div>

          {/* Counters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4 text-center" style={{ background: '#111114', border: '1px solid #00FF8844' }}>
              <div className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>F=1 ROWS</div>
              <motion.div key={ones} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-3xl font-mono font-bold" style={{ color: '#00FF88' }}>
                {ones}
              </motion.div>
              <div className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>minterms → SOP</div>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: '#111114', border: '1px solid rgba(255,51,102,0.25)' }}>
              <div className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>F=0 ROWS</div>
              <motion.div key={zeros} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-3xl font-mono font-bold" style={{ color: '#FF3366' }}>
                {zeros}
              </motion.div>
              <div className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>maxterms → POS</div>
            </div>
          </div>
        </motion.div>

        {/* Decision display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={winner}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl px-8 py-6 text-center"
            style={{
              background: '#111114',
              border: `2px solid ${winner === 'EQUAL' ? '#FFFFFF22' : winner === 'SOP' ? '#FFC10744' : 'rgba(255,95,31,0.4)'}`,
            }}
          >
            <div className="text-[11px] font-mono mb-2" style={{ color: '#7A7A8C' }}>RECOMMENDED PATH</div>
            <div
              className="text-xl font-mono font-bold"
              style={{
                color: winner === 'EQUAL' ? '#00FF88' : winner === 'SOP' ? '#FFC107' : '#FF5F1F',
              }}
            >
              {winner === 'EQUAL' && '⚖ EQUAL — Either path works'}
              {winner === 'SOP' && `▲ HIGH PATH — SOP / NAND-NAND (${ones} gates)`}
              {winner === 'POS' && `▼ LOW PATH — POS / NOR-NOR (${zeros} gates)`}
            </div>
            <div className="text-[11px] font-mono mt-2" style={{ color: '#7A7A8C' }}>
              {winner === 'EQUAL' && 'Same gate count from both directions.'}
              {winner === 'SOP' && `${zeros - ones} fewer gates than POS path`}
              {winner === 'POS' && `${ones - zeros} fewer gates than SOP path`}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Decision rule */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="rounded-xl px-5 py-4 text-[11px] font-mono leading-relaxed text-center max-w-lg"
          style={{ background: '#111114', border: '1px solid #FFFFFF0F', color: '#E8E8F0' }}
        >
          <span style={{ color: PHASE_COLOR }}>RULE: </span>
          Fewer 1s? → SOP wins. Fewer 0s? → POS wins. Equal? → Both identical.
        </motion.div>
      </div>

      <div className="px-6 pb-4 text-center flex flex-col gap-1">
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>Slide to simulate your truth table's distribution.</p>
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>Real engineers count before committing to a design direction.</p>
      </div>
    </SceneWrapper>
  );
};

export default D4_DecisionEngine;
