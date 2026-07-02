import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, GitCompare, X } from 'lucide-react';
import { DOMAINS, Domain } from '../data/domains';
import { DomainCard } from './DomainCard';
import { DomainDetailModal } from './DomainDetailModal';
import { useCompass } from '../hooks/useCompass';
import { useColorScheme } from '../hooks/useColorScheme';
import { cn } from '../utils/cn';
import { AnimatePresence, motion } from 'framer-motion';

interface DomainExplorerProps {
  comparingIds?: string[];
  onToggleCompare?: (id: string) => void;
  onClearCompare?: () => void;
  onOpenInTopology?: (domainId: string) => void;
}

export const DomainExplorer: React.FC<DomainExplorerProps> = ({
  comparingIds: propComparingIds,
  onToggleCompare,
  onClearCompare,
  onOpenInTopology,
}) => {
  const { result: compassResult } = useCompass();
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HIGH DEMAND' | 'GROWING' | 'INDIA HOT' | 'HARD' | 'MODERATE'>('ALL');
  const [sortBy, setSortBy] = useState<'salary' | 'demand' | 'difficulty'>('salary');
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  
  const [localComparingIds, setLocalComparingIds] = useState<string[]>([]);
  const comparingIds = propComparingIds ?? localComparingIds;

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
    if (onToggleCompare) {
      onToggleCompare(id);
    } else {
      if (comparingIds.includes(id)) {
        setLocalComparingIds(comparingIds.filter(cid => cid !== id));
      } else if (comparingIds.length < 2) {
        setLocalComparingIds([...comparingIds, id]);
      }
    }
  };

  const handleClearCompare = () => {
    if (onClearCompare) {
      onClearCompare();
    } else {
      setLocalComparingIds([]);
    }
  };

  return (
    <section id="domain-explorer" className={cn("py-24 px-6 sm:px-12 border-y transition-colors duration-300", isLight ? "bg-bg-void border-border-soft" : "bg-black border-white/[0.03]")}>
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="space-y-4">
          <h2 className={cn("text-4xl sm:text-5xl font-extrabold tracking-tighter uppercase", isLight ? "text-text-main" : "text-white")}>
            Domain Explorer
          </h2>
          <p className={cn("font-mono text-sm tracking-widest uppercase", isLight ? "text-text-dim" : "text-slate-500")}>
            Navigate the 13 Silicon Specializations
          </p>
        </div>

        {/* Toolbar */}
        <div className={cn("flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between border p-4 rounded-2xl transition-colors", isLight ? "bg-bg-base border-border-soft" : "bg-white/[0.02] border-white/10")}>
          {/* Search */}
          <div className="relative w-full lg:w-[280px]">
            <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2", isLight ? "text-text-dim" : "text-slate-500")} size={14} />
            <label htmlFor="domain-search" className="sr-only">Search domains</label>
            <input 
              id="domain-search"
              type="text" 
              placeholder="SEARCH DOMAINS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn("w-full rounded-lg py-2.5 pl-10 pr-4 font-mono text-xs outline-none transition-all", isLight ? "bg-bg-elev border border-border-soft text-text-main placeholder:text-text-dim focus:border-cyan-600" : "bg-[#0D0F12] border border-white/[0.08] text-white placeholder:text-slate-600 focus:border-cyan-400/50")}
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
                    ? (isLight ? "bg-cyan-600 border-cyan-600 text-white font-bold" : "bg-cyan-400 border-cyan-400 text-[#020408] font-bold") 
                    : (isLight ? "bg-transparent border-border-soft text-text-dim hover:text-text-main hover:border-text-dim" : "bg-transparent border-white/[0.10] text-slate-500 hover:text-white hover:border-white/20")
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Sort & Compare */}
          <div className={cn("flex items-center gap-4 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0", isLight ? "border-border-soft" : "border-white/5")}>
            <div className={cn("flex items-center gap-2 transition-colors cursor-pointer group", isLight ? "text-text-dim hover:text-text-main" : "text-slate-500 hover:text-white")}>
              <ArrowUpDown size={14} />
              <label htmlFor="domain-sort" className="sr-only">Sort domains by</label>
              <select 
                id="domain-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={cn("bg-transparent text-[10px] font-mono font-bold uppercase tracking-widest outline-none cursor-pointer", isLight ? "text-text-main" : "text-white")}
              >
                <option value="salary" className={isLight ? "bg-bg-elev text-text-main" : "bg-[#0D0F12] text-white"}>SORT: SALARY ↓</option>
                <option value="demand" className={isLight ? "bg-bg-elev text-text-main" : "bg-[#0D0F12] text-white"}>SORT: DEMAND</option>
                <option value="difficulty" className={isLight ? "bg-bg-elev text-text-main" : "bg-[#0D0F12] text-white"}>SORT: DIFFICULTY</option>
              </select>
            </div>

            <div className={cn("h-4 w-px mx-2", isLight ? "bg-border-soft" : "bg-white/10")} />

            <button 
              disabled={comparingIds.length === 0}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[10px] font-bold uppercase tracking-widest transition-all",
                comparingIds.length === 2 
                  ? (isLight ? "bg-cyan-600 text-white animate-pulse" : "bg-cyan-400 text-[#020408] animate-pulse") 
                  : comparingIds.length === 1 
                    ? (isLight ? "bg-cyan-600/10 text-cyan-700 border border-cyan-600/30" : "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30")
                    : (isLight ? "bg-bg-base text-text-dim border border-border-soft cursor-not-allowed" : "bg-white/5 text-slate-600 cursor-not-allowed")
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
            <p className={cn("font-mono text-sm uppercase tracking-widest", isLight ? "text-text-dim" : "text-slate-500")}>No domains match your search parameters</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveFilter('ALL'); }}
              className={cn("font-mono text-xs hover:underline uppercase", isLight ? "text-cyan-600" : "text-cyan-400")}
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
              onOpenInTopology={(domainId) => {
                if (onOpenInTopology) {
                  onOpenInTopology(domainId);
                }
                setSelectedDomain(null);
              }}
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
               <div className={cn("rounded-2xl p-3 sm:p-4 shadow-brutal-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 justify-between border-2 border-edge", isLight ? "bg-bg-elev" : "bg-bg-elev")}>
                  <div className="flex flex-wrap gap-2 sm:gap-4">
                    {comparingIds.map(id => (
                      <div key={id} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg min-w-0 border", isLight ? "bg-cyan-600/10 border-cyan-600/20" : "bg-cyan-400/10 border-cyan-400/20")}>
                        <span className={cn("text-[10px] font-mono font-bold uppercase truncate max-w-[120px]", isLight ? "text-cyan-700" : "text-cyan-400")}>
                          {DOMAINS.find(d => d.id === id)?.name}
                        </span>
                        <X
                          size={12}
                          className={cn("cursor-pointer shrink-0", isLight ? "text-cyan-700 hover:text-text-main" : "text-cyan-400 hover:text-white")}
                          onClick={() => handleToggleCompare(id)}
                        />
                      </div>
                    ))}
                    {comparingIds.length < 2 && (
                      <div className={cn("flex items-center gap-2 px-3 py-1.5 border border-dashed rounded-lg italic text-[10px] font-mono", isLight ? "border-border-soft text-text-dim" : "border-white/20 text-slate-500")}>
                        + ADD SECOND DOMAIN
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <button
                      onClick={handleClearCompare}
                      className={cn("text-[9px] font-mono uppercase tracking-widest py-2", isLight ? "text-text-dim hover:text-text-main" : "text-slate-500 hover:text-white")}
                    >
                      CLEAR ALL
                    </button>
                    {comparingIds.length === 2 && (
                      <button className={cn("px-4 py-2 font-bold text-[10px] font-mono uppercase rounded-lg transition-colors", isLight ? "bg-cyan-600 text-white hover:bg-cyan-700" : "bg-cyan-400 text-[#020408] hover:bg-white")}>
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
