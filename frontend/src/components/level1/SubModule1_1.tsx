import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo,
} from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { SignalRenderer } from '../../circuit-lab/SignalRenderer';
import { Zap, ChevronRight } from 'lucide-react';
import { VoltMonkeyPanel } from './VoltMonkeyPanel';

import { useGlobalSensory } from '../../hooks/useGlobalSensory';
import { useCursorGravity } from '../../hooks/useCursorGravity';
import type { CharacterState } from './VoltMonkeyPanel';

// ─── Utility Math ─────────────────────────────────────────────────────────

const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) =>
    Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

const lerp = (v0: number, v1: number, t: number) => v0 * (1 - t) + v1 * t;

// ─── SYSTEM 1: Energy-Layered Signal Path (3-Layer Circuit) ───────────────

const EnergySignalPath: React.FC<{
    state: 'incomplete' | 'broken' | 'complete';
    path: string;
    flowActive?: boolean;
}> = ({ state, path, flowActive }) => {
    const isActive = state === 'complete';
    const isBroken = state === 'broken';

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Layer 1: Base structure */}
            <path
                d={path}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
            />
            {/* Layer 2: Active layer */}
            {!isBroken && (
                <motion.path
                    d={path}
                    stroke={isActive ? '#00D2FF' : 'rgba(0,210,255,0.25)'}
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                        filter: isActive
                            ? 'drop-shadow(0 0 6px rgba(0,210,255,0.6))'
                            : 'drop-shadow(0 0 3px rgba(0,210,255,0.2))',
                    }}
                />
            )}
            {/* Broken path — render as red dashes */}
            {isBroken && (
                <>
                    <path
                        d="M 100,150 L 220,150"
                        stroke="#F87171"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="8 6"
                        style={{ filter: 'drop-shadow(0 0 4px rgba(248,113,113,0.5))' }}
                    />
                    <path
                        d="M 360,150 L 500,150"
                        stroke="#F87171"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="8 6"
                        style={{ filter: 'drop-shadow(0 0 4px rgba(248,113,113,0.5))' }}
                    />
                </>
            )}
            {/* Layer 3: Continuous flow animation (post-success) */}
            {isActive && flowActive && (
                <motion.path
                    d={path}
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="12 40"
                    animate={{ strokeDashoffset: [-100, -200] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
            )}
            {/* SignalRenderer for complete loop */}
            {isActive && <SignalRenderer path={path} isActive state="smooth" />}
        </svg>
    );
};

// ─── SYSTEM 3: Signal Personality ─────────────────────────────────────────

type ParticlePersonality = 'idle' | 'moving' | 'collision' | 'loop' | 'stopped' | 'success';

const SignalParticle: React.FC<{ state: ParticlePersonality }> = ({ state }) => {
    const isCollision = state === 'collision';
    const isSuccess = state === 'success';

    // Idle float: gentle up-down oscillation
    const floatAnim = state === 'idle' ? {
        y: [0, -6, 0],
        transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
    } : {};

    // Success: slight zoom + intensified glow
    const successAnim = isSuccess ? {
        scale: [1, 1.25, 1.1],
        transition: { duration: 0.4 },
    } : {};

    return (
        <motion.div
            animate={{ ...floatAnim, ...successAnim }}
            className={`w-7 h-7 rounded-full flex items-center justify-center relative ${
                isCollision ? 'bg-red-500' : 'bg-[#00D2FF]'
            }`}
            style={{
                boxShadow: isCollision
                    ? '0 0 30px rgba(248,113,113,0.7)'
                    : isSuccess
                        ? '0 0 50px rgba(0,210,255,1)'
                        : '0 0 30px rgba(0,210,255,0.6)',
            }}
        >
            <div
                className={`w-2.5 h-2.5 bg-white rounded-full ${
                    state === 'moving' || state === 'loop' ? 'animate-ping' : 'animate-pulse'
                }`}
            />
        </motion.div>
    );
};

// ─── Spark Burst — failure moment (System 3) ──────────────────────────────

const SparkBurst: React.FC<{ active: boolean }> = ({ active }) => {
    if (!active) return null;
    const sparks = [
        { dx: 14, dy: -10 },
        { dx: -10, dy: -14 },
        { dx: 10, dy: 16 },
        { dx: -14, dy: 8 },
        { dx: 18, dy: 2 },
        { dx: -6, dy: 18 },
    ];
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {sparks.map((s, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-[#00D2FF]"
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: s.dx * 2.5, y: s.dy * 2.5, opacity: 0, scale: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.02, ease: 'easeOut' }}
                    style={{ boxShadow: '0 0 6px rgba(0,210,255,0.9)' }}
                />
            ))}
        </div>
    );
};

// ─── Gap Indicator — intensity scales per onboarding step ─────────────────

const GapIndicator: React.FC<{ visible: boolean; intensity: number }> = ({
    visible,
    intensity,
}) => {
    if (!visible) return null;
    const opacityBase = 0.08 + intensity * 0.14;
    const glowSize = 20 + intensity * 28;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: [opacityBase, opacityBase * 2.8, opacityBase],
                scale: [1, 1 + intensity * 0.1, 1],
            }}
            transition={{ duration: 1.8 - intensity * 0.3, repeat: Infinity }}
            className="absolute w-28 h-28 rounded-full"
            style={{
                background: `radial-gradient(circle, rgba(248,113,113,${opacityBase * 1.8}) 0%, transparent 70%)`,
                filter: `blur(${glowSize}px)`,
                border: intensity > 0.5 ? '1px solid rgba(248,113,113,0.15)' : 'none',
            }}
        />
    );
};

// ─── Magnetic Ripple ──────────────────────────────────────────────────────

const MagneticRipple: React.FC<{ visible: boolean }> = ({ visible }) => {
    if (!visible) return null;
    return (
        <>
            <motion.div
                className="absolute w-20 h-20 rounded-full border border-[#00D2FF]/30 pointer-events-none"
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.1, repeat: Infinity }}
            />
            <motion.div
                className="absolute w-10 h-10 rounded-full border border-[#00D2FF]/50 pointer-events-none"
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: 0.35 }}
            />
        </>
    );
};

// ─── Energy Ripple — snap success flash ──────────────────────────────────

const EnergyRipple: React.FC<{ active: boolean }> = ({ active }) => {
    if (!active) return null;
    return (
        <>
            <motion.div
                className="absolute inset-0 rounded-[20px] border-2 border-[#00D2FF] pointer-events-none"
                initial={{ opacity: 0.9, scale: 1 }}
                animate={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <motion.div
                className="absolute inset-0 rounded-[20px] border border-[#00D2FF]/50 pointer-events-none"
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 0, scale: 1.08 }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
            />
        </>
    );
};

// ─── Ghost Preview Segment ────────────────────────────────────────────────

const GhostSegment: React.FC<{ visible: boolean }> = ({ visible }) => {
    if (!visible) return null;
    return (
        <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ x: [80, 0, 80], opacity: [0, 0.4, 0] }}
            transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.0 }}
            className="absolute w-16 h-8 bg-[#00D2FF]/30 rounded-lg border border-[#00D2FF]/25 flex items-center justify-center pointer-events-none"
            style={{ filter: 'blur(1px)' }}
        >
            <Zap size={14} className="text-[#00D2FF]/50" />
        </motion.div>
    );
};

// ─── SYSTEM 2: Focus Zone Card Container ─────────────────────────────────

const FocusCard: React.FC<{
    children: React.ReactNode;
    glowActive?: boolean;
    className?: string;
}> = ({ children, glowActive, className = '' }) => (
    <motion.div
        className={`relative flex items-center justify-center ${className}`}
        style={{
            width: 720,
            height: 380,
            background: glowActive
                ? 'radial-gradient(circle at center, rgba(0,210,255,0.08) 0%, rgba(20,27,45,0.6) 60%)'
                : 'rgba(14,19,32,0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 20,
            boxShadow: glowActive
                ? '0 0 60px rgba(0,210,255,0.12), inset 0 1px 0 rgba(255,255,255,0.05)'
                : 'inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
        animate={glowActive ? {
            boxShadow: [
                '0 0 30px rgba(0,210,255,0.08)',
                '0 0 60px rgba(0,210,255,0.18)',
                '0 0 30px rgba(0,210,255,0.08)',
            ],
        } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    >
        {children}
    </motion.div>
);

// ─── Draggable Segment ────────────────────────────────────────────────────

interface DraggableSegmentProps {
    onSnap: () => void;
    onDragStart: () => void;
    onboardingStep: number;
    targetRef: React.RefObject<HTMLDivElement>;
}

const DraggableSegment: React.FC<DraggableSegmentProps> = ({
    onSnap,
    onDragStart,
    onboardingStep,
    targetRef,
}) => {
    const { triggerHaptic, playSound } = useGlobalSensory();
    const { mouseX, mouseY, calculateMagneticPull } = useCursorGravity({ magneticRadius: 90, pullStrength: 0.12 });
    const localX = useMotionValue(0);
    const localY = useMotionValue(0);
    const [isNearSnap, setIsNearSnap] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const getTargetCenter = useCallback((): { x: number; y: number } | null => {
        if (!targetRef.current) return null;
        const rect = targetRef.current.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }, [targetRef]);

    const clearNearSnapInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    return (
        <motion.div
            drag
            dragConstraints={{ left: -260, right: 260, top: -160, bottom: 160 }}
            animate={onboardingStep === 2 ? { x: [0, 9, -9, 9, 0] } : undefined}
            transition={onboardingStep === 2 ? { duration: 0.55, ease: 'easeInOut' } : undefined}
            whileHover={{ scale: 1.06 }}
            onDragStart={() => {
                onDragStart();
                triggerHaptic('light');
                playSound('move');
                clearNearSnapInterval();
                setIsNearSnap(false);
            }}
            onDrag={(event) => {
                const target = getTargetCenter();
                if (!target) return;
                const ptrX = (event as PointerEvent).clientX ?? target.x;
                const ptrY = (event as PointerEvent).clientY ?? target.y;
                const dist = getDistance({ x: ptrX, y: ptrY }, target);

                if (dist < 60) {
                    const dx = target.x - ptrX;
                    const dy = target.y - ptrY;
                    localX.set(lerp(localX.get(), localX.get() + dx * 0.12, 0.25));
                    localY.set(lerp(localY.get(), localY.get() + dy * 0.12, 0.25));

                    if (!isNearSnap) {
                        setIsNearSnap(true);
                        playSound('tension');
                        intervalRef.current = setInterval(() => triggerHaptic('micro'), 800);
                    }
                } else if (isNearSnap) {
                    setIsNearSnap(false);
                    clearNearSnapInterval();
                }
            }}
            onDragEnd={(event) => {
                clearNearSnapInterval();
                setIsNearSnap(false);
                const target = getTargetCenter();
                if (!target) return;
                
                const ptrX = mouseX.get();
                const ptrY = mouseY.get();
                const dist = getDistance({ x: ptrX, y: ptrY }, target);
                
                if (dist < 80) {
                    triggerHaptic('medium');
                    playSound('snap');
                    onSnap();
                }
            }}
            className={`w-16 h-8 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center z-50 select-none ${
                isNearSnap
                    ? 'bg-[#00D2FF] border-2 border-white/50'
                    : 'bg-[#00D2FF]'
            }`}
            style={{
                x: localX, y: localY,
                boxShadow: isNearSnap
                    ? '0 0 48px rgba(0,210,255,0.95), 0 0 16px rgba(255,255,255,0.3)'
                    : '0 0 24px rgba(0,210,255,0.5)',
            }}
        >
            <Zap size={14} className="text-black" />
        </motion.div>
    );
};

// ─── Loop System ──────────────────────────────────────────────────────────

const LoopSystem: React.FC<{ active: boolean; path: string; flowActive?: boolean }> = ({
    active,
    path,
    flowActive,
}) => (
    <div className="relative w-full h-full">
        <EnergySignalPath
            state={active ? 'complete' : 'broken'}
            path={path}
            flowActive={flowActive}
        />
    </div>
);

// ─── Overlay Labels ───────────────────────────────────────────────────────

const OverlayLabels: React.FC<{ visible: boolean }> = ({ visible }) => {
    if (!visible) return null;
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex gap-24 mt-[-140px]">
                {['SOURCE', 'PATH', 'WORK', 'RETURN'].map((label) => (
                    <motion.span
                        key={label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 0.35, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em]"
                    >
                        {label}
                    </motion.span>
                ))}
            </div>
        </div>
    );
};

// ─── Control Toggle ───────────────────────────────────────────────────────

const ControlToggle: React.FC<{
    active: boolean;
    onToggle: () => void;
    label: string;
}> = ({ active, onToggle, label }) => {
    const { triggerHaptic, playSound } = useGlobalSensory();
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { triggerHaptic('light'); playSound('snap'); onToggle(); }}
            className={`px-10 py-4 rounded-full font-mono text-[10px] uppercase tracking-[0.2em] transition-all ${
                active
                    ? 'bg-[#00D2FF] text-[#050914] shadow-[0_20px_40px_rgba(0,210,255,0.3)]'
                    : 'bg-white/5 text-white/40 border border-white/10'
            }`}
        >
            {label}
        </motion.button>
    );
};

// ─── Main Scene Manager ───────────────────────────────────────────────────

interface SubModuleProps {
    onComplete: (sip: number) => void;
}

export const SubModule1_1: React.FC<SubModuleProps> = ({ onComplete }) => {
    const [screen, setScreen] = useState<number>(1);
    const [loopClosed, setLoopClosed] = useState(false);

    // Onboarding Engine
    const [onboardingStep, setOnboardingStep] = useState<number>(0);
    const [userInteracted, setUserInteracted] = useState(false);
    const [showContinue, setShowContinue] = useState(false);
    const [snapFlash, setSnapFlash] = useState(false);
    const [showGhost, setShowGhost] = useState(false);
    const [showSparkBurst, setShowSparkBurst] = useState(false);

    const { 
        triggerHaptic, 
        playSound, 
        dipAmbient, 
        restoreAmbient, 
        stopAmbient, 
        PACING 
    } = useGlobalSensory();
    const snapTargetRef = useRef<HTMLDivElement>(null);

    const idleTimer1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
    const idleTimer2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
    const idleTimer3Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hapticIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearIdleTimers = () => {
        if (idleTimer1Ref.current) clearTimeout(idleTimer1Ref.current);
        if (idleTimer2Ref.current) clearTimeout(idleTimer2Ref.current);
        if (idleTimer3Ref.current) clearTimeout(idleTimer3Ref.current);
        if (hapticIntervalRef.current) clearInterval(hapticIntervalRef.current);
    };

    // Idle onboarding timers — screen 5 only
    useEffect(() => {
        if (screen !== 5 || userInteracted) return;

        idleTimer1Ref.current = setTimeout(() => {
            setOnboardingStep(1);
            triggerHaptic('micro');
            dipAmbient();
        }, PACING.TEXT_DELAY + 200);

        idleTimer2Ref.current = setTimeout(() => {
            setOnboardingStep(2);
            playSound('tension');
            dipAmbient();
            hapticIntervalRef.current = setInterval(() => triggerHaptic('micro'), 800);
        }, PACING.TEXT_DELAY * 2 + 400);

        idleTimer3Ref.current = setTimeout(() => {
            setShowGhost(true);
        }, PACING.TEXT_DELAY * 3 + 600);

        return () => clearIdleTimers();
    }, [screen, userInteracted]);

    // Ambient hum on screen 5
    useEffect(() => {
        if (screen === 5) {
            playSound('ambient');
        } else {
            stopAmbient();
        }
    }, [screen, playSound, stopAmbient]);

    // Screen 3 — failure / spark burst
    useEffect(() => {
        if (screen === 3) {
            triggerHaptic('heavy');
            playSound('fail');
            setShowSparkBurst(true);
            setTimeout(() => setShowSparkBurst(false), PACING.ANIMATION);
            setTimeout(() => setScreen(4), PACING.TEXT_DELAY);
        }
    }, [screen]);

    // Screen 6 — success, auto-progress
    useEffect(() => {
        if (screen === 6) {
            playSound('success');
            triggerHaptic('success');
            const continueTimer = setTimeout(() => setShowContinue(true), PACING.TEXT_DELAY * 0.7);
            const progressTimer = setTimeout(() => setScreen(7), PACING.TEXT_DELAY * 1.6);
            return () => {
                clearTimeout(continueTimer);
                clearTimeout(progressTimer);
            };
        }
        setShowContinue(false);
    }, [screen]);

    const handleDragStart = useCallback(() => {
        setUserInteracted(true);
        setOnboardingStep(-1);
        setShowGhost(false);
        restoreAmbient();
        clearIdleTimers();
    }, [restoreAmbient]);

    const handleSnap = useCallback(() => {
        setSnapFlash(true);
        setTimeout(() => setSnapFlash(false), 900);
        setScreen(6);
    }, []);

    const loopPath = 'M 100,150 L 500,150 A 50,50 0 0,1 500,250 L 100,250 A 50,50 0 0,1 100,150';

    // Microcopy & Global Character State
    const onboardingDialogue = useMemo(() => {
        if (onboardingStep === 0) return { obs: 'It almost worked.', why: 'The path is broken.', conclusion: 'Observe the gap.', tier: 'steady' as const, characterState: 'idle' as CharacterState };
        if (onboardingStep === 1) return { obs: 'Something stopped it.', why: 'Energy has nowhere to go.', conclusion: 'The break is visible.', tier: 'struggling' as const, characterState: 'observing' as CharacterState };
        if (onboardingStep === 2) return { obs: 'Try moving it.', why: 'The segment can bridge this.', conclusion: 'Connect the gap.', tier: 'struggling' as const, characterState: 'curious' as CharacterState };
        return null;
    }, [onboardingStep]);

    const screenDialogue: Record<number, { obs: string; why: string; conclusion: string; tier: 'sharp' | 'steady' | 'struggling', characterState: CharacterState }> = {
        1: { obs: 'Go.', why: 'A signal begins with movement.', conclusion: 'Drag to initiate.', tier: 'steady', characterState: 'idle' },
        2: { obs: "Don't stop.", why: 'Momentum is everything.', conclusion: 'Watch it travel.', tier: 'steady', characterState: 'observing' },
        3: { obs: 'Dissipation.', why: 'No return path — energy is lost.', conclusion: 'This is why loops exist.', tier: 'struggling', characterState: 'confused' },
        4: { obs: 'It almost worked.', why: 'The path has a gap.', conclusion: 'Reconnect to continue.', tier: 'steady', characterState: 'idle' },
        5: { obs: 'It almost worked.', why: 'Something stopped it.', conclusion: 'Find the missing piece.', tier: 'steady', characterState: 'idle' },
        6: { obs: 'You fixed it.', why: 'Continuity restored.', conclusion: 'The loop is complete.', tier: 'sharp', characterState: 'excited' },
        7: { obs: 'Watch carefully.', why: 'The signal returns to source.', conclusion: 'That is the rule.', tier: 'steady', characterState: 'observing' },
        8: { obs: 'Now it stops.', why: 'No return — energy dies.', conclusion: 'Without a loop, nothing persists.', tier: 'struggling', characterState: 'confused' },
        9: { obs: 'A signal must return.', why: 'KVL: voltage sums to zero in any closed loop.', conclusion: "Nature's requirement.", tier: 'sharp', characterState: 'observing' },
        10: { obs: 'Now you control it.', why: 'Toggle the loop open and closed.', conclusion: 'Feel the difference.', tier: 'steady', characterState: 'idle' },
        11: { obs: 'So what are you, really?', why: 'You are the return path.', conclusion: 'Identity evolves.', tier: 'sharp', characterState: 'idle' },
    };

    const currentDialogue = useMemo(() => {
        if (screen === 5 && onboardingDialogue) return onboardingDialogue;
        return screenDialogue[screen] ?? screenDialogue[1];
    }, [screen, onboardingDialogue]);

    const gapIntensity = onboardingStep <= 0 ? 0 : onboardingStep === 1 ? 0.5 : 1;

    return (
        <div className="w-full h-full flex bg-[#050914] overflow-hidden">
            {/* ── Main Focus Area ── */}
            <div className="flex-1 flex flex-col items-center justify-center relative"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(0,210,255,0.04) 0%, transparent 65%)',
                }}
            >
                <AnimatePresence mode="wait">

                    {/* ── Screen 1: Identity init ── */}
                    {screen === 1 && (
                        <motion.div key="s1" exit={{ opacity: 0 }} className="flex flex-col items-center gap-16">
                            <p className="text-white font-mono text-[9px] tracking-[0.8em] uppercase opacity-20">
                                Identity Initialization
                            </p>
                            <motion.div
                                drag
                                onDragEnd={() => { triggerHaptic('medium'); playSound('move'); setScreen(2); }}
                                className="z-50 cursor-grab active:cursor-grabbing"
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <SignalParticle state="idle" />
                            </motion.div>
                        </motion.div>
                    )}

                    {/* ── Screen 2: Signal traveling ── */}
                    {screen === 2 && (
                        <FocusCard key="s2" glowActive>
                            <div className="w-[560px]">
                                <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 2, ease: 'easeInOut' }}
                                        onAnimationComplete={() => setScreen(3)}
                                        className="h-full bg-[#00D2FF]"
                                        style={{ boxShadow: '0 0 16px #00D2FF, 0 0 40px rgba(0,210,255,0.4)' }}
                                    />
                                </div>
                                {/* Signal particle riding the wave */}
                                <motion.div
                                    className="mt-[-18px] ml-[-14px]"
                                    initial={{ x: 0 }}
                                    animate={{ x: 560 }}
                                    transition={{ duration: 2, ease: 'easeInOut' }}
                                >
                                    <SignalParticle state="moving" />
                                </motion.div>
                            </div>
                        </FocusCard>
                    )}

                    {/* ── Screen 3: Collision (failure moment) ── */}
                    {screen === 3 && (
                        <FocusCard key="s3">
                            <div className="relative flex items-center justify-center">
                                <SparkBurst active={showSparkBurst} />
                                <SignalParticle state="collision" />
                            </div>
                        </FocusCard>
                    )}

                    {/* ── Screen 4: Gap awareness ── */}
                    {screen === 4 && (
                        <motion.div
                            key="s4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center gap-12"
                        >
                            <GapIndicator visible intensity={0.3} />
                            <ControlToggle active={false} onToggle={() => setScreen(5)} label="Reconnect Source" />
                        </motion.div>
                    )}

                    {/* ── Screen 5: CORE puzzle ── */}
                    {screen === 5 && (
                        <FocusCard
                            key="s5"
                            glowActive={onboardingStep >= 1}
                        >
                            {/* Success ripple */}
                            <EnergyRipple active={snapFlash} />

                            {/* 3-layer broken path */}
                            <EnergySignalPath
                                state="incomplete"
                                path="M 100,190 L 270,190 M 440,190 L 610,190"
                            />

                            {/* Gap snap zone */}
                            <div
                                ref={snapTargetRef}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-20 flex items-center justify-center"
                            >
                                <GapIndicator visible intensity={gapIntensity} />
                                <MagneticRipple visible={onboardingStep >= 2} />
                            </div>

                            {/* Ghost hint */}
                            <GhostSegment visible={showGhost} />

                            {/* The draggable piece */}
                            <DraggableSegment
                                onSnap={handleSnap}
                                onDragStart={handleDragStart}
                                onboardingStep={onboardingStep}
                                targetRef={snapTargetRef}
                            />
                        </FocusCard>
                    )}

                    {/* ── Screen 6: Loop closed (success) ── */}
                    {screen === 6 && (
                        <motion.div key="s6" className="flex flex-col items-center gap-10">
                            <FocusCard glowActive>
                                <LoopSystem active path={loopPath} flowActive />
                                {/* Success particle riding the loop */}
                                <motion.div
                                    className="absolute top-[136px] left-[90px] pointer-events-none z-10"
                                    animate={{ opacity: [0, 1] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <SignalParticle state="success" />
                                </motion.div>
                            </FocusCard>
                            <AnimatePresence>
                                {showContinue && (
                                    <motion.button
                                        key="continue-btn"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setScreen(7)}
                                        className="flex items-center gap-2 px-10 py-4 rounded-full bg-[#00D2FF] text-[#050914] font-mono text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-transform"
                                        style={{ boxShadow: '0 20px 40px rgba(0,210,255,0.35)' }}
                                    >
                                        Continue <ChevronRight size={12} />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* ── Screen 7: Observe return path ── */}
                    {screen === 7 && (
                        <motion.div key="s7" className="flex flex-col items-center gap-10">
                            <FocusCard glowActive>
                                <LoopSystem active path={loopPath} flowActive />
                                <OverlayLabels visible />
                            </FocusCard>
                            <ControlToggle
                                active={false}
                                onToggle={() => { triggerHaptic('heavy'); playSound('break'); setScreen(8); }}
                                label="Break Path"
                            />
                        </motion.div>
                    )}

                    {/* ── Screens 8–10: Rule states ── */}
                    {screen >= 8 && screen <= 10 && (
                        <motion.div key="rule-states" className="flex flex-col items-center gap-12">
                            {screen === 8 && (
                                <div className="text-center space-y-6">
                                    <motion.h2
                                        className="text-red-500 font-black text-6xl italic uppercase"
                                        animate={{ opacity: [0.08, 0.18, 0.08] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        Termination
                                    </motion.h2>
                                    <ControlToggle active onToggle={() => setScreen(9)} label="Analyze Failure →" />
                                </div>
                            )}
                            {screen === 9 && (
                                <div className="text-center space-y-12">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-12 rounded-[40px]"
                                        style={{
                                            background: 'rgba(0,210,255,0.04)',
                                            border: '1px solid rgba(0,210,255,0.18)',
                                            boxShadow: '0 0 40px rgba(0,210,255,0.06)',
                                        }}
                                    >
                                        <h2 className="text-[#00D2FF] text-4xl font-black uppercase tracking-tighter leading-none">
                                            "A signal must return<br />to its source."
                                        </h2>
                                    </motion.div>
                                    <ControlToggle active={false} onToggle={() => setScreen(10)} label="Test the law" />
                                </div>
                            )}
                            {screen === 10 && (
                                <div
                                    className="p-10 rounded-3xl space-y-8 min-w-[440px]"
                                    style={{
                                        background: 'rgba(10,14,26,0.85)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        backdropFilter: 'blur(12px)',
                                    }}
                                >
                                    <div className="flex justify-between font-mono text-[9px] uppercase opacity-40">
                                        <span>System Status</span>
                                        <span className={loopClosed ? 'text-[#10B981]' : 'text-red-500'}>
                                            {loopClosed ? 'Live' : 'Dark'}
                                        </span>
                                    </div>
                                    <div
                                        className="h-20 rounded-xl flex items-center justify-center relative overflow-hidden"
                                        style={{ background: 'rgba(0,0,0,0.4)' }}
                                    >
                                        <EnergySignalPath
                                            state={loopClosed ? 'complete' : 'broken'}
                                            path="M 40,40 L 360,40"
                                            flowActive={loopClosed}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <ControlToggle
                                            active={loopClosed}
                                            onToggle={() => { setLoopClosed(!loopClosed); triggerHaptic('medium'); playSound('snap'); }}
                                            label={loopClosed ? 'Break Circuit' : 'Connect Wire'}
                                        />
                                        <ControlToggle active={false} onToggle={() => setScreen(11)} label="Continue →" />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── Screen 11: Identity ── */}
                    {screen === 11 && (
                        <motion.div key="s11" className="text-center space-y-12">
                            <motion.div
                                animate={{ height: [4, 120, 4], opacity: [0.15, 1, 0.15] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                                className="w-[600px] bg-[#00D2FF]"
                                style={{ boxShadow: '0 0 60px #00D2FF, 0 0 120px rgba(0,210,255,0.3)' }}
                            />
                            <div className="space-y-4">
                                <h3 className="text-white text-2xl font-black uppercase italic tracking-widest">
                                    Identity Evolves
                                </h3>
                                <p className="text-white/20 font-mono text-[9px] uppercase tracking-[0.5em]">
                                    You are the return path.
                                </p>
                            </div>
                            <ControlToggle active onToggle={() => onComplete(100)} label="Transcend →" />
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            <VoltMonkeyPanel response={currentDialogue as any} characterState={currentDialogue.characterState} />
        </div>
    );
};
