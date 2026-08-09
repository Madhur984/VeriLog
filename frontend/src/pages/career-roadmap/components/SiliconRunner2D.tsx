import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, RotateCcw, Volume2, VolumeX, ShoppingBag, Shield, Zap, Sparkles, Award, Compass, UserCheck } from 'lucide-react';

interface SiliconRunner2DProps {
  onClose?: () => void;
  onAwardXP?: (amount: number) => void;
}

export type HeroClass = 'BIT' | 'NORA' | 'KAEL';

export const SiliconRunner2D: React.FC<SiliconRunner2DProps> = ({ onClose, onAwardXP }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'VICTORY' | 'SHOP'>('IDLE');
  const [selectedHero, setSelectedHero] = useState<HeroClass>('BIT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('silicon_runner_highscore') || '0', 10);
  });
  const [lives, setLives] = useState(3);
  const [world, setWorld] = useState(1);
  const [transistors, setTransistors] = useState(() => {
    return parseInt(localStorage.getItem('silicon_runner_transistors') || '0', 10);
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [specialCooldown, setSpecialCooldown] = useState(0);
  const [specialActive, setSpecialActive] = useState(false);

  // Persistent Upgrades State from localStorage
  const [upgrades, setUpgrades] = useState(() => {
    try {
      const saved = localStorage.getItem('silicon_runner_upgrades');
      return saved ? JSON.parse(saved) : { boots: false, magnet: false, armor: false, multiplier: false };
    } catch {
      return { boots: false, magnet: false, armor: false, multiplier: false };
    }
  });

  // Save upgrades & transistors to localStorage
  const saveUpgrades = (newUpgrades: any, newTransistors: number) => {
    setUpgrades(newUpgrades);
    setTransistors(newTransistors);
    localStorage.setItem('silicon_runner_upgrades', JSON.stringify(newUpgrades));
    localStorage.setItem('silicon_runner_transistors', newTransistors.toString());
  };

  // Audio Context Ref for 8-bit sound synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthSound = (type: 'jump' | 'coin' | 'laser' | 'hit' | 'win' | 'boss' | 'special') => {
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
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'coin') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'special') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'boss') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.4);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(30, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'win') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        osc.frequency.setValueAtTime(1046.50, now + 0.3);
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
  const keysRef = useRef<{ jump: boolean; slide: boolean; pulse: boolean; special: boolean }>({
    jump: false,
    slide: false,
    pulse: false,
    special: false,
  });

  const triggerJump = () => { keysRef.current.jump = true; setTimeout(() => { keysRef.current.jump = false; }, 150); };
  const triggerSlide = () => { keysRef.current.slide = true; setTimeout(() => { keysRef.current.slide = false; }, 200); };
  const triggerPulse = () => { keysRef.current.pulse = true; setTimeout(() => { keysRef.current.pulse = false; }, 150); };
  const triggerSpecial = () => { keysRef.current.special = true; setTimeout(() => { keysRef.current.special = false; }, 150); };

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') { e.preventDefault(); keysRef.current.jump = true; }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') { e.preventDefault(); keysRef.current.slide = true; }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyF') { e.preventDefault(); keysRef.current.pulse = true; }
      if (e.code === 'KeyE') { e.preventDefault(); keysRef.current.special = true; }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') keysRef.current.jump = false;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keysRef.current.slide = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyF') keysRef.current.pulse = false;
      if (e.code === 'KeyE') keysRef.current.special = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main 60fps Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;
    let currentLives = upgrades.armor ? 5 : 3;
    let currentScore = 0;
    let currentTransistors = transistors;
    let currentWorld = 1;
    let timeSlowActiveTimer = 0;
    let specialCdTimer = 0;

    setLives(currentLives);

    // Player Object Physics
    const player = {
      x: 80,
      y: 260,
      width: 28,
      height: 38,
      vy: 0,
      gravity: 0.7,
      jumpForce: selectedHero === 'NORA' ? -14 : -12.5,
      isGrounded: true,
      isSliding: false,
      jumpsRemaining: upgrades.boots ? 3 : 2,
    };

    const groundY = 300;

    // Boss Object State
    interface Boss {
      active: boolean;
      name: string;
      x: number;
      y: number;
      width: number;
      height: number;
      hp: number;
      maxHp: number;
      attackTimer: number;
    }

    let boss: Boss = {
      active: false,
      name: 'Karnaugh Goliath',
      x: canvas.width + 50,
      y: groundY - 100,
      width: 70,
      height: 90,
      hp: 100,
      maxHp: 100,
      attackTimer: 0,
    };

    interface Obstacle {
      x: number;
      y: number;
      width: number;
      height: number;
      type: 'SPIKE' | 'BUG' | 'RAIL' | 'TRANSISTOR' | 'NVIDIA_COIN' | 'STAR' | 'BOSS_BEAM';
      speed: number;
    }

    interface Bullet {
      x: number;
      y: number;
      speed: number;
      vy?: number;
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
        y = groundY - 65;
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
        speed: (4.5 + Math.min(currentScore / 1000, 4)) * (timeSlowActiveTimer > 0 ? 0.4 : 1),
      });
    };

    const loop = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cooldown timer tick
      if (specialCdTimer > 0) {
        specialCdTimer--;
        setSpecialCooldown(Math.ceil(specialCdTimer / 60));
      }
      if (timeSlowActiveTimer > 0) {
        timeSlowActiveTimer--;
        if (timeSlowActiveTimer === 0) setSpecialActive(false);
      }

      // ── 1. Parallax Multi-Layer Background ────────────────────────────────
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

      // Layer 1: Parallax Wafer Steppers (Slowest)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      const p1 = (frameCount * 0.5) % canvas.width;
      for (let x = -p1; x < canvas.width; x += 160) {
        ctx.fillRect(x, 80, 40, 120);
      }

      // Layer 2: Parallax Grid Traces
      ctx.strokeStyle = timeSlowActiveTimer > 0 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const p2 = (frameCount * 2) % 40;
      for (let x = -p2; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Ground Line
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      ctx.fillStyle = timeSlowActiveTimer > 0 ? '#38BDF8' : '#14B8A6';
      ctx.fillRect(0, groundY, canvas.width, 3);

      // ── 2. Special Ability Trigger ────────────────────────────────────────
      if (keysRef.current.special && specialCdTimer === 0) {
        specialCdTimer = 360; // 6 sec cooldown
        playSynthSound('special');

        if (selectedHero === 'BIT') {
          // Overclock Speed Dash
          currentScore += 150;
          setScore(currentScore);
        } else if (selectedHero === 'NORA') {
          // Chronos Time Warp (Slow down 60%)
          timeSlowActiveTimer = 300; // 5s
          setSpecialActive(true);
        } else if (selectedHero === 'KAEL') {
          // Triple Laser Barrage
          bullets.push({ x: player.x + player.width, y: player.y + 10, speed: 10, vy: -2 });
          bullets.push({ x: player.x + player.width, y: player.y + 16, speed: 10, vy: 0 });
          bullets.push({ x: player.x + player.width, y: player.y + 22, speed: 10, vy: 2 });
        }
        keysRef.current.special = false;
      }

      // ── 3. Player Physics & Controls ──────────────────────────────────────
      if (keysRef.current.jump) {
        if (player.isGrounded) {
          player.vy = player.jumpForce;
          player.isGrounded = false;
          player.jumpsRemaining = (upgrades.boots ? 3 : 2) - 1;
          playSynthSound('jump');
          keysRef.current.jump = false;
        } else if (player.jumpsRemaining > 0) {
          player.vy = player.jumpForce * 0.85;
          player.jumpsRemaining--;
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

      // Pulse Attack
      if (keysRef.current.pulse && frameCount - lastBulletFrame > 15) {
        bullets.push({
          x: player.x + player.width,
          y: player.y + (player.isSliding ? 8 : 16),
          speed: 9,
        });
        playSynthSound('laser');
        lastBulletFrame = frameCount;
      }

      // ── 4. Render Player Character ───────────────────────────────────────
      ctx.save();
      const heroColors = { BIT: '#14B8A6', NORA: '#EC4899', KAEL: '#A855F7' };
      ctx.fillStyle = heroColors[selectedHero];
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(player.x + 16, player.y + (player.isSliding ? 4 : 6), 6, 6);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(player.x + 19, player.y + (player.isSliding ? 6 : 8), 2, 2);

      // Jetpack Trail
      if (!player.isGrounded) {
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(player.x - 6, player.y + player.height - 10, 6, 8);
      }
      ctx.restore();

      // ── 5. Boss Battle Logic & Rendering ──────────────────────────────────
      if (currentScore > 1000 && !boss.active && Math.random() < 0.005) {
        boss.active = true;
        boss.x = canvas.width - 100;
        boss.hp = 100;
        playSynthSound('boss');
      }

      if (boss.active) {
        // Draw Boss HP Bar
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(canvas.width / 2 - 100, 15, 200, 14);
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(canvas.width / 2 - 100, 15, (boss.hp / boss.maxHp) * 200, 14);
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(canvas.width / 2 - 100, 15, 200, 14);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`👹 ${boss.name.toUpperCase()}`, canvas.width / 2 - 60, 26);

        // Draw Boss Body
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
        ctx.fillStyle = '#FEF08A';
        ctx.fillRect(boss.x + 10, boss.y + 15, 12, 12);
        ctx.fillRect(boss.x + 45, boss.y + 15, 12, 12);

        // Boss Attack (Fires Heat Beam every 120 frames)
        boss.attackTimer++;
        if (boss.attackTimer % 120 === 0) {
          obstacles.push({
            x: boss.x - 40,
            y: groundY - 30,
            width: 40,
            height: 25,
            type: 'BOSS_BEAM',
            speed: 6,
          });
        }
      }

      // ── 6. Bullets Logic ──────────────────────────────────────────────────
      bullets.forEach((b, bIdx) => {
        b.x += b.speed;
        if (b.vy) b.y += b.vy;

        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(b.x, b.y, 10, 4);

        // Hit Boss
        if (boss.active && b.x >= boss.x && b.x <= boss.x + boss.width && b.y >= boss.y && b.y <= boss.y + boss.height) {
          boss.hp -= 10;
          bullets.splice(bIdx, 1);
          playSynthSound('coin');

          if (boss.hp <= 0) {
            boss.active = false;
            currentScore += 500;
            currentTransistors += 100;
            setScore(currentScore);
            saveUpgrades(upgrades, currentTransistors);
            playSynthSound('win');
          }
        }

        // Hit Bug
        obstacles.forEach((o, oIdx) => {
          if (o.type === 'BUG' && b.x >= o.x && b.x <= o.x + o.width && b.y >= o.y && b.y <= o.y + o.height) {
            obstacles.splice(oIdx, 1);
            bullets.splice(bIdx, 1);
            currentScore += Math.floor(50 * (upgrades.multiplier ? 1.25 : 1));
            setScore(currentScore);
            playSynthSound('coin');
          }
        });
      });

      bullets = bullets.filter((b) => b.x < canvas.width);

      // ── 7. Spawn & Render Obstacles ──────────────────────────────────────
      if (frameCount - lastSpawnFrame > Math.max(40, 85 - Math.floor(currentScore / 200))) {
        spawnObstacle();
        lastSpawnFrame = frameCount;
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.x -= o.speed;

        // NVIDIA Coin Magnet Upgrade
        if (upgrades.magnet && (o.type === 'TRANSISTOR' || o.type === 'NVIDIA_COIN')) {
          if (o.x - player.x < 150 && o.x > player.x) {
            o.x -= 3;
            if (o.y < player.y) o.y += 2;
            else if (o.y > player.y) o.y -= 2;
          }
        }

        // Draw Obstacles
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
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(o.x + 4, o.y + 6, 4, 4);
          ctx.fillRect(o.x + 16, o.y + 6, 4, 4);
        } else if (o.type === 'RAIL' || o.type === 'BOSS_BEAM') {
          ctx.fillStyle = o.type === 'BOSS_BEAM' ? '#F43F5E' : '#F59E0B';
          ctx.fillRect(o.x, o.y, o.width, o.height);
        } else if (o.type === 'TRANSISTOR') {
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(o.x + 4, o.y + 4, 12, 12);
        } else if (o.type === 'NVIDIA_COIN') {
          ctx.fillStyle = '#22C55E';
          ctx.beginPath();
          ctx.arc(o.x + 10, o.y + 10, 10, 0, Math.PI * 2);
          ctx.fill();
        } else if (o.type === 'STAR') {
          ctx.fillStyle = '#EC4899';
          ctx.fillRect(o.x, o.y, 16, 16);
        }

        // Collision Check
        if (
          player.x < o.x + o.width &&
          player.x + player.width > o.x &&
          player.y < o.y + o.height &&
          player.y + player.height > o.y
        ) {
          if (o.type === 'TRANSISTOR') {
            const gain = selectedHero === 'KAEL' ? 30 : 20;
            currentScore += Math.floor(gain * (upgrades.multiplier ? 1.25 : 1));
            currentTransistors += 1;
            setScore(currentScore);
            saveUpgrades(upgrades, currentTransistors);
            playSynthSound('coin');
            obstacles.splice(i, 1);
          } else if (o.type === 'NVIDIA_COIN') {
            currentScore += Math.floor(100 * (upgrades.multiplier ? 1.25 : 1));
            setScore(currentScore);
            playSynthSound('coin');
            obstacles.splice(i, 1);
          } else if (o.type === 'STAR') {
            currentScore += 200;
            setScore(currentScore);
            playSynthSound('win');
            obstacles.splice(i, 1);
          } else {
            // Collision Hit
            currentLives -= 1;
            setLives(currentLives);
            playSynthSound('hit');
            if (navigator.vibrate) navigator.vibrate([40]);
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

        if (o.x + o.width < 0) {
          obstacles.splice(i, 1);
          currentScore += Math.floor(10 * (upgrades.multiplier ? 1.25 : 1));
          setScore(currentScore);

          if (currentScore > 500 && currentWorld === 1) { setWorld(2); playSynthSound('win'); }
          if (currentScore > 1200 && currentWorld === 2) { setWorld(3); playSynthSound('win'); }
          if (currentScore > 2500 && currentWorld === 3) { setWorld(4); playSynthSound('win'); }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, selectedHero, upgrades]);

  const startGame = () => {
    setScore(0);
    setLives(upgrades.armor ? 5 : 3);
    setWorld(1);
    setGameState('PLAYING');
  };

  const buyUpgrade = (key: 'boots' | 'magnet' | 'armor' | 'multiplier', cost: number) => {
    if (transistors >= cost && !upgrades[key]) {
      const newTransistors = transistors - cost;
      const newUpgrades = { ...upgrades, [key]: true };
      saveUpgrades(newUpgrades, newTransistors);
      playSynthSound('win');
    }
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
                SILICON RUNNER <span className="text-teal-400">2D TAPEOUT</span>
              </h3>
              <p className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                WORLD {world}: {world === 1 ? 'DIGITAL LOGIC' : world === 2 ? 'VERILOG CITY' : world === 3 ? '2NM CLEANROOM' : 'FANG VAULT 💰'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setGameState('SHOP')}
              className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 hover:scale-105 transition-all cursor-pointer"
            >
              <ShoppingBag size={14} /> SHOP (💎 {transistors})
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/50 transition-all"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            {onClose && (
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-400 rounded-lg bg-slate-800/50 transition-all">
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Telemetry Bar */}
        <div className="flex items-center justify-between px-6 py-2 bg-[#020617] border-b border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-6">
            <span className="text-teal-400 font-bold">SCORE: <span className="text-white">{score}</span></span>
            <span className="text-amber-400 font-bold">HIGH: <span className="text-white">{highScore}</span></span>
            <span className="text-cyan-400 font-bold">TRANSISTORS: <span className="text-white">💎 {transistors}</span></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[10px] uppercase">LIVES:</span>
            {Array.from({ length: upgrades.armor ? 5 : 3 }).map((_, i) => (
              <span key={i} className={`text-base ${i < lives ? 'text-rose-500 animate-pulse' : 'text-slate-700'}`}>
                ❤
              </span>
            ))}
          </div>
        </div>

        {/* Game Canvas View */}
        <div className="relative w-full aspect-[2/1] bg-[#090D16] overflow-hidden">
          <canvas ref={canvasRef} width={800} height={400} className="w-full h-full block" />

          {/* Hero Selection & Start Overlay */}
          {gameState === 'IDLE' && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-5 overflow-y-auto">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-1">
                <span className="text-teal-400 font-mono text-xs uppercase tracking-widest block font-bold">SELECT YOUR HARDWARE HERO</span>
                <h2 className="text-3xl sm:text-4xl font-mono font-black text-white uppercase tracking-tight">
                  TAPEOUT <span className="text-teal-400">ODYSSEY PHASE 2</span>
                </h2>
              </motion.div>

              {/* 3 Hero Class Cards */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-2xl">
                <button
                  onClick={() => setSelectedHero('BIT')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedHero === 'BIT' ? 'bg-teal-500/20 border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold text-teal-400 font-mono">🏃 BIT THE HERO</div>
                  <div className="text-[10px] text-slate-300 font-mono mt-1">RTL Design Master</div>
                  <div className="text-[9px] text-amber-300 font-mono mt-2">SPECIAL: Overclock Dash</div>
                </button>

                <button
                  onClick={() => setSelectedHero('NORA')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedHero === 'NORA' ? 'bg-pink-500/20 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold text-pink-400 font-mono">🧙‍♀️ NORA THE WIZARD</div>
                  <div className="text-[10px] text-slate-300 font-mono mt-1">STA Timing Analyst</div>
                  <div className="text-[9px] text-amber-300 font-mono mt-2">SPECIAL: Chronos Time Warp</div>
                </button>

                <button
                  onClick={() => setSelectedHero('KAEL')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedHero === 'KAEL' ? 'bg-purple-500/20 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold text-purple-400 font-mono">🥷 KAEL THE NINJA</div>
                  <div className="text-[10px] text-slate-300 font-mono mt-1">UVM Verification Hunter</div>
                  <div className="text-[9px] text-amber-300 font-mono mt-2">SPECIAL: Triple Laser Barrage</div>
                </button>
              </div>

              <button
                onClick={startGame}
                className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-pink-500 text-white font-mono text-xs font-black rounded-2xl shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:scale-105 transition-all flex items-center gap-2 uppercase cursor-pointer"
              >
                <Play size={18} fill="currentColor" /> LAUNCH MISSION WITH {selectedHero}
              </button>
            </div>
          )}

          {/* Transistor Power-Up Shop Modal */}
          {gameState === 'SHOP' && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="space-y-1">
                <span className="text-amber-400 font-mono text-xs font-bold uppercase">HARDWARE UPGRADE LAB</span>
                <h3 className="text-2xl font-mono font-black text-white uppercase">SPEND TRANSISTOR GEMS (💎 {transistors})</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full max-w-xl text-left">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center font-mono text-xs text-white font-bold">
                    <span>🚀 ROCKET BOOTS</span>
                    <span className="text-cyan-400">200 💎</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">Unlocks Permanent Triple Jump Ability.</p>
                  <button
                    disabled={upgrades.boots || transistors < 200}
                    onClick={() => buyUpgrade('boots', 200)}
                    className="w-full py-1.5 bg-teal-500/20 border border-teal-500/40 text-teal-300 font-mono text-[10px] font-bold rounded uppercase disabled:opacity-40 cursor-pointer"
                  >
                    {upgrades.boots ? 'OWNED ✓' : 'PURCHASE BOOTS'}
                  </button>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center font-mono text-xs text-white font-bold">
                    <span>🧲 COIN MAGNET</span>
                    <span className="text-cyan-400">350 💎</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">Pulls transistor coins & stock coins automatically.</p>
                  <button
                    disabled={upgrades.magnet || transistors < 350}
                    onClick={() => buyUpgrade('magnet', 350)}
                    className="w-full py-1.5 bg-teal-500/20 border border-teal-500/40 text-teal-300 font-mono text-[10px] font-bold rounded uppercase disabled:opacity-40 cursor-pointer"
                  >
                    {upgrades.magnet ? 'OWNED ✓' : 'PURCHASE MAGNET'}
                  </button>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center font-mono text-xs text-white font-bold">
                    <span>🛡️ GAAFET ARMOR</span>
                    <span className="text-cyan-400">500 💎</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">Start every run with +2 Extra Hearts (5 Total Lives).</p>
                  <button
                    disabled={upgrades.armor || transistors < 500}
                    onClick={() => buyUpgrade('armor', 500)}
                    className="w-full py-1.5 bg-teal-500/20 border border-teal-500/40 text-teal-300 font-mono text-[10px] font-bold rounded uppercase disabled:opacity-40 cursor-pointer"
                  >
                    {upgrades.armor ? 'OWNED ✓' : 'PURCHASE ARMOR'}
                  </button>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center font-mono text-xs text-white font-bold">
                    <span>⚡ 5GHZ MULTIPLIER</span>
                    <span className="text-cyan-400">600 💎</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">Permanent +25% Score Multiplier on all score gains.</p>
                  <button
                    disabled={upgrades.multiplier || transistors < 600}
                    onClick={() => buyUpgrade('multiplier', 600)}
                    className="w-full py-1.5 bg-teal-500/20 border border-teal-500/40 text-teal-300 font-mono text-[10px] font-bold rounded uppercase disabled:opacity-40 cursor-pointer"
                  >
                    {upgrades.multiplier ? 'OWNED ✓' : 'PURCHASE MULTIPLIER'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setGameState('IDLE')}
                className="px-6 py-2 bg-slate-800 text-white font-mono text-xs font-bold rounded-xl hover:bg-slate-700 transition-all uppercase cursor-pointer"
              >
                RETURN TO MISSION SELECT
              </button>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameState === 'GAMEOVER' && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-1">
                <span className="text-rose-500 font-mono text-xs font-bold uppercase tracking-widest">TIMING VIOLATION!</span>
                <h2 className="text-3xl font-mono font-black text-white uppercase tracking-tight">
                  SETUP SLACK <span className="text-rose-500">EXCEEDED</span>
                </h2>
                <p className="text-slate-400 font-mono text-xs">
                  Final Score: <span className="text-teal-400 font-bold">{score} Pts</span> • Transistors: <span className="text-cyan-400 font-bold">💎 {transistors}</span>
                </p>
                {score > 0 && (
                  <p className="text-emerald-400 font-mono text-xs font-bold pt-1">
                    ⚡ +{Math.floor(score / 5)} CAREER XP AWARDED!
                  </p>
                )}
              </motion.div>

              <button
                onClick={startGame}
                className="px-6 py-2.5 bg-teal-500 text-slate-950 font-mono text-xs font-black rounded-xl hover:bg-teal-400 transition-all flex items-center gap-2 uppercase cursor-pointer"
              >
                <RotateCcw size={16} /> RETRY MISSION
              </button>
            </div>
          )}
        </div>

        {/* Touch Controls Footer */}
        <div className="p-4 bg-[#0F172A] border-t border-slate-800 flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={triggerJump}
              className="px-5 py-2.5 bg-teal-500/20 border border-teal-500/40 text-teal-300 font-mono text-xs font-bold rounded-xl active:bg-teal-500 active:text-slate-950 transition-all uppercase cursor-pointer"
            >
              ⬆ JUMP
            </button>
            <button
              onClick={triggerSlide}
              className="px-5 py-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold rounded-xl active:bg-amber-500 active:text-slate-950 transition-all uppercase cursor-pointer"
            >
              ⬇ SLIDE
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={triggerSpecial}
              disabled={specialCooldown > 0}
              className="px-5 py-2.5 bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold rounded-xl active:bg-purple-500 active:text-slate-950 transition-all uppercase cursor-pointer disabled:opacity-50"
            >
              ⚡ ABILITY (E) {specialCooldown > 0 ? `(${specialCooldown}s)` : 'READY'}
            </button>
            <button
              onClick={triggerPulse}
              className="px-6 py-2.5 bg-pink-500/20 border border-pink-500/40 text-pink-300 font-mono text-xs font-bold rounded-xl active:bg-pink-500 active:text-slate-950 transition-all uppercase cursor-pointer"
            >
              🎯 LASER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
