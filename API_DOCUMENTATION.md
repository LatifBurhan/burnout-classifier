# API Documentation - Burnout Risk Classifier

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Single Prediction

Memprediksi risiko burnout untuk satu karyawan.

**Endpoint**: `POST /api/predict`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "is_weekend": 0,
  "work_hours": 8,
  "screen_time_hours": 6,
  "meetings_count": 3,
  "breaks_taken": 2,
  "after_hours_work": 0,
  "sleep_hours": 7,
  "task_completion_rate": 0.85
}
```

**Field Descriptions**:
| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `is_weekend` | number | 0 or 1 | 0 = Weekday, 1 = Weekend |
| `work_hours` | number | 0-24 | Jam kerja per hari |
| `screen_time_hours` | number | 0-24 | Jam screen time per hari |
| `meetings_count` | number | 0+ | Jumlah meeting |
| `breaks_taken` | number | 0+ | Jumlah istirahat |
| `after_hours_work` | number | 0 or 1 | 0 = Tidak lembur, 1 = Lembur |
| `sleep_hours` | number | 0-24 | Jam tidur per hari |
| `task_completion_rate` | number | 0.0-1.0 | Rate penyelesaian tugas |

**Success Response** (200):
```json
{
  "predicted_risk": "Low",
  "confidence_score": 0.92
}
```

**Error Response** (400):
```json
{
  "error": "Missing required field: work_hours"
}
```

**Error Response** (500):
```json
{
  "error": "Model file 'burnout_model.onnx' not found"
}
```

---

### 2. Bulk Prediction

Memprediksi risiko burnout untuk banyak karyawan sekaligus.

**Endpoint**: `POST /api/predict-bulk`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "data": [
    {
      "employee_id": "EMP001",
      "is_weekend": 0,
      "work_hours": 8,
      "screen_time_hours": 6,
      "meetings_count": 3,
      "breaks_taken": 2,
      "after_hours_work": 0,
      "sleep_hours": 7,
      "task_completion_rate": 0.85
    },
    {
      "employee_id": "EMP002",
      "is_weekend": 1,
      "work_hours": 4,
      "screen_time_hours": 3,
      "meetings_count": 1,
      "breaks_taken": 3,
      "after_hours_work": 0,
      "sleep_hours": 8,
      "task_completion_rate": 0.90
    }
  ]
}
```

**Success Response** (200):
```json
{
  "results": [
    {
      "employee_id": "EMP001",
      "is_weekend": 0,
      "work_hours": 8,
      "screen_time_hours": 6,
      "meetings_count": 3,
      "breaks_taken": 2,
      "after_hours_work": 0,
      "sleep_hours": 7,
      "task_completion_rate": 0.85,
      "predicted_risk": "Low",
      "confidence_score": 0.92
    },
    {
      "employee_id": "EMP002",
      "is_weekend": 1,
      "work_hours": 4,
      "screen_time_hours": 3,
      "meetings_count": 1,
      "breaks_taken": 3,
      "after_hours_work": 0,
      "sleep_hours": 8,
      "task_completion_rate": 0.90,
      "predicted_risk": "Low",
      "confidence_score": 0.95
    }
  ],
  "statistics": {
    "total_records": 2,
    "high_risk": 0,
    "medium_risk": 0,
    "low_risk": 2
  }
}
```

**Error Response** (400):
```json
{
  "error": "Expected 'data' field to be an array"
}
```

**Error Response** (500):
```json
{
  "error": "Failed to make bulk prediction"
}
```

---

## Risk Categories

| Category | Description |
|----------|-------------|
| **Low** | Risiko burnout rendah - Kondisi kerja sehat |
| **Medium** | Risiko burnout sedang - Perlu perhatian |
| **High** | Risiko burnout tinggi - Perlu intervensi segera |

---

## Example Usage

### cURL Examples

#### Single Prediction:
```bash
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "is_weekend": 0,
    "work_hours": 10,
    "screen_time_hours": 9,
    "meetings_count": 5,
    "breaks_taken": 1,
    "after_hours_work": 1,
    "sleep_hours": 6,
    "task_completion_rate": 0.75
  }'
```

#### Bulk Prediction:
```bash
curl -X POST http://localhost:3000/api/predict-bulk \
  -H "Content-Type: application/json" \
  -d @data.json
```

### JavaScript/Fetch Example

```javascript
// Single Prediction
async function predictSingle(data) {
  const response = await fetch('/api/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  return result;
}

// Usage
const prediction = await predictSingle({
  is_weekend: 0,
  work_hours: 8,
  screen_time_hours: 6,
  meetings_count: 3,
  breaks_taken: 2,
  after_hours_work: 0,
  sleep_hours: 7,
  task_completion_rate: 0.85
});

console.log(prediction);
// Output: { predicted_risk: "Low", confidence_score: 0.92 }
```

### Python Example

```python
import requests
import json

# Single Prediction
def predict_single(data):
    url = "http://localhost:3000/api/predict"
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, json=data, headers=headers)
    return response.json()

# Usage
data = {
    "is_weekend": 0,
    "work_hours": 8,
    "screen_time_hours": 6,
    "meetings_count": 3,
    "breaks_taken": 2,
    "after_hours_work": 0,
    "sleep_hours": 7,
    "task_completion_rate": 0.85
}

result = predict_single(data)
print(result)
# Output: {'predicted_risk': 'Low', 'confidence_score': 0.92}
```

---

## Rate Limiting

Saat ini tidak ada rate limiting. Untuk production, disarankan untuk menambahkan rate limiting middleware.

---

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 500 | Internal Server Error - Model error atau server error |

---

## Best Practices

1. **Validasi Input**: Selalu validasi input sebelum mengirim ke API
2. **Error Handling**: Implementasi proper error handling di client
3. **Retry Logic**: Tambahkan retry untuk network errors
4. **Batch Size**: Untuk bulk prediction, gunakan batch size yang reasonable (max 1000 records per request)
5. **Timeout**: Set timeout yang sesuai untuk request (recommended: 30 seconds untuk bulk)

---

## Model Information

- **Input Features**: 8 features
- **Output Classes**: 3 classes (Low, Medium, High)
- **Model Format**: ONNX
- **Inference Time**: ~50-100ms per prediction
- **Runtime**: ONNX Runtime Node

---

## Notes

- API berjalan di server-side Next.js
- Tidak memerlukan API key atau authentication
- Model inference dilakukan secara lokal
- Semua prediksi bersifat stateless
