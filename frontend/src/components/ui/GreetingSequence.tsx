import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../stores/userStore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LogicStormBackground } from './LogicStormBackground';
import { VoltMonkey, MonkeyState } from '../Bot/VoltMonkey';
import { getRouteDialogue } from '../Bot/botDialogues';

export const GreetingSequence: React.FC = () => {
    const navigate = useNavigate();
    const { firstName, setHasSeenGreeting } = useUserStore();
    const [step, setStep] = useState(0);

    const steps = [
        {
            text: `Hello ${firstName || 'Explorer'}!`,
            subtext: getRouteDialogue('/hero', 'beginner'),
            monkeyState: 'happy' as MonkeyState
        },
        {
            text: "Ready to dive deeper?",
            subtext: "The pulse of logic awaits your command.",
            monkeyState: 'talking' as MonkeyState
        },
        {
            text: "Let's test your baseline",
            subtext: getRouteDialogue('/assessment', 'beginner'),
            monkeyState: 'thinking' as MonkeyState
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
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl"
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
                    className="relative z-10 text-center space-y-8 px-4 w-full flex flex-col items-center"
                >
                    <div className="flex justify-center mb-4 relative h-32 w-32 md:h-48 md:w-48">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
                        <VoltMonkey state={steps[step].monkeyState} size="lg" />
                    </div>

                    <h1 className="font-heading font-black text-4xl md:text-6xl text-white tracking-tighter drop-shadow-glow">
                        {steps[step].text}
                    </h1>

                    <p className="font-mono text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
                        {steps[step].subtext}
                    </p>

                    <div className="pt-12">
                        {step === steps.length - 1 ? (
                            <button
                                className="group relative px-8 py-4 bg-primary text-background font-heading font-black text-xl rounded-xl overflow-hidden shadow-glow-primary hover:scale-105 transition-all"
                            >
                                <span className="relative z-10 flex items-center">
                                    START ASSESSMENT <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                        ) : (
                            <span className="text-primary/60 font-mono text-sm animate-pulse tracking-widest uppercase cursor-pointer">
                                [ CLICK TO CONTINUE ]
                            </span>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Progress Bars */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center space-x-3">
                {steps.map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 w-12 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'bg-slate-800'
                            }`}
                    />
                ))}
            </div>
        </motion.div>
    );
};
