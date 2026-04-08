import React, { useState } from 'react';

interface VideoIntroProps {
  onComplete: () => void;
}

export const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete }) => {
  const [fading, setFading] = useState(false);

  const handleEnded = () => {
    setFading(true);
    setTimeout(onComplete, 550);
  };

  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        background: '#0E1116',
        opacity: fading ? 0 : 1,
        transition: 'opacity 550ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <video
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
          display: 'block',
          // Sharpness + color alignment with canvas
          filter: 'contrast(1.2) brightness(1.08) saturate(1.1) hue-rotate(-5deg)',
          transform: 'scale(1.02)',
        }}
      >
        <source src="/videos/tunnel.mp4" type="video/mp4" />
      </video>

      {/* Center depth highlight */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.05), transparent 62%)',
        }}
      />
      {/* Edge vignette */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle at center, transparent 40%, rgba(14,17,22,0.6) 100%)',
        }}
      />
    </div>
  );
};
