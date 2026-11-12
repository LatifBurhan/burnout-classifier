# 🚀 Deploy ke Vercel - Panduan Lengkap

## ⚠️ Penting: Keterbatasan Vercel

Vercel menggunakan **serverless functions** yang punya keterbatasan:
- ONNX Runtime Node **mungkin tidak full compatible**
- Function timeout: 10 detik (Hobby), 60 detik (Pro)
- Memory limit: 1024MB (Hobby), 3008MB (Pro)

## 🎯 2 Cara Deploy

### **Cara 1: Deploy Langsung (Coba Dulu)**

Kita coba deploy dulu, jika berhasil bagus. Jika gagal, gunakan Cara 2.

#### Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login ke Vercel**
```bash
vercel login
```

3. **Deploy dari Project Folder**
```bash
cd /Users/latif/STUDY/SMT\ 5/data_mining/burnout-classifier
vercel
```

4. **Follow Prompts:**
   - Set up and deploy? → **Yes**
   - Which scope? → Pilih akun Anda
   - Link to existing project? → **No**
   - Project name → **burnout-classifier** (atau nama lain)
   - Directory → **./**
   - Override settings? → **No**

5. **Deploy Production**
```bash
vercel --prod
```

#### Jika Berhasil:
✅ Anda akan dapat URL: `https://burnout-classifier-xxx.vercel.app`

#### Jika Gagal dengan Error ONNX:
❌ Lanjut ke Cara 2

---

### **Cara 2: Ganti ONNX Runtime (Jika Cara 1 Gagal)**

#### 1. Install onnxruntime-web
```bash
npm uninstall onnxruntime-node
npm install onnxruntime-web
```

#### 2. Update Package.json
Sudah tidak perlu karena akan otomatis

#### 3. Update API Routes

Edit `app/api/predict/route.ts`:
```typescript
// Ganti import
// import { predictBurnoutRisk } from "@/lib/model";
import { predictBurnoutRiskWeb as predictBurnoutRisk } from "@/lib/model-web";

// Sisanya tetap sama
```

Edit `app/api/predict-bulk/route.ts`:
```typescript
// Ganti import
// import { predictBatch } from "@/lib/model";
// Implement batch version dengan model-web.ts
```

#### 4. Deploy
```bash
vercel --prod
```

---

## 🔧 Troubleshooting Vercel

### Error: "Module not found: onnxruntime-node"
**Solusi**: Gunakan onnxruntime-web (Cara 2)

### Error: "Function timeout"
**Solusi**: 
- Reduce batch size untuk bulk prediction
- Upgrade ke Vercel Pro (60s timeout)

### Error: "Module parse failed"
**Solusi**: 
- Pastikan next.config.mjs sudah benar
- Clear cache: `rm -rf .next && vercel`

### Model tidak load
**Solusi**:
- Pastikan file ada di `public/burnout_model.onnx`
- Check file size (max 250MB untuk static files)

---

## ✅ Platform Alternatif (Jika Vercel Tidak Cocok)

### **1. Railway** ⭐ Recommended
- Full Node.js support
- ONNX Runtime Node works
- Deploy steps:
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### **2. Render**
- Free tier available
- Full control
- Deploy dari GitHub
- Website: render.com

### **3. DigitalOcean App Platform**
- $5/month
- Full Node.js runtime
- Easy deployment

### **4. Fly.io**
- Docker-based
- Good for ONNX models
```bash
fly launch
fly deploy
```

---

## 📊 Comparison Table

| Platform | ONNX Support | Free Tier | Difficulty |
|----------|--------------|-----------|------------|
| **Vercel** | ⚠️ Limited | ✅ Yes | ⭐ Easy |
| **Railway** | ✅ Full | ✅ Yes ($5 credit) | ⭐⭐ Easy |
| **Render** | ✅ Full | ✅ Yes | ⭐⭐ Medium |
| **Fly.io** | ✅ Full | ✅ Yes | ⭐⭐⭐ Hard |
| **DigitalOcean** | ✅ Full | ❌ No ($5/mo) | ⭐⭐ Medium |

---

## 🎯 Rekomendasi Saya

### **Untuk Demo/Presentasi:**
1. Coba **Vercel** dulu (paling mudah)
2. Jika gagal, pakai **Railway** (tetap mudah, full support)

### **Untuk Production:**
- **Railway** atau **Render** (reliable, affordable)

---

## 🚀 Quick Deploy to Railway (Alternatif Terbaik)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
cd /Users/latif/STUDY/SMT\ 5/data_mining/burnout-classifier
railway init

# 4. Deploy
railway up

# 5. Get URL
railway domain
```

Railway biasanya lebih reliable untuk Node.js apps dengan dependencies berat seperti ONNX.

---

## 📝 Checklist Sebelum Deploy

- [ ] Model file ada di `public/burnout_model.onnx`
- [ ] `model_metrics.json` ada di `public/`
- [ ] Build berhasil local: `npm run build`
- [ ] Test local: `npm start`
- [ ] Git repo clean (jika deploy via Git)
- [ ] Environment variables (jika ada)

---

## 🎉 Setelah Deploy Berhasil

1. Test semua fitur:
   - ✅ Single prediction
   - ✅ Bulk upload
   - ✅ Metrics page
   
2. Share URL dengan dosen/tim

3. Monitor performance di dashboard platform

---

**Pilih platform sesuai kebutuhan Anda!** 

Untuk demo presentasi, saya sarankan **coba Vercel dulu**, jika gagal langsung **Railway**. 🚀
