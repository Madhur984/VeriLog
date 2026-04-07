/**
 * S10_RealWorld — "This is not abstract. This is everywhere."
 * Floating hover-expand cards. Click connects to signal.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { TheoryOverlay } from '../components/TheoryOverlay';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

const CARDS = [
  { id: 'audio',  label: 'Audio',  desc: 'Sound pressure waves. Frequency = pitch. Amplitude = volume.', freq: 1.5, amp: 0.7 },
  { id: 'wifi',   label: 'WiFi',   desc: 'Radio waves at 2.4 GHz. Encoded data in amplitude changes.', freq: 3.0, amp: 0.5 },
  { id: 'ecg',    label: 'ECG',    desc: 'Electrical signal from the heart. Each peak = one heartbeat.', freq: 0.5, amp: 0.8 },
];

const SPRING = { type: 'spring', stiffness: 180, damping: 22 };

export const S10_RealWorld: React.FC = () => {
  const setFrequency = useSignalStore((s) => s.setFrequency);
  const setAmplitude = useSignalStore((s) => s.setAmplitude);
  const nextScene    = useSignalStore((s) => s.nextScene);
  const [active, setActive] = useState<string | null>(null);
  const [clicked, setClicked] = useState<Set<string>>(new Set());

  const connect = (card: typeof CARDS[0]) => {
    setFrequency(card.freq);
    setAmplitude(card.amp);
    audio.tick();
    audio.snap();
    setActive(card.id);
    setClicked((prev) => new Set([...prev, card.id]));
  };

  const allExplored = clicked.size >= 2;

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center">
      <TheoryOverlay 
        levels={{ 
          l1: "Signals power everything.", 
          l2: "Every system communicates through signals.",
          l3: "Ubiquity: Connected Systems"
        }}
        deepMode={{
          explanation: "✔ communication\n✔ audio\n✔ radar\n✔ medical imaging\n✔ sensors",
          mapping: "S11 // APPLICATION"
        }}
      />

      <div className="pointer-events-auto absolute bottom-44 flex v3-gap-8">
        {CARDS.map((card) => {
          const isActive = active === card.id;
          return (
            <motion.button
              key={card.id}
              onClick={() => connect(card)}
              animate={{ y: isActive ? -4 : 0, opacity: isActive ? 1 : 0.55 }}
              whileHover={{ y: -2, opacity: 0.85 }}
              transition={SPRING}
              className="flex flex-col v3-gap-2 text-left max-w-[130px] border-b border-white/10 pb-2"
              style={{ cursor: 'pointer' }}
            >
              <span className="v3-small tracking-[0.3em] text-[#00E5FF]">
                {card.label}
              </span>
              <AnimatePresence>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 0.45, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="v3-small opacity-50 leading-relaxed overflow-hidden"
                  >
                    {card.desc}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {allExplored && (
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

