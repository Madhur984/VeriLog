import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ConsoleButton {
  id: string;
  icon: string;
  label: string;
  color: string;
  route?: string;
  action?: () => void;
}

interface DiagnosticConsoleProps {
  onCommandPaletteOpen?: () => void;
}

const OscilloscopeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let t = 0;
    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.beginPath();

      const w = canvas.width;
      const h = canvas.height;
      const mid = h / 2;

      for (let x = 0; x < w; x++) {
        // Mix of two sine waves for more technical look
        const y = mid + 
                 10 * Math.sin(x * 0.1 + t) + 
                 5 * Math.sin(x * 0.25 - t * 2);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      t += 0.05;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 opacity-30 pointer-events-none"
      width={240}
      height={96}
    />
  );
};

export const DiagnosticConsole: React.FC<DiagnosticConsoleProps> = ({
  onCommandPaletteOpen,
}) => {
  const navigate = useNavigate();
  const [activeBtn, setActiveBtn] = useState<string | null>(null);
  const [tickerIdx, setTickerIdx] = useState(0);

  const TICKER_MSGS = [
    'AXE-OR // CORE_STABILITY: NOMINAL',
    'CAPTURE_FIDELITY: 99.8%',
    'SIGNAL_ENGINE: LOCKED',
    'NEURAL_MAP: SYNC_READY',
  ];

  useEffect(() => {
    const t = setInterval(() => setTickerIdx(i => (i + 1) % TICKER_MSGS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const BUTTONS: ConsoleButton[] = [
    { id: 'globe',      icon: '◉',  label: 'CAREER_MAP',     color: '#3b82f6', route: '/' },
    { id: 'gear',       icon: '⚙',  label: 'Settings',       color: '#2563eb', route: '/settings' },
    { id: 'code',       icon: '<>', label: 'Code',           color: '#3b82f6', route: '/verilog' },
    { id: 'grind',      icon: '⬡',  label: 'PROGRESS_CORE',  color: '#60a5fa' },
    { id: 'resources',  icon: '≋',  label: 'MY_STATS',       color: '#3b82f6', route: '/resources' },
    { id: 'analytics',  icon: '▦',  label: 'SESSION_LOG',    color: '#60a5fa', route: '/analytics' },
    { id: 'leaderboard',icon: '⊞',  label: 'LEADERBOARD',    color: '#3b82f6', route: '/community' },
    { id: 'cmd',        icon: '⌘',  label: 'COMMAND',        color: '#60a5fa', action: onCommandPaletteOpen },
  ];

  const handleBtn = (btn: ConsoleButton) => {
    setActiveBtn(btn.id);
    setTimeout(() => setActiveBtn(null), 400);
    if (btn.route) navigate(btn.route);
    if (btn.action) btn.action();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.0, duration: 0.8, ease: 'easeOut' }}
      className="relative"
      style={{ width: 260 }}
    >
      {/* Outer shell — burnished metal */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0a0f1a 0%, #05080c 40%, #020408 100%)',
          border: '1px solid rgba(59, 130, 246, 0.15)',
          boxShadow: [
            '0 20px 60px rgba(0,0,0,0.9)',
            '0 0 0 1px rgba(255,255,255,0.04)',
            'inset 0 1px 1px rgba(255,255,255,0.06)',
            'inset 0 -1px 1px rgba(0,0,0,0.3)',
          ].join(', '),
        }}
      >
        {/* Carbon-fiber texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              rgba(255,255,255,0.03) 0px,
              rgba(255,255,255,0.03) 1px,
              transparent 1px,
              transparent 4px
            )`,
          }}
        />

        {/* Top status bar */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{
            background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, transparent 100%)',
            borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
          }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span className="text-[7px] font-black tracking-[0.35em] uppercase" style={{ color: '#3b82f680' }}>
              AXE-OR // READY
            </span>
          </div>
          <div className="flex gap-1.5">
            {['#22d3ee', '#fbbf24', '#34d399'].map((c, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: c, boxShadow: `0 0 4px ${c}` }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
          </div>
        </div>

        {/* Main display — Oscilloscope + Ticker */}
        <div className="px-4 py-3">
          <div
            className="rounded-lg p-3 relative overflow-hidden h-24 flex flex-col justify-between"
            style={{
              background: '#020408',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(59, 130, 246, 0.05)',
            }}
          >
            {/* Live Oscilloscope Component */}
            <OscilloscopeCanvas />

            <div className="relative z-10">
              <div className="text-[6px] font-mono tracking-[0.25em] uppercase mb-1" style={{ color: '#3b82f640' }}>
                MISSION_TELEMETRY
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tickerIdx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="text-[9px] font-black tracking-[0.2em] font-mono"
                  style={{ color: '#3b82f6', textShadow: '0 0 10px #3b82f680' }}
                >
                  {TICKER_MSGS[tickerIdx]}
                </motion.div>
              </AnimatePresence>
              <motion.span
                className="inline-block ml-1 text-[9px] font-mono"
                style={{ color: '#3b82f6' }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                █
              </motion.span>
            </div>

            {/* Bottom mini-metrics */}
            <div className="relative z-10 flex justify-between items-end border-t border-white/5 pt-1 mt-1">
               <div className="text-[5px] font-mono text-cyan-400/40">FRQ: 44.1kHz</div>
               <div className="text-[5px] font-mono text-cyan-400/40">AMP: 1.25V</div>
            </div>
          </div>
        </div>

        {/* Button grid — 2 columns */}
        <div className="px-4 pb-3 grid grid-cols-2 gap-2">
          {BUTTONS.map(btn => (
            <motion.button
              key={btn.id}
              onClick={() => handleBtn(btn)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-left"
              style={{
                background:
                  activeBtn === btn.id
                    ? `${btn.color}20`
                    : 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.2) 100%)',
                border: `1px solid ${activeBtn === btn.id ? `${btn.color}60` : 'rgba(255,255,255,0.06)'}`,
                boxShadow:
                  activeBtn === btn.id
                    ? `0 0 12px ${btn.color}40, inset 0 1px 1px rgba(255,255,255,0.1)`
                    : 'inset 0 1px 1px rgba(255,255,255,0.04), 0 2px 4px rgba(0,0,0,0.4)',
                cursor: 'pointer',
              }}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Button LED */}
              <motion.div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: btn.color,
                  boxShadow: `0 0 5px ${btn.color}`,
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: BUTTONS.indexOf(btn) * 0.25,
                }}
              />
              <div>
                <div
                  className="text-[7px] font-black tracking-[0.15em] uppercase leading-none"
                  style={{ color: btn.color }}
                >
                  {btn.label}
                </div>
                <div className="text-[9px] font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {btn.icon}
                </div>
              </div>
              {/* Press ripple */}
              {activeBtn === btn.id && (
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{ background: `${btn.color}15`, border: `1px solid ${btn.color}80` }}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Bottom data readout row */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(0,0,0,0.3)',
          }}
        >
          {['CPU 43%', 'MEM 1.2G', 'NET OK'].map((stat, i) => (
            <div key={i} className="text-[7px] font-mono" style={{ color: '#334155' }}>
              {stat}
            </div>
          ))}
        </div>

        {/* Side LED strip (right edge) */}
        <div className="absolute right-0 top-6 bottom-6 w-1 flex flex-col justify-around">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{
                background: LED_STRIP_COLORS[i % LED_STRIP_COLORS.length],
                boxShadow: `0 0 4px ${LED_STRIP_COLORS[i % LED_STRIP_COLORS.length]}`,
              }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2 + i * 0.15, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* Ground shadow */}
      <div
        style={{
          width: '80%',
          height: 8,
          margin: '0 auto',
          background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.1) 0%, transparent 70%)',
          filter: 'blur(6px)',
          marginTop: -2,
        }}
      />
    </motion.div>
  );
};

const LED_STRIP_COLORS = [
  '#3b82f6', '#2563eb', '#60a5fa', '#1e3a8a',
  '#3b82f6', '#1d4ed8', '#2563eb', '#1e40af',
];
