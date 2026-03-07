/**
 * BadgeToast.tsx — Slide-up badge award notification
 *
 * Fixed bottom-center, framer-motion animation, auto-dismisses in 3.5s.
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Cpu, Compass, Activity } from 'lucide-react';

const T = {
    bg: 'rgba(10,15,30,0.98)',
    border: 'rgba(0,212,255,0.4)',
    text: '#E5E7EB',
    accent: '#00D4FF',
    success: '#10B981',
    mono: "'JetBrains Mono','Roboto Mono',monospace",
    sans: "'Inter',system-ui,sans-serif",
} as const;

const BADGE_ICONS: Record<string, any> = {
    'Analog Explorer': Compass,
    'Digital Discoverer': Cpu,
    'Comparison Master': Star,
    'Digital Advocate': Activity,
    'Loop Initiate': Zap,
    'Diagnostic Specialist': Trophy,
};

interface BadgeToastProps {
    show: boolean;
    badgeName: string;
    xp: number;
    onDismiss: () => void;
}

export function BadgeToast({ show, badgeName, xp, onDismiss }: BadgeToastProps) {
    useEffect(() => {
        if (!show) return;
        const timer = setTimeout(onDismiss, 4000);
        return () => clearTimeout(timer);
    }, [show, onDismiss]);

    const Icon = BADGE_ICONS[badgeName] ?? Trophy;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 32, scale: 0.9, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 16, scale: 0.95, filter: 'blur(4px)' }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    style={{
                        position: 'fixed', bottom: 40, left: '50%',
                        transform: 'translateX(-50%)', zIndex: 9999,
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: '16px 28px',
                        background: T.bg,
                        border: `1px solid ${T.border}`,
                        borderRadius: 8,
                        boxShadow: '0 0 60px rgba(0,212,255,0.2), 0 12px 48px rgba(0,0,0,0.6)',
                        pointerEvents: 'none',
                        overflow: 'hidden',
                    }}
                >
                    {/* Background Glow */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.03), transparent)',
                        animation: 'shimmer 2s infinite linear',
                    }} />

                    {/* Badge icon */}
                    <div style={{
                        width: 44, height: 44, borderRadius: 6,
                        background: 'rgba(0,212,255,0.1)',
                        border: `1px solid rgba(0,212,255,0.3)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: T.accent,
                        boxShadow: '0 0 15px rgba(0,212,255,0.3)',
                    }}>
                        <Icon size={24} strokeWidth={2.5} />
                    </div>

                    <div>
                        <div style={{
                            fontFamily: T.mono, fontSize: 8,
                            letterSpacing: '0.25em', textTransform: 'uppercase',
                            color: `${T.accent}`, marginBottom: 2,
                            fontWeight: 700,
                        }}>
                            Achievement Unlocked
                        </div>
                        <div style={{
                            fontFamily: T.sans, fontSize: 16,
                            color: T.text, fontWeight: 700,
                            letterSpacing: '-0.01em',
                        }}>
                            {badgeName}
                        </div>
                    </div>

                    <div style={{
                        marginLeft: 12, padding: '6px 14px',
                        background: 'rgba(0,212,255,0.08)',
                        border: `1px solid ${T.border}`,
                        borderRadius: 4,
                        fontFamily: T.mono, fontSize: 11,
                        color: T.accent, fontWeight: 800,
                        letterSpacing: '0.05em',
                    }}>
                        +{xp} XP
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
