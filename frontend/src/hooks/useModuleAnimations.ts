import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useModuleAnimations = (activeScreenId: string) => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Batch entrance animations for performance
    ScrollTrigger.batch(".screen-content", {
      onEnter: (elements) => {
        gsap.from(elements, {
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          overwrite: true
        });
      },
      start: "top 80%",
    });

    // Screen specific animations
    if (activeScreenId === 'signal_feel') {
      gsap.to(".wave-emitter", {
        scale: 1.1,
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut"
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [activeScreenId]);

  const playInteraction = (target: string) => {
    gsap.to(target, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
  };

  return { playInteraction };
};

export default useModuleAnimations;
