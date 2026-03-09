/**
 * CPUSystemArchitecture.ts — Foundational Architecture for CPU Builder
 * 
 * Defines the logical structure and interfaces for a custom 8-bit CPU simulation.
 * This is a "No UI" foundational layer to support future CPU Builder labs.
 */

import { NodeId } from '../mure/core/SignalNode';

// ─── Data Types ─────────────────────────────────────────────────────────

export type Bit = 0 | 1;
export type Word8 = number; // 0-255
export type Word16 = number; // 0-65535

/**
 * CPU OpCodes (Instruction Set Architecture - ISA)
 */
export enum OpCode {
    NOP = 0x00, // No Operation
    LDA = 0x01, // Load Register A from Memory
    LDB = 0x02, // Load Register B from Memory
    STA = 0x03, // Store Register A to Memory
    ADD = 0x04, // A = A + B
    SUB = 0x05, // A = A - B
    AND = 0x06, // A = A & B
    OR = 0x07, // A = A | B
    XOR = 0x08, // A = A ^ B
    JMP = 0x09, // Jump to Address
    JZ = 0x0A, // Jump if Zero
    JC = 0x0B, // Jump if Carry
    OUT = 0x0C, // Output A to Display
    HLT = 0x0F  // Halt Simulation
}

// ─── Component Interfaces ──────────────────────────────────────────────

/**
 * ALU (Arithmetic Logic Unit) Interface
 */
export interface ALUState {
    result: Word8;
    carry: boolean;
    zero: boolean;
    negative: boolean;
}

/**
 * Register File Interface
 */
export interface RegisterState {
    A: Word8;
    B: Word8;
    IR: Word8;  // Instruction Register
    PC: Word16; // Program Counter
    MAR: Word16; // Memory Address Register
    OUT: Word8; // Output Register
}

/**
 * Control Unit State
 */
export interface ControlUnitState {
    step: number; // T-cycle (e.g. T0, T1, T2...)
    isHalted: boolean;
    flags: {
        zero: boolean;
        carry: boolean;
    };
}

/**
 * Unified CPU System State
 */
export interface CPUSystemState {
    registers: RegisterState;
    alu: ALUState;
    control: ControlUnitState;
    memory: Uint8Array;
    busValue: Word8;
}

// ─── Bus Management ─────────────────────────────────────────────────────

export enum BusSource {
    NONE = 'NONE',
    ACCUMULATOR = 'ACCUMULATOR',
    REGISTER_B = 'REGISTER_B',
    ALU_OUT = 'ALU_OUT',
    MEMORY_DATA = 'MEMORY_DATA',
    PROGRAM_COUNTER = 'PROGRAM_COUNTER',
    INSTRUCTION_REG = 'INSTRUCTION_REG'
}

// ─── Engine Bridge ──────────────────────────────────────────────────────

/**
 * Interface for the CPU Simulator Engine
 */
export interface ICPUEngine {
    reset(): void;
    step(): CPUSystemState;
    loadProgram(binary: Uint8Array): void;
    getSnapshot(): CPUSystemState;

    // Probing hooks (for Oscilloscope integration)
    getPinValue(pinName: string): Bit | Word8;
}

/**
 * Maps a logical NodeId from the Visual Canvas to a CPU component
 */
export interface CPUNodeMapping {
    nodeId: NodeId;
    component: 'ALU' | 'REG_A' | 'REG_B' | 'PC' | 'BUS';
}
