import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  description: string;
  title?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  description,
  title,
  side = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; side: string }>({ top: 0, left: 0, side });

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 280; // approximate width of tooltip box in px
    const tooltipHeight = 110; // approximate height in px

    let top = 0;
    let left = 0;
    let actualSide = side;

    // Determine smart positioning based on preferred side and viewport boundaries
    if (side === 'top' || (rect.top - tooltipHeight < 10 && rect.bottom + tooltipHeight < window.innerHeight)) {
      if (rect.top - tooltipHeight < 10) {
        actualSide = 'bottom';
      }
    }

    switch (actualSide) {
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - 8;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + 8;
        break;
      case 'top':
      default:
        top = rect.top - tooltipHeight - 8;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
    }

    // Viewport overflow clamp
    left = Math.max(12, Math.min(left, window.innerWidth - tooltipWidth - 12));
    top = Math.max(12, Math.min(top, window.innerHeight - tooltipHeight - 12));

    setCoords({ top, left, side: actualSide });
  };

  const handleMouseEnter = () => {
    updatePosition();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    updatePosition();
    setIsVisible(prev => !prev);
  };

  useEffect(() => {
    if (!isVisible) return;
    const handleScrollOrResize = () => updatePosition();
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isVisible]);

  return (
    <div className={`inline-flex items-center ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className="p-1 rounded-full text-text-dim hover:text-accent-orange hover:bg-orange-500/15 transition-all focus:outline-none focus:ring-2 focus:ring-accent-orange/60 cursor-pointer shrink-0"
        aria-label={title ? `Information about ${title}` : 'Feature information'}
      >
        <Info size={15} className="pointer-events-none" />
      </button>

      {isVisible &&
        ReactDOM.createPortal(
          <div
            style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
            className="fixed z-[99999] w-[280px] p-3.5 rounded-xl bg-[#0b0f19] border border-orange-500/50 shadow-[0_16px_40px_rgba(0,0,0,0.9)] text-left animate-in fade-in zoom-in-95 duration-150 pointer-events-none"
          >
            {title && (
              <div className="font-bold text-accent-orange text-xs tracking-wider uppercase mb-1.5 flex items-center gap-1.5 border-b border-border-soft/60 pb-1">
                <Info size={13} className="shrink-0 text-accent-orange" />
                <span className="leading-tight">{title}</span>
              </div>
            )}
            <p className="text-xs text-slate-200 leading-relaxed font-normal normal-case">
              {description}
            </p>
          </div>,
          document.body
        )}
    </div>
  );
};


