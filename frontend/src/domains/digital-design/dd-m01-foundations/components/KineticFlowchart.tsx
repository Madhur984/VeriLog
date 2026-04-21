import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  { id: 'start', label: 'THE_PROBLEM', scenes: [0] },
  { id: 'tt', label: 'TRUTH_TABLE', scenes: [1] },
  { id: 'form', label: 'FORMULATION', scenes: [2, 3, 4, 5] },
  { id: 'cost', label: 'COST_ANALYSIS', scenes: [6] },
  { id: 'min', label: 'MINIMISATION', scenes: [7, 8] },
  { id: 'real', label: 'REALISATION', scenes: [9, 10, 11, 12, 13] },
  { id: 'path', label: 'PATH_SELECTION', scenes: [14, 15, 16, 17] },
  { id: 'cap', label: 'CAPSTONE', scenes: [18, 19] },
];

interface KineticFlowchartProps {
  currentScene: number;
}

const KineticFlowchart: React.FC<KineticFlowchartProps> = ({ currentScene }) => {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col items-center gap-1">
      <div className="w-px h-16 bg-gradient-to-t from-white/20 to-transparent" />
      
      <div className="flex flex-col gap-6 items-end">
        {STEPS.map((step, idx) => {
          const isActive = step.scenes.includes(currentScene);
          const isCompleted = Math.max(...step.scenes) < currentScene;
          
          return (
            <div key={step.id} className="group relative flex items-center gap-4">
              {/* Label */}
              <motion.span
                animate={{ 
                  opacity: isActive ? 1 : 0.3,
                  x: isActive ? 0 : 10,
                  color: isActive ? '#00D4FF' : '#7A7A8C'
                }}
                className="text-[10px] font-mono font-black italic tracking-widest pointer-events-none whitespace-nowrap"
              >
                {step.label}
              </motion.span>

              {/* Node */}
              <div className="relative">
                <motion.div
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    backgroundColor: isActive ? '#00D4FF' : isCompleted ? '#22C55E' : '#1A1A1F',
                    borderColor: isActive ? '#00D4FF' : isCompleted ? '#22C55E' : '#FFFFFF22',
                  }}
                  className="w-3 h-3 rounded-full border-2 transition-colors shadow-[0_0_15px_rgba(0,212,255,0)] group-hover:shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                />
                
                {isActive && (
                  <motion.div
                    layoutId="active-glow"
                    className="absolute -inset-2 rounded-full bg-cyan-500/20 blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>

              {/* Connector */}
              {idx < STEPS.length - 1 && (
                <div className="absolute right-[5.5px] top-6 w-px h-6 overflow-hidden">
                   <motion.div 
                     animate={{ 
                       height: isCompleted ? '100%' : '0%',
                       backgroundColor: isCompleted ? '#22C55E' : '#FFFFFF11'
                     }}
                     className="w-full"
                   />
                   <div className="w-full h-full bg-white/5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent" />
    </div>
  );
};

export default KineticFlowchart;
