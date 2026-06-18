#users|
Field,Type,Description
id,UUID (PK),Unique Identifier
username,String,Email/ID login   
password,Hash,Kredensial terenkripsi
role,Enum,"Owner, Admin, Auditor   +1"
#products|
Field,Type,Description
id,UUID (PK),Unique Identifier
name,String,"Gamis, Hijab, Koko, dll   +1"
category,String,Kategori produk   
price,Decimal,Harga jual
stock,Integer,Jumlah stok saat ini
#transactions|
Field,Type,Description
id,UUID (PK),ID Transaksi
product_id,UUID (FK),Relasi ke produk
amount,Decimal,Total nilai penjualan   
payment_method,String,Tunai/Transfer   
created_at,Timestamp,Waktu transaksi
#zakat_infaq|
Field,Type,Description
id,UUID (PK),Unique Identifier
donor_name,String,Nama penyumbang   
type,Enum,"Zakat Fitrah, Zakat Mal, Infaq   "
amount,Decimal,Jumlah dana   
status,String,Tersalurkan/Pending
Method,Endpoint,Description,Auth Role
| Method | Endpoint | Description | Auth Role |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Autentikasi pengguna | Public |
| **GET** | `/api/dashboard/kpi` | Mengambil data ringkasan KPI | All Roles |
| **POST** | `/api/sales/transaction` | Mencatat penjualan baru | Admin |
| **GET** | `/api/inventory` | List stok produk di gudang | Admin, Owner |
| **GET** | `/api/zakat/calculate` | Kalkulasi otomatis kewajiban zakat | All Roles |
| **GET** | `/api/audit/logs` | Mengambil log aktivitas sistem | Auditor, Owner |
