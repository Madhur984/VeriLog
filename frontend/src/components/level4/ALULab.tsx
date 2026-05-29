import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Activity, Calculator, Settings } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode?: boolean; }

const OPCODES = [
    { id: 'ADD', label: 'Addition', color: '#10B981' },
    { id: 'SUB', label: 'Subtraction', color: '#F59E0B' },
    { id: 'AND', label: 'Logical AND', color: '#0EA5E9' },
    { id: 'OR',  label: 'Logical OR',  color: '#3B82F6' },
    { id: 'XOR', label: 'Exclusive OR', color: '#F97316' },
];

export const ALULab: React.FC<Props> = ({ isDarkMode = true }) => {
    const [bitsA, setBitsA] = useState<number[]>([1, 0, 1, 0]);
    const [bitsB, setBitsB] = useState<number[]>([0, 1, 1, 0]);
    const [activeOp, setActiveOp] = useState(OPCODES[0]);

    const T = {
        card: isDarkMode ? '#0D0F16' : '#FFFFFF',
        surface: isDarkMode ? '#1A1D24' : '#F8FAFC',
        border: isDarkMode ? '#222633' : '#E2E8F0',
        text: isDarkMode ? '#E5E7EB' : '#0F172A',
        muted: isDarkMode ? '#64748B' : '#64748B',
        accent: activeOp.color,
        mono: "'JetBrains Mono', monospace",
    };

    const toggleA = (i: number) => {
        setBitsA(prev => {
            const next = [...prev];
            next[i] = 1 - next[i];
            return next;
        });
    };

    const toggleB = (i: number) => {
        setBitsB(prev => {
            const next = [...prev];
            next[i] = 1 - next[i];
            return next;
        });
    };

    const valA = bitsA.reduce((acc, b, i) => acc + b * Math.pow(2, 3 - i), 0);
    const valB = bitsB.reduce((acc, b, i) => acc + b * Math.pow(2, 3 - i), 0);

    const calculation = useMemo(() => {
        let res = 0;
        let c = 0;
        if (activeOp.id === 'ADD') {
            res = valA + valB;
            c = res > 15 ? 1 : 0;
            res = res % 16;
        } else if (activeOp.id === 'SUB') {
            res = valA - valB;
            if (res < 0) {
                res = (res + 16) % 16;
                c = 1; // Borrow flag representation
            }
        } else if (activeOp.id === 'AND') {
            res = valA & valB;
        } else if (activeOp.id === 'OR') {
            res = valA | valB;
        } else if (activeOp.id === 'XOR') {
            res = valA ^ valB;
        }
        
        const resBits = Array.from({ length: 4 }, (_, i) => (res >> (3 - i)) & 1);
        const z = res === 0 ? 1 : 0;
        const n = (res >> 3) & 1; // 4th bit is sign bit for 4-bit signed representation

        return { res, resBits, c, z, n };
    }, [valA, valB, activeOp]);

    return (
        <div style={{ width: '100%', maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase block mb-3" style={{ color: T.accent }}>
                    Scene 4.7 - The Silicon Heart
                </span>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 8 }}>ALU Laboratory</h2>
                <p style={{ color: T.muted, fontSize: 14 }}>
                    Combine logic gates to perform 4-bit arithmetic and logic. Monitor flags for system control.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                
                {/* Control Unit */}
                <div style={{ padding: 32, background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 32 }}>
                    
                    {/* Opcode Selector */}
                    <div>
                        <div style={{ padding: '6px 12px', background: `${T.accent}15`, borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <Settings size={14} color={T.accent} />
                            <span style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Opcode selection</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                            {OPCODES.map(op => (
                                <motion.button
                                    key={op.id}
                                    onClick={() => setActiveOp(op)}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        padding: '12px',
                                        background: activeOp.id === op.id ? `${op.color}20` : T.surface,
                                        border: `2px solid ${activeOp.id === op.id ? op.color : T.border}`,
                                        borderRadius: 12,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 4
                                    }}
                                >
                                    <span style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 900, color: activeOp.id === op.id ? op.color : T.muted }}>{op.id}</span>
                                    <span style={{ fontSize: 8, color: T.muted, textTransform: 'uppercase', opacity: 0.6 }}>{op.label.split(' ')[0]}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Operands */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <span style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, color: T.text }}>OPERAND A ({valA})</span>
                            </div>
                            <div className="flex gap-2">
                                {bitsA.map((b, i) => (
                                    <SwitchBtn key={i} val={!!b} onToggle={() => toggleA(i)} color={T.accent} T={T} />
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <span style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, color: T.text }}>OPERAND B ({valB})</span>
                            </div>
                            <div className="flex gap-2">
                                {bitsB.map((b, i) => (
                                    <SwitchBtn key={i} val={!!b} onToggle={() => toggleB(i)} color={T.accent} T={T} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Execution Unit */}
                <div style={{ padding: 32, background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: T.accent, opacity: 0.6 }} />
                    <div className="flex items-center gap-3 mb-10">
                        <Activity size={20} color={T.accent} />
                        <h3 className="font-sans font-bold text-lg" style={{ color: T.text }}>Execution Result</h3>
                    </div>

                    {/* Result Bits */}
                    <div className="flex flex-col items-center gap-12 mb-12">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-4">
                                {calculation.resBits.map((b, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            backgroundColor: b ? `${T.accent}20` : T.surface,
                                            borderColor: b ? T.accent : T.border,
                                            boxShadow: b ? `0 0 20px ${T.accent}40` : 'none',
                                            scale: b ? 1.05 : 1
                                        }}
                                        style={{ width: 62, height: 72, borderRadius: 12, border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <span style={{ fontFamily: T.mono, fontSize: 32, fontWeight: 800, color: b ? T.accent : T.muted }}>{b}</span>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-mono text-3xl font-black" style={{ color: T.text }}>{calculation.res}</span>
                                <span className="font-mono text-xs opacity-40 uppercase tracking-widest" style={{ color: T.text }}>DECIMAL</span>
                            </div>
                        </div>

                        {/* Flags */}
                        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                            <FlagBox label="Zero [Z]" val={!!calculation.z} color="#FC8181" T={T} />
                            <FlagBox label="Carry [C/B]" val={!!calculation.c} color="#F6AD55" T={T} />
                            <FlagBox label="Negative [N]" val={!!calculation.n} color="#63B3ED" T={T} />
                        </div>
                    </div>

                    <div style={{ padding: 20, background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)', borderRadius: 16, border: `1px solid ${T.border}` }}>
                        <div className="flex items-center gap-2 mb-2">
                           <Calculator size={14} color={T.accent} />
                           <span style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: T.text, textTransform: 'uppercase' }}>Operation Trace</span>
                        </div>
                        <p style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
                            {activeOp.id} Execution Success. Bitwise comparison performed across 4 parallel gate paths. 
                            Status flags updated for next instruction cycle.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal Helpers
const SwitchBtn: React.FC<{ val: boolean; onToggle: () => void; color: string; T: any }> = ({ val, onToggle, color, T }) => (
    <button onClick={onToggle} style={{
        background: 'none', border: 'none', cursor: 'pointer',
    }}>
        <motion.div
            animate={{
                background: val ? `${color}20` : T.surface,
                borderColor: val ? color : T.border,
            }}
            style={{ width: 44, height: 50, borderRadius: 8, border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <span style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 800, color: val ? color : T.muted }}>{val ? 1 : 0}</span>
        </motion.div>
    </button>
);

const FlagBox: React.FC<{ label: string; val: boolean; color: string; T: any }> = ({ label, val, color, T }) => (
    <motion.div
        animate={{
            borderColor: val ? color : T.border,
            backgroundColor: val ? `${color}10` : 'transparent'
        }}
        style={{ padding: 12, borderRadius: 12, border: '1px solid', textAlign: 'center' }}
    >
        <div style={{ fontFamily: T.mono, fontSize: 8, fontWeight: 700, color: val ? color : T.muted, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
        <div style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 900, color: val ? color : T.muted }}>{val ? 'TRUE' : 'FALSE'}</div>
    </motion.div>
);
