/**
 * api-service.js
 * ---------------------------------------------------------------------------
 * DATA ACCESS LAYER (Application/API Logic Tier - disimulasikan)
 * Satu-satunya modul yang berkomunikasi langsung dengan sumber data.
 * Presentation Layer (app.js) TIDAK PERNAH memanggil fetch() secara langsung —
 * semua request harus lewat objek ApiService ini. Ini menerapkan prinsip
 * Separation of Concerns: kalau nanti data JSON statis ini diganti dengan
 * REST API sungguhan (mis. Node/Express), hanya file inilah yang perlu diubah.
 * ---------------------------------------------------------------------------
 */
 
const ApiService = (() => {
 
  /**
   * Wrapper generik untuk GET request ke file JSON lokal.
   * Menerapkan defensive error handling sesuai pola di modul praktikum.
   */
  async function getJSON(path) {
    try {
      const response = await fetch(path, { cache: 'no-cache' });
 
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }
 
      return await response.json();
    } catch (err) {
      console.error(`[API Network Error] Gagal memuat ${path}:`, err);
      throw err; // dilempar ulang supaya caller (app.js) bisa menampilkan Error State
    }
  }
 
  async function getProfile() {
    return getJSON('./data/profile.json');
  }
 
  async function getProjects() {
    return getJSON('./data/projects.json');
  }
 
  async function getServices() {
    return getJSON('./data/services.json');
  }
 
  /**
   * Mengirim formulir pemesanan layanan secara asinkron (AJAX/Fetch POST).
   * Endpoint di bawah adalah MOCK REST API publik (jsonplaceholder) karena
   * GitHub Pages adalah static hosting tanpa backend aktif. Endpoint ini akan
   * merespons seolah-olah data diterima server (echo + id baru), sehingga
   * pola request/response asinkronnya identik dengan integrasi backend nyata.
   *
   * Jika proyek ini dihubungkan ke backend sungguhan, cukup ganti nilai
   * MOCK_ENDPOINT di bawah tanpa mengubah kode di app.js.
   */
  const MOCK_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';
 
  async function submitServiceOrder(payload) {
    try {
      const response = await fetch(MOCK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
 
      if (!response.ok) {
        throw new Error(`Gagal mengirim permintaan (HTTP ${response.status})`);
      }
 
      return await response.json();
    } catch (err) {
      console.error('[API Network Error] Gagal submit order:', err);
      throw err;
    }
  }
 
  // Public API dari modul ini
  return {
    getProfile,
    getProjects,
    getServices,
    submitServiceOrder
  };
 
})();
 








