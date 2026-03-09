/**
 * useCircuitDebugger.ts — Debugger state machine for circuit simulation
 *
 * States: idle → running → paused → stepping → breakpoint_hit
 * Manages breakpoints, watch signals, and step-through execution.
 */

import { useState, useCallback, useRef, useMemo } from 'react';
import type { NodeId } from '../mure/core/SignalNode';
import type { PortState } from '../mure/core/Port';

// ─── Types ──────────────────────────────────────────────────────────────

export type DebugState = 'idle' | 'running' | 'paused' | 'stepping' | 'breakpoint_hit';

export interface Breakpoint {
    id: string;
    nodeId: NodeId;
    portIndex: number;
    condition: 'rising' | 'falling' | 'high' | 'low' | 'change';
    enabled: boolean;
    hitCount: number;
}

export interface WatchSignal {
    nodeId: NodeId;
    portIndex: number;
    label: string;
    currentValue: PortState | null;
    history: { time: number; voltage: number; logic: boolean }[];
}

export interface DebuggerContext {
    state: DebugState;
    currentTimeNs: number;
    breakpoints: Breakpoint[];
    watchSignals: WatchSignal[];
    activeBreakpoint: Breakpoint | null;
    stepCount: number;

    // Actions
    play: () => void;
    pause: () => void;
    step: () => void;
    reset: () => void;
    addBreakpoint: (nodeId: NodeId, portIndex: number, condition: Breakpoint['condition']) => void;
    removeBreakpoint: (id: string) => void;
    toggleBreakpoint: (id: string) => void;
    addWatch: (nodeId: NodeId, portIndex: number, label: string) => void;
    removeWatch: (nodeId: NodeId, portIndex: number) => void;
    clearAllBreakpoints: () => void;
}

// ─── Hook ───────────────────────────────────────────────────────────────

let bpCounter = 0;

export function useCircuitDebugger(): DebuggerContext {
    const [state, setState] = useState<DebugState>('idle');
    const [currentTimeNs, setCurrentTimeNs] = useState(0);
    const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([]);
    const [watchSignals, setWatchSignals] = useState<WatchSignal[]>([]);
    const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoint | null>(null);
    const [stepCount, setStepCount] = useState(0);
    const prevValues = useRef<Map<string, PortState>>(new Map());

    const play = useCallback(() => {
        setState('running');
        setActiveBreakpoint(null);
    }, []);

    const pause = useCallback(() => {
        setState('paused');
    }, []);

    const step = useCallback(() => {
        setState('stepping');
        setStepCount(c => c + 1);
        setCurrentTimeNs(t => t + 100); // 100ns per step

        // After stepping, return to paused
        requestAnimationFrame(() => setState('paused'));
    }, []);

    const reset = useCallback(() => {
        setState('idle');
        setCurrentTimeNs(0);
        setStepCount(0);
        setActiveBreakpoint(null);
        prevValues.current.clear();
        setWatchSignals(ws => ws.map(w => ({ ...w, currentValue: null, history: [] })));
    }, []);

    const addBreakpoint = useCallback((nodeId: NodeId, portIndex: number, condition: Breakpoint['condition']) => {
        const bp: Breakpoint = {
            id: `bp-${++bpCounter}`,
            nodeId,
            portIndex,
            condition,
            enabled: true,
            hitCount: 0,
        };
        setBreakpoints(prev => [...prev, bp]);
    }, []);

    const removeBreakpoint = useCallback((id: string) => {
        setBreakpoints(prev => prev.filter(bp => bp.id !== id));
    }, []);

    const toggleBreakpoint = useCallback((id: string) => {
        setBreakpoints(prev => prev.map(bp =>
            bp.id === id ? { ...bp, enabled: !bp.enabled } : bp
        ));
    }, []);

    const clearAllBreakpoints = useCallback(() => {
        setBreakpoints([]);
    }, []);

    const addWatch = useCallback((nodeId: NodeId, portIndex: number, label: string) => {
        setWatchSignals(prev => {
            const exists = prev.some(w => w.nodeId === nodeId && w.portIndex === portIndex);
            if (exists) return prev;
            return [...prev, { nodeId, portIndex, label, currentValue: null, history: [] }];
        });
    }, []);

    const removeWatch = useCallback((nodeId: NodeId, portIndex: number) => {
        setWatchSignals(prev => prev.filter(w => !(w.nodeId === nodeId && w.portIndex === portIndex)));
    }, []);

    return useMemo(() => ({
        state,
        currentTimeNs,
        breakpoints,
        watchSignals,
        activeBreakpoint,
        stepCount,
        play,
        pause,
        step,
        reset,
        addBreakpoint,
        removeBreakpoint,
        toggleBreakpoint,
        addWatch,
        removeWatch,
        clearAllBreakpoints,
    }), [state, currentTimeNs, breakpoints, watchSignals, activeBreakpoint, stepCount,
        play, pause, step, reset, addBreakpoint, removeBreakpoint, toggleBreakpoint,
        addWatch, removeWatch, clearAllBreakpoints]);
}
