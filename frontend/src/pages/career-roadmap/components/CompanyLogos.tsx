import React from 'react';

interface CompanyLogoProps {
  companyId: string;
  className?: string;
  size?: number;
}

export const CompanyLogoSvg: React.FC<CompanyLogoProps> = ({ companyId, className = 'w-6 h-6', size }) => {
  const id = companyId.toLowerCase().replace(/[^a-z0-9]/g, '');

  const style = size ? { width: size, height: size } : undefined;

  switch (id) {
    case 'nvidia':
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M8.28 4.09c-.48.16-1.07.49-1.39.77-.35.32-.42.48-.42.98 0 .54.12.76.62 1.15.53.4 1.25.68 2.59 1.01 2.21.56 3.01.83 3.96 1.34 1.48.81 2.36 2.06 2.36 3.37 0 2.2-2.12 3.99-5.11 4.31-1.01.1-2.91.03-3.85-.14-1.78-.34-3.14-1.12-4.04-2.31-.38-.5-.52-.77-.52-1.01 0-.32.18-.62.48-.82.34-.23.63-.23 1.17 0 .61.26 1.54.83 2.14 1.32.96.79 2.03 1.15 3.36 1.15 1.7 0 2.82-.67 2.82-1.68 0-.61-.31-1.06-1.15-1.46-.57-.27-1.25-.49-2.58-.8-2.2-.52-3.12-.87-4.14-1.57-1.26-.87-1.92-2.02-1.92-3.35 0-2.11 1.95-3.86 4.79-4.3 1.05-.16 2.72-.08 3.65.17 1.47.38 2.65 1.07 3.47 2.02.4.47.45.62.45.89 0 .39-.24.75-.6.93-.24.12-.51.13-.88.02-.45-.14-1.25-.66-1.87-1.21-.92-.8-1.94-1.15-3.23-1.15-.99 0-1.72.18-2.19.47z" fill="#76B900"/>
        </svg>
      );

    case 'intel':
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.89 12.82c-.31.33-.77.5-1.37.5-.4 0-.74-.08-1.02-.23-.28-.15-.51-.37-.69-.65-.18-.28-.31-.62-.39-1.02h-.05c-.09.39-.24.72-.45 1.01-.21.29-.48.51-.81.67-.33.16-.72.24-1.17.24-.61 0-1.11-.18-1.49-.54-.38-.36-.57-.86-.57-1.5 0-.7.23-1.23.68-1.59.46-.36 1.09-.54 1.9-.54h1.76v-.32c0-.44-.12-.76-.36-.96-.24-.2-.59-.3-.1.05-.3 0-.58.07-.84.21-.26.14-.49.33-.69.57l-.88-.74c.31-.38.7-.67 1.18-.88.48-.21 1.03-.32 1.65-.32.95 0 1.66.24 2.13.72.47.48.7 1.18.7 2.1v3.29c0 .45.07.78.21.99.14.21.36.31.66.31.2 0 .4-.05.6-.15v.85c-.25.13-.57.2-.95.2zM10.8 12.3h-1.54c-.45 0-.8.09-1.04.28-.24.19-.36.46-.36.81 0 .31.09.55.28.71.19.16.45.24.78.24.36 0 .66-.08.9-.24.24-.16.42-.38.54-.66.12-.28.18-.6.18-.94v-.2z" fill="#0068B5"/>
        </svg>
      );

    case 'qualcomm':
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm1 14.5h-2v-5h2v5zm0-7h-2v-2h2v2z" fill="#3253DC"/>
        </svg>
      );

    case 'amd':
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M4.5 4.5h7.5V7H7v5h5v2.5H4.5V4.5zm10.5 0h4.5v10.5H15V7h-2.5V4.5H15zm0 7.5h4.5V15H15v-3z" fill="#ED1C24"/>
        </svg>
      );

    case 'apple':
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.64 1.35-.58.67-1.08 1.74-.95 2.78 1.01.08 2.05-.53 2.67-1.28z" fill="#A2AAAD"/>
        </svg>
      );

    case 'google':
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.545 6.477 2.545 12s4.476 10 10 10c5.77 0 9.574-4.058 9.574-9.749 0-.655-.069-1.31-.173-1.956h-9.394z" fill="#4285F4"/>
        </svg>
      );

    case 'texasinstruments':
    case 'texas-instruments':
    case 'ti':
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M3 3h18v4H3V3zm0 7h18v4H3v-4zm0 7h18v4H3v-4z" fill="#CC0000"/>
        </svg>
      );

    case 'tsmc':
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8L19.2 8 12 11.2 4.8 8 12 4.8zM4 9.6l7 3.5v7.1l-7-3.5V9.6zm16 7.1l-7 3.5v-7.1l7-3.5v7.1z" fill="#E21B23"/>
        </svg>
      );

    case 'arm':
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M3 6h18v12H3V6zm3 3v6h3V9H6zm4 0v6h3v-2.5h1.5V11.5H13V9h-3zm6 0v6h3v-6h-3z" fill="#0091BD"/>
        </svg>
      );

    case 'synopsys':
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2V7h2v10z" fill="#60269E"/>
        </svg>
      );

    case 'cadence':
    case 'cadencedesignsystems':
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M4 4h16v4H4V4zm0 6h16v4H4v-4zm0 6h16v4H4v-4z" fill="#FF6600"/>
        </svg>
      );

    case 'samsung':
    case 'samsungsemi':
    case 'samsungsemiconductor':
    case 'samsungelectronics':
      return (
        <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
          <path d="M2 12c0 3.31 4.48 6 10 6s10-2.69 10-6-4.48-6-10-6S2 8.69 2 12zm10-4c3.87 0 7 1.79 7 4s-3.13 4-7 4-7-1.79-7-4 3.13-4 7-4z" fill="#1428A0"/>
        </svg>
      );

    default: {
      const words = companyId.trim().split(/[\s_-]+/);
      const initials = words.length > 1 
        ? (words[0][0] + words[1][0]).toUpperCase()
        : companyId.slice(0, 2).toUpperCase();
      return (
        <div className={`rounded bg-plasma-cyan/20 border border-plasma-cyan/40 text-plasma-cyan flex items-center justify-center font-mono font-bold text-[10px] ${className}`}>
          {initials}
        </div>
      );
    }
  }
};
