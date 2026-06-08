import React from 'react';

/**
 * Brand assets — single source of truth for the BitForBytes logo + wordmark.
 * The mark lives at /public/logo.svg (also the favicon). Use BrandWordmark in
 * nav/headers and BrandMark anywhere a compact icon is needed.
 */

export const BRAND_BLUE = '#4A57FF';

export const BrandMark: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <img
    src="/logo.png"
    width={size}
    height={size}
    alt="BitForBytes"
    draggable={false}
    className={`select-none ${className}`}
  />
);

export const BrandWordmark: React.FC<{
  size?: number;
  className?: string;
  textClassName?: string;
}> = ({ size = 28, className = '', textClassName = 'text-white' }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <BrandMark size={size} />
    <span className={`font-bold tracking-tight uppercase leading-none ${textClassName}`}>
      Bit<span style={{ color: BRAND_BLUE }}>for</span>Bytes
    </span>
  </span>
);
