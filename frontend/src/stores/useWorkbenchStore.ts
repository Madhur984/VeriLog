/**
 * stores/useWorkbenchStore.ts — Workbench Central State
 *
 * Zustand store that acts as the bridge between the UI and the CSE simulation engine.
 * All canvas state (nodes, wires, selection, sim clock, waveforms, probes) lives here.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ComponentType, ComponentParams, PortState } from '../engine/types';

// ── Canvas Types ────────────────────────────────────────────────────────────

export interface PortRef {
    nodeId: string;
    portIndex: number;
}

export interface WireData {
    id: string;
    from: PortRef;
    to: PortRef;
    isLive: boolean;
}

export interface CanvasNodeData {
    id: string;
    type: ComponentType;
    x: number;
    y: number;
    rotation: number;        // degrees: 0 | 90 | 180 | 270
    label: string;
    params: ComponentParams;
    inputCount: number;
    outputCount: number;
}

export interface WaveformSample {
    timeNs: number;
    logic: boolean;
    voltage: number;
}

export interface ProbeEntry {
    nodeId: string;
    label: string;
    color: string;
}

// ── Store Interface ─────────────────────────────────────────────────────────

interface WorkbenchState {
    // Circuit data
    nodes: Map<string, CanvasNodeData>;
    wires: Map<string, WireData>;

    // Selection
    selectedIds: Set<string>;
    hoveredId: string | null;
    wireInProgress: { from: PortRef; mouseX: number; mouseY: number } | null;

    // Simulation
    simRunning: boolean;
    simTimeNs: number;
    tickRateHz: number;

    // From CSE snapshots — Map<nodeId, PortState[]>
    snapshot: Map<string, PortState[]>;

    // Waveform probing
    probes: ProbeEntry[];
    waveformData: Record<string, WaveformSample[]>;   // keyed by nodeId

    // UI
    zoom: number;
    panX: number;
    panY: number;
    gridSize: number;

    // Actions
    addNode(type: ComponentType, x: number, y: number, params?: Partial<ComponentParams>): string;
    removeNode(id: string): void;
    moveNode(id: string, x: number, y: number): void;
    rotateNode(id: string): void;
    updateNodeParams(id: string, params: Partial<ComponentParams>): void;
    updateNodeLabel(id: string, label: string): void;

    addWire(from: PortRef, to: PortRef): string | null;
    removeWire(id: string): void;

    selectNode(id: string, multi?: boolean): void;
    selectWire(id: string, multi?: boolean): void;
    clearSelection(): void;
    setHovered(id: string | null): void;

    startWire(from: PortRef): void;
    updateWireInProgress(mouseX: number, mouseY: number): void;
    cancelWire(): void;

    addProbe(nodeId: string, label?: string): void;
    removeProbe(nodeId: string): void;

    applySnapshot(snapshot: Map<string, PortState[]>, timeNs: number): void;
    appendWaveformSample(nodeId: string, timeNs: number, logic: boolean, voltage: number): void;

    setSimRunning(running: boolean): void;
    setSimTime(ns: number): void;
    resetSim(): void;

    setZoom(zoom: number): void;
    setPan(x: number, y: number): void;

    clearCanvas(): void;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

let nodeCounter = 0;
let wireCounter = 0;

function nextNodeId() { return `n${++nodeCounter}`; }
function nextWireId() { return `w${++wireCounter}`; }

const PROBE_COLORS = ['#00D4FF', '#10B981', '#F59E0B', '#A78BFA', '#F472B6', '#FB923C', '#34D399'];

function getInputOutputCounts(type: ComponentType, params: ComponentParams): [number, number] {
    switch (type) {
        case 'NOT': case 'BUFFER': return [1, 1];
        case 'D_FF': return [2, 2];   // D, CLK → Q, Qn
        case 'JK_FF': return [3, 2];  // J, K, CLK → Q, Qn
        case 'SR_LATCH': return [2, 2]; // S, R → Q, Qn
        case 'T_FF': return [2, 2];   // T, CLK → Q, Qn
        case 'LED': case 'SEVEN_SEG': case 'BUZZER': return [1, 0];
        case 'BATTERY': case 'SWITCH_SPST': case 'PUSHBUTTON': return [0, 1];
        case 'GROUND': return [0, 1];
        case 'COMPARATOR': return [2, 1];
        default:
            return [params.inputCount ?? 2, 1];
    }
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useWorkbenchStore = create<WorkbenchState>()(
    immer((set, get) => ({
        nodes: new Map(),
        wires: new Map(),
        selectedIds: new Set(),
        hoveredId: null,
        wireInProgress: null,
        simRunning: false,
        simTimeNs: 0,
        tickRateHz: 1000,
        snapshot: new Map(),
        probes: [],
        waveformData: {},
        zoom: 1,
        panX: 0,
        panY: 0,
        gridSize: 24,

        // ── Node Actions ───────────────────────────────────────────────────────

        addNode(type, x, y, params = {}) {
            const id = nextNodeId();
            const [inputCount, outputCount] = getInputOutputCounts(type, params);
            const node: CanvasNodeData = {
                id, type, x, y,
                rotation: 0,
                label: `${type}_${nodeCounter}`,
                params: { ...params },
                inputCount,
                outputCount,
            };
            set(state => { state.nodes.set(id, node); });
            return id;
        },

        removeNode(id) {
            set(state => {
                state.nodes.delete(id);
                // Remove connected wires
                for (const [wid, wire] of state.wires) {
                    if (wire.from.nodeId === id || wire.to.nodeId === id) {
                        state.wires.delete(wid);
                    }
                }
                state.selectedIds.delete(id);
                state.probes = state.probes.filter(p => p.nodeId !== id);
                delete state.waveformData[id];
            });
        },

        moveNode(id, x, y) {
            set(state => {
                const node = state.nodes.get(id);
                if (node) { node.x = x; node.y = y; }
            });
        },

        rotateNode(id) {
            set(state => {
                const node = state.nodes.get(id);
                if (node) { node.rotation = (node.rotation + 90) % 360; }
            });
        },

        updateNodeParams(id, params) {
            set(state => {
                const node = state.nodes.get(id);
                if (node) { Object.assign(node.params, params); }
            });
        },

        updateNodeLabel(id, label) {
            set(state => {
                const node = state.nodes.get(id);
                if (node) { node.label = label; }
            });
        },

        // ── Wire Actions ───────────────────────────────────────────────────────

        addWire(from, to) {
            // Prevent self-loop
            if (from.nodeId === to.nodeId) return null;
            // Prevent duplicate wires
            for (const w of get().wires.values()) {
                if (w.from.nodeId === from.nodeId && w.from.portIndex === from.portIndex
                    && w.to.nodeId === to.nodeId && w.to.portIndex === to.portIndex) return null;
            }
            const id = nextWireId();
            set(state => {
                state.wires.set(id, { id, from, to, isLive: false });
                state.wireInProgress = null;
            });
            return id;
        },

        removeWire(id) {
            set(state => { state.wires.delete(id); state.selectedIds.delete(id); });
        },

        // ── Selection ──────────────────────────────────────────────────────────

        selectNode(id, multi = false) {
            set(state => {
                if (!multi) state.selectedIds.clear();
                if (state.selectedIds.has(id)) { state.selectedIds.delete(id); }
                else { state.selectedIds.add(id); }
            });
        },

        selectWire(id, multi = false) {
            set(state => {
                if (!multi) state.selectedIds.clear();
                state.selectedIds.add(id);
            });
        },

        clearSelection() {
            set(state => { state.selectedIds.clear(); });
        },

        setHovered(id) {
            set(state => { state.hoveredId = id; });
        },

        // ── Wire Drawing ───────────────────────────────────────────────────────

        startWire(from) {
            const node = get().nodes.get(from.nodeId);
            if (!node) return;
            set(state => {
                state.wireInProgress = { from, mouseX: node.x, mouseY: node.y };
            });
        },

        updateWireInProgress(mouseX, mouseY) {
            set(state => {
                if (state.wireInProgress) {
                    state.wireInProgress.mouseX = mouseX;
                    state.wireInProgress.mouseY = mouseY;
                }
            });
        },

        cancelWire() {
            set(state => { state.wireInProgress = null; });
        },

        // ── Probes ─────────────────────────────────────────────────────────────

        addProbe(nodeId, label) {
            const node = get().nodes.get(nodeId);
            if (!node || get().probes.some(p => p.nodeId === nodeId)) return;
            const color = PROBE_COLORS[get().probes.length % PROBE_COLORS.length];
            set(state => {
                state.probes.push({ nodeId, label: label ?? node.label, color });
                state.waveformData[nodeId] = [];
            });
        },

        removeProbe(nodeId) {
            set(state => {
                state.probes = state.probes.filter(p => p.nodeId !== nodeId);
                delete state.waveformData[nodeId];
            });
        },

        // ── Simulation ─────────────────────────────────────────────────────────

        applySnapshot(snapshot, timeNs) {
            set(state => {
                state.snapshot = snapshot;
                state.simTimeNs = timeNs;
                // Update wire liveness from snapshot
                for (const wire of state.wires.values()) {
                    const ports = snapshot.get(wire.from.nodeId);
                    if (ports) {
                        const port = ports[wire.from.portIndex];
                        wire.isLive = port?.logic ?? false;
                    }
                }
            });
        },

        appendWaveformSample(nodeId, timeNs, logic, voltage) {
            set(state => {
                if (state.waveformData[nodeId]) {
                    const samples = state.waveformData[nodeId];
                    // Keep rolling 2000-sample window
                    if (samples.length >= 2000) samples.shift();
                    samples.push({ timeNs, logic, voltage });
                }
            });
        },

        setSimRunning(running) {
            set(state => { state.simRunning = running; });
        },

        setSimTime(ns) {
            set(state => { state.simTimeNs = ns; });
        },

        resetSim() {
            set(state => {
                state.simRunning = false;
                state.simTimeNs = 0;
                state.snapshot = new Map();
                for (const nodeId of Object.keys(state.waveformData)) {
                    state.waveformData[nodeId] = [];
                }
                for (const wire of state.wires.values()) {
                    wire.isLive = false;
                }
            });
        },

        // ── View ───────────────────────────────────────────────────────────────

        setZoom(zoom) {
            set(state => { state.zoom = Math.max(0.2, Math.min(3, zoom)); });
        },

        setPan(x, y) {
            set(state => { state.panX = x; state.panY = y; });
        },

        // ── Canvas ─────────────────────────────────────────────────────────────

        clearCanvas() {
            set(state => {
                state.nodes.clear();
                state.wires.clear();
                state.selectedIds.clear();
                state.snapshot.clear();
                state.probes = [];
                state.waveformData = {};
                state.simRunning = false;
                state.simTimeNs = 0;
                state.wireInProgress = null;
            });
        },
    }))
);
