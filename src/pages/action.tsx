import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, CameraOff, Hand, MessageSquare, Volume2, Trash2, Gamepad2, BookOpen, Menu, GraduationCap, Loader2 } from 'lucide-react';
import dynamic from "next/dynamic";

// Importar el componente MobileActionRecognition dinámicamente
const MobileActionRecognition = dynamic(
  () => import("@/components/MobileActionRecognition"),
  { ssr: false }
);
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { Holistic, Results } from "@mediapipe/holistic";
import { Camera as MediapipeCamera } from "@mediapipe/camera_utils";

const extractKeyPoints = (results: Results) => {
  const pose: number[] = results.poseLandmarks
    ? results.poseLandmarks
        .map((res) => [res.x, res.y, res.z, res.visibility])
        .flat()
    : Array(33 * 4).fill(0);

  const face: number[] = results.faceLandmarks
    ? results.faceLandmarks.map((res) => [res.x, res.y, res.z]).flat()
    : Array(468 * 3).fill(0);

  const leftHand: number[] = results.leftHandLandmarks
    ? results.leftHandLandmarks.map((res) => [res.x, res.y, res.z]).flat()
    : Array(21 * 3).fill(0);

  const rightHand: number[] = results.rightHandLandmarks
    ? results.rightHandLandmarks.map((res) => [res.x, res.y, res.z]).flat()
    : Array(21 * 3).fill(0);

  return [...pose, ...face, ...leftHand, ...rightHand];
};

const sequenceLength = 30;

const actions = ['abrazar', 'agarrar', 'aplastar', 'bailar', 'caminar', 'cerrar', 'fabrica', 'frio', 'golpear', 'guardar', 'invitar', 'jugar', 'libro', 'luna', 'sin_accion', 'Tijuana'];

export default function ActionPage() {
  const router = useRouter();
  const [detectedText, setDetectedText] = useState("");
  const [predictedAction, setPredictedAction] = useState<string>("");
  const [isCamera, setIsCamera] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [displayedConfidence, setDisplayedConfidence] = useState(0);
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const webcamRef = useRef<Webcam>(null);
  const sequence = useRef<number[][]>([]);

  const toggleCamera = () => setIsCamera(!isCamera);

  const resetSequence = () => {
    setPredictedAction("");
    setDetectedText("Hola");
    sequence.current = [];
  };

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

  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      const modelLoaded = await tf.loadGraphModel("../../model.json");
      setModel(modelLoaded);
      setIsModelLoading(false);
    } catch (error) {
      console.error(error);
      setIsModelLoading(false);
    }
  };

  async function onFrame(results: Results) {
    if (model) {
      const keypoints = extractKeyPoints(results);

      sequence.current.push(keypoints);

      if (sequence.current.length === sequenceLength) {
        const inputData = tf.tensor([sequence.current]);
        const prediction = await model.predictAsync(inputData) as tf.Tensor;
        const predictionArray = await prediction.data();
        const predictedClassIndex = predictionArray.indexOf(Math.max(...predictionArray));
        const action = actions[predictedClassIndex];
        
        setPredictedAction(action);
        setDetectedText(action);
        const maxScore = predictionArray[predictedClassIndex];
        if (typeof maxScore === 'number' && isFinite(maxScore)) {
          setConfidence(Math.round(maxScore * 100));
        }

        sequence.current = [];
      }
    }
  }

  useEffect(() => {
    // Animate displayedConfidence towards confidence with a small delay
    const target = Math.max(0, Math.min(100, confidence));
    const startValue = displayedConfidence;
    const durationMs = 180;
    const delayMs = 10;
    let startTime: number | null = null;
    let rafId = 0;

    const timeoutId = setTimeout(() => {
      const step = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const t = Math.min(1, elapsed / durationMs);
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

  useEffect(() => {
    // Solo cargar modelo en desktop (lg y superior)
    const isDesktop = window.innerWidth >= 1024;
    
    if (isDesktop && isCamera) {
    loadModel();
    }
  }, [isCamera]);

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

  useEffect(() => {
    // Solo ejecutar MediaPipe en desktop (lg y superior)
    const isDesktop = window.innerWidth >= 1024;
    
    if (!isDesktop) {
      return; // No ejecutar en móvil
    }

    const mediapipeDetection = async (videoElement: HTMLVideoElement) => {
      const holistic = new Holistic({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        }
      });

      holistic.setOptions({
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      holistic.onResults((results) => {
        onFrame(results);
      });

      const camera = new MediapipeCamera(videoElement, {
        onFrame: async () => {
          await holistic.send({ image: videoElement });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    };

    const handleMediapipe = async () => {
      if (webcamRef.current && isCamera) {
        const videoElement = webcamRef.current.video as HTMLVideoElement;
        mediapipeDetection(videoElement);
      }
    };
    handleMediapipe();
  }, [webcamRef, isCamera, model]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col lg:flex-row">
      {/* Vista móvil - Usando el componente MobileActionRecognition */}
      <div className="lg:hidden">
        <MobileActionRecognition />
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
            <Button 
            size="icon"
            className="w-12 h-12 bg-orange-500/90 hover:bg-orange-600 backdrop-blur-sm rounded-full"
              onClick={resetSequence}
            title="Reiniciar Captura"
            >
            <Trash2 className="w-5 h-5" />
            </Button>
          </div>

        {/* Cámara a pantalla completa */}
        <div className="w-full h-full relative">
            {isCamera ? (
              <Webcam
                ref={webcamRef}
              className="w-full h-full object-cover"
                mirrored={true}
                videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: "user",
                }}
              />
            ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
              <div 
                className="cursor-pointer hover:scale-110 transition-transform duration-200"
                onClick={toggleCamera}
              >
                <Camera className="w-32 h-32 text-neutral-600 hover:text-neutral-500 transition-colors duration-200" />
              </div>
            </div>
          )}
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
                  <h3 className="text-sm font-medium text-orange-100">Frase Detectada</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 rounded-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300"
                    onClick={() => {
                      if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(predictedAction || detectedText);
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
                    {predictedAction || detectedText}
                  </p>
                </div>
              </CardContent>
            </Card>

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
          </div>
        )}
      </main>
    </div>
  );
}
