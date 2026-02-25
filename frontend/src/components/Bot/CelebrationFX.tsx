import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   CelebrationFX — Confetti + Lightning Glow + Screen Pulse
   ──────────────────────────────────────────────────────────────────
   Rendered via canvas for performance. Triggered by BotBrain
   on LEVEL_COMPLETED / NEW_PATH_UNLOCKED events.
   ═══════════════════════════════════════════════════════════════ */

interface CelebrationFXProps {
    active: boolean;
    onComplete?: () => void;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    rotSpeed: number;
    opacity: number;
    shape: 'rect' | 'circle' | 'bolt';
}

const COLORS = [
    '#22C55E', '#3BAF5C', '#8CC63F', '#F5C518',
    '#FF6B35', '#06B6D4', '#2DD4BF', '#FFFFFF',
];

const BOLT_PATH = new Path2D('M-3,-6 L1,-6 L-1,0 L5,0 L-3,10 L0,2 L-5,2 Z');

function createParticles(count: number, w: number, _h: number): Particle[] {
    return Array.from({ length: count }, () => ({
        x: w * 0.3 + Math.random() * w * 0.4,
        y: -20,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 6 + 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: Math.random() > 0.85 ? 'bolt' : Math.random() > 0.5 ? 'circle' : 'rect',
    }));
}

export const CelebrationFX: React.FC<CelebrationFXProps> = ({ active, onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const ch = canvas.height;
        ctx.clearRect(0, 0, w, ch);

        let alive = 0;
        for (const p of particlesRef.current) {
            p.x += p.vx;
            p.vy += 0.12; // gravity
            p.y += p.vy;
            p.vx *= 0.99;
            p.rotation += p.rotSpeed;
            p.opacity = Math.max(0, p.opacity - 0.005);

            if (p.y > ch + 20 || p.opacity <= 0) continue;
            alive++;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;

            if (p.shape === 'bolt') {
                ctx.scale(p.size / 5, p.size / 5);
                ctx.fill(BOLT_PATH);
            } else if (p.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            }
            ctx.restore();
        }

        if (alive > 0) {
            rafRef.current = requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, w, ch);
            onComplete?.();
        }
    }, [onComplete]);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        particlesRef.current = createParticles(80, canvas.width, canvas.height);
        rafRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(rafRef.current);
    }, [active, animate]);

    return (
        <AnimatePresence>
            {active && (
                <>
                    {/* Screen pulse flash */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.15, 0] }}
                        transition={{ duration: 0.6 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'radial-gradient(circle at 85% 85%, #22C55E 0%, transparent 70%)',
                            pointerEvents: 'none',
                            zIndex: 9997,
                        }}
                    />

                    {/* Lightning glow at bottom-right (near mascot) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                        transition={{ duration: 1.2, repeat: 1 }}
                        style={{
                            position: 'fixed',
                            bottom: 60,
                            right: 60,
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(245,197,24,0.4) 0%, transparent 70%)',
                            pointerEvents: 'none',
                            zIndex: 9998,
                        }}
                    />

                    {/* Confetti canvas */}
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            pointerEvents: 'none',
                            zIndex: 9999,
                        }}
                    />
                </>
            )}
        </AnimatePresence>
    );
};
