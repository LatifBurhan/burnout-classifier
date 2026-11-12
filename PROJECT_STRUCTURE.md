# Project Structure

## 📁 Struktur Folder dan File

```
burnout-classifier/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── predict/              # Single prediction endpoint
│   │   │   └── route.ts
│   │   └── predict-bulk/         # Bulk prediction endpoint
│   │       └── route.ts
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage (main dashboard)
│
├── components/                   # React Components
│   ├── SinglePredictionForm.tsx  # Form untuk single prediction
│   └── BulkUploadForm.tsx        # Form untuk bulk upload
│
├── lib/                          # Utility libraries
│   ├── model.ts                  # ONNX model loading & inference
│   └── utils.ts                  # Helper functions
│
├── public/                       # Static assets
│   ├── burnout_model.onnx        # ONNX Model (HARUS DITAMBAHKAN)
│   ├── sample_data.csv           # Sample CSV data
│   └── MODEL_PLACEHOLDER.txt     # Instruksi untuk model
│
├── .env.example                  # Environment variables template
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Git ignore rules
├── next.config.mjs               # Next.js configuration
├── next-env.d.ts                 # Next.js TypeScript declarations
├── package.json                  # Dependencies & scripts
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
│
├── README.md                     # Main documentation
├── SETUP_GUIDE.md                # Setup instructions
├── API_DOCUMENTATION.md          # API reference
├── DEPLOYMENT.md                 # Deployment guide
├── MODEL_TRAINING_GUIDE.md       # Model training guide
├── CONTRIBUTING.md               # Contribution guidelines
└── PROJECT_STRUCTURE.md          # This file
```

## 📄 File Descriptions

### Core Application Files

#### `app/page.tsx`
- Main dashboard dengan sidebar navigation
- Tab switching antara Single Prediction dan Bulk Upload
- Layout utama aplikasi

#### `app/layout.tsx`
- Root layout component
- Global metadata dan font configuration
- Wraps semua pages

#### `app/globals.css`
- Global CSS styles
- Tailwind directives
- Custom CSS variables

### API Routes

#### `app/api/predict/route.ts`
- **Endpoint**: `POST /api/predict`
- **Function**: Single employee prediction
- **Input**: JSON dengan 8 features
- **Output**: predicted_risk dan confidence_score

#### `app/api/predict-bulk/route.ts`
- **Endpoint**: `POST /api/predict-bulk`
- **Function**: Batch prediction untuk multiple employees
- **Input**: Array of employee data
- **Output**: Results array + statistics

### Components

#### `components/SinglePredictionForm.tsx`
- Form input dengan 8 parameters
- Interactive controls (sliders, inputs, checkbox)
- Real-time result display
- Risk badge, confidence score, recommendations

#### `components/BulkUploadForm.tsx`
- Drag-and-drop CSV uploader
- Template download button
- Statistics cards (Total, High, Medium, Low)
- Interactive data table dengan filter & search
- Export results to CSV

### Libraries

#### `lib/model.ts`
- ONNX model loading dan caching
- `loadModel()`: Load model dari file system
- `predictBurnoutRisk()`: Single prediction
- `predictBatch()`: Batch prediction
- Type definitions untuk input/output

#### `lib/utils.ts`
- `cn()`: Tailwind class merger
- `getRiskColor()`: Get color classes by risk level
- `getRiskRecommendation()`: Get recommendation text

### Configuration Files

#### `package.json`
- Project metadata
- Dependencies
- Scripts (dev, build, start, lint)

#### `tsconfig.json`
- TypeScript compiler options
- Path aliases (@/*)
- Include/exclude patterns

#### `tailwind.config.ts`
- Tailwind CSS customization
- Content paths
- Theme extensions
- Custom colors

#### `next.config.mjs`
- Next.js configuration
- Webpack externals untuk onnxruntime-node
- Build optimization

#### `postcss.config.mjs`
- PostCSS plugins
- Tailwind CSS processing
- Autoprefixer

#### `.eslintrc.json`
- ESLint rules
- Next.js core web vitals preset

## 🔑 Key Technologies

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **CSV Parsing**: PapaParse

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **ML Inference**: ONNX Runtime Node

### Development
- **Package Manager**: npm
- **Linter**: ESLint
- **Type Checker**: TypeScript

## 🎯 Core Features Location

### Single Prediction Feature
- **UI**: `components/SinglePredictionForm.tsx`
- **API**: `app/api/predict/route.ts`
- **Logic**: `lib/model.ts` - `predictBurnoutRisk()`

### Bulk Upload Feature
- **UI**: `components/BulkUploadForm.tsx`
- **API**: `app/api/predict-bulk/route.ts`
- **Logic**: `lib/model.ts` - `predictBatch()`

### Model Management
- **Loading**: `lib/model.ts` - `loadModel()`
- **Storage**: `public/burnout_model.onnx` or `lib/burnout_model.onnx`
- **Caching**: In-memory session cache

### Styling & UI
- **Global Styles**: `app/globals.css`
- **Utilities**: `lib/utils.ts`
- **Components**: All components use Tailwind CSS

## 📊 Data Flow

### Single Prediction Flow:
```
User Input (Form)
  ↓
SinglePredictionForm.tsx
  ↓
POST /api/predict
  ↓
route.ts (validate)
  ↓
lib/model.ts (predict)
  ↓
ONNX Runtime
  ↓
Response (risk + confidence)
  ↓
Display Result
```

### Bulk Prediction Flow:
```
CSV File Upload
  ↓
BulkUploadForm.tsx
  ↓
PapaParse (parse CSV)
  ↓
POST /api/predict-bulk
  ↓
route.ts (validate)
  ↓
lib/model.ts (predictBatch)
  ↓
ONNX Runtime (loop)
  ↓
Response (results + stats)
  ↓
Display Table + Export
```

## 🔐 Security Considerations

### Input Validation
- **Location**: `app/api/*/route.ts`
- **Validates**: Required fields, data types, ranges

### File Upload
- **Accepted**: CSV only
- **Client-side**: File type checking
- **Server-side**: Content validation

### Error Handling
- **API Errors**: Proper HTTP status codes
- **UI Errors**: User-friendly error messages
- **Logging**: Console logging untuk debugging

## 🚀 Performance Optimizations

### Model Loading
- **Strategy**: Load once, cache in memory
- **Location**: `lib/model.ts` - `modelSession` variable

### Component Rendering
- **Client Components**: Use "use client" directive
- **State Management**: React hooks (useState)

### API Responses
- **Single**: ~50-100ms
- **Bulk**: ~5-10s for 100 records

## 📝 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main project overview |
| `SETUP_GUIDE.md` | Step-by-step setup instructions |
| `API_DOCUMENTATION.md` | Complete API reference |
| `DEPLOYMENT.md` | Deployment instructions for various platforms |
| `MODEL_TRAINING_GUIDE.md` | Guide untuk training ONNX model |
| `CONTRIBUTING.md` | Contribution guidelines |
| `PROJECT_STRUCTURE.md` | This file - project structure explanation |

## 🧩 Extension Points

### Adding New Features
- **New API Endpoint**: Create folder in `app/api/`
- **New Component**: Add to `components/`
- **New Utility**: Add to `lib/`

### Customizing UI
- **Colors**: Edit `tailwind.config.ts`
- **Styles**: Edit `app/globals.css`
- **Components**: Modify files in `components/`

### Model Updates
- **Replace**: Update `public/burnout_model.onnx`
- **Cache**: Restart server to reload model

## 🎨 UI Customization Guide

### Color Scheme
- **Primary**: Blue (#2563eb)
- **Low Risk**: Green (#10b981)
- **Medium Risk**: Yellow (#f59e0b)
- **High Risk**: Red (#ef4444)

### Typography
- **Headings**: Bold, gray-900
- **Body**: Regular, gray-700
- **Captions**: Small, gray-500

### Layout
- **Sidebar**: 256px fixed width
- **Main**: Flex-1, responsive
- **Max Width**: 7xl (80rem)

## 🔄 State Management

### Component State
- **Form Data**: Local state dengan useState
- **Loading**: Boolean flag
- **Errors**: String message
- **Results**: Object/Array

### No Global State
- Tidak menggunakan Redux/Context API
- Semua state local per component
- API calls dengan fetch

## 📦 Dependencies Overview

### Production Dependencies
```json
{
  "next": "App Router, SSR",
  "react": "UI Library",
  "react-dom": "DOM Renderer",
  "onnxruntime-node": "ML Inference",
  "papaparse": "CSV Parser",
  "lucide-react": "Icon Library",
  "clsx": "Conditional Classes",
  "tailwind-merge": "Class Merger"
}
```

### Dev Dependencies
```json
{
  "typescript": "Type Safety",
  "tailwindcss": "Utility CSS",
  "@types/*": "Type Definitions",
  "eslint": "Code Linting"
}
```

## 🎯 Quick Reference

### Run Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

### Add Dependency
```bash
npm install package-name
```

---

**Last Updated**: 2024
**Version**: 1.0.0
**Maintainer**: Development Team
