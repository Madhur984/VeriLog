import { useRef } from 'react';

export const useAmbientAudio = () => {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  
  const start = () => {
    if (ctxRef.current) return;
    
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      ctxRef.current = ctx;
      
      // White noise generator for server room floor hum
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      
      // Low-pass filter (makes it feel like a server room hum)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 200;
      
      // Very quiet gain
      const gain = ctx.createGain();
      gain.gain.value = 0.02;  // barely audible
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      
      // Low frequency oscillator for the "machine hum"
      const osc = ctx.createOscillator();
      osc.frequency.value = 60;
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.01;
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start();
      
      nodesRef.current = [noise, osc];
    } catch (e) {
      console.warn("AudioContext failed to initialize:", e);
    }
  };
  
  const stop = () => {
    nodesRef.current.forEach(n => {
      try { (n as AudioScheduledSourceNode).stop(); } catch {}
    });
    ctxRef.current?.close();
    ctxRef.current = null;
    nodesRef.current = [];
  };
  
  return { start, stop };
};
