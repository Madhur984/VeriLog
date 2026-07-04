import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Bookmark, ChevronDown, Eye, FileText, FileDown, PlayCircle, Quote } from 'lucide-react';
import { CustomVideoPlayer, type VideoPlayerHandle } from '../../../ui/CustomVideoPlayer';

interface Props { isActive?: boolean; isDarkMode: boolean; }

interface Chapter { t: number; title: string; words: string; }

const CHAPTERS: Chapter[] = [
  {
    t: 0,
    title: 'The Packing Station',
    words:
      'The video opens on a packing station: parcels riding a conveyor, a worker boxing them up. Two parcels arrive at this station - the operand bits A and B. Then the awkward delivery: the station before this one could not fit everything in its box, and sends its overflow forward. That third, carried-over item is Cin - and the whole lesson hangs on one question: how do you handle it?',
  },
  {
    t: 18,
    title: 'Three In, Two Out',
    words:
      'The station gets sealed into a box with exactly three input ports and two outputs: Full Adder - 3 inputs, 2 outputs. Whatever arrives, the station only ever does two things: keep what fits in the current column (the Sum, S) and ship the overflow onward to the next station (the Carry-out, Cout). The biggest delivery, 1 + 1 + 1 = 3, is written 11 in binary - one item kept, one box shipped.',
  },
  {
    t: 48,
    title: 'The Carry Formula',
    words:
      'When must the station ship a box onward? Whenever any PAIR of arrivals turns up together: Carry-out is calculated as AB + ACin + BCin - the Boolean majority function, one AND term per possible pair, merged by an OR. The Sum, meanwhile, is the odd-one-out detector: S = A ⊕ B ⊕ Cin, TRUE only when an odd number of the three inputs are TRUE.',
  },
  {
    t: 60,
    title: 'Under the Hood',
    words:
      'What exactly is inside a full adder? The video pops the hood: Half Adder 1, the first logical component, packs the two local parcels A and B. Half Adder 2, the second logical component, folds the carried-over item Cin into the leftovers. An OR gate is the final logical connection - one shipping dock that forwards a box if EITHER packer overflowed. Two standard half adder circuits, one OR gate, nothing else.',
  },
  {
    t: 84,
    title: 'Proof & Daisy-Chain',
    words:
      'The truth table seals the argument - every row of A, B, Cin traced through the gates matches plain counting. Then the closing question: can we daisy-chain these to build a supercomputer? Yes - that is the point. Each station ships its overflow to the next station\'s carry-over inbox (Cout into Cin), so full adders chain into the 8-, 32- and 64-bit adders at the arithmetic core of every computer.',
  },
];

interface VocabEntry { term: string; def: string; }

const VOCAB: VocabEntry[] = [
  { term: 'operand', def: 'a value being operated on - here, each of the two bits being added' },
  { term: 'carry-in (Cin)', def: 'the third input: the carry arriving from the previous, less significant column' },
  { term: 'carry-out (Cout)', def: 'the overflow bit this column hands to the next one up' },
  { term: 'modulo-2 addition', def: 'addition that keeps only the remainder after dividing by 2 - exactly what XOR computes' },
  { term: 'majority function', def: 'a rule that outputs 1 when more than half of its inputs are 1 - any two of three' },
  { term: 'cascading', def: 'chaining blocks so one stage\'s carry-out feeds the next stage\'s carry-in' },
];

// One viewing cue per chapter, index-matched to CHAPTERS above.
const WATCH_FOR: string[] = [
  'Watch for the packing station and the awkward extra delivery - the carried-over item from the previous station. That parcel IS the Cin wire, and handling it is the whole job.',
  'Watch for the sealed box: 3 inputs, 2 outputs. One item stays in the column (S), the overflow ships onward (Cout) - the contract never changes.',
  'Watch for the highlighted formula - Carry-out is calculated as AB + ACin + BCin - one term per pair of arrivals: the majority vote, in writing.',
  'Watch for the hood opening on "Inside Full Adder": Half Adder 1 → Half Adder 2 → OR gate, labeled first logical component, second logical component, final logical connection.',
  'Watch for the daisy-chain question at the very end - overflow shipped from station to station is exactly Cout feeding the next stage\'s Cin.',
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

  const wire = isDarkMode ? '#64748b' : '#94a3b8';
  const svgLabel = isDarkMode ? '#cbd5e1' : '#475569';
  const boxFill = isDarkMode ? '#0a0e1a' : '#ffffff';
  const VIOLET = '#a78bfa';
  const EMERALD = '#34d399';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <PlayCircle size={14} /> Chapter 03 · Video Lecture
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Full Adder</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          One hundred seconds, one story: a parcel <strong>packing station</strong> that keeps
          receiving a third, carried-over item from the station before it. The video uses that
          picture to walk the interface, both formulas, and the two-half-adder architecture.
          Use the chapter markers to revisit any beat, or read the lesson notes below the player.
        </p>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-[10px] uppercase tracking-widest ${
          isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
        }`}>
          Runtime · 1 min 42 s
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
        <CustomVideoPlayer
          ref={videoRef}
          src="/videos/the-full-adder.mp4"
          accent="#22d3ee"
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
          <Bookmark size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
            Chapters · click to jump
          </span>
          <span className={`ml-auto font-mono text-[10px] ${subText}`}>
            {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : '1:42'}
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
        Notes follow the lesson's five beats. Open a section to read along, or tap the play
        icon to jump the video near that beat.
      </p>

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
            Reading · the architecture deck
          </div>
          <p className={`text-sm ${subText}`}>
            Seven slides - interface, both formulas, the half-vs-full comparison, and the
            modular synthesis. The exact material this module is built from, good for revision.
          </p>
        </div>
        <a
          href="/docs/full-adder-architecture.pdf"
          download="Full_Adder_Architecture.pdf"
          className={`px-5 py-3 rounded-xl border-2 font-mono text-xs font-black uppercase tracking-widest hover:bg-violet-500/10 transition-all active:scale-95 ${
            isDarkMode ? 'border-violet-400 text-violet-300' : 'border-violet-500 text-violet-700'
          }`}
        >
          Download PDF
        </a>
      </motion.div>

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
          The whole lecture compresses into one block diagram and two formulas. The block now has
          the carry-in socket the half adder lacked - the dashed wire is finally solid. In
          packing-station terms: two parcels and a carried-over item arrive, one item stays in
          the column, and at most one box ships onward.
        </p>

        {/* FA block diagram: A, B, Cin -> FA -> S, Cout */}
        <div className={`mb-5 p-4 rounded-2xl border ${
          isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <svg viewBox="0 0 380 190" className="w-full max-w-md mx-auto h-auto" role="img"
            aria-label="Full adder block diagram: inputs A, B and Cin enter the FA block, Sum and Carry-out leave it">
            {/* input wires */}
            <line x1="50" y1="45" x2="140" y2="45" stroke={wire} strokeWidth="2" />
            <line x1="50" y1="85" x2="140" y2="85" stroke={wire} strokeWidth="2" />
            <line x1="50" y1="125" x2="140" y2="125" stroke={EMERALD} strokeWidth="2.5" />
            <text x="40" y="49" textAnchor="end" fontFamily="monospace" fontSize="13" fontWeight="bold" fill={svgLabel}>A</text>
            <text x="40" y="89" textAnchor="end" fontFamily="monospace" fontSize="13" fontWeight="bold" fill={svgLabel}>B</text>
            <text x="40" y="129" textAnchor="end" fontFamily="monospace" fontSize="13" fontWeight="bold" fill={EMERALD}>Cin</text>

            {/* the FA block */}
            <rect x="140" y="25" width="100" height="120" rx="14" fill={boxFill} stroke={VIOLET} strokeWidth="2.5" />
            <text x="190" y="92" textAnchor="middle" fontFamily="monospace" fontSize="26" fontWeight="900" fill={VIOLET}>FA</text>

            {/* output wires */}
            <line x1="240" y1="60" x2="318" y2="60" stroke={wire} strokeWidth="2" />
            <polygon points="318,55 328,60 318,65" fill={wire} />
            <text x="334" y="64" fontFamily="monospace" fontSize="12" fontWeight="bold" fill={svgLabel}>S</text>

            <line x1="240" y1="110" x2="318" y2="110" stroke={wire} strokeWidth="2" />
            <polygon points="318,105 328,110 318,115" fill={wire} />
            <text x="334" y="114" fontFamily="monospace" fontSize="12" fontWeight="bold" fill={svgLabel}>Cout</text>

            <text x="190" y="172" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={EMERALD} opacity="0.85">
              the carry-in socket is connected - the adder is whole
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
              The logic
            </span>
            <p className={`text-sm leading-relaxed ${textColor}`}>
              S = A &#8853; B &#8853; Cin - true for an odd count of active inputs (modulo-2 XOR
              mechanics). Cout = AB + ACin + BCin - true when any two inputs agree (majority
              AND/OR logic).
            </p>
          </div>
          <div className={`pl-4 border-l-2 rounded-r-xl py-2 ${
            isDarkMode ? 'border-emerald-500/60' : 'border-emerald-400'
          }`}>
            <span className={`block font-mono font-bold text-[11px] uppercase tracking-widest mb-1 ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
            }`}>
              The architecture
            </span>
            <p className={`text-sm leading-relaxed ${textColor}`}>
              Physically synthesized from two cascading half adders unified by a terminal OR
              gate - and because Cout can feed the next block's Cin, full adders chain into
              adders of any width.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
