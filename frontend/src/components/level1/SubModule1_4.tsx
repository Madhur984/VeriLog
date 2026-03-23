import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SignalRenderer } from '../../circuit-lab/SignalRenderer';
import { ToggleRight, ToggleLeft } from 'lucide-react';

interface SubModuleProps {
    onComplete: (sip: number) => void;
}

export const SubModule1_4: React.FC<SubModuleProps> = ({ onComplete }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-[#0B0F14]">
            <div className="text-center mb-16 max-w-2xl">
                <span className="text-[10px] font-mono text-[#00D2FF] tracking-[.3em] uppercase">Control Systems</span>
                <h2 className="text-3xl font-bold text-white mt-2">Open vs Closed: The Switch</h2>
                <p className="text-slate-500 mt-4 text-sm font-sans">
                    A switch is a mechanical bridge. In an "Open" state, there is no physical path. In a "Closed" state, metal touches metal.
                </p>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="bg-[#141B2D] border border-[#1E2332] rounded-3xl p-12 flex flex-col items-center gap-12 relative overflow-hidden">
                    <motion.div 
                        className="w-24 h-24 rounded-full border-2 flex items-center justify-center cursor-pointer relative z-10"
                        animate={{ 
                            backgroundColor: !isOpen ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                            borderColor: !isOpen ? '#00D2FF' : '#1E2332',
                            rotate: isOpen ? 45 : 0
                        }}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                         {isOpen ? <ToggleLeft size={48} color="#64748B" /> : <ToggleRight size={48} color="#00D2FF" />}
                    </motion.div>
                    
                    <div className="text-center relative z-10">
                        <span className={`font-mono text-xl font-bold tracking-widest ${isOpen ? 'text-slate-600' : 'text-[#00D2FF]'}`}>
                            {isOpen ? 'OPEN CIRCUIT' : 'CLOSED CIRCUIT'}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">Current Flow: {isOpen ? '0.00A' : '0.45A'}</p>
                    </div>

                    {/* Animated Path Preview */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                        <SignalRenderer 
                            path="M 0,240 L 400,240"
                            isActive={true}
                            state={isOpen ? 'dissipate' : 'smooth'}
                            color="#00D2FF"
                        />
                    </svg>
                </div>

                <div className="space-y-8">
                    <div className="p-8 border border-[#1E2332] bg-[#0A0E1A] rounded-2xl">
                        <h4 className="font-mono text-[10px] text-[#00D2FF] uppercase tracking-widest mb-4">Engineering Concept</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            A switch essentially controls the existence of the return path. 
                            <br/><br/>
                            <strong className="text-white">Keyboard:</strong> Every key is a tiny switch.
                            <br/>
                            <strong className="text-white">Relay:</strong> An electromagnetic switch.
                        </p>
                    </div>

                    {!isOpen && (
                        <motion.button 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => onComplete(10)}
                            className="w-full py-4 bg-[#00D2FF] text-[#0B0F14] font-bold rounded-full uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform"
                        >
                            Complete Sub-module 1.4
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
};
