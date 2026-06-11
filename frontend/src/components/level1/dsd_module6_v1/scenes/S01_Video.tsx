import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Bookmark, ChevronDown, Eye, FileText, PlayCircle, Quote } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean; }

interface Chapter { t: number; title: string; words: string; }

const CHAPTERS: Chapter[] = [
  {
    t: 0,
    title: 'Two Flavors of Logic',
    words:
      'Here is a question to start with: how does a machine remember anything? A calculator adds two numbers the moment you press equals, but the result of yesterday\'s sum is gone forever. It turns out every digital circuit ever built falls into just two families. One family lives entirely in the present. Give it inputs and it hands you an answer right now, no questions asked. The other family carries a little notebook. It looks at your input, checks what it already knows, and only then decides. Computing needs both: act on the now, decide with the then.',
  },
  {
    t: 100,
    title: 'Combinational Circuits',
    words:
      'Combinational circuits are prisoners of the present. The output depends only on the inputs sitting at the pins right now. There is no history and no stored state. Picture a tea vendor at a stall. Hand him milk, tea leaves and sugar, and he boils them into a cup. The cup depends on exactly what you handed over, nothing else. He does not remember yesterday\'s order and he is not counting today\'s cups. Change the inputs and the output changes almost instantly; the only delay is the speed of the gates themselves. Adders, multiplexers and decoders all work this way.',
  },
  {
    t: 170,
    title: 'Sequential Circuits',
    words:
      'Now ask the vendor a different question: how much do I owe you for the whole month? He has no idea. A memoryless circuit cannot count, cannot track a sequence, cannot hold a value once the inputs vanish. Sequential circuits fix that. Think of a cricket scoreboard reading one hundred. The umpire signals four runs. The operator combines the old score with the new runs, and the board flips to one hundred and four. Past state plus present input gives the next state. That loop, where the output feeds back into the decision, is what memory really is.',
  },
  {
    t: 250,
    title: 'Memory and Clocks',
    words:
      'So how do you trap a bit? Take two ordinary gates and cross-wire them, feeding each one\'s output back into the other\'s input. That loop locks onto a one or a zero and holds it until you tell it to change. That is a latch, and with a little more discipline, a flip-flop. The discipline comes from the clock: a steady electronic metronome ticking millions of times a second. The circuit only updates its stored state on the tick. That keeps billions of operations marching in step, so data never collides with itself mid-change.',
  },
  {
    t: 320,
    title: 'Bringing It Together',
    words:
      'Put the two families together and you get a real computer. The combinational logic is the processor, doing instant math on whatever appears. The memory registers are the scoreboard, holding on to where things stand. And the clock is the conductor, telling everyone exactly when to move. Engineers call this a finite state machine, and it is how raw electrical currents become organized intelligence. One last question before you go: the digital watch on your wrist, is it combinational or sequential? It has to remember the time, so you already know the answer.',
  },
];

interface VocabEntry { term: string; def: string; }

const VOCAB: VocabEntry[] = [
  { term: 'logic gate', def: 'a tiny circuit that answers one yes/no question about its inputs' },
  { term: 'combinational circuit', def: 'gates only - output decided by the inputs present right now' },
  { term: 'sequential circuit', def: 'gates plus memory - output also depends on what happened before' },
  { term: 'state', def: 'the information a circuit is currently remembering' },
  { term: 'memory element', def: 'the part that holds a bit until told to change' },
  { term: 'clock', def: 'the shared tick that tells every memory element when to update' },
];

// One viewing cue per chapter, index-matched to CHAPTERS above.
const WATCH_FOR: string[] = [
  'Watch for the opening question - how does a machine remember anything - and the split into two circuit families, one living in the present and one carrying a notebook.',
  'Watch for the tea vendor at the stall: the cup he hands back depends only on what you gave him right now, with no memory of any earlier order.',
  'Watch for the cricket scoreboard flipping from 100 to 104 - old score plus new runs is the moment past state and present input combine.',
  'Watch for the two cross-wired gates that trap a single bit, and the clock acting as a metronome that decides exactly when the stored value may change.',
  'Watch for the three roles coming together - processor, scoreboard and conductor - and the name engineers give the whole arrangement: a finite state machine.',
];

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

export const S01_Video: React.FC<Props> = ({ isActive = true, isDarkMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [open, setOpen] = useState<boolean[]>(CHAPTERS.map((_, i) => i === 0));

  const handleTimeUpdate = (t: number) => {
    setCurrentTime(t);
    let idx = 0;
    for (let i = 0; i < CHAPTERS.length; i++) {
      if (t >= CHAPTERS[i].t) idx = i;
    }
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
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <PlayCircle size={14} /> Chapter 02 · Video Lecture
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>How Machines Remember</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Watch the whole story once, then use the chapter markers to revisit any beat.
          The full lesson transcript sits below if you prefer to read along.
        </p>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-[10px] uppercase tracking-widest ${
          isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
        }`}>
          Runtime · 6 min 34 s
        </div>
      </section>

      {/* Key vocabulary - read before watching */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.05 }}
        className={`p-5 rounded-2xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
            Before you watch · key vocabulary
          </span>
        </div>
        <p className={`text-sm mb-4 ${subText}`}>
          The narration uses these six terms freely. Skim them once now so nothing in the
          video sounds like jargon - each one is defined in a single plain-language line.
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {VOCAB.map((v) => (
            <div
              key={v.term}
              className={`flex flex-col gap-1 px-3.5 py-3 rounded-xl border ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className={`font-mono font-bold text-[11px] uppercase tracking-widest ${
                isDarkMode ? 'text-cyan-300' : 'text-cyan-600'
              }`}>
                {v.term}
              </span>
              <span className={`text-sm leading-relaxed ${subText}`}>{v.def}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isActive ? { opacity: 1, scale: 1 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <video
          ref={videoRef}
          controls
          preload="metadata"
          src="/videos/how-machines-remember.mp4"
          className="w-full aspect-video bg-black"
          onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />
      </motion.div>

      {/* Chapter markers */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-5 rounded-2xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Bookmark size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
            Chapters · click to jump
          </span>
          <span className={`ml-auto font-mono text-[10px] ${subText}`}>
            {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : '6:34'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CHAPTERS.map((c, i) => (
            <button
              key={c.t}
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
      </motion.div>

      {/* Watch-for cues - one per chapter */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-5 rounded-2xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Eye size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
            Watch for these moments
          </span>
        </div>
        <div className={`divide-y ${isDarkMode ? 'divide-white/10' : 'divide-slate-200'}`}>
          {CHAPTERS.map((c, i) => (
            <div key={c.t} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <span className={`flex-shrink-0 mt-0.5 px-2 py-0.5 rounded-full border font-mono text-[10px] tabular-nums ${
                isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}>
                {formatTime(c.t)}
              </span>
              <div className="min-w-0">
                <span className={`block font-mono font-bold text-[11px] uppercase tracking-widest mb-0.5 ${
                  isDarkMode ? 'text-cyan-300' : 'text-cyan-600'
                }`}>
                  {c.title}
                </span>
                <span className={`text-sm leading-relaxed ${subText}`}>{WATCH_FOR[i]}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Lesson transcript */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.25 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <FileText size={14} className="text-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
            Lesson transcript
          </span>
        </div>

        <div className="space-y-3">
          {CHAPTERS.map((c, i) => {
            const isCurrent = activeChapter === i;
            return (
              <div
                key={c.t}
                className={`rounded-2xl border transition-all ${
                  isCurrent
                    ? isDarkMode
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-emerald-50 border-emerald-300'
                    : isDarkMode
                      ? 'border-white/10 hover:border-white/20'
                      : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center">
                  <button
                    onClick={() => toggle(i)}
                    className="flex-1 flex items-center gap-3 p-4 text-left min-w-0"
                    aria-expanded={open[i]}
                  >
                    <span className={`font-mono text-[10px] tabular-nums ${
                      isCurrent ? 'text-emerald-400' : isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {formatTime(c.t)}
                    </span>
                    <span className={`font-black text-sm truncate ${
                      isCurrent ? 'text-emerald-400' : textColor
                    }`}>
                      {c.title}
                    </span>
                    <motion.span
                      animate={{ rotate: open[i] ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className={`ml-auto flex-shrink-0 ${subText}`}
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>
                  <button
                    onClick={() => seek(c.t)}
                    aria-label={`Play video from ${c.title}`}
                    title="Play from here"
                    className={`flex-shrink-0 p-3 mr-2 rounded-xl transition-all active:scale-90 ${
                      isDarkMode ? 'text-cyan-400 hover:bg-cyan-500/10' : 'text-cyan-600 hover:bg-cyan-50'
                    }`}
                  >
                    <PlayCircle size={18} />
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {open[i] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className={`px-4 pb-4 text-sm leading-relaxed ${subText}`}>{c.words}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      <p className={`text-[10px] font-mono opacity-50 ${subText}`}>
        Transcript written to match the narration beat for beat. Open a section to read along,
        or tap the play icon to jump the video to that moment.
      </p>

      {/* Formal definitions to carry forward */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Quote size={14} className="text-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
            After the video · two sentences to keep
          </span>
        </div>
        <p className={`text-sm mb-4 ${subText}`}>
          Everything in the lecture compresses into these two textbook definitions. They are the
          standard wording you will meet in any digital design course, so keep them word for word.
        </p>
        <div className="space-y-3">
          <div className={`pl-4 border-l-2 rounded-r-xl py-2 ${
            isDarkMode ? 'border-emerald-500/60' : 'border-emerald-400'
          }`}>
            <span className={`block font-mono font-bold text-[11px] uppercase tracking-widest mb-1 ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
            }`}>
              Combinational
            </span>
            <p className={`text-sm leading-relaxed ${textColor}`}>
              A combinational circuit is made of logic gates whose outputs at any moment are
              determined entirely by the present combination of inputs.
            </p>
          </div>
          <div className={`pl-4 border-l-2 rounded-r-xl py-2 ${
            isDarkMode ? 'border-emerald-500/60' : 'border-emerald-400'
          }`}>
            <span className={`block font-mono font-bold text-[11px] uppercase tracking-widest mb-1 ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
            }`}>
              Sequential
            </span>
            <p className={`text-sm leading-relaxed ${textColor}`}>
              A sequential circuit contains gates plus memory elements; its outputs depend on the
              present inputs and on the stored state, so the same inputs can produce different
              outputs at different times.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
