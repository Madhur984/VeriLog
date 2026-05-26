
import { BadgeDefinition } from '../data/badgeDefinitions';

const generateDeterministicHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).toUpperCase().slice(0, 6);
};

export const generateBadgeSVG = (badge: BadgeDefinition, userId: string): string => {
  const serial = `${badge.serialPrefix}-${generateDeterministicHash(userId + badge.id)}`;
  const tierColors = {
    BRONZE: { primary: '#CD7F32', secondary: '#8B5E3C', glow: 'rgba(205,127,50,0.25)' },
    SILVER: { primary: '#C0C0C0', secondary: '#808080', glow: 'rgba(192,192,192,0.25)' },
    GOLD:   { primary: '#FFD700', secondary: '#B8860B', glow: 'rgba(255,215,0,0.25)' },
    UTILITY:{ primary: '#22D3EE', secondary: '#0891B2', glow: 'rgba(34,211,238,0.25)' },
  };
  const colors = tierColors[badge.tier];
  
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <filter id="glow-${badge.id}">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  
  <rect width="300" height="300" fill="#07080A"/>
  
  <polygon
    points="60,15 240,15 285,60 285,240 240,285 60,285 15,240 15,60"
    fill="none" stroke="${colors.primary}" stroke-width="1.5" opacity="0.8"
  />
  
  <rect x="40" y="40" width="220" height="220" fill="none"
        stroke="${colors.primary}" stroke-width="0.5" opacity="0.2"/>
  
  <line x1="150" y1="15" x2="150" y2="60" stroke="${colors.primary}" stroke-width="1" opacity="0.4"/>
  <line x1="15" y1="150" x2="60" y2="150" stroke="${colors.primary}" stroke-width="1" opacity="0.4"/>
  <line x1="150" y1="285" x2="150" y2="240" stroke="${colors.primary}" stroke-width="1" opacity="0.4"/>
  <line x1="285" y1="150" x2="240" y2="150" stroke="${colors.primary}" stroke-width="1" opacity="0.4"/>
  
  <rect x="80" y="100" width="140" height="100" rx="4"
        fill="${colors.glow}" stroke="${colors.primary}" stroke-width="1"/>
  
  <text x="150" y="138" text-anchor="middle" font-family="monospace"
        font-size="13" font-weight="700" fill="${colors.primary}" letter-spacing="2">
    ${badge.name}
  </text>
  
  <text x="150" y="155" text-anchor="middle" font-family="monospace"
        font-size="8" fill="${colors.primary}" opacity="0.7" letter-spacing="1">
    ${badge.subtitle}
  </text>
  
  <text x="150" y="265" text-anchor="middle" font-family="monospace"
        font-size="8" fill="${colors.primary}" opacity="0.5" letter-spacing="1">
    ${serial}
  </text>
  
  <text x="150" y="278" text-anchor="middle" font-family="monospace"
        font-size="7" fill="${colors.primary}" opacity="0.3" letter-spacing="3">
    BitforBytes VERIFIED
  </text>
</svg>`;
};

export const downloadBadge = (svgString: string, fileName: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 600; canvas.height = 600;
  const ctx = canvas.getContext('2d')!;
  const img = new Image();
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  img.onload = () => {
    ctx.drawImage(img, 0, 0, 600, 600);
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    URL.revokeObjectURL(url);
  };
  img.src = url;
};
