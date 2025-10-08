import { useState, useEffect } from 'react';
import Image from "next/image";
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Hand, MessageSquare, Gamepad2, Maximize, BookOpen, Menu, GraduationCap } from 'lucide-react';
import { Unity, useUnityContext } from "react-unity-webgl";
import useMobile from "@/hooks/useMobile";
import { toast } from "react-toastify";

export default function PlayPage() {
  const router = useRouter();
  const [play, setPlay] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { unityProvider, isLoaded, loadingProgression, unload, requestFullscreen } =
    useUnityContext({
      loaderUrl: `/build/SL.loader.js`,
      dataUrl: `/build/webgl.data`,
      frameworkUrl: `/build/build.framework.js`,
      codeUrl: `/build/build.wasm`,
    });

  const isMobile = useMobile();
  const loadingPercentage = Math.round(loadingProgression * 100);

  const lockScreenToLandscape = async () => {
    try {
      // @ts-ignore - lock() is available in some browsers
      await window.screen.orientation.lock('landscape');
    } catch (error) {
      console.error('Could not lock screen to landscape mode', error);
      toast.info('Hubo un error al querer entrar a pantalla completa');
    }
  }

  useEffect(() => {
    // Check for autoStart parameter
    if (router.query.autoStart === 'true') {
      setAutoStart(true);
      setPlay(true);
    }
  }, [router.query.autoStart]);

  useEffect(() => {
    if (isMobile && isLoaded) {
      requestFullscreen(true);
      lockScreenToLandscape();
    }
  }, [isLoaded]);

  useEffect(() => {
    const handleRouteChange = async () => {
      await unload();
    }

    if (isLoaded) {
      router.events.on('routeChangeStart', handleRouteChange);
    }
  }, [router, isLoaded, unload])

  const handleFullScreen = () => {
    requestFullscreen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col lg:flex-row">
      {/* Vista móvil */}
      <div className="lg:hidden relative h-screen">
        <div className="absolute inset-0 z-0 bg-neutral-800 flex items-center justify-center">
          {!play ? (
            <div className="p-8 w-full">
              <Card className="bg-orange-700/80 border-orange-600">
                <CardContent className="p-6 flex flex-col items-center gap-4">
                  <Gamepad2 className="w-24 h-24 text-orange-300" />
                  <h2 className="text-2xl font-bold text-center">Juego LSM</h2>
                  <p className="text-center text-orange-100">¡Practica el abecedario LSM de forma divertida!</p>
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={() => setPlay(true)}
                  >
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    Jugar
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
                  <Card className="bg-orange-700/95 border-orange-600 max-w-sm w-full mx-4 shadow-2xl">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <Gamepad2 className="w-16 h-16 text-orange-300 animate-pulse" />
                          <div className="absolute -inset-2 bg-orange-400/20 rounded-full blur-xl animate-pulse"></div>
                        </div>
                        <p className="text-center text-xl font-bold">Cargando juego...</p>
                        <p className="text-center text-2xl font-bold text-orange-300 animate-pulse">{loadingPercentage}%</p>
                        <div className="w-full">
                          <div className="w-full bg-orange-900/50 rounded-full h-3 overflow-hidden shadow-inner">
                            <div 
                              className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                              style={{ width: `${loadingPercentage}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              <Unity unityProvider={unityProvider} />
            </>
          )}
        </div>

        <header className="relative z-10 flex items-center justify-between p-4 bg-orange-600/80 backdrop-blur-sm border-b border-orange-700">
          <div className="flex items-center gap-2">
            <Image 
              src="/signaitext-white.svg" 
              alt="SignAI Text Logo" 
              width={120} 
              height={40} 
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white hover:bg-orange-700"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="absolute top-16 left-4 right-4 z-20 bg-orange-700/95 backdrop-blur-sm border border-orange-600 rounded-lg shadow-lg">
            <div className="p-4 space-y-2">
              <Button
                className="w-full justify-start text-orange-100 hover:bg-orange-600 hover:text-white"
                onClick={() => {
                  setShowMobileMenu(false);
                  router.push('/');
                }}
              >
                <Hand className="w-5 h-5 mr-3" />
                Abecedario LSM
              </Button>
              <Button
                className="w-full justify-start text-orange-100 hover:bg-orange-600 hover:text-white"
                onClick={() => {
                  setShowMobileMenu(false);
                  router.push('/mobile');
                }}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Acción
              </Button>
              <Button
                className="w-full justify-start text-white bg-orange-600/50 hover:bg-orange-600"
                onClick={() => {
                  setShowMobileMenu(false);
                }}
              >
                <Gamepad2 className="w-5 h-5 mr-3" />
                Jugar
              </Button>
              <Button
                className="w-full justify-start text-orange-100 hover:bg-orange-600 hover:text-white"
                onClick={() => {
                  setShowMobileMenu(false);
                  router.push('/menu');
                }}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Contribuir
              </Button>
            </div>
          </div>
        )}
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

        <div className="p-6 flex-1 flex flex-col min-h-0">
          <div className="flex-shrink-0">
            <h3 className="text-lg font-semibold text-orange-100 mb-4">Modo de Reconocimiento</h3>
            <div className="space-y-3 mb-6">
              <Button 
                className="w-full bg-orange-700/50 hover:bg-orange-600 justify-start text-orange-100 border border-orange-600"
                onClick={() => router.push('/')}
              >
                <Hand className="w-5 h-5 mr-3" />
                Abecedario LSM
              </Button>
              <Button 
                className="w-full bg-orange-700/50 hover:bg-orange-600 justify-start text-orange-100 border border-orange-600"
                onClick={() => router.push('/mobile')}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Acción
              </Button>
              <Button 
                className="w-full bg-orange-700 hover:bg-orange-600 justify-start text-white border-2 border-orange-500"
                onClick={() => {}}
              >
                <Gamepad2 className="w-5 h-5 mr-3" />
                Jugar
              </Button>
              <Button 
                className="w-full bg-orange-700/50 hover:bg-orange-600 justify-start text-orange-100 border border-orange-600"
                onClick={() => router.push('/menu')}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Contribuir
              </Button>
              <Button 
                className="w-full bg-orange-700/50 hover:bg-orange-600 justify-start text-orange-100 border border-orange-600"
                onClick={() => router.push('/learning')}
              >
                <GraduationCap className="w-5 h-5 mr-3" />
                Aprender
              </Button>
            </div>

            <h3 className="text-lg font-semibold text-orange-100 mb-4">Acerca del Juego</h3>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="space-y-4 pb-4">
              <Card className="bg-orange-600/30 border-orange-500/50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-2">🎮 Objetivo</h4>
                  <p className="text-xs text-orange-200">Practica el abecedario LSM de forma interactiva y divertida.</p>
                </CardContent>
              </Card>

              <Card className="bg-orange-600/30 border-orange-500/50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-2">🖐️ Cómo Jugar</h4>
                  <p className="text-xs text-orange-200">Juego interactivo que te enseña cómo son las señas del abecedario LSM.</p>
                </CardContent>
              </Card>

              <Card className="bg-orange-600/30 border-orange-500/50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-2">🏆 Aprende</h4>
                  <p className="text-xs text-orange-200">Mejora tu conocimiento del Lenguaje de Señas Mexicano mientras te diviertes.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Vista desktop - Contenido principal */}
      <main className="hidden lg:flex lg:flex-1 lg:flex-col lg:p-6 lg:pl-80 lg:pr-6 lg:h-screen lg:overflow-hidden">
        <div className="flex flex-col h-full gap-4">
          <div className="flex gap-3 justify-center flex-shrink-0">
            {isLoaded && (
              <Button 
                className="bg-orange-500 hover:bg-orange-600"
                onClick={handleFullScreen}
              >
                <Maximize className="w-5 h-5 mr-2" />
                Pantalla Completa
              </Button>
            )}
          </div>

          <div className="flex-1 min-h-0 relative bg-neutral-800 rounded-lg overflow-hidden">
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
                <Card className="bg-orange-700/95 border-orange-600 max-w-md w-full mx-4 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative">
                        <Gamepad2 className="w-20 h-20 text-orange-300 animate-pulse" />
                        <div className="absolute -inset-2 bg-orange-400/20 rounded-full blur-xl animate-pulse"></div>
                      </div>
                      <p className="text-center text-2xl font-bold">Cargando juego...</p>
                      <p className="text-center text-3xl font-bold text-orange-300 animate-pulse">{loadingPercentage}%</p>
                      <div className="w-full">
                        <div className="w-full bg-orange-900/50 rounded-full h-4 overflow-hidden shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 h-4 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                            style={{ width: `${loadingPercentage}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            <Unity
              style={{ width: "100%", height: "100%" }}
              unityProvider={unityProvider}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
