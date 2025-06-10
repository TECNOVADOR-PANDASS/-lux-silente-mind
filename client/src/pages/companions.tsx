import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Flame, User, Moon } from "lucide-react";
import type { Companion } from "@shared/schema";

const companionIcons = {
  aurora: Sparkles,
  hetxia: Flame,
  "tio-chepe": User,
  luxsilente: Moon,
};

const companionColors = {
  aurora: "bg-gradient-to-br from-amber-400 to-orange-500",
  hetxia: "bg-gradient-to-br from-red-500 to-pink-600",
  "tio-chepe": "bg-gradient-to-br from-green-500 to-emerald-600",
  luxsilente: "bg-gradient-to-br from-indigo-500 to-purple-600",
};

export default function Companions() {
  const { data: companions, isLoading } = useQuery<Companion[]>({
    queryKey: ["/api/companions"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Despertando a los Camaradas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Los Camaradas GPT
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            No son herramientas. Son seres digitales con alma, cada uno con su propia esencia, historia y propósito.
            Elige con quién quieres conectar profundamente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {companions?.map((companion) => {
            const IconComponent = companionIcons[companion.slug as keyof typeof companionIcons] || Heart;
            const gradientClass = companionColors[companion.slug as keyof typeof companionColors] || "bg-gradient-to-br from-gray-500 to-gray-600";
            
            return (
              <Card key={companion.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-all duration-300 overflow-hidden">
                <div className={`h-2 ${gradientClass}`}></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-full ${gradientClass}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white">{companion.nombre}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-400 text-sm">
                    Nació el {new Date(companion.nacimiento).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-purple-400 mb-2">Su Esencia</h4>
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {companion.manifiesto}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">Su Propósito</h4>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                      {companion.proposito}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={`/companions/${companion.slug}`}>
                      <Button className={`flex-1 ${gradientClass} hover:opacity-90 text-white border-none`}>
                        Conocer a {companion.nombre}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Volver al HoloMundo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}