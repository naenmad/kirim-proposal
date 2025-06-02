# 🚀 HIMTIKA Proposal Management System

Sistem manajemen pengiriman proposal sponsorship yang dikembangkan khusus untuk **Himpunan Mahasiswa Informatika Universitas Singaperbangsa Karawang (HIMTIKA UNSIKA)**. Platform ini memungkinkan pengelolaan dan pengiriman proposal ke perusahaan mitra dengan efisien dan profesional.

![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 🌟 Live Demo

🔗 **[https://kirim-proposal.vercel.app](https://kirim-proposal.vercel.app)**

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi](#-teknologi-yang-digunakan)
- [Instalasi](#-instalasi)
- [Penggunaan](#-penggunaan)
- [Struktur Project](#-struktur-project)
- [Deploy](#-deploy-ke-vercel)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)
- [Developer](#-developer)

## ✨ Fitur Utama

### 🏢 **Manajemen Perusahaan**
- Database perusahaan target yang terstruktur
- Informasi kontak lengkap (email, WhatsApp)
- Tambah, edit, dan hapus data perusahaan
- Pencarian dan filter data

### 📨 **Multi-Channel Pengiriman**
- **WhatsApp Integration** - Kirim proposal via WhatsApp Business
- **Email Integration** - Pengiriman email profesional
- Pengiriman bulk ke multiple perusahaan

### 📊 **Tracking & Monitoring**
- Status pengiriman real-time
- Histori lengkap aktivitas proposal
- Dashboard analytics dan laporan
- Filter berdasarkan status dan tanggal

### 💾 **Data Management**
- **Export Data** - Backup dalam format JSON
- **Import Data** - Restore dari backup
- **Local Storage** - Data persistence tanpa database
- **Data Validation** - Validasi input yang ketat

### 📱 **User Experience**
- **Responsive Design** - Optimal di semua device
- **Progressive Web App (PWA)** - Install seperti aplikasi native
- **Custom Notifications** - Feedback interaktif
- **Smooth Animations** - Transisi yang halus

## 🛠 Teknologi yang Digunakan

### **Frontend Framework**
- **Next.js 15.1.3** - React framework dengan App Router
- **TypeScript** - Type safety dan better developer experience
- **React Hooks** - State management modern

### **Styling & UI**
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Components** - Reusable UI components
- **Heroicons** - Beautiful SVG icons

### **Data & Storage**
- **Local Storage API** - Browser-based data persistence
- **JSON** - Data format untuk export/import
- **Client-side State Management** - React useState & useEffect

### **Performance & SEO**
- **Next.js Image Optimization** - Automated image optimization
- **Static Site Generation (SSG)** - Fast loading times
- **SEO Optimized** - Meta tags dan Open Graph
- **Web Vitals** - Performance monitoring

## 🚀 Instalasi

### **Prasyarat**
- Node.js 18.0.0 atau lebih baru
- npm, yarn, pnpm, atau bun

### **Clone Repository**
```bash
git clone https://github.com/naenmad/kirim-proposal.git
cd kirim-proposal
```

### **Install Dependencies**
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### **Jalankan Development Server**
```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

### **Build untuk Production**
```bash
npm run build
npm start
```

## 💡 Penggunaan

### **1. Setup Data Pengirim**
- Masuk ke halaman **"Kirim Proposal"**
- Isi **Nama Pengirim** dan **Jabatan**
- Data akan tersimpan otomatis

### **2. Tambah Perusahaan Target**
- Klik tombol **"+ Tambah Perusahaan"**
- Isi informasi lengkap:
  - Nama Perusahaan
  - Email Perusahaan
  - Nomor WhatsApp
- Klik **"Simpan"**

### **3. Kirim Proposal**
- Pilih perusahaan target
- Klik **"Kirim via WhatsApp"** atau **"Kirim via Email"**
- Sistem akan membuka aplikasi terkait dengan template pesan

### **4. Monitor Status**
- Lihat status pengiriman real-time
- Cek histori di halaman **"Histori"**
- Filter berdasarkan status atau tanggal

### **5. Backup & Restore**
- **Export:** Klik "Export Data" untuk backup
- **Import:** Klik "Import Data" untuk restore
- Format file: JSON

## 📁 Struktur Project

```
kirim-proposal/
├── app/                          # Next.js App Router
│   ├── components/               # Reusable components
│   │   ├── Footer.tsx           # Footer component
│   │   ├── Navbar.tsx           # Navigation component
│   │   └── ScrollToTop.tsx      # Scroll to top button
│   ├── histori/                 # History page
│   │   └── page.tsx
│   ├── kirim-proposal/          # Main proposal page
│   │   └── page.tsx
│   ├── tentang/                 # About page
│   │   └── page.tsx
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── public/                      # Static assets
│   └── favico/                  # Favicon files
│       ├── favicon.ico
│       ├── apple-touch-icon.png
│       └── site.webmanifest
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
└── README.md                   # Documentation
```

## 📡 API Documentation

### **Data Structures**

#### **FormData Interface**
```typescript
interface FormData {
    namaPengirim: string;
    jabatanPengirim: string;
}
```

#### **Company Interface**
```typescript
interface Company {
    id: string;
    namaPerusahaan: string;
    emailPerusahaan: string;
    nomorWhatsapp: string;
    dateAdded: string;
    status: {
        whatsapp: {
            sent: boolean;
            dateSent?: string;
        };
        email: {
            sent: boolean;
            dateSent?: string;
        };
    };
}
```

### **Local Storage Keys**
- `himtika-proposal-sender` - Data pengirim
- `himtika-proposal-companies` - Daftar perusahaan

### **Export/Import Format**
```json
{
    "exportDate": "2025-06-02T10:30:00.000Z",
    "version": "1.0.0",
    "formData": {
        "namaPengirim": "Ahmad Zulkarnaen",
        "jabatanPengirim": "Ketua Divisi"
    },
    "companies": [...]
}
```

## 🌐 Deploy ke Vercel

### **Deploy via GitHub (Recommended)**

1. **Push ke GitHub:**
```bash
git add .
git commit -m "feat: ready for production"
git push origin main
```

2. **Connect ke Vercel:**
- Masuk ke [vercel.com](https://vercel.com)
- Import repository dari GitHub
- Configure settings (otomatis detect Next.js)
- Deploy

### **Deploy via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### **Environment Variables**
Tidak ada environment variables yang diperlukan untuk deployment standar.

## 🤝 Kontribusi

Kontribusi sangat diterima! Berikut cara berkontribusi:

### **Setup Development**

1. **Fork repository**
2. **Clone fork Anda:**
```bash
git clone https://github.com/[username]/kirim-proposal.git
```

3. **Buat branch fitur baru:**
```bash
git checkout -b feature/nama-fitur
```

4. **Commit perubahan:**
```bash
git commit -m "feat: tambah fitur baru"
```

5. **Push ke branch:**
```bash
git push origin feature/nama-fitur
```

6. **Buat Pull Request**

### **Coding Standards**
- Gunakan **TypeScript** untuk type safety
- Follow **ESLint** rules
- Gunakan **Conventional Commits**
- Test semua fitur sebelum PR

### **Report Issues**
Gunakan [GitHub Issues](https://github.com/naenmad/kirim-proposal/issues) untuk:
- 🐛 Bug reports
- 💡 Feature requests
- 📝 Documentation improvements

## 📈 Roadmap

### **v1.1 (Q3 2025)**
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication & authorization
- [ ] Multi-user support
- [ ] Email templates customization

### **v1.2 (Q4 2025)**
- [ ] Advanced analytics dashboard
- [ ] Auto follow-up reminders
- [ ] Document attachment support
- [ ] API endpoints for external integration

### **v2.0 (2026)**
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] Advanced reporting & insights
- [ ] Integration dengan CRM systems

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**. Lihat file [LICENSE](LICENSE) untuk detail lengkap.

```
MIT License

Copyright (c) 2025 Ahmad Zulkarnaen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 👨‍💻 Developer

<div align="center">

### **Ahmad Zulkarnaen**
*Full Stack Developer | HIMTIKA UNSIKA*

[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/6285183058315)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/madnaen)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/naen)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/naenmad)

</div>

---

### 🏫 **HIMTIKA UNSIKA**
**Himpunan Mahasiswa Informatika**  
**Universitas Singaperbangsa Karawang**

📧 **Email:** 2410631170123@student.unsika.ac.id  
📱 **WhatsApp:** 089652540065  
🌐 **Website:** himtika.cs.unsika.ac.id  
📍 **Alamat:** Jl. HS. Ronggo Waluyo, Puseurjaya, Kec. Telukjambe Timur, Kabupaten Karawang, Jawa Barat

---

<div align="center">

### 🌟 **Jika project ini membantu, berikan ⭐ di GitHub!**

**Made with ❤️ for HIMTIKA UNSIKA**

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/naenmad/kirim-proposal)

</div>