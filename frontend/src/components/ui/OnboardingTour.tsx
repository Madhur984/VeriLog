import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, ArrowLeft, ArrowRight } from 'lucide-react';


/* ─── Step Definitions ───────────────────────────────────────────── */

export interface TourStep {
    /** CSS selector or element ref ID to spotlight */
    targetId: string;
    title: string;
    body: string;
    /** Placement of the tooltip relative to the spotlight */
    placement: 'top' | 'bottom' | 'left' | 'right';
    /** Accent color for this step */
    accent?: string;
}

const DEFAULT_STEPS: TourStep[] = [
    {
        targetId: 'tour-sidebar',
        title: 'Your Navigation Hub',
        body: 'Use the sidebar to switch between Dashboard, Challenges, Workbench, and Progress. Everything you need is one click away.',
        placement: 'right',
        accent: '#3b82f6',
    },
    {
        targetId: 'tour-header-search',
        title: '⌘K — Command Palette',
        body: 'Press ⌘K (or Ctrl+K) anytime to instantly search modules, navigate pages, or trigger actions — like a power user.',
        placement: 'bottom',
        accent: '#a78bfa',
    },
    {
        targetId: 'tour-map',
        title: 'Your Progression Map',
        body: 'This interactive map shows your learning path. Complete the 5 core modules to unlock three specialization branches: Basic Electronics, DSD, and Verilog.',
        placement: 'top',
        accent: '#22c55e',
    },
    {
        targetId: 'tour-module-node',
        title: 'Module Nodes',
        body: 'Hover over any glowing bubble to reveal its module card — showing your progress, lesson count, and a Start button. Green means done. Blue means in-progress.',
        placement: 'top',
        accent: '#3b82f6',
    },
    {
        targetId: 'tour-progress-card',
        title: 'Track Your Growth',
        body: 'Your overall completion percentage lives here. As you finish modules, this bar grows. Aim for 100% to master all three branches!',
        placement: 'top',
        accent: '#f59e0b',
    },
];

/* ─── Spotlight Box ───────────────────────────────────────────────── */

interface SpotlightRect {
    top: number; left: number; width: number; height: number;
}

/* ─── Props ───────────────────────────────────────────────────────── */

interface OnboardingTourProps {
    isOpen: boolean;
    onClose: () => void;
    steps?: TourStep[];
    /** Per-user localStorage key written when tour is dismissed */
    storageKey?: string;
}

/* ─── Component ───────────────────────────────────────────────────── */

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
    isOpen,
    onClose,
    steps = DEFAULT_STEPS,
    storageKey = 'digi_tour_done',
}) => {
    const [stepIdx, setStepIdx] = useState(0);
    const [rect, setRect] = useState<SpotlightRect | null>(null);
    const step = steps[stepIdx];
    const isFirst = stepIdx === 0;
    const isLast = stepIdx === steps.length - 1;

    const PADDING = 12;

    useEffect(() => {
        if (!isOpen) return;
        setStepIdx(0);
    }, [isOpen]);

    /* Measure spotlight target */
    useEffect(() => {
        if (!isOpen || !step) return;
        const measure = () => {
            const el = document.getElementById(step.targetId);
            if (!el) { setRect(null); return; }
            const r = el.getBoundingClientRect();
            setRect({
                top: r.top - PADDING,
                left: r.left - PADDING,
                width: r.width + PADDING * 2,
                height: r.height + PADDING * 2,
            });
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [isOpen, stepIdx, step]);

    const next = () => {
        if (isLast) { handleClose(); return; }
        setStepIdx(i => i + 1);
    };
    const prev = () => setStepIdx(i => Math.max(0, i - 1));

    const handleClose = () => {
        localStorage.setItem(storageKey, '1');
        onClose();
    };

    /* Tooltip position relative to spotlight */
    const getTooltipStyle = (): React.CSSProperties => {
        if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' };
        const TOOLTIP_W = 320;
        const TOOLTIP_H = 200; // rough estimate
        const GAP = 16;

        switch (step.placement) {
            case 'right': return { top: rect.top, left: rect.left + rect.width + GAP };
            case 'left': return { top: rect.top, left: rect.left - TOOLTIP_W - GAP };
            case 'top': return { top: rect.top - TOOLTIP_H - GAP, left: rect.left };
            case 'bottom': return { top: rect.top + rect.height + GAP, left: rect.left };
            default: return { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' };
        }
    };

    const accent = step?.accent ?? '#3b82f6';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] pointer-events-none">
                    {/* ── dark overlay with hole ── */}
                    {rect ? (
                        <svg
                            className="absolute inset-0 w-full h-full pointer-events-auto"
                            style={{ mixBlendMode: 'normal' }}
                        >
                            <defs>
                                <mask id="tour-mask">
                                    <rect width="100%" height="100%" fill="white" />
                                    <rect
                                        x={rect.left} y={rect.top}
                                        width={rect.width} height={rect.height}
                                        rx="12" fill="black"
                                    />
                                </mask>
                            </defs>
                            <rect
                                width="100%" height="100%"
                                fill="rgba(0,0,0,0.75)"
                                mask="url(#tour-mask)"
                            />
                            {/* spotlight border */}
                            <motion.rect
                                x={rect.left} y={rect.top}
                                width={rect.width} height={rect.height}
                                rx="12"
                                fill="none"
                                stroke={accent}
                                strokeWidth="1.5"
                                opacity="0.7"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.7 }}
                                transition={{ duration: 0.3 }}
                            />
                            {/* clickable close zone on backdrop */}
                            <rect width="100%" height="100%" fill="transparent" onClick={handleClose} mask="url(#tour-mask)" />
                        </svg>
                    ) : (
                        <motion.div
                            className="absolute inset-0 bg-black/75 pointer-events-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={handleClose}
                        />
                    )}

                    {/* ── Tooltip Card ── */}
                    <motion.div
                        key={stepIdx}
                        className="absolute pointer-events-auto w-[300px] rounded-2xl border border-white/10 bg-[#0d1118] shadow-[0_16px_60px_rgba(0,0,0,0.8)] overflow-hidden"
                        style={getTooltipStyle()}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* top accent bar */}
                        <div className="h-[2px] w-full" style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }} />

                        <div className="p-5">
                            {/* step badge */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wide"
                                    style={{ borderColor: `${accent}40`, color: accent, background: `${accent}12` }}>
                                    <Zap className="w-3 h-3" />
                                    Step {stepIdx + 1} of {steps.length}
                                </div>
                                <button onClick={handleClose} className="p-1 rounded-md hover:bg-white/[0.06] text-slate-600 hover:text-slate-300 transition-colors cursor-pointer">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <h3 className="text-[15px] font-bold text-white mb-1.5 leading-snug">{step.title}</h3>
                            <p className="text-[12px] text-slate-400 leading-relaxed mb-5">{step.body}</p>

                            {/* Progress dots */}
                            <div className="flex gap-1.5 mb-5">
                                {steps.map((_, i) => (
                                    <button key={i} onClick={() => setStepIdx(i)}
                                        className="cursor-pointer transition-all duration-200 rounded-full"
                                        style={{
                                            width: i === stepIdx ? 20 : 6,
                                            height: 6,
                                            background: i === stepIdx ? accent : '#1e293b',
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={handleClose}
                                    className="text-[12px] text-slate-500 hover:text-slate-300 cursor-pointer transition-colors"
                                >
                                    Skip tour
                                </button>
                                <div className="flex items-center gap-2">
                                    {!isFirst && (
                                        <button
                                            onClick={prev}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-[12px] text-slate-300 cursor-pointer transition-colors"
                                        >
                                            <ArrowLeft className="w-3 h-3" /> Back
                                        </button>
                                    )}
                                    <button
                                        onClick={next}
                                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[12px] font-semibold text-white cursor-pointer transition-all"
                                        style={{ background: accent }}
                                    >
                                        {isLast ? 'Finish' : 'Next'} <ArrowRight className="w-3 h-3" />
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
