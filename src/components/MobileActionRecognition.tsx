import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Menu, Volume2, Camera, CameraOff, Hand, MessageSquare, Trash2, Gamepad2, BookOpen, ChevronDown, GraduationCap, Loader2 } from 'lucide-react';
import CameraPlaceholder from '@/components/CameraPlaceholder';
import Webcam from "react-webcam";
import useMobileRecognition from "@/hooks/useMobileRecognition";
import * as tf from "@tensorflow/tfjs";
import { setupHandLandmarker } from "@/helpers/handLandmarker";
import { extractHandsKeypoints } from "@/helpers/extractKeypoints";
import { HandLandmarkerResult } from "@mediapipe/tasks-vision";

const actions = [
  "abrazar",
  "caminar",
  "frio",
  "libro",
  "invitar",
  "agarrar",
  "aplastar",
  "bailar",
  "cerrar",
  "fabrica",
  "golpear",
  "guardar",
  "jugar",
  "luna",
  "sin_accion",
  "Tijuana",
];
const sequenceLength = 30;

const MobileActionRecognition: React.FC = () => {
  const router = useRouter();
  const { loadModel, model, predictedAction, setPredictedAction } =
    useMobileRecognition();
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facingMode, setFacingMode] = useState<'user'|'environment'>('user');
  const [isCamera, setIsCamera] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [displayedConfidence, setDisplayedConfidence] = useState(0);
  const [showCards, setShowCards] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sequence = useRef<number[][]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleCamera = () => setIsCamera(!isCamera);
  const toggleFacingMode = () => setFacingMode(fm => fm === 'user' ? 'environment' : 'user');

  const resetSequence = () => {
    setPredictedAction("");
    setConfidence(0);
    setDisplayedConfidence(0);
  };

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        setScrolled(sidebarRef.current.scrollTop > 40);
      }
    };
    const sidebar = sidebarRef.current;
    sidebar?.addEventListener('scroll', handleScroll);
    return () => sidebar?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Animate displayedConfidence towards confidence with a small delay
    const target = Math.max(0, Math.min(100, confidence));
    const startValue = displayedConfidence;
    const durationMs = 180; // very fast animation duration
    const delayMs = 10; // tiny delay before animating
    let startTime: number | null = null;
    let rafId = 0;

    const timeoutId = setTimeout(() => {
      const step = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const t = Math.min(1, elapsed / durationMs);
        // easeOutQuad easing
        const eased = t * (2 - t);
        const value = Math.round(startValue + (target - startValue) * eased);
        setDisplayedConfidence(value);
        if (t < 1) {
          rafId = requestAnimationFrame(step);
        }
      };
      rafId = requestAnimationFrame(step);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [confidence, displayedConfidence]);

  // when camera & model ready, start Mediapipe
  useEffect(() => {
    if (isCamera && webcamRef.current && model) {
      const setupCamera = async () => {
        setIsModelLoading(true);
        try {
          // Ensure video element is properly initialized
          const video = webcamRef.current!.video as HTMLVideoElement;
          
          // Wait for the video element to be ready
          if (video.readyState < 2) {
            await new Promise<void>((resolve) => {
              video.onloadeddata = () => resolve();
              // Fallback in case the event doesn't fire
              setTimeout(resolve, 1000);
            });
          }

          // Now setup the hand landmarker
          await setupHandLandmarker(
            video,
            onFrame,
            false,
          );
          
          setIsModelLoading(false);
        } catch (error) {
          console.error("Error setting up mobile camera:", error);
          setIsModelLoading(false);
        }
      };
      console.log("Loading model...");
      setupCamera();
    }
    
  }, [isCamera, model]);

  // Controlar la animación de los cards
  useEffect(() => {
    if (isCamera && !isModelLoading) {
      // Pequeño delay para asegurar que el modelo esté completamente cargado
      const timer = setTimeout(() => {
        setShowCards(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowCards(false);
    }
  }, [isCamera, isModelLoading]);

  async function onFrame(results: HandLandmarkerResult) {
    if (!model) return;

    const { leftHand, rightHand } = extractHandsKeypoints(results);
    const frameKP = [...leftHand, ...rightHand];
    sequence.current.push(frameKP);

    if (sequence.current.length === sequenceLength) {
      // Convert the sequence to a tensor
      const inputData = tf.tensor([sequence.current]);

      const prediction = model.predict(inputData) as tf.Tensor;

      // Convert the tensor to a regular array and handle the prediction
      const predictionArray = await prediction.data();

      // Assuming a classification model, find the index of the maximum value (highest probability)
      const predictedClassIndex = predictionArray.indexOf(
        Math.max(...predictionArray)
      );

      const action = actions[predictedClassIndex];
      console.log(`Predicted action: ${action}`);
      setPredictedAction(action); // Update the predicted action
      
      // Calculate confidence percentage
      const maxScore = predictionArray[predictedClassIndex];
      if (typeof maxScore === 'number' && isFinite(maxScore)) {
        setConfidence(Math.round(maxScore * 100));
      }
      
      sequence.current = [];
    }
  }

  return (
    <div className="fixed inset-0 bg-neutral-900 text-white flex flex-col lg:flex-row">
      {/* Vista móvil */}
      <div className="lg:hidden relative w-full h-full">
        <div className="absolute inset-0 z-0 w-full h-full">
          <CameraPlaceholder isCamera={isCamera} webcamRef={webcamRef} onToggleCamera={toggleCamera}>
          </CameraPlaceholder>
          
          {/* Overlay de carga del modelo */}
          {isModelLoading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                <p className="text-white text-lg font-medium">Cargando modelo...</p>
              </div>
            </div>
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
          onClick={toggleCamera}
              className="text-white hover:bg-orange-700"
            >
              {isCamera ? <CameraOff className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
            </Button>
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
                className="w-full justify-start text-white bg-orange-600/50 hover:bg-orange-600"
                onClick={() => {
                  setShowMobileMenu(false);
                }}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Acción
              </Button>
              <Button
                className="w-full justify-start text-orange-100 hover:bg-orange-600 hover:text-white"
                onClick={() => {
                  setShowMobileMenu(false);
                  // Auto-start game in mobile
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
                className="w-full justify-start text-orange-100 hover:bg-orange-600 hover:text-white"
                onClick={() => {
                  setShowMobileMenu(false);
                  router.push('/learning');
                }}
              >
                <GraduationCap className="w-5 h-5 mr-3" />
                Aprender
              </Button>
            </div>
          </div>
        )}

        {/* Cards con animación de entrada */}
        {isCamera && !isModelLoading && predictedAction && predictedAction !== 'sin_accion' && (
          <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-500 ease-in-out ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Card className={`bg-orange-700/80 backdrop-blur-sm border-orange-600 transition-all duration-700 ease-in-out delay-100 w-fit ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2 gap-3">
                  <h3 className="text-sm font-medium text-orange-100 whitespace-nowrap">Acción Detectada</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-10 h-10 rounded-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 hover:text-orange-200 border border-orange-400/30 flex-shrink-0"
                    onClick={() => {
                      if ('speechSynthesis' in window && predictedAction && predictedAction !== 'sin_accion') {
                        const utterance = new SpeechSynthesisUtterance(predictedAction);
                        utterance.lang = 'es-MX';
                        utterance.rate = 0.8;
                        speechSynthesis.speak(utterance);
                      }
                    }}
                  >
                    <Volume2 className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-2xl font-bold text-white text-center whitespace-nowrap">
                  {predictedAction.charAt(0).toUpperCase() + predictedAction.slice(1).toLowerCase()}
                </p>
              </CardContent>
            </Card>
          </div>
        )}


        {/* Círculo de confianza independiente, arriba del carrusel */}
        {isCamera && !isModelLoading && predictedAction && predictedAction !== 'sin_accion' && (
          <div className={`absolute bottom-44 right-4 z-10 transition-all duration-500 ease-in-out delay-200 ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-orange-600/90 backdrop-blur-sm rounded-full p-2 border border-orange-500 shadow-lg">
              <div className="relative w-10 h-10">
                {/* Círculo de fondo */}
                <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-orange-700"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="transparent"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Círculo de progreso */}
                  <path
                    className="text-orange-300 transition-all duration-300 ease-out"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="transparent"
                    strokeDasharray={`${displayedConfidence}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                {/* Porcentaje en el centro */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-orange-200">{displayedConfidence}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-6 left-4 right-4 z-10">
          <div className="bg-orange-700/80 backdrop-blur-sm rounded-lg p-3 space-y-4">
            
            <div>
              <h2 className="text-base font-semibold text-orange-100 mb-2">Acciones Reconocibles</h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {actions.filter(action => action !== 'sin_accion').map((action, index) => {
                  const file = `/Accion/${action.toLowerCase()}.svg`;
                  return (
                    <div 
                      key={index}
                      className="flex-shrink-0 w-20 h-20 bg-orange-400/20 border border-orange-400/40 rounded-lg flex flex-col items-center justify-center"
                    >
                      <div className="w-16 h-16 flex items-center justify-center">
                        <Image
                          src={file}
                          alt={`Acción ${action} en LSM`}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-contain invert"
                        />
                      </div>
                      <span className="text-[11px] text-orange-200 font-medium mt-0.5">{action.charAt(0).toUpperCase() + action.slice(1)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vista desktop - Sidebar */}
      <div 
        ref={sidebarRef}
        className="hidden lg:flex lg:flex-col lg:w-80 lg:h-screen lg:bg-orange-600/90 lg:border-r lg:border-orange-700 lg:overflow-y-auto lg:fixed lg:left-0 lg:top-0"
      >
        {/* Header */}
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

        {/* Botones */}
        <div className="sticky top-0 z-20 bg-orange-600/90 backdrop-blur supports-[backdrop-filter]:bg-orange-600/70 border-b border-orange-700 p-6">
          <h3 className="text-lg font-semibold text-orange-100 mb-4">
            Modo de Reconocimiento
          </h3>
          <div className={`${scrolled ? 'flex flex-row gap-4 justify-center' : 'space-y-3'}`}>
            {[
              { label: 'Abecedario LSM', icon: Hand, route: '/' },
              { label: 'Acción', icon: MessageSquare, route: '/mobile', active: true },
              { label: 'Jugar', icon: Gamepad2, route: '/play' },
              { label: 'Contribuir', icon: BookOpen, route: '/menu' },
              { label: 'Aprender', icon: GraduationCap, route: '/learning' },
            ].map((btn, i) => {
              const Icon = btn.icon;
              return (
              <Button 
                  key={i}
                  className={`transition-all duration-200 ${
                    scrolled
                      ? 'w-12 h-12 justify-center rounded-full p-0' // botones redondos en modo compacto
                      : 'w-full justify-start rounded-full' // forma original
                  } ${
                    btn.active
                      ? 'bg-orange-700 hover:bg-orange-600 text-white border-2 border-orange-500'
                      : 'bg-orange-700/50 hover:bg-orange-600 text-orange-100 border border-orange-600'
                  }`}
                  onClick={() => btn.route && router.push(btn.route)}
                >
                  <Icon className={`w-5 h-5 ${scrolled ? '' : 'mr-3'}`} />
                  {!scrolled && btn.label}
              </Button>
              );
            })}
          </div>
          </div>

        {/* Acciones */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-orange-100 mb-4">Acciones Reconocibles</h3>
            <div className="grid grid-cols-2 gap-2 pb-4">
              {actions.filter(action => action !== 'sin_accion').map((action, index) => {
                const file = `/Accion/${action.toLowerCase()}.svg`;
                return (
                  <Card 
                    key={index}
                  className="bg-orange-400/20 border-orange-400/40 aspect-square"
                  >
                    <CardContent className="p-3 flex flex-col items-center justify-center gap-2 h-full">
                      <div className="w-24 h-24 flex items-center justify-center rounded">
                        <Image
                          src={file}
                          alt={`Frase ${action} en LSM`}
                        width={96}
                        height={96}
                          className="w-20 h-20 object-contain invert"
                        />
                      </div>
                    <p className="text-sm text-center text-orange-200 font-medium">
                        {action.charAt(0).toUpperCase() + action.slice(1)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </div>

      {/* Vista desktop - Contenido principal */}
      <main className="hidden lg:flex lg:flex-1 lg:flex-col lg:pl-80 lg:h-screen lg:overflow-hidden">
        {/* Controles superiores flotantes */}
        <div className="absolute top-6 right-6 z-20 flex gap-3">
          <Button 
            size="icon"
            className="w-12 h-12 bg-orange-500/90 hover:bg-orange-600 backdrop-blur-sm rounded-full"
            onClick={toggleCamera}
            title={isCamera ? "Apagar Cámara" : "Encender Cámara"}
          >
            {isCamera ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
          </Button>
        </div>

        {/* Cámara a pantalla completa */}
        <div className="w-full h-full relative">
          <CameraPlaceholder isCamera={isCamera} webcamRef={webcamRef} onToggleCamera={toggleCamera}>
          </CameraPlaceholder>
          {/* Gradiente para mejorar legibilidad de los cards */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-neutral-900/80 via-neutral-900/40 to-transparent pointer-events-none"></div>
          
          {/* Overlay de carga del modelo */}
          {isModelLoading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
                <p className="text-white text-xl font-medium">Cargando modelo...</p>
              </div>
            </div>
          )}
        </div>

        {/* Cards flotantes en la parte inferior - solo cuando la cámara esté activa y el modelo cargado */}
        {isCamera && !isModelLoading && (
          <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-3 transition-all duration-500 ease-in-out ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ left: 'calc(50% + 160px)' }}>
            <Card className={`bg-orange-700/90 border-orange-600 backdrop-blur-sm transition-all duration-700 ease-in-out delay-100 ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-orange-100">Acción Detectada</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 rounded-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300"
                    onClick={() => {
                      if ('speechSynthesis' in window && predictedAction && predictedAction !== 'sin_accion') {
                        const utterance = new SpeechSynthesisUtterance(predictedAction);
                        utterance.lang = 'es-MX';
                        utterance.rate = 0.8;
                        speechSynthesis.speak(utterance);
                      }
                    }}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative">
                  <p className="text-2xl font-bold text-white text-center">
                    {predictedAction && predictedAction !== 'sin_accion' 
                      ? predictedAction.charAt(0).toUpperCase() + predictedAction.slice(1).toLowerCase()
                      : ''
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {predictedAction && predictedAction !== 'sin_accion' && (
              <Card className={`bg-orange-700/90 border-orange-600 backdrop-blur-sm transition-all duration-700 ease-in-out delay-200 ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-orange-100">Confianza:</span>
                    <span className="text-sm font-medium text-orange-400">{displayedConfidence}%</span>
                  </div>
                  <div className="w-full bg-orange-600 rounded-full h-2 mt-2 overflow-hidden">
                    <div 
                      className="bg-orange-400 h-2 rounded-full transition-[width] duration-200 ease-out"
                      style={{ width: `${displayedConfidence}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      )}
      </main>
    </div>
  );
};

export default MobileActionRecognition;
