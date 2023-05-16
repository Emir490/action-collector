import React, { useRef, useEffect, useState, ReactNode, useCallback } from "react";
import Webcam from "react-webcam";

const GestureRecognition: React.FC = () => {
  const [gestureName, setGestureName] = useState<string>("");
  const [isCamera, setIsCamera] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  
  const toggleCamera = () => setIsCamera(!isCamera);

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
          }
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
            console.log(gestures[0].categoryName)
            setGestureName(gestures[0].categoryName);
          }
        },
        width: 640,
        height: 480,
      });
      camera.start();
    };

    const handleMediapipe = async () => {
      console.log(webcamRef.current)
      if (webcamRef.current) {
        const videoElement = webcamRef.current.video as HTMLVideoElement;
        mediapipeRecognition(videoElement);
      }
    }

    handleMediapipe();
  }, [webcamRef, isCamera]);

  return (
    <div className={`${isCamera ? 'relative w-full h-screen' : ''}`}>
      <button
        className="p-3 bg-indigo-700 hover:bg-indigo-800 transition-colors text-white font-bold uppercase rounded-md"
        onClick={() => toggleCamera()}
      >
        {isCamera ? "Apagar" : "Encender"}
      </button>
      {isCamera && (
        <>
          <Webcam
            mirrored
            ref={webcamRef}
            className="w-full h-full object-cover"
            screenshotFormat="image/jpeg"
          />
          <p className="absolute top-10 left-0 m-4 text-5xl text-white font-bold uppercase">
            {gestureName}
          </p>
        </>
      )}
    </div>
  );
};

export default GestureRecognition;
