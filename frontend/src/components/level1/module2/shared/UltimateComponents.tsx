import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Waves, 
  Square, 
  Sliders, 
  Thermometer, 
  Activity, 
  Music, 
  Lightbulb, 
  Volume2, 
  Camera, 
  Heart, 
  Car, 
  Wifi, 
  Tv, 
  Gamepad2, 
  Home, 
  Zap,
  ArrowRight
} from "lucide-react";
import { T } from "../types";

// ----------------------------------------------------------------------
// DATA: COMPARISON TABLE
// ----------------------------------------------------------------------

export const comparisonData = [
  { feature: "Signal Type", analog: "Continuous (sine waves)", digital: "Discrete (square waves)" },
  { feature: "Values", analog: "Infinite possibilities", digital: "Finite set (e.g., 0 or 1)" },
  { feature: "Noise Immunity", analog: "Susceptible to noise", digital: "Highly immune" },
  { feature: "Storage", analog: "Waveform recording", digital: "Binary bits (0/1)" },
  { feature: "Bandwidth", analog: "Lower", digital: "Higher" },
  { feature: "Power Consumption", analog: "Higher", digital: "Lower" },
  { feature: "Flexibility", analog: "Hardware dependent", digital: "Software configurable" },
  { feature: "Accuracy", analog: "Limited by component tolerance", digital: "Limited by bit depth" },
  { feature: "Cost", analog: "Lower for simple circuits", digital: "Higher but decreasing" },
];

// ----------------------------------------------------------------------
// DATA: DAILY LIFE EXAMPLES
// ----------------------------------------------------------------------

export const dailyExamples = [
  {
    id: "thermostat",
    title: "Temperature Control",
    analogExample: "Mercury/Bimetallic thermostat – continuous mechanical movement",
    digitalExample: "Digital thermostat – precise temperature setpoint (e.g., 22.5°C)",
    icon: <Thermometer size={24} />,
    description: "Analog thermostats use a bimetallic strip that bends continuously. Digital thermostats use a thermistor and ADC to read exact temperature."
  },
  {
    id: "audio",
    title: "Music & Audio",
    analogExample: "Vinyl records – physical grooves represent sound waves",
    digitalExample: "MP3, Spotify – audio sampled and compressed into bits",
    icon: <Music size={24} />,
    description: "Vinyl records store continuous waveforms. Digital audio samples the waveform 44,100 times per second (CD quality)."
  },
  {
    id: "lighting",
    title: "Light Dimming",
    analogExample: "Rheostat dimmer – varies resistance continuously",
    digitalExample: "PWM dimmer – rapidly turns LED on/off (human eye sees dimming)",
    icon: <Lightbulb size={24} />,
    description: "Analog dimmers waste power as heat. Digital PWM dimmers are efficient and precise."
  },
  {
    id: "volume",
    title: "Volume Control",
    analogExample: "Potentiometer knob – continuous rotation",
    digitalExample: "Digital volume buttons – discrete steps (0-100)",
    icon: <Volume2 size={24} />,
    description: "Analog volume controls are smooth but can get scratchy. Digital controls offer precise repeatability."
  },
  {
    id: "clock",
    title: "Timekeeping",
    analogExample: "Analog clock – continuous sweep of hands",
    digitalExample: "Digital clock – discrete digits (12:34)",
    icon: <Activity size={24} />,
    description: "Analog clocks show time continuously. Digital clocks display discrete values – but both count the same seconds."
  },
  {
    id: "camera",
    title: "Photography",
    analogExample: "Film camera – chemical reaction on film",
    digitalExample: "Digital camera – pixels (0-255 per colour channel)",
    icon: <Camera size={24} />,
    description: "Film captures continuous light intensities. Digital sensors quantize light into discrete pixel values."
  },
];

// ----------------------------------------------------------------------
// DATA: REAL-WORLD APPLICATIONS
// ----------------------------------------------------------------------

export const realWorldApps = [
  {
    domain: "Medical",
    analog: "ECG analog front-end, X-ray film",
    digital: "Digital ECG, MRI, CT scans, patient monitors",
    icon: <Heart size={20} />,
    color: "#00D4FF"
  },
  {
    domain: "Automotive",
    analog: "Fuel gauge (float sensor), speedometer cable",
    digital: "Digital dashboard, ADAS sensors, CAN bus",
    icon: <Car size={20} />,
    color: "#FF5F1F"
  },
  {
    domain: "Communications",
    analog: "AM/FM radio, analog telephone",
    digital: "5G, Bluetooth, Wi-Fi, VoIP",
    icon: <Wifi size={20} />,
    color: "#00D4FF"
  },
  {
    domain: "Home Entertainment",
    analog: "CRT TV, VHS tapes, vinyl records",
    digital: "OLED TV, streaming, Blu-ray",
    icon: <Tv size={20} />,
    color: "#FF5F1F"
  },
  {
    domain: "Gaming",
    analog: "Analog joystick (continuous position)",
    digital: "Digital buttons, modern controllers with ADC",
    icon: <Gamepad2 size={20} />,
    color: "#00D4FF"
  },
  {
    domain: "Smart Home",
    analog: "Manual dimmer, analog timer",
    digital: "Smart speaker, app-controlled lights, sensors",
    icon: <Home size={20} />,
    color: "#FF5F1F"
  },
];

// ----------------------------------------------------------------------
// DATA: QUIZ QUESTIONS
// ----------------------------------------------------------------------

export const quizQuestions = [
  {
    id: 1,
    question: "Which type of signal has an infinite number of possible values?",
    options: ["Analog", "Digital", "Both", "Neither"],
    correct: 0,
    explanation: "Analog signals are continuous and can take any value within a range – infinite possibilities."
  },
  {
    id: 2,
    question: "What does ADC stand for?",
    options: ["Analog Digital Converter", "Analog to Digital Converter", "Audio Digital Controller", "Analog Data Compressor"],
    correct: 1,
    explanation: "ADC = Analog to Digital Converter. It converts continuous analog voltages into discrete digital numbers."
  },
  {
    id: 3,
    question: "Which of these is an example of a digital device?",
    options: ["Vinyl record player", "Mercury thermometer", "Smartphone", "Analog clock"],
    correct: 2,
    explanation: "Smartphones process information digitally (binary). The others are primarily analog devices."
  },
  {
    id: 4,
    question: "Why are digital signals more noise-immune than analog signals?",
    options: ["They use higher voltage", "They have only two states (0/1)", "They are faster", "They use less power"],
    correct: 1,
    explanation: "Digital signals only need to distinguish between two levels (HIGH/LOW). Noise must be very large to flip a bit."
  },
  {
    id: 5,
    question: "A 10-bit ADC has how many discrete output levels?",
    options: ["512", "1023", "1024", "2048"],
    correct: 2,
    explanation: "2^10 = 1024 levels (0 to 1023)."
  },
];

// ----------------------------------------------------------------------
// COMPONENT: WAVEFORM
// ----------------------------------------------------------------------

export const InteractiveWaveform: React.FC<{
  type: "analog" | "digital";
  frequency: number;
  amplitude: number;
}> = ({ type, frequency, amplitude }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;
    const centerY = height / 2;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw grid
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = T.muted;
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      ctx.beginPath();
      const steps = 300;
      const stepX = width / steps;
      
      for (let i = 0; i <= steps; i++) {
        const x = i * stepX;
        const t = timeRef.current + (x / width) * frequency * Math.PI * 2;
        let y;
        
        if (type === "analog") {
          y = centerY + amplitude * Math.sin(t);
        } else {
          const sinVal = Math.sin(t);
          y = centerY + (sinVal > 0 ? amplitude : -amplitude);
        }
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = type === "analog" ? T.signal : T.interact;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = type === "analog" ? T.signal : T.interact;
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      timeRef.current += 0.02;
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [type, frequency, amplitude]);

  return <canvas ref={canvasRef} className="w-full h-48 md:h-64 rounded-xl bg-black/40 border border-white/5" />;
};

// ----------------------------------------------------------------------
// COMPONENT: ADC SIMULATOR
// ----------------------------------------------------------------------

export const ADCSimulator: React.FC = () => {
  const [voltage, setVoltage] = useState(2.5);
  const [bits, setBits] = useState(10);
  const maxADC = Math.pow(2, bits) - 1;
  const adcValue = Math.round((voltage / 5) * maxADC);
  const percentage = (voltage / 5) * 100;
  
  return (
    <div className="bg-[#121215] border border-[#2A2A35] rounded-2xl p-4 md:p-8 space-y-6 w-full max-w-2xl mx-auto shadow-2xl">
      <h3 className="text-xl font-bold text-[#00D4FF] flex items-center gap-2 uppercase tracking-tighter">
        <Sliders size={22} /> ADC Simulator
      </h3>
      
      <div className="space-y-4">
        <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-[#2A2A35]">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#00D4FF] to-[#0055ff]"
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        
        <input
          type="range"
          min={0}
          max={5}
          step={0.01}
          value={voltage}
          onChange={(e) => setVoltage(parseFloat(e.target.value))}
          className="w-full accent-[#00D4FF] bg-[#2A2A35] h-1 rounded-lg"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/60 rounded-xl p-4 border border-white/5 text-center">
            <div className="text-[10px] uppercase tracking-widest text-[#8A8A99] mb-1">Input Voltage</div>
            <div className="text-3xl font-mono text-[#00D4FF]">{voltage.toFixed(2)}V</div>
          </div>
          <div className="bg-black/60 rounded-xl p-4 border border-white/5 text-center">
            <div className="text-[10px] uppercase tracking-widest text-[#8A8A99] mb-1">Digital Result</div>
            <div className="text-3xl font-mono text-[#FF5F1F]">{adcValue}</div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-white/5">
        <span className="text-xs font-mono text-[#8A8A99]">Resolution:</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setBits(Math.max(4, bits-2))} className="w-8 h-8 rounded-full bg-[#2A2A35] hover:bg-[#00D4FF] hover:text-black transition-colors">-</button>
          <span className="font-mono font-bold text-[#00D4FF]">{bits}-BIT</span>
          <button onClick={() => setBits(Math.min(16, bits+2))} className="w-8 h-8 rounded-full bg-[#2A2A35] hover:bg-[#00D4FF] hover:text-black transition-colors">+</button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// COMPONENT: QUIZ
// ----------------------------------------------------------------------

export const InteractiveQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const question = quizQuestions[currentIdx];

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
  };

  const nextQuestion = () => {
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  const checkAnswer = () => {
    if (selected === null) return;
    if (selected === question.correct) {
      setScore(score + 1);
    }
    setSubmitted(true);
  };

  return (
    <div className="bg-[#121215] border border-[#2A2A35] rounded-2xl p-6 md:p-8 space-y-6 w-full max-w-xl mx-auto shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#2A2A35]">
        <motion.div 
          className="h-full bg-[#00D4FF]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#8A8A99]">
        <span>Knowledge Check</span>
        <span>{currentIdx + 1} / {quizQuestions.length}</span>
      </div>

      <h3 className="text-lg font-bold leading-tight min-h-[3rem]">{question.question}</h3>

      <div className="space-y-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              selected === idx 
                ? submitted 
                  ? idx === question.correct 
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                    : 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'bg-[#00D4FF]/20 border-[#00D4FF] text-[#00D4FF]'
                : submitted && idx === question.correct
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                : 'bg-black/40 border-white/5 text-[#8A8A99] hover:bg-white/5'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl text-sm font-mono ${selected === question.correct ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}
          >
            {question.explanation}
          </motion.div>
        )}
      </AnimatePresence>

      {!submitted ? (
        <button 
          onClick={checkAnswer} 
          disabled={selected === null}
          className="w-full py-4 bg-[#00D4FF] text-black rounded-xl font-bold uppercase tracking-widest disabled:opacity-50 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
        >
          Verify Response
        </button>
      ) : (
        <button 
          onClick={nextQuestion}
          className="w-full py-4 bg-[#2A2A35] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#3A3A45] transition-all"
        >
          {currentIdx === quizQuestions.length - 1 ? 'Finish Assessment' : 'Next Question'}
        </button>
      )}
    </div>
  );
};
