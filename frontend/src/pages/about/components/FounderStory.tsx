import React from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../../../components/SectionWrapper';

export const FounderStory: React.FC = () => {
  return (
    <SectionWrapper id="founder-story" className="bg-[#07080A]">
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Section Label */}
        <div className="text-center">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block mb-8">
            THE STORY
          </span>
        </div>

        {/* Pull Quote */}
        <div className="flex flex-col items-center py-6 gap-4">
          <div className="w-12 h-[2px] bg-cyan-400" />
          <blockquote className="text-xl md:text-2xl font-extrabold text-white text-center font-sans tracking-tight max-w-lg">
            "I didn't choose ECE. ECE chose me by default."
          </blockquote>
          <div className="w-12 h-[2px] bg-cyan-400" />
        </div>

        {/* Story Text */}
        <div className="space-y-6 text-slate-400 font-sans text-sm md:text-base leading-relaxed">
          <p>
            I'm Kriten, a BTech ECE student from a tier-3 college. Like most of my classmates, 
            I didn't willingly sign up for electronics. In my first semester, half the class 
            was already planning to 'switch to IT' after graduation. No one talked about what 
            ECE could actually lead to, other than passing examinations and gate cutoffs.
          </p>

          <p>
            In my third year, I stumbled across the term 'VLSI Design.' Out of curiosity, I Googled 
            it, and ended up reading for three hours straight. I was stunned to discover that the 
            chips inside every smartphone, laptop, electric vehicle, and spacecraft are designed 
            by ECE engineers. By people holding degrees exactly like mine. My degree was meant for 
            this. But nobody had told me.
          </p>

          <p>
            I started looking for learning resources. The high-quality courses were locked behind 
            massive paywalls, costing thousands of rupees. The free resources were either too basic 
            or built for PhD students at Stanford, assuming expensive lab software and deep prior 
            knowledge. Nothing existed for someone at my college, with my budget, trying to figure 
            this out from absolute scratch.
          </p>

          <p>
            So, I made a choice: if no one has built this for students like me, I will. Not someday 
            after landing a corporate job, but now. AXE-OR began as a structured set of notes I compiled 
            for my own reference. Soon, classmates asked for copies. Then, I decided to scale it into 
            a proper interactive platform. The goal remains simple: free, structured, and honest 
            semiconductor education, built for the student who needs it most.
          </p>

          <p>
            This is still early. The platform is growing, and we are adding more modules every week. 
            But the promise is live today: if you're an ECE student in India, you can learn VLSI 
            fundamentals for free, right in your browser, without needing expensive college labs 
            or corporate connections. That is the gap we are closing, one gate at a time.
          </p>
        </div>

        {/* Founder Signature Block */}
        <div className="pt-8 border-t border-white/[0.04] mt-12 flex justify-start">
          <div className="font-mono text-left space-y-1.5 text-slate-500 text-[11px] uppercase tracking-wider">
            <span className="text-white font-bold block text-sm">— KRITEN</span>
            <span>BTech ECE Student  ·  Founder, AXE-OR</span>
            <span className="text-[10px] text-slate-600 block lowercase italic">building what I needed and couldn't find.</span>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};
