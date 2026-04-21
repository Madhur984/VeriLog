import React, { useRef, useCallback, useState, useId, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useModuleD1State } from './useModuleD1State';
import { useScrollScene } from '../../../shared/hooks/useScrollScene';
import { useGlobalSensory } from '../../../hooks/useGlobalSensory';

import ProgressBar from './components/ProgressBar';
import { SIPToastSystem } from './components/SIPToast';
import CheckpointModal from './components/CheckpointModal';
import type { CheckpointQuestion } from './components/CheckpointModal';
import KineticFlowchart from './components/KineticFlowchart';
import BackgroundOrchestrator from './components/BackgroundOrchestrator';

// ─── Scenes ───────────────────────────────────────────────────────────────────
import S00_SignalProblem from './scenes/S00_SignalProblem';
import S01_ComplexityBasics from './scenes/S01_ComplexityBasics';
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

  const { playAmbient, stopAmbient, playSound } = useGlobalSensory();

  React.useEffect(() => {
    playAmbient();
    return () => stopAmbient();
  }, [playAmbient, stopAmbient]);

  const [isBooting, setIsBooting] = useState(true);
  const [showTelemetry, setShowTelemetry] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  // Scroll detection
  const { setContainer } = useScrollScene({
    totalScenes: 21,
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
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        scrollToScene(Math.min(state.currentScene + 1, 21));
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        scrollToScene(Math.max(state.currentScene - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [state.currentScene, scrollToScene]);

  // Checkpoint SIP handler
  const handleEarnSIP = useCallback((checkpointId: 1 | 2 | 3 | 4, firstTry: boolean) => {
    const labels: Record<1 | 2 | 3 | 4, string> = {
      1: 'Checkpoint A passed', 2: 'Checkpoint B passed',
      3: 'Checkpoint C passed', 4: 'Boss defeated',
    };
    state.earnCheckpointSIP(checkpointId, firstTry);
    
    // Calculate final SIP for toast
    const baseAmounts: Record<1 | 2 | 3 | 4, number> = { 1: 75, 2: 80, 3: 100, 4: 125 };
    const finalAmount = Math.floor(baseAmounts[checkpointId] * (firstTry ? state.comboMultiplier : 1));
    const reason = firstTry && state.checkpointStreak > 0 
      ? `${labels[checkpointId]} // ${state.checkpointStreak + 1}X STREAK!`
      : labels[checkpointId];
      
    addToast(finalAmount, reason);
  }, [state, addToast]);

  const current = state.currentScene;
  const phaseNames = ['SIGNAL_PROC', 'FORMULATION', 'MINIMISATION', 'REALISATION', 'EVALUATION', 'FINAL_OP'];
  const currentPhaseName = phaseNames[Math.floor(current / 4)] || 'FINAL_OP';
  
  const isAnyCheckpointOpen = Object.values(state.checkpoint).some(cp => cp.open);

  useEffect(() => {
    if (isAnyCheckpointOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isAnyCheckpointOpen]);

  return (
    <main className="relative w-full h-screen overflow-hidden select-none" style={{ background: '#06060A' }}>
      <h1 className="sr-only">Digital Design Fundamentals: Module D1</h1>
      
      {/* ─── Cinematic Layers ─── */}
      <BackgroundOrchestrator currentScene={current} />
      
      {/* Global Texture Overlay (Inline SVG noise to avoid 404) */}
      <div 
        className="fixed inset-0 z-[10] pointer-events-none opacity-[0.03] mix-blend-overlay" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      <div className="fixed inset-0 z-[11] pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/20" />

      {/* Boot Sequence (IMP-H1) */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "circIn" }}
            className="fixed inset-0 z-[1000] bg-[#06060A] flex flex-col items-center justify-center gap-6"
          >
             <motion.div 
               animate={{ opacity: [0.2, 1, 0.2] }} 
               transition={{ duration: 1.5, repeat: Infinity }}
               className="w-16 h-16 rounded-full border-2 border-cyan-500/20 flex items-center justify-center"
             >
                <div className="w-8 h-8 rounded-full border-b-2 border-cyan-400 animate-spin" />
             </motion.div>
             <div className="flex flex-col items-center gap-2">
                <div className="text-[10px] font-mono font-black italic text-cyan-400 uppercase tracking-[0.4em]">Initialising_Tactical_Core</div>
                <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
                   <motion.div 
                     initial={{ x: '-100%' }}
                     animate={{ x: '100%' }}
                     transition={{ duration: 2, ease: "easeInOut" }}
                     className="absolute inset-0 bg-cyan-400"
                   />
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Telemetry Toggle */}
      <button
        onClick={() => setShowTelemetry(!showTelemetry)}
        className="fixed left-8 bottom-8 z-[200] w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group"
      >
        <div className={`w-1.5 h-1.5 rounded-full ${showTelemetry ? 'bg-cyan-400 shadow-[0_0_10px_#22D3EE]' : 'bg-white/20'} transition-all`} />
      </button>

      {/* Persistence Restore Prompt (IMP-E1) */}
      <AnimatePresence>
        {state.sessionToRestore && current === 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed inset-x-8 top-32 z-[150] p-6 rounded-2xl bg-black/80 border border-cyan-500/30 backdrop-blur-xl flex flex-col gap-4 shadow-[0_0_40px_rgba(6,182,212,0.1)]"
          >
            <div>
              <div className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-[0.2em] mb-1">
                Persistent Data Found // AXE-OR_RECOVERY_PROTOCOL
              </div>
              <h3 className="text-lg font-black italic text-white uppercase tracking-tighter">
                Restore previous session?
              </h3>
              <p className="text-xs font-medium text-white/50">
                Scene {state.sessionToRestore.currentScene} // {state.sessionToRestore.sipTotal} SIP total
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={state.restoreSession}
                className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-400 text-black text-xs font-black italic tracking-widest hover:bg-cyan-300 transition-colors"
              >
                RESTORE SESSION
              </button>
              <button
                onClick={state.clearSession}
                className="px-4 py-2.5 rounded-xl bg-white/5 text-white/40 text-xs font-black italic tracking-widest hover:bg-white/10 transition-colors"
              >
                START FRESH
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Telemetry HUD Sidebar ─── */}
      <AnimatePresence>
        {showTelemetry && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed left-8 top-32 bottom-24 w-64 z-[180] hidden lg:flex flex-col gap-6"
          >
             <div className="flex-1 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-md p-8 flex flex-col gap-8">
                <div className="space-y-1">
                   <div className="text-[10px] font-mono font-black italic text-white/20 uppercase tracking-widest">Session_Stats</div>
                   <div className="text-2xl font-mono font-black italic text-white leading-none">{state.sipTotal} <span className="text-[10px] text-amber-500">SIP</span></div>
                </div>

                <div className="space-y-4">
                   <div className="text-[10px] font-mono font-black italic text-white/20 uppercase tracking-widest">Signal_Metrology</div>
                   <div className="space-y-3">
                      {[
                        { label: 'Packet_Loss', val: '0.0001%', color: 'text-green-500' },
                        { label: 'Jitter_RMS', val: '1.2ps', color: 'text-cyan-500' },
                        { label: 'Core_Temp', val: '42°C', color: 'text-amber-500' },
                        { label: 'Logical_Leak', val: 'None', color: 'text-rose-500' },
                      ].map(m => (
                        <div key={m.label} className="flex justify-between items-center text-[10px] font-mono font-black italic">
                           <span className="text-white/30 uppercase">{m.label}</span>
                           <span className={m.color}>{m.val}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="mt-auto space-y-4">
                   <div className="text-[10px] font-mono font-black italic text-white/20 uppercase tracking-widest">Active_Protocol</div>
                   <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-[10px] font-mono font-medium text-cyan-400 leading-relaxed italic">
                      "Design is not just what it looks like and feels like. Design is how it works."
                      <br />— Steve Jobs
                   </div>
                </div>
             </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <KineticFlowchart currentScene={current} />

      {/* Progress bar */}
      <ProgressBar current={current} total={22} />

      {/* Achievement / Streak HUD (IMP-D1) */}
      <div className="fixed top-8 left-8 z-[110] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {state.checkpointStreak > 0 && (
            <motion.div
              key="streak-badge"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-amber-400/10 border border-amber-400/30 backdrop-blur-md"
            >
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-amber-400/60 uppercase tracking-widest leading-none">Streak</span>
                <span className="text-sm font-black italic text-amber-400 leading-none">{state.checkpointStreak}X</span>
              </div>
              {state.comboMultiplier > 1 && (
                <div className="ml-2 pl-3 border-l border-amber-400/20">
                  <span className="text-[10px] font-mono text-amber-400/60 uppercase tracking-widest leading-none">Bonus</span>
                  <div className="text-xs font-black italic text-amber-400 leading-none">{state.comboMultiplier}X</div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back button (Tactical Style) */}
      <button
        onClick={() => navigate('/portal')}
        className="fixed top-24 left-4 z-[110] w-14 h-14 flex items-center justify-center rounded-2xl bg-black/40 border border-white/10 text-white/40 hover:text-cyan-400 hover:border-cyan-400/50 transition-all backdrop-blur-md"
        aria-label="Return to portal"
      >
        <span className="text-xs font-black italic">BACK</span>
      </button>

      {/* Scroll container */}
      <div
        ref={el => { containerRef.current = el; setContainer(el); }}
        className="w-full relative z-20"
        style={{
          height: '100dvh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        {/* ── S00 Hook ── */}
        <S00_SignalProblem sceneIndex={0} currentScene={current} onBegin={onBegin} />

        <S01_ComplexityBasics sceneIndex={1} currentScene={current} />
        <A1_TruthTableContract
          sceneIndex={2}
          currentScene={current}
          tableRows={state.phaseA.tableRows}
          tableLocked={state.phaseA.tableLocked}
          tableUnlocked={state.phaseA.tableUnlocked}
          tableLockAttempted={state.phaseA.tableLockAttempted}
          onRowsChange={state.setPhaseATableRows}
          onLock={() => { state.lockPhaseATable(); awardSIPWithToast(25, 'Truth table locked'); }}
          onUnlock={state.unlockPhaseATable}
          onReset={state.resetPhaseATable}
        />

        {/* ── A2 Minterms ── */}
        <A2_Minterms
          sceneIndex={3}
          currentScene={current}
          tableRows={state.phaseA.tableRows}
          selectedMinterms={state.phaseA.selectedMinterms}
          onToggleMinterm={state.toggleMinterm}
        />

        {/* ── A3 Maxterms ── */}
        <A3_Maxterms
          sceneIndex={4}
          currentScene={current}
          tableRows={state.phaseA.tableRows}
          selectedMaxterms={state.phaseA.selectedMaxterms}
          onToggleMaxterm={state.toggleMaxterm}
        />

        {/* ── A4 Canonical SOP ── */}
        <A4_CanonicalSOP sceneIndex={5} currentScene={current} tableRows={state.phaseA.tableRows} />

        {/* ── A5 Canonical POS ── */}
        <A5_CanonicalPOS sceneIndex={6} currentScene={current} tableRows={state.phaseA.tableRows} />

        {/* ── B1 Cost ── */}
        <B1_CostOfCanonical sceneIndex={7} currentScene={current} />

        {/* ── B2 K-Map ── */}
        <B2_KMapIntuition
          sceneIndex={8}
          currentScene={current}
          cells={state.phaseB.kmap2x2}
          onCellsChange={state.setKmap2x2}
        />

        {/* ── B3 K-Map Limits ── */}
        <B3_KMapLimits sceneIndex={9} currentScene={current} />

        {/* ── C1 Two-Level Realisation ── */}
        <C1_TwoLevelRealisation
          sceneIndex={10}
          currentScene={current}
          expressionInput={state.phaseC.expressionInput}
          circuitMode={state.phaseC.circuitMode}
          signalTrace={state.phaseC.signalTrace}
          onExpressionChange={state.setExpressionInput}
          onCircuitModeChange={state.setCPhasecircuitMode}
          onSignalTraceChange={state.setSignalTrace}
        />

        {/* ── C2 NAND Universality ── */}
        <C2_NANDUniversality sceneIndex={11} currentScene={current} />

        {/* ── C3 NOR Universality ── */}
        <C3_NORUniversality sceneIndex={12} currentScene={current} />

        {/* ── C4 NAND-NAND ── */}
        <C4_NANDNANDConversion
          sceneIndex={13}
          currentScene={current}
          step={state.phaseC.nandConversionStep}
          onStepChange={state.setNandConversionStep}
        />

        {/* ── C5 NOR-NOR ── */}
        <C5_NORNORConversion
          sceneIndex={14}
          currentScene={current}
          step={state.phaseC.norConversionStep}
          onStepChange={state.setNorConversionStep}
        />

        {/* ── D1 High Path ── */}
        <D1_HighPath sceneIndex={15} currentScene={current} tableRows={state.phaseA.tableRows} />

        {/* ── D2 Low Path ── */}
        <D2_LowPath sceneIndex={16} currentScene={current} tableRows={state.phaseA.tableRows} />

        {/* ── D3 Side-by-Side ── */}
        <D3_SideBySideComparison
          sceneIndex={17}
          currentScene={current}
          tableRows={state.phaseA.tableRows}
          focusPath={state.phaseD.focusPath}
          onFocusPathChange={state.setFocusPath}
        />

        {/* ── D4 Decision Engine ── */}
        <D4_DecisionEngine
          sceneIndex={18}
          currentScene={current}
          slider={state.phaseD.decisionSlider}
          winner={state.phaseD.winner}
          onSliderChange={state.setDecisionSlider}
        />

        {/* ── E1 Recap ── */}
        <E1_FullPipelineRecap
          sceneIndex={19}
          currentScene={current}
          recapNodeActive={state.phaseE.recapNodeActive}
          onNodeClick={state.setRecapNodeActive}
        />

        {/* ── E2 Boss ── */}
        <E2_BossChallenge
          sceneIndex={20}
          currentScene={current}
          bossStep={state.phaseE.bossStep}
          onBossStepChange={state.setBossStep}
        />
      </div>

      {/* ─── Checkpoint Trigger Button (fixed, phase-aware) ─── */}
      {current >= 2 && current <= 6 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-6 right-6 z-50 px-6 py-3 rounded-2xl text-sm font-mono font-black italic tracking-widest focus:outline-none focus:ring-2"
          style={{ background: '#06B6D4', color: '#000', zIndex: 100 }}
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
          className="fixed bottom-6 right-6 z-50 px-6 py-3 rounded-2xl text-sm font-mono font-black italic tracking-widest"
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
          className="fixed bottom-6 right-6 z-50 px-6 py-3 rounded-2xl text-sm font-mono font-black italic tracking-widest"
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
          className="fixed bottom-6 right-6 z-50 px-6 py-3 rounded-2xl text-sm font-mono font-black italic tracking-widest"
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
        phaseColor="#06B6D4"
        questions={CP1_QUESTIONS}
        sipReward={75}
        sipEarned={state.checkpoint[1].sip_earned}
        onClose={() => state.closeCheckpoint(1)}
        onEarnSIP={(firstTry) => handleEarnSIP(1, firstTry)}
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
        onEarnSIP={(firstTry) => handleEarnSIP(2, firstTry)}
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
        onEarnSIP={(firstTry) => handleEarnSIP(3, firstTry)}
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
        onEarnSIP={(firstTry) => handleEarnSIP(4, firstTry)}
      />

      {/* ─── Toast system ─── */}
      <SIPToastSystem toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
};

export default ModuleD1;
