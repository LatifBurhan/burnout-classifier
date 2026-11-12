import * as ort from "onnxruntime-node";
import path from "path";
import fs from "fs";

let modelSession: ort.InferenceSession | null = null;

export async function loadModel(): Promise<ort.InferenceSession> {
  if (modelSession) {
    return modelSession;
  }

  try {
    // Try to load from public folder first
    let modelPath = path.join(process.cwd(), "public", "burnout_model.onnx");
    
    // If not found, try lib folder
    if (!fs.existsSync(modelPath)) {
      modelPath = path.join(process.cwd(), "lib", "burnout_model.onnx");
    }

    // Check if model exists
    if (!fs.existsSync(modelPath)) {
      throw new Error(
        "Model file 'burnout_model.onnx' not found. Please place it in the 'public' or 'lib' folder."
      );
    }

    // Create session with options to handle different model types
    const sessionOptions: ort.InferenceSession.SessionOptions = {
      executionProviders: ["cpu"],
      graphOptimizationLevel: "all",
    };

    modelSession = await ort.InferenceSession.create(modelPath, sessionOptions);
    
    console.log("Model loaded successfully from:", modelPath);
    console.log("Input names:", modelSession.inputNames);
    console.log("Output names:", modelSession.outputNames);
    
    // Log input/output metadata
    modelSession.inputNames.forEach((name) => {
      const meta = modelSession?.inputMetadata.find((item) => item.name === name);
      console.log(`Input '${name}':`, meta);
    });
    modelSession.outputNames.forEach((name) => {
      const meta = modelSession?.outputMetadata.find((item) => item.name === name);
      console.log(`Output '${name}':`, meta);
    });

    return modelSession;
  } catch (error) {
    console.error("Error loading model:", error);
    throw error;
  }
}

export interface PredictionInput {
  is_weekend: number; // 0 or 1
  work_hours: number;
  screen_time_hours: number;
  meetings_count: number;
  breaks_taken: number;
  after_hours_work: number; // 0 or 1
  sleep_hours: number;
  task_completion_rate: number;
}

export interface PredictionResult {
  predicted_risk: string;
  confidence_score: number;
}

// Class order MUST match the model's `classlabels_strings` attribute.
// This model was trained with string labels, so scikit-learn sorts them
// alphabetically: High, Low, Medium (NOT Low, Medium, High).
const RISK_LABELS = ["High", "Low", "Medium"];

function toProbabilities(data: ArrayLike<number>): number[] {
  const probs = Array.from(data as ArrayLike<number>, Number).slice(0, 3);
  if (probs.length === 0) return probs;

  const sum = probs.reduce((a, b) => a + b, 0);
  const isProbability =
    probs.every((p) => p >= 0 && p <= 1) && Math.abs(sum - 1) < 1e-3;

  if (isProbability) return probs;

  // Values are logits: convert to probabilities with a stable softmax.
  const max = Math.max(...probs);
  const expValues = probs.map((p) => Math.exp(p - max));
  const sumExp = expValues.reduce((a, b) => a + b, 0);
  return expValues.map((value) => value / sumExp);
}

export async function predictBurnoutRisk(
  input: PredictionInput
): Promise<PredictionResult> {
  try {
    const session = await loadModel();

    // The model was trained with task_completion_rate expressed as a
    // percentage (0-100), while the API accepts a fraction (0-1).
    const taskCompletionRate =
      input.task_completion_rate <= 1
        ? input.task_completion_rate * 100
        : input.task_completion_rate;

    // Prepare input tensor
    const inputArray = new Float32Array([
      input.is_weekend,
      input.work_hours,
      input.screen_time_hours,
      input.meetings_count,
      input.breaks_taken,
      input.after_hours_work,
      input.sleep_hours,
      taskCompletionRate,
    ]);

    const inputTensor = new ort.Tensor("float32", inputArray, [1, 8]);

    const feeds: Record<string, ort.Tensor> = {};
    feeds[session.inputNames[0]] = inputTensor;

    const results = await session.run(feeds, session.outputNames);

    // Find the probabilities tensor regardless of its output name.
    const outputTensor =
      results[session.outputNames[0]] ??
      results.probabilities ??
      results.output;

    if (!outputTensor || !outputTensor.data) {
      throw new Error("Model did not return a valid output tensor");
    }

    const probabilities = toProbabilities(
      outputTensor.data as unknown as ArrayLike<number>
    );

    let maxIndex = 0;
    for (let i = 1; i < probabilities.length; i++) {
      if (probabilities[i] > probabilities[maxIndex]) {
        maxIndex = i;
      }
    }

    const confidenceScore = probabilities[maxIndex] ?? 0;

    return {
      predicted_risk: RISK_LABELS[maxIndex] || "Unknown",
      confidence_score: Math.round(confidenceScore * 100) / 100,
    };
  } catch (error) {
    console.error("Error during prediction:", error);
    throw error;
  }
}

export async function predictBatch(
  inputs: PredictionInput[]
): Promise<PredictionResult[]> {
  const results: PredictionResult[] = [];

  for (const input of inputs) {
    try {
      const result = await predictBurnoutRisk(input);
      results.push(result);
    } catch (error) {
      console.error("Error predicting batch item:", error);
      results.push({
        predicted_risk: "Error",
        confidence_score: 0,
      });
    }
  }

  return results;
}
