import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Menu, Volume2, Camera, CameraOff, Hand, MessageSquare, Trash2, Gamepad2, BookOpen, ChevronDown, GraduationCap, Loader2 } from 'lucide-react';
import CameraPlaceholder from '@/components/CameraPlaceholder';
import Webcam from "react-webcam";

const sequenceLength = 30;

export default function Home() {
  const router = useRouter();
  const [detectedText, setDetectedText] = useState("");
  const [gestureName, setGestureName] = useState<string>("");
  const [gestureSequence, setGestureSequence] = useState<string>("");
  const [isCamera, setIsCamera] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [displayedConfidence, setDisplayedConfidence] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const framesRef = useRef<number>(0);
  const [isCompact, setIsCompact] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleCamera = () => setIsCamera(!isCamera);

  const resetSequence = () => {
    setGestureName("");
    setGestureSequence("");
    setDetectedText("");
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsCompact(container.scrollTop > 40); // activa modo compacto al scrollear 40px
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
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

  useEffect(() => {
    const mediapipeRecognition = async (videoElement: HTMLVideoElement) => {
      setIsModelLoading(true);
      try {
        const { FilesetResolver, GestureRecognizer } = await import(
          "@mediapipe/tasks-vision"
        );
        const { Camera } = await import("@mediapipe/camera_utils");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const gestureRecognizer = await GestureRecognizer.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath: "../../gesture_recognizer.task",
            },
          }
        );

        gestureRecognizer.setOptions({ runningMode: "VIDEO" });
        setIsModelLoading(false);

      let lastGesture = "";

      const camera = new Camera(videoElement, {
        onFrame: async () => {
          ++framesRef.current;

          if (framesRef.current === sequenceLength) {
            framesRef.current = 0;
            const results = gestureRecognizer.recognizeForVideo(
              videoElement,
              Date.now()
            );
            const gestures = results.gestures[0];
            if (gestures && gestures[0].categoryName !== lastGesture) {
              setGestureName(gestures[0].categoryName);
              setDetectedText(gestures[0].categoryName);
              if (typeof gestures[0].score === 'number') {
                setConfidence(Math.round(gestures[0].score * 100));
              }
              if (gestures[0].categoryName === "espacio") {
                setGestureSequence((oldSequence) => oldSequence + " ");
              } else if (gestures[0].categoryName === "del") {
                setGestureSequence((oldSequence) => oldSequence.slice(0, -1));
              } else {
                setGestureSequence(
                  (oldSequence) => oldSequence + gestures[0].categoryName
                );
              }
              lastGesture = gestures[0].categoryName;
            }
          }
        },
        width: 1280,
        height: 720,
      });
      camera.start();
      } catch (error) {
        console.error('Error loading model:', error);
        setIsModelLoading(false);
      }
    };

    const handleMediapipe = async () => {
      if (webcamRef.current && isCamera) {
        const videoElement = webcamRef.current.video as HTMLVideoElement;
        await mediapipeRecognition(videoElement);
      }
    };
    
    if (isCamera) {
      handleMediapipe();
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

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col lg:flex-row">
      {/* Vista móvil */}
      <div className="lg:hidden relative h-screen">
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
              onClick={resetSequence}
              className="text-white hover:bg-orange-700"
            >
              <Trash2 className="w-6 h-6" />
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
                className="w-full justify-start text-white bg-orange-600/50 hover:bg-orange-600"
                onClick={() => {
                  setShowMobileMenu(false);
                }}
              >
                <Hand className="w-5 h-5 mr-3" />
                Abecedario LSM
              </Button>
              <Button
                className="w-full justify-start text-orange-100 hover:bg-orange-600 hover:text-white"
                onClick={() => {
                  setShowMobileMenu(false);
                  router.push('/action');
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

        <div className="absolute top-20 left-4 right-4 z-10">
          <Card className="bg-orange-700/80 backdrop-blur-sm border-orange-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-orange-100">Frase Detectada</h3>
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-10 h-10 rounded-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 hover:text-orange-200 border border-orange-400/30"
                  onClick={() => {
                    if ('speechSynthesis' in window) {
                      const utterance = new SpeechSynthesisUtterance(gestureSequence || detectedText);
                      utterance.lang = 'es-MX';
                      utterance.rate = 0.8;
                      speechSynthesis.speak(utterance);
                    }
                  }}
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-2xl font-bold text-white text-center">
                {(gestureSequence || detectedText).toUpperCase()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="absolute bottom-6 left-4 right-4 z-10">
          <div className="bg-orange-700/80 backdrop-blur-sm rounded-lg p-3 space-y-4">
            
            <div>
              <h2 className="text-base font-semibold text-orange-100 mb-2">Abecedario LSM</h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {Array.from('ABCDEFGHIJKLMNÑOPQRSTUVWXYZ').map((letter, index) => {
                  const getLetterFile = (letter: string) => {
                    const letterMap: { [key: string]: string } = {
                      'A': 'A.svg',
                      'B': 'B.svg', 
                      'C': 'c.svg',
                      'D': 'd.svg',
                      'E': 'e.svg',
                      'F': 'f.svg',
                      'G': 'g.svg',
                      'H': 'h.svg',
                      'I': 'i.svg',
                      'J': 'j.svg',
                      'K': 'k.svg',
                      'L': 'l.svg',
                      'M': 'm.svg',
                      'N': 'n.svg',
                      'Ñ': 'nn.svg',
                      'O': 'o.svg',
                      'P': 'p.svg',
                      'Q': 'q.svg',
                      'R': 'r.svg',
                      'S': 's.svg',
                      'T': 't.svg',
                      'U': 'u.svg',
                      'V': 'v.svg',
                      'W': 'w.svg',
                      'X': 'x.svg',
                      'Y': 'y.svg',
                      'Z': 'z.svg'
                    };
                    return letterMap[letter];
                  };
                  
                  const svgFile = getLetterFile(letter);
                  
                  return (
                    <div 
                      key={index}
                      className="flex-shrink-0 w-20 h-20 bg-orange-400/20 border border-orange-400/40 rounded-lg flex flex-col items-center justify-center"
                    >
                      <div className="w-16 h-16 flex items-center justify-center">
                        {svgFile ? (
                          <Image
                            src={`/Abecedario/${svgFile}`}
                            alt={`Letra ${letter} en LSM`}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-contain"
                          />
                        ) : (
                          <span className="text-xl font-bold text-orange-200">
                            {letter.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-orange-200 font-medium mt-0.5">{letter.toUpperCase()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
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
                { label: 'Abecedario LSM', icon: Hand, active: true },
                { label: 'Acción', icon: MessageSquare, route: '/action' },
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
            <h3 className="text-lg font-semibold text-orange-100 mb-4">Abecedario LSM</h3>
            <div className="grid grid-cols-2 gap-2 pb-4">
              {Array.from('ABCDEFGHIJKLMNÑOPQRSTUVWXYZ').map((letter, index) => {
                const getLetterFile = (letter: string) => {
                  const letterMap: { [key: string]: string } = {
                    'A': 'A.svg',
                    'B': 'B.svg', 
                    'C': 'c.svg',
                    'D': 'd.svg',
                    'E': 'e.svg',
                    'F': 'f.svg',
                    'G': 'g.svg',
                    'H': 'h.svg',
                    'I': 'i.svg',
                    'J': 'j.svg',
                    'K': 'k.svg',
                    'L': 'l.svg',
                    'M': 'm.svg',
                    'N': 'n.svg',
                    'Ñ': 'nn.svg',
                    'O': 'o.svg',
                    'P': 'p.svg',
                    'Q': 'q.svg',
                    'R': 'r.svg',
                    'S': 's.svg',
                    'T': 't.svg',
                    'U': 'u.svg',
                    'V': 'v.svg',
                    'W': 'w.svg',
                    'X': 'x.svg',
                    'Y': 'y.svg',
                    'Z': 'z.svg'
                  };
                  return letterMap[letter];
                };
                
                const svgFile = getLetterFile(letter);
                
                return (
                  <Card 
                    key={index}
                    className="bg-orange-400/20 border-orange-400/40 aspect-square"
                  >
                    <CardContent className="p-3 flex flex-col items-center justify-center gap-2 h-full">
                      <div className="w-24 h-24 flex items-center justify-center transition-all duration-200 rounded">
                        {svgFile ? (
                          <Image
                            src={`/Abecedario/${svgFile}`}
                            alt={`Letra ${letter} en LSM`}
                            width={96}
                            height={96}
                            className="w-20 h-20 object-contain"
                          />
                        ) : (
                          <span className="text-xl font-bold text-orange-400">
                            {letter.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-center text-orange-200 font-medium">
                        {letter.toUpperCase()}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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
                  <h3 className="text-sm font-medium text-orange-100">Texto Detectado</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 rounded-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300"
                    onClick={() => {
                      if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(gestureSequence || detectedText);
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
                    {(gestureSequence || detectedText).toUpperCase()}
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
