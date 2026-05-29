/**
 * pages/BossArena.tsx - Boss Engineering Challenges Hub
 *
 * 5 boss challenges, multi-phase, gamified.
 * Shows: locked/available/in-progress/complete states.
 * Links to Circuit Lab, Verilog Playground, FSM Playground, and FPGA Lab.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Lock, Zap, ChevronDown, ChevronRight,
    ExternalLink, Cpu, Shield,
} from 'lucide-react';

const T = {
    bg: '#F8FAFC', card: '#FFFFFF', surface: '#F1F5F9', border: '#E2E8F0',
    text: '#0F172A', muted: '#64748B', accent: '#0284C7',
    success: '#10B981', warning: '#F59E0B', error: '#EF4444',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
    sans: "'Inter',system-ui,sans-serif",
} as const;

type BossStatus = 'locked' | 'available' | 'in_progress' | 'complete';

interface BossPhase {
    id: string;
    title: string;
    tool: string;
    toolRoute?: string;
    description: string;
    xp: number;
}

interface BossChallenge {
    id: string;
    number: number;
    title: string;
    subtitle: string;
    domain: string;
    tier: number;
    xpReward: number;
    badgeTitle: string;
    badgeColor: string;
    requiredXP: number;
    phases: BossPhase[];
    description: string;
    concepts: string[];
}

const BOSSES: BossChallenge[] = [
    {
        id: 'boss01',
        number: 1,
        title: 'Traffic Light Controller',
        subtitle: 'FSM Design Challenge',
        domain: 'FSM + Sequential Logic',
        tier: 3,
        xpReward: 200,
        badgeTitle: 'Traffic Systems Engineer',
        badgeColor: '#F59E0B',
        requiredXP: 150,
        description: 'Design a complete traffic light controller FSM. Progress from state diagram → truth table → circuit implementation → Verilog code → simulation.',
        concepts: ['Moore FSM', 'State encoding', 'Sequential logic', 'RTL design'],
        phases: [
            { id: 'p1', title: 'Draw State Diagram', tool: 'FSM Playground', toolRoute: '/fsm', description: 'Create a 4-state FSM: RED, GREEN, YELLOW, ALL_RED. Define transitions triggered by a timer tick.', xp: 40 },
            { id: 'p2', title: 'State Transition Table', tool: 'FSM Playground', toolRoute: '/fsm', description: 'Derive the complete next-state table for all state × input combinations. Export it.', xp: 40 },
            { id: 'p3', title: 'Gate-Level Implementation', tool: 'Circuit Lab', toolRoute: '/circuit-lab', description: 'Build the state register (D flip-flops) + output decoder in Circuit Lab. Verify LED outputs cycle correctly.', xp: 50 },
            { id: 'p4', title: 'Verilog Implementation', tool: 'Verilog Playground', toolRoute: '/verilog', description: 'Write synthesizable Verilog: state register, next-state logic, output logic. Use the Traffic Light FSM exercise as scaffold.', xp: 50 },
            { id: 'p5', title: 'Simulate & Verify', tool: 'Verilog Playground', toolRoute: '/verilog', description: 'Run simulation. Confirm light cycles RED→GREEN→YELLOW→RED with correct timing.', xp: 20 },
        ],
    },
    {
        id: 'boss02',
        number: 2,
        title: '4-bit Ripple Carry Adder',
        subtitle: 'Combinational Design Challenge',
        domain: 'Combinational + ALU',
        tier: 3,
        xpReward: 180,
        badgeTitle: 'ALU Architect',
        badgeColor: '#00D4FF',
        requiredXP: 200,
        description: 'Build a 4-bit binary adder starting from a single-bit full adder in Circuit Lab, chain four together, then optimize with carry-lookahead.',
        concepts: ['Full adder', 'Gate-level design', 'Carry propagation', 'Timing optimization'],
        phases: [
            { id: 'p1', title: '1-bit Full Adder in Circuit Lab', tool: 'Circuit Lab', toolRoute: '/circuit-lab', description: 'Build the full adder from gates: 2 XOR + 2 AND + 1 OR. Verify Sum and Carry for all 8 input combinations.', xp: 35 },
            { id: 'p2', title: 'Chain 4 Full Adders', tool: 'Circuit Lab', toolRoute: '/circuit-lab', description: 'Connect 4 full adders in ripple-carry configuration. Connect Cout[n] → Cin[n+1]. Verify 4-bit addition.', xp: 35 },
            { id: 'p3', title: 'Verilog Full Adder', tool: 'Verilog Playground', toolRoute: '/verilog', description: 'Implement the full adder in Verilog using assign statements. Pass the Full Adder exercise.', xp: 30 },
            { id: 'p4', title: '4-bit Adder Verilog', tool: 'Verilog Playground', toolRoute: '/verilog', description: 'Instantiate 4 full_adder modules. Use wire [4:0] result to capture carry out. Verify all 256 combinations pass.', xp: 50 },
            { id: 'p5', title: 'Carry-Lookahead Upgrade', tool: 'Verilog Playground', toolRoute: '/verilog', description: 'Replace ripple carry with CLA. Compute generate (G=AB) and propagate (P=A⊕B) signals. Measure timing improvement.', xp: 30 },
        ],
    },
    {
        id: 'boss03',
        number: 3,
        title: 'Elevator Controller',
        subtitle: 'Complex FSM Design Challenge',
        domain: 'FSM + Control Systems',
        tier: 4,
        xpReward: 220,
        badgeTitle: 'Control Systems Architect',
        badgeColor: '#10B981',
        requiredXP: 300,
        description: 'Design an elevator controller for a 4-floor building. States include IDLE, MOVING_UP, MOVING_DOWN, DOOR_OPEN. Add priority logic for call buttons.',
        concepts: ['Complex FSM', 'Priority logic', 'Moore + Mealy mix', 'Real-world mapping'],
        phases: [
            { id: 'p1', title: 'Define States & Transitions', tool: 'FSM Playground', toolRoute: '/fsm', description: 'Map all 4 states: IDLE, MOVING_UP, MOVING_DOWN, DOOR_OPEN. Define guard conditions for each transition (floor_reached, button_pressed, door_timer).', xp: 50 },
            { id: 'p2', title: 'Add Request Logic', tool: 'FSM Playground', toolRoute: '/fsm', description: 'Add floor request register (4-bit). Modify FSM transitions to evaluate pending requests. Prioritize nearest floor.', xp: 50 },
            { id: 'p3', title: 'Verilog Implementation', tool: 'Verilog Playground', toolRoute: '/verilog', description: 'Implement state machine in Verilog. Separate always blocks for state register, next-state logic, and output logic.', xp: 60 },
            { id: 'p4', title: 'Testbench & Simulation', tool: 'Verilog Playground', toolRoute: '/verilog', description: 'Write a testbench. Simulate pressing floor 1 from floor 3, then floor 4 from floor 1. Verify correct MOVING_UP/DOWN sequence.', xp: 60 },
        ],
    },
    {
        id: 'boss04',
        number: 4,
        title: 'UART Transmitter',
        subtitle: 'Protocol Engineering Challenge',
        domain: 'Sequential + HDL + Protocol',
        tier: 4,
        xpReward: 300,
        badgeTitle: 'Protocol Engineer',
        badgeColor: '#A78BFA',
        requiredXP: 500,
        description: 'Implement a complete UART transmitter: 8N1 format with baud rate generator. From shift register design → Verilog implementation → FPGA synthesis.',
        concepts: ['Serial protocol', 'Baud rate generator', 'Shift register', 'State machine'],
        phases: [
            { id: 'p1', title: 'Shift Register in Circuit Lab', tool: 'Circuit Lab', toolRoute: '/circuit-lab', description: 'Build an 8-bit parallel-to-serial shift register using 8 D flip-flops. Verify serial output matches parallel input MSB-first.', xp: 60 },
            { id: 'p2', title: 'Verilog UART TX', tool: 'Verilog Playground', toolRoute: '/verilog', description: 'Complete the UART Transmitter exercise. Implement state machine: IDLE → START → DATA × 8 → STOP → IDLE.', xp: 80 },
            { id: 'p3', title: 'Baud Rate Generator', tool: 'Verilog Playground', toolRoute: '/verilog', description: 'Add a clock divider module to generate the baud clock from a 50MHz system clock. Target: 9600 baud.', xp: 80 },
            { id: 'p4', title: 'Integration & Waveform', tool: 'Verilog Playground', toolRoute: '/verilog', description: 'Connect UART TX to baud generator. Simulate sending 0xAB (10101011). Verify start → 8 data bits → stop on waveform.', xp: 80 },
        ],
    },
    {
        id: 'boss05',
        number: 5,
        title: '8-bit CPU Core',
        subtitle: 'CPU Architecture Capstone',
        domain: 'VLSI + HDL + Architecture',
        tier: 5,
        xpReward: 500,
        badgeTitle: 'CPU Architect',
        badgeColor: '#EF4444',
        requiredXP: 900,
        description: 'Design and implement a minimal 8-bit CPU: 4-instruction ISA, ALU, register file, program counter, and control unit. The ultimate VeriLog challenge.',
        concepts: ['ISA design', 'Datapath', 'Control unit FSM', 'Memory-mapped I/O'],
        phases: [
            { id: 'p1', title: 'Define Instruction Set', tool: 'Verilog Playground', toolRoute: '/verilog', description: 'Design a 4-instruction ISA: ADD, LOAD, STORE, JMP. Specify opcode encoding (8-bit instruction word format).', xp: 80 },
            { id: 'p2', title: 'ALU + Register File', tool: 'Verilog Playground', toolRoute: '/verilog', description: 'Implement 8-bit ALU (ADD, AND, OR, NOT operations) and a 4-register file with read/write ports.', xp: 100 },
            { id: 'p3', title: 'Control Unit FSM', tool: 'FSM Playground + Verilog', toolRoute: '/fsm', description: 'Design the fetch-decode-execute control unit FSM. Define control signals for each instruction.', xp: 100 },
            { id: 'p4', title: 'Full CPU Integration', tool: 'Verilog Playground', toolRoute: '/verilog', description: 'Connect ALU, register file, PC, and control unit in a top-level module. Wire up the datapath.', xp: 120 },
            { id: 'p5', title: 'Execute a Program', tool: 'Verilog Playground', toolRoute: '/verilog', description: 'Load a simple program (e.g., count to 10 using ADD + JMP). Run testbench. Verify register values after execution.', xp: 100 },
        ],
    },
];

// Simulated progress - in production read from progressStore
const USER_XP = 85;

export function BossArena() {
    const navigate = useNavigate();
    const [expandedBoss, setExpandedBoss] = useState<string | null>('boss01');
    const [hoveredBoss, setHoveredBoss] = useState<string | null>(null);

    function getBossStatus(boss: BossChallenge): BossStatus {
        if (USER_XP >= boss.requiredXP) return 'available';
        return 'locked';
    }

    return (
        <div
            className="min-h-[100svh] overflow-x-hidden"
            style={{ background: T.bg, color: T.text, fontFamily: T.sans }}
        >
            {/* Top Bar */}
            <div
                className="flex items-center gap-3 px-4 lg:px-6 py-3"
                style={{ background: T.card, borderBottom: `1px solid ${T.border}` }}
            >
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-1.5 min-h-[40px] min-w-[40px] shrink-0"
                    style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer' }}
                >
                    <ArrowLeft size={15} />
                    <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>BACK</span>
                </button>
                <div className="shrink-0" style={{ width: 1, height: 20, background: T.border }} />
                <Shield size={14} style={{ color: T.error, flexShrink: 0 }} />
                <span
                    className="hidden sm:inline truncate"
                    style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${T.error}80` }}
                >
                    Boss Engineering Challenges
                </span>
                <div className="ml-auto flex items-center gap-2 shrink-0">
                    <Zap size={13} style={{ color: T.warning }} />
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.warning }}>{USER_XP} XP</span>
                </div>
            </div>

            {/* Hero band */}
            <div
                className="px-4 sm:px-8 lg:px-12 pt-8 lg:pt-10 pb-8"
                style={{
                    background: `linear-gradient(180deg, #E0F2FE 0%, ${T.bg} 100%)`,
                    borderBottom: `1px solid ${T.border}`,
                }}
            >
                <div style={{ maxWidth: 720 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 8, color: `${T.error}80`, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 12 }}>
                        ADVANCED ENGINEERING CHALLENGES
                    </div>
                    <h1
                        className="text-2xl sm:text-3xl lg:text-4xl"
                        style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.02em', color: T.text, lineHeight: 1.2 }}
                    >
                        Boss Challenges
                    </h1>
                    <p style={{ margin: '12px 0 0', fontSize: 15, color: T.muted, lineHeight: 1.6, maxWidth: 580 }}>
                        Multi-phase engineering challenges that integrate every tool on the platform.
                        Complete them in order - each boss synthesizes everything you have learned.
                    </p>
                    {/* Stats row - wraps on mobile */}
                    <div className="flex flex-wrap gap-6 lg:gap-8 mt-5">
                        {[
                            { label: 'Total XP Available', value: BOSSES.reduce((s, b) => s + b.xpReward, 0), color: T.warning },
                            { label: 'Bosses Available', value: BOSSES.filter(b => USER_XP >= b.requiredXP).length, color: T.success },
                            { label: 'Total Bosses', value: BOSSES.length, color: T.muted },
                        ].map(stat => (
                            <div key={stat.label}>
                                <div style={{ fontFamily: T.mono, fontSize: 22, color: stat.color, fontWeight: 700 }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontFamily: T.mono, fontSize: 8, color: T.muted, marginTop: 2, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Boss List */}
            <div className="px-4 sm:px-8 lg:px-12 py-6 lg:py-8 w-full" style={{ maxWidth: 900 }}>
                {BOSSES.map((boss) => {
                    const status = getBossStatus(boss);
                    const isLocked = status === 'locked';
                    const isExpanded = expandedBoss === boss.id;
                    const isHovered = hoveredBoss === boss.id;

                    return (
                        <motion.div
                            key={boss.id}
                            onHoverStart={() => setHoveredBoss(boss.id)}
                            onHoverEnd={() => setHoveredBoss(null)}
                            style={{ marginBottom: 16, opacity: isLocked ? 0.45 : 1 }}
                        >
                            {/* Boss header card */}
                            <div
                                onClick={() => !isLocked && setExpandedBoss(isExpanded ? null : boss.id)}
                                className="flex items-center gap-3 sm:gap-5 px-4 sm:px-6 py-4 sm:py-5"
                                style={{
                                    background: T.card, border: `1px solid ${isHovered && !isLocked ? boss.badgeColor : T.border}`,
                                    borderRadius: isExpanded ? '4px 4px 0 0' : 4,
                                    cursor: isLocked ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: isHovered && !isLocked ? `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)` : 'none',
                                }}
                            >
                                {/* Boss number */}
                                <div style={{
                                    width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                                    background: isLocked ? T.surface : `${boss.badgeColor}15`,
                                    border: `2px solid ${isLocked ? T.border : boss.badgeColor + '50'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontFamily: T.mono, fontSize: 16, color: isLocked ? T.muted : boss.badgeColor,
                                    fontWeight: 700,
                                }}>
                                    {isLocked ? <Lock size={18} style={{ color: T.muted }} /> : boss.number}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center flex-wrap gap-2 mb-1">
                                        <span style={{
                                            padding: '2px 8px', fontFamily: T.mono, fontSize: 7,
                                            border: `1px solid ${boss.badgeColor}30`, borderRadius: 1,
                                            color: boss.badgeColor, letterSpacing: '0.1em', textTransform: 'uppercase',
                                            flexShrink: 0,
                                        }}>TIER {boss.tier}</span>
                                        <span className="truncate" style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>{boss.domain}</span>
                                    </div>
                                    <div className="truncate" style={{ fontFamily: T.mono, fontSize: 15, color: T.text, letterSpacing: '0.02em' }}>
                                        {boss.title}
                                    </div>
                                    <div className="truncate" style={{ fontFamily: T.sans, fontSize: 12, color: T.muted, marginTop: 2 }}>
                                        {boss.subtitle}
                                    </div>
                                </div>

                                <div className="shrink-0 text-right">
                                    <div style={{ fontFamily: T.mono, fontSize: 18, color: T.warning }}>+{boss.xpReward}</div>
                                    <div style={{ fontFamily: T.mono, fontSize: 7, color: T.muted, letterSpacing: '0.1em' }}>XP REWARD</div>
                                    {isLocked && (
                                        <div style={{ fontFamily: T.mono, fontSize: 8, color: T.error, marginTop: 4 }}>
                                            Req. {boss.requiredXP} XP
                                        </div>
                                    )}
                                </div>

                                <div className="shrink-0" style={{ color: T.muted }}>
                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </div>
                            </div>

                            {/* Expanded phases */}
                            <AnimatePresence>
                                {isExpanded && !isLocked && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div
                                            className="px-4 sm:px-6 py-5"
                                            style={{
                                                background: T.surface,
                                                border: `1px solid ${T.border}`, borderTop: 'none',
                                                borderRadius: '0 0 4px 4px',
                                            }}
                                        >
                                            {/* Description + Concepts */}
                                            <p style={{ margin: '0 0 16px', fontFamily: T.sans, fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
                                                {boss.description}
                                            </p>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
                                                {boss.concepts.map(c => (
                                                    <span key={c} style={{
                                                        padding: '3px 8px', fontFamily: T.mono, fontSize: 8,
                                                        border: `1px solid ${T.border}`, borderRadius: 1, color: T.muted,
                                                    }}>{c}</span>
                                                ))}
                                            </div>

                                            {/* Phases */}
                                            <div style={{ fontFamily: T.mono, fontSize: 7, color: T.muted, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
                                                Challenge Phases ({boss.phases.length})
                                            </div>
                                            {boss.phases.map((phase, pi) => (
                                                <div key={phase.id} style={{
                                                    display: 'flex', gap: 16, marginBottom: 12, alignItems: 'flex-start',
                                                }}>
                                                    {/* Phase number */}
                                                    <div style={{
                                                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                                        background: T.card,
                                                        border: `1px solid ${T.border}`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontFamily: T.mono, fontSize: 10, color: T.muted,
                                                    }}>
                                                        {pi + 1}
                                                    </div>

                                                    <div style={{ flex: 1, paddingTop: 4 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.text }}>
                                                                {phase.title}
                                                            </span>
                                                            <span style={{ fontFamily: T.mono, fontSize: 7, color: T.warning }}>
                                                                +{phase.xp} XP
                                                            </span>
                                                        </div>
                                                        <p style={{ margin: 0, fontFamily: T.sans, fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
                                                            {phase.description}
                                                        </p>
                                                        {phase.toolRoute && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); navigate(phase.toolRoute!); }}
                                                                className="min-h-[40px] mt-2"
                                                                style={{
                                                                    padding: '4px 10px',
                                                                    display: 'inline-flex', alignItems: 'center', gap: 5,
                                                                    background: `${boss.badgeColor}10`,
                                                                    border: `1px solid ${boss.badgeColor}30`,
                                                                    borderRadius: 2, cursor: 'pointer',
                                                                    fontFamily: T.mono, fontSize: 8, color: boss.badgeColor,
                                                                    letterSpacing: '0.08em',
                                                                }}
                                                            >
                                                                <ExternalLink size={10} />
                                                                Open {phase.tool}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Badge reward */}
                                            <div
                                                className="flex flex-wrap items-center gap-3 mt-5 px-4 py-3"
                                                style={{
                                                    background: `${boss.badgeColor}06`,
                                                    border: `1px solid ${boss.badgeColor}30`,
                                                    borderRadius: 3,
                                                }}
                                            >
                                                <Cpu size={18} style={{ color: boss.badgeColor, flexShrink: 0 }} />
                                                <div className="flex-1 min-w-0">
                                                    <div style={{ fontFamily: T.mono, fontSize: 9, color: boss.badgeColor, letterSpacing: '0.1em' }}>
                                                        COMPLETION BADGE
                                                    </div>
                                                    <div style={{ fontFamily: T.sans, fontSize: 13, color: T.text, marginTop: 2 }}>
                                                        "{boss.badgeTitle}" - awarded on completing all phases
                                                    </div>
                                                </div>
                                                <div className="ml-auto shrink-0" style={{ fontFamily: T.mono, fontSize: 18, color: T.warning, fontWeight: 700 }}>
                                                    +{boss.xpReward}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
