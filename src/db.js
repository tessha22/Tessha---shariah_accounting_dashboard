const path = require('path');
const fs = require('fs');

// Path database
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'hifza.db');

let db;
let isMockDb = false;

try {
  const sqlite3 = require('sqlite3').verbose();
  db = new sqlite3.Database(dbPath);
  console.log('Database SQLite berhasil terhubung di: ' + dbPath);
} catch (err) {
  console.warn('Gagal memuat sqlite3, menggunakan mode database memori/file tiruan.');
  isMockDb = true;
  // Implementasi fallback sederhana jika sqlite3 tidak tersedia
  db = {
    serialize: (cb) => cb(),
    run: function(sql, params, cb) {
      const callback = typeof params === 'function' ? params : cb;
      if (callback) callback.call({ lastID: 1, changes: 0 }, null);
    },
    all: function(sql, params, cb) {
      const callback = typeof params === 'function' ? params : cb;
      if (callback) callback(null, []);
    },
    get: function(sql, params, cb) {
      const callback = typeof params === 'function' ? params : cb;
      if (callback) callback(null, null);
    },
    close: () => {}
  };
}

// Helper untuk menjalankan query SQL secara promise-based
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Inisialisasi Tabel dan Seed Data
async function initDb() {
  if (isMockDb) return;

  const bcrypt = require('bcryptjs');

  // 1. Tabel Users
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `);

  // 2. Tabel Products
  await run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT,
      category TEXT,
      price REAL,
      stock INTEGER
    )
  `);

  // 3. Tabel Transactions
  await run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      product_id TEXT,
      amount REAL,
      payment_method TEXT,
      created_at TEXT,
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `);

  // 4. Tabel Zakat & Infaq
  await run(`
    CREATE TABLE IF NOT EXISTS zakat_infaq (
      id TEXT PRIMARY KEY,
      donor_name TEXT,
      type TEXT,
      amount REAL,
      status TEXT,
      created_at TEXT,
      verified_by TEXT,
      verified_at TEXT
    )
  `);

  // 5. Tabel Audit Logs
  await run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT,
      details TEXT,
      created_at TEXT
    )
  `);

  // --- SEEDING DATA AWAL ---
  
  // Cek apakah tabel users kosong
  const userCount = await get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    console.log('Melakukan seeding data awal...');

    // Hash password default
    const salt = bcrypt.genSaltSync(10);
    const ownerHash = bcrypt.hashSync('Hifza123', salt);
    const adminHash = bcrypt.hashSync('admin123', salt);
    const auditorHash = bcrypt.hashSync('auditor123', salt);

    // Seed Users
    await run('INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)', ['usr-1', 'tessha@owner.id', ownerHash, 'Owner']);
    await run('INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)', ['usr-2', 'admin@hifza.id', adminHash, 'Admin']);
    await run('INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)', ['usr-3', 'auditor@hifza.id', auditorHash, 'Auditor']);

    // Seed Products (Gamis, Hijab, Koko, dll)
    await run('INSERT INTO products (id, name, category, price, stock) VALUES (?, ?, ?, ?, ?)', ['prd-1', 'Gamis Syar\'i Premium', 'Busana Muslim', 250000, 15]);
    await run('INSERT INTO products (id, name, category, price, stock) VALUES (?, ?, ?, ?, ?)', ['prd-2', 'Hijab Syar\'i anti UV', 'Hijab', 85000, 40]);
    await run('INSERT INTO products (id, name, category, price, stock) VALUES (?, ?, ?, ?, ?)', ['prd-3', 'Baju Koko Modern', 'Busana Muslim', 175000, 3]); // Sengaja stock < 5 untuk trigger warning
    await run('INSERT INTO products (id, name, category, price, stock) VALUES (?, ?, ?, ?, ?)', ['prd-4', 'Mukenah Sutra Khadijah', 'Perlengkapan Shalat', 350000, 8]);

    // Seed Transactions
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();

    await run('INSERT INTO transactions (id, product_id, amount, payment_method, created_at) VALUES (?, ?, ?, ?, ?)', ['trx-1', 'prd-1', 250000, 'Transfer', twoDaysAgo]);
    await run('INSERT INTO transactions (id, product_id, amount, payment_method, created_at) VALUES (?, ?, ?, ?, ?)', ['trx-2', 'prd-2', 85000, 'Tunai', twoDaysAgo]);
    await run('INSERT INTO transactions (id, product_id, amount, payment_method, created_at) VALUES (?, ?, ?, ?, ?)', ['trx-3', 'prd-1', 500000, 'Transfer', oneDayAgo]); // Beli 2 gamis
    await run('INSERT INTO transactions (id, product_id, amount, payment_method, created_at) VALUES (?, ?, ?, ?, ?)', ['trx-4', 'prd-4', 350000, 'Tunai', now.toISOString()]);

    // Seed Zakat / Infaq
    await run('INSERT INTO zakat_infaq (id, donor_name, type, amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?)', ['zk-1', 'Hamba Allah', 'Infaq', 100000, 'Tersalurkan', twoDaysAgo]);
    await run('INSERT INTO zakat_infaq (id, donor_name, type, amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?)', ['zk-2', 'Ahmad Sukarno', 'Zakat Mal', 2500000, 'Pending', oneDayAgo]);

    // Seed Audit Logs
    await run('INSERT INTO audit_logs (id, user_id, action, details, created_at) VALUES (?, ?, ?, ?, ?)', ['log-1', 'usr-1', 'DATABASE_INITIALIZATION', 'Sistem berhasil diinisialisasi dan data awal ditanam.', now.toISOString()]);

    console.log('Seeding selesai!');
  }
}

module.exports = {
  db,
  initDb,
  run,
  all,
  get,
  isMockDb
};
