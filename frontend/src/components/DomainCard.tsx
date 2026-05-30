import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Domain } from '../data/domains';
import { useColorScheme } from '../hooks/useColorScheme';
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
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const Icon = (LucideIcons as any)[domain.icon] || LucideIcons.Cpu;

  const accentColor = 
    domain.demand === 'High' ? (isLight ? 'text-cyan-600' : 'text-cyan-400') : 
    domain.demand === 'Growing' ? (isLight ? 'text-amber-600' : 'text-amber-400') : 
    (isLight ? 'text-purple-600' : 'text-purple-400');
  
  const bgAccentColor = 
    domain.demand === 'High' ? (isLight ? 'bg-cyan-600' : 'bg-cyan-400') : 
    domain.demand === 'Growing' ? (isLight ? 'bg-amber-600' : 'bg-amber-400') : 
    (isLight ? 'bg-purple-600' : 'bg-purple-400');

  const borderAccentColor = 
    domain.demand === 'High' ? (isLight ? 'border-cyan-600/20' : 'border-cyan-400/20') : 
    domain.demand === 'Growing' ? (isLight ? 'border-amber-600/20' : 'border-amber-400/20') : 
    (isLight ? 'border-purple-600/20' : 'border-purple-400/20');

  return (
    <motion.div
      onClick={() => onSelect(domain)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, borderColor: isLight ? 'rgba(3,105,161,0.2)' : 'rgba(34,211,238,0.2)' }}
      className={cn(
        "group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border",
        isLight ? "bg-bg-elev border-border-soft" : "bg-[#0D0F12] border-white/[0.08]",
        isCompassMatch && (isLight ? "border-cyan-600/40 bg-cyan-600/[0.02]" : "border-cyan-400/40 bg-cyan-400/[0.02]"),
        isComparing && (isLight ? "border-cyan-600 ring-1 ring-cyan-600" : "border-cyan-400 ring-1 ring-cyan-400")
      )}
    >
      {/* Top Accent Bar */}
      <div className={cn("h-1 w-full", bgAccentColor)} />

      {/* Compass Match Badge */}
      {isCompassMatch && (
        <div className={cn("absolute top-4 right-4 px-2 py-1 border rounded-md", isLight ? "bg-cyan-600/10 border-cyan-600/30" : "bg-cyan-400/10 border-cyan-400/30")}>
          <span className={cn("font-mono text-[9px] uppercase tracking-tighter flex items-center gap-1", isLight ? "text-cyan-700" : "text-cyan-400")}>
            YOUR MATCH <span className="animate-pulse">✦</span>
          </span>
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", isLight ? "bg-bg-base" : "bg-white/[0.03]", accentColor)}>
            <Icon size={18} />
          </div>
          <h3 className={cn("font-bold text-base tracking-tight transition-colors", isLight ? "text-text-main group-hover:text-cyan-600" : "text-white group-hover:text-cyan-400")}>
            {domain.name}
          </h3>
        </div>

        {/* Description */}
        <p className={cn("text-xs leading-relaxed line-clamp-2 min-h-[36px]", isLight ? "text-text-sub" : "text-slate-400")}>
          {domain.description}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className={cn("px-2 py-0.5 rounded border text-[9px] font-mono uppercase tracking-widest", isLight ? "bg-bg-base" : "bg-white/[0.04]", borderAccentColor, accentColor)}>
            {domain.demand} Demand
          </span>
          <span className={cn(
            "px-2 py-0.5 rounded border text-[9px] font-mono uppercase tracking-widest",
            isLight ? "bg-bg-base" : "bg-white/[0.04]",
            domain.difficulty === 'Hard' 
              ? (isLight ? 'border-red-600/20 text-red-600' : 'border-red-400/20 text-red-400') 
              : (isLight ? 'border-purple-600/20 text-purple-600' : 'border-purple-400/20 text-purple-400')
          )}>
            {domain.difficulty}
          </span>
        </div>

        {/* Salary Sparkline */}
        <div className="space-y-2">
          <span className={cn("font-mono text-[9px] uppercase tracking-widest", isLight ? "text-text-dim" : "text-slate-500")}>Salary Trajectory</span>
          <div className="flex items-end gap-2 h-6">
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: '60%' }}
              className={cn("w-full rounded-t-sm", isLight ? "bg-cyan-600/40" : "bg-cyan-400/40")}
            />
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: '80%' }}
              className={cn("w-full rounded-t-sm", isLight ? "bg-cyan-600/70" : "bg-cyan-400/70")}
            />
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              className={cn("w-full rounded-t-sm", isLight ? "bg-cyan-600" : "bg-cyan-400")}
            />
          </div>
        </div>

        {/* Skills */}
        <div className="flex gap-2">
          {domain.skills.slice(0, 2).map((skill, idx) => (
            <span key={idx} className={cn("px-1.5 py-0.5 border rounded font-mono text-[8px] uppercase", isLight ? "bg-bg-base border-border-soft text-text-dim" : "bg-white/[0.03] border-white/[0.06] text-slate-500")}>
              {skill}
            </span>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className={cn("pt-2 flex items-center justify-between border-t", isLight ? "border-border-soft" : "border-white/[0.05]")}>
          <span className={cn("font-mono text-sm font-bold tracking-tighter", isLight ? "text-text-main" : "text-white")}>
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
                isComparing 
                  ? (isLight ? "bg-cyan-600 text-white border-cyan-600" : "bg-cyan-400 text-black border-cyan-400") 
                  : (isLight ? "bg-bg-base border-border-soft text-text-dim hover:text-text-main hover:border-text-dim" : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20")
              )}
            >
              <LucideIcons.GitCompare size={14} />
            </button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className={cn("p-1.5 rounded-lg border transition-colors", isLight ? "bg-bg-base border-border-soft text-text-dim hover:text-text-main hover:border-text-dim" : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20")}
            >
              <LucideIcons.Bookmark size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
