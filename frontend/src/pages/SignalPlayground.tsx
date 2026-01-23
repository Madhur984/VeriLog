import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { SignalOrb } from '../components/ui/SignalOrb';
import { VoltBot } from '../components/ui/VoltBot';
import { Wire } from '../components/ui/Wire';
import { CyberPCB3D } from '../components/ui/CyberPCB3D';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export const SignalPlayground = () => {
    const navigate = useNavigate();

    // Analog State
    const [analogLevel, setAnalogLevel] = useState(0); // 0 to 100
    const [analogTarget] = useState(70); // The "sweet spot"
    const isAnalogSynced = Math.abs(analogLevel - analogTarget) < 10;

    // Digital State
    const [digitalState, setDigitalState] = useState(false);

    // Bot State
    const [botMessage, setBotMessage] = useState("Let's calibrate the signals! Start with Ms. Analog.");

    const controls = useAnimation();

    useEffect(() => {
        if (isAnalogSynced && digitalState) {
            setBotMessage("SYSTEM SYNCED! All Green!");
            controls.start({
                scale: [1, 1.1, 1],
                transition: { repeat: Infinity, duration: 2 }
            });
        } else if (isAnalogSynced) {
            setBotMessage("Analog calibrated! Now toggle Mr. Digital.");
        } else if (digitalState) {
            setBotMessage("Digital is ON! Now fix the Analog wave.");
        }
    }, [isAnalogSynced, digitalState, controls]);

    const handleAnalogDrag = (_event: any, info: any) => {
        // width and percent removed - simplified logic used below
        // This is a simplified "drag simulation" logic for the MVP
        // In reality we'd measure container bounds. 
        // For now, let's just use a slider input for precision if drag is tricky, or simulate "drag increases level"

        // Simpler: Just map drag x delta to state
        setAnalogLevel(prev => Math.min(100, Math.max(0, prev + (info.delta.x * 0.5))));
    };

    return (
        <div className="min-h-screen bg-transparent text-foreground flex flex-col p-6 relative overflow-hidden">
            <CyberPCB3D className="fixed inset-0" intensity={0.5} />

            {/* Header */}
            <header className="flex items-center justify-between mb-8 z-10">
                <button onClick={() => navigate('/')} className="flex items-center text-muted-foreground hover:text-white transition-colors bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
                    <ArrowLeft className="mr-2" /> Back to Base
                </button>
                <div className="text-xl font-heading font-bold text-primary bg-black/40 px-6 py-2 rounded-full backdrop-blur-md">
                    Module 1: Signals Alive
                </div>
            </header>

            {/* Main Stage */}
            <div className="flex-1 flex flex-col md:flex-row gap-8 max-w-6xl mx-auto w-full z-10">

                {/* Left: Analog Control (Gamified) */}
                <div className={cn(
                    "flex-1 flex flex-col items-center space-y-6 p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all duration-500",
                    isAnalogSynced ? "bg-signal-analog/20 border-signal-analog shadow-glow-analog" : "bg-card/80 border-secondary backdrop-blur-xl"
                )}>
                    <h2 className="text-2xl font-bold text-signal-analog">Ms. Analog</h2>
                    <p className="text-center text-muted-foreground text-sm">Target Frequency: {analogTarget}%</p>

                    <div className="relative h-40 w-full flex items-center justify-center bg-black/20 rounded-xl overflow-hidden">
                        {/* Wave Visualization */}
                        <svg className="absolute inset-0 w-full h-full opacity-50" preserveAspectRatio="none">
                            <path
                                d={`M0,50 Q25,${50 - analogLevel} 50,50 T100,50`}
                                fill="none"
                                stroke={isAnalogSynced ? "#9D4EDD" : "#334155"}
                                strokeWidth="4"
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>

                        <Wire active={isAnalogSynced} color="bg-signal-analog" className="w-full absolute top-1/2 -translate-y-1/2" />

                        <motion.div
                            drag="x"
                            dragConstraints={{ left: -100, right: 100 }}
                            onDrag={handleAnalogDrag}
                            className="z-10 cursor-grab active:cursor-grabbing"
                            whileHover={{ scale: 1.1 }}
                        >
                            <SignalOrb type="analog" className={isAnalogSynced ? "shadow-glow-analog" : ""} />
                        </motion.div>
                    </div>

                    <div className="w-full bg-secondary h-4 rounded-full overflow-hidden relative">
                        <div
                            className="h-full bg-signal-analog transition-all duration-100 ease-out"
                            style={{ width: `${analogLevel}%` }}
                        />
                        {/* Target Marker */}
                        <div className="absolute top-0 h-full w-2 bg-white/50" style={{ left: `${analogTarget}%` }} />
                    </div>
                    <p className="font-mono text-xs">CURRENT: {Math.round(analogLevel)}%</p>
                </div>

                {/* Center: Bot */}
                <div className="flex flex-col items-center justify-center space-y-4">
                    <VoltBot
                        state={isAnalogSynced && digitalState ? "celebrating" : "speaking"}
                        message={botMessage}
                    />

                    {(isAnalogSynced && digitalState) && (
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            onClick={() => navigate('/gatekeeper')}
                            className="mt-4 px-8 py-3 bg-gradient-to-r from-signal-success to-emerald-600 text-white font-bold rounded-full shadow-glow-primary flex items-center hover:scale-105 transition-transform"
                        >
                            Next Module <ArrowRight className="ml-2 w-4 h-4" />
                        </motion.button>
                    )}
                </div>

                {/* Right: Digital Control */}
                <div className={cn(
                    "flex-1 flex flex-col items-center space-y-6 p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all duration-500",
                    digitalState ? "bg-signal-digital/20 border-signal-digital shadow-glow-digital" : "bg-card/80 border-secondary backdrop-blur-xl"
                )}>
                    <h2 className="text-2xl font-bold text-signal-digital">Mr. Digital</h2>
                    <p className="text-center text-muted-foreground text-sm">Status: {digitalState ? "ONLINE" : "OFFLINE"}</p>

                    <div className="relative h-40 w-full flex items-center justify-center bg-black/20 rounded-xl">
                        <Wire active={digitalState} color="bg-signal-digital" className="w-full absolute" />

                        <motion.div
                            onClick={() => setDigitalState(!digitalState)}
                            whileTap={{ scale: 0.9 }}
                            className="cursor-pointer z-10"
                        >
                            <SignalOrb type="digital" className={digitalState ? "opacity-100" : "opacity-40 grayscale"} />
                        </motion.div>
                    </div>

                    <div className="flex space-x-2">
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center font-bold border-2", !digitalState ? "border-signal-error bg-signal-error/20 text-signal-error" : "border-transparent opacity-30")}>0</div>
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center font-bold border-2", digitalState ? "border-signal-digital bg-signal-digital/20 text-signal-digital" : "border-transparent opacity-30")}>1</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

