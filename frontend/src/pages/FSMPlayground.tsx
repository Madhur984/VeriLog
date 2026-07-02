/**
 * pages/FSMPlayground.tsx - Full FSM Visual Simulator Page
 *
 * Features:
 *   - FSM type selector (Moore / Mealy)
 *   - State + transition editor panel
 *   - Interactive SVG state diagram (FSMCanvas)
 *   - Input sequence runner with timeline scrubber
 *   - Static analysis panel
 *   - Verilog export
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw, Download, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';
import { FSMCanvas } from '../components/fsm/FSMCanvas';
import { FSMTimeline } from '../components/fsm/FSMTimeline';
// import {
//     createFSM, fsmRun, analyzeFSM, exportToVerilog,
//     type FSMDefinition, type StepResult,
// } from '../engine/FSMEngine';
// import type { StateId, FSMState, FSMTransition } from '../engine/types';

// Stubs for FSM types and functions
type StateId = string;
type FSMDefinition = any;
type StepResult = any;

const fsmRun = (_fsm: any, _inputs: string[]): any[] => [];
const analyzeFSM = (_fsm: any): any => ({
    unreachableStates: [],
    deadStates: [],
    nondeterministicStates: [],
    missingTransitions: []
});
const exportToVerilog = (_fsm: any): string => "// Verilog export disabled (engine removed)";

const T = {
    bg: '#FFFFFF', card: '#F8FAFC', surface: '#F1F5F9', border: '#E2E8F0',
    text: '#0F172A', muted: '#64748B', accent: '#0EA5E9',
    success: '#059669', warning: '#D97706', error: '#DC2626',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
    sans: "'Inter',system-ui,sans-serif",
} as const;

// ─── Demo FSM: Traffic Light Controller ─────────────────────────────────────
function makeTrafficLightFSM(): FSMDefinition {
    // const fsm = createFSM({ type: 'Moore', alphabet: ['tick'] });
    // const states = new Map<StateId, FSMState>([
    //     ['RED', { id: 'RED', label: 'RED', output: '100', isFinal: false, position: { x: 120, y: 200 } }],
    //     ['GREEN', { id: 'GREEN', label: 'GREEN', output: '001', isFinal: false, position: { x: 350, y: 120 } }],
    //     ['YELLOW', { id: 'YELLOW', label: 'YELLOW', output: '010', isFinal: false, position: { x: 580, y: 200 } }],
    // ]);
    // const transitions: FSMTransition[] = [
    //     { id: 't0', from: 'RED', to: 'GREEN', condition: 'tick', output: '' },
    //     { id: 't1', from: 'GREEN', to: 'YELLOW', condition: 'tick', output: '' },
    //     { id: 't2', from: 'YELLOW', to: 'RED', condition: 'tick', output: '' },
    // ];
    // return { ...fsm, states, transitions, alphabet: ['tick'], initialState: 'RED', currentState: 'RED' };
    return { states: new Map(), transitions: [], type: 'Moore' };
}

export function FSMPlayground() {
    const navigate = useNavigate();
    const [fsm, setFSM] = useState<FSMDefinition>(makeTrafficLightFSM());
    const [inputSeq, setInputSeq] = useState('tick,tick,tick,tick,tick,tick');
    const [trace, setTrace] = useState<StepResult[]>([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [activeTransId, setActiveTransId] = useState<string | undefined>();
    const [showExport, setShowExport] = useState(false);
    const [showPanel, setShowPanel] = useState(false);

    const analysis = analyzeFSM(fsm);
    const hasIssues =
        analysis.unreachableStates.length > 0 ||
        analysis.deadStates.length > 0 ||
        analysis.nondeterministicStates.length > 0;

    // ── Run FSM ────────────────────────────────────────────────────────────
    const handleRun = useCallback(() => {
        const copy = { ...fsm, states: new Map(fsm.states), transitions: [...fsm.transitions], currentState: fsm.initialState };
        const inputs = inputSeq.split(',').map(s => s.trim()).filter(Boolean);
        const t = fsmRun(copy, inputs);
        setTrace(t);
        setCurrentStep(t.length - 1);
        setFSM((prev: any) => ({ ...prev, currentState: copy.currentState }));
    }, [fsm, inputSeq]);

    const handleReset = useCallback(() => {
        setFSM((prev: any) => ({ ...prev, currentState: prev.initialState }));
        setTrace([]);
        setCurrentStep(-1);
        setActiveTransId(undefined);
    }, []);

    const handleSeek = useCallback((step: number) => {
        setCurrentStep(step);
        const s = trace[step];
        if (s) {
            setFSM((prev: any) => ({ ...prev, currentState: s.toState }));
            const t = fsm.transitions.find((tr: any) => tr.from === s.fromState && tr.to === s.toState);
            setActiveTransId(t?.id);
        }
    }, [trace, fsm.transitions]);

    // ── State position update ─────────────────────────────────────────────
    const handlePositionChange = useCallback((stateId: StateId, pos: { x: number; y: number }) => {
        setFSM((prev: any) => {
            const states = new Map(prev.states);
            const s: any = states.get(stateId);
            if (s) states.set(stateId, { ...s, position: pos });
            return { ...prev, states };
        });
    }, []);

    // ── Add State ──────────────────────────────────────────────────────────
    const handleAddState = useCallback(() => {
        const id = `S${fsm.states.size}`;
        setFSM((prev: any) => {
            const states = new Map(prev.states);
            states.set(id, {
                id, label: id, output: '', isFinal: false,
                position: { x: 200 + Math.random() * 250, y: 150 + Math.random() * 100 },
            });
            return { ...prev, states, initialState: prev.initialState || id, currentState: prev.currentState || id };
        });
    }, [fsm.states.size]);

    return (
        <div
            className="min-h-[100svh] overflow-y-auto lg:overflow-hidden"
            style={{ background: T.bg, color: T.text, fontFamily: T.sans }}
        >
            {/* ── Top Bar ──────────────────────────────────────────────── */}
            <div
                className="flex flex-wrap items-center gap-2 px-4 py-3 lg:gap-4 lg:px-6 lg:py-[14px]"
                style={{ borderBottom: `1px solid ${T.border}`, background: T.card }}
            >
                <button
                    onClick={() => navigate('/portal')}
                    style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                    <ArrowLeft size={16} />
                    <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>BACK</span>
                </button>
                <div style={{ width: 1, height: 20, background: T.border }} />
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${T.accent}CC` }}>
                    FSM Visual Simulator
                </span>

                {/* FSM type badge + export */}
                <div className="flex gap-2 items-center ml-auto flex-wrap">
                    {(['Moore', 'Mealy'] as const).map(type => (
                        <button key={type} onClick={() => setFSM((p: any) => ({ ...p, type }))}
                            style={{
                                padding: '6px 12px', fontFamily: T.mono, fontSize: 8,
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                background: fsm.type === type ? `${T.accent}15` : 'transparent',
                                border: `1px solid ${fsm.type === type ? T.accent : T.border}`,
                                borderRadius: 2, color: fsm.type === type ? T.accent : T.muted,
                                cursor: 'pointer', minHeight: 36,
                            }}
                        >
                            {type}
                        </button>
                    ))}

                    <button onClick={() => setShowExport(true)} style={{
                        padding: '6px 12px', fontFamily: T.mono, fontSize: 8,
                        letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6,
                        background: 'transparent', border: `1px solid ${T.border}`,
                        borderRadius: 2, color: T.muted, cursor: 'pointer', minHeight: 36,
                    }}>
                        <Download size={12} /> Verilog
                    </button>

                    {/* Mobile: toggle panel button */}
                    <button
                        className="lg:hidden"
                        onClick={() => setShowPanel(p => !p)}
                        style={{
                            padding: '6px 12px', fontFamily: T.mono, fontSize: 8,
                            letterSpacing: '0.1em',
                            background: showPanel ? `${T.accent}15` : 'transparent',
                            border: `1px solid ${showPanel ? T.accent : T.border}`,
                            borderRadius: 2, color: showPanel ? T.accent : T.muted,
                            cursor: 'pointer', minHeight: 36,
                        }}
                    >
                        States / Analysis
                    </button>
                </div>
            </div>

            {/* ── Main Layout ──────────────────────────────────────────── */}
            {/* Mobile: single column stack. Desktop: 2-col grid */}
            <div
                className="flex flex-col lg:grid lg:overflow-hidden"
                style={{
                    // desktop keeps the fixed-height 2-col grid
                }}
            >
                {/* On desktop this div acts as the grid wrapper */}
                <div
                    className="hidden lg:grid"
                    style={{
                        display: undefined, /* overridden by Tailwind */
                        gridTemplateColumns: '1fr 320px',
                        height: 'calc(100vh - 53px)',
                    }}
                >
                    {/* Left - Canvas + Timeline (desktop only slot) */}
                    <div style={{ display: 'flex', flexDirection: 'column', padding: 20, gap: 16, overflow: 'auto' }}>
                        <FSMCanvas
                            fsm={fsm}
                            activeState={fsm.currentState}
                            activeTransitionId={activeTransId}
                            onPositionChange={handlePositionChange}
                            height={380}
                        />
                        <InputRunner
                            inputSeq={inputSeq}
                            setInputSeq={setInputSeq}
                            handleRun={handleRun}
                            handleReset={handleReset}
                            trace={trace}
                            currentStep={currentStep}
                            handleSeek={handleSeek}
                        />
                    </div>

                    {/* Right - Editor + Analysis (desktop only slot) */}
                    <div style={{
                        borderLeft: `1px solid ${T.border}`,
                        display: 'flex', flexDirection: 'column',
                        overflow: 'auto',
                    }}>
                        <StateList fsm={fsm} handleAddState={handleAddState} />
                        <AnalysisPanel hasIssues={hasIssues} analysis={analysis} />
                    </div>
                </div>

                {/* Mobile: stacked panes */}
                <div className="lg:hidden flex flex-col">
                    {/* Canvas */}
                    <div style={{ padding: 12, overflow: 'hidden' }}>
                        <div style={{ width: '100%', overflowX: 'auto' }}>
                            <FSMCanvas
                                fsm={fsm}
                                activeState={fsm.currentState}
                                activeTransitionId={activeTransId}
                                onPositionChange={handlePositionChange}
                                height={280}
                            />
                        </div>
                    </div>

                    {/* Input runner */}
                    <div style={{ padding: '0 12px 12px' }}>
                        <InputRunner
                            inputSeq={inputSeq}
                            setInputSeq={setInputSeq}
                            handleRun={handleRun}
                            handleReset={handleReset}
                            trace={trace}
                            currentStep={currentStep}
                            handleSeek={handleSeek}
                        />
                    </div>

                    {/* Collapsible States / Analysis panel */}
                    {showPanel && (
                        <div style={{ borderTop: `1px solid ${T.border}` }}>
                            <StateList fsm={fsm} handleAddState={handleAddState} />
                            <AnalysisPanel hasIssues={hasIssues} analysis={analysis} />
                        </div>
                    )}
                </div>
            </div>

            {/* Verilog Export Modal */}
            <AnimatePresence>
                {showExport && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 100,
                            padding: '16px',
                        }}
                        onClick={() => setShowExport(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
                            style={{
                                background: T.card, border: `1px solid ${T.border}`,
                                borderRadius: 4, padding: 24, width: '100%', maxWidth: 600, maxHeight: '80vh',
                                overflow: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <span style={{ display: 'block', fontFamily: T.mono, fontSize: 9, color: T.accent, letterSpacing: '0.15em', marginBottom: 16 }}>
                                VERILOG EXPORT
                            </span>
                            <pre style={{
                                fontFamily: T.mono, fontSize: 11, color: T.text,
                                background: T.surface, padding: 16, borderRadius: 2,
                                overflow: 'auto', lineHeight: 1.6,
                                border: `1px solid ${T.border}`,
                            }}>
                                {exportToVerilog(fsm)}
                            </pre>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Extracted sub-components for reuse between mobile and desktop ──────────

function InputRunner({ inputSeq, setInputSeq, handleRun, handleReset, trace, currentStep, handleSeek }: {
    inputSeq: string;
    setInputSeq: (v: string) => void;
    handleRun: () => void;
    handleReset: () => void;
    trace: any[];
    currentStep: number;
    handleSeek: (step: number) => void;
}) {
    return (
        <div style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 4, padding: 16,
        }}>
            <span style={{ display: 'block', fontFamily: T.mono, fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${T.accent}80`, marginBottom: 12 }}>
                Input Sequence Runner
            </span>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <input
                    value={inputSeq}
                    onChange={e => setInputSeq(e.target.value)}
                    placeholder="tick,tick,tick (comma-separated)"
                    style={{
                        flex: 1, minWidth: 0, padding: '8px 12px',
                        background: T.surface, border: `1px solid ${T.border}`,
                        borderRadius: 2, color: T.text,
                        fontFamily: T.mono, fontSize: 11,
                        outline: 'none',
                    }}
                />
                <button onClick={handleRun} style={{
                    padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6,
                    background: `${T.accent}12`, border: `1px solid ${T.accent}40`,
                    borderRadius: 2, color: T.accent,
                    fontFamily: T.mono, fontSize: 9, letterSpacing: '0.1em',
                    cursor: 'pointer', minHeight: 40,
                }}>
                    <Play size={12} /> RUN
                </button>
                <button onClick={handleReset} style={{
                    padding: '8px 12px',
                    background: 'transparent', border: `1px solid ${T.border}`,
                    borderRadius: 2, color: T.muted, cursor: 'pointer', minHeight: 40,
                }}>
                    <RotateCcw size={12} />
                </button>
            </div>
            {/* Timeline */}
            <div style={{ background: T.surface, borderRadius: 2, border: `1px solid ${T.border}`, overflowX: 'auto' }}>
                <FSMTimeline
                    inputs={inputSeq.split(',').map(s => s.trim()).filter(Boolean)}
                    trace={trace}
                    currentStep={currentStep}
                    onSeek={handleSeek}
                />
            </div>
        </div>
    );
}

function StateList({ fsm, handleAddState }: { fsm: any; handleAddState: () => void }) {
    return (
        <div style={{ padding: 16, borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: `${T.accent}80` }}>
                    States ({fsm.states.size})
                </span>
                <button onClick={handleAddState} style={{
                    padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 4,
                    background: 'transparent', border: `1px solid ${T.border}`,
                    borderRadius: 2, color: T.muted, cursor: 'pointer', fontSize: 10,
                    minHeight: 36,
                }}>
                    <Plus size={10} /> Add
                </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {Array.from(fsm.states.values()).map((s: any) => (
                    <div key={s.id} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 10px',
                        background: s.id === fsm.currentState ? `${T.warning}10` : 'transparent',
                        border: `1px solid ${s.id === fsm.currentState ? T.warning : T.border}`,
                        borderRadius: 2,
                    }}>
                        <div style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: s.id === fsm.initialState ? T.accent : s.id === fsm.currentState ? T.warning : T.muted,
                        }} />
                        <span style={{ fontFamily: T.mono, fontSize: 10, color: T.text, flex: 1 }}>{s.label}</span>
                        {s.output && <span style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>/{s.output}</span>}
                        {s.isFinal && <span style={{ fontFamily: T.mono, fontSize: 7, color: T.success }}>FINAL</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function AnalysisPanel({ hasIssues, analysis }: { hasIssues: boolean; analysis: any }) {
    return (
        <div style={{ padding: 16, flex: 1 }}>
            <span style={{ display: 'block', fontFamily: T.mono, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: hasIssues ? `${T.warning}80` : `${T.success}80`, marginBottom: 12 }}>
                Logic Analysis
            </span>

            {!hasIssues && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', border: `1px solid ${T.success}30`, borderRadius: 2, background: `${T.success}08` }}>
                    <CheckCircle2 size={14} style={{ color: T.success, flexShrink: 0 }} />
                    <span style={{ fontFamily: T.mono, fontSize: 8, color: T.success }}>FSM is well-formed</span>
                </div>
            )}

            {analysis.unreachableStates.length > 0 && (
                <IssueCard
                    title="Unreachable States"
                    items={analysis.unreachableStates}
                    color={T.error}
                    insight="These states can never be entered from the initial state."
                />
            )}
            {analysis.deadStates.length > 0 && (
                <IssueCard
                    title="Dead States"
                    items={analysis.deadStates}
                    color={T.error}
                    insight="Dead states have no outgoing transitions."
                />
            )}
            {analysis.missingTransitions.map((m: any) => (
                <IssueCard
                    key={m.state}
                    title={`Missing in '${m.state}'`}
                    items={m.missingInputs}
                    color={T.warning}
                    insight={`Add transitions for inputs: ${m.missingInputs.join(', ')}`}
                />
            ))}
        </div>
    );
}

function IssueCard({ title, items, color, insight }: {
    title: string; items: string[]; color: string; insight: string;
}) {
    return (
        <div style={{
            marginBottom: 8, padding: '10px 12px',
            border: `1px solid ${color}30`, borderRadius: 2, background: `${color}06`,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <AlertTriangle size={11} style={{ color, flexShrink: 0 }} />
                <span style={{ fontFamily: T.mono, fontSize: 8, color, letterSpacing: '0.08em' }}>{title}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                {items.map(item => (
                    <span key={item} style={{
                        padding: '2px 6px', fontFamily: T.mono, fontSize: 8,
                        border: `1px solid ${color}40`, borderRadius: 1, color,
                    }}>{item}</span>
                ))}
            </div>
            <p style={{ fontFamily: T.sans, fontSize: 11, color: T.muted, lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                {insight}
            </p>
        </div>
    );
}
