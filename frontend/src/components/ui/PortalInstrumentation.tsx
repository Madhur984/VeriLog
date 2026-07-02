import React, { useRef, useEffect } from 'react';
import { Activity, Zap, Cpu, ShieldCheck } from 'lucide-react';

const AMBER = '#f97316';

// ── GLOBAL STATUS HUD ────────────────────────────────────────────────────────
export const GlobalStatusHUD: React.FC = () => {
    return (
        <div className="flex gap-12 items-center px-8 py-3 bg-bg-elev border border-orange-500/10 rounded-2xl shadow-neo">
            <div className="flex flex-col">
                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-orange-500/40 mb-1">BitforBytes // CORE_STABILITY</span>
                <div className="flex items-center gap-3">
                    <Activity size={12} className="text-orange-500" />
                    <span className="text-[14px] font-mono font-black text-orange-500">99.98%</span>
                </div>
            </div>
            
            <div className="w-[1px] h-8 bg-orange-500/20" />

            <div className="flex flex-col">
                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-orange-500/40 mb-1">SIGNAL_FIDELITY</span>
                <div className="flex items-center gap-3">
                    <Zap size={12} className="text-amber-400" />
                    <span className="text-[14px] font-mono font-black text-amber-400">0.0012 THD</span>
                </div>
            </div>

            <div className="w-[1px] h-8 bg-orange-500/20" />

            <div className="flex flex-col">
                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-orange-500/40 mb-1">HARDWARE_SYNC</span>
                <div className="flex items-center gap-3">
                    <Cpu size={12} className="text-orange-600" />
                    <span className="text-[14px] font-mono font-black text-orange-600 tracking-tighter">LOCKED // FS:192k</span>
                </div>
            </div>

             <div className="w-[1px] h-8 bg-orange-500/20" />

            <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-green-500/50" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">SEC_LEVEL_7</span>
            </div>
        </div>
    );
};

// ── GLOBAL OSCILLOSCOPE ──────────────────────────────────────────────────────
export const GlobalOscilloscope: React.FC<{ color?: string }> = ({ color = AMBER }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let t = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Background Grid Lines
            ctx.strokeStyle = 'rgba(249, 115, 22, 0.05)';
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 40) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            }
            for (let i = 0; i < canvas.height; i += 10) {
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
            }

            ctx.beginPath();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;

            const w = canvas.width;
            const h = canvas.height;
            const cy = h / 2;

            for (let x = 0; x < w; x++) {
                // Complex wave: sum of sines
                const y = cy + 
                    12 * Math.sin(0.04 * x + t) + 
                    5 * Math.sin(0.08 * x + t * 1.5) +
                    2 * Math.sin(0.12 * x + t * 0.5);
                
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            t += 0.05;
            frameRef.current = requestAnimationFrame(animate);
        };

        animate();
        return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
    }, [color]);

    return (
        <div className="relative w-full h-16 opacity-40">
            <canvas ref={canvasRef} width={1200} height={64} className="w-full h-full" />
            <div className="absolute top-1 right-2 flex flex-col items-end pointer-events-none">
                <span className="text-[6px] font-mono text-orange-500/30 uppercase tracking-[0.4em]">Global_Master_Scope</span>
                <span className="text-[8px] font-mono text-orange-500/50 uppercase leading-none">AUTO_SYNC // LIVE</span>
            </div>
        </div>
    );
};
