import React from 'react';
import { motion } from 'framer-motion';
import { useSectionReveal } from '../../../hooks/useSectionReveal';
import { Code2, Lightbulb, Users, Bot } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

const TEAM = [
  {
    name: 'Kriten Singhal',
    role: 'Founder',
    tag: 'Idea · Content · Creative Direction',
    year: '3rd Year BTech ECE',
    color: '#22D3EE',
    Icon: Lightbulb,
    quote: "I don't want any ECE student to feel as lost as I did when I first heard 'sampling' and 'quantization' and had no idea why it mattered.",
    detail: `The restless one. Scribbled "Signal → Binary → Gate → Verilog"
on a notebook and couldn't stop thinking about it.
Writes every concept, designs every lab, learns whatever tool
he needs to learn — because someone has to.`,
    accent: 'FOUNDER',
  },
  {
    name: 'Madhur Garg',
    role: 'Co‑Founder & Lead Developer',
    tag: 'Architecture · Engineering · Performance',
    year: '3rd Year BTech ECE',
    color: '#F59E0B',
    Icon: Code2,
    quote: "I build the system so you can learn without lag — and without your browser crashing.",
    detail: `Gave canvas to Kriten's creativity.
Saw a beautiful, fragile prototype and rebuilt it from scratch —
scrollytelling engine, React architecture, 60fps animations, design system.
Everything that "just works" has Madhur's fingerprints on it.`,
    accent: 'CO‑FOUNDER',
  },
  {
    name: 'Kartik Rawat',
    role: 'Co‑Founder',
    tag: 'Team · Coordination · Community',
    year: '3rd Year BTech ECE',
    color: '#94A3B8',
    Icon: Users,
    quote: "Every team needs a glue. I may not write Verilog, but I make sure the people who do don't burn out.",
    detail: `Was there from the very first brainstorming session.
Keeps the team running — Discord, feedback sessions, task lists.
Not every contribution ships as code.
Some contributions keep the platform from imploding.`,
    accent: 'CO‑FOUNDER',
  },
  {
    name: 'Adarsh Yadav',
    role: 'AI/ML Engineer',
    tag: 'VoltMonkey · Hints · Adaptive Learning',
    year: '3rd Year BT IT',
    color: '#10B981',
    Icon: Bot,
    quote: "When you are confused, my code will be there to guide you — without giving away the answer.",
    detail: `Not a co‑founder. An IT student who joined a hardware platform
because the mission made sense.
Building VoltMonkey — an AI hint system that asks leading questions
instead of giving away answers. Joins late. Gives everything.`,
    accent: 'ENGINEER',
  },
];

export const TeamSection: React.FC = () => {
  const { ref, isInView } = useSectionReveal(0.1);

  return (
    <section ref={ref} className="max-w-5xl mx-auto px-6 py-20">
      {/* Header — triggered by section entering view */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, ease }}
        className="block text-[10px] font-mono tracking-[0.2em] mb-4"
        style={{ color: '#475569' }}
      >
        THE TEAM
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.1, ease }}
        className="font-bold mb-3"
        style={{
          fontSize: 'clamp(28px, 4vw, 44px)',
          color: '#F1F5F9',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
        }}
      >
        Four people. One gap. No plan B.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease }}
        className="text-base mb-12"
        style={{ color: '#94A3B8' }}
      >
        We are not a startup. We are students who got tired of waiting.
      </motion.p>

      {/* Cards — each reveals independently as it enters viewport */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {TEAM.map((member, i) => {
          const { Icon } = member;
          return (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{
                boxShadow: `0 0 24px ${member.color}18`,
              }}
              transition={{ duration: 0.55, delay: i * 0.08, ease }}
              className="rounded-xl p-6 flex flex-col gap-4 cursor-default"
              style={{
                background: '#0D0F12',
                border: '1px solid rgba(148,163,184,0.08)',
                borderLeft: `3px solid ${member.color}`,
                transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${member.color}15` }}
                  >
                    <Icon size={16} style={{ color: member.color }} />
                  </div>
                  <div>
                    <div
                      className="font-semibold text-sm"
                      style={{ color: '#F1F5F9' }}
                    >
                      {member.name}
                    </div>
                    <div
                      className="text-xs font-mono"
                      style={{ color: member.color }}
                    >
                      {member.role}
                    </div>
                  </div>
                </div>
                <span
                  className="text-[9px] font-mono px-2 py-0.5 rounded flex-shrink-0"
                  style={{
                    background: `${member.color}12`,
                    color: member.color,
                    border: `1px solid ${member.color}30`,
                  }}
                >
                  {member.accent}
                </span>
              </div>

              {/* Tag + year */}
              <div
                className="text-[11px] font-mono"
                style={{ color: '#475569' }}
              >
                {member.tag}&nbsp;&nbsp;·&nbsp;&nbsp;{member.year}
              </div>

              {/* Detail */}
              <p
                className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: '#94A3B8' }}
              >
                {member.detail}
              </p>

              {/* Quote — typographic curly quotes */}
              <blockquote
                className="text-xs italic leading-relaxed pt-4"
                style={{
                  borderTop: '1px solid rgba(148,163,184,0.06)',
                  color: '#475569',
                }}
              >
                &#8220;{member.quote}&#8221;
              </blockquote>
            </motion.div>
          );
        })}
      </div>

      {/* Honest footnote */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center text-xs font-mono mt-8"
        style={{ color: '#475569' }}
      >
        We tried. We failed. We rebuilt. That is what engineers do.
      </motion.p>
    </section>
  );
};
