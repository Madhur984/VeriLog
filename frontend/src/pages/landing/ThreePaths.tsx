import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ThreePaths = () => {
  const [email, setEmail] = useState('');
  const [waitlistJoined, setWaitlistJoined] = useState(false);
  const [showWaitlistInput, setShowWaitlistInput] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setWaitlistJoined(true);
      setTimeout(() => {
        setShowWaitlistInput(false);
        setWaitlistJoined(false);
        setEmail('');
      }, 3000);
    }
  };

  const CARDS = [
    {
      id: 1,
      accent: '#22D3EE',
      title: 'Digital Design Foundations',
      tag: 'DD-M01 · LIVE NOW',
      description: "From AND gates to K-Maps to NAND-only circuits. The fundamentals every ECE student needs — interactive, visual, and built to actually stick.",
      time: '~90 min',
      level: 'START HERE if you are in Year 1–3',
      cta: 'BEGIN MODULE →',
      link: '/dsd/1',
      status: 'LIVE',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" stroke="#22D3EE" strokeWidth="2">
          {/* Waveform SVG */}
          <path d="M5 20 H12 V10 H22 V30 H32 V20 H35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: 2,
      accent: '#F59E0B',
      title: 'Verilog Hardware Description',
      tag: 'VL-M01 · COMING SOON',
      description: "Learn the language of chips. From always blocks to testbenches. The only resource built for Indian ECE students who have never touched Verilog.",
      time: '~120 min',
      level: 'Year 3–4 · Post-Digital Design',
      cta: 'JOIN WAITLIST',
      action: () => setShowWaitlistInput(true),
      status: 'SOON',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" stroke="#F59E0B" strokeWidth="2">
          {/* Brackets SVG */}
          <path d="M12 14 L6 20 L12 26 M28 14 L34 20 L28 26 M18 10 L22 30" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: 3,
      accent: '#EA580C',
      title: 'Silicon Career Intelligence',
      tag: 'v5.0 · LIVE NOW',
      description: "13 ECE domains. Salary data. Company match scores. Trajectory simulator. Everything you need to go from 'confused ECE student' to 'chip design engineer.'",
      time: 'Explore at your pace',
      level: 'All years · Especially Year 3–4',
      cta: 'EXPLORE ROADMAP →',
      link: '/career-roadmap',
      status: 'LIVE',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" stroke="#EA580C" strokeWidth="2">
          {/* Compass SVG */}
          <circle cx="20" cy="20" r="12" />
          <path d="M20 5 V35 M5 20 H35" strokeDasharray="3 3" />
          <path d="M16 16 L24 24 M24 16 L16 24" />
        </svg>
      )
    }
  ];

  return (
    <section id="three-paths" className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full relative">
      <div className="space-y-16">
        {/* Section Header */}
        <div className="space-y-4 text-center md:text-left">
          <span
            className="text-[10px] font-mono tracking-widest uppercase block"
            style={{ color: '#475569' }}
          >
            WHERE DO YOU START
          </span>
          <h2
            className="font-bold tracking-tight leading-tight uppercase font-sans text-white"
            style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
          >
            Three paths. One platform.
          </h2>
          <p className="text-slate-400 font-sans text-base max-w-2xl leading-relaxed">
            Whether you're lost in Year 1 or preparing for placement in Year 4, start here.
          </p>
        </div>

        {/* Path Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CARDS.map(card => {
            const isLive = card.status === 'LIVE';

            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative flex flex-col justify-between p-7 bg-[#0D0F12] rounded-2xl overflow-hidden group select-none cursor-pointer"
                style={{
                  border: '1px solid rgba(148,163,184,0.08)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${card.accent}40`;
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)';
                  const bar = e.currentTarget.querySelector('.accent-bar') as HTMLDivElement;
                  if (bar) bar.style.opacity = '1';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(148,163,184,0.08)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                  const bar = e.currentTarget.querySelector('.accent-bar') as HTMLDivElement;
                  if (bar) bar.style.opacity = '0.7';
                }}
                onClick={card.action ? card.action : () => {
                  if (card.link) window.location.href = card.link;
                }}
              >
                {/* Top accent bar */}
                <div
                  className="accent-bar absolute top-0 left-0 right-0 h-[3px] transition-opacity duration-300 opacity-70"
                  style={{
                    background: card.accent,
                    borderRadius: '3px 3px 0 0',
                  }}
                />

                <div className="space-y-6">
                  {/* Status Indicator & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                      {card.icon}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isLive ? (
                        <>
                          <span
                            className="h-1.5 w-1.5 rounded-full animate-ping"
                            style={{ background: '#10B981' }}
                          />
                          <span className="text-[10px] font-mono font-bold text-[#10B981]">
                            LIVE
                          </span>
                        </>
                      ) : (
                        <>
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: '#F59E0B' }}
                          />
                          <span className="text-[10px] font-mono font-bold text-[#F59E0B]">
                            SOON
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Title & Tag */}
                  <div>
                    <span className="text-[10px] font-mono block opacity-60 mb-1" style={{ color: card.accent }}>
                      {card.tag}
                    </span>
                    <h3 className="text-xl font-bold font-sans text-white leading-snug">
                      {card.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 font-sans text-xs sm:text-sm leading-relaxed min-h-[80px]">
                    {card.description}
                  </p>
                </div>

                {/* Footer Details */}
                <div className="mt-8 pt-6 border-t border-white/[0.03] space-y-4">
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>TIME: {card.time}</span>
                    <span style={{ color: card.accent }}>{card.level}</span>
                  </div>

                  {card.action ? (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        card.action();
                      }}
                      className="w-full text-center py-2.5 font-mono text-xs font-bold rounded-lg border transition-all duration-200 cursor-pointer"
                      style={{
                        borderColor: card.accent,
                        color: card.accent,
                      }}
                    >
                      {card.cta}
                    </button>
                  ) : (
                    <a
                      href={card.link}
                      className="w-full text-center block py-2.5 font-mono text-xs font-bold rounded-lg transition-all duration-200"
                      style={{
                        background: card.accent,
                        color: '#07080A',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#FFF';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = card.accent;
                      }}
                    >
                      {card.cta}
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Waitlist Modal popup overlay */}
      <AnimatePresence>
        {showWaitlistInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#07080A]/90 backdrop-blur-md"
            onClick={() => setShowWaitlistInput(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md p-8 rounded-2xl bg-[#0D0F12] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold font-mono text-white mb-2 uppercase">JOIN VERILOG WAITLIST</h3>
              <p className="text-xs text-slate-400 font-sans mb-6">
                Be the first to learn when Module VL-M01 goes live. We will notify you immediately.
              </p>

              {waitlistJoined ? (
                <div className="p-4 rounded-xl border border-[#10B981]/20 bg-[#10B981]/5 text-[#10B981] font-mono text-xs text-center uppercase tracking-wider">
                  ✓ Successfully Subscribed to waitlist!
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. engineering@ece.in"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[#07080A] border border-white/10 rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowWaitlistInput(false)}
                      className="flex-1 py-3 border border-white/10 text-slate-400 hover:text-white rounded-lg font-mono text-xs uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-[#F59E0B] text-[#07080A] hover:bg-[#ffb333] rounded-lg font-mono text-xs font-bold uppercase cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
