/**
 * CPUEngine.ts - CPU Simulation Engine
 *
 * Simulates a simplified RISC-V inspired processor:
 * - 32 registers (x0 hardwired to 0)
 * - ALU with 10 operations
 * - Instruction decode for R/I/S/B formats
 * - Single-cycle and pipelined execution modes
 * - Hazard detection and forwarding
 */

import type {
    CPUState, CPUConfig, DecodedInstruction, ALUResult, ALUOp,
    ControlSignals, PipelineState, PipelineRegister, HazardInfo, InstructionFormat,
} from './CPUTypes';

// ─── Default Configuration ──────────────────────────────────────────────

const DEFAULT_CONFIG: CPUConfig = {
    name: 'DigiCPU-32',
    wordSize: 32,
    pipelined: false,
    forwarding: false,
    branchPrediction: 'none',
    cacheEnabled: false,
    memorySize: 4096,
    instructionMemSize: 256,
};

// ─── CPU Engine ─────────────────────────────────────────────────────────

export class CPUEngine {
    private state: CPUState;

    constructor(config: Partial<CPUConfig> = {}) {
        const fullConfig = { ...DEFAULT_CONFIG, ...config };
        this.state = this.createInitialState(fullConfig);
    }

    // ─── Public API ─────────────────────────────────────────────────

    /** Load program into instruction memory */
    loadProgram(instructions: number[]): void {
        for (let i = 0; i < instructions.length && i < this.state.instructionMemory.length; i++) {
            this.state.instructionMemory[i] = instructions[i];
        }
        this.state.pc = 0;
        this.state.halted = false;
    }

    /** Execute one cycle */
    cycle(): void {
        if (this.state.halted) return;

        if (this.state.config.pipelined) {
            this.pipelinedCycle();
        } else {
            this.singleCycleCycle();
        }

        this.state.cycleCount++;
    }

    /** Run until halt or max cycles */
    run(maxCycles = 10000): void {
        this.state.running = true;
        let cycles = 0;
        while (!this.state.halted && cycles < maxCycles) {
            this.cycle();
            cycles++;
        }
        this.state.running = false;
    }

    /** Reset CPU state */
    reset(): void {
        this.state = this.createInitialState(this.state.config);
    }

    /** Get current state (snapshot) */
    getState(): Readonly<CPUState> {
        return this.state;
    }

    /** Read register value */
    readRegister(index: number): number {
        if (index === 0) return 0;
        return this.state.registers.registers[index] || 0;
    }

    /** Read memory word */
    readMemory(address: number): number {
        const a = address & ~3; // Word-aligned
        return (this.state.memory[a] |
            (this.state.memory[a + 1] << 8) |
            (this.state.memory[a + 2] << 16) |
            (this.state.memory[a + 3] << 24)) | 0;
    }

    /** Write memory word */
    writeMemory(address: number, value: number): void {
        const a = address & ~3;
        this.state.memory[a] = value & 0xFF;
        this.state.memory[a + 1] = (value >> 8) & 0xFF;
        this.state.memory[a + 2] = (value >> 16) & 0xFF;
        this.state.memory[a + 3] = (value >> 24) & 0xFF;
    }

    // ─── Single Cycle Execution ─────────────────────────────────────

    private singleCycleCycle(): void {
        // Fetch
        const instrWord = this.state.instructionMemory[this.state.pc >> 2];
        if (instrWord === undefined || instrWord === 0) {
            this.state.halted = true;
            return;
        }

        // Decode
        const decoded = this.decode(instrWord);

        // Generate control signals
        const control = this.generateControl(decoded);

        // Read registers
        const rs1Val = this.readRegister(decoded.rs1);
        const rs2Val = this.readRegister(decoded.rs2);

        // ALU
        const aluB = control.aluSrc ? decoded.imm : rs2Val;
        const aluResult = this.executeALU(control.aluOp, rs1Val, aluB);

        // Memory
        if (control.memWrite) {
            this.writeMemory(aluResult.result, rs2Val);
        }

        let writeData = aluResult.result;
        if (control.memRead) {
            writeData = this.readMemory(aluResult.result);
        }

        // Write back
        if (control.regWrite && decoded.rd !== 0) {
            this.state.registers.registers[decoded.rd] = control.memToReg ? writeData : aluResult.result;
        }

        // PC update
        if (control.branch && aluResult.zero) {
            this.state.pc = this.state.pc + decoded.imm;
        } else if (control.jump) {
            this.state.pc = this.state.pc + decoded.imm;
        } else {
            this.state.pc += 4;
        }

        this.state.pipeline.instructionCount++;
    }

    // ─── Pipelined Execution ────────────────────────────────────────

    private pipelinedCycle(): void {
        const pl = this.state.pipeline;

        // Detect hazards
        pl.hazards = this.detectHazards(pl);

        // WB stage
        this.stageWriteBack(pl.WB);

        // MEM stage
        this.stageMemory(pl.MEM);

        // EX stage
        this.stageExecute(pl.EX);

        // ID stage
        this.stageDecode(pl.ID);

        // IF stage
        this.stageFetch(pl.IF);

        // Advance pipeline
        pl.WB = { ...pl.MEM };
        pl.MEM = { ...pl.EX };
        pl.EX = { ...pl.ID };
        pl.ID = { ...pl.IF };
        pl.IF = this.emptyPipelineReg();

        pl.cycleCount++;
    }

    private stageFetch(reg: PipelineRegister): void {
        if (reg.stalled) return;
        const instrWord = this.state.instructionMemory[this.state.pc >> 2];
        if (instrWord === undefined || instrWord === 0) {
            reg.valid = false;
            this.state.halted = true;
            return;
        }
        reg.instruction = this.decode(instrWord);
        reg.pc = this.state.pc;
        reg.valid = true;
        this.state.pc += 4;
    }

    private stageDecode(reg: PipelineRegister): void {
        if (!reg.valid || !reg.instruction) return;
        // Register reads happen in decode - already done by decode()
    }

    private stageExecute(reg: PipelineRegister): void {
        if (!reg.valid || !reg.instruction) return;
        const instr = reg.instruction;
        const control = this.generateControl(instr);
        const rs1Val = this.readRegister(instr.rs1);
        const rs2Val = this.readRegister(instr.rs2);
        const aluB = control.aluSrc ? instr.imm : rs2Val;
        this.executeALU(control.aluOp, rs1Val, aluB);
    }

    private stageMemory(reg: PipelineRegister): void {
        if (!reg.valid || !reg.instruction) return;
        // Memory operations handled in single-cycle for simplicity
    }

    private stageWriteBack(reg: PipelineRegister): void {
        if (!reg.valid || !reg.instruction) return;
        const instr = reg.instruction;
        const control = this.generateControl(instr);
        if (control.regWrite && instr.rd !== 0) {
            const rs1Val = this.readRegister(instr.rs1);
            const rs2Val = this.readRegister(instr.rs2);
            const aluB = control.aluSrc ? instr.imm : rs2Val;
            const result = this.executeALU(control.aluOp, rs1Val, aluB);
            this.state.registers.registers[instr.rd] = result.result;
        }
        this.state.pipeline.instructionCount++;
    }

    // ─── Hazard Detection ───────────────────────────────────────────

    private detectHazards(pl: PipelineState): HazardInfo[] {
        const hazards: HazardInfo[] = [];

        // Data hazard: EX depends on MEM/WB result
        if (pl.EX.valid && pl.EX.instruction && pl.MEM.valid && pl.MEM.instruction) {
            const exInstr = pl.EX.instruction;
            const memInstr = pl.MEM.instruction;
            if (memInstr.rd !== 0 && (memInstr.rd === exInstr.rs1 || memInstr.rd === exInstr.rs2)) {
                hazards.push({
                    type: 'data',
                    stage: 'EX',
                    description: `RAW hazard: x${memInstr.rd} needed by ${exInstr.mnemonic} but not yet written by ${memInstr.mnemonic}`,
                    resolution: this.state.config.forwarding ? 'forward' : 'stall',
                });
            }
        }

        // Control hazard: branch in ID
        if (pl.ID.valid && pl.ID.instruction) {
            const control = this.generateControl(pl.ID.instruction);
            if (control.branch || control.jump) {
                hazards.push({
                    type: 'control',
                    stage: 'ID',
                    description: `Branch/jump: ${pl.ID.instruction.mnemonic} - next instruction uncertain`,
                    resolution: 'flush',
                });
            }
        }

        return hazards;
    }

    // ─── Instruction Decode ─────────────────────────────────────────

    private decode(instrWord: number): DecodedInstruction {
        const opcode = instrWord & 0x7F;
        const rd = (instrWord >> 7) & 0x1F;
        const funct3 = (instrWord >> 12) & 0x7;
        const rs1 = (instrWord >> 15) & 0x1F;
        const rs2 = (instrWord >> 20) & 0x1F;
        const funct7 = (instrWord >> 25) & 0x7F;

        const format = this.getFormat(opcode);
        const imm = this.extractImmediate(instrWord, format);
        const mnemonic = this.getMnemonic(opcode, funct3, funct7);

        return { raw: instrWord, mnemonic, format, rd, rs1, rs2, imm, opcode, funct3, funct7 };
    }

    private getFormat(opcode: number): InstructionFormat {
        switch (opcode) {
            case 0x33: return 'R';  // R-type (add, sub, etc.)
            case 0x13: return 'I';  // I-type (addi, etc.)
            case 0x03: return 'I';  // Load
            case 0x23: return 'S';  // Store
            case 0x63: return 'B';  // Branch
            case 0x6F: return 'J';  // JAL
            case 0x37: return 'U';  // LUI
            default: return 'R';
        }
    }

    private extractImmediate(instr: number, format: InstructionFormat): number {
        switch (format) {
            case 'I': return (instr >> 20) | ((instr & 0x80000000) ? 0xFFFFF000 : 0);
            case 'S': return ((instr >> 7) & 0x1F) | (((instr >> 25) & 0x7F) << 5) | ((instr & 0x80000000) ? 0xFFFFF000 : 0);
            case 'B': return (((instr >> 7) & 0x1) << 11) | (((instr >> 8) & 0xF) << 1) | (((instr >> 25) & 0x3F) << 5) | (((instr >> 31) & 0x1) << 12) | ((instr & 0x80000000) ? 0xFFFFE000 : 0);
            case 'U': return instr & 0xFFFFF000;
            case 'J': return (((instr >> 12) & 0xFF) << 12) | (((instr >> 20) & 0x1) << 11) | (((instr >> 21) & 0x3FF) << 1) | (((instr >> 31) & 0x1) << 20) | ((instr & 0x80000000) ? 0xFFE00000 : 0);
            default: return 0;
        }
    }

    private getMnemonic(opcode: number, funct3: number, funct7: number): string {
        if (opcode === 0x33) {
            if (funct7 === 0x20 && funct3 === 0) return 'SUB';
            const rMnemonics: Record<number, string> = { 0: 'ADD', 1: 'SLL', 2: 'SLT', 3: 'SLTU', 4: 'XOR', 5: 'SRL', 6: 'OR', 7: 'AND' };
            return rMnemonics[funct3] || 'UNKNOWN';
        }
        if (opcode === 0x13) {
            const iMnemonics: Record<number, string> = { 0: 'ADDI', 1: 'SLLI', 2: 'SLTI', 4: 'XORI', 5: 'SRLI', 6: 'ORI', 7: 'ANDI' };
            return iMnemonics[funct3] || 'UNKNOWN';
        }
        if (opcode === 0x03) return 'LW';
        if (opcode === 0x23) return 'SW';
        if (opcode === 0x63) {
            const bMnemonics: Record<number, string> = { 0: 'BEQ', 1: 'BNE', 4: 'BLT', 5: 'BGE' };
            return bMnemonics[funct3] || 'BRANCH';
        }
        if (opcode === 0x6F) return 'JAL';
        if (opcode === 0x37) return 'LUI';
        return 'NOP';
    }

    // ─── ALU ────────────────────────────────────────────────────────

    executeALU(op: ALUOp, a: number, b: number): ALUResult {
        let result: number;
        switch (op) {
            case 'ADD': result = (a + b) | 0; break;
            case 'SUB': result = (a - b) | 0; break;
            case 'AND': result = a & b; break;
            case 'OR': result = a | b; break;
            case 'XOR': result = a ^ b; break;
            case 'SLL': result = a << (b & 0x1F); break;
            case 'SRL': result = a >>> (b & 0x1F); break;
            case 'SRA': result = a >> (b & 0x1F); break;
            case 'SLT': result = (a < b) ? 1 : 0; break;
            case 'SLTU': result = ((a >>> 0) < (b >>> 0)) ? 1 : 0; break;
            default: result = 0;
        }

        return {
            result,
            zero: result === 0,
            negative: result < 0,
            overflow: false, // Simplified
            carryOut: false,
        };
    }

    // ─── Control Signal Generation ──────────────────────────────────

    private generateControl(instr: DecodedInstruction): ControlSignals {
        switch (instr.opcode) {
            case 0x33: // R-type
                return {
                    regWrite: true, memRead: false, memWrite: false, memToReg: false,
                    aluSrc: false, branch: false, jump: false,
                    aluOp: this.funct3ToALUOp(instr.funct3, instr.funct7),
                };
            case 0x13: // I-type
                return {
                    regWrite: true, memRead: false, memWrite: false, memToReg: false,
                    aluSrc: true, branch: false, jump: false,
                    aluOp: this.funct3ToALUOp(instr.funct3, 0),
                };
            case 0x03: // Load
                return {
                    regWrite: true, memRead: true, memWrite: false, memToReg: true,
                    aluSrc: true, branch: false, jump: false, aluOp: 'ADD',
                };
            case 0x23: // Store
                return {
                    regWrite: false, memRead: false, memWrite: true, memToReg: false,
                    aluSrc: true, branch: false, jump: false, aluOp: 'ADD',
                };
            case 0x63: // Branch
                return {
                    regWrite: false, memRead: false, memWrite: false, memToReg: false,
                    aluSrc: false, branch: true, jump: false, aluOp: 'SUB',
                };
            case 0x6F: // JAL
                return {
                    regWrite: true, memRead: false, memWrite: false, memToReg: false,
                    aluSrc: false, branch: false, jump: true, aluOp: 'ADD',
                };
            default:
                return {
                    regWrite: false, memRead: false, memWrite: false, memToReg: false,
                    aluSrc: false, branch: false, jump: false, aluOp: 'ADD',
                };
        }
    }

    private funct3ToALUOp(funct3: number, funct7: number): ALUOp {
        if (funct3 === 0 && funct7 === 0x20) return 'SUB';
        const map: Record<number, ALUOp> = { 0: 'ADD', 1: 'SLL', 2: 'SLT', 3: 'SLTU', 4: 'XOR', 5: 'SRL', 6: 'OR', 7: 'AND' };
        return map[funct3] || 'ADD';
    }

    // ─── Helpers ────────────────────────────────────────────────────

    private createInitialState(config: CPUConfig): CPUState {
        const regs = new Int32Array(32);
        return {
            pc: 0,
            registers: {
                registers: regs,
                readPort1: 0, readPort2: 0,
                writePort: 0, writeData: 0, writeEnable: false,
            },
            memory: new Uint8Array(config.memorySize),
            instructionMemory: new Uint32Array(config.instructionMemSize),
            pipeline: this.createInitialPipeline(),
            config,
            running: false,
            halted: false,
            cycleCount: 0,
            cpi: 1,
        };
    }

    private createInitialPipeline(): PipelineState {
        return {
            IF: this.emptyPipelineReg(),
            ID: this.emptyPipelineReg(),
            EX: this.emptyPipelineReg(),
            MEM: this.emptyPipelineReg(),
            WB: this.emptyPipelineReg(),
            hazards: [],
            cycleCount: 0,
            instructionCount: 0,
            stallCount: 0,
            flushCount: 0,
        };
    }

    private emptyPipelineReg(): PipelineRegister {
        return { instruction: null, pc: 0, valid: false, stalled: false, flushed: false };
    }
}
