/**
 * engine/SimEngine.ts — Logisim-style Event-Driven Simulation Engine
 *
 * Built on LogicValue (0/1/X/Z) and NetGraph for proper net resolution.
 *
 * Simulation model (matches Logisim):
 *  1. Component inputs are read from their connected nets
 *  2. Component evaluate() is called → produces outputs
 *  3. Outputs are pushed to nets via NetGraph.applyOutputs()
 *  4. Downstream components of changed nets are marked dirty
 *  5. Process repeats until no changes (combinational convergence)
 *  6. Sequential components (FFs) only evaluate on clock edges
 *
 * Propagation delays:
 *  - Components with delayNs > 0 schedule timed events via EventQueue
 *  - Combinational components evaluate synchronously
 */

import type { BusValue } from './LogicValue';
import { floatingBus } from './LogicValue';
import type { EvalContext } from './ComponentDef';
import { getComponentDef } from './ComponentDef';
import { NetGraph } from './NetGraph';


// ── Instance ──────────────────────────────────────────────────────────────────

export interface ComponentInstance {
    id: string;
    type: string;
    /** Current params (may differ from defaults) */
    params: Record<string, unknown>;
    /** Current internal state (for FFs, RAM, etc.) */
    state: Record<string, unknown>;
    /** true when inputs have changed since last evaluation */
    dirty: boolean;
}

// ── Timed event ───────────────────────────────────────────────────────────────

interface TimedEvent {
    fireAtNs: number;
    componentId: string;
    outputs: Map<string, BusValue>;
}

// ── Sim Engine ────────────────────────────────────────────────────────────────

export class SimEngine {
    private instances = new Map<string, ComponentInstance>();
    private netGraph: NetGraph;

    private simTimeNs = 0;
    private maxIterations = 1000;  // cycle guard

    // outgoing outputs from each component → used by NetGraph.applyOutputs
    private componentOutputs = new Map<string, Map<string, BusValue>>();

    constructor(netGraph?: NetGraph) {
        this.netGraph = netGraph ?? new NetGraph();
    }

    get currentTimeNs(): number { return this.simTimeNs; }

    // ── Web Worker API ────────────────────────────────────────────────────────

    loadCircuit(nodes: any[], segments: any[]): void {
        this.netGraph = new NetGraph();
        this.instances.clear();
        this.componentOutputs.clear();
        // this.eventQueue = new EventQueue(); // unused currently
        this.simTimeNs = 0;

        // Build NetGraph
        this.netGraph.buildFromSegments(segments);

        // Add instances
        for (const n of nodes) {
            this.addInstance({
                id: n.id,
                type: n.type,
                params: { ...n.params },
                state: {},
                dirty: true
            });
            // Register ports with NetGraph
            const def = getComponentDef(n.type);
            if (def) {
                const ports = def.ports(n.params);
                for (const p of ports) {
                    this.netGraph.addPort({
                        componentId: n.id,
                        portId: p.id,
                        x: n.x + p.x,
                        y: n.y + p.y,
                        bits: p.bits,
                        direction: p.direction === 'inout' ? 'inout' : (p.direction === 'input' ? 'input' : 'output')
                    });
                }
            }
        }
    }

    evalFullFast(): void {
        this.flush();
    }

    interact(nodeId: string, _portId: string, data?: unknown): void {
        // Find instance and simulate an interaction (e.g. button press)
        const inst = this.instances.get(nodeId);
        if (!inst) return;

        // For buttons/switches, usually we just update a param or internal state
        // Here we just mark dirty and let the component evaluation handle it if it reads 'data'
        // A more robust implementation would pass interactions to the ComponentDef directly.
        if (data !== undefined) {
            inst.state['simInteraction'] = data;
        } else {
            inst.state['pressed'] = !inst.state['pressed'];
        }
        inst.dirty = true;
        this.flush();
    }

    updateParam(nodeId: string, key: string, value: unknown): void {
        const inst = this.instances.get(nodeId);
        if (!inst) return;
        inst.params[key] = value;
        inst.dirty = true;
        this.flush();
    }

    getSnapshot(): Map<string, Map<string, BusValue>> {
        return this.snapshot();
    }

    getNetValues(): Map<string, BusValue> {
        return this.netGraph.getNetValues();
    }

    getNetErrors(): Set<string> {
        // NetGraph does not currently expose a getNetErrors list, returning empty for now
        return new Set<string>();
    }

    // ── Instance management ────────────────────────────────────────────────────

    addInstance(inst: ComponentInstance): void {
        this.instances.set(inst.id, inst);
        this.componentOutputs.set(inst.id, new Map());
        inst.dirty = true;
    }

    removeInstance(id: string): void {
        this.instances.delete(id);
        this.componentOutputs.delete(id);
    }

    markDirty(instanceId: string): void {
        const inst = this.instances.get(instanceId);
        if (inst) inst.dirty = true;
    }

    markAllDirty(): void {
        for (const inst of this.instances.values()) inst.dirty = true;
    }

    // ── Clock advance ──────────────────────────────────────────────────────────

    /**
     * Advance simulation by deltaNs.
     * Calls flush() which propagates all dirty nodes.
     */
    tick(deltaNs = 0): void {
        this.simTimeNs += deltaNs;

        // Drain timed events
        const due = this.drainTimedEvents(this.simTimeNs);
        if (due.length > 0) {
            // Apply deferred outputs
            for (const ev of due) {
                this.componentOutputs.set(ev.componentId, ev.outputs);
            }
            this.propagate();
        }

        // Re-evaluate all dirty nodes
        this.flush();
    }

    /** Synchronous full flush — for pure combinational netlists */
    flush(): void {
        for (let i = 0; i < this.maxIterations; i++) {
            const anyDirty = this.evaluateDirty();
            if (!anyDirty) break;
        }
    }

    // ── Snapshot ───────────────────────────────────────────────────────────────

    /** Returns per-component port values for the rendering layer */
    snapshot(): Map<string, Map<string, BusValue>> {
        return new Map(
            [...this.componentOutputs.entries()].map(([id, m]) => [id, new Map(m)])
        );
    }

    /** Get the current value on the net a given port is connected to */
    getPortValue(componentId: string, portId: string): BusValue {
        const net = this.netGraph.getPortNet(componentId, portId);
        return net?.value ?? floatingBus(1);
    }

    // ── Private — Core Evaluation ─────────────────────────────────────────────

    private evaluateDirty(): boolean {
        const dirtyInsts = Array.from(this.instances.values()).filter(i => i.dirty);
        if (dirtyInsts.length === 0) return false;

        for (const inst of dirtyInsts) {
            inst.dirty = false;
            this.evaluateInstance(inst);
        }

        // After evaluating dirty nodes, resolve all nets
        this.propagate();
        return true;
    }

    private evaluateInstance(inst: ComponentInstance): void {
        const def = getComponentDef(inst.type);
        if (!def) return;

        const portDefs = def.ports(inst.params);

        // Gather inputs from nets
        const inputs: Record<string, BusValue> = {};
        for (const port of portDefs) {
            if (port.direction === 'input' || port.direction === 'inout') {
                inputs[port.id] = this.getPortValue(inst.id, port.id);
            }
        }

        const ctx: EvalContext = {
            inputs,
            state: inst.state,
            timeNs: this.simTimeNs,
            params: inst.params,
        };

        const result = def.evaluate(ctx);

        // Update state
        if (result.state) { Object.assign(inst.state, result.state); }

        // Handle propagation delay
        if (result.delayNs && result.delayNs > 0) {
            const outMap = new Map<string, BusValue>(Object.entries(result.outputs));
            const event: TimedEvent = {
                fireAtNs: this.simTimeNs + result.delayNs,
                componentId: inst.id,
                outputs: outMap,
            };
            this.scheduleTimedEvent(event);
        } else {
            // Immediate update
            const outMap = this.componentOutputs.get(inst.id) ?? new Map();
            for (const [portId, val] of Object.entries(result.outputs)) {
                outMap.set(portId, val);
            }
            this.componentOutputs.set(inst.id, outMap);
        }
    }

    private propagate(): void {
        // Build output map for NetGraph
        const allOutputs = new Map<string, Map<string, BusValue>>();
        for (const [compId, outs] of this.componentOutputs) {
            allOutputs.set(compId, outs);
        }
        this.netGraph.applyOutputs(allOutputs);

        // Mark downstream components dirty if their input net changed
        for (const net of this.netGraph.getAllNets()) {
            for (const port of net.ports) {
                if (port.direction === 'input' || port.direction === 'inout') {
                    const inst = this.instances.get(port.componentId);
                    if (inst && !inst.dirty) {
                        inst.dirty = true;
                    }
                }
            }
        }
    }

    // ── Timed Event Queue ─────────────────────────────────────────────────────

    private timedEvents: TimedEvent[] = [];

    private scheduleTimedEvent(ev: TimedEvent): void {
        this.timedEvents.push(ev);
        this.timedEvents.sort((a, b) => a.fireAtNs - b.fireAtNs);
    }

    private drainTimedEvents(untilNs: number): TimedEvent[] {
        const due: TimedEvent[] = [];
        while (this.timedEvents.length > 0 && this.timedEvents[0].fireAtNs <= untilNs) {
            due.push(this.timedEvents.shift()!);
        }
        return due;
    }
}
