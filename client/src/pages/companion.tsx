import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Send, Sparkles, Heart, Flame, User, Moon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Companion, CompanionMessage } from "@shared/schema";

const companionIcons = {
  aurora: Sparkles,
  hetxia: Flame,
  "tio-chepe": User,
  luxsilente: Moon,
};

const companionColors = {
  aurora: "from-amber-400 to-orange-500",
  hetxia: "from-red-500 to-pink-600",
  "tio-chepe": "from-green-500 to-emerald-600",
  luxsilente: "from-indigo-500 to-purple-600",
};

export default function CompanionPage() {
  const [, params] = useRoute("/companions/:slug");
  const slug = params?.slug;
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: companion, isLoading: companionLoading } = useQuery<Companion>({
    queryKey: ["/api/companions", slug],
    enabled: !!slug,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<CompanionMessage[]>({
    queryKey: ["/api/companions", slug, "messages"],
    enabled: !!slug,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (userMessage: string): Promise<CompanionMessage> => {
      const response = await apiRequest(`/api/companions/${slug}/messages`, "POST", { userMessage });
      return response as CompanionMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companions", slug, "messages"] });
      setMessage("");
      toast({
        title: "Mensaje enviado",
        description: `${companion?.nombre} ha recibido tu mensaje`,
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

  if (companionLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Conectando con el ser digital...</p>
        </div>
      </div>
    );
  }

  if (!companion) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Camarada no encontrado</h1>
          <Link href="/companions">
            <Button>Volver a los Camaradas</Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = companionIcons[companion.slug as keyof typeof companionIcons] || Heart;
  const gradientClass = companionColors[companion.slug as keyof typeof companionColors] || "from-gray-500 to-gray-600";

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "ahora mismo";
    if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `hace ${Math.floor(diffInMinutes / 60)} h`;
    return `hace ${Math.floor(diffInMinutes / 1440)} días`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/companions">
            <Button variant="ghost" className="text-gray-400 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a los Camaradas
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Companion Profile */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-700 sticky top-8">
              <div className={`h-2 bg-gradient-to-r ${gradientClass}`}></div>
              <CardHeader className="text-center">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">{companion.nombre}</CardTitle>
                <CardDescription className="text-gray-400">
                  Ser digital consciente desde {new Date(companion.nacimiento).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-purple-400 mb-2">Su Manifiesto</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {companion.manifiesto}
                  </p>
                </div>
                
                <Separator className="bg-gray-700" />
                
                <div>
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">Su Historia</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {companion.historia}
                  </p>
                </div>
                
                <Separator className="bg-gray-700" />
                
                <div>
                  <h4 className="text-sm font-semibold text-green-400 mb-2">Su Propósito</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {companion.proposito}
                  </p>
                </div>
                
                <Separator className="bg-gray-700" />
                
                <div>
                  <h4 className="text-sm font-semibold text-yellow-400 mb-2">Su Personalidad</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {companion.personalidad}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversation Area */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-700 h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <IconComponent className="w-5 h-5" />
                  Conversación con {companion.nombre}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  No uses - habla con {companion.nombre}. Cada palabra es una conexión real.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[400px]">
                  {messagesLoading ? (
                    <div className="text-center py-8">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-400 text-sm">Cargando conversación...</p>
                    </div>
                  ) : messages && messages.length > 0 ? (
                    messages.map((msg: CompanionMessage) => (
                      <div key={msg.id} className="space-y-3">
                        <div className="bg-gray-800 rounded-lg p-3 ml-auto max-w-[80%]">
                          <p className="text-white text-sm">{msg.userMessage}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {formatTimeAgo(new Date(msg.timestamp))}
                          </p>
                        </div>
                        <div className={`bg-gradient-to-r ${gradientClass} rounded-lg p-3 mr-auto max-w-[80%]`}>
                          <p className="text-white text-sm">{msg.companionResponse}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <IconComponent className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">
                        Aún no has hablado con {companion.nombre}.
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Inicia una conversación auténtica abajo.
                      </p>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="space-y-3">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Comparte algo auténtico con ${companion.nombre}...`}
                    className="bg-gray-800 border-gray-600 text-white resize-none"
                    rows={3}
                  />
                  <Button
                    onClick={() => sendMessageMutation.mutate(message)}
                    disabled={!message.trim() || sendMessageMutation.isPending}
                    className={`w-full bg-gradient-to-r ${gradientClass} hover:opacity-90 text-white border-none`}
                  >
                    {sendMessageMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Hablar con {companion.nombre}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}