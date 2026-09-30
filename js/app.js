/**
 * app.js
 * ---------------------------------------------------------------------------
 * PRESENTATION LAYER (Client / Browser Tier)
 * Bertanggung jawab atas: kontrol DOM, rendering dinamis, penanganan UI States,
 * filter kategori, modal universal, dan pengiriman form asinkron.
 * Modul ini TIDAK tahu dari mana data berasal — ia hanya memanggil ApiService.
 * ---------------------------------------------------------------------------
 */
 
const App = {
 
  state: {
    projects: [],
    services: [],
    activeFilter: 'all'
  },
 
  /* =========================================================================
     INISIALISASI
     ========================================================================= */
  async init() {
    this.renderOrderBadge();
    this.attachFormListener();
 
    await Promise.all([
      this.loadProfile(),
      this.loadProjects(),
      this.loadServices()
    ]);
  },
 
  /* =========================================================================
     SANITASI — Pertahanan Lapis Pertama terhadap DOM-based XSS
     Setiap nilai dinamis dari JSON (yang berasal dari luar) WAJIB melewati
     fungsi ini sebelum dirender via innerHTML, agar karakter <script> dsb.
     tidak dieksekusi sebagai HTML sungguhan.
     ========================================================================= */
  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = String(str ?? '');
    return div.innerHTML;
  },
 
  /* =========================================================================
     PROFILE — render Hero Section secara dinamis dari profile.json
     ========================================================================= */
  async loadProfile() {
    const container = document.getElementById('profileContainer');
    try {
      const profile = await ApiService.getProfile();
      container.innerHTML = `
        <div class="col-lg-4 text-center">
          <div class="avatar-wrap">
            <img src="${this.escapeHTML(profile.avatar)}" alt="Foto Profil ${this.escapeHTML(profile.name)}" class="avatar-img">
            <span class="status-badge"><i class="bi bi-check-circle-fill"></i> ${this.escapeHTML(profile.status)}</span>
          </div>
        </div>
        <div class="col-lg-8">
          <span class="badge role-badge mb-3"><i class="bi bi-mortarboard-fill me-1"></i> ${this.escapeHTML(profile.class)}</span>
          <h1 class="hero-name">${this.escapeHTML(profile.name)}</h1>
          <p class="hero-role">${this.escapeHTML(profile.role)}</p>
          <p class="hero-bio">${this.escapeHTML(profile.bio)}</p>
          <h2 class="section-subtitle">Keahlian Utama</h2>
          <ul class="skills-list">
            ${profile.skills.map(s => `<li class="skill-tag">${this.escapeHTML(s)}</li>`).join('')}
          </ul>
          <div class="hero-actions mt-4">
            <a href="#portofolio" class="btn btn-brand">Lihat Portofolio</a>
            <a href="#kontak" class="btn btn-outline-brand">Hubungi Saya</a>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            Gagal memuat data profil. Silakan muat ulang halaman.
          </div>
        </div>`;
    }
  },
 
  /* =========================================================================
     PROJECTS — Loading / Success / Empty / Error State
     ========================================================================= */
  async loadProjects() {
    const grid = document.getElementById('projectsGrid');
    this.renderSkeleton(grid, 4); // 1. LOADING STATE
 
    try {
      const data = await ApiService.getProjects();
      this.state.projects = data;
      this.renderFilters(data);
      this.renderProjects(data); // 2. SUCCESS STATE (atau EMPTY jika data = [])
    } catch (err) {
      // 3. ERROR STATE — alert defensif, bukan halaman putih kosong
      grid.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger d-flex align-items-center gap-2" role="alert">
            <i class="bi bi-wifi-off fs-4"></i>
            <div>
              Gagal memuat data proyek dari server. Periksa koneksi internet Anda.
              <button class="btn btn-sm btn-outline-danger ms-2" onclick="App.loadProjects()">Coba Lagi</button>
            </div>
          </div>
        </div>`;
    }
  },
 
  renderSkeleton(container, count) {
    container.innerHTML = Array.from({ length: count }).map(() => `
      <div class="col">
        <div class="card project-card h-100 shadow-sm border-0 skeleton-card">
          <div class="skeleton-img"></div>
          <div class="card-body">
            <div class="skeleton-line w-50 mb-2"></div>
            <div class="skeleton-line w-75 mb-2"></div>
            <div class="skeleton-line w-100"></div>
          </div>
        </div>
      </div>
    `).join('');
  },
 
  renderFilters(projects) {
    const filterBar = document.getElementById('filterBar');
    const categories = ['all', ...new Set(projects.map(p => p.category))];
    filterBar.innerHTML = categories.map(cat => `
      <button type="button"
              class="btn btn-sm filter-btn ${cat === this.state.activeFilter ? 'active' : ''}"
              data-category="${cat}">
        ${cat === 'all' ? 'Semua' : this.escapeHTML(cat)}
      </button>
    `).join('');
 
    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.activeFilter = btn.dataset.category;
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderProjects(this.state.projects);
      });
    });
  },
 
  renderProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    const filtered = this.state.activeFilter === 'all'
      ? projects
      : projects.filter(p => p.category === this.state.activeFilter);
 
    // 4. EMPTY STATE — filter menghasilkan 0 item
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-12">
          <div class="empty-state text-center py-5">
            <i class="bi bi-inbox fs-1 text-muted"></i>
            <p class="text-muted mt-2 mb-0">Belum ada proyek pada kategori ini.</p>
          </div>
        </div>`;
      return;
    }
 
    grid.innerHTML = filtered.map(proj => `
      <div class="col">
        <div class="card project-card h-100 shadow-sm border-0 overflow-hidden">
          <img src="${this.escapeHTML(proj.thumbnail)}" class="card-img-top" alt="${this.escapeHTML(proj.title)}">
          <div class="card-body d-flex flex-column">
            <span class="badge tech-badge align-self-start mb-2">${this.escapeHTML(proj.tags[0] ?? proj.category)}</span>
            <h5 class="card-title fw-bold">${this.escapeHTML(proj.title)}</h5>
            <p class="card-text text-muted small flex-grow-1">${this.escapeHTML(proj.description)}</p>
            <button class="btn btn-outline-brand btn-sm w-100 mt-2" data-project-id="${proj.id}">
              Lihat Detail
            </button>
          </div>
        </div>
      </div>
    `).join('');
 
    // Event delegation: satu listener untuk seluruh tombol "Lihat Detail"
    grid.querySelectorAll('[data-project-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openProjectModal(Number(btn.dataset.projectId));
      });
    });
  },
 
  /* =========================================================================
     UNIVERSAL DYNAMIC MODAL — 1 elemen modal untuk SEMUA proyek
     ========================================================================= */
  openProjectModal(projectId) {
    const proj = this.state.projects.find(p => p.id === projectId);
    if (!proj) return;
 
    document.getElementById('projectModalTitle').textContent = proj.title;
    document.getElementById('projectModalBody').innerHTML = `
      <img src="${this.escapeHTML(proj.thumbnail)}" class="img-fluid rounded mb-3 w-100" alt="${this.escapeHTML(proj.title)}">
      <p class="text-secondary">${this.escapeHTML(proj.description)}</p>
      <div class="d-flex flex-wrap gap-2 mb-3">
        ${proj.tags.map(t => `<span class="badge tech-badge">${this.escapeHTML(t)}</span>`).join('')}
      </div>
      <div class="row g-2 text-center metric-box">
        <div class="col-6">
          <div class="metric-value">${this.escapeHTML(proj.metrics.performance)}%</div>
          <div class="metric-label">Performance</div>
        </div>
        <div class="col-6">
          <div class="metric-value">${this.escapeHTML(proj.metrics.accessibility)}%</div>
          <div class="metric-label">Accessibility</div>
        </div>
      </div>
    `;
 
    const modalEl = document.getElementById('universalProjectModal');
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  },
 
  /* =========================================================================
     SERVICES — render katalog layanan dari services.json
     ========================================================================= */
  async loadServices() {
    const container = document.getElementById('servicesGrid');
    try {
      const services = await ApiService.getServices();
      this.state.services = services;
      container.innerHTML = services.map(svc => `
        <div class="col-md-4">
          <div class="card service-card h-100 border-0 shadow-sm text-center p-3">
            <i class="bi ${this.escapeHTML(svc.icon)} service-icon"></i>
            <h5 class="fw-bold mt-2">${this.escapeHTML(svc.name)}</h5>
            <p class="text-brand fw-semibold">${this.escapeHTML(svc.price)}</p>
            <ul class="service-feature-list text-muted small text-start">
              ${svc.features.map(f => `<li>${this.escapeHTML(f)}</li>`).join('')}
            </ul>
          </div>
        </div>
      `).join('');
    } catch (err) {
      container.innerHTML = `<div class="col-12"><div class="alert alert-warning">Gagal memuat katalog layanan.</div></div>`;
    }
  },
 
  /* =========================================================================
     FORM ASINKRON — Decoupled REST Form Dispatch (tanpa full page reload)
     ========================================================================= */
  attachFormListener() {
    const form = document.getElementById('serviceForm');
    if (!form) return;
 
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
 
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }
 
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
 
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Mengirim...`;
 
      try {
        await ApiService.submitServiceOrder(payload);
        this.saveOrderToLocalStorage(payload);
        this.showToast('Sukses!', 'Permintaan layanan berhasil diproses oleh server.', 'success');
        form.reset();
        form.classList.remove('was-validated');
        this.renderOrderBadge();
      } catch (err) {
        this.showToast('Gagal', 'Permintaan tidak dapat dikirim. Periksa koneksi Anda.', 'danger');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
      }
    });
  },
 
  /* =========================================================================
     LOCAL STATE PERSISTENCE — localStorage
     ========================================================================= */
  saveOrderToLocalStorage(payload) {
    const orders = JSON.parse(localStorage.getItem('serviceOrders') || '[]');
    orders.push({ ...payload, submittedAt: new Date().toISOString() });
    localStorage.setItem('serviceOrders', JSON.stringify(orders));
  },
 
  renderOrderBadge() {
    const orders = JSON.parse(localStorage.getItem('serviceOrders') || '[]');
    const badge = document.getElementById('orderBadge');
    if (!badge) return;
    badge.textContent = orders.length;
    badge.classList.toggle('d-none', orders.length === 0);
  },
 
  /* =========================================================================
     TOAST NOTIFICATION — Bootstrap Toast
     ========================================================================= */
  showToast(title, message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toastId = `toast-${Date.now()}`;
    const bgClass = type === 'success' ? 'text-bg-success' : 'text-bg-danger';
 
    container.insertAdjacentHTML('beforeend', `
      <div id="${toastId}" class="toast ${bgClass}" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <strong>${this.escapeHTML(title)}</strong><br>${this.escapeHTML(message)}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    `);
 
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  }
};
 
document.addEventListener('DOMContentLoaded', () => App.init());
 