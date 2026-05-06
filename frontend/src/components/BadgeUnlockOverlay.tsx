
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadBadge } from '../utils/BadgeEngine';

interface BadgeUnlockOverlayProps {
  badge: {
    id: string;
    name: string;
    description: string;
    svgContent: string;
  } | null;
  onClose: () => void;
}

export const BadgeUnlockOverlay: React.FC<BadgeUnlockOverlayProps> = ({ badge, onClose }) => {
  if (!badge) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex flex-col items-center gap-6 p-8 bg-observatory-surface border border-white/[0.08] rounded-3xl max-w-sm w-full text-center"
          onClick={e => e.stopPropagation()}
        >
          <div 
            dangerouslySetInnerHTML={{ __html: badge.svgContent }}
            className="w-48 h-48 drop-shadow-[0_0_30px_rgba(34,211,238,0.2)]" 
          />
          
          <div>
            <div className="text-[10px] font-mono text-cyan-400 mb-2 uppercase tracking-[0.2em]">
              Achievement Unlocked
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{badge.name}</h2>
            <p className="text-sm text-slate-400 leading-relaxed">{badge.description}</p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={() => downloadBadge(badge.svgContent, badge.id)}
              className="w-full py-4 bg-cyan-400 text-black text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl hover:brightness-110 transition-all"
            >
              Download Badge (PNG)
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 border border-white/10 text-slate-400 text-[10px] font-mono uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all"
            >
              Continue Journey
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
