import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Signal {
  amplitude: number;
  frequency: number;
  phase: number;
  type?: string;
  samplingRate?: number;
  bitDepth?: number;
}

interface OscilloscopeProps {
  // Legacy support
  signalA?: Signal & { noise?: number };
  signalB?: Signal & { noise?: number };
  
  // New Comm System Simulator signals
  messageSignal?: Signal;
  carrierSignal?: Signal;
  modulation?: {
    depth: number;
    enabled: boolean;
  };
  interference?: {
    intensity: number;
    type: 'gaussian' | 'burst' | 'emi';
  };
  
  mode?: 'analog' | 'digital' | 'compare' | 'sum' | 'fft' | 'challenge' | 'modulation';
  channels?: {
    ch1?: boolean; // Message
    ch2?: boolean; // Carrier
    ch3?: boolean; // Modulated
    ch4?: boolean; // Noisy Output
  };
  isFrozen?: boolean;
  timeScrub?: number;
  className?: string;
  gridOpacity?: number;
  propagationDelay?: number;
  showEnvelope?: boolean;
  targetSignal?: Signal;
}

export const Oscilloscope: React.FC<OscilloscopeProps> = ({
  signalA,
  signalB,
  messageSignal,
  carrierSignal,
  modulation,
  interference,
  mode = 'analog',
  channels = { ch1: true, ch2: true, ch3: true, ch4: true },
  isFrozen = false,
  timeScrub = 0,
  className = "",
  gridOpacity = 0.05,
  propagationDelay = 0,
  showEnvelope = true,
  targetSignal
}) => {
  const [time, setTime] = useState(0);
  const requestRef = useRef<number>(0);
  const [bufferedState, setBufferedState] = useState({ signalA, signalB, messageSignal, carrierSignal, targetSignal });
  const delayTimeout = useRef<any>(null);

  // Sync buffered state with delay to simulate causality
  useEffect(() => {
    if (propagationDelay <= 0) {
      setBufferedState({ signalA, signalB, messageSignal, carrierSignal, targetSignal });
      return;
    }

    if (delayTimeout.current) clearTimeout(delayTimeout.current);
    delayTimeout.current = setTimeout(() => {
      setBufferedState({ signalA, signalB, messageSignal, carrierSignal, targetSignal });
    }, propagationDelay);

    return () => { if (delayTimeout.current) clearTimeout(delayTimeout.current); };
  }, [signalA, signalB, messageSignal, carrierSignal, targetSignal, propagationDelay]);

  const animate = (t: number) => {
    if (!isFrozen) {
      setTime(t / 1000);
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isFrozen]);

  const w = 400;
  const h = 200;
  const mid = h / 2;
  const currentTime = isFrozen ? timeScrub : time;

  const getNoiseDelta = (type: string, intensity: number, x: number, t: number) => {
    if (intensity <= 0) return 0;
    
    switch (type) {
      case 'gaussian':
        return (Math.random() - 0.5) * intensity * 60;
      case 'burst':
        // Periodic bursts of high intensity noise
        const burstInterval = Math.sin(t * 5 + x * 0.01) > 0.95;
        return burstInterval ? (Math.random() - 0.5) * intensity * 120 : 0;
      case 'emi':
        // High frequency sinusoidal interference
        return Math.sin(x * 0.5 + t * 50) * intensity * 20;
      default:
        return (Math.random() - 0.5) * intensity * 40;
    }
  };

  const generatePath = (s: any, isDigitalMode: boolean = false, noiseIntensity: number = 0, noiseType: string = 'gaussian') => {
    if (!s) return "";
    const points = isDigitalMode ? 40 : 120; // Increased points for realism
    let path = `M 0 ${mid}`;
    
    const timeOffset = currentTime * 2.5; // Slightly faster time flow for perception

    if (isDigitalMode) {
      const steps = Math.max(4, Math.floor((s.samplingRate || 20) / 2));
      const bitDepth = s.bitDepth || 8;
      const quantizationLevels = Math.pow(2, Math.min(bitDepth, 8));
      const stepWidth = w / steps;
      
      for (let i = 0; i < steps; i++) {
        const x = i * stepWidth;
        const phaseRad = (s.phase * Math.PI) / 180;
        
        const rawY = Math.sin((x * 0.05 * s.frequency) + phaseRad + timeOffset) * (s.amplitude * 70);
        const noiseVal = getNoiseDelta(noiseType, noiseIntensity || (s.noise || 0), x, currentTime);
        
        const stepHeight = 140 / quantizationLevels;
        const quantizedY = Math.round((rawY + noiseVal) / stepHeight) * stepHeight;
        
        const y = mid + quantizedY;
        path += ` L ${x} ${y} L ${(i + 1) * stepWidth} ${y}`;
      }
    } else {
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * w;
        const phaseRad = (s.phase * Math.PI) / 180;
        
        const noiseVal = getNoiseDelta(noiseType, noiseIntensity || (s.noise || 0), x, currentTime);
        const y = mid + Math.sin((x * 0.05 * s.frequency) + phaseRad + timeOffset) * (s.amplitude * 70) + noiseVal;
        path += ` L ${x} ${y}`;
      }
    }
    return path;
  };

  const generateSummedPath = () => {
    const sB = bufferedState.signalB;
    if (!sB) return "";
    const sA = bufferedState.signalA;
    if (!sA) return "";
    const points = 80;
    let path = `M 0 ${mid}`;
    const timeOffset = currentTime * 2;
    for (let i = 0; i <= points; i++) {
        const x = (i / points) * w;
        const phaseA = (sA.phase * Math.PI) / 180;
        const phaseB = (sB.phase * Math.PI) / 180;
        
        const yA = Math.sin((x * 0.05 * sA.frequency) + phaseA + timeOffset) * (sA.amplitude * 70);
        const yB = Math.sin((x * 0.05 * sB.frequency) + phaseB + timeOffset) * (sB.amplitude * 70);
        const noiseVal = sA.noise ? (Math.random() - 0.5) * sA.noise * 40 : 0;
        
        const y = mid + (yA + yB) / 2 + noiseVal;
        path += ` L ${x} ${y}`;
    }
    return path;
  };

  const renderFFT = () => {
    const sA = bufferedState.signalA;
    const sB = bufferedState.signalB;
    const bars = 40;
    const barWidth = (w / bars) * 0.8;
    const elements = [];

    if (!sA) return null;

    for (let i = 0; i < bars; i++) {
      const frequency = i / 2;
      let ampA = 0;
      let ampB = 0;

      if (Math.abs(frequency - sA.frequency) < 0.5) {
        ampA = sA.amplitude * 150 * (1 - Math.abs(frequency - sA.frequency) * 2);
      }
      if (sB && Math.abs(frequency - sB.frequency) < 0.5) {
        ampB = sB.amplitude * 150 * (1 - Math.abs(frequency - sB.frequency) * 2);
      }

      ampA += (sA.noise || 0) * Math.random() * 20;

      elements.push(
        <g key={i}>
          <rect
            x={i * (w / bars)}
            y={h - ampA}
            width={barWidth / 2}
            height={ampA}
            fill="var(--accent-primary)"
            className="opacity-80"
            style={{ filter: 'drop-shadow(0 0 5px var(--accent-primary))' }}
          />
          {sB && (
            <rect
              x={i * (w / bars) + barWidth / 2}
              y={h - ampB}
              width={barWidth / 2}
              height={ampB}
              fill="var(--accent-secondary)"
              className="opacity-40"
              style={{ filter: 'drop-shadow(0 0 5px var(--accent-secondary))' }}
            />
          )}
        </g>
      );
    }
    return elements;
  };

  const generateModulatedPaths = () => {
    const mS = bufferedState.messageSignal;
    const cS = bufferedState.carrierSignal;
    if (!mS || !cS || !modulation) return { modulated: "", noisy: "", envelopeUpper: "", envelopeLower: "" };

    const points = 200; // High resolution for modulated wave
    let modPath = `M 0 ${mid}`;
    let noisyPath = `M 0 ${mid}`;
    let envUpperPath = `M 0 ${mid}`;
    let envLowerPath = `M 0 ${mid}`;

    const timeOffset = currentTime * 2.5;
    const m = modulation.depth;

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * w;
      const mPhase = (mS.phase * Math.PI) / 180;
      const cPhase = (cS.phase * Math.PI) / 180;

      // modulated(t) = (1 + m * message(t)) * carrier(t)
      const messageVal = Math.sin((x * 0.05 * mS.frequency) + mPhase + timeOffset);
      const carrierVal = Math.sin((x * 0.05 * cS.frequency) + cPhase + timeOffset);
      
      const envelope = (1 + m * messageVal) * (cS.amplitude * 70);
      const yMod = mid + envelope * carrierVal;
      
      const noiseIntensity = interference?.intensity || 0;
      const noiseVal = getNoiseDelta(interference?.type || 'gaussian', noiseIntensity, x, currentTime);
      const yNoisy = yMod + noiseVal;

      modPath += ` L ${x} ${yMod}`;
      noisyPath += ` L ${x} ${yNoisy}`;
      envUpperPath += ` L ${x} ${mid - envelope}`;
      envLowerPath += ` L ${x} ${mid + envelope}`;
    }

    return { modulated: modPath, noisy: noisyPath, envelopeUpper: envUpperPath, envelopeLower: envLowerPath };
  };

  const renderMOD = () => {
    const { modulated, noisy, envelopeUpper, envelopeLower } = generateModulatedPaths();
    return (
      <>
        {showEnvelope && (
          <g className="opacity-20">
            <path d={envelopeUpper} fill="none" stroke="var(--accent-primary)" strokeWidth="1" strokeDasharray="4,4" />
            <path d={envelopeLower} fill="none" stroke="var(--accent-primary)" strokeWidth="1" strokeDasharray="4,4" />
          </g>
        )}
        
        {channels.ch1 && bufferedState.messageSignal && (
          <path d={generatePath(bufferedState.messageSignal)} fill="none" stroke="#7C4DFF" strokeWidth="1.5" className="opacity-40" />
        )}
        
        {channels.ch2 && bufferedState.carrierSignal && (
          <path d={generatePath(bufferedState.carrierSignal)} fill="none" stroke="#00FF9C" strokeWidth="1" className="opacity-30" />
        )}

        {channels.ch3 && (
          <motion.path
            d={modulated}
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="2.5"
            style={{ filter: 'drop-shadow(0 0 8px var(--accent-primary))' }}
          />
        )}

        {channels.ch4 && (
          <motion.path
            d={noisy}
            fill="none"
            stroke="var(--error)"
            strokeWidth="1.5"
            className="opacity-60"
            style={{ filter: 'drop-shadow(0 0 5px var(--error))' }}
          />
        )}
      </>
    );
  };

  const isAliasing = mode === 'digital' && bufferedState.signalA && (bufferedState.signalA.samplingRate || 20) < (bufferedState.signalA.frequency * 2);

  return (
    <div className={`relative overflow-hidden ${className} bg-[#070B14]/40 rounded-xl border border-white/5`}>
      {/* Oscilloscope Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: gridOpacity }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="2" strokeOpacity="0.1" />
        <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="white" strokeWidth="2" strokeOpacity="0.1" />
      </svg>

      {/* Waveform Canvas/SVG */}
      <svg className="relative w-full h-full overflow-visible" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {mode === 'modulation' ? (
          renderMOD()
        ) : mode === 'fft' ? (
          renderFFT()
        ) : (
          <>
            {/* Ghost Traces / Persistence (Simulated with low opacity paths) */}
            {bufferedState.signalA && (
              <path
                d={generatePath(bufferedState.signalA, mode === 'digital')}
                fill="none"
                stroke={mode === 'digital' ? "var(--accent-secondary)" : "var(--accent-primary)"}
                strokeWidth="4"
                className="opacity-10 blur-[2px]"
              />
            )}

            {/* Main Signal */}
            {bufferedState.signalA && (
              <motion.path
                animate={{ d: mode === 'sum' ? generateSummedPath() : generatePath(bufferedState.signalA, mode === 'digital') }}
                fill="none"
                stroke={isAliasing ? 'var(--error)' : (mode === 'digital' ? "var(--accent-secondary)" : (mode === 'sum' ? "white" : "var(--accent-primary)"))}
                strokeWidth={mode === 'sum' ? "4" : "3"}
                strokeLinecap="round"
                className={isAliasing ? 'animate-pulse' : ''}
                style={{ filter: `drop-shadow(0 0 10px ${isAliasing ? 'var(--error)' : (mode === 'digital' ? 'var(--accent-secondary)' : (mode === 'sum' ? 'white' : 'var(--accent-primary)'))})` }}
              />
            )}
            
            {/* Signal B comparison or Target Signal */}
            {(mode === 'compare' && bufferedState.signalB) && (
              <path
                d={generatePath(bufferedState.signalB)}
                fill="none"
                stroke="var(--accent-secondary)"
                strokeWidth="2"
                className="opacity-50"
              />
            )}
            {(mode === 'challenge' && bufferedState.targetSignal) && (
              <path
                d={generatePath(bufferedState.targetSignal)}
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="2"
                strokeDasharray="4,4"
                className="opacity-40"
              />
            )}
          </>
        )}
      </svg>

      {/* Channel Badges */}
      <div className="absolute bottom-2 right-2 flex gap-2 pointer-events-none">
        {mode === 'modulation' && (
          <>
            {channels.ch1 && <span className="text-[6px] px-1 bg-[#7C4DFF]/20 text-[#7C4DFF] border border-[#7C4DFF]/30 rounded">MSG</span>}
            {channels.ch2 && <span className="text-[6px] px-1 bg-[#00FF9C]/20 text-[#00FF9C] border border-[#00FF9C]/30 rounded">CAR</span>}
            {channels.ch3 && <span className="text-[6px] px-1 bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 rounded">MOD</span>}
            {channels.ch4 && <span className="text-[6px] px-1 bg-[var(--error)]/20 text-[var(--error)] border border-[var(--error)]/30 rounded">NOI</span>}
          </>
        )}
      </div>
    </div>
  );
};

export default Oscilloscope;
