import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Bookmark, Volume2 } from 'lucide-react';
import { CustomVideoPlayer, VideoPlayerHandle } from '../../../ui/CustomVideoPlayer';

interface Props { isActive: boolean; isDarkMode: boolean; }

interface Chapter { t: number; title: string; line: string; }

const VIDEO_SRC = '/videos/Semiconductor_Physics.mp4';

const CHAPTERS: Chapter[] = [
  { t: 0,   title: 'Welcome to the Tapri', line: 'Forget the textbook. We use hostels and tapris to build intuition for what silicon actually does. The vocabulary maps 1-to-1 - only the metaphor changes.' },
  { t: 30,  title: 'Pure Silicon · Good Boys', line: '14 electrons, 4 in the valence shell. Each atom shares its 4 electrons with 4 neighbours forming covalent bonds. Stable. Static. Net current zero - boring.' },
  { t: 80,  title: 'Hostel vs Tapri', line: 'Valence band = the disciplined hostel. Conduction band = the lively tapri across the hill. The vertical gap between them is Eg ≈ 1.1 eV for silicon.' },
  { t: 130, title: 'The Jump', line: 'Heat or light gives some electrons enough energy to jump the gap. Each jump leaves behind a hole. At room temperature you get ~1.5 × 10¹⁰ free carriers per cm³.' },
  { t: 180, title: 'Pure Si is Too Slow', line: 'One free electron per 10¹² atoms is nowhere near enough for fast electronics. Time for jugaad: doping.' },
  { t: 220, title: 'N-Type · 5-Friend Squad', line: 'Add a Group V impurity (P, As, Sb) - pentavalent. 4 electrons bond, the 5th is a free awara electron. Donor atom. Majority carrier = electron.' },
  { t: 270, title: 'P-Type · 3-Friend Squad', line: 'Add a Group III impurity (B, Ga, In) - trivalent. One bond is missing → that vacancy is the hole. Acceptor atom. Majority carrier = hole.' },
  { t: 320, title: 'Electron Flow vs Hole Flow', line: 'Holes don\'t actually move - electrons keep filling them. Conventional current direction always follows the apparent hole flow (positive to negative).' },
  { t: 370, title: 'The Neutrality Twist', line: 'N-type isn\'t negative; P-type isn\'t positive. The atoms still have equal protons and electrons. Carriers are just free, not extra.' },
  { t: 410, title: 'Negative Temperature Coefficient', line: 'Heat increases broken bonds → more carriers → lower resistance. Opposite to metals. This is the semiconductor\'s superpower.' },
  { t: 460, title: 'Tease · The P-N Junction', line: 'Now sandwich an N-Type slab to a P-Type slab. Diffusion. Drift. The depletion region. The diode. Onward.' },
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
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-orange-400">
          <PlayCircle size={14} /> Chapter 01 · Lecture
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Semiconductor Physics Decoded</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          A tapri-style walkthrough of intrinsic silicon, doping, and the road to the P-N
          junction. Click any chapter to jump straight there.
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
              accent="#fb923c"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={setDuration}
            />
            <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-bg-void border border-orange-400/30 font-mono text-[10px] uppercase tracking-widest text-orange-300 flex items-center gap-2 pointer-events-none">
              <Volume2 size={12} /> English · Madhur way
            </div>
          </motion.div>

          <div className={`p-5 rounded-2xl border ${cardBg}`}>
            <div className="flex items-center gap-2 mb-4">
              <Bookmark size={14} className="text-orange-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">
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
                      ? 'bg-orange-400 text-black border border-orange-300 shadow-lg shadow-orange-500/30'
                      : isDarkMode
                        ? 'bg-white/5 border border-white/10 text-slate-300 hover:border-orange-400'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-orange-400'
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
            <FileText size={14} className="text-orange-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">
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
                      ? 'bg-orange-500/10 border border-orange-500/40'
                      : 'bg-orange-50 border border-orange-300'
                    : isDarkMode
                      ? 'border border-white/5 hover:border-white/15'
                      : 'border border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className={`flex items-baseline gap-2 mb-1.5 ${
                  activeChapter === i ? 'text-orange-400' : isDarkMode ? 'text-slate-400' : 'text-slate-500'
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
