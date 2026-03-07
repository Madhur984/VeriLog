/**
 * engine/FSMEngine.ts — FSM Definition, Execution, and Static Analysis
 *
 * Features:
 *   - Type-safe FSM model (Moore / Mealy)
 *   - Step-by-step execution with state trace
 *   - Static analysis: unreachable, dead, missing, nondeterministic states
 *   - Verilog case-statement export
 */

import type { FSMDefinition, FSMAnalysis, StateId, FSMTransition } from './types';

export type { FSMDefinition, FSMTransition };
export { type FSMState } from './types';

// ─── Factory ─────────────────────────────────────────────────────────────────

export function createFSM(partial: Partial<FSMDefinition> = {}): FSMDefinition {
    return {
        id: partial.id ?? crypto.randomUUID(),
        type: partial.type ?? 'Moore',
        states: partial.states ?? new Map(),
        transitions: partial.transitions ?? [],
        alphabet: partial.alphabet ?? [],
        initialState: partial.initialState ?? '',
        currentState: partial.currentState ?? partial.initialState ?? '',
    };
}

// ─── Execution ───────────────────────────────────────────────────────────────

export interface StepResult {
    fromState: StateId;
    toState: StateId;
    input: string;
    output: string;
    transitionId: string | null;
    isValid: boolean;
    error?: string;
}

export function fsmStep(fsm: FSMDefinition, input: string): StepResult {
    const from = fsm.currentState;

    const transition = fsm.transitions.find(
        t => t.from === from && matchesCondition(t.condition, input)
    );

    if (!transition) {
        return {
            fromState: from, toState: from,
            input, output: '',
            transitionId: null,
            isValid: false,
            error: `No transition from state '${from}' on input '${input}'`,
        };
    }

    fsm.currentState = transition.to;

    const toState = fsm.states.get(transition.to);
    const output = fsm.type === 'Moore'
        ? (toState?.output ?? '')
        : (transition.output ?? '');

    return {
        fromState: from,
        toState: transition.to,
        input, output,
        transitionId: transition.id,
        isValid: true,
    };
}

/** Run FSM on a sequence of inputs, return full trace */
export function fsmRun(fsm: FSMDefinition, inputs: string[]): StepResult[] {
    const trace: StepResult[] = [];
    for (const input of inputs) {
        trace.push(fsmStep(fsm, input));
    }
    return trace;
}

function matchesCondition(condition: string, input: string): boolean {
    // Simple: condition is an exact input string match
    // Extended: supports comma-separated key=value pairs (e.g. "a=1,b=0")
    if (condition === input) return true;
    if (condition.includes('=')) {
        const pairs = condition.split(',').map(p => p.trim());
        const inputPairs = input.split(',').map(p => p.trim());
        return pairs.every(p => inputPairs.includes(p));
    }
    return false;
}

// ─── Static Analysis ─────────────────────────────────────────────────────────

export function analyzeFSM(fsm: FSMDefinition): FSMAnalysis {
    const allStateIds = Array.from(fsm.states.keys());

    // 1. Reachability (BFS from initialState)
    const reachable = new Set<StateId>();
    const queue = [fsm.initialState];
    while (queue.length > 0) {
        const s = queue.shift()!;
        if (reachable.has(s)) continue;
        reachable.add(s);
        fsm.transitions
            .filter(t => t.from === s)
            .forEach(t => queue.push(t.to));
    }
    const unreachableStates = allStateIds.filter(id => !reachable.has(id));

    // 2. Dead states (no outgoing transitions unless final)
    const deadStates = allStateIds.filter(id => {
        const state = fsm.states.get(id);
        if (state?.isFinal) return false;
        return !fsm.transitions.some(t => t.from === id);
    });

    // 3. Missing transitions (for each state × alphabet symbol)
    const missingTransitions: FSMAnalysis['missingTransitions'] = [];
    for (const stateId of allStateIds) {
        const covered = new Set<string>();
        fsm.transitions
            .filter(t => t.from === stateId)
            .forEach(t => covered.add(t.condition));
        const missing = fsm.alphabet.filter(sym => !covered.has(sym));
        if (missing.length > 0) {
            missingTransitions.push({ state: stateId, missingInputs: missing });
        }
    }

    // 4. Non-determinism (duplicate from+condition)
    const nondeterministicStates: StateId[] = [];
    const seen = new Set<string>();
    for (const t of fsm.transitions) {
        const key = `${t.from}|${t.condition}`;
        if (seen.has(key)) {
            if (!nondeterministicStates.includes(t.from)) {
                nondeterministicStates.push(t.from);
            }
        }
        seen.add(key);
    }

    return { unreachableStates, deadStates, missingTransitions, nondeterministicStates };
}

// ─── Verilog Export ─────────────────────────────────────────────────────────

export function exportToVerilog(fsm: FSMDefinition): string {
    const stateIds = Array.from(fsm.states.keys());
    const stateBits = Math.ceil(Math.log2(stateIds.length || 1));

    const stateParams = stateIds
        .map((id, i) => `    localparam ${sanitize(id)} = ${stateBits}'d${i};`)
        .join('\n');

    const cases = stateIds.map(stateId => {
        const transitions = fsm.transitions.filter(t => t.from === stateId);
        const transLines = transitions.map(t =>
            `            ${t.condition}: next_state = ${sanitize(t.to)};`
        ).join('\n');
        return `        ${sanitize(stateId)}: begin\n${transLines}\n        end`;
    }).join('\n');

    const outputs = stateIds.map(stateId => {
        const s = fsm.states.get(stateId);
        return s?.output
            ? `        ${sanitize(stateId)}: output_val = ${s.output};`
            : '';
    }).filter(Boolean).join('\n');

    return `// Auto-generated by VeriLog FSM Simulator
// FSM Type: ${fsm.type}

module fsm (
    input clk, rst,
    input [7:0] inp,
    output reg [7:0] output_val
);

${stateParams}

    reg [${stateBits - 1}:0] state, next_state;

    // State register
    always @(posedge clk or posedge rst) begin
        if (rst) state <= ${sanitize(fsm.initialState)};
        else state <= next_state;
    end

    // Next-state logic
    always @(*) begin
        next_state = state;
        case (state)
${cases}
        endcase
    end

    // Output logic (Moore)
    always @(*) begin
        output_val = 8'b0;
        case (state)
${outputs}
        endcase
    end

endmodule
`;
}

function sanitize(id: string): string {
    return id.replace(/[^a-zA-Z0-9_]/g, '_').toUpperCase();
}
