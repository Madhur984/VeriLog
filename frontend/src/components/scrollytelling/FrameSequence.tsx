import React, { useRef, useEffect, useState, useMemo } from 'react';
import { MotionValue, useMotionValueEvent } from 'framer-motion';

interface FrameSequenceProps {
    progress: MotionValue<number>;
    frameCount?: number;
}

export const FrameSequence: React.FC<FrameSequenceProps> = ({ 
    progress, 
    frameCount = 234 
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(0);

    // Generate array of image paths
    const framePaths = useMemo(() => {
        return Array.from({ length: frameCount }, (_, i) => {
            const frameNumber = (i + 1).toString().padStart(3, '0');
            return `/images/hero-sequence/ezgif-frame-${frameNumber}.jpg`;
        });
    }, [frameCount]);

    // Preload images
    useEffect(() => {
        let loadedCount = 0;
        const total = framePaths.length;

        framePaths.forEach((path, index) => {
            const img = new Image();
            img.src = path;
            img.onload = () => {
                imagesRef.current[index] = img;
                loadedCount++;
                if (loadedCount % 10 === 0 || loadedCount === total) {
                    setImagesLoaded(loadedCount);
                }
            };
        });
    }, [framePaths]);

    // Render helper function
    const renderFrame = (value: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        // Map scroll progress to frame index (0..233)
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(value * frameCount)
        );

        const img = imagesRef.current[frameIndex];
        if (img) {
            const w = canvas.width;
            const h = canvas.height;
            const iw = img.width;
            const ih = img.height;
            
            // "Cover" scaling logic
            const r = Math.max(w / iw, h / ih);
            const nw = iw * r;
            const nh = ih * r;
            const cx = (w - nw) / 2;
            const cy = (h - nh) / 2;

            context.clearRect(0, 0, w, h);
            
            // 8K HIGH-SHARPNESS PASS: Pure unsoftened contrast to accentuate edges
            context.globalCompositeOperation = 'source-over';
            context.filter = 'contrast(1.6) saturate(1.4) brightness(1.2)';
            context.drawImage(img, cx, cy, nw, nh);
            
            // Reset context State
            context.filter = 'none';
        }
    };

    // Use event for performance (no re-renders)
    useMotionValueEvent(progress, "change", (latest) => {
        renderFrame(latest);
    });

    // Initial render / After loading render
    useEffect(() => {
        renderFrame(progress.get());
    }, [imagesLoaded, frameCount]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                
                // FORCE 8K EXTREME SHARPNESS: Multiply pixel density drastically
                const baseDpr = window.devicePixelRatio || 1;
                const superSampleDpr = Math.max(baseDpr, 4.0); // 4x density forces 8K processing mapped to physical pixels
                
                // Set actual internal canvas resolution
                canvas.width = window.innerWidth * superSampleDpr;
                canvas.height = window.innerHeight * superSampleDpr;
                
                // Set CSS dimensions to window size
                canvas.style.width = `${window.innerWidth}px`;
                canvas.style.height = `${window.innerHeight}px`;

                // Re-render current frame after resize
                renderFrame(progress.get());
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [progress, imagesLoaded]); // Include dependencies to ensure renderFrame is fresh

    return (
        <div className="absolute inset-0 w-full h-full bg-[#050505]">
            <canvas 
                ref={canvasRef}
                className="w-full h-full pointer-events-none"
            />
        </div>
    );
};
