import { useRouter } from "next/router";
import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// Include toastify CSS to render the notification

type Props = {
  sign: string;
};

const sleep = (seconds: number) => new Promise((r) => setTimeout(r, seconds * 1000));

const SignRecognition: React.FC<Props> = ({ sign }) => {
  const [isCamera, setIsCamera] = useState(false);

  const webcamRef = useRef<Webcam>(null);

  const router = useRouter();

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
          },
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
            const prediction = gestures[0].categoryName.toLowerCase()
            const signToGuess = sign.toLowerCase()

            if (prediction === signToGuess) {
              toast.info("Correcto!", { position: "bottom-center" });
              await sleep(5)
              setIsCamera(false);
              router.push("/learning");
            }
          }
        },
        width: 640,
        height: 480,
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
    <section className={`bg-orange-400 mt-10 rounded-lg shadow-lg flex items-center justify-center ${isCamera ? '' : 'w-80 h-60'}`}>
      {isCamera ? (
        <div className="relative w-full h-full">
          <Webcam
            mirrored
            ref={webcamRef}
            className="object-cover rounded-lg"
            screenshotFormat="image/jpeg"
          />
        </div>
      ) : (
        <button
          className="text-white bg-orange-500 hover:bg-orange-600 py-5 px-5 text-2xl rounded-lg shadow-orange-500"
          onClick={toggleCamera}
        >
          Inténtalo
        </button>
      )}
      <ToastContainer />
    </section>
  );
};

export default SignRecognition;
