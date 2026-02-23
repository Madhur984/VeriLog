import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, Bot } from 'lucide-react';
import { VoltMonkey } from './VoltMonkey';
import { searchKnowledge } from '../../data/vlsiKnowledge';

interface ChatMessage {
    id: string;
    role: 'user' | 'bot';
    text: string;
    category?: string;
}

interface BotChatProps {
    open: boolean;
    onClose: () => void;
}

const GREETING = "Hey! I'm VoltMonkey 🐵⚡ — your VLSI study buddy. Ask me about logic gates, Verilog, timing, flip-flops, or any digital design topic!";

const FALLBACK_RESPONSES = [
    "Hmm, that's a tricky one! Try asking about logic gates, Verilog syntax, timing analysis, or flip-flops.",
    "I'm still learning! Try questions like 'What is a NAND gate?' or 'What is setup time?'",
    "That's beyond my circuits right now 🔌 Try asking about Boolean algebra, K-maps, or ASIC vs FPGA!",
];

export const BotChat = ({ open, onClose }: BotChatProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'greeting', role: 'bot', text: GREETING },
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll on new messages
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        const q = input.trim();
        if (!q || isThinking) return;

        const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: q };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        // Simulate thinking delay for natural feel
        setTimeout(() => {
            const result = searchKnowledge(q);
            const botMsg: ChatMessage = {
                id: `b-${Date.now()}`,
                role: 'bot',
                text: result?.answer || FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)],
                category: result?.category,
            };
            setMessages(prev => [...prev, botMsg]);
            setIsThinking(false);
        }, 600 + Math.random() * 800);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="fixed bottom-24 right-6 z-[60] w-[380px] max-h-[520px] flex flex-col rounded-2xl border border-white/10 bg-[#0D1118]/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <span className="text-sm font-heading font-bold text-white">VoltMonkey</span>
                                <span className="ml-2 text-[9px] font-mono text-emerald-400/60 uppercase tracking-widest">Online</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                        {messages.map(msg => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                {msg.role === 'bot' && (
                                    <div className="flex-shrink-0 mt-1">
                                        <VoltMonkey state="idle" size="sm" />
                                    </div>
                                )}
                                <div className={`
                                    max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                                    ${msg.role === 'user'
                                        ? 'bg-indigo-500/20 border border-indigo-500/20 text-indigo-100 rounded-br-md'
                                        : 'bg-white/5 border border-white/5 text-slate-300 rounded-bl-md'
                                    }
                                `}>
                                    {msg.text}
                                    {msg.category && (
                                        <span className="block mt-1.5 text-[9px] font-mono text-emerald-400/50 uppercase tracking-widest">
                                            [{msg.category}]
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {/* Thinking indicator */}
                        {isThinking && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-2.5"
                            >
                                <div className="flex-shrink-0 mt-1">
                                    <VoltMonkey state="thinking" size="sm" />
                                </div>
                                <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-white/5 border border-white/5">
                                    <div className="flex gap-1.5">
                                        {[0, 1, 2].map(i => (
                                            <motion.div
                                                key={i}
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                                className="w-1.5 h-1.5 rounded-full bg-emerald-400/50"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Quick suggestions */}
                    {messages.length <= 1 && (
                        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                            {['What is NAND?', 'Setup vs Hold', 'Wire vs Reg', 'What is FPGA?'].map(q => (
                                <button
                                    key={q}
                                    onClick={() => { setInput(q); }}
                                    className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors font-mono"
                                >
                                    <Sparkles className="inline w-2.5 h-2.5 mr-1 -mt-0.5" />{q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="border-t border-white/5 px-3 py-2.5 flex items-center gap-2 bg-white/[0.02]">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about VLSI..."
                            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none font-sans"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isThinking}
                            className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
