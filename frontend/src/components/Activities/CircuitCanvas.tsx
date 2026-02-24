import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LabBattery, LabBulb, LabResistor, LabSwitch } from './CircuitComponent';
import { WireTrace } from './WireTrace';
import {
    snapToGrid,
    findMagneticTarget,
    applyMagneticPull,
    NodePosition,
    MagneticTarget,
    SnapNode,
    generateSnapNodes,
} from '../../simulator/snapping';
import { useTrayDrag } from '../../hooks/useTrayDrag';

// ─────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────
export type CompType = 'battery' | 'bulb' | 'resistor' | 'switch';

interface ComponentInstance {
    id: string;
    type: CompType;
    x: number;
    y: number;
    isOpen?: boolean;
    connectedNodes: string[];
}

interface WireConnection {
    id: string;
    fromId: string;
    fromNode: 'in' | 'out';
    toId: string;
    toNode: 'in' | 'out';
}

interface CircuitCanvasProps {
    onCircuitReady?: (ready: boolean) => void;
    onDialogueTrigger?: (text: string, state?: string) => void;
}

// ─────────────────────────────────────────────────────
//  Initial layout
// ─────────────────────────────────────────────────────
const INITIAL_COMPONENTS: ComponentInstance[] = [
    { id: 'batt-1', type: 'battery', x: 160, y: 280, connectedNodes: [] },
    { id: 'switch-1', type: 'switch', x: 410, y: 145, isOpen: true, connectedNodes: [] },
    { id: 'bulb-1', type: 'bulb', x: 660, y: 280, connectedNodes: [] },
    { id: 'resistor-1', type: 'resistor', x: 410, y: 420, connectedNodes: [] },
];

const INITIAL_WIRES: WireConnection[] = [
    { id: 'w1', fromId: 'batt-1', fromNode: 'in', toId: 'switch-1', toNode: 'in' },
    { id: 'w2', fromId: 'switch-1', fromNode: 'out', toId: 'bulb-1', toNode: 'in' },
    { id: 'w3', fromId: 'bulb-1', fromNode: 'out', toId: 'resistor-1', toNode: 'out' },
    { id: 'w4', fromId: 'resistor-1', fromNode: 'in', toId: 'batt-1', toNode: 'out' },
];

// ─────────────────────────────────────────────────────
//  Node geometry per component (relative offsets)
// ─────────────────────────────────────────────────────
export function getComponentNodes(comp: { id: string; type: string; x: number; y: number }): NodePosition[] {
    switch (comp.type) {
        case 'battery': return [
            { compId: comp.id, nodeKey: 'in', x: comp.x, y: comp.y - 40 },
            { compId: comp.id, nodeKey: 'out', x: comp.x, y: comp.y + 40 },
        ];
        case 'switch': return [
            { compId: comp.id, nodeKey: 'in', x: comp.x - 30, y: comp.y },
            { compId: comp.id, nodeKey: 'out', x: comp.x + 30, y: comp.y },
        ];
        case 'resistor': return [
            { compId: comp.id, nodeKey: 'in', x: comp.x - 45, y: comp.y },
            { compId: comp.id, nodeKey: 'out', x: comp.x + 45, y: comp.y },
        ];
        case 'bulb': return [
            { compId: comp.id, nodeKey: 'in', x: comp.x - 28, y: comp.y },
            { compId: comp.id, nodeKey: 'out', x: comp.x + 28, y: comp.y },
        ];
        default: return [];
    }
}

// ─────────────────────────────────────────────────────
//  ID counter
// ─────────────────────────────────────────────────────
let idCounter = 100;
const freshId = (type: CompType) => `${type}-${++idCounter}`;

// ─────────────────────────────────────────────────────
//  Ghost preview component (rendered in SVG during tray drag)
// ─────────────────────────────────────────────────────
const GhostPreview: React.FC<{ type: CompType; x: number; y: number; isNearSnap: boolean }> = React.memo(
    ({ type, x, y, isNearSnap }) => (
        <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: isNearSnap ? 0.75 : 0.45,
                scale: isNearSnap ? 1.0 : 1.05,
                x, y,
            }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{
                opacity: { duration: 0.15 },
                scale: { type: 'spring', stiffness: 300, damping: 25 },
                x: { type: 'tween', duration: 0 },
                y: { type: 'tween', duration: 0 },
            }}
            style={{
                filter: isNearSnap
                    ? 'drop-shadow(0 0 12px rgba(0,210,255,0.6))'
                    : 'drop-shadow(0 0 8px rgba(0,210,255,0.3))',
                pointerEvents: 'none' as const,
            }}
        >
            {type === 'battery' && <LabBattery x={0} y={0} active={false} id="ghost" />}
            {type === 'bulb' && <LabBulb x={0} y={0} active={false} id="ghost" />}
            {type === 'resistor' && <LabResistor x={0} y={0} active={false} id="ghost" />}
            {type === 'switch' && <LabSwitch x={0} y={0} active={false} id="ghost" isOpen={true} />}
        </motion.g>
    )
);

// ─────────────────────────────────────────────────────
//  Drop ripple effect (cyan expanding circle on valid drop)
// ─────────────────────────────────────────────────────
const DropRipple: React.FC<{ x: number; y: number; onComplete: () => void }> = ({ x, y, onComplete }) => (
    <motion.circle
        cx={x} cy={y} r={8}
        fill="none"
        stroke="#00D2FF"
        strokeWidth={3}
        initial={{ r: 8, opacity: 0.9 }}
        animate={{ r: 60, opacity: 0, strokeWidth: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        onAnimationComplete={onComplete}
    />
);

// ─────────────────────────────────────────────────────
//  Reject flash effect (red flash on invalid drop)
// ─────────────────────────────────────────────────────
const RejectFlash: React.FC<{ x: number; y: number; onComplete: () => void }> = ({ x, y, onComplete }) => (
    <>
        <motion.circle
            cx={x} cy={y} r={20}
            fill="rgba(239,68,68,0.15)"
            stroke="#EF4444"
            strokeWidth={2}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: [1, 1.3, 0.9, 1.1, 0], opacity: [0.8, 0.6, 0.4, 0.2, 0] }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onAnimationComplete={onComplete}
        />
        <motion.text
            x={x} y={y - 30}
            textAnchor="middle"
            fill="#EF4444"
            fontSize={9}
            fontFamily="monospace"
            fontWeight={700}
            letterSpacing="0.1em"
            initial={{ opacity: 0, y: y - 20 }}
            animate={{ opacity: [0, 1, 0], y: y - 36 }}
            transition={{ duration: 0.6 }}
        >
            NO SNAP NODE
        </motion.text>
    </>
);

// ═══════════════════════════════════════════════════════
//  CIRCUIT CANVAS
// ═══════════════════════════════════════════════════════
export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({ onCircuitReady, onDialogueTrigger }) => {
    const [components, setComponents] = useState<ComponentInstance[]>(INITIAL_COMPONENTS);
    const [wires] = useState<WireConnection[]>(INITIAL_WIRES);

    // On-canvas magnetic drag state
    const [magneticTarget, setMagneticTarget] = useState<MagneticTarget | null>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [bouncingId, setBouncingId] = useState<string | null>(null);
    const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);

    // Drop effect overlays
    const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
    const [rejectFlash, setRejectFlash] = useState<{ x: number; y: number } | null>(null);

    const dragging = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
    const canvasRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Tray drag context
    const tray = useTrayDrag();

    // ── Circuit active state ────────────────────────────
    const isActive = components.filter(c => c.type === 'switch').every(c => !c.isOpen);

    const prevActiveRef = useRef<boolean | null>(null);
    useEffect(() => {
        if (prevActiveRef.current === isActive) return;
        prevActiveRef.current = isActive;
        onCircuitReady?.(isActive);
        if (isActive) {
            onDialogueTrigger?.("Signal confirmed. The loop is sealed — electrons are flowing.", 'happy');
        } else {
            onDialogueTrigger?.("Open circuit. Flip the switch to close the loop.", 'talking');
        }
    }, [isActive, onCircuitReady, onDialogueTrigger]);

    // ── Generate snap nodes from all components ─────────
    const snapNodes: SnapNode[] = useMemo(
        () => generateSnapNodes(components, getComponentNodes),
        [components]
    );

    // ── Collect all nodes excluding dragged comp ────────
    const getAllNodes = useCallback(
        (excludeId: string): NodePosition[] =>
            components.flatMap(c => (c.id === excludeId ? [] : getComponentNodes(c))),
        [components]
    );

    // ── Convert client coords → SVG coords ─────────────
    const clientToSVG = useCallback((clientX: number, clientY: number): { x: number; y: number } => {
        const svg = canvasRef.current;
        if (!svg) return { x: clientX, y: clientY };
        const pt = svg.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const ctm = svg.getScreenCTM();
        if (!ctm) return { x: clientX, y: clientY };
        const svgPt = pt.matrixTransform(ctm.inverse());
        return { x: svgPt.x, y: svgPt.y };
    }, []);

    // ══════════════════════════════════════════════════════
    //  ON-CANVAS MOUSE DRAG (move existing components)
    // ══════════════════════════════════════════════════════
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!dragging.current || !canvasRef.current) return;
            const { x: svgX, y: svgY } = clientToSVG(e.clientX, e.clientY);
            const rawX = svgX - dragging.current.offsetX;
            const rawY = svgY - dragging.current.offsetY;

            setGhostPos({ x: rawX, y: rawY });

            const nodes = getAllNodes(dragging.current.id);
            const target = findMagneticTarget(svgX, svgY, nodes, dragging.current.id);
            setMagneticTarget(target);

            const pulled = applyMagneticPull(rawX, rawY, target);
            const snapped = snapToGrid(pulled.x, pulled.y);

            setComponents(prev =>
                prev.map(c =>
                    c.id === dragging.current!.id ? { ...c, x: snapped.x, y: snapped.y } : c
                )
            );
        };

        const onUp = () => {
            if (dragging.current) {
                const id = dragging.current.id;
                dragging.current = null;
                setDraggingId(null);
                setMagneticTarget(null);
                setGhostPos(null);
                setBouncingId(id);
                setTimeout(() => setBouncingId(null), 450);
            }
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, [getAllNodes, clientToSVG]);

    const handleMouseDown = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (tray.isDragging) return; // don't start canvas drag during tray drag
        const comp = components.find(c => c.id === id);
        if (!comp) return;

        if (comp.type === 'switch') {
            setComponents(prev =>
                prev.map(c => c.id === id ? { ...c, isOpen: !c.isOpen } : c)
            );
            return;
        }

        const { x: svgX, y: svgY } = clientToSVG(e.clientX, e.clientY);
        dragging.current = {
            id,
            offsetX: svgX - comp.x,
            offsetY: svgY - comp.y,
        };
        setDraggingId(id);
        setGhostPos({ x: comp.x, y: comp.y });
    };

    // ══════════════════════════════════════════════════════
    //  TRAY → CANVAS (Pointer Events flow)
    // ══════════════════════════════════════════════════════
    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!tray.isDragging) return;
        const { x, y } = clientToSVG(e.clientX, e.clientY);
        tray.updateCursor(x, y, snapNodes);
    }, [tray, clientToSVG, snapNodes]);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        if (!tray.isDragging || !tray.dragType) return;
        e.preventDefault();

        const { x: svgX, y: svgY } = clientToSVG(e.clientX, e.clientY);
        // Final snap check at exact release position
        tray.updateCursor(svgX, svgY, snapNodes);

        const result = tray.endDrag();
        const dropType = result.dragType; // from returned result, not stale context

        if (!dropType) return;

        if (result.accepted) {
            // ✅ VALID DROP — snap to exact node position
            const snapped = snapToGrid(result.x, result.y);
            const newComp: ComponentInstance = {
                id: freshId(dropType),
                type: dropType,
                x: snapped.x,
                y: snapped.y,
                connectedNodes: result.snapNodeId ? [result.snapNodeId] : [],
                ...(dropType === 'switch' ? { isOpen: true } : {}),
            };

            setComponents(prev => [...prev, newComp]);
            setRipple({ x: snapped.x, y: snapped.y });
            setBouncingId(newComp.id);
            setTimeout(() => setBouncingId(null), 500);

            onDialogueTrigger?.(
                `${dropType.charAt(0).toUpperCase() + dropType.slice(1)} locked to snap node.`,
                'happy'
            );
        } else {
            // ❌ INVALID DROP — reject with red flash
            setRejectFlash({ x: svgX, y: svgY });
            onDialogueTrigger?.("No valid snap point nearby. Try closer to a connection node.", 'talking');
        }
    }, [tray, clientToSVG, snapNodes, onDialogueTrigger]);

    // Also handle pointer up on window (in case pointer leaves canvas bounds)
    useEffect(() => {
        const onGlobalUp = () => {
            if (tray.isDragging) {
                tray.cancelDrag();
            }
        };
        window.addEventListener('pointerup', onGlobalUp);
        return () => window.removeEventListener('pointerup', onGlobalUp);
    }, [tray]);

    // ── Wire path helpers ────────────────────────────────
    const getNodePos = (compId: string, node: 'in' | 'out') => {
        const comp = components.find(c => c.id === compId);
        if (!comp) return { x: 0, y: 0 };
        if (comp.type === 'battery') return { x: comp.x, y: comp.y + (node === 'in' ? -40 : 40) };
        if (comp.type === 'switch') return { x: comp.x + (node === 'in' ? -30 : 30), y: comp.y };
        if (comp.type === 'resistor') return { x: comp.x + (node === 'in' ? -45 : 45), y: comp.y };
        if (comp.type === 'bulb') return { x: comp.x + (node === 'in' ? -28 : 28), y: comp.y };
        return { x: comp.x, y: comp.y };
    };

    const getWirePath = (wire: WireConnection) => {
        const s = getNodePos(wire.fromId, wire.fromNode);
        const e = getNodePos(wire.toId, wire.toNode);
        if (s.x === e.x || s.y === e.y) return [s, e];
        return [s, { x: e.x, y: s.y }, e];
    };

    const snapTargetCompId = magneticTarget?.compId ?? null;
    const isNearSnap = !!(tray.isDragging && tray.nearestSnap);

    // ─────────────────────────────────────────────────────
    //  RENDER
    // ─────────────────────────────────────────────────────
    return (
        <div
            ref={wrapperRef}
            className="w-full h-full relative overflow-hidden blueprint-grid"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ touchAction: 'none' }}
        >
            <svg
                ref={canvasRef}
                className="w-full h-full"
                style={{ cursor: draggingId ? 'grabbing' : tray.isDragging ? 'none' : 'crosshair' }}
            >
                <defs>
                    <filter id="nodeGlow" x="-80%" y="-80%" width="260%" height="260%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="compGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="snapNodeGlow" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    {/* Metallic gradient for snap nodes */}
                    <radialGradient id="snapNodeMetal" cx="40%" cy="35%">
                        <stop offset="0%" stopColor="#64748B" />
                        <stop offset="60%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#1E293B" />
                    </radialGradient>
                    <radialGradient id="snapNodeActive" cx="40%" cy="35%">
                        <stop offset="0%" stopColor="#67E8F9" />
                        <stop offset="60%" stopColor="#00D2FF" />
                        <stop offset="100%" stopColor="#0891B2" />
                    </radialGradient>
                </defs>

                {/* ── Wires ── */}
                {wires.map(wire => (
                    <WireTrace key={wire.id} path={getWirePath(wire)} active={isActive} />
                ))}

                {/* ── Corner junction nodes ── */}
                {wires.map(wire => {
                    const path = getWirePath(wire);
                    if (path.length < 3) return null;
                    const corner = path[1];
                    return (
                        <g key={`corner-${wire.id}`} filter={isActive ? 'url(#nodeGlow)' : undefined}>
                            <circle
                                cx={corner.x} cy={corner.y} r={10}
                                fill={isActive ? '#00D2FF' : '#1E293B'}
                                stroke={isActive ? '#FFFFFF' : '#334155'}
                                strokeWidth={2}
                            />
                            <circle cx={corner.x} cy={corner.y} r={3} fill="#FFFFFF" />
                            {isActive && (
                                <motion.circle
                                    cx={corner.x} cy={corner.y} r={10}
                                    fill="none" stroke="#00D2FF" strokeWidth={2}
                                    animate={{ r: [10, 20, 10], opacity: [0.8, 0, 0.8] }}
                                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            )}
                        </g>
                    );
                })}

                {/* ── Snap node visualization (visible during tray drag) ── */}
                {tray.isDragging && snapNodes.map(sn => {
                    const isNearest = tray.nearestSnap?.node.id === sn.id;
                    return (
                        <g key={sn.id} filter={isNearest ? 'url(#snapNodeGlow)' : undefined}>
                            {/* Outer attraction ring (only on nearest) */}
                            {isNearest && (
                                <motion.circle
                                    cx={sn.x} cy={sn.y} r={12}
                                    fill="none"
                                    stroke="#00D2FF"
                                    strokeWidth={2}
                                    strokeDasharray="3 3"
                                    animate={{ r: [12, 22, 12], opacity: [0.7, 0, 0.7] }}
                                    transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            )}
                            {/* Metallic snap node circle */}
                            <circle
                                cx={sn.x} cy={sn.y} r={6}
                                fill={isNearest ? 'url(#snapNodeActive)' : 'url(#snapNodeMetal)'}
                                stroke={isNearest ? '#00D2FF' : '#475569'}
                                strokeWidth={1.5}
                                style={{
                                    transition: 'fill 0.2s, stroke 0.2s',
                                    filter: isNearest ? 'drop-shadow(0 0 6px #00D2FF)' : undefined,
                                }}
                            />
                            {/* Inner highlight dot */}
                            <circle
                                cx={sn.x - 1.5} cy={sn.y - 1.5} r={1.5}
                                fill={isNearest ? '#FFFFFF' : '#64748B'}
                                opacity={0.7}
                            />
                        </g>
                    );
                })}

                {/* ── Circuit Components ── */}
                {components.map(comp => {
                    const isDrag = comp.id === draggingId;
                    const isSnap = comp.id === snapTargetCompId;
                    const isBouncing = comp.id === bouncingId;

                    return (
                        <motion.g
                            key={comp.id}
                            onMouseDown={e => handleMouseDown(e, comp.id)}
                            style={{
                                cursor: comp.type === 'switch' ? 'pointer' : isDrag ? 'grabbing' : 'grab',
                                filter: isDrag ? 'url(#compGlow)' : undefined,
                                opacity: isDrag ? 0.88 : 1,
                            }}
                            animate={{
                                x: comp.x,
                                y: comp.y,
                                scale: isBouncing ? [1, 1.1, 0.96, 1] : 1,
                            }}
                            transition={{
                                x: isDrag
                                    ? { type: 'tween', duration: 0 }
                                    : { type: 'spring', stiffness: 400, damping: 22 },
                                y: isDrag
                                    ? { type: 'tween', duration: 0 }
                                    : { type: 'spring', stiffness: 400, damping: 22 },
                                scale: { duration: 0.38, ease: [0.34, 1.56, 0.64, 1] },
                            }}
                        >
                            {comp.type === 'battery' && <LabBattery x={0} y={0} active={isActive} id={comp.id} isSnapTarget={isSnap} />}
                            {comp.type === 'bulb' && <LabBulb x={0} y={0} active={isActive} id={comp.id} isSnapTarget={isSnap} />}
                            {comp.type === 'resistor' && <LabResistor x={0} y={0} active={isActive} id={comp.id} isSnapTarget={isSnap} />}
                            {comp.type === 'switch' && <LabSwitch x={0} y={0} active={isActive} id={comp.id} isSnapTarget={isSnap} isOpen={!!comp.isOpen} />}
                        </motion.g>
                    );
                })}

                {/* ── Ghost preview during tray drag ── */}
                <AnimatePresence>
                    {tray.isDragging && tray.dragType && (
                        <GhostPreview
                            type={tray.dragType}
                            x={tray.cursorX}
                            y={tray.cursorY}
                            isNearSnap={isNearSnap}
                        />
                    )}
                </AnimatePresence>

                {/* ── Dashed attraction line: ghost → nearest snap ── */}
                {tray.isDragging && tray.nearestSnap && (
                    <motion.line
                        x1={tray.cursorX} y1={tray.cursorY}
                        x2={tray.nearestSnap.node.x} y2={tray.nearestSnap.node.y}
                        stroke="#00D2FF" strokeWidth={1.2}
                        strokeDasharray="5 4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        style={{ pointerEvents: 'none' }}
                    />
                )}

                {/* ── On-canvas drag ghost + attraction line ── */}
                {draggingId && ghostPos && (
                    <g style={{ pointerEvents: 'none' }}>
                        <circle
                            cx={ghostPos.x} cy={ghostPos.y} r={6}
                            fill="none" stroke="#00D2FF" strokeWidth={1.5}
                            strokeDasharray="3 3" opacity={0.5}
                        />
                    </g>
                )}
                {draggingId && ghostPos && magneticTarget && (
                    <line
                        x1={ghostPos.x} y1={ghostPos.y}
                        x2={magneticTarget.x} y2={magneticTarget.y}
                        stroke="#00D2FF" strokeWidth={1}
                        strokeDasharray="4 4" opacity={0.55}
                        style={{ pointerEvents: 'none' }}
                    />
                )}

                {/* ── Drop effects ── */}
                {ripple && (
                    <DropRipple x={ripple.x} y={ripple.y} onComplete={() => setRipple(null)} />
                )}
                {rejectFlash && (
                    <RejectFlash x={rejectFlash.x} y={rejectFlash.y} onComplete={() => setRejectFlash(null)} />
                )}
            </svg>

            {/* ── SNAP label overlay ── */}
            <AnimatePresence>
                {tray.isDragging && tray.nearestSnap && (
                    <motion.div
                        key="snap-label-tray"
                        initial={{ opacity: 0, scale: 0.85, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.12 }}
                        className="absolute pointer-events-none z-20"
                        style={{
                            left: tray.nearestSnap.node.x,
                            top: tray.nearestSnap.node.y - 34,
                            transform: 'translateX(-50%)',
                            fontSize: 9,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            color: '#00D2FF',
                            background: 'rgba(0,210,255,0.15)',
                            border: '1px solid rgba(0,210,255,0.5)',
                            padding: '2px 8px',
                            borderRadius: 4,
                            backdropFilter: 'blur(4px)',
                        }}
                    >
                        SNAP
                    </motion.div>
                )}
                {draggingId && magneticTarget && (
                    <motion.div
                        key="snap-label-canvas"
                        initial={{ opacity: 0, scale: 0.85, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.12 }}
                        className="absolute pointer-events-none"
                        style={{
                            left: magneticTarget.x,
                            top: magneticTarget.y - 32,
                            transform: 'translateX(-50%)',
                            fontSize: 10,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            color: '#00D2FF',
                            background: 'rgba(0,210,255,0.12)',
                            border: '1px solid rgba(0,210,255,0.4)',
                            padding: '2px 8px',
                            borderRadius: 4,
                        }}
                    >
                        SNAP
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Idle hint ── */}
            {!draggingId && !tray.isDragging && (
                <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
                    style={{
                        fontSize: 10,
                        fontFamily: 'monospace',
                        color: 'rgba(148,163,184,0.35)',
                        letterSpacing: '0.15em',
                    }}
                >
                    DRAG FROM LEFT PANE • MAGNETIC SNAP ACTIVE
                </div>
            )}
        </div>
    );
};
