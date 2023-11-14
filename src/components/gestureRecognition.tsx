import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";

const sequenceLength = 30;

const GestureRecognition: React.FC = () => {
  const [gestureName, setGestureName] = useState<string>("");
  const [gestureSequence, setGestureSequence] = useState<string>("");
  const [isCamera, setIsCamera] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const framesRef = useRef<number>(0);

  const toggleCamera = () => setIsCamera(!isCamera);

  const resetSequence = () => {
    setGestureName("");
    setGestureSequence("");
  };

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
          },
        }
      );

      gestureRecognizer.setOptions({ runningMode: "VIDEO" });

      let lastGesture = "";

      const camera = new Camera(videoElement, {
        onFrame: async () => {
          ++framesRef.current;

          if (framesRef.current === sequenceLength) {
            framesRef.current = 0;
            const results = gestureRecognizer.recognizeForVideo(
              videoElement,
              Date.now()
            );
            const gestures = results.gestures[0];
            if (gestures && gestures[0].categoryName !== lastGesture) {
              setGestureName(gestures[0].categoryName);
              if (gestures[0].categoryName === "espacio") {
                setGestureSequence((oldSequence) => oldSequence + " ");
              } else if (gestures[0].categoryName === "del") {
                setGestureSequence((oldSequence) => oldSequence.slice(0, -1));
              } else {
                setGestureSequence(
                  (oldSequence) => oldSequence + gestures[0].categoryName
                );
              }
              lastGesture = gestures[0].categoryName;
            }
          }
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    };

    const handleMediapipe = async () => {
      if (webcamRef.current) {
        const videoElement = webcamRef.current.video as HTMLVideoElement;
        mediapipeRecognition(videoElement);
      }
    };
    handleMediapipe();
  }, [webcamRef, isCamera]);

  return (
    <section className={`${isCamera ? "relative" : ""}`}>
      <div className="mb-5 flex flex-row justify-center">
        <button
          className="p-3 bg-orange-400 hover:bg-orange-500 transition-colors text-white font-bold uppercase rounded-md"
          onClick={() => toggleCamera()}
        >
          {isCamera ? "Apagar" : "Encender"}
        </button>
        <button
          className="p-3 bg-orange-400 hover:bg-orange-500 transition-colors text-white font-bold uppercase rounded-md ml-2"
          // Add your styling here
          onClick={() => resetSequence()}
        >
          Reiniciar
        </button>
        <button
          className="p-3 bg-orange-400 hover:bg-orange-500 transition-colors text-white font-bold uppercase rounded-md ml-2"
          onClick={() =>
            setGestureSequence((oldSequence) => oldSequence.slice(0, -1))
          }
        >
          Borrar
        </button>
      </div>
      {isCamera && (
        <>
          <Webcam
            mirrored
            ref={webcamRef}
            className="rounded-lg mx-auto aspect-video lg:w-3/5"
            screenshotFormat="image/jpeg"
          />
          <p className="absolute top-10 left-0 m-4 w-full text-5xl text-black text-center font-bold uppercase mt-10">
            {gestureName}
          </p>
          <p className="absolute top-20 left-0 m-4 w-full text-4xl text-black text-center font-bold uppercase mt-10">
            {gestureSequence}
          </p>
        </>
      )}
    </section>
  );
};

export default GestureRecognition;
