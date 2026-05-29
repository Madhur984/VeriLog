import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LANDING_ROUTES } from './landingRoutes';

const TYPES = [
  {
    label: 'The confused first-year',
    color: '#0891B2',
    opening: 'You got ECE because the CS cutoff was too high.',
    cta: 'Explore the domains →',
    to: LANDING_ROUTES.career,
  },
  {
    label: 'The stuck third-year',
    color: '#F59E0B',
    opening: 'Your CS friends have internships. You have derivations.',
    cta: 'See your skill gaps →',
    to: LANDING_ROUTES.careerSkills,
  },
  {
    label: 'The determined one',
    color: '#10B981',
    opening: 'You actually want to design chips.',
    cta: 'Start learning →',
    to: LANDING_ROUTES.firstModule,
  },
];

export const ForWhoSection = () => {
  return (
    <section className="w-full" style={{ background: '#F4F6FA' }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: '#0891B2' }}>
            Who it&apos;s for
          </span>
          <h2 className="mt-3 font-extrabold tracking-tight" style={{ fontSize: 'clamp(30px, 4.5vw, 46px)', color: '#0B1220', letterSpacing: '-0.02em' }}>
            You&apos;ll know this is for you.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TYPES.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex flex-col justify-between rounded-2xl bg-white p-7 min-h-[200px]"
              style={{ borderLeft: `4px solid ${card.color}`, border: '1px solid rgba(15,23,42,0.08)', borderLeftWidth: 4, borderLeftColor: card.color, boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}
            >
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: card.color }}>{card.label}</span>
                <h3 className="text-base font-bold leading-snug" style={{ color: '#0B1220' }}>{card.opening}</h3>
              </div>
              <div className="pt-5 mt-5" style={{ borderTop: '1px solid rgba(15,23,42,0.06)' }}>
                <Link to={card.to} className="inline-flex items-center gap-1.5 text-sm font-bold hover:gap-2.5 transition-all" style={{ color: card.color }}>
                  {card.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
