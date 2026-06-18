# Compliance & Legal Specification: HIFZA

Dokumen ini mendefinisikan standar kepatuhan, kebijakan privasi, dan mekanisme pengawasan untuk memastikan operasional yang amanah dan transparan.

---

## 1. KYC & AML (Anti-Money Laundering)
Untuk mencegah pencucian uang dan memastikan sumber dana donasi yang jelas:
* **Identitas Donatur**: Setiap input pada tabel `zakat_infaq` wajib mencatat nama penyumbang (`donor_name`) sesuai identitas yang valid.
* **Validasi Sumber Dana**: Admin harus memverifikasi bahwa dana yang masuk berasal dari aktivitas yang halal sebelum status diubah menjadi "Tersalurkan".
* **Pelaporan Transaksi Mencurigakan**: Sistem harus menandai transaksi manual yang memiliki nilai di luar batas kewajaran untuk ditinjau oleh Owner.

---

## 2. Audit Trail Specification
Sistem wajib mencatat setiap aktivitas untuk keperluan transparansi syariah dan verifikasi auditor:
* **Log Aktivitas**: Setiap perubahan data pada tabel `transactions` dan `zakat_infaq` harus tercatat dalam API `/api/audit/logs`.
* **Timestamp Rigidity**: Field `created_at` pada transaksi bersifat *read-only* dan tidak dapat diubah setelah data tersimpan (Atomic).
* **Identitas Operator**: Setiap log harus menyertakan `user_id` dari tabel `users` untuk mengetahui siapa yang melakukan input atau perubahan.

---

## 3. Four-Eyes Rules (Persetujuan Ganda)
Mencegah manipulasi data melalui sistem *Role-Based Access Control* (RBAC):
* **Pemisahan Tugas (SoD)**: Admin memiliki akses untuk mengelola data dan menginput transaksi, namun tidak boleh melakukan audit sendiri.
* **Verifikasi Auditor**: Auditor dan Owner memiliki hak khusus untuk melihat dashboard dan memverifikasi laporan tanpa bisa mengubah angka yang sudah sah (Read-Only).
* **Manajemen Pengguna**: Hanya Owner yang memiliki hak untuk menambah atau menghapus akses user pada tabel `users`.

---

## 4. Mosque & Distribution Verification
Khusus untuk modul Zakat dan Infaq:
* **Status Penyaluran**: Dana harus memiliki status yang jelas (`Tersalurkan` atau `Pending`) untuk memastikan amanah donatur telah ditunaikan.
* **Verifikasi Penerima**: Setiap penyaluran zakat wajib divalidasi oleh Auditor melalui menu Audit sebelum dianggap sah secara sistem.

---

## 5. Privacy Policy & Data Retention
* **Kerahasiaan Data**: Data kredensial pada tabel `users` wajib disimpan dalam bentuk *Hash* (terenkripsi) dan tidak boleh dalam bentuk teks biasa.
* **Retensi Data**: Seluruh data transaksi penjualan dan zakat akan disimpan minimal selama 10 tahun sesuai standar akuntansi nasional dan regulasi fiskal.
* **Keamanan API**: Akses ke data sensitif seperti laporan keuangan dan log audit wajib menggunakan autentikasi yang aman.

---

> **Catatan Tim Legal**: Pelanggaran terhadap poin-poin di atas dapat mengakibatkan kegagalan audit kepatuhan syariah dan dapat diproses secara hukum sesuai peraturan perlindungan data pribadi (UU PDP).