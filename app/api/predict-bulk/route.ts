import { NextRequest, NextResponse } from "next/server";
import { predictBatch, PredictionInput } from "@/lib/model";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body.data)) {
      return NextResponse.json(
        { error: "Expected 'data' field to be an array" },
        { status: 400 }
      );
    }

    const inputs: PredictionInput[] = body.data.map((item: any) => ({
      is_weekend: Number(item.is_weekend || 0),
      work_hours: Number(item.work_hours || 0),
      screen_time_hours: Number(item.screen_time_hours || 0),
      meetings_count: Number(item.meetings_count || 0),
      breaks_taken: Number(item.breaks_taken || 0),
      after_hours_work: Number(item.after_hours_work || 0),
      sleep_hours: Number(item.sleep_hours || 0),
      task_completion_rate: Number(item.task_completion_rate || 0),
    }));

    // Run batch prediction
    const predictions = await predictBatch(inputs);

    // Calculate statistics
    const stats = {
      total_records: predictions.length,
      high_risk: predictions.filter((p) => p.predicted_risk === "High").length,
      medium_risk: predictions.filter((p) => p.predicted_risk === "Medium")
        .length,
      low_risk: predictions.filter((p) => p.predicted_risk === "Low").length,
    };

    // Combine original data with predictions
    const results = body.data.map((item: any, index: number) => ({
      ...item,
      predicted_risk: predictions[index].predicted_risk,
      confidence_score: predictions[index].confidence_score,
    }));

    return NextResponse.json({
      results,
      statistics: stats,
    });
  } catch (error: any) {
    console.error("Bulk prediction error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to make bulk prediction" },
      { status: 500 }
    );
  }
}
