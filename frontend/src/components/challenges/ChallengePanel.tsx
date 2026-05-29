/**
 * ChallengePanel.tsx - Hardware LeetCode challenge interface
 *
 * Shows challenge details, truth table, timer, and submission results.
 * Provides a LeetCode-style split view with problem on left, workspace on right.
 */

import { useState, useCallback, useEffect, useRef, memo } from 'react';
import type { HardwareChallenge, ChallengeResult } from '../../engines/challenges/ChallengeEngine';

interface ChallengePanelProps {
    challenge: HardwareChallenge;
    onSubmit: (circuitData: string) => ChallengeResult;
    onBack: () => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
    easy: '#10B981',
    medium: '#F59E0B',
    hard: '#EF4444',
    expert: '#8B5CF6',
};

export const ChallengePanel = memo(({ challenge, onSubmit, onBack }: ChallengePanelProps) => {
    const [elapsed, setElapsed] = useState(0);
    const [result, setResult] = useState<ChallengeResult | null>(null);
    const [hintIndex, setHintIndex] = useState(-1);
    const timerRef = useRef<ReturnType<typeof setInterval>>();

    // Timer
    useEffect(() => {
        timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    const handleSubmit = useCallback(() => {
        clearInterval(timerRef.current);
        const res = onSubmit('{}');
        setResult(res);
    }, [onSubmit]);

    const handleRevealHint = useCallback(() => {
        setHintIndex(i => Math.min(i + 1, challenge.hints.length - 1));
    }, [challenge.hints.length]);

    const diffColor = DIFFICULTY_COLORS[challenge.difficulty] || '#6B7280';

    return (
        <div className="challenge-panel-root" style={{
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 8,
                padding: '8px 12px',
                minHeight: 44,
                borderBottom: '1px solid rgba(0, 212, 255, 0.06)',
            }}>
                <button onClick={onBack} style={backBtnStyle}>← Back</button>
                <h3 style={{ margin: 0, color: '#e6edf3', fontSize: 13, fontWeight: 700, flex: 1 }}>
                    {challenge.title}
                </h3>
                <span style={{
                    fontSize: 8,
                    padding: '2px 6px',
                    border: `1px solid ${diffColor}30`,
                    color: diffColor,
                    borderRadius: 3,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                }}>
                    {challenge.difficulty}
                </span>
                <span style={{ color: '#F59E0B', fontSize: 10 }}>
                    ⏱ {formatTime(elapsed)}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9 }}>
                    💎 {challenge.xpReward} XP
                </span>
            </div>

            {/* Content - stacks vertically on mobile, side-by-side on lg+ */}
            <div className="flex flex-col lg:flex-row" style={{ flex: 1, overflow: 'auto' }}>
                {/* Problem Panel */}
                <div className="lg:w-1/2 overflow-y-auto" style={{
                    borderRight: '1px solid rgba(0, 212, 255, 0.06)',
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    borderBottom: '1px solid rgba(0, 212, 255, 0.06)',
                }}>
                    {/* Description */}
                    <div>
                        <SectionTitle>Description</SectionTitle>
                        <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>
                            {challenge.description}
                        </p>
                    </div>

                    {/* I/O */}
                    <div style={{ display: 'flex', gap: 16 }}>
                        <div>
                            <SectionTitle>Inputs</SectionTitle>
                            <div style={{ display: 'flex', gap: 4 }}>
                                {challenge.inputSignals.map(s => (
                                    <SignalBadge key={s} name={s} type="input" />
                                ))}
                            </div>
                        </div>
                        <div>
                            <SectionTitle>Outputs</SectionTitle>
                            <div style={{ display: 'flex', gap: 4 }}>
                                {challenge.outputSignals.map(s => (
                                    <SignalBadge key={s} name={s} type="output" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Truth Table */}
                    {challenge.truthTable.length > 0 && (
                        <div>
                            <SectionTitle>Truth Table</SectionTitle>
                            <TruthTableView
                                inputs={challenge.inputSignals}
                                outputs={challenge.outputSignals}
                                rows={challenge.truthTable}
                                failedRows={result?.failedRows}
                            />
                        </div>
                    )}

                    {/* Constraints */}
                    {challenge.constraints.length > 0 && (
                        <div>
                            <SectionTitle>Constraints</SectionTitle>
                            <ul style={{ margin: 0, paddingLeft: 16, color: 'rgba(255,255,255,0.4)', fontSize: 10, lineHeight: 1.8 }}>
                                {challenge.constraints.map((c, i) => <li key={i}>{c}</li>)}
                                {challenge.gateLimit > 0 && <li>Maximum gates: {challenge.gateLimit}</li>}
                                {challenge.timeLimit > 0 && <li>Time limit: {formatTime(challenge.timeLimit)}</li>}
                            </ul>
                        </div>
                    )}

                    {/* Hints */}
                    <div>
                        <SectionTitle>
                            Hints ({hintIndex + 1}/{challenge.hints.length})
                            <button onClick={handleRevealHint} disabled={hintIndex >= challenge.hints.length - 1} style={hintBtnStyle}>
                                💡 Reveal
                            </button>
                        </SectionTitle>
                        {Array.from({ length: hintIndex + 1 }, (_, i) => (
                            <div key={i} style={{
                                padding: '6px 8px',
                                background: 'rgba(245, 158, 11, 0.04)',
                                border: '1px solid rgba(245, 158, 11, 0.1)',
                                borderRadius: 4,
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: 10,
                                marginTop: 4,
                            }}>
                                💡 {challenge.hints[i]}
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: 9, marginTop: 8 }}>
                        Solved by {challenge.solvedCount} users · {Math.round(challenge.acceptanceRate * 100)}% acceptance
                    </div>
                </div>

                {/* Workspace Panel */}
                <div className="lg:w-1/2" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    minHeight: 200,
                }}>
                    {/* Workspace placeholder */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255,255,255,0.08)',
                        fontSize: 13,
                    }}>
                        Circuit workspace will be connected here
                    </div>

                    {/* Submit Bar */}
                    <div style={{
                        padding: '8px 12px',
                        borderTop: '1px solid rgba(0, 212, 255, 0.06)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 8,
                        alignItems: 'center',
                    }}>
                        <button onClick={handleSubmit} style={submitBtnStyle}>
                            🚀 Submit Solution
                        </button>

                        {result && (
                            <ResultBadge result={result} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

ChallengePanel.displayName = 'ChallengePanel';

// ─── Truth Table ─────────────────────────────────────────────────────────

import type { TruthTableRow } from '../../engines/challenges/ChallengeEngine';

const TruthTableView = memo(({ inputs, outputs, rows, failedRows }: {
    inputs: string[];
    outputs: string[];
    rows: TruthTableRow[];
    failedRows?: TruthTableRow[];
}) => {
    const failedSet = new Set((failedRows || []).map(r => JSON.stringify(r.inputs)));

    return (
        <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 10,
            fontFamily: "'IBM Plex Mono', monospace",
        }}>
            <thead>
                <tr>
                    {inputs.map(s => (
                        <th key={s} style={thStyle('#00D4FF')}>{s}</th>
                    ))}
                    {outputs.map(s => (
                        <th key={s} style={thStyle('#10B981')}>{s}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, i) => {
                    const isFailed = failedSet.has(JSON.stringify(row.inputs));
                    return (
                        <tr key={i} style={{
                            background: isFailed ? 'rgba(239, 68, 68, 0.06)' : 'transparent',
                        }}>
                            {inputs.map(s => (
                                <td key={s} style={tdStyle}>{row.inputs[s] ? '1' : '0'}</td>
                            ))}
                            {outputs.map(s => (
                                <td key={s} style={{
                                    ...tdStyle,
                                    color: isFailed ? '#EF4444' : '#10B981',
                                    fontWeight: 600,
                                }}>
                                    {row.expectedOutputs[s] ? '1' : '0'}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
});

TruthTableView.displayName = 'TruthTableView';

// ─── Result Badge ────────────────────────────────────────────────────────

const ResultBadge = memo(({ result }: { result: ChallengeResult }) => (
    <div style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        padding: '4px 10px',
        background: result.passed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
        border: `1px solid ${result.passed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
        borderRadius: 4,
    }}>
        <span style={{ fontSize: 14 }}>{result.passed ? '✅' : '❌'}</span>
        <span style={{ color: result.passed ? '#10B981' : '#EF4444', fontWeight: 600, fontSize: 11 }}>
            {result.passed ? 'ACCEPTED' : 'WRONG ANSWER'}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>
            {result.passedRows}/{result.totalRows} rows
        </span>
        {result.passed && (
            <span style={{ color: '#F59E0B', fontSize: 9 }}>
                +{result.xpEarned} XP · Score: {result.score}
            </span>
        )}
        {result.badges.length > 0 && (
            <span style={{ fontSize: 10 }}>
                {result.badges.includes('speed_demon') && '⚡'}
                {result.badges.includes('minimalist') && '🎯'}
                {result.badges.includes('optimal') && '💎'}
            </span>
        )}
    </div>
));

ResultBadge.displayName = 'ResultBadge';

// ─── Sub-components ──────────────────────────────────────────────────────

const SectionTitle = memo(({ children }: { children: React.ReactNode }) => (
    <div style={{
        color: 'rgba(0, 212, 255, 0.4)',
        fontSize: 9,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    }}>
        {children}
    </div>
));

SectionTitle.displayName = 'SectionTitle';

const SignalBadge = memo(({ name, type }: { name: string; type: 'input' | 'output' }) => (
    <span style={{
        fontSize: 10,
        padding: '2px 6px',
        background: type === 'input' ? 'rgba(0, 212, 255, 0.06)' : 'rgba(16, 185, 129, 0.06)',
        border: `1px solid ${type === 'input' ? 'rgba(0, 212, 255, 0.15)' : 'rgba(16, 185, 129, 0.15)'}`,
        color: type === 'input' ? '#00D4FF' : '#10B981',
        borderRadius: 3,
        fontWeight: 600,
    }}>
        {name}
    </span>
));

SignalBadge.displayName = 'SignalBadge';

// ─── Helpers ─────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── Styles ──────────────────────────────────────────────────────────────

const backBtnStyle: React.CSSProperties = {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    padding: '3px 8px',
    borderRadius: 3,
    cursor: 'pointer',
    fontFamily: "'IBM Plex Mono', monospace",
};

const submitBtnStyle: React.CSSProperties = {
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    color: '#10B981',
    fontSize: 11,
    fontWeight: 700,
    padding: '6px 16px',
    borderRadius: 4,
    cursor: 'pointer',
    fontFamily: "'IBM Plex Mono', monospace",
    transition: 'all 100ms',
};

const hintBtnStyle: React.CSSProperties = {
    background: 'rgba(245, 158, 11, 0.06)',
    border: '1px solid rgba(245, 158, 11, 0.15)',
    color: '#F59E0B',
    fontSize: 8,
    padding: '1px 6px',
    borderRadius: 2,
    cursor: 'pointer',
    fontFamily: "'IBM Plex Mono', monospace",
    marginLeft: 8,
};

function thStyle(color: string): React.CSSProperties {
    return {
        padding: '4px 8px',
        color,
        fontSize: 9,
        fontWeight: 700,
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        letterSpacing: '0.05em',
    };
}

const tdStyle: React.CSSProperties = {
    padding: '3px 8px',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    borderBottom: '1px solid rgba(255,255,255,0.02)',
};
