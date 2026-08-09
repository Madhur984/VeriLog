import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Radio, ExternalLink, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';

export interface NewsItem {
  id: number;
  source: string;
  category: 'FABRICATION' | 'INVESTMENT' | 'ARCH' | 'DESIGN';
  headline: string;
  detail: string;
  time: string;
  url?: string;
}

export const GLOBAL_NEWS_FEED: NewsItem[] = [
  {
    id: 1,
    source: 'TSMC Taiwan',
    category: 'FABRICATION',
    headline: 'TSMC Begins Volume Production on 2nm (N2) Nanosheet GAA Node',
    detail: 'Hsinchu and Kaohsiung fabs reach 80%+ yield on 2nm GAAFET silicon wafers powering 2026 mobile & AI chips.',
    time: 'LIVE · 12m ago'
  },
  {
    id: 2,
    source: 'India Semi Mission',
    category: 'INVESTMENT',
    headline: 'India Approves $10 Billion ISM Phase-2 for 3 New Fab & Assembly Units',
    detail: 'Tata Electronics Dholera Fab and Micron Sanand ATMP expanding hiring for 15,000+ VLSI & Process Engineers.',
    time: 'LIVE · 45m ago'
  },
  {
    id: 3,
    source: 'NVIDIA Hardware',
    category: 'ARCH',
    headline: 'NVIDIA Blackwell B200 Ramps Production with 192GB HBM3e Memory',
    detail: 'Dual-die NVLink interconnect delivers 20 PFLOPS FP4 inference speed for trillion-parameter AI models.',
    time: 'LIVE · 2h ago'
  },
  {
    id: 4,
    source: 'Intel Foundry',
    category: 'FABRICATION',
    headline: 'Intel 18A Node Achieves PowerVia Back-Side Power Delivery Milestone',
    detail: 'RibbonFET transistors reduce IR drop by 15% and increase routing density for 2026 client & server CPUs.',
    time: 'LIVE · 4h ago'
  },
  {
    id: 5,
    source: 'ASML Veldhoven',
    category: 'DESIGN',
    headline: 'ASML Ships Twinscan EXE:5000 High-NA EUV (0.55 NA) Lithography Scanner',
    detail: 'Next-generation 8nm resolution optics enable single-exposure printing for sub-2nm chip geometries.',
    time: 'LIVE · 6h ago'
  }
];

export const IndustryNewsTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % GLOBAL_NEWS_FEED.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentNews = GLOBAL_NEWS_FEED[currentIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 my-4">
      <div className="bg-matte-obsidian/90 border border-plasma-cyan/30 p-3 sm:p-4 shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-3 overflow-hidden">
        
        {/* Left Badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-plasma-cyan/15 border border-plasma-cyan/40">
            <Radio className="w-3.5 h-3.5 text-plasma-cyan animate-pulse" />
            <span className="font-mono text-[10px] font-bold text-plasma-cyan uppercase tracking-widest">
              GLOBAL SEMI NEWS
            </span>
          </div>
          <span className="font-mono text-[10px] text-text-dim uppercase hidden sm:inline">
            REAL-TIME TELEMETRY FEED
          </span>
        </div>

        {/* Center Animated News Item */}
        <div className="flex-1 w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentNews.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs font-mono"
            >
              <span className="px-2 py-0.5 bg-bg-base border border-ghost-trace text-plasma-cyan text-[10px] font-bold shrink-0">
                [{currentNews.source}]
              </span>

              <span className="text-text-main font-bold truncate max-w-xl">
                {currentNews.headline}
              </span>

              <span className="text-text-dim text-[10px] hidden lg:inline truncate">
                — {currentNews.detail}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Stepper Dots */}
        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
          {GLOBAL_NEWS_FEED.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? 'bg-plasma-cyan w-5' : 'bg-ghost-trace hover:bg-text-dim'
              }`}
              aria-label={`Jump to news ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
