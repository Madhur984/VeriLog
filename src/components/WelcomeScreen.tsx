import React from 'react';

import { CircuitBoardBackground } from './backgrounds/CircuitBoard';

interface WelcomeScreenProps {
    onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    return (
        <div className="h-screen w-screen bg-white flex flex-col items-center justify-center gap-12 p-8 text-center relative overflow-hidden">
            {/* Circuit Board Background */}
            <CircuitBoardBackground opacity={0.1} />

            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
            >
                <source src="/videos/Circuit_Repair_Cartoon_Animation.mp4" type="video/mp4" />
            </video>

            {/* Content Wrapper (z-index to stay on top) */}
            <div className="z-10 flex flex-col items-center gap-12">
                {/* Logo/Mascot Placeholder */}
                {/* In a real implementation this would be the mascot SVG */}
                <div className="w-48 h-48 bg-orange-500 rounded-3xl flex items-center justify-center animate-bounce shadow-[0_10px_0_0_#cc7700]">
                    <span className="text-8xl">⚡</span>
                </div>

                <div className="max-w-md flex flex-col gap-6">
                    <h1 className="text-4xl font-heading font-extrabold text-neutral-700 tracking-tight">
                        The free, fun, and effective way to learn logic!
                    </h1>

                    <div className="flex flex-col gap-4 w-full">
                        <button
                            onClick={onStart}
                            className="btn-primary w-full py-4 rounded-2xl font-bold font-heading text-lg tracking-wide uppercase"
                        >
                            Get Started
                        </button>

                        <button
                            className="btn-secondary w-full py-4 rounded-2xl font-bold font-heading text-lg tracking-wide uppercase"
                        >
                            I Already Have an Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
