import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Code2, Zap } from 'lucide-react';

interface Props {
  isDarkMode: boolean;
}

const verilogSnippet = `module signal_bridge (
  input  wire clk,
  input  wire analog_in,
  output reg  digital_out
);

always @(posedge clk) begin
  // Threshold crossing
  digital_out <= (analog_in > 0.5);
end

endmodule`;

export const S05_VerilogBridge: React.FC<Props> = ({ isDarkMode: _ }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-6xl mx-auto relative px-8 py-20 rounded-[80px] border border-border-soft bg-bg-base shadow-neo">

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20"
      >
        {/* LEFT - Text */}
        <div className="space-y-8 text-left">
          <p className="micro-text text-plasma-cyan opacity-60">
            Phase_Conclusion // Gateway_01
          </p>
          <h1 className="hero-text text-6xl md:text-8xl leading-[0.85] text-plasma-cyan shadow-cyan-glow uppercase">
            THE<br />VERILOG<br />BRIDGE.
          </h1>
          <p className="body-text text-xl md:text-2xl">
            Analog is the pulse. Digital is the mind.
            Verilog is the blueprint that organizes them both
            into silicon reality.
          </p>
        </div>

        {/* RIGHT - Code Panel */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-plasma-cyan/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-[#0a0d12]"
          >
            {/* Header bar */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <span className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="micro-text text-white/20 ml-2">signal_bridge.v</span>
            </div>

            {/* Code body */}
            <pre className="p-8 text-sm font-mono leading-relaxed overflow-x-auto text-left">
              {verilogSnippet.split('\n').map((line, i) => (
                <div key={i} className="flex gap-4">
                  <span className="select-none text-white/10 w-4 text-right shrink-0">{i + 1}</span>
                  <span
                    className={
                      line.includes('module') || line.includes('endmodule')
                        ? 'text-plasma-cyan'
                        : line.includes('input') || line.includes('output') || line.includes('reg') || line.includes('wire')
                        ? 'text-[#FF5F1F]'
                        : line.includes('//')
                        ? 'text-white/30'
                        : line.includes('always') || line.includes('begin') || line.includes('end')
                        ? 'text-[#a78bfa]'
                        : 'text-white/70'
                    }
                  >
                    {line || '\u00a0'}
                  </span>
                </div>
              ))}
            </pre>

            {/* Overlay badge */}
            <div className="absolute bottom-8 right-8">
              <div className="micro-text text-white/30 mb-1">Compilation Status</div>
              <div className="hero-text text-xl text-plasma-cyan uppercase">
                SIGNAL LOCKED
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom CTA block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="z-20 p-12 rounded-[50px] bg-bg-elev border border-border-soft shadow-neo w-full max-w-3xl text-center space-y-8"
      >
        <div className="flex justify-center gap-8 mb-4">
          {[
            { icon: Cpu, label: 'Hardware', sub: 'Silicon Logic' },
            { icon: Code2, label: 'Verilog', sub: 'HDL Blueprint' },
            { icon: Zap, label: 'Synthesis', sub: 'Gate Mapping' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-2xl bg-plasma-cyan/10 border border-plasma-cyan/20 flex items-center justify-center">
                <Icon size={18} className="text-plasma-cyan" />
              </div>
              <span className="hero-text text-xs text-white uppercase">{label}</span>
              <span className="micro-text text-white/30 normal-case">{sub}</span>
            </div>
          ))}
        </div>

        <p className="hero-text text-3xl md:text-5xl leading-tight text-white uppercase">
          Design the intelligence.<br />
          <span className="text-plasma-cyan">Master the hardware.</span>
        </p>

        <button
          className="px-12 py-5 rounded-full bg-plasma-cyan text-black font-black uppercase tracking-[0.2em] shadow-cyan-glow hover:brightness-110 hover:translate-y-[-4px] transition-all active:scale-95"
          onClick={() => window.location.href = '/module/2'}
        >
          Launch Module 02
        </button>
      </motion.div>

    </div>
  );
};
