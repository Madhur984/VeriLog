import { useState } from 'react';
import { motion } from 'framer-motion';
import { VoltBot } from '../components/ui/VoltBot';
import { Wire } from '../components/ui/Wire';
import { CyberPCB3D } from '../components/ui/CyberPCB3D';
import { ArrowLeft, Lock, Unlock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export const GatekeeperGame = () => {
    const navigate = useNavigate();
    const [guardA, setGuardA] = useState(false);
    const [guardB, setGuardB] = useState(false);
    const [gateType, setGateType] = useState<'AND' | 'OR'>('AND');
    const [showSuccess, setShowSuccess] = useState(false);

    // Logic Check
    const isOpen = gateType === 'AND' ? (guardA && guardB) : (guardA || guardB);

    const checkSuccess = () => {
        if (isOpen) {
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-foreground flex flex-col p-6 relative">
            <CyberPCB3D className="fixed inset-0" intensity={0.5} />
            <header className="flex items-center justify-between mb-8">
                <button onClick={() => navigate('/')} className="flex items-center text-muted-foreground hover:text-white transition-colors">
                    <ArrowLeft className="mr-2" /> Back to Base
                </button>
                <div className="text-xl font-heading font-bold text-primary">Module 2: The Gatekeeper</div>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto w-full">

                {/* Left: Logic Controls */}
                <div className="lg:col-span-3 bg-card rounded-3xl p-6 border border-secondary shadow-xl flex flex-col space-y-6">
                    <h2 className="text-xl font-bold font-heading text-primary">Logic Controls</h2>

                    {/* Gate Type Toggle */}
                    <div className="bg-secondary p-1 rounded-xl flex">
                        {['AND', 'OR'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setGateType(type as any)}
                                className={cn(
                                    "flex-1 py-3 rounded-lg font-mono font-bold transition-all",
                                    gateType === type ? "bg-primary text-black shadow-lg" : "text-muted-foreground hover:text-white"
                                )}
                            >
                                {type} GATE
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-secondary">
                            <div className="text-sm text-muted-foreground mb-2 font-mono">Input A (Guard 1)</div>
                            <button
                                onClick={() => setGuardA(!guardA)}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all",
                                    guardA ? "bg-signal-success text-white shadow-glow-primary" : "bg-secondary text-slate-500"
                                )}
                            >
                                <Shield className="mr-2 w-5 h-5" /> {guardA ? 'PRESENT' : 'ABSENT'}
                            </button>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-xl border border-secondary">
                            <div className="text-sm text-muted-foreground mb-2 font-mono">Input B (Guard 2)</div>
                            <button
                                onClick={() => setGuardB(!guardB)}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all",
                                    guardB ? "bg-signal-success text-white shadow-glow-primary" : "bg-secondary text-slate-500"
                                )}
                            >
                                <Shield className="mr-2 w-5 h-5" /> {guardB ? 'PRESENT' : 'ABSENT'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Center: The Castle Gate */}
                <div className="lg:col-span-6 flex flex-col items-center relative">
                    {/* Wires */}
                    <div className="absolute top-0 w-full flex justify-between px-20">
                        <div className="w-2 h-32 relative">
                            <Wire active={guardA} color="bg-signal-success" className="h-full w-2" />
                        </div>
                        <div className="w-2 h-32 relative">
                            <Wire active={guardB} color="bg-signal-success" className="h-full w-2" />
                        </div>
                    </div>

                    {/* The Gate Visual */}
                    <div className="mt-24 relative z-10">
                        <motion.div
                            animate={{
                                scale: isOpen ? 1 : 0.98,
                                filter: isOpen ? "drop-shadow(0 0 30px #3A86FF)" : "none"
                            }}
                            className="w-80 h-96 bg-secondary rounded-t-full border-4 border-slate-600 flex items-end justify-center overflow-hidden relative"
                        >
                            {/* Doors */}
                            <motion.div
                                animate={{ width: isOpen ? "0%" : "50%" }}
                                className="absolute left-0 h-full bg-slate-800 border-r-2 border-slate-900 flex items-center justify-center"
                            >
                                <div className="w-16 h-16 rounded-full border-4 border-slate-600 opacity-20" />
                            </motion.div>
                            <motion.div
                                animate={{ width: isOpen ? "0%" : "50%" }}
                                className="absolute right-0 h-full bg-slate-800 border-l-2 border-slate-900 flex items-center justify-center"
                            >
                                <div className="w-16 h-16 rounded-full border-4 border-slate-600 opacity-20" />
                            </motion.div>

                            {/* Inner Chamber (Visible when open) */}
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center -z-10">
                                <div className="text-center">
                                    <div className="text-4xl mb-2">👑</div>
                                    <div className="font-heading font-bold text-white">ACCESS GRANTED</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Gate Status Icon */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-card border-2 border-secondary rounded-full flex items-center justify-center z-20">
                            {isOpen ? <Unlock className="text-signal-success" /> : <Lock className="text-signal-error" />}
                        </div>
                    </div>

                    {/* Action */}
                    <div className="mt-12">
                        <button
                            onClick={checkSuccess}
                            disabled={!isOpen}
                            className={cn(
                                "px-12 py-4 rounded-full font-bold text-lg transition-all",
                                isOpen ? "bg-signal-gold text-black shadow-glow-primary hover:scale-105" : "bg-secondary text-slate-500 cursor-not-allowed"
                            )}
                        >
                            ACCESS AUTH CONTROL
                        </button>
                    </div>

                </div>

                {/* Right: Bot Assistant */}
                <div className="lg:col-span-3 flex flex-col justify-center">
                    <VoltBot
                        state={showSuccess ? 'happy' : 'speaking'}
                        message={
                            showSuccess
                                ? "Spectacular! You've mastered the logic!"
                                : gateType === 'AND'
                                    ? "For an AND gate, BOTH guards need to be present!"
                                    : "For an OR gate, ANY guard will do!"
                        }
                    />
                </div>

            </div>
        </div>
    );
};
