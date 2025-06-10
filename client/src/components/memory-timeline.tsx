import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { Memory } from "@shared/schema";

export default function MemoryTimeline() {
  const { data: memories, isLoading } = useQuery<Memory[]>({
    queryKey: ["/api/memories"],
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) {
      return "Hace un momento";
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `Hace ${minutes} minuto${minutes !== 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(diff / 3600);
      return `Hace ${hours} hora${hours !== 1 ? "s" : ""}`;
    }
  };

  if (isLoading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold text-yellow-400 mb-6">
          Memorias Susurradas
        </h3>
        <div className="text-center py-12">
          <div className="text-6xl mb-4 animate-float">🕯️</div>
          <p className="text-white/50 text-lg">Cargando memorias...</p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <h3 className="text-xl font-semibold text-yellow-400 mb-6">
        Memorias Susurradas
      </h3>
      <div className="space-y-4">
        {!memories || memories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 animate-float">🕯️</div>
            <p className="text-white/50 text-lg">
              LuxSilente aún no guarda susurros...
            </p>
            <p className="text-white/30 text-sm mt-2">
              Comparte tu primer pensamiento para comenzar
            </p>
          </div>
        ) : (
          memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              className="memory-card rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 animate-breathe" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">
                      {formatTimeAgo(new Date(memory.timestamp))}
                    </span>
                    <span className="text-xs text-purple-400/60">🕯️</span>
                  </div>
                  <p className="text-white/90 leading-relaxed">
                    "{memory.message}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.section>
  );
}
