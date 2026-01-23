import { useEffect, useRef } from 'react';
import anime from 'animejs';

interface BotProps {
    message: string;
    state: 'idle' | 'success' | 'hint';
}

export const Bot = ({ message, state }: BotProps) => {
    const botRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Entrance
        anime({
            targets: botRef.current,
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 600,
            easing: 'easeOutElastic(1, .8)'
        });

        // Success Reaction
        if (state === 'success') {
            anime({
                targets: botRef.current,
                translateY: [0, -30, 0],
                rotate: [0, -10, 10, 0],
                duration: 800,
                easing: 'easeOutQuad'
            });
        }
    }, [state, message]);

    return (
        <div className="fixed bottom-8 left-8 flex flex-col items-start gap-4 z-50 pointer-events-none">
            <div className="bg-background-secondary/95 border-2 border-accent-cyan p-4 rounded-t-2xl rounded-br-2xl max-w-sm backdrop-blur-sm shadow-[0_0_20px_rgba(0,217,255,0.2)]">
                <p className="text-white font-heading text-lg leading-tight">{message}</p>
            </div>

            <div ref={botRef} className="w-24 h-28 bg-neutral rounded-2xl relative shadow-2xl border-4 border-accent-cyan/50 flex flex-col items-center justify-center">
                <div className="absolute -top-6 w-1 h-6 bg-neutral"></div>
                <div className={`absolute -top-8 w-3 h-3 rounded-full ${state === 'idle' ? 'bg-status-warning animate-pulse' : 'bg-accent-cyan'}`}></div>

                <div className="flex gap-4 mb-2">
                    <div className={`w-4 h-4 rounded-full transition-all duration-300 ${state === 'success' ? 'bg-status-success shadow-[0_0_15px_#4caf50]' : 'bg-accent-cyan shadow-[0_0_10px_#00d9ff]'}`} />
                    <div className={`w-4 h-4 rounded-full transition-all duration-300 ${state === 'success' ? 'bg-status-success shadow-[0_0_15px_#4caf50]' : 'bg-accent-cyan shadow-[0_0_10px_#00d9ff]'}`} />
                </div>

                <div className={`bg-background-primary rounded-full mt-2 transition-all duration-300 ${state === 'success' ? 'w-12 h-3 rounded-b-full' : 'w-10 h-1'}`} />
            </div>
        </div>
    );
};