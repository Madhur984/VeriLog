import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BinaryRain } from '../components/BinaryRain';

// Konami Code signature
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

export const EasterEggManager = () => {
  // Easter Egg States
  const [crtActive, setCrtActive] = useState(false);
  const [vimActive, setVimActive] = useState(false);
  const [lotteryActive, setLotteryActive] = useState(false);
  const [fifoDepth, setFifoDepth] = useState<number | null>(null);
  const [smokeSmokeEffect, setSmokeEffect] = useState<{ x: number; y: number } | null>(null);

  // References
  const konamiIdx = useRef(0);
  const vimKeys = useRef<string[]>([]);
  const clickCount = useRef<number>(0);
  const clickResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTimestamps = useRef<number[]>([]);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Save discovered eggs helper
    const unlockEgg = (eggId: string) => {
      try {
        const current = JSON.parse(localStorage.getItem('bfb_discovered_eggs') || '[]');
        if (!current.includes(eggId)) {
          current.push(eggId);
          localStorage.setItem('bfb_discovered_eggs', JSON.stringify(current));
        }
      } catch (e) {
        // ignore
      }
    };

    // Unlock global prints console NAND art on mount
    console.log(
      `%c
   VeriLog / BitForBytes Logic Gate Board
   
         A ───[\\   
               |  >o─── OUT (NAND)
         B ───[/   
   
   Want to tweak the hardware? Try: _bfb.pull_up() or _bfb.pull_down()
   To run a diagnostics logic check: _bfb.start_diagnostics()
      `,
      'color: #22D3EE; font-family: monospace; font-weight: bold; font-size: 12px;'
    );

    unlockEgg('schematic');

    (window as any)._bfb = {
      pull_up: () => {
        console.warn("%c[BFB] ⚡ Floating input detected on GPIO 7. Pull-up resistor enabled.", "color: #eab308; font-weight: bold; font-size: 11px;");
        console.log("%cSignal status: HIGH (stable 3.3V)", "color: #22c55e; font-weight: bold;");
        unlockEgg('pull_up');
      },
      pull_down: () => {
        console.warn("%c[BFB] ⚡ Floating input detected on GPIO 7. Pull-down resistor enabled.", "color: #eab308; font-weight: bold; font-size: 11px;");
        console.log("%cSignal status: LOW (stable 0.0V)", "color: #ef4444; font-weight: bold;");
        unlockEgg('pull_down');
      },
      start_diagnostics: () => {
        console.clear();
        console.log("%c=== BFB SILICON LAB DIAGNOSTICS ===", "color: #22d3ee; font-weight: bold; font-size: 14px;");
        console.log("Welcome, engineer. Let's verify your logic gates. Type your answers to the prompts.");

        const q1 = prompt("Question 1: What logic gate outputs 1 only when both inputs are different? (AND, OR, XOR, NAND)");
        if (q1?.toLowerCase().trim() !== 'xor') {
          console.error("❌ Diagnostics failed at Gate 1: Incorrect gate logic.");
          return;
        }
        console.log("%c✓ Gate 1 passed: XOR verified.", "color: #22c55e;");

        const q2 = prompt("Question 2: How many states can a 4-bit synchronous counter represent?");
        if (q2?.trim() !== '16') {
          console.error("❌ Diagnostics failed at State Register: Incorrect register count.");
          return;
        }
        console.log("%c✓ State Register verified: 16 states.", "color: #22c55e;");

        const q3 = prompt("Question 3: In a MOSFET, which terminal controls the channel conductivity? (Gate, Source, Drain)");
        if (q3?.toLowerCase().trim() !== 'gate') {
          console.error("❌ Diagnostics failed at Channel Control: Incorrect terminal.");
          return;
        }

        console.log("%c🎉 ALL SYSTEMS OPERATIONAL! Diagnostics fully passed.", "color: #22c55e; font-weight: bold; font-size: 12px;");
        unlockEgg('diagnostics');
        console.log("Badge unlocked: 'Logic Specialist' (Visit /eggs to view progress!)");
      }
    };


    // ----------------------------------------------------
    // 2. Global Keyboard Handlers (Konami & Vim)
    // ----------------------------------------------------
    const handleKeyDown = (e: KeyboardEvent) => {
      // Vim escape trigger: `:wq`
      const activeElement = document.activeElement;
      const isInput = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.getAttribute('contenteditable') === 'true'
      );

      if (!isInput) {
        // Track Vim keys
        vimKeys.current.push(e.key);
        if (vimKeys.current.length > 3) {
          vimKeys.current.shift();
        }
        if (vimKeys.current.join('') === ':wq') {
          setVimActive(true);
          vimKeys.current = [];
          unlockEgg('vim');
          if (window.navigator.vibrate) window.navigator.vibrate(100);
        }

        // Konami Code progress
        if (e.key === KONAMI_CODE[konamiIdx.current]) {
          konamiIdx.current += 1;
          if (konamiIdx.current === KONAMI_CODE.length) {
            setCrtActive(prev => !prev);
            konamiIdx.current = 0;
            unlockEgg('konami');
            if (window.navigator.vibrate) window.navigator.vibrate([80, 40, 80]);
          }
        } else {
          // Reset Konami progress on mismatch (unless starting sequence again)
          konamiIdx.current = e.key === KONAMI_CODE[0] ? 1 : 0;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // ----------------------------------------------------
    // 3. Scroll Speed FIFO Overflow Listener
    // ----------------------------------------------------
    const handleScroll = () => {
      const now = Date.now();
      scrollTimestamps.current = scrollTimestamps.current.filter(t => now - t < 1000);
      scrollTimestamps.current.push(now);

      if (scrollTimestamps.current.length > 22) {
        setFifoDepth(prev => {
          const next = (prev ?? 0) + 1;
          if (next >= 10) {
            document.body.classList.add('fifo-overflow-shake');
            setTimeout(() => {
              document.body.classList.remove('fifo-overflow-shake');
            }, 800);
            scrollTimestamps.current = [];
            unlockEgg('fifo');
            return 10;
          }
          return next;
        });

        // Auto-reset FIFO depth alert
        const timer = setTimeout(() => {
          setFifoDepth(null);
        }, 5000);

        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: true });

    // ----------------------------------------------------
    // 4. Global Button Long Press (Magic Smoke)
    // ----------------------------------------------------
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('button') || target.closest('a') || target.closest('[role="button"]');
      if (!clickable) return;

      pressTimer.current = setTimeout(() => {
        const rect = clickable.getBoundingClientRect();
        setSmokeEffect({
          x: rect.left + rect.width / 2 + window.scrollX,
          y: rect.top + window.scrollY,
        });
        unlockEgg('smoke');

        if (window.navigator.vibrate) {
          window.navigator.vibrate([50, 100, 150]);
        }

        setTimeout(() => setSmokeEffect(null), 3000);
      }, 5000);
    };

    const handleMouseUp = () => {
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp);

    // ----------------------------------------------------
    // 5. Silicon Lottery: Toggle click counts
    // ----------------------------------------------------
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Count rapidly clicking switches, theme toggles, or general inputs
      const isInteractive = target.closest('button') || target.closest('[role="switch"]') || target.closest('input[type="checkbox"]');
      if (!isInteractive) return;

      clickCount.current += 1;
      if (clickResetTimer.current) clearTimeout(clickResetTimer.current);

      if (clickCount.current >= 10) {
        setLotteryActive(true);
        clickCount.current = 0;
        unlockEgg('lottery');
        if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
        setTimeout(() => setLotteryActive(false), 3000);
      }


      clickResetTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 2000);
    };

    window.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
      window.removeEventListener('click', handleGlobalClick);
      if (pressTimer.current) clearTimeout(pressTimer.current);
      if (clickResetTimer.current) clearTimeout(clickResetTimer.current);
    };
  }, []);

  // Update body-level styles for active overlays
  useEffect(() => {
    if (crtActive) {
      document.body.classList.add('konami-crt-active');
    } else {
      document.body.classList.remove('konami-crt-active');
    }
  }, [crtActive]);

  useEffect(() => {
    if (lotteryActive) {
      document.body.classList.add('silicon-lottery-invert');
    } else {
      document.body.classList.remove('silicon-lottery-invert');
    }
  }, [lotteryActive]);

  return (
    <>
      {/* Konami CRT Overlay lines */}
      {crtActive && (
        <div className="pointer-events-none fixed inset-0 z-[9999] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(16,185,129,0.18)_100%)]">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'linear-gradient(to bottom, #10b981 1px, transparent 1px)',
              backgroundSize: '100% 4px',
            }}
          />
          <div className="absolute top-4 left-4 bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono px-3 py-1.5 rounded-md shadow-lg">
            📡 OSCILLOSCOPE TRIGGERED (CH-A: 50.0MHz)
          </div>
        </div>
      )}

      {/* Silicon Lottery Win Modal Banner */}
      <AnimatePresence>
        {lotteryActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="fixed bottom-10 left-10 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-sm font-semibold shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #166534, #14532d)',
              borderColor: '#4ade80',
              color: '#fff',
            }}
          >
            <span className="text-lg">🎰</span>
            <div>
              <p className="font-bold text-[#4ade80]">Silicon Lottery Winner!</p>
              <p className="text-xs text-emerald-200">You won the ASIC speed binning prize!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vim RISC-V Escape Terminal */}
      <AnimatePresence>
        {vimActive && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed top-0 left-0 right-0 h-[360px] bg-slate-950 border-b border-cyan-500/30 text-cyan-400 font-mono text-xs z-[9999] shadow-2xl p-6 overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute inset-0 z-0 opacity-40">
              <BinaryRain />
            </div>
            <div className="space-y-2 overflow-y-auto max-h-[260px] scrollbar-hide relative z-10">
              <p className="text-slate-500">// ESCAPING VIM SIMULATION - RISC-V CORE STATE</p>

              <p className="text-emerald-400">addi x5, x0, 10     # Load multiplier value</p>
              <p className="text-emerald-400">addi x6, x0, 24     # Load input logic bit</p>
              <p className="text-emerald-400">mul  x7, x5, x6     # Compute transistor frequency</p>
              <p className="text-cyan-400">jal  x1, print_results # Jump to IO display</p>
              <p className="text-rose-400"># Warning: Thread buffer overflowed inside memory block</p>
              <p className="text-slate-400">SYSTEM OUT: "You escaped! But the silicon loop continues..."</p>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-slate-500">:wq (saved and exited core scheduler)</span>
              <button
                onClick={() => setVimActive(false)}
                className="px-4 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold cursor-pointer transition-colors"
              >
                Return to Sandbox
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIFO Scroll Overflow Indicator */}
      <AnimatePresence>
        {fifoDepth !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-18 right-8 z-[9998] flex flex-col gap-1.5 px-4 py-2.5 rounded-xl border border-rose-500/30 shadow-lg font-mono text-xs"
            style={{
              background: '#2a0d15',
              color: '#fda4af',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="font-bold">⚠️ FIFO BUFFER NEAR CAPACITY</span>
            </div>
            <div className="text-[10px] text-rose-300">
              FIFO Depth: {fifoDepth}/10 {fifoDepth === 10 ? '[OVERFLOW - DATA LOST!]' : ''}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Magic Smoke SVG Particles */}
      <AnimatePresence>
        {smokeSmokeEffect && (
          <div
            className="absolute pointer-events-none z-[9999]"
            style={{ left: smokeSmokeEffect.x, top: smokeSmokeEffect.y }}
          >
            <svg width="40" height="120" viewBox="0 0 40 120" className="overflow-visible">
              <motion.path
                d="M 20 120 Q 10 90 20 60 T 20 0"
                fill="none"
                stroke="rgba(148,163,184,0.45)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: 1, opacity: 0, y: -40 }}
                transition={{ duration: 2.2, ease: 'easeOut' }}
              />
              <motion.circle
                cx="20"
                cy="110"
                r="6"
                fill="#f97316"
                style={{ filter: 'blur(2px)' }}
                animate={{ scale: [1, 2.5], opacity: [0.9, 0], y: -90 }}
                transition={{ duration: 1.8 }}
              />
            </svg>
            <div
              className="absolute -top-10 -left-20 w-44 text-[10px] font-bold text-center px-2 py-1 rounded bg-slate-900 border border-slate-700 text-orange-400"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}
            >
              Letting the magic smoke out! 🔥
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
