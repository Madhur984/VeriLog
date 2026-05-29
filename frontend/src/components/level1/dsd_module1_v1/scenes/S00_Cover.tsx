import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Camera, ShieldAlert, ArrowRight, Bell, Vote, DoorOpen, Plane } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S00_Cover: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-8">
      {/* Hero illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="relative rounded-3xl overflow-hidden border border-white/10 mx-auto max-w-3xl"
        style={{ background: '#fef9f0' }}
      >
        <img
          src="/images/sketchbook/p01.webp"
          alt="The Architecture of a Decision — Ben as photographer and as protector"
          className="w-full block"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-white/80">
          Ben Bitdiddle's Sketchbook · Page 01
        </div>
      </motion.div>

      {/* Hero */}
      <section className="text-center space-y-6 relative">
        <motion.span
          initial={{ opacity: 0, y: -10 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          className="font-mono text-[10px] tracking-[0.4em] uppercase text-rose-400 block"
        >
          DSD · Module 1 · The Architecture of a Decision
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className={`text-5xl md:text-7xl font-black tracking-tight leading-[0.95] ${textColor}`}
        >
          Demystifying Boolean<br />
          <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-rose-400 bg-clip-text text-transparent">
            Canonical Forms
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className={`text-lg md:text-xl max-w-2xl mx-auto ${subText}`}
        >
          A hand-drawn story-walk through SOP, POS, minterms and maxterms — narrated through{' '}
          <strong className="text-sky-400">Ben Bitdiddle&apos;s</strong> picnic.
        </motion.p>
      </section>

      {/* Two-up character cards: Optimist vs Pessimist */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
          className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-400/10 rounded-full blur-3xl" />
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
              <Camera size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-sky-400 mb-1">The Optimist</div>
              <h3 className={`text-xl font-black ${textColor}`}>Path of Joy &nbsp;·&nbsp; SOP</h3>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            Ben the photographer hunts for sunny universes — every <strong>1</strong> in the truth
            table is a moment worth catching. Each captured snapshot is a <strong>minterm</strong>;
            the basket of all snapshots is <em>Sum&nbsp;of&nbsp;Products</em>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4 }}
          className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-400/10 rounded-full blur-3xl" />
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-rose-400 mb-1">The Pessimist</div>
              <h3 className={`text-xl font-black ${textColor}`}>Path of Caution &nbsp;·&nbsp; POS</h3>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            Ben the protector erects barricades against doom — every <strong>0</strong> in the truth
            table is a disaster to wall off. Each barricade is a <strong>maxterm</strong>; the
            chain of every barricade is <em>Product&nbsp;of&nbsp;Sums</em>.
          </p>
        </motion.div>
      </div>

      {/* Story arc preview */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles size={16} className="text-amber-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">Story Arc</span>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { n: '01', t: 'Watch the picnic', d: 'A 5-minute illustrated lecture introduces the variables, the rule of the day, and the multiverse of outcomes.' },
            { n: '02', t: 'Explore the truth', d: 'Tap each of the 8 universes to see what makes Ben happy or miserable. Hunt minterms or barricade maxterms — your choice.' },
            { n: '03', t: 'Build both lenses', d: 'In the live lab, design any 3-variable function and watch SOP, POS, and DeMorgan\'s bridge appear in real time.' },
          ].map((s, i) => (
            <div key={s.n} className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-3xl font-black text-amber-400/60">{s.n}</span>
                <h4 className={`font-black text-sm ${textColor}`}>{s.t}</h4>
              </div>
              <p className={`text-xs leading-relaxed ${subText}`}>{s.d}</p>
              {i < 2 && <ArrowRight size={14} className="opacity-30 hidden md:block" />}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Real-world applications strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
            Why this matters · the same trick lives everywhere
          </span>
        </div>
        <p className={`text-sm leading-relaxed mb-6 ${subText}`}>
          Boolean canonical forms aren&apos;t just for picnic moods. The same truth-table-to-SOP
          translation underpins every digital decision a chip makes.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { Icon: Bell, color: '#f43f5e', title: 'Burglar Alarm',
              ex: 'Trigger when (window OR door) AND armed mode AND NOT bypass.',
              link: 'F = (W + D) · M · B′' },
            { Icon: Vote, color: '#10b981', title: 'Majority Voter',
              ex: 'Triple-redundant systems output the value at least 2 of 3 sensors agree on.',
              link: 'F = AB + AC + BC' },
            { Icon: DoorOpen, color: '#f59e0b', title: 'Garage Door Logic',
              ex: 'Open if remote pressed AND no obstruction; close on second press.',
              link: 'F = R · O′' },
            { Icon: Plane, color: '#0ea5e9', title: 'Avionics Interlock',
              ex: 'Allow takeoff if all checklists complete AND no warning lights.',
              link: 'F = C₁·C₂·C₃·C₄ · W′' },
          ].map((app, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.05 }}
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                   style={{ background: `${app.color}1f`, color: app.color, border: `1px solid ${app.color}55` }}>
                <app.Icon size={18} />
              </div>
              <h4 className={`font-black text-sm mb-2 ${textColor}`}>{app.title}</h4>
              <p className={`text-[11px] leading-relaxed mb-3 ${subText}`}>{app.ex}</p>
              <code className="text-[10px] font-mono px-2 py-1 rounded block"
                    style={{ background: `${app.color}14`, color: app.color }}>
                {app.link}
              </code>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.9 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText}`}
      >
        Press <kbd className="px-2 py-1 rounded bg-black/20 text-[10px]">→</kbd> to begin · 13 chapters · ~30 min
      </motion.div>
    </div>
  );
};
