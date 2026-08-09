import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, RotateCcw, Volume2, VolumeX, Trophy, Zap, Shield, Sparkles } from 'lucide-react';

interface SiliconRunner2DProps {
  onClose?: () => void;
  onAwardXP?: (amount: number) => void;
}

export const SiliconRunner2D: React.FC<SiliconRunner2DProps> = ({ onClose, onAwardXP }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'VICTORY'>('IDLE');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('silicon_runner_highscore') || '0', 10);
  });
  const [lives, setLives] = useState(3);
  const [world, setWorld] = useState(1);
  const [transistors, setTransistors] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [starPowerActive, setStarPowerActive] = useState(false);

  // Audio Context Ref for 8-bit sound synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthSound = (type: 'jump' | 'coin' | 'laser' | 'hit' | 'win') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'jump') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'coin') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.12);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'win') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch {
      // Audio context fallback
    }
  };

  // Input states
  const keysRef = useRef<{ jump: boolean; slide: boolean; pulse: boolean }>({
    jump: false,
    slide: false,
    pulse: false,
  });

  const triggerJump = () => { keysRef.current.jump = true; setTimeout(() => { keysRef.current.jump = false; }, 150); };
  const triggerSlide = () => { keysRef.current.slide = true; setTimeout(() => { keysRef.current.slide = false; }, 200); };
  const triggerPulse = () => { keysRef.current.pulse = true; setTimeout(() => { keysRef.current.pulse = false; }, 150); };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        keysRef.current.jump = true;
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        keysRef.current.slide = true;
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyF') {
        e.preventDefault();
        keysRef.current.pulse = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        keysRef.current.jump = false;
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        keysRef.current.slide = false;
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyF') {
        keysRef.current.pulse = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Canvas Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;
    let currentLives = 3;
    let currentScore = 0;
    let currentTransistors = 0;
    let currentWorld = 1;
    let starPowerTimer = 0;

    // Game Physics World State
    const player = {
      x: 80,
      y: 260,
      width: 28,
      height: 38,
      vy: 0,
      gravity: 0.7,
      jumpForce: -12.5,
      isGrounded: true,
      isSliding: false,
      doubleJumpAvailable: true,
    };

    const groundY = 300;

    interface Obstacle {
      x: number;
      y: number;
      width: number;
      height: number;
      type: 'SPIKE' | 'BUG' | 'RAIL' | 'TRANSISTOR' | 'NVIDIA_COIN' | 'STAR';
      speed: number;
    }

    interface Bullet {
      x: number;
      y: number;
      speed: number;
    }

    let obstacles: Obstacle[] = [];
    let bullets: Bullet[] = [];
    let lastSpawnFrame = 0;
    let lastBulletFrame = 0;

    const spawnObstacle = () => {
      const types: Obstacle['type'][] = ['SPIKE', 'BUG', 'RAIL', 'TRANSISTOR', 'NVIDIA_COIN', 'STAR'];
      const rand = Math.random();
      let type: Obstacle['type'] = 'SPIKE';

      if (rand < 0.3) type = 'BUG';
      else if (rand < 0.5) type = 'SPIKE';
      else if (rand < 0.65) type = 'RAIL';
      else if (rand < 0.85) type = 'TRANSISTOR';
      else if (rand < 0.95) type = 'NVIDIA_COIN';
      else type = 'STAR';

      let y = groundY - 32;
      let width = 28;
      let height = 32;

      if (type === 'RAIL') {
        y = groundY - 65; // Overhead rail to duck under
        width = 45;
        height = 18;
      } else if (type === 'TRANSISTOR' || type === 'NVIDIA_COIN' || type === 'STAR') {
        y = groundY - (40 + Math.random() * 60);
        width = 20;
        height = 20;
      }

      obstacles.push({
        x: canvas.width + 20,
        y,
        width,
        height,
        type,
        speed: 4.5 + Math.min(currentScore / 1000, 4),
      });
    };

    const loop = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── 1. Draw World Background ─────────────────────────────────────────
      const bgGradients = [
        ['#090D16', '#0F172A', '#1E293B'], // W1: Digital Logic
        ['#0D0714', '#1E1B4B', '#31103F'], // W2: RTL City
        ['#021318', '#042F2E', '#115E59'], // W3: 2nm Cleanroom
        ['#141103', '#422006', '#713F12'], // W4: FANG Vault
      ];
      const curGrad = bgGradients[(currentWorld - 1) % 4];

      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, curGrad[0]);
      grad.addColorStop(0.5, curGrad[1]);
      grad.addColorStop(1, curGrad[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid Lines in Background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridOffset = (frameCount * 2) % 40;
      for (let x = -gridOffset; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Ground Line
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      ctx.fillStyle = '#14B8A6';
      ctx.fillRect(0, groundY, canvas.width, 3); // Neon top border ground

      // ── 2. Player Controls & Physics ─────────────────────────────────────
      if (keysRef.current.jump) {
        if (player.isGrounded) {
          player.vy = player.jumpForce;
          player.isGrounded = false;
          player.doubleJumpAvailable = true;
          playSynthSound('jump');
          keysRef.current.jump = false;
        } else if (player.doubleJumpAvailable) {
          player.vy = player.jumpForce * 0.85;
          player.doubleJumpAvailable = false;
          playSynthSound('jump');
          keysRef.current.jump = false;
        }
      }

      player.isSliding = keysRef.current.slide && player.isGrounded;
      player.height = player.isSliding ? 20 : 38;

      player.vy += player.gravity;
      player.y += player.vy;

      if (player.y + player.height >= groundY) {
        player.y = groundY - player.height;
        player.vy = 0;
        player.isGrounded = true;
      }

      // Player Pulse Attack
      if (keysRef.current.pulse && frameCount - lastBulletFrame > 15) {
        bullets.push({
          x: player.x + player.width,
          y: player.y + (player.isSliding ? 8 : 16),
          speed: 9,
        });
        playSynthSound('laser');
        lastBulletFrame = frameCount;
      }

      // Star Power Timer
      if (starPowerTimer > 0) {
        starPowerTimer--;
        if (starPowerTimer === 0) setStarPowerActive(false);
      }

      // ── 3. Render Player ──────────────────────────────────────────────────
      ctx.save();
      if (starPowerTimer > 0) {
        ctx.shadowColor = '#EC4899';
        ctx.shadowBlur = 15;
      }

      // Pixel Character Rendering ("Bit")
      ctx.fillStyle = starPowerTimer > 0 ? (frameCount % 6 < 3 ? '#F43F5E' : '#38BDF8') : '#14B8A6';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Character Head / Eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(player.x + 16, player.y + (player.isSliding ? 4 : 6), 6, 6);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(player.x + 19, player.y + (player.isSliding ? 6 : 8), 2, 2);

      // Jetpack Trail Particle
      if (!player.isGrounded) {
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(player.x - 6, player.y + player.height - 10, 6, 8);
      }
      ctx.restore();

      // ── 4. Bullets Logic & Rendering ─────────────────────────────────────
      bullets.forEach((b, bIdx) => {
        b.x += b.speed;
        ctx.fillStyle = '#38BDF8';
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur = 8;
        ctx.fillRect(b.x, b.y, 10, 4);
        ctx.shadowBlur = 0;

        // Check bullet hit on bug obstacles
        obstacles.forEach((o, oIdx) => {
          if (o.type === 'BUG' && b.x >= o.x && b.x <= o.x + o.width && b.y >= o.y && b.y <= o.y + o.height) {
            // Destroy bug
            obstacles.splice(oIdx, 1);
            bullets.splice(bIdx, 1);
            currentScore += 50;
            setScore(currentScore);
            playSynthSound('coin');
          }
        });
      });

      // Filter out off-screen bullets
      bullets = bullets.filter((b) => b.x < canvas.width);

      // ── 5. Spawn & Render Obstacles ──────────────────────────────────────
      if (frameCount - lastSpawnFrame > Math.max(45, 90 - Math.floor(currentScore / 200))) {
        spawnObstacle();
        lastSpawnFrame = frameCount;
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.x -= o.speed;

        // Draw Obstacle Types
        if (o.type === 'SPIKE') {
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.moveTo(o.x, o.y + o.height);
          ctx.lineTo(o.x + o.width / 2, o.y);
          ctx.lineTo(o.x + o.width, o.y + o.height);
          ctx.closePath();
          ctx.fill();
        } else if (o.type === 'BUG') {
          ctx.fillStyle = '#A855F7';
          ctx.fillRect(o.x, o.y, o.width, o.height);
          // Bug eyes
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(o.x + 4, o.y + 6, 4, 4);
          ctx.fillRect(o.x + 16, o.y + 6, 4, 4);
        } else if (o.type === 'RAIL') {
          ctx.fillStyle = '#F59E0B';
          ctx.fillRect(o.x, o.y, o.width, o.height);
          ctx.fillStyle = '#FEF08A';
          ctx.fillRect(o.x + 4, o.y + 4, o.width - 8, 4);
        } else if (o.type === 'TRANSISTOR') {
          ctx.fillStyle = '#38BDF8';
          ctx.shadowColor = '#38BDF8';
          ctx.shadowBlur = 8;
          ctx.fillRect(o.x + 4, o.y + 4, 12, 12);
          ctx.shadowBlur = 0;
        } else if (o.type === 'NVIDIA_COIN') {
          ctx.fillStyle = '#22C55E';
          ctx.shadowColor = '#22C55E';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(o.x + 10, o.y + 10, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px monospace';
          ctx.fillText('$', o.x + 7, o.y + 13);
          ctx.shadowBlur = 0;
        } else if (o.type === 'STAR') {
          ctx.fillStyle = '#EC4899';
          ctx.shadowColor = '#EC4899';
          ctx.shadowBlur = 12;
          ctx.fillRect(o.x, o.y, 16, 16);
          ctx.shadowBlur = 0;
        }

        // Collision Check
        if (
          player.x < o.x + o.width &&
          player.x + player.width > o.x &&
          player.y < o.y + o.height &&
          player.y + player.height > o.y
        ) {
          if (o.type === 'TRANSISTOR') {
            currentScore += 20;
            currentTransistors += 1;
            setScore(currentScore);
            setTransistors(currentTransistors);
            playSynthSound('coin');
            obstacles.splice(i, 1);
          } else if (o.type === 'NVIDIA_COIN') {
            currentScore += 100;
            setScore(currentScore);
            playSynthSound('coin');
            obstacles.splice(i, 1);
          } else if (o.type === 'STAR') {
            starPowerTimer = 300; // 5 seconds of invincibility
            setStarPowerActive(true);
            playSynthSound('win');
            obstacles.splice(i, 1);
          } else {
            // Harmful obstacles (SPIKE, BUG, RAIL)
            if (starPowerTimer > 0) {
              // Destroy obstacle on contact during star power
              obstacles.splice(i, 1);
              currentScore += 30;
              setScore(currentScore);
            } else {
              currentLives -= 1;
              setLives(currentLives);
              playSynthSound('hit');
              obstacles.splice(i, 1);

              if (currentLives <= 0) {
                setGameState('GAMEOVER');
                if (currentScore > highScore) {
                  setHighScore(currentScore);
                  localStorage.setItem('silicon_runner_highscore', currentScore.toString());
                }
                if (onAwardXP && currentScore > 0) {
                  onAwardXP(Math.floor(currentScore / 5));
                }
                return;
              }
            }
          }
        }

        // Remove off-screen obstacles & increment score
        if (o.x + o.width < 0) {
          obstacles.splice(i, 1);
          currentScore += 10;
          setScore(currentScore);

          // World Level Progression
          if (currentScore > 500 && currentWorld === 1) { setWorld(2); playSynthSound('win'); }
          if (currentScore > 1200 && currentWorld === 2) { setWorld(3); playSynthSound('win'); }
          if (currentScore > 2500 && currentWorld === 3) { setWorld(4); playSynthSound('win'); }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setWorld(1);
    setTransistors(0);
    setGameState('PLAYING');
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl bg-[#090D16] border-2 border-teal-500/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(20,184,166,0.3)]">
        {/* Header Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0F172A] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎮</span>
            <div>
              <h3 className="font-mono font-black text-white text-lg tracking-tight uppercase">
                SILICON RUNNER <span className="text-teal-400">2D</span>
              </h3>
              <p className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                WORLD {world}: {world === 1 ? 'DIGITAL LOGIC' : world === 2 ? 'VERILOG CITY' : world === 3 ? '2NM CLEANROOM' : 'FANG VAULT 💰'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/50 transition-all"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-rose-400 rounded-lg bg-slate-800/50 transition-all"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Arcade HUD Telemetry */}
        <div className="flex items-center justify-between px-6 py-2 bg-[#020617] border-b border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-6">
            <span className="text-teal-400 font-bold">SCORE: <span className="text-white">{score}</span></span>
            <span className="text-amber-400 font-bold">HIGH: <span className="text-white">{highScore}</span></span>
            <span className="text-cyan-400 font-bold">TRANSISTORS: <span className="text-white">💎 {transistors}</span></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[10px] uppercase">LIVES:</span>
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={`text-base ${i < lives ? 'text-rose-500 animate-pulse' : 'text-slate-700'}`}>
                ❤
              </span>
            ))}
          </div>
        </div>

        {/* Main Game Screen Canvas */}
        <div className="relative w-full aspect-[2/1] bg-[#090D16] overflow-hidden">
          <canvas ref={canvasRef} width={800} height={400} className="w-full h-full block" />

          {/* Idle Start Overlay */}
          {gameState === 'IDLE' && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-6">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono text-xs uppercase tracking-widest mb-2">
                  Retro Hardware Arcade Mini-Game
                </div>
                <h2 className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tighter uppercase">
                  TAPEOUT <span className="text-teal-400">ODYSSEY</span>
                </h2>
                <p className="text-slate-400 font-mono text-xs max-w-md mx-auto">
                  Jump over clock skew spikes, duck under unrouted power rails, blast timing bugs, and collect transistor coins!
                </p>
              </motion.div>

              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-pink-500 text-white font-mono text-sm font-black rounded-2xl shadow-[0_0_25px_rgba(20,184,166,0.5)] hover:scale-105 transition-all flex items-center gap-3 uppercase cursor-pointer"
              >
                <Play size={20} fill="currentColor" /> START TAPEOUT RUN
              </button>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                <div><span className="text-white font-bold block">SPACE / UP</span> Jump / Double Jump</div>
                <div><span className="text-white font-bold block">DOWN / S</span> Slide / Duck</div>
                <div><span className="text-white font-bold block">SHIFT / F</span> Logic Laser Pulse</div>
              </div>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameState === 'GAMEOVER' && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-6">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-2">
                <span className="text-rose-500 font-mono text-xs font-bold uppercase tracking-widest">TIMING VIOLATION!</span>
                <h2 className="text-4xl font-mono font-black text-white tracking-tight uppercase">
                  SETUP SLACK <span className="text-rose-500">EXCEEDED</span>
                </h2>
                <p className="text-slate-400 font-mono text-xs">
                  Final Score: <span className="text-teal-400 font-bold">{score} Pts</span> • Transistors: <span className="text-cyan-400 font-bold">💎 {transistors}</span>
                </p>
                {score > 0 && (
                  <p className="text-emerald-400 font-mono text-xs font-bold pt-2">
                    ⚡ +{Math.floor(score / 5)} CAREER XP AWARDED!
                  </p>
                )}
              </motion.div>

              <button
                onClick={startGame}
                className="px-8 py-3 bg-teal-500 text-slate-950 font-mono text-xs font-black rounded-xl hover:bg-teal-400 transition-all flex items-center gap-2 uppercase cursor-pointer"
              >
                <RotateCcw size={16} /> RETRY TAPE-OUT
              </button>
            </div>
          )}
        </div>

        {/* Touch Screen On-Screen Arcade Controls (Mobile & Quick Play) */}
        <div className="p-4 bg-[#0F172A] border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={triggerJump}
              className="px-6 py-3 bg-teal-500/20 border border-teal-500/40 text-teal-300 font-mono text-xs font-bold rounded-xl active:bg-teal-500 active:text-slate-950 transition-all uppercase cursor-pointer"
            >
              ⬆ JUMP
            </button>
            <button
              onClick={triggerSlide}
              className="px-6 py-3 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold rounded-xl active:bg-amber-500 active:text-slate-950 transition-all uppercase cursor-pointer"
            >
              ⬇ SLIDE
            </button>
          </div>

          <button
            onClick={triggerPulse}
            className="px-8 py-3 bg-pink-500/20 border border-pink-500/40 text-pink-300 font-mono text-xs font-bold rounded-xl active:bg-pink-500 active:text-slate-950 transition-all uppercase cursor-pointer flex items-center gap-2"
          >
            ⚡ LOGIC LASER
          </button>
        </div>
      </div>
    </div>
  );
};
