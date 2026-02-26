import { useCallback, useRef, useState, type RefObject } from 'react';
import type { CircuitComponent, WireSegment } from './types';

const W = 1200;
const H = 700;
const SNAP_RADIUS = 36;

interface CanvasProps {
    components: CircuitComponent[];
    wires: WireSegment[];
    isCircuitClosed: boolean;
    liveWireIds: Set<string>;
    onUpdateComponent: (id: string, update: Partial<CircuitComponent>) => void;
    onToggleSwitch: (id: string) => void;
    onAddWire: (from: string, to: string) => void;
    onConnectAnchors: (a: string, b: string) => void;
    svgRef: RefObject<SVGSVGElement>;
}

function getAnchorPos(comp: CircuitComponent, anchorId: string): { x: number; y: number } | null {
    const anchor = comp.anchors.find((a) => a.id === anchorId);
    if (!anchor) return null;
    return { x: comp.position.x + anchor.offset.x, y: comp.position.y + anchor.offset.y };
}

// ── Tiny SVG component renderers ─────────────────────────────────────────────

function BatterySVG({ x, y, glow }: { x: number; y: number; glow: boolean }) {
    const c = glow ? '#00BFFF' : '#2a6e8a';
    const gf = glow ? 'url(#glow-filter)' : undefined;
    return (
        <g transform={`translate(${x},${y})`} filter={gf}>
            {/* Body */}
            <rect x={-12} y={-38} width={24} height={76} rx={4}
                fill="#0a1929" stroke={c} strokeWidth={glow ? 2 : 1.5} />
            {/* Lines */}
            {[-20, -10, 0, 10, 20].map((dy, i) => (
                <line key={i} x1={-9} y1={dy} x2={9} y2={dy} stroke={c} strokeWidth={1} opacity={0.5} />
            ))}
            {/* Terminals */}
            <line x1={0} y1={-38} x2={0} y2={-52} stroke="#22c55e" strokeWidth={2.5} strokeLinecap="round" />
            <text x={4} y={-54} fill="#22c55e" fontSize={9} fontFamily="monospace">+</text>
            <line x1={0} y1={38} x2={0} y2={52} stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" />
            <text x={4} y={60} fill="#ef4444" fontSize={9} fontFamily="monospace">−</text>
            {glow && (
                <circle cx={0} cy={0} r={50} fill="#00BFFF" opacity={0.04} />
            )}
        </g>
    );
}

function ResistorSVG({ x, y, glow }: { x: number; y: number; glow: boolean }) {
    const c = glow ? '#f59e0b' : '#2a6e8a';
    const gf = glow ? 'url(#glow-filter)' : undefined;
    return (
        <g transform={`translate(${x},${y})`} filter={gf}>
            <line x1={-34} y1={0} x2={-18} y2={0} stroke={c} strokeWidth={2} strokeLinecap="round" />
            <rect x={-18} y={-10} width={36} height={20} rx={3}
                fill="#0a1929" stroke={c} strokeWidth={glow ? 2 : 1.5} />
            <path d="M-12,-5 L-6,5 L0,-5 L6,5 L12,-5" fill="none" stroke={c} strokeWidth={1.2} strokeLinecap="round" />
            <line x1={18} y1={0} x2={34} y2={0} stroke={c} strokeWidth={2} strokeLinecap="round" />
        </g>
    );
}

function SwitchSVG({ x, y, glow, closed }: { x: number; y: number; glow: boolean; closed: boolean }) {
    const c = closed ? '#22c55e' : '#2a6e8a';
    const gf = glow ? 'url(#glow-filter)' : undefined;
    return (
        <g transform={`translate(${x},${y})`} filter={gf}>
            <line x1={-44} y1={0} x2={-20} y2={0} stroke={c} strokeWidth={2} strokeLinecap="round" />
            <circle cx={-20} cy={0} r={4} fill="#0a1929" stroke={c} strokeWidth={1.5} />
            {closed
                ? <line x1={-20} y1={0} x2={20} y2={0} stroke={c} strokeWidth={2.5} strokeLinecap="round" />
                : <line x1={-20} y1={0} x2={16} y2={-18} stroke={c} strokeWidth={2.5} strokeLinecap="round" />
            }
            <circle cx={20} cy={0} r={4} fill="#0a1929" stroke={c} strokeWidth={1.5} />
            <line x1={20} y1={0} x2={44} y2={0} stroke={c} strokeWidth={2} strokeLinecap="round" />
            <text x={0} y={20} textAnchor="middle" fill={c} fontSize={8} fontFamily="monospace" opacity={0.7}>
                {closed ? 'ON' : 'OFF'}
            </text>
        </g>
    );
}

function BulbSVG({ x, y, glow }: { x: number; y: number; glow: boolean }) {
    const c = glow ? '#fbbf24' : '#2a6e8a';
    const gf = glow ? 'url(#bulb-glow-filter)' : undefined;
    return (
        <g transform={`translate(${x},${y})`}>
            {glow && <circle cx={0} cy={-18} r={36} fill="#fbbf24" opacity={0.08} />}
            <g filter={gf}>
                <circle cx={0} cy={-22} r={18} fill={glow ? '#0f1f05' : '#0a1929'} stroke={c} strokeWidth={glow ? 2 : 1.5} />
                {glow && (
                    <>
                        <path d="M-6,-28 L-2,-18 L2,-18 L6,-28" fill={c} opacity={0.9} />
                        <path d="M-4,-30 L0,-20 L4,-30" fill={c} opacity={0.6} />
                    </>
                )}
                <line x1={-8} y1={-4} x2={8} y2={-4} stroke={c} strokeWidth={1} />
                <line x1={-8} y1={0} x2={8} y2={0} stroke={c} strokeWidth={1} />
                <rect x={-8} y={-4} width={16} height={32} rx={2}
                    fill="#0a1929" stroke={c} strokeWidth={glow ? 2 : 1.5} />
                <line x1={-14} y1={28} x2={14} y2={28} stroke={c} strokeWidth={1.5} />
            </g>
            {/* Terminals */}
            <line x1={-14} y1={28} x2={-14} y2={28} stroke={c} strokeWidth={1.5} />
        </g>
    );
}

// ── Anchor dot ────────────────────────────────────────────────────────────────

function AnchorDot({ id, x, y, connected, onWireStart }: {
    id: string; x: number; y: number; connected: boolean;
    onWireStart: (id: string, x: number, y: number) => void;
}) {
    return (
        <circle
            cx={x} cy={y} r={connected ? 5 : 6}
            fill={connected ? '#22c55e' : '#00BFFF'}
            stroke={connected ? '#16a34a' : '#0080aa'}
            strokeWidth={1.5}
            opacity={connected ? 1 : 0.7}
            style={{ cursor: 'crosshair' }}
            onMouseDown={(e) => {
                e.stopPropagation();
                onWireStart(id, x, y);
            }}
        />
    );
}

// ── Main Canvas ───────────────────────────────────────────────────────────────

export function Canvas({
    components, wires, isCircuitClosed, liveWireIds,
    onUpdateComponent, onToggleSwitch, onAddWire, onConnectAnchors, svgRef,
}: CanvasProps) {
    const [dragging, setDragging] = useState<{ id: string; ox: number; oy: number } | null>(null);
    const [wireStart, setWireStart] = useState<{ anchorId: string; x: number; y: number } | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const svgBounds = useRef<DOMRect | null>(null);

    const toSVG = (clientX: number, clientY: number) => {
        if (!svgBounds.current) {
            svgBounds.current = svgRef.current?.getBoundingClientRect() ?? null;
        }
        const b = svgBounds.current;
        if (!b) return { x: clientX, y: clientY };
        const scaleX = W / b.width;
        const scaleY = H / b.height;
        return { x: (clientX - b.left) * scaleX, y: (clientY - b.top) * scaleY };
    };

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        svgBounds.current = svgRef.current?.getBoundingClientRect() ?? null;
        const pos = toSVG(e.clientX, e.clientY);
        setMousePos(pos);

        if (dragging) {
            onUpdateComponent(dragging.id, {
                position: { x: pos.x - dragging.ox, y: pos.y - dragging.oy },
            });
        }
    }, [dragging, onUpdateComponent]);

    const handleMouseUp = useCallback((e: React.MouseEvent) => {
        if (dragging) setDragging(null);

        if (wireStart) {
            const pos = toSVG(e.clientX, e.clientY);
            // Find a nearby anchor to snap to
            let closest: { anchorId: string; dist: number } | null = null;
            for (const comp of components) {
                for (const anchor of comp.anchors) {
                    const ax = comp.position.x + anchor.offset.x;
                    const ay = comp.position.y + anchor.offset.y;
                    const dist = Math.hypot(ax - pos.x, ay - pos.y);
                    if (dist < SNAP_RADIUS && anchor.id !== wireStart.anchorId) {
                        if (!closest || dist < closest.dist) closest = { anchorId: anchor.id, dist };
                    }
                }
            }
            if (closest) {
                onAddWire(wireStart.anchorId, closest.anchorId);
                onConnectAnchors(wireStart.anchorId, closest.anchorId);
            }
            setWireStart(null);
        }
    }, [dragging, wireStart, components, onAddWire, onConnectAnchors]);

    const handleComponentMouseDown = (compId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        svgBounds.current = svgRef.current?.getBoundingClientRect() ?? null;
        const pos = toSVG(e.clientX, e.clientY);
        const comp = components.find((c) => c.id === compId)!;
        setDragging({ id: compId, ox: pos.x - comp.position.x, oy: pos.y - comp.position.y });
    };

    const handleWireStart = (anchorId: string, x: number, y: number) => {
        setWireStart({ anchorId, x, y });
    };

    return (
        <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ display: 'block', userSelect: 'none' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { setDragging(null); setWireStart(null); }}
        >
            <defs>
                <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feFlood floodColor="#00BFFF" floodOpacity="0.4" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                    <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="bulb-glow-filter" x="-80%" y="-80%" width="260%" height="260%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feFlood floodColor="#fbbf24" floodOpacity="0.5" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                    <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="electron-glow" x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feFlood floodColor="#00BFFF" floodOpacity="0.8" />
                    <feComposite in2="blur" operator="in" result="glow" />
                    <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                {/* Blueprint grid */}
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,191,255,0.04)" strokeWidth="0.5" />
                </pattern>
            </defs>

            {/* Background grid */}
            <rect width={W} height={H} fill="url(#grid)" />

            {/* Wires */}
            {wires.map((wire) => {
                const fromComp = components.find((c) => c.anchors.some((a) => a.id === wire.fromAnchorId));
                const toComp = components.find((c) => c.anchors.some((a) => a.id === wire.toAnchorId));
                if (!fromComp || !toComp) return null;
                const from = getAnchorPos(fromComp, wire.fromAnchorId);
                const to = getAnchorPos(toComp, wire.toAnchorId);
                if (!from || !to) return null;
                const live = liveWireIds.has(wire.id);
                return (
                    <line key={wire.id}
                        x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                        stroke={live ? '#00BFFF' : '#1a4a6a'}
                        strokeWidth={live ? 2.5 : 1.5}
                        strokeLinecap="round"
                        filter={live ? 'url(#glow-filter)' : undefined}
                        opacity={live ? 1 : 0.5}
                    />
                );
            })}

            {/* Wire in progress */}
            {wireStart && (
                <line
                    x1={wireStart.x} y1={wireStart.y}
                    x2={mousePos.x} y2={mousePos.y}
                    stroke="#00BFFF" strokeWidth={1.5} strokeDasharray="6 4"
                    strokeLinecap="round" opacity={0.8}
                />
            )}

            {/* Components */}
            {components.map((comp) => {
                const { x, y } = comp.position;
                const live = isCircuitClosed && comp.anchors.some((a) => {
                    return wires.some((w) => liveWireIds.has(w.id) &&
                        (w.fromAnchorId === a.id || w.toAnchorId === a.id));
                });

                return (
                    <g key={comp.id}
                        style={{ cursor: dragging?.id === comp.id ? 'grabbing' : 'grab' }}
                        onMouseDown={(e) => {
                            if (comp.type === 'switch') {
                                // double-click or separate click for toggle handled below
                            }
                            handleComponentMouseDown(comp.id, e);
                        }}
                        onDoubleClick={() => comp.type === 'switch' && onToggleSwitch(comp.id)}
                    >
                        {comp.type === 'battery' && <BatterySVG x={x} y={y} glow={live} />}
                        {comp.type === 'resistor' && <ResistorSVG x={x} y={y} glow={live} />}
                        {comp.type === 'switch' && <SwitchSVG x={x} y={y} glow={live} closed={!!comp.isClosed} />}
                        {comp.type === 'bulb' && <BulbSVG x={x} y={y} glow={live} />}

                        {/* Anchor dots */}
                        {comp.anchors.map((anchor) => {
                            const ax = x + anchor.offset.x;
                            const ay = y + anchor.offset.y;
                            return (
                                <AnchorDot
                                    key={anchor.id}
                                    id={anchor.id}
                                    x={ax} y={ay}
                                    connected={!!anchor.connectedTo}
                                    onWireStart={handleWireStart}
                                />
                            );
                        })}

                        {/* Component label */}
                        <text x={x} y={y - getR(comp)} textAnchor="middle"
                            fill="#2a5a7a" fontSize={9} fontFamily="'Courier New', monospace"
                            letterSpacing={1}>
                            {comp.type.toUpperCase()}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

function getR(comp: CircuitComponent): number {
    return comp.type === 'battery' ? 60 : comp.type === 'bulb' ? 50 : 20;
}
