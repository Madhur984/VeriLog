import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Languages, FileText, Volume2 } from 'lucide-react';
import { CustomVideoPlayer } from '../../../ui/CustomVideoPlayer';

interface Props { isActive: boolean; isDarkMode: boolean; }
type Lang = 'en' | 'hi';
type Part = 1 | 2;

const TRANSCRIPT: Record<Part, Record<Lang, { t: string; line: string }[]>> = {
  1: {
    en: [
      { t: '00:00', line: 'Welcome to Module 4. Today we leave behind boring textbook circuits and walk into Kriten\'s AC/DC Water Park.' },
      { t: '00:15', line: 'Electronics feels invisible and abstract. But what if we mapped every circuit to water flow? Voltage = pressure. Current = flow rate. Diodes = one-way valves.' },
      { t: '00:35', line: 'Our challenge: the wall socket gives us alternating current. The waves slosh forward, then violently backward, fifty times every second.' },
      { t: '00:55', line: 'But our laptops, our phones, every microchip — they want a calm, lazy river. A clean DC voltage that never reverses.' },
      { t: '01:15', line: 'Plug DC electronics straight into AC mains and the chip fries. So our job is to turn the chaos into calm.' },
      { t: '01:35', line: 'The hero of this transformation is the diode. In the park, it is a one-way flapper valve — water can push it open in the forward direction, but reverse pressure jams it shut.' },
      { t: '01:55', line: 'An ideal diode opens instantly with zero resistance. A real silicon diode needs about 0.7 volts of pressure to push the valve open — that is the knee voltage.' },
      { t: '02:20', line: 'In the next chapters we will build half-wave, full-wave, and bridge rectifiers, then add a capacitor filter — the overhead water tank that smooths the pulses into a clean DC line.' },
    ],
    hi: [
      { t: '00:00', line: 'Module 4 mein swagat hai. Aaj hum diodes aur unke applications padhenge. Lekin standard boring circuits ki jagah, hum Kriten\'s AC/DC Water Park ke through ride lenge.' },
      { t: '00:15', line: 'Electronics samjhne mein abstract lagta hai. Par voltage ko pressure samjho, current ko flow, aur diodes ko one-way valves — toh sab kuch saaf ho jaata hai.' },
      { t: '00:35', line: 'Hamare ghar mein jo power aati hai (AC), woh ek wave pool ki tarah hai — paani aage aur peeche violently slosh kar raha hai. 50 baar har second.' },
      { t: '00:55', line: 'Par hamare laptops, phones, har electronic device — sabko ek calm lazy river chahiye (DC). Smooth, ek hi direction mein flow.' },
      { t: '01:15', line: 'Agar AC seedha electronics mein chala gaya, toh circuit fry ho jayega. Toh hamara goal: chaos ko calm mein convert karna.' },
      { t: '01:35', line: 'Iss transformation ka hero hai diode. Park mein, yeh ek one-way flapper valve hai — paani aage push kar sakta hai, par reverse mein valve band ho jaata hai.' },
      { t: '01:55', line: 'Ideal diode instantly khulta hai, zero resistance. Lekin real silicon diode ko thoda pressure (0.7 V) chahiye padta hai — yeh knee voltage hai.' },
      { t: '02:20', line: 'Agle chapters mein hum half-wave, full-wave, aur bridge rectifier banayenge. Phir capacitor filter add karenge — yeh overhead water tank hai jo pulses ko smooth DC mein convert karta hai.' },
    ],
  },
  2: {
    en: [
      { t: '00:00', line: 'In part two we move to the actual rectifier circuits and the math behind them.' },
      { t: '00:15', line: 'A half-wave rectifier uses one diode. The forward half of the AC wave passes through. The negative half hits a closed valve and is wasted.' },
      { t: '00:35', line: 'Mathematically, the average DC output is Vm divided by pi — that\'s 31.8% of the peak. Half the input energy is thrown away. Pretty bad efficiency.' },
      { t: '00:55', line: 'And the output is not flat — it pulses with massive ripple. Ripple factor for half-wave is 1.21, or 121%. The slosh is bigger than the underlying river.' },
      { t: '01:15', line: 'Engineering upgrade: full-wave rectifier. Instead of blocking the negative half, route it back into the forward direction. Now we use both halves.' },
      { t: '01:35', line: 'A bridge rectifier uses 4 diodes. Whichever way the wave swings, two diodes route the flow forward, two block. The current always crosses the load in one direction.' },
      { t: '01:55', line: 'Math improves dramatically: Vdc becomes 0.636 Vm — double the half-wave. Ripple drops to 48%. But the output still pulses 100 times per second.' },
      { t: '02:20', line: 'Final step: the capacitor filter. The capacitor charges fast when the rectifier is pumping, and discharges slowly through the load when the pulse drops. Voltage stays nearly flat — a small sawtooth ripple. That is our final clean DC.' },
    ],
    hi: [
      { t: '00:00', line: 'Part 2 mein hum actual rectifier circuits aur uske math pe baat karenge.' },
      { t: '00:15', line: 'Half-wave rectifier mein ek diode hota hai. AC ka positive half pass ho jata hai. Negative half closed valve par takkar maar ke waste ho jaata hai.' },
      { t: '00:35', line: 'Math mein, average DC output Vm/pi hai — yani peak voltage ka sirf 31.8%. Half energy waste. Bahut low efficiency.' },
      { t: '00:55', line: 'Aur output flat nahi hota — bahut bada ripple aata hai. Half-wave mein ripple factor 1.21 yani 121%. Slosh underlying river se bhi bada.' },
      { t: '01:15', line: 'Engineering upgrade: full-wave rectifier. Negative half ko block karne ki jagah, usko forward direction mein route kar do. Dono halves use ho jate hain.' },
      { t: '01:35', line: 'Bridge rectifier mein 4 diodes hote hain. AC chahe jis direction mein swing kare, 2 diodes flow ko forward bhej dete hain, 2 block kar dete hain. Current load se humesha ek hi direction mein guzarta hai.' },
      { t: '01:55', line: 'Math improve hota hai: Vdc ban jata hai 0.636 Vm — half-wave ka double. Ripple 48% pe aa jata hai. Par output abhi bhi 100 baar per second pulse karta hai.' },
      { t: '02:20', line: 'Final step: capacitor filter. Capacitor jaldi charge ho jata hai jab rectifier pump kar raha hai, aur load se dheere-dheere discharge hota hai jab pulse girta hai. Voltage almost flat — bas thoda sawtooth ripple. Yeh hamara clean DC hai.' },
    ],
  },
};

export const S01_Video: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [part, setPart] = useState<Part>(1);
  const [lang, setLang] = useState<Lang>('en');

  const videoSrc = part === 1 ? '/videos/BE4_Rectifiers_Part1.mp4' : '/videos/BE4_Rectifiers_Part2.mp4';
  const transcript = TRANSCRIPT[part][lang];

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <PlayCircle size={14} /> Bilingual Lecture · EN + HI
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Watch the park come alive.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Two short clips. Tap a language tab on the right for the full transcript with timestamps —
          read along while you watch, in either English or Hindi.
        </p>
      </section>

      {/* Part selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className={`font-mono text-[10px] uppercase tracking-widest ${subText}`}>Part</span>
        {[1, 2].map((p) => (
          <button
            key={p}
            onClick={() => setPart(p as Part)}
            className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-widest font-black transition-all ${
              part === p
                ? 'bg-cyan-400 text-black'
                : isDarkMode ? 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10' : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Part {p} · {p === 1 ? 'Park Tour' : 'Rectifier Math'}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
        {/* Video */}
        <motion.div
          key={videoSrc}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`relative rounded-3xl overflow-hidden border ${cardBg} shadow-2xl`}
        >
          <CustomVideoPlayer src={videoSrc} accent="#22d3ee" />
          <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-cyan-400/30 font-mono text-[10px] uppercase tracking-widest text-cyan-300 flex items-center gap-2 pointer-events-none">
            <Volume2 size={12} /> Part {part}
          </div>
        </motion.div>

        {/* Transcript with EN/HI tabs */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`rounded-3xl border ${cardBg} flex flex-col`}
        >
          <div className="p-4 border-b flex items-center justify-between gap-3" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-cyan-400">
              <FileText size={12} /> Transcript · Part {part}
            </div>
            {/* Lang toggle */}
            <div className={`inline-flex rounded-xl p-0.5 border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
              {(['en', 'hi'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="relative px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-widest font-black transition-all flex items-center gap-1"
                  style={{
                    color: lang === l ? '#000' : (isDarkMode ? '#cbd5e1' : '#475569'),
                    background: lang === l ? '#22d3ee' : 'transparent',
                  }}
                >
                  <Languages size={10} /> {l === 'en' ? 'EN' : 'हिं'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 max-h-[480px] overflow-y-auto space-y-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${part}-${lang}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
              >
                {transcript.map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`p-3 rounded-xl border flex gap-3 ${
                      isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="font-mono text-[10px] tabular-nums text-cyan-300 mt-0.5 shrink-0">{entry.t}</div>
                    <div className={`text-[12px] leading-relaxed ${textColor}`} lang={lang === 'hi' ? 'hi-IN' : 'en'}>
                      {entry.line}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Footer hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-5 rounded-2xl border ${cardBg} text-sm ${subText}`}
      >
        <strong className="text-cyan-300">Tip:</strong> the transcript is intentionally bilingual.
        Read the English first if the math vocabulary is new, or the Hindi first if you find the
        chaos-vs-calm intuition easier in everyday language.
      </motion.div>
    </div>
  );
};
