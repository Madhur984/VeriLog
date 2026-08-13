import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ExternalLink, X, Pause, Play, Sparkles, Filter, Newspaper, Flame, Zap, Briefcase, Rocket } from 'lucide-react';
import { AccessibleDialog } from './AccessibleDialog';

export interface NewsItem {
  id: number;
  source: string;
  category: 'FABRICATION' | 'INVESTMENT' | 'ARCH' | 'DESIGN' | 'HIRING';
  headline: string;
  detail: string;
  time: string;
  url?: string;
  tags: string[];
  emoji: string;
  hotBadge?: string;
  reactions: { flame: number; zap: number; briefcase: number; rocket: number };
}

export const GLOBAL_NEWS_FEED: NewsItem[] = [
  {
    id: 1,
    source: 'TSMC Taiwan',
    category: 'FABRICATION',
    emoji: '🔬',
    hotBadge: '🔥 2NM REVOLUTION',
    headline: 'TSMC Begins Volume Production on 2nm (N2) Nanosheet GAA Node',
    detail: 'Hsinchu & Kaohsiung mega-fabs reach 80%+ yield on 2nm GAAFET silicon wafers powering 2026 flagship mobile & AI accelerators.',
    time: 'LIVE · 12m ago',
    url: 'https://www.tsmc.com',
    tags: ['2nm GAAFET', 'Fab Production', 'Silicon Yield'],
    reactions: { flame: 142, zap: 98, briefcase: 64, rocket: 215 }
  },
  {
    id: 2,
    source: 'India Semi Mission',
    category: 'INVESTMENT',
    emoji: '💰',
    hotBadge: '🤑 $10B SECURED',
    headline: 'India Approves $10 Billion ISM Phase-2 for 3 New Mega Fab & OSAT Units',
    detail: 'Tata Electronics Dholera Fab and Micron Sanand ATMP expanding massive recruitment drives for 15,000+ VLSI, STA, & Process Engineers.',
    time: 'LIVE · 45m ago',
    url: 'https://www.semiconductor.india.gov.in',
    tags: ['India Semiconductor', 'ISM 2.0', 'Dholera Fab'],
    reactions: { flame: 289, zap: 154, briefcase: 312, rocket: 405 }
  },
  {
    id: 3,
    source: 'NVIDIA Hardware',
    category: 'ARCH',
    emoji: '⚡',
    hotBadge: '🚀 20 PFLOPS MONSTER',
    headline: 'NVIDIA Blackwell B200 Ramps Production with 192GB HBM3e Memory',
    detail: 'Dual-die NVLink interconnect delivers 20 PFLOPS FP4 inference speed. Massive recruitment wave for Verilog & SystemVerilog UVM verification rockstars.',
    time: 'LIVE · 2h ago',
    url: 'https://www.nvidia.com',
    tags: ['Blackwell GPU', 'NVLink', 'HBM3e'],
    reactions: { flame: 512, zap: 420, briefcase: 198, rocket: 630 }
  },
  {
    id: 4,
    source: 'Intel Foundry',
    category: 'FABRICATION',
    emoji: '🔌',
    hotBadge: '✨ POWERVIA FLEX',
    headline: 'Intel 18A Node Achieves PowerVia Back-Side Power Delivery Milestone',
    detail: 'RibbonFET transistors reduce IR drop by 15% and increase routing density for 2026 client & server CPUs.',
    time: 'LIVE · 4h ago',
    url: 'https://www.intel.com',
    tags: ['Intel 18A', 'PowerVia', 'RibbonFET'],
    reactions: { flame: 87, zap: 145, briefcase: 76, rocket: 190 }
  },
  {
    id: 5,
    source: 'Qualcomm India',
    category: 'HIRING',
    emoji: '💼',
    hotBadge: '🎯 HIRING SPREE',
    headline: 'Qualcomm Opens New R&D Center in Chennai Focus on 6G & Automotive SoC',
    detail: 'Hiring expansion for SystemVerilog, UVM, Firmware, and Mixed-Signal ASIC Design teams across India offices.',
    time: 'LIVE · 5h ago',
    url: 'https://www.qualcomm.com/company/careers',
    tags: ['6G Modem', 'Automotive SoC', 'Chennai R&D'],
    reactions: { flame: 340, zap: 210, briefcase: 580, rocket: 275 }
  },
  {
    id: 6,
    source: 'ASML Veldhoven',
    category: 'DESIGN',
    emoji: '🎯',
    hotBadge: '🌟 HIGH-NA EUV',
    headline: 'ASML Ships Twinscan EXE:5000 High-NA EUV (0.55 NA) Lithography Scanner',
    detail: 'Next-generation 8nm resolution optics enable single-exposure printing for sub-2nm chip geometries.',
    time: 'LIVE · 6h ago',
    url: 'https://www.asml.com',
    tags: ['High-NA EUV', 'Lithography', 'Sub-2nm'],
    reactions: { flame: 165, zap: 188, briefcase: 92, rocket: 310 }
  },
  {
    id: 7,
    source: 'ARM Holdings',
    category: 'ARCH',
    emoji: '🦾',
    hotBadge: '⚡ 22% IPC BOOST',
    headline: 'ARM Announces Cortex-X5 Microarchitecture with 3MB L2 Cache',
    detail: '3-way execution pipeline enhancements deliver 22% IPC boost for next-gen flagship mobile SoCs.',
    time: 'LIVE · 8h ago',
    url: 'https://www.arm.com',
    tags: ['Cortex-X5', 'ARMv9', 'Microarch'],
    reactions: { flame: 210, zap: 175, briefcase: 110, rocket: 240 }
  }
];

const categoryStyles: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  FABRICATION: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-400', glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]' },
  INVESTMENT: { bg: 'bg-amber-500/15', border: 'border-amber-500/40', text: 'text-amber-400', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]' },
  ARCH: { bg: 'bg-pink-500/15', border: 'border-pink-500/40', text: 'text-pink-400', glow: 'shadow-[0_0_12px_rgba(236,72,153,0.3)]' },
  HIRING: { bg: 'bg-cyan-500/15', border: 'border-cyan-500/40', text: 'text-cyan-300', glow: 'shadow-[0_0_12px_rgba(6,182,212,0.3)]' },
  DESIGN: { bg: 'bg-purple-500/15', border: 'border-purple-500/40', text: 'text-purple-300', glow: 'shadow-[0_0_12px_rgba(168,85,247,0.3)]' },
  ALL: { bg: 'bg-teal-500/15', border: 'border-teal-500/40', text: 'text-teal-300', glow: 'shadow-[0_0_12px_rgba(20,184,166,0.3)]' },
};

export const IndustryNewsTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [reactions, setReactions] = useState<Record<number, NewsItem['reactions']>>(() => {
    const init: Record<number, NewsItem['reactions']> = {};
    GLOBAL_NEWS_FEED.forEach(n => { init[n.id] = { ...n.reactions }; });
    return init;
  });

  const handleReact = (id: number, key: keyof NewsItem['reactions'], e: React.MouseEvent) => {
    e.stopPropagation();
    setReactions(prev => ({
      ...prev,
      [id]: { ...prev[id], [key]: prev[id][key] + 1 }
    }));
  };

  useEffect(() => {
    if (isPaused || isDrawerOpen) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % GLOBAL_NEWS_FEED.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, isDrawerOpen]);

  const currentNews = GLOBAL_NEWS_FEED[currentIndex];
  const catStyle = categoryStyles[currentNews.category] || categoryStyles.ALL;

  const categories = ['ALL', 'FABRICATION', 'INVESTMENT', 'ARCH', 'HIRING', 'DESIGN'];

  const filteredNews = activeCategory === 'ALL'
    ? GLOBAL_NEWS_FEED
    : GLOBAL_NEWS_FEED.filter(item => item.category === activeCategory);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 my-6">
        {/* Vibrant Gen-Z Gradient Border Envelope */}
        <div className="p-[2px] rounded-2xl bg-gradient-to-r from-pink-500 via-teal-400 to-amber-400 shadow-[0_0_30px_rgba(20,184,166,0.25)] transition-all duration-500 hover:shadow-[0_0_40px_rgba(236,72,153,0.35)]">
          <div className="bg-[#0B0E14] p-3 sm:p-4 rounded-[14px] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 overflow-hidden relative group">
            
            {/* Left Live Badge */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-pink-500/20 to-teal-500/20 border border-pink-500/40 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                <Radio className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                <span className="font-mono text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-teal-300 to-yellow-300 uppercase tracking-widest flex items-center gap-1">
                  🔥 LIVE TECH PULSE
                </span>
              </div>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isPaused ? "Resume news rotation" : "Pause news rotation"}
              >
                {isPaused ? <Play size={12} /> : <Pause size={12} />}
              </button>
            </div>

            {/* Center Animated News Item */}
            <div className="flex-1 w-full overflow-hidden cursor-pointer" onClick={() => setIsDrawerOpen(true)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentNews.id}
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 text-xs font-mono"
                >
                  <span className={`px-2.5 py-0.5 border text-[10px] font-black rounded-lg shrink-0 flex items-center gap-1 ${catStyle.bg} ${catStyle.border} ${catStyle.text} ${catStyle.glow}`}>
                    <span>{currentNews.emoji}</span>
                    <span>[{currentNews.source}]</span>
                  </span>

                  {currentNews.hotBadge && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-500/40 text-amber-300 font-bold text-[9px] rounded-md shrink-0 animate-pulse">
                      {currentNews.hotBadge}
                    </span>
                  )}

                  <span className="text-slate-100 font-bold truncate max-w-lg group-hover:text-pink-300 transition-colors">
                    {currentNews.headline}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Action Controls & Notification Bell */}
            <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
              <div className="flex items-center gap-1 hidden sm:flex">
                {GLOBAL_NEWS_FEED.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? 'bg-gradient-to-r from-pink-500 to-teal-400 w-5' : 'bg-slate-800 hover:bg-slate-600 w-1.5'
                    }`}
                    aria-label={`Jump to news ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-pink-500/20 via-teal-500/20 to-amber-500/20 hover:from-pink-500/30 hover:to-teal-500/30 border border-pink-500/50 text-white rounded-xl font-mono text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(236,72,153,0.25)] hover:scale-105"
              >
                <Sparkles size={13} className="text-amber-300 animate-spin" />
                <span>EXPLORE ALL ({GLOBAL_NEWS_FEED.length})</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Full Live News Telemetry Modal */}
      <AnimatePresence>
        {isDrawerOpen && (
          <AccessibleDialog
            onClose={() => setIsDrawerOpen(false)}
            labelledBy="news-drawer-title"
            description="Live semiconductor market intelligence and career telemetry feed."
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-3xl max-h-[85vh] bg-[#0A0D14] border-2 border-pink-500/30 rounded-3xl p-6 sm:p-8 text-white flex flex-col shadow-[0_0_80px_rgba(236,72,153,0.25)] overflow-hidden relative"
            >
              {/* Vibrant Decorative Corner Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-500/10 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

              {/* Modal Header */}
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6 relative z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br from-pink-500/20 to-teal-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                    <Newspaper size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 id="news-drawer-title" className="font-bold text-lg sm:text-xl text-slate-100 uppercase tracking-tight flex flex-wrap items-center gap-2">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-teal-300 to-amber-300">
                        Semiconductor Live Telemetry
                      </span>
                      <span className="text-[9px] font-mono bg-pink-500/20 text-pink-300 px-2.5 py-0.5 rounded-full border border-pink-500/40 font-black tracking-widest animate-pulse">
                        2026 EDITION
                      </span>
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      Verified fab announcements, hiring sprees, & break-through silicon drops
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 shrink-0 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-full bg-white/5 hover:bg-white/10"
                  aria-label="Close news telemetry"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none relative z-10">
                <Filter size={14} className="text-pink-400 shrink-0 mr-1" />
                {categories.map((cat) => {
                  const style = categoryStyles[cat] || categoryStyles.ALL;
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3.5 py-1.5 text-[11px] font-mono rounded-xl border transition-all shrink-0 cursor-pointer font-bold ${
                        isActive
                          ? `${style.bg} ${style.border} ${style.text} ${style.glow} scale-105`
                          : 'bg-white/[0.02] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* News Feed Items */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 relative z-10">
                {filteredNews.map((news) => {
                  const style = categoryStyles[news.category] || categoryStyles.ALL;
                  const currentReacts = reactions[news.id] || news.reactions;

                  return (
                    <div
                      key={news.id}
                      className="p-5 bg-white/[0.02] hover:bg-white/[0.04] border border-slate-800/80 hover:border-pink-500/40 rounded-2xl transition-all group relative overflow-hidden shadow-sm"
                    >
                      <div className="flex justify-between items-start gap-4 mb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-mono text-[10px] font-black px-2.5 py-0.5 border rounded-lg flex items-center gap-1 ${style.bg} ${style.border} ${style.text}`}>
                            <span>{news.emoji}</span>
                            <span>{news.source}</span>
                          </span>

                          {news.hotBadge && (
                            <span className="font-mono text-[9px] font-black px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-500/40 text-amber-300 rounded-md">
                              {news.hotBadge}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-slate-500 shrink-0">{news.time}</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-100 group-hover:text-pink-300 transition-colors mb-2">
                        {news.headline}
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        {news.detail}
                      </p>

                      {/* Interactive Reactions Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-[10px] font-mono">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleReact(news.id, 'flame', e)}
                            className="px-2.5 py-1 bg-white/[0.03] hover:bg-orange-500/20 border border-slate-800 hover:border-orange-500/40 rounded-lg text-slate-300 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                            title="Flame reaction"
                          >
                            <Flame size={12} className="text-orange-400" />
                            <span className="font-bold">{currentReacts.flame}</span>
                          </button>

                          <button
                            onClick={(e) => handleReact(news.id, 'zap', e)}
                            className="px-2.5 py-1 bg-white/[0.03] hover:bg-yellow-500/20 border border-slate-800 hover:border-yellow-500/40 rounded-lg text-slate-300 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                            title="Zap reaction"
                          >
                            <Zap size={12} className="text-yellow-400" />
                            <span className="font-bold">{currentReacts.zap}</span>
                          </button>

                          <button
                            onClick={(e) => handleReact(news.id, 'briefcase', e)}
                            className="px-2.5 py-1 bg-white/[0.03] hover:bg-cyan-500/20 border border-slate-800 hover:border-cyan-500/40 rounded-lg text-slate-300 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                            title="Applying reaction"
                          >
                            <Briefcase size={12} className="text-cyan-400" />
                            <span className="font-bold">{currentReacts.briefcase}</span>
                          </button>

                          <button
                            onClick={(e) => handleReact(news.id, 'rocket', e)}
                            className="px-2.5 py-1 bg-white/[0.03] hover:bg-pink-500/20 border border-slate-800 hover:border-pink-500/40 rounded-lg text-slate-300 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                            title="Rocket reaction"
                          >
                            <Rocket size={12} className="text-pink-400" />
                            <span className="font-bold">{currentReacts.rocket}</span>
                          </button>
                        </div>

                        {news.url && (
                          <a
                            href={news.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-pink-400 hover:text-teal-300 hover:underline font-bold uppercase tracking-wider"
                          >
                            Official Source <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2 justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-wider relative z-10">
                <span className="flex items-center gap-1 text-pink-400 font-bold">
                  <Sparkles size={11} /> BitForBytes Telemetry Engine
                </span>
                <span>{filteredNews.length} verified signals</span>
              </div>
            </motion.div>
          </AccessibleDialog>
        )}
      </AnimatePresence>
    </>
  );
};

