import React from 'react';
import { motion } from 'framer-motion';
import { Info, TrendingUp, Cpu, DollarSign, Activity, AlertTriangle, Power } from 'lucide-react';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

export const S01_IndustryProblem: React.FC<Props> = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center justify-start w-full max-w-6xl mx-auto px-8 relative text-center bg-black/40 py-10 rounded-[80px] border border-white/5 backdrop-blur-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="w-full flex flex-col items-center"
      >
        <h2 className="hero-text text-6xl md:text-[100px] leading-[0.8] text-plasma-cyan uppercase italic mb-12">
            The Risk.
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
              <div className="hero-text text-4xl uppercase italic mb-2 tracking-tighter">{stat.value}</div>
              <div className="micro-text opacity-40 mb-4">{stat.label}</div>
              <p className="body-text text-[10px] opacity-30 group-hover:opacity-100 transition-opacity">
                {stat.detail}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl space-y-12 md:space-y-16">
            <p className="hero-text text-2xl md:text-5xl leading-tight text-white uppercase italic px-4">
                 Building a chip isn't like writing an App. <br/>
                 One bug = <span className="text-burnished-copper">$50 Million</span> loss.
            </p>
            
            <div className="p-8 md:p-12 rounded-[40px] md:rounded-[60px] bg-black/40 border border-plasma-cyan/30 shadow-cyan-glow backdrop-blur-xl relative overflow-hidden group transition-all duration-700">
                 <div className="absolute top-0 left-0 w-2 h-2 bg-plasma-cyan" />
                 <div className="absolute top-0 right-0 w-2 h-2 bg-plasma-cyan" />
                 <div className="absolute bottom-0 left-0 w-2 h-2 bg-plasma-cyan" />
                 <div className="absolute bottom-0 right-0 w-2 h-2 bg-plasma-cyan" />
                 
                 <p className="body-text text-lg md:text-2xl opacity-60">
                    With billions of gates, a single human typo is fatal. 
                    Hardware Description Languages (HDL) are the <span className="text-white italic underline underline-offset-8">only bridge</span> to surviving this complexity.
                 </p>
            </div>
        </div>
      </motion.div>
    </div>
  );
};
