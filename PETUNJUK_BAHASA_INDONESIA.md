# 🇮🇩 Petunjuk Penggunaan - Bahasa Indonesia

## 📱 Aplikasi WFH Burnout Risk Classifier

Sistem prediksi tingkat risiko burnout karyawan Work From Home menggunakan Machine Learning.

---

## 🚀 Cara Memulai (5 Menit)

### 1. Install Dependencies
Buka terminal dan jalankan:
```bash
cd burnout-classifier
npm install
```
*Tunggu hingga proses selesai (~2-3 menit)*

### 2. Tambahkan File Model ONNX ⚠️
**PENTING:** Letakkan file model Anda di folder `public/`:
```
burnout-classifier/
└── public/
    └── burnout_model.onnx  ← Taruh file model di sini!
```

### 3. Jalankan Aplikasi
```bash
npm run dev
```

### 4. Buka Browser
Akses: **http://localhost:3000**

**Selesai!** Aplikasi siap digunakan! 🎉

---

## 🎯 Cara Menggunakan Aplikasi

### Mode 1: Prediksi Single Karyawan

1. **Pilih Tab "Single Prediction"** (tab pertama)
2. **Isi Form dengan Data Karyawan:**
   - **Tipe Hari**: Weekday atau Weekend
   - **Jam Kerja**: Geser slider (0-16 jam)
   - **Screen Time**: Geser slider (0-16 jam)
   - **Jumlah Meeting**: Masukkan angka
   - **Jumlah Istirahat**: Masukkan angka
   - **Kerja Lembur**: Centang jika ada lembur
   - **Jam Tidur**: Geser slider (0-12 jam)
   - **Task Completion Rate**: Geser slider (0-100%)

3. **Klik "Prediksi Risiko Burnout"**

4. **Lihat Hasil:**
   - Badge risiko berwarna (Hijau/Kuning/Merah)
   - Confidence score dalam bentuk progress bar
   - Ringkasan data yang diinputkan
   - Rekomendasi tindakan

### Mode 2: Prediksi Massal (CSV)

1. **Pilih Tab "Bulk Upload"**

2. **Download Template CSV:**
   - Klik tombol "Download Template"
   - Buka file CSV dengan Excel atau text editor
   - Isi data karyawan sesuai kolom yang tersedia

3. **Upload File CSV:**
   - Drag & drop file ke area upload, atau
   - Klik area upload untuk browse file
   - Pilih file CSV Anda

4. **Klik "Process File"**
   - Tunggu proses selesai (~10 detik untuk 100 data)

5. **Lihat Hasil:**
   - **Kartu Statistik**: Total, High Risk, Medium Risk, Low Risk
   - **Tabel Data**: Semua karyawan dengan prediksi risiko
   - **Filter**: Cari atau filter berdasarkan tingkat risiko
   - **Export**: Download hasil dalam format CSV

---

## 📊 Penjelasan Parameter Input

| Parameter | Penjelasan | Range |
|-----------|------------|-------|
| **Tipe Hari** | Apakah hari kerja atau weekend | Weekday / Weekend |
| **Jam Kerja** | Total jam kerja dalam sehari | 0-16 jam |
| **Screen Time** | Total waktu di depan layar | 0-16 jam |
| **Jumlah Meeting** | Berapa kali meeting dalam sehari | 0-20 meeting |
| **Jumlah Istirahat** | Berapa kali istirahat/break | 0-10 kali |
| **Kerja Lembur** | Apakah bekerja di luar jam kerja | Ya / Tidak |
| **Jam Tidur** | Total jam tidur per hari | 0-12 jam |
| **Task Completion** | Tingkat penyelesaian tugas | 0-100% |

---

## 🎨 Memahami Hasil Prediksi

### Tingkat Risiko Burnout

#### 🟢 **LOW RISK (Risiko Rendah)**
- **Artinya**: Kondisi kerja sehat, risiko burnout minimal
- **Tindakan**: Pertahankan pola kerja yang baik
- **Rekomendasi**: Tetap jaga keseimbangan work-life balance

#### 🟡 **MEDIUM RISK (Risiko Sedang)**
- **Artinya**: Ada indikasi stres, perlu perhatian
- **Tindakan**: Evaluasi pola kerja dan tingkatkan istirahat
- **Rekomendasi**: 
  - Kurangi screen time
  - Tingkatkan jumlah break
  - Pastikan tidur cukup (7-8 jam)
  - Batasi lembur

#### 🔴 **HIGH RISK (Risiko Tinggi)**
- **Artinya**: Risiko burnout sangat tinggi, butuh intervensi segera!
- **Tindakan**: Perubahan signifikan diperlukan
- **Rekomendasi**:
  - **SEGERA** kurangi jam kerja overtime
  - Tingkatkan frekuensi istirahat
  - Konsultasi dengan HR atau psikolog
  - Evaluasi beban kerja
  - Pastikan tidur minimal 7 jam
  - Ambil cuti jika perlu

### Confidence Score
- **80-100%**: Prediksi sangat yakin
- **60-80%**: Prediksi cukup yakin
- **<60%**: Prediksi kurang yakin (perlu data lebih)

---

## 📝 Format File CSV untuk Upload Massal

### Kolom yang Diperlukan:
```csv
employee_id,is_weekend,work_hours,screen_time_hours,meetings_count,breaks_taken,after_hours_work,sleep_hours,task_completion_rate
```

### Contoh Data:
```csv
employee_id,is_weekend,work_hours,screen_time_hours,meetings_count,breaks_taken,after_hours_work,sleep_hours,task_completion_rate
EMP001,0,8,6,3,2,0,7,0.85
EMP002,1,4,3,1,3,0,8,0.90
EMP003,0,10,9,5,1,1,6,0.75
```

### Penjelasan Kolom:
- **employee_id**: ID karyawan (opsional)
- **is_weekend**: 0=Weekday, 1=Weekend
- **work_hours**: Jam kerja (angka desimal, misal: 8.5)
- **screen_time_hours**: Screen time (angka desimal)
- **meetings_count**: Jumlah meeting (angka bulat)
- **breaks_taken**: Jumlah break (angka bulat)
- **after_hours_work**: 0=Tidak lembur, 1=Lembur
- **sleep_hours**: Jam tidur (angka desimal)
- **task_completion_rate**: Rate 0.0-1.0 (misal: 0.85 = 85%)

**Tips**: Download template dari aplikasi untuk mendapatkan format yang benar!

---

## 🔧 Troubleshooting (Pemecahan Masalah)

### ❌ Error: "Model file not found"
**Masalah**: File model ONNX tidak ditemukan

**Solusi**:
1. Pastikan file `burnout_model.onnx` ada
2. Letakkan di folder `public/` atau `lib/`
3. Restart server: tekan `Ctrl+C` lalu `npm run dev` lagi

### ❌ Error: "Port 3000 sudah digunakan"
**Masalah**: Port 3000 sudah dipakai aplikasi lain

**Solusi**: Gunakan port lain
```bash
PORT=3001 npm run dev
```
Lalu akses: http://localhost:3001

### ❌ Error saat Install Dependencies
**Masalah**: npm install gagal

**Solusi**:
```bash
# Hapus dan install ulang
rm -rf node_modules package-lock.json
npm install
```

### ❌ CSV Upload Gagal
**Masalah**: File CSV tidak bisa diproses

**Solusi**:
1. Gunakan template yang disediakan
2. Pastikan tidak ada baris kosong di akhir file
3. Cek format data sesuai dengan contoh
4. Pastikan file berekstensi `.csv`

### ❌ Hasil Prediksi Tidak Muncul
**Masalah**: Setelah submit, tidak ada hasil

**Solusi**:
1. Buka Console browser (tekan F12)
2. Lihat error message
3. Pastikan semua field terisi
4. Cek koneksi internet (jika diperlukan)
5. Refresh halaman dan coba lagi

---

## 💡 Tips Penggunaan

### Untuk Hasil Prediksi yang Akurat:
1. ✅ Isi semua parameter dengan data yang sebenarnya
2. ✅ Jangan mengisi data acak atau estimasi kasar
3. ✅ Gunakan data dari tracking atau timesheet jika tersedia
4. ✅ Untuk bulk upload, pastikan data konsisten

### Untuk Upload CSV:
1. ✅ Download template terlebih dahulu
2. ✅ Isi data di Excel/Google Sheets
3. ✅ Save as CSV format
4. ✅ Jangan ubah nama kolom
5. ✅ Pastikan tidak ada cell kosong pada data wajib

### Interpretasi Hasil:
1. ✅ Confidence score tinggi = prediksi lebih akurat
2. ✅ Lihat pola: jika banyak High Risk, perlu action tim
3. ✅ Gunakan filter untuk fokus pada karyawan berisiko tinggi
4. ✅ Export hasil untuk dokumentasi dan follow-up

---

## 📱 Kompatibilitas

### Browser yang Didukung:
- ✅ Google Chrome (recommended)
- ✅ Mozilla Firefox
- ✅ Safari (macOS/iOS)
- ✅ Microsoft Edge
- ✅ Brave Browser

### Perangkat:
- ✅ Desktop/Laptop (Windows, macOS, Linux)
- ✅ Tablet (iPad, Android)
- ✅ Smartphone (iOS, Android)

---

## 📞 Bantuan Lebih Lanjut

### Dokumentasi Lengkap:
- **QUICKSTART.md** - Mulai dalam 5 menit
- **SETUP_GUIDE.md** - Panduan detail setup & troubleshooting
- **API_DOCUMENTATION.md** - Dokumentasi API (untuk developer)
- **README.md** - Overview lengkap aplikasi

### Untuk Developer:
- **ARCHITECTURE.md** - Arsitektur sistem
- **PROJECT_STRUCTURE.md** - Struktur proyek
- **MODEL_TRAINING_GUIDE.md** - Cara training model
- **DEPLOYMENT.md** - Cara deploy ke production

---

## 🎯 Workflow Penggunaan Ideal

### Untuk HR/Manager:
1. **Kumpulkan data** karyawan (dari timesheet/attendance)
2. **Buat file CSV** dengan format template
3. **Upload dan proses** di mode Bulk Upload
4. **Analisis statistik** untuk melihat overview tim
5. **Filter High Risk** untuk identifikasi karyawan prioritas
6. **Export hasil** untuk dokumentasi
7. **Follow-up** dengan karyawan berisiko tinggi

### Untuk Self-Assessment:
1. **Buka mode Single Prediction**
2. **Isi data** berdasarkan aktivitas hari ini/minggu ini
3. **Lihat hasil** dan confidence score
4. **Baca rekomendasi** dengan seksama
5. **Ambil tindakan** sesuai tingkat risiko
6. **Tracking rutin** (mingguan/bulanan)

---

## 🏆 Best Practices

### Penggunaan Rutin:
- 📅 Lakukan assessment mingguan untuk monitoring
- 📊 Track perubahan trend dari waktu ke waktu
- 🎯 Set target: turunkan jumlah High Risk employees
- 📈 Gunakan data untuk policy improvement

### Data Privacy:
- 🔒 Jaga kerahasiaan data karyawan
- 🔒 Gunakan untuk wellbeing, bukan punishment
- 🔒 Komunikasikan tujuan assessment dengan transparan
- 🔒 Export data disimpan dengan aman

### Follow-up Action:
- 💬 Diskusi dengan karyawan High Risk secara personal
- 📋 Buat action plan untuk improvement
- 🤝 Berikan support dan resources yang dibutuhkan
- ✅ Monitor progress setelah intervention

---

## 🎉 Selamat Menggunakan!

Aplikasi ini dirancang untuk membantu organisasi menjaga kesehatan mental dan wellbeing karyawan WFH. 

**Ingat:** Burnout prevention lebih baik daripada cure! 💪

**Questions?** Baca dokumentasi atau cek troubleshooting section.

---

**Version**: 1.0.0  
**Bahasa**: Indonesia  
**Last Updated**: 2024

**Sehat Mental, Produktif Optimal! 🌟**
