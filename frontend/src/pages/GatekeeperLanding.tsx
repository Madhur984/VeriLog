import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { ArrowRight, Terminal, Activity, Zap, Cpu } from "lucide-react";
import './AxeOrGateway.css';

/**
 * AXE-OR SYSTEM INITIALIZATION EXPERIENCE
 * "The system awakens."
 */

// ----------------------------------------------------------------------
// 1. AUDIO ENGINE
// ----------------------------------------------------------------------
const useSystemAudio = () => {
  const ctxRef = useRef<AudioContext | null>(null);

  const init = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playClick = useCallback(() => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    
    // AUTHENTIC MECHANICAL TYPEWRITER / TERMINAL CLICK
    // Layer 1: Sharp high-freq noise (The "snap")
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.5;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    
    const highPass = ctx.createBiquadFilter();
    highPass.type = "highpass";
    highPass.frequency.value = 1800;
    highPass.Q.value = 5;
    
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0.08, ctx.currentTime);
    mainGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
    
    noise.connect(highPass);
    highPass.connect(mainGain);
    mainGain.connect(ctx.destination);
    
    noise.start();

    // Layer 2: Resonant body "thump"
    const osc = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.04);
    
    thumpGain.gain.setValueAtTime(0.02, ctx.currentTime);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
    
    osc.connect(thumpGain);
    thumpGain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }, []);

  const playHum = useCallback(() => {
    if (!ctxRef.current) return () => {};
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(60, ctx.currentTime); // Low 60Hz hum
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    return () => {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(() => osc.stop(), 1000);
    };
  }, []);

  return { init, playClick, playHum };
};

// ----------------------------------------------------------------------
// 2. BOOT TERMINAL (Char-by-Char)
// ----------------------------------------------------------------------
const BOOT_LOGS = [
  "AXE-OR BOOT SEQUENCE INITIATED...",
  "CHECKING CORE SYSTEMS...",
  "MEMORY: [ OK ] 64GB ALLOCATED",
  "SIGNAL ENGINE: [ ONLINE ]",
  "INPUT STREAM: [ DETECTED ]",
  "NEURAL_MAP: [ SYNCED ]",
  "AXE-OR READY"
];

const BootTerminal: React.FC<{ onComplete: () => void; playClick: () => void }> = ({ onComplete, playClick }) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (lineIdx >= BOOT_LOGS.length) {
      setTimeout(onComplete, 800);
      return;
    }

    const fullText = BOOT_LOGS[lineIdx];
    if (charIdx < fullText.length) {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + fullText[charIdx]);
        setCharIdx(prev => prev + 1);
        playClick();
      }, 25);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => [...prev, fullText]);
        setCurrentLine("");
        setCharIdx(0);
        setLineIdx(prev => prev + 1);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [charIdx, lineIdx, onComplete, playClick]);

  return (
    <div className="boot-terminal">
      {displayedLines.map((line, i) => (
        <div key={i} className="terminal-line">{`> ${line}`}</div>
      ))}
      {lineIdx < BOOT_LOGS.length && (
        <div className="terminal-line">
          {`> ${currentLine}`}
          <span className="animate-pulse">_</span>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// 3. CUSTOM CROSSHAIR
// ----------------------------------------------------------------------
const CustomCrosshair: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const sx = useSpring(mouseX, springConfig);
  const sy = useSpring(mouseY, springConfig);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div className="crosshair-container" style={{ left: sx, top: sy }}>
      <div className="bracket-tl crosshair-bracket" />
      <div className="bracket-tr crosshair-bracket" />
      <div className="bracket-bl crosshair-bracket" />
      <div className="bracket-br crosshair-bracket" />
      <div className="crosshair-center" />
      <div className="crosshair-coords">X:{coords.x} Y:{coords.y}</div>
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// 4. MAIN GATEKEEPER LANDING
// ----------------------------------------------------------------------
export const GatekeeperLanding: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"dark" | "booting" | "initializing" | "ready">("dark");
  const [systemReady, setSystemReady] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [entering, setEntering] = useState(false);
  const { init, playClick, playHum } = useSystemAudio();

  // Phase Controller
  useEffect(() => {
    document.title = "AXE-OR | System Wake";
    const t1 = setTimeout(() => setPhase("booting"), 800); // Phase 1 -> 2
    return () => clearTimeout(t1);
  }, []);

  // Glitch Engine
  useEffect(() => {
    if (phase !== "ready") return;
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 250);
    }, 5000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [phase]);

  const handleBootComplete = () => {
    setPhase("ready");
    setSystemReady(true);
    playHum();
  };

  const handleEnter = () => {
    setEntering(true);
    playClick();
    setTimeout(() => {
      navigate('/login');
    }, 2500);
  };

  return (
    <div className="axe-gateway-container" onClick={init}>
      
      {/* 🎬 CROSSHAIR */}
      {systemReady && <CustomCrosshair />}

      {/* 🎥 VIDEO ENVIRONMENT */}
      <motion.div 
        className="video-bg-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "ready" ? 1 : 0 }}
        transition={{ duration: 3 }}
      >
        <video autoPlay muted loop playsInline className="video-bg">
          <source src="/videos/axe-or-bg.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay" />
        <div className="static-noise-overlay" />
      </motion.div>

      {/* 🛠️ HUD LAYER */}
      <div className="grid-overlay" />
      <div className="hud-layer" />

      {/* INITIALIZING OVERLAY (ON CLICK) */}
      <AnimatePresence>
        {entering && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="init-sequence-overlay"
          >
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="init-text text-cyan-400 font-mono text-xl tracking-[0.5rem]">
              INITIALIZING SESSION...
            </motion.div>
            <div className="init-loader">
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.3 }} className="init-loader-fill" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📠 PHASE 2: BOOT TERMINAL */}
      <AnimatePresence>
        {phase === "booting" && (
          <motion.div exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.8 }}>
            <BootTerminal onComplete={handleBootComplete} playClick={playClick} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛡️ PHASE 3-5: HERO UI */}
      {systemReady && (
        <motion.div 
          className="hero-ui-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          {/* TOP NAV */}
          <header className="flex justify-between items-start">
            <div className="system-tag-large">[ AXE-OR SYSTEM ]</div>
            <div className="flex gap-10">
              <div className="radar-scope hidden md:block" />
              <div className="text-xs font-mono text-white/40 hover:text-white cursor-pointer tracking-widest transition-colors" onClick={() => navigate('/login')}>
                SIGN IN →
              </div>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main className="hero-main">
            <motion.div 
              className={`flex flex-col items-center ${glitch ? 'glitch-text' : ''}`}
            >
              <h1 className="hero-title-v2">
                <span className="signal-gradient">AXE-OR</span>
              </h1>
              <div className="hero-punchline">
                Master the Signal.<br />
                <span className="text-cyan-400/80">Control the System.</span>
              </div>
              <p className="hero-tagline">
                Signals become logic. Logic becomes systems.
              </p>
            </motion.div>

            <motion.button 
              onClick={handleEnter}
              className="cta-command group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-4">
                {"> "} ENTER AXE-OR <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </span>
            </motion.button>
          </main>

          {/* SIDE CORE LOG */}
          <div className="core-log-v2">
            <div>SIGNAL_ENGINE: [ STABLE ]</div>
            <div>MEMORY_SYNC: [ LOCKED ]</div>
            <div className="flex items-center gap-2">INPUT_LATENCY: <span className="text-white">12ms</span></div>
          </div>

          {/* FOOTER STATUS */}
          <footer className="flex justify-center pb-4">
            <div className="status-bar-v2">
              <div className="flex items-center gap-2"><Activity size={12} /> SYSTEM: ONLINE</div>
              <div className="flex items-center gap-2"><Zap size={12} /> SIGNAL: LIVE</div>
              <div className="flex items-center gap-2"><Cpu size={12} /> STATE: INITIALIZED</div>
            </div>
          </footer>
        </motion.div>
      )}

    </div>
  );
};
