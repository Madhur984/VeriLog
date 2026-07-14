import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const toBinary = (str: string) =>
  str.split('').map(c =>
    c.charCodeAt(0).toString(2).padStart(8, '0')
  ).join(' ');

const BINARY_TEXT = toBinary('BitForBytes') + ' | ' + toBinary('BitForBytes');

export const BinaryStrip = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const totalWidth = trackRef.current.scrollWidth / 2;

    const tween = gsap.to(trackRef.current, {
      x: -totalWidth,
      duration: 30,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div
      className="overflow-hidden flex items-center w-full"
      style={{
        height: '36px',
        background: 'rgba(34,211,238,0.03)',
        borderTop: '1px solid rgba(34,211,238,0.07)',
        borderBottom: '1px solid rgba(34,211,238,0.07)',
      }}
    >
      <div ref={trackRef} className="flex items-center gap-0 whitespace-nowrap">
        {[BINARY_TEXT, BINARY_TEXT, BINARY_TEXT].map((text, i) => (
          <span
            key={i}
            className="font-mono text-[10px] pr-8"
            style={{ color: 'rgba(34,211,238,0.35)', letterSpacing: '0.1em' }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};
