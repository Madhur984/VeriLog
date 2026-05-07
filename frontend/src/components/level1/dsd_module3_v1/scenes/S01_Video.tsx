import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Volume2, ArrowRight } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const VIDEO_SRC = '/videos/Logic_to_Hardware_Pipeline.mp4';

const KEY_POINTS = [
  { t: '00:00', title: 'The brief',         line: 'Three sensors A, B, C feed a Server Vault. Output F controls the unlock mechanism.' },
  { t: '00:20', title: 'Define the rules',  line: 'Enumerate every input combination · 2³ = 8 rows · mark the rows where F = 1.' },
  { t: '00:50', title: 'Extract the math',  line: 'Convert each F=1 row to a minterm · OR them all to get the canonical Sum-of-Products.' },
  { t: '01:20', title: 'Optimise · K-Map',  line: 'Fold the truth table into a 2-D Gray-coded grid · group adjacent 1s · drop the variables that vary.' },
  { t: '01:50', title: 'Build the gates',   line: 'Each surviving product term becomes one AND · the final OR sums them · F = A + BC is born.' },
];

export const S01_Video: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <PlayCircle size={14} /> Lecture · Logic to Hardware
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Watch the pipeline once.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Three minutes. Every stage you are about to study, narrated end-to-end on the same
          example we will rebuild together. Get the shape of the journey first; the detail comes
          in the chapters that follow.
        </p>
      </section>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg} shadow-2xl`}
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          controls
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full block aspect-video bg-black"
        />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-cyan-400/30 font-mono text-[10px] uppercase tracking-widest text-cyan-300 flex items-center gap-2">
          <Volume2 size={12} /> Logic to Hardware Pipeline
        </div>
        {!isPlaying && (
          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-cyan-400/90 text-black font-mono text-[10px] uppercase tracking-widest font-black animate-pulse">
            Press play
          </div>
        )}
      </motion.div>

      {/* Quick beats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <FileText size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
            What you will see
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {KEY_POINTS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={`p-4 rounded-2xl border flex gap-3 ${
                isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="font-mono text-[10px] tabular-nums text-cyan-300 mt-1">{p.t}</div>
              <div className="flex-1">
                <div className={`text-sm font-black ${textColor}`}>{p.title}</div>
                <p className={`text-[12px] ${subText} mt-0.5 leading-relaxed`}>{p.line}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-5 rounded-2xl border ${cardBg} flex items-center gap-3`}
      >
        <ArrowRight className="text-cyan-300 shrink-0" size={18} />
        <p className={`text-sm ${subText}`}>
          Once the video is done, hit <strong className="text-cyan-300">Next</strong> — Step 1 is
          where we slow down and meet the vault.
        </p>
      </motion.div>
    </div>
  );
};
