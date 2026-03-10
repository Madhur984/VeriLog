/**
 * components/workbench/CircuitCanvas.tsx — Main SVG Workspace (Net-Aware)
 *
 * Features:
 *  - Grid lines (10px spacing for Logisim standard)
 *  - Infinite-feeling zoom + pan
 *  - Drop zone for ComponentPalette tiles
 *  - Renders CanvasNode + WireLayer
 *  - Wire drawing: mouseDown + drag + mouseUp for orthogonal segments
 *  - Multi-select rubber-band
 *  - Right-click context menu
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useWorkbenchStore } from '../../stores/useWorkbenchStore';
import { CanvasNode } from './CanvasNode';
import { WireLayer } from './WireLayer';

interface Props {
    tool: 'select' | 'wire' | 'probe' | 'delete';
}

const GRID = 10;

function GridLines({ w, h }: { w: number; h: number }) {
    const cols = Math.ceil(w / GRID) + 2;
    const rows = Math.ceil(h / GRID) + 2;
    return (
        <g opacity={0.15}>
            {Array.from({ length: cols }, (_, i) => (
                <line key={`c${i}`} x1={i * GRID} y1={0} x2={i * GRID} y2={h + GRID} stroke="#94A3B8" strokeWidth={0.5} />
            ))}
            {Array.from({ length: rows }, (_, i) => (
                <line key={`r${i}`} x1={0} y1={i * GRID} x2={w + GRID} y2={i * GRID} stroke="#94A3B8" strokeWidth={0.5} />
            ))}
        </g>
    );
}

interface ContextMenuState {
    x: number; y: number;
}

export const CircuitCanvas: React.FC<Props> = ({ tool }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    // Zoom/Pan State
    const zoom = useWorkbenchStore(s => s.zoom);
    const panX = useWorkbenchStore(s => s.panX);
    const panY = useWorkbenchStore(s => s.panY);
    const setZoom = useWorkbenchStore(s => s.setZoom);
    const setPan = useWorkbenchStore(s => s.setPan);

    const [isPanning, setIsPanning] = useState(false);
    const panStart = useRef<{ mx: number; my: number; vx: number; vy: number } | null>(null);
    const [ctxMenu, setCtxMenu] = useState<ContextMenuState | null>(null);

    const {
        nodes, selectedIds,
        addNode, removeNode, removeSegment,
        startWire, updateWireInProgress, commitWire, cancelWire, wireInProgress,
        clearSelection
    } = useWorkbenchStore();

    // ── Resize observer ────────────────────────────────────────────────────
    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;
        const obs = new ResizeObserver(() => {
            // No-op for now unless we need the canvas size for other logic
        });
        obs.observe(svg);
        return () => obs.disconnect();
    }, []);

    // ── SVG coordinate helper ──────────────────────────────────────────────
    const clientToSvg = useCallback((cx: number, cy: number): { x: number; y: number } => {
        const svg = svgRef.current;
        if (!svg) return { x: cx, y: cy };
        const pt = svg.createSVGPoint();
        pt.x = cx; pt.y = cy;
        const m = svg.getScreenCTM()?.inverse();
        if (!m) return { x: cx, y: cy };
        const r = pt.matrixTransform(m);
        return { x: r.x, y: r.y };
    }, []);

    const snapToGrid = (v: number) => Math.round(v / GRID);

    // ── Zoom ───────────────────────────────────────────────────────────────
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();

        // Zoom toward mouse pointer
        const { x: svgX, y: svgY } = clientToSvg(e.clientX, e.clientY);

        const newZoom = Math.max(0.2, Math.min(3, zoom * (e.deltaY < 0 ? 1.1 : 0.9)));
        const zoomRatio = newZoom / zoom;

        setZoom(newZoom);
        setPan(
            svgX - (svgX - panX) * zoomRatio,
            svgY - (svgY - panY) * zoomRatio
        );
    }, [clientToSvg, zoom, panX, panY, setZoom, setPan]);

    // ── Mouse Interaction ──────────────────────────────────────────────────
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button === 1 || (e.button === 0 && e.altKey) || (e.button === 0 && tool === 'select')) {
            // Pan
            setIsPanning(true);
            panStart.current = { mx: e.clientX, my: e.clientY, vx: panX, vy: panY };
            return;
        }

        if (e.button === 0 && tool === 'wire') {
            const pt = clientToSvg(e.clientX, e.clientY);
            startWire(snapToGrid(pt.x), snapToGrid(pt.y));
        }
    }, [tool, panX, panY, clientToSvg, startWire]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isPanning && panStart.current) {
            const dx = (e.clientX - panStart.current.mx) / zoom;
            const dy = (e.clientY - panStart.current.my) / zoom;
            setPan(panStart.current.vx + dx, panStart.current.vy + dy);
            return;
        }

        if (wireInProgress && tool === 'wire') {
            const pt = clientToSvg(e.clientX, e.clientY);
            updateWireInProgress(snapToGrid(pt.x), snapToGrid(pt.y), e.altKey ? 'y' : 'x');
        }
    }, [isPanning, wireInProgress, tool, clientToSvg, zoom, setPan, updateWireInProgress]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
        panStart.current = null;

        if (tool === 'wire' && wireInProgress) {
            commitWire();
        }
    }, [tool, wireInProgress, commitWire]);

    // ── Canvas click (deselect / cancel wire) ─────────────────────────────
    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
        if (e.target === svgRef.current) {
            clearSelection();
            setCtxMenu(null);
        }
    }, [clearSelection]);

    // ── Drag-and-drop from palette ─────────────────────────────────────────
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const typeId = e.dataTransfer.getData('application/verilog-gate');
        if (!typeId) return;
        const pt = clientToSvg(e.clientX, e.clientY);
        addNode(typeId, snapToGrid(pt.x), snapToGrid(pt.y));
    }, [clientToSvg, addNode]);

    // ── Wire Start from Port ───────────────────────────────────────────────
    // Fired from CanvasNode.tsx when clicking a port
    const handleWireStart = useCallback((portX: number, portY: number) => {
        if (tool === 'wire') {
            startWire(portX, portY);
        }
    }, [tool, startWire]);

    // ── Context Menu ───────────────────────────────────────────────────────
    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setCtxMenu({ x: e.clientX, y: e.clientY });
    }, []);

    const closeCtxMenu = () => setCtxMenu(null);

    // ── Keyboard shortcuts ─────────────────────────────────────────────────
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { cancelWire(); clearSelection(); setCtxMenu(null); }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                selectedIds.forEach(id => {
                    if (id.startsWith('comp')) removeNode(id);
                    if (id.startsWith('seg')) removeSegment(id);
                });
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [cancelWire, clearSelection, selectedIds, removeNode, removeSegment]);

    // ── Render ────────────────────────────────────────────────────────────

    const nodeArr = Array.from(nodes.values());

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#07080C', overflow: 'hidden' }}>
            <svg
                ref={svgRef}
                width="100%" height="100%"
                style={{ cursor: isPanning ? 'grabbing' : tool === 'wire' ? 'crosshair' : 'default', display: 'block' }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onClick={handleCanvasClick}
                onContextMenu={handleContextMenu}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {/* Transform group for Zoom + Pan */}
                <g transform={`translate(${panX}, ${panY}) scale(${zoom})`}>

                    {/* Render a large enough grid grid */}
                    <GridLines w={4000} h={3000} />

                    {/* Wires first (behind gates) */}
                    <WireLayer />

                    {/* Nodes */}
                    {nodeArr.map(node => (
                        <CanvasNode
                            key={node.id}
                            nodeId={node.id}
                            tool={tool}
                            onWireStart={handleWireStart}
                        />
                    ))}
                </g>
            </svg>

            {/* Empty hint */}
            {nodeArr.length === 0 && (
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    color: '#1E293B', pointerEvents: 'none', userSelect: 'none',
                }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        Drag components from the palette
                    </div>
                </div>
            )}

            {/* Context Menu */}
            {ctxMenu && (
                <div
                    onMouseLeave={closeCtxMenu}
                    style={{
                        position: 'fixed', top: ctxMenu.y, left: ctxMenu.x, zIndex: 999,
                        background: '#0D0F16', border: '1px solid #1A1D24', borderRadius: 8,
                        padding: '4px', minWidth: 140,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    }}
                >
                    {[
                        {
                            label: '🗑 Delete Selected', action: () => {
                                selectedIds.forEach(id => {
                                    if (id.startsWith('comp')) removeNode(id);
                                    if (id.startsWith('seg')) removeSegment(id);
                                }); closeCtxMenu();
                            }
                        },
                        { label: '✖ Cancel Wire', action: () => { cancelWire(); closeCtxMenu(); } },
                    ].map(item => (
                        <button key={item.label} onClick={item.action} style={{
                            display: 'block', width: '100%', textAlign: 'left', padding: '7px 12px',
                            background: 'none', border: 'none', color: '#94A3B8', fontSize: 12,
                            fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', borderRadius: 4,
                        }}
                            onMouseEnter={e => { (e.target as HTMLElement).style.background = '#1A1D24'; }}
                            onMouseLeave={e => { (e.target as HTMLElement).style.background = 'none'; }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
