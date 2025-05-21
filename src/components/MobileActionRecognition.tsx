import { useEffect, useRef, useState } from "react";
import useMobileRecognition from "@/hooks/useMobileRecognition";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { setupHandLandmarker } from "@/helpers/handLandmarker";
import { extractHandsKeypoints } from "@/helpers/extractKeypoints";
import { HandLandmarkerResult } from "@mediapipe/tasks-vision";

const actions = [
  "abrazar",
  "agarrar",
  "aplastar",
  "bailar",
  "caminar",
  "cerrar",
  "fabrica",
  "frio",
  "golpear",
  "guardar",
  "invitar",
  "jugar",
  "libro",
  "luna",
  "sin_accion",
  "Tijuana",
];
const sequenceLength = 30;

const MobileActionRecognition: React.FC = () => {
  const { loadModel, model, predictedAction, setPredictedAction } =
    useMobileRecognition();
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facingMode, setFacingMode] = useState<'user'|'environment'>('user');
  const [isCamera, setIsCamera] = useState(false);
  const sequence = useRef<number[][]>([]);

  const toggleCamera = () => setIsCamera(!isCamera);
  const toggleFacingMode = () => setFacingMode(fm => fm === 'user' ? 'environment' : 'user');

  useEffect(() => {
    loadModel();
  }, []);

  // when camera & model ready, start Mediapipe
  useEffect(() => {
    if (isCamera && webcamRef.current && model) {
      const setupCamera = async () => {
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
          
        } catch (error) {
          console.error("Error setting up mobile camera:", error);
        }
      };
      console.log("Loading model...");
      setupCamera();
    }
    
  }, [isCamera, model]);

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
      sequence.current = [];
    }
  }

  return (
    <section className="flex flex-col items-center justify-center px-4 sm:px-0 max-w-4xl mx-auto">
      {/* Instrucciones de uso en Español */}
      <div className="w-full max-w-md mx-auto mb-6 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800">Reconocimiento de gestos</h2>
        <p className="mt-2 text-gray-600">
          Esta pantalla permite reconocer acciones mediante la cámara de tu dispositivo móvil. Pulsa el botón de abajo para iniciar o detener la cámara.
        </p>
        <p className="mt-2 text-gray-600 font-semibold">
          Gestos soportados: {actions.join(', ')}.
        </p>
      </div>
      <div className="w-full max-w-md mx-auto p-4">
        <button
          className="w-full p-3 bg-orange-400 hover:bg-orange-500 transition-colors text-white font-bold uppercase rounded-md"
          onClick={toggleCamera}
        >
          <FontAwesomeIcon icon={faCamera} className="mr-2" />
          {isCamera ? "Detener" : "Inciciar"} Reconocimiento Movil
        </button>
        <button
          className="w-full mt-2 p-3 bg-blue-400 hover:bg-blue-500 transition-colors text-white font-bold uppercase rounded-md"
          onClick={toggleFacingMode}
        >
          Cambiar cámara
        </button>
      </div>
      {isCamera && (
        <div className="flex flex-col items-center lg:flex-row lg:justify-center lg:space-x-8 w-full mb-4">
          {/* Cámara */}
          <div className="w-full mb-4 lg:mb-0 lg:w-3/4 xl:w-4/5">
            <Webcam
              mirrored
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode }}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
          {/* Predicción */}
          <div className="sticky top-0 z-10 w-full bg-white p-4 text-center shadow-md lg:w-1/4 xl:w-1/5">
            <p className="text-lg sm:text-xl font-bold text-gray-700">Acción predicha:</p>
            <p className="text-xl sm:text-2xl text-orange-500 font-semibold">{predictedAction}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default MobileActionRecognition;
