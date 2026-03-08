import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import type { VarCount } from './KMapEngine';

const T = {
    card: '#0D0F16', surface: '#1A1D24', border: '#222633',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF', success: '#10B981', warning: '#F59E0B',
    mono: "'JetBrains Mono', monospace",
};

interface Props {
    variables: VarCount;
    groups: string[][];
    expression: string;
    onComplete: () => void;
}

const GRAY_1 = ['0', '1'];
const GRAY_2 = ['00', '01', '11', '10'];

const GROUP_COLORS = [
    { bg: 'rgba(245,158,11,0.1)', border: '#F59E0B', text: '#F59E0B' }, // Amber
    { bg: 'rgba(16,185,129,0.1)', border: '#10B981', text: '#10B981' }, // Emerald
    { bg: 'rgba(139,92,246,0.1)', border: '#8B5CF6', text: '#8B5CF6' }, // Violet
    { bg: 'rgba(236,72,153,0.1)', border: '#EC4899', text: '#EC4899' }, // Pink
];

export const BooleanSimplification: React.FC<Props> = ({ variables, groups, expression, onComplete }) => {
    // We expect students to type the boolean term for each group (e.g. A'C or a'c or !A&C)
    // We will normalize it to basic uppercase letters for comparison.
    const [inputs, setInputs] = useState<Record<number, string>>({});
    const [feedback, setFeedback] = useState<Record<number, boolean>>({});

    const derivationSteps = useMemo(() => {
        return groups.map(group => {
            const cols_gray = variables === 2 ? GRAY_1 : GRAY_2;
            const rows_gray = variables === 4 ? GRAY_2 : GRAY_1;
            const rowVars = variables === 4 ? 'AB' : 'A';
            const colVars = variables === 2 ? 'B' : (variables === 3 ? 'BC' : 'CD');
            const allVars = rowVars + colVars;

            const bitStrings = group.map(cell => {
                const [r, c] = cell.split('-').map(Number);
                return rows_gray[r] + cols_gray[c];
            });

            const steps = [];
            let term = '';
            for (let i = 0; i < allVars.length; i++) {
                const bits = new Set(bitStrings.map(bs => bs[i]));
                const isConstant = bits.size === 1;
                const value = Array.from(bits)[0];
                steps.push({ var: allVars[i], isConstant, value });
                if (isConstant) {
                    term += value === '1' ? allVars[i] : allVars[i] + "'";
                }
            }
            return { term, steps, bitStrings };
        });
    }, [groups, variables]);

    const correctTerms = useMemo(() => derivationSteps.map(d => d.term), [derivationSteps]);

    const normalize = (s: string) => s.toUpperCase().replace(/\s/g, '').replace(/!/g, "'").replace(/~/g, "'").replace(/&/g, '').replace(/\*/g, '');

    const handleInput = (idx: number, val: string) => {
        setInputs(prev => ({ ...prev, [idx]: val }));
        if (normalize(val) === normalize(correctTerms[idx])) {
            setFeedback(prev => ({ ...prev, [idx]: true }));
        } else {
            setFeedback(prev => ({ ...prev, [idx]: false }));
        }
    };

    const allCorrect = groups.length > 0 && groups.every((_, i) => feedback[i]);

    return (
        <div style={{ padding: '0 40px', maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ textAlign: 'center' }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 8 }}>
                    Scene 5.4 — Simplification
                </span>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 8 }}>Deriving the Expression</h2>
                <p style={{ color: T.muted, fontSize: 14 }}>
                    For each highlighted group, identify the variables that remain constant. <br />
                    Type the simplified product term. Use <code style={{ color: T.accent, background: 'rgba(0,212,255,0.1)', padding: '2px 6px', borderRadius: 4 }}>A'</code> or <code style={{ color: T.accent, background: 'rgba(0,212,255,0.1)', padding: '2px 6px', borderRadius: 4 }}>!A</code> for NOT A.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {groups.map((group, idx) => {
                    const color = GROUP_COLORS[idx % GROUP_COLORS.length];
                    const isCorrect = feedback[idx];

                    return (
                        <div key={idx} style={{
                            background: T.card, border: `1px solid ${isCorrect ? T.success : T.border}`,
                            borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 20,
                            boxShadow: isCorrect ? '0 0 20px rgba(16,185,129,0.1)' : 'none',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                                {/* Group Preview */}
                                <div style={{
                                    width: 80, height: 60, background: color.bg, border: `1px solid ${color.border}`,
                                    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontFamily: T.mono, fontSize: 12, color: color.text, flexDirection: 'column', gap: 4
                                }}>
                                    <div>Group {idx + 1}</div>
                                    <div style={{ fontSize: 10, opacity: 0.8 }}>{group.length} cells</div>
                                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none" data-expr={expression}>
                                        <div style={{ backgroundImage: `radial-gradient(${T.accent} 1px, transparent 1px)`, backgroundSize: '32px 32px' }} className="w-full h-full" />
                                    </div>
                                </div>

                                <ChevronRight color={T.muted} />

                                {/* Variable Analysis */}
                                <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                                    {derivationSteps[idx].steps.map((s, si) => (
                                        <div key={si} style={{
                                            padding: '8px 12px', background: s.isConstant ? 'rgba(0,212,255,0.05)' : 'rgba(239,68,68,0.05)',
                                            border: `1px solid ${s.isConstant ? 'rgba(0,212,255,0.2)' : 'rgba(239,68,68,0.2)'}`,
                                            borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 40
                                        }}>
                                            <div style={{ fontSize: 10, color: s.isConstant ? T.accent : T.muted }}>{s.var}</div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: s.isConstant ? T.text : T.muted, textDecoration: s.isConstant ? 'none' : 'line-through' }}>
                                                {s.isConstant ? s.value : 'X'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                {/* Input Field */}
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={inputs[idx] || ''}
                                        onChange={e => handleInput(idx, e.target.value)}
                                        placeholder="Type the product term..."
                                        disabled={isCorrect}
                                        style={{
                                            width: '100%', background: T.surface, border: `1px solid ${isCorrect ? T.success : T.border}`,
                                            padding: '12px 16px', borderRadius: 8, color: T.text, fontFamily: T.mono, fontSize: 16,
                                            outline: 'none', transition: 'border-color 0.2s', letterSpacing: '0.1em'
                                        }}
                                    />
                                    <AnimatePresence>
                                        {isCorrect && (
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                                style={{ position: 'absolute', right: 16, top: 12, color: T.success }}
                                            >
                                                <CheckCircle2 size={24} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <AnimatePresence>
                {allCorrect && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 24 }}
                    >
                        <div style={{ fontFamily: T.mono, fontSize: 18, color: T.accent, letterSpacing: '0.1em', textAlign: 'center' }}>
                            Final Expression: <br />
                            <span style={{ fontSize: 24, fontWeight: 700, color: T.text, marginTop: 8, display: 'block' }}>
                                F = {correctTerms.join(' + ')}
                            </span>
                        </div>
                        <button
                            onClick={onComplete}
                            className="vl-hover-lift"
                            style={{
                                padding: '12px 32px', background: T.accent, color: '#000', border: 'none',
                                borderRadius: 8, fontFamily: T.mono, fontSize: 14, fontWeight: 700,
                                cursor: 'pointer', letterSpacing: '0.1em', marginTop: 16
                            }}
                        >
                            COMPARE CIRCUITS &rarr;
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
