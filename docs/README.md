# HIFZA — Dashboard Sistem Informasi Akuntansi Syariah

> Platform monitoring keuangan berbasis web yang transparan, efisien, dan sesuai prinsip syariah.

![Version](https://img.shields.io/badge/versi-1.0.0-blue)
![Status](https://img.shields.io/badge/status-Draft-yellow)
![License](https://img.shields.io/badge/lisensi-Private-red)

---

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Local Setup](#local-setup)
- [Hak Akses Pengguna](#hak-akses-pengguna)
- [Changelog](#changelog)
- [Kontributor](#kontributor)

---

## Tentang Proyek

**HIFZA** adalah dashboard sistem informasi akuntansi berbasis web yang dirancang khusus untuk bisnis dengan prinsip syariah. Sistem ini mengintegrasikan pencatatan penjualan, pelaporan keuangan, perhitungan zakat otomatis, manajemen inventaris, dan audit data dalam satu platform terpadu.

### Masalah yang Diselesaikan

Bisnis syariah sering menghadapi tantangan seperti:
- Perhitungan zakat yang dilakukan manual dan rawan kesalahan
- Tidak ada monitoring penjualan & laba secara real-time
- Laporan keuangan yang lambat dan tidak transparan
- Pengambilan keputusan tanpa data yang memadai

HIFZA hadir sebagai solusi digital yang menjawab semua tantangan tersebut.

---

## Fitur Utama

| Modul | Deskripsi |
|-------|-----------|
| 🔐 **Login & Autentikasi** | Role-based access control untuk Owner, Admin, dan Auditor |
| 📊 **Dashboard / Overview** | KPI real-time: total penjualan, laba bersih, kewajiban zakat |
| 🛒 **Kasir / Penjualan** | Form transaksi, grafik tren harian/mingguan, riwayat transaksi |
| 📦 **Gudang / Inventaris** | Manajemen stok dengan pengurangan otomatis & notifikasi stok rendah |
| 📄 **Laporan Keuangan** | Laporan penjualan & laba rugi; ekspor PDF/Excel |
| 🕌 **Zakat & Infaq** | Perhitungan zakat otomatis (2,5% × laba bersih) & riwayat pembayaran |
| 🔍 **Audit** | Audit trail, log aktivitas, dan validasi data (read-only) |

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | HTML / CSS / JavaScript |
| Visualisasi | Chart.js atau Plotly |
| Backend | _(sesuaikan dengan implementasi)_ |
| Database | _(sesuaikan dengan implementasi)_ |
| Export | PDF, Excel |

---

## Struktur Proyek

```
hifza/
├── README.md
├── PRD_Dashboard_Syariah_HIFZA.md   # Dokumen Product Requirements
├── src/
│   ├── auth/                        # Modul login & autentikasi
│   ├── dashboard/                   # Halaman overview & KPI
│   ├── kasir/                       # Modul transaksi penjualan
│   ├── inventaris/                  # Modul gudang & stok
│   ├── laporan/                     # Modul laporan keuangan
│   ├── zakat/                       # Modul zakat & infaq
│   └── audit/                       # Modul audit & validasi
├── public/
│   └── assets/                      # Gambar, ikon, font
└── docs/
    └── blueprint/                   # Dokumen blueprint awal
```

> 💡 Struktur di atas adalah panduan awal. Sesuaikan dengan framework yang digunakan.

---

## Local Setup

Panduan ini untuk menjalankan proyek HIFZA di lingkungan lokal (komputer pribadi / development).

### Prasyarat

Pastikan perangkat kamu sudah memiliki:

- [ ] **Git** — untuk clone repositori ([download](https://git-scm.com/))
- [ ] **Node.js** v18+ — jika menggunakan frontend berbasis JS ([download](https://nodejs.org/))
- [ ] **Python** v3.10+ — jika backend menggunakan Python ([download](https://python.org/))
- [ ] **Database** — MySQL / PostgreSQL / SQLite (sesuaikan)
- [ ] Browser modern: Chrome, Firefox, atau Edge

---

### Langkah 1 — Clone Repositori

```bash
git clone https://github.com/username/hifza-dashboard.git
cd hifza-dashboard
```

---

### Langkah 2 — Konfigurasi Environment

Salin file `.env.example` menjadi `.env`, lalu isi variabel yang diperlukan:

```bash
cp .env.example .env
```

Contoh isi `.env`:

```env
# Aplikasi
APP_NAME=HIFZA
APP_URL=http://localhost:3000
APP_PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hifza_db
DB_USER=your_db_user
DB_PASS=your_db_password

# Autentikasi
JWT_SECRET=ganti_dengan_secret_yang_kuat
SESSION_TIMEOUT=3600

# Zakat
ZAKAT_RATE=0.025
```

> ⚠️ Jangan pernah commit file `.env` ke repositori. Pastikan sudah masuk dalam `.gitignore`.

---

### Langkah 3 — Instalasi Dependensi

**Jika menggunakan Node.js:**

```bash
npm install
```

**Jika menggunakan Python:**

```bash
pip install -r requirements.txt
```

---

### Langkah 4 — Setup Database

Buat database baru sesuai nama di `.env`, lalu jalankan migrasi:

```bash
# Contoh untuk Node.js (sesuaikan dengan ORM yang dipakai)
npm run migrate

# Contoh untuk Python / Django
python manage.py migrate
```

Untuk mengisi data awal (seed):

```bash
# Node.js
npm run seed

# Python
python manage.py loaddata initial_data.json
```

---

### Langkah 5 — Jalankan Aplikasi

```bash
# Node.js
npm run dev

# Python / Flask
flask run

# Python / Django
python manage.py runserver
```

Buka browser dan akses:

```
http://localhost:3000
```

---

### Akun Default (Development)

| Peran | Username | Password |
|-------|----------|----------|
| Owner / Manajer | `owner@hifza.id` | `owner123` |
| Admin | `admin@hifza.id` | `admin123` |
| Auditor | `auditor@hifza.id` | `auditor123` |

> ⚠️ Ganti semua password default sebelum deploy ke production.

---

### Menjalankan di Mode Production

```bash
# Build frontend (jika ada)
npm run build

# Jalankan server production
npm start
# atau
gunicorn app:app --bind 0.0.0.0:8000
```

Pastikan konfigurasi server (Nginx / Apache) sudah disiapkan dan HTTPS aktif.

---

### Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Port sudah dipakai | Ganti `APP_PORT` di `.env` atau matikan proses lain |
| Koneksi database gagal | Periksa kredensial di `.env` dan pastikan database berjalan |
| Modul tidak ditemukan | Jalankan ulang `npm install` atau `pip install -r requirements.txt` |
| Halaman tidak terbuka | Periksa log terminal untuk pesan error |

---

## Hak Akses Pengguna

| Fitur | Owner/Manajer | Admin | Auditor |
|-------|:---:|:---:|:---:|
| Lihat Overview/KPI | ✅ | ✅ | ✅ |
| Input Transaksi Penjualan | ❌ | ✅ | ❌ |
| Lihat Laporan Keuangan | ✅ | ✅ | ✅ |
| Edit Data Laporan | ❌ | ✅ | ❌ |
| Lihat Perhitungan Zakat | ✅ | ✅ | ✅ |
| Verifikasi/Audit Data | ✅ | ❌ | ✅ |
| Manajemen Inventaris | ✅ | ✅ | ❌ |
| Manajemen Pengguna | ✅ | ❌ | ❌ |

---

## Changelog

Semua perubahan signifikan pada proyek ini didokumentasikan di sini.  
Format mengacu pada [Keep a Changelog](https://keepachangelog.com/id/1.0.0/).

---

### [1.0.0] — 2025 _(Draft Awal)_

#### ✨ Ditambahkan
- Inisialisasi proyek HIFZA
- Dokumen PRD versi 1.0 berdasarkan Blueprint Dashboard Syariah
- Definisi 7 modul utama: Autentikasi, Overview, Kasir, Inventaris, Laporan, Zakat & Infaq, Audit
- Rancangan role-based access control (Owner, Admin, Auditor)
- Alur sistem dari input data hingga output dashboard
- Kebutuhan non-fungsional: performa, keamanan, skalabilitas, aksesibilitas
- Kriteria penerimaan (acceptance criteria) per fitur
- Referensi layar (screen reference) untuk 7 halaman utama

#### 🔄 Direncanakan (Upcoming)
- Implementasi frontend dashboard dan modul kasir
- Setup database dan backend API
- Integrasi grafik interaktif (Chart.js / Plotly)
- Fitur ekspor laporan ke PDF dan Excel
- Pengujian (unit test & integration test)
- Deployment ke server staging

---

### [Unreleased] — Roadmap Berikutnya

#### 🔮 Direncanakan
- Integrasi dengan sistem ERP pihak ketiga
- Fitur multi-cabang / multi-tenant
- Aplikasi mobile (PWA atau native)
- Notifikasi push untuk stok rendah dan kewajiban zakat
- Dashboard analitik lanjutan (prediksi tren penjualan)
- Payment gateway untuk pencatatan pembayaran digital

---

## Kontributor

| Nama | Peran |
|------|-------|
| Tessha Hermita | Product Owner / Penyusun PRD |

---

> 📄 Untuk informasi lebih lengkap tentang spesifikasi sistem, lihat [`PRD_Dashboard_Syariah_HIFZA.md`](./PRD_Dashboard_Syariah_HIFZA.md).

---

*HIFZA — Membantu bisnis syariah bertumbuh dengan data yang transparan dan amanah.*
