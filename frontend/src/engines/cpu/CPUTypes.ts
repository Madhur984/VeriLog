/**
 * CPUTypes.ts — Type definitions for CPU Builder Lab
 *
 * Defines the ISA, datapath components, pipeline stages,
 * and CPU configuration types.
 */

// ─── Instruction Set Architecture ───────────────────────────────────────

export type InstructionFormat = 'R' | 'I' | 'S' | 'B' | 'U' | 'J';

export interface InstructionDef {
    mnemonic: string;
    opcode: number;
    format: InstructionFormat;
    funct3?: number;
    funct7?: number;
    description: string;
    category: 'arithmetic' | 'logical' | 'memory' | 'branch' | 'jump' | 'immediate';
}

export interface DecodedInstruction {
    raw: number;
    mnemonic: string;
    format: InstructionFormat;
    rd: number;
    rs1: number;
    rs2: number;
    imm: number;
    opcode: number;
    funct3: number;
    funct7: number;
}

// ─── Datapath Components ────────────────────────────────────────────────

export interface RegisterFile {
    registers: Int32Array;   // x0-x31
    readPort1: number;
    readPort2: number;
    writePort: number;
    writeData: number;
    writeEnable: boolean;
}

export interface ALUResult {
    result: number;
    zero: boolean;
    negative: boolean;
    overflow: boolean;
    carryOut: boolean;
}

export type ALUOp = 'ADD' | 'SUB' | 'AND' | 'OR' | 'XOR' | 'SLL' | 'SRL' | 'SRA' | 'SLT' | 'SLTU';

export interface ControlSignals {
    regWrite: boolean;
    memRead: boolean;
    memWrite: boolean;
    memToReg: boolean;
    aluSrc: boolean;
    branch: boolean;
    jump: boolean;
    aluOp: ALUOp;
}

// ─── Pipeline ───────────────────────────────────────────────────────────

export type PipelineStage = 'IF' | 'ID' | 'EX' | 'MEM' | 'WB';

export interface PipelineRegister {
    instruction: DecodedInstruction | null;
    pc: number;
    valid: boolean;
    stalled: boolean;
    flushed: boolean;
}

export interface HazardInfo {
    type: 'data' | 'control' | 'structural';
    stage: PipelineStage;
    description: string;
    resolution: 'forward' | 'stall' | 'flush' | 'none';
}

export interface PipelineState {
    IF: PipelineRegister;
    ID: PipelineRegister;
    EX: PipelineRegister;
    MEM: PipelineRegister;
    WB: PipelineRegister;
    hazards: HazardInfo[];
    cycleCount: number;
    instructionCount: number;
    stallCount: number;
    flushCount: number;
}

// ─── CPU Configuration ──────────────────────────────────────────────────

export interface CPUConfig {
    name: string;
    wordSize: 8 | 16 | 32;
    pipelined: boolean;
    forwarding: boolean;
    branchPrediction: 'none' | 'always_taken' | 'always_not_taken' | 'dynamic';
    cacheEnabled: boolean;
    memorySize: number;       // bytes
    instructionMemSize: number;
}

export interface CPUState {
    pc: number;
    registers: RegisterFile;
    memory: Uint8Array;
    instructionMemory: Uint32Array;
    pipeline: PipelineState;
    config: CPUConfig;
    running: boolean;
    halted: boolean;
    cycleCount: number;
    cpi: number;              // cycles per instruction
}

// ─── Learning Stages ────────────────────────────────────────────────────

export type CPULearningStage =
    | 'single_cycle'
    | 'multi_cycle'
    | 'pipelined'
    | 'hazard_detection'
    | 'forwarding'
    | 'branch_prediction';

export interface CPUChallenge {
    id: string;
    stage: CPULearningStage;
    title: string;
    description: string;
    instruction: string;
    expectedResult: Record<string, number>;
    hints: string[];
    unlockRequirement?: string;
}
