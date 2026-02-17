import React from 'react';
import { cn } from '../../lib/utils';

interface BreadboardCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    variant?: 'light' | 'dark';
}

export const BreadboardCard: React.FC<BreadboardCardProps> = ({ children, className, title, variant = 'light' }) => {
    const isDark = variant === 'dark';
    return (
        <div className={cn(
            "relative rounded-[32px] border-4 border-slate-900 transition-colors duration-500 overflow-hidden",
            isDark
                ? "bg-[#0B0F1A] shadow-[0_10px_40px_rgba(0,0,0,0.4),12px_12px_0px_rgba(2,6,23,1)]"
                : "bg-[#F8F9FA] shadow-[0_10px_40px_rgba(0,0,0,0.06),12px_12px_0px_rgba(15,23,42,1)]",
            className
        )}>
            {/* Breadboard Dot Grid Background */}
            <div className={cn(
                "absolute inset-0 pointer-events-none opacity-[0.05]",
                isDark ? "opacity-[0.1]" : "opacity-[0.05]"
            )}
                style={{
                    backgroundImage: `radial-gradient(circle, ${isDark ? '#475569' : '#000'} 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Power Rails (Top/Bottom) */}
            <div className={cn(
                "absolute top-0 left-0 right-0 h-4 border-b-2 flex items-center px-8 space-x-12",
                isDark ? "border-white/5" : "border-slate-900/10"
            )}>
                <div className="flex space-x-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                    <div className="w-48 h-[1px] bg-red-500/30" />
                </div>
                <div className="flex space-x-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                    <div className="w-48 h-[1px] bg-blue-500/30" />
                </div>
            </div>

            <div className="px-10 py-12 relative z-10">
                {title && (
                    <div className="mb-8 flex items-center justify-between">
                        <h3 className={cn(
                            "text-sm font-mono font-bold tracking-widest uppercase flex items-center",
                            isDark ? "text-slate-500" : "text-slate-400"
                        )}>
                            <span className={cn(
                                "w-2 h-2 rounded-full mr-2",
                                isDark ? "bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]" : "bg-primary"
                            )} />
                            {title}
                        </h3>
                        <div className="flex space-x-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    isDark ? "bg-slate-800" : "bg-slate-200"
                                )} />
                            ))}
                        </div>
                    </div>
                )}
                {children}
            </div>

            {/* Technical Annotations */}
            <div className={cn(
                "absolute bottom-4 right-8 font-mono text-[10px] font-bold tracking-tighter uppercase select-none opacity-40",
                isDark ? "text-slate-600" : "text-slate-300"
            )}>
                VeriLog Engineering System // REV_3.1 // LABORATORY_ACCESS
            </div>

            {/* Socket Grooves (Decoration) */}
            <div className={cn(
                "absolute left-1/2 -translate-x-1/2 h-full w-8 border-x-2 pointer-events-none",
                isDark ? "border-white/5" : "border-slate-900/5"
            )} />
        </div>
    );
};
