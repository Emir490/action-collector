import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

const GestureRecognition: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  let lastVideoTime = -1;

  const mediapipeRecognition = async (videoElement: HTMLVideoElement) => {
    const { FilesetResolver, GestureRecognizer } = await import('@mediapipe/tasks-vision');
    const { Camera } = await import('@mediapipe/camera_utils');
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");

    const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, { baseOptions: {modelAssetPath: "../../asl_model/gesture_recognizer.task"}, numHands: 2});

    gestureRecognizer.setOptions({ runningMode: "VIDEO" });

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        lastVideoTime = videoElement.currentTime;
        const results = gestureRecognizer.recognizeForVideo(videoElement, Date.now());
        const gestures = results.gestures[0];
        if (gestures) {
          console.log(gestures[0].categoryName);
        }
      },
      width: 640,
      height: 480
    });
    camera.start();
  }

  useEffect(() => {
    const handleMediapipe = async () => {
      if (webcamRef.current) {
        const videoElement = webcamRef.current.video as HTMLVideoElement;
        mediapipeRecognition(videoElement);
      }
    }
    handleMediapipe();
  }, [webcamRef]);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        width={640}
        height={480}
        screenshotFormat="image/jpeg"
      />
    </div>
  );
};

export default GestureRecognition;
