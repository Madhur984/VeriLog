import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, AlertCircle, Cpu, Zap, Settings } from 'lucide-react';

interface SignalState {
  clk: number[];
  din: number[];
  q: number[];
  rst: number[];
}

export const LogicTraceScope: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Interactive parameters
  const [frequency, setFrequency] = useState<number>(5); // Hz
  const [jitter, setJitter] = useState<number>(0.15); // Jitter percentage
  const [triggerEdge, setTriggerEdge] = useState<'rising' | 'falling'>('rising');
  const [inputBit, setInputBit] = useState<number>(1);
  const [isResetActive, setIsResetActive] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1); // 1x, 2x, 0.5x

  // Scope measurement metrics
  const [lastTpd, setLastTpd] = useState<number>(45); // ps
  const [setupCheck, setSetupCheck] = useState<'PASS' | 'VIOLATION'>('PASS');

  // Internal states for animation loop
  const requestRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  
  // Keep track of trace points
  const traceData = useRef<SignalState>({
    clk: [],
    din: [],
    q: [],
    rst: []
  });

  const lastClkVal = useRef<number>(0);
  const lastQVal = useRef<number>(0);
  const triggerPulseTime = useRef<number>(0);

  // Setup/Hold violation tracking refs
  const lastDChangeTime = useRef<number>(-999);
  const lastInputBit = useRef<number>(1);
  const lastPhase = useRef<number>(0);
  const risingJitterOffset = useRef<number>(0);
  const fallingJitterOffset = useRef<number>(0);

  // Trigger manual reset
  const handleReset = () => {
    setIsResetActive(true);
    triggerPulseTime.current = 10; // flash effect timer
    setTimeout(() => setIsResetActive(false), 200);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI screens
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Timing parameters
    let t = 0;
    const maxDataPoints = 600;

    const animate = (timestamp: number) => {
      t += 0.04 * simulationSpeed;
      timeRef.current = t;

      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Track if D input changed on this frame
      if (inputBit !== lastInputBit.current) {
        lastDChangeTime.current = t;
        lastInputBit.current = inputBit;
      }

      // Base Frequency Period Calculations
      // At frequency = 5, period = 2 * PI / (5 * 0.4) = 3.14 time units
      const clkPeriod = (2 * Math.PI) / (frequency * 0.4);
      const currentPhase = t % clkPeriod;
      const halfPeriod = clkPeriod / 2;

      // Track phase transitions to update jitter offsets once per cycle/half-cycle
      const prevPhase = lastPhase.current;
      lastPhase.current = currentPhase;

      // Jitter range based on frequency period
      const jitterFactor = jitter * halfPeriod * 0.5;

      if (currentPhase < prevPhase) {
        // Wrapped around: calculate rising edge jitter for next transition
        risingJitterOffset.current = (Math.random() - 0.5) * jitterFactor;
      }
      if (prevPhase < halfPeriod && currentPhase >= halfPeriod) {
        // Crossed half period: calculate falling edge jitter for next transition
        fallingJitterOffset.current = (Math.random() - 0.5) * jitterFactor;
      }

      // Determine clk value based on jittered edge thresholds
      const rEdge = Math.max(0, risingJitterOffset.current);
      const fEdge = Math.min(clkPeriod, halfPeriod + fallingJitterOffset.current);

      let clkWithJitter = 0;
      if (currentPhase >= rEdge && currentPhase < fEdge) {
        clkWithJitter = 1;
      } else {
        clkWithJitter = 0;
      }

      // Reset logic
      const rstVal = isResetActive ? 1 : 0;

      // Latch output Q on active clock edge (Sequential logic D Flip-Flop simulation)
      let nextQ = lastQVal.current;
      if (rstVal === 1) {
        nextQ = 0;
        setSetupCheck('PASS');
      } else {
        const edgeDetected = triggerEdge === 'rising'
          ? (clkWithJitter === 1 && lastClkVal.current === 0)
          : (clkWithJitter === 0 && lastClkVal.current === 1);

        if (edgeDetected) {
          // Check for setup time violations (how close was the clock edge to input D changing?)
          const setupWindow = 0.35; // time units
          const timeSinceDChange = t - lastDChangeTime.current;
          
          if (timeSinceDChange < setupWindow) {
            setSetupCheck('VIOLATION');
            setLastTpd(Math.floor(140 + Math.random() * 110)); // Metamorphic longer delay
            // Latch metadata or enter unstable state (random latch in metastability)
            nextQ = Math.random() >= 0.5 ? 1 : 0;
          } else {
            setSetupCheck('PASS');
            setLastTpd(Math.floor(35 + Math.random() * 15)); // Fast clean delay
            nextQ = inputBit;
          }
        }
      }

      lastClkVal.current = clkWithJitter;
      lastQVal.current = nextQ;

      // Push history
      traceData.current.clk.push(clkWithJitter);
      traceData.current.din.push(inputBit);
      traceData.current.q.push(nextQ);
      traceData.current.rst.push(rstVal);

      // Keep trace window bounded
      if (traceData.current.clk.length > maxDataPoints) {
        traceData.current.clk.shift();
        traceData.current.din.shift();
        traceData.current.q.shift();
        traceData.current.rst.shift();
      }

      // Draw Oscilloscope background and grid
      ctx.fillStyle = '#07080A';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid Lines (Green phosphor tint, very faint)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Horizontal baselines and trigger reference lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, height * 0.25); ctx.lineTo(width, height * 0.25);
      ctx.moveTo(0, height * 0.5); ctx.lineTo(width, height * 0.5);
      ctx.moveTo(0, height * 0.75); ctx.lineTo(width, height * 0.75);
      ctx.stroke();
      ctx.setLineDash([]);

      // Trigger Pulse Indicator glow
      if (triggerPulseTime.current > 0) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.05)';
        ctx.fillRect(0, 0, width, height);
        triggerPulseTime.current -= 1;
      }

      // Plot timing diagrams
      const drawSignalTrace = (
        data: number[], 
        yCenter: number, 
        amplitude: number, 
        color: string, 
        glowColor: string
      ) => {
        if (data.length < 2) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'miter';

        // Outer glow path for oscilloscope phosphor effect
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        const startX = width - data.length;
        data.forEach((val, index) => {
          const x = startX + index;
          const y = yCenter - (val * amplitude - amplitude / 2);
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            // Draw clean vertical transitions for digital logic waveforms
            const prevVal = data[index - 1];
            const prevX = startX + index - 1;
            const prevY = yCenter - (prevVal * amplitude - amplitude / 2);
            if (prevVal !== val) {
              ctx.lineTo(x, prevY); // Vertical step edge
            }
            ctx.lineTo(x, y);
          }
        });
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      };

      // Draw signals: CLK (Cyan), DIN (Amber), Q (Emerald), RST (Red)
      const sectionHeight = height / 4;
      drawSignalTrace(traceData.current.clk, sectionHeight * 0.8, 30, '#22D3EE', 'rgba(34, 211, 238, 0.5)');
      drawSignalTrace(traceData.current.din, sectionHeight * 1.8, 30, '#F59E0B', 'rgba(245, 158, 11, 0.5)');
      drawSignalTrace(traceData.current.q, sectionHeight * 2.8, 30, '#10B981', 'rgba(16, 185, 129, 0.5)');
      drawSignalTrace(traceData.current.rst, sectionHeight * 3.8, 20, '#EF4444', 'rgba(239, 68, 68, 0.5)');

      // Signal Label Decals on the Left Margin
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#22D3EE'; ctx.fillText('CLK (CLOCK_IN)', 10, sectionHeight * 0.8 - 20);
      ctx.fillStyle = '#F59E0B'; ctx.fillText('D   (DATA_IN)', 10, sectionHeight * 1.8 - 20);
      ctx.fillStyle = '#10B981'; ctx.fillText('Q   (REG_OUT)', 10, sectionHeight * 2.8 - 20);
      ctx.fillStyle = '#EF4444'; ctx.fillText('RST (ASYNC_RESET)', 10, sectionHeight * 3.8 - 20);

      // Trigger status HUD
      ctx.font = '8px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillText(`CH1 Freq: ${frequency.toFixed(1)} Hz`, width - 110, sectionHeight * 0.8 - 20);
      ctx.fillText(`Setup Slack: ${setupCheck === 'PASS' ? '+180 ps' : '-45 ps'}`, width - 110, sectionHeight * 1.8 - 20);
      ctx.fillText(`Jitter: ${(jitter * 100).toFixed(0)}%`, width - 110, sectionHeight * 2.8 - 20);

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [frequency, jitter, triggerEdge, inputBit, isResetActive, simulationSpeed, setupCheck]);

  return (
    <div className="w-full bg-[#090A0D] border border-white/[0.08] p-6 font-mono text-xs text-slate-400 select-none shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* HUD Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.06] mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-ping" />
          <span className="text-white font-bold tracking-wider uppercase text-[10px]">
            AXE-OR // Logic Scope Probe V1.0
          </span>
        </div>
        
        {/* Real-time Hardware Metrics Display */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-slate-500 uppercase tracking-widest">CLK Edge Delay</span>
            <span className="text-cyan-400 font-bold tracking-tight text-sm">
              {lastTpd} <span className="text-[9px] text-slate-500 font-normal">ps</span>
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[8px] text-slate-500 uppercase tracking-widest">Setup Status</span>
            <span className={`font-bold tracking-tight text-sm ${setupCheck === 'PASS' ? 'text-emerald-400' : 'text-rose-500 animate-pulse'}`}>
              {setupCheck}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Control Panel (Left/Asymmetric) + Scope Display (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Controls Layout */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6 p-5 bg-white/[0.01] border border-white/[0.04]">
          
          {/* Signal Injection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-cyan-400" />
              <span className="text-white font-bold text-[10px] uppercase tracking-wider">Signal Injection</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setInputBit(1)}
                className={`py-3 px-4 text-center font-bold transition-all relative border cursor-pointer hover:bg-white/[0.03] ${
                  inputBit === 1 
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' 
                    : 'border-white/[0.08] text-slate-500'
                }`}
              >
                INPUT HIGH (1)
              </button>
              <button
                onClick={() => setInputBit(0)}
                className={`py-3 px-4 text-center font-bold transition-all relative border cursor-pointer hover:bg-white/[0.03] ${
                  inputBit === 0 
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' 
                    : 'border-white/[0.08] text-slate-500'
                }`}
              >
                INPUT LOW (0)
              </button>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center gap-2 font-bold tracking-widest cursor-pointer transition-all active:scale-[0.98]"
            >
              <RotateCcw size={12} />
              FORCE RESET (RST)
            </button>
          </div>

          {/* Clock parameters */}
          <div className="space-y-4 border-t border-white/[0.04] pt-4">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-cyan-400" />
              <span className="text-white font-bold text-[10px] uppercase tracking-wider">Clock Parameters</span>
            </div>

            {/* Frequency Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500 uppercase">Frequency</span>
                <span className="text-white">{frequency.toFixed(1)} Hz</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1 bg-white/[0.08] rounded-full outline-none"
              />
            </div>

            {/* Edge Trigger Selection */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Active Register Trigger</span>
              <div className="grid grid-cols-2 p-1 bg-white/[0.02] border border-white/[0.08]">
                <button
                  onClick={() => setTriggerEdge('rising')}
                  className={`py-1.5 text-[9px] font-bold uppercase transition-all cursor-pointer ${
                    triggerEdge === 'rising' ? 'bg-cyan-400 text-black' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Rising Edge (↑)
                </button>
                <button
                  onClick={() => setTriggerEdge('falling')}
                  className={`py-1.5 text-[9px] font-bold uppercase transition-all cursor-pointer ${
                    triggerEdge === 'falling' ? 'bg-cyan-400 text-black' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Falling Edge (↓)
                </button>
              </div>
            </div>
          </div>

          {/* Calibration Advanced */}
          <div className="space-y-4 border-t border-white/[0.04] pt-4">
            <div className="flex items-center gap-2">
              <Settings size={14} className="text-cyan-400" />
              <span className="text-white font-bold text-[10px] uppercase tracking-wider">Edge Setup Calibration</span>
            </div>

            {/* Jitter Jolt */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500 uppercase">Clock Jitter / Noise</span>
                <span className="text-white">{(jitter * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={jitter}
                onChange={(e) => setJitter(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1 bg-white/[0.08] rounded-full outline-none"
              />
            </div>

            {/* Simulation Speed Toggle */}
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500 uppercase">Sweep Speed</span>
              <div className="flex gap-2">
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSimulationSpeed(s)}
                    className={`px-2 py-0.5 border text-[9px] cursor-pointer hover:bg-white/[0.03] transition-all ${
                      simulationSpeed === s 
                        ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-400 font-bold' 
                        : 'border-white/[0.08] text-slate-500'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Oscilloscope View Display */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="relative flex-1 min-h-[360px] border border-white/[0.08]">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
            
            {/* Warning Alert Banner overlay for high-jitter */}
            {jitter > 0.45 && (
              <div className="absolute top-4 left-4 right-4 bg-rose-500/10 border border-rose-500/30 p-3 flex items-center gap-3 backdrop-blur-md">
                <AlertCircle className="text-rose-500 animate-pulse flex-shrink-0" size={16} />
                <span className="text-[10px] text-rose-400 uppercase tracking-wide leading-tight">
                  High clock jitter detected. Setup/hold times may be compromised, causing metastabilities.
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Physics/ECE concept card underneath */}
      <div className="mt-6 p-4 bg-white/[0.01] border border-white/[0.06] text-[11px] leading-relaxed text-slate-500">
        <span className="text-white font-bold uppercase tracking-wider block mb-1">ECE Lesson: Metastability & Flip-Flops</span>
        In sequential circuit design, data must remain stable at the input <span className="text-amber-400">D</span> for a minimum duration (Setup Time, <span className="text-white">t_setup</span>) before the clock <span className="text-cyan-400">CLK</span> edge transition. High jitter violates this stability, leading to timing violations where the registry registers an unpredictable output state.
      </div>
    </div>
  );
};
