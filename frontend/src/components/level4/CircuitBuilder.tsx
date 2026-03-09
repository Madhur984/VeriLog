import React, { useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLogicStudio } from '../../hooks/useLogicStudio';
import { ComponentPalette } from '../logic-studio/ComponentPalette';
import { StudioCanvas } from '../logic-studio/StudioCanvas';
import { StudioToolbox } from '../logic-studio/StudioToolbox';
import { NodeType } from '../../mure/core/SignalNode';
import { CheckCircle2 } from 'lucide-react';
import { LogicOscilloscope } from '../LogicOscilloscope';
import { VoltBot } from '../ui/VoltBot';
import { useSigmaMentorL4 } from '../../hooks/useSigmaMentorL4';

const T = {
    card: '#0D0F16', surface: '#1A1D24', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF', success: '#10B981',
    mono: "'JetBrains Mono', monospace",
};

interface Props {
    onComplete: () => void;
    hasCompleted: boolean;
}

export const CircuitBuilder: React.FC<Props> = ({ onComplete, hasCompleted }) => {
    const studio = useLogicStudio();
    const mentor = useSigmaMentorL4();
    const [nextX, setNextX] = useState(100);
    const [nextY, setNextY] = useState(100);

    // Mentor State
    const [botMessage, setBotMessage] = useState<string | null>(null);
    const [botState, setBotState] = useState<'idle' | 'speaking' | 'happy' | 'thinking'>('idle');

    const triggerAnalysis = useCallback(() => {
        setBotState('thinking');
        setTimeout(() => {
            const res = mentor.getResponse('oscilloscope');
            setBotMessage(res.observation + " " + res.conclusion);
            setBotState('speaking');
        }, 800);
    }, [mentor]);

    // Auto-trigger mentor when first probe is added
    useEffect(() => {
        if (studio.traces.length === 1 && !botMessage) {
            triggerAnalysis();
        }
    }, [studio.traces.length, botMessage, triggerAnalysis]);

    const handleAddComponent = useCallback((type: NodeType) => {
        studio.addNode(type, nextX, nextY);
        setNextX((x) => x + 120 > 600 ? 100 : x + 120);
        if (nextX + 120 > 600) setNextY((y) => y + 100);
    }, [studio, nextX, nextY]);

    const edges = studio.getNodeEdges();

    // Check completion (simple heuristic: has at least one gate and one led connected)
    useEffect(() => {
        if (hasCompleted) return;

        const hasGate = studio.canvasNodes.some(n =>
            [NodeType.AND, NodeType.OR, NodeType.NOT, NodeType.XOR, NodeType.NAND, NodeType.NOR].includes(n.type)
        );
        const hasIO = studio.canvasNodes.some(n => n.type === NodeType.LED) &&
            studio.canvasNodes.some(n => n.type === NodeType.BATTERY || n.type === NodeType.SWITCH);

        if (hasGate && hasIO && edges.length > 1) {
            onComplete();
        }
    }, [studio.canvasNodes, edges, hasCompleted, onComplete]);

    return (
        <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.accent, display: 'block', marginBottom: 8 }}>
                    Scene 4.3 — Circuit Builder
                </span>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 8 }}>Freeform Logic Sandbox</h2>
                <p style={{ color: T.muted, fontSize: 14 }}>
                    Drag gates from the palette, wire them into a working circuit, and verify the signals.
                </p>
            </div>

            <div style={{
                display: 'flex',
                height: 500,
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                overflow: 'hidden'
            }}>
                {/* Palette Sidebar */}
                <div style={{ width: 220, borderRight: `1px solid ${T.border}`, background: 'rgba(0,0,0,0.2)' }}>
                    <ComponentPalette onAddComponent={handleAddComponent} />
                </div>

                {/* Canvas Area */}
                <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        height: 48,
                        borderBottom: `1px solid ${T.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 16px',
                        justifyContent: 'space-between',
                        background: 'rgba(255,255,255,0.02)'
                    }}>
                        <div style={{ fontFamily: T.mono, fontSize: 11, color: T.muted }}>Workspace Canvas</div>
                        <StudioToolbox
                            isRunning={studio.isRunning}
                            simTime={studio.simTime}
                            mode={studio.mode}
                            xrayEnabled={studio.xrayEnabled}
                            onPlay={studio.play}
                            onPause={studio.pause}
                            onStep={studio.doStep}
                            onReset={studio.reset}
                            onSetMode={studio.setMode}
                            onToggleXray={() => studio.setXrayEnabled(!studio.xrayEnabled)}
                        />
                    </div>

                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                        <StudioCanvas
                            nodes={studio.canvasNodes}
                            edges={edges}
                            selectedNodeId={studio.selectedNodeId}
                            mode={studio.mode}
                            wireStart={studio.wireStart}
                            snapshot={studio.snapshot}
                            xrayEnabled={studio.xrayEnabled}
                            onSelectNode={studio.setSelectedNodeId}
                            onMoveNode={studio.moveNode}
                            onStartWire={studio.startWire}
                            onCompleteWire={studio.completeWire}
                            onCancelWire={studio.cancelWire}
                            onToggleProbe={studio.toggleProbe}
                            onRemoveNode={studio.removeNode}
                        />

                        {/* CSE Telemetry Panel */}
                        <div style={{
                            position: 'absolute', top: 16, right: 16,
                            padding: '12px 16px', background: 'rgba(13,15,22,0.9)',
                            border: `1px solid ${T.border}`, borderRadius: 8,
                            backdropFilter: 'blur(6px)', pointerEvents: 'none',
                            minWidth: 180,
                        }}>
                            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                                CSE Telemetry
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px 16px', fontFamily: T.mono, fontSize: 11 }}>
                                <span style={{ color: T.muted }}>Sim Status</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <motion.div
                                        animate={studio.isRunning ? {
                                            background: ['#10B981', '#10B98170', '#10B981'],
                                            boxShadow: ['0 0 6px #10B981', '0 0 2px #10B98140', '0 0 6px #10B981'],
                                        } : { background: '#334155', boxShadow: 'none' }}
                                        transition={{ duration: 1.2, repeat: Infinity }}
                                        style={{ width: 7, height: 7, borderRadius: '50%' }}
                                    />
                                    <span style={{ color: studio.isRunning ? '#10B981' : T.muted }}>
                                        {studio.isRunning ? 'ACTIVE' : 'IDLE'}
                                    </span>
                                </span>

                                <span style={{ color: T.muted }}>Nodes</span>
                                <span style={{ color: T.text, textAlign: 'right' }}>{studio.canvasNodes.length}</span>

                                <span style={{ color: T.muted }}>Edges</span>
                                <span style={{ color: T.text, textAlign: 'right' }}>{edges.length}</span>

                                <span style={{ color: T.muted }}>Sim Time</span>
                                <span style={{ color: T.text, textAlign: 'right' }}>{studio.simTime}ns</span>

                                <span style={{ color: T.muted }}>Prop Cycles</span>
                                <span style={{ color: studio.simTime > 0 ? T.accent : T.muted, textAlign: 'right' }}>
                                    {Math.floor(studio.simTime / 10)}
                                </span>
                            </div>
                        </div>

                        {/* Logic Oscilloscope Drawer Overlay */}
                        <AnimatePresence>
                            {studio.traces && studio.traces.length > 0 && (
                                <motion.div
                                    initial={{ y: 200, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 200, opacity: 0 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        borderTop: `1px solid ${T.border}`,
                                        boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
                                        zIndex: 20,
                                        background: T.card,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderBottom: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.03)' }}>
                                        <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                            Live Waveform Analysis
                                        </div>
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <button
                                                onClick={triggerAnalysis}
                                                style={{ background: 'none', border: 'none', color: T.muted, fontSize: 10, cursor: 'pointer', textDecoration: 'underline' }}>
                                                Re-analyze
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <LogicOscilloscope traces={studio.traces} height={180} />

                                        {/* VoltBot Integration */}
                                        <div style={{ position: 'absolute', right: 24, bottom: 20, pointerEvents: 'auto' }}>
                                            <VoltBot
                                                state={botState}
                                                message={botMessage || undefined}
                                                onClick={() => setBotMessage(null)}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {hasCompleted && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, background: 'rgba(16, 185, 129, 0.08)', borderRadius: 8, border: `1px solid rgba(16, 185, 129, 0.2)` }}>
                        <CheckCircle2 size={16} style={{ color: T.success }} />
                        <span style={{ fontFamily: T.mono, fontSize: 12, color: T.success }}>Circuit working! Proceed to Logic Puzzles when ready.</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
