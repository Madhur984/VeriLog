/**
 * constants/skills.ts — Engineering Skill Tree Data
 */

export type SkillDomain = 'foundations' | 'digital' | 'hdl' | 'hardware';

export interface SkillNode {
    id: string;
    title: string;
    tier: 1 | 2 | 3 | 4 | 5;
    domain: SkillDomain;
    xpRequired: number;
    prerequisites: string[];
    route?: string;
    description: string;
    // Layout position for the canvas (can be adjusted)
    x: number;
    y: number;
}

export const SKILLS: SkillNode[] = [
    // Tier 1
    { id: 'signals', title: 'Signals', tier: 1, domain: 'foundations', xpRequired: 0, prerequisites: [], route: '/module/1', description: 'Voltage, current, and the nature of electrical signals.', x: 100, y: 300 },

    // Tier 2
    { id: 'analog-digital', title: 'Analog vs Digital', tier: 2, domain: 'foundations', xpRequired: 50, prerequisites: ['signals'], route: '/module/3', description: 'Continuous signals vs. discrete binary representation.', x: 300, y: 300 },
    { id: 'binary', title: 'Binary Systems', tier: 2, domain: 'digital', xpRequired: 80, prerequisites: ['analog-digital'], route: '/module/3', description: 'Number bases, 2\'s complement, binary arithmetic.', x: 500, y: 200 },
    { id: 'logic-gates', title: 'Logic Gates', tier: 2, domain: 'digital', xpRequired: 80, prerequisites: ['analog-digital'], route: '/circuit-lab', description: 'AND, OR, NOT, NAND, NOR, XOR — gate library unlocked.', x: 500, y: 400 },

    // Tier 3
    { id: 'boolean', title: 'Boolean Algebra', tier: 3, domain: 'digital', xpRequired: 150, prerequisites: ['binary', 'logic-gates'], description: 'De Morgan\'s laws, minimization, Karnaugh maps.', x: 700, y: 300 },
    { id: 'combi', title: 'Combinational Circuits', tier: 3, domain: 'digital', xpRequired: 200, prerequisites: ['logic-gates'], route: '/circuit-lab', description: 'Adders, multiplexers, decoders, encoders.', x: 700, y: 500 },
    { id: 'sequential', title: 'Sequential Logic', tier: 3, domain: 'digital', xpRequired: 280, prerequisites: ['combi'], description: 'Latches, flip-flops, registers, counters.', x: 900, y: 400 },
    { id: 'fsm', title: 'FSM Design', tier: 3, domain: 'digital', xpRequired: 320, prerequisites: ['sequential'], route: '/fsm', description: 'Moore/Mealy machines, state encoding, FSM Playground unlocked.', x: 900, y: 600 },

    // Tier 4
    { id: 'verilog-basics', title: 'Verilog Fundamentals', tier: 4, domain: 'hdl', xpRequired: 450, prerequisites: ['fsm', 'sequential'], description: 'Modules, ports, always blocks, continuous assignment.', x: 1100, y: 500 },
    { id: 'verilog-adv', title: 'Testbenching', tier: 4, domain: 'hdl', xpRequired: 560, prerequisites: ['verilog-basics'], description: 'Writing simulation testbenches, $dumpvars, waveform verification.', x: 1300, y: 500 },
    { id: 'synthesis', title: 'Synthesis Principles', tier: 4, domain: 'hdl', xpRequired: 640, prerequisites: ['verilog-adv'], description: 'RTL to gate-level, combinational vs. sequential inference.', x: 1500, y: 500 },

    // Tier 5
    { id: 'fpga', title: 'FPGA Architecture', tier: 5, domain: 'hardware', xpRequired: 800, prerequisites: ['synthesis'], description: 'CLBs, LUTs, routing fabric, clock networks. FPGA Lab unlocked.', x: 1700, y: 400 },
    { id: 'fpga-impl', title: 'FPGA Implementation', tier: 5, domain: 'hardware', xpRequired: 950, prerequisites: ['fpga'], description: 'Place-and-route, timing constraints, Basys 3 emulation.', x: 1900, y: 400 },
    { id: 'asic', title: 'ASIC Flow', tier: 5, domain: 'hardware', xpRequired: 900, prerequisites: ['synthesis'], description: 'Standard cell libraries, floorplanning, power analysis.', x: 1700, y: 600 },
    { id: 'vlsi', title: 'VLSI Design', tier: 5, domain: 'hardware', xpRequired: 1100, prerequisites: ['asic', 'fpga-impl'], description: 'Transistor layout, DRC, LVS, tape-out simulation.', x: 2100, y: 500 },
];

export const DOMAIN_COLORS: Record<SkillDomain, string> = {
    foundations: '#00D4FF',
    digital: '#A78BFA',
    hdl: '#F59E0B',
    hardware: '#10B981',
};
