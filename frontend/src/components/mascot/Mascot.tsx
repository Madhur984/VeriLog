import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { X, Compass } from 'lucide-react';
import { getMascotLines } from './mascotLines';
import { useTour } from '../tour/TourProvider';
import { useColorScheme } from '../../hooks/useColorScheme';
import { SparkleCanvas } from './SparkleCanvas';

/**
 * "Byte" - a route-aware talking spider mascot that DANGLES from a silk web
 * strand in the top-right corner and ALSO gives the guided tour (it replaces the
 * old floating compass launcher). Duolingo's Duo / Clash builder vibe.
 *
 * - Hangs from a glowing web strand anchored to the top of the screen and swings
 *   as a pendulum (pivot at the ceiling anchor).
 * - Idle: gentle swing + periodic blink (swaps to a blink PNG).
 * - Talking: scales up + a typewriter speech bubble (left side), cycling short
 *   page-specific lines (tap to advance). Swing dampens for readability.
 * - Tour: a glowing "Take the tour" badge hangs under Byte on any page that has
 *   a tour. Tapping it starts/replays the full guided tour (the overlay then
 *   explains everything step by step). During the tour Byte cheers + points.
 * - Greets once per page, then quiet. X hides it forever (localStorage).
 */

const OPEN = '/mascot/spider-open.png';
const BLINK = '/mascot/spider-blink.png';
const HIDE_KEY = 'bfb_mascot_hidden';
const GREET_PREFIX = 'bfb_mascot_greeted_';

const TOUR_CHEERS = ['This way! 👇', 'Check this out!', 'See that? ✨', 'Follow me!', 'Almost there!', 'You got this!'];

function lsGet(k: string) { try { return localStorage.getItem(k); } catch { return null; } }
function lsSet(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* ignore */ } }

// Helper for Whisper Mode idle tips
const getRandomTip = (pathname: string) => {
  const tips: Record<string, string[]> = {
    '/module': [
      "Tap the menu (☰) at the top left to quickly skip between sections! 📚",
      "Did you know? All lesson circuits are interactive. Try editing them! 🔬",
      "Nothing here can break. Feel free to tweak values and watch changes! 🧪",
    ],
    '/dsd': [
      "Digital System Design models hardware using Boolean equations! 🛠️",
      "Karnaugh maps help simplify logic without heavy algebra! 🌲",
    ],
    '/boss-arena': [
      "Speed is key! Chain correct answers to multiply your XP gains. 👾",
      "Stuck? Take a deep breath and trace the inputs step by step.",
    ],
    '/workbench': [
      "Drag and drop components to test custom digital ideas! 🔧",
      "Connect pins by clicking and dragging wires between them. 🔌",
    ],
    '/career-roadmap': [
      "Select nodes on the map to explore career roles and median salaries. 🗺️",
      "Top companies are listed for each VLSI specialty domain! 💼",
    ],
    'default': [
      "Tip: Click and drag me down to stretch my silk web thread! 🪀",
      "Double-tap me to watch me do a backflip! 🕷️",
      "Drag me down far enough to make me dizzy! 🌀",
    ]
  };

  const matchedKey = Object.keys(tips).find(k => pathname.startsWith(k));
  const list = tips[matchedKey || 'default'];
  return list[Math.floor(Math.random() * list.length)];
};

// Helper for route-specific accessories
const getAccessory = (pathname: string) => {
  if (pathname.startsWith('/module/') || pathname.startsWith('/dsd/') || pathname.startsWith('/basic-electronics/')) {
    return 'graduation-cap';
  }
  if (pathname.includes('playground') || pathname.includes('workbench') || pathname.includes('studio') || pathname.includes('lab')) {
    return 'welding-goggles';
  }
  if (pathname.includes('boss') || pathname.includes('arena') || pathname.includes('leetcode')) {
    return 'eyepatch';
  }
  return null;
};

export const Mascot: React.FC = () => {
  const location = useLocation();
  const { isActive: tourActive, hasTourForPath, start: startTour, index: tourIndex } = useTour();
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';

  const script = useMemo(() => getMascotLines(location.pathname), [location.pathname]);

  const [hidden, setHidden] = useState<boolean>(() => lsGet(HIDE_KEY) === '1');
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [blinking, setBlinking] = useState(false);
  const [waving, setWaving] = useState(false);
  const [cheerIdx, setCheerIdx] = useState(0);

  // Dynamic Accessories & Interactive States
  const [clickCount, setClickCount] = useState(0);
  const [backflipping, setBackflipping] = useState(false);
  const [dizzy, setDizzy] = useState(false);
  const [scuttleY, setScuttleY] = useState(0);
  const [shockwaveActive, setShockwaveActive] = useState(false);
  const [whisperText, setWhisperText] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseTime = useRef(Date.now());

  // 2D Drag & Wobble Physics Setup
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const strandRef = useRef<HTMLDivElement>(null);
  const [baseHeight, setBaseHeight] = useState(320);

  // Canvas Confetti Sparkles
  const [sparkleTrigger, setSparkleTrigger] = useState(0);
  const triggerSparkles = useCallback(() => setSparkleTrigger(prev => prev + 1), []);

  // Ceiling Spring Drop-down Setup
  const [dropY, setDropY] = useState(-420);
  const [lateralX, setLateralX] = useState(0);
  const springY = useSpring(dropY, { damping: 14, stiffness: 120 });
  const springX = useSpring(lateralX, { damping: 14, stiffness: 120 });

  useEffect(() => {
    if (hidden) return;
    setDropY(0);
    setLateralX(Math.random() * 24 - 12);
    triggerSparkles();
    const timer = setTimeout(() => setLateralX(0), 1200);
    return () => clearTimeout(timer);
  }, [location.pathname, hidden, triggerSparkles]);

  // Click-to-Shoot Web Effect
  const [webTarget, setWebTarget] = useState<{ x: number; y: number } | null>(null);
  const [webStart, setWebStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [splat, setSplat] = useState(false);
  const lastShootTime = useRef(0);

  const shootWeb = useCallback((targetX: number, targetY: number) => {
    if (spiderRef.current) {
      const rect = spiderRef.current.getBoundingClientRect();
      const fromX = rect.left + rect.width / 2;
      const fromY = rect.top + rect.height / 2;
      setWebStart({ x: fromX, y: fromY });
      setWebTarget({ x: targetX, y: targetY });
      
      setTimeout(() => setSplat(true), 220);
      setTimeout(() => {
        setWebTarget(null);
        setSplat(false);
      }, 900);
    }
  }, []);

  useEffect(() => {
    if (hidden || tourActive) return;
    const handleClick = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastShootTime.current < 2000) return; // rate limit

      // Prevent shooting when clicking Mascot or Summon Button
      if (spiderRef.current?.contains(e.target as Node)) return;
      
      if (Math.random() < 0.20) {
        lastShootTime.current = now;
        shootWeb(e.clientX, e.clientY);
      }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [hidden, tourActive, shootWeb]);

  useEffect(() => {
    if (strandRef.current) {
      setBaseHeight(strandRef.current.offsetHeight || 320);
    }
  }, [location.pathname]);

  // Trigonometric strand scaling and rotation based on 2D drag offsets (only active during drag)
  const scaleY = useTransform([dragX, dragY], ([x, y]) => {
    const h = baseHeight;
    const distance = Math.sqrt(Number(x) * Number(x) + (h + Number(y)) * (h + Number(y)));
    return distance / h;
  });

  const strandRotation = useTransform([dragX, dragY], ([x, y]) => {
    if (!isDragging) return '0deg';
    const h = baseHeight;
    const angle = Math.atan2(Number(x), h + Number(y)) * 180 / Math.PI;
    return `${angle}deg`;
  });

  // Cursor tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState(0);
  const spiderRef = useRef<HTMLButtonElement>(null);

  // Handle activity for Whisper Mode
  useEffect(() => {
    if (hidden || tourActive) return;

    const resetIdle = () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      setWhisperText(null);
      
      idleTimeoutRef.current = setTimeout(() => {
        const tip = getRandomTip(location.pathname);
        setWhisperText(tip);
        setTimeout(() => setWhisperText(null), 8000);
      }, 5000);
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('click', resetIdle);
    resetIdle();

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('click', resetIdle);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [location.pathname, hidden, tourActive]);

  useEffect(() => {
    if (hidden || tourActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Startled proximity scuttle
      const now = Date.now();
      const dt = Math.max(1, now - lastMouseTime.current);
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt; // pixels per ms

      if (speed > 0.8 && spiderRef.current) {
        const rect = spiderRef.current.getBoundingClientRect();
        const spiderX = rect.left + rect.width / 2;
        const spiderY = rect.top + rect.height / 2;
        const dist = Math.sqrt(Math.pow(e.clientX - spiderX, 2) + Math.pow(e.clientY - spiderY, 2));

        if (dist < 130) {
          setScuttleY(-45);
          triggerSparkles();
          setTimeout(() => setScuttleY(0), 600);
        }
      }

      lastMousePos.current = { x: e.clientX, y: e.clientY };
      lastMouseTime.current = now;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hidden, tourActive, triggerSparkles]);

  useEffect(() => {
    if (hidden || tourActive || dizzy || waving || backflipping || isDragging) {
      setTilt(0);
      return;
    }
    if (!spiderRef.current) return;
    const rect = spiderRef.current.getBoundingClientRect();
    const spiderX = rect.left + rect.width / 2;
    const spiderY = rect.top + rect.height / 2;

    const dx = mousePos.x - spiderX;
    const dy = mousePos.y - spiderY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 50) {
      setTilt(0);
      return;
    }

    const maxTilt = 12;
    const tiltVal = Math.min(Math.max((dx / window.innerWidth) * 45, -maxTilt), maxTilt);
    setTilt(tiltVal);
  }, [mousePos, hidden, tourActive, dizzy, waving, backflipping, isDragging]);

  const typeTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const greetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hangs from the top-right. Strand length adapts so Byte clears each page's
  // top-right UI; longer overall now so it hangs a little lower.
  const path = location.pathname;
  const isModule = path.startsWith('/module/') || path.startsWith('/dsd/') || path.startsWith('/basic-electronics/');
  const isPortal = path === '/portal';
  const strandClass = isModule
    ? 'h-[80px] sm:h-[240px]'
    : isPortal
      ? 'h-[90px] lg:h-[380px]'
      : 'h-[100px] sm:h-[320px]';

  const fullLine = script.lines[lineIdx] ?? '';
  const talking = bubbleOpen && !tourActive;
  const showTourBadge = hasTourForPath && !tourActive && !talking;
  const accessory = getAccessory(location.pathname);

  /* ---- typewriter for the current line ---- */
  useEffect(() => {
    if (!bubbleOpen || tourActive) return;
    setTyped('');
    let i = 0;
    if (typeTimer.current) clearInterval(typeTimer.current);
    typeTimer.current = setInterval(() => {
      i += 1;
      setTyped(fullLine.slice(0, i));
      if (i >= fullLine.length && typeTimer.current) {
        clearInterval(typeTimer.current);
        typeTimer.current = null;
      }
    }, 24);
    return () => { if (typeTimer.current) clearInterval(typeTimer.current); };
  }, [bubbleOpen, tourActive, lineIdx, fullLine]);

  /* ---- auto-close the bubble a few seconds after a line finishes ---- */
  useEffect(() => {
    if (!bubbleOpen || tourActive) return;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    const ms = 2600 + fullLine.length * 45;
    idleTimer.current = setTimeout(() => setBubbleOpen(false), ms);
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current); };
  }, [bubbleOpen, tourActive, lineIdx, fullLine]);

  /* ---- greet once per page after a short delay (skip while tour runs) ---- */
  useEffect(() => {
    if (hidden) return;
    setBubbleOpen(false);
    setLineIdx(0);
    const key = GREET_PREFIX + script.id;
    if (lsGet(key) === '1') return;
    if (greetTimer.current) clearTimeout(greetTimer.current);
    greetTimer.current = setTimeout(() => {
      if (!tourActive) {
        setWaving(true);
        setBubbleOpen(true);
        lsSet(key, '1');
        setTimeout(() => setWaving(false), 1400);
      }
    }, 1600);
    return () => { if (greetTimer.current) clearTimeout(greetTimer.current); };
  }, [location.pathname, hidden]);

  /* ---- periodic blink ---- */
  useEffect(() => {
    if (hidden) return;
    let alive = true;
    const handle = { current: null as ReturnType<typeof setTimeout> | null };
    const loop = () => {
      const next = 2200 + Math.random() * 3200;
      handle.current = setTimeout(() => {
        if (!alive) return;
        setBlinking(true);
        setTimeout(() => setBlinking(false), 150);
        loop();
      }, next);
    };
    loop();
    return () => { alive = false; if (handle.current) clearTimeout(handle.current); };
  }, [hidden]);

  /* ---- cycle cheer text while the tour runs ---- */
  useEffect(() => {
    if (!tourActive || hidden) return;
    setCheerIdx((c) => (c + 1) % TOUR_CHEERS.length);
    const t = setInterval(() => setCheerIdx((c) => (c + 1) % TOUR_CHEERS.length), 2600);
    return () => clearInterval(t);
  }, [tourActive, tourIndex, hidden]);

  const handleTap = () => {
    if (tourActive) return;
    if (!bubbleOpen) {
      setBubbleOpen(true);
      setWaving(true);
      setTimeout(() => setWaving(false), 1000);
      return;
    }
    if (typed.length < fullLine.length) {
      setTyped(fullLine);
      if (typeTimer.current) { clearInterval(typeTimer.current); typeTimer.current = null; }
      return;
    }
    setLineIdx((i) => (i + 1) % script.lines.length);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_event: any, info: any) => {
    setIsDragging(false);
    const { offset, velocity } = info;
    if (Math.abs(offset.y) > 60 || Math.abs(offset.x) > 60) {
      setDizzy(true);
      triggerSparkles();
      setTimeout(() => setDizzy(false), 1200);

      setShockwaveActive(true);
      setTimeout(() => setShockwaveActive(false), 450);
    }

    // Decaying pendulum rotation launch physics
    const angleRad = Math.atan2(velocity.y, velocity.x);
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    const maxSpeed = 2000;
    const speedFactor = Math.min(speed / maxSpeed, 1);
    const startRotate = Math.cos(angleRad) * 22 * speedFactor;

    setTilt(startRotate);

    let startTime = performance.now();
    const decayDuration = 1000;
    const decay = () => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(1, elapsed / decayDuration);
      const easeOut = 1 - Math.pow(1 - t, 3); // cubic ease out
      const currentRotate = startRotate * (1 - easeOut);
      
      setTilt(currentRotate);

      if (t < 1) {
        requestAnimationFrame(decay);
      } else {
        setTilt(0);
      }
    };
    requestAnimationFrame(decay);
  };

  const handleMascotClick = (e: React.MouseEvent) => {
    if (tourActive || backflipping || dizzy) return;

    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setBackflipping(true);
        triggerSparkles();
        setTimeout(() => {
          setBackflipping(false);
        }, 1000);
        return 0;
      }
      return next;
    });

    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    clickTimeout.current = setTimeout(() => {
      setClickCount(0);
    }, 400);

    handleTap();
  };

  const handleStartTour = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBubbleOpen(false);
    startTour();
  };

  const dismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHidden(true);
    lsSet(HIDE_KEY, '1');
  };

  const summon = () => {
    setHidden(false);
    lsSet(HIDE_KEY, '0');
    setTimeout(() => triggerSparkles(), 100);
  };

  if (hidden) {
    return (
      <div className="fixed bottom-6 right-6 z-[150] pointer-events-auto">
        <motion.button
          type="button"
          onClick={summon}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-shadow duration-300"
          style={{
            background: isLight
              ? 'linear-gradient(135deg, #0284C7, #0369A1)'
              : 'linear-gradient(135deg, #083344, #155E75)',
            border: isLight
              ? '1px solid rgba(2, 132, 199, 0.3)'
              : '1px solid rgba(34,211,238,0.45)',
            boxShadow: isLight
              ? '0 8px 30px rgba(2, 132, 199, 0.3)'
              : '0 8px 30px rgba(34, 211, 238, 0.3)',
          }}
          aria-label="Summon Byte"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M2 12h20M5.636 5.636l12.728 12.728M5.636 18.364L18.364 5.636" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a6 6 0 016 6M12 9a3 3 0 013 3M6 12a6 6 0 006 6M9 12a3 3 0 003 3" />
            <circle cx="12" cy="12" r="2.5" fill="#22D3EE" />
          </svg>
        </motion.button>
      </div>
    );
  }

  // Small + tucked in the corner on phones; large on desktop.
  const imgClass = talking
    ? 'w-[104px] sm:w-[330px]'
    : tourActive
      ? 'w-[100px] sm:w-[315px]'
      : 'w-[96px] sm:w-[305px]';

  const swing = talking ? 0.9 : tourActive ? 2.6 : 1.6;

  return (
    <>
      {/* Full-screen SVG for Web Shooting */}
      {webTarget && (
        <svg className="fixed inset-0 pointer-events-none w-screen h-screen z-[200]">
          <motion.path
            d={`M ${webStart.x} ${webStart.y} Q ${(webStart.x + webTarget.x) / 2} ${(webStart.y + webTarget.y) / 2 - 40} ${webTarget.x} ${webTarget.y}`}
            stroke={isLight ? 'rgba(2, 132, 199, 0.85)' : 'rgba(34,211,238,0.85)'}
            strokeWidth="2.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </svg>
      )}
      {splat && webTarget && (
        <motion.div
          className="fixed w-8 h-8 rounded-full pointer-events-none z-[200] blur-[1px]"
          style={{ 
            left: webTarget.x - 16, 
            top: webTarget.y - 16,
            background: isLight ? 'radial-gradient(circle, rgba(2,132,199,0.8) 0%, rgba(2,132,199,0) 70%)' : 'radial-gradient(circle, rgba(34,211,238,0.8) 0%, rgba(34,211,238,0) 70%)',
            border: isLight ? '1px solid rgba(2,132,199,0.4)' : '1px solid rgba(34,211,238,0.4)'
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}

      <motion.div 
        className="fixed top-0 right-3 sm:right-8 z-[150] flex flex-col items-center select-none pointer-events-none"
        style={{ y: springY, x: springX }}
      >
        {/* Pendulum: pivots at the ceiling anchor (top center) */}
        <motion.div
          className="flex flex-col items-center relative"
          style={{ transformOrigin: 'top center' }}
          animate={isDragging ? { rotate: 0 } : { rotate: [swing, -swing, swing] }}
          transition={isDragging ? { duration: 0.1 } : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* ceiling anchor node */}
          <div className="relative">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ 
                background: isLight ? 'rgba(2, 132, 199, 0.85)' : 'rgba(226,232,240,0.85)', 
                boxShadow: isLight ? '0 0 10px rgba(2, 132, 199, 0.5)' : '0 0 10px rgba(34,211,238,0.7)' 
              }}
            />
            {/* Shockwave ring */}
            <AnimatePresence>
              {shockwaveActive && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 3.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border"
                  style={{
                    borderColor: isLight ? '#0284C7' : '#22D3EE',
                    boxShadow: isLight ? '0 0 8px rgba(2, 132, 199, 0.6)' : '0 0 8px rgba(34, 211, 238, 0.6)',
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* silk web strand */}
          <motion.div
            ref={strandRef}
            className={`w-[2px] ${strandClass}`}
            style={{
              scaleY: scaleY,
              rotate: strandRotation,
              transformOrigin: 'top center',
              background: isLight
                ? 'linear-gradient(to bottom, rgba(2, 132, 199, 0.15), rgba(2, 132, 199, 0.6))'
                : 'linear-gradient(to bottom, rgba(226,232,240,0.15), rgba(226,232,240,0.6))',
              boxShadow: isLight
                ? '0 0 6px rgba(2, 132, 199, 0.25)'
                : '0 0 6px rgba(34,211,238,0.45)',
            }}
          />

          {/* Spider + bubbles + tour badge (only this captures pointer events) */}
          <motion.div
            drag
            dragConstraints={{ top: 0, bottom: 250, left: -160, right: 160 }}
            dragElastic={0.25}
            dragTransition={{ bounceStiffness: 160, bounceDamping: 7 }}
            style={{ x: dragX, y: dragY }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className="group relative -mt-3 flex flex-col items-center pointer-events-auto"
          >
            {/* Sparkle Confetti Canvas */}
            <SparkleCanvas trigger={sparkleTrigger} isLight={isLight} />

            {/* ----- Normal speech bubble (to the LEFT of the spider) ----- */}
            <AnimatePresence>
              {talking && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 8, scale: 0.92 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  onClick={handleTap}
                  className="absolute right-full top-1/3 -translate-y-1/2 mr-3 w-[min(240px,62vw)] cursor-pointer rounded-2xl px-4 py-3 z-10"
                  style={{
                    background: isLight
                      ? 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(247,249,252,0.99))'
                      : 'linear-gradient(160deg, rgba(13,17,24,0.97), rgba(5,8,14,0.99))',
                    border: isLight
                      ? '1px solid rgba(2, 132, 199, 0.22)'
                      : '1px solid rgba(34,211,238,0.35)',
                    boxShadow: isLight
                      ? '0 16px 50px rgba(0,0,0,0.08), 0 0 30px rgba(2, 132, 199, 0.06)'
                      : '0 16px 50px rgba(0,0,0,0.6), 0 0 30px rgba(34,211,238,0.18)',
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase" style={{ color: isLight ? '#EA580C' : '#22D3EE' }}>
                        Byte
                      </span>
                      {/* 3-bar Audio Visualizer */}
                      {typed.length < fullLine.length && (
                        <div className="flex items-end gap-[2px] h-[10px]">
                          {[1, 2, 3].map((b) => (
                            <motion.div
                              key={b}
                              className="w-[2.5px] rounded-full"
                              style={{ background: isLight ? '#EA580C' : '#22D3EE' }}
                              animate={{ height: ['3px', '10px', '3px'] }}
                              transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut', delay: b * 0.15 }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">
                      {lineIdx + 1}/{script.lines.length}
                    </span>
                  </div>
                  <p className="text-[12.5px] leading-snug min-h-[34px]" style={{ color: isLight ? '#334155' : '#E6EDF3' }}>
                    {typed}
                    <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle animate-pulse" style={{ background: isLight ? '#EA580C' : '#22D3EE', opacity: typed.length < fullLine.length ? 1 : 0 }} />
                  </p>
                  {hasTourForPath && (
                    <button
                      type="button"
                      onClick={handleStartTour}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold text-black transition-transform active:scale-95"
                      style={{ background: '#22D3EE', boxShadow: '0 6px 18px rgba(34,211,238,0.4)' }}
                    >
                      <Compass size={13} /> Take the full tour
                    </button>
                  )}
                  <div className="mt-1.5 text-[9px] font-mono text-slate-500">
                    {script.lines.length > 1 ? 'tap me for more' : 'tap me anytime'}
                  </div>
                  <span className="absolute top-1/3 -right-1.5 -translate-y-1/2 w-3 h-3 rotate-45"
                    style={{
                      background: isLight ? '#FFFFFF' : 'rgba(5,8,14,0.99)',
                      borderTop: isLight ? '1px solid rgba(2, 132, 199, 0.22)' : '1px solid rgba(34,211,238,0.35)',
                      borderRight: isLight ? '1px solid rgba(2, 132, 199, 0.22)' : '1px solid rgba(34,211,238,0.35)'
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ----- Whisper bubble (Idle floating tips) ----- */}
            <AnimatePresence>
              {whisperText && !talking && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 8, scale: 0.92 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-full top-1/3 -translate-y-1/2 mr-3 w-[min(240px,62vw)] rounded-2xl px-4 py-3 pointer-events-none z-10"
                  style={{
                    background: isLight
                      ? 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(247,249,252,0.99))'
                      : 'linear-gradient(160deg, rgba(13,17,24,0.97), rgba(5,8,14,0.99))',
                    border: isLight
                      ? '1px dashed rgba(2, 132, 199, 0.35)'
                      : '1px dashed rgba(34,211,238,0.5)',
                    boxShadow: isLight
                      ? '0 10px 30px rgba(0,0,0,0.06)'
                      : '0 10px 30px rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase" style={{ color: isLight ? '#EA580C' : '#22D3EE' }}>
                      Byte Whispers
                    </span>
                  </div>
                  <p className="text-[12px] leading-snug" style={{ color: isLight ? '#475569' : '#94A3B8' }}>
                    {whisperText}
                  </p>
                  <span className="absolute top-1/3 -right-1.5 -translate-y-1/2 w-3 h-3 rotate-45"
                    style={{
                      background: isLight ? '#FFFFFF' : 'rgba(5,8,14,0.99)',
                      borderTop: isLight ? '1px dashed rgba(2, 132, 199, 0.35)' : '1px dashed rgba(34,211,238,0.5)',
                      borderRight: isLight ? '1px dashed rgba(2, 132, 199, 0.35)' : '1px dashed rgba(34,211,238,0.5)'
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ----- Tour guide cheer chip (to the LEFT) ----- */}
            <AnimatePresence>
              {tourActive && (
                <motion.div
                  key={cheerIdx}
                  initial={{ opacity: 0, x: 8, scale: 0.85 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -6, scale: 0.85 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-full top-1/3 -translate-y-1/2 mr-3 whitespace-nowrap rounded-full px-3.5 py-1.5 z-10"
                  style={{
                    background: isLight
                      ? 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(247,249,252,0.99))'
                      : 'linear-gradient(160deg, rgba(13,17,24,0.97), rgba(5,8,14,0.99))',
                    border: isLight
                      ? '1px solid rgba(2, 132, 199, 0.3)'
                      : '1px solid rgba(34,211,238,0.45)',
                    boxShadow: isLight
                      ? '0 10px 30px rgba(0,0,0,0.06), 0 0 24px rgba(2, 132, 199, 0.1)'
                      : '0 10px 30px rgba(0,0,0,0.6), 0 0 24px rgba(34,211,238,0.25)',
                  }}
                >
                  <span className="text-[12px] font-bold" style={{ color: isLight ? '#0284C7' : '#7DD3FC' }}>
                    {TOUR_CHEERS[cheerIdx]}
                  </span>
                  <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rotate-45"
                    style={{
                      background: isLight ? '#FFFFFF' : 'rgba(5,8,14,0.99)',
                      borderTop: isLight ? '1px solid rgba(2, 132, 199, 0.3)' : '1px solid rgba(34,211,238,0.45)',
                      borderRight: isLight ? '1px solid rgba(2, 132, 199, 0.3)' : '1px solid rgba(34,211,238,0.45)'
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ----- Animated web shoot path to speech bubble ----- */}
            <AnimatePresence>
              {talking && (
                <svg className="absolute pointer-events-none overflow-visible z-20" style={{ right: 'calc(50% + 15px)', top: '35%', width: 100, height: 50 }}>
                  <motion.path
                    d="M 100 40 Q 50 10 0 20"
                    fill="none"
                    stroke={isLight ? 'rgba(2, 132, 199, 0.85)' : 'rgba(34,211,238,0.85)'}
                    strokeWidth="2.5"
                    strokeDasharray="120"
                    initial={{ strokeDashoffset: 120 }}
                    animate={{ strokeDashoffset: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  />
                  <motion.circle
                    cx="0"
                    cy="20"
                    r="0"
                    fill="none"
                    stroke={isLight ? '#0284C7' : '#22D3EE'}
                    strokeWidth="1.5"
                    initial={{ r: 0, opacity: 1 }}
                    animate={{ r: [0, 16], opacity: [1, 0] }}
                    transition={{ delay: 0.25, duration: 0.35, ease: 'easeOut' }}
                  />
                </svg>
              )}
            </AnimatePresence>

            {/* ----- The spider ----- */}
            <motion.button
              ref={spiderRef}
              type="button"
              onClick={handleMascotClick}
              aria-label="Talk to Byte, your guide"
              className="relative block bg-transparent border-none p-0 cursor-pointer"
              style={{ transformOrigin: 'top center' }}
              animate={
                backflipping
                  ? { rotate: 360, y: [0, -60, 0] }
                  : dizzy
                    ? { rotate: 360, y: scuttleY }
                    : waving
                      ? { rotate: [0, -5, 5, -3, 3, 0], scale: talking ? 1.1 : 1, y: scuttleY }
                      : talking
                        ? { scale: 1.1, rotate: [-6, -11, -6], y: scuttleY }
                        : { scale: 1, rotate: tilt, y: scuttleY }
              }
              transition={
                backflipping
                  ? { duration: 0.8, ease: 'easeInOut' }
                  : dizzy
                    ? { duration: 0.8, ease: 'easeInOut' }
                    : waving
                      ? { duration: 1.0, ease: 'easeInOut' }
                      : talking
                        ? { rotate: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }, scale: { type: 'spring', stiffness: 300, damping: 18 } }
                        : { type: 'spring', stiffness: 150, damping: 15 }
              }
              whileHover={{ scale: talking ? 1.14 : 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="absolute left-1/2 -translate-x-1/2 bottom-2 w-28 h-3 rounded-full blur-md"
                style={{ background: isLight ? 'rgba(2, 132, 199, 0.15)' : 'rgba(34,211,238,0.30)' }} />
              <img
                src={blinking ? BLINK : OPEN}
                alt="Byte the spider mascot"
                draggable={false}
                className={`relative ${imgClass} h-auto transition-[width] duration-300 drop-shadow-[0_14px_30px_rgba(0,0,0,0.55)]`}
              />

              {!blinking && (
                <>
                  <motion.span 
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      left: '42.5%',
                      top: '29.5%',
                      width: '3.5%',
                      height: '3.5%',
                      background: '#FFFFFF',
                      boxShadow: isLight 
                        ? '0 0 8px 3px rgba(234, 88, 12, 0.9)' 
                        : '0 0 8px 4px rgba(34, 211, 238, 0.95)',
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1.15, 0.95] }}
                    transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.span 
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      left: '57.5%',
                      top: '29.5%',
                      width: '3.5%',
                      height: '3.5%',
                      background: '#FFFFFF',
                      boxShadow: isLight 
                        ? '0 0 8px 3px rgba(234, 88, 12, 0.9)' 
                        : '0 0 8px 4px rgba(34, 211, 238, 0.95)',
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1.15, 0.95] }}
                    transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </>
              )}

              {accessory && (
                <div 
                  className="absolute pointer-events-none"
                  style={{
                    top: '12%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '32%',
                    height: '32%',
                  }}
                >
                  <svg viewBox="0 0 40 40" className="w-full h-full">
                    {accessory === 'graduation-cap' && (
                      <g>
                        <rect x="12" y="24" width="16" height="4" fill="#1E293B" rx="1" />
                        <polygon points="4,24 20,12 36,24" fill="#0F172A" />
                        <path d="M20,16 L20,32 M20,32 L16,36" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
                      </g>
                    )}
                    {accessory === 'welding-goggles' && (
                      <g>
                        <rect x="6" y="16" width="28" height="8" fill="#1E293B" rx="2" />
                        <circle cx="13" cy="20" r="4" fill="#00F0FF" opacity="0.9" style={{ filter: 'drop-shadow(0 0 4px #00F0FF)' }} />
                        <circle cx="27" cy="20" r="4" fill="#00F0FF" opacity="0.9" style={{ filter: 'drop-shadow(0 0 4px #00F0FF)' }} />
                        <rect x="18" y="18" width="4" height="2" fill="#64748B" />
                      </g>
                    )}
                    {accessory === 'eyepatch' && (
                      <g>
                        <ellipse cx="13" cy="20" rx="7" ry="5" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
                        <line x1="2" y1="12" x2="38" y2="28" stroke="#0F172A" strokeWidth="2.5" />
                      </g>
                    )}
                  </svg>
                </div>
              )}
            </motion.button>

            {/* ----- "Take the tour" badge ----- */}
            <AnimatePresence>
              {showTourBadge && (
                <motion.button
                  type="button"
                  onClick={handleStartTour}
                  initial={{ opacity: 0, y: -6, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  aria-label="Take the guided tour"
                  className="relative -mt-1 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-black"
                  style={{ background: 'linear-gradient(135deg, #22D3EE, #3B82F6)', boxShadow: '0 8px 22px rgba(34,211,238,0.45)' }}
                >
                  <motion.span
                    className="absolute inset-0 rounded-full"
                    style={{ border: '2px solid rgba(34,211,238,0.6)' }}
                    animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <Compass size={13} className="relative z-10" />
                  <span className="relative z-10">Take the tour</span>
                </motion.button>
              )}
            </AnimatePresence>

            {!tourActive && (
              <button
                type="button"
                onClick={dismiss}
                aria-label="Hide Byte"
                className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(148,163,184,0.3)', color: '#94A3B8' }}
              >
                <X size={11} />
              </button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};
