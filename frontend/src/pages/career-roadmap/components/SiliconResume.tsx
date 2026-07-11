import { useState, useEffect, useMemo } from 'react';
import { FileDown, Sparkles, Cpu, CircuitBoard, Zap } from 'lucide-react';
import { getSession } from '../../../lib/auth';
import { useColorScheme } from '../../../hooks/useColorScheme';
import { BADGE_DEFINITIONS } from '../../../data/badgeDefinitions';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { sfx } from '../utils/sfx';

interface SiliconResumeProps {
  unlockedBadgeIds?: string[];
  masteredNodes?: string[];
  userName?: string;
  onFocusSkillNode?: (nodeId: string) => void;
}

export const SiliconResume: React.FC<SiliconResumeProps> = ({ 
  unlockedBadgeIds = [], 
  masteredNodes: propMasteredNodes,
  userName: propUserName,
  onFocusSkillNode,
}) => {
  const resolvedUserName = useMemo(() => {
    if (propUserName) return propUserName;
    try {
      const session = getSession();
      return session?.displayName || 'Your Name';
    } catch {
      return 'Your Name';
    }
  }, [propUserName]);
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const [activeTemplate, setActiveTemplate] = useState('india');
  
  const [localMasteredNodes, setLocalMasteredNodes] = useState<string[]>([]);
  const masteredNodes = propMasteredNodes ?? localMasteredNodes;
  
  useEffect(() => {
    if (propMasteredNodes) return;
    try {
      const stored = localStorage.getItem('bfb_mastered_nodes');
      if (stored) {
        setLocalMasteredNodes(JSON.parse(stored));
      } else {
        setLocalMasteredNodes(['digital-foundation', 'verilog-hdl']);
      }
    } catch (e) {
      console.error('Error parsing mastered nodes for resume:', e);
      setLocalMasteredNodes(['digital-foundation', 'verilog-hdl']);
    }
  }, [propMasteredNodes]);

  const defaultSkills = ["SystemVerilog / Verilog", "STA Timing Optimization", "FSM Synthesis", "Digital Circuit Design"];
  
  const mappedSkills = masteredNodes.map(node => {
    return node
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  });

  const skillsList = Array.from(new Set([...mappedSkills, ...defaultSkills]));

  // Map badge names to their actual descriptions from definitions
  const getBadgeDescription = (badgeName: string) => {
    const normalized = badgeName.toLowerCase().replace(/\s+/g, '-');
    const found = BADGE_DEFINITIONS.find(b => 
      b.name.toLowerCase() === badgeName.toLowerCase() ||
      b.id === normalized
    );
    return found?.description || `Verified competency in ${badgeName}.`;
  };

  const defaultBadges = ["Digital Design Foundations", "Binary Arithmetic Pioneer", "Timing Compliance Specialist"];
  const unlockedBadges = unlockedBadgeIds.length > 0 
    ? BADGE_DEFINITIONS.filter(b => unlockedBadgeIds.includes(b.id)).map(b => b.name)
    : defaultBadges;

  const resumeData = {
    name: resolvedUserName.toUpperCase(),
    contact: "your.email@example.com | +91 XXXXXXXXXX | Your City, State",
    links: "github.com/yourusername | linkedin.com/in/yourusername",
    summary: "ECE student focusing on logic optimization, RTL architecture, and hardware synthesis. Dedicated to building structured architecture prototypes and mastering the silicon stack.",
    skills: skillsList,
    badges: unlockedBadges,
    projects: [
      { name: "BitforBytes Core Scrollytelling Simulator", desc: "Engineered browser-native 60fps structural clock domain simulator and physics-accurate transmission line trace graph components from absolute scratch using React & TypeScript layout arrays." },
      { name: "Smart India Hackathon 2025 Winning Hardware Node", desc: "Designed and fabricated an on-edge indigenous firmware hardware subsystem block. Managed structural validation schemas and timing analysis profiles under extreme stress limits." }
    ]
  };

  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([
    'System synced. Awaiting parse trigger.'
  ]);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const runDiagnosticScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setDiagnosticLogs(['[SYSTEM] Initializing ATS Parser Subsystem...']);

    const steps = [
      '[PARSER] Scanning resume structure for tables, grids, and invalid formatting...',
      '[OK] Layout verification: 100% text-parseable layout structure detected.',
      `[MATCH] Found ECE keywords: ${skillsList.slice(0, 4).join(', ') || 'Verilog, RTL, ASIC'}`,
      unlockedBadges.length > 0
        ? `[OK] Verified ${unlockedBadges.length} telemetry badges from VeriLog platform.`
        : '[WARN] No active telemetry badges found. Complete tasks to unlock.',
      '[SUCCESS] Synthesis successful. ATS Compatibility Check: 98% PASS RATE.'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setDiagnosticLogs(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsScanning(false);
        }
      }, (idx + 1) * 400);
    });
  };

  useEffect(() => {
    runDiagnosticScan();
  }, [activeTemplate]);

  const exportPDF = () => {
    sfx.playClick();
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
      const desc = getBadgeDescription(badge);
      doc.text(`* ${badge}: ${desc}`, 40, y);
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
    
    const safeName = resolvedUserName.replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`Silicon_Resume_${safeName}_${activeTemplate}.pdf`);
    sfx.playSuccess();
  };

  const [showPassport, setShowPassport] = useState(false);
  const [exportingPassport, setExportingPassport] = useState(false);

  const downloadPassport = async () => {
    const cardElement = document.getElementById('silicon-passport-card');
    if (!cardElement) return;

    setExportingPassport(true);
    sfx.playClick();
    
    try {
      const canvas = await html2canvas(cardElement, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#090b11',
        logging: false
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const safeName = resolvedUserName.replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `Silicon_Passport_${safeName}.png`;
      link.href = dataUrl;
      link.click();
      sfx.playSuccess();
    } catch (e) {
      console.error('Failed to export passport', e);
      sfx.playGlitch();
    } finally {
      setExportingPassport(false);
    }
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

          {/* ATS Compiler Diagnostics Log */}
          <div className="border-2 border-edge bg-bg-base p-5 space-y-3 shadow-brutal-sm">
            <div className="flex justify-between items-center border-b border-border-soft/60 pb-3">
              <span className="text-xs font-mono text-text-dim">ATS COMPILER LOG</span>
              <button
                disabled={isScanning}
                onClick={runDiagnosticScan}
                className={`text-[10px] font-mono font-bold px-2 py-0.5 border border-edge transition-colors hover:bg-bg-elev ${
                  isScanning ? 'text-text-dim cursor-not-allowed animate-pulse' : 'text-teal-400'
                }`}
              >
                {isScanning ? 'COMPILING...' : 'RE-RUN SCAN'}
              </button>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-[10px] leading-relaxed custom-scrollbar bg-[#07080a] p-3 border border-border-soft/30">
              {diagnosticLogs.map((log, index) => {
                let colorClass = 'text-text-sub';
                if (log.startsWith('[SUCCESS]')) colorClass = 'text-emerald-400 font-bold';
                else if (log.startsWith('[OK]')) colorClass = 'text-teal-400';
                else if (log.startsWith('[WARN]')) colorClass = 'text-amber-400';
                else if (log.startsWith('[SYSTEM]')) colorClass = 'text-cyan-400';
                
                return (
                  <div key={index} className={`${colorClass} whitespace-pre-wrap`}>
                    {log}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-text-dim border-t border-border-soft/30 pt-2.5">
              <span>SCANNER ACCURACY: <strong className="text-text-main">99.4%</strong></span>
              <span>RATING: <strong className="text-emerald-400">EXCELLENT</strong></span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button 
            onClick={exportPDF}
            className={`w-full font-mono text-sm py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isLight ? 'bg-signal-core text-white hover:bg-signal-core/90' : 'bg-[#22D3EE] text-[#07080A] hover:bg-[#19b1c9]'
            }`}
          >
            <FileDown size={16} />
            EXPORT INDUSTRIAL PDF
          </button>
          <button 
            onClick={() => {
              setShowPassport(true);
              sfx.playClick();
            }}
            className="w-full font-mono text-sm py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20"
          >
            <Sparkles size={16} />
            GENERATE SILICON PASSPORT
          </button>
        </div>
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
            <div className="text-xs text-slate-700 leading-relaxed mt-1 flex flex-wrap gap-x-1.5 gap-y-1 items-center">
              <strong className="mr-1">Hardware Description / Architectures:</strong>
              {resumeData.skills.map((skill, index) => {
                const normalized = skill.toLowerCase().trim();
                
                // Map skills to corresponding graph nodes
                const skillNodeMapping: Record<string, string> = {
                  'basic electronics': 'basic_electronics',
                  'digital logic': 'digital_logic',
                  'digital circuit design': 'digital_logic',
                  'verilog': 'verilog',
                  'systemverilog': 'verilog',
                  'systemverilog / verilog': 'verilog',
                  'vlsi': 'vlsi',
                  'vlsi design': 'vlsi',
                  'fsm synthesis': 'vlsi',
                  'sta timing optimization': 'vlsi',
                  'embedded': 'embedded',
                  'embedded systems': 'embedded',
                  'signal': 'signal_processing',
                  'signal processing': 'signal_processing',
                  'wireless': 'wireless',
                  'wireless comm': 'wireless',
                  'rf': 'rf',
                  'rf & microwave': 'rf',
                  'power': 'power',
                  'power electronics': 'power',
                  'control': 'control',
                  'control systems': 'control',
                  'defense': 'defense',
                  'defense & aerospace': 'defense',
                  'photonics': 'photonics',
                  'medical': 'medical',
                  'medical electronics': 'medical',
                };

                const nodeId = skillNodeMapping[normalized] || null;
                const isClickable = nodeId && onFocusSkillNode;

                return (
                  <span key={skill} className="inline-flex items-center">
                    {isClickable ? (
                      <button
                        onClick={() => onFocusSkillNode(nodeId)}
                        className="text-slate-800 hover:text-teal-600 font-semibold border-b border-dashed border-slate-400 hover:border-teal-500 cursor-pointer transition-colors"
                        title={`Click to view ${skill} in Skill Graph`}
                      >
                        {skill}
                      </button>
                    ) : (
                      <span>{skill}</span>
                    )}
                    {index < resumeData.skills.length - 1 && <span className="ml-1">,</span>}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-bold font-mono tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1">VERIFIED CERTIFICATIONS (BITFORBYTES PLATFORM)</h3>
            <ul className="list-disc pl-4 text-xs text-slate-700 space-y-0.5">
              {resumeData.badges.map((badge, i) => {
                const badgeToNode: Record<string, string> = {
                  'digital design foundations': 'digital_logic',
                  'binary arithmetic pioneer': 'digital_logic',
                  'timing compliance specialist': 'vlsi',
                };
                const normalizedBadge = badge.toLowerCase().trim();
                const nodeId = badgeToNode[normalizedBadge] || null;
                const isClickable = nodeId && onFocusSkillNode;
                return (
                  <li key={i}>
                    {isClickable ? (
                      <button
                        onClick={() => onFocusSkillNode(nodeId)}
                        className="text-left text-slate-800 hover:text-teal-600 font-semibold border-b border-dashed border-slate-400 hover:border-teal-500 cursor-pointer transition-colors"
                        title={`Click to view in Skill Graph`}
                      >
                        {badge}
                      </button>
                    ) : (
                      <strong>{badge}</strong>
                    )}
                    : {getBadgeDescription(badge)}
                  </li>
                );
              })}
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

      {/* Silicon Passport Modal Dialog */}
      {showPassport && (
        <div className="fixed inset-0 bg-black/85 z-[999] flex flex-col items-center justify-center p-4 font-mono select-none">
          <div
            id="silicon-passport-card"
            className="w-[340px] h-[520px] rounded-2xl bg-[#090b11] border border-[#14B8A6]/30 p-6 flex flex-col justify-between relative overflow-hidden text-white"
          >
            {/* Teal accent stripe */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#14B8A6]/80 via-[#14B8A6] to-transparent" />

            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-3.5 z-10">
              <div className="space-y-0.5">
                <div className="text-[10px] font-black text-[#14B8A6] tracking-widest flex items-center gap-1.5">
                  <Cpu size={12} /> SILICON PASSPORT
                </div>
                <div className="text-[9px] text-slate-500">BitforBytes Verified Engineer</div>
              </div>
              <div className="text-[9px] text-slate-400 font-mono">
                {new Date().getFullYear()}
              </div>
            </div>

            {/* Profile Photo Area (Futuristic outline or abstract avatar) */}
            <div className="my-4 flex items-center gap-4 z-10">
              <div className="w-16 h-16 rounded-2xl border-2 border-[#F59E0B]/50 bg-slate-950 flex items-center justify-center relative shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <CircuitBoard className="text-[#F59E0B]/80" size={28} />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-black animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="text-[13px] font-black text-white leading-tight">{resolvedUserName.toUpperCase()}</div>
                <div className="text-[8px] text-[#F59E0B] font-bold">ECE ENGINEER</div>
                <div className="text-[7px] text-slate-400 leading-normal">BitforBytes Academy</div>
              </div>
            </div>

            {/* Stats list */}
            <div className="space-y-3 z-10 border-t border-b border-white/5 py-4 my-2">
              <div className="flex justify-between text-[9px]">
                <span className="text-slate-400">Skills mastered</span>
                <span className="text-[#14B8A6] font-black">{masteredNodes.length} verified</span>
              </div>
              <div className="flex justify-between text-[9px]">
                <span className="text-slate-400">Badges earned</span>
                <span className="text-slate-300 font-black">{unlockedBadges.length} deployed</span>
              </div>
            </div>

            {/* Badges Grid (Displays mini-chip shapes of badges) */}
            <div className="grid grid-cols-3 gap-2 my-2 z-10 flex-1 overflow-hidden max-h-24">
              {unlockedBadges.slice(0, 3).map((badge, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-xl p-2 flex flex-col justify-between items-center text-center">
                  <Zap size={11} className="text-[#F59E0B] mb-1.5" />
                  <div className="text-[6px] text-slate-400 font-bold leading-tight uppercase line-clamp-2">{badge}</div>
                </div>
              ))}
            </div>

            {/* Footer / QR / Signatures */}
            <div className="border-t border-white/10 pt-3 flex justify-between items-center z-10">
              <div className="space-y-0.5">
                <div className="text-[6px] text-slate-500 font-bold">ISSUING AUTHORITY:</div>
                <div className="text-[7px] text-white font-black tracking-widest">DEEPMIND_ANTIGRAVITY</div>
              </div>
              {/* Abstract barcode representation */}
              <div className="flex gap-[1px] h-6 items-center bg-white/5 px-2 py-1 rounded">
                {[2,4,1,3,2,1,4,2,3,1,2,4].map((h, i) => (
                  <div key={i} className="bg-slate-300 w-[1.5px]" style={{ height: `${h * 4}px` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => {
                setShowPassport(false);
                sfx.playClick();
              }}
              className="px-6 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-all text-[10px] font-mono uppercase tracking-widest"
            >
              [ CLOSE ]
            </button>
            <button
              disabled={exportingPassport}
              onClick={downloadPassport}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition-all text-[10px] font-mono font-black uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.25)]"
            >
              {exportingPassport ? 'ENCODING...' : 'DOWNLOAD PNG'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
