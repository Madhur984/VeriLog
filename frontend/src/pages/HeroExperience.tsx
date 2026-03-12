import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SignalOrb } from '../components/ui/SignalOrb';
import { VoltBot } from '../components/ui/VoltBot';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { useGamificationStore } from '../stores/gamificationStore';
import { GreetingSequence } from '../components/ui/GreetingSequence';
import { AnimatePresence } from 'framer-motion';

export const HeroExperience = () => {
    const navigate = useNavigate();
    const { hasSeenGreeting, firstName } = useGamificationStore();
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

                {/* Header / Navigation */}
                <header className="absolute top-0 left-0 right-0 z-50 p-8 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center space-x-2"
                    >
                        <LayoutDashboard className="w-8 h-8 text-primary shadow-glow-primary rounded-lg" />
                        <span className="font-heading font-black text-2xl tracking-tighter uppercase">VeriLog <span className="text-primary/50 text-sm ml-2 font-mono tracking-widest">v2.0</span></span>
                    </motion.div>

                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="hidden md:flex items-center space-x-8"
                    >
                        <button onClick={() => navigate('/learn')} className="font-mono text-sm text-slate-400 hover:text-white transition-colors">LEARN</button>
                        <button onClick={() => navigate('/assessment')} className="font-mono text-sm text-slate-400 hover:text-white transition-colors">ASSESSMENT</button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl font-mono text-sm text-white hover:bg-white/10 transition-all"
                        >
                            SYSTEM_ACCESS
                        </button>
                    </motion.nav>
                </header>

                {/* Main Interaction Area */}
                <div className="space-y-12 flex flex-col items-center">

                    {/* Bot Greeting */}
                    <VoltBot
                        state={orbInteracted ? 'happy' : 'speaking'}
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
                            onClick={() => navigate('/playground')}
                            className="group relative px-8 py-4 bg-primary text-background font-bold rounded-xl overflow-hidden shadow-glow-primary hover:scale-105 transition-transform"
                        >
                            <span className="relative z-10 flex items-center">
                                Start Adventure <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </motion.div>
                </div>
            </div>


            {/* Interactive Greeting Overlay */}
            <AnimatePresence>
                {firstName && !hasSeenGreeting && <GreetingSequence />}
            </AnimatePresence>
        </div>
    );
};
