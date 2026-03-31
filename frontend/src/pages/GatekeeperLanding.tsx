import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   GatekeeperLanding — The first page every user sees.
   Full-screen circuit video, VeriLog logo, single CTA → /login.
   No auth check. Pure entry gate.
   ═══════════════════════════════════════════════════════════════ */

export const GatekeeperLanding = () => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [titleVisible, setTitleVisible] = useState(false);

    // Stagger title in after video begins playing
    useEffect(() => {
        const timer = setTimeout(() => setTitleVisible(true), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className="relative w-full h-screen overflow-hidden bg-slate-50"
            aria-label="gatekeeper-landing"
        >
            {/* ── FULL-SCREEN BACKGROUND VIDEO ── */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-30"
                    style={{ filter: 'grayscale(1) brightness(1.2) contrast(1.1)' }}
                >
                    <source src="/videos/Circuit_Repair_Cartoon_Animation.mp4" type="video/mp4" />
                </video>

                {/* Gradient overlay — lightens for content readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                {/* Subtle light vignette edges */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,255,255,0.45)_100%)]" />
            </div>

            {/* ── TOP-LEFT LOGO ── */}
            <motion.header
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 left-0 right-0 z-20 p-8 flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    <Zap className="w-7 h-7 text-sky-600" strokeWidth={2.5} />
                    <span className="font-mono font-black text-xl tracking-widest text-slate-900 uppercase">
                        VeriLog
                        <span className="text-sky-600/60 text-xs ml-2">v2.0</span>
                    </span>
                </div>

                {/* Subtle "already have an account" link */}
                <button
                    onClick={() => navigate('/login')}
                    className="text-xs font-mono text-slate-400 hover:text-sky-600 transition-colors tracking-widest uppercase font-bold"
                >
                    Sign in →
                </button>
            </motion.header>

            {/* ── MAIN CONTENT — CENTER ── */}
            <div className="relative z-10 flex flex-col items-center justify-end h-full pb-20 px-6 text-center">
                <AnimatePresence>
                    {titleVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col items-center gap-6"
                        >
                            {/* Eyebrow label */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-200 bg-sky-50 shadow-sm"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                                <span className="text-xs font-mono text-sky-600 tracking-[0.2em] uppercase font-bold">
                                    System Online
                                </span>
                            </motion.div>

                            {/* Main headline */}
                            <h1 className="font-mono font-black text-5xl md:text-7xl text-slate-900 leading-none tracking-tight">
                                Master the{' '}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-600">
                                    Signal.
                                </span>
                            </h1>

                            <p className="font-mono text-slate-500 text-sm md:text-base max-w-md leading-relaxed font-medium">
                                An interactive electronics lab where logic comes alive.
                                <br />
                                Build circuits. Break paths. Understand current.
                            </p>

                            {/* Primary CTA */}
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/login')}
                                className="group relative mt-2 flex items-center gap-3 px-10 py-4 rounded-xl font-mono font-bold text-base text-white overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #0284c7, #4f46e5)',
                                    boxShadow: '0 10px 32px rgba(2,132,199,0.25), 0 4px 12px rgba(0,0,0,0.05)',
                                }}
                            >
                                <span className="relative z-10">Enter the System</span>
                                <ArrowRight
                                    className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform"
                                    strokeWidth={2.5}
                                />
                                {/* Shine sweep on hover */}
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── BOTTOM STATUS BAR ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-6 w-full flex justify-center gap-10 text-[10px] font-mono text-slate-400 uppercase tracking-widest z-10 font-bold"
            >
                <span>Signal: <span className="text-sky-600">LIVE</span></span>
                <span>Cadets: <span className="text-indigo-600">8,402</span></span>
                <span>Voltage: <span className="text-sky-600">5V</span></span>
            </motion.div>
        </div>
    );
};

