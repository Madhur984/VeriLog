import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, RotateCcw, Volume2, VolumeX, ShoppingBag, Shield, Zap, Sparkles, Award, Tv, Flame, Radio, UserCheck, Palette, Target, Cpu } from 'lucide-react';

interface SiliconRunner2DProps {
  onClose?: () => void;
  onAwardXP?: (amount: number) => void;
}

export type HeroClass = 'BIT' | 'NORA' | 'KAEL';

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export const SiliconRunner2D: React.FC<SiliconRunner2DProps> = ({ onClose, onAwardXP }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'BOSS_QTE' | 'GAMEOVER' | 'VICTORY' | 'SHOP'>('IDLE');
  const [selectedHero, setSelectedHero] = useState<HeroClass>('BIT');
  const [visorColor, setVisorColor] = useState<string>('#38BDF8'); // Custom LED Visor Color
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('silicon_runner_highscore') || '0', 10);
  });
  const [lives, setLives] = useState(3);
  const [world, setWorld] = useState(1);
  const [transistors, setTransistors] = useState(() => {
    return parseInt(localStorage.getItem('silicon_runner_transistors') || '0', 10);
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [crtEffect, setCrtEffect] = useState(true);
  const [specialCooldown, setSpecialCooldown] = useState(0);
  const [specialActive, setSpecialActive] = useState(false);

  // Boss QTE State
  const [qteGate, setQteGate] = useState<'AND' | 'NAND' | 'XOR'>('AND');
  const [qteTimer, setQteTimer] = useState(100);

  // Persistent Upgrades
  const [upgrades, setUpgrades] = useState(() => {
    try {
      const saved = localStorage.getItem('silicon_runner_upgrades');
      return saved ? JSON.parse(saved) : { boots: false, magnet: false, armor: false, multiplier: false };
    } catch {
      return { boots: false, magnet: false, armor: false, multiplier: false };
    }
  });

  const saveUpgrades = (newUpgrades: any, newTransistors: number) => {
    setUpgrades(newUpgrades);
    setTransistors(newTransistors);
    localStorage.setItem('silicon_runner_upgrades', JSON.stringify(newUpgrades));
    localStorage.setItem('silicon_runner_transistors', newTransistors.toString());
  };

  // Audio Context Ref & BGM Sequencer Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bgmIntervalRef = useRef<any>(null);

  // 8-Bit Chiptune Sound Synth & Background BGM Generator
  const playSynthSound = (type: 'jump' | 'coin' | 'laser' | 'hit' | 'win' | 'boss' | 'special' | 'combo' | 'qte') => {
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
        osc.frequency.setValueAtTime(170, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.15);
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
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'special') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(900, now + 0.35);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'combo') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.06);
        osc.frequency.setValueAtTime(783.99, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'qte') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(20, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'win') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        osc.frequency.setValueAtTime(1046.50, now + 0.3);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch {
      // Audio context fallback
    }
  };

  // 8-Bit Procedural BGM Sequencer Loop
  useEffect(() => {
    if (gameState !== 'PLAYING' || !soundEnabled) {
      if (bgmIntervalRef.current) clearInterval(bgmIntervalRef.current);
      return;
    }

    const notes = [220, 261.63, 293.66, 329.63, 392, 440, 523.25];
    let noteIdx = 0;

    bgmIntervalRef.current = setInterval(() => {
      try {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const freq = notes[noteIdx % notes.length];
        noteIdx++;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.025, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } catch {
        // Fallback
      }
    }, 220);

    return () => {
      if (bgmIntervalRef.current) clearInterval(bgmIntervalRef.current);
    };
  }, [gameState, soundEnabled]);

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
    let currentCombo = 1;
    let lastHitTime = Date.now();
    let currentTransistors = transistors;
    let currentWorld = 1;
    let timeSlowActiveTimer = 0;
    let specialCdTimer = 0;
    let shakeTimer = 0;

    setLives(currentLives);

    // Player Physics & Rendering
    const player = {
      x: 90,
      y: 255,
      width: 32,
      height: 44,
      vy: 0,
      gravity: 0.7,
      jumpForce: selectedHero === 'NORA' ? -14.5 : -13,
      isGrounded: true,
      isSliding: false,
      jumpsRemaining: upgrades.boots ? 3 : 2,
      legAnim: 0,
    };

    const groundY = 300;

    // Visual FX Containers
    let particles: Particle[] = [];
    let floatingTexts: FloatingText[] = [];

    const spawnParticles = (x: number, y: number, color: string, count = 8) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6 - 2,
          color,
          size: Math.random() * 4 + 2,
          life: 0,
          maxLife: 20 + Math.random() * 15,
        });
      }
    };

    const addFloatingText = (x: number, y: number, text: string, color: string) => {
      floatingTexts.push({
        id: Math.random(),
        x,
        y,
        text,
        color,
        life: 40,
      });
    };

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
      width: 75,
      height: 95,
      hp: 100,
      maxHp: 100,
      attackTimer: 0,
    };

    interface Obstacle {
      x: number;
      y: number;
      width: number;
      height: number;
      type: 'SPIKE' | 'BUG' | 'RAIL' | 'TRANSISTOR' | 'NVIDIA_COIN' | 'STAR' | 'BOSS_BEAM' | 'DRONE';
      speed: number;
      baseY?: number;
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
      const types: Obstacle['type'][] = ['SPIKE', 'BUG', 'RAIL', 'TRANSISTOR', 'NVIDIA_COIN', 'STAR', 'DRONE'];
      const rand = Math.random();
      let type: Obstacle['type'] = 'SPIKE';

      if (rand < 0.25) type = 'BUG';
      else if (rand < 0.45) type = 'SPIKE';
      else if (rand < 0.6) type = 'RAIL';
      else if (rand < 0.75) type = 'DRONE';
      else if (rand < 0.88) type = 'TRANSISTOR';
      else if (rand < 0.96) type = 'NVIDIA_COIN';
      else type = 'STAR';

      let y = groundY - 34;
      let width = 30;
      let height = 34;

      if (type === 'RAIL') {
        y = groundY - 70;
        width = 48;
        height = 18;
      } else if (type === 'DRONE') {
        y = groundY - (60 + Math.random() * 50);
        width = 32;
        height = 24;
      } else if (type === 'TRANSISTOR' || type === 'NVIDIA_COIN' || type === 'STAR') {
        y = groundY - (45 + Math.random() * 65);
        width = 22;
        height = 22;
      }

      obstacles.push({
        x: canvas.width + 20,
        y,
        baseY: y,
        width,
        height,
        type,
        speed: (4.8 + Math.min(currentScore / 900, 4)) * (timeSlowActiveTimer > 0 ? 0.35 : 1),
      });
    };

    const loop = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      if (shakeTimer > 0) {
        shakeTimer--;
        const dx = (Math.random() - 0.5) * 8;
        const dy = (Math.random() - 0.5) * 8;
        ctx.translate(dx, dy);
      }

      if (Date.now() - lastHitTime > 2500 && currentCombo > 1) {
        currentCombo = 1;
        setCombo(1);
      }

      if (specialCdTimer > 0) {
        specialCdTimer--;
        setSpecialCooldown(Math.ceil(specialCdTimer / 60));
      }
      if (timeSlowActiveTimer > 0) {
        timeSlowActiveTimer--;
        if (timeSlowActiveTimer === 0) setSpecialActive(false);
      }

      // Parallax Background
      const bgGradients = [
        ['#090D16', '#0F172A', '#1E293B'],
        ['#0D0714', '#1E1B4B', '#31103F'],
        ['#021318', '#042F2E', '#115E59'],
        ['#141103', '#422006', '#713F12'],
      ];
      const curGrad = bgGradients[(currentWorld - 1) % 4];

      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, curGrad[0]);
      grad.addColorStop(0.5, curGrad[1]);
      grad.addColorStop(1, curGrad[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Layer 1: Steppers
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      const p1 = (frameCount * 0.4) % canvas.width;
      for (let x = -p1; x < canvas.width; x += 180) {
        ctx.fillRect(x, 70, 50, 140);
        ctx.fillRect(x + 10, 50, 30, 20);
      }

      // Layer 2: Neon Circuits
      ctx.strokeStyle = timeSlowActiveTimer > 0 ? 'rgba(56, 189, 248, 0.35)' : 'rgba(20, 184, 166, 0.12)';
      ctx.lineWidth = 1.5;
      const p2 = (frameCount * 2.2) % 40;
      for (let x = -p2; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Ground Line & Stripes
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      ctx.fillStyle = timeSlowActiveTimer > 0 ? '#38BDF8' : '#14B8A6';
      ctx.fillRect(0, groundY, canvas.width, 3.5);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      const groundStripeOffset = (frameCount * 5) % 20;
      for (let x = -groundStripeOffset; x < canvas.width; x += 20) {
        ctx.fillRect(x, groundY + 3, 10, canvas.height - groundY);
      }

      // Special Ability Trigger
      if (keysRef.current.special && specialCdTimer === 0) {
        specialCdTimer = 360;
        playSynthSound('special');
        shakeTimer = 8;

        if (selectedHero === 'BIT') {
          currentScore += 200;
          setScore(currentScore);
          spawnParticles(player.x, player.y + 20, '#14B8A6', 25);
          addFloatingText(player.x, player.y - 20, '⚡ OVERCLOCK DASH! +200', '#14B8A6');
        } else if (selectedHero === 'NORA') {
          timeSlowActiveTimer = 300;
          setSpecialActive(true);
          spawnParticles(player.x, player.y + 20, '#EC4899', 25);
          addFloatingText(player.x, player.y - 20, '⏳ TIME WARP ACTIVATED!', '#EC4899');
        } else if (selectedHero === 'KAEL') {
          bullets.push({ x: player.x + player.width, y: player.y + 10, speed: 11, vy: -2.5 });
          bullets.push({ x: player.x + player.width, y: player.y + 18, speed: 11, vy: 0 });
          bullets.push({ x: player.x + player.width, y: player.y + 26, speed: 11, vy: 2.5 });
          spawnParticles(player.x + 30, player.y + 20, '#A855F7', 15);
          addFloatingText(player.x, player.y - 20, '🎯 TRIPLE LOGIC BARRAGE!', '#A855F7');
        }
        keysRef.current.special = false;
      }

      // Player Physics
      if (keysRef.current.jump) {
        if (player.isGrounded) {
          player.vy = player.jumpForce;
          player.isGrounded = false;
          player.jumpsRemaining = (upgrades.boots ? 3 : 2) - 1;
          playSynthSound('jump');
          spawnParticles(player.x + 10, player.y + player.height, '#14B8A6', 8);
          keysRef.current.jump = false;
        } else if (player.jumpsRemaining > 0) {
          player.vy = player.jumpForce * 0.85;
          player.jumpsRemaining--;
          playSynthSound('jump');
          spawnParticles(player.x + 10, player.y + player.height, '#38BDF8', 10);
          keysRef.current.jump = false;
        }
      }

      player.isSliding = keysRef.current.slide && player.isGrounded;
      player.height = player.isSliding ? 22 : 44;

      player.vy += player.gravity;
      player.y += player.vy;

      if (player.y + player.height >= groundY) {
        player.y = groundY - player.height;
        player.vy = 0;
        player.isGrounded = true;
      }

      // Pulse Attack
      if (keysRef.current.pulse && frameCount - lastBulletFrame > 14) {
        bullets.push({
          x: player.x + player.width,
          y: player.y + (player.isSliding ? 10 : 20),
          speed: 10,
        });
        playSynthSound('laser');
        lastBulletFrame = frameCount;
      }

      // Character Designer Rendering
      ctx.save();
      const heroColors = { BIT: '#14B8A6', NORA: '#EC4899', KAEL: '#A855F7' };
      const mainColor = heroColors[selectedHero];

      if (frameCount % 4 === 0) {
        spawnParticles(player.x - 4, player.y + (player.isSliding ? 12 : 24), mainColor, 1);
      }

      ctx.fillStyle = mainColor;
      ctx.fillRect(player.x, player.y, player.width, player.height);

      ctx.fillStyle = '#090D16';
      ctx.fillRect(player.x + 4, player.y + (player.isSliding ? 8 : 16), player.width - 8, player.isSliding ? 10 : 18);

      // Custom Visor Color Rendering
      ctx.fillStyle = visorColor;
      ctx.shadowColor = visorColor;
      ctx.shadowBlur = 10;
      ctx.fillRect(player.x + 18, player.y + (player.isSliding ? 4 : 8), 12, 8);
      ctx.shadowBlur = 0;

      // Scarf & Legs
      ctx.fillStyle = mainColor;
      const scarfWave = Math.sin(frameCount * 0.2) * 4;
      ctx.beginPath();
      ctx.moveTo(player.x, player.y + 12);
      ctx.lineTo(player.x - 14, player.y + 16 + scarfWave);
      ctx.lineTo(player.x, player.y + 20);
      ctx.closePath();
      ctx.fill();

      if (player.isGrounded && !player.isSliding) {
        player.legAnim = (player.legAnim + 0.3) % (Math.PI * 2);
        const legOffset = Math.sin(player.legAnim) * 6;
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(player.x + 6, player.y + player.height - 8, 6, 8 + legOffset);
        ctx.fillRect(player.x + 18, player.y + player.height - 8, 6, 8 - legOffset);
      }

      ctx.restore();

      // Boss Logic & Spawning
      if (currentScore > 1000 && !boss.active && Math.random() < 0.005) {
        boss.active = true;
        boss.x = canvas.width - 100;
        boss.hp = 100;
        playSynthSound('boss');
        shakeTimer = 10;
        addFloatingText(canvas.width / 2 - 50, 100, '⚠️ BOSS APPROACHING!', '#EF4444');
      }

      if (boss.active) {
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(canvas.width / 2 - 110, 15, 220, 16);
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(canvas.width / 2 - 110, 15, (boss.hp / boss.maxHp) * 220, 16);
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(canvas.width / 2 - 110, 15, 220, 16);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`👹 ${boss.name.toUpperCase()}`, canvas.width / 2 - 70, 27);

        ctx.fillStyle = '#DC2626';
        ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
        ctx.fillStyle = '#FEF08A';
        ctx.fillRect(boss.x + 12, boss.y + 18, 14, 14);
        ctx.fillRect(boss.x + 48, boss.y + 18, 14, 14);

        boss.attackTimer++;
        if (boss.attackTimer % 110 === 0) {
          obstacles.push({
            x: boss.x - 40,
            y: groundY - 32,
            width: 45,
            height: 28,
            type: 'BOSS_BEAM',
            speed: 6.5,
          });
        }
      }

      // Bullets Logic
      bullets.forEach((b, bIdx) => {
        b.x += b.speed;
        if (b.vy) b.y += b.vy;

        ctx.fillStyle = visorColor;
        ctx.shadowColor = visorColor;
        ctx.shadowBlur = 8;
        ctx.fillRect(b.x, b.y, 12, 5);
        ctx.shadowBlur = 0;

        // Hit Boss -> Triggers Boss QTE Finisher!
        if (boss.active && b.x >= boss.x && b.x <= boss.x + boss.width && b.y >= boss.y && b.y <= boss.y + boss.height) {
          boss.hp -= 15;
          bullets.splice(bIdx, 1);
          spawnParticles(b.x, b.y, '#EF4444', 12);
          playSynthSound('coin');

          if (boss.hp <= 0) {
            boss.active = false;
            setGameState('BOSS_QTE');
            setQteGate(Math.random() < 0.5 ? 'AND' : 'NAND');
            playSynthSound('qte');
          }
        }

        // Hit Bug or Drone
        obstacles.forEach((o, oIdx) => {
          if ((o.type === 'BUG' || o.type === 'DRONE') && b.x >= o.x && b.x <= o.x + o.width && b.y >= o.y && b.y <= o.y + o.height) {
            obstacles.splice(oIdx, 1);
            bullets.splice(bIdx, 1);
            spawnParticles(o.x + 15, o.y + 15, o.type === 'DRONE' ? '#38BDF8' : '#A855F7', 15);

            lastHitTime = Date.now();
            currentCombo++;
            setCombo(currentCombo);

            const pts = Math.floor(70 * currentCombo * (upgrades.multiplier ? 1.25 : 1));
            currentScore += pts;
            setScore(currentScore);

            playSynthSound(currentCombo > 2 ? 'combo' : 'coin');
            addFloatingText(o.x, o.y, `+${pts} (${currentCombo}X COMBO!)`, '#A855F7');
          }
        });
      });

      bullets = bullets.filter((b) => b.x < canvas.width);

      // Spawn & Render Obstacles
      if (frameCount - lastSpawnFrame > Math.max(38, 80 - Math.floor(currentScore / 200))) {
        spawnObstacle();
        lastSpawnFrame = frameCount;
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.x -= o.speed;

        // Drone Vertical Hover Motion
        if (o.type === 'DRONE' && o.baseY) {
          o.y = o.baseY + Math.sin(frameCount * 0.08) * 20;
        }

        if (upgrades.magnet && (o.type === 'TRANSISTOR' || o.type === 'NVIDIA_COIN')) {
          if (o.x - player.x < 160 && o.x > player.x) {
            o.x -= 3.5;
            if (o.y < player.y) o.y += 2.5;
            else if (o.y > player.y) o.y -= 2.5;
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
          ctx.fillRect(o.x + 5, o.y + 6, 5, 5);
          ctx.fillRect(o.x + 18, o.y + 6, 5, 5);
        } else if (o.type === 'DRONE') {
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(o.x, o.y, o.width, o.height);
          ctx.fillStyle = '#FEF08A';
          ctx.fillRect(o.x + 10, o.y + 6, 12, 6);
        } else if (o.type === 'RAIL' || o.type === 'BOSS_BEAM') {
          ctx.fillStyle = o.type === 'BOSS_BEAM' ? '#F43F5E' : '#F59E0B';
          ctx.fillRect(o.x, o.y, o.width, o.height);
        } else if (o.type === 'TRANSISTOR') {
          ctx.fillStyle = '#38BDF8';
          ctx.shadowColor = '#38BDF8';
          ctx.shadowBlur = 8;
          ctx.fillRect(o.x + 4, o.y + 4, 14, 14);
          ctx.shadowBlur = 0;
        } else if (o.type === 'NVIDIA_COIN') {
          ctx.fillStyle = '#22C55E';
          ctx.shadowColor = '#22C55E';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(o.x + 11, o.y + 11, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (o.type === 'STAR') {
          ctx.fillStyle = '#EC4899';
          ctx.shadowColor = '#EC4899';
          ctx.shadowBlur = 10;
          ctx.fillRect(o.x, o.y, 18, 18);
          ctx.shadowBlur = 0;
        }

        // Collisions
        if (
          player.x < o.x + o.width &&
          player.x + player.width > o.x &&
          player.y < o.y + o.height &&
          player.y + player.height > o.y
        ) {
          if (o.type === 'TRANSISTOR') {
            lastHitTime = Date.now();
            currentCombo++;
            setCombo(currentCombo);

            const gain = selectedHero === 'KAEL' ? 30 : 20;
            const pts = Math.floor(gain * currentCombo * (upgrades.multiplier ? 1.25 : 1));
            currentScore += pts;
            currentTransistors += 1;
            setScore(currentScore);
            saveUpgrades(upgrades, currentTransistors);

            spawnParticles(o.x, o.y, '#38BDF8', 10);
            playSynthSound('coin');
            addFloatingText(o.x, o.y, `💎 +${pts}`, '#38BDF8');
            obstacles.splice(i, 1);
          } else if (o.type === 'NVIDIA_COIN') {
            lastHitTime = Date.now();
            currentCombo++;
            setCombo(currentCombo);

            const pts = Math.floor(120 * currentCombo * (upgrades.multiplier ? 1.25 : 1));
            currentScore += pts;
            setScore(currentScore);

            spawnParticles(o.x, o.y, '#22C55E', 12);
            playSynthSound('coin');
            addFloatingText(o.x, o.y, `💰 +${pts}`, '#22C55E');
            obstacles.splice(i, 1);
          } else if (o.type === 'STAR') {
            currentScore += 250;
            setScore(currentScore);
            spawnParticles(o.x, o.y, '#EC4899', 15);
            playSynthSound('win');
            addFloatingText(o.x, o.y, '⭐ STAR POWER! +250', '#EC4899');
            obstacles.splice(i, 1);
          } else {
            currentLives -= 1;
            setLives(currentLives);
            shakeTimer = 12;
            spawnParticles(player.x + 15, player.y + 15, '#EF4444', 20);
            playSynthSound('hit');
            if (navigator.vibrate) navigator.vibrate([60]);
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

      particles.forEach((p, pIdx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        if (p.life >= p.maxLife) particles.splice(pIdx, 1);
      });

      floatingTexts.forEach((ft, ftIdx) => {
        ft.y -= 1.2;
        ft.life--;
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 12px monospace';
        ctx.fillText(ft.text, ft.x, ft.y);
        if (ft.life <= 0) floatingTexts.splice(ftIdx, 1);
      });

      ctx.restore();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, selectedHero, upgrades, visorColor]);

  const startGame = () => {
    setScore(0);
    setCombo(1);
    setLives(upgrades.armor ? 5 : 3);
    setWorld(1);
    setGameState('PLAYING');
  };

  const handleBossQteSuccess = () => {
    playSynthSound('win');
    const newTransistors = transistors + 150;
    const newScore = score + 1000;
    setScore(newScore);
    saveUpgrades(upgrades, newTransistors);
    setGameState('PLAYING');

    // Dispatch Quest Telemetry Event for Portal System
    window.dispatchEvent(
      new CustomEvent('silicon_runner_quest_complete', {
        detail: { badge: 'Sub-2nm Tapeout Pioneer', bonusXP: 500 },
      })
    );
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
        {/* CRT Scanline FX */}
        {crtEffect && (
          <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />
        )}

        {/* Top Header Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-6 py-3.5 bg-[#0F172A] border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl animate-pulse">🎮</span>
            <div>
              <h3 className="font-mono font-black text-white text-base sm:text-lg tracking-tight uppercase flex items-center gap-2">
                SILICON RUNNER <span className="text-teal-400">2D ARCADE</span>
                {combo > 1 && (
                  <span className="text-[10px] bg-pink-500/20 border border-pink-500/50 text-pink-400 px-2 py-0.5 rounded-full font-bold animate-bounce">
                    🔥 {combo}X STREAK
                  </span>
                )}
              </h3>
              <p className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                WORLD {world}: {world === 1 ? 'DIGITAL LOGIC' : world === 2 ? 'VERILOG CITY' : world === 3 ? '2NM CLEANROOM' : 'FANG VAULT 💰'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            <button
              onClick={() => setCrtEffect(!crtEffect)}
              className={`p-2 rounded-lg font-mono text-xs transition-all cursor-pointer ${crtEffect ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40' : 'bg-slate-800 text-slate-400'}`}
              title="Toggle Retro CRT Scanline Overlay"
            >
              <Tv size={16} />
            </button>
            <button
              onClick={() => setGameState('SHOP')}
              className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 hover:scale-105 transition-all cursor-pointer"
            >
              <ShoppingBag size={14} /> SHOP (💎 {transistors})
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/50 transition-all cursor-pointer"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            {onClose && (
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-400 rounded-lg bg-slate-800/50 transition-all cursor-pointer">
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-3 sm:px-6 py-2 bg-[#020617] border-b border-slate-800 font-mono text-xs relative z-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-6">
            <span className="text-teal-400 font-bold">SCORE: <span className="text-white">{score}</span></span>
            <span className="text-amber-400 font-bold">HIGH: <span className="text-white">{highScore}</span></span>
            <span className="text-cyan-400 font-bold">TRANSISTORS: <span className="text-white">💎 {transistors}</span></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[10px] uppercase">HP:</span>
            {Array.from({ length: upgrades.armor ? 5 : 3 }).map((_, i) => (
              <span key={i} className={`text-base ${i < lives ? 'text-rose-500 animate-pulse' : 'text-slate-700'}`}>
                ❤
              </span>
            ))}
          </div>
        </div>

        {/* Canvas Viewport */}
        <div className="relative w-full aspect-[2/1] bg-[#090D16] overflow-hidden">
          <canvas ref={canvasRef} width={800} height={400} className="w-full h-full block" />

          {/* Hero Class Selection & Custom Visor Color Picker */}
          {gameState === 'IDLE' && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-4 overflow-y-auto z-20">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-1">
                <span className="text-teal-400 font-mono text-xs uppercase tracking-widest block font-bold">SELECT HARDWARE HERO & LED VISOR AURA</span>
                <h2 className="text-2xl sm:text-4xl font-mono font-black text-white uppercase tracking-tight">
                  TAPEOUT <span className="text-teal-400">ODYSSEY DESIGNER</span>
                </h2>
              </motion.div>

              {/* 3 Hero Class Cards */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-2xl">
                <button
                  onClick={() => setSelectedHero('BIT')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedHero === 'BIT' ? 'bg-teal-500/20 border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)] scale-102' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold text-teal-400 font-mono flex items-center justify-between">
                    <span>🏃 BIT THE HERO</span>
                    {selectedHero === 'BIT' && <UserCheck size={14} />}
                  </div>
                  <div className="text-[10px] text-slate-300 font-mono mt-1">RTL Design Architect</div>
                  <div className="text-[9px] text-amber-300 font-mono mt-2 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    SPECIAL: Overclock Dash (E)
                  </div>
                </button>

                <button
                  onClick={() => setSelectedHero('NORA')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedHero === 'NORA' ? 'bg-pink-500/20 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.3)] scale-102' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold text-pink-400 font-mono flex items-center justify-between">
                    <span>🧙‍♀️ NORA THE WIZARD</span>
                    {selectedHero === 'NORA' && <UserCheck size={14} />}
                  </div>
                  <div className="text-[10px] text-slate-300 font-mono mt-1">STA Timing Analyst</div>
                  <div className="text-[9px] text-amber-300 font-mono mt-2 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    SPECIAL: Chronos Time Warp (E)
                  </div>
                </button>

                <button
                  onClick={() => setSelectedHero('KAEL')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedHero === 'KAEL' ? 'bg-purple-500/20 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-102' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold text-purple-400 font-mono flex items-center justify-between">
                    <span>🥷 KAEL THE NINJA</span>
                    {selectedHero === 'KAEL' && <UserCheck size={14} />}
                  </div>
                  <div className="text-[10px] text-slate-300 font-mono mt-1">UVM Verification Hunter</div>
                  <div className="text-[9px] text-amber-300 font-mono mt-2 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    SPECIAL: Triple Pulse Barrage (E)
                  </div>
                </button>
              </div>

              {/* Visor LED Color Selector */}
              <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
                  <Palette size={14} /> VISOR LED COLOR:
                </span>
                {['#38BDF8', '#EC4899', '#F59E0B', '#10B981'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setVisorColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${visorColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70'}`}
                  />
                ))}
              </div>

              <button
                onClick={startGame}
                className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-pink-500 text-white font-mono text-xs font-black rounded-2xl shadow-[0_0_25px_rgba(20,184,166,0.4)] hover:scale-105 transition-all flex items-center gap-2 uppercase cursor-pointer"
              >
                <Play size={18} fill="currentColor" /> LAUNCH TAPEOUT RUN WITH {selectedHero}
              </button>
            </div>
          )}

          {/* Boss QTE Quick-Time Event Overlay Modal */}
          {gameState === 'BOSS_QTE' && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-4 z-30">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-2">
                <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-widest animate-pulse">
                  ⚡ CRITICAL TAPEOUT FINISHER!
                </span>
                <h2 className="text-3xl font-mono font-black text-white uppercase">
                  EXECUTE <span className="text-teal-400">{qteGate} LOGIC GATE</span>
                </h2>
                <p className="text-slate-400 font-mono text-xs">
                  Press the matching Logic Gate trigger before the timer expires for +1,000 Bonus Pts & 3x Transistors!
                </p>
              </motion.div>

              <div className="flex gap-4">
                <button
                  onClick={handleBossQteSuccess}
                  className="px-6 py-3 bg-teal-500 text-slate-950 font-mono text-xs font-black rounded-xl hover:scale-105 transition-all uppercase cursor-pointer shadow-[0_0_20px_rgba(20,184,166,0.5)]"
                >
                  ⚡ EXECUTE {qteGate} GATE
                </button>
              </div>
            </div>
          )}

          {/* Transistor Power-Up Shop Modal */}
          {gameState === 'SHOP' && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-4 z-20">
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

          {/* Game Over Screen */}
          {gameState === 'GAMEOVER' && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-4 z-20">
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

        {/* Touch & Action Footer */}
        <div className="p-3.5 bg-[#0F172A] border-t border-slate-800 flex items-center justify-between gap-2 relative z-10">
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
              🎯 LASER (F)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
