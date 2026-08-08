// src/components/LogoWordmark.tsx
interface LogoWordmarkProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero'
  className?: string
}

const SIZE_MAP = {
  xs:   { fontSize: '14px', letterSpacing: '-0.02em' },
  sm:   { fontSize: '18px', letterSpacing: '-0.025em' },
  md:   { fontSize: '24px', letterSpacing: '-0.03em' },
  lg:   { fontSize: '36px', letterSpacing: '-0.035em' },
  hero: { fontSize: 'clamp(56px, 9vw, 96px)', letterSpacing: '-0.04em' },
}

export const LogoWordmark = ({
  size = 'md',
  className = ''
}: LogoWordmarkProps) => {
  const style = SIZE_MAP[size]
  return (
    <span
      className={`font-bold select-none ${className}`}
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        lineHeight: 1,
        ...style,
      }}
      aria-label="BitForBytes"
    >
      <span style={{ color: '#F1F5F9' }}>Bit</span>
      <span style={{ color: '#475569', fontWeight: 400 }}>for</span>
      <span style={{ color: '#22D3EE' }}>Bytes</span>
    </span>
  )
}
