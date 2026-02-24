import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircuitCanvas } from '../components/Activities/CircuitCanvas';
import { VoltMonkey, MonkeyState } from '../components/Bot/VoltMonkey';
import { SpeechBubble } from '../components/Bot/SpeechBubble';
import { ArrowRight, Zap, Lightbulb, Activity, MousePointer2, RotateCcw, CheckCircle2 } from 'lucide-react';
import { TrayDragProvider, useTrayDrag } from '../hooks/useTrayDrag';
import type { CompType } from '../components/Activities/CircuitCanvas';

interface ActivityLevel1Props {
    onComplete: () => void;
}

// ─────────────────────────────────────────────────────
//  Sidebar component card (uses Pointer Events)
// ─────────────────────────────────────────────────────
interface TrayCardProps {
    label: string;
    type: CompType;
    icon: React.ReactNode;
}

const TrayCard: React.FC<TrayCardProps> = ({ label, type, icon }) => {
    const tray = useTrayDrag();
    const isBeingDragged = tray.isDragging && tray.dragType === type;

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        // Capture the pointer so move/up events keep flowing even outside the element
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        tray.startDrag(type);
    };

    return (
        <motion.div
            onPointerDown={handlePointerDown}
            animate={{
                opacity: isBeingDragged ? 0.45 : 1,
                scale: isBeingDragged ? 0.95 : 1,
            }}
            transition={{ duration: 0.15 }}
            className={`group w-full p-4 bg-white/5 border border-white/8 rounded-xl flex items-center gap-4
                       cursor-grab active:cursor-grabbing
                       hover:bg-white/10 hover:border-[#00D2FF]/30
                       hover:shadow-[0_0_16px_rgba(0,210,255,0.12)]
                       transition-all duration-200 select-none`}
            style={{ touchAction: 'none' }}
        >
            <div className="w-10 h-10 rounded-lg bg-[#0D1426] border border-white/5
                            group-hover:border-[#00D2FF]/40 group-hover:bg-[#00D2FF]/5
                            flex items-center justify-center text-slate-400
                            group-hover:text-[#00D2FF] transition-all duration-200">
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{label}</span>
                <span className="text-[9px] text-slate-600 font-mono uppercase tracking-wider group-hover:text-[#00D2FF]/60 transition-colors">
                    {isBeingDragged ? 'dragging...' : 'drag to place'}
                </span>
            </div>
            {/* drag affordance indicator */}
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col gap-[3px]">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="flex gap-[3px]">
                            <div className="w-[3px] h-[3px] rounded-full bg-slate-500" />
                            <div className="w-[3px] h-[3px] rounded-full bg-slate-500" />
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────
//  Main Activity (inner, consumes TrayDragProvider)
// ─────────────────────────────────────────────────────
const ActivityLevel1Inner: React.FC<ActivityLevel1Props> = ({ onComplete }) => {
    const [monkeyState, setMonkeyState] = useState<MonkeyState>('idle');
    const [dialogue, setDialogue] = useState<string>("The circuit is ready. Click the switch to close it and let the current flow.");
    const [isBubbleVisible, setIsBubbleVisible] = useState(true);
    const [circuitReady, setCircuitReady] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setIsBubbleVisible(false), 8000);
        return () => clearTimeout(timer);
    }, [dialogue]);

    const triggerDialogue = (text: string, state: MonkeyState = 'talking') => {
        setDialogue(text);
        setMonkeyState(state);
        setIsBubbleVisible(true);
    };

    const handleCircuitReady = (ready: boolean) => {
        setCircuitReady(ready);
        if (ready) {
            triggerDialogue("Look at that glow! The loop is complete. Hit 'Verify Circuit' when you're ready to submit.", 'happy');
        } else {
            triggerDialogue("The switch is open. Click it to close the circuit.", 'talking');
        }
    };

    const handleVerify = () => {
        setIsComplete(true);
        setMonkeyState('happy');
    };

    const handleRetry = () => {
        setIsComplete(false);
        setCircuitReady(false);
        setMonkeyState('idle');
        setRetryKey(k => k + 1);
        triggerDialogue("Let's try again! Close the switch to complete the loop.", 'idle');
    };

    return (
        <div className="flex h-full w-full bg-[#030712] text-white overflow-hidden relative">

            {/* LEFT SIDEBAR */}
            <div className="w-72 glass-panel m-4 rounded-2xl flex flex-col p-6 z-20 shrink-0">
                <div className="mb-6">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 font-mono">Components</h2>
                    <p className="text-[10px] text-slate-600 font-mono uppercase tracking-wider mb-2">Drag onto canvas →</p>
                    <div className="h-px w-full bg-gradient-to-r from-slate-700 to-transparent" />
                </div>

                <div className="flex flex-col gap-3 flex-1">
                    <TrayCard label="Battery" type="battery" icon={<Zap size={18} />} />
                    <TrayCard label="Resistor" type="resistor" icon={<Activity size={18} />} />
                    <TrayCard label="Bulb" type="bulb" icon={<Lightbulb size={18} />} />
                    <TrayCard label="Switch" type="switch" icon={<MousePointer2 size={18} />} />
                </div>

                {/* Verify Button — only shows when circuit is active */}
                <div className="mt-auto">
                    <AnimatePresence>
                        {circuitReady && !isComplete && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                onClick={handleVerify}
                                className="w-full py-4 bg-[#00D2FF] text-[#030712] font-bold rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(0,210,255,0.4)]"
                            >
                                <CheckCircle2 size={18} /> Verify Circuit
                            </motion.button>
                        )}
                    </AnimatePresence>
                    {!circuitReady && (
                        <p className="text-[11px] text-slate-500 text-center font-mono uppercase tracking-wider">
                            Click the switch to close the loop
                        </p>
                    )}
                    <p className="text-[10px] text-slate-600 text-center mt-3 font-mono uppercase tracking-tighter opacity-40">Circuit v1.4.2</p>
                </div>
            </div>

            {/* CANVAS */}
            <div className="flex-1 relative min-w-0">
                {/* Status Indicator */}
                <div className="absolute top-6 left-6 z-10 font-mono">
                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <div className={`w-2 h-2 rounded-full transition-all duration-500 ${circuitReady
                            ? 'bg-[#00D2FF] animate-pulse shadow-[0_0_8px_#00D2FF]'
                            : 'bg-slate-600'
                            }`} />
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                            System:{' '}
                            <span className={circuitReady ? 'text-[#00D2FF]' : 'text-slate-500'}>
                                {circuitReady ? 'active' : 'switch open'}
                            </span>
                        </span>
                    </div>
                </div>

                <CircuitCanvas
                    key={retryKey}
                    onCircuitReady={handleCircuitReady}
                    onDialogueTrigger={(text, state) => triggerDialogue(text, (state as MonkeyState) ?? 'talking')}
                />
            </div>

            {/* FLOATING BOT */}
            <div className="absolute bottom-6 right-6 z-30 pointer-events-none origin-bottom-right">
                <div className="pointer-events-auto">
                    <AnimatePresence>
                        {isBubbleVisible && (
                            <div className="mb-4">
                                <SpeechBubble body={dialogue} placement="left" visible={isBubbleVisible} />
                            </div>
                        )}
                    </AnimatePresence>
                    <div className="flex justify-end">
                        <VoltMonkey state={monkeyState} size="lg" />
                    </div>
                </div>
            </div>

            {/* COMPLETION OVERLAY — only after user clicks Verify */}
            <AnimatePresence>
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-12 pointer-events-none"
                    >
                        <div className="max-w-md glass-panel p-8 rounded-3xl text-center pointer-events-auto neon-glow-blue border-[#00D2FF]/20">
                            <div className="w-16 h-16 bg-[#00D2FF]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#00D2FF]">
                                <Zap size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Continuity Verified</h3>
                            <p className="text-slate-400 text-sm mb-8">
                                You've successfully completed the first law of electrical engineering: The signal has returned to its source.
                            </p>
                            <button
                                onClick={onComplete}
                                className="w-full py-4 bg-[#00D2FF] text-[#030712] font-bold rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95 cursor-pointer"
                            >
                                PROCEED TO THEORY <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={handleRetry}
                                className="w-full py-3 mt-3 bg-white/5 border border-white/10 text-slate-300 font-semibold rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 hover:text-white transition-all cursor-pointer text-sm"
                            >
                                <RotateCcw size={16} /> Retry Lab
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────
//  Exported wrapper with TrayDragProvider
// ─────────────────────────────────────────────────────
export const ActivityLevel1: React.FC<ActivityLevel1Props> = (props) => (
    <TrayDragProvider>
        <ActivityLevel1Inner {...props} />
    </TrayDragProvider>
);
