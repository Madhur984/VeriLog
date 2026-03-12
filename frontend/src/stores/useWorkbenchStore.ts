/**
 * stores/useWorkbenchStore.ts — Workbench Central State (Phase 3 Net Topology)
 *
 * Implements Logisim-style wire segments instead of point-to-point edges.
 * Handles the state of components, wire segments, probes, and simulation synchronization.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { WireSegment, LogicState, CanvasNodeData, SimulationSnapshot } from '../types/circuit';
import { optimizeSegments, TempSeg } from '../engine/WireOptimizer';

// ── UI Data Models ─────────────────────────────────────────────────────────────

// Removed local CanvasNodeData to use types/circuit.ts one

export interface WaveformSample {
    timeNs: number;
    value: LogicState | LogicState[];
}

export interface ProbeEntry {
    nodeId: string;
    portId: string;
    label: string;
    color: string;
}

// ── Store Interface ─────────────────────────────────────────────────────────

interface WorkbenchState {
    // ── Topology
    nodes: Map<string, CanvasNodeData>;
    segments: Map<string, WireSegment>;

    // ── Simulation State (from Worker)
    simRunning: boolean;
    simTimeNs: number;
    tickRateHz: number;
    /** Output states per component port: Map<PortID, LogicState | LogicState[]> */
    portStates: Map<string, LogicState | LogicState[]>;
    /** Net values: mapping from segment.netId -> LogicState | LogicState[] */
    netValues: Map<string, LogicState | LogicState[]>;
    netErrors: Set<string>; // net IDs with 'X' values

    // ── View & Selection
    selectedIds: Set<string>;
    hoveredId: string | null;
    /** Current orthogonal wire path being drawn */
    wireInProgress: { x1: number, y1: number, mouseX: number, mouseY: number, axisPreferred?: 'x' | 'y' } | null;
    zoom: number;
    panX: number;
    panY: number;
    gridSize: number;

    // ── Analysis
    probes: ProbeEntry[];
    waveformData: Record<string, WaveformSample[]>; // keyed by probe key

    // ── Actions
    addNode(type: string, x: number, y: number, params?: Record<string, unknown>): string;
    removeNode(id: string): void;
    moveNode(id: string, x: number, y: number): void;
    rotateNode(id: string): void;
    updateNodeParams(id: string, params: Record<string, unknown>): void;
    updateNodeLabel(id: string, label: string): void;

    addSegments(segs: Omit<WireSegment, 'id' | 'netId'>[]): string[];
    removeSegment(id: string): void;

    selectItem(id: string, multi?: boolean): void;
    clearSelection(): void;
    setHovered(id: string | null): void;

    startWire(x: number, y: number): void;
    updateWireInProgress(mouseX: number, mouseY: number, axisPreferred?: 'x' | 'y'): void;
    commitWire(): void;
    cancelWire(): void;

    addProbe(nodeId: string, portId: string, label?: string): void;
    removeProbe(nodeId: string, portId: string): void;

    applySnapshot(snapshot: SimulationSnapshot): void;
    applyTopology(segmentToNetMap: Record<string, string>): void;
    appendWaveformSample(probeKey: string, timeNs: number, value: LogicState | LogicState[]): void;

    setSimRunning(running: boolean): void;
    setSimTime(ns: number): void;
    resetSim(): void;

    setZoom(zoom: number): void;
    setPan(x: number, y: number): void;
    clearCanvas(): void;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

let nodeCounter = 0;
let segCounter = 0;
function nextNodeId() { return `comp${++nodeCounter}`; }
function nextSegId() { return `seg${++segCounter}`; }
const PROBE_COLORS = ['#00D4FF', '#10B981', '#F59E0B', '#A78BFA', '#F472B6', '#FB923C', '#34D399'];

// ── Store ────────────────────────────────────────────────────────────────────

export const useWorkbenchStore = create<WorkbenchState>()(
    immer((set, get) => ({
        nodes: new Map(),
        segments: new Map(),
        selectedIds: new Set(),
        hoveredId: null,
        wireInProgress: null,
        simRunning: false,
        simTimeNs: 0,
        tickRateHz: 1000,
        portStates: new Map(),
        netValues: new Map(),
        netErrors: new Set(),
        probes: [],
        waveformData: {},
        zoom: 1,
        panX: 0,
        panY: 0,
        gridSize: 10,   // Logisim logical grid spacing (1 unit = 10px)

        // ── Nodes ─────────────────────────────────────────────────────────────

        addNode(type, x, y, params = {}) {
            const id = nextNodeId();
            const node: CanvasNodeData = {
                id, type, x, y, rotation: 0, parameters: params
            };
            set(state => { state.nodes.set(id, node); });
            return id;
        },

        removeNode(id) {
            set(state => {
                state.nodes.delete(id);
                state.selectedIds.delete(id);
                // Probes
                state.probes = state.probes.filter(p => p.nodeId !== id);
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
                if (node) node.rotation = (node.rotation + 90) % 360;
            });
        },

        updateNodeParams(id, params) {
            set(state => {
                const node = state.nodes.get(id);
                if (node) Object.assign(node.parameters, params);
            });
        },

        updateNodeLabel(id, label) {
            set(state => {
                const node = state.nodes.get(id);
                if (node) node.parameters.label = label;
            });
        },

        // ── Wires ─────────────────────────────────────────────────────────────

        addSegments(segs) {
            const addedIds: string[] = [];
            set(state => {
                const existingSegs: TempSeg[] = Array.from(state.segments.values()).map(s => ({ 
                    id: s.id, x1: s.x1, y1: s.y1, x2: s.x2, y2: s.y2 
                }));
                const newSegs: TempSeg[] = segs.map(s => ({ x1: s.x1, y1: s.y1, x2: s.x2, y2: s.y2 }));
                
                const combined = [...existingSegs, ...newSegs];
                const optimized = optimizeSegments(combined, nextSegId);

                state.segments.clear();
                for (const s of optimized) {
                    const id = s.id || nextSegId();
                    addedIds.push(id);
                    state.segments.set(id, {
                        id,
                        x1: s.x1, y1: s.y1,
                        x2: s.x2, y2: s.y2
                    });
                }
            });
            return addedIds;
        },

        removeSegment(id) {
            set(state => { state.segments.delete(id); state.selectedIds.delete(id); });
        },

        // ── Wire Drawing ──────────────────────────────────────────────────────

        startWire(x, y) {
            set(state => { state.wireInProgress = { x1: x, y1: y, mouseX: x, mouseY: y, axisPreferred: 'x' }; });
        },

        updateWireInProgress(mouseX, mouseY, axisPreferred) {
            set(state => {
                if (state.wireInProgress) {
                    state.wireInProgress.mouseX = mouseX;
                    state.wireInProgress.mouseY = mouseY;
                    if (axisPreferred) state.wireInProgress.axisPreferred = axisPreferred;
                }
            });
        },

        commitWire() {
            const w = get().wireInProgress;
            if (!w) return;

            const axis = w.axisPreferred || 'x';
            const segs: Omit<WireSegment, 'id' | 'netId'>[] = [];
            
            if (axis === 'x') {
                if (w.x1 !== w.mouseX) segs.push({ x1: w.x1, y1: w.y1, x2: w.mouseX, y2: w.y1 });
                if (w.y1 !== w.mouseY) segs.push({ x1: w.mouseX, y1: w.y1, x2: w.mouseX, y2: w.mouseY });
            } else {
                if (w.y1 !== w.mouseY) segs.push({ x1: w.x1, y1: w.y1, x2: w.x1, y2: w.mouseY });
                if (w.x1 !== w.mouseX) segs.push({ x1: w.x1, y1: w.mouseY, x2: w.mouseX, y2: w.mouseY });
            }

            set(s => { s.wireInProgress = null; });
            if (segs.length > 0) {
                get().addSegments(segs);
            }
        },

        cancelWire() {
            set(state => { state.wireInProgress = null; });
        },

        // ── Selection ────────────────────────────────────────────────────────

        selectItem(id, multi = false) {
            set(state => {
                if (!multi) state.selectedIds.clear();
                if (state.selectedIds.has(id)) state.selectedIds.delete(id);
                else state.selectedIds.add(id);
            });
        },

        clearSelection() {
            set(state => { state.selectedIds.clear(); });
        },

        setHovered(id) {
            set(state => { state.hoveredId = id; });
        },

        // ── Probes ──────────────────────────────────────────────────────────

        addProbe(nodeId, portId, label) {
            const probeKey = `${nodeId}:${portId}`;
            if (get().probes.some(p => p.nodeId === nodeId && p.portId === portId)) return;
            const color = PROBE_COLORS[get().probes.length % PROBE_COLORS.length];
            set(state => {
                state.probes.push({ nodeId, portId, label: label ?? portId, color });
                state.waveformData[probeKey] = [];
            });
        },

        removeProbe(nodeId, portId) {
            set(state => {
                state.probes = state.probes.filter(p => !(p.nodeId === nodeId && p.portId === portId));
                delete state.waveformData[`${nodeId}:${portId}`];
            });
        },

        // ── Simulation ────────────────────────────────────────────────────────

        applyTopology(segmentToNetMap) {
            set(state => {
                for (const [segId, netId] of Object.entries(segmentToNetMap)) {
                    const seg = state.segments.get(segId);
                    if (seg) seg.netId = netId;
                }
            });
        },

        applySnapshot(snapshot) {
            set(state => {
                state.portStates = new Map(Object.entries(snapshot.portStates));
                state.netValues = new Map(Object.entries(snapshot.netValues));
                state.netErrors = new Set(snapshot.netErrors);
                state.simTimeNs = snapshot.timeNs;
            });
        },

        appendWaveformSample(probeKey, timeNs, value) {
            set(state => {
                if (!state.waveformData[probeKey]) state.waveformData[probeKey] = [];
                const samples = state.waveformData[probeKey];
                if (samples.length >= 2000) samples.shift();
                samples.push({ timeNs, value: Array.isArray(value) ? value : value }); // Just keep it
            });
        },

        setSimRunning(running) { set(state => { state.simRunning = running; }); },
        setSimTime(ns) { set(state => { state.simTimeNs = ns; }); },

        resetSim() {
            set(state => {
                state.simRunning = false;
                state.simTimeNs = 0;
                state.portStates.clear();
                state.netValues.clear();
                state.netErrors.clear();
                Object.keys(state.waveformData).forEach(k => state.waveformData[k] = []);
            });
        },

        // ── View ────────────────────────────────────────────────────────────

        setZoom(zoom) { set(state => { state.zoom = Math.max(0.2, Math.min(3, zoom)); }); },
        setPan(x, y) { set(state => { state.panX = x; state.panY = y; }); },

        clearCanvas() {
            set(state => {
                state.nodes.clear();
                state.segments.clear();
                state.selectedIds.clear();
                state.probes = [];
                state.waveformData = {};
                state.simRunning = false;
                state.simTimeNs = 0;
            });
        }
    }))
);
