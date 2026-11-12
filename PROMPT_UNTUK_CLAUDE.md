# 📝 PROMPT UNTUK CLAUDE - Generate Panduan Penggunaan

Salin prompt di bawah ini dan paste ke Claude, lalu upload semua screenshot yang sudah kamu ambil.

---

## PROMPT:

```
Saya memiliki sistem WFH Employee Burnout Risk Classifier yang sudah selesai dibuat. Saya ingin kamu buatkan panduan penggunaan yang lengkap dan profesional dalam format dokumen PDF/Word atau Markdown yang rapi.

**INFORMASI SISTEM:**

1. **Nama Aplikasi**: WFH Employee Burnout Risk Classifier
2. **URL Aplikasi**: [ISI URL VERCEL KAMU DI SINI]
3. **Teknologi**: Next.js 14, TypeScript, Tailwind CSS, ONNX Runtime
4. **Algoritma ML**: Gaussian Naive Bayes
5. **Akurasi Model**: 69%
6. **Data Split**: 80% Training / 20% Testing

**FITUR APLIKASI:**

1. **Single Prediction**
   - Input manual 8 parameter karyawan
   - Hasil prediksi: Low/Medium/High Risk
   - Confidence score dalam persentase
   - Visual indicator dengan bar berwarna

2. **Bulk Upload CSV**
   - Upload file CSV dengan banyak data sekaligus
   - Statistics summary (total, low, medium, high)
   - Data table dengan filter & search
   - Export hasil ke CSV

3. **Model Metrics**
   - Accuracy, Precision, Recall, F1-Score
   - Confusion Matrix visualization
   - Data distribution chart
   - Training information

**8 PARAMETER INPUT:**

1. is_weekend: 0 (Tidak) / 1 (Ya)
2. work_hours: 1-16 jam
3. screen_time_hours: 1-16 jam
4. meetings_count: 0-15 meeting
5. breaks_taken: 0-10 kali
6. after_hours_work: 0-8 jam
7. sleep_hours: 3-10 jam
8. task_completion_rate: 0.0-1.0 (0%-100%)

**YANG PERLU KAMU LAKUKAN:**

1. Buatkan struktur panduan yang profesional dan mudah dipahami
2. Setiap fitur dijelaskan step-by-step dengan jelas
3. Sisipkan screenshot yang saya upload di tempat yang sesuai
4. Tambahkan penjelasan interpretasi hasil prediksi
5. Sertakan FAQ dan troubleshooting umum
6. Format yang rapi dan menarik (gunakan emoji, table, box, dll)

**SCREENSHOT YANG SAYA UPLOAD:**

Saya akan upload 24 screenshot yang mencakup:
- Halaman utama aplikasi
- Form single prediction (kosong & terisi)
- Hasil prediksi (Low, Medium, High Risk)
- Halaman bulk upload
- Contoh file CSV
- Proses drag & drop
- Preview data CSV
- Hasil bulk prediction dengan table
- Filter & search functionality
- Export CSV button
- Halaman model metrics
- Training information
- Kartu metrik (Accuracy, Precision, Recall, F1)
- Confusion matrix
- Data distribution chart

**OUTPUT YANG DIHARAPKAN:**

Buatkan panduan penggunaan dalam format:
- Markdown (.md) yang bisa langsung di-render di GitHub
- ATAU Word document (.docx) yang bisa diedit
- ATAU PDF yang siap print

Gunakan bahasa Indonesia yang profesional tapi tetap mudah dipahami. Target pembaca adalah dosen pembimbing dan audiens presentasi tugas akhir.

Terima kasih!
```

---

## CARA MENGGUNAKAN PROMPT INI:

### Langkah 1: Ambil Screenshot
Buka aplikasi kamu di Vercel dan ambil screenshot untuk:

**Halaman Utama & Navigation:**
- [ ] Screenshot 1: Landing page full screen
- [ ] Screenshot 2: Sidebar menu

**Single Prediction:**
- [ ] Screenshot 3: Form kosong
- [ ] Screenshot 4: Form terisi lengkap
- [ ] Screenshot 5: Klik tombol "Predict Risk"
- [ ] Screenshot 6: Hasil Low Risk (bar hijau)
- [ ] Screenshot 7: Hasil Medium Risk (bar kuning)
- [ ] Screenshot 8: Hasil High Risk (bar merah)

**Bulk Upload:**
- [ ] Screenshot 9: Halaman Bulk Upload
- [ ] Screenshot 10: File CSV di Excel/Sheets
- [ ] Screenshot 11: Drag & drop area
- [ ] Screenshot 12: Preview data CSV
- [ ] Screenshot 13: Klik "Upload and Predict"
- [ ] Screenshot 14: Statistics cards (Total, Low, Medium, High)
- [ ] Screenshot 15: Tabel hasil prediksi
- [ ] Screenshot 16: Filter dropdown
- [ ] Screenshot 17: Hasil filter High Risk saja
- [ ] Screenshot 18: Search box digunakan
- [ ] Screenshot 19: Tombol Export to CSV

**Model Metrics:**
- [ ] Screenshot 20: Halaman Model Metrics
- [ ] Screenshot 21: Training Information card
- [ ] Screenshot 22: 4 kartu metrik (Accuracy, Precision, Recall, F1)
- [ ] Screenshot 23: Confusion Matrix heatmap
- [ ] Screenshot 24: Data Distribution bar chart

### Langkah 2: Buka Claude.ai
1. Buka https://claude.ai
2. Buat conversation baru

### Langkah 3: Copy Prompt
1. Copy seluruh prompt di atas (dari "Saya memiliki sistem..." sampai "Terima kasih!")
2. **JANGAN LUPA GANTI**: `[ISI URL VERCEL KAMU DI SINI]` dengan URL production Vercel kamu

### Langkah 4: Upload Screenshot
1. Klik icon attachment (📎) di Claude
2. Upload SEMUA 24 screenshot sekaligus
3. Atau upload satu per satu dengan nama yang jelas (misal: "01-landing-page.png")

### Langkah 5: Send & Wait
1. Paste prompt yang sudah diedit
2. Klik Send
3. Claude akan generate panduan lengkap dengan screenshot ter-embed

### Langkah 6: Review & Edit
1. Review hasil yang di-generate Claude
2. Minta revisi jika ada yang kurang sesuai
3. Download file final (Markdown/Word/PDF)

---

## TIPS TAMBAHAN:

### Untuk Screenshot Berkualitas:
- Gunakan resolusi 1920x1080 atau lebih tinggi
- Full screen browser (F11) untuk hasil lebih bersih
- Hide bookmark bar dan extension icons
- Gunakan Incognito mode untuk tampilan bersih

### Untuk CSV Example:
- Buat file CSV dengan 5-10 baris data berbeda
- Pastikan ada variasi Low, Medium, High Risk
- Buka di Excel/Google Sheets untuk screenshot yang bagus

### Untuk Naming Screenshot:
Gunakan nama file yang deskriptif:
```
01-landing-page.png
02-sidebar-menu.png
03-single-prediction-form-empty.png
04-single-prediction-form-filled.png
05-predict-button.png
06-result-low-risk.png
07-result-medium-risk.png
08-result-high-risk.png
09-bulk-upload-page.png
10-csv-in-excel.png
... dst
```

---

## ALTERNATIF: Jika Tidak Punya Claude Pro

Jika kamu tidak bisa upload banyak screenshot sekaligus di Claude (free tier), gunakan cara ini:

1. **Buat Google Docs** dengan template PANDUAN_PENGGUNAAN.md
2. **Sisipkan screenshot manual** di tempat yang sudah ditandai
3. **Format dengan heading, table, dan styling**
4. **Export ke PDF** untuk presentasi

---

## CONTOH OUTPUT AKHIR:

File panduan final akan terlihat seperti:

```
📘 PANDUAN PENGGUNAAN
WFH Employee Burnout Risk Classifier

[LOGO/BANNER]

====================
DAFTAR ISI
====================
1. Pengenalan Sistem
2. Akses Aplikasi
3. Fitur Single Prediction
   ...

====================
PENGENALAN SISTEM
====================

[Screenshot landing page]

Sistem ini adalah aplikasi web...

====================
FITUR SINGLE PREDICTION
====================

Langkah 1: Buka menu...
[Screenshot menu]

Langkah 2: Isi form...
[Screenshot form terisi]

...
```

---

Good luck! 🚀
