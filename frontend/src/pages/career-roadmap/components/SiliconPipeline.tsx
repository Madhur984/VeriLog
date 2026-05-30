import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { DataTerminal } from './DataTerminal';

const PIPELINE_STAGES = [
  { label: 'ACADEMIC FOUNDATION', desc: 'Core Physics & Mathematics', density: 100 },
  { label: 'LABORATORY SYSTHESIS', desc: 'Practical HDL & Analog Design', density: 65 },
  { label: 'INTERNSHIP INTAKE', desc: 'Industrial Exposure (Tier 1)', density: 25 },
  { label: 'ELITE PLACEMENT', desc: 'Market Giant Absorption', density: 8 },
];

export const SiliconPipeline: React.FC = () => {
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
                className="p-6 border border-ghost-trace bg-bg-void/40 hover:border-cyan-400/40 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-8 h-8 rounded-full border border-ghost-trace flex items-center justify-center text-text-dim font-mono text-[10px] group-hover:border-cyan-400 group-hover:text-cyan-400">
                    0{i + 1}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400 font-bold">{stage.density}% FLOW</div>
                </div>

                <h4 className="text-xs font-mono font-bold text-text-main uppercase tracking-wider mb-2">{stage.label}</h4>
                <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest leading-relaxed">
                  {stage.desc}
                </p>

                <div className="mt-6 h-1 w-full bg-ghost-trace rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-cyan-400"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stage.density}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                  />
                </div>
              </motion.div>
              
              {i < PIPELINE_STAGES.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10 items-center justify-center text-cyan-400/30 pointer-events-none">
                  <ArrowRight size={16} />
                </div>
              )}
            </div>
          ))}

          {/* Connection Lines Background */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-ghost-trace -translate-y-1/2 hidden md:block" />
        </div>

        <div className="mt-8 flex items-center gap-6 p-4 bg-cyan-400/5 border border-cyan-400/20 rounded-sm">
           <Zap size={20} className="text-cyan-400 animate-pulse" />
           <p className="text-[10px] font-mono text-text-sub uppercase tracking-widest leading-relaxed">
             <span className="text-cyan-400 font-bold">Optimization Alert:</span> Significant drop observed at Internship Stage. 
             Enhance <span className="text-text-main font-bold">Industrial Artifacts</span> to improve transition probability.
           </p>
        </div>
      </div>
    </DataTerminal>
  );
};
