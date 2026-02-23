import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { VoltMonkey, type MonkeyState } from '../Bot/VoltMonkey';

/* ═══════════════════════════════════════════════════════════════════
   OnboardingTour — Spotlight + VoltMonkey Mascot Edition
   ──────────────────────────────────────────────────────────────────
   A full-screen overlay that spotlights UI elements while the
   VoltMonkey mascot guides the user step-by-step.
   ═══════════════════════════════════════════════════════════════ */

export interface TourStep {
    targetId: string;
    title: string;
    body: string;
    placement: 'top' | 'bottom' | 'left' | 'right';
    accent?: string;
    mascotState?: MonkeyState;
}

const DEFAULT_STEPS: TourStep[] = [
    {
        targetId: 'tour-sidebar',
        title: 'Your Control Panel',
        body: "I'm VoltMonkey — your lab companion. This sidebar is your entry point: modules, progress, and challenges. Every great engineer starts here.",
        placement: 'right',
        accent: '#22C55E',
        mascotState: 'waving',
    },
    {
        targetId: 'tour-map',
        title: 'The Learning Tree',
        body: 'Five foundational modules. Each builds on the last — signal flow, logic gates, truth tables, Karnaugh maps. Complete them to unlock specialization branches.',
        placement: 'top',
        accent: '#22C55E',
        mascotState: 'talking',
    },
    {
        targetId: 'tour-module-node',
        title: 'Module Nodes',
        body: 'Hover to inspect. Blue glow means in progress. Green means verified. Click to enter any module. The signal always starts here.',
        placement: 'top',
        accent: '#3b82f6',
        mascotState: 'talking',
    },
    {
        targetId: 'tour-progress-ring',
        title: 'Your Engineering Score',
        body: 'This ring tracks your system coverage. Fill it across all three branches — digital, analog, and architecture.',
        placement: 'bottom',
        accent: '#f59e0b',
        mascotState: 'happy',
    },
    {
        targetId: 'tour-header-search',
        title: 'Command Palette ⌘K',
        body: 'Press Ctrl+K to search modules, navigate, or trigger actions. The fastest path through any system.',
        placement: 'bottom',
        accent: '#a78bfa',
        mascotState: 'thinking',
    },
];

/* ── Spotlight ──────────────────────────────────────────────── */
interface SpotlightRect {
    top: number; left: number; width: number; height: number;
}

/* ── Props ──────────────────────────────────────────────────── */
interface OnboardingTourProps {
    isOpen: boolean;
    onClose: () => void;
    steps?: TourStep[];
    storageKey?: string;
}

/* ── Confetti burst (simple CSS particles) ────────────────── */
const ConfettiBurst: React.FC = () => {
    const colors = ['#22C55E', '#FACC15', '#3B82F6', '#F472B6', '#A78BFA', '#FB923C'];
    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 200, overflow: 'hidden' }}>
            {Array.from({ length: 40 }).map((_, i) => {
                const x = Math.random() * 100;
                const delay = Math.random() * 0.4;
                const size = 6 + Math.random() * 8;
                const color = colors[i % colors.length];
                const rotate = Math.random() * 360;
                return (
                    <motion.div
                        key={i}
                        initial={{ x: `${x}vw`, y: '-5vh', rotate, opacity: 1, scale: 1 }}
                        animate={{ y: '110vh', rotate: rotate + 360, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 1.5 + Math.random(), delay, ease: 'easeIn' }}
                        style={{
                            position: 'absolute', width: size, height: size,
                            borderRadius: Math.random() > 0.5 ? '50%' : 2,
                            background: color,
                        }}
                    />
                );
            })}
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════ */

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
    isOpen,
    onClose,
    steps = DEFAULT_STEPS,
    storageKey = 'digi_tour_done',
}) => {
    const [stepIdx, setStepIdx] = useState(0);
    const [rect, setRect] = useState<SpotlightRect | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const step = steps[stepIdx];
    const isFirst = stepIdx === 0;
    const isLast = stepIdx === steps.length - 1;
    const PADDING = 14;

    useEffect(() => {
        if (!isOpen) { setStepIdx(0); setShowConfetti(false); }
    }, [isOpen]);

    /* measure spotlight target */
    useEffect(() => {
        if (!isOpen || !step) return;
        const measure = () => {
            const el = document.getElementById(step.targetId);
            if (!el) { setRect(null); return; }
            const r = el.getBoundingClientRect();
            setRect({
                top: r.top - PADDING, left: r.left - PADDING,
                width: r.width + PADDING * 2, height: r.height + PADDING * 2,
            });
        };
        measure();
        window.addEventListener('resize', measure);
        window.addEventListener('scroll', measure, true);
        return () => { window.removeEventListener('resize', measure); window.removeEventListener('scroll', measure, true); };
    }, [isOpen, stepIdx, step]);

    const next = useCallback(() => {
        if (isLast) {
            setShowConfetti(true);
            setTimeout(() => { handleClose(); }, 1800);
            return;
        }
        setStepIdx(i => i + 1);
    }, [isLast]);

    const prev = () => setStepIdx(i => Math.max(0, i - 1));

    const handleClose = () => {
        localStorage.setItem(storageKey, '1');
        onClose();
    };

    /* tooltip + mascot position */
    const getPositions = () => {
        const base: { tooltip: React.CSSProperties; mascot: React.CSSProperties } = {
            tooltip: { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' },
            mascot: { top: '50%', left: '50%' },
        };
        if (!rect) return base;

        const GAP = 18;
        const TOOLTIP_W = 320;
        const MASCOT_OFFSET = 80; // monkey sits beside/above the tooltip

        switch (step.placement) {
            case 'right':
                return {
                    tooltip: { top: rect.top, left: rect.left + rect.width + GAP + MASCOT_OFFSET },
                    mascot: { top: rect.top - 10, left: rect.left + rect.width + GAP },
                };
            case 'left':
                return {
                    tooltip: { top: rect.top, left: rect.left - TOOLTIP_W - GAP - MASCOT_OFFSET },
                    mascot: { top: rect.top - 10, left: rect.left - GAP - 70 },
                };
            case 'bottom':
                return {
                    tooltip: { top: rect.top + rect.height + GAP + MASCOT_OFFSET, left: rect.left },
                    mascot: { top: rect.top + rect.height + GAP, left: rect.left + 10 },
                };
            case 'top':
                return {
                    tooltip: { top: rect.top - 220 - GAP, left: rect.left },
                    mascot: { top: rect.top - 120 - GAP, left: rect.left + TOOLTIP_W - 60 },
                };
            default:
                return base;
        }
    };

    const accent = step?.accent ?? '#22C55E';
    const mascotState: MonkeyState = step?.mascotState ?? 'talking';
    const positions = getPositions();
    const progress = ((stepIdx + 1) / steps.length) * 100;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100]" style={{ pointerEvents: 'none' }}>
                    {/* confetti */}
                    {showConfetti && <ConfettiBurst />}

                    {/* dark overlay with spotlight hole */}
                    {rect ? (
                        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'auto' }}>
                            <defs>
                                <mask id="tour-mask-v2">
                                    <rect width="100%" height="100%" fill="white" />
                                    <rect x={rect.left} y={rect.top} width={rect.width} height={rect.height} rx="14" fill="black" />
                                </mask>
                            </defs>
                            <rect width="100%" height="100%" fill="rgba(0,0,0,0.72)" mask="url(#tour-mask-v2)" />
                            {/* spotlight glow ring */}
                            <motion.rect
                                x={rect.left} y={rect.top} width={rect.width} height={rect.height} rx="14"
                                fill="none" stroke={accent} strokeWidth="2" opacity="0.6"
                                initial={{ opacity: 0 }} animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <rect width="100%" height="100%" fill="transparent" onClick={handleClose} mask="url(#tour-mask-v2)" />
                        </svg>
                    ) : (
                        <motion.div
                            className="absolute inset-0 bg-black/72"
                            style={{ pointerEvents: 'auto' }}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            onClick={handleClose}
                        />
                    )}

                    {/* ── VoltMonkey mascot ── */}
                    <motion.div
                        className="absolute"
                        style={{ ...positions.mascot, pointerEvents: 'auto', zIndex: 102 }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        key={`mascot-${stepIdx}`}
                    >
                        {/* Green pulse ring on final step */}
                        {isLast && (
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                style={{
                                    position: 'absolute', inset: -8,
                                    borderRadius: '50%',
                                    border: '3px solid #22C55E',
                                    pointerEvents: 'none',
                                }}
                            />
                        )}
                        <VoltMonkey state={mascotState} size="md" />
                    </motion.div>

                    {/* ── Tooltip Card ── */}
                    <motion.div
                        key={`tip-${stepIdx}`}
                        className="absolute overflow-hidden"
                        style={{
                            ...positions.tooltip,
                            pointerEvents: 'auto', zIndex: 101,
                            width: 320, borderRadius: 18,
                            background: '#0D1118',
                            border: '1px solid rgba(255,255,255,0.08)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                        }}
                        initial={{ opacity: 0, scale: 0.9, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* accent bar */}
                        <div style={{ height: 2, background: `linear-gradient(to right, transparent, ${accent}, transparent)` }} />

                        <div style={{ padding: '18px 22px' }}>
                            {/* header row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 5,
                                    fontSize: 10, fontWeight: 700, fontFamily: 'monospace',
                                    textTransform: 'uppercase', letterSpacing: '0.08em',
                                    color: accent, padding: '3px 9px', borderRadius: 20,
                                    background: `${accent}15`, border: `1px solid ${accent}30`,
                                }}>
                                    <Sparkles style={{ width: 11, height: 11 }} />
                                    Step {stepIdx + 1} of {steps.length}
                                </div>
                                <button
                                    onClick={handleClose}
                                    style={{
                                        border: 'none', background: 'rgba(255,255,255,0.04)',
                                        borderRadius: 8, padding: 4, cursor: 'pointer',
                                        color: '#64748B', display: 'flex',
                                    }}
                                >
                                    <X style={{ width: 14, height: 14 }} />
                                </button>
                            </div>

                            {/* title */}
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', margin: '0 0 6px', lineHeight: 1.35 }}>
                                {step.title}
                            </h3>

                            {/* body */}
                            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7, margin: '0 0 16px' }}>
                                {step.body}
                            </p>

                            {/* progress bar */}
                            <div style={{
                                height: 4, borderRadius: 4, background: '#1E293B', marginBottom: 16, overflow: 'hidden',
                            }}>
                                <motion.div
                                    style={{ height: '100%', borderRadius: 4, background: accent }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                />
                            </div>

                            {/* controls */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button
                                    onClick={handleClose}
                                    style={{
                                        fontSize: 12, color: '#64748B', background: 'none',
                                        border: 'none', cursor: 'pointer', padding: 0,
                                    }}
                                >
                                    Skip tour
                                </button>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {!isFirst && (
                                        <button
                                            onClick={prev}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 4,
                                                fontSize: 12, color: '#CBD5E1', background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.06)',
                                                borderRadius: 12, padding: '6px 12px', cursor: 'pointer',
                                            }}
                                        >
                                            <ArrowLeft style={{ width: 12, height: 12 }} /> Back
                                        </button>
                                    )}
                                    <button
                                        onClick={next}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 5,
                                            fontSize: 12, fontWeight: 600, color: 'white',
                                            background: accent, border: 'none',
                                            borderRadius: 12, padding: '6px 16px', cursor: 'pointer',
                                        }}
                                    >
                                        {isLast ? '🎉 Finish' : 'Next'} <ArrowRight style={{ width: 12, height: 12 }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
