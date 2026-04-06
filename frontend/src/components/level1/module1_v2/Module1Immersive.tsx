/**
 * Module1Immersive.tsx
 * 
 * Orchestrator for Module 1: The Signal Must Return.
 * Seamless transformation from cinematic experience to interactive system.
 * Zero-cut Continuity. Morphing Transitions. Final Signature Moment.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CinematicTunnel } from './shared/CinematicTunnel';
import { Module1Container } from './Module1Container';

// Scenes
import { Scene1_Noise } from './scenes/Scene1_Noise';
import { Scene2_Anatomy } from './scenes/Scene2_Anatomy';
import { Scene3_Types } from './scenes/Scene3_Types';
import { Scene4_ControlLab } from './scenes/Scene4_ControlLab';
import { Scene5_Interaction } from './scenes/Scene5_Interaction';
import { Scene6_ApplyLab } from './scenes/Scene6_ApplyLab';

export const Module1Immersive: React.FC = () => {
    const [step, setStep] = useState<'cinematic' | 'noise' | 'anatomy' | 'types' | 'control' | 'interaction' | 'apply' | 'exit'>('cinematic');
    const [isExiting, setIsExiting] = useState(false);

    // Final Signature Moment: Point Collapse
    const handleExit = () => {
        setIsExiting(true);
        setTimeout(() => {
            setStep('exit');
            // Navigate to Module 2 or Next Level
        }, 1500);
    };

    const goToNoise = React.useCallback(() => setStep('noise'), []);

    return (
        <div className="w-full h-full bg-[#050505] overflow-hidden select-none">
            
            <AnimatePresence mode="wait">
                {step === 'cinematic' && (
                    <motion.div 
                        key="cinematic"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                    >
                        <CinematicTunnel onComplete={goToNoise} />
                    </motion.div>
                )}
            </AnimatePresence>

            {step !== 'cinematic' && step !== 'exit' && (
                <Module1Container>
                    {({ engine, audio, points, params }) => (
                        <div className="w-full h-full relative">
                            <AnimatePresence mode="popLayout">
                                {step === 'noise' && (
                                    <motion.div key="noise" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                                        <Scene1_Noise engine={engine} audio={audio} points={points} params={params} onComplete={() => setStep('anatomy')} />
                                    </motion.div>
                                )}
                                {step === 'anatomy' && (
                                    <motion.div key="anatomy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                                        <Scene2_Anatomy engine={engine} audio={audio} points={points} params={params} onComplete={() => setStep('types')} />
                                    </motion.div>
                                )}
                                {step === 'types' && (
                                    <motion.div key="types" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                                        <Scene3_Types engine={engine} audio={audio} points={points} params={params} onComplete={() => setStep('control')} />
                                    </motion.div>
                                )}
                                {step === 'control' && (
                                    <motion.div key="control" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                                        <Scene4_ControlLab engine={engine} audio={audio} points={points} params={params} onComplete={() => setStep('interaction')} />
                                    </motion.div>
                                )}
                                {step === 'interaction' && (
                                    <motion.div key="interaction" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                                        <Scene5_Interaction engine={engine} audio={audio} points={points} params={params} onComplete={() => setStep('apply')} />
                                    </motion.div>
                                )}
                                {step === 'apply' && (
                                    <motion.div key="apply" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                                        <Scene6_ApplyLab engine={engine} audio={audio} points={points} params={params} onComplete={handleExit} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Final Signature: Point Collapse Overlay */}
                            <AnimatePresence>
                                {isExiting && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="fixed inset-0 z-[1000] bg-[#050505] flex items-center justify-center pointer-events-none"
                                    >
                                        <motion.div 
                                            initial={{ scaleX: 1, scaleY: 1, opacity: 1 }}
                                            animate={{ scaleX: 0, scaleY: 0, opacity: 0 }}
                                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                            onAnimationStart={() => audio.playCollapse()}
                                            className="w-full h-1 bg-[#00FF41] shadow-[0_0_50px_#00FF41]"
                                        />
                                        <motion.div 
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: [0, 4, 0], opacity: [0, 1, 0] }}
                                            transition={{ delay: 1.1, duration: 0.4 }}
                                            className="fixed inset-0 bg-[#00FF41]/20 backdrop-blur-3xl"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </Module1Container>
            )}

            {step === 'exit' && (
                <div className="w-full h-full bg-[#050505] flex items-center justify-center">
                    <span className="text-[10px] font-mono text-[#00FF41] tracking-[2em] uppercase animate-pulse">
                        TRANSITIONING_TO_MODULE_02...
                    </span>
                </div>
            )}
        </div>
    );
};
