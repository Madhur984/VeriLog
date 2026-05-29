/**
 * CPUBuilderPanel.tsx - Main CPU Builder Lab interface
 *
 * Interactive CPU construction and simulation panel with:
 * - Assembly editor (simplified RISC-V)
 * - Register file viewer
 * - Memory viewer
 * - Pipeline visualization
 * - Step/Run/Reset controls
 */

import { useState, useCallback, memo } from 'react';
import { CPUEngine } from '../../engines/cpu/CPUEngine';
import { PipelineVisualizer } from './PipelineVisualizer';

// ─── Simple Assembler ───────────────────────────────────────────────────

function assemble(asm: string): number[] {
    const instructions: number[] = [];
    const lines = asm.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#') && !l.startsWith('//'));

    for (const line of lines) {
        const parts = line.replace(/,/g, ' ').split(/\s+/);
        const mnemonic = parts[0]?.toUpperCase();

        switch (mnemonic) {
            case 'ADDI': {
                const rd = parseReg(parts[1]);
                const rs1 = parseReg(parts[2]);
                const imm = parseInt(parts[3]) & 0xFFF;
                instructions.push((imm << 20) | (rs1 << 15) | (0 << 12) | (rd << 7) | 0x13);
                break;
            }
            case 'ADD': {
                const rd = parseReg(parts[1]);
                const rs1 = parseReg(parts[2]);
                const rs2 = parseReg(parts[3]);
                instructions.push((0 << 25) | (rs2 << 20) | (rs1 << 15) | (0 << 12) | (rd << 7) | 0x33);
                break;
            }
            case 'SUB': {
                const rd = parseReg(parts[1]);
                const rs1 = parseReg(parts[2]);
                const rs2 = parseReg(parts[3]);
                instructions.push((0x20 << 25) | (rs2 << 20) | (rs1 << 15) | (0 << 12) | (rd << 7) | 0x33);
                break;
            }
            case 'AND': {
                const rd = parseReg(parts[1]);
                const rs1 = parseReg(parts[2]);
                const rs2 = parseReg(parts[3]);
                instructions.push((0 << 25) | (rs2 << 20) | (rs1 << 15) | (7 << 12) | (rd << 7) | 0x33);
                break;
            }
            case 'OR': {
                const rd = parseReg(parts[1]);
                const rs1 = parseReg(parts[2]);
                const rs2 = parseReg(parts[3]);
                instructions.push((0 << 25) | (rs2 << 20) | (rs1 << 15) | (6 << 12) | (rd << 7) | 0x33);
                break;
            }
            case 'NOP':
                instructions.push(0x13); // addi x0, x0, 0
                break;
            default:
                // Unknown - skip
                break;
        }
    }

    return instructions;
}

function parseReg(s: string): number {
    if (!s) return 0;
    const clean = s.replace(/[,\s]/g, '').toLowerCase();
    if (clean === 'zero') return 0;
    if (clean.startsWith('x')) return parseInt(clean.slice(1)) & 0x1F;
    return parseInt(clean) & 0x1F;
}

// ─── Component ──────────────────────────────────────────────────────────

const SAMPLE_PROGRAM = `# Simple RISC-V Program
# Load values and compute sum
ADDI x1, x0, 10    # x1 = 10
ADDI x2, x0, 20    # x2 = 20
ADD  x3, x1, x2    # x3 = x1 + x2 = 30
SUB  x4, x2, x1    # x4 = x2 - x1 = 10
AND  x5, x1, x2    # x5 = x1 & x2
OR   x6, x1, x2    # x6 = x1 | x2
ADDI x7, x3, 5     # x7 = x3 + 5 = 35`;

export const CPUBuilderPanel = memo(() => {
    const [code, setCode] = useState(SAMPLE_PROGRAM);
    const [engine] = useState(() => new CPUEngine({ pipelined: false }));
    const [cpuState, setCpuState] = useState(engine.getState());


    const refresh = useCallback(() => setCpuState({ ...engine.getState() }), [engine]);

    const handleAssembleAndLoad = useCallback(() => {
        const instructions = assemble(code);
        engine.reset();
        engine.loadProgram(instructions);
        refresh();
    }, [code, engine, refresh]);

    const handleStep = useCallback(() => {
        engine.cycle();
        refresh();
    }, [engine, refresh]);

    const handleRun = useCallback(() => {
        engine.run(1000);
        refresh();
    }, [engine, refresh]);

    const handleReset = useCallback(() => {
        engine.reset();
        refresh();
    }, [engine, refresh]);

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12,
            background: 'white',
        }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                gap: 8,
                padding: '12px 16px',
                borderBottom: '1px solid #E2E8F0',
                alignItems: 'center',
                background: 'white',
            }}>
                <button onClick={handleAssembleAndLoad} style={tbBtnStyle('#0284C7')}>🔧 Assemble</button>
                <button onClick={handleStep} style={tbBtnStyle('#0284C7')} disabled={cpuState.halted}>⏭ Step</button>
                <button onClick={handleRun} style={tbBtnStyle('#0F766E')} disabled={cpuState.halted}>▶ Run</button>
                <button onClick={handleReset} style={tbBtnStyle('#E11D48')}>⏹ Reset</button>
                <div style={{ width: 1, height: 20, background: '#E2E8F0', margin: '0 8px' }} />
                <span style={{ color: '#64748B', fontSize: 11, fontWeight: 600 }}>
                    PC: <span style={{ color: '#0284C7' }}>0x{cpuState.pc.toString(16).padStart(4, '0')}</span>
                </span>
                <span style={{ color: '#64748B', fontSize: 11, fontWeight: 600, marginLeft: 16 }}>
                    Cycle: <span style={{ color: '#EA580C' }}>{cpuState.cycleCount}</span>
                </span>
                {cpuState.halted && (
                    <span style={{ color: '#E11D48', fontSize: 11, fontWeight: 700, marginLeft: 16 }}>HALTED</span>
                )}
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Code Editor */}
                <div style={{
                    width: 320,
                    borderRight: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#F8FAFC',
                }}>
                    <div style={{ padding: '8px 12px', color: '#64748B', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' }}>
                        Assembly Editor (RISC-V)
                    </div>
                    <textarea
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        spellCheck={false}
                        style={{
                            flex: 1,
                            background: '#F8FAFC',
                            color: '#1E293B',
                            border: 'none',
                            padding: 16,
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 12,
                            lineHeight: 1.6,
                            resize: 'none',
                            outline: 'none',
                        }}
                    />
                </div>

                {/* Right Panel: Registers + Pipeline */}
                <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {/* Register File */}
                    <div style={{ padding: 16 }}>
                        <div style={{ color: '#0284C7', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284C7' }} />
                            Register File (x0-x31)
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(8, 1fr)',
                            gap: 4,
                        }}>
                            {Array.from({ length: 32 }, (_, i) => {
                                const val = i === 0 ? 0 : (cpuState.registers.registers[i] || 0);
                                const isNonZero = val !== 0;
                                return (
                                    <div key={i} style={{
                                        padding: '8px 12px',
                                        background: isNonZero ? '#F0F9FF' : '#FFFFFF',
                                        border: `1px solid ${isNonZero ? '#BAE6FD' : '#E2E8F0'}`,
                                        borderRadius: 12,
                                        textAlign: 'center',
                                        transition: 'all 200ms',
                                    }}>
                                        <div style={{ color: '#94A3B8', fontSize: 9, fontWeight: 600 }}>x{i}</div>
                                        <div style={{
                                            color: isNonZero ? '#0369A1' : '#CBD5E1',
                                            fontSize: 13,
                                            fontWeight: 700,
                                        }}>
                                            {val}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pipeline */}
                    <PipelineVisualizer pipeline={cpuState.pipeline} />
                </div>
            </div>
        </div>
    );
});

CPUBuilderPanel.displayName = 'CPUBuilderPanel';

// ─── Styles ─────────────────────────────────────────────────────────────

function tbBtnStyle(color: string): React.CSSProperties {
    return {
        background: `${color}10`,
        border: `1px solid ${color}25`,
        color,
        fontSize: 9,
        padding: '3px 8px',
        borderRadius: 3,
        cursor: 'pointer',
        fontFamily: "'IBM Plex Mono', monospace",
        transition: 'all 100ms',
    };
}
