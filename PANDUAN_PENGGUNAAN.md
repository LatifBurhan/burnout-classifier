# 📘 Panduan Penggunaan Sistem WFH Employee Burnout Risk Classifier

## Daftar Isi
1. [Pengenalan Sistem](#pengenalan-sistem)
2. [Akses Aplikasi](#akses-aplikasi)
3. [Fitur 1: Prediksi Individual](#fitur-1-prediksi-individual)
4. [Fitur 2: Upload CSV Bulk](#fitur-2-upload-csv-bulk)
5. [Fitur 3: Model Metrics](#fitur-3-model-metrics)
6. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## Pengenalan Sistem

### Apa itu WFH Employee Burnout Risk Classifier?
Sistem ini adalah aplikasi web berbasis Machine Learning yang menggunakan algoritma **Naive Bayes** untuk memprediksi risiko burnout karyawan Work From Home (WFH). Sistem dapat memprediksi tiga kategori risiko:
- 🟢 **Low Risk** - Risiko rendah burnout
- 🟡 **Medium Risk** - Risiko sedang burnout  
- 🔴 **High Risk** - Risiko tinggi burnout

### Teknologi yang Digunakan
- **Frontend & Backend**: Next.js 14 (App Router)
- **Machine Learning**: ONNX Runtime (model lokal)
- **Algoritma**: Gaussian Naive Bayes
- **Akurasi Model**: 69%
- **Data Split**: 80% Training / 20% Testing

### Parameter Input (8 Variabel)
| No | Parameter | Deskripsi | Rentang Nilai |
|----|-----------|-----------|---------------|
| 1 | **is_weekend** | Apakah hari kerja di akhir pekan? | 0 (Tidak) / 1 (Ya) |
| 2 | **work_hours** | Total jam kerja per hari | 1 - 16 jam |
| 3 | **screen_time_hours** | Waktu di depan layar per hari | 1 - 16 jam |
| 4 | **meetings_count** | Jumlah meeting per hari | 0 - 15 meeting |
| 5 | **breaks_taken** | Jumlah istirahat yang diambil | 0 - 10 kali |
| 6 | **after_hours_work** | Jam kerja di luar jam kerja | 0 - 8 jam |
| 7 | **sleep_hours** | Durasi tidur per hari | 3 - 10 jam |
| 8 | **task_completion_rate** | Tingkat penyelesaian tugas | 0.0 - 1.0 (0% - 100%) |

---

## Akses Aplikasi

### URL Aplikasi
```
https://[URL-VERCEL-ANDA].vercel.app
```

### Tampilan Awal Aplikasi
**[SCREENSHOT 1: Halaman utama aplikasi]**
📸 *Screenshot: Tampilan landing page dengan sidebar navigasi*

> **Lokasi untuk screenshot:**
> - Tampilan full screen aplikasi
> - Menu sidebar di sebelah kiri
> - Logo "Burnout Risk Classifier" di header

---

## Fitur 1: Prediksi Individual

### Cara Menggunakan Single Prediction

#### Langkah 1: Buka Menu "Single Prediction"
**[SCREENSHOT 2: Menu Single Prediction aktif]**
📸 *Screenshot: Klik menu "Single Prediction" di sidebar*

#### Langkah 2: Isi Form Input
Masukkan data karyawan sesuai parameter yang tersedia.

**[SCREENSHOT 3: Form input terisi lengkap]**
📸 *Screenshot: Semua field form sudah diisi dengan contoh data*

**Contoh Data untuk Testing:**
```
Is Weekend: No
Work Hours: 10
Screen Time Hours: 9
Meetings Count: 6
Breaks Taken: 2
After Hours Work: 3
Sleep Hours: 5
Task Completion Rate: 0.75
```

#### Langkah 3: Klik Tombol "Predict Risk"
**[SCREENSHOT 4: Klik tombol Predict Risk]**
📸 *Screenshot: Pointer mouse di atas tombol biru "Predict Risk"*

#### Langkah 4: Lihat Hasil Prediksi
Sistem akan menampilkan hasil prediksi dalam bentuk:
- **Risk Level**: Low / Medium / High
- **Confidence Score**: Persentase keyakinan model
- **Visual Indicator**: Bar berwarna dengan panah

**[SCREENSHOT 5: Hasil prediksi Low Risk]**
📸 *Screenshot: Hasil prediksi menampilkan "Low Risk" dengan bar hijau*

**[SCREENSHOT 6: Hasil prediksi Medium Risk]**
📸 *Screenshot: Hasil prediksi menampilkan "Medium Risk" dengan bar kuning*

**[SCREENSHOT 7: Hasil prediksi High Risk]**
📸 *Screenshot: Hasil prediksi menampilkan "High Risk" dengan bar merah*

### Interpretasi Hasil
- **Low Risk (🟢)**: Karyawan dalam kondisi baik, risiko burnout rendah
- **Medium Risk (🟡)**: Perlu perhatian, ada indikasi awal burnout
- **High Risk (🔴)**: Perlu intervensi segera, risiko burnout tinggi

---

## Fitur 2: Upload CSV Bulk

### Cara Menggunakan Bulk Upload

#### Langkah 1: Buka Menu "Bulk Upload"
**[SCREENSHOT 8: Menu Bulk Upload aktif]**
📸 *Screenshot: Klik menu "Bulk Upload" di sidebar*

#### Langkah 2: Siapkan File CSV
File CSV harus memiliki 8 kolom sesuai parameter input.

**Format CSV yang Benar:**
```csv
is_weekend,work_hours,screen_time_hours,meetings_count,breaks_taken,after_hours_work,sleep_hours,task_completion_rate
0,10,9,6,2,3,5,0.75
1,8,7,4,3,1,7,0.85
0,12,11,8,1,4,4,0.65
```

**[SCREENSHOT 9: File CSV di Excel/Spreadsheet]**
📸 *Screenshot: Contoh file CSV dibuka di Excel atau Google Sheets*

> **Download Template CSV:**  
> Klik tombol "Download CSV Template" di aplikasi untuk mendapatkan template kosong.

#### Langkah 3: Upload File CSV
Ada 2 cara upload:

**Cara A: Drag & Drop**
**[SCREENSHOT 10: Drag & Drop file CSV]**
📸 *Screenshot: Proses drag file CSV ke area upload*

**Cara B: Klik "Browse Files"**
**[SCREENSHOT 11: Browse file dari komputer]**
📸 *Screenshot: Dialog file picker untuk memilih file CSV*

#### Langkah 4: Preview Data
Setelah upload, sistem akan menampilkan preview data.

**[SCREENSHOT 12: Preview data CSV]**
📸 *Screenshot: Tabel preview menampilkan data yang akan diprediksi*

#### Langkah 5: Klik "Upload and Predict"
**[SCREENSHOT 13: Klik tombol Upload and Predict]**
📸 *Screenshot: Tombol hijau "Upload and Predict"*

#### Langkah 6: Lihat Hasil Bulk Prediction

**Statistics Cards**
**[SCREENSHOT 14: Statistics summary]**
📸 *Screenshot: 4 kartu statistik (Total, Low, Medium, High Risk)*

**Data Table dengan Hasil Prediksi**
**[SCREENSHOT 15: Tabel hasil prediksi lengkap]**
📸 *Screenshot: Tabel menampilkan semua data input + hasil prediksi*

### Fitur Tambahan Bulk Upload

#### Filter by Risk Level
**[SCREENSHOT 16: Filter dropdown risk level]**
📸 *Screenshot: Dropdown filter "All Risk Levels" diklik*

**[SCREENSHOT 17: Hasil filter High Risk]**
📸 *Screenshot: Tabel hanya menampilkan karyawan dengan High Risk*

#### Search Functionality
**[SCREENSHOT 18: Kolom search diisi]**
📸 *Screenshot: Ketik di kolom search untuk mencari data tertentu*

#### Export Results
**[SCREENSHOT 19: Klik Export to CSV]**
📸 *Screenshot: Tombol "Export to CSV" untuk download hasil prediksi*

---

## Fitur 3: Model Metrics

### Cara Melihat Performa Model

#### Langkah 1: Buka Menu "Model Metrics"
**[SCREENSHOT 20: Menu Model Metrics aktif]**
📸 *Screenshot: Klik menu "Model Metrics" di sidebar*

#### Langkah 2: Lihat Training Information
**[SCREENSHOT 21: Informasi training model]**
📸 *Screenshot: Card "Training Information" dengan detail algorithm, dataset, split*

### Metrik Evaluasi Model

#### Accuracy, Precision, Recall, F1-Score
**[SCREENSHOT 22: Kartu metrik evaluasi]**
📸 *Screenshot: 4 kartu metrik dengan nilai persentase*

**Penjelasan Metrik:**
- **Accuracy (69%)**: Tingkat ketepatan prediksi secara keseluruhan
- **Precision (71.78%)**: Ketepatan prediksi positif
- **Recall (69%)**: Kemampuan model mendeteksi kasus positif
- **F1-Score (68.08%)**: Rata-rata harmonik precision dan recall

#### Confusion Matrix
**[SCREENSHOT 23: Confusion matrix visualization]**
📸 *Screenshot: Heatmap confusion matrix menampilkan prediksi vs actual*

**Cara Membaca Confusion Matrix:**
- **Diagonal**: Prediksi yang benar (True Positives)
- **Off-diagonal**: Prediksi yang salah (False Positives/Negatives)
- **Warna lebih gelap**: Frekuensi lebih tinggi

#### Data Distribution
**[SCREENSHOT 24: Bar chart distribusi data]**
📸 *Screenshot: Chart distribusi kelas Low, Medium, High dalam dataset*

---

## FAQ & Troubleshooting

### ❓ Pertanyaan Umum

**Q1: Apa yang harus dilakukan jika hasil prediksi selalu sama?**
> Pastikan variasi input data cukup berbeda. Model akan memberikan hasil berbeda berdasarkan pola data input.

**Q2: Format CSV tidak diterima, bagaimana solusinya?**
> Pastikan:
> - File memiliki header (nama kolom) di baris pertama
> - Ada 8 kolom sesuai urutan parameter
> - Tidak ada kolom kosong
> - Gunakan delimiter koma (,)
> - Download template CSV dari aplikasi

**Q3: Apakah sistem bisa digunakan offline?**
> Tidak, sistem memerlukan koneksi internet karena di-hosting di Vercel.

**Q4: Berapa maksimal data yang bisa di-upload sekaligus?**
> Disarankan maksimal 1000 baris per upload untuk performa optimal.

**Q5: Apakah data yang di-upload tersimpan di server?**
> Tidak, semua prediksi dilakukan secara real-time dan tidak menyimpan data ke database.

### 🔧 Troubleshooting

#### Error: "Failed to load model"
**Penyebab:** Model ONNX tidak ter-load dengan benar  
**Solusi:** Refresh halaman (F5) atau clear browser cache

#### Error: "Invalid CSV format"
**Penyebab:** Format CSV tidak sesuai  
**Solusi:** Download template CSV dan ikuti format yang benar

#### Prediksi terlalu lama
**Penyebab:** File CSV terlalu besar  
**Solusi:** Pecah file menjadi beberapa batch (maks 500-1000 baris)

#### Tampilan berantakan di mobile
**Penyebab:** Sistem dioptimalkan untuk desktop  
**Solusi:** Gunakan browser desktop untuk pengalaman terbaik

---

## 📞 Kontak & Dukungan

Jika ada pertanyaan atau menemukan bug, silakan hubungi:
- **Email**: [your-email@example.com]
- **GitHub**: https://github.com/LatifBurhan/burnout-classifier
- **Repository Issues**: https://github.com/LatifBurhan/burnout-classifier/issues

---

## 📄 Lisensi
MIT License - Free to use for educational and research purposes

---

**Versi Panduan**: 1.0  
**Tanggal**: November 2026  
**Dibuat untuk**: Presentasi Tugas Akhir Data Mining
