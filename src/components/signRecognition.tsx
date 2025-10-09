import { useRouter } from "next/router";
import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Check } from "lucide-react";

type Props = {
  sign: string;
  onToggleCamera?: (isActive: boolean) => void;
};

const sleep = (seconds: number) => new Promise((r) => setTimeout(r, seconds * 1000));

const SignRecognition: React.FC<Props> = ({ sign, onToggleCamera }) => {
  const [isCamera, setIsCamera] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  const webcamRef = useRef<Webcam>(null);

  const router = useRouter();

  const toggleCamera = () => {
    const newState = !isCamera;
    setIsCamera(newState);
    onToggleCamera?.(newState);
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

      const camera = new Camera(videoElement, {
        onFrame: async () => {
          const results = gestureRecognizer.recognizeForVideo(
            videoElement,
            Date.now()
          );
          const gestures = results.gestures[0];
          if (gestures) {
            const prediction = gestures[0].categoryName.toLowerCase()
            const signToGuess = sign.toLowerCase()

            if (prediction === signToGuess) {
              setShowCheckmark(true);
              await sleep(2);
              setIsCamera(false);
              setShowCheckmark(false);
              onToggleCamera?.(false);
              router.push("/learning");
            }
          }
        },
        width: 640,
        height: 480,
      });
      camera.start();
    };

    const handleMediapipe = async () => {
      if (webcamRef.current) {
        const videoElement = webcamRef.current.video as HTMLVideoElement;
        mediapipeRecognition(videoElement);
      }
    };
    handleMediapipe();
  }, [webcamRef, isCamera]);

  return (
    <div className="w-full">
      {/* Botón Inténtalo - solo cuando la cámara esté cerrada */}
      {!isCamera && (
        <button
          className="w-full text-white bg-orange-500 hover:bg-orange-600 py-4 px-6 text-xl rounded-lg shadow-lg font-semibold transition-all duration-200 hover:scale-105"
          onClick={toggleCamera}
        >
          Inténtalo
        </button>
      )}
      
      {/* Componente de reconocimiento */}
      {isCamera && (
        <div className="bg-orange-400 rounded-lg shadow-lg overflow-hidden">
          <div className="relative w-full h-80">
            <Webcam
              mirrored
              ref={webcamRef}
              className="object-cover w-full h-full"
              screenshotFormat="image/jpeg"
            />
            {/* Animación de palomita verde */}
            {showCheckmark && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500/90 z-10">
                <div className="animate-bounce">
                  <Check className="w-24 h-24 text-white animate-pulse" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignRecognition;
