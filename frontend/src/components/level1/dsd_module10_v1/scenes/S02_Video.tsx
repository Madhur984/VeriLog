import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Bookmark, ChevronDown, Eye, FileText, FileDown, PlayCircle, Quote } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean; }

interface Chapter { t: number; title: string; words: string; }

const CHAPTERS: Chapter[] = [
  {
    t: 0,
    title: 'Ripple Carry Adders',
    words:
      'The video opens on the whole idea: chips that add by chaining full adders in a line, the carry flowing from one to the next. The hand-drawn chips curving away from the title are the relay team you are about to meet.',
  },
  {
    t: 40,
    title: 'Relay Races and Chips',
    words:
      'The framing question: what do relay races have to do with chips? Everything, it turns out. The carry is a baton, each full adder is a runner, and the addition only crosses the finish line once the baton has been handed all the way down the line.',
  },
  {
    t: 95,
    title: 'Anatomy of a Runner',
    words:
      'A close look at one runner - the full adder. It takes three bits in (A, B and the carry-in baton) and produces two out (the Sum, which is the runner\'s final position, and the carry-out baton it hands forward). One runner handles exactly one column.',
  },
  {
    t: 140,
    title: 'The Relay Sequence',
    words:
      'The three-step rhythm of the race. Step 1: adder 1 receives its inputs and computes. Step 2: adder 1 passes its carry to adder 2. Step 3: adder 2 must wait for that carry before it can finish. That forced waiting is the heart of the whole lesson.',
  },
  {
    t: 200,
    title: "Why It's Slow",
    words:
      'The fundamental reason large ripple-carry adders are slow: every stage is physically locked out of finishing until the stage below hands over its carry. The inputs all arrived at once, but the answers can only appear one after another, in order.',
  },
  {
    t: 240,
    title: 'The Cumulative Wait',
    words:
      'The delays stack. Your total sum, from S0 all the way to S(N-1), is not stable until the carry has rippled through every stage and the very last runner crosses the line. The whole result waits on the slowest, last path.',
  },
  {
    t: 300,
    title: 'Total Delay = 2·N·ΔG',
    words:
      'The math of the wait. Each stage costs roughly two gate delays (ΔG) to settle and pass its carry, and there are N stages in series, so the worst-case delay is about 2 × N × ΔG. It grows linearly with the number of bits - fine for 4 bits, a real bottleneck at 64.',
  },
  {
    t: 380,
    title: 'Get the Baton at Once?',
    words:
      'The closing question that points at the next module: what if every runner could get the baton at the exact same time, instead of waiting for it to be handed down? That idea - computing the carries ahead of time, in parallel - is the carry-lookahead adder.',
  },
];

interface VocabEntry { term: string; def: string; }

const VOCAB: VocabEntry[] = [
  { term: 'full adder', def: 'one runner: adds A, B and a carry-in, producing a sum bit and a carry-out' },
  { term: 'carry (the baton)', def: 'the overflow bit handed from one stage to the next higher one' },
  { term: 'ripple', def: 'the carry travelling stage by stage, lowest bit to highest, in sequence' },
  { term: 'propagation delay', def: 'the physical time gates take to settle and produce a stable output' },
  { term: 'gate delay (ΔG)', def: 'one unit of that delay; the whole adder is measured in multiples of it' },
  { term: 'carry-lookahead', def: 'the faster successor: it computes the carries in parallel instead of rippling' },
];

const WATCH_FOR: string[] = [
  'Watch the chips curving off the title - they are already drawn as a chain, the relay team in formation.',
  'Watch the baton hand-off between the two runners. That baton is the carry bit; everything else is dressing.',
  'Watch the single runner labelled Full Adder: three inputs (A, B, Cin), two outputs (Sum, Cout).',
  'Watch the three numbered steps - compute, pass, wait. Step 3, the waiting, is why ripple adders are slow.',
  'Watch the runners standing idle while only the front one moves: inputs arrive at once, answers do not.',
  'Watch the finish-line frame: the total sum is not declared stable until the very last runner arrives.',
  'Watch the highlighted formula: delay is about 2 × N × ΔG, growing straight-line with the bit count.',
];

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

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

  const seek = (t: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = t;
    v.play().catch(() => undefined);
  };

  const toggle = (i: number) => setOpen((o) => o.map((v, j) => (j === i ? !v : v)));

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-500">
          <PlayCircle size={14} /> Chapter 03 · Video Lecture
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Ripple Carry Adders</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          A relay race for the carry bit: meet the runner (the full adder), watch the baton get
          handed down the chain, and see exactly why the wait stacks up to about 2 × N × gate
          delays. Use the chapter markers to revisit any beat, or read the notes below the player.
        </p>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-[10px] uppercase tracking-widest ${
          isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
        }`}>
          Runtime · 6 min 38 s
        </div>
      </section>

      {/* vocab */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.05 }}
                  className={`p-5 rounded-2xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={14} className="text-amber-500" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-500">Before you watch · key vocabulary</span>
        </div>
        <p className={`text-sm mb-4 ${subText}`}>Six terms the narration leans on, each in one plain line.</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {VOCAB.map((v) => (
            <div key={v.term} className={`flex flex-col gap-1 px-3.5 py-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`font-mono font-bold text-[11px] uppercase tracking-widest ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>{v.term}</span>
              <span className={`text-sm leading-relaxed ${subText}`}>{v.def}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* player */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
                  className={`relative rounded-3xl overflow-hidden border ${cardBg}`}>
        <video
          ref={videoRef}
          controls
          preload="metadata"
          src="/videos/ripple-carry-adders.mp4"
          className="w-full aspect-video bg-black"
          onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />
      </motion.div>

      {/* chapters */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }}
                  className={`p-5 rounded-2xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-4">
          <Bookmark size={14} className="text-amber-500" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-500">Chapters · click to jump</span>
          <span className={`ml-auto font-mono text-[10px] ${subText}`}>{formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : '6:38'}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CHAPTERS.map((c, i) => (
            <button key={c.t} onClick={() => seek(c.t)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-bold transition-all ${
                      activeChapter === i
                        ? 'bg-amber-500 text-black border border-amber-300 shadow-lg shadow-amber-500/30'
                        : isDarkMode ? 'bg-white/5 border border-white/10 text-slate-300 hover:border-amber-400' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-amber-400'
                    }`}>
              <span className="opacity-50 mr-1.5">{formatTime(c.t)}</span>{c.title}
            </button>
          ))}
        </div>
      </motion.div>

      {/* watch-for */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
                  className={`p-5 rounded-2xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-4">
          <Eye size={14} className="text-amber-500" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-500">Watch for these moments</span>
        </div>
        <div className={`divide-y ${isDarkMode ? 'divide-white/10' : 'divide-slate-200'}`}>
          {CHAPTERS.slice(0, WATCH_FOR.length).map((c, i) => (
            <div key={c.t} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <span className={`flex-shrink-0 mt-0.5 px-2 py-0.5 rounded-full border font-mono text-[10px] tabular-nums ${isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>{formatTime(c.t)}</span>
              <div className="min-w-0">
                <span className={`block font-mono font-bold text-[11px] uppercase tracking-widest mb-0.5 ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>{c.title}</span>
                <span className={`text-sm leading-relaxed ${subText}`}>{WATCH_FOR[i]}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* lesson notes */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25 }}
                  className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-5">
          <FileText size={14} className="text-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">Lesson notes</span>
        </div>
        <div className="space-y-3">
          {CHAPTERS.map((c, i) => {
            const isCurrent = activeChapter === i;
            return (
              <div key={c.t} className={`rounded-2xl border transition-all ${
                isCurrent ? (isDarkMode ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-emerald-50 border-emerald-300')
                          : (isDarkMode ? 'border-white/10 hover:border-white/20' : 'border-slate-200 hover:border-slate-300')}`}>
                <div className="flex items-center">
                  <button onClick={() => toggle(i)} className="flex-1 flex items-center gap-3 p-4 text-left min-w-0" aria-expanded={open[i]}>
                    <span className={`font-mono text-[10px] tabular-nums ${isCurrent ? 'text-emerald-400' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{formatTime(c.t)}</span>
                    <span className={`font-black text-sm truncate ${isCurrent ? 'text-emerald-400' : textColor}`}>{c.title}</span>
                    <motion.span animate={{ rotate: open[i] ? 180 : 0 }} transition={{ duration: 0.25 }} className={`ml-auto flex-shrink-0 ${subText}`}>
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>
                  <button onClick={() => seek(c.t)} aria-label={`Play from ${c.title}`} title="Play from here"
                          className={`flex-shrink-0 p-3 mr-2 rounded-xl transition-all active:scale-90 ${isDarkMode ? 'text-amber-400 hover:bg-amber-500/10' : 'text-amber-600 hover:bg-amber-50'}`}>
                    <PlayCircle size={18} />
                  </button>
                </div>
                <AnimatePresence initial={false}>
                  {open[i] && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                      <p className={`px-4 pb-4 text-sm leading-relaxed ${subText}`}>{c.words}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* source deck */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.28 }}
                  className={`p-5 rounded-2xl border flex items-center gap-4 flex-wrap ${cardBg}`}>
        <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-400/40 flex items-center justify-center shrink-0">
          <FileDown size={20} className="text-violet-400" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400 mb-0.5">Reading · The Digital Relay</div>
          <p className={`text-sm ${subText}`}>
            The companion slide deck: the burden of the carry, the anatomy of a runner, building the
            relay team, the cumulative wait, and the 2 × N × ΔG scaling problem. Good for revision.
          </p>
        </div>
        <a href="/docs/the-digital-relay.pdf" download="The_Digital_Relay.pdf"
           className="px-5 py-3 rounded-xl border-2 border-violet-400 text-violet-300 font-mono text-xs font-black uppercase tracking-widest hover:bg-violet-500/10 transition-all active:scale-95">
          Download PDF
        </a>
      </motion.div>

      {/* takeaway */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
                  className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-2">
          <Quote size={14} className="text-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">After the video · the takeaway</span>
        </div>
        <p className={`text-sm leading-relaxed ${subText}`}>
          The whole lecture is one sentence: chain N full adders carry-to-carry and you can add any
          two N-bit numbers, but the carry must ripple through all N stages in order, so the worst-case
          delay grows as 2 × N × ΔG. The next chapters make that real - first you build and poke the
          chain, then you watch the carry ripple and the delay stack up.
        </p>
      </motion.div>
    </div>
  );
};

export default S02_Video;
