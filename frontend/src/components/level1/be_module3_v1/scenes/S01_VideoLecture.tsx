import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Bookmark, Volume2 } from 'lucide-react';
import { CustomVideoPlayer, VideoPlayerHandle } from '../../../ui/CustomVideoPlayer';

interface Props { isActive: boolean; isDarkMode: boolean; }

interface Chapter { t: number; title: string; line: string; }

const VIDEO_SRC = '/videos/P-N_Junction_Diode.mp4';

const CHAPTERS: Chapter[] = [
  { t: 0,   title: 'The Junction Forms',         line: 'Sandwich an N-type slab to a P-type slab. At the boundary, free electrons from N rush across to fill nearby holes in P - the start of every diode story.' },
  { t: 30,  title: 'Diffusion vs Drift',         line: 'Initial carrier diffusion creates uncovered ions: + on N side, − on P side. Those ions create an internal electric field that pulls carriers back. Equilibrium = drift cancels diffusion.' },
  { t: 80,  title: 'The Depletion Region',       line: 'A narrow zone around the junction is now devoid of mobile carriers - the depletion region. It has a built-in voltage (~0.7 V for Si) called the barrier potential V_bi.' },
  { t: 130, title: 'Reverse Bias',               line: 'Apply + to N, − to P. The external field reinforces the internal one. The gap widens, majority carriers are pulled away, and only a tiny minority leak (I_S) survives.' },
  { t: 180, title: 'Forward Bias',               line: 'Flip the battery: + to P, − to N. The external field opposes the internal one. Once V_D crosses ~0.7 V, the gap collapses and carriers flood across - exponential current.' },
  { t: 230, title: 'Shockley\'s Equation',       line: 'I_D = I_S(e^(V_D/nV_T) − 1). Three constants and one variable predict every operating point in the active region.' },
  { t: 280, title: 'Breakdown Region',           line: 'Push reverse voltage past V_BV and minority carriers gain enough energy to ionise the lattice. Avalanche or Zener depending on doping. Most diodes die here.' },
  { t: 330, title: 'The V-I Curve',              line: 'One curve, four regions: breakdown, reverse, no-bias point, forward. Memorise the shape - it appears on every diode datasheet ever.' },
  { t: 380, title: 'The Diode Symbol',           line: 'Triangle = direction of permitted current. Bar = the closed door for reverse bias. Anode (P) on the triangle side, cathode (N) on the bar side. One-way street.' },
];

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

export const S01_VideoLecture: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const playerRef = useRef<VideoPlayerHandle>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);

  const handleTimeUpdate = (t: number) => {
    setCurrentTime(t);
    let idx = 0;
    for (let i = 0; i < CHAPTERS.length; i++) {
      if (t >= CHAPTERS[i].t) idx = i;
    }
    setActiveChapter(idx);
  };

  const seek = (t: number) => playerRef.current?.seek(t);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-sky-400">
          <PlayCircle size={14} /> Chapter 01 · Video Lecture
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>P-N Junction Diode</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Full guided walkthrough - from junction formation to diode symbol. The transcript
          below is keyed to the video; click any chapter to jump.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
            className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
          >
            <CustomVideoPlayer
              ref={playerRef}
              src={VIDEO_SRC}
              accent="#38bdf8"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={setDuration}
            />
            <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-bg-void border border-sky-400/30 font-mono text-[10px] uppercase tracking-widest text-sky-300 flex items-center gap-2 pointer-events-none">
              <Volume2 size={12} /> P-N Junction · English
            </div>
          </motion.div>

          <div className={`p-5 rounded-2xl border ${cardBg}`}>
            <div className="flex items-center gap-2 mb-4">
              <Bookmark size={14} className="text-sky-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-sky-400">
                Chapters · click to jump
              </span>
              <span className={`ml-auto font-mono text-[10px] ${subText}`}>
                {formatTime(currentTime)} {duration > 0 && <>/ {formatTime(duration)}</>}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CHAPTERS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => seek(c.t)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-bold transition-all ${
                    activeChapter === i
                      ? 'bg-sky-400 text-black border border-sky-300 shadow-lg shadow-sky-500/30'
                      : isDarkMode
                        ? 'bg-white/5 border border-white/10 text-slate-300 hover:border-sky-400'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-sky-400'
                  }`}
                >
                  <span className="opacity-50 mr-1.5">{formatTime(c.t)}</span>
                  {c.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-3xl border ${cardBg} max-h-[680px] overflow-y-auto`}
        >
          <div
            className="flex items-center gap-2 mb-5 sticky top-0 -mt-1 pt-1 pb-3 -mx-1 px-1"
            style={{ background: isDarkMode ? 'var(--bg-elev)' : '#FFFFFF' }}
          >
            <FileText size={14} className="text-sky-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-sky-400">
              Transcript · English
            </span>
          </div>
          <div className="space-y-5">
            {CHAPTERS.map((c, i) => (
              <button
                key={i}
                onClick={() => seek(c.t)}
                className={`w-full text-left p-4 rounded-2xl transition-all ${
                  activeChapter === i
                    ? isDarkMode
                      ? 'bg-sky-500/10 border border-sky-500/40'
                      : 'bg-sky-50 border border-sky-300'
                    : isDarkMode
                      ? 'border border-white/5 hover:border-white/15'
                      : 'border border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className={`flex items-baseline gap-2 mb-1.5 ${
                  activeChapter === i ? 'text-sky-400' : isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <span className="font-mono text-[10px] tabular-nums">{formatTime(c.t)}</span>
                  <span className="font-black text-sm">{c.title}</span>
                </div>
                <p className={`text-[13px] leading-relaxed ${subText}`}>{c.line}</p>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
