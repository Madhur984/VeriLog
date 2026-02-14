import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SignalOrb } from '../components/ui/SignalOrb';
import { VoltBot } from '../components/ui/VoltBot';
import { LayoutDashboard, ArrowRight } from 'lucide-react';

export const HeroExperience = () => {
    const navigate = useNavigate();
    const [orbInteracted, setOrbInteracted] = useState(false);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-background font-sans text-foreground">
            {/* Background Video */}
            <div className="absolute inset-0 z-0 opacity-40">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover grayscale brightness-50 contrast-125"
                >
                    <source src="/videos/Circuit_Repair_Cartoon_Animation.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">

                {/* Header / Logo Area */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-8 left-8 flex items-center space-x-2"
                >
                    <LayoutDashboard className="w-8 h-8 text-primary" />
                    <span className="font-heading font-bold text-2xl tracking-tighter">VeriQuest</span>
                </motion.div>

                {/* Main Interaction Area */}
                <div className="space-y-12 flex flex-col items-center">

                    {/* Bot Greeting */}
                    <VoltBot
                        state={orbInteracted ? 'celebrating' : 'speaking'}
                        message={orbInteracted ? "Spectacular! You found the pulse!" : "See that glowing orb? Give it a drag!"}
                        className="mb-8"
                    />

                    {/* The Artifact */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5, delay: 1 }}
                    >
                        <SignalOrb
                            onPulse={() => setOrbInteracted(true)}
                            onDragEnd={() => setOrbInteracted(true)}
                        />
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="space-y-4"
                    >
                        <h1 className="font-heading font-extrabold text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-primary drop-shadow-sm">
                            Signal Playground
                        </h1>
                        <p className="font-mono text-slate-400 max-w-md mx-auto">
                            Master the invisible forces of Digital Logic.
                            <br />
                            No login required.
                        </p>

                        <button
                            onClick={() => navigate('/learn')}
                            className="group relative px-8 py-4 bg-primary text-background font-bold rounded-full overflow-hidden shadow-glow-primary hover:scale-105 transition-transform"
                        >
                            <span className="relative z-10 flex items-center">
                                Start Adventure <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="absolute bottom-8 w-full flex justify-center space-x-12 text-xs font-mono text-slate-500 uppercase tracking-widest">
                <div>System Status: <span className="text-signal-success">ONLINE</span></div>
                <div>Cadets Active: <span className="text-primary">8,402</span></div>
            </div>
        </div>
    );
};
