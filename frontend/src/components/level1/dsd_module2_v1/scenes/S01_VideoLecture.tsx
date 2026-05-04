import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, FileText, Bookmark, Languages, Volume2 } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

interface Chapter { t: number; titleEn: string; titleHi: string; lineEn: string; lineHi: string; }

type Lang = 'en' | 'hi';

const TRACKS: Record<Lang, { src: string; label: string; native: string; }> = {
  en: { src: '/videos/The_K-Map_Puzzle.mp4',    label: 'English',  native: 'English'  },
  hi: { src: '/videos/The_Logic_Labyrinth.mp4', label: 'Hindi',    native: 'हिंदी'    },
};

const CHAPTERS: Chapter[] = [
  {
    t: 0,
    titleEn: 'The 16-Row Headache',
    titleHi: '16 पंक्तियों का सिरदर्द',
    lineEn: 'Minimising a 4-variable Boolean expression with raw algebra means staring at a 16-row truth table. The patterns are buried — like managing a hotel using a chaotic, sequential guest list.',
    lineHi: 'चार वेरिएबल के बूलियन समीकरण को सिर्फ़ बीजगणित से छोटा करना मतलब 16 पंक्तियों की ट्रुथ टेबल को घूरते रहना। पैटर्न दिखाई ही नहीं देते — जैसे एक होटल को बेतरतीब अतिथि सूची से चलाना।',
  },
  {
    t: 18,
    titleEn: 'Enter Madhur',
    titleHi: 'मधुर का आगमन',
    lineEn: 'Meet Madhur, the hostel warden. He doesn\'t see lists — he sees architecture. Madhur folds the 16 possible combinations into a 4×4 floor plan. Every minterm gets its own room.',
    lineHi: 'मिलिए मधुर से, हॉस्टल वार्डन। उसे सूचियाँ नहीं, इमारत दिखती है। मधुर 16 संभावनाओं को 4×4 फ़्लोर प्लान में मोड़ देता है। हर minterm को उसका अपना कमरा मिलता है।',
  },
  {
    t: 48,
    titleEn: 'The Logic Translator',
    titleHi: 'लॉजिक अनुवादक',
    lineEn: 'A minterm becomes a Single Room. A 1 in the truth table is a Premium Guest needing an upgrade. SOP simplification becomes Wing Optimisation. Logical adjacency means rooms sharing a physical wall.',
    lineHi: 'एक minterm = एक कमरा। ट्रुथ टेबल में 1 = एक प्रीमियम मेहमान जिसे अपग्रेड चाहिए। SOP सरलीकरण = विंग ऑप्टिमाइज़ेशन। लॉजिकल आसन्नता = साझी दीवार वाले कमरे।',
  },
  {
    t: 80,
    titleEn: 'Rule 1 · Why Standard Binary Fails',
    titleHi: 'नियम 1 · मानक बाइनरी क्यों फ़ेल है',
    lineEn: 'Going from 01 to 10 in standard binary flips two bits at once. In Madhur\'s world that\'s knocking down two walls simultaneously — a structural disaster. Adjacency must be one-bit, one-wall.',
    lineHi: '01 से 10 जाने में मानक बाइनरी दो बिट्स एक साथ बदलती है। मधुर के लिए यह दो दीवारें एक साथ तोड़ना है — संरचनात्मक आपदा। आसन्नता एक बिट, एक दीवार होनी चाहिए।',
  },
  {
    t: 110,
    titleEn: 'The Gray Code Solution',
    titleHi: 'ग्रे कोड समाधान',
    lineEn: 'Madhur orders his corridors using Gray code: 00 → 01 → 11 → 10. Adjacent rooms always differ by exactly one bit. Physical adjacency is now guaranteed to equal logical adjacency.',
    lineHi: 'मधुर अपने गलियारों को ग्रे कोड से लगाता है: 00 → 01 → 11 → 10। पड़ोसी कमरे ठीक एक बिट से अलग होते हैं। भौतिक आसन्नता अब लॉजिकल आसन्नता के बराबर है।',
  },
  {
    t: 145,
    titleEn: 'The Master Floor Plan',
    titleHi: 'मास्टर फ़्लोर प्लान',
    lineEn: 'Rows are AB, columns are CD, both Gray-coded. The decimal numbers zig-zag: 0,1,3,2 / 4,5,7,6 / 12,13,15,14 / 8,9,11,10. Every shared border is a shared Boolean variable.',
    lineHi: 'पंक्तियाँ AB, स्तंभ CD, दोनों ग्रे कोड में। दशमलव संख्याएँ ज़िग-ज़ैग चलती हैं: 0,1,3,2 / 4,5,7,6 / 12,13,15,14 / 8,9,11,10। हर साझी सीमा एक साझा बूलियन वेरिएबल है।',
  },
  {
    t: 185,
    titleEn: 'Rule 2 · Powers of Two',
    titleHi: 'नियम 2 · दो की घातें',
    lineEn: 'Madhur upgrades by grouping rooms into Wings. But his HVAC only comes in capacities of 1, 2, 4, 8 and 16 rooms. The goal is always the largest possible wing — bigger wings eliminate more variables.',
    lineHi: 'मधुर कमरों को विंग्स में जोड़कर अपग्रेड करता है। पर उसका HVAC सिर्फ़ 1, 2, 4, 8 और 16 कमरों की क्षमता में आता है। लक्ष्य हमेशा सबसे बड़ी संभव विंग — बड़ी विंग अधिक वेरिएबल हटाती है।',
  },
  {
    t: 220,
    titleEn: 'Allowed vs Illegal Wings',
    titleHi: 'अनुमत बनाम अवैध विंग्स',
    lineEn: 'Wings must be perfect rectangles or squares. Diagonals, L-shapes and zig-zags don\'t share enough walls to function as a single logical group. Geometry isn\'t cosmetic — it\'s law.',
    lineHi: 'विंग्स पूर्ण आयत या वर्ग होनी चाहिए। विकर्ण, L-आकार और ज़िग-ज़ैग समूह नहीं बन सकते क्योंकि साझी दीवारें कम पड़ती हैं। ज्यामिति सजावट नहीं — यह नियम है।',
  },
  {
    t: 255,
    titleEn: 'Rule 3 · The Secret Corridors',
    titleHi: 'नियम 3 · गुप्त गलियारे',
    lineEn: 'The far-left and far-right columns differ by exactly one bit too — so they\'re adjacent. The flat blueprint rolls into a cylinder. The hostel literally curves.',
    lineHi: 'सबसे बाएँ और सबसे दाएँ स्तंभ भी ठीक एक बिट से अलग हैं — इसलिए वे आसन्न हैं। सपाट ब्लूप्रिंट एक सिलिंडर में लपेट जाता है। हॉस्टल वास्तव में मुड़ता है।',
  },
  {
    t: 290,
    titleEn: 'The Torus Effect',
    titleHi: 'टोरस प्रभाव',
    lineEn: 'The same magic applies vertically. Top row and bottom row share a wall. Curl left-to-right, then top-to-bottom — Madhur\'s hostel is a torus. The four extreme corners (0, 2, 8, 10) are one tight cluster.',
    lineHi: 'यही जादू ऊर्ध्वाधर रूप से भी लागू होता है। ऊपर और नीचे की पंक्तियाँ दीवार साझा करती हैं। बाएँ-दाएँ, फिर ऊपर-नीचे मोड़ें — मधुर का हॉस्टल एक टोरस है। चारों चरम कोने (0, 2, 8, 10) एक करीबी समूह हैं।',
  },
  {
    t: 320,
    titleEn: "Today's Manifest",
    titleHi: 'आज का मेनिफ़ेस्ट',
    lineEn: 'A daily upgrade order arrives: Y = Σm(0, 1, 2, 6, 8, 10, 13, 14). Madhur lights those rooms on his blueprint and asks one question: what\'s the smallest set of largest wings that covers them all?',
    lineHi: 'आज का अपग्रेड ऑर्डर: Y = Σm(0, 1, 2, 6, 8, 10, 13, 14)। मधुर उन कमरों को ब्लूप्रिंट पर रोशन करता है और एक ही सवाल पूछता है: सबसे कम बड़ी विंग्स में सबको कैसे कवर करें?',
  },
  {
    t: 350,
    titleEn: 'Four Operations',
    titleHi: 'चार ऑपरेशन',
    lineEn: 'Operation 1 — the Corner Suite {0,2,8,10} via the torus, gives B′D′. Operation 2 — the Vertical Corridor {2,6,10,14} gives CD′. Operation 3 — the Standard Pair {0,1} gives A′B′C′. Operation 4 — the Lone VIP at 13 gives ABC′D.',
    lineHi: 'ऑपरेशन 1 — कोने का सूट {0,2,8,10} टोरस से, देता है B′D′। ऑपरेशन 2 — ऊर्ध्वाधर गलियारा {2,6,10,14} देता है CD′। ऑपरेशन 3 — मानक जोड़ी {0,1} देती है A′B′C′। ऑपरेशन 4 — अकेला VIP 13 देता है ABC′D।',
  },
  {
    t: 395,
    titleEn: 'The Final Blueprint',
    titleHi: 'अंतिम ब्लूप्रिंट',
    lineEn: 'OR the four wings together: Y = B′D′ + CD′ + A′B′C′ + ABC′D. A 16-row truth table just collapsed into four short product terms. The architecture is approved.',
    lineHi: 'चारों विंग्स को OR कर दें: Y = B′D′ + CD′ + A′B′C′ + ABC′D। 16-पंक्तियों की ट्रुथ टेबल चार छोटे प्रोडक्ट टर्म्स में सिमट गई। आर्किटेक्चर अप्रूव्ड।',
  },
  {
    t: 430,
    titleEn: "The Don't Care Loophole",
    titleHi: "Don't Care का दाँव",
    lineEn: 'An X on the K-Map is a Room Under Maintenance. Madhur treats it as a 1 if doing so doubles the size of a wing — and treats it as a 0 otherwise. Free upgrades when geometry allows.',
    lineHi: 'K-मैप पर X मतलब रखरखाव में कमरा। अगर X को 1 मानने से विंग बड़ी होती है, मधुर उसे 1 मानता है — वरना 0। ज्यामिति अनुमति दे तो मुफ़्त अपग्रेड।',
  },
  {
    t: 460,
    titleEn: 'Three Core Principles',
    titleHi: 'तीन मूल सिद्धांत',
    lineEn: 'The Grid: Gray code guarantees one-bit-flip = one shared wall. The Wings: group strictly in rectangles of 1, 2, 4, 8, 16 — bigger always wins. The Corridors: it\'s a torus, always check the edges and corners.',
    lineHi: 'ग्रिड: ग्रे कोड सुनिश्चित करता है — एक बिट परिवर्तन = एक साझी दीवार। विंग्स: सख़्ती से 1, 2, 4, 8, 16 के आयतों में समूह बनाएँ — बड़ा हमेशा बेहतर। गलियारे: यह टोरस है, किनारों और कोनों को हमेशा जाँचें।',
  },
];

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
};

export const S01_VideoLecture: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lang, setLang] = useState<Lang>('en');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);

  // When language changes, swap source but try to preserve playback position.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const t = v.currentTime;
    const wasPlaying = !v.paused;
    v.src = TRACKS[lang].src;
    v.load();
    const onLoaded = () => {
      v.currentTime = Math.min(t, v.duration || t);
      if (wasPlaying) v.play().catch(() => {});
      v.removeEventListener('loadedmetadata', onLoaded);
    };
    v.addEventListener('loadedmetadata', onLoaded);
  }, [lang]);

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
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <PlayCircle size={14} /> Chapter 01 · Video Lecture
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Logic Labyrinth</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Madhur&apos;s full architectural walkthrough — pick your language above the player. The
          <strong> English</strong> track narrates the story end-to-end; the <strong>हिंदी</strong> track gives the same
          journey with a Hindi voiceover. Both transcripts stay in sync as you scrub.
        </p>
      </section>

      {/* Language toggle */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-4 rounded-2xl border ${cardBg} flex items-center justify-between flex-wrap gap-4`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Languages size={18} />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400">Audio Track</div>
            <div className={`text-sm font-bold ${textColor}`}>Choose your language · आवाज़ चुनें</div>
          </div>
        </div>
        <div className={`relative inline-flex p-1 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
          {(Object.keys(TRACKS) as Lang[]).map((k) => {
            const active = lang === k;
            return (
              <button
                key={k}
                onClick={() => setLang(k)}
                className={`relative z-10 flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-colors ${
                  active ? 'text-black' : isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="lang-pill"
                    className="absolute inset-0 rounded-xl bg-amber-400 shadow-[0_0_18px_rgba(252,211,77,0.4)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <Volume2 size={14} />
                  <span className="font-mono">{TRACKS[k].native}</span>
                  <span className="opacity-60 text-[10px]">· {TRACKS[k].label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
        {/* Video player + chapter scrubber */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
            className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
          >
            <video
              key={lang} // ensures clean remount when needed
              ref={videoRef}
              src={TRACKS[lang].src}
              controls
              playsInline
              className="w-full block aspect-video bg-black"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-amber-400/30 font-mono text-[10px] uppercase tracking-widest text-amber-300 flex items-center gap-2">
              <Volume2 size={12} /> {TRACKS[lang].native}
            </div>
          </motion.div>

          {/* Chapter pills */}
          <div className={`p-5 rounded-2xl border ${cardBg}`}>
            <div className="flex items-center gap-2 mb-4">
              <Bookmark size={14} className="text-amber-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
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
                      ? 'bg-amber-400 text-black border border-amber-300 shadow-lg shadow-amber-500/30'
                      : isDarkMode
                        ? 'bg-white/5 border border-white/10 text-slate-300 hover:border-amber-400'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-amber-400'
                  }`}
                >
                  <span className="opacity-50 mr-1.5">{formatTime(c.t)}</span>
                  {lang === 'en' ? c.titleEn : c.titleHi}
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
              {lang === 'en' ? 'Transcript · English' : 'Transcript · हिंदी'}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={lang}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
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
                    <span className="font-black text-sm">{lang === 'en' ? c.titleEn : c.titleHi}</span>
                  </div>
                  <p className={`text-[13px] leading-relaxed ${subText}`} lang={lang}>
                    {lang === 'en' ? c.lineEn : c.lineHi}
                  </p>
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <p className={`text-[10px] font-mono opacity-50 ${subText}`}>
        Two synchronised tracks. The English video is <em>The K-Map Puzzle</em>; the Hindi video is
        <em> The Logic Labyrinth</em>. Switching language preserves your scrub position when possible.
      </p>
    </div>
  );
};
