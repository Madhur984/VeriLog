import React from 'react';
import { motion } from 'framer-motion';

interface ExpressionDisplayProps {
  expression: string; // e.g. "A'B + AB' + ABC"
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  highlightTermIndex?: number;
}

function parseTerms(expression: string): string[] {
  // Split on bare " + " not inside parens
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (let i = 0; i < expression.length; i++) {
    const ch = expression[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (depth === 0 && ch === '+' && expression[i - 1] === ' ' && expression[i + 1] === ' ') {
      parts.push(current.trim());
      current = '';
      i++; // skip trailing space
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function renderTerm(term: string, color: string): React.ReactNode {
  const chars: React.ReactNode[] = [];
  let i = 0;
  while (i < term.length) {
    const ch = term[i];
    if (term[i + 1] === "'") {
      chars.push(
        <span key={i} style={{ color: '#FFD580' }}>
          {ch}
          <sup style={{ fontSize: '0.7em', position: 'relative', top: '-0.3em' }}>′</sup>
        </span>
      );
      i += 2;
    } else if (ch === '·') {
      chars.push(<span key={i} style={{ color: '#7A7A8C', margin: '0 2px' }}>·</span>);
      i++;
    } else if (ch === '+') {
      chars.push(<span key={i} style={{ color, margin: '0 4px', fontSize: '1.1em' }}>+</span>);
      i++;
    } else {
      chars.push(<span key={i} style={{ color: '#A0FFA0' }}>{ch}</span>);
      i++;
    }
  }
  return <>{chars}</>;
}

const sizeMap = {
  sm: '1rem',
  md: '1.2rem',
  lg: '1.5rem',
};

const ExpressionDisplay: React.FC<ExpressionDisplayProps> = ({
  expression,
  accentColor = '#A855F7',
  size = 'md',
  label,
  highlightTermIndex,
}) => {
  const body = expression.replace(/^F\s*=\s*/, '');
  const terms = parseTerms(body);

  return (
    <div
      className="rounded-lg"
      style={{
        padding: '16px 24px',
        background: '#06060A',
        border: '1px solid #00D4FF44',
      }}
      role="region"
      aria-label={label ?? 'Boolean expression'}
    >
      {label && (
        <div
          className="text-[10px] font-mono mb-2 uppercase tracking-[0.1em]"
          style={{ color: accentColor }}
        >
          {label}
        </div>
      )}
      <div
        className="font-mono flex flex-wrap items-center gap-1"
        style={{ fontSize: sizeMap[size], fontFamily: 'IBM Plex Mono, monospace' }}
      >
        <span style={{ color: '#7A7A8C', marginRight: 8 }}>F =</span>
        {terms.map((term, ti) => (
          <React.Fragment key={ti}>
            {ti > 0 && (
              <span style={{ color: accentColor, margin: '0 4px', fontSize: '1.1em' }}>+</span>
            )}
            <motion.span
              initial={false}
              animate={{
                background:
                  highlightTermIndex === ti
                    ? `rgba(${parseInt(accentColor.slice(1,3),16)},${parseInt(accentColor.slice(3,5),16)},${parseInt(accentColor.slice(5,7),16)},0.18)`
                    : 'transparent',
              }}
              transition={{ duration: 0.2 }}
              className="px-1 rounded cursor-default"
              style={{
                border: highlightTermIndex === ti ? `1px solid ${accentColor}66` : '1px solid transparent',
                borderRadius: 4,
                padding: '2px 6px',
              }}
            >
              {renderTerm(term, accentColor)}
            </motion.span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ExpressionDisplay;
