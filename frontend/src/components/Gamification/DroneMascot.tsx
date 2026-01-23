import { useEffect, useRef } from 'react';
import anime from 'animejs';

interface DroneMascotProps {
    status: 'idle' | 'success' | 'error' | 'processing';
    message?: string;
}

export const DroneMascot = ({ status, message }: DroneMascotProps) => {
    const droneRef = useRef<HTMLDivElement>(null);
    const lensRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Drone Hover Animation (Continuous)
        const hoverAnim = anime({
            targets: droneRef.current,
            translateY: [-4, 4],
            duration: 2000,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine'
        });

        // Status Reactions
        if (status === 'success') {
            anime({
                targets: droneRef.current,
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                duration: 1000,
                easing: 'easeOutElastic(1, .8)'
            });
            // Happy lens flash
            anime({
                targets: lensRef.current,
                backgroundColor: ['#00DC82', '#FFFFFF', '#00DC82'],
                boxShadow: ['0 0 10px #00DC82', '0 0 30px #00DC82', '0 0 10px #00DC82'],
                duration: 500,
                easing: 'linear'
            });
        } else if (status === 'error') {
            anime({
                targets: droneRef.current,
                translateX: [-5, 5, -5, 5, 0],
                duration: 400,
                easing: 'easeInOutSine'
            });
            // Angry lens flash
            anime({
                targets: lensRef.current,
                backgroundColor: ['#3B82F6', '#EF4444', '#EF4444'],
                boxShadow: ['0 0 10px #3B82F6', '0 0 20px #EF4444', '0 0 10px #EF4444'],
                duration: 300,
                easing: 'linear'
            });
        } else {
            // Reset to neutral blue
            anime({
                targets: lensRef.current,
                backgroundColor: '#3B82F6',
                boxShadow: '0 0 10px #3B82F6',
                duration: 500,
            });
        }

        return () => {
            hoverAnim.pause();
        };
    }, [status]);

    return (
        <div className="flex items-end gap-3 pointer-events-none select-none">
            {/* Drone Visual */}
            <div ref={droneRef} className="w-12 h-12 relative">
                {/* Body */}
                <div className="absolute inset-0 bg-panel-border border-2 border-text-dim rounded-full shadow-lg"></div>
                {/* Lens (Eye) */}
                <div ref={lensRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-signal-blue shadow-neon-blue border-2 border-white/20"></div>
                {/* Rotors */}
                <div className="absolute -top-1 -left-1 w-4 h-1 bg-text-dim rounded-full animate-spin"></div>
                <div className="absolute -top-1 -right-1 w-4 h-1 bg-text-dim rounded-full animate-spin"></div>
            </div>

            {/* Message Bubble */}
            {message && (
                <div className="bg-panel/90 border border-signal-blue/50 text-signal-blue text-xs font-mono p-2 rounded-t-lg rounded-br-lg shadow-neon-blue backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
                    {message}
                </div>
            )}
        </div>
    );
};
