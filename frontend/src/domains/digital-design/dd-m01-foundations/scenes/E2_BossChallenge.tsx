import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';
import TruthTableBuilder from '../components/TruthTableBuilder';
import CircuitCanvas from '../components/CircuitCanvas';
import type { TruthTableRow, CircuitForm } from '../ModuleD1.types';
import { buildTruthTableRows, getMinterms, getMaxterms, mintermToProductTerm, sigmaMNotation, recommendPath } from '../../../../shared/utils/booleanEngine';

const PHASE_COLOR = '#FF5F1F';
const BOSS_VARS = ['A', 'B', 'C'];

// Boss specification: 3-bit majority voter (F=1 when 2+ inputs are 1)
const MAJORITY_ROWS_ANSWER = new Set([3, 5, 6, 7]); // correct F=1 rows for majority

type BossStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface E2Props {
  sceneIndex: number;
  currentScene: number;
  bossStep: BossStep;
  onBossStepChange: (s: BossStep) => void;
}

const STEPS = [
  { label: 'READ SPECIFICATION', icon: '01' },
  { label: 'BUILD TRUTH TABLE', icon: '⊟' },
  { label: 'EXTRACT MINTERMS', icon: '∑' },
  { label: 'EXTRACT MAXTERMS', icon: 'Π' },
  { label: 'CHOOSE PATH', icon: '⚖' },
  { label: 'FINAL CIRCUIT', icon: '⊃' },
];

const E2_BossChallenge: React.FC<E2Props> = ({ sceneIndex, currentScene, bossStep, onBossStepChange }) => {
  const isActive = currentScene === sceneIndex;
  const [rows, setRows] = useState<TruthTableRow[]>(buildTruthTableRows(3));
  const [locked, setLocked] = useState(false);
  const [tableCorrect, setTableCorrect] = useState<boolean | null>(null);
  const [circuitMode, setCircuitMode] = useState<CircuitForm>('AND-OR');

  const minterms = getMinterms(rows, BOSS_VARS);
  const maxterms = getMaxterms(rows, BOSS_VARS);
  const path = recommendPath(minterms, maxterms);

  const checkTable = useCallback(() => {
    const userOnes = new Set(rows.filter(r => r.output === true).map(r => r.index));
    const correct = MAJORITY_ROWS_ANSWER.size === userOnes.size && [...MAJORITY_ROWS_ANSWER].every(i => userOnes.has(i));
    setTableCorrect(correct);
    if (correct) {
      setLocked(true);
      onBossStepChange(2 as BossStep);
    }
  }, [rows, onBossStepChange]);

  const advance = () => {
    if (bossStep < 6) onBossStepChange((bossStep + 1) as BossStep);
  };

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor={PHASE_COLOR}>
      <PhaseLabel phase="E" name="BOSS CHALLENGE — MAJORITY VOTER" color={PHASE_COLOR} />

      {/* Step tracker */}
      <div className="fixed bottom-4 left-0 right-0 z-50 flex items-center justify-center gap-1 pointer-events-none">
        {STEPS.map((s, si) => (
          <div
            key={si}
            className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono"
            style={{
              background: bossStep === si ? PHASE_COLOR : bossStep > si ? '#111114' : 'transparent',
              border: `1px solid ${bossStep >= si ? PHASE_COLOR : '#FFFFFF0F'}`,
              color: bossStep === si ? '#000' : bossStep > si ? '#00FF88' : '#7A7A8C',
              fontWeight: bossStep === si ? 700 : 400,
            }}
          >
            {bossStep > si ? '✓' : s.icon}
          </div>
        ))}
      </div>

      <div className="flex flex-col flex-1 pt-14 pb-16 px-6 gap-5 overflow-y-auto">
        {/* Step 0: Specification */}
        {bossStep === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: '#111114', border: `2px solid ${PHASE_COLOR}`, boxShadow: `0 0 20px ${PHASE_COLOR}11` }}
          >
            <div className="text-[11px] font-mono font-bold" style={{ color: PHASE_COLOR }}>
              STEP 1 — SPECIFICATION (3-BIT MAJORITY VOTER)
            </div>
            <div className="text-[16px] leading-relaxed" style={{ color: '#E8E8F0', fontFamily: 'Inter, system-ui' }}>
              Design a circuit with 3 inputs (A, B, C) where the output F=1 if and only if 2 or more inputs are 1.
            </div>
            <div className="flex flex-col gap-1 text-[11px] font-mono" style={{ color: '#7A7A8C' }}>
              <div>Examples: ABC=011 → F=1 (two 1s). ABC=001 → F=0 (only one 1).</div>
            </div>
            <button onClick={advance} className="self-start px-4 py-2 rounded text-[12px] font-bold font-mono mt-2" style={{ background: PHASE_COLOR, color: '#000' }}>
              BUILD TRUTH TABLE →
            </button>
          </motion.div>
        )}

        {/* Step 1: Truth table */}
        {bossStep === 1 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
            <div className="text-[11px] font-mono font-bold" style={{ color: PHASE_COLOR }}>STEP 2 — FILL TRUTH TABLE</div>
            <TruthTableBuilder
              variables={BOSS_VARS}
              rows={rows}
              locked={locked}
              onRowsChange={setRows}
              accentColor={PHASE_COLOR}
              compact
            />

            {tableCorrect === false && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] font-mono px-3 py-2 rounded text-center" style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.3)', color: '#FF3366' }}>
                ✗ Incorrect — F=1 only when 2 or 3 inputs are high.
              </motion.div>
            )}

            {!locked && rows.every(r => r.output !== null) && (
              <button onClick={checkTable} className="self-center px-6 py-2 rounded-lg text-[13px] font-bold font-mono shadow-xl" style={{ background: PHASE_COLOR, color: '#000' }}>
                VERIFY LOGIC →
              </button>
            )}
          </motion.div>
        )}

        {/* Step 2: Minterms */}
        {bossStep === 2 && locked && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-4">
            <div className="text-[11px] font-mono font-bold" style={{ color: PHASE_COLOR }}>STEP 3 — MINTERMS (Σm)</div>
            <div className="flex flex-wrap gap-2">
              {minterms.map(m => (
                <span key={m.index} className="px-3 py-1.5 rounded text-[11px] font-mono" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', color: '#00D4FF' }}>
                  {mintermToProductTerm(m)} [m{m.index}]
                </span>
              ))}
            </div>
            <div className="text-[13px] font-mono p-4 rounded-xl" style={{ background: '#000', border: '1px solid #1A1A1F', color: '#A0FFA0' }}>
              Canonical SOP: {sigmaMNotation(minterms)}
            </div>
            <button onClick={advance} className="self-start px-4 py-2 rounded text-[12px] font-bold font-mono mt-2" style={{ background: PHASE_COLOR, color: '#000' }}>NEXT: MAXTERMS →</button>
          </motion.div>
        )}

        {/* Step 3: Maxterms */}
        {bossStep === 3 && locked && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-4">
            <div className="text-[11px] font-mono font-bold" style={{ color: PHASE_COLOR }}>STEP 4 — MAXTERMS (ΠM)</div>
            <div className="flex flex-wrap gap-2">
              {maxterms.map(M => (
                <span key={M.index} className="px-3 py-1.5 rounded text-[11px] font-mono" style={{ background: 'rgba(255,51,102,0.05)', border: '1px solid rgba(255,51,102,0.2)', color: '#FF3366' }}>
                  {M.term} [M{M.index}]
                </span>
              ))}
            </div>
            <div className="text-[13px] font-mono p-4 rounded-xl" style={{ background: '#000', border: '1px solid #1A1A1F', color: '#A0FFA0' }}>
              Canonical POS: {getMaxterms(rows, BOSS_VARS).map(m => m.term).join('·')}
            </div>
            <button onClick={advance} className="self-start px-4 py-2 rounded text-[12px] font-bold font-mono mt-2" style={{ background: PHASE_COLOR, color: '#000' }}>NEXT: CHOOSE PATH →</button>
          </motion.div>
        )}

        {/* Step 4: Comparison & Decision */}
        {bossStep === 4 && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-4">
            <div className="text-[11px] font-mono font-bold" style={{ color: PHASE_COLOR }}>STEP 5 — CHOOSE PATH</div>
            <div className="p-5 rounded-2xl flex flex-col gap-5 shadow-2xl" style={{ background: '#09090B', border: '1px solid #1A1A1F' }}>
              <div className="flex items-center justify-between text-[13px] font-mono px-2">
                <div style={{ color: '#00D4FF' }}>SOP: {minterms.length} AND + 1 OR</div>
                <div style={{ color: '#FF3366' }}>POS: {maxterms.length} OR + 1 AND</div>
              </div>
              <div className="h-3 w-full bg-black rounded-full overflow-hidden flex border border-[#FFFFFF08]">
                 <div style={{ width: `${(minterms.length / 8) * 100}%`, background: '#00D4FF', boxShadow: '0 0 15px #00D4FF44' }} />
                 <div style={{ width: `${(maxterms.length / 8) * 100}%`, background: '#FF3366', boxShadow: '0 0 15px #FF336644' }} />
              </div>
              <div className="text-[14px] font-bold text-center py-3 rounded-lg" style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.1)', color: '#00FF88' }}>
                 RECOMMENDATION: {path === 'EQUAL' ? 'EITHER PATH' : `${path} PATH WINS`}
              </div>
            </div>
            <button onClick={advance} className="self-start px-4 py-2 rounded text-[12px] font-bold font-mono mt-2" style={{ background: PHASE_COLOR, color: '#000' }}>BUILD FINAL CIRCUIT →</button>
          </motion.div>
        )}

        {/* Step 5: Final Circuit */}
        {bossStep === 5 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
            <div className="text-[11px] font-mono font-bold" style={{ color: PHASE_COLOR }}>STEP 6 — FINAL CIRCUIT</div>
            <div className="flex gap-2 flex-wrap">
              {(['AND-OR', 'NAND-NAND', 'OR-AND', 'NOR-NOR'] as CircuitForm[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setCircuitMode(mode)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-mono transition-all focus:outline-none focus:ring-2 ${circuitMode === mode ? 'bg-[#FF5F1F] text-black shadow-lg' : 'border border-[#FF5F1F33] text-slate-500'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl relative" style={{ background: '#06060A', border: `2px solid ${PHASE_COLOR}22`, padding: 24 }}>
              <CircuitCanvas 
                form={circuitMode} 
                minterms={circuitMode.includes('AND') ? minterms : undefined} 
                maxterms={!circuitMode.includes('AND') ? maxterms : undefined} 
                variables={BOSS_VARS} 
                width={380} 
                height={Math.max(220, (circuitMode.includes('AND') ? minterms.length : maxterms.length) * 44 + 80)} 
              />
            </div>
            <button onClick={advance} className="self-center px-8 py-3 rounded-xl text-[14px] font-bold font-mono mt-4 shadow-2xl transition-transform hover:scale-105 active:scale-95" style={{ background: '#00FF88', color: '#000', boxShadow: '0 10px 30px rgba(0,255,136,0.2)' }}>
              COMPLETE MODULE ✓
            </button>
          </motion.div>
        )}

        {/* Completion card */}
        {bossStep === 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl px-6 py-10 text-center flex flex-col gap-5 my-10 shadow-2xl"
            style={{ background: 'rgba(0,255,136,0.03)', border: '2px solid rgba(0,255,136,0.3)', boxShadow: '0 0 40px rgba(0,255,136,0.05)' }}
          >
            <div className="text-6xl">🏆</div>
            <div className="text-3xl font-bold font-mono" style={{ color: '#00FF88', letterSpacing: '0.1em' }}>MASTERED</div>
            <div className="text-[14px] leading-relaxed max-w-sm mx-auto" style={{ color: '#E8E8F0' }}>
              You successfully designed a fault-tolerant 3-bit majority voter. 
              The journey from specification to silicon is complete.
            </div>
            <div className="flex flex-col gap-3 mt-4 items-center">
               <div className="text-[11px] font-mono text-[#00D4FF]">DD-M01 PROFICIENCY: ELITE</div>
               <div className="h-1.5 w-64 bg-slate-950 rounded-full overflow-hidden border border-[#FFFFFF08]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-[#00D4FF]"
                    style={{ boxShadow: '0 0 10px #00D4FFCC' }}
                  />
               </div>
            </div>
            <button onClick={() => window.location.href='/portal'} className="mt-8 px-8 py-2.5 rounded-full text-[13px] font-bold font-mono border-2 border-[#00D4FF55] text-[#00D4FF] hover:bg-[#00D4FF11] transition-all bg-black hover:scale-105 active:scale-95 shadow-xl">
               RETURN TO COMMAND CENTER
            </button>
          </motion.div>
        )}
      </div>
    </SceneWrapper>
  );
};

export default E2_BossChallenge;
