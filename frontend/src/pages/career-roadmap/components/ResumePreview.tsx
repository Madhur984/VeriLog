import React from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { DataTerminal } from './DataTerminal';

export const ResumePreview: React.FC = () => {
  const generatePDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const storedNodes = localStorage.getItem('axe_mastered_nodes');
    const masteredNodes = storedNodes ? JSON.parse(storedNodes) : ['Digital Foundation', 'Verilog HDL', 'CMOS Fabrication'];
    
    // Resume Header
    doc.setFont('courier', 'bold');
    doc.setFontSize(24);
    doc.text('SILICON ENGINEER', 40, 60);
    
    doc.setFont('courier', 'normal');
    doc.setFontSize(10);
    doc.text('AXE-OR Verified Credentials | Global Rank: Top 5%', 40, 80);
    
    // Divider
    doc.setLineWidth(0.5);
    doc.line(40, 90, 550, 90);
    
    // Skills
    doc.setFontSize(14);
    doc.setFont('courier', 'bold');
    doc.text('CORE COMPETENCIES', 40, 120);
    doc.setFontSize(11);
    doc.setFont('courier', 'normal');
    
    let y = 140;
    masteredNodes.forEach((node: string, index: number) => {
      doc.text(`> ${node.replace(/-/g, ' ').toUpperCase()}`, 40, y);
      y += 20;
    });

    // Projects
    y += 20;
    doc.setFontSize(14);
    doc.setFont('courier', 'bold');
    doc.text('TECHNICAL ARTIFACTS', 40, y);
    y += 20;
    doc.setFontSize(11);
    doc.setFont('courier', 'normal');
    doc.text('1. 16-bit Pipelined RISC-V Core (Verilog)', 40, y);
    y += 15;
    doc.setFontSize(9);
    doc.text('- Achieved timing closure at 500MHz using TSMC 65nm.', 50, y);
    
    y += 25;
    doc.setFontSize(11);
    doc.text('2. RF Transceiver Front-End (Spectre RF)', 40, y);
    y += 15;
    doc.setFontSize(9);
    doc.text('- Designed LNA and Mixer with < 3dB Noise Figure.', 50, y);
    
    // Export
    doc.save('Silicon_Resume.pdf');
  };

  return (
    <DataTerminal title="SILICON RESUME ENGINE" subtitle="Real-time ATS-Compliant Document Generation">
      <div className="flex flex-col md:flex-row p-8 gap-8">
        
        {/* Real-time Preview Area */}
        <div className="flex-1 bg-white p-8 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] rounded-sm aspect-[1/1.414] text-black">
          <div className="font-mono text-2xl font-bold uppercase tracking-tighter mb-2 border-b-2 border-black pb-2">
             Silicon Engineer
          </div>
          <div className="font-mono text-[10px] text-gray-500 mb-8 uppercase tracking-widest">
            AXE-OR Verified Credentials | Global Rank: Top 5%
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-mono text-sm font-bold uppercase mb-2">Core Competencies</h4>
              <ul className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-700">
                 <li>{'>'} DIGITAL FOUNDATION</li>
                 <li>{'>'} VERILOG HDL</li>
                 <li>{'>'} CMOS FABRICATION</li>
                 <li>{'>'} TIMING ANALYSIS</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-mono text-sm font-bold uppercase mb-2 border-b border-gray-200 pb-1">Technical Artifacts</h4>
              <div className="space-y-4 mt-3">
                <div>
                  <div className="text-xs font-mono font-bold">16-bit Pipelined RISC-V Core</div>
                  <div className="text-[10px] font-mono text-gray-600 mt-1">- Achieved timing closure at 500MHz using TSMC 65nm.</div>
                  <div className="text-[10px] font-mono text-gray-600">- Verified using UVM methodology with 99% functional coverage.</div>
                </div>
                <div>
                  <div className="text-xs font-mono font-bold">RF Transceiver Front-End</div>
                  <div className="text-[10px] font-mono text-gray-600 mt-1">- Designed LNA and Mixer with &lt; 3dB Noise Figure.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-full md:w-80 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2">ATS Compatibility Score</div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-mono font-bold text-white">94</span>
                <span className="text-sm font-mono text-slate-500 mb-1">/ 100</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Live Validations</div>
              <div className="flex items-center gap-2 text-xs font-mono text-green-400">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> Parseable Typography
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-green-400">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> High-impact Action Verbs
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-accent-orange">
                <span className="w-1.5 h-1.5 bg-accent-orange rounded-full" /> Missing LinkedIn URL
              </div>
            </div>
          </div>
          
          <button 
            onClick={generatePDF}
            className="mt-8 px-6 py-4 bg-cyan-400 text-black font-mono text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-3 w-full"
          >
            Export to PDF
          </button>
        </div>
      </div>
    </DataTerminal>
  );
};
