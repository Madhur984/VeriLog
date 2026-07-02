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
  const [autoToggle, setAutoToggle] = useState<boolean>(true); // Drifting Auto Pattern mode
  const [glitchActive, setGlitchActive] = useState<boolean>(false); // Metastability glitch state

  // Scope measurement metrics
  const [lastTpd, setLastTpd] = useState<number>(45); // ps
  const [setupCheck, setSetupCheck] = useState<'PASS' | 'VIOLATION' | 'METASTABLE'>('PASS');
  const [violationCount, setViolationCount] = useState<number>(0);

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

  // Refs to sync control state for the animation loop
  const frequencyRef = useRef<number>(frequency);
  const jitterRef = useRef<number>(jitter);
  const triggerEdgeRef = useRef<'rising' | 'falling'>(triggerEdge);
  const inputBitRef = useRef<number>(inputBit);
  const isResetActiveRef = useRef<boolean>(isResetActive);
  const simulationSpeedRef = useRef<number>(simulationSpeed);
  const autoToggleRef = useRef<boolean>(autoToggle);

  // Glitch tracking refs
  const lastToggleTimes = useRef<number[]>([]);
  const glitchTimeRef = useRef<number>(0);

  // Metrics tracking refs to prevent re-renders restarting the animation loop
  const lastSetupCheckState = useRef<'PASS' | 'VIOLATION' | 'METASTABLE'>('PASS');
  const lastTpdState = useRef<number>(45);
  const violationCountRef = useRef<number>(0);
  const maxDataPointsRef = useRef<number>(600);

  // Sync refs when states change:
  useEffect(() => { frequencyRef.current = frequency; }, [frequency]);
  useEffect(() => { jitterRef.current = jitter; }, [jitter]);
  useEffect(() => { triggerEdgeRef.current = triggerEdge; }, [triggerEdge]);
  useEffect(() => { inputBitRef.current = inputBit; }, [inputBit]);
  useEffect(() => { isResetActiveRef.current = isResetActive; }, [isResetActive]);
  useEffect(() => { simulationSpeedRef.current = simulationSpeed; }, [simulationSpeed]);
  useEffect(() => { autoToggleRef.current = autoToggle; }, [autoToggle]);

  // Handle manual D input button click with rapid toggle detection (glitch trigger)
  const handleManualToggle = (bit: number) => {
    if (bit === inputBit) return;
    setInputBit(bit);

    const now = Date.now();
    // Keep only toggles within the last 1 second
    lastToggleTimes.current = lastToggleTimes.current.filter(t => now - t < 1000);
    lastToggleTimes.current.push(now);

    // If toggled more than 3 times in 1 second, trigger a metastable glitch state!
    if (lastToggleTimes.current.length >= 3) {
      glitchTimeRef.current = 90; // active for 90 frames (~1.5s of unstable oscillation)
      setGlitchActive(true);
    }
  };

  // Trigger manual reset
  const handleReset = () => {
    setIsResetActive(true);
    triggerPulseTime.current = 10; // flash effect timer
    violationCountRef.current = 0;
    setViolationCount(0);
    glitchTimeRef.current = 0;
    setGlitchActive(false);
    setTimeout(() => setIsResetActive(false), 200);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // Use ResizeObserver for responsive canvas rendering without layout stretch or blurriness
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        maxDataPointsRef.current = Math.ceil(width);
      }
    });

    resizeObserver.observe(parent);

    // Timing parameter
    let t = 0;

    const animate = (_timestamp: number) => {
      t += 0.04 * simulationSpeedRef.current;
      timeRef.current = t;

      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Handle active glitch countdown
      if (glitchTimeRef.current > 0) {
        glitchTimeRef.current -= 1;
        if (glitchTimeRef.current === 0) {
          setGlitchActive(false);
        }
      }

      // Drifting Auto-Pattern mode or manual signal input injection
      let currentInputBit = inputBitRef.current;
      if (autoToggleRef.current) {
        // Toggle DIN at a slightly offset frequency to create drifting setup/hold relative to clock
        const clkPeriod = (2 * Math.PI) / (frequencyRef.current * 0.4);
        const dinPeriod = clkPeriod * 2.13; // slightly offset from 2x clock period to drift
        const dinPhase = t % dinPeriod;
        currentInputBit = dinPhase < dinPeriod / 2 ? 1 : 0;
      }

      // Track if D input changed on this frame
      if (currentInputBit !== lastInputBit.current) {
        lastDChangeTime.current = t;
        lastInputBit.current = currentInputBit;
      }

      // Base Frequency Period Calculations
      const clkPeriod = (2 * Math.PI) / (frequencyRef.current * 0.4);
      const currentPhase = t % clkPeriod;
      const halfPeriod = clkPeriod / 2;

      // Track phase transitions to update jitter offsets once per cycle/half-cycle
      const prevPhase = lastPhase.current;
      lastPhase.current = currentPhase;

      // Jitter range based on frequency period
      const jitterFactor = jitterRef.current * halfPeriod * 0.5;

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
      const rstVal = isResetActiveRef.current ? 1 : 0;

      // Latch output Q on active clock edge (Sequential logic D Flip-Flop simulation)
      let nextQ = lastQVal.current;
      if (rstVal === 1) {
        nextQ = 0;
        if (lastSetupCheckState.current !== 'PASS') {
          lastSetupCheckState.current = 'PASS';
          setSetupCheck('PASS');
        }
      } else if (glitchTimeRef.current > 0) {
        // Metastable state: output Q oscillates dynamically and randomly
        if (Math.random() < 0.25) {
          nextQ = Math.random() > 0.5 ? 1 : 0;
        }
        if (lastSetupCheckState.current !== 'METASTABLE') {
          lastSetupCheckState.current = 'METASTABLE';
          setSetupCheck('METASTABLE');
        }
      } else {
        const edgeDetected = triggerEdgeRef.current === 'rising'
          ? (clkWithJitter === 1 && lastClkVal.current === 0)
          : (clkWithJitter === 0 && lastClkVal.current === 1);

        if (edgeDetected) {
          // Check for setup time violations (how close was the clock edge to input D changing?)
          const setupWindow = 0.35; // time units
          const timeSinceDChange = t - lastDChangeTime.current;
          
          let newSetupCheck: 'PASS' | 'VIOLATION' | 'METASTABLE' = 'PASS';
          let newTpd = lastTpdState.current;

          if (timeSinceDChange < setupWindow) {
            newSetupCheck = 'VIOLATION';
            newTpd = Math.floor(140 + Math.random() * 110); // Metamorphic longer delay
            // Latch metadata or enter unstable state (random latch in metastability)
            nextQ = Math.random() >= 0.5 ? 1 : 0;

            // Increment violation counter
            violationCountRef.current += 1;
            setViolationCount(violationCountRef.current);
          } else {
            newSetupCheck = 'PASS';
            newTpd = Math.floor(35 + Math.random() * 15); // Fast clean delay
            nextQ = currentInputBit;
          }

          if (newSetupCheck !== lastSetupCheckState.current) {
            lastSetupCheckState.current = newSetupCheck;
            setSetupCheck(newSetupCheck);
          }
          if (newTpd !== lastTpdState.current) {
            lastTpdState.current = newTpd;
            setLastTpd(newTpd);
          }
        }
      }

      lastClkVal.current = clkWithJitter;
      lastQVal.current = nextQ;

      // Push history
      traceData.current.clk.push(clkWithJitter);
      traceData.current.din.push(currentInputBit);
      traceData.current.q.push(nextQ);
      traceData.current.rst.push(rstVal);

      // Keep trace window bounded
      const limit = maxDataPointsRef.current;
      while (traceData.current.clk.length > limit) {
        traceData.current.clk.shift();
        traceData.current.din.shift();
        traceData.current.q.shift();
        traceData.current.rst.shift();
      }

      // Draw Oscilloscope background and grid using computed styles
      const computedStyle = window.getComputedStyle(canvas);
      const scopeBg = computedStyle.getPropertyValue('--scope-bg').trim() || '#07080A';
      const scopeGrid = computedStyle.getPropertyValue('--scope-grid').trim() || 'rgba(16, 185, 129, 0.04)';
      const scopeRef = computedStyle.getPropertyValue('--scope-ref').trim() || 'rgba(255, 255, 255, 0.03)';
      const scopeClk = computedStyle.getPropertyValue('--scope-clk').trim() || '#22D3EE';
      const scopeDin = computedStyle.getPropertyValue('--scope-din').trim() || '#F59E0B';
      const scopeQ = computedStyle.getPropertyValue('--scope-q').trim() || '#10B981';
      const scopeRst = computedStyle.getPropertyValue('--scope-rst').trim() || '#EF4444';
      const scopeText = computedStyle.getPropertyValue('--scope-text').trim() || 'rgba(255, 255, 255, 0.4)';

      ctx.fillStyle = scopeBg;
      ctx.fillRect(0, 0, width, height);

      // Draw Grid Lines ( phosphor tint, very faint)
      ctx.strokeStyle = scopeGrid;
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
      ctx.strokeStyle = scopeRef;
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
        glowColor: string,
        isQTrace?: boolean
      ) => {
        if (data.length < 2) return;
        
        const isGlitchQ = isQTrace && glitchTimeRef.current > 0;

        if (isGlitchQ) {
          ctx.strokeStyle = scopeDin; // metastable orange/din color
          ctx.shadowColor = scopeDin;
          ctx.shadowBlur = 15 + Math.random() * 8;
        } else {
          ctx.strokeStyle = color;
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 8;
        }
        
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'miter';

        ctx.beginPath();
        const startX = width - data.length;
        data.forEach((val, index) => {
          const x = startX + index;
          let y = yCenter - (val * amplitude - amplitude / 2);
          
          if (isGlitchQ) {
            // Apply high frequency physical noise coordinates
            y += (Math.random() - 0.5) * 8;
          }

          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            // Draw clean vertical transitions for digital logic waveforms
            const prevVal = data[index - 1];
            let prevY = yCenter - (prevVal * amplitude - amplitude / 2);
            if (isGlitchQ) {
              prevY += (Math.random() - 0.5) * 8;
            }
            if (prevVal !== val) {
              ctx.lineTo(x, prevY); // Vertical step edge
            }
            ctx.lineTo(x, y);
          }
        });
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      };

      // Draw signals dynamically
      const sectionHeight = height / 4;
      drawSignalTrace(traceData.current.clk, sectionHeight * 0.8, 30, scopeClk, scopeClk);
      drawSignalTrace(traceData.current.din, sectionHeight * 1.8, 30, scopeDin, scopeDin);
      drawSignalTrace(traceData.current.q, sectionHeight * 2.8, 30, scopeQ, scopeQ, true);
      drawSignalTrace(traceData.current.rst, sectionHeight * 3.8, 20, scopeRst, scopeRst);

      // Signal Label Decals on the Left Margin
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = scopeClk; ctx.fillText('CLK (CLOCK_IN)', 10, sectionHeight * 0.8 - 20);
      ctx.fillStyle = scopeDin; ctx.fillText('D   (DATA_IN)', 10, sectionHeight * 1.8 - 20);
      ctx.fillStyle = scopeQ; ctx.fillText('Q   (REG_OUT)', 10, sectionHeight * 2.8 - 20);
      ctx.fillStyle = scopeRst; ctx.fillText('RST (ASYNC_RESET)', 10, sectionHeight * 3.8 - 20);

      // Trigger status HUD
      ctx.font = '8px monospace';
      ctx.fillStyle = scopeText;
      ctx.fillText(`CH1 Freq: ${frequencyRef.current.toFixed(1)} Hz`, width - 110, sectionHeight * 0.8 - 20);
      ctx.fillText(`Setup Slack: ${lastSetupCheckState.current === 'PASS' ? '+180 ps' : '-45 ps'}`, width - 110, sectionHeight * 1.8 - 20);
      ctx.fillText(`Jitter: ${(jitterRef.current * 100).toFixed(0)}%`, width - 110, sectionHeight * 2.8 - 20);

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(requestRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="w-full bg-bg-elev border border-border-soft p-6 font-mono text-xs text-text-sub select-none shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
      {/* HUD Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border-soft mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-signal-core rounded-full animate-ping" />
          <span className="text-text-main font-bold tracking-wider uppercase text-[10px]">
            BitforBytes // Logic Scope Probe V1.0
          </span>
        </div>
        
        {/* Real-time Hardware Metrics Display */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-text-dim uppercase tracking-widest">CLK Edge Delay</span>
            <span className="text-signal-core font-bold tracking-tight text-sm">
              {lastTpd} <span className="text-[9px] text-text-dim font-normal">ps</span>
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[8px] text-text-dim uppercase tracking-widest">Setup Status</span>
            <span className={`font-bold tracking-tight text-sm ${
              setupCheck === 'PASS' 
                ? 'text-emerald-400' 
                : setupCheck === 'METASTABLE' 
                ? 'text-amber-500 animate-pulse'
                : 'text-rose-500 animate-pulse'
            }`}>
              {setupCheck}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[8px] text-text-dim uppercase tracking-widest">Violations</span>
            <span className={`font-bold tracking-tight text-sm ${violationCount > 0 ? 'text-rose-400 animate-pulse' : 'text-text-dim'}`}>
              {violationCount}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Control Panel (Left/Asymmetric) + Scope Display (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Controls Layout */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6 p-5 bg-bg-base/40 border border-border-soft">
          
          {/* Signal Injection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-signal-core" />
              <span className="text-text-main font-bold text-[10px] uppercase tracking-wider">Signal Injection</span>
            </div>

            {/* Pattern Mode Toggle */}
            <div className="grid grid-cols-2 p-1 bg-bg-base/60 border border-border-soft">
              <button
                onClick={() => setAutoToggle(false)}
                className={`py-1.5 text-[9px] font-bold uppercase transition-all cursor-pointer ${
                  !autoToggle ? 'bg-accent-orange text-white' : 'text-text-dim hover:text-text-main'
                }`}
              >
                Manual
              </button>
              <button
                onClick={() => setAutoToggle(true)}
                className={`py-1.5 text-[9px] font-bold uppercase transition-all cursor-pointer ${
                  autoToggle ? 'bg-accent-orange text-white' : 'text-text-dim hover:text-text-main'
                }`}
              >
                Auto Drift
              </button>
            </div>
            
            {!autoToggle ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleManualToggle(1)}
                  className={`py-3 px-4 text-center font-bold transition-all relative border cursor-pointer hover:bg-bg-base/60 ${
                    inputBit === 1 
                      ? 'border-accent-orange/50 bg-accent-orange/10 text-accent-orange' 
                      : 'border-border-soft text-text-dim'
                  }`}
                >
                  INPUT HIGH (1)
                </button>
                <button
                  onClick={() => handleManualToggle(0)}
                  className={`py-3 px-4 text-center font-bold transition-all relative border cursor-pointer hover:bg-bg-base/60 ${
                    inputBit === 0 
                      ? 'border-accent-orange/50 bg-accent-orange/10 text-accent-orange' 
                      : 'border-border-soft text-text-dim'
                  }`}
                >
                  INPUT LOW (0)
                </button>
              </div>
            ) : (
              <div className="py-3 px-4 text-center border border-accent-orange/25 bg-accent-orange/5 text-accent-orange/80 text-[10px] uppercase font-bold tracking-wider leading-relaxed">
                Auto signal active<br />
                <span className="text-[8px] text-text-dim lowercase normal-case">drifting phase relative to clock</span>
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full py-3 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center gap-2 font-bold tracking-widest cursor-pointer transition-all active:scale-[0.98]"
            >
              <RotateCcw size={12} />
              FORCE RESET (RST)
            </button>
          </div>

          {/* Clock parameters */}
          <div className="space-y-4 border-t border-border-soft pt-4">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-signal-core" />
              <span className="text-text-main font-bold text-[10px] uppercase tracking-wider">Clock Parameters</span>
            </div>

            {/* Frequency Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-text-dim uppercase">Frequency</span>
                <span className="text-text-main">{frequency.toFixed(1)} Hz</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full accent-signal-core cursor-pointer h-1 bg-border-soft rounded-full outline-none"
              />
            </div>

            {/* Edge Trigger Selection */}
            <div className="space-y-2">
              <span className="text-[10px] text-text-dim uppercase block mb-1">Active Register Trigger</span>
              <div className="grid grid-cols-2 p-1 bg-bg-base/60 border border-border-soft">
                <button
                  onClick={() => setTriggerEdge('rising')}
                  className={`py-1.5 text-[9px] font-bold uppercase transition-all cursor-pointer ${
                    triggerEdge === 'rising' ? 'bg-signal-core text-white dark:text-black' : 'text-text-dim hover:text-text-main'
                  }`}
                >
                  Rising Edge (↑)
                </button>
                <button
                  onClick={() => setTriggerEdge('falling')}
                  className={`py-1.5 text-[9px] font-bold uppercase transition-all cursor-pointer ${
                    triggerEdge === 'falling' ? 'bg-signal-core text-white dark:text-black' : 'text-text-dim hover:text-text-main'
                  }`}
                >
                  Falling Edge (↓)
                </button>
              </div>
            </div>
          </div>

          {/* Calibration Advanced */}
          <div className="space-y-4 border-t border-border-soft pt-4">
            <div className="flex items-center gap-2">
              <Settings size={14} className="text-signal-core" />
              <span className="text-text-main font-bold text-[10px] uppercase tracking-wider">Edge Setup Calibration</span>
            </div>

            {/* Jitter Jolt */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-text-dim uppercase">Clock Jitter / Noise</span>
                <span className="text-text-main">{(jitter * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={jitter}
                onChange={(e) => setJitter(parseFloat(e.target.value))}
                className="w-full accent-signal-core cursor-pointer h-1 bg-border-soft rounded-full outline-none"
              />
            </div>

            {/* Simulation Speed Toggle */}
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-text-dim uppercase">Sweep Speed</span>
              <div className="flex gap-2">
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSimulationSpeed(s)}
                    className={`px-2 py-0.5 border text-[9px] cursor-pointer hover:bg-bg-base/40 transition-all ${
                      simulationSpeed === s 
                        ? 'border-signal-core/50 bg-signal-core/10 text-signal-core font-bold' 
                        : 'border-border-soft text-text-dim'
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
          <div className="relative flex-1 min-h-[360px] border border-border-soft">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
            
            {/* Warning Alert Banner overlay for high-jitter or metastability glitch */}
            {(jitter > 0.45 || glitchActive) && (
              <div className="absolute top-4 left-4 right-4 bg-rose-950 border border-rose-500/30 p-3 flex items-center gap-3 z-30">
                <AlertCircle className="text-rose-500 animate-pulse flex-shrink-0" size={16} />
                <span className="text-[10px] text-rose-400 uppercase tracking-wide leading-tight">
                  {glitchActive 
                    ? "Input bounce overload! Flip-Flop entered meta-stable state (unstable oscillations)."
                    : "High clock jitter detected. Setup/hold times may be compromised, causing metastabilities."}
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Physics/ECE concept card underneath */}
      <div className="mt-6 p-4 bg-bg-base/40 border border-border-soft text-[11px] leading-relaxed text-text-dim">
        <span className="text-text-main font-bold uppercase tracking-wider block mb-1">ECE Lesson: Metastability & Flip-Flops</span>
        In sequential circuit design, data must remain stable at the input <span className="text-accent-orange">D</span> for a minimum duration (Setup Time, <span className="text-white">t_setup</span>) before the clock <span className="text-signal-core">CLK</span> edge transition. High jitter violates this stability, leading to timing violations where the registry registers an unpredictable output state.
      </div>
    </div>
  );
};
