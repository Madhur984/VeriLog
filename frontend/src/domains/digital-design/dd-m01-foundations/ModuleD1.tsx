import React, { useRef, useCallback, useState, useId } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useModuleD1State } from './useModuleD1State';
import { useScrollScene } from '../../../shared/hooks/useScrollScene';

import ProgressBar from './components/ProgressBar';
import { SIPToastSystem } from './components/SIPToast';
import CheckpointModal from './components/CheckpointModal';
import type { CheckpointQuestion } from './components/CheckpointModal';
import TacticalHUD from './components/TacticalHUD';

// ─── Scenes ───────────────────────────────────────────────────────────────────
import S00_SignalProblem from './scenes/S00_SignalProblem';
import A1_TruthTableContract from './scenes/A1_TruthTableContract';
import A2_Minterms from './scenes/A2_Minterms';
import A3_Maxterms from './scenes/A3_Maxterms';
import A4_CanonicalSOP from './scenes/A4_CanonicalSOP';
import A5_CanonicalPOS from './scenes/A5_CanonicalPOS';
import B1_CostOfCanonical from './scenes/B1_CostOfCanonical';
import B2_KMapIntuition from './scenes/B2_KMapIntuition';
import B3_KMapLimits from './scenes/B3_KMapLimits';
import C1_TwoLevelRealisation from './scenes/C1_TwoLevelRealisation';
import C2_NANDUniversality from './scenes/C2_NANDUniversality';
import C3_NORUniversality from './scenes/C3_NORUniversality';
import C4_NANDNANDConversion from './scenes/C4_NANDNANDConversion';
import C5_NORNORConversion from './scenes/C5_NORNORConversion';
import D1_HighPath from './scenes/D1_HighPath';
import D2_LowPath from './scenes/D2_LowPath';
import D3_SideBySideComparison from './scenes/D3_SideBySideComparison';
import D4_DecisionEngine from './scenes/D4_DecisionEngine';
import E1_FullPipelineRecap from './scenes/E1_FullPipelineRecap';
import E2_BossChallenge from './scenes/E2_BossChallenge';

// ─── Checkpoints ──────────────────────────────────────────────────────────────
const CP1_QUESTIONS: CheckpointQuestion[] = [
  {
    id: 'cp1q1', type: 'number', question: 'A truth table with 4 variables has how many rows?',
    correct: '16', hint: '2^n', explanation: '2^4 = 16 rows.',
  },
  {
    id: 'cp1q2', type: 'mcq', question: 'When filling a minterm: input=0 maps to…',
    options: ["Uncomplemented variable (A)", "Complement (A′)"],
    correct: "Complement (A′)", explanation: "For minterms: input=1 → variable, input=0 → complement (A′).",
  },
  {
    id: 'cp1q3', type: 'mcq', question: 'When filling a maxterm: input=1 maps to…',
    options: ["Uncomplemented variable (A)", "Complement (A′)"],
    correct: "Complement (A′)",
    explanation: "For maxterms the rule is REVERSED: input=1 → complement, input=0 → uncomplemented.",
    hint: "Maxterms use the REVERSED rule compared to minterms.",
  },
  {
    id: 'cp1q4', type: 'text', question: 'What notation is used to list minterms? (example: _m(1,2))',
    correct: 'σm', hint: 'Greek letter sigma + m', explanation: "Σm notation lists all minterm indices.",
  },
];

const CP2_QUESTIONS: CheckpointQuestion[] = [
  {
    id: 'cp2q1', type: 'number', question: 'A 3-variable function has 7 maxterms. How many minterms?',
    correct: '1', hint: 'Minterms + maxterms = 2^n',
    explanation: '2^3 = 8 total rows. 8 - 7 = 1 minterm.',
  },
  {
    id: 'cp2q2', type: 'mcq', question: 'Canonical SOP is implemented with which gate structure?',
    options: ['AND-OR', 'OR-AND', 'NOR-NOR', 'XOR-XNOR'],
    correct: 'AND-OR', explanation: 'SOP = sum of products = AND gates feeding an OR gate.',
  },
  {
    id: 'cp2q3', type: 'mcq', question: 'For a 2-variable K-map, what is the max number of cells in one group?',
    options: ['1', '2', '4', '8'],
    correct: '4', explanation: '2-var K-map has 4 cells. All 4 can form one group (when all are 1).',
  },
];

const CP3_QUESTIONS: CheckpointQuestion[] = [
  {
    id: 'cp3q1', type: 'mcq', question: 'NAND is universal because…',
    options: ['It has fewer transistors', 'NOT, AND, and OR can all be built from NAND gates', 'It is faster'],
    correct: 'NOT, AND, and OR can all be built from NAND gates',
    explanation: 'Universality means any Boolean function can be expressed using only that gate.',
  },
  {
    id: 'cp3q2', type: 'mcq', question: 'AND-OR circuit → NAND-NAND requires how many extra gates?',
    options: ['0', '1', '2', 'Equal to number of terms'],
    correct: '0', hint: 'Double negation law: ¬¬X = X',
    explanation: 'Bubbles cancel at the AND/OR boundary — same gate count, zero extra cost.',
  },
  {
    id: 'cp3q3', type: 'mcq', question: 'POS (Product of Sums) maps to which two-level structure?',
    options: ['AND-OR', 'NAND-NAND', 'OR-AND', 'XOR-AND'],
    correct: 'OR-AND', explanation: 'POS = maxterms ANDed = OR gates feeding AND gate.',
  },
];

const CP4_QUESTIONS: CheckpointQuestion[] = [
  {
    id: 'cp4q1', type: 'mcq', question: 'A function has 3 minterms and 5 maxterms. Which path is more efficient?',
    options: ['SOP (High Path)', 'POS (Low Path)', 'Equal'],
    correct: 'SOP (High Path)', explanation: '3 < 5, so SOP needs fewer level-1 gates.',
  },
  {
    id: 'cp4q2', type: 'multiselect', question: 'NAND-NAND circuit is equivalent to which of the following?',
    options: ['AND-OR', 'OR of AND', 'De Morgan inversion of AND-OR', 'Sum of products'],
    correct: ['AND-OR', 'De Morgan inversion of AND-OR', 'Sum of products'],
    explanation: 'NAND-NAND implements SOP = AND-OR = sum of products, via De Morgan equivalence.',
  },
  {
    id: 'cp4q3', type: 'text', question: 'For a 3-bit majority voter, what is the Σm notation? (format: Σm(x,y,z,w))',
    correct: 'Σm(3,5,6,7)', hint: 'F=1 when 2+ bits are 1',
    explanation: 'Rows 3(011), 5(101), 6(110), 7(111) all have 2 or more 1-bits.',
  },
];

// ─── Toast state ──────────────────────────────────────────────────────────────
interface Toast { id: string; amount: number; reason: string; }

const ModuleD1: React.FC = () => {
  const navigate = useNavigate();
  const state = useModuleD1State();
  const containerRef = useRef<HTMLDivElement>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const addToast = useCallback((amount: number, reason: string) => {
    const id = String(++toastId.current);
    setToasts(prev => [...prev, { id, amount, reason }]);
  }, []);

  const awardSIPWithToast = useCallback((amount: number, reason: string) => {
    state.awardSIP(amount);
    addToast(amount, reason);
  }, [state, addToast]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Scroll detection
  const { setContainer } = useScrollScene({
    totalScenes: 20,
    onSceneChange: (idx) => {
      state.setCurrentScene(idx);
      // Auto-complete previous scenes
      if (idx > 0) state.completeScene(idx - 1);
    },
  });

  const scrollToScene = useCallback((idx: number) => {
    const el = containerRef.current?.querySelector(`[data-scene-id="${idx}"]`) as HTMLElement;
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const onBegin = useCallback(() => scrollToScene(1), [scrollToScene]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        scrollToScene(Math.min(state.currentScene + 1, 20));
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        scrollToScene(Math.max(state.currentScene - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [state.currentScene, scrollToScene]);

  // Checkpoint SIP handler
  const handleEarnSIP = useCallback((checkpointId: 1 | 2 | 3 | 4) => {
    const amounts: Record<1 | 2 | 3 | 4, number> = { 1: 75, 2: 80, 3: 100, 4: 125 };
    const labels: Record<1 | 2 | 3 | 4, string> = {
      1: 'Checkpoint A passed', 2: 'Checkpoint B passed',
      3: 'Checkpoint C passed', 4: 'Boss defeated',
    };
    state.earnCheckpointSIP(checkpointId);
    addToast(amounts[checkpointId], labels[checkpointId]); // Use addToast here because earnCheckpointSIP already awarded the SIP
  }, [state, addToast]);

  const current = state.currentScene;
  const phaseNames = ['SIGNAL_PROC', 'FORMULATION', 'MINIMISATION', 'REALISATION', 'EVALUATION', 'FINAL_OP'];
  const currentPhaseName = phaseNames[Math.floor(current / 4)] || 'FINAL_OP';
  const systemStatus = state.phaseA.tableLocked ? 'LOGIC_SYNCED' : 'UNSTABLE_INPUT';

  return (
    <div className="relative" style={{ background: '#06060A', overflowX: 'hidden' }}>
      {/* Tactical HUD */}
      <TacticalHUD phase={currentPhaseName} sip={state.sipTotal} status={systemStatus} />

      {/* Progress bar */}
      <ProgressBar current={current} total={20} />

      {/* Back button (Tactical Style) */}
      <button
        onClick={() => navigate('/portal')}
        className="fixed top-24 left-4 z-[110] w-12 h-12 flex items-center justify-center rounded-xl bg-black/40 border border-white/10 text-white/40 hover:text-cyan-400 hover:border-cyan-400/50 transition-all backdrop-blur-md"
        aria-label="Return to portal"
      >
        <span className="text-[10px] font-mono">BACK</span>
      </button>

      {/* Scroll container */}
      <div
        ref={el => { containerRef.current = el; setContainer(el); }}
        className="w-full"
        style={{
          height: '100dvh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
        }}
        role="main"
        aria-label="Module DD-M01: Digital Design Foundations"
      >
        {/* ── S00 Hook ── */}
        <S00_SignalProblem sceneIndex={0} currentScene={current} onBegin={onBegin} />

        {/* ── A1 Truth Table ── */}
        <A1_TruthTableContract
          sceneIndex={1}
          currentScene={current}
          tableRows={state.phaseA.tableRows}
          tableLocked={state.phaseA.tableLocked}
          onRowsChange={state.setPhaseATableRows}
          onLock={() => { state.lockPhaseATable(); awardSIPWithToast(25, 'Truth table locked'); }}
        />

        {/* ── A2 Minterms ── */}
        <A2_Minterms
          sceneIndex={2}
          currentScene={current}
          tableRows={state.phaseA.tableRows}
          selectedMinterms={state.phaseA.selectedMinterms}
          onToggleMinterm={state.toggleMinterm}
        />

        {/* ── A3 Maxterms ── */}
        <A3_Maxterms
          sceneIndex={3}
          currentScene={current}
          tableRows={state.phaseA.tableRows}
          selectedMaxterms={state.phaseA.selectedMaxterms}
          onToggleMaxterm={state.toggleMaxterm}
        />

        {/* ── CHECKPOINT  1 (after scene 3) — trigger button in scene 3 */}
        {/* Checkpoint 1 appears as overlay when student reaches scene 4 */}

        {/* ── A4 Canonical SOP ── */}
        <A4_CanonicalSOP sceneIndex={4} currentScene={current} tableRows={state.phaseA.tableRows} />

        {/* ── A5 Canonical POS ── */}
        <A5_CanonicalPOS sceneIndex={5} currentScene={current} tableRows={state.phaseA.tableRows} />

        {/* ── B1 Cost ── */}
        <B1_CostOfCanonical sceneIndex={6} currentScene={current} />

        {/* ── B2 K-Map ── */}
        <B2_KMapIntuition
          sceneIndex={7}
          currentScene={current}
          cells={state.phaseB.kmap2x2}
          onCellsChange={state.setKmap2x2}
        />

        {/* ── B3 K-Map Limits ── */}
        <B3_KMapLimits sceneIndex={8} currentScene={current} />

        {/* ── C1 Two-Level Realisation ── */}
        <C1_TwoLevelRealisation
          sceneIndex={9}
          currentScene={current}
          expressionInput={state.phaseC.expressionInput}
          circuitMode={state.phaseC.circuitMode}
          onExpressionChange={state.setExpressionInput}
          onCircuitModeChange={state.setCPhasecircuitMode}
        />

        {/* ── C2 NAND Universality ── */}
        <C2_NANDUniversality sceneIndex={10} currentScene={current} />

        {/* ── C3 NOR Universality ── */}
        <C3_NORUniversality sceneIndex={11} currentScene={current} />

        {/* ── C4 NAND-NAND ── */}
        <C4_NANDNANDConversion
          sceneIndex={12}
          currentScene={current}
          step={state.phaseC.nandConversionStep}
          onStepChange={state.setNandConversionStep}
        />

        {/* ── C5 NOR-NOR ── */}
        <C5_NORNORConversion
          sceneIndex={13}
          currentScene={current}
          step={state.phaseC.norConversionStep}
          onStepChange={state.setNorConversionStep}
        />

        {/* ── D1 High Path ── */}
        <D1_HighPath sceneIndex={14} currentScene={current} tableRows={state.phaseA.tableRows} />

        {/* ── D2 Low Path ── */}
        <D2_LowPath sceneIndex={15} currentScene={current} tableRows={state.phaseA.tableRows} />

        {/* ── D3 Side-by-Side ── */}
        <D3_SideBySideComparison
          sceneIndex={16}
          currentScene={current}
          tableRows={state.phaseA.tableRows}
          focusPath={state.phaseD.focusPath}
          onFocusPathChange={state.setFocusPath}
        />

        {/* ── D4 Decision Engine ── */}
        <D4_DecisionEngine
          sceneIndex={17}
          currentScene={current}
          slider={state.phaseD.decisionSlider}
          winner={state.phaseD.winner}
          onSliderChange={state.setDecisionSlider}
        />

        {/* ── E1 Recap ── */}
        <E1_FullPipelineRecap
          sceneIndex={18}
          currentScene={current}
          recapNodeActive={state.phaseE.recapNodeActive}
          onNodeClick={state.setRecapNodeActive}
        />

        {/* ── E2 Boss ── */}
        <E2_BossChallenge
          sceneIndex={19}
          currentScene={current}
          bossStep={state.phaseE.bossStep}
          onBossStepChange={state.setBossStep}
        />
      </div>

      {/* ─── Checkpoint Trigger Button (fixed, phase-aware) ─── */}
      {current >= 3 && current <= 6 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-full text-[12px] font-mono font-semibold focus:outline-none focus:ring-2"
          style={{ background: '#A855F7', color: '#000', zIndex: 100 }}
          onClick={() => state.openCheckpoint(1)}
          aria-label="Open Phase A checkpoint"
        >
          CHECKPOINT A →
        </motion.button>
      )}
      {current >= 7 && current <= 9 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-full text-[12px] font-mono font-semibold"
          style={{ background: '#3B82F6', color: '#000', zIndex: 100 }}
          onClick={() => state.openCheckpoint(2)}
          aria-label="Open Phase B checkpoint"
        >
          CHECKPOINT B →
        </motion.button>
      )}
      {current >= 10 && current <= 14 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-full text-[12px] font-mono font-semibold"
          style={{ background: '#22C55E', color: '#000', zIndex: 100 }}
          onClick={() => state.openCheckpoint(3)}
          aria-label="Open Phase C checkpoint"
        >
          CHECKPOINT C →
        </motion.button>
      )}
      {current >= 15 && current <= 18 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-full text-[12px] font-mono font-semibold"
          style={{ background: '#FFC107', color: '#000', zIndex: 100 }}
          onClick={() => state.openCheckpoint(4)}
          aria-label="Open Phase D checkpoint"
        >
          CHECKPOINT D →
        </motion.button>
      )}

      {/* ─── Checkpoint Modals ─── */}
      <CheckpointModal
        id={1}
        open={state.checkpoint[1].open}
        title="Canonical Forms Assessment"
        phase="A"
        phaseColor="#A855F7"
        questions={CP1_QUESTIONS}
        sipReward={75}
        sipEarned={state.checkpoint[1].sip_earned}
        onClose={() => state.closeCheckpoint(1)}
        onEarnSIP={() => handleEarnSIP(1)}
      />
      <CheckpointModal
        id={2}
        open={state.checkpoint[2].open}
        title="Minimisation Assessment"
        phase="B"
        phaseColor="#3B82F6"
        questions={CP2_QUESTIONS}
        sipReward={80}
        sipEarned={state.checkpoint[2].sip_earned}
        onClose={() => state.closeCheckpoint(2)}
        onEarnSIP={() => handleEarnSIP(2)}
      />
      <CheckpointModal
        id={3}
        open={state.checkpoint[3].open}
        title="Gate Realisation Assessment"
        phase="C"
        phaseColor="#22C55E"
        questions={CP3_QUESTIONS}
        sipReward={100}
        sipEarned={state.checkpoint[3].sip_earned}
        onClose={() => state.closeCheckpoint(3)}
        onEarnSIP={() => handleEarnSIP(3)}
      />
      <CheckpointModal
        id={4}
        open={state.checkpoint[4].open}
        title="Full Pipeline Assessment"
        phase="D"
        phaseColor="#FFC107"
        questions={CP4_QUESTIONS}
        sipReward={125}
        sipEarned={state.checkpoint[4].sip_earned}
        onClose={() => state.closeCheckpoint(4)}
        onEarnSIP={() => handleEarnSIP(4)}
      />

      {/* ─── Toast system ─── */}
      <SIPToastSystem toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default ModuleD1;
