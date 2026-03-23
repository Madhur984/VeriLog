import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronRight, Info } from 'lucide-react';

interface KnowledgeCardProps {
  title: string;
  description: string;
  details?: string;
  icon?: React.ElementType;
  className?: string;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
  title,
  description,
  details,
  icon: Icon = Info,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      layout
      className={`glass-card p-4 border-l-4 border-l-[var(--accent-primary)]/40 hover:border-l-[var(--accent-primary)] transition-all ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
          <Icon size={16} />
        </div>
        
        <div className="flex-1 space-y-1">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/80">{title}</h3>
          <p className="text-[11px] leading-relaxed text-white/50">{description}</p>
          
          {details && (
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-[var(--accent-primary)]/60 hover:text-[var(--accent-primary)] pt-2 transition-colors"
            >
              <BookOpen size={10} />
              {isOpen ? 'Close Theory' : 'View Theory'}
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={10} />
              </motion.div>
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && details && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-white/5 text-[10px] leading-relaxed text-white/40 italic font-serif">
              {details}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
