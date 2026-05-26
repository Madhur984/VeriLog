import React from 'react';
import { motion } from 'framer-motion';
import { useSectionReveal } from '../../../hooks/useSectionReveal';
import { SectionWrapper } from '../../../components/SectionWrapper';

const ease = [0.16, 1, 0.3, 1] as const;

const PARAGRAPHS = [
  {
    id: 'reality',
    text: `I'm Kriten. I'm pursuing BTech ECE from a tier‑3 college.
I didn't choose this branch — I ended up here after missing the CS cutoff.
Most of my classmates had the same story. In the first semester,
half the class was already planning to "switch to IT" after graduation.
Nobody was talking about what ECE could become. Nobody was showing us.`,
  },
  {
    id: 'discovery',
    text: `In my third year, I accidentally came across the term "VLSI Design."
I looked it up. I kept reading for three hours.
I had no idea that the chips inside every phone, every laptop, every EV —
they are designed by ECE engineers. By people with degrees exactly like mine.
My degree could do this. Nobody had told me. For two years, nobody had told me.`,
  },
  {
    id: 'frustration',
    text: `I started looking for resources. The good ones were paywalled.
The free ones were either made for US grad students or shot on a webcam in 2014.
Nothing was built for someone at my college, with my constraints,
trying to figure this out from scratch.
I spent months piecing together PDFs, IEEE papers, and YouTube videos
that were never meant to fit together.`,
  },
  {
    id: 'decision',
    text: `I told Madhur. He saw the same gap I did.
He took my rough ideas — a scribbled notebook, some broken HTML files —
and built them into something real. From scratch. No boilerplate.
No templates. Just code and intent.
Kartik was in the loop from day one, keeping us together when the project
felt too big and our code felt too broken.`,
  },
  {
    id: 'mission',
    text: `We tried. We failed. We rebuilt. We tried again.
That is what engineers do. We build.
This platform isn't just a learning tool — it's our answer to the question
nobody asked us: what would you have needed when you were lost?
And it's our small contribution to something bigger:
building India's semiconductor talent, indigenously, from the inside.`,
  },
  {
    id: 'now',
    text: `AXE‑OR is still early. Some modules are done.
Many more are being built. But the promise is already live:
if you're an ECE student anywhere in India, you can start
learning VLSI fundamentals today — for free — without a lab,
without expensive software, without a well-connected college.
That gap is what we're closing. One module at a time.`,
  },
];

export const FounderStory: React.FC = () => {
  const { ref, isInView } = useSectionReveal(0.1);

  return (
    <SectionWrapper id="founder-story" className="bg-[#07080A]">
      <div ref={ref} className="max-w-2xl mx-auto space-y-12">
        {/* Section label */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease }}
          className="block text-center text-[10px] font-mono tracking-[0.2em] mb-10"
          style={{ color: '#475569' }}
        >
          THE STORY
        </motion.span>

        {/* Pull quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1, ease }}
          className="mb-12 text-center"
        >
          <div
            className="inline-block"
            style={{
              borderTop: '2px solid #22D3EE',
              borderBottom: '2px solid #22D3EE',
              padding: '16px 0',
            }}
          >
            <blockquote
              className="font-bold text-center"
              style={{
                fontSize: 'clamp(22px, 3.5vw, 32px)',
                color: '#F1F5F9',
                lineHeight: 1.3,
                maxWidth: '520px',
              }}
            >
              "I didn't choose ECE.
              <br />ECE chose me by default."
            </blockquote>
          </div>
        </motion.div>

        {/* Story paragraphs */}
        <div className="space-y-7">
          {PARAGRAPHS.map((para, i) => (
            <motion.p
              key={para.id}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.18 + i * 0.09, ease }}
              className="text-base leading-[1.85] whitespace-pre-line"
              style={{ color: '#94A3B8' }}
            >
              {para.text}
            </motion.p>
          ))}
        </div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8, ease }}
          className="mt-12 pt-8"
          style={{ borderTop: '1px solid rgba(148,163,184,0.08)' }}
        >
          <div
            className="text-sm font-mono space-y-1"
            style={{ color: '#475569' }}
          >
            <div style={{ color: '#F1F5F9', fontWeight: 600 }}>— KRITEN</div>
            <div>Founder, AXE‑OR</div>
            <div className="text-xs italic" style={{ color: '#475569' }}>
              Building what I needed and couldn't find.
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};
