import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, GitCompare, X } from 'lucide-react';
import { DOMAINS, Domain } from '../data/domains';
import { DomainCard } from './DomainCard';
import { DomainDetailModal } from './DomainDetailModal';
import { useCompass } from '../hooks/useCompass';
import { cn } from '../utils/cn';
import { AnimatePresence, motion } from 'framer-motion';

export const DomainExplorer: React.FC = () => {
  const { result: compassResult } = useCompass();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HIGH DEMAND' | 'GROWING' | 'INDIA HOT' | 'HARD' | 'MODERATE'>('ALL');
  const [sortBy, setSortBy] = useState<'salary' | 'demand' | 'difficulty'>('salary');
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [comparingIds, setComparingIds] = useState<string[]>([]);

  const filteredDomains = useMemo(() => {
    let results = DOMAINS.filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (activeFilter !== 'ALL') {
      if (activeFilter === 'HIGH DEMAND') results = results.filter(d => d.demand === 'High');
      if (activeFilter === 'GROWING') results = results.filter(d => d.demand === 'Growing');
      if (activeFilter === 'INDIA HOT') results = results.filter(d => d.indiaHot);
      if (activeFilter === 'HARD') results = results.filter(d => d.difficulty === 'Hard');
      if (activeFilter === 'MODERATE') results = results.filter(d => d.difficulty === 'Moderate');
    }

    results.sort((a, b) => {
      if (sortBy === 'salary') return b.salary.senior - a.salary.senior;
      if (sortBy === 'demand') {
        const priority = { 'High': 3, 'Growing': 2, 'Medium': 1 };
        return priority[b.demand] - priority[a.demand];
      }
      if (sortBy === 'difficulty') {
        const priority = { 'Hard': 3, 'Moderate': 2, 'Easy': 1 };
        return priority[b.difficulty] - priority[a.difficulty];
      }
      return 0;
    });

    return results;
  }, [searchQuery, activeFilter, sortBy]);

  const handleToggleCompare = (id: string) => {
    if (comparingIds.includes(id)) {
      setComparingIds(comparingIds.filter(cid => cid !== id));
    } else if (comparingIds.length < 2) {
      setComparingIds([...comparingIds, id]);
    }
  };

  return (
    <section id="domain-explorer" className="py-24 px-6 sm:px-12 bg-black border-y border-white/[0.03]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tighter uppercase">
            Domain Explorer
          </h2>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Navigate the 13 Silicon Specializations
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white/[0.02] border border-white/10 p-4 rounded-2xl">
          {/* Search */}
          <div className="relative w-full lg:w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="SEARCH DOMAINS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D0F12] border border-white/[0.08] rounded-lg py-2.5 pl-10 pr-4 text-white font-mono text-xs focus:border-cyan-400/50 outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            {['ALL', 'HIGH DEMAND', 'GROWING', 'INDIA HOT', 'HARD', 'MODERATE'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={cn(
                  "px-4 py-2 rounded-full font-mono text-[10px] tracking-widest border transition-all whitespace-nowrap",
                  activeFilter === filter 
                    ? "bg-cyan-400 border-cyan-400 text-[#020408] font-bold" 
                    : "bg-transparent border-white/[0.10] text-slate-500 hover:text-white hover:border-white/20"
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Sort & Compare */}
          <div className="flex items-center gap-4 w-full lg:w-auto border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
            <div className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors cursor-pointer group">
              <ArrowUpDown size={14} />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[10px] font-mono font-bold uppercase tracking-widest outline-none cursor-pointer"
              >
                <option value="salary">SORT: SALARY ↓</option>
                <option value="demand">SORT: DEMAND</option>
                <option value="difficulty">SORT: DIFFICULTY</option>
              </select>
            </div>

            <div className="h-4 w-px bg-white/10 mx-2" />

            <button 
              disabled={comparingIds.length === 0}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[10px] font-bold uppercase tracking-widest transition-all",
                comparingIds.length === 2 
                  ? "bg-cyan-400 text-[#020408] animate-pulse" 
                  : comparingIds.length === 1 
                    ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                    : "bg-white/5 text-slate-600 cursor-not-allowed"
              )}
            >
              <GitCompare size={14} />
              COMPARE ({comparingIds.length}/2)
            </button>
          </div>
        </div>

        {/* Grid */}
        {filteredDomains.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredDomains.map((domain) => (
                <DomainCard 
                  key={domain.id} 
                  domain={domain} 
                  isCompassMatch={compassResult?.primary === domain.id}
                  onSelect={setSelectedDomain}
                  onCompare={handleToggleCompare}
                  isComparing={comparingIds.includes(domain.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-24 text-center space-y-4">
            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">No domains match your search parameters</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveFilter('ALL'); }}
              className="text-cyan-400 font-mono text-xs hover:underline uppercase"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedDomain && (
            <DomainDetailModal 
              domain={selectedDomain} 
              onClose={() => setSelectedDomain(null)} 
            />
          )}
        </AnimatePresence>

        {/* Comparison Tray (Sticky bottom of section) */}
        <AnimatePresence>
          {comparingIds.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="sticky bottom-8 z-50 mx-auto w-full max-w-2xl"
            >
               <div className="bg-[#0D0F12]/95 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-4 shadow-2xl flex items-center justify-between">
                  <div className="flex gap-4">
                    {comparingIds.map(id => (
                      <div key={id} className="flex items-center gap-2 px-3 py-1.5 bg-cyan-400/10 border border-cyan-400/20 rounded-lg">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                          {DOMAINS.find(d => d.id === id)?.name}
                        </span>
                        <X 
                          size={12} 
                          className="text-cyan-400 cursor-pointer hover:text-white" 
                          onClick={() => handleToggleCompare(id)}
                        />
                      </div>
                    ))}
                    {comparingIds.length < 2 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 border border-dashed border-white/20 rounded-lg text-slate-500 italic text-[10px] font-mono">
                        + ADD SECOND DOMAIN
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setComparingIds([])}
                      className="text-[9px] font-mono text-slate-500 hover:text-white uppercase tracking-widest"
                    >
                      CLEAR ALL
                    </button>
                    {comparingIds.length === 2 && (
                      <button className="px-4 py-2 bg-cyan-400 text-[#020408] font-bold text-[10px] font-mono uppercase rounded-lg hover:bg-white transition-colors">
                        COMPARE NOW →
                      </button>
                    )}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
