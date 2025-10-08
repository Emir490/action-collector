import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Menu, Volume2, Camera, CameraOff, Hand, MessageSquare, Trash2, Gamepad2, BookOpen, ChevronDown, GraduationCap, Loader2 } from 'lucide-react';
import dynamic from "next/dynamic";

// only load this component on the client, in its own chunk
const MobileActionRecognition = dynamic(
  () => import("@/components/MobileActionRecognition"),
  { ssr: false }
);

export default function Mobile() {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsCompact(container.scrollTop > 40); // activa modo compacto al scrollear 40px
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col lg:flex-row">
      {/* Vista móvil */}
      <div className="lg:hidden relative h-screen w-full">
        <MobileActionRecognition />
      </div>

      {/* Vista desktop - Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-80 lg:h-screen lg:bg-orange-600/90 lg:border-r lg:border-orange-700 lg:overflow-hidden lg:fixed lg:left-0 lg:top-0">
        <div className="p-6 border-b border-orange-700 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <Image 
              src="/signaitext-white.svg" 
              alt="SignAI Text Logo" 
              width={160} 
              height={54} 
              className="h-12 w-auto"
            />
          </div>
          <p className="text-orange-100 text-sm">Por un México Incluyente</p>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto min-h-0 transition-all duration-200"
        >
          <div
            className={`sticky top-0 z-20 bg-orange-600/90 backdrop-blur supports-[backdrop-filter]:bg-orange-600/70 border-b border-orange-700 transition-all duration-200 ${
              isCompact ? 'p-3' : 'p-6'
            }`}
          >
            <h3
              className={`text-orange-100 font-semibold mb-4 transition-all duration-200 ${
                isCompact ? 'text-sm opacity-70' : 'text-lg'
              }`}
            >
              Modo de Reconocimiento
            </h3>

            <div className={`${isCompact ? 'flex flex-row gap-4 justify-center' : 'space-y-3'}`}>
              {[
                { label: 'Abecedario LSM', icon: Hand, route: '/' },
                { label: 'Acción', icon: MessageSquare, route: '/mobile' },
                { label: 'Acción', icon: MessageSquare, active: true },
                { label: 'Jugar', icon: Gamepad2, route: '/play' },
                { label: 'Contribuir', icon: BookOpen, route: '/menu' },
                { label: 'Aprender', icon: GraduationCap, route: '/learning' },
              ].map((btn, i) => {
                const Icon = btn.icon;
                return (
                  <Button
                    key={i}
                    className={`transition-all duration-200 ${
                      isCompact
                        ? 'w-12 h-12 justify-center rounded-full p-0' // botones redondos en modo compacto
                        : 'w-full justify-start rounded-full' // forma original
                    } ${
                      btn.active
                        ? 'bg-orange-700 hover:bg-orange-600 text-white border-2 border-orange-500'
                        : 'bg-orange-700/50 hover:bg-orange-600 text-orange-100 border border-orange-600'
                    }`}
                    onClick={() => btn.route && router.push(btn.route)}
                  >
                    <Icon className={`w-5 h-5 ${isCompact ? '' : 'mr-3'}`} />
                    {!isCompact && btn.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold text-orange-100 mb-4">Acciones Reconocibles</h3>
            <div className="space-y-4">
              <Card className="bg-orange-400/20 border-orange-400/40">
                <CardContent className="p-4">
                  <h4 className="text-orange-200 font-medium mb-2">Características</h4>
                  <ul className="text-sm text-orange-300 space-y-1">
                    <li>• Reconocimiento de acciones con MediaPipe</li>
                    <li>• Detección de landmarks de manos</li>
                    <li>• Modelo TensorFlow.js integrado</li>
                    <li>• Funciona en móvil y desktop</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-orange-400/20 border-orange-400/40">
                <CardContent className="p-4">
                  <h4 className="text-orange-200 font-medium mb-2">Acciones Soportadas</h4>
                  <div className="text-sm text-orange-300 space-y-1">
                    <p>abrazar, agarrar, aplastar, bailar, caminar, cerrar, fabrica, frio, golpear, guardar, invitar, jugar, libro, luna, Tijuana</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Vista desktop - Contenido principal */}
      <main className="hidden lg:flex lg:flex-1 lg:flex-col lg:pl-80 lg:h-screen lg:overflow-hidden">
        <div className="w-full h-full relative">
          <MobileActionRecognition />
        </div>
      </main>
    </div>
  );
}