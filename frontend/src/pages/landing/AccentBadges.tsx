import { motion } from 'framer-motion';
import { Sparkles, Cpu, CheckCircle2, type LucideIcon } from 'lucide-react';

/**
 * Glassy floating feature badges around the product mockup cluster. Each fades
 * in (staggered) then drifts gently forever. Decorative, pointer-events-none.
 */
const BADGES: { label: string; Icon: LucideIcon; cls: string; color: string; float: number }[] = [
  { label: '+50 XP', Icon: Sparkles, cls: '-top-5 right-10', color: '#22D3EE', float: -8 },
  { label: 'RTL · Verilog', Icon: Cpu, cls: 'top-1/2 -right-6 -translate-y-1/2', color: '#10B981', float: 7 },
  { label: 'NAND-only solved', Icon: CheckCircle2, cls: '-bottom-5 left-12', color: '#22D3EE', float: 8 },
];

export const AccentBadges = () => {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {BADGES.map(({ label, Icon, cls, color, float }, i) => (
        <motion.div
          key={label}
          className={`absolute ${cls}`}
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ y: [0, float, 0] }}
            transition={{ duration: 4.5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full text-[11px] font-semibold whitespace-nowrap"
            style={{
              background: 'rgba(13,20,34,0.6)',
              border: `1px solid ${color}33`,
              color: '#E2E8F0',
              boxShadow: `0 8px 24px rgba(0,0,0,0.35), 0 0 18px ${color}1f`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <Icon size={13} style={{ color }} />
            {label}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};
