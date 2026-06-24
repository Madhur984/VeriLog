import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Bookmark, ChevronDown, Eye, FileText, FileDown, PlayCircle, Quote } from 'lucide-react';
import { CustomVideoPlayer, type VideoPlayerHandle } from '../../../ui/CustomVideoPlayer';

interface Props { isActive?: boolean; isDarkMode: boolean; }

interface Chapter { t: number; title: string; words: string; }

const CHAPTERS: Chapter[] = [
  {
    t: 0,
    title: 'The Single Lane',
    words:
      'The video opens on the serial adder in one breath: two binary numbers waiting to be added, and a single full adder that will process them one bit at a time. The promise is the whole topic in miniature - add any two numbers with almost no hardware, as long as you are willing to wait a few clock cycles.',
  },
  {
    t: 42,
    title: 'Parallel vs Serial',
    words:
      'Two toll plazas, side by side. The parallel adder is a wide plaza with a booth in every lane - all cars pay at once, but it sprawls. The serial adder is one booth and a single lane of cars queued behind it. Same cars, same toll. The difference is concrete poured versus time spent.',
  },
  {
    t: 88,
    title: 'Cars Become Bits',
    words:
      'The metaphor is pinned to hardware. A car becomes a bit. A queue of cars becomes a shift register. The booth becomes the full adder, and the spark at the end is its output. From here on, "a car reaches the booth" literally means "a bit enters the full adder".',
  },
  {
    t: 130,
    title: 'Queue, Process, Shift',
    words:
      'The three-beat rhythm of every cycle. QUEUE UP: the bits line up in the shift registers, addend on top, augend below. PROCESS: on the clock pulse, exactly one pair of bits enters the full adder. SHIFT OUTPUT: the result queue shifts forward by one, making room for the next bit. One clock pulse, one bit of progress.',
  },
  {
    t: 175,
    title: 'The Carry Clipboard',
    words:
      'The single most important line: the carry flip-flop stores the carry-out for use in the next bit addition. The booth prints a ticket (the carry) and clips it to a clipboard. When the next car arrives, that ticket is waiting as its carry-in. This one memory element is what lets a single booth handle a whole number.',
  },
  {
    t: 312,
    title: 'The Limitations',
    words:
      'No free lunch. Resource utilization: a serial adder needs many clock cycles, so it underuses the rest of a fast system - a poor fit where raw arithmetic speed is the goal. And while it is conceptually simple, the control logic that sequences the shifting can make the real design fiddlier than a plain parallel adder.',
  },
  {
    t: 358,
    title: "Where It's Used",
    words:
      'So who chooses the single lane on purpose? Anything where space and power matter more than speed: tiny microcontrollers, low-power IoT sensors, wearables, a smartwatch ticking quietly on your wrist. When the budget is silicon area and battery, trading time for space is exactly the right call.',
  },
  {
    t: 402,
    title: 'Time or Space?',
    words:
      'The closing question, and the real lesson of the module: would you sacrifice time or space? There is no universally right answer - only the right answer for your constraints. The serial adder is the elegant proof that you can almost always buy one with the other.',
  },
];

interface VocabEntry { term: string; def: string; }

const VOCAB: VocabEntry[] = [
  { term: 'parallel adder', def: 'adds all bits at once using one full adder per bit - fast, but large' },
  { term: 'serial adder', def: 'adds one bit per clock cycle with a single reused full adder - small, but slower' },
  { term: 'shift register', def: 'a row of flip-flops that shifts its bits along by one each clock pulse' },
  { term: 'carry flip-flop', def: 'the one-bit memory that holds the carry-out so it can be next cycle\'s carry-in' },
  { term: 'clock cycle', def: 'one tick of the clock; the serial adder makes one bit of progress per tick' },
  { term: 'latency vs area', def: 'the trade being made: more time (cycles) bought with less space (hardware)' },
];

const WATCH_FOR: string[] = [
  'Watch the opening: two numbers, one full adder, processed bit by bit. Hold onto "one at a time" - everything follows from it.',
  'Watch the two plazas. The wide one is parallel (a booth per lane); the single lane is serial (one booth, a queue).',
  'Watch the substitutions appear: car becomes a bit, a queue of cars becomes a shift register, the booth becomes the full adder.',
  'Watch the three labels: Queue Up, Process, Shift Output - and the clock pulse between them. That cadence is one clock cycle.',
  'Watch the highlighted quote about the carry flip-flop. The ticket on the clipboard is the carry surviving from one cycle to the next.',
  'Watch the limitations slide - the cost of all those clock cycles is wasted speed in an otherwise fast system.',
  'Watch the application icons: a chip, an IoT device, a smartwatch. Small and low-power is where serial wins.',
];

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

export const S02_Video: React.FC<Props> = ({ isActive = true, isDarkMode }) => {
  const videoRef = useRef<VideoPlayerHandle>(null);
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

  const seek = (t: number) => videoRef.current?.seek(t);

  const toggle = (i: number) => setOpen((o) => o.map((v, j) => (j === i ? !v : v)));

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-sky-400">
          <PlayCircle size={14} /> Chapter 03 · Video Lecture
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Serial Adders</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Seven minutes on the single-lane toll plaza: parallel versus serial, the car-to-bit
          mapping, the queue-process-shift rhythm, and the carry clipboard that makes it all work.
          Use the chapter markers to revisit any beat, or read the lesson notes below the player.
        </p>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-[10px] uppercase tracking-widest ${
          isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
        }`}>
          Runtime · 6 min 55 s
        </div>
      </section>

      {/* Key vocabulary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.05 }}
        className={`p-5 rounded-2xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={14} className="text-sky-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-sky-400">
            Before you watch · key vocabulary
          </span>
        </div>
        <p className={`text-sm mb-4 ${subText}`}>
          Six terms the narration leans on. Skim them once so nothing in the video sounds like
          jargon - each is one plain line.
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
                isDarkMode ? 'text-sky-300' : 'text-sky-600'
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
        <CustomVideoPlayer
          ref={videoRef}
          src="/videos/serial-adders.mp4"
          accent="#38bdf8"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={setDuration}
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
          <Bookmark size={14} className="text-sky-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-sky-400">
            Chapters · click to jump
          </span>
          <span className={`ml-auto font-mono text-[10px] ${subText}`}>
            {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : '6:55'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CHAPTERS.map((c, i) => (
            <button
              key={c.t}
              onClick={() => seek(c.t)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-bold transition-all ${
                activeChapter === i
                  ? 'bg-sky-500 text-black border border-sky-300 shadow-lg shadow-sky-500/30'
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
      </motion.div>

      {/* Watch-for cues */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-5 rounded-2xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Eye size={14} className="text-sky-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-sky-400">
            Watch for these moments
          </span>
        </div>
        <div className={`divide-y ${isDarkMode ? 'divide-white/10' : 'divide-slate-200'}`}>
          {CHAPTERS.slice(0, WATCH_FOR.length).map((c, i) => (
            <div key={c.t} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <span className={`flex-shrink-0 mt-0.5 px-2 py-0.5 rounded-full border font-mono text-[10px] tabular-nums ${
                isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}>
                {formatTime(c.t)}
              </span>
              <div className="min-w-0">
                <span className={`block font-mono font-bold text-[11px] uppercase tracking-widest mb-0.5 ${
                  isDarkMode ? 'text-sky-300' : 'text-sky-600'
                }`}>
                  {c.title}
                </span>
                <span className={`text-sm leading-relaxed ${subText}`}>{WATCH_FOR[i]}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Lesson notes */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.25 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <FileText size={14} className="text-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
            Lesson notes
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
                      isDarkMode ? 'text-sky-400 hover:bg-sky-500/10' : 'text-sky-600 hover:bg-sky-50'
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

      {/* The source deck */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.28 }}
        className={`p-5 rounded-2xl border flex items-center gap-4 flex-wrap ${cardBg}`}
      >
        <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-400/40 flex items-center justify-center shrink-0">
          <FileDown size={20} className="text-violet-400" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400 mb-0.5">
            Reading · The Serial Logic Highway
          </div>
          <p className={`text-sm ${subText}`}>
            The companion slide deck: the engineering choice, the highway analogy, the full
            metaphor mapping, the factor of time, and the architecture comparison. Good for revision.
          </p>
        </div>
        <a
          href="/docs/serial-logic-highway.pdf"
          download="Serial_Logic_Highway.pdf"
          className="px-5 py-3 rounded-xl border-2 border-violet-400 text-violet-300 font-mono text-xs font-black uppercase tracking-widest hover:bg-violet-500/10 transition-all active:scale-95"
        >
          Download PDF
        </a>
      </motion.div>

      {/* takeaway */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Quote size={14} className="text-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
            After the video · the takeaway
          </span>
        </div>
        <p className={`text-sm leading-relaxed ${subText}`}>
          The whole lecture is one sentence: a single full adder, fed one bit at a time by two
          shift registers, with a flip-flop carrying the carry across cycles, adds any two numbers
          in N clock ticks. The next two chapters make that real - first the datapath you can poke,
          then a full addition you step through tick by tick.
        </p>
      </motion.div>
    </div>
  );
};

export default S02_Video;
