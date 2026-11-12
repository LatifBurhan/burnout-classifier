# WFH Employee Burnout Risk Classifier

Aplikasi web fullstack untuk memprediksi tingkat risiko burnout karyawan Work From Home menggunakan Machine Learning (ONNX Runtime).

## 🚀 Fitur Utama

- **Single Employee Prediction**: Form input manual untuk prediksi individual
- **Bulk CSV Upload**: Upload file CSV untuk prediksi massal
- **Real-time Inference**: Prediksi lokal menggunakan ONNX model (tanpa API eksternal)
- **Interactive Dashboard**: UI modern dengan visualisasi hasil prediksi
- **Export Results**: Download hasil prediksi dalam format CSV

## 📋 Kategori Risiko

- **Low**: Risiko burnout rendah
- **Medium**: Risiko burnout sedang
- **High**: Risiko burnout tinggi

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **ML Runtime**: ONNX Runtime Node
- **CSV Parser**: PapaParse
- **Icons**: Lucide React

## 📦 Instalasi

1. Clone atau ekstrak project ini

2. Install dependencies:
```bash
npm install
```

3. **PENTING**: Letakkan file model `burnout_model.onnx` di salah satu folder berikut:
   - `public/burnout_model.onnx`, atau
   - `lib/burnout_model.onnx`

4. Jalankan development server:
```bash
npm run dev
```

5. Buka browser di [http://localhost:3000](http://localhost:3000)

## 🎯 Input Features

Model menerima 8 parameter input:

1. **is_weekend** (0 atau 1): 0 = Weekday, 1 = Weekend
2. **work_hours** (number): Jam kerja per hari
3. **screen_time_hours** (number): Jam screen time per hari
4. **meetings_count** (number): Jumlah meeting per hari
5. **breaks_taken** (number): Jumlah istirahat yang diambil
6. **after_hours_work** (0 atau 1): Kerja lembur (0 = Tidak, 1 = Ya)
7. **sleep_hours** (number): Jam tidur per hari
8. **task_completion_rate** (0.0 - 1.0): Tingkat penyelesaian tugas

## 📊 Format CSV untuk Bulk Upload

Download template CSV dari aplikasi atau gunakan format berikut:

```csv
employee_id,is_weekend,work_hours,screen_time_hours,meetings_count,breaks_taken,after_hours_work,sleep_hours,task_completion_rate
EMP001,0,8,6,3,2,0,7,0.85
EMP002,1,4,3,1,3,0,8,0.90
EMP003,0,10,9,5,1,1,6,0.75
```

## 🔧 API Endpoints

### POST `/api/predict`
Prediksi single employee
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

Response:
```json
{
  "predicted_risk": "Low",
  "confidence_score": 0.92
}
```

### POST `/api/predict-bulk`
Prediksi batch/massal
```json
{
  "data": [
    {
      "employee_id": "EMP001",
      "is_weekend": 0,
      "work_hours": 8,
      ...
    }
  ]
}
```

Response:
```json
{
  "results": [...],
  "statistics": {
    "total_records": 100,
    "high_risk": 15,
    "medium_risk": 30,
    "low_risk": 55
  }
}
```

## 📱 Fitur UI

### Tab 1: Single Employee Prediction
- Form input interaktif dengan slider dan checkbox
- Real-time preview nilai input
- Kartu hasil prediksi dengan badge berwarna
- Progress bar confidence score
- Ringkasan input dan rekomendasi

### Tab 2: Bulk CSV Upload
- Drag-and-drop file uploader
- Download template CSV
- Statistik summary cards (Total, High, Medium, Low)
- Data table dengan filter dan search
- Export hasil ke CSV

## 🎨 UI Components

- **Sidebar Navigation**: Navigasi antar tab
- **Form Controls**: Input number, slider, checkbox, select
- **Risk Badges**: Badge berwarna sesuai tingkat risiko
- **Statistics Cards**: Kartu ringkasan statistik
- **Data Table**: Tabel interaktif dengan filter
- **Error Handling**: Notifikasi error yang jelas

## 🚨 Error Handling

Aplikasi menangani berbagai error:
- Model ONNX tidak ditemukan
- Input form tidak valid
- File CSV kosong atau format salah
- Error saat inference
- Network errors

## 📝 Notes

- Model ONNX harus sudah di-training sebelumnya
- Pastikan format output model sesuai (3 kelas: Low, Medium, High)
- Aplikasi berjalan sepenuhnya di local tanpa API eksternal
- Semua prediksi dilakukan di server-side Next.js

## 🔒 Production Build

```bash
npm run build
npm start
```

## 📄 License

MIT License

## 👨‍💻 Developer

Dibuat untuk keperluan assessment risiko burnout karyawan WFH.
