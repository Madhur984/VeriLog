import React, { useState, useEffect } from 'react';
import { Moon, Sun, Copy, Check, LayoutGrid, BookOpen, ClipboardList, ChevronsRight } from 'lucide-react';

export const ModuleTwo: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Sidebar state
  const [primaryTab, setPrimaryTab] = useState('All');
  const [secondaryItem, setSecondaryItem] = useState(0);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const verilogCode = `// Simple ADC (Analog to Digital) Interface Mockup
module adc_interface (
    input  wire clk,
    input  wire rst_n,
    input  wire analog_cmp_in,  // From analog comparator
    output reg  [7:0] digital_out
);

    reg [7:0] counter;

    // A simple tracking ADC logic using a counter
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            digital_out <= 8'b0;
            counter <= 8'b0;
        end else begin
            // If analog input is higher, count up, else count down
            if (analog_cmp_in)
                counter <= counter + 1;
            else
                counter <= counter - 1;
                
            digital_out <= counter;
        end
    end

endmodule`;

  const handleCopy = () => {
    navigator.clipboard.writeText(verilogCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const primaryTabs = [
    { id: 'All', icon: LayoutGrid, label: 'All' },
    { id: 'Articles', icon: BookOpen, label: 'Articles' },
    { id: 'Quiz', icon: ClipboardList, label: 'Quiz' },
  ];

  const articles = [
    { id: 0, title: 'Signal Domains: Analog vs Digital', date: '2026-04-09' },
    { id: 1, title: 'The Nyquist-Shannon Theorem', date: '2025-08-14' },
    { id: 2, title: 'Handling Signal Noise & Regeneration', date: '2025-10-02' },
    { id: 3, title: 'Interfacing Analog with FPGAs', date: '2025-11-21' },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black text-gray-200 font-sans">
      
      {/* 1. Primary Sidebar (Leftmost) */}
      <div className="w-[84px] flex-shrink-0 bg-black border-r border-orange-900/30 flex flex-col justify-between py-6 z-20">
        <div className="flex flex-col gap-4 items-center">
          {primaryTabs.map((tab) => {
            const isActive = primaryTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setPrimaryTab(tab.id)}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-orange-950/40 border border-orange-500/50 text-orange-500' 
                    : 'text-gray-500 hover:text-orange-400 hover:bg-orange-950/20'
                }`}
              >
                <Icon size={22} className="mb-1" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[11px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="flex flex-col items-center">
          <button className="flex flex-col items-center justify-center w-16 h-16 rounded-xl text-gray-500 hover:text-orange-400 hover:bg-orange-950/20 transition-all">
            <ChevronsRight size={24} className="mb-1" />
            <span className="text-[11px] font-medium">Next Track</span>
          </button>
        </div>
      </div>

      {/* 2. Secondary Sidebar (List items) */}
      <div className="w-[340px] flex-shrink-0 bg-[#050505] border-r border-orange-900/30 flex flex-col z-10 box-border overflow-y-auto">
        <div className="p-5 border-b border-orange-900/30">
          <h2 className="text-xl font-semibold text-gray-100">{primaryTab} ({articles.length})</h2>
        </div>
        
        <div className="flex flex-col">
          {articles.map((article) => {
            const isActive = secondaryItem === article.id;
            return (
              <button
                key={article.id}
                onClick={() => setSecondaryItem(article.id)}
                className={`text-left border-b border-orange-900/20 p-4 transition-colors relative flex flex-col gap-2 ${
                  isActive 
                    ? 'bg-orange-950/30 hover:bg-orange-950/50' 
                    : 'bg-transparent hover:bg-orange-950/10'
                }`}
              >
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    isActive ? 'bg-orange-500' : 'bg-transparent'
                  }`} 
                />
                <h3 className={`font-medium line-clamp-1 pr-2 ${isActive ? 'text-orange-50' : 'text-gray-400'}`}>
                  {article.title}
                </h3>
                <div className={`flex items-center gap-1.5 text-xs ${isActive ? 'text-orange-400' : 'text-gray-600'}`}>
                  <BookOpen size={13} />
                  <span>Last Updated: {article.date}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Content Area (Right) */}
      <div className="flex-1 h-full overflow-y-auto relative bg-[#030303]">
        <div className={`min-h-full font-sans transition-colors duration-300 pb-20 ${isDarkMode ? 'bg-[#030303] text-gray-300' : 'bg-[#fff5ee] text-[#1a0f00]'}`}>
          {/* Navigation inside content area */}
          <nav className={`sticky top-0 z-50 px-8 py-4 flex justify-between items-center border-b transition-colors duration-300 shadow-sm ${isDarkMode ? 'bg-[#030303]/90 backdrop-blur-md border-orange-900/30' : 'bg-[#fff5ee]/90 backdrop-blur-md border-orange-200'}`}>
            <div className="font-mono font-semibold text-lg text-orange-500">
              {articles.find(a => a.id === secondaryItem)?.title || 'module/2'}
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm transition-colors ${
                isDarkMode 
                  ? 'bg-transparent border-orange-900/50 hover:bg-orange-900/30 text-orange-200' 
                  : 'bg-transparent border-orange-300 hover:bg-orange-100 text-orange-800'
              }`}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </nav>

          {/* Main Document Content */}
          <main className="max-w-5xl mx-auto px-8 py-16">
            
            {/* Hero Section */}
            <section className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-center text-orange-500">Signal <span className="text-orange-800 font-light">—</span> Domains</h1>
              <p className={`text-xl max-w-2xl mx-auto text-center ${isDarkMode ? 'text-orange-200/60' : 'text-orange-900/70'}`}>
                Bridging the physical world and digital logic. Understanding how continuous analog signals are sampled and quantized for FPGA processing.
              </p>
            </section>

            {/* Key Concepts Grid */}
            <section className="mb-20">
              <h2 className={`text-3xl font-semibold mb-8 pb-3 border-b ${isDarkMode ? 'border-orange-900/30 text-orange-400' : 'border-orange-200 text-orange-600'}`}>Key Concepts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Analog Signals",
                    desc: "Continuous waveforms representing physical phenomena (voltage, sound). Susceptible to noise and degradation."
                  },
                  {
                    title: "Digital Signals",
                    desc: "Discrete binary values (0s and 1s). Highly resilient to noise, forming the absolute foundation of Verilog logic."
                  },
                  {
                    title: "Nyquist Sampling",
                    desc: "To perfectly reconstruct a continuous signal, the sampling rate must be at least twice the maximum frequency of the signal."
                  },
                  {
                    title: "Signal Regeneration",
                    desc: "Using logical thresholds and Schmitt triggers to clean up noisy inputs and restore crisp digital edges."
                  }
                ].map((concept, idx) => (
                  <div 
                    key={idx}
                    className={`p-6 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                      isDarkMode 
                        ? 'bg-[#080503] border-orange-900/40 shadow-black hover:border-orange-500/50' 
                        : 'bg-white border-orange-200 shadow-sm hover:border-orange-400'
                    }`}
                  >
                    <h3 className={`font-mono text-lg mb-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>{concept.title}</h3>
                    <p className="text-sm md:text-base leading-relaxed opacity-90">{concept.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Comparison Table */}
            <section className="mb-20">
              <h2 className={`text-3xl font-semibold mb-8 pb-3 border-b ${isDarkMode ? 'border-orange-900/30 text-orange-400' : 'border-orange-200 text-orange-600'}`}>Analog vs Digital</h2>
              <div className="overflow-x-auto rounded-xl border border-orange-900/30 dark:border-orange-900/30">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={isDarkMode ? 'bg-[#0a0502]' : 'bg-orange-50'}>
                      <th className={`p-4 font-semibold border-b ${isDarkMode ? 'border-orange-900/30' : 'border-orange-200'}`}>Characteristic</th>
                      <th className={`p-4 font-semibold border-b ${isDarkMode ? 'border-orange-900/30' : 'border-orange-200'}`}>Analog</th>
                      <th className={`p-4 font-semibold border-b ${isDarkMode ? 'border-orange-900/30' : 'border-orange-200'}`}>Digital</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-900/20 dark:divide-orange-900/30">
                    <tr className={`transition-colors ${isDarkMode ? 'hover:bg-[#0f0703]' : 'hover:bg-orange-100/50'}`}>
                      <td className="p-4 font-medium">Representation</td>
                      <td className="p-4">Continuous values (e.g., 0V to 3.3V curve)</td>
                      <td className="p-4">Discrete states (0 or 1)</td>
                    </tr>
                    <tr className={`transition-colors ${isDarkMode ? 'hover:bg-[#0f0703]' : 'hover:bg-orange-100/50'}`}>
                      <td className="p-4 font-medium">Noise Immunity</td>
                      <td className="p-4">Low - Noise directly degrades accuracy</td>
                      <td className="p-4">High - Noise ignored if below thresholds</td>
                    </tr>
                    <tr className={`transition-colors ${isDarkMode ? 'hover:bg-[#0f0703]' : 'hover:bg-orange-100/50'}`}>
                      <td className="p-4 font-medium">Processing</td>
                      <td className="p-4">Op-amps, filters, inductors</td>
                      <td className="p-4">Logic gates, flip-flops, FPGAs</td>
                    </tr>
                    <tr className={`transition-colors ${isDarkMode ? 'hover:bg-[#0f0703]' : 'hover:bg-orange-100/50'}`}>
                      <td className="p-4 font-medium">Verilog Support</td>
                      <td className="p-4">Requires Verilog-AMS (Analog Mixed Signal)</td>
                      <td className="p-4">Native to standard Verilog</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Code Example Section */}
            <section className="mb-16">
              <h2 className={`text-3xl font-semibold mb-6 pb-3 border-b ${isDarkMode ? 'border-orange-900/30 text-orange-400' : 'border-orange-200 text-orange-600'}`}>Code Example</h2>
              <p className="mb-6 text-lg opacity-90 leading-relaxed">
                In real hardware, converting analog signals to digital format requires sampling. Below is a simplified mock module of a <strong>tracking Analog-to-Digital Converter (ADC)</strong> implemented in Verilog. It receives a fast digital pulse from a continuous analog comparator.
              </p>

              <div className="rounded-xl overflow-hidden border border-orange-900/40 shadow-2xl shadow-orange-900/20">
                <div className="flex justify-between items-center px-4 py-2 bg-[#0a0502] text-orange-500/70 border-b border-orange-900/40 text-sm font-mono">
                  <span>adc_tracker.v</span>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 hover:text-orange-400 transition-colors px-2.5 py-1 rounded bg-[#0f0703] hover:bg-orange-950/50 border border-orange-900/40"
                  >
                    {copied ? <Check size={14} className="text-orange-500" /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy code'}
                  </button>
                </div>
                <div className="relative">
                  <pre className="p-6 overflow-x-auto bg-[#030100] text-orange-100 text-sm md:text-base font-mono leading-relaxed">
                    <code>
<span className="text-orange-700 italic">// Simple ADC (Analog to Digital) Interface Mockup</span>
{'\n'}
<span className="text-orange-500">module</span> <span className="text-[#ffb74d]">adc_interface</span> (
{'\n'}
    <span className="text-orange-500">input</span>  <span className="text-orange-300">wire</span> clk,
{'\n'}
    <span className="text-orange-500">input</span>  <span className="text-orange-300">wire</span> rst_n,
{'\n'}
    <span className="text-orange-500">input</span>  <span className="text-orange-300">wire</span> analog_cmp_in,  <span className="text-orange-700 italic">// From analog comparator</span>
{'\n'}
    <span className="text-orange-500">output</span> <span className="text-orange-500">reg</span>  [<span className="text-orange-400">7</span>:<span className="text-orange-400">0</span>] digital_out
{'\n'}
);
{'\n\n'}
    <span className="text-orange-500">reg</span> [<span className="text-orange-400">7</span>:<span className="text-orange-400">0</span>] counter;
{'\n\n'}
    <span className="text-orange-700 italic">// A simple tracking ADC logic using a counter</span>
{'\n'}
    <span className="text-orange-500">always</span> @(<span className="text-orange-500">posedge</span> clk <span className="text-orange-500">or</span> <span className="text-orange-500">negedge</span> rst_n) <span className="text-orange-500">begin</span>
{'\n'}
        <span className="text-orange-500">if</span> (!rst_n) <span className="text-orange-500">begin</span>
{'\n'}
            digital_out &lt;= <span className="text-orange-400">8'b0</span>;
{'\n'}
            counter &lt;= <span className="text-orange-400">8'b0</span>;
{'\n'}
        <span className="text-orange-500">end else begin</span>
{'\n'}
            <span className="text-orange-700 italic">// If analog input is higher, count up, else count down</span>
{'\n'}
            <span className="text-orange-500">if</span> (analog_cmp_in)
{'\n'}
                counter &lt;= counter + <span className="text-orange-400">1</span>;
{'\n'}
            <span className="text-orange-500">else</span>
{'\n'}
                counter &lt;= counter - <span className="text-orange-400">1</span>;
{'\n'}
                
{'\n'}
            digital_out &lt;= counter;
{'\n'}
        <span className="text-orange-500">end</span>
{'\n'}
    <span className="text-orange-500">end</span>
{'\n\n'}
<span className="text-orange-500">endmodule</span>
                    </code>
                  </pre>
                </div>
              </div>
            </section>

            {/* Simulation Output */}
            <section className="mb-20">
              <h2 className={`text-2xl font-semibold mb-6 pb-3 border-b ${isDarkMode ? 'border-orange-900/30 text-orange-400' : 'border-orange-200 text-orange-600'}`}>Quantization Results</h2>
              <p className="mb-4 opacity-90 text-lg">In real-world tracking ADCs, the counter constantly hunts the analog value creating discrete digital output changes:</p>
              <div className="bg-[#050200] p-6 rounded-xl border border-orange-900/50 shadow-inner font-mono text-orange-400 text-sm md:text-base whitespace-pre-wrap leading-relaxed inline-block">
                {`Time | clk | cmp_in | digital_out
--------------------------------
  10 |  1  |   1    |   00000001
  20 |  1  |   1    |   00000010
  30 |  1  |   1    |   00000011
  40 |  1  |   0    |   00000010 // Signal dropping`}
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};
