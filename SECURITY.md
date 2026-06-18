# Security & Operations Guide: HIFZA

Dokumen ini mendefinisikan protokol keamanan, manajemen insiden, dan strategi pemulihan untuk menjaga integritas data keuangan syariah.

---

## 1. Security Standards (Hardening)
Implementasi keamanan teknis untuk memitigasi risiko serangan siber:
* **Autentikasi & RBAC**: Seluruh API sensitif wajib menggunakan autentikasi JWT/Sesi dan pengecekan *Role-Based Access Control* (RBAC).
* **Kriptografi Data**: Kredensial pengguna wajib disimpan menggunakan *password hashing* yang kuat, bukan teks biasa.
* **Input Sanitization**: Developer wajib melakukan sanitasi pada setiap input data untuk mencegah serangan SQL Injection atau XSS.
* **API Security**: Akses ke log audit dan laporan keuangan melalui API wajib diamankan secara ketat menggunakan protokol enkripsi (HTTPS/TLS).

---

## 2. Incident Response Plan
Prosedur yang harus diikuti jika terjadi anomali atau serangan:
1. **Detection**: Pemantauan melalui API `/api/audit/logs` untuk mendeteksi perubahan data yang tidak sah atau anomali transaksi.
2. **Containment**: Matikan akses API yang terdampak secara sementara untuk mencegah kerusakan data lebih lanjut.
3. **Investigation**: Gunakan *Audit Trail* yang bersifat *read-only* (Atomic) untuk melacak identitas operator (`user_id`) dan waktu kejadian.
4. **Recovery**: Pulihkan sistem ke keadaan stabil terakhir setelah kerentanan ditambal.

---

## 3. Backup & Disaster Recovery
Strategi perlindungan data terhadap kehilangan permanen:
* **Retensi Data**: Seluruh data transaksi dan zakat wajib diarsipkan dan disimpan minimal selama 10 tahun.
* **Automated Backup**: DevOps wajib mengonfigurasi pencadangan database secara berkala (harian/mingguan).
* **Database Migration Integrity**: Setiap pembaruan skema pada tabel `users`, `products`, atau `transactions` wajib melalui uji coba di lingkungan *Staging*.

---

## 4. Monitoring & Alerting
Sistem pengawasan untuk menjaga ketersediaan layanan:
* **Audit Monitoring**: Pantau log aktivitas secara *real-time* melalui dashboard audit untuk mendeteksi anomali pasca-update.
* **AI Anomaly Detection**: Gunakan prompt `AUDIT_CHECK_PROMPT` untuk memverifikasi kesesuaian antara stok inventaris dengan riwayat transaksi.
* **WhatsApp Notification**: Integrasikan bot WhatsApp untuk mengirimkan notifikasi instan jika terdeteksi transaksi manual di luar batas kewajaran.

---

## 5. Operations Runbook
Panduan teknis langkah demi langkah untuk DevOps:
* **Deployment**: Ikuti alur *Staging* -> *Database Migration* -> *Production Approval*.
* **Verification**: Pastikan tidak ada pembulatan angka yang merugikan salah satu pihak sesuai prinsip Syariah.
* **User Management**: Hanya Owner yang diizinkan mengelola penambahan atau penghapusan akses pada tabel `users`.