import React, { useState, useEffect, useRef } from 'react';
import { FileCode, ShieldCheck, Layers, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useColorScheme } from '../../hooks/useColorScheme';

type FabLayer = 'METAL1' | 'POLY' | 'VIA';

/**
 * PremiumBentoFeatures — Spatial 3D Interactive Feature Grid
 *
 * Four-panel asymmetric bento layout with dual-layer pointer-reactive interactions:
 *  - 3D perspective tilt (perspective(1000px) rotateX/Y + scale3d) via mouse tracking
 *  - Radial spotlight gradient overlay following cursor position
 *  - Smooth cubic-bezier(0.16, 1, 0.3, 1) physics resets on mouse leave
 *
 *  Panel 1 (2-col): Click-to-compute NAND gate synthesis with live output
 *  Panel 2 (1-col): Auto-cycling testbench assertion stream
 *  Panel 3 (1-col): Hover-to-explore semiconductor layer switcher + canvas
 *  Panel 4 (2-col): Career domain intelligence matrix
 *
 * Design tokens aligned to the Silicon Workstation palette.
 * All numeric readouts use tabular-nums for zero-jitter layout.
 */
export const PremiumBentoFeatures: React.FC = () => {
  const [scheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';

  // Panel 1: Logic gate interactive state (with LocalStorage Persistence)
  const [gateA, setGateA] = useState<boolean>(() => {
    const saved = localStorage.getItem('bitforbytes_bento_gate_a');
    return saved === null ? true : saved === 'true';
  });
  const [gateB, setGateB] = useState<boolean>(() => {
    const saved = localStorage.getItem('bitforbytes_bento_gate_b');
    return saved === null ? false : saved === 'true';
  });
  const nandOut = !(gateA && gateB);

  useEffect(() => {
    localStorage.setItem('bitforbytes_bento_gate_a', String(gateA));
  }, [gateA]);

  useEffect(() => {
    localStorage.setItem('bitforbytes_bento_gate_b', String(gateB));
  }, [gateB]);

  // Panel 2: Auto-cycling testbench assertion index
  const [testCycle, setTestCycle] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTestCycle(p => (p + 1) % 5), 1100);
    return () => clearInterval(interval);
  }, []);

  // Panel 3: Fabrication layer hover selector (with LocalStorage Persistence)
  const [activeLayer, setActiveLayer] = useState<FabLayer>(() => {
    const saved = localStorage.getItem('bitforbytes_bento_layer');
    return (saved === 'METAL1' || saved === 'POLY' || saved === 'VIA') ? saved as FabLayer : 'METAL1';
  });

  useEffect(() => {
    localStorage.setItem('bitforbytes_bento_layer', activeLayer);
  }, [activeLayer]);

  // Panel 3: Canvas-based layer visualization with CAD annotations
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = isDarkMode ? '#03050a' : '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // Substrate grid
    ctx.strokeStyle = isDarkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 12) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 12) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // CAD Dimension helper
    const drawDimension = (x1: number, y1: number, x2: number, y2: number, text: string, color: string) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 0.5;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      ctx.beginPath();
      if (y1 === y2) {
        ctx.moveTo(x1, y1 - 3); ctx.lineTo(x1, y1 + 3);
        ctx.moveTo(x2, y2 - 3); ctx.lineTo(x2, y2 + 3);
      } else if (x1 === x2) {
        ctx.moveTo(x1 - 3, y1); ctx.lineTo(x1 + 3, y1);
        ctx.moveTo(x2 - 3, y2); ctx.lineTo(x2 + 3, y2);
      }
      ctx.stroke();
      
      ctx.font = '7px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      
      const textWidth = ctx.measureText(text).width;
      ctx.fillStyle = isDarkMode ? '#03050a' : '#f8fafc';
      ctx.fillRect(mx - textWidth / 2 - 2, my - 5, textWidth + 4, 10);
      
      ctx.fillStyle = color;
      ctx.fillText(text, mx, my);
    };

    // Semantic colors for layers
    const colorsMap = isDarkMode ? {
      METAL1: 'rgba(0, 245, 255, 0.8)',
      POLY: 'rgba(255, 95, 31, 0.6)',
      POLY_BG: 'rgba(255, 95, 31, 0.12)',
      VIA: 'rgba(16, 185, 129, 0.7)',
      VIA_BG: 'rgba(16, 185, 129, 0.3)',
    } : {
      METAL1: 'rgba(3, 105, 161, 0.9)',
      POLY: 'rgba(234, 88, 12, 0.85)',
      POLY_BG: 'rgba(234, 88, 12, 0.12)',
      VIA: 'rgba(22, 163, 74, 0.9)',
      VIA_BG: 'rgba(22, 163, 74, 0.25)',
    };

    // Layer-specific rendering
    if (activeLayer === 'METAL1') {
      ctx.strokeStyle = colorsMap.METAL1;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(12, 20); ctx.lineTo(w * 0.35, 20);
      ctx.lineTo(w * 0.35, h * 0.55); ctx.lineTo(w * 0.65, h * 0.55);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(12, h * 0.7); ctx.lineTo(w * 0.5, h * 0.7);
      ctx.lineTo(w * 0.5, h * 0.3); ctx.lineTo(w - 12, h * 0.3);
      ctx.stroke();
      ctx.font = '8px monospace';
      ctx.fillStyle = isDarkMode ? 'rgba(0, 245, 255, 0.6)' : 'rgba(3, 105, 161, 0.75)';
      ctx.fillText('M1_ROUTE', 14, 14);

      drawDimension(w * 0.35, h * 0.45, w * 0.5, h * 0.45, 'S: 14nm', colorsMap.METAL1);
    } else if (activeLayer === 'POLY') {
      ctx.fillStyle = colorsMap.POLY_BG;
      ctx.strokeStyle = colorsMap.POLY;
      ctx.lineWidth = 1;
      const blocks = [
        { x: w * 0.08, y: h * 0.15, w: w * 0.25, h: h * 0.35 },
        { x: w * 0.45, y: h * 0.45, w: w * 0.4, h: h * 0.4 },
        { x: w * 0.6, y: h * 0.08, w: w * 0.2, h: h * 0.22 },
      ];
      blocks.forEach(b => { ctx.fillRect(b.x, b.y, b.w, b.h); ctx.strokeRect(b.x, b.y, b.w, b.h); });
      ctx.font = '8px monospace';
      ctx.fillStyle = colorsMap.POLY;
      ctx.fillText('POLY_GATE', w * 0.08 + 4, h * 0.15 + 12);

      drawDimension(w * 0.08, h * 0.22, w * 0.33, h * 0.22, 'Lg: 5nm', colorsMap.POLY);
    } else {
      // VIA contacts
      ctx.fillStyle = colorsMap.VIA;
      const vias = [
        { x: w * 0.2, y: h * 0.25 }, { x: w * 0.45, y: h * 0.5 },
        { x: w * 0.7, y: h * 0.3 }, { x: w * 0.35, y: h * 0.7 },
        { x: w * 0.8, y: h * 0.65 }, { x: w * 0.55, y: h * 0.15 },
      ];
      vias.forEach(v => {
        ctx.beginPath(); ctx.arc(v.x, v.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = colorsMap.VIA_BG;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(v.x, v.y, 8, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.font = '8px monospace';
      ctx.fillStyle = colorsMap.VIA;
      ctx.fillText('VIA_ARRAY', 14, 14);

      ctx.strokeStyle = colorsMap.VIA;
      ctx.beginPath();
      ctx.moveTo(w * 0.2, h * 0.25);
      ctx.lineTo(w * 0.2 + 20, h * 0.25 - 15);
      ctx.stroke();
      ctx.font = '7px monospace';
      ctx.fillStyle = colorsMap.VIA;
      ctx.textAlign = 'left';
      ctx.fillText('D: 8nm', w * 0.2 + 23, h * 0.25 - 13);
    }
  }, [activeLayer, isDarkMode]);

  // ═══ DUAL-LAYER SPATIAL INTERACTION ENGINE ═══
  // Combines radial spotlight gradient tracking with 3D perspective tilt transforms
  const handleSpatialInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();

    // Layer 1: Spotlight gradient coordinates
    const mx = e.clientX - box.left;
    const my = e.clientY - box.top;
    card.style.setProperty('--mouse-x', `${mx}px`);
    card.style.setProperty('--mouse-y', `${my}px`);

    // Layer 2: Normalized 3D tilt vector math (-0.5 to 0.5 bounds)
    const tx = (e.clientX - box.left) / box.width - 0.5;
    const ty = (e.clientY - box.top) / box.height - 0.5;

    // Constrain rotation to ±6° for subtle, premium feel
    const rotateX = (ty * -12).toFixed(2);
    const rotateY = (tx * 12).toFixed(2);

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  // Smooth physics reset with industrial transition curve
  const resetSpatialInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  const testVectors = [
    { label: 'System initialization pass', time: '0.01' },
    { label: 'Max load cycle execution', time: '0.08' },
    { label: 'Timing margin validation', time: '0.14' },
    { label: 'Signal edge propagation check', time: '0.22' },
  ];

  const fabData: Record<FabLayer, { metric: string; value: string; color: string }> = {
    METAL1: { metric: 'Routing Clearance', value: '14nm', color: isDarkMode ? '#00F5FF' : '#0284c7' },
    POLY:   { metric: 'Channel Length',    value: '5nm',  color: isDarkMode ? '#FF5F1F' : '#ea580c' },
    VIA:    { metric: 'Contact Resistance', value: '0.2\u03A9', color: isDarkMode ? '#10B981' : '#16a34a' },
  };

  // CSS class for the 3D spatial card — combines tilt transform + spotlight gradient
  const bento3DClass = `bento-spotlight bento-3d-tilt`;

  return (
    <div className="space-y-8 text-left">
      {/* Embedded 3D tilt transform styles — complements bento-spotlight from LandingPageContainer */}
      <style>{`
        .bento-3d-tilt {
          transform-style: preserve-3d;
          will-change: transform;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
        }
        .bento-3d-tilt:hover {
          border-color: ${isDarkMode ? 'rgba(0, 245, 255, 0.12)' : 'rgba(3, 105, 161, 0.2)'};
        }
        .tabular-nums-lock {
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum";
        }
      `}</style>

      <div className="space-y-2 max-w-[65ch]">
        <span className="text-[10px] font-mono text-[#00F5FF] uppercase tracking-widest block">
          // Core workspace features
        </span>
        <h2 className={`text-[clamp(1.75rem,4vw,3rem)] font-black tracking-tight uppercase leading-[0.95] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Engineered for practical clarity.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ═══ PANEL 1: Interactive NAND Synthesis (2-col) ═══ */}
        <div 
          onMouseMove={handleSpatialInteraction}
          onMouseLeave={resetSpatialInteraction}
          className={`${bento3DClass} md:col-span-2 border rounded-xl p-[1px] min-h-[300px] ${
            isDarkMode ? 'bg-slate-900/40 border-slate-900' : 'bg-slate-50/40 border-slate-200 shadow-sm'
          }`}
        >
          <div className="bento-card-inner p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileCode size={14} className="text-[#00F5FF]" />
                <span className="text-[9px] font-mono text-[#8E9AA8] uppercase tracking-wider block">01 // Visual design editor</span>
              </div>
              <h3 className={`text-lg font-bold tracking-tight uppercase ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Interactive Layout Generation</h3>
              <p className={`text-xs leading-relaxed max-w-[58ch] ${isDarkMode ? 'text-[#8E9AA8]' : 'text-slate-600'}`}>
                See exactly how your logical design maps onto hardware components. Modify inputs below to trigger real-time calculations instantly.
              </p>
            </div>

            <div className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 shadow-inner ${
              isDarkMode ? 'bg-[#03050a] border-slate-900' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex gap-2 font-mono text-xs">
                <button
                  onClick={() => setGateA(!gateA)}
                  aria-pressed={gateA}
                  aria-label={`Node A: ${gateA ? 'HIGH' : 'LOW'}`}
                  className={`px-3 py-2 rounded border font-semibold tracking-wide transition-all tabular-data active-press focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00F5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03050a] ${
                    gateA 
                      ? 'bg-[#00F5FF]/10 border-[#00F5FF] text-[#00F5FF]' 
                      : (isDarkMode ? 'bg-slate-950 border-slate-900 text-[#8E9AA8]' : 'bg-white border-slate-200 text-slate-500')
                  }`}
                >
                  Input A = {gateA ? '1' : '0'}
                </button>
                <button
                  onClick={() => setGateB(!gateB)}
                  aria-pressed={gateB}
                  aria-label={`Node B: ${gateB ? 'HIGH' : 'LOW'}`}
                  className={`px-3 py-2 rounded border font-semibold tracking-wide transition-all tabular-data active-press focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00F5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03050a] ${
                    gateB 
                      ? 'bg-[#00F5FF]/10 border-[#00F5FF] text-[#00F5FF]' 
                      : (isDarkMode ? 'bg-slate-950 border-slate-900 text-[#8E9AA8]' : 'bg-white border-slate-200 text-slate-500')
                  }`}
                >
                  Input B = {gateB ? '1' : '0'}
                </button>
              </div>

              <div className="font-mono text-xs text-[#8E9AA8] flex items-center gap-2">
                <span>Area:</span>
                <span className={`${isDarkMode ? 'text-white' : 'text-slate-800'} font-bold tracking-wider tabular-data`}>3 Cells</span>
              </div>

              <div className={`px-4 py-2 font-mono text-xs font-bold rounded border uppercase tracking-widest text-center tabular-data transition-colors ${
                nandOut 
                  ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981]' 
                  : (isDarkMode ? 'bg-slate-950 border-slate-900 text-[#8E9AA8]' : 'bg-white border-slate-200 text-slate-400')
              }`}>
                Output = {nandOut ? '1' : '0'}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ PANEL 2: Live Testbench Assertion Stream (1-col) ═══ */}
        <div 
          onMouseMove={handleSpatialInteraction}
          onMouseLeave={resetSpatialInteraction}
          className={`${bento3DClass} border rounded-xl p-[1px] min-h-[300px] ${
            isDarkMode ? 'bg-slate-900/40 border-slate-900' : 'bg-slate-50/40 border-slate-200 shadow-sm'
          }`}
        >
          <div className="bento-card-inner p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#10B981]" />
                <span className="text-[9px] font-mono text-[#8E9AA8] uppercase tracking-wider block">02 // Integrated simulator</span>
              </div>
              <h3 className={`text-lg font-bold tracking-tight uppercase ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Automated Testing</h3>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-[#8E9AA8]' : 'text-slate-600'}`}>
                Run multi-stage validation routines inside an automated, web-ready simulation environment. Watch each check pass in real time.
              </p>
            </div>

            <div className={`space-y-1.5 font-mono text-[10px] rounded-xl border shadow-inner mt-4 p-4 ${
              isDarkMode ? 'bg-[#03050a] border-slate-900' : 'bg-slate-50 border-slate-200'
            }`}>
              {testVectors.map((vec, i) => (
                <div
                  key={vec.label}
                  className={`flex justify-between items-center py-0.5 transition-all duration-300 ${i <= testCycle ? 'text-[#10B981] font-semibold' : 'text-slate-400 dark:text-slate-850'}`}
                >
                  <span>✓ {vec.label}</span>
                  <span className="tabular-data text-[#8E9AA8]">{vec.time}s</span>
                </div>
              ))}
              <div className={`pt-2 mt-1 border-t flex justify-between text-[9px] uppercase font-bold tracking-wider ${
                isDarkMode ? 'border-slate-900' : 'border-slate-200'
              }`}>
                <span className="text-[#8E9AA8]">Coverage Rate:</span>
                <span className="text-[#00F5FF] tabular-data">100% RTL</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ PANEL 3: Fabrication Layer Explorer + Canvas (1-col) ═══ */}
        <div 
          onMouseMove={handleSpatialInteraction}
          onMouseLeave={resetSpatialInteraction}
          className={`${bento3DClass} border rounded-xl p-[1px] min-h-[300px] ${
            isDarkMode ? 'bg-slate-900/40 border-slate-900' : 'bg-slate-50/40 border-slate-200 shadow-sm'
          }`}
        >
          <div className="bento-card-inner p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-[#FF5F1F]" />
                <span className="text-[9px] font-mono text-[#8E9AA8] uppercase tracking-wider block">03 // Physical layer</span>
              </div>
              <h3 className={`text-lg font-bold tracking-tight uppercase ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Fabrication Rules</h3>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-[#8E9AA8]' : 'text-slate-600'}`}>
                Confront realistic hardware limitations. Hover over the choices below to view structural constraints and layer properties.
              </p>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex gap-1.5 font-mono text-[10px] font-bold" role="tablist" aria-label="Fabrication Layer Selector">
                {(['METAL1', 'POLY', 'VIA'] as const).map((layer) => (
                  <button
                    key={layer}
                    role="tab"
                    aria-selected={activeLayer === layer}
                    onMouseEnter={() => setActiveLayer(layer)}
                    onFocus={() => setActiveLayer(layer)}
                    className={`px-2 py-1 rounded border transition-colors active-press focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00F5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03050a] ${
                      activeLayer === layer
                        ? ''
                        : (isDarkMode ? 'bg-slate-950 border-slate-900 text-[#8E9AA8]' : 'bg-white border-slate-200 text-slate-500')
                    }`}
                    style={activeLayer === layer ? { backgroundColor: `${fabData[layer].color}12`, borderColor: fabData[layer].color, color: fabData[layer].color } : undefined}
                  >
                    {layer}
                  </button>
                ))}
              </div>

              {/* Canvas-rendered layer visualization with grid sweep */}
              <div className={`relative overflow-hidden rounded-lg border ${isDarkMode ? 'border-slate-900' : 'border-slate-200'}`}>
                <div className="absolute inset-y-0 w-[1.5px] bg-[#00F5FF]/45 shadow-[0_0_8px_#00F5FF] grid-sweep-line pointer-events-none" />
                <canvas
                  ref={canvasRef}
                  className="w-full rounded-lg block"
                  style={{ height: '64px' }}
                  aria-label={`${activeLayer} layer visualization`}
                  role="img"
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLayer}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={`p-2.5 rounded-lg border font-mono text-[10px] text-[#8E9AA8] flex justify-between items-center w-full ${
                    isDarkMode ? 'bg-[#03050a] border-slate-900' : 'bg-slate-50 border-slate-200 shadow-sm'
                  }`}
                  role="tabpanel"
                >
                  <span className="uppercase tracking-wider">Metrics:</span>
                  <span className="font-bold tabular-data" style={{ color: fabData[activeLayer].color }}>
                    {fabData[activeLayer].value}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ═══ PANEL 4: Career Domain Intelligence Matrix (2-col) ═══ */}
        <div 
          onMouseMove={handleSpatialInteraction}
          onMouseLeave={resetSpatialInteraction}
          className={`${bento3DClass} md:col-span-2 border rounded-xl p-[1px] min-h-[300px] ${
            isDarkMode ? 'bg-slate-900/40 border-slate-900' : 'bg-slate-50/40 border-slate-200 shadow-sm'
          }`}
        >
          <div className="bento-card-inner p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Monitor size={14} className="text-[#00F5FF]" />
                <span className="text-[9px] font-mono text-[#8E9AA8] uppercase tracking-wider block">04 // Career maps</span>
              </div>
              <h3 className={`text-lg font-bold tracking-tight uppercase ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Industry Placement Tracks</h3>
              <p className={`text-xs leading-relaxed max-w-[55ch] ${isDarkMode ? 'text-[#8E9AA8]' : 'text-slate-600'}`}>
                Review detailed salary data, required tool expertise, and career trajectories across leading hardware engineering domains.
              </p>
            </div>

            <div className={`overflow-x-auto rounded-xl border mt-6 ${
              isDarkMode ? 'bg-[#03050a] border-slate-900' : 'bg-slate-50 border-slate-200'
            }`}>
              <table className="w-full font-mono text-[9px] text-left min-w-[340px] tabular-data">
                <thead>
                  <tr className={`uppercase tracking-wider text-slate-500 border-b ${
                    isDarkMode ? 'border-slate-900' : 'border-slate-200'
                  }`}>
                    <th className="py-2.5 px-4 font-bold">Domain Vertical</th>
                    <th className="py-2.5 px-4 font-bold">Avg Package</th>
                    <th className="py-2.5 px-4 font-bold text-center">Mastery Index</th>
                    <th className="py-2.5 px-4 font-bold text-right">Target Layer</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-900/60' : 'divide-slate-200/60'}`}>
                  {[
                    { d: 'ASIC/FPGA Design', s: '₹14.2L', m: 'HIGH', l: 'RTL Verilog' },
                    { d: 'Physical Design', s: '₹18.5L', m: 'CRITICAL', l: 'GDSII Layout' },
                    { d: 'Verification Eng', s: '₹12.0L', m: 'MEDIUM', l: 'SystemVerilog' }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-500/[0.02] transition-colors">
                      <td className={`py-3 px-4 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.d}</td>
                      <td className="py-3 px-4 text-[#FF5F1F] font-bold">{row.s}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                          row.m === 'CRITICAL' 
                            ? 'bg-[#FF5F1F]/10 text-[#FF5F1F]' 
                            : row.m === 'HIGH' 
                              ? 'bg-[#00F5FF]/10 text-[#00F5FF]' 
                              : 'bg-emerald-500/10 text-emerald-500'
                        }`}>{row.m}</span>
                      </td>
                      <td className={`py-3 px-4 text-right ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{row.l}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
