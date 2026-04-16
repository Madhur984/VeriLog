import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Activity, Zap, Cpu, Terminal } from "lucide-react";
import './AxeOrGateway.css';

/**
 * AXE-OR SYSTEM GATEWAY v2.0
 * Advanced Cinematic System Environment
 */

const SYSTEM_LOG_MESSAGES = [
  "INFRA: [OK] KERNEL LOADED",
  "SIGNAL: [OK] AD-CONVERTER READY",
  "MEMORY: [OK] 64GB ALLOCATED",
  "NETWORK: [OK] P2P_NODE_7 ACTIVE",
  "PROTOCOL: [OK] VERILOG_V4",
  "VRAM: [OK] SHADER_ENGINE_BOOT",
  "SYSCALL: [OK] ENTROPY_GEN_01"
];

const SYSTEM_STATUS_MESSAGES = [
  "SYSTEM: ONLINE",
  "MODE: LEARNING",
  "SIGNAL: LIVE",
  "STATE: INITIALIZED"
];

const METRICS = [
  { label: "SIGNAL", value: "LIVE", icon: <Activity size={12} /> },
  { label: "CADETS", value: "8,402", icon: <Cpu size={12} /> },
  { label: "VOLTAGE", value: "5V", icon: <Zap size={12} /> }
];

export const GatekeeperLanding: React.FC = () => {
  const navigate = useNavigate();
  const [initializing, setInitializing] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });
  const [voltage, setVoltage] = useState(5.00);
  const [cadets, setCadets] = useState(8402);
  const [logIndex, setLogIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Audio Context for Tactical Feedback
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTacticalClick = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }, []);

  // Fluctuating Metrics
  useEffect(() => {
    const vInterval = setInterval(() => {
      setVoltage(5.00 + (Math.random() - 0.5) * 0.05);
    }, 400);
    const cInterval = setInterval(() => {
      setCadets(prev => prev + (Math.random() > 0.8 ? 1 : 0));
    }, 2000);
    const logInterval = setInterval(() => {
      setLogIndex(prev => (prev + 1) % SYSTEM_LOG_MESSAGES.length);
    }, 3000);
    return () => {
      clearInterval(vInterval);
      clearInterval(cInterval);
      clearInterval(logInterval);
    };
  }, []);

  // Mouse Tracking for Crosshair
  const handleMouseMove = (e: React.MouseEvent) => {
    setMouseCoord({ x: e.clientX, y: e.clientY });
  };

  // Sequential status appearance
  useEffect(() => {
    document.title = "AXE-OR | System Entry";
    if (statusIndex < SYSTEM_STATUS_MESSAGES.length - 1) {
      const timer = setTimeout(() => {
        setStatusIndex(prev => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [statusIndex]);

  const handleEnter = () => {
    playTacticalClick();
    setInitializing(true);
    setTimeout(() => {
      navigate('/login');
    }, 2500);
  };

  return (
    <div className="axe-gateway-container" onMouseMove={handleMouseMove}>
      <title>AXE-OR | System Entry</title>

      {/* 🎯 CROSSHAIR CURSOR */}
      <div 
        className="custom-cursor" 
        style={{ left: mouseCoord.x, top: mouseCoord.y }}
      >
        <div className="crosshair-h" />
        <div className="crosshair-v" />
        <div className="cursor-coords">
          X:{mouseCoord.x} Y:{mouseCoord.y}
        </div>
      </div>

      {/* 🎥 VIDEO BACKGROUND */}
      <div className="video-bg-container">
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          className={`video-bg ${initializing ? 'brightness-[0.2] transition-all duration-1000' : ''}`}
        >
          <source src="/videos/axe-or-bg.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay" />
      </div>

      {/* 🎬 HUD LAYERS */}
      <div className="grid-overlay" />
      <div className="hud-layer jitter-anim" />
      <div className="vignette" />

      {/* INITIALIZING OVERLAY */}
      <AnimatePresence>
        {initializing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="initializing-overlay"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="init-text"
            >
              INITIALIZING AXE-OR...
            </motion.div>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ duration: 2 }}
              className="init-bar"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧩 UI LAYER */}
      <div className="ui-layer">
        
        {/* TOP NAV */}
        <header className="ui-header">
          <div className="system-tag">AXE-OR v1.0</div>
          <div className="sign-in-link" onClick={() => navigate('/login')}>SIGN IN →</div>
        </header>

        {/* ROLLING SYSTEM LOG (Left Side) */}
        <div className="system-log-sidebar">
          <div className="log-header"><Terminal size={10} /> CORE_LOG</div>
          <div className="log-content">
            {SYSTEM_LOG_MESSAGES.slice(Math.max(0, logIndex - 4), logIndex + 1).map((msg, idx) => (
              <div key={idx} className="log-line">{msg}</div>
            ))}
          </div>
        </div>

        {/* CENTER HERO */}
        <main className="ui-center">
          <div className="system-status-container">
            {SYSTEM_STATUS_MESSAGES.slice(0, statusIndex + 1).map((msg, i) => (
              <motion.div 
                key={msg}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.6, x: 0 }}
                transition={{ duration: 0.5 }}
                className={`status-line font-mono ${i === statusIndex ? 'flicker' : ''}`}
              >
                {msg}{i === statusIndex && "_"}
              </motion.div>
            ))}
          </div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="hero-title"
          >
            Master the <span className="accent">Signal.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="hero-subtext"
          >
            From analog flow to digital logic.<br />
            Control systems. Build computation.
          </motion.p>

          <motion.button 
            onClick={handleEnter}
            onMouseEnter={playTacticalClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cta-button"
          >
            <span className="btn-content">
              Enter AXE-OR <ArrowRight size={18} />
            </span>
          </motion.button>
        </main>

        {/* BOTTOM SYSTEM STRIP */}
        <footer className="ui-footer">
          <div className="flex items-center gap-2">
            <span className="opacity-50"><Activity size={12} /></span>
            <span>SIGNAL:</span>
            <span className="text-white">LIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="opacity-50"><Cpu size={12} /></span>
            <span>CADETS:</span>
            <span className="text-white">{cadets.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="opacity-50"><Zap size={12} /></span>
            <span>VOLTAGE:</span>
            <span className="text-white font-mono">{voltage.toFixed(2)}V</span>
          </div>
        </footer>

      </div>
    </div>
  );
};
