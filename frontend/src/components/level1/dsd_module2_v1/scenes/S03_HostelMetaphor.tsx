import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Crown, DoorClosed, Wrench, Layers3 } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

interface Row {
  text: string;
  textHi: string;
  hostel: string;
  hostelHi: string;
  Icon: React.FC<any>;
  detail: string;
}

const TRANSLATIONS: Row[] = [
  {
    text: 'Truth Table Row (Minterm)',
    textHi: 'सत्य सारणी पंक्ति (Minterm)',
    hostel: 'A Single Room (e.g. Room 0110)',
    hostelHi: 'एक कमरा (जैसे कमरा 0110)',
    Icon: DoorClosed,
    detail: 'Each of the 16 minterms is a unique room number on the floor plan.',
  },
  {
    text: "Variable State '1'",
    textHi: "वेरिएबल का मान '1'",
    hostel: 'A “Premium Guest” needing an upgrade',
    hostelHi: 'एक प्रीमियम मेहमान जिसे अपग्रेड चाहिए',
    Icon: Crown,
    detail: 'Wherever the truth table outputs 1, that room hosts a guest who must be served.',
  },
  {
    text: 'SOP Simplification',
    textHi: 'SOP सरलीकरण',
    hostel: '“Wing Optimisation” (combining premium rooms)',
    hostelHi: '"विंग ऑप्टिमाइज़ेशन" (कमरे जोड़ना)',
    Icon: Building2,
    detail: 'Merging rooms into the largest possible rectangular wing — that IS simplification.',
  },
  {
    text: 'Logical Adjacency',
    textHi: 'लॉजिकल आसन्नता',
    hostel: 'Rooms sharing a physical wall',
    hostelHi: 'साझी दीवार वाले कमरे',
    Icon: Layers3,
    detail: 'On Madhur’s blueprint, "next door" literally means "differs by one variable".',
  },
  {
    text: "'Don't Care' (X)",
    textHi: "'Don't Care' (X)",
    hostel: 'Room Under Maintenance (use only if it helps)',
    hostelHi: 'मरम्मत में कमरा (काम आए तो ही उपयोग करें)',
    Icon: Wrench,
    detail: 'Treat X as a 1 if absorbing it grows your wing; otherwise ignore it cleanly.',
  },
];

export const S03_HostelMetaphor: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-orange-400">
          <Building2 size={14} /> Chapter 03 · The Translator
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Madhur&apos;s Hostel Metaphor</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          To turn algebra into architecture, Madhur builds a <strong>Logic Translator</strong>. Five mappings
          are all you need. Memorise them and the K-Map becomes effortless.
        </p>
      </section>

      {/* Two columns: Madhur sketch + Translator table */}
      <div className="grid lg:grid-cols-[0.9fr_1.6fr] gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
          style={{ minHeight: 380 }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-3">The Architect</div>
          <h3 className={`text-2xl font-black mb-3 ${textColor}`}>Madhur, the Hostel Warden</h3>
          <p className={`text-sm leading-relaxed ${subText} mb-5`}>
            Clipboard in hand, blueprint unfurled. He doesn&apos;t see a 16-row table — he sees a building.
            By folding combinations into a 4×4 plan, abstract algebra becomes a <strong>spatial puzzle</strong>.
          </p>
          {/* Mini blueprint */}
          <div
            className="aspect-[16/10] rounded-2xl border relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0c1a2e 0%, #102a4c 60%, #0a1628 100%)', borderColor: '#7daae6' }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(125,170,230,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(125,170,230,0.55) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            <div className="absolute inset-3 grid grid-cols-4 grid-rows-4 gap-1.5">
              {[0, 1, 3, 2, 4, 5, 7, 6, 12, 13, 15, 14, 8, 9, 11, 10].map((m) => (
                <div
                  key={m}
                  className="rounded-sm flex items-center justify-center text-[9px] font-mono font-bold"
                  style={{
                    background: 'rgba(252,211,77,0.10)',
                    color: '#fde68a',
                    border: '1px solid rgba(252,211,77,0.35)',
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-amber-200/60 mt-3">
            16 minterms · 16 rooms · One blueprint
          </div>
        </motion.div>

        {/* The Translator table */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.1 }}
          className={`rounded-3xl border ${cardBg} overflow-hidden`}
        >
          <div className="grid grid-cols-2 px-6 py-4 border-b" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400">Textbook Logic</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-orange-400">Madhur&apos;s Hostel Rules</div>
          </div>
          <div className="divide-y" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
            {TRANSLATIONS.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.07 }}
                className={`grid grid-cols-2 items-center px-6 py-5 hover:bg-amber-400/5 transition-colors`}
              >
                <div>
                  <div className={`font-bold text-sm ${textColor}`}>{r.text}</div>
                  <div className={`text-[11px] mt-0.5 ${subText}`} lang="hi">{r.textHi}</div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight size={14} className="text-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 flex-shrink-0">
                        <r.Icon size={13} />
                      </div>
                      <div className={`font-bold text-sm ${textColor}`}>{r.hostel}</div>
                    </div>
                    <div className={`text-[11px] mt-1 ${subText}`}>{r.detail}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Synthesis line */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-6 rounded-3xl border ${cardBg} text-center`}
      >
        <p className={`text-base leading-relaxed ${textColor}`}>
          Once you see <strong className="text-amber-300">rooms</strong> instead of rows and{' '}
          <strong className="text-amber-300">walls</strong> instead of variables, the rest of K-Map theory is
          just three architectural rules. Let&apos;s lay them down.
        </p>
      </motion.div>
    </div>
  );
};
