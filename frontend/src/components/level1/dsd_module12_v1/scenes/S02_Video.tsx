import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Bookmark, ChevronDown, Eye, FileText, FileDown, PlayCircle, Quote } from 'lucide-react';
import { CustomVideoPlayer, type VideoPlayerHandle } from '../../../ui/CustomVideoPlayer';

interface Props { isActive?: boolean; isDarkMode: boolean; }
interface Chapter { t: number; title: string; words: string; }

const CHAPTERS: Chapter[] = [
  { t: 0,   title: 'Parallel Prefix Adder', words: 'The video opens on the fastest adder class: logarithmic carry computation. The carries are worked out in a tree, so even very wide additions resolve in a handful of levels.' },
  { t: 80,  title: "Why the Others Don't Scale", words: 'A recap of the limits. Serial and ripple adders are slow because of sequential waiting - the delay grows straight in line with the number of bits. For wide, fast machines that is simply too slow.' },
  { t: 200, title: 'From Look-Ahead to a Tree', words: 'Carry look-ahead fixed the speed by computing carries from Generate and Propagate - but a single flat block needs impossibly large gates at big widths. The fix is to stack the look-ahead idea into a tree.' },
  { t: 300, title: 'The Prefix Tree & Black Cell', words: 'The heart of the design. A tiny repeated merge cell (the Black Cell) combines the Generate/Propagate summary of two blocks into one. Wire these cells into a tree and the span doubles at every level.' },
  { t: 360, title: 'Logarithmic Delay', words: 'The payoff in numbers. Where a ripple adder takes 8, 16, 32 or 64 delays for those widths, the prefix tree takes only 3, 4, 5 or 6 - exactly log base two of the width plus a little. Doubling the bits costs one more level.' },
  { t: 440, title: 'Inside Your Device', words: 'Where this lives: the high-speed arithmetic units of modern processors. The adder racing through your 3D games and heavy calculations is almost certainly a parallel prefix adder.' },
];

const VOCAB = [
  { term: 'prefix tree', def: 'the logarithmic network of merge cells that computes all carries' },
  { term: 'black cell', def: 'the repeated merge cell: combines two blocks\' Generate/Propagate into one' },
  { term: 'block G / P', def: 'a whole span summarised by one Generate and one Propagate bit' },
  { term: 'logarithmic delay', def: 'carry delay grows as log₂N: 8→3, 16→4, 32→5, 64→6 levels' },
  { term: 'Kogge-Stone', def: 'a prefix topology built for maximum speed (minimum logic depth)' },
  { term: 'associative merge', def: 'the merge can be grouped any way, which is what lets it form a tree' },
];

const WATCH_FOR = [
  'Watch the opening tree of cells - carries computed in parallel branches, not a single line.',
  'Watch the linear delay of the slow adders: the wait grows one step for every extra bit.',
  'Watch the look-ahead recap and the hint that a flat block cannot scale to 64 bits.',
  'Watch the merge cell combine two blocks into one summary - that single cell builds the whole tree.',
  'Watch the table: ripple 8/16/32/64 versus prefix 3/4/5/6. That gap is the logarithm.',
  'Watch the closing - the prefix tree is what powers the arithmetic in your actual devices.',
];

const formatTime = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

export const S02_Video: React.FC<Props> = ({ isActive = true, isDarkMode }) => {
  const videoRef = useRef<VideoPlayerHandle>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [open, setOpen] = useState<boolean[]>(CHAPTERS.map((_, i) => i === 0));

  const handleTimeUpdate = (t: number) => { setCurrentTime(t); let idx = 0; for (let i = 0; i < CHAPTERS.length; i++) if (t >= CHAPTERS[i].t) idx = i; setActiveChapter(idx); };
  const seek = (t: number) => videoRef.current?.seek(t);
  const toggle = (i: number) => setOpen((o) => o.map((v, j) => (j === i ? !v : v)));

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-indigo-400">
          <PlayCircle size={14} /> Chapter 03 · Video Lecture
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Parallel Prefix Adder</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The summit of the adder track: carries computed in a logarithmic tree. Watch the Black Cell
          merge blocks, and see the delay table that makes the case - ripple 8/16/32/64 versus prefix
          3/4/5/6. Chapter markers jump to any beat.
        </p>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-[10px] uppercase tracking-widest ${isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
          Runtime · 8 min 08 s
        </div>
      </section>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.05 }} className={`p-5 rounded-2xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-2"><BookOpen size={14} className="text-indigo-400" /><span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400">Before you watch · key vocabulary</span></div>
        <p className={`text-sm mb-4 ${subText}`}>Six terms the narration leans on, each in one plain line.</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {VOCAB.map((v) => (
            <div key={v.term} className={`flex flex-col gap-1 px-3.5 py-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`font-mono font-bold text-[11px] uppercase tracking-widest ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>{v.term}</span>
              <span className={`text-sm leading-relaxed ${subText}`}>{v.def}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}} className={`relative rounded-3xl overflow-hidden border ${cardBg}`}>
        <CustomVideoPlayer ref={videoRef} src="/videos/parallel-prefix-adder.mp4" accent="#818cf8"
               onTimeUpdate={handleTimeUpdate} onLoadedMetadata={setDuration} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }} className={`p-5 rounded-2xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-4"><Bookmark size={14} className="text-indigo-400" /><span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400">Chapters · click to jump</span>
          <span className={`ml-auto font-mono text-[10px] ${subText}`}>{formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : '8:08'}</span></div>
        <div className="flex flex-wrap gap-2">
          {CHAPTERS.map((c, i) => (
            <button key={c.t} onClick={() => seek(c.t)} className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-bold transition-all ${activeChapter === i ? 'bg-indigo-500 text-white border border-indigo-300 shadow-lg shadow-indigo-500/30' : isDarkMode ? 'bg-white/5 border border-white/10 text-slate-300 hover:border-indigo-400' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-indigo-400'}`}>
              <span className="opacity-50 mr-1.5">{formatTime(c.t)}</span>{c.title}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className={`p-5 rounded-2xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-4"><Eye size={14} className="text-indigo-400" /><span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400">Watch for these moments</span></div>
        <div className={`divide-y ${isDarkMode ? 'divide-white/10' : 'divide-slate-200'}`}>
          {CHAPTERS.slice(0, WATCH_FOR.length).map((c, i) => (
            <div key={c.t} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <span className={`flex-shrink-0 mt-0.5 px-2 py-0.5 rounded-full border font-mono text-[10px] tabular-nums ${isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>{formatTime(c.t)}</span>
              <div className="min-w-0"><span className={`block font-mono font-bold text-[11px] uppercase tracking-widest mb-0.5 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>{c.title}</span><span className={`text-sm leading-relaxed ${subText}`}>{WATCH_FOR[i]}</span></div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25 }} className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-5"><FileText size={14} className="text-emerald-400" /><span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">Lesson notes</span></div>
        <div className="space-y-3">
          {CHAPTERS.map((c, i) => {
            const isCurrent = activeChapter === i;
            return (
              <div key={c.t} className={`rounded-2xl border transition-all ${isCurrent ? (isDarkMode ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-emerald-50 border-emerald-300') : (isDarkMode ? 'border-white/10 hover:border-white/20' : 'border-slate-200 hover:border-slate-300')}`}>
                <div className="flex items-center">
                  <button onClick={() => toggle(i)} className="flex-1 flex items-center gap-3 p-4 text-left min-w-0" aria-expanded={open[i]}>
                    <span className={`font-mono text-[10px] tabular-nums ${isCurrent ? 'text-emerald-400' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{formatTime(c.t)}</span>
                    <span className={`font-black text-sm truncate ${isCurrent ? 'text-emerald-400' : textColor}`}>{c.title}</span>
                    <motion.span animate={{ rotate: open[i] ? 180 : 0 }} transition={{ duration: 0.25 }} className={`ml-auto flex-shrink-0 ${subText}`}><ChevronDown size={16} /></motion.span>
                  </button>
                  <button onClick={() => seek(c.t)} aria-label={`Play from ${c.title}`} title="Play from here" className={`flex-shrink-0 p-3 mr-2 rounded-xl transition-all active:scale-90 ${isDarkMode ? 'text-indigo-400 hover:bg-indigo-500/10' : 'text-indigo-600 hover:bg-indigo-50'}`}><PlayCircle size={18} /></button>
                </div>
                <AnimatePresence initial={false}>
                  {open[i] && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                      <p className={`px-4 pb-4 text-sm leading-relaxed ${subText}`}>{c.words}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.28 }} className={`p-5 rounded-2xl border flex items-center gap-4 flex-wrap ${cardBg}`}>
        <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-400/40 flex items-center justify-center shrink-0"><FileDown size={20} className="text-rose-400" /></div>
        <div className="flex-1 min-w-[200px]">
          <div className="font-mono text-[10px] uppercase tracking-widest text-rose-400 mb-0.5">Reading · Parallel Prefix Adders</div>
          <p className={`text-sm ${subText}`}>The companion deck: the linear-delay limitation, hierarchical block logic, the Black Cell, the prefix tree, the three phases, and the topology variations.</p>
        </div>
        <a href="/docs/parallel-prefix-adders.pdf" download="Parallel_Prefix_Adders.pdf" className="px-5 py-3 rounded-xl border-2 border-rose-400 text-rose-300 font-mono text-xs font-black uppercase tracking-widest hover:bg-rose-500/10 transition-all active:scale-95">Download PDF</a>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-2"><Quote size={14} className="text-emerald-400" /><span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">After the video · the takeaway</span></div>
        <p className={`text-sm leading-relaxed ${subText}`}>
          The whole lecture is one structure: summarise each span by a (Generate, Propagate) pair, and
          merge spans pairwise in a tree with one repeated cell. Because the merge is associative, the
          tree is only log₂N deep - so the carries, and the sum, fall out astonishingly fast. The next
          chapters build the cell, then the tree.
        </p>
      </motion.div>
    </div>
  );
};

export default S02_Video;
