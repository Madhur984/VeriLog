import { GatePreview } from '../../components/GatePreview';

export const WhatIsSection = () => {
  return (
    <section
      id="what-is-section"
      className="py-24 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Left Side: Pitch Text (40%) */}
        <div className="md:col-span-5 space-y-6">
          <span
            className="text-[10px] font-mono tracking-widest uppercase block"
            style={{ color: '#475569' }}
          >
            WHAT IS THIS
          </span>
          <h2
            className="font-bold leading-tight font-sans"
            style={{
              fontSize: 'clamp(32px, 5vw, 44px)',
              color: '#F1F5F9',
              letterSpacing: '-0.03em',
            }}
          >
            Not a course.
            <br />
            Not a textbook.
            <br />
            <span style={{ color: '#22D3EE' }}>An experience.</span>
          </h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
            <p>
              BitforBytes is a free, interactive platform that teaches
              VLSI and digital design the way it should be taught —
              through simulation, not slides.
            </p>
            <p>
              Every concept is a live interaction. You toggle inputs.
              You see signals. You build understanding from the ground up.
              No lab access required. No expensive software.
            </p>
            <p className="italic text-xs" style={{ color: '#475569' }}>
              Built by ECE students who couldn't find this anywhere else.
            </p>
          </div>
          <div className="pt-2">
            <a
              href="/career-roadmap?tab=about"
              className="text-xs font-mono tracking-wider transition-all duration-150 inline-block hover:text-[#22D3EE]"
              style={{ color: '#475569' }}
            >
              READ OUR STORY →
            </a>
          </div>
        </div>

        {/* Right Side: GatePreview Simulator (60%) */}
        <div className="md:col-span-7 h-full">
          <GatePreview />
        </div>
      </div>
    </section>
  );
};
