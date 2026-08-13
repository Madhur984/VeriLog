import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Bookmark } from 'lucide-react';
import { CustomVideoPlayer, VideoPlayerHandle } from '../../../ui/CustomVideoPlayer';

interface Props { isActive: boolean; isDarkMode: boolean; }

interface Chapter { t: number; title: string; line: string; }

// Story-aligned transcript matching the 13 PDF panels
const CHAPTERS: Chapter[] = [
  {
    t: 0,
    title: 'The Quest for Control',
    line: 'Every electronic device on Earth comes down to one quest - the quest for control. Conductors let current flow freely; insulators block it completely. Semiconductors sit in between and they let us decide, moment by moment, when to allow current and when to refuse.',
  },
  {
    t: 25,
    title: 'The Starting Lineup',
    line: 'Three materials make up most of modern semiconductor electronics. Silicon - the captain - is abundant and stable. Germanium - the veteran - is faster but more sensitive to heat. Gallium Arsenide - the specialist - is a compound with extreme speed and the ability to emit light. All three share one secret: their behaviour is decided entirely by the electrons in the outermost shell.',
  },
  {
    t: 65,
    title: 'The Silicon Franchise',
    line: 'Picture Silicon\'s atom as a sports franchise. The owners are the nucleus - fourteen heavy protons fixed at the centre. The support staff are ten electrons in the inner shells, tightly bound and never interacting with the outside world. Then come the boundary riders - four electrons in the outermost shell. They are the star players, the only ones the outside world ever sees.',
  },
  {
    t: 110,
    title: 'Tetravalent · The Magic Number',
    line: 'Silicon has exactly four valence electrons. That number is magic. The energy needed to remove one of them - the ionization potential - is much lower than for any electron in the deeper shells. Sitting on the boundary makes them desperate to find stability. They need partners.',
  },
  {
    t: 145,
    title: 'The Garba Matrix · Covalent Bonding',
    line: 'In a pure Silicon crystal, every atom shares each of its four valence electrons with one of its four neighbours. The lattice forms a perfectly synchronised dance - a Garba - where every dancer holds two hands. At absolute zero, the music stops, all dancers freeze in place, and the material behaves as a perfect insulator.',
  },
  {
    t: 195,
    title: 'When the Dhol Drops',
    line: 'At room temperature the beat kicks in. Valence electrons absorb thermal energy from the surroundings. Some absorb enough to break their bond and shoot up to the conduction band - they become free carriers. In a tiny sugar-cube of pure Silicon there are about fifteen billion such free electrons. Where each electron used to sit, a void is left behind. We call that void a hole.',
  },
  {
    t: 245,
    title: 'The Dance of Electrons and Holes',
    line: 'A nearby valence electron may drop into the void to fill it, but in doing so it leaves a fresh void where it came from. From the outside it looks as if a positive charge has hopped sideways. This apparent motion of holes is just as real as the motion of electrons. Conventional current - the direction we mark on schematics - follows the hole flow.',
  },
  {
    t: 295,
    title: 'Shifting Dimensions · Energy Bands',
    line: 'Knowing where the electrons are is only half the picture. We also need to know how much energy each one carries. To plot energy we use a different diagram - the energy band diagram. Welcome to the bands.',
  },
  {
    t: 320,
    title: 'The 3-Tier City',
    line: 'Imagine a 3-tier city. The valence band is the gully - low energy, crowded, electrons bound to their parent atoms. The conduction band is the elevated expressway - high energy, free flow, electrons that create current. Between them lies the energy gap - the forbidden zone - where no electron is allowed to exist.',
  },
  {
    t: 360,
    title: 'Paying the Toll · the eV',
    line: 'To leave the gully and enter the expressway, an electron must pay the toll. The currency is the electron-volt. One eV equals 1.6 times ten to the minus nineteen Joules - exactly the kinetic energy gained by one electron crossing a one-volt potential difference. You either have the exact energy or you stay in the gully.',
  },
  {
    t: 410,
    title: 'The Master Blueprint',
    line: 'Three blueprints, three personalities. In an insulator the expressway is miles above the gully - the gap exceeds five eV and traffic is impossible. In a conductor the bands overlap - traffic is uncontrollable. In a semiconductor the gap is small but real: 1.1 eV for Silicon, 0.67 eV for Germanium, 1.43 eV for Gallium Arsenide. The perfect jump.',
  },
  {
    t: 460,
    title: 'The Pure State',
    line: 'You now know the intrinsic rules of the game - how the Garba holds together and the exact price of the toll. But pure Silicon is just a blank canvas. In the next module we introduce impurities - we rig the game. Welcome to extrinsic doping.',
  },
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
          <PlayCircle size={14} /> Chapter 01 · Video Lecture
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Physics of Control</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Watch the full illustrated lecture once end-to-end, then jump back to any chapter from the
          transcript. The story unfolds in twelve panels - atomic structure, the Garba, electrons &
          holes, and the 3-tier city.
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
              src="/videos/be1vid.mp4"
              accent="#fb923c"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={setDuration}
            />
          </motion.div>

          {/* Chapter pills */}
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
                  className={`min-h-[40px] sm:min-h-0 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold transition-all ${
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

        {/* Transcript panel */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-3xl border ${cardBg} max-h-[680px] overflow-y-auto`}
        >
          <div className="flex items-center gap-2 mb-5 sticky top-0 -mt-1 pt-1 pb-3 -mx-1 px-1"
               style={{ background: isDarkMode ? 'var(--bg-elev)' : '#FFFFFF' }}>
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
        Transcript composed from the on-screen narration to mirror the storybook&apos;s twelve panels.
        Use it as a reading companion if you prefer to skim before watching.
      </p>
    </div>
  );
};
