import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Bookmark, ChevronDown, Eye, FileText, FileDown, PlayCircle, Quote } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean; }
interface Chapter { t: number; title: string; words: string; }

const CHAPTERS: Chapter[] = [
  { t: 0,   title: 'Fast Math: Look-Ahead', words: 'The video opens on the promise: addition without the ripple wait. Where the last module handed a baton down a line, this one computes every carry at once - the end of the propagation delay.' },
  { t: 80,  title: 'The Ripple Carry Problem', words: 'A quick recap of the enemy: sequential waiting. In a ripple adder each bit is trapped waiting for the previous carry, so the delays cascade. That wasted time is exactly what the look-ahead adder is built to remove.' },
  { t: 150, title: 'The Master Chef', words: 'The framing flips. The ripple adder is the sequential waiter - order, wait, order, wait. The look-ahead adder is the master chef who reads the entire order ticket at once and starts every dish simultaneously.' },
  { t: 180, title: 'Generate & Propagate', words: 'The two Boolean recipes. Generate, G = A AND B: a column that makes a carry on its own, guaranteed, when both bits are 1. Propagate, P = A XOR B: a column that merely passes an incoming carry along, when exactly one bit is 1.' },
  { t: 240, title: 'Predicting Every Carry', words: 'The magic step. C1 = G0 + P0·C0. C2 depends on C1 - but substitute C1 in, and C2 = G1 + P1·G0 + P1·P0·C0, written purely in terms of inputs. Every carry can be expanded the same way, so none waits on another.' },
  { t: 260, title: 'The Look-Ahead Generator', words: 'The circuit that does it: a 4-bit carry look-ahead generator sitting under four full adders, computing C1, C2, C3 and C4 simultaneously from the G and P signals. The sum bits then fall out as Sum = P XOR carry.' },
  { t: 360, title: 'Ripple vs Look-Ahead', words: 'The scoreboard. For a 16-bit add, a ripple adder costs about 32 gate delays; a look-ahead adder, about 11 - and roughly constant rather than growing. The price is complex, larger logic and more silicon area and power.' },
  { t: 440, title: 'Scaling to 64 Bits', words: 'The closing question that opens the next module: a flat look-ahead block over 64 bits would need impossibly large gates. How do you keep the speed without the explosion in complexity? With multi-level blocks - the parallel prefix adder.' },
];

const VOCAB = [
  { term: 'generate (G)', def: 'G = A·B: this column makes a carry by itself, when both bits are 1' },
  { term: 'propagate (P)', def: 'P = A⊕B: this column passes an incoming carry on, when exactly one bit is 1' },
  { term: 'carry look-ahead', def: 'computing every carry directly from the inputs, in parallel, with no ripple' },
  { term: 'gate delay (ΔG)', def: 'one unit of logic delay; the look-ahead block resolves in a small fixed number of them' },
  { term: 'fan-in', def: 'how many inputs a gate must accept; the carry equations grow it fast as width rises' },
  { term: 'parallel prefix', def: 'the next step: multi-level blocks that keep look-ahead speed at large widths' },
];

const WATCH_FOR = [
  'Watch the framing: the ripple delay is the problem; computing carries up front is the cure.',
  'Watch the cascade of waiting in the ripple recap - that stacked delay is the whole motivation.',
  'Watch the chef read the entire ticket at once. Reading all inputs together is parallel carry logic.',
  'Watch the two definitions appear: G = A AND B (make a carry), P = A XOR B (pass a carry).',
  'Watch C2 get rewritten with C1 substituted in - now it depends only on inputs, so it need not wait.',
  'Watch the look-ahead generator box under the adders, emitting all the carries at the same time.',
  'Watch the 16-bit comparison: about 32 delays for ripple versus about 11 for look-ahead.',
];

const formatTime = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

export const S02_Video: React.FC<Props> = ({ isActive = true, isDarkMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [open, setOpen] = useState<boolean[]>(CHAPTERS.map((_, i) => i === 0));

  const handleTimeUpdate = (t: number) => {
    setCurrentTime(t);
    let idx = 0;
    for (let i = 0; i < CHAPTERS.length; i++) if (t >= CHAPTERS[i].t) idx = i;
    setActiveChapter(idx);
  };
  const seek = (t: number) => { const v = videoRef.current; if (!v) return; v.currentTime = t; v.play().catch(() => undefined); };
  const toggle = (i: number) => setOpen((o) => o.map((v, j) => (j === i ? !v : v)));

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-orange-400">
          <PlayCircle size={14} /> Chapter 03 · Video Lecture
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Fast Math: Carry Look-Ahead</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The master chef who never queues a dish: meet Generate and Propagate, watch every carry get
          predicted from the inputs at once, and see the 16-bit scoreboard - about 32 gate delays for
          ripple versus 11 for look-ahead. Chapter markers below jump to any beat.
        </p>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-[10px] uppercase tracking-widest ${isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
          Runtime · 7 min 37 s
        </div>
      </section>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.05 }} className={`p-5 rounded-2xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-2"><BookOpen size={14} className="text-orange-400" /><span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">Before you watch · key vocabulary</span></div>
        <p className={`text-sm mb-4 ${subText}`}>Six terms the narration leans on, each in one plain line.</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {VOCAB.map((v) => (
            <div key={v.term} className={`flex flex-col gap-1 px-3.5 py-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`font-mono font-bold text-[11px] uppercase tracking-widest ${isDarkMode ? 'text-orange-300' : 'text-orange-600'}`}>{v.term}</span>
              <span className={`text-sm leading-relaxed ${subText}`}>{v.def}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}} className={`relative rounded-3xl overflow-hidden border ${cardBg}`}>
        <video ref={videoRef} controls preload="metadata" src="/videos/carry-look-ahead.mp4" className="w-full aspect-video bg-black"
               onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }} className={`p-5 rounded-2xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-4"><Bookmark size={14} className="text-orange-400" /><span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">Chapters · click to jump</span>
          <span className={`ml-auto font-mono text-[10px] ${subText}`}>{formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : '7:37'}</span></div>
        <div className="flex flex-wrap gap-2">
          {CHAPTERS.map((c, i) => (
            <button key={c.t} onClick={() => seek(c.t)} className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-bold transition-all ${activeChapter === i ? 'bg-orange-500 text-black border border-orange-300 shadow-lg shadow-orange-500/30' : isDarkMode ? 'bg-white/5 border border-white/10 text-slate-300 hover:border-orange-400' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-orange-400'}`}>
              <span className="opacity-50 mr-1.5">{formatTime(c.t)}</span>{c.title}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className={`p-5 rounded-2xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-4"><Eye size={14} className="text-orange-400" /><span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">Watch for these moments</span></div>
        <div className={`divide-y ${isDarkMode ? 'divide-white/10' : 'divide-slate-200'}`}>
          {CHAPTERS.slice(0, WATCH_FOR.length).map((c, i) => (
            <div key={c.t} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <span className={`flex-shrink-0 mt-0.5 px-2 py-0.5 rounded-full border font-mono text-[10px] tabular-nums ${isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>{formatTime(c.t)}</span>
              <div className="min-w-0"><span className={`block font-mono font-bold text-[11px] uppercase tracking-widest mb-0.5 ${isDarkMode ? 'text-orange-300' : 'text-orange-600'}`}>{c.title}</span><span className={`text-sm leading-relaxed ${subText}`}>{WATCH_FOR[i]}</span></div>
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
                  <button onClick={() => seek(c.t)} aria-label={`Play from ${c.title}`} title="Play from here" className={`flex-shrink-0 p-3 mr-2 rounded-xl transition-all active:scale-90 ${isDarkMode ? 'text-orange-400 hover:bg-orange-500/10' : 'text-orange-600 hover:bg-orange-50'}`}><PlayCircle size={18} /></button>
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
        <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-400/40 flex items-center justify-center shrink-0"><FileDown size={20} className="text-violet-400" /></div>
        <div className="flex-1 min-w-[200px]">
          <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400 mb-0.5">Reading · The Parallel Chef</div>
          <p className={`text-sm ${subText}`}>The companion deck: the sequential-dependency problem, the chef analogy, the Generate/Propagate recipes, the unrolled carry equations, and the cost of a faster kitchen.</p>
        </div>
        <a href="/docs/the-parallel-chef.pdf" download="The_Parallel_Chef.pdf" className="px-5 py-3 rounded-xl border-2 border-violet-400 text-violet-300 font-mono text-xs font-black uppercase tracking-widest hover:bg-violet-500/10 transition-all active:scale-95">Download PDF</a>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-2"><Quote size={14} className="text-emerald-400" /><span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">After the video · the takeaway</span></div>
        <p className={`text-sm leading-relaxed ${subText}`}>
          The whole lecture is one move: instead of waiting for carries, compute them. Each bit reports
          G = A·B and P = A⊕B, and from those alone every carry is written directly in terms of the
          inputs, so they all resolve together. The next chapters make it concrete - first G and P, then
          the parallel carry equations you can poke.
        </p>
      </motion.div>
    </div>
  );
};

export default S02_Video;
