import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Menu, Volume2, Camera, Hand, MessageSquare, RotateCcw, Gamepad2, BookOpen } from 'lucide-react';
import CameraPlaceholder from '@/components/CameraPlaceholder';
import Webcam from "react-webcam";

const sequenceLength = 30;

export default function Home() {
  const router = useRouter();
  const [detectedText, setDetectedText] = useState("Hola");
  const [gestureName, setGestureName] = useState<string>("");
  const [gestureSequence, setGestureSequence] = useState<string>("");
  const [isCamera, setIsCamera] = useState(false);
  const [confidence, setConfidence] = useState(94);

  const webcamRef = useRef<Webcam>(null);
  const framesRef = useRef<number>(0);

  const toggleCamera = () => setIsCamera(!isCamera);

  const resetSequence = () => {
    setGestureName("");
    setGestureSequence("");
  };

  useEffect(() => {
    const mediapipeRecognition = async (videoElement: HTMLVideoElement) => {
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
    };

    const handleMediapipe = async () => {
      if (webcamRef.current && isCamera) {
        const videoElement = webcamRef.current.video as HTMLVideoElement;
        mediapipeRecognition(videoElement);
      }
    };
    handleMediapipe();
  }, [webcamRef, isCamera]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col lg:flex-row">
      {/* Vista móvil */}
      <div className="lg:hidden relative h-screen">
        <div className="absolute inset-0 z-0">
          <CameraPlaceholder isCamera={isCamera} webcamRef={webcamRef}>
            {isCamera && (
              <>
                <p className="absolute top-10 left-0 p-4 w-full text-5xl text-white text-center font-bold uppercase pt-10 drop-shadow-lg">
                  {gestureName}
                </p>
                <p className="absolute top-20 left-0 p-4 w-full text-4xl text-white text-center break-words font-bold uppercase pt-10 drop-shadow-lg">
                  {gestureSequence}
                </p>
              </>
            )}
          </CameraPlaceholder>
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
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleCamera}
            className="text-white hover:bg-orange-700"
          >
            <Camera className="w-6 h-6" />
          </Button>
        </header>

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
                {gestureSequence || detectedText}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="absolute bottom-6 left-4 right-4 z-10">
          <div className="bg-orange-700/80 backdrop-blur-sm rounded-lg p-3 space-y-4">
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={toggleCamera}
              >
                <Camera className="w-4 h-4 mr-2" />
                {isCamera ? "Apagar" : "Encender"}
              </Button>
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={resetSequence}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
            </div>
            
            <div className="border-t border-orange-600/50"></div>
            
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
                      className="flex-shrink-0 w-12 h-12 bg-orange-600/40 border border-orange-500/50 rounded-lg flex flex-col items-center justify-center hover:bg-orange-500/50 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-6 h-6 flex items-center justify-center">
                        {svgFile ? (
                          <Image
                            src={`/Abecedario/${svgFile}`}
                            alt={`Letra ${letter} en LSM`}
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                          />
                        ) : (
                          <span className="text-xs font-bold text-orange-200">
                            {letter}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-orange-200 font-medium mt-0.5">{letter}</span>
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

        <div className="p-6 flex-1 flex flex-col min-h-0">
          <div className="flex-shrink-0">
            <h3 className="text-lg font-semibold text-orange-100 mb-4">Modo de Reconocimiento</h3>
            <div className="space-y-3 mb-6">
              <Button 
                className="w-full bg-orange-700 hover:bg-orange-600 justify-start text-white border-2 border-orange-500"
                onClick={() => {}}
              >
                <Hand className="w-5 h-5 mr-3" />
                Abecedario LSM
              </Button>
              <Button 
                className="w-full bg-orange-700/50 hover:bg-orange-600 justify-start text-orange-100 border border-orange-600"
                onClick={() => router.push('/action')}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Frases LSM
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
                Diccionario LSM
              </Button>
            </div>

            <h3 className="text-lg font-semibold text-orange-100 mb-4">Abecedario LSM</h3>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
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
                    className="bg-orange-600/30 border-orange-500/50 hover:bg-orange-500/50 transition-all duration-300 cursor-pointer group aspect-square"
                  >
                    <CardContent className="p-3 flex flex-col items-center justify-center gap-2 h-full">
                      <div className="w-16 h-16 flex items-center justify-center bg-orange-400/20 group-hover:bg-orange-400/30 transition-all duration-300 rounded">
                        {svgFile ? (
                          <Image
                            src={`/Abecedario/${svgFile}`}
                            alt={`Letra ${letter} en LSM`}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <span className="text-xl font-bold text-orange-400 group-hover:text-white transition-all duration-300">
                            {letter}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-center text-orange-200 group-hover:text-white transition-colors font-medium">
                        {letter}
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
      <main className="hidden lg:flex lg:flex-1 lg:flex-col lg:p-6 lg:max-w-7xl lg:mx-auto lg:pl-80 lg:h-screen lg:overflow-hidden">
        <div className="flex flex-col h-full gap-4">
          <div className="flex gap-3 justify-center flex-shrink-0">
            <Button 
              className="bg-orange-500 hover:bg-orange-600"
              onClick={toggleCamera}
            >
              <Camera className="w-5 h-5 mr-2" />
              {isCamera ? "Apagar Cámara" : "Encender Cámara"}
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600"
              onClick={resetSequence}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reiniciar Captura
            </Button>
          </div>

          <div className="flex-1 min-h-0">
            <CameraPlaceholder isCamera={isCamera} webcamRef={webcamRef}>
              {isCamera && (
                <>
                  <p className="absolute top-10 left-0 p-4 w-full text-5xl text-white text-center font-bold uppercase pt-10 drop-shadow-lg">
                    {gestureName}
                  </p>
                  <p className="absolute top-20 left-0 p-4 w-full text-4xl text-white text-center break-words font-bold uppercase pt-10 drop-shadow-lg">
                    {gestureSequence}
                  </p>
                </>
              )}
            </CameraPlaceholder>
          </div>

          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <Card className="bg-orange-700/50 border-orange-600 w-full max-w-md">
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
                    {gestureSequence || detectedText}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-700/50 border-orange-600 w-full max-w-md">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-100">Confianza</span>
                  <span className="text-sm font-medium text-orange-400">{confidence}%</span>
                </div>
                <div className="w-full bg-orange-600 rounded-full h-2 mt-2 overflow-hidden">
                  <div 
                    className="bg-orange-400 h-2 rounded-full"
                    style={{ width: `${confidence}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
