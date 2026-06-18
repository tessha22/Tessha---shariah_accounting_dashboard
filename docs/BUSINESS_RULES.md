# Business Rules Specification: HIFZA

Dokumen ini berisi aturan baku yang mengatur logika aplikasi, alur kerja, dan batasan operasional untuk menjaga kepatuhan syariah dan efisiensi bisnis.

---

## 1. Role & Hak Akses (RBAC)
Pembagian tanggung jawab di dalam sistem ditentukan sebagai berikut:

| Role | Hak Akses Utama | Batasan |
| :--- | :--- | :--- |
| **Owner** | Full Access, kelola User, verifikasi akhir. | Tidak ada. |
| **Admin** | Input transaksi, kelola stok, laporan keuangan. | Tidak bisa melakukan verifikasi audit sendiri. |
| **Auditor** | View-only laporan, cek log aktivitas, verifikasi data. | Tidak bisa mengubah/menghapus data transaksi. |

---

## 2. Approval Workflow & Alur Program
Setiap data harus melewati alur berikut agar dianggap sah secara akuntansi:

1. **Input**: Admin memasukkan data penjualan/donasi.
2. **Validasi**: Sistem otomatis memvalidasi stok (Gudang) dan menghitung laba bersih.
3. **Drafting**: Data dari OCR (foto nota) masuk sebagai `Draft` dan butuh persetujuan Admin.
4. **Finalisasi**: Laporan harian dikunci dan hanya bisa diubah melalui mekanisme koreksi yang tercatat di Audit Trail.

---

## 3. Alur Verifikasi Masjid (Zakat & Infaq)
Untuk menjamin dana donatur sampai ke tujuan yang benar:
* **Pencatatan**: Setiap dana masuk wajib memiliki identitas donatur yang jelas.
* **Mekanisme Four-Eyes**: Penyaluran dana zakat yang diinput oleh Admin wajib dikonfirmasi (Approved) oleh Auditor atau Owner.
* **Status**: Dana hanya dianggap "Tersalurkan" jika sudah ada bukti fisik yang diunggah ke sistem.

---

## 4. Threshold & Notifikasi (Batas Transaksi)
* **Anomali**: Transaksi manual yang melebihi batas (misal: > Rp10.000.000 dalam satu input) akan memicu notifikasi otomatis ke WhatsApp Owner.
* **Peringatan Stok**: Jika stok produk (Gamis, Hijab, dll) di bawah 5 unit, sistem akan memberikan tanda peringatan di dashboard Admin.

---

## 5. Integritas Data Syariah
* **Zakat Otomatis**: Kewajiban zakat dikunci pada angka 2,5% dari laba bersih.
* **Retensi**: Data keuangan tidak boleh dihapus selama 10 tahun (Data Retention Policy).
* **Anti-Manipulation**: Setiap perubahan angka pada laporan yang sudah tersimpan harus meninggalkan jejak identitas siapa yang mengubah dan kapan.