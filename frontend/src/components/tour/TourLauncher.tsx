import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass } from 'lucide-react';
import { useTour } from './TourProvider';

/**
 * Floating beacon (bottom-right) that replays the current page's tour.
 * Hidden while a tour is running. Only shown on routes that have a tour.
 */
export const TourLauncher: React.FC = () => {
  const { hasTourForPath, isActive, start } = useTour();

  const show = hasTourForPath && !isActive;

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={start}
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 380, damping: 24 }}
          aria-label="Replay page tour"
          title="Take the tour"
          className="fixed bottom-5 right-5 z-[120] flex items-center justify-center w-12 h-12 rounded-full text-black"
          style={{
            background: 'linear-gradient(135deg, #22D3EE, #3B82F6)',
            boxShadow: '0 10px 30px rgba(34,211,238,0.45), 0 0 0 1px rgba(255,255,255,0.1)',
          }}
        >
          {/* pulsing halo */}
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid rgba(34,211,238,0.6)' }}
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
          <Compass className="w-5 h-5 relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
