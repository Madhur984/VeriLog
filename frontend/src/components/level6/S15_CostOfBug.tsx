import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { AlertOctagon, TrendingDown, DollarSign, XCircle, Rocket, ArrowRight, ShieldAlert, Activity, Share2, Binary } from "lucide-react";

export const S15_CostOfBug: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [stage, setStage] = useState<'normal' | 'error' | 'failure'>('normal');

  const stageData = {
    normal: {
        label: 'Logic Design // RTL',
        title: 'Source Code',
        desc: 'Writing and verifying architecture in the digital simulation domain.',
        sub: 'Capital Loss: $0',
        impact: 'Nominal',
        color: 'text-plasma-cyan',
        bg: 'bg-plasma-cyan/10',
        border: 'border-plasma-cyan/30',
        glow: 'shadow-cyan-glow',
        icon: Rocket
    },
    error: {
        label: 'Silicon Fab // Mask Set',
        title: 'Tape-Out Error',
        desc: 'Fabricating physical masks for thousands of silicon wafers.',
        sub: 'Capital Loss: -$5.2M',
        impact: 'Critical',
        color: 'text-burnished-copper',
        bg: 'bg-burnished-copper/10',
        border: 'border-burnished-copper/30',
        glow: 'shadow-burnished-glow',
        icon: AlertOctagon
    },
    failure: {
        label: 'Market Deploy // Recall',
        title: 'Fatal Failure',
        desc: 'Systemic failure discovered after devices are integrated into the field.',
        sub: 'Capital Loss: -$480M',
        impact: 'Catastrophic',
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        glow: 'shadow-[0_0_50px_rgba(239,68,68,0.3)]',
        icon: XCircle
    }
  };

  const current = stageData[stage];

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-burnished-copper font-black opacity-60 flex items-center gap-2">
                <ShieldAlert size={14} /> Fiscal Risk Assessment
             </div>
             <HeroText className="text-left leading-none" color="text-white">The Cost<br/><span className={stage === 'normal' ? 'text-white' : 'text-burnished-copper'}>of a Bug.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light text-left">
                In hardware, <span className="text-burnished-copper font-bold italic underline underline-offset-8 decoration-burnished-copper/30">logic is physical.</span> A single error at tape-out becomes a multi-crore capital failure.
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed text-left">
               Unlike software, hardware cannot be "patched" once the silicon is struck. The cost of an error increases exponentially as it moves through the implementation pipeline. Verification is your only insurance.
            </p>

            <div className="flex flex-col gap-4 pt-4">
                {(['normal', 'error', 'failure'] as const).map((sId) => {
                    const s = stageData[sId];
                    const isActiveStage = stage === sId;
                    return (
                        <button 
                            key={sId}
                            onClick={() => setStage(sId)}
                            className={`group flex items-center justify-between p-6 rounded-[35px] border transition-all duration-500 overflow-hidden relative ${isActiveStage ? `bg-white/5 ${s.border} ${s.glow} scale-[1.02]` : 'bg-[#0A0A0B] border-white/5 opacity-40 hover:opacity-100'}`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isActiveStage ? `${s.color} bg-white/5` : 'bg-black text-white/20'}`}>
                                     <s.icon size={20} className={isActiveStage && sId === 'error' ? 'animate-pulse' : ''} />
                                </div>
                                <div className="text-left">
                                    <div className={`micro-text uppercase tracking-widest text-[9px] font-black opacity-40`}>{s.label}</div>
                                    <div className="hero-text text-lg uppercase text-white tracking-widest">{s.title}</div>
                                </div>
                            </div>
                            {isActiveStage && <ArrowRight size={18} className={s.color} />}
                        </button>
                    );
                })}
            </div>
          </div>
        </div>

        {/* Right Column: Severity Monitor Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Binary size={14} className={current.color.replace('text-', 'text-')} /> Silicon Asset Risk Diagnostic
            </div>

            <div className="flex-1 flex flex-col justify-center items-center gap-12 relative">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={stage}
                        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                        className="flex flex-col items-center gap-10 w-full"
                    >
                        <div className={`w-40 h-40 rounded-[50px] flex items-center justify-center backdrop-blur-xl border-2 ${current.bg} ${current.border} ${current.color} shadow-2xl`}>
                            <current.icon size={80} className={stage === 'error' ? 'animate-pulse' : ''} strokeWidth={1.5} />
                        </div>

                        <div className="text-center space-y-6 w-full">
                            <div className="space-y-2">
                                 <div className={`micro-text uppercase tracking-[0.4em] font-black italic text-[10px] ${current.color}`}>Incident Severity: {current.impact}</div>
                                 <h3 className="hero-text text-5xl uppercase text-white tracking-widest leading-none">
                                    {current.title}
                                </h3>
                            </div>
                            
                            <div className="p-10 rounded-[50px] bg-white/[0.01] border border-white/5 flex flex-col items-center">
                                 <div className={`hero-text text-7xl md:text-8xl tracking-widest leading-none transition-colors duration-700 ${stage === 'normal' ? 'text-white' : 'text-red-500'}`}>
                                    {stage === 'normal' ? '$0' : stage === 'error' ? '-$5.2M' : '-$480M'}
                                </div>
                                <div className={`micro-text uppercase ${current.color} tracking-[0.3em] font-black mt-4 opacity-40 text-[9px]`}>
                                    Projected Financial Capital Recission
                                </div>
                            </div>

                            <p className="body-text text-sm opacity-40 max-w-md mx-auto italic font-light leading-relaxed">
                                {current.desc}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {stage === 'failure' && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.03 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
                    >
                        <div className="hero-text text-[240px] text-red-500 uppercase rotate-12 leading-none font-black">RECALL</div>
                    </motion.div>
                )}
            </div>

            <div className="mt-8 flex items-center justify-between p-6 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Activity size={20} className={current.color} />
                    <div>
                        <div className="micro-text uppercase text-white/60 tracking-widest font-black">Validation Protocol Check</div>
                        <div className="body-text text-[10px] opacity-30 italic">Determining verification depth required to mitigate silicon hazard level.</div>
                    </div>
                </div>
                <button 
                  onClick={() => setStage('normal')}
                  className="px-6 py-3 rounded-2xl bg-white/5 text-white/40 micro-text text-[9px] font-black uppercase tracking-widest hover:text-white transition-all"
                >
                    Reset Evaluator
                </button>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
