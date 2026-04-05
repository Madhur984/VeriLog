import { motion, useScroll, useTransform } from 'framer-motion';

export const ScrollIndicator = () => {
    const { scrollYProgress } = useScroll();
    
    // Fade out completely by 10% scroll progress
    const opacity = useTransform(scrollYProgress, [0, 0.05, 0.1], [1, 1, 0]);
    const yTransform = useTransform(scrollYProgress, [0, 0.1], [0, 20]);

    return (
        <motion.div 
            style={{ opacity, y: yTransform }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
        >
            <motion.span 
                className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40 font-bold"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                Scroll to Explore
            </motion.span>
            
            {/* Minimal Animated Line */}
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent relative overflow-hidden">
                <motion.div 
                    className="absolute top-0 left-0 w-full h-1/3 bg-white/80"
                    animate={{ 
                        top: ["0%", "100%"],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                />
            </div>
        </motion.div>
    );
};
