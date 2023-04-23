import React, { useCallback, useEffect, useRef, useState } from "react";
import { Results } from "@mediapipe/holistic";
import Webcam from "react-webcam";
import { useMediaPipeDetection } from "@/hooks/useMediapipeDetection";
import { useRouter } from "next/router";
import useActions from "@/hooks/useActions";
import { Keypoints } from "@/interfaces/action";
import ClipLoader from "react-spinners/ClipLoader";
import { Video } from "@/interfaces/actions";
import { toast } from "react-toastify";

const sequenceLength = 30; // You can set the desired sequence length here.

const extractKeyPoints = (results: Results): Keypoints => {
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

  return { pose, face, leftHand, rightHand };
}

const HolisticComponent: React.FC = () => {
  const [isCollecting, setIsCollecting] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const recordedChunksRef = useRef<BlobPart[]>([]);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const collectingRef = useRef<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const framesRef = useRef<Keypoints[]>([]); // Use useRef to store frames
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);

  const mediapipeDetection = useMediaPipeDetection(onFrame);

  const { videos, setVideos } = useActions();

  const router = useRouter();
  const category = router.query.category;
  const action = router.query.action;

  let counter = 0;

  async function onFrame(results: Results) {
    if (collectingRef.current) {

      if (framesRef.current.length === 0) handleStartCapture();

      const keypoints = extractKeyPoints(results);

      framesRef.current.push(keypoints);

      if (framesRef.current.length === sequenceLength) {
        await handleStopCapture();
        handleUpload();
        framesRef.current = [];
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
  }, [canvasRef, hiddenVideoRef, mediaRecorderRef]);

  const handleStopCapture = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.addEventListener("stop", () => {
          resolve();
        });
        mediaRecorderRef.current.stop();
      } else {
        resolve();
      }
    });
  }, [mediaRecorderRef]);

  const handleUpload = useCallback(() => {
    if (recordedChunksRef.current.length) {
      counter++
      setIsCollecting(false);
      setLoading(true);

      const blob = new Blob(recordedChunksRef.current, {
        type: "video/webm",
      });

      // Convert the Blob to a File object
      const file = new File([blob], "video.webm", { type: "video/webm" });

      if (webcamRef.current && webcamRef.current.video) {
        webcamRef.current.video.pause();
      }

      if (!category || !action) return;

      const recordedURL = URL.createObjectURL(file);

      if (counter > 48 || videos.length > 48) {
        toast.error("Limite alcanzado", { position: 'top-right' });
        setLoading(false);
        return;
      }

      const obj: Video = {
        id: Date.now(),
        category: category as string,
        action: action as string,
        video: recordedURL,
        landmarks: framesRef.current
      }

      setVideos(prevVideos => [...prevVideos, obj]);

      // const response = await addAction(category as string, action as string, framesRef.current, file);

      if (webcamRef.current && webcamRef.current.video) {
        webcamRef.current.video.play();
      }

      // if (response?.error) {
      //   setLoading(false);
      //   return;
      // }

      setIsCollecting(true);
      setLoading(false)
      recordedChunksRef.current = [];
    }
  }, [action, category, setVideos, videos, counter])

  useEffect(() => {
    collectingRef.current = isCollecting;

    if (!isCollecting) {
      framesRef.current = [];
    }
  }, [isCollecting]);

  useEffect(() => {
    const handleMediapipe = async () => {
      if (webcamRef.current && canvasRef.current && router.isReady) {
        const videoElement = webcamRef.current.video as HTMLVideoElement;
        await mediapipeDetection(videoElement, canvasRef.current);
      }
    }
    handleMediapipe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webcamRef, canvasRef, router.isReady]);

  return (
    <div className="flex justify-center flex-col items-center align-middle">
      <div className="flex items-center">
        <button
          className="bg-indigo-800 p-3 text-white uppercase font-bold rounded-md hover:bg-indigo-700 transition-colors my-5"
          onClick={() => {
            setIsCollecting(!isCollecting);
          }}
        >
          {isCollecting ? "Detener Recolección" : loading ? "Recolectando fotogramas..." : "Iniciar Recolección"}
        </button>
        <p className="text-white ml-5 text-xl">Recolectando fotogramas para <span className="font-bold">{action}</span> Video Número <span className="font-bold">{videos.length}</span></p>
      </div>
      <Webcam
        ref={webcamRef}
        width={640}
        height={480}
        screenshotFormat="image/jpeg"
        style={{ display: "none" }}
      />
      <div className="relative" style={{ width: "1080px", height: "720px" }}>
        <canvas ref={canvasRef} width="1080" height="720"></canvas>
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-black">
            <ClipLoader color="#ffffff" loading={loading} size={50} />
          </div>
        )}
      </div>
      <video
        ref={hiddenVideoRef}
        width="1080"
        height="720"
        style={{ display: "none" }}
      ></video>
    </div>
  );
}

export default HolisticComponent;