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

  useEffect(() => {
    loadModel();
  }, []);

  // when camera & model ready, start Mediapipe
  useEffect(() => {
    if (isCamera && webcamRef.current && canvasRef.current && model) {
      const setupCamera = async () => {
        try {
          console.log("Setting up camera for mobile recognition...");
          
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
            canvasRef.current!,
            onFrame,
            false,
            facingMode
          );
          
          console.log("Mobile camera setup complete");
        } catch (error) {
          console.error("Error setting up mobile camera:", error);
        }
      };
      
      setupCamera();
    }
    
    // Cleanup function
    return () => {
      console.log("Cleaning up camera resources...");
      // Add any necessary cleanup code here
    };
  }, [isCamera, model, facingMode]);

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
      setPredictedAction(action); // Update the predicted action
      sequence.current = [];
    }
  }

  return (
    <section className="flex flex-col items-center justify-center">
      <div className="p-4">
        <button
          className="p-3 bg-orange-400 hover:bg-orange-500 transition-colors text-white font-bold uppercase rounded-md"
          onClick={toggleCamera}
        >
          <FontAwesomeIcon icon={faCamera} className="mr-2" />
          {isCamera ? "Stop" : "Start"} Mobile Recognition
        </button>
      </div>
      {isCamera && (
        <>
          <Webcam
            mirrored
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-lg mx-auto object-cover sm:h-auto"
          />
          <div className="p-4 text-center">
            <p className="text-xl font-bold text-gray-700">Predicted action:</p>
            <p className="text-2xl text-orange-500 font-semibold">
              {predictedAction}
            </p>
          </div>
        </>
      )}
    </section>
  );
};

export default MobileActionRecognition;
