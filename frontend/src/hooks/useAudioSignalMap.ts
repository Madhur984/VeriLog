import { useEffect, useRef } from 'react';

export const useAudioSignalMap = ({ 
  frequency, 
  amplitude, 
  enabled 
}: { frequency: number, amplitude: number, enabled: boolean }) => {
  const audioCtx = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (audioCtx.current) {
        audioCtx.current.close();
        audioCtx.current = null;
      }
      return;
    }

    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      oscillator.current = audioCtx.current.createOscillator();
      gainNode.current = audioCtx.current.createGain();
      
      oscillator.current.type = 'sine';
      oscillator.current.connect(gainNode.current);
      gainNode.current.connect(audioCtx.current.destination);
      
      oscillator.current.start();
    }

    // Map Frequency (Hz) -> Pitch
    // We scale it slightly for better audibility (e.g. 1Hz -> 100Hz base)
    if (oscillator.current && audioCtx.current) {
      const targetFreq = Math.max(20, frequency * 150); 
      oscillator.current.frequency.setTargetAtTime(targetFreq, audioCtx.current.currentTime, 0.1);
    }

    // Map Amplitude -> Volume
    if (gainNode.current && audioCtx.current) {
      const targetGain = Math.min(0.5, amplitude * 0.3); // Cap volume for safety
      gainNode.current.gain.setTargetAtTime(targetGain, audioCtx.current.currentTime, 0.1);
    }

  }, [frequency, amplitude, enabled]);

  return null;
};
