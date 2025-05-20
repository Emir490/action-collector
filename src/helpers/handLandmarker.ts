import type { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import {
  FilesetResolver,
  HandLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

export async function drawStyledLandmarks(
  canvas: HTMLCanvasElement,
  results: HandLandmarkerResult,
  videoElement: HTMLVideoElement
) {
  // Initialize drawing utils
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;
  const drawingUtils = new DrawingUtils(ctx);

  // clear & mirror canvas
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // draw each hand
  if (results.landmarks) {
    const landmarkOptions = { color: "", lineWidth: 5, radius: 8 };
    const connectionOptions = { color: "", lineWidth: 8 };

    for (let i = 0; i < results.landmarks.length; i++) {
      const landmarks = results.landmarks[i];
      const handed =
        results.handedness?.[i]?.[0]?.categoryName === "Left"
          ? "Left"
          : "Right";
      const color =
        handed === "Left" ? "rgb(44, 212, 103)" : "rgb(44, 156, 212)";
      landmarkOptions.color = color;
      connectionOptions.color = color;

      drawingUtils.drawLandmarks(landmarks, landmarkOptions);
      drawingUtils.drawConnectors(
        landmarks,
        HandLandmarker.HAND_CONNECTIONS,
        connectionOptions
      );
    }
  }
  ctx.restore();
}

export async function setupHandLandmarker(
  videoElement: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  onFrameCallback: (r: HandLandmarkerResult) => void,
  drawOverlay = true,
  facingMode: 'user' | 'environment' = 'user'
) {
  const { Camera } = await import("@mediapipe/camera_utils");

  if (!videoElement || !canvas) return;
  try {
    // Wait for video element to be properly initialized
    if (!videoElement.readyState || videoElement.readyState < 1) {
      await new Promise<void>((resolve) => {
        videoElement.onloadedmetadata = () => resolve();
        // Set a timeout just in case the event never fires
        setTimeout(resolve, 1000);
      });
    }

    // Configure video element for mobile compatibility
    videoElement.style.transform = "scaleX(-1)";
    videoElement.setAttribute("playsinline", "");
    videoElement.setAttribute("autoplay", "");
    videoElement.setAttribute("webkit-playsinline", "");
    videoElement.muted = true;

    // Ensure canvas is ready
    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 480;

    console.log("Loading vision tasks...");
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    
    console.log("Creating hand landmarker...");
    const handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "../../hand_landmarker.task",
        delegate: "GPU",
      },
      numHands: 2,
      runningMode: "VIDEO",
      minHandDetectionConfidence: 0.2,
      minHandPresenceConfidence: 0.2,
      minTrackingConfidence: 0.2,
    });

    let lastVideoTime = -1;
    
    console.log("Starting camera...");
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        try {
          if (
            canvas.width !== videoElement.videoWidth ||
            canvas.height !== videoElement.videoHeight
          ) {
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
          }
          if (
            videoElement.readyState >= 2 &&
            videoElement.currentTime !== lastVideoTime
          ) {
            lastVideoTime = videoElement.currentTime;
            const results = handLandmarker.detectForVideo(
              videoElement,
              performance.now()
            );
            onFrameCallback(results);
            if (drawOverlay) {
              await drawStyledLandmarks(canvas, results, videoElement);
            }
          }
        } catch (e) {
          console.error("Error in camera frame processing:", e);
        }
      },
      width: 640,
      height: 480,
      facingMode
    });
    
    // Add error handling for camera start
    try {
      await camera.start();
      console.log("Camera started successfully");
    } catch (err) {
      console.error("Camera start error:", err);
      // Try an alternative approach for mobile
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode,
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
          });
          videoElement.srcObject = stream;
          await videoElement.play();
          console.log("Camera started with alternative method");
        }
      } catch (fallbackErr) {
        console.error("Fallback camera method also failed:", fallbackErr);
      }
    }
  } catch (error) {
    console.error("Error setting up hand landmarker:", error);
  }
}
