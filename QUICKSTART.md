# ⚡ Quick Start Guide

Mulai dalam 5 menit!

## 🚀 Steps

### 1. Install Dependencies
```bash
cd burnout-classifier
npm install
```

### 2. Add Model File
Letakkan file `burnout_model.onnx` di folder `public/`:
```
burnout-classifier/
└── public/
    └── burnout_model.onnx  ← Taruh di sini!
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open Browser
Buka: [http://localhost:3000](http://localhost:3000)

## ✅ That's It!

Sekarang Anda bisa:
- ✨ Isi form untuk prediksi single employee
- 📊 Upload CSV untuk prediksi massal
- 💾 Export hasil ke CSV

## 🆘 Troubleshooting

### Model tidak ditemukan?
```bash
# Pastikan file ada
ls public/burnout_model.onnx
```

### Port 3000 sudah dipakai?
```bash
# Gunakan port lain
PORT=3001 npm run dev
```

### Dependencies error?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📚 Need More Help?

- 📖 [README.md](./README.md) - Overview lengkap
- 🔧 [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup
- 🌐 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference

## 🎯 Next Steps

1. ✅ Test single prediction
2. ✅ Download CSV template
3. ✅ Test bulk upload
4. ✅ Export results
5. 🚀 Deploy to production

Happy coding! 🎉
