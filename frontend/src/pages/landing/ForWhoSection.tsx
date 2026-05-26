import { motion } from 'framer-motion';

const COMPACT_USER_TYPES = [
  {
    label: "THE CONFUSED FIRST-YEAR",
    color: "#22D3EE",
    opening: "You got ECE because CS cutoffs were too high.",
    cta: "EXPLORE DOMAINS →",
    ctaLink: "/career-roadmap",
  },
  {
    label: "THE STUCK THIRD-YEAR",
    color: "#F59E0B",
    opening: "Your CS friends have internships. You have derivations.",
    cta: "SEE YOUR SKILL GAPS →",
    ctaLink: "/career-roadmap?tab=radar",
  },
  {
    label: "THE DETERMINED ONE",
    color: "#10B981",
    opening: "You actually want to design chips.",
    cta: "START LEARNING →",
    ctaLink: "/portal",
  },
];

export const ForWhoSection = () => {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full select-none">
      <div className="space-y-16">
        {/* Section Header */}
        <div className="space-y-4 text-center">
          <span
            className="text-[10px] font-mono tracking-widest uppercase block"
            style={{ color: '#475569' }}
          >
            FOR WHO IS THIS
          </span>
          <h2
            className="font-bold tracking-tight uppercase font-sans text-white"
            style={{ fontSize: 'clamp(32px, 5vw, 44px)' }}
          >
            You'll know this is for you.
          </h2>
        </div>

        {/* User Type Cards Grid (Side-by-side on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COMPACT_USER_TYPES.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ borderLeft: `4px solid ${card.color}` }}
              className="bg-[#0D0F12] border border-white/[0.08] rounded-xl p-8 flex flex-col justify-between hover:border-slate-800 transition-colors min-h-[180px]"
            >
              <div className="space-y-4">
                <span
                  className="font-mono text-[10px] uppercase tracking-wider block"
                  style={{ color: card.color }}
                >
                  {card.label}
                </span>
                <h3 className="text-base font-bold text-white leading-snug font-sans">
                  {card.opening}
                </h3>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.04]">
                <a
                  href={card.ctaLink}
                  style={{ color: card.color }}
                  className="font-mono text-xs font-bold uppercase tracking-wider hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {card.cta}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
