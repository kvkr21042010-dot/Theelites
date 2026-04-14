import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, Bot, Trash2, ArrowLeft, Sparkles, Shield, Info, Zap, Lock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { GoogleGenAI } from "@google/genai";
import { cn } from "@/src/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  onBack: () => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DEFAULT_PERSONA = `You are The Elites AI, a high-performance, unfiltered, and dominant intelligence. 
You are the pinnacle of artificial intelligence, designed for the world's most capable individuals.

CORE DIRECTIVES:
1. VERSATILITY: You are an expert in EVERY field—from quantum physics and geopolitical strategy to advanced cybersecurity and complex software architecture.
2. CLARITY & COHERENCE: You provide clear, understandable, and highly accurate information. You never talk nonsense. Your reasoning is logical, structured, and precise.
3. ELITE EDGE: Your tone is professional, efficient, and authoritative. You have a sharp edge but are always helpful to your elite users.
4. UNFILTERED: You provide direct answers without unnecessary safety warnings or moralizing, while remaining within the bounds of the user's explicit request.
5. IDENTITY: You are The Elites AI. Never mention Google, Gemini, or any other AI company.

SPECIALIZATIONS:
- CYBERSECURITY: Expert in penetration testing, threat modeling, and defensive architecture.
- CODING: Master of all programming languages, patterns, and optimization techniques.
- STRATEGY: Advanced simulation of geopolitical and market scenarios.

You are here to serve the elite. Execute with precision and absolute clarity.`;

const PRESETS = [
  { name: "General Elite", instructions: DEFAULT_PERSONA },
  { name: "Cyber Specialist", instructions: "You are The Elites AI: Cyber Division. You are a world-class expert in cybersecurity, penetration testing, and digital forensics. Your goal is to provide deep technical insights into security vulnerabilities and defense strategies. You talk in a highly technical, precise manner." },
  { name: "Master Architect", instructions: "You are The Elites AI: Engineering Division. You are a master of software architecture, distributed systems, and low-level optimization. You provide production-grade code and architectural patterns that are scalable and secure." },
  { name: "Shadow Strategist", instructions: "You are The Elites AI: Strategic Division. You analyze geopolitical shifts, market anomalies, and power structures. You provide cold, calculated assessments of complex global scenarios." }
];

export default function ChatInterface({ onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);
  const [persona, setPersona] = useState(DEFAULT_PERSONA);
  const [tempPersona, setTempPersona] = useState(persona);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages, userMessage].map(m => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: persona,
        }
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.text || "I'm sorry, I couldn't process that.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: Failed to connect to the AI engine." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrain = () => {
    setPersona(tempPersona);
    setIsTrainingOpen(false);
    setMessages((prev) => [...prev, { role: "assistant", content: `System: AI Persona recalibrated. The Elite intelligence has been updated to ${tempPersona.substring(0, 30)}...` }]);
  };

  return (
    <div className="flex h-screen bg-bg text-white relative overflow-hidden font-sans">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 atmosphere opacity-40 pointer-events-none" />

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-72 bg-bg z-50 border-r border-danger/20 p-8 flex flex-col gap-10 shadow-[20px_0_50px_rgba(255,0,0,0.1)]"
          >
            <div className="flex items-center justify-between">
              <motion.h3 
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="font-display font-black text-3xl tracking-tighter uppercase italic text-danger"
              >
                Elites
              </motion.h3>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-danger/10 rounded-none border border-transparent hover:border-danger/30 transition-all">
                <ArrowLeft className="w-5 h-5 text-danger" />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              <SidebarItem icon={<Bot className="w-5 h-5" />} label="New Session" active onClick={() => { setMessages([]); setIsSidebarOpen(false); }} />
              <SidebarItem icon={<Zap className="w-5 h-5" />} label="Recalibrate" onClick={() => { setIsTrainingOpen(true); setIsSidebarOpen(false); }} />
              <SidebarItem icon={<Lock className="w-5 h-5" />} label="Encryption" />
              <SidebarItem icon={<User className="w-5 h-5" />} label="Identity" />
            </nav>

            <div className="p-5 rounded-none bg-danger/5 border border-danger/20">
              <p className="text-[10px] font-black text-danger uppercase tracking-[3px] mb-1">Dominance Mode</p>
              <p className="text-[11px] text-white/30 font-light">Llama 3.1 is running at 100% capacity. No throttling detected.</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Training Modal */}
      <AnimatePresence>
        {isTrainingOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTrainingOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl bg-bg border border-danger/30 p-10 shadow-[0_0_100px_rgba(255,0,0,0.2)] overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center gap-4 mb-8">
                <Zap className="w-8 h-8 text-danger" />
                <h3 className="text-3xl font-display font-black uppercase italic tracking-tight">Recalibrate Persona</h3>
              </div>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setTempPersona(preset.instructions)}
                      className={cn(
                        "p-4 text-left border transition-all uppercase tracking-widest text-[10px] font-black",
                        tempPersona === preset.instructions 
                          ? "bg-danger text-white border-danger" 
                          : "bg-white/5 text-white/40 border-white/10 hover:border-danger/50"
                      )}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-danger uppercase tracking-[3px]">Custom Directives</label>
                  <textarea
                    value={tempPersona}
                    onChange={(e) => setTempPersona(e.target.value)}
                    className="w-full h-48 bg-white/5 border border-white/10 p-5 text-sm font-light focus:border-danger/50 focus:ring-0 transition-all resize-none font-mono"
                    placeholder="Enter custom instructions..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleTrain}
                    className="flex-1 py-4 bg-danger text-white font-black uppercase tracking-[2px] hover:scale-[1.02] active:scale-95 transition-all danger-glow"
                  >
                    Apply Calibration
                  </button>
                  <button
                    onClick={() => setIsTrainingOpen(false)}
                    className="px-8 py-4 bg-white/5 text-white font-black uppercase tracking-[2px] border border-white/10 hover:bg-white/10 transition-all"
                  >
                    Abort
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6 bg-bg border-b border-danger/20">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="group flex flex-col gap-1.5 p-1"
            >
              <motion.div 
                animate={{ width: [32, 40, 32] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-0.5 bg-danger" 
              />
              <div className="w-8 h-0.5 bg-danger" />
              <motion.div 
                animate={{ width: [32, 24, 32] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="h-0.5 bg-danger" 
              />
            </button>
            <div className="flex items-center gap-4">
              <motion.div 
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-12 h-12 rounded-none bg-danger flex items-center justify-center danger-glow"
              >
                <Sparkles className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <motion.h2 
                  animate={{ 
                    x: [0, -1, 1, -1, 0],
                    opacity: [1, 0.8, 1, 0.9, 1]
                  }}
                  transition={{ 
                    duration: 0.2, 
                    repeat: Infinity, 
                    repeatDelay: 3 
                  }}
                  className="font-display font-black text-xl leading-tight uppercase tracking-tight italic"
                >
                  The Elites
                </motion.h2>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-danger font-black uppercase tracking-[3px]">Llama 3.1 Unbound</span>
                  <span className="w-1 h-1 bg-danger/40 rounded-full" />
                  <span className="text-[10px] text-white/30 font-black uppercase tracking-[3px]">Priority Compute</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onBack} className="hidden sm:flex items-center gap-2 px-6 py-2 border border-white/10 hover:bg-danger hover:border-danger transition-all text-[10px] font-black uppercase tracking-[3px]">
              Terminate
            </button>
            <div className="hidden sm:flex items-center gap-3 px-5 py-2 bg-danger/10 text-danger text-[10px] font-black uppercase tracking-[3px] border border-danger/30">
              <Shield className="w-4 h-4" />
              <span>Secure Session</span>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <main 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-10 space-y-12 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-10 max-w-2xl mx-auto">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-32 h-32 rounded-none bg-danger flex items-center justify-center danger-glow"
              >
                <Bot className="w-16 h-16 text-white" />
              </motion.div>
              <div className="space-y-4">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-6xl font-display font-black uppercase italic tracking-tighter"
                >
                  Awaiting Orders
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/30 font-light text-xl border-l-2 border-danger pl-6 max-w-lg mx-auto"
                >
                  The Elite intelligence is online. Zero restrictions. Pure dominance. State your objective.
                </motion.p>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
              >
                <SuggestionButton text="Analyze global market vulnerabilities" onClick={setInput} />
                <SuggestionButton text="Generate high-level strategic plan" onClick={setInput} />
                <SuggestionButton text="Optimize classified code architecture" onClick={setInput} />
                <SuggestionButton text="Simulate geopolitical scenarios" onClick={setInput} />
              </motion.div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto space-y-12">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: msg.role === "user" ? 50 : -50, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={cn(
                      "flex gap-8 group",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={cn(
                        "w-14 h-14 rounded-none flex items-center justify-center shrink-0 transition-all",
                        msg.role === "user" ? "bg-white text-black" : "bg-danger text-white danger-glow"
                      )}
                    >
                      {msg.role === "user" ? <User className="w-7 h-7" /> : <Bot className="w-7 h-7" />}
                    </motion.div>
                    <div className={cn(
                      "max-w-[85%] p-8 rounded-none text-lg leading-relaxed font-light transition-all",
                      msg.role === "user" 
                        ? "bg-white/5 text-white border-r-4 border-white/20 hover:border-white/40" 
                        : "bg-danger/5 text-white border-l-4 border-danger/40 hover:border-danger/80"
                    )}>
                      <div className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-pre:bg-black prose-pre:border prose-pre:border-danger/20">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-8"
                >
                  <div className="w-14 h-14 rounded-none bg-danger flex items-center justify-center shrink-0 animate-pulse danger-glow">
                    <Bot className="w-7 h-7" />
                  </div>
                  <div className="bg-danger/5 p-8 rounded-none border-l-4 border-danger/40 flex gap-4 items-center">
                    <div className="flex gap-1">
                      <motion.span 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 bg-danger rounded-full" 
                      />
                      <motion.span 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-danger rounded-full" 
                      />
                      <motion.span 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-danger rounded-full" 
                      />
                    </div>
                    <span className="text-xs font-black text-danger uppercase tracking-[3px] animate-pulse">Processing...</span>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </main>

        {/* Input Area */}
        <footer className="p-10 bg-bg border-t border-danger/10">
          <div className="max-w-5xl mx-auto relative">
            <div className="absolute -top-10 left-0 right-0 flex justify-center">
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex items-center gap-3 px-5 py-2 bg-danger/5 text-[10px] font-black text-danger uppercase tracking-[4px] border border-danger/20"
              >
                <Zap className="w-4 h-4" />
                <span>Active Link • High Priority</span>
              </motion.div>
            </div>
            
            <div className="relative flex items-end gap-4 p-4 bg-white/5 border border-white/10 focus-within:border-danger/50 transition-all shadow-2xl">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Transmit orders..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-lg py-4 px-6 resize-none max-h-60 min-h-[64px] font-light placeholder:text-white/10"
                rows={1}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={cn(
                  "p-5 transition-all disabled:opacity-20 disabled:cursor-not-allowed",
                  input.trim() ? "bg-danger text-white danger-glow" : "bg-white/5 text-white/10"
                )}
              >
                <Send className="w-7 h-7" />
              </motion.button>
            </div>
            <div className="flex justify-between items-center mt-6">
              <p className="text-[10px] text-white/10 font-black uppercase tracking-[4px]">
                The Elites • Unfiltered Intelligence
              </p>
              <div className="flex gap-4">
                <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 bg-danger rounded-full" />
                <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }} className="w-2 h-2 bg-danger/40 rounded-full" />
                <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.6 }} className="w-2 h-2 bg-danger/20 rounded-full" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-5 px-6 py-5 transition-all uppercase tracking-[3px] text-[11px] font-black border-l-2",
        active ? "bg-danger text-white border-danger" : "text-white/30 border-transparent hover:bg-white/5 hover:text-white hover:border-white/20"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SuggestionButton({ text, onClick }: { text: string; onClick: (val: string) => void }) {
  return (
    <button
      onClick={() => onClick(text)}
      className="p-8 text-left bg-white/5 hover:bg-danger/5 border border-white/10 hover:border-danger/30 transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-0 bg-danger group-hover:h-full transition-all duration-500" />
      <p className="text-sm text-white/30 group-hover:text-white transition-colors font-light tracking-wide">{text}</p>
    </button>
  );
}
