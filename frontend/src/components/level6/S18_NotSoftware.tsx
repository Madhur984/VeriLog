import React from "react";
import { motion } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { Terminal, Cpu, ArrowDown, Repeat } from "lucide-react";

export const S18_NotSoftware: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <HeroText color="text-red-500">This is NOT Programming.</HeroText>
      <p className="body-text text-xl md:text-2xl opacity-60 italic mt-6 mb-20 text-center max-w-3xl">
        Stop thinking about execution steps. Start thinking about <span className="text-white italic underline underline-offset-8">physical pathways</span>.
      </p>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
        {/* Software Mental Model */}
        <div className="p-10 rounded-[60px] bg-white/[0.02] border border-white/5 opacity-40 grayscale blur-[1px] group hover:blur-0 hover:grayscale-0 transition-all duration-700 backdrop-blur-md">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 text-white/40">
                    <Terminal size={20} />
                    <span className="micro-text uppercase">Software (C++/Python)</span>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full mono-text text-[8px] uppercase">Sequential</div>
            </div>

            <div className="space-y-4 mb-10">
                <div className="h-2 w-full bg-white/5 rounded-full relative overflow-hidden">
                    <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 bg-white/20 w-1/3" />
                </div>
                <p className="body-text text-sm opacity-30 italic leading-snug">"Do Step 1... <br/> then wait for Step 2... <br/> then finish Step 3."</p>
            </div>

            <div className="flex flex-col items-center gap-4 text-white/50">
                <ArrowDown size={32} />
                <span className="micro-text uppercase italic">CPU Instruction Stream</span>
            </div>
        </div>

        {/* Hardware Mental Model */}
        <div className="p-10 rounded-[60px] bg-plasma-cyan/5 border border-plasma-cyan/30 shadow-cyan-glow relative overflow-hidden backdrop-blur-3xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-plasma-cyan">
                <Repeat size={120} />
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3 text-plasma-cyan">
                    <Cpu size={20} />
                    <span className="micro-text uppercase">Hardware (Verilog)</span>
                </div>
                <div className="px-3 py-1 bg-plasma-cyan/20 rounded-full mono-text text-plasma-cyan text-[8px] uppercase">Always Active</div>
            </div>

            <div className="space-y-4 mb-10 relative z-10">
                <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-2 bg-plasma-cyan rounded-full animate-pulse" />
                    ))}
                </div>
                <p className="hero-text text-xl md:text-2xl text-white italic leading-tight">
                    "Everything exists together. Always active. Always responding."
                </p>
            </div>

            <div className="flex flex-col items-center gap-4 text-plasma-cyan relative z-10">
                <div className="flex gap-4">
                   <Repeat size={32} /> <Repeat size={32} /> <Repeat size={32} />
                </div>
                <span className="micro-text uppercase italic">Spatial Fabric of Gates</span>
            </div>
        </div>
      </div>

      <div className="mt-20 p-12 rounded-[50px] bg-black/40 border border-white/5 max-w-3xl text-center backdrop-blur-md">
            <p className="body-text text-xl md:text-2xl opacity-60 leading-tight italic">
                In C++, you describe <span className="text-red-400">behavior</span> over time. <br/>
                In Verilog, you describe <span className="text-plasma-cyan underline underline-offset-8">structure</span> in space.
            </p>
      </div>
    </BlueprintContainer>
  );
};
