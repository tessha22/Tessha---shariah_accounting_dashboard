# AI Technical Specification: HIFZA

Dokumen ini mendefinisikan integrasi kecerdasan buatan (AI) untuk automasi input, verifikasi dokumen, dan antarmuka bot untuk sistem **HIFZA**.

---

## 1. AI Prompt Registry
Daftar prompt standar yang digunakan oleh mesin LLM dalam sistem untuk menjaga konsistensi output.

| Nama Prompt | Tujuan | Logic / Constraint |
| :--- | :--- | :--- |
| `ZAKAT_CALC_PROMPT` | Menghitung zakat dari laba bersih. | Gunakan rate 2.5%, output harus valid JSON. |
| `SALES_ANALYST_PROMPT` | Analisis tren penjualan mingguan. | Fokus pada kategori (Gamis, Hijab, Koko). |
| `AUDIT_CHECK_PROMPT` | Mencari anomali pada log transaksi. | Cross-check dengan `inventory_stock` dan `created_at`. |

---

## 2. OCR Integration (Nota Keuangan)
Sistem menggunakan OCR untuk mengonversi foto nota fisik menjadi data digital di modul Kasir.

* **Engine**: Tesseract OCR atau Google Vision API.
* **Data Extraction**:
    * `Merchant_Name` -> Validasi identitas toko.
    * `Items` -> Map ke `product_id` di tabel `products`.
    * `Total_Amount` -> Map ke `amount` di tabel `transactions`.
* **Validation**: Data hasil OCR berstatus `Draft` dan wajib di-review oleh Admin sebelum masuk ke database utama (Four-Eyes Rule).

---

## 3. WhatsApp Bot Flow (Hifza Assistant)
Alur integrasi bot untuk mempermudah operasional lewat aplikasi pesan.

1.  **User (Admin)** mengirim foto nota ke nomor resmi WA Hifza.
2.  **Bot** mengirimkan foto ke server Backend `/api/ocr/process`.
3.  **AI Server** mengekstrak data dan mengirim balik konfirmasi: *"Ditemukan transaksi Gamis senilai Rp250.000. Simpan? (Y/N)"*.
4.  **User** membalas "Y".
5.  **Bot** memanggil API `/api/sales/transaction` untuk menyimpan data secara otomatis.

---

## 4. Integration Contracts (Data Exchange)
Kontrak skema JSON untuk integrasi antara modul AI dan sistem inti.

### Request Contract (AI to Core)
```json
{
  "module": "zakat_infaq",
  "action": "AUTO_CALC",
  "payload": {
    "net_profit": 10000000,
    "calculation_method": "sharia_standard_2.5"
  }
}
{
  "status": "success",
  "data": {
    "zakat_obligation": 250000,
    "audit_reference_id": "AUD-202605-001"
  }
}