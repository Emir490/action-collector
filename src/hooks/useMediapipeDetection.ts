import { Camera } from '@mediapipe/camera_utils';
import { FACEMESH_TESSELATION, HAND_CONNECTIONS, Holistic, POSE_CONNECTIONS, Results } from '@mediapipe/holistic';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

export const useMediaPipeDetection = (onFrameCallback: (results: Results) => void) => {
  const mediapipeDetection = async (videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) => {
    console.log('Loading...');

    const holistic = new Holistic({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
    }});

    holistic.setOptions({
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holistic.onResults((results) => {
      drawStyledLandmarks(canvasElement, results, videoElement);

      onFrameCallback(results);
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

  return mediapipeDetection;
};
