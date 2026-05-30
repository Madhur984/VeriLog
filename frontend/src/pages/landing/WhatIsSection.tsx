import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GatePreview } from '../../components/GatePreview';
import { LANDING_ROUTES } from './landingRoutes';

export const WhatIsSection = () => {
  return (
    <section id="what-is-section" className="w-full" style={{ background: '#0B1220' }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: the gap narrative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-6 space-y-6"
          >
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: '#22D3EE' }}>
              The gap we close
            </span>
            <h2 className="font-extrabold leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(30px, 4.5vw, 46px)', color: '#F8FAFC', letterSpacing: '-0.02em' }}>
              Most ECE students meet VLSI
              <br />
              <span style={{ color: '#22D3EE' }}>far too late.</span>
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed" style={{ color: '#CBD5E1' }}>
              <p>
                You landed in ECE off a CS cutoff, then spent years on derivations - never
                hearing the words VLSI, RTL, or RF until placements. Meanwhile real fabs need
                hands-on, tool-fluent designers. That mismatch is the <strong style={{ color: '#F8FAFC' }}>Glasswing Gap</strong>.
              </p>
              <p>
                BitforBytes closes it the way it should be taught - through{' '}
                <strong style={{ color: '#F8FAFC' }}>simulation, not slides</strong>. Every concept is a live
                interaction: you toggle a bit, you see the signal, you build the system. No lab,
                no expensive EDA licence.
              </p>
              <p className="text-[13px] italic" style={{ color: '#64748B' }}>
                Built by ECE students who couldn&apos;t find this anywhere else.
              </p>
            </div>
            <Link
              to={LANDING_ROUTES.about}
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: '#22D3EE' }}
            >
              Read our story →
            </Link>
          </motion.div>

          {/* Right: live interactive gate (signature flair) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="md:col-span-6"
          >
            <div
              className="rounded-3xl p-1.5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <GatePreview />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
