// ─── Module DD-M01 Types ─────────────────────────────────────────────────────
import type { TruthTableRow, Minterm, Maxterm, CircuitForm } from '../../../../shared/utils/booleanEngine';

export type { TruthTableRow, Minterm, Maxterm, CircuitForm };

export type Phase = 0 | 'A' | 'B' | 'C' | 'D' | 'E';

export type CheckpointAnswers = Record<string, string>;
export type CheckpointResults = Record<string, boolean | null>;

export interface CheckpointState {
  open: boolean;
  answers: CheckpointAnswers;
  results: CheckpointResults;
  sip_earned: boolean;
}

export interface PhaseAState {
  tableVars: string[];
  tableRows: TruthTableRow[];
  tableLocked: boolean;
  selectedMinterms: Set<number>;
  selectedMaxterms: Set<number>;
  sopBuilt: boolean;
  posBuilt: boolean;
}

export interface PhaseBState {
  kmap2x2: boolean[];
  kmapGrouped: number[][] | null;
  simplifiedExpr: string;
}

export interface PhaseCState {
  expressionInput: string;
  circuitMode: CircuitForm;
  signalTrace: {
    active: boolean;
    inputValues: boolean[];
    activePath: string[];
  };
  nandConversionStep: 0 | 1 | 2 | 3;
  norConversionStep: 0 | 1 | 2 | 3;
}

export interface PhaseDState {
  focusPath: 'HIGH' | 'LOW' | 'BOTH';
  dualAnimPlaying: boolean;
  decisionSlider: number;
  winner: 'SOP' | 'POS' | 'EQUAL';
}

export interface PhaseEState {
  recapNodeActive: string | null;
  bossStep: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  bossTableFilled: boolean;
  bossCircuitMode: 'AND-OR' | 'NAND-NAND';
}

export interface ModuleD1State {
  // Navigation
  currentScene: number;
  totalScenes: 21;
  completedScenes: Set<number>;
  phase: Phase;

  // Checkpoints
  checkpoint: Record<1 | 2 | 3 | 4, CheckpointState>;

  // Phase states
  phaseA: PhaseAState;
  phaseB: PhaseBState;
  phaseC: PhaseCState;
  phaseD: PhaseDState;
  phaseE: PhaseEState;

  // Global
  sipTotal: number;
  finalAssignmentOpen: boolean;

  // Actions
  setCurrentScene: (scene: number) => void;
  completeScene: (scene: number) => void;
  awardSIP: (amount: number) => void;

  setPhaseATableRows: (rows: TruthTableRow[]) => void;
  lockPhaseATable: () => void;
  toggleMinterm: (index: number) => void;
  toggleMaxterm: (index: number) => void;

  setKmap2x2: (cells: boolean[]) => void;
  setKmapGrouped: (groups: number[][] | null) => void;

  setCPhasecircuitMode: (mode: CircuitForm) => void;
  setExpressionInput: (expr: string) => void;
  setSignalTrace: (trace: PhaseCState['signalTrace']) => void;
  setNandConversionStep: (step: 0 | 1 | 2 | 3) => void;
  setNorConversionStep: (step: 0 | 1 | 2 | 3) => void;

  setFocusPath: (path: 'HIGH' | 'LOW' | 'BOTH') => void;
  setDecisionSlider: (value: number) => void;

  setBossStep: (step: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void;
  setBossTableFilled: (filled: boolean) => void;

  openCheckpoint: (id: 1 | 2 | 3 | 4) => void;
  closeCheckpoint: (id: 1 | 2 | 3 | 4) => void;
  setCheckpointAnswer: (id: 1 | 2 | 3 | 4, key: string, value: string) => void;
  setCheckpointResult: (id: 1 | 2 | 3 | 4, key: string, result: boolean) => void;
  earnCheckpointSIP: (id: 1 | 2 | 3 | 4) => void;

  setFinalAssignmentOpen: (open: boolean) => void;
  setRecapNodeActive: (node: string | null) => void;
}
