import React from 'react';

interface MasteryBadgeProps {
  score: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
}

export const MasteryBadge: React.FC<MasteryBadgeProps> = ({ score, size = 'md' }) => {
  const getLevel = () => {
    if (score >= 90) return { label: 'Silicon Master', color: 'text-plasma-cyan', glow: 'shadow-cyan-glow' };
    if (score >= 70) return { label: 'Architect', color: 'text-accent-orange', glow: '' };
    if (score >= 40) return { label: 'Technician', color: 'text-text-main', glow: '' };
    return { label: 'Aspirant', color: 'text-text-dim', glow: '' };
  };

  const level = getLevel();
  const sizes = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-1',
    lg: 'text-xs px-3 py-1.5'
  };

  return (
    <div className={`
      inline-flex items-center font-mono uppercase tracking-widest border border-current rounded-full
      ${level.color} ${level.glow} ${sizes[size]}
    `}>
      {level.label} // {score}%
    </div>
  );
};
