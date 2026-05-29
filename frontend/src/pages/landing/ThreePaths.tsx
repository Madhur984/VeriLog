import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Waves, Code2, Compass, type LucideIcon } from 'lucide-react';
import { LANDING_ROUTES } from './landingRoutes';

type Card = {
  id: number;
  accent: string;
  tag: string;
  title: string;
  description: string;
  time: string;
  level: string;
  cta: string;
  status: 'LIVE' | 'SOON';
  link?: string;
  action?: () => void;
  Icon: LucideIcon;
};

export const ThreePaths = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [waitlistJoined, setWaitlistJoined] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setWaitlistJoined(true);
      setTimeout(() => {
        setShowWaitlist(false);
        setWaitlistJoined(false);
        setEmail('');
      }, 2500);
    }
  };

  const CARDS: Card[] = [
    {
      id: 1, accent: '#0891B2', tag: 'DD · LIVE NOW', status: 'LIVE',
      title: 'Digital Design Foundations',
      description: 'From AND gates to K-maps to NAND-only circuits - the fundamentals every ECE student needs, interactive and built to actually stick.',
      time: '~90 min', level: 'Start here · Year 1-3',
      cta: 'Begin module →', link: LANDING_ROUTES.digitalDesign, Icon: Waves,
    },
    {
      id: 2, accent: '#F59E0B', tag: 'VL · COMING SOON', status: 'SOON',
      title: 'Verilog Hardware Description',
      description: 'The language of chips - from always-blocks to testbenches. Built for Indian ECE students who have never touched Verilog.',
      time: '~120 min', level: 'Year 3-4 · post-DD',
      cta: 'Join waitlist', action: () => setShowWaitlist(true), Icon: Code2,
    },
    {
      id: 3, accent: '#EA580C', tag: 'CAREER · LIVE NOW', status: 'LIVE',
      title: 'Silicon Career Intelligence',
      description: '13 ECE domains, salary data, company-match scores and a trajectory simulator. Go from "confused" to "chip design engineer."',
      time: 'Explore freely', level: 'All years',
      cta: 'Explore roadmap →', link: LANDING_ROUTES.career, Icon: Compass,
    },
  ];

  return (
    <section className="w-full" style={{ background: '#F4F6FA' }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: '#0891B2' }}>
            Where do you start
          </span>
          <h2 className="mt-3 font-extrabold tracking-tight" style={{ fontSize: 'clamp(30px, 4.5vw, 46px)', color: '#0B1220', letterSpacing: '-0.02em' }}>
            Three paths. One platform.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: '#475569' }}>
            Whether you&apos;re lost in Year 1 or prepping for placements in Year 4, start here.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((card) => {
            const isLive = card.status === 'LIVE';
            const go = () => (card.action ? card.action() : card.link && navigate(card.link));
            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25 }}
                onClick={go}
                className="group relative flex flex-col justify-between rounded-2xl bg-white p-7 cursor-pointer overflow-hidden"
                style={{ border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 16px 40px rgba(15,23,42,0.10)'; e.currentTarget.style.borderColor = `${card.accent}55`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(15,23,42,0.04)'; e.currentTarget.style.borderColor = 'rgba(15,23,42,0.08)'; }}
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: card.accent }} />

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${card.accent}14`, color: card.accent }}>
                      <card.Icon size={22} strokeWidth={2} />
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: isLive ? '#10B981' : '#F59E0B' }}>
                      <span className={`h-1.5 w-1.5 rounded-full ${isLive ? 'animate-pulse' : ''}`} style={{ background: isLive ? '#10B981' : '#F59E0B' }} />
                      {isLive ? 'Live' : 'Soon'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: card.accent }}>{card.tag}</span>
                    <h3 className="mt-1 text-lg font-bold leading-snug" style={{ color: '#0B1220' }}>{card.title}</h3>
                  </div>

                  <p className="text-sm leading-relaxed min-h-[88px]" style={{ color: '#475569' }}>{card.description}</p>
                </div>

                <div className="mt-7 pt-5" style={{ borderTop: '1px solid rgba(15,23,42,0.06)' }}>
                  <div className="flex justify-between text-[11px] font-medium mb-4" style={{ color: '#94A3B8' }}>
                    <span>{card.time}</span>
                    <span style={{ color: card.accent }}>{card.level}</span>
                  </div>
                  <span
                    className="block w-full text-center py-2.5 rounded-xl text-sm font-bold transition-colors"
                    style={{ background: isLive ? card.accent : 'transparent', color: isLive ? '#fff' : card.accent, border: isLive ? 'none' : `1px solid ${card.accent}` }}
                  >
                    {card.cta}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Waitlist modal */}
      <AnimatePresence>
        {showWaitlist && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-6"
            style={{ background: 'rgba(11,18,32,0.55)', backdropFilter: 'blur(6px)' }}
            onClick={() => setShowWaitlist(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 16 }}
              className="w-full max-w-md p-8 rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-1.5" style={{ color: '#0B1220' }}>Join the Verilog waitlist</h3>
              <p className="text-sm mb-6" style={{ color: '#64748B' }}>Be first to know when the Verilog module goes live.</p>
              {waitlistJoined ? (
                <div className="p-4 rounded-xl text-sm text-center font-semibold" style={{ background: 'rgba(16,185,129,0.10)', color: '#059669' }}>
                  ✓ You&apos;re on the list!
                </div>
              ) : (
                <form onSubmit={handleWaitlist} className="space-y-4">
                  <input
                    type="email" required placeholder="engineering@ece.in" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ background: '#F4F6FA', border: '1px solid rgba(15,23,42,0.12)', color: '#0B1220' }}
                  />
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowWaitlist(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ border: '1px solid rgba(15,23,42,0.12)', color: '#475569' }}>
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold text-white" style={{ background: '#F59E0B' }}>
                      Notify me
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
