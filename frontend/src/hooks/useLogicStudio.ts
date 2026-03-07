/**
 * useLogicStudio.ts — Bridge between React and MURE engine
 *
 * Manages the engine instance, canvas state, selected nodes,
 * and provides actions for the Digital Logic Studio.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { MUREEngine } from '../mure/MUREEngine';
import { NodeType, type NodeId } from '../mure/core/SignalNode';
import type { PortState } from '../mure/core/Port';

// ─── Types ──────────────────────────────────────────────────────────────

export interface CanvasNode {
    id: NodeId;
    type: NodeType;
    x: number;
    y: number;
    label: string;
    params: Record<string, unknown>;
}

export type StudioMode = 'select' | 'wire' | 'probe' | 'xray';

export interface WireStart {
    nodeId: NodeId;
    portIndex: number;
    isOutput: boolean;
}

// ─── Hook ───────────────────────────────────────────────────────────────

export function useLogicStudio() {
    const engineRef = useRef(new MUREEngine());
    const [canvasNodes, setCanvasNodes] = useState<CanvasNode[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<NodeId | null>(null);
    const [mode, setMode] = useState<StudioMode>('select');
    const [isRunning, setIsRunning] = useState(false);
    const [simTime, setSimTime] = useState(0);
    const [snapshot, setSnapshot] = useState<Map<NodeId, PortState[]>>(new Map());
    const [wireStart, setWireStart] = useState<WireStart | null>(null);
    const [probedNodes, setProbedNodes] = useState<Set<NodeId>>(new Set());
    const [xrayEnabled, setXrayEnabled] = useState(false);
    const animRef = useRef<number>(0);

    const engine = engineRef.current;

    // ─── Node Management ──────────────────────────────────

    const addNode = useCallback((type: NodeType, x: number, y: number, params?: Record<string, unknown>) => {
        const nodeId = engine.addNode(type, params);
        const label = NodeType[type] || type.toString();

        setCanvasNodes((prev) => [
            ...prev,
            { id: nodeId, type, x, y, label, params: params || {} },
        ]);

        return nodeId;
    }, [engine]);

    const removeNode = useCallback((nodeId: NodeId) => {
        engine.removeNode(nodeId);
        setCanvasNodes((prev) => prev.filter((n) => n.id !== nodeId));
        if (selectedNodeId === nodeId) setSelectedNodeId(null);
    }, [engine, selectedNodeId]);

    const moveNode = useCallback((nodeId: NodeId, x: number, y: number) => {
        setCanvasNodes((prev) =>
            prev.map((n) => (n.id === nodeId ? { ...n, x, y } : n))
        );
    }, []);

    const updateNodeParams = useCallback((nodeId: NodeId, params: Record<string, unknown>) => {
        engine.setNodeParams(nodeId, params);
        setCanvasNodes((prev) =>
            prev.map((n) => (n.id === nodeId ? { ...n, params: { ...n.params, ...params } } : n))
        );
    }, [engine]);

    // ─── Wiring ───────────────────────────────────────────

    const startWire = useCallback((nodeId: NodeId, portIndex: number, isOutput: boolean) => {
        setWireStart({ nodeId, portIndex, isOutput });
    }, []);

    const completeWire = useCallback((targetNodeId: NodeId, targetPortIndex: number) => {
        if (!wireStart) return false;

        try {
            if (wireStart.isOutput) {
                engine.connectNodes(wireStart.nodeId, wireStart.portIndex, targetNodeId, targetPortIndex);
            } else {
                engine.connectNodes(targetNodeId, targetPortIndex, wireStart.nodeId, wireStart.portIndex);
            }
            setWireStart(null);
            return true;
        } catch {
            setWireStart(null);
            return false;
        }
    }, [engine, wireStart]);

    const cancelWire = useCallback(() => setWireStart(null), []);

    // ─── Simulation Control ───────────────────────────────

    const doStep = useCallback(() => {
        engine.simulateStep(1000); // 1μs step
        setSimTime(engine.currentTimeNs);
        setSnapshot(engine.snapshot());
    }, [engine]);

    const flush = useCallback(() => {
        engine.flush();
        setSnapshot(engine.snapshot());
    }, [engine]);

    const play = useCallback(() => {
        setIsRunning(true);
    }, []);

    const pause = useCallback(() => {
        setIsRunning(false);
    }, []);

    const reset = useCallback(() => {
        setIsRunning(false);
        engine.reset();
        engine.markAllDirty();
        engine.flush();
        setSimTime(0);
        setSnapshot(engine.snapshot());
    }, [engine]);

    // Animation loop
    useEffect(() => {
        if (!isRunning) {
            cancelAnimationFrame(animRef.current);
            return;
        }

        const loop = () => {
            engine.simulateStep(1000);
            setSimTime(engine.currentTimeNs);
            setSnapshot(engine.snapshot());
            animRef.current = requestAnimationFrame(loop);
        };

        animRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animRef.current);
    }, [isRunning, engine]);

    // ─── Probe ────────────────────────────────────────────

    const toggleProbe = useCallback((nodeId: NodeId) => {
        setProbedNodes((prev) => {
            const next = new Set(prev);
            if (next.has(nodeId)) next.delete(nodeId);
            else next.add(nodeId);
            return next;
        });
    }, []);

    // ─── Getters ──────────────────────────────────────────

    const getSignal = useCallback((nodeId: NodeId, portIndex: number) => {
        return engine.getSignal(nodeId, portIndex);
    }, [engine]);

    const getTrace = useCallback((nodeId: NodeId, portIndex: number) => {
        return engine.getTrace(nodeId, portIndex);
    }, [engine]);

    const getNodeEdges = useCallback(() => {
        return engine.edges;
    }, [engine]);

    return {
        // State
        canvasNodes,
        selectedNodeId,
        mode,
        isRunning,
        simTime,
        snapshot,
        wireStart,
        probedNodes,
        xrayEnabled,

        // Node actions
        addNode,
        removeNode,
        moveNode,
        updateNodeParams,
        setSelectedNodeId,

        // Wire actions
        startWire,
        completeWire,
        cancelWire,

        // Simulation
        play,
        pause,
        doStep,
        flush,
        reset,

        // Mode
        setMode,
        setXrayEnabled,

        // Probe
        toggleProbe,

        // Getters
        getSignal,
        getTrace,
        getNodeEdges,
    };
}
