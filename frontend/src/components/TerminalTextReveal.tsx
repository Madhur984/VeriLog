import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

const CHARS = '010101ABCDEF';

interface TerminalTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export const TerminalTextReveal = ({ text, className = '', delay = 0 }: TerminalTextRevealProps) => {
  const [displayText, setDisplayText] = useState('');
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  useEffect(() => {
    if (!isInView) return;

    let iteration = 0;
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      const interval = setInterval(() => {
        setDisplayText(() =>
          text
            .split('')
            .map((letter, index) => {
              if (index < iteration || letter === ' ') {
                return text[index];
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3;
      }, 30);
    };

    timeoutId = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isInView, text, delay]);

  return (
    <span ref={ref} className={className}>
      {displayText || text.replace(/./g, '0')}
    </span>
  );
};
