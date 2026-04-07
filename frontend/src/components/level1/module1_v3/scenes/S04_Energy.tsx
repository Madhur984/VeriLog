/**
 * S04_Energy — "Amplitude is not height. It is energy."
 * Amplitude slider increases brightness + thickness + signal strength.
 */
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { TheoryOverlay } from '../components/TheoryOverlay';
import { FloatingSlider } from '../components/FloatingSlider';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

export const S04_Energy: React.FC = () => {
  const amplitude = useSignalStore((s) => s.amplitude);
  const setAmplitude = useSignalStore((s) => s.setAmplitude);
  const nextScene = useSignalStore((s) => s.nextScene);
  const [showNext, setShowNext] = useState(false);
  const movedHigh = useRef(false);

  canvasState.magneticStrength = 0;
  canvasState.showTrail = false;

  const handleChange = (v: number) => {
    setAmplitude(v);
    audio.tick();
    if (v > 0.7 && !movedHigh.current) {
      movedHigh.current = true;
      audio.snap();
      setShowNext(true);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center">
      <TheoryOverlay 
        levels={{
          l1: "Amplitude is energy.",
          l2: "It is the magnitude of change.",
          l3: "Energy is perceived through intensity, brightness, and physical displacement."
        }}
        deepMode={{
          formula: "P ∝ A² // Power is proportional to Amp squared",
          explanation: "In physical systems, doubling the amplitude quadruples the energy. It is the 'loudness' of the data.",
          mapping: "Volume -> Amplitude // Brightness -> Energy"
        }}
      />

      {/* Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto absolute bottom-44 w-64"
      >
        <FloatingSlider
          label="Energy (AMP)"
          value={amplitude}
          min={0.05}
          max={1}
          onChange={handleChange}
        />
      </motion.div>

      <AnimatePresence>
        {showNext && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={nextScene}
            className="v3-small pointer-events-auto absolute bottom-24 tracking-[0.4em] text-white/50 hover:text-white transition-colors"
          >
            continue →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

