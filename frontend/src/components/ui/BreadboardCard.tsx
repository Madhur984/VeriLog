import React from 'react';
import { cn } from '../../lib/utils';

interface BreadboardCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const BreadboardCard: React.FC<BreadboardCardProps> = ({ children, className, title }) => {
    return (
        <div className={cn(
            "relative bg-[#F8F9FA] rounded-[32px] border-4 border-slate-900 shadow-[0_10px_40px_rgba(0,0,0,0.06),12px_12px_0px_rgba(15,23,42,1)] overflow-hidden",
            className
        )}>
            {/* Breadboard Dot Grid Background */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Power Rails (Top/Bottom) */}
            <div className="absolute top-0 left-0 right-0 h-4 border-b-2 border-slate-900/10 flex items-center px-8 space-x-12">
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
                        <h3 className="text-sm font-mono font-bold text-slate-400 tracking-widest uppercase flex items-center">
                            <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                            {title}
                        </h3>
                        <div className="flex space-x-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                            ))}
                        </div>
                    </div>
                )}
                {children}
            </div>

            {/* Technical Annotations */}
            <div className="absolute bottom-4 right-8 font-mono text-[10px] text-slate-300 font-bold tracking-tighter uppercase select-none">
                VeriLog Engineering System // REV_2.0 // LABORATORY_ACCESS
            </div>

            {/* Socket Grooves (Decoration) */}
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-8 border-x-2 border-slate-900/5 pointer-events-none" />
        </div>
    );
};
