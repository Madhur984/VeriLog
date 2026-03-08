import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLogicStudio } from '../../hooks/useLogicStudio';
import { StudioCanvas } from '../logic-studio/StudioCanvas';
import { NodeType } from '../../mure/core/SignalNode';
import { CheckCircle2, Zap, Cpu, Activity } from 'lucide-react';

const T = {
    card: '#0D0F16', surface: '#1A1D24', border: '#222633',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF', success: '#10B981', warning: '#F59E0B',
    mono: "'JetBrains Mono', monospace",
};

export const OptimizationComparison: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const studio = useLogicStudio();
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        if (studio.canvasNodes.length > 0) return;

        // Build the optimized circuit: F = C
        studio.addNode(NodeType.SWITCH, 100, 150, { label: 'A' });
        studio.addNode(NodeType.SWITCH, 100, 300, { label: 'B' });
        const nC = studio.addNode(NodeType.SWITCH, 100, 450, { label: 'C' });

        const led = studio.addNode(NodeType.LED, 600, 450, { label: 'F' });

        const engine = studio.getEngine();
        // The entire function simplifies to just C!
        engine.connectNodes(nC, 0, led, 0);

        studio.play();
        setTimeout(() => setIsSimulating(true), 500);

    }, [studio]);

    return (
        <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ textAlign: 'center' }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.success, display: 'block', marginBottom: 8 }}>
                    Scene 5.5 — The Power of Optimization
                </span>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 8 }}>From 11 Gates to 0</h2>
                <p style={{ color: T.muted, fontSize: 14, maxWidth: 600, margin: '0 auto' }}>
                    The complex expression $F = A'BC + ABC + AB'C$ simplifies entirely to $F = C$.
                    Notice how changes in A or B have no effect on the output.
                    This is why hardware engineers use Karnaugh Maps.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                {/* ── Before (Unoptimized) Metrics ── */}
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>Before Optimization</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: T.surface, borderRadius: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: T.text }}>
                                <Cpu size={18} color={T.muted} />
                                <span style={{ fontFamily: T.mono, fontSize: 13 }}>Total Gates</span>
                            </div>
                            <span style={{ fontFamily: T.mono, fontSize: 16, color: '#EF4444', fontWeight: 700 }}>11</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: T.surface, borderRadius: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: T.text }}>
                                <Activity size={18} color={T.muted} />
                                <span style={{ fontFamily: T.mono, fontSize: 13 }}>Logic Depth</span>
                            </div>
                            <span style={{ fontFamily: T.mono, fontSize: 16, color: '#EF4444', fontWeight: 700 }}>4 levels</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: T.surface, borderRadius: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: T.text }}>
                                <Zap size={18} color={T.muted} />
                                <span style={{ fontFamily: T.mono, fontSize: 13 }}>Transistor Count</span>
                            </div>
                            <span style={{ fontFamily: T.mono, fontSize: 16, color: '#EF4444', fontWeight: 700 }}>66</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: T.surface, borderRadius: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: T.text }}>
                                <Activity size={18} color={T.muted} />
                                <span style={{ fontFamily: T.mono, fontSize: 13 }}>Est. Power (mW)</span>
                            </div>
                            <span style={{ fontFamily: T.mono, fontSize: 16, color: '#EF4444', fontWeight: 700 }}>142</span>
                        </div>
                    </div>
                </div>

                {/* ── After (Optimized) Metrics ── */}
                <div style={{ background: 'rgba(16,185,129,0.05)', border: `1px solid ${T.success}`, borderRadius: 12, padding: 24, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 100% 0%, rgba(16,185,129,0.15) 0%, transparent 50%)', pointerEvents: 'none' }} />
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>After Optimization</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(16,185,129,0.1)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: T.text }}>
                                <Cpu size={18} color={T.success} />
                                <span style={{ fontFamily: T.mono, fontSize: 13 }}>Total Gates</span>
                            </div>
                            <span style={{ fontFamily: T.mono, fontSize: 16, color: T.success, fontWeight: 700 }}>0</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(16,185,129,0.1)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: T.text }}>
                                <Activity size={18} color={T.success} />
                                <span style={{ fontFamily: T.mono, fontSize: 13 }}>Logic Depth</span>
                            </div>
                            <span style={{ fontFamily: T.mono, fontSize: 16, color: T.success, fontWeight: 700 }}>0 levels</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(16,185,129,0.1)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: T.text }}>
                                <Zap size={18} color={T.success} />
                                <span style={{ fontFamily: T.mono, fontSize: 13 }}>Transistor Count</span>
                            </div>
                            <span style={{ fontFamily: T.mono, fontSize: 16, color: T.success, fontWeight: 700 }}>0*</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(16,185,129,0.1)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: T.text }}>
                                <Activity size={18} color={T.success} />
                                <span style={{ fontFamily: T.mono, fontSize: 13 }}>Est. Power (mW)</span>
                            </div>
                            <span style={{ fontFamily: T.mono, fontSize: 16, color: T.success, fontWeight: 700 }}>~0</span>
                        </div>
                    </div>
                    <div style={{ fontSize: 9, color: T.muted, textAlign: 'right', marginTop: 12 }}>*Direct connection (wire only)</div>
                </div>
            </div>

            {/* Live Interactive Circuit */}
            <div style={{ width: '100%', height: 400, background: T.card, border: `1px solid ${T.success}`, borderRadius: 12, position: 'relative', overflow: 'hidden', boxShadow: '0 0 40px rgba(16,185,129,0.1)' }}>
                <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, background: 'rgba(13,15,22,0.8)', padding: '6px 12px', borderRadius: 4, backdropFilter: 'blur(4px)', border: `1px solid ${T.border}` }}>
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.text, letterSpacing: '0.1em' }}>LIVE OPTIMIZED CIRCUIT: F = C</span>
                </div>

                {isSimulating && (
                    <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, background: T.success, borderRadius: '50%', boxShadow: `0 0 8px ${T.success}` }} />
                        <span style={{ fontFamily: T.mono, fontSize: 10, color: T.success, letterSpacing: '0.1em' }}>SIMULATION ACTIVE</span>
                    </div>
                )}

                <StudioCanvas
                    nodes={studio.canvasNodes}
                    edges={studio.getNodeEdges()}
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

                <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onComplete}
                        style={{
                            padding: '16px 32px', background: T.success, color: '#000', border: 'none',
                            borderRadius: 8, fontFamily: T.mono, fontSize: 14, fontWeight: 700,
                            cursor: 'pointer', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 12,
                            boxShadow: '0 8px 20px rgba(16,185,129,0.3)'
                        }}>
                        <CheckCircle2 size={20} />
                        COMPLETE LEVEL 5
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
