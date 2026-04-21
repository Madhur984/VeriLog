import React from 'react';
import { useModuleLogic } from '@/hooks/useModuleLogic';
import { useGlobalMemory } from '@/hooks/useGlobalMemory';
import { useGlobalSensory } from '@/hooks/useGlobalSensory';

// Import all 18 screens
import { SystemBoot } from './module1/screens/SystemBoot';
import { SignalFeel } from './module1/screens/SignalFeel';
import { SignalDefinition } from './module1/screens/SignalDefinition';
import { SignalLoop } from './module1/screens/SignalLoop';
import { RealWorldSignals } from './module1/screens/RealWorldSignals';
import { AnalogDigital } from './module1/screens/AnalogDigital';
import { SignalParameters } from './module1/screens/SignalParameters';
import { SignalTypes } from './module1/screens/SignalTypes';
import { BasicSignals } from './module1/screens/BasicSignals';
import { SignalTransform } from './module1/screens/SignalTransform';
import { SignalMeaning } from './module1/screens/SignalMeaning';
import { SignalProcessing } from './module1/screens/SignalProcessing';
import { FinalInsight } from './module1/screens/FinalInsight';
import { InsightLock } from './module1/screens/InsightLock';
import { SignalAssignment } from './module1/screens/SignalAssignment';
import { SignalPropagation } from './module1/screens/SignalPropagation';
import { EmbeddedCircuitLab } from './module1/screens/EmbeddedCircuitLab';
import { ModuleTransition } from './module1/screens/ModuleTransition';
import { NumberSystemIntro } from './module1/screens/NumberSystemIntro';
import ModuleContainer from './module1/ModuleContainer';

// Explicit screen order to ensure stable rendering across all browsers
const SCREEN_ORDER = [
  'system_boot',
  'signal_feel',
  'signal_definition',
  'signal_loop',
  'real_world_signals',
  'analog_digital',
  'signal_parameters',
  'signal_types',
  'basic_signals',
  'signal_transform',
  'signal_meaning',
  'number_system_intro',
  'signal_processing',
  'final_insight',
  'insight_lock',
  'signal_assignment',
  'signal_propagation',
  'embedded_circuit_lab',
  'module_transition'
];

const SCREENS: Record<string, React.FC<any>> = {
  system_boot: SystemBoot,
  signal_feel: SignalFeel,
  signal_definition: SignalDefinition,
  signal_loop: SignalLoop,
  real_world_signals: RealWorldSignals,
  analog_digital: AnalogDigital,
  signal_parameters: SignalParameters,
  signal_types: SignalTypes,
  basic_signals: BasicSignals,
  signal_transform: SignalTransform,
  signal_meaning: SignalMeaning,
  signal_processing: SignalProcessing,
  number_system_intro: NumberSystemIntro,
  final_insight: FinalInsight,
  insight_lock: InsightLock,
  signal_assignment: SignalAssignment,
  signal_propagation: SignalPropagation,
  embedded_circuit_lab: EmbeddedCircuitLab,
  module_transition: ModuleTransition,
};

export const SubModule1_1: React.FC<any> = ({ onComplete }) => {
  const screens = SCREEN_ORDER;
  
  const { 
    memory, 
    updateSignal, 
    updateSignalB, 
    updateGlobalState, 
    updateMessageSignal,
    updateCarrierSignal,
    updateModulation,
    updateInterference,
    addAchievement 
  } = useGlobalMemory();

  const { triggerHaptic, playSound } = useGlobalSensory();

  const {
    activeScreenIndex,
    activeScreenId,
    state: stage,
    setActiveScreenIndex,
    isIdle
  } = useModuleLogic({
    screens,
    initialState: 'intro'
  });

  // Intersection Observer for active screen detection
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            if (activeScreenIndex !== index) {
              setActiveScreenIndex(index);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    const sections = document.querySelectorAll('.module-screen-section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [screens.length, setActiveScreenIndex, activeScreenIndex]);

  const handleNext = () => {
    if (activeScreenIndex === screens.length - 1) {
        addAchievement('module1_complete');
        onComplete?.();
    }
  };

  // AI Assistant Hint Overlay Logic
  const currentHint = React.useMemo(() => {
    if (activeScreenId === 'analog_digital' && (memory?.userSignal?.samplingRate || 0) < (memory?.userSignal?.frequency || 0) * 2) {
        return { type: 'hint', message: 'Fs is below Nyquist Limit! Increase sampling rate to stop aliasing.' };
    }
    if (isIdle && activeScreenIndex < 3) {
        return { type: 'hint', message: 'The Neural Link is active. Scroll to begin modulation.' };
    }
    return null;
  }, [activeScreenId, memory?.userSignal, isIdle, activeScreenIndex]);

  const getLearningTopic = (index: number) => {
    if (index < 4) return "SIGNAL SENSORY";
    if (index < 9) return "INSTRUMENTATION LAB";
    if (index < 14) return "DATA TRANSFORMATION";
    return "PROTOCOL SHIFT";
  };

  return (
    <ModuleContainer 
      progress={(activeScreenIndex + 1) / screens.length}
      activeScreenId={activeScreenId}
      breadcrumb={['Module 1', getLearningTopic(activeScreenIndex)]}
    >
      {screens.map((id, index) => {
        const Screen = SCREENS[id];
        if (!Screen) return null;
        
        return (
          <section 
            key={id} 
            id={`screen-${id}`}
            data-index={index}
            className="module-screen-section min-h-screen w-full snap-start relative overflow-hidden flex items-center justify-center p-8 lg:p-16"
          >
             <Screen 
                onNext={handleNext}
                onInteractionComplete={handleNext}
                onInitialize={id === 'module_transition' ? handleNext : undefined}
                triggerHaptic={triggerHaptic}
                playSound={playSound}
                memory={memory}
                updateSignal={updateSignal}
                updateSignalB={updateSignalB}
                updateGlobalState={updateGlobalState}
                updateMessageSignal={updateMessageSignal}
                updateCarrierSignal={updateCarrierSignal}
                updateModulation={updateModulation}
                updateInterference={updateInterference}
                currentHint={id === activeScreenId ? currentHint : null}
                isIdle={id === activeScreenId ? isIdle : false}
             />
          </section>
        );
      })}

      {/* Floating V-OS Info */}
      <div className="fixed bottom-4 left-4 z-50 px-3 py-1 glass-card border-none bg-black/60 text-[8px] font-mono uppercase tracking-[0.3em] text-white/30 flex gap-4 pointer-events-none border border-white/5">
        <span className="flex items-center gap-2 text-[var(--accent-primary)]">
            <div className="w-1 h-1 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            V-OS {stage}
        </span>
      </div>
    </ModuleContainer>
  );
};

export default SubModule1_1;
