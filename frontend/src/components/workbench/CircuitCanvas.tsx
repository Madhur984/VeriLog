/**
 * components/workbench/CircuitCanvas.tsx — Main SVG Workspace
 *
 * Features:
 *  - Grid lines (24px spacing)
 *  - Infinite-feeling zoom + pan
 *  - Drop zone for ComponentPalette tiles (HTML5 DnD)
 *  - Renders CanvasNode + WireLayer
 *  - Wire drawing mode: click output port → click input port
 *  - Multi-select rubber-band
 *  - Right-click context menu (delete, duplicate, probe)
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useWorkbenchStore, type PortRef } from '../../stores/useWorkbenchStore';
import { CanvasNode } from './CanvasNode';
import { WireLayer } from './WireLayer';
import type { ComponentType } from '../../engine/types';

interface Props {
    tool: 'select' | 'wire' | 'probe' | 'delete';
}

// ── Grid ──────────────────────────────────────────────────────────────────

const GRID = 24;

function GridLines({ w, h }: { w: number; h: number }) {
    const cols = Math.ceil(w / GRID) + 2;
    const rows = Math.ceil(h / GRID) + 2;
    return (
        <g opacity={0.06}>
            {Array.from({ length: cols }, (_, i) => (
                <line key={`c${i}`} x1={i * GRID} y1={0} x2={i * GRID} y2={h + GRID} stroke="#94A3B8" strokeWidth={0.5} />
            ))}
            {Array.from({ length: rows }, (_, i) => (
                <line key={`r${i}`} x1={0} y1={i * GRID} x2={w + GRID} y2={i * GRID} stroke="#94A3B8" strokeWidth={0.5} />
            ))}
        </g>
    );
}

// ── Context Menu ──────────────────────────────────────────────────────────

interface ContextMenuState {
    x: number; y: number;
    nodeId?: string; wireId?: string;
}

// ── Main ──────────────────────────────────────────────────────────────────

export const CircuitCanvas: React.FC<Props> = ({ tool }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 1200, h: 800 });
    const [isPanning, setIsPanning] = useState(false);
    const panStart = useRef<{ mx: number; my: number; vx: number; vy: number } | null>(null);

    const [ctxMenu, setCtxMenu] = useState<ContextMenuState | null>(null);
    const [canvasSize, setCanvasSize] = useState({ w: 1200, h: 800 });

    const {
        nodes, wires, snapshot, selectedIds,
        addNode, removeNode, addWire, startWire, cancelWire, wireInProgress,
        updateWireInProgress, clearSelection, addProbe, removeWire,
    } = useWorkbenchStore();

    // ── Resize observer ────────────────────────────────────────────────────

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;
        const obs = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect;
            setCanvasSize({ w: width, h: height });
            setViewBox(v => ({ ...v, w: width, h: height }));
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

    const snapToGrid = (v: number) => Math.round(v / GRID) * GRID;

    // ── Zoom ───────────────────────────────────────────────────────────────

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const { x: svgX, y: svgY } = clientToSvg(e.clientX, e.clientY);
        const factor = e.deltaY < 0 ? 0.9 : 1.1;
        setViewBox(v => {
            const newW = Math.max(400, Math.min(3000, v.w * factor));
            const newH = Math.max(300, Math.min(2000, v.h * factor));
            const dx = (svgX - v.x) * (1 - factor);
            const dy = (svgY - v.y) * (1 - factor);
            return { x: v.x - dx, y: v.y - dy, w: newW, h: newH };
        });
    }, [clientToSvg]);

    // ── Pan ────────────────────────────────────────────────────────────────

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button === 1 || (e.button === 0 && e.altKey)) {
            setIsPanning(true);
            panStart.current = { mx: e.clientX, my: e.clientY, vx: viewBox.x, vy: viewBox.y };
        }
    }, [viewBox]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isPanning && panStart.current) {
            const dx = (e.clientX - panStart.current.mx) * (viewBox.w / canvasSize.w);
            const dy = (e.clientY - panStart.current.my) * (viewBox.h / canvasSize.h);
            setViewBox(v => ({ ...v, x: panStart.current!.vx - dx, y: panStart.current!.vy - dy }));
        }
        if (wireInProgress) {
            const pos = clientToSvg(e.clientX, e.clientY);
            updateWireInProgress(pos.x, pos.y);
        }
    }, [isPanning, viewBox, canvasSize, wireInProgress, clientToSvg, updateWireInProgress]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
        panStart.current = null;
    }, []);

    // ── Canvas click (deselect / cancel wire) ─────────────────────────────

    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
        if (e.target === svgRef.current) {
            clearSelection();
            if (wireInProgress) cancelWire();
            setCtxMenu(null);
        }
    }, [clearSelection, wireInProgress, cancelWire]);

    // ── Drag-and-drop from palette ─────────────────────────────────────────

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const typeId = e.dataTransfer.getData('application/verilog-gate') as ComponentType;
        if (!typeId) return;
        const { x, y } = clientToSvg(e.clientX, e.clientY);
        addNode(typeId, snapToGrid(x), snapToGrid(y));
    }, [clientToSvg, addNode]);

    // ── Wire endpoint click ────────────────────────────────────────────────

    const handleWireStart = useCallback((ref: PortRef) => {
        if (!wireInProgress) {
            startWire(ref);
        } else {
            // Complete the wire
            addWire(wireInProgress.from, ref);
        }
    }, [wireInProgress, startWire, addWire]);

    // ── Right-click context menu ───────────────────────────────────────────

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setCtxMenu({ x: e.clientX, y: e.clientY });
    }, []);

    const closeCtxMenu = () => setCtxMenu(null);

    // ── Keyboard shortcuts ─────────────────────────────────────────────────

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { cancelWire(); clearSelection(); }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                selectedIds.forEach(id => {
                    if (nodes.has(id)) removeNode(id);
                    if (wires.has(id)) removeWire(id);
                });
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [cancelWire, clearSelection, selectedIds, nodes, wires, removeNode, removeWire]);

    // ── Render ────────────────────────────────────────────────────────────

    const nodeArr = Array.from(nodes.values());

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#07080C', overflow: 'hidden' }}>
            <svg
                ref={svgRef}
                width="100%" height="100%"
                viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
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
                <GridLines w={canvasSize.w + viewBox.x + 200} h={canvasSize.h + viewBox.y + 200} />

                {/* Wires first (behind gates) */}
                <WireLayer />

                {/* Nodes */}
                {nodeArr.map(node => {
                    const portStates = snapshot.get(node.id) ?? [];
                    return (
                        <CanvasNode
                            key={node.id}
                            node={node}
                            portStates={portStates}
                            tool={tool}
                            onWireStart={handleWireStart}
                        />
                    );
                })}
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
                        Drag gates from the palette
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
                        { label: '🗑 Delete Selected', action: () => { selectedIds.forEach(id => { if (nodes.has(id)) removeNode(id); if (wires.has(id)) removeWire(id); }); closeCtxMenu(); } },
                        { label: '📍 Add Probe', action: () => { selectedIds.forEach(id => { if (nodes.has(id)) addProbe(id); }); closeCtxMenu(); } },
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
