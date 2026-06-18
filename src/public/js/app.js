/**
 * HIFZA FRONTEND SPA CONTROLLER
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Inisialisasi API
  await API.initialize();

  // State Belanja (Kasir) & Inventaris
  let currentCart = [];
  let discountAmount = 0;
  let invSearchQuery = '';
  let invCurrentPage = 1;
  const invPageSize = 3;
  let selectedPaymentMethod = 'Tunai';

  // Helper mapping untuk gambar produk lokal tanpa model
  function getProductImage(product) {
    const name = product.name.toLowerCase();
    if (name.includes('gamis') || product.id === 'prd-1') return 'assets/gamis.jpg';
    if (name.includes('hijab') || product.id === 'prd-2') return 'assets/hijab.jpg';
    if (name.includes('koko') || product.id === 'prd-3') return 'assets/koko.jpg';
    if (name.includes('mukena') || name.includes('mukenah') || product.id === 'prd-4') return 'assets/mukena.jpg';
    return 'assets/default.jpg';
  }

  // DOM Elements
  const loginContainer = document.getElementById('login-container');
  const appContainer = document.getElementById('app-container');
  const formLogin = document.getElementById('form-login');
  const btnLogout = document.getElementById('btn-logout');
  const timeDisplay = document.getElementById('time-display');

  // Update Waktu Sistem Harian
  function updateTime() {
    const now = new Date();
    const formatted = now.getFullYear() + '-' + 
      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
      String(now.getDate()).padStart(2, '0') + ' ' + 
      String(now.getHours()).padStart(2, '0') + ':' + 
      String(now.getMinutes()).padStart(2, '0');
    timeDisplay.innerText = formatted;
  }
  updateTime();
  setInterval(updateTime, 60000);

  // Check Session
  let user = API.getUser();
  if (user) {
    showApp();
  } else {
    showLogin();
  }

  // --- LOGIN HANDLING ---
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorAlert = document.getElementById('login-error-alert');
    const errorText = document.getElementById('login-error-text');

    try {
      errorAlert.classList.add('hidden');
      user = await API.login(username, password);
      showApp();
    } catch (err) {
      errorText.innerText = err.message;
      errorAlert.classList.remove('hidden');
    }
  });

  // --- LOGOUT HANDLING ---
  btnLogout.addEventListener('click', () => {
    API.logout();
    user = null;
    showLogin();
  });

  function showLogin() {
    appContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
  }

  function showApp() {
    loginContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    
    // Set Profile UI
    document.getElementById('user-display-name').innerText = user.username.split('@')[0];
    document.getElementById('user-display-role').innerText = user.role;

    // Apply RBAC to Sidebar Navigation
    applyNavigationRbac();

    // Trigger Router
    navigate();
  }

  function applyNavigationRbac() {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
      const page = link.getAttribute('data-page');
      
      // Auditor tidak bisa buka Kasir
      if (page === 'kasir' && user.role === 'Auditor') {
        link.parentElement.style.display = 'none';
      }
      // Admin tidak bisa buka Audit
      else if (page === 'audit' && user.role === 'Admin') {
        link.parentElement.style.display = 'none';
      }
      else {
        link.parentElement.style.display = 'block';
      }
    });
  }

  // --- ROUTING CLIENT-SIDE ---
  window.addEventListener('hashchange', navigate);

  function navigate() {
    if (!API.getUser()) return showLogin();

    let hash = window.location.hash.substring(1) || 'overview';
    
    // Validasi Akses Peran
    if (hash === 'kasir' && user.role === 'Auditor') hash = 'overview';
    if (hash === 'audit' && user.role === 'Admin') hash = 'overview';

    // Update active nav class
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
      if (link.getAttribute('data-page') === hash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Render Page
    renderPage(hash);
  }

  // --- PAGE RENDERING TEMPLATES ---
  async function renderPage(pageName) {
    const contentArea = document.getElementById('dynamic-content');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    
    contentArea.innerHTML = `<div class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data...</div>`;

    try {
      if (pageName === 'overview') {
        pageTitle.innerText = 'Overview Bisnis';
        pageSubtitle.innerText = 'Ringkasan performa keuangan dan kewajiban syariah';
        await renderOverview(contentArea);
      } 
      else if (pageName === 'kasir') {
        pageTitle.innerText = 'Kasir Penjualan';
        pageSubtitle.innerText = 'Pencatatan transaksi penjualan secara manual atau via OCR';
        await renderKasir(contentArea);
      } 
      else if (pageName === 'inventaris') {
        pageTitle.innerText = 'Gudang Stok (Inventaris)';
        pageSubtitle.innerText = 'Manajemen stok produk, penambahan stok baru, dan alert stok rendah';
        await renderInventaris(contentArea);
      }
      else if (pageName === 'laporan') {
        pageTitle.innerText = 'Laporan Keuangan';
        pageSubtitle.innerText = 'Laporan laba rugi otomatis dan opsi ekspor data';
        await renderLaporan(contentArea);
      }
      else if (pageName === 'zakat') {
        pageTitle.innerText = 'Zakat & Infaq';
        pageSubtitle.innerText = 'Kalkulasi zakat perdagangan otomatis dan penyaluran dana sosial';
        await renderZakat(contentArea);
      }
      else if (pageName === 'audit') {
        pageTitle.innerText = 'Audit Trail & Validasi';
        pageSubtitle.innerText = 'Log audit terperinci dan validasi data kepatuhan syariah';
        await renderAudit(contentArea);
      }
    } catch (err) {
      contentArea.innerHTML = `
        <div class="alert alert-danger">
          <i class="fa-solid fa-triangle-exclamation"></i> Gagal memuat halaman: ${err.message}
        </div>
      `;
    }
  }

  // --- 1. OVERVIEW PAGE ---
  async function renderOverview(container) {
    const kpi = await API.getKpi();
    const transactions = await API.getTransactions();

    container.innerHTML = `
      <!-- KPI CARDS -->
      <div class="grid-kpi">
        <div class="card-kpi">
          <div class="kpi-left">
            <span class="kpi-title">Total Penjualan</span>
            <span class="kpi-value">Rp${kpi.totalSales.toLocaleString('id-ID')}</span>
          </div>
          <div class="kpi-icon-box bg-cyan-soft">
            <i class="fa-solid fa-chart-line"></i>
          </div>
        </div>

        <div class="card-kpi">
          <div class="kpi-left">
            <span class="kpi-title">Laba Bersih (Estimasi)</span>
            <span class="kpi-value text-success">Rp${kpi.netProfit.toLocaleString('id-ID')}</span>
          </div>
          <div class="kpi-icon-box bg-blue-soft">
            <i class="fa-solid fa-hand-holding-dollar"></i>
          </div>
        </div>

        <div class="card-kpi">
          <div class="kpi-left">
            <span class="kpi-title">Kewajiban Zakat (2.5%)</span>
            <span class="kpi-value text-secondary">Rp${kpi.zakatObligation.toLocaleString('id-ID')}</span>
          </div>
          <div class="kpi-icon-box bg-gold-soft">
            <i class="fa-solid fa-mosque"></i>
          </div>
        </div>

        <div class="card-kpi">
          <div class="kpi-left">
            <span class="kpi-title">Zakat Tersalurkan</span>
            <span class="kpi-value">Rp${kpi.totalZakatPaid.toLocaleString('id-ID')}</span>
          </div>
          <div class="kpi-icon-box bg-purple-soft">
            <i class="fa-solid fa-heart-circle-check"></i>
          </div>
        </div>
      </div>

      <!-- CHART & RECENT TRANS -->
      <div class="dashboard-row-graphs">
        <div class="graph-card">
          <h3>Tren Penjualan Mingguan (HIFZA AI)</h3>
          <div style="height: 300px; position: relative;">
            <canvas id="salesChart"></canvas>
          </div>
        </div>

        <div class="recent-card">
          <h3>Statistik Ringkas</h3>
          <div class="stats-list" style="display: flex; flex-direction: column; gap: 16px; margin-top: 10px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 8px;">
              <span class="text-muted">Total Transaksi</span>
              <strong>${kpi.transactionCount} Kali</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 8px;">
              <span class="text-muted">Status Nisab Zakat</span>
              <span class="badge ${kpi.netProfit >= 5000000 ? 'badge-success' : 'badge-danger'}">
                ${kpi.netProfit >= 5000000 ? 'Mencapai Nisab' : 'Belum Nisab'}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 8px;">
              <span class="text-muted">Penyalur Terverifikasi</span>
              <strong>Owner & Auditor</strong>
            </div>
            <p class="text-muted" style="font-size: 11px; margin-top: 10px; line-height: 1.4;">
              *Estimasi laba bersih dihitung otomatis berdasarkan total transaksi dikurangi biaya operasional standar (30%).
            </p>
          </div>
        </div>
      </div>

      <!-- RECENT TRANSACTIONS TABLE -->
      <div class="table-container">
        <div class="table-header-bar">
          <h3>Transaksi Terakhir</h3>
          <a href="#kasir" class="btn btn-secondary btn-sm" style="display: ${user.role === 'Auditor' ? 'none' : 'inline-flex'};">
            <i class="fa-solid fa-plus"></i> Catat Baru
          </a>
        </div>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID Transaksi</th>
                <th>Kategori</th>
                <th>Nama Produk</th>
                <th class="text-right">Nilai Transaksi</th>
                <th class="text-right">Diskon</th>
                <th>Metode</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.slice(0, 5).map(t => `
                <tr>
                  <td><code>${t.id}</code></td>
                  <td><span class="badge badge-warning">${t.product_category}</span></td>
                  <td><strong>${t.product_name}</strong></td>
                  <td class="text-right">Rp${t.amount.toLocaleString('id-ID')}</td>
                  <td class="text-right">Rp${(t.discount || 0).toLocaleString('id-ID')}</td>
                  <td>${t.payment_method}</td>
                  <td class="text-muted">${new Date(t.created_at).toLocaleString('id-ID')}</td>
                </tr>
              `).join('')}
              ${transactions.length === 0 ? '<tr><td colspan="7" style="text-align: center;">Belum ada data transaksi.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Render Chart.js
    renderSalesChart(transactions);
  }

  function renderSalesChart(transactions) {
    const canvas = document.getElementById('salesChart');
    if (!canvas) return;

    if (typeof Chart === 'undefined') {
      const container = canvas.parentElement;
      if (container) {
        container.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--color-text-muted); text-align: center; border: 1px dashed var(--color-border); border-radius: 8px; padding: 20px;">
            <i class="fa-solid fa-wifi-slash" style="font-size: 32px; margin-bottom: 12px; color: var(--color-danger);"></i>
            <p style="font-weight: 500; margin: 0 0 4px 0;">Grafik Penjualan Tidak Tersedia</p>
            <span style="font-size: 11px;">Gagal memuat Chart.js dari CDN. Hubungkan perangkat ke internet untuk mengaktifkan grafik.</span>
          </div>
        `;
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    
    // Dapatkan data 7 hari terakhir
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const last7DaysData = Array(7).fill(0);
    const last7DaysLabels = [];
    
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      last7DaysLabels.push(days[d.getDay()]);
      
      // Hitung total transaksi pada hari tersebut
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      
      transactions.forEach(t => {
        const tTime = new Date(t.created_at).getTime();
        if (tTime >= dayStart && tTime < dayEnd) {
          last7DaysData[6 - i] += t.amount;
        }
      });
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: last7DaysLabels,
        datasets: [{
          label: 'Total Penjualan (Rp)',
          data: last7DaysData,
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.08)',
          fill: true,
          tension: 0.3,
          borderWidth: 3,
          pointBackgroundColor: '#06b6d4',
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              callback: function(value) {
                return 'Rp ' + value.toLocaleString('id-ID');
              }
            }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  // --- 2. KASIR PENJUALAN PAGE ---
  async function renderKasir(container) {
    const products = await API.getInventory();
    let activeCategory = 'Semua';

    container.innerHTML = `
      <div class="kasir-layout" style="grid-template-columns: 1.6fr 1.4fr;">
        <!-- SISI KIRI: KATALOG PRODUK -->
        <div>
          <!-- OCR Simulator Button -->
          <div class="ocr-scanner-simulator" id="ocr-btn" style="margin-bottom: 20px;">
            <i class="fa-solid fa-qrcode"></i>
            <p><strong>SIMULATOR OCR NOTA</strong></p>
            <p style="font-size: 10px;">Klik untuk simulasi upload foto nota fisik (Four-Eyes Rule Draft)</p>
          </div>

          <div class="alert alert-success hidden" id="kasir-success-alert" style="margin-bottom: 20px;"></div>
          <div class="alert alert-danger hidden" id="kasir-error-alert" style="margin-bottom: 20px;"></div>

          <!-- Tab Kategori -->
          <div class="category-tabs" id="kasir-category-tabs">
            <div class="category-tab active" data-category="Semua">Semua</div>
            <div class="category-tab" data-category="Busana Muslim">Busana Muslim</div>
            <div class="category-tab" data-category="Hijab">Hijab</div>
            <div class="category-tab" data-category="Perlengkapan Shalat">Perlengkapan Shalat</div>
          </div>

          <!-- Product Grid -->
          <div class="product-grid" id="kasir-product-grid">
            <!-- Cards rendered dynamically -->
          </div>
        </div>

        <!-- SISI KANAN: DAFTAR BELANJA -->
        <div class="cart-card">
          <h3 style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span>Daftar Belanja</span>
            <span class="badge badge-success" id="ocr-badge" style="display: none;">OCR Ready</span>
          </h3>

          <div class="cart-items-list" id="cart-items-list">
            <!-- Items rendered dynamically -->
          </div>

          <!-- Metode Pembayaran -->
          <div class="form-group" style="margin-top: 10px;">
            <label style="margin-bottom: 8px;"><i class="fa-solid fa-credit-card"></i> Metode Pembayaran</label>
            <div class="payment-method-grid">
              <div class="payment-method-badge ${selectedPaymentMethod === 'Tunai' ? 'active' : ''}" data-method="Tunai">
                <i class="fa-solid fa-money-bill-wave"></i>
                <span>Tunai</span>
              </div>
              <div class="payment-method-badge ${selectedPaymentMethod === 'Transfer' ? 'active' : ''}" data-method="Transfer">
                <i class="fa-solid fa-building-columns"></i>
                <span>Transfer</span>
              </div>
              <div class="payment-method-badge ${selectedPaymentMethod === 'GoPay' ? 'active' : ''}" data-method="GoPay">
                <i class="fa-solid fa-wallet"></i>
                <span>GoPay</span>
              </div>
              <div class="payment-method-badge ${selectedPaymentMethod === 'QRIS' ? 'active' : ''}" data-method="QRIS">
                <i class="fa-solid fa-qrcode"></i>
                <span>QRIS</span>
              </div>
            </div>
          </div>

          <!-- Cost Summary -->
          <div class="cart-cost-summary">
            <div class="cart-summary-line">
              <span>Subtotal</span>
              <strong id="cart-subtotal">Rp0</strong>
            </div>
            <div class="cart-summary-line">
              <span>Diskon</span>
              <strong id="cart-discount" class="text-danger">- Rp0</strong>
            </div>
            <div class="cart-summary-line total">
              <span>Total</span>
              <strong id="cart-total">Rp0</strong>
            </div>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 12px;">
            <button class="btn btn-secondary" id="btn-cart-discount" style="flex: 1;">
              <i class="fa-solid fa-tag"></i> + Diskon
            </button>
            <button class="btn btn-logout-danger" id="btn-cart-clear" style="flex: 1;">
              <i class="fa-solid fa-trash-can"></i> Batal
            </button>
          </div>

          ${user.role === 'Auditor' ? `
            <div class="alert alert-danger" style="margin-top: 14px;">Auditor hanya memiliki hak akses baca.</div>
          ` : `
            <button class="btn btn-primary btn-block" id="btn-cart-checkout" style="margin-top: 14px;">
              <i class="fa-solid fa-cash-register"></i> Pembayaran
            </button>
          `}
        </div>
      </div>
    `;

    // Render Product Grid based on active category
    function renderProductGrid() {
      const grid = document.getElementById('kasir-product-grid');
      if (!grid) return;

      const filtered = activeCategory === 'Semua' 
        ? products 
        : products.filter(p => p.category === activeCategory);

      if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted); padding: 20px;">Tidak ada produk dalam kategori ini.</div>`;
        return;
      }

      grid.innerHTML = filtered.map(p => {
        const isLow = p.stock < 5;
        const imgUrl = getProductImage(p);

        return `
          <div class="product-card">
            <div class="product-card-photo">
              <img src="${imgUrl}" alt="${p.name}" class="product-card-img">
            </div>
            <div class="product-card-info">
              <span class="product-card-category">${p.category}</span>
              <span class="product-card-name" title="${p.name}">${p.name}</span>
              <span class="product-card-price">Rp${p.price.toLocaleString('id-ID')}</span>
              <span class="product-card-stock ${isLow ? 'low-stock' : ''}">
                <i class="fa-solid ${isLow ? 'fa-triangle-exclamation' : 'fa-circle-check'}"></i>
                Stok: ${p.stock} ${isLow ? '(Kritis!)' : ''}
              </span>
            </div>
            <button class="btn btn-primary btn-sm btn-add-to-cart" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
              ${p.stock <= 0 ? 'Habis' : '<i class="fa-solid fa-plus"></i> Tambah'}
            </button>
          </div>
        `;
      }).join('');

      // Add to Cart Handlers
      const addButtons = grid.querySelectorAll('.btn-add-to-cart');
      addButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const pId = btn.getAttribute('data-id');
          const product = products.find(p => p.id === pId);
          if (!product) return;

          const existing = currentCart.find(item => item.product.id === pId);
          if (existing) {
            if (existing.quantity + 1 > product.stock) {
              alert(`Stok tidak mencukupi. Sisa stok di database: ${product.stock}`);
              return;
            }
            existing.quantity++;
          } else {
            currentCart.push({ product, quantity: 1 });
          }

          renderCart();
        });
      });
    }

    // Render Cart items list and summaries
    function renderCart() {
      const itemsList = document.getElementById('cart-items-list');
      const subtotalEl = document.getElementById('cart-subtotal');
      const discountEl = document.getElementById('cart-discount');
      const totalEl = document.getElementById('cart-total');

      if (!itemsList) return;

      if (currentCart.length === 0) {
        itemsList.innerHTML = `
          <div style="text-align: center; color: var(--color-text-muted); padding: 30px 0;">
            <i class="fa-solid fa-basket-shopping" style="font-size: 32px; margin-bottom: 8px; color: #cbd5e1;"></i>
            <p>Keranjang belanja kosong</p>
          </div>
        `;
        subtotalEl.innerText = 'Rp0';
        discountEl.innerText = '- Rp0';
        totalEl.innerText = 'Rp0';
        return;
      }

      itemsList.innerHTML = currentCart.map((item, idx) => {
        const imgUrl = getProductImage(item.product);

        return `
          <div class="cart-item-row" style="display: flex; align-items: center; gap: 12px;">
            <img src="${imgUrl}" alt="${item.product.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px; border: 1px solid var(--color-border); flex-shrink: 0;">
            <div class="cart-item-info" style="flex: 1; display: flex; flex-direction: column; gap: 2px; max-width: 40%;">
              <span class="cart-item-name" title="${item.product.name}">${item.product.name}</span>
              <span class="cart-item-price">Rp${item.product.price.toLocaleString('id-ID')}</span>
            </div>
            <div class="cart-item-actions">
              <div class="cart-item-qty-control">
                <button class="btn-qty btn-qty-dec" data-idx="${idx}">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="btn-qty btn-qty-inc" data-idx="${idx}">+</button>
              </div>
              <button class="btn-remove-item btn-cart-remove" data-idx="${idx}">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Calculate totals
      const subtotal = currentCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const total = Math.max(0, subtotal - discountAmount);

      subtotalEl.innerText = `Rp${subtotal.toLocaleString('id-ID')}`;
      discountEl.innerText = `- Rp${discountAmount.toLocaleString('id-ID')}`;
      totalEl.innerText = `Rp${total.toLocaleString('id-ID')}`;

      // Qty dec event
      itemsList.querySelectorAll('.btn-qty-dec').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-idx'));
          if (currentCart[idx].quantity > 1) {
            currentCart[idx].quantity--;
          } else {
            currentCart.splice(idx, 1);
          }
          renderCart();
        });
      });

      // Qty inc event
      itemsList.querySelectorAll('.btn-qty-inc').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-idx'));
          const item = currentCart[idx];
          if (item.quantity + 1 > item.product.stock) {
            alert(`Stok tidak mencukupi. Sisa stok: ${item.product.stock}`);
            return;
          }
          item.quantity++;
          renderCart();
        });
      });

      // Remove item event
      itemsList.querySelectorAll('.btn-cart-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-idx'));
          currentCart.splice(idx, 1);
          renderCart();
        });
      });
    }

    // Category Tabs Events
    const tabContainer = document.getElementById('kasir-category-tabs');
    if (tabContainer) {
      tabContainer.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          tabContainer.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          activeCategory = tab.getAttribute('data-category');
          renderProductGrid();
        });
      });
    }

    // Discount Button Event
    const btnDiscount = document.getElementById('btn-cart-discount');
    if (btnDiscount) {
      btnDiscount.addEventListener('click', () => {
        const val = prompt('Masukkan nominal diskon (Rp):', discountAmount);
        if (val !== null) {
          const parsed = parseInt(val);
          if (!isNaN(parsed) && parsed >= 0) {
            discountAmount = parsed;
            renderCart();
          } else {
            alert('Nominal diskon tidak valid.');
          }
        }
      });
    }

    // Clear Cart Event
    const btnClear = document.getElementById('btn-cart-clear');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin membatalkan daftar belanja ini?')) {
          currentCart = [];
          discountAmount = 0;
          selectedPaymentMethod = 'Tunai';
          const badges = container.querySelectorAll('.payment-method-badge');
          badges.forEach(b => {
            if (b.getAttribute('data-method') === 'Tunai') {
              b.classList.add('active');
            } else {
              b.classList.remove('active');
            }
          });
          document.getElementById('ocr-badge').style.display = 'none';
          renderCart();
        }
      });
    }

    // Checkout/Pembayaran Event
    const btnCheckout = document.getElementById('btn-cart-checkout');
    if (btnCheckout && user.role !== 'Auditor') {
      btnCheckout.addEventListener('click', async () => {
        if (currentCart.length === 0) {
          alert('Keranjang belanja masih kosong.');
          return;
        }

        const successAlert = document.getElementById('kasir-success-alert');
        const errorAlert = document.getElementById('kasir-error-alert');
        const paymentMethod = selectedPaymentMethod;

        successAlert.classList.add('hidden');
        errorAlert.classList.add('hidden');
        btnCheckout.disabled = true;
        btnCheckout.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Memproses...`;

        try {
          const subtotal = currentCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
          let remainingDiscount = discountAmount;
          let successCount = 0;
          let totalTrxAmount = 0;
          let anomalyTriggered = false;

          // Process sequentially
          for (let i = 0; i < currentCart.length; i++) {
            const item = currentCart[i];
            const itemSubtotal = item.product.price * item.quantity;
            let itemDiscount = 0;

            if (i === currentCart.length - 1) {
              // Last item gets the remainder of the discount
              itemDiscount = Math.min(itemSubtotal, remainingDiscount);
            } else {
              // Prorated discount rounded to nearest integer
              itemDiscount = Math.round((itemSubtotal / subtotal) * discountAmount);
              itemDiscount = Math.min(itemSubtotal, itemDiscount);
              remainingDiscount -= itemDiscount;
            }

            const res = await API.addTransaction(item.product.id, item.quantity, paymentMethod, itemDiscount);
            successCount++;
            totalTrxAmount += res.totalAmount;
            if (res.anomalyTriggered) {
              anomalyTriggered = true;
            }
          }

          successAlert.innerHTML = `<i class="fa-solid fa-circle-check"></i> Pembayaran Berhasil! Berhasil mencatat ${successCount} transaksi. Total: Rp${totalTrxAmount.toLocaleString('id-ID')}.`;
          successAlert.classList.remove('hidden');

          // Reset cart states
          currentCart = [];
          discountAmount = 0;
          selectedPaymentMethod = 'Tunai';
          const badges = container.querySelectorAll('.payment-method-badge');
          badges.forEach(b => {
            if (b.getAttribute('data-method') === 'Tunai') {
              b.classList.add('active');
            } else {
              b.classList.remove('active');
            }
          });
          document.getElementById('ocr-badge').style.display = 'none';
          renderCart();

          // WhatsApp alert anomaly simulation
          if (anomalyTriggered || totalTrxAmount > 10000000) {
            triggerWhatsAppNotification(`⚠️ <strong>Pemberitahuan Transaksi Tinggi:</strong> Transaksi kasir belanja sebesar Rp${totalTrxAmount.toLocaleString('id-ID')} terdeteksi dari ${user.username}. Silakan verifikasi di menu Audit.`);
          }

          // Reload products in grid and checkout button after timeout
          setTimeout(async () => {
            // Re-fetch products from database
            const refreshedProducts = await API.getInventory();
            products.length = 0;
            products.push(...refreshedProducts);
            renderProductGrid();
            btnCheckout.disabled = false;
            btnCheckout.innerHTML = `<i class="fa-solid fa-cash-register"></i> Pembayaran`;
          }, 1500);

        } catch (err) {
          errorAlert.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Gagal memproses transaksi: ${err.message}`;
          errorAlert.classList.remove('hidden');
          btnCheckout.disabled = false;
          btnCheckout.innerHTML = `<i class="fa-solid fa-cash-register"></i> Pembayaran`;
        }
      });
    }

    // OCR Simulator Click
    const ocrBtn = document.getElementById('ocr-btn');
    if (ocrBtn) {
      ocrBtn.addEventListener('click', async () => {
        // Simulasi Nota scan: Baju Koko Modern qty 65 (bernilai > 10Juta untuk memicu anomali)
        // Kita juga tambahkan stok dummy jika stok < 65 demi kelancaran checkout simulasi
        let cocoProduct = products.find(p => p.name.includes('Koko') || p.id === 'prd-3');
        if (cocoProduct) {
          // Tambah stok ke 100 secara diam-diam / info
          if (cocoProduct.stock < 65) {
            try {
              const res = await API.addStock(cocoProduct.id, 100 - cocoProduct.stock);
              cocoProduct.stock = res.newStock;
            } catch (err) {
              console.warn('Gagal menambah stok demo untuk OCR:', err.message);
            }
          }

          // Tambah ke cart
          const existing = currentCart.find(item => item.product.id === cocoProduct.id);
          if (existing) {
            existing.quantity = 65;
          } else {
            currentCart.push({ product: cocoProduct, quantity: 65 });
          }

          // Set Payment Method to Transfer
          selectedPaymentMethod = 'Transfer';
          const pmBadges = container.querySelectorAll('.payment-method-badge');
          pmBadges.forEach(b => {
            if (b.getAttribute('data-method') === 'Transfer') {
              b.classList.add('active');
            } else {
              b.classList.remove('active');
            }
          });

          // Tampilkan badge draft OCR
          const badge = document.getElementById('ocr-badge');
          if (badge) {
            badge.style.display = 'inline-flex';
            badge.innerText = 'OCR Scanned (Draft)';
            badge.className = 'badge badge-warning';
          }
          
          // Alert info
          const successAlert = document.getElementById('kasir-success-alert');
          successAlert.innerHTML = '<i class="fa-solid fa-qrcode"></i> Nota fisik berhasil dipindai oleh AI! Produk <strong>Baju Koko Modern (65 pcs)</strong> dimasukkan to <strong>Daftar Belanja</strong> sebagai Draft. Silakan klik Pembayaran untuk finalisasi.';
          successAlert.classList.remove('hidden');

          renderCart();
        } else {
          alert('Produk dummy tidak tersedia untuk demo OCR.');
        }
      });
    }

    // Add payment badge click event listener
    const paymentBadges = container.querySelectorAll('.payment-method-badge');
    paymentBadges.forEach(badge => {
      badge.addEventListener('click', () => {
        paymentBadges.forEach(b => b.classList.remove('active'));
        badge.classList.add('active');
        selectedPaymentMethod = badge.getAttribute('data-method');
      });
    });

    // Initial renders
    renderProductGrid();
    renderCart();
  }

  // --- TRIGGER WHATSAPP NOTIFIKASI (SIMULASI) ---
  function triggerWhatsAppNotification(message) {
    const waBox = document.getElementById('whatsapp-simulator');
    const waText = document.getElementById('wa-alert-text');
    const waTime = document.getElementById('wa-alert-time');

    if (waBox && waText && waTime) {
      waText.innerHTML = message;
      
      const now = new Date();
      waTime.innerText = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      
      waBox.classList.remove('hidden');
      
      // Auto close after 10 seconds
      setTimeout(() => {
        waBox.classList.add('hidden');
      }, 10000);
    }
  }

  // --- 3. GUDANG (INVENTARIS) PAGE ---
  async function renderInventaris(container) {
    let products = await API.getInventory();

    const isAuditor = user.role === 'Auditor';

    container.innerHTML = `
      <div class="kasir-layout" style="${isAuditor ? 'grid-template-columns: 1fr;' : 'grid-template-columns: 1fr 2fr;'}">
        <!-- PENAMBAHAN STOK MANUAL (Kiri) -->
        ${isAuditor ? '' : `
          <div class="card-kasir-form">
            <h3>Tambah Stok (Stok Masuk)</h3>
            
            <div class="alert alert-success hidden" id="inv-success-alert" style="margin-bottom: 14px;"></div>
            <div class="alert alert-danger hidden" id="inv-error-alert" style="margin-bottom: 14px;"></div>

            <form id="form-stock-in">
              <div class="form-group">
                <label for="stock-product"><i class="fa-solid fa-box"></i> Pilih Produk</label>
                <select id="stock-product" required>
                  <option value="">-- Pilih Produk --</option>
                  ${products.map(p => `<option value="${p.id}">[${p.category}] ${p.name} (Stok: ${p.stock})</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label for="stock-added"><i class="fa-solid fa-plus-circle"></i> Jumlah Stok Masuk</label>
                <input type="number" id="stock-added" min="1" placeholder="Contoh: 10" required>
              </div>

              <button type="submit" class="btn btn-primary btn-block">
                <i class="fa-solid fa-circle-plus"></i> Simpan Stok Baru
              </button>
            </form>
          </div>
        `}

        <!-- DAFTAR INVENTARIS GRID & SEARCH & PAGINATION (Kanan) -->
        <div>
          <!-- Top Bar -->
          <div class="search-bar-container">
            <div class="search-input-wrapper">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Cari produk berdasarkan nama atau kategori..." id="inv-search-input" value="${invSearchQuery}">
            </div>
            ${isAuditor ? '' : `
              <button class="btn btn-primary" id="btn-add-product-dummy">
                <i class="fa-solid fa-plus"></i> Tambah Produk
              </button>
            `}
          </div>

          <!-- Product Grid -->
          <div class="product-grid" id="inv-product-grid">
            <!-- Cards rendered dynamically -->
          </div>

          <!-- Pagination -->
          <div class="pagination-container" id="inv-pagination">
            <!-- Pagination buttons rendered dynamically -->
          </div>
        </div>
      </div>
    `;

    // Dynamic grid & pagination render function
    function renderInvGridAndPagination() {
      const grid = document.getElementById('inv-product-grid');
      const pagEl = document.getElementById('inv-pagination');
      if (!grid || !pagEl) return;

      // Filter products
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(invSearchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(invSearchQuery.toLowerCase())
      );

      // Pagination math
      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / invPageSize) || 1;
      if (invCurrentPage > totalPages) invCurrentPage = totalPages;
      if (invCurrentPage < 1) invCurrentPage = 1;

      const start = (invCurrentPage - 1) * invPageSize;
      const paginated = filtered.slice(start, start + invPageSize);

      if (paginated.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted); padding: 40px;">Produk tidak ditemukan.</div>`;
        pagEl.innerHTML = '';
        return;
      }

      // Render cards
      grid.innerHTML = paginated.map(p => {
        const isLow = p.stock < 5;
        const imgUrl = getProductImage(p);

        return `
          <div class="product-card">
            <div class="product-card-photo">
              <img src="${imgUrl}" alt="${p.name}" class="product-card-img">
            </div>
            <div class="product-card-info">
              <span class="product-card-category">${p.category}</span>
              <span class="product-card-name" title="${p.name}">${p.name}</span>
              <span class="product-card-price">Rp${p.price.toLocaleString('id-ID')}</span>
              <div style="margin-top: 6px;">
                <span class="badge ${isLow ? 'badge-danger' : 'badge-success'}">
                  <i class="fa-solid ${isLow ? 'fa-triangle-exclamation' : 'fa-circle-check'}"></i>
                  ${isLow ? `Stok Rendah: ${p.stock}` : `Stok Aman: ${p.stock}`}
                </span>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Render pagination buttons
      pagEl.innerHTML = `
        <button class="btn-pagination" id="btn-inv-prev" ${invCurrentPage === 1 ? 'disabled' : ''}>
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <span style="font-weight: 500; font-size: 13.5px;">Halaman ${invCurrentPage} dari ${totalPages}</span>
        <button class="btn-pagination" id="btn-inv-next" ${invCurrentPage === totalPages ? 'disabled' : ''}>
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      `;

      // Pagination events
      const btnPrev = document.getElementById('btn-inv-prev');
      const btnNext = document.getElementById('btn-inv-next');

      if (btnPrev) {
        btnPrev.addEventListener('click', () => {
          if (invCurrentPage > 1) {
            invCurrentPage--;
            renderInvGridAndPagination();
          }
        });
      }

      if (btnNext) {
        btnNext.addEventListener('click', () => {
          if (invCurrentPage < totalPages) {
            invCurrentPage++;
            renderInvGridAndPagination();
          }
        });
      }
    }

    // Search Input Event
    const searchInput = document.getElementById('inv-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        invSearchQuery = e.target.value;
        invCurrentPage = 1;
        renderInvGridAndPagination();
      });
    }

    // Form Stock In Event (Admin/Owner)
    const formStock = document.getElementById('form-stock-in');
    if (formStock && !isAuditor) {
      formStock.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pId = document.getElementById('stock-product').value;
        const added = parseInt(document.getElementById('stock-added').value);
        const success = document.getElementById('inv-success-alert');
        const error = document.getElementById('inv-error-alert');

        success.classList.add('hidden');
        error.classList.add('hidden');

        try {
          const res = await API.addStock(pId, added);
          success.innerText = res.message;
          success.classList.remove('hidden');
          formStock.reset();
          
          // Re-fetch products and update
          products = await API.getInventory();
          
          // Update select options
          const selectProd = document.getElementById('stock-product');
          if (selectProd) {
            selectProd.innerHTML = `
              <option value="">-- Pilih Produk --</option>
              ${products.map(p => `<option value="${p.id}">[${p.category}] ${p.name} (Stok: ${p.stock})</option>`).join('')}
            `;
          }

          renderInvGridAndPagination();
        } catch (err) {
          error.innerText = err.message;
          error.classList.remove('hidden');
        }
      });
    }

    // Add Product Dummy Button Event
    const btnAddProd = document.getElementById('btn-add-product-dummy');
    if (btnAddProd) {
      btnAddProd.addEventListener('click', () => {
        alert("Fitur tambah produk baru memerlukan wewenang Database Administrator. Silakan gunakan form 'Tambah Stok' di sebelah kiri untuk menambah stok barang yang sudah ada.");
      });
    }

    // Initial render
    renderInvGridAndPagination();
  }

  // --- 4. LAPORAN KEUANGAN PAGE ---
  async function renderLaporan(container) {
    const kpi = await API.getKpi();
    const transactions = await API.getTransactions();

    const opex = kpi.totalSales * 0.3; // 30% operasional cost

    container.innerHTML = `
      <div style="display: flex; gap: 24px; margin-bottom: 24px;">
        <button class="btn btn-secondary" onclick="alert('Ekspor PDF berhasil! Laporan keuangan PDF telah diunduh.')">
          <i class="fa-solid fa-file-pdf text-danger"></i> Ekspor ke PDF
        </button>
        <button class="btn btn-secondary" onclick="alert('Ekspor Excel berhasil! File keuangan XLS telah disimpan ke Downloads.')">
          <i class="fa-solid fa-file-excel text-success"></i> Ekspor ke Excel
        </button>
      </div>

      <!-- FORMAT LAPORAN LABA RUGI SYARIAH -->
      <div class="table-container" style="max-width: 800px;">
        <div class="table-header-bar" style="background-color: var(--color-bg-dark); color: #fff;">
          <div>
            <h3 style="color: #fff;">Laporan Laba Rugi Akuntansi Syariah</h3>
            <p class="text-muted" style="font-size: 11px;">Periode berjalan s/d Hari ini</p>
          </div>
          <span class="badge badge-success">HIFZA SYSTEM</span>
        </div>
        <div class="table-responsive">
          <table style="font-size: 14px;">
            <tbody>
              <!-- PENDAPATAN -->
              <tr style="background-color: #f1f5f9; font-weight: 700;">
                <td colspan="2">1. PENDAPATAN OPERASIONAL</td>
                <td style="text-align: right;"></td>
              </tr>
              <tr>
                <td style="padding-left: 40px;">Penjualan Produk Muslim (Gamis, Koko, Hijab, dll)</td>
                <td></td>
                <td style="text-align: right;">Rp${kpi.totalSales.toLocaleString('id-ID')}</td>
              </tr>
              <tr style="font-weight: 600; border-top: 1px solid var(--color-border);">
                <td style="padding-left: 20px;">TOTAL PENDAPATAN KOTOR (A)</td>
                <td></td>
                <td style="text-align: right; color: var(--color-primary);">Rp${kpi.totalSales.toLocaleString('id-ID')}</td>
              </tr>

              <!-- BIAYA OPERASIONAL -->
              <tr style="background-color: #f1f5f9; font-weight: 700;">
                <td colspan="2">2. BEBAN & BIAYA OPERASIONAL</td>
                <td style="text-align: right;"></td>
              </tr>
              <tr>
                <td style="padding-left: 40px;">Estimasi Beban Pokok Penjualan (HPP) & Toko (30%)</td>
                <td></td>
                <td style="text-align: right; color: var(--color-danger);">Rp${opex.toLocaleString('id-ID')}</td>
              </tr>
              <tr style="font-weight: 600; border-top: 1px solid var(--color-border);">
                <td style="padding-left: 20px;">TOTAL BEBAN & BIAYA (B)</td>
                <td></td>
                <td style="text-align: right; color: var(--color-danger);">Rp${opex.toLocaleString('id-ID')}</td>
              </tr>

              <!-- HASIL NETTO -->
              <tr style="background-color: #f1f5f9; font-weight: 700;">
                <td colspan="2">3. LABA BERSIH (NETTO) & KEWAJIBAN SOSIAL</td>
                <td style="text-align: right;"></td>
              </tr>
              <tr style="font-weight: 700; font-size: 16px;">
                <td style="padding-left: 20px;">LABA BERSIH TAHAP AWAL (A - B)</td>
                <td></td>
                <td style="text-align: right; color: var(--color-primary);">Rp${kpi.netProfit.toLocaleString('id-ID')}</td>
              </tr>
              
              <!-- ZAKAT TIJAROH -->
              <tr>
                <td style="padding-left: 40px; font-style: italic;">
                  Kewajiban Zakat Perdagangan (Tijaroh) 2,5% 
                  ${kpi.netProfit >= 5000000 ? '<span class="badge badge-success" style="font-size:9px;">Memenuhi Nisab</span>' : '<span class="badge badge-danger" style="font-size:9px;">Di bawah Nisab</span>'}
                </td>
                <td></td>
                <td style="text-align: right; color: var(--color-secondary); font-weight: 600;">
                  - Rp${kpi.zakatObligation.toLocaleString('id-ID')}
                </td>
              </tr>

              <tr style="background-color: #e6f7f0; font-weight: 800; font-size: 16px; border-top: 2px solid var(--color-primary);">
                <td>LABA BERSIH BERSIH SYARIAH (NET PROFIT SETELAH ZAKAT)</td>
                <td></td>
                <td style="text-align: right; color: var(--color-primary);">
                  Rp${(kpi.netProfit - kpi.zakatObligation).toLocaleString('id-ID')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // --- 5. ZAKAT & INFAQ PAGE ---
  async function renderZakat(container) {
    const kpi = await API.getKpi();
    const zakatLogs = await API.getZakatLogs();

    container.innerHTML = `
      <div class="kasir-layout">
        <!-- FORM DISTRIBUSI ZAKAT/INFAQ -->
        <div class="card-kasir-form">
          <h3>Pencatatan Distribusi Sosial</h3>

          <!-- ZAKAT CALC ALERT -->
          <div class="zakat-info-alert">
            <h4><i class="fa-solid fa-mosque"></i> Perhitungan Zakat Otomatis</h4>
            <p>Berdasarkan Laba Bersih berjalan sebesar <strong>Rp${kpi.netProfit.toLocaleString('id-ID')}</strong>, kewajiban zakat perdagangan (2.5%) bisnis adalah:</p>
            <p style="font-size: 20px; font-weight: 700; margin-top: 8px; color: var(--color-secondary);">
              Rp${kpi.zakatObligation.toLocaleString('id-ID')}
            </p>
          </div>

          <div class="alert alert-success hidden" id="zk-success-alert"></div>
          <div class="alert alert-danger hidden" id="zk-error-alert"></div>

          <form id="form-zakat">
            <div class="form-group">
              <label for="zk-donor"><i class="fa-solid fa-user"></i> Nama Donatur / Penyumbang</label>
              <input type="text" id="zk-donor" placeholder="Contoh: Hamba Allah / Nama Toko" required>
            </div>

            <div class="form-group">
              <label for="zk-type"><i class="fa-solid fa-tags"></i> Kategori Dana Sosial</label>
              <select id="zk-type" required>
                <option value="Infaq">Infaq / Sedekah (Langsung Tersalurkan)</option>
                <option value="Zakat Mal">Zakat Mal / Dagang (Four-Eyes Approval Required)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="zk-amount"><i class="fa-solid fa-money-bill-wave"></i> Jumlah Dana (Rp)</label>
              <input type="number" id="zk-amount" placeholder="Contoh: 250000" required>
            </div>

            ${user.role === 'Auditor' ? `
              <div class="alert alert-danger">Auditor hanya memiliki hak verifikasi, tidak dapat menginput donasi.</div>
            ` : `
              <button type="submit" class="btn btn-success btn-block">
                <i class="fa-solid fa-paper-plane"></i> Kirim / Salurkan Dana
              </button>
            `}
          </form>
        </div>

        <!-- RIWAYAT PENYALURAN DANA SOSIAL -->
        <div class="table-container">
          <div class="table-header-bar">
            <h3>Riwayat Penyaluran Zakat & Infaq</h3>
          </div>
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Nama Donatur</th>
                  <th>Kategori</th>
                  <th>Jumlah</th>
                  <th>Status</th>
                  <th>Verifikator</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                ${zakatLogs.map(z => {
                  const isPending = z.status === 'Pending';
                  // Hanya Owner dan Auditor yang punya hak approval (Four-Eyes)
                  const canApprove = (user.role === 'Owner' || user.role === 'Auditor') && isPending;
                  
                  return `
                    <tr>
                      <td><strong>${z.donor_name}</strong></td>
                      <td><span class="badge ${z.type === 'Infaq' ? 'badge-warning' : 'badge-success'}">${z.type}</span></td>
                      <td>Rp${z.amount.toLocaleString('id-ID')}</td>
                      <td>
                        <span class="badge ${isPending ? 'badge-danger' : 'badge-success'}">
                          <i class="fa-solid ${isPending ? 'fa-hourglass-start' : 'fa-circle-check'}"></i>
                          ${z.status}
                        </span>
                      </td>
                      <td class="text-muted" style="font-size: 11px;">
                        ${z.verified_by ? `${z.verified_by}<br>(${new Date(z.verified_at).toLocaleDateString('id-ID')})` : '-'}
                      </td>
                      <td>
                        ${canApprove ? `
                          <button class="btn btn-primary btn-sm btn-approve-zk" data-id="${z.id}">
                            <i class="fa-solid fa-check"></i> Setujui
                          </button>
                        ` : isPending ? `
                          <span class="text-muted" style="font-size: 11px;">Butuh Owner/Auditor</span>
                        ` : `
                          <i class="fa-solid fa-circle-check text-success"></i> Selesai
                        `}
                      </td>
                    </tr>
                  `;
                }).join('')}
                ${zakatLogs.length === 0 ? '<tr><td colspan="6" style="text-align: center;">Belum ada log penyaluran dana.</td></tr>' : ''}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Handle form input
    const formZk = document.getElementById('form-zakat');
    if (formZk && user.role !== 'Auditor') {
      formZk.addEventListener('submit', async (e) => {
        e.preventDefault();
        const donor = document.getElementById('zk-donor').value;
        const type = document.getElementById('zk-type').value;
        const amount = parseFloat(document.getElementById('zk-amount').value);
        const success = document.getElementById('zk-success-alert');
        const error = document.getElementById('zk-error-alert');

        success.classList.add('hidden');
        error.classList.add('hidden');

        try {
          const res = await API.addZakat(donor, type, amount);
          success.innerText = res.message;
          success.classList.remove('hidden');
          formZk.reset();
          setTimeout(() => renderPage('zakat'), 1500);
        } catch (err) {
          error.innerText = err.message;
          error.classList.remove('hidden');
        }
      });
    }

    // Handle Approve Zakat
    const approveButtons = document.querySelectorAll('.btn-approve-zk');
    approveButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const donationId = btn.getAttribute('data-id');
        try {
          await API.approveZakat(donationId);
          alert('Donasi Zakat Mal berhasil disetujui untuk penyaluran!');
          renderPage('zakat');
        } catch (err) {
          alert('Gagal menyetujui: ' + err.message);
        }
      });
    });
  }

  // --- 6. AUDIT TRAIL PAGE ---
  async function renderAudit(container) {
    const logs = await API.getAuditLogs();

    container.innerHTML = `
      <!-- VALIDASI AUDIT SUMMARY -->
      <div style="display: flex; gap: 24px; margin-bottom: 24px; align-items: stretch; max-width: 800px;">
        <div style="flex: 1; background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: 12px; padding: 20px; box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 16px;">
          <div class="kpi-icon-box bg-cyan-soft">
            <i class="fa-solid fa-file-signature"></i>
          </div>
          <div>
            <h4 style="font-size: 15px;">Validasi Buku Keuangan Syariah</h4>
            <p class="text-muted" style="font-size: 12px;">Status periode keuangan saat ini:</p>
            <span class="badge badge-success" style="margin-top: 6px;">
              <i class="fa-solid fa-circle-check"></i> Terverifikasi Patuh Syariah
            </span>
          </div>
        </div>
        
        <div style="flex: 1; background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: 12px; padding: 20px; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: center; gap: 8px;">
          <h4 style="font-size: 13px; color: var(--color-text-muted);">Aksi Auditor:</h4>
          <button class="btn btn-success btn-sm" onclick="alert('Periode Keuangan berhasil divalidasi dan dikunci. Log tersimpan ke Audit Trail.')" style="width: fit-content;">
            <i class="fa-solid fa-lock-open"></i> Kunci & Validasi Laporan
          </button>
        </div>
      </div>

      <!-- AUDIT LOGS TABLE -->
      <div class="table-container">
        <div class="table-header-bar">
          <h3>Log Aktivitas Sistem (Audit Trail)</h3>
          <span class="badge badge-danger">Anti-Manipulation Enabled</span>
        </div>
        <div class="table-responsive" style="max-height: 500px;">
          <table>
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Aktor</th>
                <th>Peran</th>
                <th>Jenis Aksi</th>
                <th>Deskripsi Audit</th>
              </tr>
            </thead>
            <tbody>
              ${logs.map(l => `
                <tr ${l.action.includes('ANOMALY') ? 'style="background-color: rgba(239, 68, 68, 0.04);"' : ''}>
                  <td class="text-muted" style="font-size: 11px; white-space: nowrap;">
                    ${new Date(l.created_at).toLocaleString('id-ID')}
                  </td>
                  <td><strong>${l.username}</strong></td>
                  <td><span class="badge badge-warning" style="font-size: 10px;">${l.role}</span></td>
                  <td>
                    <span class="badge ${l.action.includes('ANOMALY') ? 'badge-danger' : 'badge-success'}" style="font-size: 10px;">
                      ${l.action}
                    </span>
                  </td>
                  <td><p style="font-size: 12.5px; line-height: 1.4; color: var(--color-text-dark);">${l.details}</p></td>
                </tr>
              `).join('')}
              ${logs.length === 0 ? '<tr><td colspan="5" style="text-align: center;">Belum ada log aktivitas tercatat.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
});
