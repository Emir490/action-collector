import { HandLandmarkerResult } from "@mediapipe/tasks-vision";

export const extractHandsKeypoints = (results: HandLandmarkerResult): { leftHand: number[]; rightHand: number[] } => {
    const numLandmarks = 21;
    const dimensions = 3;
    const lh = Array(numLandmarks * dimensions).fill(0);
    const rh = Array(numLandmarks * dimensions).fill(0);
  
    if (results?.landmarks) {
      for (let i = 0; i < Math.min(results.landmarks.length, 2); i++) {
        const landmarks = results.landmarks[i];
        if (!landmarks) continue;
  
        for (let j = 0; j < Math.min(landmarks.length, numLandmarks); j++) {
          const landmark = landmarks[j];
          if (!landmark) continue;
  
          const baseIdx = j * dimensions;
          const target = i === 0 ? lh : rh;
          target[baseIdx] = landmark.x;
          target[baseIdx + 1] = landmark.y;
          target[baseIdx + 2] = landmark.z || 0;
        }
      }
    }
  
    return { leftHand: lh, rightHand: rh };
  };