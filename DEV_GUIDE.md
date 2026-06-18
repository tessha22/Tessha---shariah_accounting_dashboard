# Developer Guide: HIFZA

Dokumen ini berfungsi sebagai panduan teknis bagi seluruh developer yang berkontribusi pada pengembangan Sistem Informasi Akuntansi Syariah **HIFZA**.

---

## 1. Coding Standards
Untuk menjaga keterbacaan dan pemeliharaan kode jangka panjang:
* **Bahasa & Stack**: Gunakan JavaScript/Node.js untuk Backend dan HTML/CSS/JS murni untuk Frontend.
* **Penamaan Variabel**: Gunakan `camelCase` untuk variabel (contoh: `totalZakat`) dan `PascalCase` untuk komponen (contoh: `DashboardMenu`).
* **Prinsip Syariah**: Dalam penulisan logika keuangan, dilarang menggunakan pembulatan yang merugikan salah satu pihak. Pastikan angka desimal untuk Zakat (2.5%) presisi.

---

## 2. Git Workflow
Kami menggunakan metode **Feature Branching** untuk kolaborasi tim:
* **Main Branch**: Hanya berisi kode yang sudah stabil dan siap produksi.
* **Development Branch**: Tempat integrasi fitur-fitur baru sebelum rilis.
* **Feature Branch**: Dibuat dari development dengan format `feature/nama-fitur` (contoh: `feature/kasir-ocr`).

---

## 3. Testing Strategy
Setiap modul harus melewati tahap pengujian:
* **Unit Testing**: Menguji fungsi mandiri, terutama perhitungan laba dan zakat.
* **Integration Testing**: Memastikan API OCR dapat berkomunikasi dengan benar ke modul Kasir.
* **User Acceptance Test (UAT)**: Verifikasi oleh **Auditor** atau **Owner** untuk memastikan tampilan dashboard sudah sesuai.

---

## 4. Deployment Guide
Proses rilis aplikasi dilakukan melalui tahapan berikut:
1. **Staging**: Deploy kode ke server uji coba untuk pengecekan terakhir.
2. **Database Migration**: Jalankan skrip migrasi untuk memperbarui tabel `users`, `products`, atau `transactions`.
3. **Production**: Deploy ke server utama setelah mendapatkan persetujuan dari Owner.
4. **Monitoring**: Pantau log audit segera setelah rilis untuk mendeteksi anomali.

---

## 5. Security Checklist
* Selalu gunakan *password hashing* saat menyimpan user baru.
* Pastikan API sensitif memiliki pengecekan `Role-Based Access Control` (RBAC).
* Lakukan sanitasi data pada setiap input untuk mencegah serangan keamanan (SQL Injection).