import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ModuleContainerProps {
  children: React.ReactNode;
  progress: number; // 0 to 1
  activeScreenId: string;
  breadcrumb: string[];
  theme?: {
    background: string;
    primary: string;
    accent: string;
    text: string;
  };
}

export const ProgressBar: React.FC<{ progress: number; color: string }> = ({ progress, color }) => (
  <div className="fixed top-0 left-0 w-full h-1 bg-slate-100 z-[100]">
    <motion.div
      className="h-full"
      initial={{ width: 0 }}
      animate={{ width: `${progress * 100}%` }}
      style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}44` }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    />
  </div>
);

export const Breadcrumb: React.FC<{ items: string[]; color: string }> = ({ items, color }) => (
  <div className="fixed top-6 left-8 flex items-center gap-3 z-[100] font-mono text-[9px] tracking-[0.3em] uppercase">
    {items.map((item, idx) => (
      <React.Fragment key={item}>
        <span style={{ color: idx === items.length - 1 ? color : '#64748B' }}>
          {item}
        </span>
        {idx < items.length - 1 && <span className="text-slate-200">/</span>}
      </React.Fragment>
    ))}
  </div>
);

export const SoftContinueIndicator: React.FC<{ visible: boolean; color: string }> = ({ visible, color }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[100]"
      >
        <span className="text-[9px] font-mono tracking-[0.4em] uppercase text-slate-400" style={{ color: `${color}88` }}>
          Scroll to continue
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={16} style={{ color: `${color}cc` }} />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const ModuleContainer: React.FC<ModuleContainerProps> = ({
  children,
  progress,
  breadcrumb,
  theme = {
    background: '#FFFFFF',
    primary: '#0EA5E9',
    accent: '#6366F1',
    text: '#1E293B'
  }
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-y-scroll snap-y snap-mandatory hide-scrollbar relative select-none"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        scrollBehavior: 'smooth'
      }}
    >
      {/* 
        Fixed overlays should be outside the snap flow or have pointer-events-none.
        Actually, rendering them as direct children is fine if they are fixed.
      */}
      <ProgressBar progress={progress} color={theme.primary} />
      <Breadcrumb items={breadcrumb} color={theme.primary} />
      
      {/* 
        Directly rendering children here ensures snap-start works correctly 
        on each section across all browsers. 
      */}
      {children}

      <SoftContinueIndicator visible={progress < 1} color={theme.primary} />

      {/* Background radial glow */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-10 z-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${theme.primary}11 0%, transparent 70%)`
        }}
      />
    </div>
  );
};

export default ModuleContainer;
