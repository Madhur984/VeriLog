import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Crown, DoorClosed, Wrench, Layers3 } from 'lucide-react';

// Illustrated Madhur the Hostel Warden - SVG character (clipboard, glasses, suit)
const MadhurSVG: React.FC<{ size?: number }> = ({ size = 220 }) => (
  <svg viewBox="0 0 220 280" width={size} height={size * (280 / 220)} aria-label="Madhur the Hostel Warden">
    <defs>
      <linearGradient id="suit" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d4a373" />
        <stop offset="100%" stopColor="#a07752" />
      </linearGradient>
      <linearGradient id="clip" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fcd34d" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <radialGradient id="halo" cx="0.5" cy="0.3" r="0.6">
        <stop offset="0%" stopColor="rgba(252,211,77,0.35)" />
        <stop offset="100%" stopColor="rgba(252,211,77,0)" />
      </radialGradient>
    </defs>
    {/* Halo */}
    <ellipse cx="110" cy="80" rx="100" ry="60" fill="url(#halo)" />
    {/* Body / suit */}
    <path d="M50 280 Q50 200 80 175 L140 175 Q170 200 170 280 Z" fill="url(#suit)" />
    {/* Lapels */}
    <path d="M85 180 L110 215 L135 180 L130 175 L110 200 L90 175 Z" fill="#0f172a" />
    {/* Tie */}
    <polygon points="108,180 112,180 116,260 104,260" fill="#fcd34d" />
    {/* Neck */}
    <rect x="100" y="155" width="20" height="22" fill="url(#skin)" />
    {/* Head */}
    <ellipse cx="110" cy="125" rx="36" ry="40" fill="url(#skin)" />
    {/* Hair */}
    <path d="M76 105 Q80 80 110 78 Q140 80 144 105 L144 90 Q138 70 110 68 Q82 70 76 90 Z" fill="#1f2937" />
    {/* Eyebrows */}
    <rect x="88" y="118" width="14" height="3" rx="1.5" fill="#0f172a" />
    <rect x="118" y="118" width="14" height="3" rx="1.5" fill="#0f172a" />
    {/* Glasses */}
    <circle cx="95" cy="128" r="9" fill="none" stroke="#0f172a" strokeWidth="2" />
    <circle cx="125" cy="128" r="9" fill="none" stroke="#0f172a" strokeWidth="2" />
    <line x1="104" y1="128" x2="116" y2="128" stroke="#0f172a" strokeWidth="2" />
    {/* Eyes */}
    <circle cx="95" cy="128" r="2.4" fill="#0f172a" />
    <circle cx="125" cy="128" r="2.4" fill="#0f172a" />
    {/* Smile */}
    <path d="M97 148 Q110 156 123 148" stroke="#0f172a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    {/* Right arm + clipboard */}
    <path d="M150 200 Q170 220 175 250" stroke="url(#suit)" strokeWidth="22" fill="none" strokeLinecap="round" />
    <rect x="155" y="222" width="46" height="58" rx="3" fill="url(#clip)" stroke="#92400e" strokeWidth="1.5" />
    <rect x="167" y="220" width="22" height="6" rx="2" fill="#92400e" />
    {/* Lines on the clipboard */}
    {[0, 1, 2, 3, 4].map((i) => (
      <line key={i} x1="160" y1={235 + i * 8} x2="195" y2={235 + i * 8} stroke="#92400e" strokeWidth="1" opacity="0.6" />
    ))}
    {/* Left arm */}
    <path d="M70 200 Q55 230 65 270" stroke="url(#suit)" strokeWidth="22" fill="none" strokeLinecap="round" />
  </svg>
);

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
    detail: 'Merging rooms into the largest possible rectangular wing - that IS simplification.',
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
            Clipboard in hand, blueprint unfurled. He doesn&apos;t see a 16-row table - he sees a building.
            By folding combinations into a 4×4 plan, abstract algebra becomes a <strong>spatial puzzle</strong>.
          </p>

          {/* Illustrated character + animated mini blueprint */}
          <div className="grid grid-cols-[auto_1fr] gap-4 items-end">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="flex-shrink-0"
            >
              <MadhurSVG size={150} />
            </motion.div>
            <div
              className="aspect-[5/4] rounded-2xl border relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0c1a2e 0%, #102a4c 60%, #0a1628 100%)', borderColor: '#7daae6' }}
            >
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(125,170,230,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(125,170,230,0.55) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="absolute inset-2 grid grid-cols-4 grid-rows-4 gap-1">
                {[0, 1, 3, 2, 4, 5, 7, 6, 12, 13, 15, 14, 8, 9, 11, 10].map((m, i) => (
                  <motion.div
                    key={m}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.05, type: 'spring', stiffness: 300, damping: 18 }}
                    className="rounded-sm flex items-center justify-center text-[9px] font-mono font-bold"
                    style={{
                      background: 'rgba(252,211,77,0.10)',
                      color: '#fde68a',
                      border: '1px solid rgba(252,211,77,0.35)',
                    }}
                  >
                    {m}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-amber-200/60 mt-4 text-center">
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
        className="text-center max-w-3xl mx-auto"
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
