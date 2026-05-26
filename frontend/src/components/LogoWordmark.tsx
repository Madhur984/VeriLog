import React from 'react';

interface LogoWordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const LogoWordmark: React.FC<LogoWordmarkProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[18px]',
    md: 'text-2xl',
    lg: 'text-4xl',
    hero: 'text-[56px] md:text-[96px] leading-none'
  };

  return (
    <span className={`font-bold tracking-tight font-sans inline-block ${sizeClasses[size]}`}>
      <span style={{ color: '#F1F5F9' }}>Bit</span>
      <span style={{ color: '#475569', fontWeight: 400 }}>for</span>
      <span style={{ color: '#22D3EE' }}>Bytes</span>
    </span>
  );
};
