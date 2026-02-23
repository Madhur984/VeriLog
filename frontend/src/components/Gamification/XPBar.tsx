import { motion, AnimatePresence } from 'framer-motion';

interface XPBarProps {
    xp: number;
    level: number;
    xpProgress: number;
    xpToNextLevel: number;
    recentXPEvent?: { label: string; amount: number } | null;
    className?: string;
}

export const XPBar = ({ xp, level, xpProgress, xpToNextLevel, recentXPEvent, className = '' }: XPBarProps) => {
    return (
        <div className={`relative ${className}`}>
            {/* Level badge + label */}
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <span className="text-[10px] font-black text-black leading-none">{level}</span>
                    </div>
                    <span className="text-[10px] font-heading font-bold text-slate-400 uppercase tracking-widest">Level</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{xpToNextLevel} XP to next</span>
            </div>

            {/* Progress bar */}
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.4)]"
                    initial={false}
                    animate={{ width: `${Math.max(2, xpProgress * 100)}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
            </div>

            {/* Total XP */}
            <div className="flex justify-between mt-1">
                <span className="text-[9px] font-mono text-slate-600">{xp} XP total</span>
            </div>

            {/* XP Toast */}
            <AnimatePresence>
                {recentXPEvent && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: -8, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        className="absolute -top-6 right-0 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold font-heading shadow-lg"
                    >
                        ⚡ {recentXPEvent.label}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
