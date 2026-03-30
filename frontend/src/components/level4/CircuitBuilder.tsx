import React, { useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLogicStudio } from '../../hooks/useLogicStudio';
import { ComponentPalette } from '../logic-studio/ComponentPalette';
import { StudioCanvas } from '../logic-studio/StudioCanvas';
import { StudioToolbox } from '../logic-studio/StudioToolbox';
import { NodeType } from '../../mure/core/SignalNode';
import { CheckCircle2, Zap, Activity, Database } from 'lucide-react';
import { LogicOscilloscope } from '../LogicOscilloscope';
import { useLogicAnalystL4 } from '../../hooks/useLogicAnalystL4';

const T = {
    card: '#FFFFFF', 
    surface: '#F8FAFC', 
    border: '#E2E8F0',
    text: '#0F172A', 
    muted: '#64748B', 
    accent: '#0284C7', 
    success: '#10B981',
    mono: "'IBM Plex Mono', monospace",
};

interface Props {
    onComplete: () => void;
    hasCompleted: boolean;
}

export const CircuitBuilder: React.FC<Props> = ({ onComplete, hasCompleted }) => {
    const studio = useLogicStudio();
    const analyst = useLogicAnalystL4();
    const [nextX, setNextX] = useState(100);
    const [nextY, setNextY] = useState(100);

    // Analyst State
    const [analystMessage, setAnalystMessage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const triggerAnalysis = useCallback(() => {
        setIsAnalyzing(true);
        setTimeout(() => {
            const res = analyst.getResponse('oscilloscope');
            setAnalystMessage(res.observation + " " + res.conclusion);
            setIsAnalyzing(false);
        }, 800);
    }, [analyst]);

    // Auto-trigger analyst when first probe is added
    useEffect(() => {
        if (studio.traces.length === 1 && !analystMessage) {
            triggerAnalysis();
        }
    }, [studio.traces.length, analystMessage, triggerAnalysis]);

    const handleAddComponent = useCallback((type: NodeType) => {
        studio.addNode(type, nextX, nextY);
        setNextX((x) => x + 120 > 600 ? 100 : x + 120);
        if (nextX + 120 > 600) setNextY((y) => y + 100);
    }, [studio, nextX, nextY]);

    const edges = studio.getNodeEdges();

    // Check completion
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
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ padding: '2px 8px', background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0369A1', borderRadius: 4, fontFamily: T.mono, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>
                        Scene 4.3
                    </div>
                    <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.muted, fontWeight: 600 }}>
                        Circuit Construction Lab
                    </span>
                </div>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 12, letterSpacing: '-0.02em' }}>Freeform Logic Sandbox</h2>
                <p style={{ color: T.muted, fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: 1.5 }}>
                    Drag gates from the palette, wire them into a functional circuit, and observe signal propagation in real-time.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '240px 1fr',
                height: 600,
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.05)'
            }}>
                {/* Palette Sidebar */}
                <div style={{ borderRight: `1px solid ${T.border}`, background: '#F8FAFC', padding: 12 }}>
                    <div style={{ padding: '8px 12px 16px', borderBottom: `1px solid ${T.border}`, marginBottom: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Database size={10} /> Component Library
                        </div>
                    </div>
                    <ComponentPalette onAddComponent={handleAddComponent} />
                </div>

                {/* Canvas Area */}
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        height: 56,
                        borderBottom: `1px solid ${T.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 20px',
                        justifyContent: 'space-between',
                        background: '#FFFFFF'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: studio.isRunning ? T.success : '#CBD5E1' }} />
                            <div style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase' }}>Workspace Canvas</div>
                        </div>
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

                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#FFFFFF' }}>
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

                        {/* Telemetry Panel */}
                        <div style={{
                            position: 'absolute', top: 20, right: 20,
                            padding: '16px 20px', background: 'rgba(255,255,255,0.9)',
                            border: `1px solid ${T.border}`, borderRadius: 16,
                            backdropFilter: 'blur(12px)', pointerEvents: 'none',
                            minWidth: 200, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Activity size={12} /> System Telemetry
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px 24px', fontFamily: T.mono, fontSize: 11, fontWeight: 600 }}>
                                <span style={{ color: T.muted }}>Node Count</span>
                                <span style={{ color: T.text, textAlign: 'right' }}>{studio.canvasNodes.length}</span>

                                <span style={{ color: T.muted }}>Propagation</span>
                                <span style={{ color: T.text, textAlign: 'right' }}>{edges.length} connections</span>

                                <span style={{ color: T.muted }}>Sim Runtime</span>
                                <span style={{ color: T.text, textAlign: 'right' }}>{studio.simTime}ns</span>

                                <span style={{ color: T.muted }}>Logic Cycles</span>
                                <span style={{ color: studio.simTime > 0 ? T.accent : T.muted, textAlign: 'right' }}>
                                    {Math.floor(studio.simTime / 10)}
                                </span>
                            </div>
                        </div>

                        {/* Analysis Overlay */}
                        <AnimatePresence>
                            {studio.traces && studio.traces.length > 0 && (
                                <motion.div
                                    initial={{ y: 250, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 250, opacity: 0 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        borderTop: `1px solid ${T.border}`,
                                        boxShadow: '0 -20px 40px rgba(0,0,0,0.03)',
                                        zIndex: 20,
                                        background: T.card,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: `1px solid ${T.border}`, background: '#F8FAFC' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ padding: '2px 8px', background: '#E0F2FE', color: '#0369A1', borderRadius: 4, fontFamily: T.mono, fontSize: 9, fontWeight: 800 }}>LIVE</div>
                                            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.text, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                                                Waveform Observation Engine
                                            </div>
                                        </div>
                                        <button
                                            onClick={triggerAnalysis}
                                            style={{ background: '#FFFFFF', border: `1px solid ${T.border}`, color: T.accent, fontSize: 10, fontWeight: 700, padding: '6px 12px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Zap size={12} /> SCAN SIGNALS
                                        </button>
                                    </div>
                                    <div style={{ position: 'relative', flex: 1, padding: 20, background: '#FFFFFF' }}>
                                        <LogicOscilloscope traces={studio.traces} height={160} />

                                        {/* Logic Analyst Overlay */}
                                        <div style={{ position: 'absolute', right: 32, bottom: 32, pointerEvents: 'auto', maxWidth: 300 }}>
                                            <AnimatePresence>
                                                {(analystMessage || isAnalyzing) && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        style={{ 
                                                            padding: 20, 
                                                            background: '#FFFFFF', 
                                                            border: `1px solid ${T.border}`, 
                                                            borderRadius: 20, 
                                                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 12
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                            <div style={{ padding: 8, background: '#F0F9FF', borderRadius: 8, color: '#0284C7' }}>
                                                                <Activity size={18} className={isAnalyzing ? "animate-pulse" : ""} />
                                                            </div>
                                                            <div style={{ fontWeight: 800, fontSize: 13, color: T.text }}>Logic Analysis</div>
                                                        </div>
                                                        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.5, fontStyle: 'italic' }}>
                                                            {isAnalyzing ? "Processing bitstream signatures..." : analystMessage}
                                                        </p>
                                                        {!isAnalyzing && (
                                                            <button 
                                                                onClick={() => setAnalystMessage(null)}
                                                                style={{ background: '#F8FAFC', border: 'none', color: '#94A3B8', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 4, cursor: 'pointer', alignSelf: 'flex-end' }}>
                                                                DISMISS
                                                            </button>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
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
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20, background: '#F0FDF4', borderRadius: 16, border: `1px solid #BBF7D0`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <CheckCircle2 size={20} style={{ color: T.success }} />
                        <span style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: '#166534' }}>Protocol sequence successful. The circuit logic is valid.</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
