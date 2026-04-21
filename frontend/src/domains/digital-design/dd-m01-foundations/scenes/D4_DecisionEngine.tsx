import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';

const PHASE_COLOR = '#FFC107';

interface D4Props { sceneIndex: number; currentScene: number; slider: number; winner: 'SOP' | 'POS' | 'EQUAL'; onSliderChange: (v: number) => void; }

const D4_DecisionEngine: React.FC<D4Props> = ({ sceneIndex, currentScene, slider, winner, onSliderChange }) => {
  const isActive = currentScene === sceneIndex;
  const ones = slider;
  const zeros = 8 - slider;

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="D" name="DECISION ENGINE" color={PHASE_COLOR} />

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl mx-auto px-6 py-20 gap-16">
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={isActive ? { opacity: 1, y: 0 } : {}}
           className="text-center flex flex-col gap-4"
        >
          <h2 className="text-4xl font-mono font-black italic text-white uppercase tracking-tighter">
            Economic <span className="text-amber-500">Pivot</span>.
          </h2>
          <p className="text-sm font-mono font-black italic text-white/40 uppercase tracking-widest max-w-xl mx-auto">
            The decision is mechanical. As the distribution of 1s and 0s shifts, the cost differential between SOP and POS reveals the mathematically superior path.
          </p>
        </motion.div>

        {/* Focused Decision Tool */}
        <div className="flex flex-col gap-12 w-full max-w-4xl">
            {/* Slider */}
            <div className="relative py-10">
                <input
                    id="decision-range"
                    type="range"
                    min={0}
                    max={8}
                    value={slider}
                    onChange={e => onSliderChange(Number(e.target.value))}
                    className="w-full h-4 rounded-full cursor-pointer appearance-none bg-white/5 border border-white/10"
                    style={{ accentColor: PHASE_COLOR }}
                />
                <div className="flex justify-between mt-6 text-[10px] font-mono font-black italic text-white/20 uppercase tracking-[0.3em]">
                    <label htmlFor="decision-range" style={{ color: '#FF5F1F' }}>LOW_PATH_DOMAINS (POS)</label>
                    <span style={{ color: '#FFC107' }}>HIGH_PATH_DOMAINS (SOP)</span>
                </div>
            </div>

            {/* Path Counters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`p-10 rounded-[48px] bg-[#06060A] border-2 transition-all ${winner === 'SOP' ? 'border-amber-500 shadow-[0_0_50px_rgba(255,193,7,0.1)]' : 'border-white/5 opacity-40'}`}>
                    <div className="text-[10px] font-mono font-black italic text-amber-500 uppercase tracking-widest mb-4">MINTERMS (F=1)</div>
                    <div className="text-6xl font-mono font-black italic text-white">{ones}</div>
                    <div className="mt-4 text-[10px] font-mono font-black italic text-white/20 uppercase tracking-widest">SOP_REDUCTION_LOAD</div>
                </div>
                <div className={`p-10 rounded-[48px] bg-[#06060A] border-2 transition-all ${winner === 'POS' ? 'border-orange-500 shadow-[0_0_50px_rgba(255,95,31,0.1)]' : 'border-white/5 opacity-40'}`}>
                    <div className="text-[10px] font-mono font-black italic text-orange-500 uppercase tracking-widest mb-4">MAXTERMS (F=0)</div>
                    <div className="text-6xl font-mono font-black italic text-white">{zeros}</div>
                    <div className="mt-4 text-[10px] font-mono font-black italic text-white/20 uppercase tracking-widest">POS_REDUCTION_LOAD</div>
                </div>
            </div>
        </div>

        <AnimatePresence mode="wait">
            <motion.div 
                key={winner}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-mono font-black italic text-blue-500 uppercase tracking-[0.4em]"
            >
                {winner === 'EQUAL' ? 'COST_EQUITY_MAINTAINED' : `WINNING_PATH::${winner}_REALISATION`}
            </motion.div>
        </AnimatePresence>
      </div>
    </SceneWrapper>
  );
};

export default D4_DecisionEngine;
