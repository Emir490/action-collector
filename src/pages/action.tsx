import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Hand, MessageSquare, Volume2, RotateCcw, Gamepad2, BookOpen } from 'lucide-react';
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
  const [detectedText, setDetectedText] = useState("Hola");
  const [predictedAction, setPredictedAction] = useState<string>("");
  const [isCamera, setIsCamera] = useState(false);
  const [confidence, setConfidence] = useState(94);
  const [model, setModel] = useState<tf.GraphModel | null>(null);

  const webcamRef = useRef<Webcam>(null);
  const sequence = useRef<number[][]>([]);

  const toggleCamera = () => setIsCamera(!isCamera);

  const resetSequence = () => {
    setPredictedAction("");
    setDetectedText("Hola");
    sequence.current = [];
  };

  const loadModel = async () => {
    try {
      const modelLoaded = await tf.loadGraphModel("../../model.json");
      setModel(modelLoaded);
    } catch (error) {
      console.error(error);
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

        sequence.current = [];
      }
    }
  }

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
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
      {/* Vista móvil */}
      <div className="lg:hidden relative h-screen">
        <div className="absolute inset-0 z-0">
          {isCamera ? (
            <Webcam
              ref={webcamRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "user",
              }}
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
              <Camera className="w-24 h-24 text-neutral-600" />
            </div>
          )}
          {isCamera && (
            <>
              <p className="absolute top-10 left-0 p-4 w-full text-5xl text-white text-center font-bold uppercase pt-10 drop-shadow-lg">
                {predictedAction}
              </p>
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
                      const utterance = new SpeechSynthesisUtterance(predictedAction || detectedText);
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
                {predictedAction || detectedText}
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
              <h2 className="text-base font-semibold text-orange-100 mb-2">Frases LSM</h2>
              <div className="grid grid-cols-3 gap-2">
                {actions.filter(action => action !== 'sin_accion').map((action, index) => (
                  <div 
                    key={index}
                    className="p-2 bg-orange-600/40 border border-orange-500/50 rounded-lg text-center hover:bg-orange-500/50 transition-all duration-300 cursor-pointer"
                  >
                    <span className="text-xs text-orange-200 font-medium">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vista desktop - Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-96 lg:h-screen lg:bg-orange-600/90 lg:border-r lg:border-orange-700 lg:overflow-hidden lg:fixed lg:left-0 lg:top-0">
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
          <p className="text-orange-100 text-sm">Por un México Inclusivo</p>
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
                className="w-full bg-orange-700 hover:bg-orange-600 justify-start text-white border-2 border-orange-500"
                onClick={() => {}}
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

            <h3 className="text-lg font-semibold text-orange-100 mb-4">Frases LSM Reconocibles</h3>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="grid grid-cols-2 gap-2 pb-4">
              {actions.filter(action => action !== 'sin_accion').map((action, index) => (
                <Card 
                  key={index}
                  className="bg-orange-600/30 border-orange-500/50 hover:bg-orange-500/50 transition-all duration-300 cursor-pointer group"
                >
                  <CardContent className="p-3 flex items-center justify-center">
                    <p className="text-sm text-center text-orange-200 group-hover:text-white transition-colors font-medium">
                      {action}
                    </p>
                  </CardContent>
                </Card>
              ))}
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

          <div className="flex-1 min-h-0 relative">
            {isCamera ? (
              <Webcam
                ref={webcamRef}
                className="w-full h-full object-cover rounded-lg"
                videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: "user",
                }}
              />
            ) : (
              <div className="w-full h-full bg-neutral-800 rounded-lg flex items-center justify-center">
                <Camera className="w-32 h-32 text-neutral-600" />
              </div>
            )}
            {isCamera && (
              <>
                <p className="absolute top-10 left-0 right-0 text-5xl text-white text-center font-bold uppercase drop-shadow-lg">
                  {predictedAction}
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <Card className="bg-orange-700/50 border-orange-600 w-full max-w-md">
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
