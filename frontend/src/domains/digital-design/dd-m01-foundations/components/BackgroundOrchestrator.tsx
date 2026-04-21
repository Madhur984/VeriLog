import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundOrchestratorProps {
  currentScene: number;
}

const PHASE_BACKGROUNDS: Record<string, string | null> = {
  hook: null,
  canonical: '/assets/dd-m01/silicon_logic_blueprint_1776790480201.png',
  minimisation: '/assets/dd-m01/silicon_logic_topography_1776782325768.png', 
  universality: '/assets/dd-m01/universal_nand_forge_1776790502037.png',
  selection: '/assets/dd-m01/boss_core_terminal_1776790526880.png',
};

const BackgroundOrchestrator: React.FC<BackgroundOrchestratorProps> = ({ currentScene }) => {
  let activePhase = 'hook';
  if (currentScene >= 1 && currentScene <= 5) activePhase = 'canonical';
  if (currentScene >= 6 && currentScene <= 8) activePhase = 'minimisation';
  if (currentScene >= 9 && currentScene <= 13) activePhase = 'universality';
  if (currentScene >= 14) activePhase = 'selection';

  // Fallback gradients if images are missing
  const gradients: Record<string, string> = {
    hook: 'radial-gradient(circle at 50% 50%, #00D4FF11 0%, #06060A 100%)',
    canonical: 'radial-gradient(circle at 100% 0%, #06B6D411 0%, #06060A 100%)',
    minimisation: 'radial-gradient(circle at 0% 100%, #3B82F611 0%, #06060A 100%)',
    universality: 'radial-gradient(circle at 50% 0%, #22C55E11 0%, #06060A 100%)',
    selection: 'radial-gradient(circle at 50% 100%, #FFC10711 0%, #06060A 100%)',
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#06060A]">
      <AnimatePresence mode="wait">
        <motion.div
           key={activePhase}
           initial={{ opacity: 0, scale: 1.1 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           transition={{ duration: 1.2, ease: "circOut" }}
           className="absolute inset-0"
        >
           {/* Base Layer: High-Fidelity Asset */}
           {PHASE_BACKGROUNDS[activePhase] && (
             <motion.div 
               className="absolute inset-0 bg-cover bg-center grayscale contrast-125 brightness-[0.4] mix-blend-screen"
               style={{ backgroundImage: `url(${PHASE_BACKGROUNDS[activePhase]})` }}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 2 }}
             />
           )}

           {/* Middle Layer: Thematic Gradient Overlay */}
           <div 
             className="absolute inset-0 transition-all duration-1000"
             style={{ background: gradients[activePhase] }} 
           />
           {activePhase === 'canonical' && (
             <div className="absolute inset-0 opacity-20 contrast-125 brightness-75 grayscale mix-blend-overlay">
                {/* Visual texture/grid */}
                <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#ffffff05 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             </div>
           )}
           
           <div className="absolute inset-0 bg-gradient-to-t from-[#06060A] via-transparent to-[#06060A] opacity-80" />
           <div className="absolute inset-0 bg-gradient-to-r from-[#06060A] via-transparent to-[#06060A] opacity-60" />
        </motion.div>
      </AnimatePresence>

      {/* Persistent global scanlines or noise */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-black/10" />
    </div>
  );
};

export default BackgroundOrchestrator;

