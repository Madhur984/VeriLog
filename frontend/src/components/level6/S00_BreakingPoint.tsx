import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, AlertTriangle, Activity, Share2, Binary, ShieldAlert, Layers } from 'lucide-react';
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
  isProMode?: boolean;
}

export const S00_BreakingPoint: React.FC<Props> = ({ isActive }) => {
  const gridElements = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    x: (i % 6) * 60 - 150,
    y: Math.floor(i / 6) * 60 - 150,
    delay: i * 0.1
  }));

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-burnished-copper font-black opacity-60 flex items-center gap-2">
                <ShieldAlert size={14} /> Systemic Entropy Alert
             </div>
             <HeroText className="text-left leading-none" color="text-white">The <br/><span className="text-burnished-copper uppercase">Wall.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light text-left">
                Once, we designed by hand. One gate at a time. But as chips grew to <span className="text-burnished-copper font-bold italic underline underline-offset-8 decoration-burnished-copper/30">100 Billion</span> transistors, we hit a hard limit.
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed text-left font-light">
               Complexity has become the enemy of function. The human mind can no longer track the routing of a modern processor. We reached the breaking point of physical drawing.
            </p>

            <div className="p-8 rounded-[40px] bg-[#0A0A0B] border border-white/5 border-l-4 border-l-burnished-copper shadow-xl group">
                 <div className="flex items-center gap-4 mb-4">
                    <Activity size={20} className="text-burnished-copper group-hover:animate-pulse" />
                    <span className="micro-text uppercase tracking-widest text-white/60 font-black">Cognitive Load Scanner</span>
                 </div>
                 <p className="body-text text-[11px] text-white/40 leading-relaxed font-light italic">
                    "When the math breaks, the language must evolve. You are entering the domain of Hardware Description."
                 </p>
            </div>
          </div>
        </div>

        {/* Right Column: Architectural Chaos Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col items-center justify-center">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Layers size={14} className="text-burnished-copper" /> Entropy Monitor // CORE_OVERLOAD
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-12 w-full relative">
                {/* Chaos Grid Visualization */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    {gridElements.map((g) => (
                    <motion.div
                        key={g.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isActive ? {
                            opacity: [0, 0.2, 0.5, 0],
                            scale: [0.8, 1.2],
                            x: g.x,
                            y: g.y,
                        } : {}}
                        transition={{
                            duration: 3,
                            delay: g.delay,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute p-4 rounded-xl border border-burnished-copper/30 bg-burnished-copper/5"
                    >
                        <Binary size={24} strokeWidth={1} className="text-burnished-copper opacity-40" />
                    </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 p-12 rounded-[60px] bg-white/[0.01] border border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col items-center text-center gap-8 max-w-lg"
                >
                    <div className="w-20 h-20 rounded-[30px] bg-black border border-burnished-copper/40 flex items-center justify-center text-burnished-copper shadow-burnished-glow mb-2">
                        <AlertTriangle size={36} strokeWidth={1.5} />
                    </div>

                    <div className="space-y-4">
                        <div className="hero-text text-4xl text-white tracking-widest leading-none uppercase">
                            One Billion Gates. <br/>
                            <span className="text-burnished-copper italic">One Human Brain.</span>
                        </div>
                        <div className="micro-text uppercase text-plasma-cyan font-black tracking-[0.4em] text-[10px]">
                            Mathematical Paradox Detected
                        </div>
                    </div>

                    <div className="w-full flex items-center gap-4 px-6 opacity-30 mt-4">
                        <div className="h-px flex-1 bg-white/10" />
                        <Share2 size={12} />
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <p className="body-text text-xs text-white/40 leading-relaxed font-light italic">
                        The scalar efficiency of human-rendered logic has reached absolute zero. Automated synthesis is the only path forward.
                    </p>
                </motion.div>
            </div>

            <div className="mt-8 flex items-center justify-between p-6 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-md w-full">
                <div className="flex items-center gap-4">
                    <Activity size={20} className="text-burnished-copper" />
                    <div>
                        <div className="micro-text uppercase text-white/60 tracking-widest font-black">Entropy Status</div>
                        <div className="body-text text-[10px] opacity-30 italic">Observing deterministic collapse in standard design flow.</div>
                    </div>
                </div>
                <div className="px-4 py-1 rounded-full border border-burnished-copper/30 text-burnished-copper micro-text text-[9px] uppercase font-black">
                    CRITICAL_FAIL
                </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
