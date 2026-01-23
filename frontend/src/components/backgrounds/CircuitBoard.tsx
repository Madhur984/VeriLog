import React, { useEffect, useRef } from 'react';

export const CircuitBoardBackground: React.FC<{ opacity?: number }> = ({ opacity = 0.15 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // PCB colors
        const pcbGreen = '#1a4d2e';
        const copperGold = '#d4af37';


        // Generate random circuit traces
        const traces: Array<{ x1: number; y1: number; x2: number; y2: number; glow: number }> = [];
        for (let i = 0; i < 30; i++) {
            traces.push({
                x1: Math.random() * canvas.width,
                y1: Math.random() * canvas.height,
                x2: Math.random() * canvas.width,
                y2: Math.random() * canvas.height,
                glow: Math.random()
            });
        }

        // Animation
        let frame = 0;
        const animate = () => {
            frame++;
            ctx.fillStyle = pcbGreen;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw grid pattern
            ctx.strokeStyle = 'rgba(184, 134, 11, 0.1)';
            ctx.lineWidth = 1;
            const gridSize = 50;
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Draw animated traces
            traces.forEach((trace, i) => {
                const pulse = Math.sin(frame * 0.02 + i) * 0.5 + 0.5;
                ctx.strokeStyle = `rgba(212, 175, 55, ${pulse * 0.6})`;
                ctx.lineWidth = 3;
                ctx.shadowBlur = 10;
                ctx.shadowColor = copperGold;

                ctx.beginPath();
                ctx.moveTo(trace.x1, trace.y1);
                ctx.lineTo(trace.x2, trace.y2);
                ctx.stroke();

                // Draw connection points
                ctx.fillStyle = copperGold;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(trace.x1, trace.y1, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(trace.x2, trace.y2, 4, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.shadowBlur = 0;
            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ opacity, zIndex: 0 }}
        />
    );
};
