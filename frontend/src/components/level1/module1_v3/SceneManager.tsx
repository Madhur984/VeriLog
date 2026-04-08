import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSignalStore } from './store/signalStore';
import { AudioEngine } from './engine/audioEngine';

import { SignalHUD } from './components/SignalHUD';

import { S00_Entry }      from './scenes/S00_Entry';
import { S01_Identity }   from './scenes/S01_Identity';
import { S02_Signal }     from './scenes/S02_Signal';
import { S03_Time }       from './scenes/S03_Time';
import { S04_Energy }     from './scenes/S04_Energy';
import { S05_Frequency }  from './scenes/S05_Frequency';
import { S06_Shape }      from './scenes/S06_Shape';
import { S07_Noise }      from './scenes/S07_Noise';
import { S08_Control }    from './scenes/S08_Control';
import { S09_Interaction }from './scenes/S09_Interaction';
import { S10_RealWorld }  from './scenes/S10_RealWorld';
import { S11_Lab }        from './scenes/S11_Lab';
import { S12_Conclusion } from './scenes/S12_Conclusion';
import { SignalLab }      from './components/SignalLab';

const SCENES = [
  S00_Entry, S01_Identity, S02_Signal, S03_Time,
  S04_Energy, S05_Frequency, S06_Shape, S07_Noise,
  S08_Control, S09_Interaction, S10_RealWorld, S11_Lab, S12_Conclusion,
  SignalLab, // ✅ LAB
];

const audio = new AudioEngine();

export const SceneManager: React.FC = () => {
  const scene = useSignalStore((s) => s.scene);

  useEffect(() => {
    if (scene > 0) audio.transition();
  }, [scene]);

  const SceneComponent = SCENES[Math.min(scene, SCENES.length - 1)];

  return (
    <div className="fixed inset-0 overflow-hidden select-none pointer-events-none z-20">
      <SignalHUD />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <SceneComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
