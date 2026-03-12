/**
 * LogicPuzzle.tsx — Level 4, Scene 4.4
 * 5 progressive challenges: build circuits that match a target truth table using gates.
 * Simple drag-from-palette approach using inline state (no external DnD library needed).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw, Play } from 'lucide-react';
import { GATE_META, type GateId } from '../../utils/gateMeta';

const T = {
    card: '#0D0F16', surface: '#1A1D24', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'JetBrains Mono', monospace",
};

// ── Puzzle Definitions ────────────────────────────────────────────────────────

interface Puzzle {
    id: number;
    title: string;
    description: string;
    hint: string;
    allowedGates: GateId[];
    // Truth table: [A, B] → expected Y
    rows: Array<{ a: boolean; b: boolean; y: boolean }>;
    solution: GateId[]; // one valid solution (for verify logic)
}

const PUZZLES: Puzzle[] = [
    {
        id: 1,
        title: 'The AND Challenge',
        description: 'Build a circuit that outputs 1 ONLY when BOTH A and B are 1.',
        hint: 'You need a single two-input gate.',
        allowedGates: ['AND', 'OR', 'NAND', 'NOR'],
        solution: ['AND'],
        rows: [
            { a: false, b: false, y: false },
            { a: false, b: true, y: false },
            { a: true, b: false, y: false },
            { a: true, b: true, y: true },
        ],
    },
    {
        id: 2,
        title: 'OR vs NOR',
        description: 'Output 1 when A is 1 or B is 1 (but NOT when both are 0).',
        hint: 'This is the definition of OR.',
        allowedGates: ['OR', 'NOR', 'AND', 'XOR'],
        solution: ['OR'],
        rows: [
            { a: false, b: false, y: false },
            { a: false, b: true, y: true },
            { a: true, b: false, y: true },
            { a: true, b: true, y: true },
        ],
    },
    {
        id: 3,
        title: 'Parity Detector',
        description: 'Output 1 when A and B are DIFFERENT values.',
        hint: 'Think about which gate detects "inequality".',
        allowedGates: ['XOR', 'XNOR', 'AND', 'OR', 'NOT'],
        solution: ['XOR'],
        rows: [
            { a: false, b: false, y: false },
            { a: false, b: true, y: true },
            { a: true, b: false, y: true },
            { a: true, b: true, y: false },
        ],
    },
    {
        id: 4,
        title: 'All-Zero Detector',
        description: 'Output 1 ONLY when both A and B are 0.',
        hint: 'NOR is the natural choice — but think why.',
        allowedGates: ['NOR', 'NAND', 'AND', 'OR', 'NOT', 'XOR'],
        solution: ['NOR'],
        rows: [
            { a: false, b: false, y: true },
            { a: false, b: true, y: false },
            { a: true, b: false, y: false },
            { a: true, b: true, y: false },
        ],
    },
    {
        id: 5,
        title: 'Equality Comparator',
        description: 'Output 1 when A and B are the SAME value (both 0 or both 1).',
        hint: 'XNOR — or XOR followed by NOT.',
        allowedGates: ['XNOR', 'XOR', 'NOT', 'AND', 'OR'],
        solution: ['XNOR'],
        rows: [
            { a: false, b: false, y: true },
            { a: false, b: true, y: false },
            { a: true, b: false, y: false },
            { a: true, b: true, y: true },
        ],
    },
];

// ── Puzzle verification: simulate selected gates against truth table ────────────

function verify(puzzle: Puzzle, selectedGates: GateId[]): { pass: boolean; failRow: number | null } {
    if (selectedGates.length === 0) return { pass: false, failRow: 0 };

    for (let i = 0; i < puzzle.rows.length; i++) {
        const row = puzzle.rows[i];
        let result: boolean;

        if (selectedGates.length === 1) {
            const meta = GATE_META[selectedGates[0]];
            result = meta.inputs === 1
                ? meta.evaluate([row.a])
                : meta.evaluate([row.a, row.b]);
        } else {
            // Chain: first gate takes [A, B], subsequent gates invert/buffer
            result = GATE_META[selectedGates[0]].evaluate([row.a, row.b]);
            for (let g = 1; g < selectedGates.length; g++) {
                result = GATE_META[selectedGates[g]].evaluate([result]);
            }
        }

        if (result !== row.y) return { pass: false, failRow: i };
    }
    return { pass: true, failRow: null };
}

// ── Component ──────────────────────────────────────────────────────────────────

interface Props { onAllComplete: () => void; onSolve: () => void; }

export const LogicPuzzle: React.FC<Props> = ({ onAllComplete, onSolve }) => {
    const [activePuzzle, setActivePuzzle] = useState(0);
    const [solvedPuzzles, setSolvedPuzzles] = useState<Set<number>>(new Set());
    const [selectedGates, setSelectedGates] = useState<GateId[]>([]);
    const [result, setResult] = useState<{ pass: boolean; failRow: number | null } | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [verifyingRow, setVerifyingRow] = useState<number | null>(null);

    const puzzle = PUZZLES[activePuzzle];

    const handleVerify = () => {
        if (selectedGates.length === 0) return;
        setResult(null);
        setVerifyingRow(0);

        let currentRow = 0;
        const interval = setInterval(() => {
            const partialResult = verify({ ...puzzle, rows: [puzzle.rows[currentRow]] }, selectedGates);
            if (!partialResult.pass) {
                clearInterval(interval);
                setVerifyingRow(null);
                setResult({ pass: false, failRow: currentRow });
                return;
            }

            currentRow++;
            if (currentRow >= puzzle.rows.length) {
                clearInterval(interval);
                setVerifyingRow(null);
                setResult({ pass: true, failRow: null });
                if (!solvedPuzzles.has(puzzle.id)) {
                    const next = new Set([...solvedPuzzles, puzzle.id]);
                    setSolvedPuzzles(next);
                    onSolve();
                    if (next.size >= PUZZLES.length) onAllComplete();
                }
            } else {
                setVerifyingRow(currentRow);
            }
        }, 400); // Step through rows every 400ms for dramatic effect
    };

    const handleReset = () => { setSelectedGates([]); setResult(null); setShowHint(false); };

    const addGate = (id: GateId) => {
        setSelectedGates(prev => prev.length < 3 ? [...prev, id] : prev);
        setResult(null);
    };

    const removeGate = (idx: number) => {
        setSelectedGates(prev => prev.filter((_, i) => i !== idx));
        setResult(null);
    };

    return (
        <div style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 8 }}>
                    Scene 4.4 — Logic Puzzle Arena
                </span>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 8 }}>Build the Circuit</h2>
                <p style={{ color: T.muted, fontSize: 14 }}>
                    Match the truth table by selecting the right gate(s).
                    <span style={{ marginLeft: 8, color: T.success }}>{solvedPuzzles.size}/{PUZZLES.length} solved</span>
                </p>
            </div>

            {/* Puzzle tabs */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
                {PUZZLES.map((p, i) => (
                    <button key={p.id} onClick={() => { setActivePuzzle(i); handleReset(); }}
                        style={{
                            padding: '6px 14px', fontFamily: T.mono, fontSize: 9, letterSpacing: '0.12em',
                            textTransform: 'uppercase', borderRadius: 4, cursor: 'pointer',
                            background: activePuzzle === i ? 'rgba(0,212,255,0.1)' : 'transparent',
                            border: `1px solid ${activePuzzle === i ? T.accent : solvedPuzzles.has(p.id) ? `${T.success}50` : T.border}`,
                            color: activePuzzle === i ? T.accent : solvedPuzzles.has(p.id) ? T.success : T.muted,
                        }}>
                        {solvedPuzzles.has(p.id) ? '✓' : `#${p.id}`}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Left: Puzzle info + truth table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ padding: 20, background: T.card, border: `1px solid ${T.border}`, borderRadius: 10 }}>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 10 }}>
                            Puzzle {puzzle.id} of {PUZZLES.length}
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>{puzzle.title}</h3>
                        <p style={{ fontFamily: T.mono, fontSize: 12, color: T.muted, lineHeight: 1.7 }}>{puzzle.description}</p>

                        <button onClick={() => setShowHint(v => !v)}
                            style={{ marginTop: 12, fontFamily: T.mono, fontSize: 9, color: T.warning, background: 'transparent', border: `1px solid ${T.warning}30`, borderRadius: 4, padding: '4px 10px', cursor: 'pointer', letterSpacing: '0.12em' }}>
                            {showHint ? 'Hide Hint' : 'Show Hint'}
                        </button>
                        <AnimatePresence>
                            {showHint && (
                                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                    style={{ fontFamily: T.mono, fontSize: 11, color: T.warning, marginTop: 8, lineHeight: 1.6 }}>
                                    💡 {puzzle.hint}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Target truth table */}
                    <div style={{ padding: 18, background: T.card, border: `1px solid ${T.border}`, borderRadius: 10 }}>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>Target Output</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, borderBottom: `1px solid ${T.border}`, paddingBottom: 8, marginBottom: 8 }}>
                            {['A', 'B', 'Y'].map(h => <span key={h} style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, textAlign: 'center' }}>{h}</span>)}
                        </div>
                        {puzzle.rows.map((row, i) => {
                            const fail = result && !result.pass && result.failRow === i;
                            const isVerifying = verifyingRow === i;
                            const isPassed = result?.pass || (verifyingRow !== null && verifyingRow > i) || (fail === false && result?.failRow !== null && result!.failRow! > i);

                            return (
                                <div key={i} style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, padding: '8px 0',
                                    borderRadius: 4,
                                    background: fail ? 'rgba(239,68,68,0.1)' : isVerifying ? 'rgba(0,212,255,0.1)' : isPassed ? 'rgba(16,185,129,0.05)' : 'transparent',
                                    border: isVerifying ? `1px solid rgba(0,212,255,0.3)` : fail ? `1px solid rgba(239,68,68,0.3)` : '1px solid transparent',
                                    transition: 'all 0.2s',
                                }}>
                                    <span style={{ fontFamily: T.mono, fontSize: 16, textAlign: 'center', color: row.a ? T.accent : T.muted }}>{row.a ? 1 : 0}</span>
                                    <span style={{ fontFamily: T.mono, fontSize: 16, textAlign: 'center', color: row.b ? T.accent : T.muted }}>{row.b ? 1 : 0}</span>
                                    <span style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 800, textAlign: 'center', color: row.y ? T.success : T.muted }}>{row.y ? 1 : 0}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Gate palette + circuit builder */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Gate palette */}
                    <div style={{ padding: 18, background: T.card, border: `1px solid ${T.border}`, borderRadius: 10 }}>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>
                            Select Gates (max 3)
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {puzzle.allowedGates.map(id => {
                                const meta = GATE_META[id];
                                return (
                                    <motion.button key={id} onClick={() => addGate(id)} whileTap={{ scale: 0.93 }}
                                        style={{
                                            padding: '8px 14px', fontFamily: T.mono, fontSize: 10, fontWeight: 700,
                                            letterSpacing: '0.12em', borderRadius: 6, cursor: 'pointer',
                                            background: meta.accentBg, border: `1px solid ${meta.color}40`,
                                            color: meta.color, transition: 'all 0.15s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = meta.color)}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = `${meta.color}40`)}>
                                        + {id}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Circuit builder: selected gates */}
                    <div style={{ padding: 18, background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, minHeight: 120 }}>
                        <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>
                            Your Circuit
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 60, flexWrap: 'wrap' }}>
                            {selectedGates.length === 0 ? (
                                <span style={{ fontFamily: T.mono, fontSize: 11, color: T.muted }}>Click gates above to add them here…</span>
                            ) : (
                                <>
                                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.muted }}>A,B →</span>
                                    {selectedGates.map((id, i) => {
                                        const meta = GATE_META[id];
                                        return (
                                            <React.Fragment key={i}>
                                                <motion.button onClick={() => removeGate(i)} initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                    style={{
                                                        padding: '8px 12px', fontFamily: T.mono, fontSize: 11, fontWeight: 800,
                                                        borderRadius: 6, cursor: 'pointer', color: meta.color,
                                                        background: meta.accentBg, border: `1px solid ${meta.color}`,
                                                    }}
                                                    title="Click to remove">
                                                    {id}
                                                </motion.button>
                                                {i < selectedGates.length - 1 && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.muted }}>→</span>}
                                            </React.Fragment>
                                        );
                                    })}
                                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.muted }}>→ Y</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Verify / result */}
                    <div style={{ display: 'flex', gap: 10 }}>
                        <motion.button onClick={handleVerify} disabled={selectedGates.length === 0 || verifyingRow !== null} whileTap={{ scale: 0.96 }}
                            style={{
                                flex: 1, padding: '12px 0', fontFamily: T.mono, fontSize: 10, fontWeight: 800,
                                letterSpacing: '0.18em', textTransform: 'uppercase', borderRadius: 6, cursor: 'pointer',
                                background: verifyingRow !== null ? 'rgba(0,212,255,0.04)' : 'rgba(0,212,255,0.08)',
                                border: `1px solid rgba(0,212,255,0.3)`, color: T.accent,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                opacity: selectedGates.length === 0 ? 0.4 : 1,
                            }}>
                            <Play size={13} /> {verifyingRow !== null ? 'Verifying...' : 'Verify Circuit'}
                        </motion.button>
                        <button onClick={handleReset} disabled={verifyingRow !== null} style={{
                            padding: '12px 16px', fontFamily: T.mono, fontSize: 9, borderRadius: 6, cursor: 'pointer',
                            background: 'transparent', border: `1px solid ${T.border}`, color: T.muted,
                            display: 'flex', alignItems: 'center', gap: 4, opacity: verifyingRow !== null ? 0.4 : 1,
                        }}>
                            <RotateCcw size={11} />
                        </button>
                    </div>

                    {/* Result panel */}
                    <AnimatePresence>
                        {result && (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                style={{
                                    padding: 14, borderRadius: 8,
                                    background: result.pass ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                                    border: `1px solid ${result.pass ? `${T.success}50` : `${T.error}50`}`,
                                }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {result.pass
                                        ? <CheckCircle2 size={16} style={{ color: T.success }} />
                                        : <XCircle size={16} style={{ color: T.error }} />}
                                    <span style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, color: result.pass ? T.success : T.error }}>
                                        {result.pass ? 'Circuit verified. All truth table rows match.' : `Mismatch at row ${(result.failRow ?? 0) + 1}. Check that input combination.`}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
