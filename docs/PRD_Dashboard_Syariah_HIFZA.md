# Product Requirements Document (PRD)
## Dashboard Sistem Informasi Akuntansi Syariah — HIFZA

---

**Nama Produk:** HIFZA — Dashboard Sistem Informasi Akuntansi Syariah  
**Dibuat oleh:** Tessha Hermita  
**Versi Dokumen:** 1.0  
**Tanggal:** 2025  
**Status:** Draft

---

## Daftar Isi

1. [Ringkasan Produk](#1-ringkasan-produk)
2. [Latar Belakang & Permasalahan](#2-latar-belakang--permasalahan)
3. [Tujuan Produk](#3-tujuan-produk)
4. [Ruang Lingkup](#4-ruang-lingkup)
5. [Pengguna & Hak Akses](#5-pengguna--hak-akses)
6. [Fitur & Kebutuhan Fungsional](#6-fitur--kebutuhan-fungsional)
7. [Alur Sistem](#7-alur-sistem)
8. [Kebutuhan Non-Fungsional](#8-kebutuhan-non-fungsional)
9. [Desain & Antarmuka](#9-desain--antarmuka)
10. [Sumber Data](#10-sumber-data)
11. [Output Sistem](#11-output-sistem)
12. [Asumsi & Batasan](#12-asumsi--batasan)
13. [Kriteria Penerimaan (Acceptance Criteria)](#13-kriteria-penerimaan-acceptance-criteria)
14. [Lampiran & Referensi Layar](#14-lampiran--referensi-layar)

---

## 1. Ringkasan Produk

HIFZA adalah sebuah dashboard berbasis web yang dirancang untuk memantau dan mengelola kinerja keuangan bisnis berbasis prinsip syariah. Sistem ini mencakup pencatatan penjualan, pelaporan keuangan, penghitungan zakat secara otomatis, manajemen inventaris, serta audit dan validasi data.

Dashboard ini memberikan informasi yang **ringkas, real-time, dan mudah dipahami** agar manajemen dapat mengambil keputusan bisnis secara cepat dan tepat berdasarkan data.

---

## 2. Latar Belakang & Permasalahan

Bisnis berbasis syariah memerlukan pendekatan akuntansi yang tidak hanya mencatat pemasukan dan pengeluaran, tetapi juga memenuhi kewajiban syariah seperti perhitungan **zakat** dan pengelolaan **infaq**. Tanpa sistem yang terintegrasi, proses ini sering dilakukan secara manual, yang berpotensi:

- Menimbulkan kesalahan perhitungan zakat.
- Menyulitkan pemantauan penjualan dan laba secara real-time.
- Membuat laporan keuangan tidak transparan dan lambat.
- Menghambat pengambilan keputusan berbasis data.

HIFZA hadir sebagai solusi digital terintegrasi yang menjawab tantangan tersebut.

---

## 3. Tujuan Produk

| No | Tujuan | Indikator Keberhasilan |
|----|--------|------------------------|
| 1 | Menampilkan ringkasan kinerja bisnis secara cepat | KPI utama tersedia di halaman Overview dalam < 3 detik |
| 2 | Memantau penjualan dan pertumbuhannya | Grafik tren penjualan harian/mingguan tersedia & akurat |
| 3 | Menghitung laba bersih secara otomatis | Laba terhitung otomatis dari data penjualan dan biaya |
| 4 | Menghitung kewajiban zakat secara otomatis | Nilai zakat muncul otomatis berdasarkan laba bersih |
| 5 | Mendukung pengambilan keputusan berbasis data | Semua laporan dapat diakses dan diekspor oleh pengguna berwenang |

---

## 4. Ruang Lingkup

### Dalam Lingkup (In-Scope)

- Autentikasi dan manajemen hak akses pengguna (login/logout)
- Dashboard overview dengan KPI utama
- Modul pencatatan transaksi penjualan (kasir)
- Modul laporan keuangan
- Modul perhitungan zakat dan infaq
- Modul inventaris / gudang
- Modul audit dan validasi data
- Visualisasi data interaktif (grafik dan tabel)

### Di Luar Lingkup (Out-of-Scope)

- Integrasi dengan sistem akuntansi pihak ketiga (tahap awal)
- Aplikasi mobile native (iOS/Android)
- Fitur multi-cabang / multi-tenant
- Pembayaran online / payment gateway

---

## 5. Pengguna & Hak Akses

### 5.1 Daftar Pengguna

| No | Peran | Deskripsi | Hak Akses |
|----|-------|-----------|-----------|
| 1 | **Owner / Manajer** | Pemilik bisnis atau manajer operasional | Melihat seluruh dashboard dan semua laporan |
| 2 | **Admin** | Staf pengelola data harian | Input, edit, dan mengelola data transaksi |
| 3 | **Auditor** | Pihak internal/eksternal yang memverifikasi data | Melihat dan memverifikasi laporan; tidak dapat mengubah data |

### 5.2 Matrix Hak Akses

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

## 6. Fitur & Kebutuhan Fungsional

### 6.1 Modul Autentikasi (Login)

**Deskripsi:** Sistem login untuk memastikan hanya pengguna terdaftar yang dapat mengakses dashboard.

**Kebutuhan Fungsional:**
- Pengguna dapat login menggunakan username dan password.
- Sistem membedakan hak akses berdasarkan peran (role-based access control).
- Terdapat fitur logout.
- Sesi pengguna memiliki batas waktu (session timeout) untuk keamanan.

---

### 6.2 Modul Overview / Dashboard Utama

**Deskripsi:** Halaman utama yang menampilkan ringkasan KPI dan kondisi bisnis secara keseluruhan.

**Kebutuhan Fungsional:**
- Menampilkan KPI utama, meliputi:
  - Total Penjualan (harian / bulanan)
  - Laba Bersih
  - Kewajiban Zakat
  - Jumlah Transaksi
- Menampilkan grafik tren penjualan (harian/mingguan).
- Data diperbarui secara real-time atau near-real-time.
- Tersedia filter rentang waktu (hari ini, minggu ini, bulan ini, kustom).

---

### 6.3 Modul Penjualan / Kasir

**Deskripsi:** Modul untuk mencatat dan memantau seluruh transaksi penjualan.

**Kebutuhan Fungsional:**

**Form Transaksi:**
- Input nama produk (contoh: Gamis, Hijab, dll.)
- Input harga satuan dan jumlah.
- Pilih kategori produk.
- Pilih metode pembayaran (tunai, transfer, dll.).
- Tombol simpan / konfirmasi transaksi.

**Visualisasi Penjualan:**
- Grafik tren penjualan harian dan mingguan (menggunakan library seperti Plotly atau Chart.js).
- Tabel riwayat transaksi yang dapat difilter dan dicari.

**Inventaris Otomatis:**
- Stok produk berkurang secara otomatis setiap kali transaksi penjualan dicatat.
- Notifikasi atau peringatan jika stok mendekati batas minimum.

| No | Input | Proses | Output |
|----|-------|--------|--------|
| 1 | Data transaksi penjualan | Sistem merekam dan mengakumulasi | Total penjualan |
| 2 | Jumlah produk terjual | Pengurangan otomatis dari stok | Status stok terkini |

---

### 6.4 Modul Laporan Keuangan

**Deskripsi:** Modul untuk menyusun, menampilkan, dan mengekspor laporan keuangan berbasis syariah.

**Kebutuhan Fungsional:**
- Sistem menghasilkan laporan keuangan secara otomatis dari data penjualan dan biaya operasional.
- Laporan yang tersedia:
  - Laporan Penjualan (harian/bulanan)
  - Laporan Laba Rugi
  - Laporan Arus Kas (opsional fase berikutnya)
- Laporan dapat difilter berdasarkan periode waktu.
- Laporan dapat diekspor ke format PDF atau Excel.

| No | Input | Proses | Output |
|----|-------|--------|--------|
| 1 | Data penjualan & biaya operasional | Kalkulasi otomatis oleh sistem | Laporan keuangan lengkap |

---

### 6.5 Modul Zakat & Infaq

**Deskripsi:** Modul untuk menghitung kewajiban zakat tijaroh (zakat perdagangan) secara otomatis berdasarkan laba bersih.

**Kebutuhan Fungsional:**
- Sistem menghitung zakat secara otomatis dari nilai laba bersih.
- Formula perhitungan zakat: **2.5% × Laba Bersih** (atau sesuai ketentuan nisab yang berlaku).
- Menampilkan rincian:
  - Nilai laba bersih periode berjalan
  - Apakah telah mencapai nisab
  - Nilai zakat yang harus dikeluarkan
- Mencatat riwayat pembayaran zakat dan infaq.
- Laporan zakat dapat dicetak atau diekspor.

| No | Input | Proses | Output |
|----|-------|--------|--------|
| 1 | Laba bersih | Perhitungan 2,5% dari laba bersih | Nilai kewajiban zakat |

---

### 6.6 Modul Gudang / Inventaris

**Deskripsi:** Modul untuk memantau dan mengelola stok produk.

**Kebutuhan Fungsional:**
- Menampilkan daftar produk beserta jumlah stok saat ini.
- Admin dapat menambahkan, mengubah, dan menghapus data produk.
- Stok berkurang otomatis saat transaksi penjualan dilakukan.
- Fitur penambahan stok manual (stok masuk).
- Notifikasi stok menipis.
- Riwayat perubahan stok (log aktivitas).

---

### 6.7 Modul Audit

**Deskripsi:** Modul untuk memantau integritas data dan memvalidasi seluruh transaksi dalam sistem.

**Kebutuhan Fungsional:**
- Auditor dapat melihat seluruh log transaksi dan perubahan data.
- Sistem mencatat siapa yang melakukan perubahan (audit trail).
- Auditor dapat memberikan status validasi pada laporan.
- Tidak ada hak untuk mengubah data (read-only + status validasi).

| No | Input | Proses | Output |
|----|-------|--------|--------|
| 1 | Semua data transaksi & laporan | Pemeriksaan dan validasi | Status validasi (Valid / Perlu Tinjauan) |

---

## 7. Alur Sistem

```
[Admin] → Input Data Penjualan
              ↓
    [Sistem] Proses Data Otomatis
              ↓
    [Database] Penyimpanan Data
              ↓
    [Sistem] Perhitungan Laba Bersih
              ↓
    [Sistem] Perhitungan Zakat (2,5% × Laba)
              ↓
    [Dashboard] Output: Grafik, KPI, Laporan, Nilai Zakat
              ↓
    [Owner/Manajer] Baca & Pengambilan Keputusan
              ↓
    [Auditor] Verifikasi & Validasi Data
```

### Detail Tahapan

| No | Tahapan | Deskripsi | Aktor |
|----|---------|-----------|-------|
| 1 | Input Data | Admin memasukkan data penjualan melalui form transaksi | Admin |
| 2 | Proses Data | Sistem mengolah data: akumulasi penjualan, pengurangan stok, kalkulasi biaya | Sistem |
| 3 | Penyimpanan Data | Data tersimpan ke dalam database secara persisten | Sistem |
| 4 | Perhitungan Laba | Sistem menghitung laba bersih (Penjualan − Biaya Operasional) | Sistem |
| 5 | Perhitungan Zakat | Sistem menghitung nilai zakat berdasarkan laba bersih | Sistem |
| 6 | Output Dashboard | Semua data ditampilkan dalam bentuk grafik, KPI, dan laporan | Sistem |

---

## 8. Kebutuhan Non-Fungsional

| No | Kategori | Kebutuhan |
|----|----------|-----------|
| 1 | **Performa** | Halaman dashboard harus dimuat dalam ≤ 3 detik pada koneksi standar |
| 2 | **Keamanan** | Autentikasi wajib; data sensitif dienkripsi; tidak ada akses tanpa login |
| 3 | **Ketersediaan** | Sistem tersedia minimal 99% uptime di hari kerja |
| 4 | **Skalabilitas** | Sistem mampu menangani pertumbuhan data transaksi hingga 1 tahun ke depan tanpa degradasi |
| 5 | **Kemudahan Penggunaan** | Antarmuka intuitif; dapat digunakan tanpa pelatihan teknis khusus |
| 6 | **Kompatibilitas** | Dapat diakses melalui browser modern (Chrome, Firefox, Edge) di desktop maupun tablet |
| 7 | **Aksesibilitas** | Berbasis web, dapat diakses dari berbagai perangkat tanpa instalasi tambahan |

---

## 9. Desain & Antarmuka

### Prinsip Desain

- **Sederhana namun menarik:** Tampilan bersih, tidak membebani pengguna dengan informasi berlebihan.
- **Berbasis web (web-based):** Dapat diakses fleksibel melalui browser tanpa instalasi.
- **Visualisasi interaktif:** Grafik dapat di-hover, diklik, dan difilter oleh pengguna.
- **Responsif:** Tampilan menyesuaikan ukuran layar perangkat.

### Library / Teknologi Visualisasi

- **Plotly** atau **Chart.js** untuk grafik penjualan interaktif.
- Tabel data dengan fitur filter, pencarian, dan paginasi.

### Layar Utama (Referensi)

| No | Nama Layar | Deskripsi Singkat |
|----|------------|-------------------|
| 1 | Login | Halaman autentikasi pengguna |
| 2 | Dashboard / Overview | KPI utama dan grafik ringkasan |
| 3 | Kasir / Transaksi | Form input penjualan dan riwayat transaksi |
| 4 | Inventaris / Gudang | Daftar produk dan manajemen stok |
| 5 | Laporan Keuangan | Laporan penjualan, laba rugi, ekspor |
| 6 | Zakat & Infaq | Perhitungan dan riwayat zakat |
| 7 | Audit | Log data dan status validasi |

---

## 10. Sumber Data

Sistem ini mengambil dan mengolah data dari tiga sumber utama:

| No | Sumber Data | Deskripsi |
|----|-------------|-----------|
| 1 | **Data Transaksi Penjualan** | Setiap transaksi yang dicatat oleh Admin melalui modul kasir |
| 2 | **Data Produk** | Informasi produk (nama, kategori, harga, stok) yang dikelola di modul inventaris |
| 3 | **Data Biaya Operasional** | Biaya-biaya yang dikeluarkan bisnis; digunakan dalam kalkulasi laba bersih |

---

## 11. Output Sistem

Output yang dihasilkan oleh HIFZA mencakup:

| No | Output | Format | Pengguna |
|----|--------|--------|----------|
| 1 | KPI Utama (Penjualan, Laba, Zakat) | Visual (kartu KPI) | Owner, Admin, Auditor |
| 2 | Grafik Tren Penjualan | Grafik interaktif | Owner, Admin |
| 3 | Laporan Keuangan | Tabel + ekspor PDF/Excel | Owner, Admin, Auditor |
| 4 | Nilai Zakat & Riwayat | Kalkulasi + tabel | Owner, Auditor |
| 5 | Status Validasi Audit | Status label (Valid / Perlu Tinjauan) | Auditor, Owner |
| 6 | Log Aktivitas / Audit Trail | Tabel log | Auditor |

---

## 12. Asumsi & Batasan

### Asumsi

- Pengguna memiliki akses internet yang stabil untuk mengakses dashboard berbasis web.
- Data biaya operasional diinput secara manual oleh Admin pada awal implementasi.
- Perhitungan zakat menggunakan rumus standar 2,5% dari laba bersih (nisab dan haul diasumsikan terpenuhi).
- Sistem hanya mendukung satu bisnis / entitas (single-tenant) pada versi awal.

### Batasan

- Tidak ada integrasi dengan sistem ERP atau software akuntansi pihak ketiga di fase pertama.
- Tidak tersedia versi aplikasi mobile native di fase pertama.
- Fitur multi-cabang tidak termasuk dalam lingkup versi awal.

---

## 13. Kriteria Penerimaan (Acceptance Criteria)

| No | Fitur | Kriteria Penerimaan |
|----|-------|---------------------|
| 1 | Login | Pengguna berhasil login dengan kredensial yang benar; ditolak jika salah |
| 2 | Overview KPI | KPI ditampilkan dengan data terbaru dalam ≤ 3 detik setelah login |
| 3 | Input Transaksi | Transaksi tersimpan dan stok berkurang otomatis setelah form disubmit |
| 4 | Grafik Penjualan | Grafik menampilkan data yang sesuai dengan filter waktu yang dipilih |
| 5 | Laporan Keuangan | Laporan dapat diunduh dalam format PDF atau Excel dengan data yang benar |
| 6 | Perhitungan Zakat | Nilai zakat dihitung otomatis dan akurat (2,5% × laba bersih) |
| 7 | Inventaris | Stok produk berkurang otomatis saat transaksi; notifikasi muncul jika stok rendah |
| 8 | Audit | Auditor dapat melihat semua log; tidak dapat mengubah data apapun |
| 9 | Hak Akses | Setiap peran hanya dapat mengakses fitur sesuai hak aksesnya |

---

## 14. Lampiran & Referensi Layar

Berdasarkan blueprint awal, berikut adalah daftar layar yang perlu dirancang dan diimplementasikan:

1. **Login / Autentikasi** — Halaman masuk sistem.
2. **Dashboard / Overview** — Ringkasan KPI dan grafik utama.
3. **Menu Kasir** — Input transaksi penjualan harian.
4. **Gudang / Inventaris** — Manajemen stok produk.
5. **Zakat dan Infaq** — Perhitungan dan pencatatan zakat.
6. **Laporan Keuangan** — Tampilan dan ekspor laporan.
7. **Audit** — Monitoring, log, dan validasi data.

---

*Dokumen ini merupakan versi awal PRD HIFZA yang disusun berdasarkan Blueprint Dashboard Sistem Informasi Akuntansi Syariah. Revisi dapat dilakukan sesuai dengan perkembangan kebutuhan bisnis dan umpan balik dari stakeholder.*
