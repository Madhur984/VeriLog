import React from 'react';

interface DataTerminalProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const DataTerminal: React.FC<DataTerminalProps> = ({ 
  title, 
  subtitle, 
  children, 
  icon,
  className = "" 
}) => {
  return (
    <div className={`bg-solder-mask border border-ghost-trace rounded-lg overflow-hidden flex flex-col ${className}`}>
      <div className="px-4 py-3 border-b border-ghost-trace flex items-center justify-between bg-matte-obsidian/50">
        <div className="flex items-center gap-3">
          {icon && <div className="text-plasma-cyan">{icon}</div>}
          <div>
            <h3 className="text-xs font-mono font-bold text-text-main uppercase tracking-widest leading-none">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[10px] font-mono text-text-dim mt-1 uppercase tracking-tighter">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-ghost-trace"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-plasma-cyan shadow-cyan-glow"></div>
        </div>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar">
        {children}
      </div>
    </div>
  );
};
