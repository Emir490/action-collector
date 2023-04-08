import React, { useRef, useEffect } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Holistic, FACEMESH_TESSELATION, POSE_CONNECTIONS, HAND_CONNECTIONS } from "@mediapipe/holistic";

let counter: number = 0;
let flag: boolean = true;

// Object storing 30 frames (1 sequence)
var sequence: { frames: any[] } = {
  frames: []
};

const HolisticComponent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvasCtx = canvasRef.current.getContext("2d");
    const onResults = (results: any) => {
      if (!videoRef.current || !canvasRef.current) return;
      if (!canvasCtx) return;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.segmentationMask) {
        canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      
      // Only overwrite existing pixels.
      canvasCtx.globalCompositeOperation = 'source-in';
      canvasCtx.fillStyle = 'rgba(0, 255, 0, 0.5)';
      canvasCtx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Only overwrite missing pixels.
      canvasCtx.globalCompositeOperation = 'destination-atop';
      canvasCtx.drawImage(
        results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      canvasCtx.globalCompositeOperation = 'source-over';
      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
        { color: '#00FF00', lineWidth: 4 });
      drawLandmarks(canvasCtx, results.poseLandmarks,
        { color: '#FF0000', lineWidth: 2 });
      drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
        { color: '#C0C0C070', lineWidth: 1 });
      drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
        { color: '#CC0000', lineWidth: 5 });
      drawLandmarks(canvasCtx, results.leftHandLandmarks,
        { color: '#00FF00', lineWidth: 2 });
      drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
        { color: '#00CC00', lineWidth: 5 });
      drawLandmarks(canvasCtx, results.rightHandLandmarks,
        { color: '#FF0000', lineWidth: 2 });
      canvasCtx.restore();

      // Extract landmarks data
      var landmarksData = {
        poseLandmarks: results.poseLandmarks,
        faceLandmarks: results.faceLandmarks,
        leftHandLandmarks: results.leftHandLandmarks,
        rightHandLandmarks: results.rightHandLandmarks,
      };

      if (counter < 30) { 
        sequence.frames.push(
          {frame: counter,
           landmarks: landmarksData});
        if (flag) {console.log(`Frame ${counter} saved!`);}
        counter++;
      }
      else {
        if (flag) {
          flag = false;
          var json = JSON.stringify(sequence); // Convert data to string
          var filename = 'landmarks.json'; // Data filename
  
          var blob = new Blob([json], { type: "application/json" });
  
          // Save json
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        counter = 0;
      }
    };


    const holistic = new Holistic({
      locateFile: (file) => {
        return `holistic/${file}`;
      }
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    holistic.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await holistic.send({ image: videoRef.current! });
      },
      width: 1280,
      height: 720,
    });
    camera.start();

    return () => {
      camera.stop();
      holistic.close();
    };
  }, []);
  return (
    <div>
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} width="1280" height="720" />
    </div>
  );
}

export default HolisticComponent;