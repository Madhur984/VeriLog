import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLogicStudio } from '../../hooks/useLogicStudio';
import { StudioCanvas } from '../logic-studio/StudioCanvas';
import { NodeType } from '../../mure/core/SignalNode';

const T = {
    card: '#0D0F16', surface: '#1A1D24', border: '#222633',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    mono: "'JetBrains Mono', monospace",
};

export const CircuitComplexityDemo: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const studio = useLogicStudio();

    // Build the complex circuit: F = A'BC + ABC + AB'C
    useEffect(() => {
        if (studio.canvasNodes.length > 0) return;

        // Switches
        const nA = studio.addNode(NodeType.SWITCH, 50, 100, { label: 'A' });
        const nB = studio.addNode(NodeType.SWITCH, 50, 300, { label: 'B' });
        const nC = studio.addNode(NodeType.SWITCH, 50, 500, { label: 'C' });

        // Inverters
        const notA = studio.addNode(NodeType.NOT, 200, 150);
        const notB = studio.addNode(NodeType.NOT, 200, 350);

        const engine = studio.getEngine();
        engine.connectNodes(nA, 0, notA, 0);
        engine.connectNodes(nB, 0, notB, 0);

        // Term 1: A'BC
        const and1 = studio.addNode(NodeType.AND, 400, 100);
        engine.connectNodes(notA, 0, and1, 0);
        engine.connectNodes(nB, 0, and1, 1);
        const and1_2 = studio.addNode(NodeType.AND, 550, 150);
        engine.connectNodes(and1, 0, and1_2, 0);
        engine.connectNodes(nC, 0, and1_2, 1);

        // Term 2: ABC
        const and2 = studio.addNode(NodeType.AND, 400, 300);
        engine.connectNodes(nA, 0, and2, 0);
        engine.connectNodes(nB, 0, and2, 1);
        const and2_2 = studio.addNode(NodeType.AND, 550, 350);
        engine.connectNodes(and2, 0, and2_2, 0);
        engine.connectNodes(nC, 0, and2_2, 1);

        // Term 3: AB'C
        const and3 = studio.addNode(NodeType.AND, 400, 500);
        engine.connectNodes(nA, 0, and3, 0);
        engine.connectNodes(notB, 0, and3, 1);
        const and3_2 = studio.addNode(NodeType.AND, 550, 550);
        engine.connectNodes(and3, 0, and3_2, 0);
        engine.connectNodes(nC, 0, and3_2, 1);

        // Or combine
        const or1 = studio.addNode(NodeType.OR, 750, 250);
        engine.connectNodes(and1_2, 0, or1, 0);
        engine.connectNodes(and2_2, 0, or1, 1);

        const orFinal = studio.addNode(NodeType.OR, 900, 400);
        engine.connectNodes(or1, 0, orFinal, 0);
        engine.connectNodes(and3_2, 0, orFinal, 1);

        // Output LED
        const led = studio.addNode(NodeType.LED, 1050, 400, { label: 'F' });
        engine.connectNodes(orFinal, 0, led, 0);

        studio.play();
    }, [studio]);

    return (
        <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#00D4FF', display: 'block', marginBottom: 8 }}>
                    Scene 5.1 — The Complexity Problem
                </span>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 8 }}>Boolean Expression Translation</h2>
                <p style={{ color: T.muted, fontSize: 14 }}>
                    Notice how many gates are required to implement $F = A'BC + ABC + AB'C$<br />
                    More gates mean more heat, higher cost, and slower propagation delay.
                </p>
            </div>

            <div style={{ position: 'relative', width: '100%', height: 650, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
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

                {/* Telemetry Panel */}
                <div style={{
                    position: 'absolute', top: 16, right: 16,
                    padding: '12px 16px', background: 'rgba(13,15,22,0.9)',
                    border: `1px solid ${T.border}`, borderRadius: 8,
                    backdropFilter: 'blur(6px)', pointerEvents: 'none',
                    minWidth: 180,
                }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>Circuit Metrics</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px 16px', fontFamily: T.mono, fontSize: 11 }}>
                        <span style={{ color: T.muted }}>Total Gates</span>
                        <span style={{ color: '#EF4444', textAlign: 'right' }}>11</span>

                        <span style={{ color: T.muted }}>Logic Depth</span>
                        <span style={{ color: '#EF4444', textAlign: 'right' }}>4 levels</span>

                        <span style={{ color: T.muted }}>Est. Delay</span>
                        <span style={{ color: '#EF4444', textAlign: 'right' }}>40 ns</span>
                    </div>
                </div>

                {/* Check button overlay */}
                <div style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 10 }}>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onComplete}
                        style={{
                            padding: '12px 24px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)',
                            borderRadius: 8, color: T.accent, fontFamily: T.mono, fontSize: 12, fontWeight: 700,
                            letterSpacing: '0.1em', cursor: 'pointer', backdropFilter: 'blur(8px)',
                        }}>
                        PROCEED TO K-MAP &rarr;
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
