import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { SignalOrb } from '../components/ui/SignalOrb';
import { VoltMonkey, MonkeyState } from '../components/Bot/VoltMonkey';
import { SpeechBubble } from '../components/Bot/SpeechBubble';
import { ChevronLeft, Zap, CheckCircle2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export const SignalPlayground = () => {
    const navigate = useNavigate();

    // Analog State
    const [analogLevel, setAnalogLevel] = useState(0);
    const [analogTarget] = useState(70);
    const isAnalogSynced = Math.abs(analogLevel - analogTarget) < 10;

    // Digital State
    const [digitalState, setDigitalState] = useState(false);

    // Sync Logic
    const isSystemSynced = isAnalogSynced && digitalState;

    // Bot State
    const [botMessage, setBotMessage] = useState("Let's calibrate the signals! Start by dragging Ms. Analog's orb.");
    const [botState, setBotState] = useState<MonkeyState>('talking');

    const controls = useAnimation();

    useEffect(() => {
        if (isSystemSynced) {
            setBotMessage("SYSTEM SYNCED! All propulsion systems are green. Protocol optimized!");
            setBotState('happy');
            controls.start({
                scale: [1, 1.05, 1],
                transition: { repeat: Infinity, duration: 2 }
            });
        } else if (isAnalogSynced) {
            setBotMessage("Analog calibrated! Now toggle Mr. Digital's phase to 1.");
            setBotState('talking');
        } else if (digitalState) {
            setBotMessage("Digital is active! Now align the Analog wave to the target marker.");
            setBotState('thinking');
        } else {
            setBotState('idle');
        }
    }, [isAnalogSynced, digitalState, controls, isSystemSynced]);

    const handleAnalogDrag = (_event: any, info: any) => {
        setAnalogLevel(prev => Math.min(100, Math.max(0, prev + (info.delta.x * 0.5))));
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans overflow-hidden relative selection:bg-indigo-500/10">
            {/* Soft Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />
            </div>

            {/* Header - Glassmorphism */}
            <header className="relative z-30 border-b border-white/5 bg-white/5 backdrop-blur-xl px-12 py-5 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => navigate('/home')}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl text-indigo-400 hover:text-indigo-300 transition-all hover:bg-white/10 active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-heading font-black text-white tracking-tight">Signal Playground</h1>
                        <p className="text-sm font-medium text-slate-400 font-sans tracking-wide uppercase tracking-[0.2em] text-[10px]">Module 1: Signals Alive</p>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <motion.div
                        animate={isSystemSynced ? { scale: [1, 1.05, 1], transition: { repeat: Infinity } } : {}}
                        className={cn(
                            "px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3 transition-colors",
                            isSystemSynced ? "border-emerald-500/30 bg-emerald-500/5" : ""
                        )}
                    >
                        <div className={cn(
                            "w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]",
                            isSystemSynced ? "bg-emerald-500" : "bg-slate-600"
                        )} />
                        <span className={cn(
                            "text-sm font-heading font-bold uppercase tracking-widest text-[10px]",
                            isSystemSynced ? "text-emerald-400" : "text-slate-500"
                        )}>
                            {isSystemSynced ? "Engine Active" : "Waiting for Sync"}
                        </span>
                    </motion.div>
                </div>
            </header>

            <main className="relative z-20 p-12 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
                <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">

                    {/* Left: Ms. Analog */}
                    <div className={cn(
                        "group relative p-10 rounded-2xl border transition-all duration-700 backdrop-blur-xl flex flex-col items-center shadow-2xl space-y-8",
                        isAnalogSynced
                            ? "bg-indigo-500/10 border-indigo-500/30 shadow-indigo-500/20"
                            : "bg-white/5 border-white/10 shadow-black/40 hover:bg-white/[0.07]"
                    )}>
                        <div className="w-full flex justify-between items-center">
                            <h2 className="text-2xl font-heading font-black text-white tracking-tight">Ms. Analog</h2>
                            {isAnalogSynced && <CheckCircle2 className="text-indigo-400 w-6 h-6" />}
                        </div>

                        <div className="w-full space-y-2">
                            <div className="flex justify-between text-[10px] font-heading font-bold text-slate-500 uppercase tracking-widest">
                                <span>Frequency Calibration</span>
                                <span className="text-indigo-400">{Math.round(analogLevel)}%</span>
                            </div>
                            <div className="h-44 w-full bg-black/40 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center">
                                {/* Wave Viz */}
                                <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
                                    <motion.path
                                        animate={{
                                            d: `M0,88 Q112.5,${88 - (analogLevel * 1.5)} 225,88 T450,88`,
                                            stroke: isAnalogSynced ? "#818cf8" : "#475569"
                                        }}
                                        fill="none"
                                        strokeWidth="6"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                </svg>

                                <motion.div
                                    drag="x"
                                    dragConstraints={{ left: -120, right: 120 }}
                                    onDrag={handleAnalogDrag}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="z-10 cursor-grab active:cursor-grabbing"
                                >
                                    <SignalOrb type="analog" className={isAnalogSynced ? "shadow-[0_0_30px_rgba(129,140,248,0.5)]" : "opacity-80"} />
                                </motion.div>

                                {/* Target Line */}
                                <div
                                    className="absolute inset-y-0 w-1 bg-white/20 blur-[1px] transition-all"
                                    style={{ left: `${analogTarget}%` }}
                                />
                            </div>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="h-4 bg-black/40 rounded-full border border-white/5 p-1">
                                <motion.div
                                    className="h-full bg-indigo-500 rounded-full"
                                    animate={{ width: `${analogLevel}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                <Info className="inline-block w-3 h-3 mr-1 -mt-0.5 opacity-50" />
                                Align the orb with the synchronization marker to calibrate the wave frequency.
                            </p>
                        </div>
                    </div>

                    {/* Center: VoltMonkey & Progress */}
                    <div className="flex flex-col items-center justify-center space-y-12 py-12">
                        <div className="flex-1 flex flex-col items-center justify-center gap-4">
                            <VoltMonkey state={botState} size="lg" />
                            <SpeechBubble
                                body={botMessage}
                                placement="bottom"
                                accent={isSystemSynced ? '#22C55E' : '#6366F1'}
                                visible
                            />
                        </div>

                        <AnimatePresence>
                            {isSystemSynced && (
                                <motion.button
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    onClick={() => navigate('/gatekeeper')}
                                    className="group h-24 px-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-heading font-black text-xl shadow-2xl shadow-indigo-500/40 transition-all flex items-center space-x-6 active:scale-95"
                                >
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                        <Zap className="w-5 h-5 fill-current" />
                                    </div>
                                    <span className="uppercase tracking-tight">Access Gatekeeper</span>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right: Mr. Digital */}
                    <div className={cn(
                        "group relative p-10 rounded-2xl border transition-all duration-700 backdrop-blur-xl flex flex-col items-center shadow-2xl space-y-8",
                        digitalState
                            ? "bg-blue-500/10 border-blue-500/30 shadow-blue-500/20"
                            : "bg-white/5 border-white/10 shadow-black/40 hover:bg-white/[0.07]"
                    )}>
                        <div className="w-full flex justify-between items-center">
                            <h2 className="text-2xl font-heading font-black text-white tracking-tight">Mr. Digital</h2>
                            {digitalState && <CheckCircle2 className="text-blue-400 w-6 h-6" />}
                        </div>

                        <div className="w-full space-y-2">
                            <div className="flex justify-between text-[10px] font-heading font-bold text-slate-500 uppercase tracking-widest">
                                <span>Logic Phase</span>
                                <span className="text-blue-400">{digitalState ? "1 (High)" : "0 (Low)"}</span>
                            </div>
                            <div className="h-44 w-full bg-black/40 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center justify-around px-8 opacity-10">
                                    <div className="h-1 w-full bg-blue-400 rounded-full" />
                                </div>

                                <motion.div
                                    onClick={() => setDigitalState(!digitalState)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="z-10 cursor-pointer"
                                >
                                    <SignalOrb type="digital" className={digitalState ? "shadow-[0_0_30px_rgba(96,165,250,0.5)]" : "opacity-40 grayscale"} />
                                </motion.div>
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-4">
                            <div className={cn(
                                "p-6 rounded-xl border transition-all text-center",
                                !digitalState ? "bg-blue-500/20 border-blue-400/50 text-blue-400" : "bg-white/5 border-white/5 text-slate-600"
                            )}>
                                <div className="text-2xl font-heading font-black">0</div>
                                <div className="text-[10px] uppercase font-bold tracking-widest opacity-50">Low</div>
                            </div>
                            <div className={cn(
                                "p-6 rounded-xl border transition-all text-center",
                                digitalState ? "bg-blue-500/20 border-blue-400/50 text-blue-400" : "bg-white/5 border-white/5 text-slate-600"
                            )}>
                                <div className="text-2xl font-heading font-black">1</div>
                                <div className="text-[10px] uppercase font-bold tracking-widest opacity-50">High</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
