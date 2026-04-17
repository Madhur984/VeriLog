import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Cpu, Layers, HardDrive, Package, Trash2 } from 'lucide-react';
import { useBinaryStore } from '../../../../stores/binaryStore';
import { playBitTone } from '../../../../utils/synesthesiaEngine';

interface Props { isActive: boolean; isDarkMode: boolean; }

type DataType = 'string' | 'uint16' | 'float16' | 'int32';

interface DataObject {
  id: string;
  type: DataType;
  label: string;
  value: any;
  size: number; // bytes
  offset: number;
  color: string;
}

const DATA_SPECS: Record<DataType, { size: number; color: string; prefix: string }> = {
  string: { size: 8, color: '#0EA5E9', prefix: 'STR' },
  uint16: { size: 2, color: '#F59E0B', prefix: 'U16' },
  float16: { size: 2, color: '#10B981', prefix: 'F16' },
  int32: { size: 4, color: '#8B5CF6', prefix: 'I32' }
};

export const S13_D_MemoryHorizon: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [memory, setMemory] = useState<DataObject[]>([]);
  const [endian, setEndian] = useState<'big' | 'little'>('big');
  
  const systemTemperature = useBinaryStore(s => s.systemTemperature);
  const recordAction = useBinaryStore(s => s.recordAction);

  const addData = (type: DataType) => {
    // Find first available gap
    const spec = DATA_SPECS[type];
    let foundOffset = -1;
    
    for (let o = 0; o <= 64 - spec.size; o++) {
        const isOccupied = memory.some(obj => 
            (o >= obj.offset && o < obj.offset + obj.size) || 
            (o + spec.size > obj.offset && o + spec.size <= obj.offset + obj.size) ||
            (obj.offset >= o && obj.offset < o + spec.size)
        );
        if (!isOccupied) {
            foundOffset = o;
            break;
        }
    }

    if (foundOffset === -1) return; // No space

    const newObj: DataObject = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        label: type.toUpperCase(),
        value: type === 'string' ? "VERILOG" : (type === 'int32' ? 123456 : 1.0),
        size: spec.size,
        offset: foundOffset,
        color: spec.color
    };

    setMemory([...memory, newObj]);
    playBitTone(4, 'high');
    recordAction('interactions');
  };

  const removeData = (id: string) => {
      setMemory(memory.filter(m => m.id !== id));
      playBitTone(2, 'low');
  };

  const getByteAt = (offset: number) => {
      const parent = memory.find(obj => offset >= obj.offset && offset < obj.offset + obj.size);
      if (!parent) return { val: 0, color: 'transparent', parent: null };
      
      // Calculate byte value based on type and endianness
      let val = 0;
      const relativeOffset = offset - parent.offset;
      const pos = endian === 'big' ? relativeOffset : (parent.size - 1 - relativeOffset);

      if (parent.type === 'string') {
          val = parent.value.charCodeAt(relativeOffset) || 0;
      } else if (parent.type === 'uint16' || parent.type === 'int32') {
          val = (parent.value >> (pos * 8)) & 0xFF;
      } else if (parent.type === 'float16') {
          // Simplified float visualization
          val = 0x3C; // Dummy hex for 1.0
      }

      return { val, color: parent.color, parent };
  };

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const glowColor = systemTemperature > 0.6 ? '245, 158, 11' : '14, 165, 233';
  const glowOpacity = systemTemperature * 0.4;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-12 transition-all duration-1000" style={{
        filter: systemTemperature > 0.1 ? `drop-shadow(0 0 ${systemTemperature * 30}px rgba(${glowColor}, ${glowOpacity}))` : 'none'
    }}>
      {/* Header */}
      <section className="text-center space-y-4">
        <motion.span
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          className={`font-mono text-[11px] tracking-[0.4em] uppercase block mb-4 ${subTextColor}`}
        >
          Engineering Deep Dive - Data Serialization
        </motion.span>
        <h2 className={`text-4xl md:text-5xl font-black ${textColor}`}>Memory Horizon</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
            Ever wondered how a variable "sits" in RAM? Drag data types into the 64-byte grid to see alignment, endianness, and hex-mapping in action.
        </p>
      </section>

      {/* Mission Protocol Card */}
      <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-100'} max-w-4xl mx-auto grid md:grid-cols-3 gap-6`}>
          <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-sky-500">Pedagogy</span>
              <p className={`text-[11px] leading-tight opacity-70 ${textColor}`}>Continuous memory addressing including word-alignment and byte-order (Endianness).</p>
          </div>
          <div className="space-y-1 border-l border-sky-500/20 pl-6">
              <span className="text-[9px] font-black uppercase tracking-widest text-sky-500">Protocol</span>
              <p className={`text-[11px] leading-tight opacity-70 ${textColor}`}>Drag artifacts from the pallette into the 64-byte grid. Toggle Endian mode to see byte flipping.</p>
          </div>
          <div className="space-y-1 border-l border-sky-500/20 pl-6">
              <span className="text-[9px] font-black uppercase tracking-widest text-sky-500">Objective</span>
              <p className={`text-[11px] leading-tight opacity-70 ${textColor}`}>Observe how diverse data types (STR, I32) are serialized and packed into hex-mapped RAM.</p>
          </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
          {/* Pallette Column */}
          <div className="lg:col-span-3 space-y-4">
              <div className={`p-6 rounded-3xl border ${cardBg}`}>
                  <h3 className={`font-mono text-[10px] uppercase tracking-widest mb-6 opacity-40 ${textColor}`}>Data Pallette</h3>
                  <div className="flex flex-col gap-3">
                      {(Object.keys(DATA_SPECS) as DataType[]).map(type => (
                          <motion.button
                            key={type}
                            onClick={() => addData(type)}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-4 rounded-xl border-2 border-dashed flex items-center justify-between text-left transition-all"
                            style={{ 
                                borderColor: `${DATA_SPECS[type].color}44`,
                                background: `${DATA_SPECS[type].color}11`
                            }}
                          >
                              <div className="flex items-center gap-3">
                                  <Package size={16} style={{ color: DATA_SPECS[type].color }} />
                                  <div className="flex flex-col">
                                      <span className="text-[10px] font-black uppercase tracking-tight" style={{ color: DATA_SPECS[type].color }}>{DATA_SPECS[type].prefix}</span>
                                      <span className={`text-[9px] opacity-60 font-mono ${textColor}`}>{DATA_SPECS[type].size} Bytes</span>
                                  </div>
                              </div>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-[10px] ${textColor}`}>+</div>
                          </motion.button>
                      ))}
                  </div>
              </div>

              <div className={`p-6 rounded-3xl border ${cardBg}`}>
                  <h3 className={`font-mono text-[10px] uppercase tracking-widest mb-6 opacity-40 ${textColor}`}>System Config</h3>
                  <div className="flex bg-black/20 p-1 rounded-xl">
                      {['big', 'little'].map(e => (
                          <button
                            key={e}
                            onClick={() => { setEndian(e as any); recordAction('interactions'); }}
                            className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all
                                ${endian === e ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                              {e} Endian
                          </button>
                      ))}
                  </div>
                  <p className={`mt-4 text-[9px] opacity-40 leading-relaxed ${textColor}`}>
                      Endianness determines the order of bytes for multi-byte values (MSB vs LSB first).
                  </p>
              </div>
          </div>

          {/* Memory Visual Column */}
          <div className="lg:col-span-9 space-y-6">
              <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-black/40 border-white/5 shadow-2xl' : 'bg-slate-900 border-slate-800 shadow-2xl'}`}>
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                      <div className="flex items-center gap-4">
                          <Database className="text-sky-500" size={20} />
                          <div className="flex flex-col">
                              <h3 className="text-white font-bold text-sm tracking-tight">Main System Memory</h3>
                              <span className="text-sky-500/50 font-mono text-[9px] uppercase tracking-widest">Base Address: 0x00000000</span>
                          </div>
                      </div>
                      <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                             <span className="text-white/40 font-mono text-[9px] uppercase">Bus Active</span>
                          </div>
                      </div>
                  </div>

                  {/* Hex Matrix */}
                  <div className="grid grid-cols-8 gap-3 mb-10">
                      {Array.from({ length: 64 }).map((_, i) => {
                          const { val, color, parent } = getByteAt(i);
                          return (
                              <motion.div
                                key={i}
                                layoutId={`byte-${i}`}
                                className="group relative flex flex-col items-center justify-center aspect-square rounded-xl border transition-all"
                                style={{ 
                                    background: color === 'transparent' ? 'rgba(255,255,255,0.02)' : `${color}22`,
                                    borderColor: color === 'transparent' ? 'rgba(255,255,255,0.05)' : `${color}44`,
                                    boxShadow: color !== 'transparent' ? `inset 0 0 10px ${color}11` : 'none'
                                }}
                              >
                                  <span className={`font-mono text-[11px] font-black ${color === 'transparent' ? 'text-white/10' : 'text-white'}`}>
                                      {val.toString(16).padStart(2, '0').toUpperCase()}
                                  </span>
                                  <span className="absolute -top-1 -left-1 text-[7px] font-mono opacity-20 text-white">{i.toString(16).padStart(2, '0').toUpperCase()}</span>
                                  
                                  {/* Hover tooltips/details */}
                                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                      {parent && (
                                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-[8px] px-2 py-1 rounded border border-white/20 whitespace-nowrap z-50">
                                              {parent.type}: 0x{parent.value.toString(16).toUpperCase()}
                                          </div>
                                      )}
                                  </div>

                                  {/* Remove option */}
                                  {parent && i === parent.offset && (
                                      <button 
                                        onClick={() => removeData(parent.id)}
                                        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white p-0 hover:scale-110 transition-transform cursor-pointer"
                                      >
                                          <Trash2 size={8} />
                                      </button>
                                  )}
                              </motion.div>
                          );
                      })}
                  </div>

                  {/* Secondary ASCII/Bin View */}
                  <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-black/30 rounded-2xl p-5 border border-white/5">
                          <div className="flex items-center gap-2 mb-3 text-[9px] font-black uppercase tracking-widest text-sky-500">
                             <Layers size={12} /> ASCII Representation
                          </div>
                          <div className="font-mono text-xs text-white/40 break-all leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                              {Array.from({ length: 64 }).map((_, i) => {
                                  const { val } = getByteAt(i);
                                  return (val >= 32 && val <= 126) ? String.fromCharCode(val) : '.';
                              })}
                          </div>
                      </div>
                      <div className="bg-black/30 rounded-2xl p-5 border border-white/5">
                          <div className="flex items-center gap-2 mb-3 text-[9px] font-black uppercase tracking-widest text-amber-500">
                             <Cpu size={12} /> Raw Bin Stream (Last 4)
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                             {Array.from({ length: 4 }).map((_, i) => {
                                 const { val, color } = getByteAt(60 + i);
                                 return (
                                     <div key={i} className="flex flex-col items-center gap-1">
                                         <div className="text-[7px] text-white/20">0x{ (60+i).toString(16).toUpperCase() }</div>
                                         <div className="font-mono text-[9px] text-white p-1 rounded border border-white/5 w-full text-center" style={{ color: color !== 'transparent' ? color : '#fff' }}>
                                             {val.toString(2).padStart(8, '0')}
                                         </div>
                                     </div>
                                 );
                             })}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
