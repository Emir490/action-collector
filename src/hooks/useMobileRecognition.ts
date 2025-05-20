"use client";

import { useState } from "react";
import * as tf from "@tensorflow/tfjs";

const useMobileRecognition = () => {
  const [predictedAction, setPredictedAction] = useState("");
  const [model, setModel] = useState<tf.LayersModel | null>(null);

  const loadModel = async () => {
    try {
      const modelLoaded = await tf.loadLayersModel("../../mobile_model/model.json");
      setModel(modelLoaded);
    } catch (error) {
      console.error("Error loading model:", error);
    }
  };

  return {
    loadModel,
    model,
    predictedAction,
    setPredictedAction,
  };
};

export default useMobileRecognition;
