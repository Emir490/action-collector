import Layout from "@/components/layout";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { signs } from "@/helpers";
import SignRecognition from "@/components/signRecognition";
import TiltedCard from "@/components/TiltedCard";
import { Button } from '@/components/ui/button';
import { Hand, MessageSquare, Gamepad2, BookOpen, Menu, GraduationCap, ArrowLeft } from 'lucide-react';

const Sign: FC = () => {
  const router = useRouter();
  const [sign, setSign] = useState<any>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  useEffect(() => {
    if (router.isReady && router.query.sign) {
      const signAction = router.query.sign;
      const foundSign = signs.find((s) => s.name === signAction);
      setSign(foundSign);
      console.log('signAction:', signAction);
      console.log('sign found:', foundSign);
    }
  }, [router.isReady, router.query.sign]);
  
  if (!router.isReady || !sign) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col lg:flex-row">
        {/* Vista móvil */}
        <div className="lg:hidden flex flex-col h-screen">
          <header className="flex items-center justify-between p-4 bg-orange-600/80 backdrop-blur-sm border-b border-orange-700">
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

          <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
            <div className="text-xl">Cargando...</div>
          </div>
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
                  className="w-full bg-orange-700/50 hover:bg-orange-600 justify-start text-orange-100 border border-orange-600"
                  onClick={() => router.push('/play')}
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
                  className="w-full bg-orange-700 hover:bg-orange-600 justify-start text-white border-2 border-orange-500"
                  onClick={() => {}}
                >
                  <GraduationCap className="w-5 h-5 mr-3" />
                  Aprender
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Vista desktop - Contenido principal */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:pl-80 lg:h-screen lg:overflow-hidden">
          <div className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-xl">Cargando...</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col lg:flex-row">
      {/* Vista móvil */}
      <div className="lg:hidden flex flex-col h-screen">
        {/* Botón de retroceso flotante */}
        <Button
          className="fixed top-24 left-4 z-30 w-12 h-12 rounded-full bg-orange-600/90 hover:bg-orange-700 text-white shadow-lg backdrop-blur-sm"
          onClick={() => router.push('/learning')}
          size="icon"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>

        <header className="flex items-center justify-between p-4 bg-orange-600/80 backdrop-blur-sm border-b border-orange-700">
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
                className="w-full justify-start text-orange-100 hover:bg-orange-600 hover:text-white"
                onClick={() => {
                  setShowMobileMenu(false);
                  router.push('/play?autoStart=true');
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
              <Button
                className="w-full justify-start text-white bg-orange-600/50 hover:bg-orange-600"
                onClick={() => {
                  setShowMobileMenu(false);
                }}
              >
                <GraduationCap className="w-5 h-5 mr-3" />
                Aprender
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-8 min-h-full">
            {/* Card y descripción - solo cuando la cámara no esté activa */}
            {!isCameraActive && (
              <div className="flex flex-col items-center">
                <div className="mb-6">
                  <TiltedCard
                    imageSrc={sign.img}
                    altText={`${sign.name} Seña`}
                    captionText={`Letra ${sign.name}`}
                    containerHeight="300px"
                    containerWidth="300px"
                    imageHeight="300px"
                    imageWidth="300px"
                    rotateAmplitude={15}
                    scaleOnHover={1.1}
                    showMobileWarning={false}
                    showTooltip={true}
                    displayOverlayContent={false}
                  />
                </div>
                
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Letra {sign.name}</h2>
                  <p className="text-orange-300 text-lg leading-relaxed max-w-md mx-auto">{sign.description}</p>
                </div>
              </div>
            )}
            
            {/* SignRecognition */}
            <div className="flex items-center justify-center">
              <SignRecognition sign={sign.name} onToggleCamera={setIsCameraActive} />
            </div>
            
            {/* Card 3D debajo del reconocimiento - solo cuando la cámara esté activa en móvil */}
            {isCameraActive && (
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <TiltedCard
                    imageSrc={sign.img}
                    altText={`${sign.name} Seña`}
                    captionText={`Letra ${sign.name}`}
                    containerHeight="250px"
                    containerWidth="250px"
                    imageHeight="250px"
                    imageWidth="250px"
                    rotateAmplitude={15}
                    scaleOnHover={1.1}
                    showMobileWarning={false}
                    showTooltip={true}
                    displayOverlayContent={false}
                  />
                </div>
                
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">Letra {sign.name}</h2>
                </div>
              </div>
            )}
          </div>
        </div>
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
                className="w-full bg-orange-700/50 hover:bg-orange-600 justify-start text-orange-100 border border-orange-600"
                onClick={() => router.push('/play')}
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
                className="w-full bg-orange-700 hover:bg-orange-600 justify-start text-white border-2 border-orange-500"
                onClick={() => {}}
              >
                <GraduationCap className="w-5 h-5 mr-3" />
                Aprender
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Vista desktop - Contenido principal */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:pl-80 lg:h-screen lg:overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-row gap-12 min-h-full">
            {/* Columna izquierda - Card y descripción */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="mb-8">
                <TiltedCard
                  imageSrc={sign.img}
                  altText={`${sign.name} Seña`}
                  captionText={`Letra ${sign.name}`}
                  containerHeight="400px"
                  containerWidth="400px"
                  imageHeight="400px"
                  imageWidth="400px"
                  rotateAmplitude={15}
                  scaleOnHover={1.1}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={false}
                />
              </div>
              
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-6">Letra {sign.name}</h2>
                <p className="text-orange-300 text-xl leading-relaxed max-w-lg mx-auto">{sign.description}</p>
              </div>
            </div>
            
            {/* Columna derecha - SignRecognition */}
            <div className="flex-1 flex items-center justify-center">
              <SignRecognition sign={sign.name} onToggleCamera={setIsCameraActive} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sign;
