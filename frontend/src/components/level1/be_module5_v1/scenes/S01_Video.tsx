import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Languages, FileText, Volume2, Baby } from 'lucide-react';
import { CustomVideoPlayer } from '../../../ui/CustomVideoPlayer';

interface Props { isActive: boolean; isDarkMode: boolean; }
type Lang = 'en' | 'hi';

const TRANSCRIPT: Record<Lang, { t: string; line: string }[]> = {
  en: [
    { t: '00:00', line: 'Welcome to the Neon Diode Gala. Today we leave behind the boring P-N junction and meet electronics royalty - Zener, LED, and Photodiode. The VIPs of every modern circuit.' },
    { t: '00:20', line: 'The normal diode is a simple one-way switch - conducts in forward bias, blocks in reverse. Good enough for rectifiers, but limited. The special-purpose diodes exploit phenomena the standard diode tries to avoid.' },
    { t: '00:45', line: 'First VIP: the Zener. Kriten the Voltage Bodyguard. Operates exclusively in reverse breakdown. When the source voltage rises, Zener swallows the extra current and the output voltage V_Z stays locked.' },
    { t: '01:10', line: 'Two breakdown mechanisms power the Zener. Zener breakdown - strong electric field below 5 volts - and Avalanche breakdown - high-velocity carriers colliding at higher voltages. Both produce that sharp, vertical knee in the V-I curve.' },
    { t: '01:35', line: 'Second VIP: the LED. The Diwali sparkler. Forward biased, electrons and holes recombine across the band gap and release energy as photons. The wavelength λ = h·c / E_g - narrow band gap means red, wide band gap means blue.' },
    { t: '02:00', line: 'GaN gives blue at 470 nm. GaP gives green. GaAsP gives red at 650 nm. Same diode topology, different semiconductor material - different colour.' },
    { t: '02:25', line: 'Third VIP: the Photodiode. The Paparazzi camera. Reverse biased so it normally blocks current. Shine light on the junction, photons knock minority carriers loose, and a measurable reverse current flows - proportional to luminous flux.' },
    { t: '02:50', line: 'Even in total darkness a tiny dark current flows, generated thermally. It is the noise floor of every optical sensor. Above it, response is almost perfectly linear with light intensity, and switching times reach nanosecond range.' },
    { t: '03:15', line: 'At the end of the module you will see a single diagnostic matrix - Zener, LED, Photodiode side by side. Bias direction, energy conversion, defining mechanism. One table. Everything you need to remember.' },
  ],
  hi: [
    { t: '00:00', line: 'Neon Diode Gala mein swagat hai. Aaj normal P-N junction ko peeche chhod ke electronics ke VIPs se milte hain - Zener, LED, aur Photodiode. Har modern circuit ke royal guests.' },
    { t: '00:20', line: 'Normal diode ek simple one-way switch hai - forward mein conduct, reverse mein block. Rectifiers ke liye theek hai, par limited. Special-purpose diodes wo phenomena exploit karte hain jo normal diode avoid karta hai.' },
    { t: '00:45', line: 'Pehla VIP: Zener. Kriten - Voltage Bodyguard. Sirf reverse breakdown mein kaam karta hai. Source voltage badhe toh extra current khud absorb karta hai, output voltage V_Z lock rehta hai.' },
    { t: '01:10', line: 'Do breakdown mechanisms hote hain. Zener breakdown - strong electric field, 5 volt se kam - aur Avalanche breakdown - high-speed carriers collide karte hain, higher voltage pe. Dono se V-I curve mein sharp vertical knee banta hai.' },
    { t: '01:35', line: 'Doosra VIP: LED. Diwali sparkler. Forward biased, electrons aur holes band gap ke across recombine karte hain aur energy photons mein release karte hain. Wavelength λ = h·c / E_g - chhota gap = red, bada gap = blue.' },
    { t: '02:00', line: 'GaN se blue, 470 nm. GaP se green. GaAsP se red, 650 nm. Same diode topology, different semiconductor material, different colour.' },
    { t: '02:25', line: 'Teesra VIP: Photodiode. Paparazzi camera. Reverse biased - normally current block. Junction pe light dalo, photons minority carriers ko free karte hain, aur measurable reverse current bahta hai - luminous flux ke proportional.' },
    { t: '02:50', line: 'Total darkness mein bhi ek chhota dark current bahta hai, thermal generation se. Yeh har optical sensor ka noise floor hai. Uske upar response almost perfectly linear hota hai, aur switching nanosecond range mein hoti hai.' },
    { t: '03:15', line: 'Module ke end mein ek single diagnostic matrix milega - Zener, LED, Photodiode side by side. Bias direction, energy conversion, defining mechanism. Ek table mein sab.' },
  ],
};

export const S01_Video: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [lang, setLang] = useState<Lang>('en');

  const transcript = TRANSCRIPT[lang];

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-orange-400">
          <PlayCircle size={14} /> Bilingual Lecture · EN + HI
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The curator&apos;s walkthrough.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          One short clip. Tap a language tab on the right for the timestamped transcript -
          read along in English or Hindi while each VIP takes the stage.
        </p>

        {/* Like you're 5 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          className="rounded-2xl p-5 border-2 mt-3"
          style={{ borderColor: '#facc1555', background: 'linear-gradient(135deg, rgba(250,204,21,0.10), rgba(168,85,247,0.06))' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Baby size={16} className="text-yellow-300" />
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-yellow-300 font-black">Like you&apos;re 5</div>
          </div>
          <p className={`text-sm ${subText} leading-relaxed`}>
            This is a storybook video. A teacher walks you through the three toy diodes one at a
            time. If English is harder, tap <span className="font-mono">हिं</span> on the right and
            you can read along in Hindi. Pause whenever you want.
          </p>
        </motion.div>
      </section>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`relative rounded-3xl overflow-hidden border ${cardBg} shadow-2xl`}
        >
          <CustomVideoPlayer src="/videos/BE5_Diode_Gala.mp4" accent="#facc15" />
          <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-bg-void border border-yellow-400/30 font-mono text-[10px] uppercase tracking-widest text-yellow-300 flex items-center gap-2 pointer-events-none">
            <Volume2 size={12} /> Neon Diode Gala
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`rounded-3xl border ${cardBg} flex flex-col`}
        >
          <div className="p-4 border-b flex items-center justify-between gap-3" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-yellow-300">
              <FileText size={12} /> Transcript
            </div>
            <div className={`inline-flex rounded-xl p-0.5 border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
              {(['en', 'hi'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="min-h-[40px] sm:min-h-0 relative px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-widest font-black transition-all flex items-center gap-1"
                  style={{
                    color: lang === l ? '#000' : (isDarkMode ? '#cbd5e1' : '#475569'),
                    background: lang === l ? '#facc15' : 'transparent',
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
                key={lang}
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
                    <div className="font-mono text-[10px] tabular-nums text-yellow-300 mt-0.5 shrink-0">{entry.t}</div>
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

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-5 rounded-2xl border ${cardBg} text-sm ${subText}`}
      >
        <strong className="text-yellow-300">Tip:</strong> the transcript follows the gala
        narrative - each VIP takes a section. Every later scene is fully interactive, so
        come back here whenever you want the high-level story again.
      </motion.div>
    </div>
  );
};
