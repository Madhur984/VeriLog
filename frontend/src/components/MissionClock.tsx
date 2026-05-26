import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, X } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import { useMultiClock, MissionClockData } from '../hooks/useMultiClock';

const PRESETS: Omit<MissionClockData, 'id'>[] = [
  { examName: 'GATE 2027', targetDate: '2027-02-07T09:00:00+05:30', notes: "India's gateway to PSUs and IITs.", color: 'cyan' },
  { examName: 'BARC OCES', targetDate: '2027-03-31T23:59:59+05:30', notes: 'DAE stipendiary traineeship — ₹32K/month', color: 'amber' },
  { examName: 'ISRO Scientist', targetDate: '2027-01-15T23:59:59+05:30', notes: 'Research Scientist entry point.', color: 'copper' },
  { examName: 'Campus Placement', targetDate: '2026-08-01T09:00:00+05:30', notes: 'Dream company target.', color: 'green' },
];

export const MissionClock: React.FC = () => {
  const { clocks, updateClock, addClock, removeClock } = useMultiClock();
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {clocks.map(clock => (
          <ClockCard 
            key={clock.id} 
            clock={clock} 
            isEditing={editingId === clock.id}
            onEdit={() => setEditingId(clock.id)}
            onCancel={() => setEditingId(null)}
            onUpdate={(data) => {
              updateClock(clock.id, data);
              setEditingId(null);
            }}
            onRemove={() => removeClock(clock.id)}
          />
        ))}
      </AnimatePresence>

      {clocks.length < 3 && (
        <button
          onClick={() => addClock(PRESETS[0])}
          className="w-full py-4 border border-dashed border-white/10 rounded-xl text-slate-500 font-mono text-[10px] uppercase tracking-widest hover:border-cyan-400/30 hover:text-cyan-400 transition-all"
        >
          + Add Mission Target
        </button>
      )}
    </div>
  );
};

const ClockCard = React.forwardRef<HTMLDivElement, { 
  clock: MissionClockData; 
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onUpdate: (data: Partial<MissionClockData>) => void;
  onRemove: () => void;
}>(({ clock, isEditing, onEdit, onCancel, onUpdate, onRemove }, ref) => {
  const timeLeft = useCountdown(clock.targetDate);
  const [formData, setFormData] = useState(clock);

  const colors = {
    cyan: 'text-cyan-400 bg-cyan-400',
    amber: 'text-amber-400 bg-amber-400',
    copper: 'text-orange-500 bg-orange-500',
    green: 'text-emerald-400 bg-emerald-400',
  };

  if (isEditing) {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="p-6 bg-observatory-surface border border-white/[0.08] rounded-2xl space-y-4"
      >
        {/* ... rest of editing UI ... */}
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Set Mission Target</h4>
          <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Quick Presets */}
          <div>
            <label className="text-[9px] font-mono text-slate-500 uppercase block mb-3">Quick Load Presets</label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(p => (
                <button
                  key={p.examName}
                  onClick={() => setFormData({ ...p, id: formData.id })}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-mono text-slate-400 hover:border-cyan-400/50 hover:text-white transition-all"
                >
                  {p.examName}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/5" />

          <div className="space-y-4">
            <div>
              <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1.5">Mission Name</label>
              <input 
                type="text" 
                placeholder="e.g. NVIDIA Interview"
                value={formData.examName}
                onChange={e => setFormData({ ...formData, examName: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cyan-400/50 outline-none transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1.5">Target Date</label>
                <input 
                  type="datetime-local" 
                  value={formData.targetDate.split('+')[0]}
                  onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-cyan-400/50 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[9px] font-mono text-slate-500 uppercase block mb-1.5">Accent Calibration</label>
                <div className="flex gap-2.5 pt-1.5">
                  {(['cyan', 'amber', 'copper', 'green'] as const).map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${formData.color === c ? 'border-white scale-110' : 'border-transparent opacity-40 hover:opacity-100'} ${colors[c].split(' ')[1]}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => onUpdate(formData)} 
              className="flex-1 py-4 bg-white text-black text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-colors"
            >
              Lock Mission
            </button>
            <button 
              onClick={onRemove} 
              className="px-6 py-4 border border-white/10 text-red-400 text-[10px] font-mono uppercase rounded-xl hover:bg-red-400/10 transition-colors"
            >
              Abort
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      layout
      className="p-6 bg-observatory-surface border border-white/[0.08] rounded-2xl relative group"
    >
      <button 
        onClick={onEdit}
        className="absolute top-4 right-4 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit2 size={12} />
      </button>

      <div className="flex flex-col gap-4">
        <div>
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Mission Clock</div>
          <h3 className="text-sm font-mono font-bold text-white uppercase">{clock.examName}</h3>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex gap-4">
            {[
              { label: 'DD', value: timeLeft.dd },
              { label: 'HH', value: timeLeft.hh },
              { label: 'MM', value: timeLeft.mm },
              { label: 'SS', value: timeLeft.ss },
            ].map(unit => (
              <div key={unit.label}>
                <div className="text-3xl font-mono font-bold text-white tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-[9px] font-mono text-slate-500 uppercase text-center">{unit.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase">
            <span>Progress Calibration</span>
            <span className={colors[clock.color].split(' ')[0]}>Target: {new Date(clock.targetDate).toLocaleDateString()}</span>
          </div>
          <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${colors[clock.color].split(' ')[1]}`}
              initial={{ width: 0 }}
              animate={{ width: '45%' }} 
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
});
