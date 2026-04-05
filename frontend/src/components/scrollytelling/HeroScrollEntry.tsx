import { motion, useScroll, useTransform } from 'framer-motion';

export interface HeroScrollEntryProps {
    title: string;
    subtitle: string;
}

export const HeroScrollEntry = ({ title, subtitle }: HeroScrollEntryProps) => {
    const { scrollYProgress } = useScroll();

    // Map scroll progress (0–10%) to opacity and vertical movement
    // Opacity: [0, 0.05, 0.1] -> [1, 1, 0]
    // y: [0, 0.1] -> [0, -40]
    const opacity = useTransform(scrollYProgress, [0, 0.05, 0.13], [1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.13], [0, -40]);

    return (
        <section className="relative h-[100vh] w-full flex items-center justify-center bg-transparent z-10 overflow-hidden">
            <motion.div 
                style={{ opacity, y }}
                className="relative z-10 flex flex-col items-center gap-6 px-6 text-center"
            >
                {/* Primary Heading */}
                <h1 className="font-sans font-black text-7xl md:text-9xl text-white/90 tracking-tighter uppercase leading-none">
                    {title}
                </h1>
                
                {/* Subtitle / Emotional Hook */}
                <p className="font-sans text-xl md:text-2xl text-white/60 max-w-xl leading-relaxed font-medium">
                    {subtitle}
                </p>
            </motion.div>

            {/* Void Overlay - Ensuring absolute blackness underneath */}
            <div className="absolute inset-0 bg-[#050505] pointer-events-none -z-10" />
        </section>
    );
};
