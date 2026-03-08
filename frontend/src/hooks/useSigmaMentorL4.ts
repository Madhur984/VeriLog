/**
 * useSigmaMentorL4.ts — SIGMA Engineering Mentor for Level 4: Logic Gates
 *
 * Covers: gate behavior, CMOS realization, truth tables, circuit construction,
 * logic puzzle analysis (De Morgan, canonical forms, universal gates).
 *
 * Performance tiers: sharp / steady / struggling
 * Scenes: 'gates' | 'lab' | 'builder' | 'puzzle'
 */

import { useCallback, useRef } from 'react';

export type L4Tier = 'sharp' | 'steady' | 'struggling';
export type L4Scene = 'gates' | 'lab' | 'builder' | 'puzzle' | 'oscilloscope';

export interface SigmaL4Response {
    observation: string;
    analysis: string;
    conclusion: string;
    insight: string;
    tier: L4Tier;
}

const DB: Record<L4Scene, Record<L4Tier, SigmaL4Response[]>> = {
    gates: {
        sharp: [
            {
                observation: 'Gate truth table verified.',
                analysis: 'The AND gate implements conjunction: Y=1 iff all inputs are 1. In switching algebra, this corresponds to series-connected nMOS pull-down network.',
                conclusion: 'CMOS AND = NAND followed by NOT inverter. 6 transistors total for 2-input.',
                insight: 'At nanoscale, NAND gates are preferred over AND because they avoid stacking more than 2 nMOS in series, reducing voltage headroom loss.',
                tier: 'sharp',
            },
            {
                observation: 'XOR behavior confirmed.',
                analysis: 'XOR implements modulo-2 addition. Output = 1 when inputs differ. This is also a parity checker: odd number of HIGHs → output HIGH.',
                conclusion: 'XOR is the core of every binary adder. The full adder sum bit is A⊕B⊕Cin.',
                insight: 'XOR requires 8–12 transistors in static CMOS. Transmission gate XOR uses only 4 transistors but has weaker drive strength.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                observation: 'Gate input/output state observed.',
                analysis: 'Logic 1 represents HIGH voltage (≈VDD, typically 3.3V or 1.8V). Logic 0 represents LOW (≈GND). Gates translate these voltage levels according to their truth table.',
                conclusion: 'Every gate you see here is built from CMOS transistors — pMOS for pull-up, nMOS for pull-down.',
                insight: 'NAND and NOR are called "universal gates" because any logic function can be built using only NAND gates (or only NOR gates).',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                observation: 'Gate behavior being explored.',
                analysis: 'Focus on one input combination at a time. For AND: both inputs must be HIGH (1) for output to be HIGH. If either input is LOW (0), the output is LOW.',
                conclusion: 'Use the truth table as a reference. Toggle inputs systematically: 00, 01, 10, 11 — four combinations exhaustively test a 2-input gate.',
                insight: 'Think of AND as a series switch: both switches must be closed (ON) for current to flow to the output.',
                tier: 'struggling',
            },
        ],
    },
    lab: {
        sharp: [
            {
                observation: 'All gate characterizations complete.',
                analysis: 'Notice NAND and NOR are functionally complete — any Boolean function can be expressed using only these gates. This is why NAND is the foundational cell in standard cell libraries.',
                conclusion: 'De Morgan\'s theorem: ¬(A·B) = ¬A+¬B and ¬(A+B) = ¬A·¬B. NAND = inverted AND = OR of inverted inputs.',
                insight: 'In practice, a chip inverter uses a single CMOS NOT cell. All other gates add inverting cells at the end. Pure AND/OR without inversion cost more area.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                observation: 'Gate lab exercise in progress.',
                analysis: 'Compare and contrast: AND outputs 1 for input 11 only. NAND outputs 0 for input 11 only — it is AND with a bubble (inversion) on the output.',
                conclusion: 'The relationship between AND↔NAND and OR↔NOR is inversion. Once you know one, you know the other through De Morgan.',
                insight: 'Circuit designers often use NAND/NOR over AND/OR because NAND/NOR have smaller footprints in CMOS technology — fewer transistors in series.',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                observation: 'Gate testing in progress.',
                analysis: 'Work through one gate completely before moving to the next. For each gate: set inputs 00, observe output. Then 01, 10, 11. Write down what you see.',
                conclusion: 'The truth table IS the gate definition. Memorizing gate names without truth tables has no engineering value.',
                insight: 'A useful memory aid: AND = all, OR = any, NOT = opposite, XOR = different, NAND = not-all, NOR = not-any.',
                tier: 'struggling',
            },
        ],
    },
    builder: {
        sharp: [
            {
                observation: 'Circuit topology constructed.',
                analysis: 'Gate-level schematics directly map to netlist format used in EDA tools. Each gate becomes a cell instance; each wire becomes a net.',
                conclusion: 'Your circuit can be described in Verilog: assign Y = A & B | ~C; maps directly to AND, OR, NOT gates.',
                insight: 'Logic synthesis tools (Synopsys Design Compiler, Cadence Genus) take Boolean expressions and automatically map them to the optimal gate topology for a given standard cell library.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                observation: 'Circuit wiring in progress.',
                analysis: 'Fan-out (number of gates driven by one output) is limited. Driving too many gates from one output causes voltage degradation — the driving gate cannot source enough current.',
                conclusion: 'Each gate output has a maximum fanout rating. In the lab, standard CMOS gates support fanout of 4–10.',
                insight: 'When high fanout is needed, insert BUFFER gates to regenerate the signal before distributing to multiple inputs.',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                observation: 'Building circuit connections.',
                analysis: 'A circuit has inputs, logic gates that process signals, and outputs. The key rule: every gate input must be connected to either a switch or the output of another gate. Unconnected inputs default to LOW.',
                conclusion: 'Start from the output LED and work backwards. What signal does the LED need? Which gate produces it? What inputs does that gate need?',
                insight: 'Debugging circuits: trace from output back to input. If the LED is wrong, check the gate feeding it. If that gate is wrong, check its inputs.',
                tier: 'struggling',
            },
        ],
    },
    puzzle: {
        sharp: [
            {
                observation: 'Logic puzzle solution submitted.',
                analysis: 'Verifying against expected truth table. If all rows match, the Boolean function is correctly implemented regardless of gate topology used.',
                conclusion: 'There are multiple valid implementations. Minimum gate count is not always optimal — critical path delay may require different topology.',
                insight: 'Quine-McCluskey method or Karnaugh maps minimize Boolean expressions to minimum sum-of-products (SOP) form before gate mapping.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                observation: 'Puzzle solution being evaluated.',
                analysis: 'If the truth table does not match: find which row fails first. Walk that specific input combination through your circuit gate by gate to find where the signal deviates.',
                conclusion: 'Systematic debugging: fix one gate at a time. Verify each intermediate signal before checking the final output.',
                insight: 'In real chip verification, this process is called "simulation-based debug." Engineers add probes at internal net nodes to trace signal paths.',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                observation: 'Puzzle solution incomplete.',
                analysis: 'Re-read the puzzle requirement: it describes the desired behavior in plain language. Convert it to a truth table first before selecting gates.',
                conclusion: 'For "output 1 only when A=1 AND B=0": this means AND( A, NOT(B) ). Connect switch A → AND gate input 1. Switch B → NOT gate → AND gate input 2. AND output → LED.',
                insight: 'Always write the truth table before building. It prevents wasted effort on incorrect topologies.',
                tier: 'struggling',
            },
        ],
    },
    oscilloscope: {
        sharp: [
            {
                observation: 'Waveform timing analyzed.',
                analysis: 'Signal transitions are crisp, indicating minimal propagation skew. The setup and hold times appear well-guarded.',
                conclusion: 'Trace verified. The logic levels are consistent with CMOS rail-to-rail swing requirements.',
                insight: 'Overshoot and ringing in real waveforms are caused by parasitic inductance. Your digital abstraction here assumes zero-Ohm ideal interconnects.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                observation: 'Monitoring probe activity.',
                analysis: 'The oscilloscope tracks logic state over time. Each grid division represents a simulation time slice. Notice how internal nodes lag behind primary inputs by gate delay increments.',
                conclusion: 'Continue observation. If a signal remains floating (Hi-Z), it may indicate an unconnected net or a tri-state contention.',
                insight: 'In high-speed design, trace length matching is critical to ensure signals arrive at the destination within the same clock cycle.',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                observation: 'Signal history recording active.',
                analysis: 'Logic 1 is HIGH, Logic 0 is LOW. The horizontal axis is time. If you see no transitions, check if your inputs are being toggled or if the simulation is running.',
                conclusion: 'Start by probing a clock or a switch. Verify that the waveform changes as you interact with the circuit components.',
                insight: 'Reading a waveform is like reading the pulse of a circuit. It tells you WHAT happened, and precisely WHEN it happened.',
                tier: 'struggling',
            },
        ],
    },
};

export function useSigmaMentorL4() {
    const history = useRef<boolean[]>([]);
    const used = useRef<Record<string, Set<number>>>({});

    const recordInteraction = useCallback((success: boolean) => {
        history.current = [...history.current.slice(-2), success];
    }, []);

    const getTier = useCallback((): L4Tier => {
        const h = history.current;
        if (h.length === 0) return 'steady';
        const ok = h.filter(Boolean).length;
        if (ok === h.length && h.length >= 2) return 'sharp';
        if (ok >= Math.ceil(h.length * 0.6)) return 'steady';
        return 'struggling';
    }, []);

    const getResponse = useCallback((scene: L4Scene): SigmaL4Response => {
        const tier = getTier();
        const pool = DB[scene][tier];
        const key = `${scene}-${tier}`;
        if (!used.current[key]) used.current[key] = new Set();
        const usedSet = used.current[key];
        let avail = pool.map((_, i) => i).filter(i => !usedSet.has(i));
        if (avail.length === 0) { usedSet.clear(); avail = pool.map((_, i) => i); }
        const idx = avail[Math.floor(Math.random() * avail.length)];
        usedSet.add(idx);
        return pool[idx];
    }, [getTier]);

    return { recordInteraction, getResponse, getTier };
}
