import React from 'react';
import { motion } from 'framer-motion';
import { Info, TrendingUp, Cpu, DollarSign, Activity, AlertTriangle, Power } from 'lucide-react';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

export const S01_IndustryProblem: React.FC<Props> = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center justify-start w-full max-w-6xl mx-auto px-8 relative text-center bg-matte-obsidian/40 py-10 rounded-[80px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="w-full flex flex-col items-center"
      >
        <h2 className="text-6xl md:text-[100px] font-black italic tracking-tighter leading-[0.8] uppercase mb-12">
            The <span className="text-plasma-cyan">Risk.</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-6 mb-16">
          {[
            { label: "Tape-out Cost", value: "$5M+", detail: "Per 5nm design attempt", icon: DollarSign, color: "text-burnished-copper" },
            { label: "Complexity", value: "10B+", detail: "Gates in standard GPU", icon: Activity, color: "text-plasma-cyan" },
            { label: "Market Risk", value: "$400Cr", detail: "Loss per single logic bug", icon: AlertTriangle, color: "text-red-500" },
            { label: "Human Limit", value: "ZERO", detail: "Feasibility of manual layout", icon: Power, color: "text-white/20" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                  scale: 1.05, 
                  rotateY: 10,
                  rotateX: -5,
                  transition: { duration: 0.2 }
              }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[50px] bg-white/[0.03] border border-white/5 flex flex-col items-center text-center group hover:border-white/20 transition-all shadow-2xl perspective-1000 cursor-help"
            >
              <div className={`p-4 rounded-3xl bg-black/40 mb-8 ${stat.color} group-hover:scale-110 group-hover:shadow-lg transition-transform`}>
                <stat.icon size={28} />
              </div>
              <div className="text-4xl font-black italic tracking-tighter mb-2">{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">{stat.label}</div>
              <p className="text-[10px] font-bold opacity-30 italic leading-snug group-hover:opacity-100 transition-opacity">
                {stat.detail}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl space-y-12 md:space-y-16">
            <p className="text-2xl md:text-5xl font-black tracking-tighter leading-tight italic px-4">
                 Building a chip isn't like writing an App. <br/>
                 One bug = <span className="text-burnished-copper">$50 Million</span> loss.
            </p>
            
            <div className="p-8 md:p-12 rounded-[40px] md:rounded-[60px] bg-solder-mask border border-plasma-cyan/30 shadow-cyan-glow backdrop-blur-xl relative overflow-hidden group transition-all duration-700">
                 <div className="absolute top-0 left-0 w-2 h-2 bg-plasma-cyan" />
                 <div className="absolute top-0 right-0 w-2 h-2 bg-plasma-cyan" />
                 <div className="absolute bottom-0 left-0 w-2 h-2 bg-plasma-cyan" />
                 <div className="absolute bottom-0 right-0 w-2 h-2 bg-plasma-cyan" />
                 
                 <p className="text-lg md:text-2xl font-black opacity-60 leading-relaxed italic">
                    With billions of gates, a single human typo is fatal. 
                    Hardware Description Languages (HDL) are the <span className="text-white italic underline underline-offset-8">only bridge</span> to surviving this complexity.
                 </p>
            </div>
        </div>
      </motion.div>
    </div>
  );
};
