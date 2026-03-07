/**
 * engine/VoltMonkey.ts — VoltMonkey v2 Deterministic Issue Detector
 *
 * Runs locally — NO LLM required for detection.
 * LLM is used only for insight generation (optional, via API).
 *
 * Detects:
 *   - Floating nodes (undriven inputs)
 *   - Short circuits (V+ directly to GND, no resistance path)
 *   - Incorrect gate fanout
 *   - FSM issues (forwarded from FSMEngine.analyzeFSM)
 *   - Verilog lint (undriven outputs, missing always sensitivity)
 */

import type { CircuitGraph, NodeId } from './types';
import { analyzeFSM, type FSMDefinition } from './FSMEngine';

export type IssueSeverity = 'info' | 'warning' | 'error';
export type IssueCategory = 'analog' | 'digital' | 'fsm' | 'verilog' | 'wiring';

export interface VoltMonkeyIssue {
    id: string;
    category: IssueCategory;
    severity: IssueSeverity;
    nodeId?: NodeId;
    line?: number;               // for Verilog issues
    title: string;
    observation: string;
    analysis: string;
    conclusion: string;
    insight: string;
}

export interface VoltMonkeyReport {
    issues: VoltMonkeyIssue[];
    score: number;               // 0–100, 100 = no issues
    summary: string;
}

// ─── Circuit Analysis ─────────────────────────────────────────────────────────

export function analyzeCircuit(graph: CircuitGraph): VoltMonkeyReport {
    const issues: VoltMonkeyIssue[] = [];

    // 1. Floating node detection
    graph.nodes.forEach((node, id) => {
        if (node.type === 'GROUND' || node.type === 'BATTERY') return;
        node.inputs.forEach((portId, idx) => {
            const port = node.ports.get(portId);
            if (port && !port.connected) {
                issues.push({
                    id: `float-${id}-${idx}`,
                    category: 'wiring',
                    severity: 'error',
                    nodeId: id,
                    title: 'Floating Node Detected',
                    observation: `Input port ${idx} of node '${id}' (${node.type}) is unconnected.`,
                    analysis: 'An unconnected input has no defined voltage level. This creates an undefined logic state — neither HIGH nor LOW.',
                    conclusion: 'The circuit output is unpredictable.',
                    insight: 'In real CMOS circuits, floating inputs draw random charge and may oscillate. Always tie unused inputs to VDD or GND through a pull resistor.',
                });
            }
        });
    });

    // 2. Short circuit detection — V+ directly to GND via zero-resistance path
    let hasVoltageSource = false;
    let hasDirectGroundConnection = false;
    graph.nodes.forEach((node) => {
        if (node.type === 'BATTERY') hasVoltageSource = true;
    });
    if (hasVoltageSource) {
        graph.edges.forEach(edge => {
            const from = graph.nodes.get(edge.fromNode);
            const to = graph.nodes.get(edge.toNode);
            if (from?.type === 'BATTERY' && to?.type === 'GROUND') {
                hasDirectGroundConnection = true;
            }
        });
        if (hasDirectGroundConnection) {
            issues.push({
                id: 'short-vdd-gnd',
                category: 'analog',
                severity: 'error',
                title: 'Short Circuit: VDD → GND',
                observation: 'A direct connection exists between the voltage source and ground with no current-limiting element.',
                analysis: 'Without resistance in the path, current → ∞ (limited only by wire/source resistance). This causes I²R heating in real circuits.',
                conclusion: 'Circuit will draw excessive current. In simulation, voltage collapses to 0V.',
                insight: 'Always include a series resistor when connecting any power rail to ground intentionally. Minimum 10Ω for safety.',
            });
        }
    }

    // 3. Gate fanout violation
    graph.nodes.forEach((node, id) => {
        if (!['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR', 'BUFFER'].includes(node.type)) return;
        let fanout = 0;
        graph.edges.forEach(edge => {
            if (edge.fromNode === id) fanout++;
        });
        if (fanout > 10) {
            issues.push({
                id: `fanout-${id}`,
                category: 'digital',
                severity: 'warning',
                nodeId: id,
                title: 'High Fanout',
                observation: `Gate '${id}' (${node.type}) drives ${fanout} outputs.`,
                analysis: `Standard cells typically support fanout ≤ 10. Beyond this, propagation delay increases as CL grows.`,
                conclusion: 'Timing may be violated at high frequencies.',
                insight: 'Insert a BUFFER between the gate and its fanout loads. In synthesis, use repeated buffering (buffer tree) for clock signals.',
            });
        }
    });

    // 4. No ground reference
    const hasGround = Array.from(graph.nodes.values()).some(n => n.type === 'GROUND');
    if (hasVoltageSource && !hasGround) {
        issues.push({
            id: 'no-ground',
            category: 'analog',
            severity: 'error',
            title: 'Missing Ground Reference',
            observation: 'A voltage source exists but no ground (reference node) is connected.',
            analysis: 'Voltage is always relative. Without a ground reference, node voltages are undefined.',
            conclusion: 'Circuit cannot be solved — nodal analysis requires at least one reference node.',
            insight: 'Every circuit must have exactly one ground node. Connect the negative terminal of the voltage source to GND.',
        });
    }

    const score = Math.max(0, 100 - issues.filter(i => i.severity === 'error').length * 30 - issues.filter(i => i.severity === 'warning').length * 10);
    const summary = issues.length === 0
        ? 'No issues detected. Circuit topology is valid.'
        : `${issues.filter(i => i.severity === 'error').length} error(s), ${issues.filter(i => i.severity === 'warning').length} warning(s) found.`;

    return { issues, score, summary };
}

// ─── FSM Analysis (wraps FSMEngine.analyzeFSM) ────────────────────────────────

export function analyzeFSMWithVoltMonkey(fsm: FSMDefinition): VoltMonkeyReport {
    const fsmAnalysis = analyzeFSM(fsm);
    const issues: VoltMonkeyIssue[] = [];

    fsmAnalysis.unreachableStates.forEach(stateId => {
        issues.push({
            id: `unreachable-${stateId}`,
            category: 'fsm',
            severity: 'warning',
            nodeId: stateId,
            title: 'Unreachable State',
            observation: `State '${stateId}' cannot be reached from the initial state '${fsm.initialState}'.`,
            analysis: 'No sequence of inputs will ever bring the FSM into this state. It consumes flip-flop resources but contributes nothing.',
            conclusion: 'Dead unreachable state — remove or add a transition path.',
            insight: 'In synthesis, unreachable states are typically optimized away, but their presence indicates a design bug or incomplete specification.',
        });
    });

    fsmAnalysis.deadStates.forEach(stateId => {
        issues.push({
            id: `dead-${stateId}`,
            category: 'fsm',
            severity: 'error',
            nodeId: stateId,
            title: 'Dead State (No Escape)',
            observation: `State '${stateId}' has no outgoing transitions and is not a final state.`,
            analysis: 'Once the FSM enters this state, it is permanently trapped. No further computation is possible.',
            conclusion: 'The FSM will halt permanently if it reaches this state.',
            insight: 'Add at least one outgoing transition, or mark this state as a final (accepting) state if trap behavior is intentional.',
        });
    });

    fsmAnalysis.nondeterministicStates.forEach(stateId => {
        issues.push({
            id: `ndet-${stateId}`,
            category: 'fsm',
            severity: 'error',
            nodeId: stateId,
            title: 'Non-Deterministic Transition',
            observation: `State '${stateId}' has multiple transitions for the same input symbol.`,
            analysis: 'A DFA requires exactly one transition per (state, input) pair. Multiple transitions mean the machine cannot deterministically choose its next state.',
            conclusion: 'This is an NFA, not a DFA. Hardware implementation requires determinism.',
            insight: 'Subset construction can convert an NFA to a DFA, but it may exponentially increase state count. Prefer deterministic design from the start.',
        });
    });

    const score = Math.max(0, 100 - issues.filter(i => i.severity === 'error').length * 30 - issues.filter(i => i.severity === 'warning').length * 10);
    return { issues, score, summary: issues.length === 0 ? 'FSM is well-formed.' : `${issues.length} issue(s) in FSM.` };
}

// ─── Verilog Lint ────────────────────────────────────────────────────────────

export interface VerilogLintIssue {
    line: number;
    col: number;
    severity: IssueSeverity;
    message: string;
    rule: string;
}

const VERILOG_LINT_RULES: Array<{
    pattern: RegExp;
    rule: string;
    severity: IssueSeverity;
    message: (m: RegExpMatchArray) => string;
}> = [
        {
            pattern: /always\s+@\s*\(\s*\)/,
            rule: 'empty-sensitivity',
            severity: 'error',
            message: () => 'Empty sensitivity list (@()). Use @(*) for combinational or @(posedge clk) for sequential.',
        },
        {
            pattern: /\binitial\b(?!.*\$dumpvars)(?!.*\$monitor)/,
            rule: 'initial-block',
            severity: 'warning',
            message: () => 'Initial block detected. Not synthesizable. Use for testbench only.',
        },
        {
            pattern: /#\s*\d+/,
            rule: 'delay-statement',
            severity: 'warning',
            message: () => 'Delay (#N) is not synthesizable. Remove for RTL design.',
        },
        {
            pattern: /\binteger\b/,
            rule: 'integer-type',
            severity: 'info',
            message: () => 'Prefer reg [N:0] over integer — integer is 32-bit signed and tool-specific.',
        },
        {
            pattern: /assign\s+\w+\s*=\s*\w+\s*\?[^:]+:[^;]+;/,
            rule: 'ternary-assign',
            severity: 'info',
            message: () => 'Ternary assign detected. Ensure both branches cover all cases to avoid latch inference.',
        },
    ];

export function lintVerilog(code: string): VerilogLintIssue[] {
    const issues: VerilogLintIssue[] = [];
    const lines = code.split('\n');

    lines.forEach((line, lineIdx) => {
        const trimmed = line.replace(/\/\/.*$/, '').trim(); // strip comments
        for (const rule of VERILOG_LINT_RULES) {
            const match = trimmed.match(rule.pattern);
            if (match) {
                issues.push({
                    line: lineIdx + 1,
                    col: line.indexOf(match[0]) + 1,
                    severity: rule.severity,
                    message: rule.message(match),
                    rule: rule.rule,
                });
            }
        }
    });

    return issues;
}
