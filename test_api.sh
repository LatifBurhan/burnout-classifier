#!/bin/bash

echo "🧪 Testing Burnout Classifier API"
echo "=================================="
echo ""

# Test single prediction
echo "Testing POST /api/predict..."
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "is_weekend": 0,
    "work_hours": 8,
    "screen_time_hours": 6,
    "meetings_count": 3,
    "breaks_taken": 2,
    "after_hours_work": 0,
    "sleep_hours": 7,
    "task_completion_rate": 0.85
  }' | python3 -m json.tool

echo ""
echo ""
echo "=================================="
echo "✅ Test complete!"
