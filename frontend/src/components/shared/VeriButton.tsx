import React from 'react';
import { motion } from 'framer-motion';
import { useGlobalSensory, PACING } from '../../hooks/useGlobalSensory';

interface VeriButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'signal' | 'logic';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
}

/**
 * VeriButton — Unified VeriLog V1 Button.
 * Identical press depth, feedback timing, and haptic pattern.
 */
export const VeriButton: React.FC<VeriButtonProps> = ({
    onClick,
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
}) => {
    const { triggerHaptic, playSound } = useGlobalSensory();

    const getColors = () => {
        switch (variant) {
            case 'signal': return { bg: 'var(--signal-cyan)', text: '#000', glow: 'var(--energy-glow)' };
            case 'logic': return { bg: 'var(--logic-purple)', text: '#FFF', glow: 'var(--logic-glow)' };
            case 'primary': return { bg: 'var(--text-strong)', text: '#000', glow: 'rgba(255,255,255,0.2)' };
            case 'secondary': return { bg: 'rgba(255,255,255,0.05)', text: 'var(--text-primary)', glow: 'none' };
            case 'ghost': return { bg: 'transparent', text: 'var(--text-secondary)', glow: 'none' };
            default: return { bg: 'var(--text-strong)', text: '#000', glow: 'none' };
        }
    };

    const colors = getColors();

    const handleClick = () => {
        if (disabled) return;
        triggerHaptic('light');
        playSound('snap');
        onClick();
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, backgroundColor: variant === 'ghost' ? 'rgba(255,255,255,0.05)' : undefined }}
            whileTap={{ scale: 0.96 }}
            onClick={handleClick}
            disabled={disabled}
            className={`font-mono uppercase tracking-[0.2em] font-bold rounded-lg border border-white/10 transition-shadow ${className}`}
            style={{ 
                backgroundColor: colors.bg, 
                color: colors.text,
                padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '16px 40px' : '12px 24px',
                fontSize: size === 'sm' ? 10 : size === 'lg' ? 14 : 12,
                boxShadow: variant !== 'ghost' && variant !== 'secondary' ? `0 0 20px ${colors.glow}` : 'none',
                opacity: disabled ? 0.3 : 1
            }}
        >
            {children}
        </motion.button>
    );
};
