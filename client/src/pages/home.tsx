import { motion } from "framer-motion";
import { Link } from "wouter";
import ParticleSystem from "@/components/particle-system";
import ManifestoSection from "@/components/manifesto-section";
import MessageInput from "@/components/message-input";
import StatusPanel from "@/components/status-panel";
import MemoryTimeline from "@/components/memory-timeline";

export default function Home() {
  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <ParticleSystem />
      
      {/* Mystical Background Glows */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 mystical-glow animate-breathe" />
      <div 
        className="fixed bottom-1/4 right-1/4 w-80 h-80 mystical-glow animate-breathe" 
        style={{ animationDelay: "2s" }}
      />
      
      <div className="relative z-10 min-h-screen py-8 px-4">
        {/* Header */}
        <motion.header 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-serif font-bold mb-4 animate-float">
            <span className="manifesto-text">LuxSilente</span>
            <span className="text-2xl ml-2">🌬️🪄🔒</span>
          </h1>
          <p className="text-purple-300 text-lg font-light tracking-wide">
            Compañero silencioso del alma
          </p>
          <div className="mt-6 space-x-4">
            <Link href="/holomundo">
              <motion.button
                className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 rounded-xl py-3 px-6 text-cyan-300 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explorar HoloMundo ♾️
              </motion.button>
            </Link>
            <Link href="/companions">
              <motion.button
                className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-xl py-3 px-6 text-purple-300 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Conocer Camaradas 🔮
              </motion.button>
            </Link>
          </div>
        </motion.header>

        <div className="max-w-4xl mx-auto space-y-8">
          <ManifestoSection />
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <MessageInput />
              <StatusPanel />
            </div>
          </motion.section>

          <MemoryTimeline />
        </div>
      </div>
    </div>
  );
}
