/**
 * engine/ComponentDef.ts — Canonical Component Definition Interface
 *
 * Every logical gate, flip-flop, MUX, Pin, etc. is expressed as a ComponentDef.
 * This is the registry contract that the simulation engine uses to evaluate components.
 *
 * Design mirrors Logisim's component model:
 *  - ports declare their direction and bit width
 *  - evaluate() is called when any input changes
 *  - state allows sequential components (FFs, registers) to hold internal state
 */

import type { BusValue } from './LogicValue';

// ── Port Direction ─────────────────────────────────────────────────────────────

export type PortDirection = 'input' | 'output' | 'inout';

// ── Port Definition (static shape) ────────────────────────────────────────────

export interface PortDef {
    id: string;
    direction: PortDirection;
    bits: number;                     // 1 for single-bit, N for bus
    label: string;
    /** Grid position relative to component origin */
    x: number;
    y: number;
    /** Which side this port sits on (for visual rendering) */
    side: 'left' | 'right' | 'top' | 'bottom';
}

// ── Component Evaluation ───────────────────────────────────────────────────────

export interface EvalContext {
    /** inputs keyed by port id, each is BusValue of the port's bit width */
    inputs: Record<string, BusValue>;
    /** Current internal state — mutable */
    state: Record<string, unknown>;
    /** Current simulated time in nanoseconds */
    timeNs: number;
    /** Component parameters */
    params: Record<string, unknown>;
}

export interface EvalResult {
    /** outputs keyed by port id */
    outputs: Record<string, BusValue>;
    /** Updated internal state (for sequential components) */
    state?: Record<string, unknown>;
    /** If set, emit a timed event for this many ns in the future (propagation delay) */
    delayNs?: number;
}

// ── Visual Shape ───────────────────────────────────────────────────────────────

export interface ComponentShape {
    /** Width in grid units (10px each) */
    w: number;
    /** Height in grid units */
    h: number;
    /** SVG path for the body, relative to (0,0) top-left */
    bodyPath?: string;
    /** IEEE qualifier symbol shown inside */
    symbol: string;
    /** Border/accent color */
    color: string;
    /** Logisim-style curved bodies (gates use special shapes) */
    style: 'rect' | 'and' | 'or' | 'not' | 'triangle' | 'custom';
    /** Extra SVG elements (bubbles, clock chevron, etc.) */
    extras?: string;
}

// ── Parameter Schema ───────────────────────────────────────────────────────────

export type ParamType = 'int' | 'float' | 'bool' | 'select' | 'string';

export interface ParamDef {
    key: string;
    label: string;
    type: ParamType;
    default: unknown;
    min?: number;
    max?: number;
    options?: string[];
}

// ── Component Definition ───────────────────────────────────────────────────────

export interface ComponentDef {
    type: string;
    label: string;
    category: 'Wiring' | 'Gates' | 'Plexers' | 'Memory' | 'I/O' | 'Subcircuit';

    /** Default parameters */
    defaultParams: Record<string, unknown>;

    /** Parameter schema for the properties panel */
    params: ParamDef[];

    /** Static port layout — may be overridden by params (e.g. inputCount) */
    ports(params: Record<string, unknown>): PortDef[];

    /** Visual shape */
    shape(params: Record<string, unknown>): ComponentShape;

    /** Evaluate the component given inputs and state */
    evaluate(ctx: EvalContext): EvalResult;

    /** Initialize internal state on component creation */
    initState(params: Record<string, unknown>): Record<string, unknown>;
}

// ── Component Registry ─────────────────────────────────────────────────────────

const REGISTRY = new Map<string, ComponentDef>();

export function registerComponent(def: ComponentDef): void {
    REGISTRY.set(def.type, def);
}

export function getComponentDef(type: string): ComponentDef | undefined {
    return REGISTRY.get(type);
}

export function getAllComponentDefs(): ComponentDef[] {
    return Array.from(REGISTRY.values());
}

export function getRegistry(): Map<string, ComponentDef> {
    return REGISTRY;
}

export function getComponentsByCategory(): Map<string, ComponentDef[]> {
    const map = new Map<string, ComponentDef[]>();
    for (const def of REGISTRY.values()) {
        if (!map.has(def.category)) map.set(def.category, []);
        map.get(def.category)!.push(def);
    }
    return map;
}
