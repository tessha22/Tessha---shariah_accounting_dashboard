-- ==========================================
-- HIFZA DATABASE SETUP SCRIPT FOR SUPABASE
-- ==========================================
-- Jalankan kode SQL ini langsung di menu SQL Editor Supabase Anda.

-- 1. HAPUS TABEL JIKA SUDAH ADA (Untuk reset)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS zakat_infaq CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. PEMBUATAN TABEL-TABEL UTAMA
-- Tabel Pengguna (Users)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);

-- Tabel Produk (Products)
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER NOT NULL
);

-- Tabel Transaksi Penjualan (Transactions)
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    amount REAL NOT NULL,
    discount REAL DEFAULT 0,
    payment_method TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Zakat & Infaq
CREATE TABLE zakat_infaq (
    id TEXT PRIMARY KEY,
    donor_name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Zakat Mal', 'Infaq'
    amount REAL NOT NULL,
    status TEXT NOT NULL, -- 'Pending', 'Tersalurkan'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    verified_by TEXT,
    verified_at TIMESTAMPTZ
);

-- Tabel Audit Trail (Audit Logs)
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. NONAKTIFKAN ROW LEVEL SECURITY (RLS)
-- Diperlukan agar client-side SDK dengan anon key dapat membaca dan menulis data secara langsung.
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_infaq DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;

-- 4. SEED DATA AWAL (INITIAL DATA)
-- Seed Users (Password terenkripsi bcrypt)
INSERT INTO users (id, username, password, role) VALUES 
('usr-1', 'tessha@owner.id', '$2a$10$Adm6.eY8RtYVwTboy7AejevzF.feTyWnpAUzWniohcWwYUDvKLVC2', 'Owner'),
('usr-2', 'admin@hifza.id', '$2a$10$9Beaw71JEKN8wMGQ43dz9OA/OhYhUzSWwgqSUIHMwMPGGG0cV/w06', 'Admin'),
('usr-3', 'auditor@hifza.id', '$2a$10$UrvDTFYC97y3aI3SrDaxVOjLpWH9iurHX9syVgGq1JRea94dOJ4V.', 'Auditor');

-- Seed Products
INSERT INTO products (id, name, category, price, stock) VALUES 
('prd-1', 'Gamis Syar''i Premium', 'Busana Muslim', 250000, 15),
('prd-2', 'Hijab Syar''i anti UV', 'Hijab', 85000, 40),
('prd-3', 'Baju Koko Modern', 'Busana Muslim', 175000, 3), -- Stok rendah (< 5) untuk trigger warning
('prd-4', 'Mukenah Sutra Khadijah', 'Perlengkapan Shalat', 350000, 8);

-- Seed Transactions
INSERT INTO transactions (id, product_id, amount, discount, payment_method, created_at) VALUES 
('trx-1', 'prd-1', 250000, 0, 'Transfer', NOW() - INTERVAL '2 days'),
('trx-2', 'prd-2', 85000, 0, 'Tunai', NOW() - INTERVAL '2 days'),
('trx-3', 'prd-1', 500000, 0, 'Transfer', NOW() - INTERVAL '1 day'),
('trx-4', 'prd-4', 350000, 0, 'Tunai', NOW());

-- Seed Zakat & Infaq
INSERT INTO zakat_infaq (id, donor_name, type, amount, status, created_at, verified_by, verified_at) VALUES 
('zk-1', 'Hamba Allah', 'Infaq', 100000, 'Tersalurkan', NOW() - INTERVAL '2 days', 'Owner', NOW() - INTERVAL '2 days'),
('zk-2', 'Ahmad Sukarno', 'Zakat Mal', 2500000, 'Pending', NOW() - INTERVAL '1 day', NULL, NULL);

-- Seed Audit Logs
INSERT INTO audit_logs (id, user_id, action, details, created_at) VALUES 
('log-1', 'usr-1', 'DATABASE_INITIALIZATION', 'Sistem berhasil dihubungkan ke database cloud Supabase dan diinisialisasi.', NOW());
