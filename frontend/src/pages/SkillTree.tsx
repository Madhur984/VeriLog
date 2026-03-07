/**
 * pages/SkillTree.tsx — Engineering Skill Tree
 *
 * Visual skill progression from Signals → VLSI.
 * Skills render as PCB-trace-connected IC nodes.
 * Completed skills glow green, available pulse cyan, locked are dimmed.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, CheckCircle2, Zap } from 'lucide-react';

const T = {
    bg: '#060C1A', card: '#0D0F16', border: '#1A1D24',
    text: '#E5E7EB', muted: '#64748B', accent: '#00D4FF',
    success: '#10B981', warning: '#F59E0B',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
    sans: "'Inter',system-ui,sans-serif",
} as const;

type SkillStatus = 'locked' | 'available' | 'complete';

interface SkillNode {
    id: string;
    title: string;
    tier: 1 | 2 | 3 | 4 | 5;
    domain: string;
    xpRequired: number;
    prerequisites: string[];
    route?: string;
    unlocks: string[];
    description: string;
}

const SKILLS: SkillNode[] = [
    // Tier 1
    { id: 'signals', title: 'Signals', tier: 1, domain: 'foundations', xpRequired: 0, prerequisites: [], route: '/module/1', unlocks: ['analog-digital'], description: 'Voltage, current, and the nature of electrical signals.' },
    // Tier 2
    { id: 'analog-digital', title: 'Analog vs Digital', tier: 2, domain: 'foundations', xpRequired: 50, prerequisites: ['signals'], route: '/module/2', unlocks: ['binary', 'logic-gates'], description: 'Continuous signals vs. discrete binary representation.' },
    // Tier 2
    { id: 'binary', title: 'Binary Systems', tier: 2, domain: 'digital', xpRequired: 80, prerequisites: ['analog-digital'], route: '/module/3', unlocks: ['gates-adv', 'boolean'], description: 'Number bases, 2\'s complement, binary arithmetic.' },
    { id: 'logic-gates', title: 'Logic Gates', tier: 2, domain: 'digital', xpRequired: 80, prerequisites: ['analog-digital'], route: '/circuit-lab', unlocks: ['boolean', 'combi'], description: 'AND, OR, NOT, NAND, NOR, XOR — gate library unlocked.' },
    // Tier 3
    { id: 'boolean', title: 'Boolean Algebra', tier: 3, domain: 'digital', xpRequired: 150, prerequisites: ['binary', 'logic-gates'], unlocks: ['combi'], description: 'De Morgan\'s laws, minimization, Karnaugh maps.' },
    { id: 'combi', title: 'Combinational Circuits', tier: 3, domain: 'digital', xpRequired: 200, prerequisites: ['logic-gates'], route: '/circuit-lab', unlocks: ['sequential', 'fsm'], description: 'Adders, multiplexers, decoders, encoders.' },
    // Tier 3
    { id: 'sequential', title: 'Sequential Logic', tier: 3, domain: 'digital', xpRequired: 280, prerequisites: ['combi'], unlocks: ['fsm', 'verilog-basics'], description: 'Latches, flip-flops, registers, counters.' },
    { id: 'fsm', title: 'FSM Design', tier: 3, domain: 'digital', xpRequired: 320, prerequisites: ['sequential'], route: '/fsm', unlocks: ['verilog-basics'], description: 'Moore/Mealy machines, state encoding, FSM Playground unlocked.' },
    // Tier 4
    { id: 'verilog-basics', title: 'Verilog Fundamentals', tier: 4, domain: 'hdl', xpRequired: 450, prerequisites: ['fsm', 'sequential'], unlocks: ['verilog-adv', 'synthesis'], description: 'Modules, ports, always blocks, continuous assignment.' },
    { id: 'verilog-adv', title: 'Testbenching', tier: 4, domain: 'hdl', xpRequired: 560, prerequisites: ['verilog-basics'], unlocks: ['synthesis'], description: 'Writing simulation testbenches, $dumpvars, waveform verification.' },
    { id: 'synthesis', title: 'Synthesis Principles', tier: 4, domain: 'hdl', xpRequired: 640, prerequisites: ['verilog-adv'], unlocks: ['fpga', 'asic'], description: 'RTL to gate-level, combinational vs. sequential inference.' },
    // Tier 5
    { id: 'fpga', title: 'FPGA Architecture', tier: 5, domain: 'hardware', xpRequired: 800, prerequisites: ['synthesis'], unlocks: ['fpga-impl'], description: 'CLBs, LUTs, routing fabric, clock networks. FPGA Lab unlocked.' },
    { id: 'fpga-impl', title: 'FPGA Implementation', tier: 5, domain: 'hardware', xpRequired: 950, prerequisites: ['fpga'], unlocks: ['asic-flow'], description: 'Place-and-route, timing constraints, Basys 3 emulation.' },
    { id: 'asic', title: 'ASIC Flow', tier: 5, domain: 'hardware', xpRequired: 900, prerequisites: ['synthesis'], unlocks: ['vlsi'], description: 'Standard cell libraries, floorplanning, power analysis.' },
    { id: 'vlsi', title: 'VLSI Design', tier: 5, domain: 'hardware', xpRequired: 1100, prerequisites: ['asic', 'fpga-impl'], unlocks: [], description: 'Transistor layout, DRC, LVS, tape-out simulation.' },
];

const TIER_LABELS: Record<number, string> = {
    1: 'Foundations',
    2: 'Digital Basics',
    3: 'Sequential & Logic',
    4: 'HDL Programming',
    5: 'Hardware Design',
};

const DOMAIN_COLORS: Record<string, string> = {
    foundations: '#00D4FF',
    digital: '#A78BFA',
    hdl: '#F59E0B',
    hardware: '#10B981',
};

export function SkillTree() {
    const navigate = useNavigate();
    // Simulated progress — in production read from progressStore
    const [completedIds] = useState<Set<string>>(new Set(['signals', 'analog-digital']));
    const [totalXP] = useState(85);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    function getStatus(skill: SkillNode): SkillStatus {
        if (completedIds.has(skill.id)) return 'complete';
        const prereqsMet = skill.prerequisites.every(p => completedIds.has(p));
        const xpMet = totalXP >= skill.xpRequired;
        return prereqsMet && xpMet ? 'available' : 'locked';
    }

    const tiers = [1, 2, 3, 4, 5] as const;

    return (
        <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: T.sans }}>
            {/* Top bar */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px',
                borderBottom: `1px solid ${T.border}`, background: T.card,
            }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ArrowLeft size={16} />
                    <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>BACK</span>
                </button>
                <div style={{ width: 1, height: 20, background: T.border }} />
                <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${T.accent}80` }}>
                    Engineering Skill Tree
                </span>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Zap size={14} style={{ color: T.warning }} />
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.warning }}>{totalXP} XP</span>
                </div>
            </div>

            {/* Skill Grid */}
            <div style={{ padding: 32 }}>
                {tiers.map(tier => {
                    const tierSkills = SKILLS.filter(s => s.tier === tier);
                    return (
                        <div key={tier} style={{ marginBottom: 40 }}>
                            {/* Tier label */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                                <div style={{
                                    padding: '4px 12px', fontFamily: T.mono, fontSize: 7,
                                    letterSpacing: '0.2em', textTransform: 'uppercase',
                                    border: `1px solid ${T.border}`, borderRadius: 1,
                                    color: T.muted,
                                }}>
                                    TIER {tier}
                                </div>
                                <span style={{ fontFamily: T.sans, fontSize: 14, color: T.muted }}>
                                    {TIER_LABELS[tier]}
                                </span>
                                <div style={{ flex: 1, height: 1, background: T.border }} />
                            </div>

                            {/* Skill cards */}
                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                {tierSkills.map(skill => {
                                    const status = getStatus(skill);
                                    const domainColor = DOMAIN_COLORS[skill.domain] ?? T.muted;
                                    const isHovered = hoveredId === skill.id;

                                    return (
                                        <motion.div
                                            key={skill.id}
                                            whileHover={status !== 'locked' ? { y: -2 } : {}}
                                            onHoverStart={() => setHoveredId(skill.id)}
                                            onHoverEnd={() => setHoveredId(null)}
                                            onClick={() => status !== 'locked' && skill.route && navigate(skill.route)}
                                            style={{
                                                width: 200, padding: '16px 18px',
                                                background: status === 'complete'
                                                    ? `${T.success}08`
                                                    : status === 'available'
                                                        ? `${domainColor}06`
                                                        : T.card,
                                                border: `1px solid ${status === 'complete'
                                                    ? `${T.success}40`
                                                    : status === 'available'
                                                        ? `${domainColor}30`
                                                        : T.border}`,
                                                borderRadius: 4,
                                                cursor: status !== 'locked' && skill.route ? 'pointer' : 'default',
                                                opacity: status === 'locked' ? 0.45 : 1,
                                                transition: 'all 0.2s ease',
                                                boxShadow: isHovered && status !== 'locked'
                                                    ? `0 0 16px ${domainColor}20`
                                                    : 'none',
                                                position: 'relative',
                                            }}
                                        >
                                            {/* Status icon */}
                                            <div style={{ position: 'absolute', top: 10, right: 10 }}>
                                                {status === 'complete' && <CheckCircle2 size={14} style={{ color: T.success }} />}
                                                {status === 'locked' && <Lock size={12} style={{ color: T.muted }} />}
                                                {status === 'available' && (
                                                    <motion.div
                                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: domainColor }} />
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Domain badge */}
                                            <div style={{
                                                display: 'inline-block', marginBottom: 10,
                                                padding: '2px 6px', fontFamily: T.mono, fontSize: 6,
                                                letterSpacing: '0.15em', textTransform: 'uppercase',
                                                border: `1px solid ${domainColor}40`, borderRadius: 1,
                                                color: domainColor,
                                            }}>
                                                {skill.domain}
                                            </div>

                                            {/* Title */}
                                            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.text, letterSpacing: '0.06em', marginBottom: 8 }}>
                                                {skill.title}
                                            </div>

                                            {/* Description */}
                                            <div style={{ fontFamily: T.sans, fontSize: 12, color: T.muted, lineHeight: 1.5, marginBottom: 12 }}>
                                                {skill.description}
                                            </div>

                                            {/* XP requirement */}
                                            {status !== 'complete' && (
                                                <div style={{ fontFamily: T.mono, fontSize: 8, color: T.muted }}>
                                                    {skill.xpRequired > 0
                                                        ? `${skill.xpRequired} XP required`
                                                        : 'No XP required'}
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
