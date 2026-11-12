# Deployment Guide

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

#### Prerequisites:
- Akun Vercel (gratis)
- Vercel CLI terinstall: `npm i -g vercel`

#### Steps:

1. **Login ke Vercel**:
```bash
vercel login
```

2. **Deploy**:
```bash
cd burnout-classifier
vercel
```

3. **Follow prompts**:
   - Setup and deploy? → Yes
   - Which scope? → Your account
   - Link to existing project? → No
   - Project name → burnout-classifier
   - Directory → ./
   - Override settings? → No

4. **PENTING**: Upload model ONNX
   - Pastikan `burnout_model.onnx` ada di folder `public/`
   - File akan otomatis ter-deploy

5. **Production deployment**:
```bash
vercel --prod
```

#### Vercel Configuration:

Buat file `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ]
}
```

---

### Option 2: Docker

#### Create Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Pastikan model ada
COPY public/burnout_model.onnx ./public/

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Create .dockerignore:

```
node_modules
.next
.git
.env*.local
```

#### Build and Run:

```bash
# Build image
docker build -t burnout-classifier .

# Run container
docker run -p 3000:3000 burnout-classifier
```

---

### Option 3: Traditional Server (VPS/EC2)

#### 1. Setup Server:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2
```

#### 2. Deploy Application:

```bash
# Clone/Upload project
cd /var/www
git clone <your-repo> burnout-classifier
cd burnout-classifier

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "burnout-classifier" -- start

# Save PM2 config
pm2 save
pm2 startup
```

#### 3. Setup Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/burnout /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Option 4: Heroku

#### 1. Create Procfile:

```
web: npm start
```

#### 2. Deploy:

```bash
# Login
heroku login

# Create app
heroku create burnout-classifier

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Deploy
git push heroku main

# Open
heroku open
```

---

## 🔒 Environment Variables

Untuk production, set environment variables:

```bash
# Vercel
vercel env add NODE_ENV production

# Docker
docker run -p 3000:3000 -e NODE_ENV=production burnout-classifier

# Heroku
heroku config:set NODE_ENV=production
```

---

## 📊 Performance Optimization

### 1. Enable Compression:

Install compression:
```bash
npm install compression
```

### 2. Cache Model:

Model sudah di-cache otomatis di `lib/model.ts`

### 3. Production Build:

```bash
npm run build
```

Optimizations yang sudah termasuk:
- Code minification
- Tree shaking
- Image optimization
- CSS purging (Tailwind)

---

## 🔍 Monitoring

### Setup Monitoring (Optional):

1. **Vercel Analytics**: Built-in di Vercel
2. **Google Analytics**: 
   ```bash
   npm install @next/third-parties
   ```

3. **Sentry Error Tracking**:
   ```bash
   npm install @sentry/nextjs
   ```

---

## 🚨 Important Notes

### Model File:
- **CRITICAL**: Pastikan `burnout_model.onnx` ter-upload
- File size besar? Compress atau gunakan CDN
- Alternatif: Load dari external storage (S3, etc)

### Server Resources:
- **RAM**: Minimum 512MB (recommended 1GB+)
- **CPU**: Model inference memerlukan CPU yang cukup
- **Storage**: ~500MB untuk dependencies + model

### SSL Certificate:
- Vercel: Otomatis
- Traditional server: Gunakan Let's Encrypt
  ```bash
  sudo apt install certbot python3-certbot-nginx
  sudo certbot --nginx -d your-domain.com
  ```

---

## ✅ Deployment Checklist

- [ ] Dependencies ter-install
- [ ] Model ONNX tersedia di folder yang benar
- [ ] Build berhasil tanpa error
- [ ] Environment variables di-set
- [ ] Test API endpoints
- [ ] Test UI di production
- [ ] SSL certificate aktif (jika applicable)
- [ ] Monitoring setup
- [ ] Backup strategy

---

## 🔄 Update/Rollback

### Vercel:
```bash
# Deploy update
vercel --prod

# Rollback
vercel rollback
```

### PM2:
```bash
# Update
git pull
npm install
npm run build
pm2 restart burnout-classifier

# Rollback
git reset --hard HEAD~1
npm install
npm run build
pm2 restart burnout-classifier
```

### Docker:
```bash
# Update
docker build -t burnout-classifier:latest .
docker stop burnout-classifier
docker rm burnout-classifier
docker run -d -p 3000:3000 --name burnout-classifier burnout-classifier:latest

# Rollback to previous version
docker run -d -p 3000:3000 --name burnout-classifier burnout-classifier:v1.0
```

---

## 📞 Troubleshooting

### Issue: Model not loading
**Fix**: Verify model path and permissions

### Issue: Out of memory
**Fix**: Increase server RAM or optimize model

### Issue: Slow predictions
**Fix**: 
- Use faster CPU
- Implement caching
- Consider batch processing

---

## 🎯 Post-Deployment

1. Test all endpoints
2. Monitor error logs
3. Check performance metrics
4. Setup backups
5. Document access credentials
6. Share URL with team

---

## 🔗 Useful Commands

```bash
# Check logs (PM2)
pm2 logs burnout-classifier

# Check logs (Docker)
docker logs burnout-classifier

# Check logs (Vercel)
vercel logs

# Restart app (PM2)
pm2 restart burnout-classifier

# Stop app (PM2)
pm2 stop burnout-classifier
```
