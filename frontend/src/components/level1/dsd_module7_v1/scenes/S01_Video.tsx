import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Bookmark, ChevronDown, Eye, FileText, PlayCircle, Quote } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean; }

interface Chapter { t: number; title: string; words: string; }

const CHAPTERS: Chapter[] = [
  {
    t: 0,
    title: 'The Question',
    words:
      'Every tap, swipe and search you make ends in the same place: two numbers being added somewhere on a microchip. But a chip is just a slab of silicon with no brain inside, so how does it actually do math? The answer starts smaller than you might expect, with a circuit that can only add one bit to one other bit. Master that tiny machine and the rest of computing is repetition.',
  },
  {
    t: 16,
    title: 'What a Half Adder Is',
    words:
      'The circuit is called a half adder: a logic circuit that takes two 1-bit binary inputs, A and B, and adds them together. It produces exactly two outputs. The sum is the digit that stays in the current column, and the carry is the overflow that spills into the next one. Drawn as a block diagram it is just a box: a and b go in on the left, sum and carry come out on the right. Whatever happens inside, that contract never changes.',
  },
  {
    t: 32,
    title: 'The Four Cases',
    words:
      'With two 1-bit inputs there are only four possible cases, so we can check every single one. 0 + 0 is nothing in, nothing out: sum 0, carry 0. 0 + 1 gives a sum of 1 with no carry, and 1 + 0 gives the exact same result - order does not matter. The trouble starts at 1 + 1: in decimal that would be 2, but binary has no digit \'2\', so the answer is written 10. The 0 stays in the sum column and the extra 1 overflows into the carry.',
  },
  {
    t: 64,
    title: 'Building It with Gates',
    words:
      'Now the translation to silicon, because computers do not use gravity, wooden boxes, or glass spheres - they use electricity. The sum wire is an XOR gate: it outputs a 1 if exactly one input is active, but outputs 0 if both are active or neither is. That is S = A ⊕ B. The carry wire is an AND gate, which outputs a 1 only if both inputs are active at the same time: C = A · B. Wire A and B into both gates at once and the half adder is complete - two gates, and silicon can add.',
  },
  {
    t: 108,
    title: 'The Limit',
    words:
      'So why is it only HALF an adder? Look at the block again: it has a carry-out on the right, but no wire to receive a carry-in from a previous addition. Try adding 15 + 27 column by column and you hit the wall immediately - the second column has to accept the carry produced by the first, and this box cannot. The half adder is a box at capacity, functionally incomplete for chaining long numbers. Fixing that missing wire is the next lesson.',
  },
];

interface VocabEntry { term: string; def: string; }

const VOCAB: VocabEntry[] = [
  { term: 'bit', def: 'a single binary digit - the smallest piece of information, either a 0 or a 1' },
  { term: 'binary addition', def: 'adding numbers written only with 0s and 1s, one column at a time' },
  { term: 'sum', def: 'the digit that stays in the current column after an addition' },
  { term: 'carry', def: 'the extra 1 that spills into the next column when a column overflows' },
  { term: 'logic gate', def: 'a tiny circuit that answers one yes/no question about its inputs' },
  { term: 'truth table', def: 'a chart listing every input combination and the output each one produces' },
];

// One viewing cue per chapter, index-matched to CHAPTERS above.
const WATCH_FOR: string[] = [
  'Watch for the opening question - how does a slab of silicon actually do math - and the promise that the whole answer starts with adding one bit to one other bit.',
  'Watch for the block diagram: a and b entering the box on the left, sum and carry leaving on the right - the contract every half adder keeps.',
  'Watch for the moment 1 + 1 breaks the pattern: binary has no digit 2, so the answer is written 10 and the extra 1 spills into the carry.',
  'Watch for the two gates splitting the work - XOR lighting the sum wire when exactly one input is a 1, AND raising the carry only when both arrive together.',
  'Watch for the missing wire: the block has a carry-out but no carry-in, and that single absence is why this adder is only half of one.',
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

  // Wooden-box palette shared across the module (the marble machine identity).
  const wood = isDarkMode ? '#c4956c' : '#8b5e3c';
  const woodFill = isDarkMode ? '#5b3d2a33' : '#a9826033';
  const wire = isDarkMode ? '#64748b' : '#94a3b8';
  const svgLabel = isDarkMode ? '#cbd5e1' : '#475569';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <PlayCircle size={14} /> Chapter 03 · Video Lecture
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Demystifying Half Adders</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Two minutes, one question: how does a microchip actually do math? The video walks the
          whole arc - definition, truth table, gates, and the one missing wire. Use the chapter
          markers to revisit any beat, or read the transcript below the player.
        </p>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-[10px] uppercase tracking-widest ${
          isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
        }`}>
          Runtime · 2 min 05 s
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
          src="/videos/demystifying-half-adders.mp4"
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
            {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : '2:05'}
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

      {/* After the video - the takeaway */}
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
        <p className={`text-sm mb-5 ${subText}`}>
          The whole lecture compresses into one block diagram and two sentences. The block is the
          same overflowing box you will build by hand in the coming chapters - amber marble and all.
        </p>

        {/* HA block diagram: a, b -> HA -> sum, carry */}
        <div className={`mb-5 p-4 rounded-2xl border ${
          isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <svg viewBox="0 0 380 190" className="w-full max-w-md mx-auto h-auto" role="img"
            aria-label="Half adder block diagram: inputs A and B enter the HA block, sum and carry leave it; there is no carry-in wire">
            <defs>
              <radialGradient id="s01HaMarble" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#92400e" />
              </radialGradient>
            </defs>

            {/* input wires */}
            <line x1="50" y1="55" x2="140" y2="55" stroke={wire} strokeWidth="2" />
            <line x1="50" y1="105" x2="140" y2="105" stroke={wire} strokeWidth="2" />
            <text x="40" y="59" textAnchor="end" fontFamily="monospace" fontSize="13" fontWeight="bold" fill={svgLabel}>A</text>
            <text x="40" y="109" textAnchor="end" fontFamily="monospace" fontSize="13" fontWeight="bold" fill={svgLabel}>B</text>

            {/* one amber marble rolling in on chute A */}
            <circle cx="98" cy="48" r="7" fill="url(#s01HaMarble)" />

            {/* the HA block - drawn as the wooden box */}
            <rect x="140" y="30" width="100" height="100" rx="14" fill={woodFill} stroke={wood} strokeWidth="2.5" />
            <text x="190" y="90" textAnchor="middle" fontFamily="monospace" fontSize="26" fontWeight="900" fill={wood}>HA</text>

            {/* output wires */}
            <line x1="240" y1="55" x2="318" y2="55" stroke={wire} strokeWidth="2" />
            <polygon points="318,50 328,55 318,60" fill={wire} />
            <text x="334" y="59" fontFamily="monospace" fontSize="12" fontWeight="bold" fill={svgLabel}>Sum</text>

            <line x1="240" y1="105" x2="318" y2="105" stroke={wire} strokeWidth="2" />
            <polygon points="318,100 328,105 318,110" fill={wire} />
            <text x="334" y="109" fontFamily="monospace" fontSize="12" fontWeight="bold" fill={svgLabel}>Carry</text>

            {/* the missing carry-in wire */}
            <line x1="50" y1="155" x2="128" y2="155" stroke={wire} strokeWidth="2" strokeDasharray="5 5" opacity="0.5" />
            <text x="190" y="172" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={svgLabel} opacity="0.7">
              no carry-in socket - the reason it is only half an adder
            </text>
          </svg>
        </div>

        <div className="space-y-3">
          <div className={`pl-4 border-l-2 rounded-r-xl py-2 ${
            isDarkMode ? 'border-emerald-500/60' : 'border-emerald-400'
          }`}>
            <span className={`block font-mono font-bold text-[11px] uppercase tracking-widest mb-1 ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
            }`}>
              The circuit
            </span>
            <p className={`text-sm leading-relaxed ${textColor}`}>
              A half adder is a logic circuit that adds two 1-bit binary inputs and produces two
              outputs: a sum, S = A &#8853; B, made by an XOR gate, and a carry, C = A &#183; B,
              made by an AND gate.
            </p>
          </div>
          <div className={`pl-4 border-l-2 rounded-r-xl py-2 ${
            isDarkMode ? 'border-emerald-500/60' : 'border-emerald-400'
          }`}>
            <span className={`block font-mono font-bold text-[11px] uppercase tracking-widest mb-1 ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
            }`}>
              The limit
            </span>
            <p className={`text-sm leading-relaxed ${textColor}`}>
              The block has a carry-out but no wire to receive a carry-in from a previous addition,
              so it cannot chain multi-digit numbers on its own - which is exactly why it is called
              only half an adder.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
