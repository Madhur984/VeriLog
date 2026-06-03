import React from 'react';

export const ProductMockup: React.FC = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto" aria-label="Workstation IDE and timing graph mockup">
      {/* Clean Desktop Application Window */}
      <div className="rounded-xl border border-slate-800 bg-[#090e1a] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Terminal Chrome Window Bar */}
        <div className="bg-[#03050a] px-4 py-3 border-b border-slate-900 flex items-center justify-between">
          <div className="flex gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 lowercase tracking-wider">
            workspace: dsd_module_01_nand.v
          </div>
          <div className="text-[9px] font-mono text-emerald-500/80 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded">
            SIMULATION: ACTIVE
          </div>
        </div>

        {/* Workspace Body: Side-by-Side Editor and Timing Graph */}
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-900 bg-[#090e1a] text-slate-300">
          
          {/* Left Panel: IDE Editor (7 columns) */}
          <div className="col-span-1 md:col-span-7 p-5 font-mono text-[11px] leading-relaxed space-y-4">
            <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-900/60">
              <span>[ verilog_editor ]</span>
              <span className="text-slate-600">UTF-8</span>
            </div>
            <pre className="text-slate-400 select-all overflow-x-auto">
              <code>
{`// NAND Primitive Implementation
module nand_gate (
  input  wire pin_a,
  input  wire pin_b,
  output wire out_val
);

  assign out_val = ~(pin_a & pin_b);

endmodule`}
              </code>
            </pre>
          </div>

          {/* Right Panel: Timing Diagram / Graph (5 columns) */}
          <div className="col-span-1 md:col-span-5 p-5 font-mono text-[10px] leading-relaxed flex flex-col justify-between space-y-4 bg-[#060813]/60">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-900/60">
              <span>[ timing_analyzer ]</span>
            </div>
            
            {/* Timing traces */}
            <div className="space-y-4 py-2">
              {/* CLOCK TRACE */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-500 text-[9px]">
                  <span>CLK</span>
                  <span className="text-slate-600">100 MHz</span>
                </div>
                <svg className="w-full h-8 text-[#22D3EE]/80" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 15 H12.5 V5 H25 V15 H37.5 V5 H50 V15 H62.5 V5 H75 V15 H87.5 V5 H100" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>

              {/* PIN_A TRACE */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-500 text-[9px]">
                  <span>PIN_A</span>
                  <span className="text-emerald-500/80">1 (HIGH)</span>
                </div>
                <svg className="w-full h-6 text-emerald-500/70" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 8 H30 V2 H100" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>

              {/* OUT_VAL TRACE */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-500 text-[9px]">
                  <span>OUT_VAL</span>
                  <span className="text-[#22D3EE]/80">1 (HIGH)</span>
                </div>
                <svg className="w-full h-6 text-[#22D3EE]/70" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 2 H30 V8 H70 V2 H100" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            {/* Timing telemetry status line */}
            <div className="text-[9px] text-slate-600 border-t border-slate-900/60 pt-2 flex justify-between">
              <span>MARGIN: +420ps</span>
              <span>HOLD: OK</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
