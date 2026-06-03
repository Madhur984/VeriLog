import React, { useState, useEffect, useRef } from 'react';
import { FileCode, ShieldCheck, Layers, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type FabLayer = 'METAL1' | 'POLY' | 'VIA';

/**
 * PremiumBentoFeatures — Asymmetric Interactive Feature Grid
 *
 * Four-panel bento layout with dopamine-driven micro-interactions:
 *  Panel 1 (2-col): Click-to-compute NAND gate synthesis with live output
 *  Panel 2 (1-col): Auto-cycling testbench assertion stream
 *  Panel 3 (1-col): Hover-to-explore semiconductor layer switcher + canvas
 *  Panel 4 (2-col): Career domain intelligence matrix
 *
 * Design tokens aligned to the Silicon Workstation palette.
 * All numeric readouts use tabular-nums for zero-jitter layout.
 */
export const PremiumBentoFeatures: React.FC = () => {
  // Panel 1: Logic gate interactive state
  const [gateA, setGateA] = useState(true);
  const [gateB, setGateB] = useState(false);
  const nandOut = !(gateA && gateB);

  // Panel 2: Auto-cycling testbench assertion index
  const [testCycle, setTestCycle] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTestCycle(p => (p + 1) % 5), 1100);
    return () => clearInterval(interval);
  }, []);

  // Panel 3: Fabrication layer hover selector
  const [activeLayer, setActiveLayer] = useState<FabLayer>('METAL1');

  // Panel 3: Canvas-based layer visualization
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
    ctx.fillStyle = '#03050a';
    ctx.fillRect(0, 0, w, h);

    // Substrate grid
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.3)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 12) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 12) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Layer-specific rendering
    if (activeLayer === 'METAL1') {
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.7)';
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
      ctx.fillStyle = 'rgba(34, 211, 238, 0.6)';
      ctx.fillText('M1_ROUTE', 14, 14);
    } else if (activeLayer === 'POLY') {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 1;
      const blocks = [
        { x: w * 0.08, y: h * 0.15, w: w * 0.25, h: h * 0.35 },
        { x: w * 0.45, y: h * 0.45, w: w * 0.4, h: h * 0.4 },
        { x: w * 0.6, y: h * 0.08, w: w * 0.2, h: h * 0.22 },
      ];
      blocks.forEach(b => { ctx.fillRect(b.x, b.y, b.w, b.h); ctx.strokeRect(b.x, b.y, b.w, b.h); });
      ctx.font = '8px monospace';
      ctx.fillStyle = 'rgba(245, 158, 11, 0.6)';
      ctx.fillText('POLY_GATE', w * 0.08 + 4, h * 0.15 + 12);
    } else {
      // VIA contacts
      ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
      const vias = [
        { x: w * 0.2, y: h * 0.25 }, { x: w * 0.45, y: h * 0.5 },
        { x: w * 0.7, y: h * 0.3 }, { x: w * 0.35, y: h * 0.7 },
        { x: w * 0.8, y: h * 0.65 }, { x: w * 0.55, y: h * 0.15 },
      ];
      vias.forEach(v => {
        ctx.beginPath(); ctx.arc(v.x, v.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(v.x, v.y, 8, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.font = '8px monospace';
      ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.fillText('VIA_ARRAY', 14, 14);
    }
  }, [activeLayer]);

  // Mouse spotlight handler — uses parent's CSS .bento-spotlight::before
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const testVectors = [
    { label: 'vec_001_initial_reset', time: '0.01' },
    { label: 'vec_002_max_vector_load', time: '0.08' },
    { label: 'vec_003_hold_skew_delta', time: '0.14' },
    { label: 'vec_004_edge_propagation', time: '0.22' },
  ];

  const fabData: Record<FabLayer, { metric: string; value: string; color: string }> = {
    METAL1: { metric: 'Routing Clearance', value: '14nm', color: '#22D3EE' },
    POLY:   { metric: 'Channel Length',    value: '5nm',  color: '#FFB000' },
    VIA:    { metric: 'Contact Resistance', value: '0.2\u03A9', color: '#10B981' },
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 max-w-[65ch]">
        <span className="text-[10px] font-mono text-[#22D3EE] uppercase tracking-widest block">
          // INTEGRATED WORKSPACE SPECIFICATIONS
        </span>
        <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-black tracking-tight text-white uppercase leading-[0.95]">
          Engineered for physical execution metrics.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ═══ PANEL 1: Interactive NAND Synthesis (2-col) ═══ */}
        <div onMouseMove={handleMouseMove} className="bento-spotlight md:col-span-2 bg-slate-900/40 border border-slate-900 rounded-xl p-[1px] min-h-[300px] transition-colors duration-200 hover:border-slate-800">
          <div className="bento-card-inner p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileCode size={14} className="text-[#22D3EE]" />
                <span className="text-[9px] font-mono text-[#8E9AA8] uppercase tracking-wider block">01 // VISUAL GRAPH SYNTHESIS</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 tracking-tight uppercase">Interactive Schematic Generation</h3>
              <p className="text-xs text-[#8E9AA8] leading-relaxed max-w-[58ch]">
                Verify how computational statements map onto physical silicon layers. Toggle parameters below to evaluate NAND gate states instantly — see the output logic recompute in real time.
              </p>
            </div>

            <div className="bg-[#03050a] border border-slate-900 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 shadow-inner">
              <div className="flex gap-2 font-mono text-xs">
                <button
                  onClick={() => setGateA(!gateA)}
                  aria-pressed={gateA}
                  aria-label={`Node A: ${gateA ? 'HIGH' : 'LOW'}`}
                  className={`px-3 py-2 rounded border font-semibold tracking-wide transition-all tabular-data focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00F5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03050a] ${gateA ? 'bg-[#22D3EE]/10 border-[#22D3EE] text-[#22D3EE]' : 'bg-slate-950 border-slate-900 text-[#8E9AA8]'}`}
                >
                  NODE_A = {gateA ? '1' : '0'}
                </button>
                <button
                  onClick={() => setGateB(!gateB)}
                  aria-pressed={gateB}
                  aria-label={`Node B: ${gateB ? 'HIGH' : 'LOW'}`}
                  className={`px-3 py-2 rounded border font-semibold tracking-wide transition-all tabular-data focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00F5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03050a] ${gateB ? 'bg-[#22D3EE]/10 border-[#22D3EE] text-[#22D3EE]' : 'bg-slate-950 border-slate-900 text-[#8E9AA8]'}`}
                >
                  NODE_B = {gateB ? '1' : '0'}
                </button>
              </div>

              <div className="font-mono text-xs text-[#8E9AA8] flex items-center gap-2">
                <span>Footprint:</span>
                <span className="text-white font-bold tracking-wider tabular-data">3 Cells</span>
              </div>

              <div className={`px-4 py-2 font-mono text-xs font-bold rounded border uppercase tracking-widest text-center tabular-data transition-colors ${nandOut ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981]' : 'bg-slate-950 border-slate-900 text-[#8E9AA8]'}`}>
                SIG_OUT = {nandOut ? '1' : '0'}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ PANEL 2: Live Testbench Assertion Stream (1-col) ═══ */}
        <div onMouseMove={handleMouseMove} className="bento-spotlight bg-slate-900/40 border border-slate-900 rounded-xl p-[1px] min-h-[300px] transition-colors duration-200 hover:border-slate-800">
          <div className="bento-card-inner p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#10B981]" />
                <span className="text-[9px] font-mono text-[#8E9AA8] uppercase tracking-wider block">02 // VERIFICATION ENGINE</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 tracking-tight uppercase">Assertion Testbenches</h3>
              <p className="text-xs text-[#8E9AA8] leading-relaxed">
                Watch continuous verification vectors execute in real time. Each assertion validates a distinct timing boundary in the simulation model.
              </p>
            </div>

            <div className="space-y-1.5 font-mono text-[10px] bg-[#03050a] p-4 rounded-xl border border-slate-900 shadow-inner mt-4">
              {testVectors.map((vec, i) => (
                <div
                  key={vec.label}
                  className={`flex justify-between items-center py-0.5 transition-all duration-300 ${i <= testCycle ? 'text-[#10B981]' : 'text-slate-800'}`}
                >
                  <span>[PASS] {vec.label}</span>
                  <span className="tabular-data text-[#8E9AA8]">{vec.time}ps</span>
                </div>
              ))}
              <div className="pt-2 mt-1 border-t border-slate-900 flex justify-between text-[9px] text-[#8E9AA8] uppercase font-bold tracking-wider">
                <span>Coverage Rate:</span>
                <span className="text-[#22D3EE] tabular-data">100% RTL</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ PANEL 3: Fabrication Layer Explorer + Canvas (1-col) ═══ */}
        <div onMouseMove={handleMouseMove} className="bento-spotlight bg-slate-900/40 border border-slate-900 rounded-xl p-[1px] min-h-[300px] transition-colors duration-200 hover:border-slate-800">
          <div className="bento-card-inner p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-[#FFB000]" />
                <span className="text-[9px] font-mono text-[#8E9AA8] uppercase tracking-wider block">03 // PHYSICAL FOUNDRY LAYOUT</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 tracking-tight uppercase">Geometry Constraints</h3>
              <p className="text-xs text-[#8E9AA8] leading-relaxed">
                Hover over fabrication parameters to explore trace widths, clearance paths, and via contact arrays.
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
                    className={`px-2 py-1 rounded border transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00F5FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03050a] ${activeLayer === layer
                      ? `bg-[${fabData[layer].color}]/10 border-[${fabData[layer].color}] text-[${fabData[layer].color}]`
                      : 'bg-slate-950 border-slate-900 text-[#8E9AA8]'}`}
                    style={activeLayer === layer ? { backgroundColor: `${fabData[layer].color}10`, borderColor: fabData[layer].color, color: fabData[layer].color } : undefined}
                  >
                    {layer}
                  </button>
                ))}
              </div>

              {/* Canvas-rendered layer visualization */}
              <canvas
                ref={canvasRef}
                className="w-full rounded-lg border border-slate-900"
                style={{ height: '64px' }}
                aria-label={`${activeLayer} layer visualization`}
                role="img"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLayer}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[#03050a] p-2.5 rounded-lg border border-slate-900 font-mono text-[10px] text-[#8E9AA8] flex justify-between items-center w-full"
                  role="tabpanel"
                >
                  <span className="uppercase tracking-wider">{fabData[activeLayer].metric}:</span>
                  <span className="font-bold tabular-data" style={{ color: fabData[activeLayer].color }}>
                    {fabData[activeLayer].value}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ═══ PANEL 4: Career Domain Intelligence Matrix (2-col) ═══ */}
        <div onMouseMove={handleMouseMove} className="bento-spotlight md:col-span-2 bg-slate-900/40 border border-slate-900 rounded-xl p-[1px] min-h-[300px] transition-colors duration-200 hover:border-slate-800">
          <div className="bento-card-inner p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Monitor size={14} className="text-[#22D3EE]" />
                <span className="text-[9px] font-mono text-[#8E9AA8] uppercase tracking-wider block">04 // SEMICONDUCTOR PLACEMENT MATRIX</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 tracking-tight uppercase">Direct Career Domain Intelligence</h3>
              <p className="text-xs text-[#8E9AA8] leading-relaxed max-w-[55ch]">
                Evaluate silicon engineering profiles across hardware verticals. Review salary boundaries, EDA mastery indexes, and enterprise trajectories mapped across 13 engineering disciplines.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-slate-900 pt-5 font-mono text-left">
              {[
                { label: 'ASIC Layout Core', value: 'High-Fidelity Integration', stat: '₹24L–48L' },
                { label: 'Logic Verification', value: 'Continuous Regression', stat: '₹18L–42L' },
                { label: 'FPGA Acceleration', value: 'Low-Level Pipelines', stat: '₹20L–38L' },
              ].map((col) => (
                <div key={col.label}>
                  <div className="text-[9px] text-[#8E9AA8] uppercase tracking-wider font-bold mb-1">{col.label}</div>
                  <div className="text-xs font-bold text-slate-200 uppercase tracking-wide">{col.value}</div>
                  <div className="text-[10px] text-[#22D3EE] tabular-data mt-1">{col.stat}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PremiumBentoFeatures;
