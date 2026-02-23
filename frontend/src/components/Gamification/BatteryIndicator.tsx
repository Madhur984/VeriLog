import { motion } from 'framer-motion';

interface BatteryIndicatorProps {
    battery: number;
    maxBattery?: number;
    className?: string;
}

export const BatteryIndicator = ({ battery, maxBattery = 5, className = '' }: BatteryIndicatorProps) => {
    const cells = Array.from({ length: maxBattery }, (_, i) => i < battery);
    const isLow = battery <= 1;
    const isEmpty = battery === 0;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Battery visual */}
            <div className="relative flex items-center">
                {/* Battery body */}
                <div className={`
                    flex gap-[2px] p-[3px] rounded-md border transition-colors
                    ${isEmpty ? 'border-red-500/60' : isLow ? 'border-amber-500/50' : 'border-white/10'}
                    bg-white/5
                `}>
                    {cells.map((filled, i) => (
                        <motion.div
                            key={i}
                            initial={false}
                            animate={{
                                opacity: filled ? 1 : 0.15,
                                scaleY: filled ? 1 : 0.6,
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className={`
                                w-2.5 h-4 rounded-[2px] origin-bottom
                                ${filled
                                    ? isLow
                                        ? 'bg-gradient-to-t from-red-500 to-amber-400 shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                                        : 'bg-gradient-to-t from-emerald-500 to-green-400 shadow-[0_0_6px_rgba(34,197,94,0.3)]'
                                    : 'bg-white/5'
                                }
                            `}
                        />
                    ))}
                </div>

                {/* Battery tip */}
                <div className={`w-1 h-2.5 rounded-r-sm ml-[1px] ${isEmpty ? 'bg-red-500/40' : 'bg-white/10'}`} />

                {/* Low battery pulse */}
                {isLow && battery > 0 && (
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-md border border-red-500/30"
                    />
                )}
            </div>

            {/* Label */}
            <span className={`text-[9px] font-heading font-bold uppercase tracking-widest ${isEmpty ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-slate-500'
                }`}>
                {battery}/{maxBattery}
            </span>
        </div>
    );
};
