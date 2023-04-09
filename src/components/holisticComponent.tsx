import React, { useEffect, useRef, useState } from 'react';
import { Results } from '@mediapipe/holistic';
import Webcam from 'react-webcam';
import { useMediaPipeDetection } from '@/hooks/useMediapipeDetection';

const sequenceLength = 30; // You can set the desired sequence length here.

const extractKeyPoints = (results: Results): number[] => {
  const pose = results.poseLandmarks
    ? results.poseLandmarks.map((res) => [res.x, res.y, res.z, res.visibility]).flat()
    : Array(33 * 4).fill(0);

  const face = results.faceLandmarks
    ? results.faceLandmarks.map((res) => [res.x, res.y, res.z]).flat()
    : Array(468 * 3).fill(0);

  const lh = results.leftHandLandmarks
    ? results.leftHandLandmarks.map((res) => [res.x, res.y, res.z]).flat()
    : Array(21 * 3).fill(0);

  const rh = results.rightHandLandmarks
    ? results.rightHandLandmarks.map((res) => [res.x, res.y, res.z]).flat()
    : Array(21 * 3).fill(0);

  return [...pose, ...face, ...lh, ...rh];
}

const HolisticComponent: React.FC = () => {
  const [isCollecting, setIsCollecting] = useState<boolean>(false);

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const collectingRef = useRef<boolean>(false);
  const framesRef = useRef<number[][]>([]); // Use useRef to store frames

  const mediapipeDetection = useMediaPipeDetection(onFrame);

  function onFrame(results: Results) {
    if (collectingRef.current) {
      const keypoints = extractKeyPoints(results);
      
      framesRef.current.push(keypoints);
      
      if (framesRef.current.length === sequenceLength) {
        sendFramesToServer();
        framesRef.current = []
      }
    }
  }

  const sendFramesToServer = async () => {
    console.log("Action", framesRef.current);
  
    // Disable collecting while waiting
    setIsCollecting(false);
    
    if (webcamRef.current && webcamRef.current.video) {
      webcamRef.current.video.pause();
    }
    console.log('Collecting Frames...');
  
    // Wait for 2 seconds
    setTimeout(() => {
      // Continue collecting frames after the wait
      if (webcamRef.current && webcamRef.current.video) {
        webcamRef.current.video.play();
      }

      setIsCollecting(true);
    }, 2000);
  }

  useEffect(() => {
    collectingRef.current = isCollecting;
  }, [isCollecting]);

  useEffect(() => {
    if (webcamRef.current && canvasRef.current) {
      const videoElement = webcamRef.current.video as HTMLVideoElement;
      mediapipeDetection(videoElement, canvasRef.current);
    }
  }, [webcamRef, canvasRef]);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        width={640}
        height={480}
        screenshotFormat="image/jpeg"
        style={{ display: "none" }}
      />
      <canvas ref={canvasRef} width="1080" height="720"></canvas>
      <button className='bg-indigo-800 p-3 text-white uppercase font-bold rounded-md hover:bg-indigo-700 transition-colors my-5' onClick={() => setIsCollecting(!isCollecting)}>Start Collecting Frames</button>
    </div>
  );
}

export default HolisticComponent