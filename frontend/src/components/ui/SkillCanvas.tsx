import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
// import { VisualCanvasEngine } from '../../engine/VisualCanvasEngine';
class VisualCanvasEngine {
    constructor(_config: any) {}
    getTransform() { return { x: 0, y: 0, scale: 1 }; }
    zoom(_delta: number, _x: number, _y: number, _rect: any) { return { x: 0, y: 0, scale: 1 }; }
    pan(_dx: number, _dy: number) { return { x: 0, y: 0, scale: 1 }; }
}

// Stubs for Gamification and Skills
const useGamificationStore = () => ({
    xp: { total: 0 },
    skills: { completedIds: [] as string[] }
});

type SkillDomain = 'combinational' | 'sequential' | 'system' | 'physical';
interface SkillNode {
    id: string;
    title: string;
    description: string;
    x: number;
    y: number;
    tier: number;
    domain: SkillDomain;
    xpRequired: number;
    prerequisites: string[];
    route?: string;
}

const SKILLS: SkillNode[] = [];
const DOMAIN_COLORS: Record<SkillDomain, string> = {
    combinational: '#0284C7',
    sequential: '#059669',
    system: '#D97706',
    physical: '#DC2626'
};

const engine = new VisualCanvasEngine({ snapToGrid: false });

export const SkillCanvas: React.FC = () => {
    const navigate = useNavigate();
    const { xp, skills } = useGamificationStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState(engine.getTransform());
    const [hoveredSkill, setHoveredSkill] = useState<SkillNode | null>(null);

    // Zoom/Pan logic
    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        if (e.ctrlKey) {
            // Zoom
            const delta = -e.deltaY * 0.005;
            setTransform(engine.zoom(delta, e.clientX, e.clientY, rect));
        } else {
            // Pan
            setTransform(engine.pan(-e.deltaX, -e.deltaY));
        }
    }, []);

    // Helper to check skill status
    const getSkillStatus = (skillId: string) => {
        const isComplete = skills.completedIds.includes(skillId);
        if (isComplete) return 'complete';

        const skill = SKILLS.find((s: SkillNode) => s.id === skillId);
        if (!skill) return 'locked';

        const prereqsMet = skill.prerequisites.length === 0 ||
            skill.prerequisites.every((p: string) => skills.completedIds.includes(p));
        const xpMet = xp.total >= skill.xpRequired;

        return prereqsMet && xpMet ? 'available' : 'locked';
    };

    return (
        <div
            ref={containerRef}
            onWheel={handleWheel}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                background: '#F1F5F9',
                position: 'relative',
                cursor: 'grab'
            }}
        >
            {/* Grid Pattern */}
            <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <defs>
                    <pattern
                        id="skill-grid"
                        x={transform.x}
                        y={transform.y}
                        width={40 * transform.scale}
                        height={40 * transform.scale}
                        patternUnits="userSpaceOnUse"
                    >
                        <circle cx={2} cy={2} r={1} fill="#E2E8F0" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#skill-grid)" />
            </svg>

            <svg
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'visible'
                }}
            >
                <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
                    {/* Connections (PCB Traces) */}
                    {SKILLS.map((skill: SkillNode) => (
                        skill.prerequisites.map((prereqId: string) => {
                            const prereq = SKILLS.find((s: SkillNode) => s.id === prereqId);
                            if (!prereq) return null;

                            const status = getSkillStatus(skill.id);
                            const color = status === 'locked' ? '#E2E8F0' : DOMAIN_COLORS[skill.domain];

                            // Simple Bezier for trace
                            const dx = skill.x - prereq.x;
                            const midX = prereq.x + dx / 2;

                            return (
                                <g key={`${prereqId}-${skill.id}`}>
                                    <path
                                        d={`M ${prereq.x} ${prereq.y} C ${midX} ${prereq.y}, ${midX} ${skill.y}, ${skill.x} ${skill.y}`}
                                        fill="none"
                                        stroke={color}
                                        strokeWidth={2}
                                        opacity={status === 'locked' ? 0.3 : 0.6}
                                    />
                                    {status === 'complete' && (
                                        <motion.path
                                            d={`M ${prereq.x} ${prereq.y} C ${midX} ${prereq.y}, ${midX} ${skill.y}, ${skill.x} ${skill.y}`}
                                            fill="none"
                                            stroke={color}
                                            strokeWidth={3}
                                            strokeDasharray="10, 20"
                                            animate={{ strokeDashoffset: -100 }}
                                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                        />
                                    )}
                                </g>
                            );
                        })
                    ))}

                    {/* Skill Nodes (ICs) */}
                    {SKILLS.map((skill: SkillNode) => {
                        const status = getSkillStatus(skill.id);
                        const color = DOMAIN_COLORS[skill.domain];
                        const isHovered = hoveredSkill?.id === skill.id;

                        return (
                            <g
                                key={skill.id}
                                transform={`translate(${skill.x}, ${skill.y})`}
                                onMouseEnter={() => setHoveredSkill(skill)}
                                onMouseLeave={() => setHoveredSkill(null)}
                                onClick={() => status !== 'locked' && skill.route && navigate(skill.route)}
                                style={{ cursor: status !== 'locked' ? 'pointer' : 'not-allowed' }}
                            >
                                {/* Outer Glow */}
                                {status === 'available' && (
                                    <motion.rect
                                        x={-45} y={-35} width={90} height={70} rx={4}
                                        fill="none" stroke={color} strokeWidth={1}
                                        animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                )}

                                {/* IC Body */}
                                <rect
                                    x={-40} y={-30} width={80} height={60} rx={4}
                                    fill={status === 'locked' ? '#F1F5F9' : '#FFFFFF'}
                                    stroke={status === 'locked' ? '#E2E8F0' : color}
                                    strokeWidth={isHovered ? 2 : 1}
                                    opacity={status === 'locked' ? 0.6 : 1}
                                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }}
                                />

                                {/* Pins */}
                                {[-20, 0, 20].map(py => (
                                    <React.Fragment key={py}>
                                        <rect x={-46} y={py - 2} width={6} height={4} fill={status === 'locked' ? '#E2E8F0' : '#94A3B8'} />
                                        <rect x={40} y={py - 2} width={6} height={4} fill={status === 'locked' ? '#E2E8F0' : '#94A3B8'} />
                                    </React.Fragment>
                                ))}

                                {/* Label */}
                                <text
                                    textAnchor="middle"
                                    y={-40}
                                    fill={status === 'locked' ? '#94A3B8' : color}
                                    fontSize={10}
                                    fontWeight="bold"
                                    fontFamily="monospace"
                                >
                                    {skill.title.toUpperCase()}
                                </text>

                                {/* Status Icon */}
                                {status === 'complete' ? (
                                    <CheckCircle2 x={-10} y={-10} size={20} color="#059669" />
                                ) : status === 'locked' ? (
                                    <Lock x={-10} y={-10} size={20} color="#94A3B8" />
                                ) : (
                                    <Zap x={-10} y={-10} size={20} color={color} />
                                )}
                            </g>
                        );
                    })}
                </g>
            </svg>

            {/* Hover Info Overlay */}
            <AnimatePresence>
                {hoveredSkill && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        style={{
                            position: 'absolute',
                            right: 20,
                            top: 20,
                            width: 280,
                            padding: 24,
                            background: '#FFFFFF',
                            border: `1px solid ${DOMAIN_COLORS[hoveredSkill.domain]}20`,
                            borderRadius: 16,
                            zIndex: 100,
                            boxShadow: '0 12px 40px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <span style={{
                                color: DOMAIN_COLORS[hoveredSkill.domain],
                                fontSize: 10,
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}>
                                {hoveredSkill.domain}
                            </span>
                            <span style={{ color: '#94A3B8', fontSize: 10, fontWeight: 'bold' }}>TIER {hoveredSkill.tier}</span>
                        </div>
                        <h3 style={{ color: '#0F172A', margin: '0 0 8px 0', fontSize: 16, fontWeight: 800 }}>{hoveredSkill.title}</h3>
                        <p style={{ color: '#64748B', fontSize: 12, lineHeight: 1.6, margin: '0 0 16px 0', fontWeight: 500 }}>
                            {hoveredSkill.description}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                            <Zap size={14} color="#D97706" />
                            <span style={{ color: xp.total >= hoveredSkill.xpRequired ? '#059669' : '#DC2626', fontSize: 11, fontWeight: 'bold' }}>
                                {hoveredSkill.xpRequired} XP Required
                            </span>
                        </div>

                        {getSkillStatus(hoveredSkill.id) !== 'locked' && hoveredSkill.route && (
                            <button
                                onClick={() => navigate(hoveredSkill.route!)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: DOMAIN_COLORS[hoveredSkill.domain],
                                    border: 'none',
                                    borderRadius: 8,
                                    color: '#FFF',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    boxShadow: `0 4px 12px ${DOMAIN_COLORS[hoveredSkill.domain]}30`
                                }}
                            >
                                START MODULE <ArrowRight size={16} />
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls Help */}
            <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#94A3B8', fontSize: 10, fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace", fontWeight: 'bold' }}>
                SCROLL: PAN // CTRL+SCROLL: ZOOM // CLICK: SELECT
            </div>
        </div>
    );
};

