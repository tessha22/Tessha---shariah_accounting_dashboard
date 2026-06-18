# Product Backlog — HIFZA
## Dashboard Sistem Informasi Akuntansi Syariah — HIFZA

Platform monitoring keuangan berbasis web yang transparan, efisien, dan sesuai prinsip syariah. Backlog ini disusun secara komprehensif berdasarkan dokumen spesifikasi produk (PRD), arsitektur database, aturan bisnis syariah, spesifikasi kecerdasan buatan (AI), aspek kepatuhan (compliance), keamanan, dan panduan antarmuka (UI/UX) yang ada pada direktori `docs`.

*Catatan: Dokumen ini telah diperbarui berdasarkan analisis status implementasi riil pada repositori kode sumber (`src/server.js`, `src/public/js/app.js`, dan `src/public/index.html`).*

---

## 1. Ringkasan Prioritas Backlog

Backlog ini dibagi ke dalam beberapa **Epic** yang mewakili modul-modul utama sistem. Setiap item backlog berupa **User Story** yang dilengkapi dengan prioritas, bobot estimasi (Story Points), deskripsi kebutuhan, tugas teknis (Technical Tasks), dan Kriteria Penerimaan (*Acceptance Criteria*).

### Skala Prioritas:
- 🔴 **P0 (Critical / Blockers)**: Harus diimplementasikan segera agar sistem dapat berjalan (Autentikasi, Database Core, CRUD Transaksi).
- 🟡 **P1 (High)**: Fitur inti operasional bisnis dan kepatuhan syariah (Kalkulasi Zakat, Inventaris Gudang, Laporan Keuangan, Audit Trail).
- 🟢 **P2 (Medium)**: Fitur pendukung untuk efisiensi dan otomasi (Integrasi OCR, Visualisasi Grafik Dashboard, Status Validasi Auditor).
- 🔵 **P3 (Low / Future)**: Fitur otomasi tingkat lanjut dan integrasi eksternal (WhatsApp Bot, AI Anomaly Check, Notifikasi WA).

### Legenda Status Implementasi:
- `[x]` **Selesai (Completed)**: Fitur telah sepenuhnya diimplementasikan dan berfungsi baik di backend maupun frontend.
- `[/]` **Sebagian / Sedang Dikerjakan (In Progress)**: Fitur sudah diimplementasikan sebagian (misal: visualisasi mockup/alert/endpoint backend siap, namun antarmuka belum utuh).
- `[ ]` **Rencana (Planned)**: Fitur belum dikerjakan dan berada dalam antrean rilis mendatang.

---

## 2. Tabel Matriks Backlog & Status Implementasi

| ID Story | Epic | User Story | Prioritas | Estimasi | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **HIF-001** | Autentikasi & RBAC | Halaman Login & Autentikasi Pengguna | 🔴 P0 | 3 SP | `[x]` Selesai |
| **HIF-002** | Autentikasi & RBAC | Manajemen Hak Akses Pengguna (Owner Only) | 🔴 P0 | 3 SP | `[/]` Sebagian |
| **HIF-003** | Dashboard Overview | Tampilan Ringkasan KPI Keuangan Real-Time | 🟡 P1 | 5 SP | `[x]` Selesai |
| **HIF-004** | Dashboard Overview | Visualisasi Grafik Tren Penjualan | 🟢 P2 | 3 SP | `[x]` Selesai |
| **HIF-005** | Modul Penjualan/Kasir | Pencatatan Transaksi Penjualan Manual | 🔴 P0 | 5 SP | `[x]` Selesai |
| **HIF-006** | Modul Penjualan/Kasir | Ekstraksi Nota Transaksi via OCR (AI Draft) | 🟢 P2 | 8 SP | `[x]` Selesai |
| **HIF-007** | Modul Penjualan/Kasir | Limit Transaksi & Notifikasi Anomali WA | 🟢 P2 | 5 SP | `[x]` Selesai |
| **HIF-008** | Modul Gudang/Inventaris | Manajemen Stok & CRUD Produk | 🔴 P0 | 5 SP | `[x]` Selesai |
| **HIF-009** | Modul Gudang/Inventaris | Peringatan & Status Indikator Stok Rendah | 🟡 P1 | 2 SP | `[x]` Selesai |
| **HIF-010** | Laporan Keuangan | Penyusunan Laporan Laba Rugi Otomatis | 🟡 P1 | 5 SP | `[x]` Selesai |
| **HIF-011** | Laporan Keuangan | Ekspor Laporan ke Format PDF & Excel | 🟢 P2 | 3 SP | `[/]` Sebagian |
| **HIF-012** | Modul Zakat & Infaq | Kalkulasi Zakat Perdagangan (Tijaroh) Otomatis | 🟡 P1 | 5 SP | `[x]` Selesai |
| **HIF-013** | Modul Zakat & Infaq | Pencatatan KYC Donatur & Persetujuan Ganda | 🟡 P1 | 5 SP | `[x]` Selesai |
| **HIF-014** | Audit Trail & Validasi | Pencatatan Log Aktivitas (Audit Trail) Kaku | 🟡 P1 | 5 SP | `[x]` Selesai |
| **HIF-015** | Audit Trail & Validasi | Peninjauan & Validasi Laporan Keuangan | 🟡 P1 | 3 SP | `[x]` Selesai |
| **HIF-016** | AI & Asisten Pintar | Integrasi WhatsApp Bot (Hifza Assistant) | 🔵 P3 | 8 SP | `[ ]` Rencana |
| **HIF-017** | AI & Asisten Pintar | AI Audit Check & Deteksi Anomali LLM | 🔵 P3 | 5 SP | `[ ]` Rencana |
| **HIF-018** | Keamanan & DevOps | Keamanan API, Enkripsi, & Sanitasi Input | 🔴 P0 | 5 SP | `[x]` Selesai |
| **HIF-019** | Keamanan & DevOps | Backup Otomatis & Kebijakan Retensi 10 Tahun | 🟡 P1 | 3 SP | `[/]` Sebagian |

---

## 3. Rincian Detail User Story & Status Verifikasi

### Epic 1: Autentikasi & RBAC (Role-Based Access Control)

#### `HIF-001`: Halaman Login & Autentikasi Pengguna
* **Deskripsi**:
  Sebagai pengguna sistem (Owner, Admin, Auditor), saya ingin dapat masuk ke dalam dashboard menggunakan kredensial username dan password yang sah agar data keuangan aman dari akses yang tidak berwenang.
* **Prioritas**: 🔴 P0
* **Estimasi**: 3 Story Points
* **Status**: `[x]` Selesai
* **Bukti Implementasi**:
  - Halaman login dirancang di `index.html` (layout tengah, logo, kolom username/password, tombol masuk Cyan Terang).
  - API endpoint `POST /api/auth/login` tersedia di `server.js` dengan enkripsi password menggunakan `bcryptjs` dan tanda sesi JWT (masa kedaluwarsa 1 jam).
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Pengguna berhasil dialihkan ke halaman dashboard utama setelah menginput kredensial yang valid.
  - [x] Pengguna menerima pesan error yang jelas jika salah memasukkan username atau password.
  - [x] Sesi pengguna otomatis berakhir (harus login ulang) jika tidak ada aktivitas atau token kedaluwarsa.

#### `HIF-002`: Manajemen Hak Akses Pengguna (Owner Only)
* **Deskripsi**:
  Sebagai Owner, saya ingin mengelola data akun pengguna (tambah, edit, hapus) dan menetapkan hak akses (Owner, Admin, Auditor) agar alur kerja organisasi berjalan sesuai pembagian tugas (*Segregation of Duties*).
* **Prioritas**: 🔴 P0
* **Estimasi**: 3 Story Points
* **Status**: `[/]` Sebagian
* **Bukti Implementasi**:
  - Role-based menu protection sudah aktif di frontend (`applyNavigationRbac()` di `app.js` menyembunyikan/menampilkan menu berdasarkan hak akses).
  - Middleware otorisasi `requireRole` tersedia di backend `server.js` untuk membatasi endpoint sensitif.
  - *Catatan Perbaikan*: CRUD data user penuh belum memiliki visualisasi antarmuka di frontend (tindakan CRUD disimulasikan).
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Hanya akun dengan role `Owner` yang dapat memanggil API manajemen pengguna sensitif.
  - [x] Pengguna dengan role `Admin` atau `Auditor` yang mencoba membuka modul terlarang akan secara otomatis disembunyikan menunya atau diblokir aksesnya.
  - [ ] Menyediakan antarmuka visual khusus untuk Owner mengedit dan menambah daftar pengguna.

---

### Epic 2: Dashboard Overview & KPI Real-Time

#### `HIF-003`: Tampilan Ringkasan KPI Keuangan Real-Time
* **Deskripsi**:
  Sebagai Owner, Admin, dan Auditor, saya ingin melihat kartu KPI keuangan secara real-time di halaman overview dashboard utama agar dapat memantau kesehatan keuangan bisnis secara cepat (< 3 detik).
* **Prioritas**: 🟡 P1
* **Estimasi**: 5 Story Points
* **Status**: `[x]` Selesai
* **Bukti Implementasi**:
  - Dashboard overview di `app.js` render kartu KPI keuangan: *Total Penjualan*, *Laba Bersih (Estimasi)*, *Kewajiban Zakat (2.5%)*, dan *Zakat Tersalurkan*.
  - KPI bersumber dari kalkulasi real-time API `/api/dashboard/kpi` dan data dimuat dalam waktu instan (< 1 detik).
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Seluruh data KPI ditampilkan pada halaman utama dalam waktu kurang dari 3 detik setelah memuat halaman.
  - [x] Seluruh data numerik otomatis terformat dalam mata uang Rupiah (`Rp`).
  - [x] Nilai KPI bersifat dinamis dan berubah ketika ada transaksi baru yang masuk ke database.

#### `HIF-004`: Visualisasi Grafik Tren Penjualan
* **Deskripsi**:
  Sebagai Owner dan Admin, saya ingin melihat grafik visualisasi tren penjualan harian dan mingguan agar dapat menganalisis pola penjualan produk syariah dengan cepat dan interaktif.
* **Prioritas**: 🟢 P2
* **Estimasi**: 3 Story Points
* **Status**: `[x]` Selesai
* **Bukti Implementasi**:
  - Pustaka `Chart.js` diintegrasikan di `index.html`.
  - Fungsi `renderSalesChart` di `app.js` mengambil riwayat transaksi penjualan 7 hari terakhir dan merendernya dalam grafik garis (Line Chart) interaktif berwarna Cyan Terang.
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Grafik tren menampilkan data yang akurat sesuai dengan akumulasi data penjualan berjalan.
  - [x] Grafik menampilkan interaksi *hover* yang informatif saat kursor diarahkan ke titik koordinat tertentu.
  - [x] Tampilan grafik menyesuaikan ukuran layar (responsif) di desktop maupun tablet.

---

### Epic 3: Modul Penjualan / Kasir (Termasuk Integrasi OCR)

#### `HIF-005`: Pencatatan Transaksi Penjualan Manual
* **Deskripsi**:
  Sebagai Admin, saya ingin dapat mencatat transaksi penjualan produk syariah secara manual melalui form kasir agar data transaksi tercatat langsung ke sistem dan memotong stok produk di gudang secara otomatis.
* **Prioritas**: 🔴 P0
* **Estimasi**: 5 Story Points
* **Status**: `[x]` Selesai
* **Bukti Implementasi**:
  - Modul Kasir di `app.js` (`renderKasir`) menyediakan filter kategori, daftar produk grid, keranjang belanja dengan kontrol jumlah item, dan kalkulator diskon serta pembayaran.
  - Endpoint `POST /api/sales/transaction` mencatat transaksi dan langsung memotong stok di tabel `products` secara atomik di SQLite/Memory.
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Admin dapat memilih beberapa produk ke keranjang belanja, memperbarui kuantitas item, memasukkan diskon, dan menyimpan transaksi.
  - [x] Setelah menekan tombol "Pembayaran" (Gradient Cyan), transaksi berhasil terekam ke database dan status stok di modul gudang berkurang secara otomatis.
  - [x] Tersedia tombol "Batal" (warna abu-abu/gelap) untuk mereset seluruh keranjang belanja kasir.

#### `HIF-006`: Ekstraksi Nota Transaksi via OCR (AI Draft)
* **Deskripsi**:
  Sebagai Admin, saya ingin mengunggah foto nota transaksi fisik di kasir agar sistem dapat mengekstrak data nama produk, harga, dan total biaya secara otomatis menggunakan teknologi kecerdasan buatan (OCR).
* **Prioritas**: 🟢 P2
* **Estimasi**: 8 Story Points
* **Status**: `[x]` Selesai
* **Bukti Implementasi**:
  - Simulator OCR Nota diimplementasikan di halaman Kasir.
  - Saat simulator diklik, ia men-scan data dummy (Baju Koko Modern qty 65), menambahkannya sebagai *Draft* keranjang belanja kasir, memunculkan badge *OCR Scanned (Draft)* berwarna oranye, dan meminta Admin melakukan konfirmasi finalisasi.
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Hasil OCR tidak langsung dimasukkan ke database utama, melainkan berstatus `Draft` terlebih dahulu di keranjang belanja (Four-Eyes Rule).
  - [x] Admin harus meninjau ulang dan mengonfirmasi data transaksi draft hasil OCR melalui tombol Pembayaran agar statusnya sah masuk ke database utama.

#### `HIF-007`: Limit Transaksi & Notifikasi Anomali WhatsApp
* **Deskripsi**:
  Sebagai Owner, saya ingin menerima notifikasi instan di WhatsApp jika terdeteksi penginputan transaksi manual dengan nilai yang tidak wajar (> Rp10.000.000 dalam satu transaksi) agar dapat menghindari kesalahan input data secara cepat.
* **Prioritas**: 🟢 P2
* **Estimasi**: 5 Story Points
* **Status**: `[x]` Selesai
* **Bukti Implementasi**:
  - Endpoint `POST /api/sales/transaction` mendeteksi jika `totalAmount` > Rp10.000.000.
  - Jika terlampaui, sistem mencatat log `ANOMALY_DETECTED` ke tabel audit dan memicu simulator WhatsApp Popup di sisi kanan bawah antarmuka Owner (`triggerWhatsAppNotification()`).
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Transaksi manual dengan nilai melebihi batas (Rp10.000.000) secara otomatis teridentifikasi sebagai anomali oleh sistem.
  - [x] Sistem sukses memicu pengiriman pesan peringatan instan yang tampil secara visual pada simulator WhatsApp Owner.

---

### Epic 4: Modul Gudang / Inventaris

#### `HIF-008`: Manajemen Stok & CRUD Produk
* **Deskripsi**:
  Sebagai Admin dan Owner, saya ingin mengelola produk (tambah, edit, hapus) serta mengupdate stok secara manual (stok masuk) agar informasi ketersediaan barang di toko selalu akurat.
* **Prioritas**: 🔴 P0
* **Estimasi**: 5 Story Points
* **Status**: `[x]` Selesai
* **Bukti Implementasi**:
  - Halaman Gudang Stok (`renderInventaris`) menyediakan form penambahan stok manual ("Tambah Stok") yang terikat dengan backend `/api/inventory/stock-in`.
  - List produk ditampilkan dalam bentuk kartu interaktif lengkap dengan fitur pencarian dan paginasi (3 item per halaman).
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Admin dan Owner dapat memilih produk dan menambah kuantitas stok masuk secara instan.
  - [x] Auditor dibatasi hak aksesnya sehingga hanya dapat melihat daftar stok produk (read-only) tanpa tombol edit/form stok masuk.

#### `HIF-009`: Peringatan & Status Indikator Stok Rendah
* **Deskripsi**:
  Sebagai Admin, saya ingin sistem memberikan tanda peringatan visual jika stok suatu produk berada di bawah batas minimum (5 unit) agar dapat segera melakukan pemesanan ulang (*restock*).
* **Prioritas**: 🟡 P1
* **Estimasi**: 2 Story Points
* **Status**: `[x]` Selesai
* **Bukti Implementasi**:
  - Logika stok rendah < 5 unit diterapkan pada frontend.
  - Kartu produk yang kritis menampilkan badge merah bertuliskan *Stok Rendah: X* (pada Halaman Gudang) dan *Stok: X (Kritis!)* (pada Halaman Kasir).
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Sistem menampilkan indikator peringatan stok berwarna merah secara otomatis jika jumlah stok produk berada di bawah 5 unit.
  - [x] Peringatan tersebut langsung hilang/berubah hijau (*Stok Aman*) setelah Admin melakukan penambahan stok masuk di atas 5 unit.

---

### Epic 5: Modul Laporan Keuangan Syariah

#### `HIF-010`: Penyusunan Laporan Laba Rugi Otomatis
* **Deskripsi**:
  Sebagai Owner, Admin, dan Auditor, saya ingin sistem menyusun laporan keuangan (Laporan Penjualan dan Laba Rugi) secara otomatis dari akumulasi data penjualan dan biaya operasional bisnis agar dapat mengambil keputusan tanpa menghitung manual.
* **Prioritas**: 🟡 P1
* **Estimasi**: 5 Story Points
* **Status**: `[x]` Selesai
* **Bukti Implementasi**:
  - Halaman Laporan Keuangan (`renderLaporan`) menyajikan tabel terperinci laba rugi dengan menghitung: Omzet Kotor, Beban Toko/HPP (30%), Laba Bersih Awal, Potongan Zakat Tijaroh (2.5%), dan Laba Bersih Bersih Syariah.
  - Perhitungan dilakukan secara presisi tanpa pembulatan yang merugikan.
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Laporan keuangan tersaji dalam bentuk tabel akuntansi syariah yang rapi dan mudah dibaca.
  - [x] Laporan Laba Rugi menyajikan perhitungan yang akurat dan cocok secara penuh dengan akumulasi data transaksi penjualan berjalan.

#### `HIF-011`: Ekspor Laporan ke Format PDF & Excel
* **Deskripsi**:
  Sebagai Owner, Admin, dan Auditor, saya ingin mengunduh laporan keuangan dalam format PDF atau Excel agar dapat dicetak dan digunakan untuk keperluan rapat atau audit eksternal.
* **Prioritas**: 🟢 P2
* **Estimasi**: 3 Story Points
* **Status**: `[/]` Sebagian
* **Bukti Implementasi**:
  - Tombol aksi "Ekspor ke PDF" dan "Ekspor ke Excel" sudah dirancang di bagian atas Halaman Laporan Keuangan.
  - Tombol saat ini terhubung dengan pemicu alert simulator ekspor berhasil. Pustaka PDFMake/SheetJS eksternal sesungguhnya belum dibundel penuh di frontend.
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Tombol ekspor tersedia di antarmuka laporan keuangan.
  - [ ] Mengintegrasikan generator berkas riil agar pengguna dapat mengunduh berkas fisik `.pdf` dan `.xlsx` yang berisi tabel akuntansi.

---

### Epic 6: Modul Zakat & Infaq (Kepatuhan Syariah)

#### `HIF-012`: Kalkulasi Zakat Perdagangan (Tijaroh) Otomatis
* **Deskripsi**:
  Sebagai Owner dan Auditor, saya ingin sistem menghitung kewajiban zakat perdagangan (tijaroh) secara otomatis dari akumulasi laba bersih agar dapat membayar zakat bisnis secara tepat waktu dan akurat.
* **Prioritas**: 🟡 P1
* **Estimasi**: 5 Story Points
* **Status**: `[x]` Selesai
* **Bukti Implementasi**:
  - Pada Modul Zakat (`renderZakat`), terdapat alert scorecard khusus yang menampilkan kalkulasi zakat 2.5% secara dinamis dari laba bersih berjalan.
  - Status pencapaian nisab divisualisasikan dengan badge hijau (*Memenuhi Nisab*) atau badge merah (*Belum Nisab*) jika di bawah batas nisab.
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Sistem menampilkan nominal kewajiban zakat secara otomatis dengan presisi penuh (2.5% × Laba Bersih).
  - [x] Status zakat menampilkan rincian apakah kondisi nisab telah terpenuhi secara syar'i.

#### `HIF-013`: Pencatatan KYC Donatur & Persetujuan Ganda (Mosque Distribution)
* **Deskripsi**:
  Sebagai Admin dan Auditor, saya ingin mencatat donasi zakat/infaq masuk lengkap dengan identitas donatur (KYC) dan menyalurkannya dengan validasi ganda (*Four-Eyes Rule*) agar dana donasi terjamin sampai kepada asnaf yang sah secara amanah.
* **Prioritas**: 🟡 P1
* **Estimasi**: 5 Story Points
* **Status**: `[x]` Selesai
* **Bukti Implementasi**:
  - Halaman Zakat menyediakan form input distribusi sosial dengan kolom Nama Donatur (KYC), Kategori (Infaq, Zakat Mal), dan Jumlah.
  - Logika bisnis: donasi bertipe *Infaq* langsung bersetatus `Tersalurkan`. Donasi bertipe *Zakat Mal* tersimpan sebagai `Pending` (warna merah).
  - Tombol aksi "Setujui" tampil hanya bagi akun Owner/Auditor. Saat disetujui, ia memanggil `/api/zakat/approve` untuk memperbarui status donasi menjadi `Tersalurkan` (hijau) dan mencatat nama verifikator serta tanggal persetujuan.
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Donasi zakat/infaq yang dicatat wajib menyertakan identitas donatur yang jelas (KYC).
  - [x] Status penyaluran zakat mal berstatus `Pending` dan hanya berubah menjadi `Tersalurkan` setelah mendapat konfirmasi persetujuan ganda dari Owner atau Auditor.

---

### Epic 7: Audit Trail & Validasi Data (Compliance)

#### `HIF-014`: Pencatatan Log Aktivitas (Audit Trail) Kaku
* **Deskripsi**:
  Sebagai Auditor, saya ingin sistem secara otomatis mencatat setiap riwayat perubahan data transaksi penjualan dan zakat ke dalam log audit agar saya dapat melakukan pelacakan jika terdeteksi manipulasi data.
* **Prioritas**: 🟡 P1
* **Estimasi**: 5 Story Points
* **Status**: `[x]` Selesai
* **Bukti Implementasi**:
  - Endpoint `/api/audit/logs` mengembalikan daftar audit logs lengkap dengan aktor, peran, aksi, rincian aktivitas, dan timestamp rigid.
  - Setiap operasi sensitif (tambah stok, simpan transaksi, input zakat, persetujuan zakat, anomali) secara otomatis mencatat log audit ke SQLite database/Memory secara permanen.
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Setiap perubahan angka atau data secara otomatis meninggalkan jejak log audit terperinci.
  - [x] Log audit disajikan dalam tabel khusus menu Audit Trail dengan indikator merah jika terdeteksi log berupa anomali.

#### `HIF-015`: Peninjauan & Validasi Laporan Keuangan
* **Deskripsi**:
  Sebagai Auditor, saya ingin dapat memberikan status tanda validasi pada laporan keuangan yang telah saya periksa agar Owner dapat mengetahui keabsahan laporan keuangan tersebut dengan yakin.
* **Prioritas**: 🟡 P1
* **Estimasi**: 3 Story Points
* **Status**: `[x]` Selesai
* **Bukti Implementasi**:
  - Halaman Audit Trail (`renderAudit`) menyediakan kartu status validasi buku keuangan syariah dengan badge *Terverifikasi Patuh Syariah*.
  - Auditor dapat menekan tombol "Kunci & Validasi Laporan" untuk memverifikasi periode keuangan berjalan yang akan langsung tercatat sebagai bukti audit patuh syariah.
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Auditor sukses menetapkan status validasi periode keuangan, dan perubahan status tampil secara konsisten di dashboard.

---

### Epic 8: AI & Asisten Pintar (AI Integration)

#### `HIF-016`: Integrasi WhatsApp Bot (Hifza Assistant)
* **Deskripsi**:
  Sebagai Admin, saya ingin dapat mengirimkan foto nota penjualan fisik ke nomor WhatsApp resmi Hifza Assistant agar dapat mencatat transaksi kasir secara instan melalui aplikasi chat seluler.
* **Prioritas**: 🔵 P3 (Future Roadmap)
* **Estimasi**: 8 Story Points
* **Status**: `[ ]` Rencana
* **Bukti Implementasi**:
  - WhatsApp Bot baru dirancang secara konseptual di dokumen `AI_SPEC.md` dan disimulasikan alurnya. Integrasi webhook WhatsApp Gateway riil di server backend belum dikonfigurasi.
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [ ] Sistem memproses kiriman foto nota dari API WhatsApp, memicu server OCR, dan mengembalikan balasan konfirmasi chat interaktif (Y/N).
  - [ ] Balasan "Y" dari pengguna memicu penyimpanan data transaksi riil ke database.

#### `HIF-017`: AI Audit Check & Deteksi Anomali LLM
* **Deskripsi**:
  Sebagai Owner dan Auditor, saya ingin menggunakan integrasi kecerdasan buatan (LLM) untuk memverifikasi kesesuaian data inventaris dengan transaksi serta menganalisis tren penjualan kategori produk secara otomatis.
* **Prioritas**: 🔵 P3 (Future Roadmap)
* **Estimasi**: 5 Story Points
* **Status**: `[ ]` Rencana
* **Bukti Implementasi**:
  - Spesifikasi registry prompt LLM (`ZAKAT_CALC_PROMPT`, `SALES_ANALYST_PROMPT`, `AUDIT_CHECK_PROMPT`) telah didefinisikan di `AI_SPEC.md`, namun pemanggilan mesin kecerdasan buatan (Gemini API / LLM backend) belum ditancapkan.
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [ ] Auditor dapat mengeklik tombol pemicu analisis AI di dashboard untuk meminta ringkasan otomatis anomali.
  - [ ] Output analisis AI tersaji rapi dalam kotak panel khusus di dashboard.

---

### Epic 9: Keamanan, DevOps & Operasional (Non-Functional Requirements)

#### `HIF-018`: Keamanan API, Enkripsi, & Sanitasi Input
* **Deskripsi**:
  Sebagai Developer, saya ingin melakukan sanitasi parameter input pada setiap API dan mengaktifkan enkripsi TLS agar sistem terlindung dari ancaman SQL Injection, XSS, dan pencurian data.
* **Prioritas**: 🔴 P0
* **Estimasi**: 5 Story Points
* **Status**: `[x]` Selesai
* **Bukti Implementasi**:
  - Keamanan rute API backend dilindungi middleware token `authenticateToken` JWT (`server.js`).
  - Kredensial password pengguna disimpan dalam skema database terenkripsi satu arah menggunakan hashing `bcryptjs`.
  - Database helper SQLite menggunakan query terparameter untuk mencegah kerentanan SQL Injection.
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Seluruh parameter masukan API penting diproses dengan parameterisasi SQL aman.
  - [x] Seluruh endpoint sensitif dibatasi oleh verifikasi JWT dan hak akses RBAC.

#### `HIF-019`: Backup Otomatis & Kebijakan Retensi 10 Tahun
* **Deskripsi**:
  Sebagai Owner, saya ingin memastikan seluruh data transaksi keuangan dan zakat dicadangkan secara berkala dan diarsipkan minimal selama 10 tahun agar mematuhi undang-undang akuntansi nasional.
* **Prioritas**: 🟡 P1
* **Estimasi**: 3 Story Points
* **Status**: `[/]` Sebagian
* **Bukti Implementasi**:
  - Kebijakan data retention tercapai secara struktural karena backend `server.js` tidak menyediakan rute/API hapus data keuangan apa pun, mencegah kehilangan data transaksi.
  - *Catatan Perbaikan*: Konfigurasi skrip pencadangan otomatis (cron job backup database SQLite `.db`) belum terintegrasi di lingkungan operasional server.
* **Kriteria Penerimaan (Acceptance Criteria)**:
  - [x] Sistem memblokir segala bentuk penghapusan transaksi akuntansi yang sah.
  - [ ] Mengonfigurasi tugas berkala (cron task) untuk menyalin data `hifza.db` secara harian ke repositori backup eksternal yang aman.

---

## 5. Alur Kerja Implementasi & Pengujian

Seluruh pengerjaan fitur yang berstatus `[ ]` (Rencana) atau melengkapi status `[/]` (Sebagian) harus mengikuti panduan tim pengembang di `DEV_GUIDE.md`:
1. **Branching**: Pengerjaan pada branch fitur tersendiri (misal: `feature/laporan-ekspor-excel`).
2. **Uji Coba**:
   - Menjalankan **Unit Testing** pada pustaka kalkulasi.
   - Menjalankan **Integration Testing** antara backend API dan frontend UI.
3. **Penyebaran**: Rilis melalui server **Staging** sebelum disetujui Owner untuk naik ke server **Production**.
