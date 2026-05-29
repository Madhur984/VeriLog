import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LANDING_ROUTES } from './landingRoutes';
import { SignalWave } from './SignalWave';

const MotionLink = motion(Link);

export const FinalCTA = () => {
  return (
    <section className="relative w-full overflow-hidden" style={{ background: '#0B1220' }}>
      {/* glow + signature waveform */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 700px 400px at 50% 40%, rgba(34,211,238,0.10) 0%, transparent 65%)' }} />
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <SignalWave color="#22D3EE" opacity={0.18} className="h-24 w-full" duration={9} strokeWidth={1.5} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-28 flex flex-col items-center text-center">
        <h2 className="font-extrabold leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#F8FAFC', letterSpacing: '-0.02em' }}>
          Your degree can take you to the
          <br className="hidden sm:block" />{' '}
          <span style={{ color: '#22D3EE' }}>chips inside every device.</span>
        </h2>

        <p className="mt-6 max-w-xl text-[15px] md:text-base leading-relaxed" style={{ color: '#94A3B8' }}>
          It starts with one bit. Then a byte. Then a gate. Then a system. BitforBytes walks you
          through every step - free, interactive, starting now.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <MotionLink
            to={LANDING_ROUTES.firstModule}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-9 py-4 rounded-xl font-bold text-sm"
            style={{ background: '#22D3EE', color: '#06121A', boxShadow: '0 12px 40px rgba(34,211,238,0.28)' }}
          >
            ▶ Start your first module - free
          </MotionLink>
          <span className="text-[11px] font-medium uppercase tracking-widest" style={{ color: '#64748B' }}>
            No account · No card · No download
          </span>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold" style={{ color: '#64748B' }}>
          <Link to={LANDING_ROUTES.career} className="hover:text-[#22D3EE] transition-colors">Explore career paths</Link>
          <span>·</span>
          <Link to={LANDING_ROUTES.about} className="hover:text-[#22D3EE] transition-colors">Read our story</Link>
          <span>·</span>
          <Link to={LANDING_ROUTES.about} className="hover:text-[#22D3EE] transition-colors">Meet the team</Link>
        </div>
      </div>
    </section>
  );
};
