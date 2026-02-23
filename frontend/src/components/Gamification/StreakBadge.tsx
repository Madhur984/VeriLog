import { motion } from 'framer-motion';

interface StreakBadgeProps {
    streak: number;
    className?: string;
}

export const StreakBadge = ({ streak, className = '' }: StreakBadgeProps) => {
    const isHot = streak >= 7;
    const isWarm = streak >= 3;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Flame icon */}
            <motion.div
                animate={isHot ? {
                    scale: [1, 1.15, 1],
                    rotate: [0, -5, 5, 0],
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
            >
                <span className="text-lg" role="img" aria-label="streak">
                    {isHot ? '🔥' : isWarm ? '⚡' : '💡'}
                </span>
                {isHot && (
                    <motion.div
                        animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-orange-500/30 blur-sm"
                    />
                )}
            </motion.div>

            {/* Count */}
            <div className="flex flex-col leading-none">
                <span className={`text-sm font-heading font-black tabular-nums ${isHot ? 'text-orange-400' : isWarm ? 'text-amber-400' : 'text-slate-400'}`}>
                    {streak}
                </span>
                <span className="text-[8px] font-heading font-bold text-slate-500 uppercase tracking-widest">
                    Clock{streak !== 1 ? 's' : ''}
                </span>
            </div>
        </div>
    );
};
