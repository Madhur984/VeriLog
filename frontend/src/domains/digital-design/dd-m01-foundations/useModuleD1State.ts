import { useState, useCallback, useEffect } from 'react';
import type {
  ModuleD1State, Phase, PhaseAState, PhaseBState,
  PhaseCState, PhaseDState, PhaseEState, CheckpointState,
  TruthTableRow, CircuitForm,
} from './ModuleD1.types';
import { buildTruthTableRows, recommendPath, getMinterms, getMaxterms } from '../../../shared/utils/booleanEngine';

const DEFAULT_VARS = ['A', 'B', 'C'];
const STORAGE_KEY = 'axe-or-dd-m01-session';

const initialCheckpoint = (): CheckpointState => ({
  open: false,
  answers: {},
  results: {},
  sip_earned: false,
});

const initialPhaseA = (): PhaseAState => {
  const rows = buildTruthTableRows(DEFAULT_VARS.length);
  // Default pattern: F=1 for minterms 1, 2, 4, 7
  [1, 2, 4, 7].forEach(idx => { rows[idx].output = true; });
  [0, 3, 5, 6].forEach(idx => { rows[idx].output = false; });
  
  return {
    tableVars: DEFAULT_VARS,
    tableRows: rows,
    tableLocked: false,
    tableUnlocked: true,
    tableLockAttempted: false,
    selectedMinterms: new Set([1, 2, 4, 7]),
    selectedMaxterms: new Set([0, 3, 5, 6]),
    sopBuilt: false,
    posBuilt: false,
  };
};

const initialPhaseB = (): PhaseBState => ({
  kmap2x2: [false, false, false, false],
  kmapGrouped: null,
  simplifiedExpr: '',
});

const initialPhaseC = (): PhaseCState => ({
  expressionInput: "A'B + AB'",
  circuitMode: 'AND-OR',
  signalTrace: { active: false, inputValues: [false, false, false], activePath: [] },
  nandConversionStep: 0,
  norConversionStep: 0,
});

const initialPhaseD = (): PhaseDState => ({
  focusPath: 'BOTH',
  dualAnimPlaying: false,
  decisionSlider: 4,
  winner: 'EQUAL',
});

const initialPhaseE = (): PhaseEState => ({
  recapNodeActive: null,
  bossStep: 0,
  bossTableFilled: false,
  bossCircuitMode: 'AND-OR',
});

function sceneToPhase(scene: number): Phase {
  if (scene === 0) return 0;
  if (scene >= 1 && scene <= 6) return 'A';
  if (scene >= 7 && scene <= 10) return 'B';
  if (scene >= 11 && scene <= 16) return 'C';
  if (scene >= 17 && scene <= 20) return 'D';
  return 'E';
}

export function useModuleD1State(): ModuleD1State {
  const [currentScene, setCurrentSceneRaw] = useState(0);
  const [completedScenes, setCompletedScenes] = useState<Set<number>>(new Set());
  const [sipTotal, setSipTotal] = useState(0);
  const [finalAssignmentOpen, setFinalAssignmentOpenRaw] = useState(false);

  // Gamification
  const [checkpointStreak, setCheckpointStreak] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [lastCheckpointCorrect, setLastCheckpointCorrect] = useState<boolean | null>(null);
  const [earnedAchievements, setEarnedAchievements] = useState<Set<string>>(new Set());

  const [checkpoint, setCheckpoint] = useState<Record<1 | 2 | 3 | 4, CheckpointState>>({
    1: initialCheckpoint(),
    2: initialCheckpoint(),
    3: initialCheckpoint(),
    4: initialCheckpoint(),
  });

  const [phaseA, setPhaseA] = useState<PhaseAState>(initialPhaseA());
  const [phaseB, setPhaseB] = useState<PhaseBState>(initialPhaseB());
  const [phaseC, setPhaseC] = useState<PhaseCState>(initialPhaseC());
  const [phaseD, setPhaseD] = useState<PhaseDState>(initialPhaseD());
  const [phaseE, setPhaseE] = useState<PhaseEState>(initialPhaseE());

  // ─── Persistence ──────────────────────────────────────────────────────────

  // Auto-save on scene change
  useEffect(() => {
    if (currentScene === 0 && completedScenes.size === 0) return;
    
    const sessionData = {
      currentScene,
      completedScenes: Array.from(completedScenes),
      sipTotal,
      checkpointStreak,
      comboMultiplier,
      earnedAchievements: Array.from(earnedAchievements),
      phaseA: {
        tableRows: phaseA.tableRows.map(r => r.output),
        tableLocked: phaseA.tableLocked,
        selectedMinterms: Array.from(phaseA.selectedMinterms),
        selectedMaxterms: Array.from(phaseA.selectedMaxterms),
      },
      checkpoint: Object.keys(checkpoint).reduce((acc, id) => {
        const cp = checkpoint[Number(id) as 1|2|3|4];
        acc[id] = { answers: cp.answers, results: cp.results, sip_earned: cp.sip_earned };
        return acc;
      }, {} as any)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  }, [currentScene, completedScenes, sipTotal, checkpointStreak, comboMultiplier, earnedAchievements, phaseA, checkpoint]);

  const setCurrentScene = useCallback((scene: number) => {
    setCurrentSceneRaw(scene);
  }, []);

  const completeScene = useCallback((scene: number) => {
    setCompletedScenes(prev => new Set(prev).add(scene));
  }, []);

  const awardSIP = useCallback((amount: number, isCheckpoint = false) => {
    let finalAmount = amount;
    if (isCheckpoint) {
      finalAmount = Math.floor(amount * comboMultiplier);
    }
    setSipTotal(prev => prev + finalAmount);
  }, [comboMultiplier]);

  const awardAchievement = useCallback((id: string) => {
    setEarnedAchievements(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // ─── Phase A Actions ───────────────────────────────────────────────────────
  const setPhaseATableRows = useCallback((rows: TruthTableRow[]) => {
    setPhaseA(prev => ({ ...prev, tableRows: rows, tableLockAttempted: false }));
  }, []);

  const lockPhaseATable = useCallback(() => {
    setPhaseA(prev => {
      const allFilled = prev.tableRows.every(r => r.output !== null);
      if (!allFilled) return { ...prev, tableLockAttempted: true };

      const minterms = getMinterms(prev.tableRows, prev.tableVars);
      const maxterms = getMaxterms(prev.tableRows, prev.tableVars);
      return {
        ...prev,
        tableLocked: true,
        tableUnlocked: false,
        selectedMinterms: new Set(minterms.map(m => m.index)),
        selectedMaxterms: new Set(maxterms.map(M => M.index)),
      };
    });
  }, []);

  const toggleMinterm = useCallback((index: number) => {
    setPhaseA(prev => {
      const next = new Set(prev.selectedMinterms);
      if (next.has(index)) next.delete(index); else next.add(index);
      const locked = prev.tableRows.filter(r => r.output === true);
      return {
        ...prev,
        selectedMinterms: next,
        sopBuilt: next.size === locked.length,
      };
    });
  }, []);

  const toggleMaxterm = useCallback((index: number) => {
    setPhaseA(prev => {
      const next = new Set(prev.selectedMaxterms);
      if (next.has(index)) next.delete(index); else next.add(index);
      const locked = prev.tableRows.filter(r => r.output === false);
      return {
        ...prev,
        selectedMaxterms: next,
        posBuilt: next.size === locked.length,
      };
    });
  }, []);

  // ─── Phase B Actions ───────────────────────────────────────────────────────
  const setKmap2x2 = useCallback((cells: boolean[]) => {
    setPhaseB(prev => ({ ...prev, kmap2x2: cells }));
  }, []);

  const setKmapGrouped = useCallback((groups: number[][] | null) => {
    setPhaseB(prev => ({ ...prev, kmapGrouped: groups }));
  }, []);

  // ─── Phase C Actions ───────────────────────────────────────────────────────
  const setCPhasecircuitMode = useCallback((mode: CircuitForm) => {
    setPhaseC(prev => ({ ...prev, circuitMode: mode }));
  }, []);

  const setExpressionInput = useCallback((expr: string) => {
    setPhaseC(prev => ({ ...prev, expressionInput: expr }));
  }, []);

  const setSignalTrace = useCallback((trace: PhaseCState['signalTrace']) => {
    setPhaseC(prev => ({ ...prev, signalTrace: trace }));
  }, []);

  const setNandConversionStep = useCallback((step: 0 | 1 | 2 | 3) => {
    setPhaseC(prev => ({ ...prev, nandConversionStep: step }));
  }, []);

  const setNorConversionStep = useCallback((step: 0 | 1 | 2 | 3) => {
    setPhaseC(prev => ({ ...prev, norConversionStep: step }));
  }, []);

  // ─── Phase D Actions ───────────────────────────────────────────────────────
  const setFocusPath = useCallback((path: 'HIGH' | 'LOW' | 'BOTH') => {
    setPhaseD(prev => ({ ...prev, focusPath: path }));
  }, []);

  const setDecisionSlider = useCallback((value: number) => {
    setPhaseD(prev => {
      const minterms = value;
      const maxterms = 8 - value;
      let winner: 'SOP' | 'POS' | 'EQUAL' = 'EQUAL';
      if (minterms < maxterms) winner = 'SOP';
      else if (maxterms < minterms) winner = 'POS';
      return { ...prev, decisionSlider: value, winner };
    });
  }, []);

  // ─── Phase E Actions ───────────────────────────────────────────────────────
  const setBossStep = useCallback((step: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
    setPhaseE(prev => {
      // If completing boss (step 6), reward big SIP
      if (step === 6 && prev.bossStep !== 6) {
        awardSIP(1000); // Changed from addSipReward to awardSIP
      }
      return { ...prev, bossStep: step };
    });
  }, [awardSIP]);

  const setBossTableFilled = useCallback((filled: boolean) => {
    setPhaseE(prev => ({ ...prev, bossTableFilled: filled }));
  }, []);

  const setRecapNodeActive = useCallback((node: string | null) => {
    setPhaseE(prev => ({ ...prev, recapNodeActive: node }));
  }, []);

  // ─── Checkpoint Actions ────────────────────────────────────────────────────
  const openCheckpoint = useCallback((id: 1 | 2 | 3 | 4) => {
    setCheckpoint(prev => ({ ...prev, [id]: { ...prev[id], open: true } }));
  }, []);

  const closeCheckpoint = useCallback((id: 1 | 2 | 3 | 4) => {
    setCheckpoint(prev => ({ ...prev, [id]: { ...prev[id], open: false } }));
  }, []);

  const setCheckpointAnswer = useCallback((id: 1 | 2 | 3 | 4, key: string, value: string) => {
    setCheckpoint(prev => ({
      ...prev,
      [id]: { ...prev[id], answers: { ...prev[id].answers, [key]: value } },
    }));
  }, []);

  const setCheckpointResult = useCallback((id: 1 | 2 | 3 | 4, key: string, result: boolean) => {
    setCheckpoint(prev => ({
      ...prev,
      [id]: { ...prev[id], results: { ...prev[id].results, [key]: result } },
    }));
  }, []);

  const earnCheckpointSIP = useCallback((id: 1 | 2 | 3 | 4, firstTry: boolean) => {
    const baseAmounts: Record<1 | 2 | 3 | 4, number> = { 1: 75, 2: 80, 3: 100, 4: 125 };
    
    if (firstTry) {
      setLastCheckpointCorrect(true);
      setCheckpointStreak(prev => {
        const next = prev + 1;
        if (next >= 4) setComboMultiplier(3);
        else if (next >= 3) setComboMultiplier(2);
        else if (next >= 2) setComboMultiplier(1.5);
        return next;
      });
    } else {
      setLastCheckpointCorrect(false);
      setCheckpointStreak(0);
      setComboMultiplier(1);
    }

    setCheckpoint(prev => ({ ...prev, [id]: { ...prev[id], sip_earned: true } }));
    awardSIP(baseAmounts[id], true);
  }, [awardSIP]);

  const [sessionToRestore, setSessionToRestore] = useState<any>(null);

  // Check for session on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.currentScene > 0) {
        setSessionToRestore(data);
      }
    }
  }, []);

  const restoreSession = useCallback(() => {
    if (!sessionToRestore) return;
    
    const data = sessionToRestore;
    setCurrentSceneRaw(data.currentScene);
    setCompletedScenes(new Set(data.completedScenes));
    setSipTotal(data.sipTotal);
    setCheckpointStreak(data.checkpointStreak || 0);
    setComboMultiplier(data.comboMultiplier || 1);
    setEarnedAchievements(new Set(data.earnedAchievements || []));
    
    if (data.phaseA) {
      setPhaseA(prev => {
        const rows = buildTruthTableRows(prev.tableVars.length);
        data.phaseA.tableRows.forEach((out: boolean | null, i: number) => {
          if (i < rows.length) rows[i].output = out;
        });
        return {
          ...prev,
          tableRows: rows,
          tableLocked: data.phaseA.tableLocked,
          tableUnlocked: !data.phaseA.tableLocked,
          selectedMinterms: new Set(data.phaseA.selectedMinterms),
          selectedMaxterms: new Set(data.phaseA.selectedMaxterms),
        };
      });
    }

    if (data.checkpoint) {
      setCheckpoint(prev => {
        const next = { ...prev };
        Object.keys(data.checkpoint).forEach(id => {
          const numId = Number(id) as 1|2|3|4;
          if (next[numId]) {
            next[numId] = { ...next[numId], ...data.checkpoint[id] };
          }
        });
        return next;
      });
    }

    setSessionToRestore(null);
  }, [sessionToRestore]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSessionToRestore(null);
    window.location.reload();
  }, []);

  const unlockPhaseATable = useCallback(() => {
    setPhaseA(prev => ({
      ...prev,
      tableLocked: false,
      tableUnlocked: true,
      sopBuilt: false,
      posBuilt: false,
    }));
  }, []);

  const resetPhaseATable = useCallback(() => {
    setPhaseA(prev => ({
      ...prev,
      tableRows: buildTruthTableRows(prev.tableVars.length),
      tableLocked: false,
      tableUnlocked: true,
      selectedMinterms: new Set(),
      selectedMaxterms: new Set(),
      sopBuilt: false,
      posBuilt: false,
    }));
  }, []);

  const setFinalAssignmentOpen = useCallback((open: boolean) => {
    setFinalAssignmentOpenRaw(open);
  }, []);

  return {
    currentScene,
    totalScenes: 21,
    completedScenes,
    phase: sceneToPhase(currentScene),
    checkpoint,
    phaseA,
    phaseB,
    phaseC,
    phaseD,
    phaseE,
    sipTotal,
    finalAssignmentOpen,
    checkpointStreak,
    comboMultiplier,
    lastCheckpointCorrect,
    earnedAchievements,
    sessionToRestore,
    setCurrentScene,
    completeScene,
    awardSIP,
    awardAchievement,
    restoreSession,
    clearSession,
    setPhaseATableRows,
    lockPhaseATable,
    unlockPhaseATable,
    resetPhaseATable,
    toggleMinterm,
    toggleMaxterm,
    setKmap2x2,
    setKmapGrouped,
    setCPhasecircuitMode,
    setExpressionInput,
    setSignalTrace,
    setNandConversionStep,
    setNorConversionStep,
    setFocusPath,
    setDecisionSlider,
    setBossStep,
    setBossTableFilled,
    setRecapNodeActive,
    openCheckpoint,
    closeCheckpoint,
    setCheckpointAnswer,
    setCheckpointResult,
    earnCheckpointSIP,
    setFinalAssignmentOpen,
  };
}
