/**
 * LogicStudio.tsx — Main Digital Logic Studio workspace
 *
 * Route: /logic-studio
 */

import { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogicStudio } from '../hooks/useLogicStudio';
import { ComponentPalette } from '../components/logic-studio/ComponentPalette';
import { StudioCanvas } from '../components/logic-studio/StudioCanvas';
import { StudioToolbox } from '../components/logic-studio/StudioToolbox';
import { WiringPanel } from '../components/logic-studio/WiringPanel';
import { TimingDiagram } from '../components/logic-studio/TimingDiagram';
import { TruthTableViewer } from '../components/logic-studio/TruthTableViewer';
import { SignalProbe } from '../components/logic-studio/SignalProbe';
import { NodeType } from '../mure/core/SignalNode';
import { ChevronLeft, Bug } from 'lucide-react';
import { DEBUG_MISSIONS } from '../data/debugMissions';
import '../components/logic-studio/logic-studio.css';

type BottomTab = 'timing' | 'truth-table';

export function LogicStudio() {
    const navigate = useNavigate();
    const studio = useLogicStudio();
    const [bottomTab, setBottomTab] = useState<BottomTab>('timing');

    // Counter for node placement
    const [nextX, setNextX] = useState(100);
    const [nextY, setNextY] = useState(80);

    // ─── Handlers ───────────────────────────────────────

    const handleAddComponent = useCallback((type: NodeType) => {
        studio.addNode(type, nextX, nextY);
        setNextX((x) => x + 130);
        if (nextX > 600) {
            setNextX(100);
            setNextY((y) => y + 90);
        }
    }, [studio, nextX, nextY]);

    // Get edges for display
    const edges = useMemo(() => studio.getNodeEdges(), [studio]);

    // Get timing diagram channels from probed nodes
    const timingChannels = useMemo(() => {
        return Array.from(studio.probedNodes).map((nodeId) => {
            const node = studio.canvasNodes.find((n) => n.id === nodeId);
            const trace = studio.getTrace(nodeId, 0);
            const isDigital = node?.type !== NodeType.BATTERY;

            return {
                label: node?.label || nodeId.slice(0, 6),
                trace: trace.map((pt) => ({ time: pt.time, value: pt.voltage })),
                isDigital,
            };
        });
    }, [studio.probedNodes, studio.canvasNodes, studio.getTrace, studio.simTime]);

    // Selected node gate type for truth table
    const selectedNode = studio.canvasNodes.find((n) => n.id === studio.selectedNodeId);
    const isGateType = selectedNode && [
        NodeType.AND, NodeType.OR, NodeType.NOT, NodeType.NAND,
        NodeType.NOR, NodeType.XOR, NodeType.XNOR,
    ].includes(selectedNode.type);

    return (
        <div className="studio-layout">
            {/* ── Header ──────────────────────────────────────── */}
            <div className="studio-layout-header">
                <button
                    onClick={() => navigate('/portal')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'transparent',
                        border: 'none',
                        color: '#64748B',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontFamily: 'inherit',
                    }}
                >
                    <ChevronLeft size={14} />
                </button>

                <span style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#0284C7',
                    letterSpacing: '0.08em',
                }}>
                    LOGIC STUDIO
                </span>

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

                {/* Debug missions link */}
                <div style={{ marginLeft: '8px', display: 'flex', gap: '4px' }}>
                    {DEBUG_MISSIONS.slice(0, 3).map((m) => (
                        <button
                            key={m.id}
                            onClick={() => navigate(`/debug-mission/${m.id}`)}
                            style={{
                                padding: '3px 8px',
                                background: 'rgba(239, 68, 68, 0.08)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: '3px',
                                color: '#EF4444',
                                cursor: 'pointer',
                                fontSize: '9px',
                                fontFamily: 'inherit',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                            title={m.title}
                        >
                            <Bug size={10} /> {m.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Sidebar: Component Palette ───────────────────── */}
            <div className="studio-layout-sidebar">
                <ComponentPalette onAddComponent={handleAddComponent} />
            </div>

            {/* ── Canvas ──────────────────────────────────────── */}
            <div className="studio-layout-canvas">
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

                {/* Signal probes */}
                <SignalProbe
                    nodes={studio.canvasNodes}
                    probedNodes={studio.probedNodes}
                    snapshot={studio.snapshot}
                />
            </div>

            {/* ── Right Panel: Wiring ─────────────────────────── */}
            <div className="studio-layout-panel">
                <WiringPanel edges={edges} nodes={studio.canvasNodes} />
            </div>

            {/* ── Bottom Panel: Timing / Truth Table ──────────── */}
            <div className="studio-layout-bottom">
                {/* Tab switcher */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid rgba(0, 212, 255, 0.08)',
                    width: '100px',
                }}>
                    <button
                        onClick={() => setBottomTab('timing')}
                        style={{
                            padding: '8px',
                            background: bottomTab === 'timing' ? '#F0F9FF' : 'transparent',
                            border: 'none',
                            color: bottomTab === 'timing' ? '#0284C7' : '#64748B',
                            cursor: 'pointer',
                            fontSize: '9px',
                            fontWeight: 700,
                            fontFamily: 'inherit',
                            letterSpacing: '0.08em',
                            textAlign: 'left',
                        }}
                    >
                        📈 Timing
                    </button>
                    <button
                        onClick={() => setBottomTab('truth-table')}
                        style={{
                            padding: '8px',
                            background: bottomTab === 'truth-table' ? '#F0F9FF' : 'transparent',
                            border: 'none',
                            color: bottomTab === 'truth-table' ? '#0284C7' : '#64748B',
                            cursor: 'pointer',
                            fontSize: '9px',
                            fontWeight: 700,
                            fontFamily: 'inherit',
                            letterSpacing: '0.08em',
                            textAlign: 'left',
                        }}
                    >
                        📊 Truth Table
                    </button>
                </div>

                {/* Tab content */}
                <div style={{ flex: 1, overflow: 'auto' }}>
                    {bottomTab === 'timing' && (
                        <TimingDiagram
                            channels={timingChannels}
                            currentTime={studio.simTime}
                        />
                    )}
                    {bottomTab === 'truth-table' && isGateType && selectedNode && (
                        <TruthTableViewer gateType={selectedNode.type} />
                    )}
                    {bottomTab === 'truth-table' && !isGateType && (
                        <div style={{
                            padding: '24px',
                            textAlign: 'center',
                            color: '#475569',
                            fontSize: '11px',
                        }}>
                            Select a logic gate to view its truth table.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
