import { Holistic, Results } from "@mediapipe/holistic";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { Camera } from "@mediapipe/camera_utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

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

const actions = ['acceso', 'aceptar', 'ayudar', 'descansar', 'dinero', 'duda', 'gracias', 'hacer', 'hola', 'nada', 'necesitar', 'regresar', 'sin_accion', 'tambien', 'urgente'];

const ActionRecognition = () => {
  const [isCamera, setIsCamera] = useState(false);
  const [predictedAction, setPredictedAction] = useState('');
  const [model, setModel] = useState<tf.GraphModel | null>(null);

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sequence = useRef<number[][]>([]);

  const toggleCamera = () => setIsCamera(!isCamera);

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
        // Convert the sequence to a tensor
        const inputData = tf.tensor([sequence.current]);

        // Make the prediction
        const prediction = await model.predictAsync(inputData) as tf.Tensor;

        // Convert the tensor to a regular array and handle the prediction
        const predictionArray = await prediction.data();

        // Assuming a classification model, find the index of the maximum value (highest probability)
        const predictedClassIndex = predictionArray.indexOf(Math.max(...predictionArray));

        const action = actions[predictedClassIndex];
        setPredictedAction(action);  // Update the predicted action

        sequence.current = [];
      }
    }
  }

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    const mediapipeDetection = async (videoElement: HTMLVideoElement) => {
      const holistic = new Holistic({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      }});
  
      holistic.setOptions({
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
  
      holistic.onResults((results) => {
        onFrame(results);
      });
  
      const camera = new Camera(videoElement, {
        onFrame: async () => {
          await holistic.send({ image: videoElement });
        },
        width: 640,
        height: 480
      });
  
      camera.start();
    }

    const handleMediapipe = async () => {
      if (webcamRef.current && model) {
        const videoElement = webcamRef.current.video as HTMLVideoElement;
        await mediapipeDetection(videoElement);
      }
    };
    if (isCamera) handleMediapipe();
  }, [webcamRef, canvasRef, isCamera, model]);

  return (
     <section className="flex flex-col items-center justify-center">
      <div className="p-4">
        <button
          className="p-3 bg-orange-400 hover:bg-orange-500 transition-colors text-white font-bold uppercase rounded-md"
          onClick={toggleCamera}
        >
          <FontAwesomeIcon icon={faCamera} className="mr-2" />
          {isCamera ? "Apagar" : "Encender"}
        </button>
      </div>

      {isCamera && (
        <>
          <Webcam
            ref={webcamRef}
            mirrored
            className="rounded-lg mx-auto h-screen object-cover sm:h-auto sm:object-contain lg:w-3/5"
            screenshotFormat="image/jpeg"
          />
          <div className="p-4 text-center">
            <p className="text-xl font-bold text-gray-700">Acción realizada:</p>
            <p className="text-2xl text-orange-500 font-semibold">{predictedAction}</p>
          </div>
        </>
      )}
    </section>
  );
};

export default ActionRecognition;
