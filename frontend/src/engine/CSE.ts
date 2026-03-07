/**
 * engine/CSE.ts — Circuit Simulation Engine (Phase 2 Unified)
 *
 * Replaces both LogicEngine.ts (5-pass) and evaluator.ts (3-pass).
 *
 * Architecture:
 *   - Event-driven propagation: only dirty nodes are re-evaluated
 *   - Timed events via EventQueue for gate propagation delays
 *   - Mixed-signal: digital boolean layer + analog voltage layer
 *   - Cycle guard: max 10,000 events per tick
 *
 * Usage:
 *   const cse = new CSE();
 *   cse.loadGraph(graph);
 *   cse.tick(deltaTimeNs);   // call each animation frame
 *   const state = cse.snapshot();
 */

import type { CircuitGraph, ComponentNode, NodeId, PortState, SimEvent } from './types';
import { EventQueue } from './EventQueue';
import { getGate, evaluateDFF, evaluateSRLatch, evaluateJKFF } from './gates';

const VDD = 5.0;
const GND = 0.0;
const THRESHOLD_HIGH = 0.7 * VDD;   // >3.5V = logic HIGH
const MAX_EVENTS_PER_TICK = 10_000;
const MAX_DEPTH = 1_000;             // cycle guard

function voltageToLogic(v: number): boolean {
    return v >= THRESHOLD_HIGH;
}

export class CSE {
    private graph: CircuitGraph | null = null;
    private eventQueue = new EventQueue();
    private simTimeNs = 0;          // current simulated nanoseconds

    // ─── Public API ────────────────────────────────────────────────────────

    loadGraph(graph: CircuitGraph): void {
        this.graph = graph;
        this.eventQueue.clear();
        this.simTimeNs = 0;
        // Mark all nodes dirty on first load
        graph.nodes.forEach((_, id) => graph.dirtySet.add(id));
    }

    markDirty(nodeId: NodeId): void {
        this.graph?.dirtySet.add(nodeId);
    }

    /**
     * Advance simulation by deltaTimeNs nanoseconds.
     * Called once per requestAnimationFrame (deltaTimeNs = ~16_666_666 ns @ 60fps → too large).
     * Caller should pass a much smaller step, e.g. 100ns per frame for digital logic,
     * or just call flush() for pure combinational circuits.
     */
    tick(deltaTimeNs = 0): void {
        if (!this.graph) return;
        this.simTimeNs += deltaTimeNs;

        // 1. Drain timed events up to current simulated time
        const timedEvents = this.eventQueue.popUntil(this.simTimeNs);
        for (const ev of timedEvents) {
            const node = this.graph.nodes.get(ev.targetNode);
            if (!node) continue;
            const port = node.ports.get(ev.targetPort);
            if (port) {
                port.voltage = ev.newVoltage;
                port.logic = ev.newLogic;
                port.drive = 'strong';
            }
            this.graph.dirtySet.add(ev.targetNode);
        }

        // 2. Evaluate dirty nodes (BFS propagation)
        this.flushDirty();
    }

    /** Synchronous flush — for combinational circuits without delays */
    flush(): void {
        if (!this.graph) return;
        this.graph.nodes.forEach((_, id) => this.graph!.dirtySet.add(id));
        this.flushDirty();
    }

    snapshot(): Map<NodeId, PortState[]> {
        const out = new Map<NodeId, PortState[]>();
        if (!this.graph) return out;
        this.graph.nodes.forEach((node, id) => {
            out.set(id, [...node.ports.values()]);
        });
        return out;
    }

    get currentTimeNs(): number { return this.simTimeNs; }

    // ─── Propagation ────────────────────────────────────────────────────────

    private flushDirty(): void {
        if (!this.graph) return;
        const { graph } = this;
        let steps = 0;

        while (graph.dirtySet.size > 0 && steps < MAX_EVENTS_PER_TICK) {
            const nodeId = graph.dirtySet.values().next().value as NodeId;
            graph.dirtySet.delete(nodeId);

            const node = graph.nodes.get(nodeId);
            if (!node) continue;

            const changed = this.evaluateNode(node);
            if (changed) {
                // Propagate to downstream nodes
                const downstreamIds = graph.adjacency.get(nodeId) ?? [];
                for (const downId of downstreamIds) {
                    if (steps < MAX_DEPTH) {
                        this.propagateEdges(nodeId, downId);
                        graph.dirtySet.add(downId);
                    }
                }
            }
            steps++;
        }
    }

    /** Copy output ports of fromNode to input ports of toNode via edges */
    private propagateEdges(fromId: NodeId, toId: NodeId): void {
        if (!this.graph) return;
        this.graph.edges.forEach(edge => {
            if (edge.fromNode !== fromId || edge.toNode !== toId) return;
            const fromNode = this.graph!.nodes.get(fromId);
            const toNode = this.graph!.nodes.get(toId);
            if (!fromNode || !toNode) return;

            const srcPort = fromNode.ports.get(edge.fromPort);
            const dstPort = toNode.ports.get(edge.toPort);
            if (!srcPort || !dstPort) return;

            // Mark wire as live / not live
            edge.isLive = srcPort.logic;

            dstPort.voltage = srcPort.voltage;
            dstPort.logic = srcPort.logic;
            dstPort.drive = srcPort.drive;
            dstPort.connected = true;
        });
    }

    /**
     * Evaluate a single node based on its current input port states.
     * Returns true if any output port changed.
     */
    private evaluateNode(node: ComponentNode): boolean {
        const prevOutputs = this.snapshotOutputs(node);
        this.doEvaluate(node);
        return this.outputsChanged(node, prevOutputs);
    }

    private doEvaluate(node: ComponentNode): void {
        const { type, params } = node;

        // ── Sources ──────────────────────────────────────────────────────
        if (type === 'BATTERY') {
            const v = params.voltage ?? VDD;
            this.setOutput(node, 0, v, voltageToLogic(v));
            return;
        }

        if (type === 'GROUND') {
            this.setOutput(node, 0, GND, false);
            return;
        }

        if (type === 'SWITCH_SPST' || type === 'PUSHBUTTON') {
            const on = params.isOn ?? false;
            const inV = this.getInputVoltage(node, 0);
            const outV = on ? inV : GND;
            this.setOutput(node, 0, outV, on && voltageToLogic(inV));
            return;
        }

        // ── Passives ─────────────────────────────────────────────────────
        if (type === 'RESISTOR') {
            // Boolean pass-through; analog handled by AnalogSolver
            const inL = this.getInputLogic(node, 0);
            this.setOutput(node, 0, inL ? VDD : GND, inL);
            return;
        }

        if (type === 'WIRE_NODE') {
            const inL = this.getInputLogic(node, 0);
            const inV = this.getInputVoltage(node, 0);
            this.setOutput(node, 0, inV, inL);
            return;
        }

        // ── LED (sink, no output) ─────────────────────────────────────────
        if (type === 'LED') {
            const inV = this.getInputVoltage(node, 0);
            const vFwd = params.vForward ?? 2.0;
            const brightness = Math.max(0, Math.min(1, (inV - vFwd) / 3));
            node.internalState['brightness'] = brightness;
            return;
        }

        // ── Gates ─────────────────────────────────────────────────────────
        const GATE_TYPES = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR', 'BUFFER'];
        if (GATE_TYPES.includes(type)) {
            const gate = getGate(type);
            const inputLogics = node.inputs.map(pid =>
                node.ports.get(pid)?.logic ?? false
            );
            const result = gate.evaluate(inputLogics);
            const tpd = result
                ? (params.tpdLH ?? gate.params.tpdLH)
                : (params.tpdHL ?? gate.params.tpdHL);

            if (tpd > 0 && this.simTimeNs > 0) {
                // Schedule delayed event
                const outPortId = node.outputs[0];
                if (outPortId) {
                    const ev: SimEvent = {
                        fireAt: this.simTimeNs + tpd,
                        targetNode: node.id,
                        targetPort: outPortId,
                        newLogic: result,
                        newVoltage: result ? VDD : GND,
                    };
                    this.eventQueue.push(ev);
                }
            } else {
                this.setOutput(node, 0, result ? VDD : GND, result);
            }
            return;
        }

        // ── D Flip-Flop ────────────────────────────────────────────────────
        if (type === 'D_FF') {
            const D = this.getInputLogic(node, 0);
            const CLK = this.getInputLogic(node, 1);
            const prevClk = (node.internalState['prevClk'] as boolean) ?? false;
            const prevQ = (node.internalState['Q'] as boolean) ?? false;
            const { Q, Qn } = evaluateDFF(D, CLK, prevClk, prevQ, params.clockEdge);
            node.internalState['prevClk'] = CLK;
            node.internalState['Q'] = Q;
            this.setOutput(node, 0, Q ? VDD : GND, Q);
            this.setOutput(node, 1, Qn ? VDD : GND, Qn);
            return;
        }

        // ── SR Latch ────────────────────────────────────────────────────────
        if (type === 'SR_LATCH') {
            const S = this.getInputLogic(node, 0);
            const R = this.getInputLogic(node, 1);
            const prevQ = (node.internalState['Q'] as boolean) ?? false;
            const { Q, Qn } = evaluateSRLatch(S, R, prevQ);
            node.internalState['Q'] = Q;
            this.setOutput(node, 0, Q ? VDD : GND, Q);
            this.setOutput(node, 1, Qn ? VDD : GND, Qn);
            return;
        }

        // ── JK Flip-Flop ────────────────────────────────────────────────────
        if (type === 'JK_FF') {
            const J = this.getInputLogic(node, 0);
            const K = this.getInputLogic(node, 1);
            const CLK = this.getInputLogic(node, 2);
            const prevClk = (node.internalState['prevClk'] as boolean) ?? false;
            const prevQ = (node.internalState['Q'] as boolean) ?? false;
            const { Q, Qn } = evaluateJKFF(J, K, CLK, prevClk, prevQ);
            node.internalState['prevClk'] = CLK;
            node.internalState['Q'] = Q;
            this.setOutput(node, 0, Q ? VDD : GND, Q);
            this.setOutput(node, 1, Qn ? VDD : GND, Qn);
            return;
        }

        // ── Comparator ──────────────────────────────────────────────────────
        if (type === 'COMPARATOR') {
            const vPos = this.getInputVoltage(node, 0);
            const vNeg = this.getInputVoltage(node, 1);
            const hyst = params.hysteresis ?? 0;
            const prevOut = (node.internalState['out'] as boolean) ?? false;
            let out: boolean;
            if (prevOut) {
                out = (vPos - vNeg) > -hyst;
            } else {
                out = (vPos - vNeg) > hyst;
            }
            node.internalState['out'] = out;
            this.setOutput(node, 0, out ? VDD : GND, out);
            return;
        }
    }

    // ─── Port Helpers ────────────────────────────────────────────────────────

    private getInputVoltage(node: ComponentNode, index: number): number {
        const id = node.inputs[index];
        return id ? (node.ports.get(id)?.voltage ?? GND) : GND;
    }

    private getInputLogic(node: ComponentNode, index: number): boolean {
        const id = node.inputs[index];
        return id ? (node.ports.get(id)?.logic ?? false) : false;
    }

    private setOutput(node: ComponentNode, index: number, voltage: number, logic: boolean): void {
        const id = node.outputs[index];
        if (!id) return;
        const port = node.ports.get(id);
        if (port) {
            port.voltage = voltage;
            port.logic = logic;
            port.drive = 'strong';
        }
    }

    private snapshotOutputs(node: ComponentNode): Map<string, PortState> {
        const snap = new Map<string, PortState>();
        node.outputs.forEach(pid => {
            const p = node.ports.get(pid);
            if (p) snap.set(pid, { ...p });
        });
        return snap;
    }

    private outputsChanged(node: ComponentNode, prev: Map<string, PortState>): boolean {
        for (const pid of node.outputs) {
            const cur = node.ports.get(pid);
            const old = prev.get(pid);
            if (!cur || !old) return true;
            if (cur.logic !== old.logic || Math.abs(cur.voltage - old.voltage) > 0.001) return true;
        }
        return false;
    }
}
