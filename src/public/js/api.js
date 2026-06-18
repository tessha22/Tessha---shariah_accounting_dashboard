/**
 * HIFZA API CLIENT HELPER (TRIPLE-MODE)
 * Mendukung Supabase Cloud DB Mode, Live Server Mode (Fetch API), dan Local Offline Mode (LocalStorage Fallback)
 */

const API = (() => {
  let isSupabaseMode = false;
  let isServerMode = false;
  let authToken = localStorage.getItem('hifza_token') || null;
  let currentUser = JSON.parse(localStorage.getItem('hifza_user')) || null;

  // Supabase Configuration
  let SUPABASE_URL = 'https://nyboelunnmurwzrixphe.supabase.co';
  let SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Ym9lbHVubm11cnd6cml4cGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMDYyNTYsImV4cCI6MjA5NjY4MjI1Nn0.si9mwBJinsy80veIkSN-cjntiRtLpiyJkd0Ng95Usuk';
  let supabaseClient = null;

  async function loadConfig() {
    try {
      const res = await fetch('/env.local/config.json');
      if (res.ok) {
        const config = await res.json();
        if (config.supabaseUrl && config.supabaseKey) {
          SUPABASE_URL = config.supabaseUrl;
          SUPABASE_KEY = config.supabaseKey;
          console.log('HIFZA API: Berhasil memuat konfigurasi dari env.local/config.json');
        }
      }
    } catch (err) {
      console.log('HIFZA API: Menggunakan kredensial Supabase bawaan (fallback).');
    }

    if (window.supabase) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
  }

  // Nama key LocalStorage untuk offline mode
  const STORAGE_KEYS = {
    USERS: 'hifza_offline_users',
    PRODUCTS: 'hifza_offline_products',
    TRANSACTIONS: 'hifza_offline_transactions',
    ZAKAT: 'hifza_offline_zakat',
    AUDIT: 'hifza_offline_audit'
  };

  // --- SEED DATA UNTUK OFFLINE MODE ---
  function initOfflineStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      // Simpan User
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([
        { id: 'usr-1', username: 'tessha@owner.id', password: 'Hifza123', role: 'Owner' },
        { id: 'usr-2', username: 'admin@hifza.id', password: 'admin123', role: 'Admin' },
        { id: 'usr-3', username: 'auditor@hifza.id', password: 'auditor123', role: 'Auditor' }
      ]));

      // Simpan Produk awal
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([
        { id: 'prd-1', name: 'Gamis Syar\'i Premium', category: 'Busana Muslim', price: 250000, stock: 15 },
        { id: 'prd-2', name: 'Hijab Syar\'i anti UV', category: 'Hijab', price: 85000, stock: 40 },
        { id: 'prd-3', name: 'Baju Koko Modern', category: 'Busana Muslim', price: 175000, stock: 3 },
        { id: 'prd-4', name: 'Mukenah Sutra Khadijah', category: 'Perlengkapan Shalat', price: 350000, stock: 8 }
      ]));

      // Simpan Transaksi awal
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();

      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([
        { id: 'trx-1', product_id: 'prd-1', amount: 250000, payment_method: 'Transfer', created_at: twoDaysAgo },
        { id: 'trx-2', product_id: 'prd-2', amount: 85000, payment_method: 'Tunai', created_at: twoDaysAgo },
        { id: 'trx-3', product_id: 'prd-1', amount: 500000, payment_method: 'Transfer', created_at: oneDayAgo },
        { id: 'trx-4', product_id: 'prd-4', amount: 350000, payment_method: 'Tunai', created_at: now.toISOString() }
      ]));

      // Simpan Zakat & Infaq awal
      localStorage.setItem(STORAGE_KEYS.ZAKAT, JSON.stringify([
        { id: 'zk-1', donor_name: 'Hamba Allah', type: 'Infaq', amount: 100000, status: 'Tersalurkan', created_at: twoDaysAgo, verified_by: 'Owner', verified_at: twoDaysAgo },
        { id: 'zk-2', donor_name: 'Ahmad Sukarno', type: 'Zakat Mal', amount: 2500000, status: 'Pending', created_at: oneDayAgo, verified_by: null, verified_at: null }
      ]));

      // Simpan Audit Log awal
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify([
        { id: 'log-1', user_id: 'usr-1', action: 'DATABASE_INITIALIZATION', details: 'Sistem menggunakan database LocalStorage offline.', created_at: now.toISOString(), username: 'owner@hifza.id', role: 'Owner' }
      ]));
    }
  }

  // --- DETEKSI KONEKSI DATABASE ---
  async function detectMode() {
    // 1. Coba koneksi ke Supabase terlebih dahulu
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('products').select('id').limit(1);
        // Jika tidak ada error koneksi (bisa sukses atau error karena tabel belum dibuat, kode PostgreSQL '42P01')
        if (!error || (error && error.code === '42P01')) {
          isSupabaseMode = true;
          isServerMode = false;
          console.log('HIFZA API: Terhubung ke Supabase Cloud Database.');
          updateConnectionUI();
          return;
        } else {
          console.warn('HIFZA API: Supabase terdefinisi tetapi gagal query:', error.message);
        }
      } catch (err) {
        console.warn('HIFZA API: Gagal terhubung ke Supabase:', err);
      }
    }

    // 2. Fallback ke Express server lokal jika Supabase tidak tersedia
    try {
      const response = await fetch('/api/dashboard/kpi', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      isServerMode = true;
      isSupabaseMode = false;
      console.log('HIFZA API: Terhubung ke backend server Node.js.');
    } catch (err) {
      // Terjadi network error, fallback ke LocalStorage offline
      isServerMode = false;
      isSupabaseMode = false;
      console.warn('HIFZA API: Server Node.js offline. Mengaktifkan mode LocalStorage offline.');
      initOfflineStorage();
    }
    updateConnectionUI();
  }

  function updateConnectionUI() {
    const indicator = document.getElementById('connection-indicator');
    const text = document.getElementById('connection-text');
    if (indicator && text) {
      if (isSupabaseMode) {
        indicator.className = 'status-indicator online';
        text.innerText = 'Supabase Cloud DB';
      } else if (isServerMode) {
        indicator.className = 'status-indicator online';
        text.innerText = 'Server Mode (Live API)';
      } else {
        indicator.className = 'status-indicator offline';
        text.innerText = 'Offline Mode (Local DB)';
      }
    }
  }

  // --- HELPER DUMMY PROMISE LATENCY (Meningkatkan kemiripan UX server) ---
  const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

  // --- LOG AUDIT HELPER ---
  async function logAudit(userId, action, details) {
    const now = new Date().toISOString();
    const id = 'log-' + Math.random().toString(36).substr(2, 9);
    
    if (isSupabaseMode && supabaseClient) {
      try {
        await supabaseClient.from('audit_logs').insert({
          id,
          user_id: userId,
          action,
          details,
          created_at: now
        });
      } catch (err) {
        console.error('HIFZA API: Gagal mencatat log audit ke Supabase:', err);
      }
    } else if (!isServerMode) {
      logAuditOffline(userId, action, details);
    }
    // Catatan: Mode server lokal (isServerMode) mencatat audit secara otomatis di sisi backend
  }

  // --- LOG AUDIT OFFLINE ---
  function logAuditOffline(userId, action, details) {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT)) || [];
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const user = users.find(u => u.id === userId);
    
    logs.unshift({
      id: 'log-' + Math.random().toString(36).substr(2, 9),
      user_id: userId,
      username: user ? user.username : 'Unknown',
      role: user ? user.role : 'N/A',
      action,
      details,
      created_at: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(logs));
  }

  function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('hifza_token');
    localStorage.removeItem('hifza_user');
  }

  async function authorizedFetch(url, options = {}) {
    if (!options.headers) options.headers = {};
    options.headers['Authorization'] = `Bearer ${authToken}`;
    
    try {
      const res = await fetch(url, options);
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        window.location.reload();
        throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Terjadi kesalahan pada server.');
      }
      return data;
    } catch (err) {
      if (err.message && err.message.includes('Sesi Anda telah berakhir')) {
        throw err;
      }
      throw new Error(err.message || 'Gagal terhubung ke server.');
    }
  }

  // --- PUBLIC API METHODS ---
  return {
    initialize: async () => {
      await loadConfig();
      await detectMode();
    },

    isServer: () => isServerMode || isSupabaseMode,

    getUser: () => currentUser,

    logout: () => {
      handleLogout();
    },

    // Mengekspos logAudit agar bisa digunakan di app.js jika diperlukan
    logAudit,

    // 1. LOGIN
    login: async (username, password) => {
      await delay(400);
      
      if (isSupabaseMode) {
        const { data: user, error } = await supabaseClient
          .from('users')
          .select('*')
          .eq('username', username)
          .single();

        if (error || !user) {
          throw new Error('Username atau password salah.');
        }

        // Verifikasi password terenkripsi bcrypt
        let isMatch = false;
        const bcryptGlobal = window.bcrypt || (typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt);
        if (bcryptGlobal && bcryptGlobal.compareSync) {
          isMatch = bcryptGlobal.compareSync(password, user.password);
        } else {
          isMatch = (user.password === password);
        }

        if (!isMatch) {
          throw new Error('Username atau password salah.');
        }

        authToken = 'supabase-jwt-token-' + user.id;
        currentUser = { id: user.id, username: user.username, role: user.role };
        localStorage.setItem('hifza_token', authToken);
        localStorage.setItem('hifza_user', JSON.stringify(currentUser));

        await logAudit(user.id, 'USER_LOGIN', `Pengguna ${user.username} berhasil login via Supabase.`);
        return currentUser;
      }
      else if (isServerMode) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login gagal.');
        
        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('hifza_token', authToken);
        localStorage.setItem('hifza_user', JSON.stringify(currentUser));
        return currentUser;
      } else {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) throw new Error('Username atau password salah.');
        
        authToken = 'mock-jwt-token-' + user.id;
        currentUser = { id: user.id, username: user.username, role: user.role };
        localStorage.setItem('hifza_token', authToken);
        localStorage.setItem('hifza_user', JSON.stringify(currentUser));
        
        logAuditOffline(user.id, 'USER_LOGIN', `Pengguna ${user.username} berhasil login offline.`);
        return currentUser;
      }
    },

    // 2. DASHBOARD KPI
    getKpi: async () => {
      if (isSupabaseMode) {
        await delay(200);
        const { data: transactions, error: txError } = await supabaseClient
          .from('transactions')
          .select('amount');

        const { data: zakatList, error: zkError } = await supabaseClient
          .from('zakat_infaq')
          .select('amount, status');

        if (txError) throw txError;
        if (zkError) throw zkError;

        const totalSales = (transactions || []).reduce((acc, curr) => acc + curr.amount, 0);
        const netProfit = totalSales - (totalSales * 0.3); // Biaya operasional 30%
        const zakatObligation = netProfit > 0 ? netProfit * 0.025 : 0;
        const totalZakatPaid = (zakatList || [])
          .filter(z => z.status === 'Tersalurkan')
          .reduce((acc, curr) => acc + curr.amount, 0);

        return {
          totalSales,
          netProfit,
          zakatObligation,
          totalZakatPaid,
          transactionCount: (transactions || []).length
        };
      }
      else if (isServerMode) {
        return await authorizedFetch('/api/dashboard/kpi');
      } else {
        await delay(200);
        const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) || [];
        const zakatList = JSON.parse(localStorage.getItem(STORAGE_KEYS.ZAKAT)) || [];

        const totalSales = transactions.reduce((acc, curr) => acc + curr.amount, 0);
        const netProfit = totalSales - (totalSales * 0.3); // Biaya operasional 30%
        const zakatObligation = netProfit > 0 ? netProfit * 0.025 : 0;
        const totalZakatPaid = zakatList
          .filter(z => z.status === 'Tersalurkan')
          .reduce((acc, curr) => acc + curr.amount, 0);

        return {
          totalSales,
          netProfit,
          zakatObligation,
          totalZakatPaid,
          transactionCount: transactions.length
        };
      }
    },

    // 3. TRANSACTIONS
    getTransactions: async () => {
      if (isSupabaseMode) {
        await delay(200);
        const { data, error } = await supabaseClient
          .from('transactions')
          .select(`
            id,
            product_id,
            amount,
            discount,
            payment_method,
            created_at,
            products (
              name,
              category
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(t => ({
          id: t.id,
          product_id: t.product_id,
          amount: t.amount,
          discount: t.discount || 0,
          payment_method: t.payment_method,
          created_at: t.created_at,
          product_name: t.products ? t.products.name : 'Produk Dihapus',
          product_category: t.products ? t.products.category : 'N/A'
        }));
      }
      else if (isServerMode) {
        return await authorizedFetch('/api/sales/transactions');
      } else {
        await delay(200);
        const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) || [];
        const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
        
        return transactions.map(t => {
          const p = products.find(prod => prod.id === t.product_id);
          return {
            ...t,
            product_name: p ? p.name : 'Produk Dihapus',
            product_category: p ? p.category : 'N/A'
          };
        }).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
      }
    },

    addTransaction: async (productId, quantity, paymentMethod, discount = 0) => {
      if (isSupabaseMode) {
        await delay(300);
        
        // Ambil produk untuk validasi stok dan harga
        const { data: product, error: prdError } = await supabaseClient
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (prdError || !product) throw new Error('Produk tidak ditemukan.');
        if (product.stock < quantity) {
          throw new Error(`Stok tidak mencukupi. Stok saat ini: ${product.stock}`);
        }

        const discountAmount = parseFloat(discount || 0);
        const grossAmount = product.price * quantity;
        const totalAmount = Math.max(0, grossAmount - discountAmount);
        const newStock = product.stock - quantity;

        // Update stok produk
        const { error: updateError } = await supabaseClient
          .from('products')
          .update({ stock: newStock })
          .eq('id', productId);

        if (updateError) throw updateError;

        // Simpan transaksi
        const trxId = 'trx-' + Math.random().toString(36).substr(2, 9);
        const now = new Date().toISOString();
        const { error: insertError } = await supabaseClient
          .from('transactions')
          .insert({
            id: trxId,
            product_id: productId,
            amount: totalAmount,
            discount: discountAmount,
            payment_method: paymentMethod,
            created_at: now
          });

        if (insertError) throw insertError;

        // Catat Audit Trail
        await logAudit(currentUser.id, 'SALE_RECORDED', `Mencatat penjualan ${product.name} sebanyak ${quantity} pcs dengan total Rp${totalAmount.toLocaleString('id-ID')}. Sisa stok: ${newStock}.`);

        // Deteksi Anomali (> Rp10.000.000)
        let anomalyTriggered = false;
        if (totalAmount > 10000000) {
          anomalyTriggered = true;
          await logAudit(currentUser.id, 'ANOMALY_DETECTED', `PERINGATAN: Transaksi bernilai tinggi dideteksi (Rp${totalAmount.toLocaleString('id-ID')}). Notifikasi dikirim ke Owner.`);
        }

        return {
          message: 'Transaksi berhasil disimpan.',
          transactionId: trxId,
          totalAmount,
          newStock,
          anomalyTriggered,
          stockWarning: newStock < 5
        };
      }
      else if (isServerMode) {
        return await authorizedFetch('/api/sales/transaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId, quantity, payment_method: paymentMethod, discount: discount })
        });
      } else {
        await delay(300);
        const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
        const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) || [];
        
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex === -1) throw new Error('Produk tidak ditemukan.');
        
        const product = products[productIndex];
        if (product.stock < quantity) {
          throw new Error(`Stok tidak mencukupi. Stok saat ini: ${product.stock}`);
        }

        const discountAmount = parseFloat(discount || 0);
        const grossAmount = product.price * quantity;
        const totalAmount = Math.max(0, grossAmount - discountAmount);
        const newStock = product.stock - quantity;
        
        // Update stock
        product.stock = newStock;
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

        // Tambah transaksi
        const trxId = 'trx-' + Math.random().toString(36).substr(2, 9);
        const now = new Date().toISOString();
        transactions.unshift({
          id: trxId,
          product_id: productId,
          amount: totalAmount,
          discount: discountAmount,
          payment_method: paymentMethod,
          created_at: now
        });
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));

        // Audit Trail
        logAuditOffline(currentUser.id, 'SALE_RECORDED', `Mencatat penjualan ${product.name} sebanyak ${quantity} pcs dengan total Rp${totalAmount.toLocaleString('id-ID')}. Sisa stok: ${newStock}.`);

        // Check Anomali > 10 Juta
        let anomalyTriggered = false;
        if (totalAmount > 10000000) {
          anomalyTriggered = true;
          logAuditOffline(currentUser.id, 'ANOMALY_DETECTED', `PERINGATAN: Transaksi bernilai tinggi dideteksi (Rp${totalAmount.toLocaleString('id-ID')}). Notifikasi dikirim ke Owner.`);
        }

        return {
          message: 'Transaksi berhasil disimpan.',
          transactionId: trxId,
          totalAmount,
          newStock,
          anomalyTriggered,
          stockWarning: newStock < 5
        };
      }
    },

    // 4. INVENTORY
    getInventory: async () => {
      if (isSupabaseMode) {
        await delay(150);
        const { data, error } = await supabaseClient
          .from('products')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
      }
      else if (isServerMode) {
        return await authorizedFetch('/api/inventory');
      } else {
        await delay(150);
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
      }
    },

    addStock: async (productId, stockAdded) => {
      if (isSupabaseMode) {
        await delay(200);
        
        const { data: product, error: prdError } = await supabaseClient
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (prdError || !product) throw new Error('Produk tidak ditemukan.');

        const oldStock = product.stock;
        const newStock = oldStock + parseInt(stockAdded);

        const { error: updateError } = await supabaseClient
          .from('products')
          .update({ stock: newStock })
          .eq('id', productId);

        if (updateError) throw updateError;

        await logAudit(currentUser.id, 'STOCK_UPDATE', `Menambah stok untuk ${product.name} sebanyak ${stockAdded}. Stok lama: ${oldStock}, Stok baru: ${newStock}.`);

        return {
          message: 'Stok berhasil ditambahkan.',
          product_id: productId,
          newStock: newStock
        };
      }
      else if (isServerMode) {
        return await authorizedFetch('/api/inventory/stock-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId, stock_added: stockAdded })
        });
      } else {
        await delay(200);
        const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
        const idx = products.findIndex(p => p.id === productId);
        if (idx === -1) throw new Error('Produk tidak ditemukan.');

        const product = products[idx];
        const oldStock = product.stock;
        product.stock += parseInt(stockAdded);
        
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

        logAuditOffline(currentUser.id, 'STOCK_UPDATE', `Menambah stok untuk ${product.name} sebanyak ${stockAdded}. Stok lama: ${oldStock}, Stok baru: ${product.stock}.`);

        return {
          message: 'Stok berhasil ditambahkan.',
          product_id: productId,
          newStock: product.stock
        };
      }
    },

    // 5. ZAKAT
    getZakatLogs: async () => {
      if (isSupabaseMode) {
        await delay(150);
        const { data, error } = await supabaseClient
          .from('zakat_infaq')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      }
      else if (isServerMode) {
        return await authorizedFetch('/api/zakat/logs');
      } else {
        await delay(150);
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ZAKAT)) || [];
      }
    },

    addZakat: async (donorName, type, amount) => {
      if (isSupabaseMode) {
        await delay(250);
        const id = 'zk-' + Math.random().toString(36).substr(2, 9);
        const status = type === 'Infaq' ? 'Tersalurkan' : 'Pending';
        const now = new Date().toISOString();

        const { error } = await supabaseClient
          .from('zakat_infaq')
          .insert({
            id,
            donor_name: donorName,
            type,
            amount: parseFloat(amount),
            status,
            created_at: now,
            verified_by: type === 'Infaq' ? 'System' : null,
            verified_at: type === 'Infaq' ? now : null
          });

        if (error) throw error;

        await logAudit(currentUser.id, 'DONATION_RECORDED', `Mencatat donasi ${type} dari ${donorName} sebesar Rp${parseFloat(amount).toLocaleString('id-ID')}. Status: ${status}`);

        return {
          message: `Dana ${type} berhasil dicatat dengan status: ${status}`,
          donationId: id,
          status
        };
      }
      else if (isServerMode) {
        return await authorizedFetch('/api/zakat/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ donor_name: donorName, type, amount })
        });
      } else {
        await delay(250);
        const zakatList = JSON.parse(localStorage.getItem(STORAGE_KEYS.ZAKAT)) || [];
        const id = 'zk-' + Math.random().toString(36).substr(2, 9);
        const status = type === 'Infaq' ? 'Tersalurkan' : 'Pending';
        const now = new Date().toISOString();

        zakatList.unshift({
          id,
          donor_name: donorName,
          type,
          amount: parseFloat(amount),
          status,
          created_at: now,
          verified_by: type === 'Infaq' ? 'System' : null,
          verified_at: type === 'Infaq' ? now : null
        });

        localStorage.setItem(STORAGE_KEYS.ZAKAT, JSON.stringify(zakatList));

        logAuditOffline(currentUser.id, 'DONATION_RECORDED', `Mencatat donasi ${type} dari ${donorName} sebesar Rp${parseFloat(amount).toLocaleString('id-ID')}. Status: ${status}`);

        return {
          message: `Dana ${type} berhasil dicatat dengan status: ${status}`,
          donationId: id,
          status
        };
      }
    },

    approveZakat: async (donationId) => {
      if (isSupabaseMode) {
        await delay(250);
        
        const { data: donation, error: getError } = await supabaseClient
          .from('zakat_infaq')
          .select('*')
          .eq('id', donationId)
          .single();

        if (getError || !donation) throw new Error('Donasi tidak ditemukan.');
        if (donation.status === 'Tersalurkan') throw new Error('Donasi sudah berstatus Tersalurkan.');

        const now = new Date().toISOString();

        const { error: updateError } = await supabaseClient
          .from('zakat_infaq')
          .update({
            status: 'Tersalurkan',
            verified_by: currentUser.username,
            verified_at: now
          })
          .eq('id', donationId);

        if (updateError) throw updateError;

        await logAudit(currentUser.id, 'DONATION_APPROVED', `Menyetujui penyaluran dana ${donation.type} ID ${donationId} sebesar Rp${donation.amount.toLocaleString('id-ID')} (Verifikasi oleh ${currentUser.role}).`);

        return {
          message: 'Penyaluran zakat berhasil disetujui.',
          donation_id: donationId
        };
      }
      else if (isServerMode) {
        return await authorizedFetch('/api/zakat/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ donation_id: donationId })
        });
      } else {
        await delay(250);
        const zakatList = JSON.parse(localStorage.getItem(STORAGE_KEYS.ZAKAT)) || [];
        const idx = zakatList.findIndex(z => z.id === donationId);
        if (idx === -1) throw new Error('Donasi tidak ditemukan.');

        const donation = zakatList[idx];
        if (donation.status === 'Tersalurkan') throw new Error('Donasi sudah berstatus Tersalurkan.');

        donation.status = 'Tersalurkan';
        donation.verified_by = currentUser.username;
        donation.verified_at = new Date().toISOString();

        localStorage.setItem(STORAGE_KEYS.ZAKAT, JSON.stringify(zakatList));

        logAuditOffline(currentUser.id, 'DONATION_APPROVED', `Menyetujui penyaluran dana ${donation.type} ID ${donationId} sebesar Rp${donation.amount.toLocaleString('id-ID')} (Verifikasi oleh ${currentUser.role}).`);

        return {
          message: 'Penyaluran zakat berhasil disetujui.',
          donation_id: donationId
        };
      }
    },

    // 6. AUDIT
    getAuditLogs: async () => {
      if (isSupabaseMode) {
        await delay(150);
        const { data, error } = await supabaseClient
          .from('audit_logs')
          .select(`
            id,
            user_id,
            action,
            details,
            created_at,
            users (
              username,
              role
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(l => ({
          id: l.id,
          user_id: l.user_id,
          action: l.action,
          details: l.details,
          created_at: l.created_at,
          username: l.users ? l.users.username : 'Unknown',
          role: l.users ? l.users.role : 'N/A'
        }));
      }
      else if (isServerMode) {
        return await authorizedFetch('/api/audit/logs');
      } else {
        await delay(150);
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT)) || [];
      }
    }
  };
})();
window.API = API;
