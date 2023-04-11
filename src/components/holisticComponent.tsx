import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Results } from '@mediapipe/holistic';
import Webcam from 'react-webcam';
import { useMediaPipeDetection } from '@/hooks/useMediapipeDetection';
import axios from 'axios';
import { useRouter } from 'next/router';

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
  const [capturing, setCapturing] = useState<boolean>(false);

  const router = useRouter();
  const action = router.query.action;

  const recordedChunksRef = useRef<BlobPart[]>([]); 
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const collectingRef = useRef<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const framesRef = useRef<number[][]>([]); // Use useRef to store frames
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);

  let counter = 0

  const mediapipeDetection = useMediaPipeDetection(onFrame);

  async function onFrame(results: Results) {
    if (collectingRef.current) {
      if (framesRef.current.length === 0) handleStartCapture();

      const keypoints = extractKeyPoints(results);

      framesRef.current.push(keypoints);

      if (framesRef.current.length === sequenceLength) {
        await handleStopCapture();
        handleUpload();
        framesRef.current = []
      }
    }
  }

  const handleStartCapture = useCallback(() => {
    if (hiddenVideoRef.current) {
      const canvasStream = canvasRef.current!?.captureStream();
      hiddenVideoRef.current.srcObject = canvasStream;
      hiddenVideoRef.current.play();

      mediaRecorderRef.current = new MediaRecorder(canvasStream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current.addEventListener("dataavailable", ({ data }) => {
        if (data.size > 0) {
          recordedChunksRef.current = recordedChunksRef.current.concat(data);
        }
      });
      mediaRecorderRef.current.start();
    }
  }, [canvasRef, hiddenVideoRef, setCapturing, mediaRecorderRef]);

  const handleStopCapture = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.addEventListener("stop", () => {
          setCapturing(false);
          resolve();
        });
        mediaRecorderRef.current.stop();
      } else {
        resolve();
      }
    });
  }, [mediaRecorderRef, setCapturing]);  

  const handleUpload = async () => {
    if (recordedChunksRef.current.length) {
      counter++;
      
      // Disable collecting while waiting
      setIsCollecting(false);

      const blob = new Blob(recordedChunksRef.current, {
        type: "video/webm",
      });

      // Convert the Blob to a File object
      const file = new File([blob], "video.webm", { type: "video/webm" });

      if (webcamRef.current && webcamRef.current.video) {
        webcamRef.current.video.pause();
      }
      console.log('Collecting Frames...');

      try {
        const formData = new FormData();
        formData.append('category', "Saludos");
        console.log(action);
        
        formData.append('action', action as string);
        formData.append('sequence', `${action}-${counter}`);
        formData.append('keypoints', JSON.stringify(framesRef.current));
        formData.append('file', file);

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/actions`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('File uploaded:', response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }

      if (webcamRef.current && webcamRef.current.video) {
        webcamRef.current.video.play();
      }

      setIsCollecting(true);
      recordedChunksRef.current = [];
    }
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
      <video
        ref={hiddenVideoRef}
        width="1080"
        height="720"
        style={{ display: "none" }}
      ></video>
      <button className='bg-indigo-800 p-3 text-white uppercase font-bold rounded-md hover:bg-indigo-700 transition-colors my-5' onClick={() => {
        setIsCollecting(!isCollecting);
      }}>Start Collecting Frames</button>
      
    </div>
  );
}

export default HolisticComponent