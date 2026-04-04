import { HeroScrollEntry } from '../components/scrollytelling/HeroScrollEntry';
import { ScrollIndicator } from '../components/scrollytelling/ScrollIndicator';
import { FrameSequence } from '../components/scrollytelling/FrameSequence';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const ModuleOneEntry = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    
    // Add physics spring to slow down and smoothen the animation progression per mouse wheel click
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 50,
        damping: 30,
        mass: 1.5,
        restDelta: 0.001
    });
    
    // Animation control: resolve the 234-frame sequence over 90% of the massive 800vh scroll
    const animationProgress = useTransform(smoothProgress, [0, 0.9], [0, 1]);
    
    // Smooth reveal for the final action button when the signal is fully linked
    const proceedOpacity = useTransform(smoothProgress, [0.95, 1], [0, 1]);
    const proceedY = useTransform(smoothProgress, [0.95, 1], [40, 0]);

    return (
        <div className="relative w-full min-h-[800vh] bg-[#050505] overflow-x-hidden selection:bg-white/20">
            {/* CINEMATIC FRAME SEQUENCE LAYER (Pure Void) */}
            <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
                <FrameSequence progress={animationProgress} />
                
                {/* Subtle dimming as the user arrives at the signal climax */}
                <motion.div 
                    style={{ opacity: useTransform(smoothProgress, [0.9, 1], [0, 0.4]) }}
                    className="absolute inset-0 bg-[#050505] -z-10" 
                />
            </div>

            {/* HERO MODULE (Shot 1: The Descent) */}
            <div className="sticky top-0 h-screen w-full z-10 pointer-events-none">
                <HeroScrollEntry 
                    title="INTELLIGENCE"
                    subtitle="Redefined at every layer."
                />
                <ScrollIndicator />
            </div>

            {/* RESOLUTION MODULE (Shot 2: The Signal) */}
            <div className="relative h-screen w-full flex items-center justify-center z-20 mt-[700vh]">
                <motion.div 
                    style={{ opacity: proceedOpacity, y: proceedY }}
                    className="flex flex-col items-center gap-8 text-center px-6"
                >
                    <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/40 mb-4" />
                    
                    <h2 className="text-xl font-mono text-white/50 tracking-[0.5em] uppercase mb-8">
                        Signal Linked
                    </h2>

                    <button
                        onClick={() => navigate('/module/1/1')}
                        className="group relative px-12 py-5 rounded-full bg-white text-black font-black text-sm tracking-[0.2em] transition-all hover:scale-105 active:scale-95 flex items-center gap-4 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] pointer-events-auto"
                    >
                        BEGIN EXPERIENCE
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                    
                    <p className="mt-8 text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">
                        Module 01 // Energetic Continuity
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
