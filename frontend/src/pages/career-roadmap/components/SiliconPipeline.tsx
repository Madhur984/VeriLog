import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { DataTerminal } from './DataTerminal';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { cn } from '../../../utils/cn';

const PIPELINE_STAGES = [
  { label: 'ACADEMIC FOUNDATION', desc: 'Core Physics & Mathematics', density: 100 },
  { label: 'LABORATORY SYNTHESIS', desc: 'Practical HDL & Analog Design', density: 65 },
  { label: 'INTERNSHIP INTAKE', desc: 'Industrial Exposure (Tier 1)', density: 25 },
  { label: 'ELITE PLACEMENT', desc: 'Market Giant Absorption', density: 8 },
];

export const SiliconPipeline: React.FC = () => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';

  return (
    <DataTerminal title="SILICON PIPELINE" subtitle="Industrial Talent Flow & Saturation Analysis">
      <div className="p-8 bg-solder-mask h-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.label} className="relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-6 border border-ghost-trace bg-bg-void/40 transition-all group",
                  isLight ? "hover:border-cyan-600/40" : "hover:border-cyan-400/40"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "w-8 h-8 rounded-full border border-ghost-trace flex items-center justify-center text-text-dim font-mono text-[10px] transition-colors",
                    isLight ? "group-hover:border-cyan-600 group-hover:text-cyan-600" : "group-hover:border-cyan-400 group-hover:text-cyan-400"
                  )}>
                    0{i + 1}
                  </div>
                  <div className={cn("text-[10px] font-mono font-bold", isLight ? "text-cyan-700" : "text-cyan-400")}>{stage.density}% FLOW</div>
                </div>

                <h4 className="text-xs font-mono font-bold text-text-main uppercase tracking-wider mb-2">{stage.label}</h4>
                <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest leading-relaxed">
                  {stage.desc}
                </p>

                <div className="mt-6 h-1 w-full bg-ghost-trace rounded-full overflow-hidden">
                  <motion.div 
                    className={cn("h-full", isLight ? "bg-cyan-600" : "bg-cyan-400")}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stage.density}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                  />
                </div>
              </motion.div>
              
              {i < PIPELINE_STAGES.length - 1 && (
                <div className={cn("hidden md:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10 items-center justify-center pointer-events-none", isLight ? "text-cyan-600/30" : "text-cyan-400/30")}>
                  <ArrowRight size={16} />
                </div>
              )}
            </div>
          ))}

          {/* Connection Lines Background */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-ghost-trace -translate-y-1/2 hidden md:block" />
        </div>

        <div className={cn(
          "mt-8 flex items-center gap-6 p-4 border rounded-sm",
          isLight ? "bg-cyan-600/5 border-cyan-600/20" : "bg-cyan-400/5 border-cyan-400/20"
        )}>
           <Zap size={20} className={cn("animate-pulse", isLight ? "text-cyan-600" : "text-cyan-400")} />
           <p className="text-[10px] font-mono text-text-sub uppercase tracking-widest leading-relaxed">
             <span className={cn("font-bold", isLight ? "text-cyan-600" : "text-cyan-400")}>Optimization Alert:</span> Significant drop observed at Internship Stage. 
             Enhance <span className="text-text-main font-bold">Industrial Artifacts</span> to improve transition probability.
           </p>
        </div>
      </div>
    </DataTerminal>
  );
};
