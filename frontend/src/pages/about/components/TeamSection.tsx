import { motion } from 'framer-motion';
import { Code2, Lightbulb, Users, Bot } from 'lucide-react';

const TEAM = [
  {
    name: 'Kriten Singhal',
    role: 'Founder, Idea & Content',
    branch: '3rd Year BTech ECE',
    color: '#22D3EE',
    icon: Lightbulb,
    quote: "I don't want any ECE student to feel as lost as I did when I first heard 'sampling' and 'quantization'.",
    detail: "Scribbled 'Signal → Binary → Gate → Verilog' on a notebook. Writes every line of concept text and designs every lab. As a Smart India Hackathon 2025 (Hardware Edition) Winner and team lead, he brings real-world hardware execution to the curriculum. Learned React/GSAP out of sheer necessity. Obsesses over micro-animations at 2am.",
  },
  {
    name: 'Madhur Garg',
    role: 'Co-Founder & Lead Developer',
    branch: '3rd Year BTech ECE',
    color: '#F59E0B',
    icon: Code2,
    quote: "I build the system so you can learn without lag – and without your browser crashing.",
    detail: "The engine room. Refactored Kriten's fragile prototype into a scalable, production-ready React architecture. Handles the scrollytelling engine and 60fps performance optimization.",
  },
  {
    name: 'Kartik Rawat',
    role: 'Co-Founder & Team Coordinator',
    branch: '3rd Year BTech ECE',
    color: '#94A3B8',
    icon: Users,
    quote: "I may not write Verilog, but I make sure the people who do don't burn out. Every team needs a glue.",
    detail: "Was there from the very first brainstorming session. Tried making logos (none survived), but his real value is keeping the team sane. Organizes tasks, runs feedback sessions, and acts as the moral compass.",
  },
  {
    name: 'Adarsh Yadav',
    role: 'AI/ML Chatbot Engineer',
    branch: '3rd Year BT IT',
    color: '#10B981',
    icon: Bot,
    quote: "When you are confused, my code will be there to guide you – without giving away the answer.",
    detail: "The IT guy among ECEs. Building VoltMonkey — an intelligent, non-judgmental hint system. It watches interactions and gives contextual nudges to make learning adaptive.",
  }
];

export const TeamSection = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">The Core Team</h2>
        <p className="text-slate-400">Four engineers from different branches. One shared mission.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEAM.map((member, i) => {
          const Icon = member.icon;
          return (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="pcb-trace-card p-8 bg-[#0D0F12] border border-white/5"
            >
              <div 
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl z-10" 
                style={{ backgroundColor: member.color }} 
              />
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${member.color}15` }}>
                  <Icon style={{ color: member.color }} size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-xs font-mono text-slate-500 mt-1">{member.role} // {member.branch}</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {member.detail}
              </p>
              <blockquote className="text-sm italic text-slate-500 border-t border-white/5 pt-4">
                "{member.quote}"
              </blockquote>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
