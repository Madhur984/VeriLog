import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SignalOrbProps {
    type?: 'analog' | 'digital' | 'clock';
    frequency?: number;
    amplitude?: number;
    onPulse?: () => void;
    onDragEnd?: (info: any) => void;
    className?: string;
}

export const SignalOrb: React.FC<SignalOrbProps> = ({
    type = 'digital',
    frequency = 1,
    amplitude = 1,
    onPulse,
    onDragEnd,
    className
}) => {
    const [_isDragging, setIsDragging] = useState(false);
    const controls = useAnimation();

    const handleTap = () => {
        controls.start({
            scale: [1, 1.2, 1],
            boxShadow: [
                "0 0 0px 0px rgba(99, 102, 241, 0)",
                "0 0 30px 10px rgba(99, 102, 241, 0.4)",
                "0 0 0px 0px rgba(99, 102, 241, 0)"
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
                "w-32 h-32 bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/40",
                className
            )}
        >
            {/* Inner Core Glow */}
            <div className={cn(
                "w-16 h-16 rounded-full opacity-40 blur-xl transition-colors duration-500",
                type === 'analog' ? "bg-indigo-400 animate-pulse-slow" :
                    type === 'clock' ? "bg-emerald-400" : "bg-blue-500"
            )} />

            {/* Signal Visualization */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {type === 'digital' && (
                    <div className="text-white/40 font-heading font-black text-xl tracking-tighter">
                        1010
                    </div>
                )}
                {type === 'analog' && (
                    <motion.svg
                        className="w-16 h-8 text-indigo-400/60"
                        viewBox="0 0 100 50"
                        animate={{ x: [0, -20, 0] }}
                        transition={{ duration: 2 / frequency, repeat: Infinity, ease: "linear" }}
                    >
                        <path
                            d="M-20,25 C0,50 20,0 40,25 T80,25 T120,25"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            strokeLinecap="round"
                        />
                    </motion.svg>
                )}
                {type === 'clock' && (
                    <motion.svg
                        className="w-16 h-8 text-emerald-400/60"
                        viewBox="0 0 100 50"
                        animate={{ x: [0, -25, 0] }}
                        transition={{ duration: 1 / frequency, repeat: Infinity, ease: "linear" }}
                    >
                        <path
                            d="M-25,40 L-25,10 L0,10 L0,40 L25,40 L25,10 L50,10 L50,40 L75,40 L75,10 L100,10 L100,40 L125,40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </motion.svg>
                )}
            </div>
        </motion.div>
    );
};
