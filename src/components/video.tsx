import { useRef, useEffect } from 'react';
import * as holistic from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";

const Video = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            const camera = new Camera(videoRef.current, { onFrame: () => null });
        }
        
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    }

    startVideo();
  }, []);

  return (
    <>
        <video ref={videoRef} autoPlay={true} style={{ display: "none" }} />
        <canvas ref={canvasRef} />
    </>
    // <video ref={videoRef} autoPlay muted playsInline />
  );
};

export default Video;
