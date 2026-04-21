import React from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';

const PHASE_COLOR = '#3B82F6';

interface B1Props { sceneIndex: number; currentScene: number; }

const CANONICAL_COST = { gates: 11, power: 110, delay: 40, cost: 0.022 };
const MINIMAL_COST   = { gates: 3,  power: 30,  delay: 15, cost: 0.006 };

const B1_CostOfCanonical: React.FC<B1Props> = ({ sceneIndex, currentScene }) => {
  const isActive = currentScene === sceneIndex;
  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="B" name="MINIMISATION" color={PHASE_COLOR} />

      <div className="flex flex-col flex-1 items-center justify-center pt-16 pb-6 px-6 gap-8">
        {/* Opening banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 18, color: '#FF5F1F', fontWeight: 700 }}>
            10 MINTERMS
          </div>
          <div className="text-[13px] font-mono mt-1" style={{ color: '#7A7A8C' }}>
            = 10 AND gates + 1 OR gate = <span style={{ color: '#FF3366' }}>11 LOGIC GATES</span>
          </div>
        </motion.div>

        {/* BEFORE / AFTER split */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl items-center">
          {/* Canonical */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl p-5 flex flex-col gap-3"
            style={{ background: '#111114', border: '1px solid rgba(255,51,102,0.3)' }}
          >
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono font-bold" style={{ color: '#FF3366' }}>CANONICAL FORM</div>
              <div className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(255,51,102,0.15)', color: '#FF3366' }}>EXPENSIVE</div>
            </div>
            <div
              className="text-center text-3xl font-mono font-bold py-2"
              style={{ color: '#FF5F1F' }}
            >
              {CANONICAL_COST.gates}
            </div>
            <div className="text-[10px] font-mono text-center" style={{ color: '#7A7A8C' }}>GATES</div>
            <div className="flex flex-col gap-1 text-[10px] font-mono">
              <div style={{ color: '#FF3366' }}>🔴 POWER: ~{CANONICAL_COST.power}mW</div>
              <div style={{ color: '#FF3366' }}>🔴 DELAY: ~{CANONICAL_COST.delay}ns</div>
              <div style={{ color: '#FF3366' }}>🔴 COST: ~${CANONICAL_COST.cost.toFixed(3)}</div>
            </div>
          </motion.div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ color: PHASE_COLOR, fontSize: 28 }}
            >
              →
            </motion.div>
            <div className="text-[10px] font-mono" style={{ color: PHASE_COLOR }}>MINIMISE</div>
            <div className="text-[9px] font-mono text-center" style={{ color: '#7A7A8C' }}>Boolean algebra</div>
          </div>

          {/* Minimised */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-xl p-5 flex flex-col gap-3"
            style={{ background: '#111114', border: '1px solid rgba(34,197,94,0.3)' }}
          >
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono font-bold" style={{ color: '#22C55E' }}>MINIMISED FORM</div>
              <div className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}>EFFICIENT</div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={isActive ? { scale: 1 } : {}}
              transition={{ type: 'spring', delay: 0.6 }}
              className="text-center text-3xl font-mono font-bold py-2"
              style={{ color: '#22C55E' }}
            >
              {MINIMAL_COST.gates}
            </motion.div>
            <div className="text-[10px] font-mono text-center" style={{ color: '#7A7A8C' }}>GATES</div>
            <div className="flex flex-col gap-1 text-[10px] font-mono">
              <div style={{ color: '#22C55E' }}>🟢 POWER: ~{MINIMAL_COST.power}mW</div>
              <div style={{ color: '#22C55E' }}>🟢 DELAY: ~{MINIMAL_COST.delay}ns</div>
              <div style={{ color: '#22C55E' }}>🟢 COST: ~${MINIMAL_COST.cost.toFixed(3)}</div>
            </div>
          </motion.div>
        </div>

        {/* Savings bars */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex gap-6 items-center"
        >
          {[['73% FEWER GATES', 73], ['62% LESS POWER', 62], ['73% LOWER COST', 73]].map(([label, pct]) => (
            <div key={label as string} className="flex flex-col gap-1 items-center">
              <div className="text-[10px] font-mono" style={{ color: '#22C55E', letterSpacing: '0.08em' }}>{label}</div>
              <div className="w-20 h-1.5 rounded overflow-hidden" style={{ background: '#1A1A1F' }}>
                <motion.div
                  className="h-full rounded"
                  style={{ background: '#22C55E' }}
                  initial={{ width: 0 }}
                  animate={isActive ? { width: `${pct}%` } : { width: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Industry card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="rounded-xl px-5 py-4 text-[12px] leading-relaxed max-w-xl text-center"
          style={{ background: '#111114', border: '1px solid #FF5F1F44', color: '#E8E8F0' }}
        >
          In a chip with 10 billion transistors, a 73% gate reduction means billions fewer transistors — or room for other features.
        </motion.div>
      </div>

      <div className="px-6 pb-4 text-center flex flex-col gap-1">
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>Canonical forms are mathematically complete but physically wasteful.</p>
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>Every extra gate costs power, area, time, and money. Minimise before you build.</p>
      </div>
    </SceneWrapper>
  );
};

export default B1_CostOfCanonical;
