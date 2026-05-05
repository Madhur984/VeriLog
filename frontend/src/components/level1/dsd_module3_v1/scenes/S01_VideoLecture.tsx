import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Bookmark, Volume2 } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

interface Chapter { t: number; title: string; line: string; }

const VIDEO_SRC = '/videos/K-Map_to_Logic_Circuit.mp4';

const CHAPTERS: Chapter[] = [
  {
    t: 0,
    title: 'Brief: The Wing-X Lock',
    line: 'A combinational vault stands locked. The detective\'s task: derive its Boolean function and then prove the same function can be re-built from a truth table and a K-Map.',
  },
  {
    t: 20,
    title: 'Inputs as Doors',
    line: 'Every variable is a door. A "1" is an intruder present. A "0" is silence. The output Y is a single light: on means the vault opens.',
  },
  {
    t: 50,
    title: 'The Three Guards',
    line: 'NOT inverts. AND demands all clearances. OR accepts any. These three primitives compose every combinational circuit you will ever read.',
  },
  {
    t: 90,
    title: 'End-to-Start: Walking Backward',
    line: 'Start at the output. Identify the final gate. Trace each input back through the wires. Each path becomes a product term in your equation.',
  },
  {
    t: 140,
    title: 'Sum of Products',
    line: 'Stitch the product terms together with OR. The result is the SOP form — the standard textual face of any combinational network.',
  },
  {
    t: 190,
    title: 'Truth Table: 2ⁿ Rows',
    line: 'For n inputs there are exactly 2ⁿ scenarios. Fill them out. Each row whose Y is 1 is a minterm — a singular condition that opens the vault.',
  },
  {
    t: 240,
    title: 'Folding Into a K-Map',
    line: 'A K-Map re-arranges the truth table so that physically adjacent cells differ by exactly one bit. Adjacent 1s collapse into rectangles — your simplified SOP appears.',
  },
  {
    t: 290,
    title: 'Forward Synthesis',
    line: 'Every product term is an AND gate. NOT-bars become inverters. The grand OR at the end gathers them all. The K-Map is now physical hardware.',
  },
  {
    t: 340,
    title: 'Three Faces of One Truth',
    line: 'Hardware, algebra, truth table — three lenses on the same Boolean function. When you can convert between any two, the case is closed.',
  },
];

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

export const S01_VideoLecture: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      setCurrentTime(v.currentTime);
      let idx = 0;
      for (let i = 0; i < CHAPTERS.length; i++) {
        if (v.currentTime >= CHAPTERS[i].t) idx = i;
      }
      setActiveChapter(idx);
    };
    const onMeta = () => setDuration(v.duration || 0);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
    };
  }, []);

  const seek = (t: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = t;
      videoRef.current.play().catch(() => {});
    }
  };

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <PlayCircle size={14} /> Chapter 01 · Field Manual
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>K-Map to Logic Circuit</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          A guided walkthrough connecting Boolean expressions, truth tables, K-Maps and physical
          gates. The transcript below is keyed to the video — click any chapter to jump.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
        {/* Video player */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
            className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
          >
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              controls
              playsInline
              className="w-full block aspect-video bg-black"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-cyan-400/30 font-mono text-[10px] uppercase tracking-widest text-cyan-300 flex items-center gap-2">
              <Volume2 size={12} /> English · K-Map → Circuit
            </div>
          </motion.div>

          {/* Chapter pills */}
          <div className={`p-5 rounded-2xl border ${cardBg}`}>
            <div className="flex items-center gap-2 mb-4">
              <Bookmark size={14} className="text-cyan-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
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
                      ? 'bg-cyan-400 text-black border border-cyan-300 shadow-lg shadow-cyan-500/30'
                      : isDarkMode
                        ? 'bg-white/5 border border-white/10 text-slate-300 hover:border-cyan-400'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-cyan-400'
                  }`}
                >
                  <span className="opacity-50 mr-1.5">{formatTime(c.t)}</span>
                  {c.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transcript panel */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-3xl border ${cardBg} max-h-[680px] overflow-y-auto`}
        >
          <div
            className="flex items-center gap-2 mb-5 sticky top-0 -mt-1 pt-1 pb-3 -mx-1 px-1 backdrop-blur-md"
            style={{ background: isDarkMode ? 'rgba(2,6,17,0.7)' : 'rgba(255,255,255,0.85)' }}
          >
            <FileText size={14} className="text-cyan-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
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
                      ? 'bg-cyan-500/10 border border-cyan-500/40'
                      : 'bg-cyan-50 border border-cyan-300'
                    : isDarkMode
                      ? 'border border-white/5 hover:border-white/15'
                      : 'border border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className={`flex items-baseline gap-2 mb-1.5 ${
                  activeChapter === i ? 'text-cyan-400' : isDarkMode ? 'text-slate-400' : 'text-slate-500'
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

      <p className={`text-[10px] font-mono opacity-50 ${subText}`}>
        Story-aligned: the lecture mirrors the seven scenes that follow. Use it as a primer, then
        follow the noir casebook to ground every concept in the Wing-X investigation.
      </p>
    </div>
  );
};
