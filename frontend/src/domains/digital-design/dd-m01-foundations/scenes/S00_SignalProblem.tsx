import React from 'react';
import { motion } from 'framer-motion';
import SceneWrapper from '../components/SceneWrapper';
import PhaseLabel from '../components/PhaseLabel';

interface S00Props { sceneIndex: number; currentScene: number; onBegin: () => void; }

const S00_SignalProblem: React.FC<S00Props> = ({ sceneIndex, currentScene, onBegin }) => {
  const isActive = currentScene === sceneIndex;

  return (
    <SceneWrapper sceneIndex={sceneIndex} currentScene={currentScene} phaseColor="#00D4FF">
      <PhaseLabel phase="0" name="THE SPECIFICATION" color="#00D4FF" />

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl mx-auto px-6 py-20 gap-16">
        {/* Cinematic SEO Heading */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={isActive ? { opacity: 1, scale: 1 } : {}}
           className="text-center flex flex-col gap-6"
        >
          <h1 className="text-7xl md:text-9xl font-mono font-black italic text-white uppercase tracking-tighter leading-[0.8] drop-shadow-2xl">
            LOGIC <span className="text-cyan-500">MAPPING</span>.
          </h1>
          <p className="text-sm md:text-base font-mono font-black italic text-white/40 uppercase tracking-[0.4em] max-w-2xl mx-auto">
            From human specification to deterministic silicon. Initialize the digital design pipeline.
          </p>
        </motion.div>

        {/* Tactical Teaser */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {[
                { label: 'TRUTH_TABLES', val: '0100' },
                { label: 'K-MAP_OPTIM', val: '2-D' },
                { label: 'NAND_LOGIC', val: 'UNIV' }
            ].map((d, i) => (
                <div key={i} className="group relative aspect-video rounded-3xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center gap-2 overflow-hidden transition-all hover:bg-cyan-500/5 hover:border-cyan-500/20">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[8px] font-mono font-black italic text-white/20 uppercase tracking-widest">{d.label}</span>
                    <span className="text-3xl font-mono font-black italic text-white/10 group-hover:text-cyan-500/40 transition-colors uppercase">{d.val}</span>
                </div>
            ))}
        </div>

        {/* Action Button */}
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            onClick={onBegin}
            className="px-24 py-8 rounded-[32px] bg-cyan-500 text-black font-mono font-black italic text-xl tracking-[0.3em] uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_80px_rgba(6,182,212,0.3)]"
        >
            BEGIN_INIT →
        </motion.button>

        <p className="text-[10px] font-mono font-black italic text-white/10 uppercase tracking-[0.5em] mt-auto">
           Module DD-M01 :: VeriLog Engineering Suite :: AXE-OR Platform
        </p>
      </div>
    </SceneWrapper>
  );
};

export default S00_SignalProblem;
