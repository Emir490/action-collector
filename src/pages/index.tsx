import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Menu, Volume2, Camera, Hand } from 'lucide-react';
import CameraPlaceholder from '@/components/CameraPlaceholder';
import PhraseCarousel from '@/components/PhraseCarousel';
import { commonPhrases } from '@/lib/data';
import Carousel from "@/components/carousel";
import Webcam from "react-webcam";

const sequenceLength = 30;

export default function Home() {
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
            <h1 className="text-2xl font-bold text-white">SignAI</h1>
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
                Reiniciar
              </Button>
            </div>
            
            <div>
              <h2 className="text-base font-semibold text-orange-100 mb-2">Frases Comunes</h2>
              <PhraseCarousel phrases={commonPhrases} />
            </div>
          </div>
        </div>
      </div>

      {/* Vista desktop - Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-80 lg:h-screen lg:bg-orange-600/90 lg:border-r lg:border-orange-700">
        <div className="p-6 border-b border-orange-700 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-white">SignAI</h1>
          </div>
          <p className="text-orange-100 text-sm">Por un México Inclusivo</p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto relative">
          <div>
            <h3 className="text-lg font-semibold text-orange-100 mb-4">Frases Comunes</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {commonPhrases.map((phrase, index) => (
                <Card 
                  key={index}
                  className="bg-orange-700/50 border-orange-600 hover:bg-orange-600/50 transition-all duration-300 cursor-pointer group"
                >
                  <CardContent className="p-3 flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                      <Hand className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs text-center text-orange-100 group-hover:text-white transition-colors font-medium">
                      {phrase.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={toggleCamera}
              >
                <Camera className="w-5 h-5 mr-3" />
                {isCamera ? "Apagar Cámara" : "Encender Cámara"}
              </Button>
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={resetSequence}
              >
                Reiniciar Captura
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Vista desktop - Contenido principal */}
      <main className="hidden lg:flex lg:flex-1 lg:flex-col lg:p-8 lg:max-w-4xl lg:mx-auto">
        <div className="lg:flex lg:flex-col lg:gap-6 lg:items-stretch">
          <div className="lg:flex-1 lg:min-h-[600px]">
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

          <div className="lg:flex lg:flex-col lg:items-center space-y-4">
            <Card className="bg-orange-700/50 border-orange-600 lg:w-auto lg:min-w-[300px]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-orange-100">Texto Detectado</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-10 h-10 rounded-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300"
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
                <div className="relative">
                  <p className="text-3xl font-bold text-white text-center">
                    {gestureSequence || detectedText}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="bg-orange-700/50 border-orange-600">
                <CardContent className="p-4">
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
        </div>
      </main>
      
      <Carousel />
    </div>
  );
}
