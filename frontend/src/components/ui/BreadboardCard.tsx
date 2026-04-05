import React from 'react';
import { cn } from '../../lib/utils';

interface BreadboardCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    variant?: 'light' | 'dark' | 'minimal-round';
}

export const BreadboardCard: React.FC<BreadboardCardProps> = ({ children, className, title, variant = 'light' }) => {
    // Force light theme and adapt variants to be light-themed
    const isMinimal = variant === 'minimal-round';

    return (
        <div className={cn(
            "relative transition-all duration-500 overflow-hidden bg-white",
            isMinimal
                ? "rounded-[48px] bg-slate-50 border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                : "rounded-[32px] border-4 border-slate-100",
            !isMinimal && "shadow-[0_10px_40px_rgba(0,0,0,0.04),12px_12px_0px_rgba(15,23,42,0.05)]",
            className
        )}>
            {/* Breadboard Dot Grid Background */}
            <div className={cn(
                "absolute inset-0 pointer-events-none opacity-[0.03]"
            )}
                style={{
                    backgroundImage: `radial-gradient(circle, #64748B 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Power Rails (Top/Bottom) */}
            <div className={cn(
                "absolute top-0 left-0 right-0 h-4 border-b flex items-center px-8 space-x-12 border-slate-100"
            )}>
                <div className="flex space-x-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_5px_rgba(248,113,113,0.3)]" />
                    <div className="w-48 h-[1px] bg-red-400/20" />
                </div>
                <div className="flex space-x-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_5px_rgba(56,189,248,0.3)]" />
                    <div className="w-48 h-[1px] bg-sky-400/20" />
                </div>
            </div>

            <div className="px-10 py-12 relative z-10">
                {title && (
                    <div className="mb-8 flex items-center justify-between">
                        <h3 className={cn(
                            "text-sm font-mono font-bold tracking-widest uppercase flex items-center text-slate-400"
                        )}>
                            <span className={cn(
                                "w-2 h-2 rounded-full mr-2 bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.3)]"
                            )} />
                            {title}
                        </h3>
                        <div className="flex space-x-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                            ))}
                        </div>
                    </div>
                )}
                <div className="text-slate-700">
                    {children}
                </div>
            </div>

            {/* Technical Annotations */}
            <div className={cn(
                "absolute bottom-4 right-8 font-mono text-[10px] font-bold tracking-tighter uppercase select-none opacity-40 text-slate-300"
            )}>
                VeriLog Engineering System // REV_3.1 // LABORATORY_ACCESS
            </div>

            {/* Socket Grooves (Decoration) */}
            <div className={cn(
                "absolute left-1/2 -translate-x-1/2 h-full w-8 border-x pointer-events-none border-slate-100/50"
            )} />
        </div>
    );
};
