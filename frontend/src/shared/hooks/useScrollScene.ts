import { useEffect, useRef, useCallback } from 'react';

interface UseScrollSceneOptions {
  totalScenes: number;
  onSceneChange: (index: number) => void;
  threshold?: number;
}

export function useScrollScene({
  totalScenes,
  onSceneChange,
  threshold = 0.6,
}: UseScrollSceneOptions) {
  const containerRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setContainer = useCallback((el: HTMLElement | null) => {
    containerRef.current = el;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.sceneId ?? '0');
            onSceneChange(idx);
          }
        }
      },
      { root: container, threshold }
    );

    const scenes = container.querySelectorAll<HTMLElement>('[data-scene-id]');
    scenes.forEach(s => observerRef.current?.observe(s));

    return () => observerRef.current?.disconnect();
  }, [onSceneChange, threshold, totalScenes]);

  return { setContainer };
}
