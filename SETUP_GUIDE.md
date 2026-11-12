# Setup Guide - WFH Burnout Risk Classifier

## 📋 Prerequisites

Pastikan Anda sudah menginstall:
- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- File model ONNX (`burnout_model.onnx`)

## 🔧 Langkah-langkah Setup

### 1. Install Dependencies

```bash
cd burnout-classifier
npm install
```

Ini akan menginstall semua package yang diperlukan:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- ONNX Runtime Node
- PapaParse
- Lucide React

### 2. Setup Model ONNX

**SANGAT PENTING**: Aplikasi memerlukan file model ONNX untuk berfungsi.

Letakkan file `burnout_model.onnx` di salah satu lokasi berikut:

#### Opsi A: Folder Public (Direkomendasikan)
```
burnout-classifier/
├── public/
│   └── burnout_model.onnx  ← Letakkan di sini
```

#### Opsi B: Folder Lib
```
burnout-classifier/
├── lib/
│   └── burnout_model.onnx  ← Atau di sini
```

### 3. Verifikasi Structure Folder

Struktur folder harus seperti ini:

```
burnout-classifier/
├── app/
│   ├── api/
│   │   ├── predict/
│   │   │   └── route.ts
│   │   └── predict-bulk/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── SinglePredictionForm.tsx
│   └── BulkUploadForm.tsx
├── lib/
│   ├── model.ts
│   └── utils.ts
├── public/
│   ├── burnout_model.onnx  ← Model Anda
│   └── MODEL_PLACEHOLDER.txt
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Server akan berjalan di: http://localhost:3000

### 5. Test Aplikasi

#### Test Single Prediction:
1. Buka http://localhost:3000
2. Pilih tab "Single Prediction"
3. Isi form dengan data sample
4. Klik "Prediksi Risiko Burnout"
5. Lihat hasil prediksi

#### Test Bulk Upload:
1. Pilih tab "Bulk Upload"
2. Klik "Download Template" untuk mendapatkan format CSV
3. Upload file CSV
4. Klik "Process File"
5. Lihat hasil dan statistik

## 🧪 Testing

### Test API Endpoint Secara Manual

#### Test Single Prediction API:
```bash
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
  }'
```

Expected Response:
```json
{
  "predicted_risk": "Low",
  "confidence_score": 0.92
}
```

#### Test Bulk Prediction API:
```bash
curl -X POST http://localhost:3000/api/predict-bulk \
  -H "Content-Type: application/json" \
  -d '{
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
      }
    ]
  }'
```

## 🚨 Troubleshooting

### Error: "Model file not found"
**Solusi**: Pastikan file `burnout_model.onnx` ada di folder `public/` atau `lib/`

### Error: "Cannot find module 'onnxruntime-node'"
**Solusi**: 
```bash
npm install onnxruntime-node
```

### Error: Port 3000 sudah digunakan
**Solusi**: Jalankan di port lain:
```bash
PORT=3001 npm run dev
```

### Error: CSV parsing failed
**Solusi**: 
- Pastikan file CSV memiliki header yang benar
- Gunakan template yang disediakan
- Pastikan tidak ada baris kosong di akhir file

### UI tidak responsif atau styling rusak
**Solusi**:
```bash
# Hapus folder .next dan rebuild
rm -rf .next
npm run dev
```

## 📦 Build untuk Production

### 1. Build aplikasi:
```bash
npm run build
```

### 2. Test production build:
```bash
npm start
```

### 3. Deploy (contoh menggunakan Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**CATATAN**: Pastikan file `burnout_model.onnx` ikut ter-upload saat deploy!

## 🔒 Environment Variables

Jika diperlukan, buat file `.env.local`:

```env
NODE_ENV=production
PORT=3000
```

## 📊 Performa

- **Cold Start**: ~2-3 detik (loading model pertama kali)
- **Single Prediction**: ~50-100ms
- **Bulk Prediction (100 records)**: ~5-10 detik

## 🎯 Next Steps

Setelah setup berhasil:
1. ✅ Test semua fitur
2. ✅ Upload file CSV sample
3. ✅ Verify hasil prediksi
4. ✅ Export hasil ke CSV
5. ✅ Test di berbagai browser

## 📞 Support

Jika mengalami masalah:
1. Check console browser (F12) untuk error
2. Check terminal untuk error log
3. Pastikan semua dependencies terinstall
4. Pastikan model ONNX compatible

## 🎉 Selesai!

Aplikasi Anda siap digunakan untuk memprediksi risiko burnout karyawan WFH!
