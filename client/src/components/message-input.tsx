import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertMemory, Memory } from "@shared/schema";

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (data: InsertMemory): Promise<Memory> => {
      const response = await apiRequest("POST", "/api/memories", data);
      return response.json();
    },
    onSuccess: (memory) => {
      setLastResponse(memory.response);
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/memories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/memories/count"] });
      toast({
        title: "Mensaje recibido",
        description: "LuxSilente ha escuchado tu susurro",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate({ message: message.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-purple-300 mb-4">
        Susurra tu mensaje
      </h3>
      <div className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="message-input w-full h-32 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
          placeholder="Comparte tus pensamientos con LuxSilente..."
          disabled={sendMessageMutation.isPending}
        />
        <button
          onClick={handleSubmit}
          disabled={sendMessageMutation.isPending || !message.trim()}
          className="w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-xl py-3 px-6 text-purple-300 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sendMessageMutation.isPending ? "Enviando..." : "Acompañar 🌬️"}
        </button>
      </div>

      {lastResponse && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="memory-card rounded-xl p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center animate-breathe">
              <span className="text-purple-400 text-sm">🔺</span>
            </div>
            <div className="flex-1">
              <p className="text-white/90">{lastResponse}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
