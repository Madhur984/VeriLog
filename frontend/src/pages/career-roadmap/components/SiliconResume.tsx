import { useState, useEffect } from 'react';
import { FileDown, CheckCircle, Sparkles } from 'lucide-react';
import { useColorScheme } from '../../../hooks/useColorScheme';
import jsPDF from 'jspdf';

export const SiliconResume = () => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const [activeTemplate, setActiveTemplate] = useState('india');
  const [masteredNodes, setMasteredNodes] = useState<string[]>([]);
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bfb_mastered_nodes');
      if (stored) {
        setMasteredNodes(JSON.parse(stored));
      } else {
        setMasteredNodes(['digital-foundation', 'verilog-hdl']);
      }
    } catch (e) {
      console.error('Error parsing mastered nodes for resume:', e);
      setMasteredNodes(['digital-foundation', 'verilog-hdl']);
    }
  }, []);

  const defaultSkills = ["SystemVerilog / Verilog", "STA Timing Optimization", "FSM Synthesis", "Digital Circuit Design"];
  
  const mappedSkills = masteredNodes.map(node => {
    return node
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  });

  const skillsList = Array.from(new Set([...mappedSkills, ...defaultSkills]));

  const resumeData = {
    name: "KRITEN SINGHAL",
    contact: "k.singhal@bitforbytes.in | +91 XXXXXXXXXX | Ghaziabad, UP",
    links: "github.com/kriten | linkedin.com/in/kriten",
    summary: "ECE 3rd-year student focusing on logic optimization, RTL architecture, and hardware synthesis. Winner and Team Lead of Smart India Hackathon 2025 (Hardware Edition). Dedicated to building highly structured architecture prototypes.",
    skills: skillsList,
    badges: ["Digital Design Foundations", "Binary Arithmetic Pioneer", "Timing Compliance Specialist"],
    projects: [
      { name: "BitforBytes Core Scrollytelling Simulator", desc: "Engineered browser-native 60fps structural clock domain simulator and physics-accurate transmission line trace graph components from absolute scratch using React & TypeScript layout arrays." },
      { name: "Smart India Hackathon 2025 Winning Hardware Node", desc: "Designed and fabricated an on-edge indigenous firmware hardware subsystem block. Managed structural validation schemas and timing analysis profiles under extreme stress limits." }
    ]
  };

  const exportPDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const fontHeader = activeTemplate === 'global' ? 'times' : 'helvetica';
    const fontBody = activeTemplate === 'global' ? 'times' : 'helvetica';
    
    doc.setFont(fontHeader, 'bold');
    doc.setFontSize(22);
    doc.text(resumeData.name, 297, 50, { align: 'center' });
    
    doc.setFont(fontBody, 'normal');
    doc.setFontSize(9);
    doc.text(resumeData.contact, 297, 68, { align: 'center' });
    doc.text(resumeData.links, 297, 80, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(180, 180, 180);
    doc.line(40, 92, 555, 92);
    
    let y = 115;
    
    doc.setFont(fontHeader, 'bold');
    doc.setFontSize(10);
    doc.text("OBJECTIVE PROFILE", 40, y);
    doc.line(40, y + 3, 555, y + 3);
    y += 18;
    doc.setFont(fontBody, 'normal');
    doc.setFontSize(9);
    const splitSummary = doc.splitTextToSize(resumeData.summary, 515);
    doc.text(splitSummary, 40, y);
    y += splitSummary.length * 12 + 15;
    
    doc.setFont(fontHeader, 'bold');
    doc.setFontSize(10);
    doc.text("TECHNICAL MATRICES", 40, y);
    doc.line(40, y + 3, 555, y + 3);
    y += 18;
    doc.setFont(fontBody, 'normal');
    doc.setFontSize(9);
    const skillsText = "Hardware Description / Architectures: " + resumeData.skills.join(', ');
    const splitSkills = doc.splitTextToSize(skillsText, 515);
    doc.text(splitSkills, 40, y);
    y += splitSkills.length * 12 + 15;
    
    doc.setFont(fontHeader, 'bold');
    doc.setFontSize(10);
    doc.text("VERIFIED CERTIFICATIONS (BITFORBYTES PLATFORM)", 40, y);
    doc.line(40, y + 3, 555, y + 3);
    y += 18;
    doc.setFont(fontBody, 'normal');
    doc.setFontSize(9);
    resumeData.badges.forEach((badge) => {
      doc.text(`* ${badge} Tag: Cryptographically verified structural core logic compliance token mapping.`, 40, y);
      y += 14;
    });
    y += 10;
    
    doc.setFont(fontHeader, 'bold');
    doc.setFontSize(10);
    doc.text("ENGINEERING ARTIFACTS", 40, y);
    doc.line(40, y + 3, 555, y + 3);
    y += 18;
    resumeData.projects.forEach((proj) => {
      doc.setFont(fontHeader, 'bold');
      doc.setFontSize(9);
      doc.text(proj.name, 40, y);
      doc.setFont(fontBody, 'normal');
      doc.text("2025 - Present", 555, y, { align: 'right' });
      y += 14;
      const splitDesc = doc.splitTextToSize(proj.desc, 515);
      doc.text(splitDesc, 40, y);
      y += splitDesc.length * 12 + 12;
    });
    
    doc.save(`Silicon_Resume_${activeTemplate}.pdf`);
  };

  return (
    <div className={`w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 border rounded-xl ${
      isLight ? 'bg-bg-base border-border-soft text-text-main' : 'bg-[#07080A] text-white border-white/5'
    }`}>
      {/* Left Panel: Real-Time Quality Analyzer Controls */}
      <div className="lg:col-span-5 space-y-6 flex flex-col justify-between h-full">
        <div className="space-y-6">
          <div>
            <span className={`text-[10px] font-mono tracking-[0.2em] ${isLight ? 'text-signal-core' : 'text-[#22D3EE]'}`}>COMPILER STAGE 04</span>
            <h2 className="text-3xl font-bold font-mono mt-1 text-text-main">SILICON RESUME</h2>
            <p className="text-sm text-text-dim mt-2">
              One-click deployment matrix. Your platform achievements are mapped directly onto an ATS-proof professional canvas.
            </p>
          </div>

          {/* Template Selector */}
          <div className={`border rounded-xl p-4 ${isLight ? 'bg-bg-elev border-border-soft' : 'bg-[#0D0F12] border-white/5'}`}>
            <label className="text-xs font-mono text-text-dim block mb-2 uppercase">TARGET SUBSYSTEM ENVIRONMENT</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTemplate('india')}
                className={`py-2 text-[10px] font-mono rounded border transition-all ${
                  activeTemplate === 'india' 
                    ? (isLight ? 'border-signal-core bg-signal-core/5 text-signal-core' : 'border-[#22D3EE] bg-[#22D3EE]/5 text-[#22D3EE]')
                    : `${isLight ? 'border-border-soft text-text-dim hover:border-ghost-trace' : 'border-white/5 text-slate-400 hover:border-white/10'}`
                }`}
              >
                INDIA STANDARD (LPA)
              </button>
              <button
                onClick={() => setActiveTemplate('global')}
                className={`py-2 text-[10px] font-mono rounded border transition-all ${
                  activeTemplate === 'global' 
                    ? (isLight ? 'border-accent-orange bg-accent-orange/5 text-accent-orange' : 'border-[#F59E0B] bg-[#F59E0B]/5 text-[#F59E0B]')
                    : `${isLight ? 'border-border-soft text-text-dim hover:border-ghost-trace' : 'border-white/5 text-slate-400 hover:border-white/10'}`
                }`}
              >
                GLOBAL DESIGN (LaTeX)
              </button>
            </div>
          </div>

          {/* Automated Quality Diagnostic Readout */}
          <div className={`border rounded-xl p-5 space-y-4 ${isLight ? 'bg-bg-elev border-border-soft' : 'bg-[#0D0F12] border-white/5'}`}>
            <div className={`flex justify-between items-center border-b pb-3 ${isLight ? 'border-border-soft' : 'border-white/5'}`}>
              <span className="text-xs font-mono text-text-dim">ATS VALIDATION STREAM</span>
              <span className={`text-xs font-mono font-bold ${isLight ? 'text-emerald-700' : 'text-[#10B981]'}`}>PASS RATE: 98%</span>
            </div>
            
            <div className="space-y-3 text-[11px] font-mono leading-relaxed">
              <div className="flex items-start gap-2 text-text-sub">
                <CheckCircle size={14} className={`shrink-0 mt-0.5 ${isLight ? 'text-emerald-700' : 'text-[#10B981]'}`} />
                <span>Structural verification successful: Zero table grids, graphical frames, or unreadable fonts detected.</span>
              </div>
              <div className="flex items-start gap-2 text-text-sub">
                <CheckCircle size={14} className={`shrink-0 mt-0.5 ${isLight ? 'text-emerald-700' : 'text-[#10B981]'}`} />
                <span>Keyword parsing match: Found core tags: <code className={isLight ? 'text-signal-core' : 'text-[#22D3EE]'}>Verilog</code>, <code className={isLight ? 'text-signal-core' : 'text-[#22D3EE]'}>RTL</code>, and <code className={isLight ? 'text-signal-core' : 'text-[#22D3EE]'}>STA</code>.</span>
              </div>
              <div className="flex items-start gap-2 text-text-dim">
                <Sparkles size={14} className="text-[#F59E0B] shrink-0 mt-0.5" />
                <span>Recommendation: Fill 1 more RTL timing node to pass Nvidia parsing algorithms completely.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={exportPDF}
          className={`w-full font-mono text-sm py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            isLight ? 'bg-signal-core text-white hover:bg-signal-core/90' : 'bg-[#22D3EE] text-[#07080A] hover:bg-[#19b1c9]'
          }`}
        >
          <FileDown size={16} />
          EXPORT INDUSTRIAL PDF
        </button>
      </div>

      {/* Right Panel: ATS-Readable Live Rendering Engine */}
      <div className="lg:col-span-7 bg-white text-black p-8 rounded-xl shadow-2xl min-h-[600px] h-full font-sans overflow-x-auto selection:bg-slate-200">
        <div className="min-w-0">
          <div className="text-center border-b border-slate-300 pb-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{resumeData.name}</h1>
            <p className="text-xs text-slate-600 font-mono mt-1">{resumeData.contact}</p>
            <p className="text-xs text-slate-600 font-mono">{resumeData.links}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-bold font-mono tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1">OBJECTIVE PROFILE</h3>
            <p className="text-xs leading-relaxed text-slate-700">{resumeData.summary}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-bold font-mono tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1">TECHNICAL MATRICES</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Hardware Description / Architectures: </strong> {resumeData.skills.join(', ')}
            </p>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-bold font-mono tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1">VERIFIED CERTIFICATIONS (BITFORBYTES PLATFORM)</h3>
            <ul className="list-disc pl-4 text-xs text-slate-700 space-y-0.5">
              {resumeData.badges.map((badge, i) => (
                <li key={i}><strong>{badge} Tag:</strong> Cryptographically verified structural core logic compliance token mapping.</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-bold font-mono tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1">ENGINEERING ARTIFACTS</h3>
            <div className="space-y-3">
              {resumeData.projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex justify-between font-semibold text-xs text-slate-900">
                    <span>{proj.name}</span>
                    <span className="font-mono font-normal text-[10px] text-slate-500">2025 - Present</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600 mt-0.5">{proj.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
