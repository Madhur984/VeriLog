import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SignalOrbProps {
    type?: 'analog' | 'digital';
    onPulse?: () => void;
    onDragEnd?: (info: any) => void;
    className?: string;
}

export const SignalOrb: React.FC<SignalOrbProps> = ({ type = 'digital', onPulse, onDragEnd, className }) => {
    const [_isDragging, setIsDragging] = useState(false);

    // Animation Controls
    const controls = useAnimation();

    const handleTap = () => {
        // Haptic feedback visual
        controls.start({
            scale: [1, 1.2, 1],
            boxShadow: [
                "0 0 0px 0px rgba(58, 134, 255, 0)",
                "0 0 20px 10px rgba(58, 134, 255, 0.5)",
                "0 0 0px 0px rgba(58, 134, 255, 0)"
            ],
            transition: { duration: 0.4 }
        });
        if (onPulse) onPulse();
    };

    return (
        <motion.div
            drag
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            dragElastic={0.2}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(_e, info) => {
                setIsDragging(false);
                if (onDragEnd) onDragEnd(info);
            }}
            onTap={handleTap}
            animate={controls}
            className={cn(
                "relative flex items-center justify-center rounded-full cursor-pointer touch-none",
                "w-24 h-24 backdrop-blur-sm",
                "shadow-[0_4px_24px_rgba(58,134,255,0.4)] inset-shadow-[0_2px_12px_rgba(255,255,255,0.5)]",
                // Type specific styling
                type === 'analog' && "bg-gradient-to-br from-white to-signal-analog shadow-glow-analog",
                type === 'digital' && "bg-gradient-to-br from-white to-primary shadow-glow-primary",
                className
            )}
        >
            {/* Inner Core */}
            <div className={cn(
                "w-12 h-12 rounded-full opacity-80",
                type === 'analog' ? "bg-signal-analog blur-md animate-pulse-slow" : "bg-primary blur-sm"
            )} />

            {/* Mode Indicator Icon (Optional) */}
            {type === 'digital' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-30 text-white font-mono text-xs pointer-events-none">
                    [1]
                </div>
            )}
            {type === 'analog' && (
                <svg className="absolute w-12 h-6 opacity-30 pointer-events-none" viewBox="0 0 100 50">
                    <path d="M0,25 C25,50 75,0 100,25" fill="none" stroke="white" strokeWidth="4" />
                </svg>
            )}
        </motion.div>
    );
};
