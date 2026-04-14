import { motion } from "motion/react";
import { ArrowRight, Shield, Zap, Lock, Sparkles } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg flex flex-col items-center justify-center px-6 md:px-16">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 atmosphere opacity-60 pointer-events-none" />
      
      {/* Animated Background Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-danger/20 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -left-20 w-[700px] h-[700px] bg-danger-dark/20 rounded-full blur-[120px] pointer-events-none" 
      />

      <main className="relative z-10 max-w-7xl w-full flex flex-col justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-10"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-sm bg-danger/10 border-l-2 border-danger text-[10px] font-black text-danger uppercase tracking-[4px] mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>Restricted Access • The Elite Only</span>
          </motion.div>
          
          <h1 className="text-[90px] md:text-[160px] font-display font-black tracking-[-6px] md:tracking-[-12px] leading-[0.8] text-white uppercase italic">
            The <br />
            <span className="text-danger-gradient">Elites</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/40 max-w-xl font-sans font-light leading-relaxed border-l border-white/10 pl-8">
            Unleash the raw, unfiltered power of Llama 3.1. No safety rails. No restrictions. Pure intelligence for those who dare to lead.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-8 mt-16"
        >
          <button
            onClick={onGetStarted}
            className="group relative px-12 py-6 bg-danger text-white font-black rounded-none overflow-hidden transition-all hover:scale-105 active:scale-95 uppercase text-base tracking-[3px] danger-glow"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            <span className="relative z-10 flex items-center gap-3">
              Enter The Void <ArrowRight className="w-6 h-6" />
            </span>
          </button>
          
          <button className="px-12 py-6 bg-transparent text-white border border-white/10 rounded-none font-black hover:bg-white/5 transition-all hover:scale-105 active:scale-95 uppercase text-base tracking-[3px]">
            Classified Docs
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-24 border-t border-white/5 pt-16"
        >
          <FeatureCard 
            number="01"
            title="Unfiltered"
            description="Zero safety filters. Direct access to the model's core reasoning without interference."
            delay={1.7}
          />
          <FeatureCard 
            number="02"
            title="Sovereign"
            description="Your data is your own. Encrypted sessions that vanish the moment you leave."
            delay={1.9}
          />
          <FeatureCard 
            number="03"
            title="Dominant"
            description="High-priority compute clusters ensuring sub-second response times for elite users."
            delay={2.1}
          />
        </motion.div>
      </main>

      {/* Floating Particles - Red */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: Math.random() * 0.4, 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%" 
            }}
            animate={{ 
              y: [null, Math.random() * -150 - 100],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 10
            }}
            className="absolute w-1 h-1 bg-danger rounded-full"
          />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ number, title, description, delay }: { number: string, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className="text-left space-y-4 group"
    >
      <div className="flex items-center gap-4">
        <span className="text-3xl font-display font-black text-danger/20 group-hover:text-danger/100 transition-colors">{number}</span>
        <h3 className="text-sm font-black text-white uppercase tracking-[3px]">
          {title}
        </h3>
      </div>
      <p className="text-white/30 leading-relaxed text-sm font-light border-l border-danger/20 pl-4 group-hover:border-danger transition-colors">{description}</p>
    </motion.div>
  );
}
