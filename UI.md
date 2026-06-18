# UI & UX Specification: HIFZA

Dokumen ini mendefinisikan standar visual, desain komponen, dan layout halaman untuk memastikan antarmuka sistem **HIFZA** konsisten, interaktif, dan mudah digunakan.

---

## 1. Visual Identity & Theme
Sistem ini menggunakan tema modern dengan nuansa warna biru yang memberikan kesan tepercaya, bersih, dan profesional.

* **Background Utama**: Gradient Biru (#1e3c72 ke #2a5298) atau Biru Gelap untuk Sidebar.
* **Warna Aksen / Tombol Utama**: Cyan Terang / Turkuis untuk elemen interaktif seperti tombol "Masuk" atau "Pembayaran".
* **Status Indicators**:
    * `Tersalurkan` / `Sukses`: Hijau Terang.
    * `Pending` / `Draft`: Kuning / Oranye.
    * `Error` / `Rendah`: Merah.

---

## 2. Layout & Grid System
Aplikasi ini menggunakan tata letak berbasis web yang fleksibel dengan struktur dua kolom utama setelah pengguna berhasil masuk:
1. **Sidebar (Panel Kiri)**: Berisi logo "Hifza Sharia", nama/role pengguna, dan menu navigasi vertikal.
2. **Main Content (Panel Kanan)**: Area dinamis untuk menampilkan grafik, form kasir, tabel inventaris, atau riwayat zakat.

---

## 3. Komponen Form UI Utama

### A. Halaman Login (User/Login)
* **Card Center Layout**: Form berada di tengah layar dengan latar belakang blur transparan (*glassmorphism*).
* **Elemen**:
    * Logo Hifza Sharia (Ikon Api/Tetesan Air Biru).
    * Input Text: `ID / Email` (placeholder default: "admin").
    * Input Password: `Password` (placeholder default: "1234").
    * Button: `Masuk` (Warna Cyan, teks tebal hitam/gelap).

### B. Halaman Kasir (Menu Kasir)
* **Grid Produk (Sisi Kiri)**: Menampilkan kartu (*card*) produk berukuran sama dengan foto, nama produk (Gamis, Koko, Hijab), harga, dan tombol `Tambah +`.
* **Tab Kategori**: Tombol filter cepat untuk memilih kategori produk (Gamis, Koko, Hijab).
* **Daftar Belanja (Sisi Kanan)**:
    * Tabel ringkasan item yang dipilih beserta kuantitas (tombol `-` dan `+`) dan harga per item.
    * Tombol `+ Diskon`.
    * Ringkasan Biaya: Subtotal, Diskon, dan Total.
    * Aksi: Tombol `Batal` (Abu-abu/Gelap) dan Tombol `Pembayaran` (Gradient Cyan).

### C. Halaman Gudang (Inventaris Gudang)
* **Top Bar**: Kolom pencarian produk (`Cari produk...`) dan tombol `+ Tambah Produk`.
* **Grid Inventaris**: Kartu produk yang menampilkan gambar produk, nama produk (Gamis, Koko, Hijab, Sarung, Pecis, Kaos Kaki), dan informasi `Stok: [Angka]`.
* **Pagination**: Navigasi halaman di bagian bawah (`< 1 >`).

### D. Halaman Zakat & Infaq
* **KPI Scorecards**: Dua kotak ringkasan di bagian atas yang menampilkan `TOTAL ZAKAT` dan `TOTAL INFAQ` dalam format mata uang Rupiah.
* **Top Bar**: Kolom pencarian, tombol `+ Tambah Zakat`, dan tombol `+ Tambah Infaq`.
* **Tabel Histori**: Tabel transparan dengan kolom: Nama Donatur, Jenis, Jumlah, Tanggal, dan Status.

---

## 4. Spesifikasi Visualisasi Data (Dashboard)
* **KPI Box**: Menampilkan `OMZET HARI INI` (format mata uang, contoh: Rp 1.450.000) dan `KEPATUHAN AI` (format persentase, contoh: 99.8%).
* **Line Chart**: Grafik tren penjualan menggunakan Plotly atau Chart.js dengan sumbu X bertuliskan waktu harian/mingguan (Minggu 1 - Minggu 4) dan sumbu Y menampilkan skala volume/nilai transaksi. Garis tren menggunakan warna Cyan Terang agar kontras dengan latar belakang biru gelap.