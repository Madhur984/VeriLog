import { useEffect, useRef } from 'react';
import anime from 'animejs';

interface MagicSmokeProps {
    trigger: boolean; // Trigger animation on true
}

export const MagicSmoke = ({ trigger }: MagicSmokeProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (trigger) {
            const smokeParticles = containerRef.current?.children;
            if (!smokeParticles) return;

            anime({
                targets: smokeParticles,
                translateY: [0, -100],
                translateX: () => anime.random(-50, 50),
                scale: [0, 4],
                opacity: [0.8, 0],
                duration: 2000,
                delay: anime.stagger(100),
                easing: 'easeOutExpo',
                complete: (anim) => {
                    // Reset properties after animation (cast to any for TS)
                    (anim as any).reset();
                }
            });
        }
    }, [trigger]);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-[100]">
            {/* Generate pool of smoke particles */}
            {Array.from({ length: 20 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full bg-gray-500/50 mix-blend-overlay blur-sm opacity-0"
                />
            ))}
        </div>
    );
};
