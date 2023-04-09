import React, { useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Holistic, Results, FACEMESH_TESSELATION, POSE_CONNECTIONS, HAND_CONNECTIONS, } from '@mediapipe/holistic';
import Webcam from 'react-webcam';

const sequenceLength = 30; // You can set the desired sequence length here.

const HolisticComponent: React.FC = () => {
  const [isCollecting, setIsCollecting] = useState<boolean>(false);

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const collectingRef = useRef<boolean>(false);
  const framesRef = useRef<number[][]>([]); // Use useRef to store frames

  useEffect(() => {
    collectingRef.current = isCollecting;
  }, [isCollecting]);

  const onFrame = (results: Results) => {
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
  };
  

  const mediapipeDetection = async (videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) => {
    const holistic = new Holistic({
      locateFile: (file) => {
        return `holistic/${file}`;
      }
    });

    holistic.setOptions({
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holistic.onResults((results) => {
      drawStyledLandmarks(canvasElement, results, videoElement);

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

  const drawStyledLandmarks = (canvas: HTMLCanvasElement | null, results: Results, videoElement: HTMLVideoElement | null) => {

    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply a horizontal flip to the context
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);

    // Draw the video frame on the canvas
    if (videoElement) {
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    }

    // Draw face connections
    drawConnectors(ctx, results.faceLandmarks, FACEMESH_TESSELATION, {
      color: '#50ee6b',
      lineWidth: 1,
    });

    // Draw pose connections
    drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: '#ff553f',
      lineWidth: 2,
    });

    // Draw left hand connections
    drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
      color: '#79dbab',
      lineWidth: 2,
      radius: 4
    });

    // Draw right hand connections
    drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
      color: '#f57c3b',
      lineWidth: 2,
      radius: 4
    });

    // Draw all landmarks
    drawLandmarks(ctx, results.poseLandmarks, {
      color: '#ff553f',
      lineWidth: 2,
    });
    // drawLandmarks(ctx, results.faceLandmarks, {
    //   color: '#50ee6b',
    //   lineWidth: 1,
    // });
    drawLandmarks(ctx, results.leftHandLandmarks, {
      color: '#79dbab',
      lineWidth: 2,
    });
    drawLandmarks(ctx, results.rightHandLandmarks, {
      color: '#f57c3b',
      lineWidth: 2,
    });

    // Restore the context to its original state
    ctx.restore();
  };

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