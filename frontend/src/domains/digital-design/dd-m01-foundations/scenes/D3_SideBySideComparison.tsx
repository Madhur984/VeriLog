import React from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import type { TruthTableRow } from '../ModuleD1.types';
import { getMinterms, getMaxterms } from '../../../../shared/utils/booleanEngine';

const PHASE_COLOR = '#FFC107';
const VARS = ['A', 'B', 'C'];

interface D3Props { sceneIndex: number; currentScene: number; tableRows: TruthTableRow[]; focusPath: 'HIGH' | 'LOW' | 'BOTH'; onFocusPathChange: (p: 'HIGH' | 'LOW' | 'BOTH') => void; }

const D3_SideBySideComparison: React.FC<D3Props> = ({ sceneIndex, currentScene, tableRows, focusPath, onFocusPathChange }) => {
  const isActive = currentScene === sceneIndex;
  const minterms = getMinterms(tableRows, VARS);
  const maxterms = getMaxterms(tableRows, VARS);

  const sopGates = minterms.length + 1;
  const posGates = maxterms.length + 1;
  const winner = minterms.length < maxterms.length ? 'HIGH' : minterms.length > maxterms.length ? 'LOW' : 'BOTH';

  const HIGH_COLOR = '#FFC107';
  const LOW_COLOR = '#FF5F1F';

  const colOpacity = (path: 'HIGH' | 'LOW') => {
    if (focusPath === 'BOTH') return 1;
    return focusPath === path ? 1 : 0.3;
  };

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="D" name="SIDE-BY-SIDE" color={PHASE_COLOR} />

      <div className="flex flex-col flex-1 pt-14 pb-6 px-6 gap-5">
        {/* Focus toggle */}
        <div className="flex items-center gap-2 self-center">
          {(['HIGH', 'BOTH', 'LOW'] as const).map(p => (
            <button
              key={p}
              onClick={() => onFocusPathChange(p)}
              className="px-4 py-1 rounded-full text-[11px] font-mono transition-all"
              style={{
                background: focusPath === p ? (p === 'HIGH' ? HIGH_COLOR : p === 'LOW' ? LOW_COLOR : '#FFFFFF22') : 'transparent',
                border: `1px solid ${focusPath === p ? (p === 'HIGH' ? HIGH_COLOR : p === 'LOW' ? LOW_COLOR : '#FFFFFF44') : '#FFFFFF0F'}`,
                color: focusPath === p ? (p === 'BOTH' ? '#E8E8F0' : '#000') : '#7A7A8C',
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Comparison grid */}
        <div className="grid grid-cols-3 gap-4 flex-1">
          {/* HIGH PATH */}
          <motion.div
            animate={{ opacity: colOpacity('HIGH') }}
            className="flex flex-col gap-3"
          >
            <div className="text-[10px] font-mono text-center font-bold" style={{ color: HIGH_COLOR }}>HIGH PATH (SOP)</div>
            <div className="rounded-xl flex flex-col gap-2 p-4" style={{ background: '#111114', border: `2px solid ${winner === 'HIGH' ? HIGH_COLOR : HIGH_COLOR + '44'}` }}>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>Form:</span>
                <span className="text-[11px] font-mono" style={{ color: HIGH_COLOR }}>Canonical SOP</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>Circuit:</span>
                <span className="text-[11px] font-mono" style={{ color: HIGH_COLOR }}>NAND-NAND</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>Minterms:</span>
                <span className="text-[13px] font-mono font-bold" style={{ color: HIGH_COLOR }}>{minterms.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>Gates:</span>
                <span className="text-[13px] font-mono font-bold" style={{ color: HIGH_COLOR }}>{sopGates}</span>
              </div>
              {winner === 'HIGH' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center text-[10px] font-mono px-2 py-1 rounded mt-1" style={{ background: `${HIGH_COLOR}20`, border: `1px solid ${HIGH_COLOR}66`, color: HIGH_COLOR }}>
                  ✓ WINNER — LESS GATES
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* CENTER: equal sign */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="text-[10px] font-mono text-center" style={{ color: '#7A7A8C' }}>SAME FUNCTION</div>
            <motion.div style={{ fontSize: 32, color: '#7A7A8C', lineHeight: 1 }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>≡</motion.div>
            <div className="text-[10px] font-mono text-center" style={{ color: '#7A7A8C' }}>DIFFERENT COST</div>
            <div className="rounded px-3 py-2 text-[10px] font-mono text-center" style={{ background: '#111114', border: '1px solid #FFFFFF0F', color: winner === 'BOTH' ? '#00FF88' : PHASE_COLOR }}>
              {winner === 'BOTH' ? 'EQUAL COST' : winner === 'HIGH' ? `HIGH PATH saves ${posGates - sopGates} gate(s)` : `LOW PATH saves ${sopGates - posGates} gate(s)`}
            </div>
          </div>

          {/* LOW PATH */}
          <motion.div
            animate={{ opacity: colOpacity('LOW') }}
            className="flex flex-col gap-3"
          >
            <div className="text-[10px] font-mono text-center font-bold" style={{ color: '#FF5F1F' }}>LOW PATH (POS)</div>
            <div className="rounded-xl flex flex-col gap-2 p-4" style={{ background: '#111114', border: `2px solid ${winner === 'LOW' ? '#FF5F1F' : '#FF5F1F44'}` }}>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>Form:</span>
                <span className="text-[11px] font-mono" style={{ color: '#FF5F1F' }}>Canonical POS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>Circuit:</span>
                <span className="text-[11px] font-mono" style={{ color: '#FF5F1F' }}>NOR-NOR</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>Maxterms:</span>
                <span className="text-[13px] font-mono font-bold" style={{ color: '#FF5F1F' }}>{maxterms.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono" style={{ color: '#7A7A8C' }}>Gates:</span>
                <span className="text-[13px] font-mono font-bold" style={{ color: '#FF5F1F' }}>{posGates}</span>
              </div>
              {winner === 'LOW' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center text-[10px] font-mono px-2 py-1 rounded mt-1" style={{ background: 'rgba(255,95,31,0.2)', border: '1px solid rgba(255,95,31,0.5)', color: '#FF5F1F' }}>
                  ✓ WINNER — LESS GATES
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 pb-4 text-center flex flex-col gap-1">
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>Both paths implement the identical truth table. Choose based on gate count.</p>
        <p className="text-[12px]" style={{ color: '#7A7A8C' }}>Count your 1s vs 0s first — whichever is fewer determines the winning path.</p>
      </div>
    </SceneWrapper>
  );
};

export default D3_SideBySideComparison;
