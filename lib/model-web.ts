// Web-compatible version for Vercel deployment
import * as ort from "onnxruntime-web";

let modelSession: ort.InferenceSession | null = null;

export async function loadModelWeb(): Promise<ort.InferenceSession> {
  if (modelSession) {
    return modelSession;
  }

  try {
    // Load from public URL
    const modelPath = "/burnout_model.onnx";
    
    modelSession = await ort.InferenceSession.create(modelPath, {
      executionProviders: ["wasm"],
    });
    
    console.log("Model loaded successfully (web version)");
    return modelSession;
  } catch (error) {
    console.error("Error loading model:", error);
    throw error;
  }
}

export interface PredictionInput {
  is_weekend: number;
  work_hours: number;
  screen_time_hours: number;
  meetings_count: number;
  breaks_taken: number;
  after_hours_work: number;
  sleep_hours: number;
  task_completion_rate: number;
}

export interface PredictionResult {
  predicted_risk: string;
  confidence_score: number;
}

const RISK_LABELS = ["Low", "Medium", "High"];

export async function predictBurnoutRiskWeb(
  input: PredictionInput
): Promise<PredictionResult> {
  try {
    const session = await loadModelWeb();

    const inputArray = new Float32Array([
      input.is_weekend,
      input.work_hours,
      input.screen_time_hours,
      input.meetings_count,
      input.breaks_taken,
      input.after_hours_work,
      input.sleep_hours,
      input.task_completion_rate,
    ]);

    const inputTensor = new ort.Tensor("float32", inputArray, [1, 8]);
    const feeds = { [session.inputNames[0]]: inputTensor };
    const results = await session.run(feeds);
    
    const outputTensor = results[session.outputNames[0]];
    const outputData = Array.from(outputTensor.data as Float32Array);

    let maxIndex = 0;
    let maxValue = outputData[0];
    
    for (let i = 1; i < Math.min(3, outputData.length); i++) {
      if (outputData[i] > maxValue) {
        maxValue = outputData[i];
        maxIndex = i;
      }
    }

    const expValues = outputData.slice(0, 3).map((x) => Math.exp(x));
    const sumExp = expValues.reduce((a, b) => a + b, 0);
    const confidenceScore = expValues[maxIndex] / sumExp;

    return {
      predicted_risk: RISK_LABELS[maxIndex] || "Unknown",
      confidence_score: Math.round(confidenceScore * 100) / 100,
    };
  } catch (error) {
    console.error("Error during prediction:", error);
    throw error;
  }
}
