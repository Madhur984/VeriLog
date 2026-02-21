import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../stores/userStore';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { LogicStormBackground } from './LogicStormBackground';

export const GreetingSequence: React.FC = () => {
    const navigate = useNavigate();
    const { firstName, setHasSeenGreeting } = useUserStore();
    const [step, setStep] = useState(0);

    const steps = [
        {
            text: `Hello, ${firstName || 'Explorer'}`,
            subtext: "System initialization complete. Access granted.",
            icon: <Sparkles className="w-12 h-12 text-primary" />
        },
        {
            text: "Want to dive deeper into the world of electronics?",
            subtext: "The pulse of logic awaits your command.",
            icon: <Zap className="w-12 h-12 text-yellow-500" />
        },
        {
            text: "Let's see how much you are familiar with this world",
            subtext: "Initializing aptitude assessment protocol...",
            icon: <ArrowRight className="w-12 h-12 text-signal-success" />
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(s => s + 1);
        } else {
            setHasSeenGreeting(true);
            navigate('/assessment');
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleNext}
        >
            <LogicStormBackground />

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative z-10 text-center space-y-6 px-4"
                >
                    <div className="flex justify-center mb-8">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 4 }}
                        >
                            {steps[step].icon}
                        </motion.div>
                    </div>

                    <h1 className="font-heading font-bold text-4xl md:text-6xl text-white tracking-tighter drop-shadow-glow">
                        {steps[step].text}
                    </h1>

                    <p className="font-mono text-slate-400 text-lg max-w-lg mx-auto">
                        {steps[step].subtext}
                    </p>

                    <div className="pt-12">
                        <span className="text-primary/60 font-mono text-xs animate-pulse">
                            [ CLICK ANYWHERE TO CONTINUE ]
                        </span>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Progress Bars */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center space-x-2">
                {steps.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 w-12 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary' : 'bg-slate-800'}`}
                    />
                ))}
            </div>
        </motion.div>
    );
};
