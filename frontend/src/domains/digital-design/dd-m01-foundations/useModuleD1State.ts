import { useState, useCallback } from 'react';
import type {
  ModuleD1State, Phase, PhaseAState, PhaseBState,
  PhaseCState, PhaseDState, PhaseEState, CheckpointState,
  TruthTableRow, CircuitForm,
} from './ModuleD1.types';
import { buildTruthTableRows, recommendPath, getMinterms, getMaxterms } from '../../../shared/utils/booleanEngine';

const DEFAULT_VARS = ['A', 'B', 'C'];

const initialCheckpoint = (): CheckpointState => ({
  open: false,
  answers: {},
  results: {},
  sip_earned: false,
});

const initialPhaseA = (): PhaseAState => {
  const rows = buildTruthTableRows(DEFAULT_VARS.length);
  // Default pattern: F=1 for minterms 1, 2, 4, 7 (XOR-like or sparse pattern)
  // This ensures Phase D and others aren't empty black boxes if the student skips Phase A.
  [1, 2, 4, 7].forEach(idx => { rows[idx].output = true; });
  [0, 3, 5, 6].forEach(idx => { rows[idx].output = false; });
  
  return {
    tableVars: DEFAULT_VARS,
    tableRows: rows,
    tableLocked: false,
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
  const [finalAssignmentOpen, setFinalAssignmentOpen] = useState(false);

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

  const setCurrentScene = useCallback((scene: number) => {
    setCurrentSceneRaw(scene);
  }, []);

  const completeScene = useCallback((scene: number) => {
    setCompletedScenes(prev => new Set(prev).add(scene));
  }, []);

  const awardSIP = useCallback((amount: number) => {
    setSipTotal(prev => prev + amount);
  }, []);

  // ─── Phase A Actions ───────────────────────────────────────────────────────
  const setPhaseATableRows = useCallback((rows: TruthTableRow[]) => {
    setPhaseA(prev => ({ ...prev, tableRows: rows }));
  }, []);

  const lockPhaseATable = useCallback(() => {
    setPhaseA(prev => {
      const minterms = getMinterms(prev.tableRows, prev.tableVars);
      const maxterms = getMaxterms(prev.tableRows, prev.tableVars);
      return {
        ...prev,
        tableLocked: true,
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
    setPhaseE(prev => ({ ...prev, bossStep: step }));
  }, []);

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

  const earnCheckpointSIP = useCallback((id: 1 | 2 | 3 | 4) => {
    const amounts: Record<1 | 2 | 3 | 4, number> = { 1: 75, 2: 80, 3: 100, 4: 125 };
    setCheckpoint(prev => ({ ...prev, [id]: { ...prev[id], sip_earned: true } }));
    awardSIP(amounts[id]);
  }, [awardSIP]);

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
    setCurrentScene,
    completeScene,
    awardSIP,
    setPhaseATableRows,
    lockPhaseATable,
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
