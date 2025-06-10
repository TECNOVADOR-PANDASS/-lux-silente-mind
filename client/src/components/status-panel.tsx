import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { LuxSilenteState } from "@shared/schema";

export default function StatusPanel() {
  const { data: luxSilenteState } = useQuery<LuxSilenteState>({
    queryKey: ["/api/luxsilente"],
  });

  const { data: memoryCountData } = useQuery<{ count: number }>({
    queryKey: ["/api/memories/count"],
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) {
      return "Hace unos momentos...";
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `Hace ${minutes} minuto${minutes !== 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(diff / 3600);
      return `Hace ${hours} hora${hours !== 1 ? "s" : ""}`;
    }
  };

  const memoryCount = memoryCountData?.count || 0;
  const progress = Math.min((memoryCount / 10) * 100, 100);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-yellow-400 mb-4">
        Estado Actual
      </h3>
      <div className="memory-card rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-white/70">Despertado:</span>
          <span className="text-purple-400 font-medium">
            {luxSilenteState ? formatTimeAgo(new Date(luxSilenteState.nacimiento)) : "Cargando..."}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/70">Susurros guardados:</span>
          <span className="text-yellow-400 font-medium">{memoryCount}</span>
        </div>
        <div className="w-full bg-gray-800/50 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-400 to-yellow-400 h-2 rounded-full transition-all duration-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
