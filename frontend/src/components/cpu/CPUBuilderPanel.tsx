/**
 * CPUBuilderPanel.tsx — Main CPU Builder Lab interface
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
                // Unknown — skip
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
            fontSize: 11,
            background: 'rgba(0, 0, 0, 0.15)',
        }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                gap: 4,
                padding: '4px 8px',
                borderBottom: '1px solid rgba(0, 212, 255, 0.06)',
                alignItems: 'center',
            }}>
                <button onClick={handleAssembleAndLoad} style={tbBtnStyle('#10B981')}>🔧 Assemble</button>
                <button onClick={handleStep} style={tbBtnStyle('#00D4FF')} disabled={cpuState.halted}>⏭ Step</button>
                <button onClick={handleRun} style={tbBtnStyle('#F59E0B')} disabled={cpuState.halted}>▶ Run</button>
                <button onClick={handleReset} style={tbBtnStyle('#EF4444')}>⏹ Reset</button>
                <div style={{ width: 1, height: 14, background: 'rgba(0, 212, 255, 0.08)', margin: '0 4px' }} />
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9 }}>
                    PC: <span style={{ color: '#00D4FF' }}>0x{cpuState.pc.toString(16).padStart(4, '0')}</span>
                </span>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9, marginLeft: 8 }}>
                    Cycle: <span style={{ color: '#F59E0B' }}>{cpuState.cycleCount}</span>
                </span>
                {cpuState.halted && (
                    <span style={{ color: '#EF4444', fontSize: 9, fontWeight: 600, marginLeft: 8 }}>HALTED</span>
                )}
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Code Editor */}
                <div style={{
                    width: 280,
                    borderRight: '1px solid rgba(0, 212, 255, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <div style={{ padding: '4px 8px', color: 'rgba(0, 212, 255, 0.3)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Assembly Editor (RISC-V)
                    </div>
                    <textarea
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        spellCheck={false}
                        style={{
                            flex: 1,
                            background: 'rgba(0, 0, 0, 0.3)',
                            color: '#e6edf3',
                            border: 'none',
                            padding: 8,
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 11,
                            lineHeight: 1.6,
                            resize: 'none',
                            outline: 'none',
                        }}
                    />
                </div>

                {/* Right Panel: Registers + Pipeline */}
                <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {/* Register File */}
                    <div style={{ padding: 8 }}>
                        <div style={{ color: 'rgba(0, 212, 255, 0.3)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                            Register File (x0-x31)
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(8, 1fr)',
                            gap: 2,
                        }}>
                            {Array.from({ length: 32 }, (_, i) => {
                                const val = i === 0 ? 0 : (cpuState.registers.registers[i] || 0);
                                const isNonZero = val !== 0;
                                return (
                                    <div key={i} style={{
                                        padding: '2px 4px',
                                        background: isNonZero ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${isNonZero ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)'}`,
                                        borderRadius: 2,
                                        textAlign: 'center',
                                    }}>
                                        <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 7 }}>x{i}</div>
                                        <div style={{
                                            color: isNonZero ? '#10B981' : 'rgba(255,255,255,0.15)',
                                            fontSize: 9,
                                            fontWeight: isNonZero ? 600 : 400,
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
