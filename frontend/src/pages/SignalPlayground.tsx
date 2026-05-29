import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignalOrb } from '../components/ui/SignalOrb';
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

    // Local Message State
    const [statusMessage, setStatusMessage] = useState("System calibration required. Adjust analog frequency to match target.");

    useEffect(() => {
        if (isSystemSynced) {
            setStatusMessage("SYSTEM SYNCED! All propulsion systems are green. Protocol optimized!");
        } else if (isAnalogSynced) {
            setStatusMessage("Analog calibrated! Now toggle digital phase to 1.");
        } else if (digitalState) {
            setStatusMessage("Digital is active! Now align the Analog wave to the target marker.");
        } else {
            setStatusMessage("System calibration required. Adjust analog frequency to match target.");
        }
    }, [isAnalogSynced, digitalState, isSystemSynced]);

    const handleAnalogDrag = (_event: any, info: any) => {
        setAnalogLevel(prev => Math.min(100, Math.max(0, prev + (info.delta.x * 0.5))));
    };

    return (
        <div className="min-h-[100svh] bg-white text-slate-900 font-sans overflow-x-hidden overflow-y-auto relative selection:bg-sky-500/10">
            {/* Soft Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-sky-500/5 blur-[80px] lg:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-indigo-500/5 blur-[80px] lg:blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />
            </div>

            {/* Header - Glassmorphism */}
            <header className="relative z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 py-3 lg:px-12 lg:py-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 lg:space-x-6 min-w-0">
                    <button
                        onClick={() => navigate('/portal')}
                        className="p-2.5 lg:p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 hover:text-sky-600 transition-all hover:bg-white active:scale-95 shadow-sm flex-shrink-0"
                    >
                        <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-xl lg:text-3xl font-heading font-black text-slate-900 tracking-tight truncate">Signal Playground</h1>
                        <p className="text-slate-400 font-sans uppercase tracking-[0.2em] text-[9px] lg:text-[10px]">Module 1: Signals Alive</p>
                    </div>
                </div>
                <div className="flex items-center flex-shrink-0">
                    <motion.div
                        animate={isSystemSynced ? { scale: [1, 1.05, 1], transition: { repeat: Infinity } } : {}}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 lg:px-6 lg:py-2.5 rounded-2xl border transition-colors",
                            isSystemSynced ? "border-emerald-500/30 bg-emerald-50 shadow-sm" : "bg-slate-50 border-slate-200"
                        )}
                    >
                        <div className={cn(
                            "w-2 h-2 rounded-full flex-shrink-0",
                            isSystemSynced ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300"
                        )} />
                        <span className={cn(
                            "font-heading font-bold uppercase tracking-widest text-[9px] lg:text-[10px] whitespace-nowrap",
                            isSystemSynced ? "text-emerald-600" : "text-slate-500"
                        )}>
                            {isSystemSynced ? "Engine Active" : "Waiting"}
                        </span>
                    </motion.div>
                </div>
            </header>

            <main className="relative z-20 p-4 lg:p-12 flex flex-col items-center justify-center min-h-[calc(100svh-64px)] lg:min-h-[calc(100vh-100px)]">
                <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 items-stretch">

                    {/* Left: Ms. Analog */}
                    <div className={cn(
                        "group relative p-6 lg:p-10 rounded-2xl border transition-all duration-700 backdrop-blur-xl flex flex-col items-center shadow-xl space-y-6 lg:space-y-8",
                        isAnalogSynced
                            ? "bg-sky-50 border-sky-200 shadow-sky-500/10"
                            : "bg-white border-slate-200 shadow-slate-200/50 hover:border-sky-200"
                    )}>
                        <div className="w-full flex justify-between items-center">
                            <h2 className="text-xl lg:text-2xl font-heading font-black text-slate-900 tracking-tight">Analog Control</h2>
                            {isAnalogSynced && <CheckCircle2 className="text-sky-500 w-5 h-5 lg:w-6 lg:h-6" />}
                        </div>

                        <div className="w-full space-y-2">
                            <div className="flex justify-between text-[10px] font-heading font-bold text-slate-400 uppercase tracking-widest">
                                <span>Frequency Calibration</span>
                                <span className="text-sky-600">{Math.round(analogLevel)}%</span>
                            </div>
                            <div className="h-36 lg:h-44 w-full bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden flex items-center justify-center shadow-inner">
                                {/* Wave Viz */}
                                <svg className="absolute inset-0 w-full h-full opacity-50" preserveAspectRatio="none">
                                    <motion.path
                                        animate={{
                                            d: `M0,88 Q112.5,${88 - (analogLevel * 1.5)} 225,88 T450,88`,
                                            stroke: isAnalogSynced ? "#0284c7" : "#cbd5e1"
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
                                    <SignalOrb type="analog" className={isAnalogSynced ? "drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]" : "opacity-90"} />
                                </motion.div>

                                {/* Target Line */}
                                <div
                                    className="absolute inset-y-0 w-1 bg-white/20 blur-[1px] transition-all"
                                    style={{ left: `${analogTarget}%` }}
                                />
                            </div>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="h-4 bg-slate-100 rounded-full border border-slate-200 p-1">
                                <motion.div
                                    className="h-full bg-sky-500 rounded-full"
                                    animate={{ width: `${analogLevel}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                <Info className="inline-block w-3 h-3 mr-1 -mt-0.5 opacity-50" />
                                Align the orb with the synchronization marker to calibrate the wave frequency.
                            </p>
                        </div>
                    </div>

                    {/* Center: Message & Progress */}
                    <div className="flex flex-col items-center justify-center gap-6 lg:space-y-12 lg:py-12">
                        <div className="flex-1 flex items-center justify-center w-full">
                           <div className="w-full p-6 lg:p-8 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm text-center space-y-4">
                               <div className="inline-flex p-3 bg-sky-100 rounded-full text-sky-600 mb-2">
                                   <Zap className="w-6 h-6 fill-current" />
                               </div>
                               <h3 className="text-lg lg:text-xl font-heading font-black text-slate-900 tracking-tight">System Status</h3>
                               <p className="text-slate-600 font-medium leading-relaxed text-sm">
                                   {statusMessage}
                               </p>
                           </div>
                        </div>

                        <AnimatePresence>
                            {isSystemSynced && (
                                <motion.button
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    onClick={() => navigate('/gatekeeper')}
                                    className="group h-16 lg:h-20 px-8 lg:px-12 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl font-heading font-black text-base lg:text-lg shadow-xl shadow-sky-500/30 transition-all flex items-center space-x-4 lg:space-x-6 active:scale-95 w-full justify-center"
                                >
                                    <div className="w-9 h-9 lg:w-10 lg:h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors flex-shrink-0">
                                        <Zap className="w-5 h-5 fill-current" />
                                    </div>
                                    <span className="uppercase tracking-tight">Access Gatekeeper</span>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right: Mr. Digital */}
                    <div className={cn(
                        "group relative p-6 lg:p-10 rounded-2xl border transition-all duration-700 backdrop-blur-xl flex flex-col items-center shadow-xl space-y-6 lg:space-y-8",
                        digitalState
                            ? "bg-indigo-50 border-indigo-200 shadow-indigo-500/10"
                            : "bg-white border-slate-200 shadow-slate-200/50 hover:border-indigo-200"
                    )}>
                        <div className="w-full flex justify-between items-center">
                            <h2 className="text-xl lg:text-2xl font-heading font-black text-slate-900 tracking-tight">Digital Phase</h2>
                            {digitalState && <CheckCircle2 className="text-indigo-500 w-5 h-5 lg:w-6 lg:h-6" />}
                        </div>

                        <div className="w-full space-y-2">
                            <div className="flex justify-between text-[10px] font-heading font-bold text-slate-400 uppercase tracking-widest">
                                <span>Logic Phase</span>
                                <span className="text-indigo-600">{digitalState ? "1 (High)" : "0 (Low)"}</span>
                            </div>
                            <div className="h-36 lg:h-44 w-full bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden flex items-center justify-center shadow-inner">
                                <div className="absolute inset-0 flex items-center justify-around px-8 opacity-10">
                                    <div className="h-1 w-full bg-indigo-400 rounded-full" />
                                </div>

                                <motion.div
                                    onClick={() => setDigitalState(!digitalState)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="z-10 cursor-pointer"
                                >
                                    <SignalOrb type="digital" className={digitalState ? "drop-shadow-[0_0_20px_rgba(129,140,248,0.5)]" : "opacity-40 grayscale"} />
                                </motion.div>
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-4">
                            <div className={cn(
                                "p-6 rounded-xl border transition-all text-center flex flex-col items-center justify-center",
                                !digitalState ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-slate-50 border-slate-100 text-slate-400"
                            )}>
                                <div className="text-2xl font-heading font-black">0</div>
                                <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">Low</div>
                            </div>
                            <div className={cn(
                                "p-6 rounded-xl border transition-all text-center flex flex-col items-center justify-center",
                                digitalState ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-slate-50 border-slate-100 text-slate-400"
                            )}>
                                <div className="text-2xl font-heading font-black">1</div>
                                <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">High</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
