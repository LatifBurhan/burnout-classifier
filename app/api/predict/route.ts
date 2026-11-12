import { NextRequest, NextResponse } from "next/server";
import { predictBurnoutRisk, PredictionInput } from "@/lib/model";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const requiredFields = [
      "is_weekend",
      "work_hours",
      "screen_time_hours",
      "meetings_count",
      "breaks_taken",
      "after_hours_work",
      "sleep_hours",
      "task_completion_rate",
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate numeric ranges
    if (body.is_weekend !== 0 && body.is_weekend !== 1) {
      return NextResponse.json(
        { error: "is_weekend must be 0 or 1" },
        { status: 400 }
      );
    }

    if (body.after_hours_work !== 0 && body.after_hours_work !== 1) {
      return NextResponse.json(
        { error: "after_hours_work must be 0 or 1" },
        { status: 400 }
      );
    }

    const input: PredictionInput = {
      is_weekend: Number(body.is_weekend),
      work_hours: Number(body.work_hours),
      screen_time_hours: Number(body.screen_time_hours),
      meetings_count: Number(body.meetings_count),
      breaks_taken: Number(body.breaks_taken),
      after_hours_work: Number(body.after_hours_work),
      sleep_hours: Number(body.sleep_hours),
      task_completion_rate: Number(body.task_completion_rate),
    };

    // Run prediction
    const result = await predictBurnoutRisk(input);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Prediction error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to make prediction" },
      { status: 500 }
    );
  }
}
