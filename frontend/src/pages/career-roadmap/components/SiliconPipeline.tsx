import React from 'react';
import { motion } from 'framer-motion';
import { GitMerge, ArrowRight, Zap } from 'lucide-react';
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
      <div className="p-8 bg-[#020408]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.label} className="relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 border border-white/5 bg-white/[0.01] hover:border-cyan-400/20 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-500 font-mono text-[10px] group-hover:border-cyan-400 group-hover:text-cyan-400">
                    0{i + 1}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400 font-bold">{stage.density}% FLOW</div>
                </div>

                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2">{stage.label}</h4>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-relaxed">
                  {stage.desc}
                </p>

                <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-cyan-400"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stage.density}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                  />
                </div>
              </motion.div>
              
              {i < PIPELINE_STAGES.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-4 z-20 items-center justify-center text-cyan-400/30">
                  <ArrowRight size={16} />
                </div>
              )}
            </div>
          ))}

          {/* Connection Lines Background */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -translate-y-1/2 hidden md:block" />
        </div>

        <div className="mt-8 flex items-center gap-6 p-4 bg-cyan-400/5 border border-cyan-400/20 rounded-sm">
           <Zap size={20} className="text-cyan-400 animate-pulse" />
           <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-relaxed">
             <span className="text-cyan-400 font-bold">Optimization Alert:</span> Significant drop observed at Internship Stage. 
             Enhance <span className="text-white">Industrial Artifacts</span> to improve transition probability.
           </p>
        </div>
      </div>
    </DataTerminal>
  );
};
