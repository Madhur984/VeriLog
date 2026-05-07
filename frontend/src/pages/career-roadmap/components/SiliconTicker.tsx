import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { tickerData, categoryStyles } from '../data/ticker';

export const SiliconTicker: React.FC = () => {
  const tickerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tickerRef.current || !contentRef.current) return;

    const contentWidth = contentRef.current.offsetWidth;
    
    // Smooth infinite scroll animation
    const tl = gsap.to(contentRef.current, {
      x: -contentWidth / 2,
      duration: 50,
      ease: "none",
      repeat: -1,
    });

    const handleMouseEnter = () => tl.pause();
    const handleMouseLeave = () => tl.play();

    tickerRef.current.addEventListener('mouseenter', handleMouseEnter);
    tickerRef.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      tl.kill();
      tickerRef.current?.removeEventListener('mouseenter', handleMouseEnter);
      tickerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Double the items for seamless looping
  const items = [...tickerData, ...tickerData];

  return (
    <div 
      ref={tickerRef}
      className="w-full bg-matte-obsidian border-b border-ghost-trace h-10 overflow-hidden flex items-center select-none"
    >
      <div className="flex items-center h-full px-4 border-r border-ghost-trace bg-solder-mask z-10">
        <span className="text-[10px] font-mono text-plasma-cyan uppercase tracking-widest whitespace-nowrap">
          Silicon Intel // Live
        </span>
      </div>
      
      <div ref={contentRef} className="flex whitespace-nowrap will-change-transform">
        {items.map((item, i) => {
          const style = categoryStyles[item.cat];
          return (
            <div key={i} className="flex items-center px-8 border-r border-ghost-trace/30">
              <span 
                className="px-1.5 py-0.5 text-[9px] font-mono rounded mr-3 leading-none"
                style={{ backgroundColor: style.bg, color: style.text }}
              >
                {item.cat}
              </span>
              <span className="text-xs font-mono text-text-sub tracking-tight">
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
