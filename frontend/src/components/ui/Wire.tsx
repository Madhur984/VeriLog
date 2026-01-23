import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface WireProps {
    active?: boolean;
    color?: string; // Hex or Class
    className?: string;
}

export const Wire: React.FC<WireProps> = ({ active = false, color = "bg-primary", className }) => {
    return (
        <div className={cn("relative h-2 w-full bg-slate-700/50 rounded-full overflow-hidden", className)}>
            {/* Background Track */}
            <div className="absolute inset-0 w-full h-full opacity-20 bg-current" />

            {/* Active Signal Flow */}
            {active && (
                <motion.div
                    className={cn("absolute inset-0 h-full w-[50%] blur-sm opacity-80", color)}
                    animate={{
                        x: ["-100%", "200%"], // Move across
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear"
                    }}
                    style={{
                        background: `linear-gradient(90deg, transparent, currentColor, transparent)`
                    }}
                />
            )}
            {/* Core Line */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/10 w-full" />
        </div>
    );
};
