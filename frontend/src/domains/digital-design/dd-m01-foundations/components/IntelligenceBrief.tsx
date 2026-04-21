import React from 'react';
import { motion } from 'framer-motion';
import { Info, Zap, Cpu, HardDrive } from 'lucide-react';

interface IntelligenceBriefProps {
  type: 'theory' | 'industry' | 'hardware';
  title: string;
  description: string;
  details: string;
  icon?: React.ElementType;
}

const IntelligenceBrief: React.FC<IntelligenceBriefProps> = ({ 
  type, 
  title, 
  description, 
  details,
  icon: Icon
}) => {
  const colors = {
    theory: 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5',
    industry: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
    hardware: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5'
  };

  const DefaultIcon = {
    theory: Info,
    industry: Zap,
    hardware: Cpu
  }[type];

  const FinalIcon = Icon || DefaultIcon;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`relative p-6 rounded-2xl border backdrop-blur-sm ${colors[type]}`}
    >
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-lg bg-[#0A0A0B] border border-inherit flex items-center justify-center">
        <FinalIcon size={14} className="text-inherit" />
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-mono tracking-[0.4em] uppercase opacity-50 mb-2">{type}_INTEL_BRIEFING</h4>
          <h3 className="text-base font-black tracking-[0.1em] text-white uppercase">{title}</h3>
        </div>
        
        <p className="text-sm text-white/80 leading-relaxed font-medium">
          {description}
        </p>

        <div className="pt-4 border-t border-inherit opacity-40">
          <p className="text-xs italic leading-relaxed">
            {details}
          </p>
        </div>
      </div>

      {/* Aesthetic trace line decoration */}
      <div className="absolute bottom-0 right-0 p-2 opacity-10">
        <HardDrive size={40} />
      </div>
    </motion.div>
  );
};

export default IntelligenceBrief;
