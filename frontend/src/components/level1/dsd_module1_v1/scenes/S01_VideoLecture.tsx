import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Bookmark } from 'lucide-react';
import { CustomVideoPlayer, VideoPlayerHandle } from '../../../ui/CustomVideoPlayer';

interface Props { isActive: boolean; isDarkMode: boolean; }

interface Chapter { t: number; title: string; line: string; }

const CHAPTERS: Chapter[] = [
  { t: 0,   title: 'The Architecture of a Decision',
    line: 'Every digital system you have ever touched is, at its core, a forest of yes/no decisions stitched together. Today we walk through Ben Bitdiddle’s picnic to discover the two universal blueprints for any such decision — SOP and POS.' },
  { t: 18,  title: 'The Physics of a Perfect Picnic',
    line: 'Ben’s mood depends on three observations: the rain (R), the ants (A), and the wind (W). Zero means the condition is friendly, one means it has gone wrong. Ben is easy-going — he can survive at most one bad condition. Two or more spoil the day.' },
  { t: 52,  title: 'The 8-Day Multiverse',
    line: 'Three binary variables produce eight possible mornings. We label them m0 through m7. Four of those mornings make Ben happy; four make him miserable. The truth table is a hand-drawn map of every parallel universe his picnic could live in.' },
  { t: 95,  title: 'The Path of Joy — Targeting the Ones',
    line: 'The optimist hunts the four happy rows: m0, m1, m2, and m4. Each happy row becomes a minterm — a snapshot recorded with a lowercase m. We use the AND operator to insist that every variable is dialled in exactly so.' },
  { t: 142, title: 'Anatomy of a Minterm',
    line: 'For row m1, where R=0, A=0, W=1, the snapshot reads R-prime AND A-prime AND W. Wherever the variable was zero we use its complement; wherever it was one we leave it alone. Three pieces, ANDed, capture exactly that single universe.' },
  { t: 188, title: 'Building the Canonical Sum of Products',
    line: 'OR every minterm together and you have the canonical SOP. E equals the snapshot of m0 plus the snapshot of m1 plus m2 plus m4 — written compactly as Sigma m of zero, one, two, four. The plus sign is a basket gathering all valid options.' },
  { t: 235, title: 'The Path of Caution — Targeting the Zeros',
    line: 'The pessimist flips the lens. Instead of celebrating the ones he barricades the zeros: rows M3, M5, M6, M7. Maxterms wear an uppercase M. Each barricade is a wall the design must NOT crash into.' },
  { t: 282, title: 'Anatomy of a Maxterm',
    line: 'Row 7 is the apocalypse: rain, ants, and wind all attacking. The barricade reads R-prime OR A-prime OR W-prime. Notice the inversion — wherever the variable was a one we complement it, because one is the dangerous state we are trying to escape.' },
  { t: 328, title: 'Building the Canonical Product of Sums',
    line: 'AND every maxterm together to build the canonical POS. E equals barricade three AND five AND six AND seven — Pi M of three, five, six, seven. Every barricade must hold or the day collapses.' },
  { t: 372, title: 'Two Lenses, One Truth',
    line: 'Painting the happy paths leaves the same final shape as bricking up the disasters. Sigma m of zero, one, two, four is mathematically identical to Pi M of three, five, six, seven. DeMorgan’s law is the bridge — the inverse of a specific joy is a specific disaster.' },
  { t: 410, title: 'Choose the Form that Fits',
    line: 'SOP and POS are not rivals; they are two design philosophies for the same decision. If the function has only a handful of ones, paint the ones. If it has only a handful of zeros, brick up the zeros. Boolean logic guarantees both routes arrive at the same circuit.' },
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
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <PlayCircle size={14} /> Chapter 01 · Video Lecture
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Ben&apos;s Boolean Picnic</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Watch the full illustrated lecture once end-to-end, then jump back to any chapter from
          the transcript on the right. The whole story is laid out on a single page so you can
          re-read while you re-watch.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
        {/* Video player + chapter scrubber */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
            className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
          >
            <CustomVideoPlayer
              ref={playerRef}
              src="/videos/Ben_s_Boolean_Picnic.mp4"
              accent="#22d3ee"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={setDuration}
            />
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
                      ? 'bg-cyan-500 text-black border border-cyan-300 shadow-lg shadow-cyan-500/30'
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
          <div className="flex items-center gap-2 mb-5 sticky top-0 -mt-1 pt-1 pb-3 -mx-1 px-1 backdrop-blur-md"
               style={{ background: isDarkMode ? 'rgba(2,1,0,0.7)' : 'rgba(255,255,255,0.85)' }}>
            <FileText size={14} className="text-emerald-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
              Transcript
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
                      ? 'bg-emerald-500/10 border border-emerald-500/40'
                      : 'bg-emerald-50 border border-emerald-300'
                    : isDarkMode
                      ? 'border border-white/5 hover:border-white/15'
                      : 'border border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className={`flex items-baseline gap-2 mb-1.5 ${
                  activeChapter === i ? 'text-emerald-400' : isDarkMode ? 'text-slate-400' : 'text-slate-500'
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
        Transcript composed from the on-screen narration of <em>Ben&apos;s Boolean Picnic</em> to mirror the
        sketchbook&apos;s twelve panels. Use it as a reading companion if you prefer to skim before watching.
      </p>
    </div>
  );
};
