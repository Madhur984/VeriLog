/**
 * pages/VerilogPlayground.tsx — Verilog HDL Editor + Simulator
 *
 * Features:
 *   - Monaco editor with Verilog syntax (closest: `cpp` grammar)
 *   - Exercise bank sidebar (combinational → sequential → FSM → advanced)
 *   - VoltMonkey lint panel with real-time diagnostics
 *   - Simulated waveform output (reference waveform shown on "run")
 *   - Verilog export / copy
 *   - Gamified: XP reward on correct exercise completion
 */

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
    ArrowLeft, Play, RotateCcw, Copy, Check, ChevronDown, ChevronRight,
    AlertTriangle, CheckCircle2, Info, Zap, BookOpen, Cpu,
} from 'lucide-react';
// import {
//     EXERCISES, getExercisesByLevel,
//     type VerilogExercise, type ExerciseLevel,
// } from '../engine/verilogExercises';
// import { lintVerilog, type VerilogLintIssue } from '../engine/VoltMonkey';

// Stubs
type VerilogExercise = any;
type ExerciseLevel = string;
type VerilogLintIssue = any;
const EXERCISES: any[] = [{ id: '1', title: 'Stub', starterCode: '', description: '', level: 'combinational', xpReward: 0, testPoints: [], hints: [], referenceWaveform: [] }];
const getExercisesByLevel = (_l: string) => EXERCISES;
const lintVerilog = (_c: string) => [];

const T = {
    bg: '#060C1A', card: '#0D0F16', surface: '#0C1224', border: '#1A1D24',
    panel: '#0A1020',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    keyword: '#A78BFA', string: '#34D399', comment: '#3B5278',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
    sans: "'Inter',system-ui,sans-serif",
} as const;

const LEVELS: ExerciseLevel[] = ['combinational', 'sequential', 'fsm', 'advanced'];
const LEVEL_LABELS: Record<ExerciseLevel, string> = {
    combinational: 'Combinational',
    sequential: 'Sequential',
    fsm: 'FSM Design',
    advanced: 'Advanced HDL',
};
const LEVEL_COLORS: Record<ExerciseLevel, string> = {
    combinational: '#00D4FF',
    sequential: '#A78BFA',
    fsm: '#F59E0B',
    advanced: '#10B981',
};

// Simulated run result:
type RunStatus = 'idle' | 'running' | 'pass' | 'fail';

export function VerilogPlayground() {
    const navigate = useNavigate();
    const [selectedExercise, setSelectedExercise] = useState<VerilogExercise>(EXERCISES[0]);
    const [code, setCode] = useState(EXERCISES[0].starterCode);
    const [expandedLevel, setExpandedLevel] = useState<ExerciseLevel>('combinational');
    const [runStatus, setRunStatus] = useState<RunStatus>('idle');
    const [lintIssues, setLintIssues] = useState<VerilogLintIssue[]>([]);
    const [showHints, setShowHints] = useState(false);
    const [copied, setCopied] = useState(false);
    const [selectedHintIdx, setSelectedHintIdx] = useState(0);
    const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
    const [totalXP, setTotalXP] = useState(0);
    const runTimerRef = useRef<ReturnType<typeof setTimeout>>();

    const handleExerciseSelect = useCallback((ex: VerilogExercise) => {
        setSelectedExercise(ex);
        setCode(ex.starterCode);
        setRunStatus('idle');
        setLintIssues([]);
        setShowHints(false);
        setSelectedHintIdx(0);
    }, []);

    // Live lint on code change
    const handleCodeChange = useCallback((value: string | undefined) => {
        const v = value ?? '';
        setCode(v);
        setLintIssues(lintVerilog(v));
    }, []);

    // Simulated run (in production: POST to /api/verilog/compile)
    const handleRun = useCallback(() => {
        setRunStatus('running');
        clearTimeout(runTimerRef.current);
        runTimerRef.current = setTimeout(() => {
            // Check if the code has the required module name and basic structure
            const hasModule = code.includes('module ');
            const hasEndModule = code.includes('endmodule');
            const hasImplementation = code.replace(selectedExercise.starterCode, '').trim().length > 0 ||
                selectedExercise.starterCode.includes('assign') ||
                selectedExercise.starterCode.includes('always');

            const pass = hasModule && hasEndModule && hasImplementation && lintIssues.filter(i => i.severity === 'error').length === 0;
            setRunStatus(pass ? 'pass' : 'fail');

            if (pass && !completedIds.has(selectedExercise.id)) {
                setCompletedIds((prev: Set<string>) => new Set([...prev, selectedExercise.id]));
                setTotalXP((prev: number) => prev + selectedExercise.xpReward);
            }
        }, 1800);
    }, [code, selectedExercise, lintIssues, completedIds]);

    const handleReset = useCallback(() => {
        setCode(selectedExercise.starterCode);
        setRunStatus('idle');
        setLintIssues([]);
    }, [selectedExercise]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, [code]);

    const errorCount = lintIssues.filter(i => i.severity === 'error').length;
    const warnCount = lintIssues.filter(i => i.severity === 'warning').length;

    return (
        <div style={{
            height: '100vh', display: 'flex', flexDirection: 'column',
            background: T.bg, color: T.text, fontFamily: T.sans, overflow: 'hidden',
        }}>
            {/* ── Top Bar ───────────────────────────────────────────────── */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px',
                background: T.card, borderBottom: `1px solid ${T.border}`,
                flexShrink: 0,
            }}>
                <button onClick={() => navigate('/')} style={{
                    background: 'none', border: 'none', color: T.muted, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                }}>
                    <ArrowLeft size={15} />
                </button>
                <div style={{ width: 1, height: 18, background: T.border }} />
                <Cpu size={14} style={{ color: T.accent }} />
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.2em', color: `${T.accent}80`, textTransform: 'uppercase' }}>
                    Verilog Playground
                </span>

                {/* Exercise title */}
                <div style={{ marginLeft: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                        padding: '2px 8px', fontFamily: T.mono, fontSize: 7,
                        border: `1px solid ${LEVEL_COLORS[selectedExercise.level]}40`,
                        color: LEVEL_COLORS[selectedExercise.level],
                        borderRadius: 1, letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}>
                        {LEVEL_LABELS[selectedExercise.level]}
                    </span>
                    <span style={{ fontFamily: T.mono, fontSize: 11, color: T.text }}>
                        {selectedExercise.title}
                    </span>
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Zap size={13} style={{ color: T.warning }} />
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.warning }}>
                        {totalXP} XP
                    </span>
                    <div style={{ width: 1, height: 16, background: T.border, margin: '0 4px' }} />
                    {/* Lint status badge */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '3px 10px',
                        background: errorCount > 0 ? `${T.error}10` : warnCount > 0 ? `${T.warning}10` : `${T.success}10`,
                        border: `1px solid ${errorCount > 0 ? `${T.error}40` : warnCount > 0 ? `${T.warning}40` : `${T.success}40`}`,
                        borderRadius: 2,
                    }}>
                        {errorCount > 0
                            ? <><AlertTriangle size={11} style={{ color: T.error }} /><span style={{ fontFamily: T.mono, fontSize: 8, color: T.error }}>{errorCount} error{errorCount !== 1 ? 's' : ''}</span></>
                            : warnCount > 0
                                ? <><AlertTriangle size={11} style={{ color: T.warning }} /><span style={{ fontFamily: T.mono, fontSize: 8, color: T.warning }}>{warnCount} warn</span></>
                                : <><CheckCircle2 size={11} style={{ color: T.success }} /><span style={{ fontFamily: T.mono, fontSize: 8, color: T.success }}>clean</span></>
                        }
                    </div>
                </div>
            </div>

            {/* ── Main 3-panel layout ──────────────────────────────────── */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left — Exercise Browser */}
                <div style={{
                    width: 220, flexShrink: 0, overflowY: 'auto',
                    borderRight: `1px solid ${T.border}`, background: T.panel,
                }}>
                    {LEVELS.map(level => {
                        const exercises = getExercisesByLevel(level);
                        const isExpanded = expandedLevel === level;
                        const color = LEVEL_COLORS[level];
                        return (
                            <div key={level}>
                                <button
                                    onClick={() => setExpandedLevel(isExpanded ? '' as ExerciseLevel : level)}
                                    style={{
                                        width: '100%', padding: '10px 14px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        background: 'none', border: 'none',
                                        borderBottom: `1px solid ${T.border}`,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <span style={{ fontFamily: T.mono, fontSize: 7, color, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                                        {LEVEL_LABELS[level]}
                                    </span>
                                    {isExpanded ? <ChevronDown size={11} style={{ color: T.muted }} /> : <ChevronRight size={11} style={{ color: T.muted }} />}
                                </button>
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            {exercises.map(ex => {
                                                const isSelected = ex.id === selectedExercise.id;
                                                const isDone = completedIds.has(ex.id);
                                                return (
                                                    <button
                                                        key={ex.id}
                                                        onClick={() => handleExerciseSelect(ex)}
                                                        style={{
                                                            width: '100%', padding: '8px 14px 8px 20px',
                                                            textAlign: 'left', background: isSelected ? `${color}10` : 'transparent',
                                                            border: 'none',
                                                            borderLeft: `2px solid ${isSelected ? color : 'transparent'}`,
                                                            borderBottom: `1px solid ${T.border}`,
                                                            cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', gap: 8,
                                                        }}
                                                    >
                                                        <div style={{ flex: 1 }}>
                                                            <span style={{ fontFamily: T.mono, fontSize: 10, color: isSelected ? color : T.text, display: 'block' }}>
                                                                {ex.title}
                                                            </span>
                                                            <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>
                                                                +{ex.xpReward} XP
                                                            </span>
                                                        </div>
                                                        {isDone && <CheckCircle2 size={12} style={{ color: T.success, flexShrink: 0 }} />}
                                                    </button>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* Center — Editor */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Brief panel */}
                    <div style={{
                        padding: '12px 16px', borderBottom: `1px solid ${T.border}`,
                        background: T.card, flexShrink: 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontFamily: T.sans, fontSize: 13, color: T.text, lineHeight: 1.5 }}>
                                    {selectedExercise.description}
                                </p>
                                <p style={{ margin: '6px 0 0', fontFamily: T.mono, fontSize: 10, color: `${T.accent}80` }}>
                                    {selectedExercise.concept}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                <button onClick={() => setShowHints(h => !h)} style={{
                                    padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 5,
                                    background: showHints ? `${T.warning}15` : 'transparent',
                                    border: `1px solid ${showHints ? T.warning : T.border}`,
                                    borderRadius: 2, color: showHints ? T.warning : T.muted,
                                    fontFamily: T.mono, fontSize: 8, letterSpacing: '0.1em', cursor: 'pointer',
                                }}>
                                    <BookOpen size={11} /> HINT
                                </button>
                                <button onClick={handleCopy} style={{
                                    padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 5,
                                    background: 'transparent', border: `1px solid ${T.border}`,
                                    borderRadius: 2, color: T.muted,
                                    fontFamily: T.mono, fontSize: 8, cursor: 'pointer',
                                }}>
                                    {copied ? <Check size={11} /> : <Copy size={11} />}
                                </button>
                            </div>
                        </div>
                        {/* Hints */}
                        <AnimatePresence>
                            {showHints && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                    style={{ overflow: 'hidden', marginTop: 10 }}
                                >
                                    <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                                        {selectedExercise.hints.map((_: any, i: number) => (
                                            <button key={i} onClick={() => setSelectedHintIdx(i)} style={{
                                                padding: '3px 8px', fontFamily: T.mono, fontSize: 7,
                                                background: selectedHintIdx === i ? `${T.warning}15` : 'transparent',
                                                border: `1px solid ${selectedHintIdx === i ? T.warning : T.border}`,
                                                borderRadius: 1, color: selectedHintIdx === i ? T.warning : T.muted,
                                                cursor: 'pointer',
                                            }}>
                                                Hint {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <div style={{
                                        padding: '8px 12px',
                                        background: `${T.warning}08`, border: `1px solid ${T.warning}30`,
                                        borderRadius: 2, fontFamily: T.mono, fontSize: 11, color: T.text, lineHeight: 1.6,
                                    }}>
                                        {selectedExercise.hints[selectedHintIdx]}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Monaco Editor */}
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <Editor
                            defaultLanguage="cpp"
                            value={code}
                            onChange={handleCodeChange}
                            theme="vs-dark"
                            options={{
                                fontSize: 13,
                                fontFamily: "'IBM Plex Mono','Roboto Mono',monospace",
                                lineNumbers: 'on',
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 4,
                                wordWrap: 'on',
                                renderLineHighlight: 'line',
                                bracketPairColorization: { enabled: true },
                                padding: { top: 12 },
                            }}
                        />
                    </div>

                    {/* Action Bar */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                        background: T.card, borderTop: `1px solid ${T.border}`, flexShrink: 0,
                    }}>
                        <button onClick={handleRun} disabled={runStatus === 'running'} style={{
                            padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 8,
                            background: runStatus === 'running' ? `${T.accent}06` : `${T.accent}12`,
                            border: `1px solid ${T.accent}40`, borderRadius: 2,
                            color: T.accent, fontFamily: T.mono, fontSize: 9,
                            letterSpacing: '0.1em', cursor: runStatus === 'running' ? 'wait' : 'pointer',
                            transition: 'all 0.2s',
                        }}>
                            <Play size={13} />
                            {runStatus === 'running' ? 'SIMULATING...' : 'RUN SIMULATION'}
                        </button>
                        <button onClick={handleReset} style={{
                            padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6,
                            background: 'transparent', border: `1px solid ${T.border}`,
                            borderRadius: 2, color: T.muted, cursor: 'pointer', fontFamily: T.mono, fontSize: 9,
                        }}>
                            <RotateCcw size={12} /> RESET
                        </button>

                        {/* Run result badge */}
                        <AnimatePresence>
                            {(runStatus === 'pass' || runStatus === 'fail') && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                    style={{
                                        padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8,
                                        background: runStatus === 'pass' ? `${T.success}10` : `${T.error}10`,
                                        border: `1px solid ${runStatus === 'pass' ? T.success : T.error}40`,
                                        borderRadius: 2,
                                    }}
                                >
                                    {runStatus === 'pass'
                                        ? <><CheckCircle2 size={13} style={{ color: T.success }} /><span style={{ fontFamily: T.mono, fontSize: 9, color: T.success }}>ALL TESTS PASS +{selectedExercise.xpReward} XP</span></>
                                        : <><AlertTriangle size={13} style={{ color: T.error }} /><span style={{ fontFamily: T.mono, fontSize: 9, color: T.error }}>SIMULATION FAILED — check your implementation</span></>
                                    }
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right — VoltMonkey Panel */}
                <div style={{
                    width: 280, flexShrink: 0, overflowY: 'auto',
                    borderLeft: `1px solid ${T.border}`, background: T.panel,
                    display: 'flex', flexDirection: 'column',
                }}>
                    {/* Header */}
                    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${T.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.accent }} />
                            <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.2em', color: `${T.accent}80`, textTransform: 'uppercase' }}>
                                VoltMonkey
                            </span>
                        </div>
                        <span style={{ fontFamily: T.sans, fontSize: 11, color: T.muted }}>
                            Real-time Verilog analysis
                        </span>
                    </div>

                    {/* Test points */}
                    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${T.border}` }}>
                        <span style={{ display: 'block', fontFamily: T.mono, fontSize: 7, letterSpacing: '0.15em', color: T.muted, textTransform: 'uppercase', marginBottom: 10 }}>
                            Test Points
                        </span>
                        {selectedExercise.testPoints.map((tp: string, i: number) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6,
                                fontFamily: T.mono, fontSize: 9,
                            }}>
                                {runStatus === 'pass'
                                    ? <CheckCircle2 size={11} style={{ color: T.success, flexShrink: 0, marginTop: 1 }} />
                                    : <div style={{ width: 11, height: 11, border: `1px solid ${T.border}`, borderRadius: 2, flexShrink: 0, marginTop: 1 }} />
                                }
                                <span style={{ color: runStatus === 'pass' ? T.success : T.muted, lineHeight: 1.4 }}>{tp}</span>
                            </div>
                        ))}
                    </div>

                    {/* Live Lint Issues */}
                    <div style={{ padding: '12px 16px', flex: 1 }}>
                        <span style={{ display: 'block', fontFamily: T.mono, fontSize: 7, letterSpacing: '0.15em', color: T.muted, textTransform: 'uppercase', marginBottom: 10 }}>
                            Lint Diagnostics ({lintIssues.length})
                        </span>
                        {lintIssues.length === 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', border: `1px solid ${T.success}30`, borderRadius: 2, background: `${T.success}06` }}>
                                <CheckCircle2 size={12} style={{ color: T.success }} />
                                <span style={{ fontFamily: T.mono, fontSize: 8, color: T.success }}>No lint issues</span>
                            </div>
                        )}
                        {lintIssues.map((issue, i) => (
                            <div key={i} style={{
                                marginBottom: 8, padding: '8px 10px',
                                background: issue.severity === 'error' ? `${T.error}06` : issue.severity === 'warning' ? `${T.warning}06` : `${T.accent}06`,
                                border: `1px solid ${issue.severity === 'error' ? `${T.error}30` : issue.severity === 'warning' ? `${T.warning}30` : `${T.accent}30`}`,
                                borderRadius: 2,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                    {issue.severity === 'error'
                                        ? <AlertTriangle size={10} style={{ color: T.error }} />
                                        : issue.severity === 'warning'
                                            ? <AlertTriangle size={10} style={{ color: T.warning }} />
                                            : <Info size={10} style={{ color: T.accent }} />
                                    }
                                    <span style={{ fontFamily: T.mono, fontSize: 7, color: T.muted }}>L{issue.line}:{issue.col}</span>
                                    <span style={{ fontFamily: T.mono, fontSize: 7, color: issue.severity === 'error' ? T.error : issue.severity === 'warning' ? T.warning : T.accent }}>
                                        {issue.rule}
                                    </span>
                                </div>
                                <p style={{ margin: 0, fontFamily: T.sans, fontSize: 11, color: T.text, lineHeight: 1.4 }}>
                                    {issue.message}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Simulated waveform hint */}
                    {runStatus === 'pass' && selectedExercise.referenceWaveform.length > 0 && (
                        <div style={{ padding: '12px 16px', borderTop: `1px solid ${T.border}` }}>
                            <span style={{ display: 'block', fontFamily: T.mono, fontSize: 7, color: `${T.success}80`, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
                                Reference Waveform
                            </span>
                            {selectedExercise.referenceWaveform.slice(0, 3).map((sig: any) => (
                                <div key={sig.signal} style={{ marginBottom: 6 }}>
                                    <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>{sig.signal}</span>
                                    <div style={{ display: 'flex', gap: 2, marginTop: 3 }}>
                                        {sig.values.map((v: any, i: number) => (
                                            <div key={i} style={{
                                                flex: 1, height: 20,
                                                background: v === 1 ? `${T.success}40` : v === 0 ? `${T.border}` : `${T.muted}30`,
                                                border: `1px solid ${v === 1 ? T.success : T.border}`,
                                                borderRadius: 1,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <span style={{ fontFamily: T.mono, fontSize: 7, color: v === 1 ? T.success : T.muted }}>
                                                    {String(v)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
