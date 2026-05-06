import React from 'react';
import { motion } from 'framer-motion';
import { useSectionReveal } from '../hooks/useSectionReveal';

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  threshold?: number;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
};

const containerVariants = {
  hidden: {},
  visible: { 
    transition: { 
      staggerChildren: 0.1, 
      delayChildren: 0.2 
    } 
  }
};

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ 
  children, 
  id, 
  className = "", 
  threshold = 0.15 
}) => {
  const { ref, isInView } = useSectionReveal(threshold);

  return (
    <section
      id={id}
      ref={ref}
      className={`relative min-h-[80vh] py-24 px-6 ${className}`}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div variants={sectionVariants}>
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
};
