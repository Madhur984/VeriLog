import { useRef } from 'react';

export const useMagneticButton = (strength = 0.3) => {
  const ref = useRef<HTMLButtonElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * strength;
    const y = (e.clientY - top - height / 2) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  
  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0,0)';
    ref.current.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
  };
  
  return { ref, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave };
};
