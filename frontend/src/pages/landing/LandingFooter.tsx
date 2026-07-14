import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LANDING_ROUTES } from './landingRoutes';
import {
  FaDiscord,
  FaEnvelope,
  FaTwitter,
  FaInstagram,
  FaRedditAlien,
  FaLinkedin,
} from 'react-icons/fa';

const socialItems = [
  { name: 'Discord', id: 'discord', url: LANDING_ROUTES.social.discord, icon: FaDiscord, color: '#5865F2', whisper: 'Hop into Discord – I’m there too! 🎙️' },
  { name: 'Email', id: 'email', url: LANDING_ROUTES.social.email, icon: FaEnvelope, color: '#EA4335', whisper: 'Drop us an inbox message! ✍️' },
  { name: 'X (Twitter)', id: 'twitter', url: LANDING_ROUTES.social.twitter, icon: FaTwitter, color: '#1DA1F2', whisper: 'See daily chips & logic insights! 🧠' },
  { name: 'Instagram', id: 'instagram', url: LANDING_ROUTES.social.instagram, icon: FaInstagram, color: '#E4405F', whisper: 'Sneak peeks & student reels! 🎬' },
  { name: 'Reddit', id: 'reddit', url: LANDING_ROUTES.social.reddit, icon: FaRedditAlien, color: '#FF4500', whisper: 'r/ECE discussions are always active! 🔥' },
  { name: 'LinkedIn', id: 'linkedin', url: LANDING_ROUTES.social.linkedin, icon: FaLinkedin, color: '#0A66C2', whisper: 'Connect with VLSI professionals! 🤝' },
];

const SECRET_SEQUENCE = ['discord', 'twitter', 'linkedin', 'email'];

export const LandingFooter = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const [sequence, setSequence] = useState<string[]>([]);
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);
  const sequenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSocialClick = (e: React.MouseEvent, social: typeof socialItems[0]) => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(40);
    }

    setAnnouncement(`Opening ${social.name} in a new tab`);

    if (social.id === 'email') {
      e.preventDefault();
      navigator.clipboard.writeText('info@bitforbytes.in');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }

    setSequence((prev) => {
      const next = [...prev, social.id];
      if (next.length > SECRET_SEQUENCE.length) {
        next.shift();
      }

      if (next.join(',') === SECRET_SEQUENCE.join(',')) {
        setBadgeUnlocked(true);
        if (window.navigator.vibrate) {
          window.navigator.vibrate([100, 50, 100]);
        }
        setTimeout(() => setBadgeUnlocked(false), 8000);
        return [];
      }
      return next;
    });

    if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);
    sequenceTimeoutRef.current = setTimeout(() => {
      setSequence([]);
    }, 8000);
  };

  useEffect(() => {
    return () => {
      if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);
    };
  }, []);

  return (
    <footer className="w-full relative" style={{ background: '#070B14', borderTop: '1px solid var(--border-soft)' }}>
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      <AnimatePresence>
        {badgeUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl border text-sm font-semibold shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              borderColor: '#22d3ee',
              color: '#fff',
              boxShadow: '0 10px 40px rgba(34, 211, 238, 0.35)',
            }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-955 text-[#22D3EE] font-extrabold text-xs">
              ⚡
            </div>
            <div>
              <p className="font-bold text-[#22D3EE]">Easter Egg Unlocked!</p>
              <p className="text-xs text-slate-400">Silicon Patron badge activated. VoltMonkey is proud! 🕷️</p>
            </div>
            <button
              onClick={() => setBadgeUnlocked(false)}
              className="ml-3 text-slate-400 hover:text-white text-xs bg-transparent border-none cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10">
          <div className="md:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="font-extrabold tracking-tight text-lg">
                <span style={{ color: '#F8FAFC' }}>Bit</span>
                <span style={{ color: '#64748B' }}>for</span>
                <span style={{ color: '#22D3EE' }}>Bytes</span>
              </span>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-dim)' }}>
                Signals become logic. Logic becomes systems. Free, browser-based VLSI &amp; digital
                design for every ECE student in India.
              </p>
            </div>

            <div className="space-y-4 relative">
              <div className="flex items-center justify-between max-w-xs">
                <h4 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>
                  Join the Community
                </h4>

                <AnimatePresence>
                  {hoveredIdx !== null && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 5 }}
                      className="absolute bottom-12 left-0 w-64 p-3 rounded-xl border text-xs leading-snug z-50 shadow-lg"
                      style={{
                        background: 'rgba(15,23,42,0.96)',
                        borderColor: 'rgba(34,211,238,0.25)',
                        color: 'var(--text-main)',
                      }}
                    >
                      <div className="font-bold mb-1 text-[10px] uppercase tracking-wider text-cyan-500">
                        VoltMonkey says:
                      </div>
                      <div>
                        {socialItems[hoveredIdx].id === 'email' && copied
                          ? 'Copied email to clipboard! 📋'
                          : socialItems[hoveredIdx].whisper}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08 }
                  }
                }}
                className="flex flex-wrap gap-3"
              >
                {socialItems.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleSocialClick(e, social)}
                    onMouseEnter={(e) => {
                      setHoveredIdx(index);
                      setAnnouncement(`Hovered ${social.name}`);
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.borderColor = social.color;
                      e.currentTarget.style.color = social.color;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 4px 14px ${social.color}25`;
                    }}
                    onMouseLeave={(e) => {
                      setHoveredIdx(null);
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = 'var(--text-sub)';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: { opacity: 1, y: 0 }
                    }}
                    className="group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: 'var(--text-sub)',
                    }}
                    aria-label={social.name}
                  >
                    <span
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${social.color}33, transparent)`,
                        transform: hoveredIdx === index ? 'translateX(100%)' : 'translateX(-100%)',
                        transition: hoveredIdx === index ? 'transform 0.5s ease-in-out' : 'none',
                        zIndex: 0,
                      }}
                    />
                    <social.icon className="w-4.5 h-4.5 relative z-10" />
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>Navigation</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              {[
                { label: 'Start learning', to: LANDING_ROUTES.firstModule },
                { label: 'Explore career paths', to: LANDING_ROUTES.career },
                { label: 'Assess skill gaps', to: LANDING_ROUTES.careerSkills },
              ].map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="transition-colors"
                  style={{ color: 'var(--text-sub)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-sub)')}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>Platform</h4>
            <div className="space-y-1.5 text-sm" style={{ color: 'var(--text-sub)' }}>
              <p>Built by ECE students in India.</p>
              <p>Aligned to India Semiconductor Mission 2.0.</p>
              <p>Modules live, more building.</p>
              <a
                href={LANDING_ROUTES.github}
                target="_blank"
                rel="noreferrer"
                className="inline-block pt-1 text-[13px] font-bold transition-colors"
                style={{ color: '#22D3EE' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#BAE6FD')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#22D3EE')}
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px]" style={{ borderTop: '1px solid var(--border-soft)', color: 'var(--text-dim)' }}>
          <span>© {new Date().getFullYear()} BitforBytes. Free for students.</span>
          <span>Made with intent, not investment.</span>
        </div>
      </div>
    </footer>
  );
};
