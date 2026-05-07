import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Domain } from '../data/domains';
import { cn } from '../utils/cn';

interface DomainCardProps {
  domain: Domain;
  isCompassMatch?: boolean;
  onSelect: (domain: Domain) => void;
  onCompare: (domainId: string) => void;
  isComparing?: boolean;
}

export const DomainCard: React.FC<DomainCardProps> = ({ 
  domain, 
  isCompassMatch, 
  onSelect, 
  onCompare,
  isComparing 
}) => {
  const Icon = (LucideIcons as any)[domain.icon] || LucideIcons.Cpu;

  const accentColor = 
    domain.demand === 'High' ? 'text-cyan-400' : 
    domain.demand === 'Growing' ? 'text-amber-400' : 'text-purple-400';
  
  const bgAccentColor = 
    domain.demand === 'High' ? 'bg-cyan-400' : 
    domain.demand === 'Growing' ? 'bg-amber-400' : 'bg-purple-400';

  const borderAccentColor = 
    domain.demand === 'High' ? 'border-cyan-400/20' : 
    domain.demand === 'Growing' ? 'border-amber-400/20' : 'border-purple-400/20';

  return (
    <motion.div
      onClick={() => onSelect(domain)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, borderColor: 'rgba(34,211,238,0.2)' }}
      className={cn(
        "group relative bg-[#0D0F12] border border-white/[0.08] rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
        isCompassMatch && "border-cyan-400/40 bg-cyan-400/[0.02]",
        isComparing && "border-cyan-400 ring-1 ring-cyan-400"
      )}
    >
      {/* Top Accent Bar */}
      <div className={cn("h-1 w-full", bgAccentColor)} />

      {/* Compass Match Badge */}
      {isCompassMatch && (
        <div className="absolute top-4 right-4 px-2 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded-md">
          <span className="font-mono text-[9px] text-cyan-400 uppercase tracking-tighter flex items-center gap-1">
            YOUR MATCH <span className="animate-pulse">✦</span>
          </span>
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg bg-white/[0.03]", accentColor)}>
            <Icon size={18} />
          </div>
          <h3 className="text-white font-bold text-base tracking-tight group-hover:text-cyan-400 transition-colors">
            {domain.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 min-h-[36px]">
          {domain.description}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className={cn("px-2 py-0.5 rounded bg-white/[0.04] border text-[9px] font-mono uppercase tracking-widest", borderAccentColor, accentColor)}>
            {domain.demand} Demand
          </span>
          <span className={cn(
            "px-2 py-0.5 rounded bg-white/[0.04] border text-[9px] font-mono uppercase tracking-widest",
            domain.difficulty === 'Hard' ? 'border-red-400/20 text-red-400' : 'border-purple-400/20 text-purple-400'
          )}>
            {domain.difficulty}
          </span>
        </div>

        {/* Salary Sparkline */}
        <div className="space-y-2">
          <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Salary Trajectory</span>
          <div className="flex items-end gap-2 h-6">
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: '60%' }}
              className="w-full bg-cyan-400/40 rounded-t-sm"
            />
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: '80%' }}
              className="w-full bg-cyan-400/70 rounded-t-sm"
            />
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              className="w-full bg-cyan-400 rounded-t-sm"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="flex gap-2">
          {domain.skills.slice(0, 2).map((skill, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-white/[0.03] border border-white/[0.06] rounded font-mono text-[8px] text-slate-500 uppercase">
              {skill}
            </span>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-white/[0.05]">
          <span className="font-mono text-sm font-bold text-white tracking-tighter">
            {domain.salaryRange}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onCompare(domain.id);
              }}
              className={cn(
                "p-1.5 rounded-lg border transition-colors",
                isComparing ? "bg-cyan-400 text-black border-cyan-400" : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
              )}
            >
              <LucideIcons.GitCompare size={14} />
            </button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
            >
              <LucideIcons.Bookmark size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
