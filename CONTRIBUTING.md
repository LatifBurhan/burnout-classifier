# Contributing Guide

## 🤝 Cara Berkontribusi

Terima kasih atas minat Anda untuk berkontribusi pada proyek Burnout Risk Classifier!

## 📋 Code of Conduct

- Bersikap sopan dan profesional
- Hormati pendapat orang lain
- Fokus pada improvement yang konstruktif

## 🔧 Development Setup

1. Fork repository
2. Clone fork Anda:
   ```bash
   git clone https://github.com/your-username/burnout-classifier.git
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Buat branch baru:
   ```bash
   git checkout -b feature/nama-fitur
   ```

## 📝 Coding Standards

### TypeScript
- Gunakan TypeScript strict mode
- Definisikan types untuk semua parameter dan return values
- Hindari `any` type

### React Components
- Gunakan functional components dengan hooks
- Implement proper error boundaries
- Keep components small and focused

### Styling
- Gunakan Tailwind CSS utility classes
- Follow responsive design principles
- Maintain consistent spacing

### File Naming
- Components: PascalCase (e.g., `SinglePredictionForm.tsx`)
- Utilities: camelCase (e.g., `utils.ts`)
- API Routes: lowercase (e.g., `route.ts`)

## 🧪 Testing

Sebelum submit PR, pastikan:
- [ ] Code berjalan tanpa error
- [ ] Build berhasil (`npm run build`)
- [ ] Lint tidak ada warning (`npm run lint`)
- [ ] UI responsive di mobile dan desktop
- [ ] API endpoints bekerja dengan baik

## 📤 Pull Request Process

1. Update dokumentasi jika diperlukan
2. Test perubahan Anda
3. Commit dengan pesan yang jelas:
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug in prediction"
   git commit -m "docs: update README"
   ```
4. Push ke fork Anda:
   ```bash
   git push origin feature/nama-fitur
   ```
5. Buat Pull Request dengan deskripsi yang jelas

## 🎯 Areas for Contribution

### High Priority
- [ ] Unit tests untuk model inference
- [ ] Integration tests untuk API
- [ ] Performance optimization
- [ ] Accessibility improvements

### Medium Priority
- [ ] Additional UI themes
- [ ] Export to Excel format
- [ ] Advanced filtering options
- [ ] Data visualization charts

### Low Priority
- [ ] Internationalization (i18n)
- [ ] Dark mode toggle
- [ ] User authentication
- [ ] Historical data tracking

## 💡 Feature Requests

Punya ide fitur baru? Buat issue dengan:
- Deskripsi detail fitur
- Use case / scenario
- Mockup UI (jika applicable)
- Technical considerations

## 🐛 Bug Reports

Menemukan bug? Laporkan dengan:
- Deskripsi bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (jika applicable)
- Environment (browser, OS, etc.)

## 📚 Documentation

Documentation improvements welcome:
- Fix typos
- Add examples
- Improve clarity
- Add diagrams
- Translate to other languages

## 🎨 UI/UX Improvements

- Propose design improvements
- Enhance user experience
- Improve accessibility
- Add animations
- Optimize for mobile

## ⚡ Performance Improvements

- Optimize model loading
- Reduce bundle size
- Improve API response time
- Implement caching strategies

## 🔒 Security

Jangan post security issues di public. Email langsung ke maintainer.

## 📞 Questions?

- Open a discussion
- Check existing issues
- Read documentation

## 🎉 Thank You!

Setiap kontribusi, sekecil apapun, sangat dihargai!
