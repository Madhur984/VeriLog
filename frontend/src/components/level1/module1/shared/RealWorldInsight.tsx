import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Headphones, Info, Database } from 'lucide-react';

interface InsightProps {
  type: 'aliasing' | 'quantization' | 'bandwidth' | 'clean';
  visible: boolean;
}

export const RealWorldInsight: React.FC<InsightProps> = ({ type, visible }) => {
  const content = {
    aliasing: {
      title: "Digital Ghosting",
      desc: "This is ALIASING. When you sample too slowly, high frequencies 'disguise' themselves as low ones. This is why helicopter rotors look like they spin backward on video.",
      icon: HelpCircle,
      color: "border-[var(--error)]/30 text-[var(--error)]"
    },
    quantization: {
      title: "Precision Loss",
      desc: "Low bit depth creates '8-bit' artifacts. You are hearing the rounding error between the analog reality and digital steps.",
      icon: Headphones,
      color: "border-[var(--accent-secondary)]/30 text-[var(--accent-secondary)]"
    },
    bandwidth: {
      title: "Data Payload",
      desc: "High frequency signals carry more data but require more energy and expensive hardware to process without distortion.",
      icon: Info,
      color: "border-slate-200 text-slate-800"
    },
    clean: {
      title: "Hi-Fi Signal",
      desc: "Perfect reproduction. The digital model accurately tracks the analog source. This is the goal of high-end signal processing.",
      icon: Database,
      color: "border-[var(--accent-primary)] text-[var(--accent-primary)]"
    }
  };

  const active = content[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className={`glass-card p-4 border-l-4 ${active.color} bg-white/80 border border-slate-200/50 shadow-xl w-[260px]`}
        >
          <div className="flex items-center gap-3 mb-2">
            <active.icon size={16} />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">{active.title}</h4>
          </div>
          <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
            {active.desc}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
