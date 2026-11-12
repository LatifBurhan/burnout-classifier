# System Architecture

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Next.js App Router (React)               │   │
│  │  ┌────────────────┐      ┌────────────────────────┐  │   │
│  │  │  Dashboard     │      │  Components            │  │   │
│  │  │  (page.tsx)    │────▶│  - SinglePrediction   │  │   │
│  │  │                │      │  - BulkUpload         │  │   │
│  │  └────────────────┘      └────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER (Backend)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Next.js API Routes                         │   │
│  │  ┌──────────────────┐    ┌──────────────────────┐   │   │
│  │  │ /api/predict     │    │ /api/predict-bulk    │   │   │
│  │  │ (Single)         │    │ (Batch)              │   │   │
│  │  └────────┬─────────┘    └──────────┬───────────┘   │   │
│  └───────────┼─────────────────────────┼───────────────┘   │
└──────────────┼─────────────────────────┼───────────────────┘
               │                         │
               └────────────┬────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               lib/model.ts                            │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │  • loadModel()                               │    │   │
│  │  │  • predictBurnoutRisk()                      │    │   │
│  │  │  • predictBatch()                            │    │   │
│  │  │  • Model Caching                             │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    ML INFERENCE ENGINE                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           ONNX Runtime Node                           │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Input: [batch_size, 8] float32              │  │   │
│  │  │         ↓                                      │  │   │
│  │  │  Model: burnout_model.onnx                    │  │   │
│  │  │         ↓                                      │  │   │
│  │  │  Output: [batch_size, 3] float32             │  │   │
│  │  │         (Low, Medium, High)                   │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagrams

### Single Prediction Flow

```
User
  │
  │ 1. Fill Form (8 parameters)
  ▼
┌─────────────────────────┐
│ SinglePredictionForm    │
│ (Client Component)      │
└────────┬────────────────┘
         │
         │ 2. POST /api/predict
         │    { is_weekend, work_hours, ... }
         ▼
┌─────────────────────────┐
│ API Route Handler       │
│ (Server-side)           │
│  • Validate input       │
│  • Check required fields│
└────────┬────────────────┘
         │
         │ 3. Call predictBurnoutRisk()
         ▼
┌─────────────────────────┐
│ Model Layer             │
│  • Load model (cached)  │
│  • Prepare tensor       │
│  • Run inference        │
└────────┬────────────────┘
         │
         │ 4. ONNX Runtime inference
         ▼
┌─────────────────────────┐
│ ONNX Model              │
│  Input: [1, 8]         │
│  Output: [1, 3]        │
└────────┬────────────────┘
         │
         │ 5. Process output
         │    • Get max index
         │    • Calculate confidence
         ▼
┌─────────────────────────┐
│ Response                │
│ {                       │
│   predicted_risk: "Low",│
│   confidence_score: 0.92│
│ }                       │
└────────┬────────────────┘
         │
         │ 6. Display result
         ▼
┌─────────────────────────┐
│ UI Result Card          │
│  • Risk badge           │
│  • Confidence bar       │
│  • Recommendations      │
└─────────────────────────┘
```

### Bulk Upload Flow

```
User
  │
  │ 1. Upload CSV file
  ▼
┌─────────────────────────┐
│ BulkUploadForm          │
│  • Drag & drop          │
│  • File validation      │
└────────┬────────────────┘
         │
         │ 2. Parse CSV (PapaParse)
         ▼
┌─────────────────────────┐
│ CSV Data Array          │
│ [                       │
│   {emp_id, features},   │
│   {emp_id, features},   │
│   ...                   │
│ ]                       │
└────────┬────────────────┘
         │
         │ 3. POST /api/predict-bulk
         │    { data: [...] }
         ▼
┌─────────────────────────┐
│ API Route Handler       │
│  • Validate array       │
│  • Transform data       │
└────────┬────────────────┘
         │
         │ 4. Call predictBatch()
         ▼
┌─────────────────────────┐
│ Batch Processing        │
│  for each item:         │
│    • Prepare input      │
│    • Run prediction     │
│    • Collect result     │
└────────┬────────────────┘
         │
         │ 5. Multiple ONNX inferences
         ▼
┌─────────────────────────┐
│ Aggregated Results      │
│  • All predictions      │
│  • Calculate statistics │
└────────┬────────────────┘
         │
         │ 6. Return results + stats
         ▼
┌─────────────────────────┐
│ Response                │
│ {                       │
│   results: [...],       │
│   statistics: {         │
│     total: 100,         │
│     high: 15,           │
│     medium: 30,         │
│     low: 55             │
│   }                     │
│ }                       │
└────────┬────────────────┘
         │
         │ 7. Display table & stats
         ▼
┌─────────────────────────┐
│ Results Display         │
│  • Statistics cards     │
│  • Data table           │
│  • Filter & search      │
│  • Export button        │
└─────────────────────────┘
```

## 🗂️ Component Hierarchy

```
App
│
├── layout.tsx (Root Layout)
│   ├── globals.css
│   └── metadata
│
└── page.tsx (Dashboard)
    │
    ├── Sidebar Navigation
    │   ├── Logo & Title
    │   ├── Tab: Single Prediction
    │   └── Tab: Bulk Upload
    │
    └── Main Content
        │
        ├── [Tab: Single Prediction]
        │   └── SinglePredictionForm.tsx
        │       ├── Form Section
        │       │   ├── Day Type Select
        │       │   ├── Work Hours Slider
        │       │   ├── Screen Time Slider
        │       │   ├── Meetings Input
        │       │   ├── Breaks Input
        │       │   ├── After Hours Checkbox
        │       │   ├── Sleep Hours Slider
        │       │   ├── Task Rate Slider
        │       │   └── Submit Button
        │       │
        │       └── Result Section
        │           ├── Risk Badge
        │           ├── Confidence Bar
        │           ├── Input Summary
        │           └── Recommendations
        │
        └── [Tab: Bulk Upload]
            └── BulkUploadForm.tsx
                ├── Upload Section
                │   ├── Download Template
                │   ├── Drag & Drop Area
                │   └── Process Button
                │
                └── Results Section
                    ├── Statistics Cards
                    │   ├── Total Records
                    │   ├── High Risk Count
                    │   ├── Medium Risk Count
                    │   └── Low Risk Count
                    │
                    └── Data Table
                        ├── Search Input
                        ├── Filter Dropdown
                        ├── Table Rows
                        └── Export Button
```

## 🔌 API Endpoints Architecture

```
API Routes (Next.js)
│
├── /api/predict
│   │
│   ├── Method: POST
│   │
│   ├── Request Body:
│   │   {
│   │     is_weekend: number,
│   │     work_hours: number,
│   │     screen_time_hours: number,
│   │     meetings_count: number,
│   │     breaks_taken: number,
│   │     after_hours_work: number,
│   │     sleep_hours: number,
│   │     task_completion_rate: number
│   │   }
│   │
│   ├── Response (200):
│   │   {
│   │     predicted_risk: string,
│   │     confidence_score: number
│   │   }
│   │
│   └── Error (400/500):
│       {
│         error: string
│       }
│
└── /api/predict-bulk
    │
    ├── Method: POST
    │
    ├── Request Body:
    │   {
    │     data: [
    │       { employee_id?, ...features },
    │       { employee_id?, ...features },
    │       ...
    │     ]
    │   }
    │
    ├── Response (200):
    │   {
    │     results: [
    │       {
    │         ...original_data,
    │         predicted_risk: string,
    │         confidence_score: number
    │       },
    │       ...
    │     ],
    │     statistics: {
    │       total_records: number,
    │       high_risk: number,
    │       medium_risk: number,
    │       low_risk: number
    │     }
    │   }
    │
    └── Error (400/500):
        {
          error: string
        }
```

## 🧩 Module Dependencies

```
app/page.tsx
  ├── components/SinglePredictionForm.tsx
  │   ├── lucide-react
  │   ├── lib/utils.ts
  │   └── fetch(/api/predict)
  │
  └── components/BulkUploadForm.tsx
      ├── lucide-react
      ├── papaparse
      ├── lib/utils.ts
      └── fetch(/api/predict-bulk)

app/api/predict/route.ts
  ├── next/server
  └── lib/model.ts
      ├── onnxruntime-node
      ├── path
      └── fs

app/api/predict-bulk/route.ts
  ├── next/server
  └── lib/model.ts

lib/utils.ts
  ├── clsx
  └── tailwind-merge
```

## 💾 State Management

```
Application State
│
├── Component State (React useState)
│   │
│   ├── SinglePredictionForm
│   │   ├── formData (object)
│   │   ├── result (object | null)
│   │   ├── loading (boolean)
│   │   └── error (string | null)
│   │
│   └── BulkUploadForm
│       ├── file (File | null)
│       ├── results (object | null)
│       ├── loading (boolean)
│       ├── error (string | null)
│       ├── searchTerm (string)
│       └── filterRisk (string)
│
└── Server State (Module-level cache)
    └── modelSession (InferenceSession | null)
        ↳ Cached after first load
```

## 🎨 Styling Architecture

```
Tailwind CSS
│
├── Global Styles (app/globals.css)
│   ├── @tailwind base
│   ├── @tailwind components
│   ├── @tailwind utilities
│   └── Custom CSS variables
│
├── Component Styles (Inline Tailwind)
│   ├── Utility classes
│   ├── Responsive modifiers
│   └── State variants (hover, focus)
│
└── Theme Configuration (tailwind.config.ts)
    ├── Colors
    ├── Spacing
    └── Custom utilities
```

## 🔐 Security Layers

```
Security Architecture
│
├── Input Validation
│   ├── Type checking (TypeScript)
│   ├── Range validation (API)
│   └── Required field checks
│
├── File Upload Security
│   ├── File type validation (.csv only)
│   ├── Client-side checking
│   └── Server-side validation
│
├── API Security
│   ├── Method validation (POST only)
│   ├── Content-Type checking
│   └── Error message sanitization
│
└── Error Handling
    ├── Try-catch blocks
    ├── User-friendly messages
    └── Server-side logging
```

## 📊 Performance Architecture

```
Performance Optimizations
│
├── Model Caching
│   └── Load once, reuse session
│
├── Code Splitting
│   ├── Next.js automatic splitting
│   └── Component-level imports
│
├── CSS Optimization
│   ├── Tailwind JIT
│   └── PurgeCSS in production
│
└── Build Optimization
    ├── Minification
    ├── Tree shaking
    └── Image optimization
```

## 🌐 Deployment Architecture

```
Deployment Options
│
├── Vercel (Serverless)
│   ├── Edge Functions
│   ├── Automatic scaling
│   └── CDN distribution
│
├── Docker (Containerized)
│   ├── Node.js container
│   ├── Port mapping
│   └── Volume mounting
│
├── Traditional Server (VPS)
│   ├── PM2 process manager
│   ├── Nginx reverse proxy
│   └── SSL certificate
│
└── Heroku (PaaS)
    ├── Buildpack
    ├── Dyno scaling
    └── Add-ons
```

## 🔄 Development Workflow

```
Development Cycle
│
├── 1. Development
│   ├── npm run dev
│   ├── Hot reload
│   └── TypeScript checking
│
├── 2. Testing
│   ├── Manual testing
│   ├── API testing
│   └── UI testing
│
├── 3. Build
│   ├── npm run build
│   ├── TypeScript compilation
│   └── Optimization
│
├── 4. Deployment
│   ├── Deploy to platform
│   ├── Environment variables
│   └── Health checks
│
└── 5. Monitoring
    ├── Error logs
    ├── Performance metrics
    └── User feedback
```

---

**Architecture Version**: 1.0.0  
**Last Updated**: 2024  
**Complexity**: Medium  
**Scalability**: High
