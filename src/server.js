const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbHelper = require('./db');

const app = express();
const PORT = process.env.APP_PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'hifza-super-secret-key-2026';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/env.local', express.static(path.join(__dirname, '..', 'env.local')));

// In-Memory Database Fallback if SQLite is mocked
let mockDbData = {
  users: [
    { id: 'usr-1', username: 'tessha@owner.id', password: '', role: 'Owner' },
    { id: 'usr-2', username: 'admin@hifza.id', password: '', role: 'Admin' },
    { id: 'usr-3', username: 'auditor@hifza.id', password: '', role: 'Auditor' }
  ],
  products: [
    { id: 'prd-1', name: 'Gamis Syar\'i Premium', category: 'Busana Muslim', price: 250000, stock: 15 },
    { id: 'prd-2', name: 'Hijab Syar\'i anti UV', category: 'Hijab', price: 85000, stock: 40 },
    { id: 'prd-3', name: 'Baju Koko Modern', category: 'Busana Muslim', price: 175000, stock: 3 },
    { id: 'prd-4', name: 'Mukenah Sutra Khadijah', category: 'Perlengkapan Shalat', price: 350000, stock: 8 }
  ],
  transactions: [
    { id: 'trx-1', product_id: 'prd-1', amount: 250000, discount: 0, payment_method: 'Transfer', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'trx-2', product_id: 'prd-2', amount: 85000, discount: 0, payment_method: 'Tunai', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'trx-3', product_id: 'prd-1', amount: 500000, discount: 0, payment_method: 'Transfer', created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 'trx-4', product_id: 'prd-4', amount: 350000, discount: 0, payment_method: 'Tunai', created_at: new Date().toISOString() }
  ],
  zakat_infaq: [
    { id: 'zk-1', donor_name: 'Hamba Allah', type: 'Infaq', amount: 100000, status: 'Tersalurkan', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), verified_by: 'Owner', verified_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'zk-2', donor_name: 'Ahmad Sukarno', type: 'Zakat Mal', amount: 2500000, status: 'Pending', created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), verified_by: null, verified_at: null }
  ],
  audit_logs: [
    { id: 'log-1', user_id: 'usr-1', action: 'DATABASE_INITIALIZATION', details: 'Sistem menggunakan database memori tiruan.', created_at: new Date().toISOString() }
  ]
};

// Enkripsi password untuk mock data saat server jalan
const salt = bcrypt.genSaltSync(10);
mockDbData.users.forEach(u => {
  if (u.id === 'usr-1') {
    u.password = bcrypt.hashSync('Hifza123', salt);
  } else {
    u.password = bcrypt.hashSync(u.role.toLowerCase() + '123', salt);
  }
});

// Middleware Autentikasi JWT & RBAC
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan, silakan login.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Sesi kedaluwarsa atau token tidak valid.' });
    req.user = user;
    next();
  });
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak: Peran Anda tidak memiliki wewenang.' });
    }
    next();
  };
}

// Helper untuk log audit trail
async function logAudit(userId, action, details) {
  const now = new Date().toISOString();
  const id = 'log-' + Math.random().toString(36).substr(2, 9);
  if (!dbHelper.isMockDb) {
    try {
      await dbHelper.run('INSERT INTO audit_logs (id, user_id, action, details, created_at) VALUES (?, ?, ?, ?, ?)', [id, userId, action, details, now]);
    } catch (e) {
      console.error('Audit log failed', e);
    }
  } else {
    mockDbData.audit_logs.unshift({ id, user_id: userId, action, details, created_at: now });
  }
}

// --- ENDPOINTS ---

// 1. POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi.' });
  }

  try {
    let user;
    if (!dbHelper.isMockDb) {
      user = await dbHelper.get('SELECT * FROM users WHERE username = ?', [username]);
    } else {
      user = mockDbData.users.find(u => u.username === username);
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Kredensial salah.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server.', error: err.message });
  }
});

// 2. GET /api/dashboard/kpi
app.get('/api/dashboard/kpi', authenticateToken, async (req, res) => {
  try {
    let sales = [];
    let zakat_list = [];

    if (!dbHelper.isMockDb) {
      sales = await dbHelper.all('SELECT amount FROM transactions');
      zakat_list = await dbHelper.all('SELECT amount, status FROM zakat_infaq');
    } else {
      sales = mockDbData.transactions;
      zakat_list = mockDbData.zakat_infaq;
    }

    // Perhitungan Laba & Zakat
    const totalSales = sales.reduce((acc, curr) => acc + curr.amount, 0);
    // Asumsi biaya operasional tetap = 30% dari penjualan
    const operationalCost = totalSales * 0.3;
    const netProfit = totalSales - operationalCost;
    
    // Zakat = 2.5% dari Laba Bersih
    const zakatRate = 0.025;
    const zakatObligation = netProfit > 0 ? netProfit * zakatRate : 0;

    const totalZakatPaid = zakat_list
      .filter(z => z.status === 'Tersalurkan')
      .reduce((acc, curr) => acc + curr.amount, 0);

    res.json({
      totalSales,
      netProfit,
      zakatObligation,
      totalZakatPaid,
      transactionCount: sales.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan mengambil data dashboard.', error: err.message });
  }
});

// 3. GET /api/sales/transactions & POST /api/sales/transaction
app.get('/api/sales/transactions', authenticateToken, async (req, res) => {
  try {
    let transactions = [];
    if (!dbHelper.isMockDb) {
      transactions = await dbHelper.all(`
        SELECT t.*, p.name as product_name, p.category as product_category 
        FROM transactions t 
        JOIN products p ON t.product_id = p.id
        ORDER BY t.created_at DESC
      `);
    } else {
      transactions = mockDbData.transactions.map(t => {
        const p = mockDbData.products.find(prod => prod.id === t.product_id);
        return {
          ...t,
          product_name: p ? p.name : 'Produk Dihapus',
          product_category: p ? p.category : 'N/A'
        };
      }).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    }
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server.', error: err.message });
  }
});

app.post('/api/sales/transaction', authenticateToken, requireRole(['Admin', 'Owner']), async (req, res) => {
  const { product_id, quantity, payment_method, discount } = req.body;
  if (!product_id || !quantity || !payment_method) {
    return res.status(400).json({ message: 'Data transaksi tidak lengkap.' });
  }

  try {
    let product;
    if (!dbHelper.isMockDb) {
      product = await dbHelper.get('SELECT * FROM products WHERE id = ?', [product_id]);
    } else {
      product = mockDbData.products.find(p => p.id === product_id);
    }

    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Stok tidak mencukupi. Stok saat ini: ' + product.stock });
    }

    const discountAmount = parseFloat(discount || 0);
    const grossAmount = product.price * quantity;
    const totalAmount = Math.max(0, grossAmount - discountAmount);
    const newStock = product.stock - quantity;
    const now = new Date().toISOString();
    const trxId = 'trx-' + Math.random().toString(36).substr(2, 9);

    // Business Rule: Anomali Transaksi > Rp10.000.000
    let triggerAnomaly = false;
    if (totalAmount > 10000000) {
      triggerAnomaly = true;
    }

    if (!dbHelper.isMockDb) {
      // Jalankan transaksi dalam SQLite
      await dbHelper.run('UPDATE products SET stock = ? WHERE id = ?', [newStock, product_id]);
      await dbHelper.run('INSERT INTO transactions (id, product_id, amount, discount, payment_method, created_at) VALUES (?, ?, ?, ?, ?, ?)', [trxId, product_id, totalAmount, discountAmount, payment_method, now]);
    } else {
      product.stock = newStock;
      mockDbData.transactions.unshift({
        id: trxId,
        product_id,
        amount: totalAmount,
        discount: discountAmount,
        payment_method,
        created_at: now
      });
    }

    // Log Audit
    await logAudit(req.user.id, 'SALE_RECORDED', `Mencatat penjualan ${product.name} sebanyak ${quantity} pcs dengan total Rp${totalAmount.toLocaleString('id-ID')}. Sisa stok: ${newStock}.`);

    if (triggerAnomaly) {
      await logAudit(req.user.id, 'ANOMALY_DETECTED', `PERINGATAN: Transaksi bernilai tinggi dideteksi (Rp${totalAmount.toLocaleString('id-ID')}). Notifikasi dikirim ke Owner.`);
    }

    res.json({
      message: 'Transaksi berhasil disimpan.',
      transactionId: trxId,
      totalAmount,
      newStock,
      anomalyTriggered: triggerAnomaly,
      stockWarning: newStock < 5
    });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan mencatat transaksi.', error: err.message });
  }
});

// 4. GET /api/inventory & POST /api/inventory/stock-in
app.get('/api/inventory', authenticateToken, requireRole(['Admin', 'Owner', 'Auditor']), async (req, res) => {
  try {
    let products = [];
    if (!dbHelper.isMockDb) {
      products = await dbHelper.all('SELECT * FROM products');
    } else {
      products = mockDbData.products;
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data inventaris.', error: err.message });
  }
});

app.post('/api/inventory/stock-in', authenticateToken, requireRole(['Admin', 'Owner']), async (req, res) => {
  const { product_id, stock_added } = req.body;
  if (!product_id || !stock_added || stock_added <= 0) {
    return res.status(400).json({ message: 'Data penambahan stok tidak valid.' });
  }

  try {
    let product;
    if (!dbHelper.isMockDb) {
      product = await dbHelper.get('SELECT * FROM products WHERE id = ?', [product_id]);
    } else {
      product = mockDbData.products.find(p => p.id === product_id);
    }

    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });

    const newStock = product.stock + parseInt(stock_added);

    if (!dbHelper.isMockDb) {
      await dbHelper.run('UPDATE products SET stock = ? WHERE id = ?', [newStock, product_id]);
    } else {
      product.stock = newStock;
    }

    await logAudit(req.user.id, 'STOCK_UPDATE', `Menambah stok untuk ${product.name} sebanyak ${stock_added}. Stok lama: ${product.stock - stock_added}, Stok baru: ${newStock}.`);

    res.json({ message: 'Stok berhasil ditambahkan.', product_id, newStock });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui stok.', error: err.message });
  }
});

// 5. GET /api/zakat/calculate & POST /api/zakat/pay & POST /api/zakat/approve
app.get('/api/zakat/logs', authenticateToken, async (req, res) => {
  try {
    let zakat_list = [];
    if (!dbHelper.isMockDb) {
      zakat_list = await dbHelper.all('SELECT * FROM zakat_infaq ORDER BY created_at DESC');
    } else {
      zakat_list = mockDbData.zakat_infaq.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    }
    res.json(zakat_list);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data zakat/infaq.', error: err.message });
  }
});

app.post('/api/zakat/pay', authenticateToken, requireRole(['Admin', 'Owner']), async (req, res) => {
  const { donor_name, type, amount } = req.body;
  if (!donor_name || !type || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Data donasi tidak valid.' });
  }

  try {
    const id = 'zk-' + Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();
    
    // Zakat Mal butuh approval Owner/Auditor (Four-Eyes), Infaq langsung Tersalurkan
    const status = type === 'Infaq' ? 'Tersalurkan' : 'Pending';

    if (!dbHelper.isMockDb) {
      await dbHelper.run('INSERT INTO zakat_infaq (id, donor_name, type, amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?)', [id, donor_name, type, amount, status, now]);
    } else {
      mockDbData.zakat_infaq.unshift({
        id,
        donor_name,
        type,
        amount,
        status,
        created_at: now,
        verified_by: null,
        verified_at: null
      });
    }

    await logAudit(req.user.id, 'DONATION_RECORDED', `Mencatat donasi ${type} dari ${donor_name} sebesar Rp${amount.toLocaleString('id-ID')}. Status: ${status}`);

    res.json({ message: `Dana ${type} berhasil dicatat dengan status: ${status}`, donationId: id, status });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mencatat donasi.', error: err.message });
  }
});

app.post('/api/zakat/approve', authenticateToken, requireRole(['Owner', 'Auditor']), async (req, res) => {
  const { donation_id } = req.body;
  if (!donation_id) return res.status(400).json({ message: 'ID donasi diperlukan.' });

  try {
    let donation;
    if (!dbHelper.isMockDb) {
      donation = await dbHelper.get('SELECT * FROM zakat_infaq WHERE id = ?', [donation_id]);
    } else {
      donation = mockDbData.zakat_infaq.find(z => z.id === donation_id);
    }

    if (!donation) return res.status(404).json({ message: 'Donasi tidak ditemukan.' });
    if (donation.status === 'Tersalurkan') return res.status(400).json({ message: 'Donasi ini sudah berstatus Tersalurkan.' });

    const now = new Date().toISOString();

    if (!dbHelper.isMockDb) {
      await dbHelper.run('UPDATE zakat_infaq SET status = ?, verified_by = ?, verified_at = ? WHERE id = ?', ['Tersalurkan', req.user.username, now, donation_id]);
    } else {
      donation.status = 'Tersalurkan';
      donation.verified_by = req.user.username;
      donation.verified_at = now;
    }

    await logAudit(req.user.id, 'DONATION_APPROVED', `Menyetujui penyaluran dana ${donation.type} ID ${donation_id} sebesar Rp${donation.amount.toLocaleString('id-ID')} (Verifikasi oleh ${req.user.role}).`);

    res.json({ message: 'Penyaluran zakat berhasil disetujui.', donation_id });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menyetujui penyaluran.', error: err.message });
  }
});

// 6. GET /api/audit/logs
app.get('/api/audit/logs', authenticateToken, requireRole(['Auditor', 'Owner']), async (req, res) => {
  try {
    let logs = [];
    if (!dbHelper.isMockDb) {
      logs = await dbHelper.all(`
        SELECT al.*, u.username, u.role
        FROM audit_logs al
        JOIN users u ON al.user_id = u.id
        ORDER BY al.created_at DESC
      `);
    } else {
      logs = mockDbData.audit_logs.map(l => {
        const u = mockDbData.users.find(usr => usr.id === l.user_id);
        return {
          ...l,
          username: u ? u.username : 'Unknown',
          role: u ? u.role : 'N/A'
        };
      }).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    }
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil log audit.', error: err.message });
  }
});

// Jalankan database lalu jalankan server
dbHelper.initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server HIFZA berjalan di http://localhost:${PORT}`);
    console.log(`Fallback Client-Only Mode juga siap digunakan dengan membuka index.html secara langsung.`);
  });
}).catch(err => {
  console.error('Inisialisasi DB Gagal:', err);
});
