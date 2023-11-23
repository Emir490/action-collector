import { useMediaPipeDetection } from "@/hooks/useMediapipeDetection";
import { Holistic, Results } from "@mediapipe/holistic";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const ActionRecognition = () => {
  const [isCamera, setIsCamera] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toggleCamera = () => setIsCamera(!isCamera);

  const mediapipeDetection = useMediaPipeDetection(onFrame);

  async function onFrame(results: Results) {
    console.log("Predictions");
  }

  useEffect(() => {
    const handleMediapipe = async () => {
      if (webcamRef.current && canvasRef.current) {
        const videoElement = webcamRef.current.video as HTMLVideoElement;
        await mediapipeDetection(videoElement, canvasRef.current);
      }
    };
    handleMediapipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webcamRef, canvasRef, isCamera]);

  return (
    <section>
      <button
        className="p-3 bg-orange-400 hover:bg-orange-500 transition-colors text-white font-bold uppercase rounded-md"
        onClick={toggleCamera}
      >
        {isCamera ? "Apagar" : "Encender"}
      </button>
      {isCamera && (
        <>
          <Webcam
            ref={webcamRef}
            mirrored
            className="rounded-lg mx-auto h-screen object-cover sm:h-auto sm:object-contain lg:w-3/5"
            screenshotFormat="image/jpeg"
            style={{ display: "none" }}
          />
          <div>
            <canvas
              ref={canvasRef}
              className="w-full aspect-video rounded-xl"
            ></canvas>
          </div>
        </>
      )}
    </section>
  );
};

export default ActionRecognition;
