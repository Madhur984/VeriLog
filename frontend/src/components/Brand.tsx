import React from 'react';
import { Link } from 'react-router-dom';

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

/**
 * Clickable logo for the logged-in app shell — always links to /portal.
 * Icon-only below the `sm` breakpoint (no room for the wordmark on mobile);
 * icon + text once there's space. For pre-login pages (landing/auth), where
 * a logo conventionally goes home rather than to a logged-in dashboard,
 * use BrandWordmark instead.
 */
export const BrandPortalLink: React.FC<{
  size?: number;
  className?: string;
  textClassName?: string;
  /** Color of the middle "for" — override to match a page's existing accent. */
  midColor?: string;
  /** ALL-CAPS "BITFORBYTES" (nav/header default) vs mixed-case "BitForBytes". */
  uppercase?: boolean;
}> = ({ size = 26, className = '', textClassName = 'text-text-main', midColor = BRAND_BLUE, uppercase = true }) => (
  <Link
    to="/portal"
    aria-label="BitForBytes — go to Portal"
    className={`inline-flex items-center gap-2 ${className}`}
  >
    <BrandMark size={size} />
    <span
      className={`hidden font-bold tracking-tight leading-none sm:inline ${uppercase ? 'uppercase' : ''} ${textClassName}`}
    >
      Bit<span style={{ color: midColor }}>{uppercase ? 'for' : 'For'}</span>Bytes
    </span>
  </Link>
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
